// The Spellbook tab: the 319 SRD spells with a search, level and school chips, filters for class,
// casting time, damage, saving throw, concentration and ritual, a list grouped by level and a card
// for the picked spell, accented by its school. Names and meta follow the dice-text language; the
// card can switch to the other one. The filters are kept in the plugin's data. The GM's own
// `type: spell` notes join the list, marked "own"; links in stat blocks open a spell's card.

import {
  Component,
  debounce,
  ItemView,
  MarkdownRenderer,
  setIcon,
  type WorkspaceLeaf,
} from 'obsidian';

import type { StringKey, T } from '../i18n/strings';
import type { Lang } from '../npc/races';
import {
  type CastingKind,
  filterSpells,
  isFiltered,
  levelCounts,
  NO_FILTERS,
  readFilters,
  type SpellFilters,
} from '../spells/filter';
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
  spellText,
} from '../spells/meta';
import type { School, SrdSpell } from '../spells/model';
import { SRD_SPELLS } from '../spells/srd-spells';

export const SPELLBOOK_VIEW = 'dnd5e-spellbook';

/** Each school in a colour of Obsidian's palette. */
const SCHOOL_HUES: Record<School, string> = {
  abjuration: 'blue',
  conjuration: 'yellow',
  divination: 'cyan',
  enchantment: 'pink',
  evocation: 'red',
  illusion: 'purple',
  necromancy: 'green',
  transmutation: 'orange',
};

const CASTING: readonly CastingKind[] = ['action', 'bonus', 'reaction', 'longer'];

export interface SpellbookState {
  filters: SpellFilters;
  selected: string | null;
}

export interface SpellbookDeps {
  t: T;
  /** The language of names and meta (the dice-text setting). */
  lang: () => Lang;
  state: () => unknown;
  saveState: (state: SpellbookState) => void;
  /** The GM's own `type: spell` notes, and a way to hear when they change. */
  own: () => readonly SrdSpell[];
  onOwnChange: (listener: () => void) => () => void;
  openNote: (path: string) => void;
}

function hue(el: HTMLElement, school: School): void {
  const colour = SCHOOL_HUES[school];
  el.setCssProps({
    '--dnd5e-school': `var(--color-${colour})`,
    '--dnd5e-school-rgb': `var(--color-${colour}-rgb)`,
  });
}

export class SpellbookView extends ItemView {
  private filters: SpellFilters = NO_FILTERS;
  private selected: string | null = null;
  /** The card's language, when the GM switched it away from the list's. */
  private cardLang: Lang | null = null;
  private shown: SrdSpell[] = [];
  private headerEl!: HTMLElement;
  private listEl!: HTMLElement;
  private cardEl!: HTMLElement;
  private cardText: Component | null = null;
  private readonly persist = debounce(
    () => this.deps.saveState({ filters: this.filters, selected: this.selected }),
    400,
    true,
  );

  constructor(
    leaf: WorkspaceLeaf,
    private readonly deps: SpellbookDeps,
  ) {
    super(leaf);
  }

  getViewType(): string {
    return SPELLBOOK_VIEW;
  }

  getDisplayText(): string {
    return this.deps.t('spells.title');
  }

  getIcon(): string {
    return 'book-open';
  }

  /** Every spell: the SRD's and the GM's own. */
  private get spells(): readonly SrdSpell[] {
    const own = this.deps.own();
    return own.length === 0 ? SRD_SPELLS : [...SRD_SPELLS, ...own];
  }

  /** Opens a spell's card (from a link in a stat block). */
  show(index: string): void {
    this.cardLang = null;
    if (!this.shown.some((s) => s.index === index)) this.setFilters(NO_FILTERS);
    this.pick(index, true);
  }

