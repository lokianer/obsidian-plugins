// The plugin's settings: Properties beside the card, and the names of the eleven steps.

import {
  type App,
  type Plugin,
  PluginSettingTab,
  Setting,
  type SettingDefinitionItem,
} from 'obsidian';

import { STEPS, signed, stepName } from '../factions/steps';
import type { T } from '../i18n/strings';

export interface Settings {
  /** Show Obsidian's Properties block on faction and character notes, beside the card. */
  showProperties: boolean;
  /** The GM's names for the steps −5 … +5 (index 0 … 10); empty means the default name. */
  stepNames: string[];
  /** The world view's last mode: graph or matrix. */
  worldMode: 'graph' | 'matrix';
  /** Graph positions per campaign note path, by node id. */
  positions: Record<string, Record<string, { x: number; y: number; pinned?: boolean }>>;
}

export const DEFAULT_SETTINGS: Settings = {
  showProperties: false,
  stepNames: [],
  worldMode: 'graph',
  positions: {},
};

const STEP_KEY = 'step:';

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
      {
        type: 'group',
        heading: this.t('settings.stepNames'),
        items: STEPS.map((step) => ({
          name: signed(step),
          desc: this.t('settings.stepNames.desc'),
          control: { type: 'text', key: `${STEP_KEY}${step}`, placeholder: stepName(step, this.t) },
        })),
      },
    ];
  }

  getControlValue(key: string): unknown {
    if (key.startsWith(STEP_KEY)) {
      return this.settings().stepNames[Number(key.slice(STEP_KEY.length)) + 5] ?? '';
    }
    return key === 'showProperties' ? this.settings().showProperties : undefined;
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    if (key === 'showProperties' && typeof value === 'boolean') {
      await this.save({ ...this.settings(), showProperties: value });
    }
    if (key.startsWith(STEP_KEY) && typeof value === 'string') {
      await this.setStepName(Number(key.slice(STEP_KEY.length)), value);
    }
  }

  private async setStepName(step: number, name: string): Promise<void> {
    const names = STEPS.map((_, i) => this.settings().stepNames[i] ?? '');
    names[step + 5] = name.trim();
    await this.save({ ...this.settings(), stepNames: names });
  }

  /** Before 1.13: the same settings, built by hand. */
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
    new Setting(containerEl).setName(t('settings.stepNames')).setHeading();
    for (const step of STEPS) {
      new Setting(containerEl)
        .setName(signed(step))
        .setDesc(t('settings.stepNames.desc'))
        .addText((text) =>
          text
            .setPlaceholder(stepName(step, t))
            .setValue(this.settings().stepNames[step + 5] ?? '')
            .onChange((value) => this.setStepName(step, value)),
        );
    }
  }
}
