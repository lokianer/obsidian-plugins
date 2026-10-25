// The NPC builder in Obsidian: the New NPC dialog (name, faction, race, archetype, many fields with
// dice), the New archetype and New race dialogs, the archetype picker of Add stat block, and loading
// the GM's own archetypes, races and table notes.

import {
  AbstractInputSuggest,
  type App,
  FuzzySuggestModal,
  Modal,
  normalizePath,
  Notice,
  parseYaml,
  Setting,
  TFile,
} from 'obsidian';

import { PARTY, UNAFFILIATED } from '../factions/discover';
import type { FactionWorld } from '../factions/model';
import type { StringKey, T } from '../i18n/strings';
import { type Archetype, ownArchetype, searchArchetypes } from '../npc/archetypes';
import type { Labels, LineField, NpcChoices } from '../npc/note';
import { type Lang, ownRace, type Race, rollAge, rollLooks, searchRaces } from '../npc/races';
import { SRD_NPCS } from '../npc/srd';
import { SRD_RACES } from '../npc/srd-races';
import {
  pick,
  TABLE_NAMES,
  type TableName,
  tableFromNote,
  tableNote,
  tablesFor,
} from '../npc/tables';
import type { Settings } from './settings';

type Tables = Record<TableName, readonly string[]>;

const HUMAN = SRD_RACES.find((r) => r.name === 'Human') as Race;

/** The language the dice texts are rolled in: the setting, or Obsidian's language. */
export function tableLang(settings: Settings, obsidianLang: string): Lang {
  if (settings.tableLanguage !== 'auto') return settings.tableLanguage;
  return obsidianLang.startsWith('de') ? 'de' : 'en';
}

/** SRD archetypes and the GM's own from the archetype folder; unusable notes are named in a notice. */
export async function loadArchetypes(app: App, settings: Settings, t: T): Promise<Archetype[]> {
  const own: Archetype[] = [];
  for (const file of typedNotes(app, settings.archetypeFolder, 'archetype')) {
    const found = ownArchetype(file.path, await app.vault.cachedRead(file), parseYaml);
    if ('problem' in found) new Notice(t('npc.archetypeProblem', { path: found.path }));
    else own.push(found);
  }
  return [...own, ...SRD_NPCS];
}

/** SRD races and the GM's own from the races folder; unusable notes are named in a notice. */
export async function loadRaces(app: App, settings: Settings, t: T): Promise<Race[]> {
  const human = SRD_RACES.find((r) => r.name === 'Human') ?? SRD_RACES[0];
  const own: Race[] = [];
  for (const file of typedNotes(app, settings.racesFolder, 'race')) {
    if (human === undefined) break;
    const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
    const found = ownRace(file.path, await app.vault.cachedRead(file), frontmatter, human);
    if ('problem' in found) new Notice(t('npc.raceProblem', { path: found.path }));
    else own.push(found);
  }
  return [...own, ...SRD_RACES];
}

/** The notes of a folder whose frontmatter `type` is `type`. */
function typedNotes(app: App, folder: string, type: string): TFile[] {
  const prefix = `${normalizePath(folder)}/`;
  return app.vault.getMarkdownFiles().filter((file) => {
    if (!file.path.startsWith(prefix)) return false;
    const value: unknown = app.metadataCache.getFileCache(file)?.frontmatter?.type;
    return typeof value === 'string' && value.trim().toLowerCase() === type;
  });
}

/** The dice tables in `lang`, each replaced by its table note when that note has entries. */
export async function loadTables(app: App, settings: Settings, lang: Lang): Promise<Tables> {
  const tables = tablesFor(lang);
  for (const name of TABLE_NAMES) {
    const file = app.vault.getAbstractFileByPath(
      normalizePath(`${settings.tablesFolder}/${tableNote(name)}`),
    );
    if (!(file instanceof TFile)) continue;
    const entries = tableFromNote(await app.vault.cachedRead(file));
    if (entries.length > 0) tables[name] = entries;
  }
  return tables;
}

