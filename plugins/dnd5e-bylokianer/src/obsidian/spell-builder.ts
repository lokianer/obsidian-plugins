// The spell builder, built like the New NPC dialog: on the left the form — an SRD spell to start
// from as tiles with a search, level and school as chips and tiles, the meta as Obsidian settings,
// components, classes and damage as chips, the description — and on the right a live preview of
// the spell card in its school's colour. A JSON file can fill the form too. It hands the finished
// spell over to be written as a `type: spell` note; it never rewrites a note.

import { type App, Component, MarkdownRenderer, Modal, Notice, setIcon, Setting } from 'obsidian';

import type { T } from '../i18n/strings';
import type { Lang } from '../npc/races';
import { draftFromSpell, emptyDraft, parseSpellJson, type SpellDraft } from '../spells/draft';
import { filterSpells, NO_FILTERS } from '../spells/filter';
import {
  ABILITIES,
  castingTime,
  components,
  DAMAGE_TYPES,
  duration,
  label,
  levelLabel,
  levelLine,
  range,
  SCHOOLS,
  SPELL_CLASSES,
  spellName,
} from '../spells/meta';
import type { School, SrdSpell } from '../spells/model';
import { hue } from './spellbook-view';

/** How many SRD spells the start-from tiles show at once. */
const TILES = 24;

/** A Lucide icon per school, for its tile. */
const SCHOOL_ICONS: Record<School, string> = {
  abjuration: 'shield',
  conjuration: 'sparkles',
  divination: 'eye',
  enchantment: 'heart',
  evocation: 'flame',
  illusion: 'ghost',
  necromancy: 'skull',
  transmutation: 'shuffle',
};

export interface SpellBuilderDeps {
  t: T;
  lang: Lang;
  /** The spells to start from. */
  spells: readonly SrdSpell[];
  /** Writes the spell; the dialog closes once it is written. */
  create: (draft: SpellDraft) => Promise<void>;
}

export class SpellBuilderModal extends Modal {
  private draft: SpellDraft = emptyDraft();
  private query = '';
  private formEl!: HTMLElement;
  private previewEl!: HTMLElement;
  private preview: Component | null = null;

  constructor(
    app: App,
    private readonly deps: SpellBuilderDeps,
  ) {
    super(app);
  }

  onOpen(): void {
    const { t } = this.deps;
    this.setTitle(t('spellBuilder.title'));
    this.modalEl.addClass('dnd5e-npc-modal', 'dnd5e-npc-dialog');
    const el = this.contentEl;
    el.addClass('dnd5e-spell-builder');

    const top = el.createDiv({ cls: 'dnd5e-npc-top' });
    const json = top.createEl('button', { cls: 'dnd5e-builder-import' });
    setIcon(json.createSpan(), 'file-json');
    json.createSpan({ text: t('builder.json') });
    const file = top.createEl('input', {
      cls: 'dnd5e-builder-file',
      attr: { type: 'file', accept: '.json,application/json' },
    });
    json.addEventListener('click', () => file.click());
    file.addEventListener('change', () => {
      const chosen = file.files?.[0];
      if (chosen !== undefined) void chosen.text().then((text) => this.importJson(text));
      file.value = '';
    });

    const body = el.createDiv({ cls: 'dnd5e-npc-body' });
    this.formEl = body.createDiv({ cls: 'dnd5e-npc-form' });
    this.previewEl = body.createDiv({ cls: 'dnd5e-npc-preview' });
    this.renderForm();
  }

  onClose(): void {
    this.preview?.unload();
    this.contentEl.empty();
  }

  /** Fills the form from an SRD spell, its words in the GM's language. */
  copy(spell: SrdSpell): void {
    this.draft = draftFromSpell(spell, this.deps.lang);
    this.renderForm();
  }

  importJson(text: string): void {
    const result = parseSpellJson(text);
    if (!result.ok) {
      new Notice(this.deps.t(`spellBuilder.json.${result.reason}`));
      return;
    }
    this.draft = result.draft;
    this.renderForm();
  }

