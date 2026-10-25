import {
  getLanguage,
  MarkdownRenderChild,
  MarkdownRenderer,
  MarkdownView,
  Notice,
  parseYaml,
  Plugin,
} from 'obsidian';

import type { EditTarget, FactionWorld } from './factions/model';

import { createT } from './i18n/strings';
import { BLOCK, convertBlocks, parseStatblock } from './npc/statblock';
import { CardManager } from './obsidian/card-view';
import { DEFAULT_SETTINGS, type Settings, SettingsTab } from './obsidian/settings';
import { WarningsModal } from './obsidian/warnings-modal';
import { ModeStore } from './obsidian/mode-store';
import { SessionLog } from './obsidian/session-log';
import { NoteStatblocks } from './obsidian/note-statblocks';
import { NpcBuilder } from './obsidian/npc-builder';
import { renderFolded, renderInvalid } from './obsidian/statblock-view';
import { TENSION_VIEW, TensionView } from './obsidian/tension-view';
import { WorldCache } from './obsidian/world-cache';
import { WORLD_VIEW, WorldView } from './obsidian/world-view';

export default class Dnd5ePlugin extends Plugin {
  private options: Settings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    const t = createT(getLanguage());
    this.options = {
      ...DEFAULT_SETTINGS,
      ...((await this.loadData()) as Partial<Settings> | null),
    };
    const cache = new WorldCache(this);
    const statblocks = new NoteStatblocks(this);
    const cards = new CardManager(
      this,
      cache,
      t,
      () => this.options,
      (change) => sessionLog.offer(change),
      statblocks,
      (faction) => void npcs.newNpc(faction),
    );
    cards.start();

    const modes = new ModeStore();
    const sessionLog = new SessionLog(
      this,
      cache,
      t,
      () => this.options,
      (s) => save(s),
    );
    const save = async (settings: Settings) => {
      this.options = settings;
      await this.saveData(settings);
      cards.refreshAll();
      for (const leaf of this.app.workspace.getLeavesOfType(TENSION_VIEW)) {
        if (leaf.view instanceof TensionView) leaf.view.refresh();
      }
    };
    this.addSettingTab(new SettingsTab(this.app, this, t, () => this.options, save));

    const showWarnings = (world: FactionWorld) => {
      new WarningsModal(this.app, world, t, (warning, newLeaf) => {
        void cards.open(warning.path, { warning }, newLeaf);
      }).open();
    };
    this.addCommand({
      id: 'show-faction-warnings',
      name: t('command.showWarnings'),
      callback: async () => showWarnings(await cache.rebuild()),
    });

    const openNote = (path: string, newLeaf: boolean) => {
      const file = this.app.vault.getFileByPath(path);
      if (file !== null) void cards.leafFor(newLeaf).openFile(file);
    };
    const editValue = (edit: EditTarget, newLeaf: boolean) =>
      void cards.open(edit.path, { entry: { field: edit.field, target: edit.target } }, newLeaf);
    const showTensions = async () => {
      const { workspace } = this.app;
      const leaf = workspace.getLeavesOfType(TENSION_VIEW)[0] ?? workspace.getRightLeaf(false);
      if (leaf === null) return;
      await leaf.setViewState({ type: TENSION_VIEW, active: true });
      await workspace.revealLeaf(leaf);
    };
    this.registerView(
      TENSION_VIEW,
      (leaf) =>
        new TensionView(leaf, {
          cache,
          modes,
          t,
          thresholds: () => this.options.thresholds,
          openNote,
          editValue,
        }),
    );
    this.addCommand({
      id: 'show-faction-tensions',
      name: t('command.showTensions'),
      callback: showTensions,
    });

    this.registerView(
      WORLD_VIEW,
      (leaf) =>
        new WorldView(leaf, {
          cache,
          modes,
          t,
          settings: () => this.options,
          save,
          openNote,
          editValue,
          sessionLog,
          statblocks,
          showWarnings,
          showTensions: () => void showTensions(),
        }),
    );
    const openWorld = async () => {
      const { workspace } = this.app;
      const leaf = workspace.getLeavesOfType(WORLD_VIEW)[0] ?? workspace.getLeaf('tab');
      await leaf.setViewState({ type: WORLD_VIEW, active: true });
      await workspace.revealLeaf(leaf);
    };
    this.addCommand({
      id: 'open-faction-world',
      name: t('command.openWorld'),
      callback: openWorld,
    });
    this.addRibbonIcon('network', t('command.openWorld'), () => void openWorld());

    const openStatblocks = new Set<string>();
    this.registerMarkdownCodeBlockProcessor(BLOCK, (source, el, ctx) => {
      let data: unknown;
      try {
        data = parseYaml(source);
      } catch {
        renderInvalid(el, source, t);
        return;
      }
      const child = new MarkdownRenderChild(el);
      ctx.addChild(child);
      renderFolded(el, parseStatblock(data), {
        t,
        markdown: (markdown, target) =>
          void MarkdownRenderer.render(this.app, markdown, target, ctx.sourcePath, child),
        // Open or folded per note, for as long as Obsidian runs.
        open: openStatblocks.has(ctx.sourcePath),
        toggle: (open) => {
          if (open) openStatblocks.add(ctx.sourcePath);
          else openStatblocks.delete(ctx.sourcePath);
        },
      });
    });
    this.addCommand({
      id: 'convert-statblock',
      name: t('command.convertStatblock'),
      callback: async () => {
        const file = this.app.workspace.getActiveFile();
        if (file === null) return;
        let count = 0;
        await this.app.vault.process(file, (text) => {
          const converted = convertBlocks(text);
          count = converted.count;
          return converted.text;
        });
        new Notice(count === 0 ? t('notice.noStatblock') : t('notice.converted', { count }));
      },
    });

    const npcs = new NpcBuilder(
      this,
      cache,
      t,
      () => this.options,
      (path) => openNote(path, false),
    );
    this.addCommand({
      id: 'new-npc',
      name: t('command.newNpc'),
      callback: () => void npcs.newNpc(),
    });
    this.addCommand({
      id: 'add-statblock',
      name: t('command.addStatblock'),
      callback: () => void npcs.addStatblock(),
    });

    this.addCommand({
      id: 'start-next-session',
      name: t('command.nextSession'),
      callback: async () => {
        const path = await sessionLog.startNext();
        if (path !== null) openNote(path, false);
      },
    });

    this.addCommand({
      id: 'edit-faction-data',
      name: t('command.editCard'),
      callback: async () => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        await cache.get();
        if (view === null || !cards.hasCard(view)) {
          new Notice(t('notice.notEntity'));
          return;
        }
        if (await cards.reveal(view)) cards.focusActive(view);
      },
    });
  }
}