  async onOpen(): Promise<void> {
    this.register(this.deps.onOwnChange(() => this.render()));
    const stored = this.deps.state() as Partial<SpellbookState> | undefined;
    this.filters = readFilters(stored?.filters);
    this.selected = typeof stored?.selected === 'string' ? stored.selected : null;
    this.contentEl.empty();
    this.contentEl.addClass('dnd5e-spells');
    this.headerEl = this.contentEl.createDiv({ cls: 'dnd5e-spells-header' });
    const body = this.contentEl.createDiv({ cls: 'dnd5e-spells-body' });
    this.listEl = body.createDiv({
      cls: 'dnd5e-spells-list',
      attr: { tabindex: '0', role: 'listbox' },
    });
    this.cardEl = body.createDiv({ cls: 'dnd5e-spells-card' });
    this.listEl.addEventListener('keydown', (event) => this.onKey(event));
    this.renderHeader();
    this.render();
    return Promise.resolve();
  }

  async onClose(): Promise<void> {
    this.cardText?.unload();
    this.contentEl.empty();
    return Promise.resolve();
  }

  private get lang(): Lang {
    return this.deps.lang();
  }

  private name = (spell: SrdSpell) => spellName(spell, this.lang);

  private setFilters(change: Partial<SpellFilters>): void {
    this.filters = { ...this.filters, ...change };
    this.persist();
    this.renderHeader();
    this.render();
  }

  // ── header: search, chips, filters ─────────────────────────────────────────────────────────

  private renderHeader(): void {
    const { t } = this.deps;
    const header = this.headerEl;
    const focused = header.querySelector('input')?.matches(':focus') === true;
    header.empty();

    const top = header.createDiv({ cls: 'dnd5e-spells-top' });
    const search = top.createDiv({ cls: 'dnd5e-spells-search' });
    setIcon(search.createSpan({ cls: 'dnd5e-spells-search-icon' }), 'search');
    const input = search.createEl('input', {
      attr: { type: 'search', placeholder: t('spells.search') },
    });
    input.value = this.filters.query;
    input.addEventListener('input', () => {
      this.filters = { ...this.filters, query: input.value };
      this.persist();
      this.render();
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.listEl.focus();
        this.move(0);
      }
    });
    if (focused) input.focus();
    top.createDiv({ cls: 'dnd5e-spells-count' });
    if (isFiltered(this.filters)) {
      const reset = top.createEl('button', {
        cls: 'clickable-icon',
        attr: { 'aria-label': t('spells.reset') },
      });
      setIcon(reset, 'rotate-ccw');
      reset.addEventListener('click', () => this.setFilters(NO_FILTERS));
    }

    const levels = header.createDiv({ cls: ['dnd5e-spells-chips', 'is-levels'] });
    for (let level = 0; level <= 9; level++) {
      const chip = this.chip(
        levels,
        levelLabel(level, this.lang),
        this.filters.levels.includes(level),
      );
      chip.dataset.level = String(level);
      chip.createSpan({ cls: 'dnd5e-spells-chip-count' });
      chip.addEventListener('click', () =>
        this.setFilters({ levels: toggle(this.filters.levels, level) }),
      );
    }

    const schools = header.createDiv({ cls: 'dnd5e-spells-chips' });
    for (const school of SCHOOLS) {
      const chip = this.chip(
        schools,
        label(school, this.lang),
        this.filters.schools.includes(school),
      );
      chip.addClass('has-school');
      hue(chip, school);
      chip.prepend(chip.createSpan({ cls: 'dnd5e-spells-dot' }));
      chip.addEventListener('click', () =>
        this.setFilters({ schools: toggle(this.filters.schools, school) }),
      );
    }

