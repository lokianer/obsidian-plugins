import { describe, expect, it } from 'vitest';

import { monstersFrom, untag } from '../src/monsters/import';
import { monstersInFile } from '../src/obsidian/monster-builder';

// Small made-up monsters in each file shape — the plugin ships none; these only test the readers.

const TOOLS = {
  monster: [
    {
      name: 'Gloom Watcher',
      size: ['L'],
      type: { type: 'aberration', tags: ['shapechanger'] },
      alignment: ['L', 'E'],
      ac: [{ ac: 18, from: ['{@item natural armor}'] }],
      hp: { average: 180, formula: '19d10 + 76' },
      speed: { walk: 0, fly: { number: 20, condition: '' }, canHover: true },
      str: 10,
      dex: 14,
      con: 18,
      int: 17,
      wis: 15,
      cha: 17,
      save: { int: '+8', wis: '+7' },
      skill: { perception: '+12' },
      senses: ['darkvision 120 ft.'],
      passive: 22,
      conditionImmune: ['prone'],
      languages: ['Deep Speech', 'Undercommon'],
      cr: '13',
      trait: [{ name: 'Antimagic Gaze', entries: ['Its central eye creates a {@area cone|...}.'] }],
      action: [
        {
          name: 'Bite',
          entries: [
            '{@atk mw} {@hit 5} to hit, reach 5 ft., one target. {@h}14 ({@damage 4d6}) piercing damage.',
          ],
        },
        {
          name: 'Eye Rays {@recharge 5}',
          entries: ['It shoots rays.', { type: 'list', items: ['Charm Ray. {@dc 16} Wisdom.'] }],
        },
      ],
      legendaryHeader: ['The watcher can take 3 legendary actions.'],
      legendary: [{ name: 'Eye Ray', entries: ['It uses one random eye ray.'] }],
    },
  ],
};

const OPEN5E = {
  results: [
    {
      name: 'Pit Lord',
      size: 'Huge',
      type: 'fiend',
      subtype: 'demon',
      alignment: 'chaotic evil',
      armor_class: 19,
      armor_desc: 'natural armor',
      hit_points: 300,
      hit_dice: '24d12+144',
      speed: { walk: 50, fly: 80 },
      strength: 26,
      dexterity: 15,
      constitution: 22,
      intelligence: 20,
      wisdom: 16,
      charisma: 22,
      strength_save: null,
      dexterity_save: 9,
      constitution_save: 13,
      skills: { perception: 10 },
      damage_immunities: 'fire, poison',
      senses: 'truesight 120 ft., passive Perception 20',
      languages: 'Abyssal, telepathy 120 ft.',
      challenge_rating: '20',
      special_abilities: [{ name: 'Magic Resistance', desc: 'It has advantage.' }],
      actions: [{ name: 'Longsword', desc: 'Melee Weapon Attack: +14 to hit.' }],
      legendary_desc: '',
      legendary_actions: [],
    },
  ],
};

const BITS = {
  name: 'Bone Colossus',
  size: 'Gargantuan',
  type: 'undead',
  alignment: 'neutral evil',
  armor_class: [{ type: 'natural', value: 17 }],
  hit_points: 250,
  hit_points_roll: '20d20+40',
  speed: { walk: '40 ft.' },
  strength: 24,
  dexterity: 8,
  constitution: 14,
  intelligence: 3,
  wisdom: 8,
  charisma: 5,
  proficiencies: [
    { value: 6, proficiency: { name: 'Saving Throw: CON' } },
    { value: 3, proficiency: { name: 'Skill: Perception' } },
  ],
  damage_immunities: ['poison'],
  condition_immunities: [{ name: 'Poisoned' }],
  senses: { darkvision: '60 ft.', passive_perception: 13 },
  languages: '',
  challenge_rating: 0.5,
  actions: [{ name: 'Slam', desc: ' Melee Weapon Attack: +10 to hit. ' }],
};

