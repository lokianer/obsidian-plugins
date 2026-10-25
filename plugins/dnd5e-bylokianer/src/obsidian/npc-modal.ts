// The NPC builder in Obsidian, besides the New NPC dialog (npc-dialog.ts): the New archetype and New
// race dialogs, the archetype picker of Add stat block, and loading the GM's own archetypes, races
// and table notes.

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

import type { StringKey, T } from '../i18n/strings';
import { type Archetype, ownArchetype, searchArchetypes } from '../npc/archetypes';
import type { Labels } from '../npc/note';
import { type Lang, ownRace, type Race, searchRaces } from '../npc/races';
import { SRD_NPCS } from '../npc/srd';
import { SRD_RACES } from '../npc/srd-races';
import { TABLE_NAMES, type TableName, tableFromNote, tableNote, tablesFor } from '../npc/tables';
import type { Settings } from './settings';

export type Tables = Record<TableName, readonly string[]>;

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
export function raceLabel(race: Race, lang: Lang): string {
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
