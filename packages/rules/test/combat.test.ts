import { describe, expect, it } from 'vitest';

import fixture from '../data/fixture/fixture.json';
import { type Character, derive, type Grant, loadRules, type RulesData } from '../src/index';

/** A level-1 tester with these scores, wearing and wielding these items. */
function tester(abilities: Partial<Character['abilities']>, items: string[]): Character {
  return {
    rules: '2024',
    species: 'fixture-folk',
    background: 'fixture-bg',
    abilities: { str: 8, dex: 16, con: 10, int: 10, wis: 10, cha: 10, ...abilities },
    choices: {},
    levels: [{ class: 'tester', hp: 'max', choices: {} }],
    inventory: items.map((item) => ({ item, equipped: true })),
    bonuses: [],
  };
}

/** The fixture with extra grants on the tester's first feature. */
function rulesWith(...grants: Grant[]) {
  const data = structuredClone(fixture) as RulesData;
  data.classes[0]!.features[0]!.grants.push(...grants);
  return loadRules([data]);
}
const plain = rulesWith();

describe('armour class', () => {
  it('adds Dexterity to light armour, at most 2 to medium, none to heavy', () => {
    expect(derive(tester({}, ['leather']), plain).ac.total).toBe(14);
    expect(derive(tester({ dex: 18 }, ['half-plate']), plain).ac.total).toBe(17);
    expect(derive(tester({}, ['chain-mail']), plain).ac.total).toBe(16);
    expect(derive(tester({}, []), plain).ac.total).toBe(13);
  });

  it('takes no Dexterity at all in heavy armour, even a penalty', () => {
    expect(derive(tester({ dex: 8 }, ['chain-mail']), plain).ac.total).toBe(16);
  });

  it('takes the best unarmoured formula, with a shield only where it allows one', () => {
    const barbarian = rulesWith({
      kind: 'ac',
      id: 'ud',
      base: 10,
      add: ['dex', 'con'],
      shield: true,
    });
    expect(derive(tester({ dex: 14, con: 16 }, []), barbarian).ac.total).toBe(15);
    expect(derive(tester({ dex: 14, con: 16 }, ['shield']), barbarian).ac.total).toBe(17);
    const monk = rulesWith({ kind: 'ac', id: 'ud', base: 10, add: ['dex', 'wis'], shield: false });
    expect(derive(tester({ dex: 14, wis: 16 }, []), monk).ac.total).toBe(15);
    expect(derive(tester({ dex: 14, wis: 16 }, ['shield']), monk).ac.total).toBe(14);
  });

  it('adds Defense only in armour, and manual bonuses', () => {
    const defense = rulesWith({ kind: 'ac-bonus', value: 1, when: 'armored' });
    expect(derive(tester({}, ['leather']), defense).ac.total).toBe(15);
    expect(derive(tester({}, []), defense).ac.total).toBe(13);
    const ring = tester({}, ['leather']);
    ring.bonuses.push({ to: 'ac', value: 1, why: 'Ring of Protection' });
    expect(derive(ring, plain).ac.sources).toContainEqual({ label: 'bonus', value: 1 });
    expect(derive(ring, plain).ac.total).toBe(15);
  });
});

describe('attacks', () => {
  it('uses the better of Strength and Dexterity for finesse, proficiency when trained', () => {
    const [dagger] = derive(tester({}, ['dagger']), plain).attacks;
    expect(dagger).toMatchObject({ id: 'dagger', damage: '1d4+3', proficient: true });
    expect(dagger?.toHit.total).toBe(5);
    expect(dagger?.mastery).toBe('nick');
  });

  it('leaves out proficiency for an untrained weapon', () => {
    const [sword] = derive(tester({ str: 14 }, ['longsword']), plain).attacks;
    expect(sword).toMatchObject({ damage: '1d8+2', proficient: false });
    expect(sword?.toHit.sources).toEqual([{ label: 'str', value: 2 }]);
  });

  it('uses Dexterity for ranged weapons, with Archery', () => {
    const archery = rulesWith({ kind: 'attack-bonus', value: 2, ranged: true });
    const [bow] = derive(tester({ str: 18 }, ['shortbow']), archery).attacks;
    expect(bow?.toHit.total).toBe(3 + 2 + 2);
    expect(bow?.damage).toBe('1d6+3');
  });
});
