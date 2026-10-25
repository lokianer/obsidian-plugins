import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import { budget, encounterNoteText, rating } from '../src/battle/budget';
import { addMonsterEntry, readEncounter } from '../src/battle/encounter';

describe('the XP budget (SRD 5.2.1)', () => {
  it('matches the SRD examples and the table ends', () => {
    // Example 1: low, four level 1 characters → 200; example 2: moderate, five level 3 → 1,125.
    expect(budget([1, 1, 1, 1], 'low')).toBe(200);
    expect(budget([3, 3, 3, 3, 3], 'moderate')).toBe(1125);
    expect(budget([20], 'high')).toBe(22000);
    expect(budget([6], 'moderate')).toBe(1000);
    // Mixed levels: each character's own entry; out of range clamps.
    expect(budget([5, 6], 'high')).toBe(1100 + 1400);
    expect(budget([0, 25], 'low')).toBe(50 + 6400);
    expect(budget([], 'low')).toBe(0);
  });

  it('rates an encounter by the first budget it fits', () => {
    const party = [1, 1, 1, 1];
    expect(rating(0, party)).toBe('none');
    expect(rating(150, party)).toBe('low');
    expect(rating(200, party)).toBe('low');
    expect(rating(201, party)).toBe('moderate');
    expect(rating(400, party)).toBe('high');
    expect(rating(401, party)).toBe('beyond');
    expect(rating(100, [])).toBe('none');
  });
});

describe('the encounter note', () => {
  it('writes what the battle tracker reads', () => {
    const text = encounterNoteText({
      name: 'Owls at the mill',
      location: '[[Old Mill]]',
      difficulty: 'moderate',
      party: false,
      monsters: [
        { name: 'Owlbear', count: 2 },
        { name: 'Giant Rat', count: 1 },
        { name: 'Ghast: Hungry', count: 1 },
        { name: 'Nobody', count: 0 },
      ],
    });
    const fm = parse(text.split('---')[1] ?? '') as Record<string, unknown>;
    expect(fm).toMatchObject({
      type: 'encounter',
      difficulty: 'moderate',
      location: '[[Old Mill]]',
    });
    const spec = readEncounter(fm);
    expect(spec.party).toBe(false);
    expect(spec.combatants).toEqual([
      { kind: 'monster', monster: 'Owlbear', name: null, side: null, count: 2 },
      { kind: 'monster', monster: 'Giant Rat', name: null, side: null, count: 1 },
      { kind: 'monster', monster: 'Ghast: Hungry', name: null, side: null, count: 1 },
    ]);
    expect(text).toContain('\n# Owls at the mill\n');
    const empty = encounterNoteText({
      name: 'E',
      location: '',
      difficulty: 'low',
      party: true,
      monsters: [],
    });
    expect(parse(empty.split('---')[1] ?? '')).toEqual({
      type: 'encounter',
      difficulty: 'low',
      combatants: [],
      tags: ['encounter'],
    });
  });

  it('adds a monster to an encounter, raising the count of its entry', () => {
    const list = [
      '[[Sable]]',
      { monster: 'Owlbear', name: 'Mother owl' },
      { monster: 'Owlbear', count: 2 },
    ];
    expect(addMonsterEntry(list, 'Owlbear')).toEqual([
      '[[Sable]]',
      { monster: 'Owlbear', name: 'Mother owl' },
      { monster: 'Owlbear', count: 3 },
    ]);
    expect(addMonsterEntry(list, 'Giant Rat')).toEqual([...list, { monster: 'Giant Rat' }]);
    expect(addMonsterEntry(undefined, 'Giant Rat')).toEqual([{ monster: 'Giant Rat' }]);
    expect(addMonsterEntry([{ monster: 'Giant Rat' }], 'Giant Rat')).toEqual([
      { monster: 'Giant Rat', count: 2 },
    ]);
  });
});
