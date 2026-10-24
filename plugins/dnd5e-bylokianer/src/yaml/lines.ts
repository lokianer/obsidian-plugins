// Locating keys and entries in a note's frontmatter, line by line, without parsing it as a whole.
// Only block-style YAML is understood; anything else is reported as unsupported with a reason, so
// the editor can refuse instead of guessing. Pure: no Obsidian, no factions.

export interface Lines {
  lines: string[];
  eol: '\n' | '\r\n';
  bom: boolean;
}

export function splitLines(text: string): Lines {
  const bom = text.startsWith('﻿');
  const body = bom ? text.slice(1) : text;
  return { lines: body.split(/\r?\n/), eol: body.includes('\r\n') ? '\r\n' : '\n', bom };
}

export function joinLines({ lines, eol, bom }: Lines): string {
  return (bom ? '﻿' : '') + lines.join(eol);
}

/** Line indices of the opening and closing `---`. */
export interface Range {
  open: number;
  close: number;
}

export function frontmatterRange(lines: readonly string[]): Range | null {
  if (lines[0]?.trimEnd() !== '---') {
    return null;
  }
  for (let i = 1; i < lines.length; i++) {
    if (lines[i]?.trimEnd() === '---') {
      return { open: 0, close: i };
    }
  }
  return null;
}

export type Unsupported =
  | 'flow'
  | 'block-scalar'
  | 'anchor'
  | 'tag'
  | 'tabs'
  | 'indent'
  | 'not-a-map'
  | 'nested'
  | 'duplicate';

/** One `key: value` line, split into its parts. Columns index into the line. */
export interface KeyLine {
  indent: number;
  key: string;
  /** Column just after the key text (where `:` stands). */
  keyEnd: number;
  /** Column where the value token starts (after `: `), or the line's length when it has none. */
  valueStart: number;
  /** The value token as written, quotes included; empty when the key has no inline value. */
  token: string;
  /** Trailing comment with the whitespace before it, or empty. */
  comment: string;
  quote: '"' | "'" | null;
}

function indentOf(line: string): number {
  return line.length - line.trimStart().length;
}

export function isBlankOrComment(line: string): boolean {
  const t = line.trim();
  return t === '' || t.startsWith('#');
}

/** Reads a quoted string starting at `start`; returns its value and the column after it. */
function readQuoted(line: string, start: number): { value: string; end: number } | null {
  const q = line[start];
  let i = start + 1;
  let out = '';
  while (i < line.length) {
    const c = line[i];
    if (q === "'" && c === "'") {
      if (line[i + 1] === "'") {
        out += "'";
        i += 2;
        continue;
      }
      return { value: out, end: i + 1 };
    }
    if (q === '"' && c === '\\') {
      out += line.slice(i, i + 2);
      i += 2;
      continue;
    }
    if (q === '"' && c === '"') {
      try {
        return { value: JSON.parse(`"${out}"`) as string, end: i + 1 };
      } catch {
        return { value: out, end: i + 1 };
      }
    }
    out += c;
    i++;
  }
  return null;
}

