// The New NPC dialog: race and archetype as tiles with a search, a lock per rolled field, Roll
// everything, and a live preview card of the NPC as it will be written.

import { type App, Modal, Notice, parseYaml, setIcon, Setting } from 'obsidian';

import { PARTY, UNAFFILIATED } from '../factions/discover';
import type { FactionWorld } from '../factions/model';
import type { T } from '../i18n/strings';
import { type Archetype, byChallenge, searchArchetypes } from '../npc/archetypes';
import type { LineField, NpcChoices } from '../npc/note';
import { type Lang, type Race, rollAge, rollLooks, searchRaces } from '../npc/races';
import { SRD_RACES } from '../npc/srd-races';
import { parseStatblock, type Statblock } from '../npc/statblock';
import { pick, type TableName } from '../npc/tables';
import { raceLabel, type Tables } from './npc-modal';
import { renderShortStats } from './statblock-view';

const HUMAN = SRD_RACES.find((r) => r.name === 'Human') as Race;

/** A Lucide icon per SRD race; the GM's own races get a feather. */
const RACE_ICONS: Record<string, string> = {
  Dwarf: 'pickaxe',
  Elf: 'leaf',
  Halfling: 'footprints',
  Human: 'user',
  Dragonborn: 'flame',
  Gnome: 'cog',
  'Half-Elf': 'sprout',
  'Half-Orc': 'axe',
  Tiefling: 'moon',
};

/** A distance in the dice language: feet in English, metres in German (5 ft. = 1.5 m). */
function distance(feet: number, lang: Lang): string {
  return lang === 'de' ? `${(feet * 0.3).toLocaleString('de-DE')} m` : `${feet} ft.`;
}

/** A race's size and darkvision in the dice language, like its name on the tile. */
const RACE_WORDS: Record<Lang, Record<Race['size'] | 'darkvision', string>> = {
  en: { Tiny: 'Tiny', Small: 'Small', Medium: 'Medium', Large: 'Large', darkvision: 'darkvision' },
  de: {
    Tiny: 'Winzig',
    Small: 'Klein',
    Medium: 'Mittelgroß',
    Large: 'Groß',
    darkvision: 'Dunkelsicht',
  },
};

/** The factions a new NPC can join: the campaign's factions by place, then Party and Unaffiliated. */
function factionOptions(world: FactionWorld, t: T): [string, string][] {
  const depth = (id: string): number => {
    const parent = world.entities.get(id)?.parent ?? null;
    return parent === null ? 0 : depth(parent) + 1;
  };
  const factions = [...world.entities.values()]
    .filter((e) => e.kind === 'faction' && !e.pseudo)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((e): [string, string] => [e.id, `${'  '.repeat(depth(e.id))}${e.name}`]);
  return [...factions, [PARTY, t('pseudo.party')], [UNAFFILIATED, t('pseudo.unaffiliated')]];
}

export interface NewNpcDeps {
  app: App;
  t: T;
  world: FactionWorld;
  archetypes: readonly Archetype[];
  races: readonly Race[];
  tables: Tables;
  /** The language the dice texts are in (and the dialog shows race names in). */
  lang: Lang;
  /** The faction chosen when the dialog opens (the card it was opened from). */
  faction: string;
  /** Writes and opens the note; resolves when done. */
  create: (choices: NpcChoices, faction: string) => Promise<void>;
  random?: () => number;
}

type TextField = 'name' | 'class' | 'alignment' | 'occupation' | 'age' | LineField;

/** What Roll everything can roll, each with a lock. */
type Rolled = TextField | 'race';

/** The dice table behind each table-rolled field (name, age and appearance roll on their own). */
const ROLLS: Partial<Record<TextField, TableName>> = {
  occupation: 'occupation',
  build: 'build',
  manner: 'manner',
  voice: 'voice',
  want: 'wants',
  ideal: 'ideal',
  bond: 'bond',
  flaw: 'flaw',
  quirk: 'quirks',
  secret: 'secret',
  hook: 'hook',
};

