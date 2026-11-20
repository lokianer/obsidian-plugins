import { describe, expect, it } from 'vitest';

import {
  type Character,
  checkRules,
  derive,
  germanProblems,
  type Grant,
  loadRules,
  SRD_52,
  type Text,
} from '../src/index';

const rules = loadRules([SRD_52]);
const grants = (classId: string): Grant[] =>
  rules.class(classId)?.features.flatMap((f) => f.grants) ?? [];

describe('SRD 5.2.1 classes and subclasses', () => {
  it('passes the data check', () => {
    expect(checkRules(rules)).toEqual([]);
  });

  it('has the 12 classes with their subclass at level 3', () => {
    expect(SRD_52.classes.map((c) => c.id).sort()).toEqual(
      [
        'barbarian',
        'bard',
        'cleric',
        'druid',
        'fighter',
        'monk',
        'paladin',
        'ranger',
        'rogue',
        'sorcerer',
        'warlock',
        'wizard',
      ].sort(),
    );
    expect(SRD_52.subclasses).toHaveLength(12);
    for (const c of SRD_52.classes) expect(c.subclassLevel).toBe(3);
  });

  it('gives the bard its hit die, saves and Bardic Inspiration', () => {
    const bard = rules.class('bard')!;
    expect(bard.hitDie).toBe(8);
    expect([...bard.saves].sort()).toEqual(['cha', 'dex']);
    const inspiration = grants('bard').find(
      (g) => g.kind === 'resource' && g.id === 'bardic-inspiration',
    );
    expect(inspiration).toMatchObject({ uses: { ability: 'cha' }, min: 1 });
    if (inspiration?.kind !== 'resource' || typeof inspiration.die !== 'object') {
      throw new Error('Bardic Inspiration has no die table');
    }
    const dice = inspiration.die.byLevel;
    expect([1, 5, 10, 15].map((l) => dice[l - 1])).toEqual(['d6', 'd8', 'd10', 'd12']);
    if (typeof inspiration.recharge !== 'object') throw new Error('no recharge table');
    const recharge = inspiration.recharge.byLevel;
    expect([4, 5].map((l) => recharge[l - 1])).toEqual(['long', 'short']);
  });

  it('names each class progression, outside the core feature', () => {
    const progression = (id: string) =>
      grants(id).flatMap((g) => (g.kind === 'spellcasting' ? [g.progression] : []));
    expect(progression('warlock')).toEqual(['pact']);
    expect(progression('paladin')).toEqual(['half']);
    expect(progression('ranger')).toEqual(['half']);
    expect(progression('wizard')).toEqual(['full']);
    expect(progression('fighter')).toEqual([]);
    for (const c of SRD_52.classes) {
      const core = c.features.find((f) => f.id === `${c.id}-core`);
      expect(core?.grants.some((g) => g.kind === 'spellcasting')).toBe(false);
    }
  });

  it('gives every feature a text', () => {
    const features = [
      ...SRD_52.classes.flatMap((c) => c.features),
      ...SRD_52.subclasses.flatMap((s) => s.features),
    ];
    expect(features.filter((f) => f.text.en.trim() === '').map((f) => f.id)).toEqual([]);
  });
});

describe('SRD 5.2.1 weapon training and multiclassing', () => {
  const hero = (levels: string[], items: string[]): Character => ({
    rules: '2024',
    species: 'human',
    background: 'soldier',
    abilities: { str: 10, dex: 16, con: 12, int: 10, wis: 14, cha: 10 },
    choices: {},
    levels: levels.map((c, i) => ({ class: c, hp: i === 0 ? 'max' : 'average', choices: {} })),
    inventory: items.map((item) => ({ item, equipped: true })),
    bonuses: [],
  });
  const trained = (c: Character) =>
    Object.fromEntries(derive(c, rules).attacks.map((a) => [a.id, a.proficient]));

  it('trains a rogue in martial finesse and light weapons, a monk in martial light ones', () => {
    expect(trained(hero(['rogue'], ['rapier', 'shortsword', 'longsword']))).toEqual({
      rapier: true,
      shortsword: true,
      longsword: false,
    });
    expect(trained(hero(['monk'], ['shortsword', 'rapier']))).toEqual({
      shortsword: true,
      rapier: false,
    });
  });

  it('asks a multiclass rogue for its skill', () => {
    const sheet = derive(hero(['fighter', 'rogue'], []), rules);
    expect(sheet.missing).toContain('level 2: rogue-multiclass/skills');
  });
});

describe('SRD 5.2.1 German texts', () => {
  const texts = (value: unknown, path: string): [string, Text][] => {
    if (Array.isArray(value)) return value.flatMap((v, i) => texts(v, `${path}[${i}]`));
    if (typeof value !== 'object' || value === null) return [];
    if ('en' in value && typeof value.en === 'string') return [[path, value as Text]];
    return Object.entries(value).flatMap(([k, v]) => texts(v, `${path}.${k}`));
  };

  // Skipped until every text has its German (phase C1b, task 3 turns it on).
  it.skip('every rules text has its German', () => {
    const problems = texts(SRD_52, 'srd').flatMap(([path, text]) =>
      germanProblems(text).map((p) => `${path}: ${p}`),
    );
    expect(problems).toEqual([]);
  });
});
