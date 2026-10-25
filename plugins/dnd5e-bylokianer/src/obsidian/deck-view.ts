// The Deck tab: a deck on the table — the SRD's Deck of Many Things or one of the GM's own. The GM
// names who draws and how many cards are declared, then turns them one by one; the rules (the Fool,
// the Jester, the Idiot, The Void, Donjon in the standard deck; leaving and ending cards in any)
// run themselves. Beside it the deck at a glance — a tap shows a card's effect — and the history of
// draws, both read from the deck note the store keeps. New deck opens the builder, Reset clears
// the history.

import { Component, ItemView, MarkdownRenderer, setIcon, type WorkspaceLeaf } from 'obsidian';

import { cardByName, corner, deckOf, isRed } from '../deck/cards';
import { splitEntry } from '../deck/note';
import {
  canDraw,
  choose,
  draw,
  type Drawing,
  isDone,
  left,
  pickCard,
  pool,
  startDrawing,
} from '../deck/rules';
import type { T } from '../i18n/strings';
import type { Lang } from '../npc/races';
import {
  type DeckInfo,
  type DeckSource,
  type DeckState,
  type Drawer,
  STANDARD,
} from './deck-store';

export const DECK_VIEW = 'dnd5e-deck';

const HISTORY = 30;
const MAX_DECLARED = 22;

export interface DeckDeps {
  t: T;
  lang: () => Lang;
  source: DeckSource;
  /** A random number in [0, 1); the tests replace it. */
  random: () => number;
  /** The deck shown last, and where a new pick is kept. */
  selected: () => string;
  select: (key: string) => void;
  /** Opens the deck builder. */
  newDeck: () => void;
  /** Asks how far to reset: the history only, or every card back too; null to cancel. */
  confirmReset: () => Promise<'log' | 'all' | null>;
}

/** A card as the table shows it, from the standard deck or an own one. */
interface PlayCard {
  index: string;
  name: string;
  /** The name in the other language; empty for an own card. */
  other: string;
  text: string;
  corner: string;
  red: boolean;
  leaves: boolean;
  ends: boolean;
  /** The name the note's draw line takes. */
  noteName: string;
}

/** A random number in [0, 1) from the platform's cryptographic source. */
export function cryptoRandom(): number {
  return (window.crypto.getRandomValues(new Uint32Array(1))[0] ?? 0) / 2 ** 32;
}

/** "[[Mira]]" or "[Mira](Mira.md)" as the name it shows. */
const shownName = (who: string): string =>
  who.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

export class DeckView extends ItemView {
  private decks: DeckInfo[] = [];
  private state: DeckState = { key: STANDARD, path: null, size: 22, own: [], out: [], draws: [] };
  private party: Drawer[] = [];
  private drawing: Drawing | null = null;
  private who = '';
  private declared = 1;
  /** The card face on the table: the last one drawn, or one picked in the deck grid. */
  private shown: string | null = null;
  private busy = false;
  private text: Component | null = null;

  constructor(
    leaf: WorkspaceLeaf,
    private readonly deps: DeckDeps,
  ) {
    super(leaf);
  }

  getViewType(): string {
    return DECK_VIEW;
  }

  getDisplayText(): string {
    return this.deps.t('deck.title');
  }

  getIcon(): string {
    return 'layers';
  }

  async onOpen(): Promise<void> {
    this.contentEl.addClass('dnd5e-deck');
    await this.refresh();
  }

  async onClose(): Promise<void> {
    this.text?.unload();
    this.contentEl.empty();
    return Promise.resolve();
  }

  /** Reads the decks again (after an edit by hand, say) and draws the tab anew if anything changed. */
  async refresh(): Promise<void> {
    if (this.busy) return;
    const { source } = this.deps;
    const [decks, party] = await Promise.all([source.decks(), source.party()]);
    const wanted = this.deps.selected();
    const key = decks.some((d) => d.key === wanted) ? wanted : STANDARD;
    const state = await source.load(key);
    // The tab's own draw already read the note; its echo must not redraw over the turning card.
    const same =
      JSON.stringify([decks, state, party]) ===
        JSON.stringify([this.decks, this.state, this.party]) && this.contentEl.hasChildNodes();
    this.decks = decks;
    this.state = state;
    this.party = party;
    if (!same) this.render();
  }

  /** Shows this deck (one just built, say). */
  async show(key: string): Promise<void> {
    this.deps.select(key);
    this.drawing = null;
    this.shown = null;
    await this.refresh();
  }

  private get lang(): Lang {
    return this.deps.lang();
  }

  private get standard(): boolean {
    return this.state.size !== null;
  }