/** Splits `rest` (the text after `: `) into the value token and a trailing comment. */
function splitValue(
  rest: string,
): { token: string; comment: string; quote: KeyLine['quote'] } | null {
  const lead = rest.length - rest.trimStart().length;
  const body = rest.slice(lead);
  if (body.startsWith('"') || body.startsWith("'")) {
    const quoted = readQuoted(body, 0);
    if (quoted === null) {
      return null;
    }
    const after = body.slice(quoted.end);
    if (after.trim() !== '' && !after.trimStart().startsWith('#')) {
      return null;
    }
    if (after.trim() !== '' && after === after.trimStart()) {
      return null;
    }
    return {
      token: body.slice(0, quoted.end),
      comment: after.trim() === '' ? '' : after,
      quote: body[0] === '"' ? '"' : "'",
    };
  }
  if (body.startsWith('#')) {
    return { token: '', comment: rest, quote: null };
  }
  const hash = body.search(/\s#/);
  const token = (hash === -1 ? body : body.slice(0, hash)).trimEnd();
  return { token, comment: body.slice(token.length).trimEnd(), quote: null };
}

/** Parses a `key: value` line; null for anything else (a list item, a comment, a bare word). */
export function parseKeyLine(line: string): KeyLine | null {
  if (isBlankOrComment(line)) {
    return null;
  }
  const indent = indentOf(line);
  const start = indent;
  let key: string;
  let keyEnd: number;
  if (line[start] === '"' || line[start] === "'") {
    const quoted = readQuoted(line, start);
    if (quoted === null || line[quoted.end] !== ':') {
      return null;
    }
    key = quoted.value;
    keyEnd = quoted.end;
  } else {
    if (/^[-?[\]{}#&*!|>%@`,]/.test(line.slice(start))) {
      return null;
    }
    const match = /:(?=\s|$)/.exec(line.slice(start));
    if (match === null) {
      return null;
    }
    keyEnd = start + match.index;
    key = line.slice(start, keyEnd).trimEnd();
  }
  const rest = line.slice(keyEnd + 1);
  const split = splitValue(rest);
  if (split === null) {
    return null;
  }
  const valueStart =
    split.token === '' ? line.length - split.comment.length : line.indexOf(split.token, keyEnd + 1);
  return { indent, key, keyEnd, valueStart, ...split };
}

/** Why a value token cannot be edited in place, or null when it is a plain or quoted scalar. */
export function tokenProblem(token: string): Unsupported | null {
  if (/^[{[]/.test(token)) {
    return 'flow';
  }
  if (/^[|>]/.test(token)) {
    return 'block-scalar';
  }
  if (/^[&*]/.test(token)) {
    return 'anchor';
  }
  if (token.startsWith('!')) {
    return 'tag';
  }
  return null;
}

/** The value a scalar token stands for, as text: quotes removed, nothing else interpreted. */
export function tokenText(token: string): string {
  if (token.startsWith('"') || token.startsWith("'")) {
    return readQuoted(token, 0)?.value ?? token;
  }
  return token === '~' || token === 'null' ? '' : token;
}

export interface TopKey {
  key: string;
  line: number;
  /** The last line that belongs to this key: its own, or the deepest of its indented lines. */
  last: number;
  parsed: KeyLine;
}

export function topLevelKeys(lines: readonly string[], range: Range): TopKey[] {
  const keys: TopKey[] = [];
  for (let i = range.open + 1; i < range.close; i++) {
    const line = lines[i] ?? '';
    if (indentOf(line) !== 0 || isBlankOrComment(line)) {
      continue;
    }
    const parsed = parseKeyLine(line);
    if (parsed === null) {
      continue;
    }
    let last = i;
    for (let j = i + 1; j < range.close; j++) {
      const next = lines[j] ?? '';
      if (next.trim() === '') {
        continue;
      }
      if (indentOf(next) === 0 && !next.startsWith('- ') && next !== '-') {
        break;
      }
      last = j;
    }
    keys.push({ key: parsed.key, line: i, last, parsed });
  }
  return keys;
}

export interface Entry {
  rawKey: string;
  line: number;
  last: number;
  parsed: KeyLine;
  /** plain: `Key: 3` or `Key:`; structured: `Key:` with `value:` and `why:` lines below. */
  form: 'plain' | 'structured';
  valueLine?: number;
  whyLine?: number;
  /** Indent of the `value:` / `why:` lines of a structured entry. */
  childIndent?: number;
  unsupported?: Unsupported;
}

export type FieldBlock =
  | { kind: 'none' }
  | { kind: 'empty-flow'; key: TopKey }
  | { kind: 'block'; key: TopKey; indent: number | null; entries: Entry[] }
  | { kind: 'unsupported'; key: TopKey; reason: Unsupported };

function readEntry(lines: readonly string[], line: number, last: number): Entry | null {
  const parsed = parseKeyLine(lines[line] ?? '');
  if (parsed === null) {
    return null;
  }
  const entry: Entry = { rawKey: parsed.key, line, last, parsed, form: 'plain' };
  const problem = tokenProblem(parsed.token);
  if (problem !== null) {
    return { ...entry, unsupported: problem };
  }
  if (last === line) {
    return entry;
  }
  if (parsed.token !== '') {
    return { ...entry, unsupported: 'nested' };
  }
  const structured: Entry = { ...entry, form: 'structured' };
  for (let i = line + 1; i <= last; i++) {
    const text = lines[i] ?? '';
    if (isBlankOrComment(text)) {
      continue;
    }
    const child = parseKeyLine(text);
    if (child === null || tokenProblem(child.token) !== null) {
      return { ...entry, unsupported: 'nested' };
    }
    structured.childIndent ??= child.indent;
    if (child.indent !== structured.childIndent) {
      return { ...entry, unsupported: 'nested' };
    }
    if (child.key === 'value' && structured.valueLine === undefined) {
      structured.valueLine = i;
    } else if (child.key === 'why' && structured.whyLine === undefined) {
      structured.whyLine = i;
    } else {
      return { ...entry, unsupported: 'nested' };
    }
  }
  return structured;
}

export function fieldBlock(lines: readonly string[], range: Range, field: string): FieldBlock {
  const matches = topLevelKeys(lines, range).filter((k) => k.key === field);
  const key = matches[0];
  if (key === undefined) {
    return { kind: 'none' };
  }
  if (matches.length > 1) {
    return { kind: 'unsupported', key, reason: 'duplicate' };
  }
  const token = key.parsed.token;
  if (token === '{}') {
    return { kind: 'empty-flow', key };
  }
  const problem = tokenProblem(token);
  if (problem !== null) {
    return { kind: 'unsupported', key, reason: problem };
  }
  if (token !== '' && token !== '~' && token !== 'null') {
    return { kind: 'unsupported', key, reason: 'not-a-map' };
  }

  let indent: number | null = null;
  const starts: number[] = [];
  for (let i = key.line + 1; i <= key.last; i++) {
    const text = lines[i] ?? '';
    if (isBlankOrComment(text)) {
      continue;
    }
    if (/^ *\t/.test(text)) {
      return { kind: 'unsupported', key, reason: 'tabs' };
    }
    const own = indentOf(text);
    indent ??= own;
    if (own < indent) {
      return { kind: 'unsupported', key, reason: 'indent' };
    }
    if (own === indent) {
      if (text.trimStart().startsWith('-')) {
        return { kind: 'unsupported', key, reason: 'not-a-map' };
      }
      starts.push(i);
    }
  }

  const entries: Entry[] = [];
  for (const [n, start] of starts.entries()) {
    const next = starts[n + 1];
    let last = next === undefined ? key.last : next - 1;
    while (last > start && isBlankOrComment(lines[last] ?? '')) {
      last--;
    }
    const entry = readEntry(lines, start, last);
    if (entry === null) {
      return { kind: 'unsupported', key, reason: 'not-a-map' };
    }
    entries.push(entry);
  }
  const seen = new Map<string, Entry>();
  for (const entry of entries) {
    const first = seen.get(entry.rawKey);
    if (first !== undefined) {
      first.unsupported ??= 'duplicate';
      entry.unsupported ??= 'duplicate';
    }
    seen.set(entry.rawKey, entry);
  }
  return { kind: 'block', key, indent, entries };
}
