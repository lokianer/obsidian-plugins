// The deck builder: a dialog for a new own deck — its name, whether drawn cards return, and the
// cards as rows typed in by hand or filled from the standard deck, pasted text or a JSON file. It
// hands the finished deck over to be written as a note; it never rewrites a note.

import { type App, Modal, Notice, setIcon } from 'obsidian';

import { deckOf } from '../deck/cards';
import {
  type DraftCard,
  type DraftDeck,
  parseCardText,
  parseDeckJson,
  standardDrafts,
} from '../deck/own';
import type { T } from '../i18n/strings';
import type { Lang } from '../npc/races';

export interface DeckBuilderDeps {
  t: T;
  lang: Lang;
  /** Writes the deck; the dialog closes once it is written. */
  create: (deck: DraftDeck) => Promise<void>;
}

const blank = (): DraftCard => ({ name: '', effect: '', leaves: false, ends: false });

export class DeckBuilderModal extends Modal {
  private deck: DraftDeck = { name: '', returns: true, cards: [blank()] };
  private listEl!: HTMLElement;
  private countEl!: HTMLElement;
  private pasteEl!: HTMLElement;

  constructor(
    app: App,
    private readonly deps: DeckBuilderDeps,
  ) {
    super(app);
  }

  onOpen(): void {
    const { t } = this.deps;
    this.setTitle(t('builder.title'));
    const el = this.contentEl;
    el.empty();
    el.addClass('dnd5e-builder');

    const name = el.createEl('label', { cls: 'dnd5e-builder-field' });
    name.createSpan({ cls: 'dnd5e-builder-label', text: t('builder.name') });
    const nameInput = name.createEl('input', {
      cls: 'dnd5e-builder-name',
      attr: { type: 'text', placeholder: t('builder.namePlaceholder') },
    });
    nameInput.value = this.deck.name;
    nameInput.addEventListener('input', () => (this.deck.name = nameInput.value));

    const returns = el.createEl('label', { cls: 'dnd5e-builder-check' });
    const box = returns.createEl('input', { attr: { type: 'checkbox' } });
    box.checked = this.deck.returns;
    const words = returns.createDiv();
    words.createDiv({ text: t('builder.returns') });
    words.createDiv({ cls: 'dnd5e-builder-hint', text: t('builder.returns.desc') });
    box.addEventListener('change', () => {
      this.deck.returns = box.checked;
      this.renderList();
    });

    const fill = el.createDiv({ cls: 'dnd5e-builder-fill' });
    fill.createSpan({ cls: 'dnd5e-builder-label', text: t('builder.fill') });
    const standard = fill.createEl('button', { text: t('builder.standard') });
    standard.addEventListener('click', () => this.add(standardDrafts(deckOf(22), this.deps.lang)));
    const paste = fill.createEl('button', { cls: 'dnd5e-builder-paste', text: t('builder.paste') });
    paste.addEventListener('click', () =>
      this.pasteEl.toggleClass('is-open', !this.pasteEl.hasClass('is-open')),
    );
    const json = fill.createEl('button', { text: t('builder.json') });
    const file = fill.createEl('input', {
      cls: 'dnd5e-builder-file',
      attr: { type: 'file', accept: '.json,application/json' },
    });
    json.addEventListener('click', () => file.click());
    file.addEventListener('change', () => {
      const chosen = file.files?.[0];
      if (chosen !== undefined) void chosen.text().then((text) => this.importJson(text));
      file.value = '';
    });

    this.pasteEl = el.createDiv({ cls: 'dnd5e-builder-pastebox' });
    const area = this.pasteEl.createEl('textarea', {
      attr: { rows: '6', placeholder: t('builder.pastePlaceholder') },
    });
    const addPasted = this.pasteEl.createEl('button', {
      cls: 'mod-cta',
      text: t('builder.pasteAdd'),
    });
    addPasted.addEventListener('click', () => {
      if (this.importText(area.value)) {
        area.value = '';
        this.pasteEl.removeClass('is-open');
      }
    });

    this.listEl = el.createDiv({ cls: 'dnd5e-builder-list' });
    const tools = el.createDiv({ cls: 'dnd5e-builder-tools' });
    const add = tools.createEl('button');
    setIcon(add.createSpan({ cls: 'dnd5e-builder-icon' }), 'plus');
    add.appendText(t('builder.add'));
    add.addEventListener('click', () => {
      this.deck.cards.push(blank());
      this.renderList();
      this.listEl.querySelector<HTMLInputElement>('.dnd5e-builder-row:last-child input')?.focus();
    });
    const clear = tools.createEl('button', { text: t('builder.clear') });
    clear.addEventListener('click', () => {
      this.deck.cards = [blank()];
      this.renderList();
    });

    const footer = el.createDiv({ cls: 'dnd5e-builder-footer' });
    this.countEl = footer.createSpan({ cls: 'dnd5e-builder-count' });
    const create = footer.createEl('button', { cls: 'mod-cta', text: t('builder.create') });
    create.addEventListener('click', () => void this.finish());
    this.renderList();
    nameInput.focus();
  }

  onClose(): void {
    this.contentEl.empty();
  }