  private get cards(): PlayCard[] {
    const lang = this.lang;
    if (this.state.size !== null) {
      return deckOf(this.state.size).map((c) => ({
        index: c.index,
        name: c.name[lang],
        other: c.name[lang === 'de' ? 'en' : 'de'],
        text: c.text[lang],
        corner: corner(c, lang),
        red: isRed(c),
        leaves: c.leaves,
        ends: c.ends,
        noteName: c.name.en,
      }));
    }
    return this.state.own.map((c, i) => ({
      index: c.index,
      name: c.name,
      other: '',
      text: c.effect,
      corner: String(i + 1),
      red: false,
      leaves: c.leaves,
      ends: c.ends,
      noteName: c.name,
    }));
  }

  private drawer(): Drawer | null {
    const name = this.who.trim();
    if (name === '') return null;
    const key = name.toLowerCase();
    return this.party.find((p) => p.name.toLowerCase() === key) ?? { name, path: null };
  }

  private async drawOne(): Promise<void> {
    if (this.drawing === null || !canDraw(this.drawing) || this.busy) return;
    const card = pickCard(pool(this.drawing, this.cards), this.deps.random);
    if (card === undefined) return;
    this.busy = true;
    try {
      this.drawing = draw(this.drawing, card);
      this.shown = card.index;
      const { source } = this.deps;
      await source.record(
        this.state.key,
        { index: card.index, name: card.noteName, leaves: card.leaves },
        this.drawer(),
      );
      this.state = await source.load(this.state.key);
      // The standard deck's note may have just been made.
      this.decks = await source.decks();
    } finally {
      this.busy = false;
    }
    this.render(true);
  }

  private async reset(): Promise<void> {
    const answer = await this.deps.confirmReset();
    if (answer === null) return;
    await this.deps.source.reset(this.state.key, answer === 'all');
    this.drawing = null;
    this.shown = null;
    this.state = await this.deps.source.load(this.state.key);
    this.render();
  }

  // ── rendering ──────────────────────────────────────────────────────────────────────────────

  private render(turn = false): void {
    this.text?.unload();
    this.text = new Component();
    this.text.load();
    const root = this.contentEl;
    root.empty();
    // For hyphenation of the long card names.
    root.setAttr('lang', this.lang);
    this.renderHeader(root);

    const body = root.createDiv({ cls: 'dnd5e-deck-body' });
    const stage = body.createDiv({ cls: 'dnd5e-deck-stage' });
    const shown = this.cards.find((c) => c.index === this.shown) ?? null;
    const card = this.renderCard(stage, shown);
    if (turn && shown !== null) {
      // Drawn face down first, so the turn is seen.
      card.removeClass('is-turned');
      window.setTimeout(() => card.addClass('is-turned'), 30);
    }
    this.renderControls(stage.createDiv({ cls: 'dnd5e-deck-controls' }));

    const side = body.createDiv({ cls: 'dnd5e-deck-side' });
    this.renderGrid(side);
    this.renderHistory(side);
    if (this.standard) {
      root.createDiv({ cls: 'dnd5e-deck-source', text: this.deps.t('deck.source') });
    }
  }

  private renderHeader(root: HTMLElement): void {
    const { t } = this.deps;
    const header = root.createDiv({ cls: 'dnd5e-deck-header' });
    const titles = header.createDiv({ cls: 'dnd5e-deck-titles' });
    const own = this.decks.find((d) => d.key === this.state.key && d.key !== STANDARD);
    titles.createDiv({ cls: 'dnd5e-deck-title', text: own?.title ?? t('deck.title') });
    const returns = this.cards.some((c) => !c.leaves);
    titles.createDiv({
      cls: 'dnd5e-deck-rules',
      text: this.standard
        ? t('deck.rules')
        : t(returns ? 'deck.rules.returns' : 'deck.rules.stays'),
    });

    const tools = header.createDiv({ cls: 'dnd5e-deck-tools' });
    if (this.decks.length > 1) {
      const select = tools.createEl('select', {
        cls: ['dropdown', 'dnd5e-deck-picker'],
        attr: { 'aria-label': t('deck.pick') },
      });
      for (const d of this.decks) {
        select.createEl('option', {
          text: d.key === STANDARD ? t('deck.standard') : d.title,
          attr: { value: d.key },
        });
      }
      select.value = this.state.key;
      select.addEventListener('change', () => void this.show(select.value));
    }
    tools.createSpan({
      cls: 'dnd5e-deck-size',
      text:
        this.cards.length === 1
          ? t('deck.cards.one')
          : t('deck.cards', { count: this.cards.length }),
    });
    const button = (icon: string, label: string, action: () => void, cls: string) => {
      const b = tools.createEl('button', {
        cls: ['clickable-icon', cls],
        attr: { 'aria-label': label },
      });
      setIcon(b, icon);
      b.addEventListener('click', action);
    };
    button('plus', t('deck.new'), () => this.deps.newDeck(), 'dnd5e-deck-new');
    const path = this.state.path;
    if (path !== null) {
      button('rotate-ccw', t('deck.reset'), () => void this.reset(), 'dnd5e-deck-reset');
      button('file-text', t('deck.openNote'), () => this.deps.source.open(path), 'dnd5e-deck-note');
    }
  }