  // ── the form ───────────────────────────────────────────────────────────────────────────────

  private renderForm(): void {
    const { t, lang } = this.deps;
    const d = this.draft;
    const form = this.formEl;
    form.empty();

    new Setting(form).setName(t('spellBuilder.from')).setHeading();
    const picker = form.createDiv({ cls: 'dnd5e-npc-picker' });
    const search = picker.createEl('input', {
      cls: 'dnd5e-npc-search',
      attr: { type: 'search', placeholder: t('spellBuilder.copyPlaceholder') },
    });
    search.value = this.query;
    const tiles = picker.createDiv({ cls: ['dnd5e-npc-tiles', 'dnd5e-spell-tiles'] });
    search.addEventListener('input', () => {
      this.query = search.value;
      this.drawTiles(tiles);
    });
    this.drawTiles(tiles);

    new Setting(form).setName(t('spellBuilder.spell')).setHeading();
    this.text(form, t('builder.name'), d.name, (v) => (d.name = v), 'dnd5e-spell-name');
    const levels = this.row(form, t('spellBuilder.level'));
    for (let level = 0; level <= 9; level++) {
      this.chip(levels, levelLabel(level, lang), d.level === level, () => {
        d.level = level;
        this.renderForm();
      });
    }
    const schools = form.createDiv({ cls: ['dnd5e-npc-tiles', 'dnd5e-spell-schools'] });
    for (const school of SCHOOLS) {
      const tile = this.tile(
        schools,
        SCHOOL_ICONS[school],
        label(school, lang),
        '',
        d.school === school,
        () => {
          d.school = school;
          this.renderForm();
        },
      );
      hue(tile, school);
      tile.addClass('has-school');
    }

    new Setting(form).setName(t('spellBuilder.casting')).setHeading();
    this.text(form, t('spells.castingTime'), d.casting, (v) => (d.casting = v));
    this.text(form, t('spells.range'), d.range, (v) => (d.range = v));
    this.text(form, t('spells.duration'), d.duration, (v) => (d.duration = v));
    const comps = this.row(form, t('spells.components'));
    for (const c of ['V', 'S', 'M'] as const) {
      this.toggleChip(
        comps,
        lang === 'de' && c === 'S' ? 'G' : c,
        d.components as ('V' | 'S' | 'M')[],
        c,
      );
    }
    this.text(form, t('spellBuilder.material'), d.material, (v) => (d.material = v));
    for (const key of ['concentration', 'ritual'] as const) {
      new Setting(form).setName(t(`spells.${key}`)).addToggle((toggle) =>
        toggle.setValue(d[key]).onChange((value) => {
          d[key] = value;
          this.drawPreview();
        }),
      );
    }

    new Setting(form).setName(t('spellBuilder.rules')).setHeading();
    const classes = this.row(form, t('spells.classes'));
    for (const c of SPELL_CLASSES)
      this.toggleChip(classes, label(c, lang), d.classes as string[], c);
    const damage = this.row(form, t('spells.damage'));
    for (const c of DAMAGE_TYPES) this.toggleChip(damage, label(c, lang), d.damage as string[], c);
    new Setting(form).setName(t('spells.save')).addDropdown((dropdown) => {
      dropdown.addOption('', t('spellBuilder.none'));
      for (const a of ABILITIES) dropdown.addOption(a, label(a, lang));
      dropdown.setValue(d.save ?? '').onChange((value) => {
        d.save = ABILITIES.find((a) => a === value) ?? null;
        this.drawPreview();
      });
    });
    new Setting(form).setName(t('spellBuilder.attack')).addDropdown((dropdown) => {
      dropdown.addOption('', t('spellBuilder.none'));
      dropdown.addOption('melee', t('spells.attack.melee'));
      dropdown.addOption('ranged', t('spells.attack.ranged'));
      dropdown.setValue(d.attack ?? '').onChange((value) => {
        d.attack = value === 'melee' || value === 'ranged' ? value : null;
        this.drawPreview();
      });
    });

    new Setting(form).setName(t('spellBuilder.text')).setHeading();
    this.area(form, t('spellBuilder.textHint'), d.text, (v) => (d.text = v), 8, 'dnd5e-spell-text');
    this.area(form, t('spells.higher'), d.higher, (v) => (d.higher = v), 3, 'dnd5e-spell-higher');

    new Setting(form).addButton((button) =>
      button
        .setButtonText(t('spellBuilder.create'))
        .setCta()
        .onClick(() => void this.finish()),
    );
    this.drawPreview();
  }

