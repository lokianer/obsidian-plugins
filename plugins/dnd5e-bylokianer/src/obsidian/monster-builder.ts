// The monster builder, built like the New NPC dialog: on the left the form — an SRD monster to start
// from as tiles with a search, then every part of a stat block as Obsidian settings (size, type,
// alignment and challenge rating as dropdowns in the GM's language, stored in the SRD's words; the
// six abilities as numbers; saves and skills as one line; traits, actions, reactions and legendary
// actions as rows) — and on the right the stat block as it will look, live. It hands the finished
// block over to be written as a `type: monster` note; it never rewrites a note.

import {
  type App,
  Component,
  MarkdownRenderer,
  Modal,
  Notice,
  parseYaml,
  setIcon,
  Setting,
} from 'obsidian';

import type { StringKey, T } from '../i18n/strings';
import {
  ALIGNMENTS,
  bonusText,
  CRS,
  emptyMonster,
  legendaryParagraph,
  parseBonuses,
} from '../monsters/draft';
import { filterMonsters, NO_FILTERS } from '../monsters/filter';
import { monstersFrom } from '../monsters/import';
import {
  germanBlock,
  germanTexts,
  monsterName,
  SIZES,
  sizeLabel,
  TYPES,
  typeLabel,
} from '../monsters/meta';
import type { SrdMonster } from '../monsters/model';
import type { Lang } from '../npc/races';
import { type Entry, findStatblocks, parseStatblock, type Statblock } from '../npc/statblock';
import { renderStatblock } from './statblock-view';

/** How many SRD monsters the start-from tiles show at once. */
const TILES = 24;

/** The entry lists a monster can have, with their headings. */
const LISTS = [
  ['traits', 'statblock.traits'],
  ['actions', 'statblock.actions'],
  ['reactions', 'statblock.reactions'],
  ['legendaryActions', 'statblock.legendary'],
] as const;

type ListKey = (typeof LISTS)[number][0];

/** A Lucide icon per type, for the start-from tiles. */
const TYPE_ICONS: Record<string, string> = {
  aberration: 'eye',
  beast: 'paw-print',
  celestial: 'sun',
  construct: 'cog',
  dragon: 'flame',
  elemental: 'wind',
  fey: 'sparkles',
  fiend: 'skull',
  giant: 'mountain',
  humanoid: 'user',
  monstrosity: 'bug',
  ooze: 'droplet',
  plant: 'leaf',
  swarm: 'bug',
  undead: 'ghost',
};

export interface MonsterBuilderDeps {
  t: T;
  lang: Lang;
  /** The monsters to start from. */
  monsters: readonly SrdMonster[];
  /** Writes the monster; the dialog closes once it is written. */
  create: (block: Statblock) => Promise<void>;
  /** Writes every imported monster as a note of its own; the dialog closes once they are written. */
  createAll: (blocks: Statblock[]) => Promise<void>;
}

/** The monsters in an imported file's text: JSON, YAML, or Markdown with stat blocks. */
export function monstersInFile(name: string, text: string): Statblock[] {
  if (/\.json$/i.test(name)) return monstersFrom(JSON.parse(text));
  if (/\.(md|markdown|txt)$/i.test(name)) {
    return findStatblocks(text).flatMap((block) => monstersFrom(parseYaml(block.source)));
  }
  return monstersFrom(parseYaml(text));
}

export class MonsterBuilderModal extends Modal {
  private block: Statblock = emptyMonster();
  /** The monsters of the last imported file, when it held more than one. */
  private imported: Statblock[] = [];
  private query = '';
  private formEl!: HTMLElement;
  private previewEl!: HTMLElement;
  private preview: Component | null = null;

  constructor(
    app: App,
    private readonly deps: MonsterBuilderDeps,
  ) {
    super(app);
  }

