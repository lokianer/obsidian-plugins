// Monsters for the Monster Manual: the type the SRD data is written in.

import type { BookKey, Rules } from '../catalogue/books';

export type Movement = 'fly' | 'swim' | 'burrow' | 'climb';

export interface SrdMonster {
  /** A stable key: `adult-red-dragon`. */
  index: string;
  name: string;
  /** As the SRD writes it: `1/4`, `5`. */
  cr: string;
  /** The base type (`dragon`, `beast`); swarms of Tiny beasts are `swarm`. */
  type: string;
  size: string;
  ac: number;
  hp: number;
  moves: readonly Movement[];
  legendary: boolean;
  spellcaster: boolean;
  /** The stat block as YAML in the plugin's format. */
  yaml: string;
  /** An own monster's note; absent for the SRD's monsters. */
  path?: string;
  /** The rule set; set on catalogue entries. */
  rules?: Rules;
  /** The book a catalogue entry comes from; absent for the SRD's and own monsters. */
  source?: BookKey;
  /** A catalogue entry's German name (the SRD's are in `DE_NAMES`). */
  nameDe?: string;
  /** A catalogue entry's summary in our own words. */
  summary?: { en: string; de: string };
  /** A catalogue entry's `yaml` is the full stat block from the GM's library note. */
  fromLibrary?: boolean;
}

/** One entry of a stat block in German: its name and its text. */
export type DeEntry = readonly [name: string, desc: string];

/** A monster's traits and actions in German, list by list in the order of the English block. */
export interface DeMonsterText {
  traits?: readonly DeEntry[];
  actions?: readonly DeEntry[];
  bonusActions?: readonly DeEntry[];
  reactions?: readonly DeEntry[];
  /** The paragraph above the legendary actions. */
  legendary?: string;
  legendaryActions?: readonly DeEntry[];
}
