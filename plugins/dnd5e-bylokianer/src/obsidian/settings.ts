// The plugin's settings: Properties beside the card, and the names of the eleven steps.

import {
  type App,
  type Plugin,
  PluginSettingTab,
  Setting,
  type SettingDefinitionItem,
} from 'obsidian';

import type { Point } from '../factions/layout';
import { STEPS, signed, stepName } from '../factions/steps';
import { DEFAULT_THRESHOLDS, type Thresholds } from '../factions/tension';
import type { T } from '../i18n/strings';

export interface Settings {
  /** Show Obsidian's Properties block on faction and character notes, beside the card. */
  showProperties: boolean;
  /** The GM's names for the steps −5 … +5 (index 0 … 10); empty means the default name. */
  stepNames: string[];
  /** The world view's last mode: graph or matrix. */
  worldMode: 'graph' | 'matrix';
  /** The tension panel's thresholds. */
  thresholds: Thresholds;
  /** The note new session notes are made from. */
  sessionTemplate: string;
  /** Today's answer to "start session N+1?", so it is asked once a day. */
  sessionAnswer: { date: string; choice: 'next' | 'keep' } | null;
  /** Graph positions per campaign note path, by node id. */
  positions: Record<string, Record<string, { x: number; y: number; pinned?: boolean }>>;
  /** What the GM dragged in a faction view, per viewed faction: offsets by frame or box id. */
  viewMoves: Record<string, Record<string, Point>>;
}

export const DEFAULT_SETTINGS: Settings = {
  showProperties: false,
  stepNames: [],
  worldMode: 'graph',
  thresholds: DEFAULT_THRESHOLDS,
  sessionTemplate: 'Templates/Session.md',
  sessionAnswer: null,
  positions: {},
  viewMoves: {},
};

const STEP_KEY = 'step:';
const THRESHOLD_KEY = 'threshold:';
const THRESHOLDS: readonly (keyof Thresholds)[] = [
  'oneSided',
  'outOfLine',
  'publicTrue',
  'splitAllies',
];

/** A threshold from a text or number field: a whole number 1 … 10, or null when it is none. */
function threshold(value: unknown): number | null {
  const n = typeof value === 'number' ? value : Number(String(value).trim());
  return Number.isInteger(n) && n >= 1 && n <= 10 ? n : null;
}

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
        name: this.t('settings.template'),
        desc: this.t('settings.template.desc'),
        control: {
          type: 'text',
          key: 'sessionTemplate',
          placeholder: DEFAULT_SETTINGS.sessionTemplate,
        },
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
      {
        type: 'group',
        heading: this.t('settings.thresholds'),
        items: THRESHOLDS.map((key) => ({
          name: this.t(`settings.threshold.${key}`),
          control: {
            type: 'number',
            key: `${THRESHOLD_KEY}${key}`,
            defaultValue: DEFAULT_THRESHOLDS[key],
            validate: (value: number) => (threshold(value) === null ? '1 … 10' : undefined),
          },
        })),
      },
    ];
  }

  getControlValue(key: string): unknown {
    if (key.startsWith(STEP_KEY)) {
      return this.settings().stepNames[Number(key.slice(STEP_KEY.length)) + 5] ?? '';
    }
    if (key.startsWith(THRESHOLD_KEY)) {
      return this.settings().thresholds[key.slice(THRESHOLD_KEY.length) as keyof Thresholds];
    }
    if (key === 'sessionTemplate') return this.settings().sessionTemplate;
    return key === 'showProperties' ? this.settings().showProperties : undefined;
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    if (key === 'showProperties' && typeof value === 'boolean') {
      await this.save({ ...this.settings(), showProperties: value });
    }
    if (key === 'sessionTemplate' && typeof value === 'string') {
      await this.save({
        ...this.settings(),
        sessionTemplate: value.trim() || DEFAULT_SETTINGS.sessionTemplate,
      });
    }
    if (key.startsWith(STEP_KEY) && typeof value === 'string') {
      await this.setStepName(Number(key.slice(STEP_KEY.length)), value);
    }
    if (key.startsWith(THRESHOLD_KEY)) {
      await this.setThreshold(key.slice(THRESHOLD_KEY.length) as keyof Thresholds, value);
    }
  }

  private async setThreshold(key: keyof Thresholds, value: unknown): Promise<void> {
    const n = threshold(value);
    if (n === null || !THRESHOLDS.includes(key)) return;
    const settings = this.settings();
    await this.save({ ...settings, thresholds: { ...settings.thresholds, [key]: n } });
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
    new Setting(containerEl)
      .setName(t('settings.template'))
      .setDesc(t('settings.template.desc'))
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.sessionTemplate)
          .setValue(this.settings().sessionTemplate)
          .onChange((value) =>
            this.save({
              ...this.settings(),
              sessionTemplate: value.trim() || DEFAULT_SETTINGS.sessionTemplate,
            }),
          ),
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
    new Setting(containerEl).setName(t('settings.thresholds')).setHeading();
    for (const key of THRESHOLDS) {
      new Setting(containerEl).setName(t(`settings.threshold.${key}`)).addText((text) =>
        text
          .setPlaceholder(String(DEFAULT_THRESHOLDS[key]))
          .setValue(String(this.settings().thresholds[key]))
          .onChange((value) => this.setThreshold(key, value)),
      );
    }
  }
}
