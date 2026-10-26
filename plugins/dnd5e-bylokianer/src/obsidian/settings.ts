// The plugin's settings: Properties beside the card, and the names of the eleven steps.

import {
  type App,
  type Plugin,
  PluginSettingTab,
  Setting,
  type SettingDefinitionItem,
} from 'obsidian';

import type { Point } from '../factions/layout';
import type { Lang } from '../npc/races';
import { STEPS, signed, stepName } from '../factions/steps';
import { DEFAULT_THRESHOLDS, type Thresholds } from '../factions/tension';
import type { StringKey, T } from '../i18n/strings';

export interface Settings {
  /** Show Obsidian's Properties block on faction and character notes, beside the card. */
  showProperties: boolean;
  /** Experience points shown (encounter XP, the XP in the battle log); off for milestone play. */
  experience: boolean;
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
  /** The note new NPC notes are made from. */
  npcTemplate: string;
  /** Where the GM's own archetype notes live. */
  archetypeFolder: string;
  /** Where table notes that replace the default dice tables live. */
  tablesFolder: string;
  /** The folder in the campaign that takes NPCs of no faction. */
  npcFolder: string;
  /** Where the GM's own race notes live. */
  racesFolder: string;
  /** The language of the dice texts: Obsidian's (auto), English or German. */
  tableLanguage: 'auto' | Lang;
  /** The spellbook's filters and picked spell, read back with care (readFilters). */
  spellbook: unknown;
  /** The size of a new standard Deck of Many Things. */
  deckSize: 13 | 22;
  /** The folder in the campaign new own decks go to. */
  deckFolder: string;
  /** The folder in the campaign monster notes go to. */
  monsterFolder: string;
  /** The folder in the campaign the encounter builder writes to. */
  encounterFolder: string;
  /** The Monster Manual's filters and picked monster, read back with care (readFilters). */
  monsterManual: unknown;
  /** The folder in the campaign new own spells go to. */
  spellFolder: string;
  /** The deck the Deck tab showed last: `standard` or an own deck's path. */
  deckSelected: string;
  /** The encounter note the Battle tab showed last. */
  battleSelected: string | null;
  /** The battle tracker's lines in tonight's session: offered in a notice, written, or none. */
  battleLog: LogMode;
  /** Rolls in tonight's session, the same way. */
  diceLog: LogMode;
  /** The dice stage animated, shown at once, or not at all. */
  diceAnimation: DiceAnimation;
}

export type LogMode = 'ask' | 'auto' | 'off';
export type DiceAnimation = 'stage' | 'simple' | 'off';

/** The settings chosen from a dropdown, with their values. */
const CHOICES = {
  battleLog: ['ask', 'auto', 'off'],
  diceLog: ['ask', 'auto', 'off'],
  diceAnimation: ['stage', 'simple', 'off'],
} as const;
type ChoiceKey = keyof typeof CHOICES;
const CHOICE_KEYS = Object.keys(CHOICES) as ChoiceKey[];
const isChoice = (key: string): key is ChoiceKey => key in CHOICES;

export const DEFAULT_SETTINGS: Settings = {
  showProperties: false,
  experience: false,
  stepNames: [],
  worldMode: 'graph',
  thresholds: DEFAULT_THRESHOLDS,
  sessionTemplate: 'Templates/Session.md',
  sessionAnswer: null,
  positions: {},
  viewMoves: {},
  npcTemplate: 'Templates/NPC.md',
  archetypeFolder: 'Templates/Archetypes',
  tablesFolder: 'Templates/Tables',
  npcFolder: 'NPCs',
  racesFolder: 'Templates/Races',
  tableLanguage: 'auto',
  spellbook: null,
  deckSize: 22,
  deckFolder: 'Decks',
  spellFolder: 'Spells',
  monsterFolder: 'Monsters',
  encounterFolder: 'Encounters',
  monsterManual: null,
  deckSelected: 'standard',
  battleSelected: null,
  battleLog: 'ask',
  diceLog: 'ask',
  diceAnimation: 'stage',
};

/** The text settings that name a note or folder, falling back to the default when emptied. */
type PathKey =
  | 'sessionTemplate'
  | 'npcTemplate'
  | 'archetypeFolder'
  | 'racesFolder'
  | 'tablesFolder'
  | 'npcFolder'
  | 'deckFolder'
  | 'spellFolder'
  | 'monsterFolder'
  | 'encounterFolder';
