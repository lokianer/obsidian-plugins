// The encounter builder, built like the New NPC dialog: on the left the encounter's name and
// place, the campaign's party (chips, all on), the difficulty as three tiles with their XP budget,
// the Monster Manual's monsters as tiles with a search and the chosen ones as rows with counts; on
// the right the budget filling up live. Experience points are optional (the setting): without
// them the budget still rates the encounter but shows as Low / Moderate / High only. It hands the draft over to be written as an encounter
// note. Also the picker that chooses an encounter note for Add to encounter.

import { type App, FuzzySuggestModal, Modal, Notice, setIcon, Setting } from 'obsidian';

import {
  budget,
  DIFFICULTIES,
  type Difficulty,
  type EncounterDraft,
  rating,
} from '../battle/budget';
import type { T } from '../i18n/strings';
import { filterMonsters, NO_FILTERS } from '../monsters/filter';
import { monsterName, typeLabel } from '../monsters/meta';
import type { SrdMonster } from '../monsters/model';
import { experience } from '../npc/statblock';
import type { Lang } from '../npc/races';
import type { EncounterInfo, PartyMember } from './battle-store';

export interface EncounterBuilderDeps {
  t: T;
  lang: Lang;
  monsters: readonly SrdMonster[];
  party: readonly PartyMember[];
  /** Show experience points (the setting); off, the budget shows only as a difficulty. */
  experience: boolean;
  /** Writes the encounter; the dialog closes once it is written. */
  create: (draft: EncounterDraft) => Promise<void>;
}

const TILES = 24;

interface Pick {
  monster: SrdMonster;
  count: number;
}

export class EncounterBuilderModal extends Modal {
  private name = '';
  private location = '';
  private difficulty: Difficulty = 'moderate';
  private readonly members: Set<string>;
  /** Without a party in the campaign: how many characters of which level. */
  private stand = { count: 4, level: 1 };
  private picks: Pick[] = [];
  private query = '';
  private difficultyEl!: HTMLElement;
  private picksEl!: HTMLElement;
  private previewEl!: HTMLElement;

  constructor(
    app: App,
    private readonly deps: EncounterBuilderDeps,
  ) {
    super(app);
    this.members = new Set(deps.party.map((m) => m.name));
  }

  onOpen(): void {
    const { t } = this.deps;
    this.setTitle(t('encounterBuilder.title'));
    this.modalEl.addClass('dnd5e-npc-modal', 'dnd5e-npc-dialog');
    const el = this.contentEl;
    el.addClass('dnd5e-encounter-builder');
    const body = el.createDiv({ cls: 'dnd5e-npc-body' });
    const form = body.createDiv({ cls: 'dnd5e-npc-form' });
    this.previewEl = body.createDiv({ cls: 'dnd5e-npc-preview' });

    new Setting(form).setName(t('builder.name')).addText((text) => {
      text.inputEl.addClass('dnd5e-encounter-name');
      text.setPlaceholder(t('encounterBuilder.namePlaceholder')).onChange((value) => {
        this.name = value;
        this.drawPreview();
      });
    });
    new Setting(form)
      .setName(t('encounterBuilder.location'))
      .setDesc(t('encounterBuilder.location.desc'))
      .addText((text) => {
        text.inputEl.addClass('dnd5e-encounter-location');
        text
          .setPlaceholder(t('encounterBuilder.location.placeholder'))
          .onChange((value) => (this.location = value));
      });

    new Setting(form).setName(t('encounterBuilder.party')).setHeading();
    this.renderParty(form);

    new Setting(form).setName(t('encounterBuilder.difficulty')).setHeading();
    this.difficultyEl = form.createDiv({ cls: ['dnd5e-npc-tiles', 'dnd5e-encounter-difficulty'] });

    new Setting(form).setName(t('encounterBuilder.monsters')).setHeading();
    const picker = form.createDiv({ cls: 'dnd5e-npc-picker' });
    const search = picker.createEl('input', {
      cls: 'dnd5e-npc-search',
      attr: { type: 'search', placeholder: t('monsterBuilder.search') },
    });
    const tiles = picker.createDiv({ cls: ['dnd5e-npc-tiles', 'dnd5e-monster-tiles'] });
    search.addEventListener('input', () => {
      this.query = search.value;
      this.drawTiles(tiles);
    });
    this.drawTiles(tiles);
    this.picksEl = form.createDiv({ cls: 'dnd5e-builder-list' });

    new Setting(form).addButton((button) =>
      button
        .setButtonText(t('encounterBuilder.create'))
        .setCta()
        .onClick(() => void this.finish()),
    );
    this.changed();
  }

  onClose(): void {
    this.contentEl.empty();
  }

  /** The levels the budget is counted for. */
  private levels(): number[] {
    const { party } = this.deps;
    if (party.length === 0) return Array.from({ length: this.stand.count }, () => this.stand.level);
    return party.filter((m) => this.members.has(m.name)).map((m) => m.level ?? 1);
  }

  private spent(): number {
    return this.picks.reduce((sum, p) => sum + (experience(p.monster.cr) ?? 0) * p.count, 0);
  }

