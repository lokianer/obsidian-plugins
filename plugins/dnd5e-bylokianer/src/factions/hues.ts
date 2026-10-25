// A colour and initials per faction for the faction world: each top-level faction gets a colour of
// Obsidian's palette in name order, its sub-factions and members share it. Red, green and yellow
// stay with the relation values, so a faction never looks like a stance. Pure.

import type { FactionWorld } from './model';

export type Hue = 'purple' | 'cyan' | 'blue' | 'pink' | 'orange';

const PALETTE: readonly Hue[] = ['purple', 'cyan', 'blue', 'pink', 'orange'];

/** The hue of every real faction and of every entity in one; Party, Unaffiliated and ghosts have none. */
export function factionHues(world: FactionWorld): Map<string, Hue> {
  const top = (id: string): string | null => {
    let entity = world.entities.get(id);
    let last: string | null = null;
    while (entity !== undefined) {
      if (entity.kind === 'faction') {
        if (entity.pseudo) return null;
        last = entity.id;
      }
      entity = entity.parent === null ? undefined : world.entities.get(entity.parent);
    }
    return last;
  };
  const roots = [...world.entities.values()]
    .filter((e) => e.kind === 'faction' && !e.pseudo && top(e.id) === e.id)
    .sort((a, b) => a.name.localeCompare(b.name));
  const rootHue = new Map(roots.map((e, i) => [e.id, PALETTE[i % PALETTE.length] as Hue]));
  const hues = new Map<string, Hue>();
  for (const id of world.entities.keys()) {
    const root = top(id);
    const hue = root === null ? undefined : rootHue.get(root);
    if (hue !== undefined) hues.set(id, hue);
  }
  return hues;
}

const SMALL = new Set(['the', 'of', 'and', 'a', 'an', 'der', 'die', 'das', 'des', 'von', 'und']);

/** Up to two initials: `The Gutter Court` → `GC`, `Order of the Lantern` → `OL`, `Sable` → `SA`. */
export function initials(name: string): string {
  const words = name.split(/[\s-]+/).filter((w) => /\p{L}/u.test(w));
  const big = words.filter((w) => !SMALL.has(w.toLowerCase()));
  const use = big.length > 0 ? big : words;
  if (use.length === 1) return (use[0] ?? '').slice(0, 2).toUpperCase();
  return use
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
}
