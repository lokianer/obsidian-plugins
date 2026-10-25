// The twelve classes of the SRD 5.1 for the New NPC dialog: the English name goes into `class:`,
// the label and the short line (hit die, main abilities) show in the dialog's language. A class
// only describes the NPC; its stat block comes from the archetype. Pure.

import type { Lang } from './races';

export interface NpcClass {
  /** As written into `class:` (English). */
  name: string;
  label: Record<Lang, string>;
  /** Lucide icon of the tile. */
  icon: string;
  hitDie: number;
  /** Main abilities, as English abbreviations. */
  abilities: readonly ('STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA')[];
}

export const CLASSES: readonly NpcClass[] = [
  {
    name: 'Barbarian',
    label: { en: 'Barbarian', de: 'Barbar' },
    icon: 'flame',
    hitDie: 12,
    abilities: ['STR'],
  },
  {
    name: 'Bard',
    label: { en: 'Bard', de: 'Barde' },
    icon: 'music',
    hitDie: 8,
    abilities: ['CHA'],
  },
  {
    name: 'Cleric',
    label: { en: 'Cleric', de: 'Kleriker' },
    icon: 'sun',
    hitDie: 8,
    abilities: ['WIS'],
  },
  {
    name: 'Druid',
    label: { en: 'Druid', de: 'Druide' },
    icon: 'trees',
    hitDie: 8,
    abilities: ['WIS'],
  },
  {
    name: 'Fighter',
    label: { en: 'Fighter', de: 'Kämpfer' },
    icon: 'swords',
    hitDie: 10,
    abilities: ['STR', 'DEX'],
  },
  {
    name: 'Monk',
    label: { en: 'Monk', de: 'Mönch' },
    icon: 'hand',
    hitDie: 8,
    abilities: ['DEX', 'WIS'],
  },
  {
    name: 'Paladin',
    label: { en: 'Paladin', de: 'Paladin' },
    icon: 'shield-check',
    hitDie: 10,
    abilities: ['STR', 'CHA'],
  },
  {
    name: 'Ranger',
    label: { en: 'Ranger', de: 'Waldläufer' },
    icon: 'target',
    hitDie: 10,
    abilities: ['DEX', 'WIS'],
  },
  {
    name: 'Rogue',
    label: { en: 'Rogue', de: 'Schurke' },
    icon: 'key-round',
    hitDie: 8,
    abilities: ['DEX'],
  },
  {
    name: 'Sorcerer',
    label: { en: 'Sorcerer', de: 'Zauberer' },
    icon: 'sparkles',
    hitDie: 6,
    abilities: ['CHA'],
  },
  {
    name: 'Warlock',
    label: { en: 'Warlock', de: 'Hexenmeister' },
    icon: 'eye',
    hitDie: 8,
    abilities: ['CHA'],
  },
  {
    name: 'Wizard',
    label: { en: 'Wizard', de: 'Magier' },
    icon: 'wand-sparkles',
    hitDie: 6,
    abilities: ['INT'],
  },
];

const ABILITIES: Record<Lang, Record<NpcClass['abilities'][number], string>> = {
  en: { STR: 'STR', DEX: 'DEX', CON: 'CON', INT: 'INT', WIS: 'WIS', CHA: 'CHA' },
  de: { STR: 'STÄ', DEX: 'GES', CON: 'KON', INT: 'INT', WIS: 'WEI', CHA: 'CHA' },
};

/** `d10 · STR, DEX`, in German `W10 · STÄ, GES`. */
export function classLine(cls: NpcClass, lang: Lang): string {
  const die = `${lang === 'de' ? 'W' : 'd'}${cls.hitDie}`;
  return `${die} · ${cls.abilities.map((a) => ABILITIES[lang][a]).join(', ')}`;
}

/** Classes whose English name or label contains every word of the query. */
export function searchClasses(query: string, lang: Lang): NpcClass[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return CLASSES.filter((c) =>
    words.every((w) => `${c.name} ${c.label[lang]}`.toLowerCase().includes(w)),
  );
}
