// A character note's first stat block (ours or Fantasy Statblocks'), parsed, for the faction card's
// short stats and the faction view's tooltips. The metadata cache has no block contents, so the
// note is read once and the block cached until the note changes; listeners hear when one arrives.

import { parseYaml, type Plugin, TFile } from 'obsidian';

import { findStatblocks, parseStatblock, type Statblock } from '../npc/statblock';

export class NoteStatblocks {
  private readonly blocks = new Map<string, Statblock | null>();
  private readonly reading = new Set<string>();
  private readonly listeners = new Set<() => void>();

  constructor(private readonly plugin: Plugin) {
    const { metadataCache, vault } = plugin.app;
    plugin.registerEvent(
      metadataCache.on('changed', (file) => {
        if (this.blocks.delete(file.path)) void this.read(file.path);
      }),
    );
    plugin.registerEvent(vault.on('delete', (file) => this.blocks.delete(file.path)));
    plugin.registerEvent(vault.on('rename', (_file, old) => this.blocks.delete(old)));
  }

  /** The note's stat block, or null — also while it is read; listeners hear when it arrives. */
  get(path: string): Statblock | null {
    const known = this.blocks.get(path);
    if (known !== undefined) return known;
    void this.read(path);
    return null;
  }

  onChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private async read(path: string): Promise<void> {
    if (this.reading.has(path)) return;
    const file = this.plugin.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) return;
    this.reading.add(path);
    try {
      const block = findStatblocks(await this.plugin.app.vault.cachedRead(file))[0];
      let parsed: Statblock | null = null;
      if (block !== undefined) {
        try {
          parsed = parseStatblock(parseYaml(block.source));
        } catch {
          parsed = null;
        }
      }
      const changed = JSON.stringify(this.blocks.get(path) ?? null) !== JSON.stringify(parsed);
      this.blocks.set(path, parsed);
      if (changed) for (const listener of this.listeners) listener();
    } finally {
      this.reading.delete(path);
    }
  }
}