  onOpen(): void {
    this.setTitle(this.deps.t('monsterBuilder.title'));
    this.modalEl.addClass('dnd5e-npc-modal', 'dnd5e-npc-dialog');
    this.contentEl.addClass('dnd5e-monster-builder');
    const { t } = this.deps;
    const top = this.contentEl.createDiv({ cls: 'dnd5e-npc-top' });
    const load = top.createEl('button', { cls: ['dnd5e-builder-import', 'dnd5e-monster-import'] });
    setIcon(load.createSpan(), 'file-input');
    load.createSpan({ text: t('monsterBuilder.import') });
    const file = top.createEl('input', {
      cls: 'dnd5e-builder-file',
      attr: { type: 'file', accept: '.json,.yaml,.yml,.md,.markdown,.txt' },
    });
    load.addEventListener('click', () => file.click());
    file.addEventListener('change', () => {
      const chosen = file.files?.[0];
      if (chosen !== undefined)
        void chosen.text().then((text) => this.importFile(chosen.name, text));
      file.value = '';
    });
    const body = this.contentEl.createDiv({ cls: 'dnd5e-npc-body' });
    this.formEl = body.createDiv({ cls: 'dnd5e-npc-form' });
    this.previewEl = body.createDiv({ cls: 'dnd5e-npc-preview' });
    this.renderForm();
  }

  onClose(): void {
    this.preview?.unload();
    this.contentEl.empty();
  }

  /** Fills the form from an SRD monster, in the SRD's words. */
  /** A monster to start from; with German its name and texts in German, its header in English. */
  copy(monster: SrdMonster): void {
    const block = parseStatblock(parseYaml(monster.yaml));
    const { lang } = this.deps;
    this.block =
      lang === 'de'
        ? { ...germanTexts(block, monster.index), name: monsterName(monster, 'de') }
        : block;
    this.renderForm();
  }

  /** A file's monsters: one fills the form, several become tiles to pick from or create at once. */
  importFile(name: string, text: string): void {
    const { t } = this.deps;
    let found: Statblock[];
    try {
      found = monstersInFile(name, text);
    } catch {
      new Notice(t('monsterBuilder.import.unreadable'));
      return;
    }
    if (found.length === 0) {
      new Notice(t('monsterBuilder.import.none'));
      return;
    }
    if (found.length === 1 && found[0] !== undefined) {
      this.imported = [];
      this.block = found[0];
    } else {
      this.imported = found;
      new Notice(t('monsterBuilder.import.found', { count: found.length }));
    }
    this.renderForm();
  }

  /** The imported monsters as tiles, and a button that writes them all. */
  private renderImported(form: HTMLElement): void {
    const { t } = this.deps;
    if (this.imported.length === 0) return;
    const heading = new Setting(form)
      .setName(t('monsterBuilder.import.heading', { count: this.imported.length }))
      .setHeading();
    heading.addButton((button) =>
      button
        .setButtonText(t('monsterBuilder.import.all', { count: this.imported.length }))
        .setCta()
        .onClick(() => void this.createAll()),
    );
    const tiles = form.createDiv({ cls: ['dnd5e-npc-tiles', 'dnd5e-monster-imported'] });
    for (const block of this.imported) {
      const tile = tiles.createEl('button', {
        cls: block === this.block ? ['dnd5e-npc-tile', 'is-selected'] : 'dnd5e-npc-tile',
      });
      setIcon(tile.createDiv({ cls: 'dnd5e-npc-tile-icon' }), 'file-input');
      const text = tile.createDiv({ cls: 'dnd5e-npc-tile-text' });
      text.createDiv({ cls: 'dnd5e-npc-tile-name', text: block.name ?? '' });
      text.createDiv({
        cls: 'dnd5e-npc-tile-line',
        text: [block.cr === null ? '' : t('monsters.cr', { cr: block.cr }), block.type ?? '']
          .filter(Boolean)
          .join(' · '),
      });
      tile.addEventListener('click', () => {
        this.block = block;
        this.renderForm();
      });
    }
  }

  private async createAll(): Promise<void> {
    await this.deps.createAll(this.imported);
    this.close();
  }

