import { describe, expect, it } from 'vitest';

import fixture from '../data/fixture/fixture.json';
import { checkRules, germanProblems, loadRules, local, type RulesData } from '../src/index';

const base = fixture as RulesData;
const copy = (): RulesData => structuredClone(base);

describe('the data check', () => {
  it('finds nothing wrong with the fixture', () => {
    expect(checkRules(loadRules([base]))).toEqual([]);
  });

  it('looks records up by id', () => {
    const rules = loadRules([base]);
    expect(rules.class('tester')?.hitDie).toBe(10);
    expect(rules.feat('fixture-feat')?.category).toBe('origin');
    expect(rules.weapon('nope')).toBeUndefined();
  });

  it('reports a background whose feat is missing', () => {
    const data = copy();
    data.backgrounds[0]!.feat = 'nope';
    expect(checkRules(loadRules([data]))).toEqual(["background fixture-bg: unknown feat 'nope'"]);
  });

  it('reports a duplicated id', () => {
    const data = copy();
    data.classes.push(structuredClone(data.classes[0]!));
    expect(checkRules(loadRules([data]))).toContain("duplicate class id 'tester'");
  });

  it('reports a duplicated tool or language id', () => {
    const data = copy();
    data.tools.push({ id: 'kit', name: { en: 'Kit' }, category: 'other' });
    data.tools.push({ id: 'kit', name: { en: 'Kit' }, category: 'other' });
    data.languages.push({ id: 'elvish', name: { en: 'Elvish' }, rare: false });
    data.languages.push({ id: 'elvish', name: { en: 'Elvish' }, rare: false });
    expect(checkRules(loadRules([data]))).toEqual([
      "duplicate tool id 'kit'",
      "duplicate language id 'elvish'",
    ]);
  });

  it('reports a level table that is not 20 long', () => {
    const data = copy();
    data.classes[0]!.features[0]!.grants.push({
      kind: 'resource',
      id: 'grit',
      name: { en: 'Grit' },
      uses: { byLevel: Array<number>(19).fill(1) },
      recharge: 'long',
    });
    expect(checkRules(loadRules([data]))).toEqual([
      'class tester tester-core: byLevel has 19 entries, not 20',
    ]);
  });
  it('names a weapon proficiency that is no category, weapon or category with a property', () => {
    const data = structuredClone(fixture) as RulesData;
    data.classes[0]!.features[0]!.grants.push({
      kind: 'proficiency',
      what: 'weapon',
      ids: ['martial-finesse', 'longsword', 'martial-lite'],
    });
    expect(checkRules(loadRules([data]))).toEqual([
      "class tester tester-core: unknown weapon proficiency 'martial-lite'",
    ]);
  });

  it('reports an option whose prerequisite names an option that is not there', () => {
    const data = copy();
    const option = (id: string, requires?: { level?: number; option?: string }) => ({
      id,
      name: { en: id },
      level: 1,
      text: { en: id },
      requires,
      grants: [],
      choices: [],
    });
    data.classes[0]!.features[0]!.choices.push({
      id: 'picks',
      name: { en: 'Picks' },
      count: 1,
      gives: 'option',
      from: {
        options: [
          option('a'),
          option('b', { level: 5, option: 'a' }),
          option('c', { option: 'zzz' }),
        ],
      },
    });
    expect(checkRules(loadRules([data]))).toEqual([
      "class tester tester-core/picks c: requires unknown option 'zzz'",
    ]);
  });

  it('reports an empty German text', () => {
    const data = copy();
    data.classes[0]!.features[0]!.text.de = '';
    expect(checkRules(loadRules([data]))).toEqual([
      'classes[0].features[0].text: empty German text',
    ]);
  });
});

describe('the German text check', () => {
  const problems = (en: string, de: string) => germanProblems({ en, de });

  it('accepts a sound translation, dice written with W', () => {
    expect(problems('Deal 2d6 + 1d8 damage.', 'Verursache 2W6 + 1W8 Schaden.')).toEqual([]);
    expect(problems('Roll a d20.', 'Wirf einen W20.')).toEqual([]);
  });

  it('reports an empty or missing translation', () => {
    expect(germanProblems({ en: 'Rage' })).toEqual(['no German text']);
    expect(problems('Rage', '  ')).toEqual(['no German text']);
  });

  it('reports dice that differ', () => {
    expect(problems('Deal 1d8 damage.', 'Verursache 1d8 Schaden.')).toHaveLength(1);
  });

  it('needs every English die in the German text, extra German dice allowed', () => {
    expect(problems('D8 per Bard level', 'W8 pro Bardenstufe')).toEqual([]);
    expect(problems('roll a d20', 'würfle einen W20 und addiere den W20')).toEqual([]);
    expect(problems('Roll.', 'Wirf einen W20.')).toEqual([]);
    expect(problems('2d6 damage', '1W6 Schaden')).toHaveLength(1);
  });

  it('does not mistake German words for units', () => {
    expect(problems('Strength. Poison. Half.', 'Die Kraft. Das Gift. Halb.')).toEqual([]);
    expect(problems('30 feet', '9 m (30 ft.)')).not.toEqual([]);
    expect(problems('5 feet', '5 Fuß')).not.toEqual([]);
    expect(problems('5 pounds', '5 pounds')).not.toEqual([]);
  });

  it('keeps single capitals that the English text has too', () => {
    expect(problems('Option A or B', 'Option A oder B')).toEqual([]);
    expect(problems('Cleric', 'K leriker')).not.toEqual([]);
  });

  it('treats a blank German text as empty everywhere', () => {
    expect(local({ en: 'Rage', de: '  ' }, 'de')).toBe('Rage');
    const data = copy();
    data.classes[0]!.features[0]!.text.de = ' ';
    expect(checkRules(loadRules([data]))).toEqual([
      'classes[0].features[0].text: empty German text',
    ]);
  });

  it('reports imperial units', () => {
    expect(problems('30 feet.', '30 feet.')).not.toEqual([]);
    expect(problems('5 lb.', '5 lb. schwer')).not.toEqual([]);
    expect(problems('30 feet', '9 Meter')).toEqual([]);
  });

  it('reports a split word fragment but not ordinary German', () => {
    expect(problems('Cleric', 'K leriker')).not.toEqual([]);
    expect(problems('A', 'Der Kleriker wirkt einen Zauber auf sich selbst.')).toEqual([]);
    expect(problems('A', 'Ein Hieb, a und (A) Lederrüstung')).toEqual([]);
  });

  it('reports a hyphen at a line break', () => {
    expect(problems('A', 'Zau-\nber')).not.toEqual([]);
  });
});
