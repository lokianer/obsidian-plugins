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
import type { StringKey, T } from '../i18n/strings';
import type { EditOp } from '../yaml/edit';
import { TargetSuggest } from './target-suggest';
import { editInSource, undoableWrite, writeOp } from './write';

/** What survives a rebuild of the same card: which sections are open. */
export interface CardUiState {
  secretOpen: boolean;
  fieldsOpen: boolean;
}

export interface CardContext {
  app: App;
  view: MarkdownView;
  file: TFile;
  card: CardModel;
  world: FactionWorld;
  t: T;
  ui: CardUiState;
  /** Asks for a rebuild from fresh data (after a refused edit). */
  refresh: () => void;
}

/** Where Fix points: a warning of this note, or the first field. */
export type FocusTarget = { warning: Warning } | { first: true };

const SLIDER_DELAY = 400;

function scalarText(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? String(value)
    : '';
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
        text:
          card.warningCount === 1
            ? this.t('card.warnings.one')
            : this.t('card.warnings.many', { count: card.warningCount }),
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
      this.renderPower(title, card.power);
    }
  }

  private placeName(p: { id: string; name: string }): string {
    if (p.id === PARTY) return this.t('pseudo.party');
    if (p.id === UNAFFILIATED) return this.t('pseudo.unaffiliated');
    return p.name;
  }

  private renderPower(parent: HTMLElement, power: NonNullable<CardModel['power']>): void {
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
      this.renderWarning(
        parent,
        warning,
        () =>
          this.write({ op: 'set-scalar', key: 'power', expect: power.expect, value: power.value }),
        power.value,
      );
    }
  }

  private renderNoteWarnings(parent: HTMLElement): void {
    const { card } = this.ctx;
    for (const warning of card.noteWarnings) {
      if (warning.code === 'missing-type') {
        this.renderWarning(
          parent,
          warning,
          () =>
            this.write({
              op: 'set-scalar',
              key: 'type',
              expect: card.fields.find((f) => f.key === 'type')?.expect,
              value: 'faction',
            }),
          undefined,
          this.t('card.setType'),
        );
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
    const add = box.createEl('button', { cls: 'dnd5e-card-add' });
    setIcon(add.createSpan({ cls: 'dnd5e-card-icon' }), 'plus');
    add.createSpan({ text: this.t('card.add') });
    add.addEventListener('click', () => this.addRow(box, add, section.field));
  }

  private renderRow(parent: HTMLElement, row: CardRow): void {
    const el = parent.createDiv({
      cls: 'dnd5e-card-row',
      attr: { 'data-field': row.field, 'data-key': row.rawKey },
    });
    if (row.field === 'secret_relations') el.addClass('is-secret');
    if (row.warnings.length > 0) el.addClass('has-warning');
    const main = el.createDiv({ cls: 'dnd5e-card-row-main' });

    // Target.
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

    // Value.
    const value = main.createDiv({ cls: 'dnd5e-card-value' });
    const slider = value.createEl('input', {
      cls: 'dnd5e-card-slider',
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
      step.setText(stepName(v, this.t));
    };
    show(row.value);
    if (row.invalid !== null) chip.addClass('is-invalid');
    let expect = row.expect;
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
          if (ok) expect = next;
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

    const remove = this.iconButton(main, 'x', this.t('card.remove'), 'dnd5e-card-remove');
    remove.setAttr('data-focus', 'remove');
    remove.addEventListener('click', () => {
      void undoableWrite(this.ctx.app, this.ctx.file, this.t, row.key, {
        op: 'remove-entry',
        field: row.field,
        key: row.rawKey,
        expect: row.expect,
      }).then((ok) => !ok && this.ctx.refresh());
    });

    // Why.
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

    for (const warning of row.warnings) {
      const adjusted =
        (warning.code === 'value-out-of-range' || warning.code === 'value-not-integer') &&
        row.value !== null;
      this.renderWarning(
        el,
        warning,
        adjusted
          ? () =>
              this.write({
                op: 'set-value',
                field: row.field,
                key: row.rawKey,
                expect: row.expect,
                value: row.value ?? 0,
              })
          : undefined,
        row.value ?? undefined,
      );
    }
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

  /** A target field with suggestions; Enter or a picked suggestion writes, Esc cancels. */
  private targetInput(
    parent: HTMLElement,
    initial: string,
    toOp: (value: string) => EditOp | null,
  ): void {
    parent.empty();
    const input = parent.createEl('input', {
      cls: 'dnd5e-card-input',
      attr: { type: 'text', placeholder: this.t('card.targetPlaceholder') },
    });
    input.value = initial;
    let done = false;
    const finish = (commit: boolean) => {
      if (done) return;
      done = true;
      suggest.close();
      const op = commit ? toOp(input.value.trim()) : null;
      if (op === null) {
        this.ctx.refresh();
        return;
      }
      void this.write(op);
    };
    const suggest = new TargetSuggest(
      this.ctx.app,
      input,
      targetsFor(this.ctx.world, this.ctx.card.entityId),
      this.t,
    );
    suggest.onSelect((target) => {
      input.value = target.key;
      finish(true);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.isComposing) finish(true);
      if (e.key === 'Escape') finish(false);
    });
    input.addEventListener('blur', () => window.setTimeout(() => finish(false), 200));
    input.focus();
  }

  // ── other fields ───────────────────────────────────────────────────────────────────────────

  private shortValue(field: CardField): string {
    const { value } = field;
    if (Array.isArray(value)) {
      return value.length === 1
        ? this.t('card.items.one')
        : this.t('card.items.many', { count: value.length });
    }
    if (value !== null && typeof value === 'object') {
      const n = Object.keys(value).length;
      return n === 1 ? this.t('card.items.one') : this.t('card.items.many', { count: n });
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
    const add = parent.createEl('button', { cls: 'dnd5e-card-add' });
    setIcon(add.createSpan({ cls: 'dnd5e-card-icon' }), 'plus');
    add.createSpan({ text: this.t('card.addField') });
    add.addEventListener('click', () => this.addField(list, add));
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

  private renderWarning(
    parent: HTMLElement,
    warning: Warning,
    fix?: () => Promise<boolean>,
    value?: number,
    label?: string,
  ): void {
    const box = parent.createDiv({ cls: 'dnd5e-card-warning' });
    setIcon(box.createSpan({ cls: 'dnd5e-card-icon' }), 'alert-triangle');
    box.createSpan({
      text: this.t(`warning.${warning.code}` as StringKey, { written: warning.written ?? '' }),
    });
    if (fix !== undefined) {
      const button = box.createEl('button', {
        cls: 'dnd5e-card-write',
        text: label ?? this.t('card.write', { value: value === undefined ? '' : signed(value) }),
      });
      button.addEventListener('click', () => void fix());
    }
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

  /** Replaces an element's content with a text field; Enter or blur writes, Esc cancels. */
  private inlineEdit(
    host: HTMLElement,
    initial: string,
    placeholder: string,
    toOp: (value: string) => EditOp | null,
  ): void {
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
    input.addEventListener('blur', () => finish(true));
    input.focus();
    input.select();
  }

  private async write(op: EditOp): Promise<boolean> {
    const ok = await writeOp(this.ctx.app, this.ctx.file, op, this.t);
    if (!ok) this.ctx.refresh();
    return ok;
  }

  // ── focus ──────────────────────────────────────────────────────────────────────────────────

  /** Opens the section a warning points into and focuses the control that repairs it. */
  focus(target: FocusTarget): void {
    if ('first' in target) {
      this.el.querySelector<HTMLElement>('input, button, [tabindex]')?.focus();
      this.el.scrollIntoView({ block: 'start' });
      return;
    }
    const { warning } = target;
    if (warning.field === 'secret_relations' && !this.ctx.ui.secretOpen) {
      this.ctx.ui.secretOpen = true;
      this.render();
    }
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
    let el: HTMLElement | null = null;
    if (warning.key === 'power') {
      el = this.el.querySelector('[data-focus="power"] button');
    } else if (warning.field !== undefined) {
      const rows = [
        ...this.el.querySelectorAll<HTMLElement>(`.dnd5e-card-row[data-field="${warning.field}"]`),
      ];
      const index = this.ctx.card.sections[warning.field].rows.findIndex((r) =>
        r.warnings.some((w) => warningMatches(w, warning)),
      );
      const row = index === -1 ? undefined : rows[index];
      el = row?.querySelector<HTMLElement>(`[data-focus="${part}"]`) ?? row ?? null;
      row?.addClass('is-highlighted');
    } else {
      el = this.el.querySelector('.dnd5e-card-warning button');
    }
    el?.scrollIntoView({ block: 'center' });
    el?.focus();
    if (part === 'target' && el?.hasClass('dnd5e-card-rename')) el.click();
  }
}
