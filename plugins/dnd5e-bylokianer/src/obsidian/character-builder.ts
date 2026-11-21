// The New character dialog, built like the spell builder: on the left the form — name and player,
// species, background and class as tiles, the ability scores by one of four methods, one block per
// open choice of creation and of level 1, the equipment — and on the right a live preview made of
// the character sheet's own head, tiles and ability column, with what is still missing. It hands
// the finished draft over to be written as a `type: character` note; it never rewrites a note.

import {
  ABILITIES,
  type Character,
  type ChoiceSlot,
  derive,
  levelOptions,
  local,
  type Rules,
} from '@obsidian-plugins/rules';
import { type App, Component, Modal, setIcon, Setting } from 'obsidian';

import {
  type AbilityMethod,
  type CharacterDraft,
  draftProblems,
  emptyDraft,
  POINT_BUDGET,
  POINT_COSTS,
  rollAbilities,
  STANDARD_ARRAY,
  toCharacter,
} from '../character/draft';
import type { StringKey, T } from '../i18n/strings';
import type { Lang } from '../npc/races';
import { spellName } from '../spells/meta';
import type { SrdSpell } from '../spells/model';
import {
  abilityColumn,
  builtTiles,
  feetText,
  keyTiles,
  sheetHead,
  signed,
} from './character-sheet-view';
import { sectionHead } from './ui/blocks';

export interface CharacterBuilderDeps {
  t: T;
  lang: Lang;
  rules: Rules;
  /** The spells a spell choice offers. */
  spells: readonly SrdSpell[];
  /** One die, 1 to 6. */
  roll: () => number;
  /** Renders the equipment texts' Markdown, owned by `component`. */
  render: (markdown: string, target: HTMLElement, component: Component) => void;
  /** Writes the character and opens its sheet; the dialog closes once that is done. */
  create: (draft: CharacterDraft) => Promise<void>;
}

const METHODS: readonly AbilityMethod[] = ['standard', 'point-buy', 'rolled', 'typed'];

/** The row of the class's table that holds the starting equipment, in either language. */
function startingEquipment(table: string): string {
  for (const line of table.split('\n')) {
    const cells = line.split('|').map((c) => c.trim());
    if (/equipment|ausrüstung/i.test(cells[1] ?? '')) return cells[2] ?? '';
  }
  return '';
}

export class CharacterBuilderModal extends Modal {
  private draft: CharacterDraft = emptyDraft();
  /** The spell search text per choice. */
  private readonly queries = new Map<string, string>();
  private formEl!: HTMLElement;
  private previewEl!: HTMLElement;
  private equipment: Component | null = null;

  constructor(
    app: App,
    private readonly deps: CharacterBuilderDeps,
  ) {
    super(app);
  }

  onOpen(): void {
    this.setTitle(this.deps.t('characterBuilder.title'));
    this.modalEl.addClass('dnd5e-npc-modal', 'dnd5e-npc-dialog');
    const el = this.contentEl;
    el.addClass('dnd5e-character-builder');
    const body = el.createDiv({ cls: 'dnd5e-npc-body' });
    this.formEl = body.createDiv({ cls: 'dnd5e-npc-form' });
    this.previewEl = body.createDiv({ cls: 'dnd5e-npc-preview' });
    this.renderForm();
  }

  onClose(): void {
    this.equipment?.unload();
    this.equipment = null;
    this.contentEl.empty();
  }

  // ── what the draft makes of itself ─────────────────────────────────────────────────────────

  private character(): Character {
    return toCharacter(this.draft, this.deps.rules);
  }

  /** Every open choice of creation and of the first level. */
  private slots(): ChoiceSlot[] {
    const { rules } = this.deps;
    const c = this.character();
    return [...levelOptions(c, rules, null), ...levelOptions(c, rules, 1)];
  }

