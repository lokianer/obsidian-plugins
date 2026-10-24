import { describe, expect, it } from 'vitest';

import { buildWorld } from '../src/factions/world';
import { rankTargets, targetsFor } from '../src/factions/targets';
import { loadExampleVault } from './fixture';

const world = buildWorld(loadExampleVault());
const COURT = 'Silverstadt/Factions/The Gutter Court';

describe('targetsFor', () => {
  it('offers factions and characters, never the note itself or a pseudo-faction', () => {
    const targets = targetsFor(world, COURT);
    expect(targets.some((t) => t.id === COURT)).toBe(false);
    expect(targets.some((t) => t.id.startsWith('@'))).toBe(false);
    expect(targets.find((t) => t.key === 'Sable')).toEqual({
      id: `${COURT}/Sable.md`,
      kind: 'character',
      key: 'Sable',
      detail: 'The Gutter Court',
    });
    expect(targets.find((t) => t.key === 'Orrin Quill')?.detail).toBe('Party');
  });
});

describe('rankTargets', () => {
  const list = targetsFor(world, COURT);
  it('ranks exact, then prefix, then word prefix, then substring', () => {
    expect(rankTargets(list, 'the a').map((t) => t.key)[0]).toBe('The Archivists');
    expect(rankTargets(list, 'lantern').map((t) => t.key)).toEqual(['Order of the Lantern']);
    expect(rankTargets(list, 'ORRIN')[0]?.key).toBe('Orrin Quill');
    expect(rankTargets(list, 'zzz')).toEqual([]);
  });
});
