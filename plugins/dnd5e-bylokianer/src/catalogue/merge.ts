// Putting the spell lists together: library texts onto catalogue entries, and the order in which a
// name in a stat block finds its spell. Pure.

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