  /** A slot's name: its feature's, with the choice's own when that says more. */
  private slotName(slot: ChoiceSlot): string {
    const { lang } = this.deps;
    const feature = local(slot.feature.name, lang);
    const choice = local(slot.choice.name, lang);
    return feature.toLowerCase() === choice.toLowerCase() ? feature : `${feature} · ${choice}`;
  }

  // ── the form ───────────────────────────────────────────────────────────────────────────────

  private renderForm(): void {
    const { t, rules } = this.deps;
    const form = this.formEl;
    const scroll = form.scrollTop;
    form.empty();
    this.equipment?.unload();
    this.equipment = new Component();
    this.equipment.load();

    this.head(form, t('characterBuilder.who'));
    this.text(
      form,
      t('builder.name'),
      this.draft.name,
      (v) => (this.draft.name = v),
      'dnd5e-cb-name',
    );
    this.text(
      form,
      t('characterBuilder.player'),
      this.draft.player,
      (v) => (this.draft.player = v),
      'dnd5e-cb-player',
    );

    this.head(form, t('characterBuilder.species'));
    const species = this.tileGrid(form, 'species');
    for (const s of rules.data.species) {
      const sizes = s.size.map((id) => this.sizeName(id)).join(' / ');
      this.tile(species, 'user', local(s.name, this.deps.lang), `${sizes}, ${this.feet(s.speed)}`, {
        selected: this.draft.species === s.id,
        click: () => this.set(() => (this.draft.species = s.id)),
      });
    }

    this.head(form, t('characterBuilder.background'));
    const backgrounds = this.tileGrid(form, 'background');
    for (const b of rules.data.backgrounds) {
      this.tile(
        backgrounds,
        'scroll',
        local(b.name, this.deps.lang),
        this.abilityList(b.abilities, ', '),
        {
          selected: this.draft.background === b.id,
          click: () => this.set(() => (this.draft.background = b.id)),
        },
      );
    }

    this.head(form, t('characterBuilder.class'));
    const classes = this.tileGrid(form, 'class');
    for (const c of rules.data.classes) {
      const line = `${t('characterBuilder.hitDie', { n: c.hitDie })} · ${this.abilityList(c.primary, ' / ')}`;
      this.tile(classes, 'swords', local(c.name, this.deps.lang), line, {
        selected: this.draft.class === c.id,
        click: () => this.set(() => (this.draft.class = c.id)),
      });
    }

    this.head(form, t('characterBuilder.abilities'));
    this.drawAbilities(form);

    const slots = this.slots();
    if (slots.length > 0) this.head(form, t('characterBuilder.choices'));
    for (const slot of slots) this.drawSlot(form, slot);

    this.head(form, t('characterBuilder.equipment'));
    this.drawEquipment(form);

    form.scrollTop = scroll;
    this.drawPreview();
  }

  /** Changes the draft, then draws everything again. */
  private set(change: () => void): void {
    change();
    this.renderForm();
  }

  private head(parent: HTMLElement, text: string): void {
    sectionHead(parent, text).addClass('dnd5e-cb-section-head');
  }

  private text(
    parent: HTMLElement,
    name: string,
    value: string,
    set: (v: string) => void,
    cls: string,
  ): void {
    new Setting(parent).setName(name).addText((text) => {
      text.inputEl.addClass(cls);
      text.setValue(value).onChange((v) => {
        set(v);
        this.drawPreview();
      });
    });
  }

  private feet(feet: number): string {
    return feetText(feet, this.deps.lang, this.deps.t);
  }

  private sizeName(id: string): string {
    const key = `characterBuilder.size.${id}`;
    return this.deps.t(key as StringKey);
  }

  /** The short names of abilities (STR, DEX …) joined by `glue`. */
  private abilityList(abilities: readonly string[], glue: string): string {
    const short = this.deps.t('statblock.abilities').split(',');
    return abilities.map((a) => short[ABILITIES.findIndex((x) => x === a)] ?? a).join(glue);
  }

  private tileGrid(parent: HTMLElement, name: string): HTMLElement {
    return parent.createDiv({ cls: ['dnd5e-npc-tiles', `dnd5e-cb-${name}`] });
  }

