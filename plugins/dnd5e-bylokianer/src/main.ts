import { getLanguage, MarkdownView, Notice, Plugin } from 'obsidian';

import type { EditTarget, FactionWorld } from './factions/model';

import { createT } from './i18n/strings';
import { CardManager } from './obsidian/card-view';
import { DEFAULT_SETTINGS, type Settings, SettingsTab } from './obsidian/settings';
import { WarningsModal } from './obsidian/warnings-modal';
import { ModeStore } from './obsidian/mode-store';
import { SessionLog } from './obsidian/session-log';
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
    const cards = new CardManager(
      this,
      cache,
      t,
      () => this.options,
      (change) => sessionLog.offer(change),
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
