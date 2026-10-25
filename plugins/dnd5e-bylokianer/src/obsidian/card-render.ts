// The faction card's DOM and its edit controls. Every control turns into one line edit; the card
// is rebuilt from the metadata cache afterwards, so it always shows what the note says.

import {
  type App,
  Component,
  debounce,
  Keymap,
  MarkdownRenderer,
  type MarkdownView,
  setIcon,
  type TFile,
} from 'obsidian';

import { type CardField, type CardModel, type CardRow, type CardSection } from '../factions/card';
import { PARTY, UNAFFILIATED } from '../factions/discover';
import type { FactionWorld, RelationField, Warning } from '../factions/model';
import { signed, stepColour, stepName } from '../factions/steps';
import { targetsFor } from '../factions/targets';
import type { T } from '../i18n/strings';
import type { EditOp } from '../yaml/edit';
import { TargetSuggest } from './target-suggest';
import type { ValueChange } from './session-log';
import { editInSource, undoableWrite, writeOp } from './write';

/** What survives a rebuild of the same card: which sections are open. */
export interface CardUiState {
  secretOpen: boolean;
  fieldsOpen: boolean;
}

interface CardContext {
  app: App;
  view: MarkdownView;
  file: TFile;
  card: CardModel;
  world: FactionWorld;
  t: T;
  ui: CardUiState;
  /** The GM's step names from the settings (−5 … +5). */
  stepNames: readonly string[];
  /** Offer to log a change of a relation value. */
  offerLog: (change: ValueChange) => void;
  /** A character's `AC · HP · CR` from its stat block, or null. */
  stats: string | null;
  /** Asks for a rebuild from fresh data (after a refused edit). */
  refresh: () => void;
}

/**
 * Where to focus: a warning of this note (Fix), an entry by field and target (the world view's
 * "Open card"), or the first field.
 */
export type FocusTarget =
  { warning: Warning } | { entry: { field: RelationField; target: string } } | { first: true };

const SLIDER_DELAY = 400;

function scalarText(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? String(value)
    : '';
}

/** A warning row's button: what it says and what it writes. */
interface WarningAction {
  label: string;
  run: () => Promise<boolean>;
}

function warningMatches(a: Warning, b: Warning): boolean {
  return a.code === b.code && a.key === b.key && a.field === b.field && a.path === b.path;
}

export class CardRenderer extends Component {
  constructor(
    private readonly ctx: CardContext,
    readonly el: HTMLElement,
  ) {
    super();
  }

  private get t(): T {
    return this.ctx.t;
  }

  /** "1 warning" / "3 warnings": the `.one` or `.many` string of a key. */
  private count(key: 'card.warnings' | 'card.items', n: number): string {
    return n === 1 ? this.t(`${key}.one`) : this.t(`${key}.many`, { count: n });
  }

  render(): void {
    const { el, ctx } = this;
    el.empty();
    el.addClass('dnd5e-card');
    this.renderHead(el.createDiv({ cls: 'dnd5e-card-head' }));
    this.renderNoteWarnings(el);
    this.renderSection(el, ctx.card.sections.relations, true);
    const secret = ctx.card.sections.secret_relations;
    this.renderCollapsible(
      el,
      `${this.t('card.secret')} · ${secret.rows.length}`,
      ctx.ui.secretOpen,
      (open) => (ctx.ui.secretOpen = open),
      (body) => this.renderSection(body, secret, false),
      'is-secret',
    );
    this.renderCollapsible(
      el,
      `${this.t('card.fields')} · ${ctx.card.fields.length}`,
      ctx.ui.fieldsOpen,
      (open) => (ctx.ui.fieldsOpen = open),
      (body) => this.renderFields(body),
      '',
      ctx.card.fields.map((f) => f.key).join(', '),
    );
  }

  // ── head ───────────────────────────────────────────────────────────────────────────────────

