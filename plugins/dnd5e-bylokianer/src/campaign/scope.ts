// A note with `type: campaign` switches the plugin on for its own folder and everything below it.
// Ported from Rhizom's packages/core/src/vault/campaign.ts.

import type { NoteInput } from '../types';

/** The campaign of a vault. */
export interface CampaignScope {
  /** Vault path of the campaign note. */
  path: string;
  /** The folder it scopes; empty for the vault root, which scopes everything. */
  folder: string;
  /** The game system as the note names it, or null when it names none. */
  system: string | null;
}

/** The note's `type`, trimmed and in lower case; undefined when it is missing or not a string. */
export function typeOf(frontmatter: Record<string, unknown> | undefined): string | undefined {
  const value = frontmatter?.type;
  return typeof value === 'string' ? value.trim().toLowerCase() : undefined;
}

/**
 * The vault's campaign. One per vault for now: of several campaign notes the one with the
 * smallest path wins — an order that does not depend on how the vault happened to be scanned —
 * and the others are handed back so something can say they were passed over.
 */
export function findCampaign(notes: readonly NoteInput[]): {
  campaign: CampaignScope | null;
  ignored: string[];
} {
  const candidates = notes
    .filter((note) => typeOf(note.frontmatter) === 'campaign')
    .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  const [first, ...rest] = candidates;
  if (first === undefined) {
    return { campaign: null, ignored: [] };
  }
  const slash = first.path.lastIndexOf('/');
  const system = first.frontmatter?.system;
  return {
    campaign: {
      path: first.path,
      folder: slash === -1 ? '' : first.path.slice(0, slash),
      system: typeof system === 'string' && system.trim() !== '' ? system.trim() : null,
    },
    ignored: rest.map((note) => note.path),
  };
}

/** Whether a vault path lies inside the campaign's scope. */
export function inCampaign(campaign: CampaignScope | null, path: string): boolean {
  if (campaign === null) {
    return false;
  }
  // With the separator, so that `Campaign/` does not also claim `Campaigner/`.
  return campaign.folder === '' || path.startsWith(`${campaign.folder}/`);
}
