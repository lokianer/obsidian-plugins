import { describe, expect, it } from 'vitest';

import { resolveKeys } from '../src/factions/keys';
import type { Entity, Relation, Warning } from '../src/factions/model';
import { buildWorld } from '../src/factions/world';

function faction(
  id: string,
  name: string,
  relations: Record<string, number> = {},
  folderName = id.slice(id.lastIndexOf('/') + 1),
): Entity {
  return {
    id,
    kind: 'faction',
    pseudo: false,
    name,
    folderName,
    notePath: `${id}/factions.md`,
    parent: null,
    power: 3,
    relations: new Map(Object.entries(relations).map(([k, v]) => [k, { value: v }])),
    secretRelations: new Map(),
  };
}

function character(id: string, relations: Record<string, number> = {}): Entity {
  return {
    id,
    kind: 'character',
    pseudo: false,
    name: id.slice(id.lastIndexOf('/') + 1).replace(/\.md$/, ''),
    notePath: id,
    parent: null,
    power: 3,
    relations: new Map(Object.entries(relations).map(([k, v]) => [k, { value: v }])),
    secretRelations: new Map(),
  };
}

function resolve(list: Entity[]) {
  const warnings: Warning[] = [];
  const entities = resolveKeys(new Map(list.map((e) => [e.id, e])), (w) => warnings.push(w));
  return { entities, warnings };
}

const targets = (entity: { relations: Map<string, Relation> } | undefined) => [
  ...(entity?.relations.keys() ?? []),
];

describe('resolveKeys', () => {
  it('resolves exact faction and character names to ids', () => {
    const { entities, warnings } = resolve([
      faction('F/Guild', 'Guild', { Watch: -4, Mira: 2 }),
      faction('F/Watch', 'Watch'),
      character('N/Mira.md'),
    ]);
    expect(targets(entities.get('F/Guild'))).toEqual(['F/Watch', 'N/Mira.md']);
    expect(warnings).toEqual([]);
  });

  it('accepts the folder name when the faction has its own name', () => {
    const { entities } = resolve([
      faction('F/Guild', 'Guild', { Watch: -4 }),
      faction('F/Watch', 'The City Watch'),
    ]);
    expect(targets(entities.get('F/Guild'))).toEqual(['F/Watch']);
  });

  it('falls back to case-insensitive matching', () => {
    const { entities, warnings } = resolve([
      faction('F/Guild', 'Guild', { 'the archivists': 1 }),
      faction('F/Archivists', 'The Archivists'),
    ]);
    expect(targets(entities.get('F/Guild'))).toEqual(['F/Archivists']);
    expect(warnings).toEqual([]);
  });

  it('prefers a faction over a character of the same name, with a warning', () => {
    const { entities, warnings } = resolve([
      faction('F/Guild', 'Guild', { Raven: -1 }),
      faction('F/Raven', 'Raven'),
      character('N/Raven.md'),
    ]);
    expect(targets(entities.get('F/Guild'))).toEqual(['F/Raven']);
    expect(warnings).toEqual([
      { path: 'F/Guild/factions.md', code: 'ambiguous-key', key: 'Raven', field: 'relations' },
    ]);
  });

  it('lets the smaller id win between two factions of the same name', () => {
    const { entities, warnings } = resolve([
      faction('F/Guild', 'Guild', { Watch: -4 }),
      faction('F/B/Watch', 'Watch'),
      faction('F/A/Watch', 'Watch'),
    ]);
    expect(targets(entities.get('F/Guild'))).toEqual(['F/A/Watch']);
    expect(warnings).toEqual([
      { path: 'F/B/Watch/factions.md', code: 'duplicate-name', key: 'Watch' },
    ]);
  });

  it('names a clash that differs only in case', () => {
    const { warnings } = resolve([
      faction('F/A', 'The Watch'),
      faction('F/B', 'the watch'),
      character('N/Sable.md'),
      character('P/sable.md'),
    ]);
    expect(warnings).toEqual([
      { path: 'F/B/factions.md', code: 'duplicate-name', key: 'the watch' },
      { path: 'P/sable.md', code: 'duplicate-name', key: 'sable' },
    ]);
  });

  it('names a faction whose folder name another faction has as its name', () => {
    const { entities, warnings } = resolve([
      faction('F/A/Watch', 'The City Watch'),
      faction('F/B/Guild', 'Watch'),
      faction('F/C/Court', 'Court', { Watch: -2 }),
    ]);
    expect(targets(entities.get('F/C/Court'))).toEqual(['F/B/Guild']);
    expect(warnings).toEqual([
      { path: 'F/A/Watch/factions.md', code: 'duplicate-name', key: 'Watch' },
    ]);
  });

  it('takes no offence at a folder named like its own faction in another case', () => {
    const { warnings } = resolve([faction('F/watch', 'Watch'), character('N/Watch.md')]);
    expect(warnings).toEqual([]);
  });

  it('keeps unknown targets as ghosts and drops relations to oneself', () => {
    const { entities, warnings } = resolve([
      faction('F/Choir', 'Choir', { 'The Salt Kings': -2, Choir: 5 }),
    ]);
    expect([...(entities.get('F/Choir')?.relations ?? [])]).toEqual([
      ['?The Salt Kings', { value: -2 }],
    ]);
    expect(warnings).toEqual([
      {
        path: 'F/Choir/factions.md',
        code: 'unknown-target',
        key: 'The Salt Kings',
        field: 'relations',
      },
      { path: 'F/Choir/factions.md', code: 'self-relation', key: 'Choir', field: 'relations' },
    ]);
  });

  it('keeps the first of two keys naming the same target, with a warning', () => {
    const { entities, warnings } = resolve([
      faction('F/Guild', 'Guild', { Watch: -4, 'The City Watch': 2 }),
      faction('F/Watch', 'The City Watch'),
    ]);
    expect([...(entities.get('F/Guild')?.relations ?? [])]).toContainEqual([
      'F/Watch',
      { value: -4 },
    ]);
    expect(warnings).toContainEqual({
      path: 'F/Guild/factions.md',
      code: 'duplicate-key',
      key: 'The City Watch',
      field: 'relations',
    });
  });

  it('never targets a pseudo-faction', () => {
    const party: Entity = { ...faction('@party', 'Party'), pseudo: true, notePath: null };
    const { entities, warnings } = resolve([faction('F/Guild', 'Guild', { Party: 1 }), party]);
    expect(targets(entities.get('F/Guild'))).toEqual(['?Party']);
    expect(warnings.map((w) => w.code)).toEqual(['unknown-target']);
  });
});

