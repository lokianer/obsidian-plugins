// Spells for the spellbook: the type the SRD data is written in.

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
}

/** A spell's German text, by spell index: description, "At Higher Levels" and the material. */
export interface DeText {
  text: string;
  higher?: string;
  material?: string;
}
