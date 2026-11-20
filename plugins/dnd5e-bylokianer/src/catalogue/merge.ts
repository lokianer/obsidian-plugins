// Putting the spell lists together: library texts onto catalogue entries, and the order in which a
// name in a stat block finds its spell. Pure.

import type { SrdMonster } from '../monsters/model';
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

/** What `byPreference` ranks by. */
interface Ranked {
  path?: string;
  source?: string;
  rules?: string;
}

/** Entries in the order a name is looked up: own, SRD, the preferred rule set, the other one. */
export function byPreference<E extends Ranked>(entries: readonly E[], rules: RulesSetting): E[] {
  const preferred = rules === '2014' ? '2014' : '2024';
  const rank = (s: E): number => {
    if (s.path !== undefined) return 0;
    if (s.source === undefined || s.source === 'srd') return 1;
    return s.rules === preferred ? 2 : 3;
  };
  return [...entries].sort((a, b) => rank(a) - rank(b));
}

/** The YAML of the first stat block (`dnd5e-statblock` or `statblock`) in a library section. */
function statblockOf(text: string): string | null {
  const m = /^```(?:dnd5e-)?statblock[^\n]*\n([\s\S]*?)\n```/m.exec(text);
  return m?.[1] ?? null;
}

/**
 * Catalogue monsters with the full stat block of their library section; others stay as they are.
 * A block `parses` rejects (a YAML slip in a GM's note) leaves the short block in place.
 */
export function withMonsterLibrary(
  monsters: readonly SrdMonster[],
  sections: ReadonlyMap<string, LibrarySection>,
  parses: (yaml: string) => boolean,
): SrdMonster[] {
  return monsters.map((m) => {
    const section = m.source === undefined ? undefined : sections.get(m.index);
    const yaml = section === undefined ? null : statblockOf(section.text);
    return yaml === null || !parses(yaml) ? m : { ...m, yaml, fromLibrary: true };
  });
}
