import { describe, expect, it } from 'vitest';

import { PARTY, UNAFFILIATED } from '../src/factions/discover';
import { buildGraph } from '../src/factions/world-graph';
import { buildWorld } from '../src/factions/world';
import { loadExampleVault, withoutSecrets } from './fixture';

const world = buildWorld(loadExampleVault());
const F = 'Silverstadt/Factions';
const ORDER = `${F}/Order of the Lantern`;
const COURT = `${F}/The Gutter Court`;
const BENCH = `${COURT}/The Bench`;

describe('buildGraph', () => {
  const graph = buildGraph(world, 'public');

  it('draws factions, frames and ghosts', () => {
    const kinds = graph.nodes.map((n) => [n.kind, n.name]);
    expect(kinds.filter(([k]) => k === 'faction')).toHaveLength(7);
    expect(kinds).toContainEqual(['ghost', 'The Salt Kings']);
    const party = graph.nodes.find((n) => n.id === PARTY);
    expect(party?.kind === 'frame' && party.rows.map((r) => r.name)).toEqual([
      'Dagny',
      'Ilex',
      'Orrin Quill',
      'Tessaly Vane',
    ]);
    expect(graph.nodes.some((n) => n.id === UNAFFILIATED)).toBe(true);
    expect(graph.ties).toEqual([{ child: BENCH, parent: COURT }]);
  });

  it('keeps relations one-directional, with reasons', () => {
    const edge = (from: string, to: string) => graph.edges.find((e) => e.id === `${from}→${to}`);
    expect(edge(ORDER, COURT)).toMatchObject({
      value: -3,
      why: '[[Session 11 – Under the Lantern Bridge]]',
      differs: false,
    });
    expect(edge(COURT, ORDER)?.value).toBe(-4);
  });

  it('draws only own values, never inherited ones', () => {
    expect(graph.edges.some((e) => e.id === `${BENCH}→${ORDER}`)).toBe(false);
    expect(buildGraph(world, 'true').edges.find((e) => e.id === `${BENCH}→${ORDER}`)).toMatchObject(
      {
        value: 4,
        differs: true,
      },
    );
  });

  it('draws a character in a frame from its frame, towards factions only', () => {
    const fromParty = graph.edges.filter((e) => e.sourceNode === PARTY);
    expect(fromParty.map((e) => [e.source, e.target, e.value])).toEqual([
      ['Silverstadt/Party/Ilex.md', `${F}/The Archivists`, 2],
    ]);
    expect(graph.edges.find((e) => e.sourceNode === UNAFFILIATED)).toMatchObject({
      target: `${F}/The Drowned Choir`,
      value: -3,
      why: 'the Choir sings in her reed beds',
    });
  });

  it('shows nothing secret in Public mode', () => {
    expect(buildGraph(withoutSecrets(world), 'public')).toEqual(graph);
    expect(graph.edges.every((e) => !e.differs)).toBe(true);
  });
});
