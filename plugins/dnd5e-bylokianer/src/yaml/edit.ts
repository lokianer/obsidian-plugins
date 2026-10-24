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
  parseKeyLine,
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

export type RefusalCode = 'not-found' | 'changed' | 'exists' | 'unsupported';

export interface Refusal {
  code: RefusalCode;
  reason?: Unsupported;
}

export type EditResult = { ok: true; text: string } | { ok: false; refusal: Refusal };

const refuse = (code: RefusalCode, reason?: Unsupported): EditResult => ({
  ok: false,
  refusal: reason === undefined ? { code } : { code, reason },
});

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
  const head = line.slice(0, parsed.keyEnd + 1);
  return `${head} ${token}${parsed.comment}`;
}

function withValue(line: string, parsed: KeyLine, value: number): string {
  return withToken(line, parsed, formatNumber(value, parsed.quote));
}

/** Where a new top-level key goes: before `tags:`, else at the end of the frontmatter. */
function insertionLine(lines: readonly string[], range: Range): number {
  return topLevelKeys(lines, range).find((k) => k.key === 'tags')?.line ?? range.close;
}

function done(L: Lines): EditResult {
  return { ok: true, text: joinLines(L) };
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

function findEntry(
  L: Lines,
  field: string,
  key: string,
): { block: Extract<FieldBlock, { kind: 'block' }>; entry: Entry } | Refusal {
  const range = frontmatterRange(L.lines);
  if (range === null) {
    return { code: 'not-found' };
  }
  const block = fieldBlock(L.lines, range, field);
  if (block.kind === 'unsupported') {
    return { code: 'unsupported', reason: block.reason };
  }
  if (block.kind !== 'block') {
    return { code: 'not-found' };
  }
  const entry = block.entries.find((e) => e.rawKey === key);
  if (entry === undefined) {
    return { code: 'not-found' };
  }
  return { block, entry };
}

function isRefusal(x: object): x is Refusal {
  return 'code' in x;
}

/** A child line of a structured entry; the entry reader has already checked it parses. */
function child(L: Lines, line: number): { text: string; parsed: KeyLine } {
  const text = L.lines[line] ?? '';
  const parsed = parseKeyLine(text) ?? {
    indent: 0,
    key: '',
    keyEnd: text.length,
    valueStart: text.length,
    token: '',
    comment: '',
    quote: null,
  };
  return { text, parsed };
}

/** The token that holds an entry's value: its own line, or its `value:` line. */
function valueToken(L: Lines, entry: Entry): string {
  if (entry.form === 'plain') {
    return entry.parsed.token;
  }
  return entry.valueLine === undefined ? '' : child(L, entry.valueLine).parsed.token;
}

function childIndent(block: Extract<FieldBlock, { kind: 'block' }>, entry: Entry): number {
  if (entry.childIndent !== undefined) {
    return entry.childIndent;
  }
  const step = block.indent ?? 2;
  return entry.parsed.indent + (step > 0 ? step : 2);
}

function setValue(L: Lines, op: Extract<EditOp, { op: 'set-value' }>): EditResult {
  const found = findEntry(L, op.field, op.key);
  if (isRefusal(found)) {
    return { ok: false, refusal: found };
  }
  const { block, entry } = found;
  if (entry.unsupported !== undefined) {
    return refuse('unsupported', entry.unsupported);
  }
  if (!matches(valueToken(L, entry), op.expect)) {
    return refuse('changed');
  }
  if (entry.form === 'plain') {
    L.lines[entry.line] = withValue(L.lines[entry.line] ?? '', entry.parsed, op.value);
  } else if (entry.valueLine !== undefined) {
    const { text, parsed } = child(L, entry.valueLine);
    L.lines[entry.valueLine] = withValue(text, parsed, op.value);
  } else {
    const pad = ' '.repeat(childIndent(block, entry));
    L.lines.splice(entry.line + 1, 0, `${pad}value: ${formatNumber(op.value)}`);
  }
  return done(L);
}

function setWhy(L: Lines, op: Extract<EditOp, { op: 'set-why' }>): EditResult {
  const found = findEntry(L, op.field, op.key);
  if (isRefusal(found)) {
    return { ok: false, refusal: found };
  }
  const { block, entry } = found;
  if (entry.unsupported !== undefined) {
    return refuse('unsupported', entry.unsupported);
  }
  const current = entry.whyLine === undefined ? '' : child(L, entry.whyLine).parsed.token;
  if (!matches(current, op.expect)) {
    return refuse('changed');
  }
  const pad = ' '.repeat(childIndent(block, entry));
  if (op.why === null || op.why === '') {
    if (entry.whyLine !== undefined) {
      L.lines.splice(entry.whyLine, 1);
    }
    return done(L);
  }
  if (entry.whyLine !== undefined) {
    const { text, parsed } = child(L, entry.whyLine);
    L.lines[entry.whyLine] = withToken(text, parsed, formatStringLike(op.why, parsed.quote));
    return done(L);
  }
  const whyText = `${pad}why: ${formatString(op.why)}`;
  if (entry.form === 'structured') {
    L.lines.splice((entry.valueLine ?? entry.line) + 1, 0, whyText);
    return done(L);
  }
  // A plain entry becomes the structured form: the key keeps its line and comment.
  const line = L.lines[entry.line] ?? '';
  const { parsed } = entry;
  const head = line.slice(0, parsed.keyEnd + 1);
  const added = parsed.token === '' ? [] : [`${pad}value: ${parsed.token}`];
  L.lines.splice(entry.line, 1, `${head}${parsed.comment}`, ...added, whyText);
  return done(L);
}

function addEntry(L: Lines, op: Extract<EditOp, { op: 'add-entry' }>): EditResult {
  const range = ensureRange(L);
  const block = fieldBlock(L.lines, range, op.field);
  const entryText = (indent: number) =>
    `${' '.repeat(indent)}${formatKey(op.key)}: ${formatNumber(op.value)}`;
  if (block.kind === 'unsupported') {
    return refuse('unsupported', block.reason);
  }
  if (block.kind === 'none') {
    const at = insertionLine(L.lines, range);
    L.lines.splice(at, 0, `${op.field}:`, entryText(2));
    return done(L);
  }
  if (block.kind === 'empty-flow') {
    const line = L.lines[block.key.line] ?? '';
    L.lines[block.key.line] =
      `${line.slice(0, block.key.parsed.keyEnd + 1)}${block.key.parsed.comment}`;
    L.lines.splice(block.key.line + 1, 0, entryText(2));
    return done(L);
  }
  if (block.entries.some((e) => e.rawKey === op.key)) {
    return refuse('exists');
  }
  const last = block.entries[block.entries.length - 1]?.last ?? block.key.line;
  L.lines.splice(last + 1, 0, entryText(block.indent ?? 2));
  return done(L);
}

function removeEntry(L: Lines, op: Extract<EditOp, { op: 'remove-entry' }>): EditResult {
  const found = findEntry(L, op.field, op.key);
  if (isRefusal(found)) {
    return { ok: false, refusal: found };
  }
  const { entry } = found;
  if (entry.unsupported === undefined && !matches(valueToken(L, entry), op.expect)) {
    return refuse('changed');
  }
  L.lines.splice(entry.line, entry.last - entry.line + 1);
  return done(L);
}

function renameEntry(L: Lines, op: Extract<EditOp, { op: 'rename-entry' }>): EditResult {
  const found = findEntry(L, op.field, op.key);
  if (isRefusal(found)) {
    return { ok: false, refusal: found };
  }
  const { block, entry } = found;
  if (entry.unsupported === 'duplicate') {
    return refuse('unsupported', entry.unsupported);
  }
  if (entry.unsupported === undefined && !matches(valueToken(L, entry), op.expect)) {
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

function topKey(L: Lines, key: string) {
  const range = frontmatterRange(L.lines);
  if (range === null) {
    return { range: null, matches: [] };
  }
  return { range, matches: topLevelKeys(L.lines, range).filter((k) => k.key === key) };
}

function setScalar(L: Lines, op: Extract<EditOp, { op: 'set-scalar' }>): EditResult {
  const { matches: found } = topKey(L, op.key);
  if (found.length > 1) {
    return refuse('unsupported', 'duplicate');
  }
  const current = found[0];
  const token = (quote: KeyLine['quote']) =>
    typeof op.value === 'number'
      ? formatNumber(op.value, quote)
      : formatStringLike(op.value, quote);
  if (current === undefined) {
    if (op.expect !== null && op.expect !== undefined) {
      return refuse('changed');
    }
    const range = ensureRange(L);
    L.lines.splice(insertionLine(L.lines, range), 0, `${formatKey(op.key)}: ${token(null)}`);
    return done(L);
  }
  const problem = tokenProblem(current.parsed.token);
  if (problem !== null || current.last !== current.line) {
    return refuse('unsupported', problem ?? 'nested');
  }
  if (!matches(current.parsed.token, op.expect)) {
    return refuse('changed');
  }
  const line = L.lines[current.line] ?? '';
  L.lines[current.line] = withToken(line, current.parsed, token(current.parsed.quote));
  return done(L);
}

function removeScalar(L: Lines, op: Extract<EditOp, { op: 'remove-scalar' }>): EditResult {
  const { matches: found } = topKey(L, op.key);
  const current = found[0];
  if (current === undefined) {
    return refuse('not-found');
  }
  if (found.length > 1 || current.last !== current.line) {
    return refuse('unsupported', found.length > 1 ? 'duplicate' : 'nested');
  }
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
