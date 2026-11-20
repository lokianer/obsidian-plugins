import { describe, expect, it } from 'vitest';

import { type Character, derive, loadRules, SRD_52 } from '../src/index';

/** Wren Ashdown, the example vault's bard: every number below is worked out by hand from the SRD. */
const wren: Character = {
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
        'bard-subclass/subclass': ['bard/college-of-lore'],
        'lore-bonus-proficiencies/skills': ['arcana', 'insight', 'perception'],
      },
    },
    {
      class: 'bard',
      hp: 'average',
      choices: {
        'bard-asi-4/feat': ['ability-score-improvement'],
        'ability-score-improvement/abilities': ['cha', 'cha'],
      },
    },
    { class: 'bard', hp: 'average', choices: {} },
    { class: 'bard', hp: 'average', choices: {} },
  ],
  inventory: [
    { item: 'leather', equipped: true },
    { item: 'dagger', equipped: true },
  ],
  bonuses: [],
};

describe('the reference character', () => {
  const sheet = derive(wren, loadRules([SRD_52]));

  it('is complete and fully known', () => {
    expect(sheet.missing).toEqual([]);
    expect(sheet.unknown).toEqual([]);
    expect(sheet.classes).toEqual([{ id: 'bard', level: 6, subclass: 'bard/college-of-lore' }]);
  });

  it('has its scores, proficiency, hit points, armour class, initiative and speed', () => {
    expect([
      sheet.abilities.dex.score,
      sheet.abilities.con.score,
      sheet.abilities.cha.score,
    ]).toEqual([16, 13, 17]);
    expect(sheet.proficiency).toBe(3);
    expect(sheet.hp.total).toBe(39);
    expect(sheet.ac.total).toBe(14);
    expect(sheet.initiative.total).toBe(6);
    expect(sheet.speed).toBe(30);
  });

  it('has its saves, skills and passive Perception', () => {
    expect([sheet.saves.dex.total, sheet.saves.cha.total, sheet.saves.str.total]).toEqual([
      6, 6, -1,
    ]);
    expect(sheet.skills.persuasion?.total).toBe(9);
    expect(sheet.skills.deception?.total).toBe(9);
    expect(sheet.skills.perception?.total).toBe(4);
    expect(sheet.skills.athletics?.total).toBe(0);
    expect(sheet.passive.perception).toBe(14);
  });

  it('attacks with the dagger and casts as a bard', () => {
    expect(sheet.attacks).toHaveLength(1);
    expect(sheet.attacks[0]).toMatchObject({ damage: '1d4+3', toHit: { total: 6 } });
    expect(sheet.spellcasting[0]).toMatchObject({ dc: 14, attack: 6 });
    expect(sheet.slots).toEqual([4, 3, 3]);
    expect(sheet.resources.find((r) => r.id === 'bardic-inspiration')).toMatchObject({
      uses: 3,
      die: 'd8',
      recharge: 'short',
    });
  });
});