  // ── the form ───────────────────────────────────────────────────────────────────────────────

  private renderForm(): void {
    const { t, lang } = this.deps;
    const b = this.block;
    const form = this.formEl;
    form.empty();
    this.renderImported(form);

    new Setting(form).setName(t('monsterBuilder.from')).setHeading();
    const picker = form.createDiv({ cls: 'dnd5e-npc-picker' });
    const search = picker.createEl('input', {
      cls: 'dnd5e-npc-search',
      attr: { type: 'search', placeholder: t('monsterBuilder.search') },
    });
    search.value = this.query;
    const tiles = picker.createDiv({ cls: ['dnd5e-npc-tiles', 'dnd5e-monster-tiles'] });
    search.addEventListener('input', () => {
      this.query = search.value;
      this.drawTiles(tiles);
    });
    this.drawTiles(tiles);

    new Setting(form).setName(t('monsterBuilder.identity')).setHeading();
    this.text(form, t('builder.name'), b.name ?? '', (v) => (b.name = v), 'dnd5e-monster-name');
    this.pick(
      form,
      t('monsters.size'),
      SIZES,
      b.size ?? 'Medium',
      (v) => sizeLabel(v, lang),
      (v) => (b.size = v),
      'dnd5e-monster-size',
    );
    const types = TYPES.map((x) => (x === 'swarm' ? 'swarm of Tiny beasts' : x));
    this.pick(
      form,
      t('monsterBuilder.type'),
      types,
      b.type ?? 'beast',
      (v) => typeLabel(v.startsWith('swarm') ? 'swarm' : v, lang),
      (v) => (b.type = v),
      'dnd5e-monster-type',
    );
    this.text(form, t('monsterBuilder.subtype'), b.subtype ?? '', (v) => (b.subtype = v || null));
    this.pick(
      form,
      t('monsterBuilder.alignment'),
      ALIGNMENTS,
      b.alignment ?? 'unaligned',
      (v) => (lang === 'de' ? (germanBlock({ ...b, alignment: v }, '').alignment ?? v) : v),
      (v) => (b.alignment = v),
      'dnd5e-monster-alignment',
    );
    this.pick(
      form,
      t('statblock.challenge'),
      CRS,
      b.cr ?? '0',
      (v) => v,
      (v) => (b.cr = v),
      'dnd5e-monster-cr',
    );

    new Setting(form).setName(t('monsterBuilder.defence')).setHeading();
    this.number(form, t('statblock.ac'), b.ac, (v) => (b.ac = v), 'dnd5e-monster-ac');
    this.text(form, t('monsterBuilder.acNote'), b.acClass ?? '', (v) => (b.acClass = v || null));
    this.number(form, t('statblock.hp'), b.hp, (v) => (b.hp = v), 'dnd5e-monster-hp');
    this.text(form, t('monsterBuilder.hitDice'), b.hitDice ?? '', (v) => (b.hitDice = v || null));
    this.text(form, t('statblock.speed'), b.speed ?? '', (v) => (b.speed = v || null));

    new Setting(form).setName(t('monsterBuilder.abilities')).setHeading();
    const grid = form.createDiv({ cls: 'dnd5e-monster-abilities' });
    const labels = t('statblock.abilities').split(',');
    const stats = b.stats ?? [10, 10, 10, 10, 10, 10];
    b.stats = stats;
    stats.forEach((score, i) => {
      const cell = grid.createEl('label', { cls: 'dnd5e-monster-ability' });
      cell.createSpan({ text: labels[i] ?? '' });
      const input = cell.createEl('input', {
        attr: { type: 'number', min: '1', max: '30', inputmode: 'numeric' },
      });
      input.value = String(score);
      input.addEventListener('input', () => {
        const n = Number(input.value);
        if (Number.isInteger(n) && n >= 1 && n <= 30) {
          stats[i] = n;
          this.drawPreview();
        }
      });
    });
    this.text(
      form,
      t('statblock.saves'),
      bonusText(b.saves),
      (v) => (b.saves = parseBonuses(v)),
      '',
      t('monsterBuilder.savesHint'),
    );
    this.text(
      form,
      t('statblock.skills'),
      bonusText(b.skills),
      (v) => (b.skills = parseBonuses(v)),
      '',
      t('monsterBuilder.skillsHint'),
    );
    this.text(
      form,
      t('statblock.vulnerabilities'),
      b.damageVulnerabilities ?? '',
      (v) => (b.damageVulnerabilities = v || null),
    );
    this.text(
      form,
      t('statblock.resistances'),
      b.damageResistances ?? '',
      (v) => (b.damageResistances = v || null),
    );
    this.text(
      form,
      t('statblock.immunities'),
      b.damageImmunities ?? '',
      (v) => (b.damageImmunities = v || null),
    );
    this.text(
      form,
      t('statblock.conditions'),
      b.conditionImmunities ?? '',
      (v) => (b.conditionImmunities = v || null),
    );

    new Setting(form).setName(t('monsterBuilder.senses')).setHeading();
    this.text(form, t('statblock.senses'), b.senses ?? '', (v) => (b.senses = v || null));
    this.text(form, t('statblock.languages'), b.languages ?? '', (v) => (b.languages = v || null));

    for (const [key, heading] of LISTS) this.entries(form, key, heading);

    new Setting(form).addButton((button) =>
      button
        .setButtonText(t('monsterBuilder.create'))
        .setCta()
        .onClick(() => void this.finish()),
    );
    this.drawPreview();
  }