  private xp(n: number): string {
    return this.deps.t('encounterBuilder.xp', {
      xp: n.toLocaleString(this.deps.lang === 'de' ? 'de-DE' : 'en-US'),
    });
  }

  /** A line with the XP after it, when experience points are shown. */
  private withXp(line: string, n: number): string {
    return this.deps.experience ? `${line} · ${this.xp(n)}` : line;
  }

  private changed(): void {
    this.drawDifficulty();
    this.drawPicks();
    this.drawPreview();
  }

  private renderParty(form: HTMLElement): void {
    const { t, party } = this.deps;
    if (party.length === 0) {
      form.createDiv({ cls: 'dnd5e-builder-hint', text: t('encounterBuilder.noParty') });
      const number = (label: string, value: number, set: (n: number) => void, max: number) =>
        new Setting(form).setName(label).addText((text) => {
          text.inputEl.type = 'number';
          text.inputEl.min = '1';
          text.inputEl.max = String(max);
          text.setValue(String(value)).onChange((v) => {
            const n = Math.floor(Number(v));
            if (Number.isFinite(n) && n >= 1) set(Math.min(max, n));
            this.changed();
          });
        });
      number(t('encounterBuilder.characters'), this.stand.count, (n) => (this.stand.count = n), 12);
      number(t('encounterBuilder.level'), this.stand.level, (n) => (this.stand.level = n), 20);
      return;
    }
    const chips = form.createDiv({ cls: ['dnd5e-builder-flags', 'dnd5e-encounter-party'] });
    for (const m of party) {
      const on = () => this.members.has(m.name);
      const chip = chips.createEl('button', {
        text:
          m.level === null
            ? t('encounterBuilder.memberNoLevel', { name: m.name })
            : t('encounterBuilder.member', { name: m.name, level: m.level }),
      });
      const paint = () => {
        chip.className = on() ? 'dnd5e-builder-flag is-active' : 'dnd5e-builder-flag';
        chip.setAttr('aria-pressed', String(on()));
      };
      paint();
      chip.addEventListener('click', () => {
        if (on()) this.members.delete(m.name);
        else this.members.add(m.name);
        paint();
        this.changed();
      });
    }
  }

  private drawDifficulty(): void {
    const { t } = this.deps;
    const el = this.difficultyEl;
    el.empty();
    const levels = this.levels();
    for (const d of DIFFICULTIES) {
      const tile = el.createEl('button', {
        cls: d === this.difficulty ? ['dnd5e-npc-tile', 'is-selected'] : 'dnd5e-npc-tile',
      });
      tile.dataset.difficulty = d;
      setIcon(tile.createDiv({ cls: 'dnd5e-npc-tile-icon' }), ICONS[d]);
      const text = tile.createDiv({ cls: 'dnd5e-npc-tile-text' });
      text.createDiv({ cls: 'dnd5e-npc-tile-name', text: t(`encounterBuilder.${d}`) });
      text.createDiv({
        cls: 'dnd5e-npc-tile-line',
        text: this.deps.experience ? this.xp(budget(levels, d)) : t(`encounterBuilder.${d}.line`),
      });
      tile.addEventListener('click', () => {
        this.difficulty = d;
        this.changed();
      });
    }
  }

  private drawTiles(parent: HTMLElement): void {
    const { t, lang } = this.deps;
    parent.empty();
    const found = filterMonsters(this.deps.monsters, { ...NO_FILTERS, query: this.query }, (m) =>
      monsterName(m, lang),
    ).slice(0, TILES);
    for (const m of found) {
      const tile = parent.createEl('button', { cls: 'dnd5e-npc-tile' });
      setIcon(tile.createDiv({ cls: 'dnd5e-npc-tile-icon' }), 'plus');
      const text = tile.createDiv({ cls: 'dnd5e-npc-tile-text' });
      text.createDiv({ cls: 'dnd5e-npc-tile-name', text: monsterName(m, lang) });
      text.createDiv({
        cls: 'dnd5e-npc-tile-line',
        text: `${this.withXp(t('monsters.cr', { cr: m.cr }), experience(m.cr) ?? 0)} · ${typeLabel(m.type, lang)}`,
      });
      tile.addEventListener('click', () => this.add(m));
    }
  }

  /** One more of a monster: its row's count, or a new row. */
  add(m: SrdMonster): void {
    const pick = this.picks.find((p) => p.monster.index === m.index);
    if (pick !== undefined) pick.count++;
    else this.picks.push({ monster: m, count: 1 });
    this.changed();
  }

