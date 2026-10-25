// Races for the New NPC dialog: the SRD's nine and the GM's own `type: race` notes. A race writes its
// traits into the NPC's stat block (size, speed, darkvision, languages, resistances, racial traits —
// never ability scores, which NPC stat blocks already include) and gives the name and appearance
// dice lists that fit it. Pure.

import { addEntry, editScalar } from './block-edit';
import { BLOCK, type Entry, findStatblocks, parseStatblock } from './statblock';

export type Lang = 'en' | 'de';

/** Hair, eyes and skin phrases a race's appearance is rolled from, per language. */
export interface Looks {
  hair: readonly string[];
  eyes: readonly string[];
  skin: readonly string[];
}

export interface Race {
  /** The race as written into `race:` and the block's `subtype` (English). */
  name: string;
  /** German display name for the dialog; own races show their name. */
  label?: Partial<Record<Lang, string>>;
  size: 'Tiny' | 'Small' | 'Medium' | 'Large';
  /** Walking speed in feet. */
  speed: number;
  /** Darkvision in feet, 0 for none. */
  darkvision: number;
  languages: readonly string[];
  resistances: readonly string[];
  traits: readonly Entry[];
  names: readonly string[];
  familyNames: readonly string[];
  /** Typical age in years, youngest and oldest adult. */
  age: readonly [number, number];
  looks: Partial<Record<Lang, Looks>>;
  /** `srd`, or the path of the GM's race note. */
  source: string;
}

export interface RaceProblem {
  path: string;
  problem: 'no-traits' | 'unreadable';
}

const split = (text: string | null | undefined): string[] =>
  (text ?? '')
    .split(/,\s*/)
    .map((s) => s.trim())
    .filter((s) => s !== '');

/** Adds the race's parts to a list text, without duplicates; an "any … language" line is replaced. */
function merged(current: string | null, add: readonly string[]): string {
  const have = current !== null && !/\bany\b/i.test(current) ? split(current) : [];
  for (const item of add) {
    if (!have.some((h) => h.toLowerCase() === item.toLowerCase())) have.push(item);
  }
  return have.join(', ');
}

/**
 * The stat block's YAML with the race applied: size, speed (the walking part), `subtype`,
 * darkvision in front of the senses, languages and resistances merged, the racial traits appended.
 * `parse` turns YAML into data. Values the block holds as lists are left as they are.
 */
export function applyRace(yaml: string, race: Race, parse: (yaml: string) => unknown): string {
  let note = ['```' + BLOCK, yaml, '```'].join('\n');
  const block = () => parseStatblock(parse(findStatblocks(note)[0]?.source ?? ''));
  const set = (key: string, expect: string | number | null, value: string | number) => {
    if (expect === value) return;
    const result = editScalar(note, 0, { op: 'set-scalar', key, expect, value });
    if (result.ok) note = result.text;
  };

  const before = block();
  set('size', before.size, race.size);
  const speed = before.speed ?? '30 ft.';
  set(
    'speed',
    before.speed,
    /^\d+ ft\./.test(speed) ? speed.replace(/^\d+/, String(race.speed)) : `${race.speed} ft.`,
  );
  set('subtype', before.subtype, race.name.toLowerCase());
  if (race.darkvision > 0 && !/darkvision/i.test(before.senses ?? '')) {
    const senses = before.senses === null ? '' : `, ${before.senses}`;
    set('senses', before.senses, `darkvision ${race.darkvision} ft.${senses}`);
  }
  if (race.languages.length > 0)
    set('languages', before.languages, merged(before.languages, race.languages));
  if (race.resistances.length > 0) {
    set(
      'damage_resistances',
      before.damageResistances,
      merged(before.damageResistances, race.resistances),
    );
  }
  const known = new Set(before.traits.map((t) => t.name.toLowerCase()));
  for (const trait of race.traits) {
    if (known.has(trait.name.toLowerCase())) continue;
    const result = addEntry(note, 0, 'traits', trait.name, trait.desc);
    if (result.ok) note = result.text;
  }
  return note.split('\n').slice(1, -1).join('\n');
}

/** List items of the section under `## title`. */
function section(lines: readonly string[], title: string): string[] {
  const at = lines.findIndex((l) => new RegExp(`^##\\s+${title}\\s*$`, 'i').test(l.trim()));
  if (at === -1) return [];
  const items: string[] = [];
  for (let i = at + 1; i < lines.length && !/^#{1,6}\s/.test(lines[i] ?? ''); i++) {
    const item = /^\s*[-*+]\s+(.*\S)\s*$/.exec(lines[i] ?? '')?.[1];
    if (item !== undefined) items.push(item);
  }
  return items;
}

