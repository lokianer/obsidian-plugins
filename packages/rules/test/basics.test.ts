import { describe, expect, it } from 'vitest';

import { modifier, proficiencyBonus } from '../src/index';

describe('basics', () => {
  it('turns a score into its modifier', () => {
    expect([1, 10, 17, 30].map(modifier)).toEqual([-5, 0, 3, 10]);
  });

  it('gives the proficiency bonus by level', () => {
    expect([1, 4, 5, 17, 20].map(proficiencyBonus)).toEqual([2, 2, 3, 6, 6]);
  });
});
