// What the faction view shows for one faction (or the Party / Unaffiliated) in a mode: its members
// with a ring where they deviate, the factions and characters its arrows reach, and every arrow —
// the faction's own values and each member's stances, own or inherited. Pure.

import type { FactionWorld, Mode } from './model';
import { allStances, stance } from './stance';

export interface ViewMember {
  id: string;
  name: string;
  kind: 'character' | 'faction';
  notePath: string | null;
  /** States an own value that differs from the faction's stance towards the same target. */
  ring: boolean;
}

/** Something outside the frame an arrow reaches: a faction, a group of loose characters, a ghost. */
export interface ViewBox {
  id: string;
  name: string;
  kind: 'faction' | 'group' | 'ghost';
  notePath: string | null;
  /** Characters of this box that arrows reach (shown as small nodes beside it). */
  characters: { id: string; name: string; notePath: string | null }[];
}

export interface ViewArrow {
  id: string;
  /** The frame (the faction's id) or a member. */
  from: string;
  /** A box, a character beside a box, a member, or the frame. */
  to: string;
  value: number;
  why?: string;
  inherited: boolean;
  /** Name of the entity whose note holds the value. */
  sourceName: string;
  differs: boolean;
}

export interface FactionView {
  id: string;
  name: string;
  /** Null for the Party and Unaffiliated. */
  power: number | null;
  /** Enclosing factions, outermost first, for the breadcrumb. */
  parents: { id: string; name: string }[];
  members: ViewMember[];
  boxes: ViewBox[];
  arrows: ViewArrow[];
}

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);

export function buildFactionView(world: FactionWorld, id: string, mode: Mode): FactionView | null {
  const faction = world.entities.get(id);
  if (faction === undefined || faction.kind !== 'faction') return null;

  const parents: { id: string; name: string }[] = [];
  for (let p = faction.parent; p !== null;) {
    const parent = world.entities.get(p);
    if (parent === undefined || parent.pseudo || parents.some((x) => x.id === p)) break;
    parents.unshift({ id: parent.id, name: parent.name });
    p = parent.parent;
  }

  const memberEntities = [...world.entities.values()].filter((e) => e.parent === id && !e.pseudo);
  const memberIds = new Set(memberEntities.map((m) => m.id));
  const inside = (target: string) => target === id || memberIds.has(target);

  const arrows: ViewArrow[] = [];
  const add = (from: string, to: string, found: NonNullable<ReturnType<typeof stance>>) => {
    const source = world.entities.get(found.source);
    const publicValue = mode === 'true' ? stance(world, from, to, 'public')?.value : null;
    arrows.push({
      id: `${from}→${to}`,
      from,
      to,
      value: found.value,
      ...(found.why !== undefined && { why: found.why }),
      inherited: found.inherited,
      sourceName: source?.name ?? '',
      differs: mode === 'true' && publicValue !== found.value,
    });
  };
  if (!faction.pseudo) {
    for (const [to, found] of allStances(world, id, mode)) {
      if (!found.inherited) add(id, to, found);
    }
  }
  const members: ViewMember[] = memberEntities
    .map((m) => {
      let ring = false;
      for (const [to, found] of allStances(world, m.id, mode)) {
        add(m.id, to, found);
        if (found.inherited || faction.pseudo) continue;
        const line = stance(world, id, to, mode);
        if (line !== null && line.value !== found.value) ring = true;
      }
      return {
        id: m.id,
        name: m.name,
        kind: m.kind,
        notePath: m.notePath,
        ring,
      };
    })
    .sort((a, b) => (a.kind === b.kind ? byName(a, b) : a.kind === 'character' ? -1 : 1));

  // Boxes for whatever the arrows reach outside the frame.
  const boxes = new Map<string, ViewBox>();
  const box = (boxId: string): ViewBox | undefined => {
    const existing = boxes.get(boxId);
    if (existing !== undefined) return existing;
    const entity = world.entities.get(boxId);
    if (boxId.startsWith('?')) {
      const ghost: ViewBox = {
        id: boxId,
        name: boxId.slice(1),
        kind: 'ghost',
        notePath: null,
        characters: [],
      };
      boxes.set(boxId, ghost);
      return ghost;
    }
    if (entity === undefined || entity.kind !== 'faction') return undefined;
    const created: ViewBox = {
      id: boxId,
      name: entity.name,
      kind: entity.pseudo ? 'group' : 'faction',
      notePath: entity.notePath,
      characters: [],
    };
    boxes.set(boxId, created);
    return created;
  };
  for (const arrow of arrows) {
    if (inside(arrow.to)) continue;
    const target = world.entities.get(arrow.to);
    if (target?.kind === 'character') {
      const home = target.parent === null || inside(target.parent) ? undefined : box(target.parent);
      if (home !== undefined && !home.characters.some((c) => c.id === target.id)) {
        home.characters.push({ id: target.id, name: target.name, notePath: target.notePath });
      }
    } else {
      box(arrow.to);
    }
  }

  return {
    id,
    name: faction.name,
    power: faction.pseudo ? null : faction.power,
    parents,
    members,
    boxes: [...boxes.values()].sort(byName),
    arrows,
  };
}
