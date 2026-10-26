// The Dice tab: a formula with Roll, buttons for d4 to d100, normal / advantage / disadvantage for
// the d20, an optional difficulty class, the dice stage, the campaign's rollable tables, and the
// rolls of this Obsidian session with Roll again and Log. Rolls are offered for tonight's session
// log by the dice log setting.

import { ItemView, setIcon, type WorkspaceLeaf } from 'obsidian';

import { parseFormula, type Roll, rollFormula, verdict } from '../dice/formula';
import { type RollTable, rowFor, type TableRow } from '../dice/tables';
import type { StringKey, T } from '../i18n/strings';
import { DiceStage, type RenderText, VERDICT_KEYS } from './dice-stage';
import type { TableSource } from './dice-tables';

export const DICE_VIEW = 'dnd5e-dice';

type Edge = 'normal' | 'adv' | 'dis';

export interface DiceRecord {
  label: string;
  dc: number | null;
  roll: Roll;
  /** For a table roll: the table and the row the total landed on (null for a gap). */
  table?: RollTable;
  row?: TableRow | null;
}

export interface DiceDeps {
  t: T;
  random: () => number;
  /** Whether the stage animates; null when the stage is off. */
  motion: () => boolean | null;
  /** This Obsidian session's rolls, newest first; kept by the plugin across tab reopening. */
  history: DiceRecord[];
  /** Offers a roll for the session log. */
  log: (record: DiceRecord) => void;
  tables: TableSource;
  /** Renders a table row's Markdown (links work). */
  render: RenderText;
}

const QUICK = [4, 6, 8, 10, 12, 20, 100];
const HISTORY = 50;

/** A formula with advantage or disadvantage when it has a single d20, else as written. */
function withEdge(text: string, edge: Edge): ReturnType<typeof parseFormula> {
  if (edge !== 'normal') {
    const f = parseFormula(`${text} ${edge}`);
    if (f !== null) return f;
  }
  return parseFormula(text);
}

export class DiceView extends ItemView {
  private formula = '';
  private dc = '';
  private edge: Edge = 'normal';
  private stage: DiceStage | null = null;
  private historyEl!: HTMLElement;
  private tablesEl!: HTMLElement;
  private inputEl!: HTMLInputElement;

  constructor(
    leaf: WorkspaceLeaf,
    private readonly deps: DiceDeps,
  ) {
    super(leaf);
  }

  getViewType(): string {
    return DICE_VIEW;
  }

  getDisplayText(): string {
    return this.deps.t('dice.title');
  }

  getIcon(): string {
    return 'dices';
  }

  async onOpen(): Promise<void> {
    this.render();
    return Promise.resolve();
  }

  async onClose(): Promise<void> {
    this.contentEl.empty();
    return Promise.resolve();
  }

