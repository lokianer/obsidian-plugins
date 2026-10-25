// Own monsters: notes with `type: monster` and a stat block join the Monster Manual, so creatures
// beyond the SRD — from other books, or built in the monster builder — sit beside the SRD's. Pure.

import type { Statblock } from '../npc/statblock';
import { TYPES } from './meta';
import type { Movement, SrdMonster } from './model';

/** An own monster's index: never one of the SRD's. */
export const ownIndex = (path: string): string => `own:${path}`;

const MOVES: readonly Movement[] = ['fly', 'swim', 'burrow', 'climb'];

/** The monster a note's stat block describes, or null when the block names none. */
export function ownMonster(path: string, block: Statblock, yaml: string): SrdMonster | null {
  const name = block.name?.trim() ?? '';
  if (name === '') return null;
  const word = (block.type ?? '').trim().toLowerCase();
  const type = word.startsWith('swarm')
    ? 'swarm'
    : (TYPES.find((t) => word === t || word.startsWith(`${t} `)) ?? word);
  const speed = block.speed ?? '';
  return {
    index: ownIndex(path),
    name,
    cr: block.cr ?? '0',
    type,
    size: block.size ?? 'Medium',
    ac: block.ac ?? 0,
    hp: block.hp ?? 0,
    moves: MOVES.filter((m) => new RegExp(`\\b${m}\\b`, 'i').test(speed)),
    legendary: block.legendaryActions.length > 0,
    spellcaster: block.traits.some((e) => /spellcasting/i.test(e.name)),
    yaml,
    path,
  };
}
