// The Battle tab: a fight from an encounter note, laid out like the Monster Manual — the initiative
// order on the left, the picked combatant's card on the right (hit points, conditions, death saves,
// its stat block). Start sets the order (monsters rolled, characters typed in), Begin starts round
// 1, Next and Previous move the turn, End closes the fight. Every change is written to the note's
// `## Combat` section, and read back from it when the tab opens.

import {
  Component,
  ItemView,
  MarkdownRenderer,
  Notice,
  setIcon,
  type WorkspaceLeaf,
} from 'obsidian';

import {
  addCondition,
  begin,
  type Combatant,
  CONDITIONS,
  damage,
  deathSave,
  type Fight,
  type Fighter,
  heal,
  isDead,
  isDefeated,
  isDown,
  nextTurn,
  nudge,
  previousTurn,
  removeCondition,
  rollFor,
  setConcentration,
  setInit,
  setTemp,
  setUp,
} from '../battle/fight';
import { restore, type Table } from '../battle/table';
import type { StringKey, T } from '../i18n/strings';
import { germanBlock } from '../monsters/meta';
import type { Lang } from '../npc/races';
import type { BattleSource, EncounterInfo } from './battle-store';
import { renderStatblock } from './statblock-view';

export const BATTLE_VIEW = 'dnd5e-battle';

export interface BattleDeps {
  t: T;
  lang: () => Lang;
  source: BattleSource;
  /** A random number in [0, 1); the tests replace it. */
  random: () => number;
  /** The encounter shown last, and where a new pick is kept. */
  selected: () => string | null;
  select: (path: string) => void;
  openNote: (path: string) => void;
  /** Links the spell names in a stat block to the spellbook. */
  spells?: (el: HTMLElement) => void;
}

export class BattleView extends ItemView {
  private encounters: EncounterInfo[] = [];
  private path: string | null = null;
  private fighters: Fighter[] = [];
  private fight: Fight | null = null;
  private ended = false;
  /** The combatant whose card shows; the one whose turn it is unless the GM picked another. */
  private picked: string | null = null;
  private amount = '';
  private rounds = '';
  private text: Component | null = null;

  constructor(
    leaf: WorkspaceLeaf,
    private readonly deps: BattleDeps,
  ) {
    super(leaf);
  }

  getViewType(): string {
    return BATTLE_VIEW;
  }

  getDisplayText(): string {
    return this.deps.t('battle.title');
  }

  getIcon(): string {
    return 'swords';
  }

  async onOpen(): Promise<void> {
    this.contentEl.addClass('dnd5e-battle');
    this.encounters = await this.deps.source.encounters();
    const wanted = this.deps.selected();
    const path = this.encounters.some((e) => e.path === wanted)
      ? wanted
      : (this.encounters[0]?.path ?? null);
    if (path !== null) await this.show(path);
    else this.render();
  }

  async onClose(): Promise<void> {
    this.text?.unload();
    this.contentEl.empty();
    return Promise.resolve();
  }

  /** Reads an encounter: its fighters, and the fight its note holds. */
  async show(path: string): Promise<void> {
    this.path = path;
    this.deps.select(path);
    const { fighters, table } = await this.deps.source.load(path);
    this.fighters = fighters;
    this.setTable(table);
    this.render();
  }

  private setTable(table: Table | null): void {
    this.fight = table === null ? null : restore(table, setUp(this.fighters, this.deps.random));
    this.ended = table?.ended ?? false;
    this.picked = null;
  }

  private get lang(): Lang {
    return this.deps.lang();
  }

  /** A change to the fight: shown at once, written to the note. */
  private apply(next: Fight, ended = false): void {
    this.fight = next;
    this.ended = ended;
    this.render();
    if (this.path !== null) void this.deps.source.save(this.path, next, ended);
  }

  private start(): void {
    this.picked = null;
    this.apply(setUp(this.fighters, this.deps.random));
  }

  // ── rendering ──────────────────────────────────────────────────────────────────────────────

