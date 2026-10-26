// The rollable tables of the campaign for the Dice tab — every `type: table` note with its rollable
// headings — and the table a `dice: [[Note#Heading]]` link names.

import { type Plugin, TFile } from 'obsidian';

import { inCampaign, typeOf } from '../campaign/scope';
import { findTable, type RollTable, rollableTables } from '../dice/tables';
import type { WorldCache } from './world-cache';

export interface TableNote {
  title: string;
  tables: RollTable[];
}

export interface TableSource {
  notes(): Promise<TableNote[]>;
  /** The table a link names (`Street Rumours#Night on Lantern Quay (d20)`), from a note's path. */
  resolve(link: string, from: string): Promise<RollTable | null>;
}

export class DiceTables implements TableSource {
  constructor(
    private readonly plugin: Plugin,
    private readonly cache: WorldCache,
  ) {}

  async notes(): Promise<TableNote[]> {
    const { vault, metadataCache } = this.plugin.app;
    const { campaign } = await this.cache.get();
    const files = vault
      .getMarkdownFiles()
      .filter((f) => campaign === null || inCampaign(campaign, f.path))
      .filter((f) => typeOf(metadataCache.getFileCache(f)?.frontmatter) === 'table');
    const notes: TableNote[] = [];
    for (const file of files) {
      const tables = rollableTables(await vault.cachedRead(file));
      if (tables.length > 0) notes.push({ title: file.basename, tables });
    }
    return notes.sort((a, b) => a.title.localeCompare(b.title));
  }

  async resolve(link: string, from: string): Promise<RollTable | null> {
    const [path = '', heading = null] = link.split('#', 2);
    const file = this.plugin.app.metadataCache.getFirstLinkpathDest(path.trim(), from);
    if (!(file instanceof TFile)) return null;
    return findTable(rollableTables(await this.plugin.app.vault.cachedRead(file)), heading);
  }
}
