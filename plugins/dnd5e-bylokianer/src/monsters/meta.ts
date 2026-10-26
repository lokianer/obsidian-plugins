// What the Monster Manual shows about a monster, in English or German: names, sizes and types, and a
// stat block's header and lines in German — sizes and types declined as the German books write them
// ("Großer Drache"), alignments, armour, speeds and senses in metres (5 ft. = 1.5 m), languages,
// damage types, conditions, saves and skills; and an SRD monster's traits and actions in German. Pure.

import type { Lang } from '../npc/races';
import type { Bonus, Entry, Statblock } from '../npc/statblock';
import { DE_NAMES } from './de';
import { DE_TEXTS } from './de-texts';
import type { DeEntry, Movement, SrdMonster } from './model';

export const SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'] as const;

export const TYPES = [
  'aberration',
  'beast',
  'celestial',
  'construct',
  'dragon',
  'elemental',
  'fey',
  'fiend',
  'giant',
  'humanoid',
  'monstrosity',
  'ooze',
  'plant',
  'swarm',
  'undead',
] as const;

export const MOVES: readonly Movement[] = ['fly', 'swim', 'burrow', 'climb'];

/** The monster's name in a language; English when there is no German one. */
export function monsterName(monster: Pick<SrdMonster, 'index' | 'name'>, lang: Lang): string {
  return lang === 'de' ? (DE_NAMES[monster.index] ?? monster.name) : monster.name;
}

type Gender = 'm' | 'f' | 'n';

/** Each type as a German noun with its gender, and the label of the filter chip. */
const TYPE_DE: Record<string, [string, Gender]> = {
  aberration: ['Aberration', 'f'],
  beast: ['Tier', 'n'],
  celestial: ['Himmelswesen', 'n'],
  construct: ['Konstrukt', 'n'],
  dragon: ['Drache', 'm'],
  elemental: ['Elementar', 'n'],
  fey: ['Feenwesen', 'n'],
  fiend: ['Unhold', 'm'],
  giant: ['Riese', 'm'],
  humanoid: ['Humanoider', 'm'],
  monstrosity: ['Monstrosität', 'f'],
  ooze: ['Schleim', 'm'],
  plant: ['Pflanze', 'f'],
  swarm: ['Schwarm', 'm'],
  undead: ['Untoter', 'm'],
};

const TYPE_EN: Record<string, string> = {
  swarm: 'Swarm',
};

const SIZE_DE: Record<string, string> = {
  Tiny: 'Winzig',
  Small: 'Klein',
  Medium: 'Mittelgroß',
  Large: 'Groß',
  Huge: 'Riesig',
  Gargantuan: 'Gigantisch',
};

/** A type's label for a chip: `Dragon` / `Drache`. */
export function typeLabel(type: string, lang: Lang): string {
  if (lang === 'de') return TYPE_DE[type]?.[0] ?? type;
  return TYPE_EN[type] ?? type.charAt(0).toUpperCase() + type.slice(1);
}

/** A size's label: `Large` / `Groß`. */
export const sizeLabel = (size: string, lang: Lang): string =>
  lang === 'de' ? (SIZE_DE[size] ?? size) : size;

/** The size declined for a German noun of that gender: Groß → Großer, Große, Großes. */
function declined(size: string, gender: Gender): string {
  const base = SIZE_DE[size] ?? size;
  return `${base}${gender === 'm' ? 'er' : gender === 'f' ? 'e' : 'es'}`;
}

/** Feet as German metres: `30 ft.` → `9 m`, `5 feet` → `1,5 m`. */
function metres(text: string): string {
  return text.replace(/(\d+)\s*(?:ft\.|feet|foot)/g, (_, n: string) => {
    const m = Math.round(Number(n) * 0.3 * 10) / 10;
    return `${m.toLocaleString('de-DE')} m`;
  });
}

