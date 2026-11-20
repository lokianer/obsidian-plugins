// The rules as data: what classes, subclasses, species, backgrounds and feats grant level by level,
// and which choices they ask with which options. Only what changes a number or a list on the sheet
// is a grant; everything else is a feature's text. Pure types.

import type { Ability, RuleSet } from './basics';

/** A text in English, with German once translated: the SRD's full text or a summary. */
export interface Text {
  en: string;
  de?: string;
}

/**
 * A number that may depend on the character: fixed, an ability's modifier, the proficiency bonus,
 * or by class level (index 0 = level 1; 20 entries).
 */
export type Amount = number | { ability: Ability } | { proficiency: true } | { byLevel: number[] };

export type Recharge = 'short' | 'long';

export type Grant =
  | {
      kind: 'proficiency';
      what: 'save' | 'skill' | 'armor' | 'weapon' | 'tool' | 'language';
      ids: string[];
    }
  | { kind: 'expertise'; ids: string[] }
  /** An increase; the score never goes past `max` (20 when not given). */
  | { kind: 'ability'; ability: Ability; value: number; max?: number }
  | { kind: 'speed'; value: number }
  | { kind: 'sense'; id: string; range: number }
  | { kind: 'initiative'; add: Amount }
  /** Hit points per character level (Dwarven Toughness). */
  | { kind: 'hp'; perLevel: number }
  /** An armour class formula without armour: base + modifiers, with a shield or not. */
  | { kind: 'ac'; id: string; base: number; add: Ability[]; shield: boolean }
  | {
      kind: 'resource';
      id: string;
      name: Text;
      uses: Amount;
      die?: string | { byLevel: string[] };
      recharge: Recharge | { byLevel: Recharge[] };
    }
  /** Half the proficiency bonus (rounded down) on ability checks without proficiency. */
  | { kind: 'half-proficiency'; to: 'checks' }
  | {
      kind: 'spellcasting';
      ability: Ability;
      progression: 'full' | 'half' | 'third' | 'pact';
      prepared: Amount;
      cantrips: Amount;
      /** The spell list: a class id. */
      list: string;
    };

/** Where a choice's options come from. */
export type OptionSource =
  /** Skills: any, these, or (for expertise) the ones the character is proficient in. */
  | { skills: 'any' | 'proficient' | string[] }
  /** One ability per point; `count` is the number of points. */
  | { abilities: Ability[] }
  | { feats: FeatCategory }
  | { subclasses: string }
  | { spells: string; level: number | 'cantrip' }
  /** Plain ids: tools, languages, armour or weapon kinds. */
  | { list: string[] }
  /** Options with their own grants: a fighting style, an invocation, a draconic ancestry. */
  | { options: Feature[] };

export interface Choice {
  id: string;
  name: Text;
  count: Amount;
  /** What a chosen value becomes. */
  gives:
    | 'skill'
    | 'expertise'
    | 'tool'
    | 'language'
    | 'ability'
    | 'feat'
    | 'subclass'
    | 'spell'
    | 'option';
  from: OptionSource;
}

export interface Feature {
  id: string;
  name: Text;
  /** The class level (or character level, for species) it comes at; 1 when it has none. */
  level: number;
  text: Text;
  grants: Grant[];
  choices: Choice[];
}

export type FeatCategory = 'origin' | 'general' | 'fighting-style' | 'epic-boon';

export interface ClassDef {
  id: string;
  rules: RuleSet;
  name: Text;
  hitDie: number;
  primary: Ability[];
  saves: Ability[];
  /** Every feature, levels 1–20, including the first level's proficiencies and choices. */
  features: Feature[];
  subclassLevel: number;
  multiclass: { requires: Partial<Record<Ability, number>>; grants: Grant[] };
}

export interface SubclassDef {
  id: string;
  class: string;
  rules: RuleSet;
  name: Text;
  /** The book: `srd-5.2.1`, `phb24`, … */
  source: string;
  features: Feature[];
}

export interface SpeciesDef {
  id: string;
  rules: RuleSet;
  name: Text;
  size: string[];
  speed: number;
  features: Feature[];
}

export interface BackgroundDef {
  id: string;
  rules: RuleSet;
  name: Text;
  /** The abilities its increase may go to (2024). */
  abilities: Ability[];
  /** Its origin feat (2024), or '' . */
  feat: string;
  features: Feature[];
}

export interface FeatDef {
  id: string;
  rules: RuleSet;
  name: Text;
  category: FeatCategory;
  repeatable: boolean;
  requires?: { level?: number; ability?: Partial<Record<Ability, number>> };
  features: Feature[];
}

export interface ArmorDef {
  id: string;
  name: Text;
  category: 'light' | 'medium' | 'heavy' | 'shield';
  ac: number;
  /** The most Dexterity adds: null for no limit, 0 for none. */
  dexMax: number | null;
  strength?: number;
  stealth: boolean;
}

export interface WeaponDef {
  id: string;
  name: Text;
  category: 'simple' | 'martial';
  ranged: boolean;
  damage: string;
  type: string;
  properties: string[];
  mastery?: string;
  range?: [number, number];
}

export interface SkillDef {
  id: string;
  ability: Ability;
  name: Text;
}

/** One rule set's (or one book's) records. */
export interface RulesData {
  classes: ClassDef[];
  subclasses: SubclassDef[];
  species: SpeciesDef[];
  backgrounds: BackgroundDef[];
  feats: FeatDef[];
  armor: ArmorDef[];
  weapons: WeaponDef[];
  skills: SkillDef[];
}
