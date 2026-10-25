// Own spells: notes with `type: spell` join the spellbook, so spells beyond the SRD the GM owns can
// be typed in by hand. Frontmatter holds the meta (English or German words), the body the
// description; a heading "At Higher Levels" (or "Auf höheren Graden") starts that section. Pure.

import { ABILITIES, DAMAGE_TYPES, label, SCHOOLS, SPELL_CLASSES } from './meta';
import type { Ability, School, SpellClass, SrdSpell } from './model';

export interface SpellNote {
  path: string;
  /** The note's name, used when the frontmatter names none. */
  basename: string;
  frontmatter: Record<string, unknown> | undefined;
  /** The note's text after the frontmatter. */
  body: string;
}

/** An own spell's index: never one of the SRD's. */
export const ownIndex = (path: string): string => `own:${path}`;

const fold = (s: string) => s.trim().toLowerCase();

/** A key of `keys` from its English key, English or German label, or the first letters (`str`). */
function keyOf<K extends string>(value: unknown, keys: readonly K[]): K | null {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const v = fold(value);
  return (
    keys.find(
      (k) =>
        k === v ||
        fold(label(k, 'en')) === v ||
        fold(label(k, 'de')) === v ||
        fold(label(k, 'en')).startsWith(v),
    ) ?? null
  );
}

const list = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : typeof value === 'string'
      ? value.split(',')
      : [];

const text = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim() !== ''
    ? value.trim()
    : typeof value === 'number'
      ? String(value)
      : fallback;

function level(value: unknown): number | null {
  if (typeof value === 'number')
    return Number.isInteger(value) && value >= 0 && value <= 9 ? value : null;
  if (typeof value !== 'string') return null;
  const v = fold(value);
  if (v === 'cantrip' || v === 'zaubertrick') return 0;
  const n = Number(v.replace(/\D/g, ''));
  return v.replace(/\D/g, '') !== '' && n <= 9 ? n : null;
}

const yes = (value: unknown): boolean =>
  value === true || (typeof value === 'string' && ['true', 'yes', 'ja'].includes(fold(value)));

const HIGHER = /^#{1,6}\s+(At Higher Levels|Auf höheren Graden)\s*$/im;

/** The spell a note describes, or null when it names no valid level or school. */
export function parseOwnSpell(note: SpellNote): SrdSpell | null {
  const fm = note.frontmatter ?? {};
  const lvl = level(fm.level);
  const school = keyOf<School>(fm.school, SCHOOLS);
  if (lvl === null || school === null) return null;
  const body = note.body.replace(/^\s*#\s+.*\n/, '').trim();
  const at = HIGHER.exec(body);
  const components = list(fm.components)
    .map((c) => c.trim().toUpperCase())
    .map((c) => (c === 'G' ? 'S' : c))
    .filter((c): c is 'V' | 'S' | 'M' => c === 'V' || c === 'S' || c === 'M');
  const save = keyOf<Ability>(fm.save, ABILITIES);
  const attack = fm.attack === 'melee' || fm.attack === 'ranged' ? fm.attack : null;
  return {
    index: ownIndex(note.path),
    name: text(fm.name, note.basename),
    level: lvl,
    school,
    casting: text(fm.casting_time, '1 action'),
    range: text(fm.range, 'Self'),
    components,
    material: text(fm.material, ''),
    duration: text(fm.duration, 'Instantaneous'),
    concentration: yes(fm.concentration),
    ritual: yes(fm.ritual),
    classes: list(fm.classes).flatMap((c) => keyOf<SpellClass>(c, SPELL_CLASSES) ?? []),
    damage: list(fm.damage).flatMap((d) => keyOf(d, DAMAGE_TYPES) ?? []),
    save,
    attack,
    text: (at === null ? body : body.slice(0, at.index)).trim(),
    higher: at === null ? '' : body.slice(at.index + at[0].length).trim(),
    path: note.path,
  };
}
