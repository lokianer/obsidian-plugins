// The value popover of the faction world: a slider for one relation at the cell or arrow it was
// opened from, writing the subject's own note in the mode's field (an inherited value becomes an
// own one), with the reason, "Reset to inherited" and "Open card". One per view.

import { debounce, type App } from 'obsidian';

import { buildCard, type CardRow } from '../factions/card';
import type { FactionWorld, Mode, RelationField } from '../factions/model';
import { fallbackStance, stance } from '../factions/stance';
import { signed, stepColour, stepName } from '../factions/steps';
import type { EditTarget } from '../factions/model';
import type { T } from '../i18n/strings';
import type { EditOp } from '../yaml/edit';
import type { ValueChange } from './session-log';
import { undoableWrite, writeOp } from './write';

const SLIDER_DELAY = 400;

export interface PopoverDeps {
  app: App;
  t: T;
  stepNames: () => readonly string[];
  /** Open the subject's note with the card on this entry. */
  openCard: (edit: EditTarget) => void;
  /** Offer to log a value change. */
  offerLog: (change: ValueChange) => void;
}

/** Where the popover was opened: the relation and the screen point to show it at. */
export interface PopoverTarget {
  subject: string;
  target: string;
  at: { x: number; y: number };
}

function nameOf(world: FactionWorld, id: string): string {
  return world.entities.get(id)?.name ?? id.replace(/^\?/, '');
}