/** The fields under Details, in order. */
const FIELDS: readonly TextField[] = [
  'class',
  'alignment',
  'occupation',
  'age',
  'appearance',
  'build',
  'manner',
  'voice',
  'want',
  'ideal',
  'bond',
  'flaw',
  'quirk',
  'secret',
  'hook',
];

/** The lines the preview lists under their labels, in the order of the fields. */
const LINES = FIELDS.filter(
  (f): f is LineField => !['class', 'alignment', 'occupation', 'age'].includes(f),
);

interface Tile {
  icon: string;
  name: string;
  line: string;
  selected: boolean;
}

export class NewNpcModal extends Modal {
  private readonly values = Object.fromEntries(['name', ...FIELDS].map((f) => [f, ''])) as Record<
    TextField,
    string
  >;
  private readonly inputs = new Map<TextField, (value: string) => void>();
  private readonly rollers = new Map<Rolled, () => void>();
  private readonly locks = new Map<Rolled, (locked: boolean) => void>();
  private readonly locked = new Set<Rolled>();
  private readonly blocks = new Map<Archetype, Statblock | null>();
  private faction: string;
  private race: Race | null = null;
  /** A race typed as free text (no model), written as it is. */
  private freeRace = '';
  private raceQuery = '';
  private archetype: Archetype | null = null;
  private archetypeQuery = '';
  private raceTiles!: HTMLElement;
  private archetypeTiles!: HTMLElement;
  private previewEl!: HTMLElement;
  private busy = false;

  constructor(private readonly deps: NewNpcDeps) {
    super(deps.app);
    this.faction = deps.faction;
  }

  onOpen(): void {
    const { t } = this.deps;
    this.setTitle(t('npc.title'));
    this.modalEl.addClass('dnd5e-npc-modal');
    this.modalEl.addClass('dnd5e-npc-dialog');
    const el = this.contentEl;

    const rollAll = el
      .createDiv({ cls: 'dnd5e-npc-top' })
      .createEl('button', { cls: 'dnd5e-npc-roll-all' });
    setIcon(rollAll.createSpan(), 'dices');
    rollAll.createSpan({ text: t('npc.rollAll') });
    rollAll.addEventListener('click', () => this.rollEverything());

    const body = el.createDiv({ cls: 'dnd5e-npc-body' });
    const form = body.createDiv({ cls: 'dnd5e-npc-form' });
    this.previewEl = body.createDiv({ cls: 'dnd5e-npc-preview' });

    this.field(form, 'name', () => this.rollName());
    new Setting(form).setName(t('npc.faction')).addDropdown((dropdown) => {
      for (const [id, label] of factionOptions(this.deps.world, t)) dropdown.addOption(id, label);
      dropdown.setValue(this.faction).onChange((value) => {
        this.faction = value;
        this.drawPreview();
      });
    });

    this.rollButtons(new Setting(form).setName(t('npc.race')).setHeading(), 'race', () =>
      this.rollRace(),
    );
    this.raceTiles = this.tilePicker(form, t('npc.race.placeholder'), (query) => {
      this.raceQuery = query;
      this.drawRaces();
    });
    this.drawRaces();

    new Setting(form).setName(t('npc.archetype')).setHeading();
    this.archetypeTiles = this.tilePicker(form, t('npc.archetype.search'), (query) => {
      this.archetypeQuery = query;
      this.drawArchetypes();
    });
    this.drawArchetypes();

    new Setting(form).setName(t('npc.details')).setHeading();
    for (const field of FIELDS) {
      const table = ROLLS[field];
      const roll =
        field === 'age'
          ? () => this.set('age', String(rollAge(this.race ?? HUMAN, this.random)))
          : field === 'appearance'
            ? () => this.rollAppearance()
            : table === undefined
              ? undefined
              : () => this.set(field, pick(this.deps.tables[table], this.random));
      this.field(form, field, roll);
    }
    new Setting(form).addButton((button) =>
      button
        .setButtonText(t('npc.create'))
        .setCta()
        .onClick(() => void this.submit()),
    );
    this.drawPreview();
  }

