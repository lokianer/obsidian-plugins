// A built character note: its choices read from the frontmatter, and the computed keys the other
// modules (party, battle, dice) and a reader without the plugin see. Pure; a note without
// `levels` is hand-written and left alone.

import {
  type Ability,
  ABILITIES,
  type Character,
  derive,
  type LevelEntry,
  type Rules,
  type Sheet,
} from '@obsidian-plugins/rules';

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** `{ key: [a, b] }`, a single value read as a one-item list; anything else skipped. */
function readChoices(v: unknown): Record<string, string[]> {
  if (!isRecord(v)) return {};
  const out: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(v)) {
    const list = Array.isArray(value) ? value : [value];
    const ids = list.filter((x) => typeof x === 'string' || typeof x === 'number').map(String);
    if (ids.length > 0) out[key] = ids;
  }
  return out;
}

function readLevel(v: unknown): LevelEntry | null {
  if (!isRecord(v) || typeof v.class !== 'string') return null;
  const hp = v.hp === 'max' || (typeof v.hp === 'number' && v.hp > 0) ? v.hp : ('average' as const);
  return { class: v.class, hp, choices: readChoices(v.choices) };
}

export function readCharacter(fm: Record<string, unknown> | undefined): Character | null {
  if (fm === undefined || !Array.isArray(fm.levels)) return null;
  const scores = isRecord(fm.abilities) ? fm.abilities : {};
  const abilities = Object.fromEntries(
    ABILITIES.map((a) => [a, typeof scores[a] === 'number' ? scores[a] : 10]),
  ) as Record<Ability, number>;
  const inventory = (Array.isArray(fm.inventory) ? fm.inventory : []).flatMap(
    (v): Character['inventory'] => {
      if (typeof v === 'string') return [{ item: v, equipped: false }];
      if (!isRecord(v) || typeof v.item !== 'string') return [];
      const entry: Character['inventory'][number] = { item: v.item, equipped: v.equipped === true };
      if (typeof v.quantity === 'number') entry.quantity = v.quantity;
      return [entry];
    },
  );
  const bonuses = (Array.isArray(fm.bonuses) ? fm.bonuses : []).flatMap(
    (v): Character['bonuses'] =>
      isRecord(v) && typeof v.to === 'string' && typeof v.value === 'number'
        ? [{ to: v.to, value: v.value, why: typeof v.why === 'string' ? v.why : '' }]
        : [],
  );
  // No readable level: a hand-written note (`levels: []`, `- fighter 5`), left alone.
  const levels = fm.levels.flatMap((v) => readLevel(v) ?? []);
  if (levels.length === 0) return null;
  const species = typeof fm.species === 'string' ? fm.species : fm.race;
  return {
    rules: fm.rules === '2014' || fm.rules === 2014 ? '2014' : '2024',
    species: typeof species === 'string' ? species : '',
    background: typeof fm.background === 'string' ? fm.background : '',
    abilities,
    levels,
    choices: readChoices(fm.choices),
    inventory,
    bonuses,
  };
}

/**
 * The keys written back into the note, in the shape hand-written notes use; null when the rules
 * do not know a class, subclass, species, background, feat or option of the note, so no lowered number ever replaces the note's own.
 */
export function computedKeys(character: Character, rules: Rules): Record<string, unknown> | null {
  const sheet = derive(character, rules);
  // Gear the rules do not list (a rope) changes no number; any other unknown id does.
  const items = new Set(character.inventory.map((i) => i.item));
  if (sheet.unknown.some((id) => !items.has(id))) return null;
  const [first] = sheet.classes;
  const subclass = first?.subclass == null ? undefined : rules.subclass(first.subclass);
  const proficient = <T extends { total: number }>(
    entries: [string, T][],
    keep: (v: T) => boolean,
  ) =>
    Object.fromEntries(
      entries.filter(([, v]) => keep(v)).map(([k, v]) => [k.replace(/-/g, '_'), v.total]),
    );
  return {
    class:
      sheet.classes.length === 1
        ? first!.id
        : sheet.classes.map((c) => `${c.id} ${c.level}`).join(' / '),
    subclass: subclass?.name.en.toLowerCase() ?? '',
    level: sheet.level,
    ac: sheet.ac.total,
    hp: sheet.hp.total,
    initiative: sheet.initiative.total,
    passive_perception: sheet.passive.perception,
    race: character.species,
    saves: proficient(Object.entries(sheet.saves), (s) => s.proficient),
    skills: proficient(Object.entries(sheet.skills), (s) => s.rank >= 1),
  };
}

function same(a: unknown, b: unknown): boolean {
  if (isRecord(a) && isRecord(b)) {
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every((k) => same(a[k], b[k]));
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((x, i) => same(x, b[i]));
  }
  return a === b;
}

/** Whether writing these keys would change the note. */
export function differs(fm: Record<string, unknown>, keys: Record<string, unknown>): boolean {
  return Object.entries(keys).some(([k, v]) => !same(fm[k], v));
}

/** What the sheet shows of a character note: built (with its sheet) or hand-written. */
export interface SheetData {
  path: string;
  name: string;
  frontmatter: Record<string, unknown>;
  character: Character | null;
  sheet: Sheet | null;
}

export function sheetData(
  path: string,
  fm: Record<string, unknown> | undefined,
  rules: Rules,
): SheetData {
  const character = readCharacter(fm);
  return {
    path,
    name: (path.split('/').pop() ?? path).replace(/\.md$/, ''),
    frontmatter: fm ?? {},
    character,
    sheet: character === null ? null : derive(character, rules),
  };
}
