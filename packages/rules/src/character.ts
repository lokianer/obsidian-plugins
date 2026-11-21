// A character as its note stores it (the choices), and its sheet as the engine computes it.

import type { Ability, RuleSet } from './basics';
import type { Recharge, Text } from './model';

/** One level: the class it was taken in, its hit points, and every choice made at it. */
export interface LevelEntry {
  class: string;
  /** `max` (the first level), `average`, or the rolled number. */
  hp: 'max' | 'average' | number;
  /** By `<feature id>/<choice id>`: the chosen ids (an ability once per point). */
  choices: Record<string, string[]>;
}

export interface Character {
  rules: RuleSet;
  species: string;
  background: string;
  /** Base scores, before any increase. */
  abilities: Record<Ability, number>;
  levels: LevelEntry[];
  /** The species', background's and origin feat's choices, by `<feature id>/<choice id>`. */
  choices: Record<string, string[]>;
  inventory: { item: string; equipped?: boolean; quantity?: number }[];
  /** What the engine does not model: `{ to: 'ac', value: 1, why: 'Ring of Protection' }`. */
  bonuses: { to: string; value: number; why: string }[];
}

/**
 * A number and where it comes from. A source's label is an ability (`dex`), `proficiency`,
 * `expertise`, `half-proficiency`, `base`, `bonus` or the id of the feature, feat or item.
 */
export interface Value {
  total: number;
  sources: { label: string; value: number }[];
}

export interface Attack {
  id: string;
  name: Text;
  toHit: Value;
  damage: string;
  type: string;
  properties: string[];
  mastery: string | null;
  proficient: boolean;
}

export interface Spellcasting {
  class: string;
  ability: Ability;
  dc: number;
  attack: number;
  prepared: number;
  cantrips: number;
  list: string;
  /** The cantrip and spell ids chosen for this class, in order. */
  known: string[];
}

export interface Resource {
  id: string;
  name: Text;
  uses: number;
  die: string | null;
  recharge: Recharge;
}

export interface SheetFeature {
  id: string;
  name: Text;
  text: Text;
  level: number;
  /** The class, subclass, species, background or feat id it comes from. */
  from: string;
}

export interface Sheet {
  level: number;
  classes: { id: string; level: number; subclass: string | null }[];
  abilities: Record<Ability, { score: number; modifier: number }>;
  proficiency: number;
  saves: Record<Ability, Value & { proficient: boolean }>;
  /** Every skill the rules know, by id; rank 0.5 is half proficiency. */
  skills: Record<string, Value & { rank: 0 | 0.5 | 1 | 2 }>;
  passive: { perception: number; insight: number; investigation: number };
  initiative: Value;
  speed: number;
  senses: { id: string; range: number }[];
  resistances: string[];
  hp: Value;
  ac: Value;
  attacks: Attack[];
  spellcasting: Spellcasting[];
  /** Spell slots by spell level (index 0 = level 1). */
  slots: number[];
  pact: { level: number; count: number } | null;
  resources: Resource[];
  /** Scaling values of the class tables: Sneak Attack, Martial Arts … */
  scales: { id: string; name: Text; value: number | string }[];
  features: SheetFeature[];
  proficiencies: Record<'armor' | 'weapon' | 'tool' | 'language', string[]>;
  masteries: string[];
  /** Choices not made yet: `level 3: bard-subclass/subclass`, or `<key>` for creation. */
  missing: string[];
  /** Ids the rules do not know: a class, subclass, feat, option or item. */
  unknown: string[];
}
