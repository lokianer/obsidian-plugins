// What the world view's matrix shows for one mode: rows (who) and columns (towards whom), each cell
// the stance with inheritance, and where a click edits it. Pure.

import { PARTY, UNAFFILIATED } from './discover';
import type { FactionWorld, Mode, ResolvedEntity } from './model';
import { allStances, stance } from './stance';

export type MatrixRow =
  | { kind: 'group'; id: string; name: string }
  | { kind: 'entity'; id: string; name: string; depth: number; notePath: string | null };

export interface MatrixColumn {
  id: string;
  name: string;
  depth: number;
  ghost: boolean;
}

export type MatrixCell =
  | {
      kind: 'value';
      value: number;
      why?: string;
      /** Name of the faction the value is inherited from, or null for an own value. */
      inheritedFrom: string | null;
      differs: boolean;
    }
  | { kind: 'empty' }
  | { kind: 'none' };

export interface WorldMatrix {
  rows: MatrixRow[];
  columns: MatrixColumn[];
  /** cells[row index][column index]; group rows hold `none` cells. */
  cells: MatrixCell[][];
}

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);

/** Real factions, each followed by its sub-factions, with their depth. */
function factionTree(world: FactionWorld): { entity: ResolvedEntity; depth: number }[] {
  const factions = [...world.entities.values()].filter((e) => e.kind === 'faction' && !e.pseudo);
  const ids = new Set(factions.map((f) => f.id));
  const out: { entity: ResolvedEntity; depth: number }[] = [];
  const parentOf = (f: ResolvedEntity) =>
    f.parent !== null && ids.has(f.parent) ? f.parent : null;
  const visit = (parent: string | null, depth: number) => {
    for (const f of factions.filter((x) => parentOf(x) === parent).sort(byName)) {
      out.push({ entity: f, depth });
      visit(f.id, depth + 1);
    }
  };
  visit(null, 0);
  return out;
}

export function buildMatrix(world: FactionWorld, mode: Mode): WorldMatrix {
  const tree = factionTree(world);
  const rows: MatrixRow[] = tree.map(({ entity, depth }) => ({
    kind: 'entity',
    id: entity.id,
    name: entity.name,
    depth,
    notePath: entity.notePath,
  }));
  const factionIds = new Set(tree.map(({ entity }) => entity.id));
  // Characters only with a stance towards some faction or ghost; the rest would be empty rows.
  const relatesToFactions = (id: string) =>
    [...allStances(world, id, mode).keys()].some((k) => factionIds.has(k) || k.startsWith('?'));
  for (const groupId of [PARTY, UNAFFILIATED]) {
    const group = world.entities.get(groupId);
    const members = [...world.entities.values()]
      .filter((e) => e.kind === 'character' && e.parent === groupId && relatesToFactions(e.id))
      .sort(byName);
    if (group === undefined || members.length === 0) continue;
    rows.push({ kind: 'group', id: groupId, name: group.name });
    rows.push(
      ...members.map((m): MatrixRow => ({
        kind: 'entity',
        id: m.id,
        name: m.name,
        depth: 1,
        notePath: m.notePath,
      })),
    );
  }

  const stances = new Map(
    rows.filter((r) => r.kind === 'entity').map((r) => [r.id, allStances(world, r.id, mode)]),
  );
  const ghosts = new Set<string>();
  for (const map of stances.values()) {
    for (const target of map.keys()) if (target.startsWith('?')) ghosts.add(target);
  }
  const columns: MatrixColumn[] = [
    ...tree.map(({ entity, depth }) => ({ id: entity.id, name: entity.name, depth, ghost: false })),
    ...[...ghosts].sort().map((id) => ({ id, name: id.slice(1), depth: 0, ghost: true })),
  ];

  const cells = rows.map((row): MatrixCell[] =>
    columns.map((column): MatrixCell => {
      if (row.kind === 'group' || row.id === column.id) return { kind: 'none' };
      const found = stances.get(row.id)?.get(column.id);
      if (found === undefined) {
        return row.notePath === null ? { kind: 'none' } : { kind: 'empty' };
      }
      const source = world.entities.get(found.source);
      const publicValue =
        mode === 'true' ? stance(world, row.id, column.id, 'public')?.value : null;
      return {
        kind: 'value',
        value: found.value,
        ...(found.why !== undefined && { why: found.why }),
        inheritedFrom: found.inherited ? (source?.name ?? null) : null,
        differs: mode === 'true' && publicValue !== found.value,
      };
    }),
  );
  return { rows, columns, cells };
}