  private renderCard(parent: HTMLElement, card: PlayCard | null): HTMLElement {
    const { t } = this.deps;
    const el = parent.createDiv({ cls: 'dnd5e-deck-card' });
    const inner = el.createDiv({ cls: 'dnd5e-deck-card-inner' });
    const back = inner.createDiv({ cls: 'dnd5e-deck-card-back' });
    setIcon(back.createDiv({ cls: 'dnd5e-deck-card-sigil' }), 'sparkles');
    if (card === null) return el;
    el.addClass('is-turned');
    el.toggleClass('is-red', card.red);
    el.dataset.card = card.index;
    const face = inner.createDiv({ cls: 'dnd5e-deck-card-face' });
    face.createDiv({ cls: 'dnd5e-deck-corner', text: card.corner });
    face.createDiv({ cls: 'dnd5e-deck-card-name', text: card.name });
    if (card.other !== '' && card.other !== card.name) {
      face.createDiv({ cls: 'dnd5e-deck-card-other', text: card.other });
    }
    // In a deck where every card stays out, "leaves the deck" would say nothing.
    const allLeave = this.cards.every((c) => c.leaves);
    if ((card.leaves && !allLeave) || card.ends) {
      face.createSpan({
        cls: 'dnd5e-deck-badge',
        text: t(card.ends ? 'deck.ends' : 'deck.leaves'),
      });
    }
    const text = face.createDiv({ cls: ['dnd5e-deck-card-text', 'markdown-rendered'] });
    void MarkdownRenderer.render(
      this.app,
      card.text,
      text,
      this.state.path ?? '',
      this.text ?? this,
    );
    face.createDiv({ cls: ['dnd5e-deck-corner', 'is-bottom'], text: card.corner });
    return el;
  }

  private renderControls(el: HTMLElement): void {
    const { t } = this.deps;
    const d = this.drawing;
    if (d === null) {
      this.renderSetup(el);
      return;
    }
    if (d.drawn.length > 0) {
      const row = el.createDiv({ cls: 'dnd5e-deck-drawn' });
      row.createSpan({ cls: 'dnd5e-deck-label', text: t('deck.drawn') });
      for (const index of d.drawn) {
        const c = this.cards.find((x) => x.index === index);
        if (c === undefined) continue;
        const chip = row.createEl('button', {
          cls: c.red ? ['dnd5e-deck-chip', 'is-red'] : 'dnd5e-deck-chip',
          text: `${c.corner} ${c.name}`,
        });
        chip.addEventListener('click', () => {
          this.shown = c.index;
          this.render();
        });
      }
    }
    const status = el.createDiv({ cls: 'dnd5e-deck-status' });
    if (d.pending !== null) {
      const jester = d.pending === 'jester';
      const choices = el.createDiv({ cls: 'dnd5e-deck-actions' });
      const more = choices.createEl('button', {
        cls: 'mod-cta',
        text: t(jester ? 'deck.jester.cards' : 'deck.idiot.more'),
      });
      more.addEventListener('click', () => this.answer(true));
      const no = choices.createEl('button', {
        text: t(jester ? 'deck.jester.xp' : 'deck.idiot.no'),
      });
      no.addEventListener('click', () => this.answer(false));
      return;
    }
    const emptied = !isDone(d) && pool(d, this.cards).length === 0;
    if (isDone(d) || emptied) {
      status.setText(t(emptied ? 'deck.emptied' : d.ended ? 'deck.ended' : 'deck.done'));
      const again = el.createDiv({ cls: 'dnd5e-deck-actions' }).createEl('button', {
        cls: 'mod-cta',
        text: t('deck.again'),
      });
      again.addEventListener('click', () => {
        this.drawing = null;
        this.render();
      });
      return;
    }
    const n = left(d);
    status.setText(
      d.redraw ? t('deck.redraw') : n === 1 ? t('deck.left.one') : t('deck.left', { count: n }),
    );
    const button = el.createDiv({ cls: 'dnd5e-deck-actions' }).createEl('button', {
      cls: ['mod-cta', 'dnd5e-deck-draw'],
      text: t('deck.draw'),
    });
    button.addEventListener('click', () => void this.drawOne());
    window.setTimeout(() => button.focus(), 0);
  }