export class ValuePopover {
  private el: HTMLElement | null = null;
  private target: PopoverTarget | null = null;
  private readonly onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') this.close();
  };
  private readonly onOutside = (event: PointerEvent) => {
    if (this.el !== null && !this.el.contains(event.target as Node)) this.close();
  };

  constructor(
    private readonly container: HTMLElement,
    private readonly deps: PopoverDeps,
  ) {}

  open(target: PopoverTarget, world: FactionWorld, mode: Mode): void {
    this.close();
    this.target = target;
    this.el = this.container.createDiv({ cls: 'dnd5e-popover' });
    this.render(world, mode);
    this.place(target.at);
    activeDocument.addEventListener('keydown', this.onKey);
    // Registered after this click has finished, so the click that opened it does not close it.
    window.setTimeout(() => activeDocument.addEventListener('pointerdown', this.onOutside), 0);
  }

  /** Redraws with fresh data after the world changed, if open. */
  refresh(world: FactionWorld, mode: Mode): void {
    if (this.el === null || this.target === null) return;
    if (!world.entities.has(this.target.subject)) {
      this.close();
      return;
    }
    if (
      this.el.contains(activeDocument.activeElement) &&
      activeDocument.activeElement instanceof HTMLInputElement &&
      activeDocument.activeElement.type === 'text'
    ) {
      return;
    }
    this.render(world, mode);
  }

  close(): void {
    this.el?.remove();
    this.el = null;
    this.target = null;
    activeDocument.removeEventListener('keydown', this.onKey);
    activeDocument.removeEventListener('pointerdown', this.onOutside);
  }

  private place(at: { x: number; y: number }): void {
    const el = this.el;
    if (el === null) return;
    const box = this.container.getBoundingClientRect();
    if (box.width < 520) {
      el.addClass('is-docked');
      return;
    }
    const width = el.offsetWidth || 360;
    const height = el.offsetHeight || 180;
    const x = Math.min(Math.max(8, at.x - box.left - width / 2), box.width - width - 8);
    const below = at.y - box.top + 12;
    const y = below + height > box.height - 8 ? Math.max(8, at.y - box.top - height - 12) : below;
    el.setCssStyles({ left: `${x}px`, top: `${y}px` });
  }

  private render(world: FactionWorld, mode: Mode): void {
    const el = this.el;
    const target = this.target;
    if (el === null || target === null) return;
    const { t } = this.deps;
    const subject = world.entities.get(target.subject);
    const notePath = subject?.notePath ?? null;
    const file = notePath === null ? null : this.deps.app.vault.getFileByPath(notePath);
    if (subject === undefined || file === null) {
      this.close();
      return;
    }
    const field: RelationField = mode === 'true' ? 'secret_relations' : 'relations';
    const frontmatter = this.deps.app.metadataCache.getFileCache(file)?.frontmatter;
    const card = buildCard(file.path, frontmatter, world);
    const row: CardRow | undefined = card?.sections[field].rows.find(
      (r) => (r.targetId ?? `?${r.key}`) === target.target,
    );
    const current = stance(world, target.subject, target.target, mode);
    const fallback = fallbackStance(world, target.subject, target.target, mode);
    const subjectName = subject.name;
    const targetName = nameOf(world, target.target);

    el.empty();
    const head = el.createDiv({ cls: 'dnd5e-popover-head' });
    head.createSpan({ cls: 'dnd5e-popover-title', text: `${subjectName} → ${targetName}` });
    if (mode === 'true')
      head.createSpan({ cls: 'dnd5e-card-tag is-secret', text: t('field.secret') });
    const close = head.createEl('button', {
      cls: 'clickable-icon',
      attr: { 'aria-label': 'Close' },
    });
    close.setText('✕');
    close.addEventListener('click', () => this.close());

    // Slider, number and step name.
    const valueRow = el.createDiv({ cls: 'dnd5e-popover-value dnd5e-card-row' });
    const slider = valueRow.createEl('input', {
      cls: 'slider dnd5e-card-slider',
      attr: { type: 'range', min: '-5', max: '5', step: '1' },
    });
    const chip = valueRow.createSpan({ cls: 'dnd5e-card-chip' });
    const step = valueRow.createSpan({ cls: 'dnd5e-card-step' });
    const show = (v: number | null) => {
      valueRow.toggleClass('is-unset', v === null);
      valueRow.setCssProps({ '--dnd5e-value-colour': stepColour(v ?? 0) });
      chip.setText(v === null ? '—' : signed(v));
      step.setText(v === null ? t('card.noValue') : stepName(v, t, this.deps.stepNames()));
    };
    slider.value = String(current?.value ?? 0);
    show(current?.value ?? null);
    let expect = row?.expect;
    let own = row !== undefined;
    let before = current?.value ?? null;
    const commit = debounce(
      () => {
        const value = Number(slider.value);
        const op: EditOp = own
          ? { op: 'set-value', field, key: row?.rawKey ?? targetName, expect, value }
          : { op: 'add-entry', field, key: targetName, value };
        void writeOp(this.deps.app, file, op, t).then((ok) => {
          if (!ok) return;
          this.deps.offerLog({
            from: subjectName,
            to: targetName,
            before,
            after: value,
            secret: mode === 'true',
          });
          expect = value;
          own = true;
          before = value;
        });
      },
      SLIDER_DELAY,
      true,
    );
    slider.addEventListener('input', () => show(Number(slider.value)));
    slider.addEventListener('change', () => commit());

    // The reason of an own entry.
    if (row !== undefined) {
      const why = el.createEl('input', {
        cls: 'dnd5e-card-input dnd5e-popover-why',
        attr: { type: 'text', placeholder: t('card.whyPlaceholder') },
      });
      why.value = row.why ?? '';
      const write = () => {
        const text = why.value.trim();
        if (text === (row.why ?? '')) return;
        void writeOp(
          this.deps.app,
          file,
          {
            op: 'set-why',
            field,
            key: row.rawKey,
            expect: row.whyExpect,
            why: text === '' ? null : text,
          },
          t,
        );
      };
      why.addEventListener('keydown', (e) => e.key === 'Enter' && !e.isComposing && write());
      why.addEventListener('blur', write);
    }

    // With an own value: what Reset would bring back. Without: where the shown value comes from.
    const note =
      row !== undefined
        ? fallback === null
          ? t('popover.noFallback')
          : t('popover.fallback', {
              value: signed(fallback.value),
              name: nameOf(world, fallback.source),
            })
        : current?.inherited === true
          ? t('world.inheritedFrom', { name: nameOf(world, current.source) })
          : null;
    if (note !== null) el.createDiv({ cls: 'dnd5e-popover-fallback', text: note });

    const buttons = el.createDiv({ cls: 'dnd5e-popover-buttons' });
    if (row !== undefined) {
      const reset = buttons.createEl('button', { text: t('popover.reset') });
      reset.addEventListener('click', () => {
        void undoableWrite(this.deps.app, file, t, targetName, {
          op: 'remove-entry',
          field,
          key: row.rawKey,
          expect: row.expect,
        }).then((ok) => {
          if (ok) {
            this.deps.offerLog({
              from: subjectName,
              to: targetName,
              before,
              after: null,
              secret: mode === 'true',
            });
          }
        });
      });
    }
    buttons.createDiv({ cls: 'dnd5e-world-spacer' });
    const openCard = buttons.createEl('button', { text: t('popover.openCard') });
    openCard.addEventListener('click', () => {
      this.close();
      this.deps.openCard({ path: file.path, field, target: target.target });
    });
  }
}
