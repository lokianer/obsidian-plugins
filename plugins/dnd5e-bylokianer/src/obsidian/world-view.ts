// The "Faction world" tab: a header with Graph/Matrix and Public/True switches, a warnings badge,
// re-layout and the tension panel; below it the graph, the matrix, or — after a click on a faction —
// that faction's view with a breadcrumb back. Public on every opening; redrawn whenever the world
// cache rebuilds.

import { ItemView, setIcon, type WorkspaceLeaf } from 'obsidian';

import { buildFactionView, type FactionView } from '../factions/faction-view';
import type { CachedPoint } from '../factions/layout';
import { buildMatrix } from '../factions/matrix';
import type { FactionWorld, Mode } from '../factions/model';
import type { EditTarget } from '../factions/model';
import type { T } from '../i18n/strings';
import { FactionViewSvg } from './faction-view-svg';
import type { ModeStore } from './mode-store';
import { type PopoverTarget, ValuePopover } from './popover';
import type { SessionLog } from './session-log';
import type { Settings } from './settings';
import type { WorldCache } from './world-cache';
import { WorldGraphSvg } from './world-graph-svg';
import { renderMatrix } from './world-matrix';

export const WORLD_VIEW = 'dnd5e-faction-world';

export interface WorldViewDeps {
  cache: WorldCache;
  modes: ModeStore;
  t: T;
  settings: () => Settings;
  save: (settings: Settings) => Promise<void>;
  openNote: (path: string, newLeaf: boolean) => void;
  /** Open a note with the faction card on an entry (the popover's "Open card"). */
  editValue: (edit: EditTarget, newLeaf: boolean) => void;
  sessionLog: SessionLog;
  showWarnings: (world: FactionWorld) => void;
  showTensions: () => void;
}

