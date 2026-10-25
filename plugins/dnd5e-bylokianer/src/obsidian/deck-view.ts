// The Deck tab: the SRD's Deck of Many Things on the table. The GM names who draws and how many
// cards are declared, then turns them one by one; the rules (the Fool, the Jester, the Idiot, The
// Void, Donjon) run themselves. Beside it the deck at a glance — a tap shows a card's effect — and
// the history of draws, both read from the deck note the store keeps.

import { Component, ItemView, MarkdownRenderer, setIcon, type WorkspaceLeaf } from 'obsidian';

import { cardByName, corner, type DeckCard, deckOf, isRed } from '../deck/cards';
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
import type { DeckSource, DeckState, Drawer } from './deck-store';

export const DECK_VIEW = 'dnd5e-deck';

const HISTORY = 30;
const MAX_DECLARED = 22;

export interface DeckDeps {
  t: T;
  lang: () => Lang;
  source: DeckSource;
  /** A random number in [0, 1); the tests replace it. */
  random: () => number;
}

/** A random number in [0, 1) from the platform's cryptographic source. */
export function cryptoRandom(): number {
  return (window.crypto.getRandomValues(new Uint32Array(1))[0] ?? 0) / 2 ** 32;
}

/** "[[Mira]]" or "[Mira](Mira.md)" as the name it shows. */
const shownName = (who: string): string =>
  who.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

export class DeckView extends ItemView {
  private state: DeckState = { path: null, size: 22, out: [], draws: [] };
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

  /** Reads the deck note again (after an edit by hand, say) and draws the tab anew. */
  async refresh(): Promise<void> {
    if (this.busy) return;
    const [state, party] = await Promise.all([this.deps.source.load(), this.deps.source.party()]);
    // The tab's own draw already read the note; its echo must not redraw over the turning card.
    const same =
      JSON.stringify([state, party]) === JSON.stringify([this.state, this.party]) &&
      this.contentEl.hasChildNodes();
    this.state = state;
    this.party = party;
    if (!same) this.render();
  }

  private get lang(): Lang {
    return this.deps.lang();
  }

  private get cards(): DeckCard[] {
    return deckOf(this.state.size);
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
      await this.deps.source.record(card, this.drawer());
      this.state = await this.deps.source.load();
    } finally {
      this.busy = false;
    }
    this.render(true);
  }

  // ── rendering ──────────────────────────────────────────────────────────────────────────────

  private render(turn = false): void {
    const { t } = this.deps;
    this.text?.unload();
    this.text = new Component();
    this.text.load();
    const root = this.contentEl;
    root.empty();
    // For hyphenation of the long card names.
    root.setAttr('lang', this.lang);

    const header = root.createDiv({ cls: 'dnd5e-deck-header' });
    const titles = header.createDiv({ cls: 'dnd5e-deck-titles' });
    titles.createDiv({ cls: 'dnd5e-deck-title', text: t('deck.title') });
    titles.createDiv({ cls: 'dnd5e-deck-rules', text: t('deck.rules') });
    header.createSpan({
      cls: 'dnd5e-deck-size',
      text: t('deck.cards', { count: this.state.size }),
    });
    const path = this.state.path;
    if (path !== null) {
      const open = header.createEl('button', {
        cls: 'clickable-icon',
        attr: { 'aria-label': t('deck.openNote') },
      });
      setIcon(open, 'file-text');
      open.addEventListener('click', () => this.deps.source.open(path));
    }

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
    root.createDiv({ cls: 'dnd5e-deck-source', text: t('deck.source') });
  }

  private renderCard(parent: HTMLElement, card: DeckCard | null): HTMLElement {
    const { t } = this.deps;
    const lang = this.lang;
    const el = parent.createDiv({ cls: 'dnd5e-deck-card' });
    const inner = el.createDiv({ cls: 'dnd5e-deck-card-inner' });
    const back = inner.createDiv({ cls: 'dnd5e-deck-card-back' });
    setIcon(back.createDiv({ cls: 'dnd5e-deck-card-sigil' }), 'sparkles');
    if (card === null) return el;
    el.addClass('is-turned');
    el.toggleClass('is-red', isRed(card));
    el.dataset.card = card.index;
    const face = inner.createDiv({ cls: 'dnd5e-deck-card-face' });
    face.createDiv({ cls: 'dnd5e-deck-corner', text: corner(card, lang) });
    face.createDiv({ cls: 'dnd5e-deck-card-name', text: card.name[lang] });
    const other = card.name[lang === 'de' ? 'en' : 'de'];
    if (other !== card.name[lang]) face.createDiv({ cls: 'dnd5e-deck-card-other', text: other });
    if (card.leaves || card.ends) {
      face.createSpan({
        cls: 'dnd5e-deck-badge',
        text: t(card.leaves ? 'deck.leaves' : 'deck.ends'),
      });
    }
    const text = face.createDiv({ cls: ['dnd5e-deck-card-text', 'markdown-rendered'] });
    void MarkdownRenderer.render(this.app, card.text[lang], text, '', this.text ?? this);
    face.createDiv({ cls: ['dnd5e-deck-corner', 'is-bottom'], text: corner(card, lang) });
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
          cls: isRed(c) ? ['dnd5e-deck-chip', 'is-red'] : 'dnd5e-deck-chip',
          text: `${corner(c, this.lang)} ${c.name[this.lang]}`,
        });
        chip.addEventListener('click', () => {
          this.shown = c.index;
          this.render();
        });
      }
    }
    const status = el.createDiv({ cls: 'dnd5e-deck-status' });
    if (d.pending === 'jester' || d.pending === 'idiot') {
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
    if (isDone(d)) {
      status.setText(t(d.ended ? 'deck.ended' : 'deck.done'));
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
    begin.addEventListener('click', () => {
      this.drawing = startDrawing(this.declared, this.state.out);
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
      if (isRed(c)) cls.push('is-red');
      if (c.index === this.shown) cls.push('is-shown');
      const tile = grid.createEl('button', {
        cls,
        attr: { 'aria-label': out ? `${c.name[this.lang]} — ${t('deck.out')}` : c.name[this.lang] },
      });
      tile.dataset.card = c.index;
      tile.createSpan({ cls: 'dnd5e-deck-tile-corner', text: corner(c, this.lang) });
      tile.createSpan({ cls: 'dnd5e-deck-tile-name', text: c.name[this.lang] });
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
      const c = cardByName(card);
      const row = list.createDiv({ cls: 'dnd5e-deck-history-row' });
      row.createSpan({
        cls:
          c !== undefined && isRed(c)
            ? ['dnd5e-deck-history-card', 'is-red']
            : 'dnd5e-deck-history-card',
        text: c === undefined ? card : `${corner(c, this.lang)} ${c.name[this.lang]}`,
      });
      row.createSpan({
        cls: 'dnd5e-deck-history-meta',
        text: [shownName(who), date].filter((s) => s !== '').join(' · '),
      });
    }
  }
}
