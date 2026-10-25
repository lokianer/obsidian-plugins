// Monsters for the Monster Manual: the type the SRD data is written in.

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
}
