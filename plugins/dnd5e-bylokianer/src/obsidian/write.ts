// The adapter's write side: one line edit per call, through vault.process, with a notice when it
// is refused. Nothing is written on a refusal.

import { type App, type MarkdownView, Notice, type TFile } from 'obsidian';

import type { StringKey, T } from '../i18n/strings';
import { applyOp, type EditOp, type Refusal } from '../yaml/edit';
import { frontmatterRange, splitLines, topLevelKeys } from '../yaml/lines';

const UNDO_TIME = 5000;

function explain(refusal: Refusal, t: T): string {
  if (refusal.code === 'unsupported') {
    return t(`refusal.${refusal.reason ?? 'nested'}` as StringKey);
  }
  return t(`refusal.${refusal.code}` as StringKey);
}

function notifyRefusal(refusal: Refusal, op: EditOp, t: T): void {
  new Notice(
    refusal.code === 'changed'
      ? t('notice.changed')
      : t('notice.refused', { key: op.key, reason: explain(refusal, t) }),
  );
}

/** Applies one operation to the file; returns the texts before and after, or null if refused. */
async function apply(
  app: App,
  file: TFile,
  op: EditOp,
  t: T,
): Promise<{ before: string; after: string } | null> {
  // Checked on the cached text first, so a refused edit does not touch the file at all.
  const first = applyOp(await app.vault.read(file), op);
  if (!first.ok) {
    notifyRefusal(first.refusal, op, t);
    return null;
  }
  let refusal: Refusal | null = null;
  let before = '';
  let after = '';
  await app.vault.process(file, (text) => {
    const result = applyOp(text, op);
    if (!result.ok) {
      refusal = result.refusal;
      return text;
    }
    before = text;
    after = result.text;
    return result.text;
  });
  if (refusal !== null) {
    notifyRefusal(refusal, op, t);
    return null;
  }
  return { before, after };
}

export async function writeOp(app: App, file: TFile, op: EditOp, t: T): Promise<boolean> {
  return (await apply(app, file, op, t)) !== null;
}

/** Like writeOp, with a notice that can put the note back exactly as it was for a few seconds. */
export async function undoableWrite(
  app: App,
  file: TFile,
  t: T,
  label: string,
  op: EditOp,
): Promise<boolean> {
  const done = await apply(app, file, op, t);
  if (done === null) {
    return false;
  }
  const fragment = createFragment();
  fragment.createSpan({ text: `${t('notice.removed', { key: label })} · ` });
  const undo = fragment.createEl('a', { text: t('notice.undo'), href: '#' });
  const notice = new Notice(fragment, UNDO_TIME);
  undo.addEventListener('click', (event) => {
    event.preventDefault();
    notice.hide();
    let failed = false;
    void app.vault
      .process(file, (text) => {
        if (text !== done.after) {
          failed = true;
          return text;
        }
        return done.before;
      })
      .then(() => failed && new Notice(t('notice.undoFailed')));
  });
  return true;
}

/** Switches the view to source mode with the cursor on a top-level key's line. */
export async function editInSource(view: MarkdownView, key: string): Promise<void> {
  const state = view.getState();
  await view.setState({ ...state, mode: 'source', source: true }, { history: false });
  const lines = splitLines(view.editor.getValue()).lines;
  const range = frontmatterRange(lines);
  const line =
    range === null ? 0 : (topLevelKeys(lines, range).find((k) => k.key === key)?.line ?? 0);
  view.editor.setCursor({ line, ch: 0 });
  view.editor.focus();
}
