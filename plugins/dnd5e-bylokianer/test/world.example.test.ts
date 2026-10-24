// The example vault as the contract: every expectation here is a fact written in its notes.
// If one fails because a note is wrong, fix the note (and Home.md), never the expectation.

import { describe, expect, it } from 'vitest';

import { PARTY, UNAFFILIATED } from '../src/factions/discover';
import { stance } from '../src/factions/stance';
import { buildWorld } from '../src/factions/world';
import { loadExampleVault } from './fixture';

const F = 'Silverstadt/Factions';
const ORDER = `${F}/Order of the Lantern`;
const ARCHIVISTS = `${F}/The Archivists`;
const COURT = `${F}/The Gutter Court`;
const BENCH = `${COURT}/The Bench`;
const CHOIR = `${F}/The Drowned Choir`;
const ISOLDE = `${ORDER}/Isolde Ferrant.md`;
const CORVIN = `${ARCHIVISTS}/Corvin Marsh.md`;
const ONDINE = `${ARCHIVISTS}/Ondine Vale.md`;
const MIRA = `${COURT}/Mira Voss.md`;
const SABLE = `${COURT}/Sable.md`;
const VERMILLION = `${BENCH}/Lady Vermillion.md`;
const ORRIN = 'Silverstadt/Party/Orrin Quill.md';

const world = buildWorld(loadExampleVault());

describe('the example vault — stances', () => {
  it('keeps relations one-directional, with reasons', () => {
    expect(stance(world, ORDER, COURT, 'public')).toEqual({
      value: -3,
      why: '[[Session 11 – Under the Lantern Bridge]]',
      source: ORDER,
      field: 'relations',
      inherited: false,
    });
    expect(stance(world, COURT, ORDER, 'public')).toMatchObject({ value: -4 });
  });

  it('lets Isolde Ferrant inherit both faces from the Order', () => {
    expect(stance(world, ISOLDE, ARCHIVISTS, 'public')).toMatchObject({
      value: 1,
      source: ORDER,
      inherited: true,
    });
    expect(stance(world, ISOLDE, ARCHIVISTS, 'true')).toMatchObject({
      value: -2,
      source: ORDER,
      field: 'secret_relations',
      inherited: true,
    });
  });

  it('lets Corvin Marsh speak for himself in both modes', () => {
    for (const mode of ['public', 'true'] as const) {
      expect(stance(world, CORVIN, ORDER, mode)).toMatchObject({
        value: -3,
        source: CORVIN,
        inherited: false,
      });
    }
  });

  it('gives the Bench the Court’s face and its own true stance', () => {
    expect(stance(world, BENCH, ORDER, 'public')).toMatchObject({ value: -4, source: COURT });
    expect(stance(world, BENCH, ORDER, 'true')).toMatchObject({ value: 4, source: BENCH });
    expect(stance(world, BENCH, ARCHIVISTS, 'public')).toMatchObject({ value: -1, source: BENCH });
    expect(stance(world, VERMILLION, ORDER, 'true')).toMatchObject({ value: 4, source: BENCH });
  });

  it('reads characters’ own values, also towards characters', () => {
    expect(stance(world, ONDINE, COURT, 'public')).toMatchObject({ value: -5, inherited: false });
    expect(stance(world, ORRIN, MIRA, 'public')).toMatchObject({ value: -2 });
    expect(stance(world, SABLE, ARCHIVISTS, 'true')).toMatchObject({
      value: 4,
      field: 'secret_relations',
    });
  });

  it('reads what can be read from the Drowned Choir and nothing else', () => {
    const choir = world.entities.get(CHOIR);
    expect(choir?.power).toBe(5);
    expect([...(choir?.relations ?? [])]).toEqual([
      [ARCHIVISTS, { value: 5 }],
      [COURT, { value: -1 }],
      ['?The Salt Kings', { value: -2 }],
    ]);
  });
});

describe('the example vault — entities and warnings', () => {
  it('puts the party and the unaffiliated in their pseudo-factions', () => {
    const membersOf = (id: string) =>
      [...world.entities.values()]
        .filter((e) => e.parent === id)
        .map((e) => e.name)
        .sort();
    expect(membersOf(PARTY)).toEqual(['Dagny', 'Ilex', 'Orrin Quill', 'Tessaly Vane']);
    expect(membersOf(UNAFFILIATED)).toEqual(['Brannoc Ironweld', 'Elder Wren']);
  });

  it('counts 5 factions and 14 characters', () => {
    const all = [...world.entities.values()];
    expect(all.filter((e) => e.kind === 'faction' && !e.pseudo)).toHaveLength(5);
    expect(all.filter((e) => e.kind === 'character')).toHaveLength(14);
  });

  it('warns only about the Drowned Choir and the two broken notes, once per problem', () => {
    const choir = world.warnings.filter((w) => w.path === `${CHOIR}/factions.md`);
    expect(choir.map((w) => w.code).sort()).toEqual([
      'power-out-of-range',
      'self-relation',
      'structured-without-value',
      'unknown-target',
      'value-not-a-number',
      'value-out-of-range',
    ]);
    expect(world.warnings.filter((w) => w.path !== `${CHOIR}/factions.md`)).toEqual([
      { path: `${CHOIR}/Brother Silt.md`, code: 'broken-frontmatter' },
      { path: 'Silverstadt/Quests/The Missing Bellringer.md', code: 'broken-frontmatter' },
    ]);
  });
});
