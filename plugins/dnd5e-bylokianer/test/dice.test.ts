import { describe, expect, it } from 'vitest';

import { keptD20, parseFormula, roll, rollDie } from '../src/dice/formula';

/** Random numbers giving these faces on the dice rolled, in order (any number of sides). */
const faces = (...values: number[]) => {
  let sides = 20;
  const queue = [...values];
  const random = () => {
    const v = queue.shift() ?? 1;
    return (v - 0.5) / sides;
  };
  return { random, sides: (n: number) => (sides = n) };
};
/** A random source for dice of one kind. */
const of = (sides: number, ...values: number[]) => {
  const f = faces(...values);
  f.sides(sides);
  return f.random;
};

describe('dice formulas', () => {
  it('rolls sums of dice and numbers and writes the roll as the log does', () => {
    expect(roll('d20+7', of(20, 5))).toMatchObject({
      formula: 'd20+7',
      total: 12,
      text: 'd20+7 → 12 (5, +7)',
      numbers: ['+7'],
    });
    expect(roll('2d6 + 3', of(6, 4, 3))?.text).toBe('2d6+3 → 10 (4, 3, +3)');
    expect(roll('1d8+2d6-1', of(8, 8, 1, 1))?.total).toBe(8 + 1 + 1 - 1);
    expect(roll('d20', of(20, 17))?.text).toBe('d20 → 17');
    expect(roll('W20+2', of(20, 3))?.formula).toBe('d20+2');
    expect(roll('2w6', of(6, 2, 2))?.total).toBe(4);
    expect(roll('d%', of(100, 37))).toMatchObject({ formula: 'd100', total: 37 });
    expect(roll('(2d6+3)*2', of(6, 1, 2))?.total).toBe(12);
    expect(roll('10/3', Math.random)?.total).toBe(3);
    expect(roll('-d4+5', of(4, 3))?.text).toBe('-d4+5 → 2 (-3, +5)');
  });

  it('keeps and drops dice, and rolls advantage and disadvantage', () => {
    const fourD6 = roll('4d6kh3', of(6, 6, 1, 4, 3));
    expect(fourD6?.total).toBe(13);
    expect(fourD6?.dice.map((d) => d.kept)).toEqual([true, false, true, true]);
    expect(fourD6?.text).toBe('4d6kh3 → 13 (6, [1], 4, 3)');
    expect(roll('4d6dl1', of(6, 6, 1, 4, 3))?.total).toBe(13);
    expect(roll('2d20kl1', of(20, 15, 4))?.total).toBe(4);
    expect(roll('2d20k1', of(20, 15, 4))?.total).toBe(15);
    expect(roll('4d6dh1', of(6, 6, 1, 4, 3))?.total).toBe(8);
    const adv = roll('d20+5 adv', of(20, 7, 16));
    expect(adv).toMatchObject({ formula: '2d20kh1+5', total: 21 });
    expect(adv?.text).toBe('2d20kh1+5 → 21 ([7], 16, +5)');
    expect(roll('W20 Nachteil', of(20, 7, 16))?.total).toBe(7);
    expect(roll('d20 Vorteil', of(20, 7, 16))?.total).toBe(16);
  });

  it('reads nothing that is no formula, so other grammars stay untouched', () => {
    for (const text of [
      '',
      'hello',
      '1d6!',
      '2d6r1',
      'd1',
      '0d6',
      '101d6',
      '4d6kh5',
      '2d6+',
      '((d6)',
      'd6 adv',
      '[[Street Rumours]]',
    ]) {
      expect(parseFormula(text), text).toBeNull();
    }
  });

  it('finds the kept d20 for natural 20s and 1s', () => {
    const r = roll('d20+3', of(20, 20));
    if (r === null) throw new Error('no roll');
    expect(keptD20(r)).toBe(20);
    const adv = roll('d20 adv', of(20, 1, 12));
    if (adv === null) throw new Error('no roll');
    expect(keptD20(adv)).toBe(12);
    const two = roll('2d20', of(20, 1, 12));
    if (two === null) throw new Error('no roll');
    expect(keptD20(two)).toBeNull();
    expect(rollDie(6, () => 0.9999999)).toBe(6);
    expect(rollDie(6, () => 0)).toBe(1);
  });
});
