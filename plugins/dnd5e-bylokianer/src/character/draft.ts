// The character builder's draft: a new level-1 character being put together, turned into a
// `Character` and written out as a `type: character` note that `readCharacter` reads back. Pure.

import {
  ABILITIES,
  type Ability,
  type Character,
  type ChoiceSlot,
  levelOptions,
  type Rules,
} from '@obsidian-plugins/rules';

import { isPlainSafe } from '../yaml/scalar';
import { computedKeys } from './note';

export type AbilityMethod = 'standard' | 'point-buy' | 'rolled' | 'typed';

export interface CharacterDraft {
  name: string;
  player: string;
  species: string;
  background: string;
  class: string;
  method: AbilityMethod;
  abilities: Record<Ability, number>;
  /** The six rolled sums of the rolled method. */
  rolled: number[];
  /** By slot key; creation slots and the first level's slots together. */
  choices: Record<string, string[]>;
  armor: string | null;
  shield: boolean;
  weapons: string[];
}

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
export const POINT_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};
export const POINT_BUDGET = 27;

export function emptyDraft(): CharacterDraft {
  return {
    name: '',
    player: '',
    species: '',
    background: '',
    class: '',
    method: 'standard',
    abilities: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
    rolled: [],
    choices: {},
    armor: null,
    shield: false,
    weapons: [],
  };
}

/** Six scores of 4d6 without the lowest die; `roll()` gives 1–6. */
export function rollAbilities(roll: () => number): number[] {
  return Array.from({ length: 6 }, () => {
    const dice = Array.from({ length: 4 }, roll);
    return dice.reduce((a, b) => a + b, 0) - Math.min(...dice);
  });
}

// ── the character ────────────────────────────────────────────────────────────────────────────

function build(
  draft: CharacterDraft,
  creation: Record<string, string[]>,
  first: Record<string, string[]>,
): Character {
  const inventory: Character['inventory'] = [];
  if (draft.armor !== null) inventory.push({ item: draft.armor, equipped: true });
  if (draft.shield) inventory.push({ item: 'shield', equipped: true });
  for (const item of draft.weapons) inventory.push({ item, equipped: true });
  return {
    rules: '2024',
    species: draft.species,
    background: draft.background,
    abilities: { ...draft.abilities },
    levels: [{ class: draft.class, hp: 'max', choices: first }],
    choices: creation,
    inventory,
    bonuses: [],
  };
}

/** A choice can open another (a feat's own); a handful of passes reaches every depth there is. */
const MAX_PASSES = 8;

const sameKeys = (a: Record<string, unknown>, b: Record<string, unknown>) => {
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((k) => k in b);
};

function pick(draft: CharacterDraft, slots: ChoiceSlot[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const s of slots) {
    const ids = draft.choices[s.key];
    if (ids !== undefined) out[s.key] = [...ids];
  }
  return out;
}

/**
 * The character the draft describes. A choice of a slot that no longer exists (an elf's choice
 * after the species became human) is dropped; a slot that only appears after another choice (a
 * feat's own) is found by building again until the kept keys stop changing (at most `MAX_PASSES` times).
 */
export function toCharacter(draft: CharacterDraft, rules: Rules): Character {
  let creation: Record<string, string[]> = {};
  let first: Record<string, string[]> = {};
  for (let pass = 0; pass < MAX_PASSES; pass++) {
    const c = build(draft, creation, first);
    const nextCreation = pick(draft, levelOptions(c, rules, null));
    const nextFirst = pick(draft, levelOptions(c, rules, 1));
    const stable = sameKeys(nextCreation, creation) && sameKeys(nextFirst, first);
    creation = nextCreation;
    first = nextFirst;
    if (stable) break;
  }
  return build(draft, creation, first);
}

// ── problems ─────────────────────────────────────────────────────────────────────────────────

const sameMultiset = (a: number[], b: number[]) =>
  a.length === b.length && [...a].sort().join() === [...b].sort().join();

function abilitiesBroken(d: CharacterDraft): boolean {
  const scores = ABILITIES.map((a) => d.abilities[a]);
  switch (d.method) {
    case 'standard':
      return !sameMultiset(scores, STANDARD_ARRAY);
    case 'rolled':
      return !sameMultiset(scores, d.rolled);
    case 'point-buy':
      return (
        scores.some((s) => POINT_COSTS[s] === undefined) ||
        scores.reduce((sum, s) => sum + (POINT_COSTS[s] ?? 0), 0) > POINT_BUDGET
      );
    case 'typed':
      return scores.some((s) => !Number.isInteger(s) || s < 3 || s > 18);
  }
}