describe('buildWorld', () => {
  it('is empty without a campaign', () => {
    expect(buildWorld([])).toEqual({ campaign: null, entities: new Map(), warnings: [] });
  });

  it('names every campaign note it passed over', () => {
    const world = buildWorld([
      { path: 'Templates/Campaign.md', frontmatter: { type: 'campaign' } },
      { path: 'World/Campaign.md', frontmatter: { type: 'campaign' } },
    ]);
    expect(world.campaign?.path).toBe('Templates/Campaign.md');
    expect(world.warnings).toEqual([{ path: 'World/Campaign.md', code: 'campaign-ignored' }]);
  });

  it('reports a warning once even when the same problem is seen twice', () => {
    const world = buildWorld([
      { path: 'C/Campaign.md', frontmatter: { type: 'campaign' } },
      {
        path: 'C/F/Guild/factions.md',
        frontmatter: { type: 'faction', relations: { Ghost: 1 }, secret_relations: { Ghost: 2 } },
      },
    ]);
    expect(world.warnings).toEqual([
      { path: 'C/F/Guild/factions.md', code: 'unknown-target', key: 'Ghost', field: 'relations' },
      {
        path: 'C/F/Guild/factions.md',
        code: 'unknown-target',
        key: 'Ghost',
        field: 'secret_relations',
      },
    ]);
    // Two notes point at a name two factions share: the clash is one problem, reported once.
    const twice = buildWorld([
      { path: 'C/Campaign.md', frontmatter: { type: 'campaign' } },
      { path: 'C/A/Watch/factions.md', frontmatter: { type: 'faction' } },
      { path: 'C/B/Watch/factions.md', frontmatter: { type: 'faction' } },
      { path: 'C/G/Guild/factions.md', frontmatter: { type: 'faction', relations: { Watch: 1 } } },
      { path: 'C/G/Guild/Ilka.md', frontmatter: { type: 'npc', relations: { Watch: 2 } } },
    ]);
    expect(twice.warnings).toEqual([
      { path: 'C/B/Watch/factions.md', code: 'duplicate-name', key: 'Watch' },
    ]);
  });
});
