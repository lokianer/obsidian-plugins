// Line edits on a note's frontmatter: each operation changes the few lines it names and nothing
// else, or refuses. Every operation that changes an existing value carries `expect`, the value the
// caller last saw; when the note says something else now, the edit is refused as `changed`.

import {
  type Entry,
  type FieldBlock,
  fieldBlock,
  frontmatterRange,
  joinLines,
  type KeyLine,
  type Lines,
  type Range,
  splitLines,
  tokenProblem,
  tokenText,
  topLevelKeys,
  type Unsupported,
} from './lines';
import { formatKey, formatNumber, formatString, formatStringLike } from './scalar';

/** What the caller last saw; null or undefined mean "no value". */
export type Expect = string | number | boolean | null | undefined;

export type EditOp =
  | { op: 'set-value'; field: string; key: string; expect: Expect; value: number }
  | { op: 'set-why'; field: string; key: string; expect: Expect; why: string | null }
  | { op: 'add-entry'; field: string; key: string; value: number }
  | { op: 'remove-entry'; field: string; key: string; expect: Expect }
  | { op: 'rename-entry'; field: string; key: string; expect: Expect; to: string }
  | { op: 'set-scalar'; key: string; expect: Expect; value: string | number }
  | { op: 'remove-scalar'; key: string; expect: Expect };

type Op<K extends EditOp['op']> = Extract<EditOp, { op: K }>;

export interface Refusal {
  code: 'not-found' | 'changed' | 'exists' | 'unsupported';
  reason?: Unsupported;
}

type Refused = { ok: false; refusal: Refusal };
type EditResult = { ok: true; text: string } | Refused;
type Block = Extract<FieldBlock, { kind: 'block' }>;

const refuse = (code: Refusal['code'], reason?: Unsupported): Refused => ({
  ok: false,
  refusal: reason === undefined ? { code } : { code, reason },
});

const done = (L: Lines): EditResult => ({ ok: true, text: joinLines(L) });

/** Whether a token still says what the caller saw; numbers compare by value (`+7` is 7). */
function matches(token: string, expect: Expect): boolean {
  const text = tokenText(token);
  if (expect === null || expect === undefined) {
    return text === '';
  }
  if (typeof expect === 'number') {
    return text.trim() !== '' && Number(text) === expect;
  }
  return text === String(expect);
}

/** The line with a new value token in place of the old one; key and comment untouched. */
function withToken(line: string, parsed: KeyLine, token: string): string {
  return `${line.slice(0, parsed.keyEnd + 1)} ${token}${parsed.comment}`;
}

/** Where a new top-level key goes: before `tags:`, else at the end of the frontmatter. */
function insertionLine(lines: readonly string[], range: Range): number {
  return topLevelKeys(lines, range).find((k) => k.key === 'tags')?.line ?? range.close;
}

/** The range, creating an empty frontmatter block at the top when the note has none. */
function ensureRange(L: Lines): Range {
  const range = frontmatterRange(L.lines);
  if (range !== null) {
    return range;
  }
  L.lines.unshift('---', '---');
  return { open: 0, close: 1 };
}

function findEntry(L: Lines, field: string, key: string): { block: Block; entry: Entry } | Refused {
  const range = frontmatterRange(L.lines);
  const block = range === null ? null : fieldBlock(L.lines, range, field);
  if (block?.kind === 'unsupported') {
    return refuse('unsupported', block.reason);
  }
  const entry = block?.kind === 'block' ? block.entries.find((e) => e.rawKey === key) : undefined;
  return block?.kind === 'block' && entry !== undefined ? { block, entry } : refuse('not-found');
}

/** The entry, provided it is editable and still holds the value the caller saw. */
function findEditable(
  L: Lines,
  op: { field: string; key: string; expect: Expect },
  token: (entry: Entry) => string = valueToken,
): { block: Block; entry: Entry } | Refused {
  const found = findEntry(L, op.field, op.key);
  if ('ok' in found) return found;
  if (found.entry.unsupported !== undefined) {
    return refuse('unsupported', found.entry.unsupported);
  }
  return matches(token(found.entry), op.expect) ? found : refuse('changed');
}

/** The token that holds an entry's value: its own line, or its `value:` line. */
function valueToken(entry: Entry): string {
  return entry.form === 'plain' ? entry.parsed.token : (entry.value?.parsed.token ?? '');
}

/** Indent for a new `value:` / `why:` line: the entry's own children, else one level deeper. */
function childPad(block: Block, entry: Entry): string {
  return ' '.repeat(entry.childIndent ?? entry.parsed.indent + (block.indent ?? 2));
}

function setValue(L: Lines, op: Op<'set-value'>): EditResult {
  const found = findEditable(L, op);
  if ('ok' in found) return found;
  const { block, entry } = found;
  const target = entry.form === 'plain' ? { line: entry.line, parsed: entry.parsed } : entry.value;
  if (target === undefined) {
    L.lines.splice(entry.line + 1, 0, `${childPad(block, entry)}value: ${formatNumber(op.value)}`);
  } else {
    const token = formatNumber(op.value, target.parsed.quote);
    L.lines[target.line] = withToken(L.lines[target.line] ?? '', target.parsed, token);
  }
  return done(L);
}

