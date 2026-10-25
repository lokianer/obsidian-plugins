// The Deck tab's adapter to the vault: finds the campaign's standard deck note, makes it on the
// first draw, and writes each draw as line edits through vault.process — a leaving card ticked,
// a draw line appended with the drawer linked.

import { localDate } from '@obsidian-plugins/session';
import { normalizePath, Notice, type Plugin, TFile } from 'obsidian';

import { inCampaign, typeOf } from '../campaign/scope';
import { cardByName, type DeckCard, deckOf } from '../deck/cards';
import { appendDraw, drawEntry, parseDeckNote, standardDeckText, tickCard } from '../deck/note';
import { PARTY } from '../factions/discover';
import type { T } from '../i18n/strings';
import type { WorldCache } from './world-cache';

const DECK_NOTE = 'Deck of Many Things.md';

export interface Drawer {
  name: string;
  /** The drawer's note, linked in the draw line; null for a name typed in. */
  path: string | null;
}

export interface DeckState {
  /** The deck note, or null before the first draw. */
  path: string | null;
  size: 13 | 22;
  /** Cards out of the deck, by index. */
  out: string[];
  /** The Draws lines, oldest first. */
  draws: string[];
}

/** What the Deck tab needs from the vault. */
export interface DeckSource {
  load(): Promise<DeckState>;
  party(): Promise<Drawer[]>;
  record(card: DeckCard, who: Drawer | null): Promise<void>;
  open(path: string): void;
}

const sizeOf = (value: unknown): 13 | 22 | null =>
  value === 'standard-13' ? 13 : value === 'standard-22' ? 22 : null;

export class DeckStore implements DeckSource {
  constructor(
    private readonly plugin: Plugin,
    private readonly cache: WorldCache,
    private readonly t: T,
    private readonly size: () => 13 | 22,
    readonly open: (path: string) => void,
  ) {}

  /** The campaign's standard deck note: the first by path with `type: deck` and `deck: standard-…`. */
  private async find(): Promise<{ file: TFile; size: 13 | 22 } | null> {
    const { vault, metadataCache } = this.plugin.app;
    const { campaign } = await this.cache.get();
    const found = vault
      .getMarkdownFiles()
      .filter((file) => campaign === null || inCampaign(campaign, file.path))
      .map((file) => {
        const frontmatter = metadataCache.getFileCache(file)?.frontmatter;
        const size = typeOf(frontmatter) === 'deck' ? sizeOf(frontmatter?.deck) : null;
        return size === null ? null : { file, size };
      })
      .filter((x) => x !== null)
      .sort((a, b) => (a.file.path < b.file.path ? -1 : 1));
    return found[0] ?? null;
  }

  async load(): Promise<DeckState> {
    const found = await this.find();
    if (found === null) return { path: null, size: this.size(), out: [], draws: [] };
    const note = parseDeckNote(await this.plugin.app.vault.cachedRead(found.file));
    return {
      path: found.file.path,
      size: found.size,
      out: note.cards.filter((c) => c.out).flatMap((c) => cardByName(c.name)?.index ?? []),
      draws: note.draws,
    };
  }

  async party(): Promise<Drawer[]> {
    const world = await this.cache.get();
    return [...world.entities.values()]
      .filter((e) => e.kind === 'character' && e.parent === PARTY)
      .map((e) => ({ name: e.name, path: e.notePath }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async record(card: DeckCard, who: Drawer | null): Promise<void> {
    const { vault, fileManager } = this.plugin.app;
    const file = (await this.find())?.file ?? (await this.create());
    const drawer = who?.path == null ? null : vault.getFileByPath(who.path);
    const name =
      drawer instanceof TFile
        ? fileManager.generateMarkdownLink(drawer, file.path)
        : (who?.name.trim() ?? '');
    const entry = drawEntry(localDate(new Date()), name, card.name.en);
    await vault.process(file, (text) => {
      let next = text;
      if (card.leaves) {
        const item = parseDeckNote(text).cards.find(
          (c) => !c.out && cardByName(c.name)?.index === card.index,
        );
        if (item !== undefined) next = tickCard(next, item.line);
      }
      return appendDraw(next, entry);
    });
  }

  private async create(): Promise<TFile> {
    const { vault } = this.plugin.app;
    const { campaign } = await this.cache.get();
    const folder = campaign?.folder ?? '';
    const path = normalizePath(folder === '' ? DECK_NOTE : `${folder}/${DECK_NOTE}`);
    const existing = vault.getFileByPath(path);
    if (existing !== null) return existing;
    const size = this.size();
    const file = await vault.create(path, standardDeckText(size, deckOf(size)));
    new Notice(this.t('deck.created', { path }));
    return file;
  }
}