/** Replaces whole words or phrases from a table, longest first, ignoring case where asked. */
function words(text: string, table: Record<string, string>): string {
  const keys = Object.keys(table).sort((a, b) => b.length - a.length);
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // The letter before is matched, not looked behind: iOS before 16.4 has no lookbehind.
  const pattern = new RegExp(`(^|[^\\p{L}])(${keys.map(escape).join('|')})(?![\\p{L}])`, 'gu');
  return text.replace(pattern, (_, before: string, word: string) => before + (table[word] ?? word));
}

const ALIGNMENTS: Record<string, string> = {
  'lawful good': 'rechtschaffen gut',
  'neutral good': 'neutral gut',
  'chaotic good': 'chaotisch gut',
  'lawful neutral': 'rechtschaffen neutral',
  neutral: 'neutral',
  'chaotic neutral': 'chaotisch neutral',
  'lawful evil': 'rechtschaffen böse',
  'neutral evil': 'neutral böse',
  'chaotic evil': 'chaotisch böse',
  unaligned: 'gesinnungslos',
  'any alignment': 'beliebige Gesinnung',
  'any chaotic alignment': 'beliebige chaotische Gesinnung',
  'any evil alignment': 'beliebige böse Gesinnung',
  'any non-good alignment': 'beliebige nicht gute Gesinnung',
  'any non-lawful alignment': 'beliebige nicht rechtschaffene Gesinnung',
};

const SUBTYPES: Record<string, string> = {
  'any race': 'beliebiges Volk',
  demon: 'Dämon',
  devil: 'Teufel',
  dwarf: 'Zwerg',
  elf: 'Elf',
  gnoll: 'Gnoll',
  gnome: 'Gnom',
  goblinoid: 'Goblinoid',
  grimlock: 'Grimlock',
  human: 'Mensch',
  kobold: 'Kobold',
  lizardfolk: 'Echsenmensch',
  merfolk: 'Meervolk',
  orc: 'Ork',
  sahuagin: 'Sahuagin',
  shapechanger: 'Gestaltwandler',
  titan: 'Titan',
};

const ARMOUR: Record<string, string> = {
  'natural armor': 'natürliche Rüstung',
  'leather armor': 'Lederrüstung',
  'studded leather armor': 'beschlagene Lederrüstung',
  'hide armor': 'Fellrüstung',
  'chain shirt': 'Kettenhemd',
  'chain mail': 'Kettenpanzer',
  'scale mail': 'Schuppenpanzer',
  breastplate: 'Brustplatte',
  'splint armor': 'Schienenpanzer',
  'plate armor': 'Plattenpanzer',
  shield: 'Schild',
  'patchwork armor': 'Flickenrüstung',
  'armor scraps': 'Rüstungsreste',
  'barding scraps': 'Reste einer Rossrüstung',
  armor: 'Rüstung',
  with: 'mit',
  barkskin: 'Baumrinde',
  'mage armor': 'Magierrüstung',
  while: 'wenn',
  prone: 'liegend',
};

const MOVEMENT: Record<string, string> = {
  burrow: 'Graben',
  climb: 'Klettern',
  fly: 'Fliegen',
  swim: 'Schwimmen',
  hover: 'Schweben',
};

const SENSES: Record<string, string> = {
  blindsight: 'Blindsicht',
  darkvision: 'Dunkelsicht',
  tremorsense: 'Erschütterungssinn',
  truesight: 'Wahrsicht',
  'passive Perception': 'passive Wahrnehmung',
  'blind beyond this radius': 'jenseits davon blind',
};

