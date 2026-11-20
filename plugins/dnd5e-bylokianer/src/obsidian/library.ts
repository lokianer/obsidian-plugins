// The GM's library notes: every note with `type: library` and a `source:` book key, cut into its
// `##` sections, read once and again only after one of them changed. Listeners (the Spellbook)
// hear about each change.

import { debounce, type Plugin, type TFile } from 'obsidian';

import { typeOf } from '../campaign/scope';
import { isBookKey } from '../catalogue/books';
import { librarySections } from '../catalogue/library';
import type { LibrarySection } from '../catalogue/merge';

export class Library {
  private found = new Map<string, LibrarySection>();
  private paths = new Set<string>();
  private runs = 0;
  private readonly listeners = new Set<() => void>();
  private readonly schedule = debounce(() => void this.reload(), 250, true);

  constructor(private readonly plugin: Plugin) {
    const { app } = plugin;
    const touched = (file: TFile) =>
      typeOf(app.metadataCache.getFileCache(file)?.frontmatter) === 'library' ||
      this.paths.has(file.path);
    plugin.registerEvent(
      app.metadataCache.on('changed', (file) => {
        if (touched(file)) this.schedule();
      }),
    );
    plugin.registerEvent(
      app.metadataCache.on('deleted', (file) => {
        if (this.paths.has(file.path)) this.schedule();
      }),
    );
    // A renamed note keeps its sections, but its new path must be known for later changes.
    plugin.registerEvent(
      app.vault.on('rename', (_file, oldPath) => {
        if (this.paths.has(oldPath)) this.schedule();
      }),
    );
  }

  /** Every section of every library note, keyed `<book>/<slug>`. */
  get sections(): ReadonlyMap<string, LibrarySection> {
    return this.found;
  }

  onChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async reload(): Promise<void> {
    // Of overlapping reloads only the last one started may land: it read the newest notes.
    const run = ++this.runs;
    const { vault, metadataCache } = this.plugin.app;
    const found = new Map<string, LibrarySection>();
    const paths = new Set<string>();
    for (const file of vault.getMarkdownFiles()) {
      const frontmatter = metadataCache.getFileCache(file)?.frontmatter;
      const source: unknown = frontmatter?.source;
      if (typeOf(frontmatter) !== 'library' || !isBookKey(source)) continue;
      paths.add(file.path);
      for (const [key, section] of librarySections(source, await vault.cachedRead(file))) {
        found.set(key, section);
      }
    }
    if (run !== this.runs) return;
    const changed = this.paths.size > 0 || paths.size > 0;
    this.found = found;
    this.paths = paths;
    if (changed) for (const listener of this.listeners) listener();
  }
}
