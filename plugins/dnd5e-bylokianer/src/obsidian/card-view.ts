// Mounting the faction card into Markdown views, in Reading view and Live Preview, where
// Obsidian's Properties block sits. This is the one module that knows Obsidian's view DOM; every
// selector it relies on is here, with a fallback that keeps the card visible if one is missing.

import { MarkdownView, type PaneType, type Plugin, type TFile, type WorkspaceLeaf } from 'obsidian';

import { buildCard, type CardModel } from '../factions/card';
import type { FactionWorld } from '../factions/model';
import type { T } from '../i18n/strings';
import { CardRenderer, type CardUiState, type FocusTarget } from './card-render';
import type { ValueChange } from './session-log';
import type { Settings } from './settings';
import type { WorldCache } from './world-cache';

const VIEW_CLASS = 'dnd5e-entity-view';
const SHOW_PROPERTIES_CLASS = 'dnd5e-show-properties';

type Mode = 'preview' | 'live' | 'source';

interface Mount {
  path: string;
  mode: Mode;
  el: HTMLElement;
  renderer: CardRenderer;
  signature: string;
  ui: CardUiState;
  /** A rebuild arrived while a text field had focus; done once it loses focus. */
  pending: boolean;
}

function modeOf(view: MarkdownView): Mode {
  if (view.getMode() === 'preview') {
    return 'preview';
  }
  return view.getState().source === true ? 'source' : 'live';
}

/** Where the card goes: right after Properties, else after the inline title, else at the top. */
function placement(view: MarkdownView, mode: Mode): { parent: HTMLElement; before: Node | null } {
  const sizer =
    mode === 'preview'
      ? view.previewMode.containerEl.querySelector<HTMLElement>('.markdown-preview-sizer')
      : view.contentEl.querySelector<HTMLElement>('.markdown-source-view .cm-sizer');
  if (sizer !== null) {
    const anchor =
      sizer.querySelector<HTMLElement>('.metadata-container') ??
      sizer.querySelector<HTMLElement>('.inline-title');
    if (anchor?.parentElement) {
      return { parent: anchor.parentElement, before: anchor.nextSibling };
    }
    const content = sizer.querySelector(':scope > .cm-contentContainer');
    return { parent: sizer, before: content ?? sizer.firstChild };
  }
  return { parent: view.contentEl, before: view.contentEl.firstChild };
}

export class CardManager {
  private readonly mounts = new WeakMap<MarkdownView, Mount>();
  private readonly scheduled = new Set<MarkdownView>();

  constructor(
    private readonly plugin: Plugin,
    private readonly cache: WorldCache,
    private readonly t: T,
    private readonly settings: () => Settings,
    private readonly offerLog: (change: ValueChange) => void,
  ) {}

  start(): void {
    const { workspace } = this.plugin.app;
    const refresh = () => this.refreshAll();
    this.plugin.registerEvent(workspace.on('file-open', refresh));
    this.plugin.registerEvent(workspace.on('layout-change', refresh));
    this.plugin.registerEvent(workspace.on('active-leaf-change', refresh));
    const stop = this.cache.onChange(refresh);
    this.plugin.register(stop);
    // Reading view re-renders its sections; put the card back once it has.
    this.plugin.registerMarkdownPostProcessor((_el, ctx) => {
      for (const view of this.views()) {
        if (view.file?.path === ctx.sourcePath) this.schedule(view);
      }
    });
    this.plugin.register(() => this.unmountAll());
    workspace.onLayoutReady(() => void this.cache.get().then(refresh));
  }

  private *views(): Generator<MarkdownView> {
    for (const leaf of this.plugin.app.workspace.getLeavesOfType('markdown')) {
      if (leaf.view instanceof MarkdownView) yield leaf.view;
    }
  }

  refreshAll(): void {
    for (const view of this.views()) {
      this.ensure(view);
    }
  }

  private schedule(view: MarkdownView): void {
    if (this.scheduled.has(view)) return;
    this.scheduled.add(view);
    window.setTimeout(() => {
      this.scheduled.delete(view);
      this.ensure(view);
    }, 0);
  }

  /** The card a view should show now, or null. */
  private cardFor(
    view: MarkdownView,
  ): { file: TFile; card: CardModel; world: FactionWorld } | null {
    const file = view.file;
    const world = this.cache.current;
    if (file === null || world === null) return null;
    const frontmatter = this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;
    const card = buildCard(file.path, frontmatter, world);
    return card === null ? null : { file, card, world };
  }

