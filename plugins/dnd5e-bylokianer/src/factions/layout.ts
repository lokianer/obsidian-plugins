// The graph's bloc layout: positive relations pull, negative ones push, sub-factions stay by their
// parent. Computed off-screen in a fixed number of ticks — no timers, no DOM — from a deterministic
// or cached start, so the same world always lays out the same. The only user of d3-force.

import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';

import type { GraphNode, WorldGraph } from './world-graph';

export interface Point {
  x: number;
  y: number;
}

/** A position as kept between openings; a pinned one stays where the GM dragged it. */
export interface CachedPoint extends Point {
  pinned?: boolean;
}

const TICKS = 300;
/** Space around a node for its name below it. */
const LABEL_ROOM = 40;
const FRAME_WIDTH = 200;
const FRAME_ROW = 28;

/** The space a node takes, as a circle radius. */
export function nodeRadius(node: GraphNode): number {
  switch (node.kind) {
    case 'faction':
      return 22 + 6 * (Math.min(5, Math.max(1, node.power)) - 1);
    case 'frame':
      return Math.max(FRAME_WIDTH, 48 + FRAME_ROW * node.rows.length) / 2;
    case 'ghost':
      return 20;
  }
}

interface SimNode extends SimulationNodeDatum {
  id: string;
  radius: number;
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  distance: number;
  strength: number;
}

/** Target distance for a pair from the sum of both directions' values (−10 … +10). */
function pairDistance(sum: number): number {
  return Math.min(480, Math.max(80, 240 - 22 * sum));
}

export function layout(
  graph: WorldGraph,
  cached: Readonly<Record<string, CachedPoint>> = {},
): Map<string, Point> {
  const sorted = [...graph.nodes].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const nodes: SimNode[] = sorted.map((node, i) => {
    const point = cached[node.id];
    // Sunflower spiral for nodes without a position: deterministic and evenly spread.
    const angle = i * 2.399963;
    const r = 80 * Math.sqrt(i + 0.5);
    return {
      id: node.id,
      radius: nodeRadius(node),
      x: point?.x ?? r * Math.cos(angle),
      y: point?.y ?? r * Math.sin(angle),
      ...(point?.pinned === true && { fx: point.x, fy: point.y }),
    };
  });
  const known = new Set(nodes.map((n) => n.id));

  const sums = new Map<string, { a: string; b: string; sum: number }>();
  for (const edge of graph.edges) {
    const [a, b] = [edge.sourceNode, edge.target].sort();
    if (a === undefined || b === undefined || a === b || !known.has(a) || !known.has(b)) continue;
    const key = `${a}\u0000${b}`;
    const pair = sums.get(key) ?? { a, b, sum: 0 };
    pair.sum += edge.value;
    sums.set(key, pair);
  }
  const radius = new Map(nodes.map((n) => [n.id, n.radius]));
  // Distances run between the nodes' edges, not their centres, so big nodes do not overlap.
  const links: SimLink[] = [...sums.values()].map(({ a, b, sum }) => ({
    source: a,
    target: b,
    distance: pairDistance(sum) + (radius.get(a) ?? 0) + (radius.get(b) ?? 0),
    strength: 0.25,
  }));
  for (const { child, parent } of graph.ties) {
    if (!known.has(child) || !known.has(parent)) continue;
    const r = (radius.get(child) ?? 0) + (radius.get(parent) ?? 0);
    links.push({ source: child, target: parent, distance: r + 50, strength: 1 });
  }

  const simulation = forceSimulation(nodes)
    .stop()
    .force('charge', forceManyBody<SimNode>().strength(-900))
    .force(
      'collide',
      forceCollide<SimNode>((n) => n.radius + LABEL_ROOM),
    )
    .force(
      'link',
      forceLink<SimNode, SimLink>(links)
        .id((n) => n.id)
        .distance((l) => l.distance)
        .strength((l) => l.strength),
    )
    .force('x', forceX<SimNode>(0).strength(0.04))
    .force('y', forceY<SimNode>(0).strength(0.04));
  // From cached positions, only settle what changed: little energy when every node has a place.
  const placed = sorted.filter((n) => cached[n.id] !== undefined).length;
  simulation.alpha(placed === 0 ? 1 : placed === nodes.length ? 0.1 : 0.4);
  simulation.tick(TICKS);

  return new Map(nodes.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }]));
}