  private render(): void {
    const { t } = this.deps;
    const root = this.contentEl;
    root.empty();
    root.addClass('dnd5e-dice');

    const form = root.createEl('form', { cls: 'dnd5e-dice-form' });
    this.inputEl = form.createEl('input', {
      cls: 'dnd5e-dice-formula',
      attr: {
        type: 'text',
        placeholder: t('dice.placeholder'),
        'aria-label': t('dice.formula'),
        spellcheck: 'false',
      },
    });
    this.inputEl.value = this.formula;
    this.inputEl.addEventListener('input', () => {
      this.formula = this.inputEl.value;
      this.inputEl.removeClass('is-invalid');
    });
    const dc = form.createEl('input', {
      cls: 'dnd5e-dice-dc',
      attr: {
        type: 'number',
        inputmode: 'numeric',
        min: '1',
        placeholder: t('dice.dcShort'),
        'aria-label': t('dice.dc'),
      },
    });
    dc.value = this.dc;
    dc.addEventListener('input', () => (this.dc = dc.value));
    const go = form.createEl('button', {
      cls: ['mod-cta', 'dnd5e-dice-roll'],
      attr: { type: 'submit' },
    });
    setIcon(go.createSpan(), 'dices');
    go.createSpan({ text: t('dice.roll') });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      void this.rollText(this.formula);
    });

    const bar = root.createDiv({ cls: 'dnd5e-dice-bar' });
    const quick = bar.createDiv({ cls: 'dnd5e-dice-quick' });
    for (const sides of QUICK) {
      const b = quick.createEl('button', { cls: 'dnd5e-dice-die', text: `d${sides}` });
      b.addEventListener('click', () => void this.rollText(`1d${sides}`));
    }
    const edges = bar.createDiv({
      cls: 'dnd5e-world-segmented dnd5e-dice-edge',
      attr: { role: 'group' },
    });
    for (const [edge, key] of [
      ['normal', 'dice.normal'],
      ['adv', 'dice.advantage'],
      ['dis', 'dice.disadvantage'],
    ] as const satisfies readonly (readonly [Edge, StringKey])[]) {
      const b = edges.createEl('button', {
        text: t(key),
        attr: { 'aria-pressed': String(this.edge === edge) },
      });
      b.toggleClass('is-active', this.edge === edge);
      b.dataset.edge = edge;
      b.addEventListener('click', () => {
        this.edge = edge;
        for (const other of Array.from(edges.children)) {
          const on = (other as HTMLElement).dataset.edge === edge;
          other.toggleClass('is-active', on);
          other.setAttribute('aria-pressed', String(on));
        }
      });
    }

    if (this.deps.motion() !== null) {
      this.stage = new DiceStage(
        root,
        t,
        () => this.deps.motion() === true,
        () => {
          const last = this.deps.history[0];
          if (last !== undefined) void this.again(last);
        },
        this.deps.render,
      );
    } else this.stage = null;

    const tablesHead = root.createDiv({ cls: 'dnd5e-dice-section' });
    tablesHead.createSpan({ text: t('dice.tables') });
    const refresh = tablesHead.createEl('button', {
      cls: 'clickable-icon',
      attr: { 'aria-label': t('dice.refresh') },
    });
    setIcon(refresh, 'refresh-cw');
    refresh.addEventListener('click', () => void this.loadTables());
    this.tablesEl = root.createDiv({ cls: 'dnd5e-dice-tables' });
    void this.loadTables();

    root.createDiv({ cls: 'dnd5e-dice-section', text: t('dice.history') });
    this.historyEl = root.createDiv({ cls: 'dnd5e-dice-history' });
    this.renderHistory();
  }

  /** The campaign's table notes, each with its rollable headings as buttons. */
  async loadTables(): Promise<void> {
    const { t } = this.deps;
    const notes = await this.deps.tables.notes();
    const el = this.tablesEl;
    el.empty();
    if (notes.length === 0) {
      el.createDiv({ cls: 'dnd5e-dice-empty', text: t('dice.noTables') });
      return;
    }
    for (const note of notes) {
      const group = el.createDiv({ cls: 'dnd5e-dice-table-note' });
      group.createDiv({ cls: 'dnd5e-dice-table-title', text: note.title });
      const buttons = group.createDiv({ cls: 'dnd5e-dice-table-buttons' });
      for (const table of note.tables) {
        const b = buttons.createEl('button', { cls: 'dnd5e-dice-table', text: table.heading });
        b.addEventListener('click', () => void this.rollTable(table));
      }
    }
  }

  /** Rolls a table's die and shows the row it lands on. */
  async rollTable(table: RollTable): Promise<void> {
    const f = parseFormula(table.formula);
    if (f === null) return;
    const roll = rollFormula(f, this.deps.random);
    const row = rowFor(table, roll.total);
    await this.record({ label: table.heading, dc: null, roll, table, row });
  }

  private again(record: DiceRecord): Promise<unknown> {
    return record.table !== undefined
      ? this.rollTable(record.table)
      : this.rollText(record.roll.formula, record.label, record.dc);
  }

  private async record(record: DiceRecord): Promise<void> {
    if (this.stage !== null) {
      await this.stage.play({
        ...record,
        ...(record.table !== undefined ? { result: record.row?.text ?? null } : {}),
      });
    }
    this.deps.history.unshift(record);
    this.deps.history.splice(HISTORY);
    this.renderHistory();
    this.deps.log(record);
  }

  /** Rolls a formula (with the chosen edge); false when it is none. */
  async rollText(text: string, label?: string, dc?: number | null): Promise<boolean> {
    const f = withEdge(text, this.edge);
    if (f === null) {
      this.inputEl.addClass('is-invalid');
      return false;
    }
    const roll = rollFormula(f, this.deps.random);
    const n = Math.floor(Number(this.dc));
    await this.record({
      label: label ?? roll.formula,
      dc: dc !== undefined ? dc : this.dc.trim() !== '' && Number.isFinite(n) && n > 0 ? n : null,
      roll,
    });
    return true;
  }

  private renderHistory(): void {
    const { t } = this.deps;
    const list = this.historyEl;
    list.empty();
    if (this.deps.history.length === 0) {
      list.createDiv({ cls: 'dnd5e-dice-empty', text: t('dice.noRolls') });
      return;
    }
    for (const record of this.deps.history) {
      const row = list.createDiv({ cls: 'dnd5e-dice-row' });
      row.createDiv({ cls: 'dnd5e-dice-total', text: String(record.roll.total) });
      const main = row.createDiv({ cls: 'dnd5e-dice-main' });
      main.createDiv({ cls: 'dnd5e-dice-label', text: record.label });
      if (record.table !== undefined) {
        const result = main.createDiv({ cls: 'dnd5e-dice-result' });
        if (record.row === null || record.row === undefined) result.setText(t('dice.noRow'));
        else this.deps.render(record.row.text, result);
      }
      main.createDiv({ cls: 'dnd5e-dice-text', text: record.roll.text });
      const v = verdict(record.roll, record.dc);
      if (v !== null) {
        main.createDiv({
          cls: ['dnd5e-dice-verdict', v.endsWith('success') ? 'is-success' : 'is-failure'],
          text:
            (record.dc === null ? '' : `${t('dice.dcShort')} ${record.dc} · `) + t(VERDICT_KEYS[v]),
        });
      }
      const again = row.createEl('button', {
        cls: ['clickable-icon', 'dnd5e-dice-again'],
        attr: { 'aria-label': t('dice.again') },
      });
      setIcon(again, 'rotate-ccw');
      again.addEventListener('click', () => void this.again(record));
      const log = row.createEl('button', {
        cls: ['clickable-icon', 'dnd5e-dice-log'],
        attr: { 'aria-label': t('dice.log') },
      });
      setIcon(log, 'scroll-text');
      log.addEventListener('click', () => this.deps.log({ ...record }));
    }
  }
}