  private answer(more: boolean): void {
    if (this.drawing === null) return;
    this.drawing = choose(this.drawing, more);
    this.render();
  }

  private renderSetup(el: HTMLElement): void {
    const { t } = this.deps;
    const form = el.createDiv({ cls: 'dnd5e-deck-setup' });
    const whoField = form.createEl('label', { cls: 'dnd5e-deck-field' });
    whoField.createSpan({ cls: 'dnd5e-deck-label', text: t('deck.who') });
    const listId = `dnd5e-deck-party-${Math.random().toString(36).slice(2)}`;
    const input = whoField.createEl('input', {
      attr: { type: 'text', placeholder: t('deck.whoPlaceholder'), list: listId },
    });
    input.value = this.who;
    input.addEventListener('input', () => (this.who = input.value));
    const list = whoField.createEl('datalist', { attr: { id: listId } });
    for (const p of this.party) list.createEl('option', { attr: { value: p.name } });

    const countField = form.createDiv({ cls: 'dnd5e-deck-field' });
    countField.createSpan({ cls: 'dnd5e-deck-label', text: t('deck.declare') });
    const stepper = countField.createDiv({ cls: 'dnd5e-deck-stepper' });
    const minus = stepper.createEl('button', {
      cls: 'clickable-icon',
      attr: { 'aria-label': '−' },
    });
    setIcon(minus, 'minus');
    const value = stepper.createSpan({ cls: 'dnd5e-deck-count', text: String(this.declared) });
    const plus = stepper.createEl('button', { cls: 'clickable-icon', attr: { 'aria-label': '+' } });
    setIcon(plus, 'plus');
    const step = (by: number) => {
      this.declared = Math.min(MAX_DECLARED, Math.max(1, this.declared + by));
      value.setText(String(this.declared));
    };
    minus.addEventListener('click', () => step(-1));
    plus.addEventListener('click', () => step(1));

    const begin = el.createDiv({ cls: 'dnd5e-deck-actions' }).createEl('button', {
      cls: ['mod-cta', 'dnd5e-deck-begin'],
      text: t('deck.begin'),
    });
    // A deck whose cards are all out has nothing to draw until it is reset.
    begin.disabled = this.cards.every((c) => this.state.out.includes(c.index));
    begin.addEventListener('click', () => {
      this.drawing = startDrawing(this.declared, this.state.out, this.standard);
      this.shown = null;
      this.render();
    });
  }

  private renderGrid(side: HTMLElement): void {
    const { t } = this.deps;
    side.createDiv({ cls: 'dnd5e-deck-section', text: t('deck.inDeck') });
    const grid = side.createDiv({ cls: 'dnd5e-deck-grid' });
    for (const c of this.cards) {
      const out = this.state.out.includes(c.index);
      const cls = ['dnd5e-deck-tile'];
      if (out) cls.push('is-out');
      if (c.red) cls.push('is-red');
      if (c.index === this.shown) cls.push('is-shown');
      const tile = grid.createEl('button', {
        cls,
        attr: { 'aria-label': out ? `${c.name} — ${t('deck.out')}` : c.name },
      });
      tile.dataset.card = c.index;
      tile.createSpan({ cls: 'dnd5e-deck-tile-corner', text: c.corner });
      tile.createSpan({ cls: 'dnd5e-deck-tile-name', text: c.name });
      // Looking a card up is for between drawings, not to peek during one.
      tile.addEventListener('click', () => {
        if (this.drawing !== null && !isDone(this.drawing)) return;
        this.shown = c.index;
        this.render();
      });
    }
  }

  private renderHistory(side: HTMLElement): void {
    const { t } = this.deps;
    side.createDiv({ cls: 'dnd5e-deck-section', text: t('deck.history') });
    const draws = this.state.draws.slice(-HISTORY).reverse();
    if (draws.length === 0) {
      side.createDiv({ cls: 'dnd5e-deck-empty', text: t('deck.noHistory') });
      return;
    }
    const list = side.createDiv({ cls: 'dnd5e-deck-history' });
    for (const entry of draws) {
      const { date, who, card } = splitEntry(entry);
      const srd = this.standard ? cardByName(card) : undefined;
      const red = srd !== undefined && isRed(srd);
      const row = list.createDiv({ cls: 'dnd5e-deck-history-row' });
      row.createSpan({
        cls: red ? ['dnd5e-deck-history-card', 'is-red'] : 'dnd5e-deck-history-card',
        text: srd === undefined ? card : `${corner(srd, this.lang)} ${srd.name[this.lang]}`,
      });
      row.createSpan({
        cls: 'dnd5e-deck-history-meta',
        text: [shownName(who), date].filter((s) => s !== '').join(' · '),
      });
    }
  }
}