export class WorldView extends ItemView {
  private mode: Mode = 'public';
  /** The faction whose view is open, or null for the world. */
  private focus: string | null = null;
  private header!: HTMLElement;
  private body!: HTMLElement;
  private graph: WorldGraphSvg | null = null;
  private factionView: FactionViewSvg | null = null;
  private relayoutAction: HTMLElement | null = null;
  private popover: ValuePopover | null = null;

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
    this.setMode('public');
    this.contentEl.empty();
    this.contentEl.addClass('dnd5e-world');
    const { t } = this.deps;
    if (this.relayoutAction === null) {
      this.addAction('zap', t('command.showTensions'), () => this.deps.showTensions());
      this.relayoutAction = this.addAction('refresh-cw', t('world.relayout'), () => {
        const world = this.deps.cache.current;
        if (world !== null) this.graph?.relayout(world, this.mode);
      });
    }
    this.popover = new ValuePopover(this.contentEl, {
      app: this.app,
      t,
      stepNames: () => this.deps.settings().stepNames,
      openCard: (edit) => this.deps.editValue(edit, false),
      offerLog: (change) => this.deps.sessionLog.offer(change),
    });
    this.register(this.deps.sessionLog.onChange(() => this.render()));
    this.header = this.contentEl.createDiv({ cls: 'dnd5e-world-header' });
    this.body = this.contentEl.createDiv({ cls: 'dnd5e-world-body' });
    this.register(this.deps.cache.onChange(() => this.render()));
    await this.deps.cache.get();
    this.render();
  }

  async onClose(): Promise<void> {
    this.deps.modes.set('public');
    this.popover?.close();
    this.graph = null;
    this.factionView = null;
    this.contentEl.empty();
  }

  private setMode(mode: Mode): void {
    this.popover?.close();
    this.mode = mode;
    this.deps.modes.set(mode);
  }

  private openFaction(id: string | null): void {
    this.popover?.close();
    this.focus = id;
    this.render();
  }

  /** Shows one body element at a time, dropping the drawings that are not shown. */
  private show(kind: 'graph' | 'faction' | 'other'): void {
    const keep =
      (kind === 'graph' && this.graph !== null) ||
      (kind === 'faction' && this.factionView !== null);
    if (kind !== 'graph') this.graph = null;
    if (kind !== 'faction') this.factionView = null;
    if (!keep) this.body.empty();
  }

  private render(): void {
    const world = this.deps.cache.current;
    if (world === null) return;
    const view = this.focus === null ? null : buildFactionView(world, this.focus, this.mode);
    if (view === null) this.focus = null;
    this.renderHeader(world, view);
    const { t } = this.deps;

    if (world.campaign === null) {
      this.show('other');
      const empty = this.body.createDiv({ cls: 'dnd5e-world-empty' });
      empty.createDiv({ text: t('modal.noCampaign') });
      empty.createDiv({ text: t('world.noCampaignHint') });
      return;
    }
    const stepNames = () => this.deps.settings().stepNames;
    this.popover?.refresh(world, this.mode);
    const values = {
      openValue: (target: PopoverTarget) => this.popover?.open(target, world, this.mode),
      history: (from: string, to: string) => this.deps.sessionLog.describe(from, to, this.mode),
    };
    if (view !== null) {
      this.show('faction');
      this.factionView ??= new FactionViewSvg(this.body, t, stepNames, {
        openNote: this.deps.openNote,
        openFaction: (id) => this.openFaction(id),
        ...values,
      });
      this.factionView.update(view, this.angles(world, view.id));
      return;
    }
    if (this.deps.settings().worldMode === 'matrix') {
      this.show('other');
      renderMatrix(this.body, buildMatrix(world, this.mode), t, stepNames(), {
        openNote: this.deps.openNote,
        ...values,
      });
      return;
    }
    this.show('graph');
    if (this.graph === null) {
      this.graph = new WorldGraphSvg(this.body, t, stepNames, {
        openNote: this.deps.openNote,
        ...values,
        openFaction: (id) => this.openFaction(id),
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

  /** Each node's direction from `id` in the world graph, from the cached layout. */
  private angles(world: FactionWorld, id: string): Map<string, number> {
    const positions = this.cachedPositions(world);
    const centre = positions[id];
    const angles = new Map<string, number>();
    if (centre === undefined) return angles;
    for (const [other, p] of Object.entries(positions)) {
      if (other !== id) angles.set(other, Math.atan2(p.y - centre.y, p.x - centre.x));
    }
    return angles;
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

  private renderHeader(world: FactionWorld, view: FactionView | null): void {
    const { t } = this.deps;
    this.header.empty();
    const settings = this.deps.settings();
    if (view !== null) {
      this.renderBreadcrumb(view);
    } else {
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
    }
    this.segmented(
      [
        ['public', t('world.public')],
        ['true', t('world.true')],
      ],
      this.mode,
      (value) => {
        this.setMode(value);
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
    // Re-layout lives in Obsidian's own view header; it only means something on the graph.
    this.relayoutAction?.toggleClass(
      'dnd5e-hidden',
      view !== null || settings.worldMode !== 'graph' || world.campaign === null,
    );
  }

  private renderBreadcrumb(view: FactionView): void {
    const { t } = this.deps;
    const crumbs = this.header.createDiv({ cls: 'dnd5e-world-breadcrumb' });
    const link = (label: string, target: string | null) => {
      const a = crumbs.createEl('a', { text: label, href: '#' });
      a.addEventListener('click', (event) => {
        event.preventDefault();
        this.openFaction(target);
      });
      crumbs.createSpan({ cls: 'dnd5e-world-crumb-sep', text: '›' });
    };
    link(t('world.title'), null);
    for (const parent of view.parents) link(parent.name, parent.id);
    const pseudo: Record<string, string> = {
      '@party': t('pseudo.party'),
      '@unaffiliated': t('pseudo.unaffiliated'),
    };
    crumbs.createSpan({ cls: 'dnd5e-world-crumb-current', text: pseudo[view.id] ?? view.name });
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
