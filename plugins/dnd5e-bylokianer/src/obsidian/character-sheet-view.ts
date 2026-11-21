// The character sheet, layout A: name, origin and hit points at the head, the key numbers as
// tiles, the abilities with their saves and senses in a column, and tabs beside them (Actions,
// Spells, Features, Inventory, Skills, Notes, Levels). Every check, save, attack and damage is a
// dice button. A built character's numbers come from the rules engine; a hand-written note shows
// its own values. In a narrow pane the ability column becomes a row of six boxes above the tabs.

import { ABILITIES, local, type Rules, type Sheet, type Text } from '@obsidian-plugins/rules';
import { type Component, ItemView, type ViewStateResult, type WorkspaceLeaf } from 'obsidian';

import type { SheetData } from '../character/note';
import {
  abilityCheckName,
  type Check,
  characterBonuses,
  checks,
  saveName,
  skillName,
} from '../dice/checks';
import { d20 } from '../dice/statblock';
import { en, type StringKey, type T } from '../i18n/strings';
import type { Lang } from '../npc/races';
import type { Bonus } from '../npc/statblock';
import { checkButton, type RollCheck } from './statblock-dice';
import { pill, sectionHead, tile, tiles } from './ui/blocks';

export const CHARACTER_VIEW = 'dnd5e-character-sheet';

export interface CharacterSheetDeps {
  t: T;
  lang: () => Lang;
  rules: () => Rules;
  load: (path: string) => Promise<SheetData | null>;
  roll: RollCheck;
  openNote: (path: string) => void;
  /** Calls back whenever the note at `path` changes; returns the unsubscribe. */
  onChange: (path: string, callback: () => void) => () => void;
  /** Renders a feature's Markdown text, owned by `component`. */
  render: (markdown: string, target: HTMLElement, component: Component) => void;
}

const TABS = ['actions', 'spells', 'features', 'inventory', 'skills', 'notes', 'levels'] as const;
type Tab = (typeof TABS)[number];

/** `+3`, `+0`, `−1` (a true minus sign). */
const signed = (n: number) => (n < 0 ? `−${-n}` : `+${n}`);

const ABILITY_NAMES: Record<string, [string, string]> = {
  str: ['Strength', 'Stärke'],
  dex: ['Dexterity', 'Geschicklichkeit'],
  con: ['Constitution', 'Konstitution'],
  int: ['Intelligence', 'Intelligenz'],
  wis: ['Wisdom', 'Weisheit'],
  cha: ['Charisma', 'Charisma'],
};

const SENSES: Record<string, [string, string]> = {
  darkvision: ['Darkvision', 'Dunkelsicht'],
  blindsight: ['Blindsight', 'Blindsicht'],
  tremorsense: ['Tremorsense', 'Erschütterungssinn'],
  truesight: ['Truesight', 'Wahrsicht'],
};

export class CharacterSheetView extends ItemView {
  private path: string | null = null;
  private tab: Tab = 'actions';
  private unsubscribe: (() => void) | null = null;

  constructor(
    leaf: WorkspaceLeaf,
    private readonly deps: CharacterSheetDeps,
  ) {
    super(leaf);
  }

  getViewType(): string {
    return CHARACTER_VIEW;
  }

  getDisplayText(): string {
    return this.path === null
      ? this.deps.t('sheet.title')
      : (this.path.split('/').pop() ?? '').replace(/\.md$/, '');
  }

  getIcon(): string {
    return 'scroll-text';
  }

  getState(): Record<string, unknown> {
    return { ...super.getState(), path: this.path };
  }

  async setState(state: unknown, result: ViewStateResult): Promise<void> {
    const path = (state as { path?: unknown } | null)?.path;
    this.path = typeof path === 'string' ? path : null;
    this.unsubscribe?.();
    this.unsubscribe =
      this.path === null ? null : this.deps.onChange(this.path, () => void this.refresh());
    await super.setState(state, result);
    await this.refresh();
  }

  async onOpen(): Promise<void> {
    await this.refresh();
  }

  async onClose(): Promise<void> {
    this.unsubscribe?.();
    this.unsubscribe = null;
    return Promise.resolve();
  }

  private async refresh(): Promise<void> {
    const data = this.path === null ? null : await this.deps.load(this.path);
    this.draw(data);
  }

  private draw(data: SheetData | null): void {
    const el = this.contentEl;
    el.empty();
    el.addClass('dnd5e-cs');
    const { t } = this.deps;
    if (data === null) {
      el.createDiv({ cls: 'dnd5e-cs-empty', text: t('sheet.none') });
      return;
    }
    if (data.sheet === null) this.drawHandWritten(el, data);
    else this.drawBuilt(el, data, data.sheet);
  }

