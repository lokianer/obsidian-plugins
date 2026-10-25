// The Monster Manual tab: the 334 SRD monsters, built like the spellbook — a search, challenge
// rating bands and type chips, size and movement dropdowns, Legendary and Spellcaster chips, a list
// grouped by challenge rating, and the stat block as the card, in the type's colour. Names and
// meta follow the dice-text language; the card can switch to the other one. From the card a
// monster goes into the last note or into a note of its own. The GM's own `type: monster` notes
// join the list, marked "own"; + opens the monster builder. The filters are kept.

import {
  Component,
  debounce,
  ItemView,
  MarkdownRenderer,
  parseYaml,
  setIcon,
  type WorkspaceLeaf,
} from 'obsidian';

import { createT, type StringKey, type T } from '../i18n/strings';
import {
  type Band,
  BANDS,
  bandCounts,
  bandLabel,
  filterMonsters,
  isFiltered,
  type MonsterFilters,
  NO_FILTERS,
  readFilters,
} from '../monsters/filter';
import {
  germanBlock,
  monsterName,
  MOVES,
  SIZES,
  sizeLabel,
  TYPES,
  typeLabel,
} from '../monsters/meta';
import type { SrdMonster } from '../monsters/model';
import { SRD_MONSTERS } from '../monsters/srd-monsters';
import type { Lang } from '../npc/races';
import { parseStatblock } from '../npc/statblock';
import { renderStatblock } from './statblock-view';

export const MONSTER_VIEW = 'dnd5e-monster-manual';

/** Each type in a colour of Obsidian's palette. */
const TYPE_HUES: Record<string, string> = {
  aberration: 'purple',
  beast: 'green',
  celestial: 'yellow',
  construct: 'cyan',
  dragon: 'red',
  elemental: 'orange',
  fey: 'pink',
  fiend: 'red',
  giant: 'orange',
  humanoid: 'blue',
  monstrosity: 'purple',
  ooze: 'green',
  plant: 'green',
  swarm: 'yellow',
  undead: 'cyan',
};

export interface MonsterManualState {
  filters: MonsterFilters;
  selected: string | null;
}

export interface MonsterManualDeps {
  t: T;
  /** The language of names and meta (the dice-text setting). */
  lang: () => Lang;
  state: () => unknown;
  saveState: (state: MonsterManualState) => void;
  /** Links the spell names of a rendered Spellcasting entry to the spellbook. */
  spells?: (el: HTMLElement) => void;
  /** Puts a stat block into the last note, below its cursor. */
  insert: (monster: SrdMonster) => void;
  /** Writes a note of its own for the monster. */
  makeNote: (monster: SrdMonster) => void;
  /** The GM's own `type: monster` notes, and a way to hear when they change. */
  own: () => readonly SrdMonster[];
  onOwnChange: (listener: () => void) => () => void;
  openNote: (path: string) => void;
  /** Opens the monster builder. */
  newMonster: () => void;
  /** Puts the monster into the battle tracker's running fight. */
  addToCombat: (monster: SrdMonster) => void;
  /** Puts the monster into an encounter note. */
  addToEncounter: (monster: SrdMonster) => void;
}

function hue(el: HTMLElement, type: string): void {
  const colour = TYPE_HUES[type] ?? 'blue';
  el.setCssProps({
    '--dnd5e-school': `var(--color-${colour})`,
    '--dnd5e-school-rgb': `var(--color-${colour}-rgb)`,
  });
}