/** The labels of labelled lines in the note's language. */
export const LABELS: Record<Lang, Labels> = {
  en: { ideal: 'Ideal', bond: 'Bond', flaw: 'Flaw', hook: 'Hook' },
  de: { ideal: 'Ideal', bond: 'Bindung', flaw: 'Makel', hook: 'Aufhänger' },
};

class RaceSuggest extends AbstractInputSuggest<Race> {
  constructor(
    app: App,
    input: HTMLInputElement,
    private readonly races: readonly Race[],
    private readonly t: T,
    private readonly lang: Lang,
  ) {
    super(app, input);
  }

  protected getSuggestions(query: string): Race[] {
    return searchRaces(this.races, query, this.lang);
  }

  renderSuggestion(race: Race, el: HTMLElement): void {
    el.addClass('dnd5e-suggestion');
    el.createDiv({ cls: 'dnd5e-suggestion-name', text: raceLabel(race, this.lang) });
    const detail = [
      race.size,
      `${race.speed} ft.`,
      race.darkvision > 0 ? `darkvision ${race.darkvision} ft.` : '',
      race.source === 'srd' ? 'SRD' : this.t('npc.own'),
    ];
    el.createDiv({
      cls: 'dnd5e-suggestion-detail',
      text: detail.filter((d) => d !== '').join(' · '),
    });
  }
}

/** A race's name in the dialog's language. */
function raceLabel(race: Race, lang: Lang): string {
  return race.label?.[lang] ?? race.name;
}

class ArchetypeSuggest extends AbstractInputSuggest<Archetype> {
  constructor(
    app: App,
    input: HTMLInputElement,
    private readonly archetypes: readonly Archetype[],
    private readonly t: T,
  ) {
    super(app, input);
  }

  protected getSuggestions(query: string): Archetype[] {
    return searchArchetypes(this.archetypes, query);
  }

  renderSuggestion(archetype: Archetype, el: HTMLElement): void {
    renderArchetype(archetype, el, this.t);
  }
}

function renderArchetype(archetype: Archetype, el: HTMLElement, t: T): void {
  el.addClass('dnd5e-suggestion');
  el.createDiv({ cls: 'dnd5e-suggestion-name', text: archetype.name });
  const detail = [
    archetype.cr === '' ? '' : `CR ${archetype.cr}`,
    archetype.source === 'srd' ? 'SRD' : t('npc.own'),
  ];
  el.createDiv({
    cls: 'dnd5e-suggestion-detail',
    text: detail.filter((d) => d !== '').join(' · '),
  });
}

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

type TextField = 'name' | 'race' | 'class' | 'alignment' | 'occupation' | 'age' | LineField;

/** The dice table behind each rolled field (name, age and the race's looks roll on their own). */
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

/** The fields of the dialog after name, faction, race and archetype, in order. */
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

export class NewNpcModal extends Modal {
  private readonly values = Object.fromEntries(
    ['name', 'race', ...FIELDS].map((f) => [f, '']),
  ) as Record<TextField, string>;
  private readonly inputs = new Map<TextField, (value: string) => void>();
  private faction: string;
  private archetypeText = '';
  private busy = false;

  constructor(private readonly deps: NewNpcDeps) {
    super(deps.app);
    this.faction = deps.faction;
  }