  // ---- names and checks ----

  private lang(): Lang {
    return this.deps.lang();
  }

  /** A rules id's display name: a class, subclass, species, background, feat, skill, tool, language or item. */
  private nameOf(id: string): string {
    const r = this.deps.rules();
    const named =
      r.subclass(id) ??
      r.feat(id) ??
      r.class(id) ??
      r.species(id) ??
      r.background(id) ??
      r.armor(id) ??
      r.weapon(id) ??
      r.tool(id) ??
      r.language(id);
    if (named !== undefined) return local(named.name, this.lang());
    if (r.skill(id) !== undefined) return skillName(id.replace(/-/g, '_'), this.lang());
    const option = this.optionName(id);
    if (option !== undefined) return local(option, this.lang());
    return ABILITY_NAMES[id]?.[this.lang() === 'de' ? 1 : 0] ?? id;
  }

  /** The name of an option id (a divine order, a fighting style, …) in any choice of the rules. */
  private optionName(id: string): Text | undefined {
    const { data } = this.deps.rules();
    const owners = [data.classes, data.subclasses, data.species, data.backgrounds, data.feats];
    for (const owner of owners) {
      for (const entry of owner) {
        for (const feature of entry.features) {
          for (const choice of feature.choices) {
            if ('options' in choice.from) {
              const found = choice.from.options.find((o) => o.id === id);
              if (found !== undefined) return found.name;
            }
          }
        }
      }
    }
    return undefined;
  }

  private check(who: string, name: string, english: string, formula: string, d20Roll: boolean) {
    const check: Check = {
      name,
      label: `${who}: ${name}`,
      subject: `${who} rolls ${english}`,
      formula,
      d20: d20Roll,
    };
    return check;
  }

  private rollButton(parent: HTMLElement, text: string, check: Check): HTMLElement {
    return checkButton(parent, text, check, this.deps.roll, this.deps.t);
  }

  private damageType(type: string): string {
    const key = `sheet.damage.${type}`;
    return key in en ? this.deps.t(key as StringKey) : type;
  }

  private speed(feet: number): string {
    const n = this.lang() === 'de' ? String(Math.round(feet * 3) / 10).replace('.', ',') : feet;
    return this.deps.t('sheet.feet', { n });
  }

  // ---- the head ----

  private head(el: HTMLElement, name: string, sub: string, hp: string): void {
    const head = el.createDiv({ cls: 'dnd5e-cs-head' });
    const who = head.createDiv({ cls: 'dnd5e-cs-who' });
    who.createDiv({ cls: 'dnd5e-cs-name', text: name });
    who.createDiv({ cls: 'dnd5e-cs-sub', text: sub });
    const box = tiles(head);
    box.addClass('dnd5e-cs-hp');
    tile(box, hp, this.deps.t('sheet.hp'));
  }

  private keyTiles(el: HTMLElement, values: [string, StringKey][]): void {
    const row = tiles(el);
    row.addClass('dnd5e-cs-tiles');
    for (const [value, label] of values) tile(row, value, this.deps.t(label));
  }

  // ---- a built character ----

  private drawBuilt(el: HTMLElement, data: SheetData, sheet: Sheet): void {
    const { t } = this.deps;
    const character = data.character!;
    const fm = data.frontmatter;
    const classes = sheet.classes
      .map((c) => {
        const sub = c.subclass === null ? '' : ` (${this.nameOf(c.subclass)})`;
        return `${this.nameOf(c.id)} ${c.level}${sub}`;
      })
      .join(' / ');
    const current = typeof fm.hp_current === 'number' ? fm.hp_current : sheet.hp.total;
    this.head(
      el,
      data.name,
      [this.nameOf(character.species), classes, character.rules].join(' · '),
      `${current} / ${sheet.hp.total}`,
    );
    if (sheet.missing.length > 0) {
      el.createDiv({
        cls: 'dnd5e-cs-warning',
        text: t('sheet.missing', { what: sheet.missing.join(', ') }),
      });
    }
    if (sheet.unknown.length > 0) {
      el.createDiv({
        cls: 'dnd5e-cs-warning',
        text: t('sheet.unknown', { what: sheet.unknown.join(', ') }),
      });
    }
    this.keyTiles(el, [
      [String(sheet.ac.total), 'sheet.ac'],
      [signed(sheet.initiative.total), 'sheet.initiative'],
      [this.speed(sheet.speed), 'sheet.speed'],
      [signed(sheet.proficiency), 'sheet.proficiency'],
      [String(sheet.passive.perception), 'sheet.passive'],
    ]);
    const body = el.createDiv({ cls: 'dnd5e-cs-body' });
    this.side(body.createDiv({ cls: 'dnd5e-cs-side' }), data.name, sheet);
    const main = body.createDiv({ cls: 'dnd5e-cs-main' });
    const bar = main.createDiv({ cls: 'dnd5e-cs-tabs' });
    const content = main.createDiv({ cls: 'dnd5e-cs-tab' });
    const show = () => {
      content.empty();
      for (const p of Array.from(bar.children)) {
        p.toggleClass('is-active', (p as HTMLElement).dataset.tab === this.tab);
      }
      this.drawTab(content, data, sheet);
    };
    for (const tab of TABS) {
      const p = pill(bar, t(`sheet.tab.${tab}`), tab === this.tab);
      p.dataset.tab = tab;
      p.setAttr('role', 'button');
      p.addEventListener('click', () => {
        this.tab = tab;
        show();
      });
    }
    show();
  }