const PATHS: readonly PathKey[] = [
  'sessionTemplate',
  'npcTemplate',
  'archetypeFolder',
  'racesFolder',
  'tablesFolder',
  'npcFolder',
  'deckFolder',
  'spellFolder',
  'monsterFolder',
  'encounterFolder',
];
const LANGS = ['auto', 'en', 'de'] as const;
const DECK_SIZES = ['22', '13'] as const;
const isPath = (key: string): key is PathKey => (PATHS as readonly string[]).includes(key);

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
        name: this.t('settings.experience'),
        desc: this.t('settings.experience.desc'),
        control: { type: 'toggle', key: 'experience', defaultValue: false },
      },
      {
        name: this.t('settings.tableLanguage'),
        desc: this.t('settings.tableLanguage.desc'),
        control: {
          type: 'dropdown',
          key: 'tableLanguage',
          options: Object.fromEntries(LANGS.map((l) => [l, this.t(`settings.tableLanguage.${l}`)])),
        },
      },
      {
        name: this.t('settings.deckSize'),
        desc: this.t('settings.deckSize.desc'),
        control: {
          type: 'dropdown',
          key: 'deckSize',
          options: Object.fromEntries(DECK_SIZES.map((n) => [n, this.t(`settings.deckSize.${n}`)])),
        },
      },
      ...CHOICE_KEYS.map((key) => ({
        name: this.t(`settings.${key}`),
        desc: this.t(`settings.${key}.desc`),
        control: {
          type: 'dropdown' as const,
          key,
          options: Object.fromEntries(CHOICES[key].map((m) => [m, this.choiceLabel(key, m)])),
        },
      })),
      ...PATHS.map((key) => ({
        name: this.t(`settings.${key}`),
        desc: this.t(`settings.${key}.desc`),
        control: { type: 'text' as const, key, placeholder: DEFAULT_SETTINGS[key] },
      })),
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
    if (isPath(key)) return this.settings()[key];
    if (key === 'tableLanguage') return this.settings().tableLanguage;
    if (key === 'deckSize') return String(this.settings().deckSize);
    if (isChoice(key)) return this.settings()[key];
    if (key === 'experience') return this.settings().experience;
    return key === 'showProperties' ? this.settings().showProperties : undefined;
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    if (key === 'showProperties' && typeof value === 'boolean') {
      await this.save({ ...this.settings(), showProperties: value });
    }
    if (key === 'experience' && typeof value === 'boolean') {
      await this.save({ ...this.settings(), experience: value });
    }
    if (isPath(key) && typeof value === 'string') await this.setPath(key, value);
    if (key === 'tableLanguage') await this.setLanguage(value);
    if (key === 'deckSize') await this.setDeckSize(value);
    if (isChoice(key)) await this.setChoice(key, value);
    if (key.startsWith(STEP_KEY) && typeof value === 'string') {
      await this.setStepName(Number(key.slice(STEP_KEY.length)), value);
    }
    if (key.startsWith(THRESHOLD_KEY)) {
      await this.setThreshold(key.slice(THRESHOLD_KEY.length) as keyof Thresholds, value);
    }
  }

  private async setLanguage(value: unknown): Promise<void> {
    const lang = LANGS.find((l) => l === value);
    if (lang !== undefined) await this.save({ ...this.settings(), tableLanguage: lang });
  }

  private async setDeckSize(value: unknown): Promise<void> {
    if (value === '13' || value === '22') {
      await this.save({ ...this.settings(), deckSize: value === '13' ? 13 : 22 });
    }
  }

  private choiceLabel(key: ChoiceKey, value: string): string {
    return this.t(`settings.${key}.${value}` as StringKey);
  }

  private async setChoice(key: ChoiceKey, value: unknown): Promise<void> {
    const choice = (CHOICES[key] as readonly string[]).find((m) => m === value);
    if (choice !== undefined) await this.save({ ...this.settings(), [key]: choice });
  }

  private async setPath(key: PathKey, value: string): Promise<void> {
    await this.save({ ...this.settings(), [key]: value.trim() || DEFAULT_SETTINGS[key] });
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
      .setName(t('settings.experience'))
      .setDesc(t('settings.experience.desc'))
      .addToggle((toggle) =>
        toggle
          .setValue(this.settings().experience)
          .onChange((value) => this.save({ ...this.settings(), experience: value })),
      );
    new Setting(containerEl)
      .setName(t('settings.tableLanguage'))
      .setDesc(t('settings.tableLanguage.desc'))
      .addDropdown((dropdown) => {
        for (const l of LANGS) dropdown.addOption(l, t(`settings.tableLanguage.${l}`));
        dropdown
          .setValue(this.settings().tableLanguage)
          .onChange((value) => this.setLanguage(value));
      });
    new Setting(containerEl)
      .setName(t('settings.deckSize'))
      .setDesc(t('settings.deckSize.desc'))
      .addDropdown((dropdown) => {
        for (const n of DECK_SIZES) dropdown.addOption(n, t(`settings.deckSize.${n}`));
        dropdown
          .setValue(String(this.settings().deckSize))
          .onChange((value) => this.setDeckSize(value));
      });
    for (const key of CHOICE_KEYS) {
      new Setting(containerEl)
        .setName(t(`settings.${key}`))
        .setDesc(t(`settings.${key}.desc`))
        .addDropdown((dropdown) => {
          for (const m of CHOICES[key]) dropdown.addOption(m, this.choiceLabel(key, m));
          dropdown.setValue(this.settings()[key]).onChange((value) => this.setChoice(key, value));
        });
    }
    for (const key of PATHS) {
      new Setting(containerEl)
        .setName(t(`settings.${key}`))
        .setDesc(t(`settings.${key}.desc`))
        .addText((text) =>
          text
            .setPlaceholder(DEFAULT_SETTINGS[key])
            .setValue(this.settings()[key])
            .onChange((value) => this.setPath(key, value)),
        );
    }
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
