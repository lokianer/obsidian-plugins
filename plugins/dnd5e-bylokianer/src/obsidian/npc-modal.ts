// The NPC builder in Obsidian: the New NPC dialog (name, faction, archetype, personality with dice),
// the archetype picker of Add stat block, and loading the GM's own archetypes and table notes.

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
import type { T } from '../i18n/strings';
import { type Archetype, ownArchetype, searchArchetypes } from '../npc/archetypes';
import type { NpcChoices } from '../npc/note';
import { SRD_NPCS } from '../npc/srd';
import {
  DEFAULT_TABLES,
  pick,
  TABLE_NAMES,
  type TableName,
  tableFromNote,
  tableNote,
} from '../npc/tables';
import type { Settings } from './settings';

type Tables = Record<TableName, readonly string[]>;

/** SRD archetypes and the GM's own from the archetype folder; unusable notes are named in a notice. */
export async function loadArchetypes(app: App, settings: Settings, t: T): Promise<Archetype[]> {
  const folder = normalizePath(settings.archetypeFolder);
  const own: Archetype[] = [];
  for (const file of app.vault.getMarkdownFiles()) {
    if (!file.path.startsWith(`${folder}/`)) continue;
    const type: unknown = app.metadataCache.getFileCache(file)?.frontmatter?.type;
    if (typeof type !== 'string' || type.trim().toLowerCase() !== 'archetype') continue;
    const found = ownArchetype(file.path, await app.vault.cachedRead(file), parseYaml);
    if ('problem' in found) new Notice(t('npc.archetypeProblem', { path: found.path }));
    else own.push(found);
  }
  return [...own, ...SRD_NPCS];
}

/** The dice tables: the defaults, each replaced by its table note when that note has entries. */
export async function loadTables(app: App, settings: Settings): Promise<Tables> {
  const tables = { ...DEFAULT_TABLES };
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
  tables: Tables;
  /** The faction chosen when the dialog opens (the card it was opened from). */
  faction: string;
  /** Writes and opens the note; resolves when done. */
  create: (choices: NpcChoices, faction: string) => Promise<void>;
  random?: () => number;
}

type TextField =
  'name' | 'race' | 'class' | 'alignment' | 'appearance' | 'manner' | 'want' | 'quirk';

/** Which dice table fills a field; the name rolls first and family name together. */
const ROLLS: Partial<Record<TextField, TableName>> = {
  appearance: 'appearance',
  manner: 'manner',
  want: 'wants',
  quirk: 'quirks',
};

export class NewNpcModal extends Modal {
  private readonly values: Record<TextField, string> = {
    name: '',
    race: '',
    class: '',
    alignment: '',
    appearance: '',
    manner: '',
    want: '',
    quirk: '',
  };
  private faction: string;
  private archetypeText = '';
  private busy = false;

  constructor(private readonly deps: NewNpcDeps) {
    super(deps.app);
    this.faction = deps.faction;
  }

  onOpen(): void {
    const { t } = this.deps;
    this.setTitle(t('npc.title'));
    this.modalEl.addClass('dnd5e-npc-modal');
    const el = this.contentEl;

    this.text(el, 'name', t('npc.name'), () => this.rollName());
    new Setting(el).setName(t('npc.faction')).addDropdown((dropdown) => {
      for (const [id, label] of factionOptions(this.deps.world, t)) dropdown.addOption(id, label);
      dropdown.setValue(this.faction).onChange((value) => (this.faction = value));
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
    this.text(el, 'race', t('npc.race'));
    this.text(el, 'class', t('npc.class'));
    this.text(el, 'alignment', t('npc.alignment'));
    for (const field of ['appearance', 'manner', 'want', 'quirk'] as const) {
      const table = ROLLS[field];
      this.text(el, field, t(`npc.${field}`), table && (() => this.roll(field, table)));
    }
    new Setting(el).addButton((button) =>
      button
        .setButtonText(t('npc.create'))
        .setCta()
        .onClick(() => void this.submit()),
    );
  }

  private readonly inputs = new Map<TextField, (value: string) => void>();

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

  private roll(field: TextField, table: TableName): void {
    this.set(field, pick(this.deps.tables[table], this.deps.random));
  }

  private rollName(): void {
    const { tables, random } = this.deps;
    this.set(
      'name',
      `${pick(tables['first-names'], random)} ${pick(tables['family-names'], random)}`,
    );
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
    try {
      await this.deps.create({ ...this.values, name, archetype }, this.faction);
      this.close();
    } finally {
      this.busy = false;
    }
  }

  onClose(): void {
    this.contentEl.empty();
  }
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
