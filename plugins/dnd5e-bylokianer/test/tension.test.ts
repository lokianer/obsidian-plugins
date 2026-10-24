import { describe, expect, it } from 'vitest';

import { DEFAULT_THRESHOLDS, findTensions, type Tension } from '../src/factions/tension';
import { buildWorld } from '../src/factions/world';
import type { NoteInput } from '../src/types';
import { loadExampleVault, withoutSecrets } from './fixture';

const world = buildWorld(loadExampleVault());
const F = 'Silverstadt/Factions';
const name = (id: string) => id.split('/').pop()?.replace(/\.md$/, '');
const summary = (list: Tension[]) =>
  list.map((t) => {
    const refs = Object.values(t).filter((x) => typeof x === 'object') as {
      from: string;
      to: string;
      value: number;
    }[];
    return [t.rule, ...refs.map((r) => `${name(r.from)}→${name(r.to)} ${r.value}`)];
  });

function small(factions: Record<string, Record<string, number>>, members: NoteInput[] = []) {
  const notes: NoteInput[] = [
    { path: 'C/Campaign.md', frontmatter: { type: 'campaign' } },
    ...Object.entries(factions).map(([n, relations]) => ({
      path: `C/${n}/factions.md`,
      frontmatter: { type: 'faction', relations },
    })),
    ...members,
  ];
  return buildWorld(notes);
}

describe('findTensions on the example vault', () => {
  it('finds members out of line in Public, nothing secret', () => {
    const found = findTensions(world, 'public', DEFAULT_THRESHOLDS);
    expect(summary(found)).toEqual([
      ['out-of-line', 'Ondine Vale→The Gutter Court -5', 'The Archivists→The Gutter Court 2'],
      ['out-of-line', 'Mira Voss→The Archivists -5', 'The Gutter Court→The Archivists 1'],
      [
        'out-of-line',
        'Aldric Thane→The Gutter Court 1',
        'Order of the Lantern→The Gutter Court -3',
      ],
      [
        'out-of-line',
        'Corvin Marsh→Order of the Lantern -3',
        'The Archivists→Order of the Lantern 0',
      ],
    ]);
    expect(found.find((t) => t.rule === 'out-of-line')).toMatchObject({
      difference: 7,
      own: { edit: { path: `${F}/The Archivists/Ondine Vale.md`, field: 'relations' } },
    });
    expect(findTensions(withoutSecrets(world), 'public', DEFAULT_THRESHOLDS)).toEqual(found);
  });

  it('adds the true stances and the public-vs-true rule in True mode', () => {
    const found = summary(findTensions(world, 'true', DEFAULT_THRESHOLDS));
    expect(found).toContainEqual([
      'public-true',
      'The Bench→Order of the Lantern -4',
      'The Bench→Order of the Lantern 4',
    ]);
    expect(found).toContainEqual([
      'out-of-line',
      'The Bench→Order of the Lantern 4',
      'The Gutter Court→Order of the Lantern -4',
    ]);
  });
});

describe('findTensions rules', () => {
  it('one-sided: both directions, at the threshold', () => {
    const w = small({ A: { B: 3 }, B: { A: -1 }, D: { A: 3 } });
    expect(summary(findTensions(w, 'public', DEFAULT_THRESHOLDS))).toEqual([
      ['one-sided', 'A→B 3', 'B→A -1'],
    ]);
    expect(findTensions(w, 'public', { ...DEFAULT_THRESHOLDS, oneSided: 5 })).toEqual([]);
  });

  it('split allies: allied both ways, opposite towards a third', () => {
    const w = small({ A: { B: 3, C: 4 }, B: { A: 3, C: -3 }, C: {} });
    expect(summary(findTensions(w, 'public', DEFAULT_THRESHOLDS))).toEqual([
      ['split-allies', 'A→C 4', 'B→C -3'],
    ]);
  });

  it('out of line counts either direction, members of pseudo-factions never', () => {
    const w = small({ A: { B: -2 }, B: {} }, [
      { path: 'C/A/Ilka.md', frontmatter: { type: 'npc', relations: { B: 1 } } },
      { path: 'C/NPCs/Wren.md', frontmatter: { type: 'npc', relations: { B: 5 } } },
    ]);
    expect(summary(findTensions(w, 'public', DEFAULT_THRESHOLDS))).toEqual([
      ['out-of-line', 'Ilka→B 1', 'A→B -2'],
    ]);
  });
});
