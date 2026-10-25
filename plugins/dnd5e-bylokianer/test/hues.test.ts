import { describe, expect, it } from 'vitest';

import { PARTY } from '../src/factions/discover';
import { factionHues, initials } from '../src/factions/hues';
import { buildWorld } from '../src/factions/world';
import { loadExampleVault } from './fixture';

const world = buildWorld(loadExampleVault());
const F = 'Silverstadt/Factions';
const COURT = `${F}/The Gutter Court`;

describe('factionHues', () => {
  const hues = factionHues(world);

  it('gives top-level factions the palette in name order, avoiding the value colours', () => {
    const top = [...world.entities.values()]
      .filter((e) => e.kind === 'faction' && !e.pseudo && e.parent === null)
      .map((e) => hues.get(e.id));
    expect(top.every((h) => h !== undefined)).toBe(true);
    expect(new Set(top).size).toBe(Math.min(top.length, 5));
    expect([...hues.values()].some((h) => ['red', 'green', 'yellow'].includes(h))).toBe(false);
  });

  it('passes a faction’s hue to its sub-factions and members, never to the Party', () => {
    expect(hues.get(`${COURT}/The Bench`)).toBe(hues.get(COURT));
    const id = (name: string) =>
      [...world.entities.values()].find((e) => e.name === name)?.id ?? '';
    expect(hues.get(id('Sable'))).toBe(hues.get(COURT));
    expect(hues.has(PARTY)).toBe(false);
    expect(hues.has(id('Dagny'))).toBe(false);
  });
});

describe('initials', () => {
  it('takes the first letters of the words that matter', () => {
    expect(initials('The Gutter Court')).toBe('GC');
    expect(initials('Order of the Lantern')).toBe('OL');
    expect(initials('Sable')).toBe('SA');
    expect(initials('The Bench')).toBe('BE');
    expect(initials('Die Kinder der Flut')).toBe('KF');
  });
});