  private renderHead(head: HTMLElement): void {
    const { card } = this.ctx;
    const line = head.createDiv({ cls: 'dnd5e-card-meta' });
    const kind = line.createSpan({ cls: 'dnd5e-card-kind' });
    setIcon(kind.createSpan({ cls: 'dnd5e-card-icon' }), card.kind === 'faction' ? 'flag' : 'user');
    kind.createSpan({ text: this.t(`card.kind.${card.kind}`) });
    if (card.place.length > 0) {
      line.createSpan({
        cls: 'dnd5e-card-place',
        text: card.place.map((p) => this.placeName(p)).join(' › '),
      });
    }
    if (card.warningCount > 0) {
      const badge = line.createEl('button', {
        cls: 'dnd5e-card-badge',
        text: this.count('card.warnings', card.warningCount),
      });
      setIcon(badge.createSpan({ cls: 'dnd5e-card-icon' }), 'alert-triangle');
      badge.addEventListener('click', () => {
        this.el.querySelector('.dnd5e-card-warning')?.scrollIntoView({ block: 'center' });
      });
    }

    const title = head.createDiv({ cls: 'dnd5e-card-title' });
    const name = title.createDiv({ cls: 'dnd5e-card-name', text: card.name });
    const field = card.nameField;
    if (field !== null) {
      name.addClass('is-editable');
      name.setAttr('tabindex', '0');
      name.setAttr('aria-label', this.t('card.edit'));
      const edit = () =>
        this.inlineEdit(
          name,
          field.value ?? '',
          this.t('card.namePlaceholder', { folder: field.placeholder }),
          (value) => {
            if (value === (field.value ?? '')) return null;
            return value === ''
              ? { op: 'remove-scalar', key: 'name', expect: field.expect }
              : { op: 'set-scalar', key: 'name', expect: field.expect, value };
          },
        );
      name.addEventListener('click', edit);
      name.addEventListener('keydown', (e) => e.key === 'Enter' && edit());
    }
    if (card.power !== null) {
      this.renderPower(title, head, card.power);
    }
    if (this.ctx.stats !== null) head.createDiv({ cls: 'dnd5e-card-stats', text: this.ctx.stats });
  }

  private placeName(p: { id: string; name: string }): string {
    if (p.id === PARTY) return this.t('pseudo.party');
    if (p.id === UNAFFILIATED) return this.t('pseudo.unaffiliated');
    return p.name;
  }

  private renderPower(
    parent: HTMLElement,
    warningsParent: HTMLElement,
    power: NonNullable<CardModel['power']>,
  ): void {
    const box = parent.createDiv({ cls: 'dnd5e-card-power', attr: { 'data-focus': 'power' } });
    box.createSpan({ cls: 'dnd5e-card-label', text: this.t('card.power') });
    const pips = box.createDiv({ cls: 'dnd5e-card-pips' });
    for (let i = 1; i <= 5; i++) {
      const pip = pips.createEl('button', {
        cls: i <= power.value ? 'dnd5e-card-pip is-on' : 'dnd5e-card-pip',
        attr: { 'aria-label': `${this.t('card.power')} ${i}` },
      });
      pip.addEventListener('click', () => {
        if (i !== power.expect) {
          void this.write({ op: 'set-scalar', key: 'power', expect: power.expect, value: i });
        }
      });
    }
    box.createSpan({ cls: 'dnd5e-card-number', text: String(power.value) });
    for (const warning of power.warnings) {
      this.renderWarning(warningsParent, warning, {
        label: this.t('card.write', { value: power.value }),
        run: () =>
          this.write({ op: 'set-scalar', key: 'power', expect: power.expect, value: power.value }),
      });
    }
  }

  private renderNoteWarnings(parent: HTMLElement): void {
    const { card } = this.ctx;
    for (const warning of card.noteWarnings) {
      if (warning.code === 'missing-type') {
        this.renderWarning(parent, warning, {
          label: this.t('card.setType'),
          run: () =>
            this.write({
              op: 'set-scalar',
              key: 'type',
              expect: card.fields.find((f) => f.key === 'type')?.expect,
              value: 'faction',
            }),
        });
      } else {
        this.renderWarning(parent, warning);
      }
    }
  }

  // ── relations ──────────────────────────────────────────────────────────────────────────────

  private renderSection(parent: HTMLElement, section: CardSection, withTitle: boolean): void {
    const box = parent.createDiv({
      cls: 'dnd5e-card-section',
      attr: { 'data-field': section.field },
    });
    if (withTitle) {
      box.createDiv({ cls: 'dnd5e-card-section-title', text: this.t('card.relations') });
    }
    for (const warning of section.warnings) {
      this.renderWarning(box, warning);
    }
    if (!section.editable) {
      const note = box.createDiv({ cls: 'dnd5e-card-readonly' });
      note.createSpan({ text: this.t('card.notMap') });
      this.sourceButton(note, section.field);
      return;
    }
    if (section.rows.length === 0) {
      box.createDiv({ cls: 'dnd5e-card-empty', text: this.t('card.noRelations') });
    }
    for (const row of section.rows) {
      this.renderRow(box, row);
    }
    this.addButton(box, this.t('card.add'), (add) => this.addRow(box, add, section.field));
  }