  private drawPicks(): void {
    const { t, lang } = this.deps;
    const list = this.picksEl;
    list.empty();
    if (this.picks.length === 0) {
      list.createDiv({ cls: 'dnd5e-builder-hint', text: t('encounterBuilder.pickHint') });
      return;
    }
    for (const p of this.picks) {
      const row = list.createDiv({ cls: ['dnd5e-builder-row', 'dnd5e-encounter-pick'] });
      const fields = row.createDiv({ cls: 'dnd5e-builder-fields' });
      fields.createDiv({ cls: 'dnd5e-encounter-pick-name', text: monsterName(p.monster, lang) });
      fields.createDiv({
        cls: 'dnd5e-encounter-pick-line',
        text: this.withXp(
          t('monsters.cr', { cr: p.monster.cr }),
          (experience(p.monster.cr) ?? 0) * p.count,
        ),
      });
      const stepper = row.createDiv({ cls: 'dnd5e-encounter-stepper' });
      const step = (icon: string, label: string, by: number) => {
        const b = stepper.createEl('button', {
          cls: 'clickable-icon',
          attr: { 'aria-label': label },
        });
        setIcon(b, icon);
        b.addEventListener('click', () => {
          p.count += by;
          if (p.count <= 0) this.picks = this.picks.filter((x) => x !== p);
          this.changed();
        });
      };
      step('minus', t('encounterBuilder.fewer'), -1);
      stepper.createSpan({ cls: 'dnd5e-encounter-count', text: String(p.count) });
      step('plus', t('encounterBuilder.more'), 1);
    }
  }

  private drawPreview(): void {
    const { t, lang } = this.deps;
    const el = this.previewEl;
    el.empty();
    const card = el.createDiv({ cls: ['dnd5e-npc-card', 'dnd5e-encounter-card'] });
    card.createDiv({
      cls: 'dnd5e-npc-card-name',
      text: this.name.trim() || t('encounterBuilder.unnamed'),
    });
    const levels = this.levels();
    card.createDiv({
      cls: 'dnd5e-encounter-partyline',
      text:
        levels.length === 1
          ? t('encounterBuilder.partyLine.one', { level: levels[0] ?? 1 })
          : t('encounterBuilder.partyLine', {
              count: levels.length,
              levels: levels.join(', ') || '—',
            }),
    });
    const spent = this.spent();
    const total = budget(levels, this.difficulty);
    const meter = card.createDiv({ cls: 'dnd5e-encounter-meter' });
    const ratio = total > 0 ? spent / total : 0;
    const difficulty = t(`encounterBuilder.${this.difficulty}`);
    meter.createDiv({
      cls: 'dnd5e-encounter-spent',
      text: this.deps.experience
        ? t('encounterBuilder.spent', { spent: this.xp(spent), budget: this.xp(total), difficulty })
        : t('encounterBuilder.share', { percent: Math.round(ratio * 100), difficulty }),
    });
    const bar = meter.createDiv({ cls: 'dnd5e-encounter-bar' });
    const fill = bar.createDiv({ cls: 'dnd5e-encounter-fill' });
    fill.setCssProps({ '--dnd5e-fill': `${Math.round(Math.min(1, ratio) * 100)}%` });
    fill.toggleClass('is-over', ratio > 1);
    if (this.deps.experience) {
      meter.createDiv({
        cls: 'dnd5e-encounter-left',
        text:
          spent > total
            ? t('encounterBuilder.over', { xp: this.xp(spent - total) })
            : t('encounterBuilder.left', { xp: this.xp(total - spent) }),
      });
    }
    const rated = rating(spent, levels);
    const chip = card.createDiv({
      cls: ['dnd5e-encounter-rating', `is-${rated}`],
      text: t(`encounterBuilder.rating.${rated}`),
    });
    chip.dataset.rating = rated;
    if (this.deps.party.some((m) => this.members.has(m.name) && m.level === null)) {
      card.createDiv({ cls: 'dnd5e-builder-hint', text: t('encounterBuilder.levelOne') });
    }
    const list = card.createEl('ul', { cls: 'dnd5e-encounter-lines' });
    for (const p of this.picks) {
      list.createEl('li', {
        text: this.withXp(
          `${p.count} × ${monsterName(p.monster, lang)}`,
          (experience(p.monster.cr) ?? 0) * p.count,
        ),
      });
    }
  }

  private async finish(): Promise<void> {
    const { t } = this.deps;
    if (this.name.trim() === '') {
      new Notice(t('encounterBuilder.noName'));
      return;
    }
    await this.deps.create({
      name: this.name,
      location: this.location,
      difficulty: this.difficulty,
      party: this.deps.party.length === 0 || this.members.size > 0,
      monsters: this.picks.map((p) => ({ name: p.monster.name, count: p.count })),
    });
    this.close();
  }
}

const ICONS: Record<Difficulty, string> = {
  low: 'shield',
  moderate: 'swords',
  high: 'skull',
};

/** Chooses one of the campaign's encounter notes. */
export class EncounterPicker extends FuzzySuggestModal<EncounterInfo> {
  constructor(
    app: App,
    t: T,
    private readonly encounters: readonly EncounterInfo[],
    private readonly chosen: (encounter: EncounterInfo) => void,
  ) {
    super(app);
    this.setPlaceholder(t('encounterBuilder.pick'));
  }

  getItems(): EncounterInfo[] {
    return [...this.encounters];
  }

  getItemText(item: EncounterInfo): string {
    return item.title;
  }

  onChooseItem(item: EncounterInfo): void {
    this.chosen(item);
  }
}
