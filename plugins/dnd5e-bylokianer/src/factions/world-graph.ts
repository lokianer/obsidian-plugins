// What the world view's graph shows for one mode: factions, the Party and Unaffiliated as frames
// with their characters, ghosts for dangling targets, sub-faction ties, and an arrow for every
// value a source's own note states towards a faction. Pure.

import { PARTY, UNAFFILIATED } from './discover';
import type { FactionWorld, Mode, RelationField, ResolvedEntity } from './model';
import { stance } from './stance';

/** Where an edit of a shown value goes: the note, the field, and the target as the card knows it. */
export interface EditTarget {
  path: string;
  field: RelationField;
  /** The target's entity id, or `?` + the name for a dangling target. */
  target: string;
}

export type GraphNode =
  | { kind: 'faction'; id: string; name: string; power: number; notePath: string | null }
  | {
      kind: 'frame';
      id: string;
      name: string;
      rows: { id: string; name: string; notePath: string | null }[];
    }
  | { kind: 'ghost'; id: string; name: string };

export interface GraphEdge {
  /** Stable key: source and target. */
  id: string;
  /** The entity that holds the value: a faction, or a character in a frame. */
  source: string;
  /** The node the arrow starts at: the faction itself, or the character's frame. */
  sourceNode: string;
  target: string;
  value: number;
  why?: string;
  /** True mode only: the true stance differs from the public one (or there is none). */
  differs: boolean;
  edit: EditTarget;
}

export interface WorldGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Sub-faction → parent faction. */
  ties: { child: string; parent: string }[];
}

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);

/** The own values of an entity in a mode, towards factions and dangling targets only. */
function ownEdges(world: FactionWorld, entity: ResolvedEntity, sourceNode: string, mode: Mode) {
  const keys = new Set(entity.relations.keys());
  if (mode === 'true') {
    for (const key of entity.secretRelations.keys()) keys.add(key);
  }
  const edges: GraphEdge[] = [];
  for (const target of keys) {
    const targetEntity = world.entities.get(target);
    const dangling = target.startsWith('?');
    if (!dangling && (targetEntity === undefined || targetEntity.kind !== 'faction')) {
      continue;
    }
    const found = stance(world, entity.id, target, mode);
    if (found === null || found.inherited || entity.notePath === null) {
      continue;
    }
    const publicValue = mode === 'true' ? stance(world, entity.id, target, 'public')?.value : null;
    edges.push({
      id: `${entity.id}→${target}`,
      source: entity.id,
      sourceNode,
      target,
      value: found.value,
      ...(found.why !== undefined && { why: found.why }),
      differs: mode === 'true' && publicValue !== found.value,
      edit: { path: entity.notePath, field: found.field, target },
    });
  }
  return edges;
}

export function buildGraph(world: FactionWorld, mode: Mode): WorldGraph {
  const entities = [...world.entities.values()];
  const factions = entities.filter((e) => e.kind === 'faction' && !e.pseudo).sort(byName);
  const nodes: GraphNode[] = factions.map((f) => ({
    kind: 'faction',
    id: f.id,
    name: f.name,
    power: f.power,
    notePath: f.notePath,
  }));
  const edges = factions.flatMap((f) => ownEdges(world, f, f.id, mode));

  for (const frameId of [PARTY, UNAFFILIATED]) {
    const frame = world.entities.get(frameId);
    const members = entities.filter((e) => e.kind === 'character' && e.parent === frameId);
    if (frame === undefined || members.length === 0) continue;
    members.sort(byName);
    nodes.push({
      kind: 'frame',
      id: frameId,
      name: frame.name,
      rows: members.map((m) => ({ id: m.id, name: m.name, notePath: m.notePath })),
    });
    edges.push(...members.flatMap((m) => ownEdges(world, m, frameId, mode)));
  }

  const ghosts = [...new Set(edges.map((e) => e.target).filter((t) => t.startsWith('?')))].sort();
  nodes.push(...ghosts.map((id): GraphNode => ({ kind: 'ghost', id, name: id.slice(1) })));

  const ties = factions
    .filter((f) => f.parent !== null && world.entities.get(f.parent)?.pseudo === false)
    .map((f) => ({ child: f.id, parent: f.parent ?? '' }));
  return { nodes, edges, ties };
}