  ensure(view: MarkdownView): void {
    const mode = modeOf(view);
    const found = mode === 'source' ? null : this.cardFor(view);
    if (found === null) {
      this.unmount(view);
      return;
    }
    const { file, card, world } = found;
    view.containerEl.addClass(VIEW_CLASS);
    view.containerEl.toggleClass(SHOW_PROPERTIES_CLASS, this.settings().showProperties);

    const { stepNames } = this.settings();
    const signature = JSON.stringify([card, stepNames]);
    const old = this.mounts.get(view);
    const same = old !== undefined && old.path === file.path && old.mode === mode;
    if (same && old.el.isConnected) {
      if (old.signature === signature) return;
      // Only a text field being typed in holds the rebuild back; a slider does not.
      const active = activeDocument.activeElement;
      if (old.el.contains(active) && active instanceof HTMLInputElement && active.type === 'text') {
        old.pending = true;
        return;
      }
    }
    const ui: CardUiState = same ? old.ui : { secretOpen: false, fieldsOpen: false };
    this.unmount(view, false);

    const el = createDiv({ cls: 'dnd5e-card' });
    // Clicks in the card must not move the editor's cursor in Live Preview.
    el.addEventListener('mousedown', (e) => e.stopPropagation());
    const { parent, before } = placement(view, mode);
    parent.insertBefore(el, before);
    const renderer = new CardRenderer(
      {
        app: this.plugin.app,
        view,
        file,
        card,
        world,
        t: this.t,
        ui,
        stepNames,
        offerLog: this.offerLog,
        refresh: () => {
          const mount = this.mounts.get(view);
          if (mount !== undefined) mount.signature = '';
          this.ensure(view);
        },
      },
      el,
    );
    renderer.load();
    renderer.render();
    const mount: Mount = { path: file.path, mode, el, renderer, signature, ui, pending: false };
    el.addEventListener('focusout', () => {
      window.setTimeout(() => {
        const active = activeDocument.activeElement;
        const typing =
          el.contains(active) && active instanceof HTMLInputElement && active.type === 'text';
        if (mount.pending && !typing) {
          mount.pending = false;
          mount.signature = '';
          this.ensure(view);
        }
      }, 0);
    });
    this.mounts.set(view, mount);
  }

  private unmount(view: MarkdownView, dropClass = true): void {
    const mount = this.mounts.get(view);
    if (mount !== undefined) {
      mount.renderer.unload();
      mount.el.remove();
      this.mounts.delete(view);
    }
    if (dropClass) {
      view.containerEl.removeClass(VIEW_CLASS, SHOW_PROPERTIES_CLASS);
    }
  }

  private unmountAll(): void {
    for (const view of this.views()) this.unmount(view);
  }

  /**
   * The leaf a note opens in. From a note, as Obsidian does; from another view (the world view) the
   * most recent note tab, so that view is not replaced, or a new tab.
   */
  leafFor(newLeaf: PaneType | boolean): WorkspaceLeaf {
    const { workspace } = this.plugin.app;
    if (newLeaf !== false || workspace.getActiveViewOfType(MarkdownView) !== null) {
      return workspace.getLeaf(newLeaf);
    }
    return workspace.getLeavesOfType('markdown')[0] ?? workspace.getLeaf('tab');
  }

  /** Opens a note, makes sure its card shows, and focuses what `target` points at. */
  async open(path: string, target: FocusTarget, newLeaf: PaneType | boolean): Promise<void> {
    const { app } = this.plugin;
    const file = app.vault.getFileByPath(path);
    if (file === null) return;
    const leaf = this.leafFor(newLeaf);
    await leaf.openFile(file);
    const view = leaf.view;
    if (!(view instanceof MarkdownView)) return;
    await this.reveal(view);
    this.mounts.get(view)?.renderer.focus(target);
  }

  /** Switches source mode to Live Preview and mounts the card; false when the note has none. */
  async reveal(view: MarkdownView): Promise<boolean> {
    await this.cache.get();
    if (modeOf(view) === 'source') {
      await view.setState(
        { ...view.getState(), mode: 'source', source: false },
        { history: false },
      );
    }
    this.ensure(view);
    return this.mounts.has(view);
  }

  hasCard(view: MarkdownView): boolean {
    return this.cardFor(view) !== null;
  }

  focusActive(view: MarkdownView): void {
    this.mounts.get(view)?.renderer.focus({ first: true });
  }
}