  private get random(): () => number {
    return this.deps.random ?? Math.random;
  }

  /** A text row; with `roll`, its dice and lock. Typing locks a filled field, clearing unlocks it. */
  private field(el: HTMLElement, field: TextField, roll?: () => void): void {
    const setting = new Setting(el).setName(this.deps.t(`npc.${field}`)).addText((text) => {
      text.onChange((value) => {
        this.values[field] = value;
        if (roll !== undefined) this.lock(field, value.trim() !== '');
        this.drawPreview();
      });
      this.inputs.set(field, (value) => {
        text.setValue(value);
        this.values[field] = value;
      });
    });
    if (roll !== undefined) this.rollButtons(setting, field, roll);
  }

  /** A dice button and a lock that Roll everything respects. */
  private rollButtons(setting: Setting, key: Rolled, roll: () => void): void {
    const { t } = this.deps;
    this.rollers.set(key, roll);
    setting.addExtraButton((button) =>
      button
        .setIcon('dices')
        .setTooltip(t('npc.roll'))
        .onClick(() => {
          roll();
          this.drawPreview();
        }),
    );
    setting.addExtraButton((button) => {
      const show = (locked: boolean) => {
        button
          .setIcon(locked ? 'lock' : 'lock-open')
          .setTooltip(t(locked ? 'npc.unlock' : 'npc.lock'));
        setting.settingEl.toggleClass('is-locked', locked);
      };
      this.locks.set(key, show);
      show(false);
      button.onClick(() => this.lock(key, !this.locked.has(key)));
    });
  }

  private lock(key: Rolled, locked: boolean): void {
    if (locked) this.locked.add(key);
    else this.locked.delete(key);
    this.locks.get(key)?.(locked);
  }

  /** A search field over a grid of tiles; returns the grid. */
  private tilePicker(
    el: HTMLElement,
    placeholder: string,
    search: (q: string) => void,
  ): HTMLElement {
    const wrap = el.createDiv({ cls: 'dnd5e-npc-picker' });
    const input = wrap.createEl('input', {
      cls: 'dnd5e-npc-search',
      attr: { type: 'search', placeholder },
    });
    input.addEventListener('input', () => search(input.value));
    return wrap.createDiv({ cls: 'dnd5e-npc-tiles' });
  }

  private tile(parent: HTMLElement, tile: Tile, click: () => void): void {
    const button = parent.createEl('button', {
      cls: tile.selected ? ['dnd5e-npc-tile', 'is-selected'] : 'dnd5e-npc-tile',
      attr: { 'aria-pressed': String(tile.selected) },
    });
    setIcon(button.createDiv({ cls: 'dnd5e-npc-tile-icon' }), tile.icon);
    const text = button.createDiv({ cls: 'dnd5e-npc-tile-text' });
    text.createDiv({ cls: 'dnd5e-npc-tile-name', text: tile.name });
    if (tile.line !== '') text.createDiv({ cls: 'dnd5e-npc-tile-line', text: tile.line });
    button.addEventListener('click', click);
  }