  private render(): void {
    this.text?.unload();
    this.text = new Component();
    this.text.load();
    const root = this.contentEl;
    root.empty();
    this.renderHeader(root);
    if (this.path === null) {
      root.createDiv({ cls: 'dnd5e-battle-empty', text: this.deps.t('battle.noEncounters') });
      return;
    }
    const body = root.createDiv({ cls: 'dnd5e-battle-body' });
    const list = body.createDiv({ cls: 'dnd5e-battle-order' });
    const card = body.createDiv({ cls: 'dnd5e-battle-card' });
    if (this.fight === null) {
      this.renderLineup(list);
      card.createDiv({ cls: 'dnd5e-battle-hint', text: this.deps.t('battle.startHint') });
      return;
    }
    for (const c of this.fight.combatants) this.renderRow(list, c);
    const shown = this.fight.combatants.find((c) => c.id === (this.picked ?? this.fight?.turn));
    if (shown !== undefined) this.renderCard(card, shown);
    else card.createDiv({ cls: 'dnd5e-battle-hint', text: this.deps.t('battle.pickHint') });
  }

  private renderHeader(root: HTMLElement): void {
    const { t } = this.deps;
    const header = root.createDiv({ cls: 'dnd5e-battle-header' });
    if (this.encounters.length > 0) {
      const select = header.createEl('select', {
        cls: ['dropdown', 'dnd5e-battle-picker'],
        attr: { 'aria-label': t('battle.encounter') },
      });
      for (const e of this.encounters)
        select.createEl('option', { text: e.title, attr: { value: e.path } });
      select.value = this.path ?? '';
      select.addEventListener('change', () => void this.show(select.value));
    }
    const path = this.path;
    if (path !== null) {
      const open = header.createEl('button', {
        cls: 'clickable-icon',
        attr: { 'aria-label': t('battle.openNote') },
      });
      setIcon(open, 'file-text');
      open.addEventListener('click', () => this.deps.openNote(path));
    }
    header.createDiv({ cls: 'dnd5e-battle-spacer' });
    const f = this.fight;
    const button = (text: StringKey, cls: string, run: () => void, cta = false, icon = '') => {
      const b = header.createEl('button', { cls: cta ? ['mod-cta', cls] : cls });
      if (icon !== '') setIcon(b.createSpan(), icon);
      b.createSpan({ text: t(text) });
      b.addEventListener('click', run);
      return b;
    };
    if (path === null) return;
    if (f === null || this.ended) {
      button(
        f === null ? 'battle.start' : 'battle.again',
        'dnd5e-battle-start',
        () => this.start(),
        true,
        'swords',
      );
      if (this.ended && f !== null) {
        header.createSpan({
          cls: 'dnd5e-battle-round',
          text: f.round === 1 ? t('battle.ended.one') : t('battle.ended', { rounds: f.round }),
        });
      }
      return;
    }
    if (f.round === 0) {
      button('battle.begin', 'dnd5e-battle-begin', () => this.apply(begin(f)), true, 'play');
    } else {
      header.createSpan({ cls: 'dnd5e-battle-round', text: t('battle.round', { round: f.round }) });
      const prev = header.createEl('button', {
        cls: ['clickable-icon', 'dnd5e-battle-prev'],
        attr: { 'aria-label': t('battle.previous') },
      });
      setIcon(prev, 'chevron-left');
      prev.addEventListener('click', () => {
        this.picked = null;
        this.apply(previousTurn(f));
      });
      button(
        'battle.next',
        'dnd5e-battle-next',
        () => {
          this.picked = null;
          this.apply(nextTurn(f));
        },
        true,
        'chevron-right',
      );
    }
    button('battle.end', 'dnd5e-battle-end', () => this.apply(f, true), false, 'flag');
  }