/** `**Name.** text` or `Name: text` → an entry. */
function trait(item: string): Entry {
  const bold = /^\*\*(.+?)\.?\*\*\.?\s*(.*)$/.exec(item);
  if (bold !== null) return { name: bold[1] ?? '', desc: bold[2] ?? '' };
  const colon = /^([^:]{1,60}):\s*(.*)$/.exec(item);
  return colon !== null ? { name: colon[1] ?? '', desc: colon[2] ?? '' } : { name: item, desc: '' };
}

/** A frontmatter scalar as text; anything else is empty. */
const scalar = (value: unknown): string =>
  typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';

/** A number, or the number a text starts with (`25 ft.`); `fallback` when there is none. */
const num = (value: unknown, fallback: number): number => {
  const n = Number(scalar(value).replace(/\D+$/, ''));
  return scalar(value) !== '' && Number.isFinite(n) ? n : fallback;
};

const list = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String) : split(typeof value === 'string' ? value : null);

/**
 * The GM's race from a note: frontmatter `size`, `speed`, `darkvision`, `languages`,
 * `resistances`, `age` (`20-80`), a `## Traits` list and optional `## Names` / `## Family names`.
 */
export function ownRace(
  path: string,
  text: string,
  frontmatter: Record<string, unknown> | undefined,
  fallback: Race,
): Race | RaceProblem {
  const fm = frontmatter ?? {};
  const lines = text.split(/\r?\n/);
  const traits = section(lines, 'Traits').map(trait);
  if (traits.length === 0) return { path, problem: 'no-traits' };
  const size = typeof fm.size === 'string' ? fm.size.trim() : '';
  const age = /^(\d+)\s*[-–]\s*(\d+)$/.exec(scalar(fm.age));
  const names = section(lines, 'Names');
  const family = section(lines, 'Family names');
  return {
    name: path.slice(path.lastIndexOf('/') + 1).replace(/\.md$/i, ''),
    size:
      (['Tiny', 'Small', 'Medium', 'Large'] as const).find(
        (s) => s.toLowerCase() === size.toLowerCase(),
      ) ?? 'Medium',
    speed: num(fm.speed, 30),
    darkvision: num(fm.darkvision, 0),
    languages: list(fm.languages),
    resistances: list(fm.resistances),
    traits,
    names: names.length > 0 ? names : fallback.names,
    familyNames: family.length > 0 ? family : fallback.familyNames,
    age: age === null ? fallback.age : [Number(age[1]), Number(age[2])],
    looks: fallback.looks,
    source: path,
  };
}

/** A race note for New race: the base race's values as frontmatter and lists, under `name`. */
export function raceNote(name: string, base: Race, intro: string): string {
  const yamlList = (items: readonly string[]) =>
    items.length === 0
      ? '[]'
      : `[${items.map((i) => (/^[\p{L} ]+$/u.test(i) ? i : JSON.stringify(i))).join(', ')}]`;
  return [
    '---',
    'type: race',
    `size: ${base.size}`,
    `speed: ${base.speed}`,
    `darkvision: ${base.darkvision}`,
    `languages: ${yamlList(base.languages)}`,
    `resistances: ${yamlList(base.resistances)}`,
    `age: ${base.age[0]}-${base.age[1]}`,
    'tags:',
    '  - race',
    '---',
    '',
    `# ${name}`,
    '',
    intro,
    '',
    '## Traits',
    '',
    ...base.traits.map((t) => `- **${t.name}.** ${t.desc}`),
    '',
    '## Names',
    '',
    ...base.names.map((n) => `- ${n}`),
    '',
    '## Family names',
    '',
    ...base.familyNames.map((n) => `- ${n}`),
    '',
  ].join('\n');
}

/** Races whose name or label contains every word of the query, the GM's own first. */
export function searchRaces(races: readonly Race[], query: string, lang: Lang): Race[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const text = (r: Race) => `${r.name} ${r.label?.[lang] ?? ''}`.toLowerCase();
  return races
    .filter((r) => words.every((w) => text(r).includes(w)))
    .sort((a, b) => Number(a.source === 'srd') - Number(b.source === 'srd'));
}

/** A rolled appearance from the race's looks: `copper braids, grey eyes, ruddy skin`. */
export function rollLooks(race: Race, lang: Lang, random: () => number): string {
  const looks = race.looks[lang] ?? race.looks.en;
  if (looks === undefined) return '';
  const pick = (items: readonly string[]) => items[Math.floor(random() * items.length)] ?? '';
  return [pick(looks.hair), pick(looks.eyes), pick(looks.skin)].filter((p) => p !== '').join(', ');
}

/** A rolled age within the race's adult years. */
export function rollAge(race: Race, random: () => number): number {
  const [min, max] = race.age;
  return min + Math.floor(random() * (max - min + 1));
}
