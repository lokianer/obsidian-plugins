// Rollable tables in notes: a heading ending in a die in brackets — `## Weather on the estuary
// (1d8)` — makes the first list or table under it rollable. A list is numbered by its order; a
// table's first column holds numbers or ranges (`2–4`, `5-6`). A total on no row is a gap,
// recorded as it fell. Pure.

import { tableCells } from '../markdown/table';
import { parseFormula } from './formula';

export interface TableRow {
  from: number;
  to: number;
  text: string;
}

export interface RollTable {
  /** The heading as written, without its hashes: `Night on Lantern Quay (d20)`. */
  heading: string;
  /** The die to roll: `d20`, `2d6`. */
  formula: string;
  rows: TableRow[];
}

const HEADING = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const DIE = /\((\d*[dDwW](?:\d+|%))\)$/;
const RANGE = /^(\d+)\s*(?:[–—-]\s*(\d+))?$/;

/** Every rollable table of a note, in order. */
export function rollableTables(text: string): RollTable[] {
  const lines = text.split('\n');
  const tables: RollTable[] = [];
  for (let i = 0; i < lines.length; i++) {
    const h = HEADING.exec(lines[i] ?? '');
    const die = h === null ? null : DIE.exec(h[2] ?? '');
    if (h === null || die === null) continue;
    const formula = (die[1] ?? '').replace(/[wW]/, 'd');
    if (parseFormula(formula) === null) continue;
    const rows = rowsUnder(lines, i + 1);
    if (rows.length > 0) tables.push({ heading: h[2] ?? '', formula, rows });
  }
  return tables;
}

/** The first list or table after a heading, before the next heading. */
function rowsUnder(lines: readonly string[], start: number): TableRow[] {
  for (let i = start; i < lines.length; i++) {
    const line = lines[i] ?? '';
    if (HEADING.test(line)) return [];
    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) return listRows(lines, i);
    if (line.trim().startsWith('|')) return tableRows(lines, i);
  }
  return [];
}

function listRows(lines: readonly string[], start: number): TableRow[] {
  const rows: TableRow[] = [];
  // The items sit at the first item's indent; deeper lines belong to the item above.
  const indent = /^\s*/.exec(lines[start] ?? '')?.[0].length ?? 0;
  for (let i = start; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const depth = /^\s*/.exec(line)?.[0].length ?? 0;
    const m = depth === indent ? /^\s*([-*+]|\d+[.)])\s+(.*)$/.exec(line) : null;
    if (m === null) {
      if (depth > indent && line.trim() !== '' && rows.length > 0) continue;
      break;
    }
    const n = rows.length + 1;
    rows.push({ from: n, to: n, text: (m[2] ?? '').trim() });
  }
  return rows;
}

function tableRows(lines: readonly string[], start: number): TableRow[] {
  const rows: TableRow[] = [];
  for (let i = start; i < lines.length; i++) {
    const line = lines[i] ?? '';
    if (!line.trim().startsWith('|')) break;
    const [first = '', ...rest] = tableCells(line);
    const m = RANGE.exec(first);
    // The header row and the separator row read as no range and are passed over.
    if (m === null) continue;
    const from = Number(m[1]);
    const to = m[2] === undefined ? from : Number(m[2]);
    rows.push({
      from: Math.min(from, to),
      to: Math.max(from, to),
      text: rest.filter(Boolean).join(' — '),
    });
  }
  return rows;
}

/** The row a total lands on, or null for a gap. */
export function rowFor(table: RollTable, total: number): TableRow | null {
  return table.rows.find((r) => total >= r.from && total <= r.to) ?? null;
}

/** A table of a note by its heading (case and spacing ignored), or the first one for none. */
export function findTable(tables: readonly RollTable[], heading: string | null): RollTable | null {
  if (heading === null || heading.trim() === '') return tables[0] ?? null;
  const key = heading.trim().replace(/\s+/g, ' ').toLowerCase();
  return tables.find((t) => t.heading.replace(/\s+/g, ' ').toLowerCase() === key) ?? null;
}

/** The session log's line for a table roll. */
export function tableLine(table: RollTable, total: number, row: TableRow | null): string {
  return `Rolled ${table.heading}: ${total} → ${row === null ? 'no row' : row.text}`;
}