  onOpen(): void {
    const { t, lang } = this.deps;
    this.setTitle(t('npc.title'));
    this.modalEl.addClass('dnd5e-npc-modal');
    const el = this.contentEl;

    this.text(el, 'name', t('npc.name'), () => this.rollName());
    new Setting(el).setName(t('npc.faction')).addDropdown((dropdown) => {
      for (const [id, label] of factionOptions(this.deps.world, t)) dropdown.addOption(id, label);
      dropdown.setValue(this.faction).onChange((value) => (this.faction = value));
    });
    new Setting(el).setName(t('npc.race')).addText((text) => {
      text.setPlaceholder(t('npc.race.placeholder')).onChange((v) => (this.values.race = v));
      this.inputs.set('race', (value) => {
        text.setValue(value);
        this.values.race = value;
      });
      new RaceSuggest(this.app, text.inputEl, this.deps.races, t, lang).onSelect((race) => {
        this.set('race', raceLabel(race, lang));
      });
    });
    new Setting(el).setName(t('npc.archetype')).addText((text) => {
      text.setPlaceholder(t('npc.archetype.placeholder')).onChange((v) => (this.archetypeText = v));
      new ArchetypeSuggest(this.app, text.inputEl, this.deps.archetypes, t).onSelect(
        (archetype) => {
          text.setValue(archetype.name);
          this.archetypeText = archetype.name;
        },
      );
    });
    for (const field of FIELDS) {
      const table = ROLLS[field];
      const roll =
        field === 'age'
          ? () => this.set('age', String(rollAge(this.race() ?? HUMAN, this.random)))
          : field === 'appearance'
            ? () => this.rollAppearance()
            : table === undefined
              ? undefined
              : () => this.set(field, pick(this.deps.tables[table], this.random));
      this.text(el, field, t(`npc.${field}`), roll);
    }
    new Setting(el).addButton((button) =>
      button
        .setButtonText(t('npc.create'))
        .setCta()
        .onClick(() => void this.submit()),
    );
  }

  private get random(): () => number {
    return this.deps.random ?? Math.random;
  }

  private text(el: HTMLElement, field: TextField, name: string, roll?: () => void): void {
    const setting = new Setting(el).setName(name).addText((text) => {
      text.onChange((value) => (this.values[field] = value));
      this.inputs.set(field, (value) => {
        text.setValue(value);
        this.values[field] = value;
      });
    });
    if (roll !== undefined) {
      setting.addExtraButton((button) =>
        button.setIcon('dices').setTooltip(this.deps.t('npc.roll')).onClick(roll),
      );
    }
  }

  private set(field: TextField, value: string): void {
    this.inputs.get(field)?.(value);
  }

  /** The race model the race field names (by English name or label), or null for free text. */
  private race(): Race | null {
    const wanted = this.values.race.trim().toLowerCase();
    if (wanted === '') return null;
    return (
      this.deps.races.find(
        (r) =>
          r.name.toLowerCase() === wanted || raceLabel(r, this.deps.lang).toLowerCase() === wanted,
      ) ?? null
    );
  }

  /** First and family name from the race's lists, or the general ones. */
  private rollName(): void {
    const race = this.race();
    const { tables } = this.deps;
    const first = race?.names.length ? race.names : tables['first-names'];
    const family = race?.familyNames.length ? race.familyNames : tables['family-names'];
    this.set('name', `${pick(first, this.random)} ${pick(family, this.random)}`);
  }

  /** The race's looks and one detail from the appearance table. */
  private rollAppearance(): void {
    const race = this.race();
    const looks = race === null ? '' : rollLooks(race, this.deps.lang, this.random);
    const detail = pick(this.deps.tables.appearance, this.random);
    this.set('appearance', [looks, detail].filter((p) => p !== '').join('; '));
  }

