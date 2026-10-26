// Saves and skills as rolls: a character's from `saves: { dex: 5 }` and `skills: { persuasion: 7 }`
// in the note's frontmatter (readable without the plugin), else from the note's stat block; a
// monster's from its block. The label is in the plugin's language ("Orrin Quill: Überzeugen"), the
// log's subject English ("Orrin Quill rolls Persuasion"). Pure.

import { GERMAN_SKILLS } from '../monsters/meta';
import type { Bonus, Statblock } from '../npc/statblock';
import type { Lang } from '../npc/races';
import { d20 } from './statblock';

/** A roll a button stands for. */
export interface Check {
  /** On the button: `Überzeugen`. */
  name: string;
  /** On the stage and in the Dice tab: `Orrin Quill: Überzeugen`. */
  label: string;
  /** In the log, before the roll: `Orrin Quill rolls Persuasion`. */
  subject: string;
  formula: string;
  /** Whether advantage and disadvantage apply (a d20 roll). */
  d20: boolean;
}

const ABILITIES: Record<string, [string, string]> = {
  str: ['Strength save', 'Stärkerettungswurf'],
  dex: ['Dexterity save', 'Geschicklichkeitsrettungswurf'],
  con: ['Constitution save', 'Konstitutionsrettungswurf'],
  int: ['Intelligence save', 'Intelligenzrettungswurf'],
  wis: ['Wisdom save', 'Weisheitsrettungswurf'],
  cha: ['Charisma save', 'Charismarettungswurf'],
};
/** The German short forms a German stat block shows (`Ges +4`). */
const GERMAN_SHORT: Record<string, string> = { stä: 'str', ges: 'dex', kon: 'con', wei: 'wis' };

const words = (key: string) =>
  key
    .split(/[_\s]+/)
    .map((w) => (w === 'of' || w === 'and' ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');

/** A save's name: `Dexterity save` / `Geschicklichkeitsrettungswurf`; unknown keys as written. */
export function saveName(key: string, lang: Lang): string {
  const short = key.toLowerCase().slice(0, 3);
  const names = ABILITIES[GERMAN_SHORT[short] ?? short];
  if (names === undefined) return words(key);
  return names[lang === 'de' ? 1 : 0];
}

/** A skill's name: `Sleight of Hand` / `Fingerfertigkeit`; unknown keys as written. */
export function skillName(key: string, lang: Lang): string {
  const k = key.toLowerCase().replace(/\s+/g, '_');
  return lang === 'de' ? (GERMAN_SKILLS[k] ?? words(key)) : words(k);
}

/** Bonuses from a frontmatter map (`{ dex: 5 }`) or list of one-key maps; null when absent. */
function fromFrontmatter(value: unknown): Bonus[] | null {
  if (value === undefined || value === null) return null;
  const pairs = Array.isArray(value)
    ? (value as unknown[]).flatMap((v) =>
        typeof v === 'object' && v !== null ? Object.entries(v as Record<string, unknown>) : [],
      )
    : typeof value === 'object'
      ? Object.entries(value)
      : [];
  return pairs.flatMap(([key, v]) => {
    const bonus = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(bonus) ? [{ key, bonus }] : [];
  });
}

/** A character's saves and skills: the frontmatter's, else its stat block's. */
export function characterBonuses(
  frontmatter: Record<string, unknown> | undefined,
  block: Statblock | null,
): { saves: Bonus[]; skills: Bonus[] } {
  return {
    saves: fromFrontmatter(frontmatter?.saves) ?? block?.saves ?? [],
    skills: fromFrontmatter(frontmatter?.skills) ?? block?.skills ?? [],
  };
}

/** The checks for a set of saves and skills, saves first. */
export function checks(
  who: string,
  bonuses: { saves: readonly Bonus[]; skills: readonly Bonus[] },
  lang: Lang,
): Check[] {
  const check = (name: (key: string, lang: Lang) => string, b: Bonus): Check => ({
    name: name(b.key, lang),
    label: `${who}: ${name(b.key, lang)}`,
    subject: `${who} rolls ${name(b.key, 'en')}`,
    formula: d20(b.bonus),
    d20: true,
  });
  return [
    ...bonuses.saves.map((b) => check(saveName, b)),
    ...bonuses.skills.map((b) => check(skillName, b)),
  ];
}
