import { describe, expect, it } from 'vitest';

import fixture from '../data/fixture/fixture.json';
import {
  type Character,
  type ClassDef,
  derive,
  type Grant,
  loadRules,
  type RuleSet,
  type RulesData,
} from '../src/index';

/** The fixture plus casters made from the tester: `full`, `half` and `pact`, all on Charisma. */
function casters(...extra: Grant[]) {
  const data = structuredClone(fixture) as RulesData;
  const tester = data.classes[0]!;
  const caster = (id: string, progression: 'full' | 'half' | 'pact'): ClassDef => {
    const c = structuredClone(tester);
    c.id = id;
    c.features = c.features.map((f) => ({
      ...f,
      id: f.id.replace('tester', id),
      choices: f.choices.map((ch) =>
        'subclasses' in ch.from ? { ...ch, from: { subclasses: id } } : ch,
      ),
    }));
    c.features.push({
      id: `${id}-spellcasting`,
      name: { en: 'Spellcasting' },
      level: 1,
      text: { en: 'Casts spells.' },
      grants: [
        {
          kind: 'spellcasting',
          ability: 'cha',
          progression,
          prepared: { byLevel: Array.from({ length: 20 }, (_, i) => i + 2) },
          cantrips: 2,
          list: id,
        },
        ...extra,
      ],
      choices: [],
    });
    return c;
  };
  data.classes.push(caster('full', 'full'), caster('half', 'half'), caster('pact', 'pact'));
  return loadRules([data]);
}

function character(rules: RuleSet, ...classes: [string, number][]): Character {
  return {
    rules,
    species: 'fixture-folk',
    background: 'fixture-bg',
    abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 17 },
    choices: {},
    levels: classes.flatMap(([id, n]) =>
      Array.from({ length: n }, () => ({ class: id, hp: 'average' as const, choices: {} })),
    ),
    inventory: [],
    bonuses: [],
  };
}

describe('spellcasting', () => {
  it('gives a single full caster its slots, save DC and attack bonus', () => {
    const sheet = derive(character('2024', ['full', 6]), casters());
    expect(sheet.slots).toEqual([4, 3, 3]);
    expect(sheet.spellcasting).toEqual([
      { class: 'full', ability: 'cha', dc: 14, attack: 6, prepared: 7, cantrips: 2, list: 'full' },
    ]);
  });

  it('rounds half casters up in 2024 and down in 2014', () => {
    expect(derive(character('2024', ['half', 1]), casters()).slots).toEqual([2]);
    expect(derive(character('2014', ['half', 1]), casters()).slots).toEqual([]);
    expect(derive(character('2024', ['half', 5]), casters()).slots).toEqual([4, 2]);
    expect(derive(character('2024', ['half', 3], ['full', 3]), casters()).slots).toEqual([4, 3, 2]);
    expect(derive(character('2014', ['half', 3], ['full', 3]), casters()).slots).toEqual([4, 3]);
  });

  it('keeps pact slots apart', () => {
    const sheet = derive(character('2024', ['pact', 2]), casters());
    expect(sheet.pact).toEqual({ level: 1, count: 2 });
    expect(sheet.slots).toEqual([]);
    const both = derive(character('2024', ['pact', 5], ['full', 1]), casters());
    expect(both.pact).toEqual({ level: 3, count: 2 });
    expect(both.slots).toEqual([2]);
  });
});

describe('resources', () => {
  const inspiration: Grant = {
    kind: 'resource',
    id: 'inspiration',
    name: { en: 'Inspiration' },
    uses: { ability: 'cha' },
    min: 1,
    die: { byLevel: [...Array<string>(4).fill('d6'), ...Array<string>(16).fill('d8')] },
    recharge: { byLevel: [...Array<'long'>(4).fill('long'), ...Array<'short'>(16).fill('short')] },
  };

  it('counts uses from an ability, with a die and a recharge that change by level', () => {
    expect(derive(character('2024', ['full', 4]), casters(inspiration)).resources).toEqual([
      { id: 'inspiration', name: { en: 'Inspiration' }, uses: 3, die: 'd6', recharge: 'long' },
    ]);
    expect(derive(character('2024', ['full', 5]), casters(inspiration)).resources[0]).toMatchObject(
      { die: 'd8', recharge: 'short' },
    );
  });

  it('never gives fewer uses than the minimum', () => {
    const weak = character('2024', ['full', 1]);
    weak.abilities.cha = 8;
    expect(derive(weak, casters(inspiration)).resources[0]?.uses).toBe(1);
  });

  it('lists every feature with where it comes from', () => {
    const features = derive(character('2024', ['full', 4]), casters()).features;
    expect(features).toContainEqual(expect.objectContaining({ id: 'full-core', from: 'full' }));
    expect(features).toContainEqual(expect.objectContaining({ id: 'quick', from: 'fixture-feat' }));
  });
});