  private async submit(): Promise<void> {
    const { t } = this.deps;
    const name = this.values.name.trim();
    if (name === '') {
      new Notice(t('npc.needName'));
      return;
    }
    const wanted = this.archetypeText.trim().toLowerCase();
    const archetype =
      wanted === ''
        ? null
        : (this.deps.archetypes.find((a) => a.name.toLowerCase() === wanted) ?? null);
    if (wanted !== '' && archetype === null) {
      new Notice(t('npc.unknownArchetype', { name: this.archetypeText.trim() }));
      return;
    }
    if (this.busy) return;
    this.busy = true;
    const raceModel = this.race();
    try {
      await this.deps.create(
        {
          ...this.values,
          name,
          // A model is written by its English name; free text as typed.
          race: raceModel?.name ?? this.values.race.trim(),
          raceModel,
          archetype,
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

/** What New archetype and New race differ in: their words, their bases and how to suggest them. */
export interface FromBase<B> {
  title: StringKey;
  basePlaceholder: StringKey;
  create: StringKey;
  /** The base an exact name (or label) means, or null. */
  find: (text: string) => B | null;
  /** Attaches suggestions to the base field; `chosen` sets its text. */
  suggest: (input: HTMLInputElement, chosen: (text: string) => void) => void;
  /** Without a base: allowed (a blank archetype) or refused (a race needs one). */
  baseRequired: boolean;
}

/** New archetype / New race: a name and a base to start from; writes and opens the note. */
export class NewFromBaseModal<B> extends Modal {
  private name = '';
  private base = '';

  constructor(
    app: App,
    private readonly t: T,
    private readonly kind: FromBase<B>,
    private readonly create: (name: string, base: B | null) => Promise<void>,
  ) {
    super(app);
  }

  onOpen(): void {
    const { t, kind } = this;
    this.setTitle(t(kind.title));
    this.modalEl.addClass('dnd5e-npc-modal');
    new Setting(this.contentEl)
      .setName(t('archetype.name'))
      .addText((text) => text.onChange((value) => (this.name = value)));
    new Setting(this.contentEl).setName(t('archetype.base')).addText((text) => {
      text.setPlaceholder(t(kind.basePlaceholder)).onChange((v) => (this.base = v));
      kind.suggest(text.inputEl, (chosen) => {
        text.setValue(chosen);
        this.base = chosen;
      });
    });
    new Setting(this.contentEl).addButton((button) =>
      button
        .setButtonText(t(kind.create))
        .setCta()
        .onClick(() => void this.submit()),
    );
  }

  private async submit(): Promise<void> {
    const name = this.name.trim();
    if (name === '') {
      new Notice(this.t('npc.needName'));
      return;
    }
    const wanted = this.base.trim();
    const base = wanted === '' ? null : this.kind.find(wanted);
    if ((wanted !== '' && base === null) || (base === null && this.kind.baseRequired)) {
      new Notice(this.t('npc.unknownArchetype', { name: wanted }));
      return;
    }
    await this.create(name, base);
    this.close();
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

/** New archetype: from an SRD or own archetype, or blank. */
export function archetypeKind(
  app: App,
  t: T,
  archetypes: readonly Archetype[],
): FromBase<Archetype> {
  return {
    title: 'archetype.title',
    basePlaceholder: 'archetype.base.placeholder',
    create: 'archetype.create',
    find: (text) => archetypes.find((a) => a.name.toLowerCase() === text.toLowerCase()) ?? null,
    suggest: (input, chosen) =>
      new ArchetypeSuggest(app, input, archetypes, t).onSelect((a) => chosen(a.name)),
    baseRequired: false,
  };
}

/** New race: from an SRD or own race, which it needs for its traits. */
export function raceKind(app: App, t: T, races: readonly Race[], lang: Lang): FromBase<Race> {
  return {
    title: 'race.title',
    basePlaceholder: 'race.base.placeholder',
    create: 'archetype.create',
    find: (text) =>
      races.find(
        (r) =>
          r.name.toLowerCase() === text.toLowerCase() ||
          raceLabel(r, lang).toLowerCase() === text.toLowerCase(),
      ) ?? null,
    suggest: (input, chosen) =>
      new RaceSuggest(app, input, races, t, lang).onSelect((r) => chosen(raceLabel(r, lang))),
    baseRequired: true,
  };
}

/** Picks an archetype for Add stat block. */
export class ArchetypePicker extends FuzzySuggestModal<Archetype> {
  constructor(
    app: App,
    private readonly archetypes: readonly Archetype[],
    private readonly t: T,
    private readonly chosen: (archetype: Archetype) => void,
  ) {
    super(app);
    this.setPlaceholder(t('npc.pickArchetype'));
  }

  getItems(): Archetype[] {
    return [...this.archetypes];
  }

  getItemText(archetype: Archetype): string {
    return archetype.cr === '' ? archetype.name : `${archetype.name} (CR ${archetype.cr})`;
  }

  onChooseItem(archetype: Archetype): void {
    this.chosen(archetype);
  }
}