  /** Before the fight: who will be in it. */
  private renderLineup(list: HTMLElement): void {
    const { t } = this.deps;
    list.createDiv({
      cls: 'dnd5e-battle-section',
      text: t('battle.lineup', { count: this.fighters.length }),
    });
    for (const f of this.fighters) {
      const row = list.createDiv({ cls: ['dnd5e-battle-row', `is-${f.side}`] });
      row.createDiv({ cls: 'dnd5e-battle-name', text: f.name });
      row.createDiv({
        cls: 'dnd5e-battle-meta',
        text: [
          t(`battle.side.${f.side}`),
          f.ac === null ? '' : t('battle.ac', { ac: f.ac }),
          t('battle.hp', { hp: f.maxHp, max: f.maxHp }),
        ]
          .filter(Boolean)
          .join(' · '),
      });
    }
  }

  private renderRow(list: HTMLElement, c: Combatant): void {
    const { t } = this.deps;
    const f = this.fight;
    if (f === null) return;
    const cls = ['dnd5e-battle-row', `is-${c.side}`];
    if (c.id === f.turn) cls.push('is-turn');
    if (c.id === this.picked) cls.push('is-picked');
    if (isDefeated(c) || isDead(c)) cls.push('is-out');
    if (isDown(c)) cls.push('is-down');
    const row = list.createDiv({ cls, attr: { role: 'button', tabindex: '0' } });
    row.dataset.id = c.id;

    const init = row.createDiv({ cls: 'dnd5e-battle-init' });
    if (f.round === 0) {
      const input = init.createEl('input', {
        attr: { type: 'number', inputmode: 'numeric', 'aria-label': t('battle.initiative') },
      });
      input.value = c.init === null ? '' : String(c.init);
      input.addEventListener('click', (e) => e.stopPropagation());
      input.addEventListener('change', () => {
        const n = Number(input.value);
        this.apply(setInit(f, c.id, input.value.trim() === '' || !Number.isFinite(n) ? null : n));
      });
      const roll = init.createEl('button', {
        cls: ['clickable-icon', 'dnd5e-battle-roll'],
        attr: { 'aria-label': t('battle.roll') },
      });
      setIcon(roll, 'dices');
      roll.addEventListener('click', (e) => {
        e.stopPropagation();
        this.apply(rollFor(f, c.id, this.deps.random));
      });
    } else {
      init.setText(c.init === null ? '—' : String(c.init));
    }

    const main = row.createDiv({ cls: 'dnd5e-battle-main' });
    main.createDiv({ cls: 'dnd5e-battle-name', text: c.id });
    const bar = main.createDiv({ cls: 'dnd5e-battle-hpbar' });
    const fill = bar.createDiv({ cls: 'dnd5e-battle-hpfill' });
    const ratio = c.maxHp > 0 ? Math.max(0, Math.min(1, c.hp / c.maxHp)) : 0;
    fill.setCssProps({ '--dnd5e-hp': `${Math.round(ratio * 100)}%` });
    fill.toggleClass('is-low', ratio <= 0.5);
    fill.toggleClass('is-critical', ratio <= 0.25);
    const meta = main.createDiv({ cls: 'dnd5e-battle-meta' });
    meta.createSpan({
      text: t('battle.hp', { hp: c.hp, max: c.maxHp }) + (c.temp > 0 ? ` +${c.temp}` : ''),
    });
    if (c.ac !== null) meta.createSpan({ text: t('battle.ac', { ac: c.ac }) });
    const chips = main.createDiv({ cls: 'dnd5e-battle-chips' });
    if (isDefeated(c))
      chips.createSpan({ cls: ['dnd5e-battle-chip', 'is-out'], text: t('battle.defeated') });
    if (isDead(c))
      chips.createSpan({ cls: ['dnd5e-battle-chip', 'is-out'], text: t('battle.dead') });
    else if (isDown(c)) {
      chips.createSpan({
        cls: ['dnd5e-battle-chip', 'is-down'],
        text: `${t('battle.down')} ${'✓'.repeat(c.saves.ok)}${'✗'.repeat(c.saves.fail)}`.trim(),
      });
    }
    if (c.concentration)
      chips.createSpan({ cls: 'dnd5e-battle-chip', text: t('battle.concentration') });
    for (const k of c.conditions) {
      chips.createSpan({ cls: 'dnd5e-battle-chip', text: this.conditionText(k.name, k.rounds) });
    }

    if (f.round === 0) {
      const moves = row.createDiv({ cls: 'dnd5e-battle-moves' });
      for (const [icon, by, key] of [
        ['chevron-up', -1, 'battle.up'],
        ['chevron-down', 1, 'battle.downward'],
      ] as const) {
        const b = moves.createEl('button', {
          cls: 'clickable-icon',
          attr: { 'aria-label': t(key) },
        });
        setIcon(b, icon);
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          this.apply(nudge(f, c.id, by));
        });
      }
    }
    const pick = () => {
      this.picked = c.id;
      this.render();
    };
    row.addEventListener('click', pick);
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pick();
      }
    });
  }

  private conditionText(name: string, rounds: number | null): string {
    const { t } = this.deps;
    const known = (CONDITIONS as readonly string[]).includes(name);
    const label = known ? t(`battle.condition.${name as (typeof CONDITIONS)[number]}`) : name;
    return rounds === null ? label : `${label} (${rounds})`;
  }

  private renderCard(card: HTMLElement, c: Combatant): void {
    const { t } = this.deps;
    const f = this.fight;
    if (f === null) return;
    card.addClass(`is-${c.side}`);
    const head = card.createDiv({ cls: 'dnd5e-battle-card-head' });
    head.createDiv({ cls: 'dnd5e-battle-card-name', text: c.id });
    head.createSpan({ cls: 'dnd5e-battle-side', text: t(`battle.side.${c.side}`) });
    const path = c.path;
    if (path !== null) {
      const open = head.createEl('button', {
        cls: 'clickable-icon',
        attr: { 'aria-label': t('battle.openNote') },
      });
      setIcon(open, 'file-text');
      open.addEventListener('click', () => this.deps.openNote(path));
    }

    const numbers = card.createDiv({ cls: 'dnd5e-battle-numbers' });
    const big = (label: StringKey, value: string) => {
      const box = numbers.createDiv({ cls: 'dnd5e-battle-number' });
      box.createDiv({ cls: 'dnd5e-battle-number-label', text: t(label) });
      box.createDiv({ cls: 'dnd5e-battle-number-value', text: value });
    };
    big('battle.hpLabel', `${c.hp} / ${c.maxHp}`);
    big('battle.tempLabel', String(c.temp));
    big('battle.acLabel', c.ac === null ? '—' : String(c.ac));
    big('battle.initLabel', c.init === null ? '—' : String(c.init));

    // Hit points: one number, three buttons.
    const hp = card.createDiv({ cls: 'dnd5e-battle-hp' });
    const input = hp.createEl('input', {
      cls: 'dnd5e-battle-amount',
      attr: {
        type: 'number',
        inputmode: 'numeric',
        min: '0',
        placeholder: t('battle.amount'),
        'aria-label': t('battle.amount'),
      },
    });
    input.value = this.amount;
    input.addEventListener('input', () => (this.amount = input.value));
    const read = () => {
      const n = Math.floor(Number(input.value));
      return Number.isFinite(n) && n > 0 ? n : 0;
    };
    const act = (key: StringKey, cls: string, run: (n: number) => void) => {
      const b = hp.createEl('button', { cls, text: t(key) });
      b.addEventListener('click', () => {
        const n = read();
        if (n === 0) return;
        this.amount = '';
        run(n);
      });
    };
    act('battle.damage', 'dnd5e-battle-damage', (n) => {
      const result = damage(f, c.id, n);
      if (result.concentrationDc !== null) {
        new Notice(t('battle.concentrationCheck', { name: c.id, dc: result.concentrationDc }));
      }
      this.apply(result.fight);
    });
    act('battle.heal', 'dnd5e-battle-heal', (n) => this.apply(heal(f, c.id, n)));
    act('battle.temp', 'dnd5e-battle-temp', (n) => this.apply(setTemp(f, c.id, n)));

    if (isDown(c) && !isDead(c)) {
      const saves = card.createDiv({ cls: 'dnd5e-battle-saves' });
      saves.createSpan({
        cls: 'dnd5e-battle-section',
        text: t('battle.deathSaves', { ok: c.saves.ok, fail: c.saves.fail }),
      });
      const ok = saves.createEl('button', {
        cls: 'dnd5e-battle-save-ok',
        text: t('battle.saveOk'),
      });
      ok.addEventListener('click', () => this.apply(deathSave(f, c.id, true)));
      const fail = saves.createEl('button', {
        cls: 'dnd5e-battle-save-fail',
        text: t('battle.saveFail'),
      });
      fail.addEventListener('click', () => this.apply(deathSave(f, c.id, false)));
    }

    // Conditions: a chip per SRD condition; a duration applies to the one added next.
    card.createDiv({ cls: 'dnd5e-battle-section', text: t('battle.conditions') });
    const duration = card.createDiv({ cls: 'dnd5e-battle-duration' });
    duration.createSpan({ text: t('battle.rounds') });
    const roundsInput = duration.createEl('input', {
      attr: {
        type: 'number',
        inputmode: 'numeric',
        min: '1',
        placeholder: '∞',
        'aria-label': t('battle.rounds'),
      },
    });
    roundsInput.value = this.rounds;
    roundsInput.addEventListener('input', () => (this.rounds = roundsInput.value));
    const chips = card.createDiv({ cls: 'dnd5e-battle-condition-chips' });
    const has = new Map(c.conditions.map((k) => [k.name, k]));
    const concentration = chips.createEl('button', {
      cls: c.concentration ? ['dnd5e-builder-flag', 'is-active'] : 'dnd5e-builder-flag',
      text: t('battle.concentration'),
      attr: { 'aria-pressed': String(c.concentration) },
    });
    concentration.addEventListener('click', () =>
      this.apply(setConcentration(f, c.id, !c.concentration)),
    );
    for (const name of CONDITIONS) {
      const on = has.get(name);
      const chip = chips.createEl('button', {
        cls: on !== undefined ? ['dnd5e-builder-flag', 'is-active'] : 'dnd5e-builder-flag',
        text: this.conditionText(name, on?.rounds ?? null),
        attr: { 'aria-pressed': String(on !== undefined) },
      });
      chip.dataset.condition = name;
      chip.addEventListener('click', () => {
        if (on !== undefined) {
          this.apply(removeCondition(f, c.id, name));
          return;
        }
        const n = Math.floor(Number(roundsInput.value));
        this.rounds = '';
        this.apply(addCondition(f, c.id, name, Number.isFinite(n) && n > 0 ? n : null));
      });
    }
    // Conditions the GM typed into the note by hand.
    for (const k of c.conditions.filter(
      (x) => !(CONDITIONS as readonly string[]).includes(x.name),
    )) {
      const chip = chips.createEl('button', {
        cls: ['dnd5e-builder-flag', 'is-active'],
        text: this.conditionText(k.name, k.rounds),
      });
      chip.addEventListener('click', () => this.apply(removeCondition(f, c.id, k.name)));
    }

    const block = card.createDiv({ cls: 'dnd5e-battle-statblock' });
    const component = this.text;
    void this.deps.source.statblock(c).then((sb) => {
      if (sb === null || component === null) return;
      const shown =
        this.lang === 'de' && c.monster !== null ? germanBlock(sb, c.id) : { ...sb, name: c.id };
      renderStatblock(block, shown, {
        t,
        markdown: (md, el) => MarkdownRenderer.render(this.app, md, el, c.path ?? '', component),
        spells: this.deps.spells,
      });
    });
  }
}
