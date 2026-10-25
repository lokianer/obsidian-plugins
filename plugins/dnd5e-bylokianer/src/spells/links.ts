// Spell names in a stat block's Spellcasting trait: where in a text the names of known spells are,
// in English or German, whole words only, the longest name first ("greater invisibility" before
// "invisibility"). Pure.

import { spellName } from './meta';
import type { SrdSpell } from './model';

export interface SpellMatch {
  start: number;
  end: number;
  index: string;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A finder of spell names in a text, built once for a list of spells. */
export function spellFinder(spells: readonly SrdSpell[]): (text: string) => SpellMatch[] {
  const byName = new Map<string, string>();
  for (const spell of spells) {
    for (const name of [spell.name, spellName(spell, 'de')]) {
      const key = name.toLowerCase();
      if (!byName.has(key)) byName.set(key, spell.index);
    }
  }
  const names = [...byName.keys()].sort((a, b) => b.length - a.length);
  if (names.length === 0) return () => [];
  const pattern = new RegExp(
    `(?<![\\p{L}\\p{N}])(${names.map(escape).join('|')})(?![\\p{L}\\p{N}])`,
    'giu',
  );
  return (text) =>
    [...text.matchAll(pattern)].map((m) => ({
      start: m.index,
      end: m.index + m[0].length,
      index: byName.get(m[0].toLowerCase()) ?? '',
    }));
}

/** Whether an entry of a stat block lists spells: its name says Spellcasting (or Zauber…). */
export const listsSpells = (name: string): boolean => /spellcasting|zauber/i.test(name);
