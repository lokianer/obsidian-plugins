// The `AC · HP · CR` line of a character note's first stat block (ours or Fantasy Statblocks'),
// for the faction card and the faction view. The metadata cache has no block contents, so the note
// is read once and the line cached until the note changes; listeners hear when a line arrives.

import { parseYaml, type Plugin, TFile } from 'obsidian';

import { findStatblocks, parseStatblock, summary } from '../npc/statblock';

export class StatSummaries {
  private readonly lines = new Map<string, string | null>();
  private readonly reading = new Set<string>();
  private readonly listeners = new Set<() => void>();

  constructor(private readonly plugin: Plugin) {
    const { metadataCache, vault } = plugin.app;
    plugin.registerEvent(
      metadataCache.on('changed', (file) => {
        if (this.lines.delete(file.path)) void this.read(file.path);
      }),
    );
    plugin.registerEvent(vault.on('delete', (file) => this.lines.delete(file.path)));
    plugin.registerEvent(vault.on('rename', (_file, old) => this.lines.delete(old)));
  }

  /** The note's line, or null — also while it is being read; listeners hear when it arrives. */
  get(path: string): string | null {
    const line = this.lines.get(path);
    if (line !== undefined) return line;
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
      let line: string | null = null;
      if (block !== undefined) {
        try {
          line = summary(parseStatblock(parseYaml(block.source))) || null;
        } catch {
          line = null;
        }
      }
      const changed = this.lines.get(path) !== line;
      this.lines.set(path, line);
      if (changed && line !== null) for (const listener of this.listeners) listener();
    } finally {
      this.reading.delete(path);
    }
  }
}