  private renderRow(parent: HTMLElement, row: CardRow): void {
    const el = parent.createDiv({
      cls: 'dnd5e-card-row',
      attr: { 'data-field': row.field, 'data-key': row.rawKey },
    });
    if (row.field === 'secret_relations') el.addClass('is-secret');
    if (row.warnings.length > 0) el.addClass('has-warning');
    const main = el.createDiv({ cls: 'dnd5e-card-row-main' });

    const target = this.renderTarget(main, row);
    this.renderValue(main, el, row);
    const remove = this.iconButton(main, 'x', this.t('card.remove'), 'dnd5e-card-remove');
    remove.setAttr('data-focus', 'remove');
    remove.addEventListener('click', () => {
      void undoableWrite(this.ctx.app, this.ctx.file, this.t, row.key, {
        op: 'remove-entry',
        field: row.field,
        key: row.rawKey,
        expect: row.expect,
      }).then((ok) => (ok ? this.offerLog(row, row.value, null) : this.ctx.refresh()));
    });

    this.renderWhy(el, target, row);

    for (const warning of row.warnings) {
      const { value } = row;
      const adjusted =
        (warning.code === 'value-out-of-range' || warning.code === 'value-not-integer') &&
        value !== null;
      this.renderWarning(
        el,
        warning,
        adjusted
          ? {
              label: this.t('card.write', { value: signed(value) }),
              run: () =>
                this.write({
                  op: 'set-value',
                  field: row.field,
                  key: row.rawKey,
                  expect: row.expect,
                  value,
                }),
            }
          : undefined,
      );
    }
  }