const LANGUAGES: Record<string, string> = {
  Common: 'Gemeinsprache',
  common: 'Gemeinsprache',
  Draconic: 'Drakonisch',
  Elvish: 'Elfisch',
  Dwarvish: 'Zwergisch',
  Giant: 'Riesisch',
  Gnomish: 'Gnomisch',
  Goblin: 'Goblinisch',
  Orc: 'Orkisch',
  Abyssal: 'Abyssisch',
  Celestial: 'Celestisch',
  Infernal: 'Infernalisch',
  infernal: 'Infernalisch',
  Primordial: 'Urtümlich',
  Aquan: 'Aqual',
  Auran: 'Aural',
  Ignan: 'Ignal',
  Terran: 'Terral',
  Sylvan: 'Sylvanisch',
  Undercommon: 'Gemeinsprache der Unterreiche',
  'Deep Speech': 'Tiefensprache',
  Druidic: 'Druidisch',
  "Thieves' cant": 'Diebessprache',
  'Blink Dog': 'Blinkhund',
  'Giant Eagle': 'Riesenadler',
  'Giant Elk': 'Riesenelch',
  'Giant Owl': 'Rieseneule',
  'Winter Wolf': 'Winterwolf',
  Worg: 'Worg',
  Sphinx: 'Sphinx',
  Gnoll: 'Gnoll',
  Otyugh: 'Otyugh',
  Sahuagin: 'Sahuagin',
  telepathy: 'Telepathie',
  all: 'alle',
  and: 'und',
  'any one language': 'eine beliebige Sprache',
  'any two languages': 'zwei beliebige Sprachen',
  'any four languages': 'vier beliebige Sprachen',
  'any six languages': 'sechs beliebige Sprachen',
  'usually Common': 'meist Gemeinsprache',
  'plus up to five other languages': 'und bis zu fünf weitere Sprachen',
  'plus any two languages': 'und zwei beliebige Sprachen',
  'any languages it knew in life': 'die Sprachen, die es zu Lebzeiten kannte',
  'the languages it knew in life': 'die Sprachen, die es zu Lebzeiten kannte',
  'all languages it knew in life': 'alle Sprachen, die es zu Lebzeiten kannte',
  'all languages it spoke in life': 'alle Sprachen, die es zu Lebzeiten sprach',
  'one language known by its creator': 'eine Sprache, die sein Erschaffer kennt',
  'the languages of its creator': 'die Sprachen seines Erschaffers',
  'commands given in any language': 'Befehle in jeder Sprache',
  understands: 'versteht',
  "but doesn't speak it": ', spricht sie aber nicht',
  "but can't speak it": ', kann sie aber nicht sprechen',
  "but can't speak": ', kann aber nicht sprechen',
  "can't speak in boar form": 'kann in Ebergestalt nicht sprechen',
  'works only with creatures that understand Abyssal':
    'funktioniert nur mit Kreaturen, die Abyssisch verstehen',
};

const DAMAGE: Record<string, string> = {
  acid: 'Säure',
  bludgeoning: 'Wucht',
  cold: 'Kälte',
  fire: 'Feuer',
  force: 'Energie',
  lightning: 'Blitz',
  necrotic: 'nekrotisch',
  piercing: 'Stich',
  poison: 'Gift',
  psychic: 'psychisch',
  radiant: 'gleißend',
  slashing: 'Hieb',
  thunder: 'Schall',
  and: 'und',
  'from nonmagical weapons': 'durch nichtmagische Waffen',
  'from nonmagical attacks': 'durch nichtmagische Angriffe',
  "that aren't silvered": 'die nicht versilbert sind',
  "that aren't adamantine": 'die nicht aus Adamant sind',
  'from stoneskin': 'durch Steinhaut',
  'damage from spells': 'Schaden durch Zauber',
  'from magic weapons wielded by good creatures':
    'durch magische Waffen in den Händen guter Kreaturen',
};

const CONDITIONS: Record<string, string> = {
  blinded: 'blind',
  charmed: 'bezaubert',
  deafened: 'taub',
  exhaustion: 'Erschöpfung',
  frightened: 'verängstigt',
  grappled: 'gepackt',
  paralyzed: 'gelähmt',
  petrified: 'versteinert',
  poisoned: 'vergiftet',
  prone: 'liegend',
  restrained: 'festgesetzt',
  stunned: 'betäubt',
  unconscious: 'bewusstlos',
};

const SAVES: Record<string, string> = {
  str: 'Str',
  dex: 'Ges',
  con: 'Kon',
  int: 'Int',
  wis: 'Wei',
  cha: 'Cha',
};