  private drawTiles(parent: HTMLElement): void {
    const { lang } = this.deps;
    parent.empty();
    const found = filterSpells(this.deps.spells, { ...NO_FILTERS, query: this.query }, (s) =>
      spellName(s, lang),
    ).slice(0, TILES);
    for (const spell of found) {
      const tile = this.tile(
        parent,
        SCHOOL_ICONS[spell.school],
        spellName(spell, lang),
        `${levelLabel(spell.level, lang)} · ${label(spell.school, lang)}`,
        false,
        () => this.copy(spell),
      );
      hue(tile, spell.school);
      tile.addClass('has-school');
    }
  }

  private text(
    el: HTMLElement,
    name: string,
    value: string,
    set: (v: string) => void,
    cls = '',
  ): void {
    new Setting(el).setName(name).addText((text) => {
      text.setValue(value).onChange((v) => {
        set(v);
        this.drawPreview();
      });
      if (cls !== '') text.inputEl.addClass(cls);
    });
  }

  private area(
    el: HTMLElement,
    name: string,
    value: string,
    set: (v: string) => void,
    rows: number,
    cls: string,
  ): void {
    const wrap = el.createDiv({ cls: 'dnd5e-builder-area' });
    wrap.createDiv({ cls: 'dnd5e-builder-label', text: name });
    const area = wrap.createEl('textarea', { cls, attr: { rows: String(rows) } });
    area.value = value;
    area.addEventListener('input', () => {
      set(area.value);
      this.drawPreview();
    });
  }

  /** A labelled row of chips. */
  private row(el: HTMLElement, name: string): HTMLElement {
    const wrap = el.createDiv({ cls: 'dnd5e-builder-row-chips' });
    wrap.createDiv({ cls: 'dnd5e-builder-label', text: name });
    return wrap.createDiv({ cls: 'dnd5e-builder-flags' });
  }

  private chip(parent: HTMLElement, text: string, on: boolean, click: () => void): HTMLElement {
    const chip = parent.createEl('button', {
      cls: on ? ['dnd5e-builder-flag', 'is-active'] : 'dnd5e-builder-flag',
      text,
      attr: { 'aria-pressed': String(on) },
    });
    chip.addEventListener('click', click);
    return chip;
  }

  /** A chip that adds `value` to `list` or takes it out. */
  private toggleChip<V extends string>(
    parent: HTMLElement,
    text: string,
    list: V[],
    value: V,
  ): void {
    const chip = this.chip(parent, text, list.includes(value), () => {
      const at = list.indexOf(value);
      if (at === -1) list.push(value);
      else list.splice(at, 1);
      chip.toggleClass('is-active', at === -1);
      chip.setAttr('aria-pressed', String(at === -1));
      this.drawPreview();
    });
    chip.dataset.value = value;
  }

  private tile(
    parent: HTMLElement,
    icon: string,
    name: string,
    line: string,
    selected: boolean,
    click: () => void,
  ): HTMLElement {
    const button = parent.createEl('button', {
      cls: selected ? ['dnd5e-npc-tile', 'is-selected'] : 'dnd5e-npc-tile',
      attr: { 'aria-pressed': String(selected) },
    });
    setIcon(button.createDiv({ cls: 'dnd5e-npc-tile-icon' }), icon);
    const text = button.createDiv({ cls: 'dnd5e-npc-tile-text' });
    text.createDiv({ cls: 'dnd5e-npc-tile-name', text: name });
    if (line !== '') text.createDiv({ cls: 'dnd5e-npc-tile-line', text: line });
    button.addEventListener('click', click);
    return button;
  }