  private tile(
    parent: HTMLElement,
    icon: string,
    name: string,
    line: string,
    options: { selected: boolean; click: () => void },
  ): HTMLElement {
    const { selected, click } = options;
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

  private pill(
    parent: HTMLElement,
    text: string,
    on: boolean,
    click: () => void,
    disabled = false,
  ): HTMLButtonElement {
    const pill = parent.createEl('button', {
      cls: on
        ? ['dnd5e-builder-flag', 'dnd5e-pill', 'is-active']
        : ['dnd5e-builder-flag', 'dnd5e-pill'],
      text,
      attr: { 'aria-pressed': String(on) },
    });
    pill.disabled = disabled;
    pill.addEventListener('click', click);
    return pill;
  }

  // ── the ability scores ─────────────────────────────────────────────────────────────────────

  private drawAbilities(form: HTMLElement): void {
    const { t } = this.deps;
    const d = this.draft;
    const methods = form.createDiv({ cls: 'dnd5e-builder-flags' });
    for (const method of METHODS) {
      const pill = this.pill(
        methods,
        t(`characterBuilder.method.${method}`),
        d.method === method,
        () => this.set(() => this.useMethod(method)),
      );
      pill.addClass('dnd5e-cb-method');
      pill.dataset.method = method;
    }
    const spent = ABILITIES.reduce((sum, a) => sum + (POINT_COSTS[d.abilities[a]] ?? 0), 0);
    if (d.method === 'point-buy') {
      form.createDiv({
        cls: 'dnd5e-cb-points',
        text: t('characterBuilder.pointsLeft', { n: POINT_BUDGET - spent }),
      });
    }
    if (d.method === 'rolled') {
      const row = form.createDiv({ cls: 'dnd5e-cb-roll-row' });
      const roll = row.createEl('button', {
        cls: 'dnd5e-cb-roll',
        text: t('characterBuilder.roll'),
      });
      roll.addEventListener('click', () =>
        this.set(() => {
          d.rolled = rollAbilities(this.deps.roll);
          ABILITIES.forEach((a, i) => (d.abilities[a] = d.rolled[i] ?? d.abilities[a]));
        }),
      );
      if (d.rolled.length === 0) {
        row.createSpan({ cls: 'dnd5e-cb-hint', text: t('characterBuilder.rollFirst') });
      }
    }
    const short = t('statblock.abilities').split(',');
    const grid = form.createDiv({ cls: 'dnd5e-cb-abilities' });
    ABILITIES.forEach((a, i) => {
      const row = grid.createDiv({ cls: 'dnd5e-cb-ability' });
      row.createSpan({ cls: 'dnd5e-cb-ability-name', text: short[i] ?? a });
      const score = d.abilities[a];
      if (d.method === 'standard' || d.method === 'rolled') {
        const values = d.method === 'standard' ? STANDARD_ARRAY : d.rolled;
        const select = row.createEl('select', { cls: 'dnd5e-cb-ability-select' });
        for (const value of values.length > 0 ? values : [score]) {
          select.createEl('option', { text: String(value), attr: { value: String(value) } });
        }
        select.value = String(score);
        select.disabled = values.length === 0;
        select.addEventListener('change', () =>
          this.set(() => this.swapScore(a, Number(select.value))),
        );
      } else if (d.method === 'point-buy') {
        const step = (delta: number, cls: string, label: string) => {
          const next = score + delta;
          const cost = (POINT_COSTS[next] ?? Infinity) - (POINT_COSTS[score] ?? 0);
          const button = row.createEl('button', { cls, text: label });
          button.disabled =
            POINT_COSTS[next] === undefined || (delta > 0 && spent + cost > POINT_BUDGET);
          button.addEventListener('click', () => {
            if (!button.disabled) this.set(() => (d.abilities[a] = next));
          });
        };
        step(-1, 'dnd5e-cb-ability-minus', '−');
        row.createSpan({ cls: 'dnd5e-cb-ability-score', text: String(score) });
        step(1, 'dnd5e-cb-ability-plus', '+');
      } else {
        const input = row.createEl('input', {
          cls: 'dnd5e-cb-ability-input',
          attr: { type: 'number', min: '3', max: '18' },
        });
        input.value = String(score);
        input.addEventListener('input', () => {
          d.abilities[a] = input.valueAsNumber;
          this.drawPreview();
        });
      }
    });
  }

  /** The scores a method starts from; the typed ones stay as they are. */
  private useMethod(method: AbilityMethod): void {
    const d = this.draft;
    d.method = method;
    const assign = (values: number[]) =>
      ABILITIES.forEach((a, i) => (d.abilities[a] = values[i] ?? d.abilities[a]));
    if (method === 'standard') assign(STANDARD_ARRAY);
    else if (method === 'point-buy') assign(ABILITIES.map(() => 8));
    else if (method === 'rolled') assign(d.rolled);
  }

  /** Gives `ability` the score `value`; whoever had it gets the score `ability` had. */
  private swapScore(ability: (typeof ABILITIES)[number], value: number): void {
    const { abilities } = this.draft;
    const other = ABILITIES.find((a) => a !== ability && abilities[a] === value);
    if (other !== undefined) abilities[other] = abilities[ability];
    abilities[ability] = value;
  }

  // ── the choices ────────────────────────────────────────────────────────────────────────────

  private drawSlot(form: HTMLElement, slot: ChoiceSlot): void {
    const block = form.createDiv({ cls: 'dnd5e-cb-slot' });
    block.dataset.key = slot.key;
    block.dataset.wanted = String(slot.wanted);
    block.dataset.chosen = String(slot.chosen.length);
    const head = block.createDiv({ cls: 'dnd5e-cb-slot-head' });
    head.createSpan({ cls: 'dnd5e-cb-slot-name', text: this.slotName(slot) });
    head.createSpan({
      cls: 'dnd5e-cb-slot-count',
      text: this.deps.t('characterBuilder.chosen', { n: slot.chosen.length, wanted: slot.wanted }),
    });
    if (slot.choice.gives === 'ability') this.drawPoints(block, slot);
    else if (slot.spells !== undefined) this.drawSpells(block, slot);
    else {
      const pills = block.createDiv({ cls: ['dnd5e-builder-flags', 'dnd5e-cb-pills'] });
      for (const o of slot.options) {
        this.pill(pills, local(o.name, this.deps.lang), slot.chosen.includes(o.id), () =>
          this.pick(slot, o.id),
        ).dataset.id = o.id;
      }
    }
  }

  /** Adds `id` to the slot's choice or takes it out; nothing is added beyond what is wanted. */
  private pick(slot: ChoiceSlot, id: string): void {
    const now = [...slot.chosen];
    const at = now.indexOf(id);
    if (at !== -1) now.splice(at, 1);
    else if (now.length < slot.wanted) now.push(id);
    else return;
    this.set(() => (this.draft.choices[slot.key] = now));
  }

  /** Ability points: − / + per ability. */
  private drawPoints(block: HTMLElement, slot: ChoiceSlot): void {
    const short = this.deps.t('statblock.abilities').split(',');
    const grid = block.createDiv({ cls: 'dnd5e-cb-points-grid' });
    for (const o of slot.options) {
      const count = slot.chosen.filter((id) => id === o.id).length;
      const i = ABILITIES.findIndex((a) => a === o.id);
      const row = grid.createDiv({ cls: 'dnd5e-cb-point' });
      row.createSpan({
        cls: 'dnd5e-cb-point-name',
        text: short[i] ?? local(o.name, this.deps.lang),
      });
      const change = (delta: number, cls: string, label: string) => {
        const button = row.createEl('button', { cls, text: label });
        button.disabled =
          delta < 0
            ? count === 0
            : count >= (slot.each ?? slot.wanted) || slot.chosen.length >= slot.wanted;
        button.addEventListener('click', () => {
          if (button.disabled) return;
          const now = [...slot.chosen];
          if (delta > 0) now.push(o.id);
          else now.splice(now.lastIndexOf(o.id), 1);
          this.set(() => (this.draft.choices[slot.key] = now));
        });
      };
      change(-1, 'dnd5e-cb-minus', '−');
      row.createSpan({ cls: 'dnd5e-cb-point-count', text: String(count) });
      change(1, 'dnd5e-cb-plus', '+');
    }
  }

  /** The spells a spell slot offers: its class's cantrips, or its leveled spells up to the level. */
  private spellOptions(slot: ChoiceSlot): SrdSpell[] {
    const { lang, spells } = this.deps;
    const spec = slot.spells;
    if (spec === undefined) return [];
    const from = slot.choice.from;
    const exact = 'spells' in from && typeof from.level === 'number';
    const fits = (level: number) =>
      spec.maxLevel === 0
        ? level === 0
        : exact
          ? level === spec.maxLevel
          : level >= 1 && level <= spec.maxLevel;
    return spells
      .filter((s) => (s.classes as readonly string[]).includes(spec.list) && fits(s.level))
      .sort((a, b) => spellName(a, lang).localeCompare(spellName(b, lang), lang));
  }

  private drawSpells(block: HTMLElement, slot: ChoiceSlot): void {
    const { t, lang } = this.deps;
    const search = block.createEl('input', {
      cls: 'dnd5e-npc-search dnd5e-cb-search',
      attr: { type: 'search', placeholder: t('characterBuilder.searchSpells') },
    });
    search.value = this.queries.get(slot.key) ?? '';
    const pills = block.createDiv({ cls: ['dnd5e-builder-flags', 'dnd5e-cb-pills', 'is-spells'] });
    const options = this.spellOptions(slot);
    const draw = () => {
      pills.empty();
      const query = search.value.trim().toLowerCase();
      for (const spell of options) {
        const name = spellName(spell, lang);
        const chosen = slot.chosen.includes(spell.index);
        if (!chosen && query !== '' && !name.toLowerCase().includes(query)) continue;
        this.pill(pills, name, chosen, () => this.pick(slot, spell.index)).dataset.id = spell.index;
      }
    };
    search.addEventListener('input', () => {
      this.queries.set(slot.key, search.value);
      draw();
    });
    draw();
  }

  // ── the equipment ──────────────────────────────────────────────────────────────────────────

  private drawEquipment(form: HTMLElement): void {
    const { t, rules, lang } = this.deps;
    const d = this.draft;
    const box = form.createDiv({ cls: 'dnd5e-cb-equipment' });
    const cls = rules.class(d.class);
    const background = rules.background(d.background);
    const classText = cls?.features.find((f) => f.id === `${cls.id}-core`);
    const backgroundText = background?.features.find((f) => f.id === `${background.id}-equipment`);
    const texts: [string, string][] = [];
    if (cls !== undefined && classText !== undefined) {
      texts.push([local(cls.name, lang), startingEquipment(local(classText.text, lang))]);
    }
    if (background !== undefined && backgroundText !== undefined) {
      texts.push([local(background.name, lang), local(backgroundText.text, lang)]);
    }
    for (const [name, markdown] of texts) {
      if (markdown === '') continue;
      const block = box.createDiv({ cls: 'dnd5e-cb-equip-text' });
      block.createDiv({ cls: 'dnd5e-builder-label', text: name });
      const body = block.createDiv({ cls: 'markdown-rendered' });
      this.deps.render(markdown, body, this.equipment!);
    }

    box.createDiv({ cls: 'dnd5e-builder-label', text: t('characterBuilder.armor') });
    const armor = box.createDiv({ cls: ['dnd5e-npc-tiles', 'dnd5e-cb-armor'] });
    this.tile(armor, 'shirt', t('characterBuilder.noArmor'), '', {
      selected: d.armor === null,
      click: () => this.set(() => (d.armor = null)),
    });
    for (const a of rules.data.armor.filter((x) => x.category !== 'shield')) {
      const line = `${t('sheet.ac')} ${a.ac} · ${t(`characterBuilder.armor.${a.category}` as StringKey)}`;
      this.tile(armor, 'shield', local(a.name, lang), line, {
        selected: d.armor === a.id,
        click: () => this.set(() => (d.armor = d.armor === a.id ? null : a.id)),
      });
    }
    const shield = box.createDiv({ cls: ['dnd5e-builder-flags', 'dnd5e-cb-shield'] });
    this.pill(shield, t('characterBuilder.shield'), d.shield, () =>
      this.set(() => (d.shield = !d.shield)),
    );

    box.createDiv({ cls: 'dnd5e-builder-label', text: t('characterBuilder.weapons') });
    const weapons = box.createDiv({ cls: ['dnd5e-builder-flags', 'dnd5e-cb-weapons'] });
    for (const w of rules.data.weapons) {
      this.pill(weapons, local(w.name, lang), d.weapons.includes(w.id), () =>
        this.set(() => {
          d.weapons = d.weapons.includes(w.id)
            ? d.weapons.filter((x) => x !== w.id)
            : [...d.weapons, w.id];
        }),
      );
    }
  }

  // ── the preview ────────────────────────────────────────────────────────────────────────────

  /** The sentence for a problem code of `draftProblems`. */
  private problem(code: string, slots: ChoiceSlot[]): string {
    const { t } = this.deps;
    if (!code.startsWith('choice:')) return t(`characterBuilder.problem.${code}` as StringKey);
    const slot = slots.find((s) => s.key === code.slice('choice:'.length));
    if (slot === undefined) return code;
    const what = this.slotName(slot);
    return slot.chosen.length < slot.wanted
      ? t('characterBuilder.problem.choice', { n: slot.wanted - slot.chosen.length, what })
      : t('characterBuilder.problem.each', { what });
  }

  private drawPreview(): void {
    const { t, lang, rules } = this.deps;
    const d = this.draft;
    const sheet = derive(this.character(), rules);
    const problems = draftProblems(d, rules);
    const slots = this.slots();
    const card = this.previewEl;
    card.empty();
    card.addClass('dnd5e-npc-card', 'dnd5e-cb-preview', 'dnd5e-cs');
    sectionHead(card, t('npc.preview')).addClass('dnd5e-npc-card-eyebrow');
    sheetHead(
      card,
      t,
      d.name.trim() === '' ? t('characterBuilder.unnamed') : d.name,
      this.sub(),
      String(sheet.hp.total),
    );
    keyTiles(card, t, builtTiles(sheet, lang, t));
    abilityColumn(card, t, sheet, (box, _i, value) =>
      box.createSpan({ cls: 'dnd5e-cs-ability-mod', text: signed(value) }),
    );
    const list = card.createEl('ul', { cls: 'dnd5e-cb-problems' });
    for (const code of problems) list.createEl('li', { text: this.problem(code, slots) });
    const create = card.createEl('button', {
      cls: 'mod-cta dnd5e-cb-create',
      text: t('characterBuilder.create'),
    });
    create.disabled = problems.length > 0;
    create.addEventListener('click', () => void this.finish());
  }

  /** Species, class and background, as far as they are chosen. */
  private sub(): string {
    const { rules, lang } = this.deps;
    const d = this.draft;
    const name = (found: { name: { en: string; de?: string } } | undefined) =>
      found === undefined ? '' : local(found.name, lang);
    return [
      name(rules.species(d.species)),
      name(rules.class(d.class)),
      name(rules.background(d.background)),
    ]
      .filter((p) => p !== '')
      .join(' · ');
  }

  private async finish(): Promise<void> {
    if (draftProblems(this.draft, this.deps.rules).length > 0) return;
    await this.deps.create(this.draft);
    this.close();
  }
}
