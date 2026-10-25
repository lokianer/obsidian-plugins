// The NPC builder's commands: New NPC (also from a faction's card) and Add stat block. Writes a new
// note with vault.create, changes an existing one with vault.process.

import { normalizePath, Notice, type Plugin, TFile } from 'obsidian';

import { UNAFFILIATED } from '../factions/discover';
import type { T } from '../i18n/strings';
import { withName } from '../npc/archetypes';
import { addStatblock, freePath, npcFolder, npcNote, type NpcChoices } from '../npc/note';
import { ArchetypePicker, loadArchetypes, loadTables, NewNpcModal } from './npc-modal';
import type { Settings } from './settings';
import type { WorldCache } from './world-cache';

export class NpcBuilder {
  constructor(
    private readonly plugin: Plugin,
    private readonly cache: WorldCache,
    private readonly t: T,
    private readonly settings: () => Settings,
    private readonly openNote: (path: string) => void,
  ) {}

  /** Opens the New NPC dialog, with `faction` chosen (Unaffiliated when none is given). */
  async newNpc(faction: string = UNAFFILIATED): Promise<void> {
    const { app } = this.plugin;
    const world = await this.cache.get();
    if (world.campaign === null) {
      new Notice(this.t('modal.noCampaign'));
      return;
    }
    new NewNpcModal({
      app,
      t: this.t,
      world,
      archetypes: await loadArchetypes(app, this.settings(), this.t),
      tables: await loadTables(app, this.settings()),
      faction: world.entities.has(faction) || faction === UNAFFILIATED ? faction : UNAFFILIATED,
      create: (choices, chosen) => this.create(choices, chosen),
    }).open();
  }

  private async create(choices: NpcChoices, faction: string): Promise<void> {
    const { vault } = this.plugin.app;
    const world = await this.cache.get();
    const folder = normalizePath(npcFolder(world, faction, this.settings().npcFolder));
    if (vault.getAbstractFileByPath(folder) === null) await vault.createFolder(folder);
    const path = freePath(folder, choices.name, (p) => vault.getAbstractFileByPath(p) !== null);
    const template = vault.getAbstractFileByPath(normalizePath(this.settings().npcTemplate));
    const text = npcNote(
      template instanceof TFile ? await vault.cachedRead(template) : null,
      choices,
    );
    await vault.create(path, text);
    new Notice(this.t('npc.created', { path }));
    this.openNote(path);
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
