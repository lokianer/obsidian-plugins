// Spells for the spellbook: the type the SRD data is written in.

import type { BookKey, Rules } from '../catalogue/books';

export type School =
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation';

export type SpellClass =
  'bard' | 'cleric' | 'druid' | 'paladin' | 'ranger' | 'sorcerer' | 'warlock' | 'wizard';

export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface SrdSpell {
  /** A stable key: `fireball`, `acid-arrow`. */
  index: string;
  name: string;
  /** 0 for a cantrip. */
  level: number;
  school: School;
  casting: string;
  range: string;
  components: readonly ('V' | 'S' | 'M')[];
  material: string;
  duration: string;
  concentration: boolean;
  ritual: boolean;
  classes: readonly SpellClass[];
  damage: readonly string[];
  save: Ability | null;
  attack: 'melee' | 'ranged' | null;
  /** The description, Markdown. */
  text: string;
  /** "At Higher Levels", Markdown; empty when the spell has none. */
  higher: string;
  /** An own spell's note; absent for the SRD's spells. */
  path?: string;
  /** The rule set; set on catalogue entries (and on SRD spells when merged). */
  rules?: Rules;
  /** The book a catalogue entry comes from; absent for the SRD's and own spells. */
  source?: BookKey | 'srd';
  /** A catalogue entry's German name (the SRD's are in `DE_NAMES`). */
  nameDe?: string;
  /** A catalogue entry's summary in our own words; its `text` is empty. */
  summary?: { en: string; de: string };
  /** A catalogue entry's full text, from the GM's library note. */
  library?: { text: string; higher: string };
}

/** A spell's German text, by spell index: description, "At Higher Levels" and the material. */
export interface DeText {
  text: string;
  higher?: string;
  material?: string;
}
