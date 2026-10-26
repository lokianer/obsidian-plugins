// The running fight as a `## Combat` section of the encounter note: a line with the round and whose
// turn it is, then a Markdown table — initiative, combatant, hit points, armour class, conditions.
// Written from the fight, read back into it; only this section of the note ever changes. Pure.

import { tableCells } from '../markdown/table';
import type { Combatant, Condition, Fight, Fighter } from './fight';

export const HEADING = '## Combat';

export interface Row {
  init: number | null;
  id: string;
  hp: number;
  maxHp: number;
  temp: number;
  ac: number | null;
  conditions: Condition[];
  concentration: boolean;
  saves: { ok: number; fail: number };
}

export interface Table {
  round: number;
  turn: string | null;
  ended: boolean;
  rows: Row[];
}

const cell = (s: string) => s.replace(/\|/g, '\\|');

/** The combatant's cell: its note linked (`[[Sable]] 2`), else its id. */
function who(c: Combatant): string {
  if (c.path === null) return cell(c.id);
  return `[[${c.name}]]${c.id.slice(c.name.length)}`;
}

function marks(c: Combatant): string {
  const parts = c.conditions.map((k) => (k.rounds === null ? k.name : `${k.name} (${k.rounds})`));
  if (c.concentration) parts.push('concentration');
  if (!c.pc && c.hp <= 0) parts.push('defeated');
  if (c.pc && c.saves.fail >= 3) parts.push('dead');
  else if (c.pc && c.hp <= 0) {
    parts.push(`down ${'✓'.repeat(c.saves.ok)}${'✗'.repeat(c.saves.fail)}`.trim());
  }
  return cell(parts.join(', '));
}

/** The section's lines (without the heading) for a fight; `ended` after End combat. */
export function combatLines(f: Fight, ended = false): string[] {
  const status = ended
    ? `Ended after ${f.round} ${f.round === 1 ? 'round' : 'rounds'}`
    : f.round === 0
      ? 'Rolling initiative'
      : `Round ${f.round} · Turn: ${f.turn ?? '—'}`;
  return [
    '',
    status,
    '',
    '| Init | Combatant | HP | AC | Conditions |',
    '| ---: | --- | ---: | ---: | --- |',
    ...f.combatants.map(
      (c) =>
        `| ${c.init ?? '—'} | ${who(c)} | ${c.hp}/${c.maxHp}${c.temp > 0 ? ` +${c.temp}` : ''} | ${c.ac ?? '—'} | ${marks(c)} |`,
    ),
    '',
  ];
}

/** Where the section is: the heading's line and the line after its last one, or null. */
function section(lines: readonly string[]): { start: number; end: number } | null {
  const start = lines.findIndex((l) => l.trim() === HEADING);
  if (start === -1) return null;
  let end = start + 1;
  while (end < lines.length && !/^#{1,2}\s/.test(lines[end] ?? '')) end++;
  return { start, end };
}

/** The note with its `## Combat` section set to these lines (added at the end if missing). */
export function withCombat(text: string, body: readonly string[]): string {
  const lines = text.split('\n');
  const at = section(lines);
  if (at === null) {
    const trimmed = text.replace(/\s*$/, '');
    return `${trimmed}\n\n${HEADING}\n${body.join('\n')}`.replace(/\n*$/, '\n');
  }
  lines.splice(at.start + 1, at.end - at.start - 1, ...body);
  return lines.join('\n');
}

function readRow(line: string): Row | null {
  const [init = '', name = '', hp = '', ac = '', conds = ''] = tableCells(line);
  const hpMatch = /^(-?\d+)\s*\/\s*(\d+)(?:\s*\+\s*(\d+))?/.exec(hp);
  if (hpMatch === null) return null;
  const id = name.replace(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/, '$1').trim();
  const conditions: Condition[] = [];
  let concentration = false;
  let saves = { ok: 0, fail: 0 };
  for (const part of conds
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)) {
    if (part === 'concentration') concentration = true;
    else if (part === 'defeated') continue;
    else if (part === 'dead') saves = { ok: 0, fail: 3 };
    else if (part.startsWith('down')) {
      saves = { ok: (part.match(/✓/g) ?? []).length, fail: (part.match(/✗/g) ?? []).length };
    } else {
      const m = /^(.*?)\s*\((\d+)\)$/.exec(part);
      conditions.push(
        m === null ? { name: part, rounds: null } : { name: m[1] ?? part, rounds: Number(m[2]) },
      );
    }
  }
  const n = Number(init);
  return {
    init: init === '' || init === '—' || !Number.isFinite(n) ? null : n,
    id,
    hp: Number(hpMatch[1]),
    maxHp: Number(hpMatch[2]),
    temp: hpMatch[3] === undefined ? 0 : Number(hpMatch[3]),
    ac: ac === '—' || ac === '' ? null : Number(ac),
    conditions,
    concentration,
    saves,
  };
}

