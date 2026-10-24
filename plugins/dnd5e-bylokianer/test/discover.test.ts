import { describe, expect, it } from 'vitest';

import type { CampaignScope } from '../src/campaign/scope';
import { discoverEntities, PARTY, UNAFFILIATED } from '../src/factions/discover';
import type { Warning } from '../src/factions/model';
import type { NoteInput } from '../src/types';

const campaign: CampaignScope = { path: 'C/Campaign.md', folder: 'C', system: null };
const note = (path: string, frontmatter?: Record<string, unknown>): NoteInput => ({
  path,
  frontmatter,
});

function discover(notes: NoteInput[]) {
  const warnings: Warning[] = [];
  const entities = discoverEntities(notes, campaign, (w) => warnings.push(w));
  return { entities, warnings };
}

describe('discoverEntities — factions', () => {
  it('takes the name from frontmatter and keeps the folder name beside it', () => {
    const { entities } = discover([
      note('C/F/Guild/factions.md', { type: 'faction', name: 'The Guild', power: 4 }),
      note('C/F/Watch/factions.md', { type: 'faction' }),
    ]);
    expect(entities.get('C/F/Guild')).toMatchObject({
      kind: 'faction',
      pseudo: false,
      name: 'The Guild',
      folderName: 'Guild',
      notePath: 'C/F/Guild/factions.md',
      parent: null,
      power: 4,
    });
    expect(entities.get('C/F/Watch')?.name).toBe('Watch');
  });

  it('accepts a note named like its folder only with type faction', () => {
    const { entities } = discover([
      note('C/F/Guild/Guild.md', { type: 'faction' }),
      note('C/F/Watch/Watch.md', { type: 'place' }),
    ]);
    expect(entities.get('C/F/Guild')?.notePath).toBe('C/F/Guild/Guild.md');
    expect(entities.has('C/F/Watch')).toBe(false);
  });

  it('prefers factions.md over a folder-named faction note and warns', () => {
    const { entities, warnings } = discover([
      note('C/F/Guild/factions.md', { type: 'faction' }),
      note('C/F/Guild/Guild.md', { type: 'faction' }),
    ]);
    expect(entities.get('C/F/Guild')?.notePath).toBe('C/F/Guild/factions.md');
    expect(warnings).toEqual([{ path: 'C/F/Guild/Guild.md', code: 'duplicate-faction-note' }]);
  });

  it('counts factions.md without a type, with a warning', () => {
    const { entities, warnings } = discover([note('C/F/Guild/factions.md', {})]);
    expect(entities.has('C/F/Guild')).toBe(true);
    expect(warnings).toEqual([{ path: 'C/F/Guild/factions.md', code: 'missing-type' }]);
  });

  it('recognises factions.md in any case, the exact spelling first', () => {
    const { entities, warnings } = discover([
      note('C/F/Guild/Factions.md', { type: 'faction' }),
      note('C/F/Watch/FACTIONS.md', { type: 'faction' }),
      note('C/F/Watch/factions.md', { type: 'faction' }),
    ]);
    expect(entities.get('C/F/Guild')?.notePath).toBe('C/F/Guild/Factions.md');
    expect(entities.get('C/F/Watch')?.notePath).toBe('C/F/Watch/factions.md');
    expect(warnings).toEqual([{ path: 'C/F/Watch/FACTIONS.md', code: 'duplicate-faction-note' }]);
  });

  it('does not read a factions.md with another type as a faction', () => {
    const { entities, warnings } = discover([
      note('C/Factions/factions.md', { type: 'overview' }),
      note('C/Factions/Guild/factions.md', { type: 'faction' }),
    ]);
    expect([...entities.keys()]).toEqual(['C/Factions/Guild']);
    expect(entities.get('C/Factions/Guild')?.parent).toBeNull();
    expect(warnings).toEqual([]);
  });

  it('names a note whose frontmatter does not parse, and no more than that', () => {
    const { entities, warnings } = discover([
      { path: 'C/F/Guild/factions.md', frontmatter: undefined, frontmatterBroken: true },
      { path: 'C/F/Guild/Ilka.md', frontmatter: undefined, frontmatterBroken: true },
      { path: 'Templates/NPC.md', frontmatter: undefined, frontmatterBroken: true },
    ]);
    expect(entities.get('C/F/Guild')?.name).toBe('Guild');
    expect(entities.has('C/F/Guild/Ilka.md')).toBe(false);
    expect(warnings).toEqual([
      { path: 'C/F/Guild/Ilka.md', code: 'broken-frontmatter' },
      { path: 'C/F/Guild/factions.md', code: 'broken-frontmatter' },
    ]);
  });

  it('nests a sub-faction under the nearest faction above it', () => {
    const { entities } = discover([
      note('C/F/Court/factions.md', { type: 'faction' }),
      note('C/F/Court/Inner/Bench/factions.md', { type: 'faction' }),
    ]);
    expect(entities.get('C/F/Court/Inner/Bench')?.parent).toBe('C/F/Court');
  });

  it('reads relations and secret relations with raw keys', () => {
    const { entities } = discover([
      note('C/F/Guild/factions.md', {
        type: 'faction',
        relations: { Watch: -4 },
        secret_relations: { Watch: 2 },
      }),
    ]);
    const guild = entities.get('C/F/Guild');
    expect([...(guild?.relations ?? [])]).toEqual([['Watch', { value: -4 }]]);
    expect([...(guild?.secretRelations ?? [])]).toEqual([['Watch', { value: 2 }]]);
  });
});

describe('discoverEntities — characters', () => {
  it('puts a member in a plain subfolder into the faction above', () => {
    const { entities } = discover([
      note('C/F/Order/factions.md', { type: 'faction' }),
      note('C/F/Order/Ilka.md', { type: 'npc' }),
      note('C/F/Order/Retired/Old Bram.md', { type: 'npc' }),
    ]);
    expect(entities.get('C/F/Order/Ilka.md')).toMatchObject({
      kind: 'character',
      name: 'Ilka',
      parent: 'C/F/Order',
    });
    expect(entities.get('C/F/Order/Retired/Old Bram.md')?.parent).toBe('C/F/Order');
  });

  it('sends characters outside every faction to Party or Unaffiliated', () => {
    const { entities } = discover([
      note('C/Party/Tessa.md', { type: 'character' }),
      note('C/NPCs/Wren.md', { type: ' NPC ' }),
    ]);
    expect(entities.get('C/Party/Tessa.md')?.parent).toBe(PARTY);
    expect(entities.get('C/NPCs/Wren.md')?.parent).toBe(UNAFFILIATED);
    expect(entities.get(PARTY)).toMatchObject({ kind: 'faction', pseudo: true, notePath: null });
    expect(entities.get(UNAFFILIATED)?.pseudo).toBe(true);
  });

  it('creates no pseudo-faction without members', () => {
    const { entities } = discover([note('C/F/Order/factions.md', { type: 'faction' })]);
    expect(entities.has(PARTY)).toBe(false);
    expect(entities.has(UNAFFILIATED)).toBe(false);
  });

  it('ignores notes outside the campaign and notes without frontmatter', () => {
    const { entities, warnings } = discover([
      note('Templates/NPC.md', { type: 'npc' }),
      note('C/NPCs/Broken.md', undefined),
      note('C/Places/Bridge.md', { type: 'place' }),
    ]);
    expect(entities.size).toBe(0);
    expect(warnings).toEqual([]);
  });
});
