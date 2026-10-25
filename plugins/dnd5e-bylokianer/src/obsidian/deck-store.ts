// The Deck tab's adapter to the vault: lists the campaign's decks — the standard deck (its note made
// on the first draw) and every own `type: deck` note — and writes each draw and each reset as line
// edits through vault.process: a leaving card ticked, a draw line appended with the drawer linked.

import { localDate } from '@obsidian-plugins/session';
import { normalizePath, Notice, type Plugin, TFile } from 'obsidian';

import { inCampaign, typeOf } from '../campaign/scope';
import { cardByName, deckOf } from '../deck/cards';
import {
  appendDraw,
  drawEntry,
  parseDeckNote,
  resetDeck,
  standardDeckText,
  tickCard,
} from '../deck/note';
import { type DraftDeck, type OwnCard, ownCards, ownDeckText } from '../deck/own';
import { PARTY } from '../factions/discover';
import type { T } from '../i18n/strings';
import { campaignFolder, newNote } from './new-note';
import type { WorldCache } from './world-cache';

const DECK_NOTE = 'Deck of Many Things.md';

/** The standard deck's key; an own deck's key is its note's path. */
export const STANDARD = 'standard';

export interface Drawer {
  name: string;
  /** The drawer's note, linked in the draw line; null for a name typed in. */
  path: string | null;
}

export interface DeckInfo {
  key: string;
  /** The own deck's note name; empty for the standard deck, which the tab names itself. */
  title: string;
}

export interface DeckState {
  key: string;
  /** The deck note, or null before the standard deck's first draw. */
  path: string | null;
  /** The standard deck's size; null for an own deck. */
  size: 13 | 22 | null;
  /** An own deck's cards; empty for the standard deck. */
  own: OwnCard[];
  /** Cards out of the deck, by index. */
  out: string[];
  /** The Draws lines, oldest first. */
  draws: string[];
}

/** A drawn card as the note writes it. */
export interface DrawnCard {
  index: string;
  /** The name written in the draw line. */
  name: string;
  leaves: boolean;
}

/** What the Deck tab needs from the vault. */
export interface DeckSource {
  decks(): Promise<DeckInfo[]>;
  load(key: string): Promise<DeckState>;
  party(): Promise<Drawer[]>;
  record(key: string, card: DrawnCard, who: Drawer | null): Promise<void>;
  reset(key: string, returnCards: boolean): Promise<void>;
  open(path: string): void;
}

const sizeOf = (value: unknown): 13 | 22 | null =>
  value === 'standard-13' ? 13 : value === 'standard-22' ? 22 : null;

interface Found {
  file: TFile;
  frontmatter: Record<string, unknown> | undefined;
  size: 13 | 22 | null;
}

export class DeckStore implements DeckSource {
  constructor(
    private readonly plugin: Plugin,
    private readonly cache: WorldCache,
    private readonly t: T,
    private readonly settings: () => { deckSize: 13 | 22; deckFolder: string },
    readonly open: (path: string) => void,
  ) {}

  /** Every deck note in the campaign, by path. */
  private async notes(): Promise<Found[]> {
    const { vault, metadataCache } = this.plugin.app;
    const { campaign } = await this.cache.get();
    return vault
      .getMarkdownFiles()
      .filter((file) => campaign === null || inCampaign(campaign, file.path))
      .map((file) => ({ file, frontmatter: metadataCache.getFileCache(file)?.frontmatter }))
      .filter(({ frontmatter }) => typeOf(frontmatter) === 'deck')
      .map((x) => ({ ...x, size: sizeOf(x.frontmatter?.deck) }))
      .sort((a, b) => (a.file.path < b.file.path ? -1 : 1));
  }

  private async find(key: string): Promise<Found | null> {
    const notes = await this.notes();
    return (
      (key === STANDARD
        ? notes.find((n) => n.size !== null)
        : notes.find((n) => n.size === null && n.file.path === key)) ?? null
    );
  }

  async decks(): Promise<DeckInfo[]> {
    const own = (await this.notes()).filter((n) => n.size === null);
    return [
      { key: STANDARD, title: '' },
      ...own.map((n) => ({ key: n.file.path, title: n.file.basename })),
    ];
  }

  async load(key: string): Promise<DeckState> {
    const found = await this.find(key);
    if (found === null) {
      return {
        key: STANDARD,
        path: null,
        size: this.settings().deckSize,
        own: [],
        out: [],
        draws: [],
      };
    }
    const note = parseDeckNote(await this.plugin.app.vault.cachedRead(found.file));
    const own = found.size === null ? ownCards(note.cards, found.frontmatter) : [];
    const out =
      found.size === null
        ? own.filter((_, i) => note.cards[i]?.out === true).map((c) => c.index)
        : note.cards.filter((c) => c.out).flatMap((c) => cardByName(c.name)?.index ?? []);
    return {
      key: found.size === null ? found.file.path : STANDARD,
      path: found.file.path,
      size: found.size,
      own,
      out,
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

  async record(key: string, card: DrawnCard, who: Drawer | null): Promise<void> {
    const { vault, fileManager } = this.plugin.app;
    const found = await this.find(key);
    const file = found?.file ?? (key === STANDARD ? await this.createStandard() : null);
    if (file === null) return;
    const drawer = who?.path == null ? null : vault.getFileByPath(who.path);
    const name =
      drawer instanceof TFile
        ? fileManager.generateMarkdownLink(drawer, file.path)
        : (who?.name.trim() ?? '');
    const entry = drawEntry(localDate(new Date()), name, card.name);
    await vault.process(file, (text) => {
      let next = text;
      if (card.leaves) {
        const cards = parseDeckNote(text).cards;
        const indexes =
          key === STANDARD
            ? cards.map((c) => cardByName(c.name)?.index)
            : ownCards(cards, found?.frontmatter).map((c) => c.index);
        const item = cards.find((c, i) => !c.out && indexes[i] === card.index);
        if (item !== undefined) next = tickCard(next, item.line);
      }
      return appendDraw(next, entry);
    });
  }

  async reset(key: string, returnCards: boolean): Promise<void> {
    const found = await this.find(key);
    if (found === null) return;
    await this.plugin.app.vault.process(found.file, (text) => resetDeck(text, returnCards));
  }

  /** Writes a new own deck in the campaign's deck folder; returns its path. */
  async create(deck: DraftDeck): Promise<string> {
    const { app } = this.plugin;
    const path = await newNote(
      app,
      this.cache,
      this.settings().deckFolder,
      deck.name,
      ownDeckText(deck),
    );
    new Notice(this.t('deck.created', { path }));
    return path;
  }

  private async createStandard(): Promise<TFile> {
    const { vault } = this.plugin.app;
    const dir = await campaignFolder(this.cache, '');
    const path = normalizePath(dir === '' ? DECK_NOTE : `${dir}/${DECK_NOTE}`);
    const existing = vault.getFileByPath(path);
    if (existing !== null) return existing;
    const size = this.settings().deckSize;
    const file = await vault.create(path, standardDeckText(size, deckOf(size)));
    new Notice(this.t('deck.created', { path }));
    return file;
  }
}
