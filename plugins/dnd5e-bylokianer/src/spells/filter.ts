// Searching and filtering the spellbook. Groups combine with AND, the values inside a group with OR
// (level 1 or 2, and Wizard). The search finds English and German names, ignoring case and
// accents. Pure.

import { DE_NAMES } from './de';
import type { Ability, School, SpellClass, SrdSpell } from './model';

export type CastingKind = 'action' | 'bonus' | 'reaction' | 'longer';

export interface SpellFilters {
  query: string;
  levels: number[];
  schools: School[];
  classes: SpellClass[];
  casting: CastingKind[];
  damage: string[];
  saves: Ability[];
  /** Only rituals. */
  ritual: boolean;
  concentration: 'any' | 'only' | 'none';
}

export const NO_FILTERS: SpellFilters = {
  query: '',
  levels: [],
  schools: [],
  classes: [],
  casting: [],
  damage: [],
  saves: [],
  ritual: false,
  concentration: 'any',
};

/** Lower case, without accents, `ß` as `ss`: `Säure` and `saure` meet. */
function fold(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').replace(/ß/g, 'ss').toLowerCase();
}

function castingKind(spell: SrdSpell): CastingKind {
  if (spell.casting === '1 action') return 'action';
  if (spell.casting === '1 bonus action') return 'bonus';
  if (spell.casting === '1 reaction') return 'reaction';
  return 'longer';
}

/** Whether a spell passes every filter except the one named in `skip`. */
function passes(spell: SrdSpell, filters: SpellFilters, skip?: keyof SpellFilters): boolean {
  const any = <V>(key: keyof SpellFilters, chosen: readonly V[], has: (v: V) => boolean) =>
    key === skip || chosen.length === 0 || chosen.some(has);
  const words = fold(filters.query).split(/\s+/).filter(Boolean);
  const names = fold(`${spell.name} ${DE_NAMES[spell.index] ?? ''}`);
  return (
    words.every((w) => names.includes(w)) &&
    any('levels', filters.levels, (l) => spell.level === l) &&
    any('schools', filters.schools, (s) => spell.school === s) &&
    any('classes', filters.classes, (c) => spell.classes.includes(c)) &&
    any('casting', filters.casting, (k) => castingKind(spell) === k) &&
    any('damage', filters.damage, (d) => spell.damage.includes(d)) &&
    any('saves', filters.saves, (a) => spell.save === a) &&
    (!filters.ritual || spell.ritual) &&
    (filters.concentration === 'any' || spell.concentration === (filters.concentration === 'only'))
  );
}

/** The spells passing the filters, by level, then name in `nameOf`'s language. */
export function filterSpells(
  spells: readonly SrdSpell[],
  filters: SpellFilters,
  nameOf: (spell: SrdSpell) => string,
): SrdSpell[] {
  return spells
    .filter((s) => passes(s, filters))
    .sort((a, b) => a.level - b.level || nameOf(a).localeCompare(nameOf(b)));
}

/** How many spells each level chip would show, given every other filter. */
export function levelCounts(spells: readonly SrdSpell[], filters: SpellFilters): number[] {
  const counts = Array.from({ length: 10 }, () => 0);
  for (const spell of spells) {
    if (passes(spell, filters, 'levels')) counts[spell.level] = (counts[spell.level] ?? 0) + 1;
  }
  return counts;
}

/** Whether any filter or the search is set. */
export function isFiltered(filters: SpellFilters): boolean {
  return JSON.stringify(filters) !== JSON.stringify(NO_FILTERS);
}

/** Filters read back from plugin data, anything unknown dropped. */
export function readFilters(data: unknown): SpellFilters {
  const d = (typeof data === 'object' && data !== null ? data : {}) as Partial<SpellFilters>;
  const list = <V>(value: unknown, ok: (v: unknown) => v is V): V[] =>
    Array.isArray(value) ? value.filter(ok) : [];
  const str = (v: unknown): v is string => typeof v === 'string';
  return {
    query: typeof d.query === 'string' ? d.query : '',
    levels: list(d.levels, (v): v is number => typeof v === 'number' && v >= 0 && v <= 9),
    schools: list(d.schools, str) as School[],
    classes: list(d.classes, str) as SpellClass[],
    casting: list(d.casting, str) as CastingKind[],
    damage: list(d.damage, str),
    saves: list(d.saves, str) as Ability[],
    ritual: d.ritual === true,
    concentration:
      d.concentration === 'only' || d.concentration === 'none' ? d.concentration : 'any',
  };
}