/**
 * The values a slot holds that the character also has from elsewhere (a background that grants the
 * same skill, a non-repeatable feat twice), or that it does not qualify for: those the slot would not
 * offer if it were empty. Spells and ability points are not checked.
 */
export function heldElsewhere(draft: CharacterDraft, rules: Rules, key: string): string[] {
  const { [key]: own, ...rest } = draft.choices;
  if (own === undefined || own.length === 0) return [];
  const c = toCharacter({ ...draft, choices: rest }, rules);
  const slot = [...levelOptions(c, rules, null), ...levelOptions(c, rules, 1)].find(
    (s) => s.key === key,
  );
  if (slot === undefined || slot.spells !== undefined || slot.choice.gives === 'ability') return [];
  const offered = new Set(slot.options.map((o) => o.id));
  return own.filter((id) => !offered.has(id));
}

/** Stable codes: `name`, `species`, `background`, `class`, `abilities`, `choice:<key>`. */
export function draftProblems(draft: CharacterDraft, rules: Rules): string[] {
  const problems: string[] = [];
  if (draft.name.trim() === '') problems.push('name');
  if (draft.species === '') problems.push('species');
  if (draft.background === '') problems.push('background');
  if (draft.class === '') problems.push('class');
  if (abilitiesBroken(draft)) problems.push('abilities');
  const c = toCharacter(draft, rules);
  for (const slot of [...levelOptions(c, rules, null), ...levelOptions(c, rules, 1)]) {
    const tooMany =
      slot.each !== undefined &&
      slot.chosen.some((id) => slot.chosen.filter((x) => x === id).length > slot.each!);
    if (
      slot.chosen.length < slot.wanted ||
      tooMany ||
      heldElsewhere(draft, rules, slot.key).length > 0
    ) {
      problems.push(`choice:${slot.key}`);
    }
  }
  return problems;
}

// ── the note ─────────────────────────────────────────────────────────────────────────────────

/** Plain where YAML reads it back unchanged (ids, with `/` inside), double-quoted otherwise. */
const scalar = (s: string) => (isPlainSafe(s.replace(/\//g, '-')) ? s : JSON.stringify(s));

function flow(v: unknown): string {
  if (typeof v === 'string') return scalar(v);
  if (typeof v === 'object' && v !== null) {
    const entries = Object.entries(v);
    return entries.length === 0
      ? '{}'
      : `{ ${entries.map(([k, x]) => `${scalar(k)}: ${flow(x)}`).join(', ')} }`;
  }
  return String(v);
}

function choiceLines(choices: Record<string, string[]>, indent: string): string[] {
  return Object.entries(choices).map(
    ([key, ids]) => `${indent}${scalar(key)}: [${ids.map(scalar).join(', ')}]`,
  );
}

/** The note a drafted character is written as; `readCharacter` reads it back. */
export function characterNoteText(draft: CharacterDraft, rules: Rules): string {
  const c = toCharacter(draft, rules);
  const level = c.levels[0]!;
  const lines = ['---', 'type: character'];
  if (draft.player.trim() !== '') lines.push(`player: ${JSON.stringify(draft.player.trim())}`);
  lines.push(
    `rules: '${c.rules}'`,
    `species: ${scalar(c.species)}`,
    `background: ${scalar(c.background)}`,
    `abilities: ${flow(c.abilities)}`,
  );
  if (Object.keys(c.choices).length > 0) lines.push('choices:', ...choiceLines(c.choices, '  '));
  lines.push('levels:', `  - class: ${scalar(level.class)}`, `    hp: ${level.hp}`);
  if (Object.keys(level.choices).length > 0) {
    lines.push('    choices:', ...choiceLines(level.choices, '      '));
  }
  if (c.inventory.length > 0) {
    lines.push('inventory:');
    for (const i of c.inventory) lines.push(`  - ${flow(i)}`);
  }
  for (const [key, value] of Object.entries(computedKeys(c, rules) ?? {})) {
    lines.push(`${key}: ${flow(value)}`);
  }
  lines.push(
    'tags: [pc]',
    '---',
    '',
    `# ${draft.name.trim()}`,
    '',
    'Built with the character builder.',
  );
  return `${lines.join('\n')}\n`;
}
