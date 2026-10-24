// The "Faction world" tab: a header with Graph/Matrix and Public/True switches, a warnings badge
// and re-layout, and below it the graph or the matrix. Public on every opening; redrawn whenever
// the world cache rebuilds.

import { ItemView, setIcon, type WorkspaceLeaf } from 'obsidian';

import { buildMatrix } from '../factions/matrix';
import type { FactionWorld, Mode, RelationField } from '../factions/model';
import type { EditTarget } from '../factions/world-graph';
import type { T } from '../i18n/strings';
import type { CachedPoint } from '../factions/layout';
import { WorldGraphSvg } from './world-graph-svg';
import { renderMatrix } from './world-matrix';
import type { Settings } from './settings';
import type { WorldCache } from './world-cache';

export const WORLD_VIEW = 'dnd5e-faction-world';

export interface WorldViewDeps {
  cache: WorldCache;
  t: T;
  settings: () => Settings;
  save: (settings: Settings) => Promise<void>;
  openNote: (path: string, newLeaf: boolean) => void;
  editValue: (edit: EditTarget, newLeaf: boolean) => void;
  addValue: (add: { path: string; field: RelationField; key: string }, newLeaf: boolean) => void;
  showWarnings: (world: FactionWorld) => void;
}

export class WorldView extends ItemView {
  private mode: Mode = 'public';
  private header!: HTMLElement;
  private body!: HTMLElement;
  private graph: WorldGraphSvg | null = null;

  constructor(
    leaf: WorkspaceLeaf,
    private readonly deps: WorldViewDeps,
  ) {
    super(leaf);
  }

  getViewType(): string {
    return WORLD_VIEW;
  }

  getDisplayText(): string {
    return this.deps.t('world.title');
  }

  getIcon(): string {
    return 'network';
  }

  async onOpen(): Promise<void> {
    this.mode = 'public';
    this.contentEl.empty();
    this.contentEl.addClass('dnd5e-world');
    this.header = this.contentEl.createDiv({ cls: 'dnd5e-world-header' });
    this.body = this.contentEl.createDiv({ cls: 'dnd5e-world-body' });
    this.register(this.deps.cache.onChange(() => this.render()));
    await this.deps.cache.get();
    this.render();
  }

  async onClose(): Promise<void> {
    this.graph = null;
    this.contentEl.empty();
  }

  private render(): void {
    const world = this.deps.cache.current;
    if (world === null) return;
    this.renderHeader(world);
    if (world.campaign === null) {
      this.graph = null;
      this.body.empty();
      const empty = this.body.createDiv({ cls: 'dnd5e-world-empty' });
      empty.createDiv({ text: this.deps.t('modal.noCampaign') });
      empty.createDiv({ text: this.deps.t('world.noCampaignHint') });
      return;
    }
    if (this.deps.settings().worldMode === 'matrix') {
      this.graph = null;
      this.body.empty();
      renderMatrix(
        this.body,
        buildMatrix(world, this.mode),
        this.deps.t,
        this.deps.settings().stepNames,
        this.deps,
      );
      return;
    }
    if (this.graph === null) {
      this.body.empty();
      this.graph = new WorldGraphSvg(this.body, this.deps.t, () => this.deps.settings().stepNames, {
        openNote: this.deps.openNote,
        editValue: this.deps.editValue,
        savePositions: (positions) =>
          void this.savePositions(world.campaign?.path ?? '', positions),
      });
      this.graph.redraw = () => this.render();
    }
    this.graph.update(world, this.mode, this.cachedPositions(world));
  }

  private cachedPositions(world: FactionWorld): Record<string, CachedPoint> {
    return this.deps.settings().positions[world.campaign?.path ?? ''] ?? {};
  }

  private async savePositions(
    campaign: string,
    positions: Record<string, CachedPoint>,
  ): Promise<void> {
    const settings = this.deps.settings();
    await this.deps.save({
      ...settings,
      positions: { ...settings.positions, [campaign]: positions },
    });
  }

  private renderHeader(world: FactionWorld): void {
    const { t } = this.deps;
    this.header.empty();
    const settings = this.deps.settings();
    this.segmented(
      [
        ['graph', t('world.graph')],
        ['matrix', t('world.matrix')],
      ],
      settings.worldMode,
      (value) =>
        void this.deps
          .save({ ...this.deps.settings(), worldMode: value })
          .then(() => this.render()),
    );
    this.segmented(
      [
        ['public', t('world.public')],
        ['true', t('world.true')],
      ],
      this.mode,
      (value) => {
        this.mode = value;
        this.render();
      },
    );
    this.header.createDiv({ cls: 'dnd5e-world-spacer' });
    if (world.warnings.length > 0) {
      const badge = this.header.createEl('button', {
        cls: 'dnd5e-card-badge',
        text:
          world.warnings.length === 1
            ? t('card.warnings.one')
            : t('card.warnings.many', { count: world.warnings.length }),
      });
      setIcon(badge.createSpan({ cls: 'dnd5e-card-icon' }), 'alert-triangle');
      badge.addEventListener('click', () => this.deps.showWarnings(world));
    }
    if (settings.worldMode === 'graph' && world.campaign !== null) {
      const relayout = this.header.createEl('button', {
        cls: 'clickable-icon',
        attr: { 'aria-label': t('world.relayout') },
      });
      setIcon(relayout, 'refresh-cw');
      relayout.addEventListener('click', () => this.graph?.relayout(world, this.mode));
    }
  }

  /** A row of buttons of which one is active. */
  private segmented<V extends string>(
    options: [V, string][],
    active: V,
    pick: (value: V) => void,
  ): void {
    const group = this.header.createDiv({ cls: 'dnd5e-world-segmented' });
    for (const [value, label] of options) {
      const button = group.createEl('button', {
        text: label,
        cls: value === active ? 'is-active' : '',
        attr: { 'aria-pressed': String(value === active) },
      });
      button.addEventListener('click', () => value !== active && pick(value));
    }
  }
}
