// The names a relation key can be given, for the card's target suggestions. Pure.

import type { FactionWorld } from './model';

export interface Target {
  id: string;
  kind: 'faction' | 'character';
  /** The name to write as the key. */
  key: string;
  /** Where the target lives, to tell two of one name apart: its folder, or its faction's name. */
  detail: string;
}

function folderOf(path: string): string {
  const slash = path.lastIndexOf('/');
  return slash === -1 ? '' : path.slice(0, slash);
}

/** Every faction (by name, and by folder name where that differs) and character but `selfId`. */
export function targetsFor(world: FactionWorld, selfId: string): Target[] {
  const targets: Target[] = [];
  for (const entity of world.entities.values()) {
    if (entity.pseudo || entity.id === selfId) {
      continue;
    }
    if (entity.kind === 'faction') {
      const detail = folderOf(entity.id);
      targets.push({ id: entity.id, kind: 'faction', key: entity.name, detail });
      const folder = entity.folderName;
      if (folder !== undefined && folder.toLowerCase() !== entity.name.toLowerCase()) {
        targets.push({ id: entity.id, kind: 'faction', key: folder, detail });
      }
    } else {
      const parent = entity.parent === null ? undefined : world.entities.get(entity.parent);
      const detail = parent?.name ?? folderOf(entity.id);
      targets.push({ id: entity.id, kind: 'character', key: entity.name, detail });
    }
  }
  return targets.sort((a, b) => a.key.localeCompare(b.key) || a.id.localeCompare(b.id));
}

/** How well a key fits a query: exact, prefix, word prefix, substring; null when it does not. */
function score(key: string, query: string): number | null {
  const k = key.toLowerCase();
  if (k === query) return 0;
  if (k.startsWith(query)) return 1;
  if (k.split(/\s+/).some((word) => word.startsWith(query))) return 2;
  return k.includes(query) ? 3 : null;
}

export function rankTargets(targets: readonly Target[], query: string, limit = 20): Target[] {
  const q = query.trim().toLowerCase();
  if (q === '') {
    return targets.slice(0, limit);
  }
  return targets
    .map((target) => ({ target, score: score(target.key, q) }))
    .filter((x): x is { target: Target; score: number } => x.score !== null)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((x) => x.target);
}
