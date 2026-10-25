// Line edits inside a stat block: scalars through the frontmatter line editor run on the block's
// lines, one number of the `stats:` list, and the entries of traits, actions and the like. Each edit
// changes the lines it names and nothing else, or refuses; edits that change a value carry the
// value the GM saw. Pure.

import { applyOp, type EditOp, type Refusal } from '../yaml/edit';
import { parseKeyLine, tokenProblem, tokenText } from '../yaml/lines';
import { formatString } from '../yaml/scalar';
import { findStatblocks } from './statblock';

export type BlockResult = { ok: true; text: string } | { ok: false; refusal: Refusal };

/** The keys that hold lists of `{ name, desc }` entries. */
export type EntryKey = 'traits' | 'actions' | 'bonus_actions' | 'reactions' | 'legendary_actions';

const refuse = (code: Refusal['code'], reason?: Refusal['reason']): BlockResult => ({
  ok: false,
  refusal: reason === undefined ? { code } : { code, reason },
});

/**
 * Runs `edit` on the lines of the stat block that opens on line `open` and splices them back,
 * keeping the note's line endings; refuses when no stat block opens there any more.
 */
function onBlock(
  text: string,
  open: number,
  edit: (lines: string[]) => BlockResult | string[],
): BlockResult {
  const block = findStatblocks(text).find((b) => b.open === open);
  if (block === undefined) return refuse('not-found');
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  const result = edit(lines.slice(open + 1, block.close));
  if (!Array.isArray(result)) return result;
  lines.splice(open + 1, block.close - open - 1, ...result);
  return { ok: true, text: lines.join(eol) };
}

/** A frontmatter edit (`set-scalar`, `remove-scalar`) applied to a block's top-level keys. */
export function editScalar(text: string, open: number, op: EditOp): BlockResult {
  return onBlock(text, open, (lines) => {
    const result = applyOp(['---', ...lines, '---'].join('\n'), op);
    return result.ok ? result.text.split('\n').slice(1, -1) : result;
  });
}

/** One ability score of the `stats: [STR, DEX, CON, INT, WIS, CHA]` list, the list kept as written. */
export function setAbility(
  text: string,
  open: number,
  index: number,
  expect: number,
  value: number,
): BlockResult {
  return onBlock(text, open, (lines) => {
    const at = lines.findIndex((l) => /^stats\s*:/.test(l));
    const match = at === -1 ? null : /^(stats\s*:\s*\[)([^\]]*)(\].*)$/.exec(lines[at] ?? '');
    if (match === null) return refuse(at === -1 ? 'not-found' : 'unsupported', 'flow');
    const [, head = '', body = '', tail = ''] = match;
    const parts = body.split(',');
    const part = parts[index];
    if (part === undefined || parts.length !== 6) return refuse('unsupported', 'flow');
    if (Number(part.trim()) !== expect) return refuse('changed');
    parts[index] = part.replace(/-?\d+/, String(Math.trunc(value)));
    const next = [...lines];
    next[at] = `${head}${parts.join(',')}${tail}`;
    return next;
  });
}

interface Item {
  /** First line (the `- ` line) and the line after the last. */
  start: number;
  end: number;
  indent: number;
  fields: Map<string, { line: number; token: string }>;
}

/** The entries of a list key within a block's lines, and where the key and its list end. */
function entries(
  lines: readonly string[],
  key: EntryKey,
): { keyLine: number; end: number; items: Item[] } | null {
  const keyLine = lines.findIndex((l) => new RegExp(`^${key}\\s*:`).test(l));
  if (keyLine === -1) return null;
  let end = keyLine + 1;
  while (end < lines.length) {
    const line = lines[end] ?? '';
    if (line.trim() !== '' && !/^\s/.test(line) && !line.startsWith('- ')) break;
    end++;
  }
  while (end > keyLine + 1 && (lines[end - 1] ?? '').trim() === '') end--;

  const items: Item[] = [];
  for (let i = keyLine + 1; i < end; i++) {
    const line = lines[i] ?? '';
    const dash = /^(\s*)- /.exec(line);
    const current = items[items.length - 1];
    if (dash !== null && (current === undefined || (dash[1] ?? '').length === current.indent)) {
      if (current !== undefined) current.end = i;
      items.push({ start: i, end, indent: (dash[1] ?? '').length, fields: new Map() });
    }
    const item = items[items.length - 1];
    if (item === undefined) continue;
    // Read `- name: x` as if the dash were a space, so the key's column is right.
    const parsed = parseKeyLine(line.replace(/^(\s*)- /, '$1  '));
    if (parsed !== null && parsed.indent === item.indent + 2) {
      item.fields.set(parsed.key, { line: i, token: parsed.token });
    }
  }
  return { keyLine, end, items };
}

/** Sets an entry's `name` or `desc`; refuses when it says something else than `expect` now. */
export function setEntryField(
  text: string,
  open: number,
  key: EntryKey,
  index: number,
  field: 'name' | 'desc',
  expect: string,
  value: string,
): BlockResult {
  return onBlock(text, open, (lines) => {
    const item = entries(lines, key)?.items[index];
    if (item === undefined) return refuse('not-found');
    const current = item.fields.get(field);
    const next = [...lines];
    if (current === undefined) {
      if (expect !== '') return refuse('changed');
      next.splice(item.end, 0, `${' '.repeat(item.indent + 2)}${field}: ${formatString(value)}`);
      return next;
    }
    const problem = tokenProblem(current.token);
    if (problem !== null) return refuse('unsupported', problem);
    if (tokenText(current.token) !== expect) return refuse('changed');
    const line = next[current.line] ?? '';
    const at = line.indexOf(current.token, line.indexOf(`${field}:`) + field.length + 1);
    next[current.line] =
      `${line.slice(0, at)}${formatString(value)}${line.slice(at + current.token.length)}`;
    return next;
  });
}

/** Adds `- name / desc` at the end of the list, creating the key at the block's end when missing. */
export function addEntry(
  text: string,
  open: number,
  key: EntryKey,
  name: string,
  desc: string,
): BlockResult {
  return onBlock(text, open, (lines) => {
    const found = entries(lines, key);
    const indent = found?.items[0]?.indent ?? 2;
    const item = [
      `${' '.repeat(indent)}- name: ${formatString(name)}`,
      `${' '.repeat(indent + 2)}desc: ${formatString(desc)}`,
    ];
    const next = [...lines];
    if (found === null) {
      let end = next.length;
      while (end > 0 && (next[end - 1] ?? '').trim() === '') end--;
      next.splice(end, 0, `${key}:`, ...item);
    } else {
      next.splice(found.end, 0, ...item);
    }
    return next;
  });
}

/** Removes the entry at `index` when its name is still `expectName`. */
export function removeEntry(
  text: string,
  open: number,
  key: EntryKey,
  index: number,
  expectName: string,
): BlockResult {
  return onBlock(text, open, (lines) => {
    const item = entries(lines, key)?.items[index];
    if (item === undefined) return refuse('not-found');
    const name = item.fields.get('name');
    if (tokenText(name?.token ?? '') !== expectName) return refuse('changed');
    const next = [...lines];
    next.splice(item.start, item.end - item.start);
    return next;
  });
}