export class MonsterManualView extends ItemView {
  private filters: MonsterFilters = NO_FILTERS;
  private selected: string | null = null;
  /** The card's language, when the GM switched it away from the list's. */
  private cardLang: Lang | null = null;
  private shown: SrdMonster[] = [];
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
    private readonly deps: MonsterManualDeps,
  ) {
    super(leaf);
  }

  getViewType(): string {
    return MONSTER_VIEW;
  }

  getDisplayText(): string {
    return this.deps.t('monsters.title');
  }

  getIcon(): string {
    return 'skull';
  }

  /** Every monster: the SRD's and the GM's own. */
  private get monsters(): readonly SrdMonster[] {
    const own = this.deps.own();
    return own.length === 0 ? SRD_MONSTERS : [...SRD_MONSTERS, ...own];
  }

  /** Opens a monster's card (one just built, say), clearing filters that would hide it. */
  show(index: string): void {
    this.cardLang = null;
    if (!this.shown.some((m) => m.index === index)) this.setFilters(NO_FILTERS);
    this.pick(index, true);
  }

  async onOpen(): Promise<void> {
    this.register(this.deps.onOwnChange(() => this.render()));
    const stored = this.deps.state() as Partial<MonsterManualState> | undefined;
    this.filters = readFilters(stored?.filters);
    this.selected = typeof stored?.selected === 'string' ? stored.selected : null;
    this.contentEl.empty();
    this.contentEl.addClass('dnd5e-spells', 'dnd5e-monsters');
    this.headerEl = this.contentEl.createDiv({ cls: 'dnd5e-spells-header' });
    const body = this.contentEl.createDiv({ cls: 'dnd5e-spells-body' });
    this.listEl = body.createDiv({
      cls: 'dnd5e-spells-list',
      attr: { tabindex: '0', role: 'listbox' },
    });
    this.cardEl = body.createDiv({ cls: ['dnd5e-spells-card', 'dnd5e-monsters-card'] });
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

  private name = (m: SrdMonster) => monsterName(m, this.lang);

  private setFilters(change: Partial<MonsterFilters>): void {
    this.filters = { ...this.filters, ...change };
    this.persist();
    this.renderHeader();
    this.render();
  }

  // ── header ─────────────────────────────────────────────────────────────────────────────────

  private renderHeader(): void {
    const { t } = this.deps;
    const header = this.headerEl;
    const focused = header.querySelector('input')?.matches(':focus') === true;
    header.empty();

    const top = header.createDiv({ cls: 'dnd5e-spells-top' });
    const search = top.createDiv({ cls: 'dnd5e-spells-search' });
    setIcon(search.createSpan({ cls: 'dnd5e-spells-search-icon' }), 'search');
    const input = search.createEl('input', {
      attr: { type: 'search', placeholder: t('monsters.search') },
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
    const add = top.createEl('button', {
      cls: ['clickable-icon', 'dnd5e-monsters-new'],
      attr: { 'aria-label': t('monsters.new') },
    });
    setIcon(add, 'plus');
    add.addEventListener('click', () => this.deps.newMonster());
    if (isFiltered(this.filters)) {
      const reset = top.createEl('button', {
        cls: 'clickable-icon',
        attr: { 'aria-label': t('spells.reset') },
      });
      setIcon(reset, 'rotate-ccw');
      reset.addEventListener('click', () => this.setFilters(NO_FILTERS));
    }

    const bands = header.createDiv({ cls: ['dnd5e-spells-chips', 'is-levels'] });
    for (const band of BANDS) {
      const chip = this.chip(
        bands,
        t('monsters.band', { cr: bandLabel(band) }),
        this.filters.bands.includes(band),
      );
      chip.dataset.band = band;
      chip.createSpan({ cls: 'dnd5e-spells-chip-count' });
      chip.addEventListener('click', () =>
        this.setFilters({ bands: toggle(this.filters.bands, band) }),
      );
    }

    const types = header.createDiv({ cls: 'dnd5e-spells-chips' });
    for (const type of TYPES) {
      const chip = this.chip(types, typeLabel(type, this.lang), this.filters.types.includes(type));
      chip.addClass('has-school');
      chip.dataset.type = type;
      hue(chip, type);
      chip.prepend(chip.createSpan({ cls: 'dnd5e-spells-dot' }));
      chip.addEventListener('click', () =>
        this.setFilters({ types: toggle(this.filters.types, type) }),
      );
    }

    const more = header.createDiv({ cls: 'dnd5e-spells-filters' });
    this.select(
      more,
      'monsters.size',
      SIZES,
      this.filters.sizes,
      (v) => sizeLabel(v, this.lang),
      (v) => this.setFilters({ sizes: v === null ? [] : [v] }),
    );
    this.select(
      more,
      'monsters.movement',
      MOVES,
      this.filters.moves,
      (v) => t(`monsters.moves.${v}`),
      (v) => this.setFilters({ moves: v === null ? [] : [v] }),
    );
    const legendary = this.chip(more, t('monsters.legendary'), this.filters.legendary);
    legendary.addEventListener('click', () =>
      this.setFilters({ legendary: !this.filters.legendary }),
    );
    const caster = this.chip(more, t('monsters.spellcaster'), this.filters.spellcaster);
    caster.addEventListener('click', () =>
      this.setFilters({ spellcaster: !this.filters.spellcaster }),
    );
  }

  private chip(parent: HTMLElement, text: string, on: boolean): HTMLElement {
    const chip = parent.createEl('button', {
      cls: on ? ['dnd5e-spells-chip', 'is-active'] : 'dnd5e-spells-chip',
      attr: { 'aria-pressed': String(on) },
    });
    chip.createSpan({ text });
    return chip;
  }

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

  private renderCounts(): void {
    const { t } = this.deps;
    this.headerEl
      .querySelector('.dnd5e-spells-count')
      ?.setText(
        this.shown.length === 1
          ? t('monsters.count.one')
          : t('monsters.count', { count: this.shown.length }),
      );
    const counts = bandCounts(this.monsters, this.filters);
    this.headerEl.querySelectorAll<HTMLElement>('[data-band]').forEach((chip) => {
      const n = counts[chip.dataset.band as Band];
      chip.querySelector('.dnd5e-spells-chip-count')?.setText(String(n));
      chip.toggleClass('is-empty', n === 0);
    });
  }

  // ── list ───────────────────────────────────────────────────────────────────────────────────

  private render(): void {
    const { t } = this.deps;
    this.shown = filterMonsters(this.monsters, this.filters, this.name);
    const list = this.listEl;
    list.empty();
    if (this.shown.length === 0) {
      list.createDiv({ cls: 'dnd5e-spells-empty', text: t('monsters.none') });
    }
    let cr = '';
    for (const m of this.shown) {
      if (m.cr !== cr) {
        cr = m.cr;
        const n = this.shown.filter((x) => x.cr === cr).length;
        const heading = list.createDiv({ cls: 'dnd5e-spells-level' });
        heading.createSpan({ text: t('monsters.cr', { cr }) });
        heading.createSpan({ cls: 'dnd5e-spells-level-count', text: String(n) });
      }
      this.renderRow(list, m);
    }
    this.renderCounts();
    this.renderCard();
  }

  private renderRow(list: HTMLElement, m: SrdMonster): void {
    const { t } = this.deps;
    const row = list.createDiv({
      cls: m.index === this.selected ? ['dnd5e-spells-row', 'is-selected'] : 'dnd5e-spells-row',
      attr: { role: 'option', 'aria-selected': String(m.index === this.selected) },
    });
    row.dataset.monster = m.index;
    hue(row, m.type);
    const main = row.createDiv({ cls: 'dnd5e-spells-row-main' });
    main.createDiv({ cls: 'dnd5e-spells-row-name', text: this.name(m) });
    main.createDiv({
      cls: 'dnd5e-spells-row-meta',
      text: [
        // Type, then size: German would need the size declined before the type.
        typeLabel(m.type, this.lang),
        sizeLabel(m.size, this.lang),
        t('monsters.acHp', { ac: m.ac, hp: m.hp }),
      ].join(' · '),
    });
    const marks = row.createDiv({ cls: 'dnd5e-spells-marks' });
    const mark = (text: string, label: StringKey) =>
      marks.createSpan({ cls: 'dnd5e-spells-mark', text, attr: { 'aria-label': t(label) } });
    if (m.legendary) mark('L', 'monsters.legendary');
    if (m.moves.includes('fly')) mark('✈', 'monsters.moves.fly');
    if (m.spellcaster) mark('✦', 'monsters.spellcaster');
    if (m.path !== undefined) {
      marks.createSpan({ cls: ['dnd5e-spells-mark', 'is-own'], text: t('spells.own') });
    }
    row.addEventListener('click', () => this.pick(m.index, true));
  }

  private pick(index: string, open: boolean): void {
    this.selected = index;
    this.persist();
    for (const row of Array.from(this.listEl.querySelectorAll<HTMLElement>('.dnd5e-spells-row'))) {
      const on = row.dataset.monster === index;
      row.toggleClass('is-selected', on);
      row.setAttr('aria-selected', String(on));
      if (on) row.scrollIntoView({ block: 'nearest' });
    }
    if (open) this.contentEl.addClass('is-card-open');
    this.renderCard();
  }

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
    const at = this.shown.findIndex((m) => m.index === this.selected);
    const next = at === -1 ? 0 : Math.min(this.shown.length - 1, Math.max(0, at + step));
    const m = this.shown[next];
    if (m !== undefined) this.pick(m.index, false);
  }

  // ── card ───────────────────────────────────────────────────────────────────────────────────

  private renderCard(): void {
    const { t } = this.deps;
    const card = this.cardEl;
    this.cardText?.unload();
    this.cardText = null;
    card.empty();
    const m = this.monsters.find((x) => x.index === this.selected);
    if (m === undefined) {
      const empty = card.createDiv({ cls: 'dnd5e-spells-pick' });
      setIcon(empty.createDiv({ cls: 'dnd5e-spells-pick-icon' }), 'skull');
      empty.createDiv({ text: t('monsters.pick') });
      return;
    }
    const lang = this.cardLang ?? this.lang;
    const other: Lang = lang === 'de' ? 'en' : 'de';
    hue(card, m.type);

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
    bar.createSpan({
      cls: 'dnd5e-spells-school',
      text: `${typeLabel(m.type, lang)} · ${t('monsters.cr', { cr: m.cr })}`,
    });
    bar.createDiv({ cls: 'dnd5e-spells-spacer' });
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

    const otherName = monsterName(m, other);
    if (otherName !== monsterName(m, lang)) {
      card.createDiv({ cls: 'dnd5e-spells-card-other', text: otherName });
    }
    const actions = card.createDiv({ cls: 'dnd5e-monsters-actions' });
    const action = (icon: string, key: StringKey, run: () => void, cls: string) => {
      const b = actions.createEl('button', { cls });
      setIcon(b.createSpan(), icon);
      b.createSpan({ text: t(key) });
      b.addEventListener('click', run);
    };
    action('file-input', 'monsters.insert', () => this.deps.insert(m), 'dnd5e-monsters-insert');
    action(
      'swords',
      'monsters.addToCombat',
      () => this.deps.addToCombat(m),
      'dnd5e-monsters-fight',
    );
    action(
      'list-plus',
      'monsters.addToEncounter',
      () => this.deps.addToEncounter(m),
      'dnd5e-monsters-encounter',
    );
    const path = m.path;
    if (path === undefined) {
      action('file-plus', 'monsters.makeNote', () => this.deps.makeNote(m), 'dnd5e-monsters-note');
    } else {
      action('file-text', 'spells.openNote', () => this.deps.openNote(path), 'dnd5e-monsters-open');
    }

    const raw = parseStatblock(parseYaml(m.yaml));
    const block = lang === 'de' ? germanBlock(raw, monsterName(m, 'de')) : raw;
    this.cardText = new Component();
    this.cardText.load();
    const text = this.cardText;
    renderStatblock(card, block, {
      t: lang === this.lang ? t : createT(lang),
      markdown: (md, el) => MarkdownRenderer.render(this.app, md, el, '', text),
      spells: this.deps.spells,
    });
    card.createDiv({
      cls: 'dnd5e-spells-source',
      text: path === undefined ? t('spells.source') : t('monsters.ownSource', { path }),
    });
  }
}

function toggle<V>(list: readonly V[], value: V): V[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
