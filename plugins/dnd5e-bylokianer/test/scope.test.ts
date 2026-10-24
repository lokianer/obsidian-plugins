import { describe, expect, it } from 'vitest';

import { findCampaign, inCampaign, typeOf } from '../src/campaign/scope';
import type { NoteInput } from '../src/types';
import { loadExampleVault } from './fixture';

const note = (path: string, frontmatter: Record<string, unknown> | undefined): NoteInput => ({
  path,
  frontmatter,
});

describe('findCampaign', () => {
  it('finds the campaign note and its folder and system', () => {
    const found = findCampaign([
      note('Home.md', {}),
      note('Campaign/Campaign.md', { type: ' Campaign ', system: 'D&D 5e (2014 rules)' }),
    ]);
    expect(found).toEqual({
      campaign: { path: 'Campaign/Campaign.md', folder: 'Campaign', system: 'D&D 5e (2014 rules)' },
      ignored: [],
    });
  });

  it('scopes the whole vault from the root and has no system when none is written', () => {
    expect(findCampaign([note('World.md', { type: 'campaign', system: 5 })]).campaign).toEqual({
      path: 'World.md',
      folder: '',
      system: null,
    });
  });

  it('takes the smallest path of several and reports the rest', () => {
    const found = findCampaign([
      note('B/Campaign.md', { type: 'campaign' }),
      note('A/Campaign.md', { type: 'campaign' }),
    ]);
    expect(found.campaign?.path).toBe('A/Campaign.md');
    expect(found.ignored).toEqual(['B/Campaign.md']);
  });

  it('has no campaign without a campaign note, and skips notes without frontmatter', () => {
    expect(findCampaign([note('Home.md', { type: 'npc' }), note('Broken.md', undefined)])).toEqual({
      campaign: null,
      ignored: [],
    });
  });

  it('finds Silverstadt in the example vault', () => {
    expect(findCampaign(loadExampleVault()).campaign).toEqual({
      path: 'Silverstadt/Campaign.md',
      folder: 'Silverstadt',
      system: 'D&D 5e (2014 rules)',
    });
  });
});

describe('the campaign scope', () => {
  const campaign = { path: 'Campaign/Campaign.md', folder: 'Campaign', system: null };

  it('holds its folder and everything below, and nothing beside it', () => {
    expect(inCampaign(campaign, 'Campaign/NPCs/Mira.md')).toBe(true);
    expect(inCampaign(campaign, 'Campaign/Campaign.md')).toBe(true);
    expect(inCampaign(campaign, 'Campaigner/Notes.md')).toBe(false);
    expect(inCampaign(campaign, 'Home.md')).toBe(false);
    expect(inCampaign(null, 'Campaign/NPCs/Mira.md')).toBe(false);
    expect(inCampaign({ ...campaign, folder: '' }, 'Anywhere/At/All.md')).toBe(true);
  });
});

describe('typeOf', () => {
  it('reads the type trimmed and in lower case, and nothing else', () => {
    expect(typeOf({ type: ' NPC ' })).toBe('npc');
    expect(typeOf({ type: 5 })).toBeUndefined();
    expect(typeOf({})).toBeUndefined();
    expect(typeOf(undefined)).toBeUndefined();
  });
});
