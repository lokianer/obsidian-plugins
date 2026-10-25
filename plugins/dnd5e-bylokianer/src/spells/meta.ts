// What the spellbook shows about a spell, in English or German: names, the level line, casting
// time, range, duration, components and the labels of schools, classes, damage types and saves.
// German distances are metres (5 ft. = 1.5 m), as the maintainer decided. Pure.

import type { Lang } from '../npc/races';
import { DE_NAMES } from './de';
import { DE_TEXTS } from './de-texts';
import type { Ability, School, SpellClass, SrdSpell } from './model';

export const SCHOOLS: readonly School[] = [
  'abjuration',
  'conjuration',
  'divination',
  'enchantment',
  'evocation',
  'illusion',
  'necromancy',
  'transmutation',
];

export const SPELL_CLASSES: readonly SpellClass[] = [
  'bard',
  'cleric',
  'druid',
  'paladin',
  'ranger',
  'sorcerer',
  'warlock',
  'wizard',
];

export const DAMAGE_TYPES = [
  'acid',
  'bludgeoning',
  'cold',
  'fire',
  'force',
  'lightning',
  'necrotic',
  'piercing',
  'poison',
  'psychic',
  'radiant',
  'slashing',
  'thunder',
] as const;

export const ABILITIES: readonly Ability[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

/** Every casting time the SRD's spells use, shortest first; the spell builder offers these. */
export const CASTING_TIMES = [
  '1 action',
  '1 bonus action',
  '1 reaction',
  '1 minute',
  '10 minutes',
  '1 hour',
  '8 hours',
  '12 hours',
  '24 hours',
] as const;

/** Every duration the SRD's spells use, shortest first; concentration is a field of its own. */
export const DURATIONS = [
  'Instantaneous',
  '1 round',
  'Up to 1 round',
  '1 minute',
  'Up to 1 minute',
  '10 minutes',
  'Up to 10 minutes',
  '1 hour',
  'Up to 1 hour',
  'Up to 2 hours',
  '8 hours',
  'Up to 8 hours',
  '24 hours',
  'Up to 24 hours',
  '7 days',
  '10 days',
  '30 days',
  'Until dispelled',
  'Special',
] as const;

const LABELS: Record<Lang, Record<string, string>> = {
  en: {
    abjuration: 'Abjuration',
    conjuration: 'Conjuration',
    divination: 'Divination',
    enchantment: 'Enchantment',
    evocation: 'Evocation',
    illusion: 'Illusion',
    necromancy: 'Necromancy',
    transmutation: 'Transmutation',
    bard: 'Bard',
    cleric: 'Cleric',
    druid: 'Druid',
    paladin: 'Paladin',
    ranger: 'Ranger',
    sorcerer: 'Sorcerer',
    warlock: 'Warlock',
    wizard: 'Wizard',
    acid: 'Acid',
    bludgeoning: 'Bludgeoning',
    cold: 'Cold',
    fire: 'Fire',
    force: 'Force',
    lightning: 'Lightning',
    necrotic: 'Necrotic',
    piercing: 'Piercing',
    poison: 'Poison',
    psychic: 'Psychic',
    radiant: 'Radiant',
    slashing: 'Slashing',
    thunder: 'Thunder',
    str: 'Strength',
    dex: 'Dexterity',
    con: 'Constitution',
    int: 'Intelligence',
    wis: 'Wisdom',
    cha: 'Charisma',
  },
  de: {
    abjuration: 'Bannmagie',
    conjuration: 'Beschwörung',
    divination: 'Erkenntnismagie',
    enchantment: 'Verzauberung',
    evocation: 'Hervorrufung',
    illusion: 'Illusion',
    necromancy: 'Nekromantie',
    transmutation: 'Verwandlung',
    bard: 'Barde',
    cleric: 'Kleriker',
    druid: 'Druide',
    paladin: 'Paladin',
    ranger: 'Waldläufer',
    sorcerer: 'Zauberer',
    warlock: 'Hexenmeister',
    wizard: 'Magier',
    acid: 'Säure',
    bludgeoning: 'Wucht',
    cold: 'Kälte',
    fire: 'Feuer',
    force: 'Energie',
    lightning: 'Blitz',
    necrotic: 'Nekrotisch',
    piercing: 'Stich',
    poison: 'Gift',
    psychic: 'Psychisch',
    radiant: 'Gleißend',
    slashing: 'Hieb',
    thunder: 'Schall',
    str: 'Stärke',
    dex: 'Geschicklichkeit',
    con: 'Konstitution',
    int: 'Intelligenz',
    wis: 'Weisheit',
    cha: 'Charisma',
  },
};

/** The label of a school, class, damage type or ability. */
export function label(key: string, lang: Lang): string {
  return LABELS[lang][key] ?? key;
}

/** The spell's name in a language; English when there is no German one. */
export function spellName(spell: SrdSpell, lang: Lang): string {
  return lang === 'de' ? (DE_NAMES[spell.index] ?? spell.name) : spell.name;
}

const ORDINAL = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];