  /** Cards from pasted text, added below the ones there; false when the text holds none. */
  importText(text: string): boolean {
    const cards = parseCardText(text);
    if (cards.length === 0) return false;
    this.add(cards);
    return true;
  }

  /** A JSON file's deck: its cards added, its name and `returns` taken when given. */
  importJson(text: string): void {
    const result = parseDeckJson(text);
    if (!result.ok) {
      new Notice(this.deps.t(`builder.json.${result.reason}`));
      return;
    }
    if (result.deck.name !== undefined && this.deck.name.trim() === '') {
      this.deck.name = result.deck.name;
      const input = this.contentEl.querySelector<HTMLInputElement>('.dnd5e-builder-name');
      if (input !== null) input.value = result.deck.name;
    }
    if (result.deck.returns !== undefined) {
      this.deck.returns = result.deck.returns;
      const box = this.contentEl.querySelector<HTMLInputElement>('.dnd5e-builder-check input');
      if (box !== null) box.checked = result.deck.returns;
    }
    this.add(result.deck.cards);
  }

  private add(cards: DraftCard[]): void {
    const { t } = this.deps;
    // An untouched first row gives way to the cards brought in.
    const kept = this.deck.cards.filter((c) => c.name.trim() !== '' || c.effect.trim() !== '');
    this.deck.cards = [...kept, ...cards];
    this.renderList();
    new Notice(
      cards.length === 1 ? t('builder.added.one') : t('builder.added', { count: cards.length }),
    );
  }

  private renderList(): void {
    const { t } = this.deps;
    const list = this.listEl;
    list.empty();
    this.deck.cards.forEach((card, i) => {
      const row = list.createDiv({ cls: 'dnd5e-builder-row' });
      row.createSpan({ cls: 'dnd5e-builder-number', text: String(i + 1) });
      const fields = row.createDiv({ cls: 'dnd5e-builder-fields' });
      const name = fields.createEl('input', {
        attr: {
          type: 'text',
          placeholder: t('builder.cardName'),
          'aria-label': t('builder.cardName'),
        },
      });
      name.value = card.name;
      name.addEventListener('input', () => {
        card.name = name.value;
        this.renderCount();
      });
      const effect = fields.createEl('textarea', {
        attr: {
          rows: '2',
          placeholder: t('builder.cardEffect'),
          'aria-label': t('builder.cardEffect'),
        },
      });
      effect.value = card.effect;
      effect.addEventListener('input', () => (card.effect = effect.value));
      const flags = fields.createDiv({ cls: 'dnd5e-builder-flags' });
      if (this.deck.returns) this.flag(flags, card, 'leaves', t('deck.leaves'));
      this.flag(flags, card, 'ends', t('deck.ends'));
      const remove = row.createEl('button', {
        cls: 'clickable-icon',
        attr: { 'aria-label': t('builder.remove') },
      });
      setIcon(remove, 'x');
      remove.addEventListener('click', () => {
        this.deck.cards.splice(i, 1);
        if (this.deck.cards.length === 0) this.deck.cards.push(blank());
        this.renderList();
      });
    });
    this.renderCount();
  }

  private flag(parent: HTMLElement, card: DraftCard, key: 'leaves' | 'ends', text: string): void {
    const chip = parent.createEl('button', {
      cls: card[key] ? ['dnd5e-builder-flag', 'is-active'] : 'dnd5e-builder-flag',
      text,
      attr: { 'aria-pressed': String(card[key]) },
    });
    chip.addEventListener('click', () => {
      card[key] = !card[key];
      chip.toggleClass('is-active', card[key]);
      chip.setAttr('aria-pressed', String(card[key]));
    });
  }

  private named(): DraftCard[] {
    return this.deck.cards.filter((c) => c.name.trim() !== '');
  }

  private renderCount(): void {
    const { t } = this.deps;
    const n = this.named().length;
    this.countEl.setText(n === 1 ? t('deck.cards.one') : t('deck.cards', { count: n }));
  }

  private async finish(): Promise<void> {
    const { t } = this.deps;
    if (this.deck.name.trim() === '') {
      new Notice(t('builder.noName'));
      return;
    }
    const cards = this.named();
    if (cards.length === 0) {
      new Notice(t('builder.noCards'));
      return;
    }
    await this.deps.create({ ...this.deck, cards });
    this.close();
  }
}

/** Asks how far to reset a deck: the history only, or every card back too; null when cancelled. */
export function askReset(app: App, t: T): Promise<'log' | 'all' | null> {
  return new Promise((resolve) => {
    let answer: 'log' | 'all' | null = null;
    const modal = new Modal(app);
    modal.setTitle(t('deck.reset'));
    modal.contentEl.createEl('p', { text: t('deck.reset.text') });
    const buttons = modal.contentEl.createDiv({ cls: 'modal-button-container' });
    const choice = (text: string, value: 'log' | 'all' | null, cls?: string) => {
      const b = buttons.createEl('button', { text, cls });
      b.addEventListener('click', () => {
        answer = value;
        modal.close();
      });
    };
    choice(t('deck.reset.log'), 'log', 'mod-cta');
    choice(t('deck.reset.all'), 'all', 'mod-warning');
    choice(t('deck.reset.cancel'), null);
    modal.onClose = () => resolve(answer);
    modal.open();
  });
}