  private renderTarget(main: HTMLElement, row: CardRow): HTMLElement {
    const target = main.createDiv({ cls: 'dnd5e-card-target' });
    const entity = row.targetId === null ? undefined : this.ctx.world.entities.get(row.targetId);
    if (entity?.notePath) {
      const notePath = entity.notePath;
      const link = target.createEl('a', { cls: 'internal-link', text: row.key, href: '#' });
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const file = this.ctx.app.vault.getFileByPath(notePath);
        if (file !== null)
          void this.ctx.app.workspace.getLeaf(Keymap.isModEvent(event)).openFile(file);
      });
    } else {
      target.createSpan({ cls: 'dnd5e-card-target-name', text: row.key });
      if (row.targetId === null) {
        target.createSpan({ cls: 'dnd5e-card-tag', text: this.t('card.unknown') });
      }
    }
    if (row.field === 'secret_relations') {
      target.createSpan({ cls: 'dnd5e-card-tag is-secret', text: this.t('field.secret') });
    }
    const rename = this.iconButton(target, 'pencil', this.t('card.edit'), 'dnd5e-card-rename');
    rename.setAttr('data-focus', 'target');
    rename.addEventListener('click', () => this.renameRow(target, row));
    return target;
  }

  private renderValue(main: HTMLElement, el: HTMLElement, row: CardRow): void {
    const value = main.createDiv({ cls: 'dnd5e-card-value' });
    const slider = value.createEl('input', {
      cls: 'slider dnd5e-card-slider',
      attr: { type: 'range', min: '-5', max: '5', step: '1', 'data-focus': 'value' },
    });
    slider.value = String(row.value ?? 0);
    const chip = value.createSpan({ cls: 'dnd5e-card-chip' });
    const step = value.createSpan({ cls: 'dnd5e-card-step' });
    const show = (v: number | null) => {
      if (v === null) {
        el.addClass('is-unset');
        chip.setText(row.invalid ?? '—');
        step.setText(this.t('card.noValue'));
        return;
      }
      el.removeClass('is-unset');
      el.setCssProps({ '--dnd5e-value-colour': stepColour(v) });
      chip.setText(signed(v));
      step.setText(stepName(v, this.t, this.ctx.stepNames));
    };
    show(row.value);
    if (row.invalid !== null) chip.addClass('is-invalid');
    let expect = row.expect;
    let before = row.value;
    const commit = debounce(
      () => {
        const next = Number(slider.value);
        void this.write({
          op: 'set-value',
          field: row.field,
          key: row.rawKey,
          expect,
          value: next,
        }).then((ok) => {
          if (!ok) return;
          this.offerLog(row, before, next);
          expect = next;
          before = next;
        });
      },
      SLIDER_DELAY,
      true,
    );
    slider.addEventListener('input', () => {
      chip.removeClass('is-invalid');
      show(Number(slider.value));
    });
    slider.addEventListener('change', () => commit());
  }

  private renderWhy(el: HTMLElement, target: HTMLElement, row: CardRow): void {
    const why = el.createDiv({
      cls: row.why === null ? 'dnd5e-card-why is-empty' : 'dnd5e-card-why',
    });
    const whyText = why.createDiv({ cls: 'dnd5e-card-why-text' });
    if (row.why !== null) {
      void MarkdownRenderer.render(this.ctx.app, row.why, whyText, this.ctx.file.path, this);
    }
    // Without a reason, the button to add one sits beside the target, so empty rows stay one line.
    const editWhy = this.iconButton(
      row.why === null ? target : why,
      row.why === null ? 'message-square-plus' : 'pencil',
      this.t('card.why'),
      'dnd5e-card-why-edit',
    );
    editWhy.addEventListener('click', () => {
      why.removeClass('is-empty');
      this.inlineEdit(whyText, row.why ?? '', this.t('card.whyPlaceholder'), (text) =>
        text === (row.why ?? '')
          ? null
          : {
              op: 'set-why',
              field: row.field,
              key: row.rawKey,
              expect: row.whyExpect,
              why: text === '' ? null : text,
            },
      );
    });
  }

  private renameRow(target: HTMLElement, row: CardRow): void {
    this.targetInput(target, row.key, (to) =>
      to === row.key || to === ''
        ? null
        : { op: 'rename-entry', field: row.field, key: row.rawKey, expect: row.expect, to },
    );
  }

  private addRow(box: HTMLElement, add: HTMLElement, field: RelationField): void {
    const row = createDiv({ cls: 'dnd5e-card-row is-new' });
    box.insertBefore(row, add);
    const target = row.createDiv({ cls: 'dnd5e-card-target' });
    this.targetInput(target, '', (key) =>
      key === '' ? null : { op: 'add-entry', field, key, value: 0 },
    );
  }

  /**
   * A target field with suggestions; Enter or a picked suggestion writes, Esc cancels. Leaving the
   * field cancels too, after a moment, so that a click on a suggestion still counts.
   */
  private targetInput(
    parent: HTMLElement,
    initial: string,
    toOp: (value: string) => EditOp | null,
  ): void {
    const { input, finish } = this.inlineEdit(
      parent,
      initial,
      this.t('card.targetPlaceholder'),
      toOp,
      'cancel',
    );
    const targets = targetsFor(this.ctx.world, this.ctx.card.entityId);
    const suggest = new TargetSuggest(this.ctx.app, input, targets, this.t);
    suggest.onSelect((target) => {
      input.value = target.key;
      finish(true);
    });
  }

  // ── other fields ───────────────────────────────────────────────────────────────────────────

  private shortValue(field: CardField): string {
    const { value } = field;
    if (value !== null && typeof value === 'object') {
      return this.count('card.items', Object.keys(value).length);
    }
    return value === null || value === undefined ? '—' : scalarText(value);
  }

  private renderFields(parent: HTMLElement): void {
    const list = parent.createDiv({ cls: 'dnd5e-card-fields' });
    for (const field of this.ctx.card.fields) {
      const row = list.createDiv({ cls: 'dnd5e-card-field', attr: { 'data-key': field.key } });
      row.createSpan({ cls: 'dnd5e-card-field-key', text: field.key });
      const value = row.createDiv({ cls: 'dnd5e-card-field-value' });
      if (Array.isArray(field.value)) {
        for (const item of field.value) {
          value.createSpan({
            cls: 'dnd5e-card-tag',
            text: typeof item === 'string' || typeof item === 'number' ? String(item) : '…',
          });
        }
      } else {
        value.setText(this.shortValue(field));
      }
      if (field.editable && typeof field.value !== 'boolean') {
        value.addClass('is-editable');
        value.addEventListener('click', () =>
          this.inlineEdit(
            value,
            scalarText(field.value),
            this.t('card.valuePlaceholder'),
            (text) => {
              if (text === scalarText(field.value)) return null;
              if (text === '') return { op: 'remove-scalar', key: field.key, expect: field.expect };
              const number =
                typeof field.value === 'number' && /^-?\d+(\.\d+)?$/.test(text)
                  ? Number(text)
                  : null;
              return {
                op: 'set-scalar',
                key: field.key,
                expect: field.expect,
                value: number ?? text,
              };
            },
          ),
        );
      } else {
        this.sourceButton(row, field.key);
      }
    }
    this.addButton(parent, this.t('card.addField'), (add) => this.addField(list, add));
  }

  private addField(list: HTMLElement, add: HTMLElement): void {
    add.hide();
    const row = list.createDiv({ cls: 'dnd5e-card-field is-new' });
    const key = row.createEl('input', {
      cls: 'dnd5e-card-input',
      attr: { type: 'text', placeholder: this.t('card.keyPlaceholder') },
    });
    const value = row.createEl('input', {
      cls: 'dnd5e-card-input',
      attr: { type: 'text', placeholder: this.t('card.valuePlaceholder') },
    });
    const commit = () => {
      const k = key.value.trim();
      const v = value.value.trim();
      if (k === '' || v === '') {
        this.ctx.refresh();
        return;
      }
      void this.write({ op: 'set-scalar', key: k, expect: undefined, value: v });
    };
    for (const input of [key, value]) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.isComposing) commit();
        if (e.key === 'Escape') this.ctx.refresh();
      });
    }
    key.focus();
  }

  // ── building blocks ────────────────────────────────────────────────────────────────────────

  private renderCollapsible(
    parent: HTMLElement,
    title: string,
    open: boolean,
    setOpen: (open: boolean) => void,
    body: (el: HTMLElement) => void,
    cls = '',
    detail = '',
  ): void {
    const box = parent.createDiv({ cls: `dnd5e-card-collapsible ${cls}`.trim() });
    const head = box.createEl('button', {
      cls: 'dnd5e-card-section-title is-toggle',
      attr: { 'aria-expanded': String(open) },
    });
    setIcon(head.createSpan({ cls: 'dnd5e-card-icon' }), open ? 'chevron-down' : 'chevron-right');
    head.createSpan({ text: title });
    if (detail !== '' && !open) {
      head.createSpan({ cls: 'dnd5e-card-section-detail', text: detail });
    }
    const content = box.createDiv({ cls: 'dnd5e-card-collapsible-body' });
    if (open) body(content);
    head.addEventListener('click', () => {
      setOpen(!open);
      this.render();
    });
  }

  private renderWarning(parent: HTMLElement, warning: Warning, action?: WarningAction): void {
    const box = parent.createDiv({ cls: 'dnd5e-card-warning' });
    setIcon(box.createSpan({ cls: 'dnd5e-card-icon' }), 'alert-triangle');
    box.createSpan({ text: this.t(`warning.${warning.code}`, { written: warning.written ?? '' }) });
    if (action !== undefined) {
      const button = box.createEl('button', { cls: 'dnd5e-card-write', text: action.label });
      button.addEventListener('click', () => void action.run());
    }
  }

  private addButton(parent: HTMLElement, label: string, onClick: (button: HTMLElement) => void) {
    const button = parent.createEl('button', { cls: 'dnd5e-card-add' });
    setIcon(button.createSpan({ cls: 'dnd5e-card-icon' }), 'plus');
    button.createSpan({ text: label });
    button.addEventListener('click', () => onClick(button));
  }

  private iconButton(parent: HTMLElement, icon: string, label: string, cls: string): HTMLElement {
    const button = parent.createEl('button', {
      cls: `clickable-icon ${cls}`,
      attr: { 'aria-label': label },
    });
    setIcon(button, icon);
    return button;
  }

  private sourceButton(parent: HTMLElement, key: string): void {
    const button = parent.createEl('button', {
      cls: 'dnd5e-card-source',
      text: this.t('card.editInSource'),
    });
    button.addEventListener('click', () => void editInSource(this.ctx.view, key));
  }

  /** Replaces an element's content with a text field; Enter writes, Esc cancels, blur either. */
  private inlineEdit(
    host: HTMLElement,
    initial: string,
    placeholder: string,
    toOp: (value: string) => EditOp | null,
    onBlur: 'commit' | 'cancel' = 'commit',
  ): { input: HTMLInputElement; finish: (commit: boolean) => void } {
    host.empty();
    const input = host.createEl('input', {
      cls: 'dnd5e-card-input',
      attr: { type: 'text', placeholder },
    });
    input.value = initial;
    let done = false;
    const finish = (commit: boolean) => {
      if (done) return;
      done = true;
      const op = commit ? toOp(input.value.trim()) : null;
      if (op === null) {
        this.ctx.refresh();
        return;
      }
      void this.write(op);
    };
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.isComposing) finish(true);
      if (e.key === 'Escape') finish(false);
    });
    input.addEventListener('blur', () => {
      if (onBlur === 'commit') finish(true);
      else window.setTimeout(() => finish(false), 200);
    });
    input.focus();
    input.select();
    return { input, finish };
  }

  private async write(op: EditOp): Promise<boolean> {
    const ok = await writeOp(this.ctx.app, this.ctx.file, op, this.t);
    if (!ok) this.ctx.refresh();
    if (ok && op.op === 'add-entry') {
      this.ctx.offerLog({
        from: this.ctx.card.name,
        to: op.key,
        before: null,
        after: op.value,
        secret: op.field === 'secret_relations',
      });
    }
    return ok;
  }

  /** Offers to log a row's value change, naming the target as the world knows it. */
  private offerLog(row: CardRow, before: number | null, after: number | null): void {
    const target = row.targetId === null ? undefined : this.ctx.world.entities.get(row.targetId);
    this.ctx.offerLog({
      from: this.ctx.card.name,
      to: target?.name ?? row.key,
      before,
      after,
      secret: row.field === 'secret_relations',
    });
  }

  // ── focus ──────────────────────────────────────────────────────────────────────────────────

  private openSection(field: RelationField): void {
    if (field === 'secret_relations' && !this.ctx.ui.secretOpen) {
      this.ctx.ui.secretOpen = true;
      this.render();
    }
  }

  /** Highlights the first row of a field that matches and focuses one of its controls. */
  private focusRow(
    field: RelationField,
    match: (row: CardRow) => boolean,
    part: 'value' | 'target' | 'remove',
  ): HTMLElement | null {
    const rows = [
      ...this.el.querySelectorAll<HTMLElement>(`.dnd5e-card-row[data-field="${field}"]`),
    ];
    const index = this.ctx.card.sections[field].rows.findIndex(match);
    const row = index === -1 ? undefined : rows[index];
    row?.addClass('is-highlighted');
    const el = row?.querySelector<HTMLElement>(`[data-focus="${part}"]`) ?? row ?? null;
    el?.scrollIntoView({ block: 'center' });
    el?.focus();
    return el;
  }

  /** Opens the section a warning points into and focuses the control that repairs it. */
  focus(target: FocusTarget): void {
    if ('first' in target) {
      this.el.querySelector<HTMLElement>('input, button, [tabindex]')?.focus();
      this.el.scrollIntoView({ block: 'start' });
      return;
    }
    if ('entry' in target) {
      const { field, target: id } = target.entry;
      this.openSection(field);
      // The entry that is used: the first row naming the target (later ones are duplicates).
      this.focusRow(field, (r) => (r.targetId ?? `?${r.key}`) === id, 'value');
      return;
    }
    const { warning } = target;
    if (warning.field !== undefined) this.openSection(warning.field);
    if (warning.code === 'missing-type' && !this.ctx.ui.fieldsOpen) {
      this.ctx.ui.fieldsOpen = true;
      this.render();
    }
    const part =
      warning.code === 'unknown-target' || warning.code === 'ambiguous-key'
        ? 'target'
        : warning.code === 'self-relation' || warning.code === 'duplicate-key'
          ? 'remove'
          : 'value';
    if (warning.field !== undefined) {
      const el = this.focusRow(
        warning.field,
        (r) => r.warnings.some((w) => warningMatches(w, warning)),
        part,
      );
      if (part === 'target' && el?.hasClass('dnd5e-card-rename')) el.click();
      return;
    }
    const el = this.el.querySelector<HTMLElement>(
      warning.key === 'power' ? '[data-focus="power"] button' : '.dnd5e-card-warning button',
    );
    el?.scrollIntoView({ block: 'center' });
    el?.focus();
  }
}