    const more = header.createDiv({ cls: 'dnd5e-spells-filters' });
    this.select(
      more,
      'spells.class',
      SPELL_CLASSES,
      this.filters.classes,
      (v) => label(v, this.lang),
      (v) => this.setFilters({ classes: v === null ? [] : [v] }),
    );
    this.select(
      more,
      'spells.casting',
      CASTING,
      this.filters.casting,
      (v) => t(`spells.casting.${v}`),
      (v) => this.setFilters({ casting: v === null ? [] : [v] }),
    );
    this.select(
      more,
      'spells.damage',
      DAMAGE_TYPES,
      this.filters.damage,
      (v) => label(v, this.lang),
      (v) => this.setFilters({ damage: v === null ? [] : [v] }),
    );
    this.select(
      more,
      'spells.save',
      ABILITIES,
      this.filters.saves,
      (v) => label(v, this.lang),
      (v) => this.setFilters({ saves: v === null ? [] : [v] }),
    );
    const concentration = more.createEl('select', {
      cls: 'dropdown',
      attr: { 'aria-label': t('spells.concentration') },
    });
    for (const [value, key] of [
      ['any', 'spells.concentration'],
      ['only', 'spells.concentration.only'],
      ['none', 'spells.concentration.none'],
    ] as const) {
      concentration.createEl('option', { text: t(key), attr: { value } });
    }
    concentration.value = this.filters.concentration;
    concentration.addEventListener('change', () =>
      this.setFilters({ concentration: concentration.value as SpellFilters['concentration'] }),
    );
    const ritual = this.chip(more, t('spells.ritual'), this.filters.ritual);
    ritual.addEventListener('click', () => this.setFilters({ ritual: !this.filters.ritual }));
  }

  private chip(parent: HTMLElement, text: string, on: boolean): HTMLElement {
    const chip = parent.createEl('button', {
      cls: on ? ['dnd5e-spells-chip', 'is-active'] : 'dnd5e-spells-chip',
      attr: { 'aria-pressed': String(on) },
    });
    chip.createSpan({ text });
    return chip;
  }

  /** A dropdown over one filter group: "Class: Any", then each value. */
  private select<V extends string>(
    parent: HTMLElement,
    name: StringKey,
    values: readonly V[],
    chosen: readonly V[],
    text: (v: V) => string,
    pick: (v: V | null) => void,
  ): void {
    const { t } = this.deps;
    const select = parent.createEl('select', { cls: 'dropdown', attr: { 'aria-label': t(name) } });
    select.createEl('option', { text: `${t(name)}: ${t('spells.any')}`, attr: { value: '' } });
    for (const value of values) select.createEl('option', { text: text(value), attr: { value } });
    select.value = chosen[0] ?? '';
    select.toggleClass('is-active', chosen.length > 0);
    select.addEventListener('change', () => pick(select.value === '' ? null : (select.value as V)));
  }

  /** The match count and the level chips' counts, which follow every keystroke. */
  private renderCounts(): void {
    const { t } = this.deps;
    const count = this.headerEl.querySelector('.dnd5e-spells-count');
    count?.setText(
      this.shown.length === 1
        ? t('spells.count.one')
        : t('spells.count', { count: this.shown.length }),
    );
    const counts = levelCounts(this.spells, this.filters);
    this.headerEl.querySelectorAll<HTMLElement>('[data-level]').forEach((chip) => {
      const n = counts[Number(chip.dataset.level)] ?? 0;
      chip.querySelector('.dnd5e-spells-chip-count')?.setText(String(n));
      chip.toggleClass('is-empty', n === 0);
    });
  }

  // ── list ───────────────────────────────────────────────────────────────────────────────────

  private render(): void {
    this.shown = filterSpells(this.spells, this.filters, this.name);
    const list = this.listEl;
    list.empty();
    if (this.shown.length === 0) {
      list.createDiv({ cls: 'dnd5e-spells-empty', text: this.deps.t('spells.none') });
    }
    let level = -1;
    for (const spell of this.shown) {
      if (spell.level !== level) {
        level = spell.level;
        const n = this.shown.filter((s) => s.level === level).length;
        const heading = list.createDiv({ cls: 'dnd5e-spells-level' });
        heading.createSpan({ text: levelLabel(level, this.lang) });
        heading.createSpan({ cls: 'dnd5e-spells-level-count', text: String(n) });
      }
      this.renderRow(list, spell);
    }
    this.renderCounts();
    this.renderCard();
  }

  private renderRow(list: HTMLElement, spell: SrdSpell): void {
    const row = list.createDiv({
      cls: spell.index === this.selected ? ['dnd5e-spells-row', 'is-selected'] : 'dnd5e-spells-row',
      attr: { role: 'option', 'aria-selected': String(spell.index === this.selected) },
    });
    row.dataset.spell = spell.index;
    hue(row, spell.school);
    const main = row.createDiv({ cls: 'dnd5e-spells-row-main' });
    main.createDiv({ cls: 'dnd5e-spells-row-name', text: this.name(spell) });
    main.createDiv({
      cls: 'dnd5e-spells-row-meta',
      text: [
        label(spell.school, this.lang),
        castingTime(spell, this.lang),
        range(spell, this.lang),
      ].join(' · '),
    });
    const marks = row.createDiv({ cls: 'dnd5e-spells-marks' });
    if (spell.concentration) {
      marks.createSpan({
        cls: 'dnd5e-spells-mark',
        text: this.lang === 'de' ? 'K' : 'C',
        attr: { 'aria-label': this.deps.t('spells.concentration') },
      });
    }
    if (spell.ritual) {
      marks.createSpan({
        cls: 'dnd5e-spells-mark',
        text: 'R',
        attr: { 'aria-label': this.deps.t('spells.ritual') },
      });
    }
    if (spell.path !== undefined) {
      marks.createSpan({ cls: ['dnd5e-spells-mark', 'is-own'], text: this.deps.t('spells.own') });
    }
    row.addEventListener('click', () => this.pick(spell.index, true));
  }

  private pick(index: string, open: boolean): void {
    this.selected = index;
    this.persist();
    for (const row of Array.from(this.listEl.querySelectorAll<HTMLElement>('.dnd5e-spells-row'))) {
      const on = row.dataset.spell === index;
      row.toggleClass('is-selected', on);
      row.setAttr('aria-selected', String(on));
      if (on) row.scrollIntoView({ block: 'nearest' });
    }
    if (open) this.contentEl.addClass('is-card-open');
    this.renderCard();
  }

  /** ↑ ↓ move through the list, Enter opens the card (on narrow tabs it replaces the list). */
  private onKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.move(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Enter' && this.selected !== null) {
      this.pick(this.selected, true);
    }
  }

  private move(step: number): void {
    if (this.shown.length === 0) return;
    const at = this.shown.findIndex((s) => s.index === this.selected);
    const next = at === -1 ? 0 : Math.min(this.shown.length - 1, Math.max(0, at + step));
    const spell = this.shown[next];
    if (spell !== undefined) this.pick(spell.index, false);
  }

  // ── card ───────────────────────────────────────────────────────────────────────────────────

  private renderCard(): void {
    const { t } = this.deps;
    const card = this.cardEl;
    this.cardText?.unload();
    this.cardText = null;
    card.empty();
    const spell = this.spells.find((s) => s.index === this.selected);
    if (spell === undefined) {
      const empty = card.createDiv({ cls: 'dnd5e-spells-pick' });
      setIcon(empty.createDiv({ cls: 'dnd5e-spells-pick-icon' }), 'book-open');
      empty.createDiv({ text: t('spells.pick') });
      return;
    }
    const lang = this.cardLang ?? this.lang;
    const other: Lang = lang === 'de' ? 'en' : 'de';
    hue(card, spell.school);

    const bar = card.createDiv({ cls: 'dnd5e-spells-card-bar' });
    const back = bar.createEl('button', {
      cls: ['clickable-icon', 'dnd5e-spells-back'],
      attr: { 'aria-label': t('spells.back') },
    });
    setIcon(back, 'arrow-left');
    back.addEventListener('click', () => {
      this.contentEl.removeClass('is-card-open');
      this.listEl.focus();
    });
    bar.createSpan({ cls: 'dnd5e-spells-school', text: label(spell.school, lang) });
    bar.createDiv({ cls: 'dnd5e-spells-spacer' });
    const path = spell.path;
    if (path !== undefined) {
      const note = bar.createEl('button', {
        cls: ['clickable-icon', 'dnd5e-spells-note'],
        attr: { 'aria-label': t('spells.openNote') },
      });
      setIcon(note, 'file-text');
      note.addEventListener('click', () => this.deps.openNote(path));
    }
    const langs = bar.createDiv({ cls: 'dnd5e-world-segmented' });
    for (const l of ['en', 'de'] as const) {
      const button = langs.createEl('button', {
        cls: l === lang ? 'is-active' : '',
        text: l.toUpperCase(),
      });
      button.addEventListener('click', () => {
        this.cardLang = l === this.lang ? null : l;
        this.renderCard();
      });
    }

    card.createDiv({ cls: 'dnd5e-spells-card-name', text: spellName(spell, lang) });
    const otherName = spellName(spell, other);
    if (otherName !== spellName(spell, lang)) {
      card.createDiv({ cls: 'dnd5e-spells-card-other', text: otherName });
    }
    card.createDiv({ cls: 'dnd5e-spells-card-level', text: levelLine(spell, lang) });

    const grid = card.createDiv({ cls: 'dnd5e-spells-grid' });
    const cell = (key: StringKey, value: string) => {
      const c = grid.createDiv();
      c.createDiv({ cls: 'dnd5e-spells-grid-label', text: t(key) });
      c.createDiv({ cls: 'dnd5e-spells-grid-value', text: value });
    };
    cell('spells.castingTime', castingTime(spell, lang));
    cell('spells.range', range(spell, lang));
    cell('spells.components', components(spell, lang));
    cell('spells.duration', duration(spell, lang));
    const words = spellText(spell, lang);
    if (words.material !== '') {
      card.createDiv({
        cls: 'dnd5e-spells-material',
        text: t('spells.material', { material: words.material }),
      });
    }

    const badges = card.createDiv({ cls: 'dnd5e-spells-badges' });
    for (const damage of spell.damage)
      badges.createSpan({ cls: 'dnd5e-spells-badge', text: label(damage, lang) });
    if (spell.save !== null) {
      badges.createSpan({
        cls: 'dnd5e-spells-badge',
        text: t('spells.saveBadge', { ability: label(spell.save, lang) }),
      });
    }
    if (spell.attack !== null) {
      badges.createSpan({ cls: 'dnd5e-spells-badge', text: t(`spells.attack.${spell.attack}`) });
    }
    if (spell.concentration)
      badges.createSpan({ cls: 'dnd5e-spells-badge', text: t('spells.concentration') });
    if (spell.ritual) badges.createSpan({ cls: 'dnd5e-spells-badge', text: t('spells.ritual') });
    if (badges.childElementCount === 0) badges.remove();

    this.cardText = new Component();
    this.cardText.load();
    const text = card.createDiv({ cls: ['dnd5e-spells-text', 'markdown-rendered'] });
    const source = spell.path ?? '';
    void MarkdownRenderer.render(this.app, words.text, text, source, this.cardText);
    if (words.higher !== '') {
      card.createDiv({ cls: 'dnd5e-spells-section', text: t('spells.higher') });
      const higher = card.createDiv({ cls: ['dnd5e-spells-text', 'markdown-rendered'] });
      void MarkdownRenderer.render(this.app, words.higher, higher, source, this.cardText);
    }

    card.createDiv({ cls: 'dnd5e-spells-section', text: t('spells.classes') });
    const classes = card.createDiv({ cls: 'dnd5e-spells-classes' });
    for (const c of spell.classes)
      classes.createSpan({ cls: 'dnd5e-spells-tag', text: label(c, lang) });
    card.createDiv({
      cls: 'dnd5e-spells-source',
      text:
        spell.path === undefined ? t('spells.source') : t('spells.ownSource', { path: spell.path }),
    });
  }
}

function toggle<V>(list: readonly V[], value: V): V[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
