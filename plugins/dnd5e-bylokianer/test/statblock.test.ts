import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import {
  convertBlocks,
  crValue,
  experience,
  findStatblocks,
  formatBonus,
  modifier,
  parseStatblock,
  proficiencyBonus,
  summary,
} from '../src/npc/statblock';

const vault = join(import.meta.dirname, '../../../examples/vault/Silverstadt/Factions');
const read = (path: string) => readFileSync(join(vault, path), 'utf8');
const firstBlock = (text: string) => {
  const block = findStatblocks(text)[0];
  if (block === undefined) throw new Error('no stat block');
  return parseStatblock(parse(block.source));
};

describe('parseStatblock', () => {
  it('reads every part of a full stat block and keeps unknown keys', () => {
    const mira = firstBlock(read('The Gutter Court/Mira Voss.md'));
    expect(mira).toMatchObject({
      name: 'Mira Voss',
      size: 'Medium',
      type: 'humanoid',
      subtype: 'half-elf',
      alignment: 'lawful evil',
      ac: 16,
      hp: 84,
      hitDice: '13d8 + 26',
      speed: '30 ft.',
      stats: [11, 18, 14, 17, 15, 16],
      saves: [
        { key: 'dex', bonus: 7 },
        { key: 'int', bonus: 6 },
      ],
      cr: '5',
      extra: { ledger_pages: 412 },
      unreadable: [],
    });
    expect(mira.skills.map((s) => s.key)).toEqual(['deception', 'insight', 'investigation']);
    expect(mira.traits.map((t) => t.name)).toEqual(['Cunning Action', 'Every Debt Recorded']);
    expect(mira.reactions[0]?.name).toBe('Call the Debt');
  });

  it('reads AC with its armour note, fractional CR and spells', () => {
    const block = parseStatblock(
      parse(
        [
          'ac: 16 (chain shirt, shield)',
          'ac_class: chain shirt, shield',
          'cr: 1/8',
          'spells:',
          '  - The acolyte is a 1st-level spellcaster.',
          '  - Cantrips (at will): light, sacred flame',
        ].join('\n'),
      ),
    );
    expect(block).toMatchObject({ ac: 16, acClass: 'chain shirt, shield', cr: '1/8' });
    expect(block.spells).toEqual([
      'The acolyte is a 1st-level spellcaster.',
      'Cantrips (at will): light, sacred flame',
    ]);
  });

  it('reports values it cannot read and renders the rest', () => {
    const block = parseStatblock({ name: 'X', hp: 'lots', stats: [1, 2], cr: 'high', actions: 3 });
    expect(block.name).toBe('X');
    expect([...block.unreadable].sort()).toEqual(['actions', 'cr', 'hp', 'stats']);
    expect(parseStatblock(null).unreadable).toEqual([]);
  });
});

describe('derived values', () => {
  it('computes modifiers, proficiency bonus and XP as the SRD does', () => {
    expect([1, 9, 10, 11, 12, 30].map(modifier)).toEqual([-5, -1, 0, 0, 1, 10]);
    expect([3, 0, -1].map(formatBonus)).toEqual(['+3', '+0', '−1']);
    const pb = ['0', '1/8', '4', '5', '8', '9', '12', '13', '17', '21', '25', '29', '30'];
    expect(pb.map(proficiencyBonus)).toEqual([2, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8, 9, 9]);
    expect(['1/4', '3', '30'].map(experience)).toEqual([50, 700, 155000]);
    expect(['1/2', '31', '2.5', 'x'].map(crValue)).toEqual([0.5, null, null, null]);
  });

  it('sums up AC, HP and CR for the card', () => {
    expect(summary(firstBlock(read('Order of the Lantern/Aldric Thane.md')))).toBe(
      'AC 18 · HP 52 · CR 3',
    );
    expect(summary(parseStatblock({ hp: 4 }))).toBe('HP 4');
  });
});

describe('blocks in a note', () => {
  const note = [
    '# Pell',
    '```statblock',
    'name: Pell',
    '```',
    '```js',
    '```statblock',
    '```',
    '~~~dnd5e-statblock',
    'name: Other',
    '~~~',
  ].join('\r\n');

  it('finds ours and Fantasy Statblocks’, not a fence inside another block', () => {
    expect(findStatblocks(note).map((b) => [b.name, b.open, b.close, b.source])).toEqual([
      ['statblock', 1, 3, 'name: Pell'],
      ['dnd5e-statblock', 7, 9, 'name: Other'],
    ]);
  });

  it('converts Fantasy Statblocks’ blocks first, then back, touching only fence lines', () => {
    const there = convertBlocks(note);
    expect(there.count).toBe(1);
    expect(there.text.split('\r\n')).toEqual([
      '# Pell',
      '```dnd5e-statblock',
      ...note.split('\r\n').slice(2),
    ]);
    const back = convertBlocks(there.text);
    expect(back.count).toBe(2);
    expect(back.text).toBe(note.replace('~~~dnd5e-statblock', '~~~statblock'));
    expect(convertBlocks('# none').count).toBe(0);
  });
});
