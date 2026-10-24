import { describe, expect, it } from 'vitest';

import { layout, nodeRadius } from '../src/factions/layout';
import { buildGraph } from '../src/factions/world-graph';
import { buildWorld } from '../src/factions/world';
import { loadExampleVault } from './fixture';

const world = buildWorld(loadExampleVault());
const graph = buildGraph(world, 'public');
const distance = (p: Map<string, { x: number; y: number }>, a: string, b: string) => {
  const [pa, pb] = [p.get(a), p.get(b)];
  return pa && pb ? Math.hypot(pa.x - pb.x, pa.y - pb.y) : NaN;
};

describe('layout', () => {
  it('lays the same graph out the same way every time', () => {
    expect([...layout(graph)]).toEqual([...layout(graph)]);
  });

  it('places every node, ghosts and frames included', () => {
    const positions = layout(graph);
    expect([...positions.keys()].sort()).toEqual(graph.nodes.map((n) => n.id).sort());
    for (const p of positions.values()) {
      expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
    }
  });

  it('pulls mutual friends closer than mutual enemies', () => {
    const positions = layout(graph);
    const pairs = new Map<string, number>();
    for (const e of graph.edges) {
      const key = [e.sourceNode, e.target].sort().join('|');
      pairs.set(key, (pairs.get(key) ?? 0) + e.value);
    }
    const near = [...pairs].filter(([, sum]) => sum >= 2).map(([k]) => k.split('|'));
    const far = [...pairs].filter(([, sum]) => sum <= -4).map(([k]) => k.split('|'));
    expect(near.length).toBeGreaterThan(0);
    expect(far.length).toBeGreaterThan(0);
    const mean = (list: string[][]) =>
      list.reduce((s, [a, b]) => s + distance(positions, a ?? '', b ?? ''), 0) / list.length;
    expect(mean(near)).toBeLessThan(mean(far));
  });

  it('keeps a laid-out graph nearly still when started from its own positions', () => {
    const first = layout(graph);
    const second = layout(graph, Object.fromEntries(first));
    for (const [id, p] of first) {
      const q = second.get(id);
      expect(Math.hypot(p.x - (q?.x ?? 0), p.y - (q?.y ?? 0)), id).toBeLessThan(60);
    }
  });

  it('leaves pinned nodes where they are', () => {
    const id = graph.nodes[0]?.id ?? '';
    const positions = layout(graph, { [id]: { x: 999, y: -999, pinned: true } });
    expect(positions.get(id)).toEqual({ x: 999, y: -999 });
  });

  it('sizes factions by power', () => {
    expect(nodeRadius({ kind: 'faction', id: 'a', name: 'A', power: 1, notePath: null })).toBe(22);
    expect(nodeRadius({ kind: 'faction', id: 'a', name: 'A', power: 5, notePath: null })).toBe(46);
  });
});
