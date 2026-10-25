// The NPC builder's commands: New NPC (also from a faction's card), New archetype, New race and Add
// stat block. Writes a new note with vault.create, changes an existing one with vault.process.

import { getLanguage, normalizePath, Notice, parseYaml, type Plugin, TFile } from 'obsidian';

import { UNAFFILIATED } from '../factions/discover';
import type { T } from '../i18n/strings';
import { withName } from '../npc/archetypes';
import {
  addStatblock,
  archetypeNote,
  freePath,
  npcFolder,
  npcNote,
  type NpcChoices,
} from '../npc/note';
import { raceNote } from '../npc/races';
import {
  ArchetypePicker,
  archetypeKind,
  LABELS,
  loadArchetypes,
  loadRaces,
  loadTables,
  NewFromBaseModal,
  raceKind,
  tableLang,
} from './npc-modal';
import { NewNpcModal } from './npc-dialog';
import type { Settings } from './settings';
import type { WorldCache } from './world-cache';

export class NpcBuilder {
  constructor(
    private readonly plugin: Plugin,
    private readonly cache: WorldCache,
    private readonly t: T,
    private readonly settings: () => Settings,
    private readonly openNote: (path: string) => void,
    /** Opens a note's stat block unfolded the next time it renders. */
    private readonly unfold: (path: string) => void,
  ) {}

  /** Opens the New NPC dialog, with `faction` chosen (Unaffiliated when none is given). */
  async newNpc(faction: string = UNAFFILIATED): Promise<void> {
    const { app } = this.plugin;
    const world = await this.cache.get();
    if (world.campaign === null) {
      new Notice(this.t('modal.noCampaign'));
      return;
    }
    const lang = this.lang();
    new NewNpcModal({
      app,
      t: this.t,
      world,
      archetypes: await loadArchetypes(app, this.settings(), this.t),
      races: await loadRaces(app, this.settings(), this.t),
      tables: await loadTables(app, this.settings(), lang),
      lang,
      faction: world.entities.has(faction) || faction === UNAFFILIATED ? faction : UNAFFILIATED,
      create: (choices, chosen) => this.create(choices, chosen),
    }).open();
  }

  private async create(choices: NpcChoices, faction: string): Promise<void> {
    const { vault } = this.plugin.app;
    const world = await this.cache.get();
    const template = vault.getAbstractFileByPath(normalizePath(this.settings().npcTemplate));
    const text = npcNote(
      template instanceof TFile ? await vault.cachedRead(template) : null,
      choices,
      LABELS[this.lang()],
      parseYaml,
    );
    this.openNote(
      await this.write(npcFolder(world, faction, this.settings().npcFolder), choices.name, text),
    );
  }

  /** New archetype: a note in the archetype folder from a base, opened with its block unfolded. */
  async newArchetype(): Promise<void> {
    const { app } = this.plugin;
    const archetypes = await loadArchetypes(app, this.settings(), this.t);
    new NewFromBaseModal(
      app,
      this.t,
      archetypeKind(app, this.t, archetypes),
      async (name, base) => {
        const path = await this.write(
          this.settings().archetypeFolder,
          name,
          archetypeNote(name, base, this.t('archetype.intro')),
        );
        this.unfold(path);
        this.openNote(path);
      },
    ).open();
  }

  /** New race: a race note in the races folder from a base race, opened. */
  async newRace(): Promise<void> {
    const { app } = this.plugin;
    const races = await loadRaces(app, this.settings(), this.t);
    new NewFromBaseModal(
      app,
      this.t,
      raceKind(app, this.t, races, this.lang()),
      async (name, base) => {
        if (base === null) return;
        const path = await this.write(
          this.settings().racesFolder,
          name,
          raceNote(name, base, this.t('race.intro')),
        );
        this.openNote(path);
      },
    ).open();
  }

  /** Writes a new note into `folder` (created when missing), never over an existing one. */
  private async write(folder: string, name: string, text: string): Promise<string> {
    const { vault } = this.plugin.app;
    const dir = normalizePath(folder);
    if (vault.getAbstractFileByPath(dir) === null) await vault.createFolder(dir);
    const path = freePath(dir, name, (p) => vault.getAbstractFileByPath(p) !== null);
    await vault.create(path, text);
    new Notice(this.t('archetype.created', { path }));
    return path;
  }

  private lang() {
    return tableLang(this.settings(), getLanguage());
  }

  /** Add stat block on the active note: pick an archetype, insert it under `## Stats`. */
  async addStatblock(): Promise<void> {
    const { app } = this.plugin;
    const file = app.workspace.getActiveFile();
    if (file === null) return;
    const archetypes = await loadArchetypes(app, this.settings(), this.t);
    new ArchetypePicker(app, archetypes, this.t, (archetype) => {
      void (async () => {
        let added = false;
        await app.vault.process(file, (text) => {
          const next = addStatblock(text, withName(archetype.yaml, file.basename));
          added = next !== null;
          return next ?? text;
        });
        new Notice(
          added ? this.t('npc.added', { archetype: archetype.name }) : this.t('npc.hasStatblock'),
        );
      })();
    }).open();
  }
}
