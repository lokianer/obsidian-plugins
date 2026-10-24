import { describe, expect, it } from 'vitest';

import { PARTY } from '../src/factions/discover';
import { buildFactionView } from '../src/factions/faction-view';
import { buildWorld } from '../src/factions/world';
import { loadExampleVault, withoutSecrets } from './fixture';

const world = buildWorld(loadExampleVault());
const F = 'Silverstadt/Factions';
const ORDER = `${F}/Order of the Lantern`;
const ARCHIVISTS = `${F}/The Archivists`;
const COURT = `${F}/The Gutter Court`;
const BENCH = `${COURT}/The Bench`;

describe('buildFactionView', () => {
  const court = buildFactionView(world, COURT, 'public');

  it('puts characters first, then sub-factions, with rings on those out of line', () => {
    expect(court?.members.map((m) => [m.name, m.kind, m.ring])).toEqual([
      ['Mira Voss', 'character', true],
      ['Sable', 'character', false],
      ['The Bench', 'faction', true],
    ]);
    expect(buildFactionView(world, BENCH, 'public')?.parents).toEqual([
      { id: COURT, name: 'The Gutter Court' },
    ]);
  });

  it('draws the faction’s own values and its members’ stances, own or inherited', () => {
    const arrow = (from: string, to: string) => court?.arrows.find((a) => a.id === `${from}→${to}`);
    expect(arrow(COURT, ORDER)).toMatchObject({ value: -4, inherited: false });
    expect(arrow(`${COURT}/Mira Voss.md`, ARCHIVISTS)).toMatchObject({
      value: -5,
      inherited: false,
    });
    expect(arrow(`${COURT}/Sable.md`, ORDER)).toMatchObject({
      value: -4,
      inherited: true,
      sourceName: 'The Gutter Court',
    });
  });

  it('lets Isolde Ferrant inherit everything and rings Corvin Marsh', () => {
    const order = buildFactionView(world, ORDER, 'public');
    const isolde = order?.arrows.filter((a) => a.from === `${ORDER}/Isolde Ferrant.md`) ?? [];
    expect(isolde.length).toBeGreaterThan(0);
    expect(isolde.every((a) => a.inherited)).toBe(true);
    const archivists = buildFactionView(world, ARCHIVISTS, 'public');
    expect(archivists?.members.find((m) => m.name === 'Corvin Marsh')?.ring).toBe(true);
  });

  it('boxes what the arrows reach, characters beside their own faction', () => {
    const bench = buildFactionView(world, BENCH, 'public');
    expect(bench?.boxes.map((b) => b.name)).toContain('The Gutter Court');
    expect(court?.boxes.map((b) => [b.name, b.kind])).toContainEqual([
      'Order of the Lantern',
      'faction',
    ]);
    expect(court?.boxes.some((b) => b.id === COURT || b.id === BENCH)).toBe(false);
  });

  it('opens the Party like a faction, without power or own values', () => {
    const party = buildFactionView(world, PARTY, 'public');
    expect(party?.power).toBeNull();
    expect(party?.members.every((m) => m.kind === 'character' && !m.ring)).toBe(true);
    expect(party?.arrows.some((a) => a.from === PARTY)).toBe(false);
  });

  it('shows nothing secret in Public mode', () => {
    expect(buildFactionView(withoutSecrets(world), COURT, 'public')).toEqual(court);
    expect(
      buildFactionView(world, BENCH, 'true')?.arrows.find((a) => a.id === `${BENCH}→${ORDER}`),
    ).toMatchObject({
      value: 4,
      differs: true,
    });
  });
});
