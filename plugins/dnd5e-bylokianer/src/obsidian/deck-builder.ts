// The deck builder, built like the New NPC dialog: on the left the form — the deck's name and
// whether drawn cards return as Obsidian settings, three tiles to fill it from (the standard deck,
// pasted text, a JSON file), the cards as rows — and on the right a live preview: the deck, and
// the card being edited as it will turn over on the table. It hands the finished deck over to be
// written as a note; it never rewrites a note.

import { type App, Component, MarkdownRenderer, Modal, Notice, setIcon, Setting } from 'obsidian';

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
  /** The card the preview shows: the one last edited. */
  private current = 0;
  private listEl!: HTMLElement;
  private countEl!: HTMLElement;
  private pasteEl!: HTMLElement;
  private previewEl!: HTMLElement;
  private returnsSet: ((on: boolean) => void) | null = null;
  private nameSet: ((name: string) => void) | null = null;
  private preview: Component | null = null;

  constructor(
    app: App,
    private readonly deps: DeckBuilderDeps,
  ) {
    super(app);
  }

  onOpen(): void {
    const { t } = this.deps;
    this.setTitle(t('builder.title'));
    this.modalEl.addClass('dnd5e-npc-modal', 'dnd5e-npc-dialog');
    const el = this.contentEl;
    el.addClass('dnd5e-deck-builder');
    const body = el.createDiv({ cls: 'dnd5e-npc-body' });
    const form = body.createDiv({ cls: 'dnd5e-npc-form' });
    this.previewEl = body.createDiv({ cls: 'dnd5e-npc-preview' });

    new Setting(form).setName(t('builder.name')).addText((text) => {
      text.inputEl.addClass('dnd5e-builder-name');
      text
        .setPlaceholder(t('builder.namePlaceholder'))
        .setValue(this.deck.name)
        .onChange((value) => {
          this.deck.name = value;
          this.drawPreview();
        });
      this.nameSet = (name) => {
        text.setValue(name);
      };
    });
    new Setting(form)
      .setName(t('builder.returns'))
      .setDesc(t('builder.returns.desc'))
      .addToggle((toggle) => {
        toggle.toggleEl.addClass('dnd5e-builder-returns');
        toggle.setValue(this.deck.returns).onChange((on) => {
          this.deck.returns = on;
          this.renderList();
        });
        this.returnsSet = (on) => {
          toggle.setValue(on);
        };
      });

    new Setting(form).setName(t('builder.fill')).setHeading();
    const sources = form.createDiv({ cls: ['dnd5e-npc-tiles', 'dnd5e-builder-sources'] });
    this.source(
      sources,
      'standard',
      'layers',
      t('builder.standard'),
      t('builder.standard.line'),
      () => this.add(standardDrafts(deckOf(22), this.deps.lang)),
    );
    this.source(
      sources,
      'paste',
      'clipboard-paste',
      t('builder.paste'),
      t('builder.paste.line'),
      () => this.pasteEl.toggleClass('is-open', !this.pasteEl.hasClass('is-open')),
    );
    const file = form.createEl('input', {
      cls: 'dnd5e-builder-file',
      attr: { type: 'file', accept: '.json,application/json' },
    });
    this.source(sources, 'json', 'file-json', t('builder.json'), t('builder.json.line'), () =>
      file.click(),
    );
    file.addEventListener('change', () => {
      const chosen = file.files?.[0];
      if (chosen !== undefined) void chosen.text().then((text) => this.importJson(text));
      file.value = '';
    });

    this.pasteEl = form.createDiv({ cls: 'dnd5e-builder-pastebox' });
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

    const cards = new Setting(form).setName(t('builder.cards')).setHeading();
    this.countEl = cards.settingEl.createSpan({ cls: 'dnd5e-builder-count' });
    cards.addExtraButton((button) =>
      button
        .setIcon('trash-2')
        .setTooltip(t('builder.clear'))
        .onClick(() => {
          this.deck.cards = [blank()];
          this.current = 0;
          this.renderList();
        }),
    );
    this.listEl = form.createDiv({ cls: 'dnd5e-builder-list' });
    const add = form.createEl('button', { cls: 'dnd5e-builder-add' });
    setIcon(add.createSpan({ cls: 'dnd5e-builder-icon' }), 'plus');
    add.appendText(t('builder.add'));
    add.addEventListener('click', () => {
      this.deck.cards.push(blank());
      this.current = this.deck.cards.length - 1;
      this.renderList();
      this.listEl.querySelector<HTMLInputElement>('.dnd5e-builder-row:last-child input')?.focus();
    });

    new Setting(form).addButton((button) =>
      button
        .setButtonText(t('builder.create'))
        .setCta()
        .onClick(() => void this.finish()),
    );
    this.renderList();
  }

  onClose(): void {
    this.preview?.unload();
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
      this.nameSet?.(result.deck.name);
    }
    if (result.deck.returns !== undefined) {
      this.deck.returns = result.deck.returns;
      this.returnsSet?.(result.deck.returns);
    }
    this.add(result.deck.cards);
  }

  private source(
    parent: HTMLElement,
    key: string,
    icon: string,
    name: string,
    line: string,
    click: () => void,
  ): void {
    const button = parent.createEl('button', { cls: 'dnd5e-npc-tile' });
    button.dataset.source = key;
    setIcon(button.createDiv({ cls: 'dnd5e-npc-tile-icon' }), icon);
    const text = button.createDiv({ cls: 'dnd5e-npc-tile-text' });
    text.createDiv({ cls: 'dnd5e-npc-tile-name', text: name });
    text.createDiv({ cls: 'dnd5e-npc-tile-line', text: line });
    button.addEventListener('click', click);
  }

  private add(cards: DraftCard[]): void {
    const { t } = this.deps;
    // An untouched first row gives way to the cards brought in.
    const kept = this.deck.cards.filter((c) => c.name.trim() !== '' || c.effect.trim() !== '');
    this.deck.cards = [...kept, ...cards];
    this.current = kept.length;
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
      const row = list.createDiv({
        cls: i === this.current ? ['dnd5e-builder-row', 'is-current'] : 'dnd5e-builder-row',
      });
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
      const effect = fields.createEl('textarea', {
        attr: {
          rows: '2',
          placeholder: t('builder.cardEffect'),
          'aria-label': t('builder.cardEffect'),
        },
      });
      effect.value = card.effect;
      const focus = () => {
        if (this.current === i) return;
        list.querySelector('.is-current')?.removeClass('is-current');
        row.addClass('is-current');
        this.current = i;
        this.drawPreview();
      };
      for (const input of [name, effect]) input.addEventListener('focus', focus);
      name.addEventListener('input', () => {
        card.name = name.value;
        this.drawPreview();
      });
      effect.addEventListener('input', () => {
        card.effect = effect.value;
        this.drawPreview();
      });
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
        this.current = Math.min(this.current, this.deck.cards.length - 1);
        this.renderList();
      });
    });
    this.drawPreview();
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
      this.drawPreview();
    });
  }

  private named(): DraftCard[] {
    return this.deck.cards.filter((c) => c.name.trim() !== '');
  }

  // ── the preview ────────────────────────────────────────────────────────────────────────────

  private drawPreview(): void {
    const { t } = this.deps;
    const n = this.named().length;
    const count = n === 1 ? t('deck.cards.one') : t('deck.cards', { count: n });
    this.countEl.setText(count);
    this.preview?.unload();
    this.preview = new Component();
    this.preview.load();
    this.previewEl.empty();
    const card = this.previewEl.createDiv({ cls: ['dnd5e-npc-card', 'dnd5e-deck-preview'] });
    card.createDiv({ cls: 'dnd5e-npc-card-eyebrow', text: t('npc.preview') });
    const name = this.deck.name.trim();
    card.createDiv({
      cls: name === '' ? ['dnd5e-npc-card-name', 'is-empty'] : 'dnd5e-npc-card-name',
      text: name === '' ? t('builder.unnamed') : name,
    });
    card.createDiv({
      cls: 'dnd5e-npc-card-sub',
      text: `${count} · ${t(this.deck.returns ? 'deck.rules.returns' : 'deck.rules.stays')}`,
    });

    const shown = this.deck.cards[this.current];
    const face = card
      .createDiv({ cls: ['dnd5e-deck-card', 'is-turned', 'dnd5e-builder-face'] })
      .createDiv({ cls: 'dnd5e-deck-card-inner' })
      .createDiv({ cls: 'dnd5e-deck-card-face' });
    face.createDiv({ cls: 'dnd5e-deck-corner', text: String(this.current + 1) });
    face.createDiv({
      cls: 'dnd5e-deck-card-name',
      text: shown === undefined || shown.name.trim() === '' ? '…' : shown.name,
    });
    if (shown !== undefined && ((shown.leaves && this.deck.returns) || shown.ends)) {
      face.createSpan({
        cls: 'dnd5e-deck-badge',
        text: t(shown.ends ? 'deck.ends' : 'deck.leaves'),
      });
    }
    const text = face.createDiv({ cls: ['dnd5e-deck-card-text', 'markdown-rendered'] });
    if (shown !== undefined && shown.effect.trim() !== '') {
      void MarkdownRenderer.render(this.app, shown.effect, text, '', this.preview);
    }
    face.createDiv({ cls: ['dnd5e-deck-corner', 'is-bottom'], text: String(this.current + 1) });

    const tags = card.createDiv({ cls: 'dnd5e-npc-card-tags' });
    for (const c of this.named()) tags.createSpan({ cls: 'dnd5e-npc-card-tag', text: c.name });
    if (n === 0) card.createDiv({ cls: 'dnd5e-npc-card-hint', text: t('builder.previewHint') });
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
