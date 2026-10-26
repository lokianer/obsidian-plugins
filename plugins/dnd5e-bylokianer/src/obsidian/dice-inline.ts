// `dice:` inline code in notes — the syntax of the Dice Roller plugin, so notes work in both: in
// Reading view (a post processor) and Live Preview (an editor extension; the source shows while
// the cursor is in it) a formula, or a link to a rollable table (`dice: [[Street Rumours#Night on
// Lantern Quay (d20)]]`), becomes a button; a click rolls, plays the dice stage in a small window
// (by the setting) and shows the result beside the button. Nothing is written into the note.
// Inline code that is neither (Dice Roller's own grammar, block references) stays as it is.

import { RangeSetBuilder } from '@codemirror/state';
import {
  Decoration,
  type DecorationSet,
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
  WidgetType,
} from '@codemirror/view';
import {
  type App,
  editorInfoField,
  editorLivePreviewField,
  Modal,
  Notice,
  setIcon,
} from 'obsidian';

import { parseFormula, rollFormula } from '../dice/formula';
import { type RollTable, rowFor } from '../dice/tables';
import type { T } from '../i18n/strings';
import { DiceStage, type RenderText, type StageRoll } from './dice-stage';
import type { DiceRecord } from './dice-view';

const PREFIX = /^dice:\s*(.+)$/;
const LINK = /^\[\[([^\]|^]+)(?:\|[^\]]*)?\]\]$/;

/** What a `dice:` code asks for: a formula, or the table a link names. */
type DiceRequest = { kind: 'formula'; formula: string } | { kind: 'table'; link: string };

/** The request in a `dice:` code's text, when it is one we roll. */
function inlineRequest(code: string): DiceRequest | null {
  const text = PREFIX.exec(code.trim())?.[1]?.trim() ?? '';
  const link = LINK.exec(text)?.[1]?.trim();
  if (link !== undefined && link !== '') return { kind: 'table', link };
  return text !== '' && parseFormula(text) !== null ? { kind: 'formula', formula: text } : null;
}

export interface InlineDeps {
  app: App;
  t: T;
  random: () => number;
  /** Whether the stage animates; null when it is off. */
  motion: () => boolean | null;
  log: (record: DiceRecord) => void;
  /** The table a link names, from the note it is written in. */
  table: (link: string, from: string) => Promise<RollTable | null>;
  render: RenderText;
}

/** The stage in a small window over the workspace; a click after the verdict or Esc closes it. */
export class DiceModal extends Modal {
  constructor(
    private readonly deps: InlineDeps,
    private readonly roll: StageRoll,
  ) {
    super(deps.app);
  }

  onOpen(): void {
    this.modalEl.addClass('dnd5e-dice-modal');
    const stage = new DiceStage(
      this.contentEl,
      this.deps.t,
      () => this.deps.motion() === true,
      () => this.close(),
      this.deps.render,
    );
    void stage.play(this.roll);
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

/** What the button shows: the formula, or the link's heading (else its note). */
const caption = (r: DiceRequest): string =>
  r.kind === 'formula' ? r.formula : (r.link.split('#')[1] ?? r.link).trim();

/** The button a request becomes, with the last result beside it. */
function diceButton(request: DiceRequest, source: string, deps: InlineDeps): HTMLElement {
  const wrap = createSpan({ cls: 'dnd5e-dice-inline' });
  const text = caption(request);
  const button = wrap.createEl('button', {
    cls: 'dnd5e-dice-inline-button',
    attr: { 'aria-label': deps.t('dice.rollFormula', { formula: text }) },
  });
  setIcon(
    button.createSpan({ cls: 'dnd5e-dice-inline-icon' }),
    request.kind === 'table' ? 'table' : 'dices',
  );
  button.createSpan({ text });
  const result = wrap.createSpan({ cls: 'dnd5e-dice-inline-result' });
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    void (async () => {
      const record = await rollRequest(request, source, deps);
      if (record === null) {
        new Notice(deps.t('dice.noTable', { link: text }));
        return;
      }
      result.empty();
      result.setAttr('title', record.roll.text);
      if (record.table === undefined) result.setText(`= ${record.roll.total}`);
      else {
        result.appendText(`${record.roll.total} → `);
        const row = result.createSpan();
        if (record.row == null) row.setText(deps.t('dice.noRow'));
        else deps.render(record.row.text, row);
      }
      if (deps.motion() !== null) {
        const stage: StageRoll = { label: record.label, dc: null, roll: record.roll };
        if (record.table !== undefined) stage.result = record.row?.text ?? null;
        new DiceModal(deps, stage).open();
      }
      deps.log(record);
    })();
  });
  return wrap;
}

/** Rolls a request; null when its link names no rollable table. */
async function rollRequest(
  request: DiceRequest,
  source: string,
  deps: InlineDeps,
): Promise<DiceRecord | null> {
  if (request.kind === 'formula') {
    const f = parseFormula(request.formula);
    if (f === null) return null;
    const roll = rollFormula(f, deps.random);
    return { label: roll.formula, dc: null, roll };
  }
  const table = await deps.table(request.link, source);
  const f = table === null ? null : parseFormula(table.formula);
  if (table === null || f === null) return null;
  const roll = rollFormula(f, deps.random);
  return { label: table.heading, dc: null, roll, table, row: rowFor(table, roll.total) };
}

/** Reading view: `dice:` code elements become buttons. */
export function replaceInlineDice(el: HTMLElement, source: string, deps: InlineDeps): void {
  for (const code of Array.from(el.querySelectorAll('code'))) {
    if (code.parentElement?.tagName === 'PRE') continue;
    const request = inlineRequest(code.textContent ?? '');
    if (request !== null) code.replaceWith(diceButton(request, source, deps));
  }
}

class DiceWidget extends WidgetType {
  constructor(
    private readonly code: string,
    private readonly request: DiceRequest,
    private readonly source: string,
    private readonly deps: InlineDeps,
  ) {
    super();
  }

  eq(other: DiceWidget): boolean {
    return other.code === this.code && other.source === this.source;
  }

  toDOM(): HTMLElement {
    return diceButton(this.request, this.source, this.deps);
  }

  ignoreEvent(): boolean {
    return true;
  }
}

const INLINE = /`(dice:\s*[^`\n]+)`/g;

/** Live Preview: the same buttons, except where the cursor or a selection touches the code. */
export function diceEditorExtension(deps: InlineDeps): ViewPlugin<{ decorations: DecorationSet }> {
  const build = (view: EditorView): DecorationSet => {
    const builder = new RangeSetBuilder<Decoration>();
    if (!view.state.field(editorLivePreviewField)) return builder.finish();
    const source = view.state.field(editorInfoField)?.file?.path ?? '';
    const selection = view.state.selection.ranges;
    for (const { from, to } of view.visibleRanges) {
      const text = view.state.doc.sliceString(from, to);
      for (const m of text.matchAll(INLINE)) {
        const start = from + m.index;
        const end = start + m[0].length;
        const code = m[1] ?? '';
        const request = inlineRequest(code);
        if (request === null) continue;
        if (selection.some((r) => r.from <= end && r.to >= start)) continue;
        builder.add(
          start,
          end,
          Decoration.replace({ widget: new DiceWidget(code, request, source, deps) }),
        );
      }
    }
    return builder.finish();
  };
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = build(view);
      }
      update(update: ViewUpdate): void {
        if (update.docChanged || update.viewportChanged || update.selectionSet) {
          this.decorations = build(update.view);
        }
      }
    },
    { decorations: (v) => v.decorations },
  );
}
