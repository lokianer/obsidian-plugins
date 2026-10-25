// Own spells from the vault: every note with `type: spell`, read once and again only after its
// metadata changed. Listeners (the spellbook) hear about each change.

import { debounce, type Plugin, type TFile } from 'obsidian';

import { typeOf } from '../campaign/scope';
import type { SrdSpell } from '../spells/model';
import { parseOwnSpell } from '../spells/own';

export class OwnSpells {
  private spells: SrdSpell[] = [];
  private readonly listeners = new Set<() => void>();
  private readonly schedule = debounce(() => void this.reload(), 250, true);

  constructor(private readonly plugin: Plugin) {
    const { app } = plugin;
    const touched = (file: TFile) =>
      typeOf(app.metadataCache.getFileCache(file)?.frontmatter) === 'spell' ||
      this.spells.some((s) => s.path === file.path);
    plugin.registerEvent(
      app.metadataCache.on('changed', (file) => {
        if (touched(file)) this.schedule();
      }),
    );
    plugin.registerEvent(
      app.metadataCache.on('deleted', (file) => {
        if (this.spells.some((s) => s.path === file.path)) this.schedule();
      }),
    );
    plugin.registerEvent(app.vault.on('rename', () => this.schedule()));
    plugin.registerEvent(app.metadataCache.on('resolved', () => this.schedule()));
  }

  get list(): readonly SrdSpell[] {
    return this.spells;
  }

  onChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async reload(): Promise<void> {
    const { vault, metadataCache } = this.plugin.app;
    const spells: SrdSpell[] = [];
    for (const file of vault.getMarkdownFiles()) {
      const cache = metadataCache.getFileCache(file);
      if (typeOf(cache?.frontmatter) !== 'spell') continue;
      const lines = (await vault.cachedRead(file)).split('\n');
      const end = cache?.frontmatterPosition?.end.line;
      const spell = parseOwnSpell({
        path: file.path,
        basename: file.basename,
        frontmatter: cache?.frontmatter,
        body: lines.slice(end === undefined ? 0 : end + 1).join('\n'),
      });
      if (spell !== null) spells.push(spell);
    }
    const changed = JSON.stringify(spells) !== JSON.stringify(this.spells);
    this.spells = spells;
    if (changed) for (const listener of this.listeners) listener();
  }
}