/** `3rd-level evocation`, `Evocation cantrip`; German `Hervorrufung des 3. Grades`. */
export function levelLine(spell: SrdSpell, lang: Lang): string {
  const school = label(spell.school, lang);
  const ritual = spell.ritual ? (lang === 'de' ? ' (Ritual)' : ' (ritual)') : '';
  if (lang === 'de') {
    return `${spell.level === 0 ? `Zaubertrick der ${school}` : `${school} des ${spell.level}. Grades`}${ritual}`;
  }
  return `${spell.level === 0 ? `${school} cantrip` : `${ORDINAL[spell.level]}-level ${school.toLowerCase()}`}${ritual}`;
}

/** The level as a short label: `Cantrip`, `Level 3` / `Zaubertrick`, `Grad 3`. */
export function levelLabel(level: number, lang: Lang): string {
  if (level === 0) return lang === 'de' ? 'Zaubertrick' : 'Cantrip';
  return lang === 'de' ? `Grad ${level}` : `Level ${level}`;
}

const number = (n: number) => n.toLocaleString('de-DE');

/** Feet in metres and miles in kilometres, as the German books count (5 ft. = 1.5 m). */
const metres = (feet: number) => number(Math.round(feet * 0.3 * 10) / 10);
const kilometres = (miles: number) => number(miles * 1.5);

const UNITS: Record<string, [string, string]> = {
  action: ['Aktion', 'Aktionen'],
  'bonus action': ['Bonusaktion', 'Bonusaktionen'],
  reaction: ['Reaktion', 'Reaktionen'],
  round: ['Runde', 'Runden'],
  minute: ['Minute', 'Minuten'],
  hour: ['Stunde', 'Stunden'],
  day: ['Tag', 'Tage'],
};

/** `1 action`, `10 minutes` → `1 Aktion`, `10 Minuten`; null when the phrase is not one of these. */
function amount(text: string): string | null {
  const match = /^(\d+) (action|bonus action|reaction|round|minute|hour|day)s?$/.exec(text.trim());
  if (match === null) return null;
  const n = Number(match[1]);
  const unit = UNITS[match[2] ?? ''];
  return unit === undefined ? null : `${n} ${n === 1 ? unit[0] : unit[1]}`;
}

/** The casting time in a language. */
export function castingTime(spell: SrdSpell, lang: Lang): string {
  return lang === 'de' ? (amount(spell.casting) ?? spell.casting) : spell.casting;
}

const AREAS: Record<string, string> = {
  cone: 'Kegel',
  cube: 'Würfel',
  cylinder: 'Zylinder',
  line: 'Linie',
  radius: 'Radius',
  sphere: 'Kugel',
};

const PLACES: Record<string, string> = {
  Self: 'Selbst',
  Touch: 'Berührung',
  Sight: 'Sicht',
  Special: 'Speziell',
  Unlimited: 'Unbegrenzt',
};

/** The range in a language: `150 feet` → `45 m`, `Self (15-foot cone)` → `Selbst (4,5-m-Kegel)`. */
export function range(spell: SrdSpell, lang: Lang): string {
  if (lang === 'en') return spell.range;
  const text = spell.range.trim();
  const feet = /^(\d+) feet$/.exec(text);
  if (feet !== null) return `${metres(Number(feet[1]))} m`;
  const miles = /^(\d+) miles?$/.exec(text);
  if (miles !== null) return `${kilometres(Number(miles[1]))} km`;
  const area = /^Self \((\d+)-foot (\w+)\)$/.exec(text);
  if (area !== null) {
    return `Selbst (${metres(Number(area[1]))}-m-${AREAS[area[2] ?? ''] ?? area[2] ?? ''})`;
  }
  return PLACES[text] ?? text;
}

/** The duration in a language: `Concentration, up to 1 minute` / `Konzentration, bis zu 1 Minute`. */
export function duration(spell: SrdSpell, lang: Lang): string {
  const text = spell.duration.trim();
  const upTo = /^Up to (.+)$/.exec(text);
  if (lang === 'en') {
    return spell.concentration && upTo !== null ? `Concentration, up to ${upTo[1]}` : text;
  }
  if (upTo !== null) {
    const span = amount(upTo[1] ?? '') ?? upTo[1] ?? '';
    return spell.concentration ? `Konzentration, bis zu ${span}` : `Bis zu ${span}`;
  }
  const fixed: Record<string, string> = {
    Instantaneous: 'Unmittelbar',
    'Until dispelled': 'Bis gebannt',
    Special: 'Speziell',
  };
  return fixed[text] ?? amount(text) ?? text;
}

/** `V, S, M` — German `V, G, M` (verbal, gestisch, materiell). */
export function components(spell: SrdSpell, lang: Lang): string {
  return spell.components.map((c) => (lang === 'de' && c === 'S' ? 'G' : c)).join(', ');
}

/** The description, "At Higher Levels" and material in a language; English where German is missing. */
export function spellText(
  spell: SrdSpell,
  lang: Lang,
): { text: string; higher: string; material: string } {
  const de = lang === 'de' ? DE_TEXTS[spell.index] : undefined;
  return {
    text: de?.text ?? spell.text,
    higher: de?.higher ?? spell.higher,
    material: de?.material ?? spell.material,
  };
}