  private side(el: HTMLElement, who: string, sheet: Sheet): void {
    const { t } = this.deps;
    const lang = this.lang();
    const short = t('statblock.abilities').split(',');
    const column = el.createDiv({ cls: 'dnd5e-cs-abilities' });
    ABILITIES.forEach((a, i) => {
      const { score, modifier } = sheet.abilities[a];
      const box = column.createDiv({ cls: 'dnd5e-cs-ability' });
      box.createSpan({ cls: 'dnd5e-cs-ability-name', text: short[i] ?? a.toUpperCase() });
      box.createSpan({ cls: 'dnd5e-cs-ability-score', text: String(score) });
      const name = abilityCheckName(i, lang);
      this.rollButton(
        box,
        signed(modifier),
        this.check(who, name, abilityCheckName(i, 'en'), d20(modifier), true),
      ).addClass('dnd5e-cs-ability-mod');
    });
    sectionHead(el, t('sheet.saves'));
    const saves = el.createDiv({ cls: 'dnd5e-cs-saves' });
    for (const a of ABILITIES) {
      const save = sheet.saves[a];
      const row = saves.createDiv({
        cls: save.proficient ? 'dnd5e-cs-save is-proficient' : 'dnd5e-cs-save',
      });
      const name = saveName(a, lang);
      row.createSpan({ cls: 'dnd5e-cs-save-name', text: this.nameOf(a) });
      this.rollButton(
        row,
        signed(save.total),
        this.check(who, name, saveName(a, 'en'), d20(save.total), true),
      );
    }
    if (sheet.senses.length > 0) {
      sectionHead(el, t('sheet.senses'));
      const senses = el.createDiv({ cls: 'dnd5e-cs-senses' });
      for (const s of sheet.senses) {
        const name = SENSES[s.id]?.[lang === 'de' ? 1 : 0] ?? s.id;
        senses.createDiv({ text: `${name} ${this.speed(s.range)}` });
      }
    }
  }

  private drawTab(el: HTMLElement, data: SheetData, sheet: Sheet): void {
    if (this.tab === 'actions') this.actions(el, data.name, sheet);
    else if (this.tab === 'spells') this.spells(el, sheet);
    else if (this.tab === 'features') this.features(el, sheet);
    else if (this.tab === 'inventory') this.inventory(el, data);
    else if (this.tab === 'skills') this.skills(el, data.name, sheet);
    else if (this.tab === 'notes') this.notes(el, data);
    else this.levels(el, data, sheet);
  }

  private actions(el: HTMLElement, who: string, sheet: Sheet): void {
    const { t } = this.deps;
    if (sheet.attacks.length > 0) {
      sectionHead(el, t('sheet.attacks'));
      for (const attack of sheet.attacks) {
        const row = el.createDiv({ cls: 'dnd5e-cs-attack' });
        const name = local(attack.name, this.lang());
        row.createSpan({ cls: 'dnd5e-cs-attack-name', text: name });
        this.rollButton(
          row,
          signed(attack.toHit.total),
          this.check(who, name, name, d20(attack.toHit.total), true),
        );
        const damage = `${name} · ${t('dice.damage')}`;
        this.rollButton(row, attack.damage, {
          ...this.check(who, damage, `${name} damage`, attack.damage, false),
          damage: true,
        });
        row.createSpan({ cls: 'dnd5e-cs-attack-type', text: this.damageType(attack.type) });
      }
    }
    if (sheet.resources.length > 0) {
      sectionHead(el, t('sheet.resources'));
      for (const r of sheet.resources) {
        const row = el.createDiv({ cls: 'dnd5e-cs-resource' });
        row.createSpan({ cls: 'dnd5e-cs-resource-name', text: local(r.name, this.lang()) });
        const rest = t(r.recharge === 'short' ? 'sheet.rest.short' : 'sheet.rest.long');
        const uses = t('sheet.uses', { n: r.uses, rest });
        row.createSpan({
          cls: 'dnd5e-cs-resource-uses',
          text: r.die === null ? uses : `${uses} · ${r.die}`,
        });
      }
    }
    for (const s of sheet.spellcasting) {
      el.createDiv({
        cls: 'dnd5e-cs-casting',
        text: t('sheet.spellcasting', {
          class: this.nameOf(s.class),
          dc: s.dc,
          attack: signed(s.attack),
        }),
      });
    }
  }

