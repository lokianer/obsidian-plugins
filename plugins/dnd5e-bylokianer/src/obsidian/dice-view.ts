// The Dice tab: a formula with Roll, buttons for d4 to d100, normal / advantage / disadvantage for
// the d20, an optional difficulty class, the dice stage, and the rolls of this Obsidian session
// with Roll again and Log. Rolls are offered for tonight's session log by the dice log setting.

import { ItemView, setIcon, type WorkspaceLeaf } from 'obsidian';

import { parseFormula, type Roll, rollFormula, verdict } from '../dice/formula';
import type { StringKey, T } from '../i18n/strings';
import { DiceStage, VERDICT_KEYS } from './dice-stage';

export const DICE_VIEW = 'dnd5e-dice';

type Edge = 'normal' | 'adv' | 'dis';

export interface DiceRecord {
  label: string;
  dc: number | null;
  roll: Roll;
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
          if (last !== undefined) void this.rollText(last.roll.formula, last.label, last.dc);
        },
      );
    } else this.stage = null;

    root.createDiv({ cls: 'dnd5e-dice-section', text: t('dice.history') });
    this.historyEl = root.createDiv({ cls: 'dnd5e-dice-history' });
    this.renderHistory();
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
    const record: DiceRecord = {
      label: label ?? roll.formula,
      dc: dc !== undefined ? dc : this.dc.trim() !== '' && Number.isFinite(n) && n > 0 ? n : null,
      roll,
    };
    if (this.stage !== null) await this.stage.play(record);
    this.deps.history.unshift(record);
    this.deps.history.splice(HISTORY);
    this.renderHistory();
    this.deps.log(record);
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
      again.addEventListener(
        'click',
        () => void this.rollText(record.roll.formula, record.label, record.dc),
      );
      const log = row.createEl('button', {
        cls: ['clickable-icon', 'dnd5e-dice-log'],
        attr: { 'aria-label': t('dice.log') },
      });
      setIcon(log, 'scroll-text');
      log.addEventListener('click', () => this.deps.log({ ...record }));
    }
  }
}
