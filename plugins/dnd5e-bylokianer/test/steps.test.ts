import { describe, expect, it } from 'vitest';

import { signed, stepColour, stepName, toStep } from '../src/factions/steps';
import { createT } from '../src/i18n/strings';

describe('steps', () => {
  it('names every step in both languages', () => {
    const en = createT('en');
    const de = createT('de');
    expect([-5, -3, 0, 2, 5].map((v) => stepName(v, en))).toEqual([
      'war',
      'hostile',
      'neutral',
      'friendly',
      'sworn',
    ]);
    expect(stepName(-4, de)).toBe('Fehde');
    expect(stepName(9, en)).toBe('sworn');
  });

  it('prefers the GM’s own names where set', () => {
    const custom = ['', '', 'enemies', '', '', '  '];
    expect(stepName(-3, createT('en'), custom)).toBe('enemies');
    expect(stepName(0, createT('en'), custom)).toBe('neutral');
  });

  it('rounds and clamps to the scale, without −0', () => {
    expect([toStep(-7), toStep(2.4), toStep(-0.2)]).toEqual([-5, 2, 0]);
    expect(Object.is(toStep(-0.2), 0)).toBe(true);
  });

  it('writes the sign out', () => {
    expect([signed(3), signed(0), signed(-3)]).toEqual(['+3', '0', '−3']);
  });

  it('mixes the theme’s red, yellow and green', () => {
    expect(stepColour(-5)).toBe('var(--color-red)');
    expect(stepColour(0)).toBe('var(--color-yellow)');
    expect(stepColour(5)).toBe('var(--color-green)');
    expect(stepColour(-2)).toBe('color-mix(in srgb, var(--color-red) 40%, var(--color-yellow))');
    expect(stepColour(4)).toBe('color-mix(in srgb, var(--color-green) 80%, var(--color-yellow))');
  });
});
