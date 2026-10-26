// The party's saves and skills for the Dice tab and the Battle tab's character cards: each
// character of the campaign's party, from the note's `saves:` and `skills:`, else its stat block.

import { parseYaml, type Plugin } from 'obsidian';

import { characterBonuses, type Check, checks } from '../dice/checks';
import { PARTY } from '../factions/discover';
import type { Lang } from '../npc/races';
import { findStatblocks, parseStatblock, type Statblock } from '../npc/statblock';
import type { WorldCache } from './world-cache';

export interface PartyMemberChecks {
  name: string;
  checks: Check[];
}

export interface PartySource {
  party(): Promise<PartyMemberChecks[]>;
  /** A character note's checks, by its path. */
  checks(path: string): Promise<Check[]>;
}

export class PartyChecks implements PartySource {
  constructor(
    private readonly plugin: Plugin,
    private readonly cache: WorldCache,
    private readonly lang: () => Lang,
  ) {}

  async party(): Promise<PartyMemberChecks[]> {
    const world = await this.cache.get();
    const members: PartyMemberChecks[] = [];
    for (const e of world.entities.values()) {
      if (e.kind !== 'character' || e.parent !== PARTY || e.notePath === null) continue;
      const file = this.plugin.app.vault.getFileByPath(e.notePath);
      if (file === null) continue;
      members.push({ name: file.basename, checks: await this.checks(file.path) });
    }
    return members.sort((a, b) => a.name.localeCompare(b.name));
  }

  async checks(path: string): Promise<Check[]> {
    const { vault, metadataCache } = this.plugin.app;
    const file = vault.getFileByPath(path);
    if (file === null) return [];
    const fm = metadataCache.getFileCache(file)?.frontmatter;
    let block: Statblock | null = null;
    if (fm?.saves === undefined || fm.skills === undefined) {
      const found = findStatblocks(await vault.cachedRead(file))[0];
      try {
        block = found === undefined ? null : parseStatblock(parseYaml(found.source));
      } catch {
        block = null;
      }
    }
    return checks(file.basename, characterBonuses(fm, block), this.lang());
  }
}
