// `dice:` inline code in notes — the syntax of the Dice Roller plugin, so notes work in both: in
// Reading view (a post processor) and Live Preview (an editor extension; the source shows while
// the cursor is in it) a formula becomes a button; a click rolls, plays the dice stage in a small
// window (by the setting) and shows the total beside the button. Nothing is written into the note.
// Inline code that is no formula (Dice Roller's own grammar, tables before R2) stays as it is.

import { RangeSetBuilder } from '@codemirror/state';
import {
  Decoration,
  type DecorationSet,
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
  WidgetType,
} from '@codemirror/view';
import { type App, editorLivePreviewField, Modal, setIcon } from 'obsidian';

import { parseFormula, type Roll, rollFormula } from '../dice/formula';
import type { T } from '../i18n/strings';
import { DiceStage } from './dice-stage';

const PREFIX = /^dice:\s*(.+)$/;

/** The formula of a `dice:` code's text, when it is one we roll. */
export function inlineFormula(code: string): string | null {
  const m = PREFIX.exec(code.trim());
  const formula = m?.[1]?.trim() ?? '';
  return formula !== '' && parseFormula(formula) !== null ? formula : null;
}

export interface InlineDeps {
  app: App;
  t: T;
  random: () => number;
  /** Whether the stage animates; null when it is off. */
  motion: () => boolean | null;
  log: (roll: Roll) => void;
}

/** The stage in a small window over the workspace; a click after the verdict or Esc closes it. */
export class DiceModal extends Modal {
  constructor(
    private readonly deps: InlineDeps,
    private readonly roll: Roll,
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
    );
    void stage.play({ label: this.roll.formula, dc: null, roll: this.roll });
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

/** The button a formula becomes, with the last total beside it. */
export function diceButton(formula: string, deps: InlineDeps): HTMLElement {
  const wrap = createSpan({ cls: 'dnd5e-dice-inline' });
  const button = wrap.createEl('button', {
    cls: 'dnd5e-dice-inline-button',
    attr: { 'aria-label': deps.t('dice.rollFormula', { formula }) },
  });
  setIcon(button.createSpan({ cls: 'dnd5e-dice-inline-icon' }), 'dices');
  button.createSpan({ text: formula });
  const result = wrap.createSpan({ cls: 'dnd5e-dice-inline-result' });
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const f = parseFormula(formula);
    if (f === null) return;
    const roll = rollFormula(f, deps.random);
    result.setText(`= ${roll.total}`);
    result.setAttr('title', roll.text);
    if (deps.motion() !== null) new DiceModal(deps, roll).open();
    deps.log(roll);
  });
  return wrap;
}

/** Reading view: `dice:` code elements become buttons. */
export function replaceInlineDice(el: HTMLElement, deps: InlineDeps): void {
  for (const code of Array.from(el.querySelectorAll('code'))) {
    if (code.parentElement?.tagName === 'PRE') continue;
    const formula = inlineFormula(code.textContent ?? '');
    if (formula !== null) code.replaceWith(diceButton(formula, deps));
  }
}

class DiceWidget extends WidgetType {
  constructor(
    private readonly formula: string,
    private readonly deps: InlineDeps,
  ) {
    super();
  }

  eq(other: DiceWidget): boolean {
    return other.formula === this.formula;
  }

  toDOM(): HTMLElement {
    return diceButton(this.formula, this.deps);
  }

  ignoreEvent(): boolean {
    return true;
  }
}

const INLINE = /`dice:\s*([^`\n]+)`/g;

/** Live Preview: the same buttons, except where the cursor or a selection touches the code. */
export function diceEditorExtension(deps: InlineDeps): ViewPlugin<{ decorations: DecorationSet }> {
  const build = (view: EditorView): DecorationSet => {
    const builder = new RangeSetBuilder<Decoration>();
    if (!view.state.field(editorLivePreviewField)) return builder.finish();
    const selection = view.state.selection.ranges;
    for (const { from, to } of view.visibleRanges) {
      const text = view.state.doc.sliceString(from, to);
      for (const m of text.matchAll(INLINE)) {
        const start = from + m.index;
        const end = start + m[0].length;
        const formula = inlineFormula(`dice: ${m[1] ?? ''}`);
        if (formula === null) continue;
        if (selection.some((r) => r.from <= end && r.to >= start)) continue;
        builder.add(start, end, Decoration.replace({ widget: new DiceWidget(formula, deps) }));
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