  private spells(el: HTMLElement, sheet: Sheet): void {
    const { t } = this.deps;
    if (sheet.spellcasting.length === 0) {
      el.createDiv({ cls: 'dnd5e-cs-muted', text: t('sheet.noSpells') });
      return;
    }
    const [first] = sheet.spellcasting;
    const row = tiles(el);
    row.addClass('dnd5e-cs-spells');
    tile(row, String(first!.dc), t('sheet.dc'));
    tile(row, signed(first!.attack), t('sheet.spellAttack'));
    if (sheet.slots.length > 0) sectionHead(el, t('sheet.slots'));
    sheet.slots.forEach((count, i) => this.slotRow(el, t('sheet.slotLevel', { n: i + 1 }), count));
    if (sheet.pact !== null) {
      sectionHead(el, t('sheet.pact', { n: sheet.pact.level }));
      this.slotRow(el, '', sheet.pact.count);
    }
    for (const s of sheet.spellcasting) {
      el.createDiv({
        cls: 'dnd5e-cs-muted',
        text: t('sheet.spellList', { class: this.nameOf(s.class), list: this.nameOf(s.list) }),
      });
    }
  }

  private slotRow(el: HTMLElement, label: string, count: number): void {
    const row = el.createDiv({ cls: 'dnd5e-cs-slots' });
    if (label !== '') row.createSpan({ cls: 'dnd5e-cs-slots-label', text: label });
    for (let i = 0; i < count; i++) row.createSpan({ cls: 'dnd5e-cs-slot' });
  }

  private features(el: HTMLElement, sheet: Sheet): void {
    const groups = new Map<string, Sheet['features']>();
    for (const f of sheet.features) groups.set(f.from, [...(groups.get(f.from) ?? []), f]);
    for (const [from, features] of groups) {
      sectionHead(el, this.nameOf(from));
      for (const f of features) {
        const item = el.createEl('details', { cls: 'dnd5e-cs-feature' });
        item.createEl('summary', { text: local(f.name, this.lang()) });
        this.deps.render(
          local(f.text, this.lang()),
          item.createDiv({ cls: 'dnd5e-cs-feature-text' }),
          this,
        );
      }
    }
    el.createDiv({ cls: 'dnd5e-cs-muted dnd5e-cs-attribution', text: this.deps.t('sheet.srd') });
  }

  private inventory(el: HTMLElement, data: SheetData): void {
    const { t } = this.deps;
    const items = data.character?.inventory ?? [];
    if (items.length === 0) {
      el.createDiv({ cls: 'dnd5e-cs-muted', text: t('sheet.noItems') });
      return;
    }
    for (const item of items) {
      const row = el.createDiv({ cls: 'dnd5e-cs-item' });
      const quantity =
        item.quantity !== undefined && item.quantity > 1 ? ` × ${item.quantity}` : '';
      row.createSpan({ text: `${this.nameOf(item.item)}${quantity}` });
      if (item.equipped === true) pill(row, t('sheet.equipped'), true);
    }
  }

  private skills(el: HTMLElement, who: string, sheet: Sheet): void {
    const { t } = this.deps;
    const lang = this.lang();
    const short = t('statblock.abilities').split(',');
    const rows = this.deps
      .rules()
      .data.skills.map((s) => ({ s, name: skillName(s.id.replace(/-/g, '_'), lang) }))
      .sort((a, b) => a.name.localeCompare(b.name, lang));
    for (const { s, name } of rows) {
      const value = sheet.skills[s.id];
      if (value === undefined) continue;
      const rank =
        value.rank === 2
          ? 'expertise'
          : value.rank === 1
            ? 'proficient'
            : value.rank === 0.5
              ? 'half'
              : '';
      const row = el.createDiv({
        cls: rank === '' ? 'dnd5e-cs-skill' : `dnd5e-cs-skill is-${rank}`,
      });
      const marker = row.createSpan({ cls: 'dnd5e-cs-rank' });
      if (rank !== '') marker.setAttr('aria-label', t(`sheet.rank.${rank}`));
      row.createSpan({ cls: 'dnd5e-cs-skill-name', text: name });
      row.createSpan({
        cls: 'dnd5e-cs-skill-ability',
        text: short[ABILITIES.indexOf(s.ability)] ?? s.ability,
      });
      const english = skillName(s.id.replace(/-/g, '_'), 'en');
      this.rollButton(
        row,
        signed(value.total),
        this.check(who, name, english, d20(value.total), true),
      );
    }
  }