  private drawRaces(): void {
    const { t, lang } = this.deps;
    this.raceTiles.empty();
    const races = searchRaces(this.deps.races, this.raceQuery, lang);
    for (const race of races) {
      const line = [
        RACE_WORDS[lang][race.size],
        distance(race.speed, lang),
        race.darkvision > 0
          ? `${RACE_WORDS[lang].darkvision} ${distance(race.darkvision, lang)}`
          : '',
        race.source === 'srd' ? '' : t('npc.own'),
      ];
      this.tile(
        this.raceTiles,
        {
          icon: race.source === 'srd' ? (RACE_ICONS[race.name] ?? 'user') : 'feather',
          name: raceLabel(race, lang),
          line: line.filter((p) => p !== '').join(' · '),
          selected: race === this.race,
        },
        () => this.chooseRace(race === this.race ? null : race, ''),
      );
    }
    const typed = this.raceQuery.trim();
    if (races.length === 0 && typed !== '') {
      this.tile(
        this.raceTiles,
        {
          icon: 'pencil',
          name: t('npc.race.free', { name: typed }),
          line: t('npc.race.freeLine'),
          selected: this.freeRace === typed,
        },
        () => this.chooseRace(null, this.freeRace === typed ? '' : typed),
      );
    }
  }

  /** Picks a race model or a free race (or none); the GM's pick is locked. */
  private chooseRace(race: Race | null, free: string, byHand = true): void {
    this.race = race;
    this.freeRace = free;
    if (byHand) this.lock('race', race !== null || free !== '');
    this.drawRaces();
    this.drawPreview();
  }

  private rollRace(): void {
    const races = this.deps.races;
    this.chooseRace(races[Math.floor(this.random() * races.length)] ?? null, '', false);
  }

  private drawArchetypes(): void {
    const { t } = this.deps;
    this.archetypeTiles.empty();
    if (this.archetypeQuery.trim() === '') {
      this.tile(
        this.archetypeTiles,
        {
          icon: 'file',
          name: t('npc.archetype.noneName'),
          line: t('npc.archetype.noneLine'),
          selected: this.archetype === null,
        },
        () => this.chooseArchetype(null),
      );
    }
    for (const archetype of byChallenge(
      searchArchetypes(this.deps.archetypes, this.archetypeQuery),
    )) {
      const block = this.block(archetype);
      const line = block === null ? '' : this.stats(block);
      this.tile(
        this.archetypeTiles,
        {
          icon: archetype.source === 'srd' ? 'shield' : 'feather',
          name: archetype.name,
          line:
            archetype.source === 'srd' ? line : [line, t('npc.own')].filter(Boolean).join(' · '),
          selected: archetype === this.archetype,
        },
        () => this.chooseArchetype(archetype === this.archetype ? null : archetype),
      );
    }
  }

  private chooseArchetype(archetype: Archetype | null): void {
    this.archetype = archetype;
    this.drawArchetypes();
    this.drawPreview();
  }

  /** `AC 16 · HP 11 · CR 1/8` with the short stats' labels of the dialog's language. */
  private stats(block: Statblock): string {
    const [ac, hp, cr] = this.deps.t('statblock.short').split(',');
    return [
      block.ac === null ? '' : `${ac} ${block.ac}`,
      block.hp === null ? '' : `${hp} ${block.hp}`,
      block.cr === null ? '' : `${cr} ${block.cr}`,
    ]
      .filter((p) => p !== '')
      .join(' · ');
  }

  /** An archetype's parsed stat block, parsed once. */
  private block(archetype: Archetype): Statblock | null {
    if (!this.blocks.has(archetype)) {
      let block: Statblock | null = null;
      try {
        block = parseStatblock(parseYaml(archetype.yaml));
      } catch {
        // An archetype that does not parse shows no numbers.
      }
      this.blocks.set(archetype, block);
    }
    return this.blocks.get(archetype) ?? null;
  }

  /** Every unlocked roll: the race first, as name, age and looks follow it. */
  private rollEverything(): void {
    for (const [key, roll] of this.rollers) {
      if (key === 'race' && !this.locked.has(key)) roll();
    }
    for (const [key, roll] of this.rollers) {
      if (key !== 'race' && !this.locked.has(key)) roll();
    }
    this.drawPreview();
  }

  private set(field: TextField, value: string): void {
    this.inputs.get(field)?.(value);
  }

