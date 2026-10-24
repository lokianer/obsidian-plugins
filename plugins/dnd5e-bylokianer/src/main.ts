import { getLanguage, MarkdownView, Notice, Plugin } from 'obsidian';

import { createT } from './i18n/strings';
import { CardManager } from './obsidian/card-view';
import { DEFAULT_SETTINGS, type Settings, SettingsTab } from './obsidian/settings';
import { WarningsModal } from './obsidian/warnings-modal';
import { WorldCache } from './obsidian/world-cache';

export default class Dnd5ePlugin extends Plugin {
  private options: Settings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    const t = createT(getLanguage());
    this.options = {
      ...DEFAULT_SETTINGS,
      ...((await this.loadData()) as Partial<Settings> | null),
    };
    const cache = new WorldCache(this);
    const cards = new CardManager(this, cache, t, () => this.options);
    cards.start();

    this.addSettingTab(
      new SettingsTab(
        this.app,
        this,
        t,
        () => this.options,
        async (settings) => {
          this.options = settings;
          await this.saveData(settings);
          cards.refreshAll();
        },
      ),
    );

    this.addCommand({
      id: 'show-faction-warnings',
      name: t('command.showWarnings'),
      callback: async () => {
        const world = await cache.rebuild();
        new WarningsModal(this.app, world, t, (warning, newLeaf) => {
          void cards.open(warning.path, { warning }, newLeaf);
        }).open();
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