  private notes(el: HTMLElement, data: SheetData): void {
    const { t } = this.deps;
    el.createDiv({ cls: 'dnd5e-cs-muted', text: t('sheet.notesHint') });
    const button = el.createEl('button', { cls: 'dnd5e-cs-open-note', text: t('sheet.openNote') });
    button.addEventListener('click', () => this.deps.openNote(data.path));
  }

  private levels(el: HTMLElement, data: SheetData, sheet: Sheet): void {
    const { t } = this.deps;
    const levels = data.character?.levels ?? [];
    levels.forEach((entry, i) => {
      const row = el.createDiv({ cls: 'dnd5e-cs-level' });
      row.createSpan({ cls: 'dnd5e-cs-level-number', text: String(i + 1) });
      row.createSpan({ cls: 'dnd5e-cs-level-class', text: this.nameOf(entry.class) });
      const hp = sheet.hp.sources.find((s) => s.label === `level-${i + 1}`)?.value;
      if (hp !== undefined) {
        row.createSpan({ cls: 'dnd5e-cs-level-hp', text: t('sheet.levelHp', { n: hp }) });
      }
      const chosen = Object.values(entry.choices)
        .flat()
        .map((id) => this.nameOf(id));
      if (chosen.length > 0) {
        row.createSpan({ cls: 'dnd5e-cs-level-choices', text: chosen.join(', ') });
      }
    });
  }

  // ---- a hand-written note ----

  private drawHandWritten(el: HTMLElement, data: SheetData): void {
    const fm = data.frontmatter;
    const num = (v: unknown) => (typeof v === 'number' ? v : null);
    const str = (v: unknown) => (typeof v === 'string' || typeof v === 'number' ? String(v) : '');
    const level = num(fm.level);
    const hp = num(fm.hp);
    const current = num(fm.hp_current) ?? hp;
    const sub = str(fm.subclass) === '' ? '' : ` (${str(fm.subclass)})`;
    const origin = [str(fm.race ?? fm.species), `${str(fm.class)} ${level ?? ''}`.trim() + sub];
    this.head(
      el,
      data.name,
      origin.filter((p) => p !== '').join(' · '),
      hp === null ? '—' : `${current} / ${hp}`,
    );
    const initiative = num(fm.initiative);
    const speed = num(fm.speed);
    const passive = num(fm.passive_perception);
    this.keyTiles(el, [
      [str(fm.ac) || '—', 'sheet.ac'],
      [initiative === null ? '—' : signed(initiative), 'sheet.initiative'],
      [speed === null ? '—' : this.speed(speed), 'sheet.speed'],
      [
        level === null ? '—' : signed(2 + Math.floor((Math.max(1, level) - 1) / 4)),
        'sheet.proficiency',
      ],
      [passive === null ? '—' : String(passive), 'sheet.passive'],
    ]);
    el.createDiv({ cls: 'dnd5e-cs-hand-written', text: this.deps.t('sheet.handWritten') });
    const { saves, skills } = characterBonuses(fm, null);
    const list = (head: StringKey, bonuses: Bonus[], kind: 'saves' | 'skills') => {
      if (bonuses.length === 0) return;
      sectionHead(el, this.deps.t(head));
      for (const b of bonuses) {
        const one = { saves: kind === 'saves' ? [b] : [], skills: kind === 'skills' ? [b] : [] };
        const [check] = checks(data.name, one, this.lang());
        if (check === undefined) continue;
        const row = el.createDiv({ cls: kind === 'saves' ? 'dnd5e-cs-save' : 'dnd5e-cs-skill' });
        row.createSpan({
          cls: `dnd5e-cs-${kind === 'saves' ? 'save' : 'skill'}-name`,
          text: check.name,
        });
        this.rollButton(row, signed(b.bonus), check);
      }
    };
    list('sheet.saves', saves, 'saves');
    list('sheet.tab.skills', skills, 'skills');
  }
}