  // ── the preview ────────────────────────────────────────────────────────────────────────────

  private drawPreview(): void {
    const { t, lang } = this.deps;
    const d = this.draft;
    const spell: SrdSpell = { ...d, index: 'preview' };
    this.preview?.unload();
    this.preview = new Component();
    this.preview.load();
    this.previewEl.empty();
    const card = this.previewEl.createDiv({ cls: ['dnd5e-npc-card', 'dnd5e-spell-preview'] });
    hue(card, d.school);
    card.createDiv({ cls: 'dnd5e-npc-card-eyebrow', text: t('npc.preview') });
    card.createDiv({
      cls: d.name.trim() === '' ? ['dnd5e-npc-card-name', 'is-empty'] : 'dnd5e-npc-card-name',
      text: d.name.trim() === '' ? t('spellBuilder.unnamed') : d.name,
    });
    card.createDiv({ cls: 'dnd5e-npc-card-sub', text: levelLine(spell, lang) });
    const grid = card.createDiv({ cls: 'dnd5e-spells-grid' });
    const cell = (
      key: 'spells.castingTime' | 'spells.range' | 'spells.components' | 'spells.duration',
      value: string,
    ) => {
      const c = grid.createDiv();
      c.createDiv({ cls: 'dnd5e-spells-grid-label', text: t(key) });
      c.createDiv({ cls: 'dnd5e-spells-grid-value', text: value === '' ? '—' : value });
    };
    cell('spells.castingTime', castingTime(spell, lang));
    cell('spells.range', range(spell, lang));
    cell('spells.components', components(spell, lang));
    cell('spells.duration', duration(spell, lang));
    if (d.components.includes('M') && d.material.trim() !== '') {
      card.createDiv({
        cls: 'dnd5e-npc-card-sub',
        text: t('spells.material', { material: d.material }),
      });
    }
    const tags = card.createDiv({ cls: 'dnd5e-npc-card-tags' });
    for (const damage of d.damage)
      tags.createSpan({ cls: 'dnd5e-npc-card-tag', text: label(damage, lang) });
    if (d.save !== null) {
      tags.createSpan({
        cls: 'dnd5e-npc-card-tag',
        text: t('spells.saveBadge', { ability: label(d.save, lang) }),
      });
    }
    if (d.attack !== null)
      tags.createSpan({ cls: 'dnd5e-npc-card-tag', text: t(`spells.attack.${d.attack}`) });
    if (d.concentration)
      tags.createSpan({ cls: 'dnd5e-npc-card-tag', text: t('spells.concentration') });
    for (const c of d.classes) tags.createSpan({ cls: 'dnd5e-npc-card-tag', text: label(c, lang) });
    if (d.text.trim() === '') {
      card.createDiv({ cls: 'dnd5e-npc-card-hint', text: t('spellBuilder.previewHint') });
      return;
    }
    const text = card.createDiv({ cls: ['dnd5e-spells-text', 'markdown-rendered'] });
    void MarkdownRenderer.render(this.app, d.text, text, '', this.preview);
    if (d.higher.trim() !== '') {
      card.createDiv({ cls: 'dnd5e-npc-card-label', text: t('spells.higher') });
      const higher = card.createDiv({ cls: ['dnd5e-spells-text', 'markdown-rendered'] });
      void MarkdownRenderer.render(this.app, d.higher, higher, '', this.preview);
    }
  }

  private async finish(): Promise<void> {
    if (this.draft.name.trim() === '') {
      new Notice(this.deps.t('spellBuilder.noName'));
      return;
    }
    await this.deps.create(this.draft);
    this.close();
  }
}