/** The SRD skills' German names, by the key a stat block uses. */
export const GERMAN_SKILLS: Record<string, string> = {
  acrobatics: 'Akrobatik',
  animal_handling: 'Mit Tieren umgehen',
  arcana: 'Arkane Kunde',
  athletics: 'Athletik',
  deception: 'Täuschen',
  history: 'Geschichte',
  insight: 'Motiv erkennen',
  intimidation: 'Einschüchtern',
  investigation: 'Nachforschungen',
  medicine: 'Heilkunde',
  nature: 'Naturkunde',
  perception: 'Wahrnehmung',
  performance: 'Auftreten',
  persuasion: 'Überzeugen',
  religion: 'Religion',
  sleight_of_hand: 'Fingerfertigkeit',
  stealth: 'Heimlichkeit',
  survival: 'Überlebenskunst',
};

const renamed = (list: Bonus[], table: Record<string, string>): Bonus[] =>
  list.map((b) => ({ ...b, key: table[b.key] ?? b.key }));

const or = (value: string | null, map: (v: string) => string): string | null =>
  value === null ? null : map(value);

/**
 * An SRD monster's traits, actions, reactions and legendary actions in German; a list whose German
 * entries do not match it one for one (an own monster, an edited block) stays as it is.
 */
export function germanTexts(block: Statblock, index: string): Statblock {
  const de = DE_TEXTS[index];
  if (de === undefined) return block;
  const swap = (list: Entry[], rows: readonly DeEntry[] | undefined): Entry[] =>
    rows !== undefined && rows.length === list.length
      ? rows.map(([name, desc]) => ({ name, desc }))
      : list;
  return {
    ...block,
    traits: swap(block.traits, de.traits),
    actions: swap(block.actions, de.actions),
    bonusActions: swap(block.bonusActions, de.bonusActions),
    reactions: swap(block.reactions, de.reactions),
    legendaryDescription:
      block.legendaryDescription !== null && de.legendary !== undefined
        ? de.legendary
        : block.legendaryDescription,
    legendaryActions: swap(block.legendaryActions, de.legendaryActions),
  };
}

/** A stat block's header and lines in German; its name, traits and actions as they are. */
export function germanBlock(block: Statblock, name: string): Statblock {
  const type = block.type ?? '';
  // The SRD's only swarms are of Tiny beasts.
  const swarm = type.startsWith('swarm');
  const [typeDe, gender] = TYPE_DE[swarm ? 'swarm' : type] ?? [type, 'n'];
  return {
    ...block,
    name,
    size: or(block.size, (s) => declined(s, gender)),
    type: swarm ? 'Schwarm winziger Tiere' : typeDe,
    subtype: or(block.subtype, (s) => SUBTYPES[s] ?? s),
    alignment: or(block.alignment, (a) =>
      a === 'neutral good (50%) or neutral evil (50%)'
        ? 'neutral gut (50 %) oder neutral böse (50 %)'
        : (ALIGNMENTS[a] ?? a),
    ),
    acClass: or(block.acClass, (a) => words(a, ARMOUR)),
    hitDice: or(block.hitDice, (d) => d.replace(/(\d)d(\d)/g, '$1W$2')),
    speed: or(block.speed, (s) => metres(words(s, MOVEMENT))),
    senses: or(block.senses, (s) => metres(words(s, SENSES))),
    languages: or(block.languages, (l) => metres(words(l, LANGUAGES)).replace(/ ,/g, ',')),
    damageVulnerabilities: or(block.damageVulnerabilities, (d) => words(d, DAMAGE)),
    damageResistances: or(block.damageResistances, (d) => words(d, DAMAGE)),
    damageImmunities: or(block.damageImmunities, (d) => words(d, DAMAGE)),
    conditionImmunities: or(block.conditionImmunities, (c) => words(c, CONDITIONS)),
    saves: renamed(block.saves, SAVES),
    skills: renamed(block.skills, GERMAN_SKILLS),
  };
}
