// Own monsters from the vault: every note with `type: monster` and a stat block, read once and again
// only after its metadata changed. Listeners (the Monster Manual) hear about each change.

import { debounce, parseYaml, type Plugin, type TFile } from 'obsidian';

import { typeOf } from '../campaign/scope';
import type { SrdMonster } from '../monsters/model';
import { ownMonster } from '../monsters/own';
import { findStatblocks, parseStatblock } from '../npc/statblock';

export class OwnMonsters {
  private monsters: SrdMonster[] = [];
  private readonly listeners = new Set<() => void>();
  private readonly schedule = debounce(() => void this.reload(), 250, true);

  constructor(private readonly plugin: Plugin) {
    const { app } = plugin;
    const touched = (file: TFile) =>
      typeOf(app.metadataCache.getFileCache(file)?.frontmatter) === 'monster' ||
      this.monsters.some((m) => m.path === file.path);
    plugin.registerEvent(
      app.metadataCache.on('changed', (file) => {
        if (touched(file)) this.schedule();
      }),
    );
    plugin.registerEvent(
      app.metadataCache.on('deleted', (file) => {
        if (this.monsters.some((m) => m.path === file.path)) this.schedule();
      }),
    );
    plugin.registerEvent(app.vault.on('rename', () => this.schedule()));
  }

  get list(): readonly SrdMonster[] {
    return this.monsters;
  }

  onChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async reload(): Promise<void> {
    const { vault, metadataCache } = this.plugin.app;
    const monsters: SrdMonster[] = [];
    for (const file of vault.getMarkdownFiles()) {
      if (typeOf(metadataCache.getFileCache(file)?.frontmatter) !== 'monster') continue;
      const found = findStatblocks(await vault.cachedRead(file))[0];
      if (found === undefined) continue;
      let data: unknown;
      try {
        data = parseYaml(found.source);
      } catch {
        continue;
      }
      const monster = ownMonster(file.path, parseStatblock(data), found.source);
      if (monster !== null) monsters.push(monster);
    }
    const changed = JSON.stringify(monsters) !== JSON.stringify(this.monsters);
    this.monsters = monsters;
    if (changed) for (const listener of this.listeners) listener();
  }
}
