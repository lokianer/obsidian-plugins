// Which features a character has, and where each one's choices are stored: the species', the
// background's and its origin feat's in the creation choices; a class feature's in the level at
// which the class reached the feature's level; a feat's or an option's where it was chosen.
// Unknown ids are collected, never thrown. Pure.

import type { Character } from './character';
import type { Rules } from './data';
import type { Choice, Feature } from './model';

export interface Placed {
  feature: Feature;
  /** The class, subclass, species, background or feat it comes from. */
  from: string;
  /** Where its choices are stored. */
  choices: Record<string, string[]>;
  /** The character level of the level entry holding its choices; null for creation. */
  at: number | null;
  /** The class whose level its level tables follow; null for the character level. */
  owner: string | null;
}

export interface Collected {
  placed: Placed[];
  classes: { id: string; level: number; subclass: string | null }[];
  unknown: string[];
}

const key = (feature: Feature, choiceId: string) => `${feature.id}/${choiceId}`;

/** One level entry's share of a growing choice. */
export interface Increment {
  /** The class level of the entry. */
  classLevel: number;
  /** The character level of the entry. */
  at: number;
  /** What the entry holds for the choice. */
  values: string[];
  /** The entry's choices, where an option chosen here keeps its own. */
  choices: Record<string, string[]>;
}

/**
 * A choice whose count grows with the class level is stored per level as the increment: the
 * entries of the owning class at or above the feature's level, in order. Null for any other
 * choice.
 */
export function growingValues(
  character: Character,
  owner: string | null,
  feature: Feature,
  choice: Choice,
): Increment[] | null {
  if (owner === null || typeof choice.count !== 'object' || !('byLevel' in choice.count)) {
    return null;
  }
  const id = key(feature, choice.id);
  const result: Increment[] = [];
  let classLevel = 0;
  character.levels.forEach((entry, i) => {
    if (entry.class !== owner) return;
    classLevel++;
    if (classLevel < feature.level) return;
    result.push({ classLevel, at: i + 1, values: entry.choices[id] ?? [], choices: entry.choices });
  });
  return result;
}

export function collect(character: Character, rules: Rules): Collected {
  const placed: Placed[] = [];
  const unknown: string[] = [];
  const miss = (id: string) => {
    if (!unknown.includes(id)) unknown.push(id);
  };

  /** Places a feature and, through its choices, the feats and options chosen in it. */
  const place = (p: Placed) => {
    placed.push(p);
    for (const choice of p.feature.choices) {
      const from = choice.from;
      const growing = growingValues(character, p.owner, p.feature, choice);
      const held =
        growing
          ?.flatMap((g) => g.values.map((value) => ({ value, from: g })))
          .filter((h, i, all) => all.findIndex((o) => o.value === h.value) === i) ??
        (p.choices[key(p.feature, choice.id)] ?? []).map((value) => ({ value, from: null }));
      for (const { value, from: entry } of held) {
        const q: Placed = entry === null ? p : { ...p, choices: entry.choices, at: entry.at };
        if (choice.gives === 'feat') {
          const feat = rules.feat(value);
          if (feat === undefined) miss(value);
          else for (const f of feat.features) place({ ...q, feature: f, from: feat.id });
        } else if (choice.gives === 'option' && 'options' in from) {
          const option = from.options.find((o) => o.id === value);
          if (option === undefined) miss(value);
          else place({ ...q, feature: option });
        }
      }
    }
  };

  const level = character.levels.length;
  const species = rules.species(character.species);
  if (species === undefined) miss(character.species);
  for (const f of species?.features ?? []) {
    if (f.level <= Math.max(1, level)) {
      place({ feature: f, from: species!.id, choices: character.choices, at: null, owner: null });
    }
  }
  const background = rules.background(character.background);
  if (background === undefined) miss(character.background);
  for (const f of background?.features ?? []) {
    place({ feature: f, from: background!.id, choices: character.choices, at: null, owner: null });
  }
  if (background !== undefined && background.feat !== '') {
    const feat = rules.feat(background.feat);
    if (feat === undefined) miss(background.feat);
    for (const f of feat?.features ?? []) {
      place({ feature: f, from: feat!.id, choices: character.choices, at: null, owner: null });
    }
  }

  // Classes, level by level; where each class reached each of its levels.
  const reached = new Map<string, number[]>();
  character.levels.forEach((entry, i) => {
    const cls = rules.class(entry.class);
    if (cls === undefined) {
      miss(entry.class);
      return;
    }
    const levels = reached.get(cls.id) ?? [];
    levels.push(i);
    reached.set(cls.id, levels);
    const classLevel = levels.length;
    const first = i === 0;
    for (const f of cls.features) {
      if (f.level !== classLevel) continue;
      const feature: Feature =
        f.id === `${cls.id}-core` && !first
          ? {
              ...f,
              id: `${cls.id}-multiclass`,
              grants: cls.multiclass.grants,
              choices: cls.multiclass.choices ?? [],
            }
          : f;
      place({ feature, from: cls.id, choices: entry.choices, at: i + 1, owner: cls.id });
    }
  });

  // Subclasses: chosen in a class feature; their features at the levels the class reached.
  const classes: Collected['classes'] = [];
  for (const [id, levels] of reached) {
    let subclass: string | null = null;
    for (const p of placed) {
      if (p.owner !== id) continue;
      for (const choice of p.feature.choices) {
        if (choice.gives !== 'subclass') continue;
        const value = p.choices[key(p.feature, choice.id)]?.[0];
        if (value === undefined) continue;
        if (rules.subclass(value)?.class === id) subclass = value;
        else miss(value);
      }
    }
    classes.push({ id, level: levels.length, subclass });
    const def = subclass === null ? undefined : rules.subclass(subclass);
    for (const f of def?.features ?? []) {
      const index = levels[f.level - 1];
      if (index === undefined) continue;
      const entry = character.levels[index]!;
      place({ feature: f, from: def!.id, choices: entry.choices, at: index + 1, owner: id });
    }
  }
  return { placed, classes, unknown };
}