  private drawTiles(parent: HTMLElement): void {
    const { lang } = this.deps;
    parent.empty();
    const found = filterMonsters(this.deps.monsters, { ...NO_FILTERS, query: this.query }, (m) =>
      monsterName(m, lang),
    ).slice(0, TILES);
    for (const m of found) {
      const tile = parent.createEl('button', { cls: 'dnd5e-npc-tile' });
      setIcon(tile.createDiv({ cls: 'dnd5e-npc-tile-icon' }), TYPE_ICONS[m.type] ?? 'skull');
      const text = tile.createDiv({ cls: 'dnd5e-npc-tile-text' });
      text.createDiv({ cls: 'dnd5e-npc-tile-name', text: monsterName(m, lang) });
      text.createDiv({
        cls: 'dnd5e-npc-tile-line',
        text: `${this.deps.t('monsters.cr', { cr: m.cr })} · ${typeLabel(m.type, lang)}`,
      });
      tile.addEventListener('click', () => this.copy(m));
    }
  }

  /** One list of entries: a heading with Add, then a row per entry. */
  private entries(form: HTMLElement, key: ListKey, heading: StringKey): void {
    const { t } = this.deps;
    const b = this.block;
    const list: Entry[] = b[key];
    const wrap = form.createDiv({ cls: 'dnd5e-monster-entries' });
    wrap.dataset.list = key;
    const draw = () => {
      wrap.empty();
      new Setting(wrap)
        .setName(t(heading))
        .setHeading()
        .addExtraButton((button) =>
          button
            .setIcon('plus')
            .setTooltip(t('monsterBuilder.add'))
            .onClick(() => {
              list.push({ name: '', desc: '' });
              if (key === 'legendaryActions' && (b.legendaryDescription ?? '') === '') {
                b.legendaryDescription = legendaryParagraph(b.name ?? '');
              }
              draw();
              this.drawPreview();
              wrap.querySelector<HTMLInputElement>('.dnd5e-builder-row:last-child input')?.focus();
            }),
        );
      if (key === 'legendaryActions' && list.length > 0) {
        const area = wrap.createEl('textarea', {
          cls: 'dnd5e-monster-legendary',
          attr: { rows: '3', 'aria-label': t('monsterBuilder.legendaryText') },
        });
        area.value = b.legendaryDescription ?? '';
        area.addEventListener('input', () => {
          b.legendaryDescription = area.value;
          this.drawPreview();
        });
      }
      list.forEach((entry, i) => {
        const row = wrap.createDiv({ cls: 'dnd5e-builder-row' });
        const fields = row.createDiv({ cls: 'dnd5e-builder-fields' });
        const name = fields.createEl('input', {
          attr: { type: 'text', placeholder: t('monsterBuilder.entryName') },
        });
        name.value = entry.name;
        name.addEventListener('input', () => {
          entry.name = name.value;
          this.drawPreview();
        });
        const desc = fields.createEl('textarea', {
          attr: { rows: '2', placeholder: t('monsterBuilder.entryDesc') },
        });
        desc.value = entry.desc;
        desc.addEventListener('input', () => {
          entry.desc = desc.value;
          this.drawPreview();
        });
        const remove = row.createEl('button', {
          cls: 'clickable-icon',
          attr: { 'aria-label': t('monsterBuilder.remove') },
        });
        setIcon(remove, 'x');
        remove.addEventListener('click', () => {
          list.splice(i, 1);
          draw();
          this.drawPreview();
        });
      });
    };
    draw();
  }