/** The `## Combat` section read back, or null when the note has none. */
export function readCombat(text: string): Table | null {
  const lines = text.split('\n');
  const at = section(lines);
  if (at === null) return null;
  const body = lines.slice(at.start + 1, at.end);
  const status =
    body.find((l) => /^(Round \d+|Rolling initiative|Ended after)/.test(l.trim()))?.trim() ?? '';
  const round = Number(
    /^Round (\d+)/.exec(status)?.[1] ?? /^Ended after (\d+)/.exec(status)?.[1] ?? 0,
  );
  const turn = /Turn: (.+)$/.exec(status)?.[1]?.trim() ?? null;
  const rows = body
    .filter((l) => l.trim().startsWith('|'))
    .slice(2)
    .map(readRow)
    .filter((r): r is Row => r !== null);
  return { round, turn: turn === '—' ? null : turn, ended: status.startsWith('Ended'), rows };
}

/** A combatant's name without its member number: `Owlbear 3` → `Owlbear`, `Sable (2)` → `Sable`. */
export function baseName(id: string): string {
  return id.replace(/\s+(?:\d+|\(\d+\))$/, '');
}

/**
 * The fight a table holds, its combatants matched to the fighters the note lists now (by id);
 * a row the note does not list (added mid-fight) takes its fighter from `extras`, by id, and
 * otherwise still fights as a plain combatant.
 */
export function restore(
  table: Table,
  fresh: Fight,
  extras: ReadonlyMap<string, Fighter> = new Map(),
): Fight {
  const byId = new Map(fresh.combatants.map((c) => [c.id, c]));
  const extra = (id: string): (Fighter & { id: string }) | undefined => {
    const f = extras.get(id);
    return f === undefined ? undefined : { ...f, id, group: id === f.name ? f.group : f.name };
  };
  const combatants = table.rows.map((row): Combatant => {
    const base: Fighter & { id: string } = byId.get(row.id) ??
      extra(row.id) ?? {
        id: row.id,
        name: row.id,
        side: 'enemy',
        pc: false,
        ac: row.ac,
        maxHp: row.maxHp,
        initBonus: 0,
        dex: 10,
        path: null,
        monster: null,
        xp: null,
        group: null,
      };
    return {
      ...base,
      ac: row.ac ?? base.ac,
      maxHp: row.maxHp,
      init: row.init,
      hp: row.hp,
      temp: row.temp,
      conditions: row.conditions,
      concentration: row.concentration,
      saves: row.saves,
    };
  });
  return { round: table.round, turn: table.turn, combatants };
}

/** The note without its `## Combat` section (the heading, its lines and the blank line before). */
export function withoutCombat(text: string): string {
  const lines = text.split('\n');
  const at = section(lines);
  if (at === null) return text;
  // The last section takes the blank lines before it along; between sections one blank stays.
  let start = at.start;
  if (at.end === lines.length) {
    while (start > 0 && (lines[start - 1] ?? '').trim() === '') start--;
  }
  lines.splice(start, at.end - start);
  return lines.join('\n').replace(/\n*$/, '\n');
}
