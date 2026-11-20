import { loadRules, SRD_52 } from '@obsidian-plugins/rules';
import { describe, expect, it } from 'vitest';

import { computedKeys, differs, readCharacter } from '../src/character/note';

const rules = loadRules([SRD_52]);

/** Wren Ashdown's frontmatter as Obsidian parses it (the example vault's note). */
function wren(): Record<string, unknown> {
  return {
    type: 'character',
    player: 'Ana',
    rules: '2024',
    species: 'halfling',
    background: 'criminal',
    abilities: { str: 8, dex: 14, con: 12, int: 10, wis: 13, cha: 15 },
    choices: { 'criminal-ability-scores/abilities': ['dex', 'dex', 'con'] },
    levels: [
      {
        class: 'bard',
        hp: 'max',
        choices: {
          'bard-core/skills': ['deception', 'performance', 'persuasion'],
          'bard-core/tools': ['lute', 'flute', 'drum'],
        },
      },
      {
        class: 'bard',
        hp: 'average',
        choices: { 'bard-expertise/expertise': ['persuasion', 'deception'] },
      },
      {
        class: 'bard',
        hp: 'average',
        choices: {
          'bard-subclass/subclass': 'bard/college-of-lore',
          'lore-bonus-proficiencies/skills': ['arcana', 'insight', 'perception'],
        },
      },
      {
        class: 'bard',
        hp: 'average',
        choices: {
          'bard-asi-4/feat': 'ability-score-improvement',
          'ability-score-improvement/abilities': ['cha', 'cha'],
        },
      },
      { class: 'bard', hp: 'average' },
      { class: 'bard', hp: 'average' },
    ],
    inventory: [{ item: 'leather', equipped: true }, { item: 'dagger', equipped: true }, 'rope'],
  };
}

const keys = (fm: Record<string, unknown>) => {
  const character = readCharacter(fm);
  if (character === null) throw new Error('not a built character');
  return computedKeys(character, rules);
};

describe('the character note', () => {
  it('computes the keys the other modules read', () => {
    expect(keys(wren())).toEqual({
      class: 'bard',
      subclass: 'college of lore',
      level: 6,
      ac: 14,
      hp: 39,
      initiative: 6,
      passive_perception: 14,
      race: 'halfling',
      saves: { dex: 6, cha: 6 },
      skills: {
        arcana: 3,
        deception: 9,
        insight: 4,
        perception: 4,
        performance: 6,
        persuasion: 9,
        sleight_of_hand: 6,
        stealth: 6,
      },
    });
  });

  it('leaves a hand-written note alone', () => {
    const orrin = { type: 'character', race: 'halfling', class: 'bard', level: 6, ac: 14 };
    expect(readCharacter(orrin)).toBeNull();
    expect(readCharacter(undefined)).toBeNull();
  });

  it('reads race for species, and skips what it cannot read', () => {
    const fm = wren();
    delete fm.species;
    fm.race = 'halfling';
    (fm.levels as unknown[]).splice(1, 0, 'bard', null);
    const character = readCharacter(fm);
    expect(character?.species).toBe('halfling');
    expect(character?.levels).toHaveLength(6);
    expect(character?.inventory).toEqual([
      { item: 'leather', equipped: true },
      { item: 'dagger', equipped: true },
      { item: 'rope', equipped: false },
    ]);
  });

  it('does not write again once the keys are there', () => {
    const fm = wren();
    const computed = keys(fm);
    expect(differs(fm, computed)).toBe(true);
    Object.assign(fm, computed);
    expect(differs(fm, keys(fm))).toBe(false);
    fm.ac = 13;
    expect(differs(fm, keys(fm))).toBe(true);
  });

  it('names a multiclass by its classes and levels', () => {
    const fm = wren();
    (fm.levels as Record<string, unknown>[]).push({ class: 'wizard', hp: 'average' });
    expect(keys(fm).class).toBe('bard 6 / wizard 1');
  });
});
