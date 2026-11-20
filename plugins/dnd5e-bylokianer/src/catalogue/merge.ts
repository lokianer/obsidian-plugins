// Putting the spell lists together: library texts onto catalogue entries, and which entry a name in
// a stat block means. Pure.

import type { SrdSpell } from '../spells/model';
import type { RulesSetting } from './books';

/** A book's full text for one entry, from a library note. */
export interface LibrarySection {
  text: string;
  higher: string;
}

/** Catalogue entries with their library section attached; SRD and own spells stay as they are. */
export function withLibrary(
  spells: readonly SrdSpell[],
  sections: ReadonlyMap<string, LibrarySection>,
): SrdSpell[] {
  return spells.map((spell) => {
    const section = spell.source === undefined ? undefined : sections.get(spell.index);
    return section === undefined ? spell : { ...spell, library: section };
  });
}

const fold = (text: string): string =>
  text.normalize('NFD').replace(/\p{M}/gu, '').replace(/[’']/g, "'").toLowerCase().trim();

/**
 * The spell a name means: an own spell first, then the SRD's, then the catalogue's in the preferred
 * rule set (2024 when both are played), then the other rule set's. English or German names.
 */
export function resolveSpell(
  name: string,
  all: readonly SrdSpell[],
  rules: RulesSetting,
): SrdSpell | null {
  const wanted = fold(name);
  const named = all.filter(
    (s) => fold(s.name) === wanted || (s.nameDe !== undefined && fold(s.nameDe) === wanted),
  );
  return byPreference(named, rules)[0] ?? null;
}

/** Spells in the order a name is looked up: own, SRD, the preferred rule set, the other one. */
export function byPreference(spells: readonly SrdSpell[], rules: RulesSetting): SrdSpell[] {
  const preferred = rules === '2014' ? '2014' : '2024';
  const rank = (s: SrdSpell): number => {
    if (s.path !== undefined) return 0;
    if (s.source === undefined || s.source === 'srd') return 1;
    return s.rules === preferred ? 2 : 3;
  };
  return [...spells].sort((a, b) => rank(a) - rank(b));
}