  /** First and family name from the race's lists, or the general ones. */
  private rollName(): void {
    const race = this.race;
    const { tables } = this.deps;
    const first = race?.names.length ? race.names : tables['first-names'];
    const family = race?.familyNames.length ? race.familyNames : tables['family-names'];
    this.set('name', `${pick(first, this.random)} ${pick(family, this.random)}`);
  }

  /** The race's looks and one detail from the appearance table. */
  private rollAppearance(): void {
    const looks = this.race === null ? '' : rollLooks(this.race, this.deps.lang, this.random);
    const detail = pick(this.deps.tables.appearance, this.random);
    this.set('appearance', [looks, detail].filter((p) => p !== '').join('; '));
  }

  private drawPreview(): void {
    const { t, lang } = this.deps;
    const v = (field: TextField) => this.values[field].trim();
    this.previewEl.empty();
    const card = this.previewEl.createDiv({ cls: 'dnd5e-npc-card' });
    card.createDiv({ cls: 'dnd5e-npc-card-eyebrow', text: t('npc.preview') });
    const name = v('name');
    card.createDiv({
      cls: name === '' ? ['dnd5e-npc-card-name', 'is-empty'] : 'dnd5e-npc-card-name',
      text: name === '' ? t('npc.preview.unnamed') : name,
    });
    const age = v('age');
    const sub = [
      this.race === null ? this.freeRace : raceLabel(this.race, lang),
      v('occupation'),
      /^\d+$/.test(age) ? t('npc.preview.age', { age }) : age,
    ].filter((p) => p !== '');
    if (sub.length > 0) card.createDiv({ cls: 'dnd5e-npc-card-sub', text: sub.join(' · ') });

    const faction = factionOptions(this.deps.world, t).find(([id]) => id === this.faction)?.[1];
    const tags = card.createDiv({ cls: 'dnd5e-npc-card-tags' });
    for (const tag of [faction?.trim() ?? '', v('class'), v('alignment')]) {
      if (tag !== '') tags.createSpan({ cls: 'dnd5e-npc-card-tag', text: tag });
    }
    if (this.race !== null && this.race.traits.length > 0) {
      card.createDiv({
        cls: 'dnd5e-npc-card-traits',
        text: this.race.traits.map((trait) => trait.name).join(' · '),
      });
    }
    if (this.archetype !== null) {
      const block = this.block(this.archetype);
      const stats = card.createDiv({ cls: 'dnd5e-npc-card-archetype' });
      stats.createDiv({ cls: 'dnd5e-npc-card-label', text: this.archetype.name });
      if (block !== null) renderShortStats(stats, block, t);
    }
    for (const field of LINES) {
      const value = v(field);
      if (value === '') continue;
      const row = card.createDiv({
        cls: field === 'secret' ? ['dnd5e-npc-card-line', 'is-secret'] : 'dnd5e-npc-card-line',
      });
      const label = row.createDiv({ cls: 'dnd5e-npc-card-label' });
      if (field === 'secret') setIcon(label.createSpan(), 'eye-off');
      label.createSpan({ text: t(`npc.${field}`) });
      row.createDiv({ text: value });
    }
    const empty = name === '' && this.race === null && this.archetype === null;
    if (empty && LINES.every((field) => v(field) === '')) {
      card.createDiv({ cls: 'dnd5e-npc-card-hint', text: t('npc.preview.hint') });
    }
  }

  private async submit(): Promise<void> {
    const { t } = this.deps;
    const name = this.values.name.trim();
    if (name === '') {
      new Notice(t('npc.needName'));
      return;
    }
    if (this.busy) return;
    this.busy = true;
    try {
      await this.deps.create(
        {
          ...this.values,
          name,
          // A model is written by its English name; a free race as typed.
          race: this.race?.name ?? this.freeRace,
          raceModel: this.race,
          archetype: this.archetype,
        },
        this.faction,
      );
      this.close();
    } finally {
      this.busy = false;
    }
  }

  onClose(): void {
    this.contentEl.empty();
  }
}