describe('monster import', () => {
  it('reads a 5etools bestiary, tags and all', () => {
    const [b] = monstersFrom(TOOLS);
    expect(b).toMatchObject({
      name: 'Gloom Watcher',
      size: 'Large',
      type: 'aberration',
      subtype: 'shapechanger',
      alignment: 'lawful evil',
      ac: 18,
      acClass: 'natural armor',
      hp: 180,
      hitDice: '19d10 + 76',
      speed: '0 ft., fly 20 ft. (hover)',
      stats: [10, 14, 18, 17, 15, 17],
      senses: 'darkvision 120 ft., passive Perception 22',
      conditionImmunities: 'prone',
      languages: 'Deep Speech, Undercommon',
      cr: '13',
      legendaryDescription: 'The watcher can take 3 legendary actions.',
    });
    expect(b?.saves).toEqual([
      { key: 'int', bonus: 8 },
      { key: 'wis', bonus: 7 },
    ]);
    expect(b?.actions[0]?.desc).toBe(
      'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 14 (4d6) piercing damage.',
    );
    expect(b?.actions[1]).toEqual({
      name: 'Eye Rays (Recharge 5–6)',
      desc: 'It shoots rays.\n\n- Charm Ray. DC 16 Wisdom.',
    });
    expect(b?.legendaryActions.map((e) => e.name)).toEqual(['Eye Ray']);
  });

  it('reads Open5e and 5e-bits monsters', () => {
    const [pit] = monstersFrom(OPEN5E);
    expect(pit).toMatchObject({
      name: 'Pit Lord',
      subtype: 'demon',
      ac: 19,
      acClass: 'natural armor',
      hp: 300,
      speed: '50 ft., fly 80 ft.',
      damageImmunities: 'fire, poison',
      cr: '20',
      legendaryDescription: null,
    });
    expect(pit?.saves).toEqual([
      { key: 'dex', bonus: 9 },
      { key: 'con', bonus: 13 },
    ]);
    expect(pit?.skills).toEqual([{ key: 'perception', bonus: 10 }]);
    const [bone] = monstersFrom(BITS);
    expect(bone).toMatchObject({
      ac: 17,
      hitDice: '20d20+40',
      speed: '40 ft.',
      conditionImmunities: 'poisoned',
      senses: 'darkvision 60 ft., passive Perception 13',
      languages: null,
      cr: '1/2',
      actions: [{ name: 'Slam', desc: 'Melee Weapon Attack: +10 to hit.' }],
    });
    expect(bone?.saves).toEqual([{ key: 'con', bonus: 6 }]);
  });

  it('reads Fantasy Statblocks keys from YAML, JSON and Markdown, and skips nameless ones', () => {
    const yaml =
      'name: Ash Wight\nsize: Medium\ntype: undead\nac: 14\nhp: 45\nstats: [15, 14, 16, 10, 13, 15]\ncr: 3';
    expect(monstersInFile('ash.yaml', yaml)[0]).toMatchObject({
      name: 'Ash Wight',
      ac: 14,
      cr: '3',
    });
    const markdown = `# Two\n\n\`\`\`statblock\n${yaml}\n\`\`\`\n\ntext\n\n\`\`\`dnd5e-statblock\nname: Ember Wight\nhp: 9\n\`\`\`\n`;
    expect(monstersInFile('two.md', markdown).map((b) => b.name)).toEqual([
      'Ash Wight',
      'Ember Wight',
    ]);
    expect(
      monstersInFile('list.json', JSON.stringify([{ name: 'A' }, { hp: 3 }, { name: 'B' }])).map(
        (b) => b.name,
      ),
    ).toEqual(['A', 'B']);
    expect(() => monstersInFile('bad.json', '{')).toThrow();
  });

  it('turns 5etools tags into the SRD’s words', () => {
    expect(
      untag(
        '{@atk rw} {@hit -1} to hit. {@h}3 ({@damage 1d6}) damage, {@dc 12} or {@condition prone||x}.',
      ),
    ).toBe('Ranged Weapon Attack: -1 to hit. Hit: 3 (1d6) damage, DC 12 or prone.');
  });
});
