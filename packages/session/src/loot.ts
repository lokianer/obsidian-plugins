// Loot carries over: a new session note starts with the "## Loot" of the session before it, each
// table row and list item marked with where it came from:
//   | Mira's calling card, silver edge (from [[Session 14 – Bell Square]]) | Orrin |
// A line marked earlier keeps its first origin, so the newest note is the only one to look at.

import { fromLines, section, toLines } from './text';

const LOOT_HEADING = /^##\s+loot\s*$/i;
/** An origin marker at the end of a cell or item: `(from [[…]])` or `(from [...](...))`. */
const ORIGIN = /\(from \[\[[^\]]*\]\]\)\s*$|\(from \[[^\]]*\]\([^)]*\)\)\s*$/;
const LIST_ITEM = /^\s*[-*+]\s+\S/;

export interface Loot {
  /** The header and separator of the first table, to start a table where the new note has none. */
  header: string[];
  rows: string[];
  items: string[];
}

const isRow = (line: string) => line.trimStart().startsWith('|');
const isSeparator = (line: string) => isRow(line) && /^[\s|:-]+$/.test(line) && line.includes('-');
const isBlankRow = (line: string) => isRow(line) && line.replace(/[|\s]/g, '') === '';

/** A table row with the origin added to its first cell, unless that cell has one already. */
function markRow(row: string, origin: string): string {
  const match = /^(\s*\|)((?:[^|\\]|\\.)*?)(\s*\|.*)$/.exec(row);
  if (match === null) return row;
  const [, lead = '', cell = '', rest = ''] = match;
  if (ORIGIN.test(cell)) return row;
  // A pipe inside a table cell ends the cell; links with an alias need it escaped.
  return `${lead}${cell} (from ${origin.replace(/\|/g, '\\|')})${rest}`;
}

/** The loot of a session note's "## Loot" section, each line marked with `origin` (a link). */
export function carriedLoot(text: string, origin: string): Loot {
  const { lines } = toLines(text);
  const loot: Loot = { header: [], rows: [], items: [] };
  const at = section(lines, LOOT_HEADING);
  if (at === null) return loot;
  for (let i = at.heading + 1; i < at.end; i++) {
    const line = lines[i] ?? '';
    const next = lines[i + 1] ?? '';
    if (isRow(line) && isSeparator(next)) {
      if (loot.header.length === 0) loot.header = [line, next];
      i++;
    } else if (isRow(line)) {
      if (!isSeparator(line) && !isBlankRow(line)) loot.rows.push(markRow(line, origin));
    } else if (LIST_ITEM.test(line)) {
      loot.items.push(ORIGIN.test(line) ? line : `${line.trimEnd()} (from ${origin})`);
    }
  }
  return loot;
}

/**
 * A new session note with carried loot in its "## Loot" section: rows join the section's table
 * (its empty placeholder rows dropped), items follow the section's content. Without a table the
 * previous note's header starts one; without a "## Loot" heading, one is appended.
 */
export function withLoot(text: string, loot: Loot): string {
  if (loot.rows.length === 0 && loot.items.length === 0) return text;
  const note = toLines(text);
  const { lines } = note;
  const header = loot.header.length > 0 ? loot.header : ['| Item | Who has it |', '| --- | --- |'];

  let at = section(lines, LOOT_HEADING);
  if (at === null) {
    const end = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;
    const lead = end > 0 && lines[end - 1]?.trim() !== '' ? [''] : [];
    lines.splice(end, 0, ...lead, '## Loot');
    at = section(lines, LOOT_HEADING);
    if (at === null) return text;
  }

  // Drop the template's empty rows, then find the table's last row.
  for (let i = at.end - 1; i > at.heading; i--) {
    if (isBlankRow(lines[i] ?? '')) {
      lines.splice(i, 1);
      at = { ...at, end: at.end - 1 };
    }
  }
  if (loot.rows.length > 0) {
    let separator = -1;
    for (let i = at.heading + 1; i < at.end && separator === -1; i++) {
      if (isSeparator(lines[i] ?? '')) separator = i;
    }
    if (separator === -1) {
      const end = contentEnd(lines, at);
      // A blank line after the heading or before the table either way.
      const block = ['', ...header, ...loot.rows];
      lines.splice(end, 0, ...block);
      at = { ...at, end: at.end + block.length };
    } else {
      let last = separator;
      while (last + 1 < at.end && isRow(lines[last + 1] ?? '')) last++;
      lines.splice(last + 1, 0, ...loot.rows);
      at = { ...at, end: at.end + loot.rows.length };
    }
  }
  if (loot.items.length > 0) {
    const end = contentEnd(lines, at);
    const gap = end === at.heading + 1 || isRow(lines[end - 1] ?? '') ? [''] : [];
    lines.splice(end, 0, ...gap, ...loot.items);
  }
  return fromLines(note);
}

/** The line after a section's last non-empty line (right after the heading when it is empty). */
function contentEnd(lines: readonly string[], at: { heading: number; end: number }): number {
  let last = at.end - 1;
  while (last > at.heading && (lines[last]?.trim() ?? '') === '') last--;
  return last + 1;
}
