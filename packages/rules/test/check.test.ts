import { describe, expect, it } from 'vitest';

import fixture from '../data/fixture/fixture.json';
import { checkRules, loadRules, type RulesData } from '../src/index';

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
});
