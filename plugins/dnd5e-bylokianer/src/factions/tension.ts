// The tension panel's four rules (design §5.3): one-sided pairs, members out of line, public faces
// hiding another truth, and allies split over a third. Stances with inheritance in the given mode;
// the public-vs-true rule runs in True mode only. Pure.

import type { EditTarget, FactionWorld, Mode, ResolvedEntity, Stance } from './model';
import { stance } from './stance';

export interface Thresholds {
  oneSided: number;
  outOfLine: number;
  publicTrue: number;
  splitAllies: number;
}

export const DEFAULT_THRESHOLDS: Thresholds = {
  oneSided: 4,
  outOfLine: 3,
  publicTrue: 3,
  splitAllies: 3,
};

/** A value a finding names: who, towards whom, how much, and where to edit it. */
export interface ValueRef {
  from: string;
  to: string;
  value: number;
  edit: EditTarget;
}

export type Tension =
  | { rule: 'one-sided'; there: ValueRef; back: ValueRef; difference: number }
  | { rule: 'out-of-line'; own: ValueRef; line: ValueRef; difference: number }
  | { rule: 'public-true'; public: ValueRef; true: ValueRef; difference: number }
  | { rule: 'split-allies'; first: ValueRef; second: ValueRef; difference: number };

function ref(world: FactionWorld, from: string, to: string, found: Stance): ValueRef {
  const source = world.entities.get(found.source);
  return {
    from,
    to,
    value: found.value,
    edit: { path: source?.notePath ?? '', field: found.field, target: to },
  };
}

function lookup(world: FactionWorld, mode: Mode) {
  return (from: string, to: string): ValueRef | null => {
    const found = stance(world, from, to, mode);
    return found === null ? null : ref(world, from, to, found);
  };
}

export function findTensions(world: FactionWorld, mode: Mode, t: Thresholds): Tension[] {
  const at = lookup(world, mode);
  const entities = [...world.entities.values()].filter((e) => !e.pseudo);
  const factions = entities
    .filter((e) => e.kind === 'faction')
    .sort((a, b) => (a.id < b.id ? -1 : 1));
  const found: Tension[] = [];

  // One-sided: both directions exist and differ by at least the threshold.
  for (const [i, a] of factions.entries()) {
    for (const b of factions.slice(i + 1)) {
      const there = at(a.id, b.id);
      const back = at(b.id, a.id);
      if (there === null || back === null) continue;
      const difference = Math.abs(there.value - back.value);
      if (difference >= t.oneSided) found.push({ rule: 'one-sided', there, back, difference });
    }
  }

  // Out of line: an own value against the stance of the faction above, towards the same target.
  for (const entity of entities) {
    const parent = entity.parent === null ? undefined : world.entities.get(entity.parent);
    if (parent === undefined || parent.pseudo) continue;
    for (const target of ownTargets(entity, mode)) {
      const own = stance(world, entity.id, target, mode);
      const line = at(parent.id, target);
      if (own === null || own.inherited || line === null) continue;
      const difference = Math.abs(own.value - line.value);
      if (difference >= t.outOfLine) {
        found.push({
          rule: 'out-of-line',
          own: ref(world, entity.id, target, own),
          line,
          difference,
        });
      }
    }
  }

  // Public vs true: only in True mode, once at the level that holds the secret value.
  if (mode === 'true') {
    for (const entity of entities) {
      for (const [target, relation] of entity.secretRelations) {
        const publicStance = stance(world, entity.id, target, 'public');
        if (publicStance === null) continue;
        const difference = Math.abs(relation.value - publicStance.value);
        if (difference < t.publicTrue) continue;
        found.push({
          rule: 'public-true',
          public: ref(world, entity.id, target, publicStance),
          true: {
            from: entity.id,
            to: target,
            value: relation.value,
            edit: { path: entity.notePath ?? '', field: 'secret_relations', target },
          },
          difference,
        });
      }
    }
  }

  // Split allies: A and B allied both ways, on opposite sides towards a third faction.
  for (const [i, a] of factions.entries()) {
    for (const b of factions.slice(i + 1)) {
      const ab = at(a.id, b.id);
      const ba = at(b.id, a.id);
      if (ab === null || ba === null || ab.value < t.splitAllies || ba.value < t.splitAllies)
        continue;
      for (const c of factions) {
        if (c.id === a.id || c.id === b.id) continue;
        const first = at(a.id, c.id);
        const second = at(b.id, c.id);
        if (first === null || second === null) continue;
        const split =
          (first.value >= t.splitAllies && second.value <= -t.splitAllies) ||
          (second.value >= t.splitAllies && first.value <= -t.splitAllies);
        if (split) {
          found.push({
            rule: 'split-allies',
            first,
            second,
            difference: Math.abs(first.value - second.value),
          });
        }
      }
    }
  }

  return found.sort((x, y) => y.difference - x.difference);
}

/** The targets an entity's own note names in a mode. */
function ownTargets(entity: ResolvedEntity, mode: Mode): string[] {
  const keys = new Set(entity.relations.keys());
  if (mode === 'true') for (const key of entity.secretRelations.keys()) keys.add(key);
  return [...keys];
}