function setWhy(L: Lines, op: Op<'set-why'>): EditResult {
  const found = findEditable(L, op, (entry) => entry.why?.parsed.token ?? '');
  if ('ok' in found) return found;
  const { block, entry } = found;
  const { why } = entry;
  if (op.why === null || op.why === '') {
    if (why !== undefined) L.lines.splice(why.line, 1);
    return done(L);
  }
  if (why !== undefined) {
    const token = formatStringLike(op.why, why.parsed.quote);
    L.lines[why.line] = withToken(L.lines[why.line] ?? '', why.parsed, token);
    return done(L);
  }
  const pad = childPad(block, entry);
  const whyLine = `${pad}why: ${formatString(op.why)}`;
  if (entry.form === 'structured') {
    L.lines.splice((entry.value?.line ?? entry.line) + 1, 0, whyLine);
    return done(L);
  }
  // A plain entry becomes the structured form: the key keeps its line and comment.
  const { parsed } = entry;
  const head = (L.lines[entry.line] ?? '').slice(0, parsed.keyEnd + 1);
  const value = parsed.token === '' ? [] : [`${pad}value: ${parsed.token}`];
  L.lines.splice(entry.line, 1, `${head}${parsed.comment}`, ...value, whyLine);
  return done(L);
}

function addEntry(L: Lines, op: Op<'add-entry'>): EditResult {
  const range = ensureRange(L);
  const block = fieldBlock(L.lines, range, op.field);
  const entryLine = (indent: number) =>
    `${' '.repeat(indent)}${formatKey(op.key)}: ${formatNumber(op.value)}`;
  switch (block.kind) {
    case 'unsupported':
      return refuse('unsupported', block.reason);
    case 'none':
      L.lines.splice(insertionLine(L.lines, range), 0, `${op.field}:`, entryLine(2));
      return done(L);
    case 'empty-flow': {
      const { line, parsed } = block.key;
      L.lines[line] = `${(L.lines[line] ?? '').slice(0, parsed.keyEnd + 1)}${parsed.comment}`;
      L.lines.splice(line + 1, 0, entryLine(2));
      return done(L);
    }
    case 'block': {
      if (block.entries.some((e) => e.rawKey === op.key)) {
        return refuse('exists');
      }
      const last = block.entries[block.entries.length - 1]?.last ?? block.key.line;
      L.lines.splice(last + 1, 0, entryLine(block.indent ?? 2));
      return done(L);
    }
  }
}

function removeEntry(L: Lines, op: Op<'remove-entry'>): EditResult {
  const found = findEntry(L, op.field, op.key);
  if ('ok' in found) return found;
  const { entry } = found;
  // An entry the editor cannot otherwise edit can still go as a whole.
  if (entry.unsupported === undefined && !matches(valueToken(entry), op.expect)) {
    return refuse('changed');
  }
  L.lines.splice(entry.line, entry.last - entry.line + 1);
  return done(L);
}

function renameEntry(L: Lines, op: Op<'rename-entry'>): EditResult {
  const found = findEntry(L, op.field, op.key);
  if ('ok' in found) return found;
  const { block, entry } = found;
  if (entry.unsupported === 'duplicate') {
    return refuse('unsupported', entry.unsupported);
  }
  if (entry.unsupported === undefined && !matches(valueToken(entry), op.expect)) {
    return refuse('changed');
  }
  if (block.entries.some((e) => e.rawKey === op.to)) {
    return refuse('exists');
  }
  const line = L.lines[entry.line] ?? '';
  const { indent, keyEnd } = entry.parsed;
  L.lines[entry.line] = `${line.slice(0, indent)}${formatKey(op.to)}${line.slice(keyEnd)}`;
  return done(L);
}

/** The single-line top-level key, null when absent, or a refusal when it cannot be edited. */
function findScalar(L: Lines, key: string) {
  const range = frontmatterRange(L.lines);
  const found = range === null ? [] : topLevelKeys(L.lines, range).filter((k) => k.key === key);
  const current = found[0];
  if (current === undefined) return null;
  if (found.length > 1) return refuse('unsupported', 'duplicate');
  const problem = tokenProblem(current.parsed.token);
  if (problem !== null || current.last !== current.line) {
    return refuse('unsupported', problem ?? 'nested');
  }
  return current;
}

function setScalar(L: Lines, op: Op<'set-scalar'>): EditResult {
  const current = findScalar(L, op.key);
  if (current !== null && 'ok' in current) return current;
  const token = (quote: KeyLine['quote']) =>
    typeof op.value === 'number'
      ? formatNumber(op.value, quote)
      : formatStringLike(op.value, quote);
  if (current === null) {
    if (op.expect !== null && op.expect !== undefined) {
      return refuse('changed');
    }
    const range = ensureRange(L);
    L.lines.splice(insertionLine(L.lines, range), 0, `${formatKey(op.key)}: ${token(null)}`);
    return done(L);
  }
  if (!matches(current.parsed.token, op.expect)) {
    return refuse('changed');
  }
  const line = L.lines[current.line] ?? '';
  L.lines[current.line] = withToken(line, current.parsed, token(current.parsed.quote));
  return done(L);
}

function removeScalar(L: Lines, op: Op<'remove-scalar'>): EditResult {
  const current = findScalar(L, op.key);
  if (current === null) return refuse('not-found');
  if ('ok' in current) return current;
  if (!matches(current.parsed.token, op.expect)) {
    return refuse('changed');
  }
  L.lines.splice(current.line, 1);
  return done(L);
}

/** Applies one operation to a note's text. Never throws; on refusal the text is not touched. */
export function applyOp(text: string, op: EditOp): EditResult {
  const L = splitLines(text);
  switch (op.op) {
    case 'set-value':
      return setValue(L, op);
    case 'set-why':
      return setWhy(L, op);
    case 'add-entry':
      return addEntry(L, op);
    case 'remove-entry':
      return removeEntry(L, op);
    case 'rename-entry':
      return renameEntry(L, op);
    case 'set-scalar':
      return setScalar(L, op);
    case 'remove-scalar':
      return removeScalar(L, op);
  }
}
