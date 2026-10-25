// Searching and filtering the Monster Manual, like the spellbook: groups combine with AND, the values
// inside a group with OR. The search finds English and German names, ignoring case and accents. Pure.

import { crValue } from '../npc/statblock';
import { DE_NAMES } from './de';
import type { Movement, SrdMonster } from './model';

/** Challenge ratings in five bands: 0–½, 1–4, 5–10, 11–16, 17 and up. */
export const BANDS = ['0', '1', '5', '11', '17'] as const;
export type Band = (typeof BANDS)[number];

export interface MonsterFilters {
  query: string;
  bands: Band[];
  types: string[];
  sizes: string[];
  moves: Movement[];
  legendary: boolean;
  spellcaster: boolean;
}

export const NO_FILTERS: MonsterFilters = {
  query: '',
  bands: [],
  types: [],
  sizes: [],
  moves: [],
  legendary: false,
  spellcaster: false,
};

/** The band a challenge rating falls in. */
export function bandOf(cr: string): Band {
  const n = crValue(cr) ?? 0;
  return n >= 17 ? '17' : n >= 11 ? '11' : n >= 5 ? '5' : n >= 1 ? '1' : '0';
}

/** A band's label: `CR 0–½`, `CR 17+`. */
export function bandLabel(band: Band): string {
  return { '0': '0–½', '1': '1–4', '5': '5–10', '11': '11–16', '17': '17+' }[band];
}

const fold = (text: string) =>
  text.normalize('NFD').replace(/\p{M}/gu, '').replace(/ß/g, 'ss').toLowerCase();

function passes(m: SrdMonster, f: MonsterFilters, skip?: keyof MonsterFilters): boolean {
  const any = <V>(key: keyof MonsterFilters, chosen: readonly V[], has: (v: V) => boolean) =>
    key === skip || chosen.length === 0 || chosen.some(has);
  const words = fold(f.query).split(/\s+/).filter(Boolean);
  const names = fold(`${m.name} ${DE_NAMES[m.index] ?? ''}`);
  return (
    words.every((w) => names.includes(w)) &&
    any('bands', f.bands, (b) => bandOf(m.cr) === b) &&
    any('types', f.types, (t) => m.type === t) &&
    any('sizes', f.sizes, (s) => m.size === s) &&
    any('moves', f.moves, (v) => m.moves.includes(v)) &&
    (!f.legendary || m.legendary) &&
    (!f.spellcaster || m.spellcaster)
  );
}

/** The monsters passing the filters, by challenge rating, then name in `nameOf`'s language. */
export function filterMonsters(
  monsters: readonly SrdMonster[],
  filters: MonsterFilters,
  nameOf: (m: SrdMonster) => string,
): SrdMonster[] {
  return monsters
    .filter((m) => passes(m, filters))
    .sort(
      (a, b) => (crValue(a.cr) ?? 0) - (crValue(b.cr) ?? 0) || nameOf(a).localeCompare(nameOf(b)),
    );
}

/** How many monsters each band chip would show, given every other filter. */
export function bandCounts(
  monsters: readonly SrdMonster[],
  filters: MonsterFilters,
): Record<Band, number> {
  const counts = { '0': 0, '1': 0, '5': 0, '11': 0, '17': 0 };
  for (const m of monsters) if (passes(m, filters, 'bands')) counts[bandOf(m.cr)]++;
  return counts;
}

export function isFiltered(filters: MonsterFilters): boolean {
  return JSON.stringify(filters) !== JSON.stringify(NO_FILTERS);
}

/** Filters read back from plugin data, anything unknown dropped. */
export function readFilters(data: unknown): MonsterFilters {
  const d = (typeof data === 'object' && data !== null ? data : {}) as Partial<MonsterFilters>;
  const list = (value: unknown): string[] =>
    Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
  return {
    query: typeof d.query === 'string' ? d.query : '',
    bands: list(d.bands).filter((b): b is Band => (BANDS as readonly string[]).includes(b)),
    types: list(d.types),
    sizes: list(d.sizes),
    moves: list(d.moves) as Movement[],
    legendary: d.legendary === true,
    spellcaster: d.spellcaster === true,
  };
}