  private text(
    el: HTMLElement,
    name: string,
    value: string,
    set: (v: string) => void,
    cls = '',
    placeholder = '',
  ): void {
    new Setting(el).setName(name).addText((text) => {
      text
        .setPlaceholder(placeholder)
        .setValue(value)
        .onChange((v) => {
          set(v.trim());
          this.drawPreview();
        });
      if (cls !== '') text.inputEl.addClass(cls);
    });
  }

  private number(
    el: HTMLElement,
    name: string,
    value: number | null,
    set: (v: number | null) => void,
    cls: string,
  ): void {
    new Setting(el).setName(name).addText((text) => {
      text.inputEl.type = 'number';
      text.inputEl.inputMode = 'numeric';
      text.inputEl.addClass(cls);
      text.setValue(value === null ? '' : String(value)).onChange((v) => {
        const n = Number(v);
        set(v.trim() === '' || !Number.isFinite(n) ? null : n);
        this.drawPreview();
      });
    });
  }

  /** A dropdown over `values`; a value from elsewhere is offered first. */
  private pick<V extends string>(
    el: HTMLElement,
    name: string,
    values: readonly V[],
    value: string,
    text: (v: V) => string,
    set: (v: V) => void,
    cls: string,
  ): void {
    new Setting(el).setName(name).addDropdown((dropdown) => {
      dropdown.selectEl.addClass(cls);
      const all: readonly string[] = values.includes(value as V) ? values : [value, ...values];
      for (const v of all) dropdown.addOption(v, text(v as V));
      dropdown.setValue(value).onChange((v) => {
        set(v as V);
        this.drawPreview();
      });
    });
  }

  // ── the preview ────────────────────────────────────────────────────────────────────────────

  private drawPreview(): void {
    const { t, lang } = this.deps;
    this.preview?.unload();
    this.preview = new Component();
    this.preview.load();
    const text = this.preview;
    this.previewEl.empty();
    const card = this.previewEl.createDiv({ cls: ['dnd5e-npc-card', 'dnd5e-monster-preview'] });
    card.createDiv({ cls: 'dnd5e-npc-card-eyebrow', text: t('npc.preview') });
    const b = this.block;
    const named = (b.name ?? '').trim() !== '';
    const shown: Statblock = { ...b, name: named ? b.name : t('monsterBuilder.unnamed') };
    renderStatblock(card, lang === 'de' ? germanBlock(shown, shown.name ?? '') : shown, {
      t,
      markdown: (md, el) => MarkdownRenderer.render(this.app, md, el, '', text),
    });
  }

  private async finish(): Promise<void> {
    if ((this.block.name ?? '').trim() === '') {
      new Notice(this.deps.t('monsterBuilder.noName'));
      return;
    }
    await this.deps.create(this.block);
    this.close();
  }
}
