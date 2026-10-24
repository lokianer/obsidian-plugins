// The plugin's settings: one toggle for now.

import {
  type App,
  type Plugin,
  PluginSettingTab,
  Setting,
  type SettingDefinitionItem,
} from 'obsidian';

import type { T } from '../i18n/strings';

export interface Settings {
  /** Show Obsidian's Properties block on faction and character notes, beside the card. */
  showProperties: boolean;
}

export const DEFAULT_SETTINGS: Settings = { showProperties: false };

export class SettingsTab extends PluginSettingTab {
  constructor(
    app: App,
    plugin: Plugin,
    private readonly t: T,
    private readonly settings: () => Settings,
    private readonly save: (settings: Settings) => Promise<void>,
  ) {
    super(app, plugin);
  }

  /** Obsidian 1.13 and later: declarative, so the setting shows in the settings search. */
  getSettingDefinitions(): SettingDefinitionItem[] {
    return [
      {
        name: this.t('settings.showProperties'),
        desc: this.t('settings.showProperties.desc'),
        control: { type: 'toggle', key: 'showProperties', defaultValue: false },
      },
    ];
  }

  getControlValue(key: string): unknown {
    return this.settings()[key as keyof Settings];
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    if (key === 'showProperties' && typeof value === 'boolean') {
      await this.save({ ...this.settings(), showProperties: value });
    }
  }

  /** Before 1.13: the same toggle, built by hand. */
  display(): void {
    const { containerEl, t } = this;
    containerEl.empty();
    new Setting(containerEl)
      .setName(t('settings.showProperties'))
      .setDesc(t('settings.showProperties.desc'))
      .addToggle((toggle) =>
        toggle
          .setValue(this.settings().showProperties)
          .onChange((value) => this.save({ ...this.settings(), showProperties: value })),
      );
  }
}
