// The tension panel in the right sidebar: the four rules' findings as sentences, names linking to
// their notes and values to the faction card. Follows the faction world's Public / True toggle.

import { ItemView, type WorkspaceLeaf } from 'obsidian';

import type { FactionWorld } from '../factions/model';
import { signed, stepColour } from '../factions/steps';
import { findTensions, type Tension, type Thresholds, type ValueRef } from '../factions/tension';
import type { EditTarget } from '../factions/world-graph';
import type { StringKey, T } from '../i18n/strings';
import type { ModeStore } from './mode-store';
import type { WorldCache } from './world-cache';

export const TENSION_VIEW = 'dnd5e-tensions';

const RULES: readonly Tension['rule'][] = [
  'one-sided',
  'out-of-line',
  'public-true',
  'split-allies',
];

export interface TensionViewDeps {
  cache: WorldCache;
  modes: ModeStore;
  t: T;
  thresholds: () => Thresholds;
  openNote: (path: string, newLeaf: boolean) => void;
  editValue: (edit: EditTarget, newLeaf: boolean) => void;
}

/** A sentence piece: plain text, an entity's name (links to its note), or a value (links to the card). */
type Piece = string | { entity: string } | { value: ValueRef };

export class TensionView extends ItemView {
  constructor(
    leaf: WorkspaceLeaf,
    private readonly deps: TensionViewDeps,
  ) {
    super(leaf);
  }

  getViewType(): string {
    return TENSION_VIEW;
  }

  getDisplayText(): string {
    return this.deps.t('tension.title');
  }

  getIcon(): string {
    return 'zap';
  }

  async onOpen(): Promise<void> {
    this.contentEl.addClass('dnd5e-tensions');
    this.register(this.deps.cache.onChange(() => this.render()));
    this.register(this.deps.modes.onChange(() => this.render()));
    await this.deps.cache.get();
    this.render();
  }

  async onClose(): Promise<void> {
    this.contentEl.empty();
  }

  /** Called when the thresholds change. */
  refresh(): void {
    this.render();
  }

  private render(): void {
    const world = this.deps.cache.current;
    if (world === null) return;
    const { t } = this.deps;
    const mode = this.deps.modes.mode;
    this.contentEl.empty();
    const head = this.contentEl.createDiv({ cls: 'dnd5e-tensions-head' });
    head.createSpan({
      cls: 'dnd5e-card-tag',
      text: t(mode === 'true' ? 'world.true' : 'world.public'),
    });
    if (world.campaign === null) {
      this.contentEl.createDiv({ cls: 'dnd5e-tensions-empty', text: t('modal.noCampaign') });
      return;
    }
    const found = findTensions(world, mode, this.deps.thresholds());
    if (found.length === 0) {
      this.contentEl.createDiv({ cls: 'dnd5e-tensions-empty', text: t('tension.none') });
      return;
    }
    for (const rule of RULES) {
      const list = found.filter((f) => f.rule === rule);
      if (list.length === 0) continue;
      const group = this.contentEl.createDiv({ cls: 'dnd5e-tensions-group' });
      group.createDiv({ cls: 'dnd5e-card-section-title', text: t(`tension.${rule}` as StringKey) });
      for (const tension of list) {
        this.renderLine(group.createDiv({ cls: 'dnd5e-tensions-line' }), world, pieces(tension, t));
      }
    }
    if (mode === 'public') {
      this.contentEl.createDiv({ cls: 'dnd5e-tensions-note', text: t('tension.publicOnly') });
    }
  }

  private renderLine(el: HTMLElement, world: FactionWorld, line: Piece[]): void {
    for (const piece of line) {
      if (typeof piece === 'string') {
        el.appendText(piece);
      } else if ('entity' in piece) {
        const entity = world.entities.get(piece.entity);
        const name = entity?.name ?? piece.entity.replace(/^\?/, '');
        const path = entity?.notePath ?? null;
        if (path === null) {
          el.createSpan({ cls: 'dnd5e-tensions-name', text: name });
          continue;
        }
        const a = el.createEl('a', { cls: 'dnd5e-tensions-name', text: name, href: '#' });
        a.addEventListener('click', (event) => {
          event.preventDefault();
          this.deps.openNote(path, event.ctrlKey || event.metaKey);
        });
      } else {
        const { value } = piece;
        const chip = el.createEl('a', {
          cls: 'dnd5e-tensions-value',
          text: signed(value.value),
          href: '#',
        });
        chip.setCssProps({ '--dnd5e-value-colour': stepColour(value.value) });
        chip.addEventListener('click', (event) => {
          event.preventDefault();
          this.deps.editValue(value.edit, event.ctrlKey || event.metaKey);
        });
      }
    }
  }
}

/** The sentence for a finding, in the interface language's word order. */
function pieces(tension: Tension, t: T): Piece[] {
  const arrow = (ref: ValueRef): Piece[] => [
    { entity: ref.from },
    ' → ',
    { entity: ref.to },
    ' ',
    { value: ref },
  ];
  const delta = ` (Δ ${tension.difference})`;
  switch (tension.rule) {
    case 'one-sided':
      return [...arrow(tension.there), ' · ', ...arrow(tension.back), delta];
    case 'out-of-line':
      return [...arrow(tension.own), ` · ${t('tension.line')} `, ...arrow(tension.line), delta];
    case 'public-true':
      return [
        { entity: tension.public.from },
        ' → ',
        { entity: tension.public.to },
        `: ${t('world.public')} `,
        { value: tension.public },
        `, ${t('world.true')} `,
        { value: tension.true },
        delta,
      ];
    case 'split-allies':
      return [
        ...arrow(tension.first),
        ' · ',
        ...arrow(tension.second),
        ` · ${t('tension.allies')}`,
      ];
  }
}
