import { describe, expect, it } from 'vitest';

import fixture from '../data/fixture/fixture.json';
import { type Character, derive, loadRules, type RulesData, SRD_52 } from '../src/index';

const rules = loadRules([fixture as RulesData]);

/** A level-4 tester: background +2 str +1 con, athletics expertise, ASI str +2, no subclass yet. */
function tester(): Character {
  return {
    rules: '2024',
    species: 'fixture-folk',
    background: 'fixture-bg',
    abilities: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
    choices: { 'fixture-bg-abilities/abilities': ['str', 'str', 'con'] },
    levels: [
      {
        class: 'tester',
        hp: 'max',
        choices: { 'tester-core/skills': ['athletics', 'perception'] },
      },
      { class: 'tester', hp: 'average', choices: { 'tester-expertise/skills': ['athletics'] } },
      { class: 'tester', hp: 'average', choices: {} },
      {
        class: 'tester',
        hp: 'average',
        choices: {
          'tester-asi/feat': ['ability-score-improvement'],
          'asi/abilities': ['str', 'str'],
        },
      },
    ],
    inventory: [],
    bonuses: [],
  };
}

describe('derive', () => {
  it('adds the background and the ASI to the scores', () => {
    const sheet = derive(tester(), rules);
    expect(sheet.abilities.str).toEqual({ score: 19, modifier: 4 });
    expect(sheet.abilities.con).toEqual({ score: 14, modifier: 2 });
    expect(sheet.level).toBe(4);
    expect(sheet.classes).toEqual([{ id: 'tester', level: 4, subclass: null }]);
  });

  it('never raises a score past 20', () => {
    const c = tester();
    c.abilities.str = 18;
    expect(derive(c, rules).abilities.str.score).toBe(20);
  });

  it('gives saves with their sources', () => {
    const sheet = derive(tester(), rules);
    expect(sheet.proficiency).toBe(2);
    expect(sheet.saves.str).toEqual({
      total: 6,
      proficient: true,
      sources: [
        { label: 'str', value: 4 },
        { label: 'proficiency', value: 2 },
      ],
    });
    expect(sheet.saves.dex.total).toBe(2);
  });

  it('counts hit points by level, and per-level grants', () => {
    expect(derive(tester(), rules).hp.total).toBe(12 + 3 * 8);
    const c = tester();
    c.levels[2]!.choices = { 'tester-subclass/subclass': ['tester/tough'] };
    const sheet = derive(c, rules);
    expect(sheet.hp.total).toBe(12 + 3 * 8 + 4);
    expect(sheet.classes[0]!.subclass).toBe('tester/tough');
  });

  it('ranks skills: proficiency, expertise, half proficiency elsewhere', () => {
    const sheet = derive(tester(), rules);
    expect(sheet.skills.athletics).toMatchObject({ total: 8, rank: 2 });
    expect(sheet.skills.perception).toMatchObject({ total: 2, rank: 1 });
    expect(sheet.skills.insight).toMatchObject({ total: 2, rank: 1 });
    expect(sheet.skills.arcana).toMatchObject({ total: 3, rank: 1 });
    expect(sheet.skills.stealth).toMatchObject({ total: 3, rank: 0.5 });
    expect(sheet.passive.perception).toBe(12);
  });

  it('adds a feat to initiative, the species to speed and senses', () => {
    const sheet = derive(tester(), rules);
    expect(sheet.initiative.total).toBe(4);
    expect(sheet.speed).toBe(30);
    expect(sheet.senses).toEqual([{ id: 'darkvision', range: 60 }]);
  });

  it('names what is not chosen yet and what it does not know, without throwing', () => {
    expect(derive(tester(), rules).missing).toEqual(['level 3: tester-subclass/subclass']);
    const c = tester();
    c.levels[2]!.choices = { 'tester-subclass/subclass': ['tester/nope'] };
    c.levels.push({ class: 'wizard', hp: 'average', choices: {} });
    const sheet = derive(c, rules);
    expect([...sheet.unknown].sort()).toEqual(['tester/nope', 'wizard']);
    expect(sheet.abilities.str.score).toBe(19);
  });
});

describe('growing choices stored per level as the increment', () => {
  const srd = loadRules([SRD_52]);
  const INV = 'warlock-eldritch-invocations/invocations';
  const inv = (n: number) =>
    ['agonizing-blast', 'armor-of-shadows', 'ascendant-step', 'devils-sight', 'devouring-blade']
      .slice(0, n)
      .map((o) => `warlock-invocation-${o}`);
  const hero = (cls: string, count: number, choices: Record<string, string[]>[]): Character => ({
    rules: '2024',
    species: 'human',
    background: 'soldier',
    abilities: { str: 10, dex: 16, con: 12, int: 10, wis: 14, cha: 10 },
    choices: {},
    levels: Array.from({ length: count }, (_, i) => ({
      class: cls,
      hp: i === 0 ? 'max' : 'average',
      choices: choices[i] ?? {},
    })),
    inventory: [],
    bonuses: [],
  });
  const options = (c: Character) =>
    derive(c, srd).features.filter((f) => f.id.startsWith('warlock-invocation-'));
  const short = (c: Character) => derive(c, srd).missing.filter((m) => m.includes('invocations'));
  const all = inv(5);

  it('reads growing choices spread over the levels', () => {
    const c = hero('warlock', 5, [
      { [INV]: all.slice(0, 1) },
      { [INV]: all.slice(1, 3) },
      {},
      {},
      { [INV]: all.slice(3, 5) },
    ]);
    expect(options(c)).toHaveLength(5);
    expect(short(c)).toEqual([]);
  });

  it('reports a short increment at its level', () => {
    const c = hero('warlock', 5, [{ [INV]: all.slice(0, 1) }, { [INV]: all.slice(1, 3) }]);
    expect(short(c)).toEqual([`level 5: ${INV}`]);
  });

  it('accepts all growing choices at the first level', () => {
    const c = hero('warlock', 5, [{ [INV]: all }]);
    expect(options(c)).toHaveLength(5);
    expect(short(c)).toEqual([]);
  });

  it('reads weapon mastery spread over levels', () => {
    const M = 'fighter-weapon-mastery/mastery';
    const c = hero('fighter', 4, [
      { [M]: ['club', 'dagger', 'greatclub'] },
      {},
      {},
      { [M]: ['longsword'] },
    ]);
    expect(derive(c, srd).missing.filter((m) => m.includes('mastery'))).toEqual([]);
    expect(derive(c, srd).masteries).toEqual(['club', 'dagger', 'greatclub', 'longsword']);
  });
});

describe('the languages of a new character', () => {
  const srd = loadRules([SRD_52]);
  const wren = (languages: string[]): Character => ({
    rules: '2024',
    species: 'halfling',
    background: 'criminal',
    abilities: { str: 8, dex: 14, con: 12, int: 10, wis: 13, cha: 15 },
    choices: {
      'criminal-ability-scores/abilities': ['dex', 'dex', 'con'],
      ...(languages.length > 0 ? { 'origin-languages/languages': languages } : {}),
    },
    levels: [{ class: 'bard', hp: 'max', choices: {} }],
    inventory: [],
    bonuses: [],
  });
  const missing = (c: Character) =>
    derive(c, srd).missing.filter((m) => m.includes('origin-languages'));

  it('asks for two languages until they are chosen', () => {
    expect(missing(wren([]))).toEqual(['origin-languages/languages']);
    expect(missing(wren(['elvish']))).toEqual(['origin-languages/languages']);
    expect(missing(wren(['elvish', 'halfling']))).toEqual([]);
  });
});
