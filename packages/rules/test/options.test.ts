import { describe, expect, it } from 'vitest';

import { type Character, levelOptions, loadRules, SRD_52 } from '../src/index';

const rules = loadRules([SRD_52]);

const hero = (
  species: string,
  background: string,
  levels: { class: string; choices?: Record<string, string[]> }[],
  choices: Record<string, string[]> = {},
): Character => ({
  rules: '2024',
  species,
  background,
  abilities: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
  choices,
  levels: levels.map((l, i) => ({
    class: l.class,
    hp: i === 0 ? 'max' : 'average',
    choices: l.choices ?? {},
  })),
  inventory: [],
  bonuses: [],
});

const find = (slots: ReturnType<typeof levelOptions>, key: string) =>
  slots.find((s) => s.key === key);
const ids = (slot: { options: { id: string }[] } | undefined) => slot?.options.map((o) => o.id);

describe('levelOptions', () => {
  const fighter = hero('human', 'soldier', [{ class: 'fighter' }]);

  it('lists the creation choices with their options', () => {
    const slots = levelOptions(fighter, rules, null);
    const abilities = find(slots, 'soldier-ability-scores/abilities');
    expect(abilities).toMatchObject({ at: null, wanted: 3, each: 2 });
    expect(ids(abilities)).toEqual(['str', 'dex', 'con']);
    const languages = find(slots, 'origin-languages/languages');
    expect(languages?.wanted).toBe(2);
    expect(ids(languages)).toContain('common-sign-language');
    expect(ids(languages)).not.toContain('druidic');
    expect(ids(find(slots, 'human-skillful/skill'))).not.toContain('athletics');
    const feat = ids(find(slots, 'human-versatile/feat'));
    expect(feat).toContain('alert');
    expect(feat).not.toContain('savage-attacker');
    expect(slots.some((s) => s.key.startsWith('fighter-'))).toBe(false);
  });

  it('lists the first level with its growing mastery', () => {
    const slots = levelOptions(fighter, rules, 1);
    expect(find(slots, 'fighter-core/skills')?.wanted).toBe(2);
    expect(find(slots, 'fighter-fighting-style/fighting-style')?.wanted).toBe(1);
    const mastery = find(slots, 'fighter-weapon-mastery/mastery');
    expect(mastery?.wanted).toBe(3);
    expect(ids(mastery)).toContain('longsword');
    expect(ids(find(slots, 'fighter-core/skills'))).not.toContain('athletics');
  });

  it('adds only the increment of a growing choice at a later level', () => {
    const c = hero('human', 'soldier', [
      {
        class: 'fighter',
        choices: { 'fighter-weapon-mastery/mastery': ['club', 'dagger', 'longsword'] },
      },
      { class: 'fighter' },
      { class: 'fighter' },
      { class: 'fighter' },
    ]);
    expect(find(levelOptions(c, rules, 2), 'fighter-weapon-mastery/mastery')).toBeUndefined();
    const four = find(levelOptions(c, rules, 4), 'fighter-weapon-mastery/mastery');
    expect(four?.wanted).toBe(1);
    expect(ids(four)).not.toContain('longsword');
  });

  it('keeps a slot own values among its options', () => {
    const c = hero('human', 'soldier', [
      { class: 'fighter', choices: { 'fighter-weapon-mastery/mastery': ['longsword'] } },
    ]);
    const mastery = find(levelOptions(c, rules, 1), 'fighter-weapon-mastery/mastery');
    expect(mastery?.chosen).toEqual(['longsword']);
    expect(ids(mastery)).toContain('longsword');
  });

  it('gives spell slots with their class list and highest level', () => {
    const wizard = hero('human', 'soldier', [{ class: 'wizard' }]);
    const slots = levelOptions(wizard, rules, 1);
    const cantrips = find(slots, 'wizard-spellcasting/cantrips');
    const spells = find(slots, 'wizard-spellcasting/spells');
    expect(cantrips).toMatchObject({
      wanted: 3,
      spells: { list: 'wizard', maxLevel: 0 },
      options: [],
    });
    expect(spells).toMatchObject({ wanted: 4, spells: { list: 'wizard', maxLevel: 1 } });
  });

  it('asks a warlock at level 5 for two more invocations, without the chosen ones', () => {
    const inv = (n: string) => `warlock-invocation-${n}`;
    const INV = 'warlock-eldritch-invocations/invocations';
    const c = hero('human', 'soldier', [
      { class: 'warlock', choices: { [INV]: [inv('agonizing-blast')] } },
      { class: 'warlock', choices: { [INV]: [inv('armor-of-shadows'), inv('devils-sight')] } },
      { class: 'warlock' },
      { class: 'warlock' },
      { class: 'warlock' },
    ]);
    const slot = find(levelOptions(c, rules, 5), INV);
    expect(slot?.wanted).toBe(2);
    expect(ids(slot)).not.toContain(inv('agonizing-blast'));
    expect(ids(slot)).not.toContain(inv('devils-sight'));
    expect(ids(slot)).toContain(inv('ascendant-step'));
    expect(find(levelOptions(c, rules, 3), INV)).toBeUndefined();
  });

  it('offers a feat only when its requirements are met and it is not held', () => {
    const asi = (n: number) => `fighter-asi-${n}/feat`;
    const c = hero('human', 'soldier', [
      { class: 'fighter' },
      { class: 'fighter' },
      { class: 'fighter' },
      { class: 'fighter', choices: { [asi(4)]: ['grappler'] } },
      { class: 'fighter' },
      { class: 'fighter' },
    ]);
    const four = ids(find(levelOptions(c, rules, 4), asi(4)));
    expect(four).toContain('grappler');
    expect(four).toContain('ability-score-improvement');
    const six = ids(find(levelOptions(c, rules, 6), asi(6)));
    expect(six).not.toContain('grappler');
    expect(six).toContain('ability-score-improvement');
    const style = find(levelOptions(c, rules, 1), 'fighter-fighting-style/fighting-style');
    expect(ids(style)).toContain('archery');
  });
});
