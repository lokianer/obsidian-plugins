// Rendering a `dnd5e-statblock` block as a 5e stat block in Obsidian's own look: name and type,
// AC / HP / speed, the six abilities with modifiers, the property lines, then traits, actions,
// bonus actions, reactions and legendary actions. Descriptions go through Obsidian's Markdown
// renderer, so italics and spell lists show as in the note. In the note the block is folded behind
// one line; the short stats (AC, HP, CR, speed, modifiers) sit on the faction card under the title.
// Opened, the block is editable in place: values on click, entries with edit, add and remove. The
// parts are built in `statblock-parts.ts`.

import { setIcon } from 'obsidian';

import type { Statblock } from '../npc/statblock';
import { formatBonus, modifier, summary } from '../npc/statblock';
import type { T } from '../i18n/strings';
import {
  renderAbilities,
  renderHead,
  renderLines,
  renderSection,
  renderTiles,
  type StatblockContext,
} from './statblock-parts';

export type { StatblockContext, StatblockEdits } from './statblock-parts';

/**
 * The block in style C: head, tiles, then the ability column with the property lines beside the
 * sections of entries (one column in narrow places).
 */
export function renderStatblock(
  parent: HTMLElement,
  block: Statblock,
  ctx: StatblockContext,
): HTMLElement {
  const el = parent.createDiv({ cls: 'dnd5e-statblock' });
  renderHead(el, block, ctx);
  renderTiles(el, block, ctx);
  const body = el.createDiv({ cls: 'dnd5e-sb-body' });
  const side = body.createDiv({ cls: 'dnd5e-sb-side' });
  renderAbilities(side, block, ctx);
  renderLines(side, block, ctx);
  if (side.childElementCount === 0) side.remove();
  const main = body.createDiv({ cls: 'dnd5e-sb-main' });
  const spells = block.spells.length > 0 ? block.spells.join('\n\n') : null;
  renderSection(main, block, ctx, ['traits', 'statblock.traits', block.traits, spells]);
  renderSection(main, block, ctx, ['actions', 'statblock.actions', block.actions, null]);
  renderSection(main, block, ctx, [
    'bonus_actions',
    'statblock.bonusActions',
    block.bonusActions,
    null,
  ]);
  renderSection(main, block, ctx, ['reactions', 'statblock.reactions', block.reactions, null]);
  renderSection(main, block, ctx, [
    'legendary_actions',
    'statblock.legendary',
    block.legendaryActions,
    block.legendaryDescription,
  ]);
  if (main.childElementCount === 0) main.remove();
  if (body.childElementCount === 0) body.remove();

  if (block.unreadable.length > 0) {
    el.createDiv({
      cls: 'dnd5e-sb-warning',
      text: ctx.t('statblock.unreadable', { keys: block.unreadable.join(', ') }),
    });
  }
  return el;
}

/**
 * The block as it stands in the note: one line (`Stat block · name · AC 18 · HP 52 · CR 3`) that
 * opens the full block below it. `open` is how it starts; `toggle` hears every change.
 */
export function renderFolded(
  parent: HTMLElement,
  block: Statblock,
  ctx: StatblockContext & { open: boolean; toggle: (open: boolean) => void },
): void {
  const fold = parent.createDiv({ cls: 'dnd5e-sb-fold' });
  const head = fold.createEl('button', { cls: 'dnd5e-sb-fold-head' });
  const icon = head.createSpan({ cls: 'dnd5e-card-icon' });
  head.createSpan({ cls: 'dnd5e-sb-fold-title', text: ctx.t('statblock.fold') });
  const parts = [block.name, summary(block)].filter((p) => p !== null && p !== '');
  if (parts.length > 0) head.createSpan({ cls: 'dnd5e-sb-fold-detail', text: parts.join(' · ') });

  let body: HTMLElement | null = null;
  let open = ctx.open;
  const show = () => {
    head.setAttr('aria-expanded', String(open));
    setIcon(icon, open ? 'chevron-down' : 'chevron-right');
    if (open) body ??= renderStatblock(fold, block, ctx);
    body?.toggleClass('dnd5e-hidden', !open);
  };
  // Clicks must not move the editor's cursor into the block in Live Preview.
  fold.addEventListener('mousedown', (event) => event.stopPropagation());
  head.addEventListener('click', (event) => {
    event.preventDefault();
    open = !open;
    show();
    ctx.toggle(open);
  });
  show();
}

/**
 * The short stats for the faction card, under the title: AC, HP, CR and speed as small pills, then
 * the six ability modifiers.
 */
export function renderShortStats(parent: HTMLElement, block: Statblock, t: T): void {
  const el = parent.createDiv({ cls: 'dnd5e-sb-short' });
  const [ac, hp, cr, speed] = t('statblock.short').split(',');
  const pills = el.createDiv({ cls: 'dnd5e-sb-pills' });
  const values: [string | undefined, string | null][] = [
    [ac, block.ac === null ? null : String(block.ac)],
    [hp, block.hp === null ? null : String(block.hp)],
    [cr, block.cr],
    [speed, block.speed],
  ];
  for (const [label, value] of values) {
    if (value === null) continue;
    const pill = pills.createDiv({ cls: 'dnd5e-sb-pill' });
    pill.createSpan({ cls: 'dnd5e-sb-label', text: label ?? '' });
    pill.createSpan({ text: value });
  }
  if (block.stats !== null) {
    const labels = t('statblock.abilities').split(',');
    const grid = el.createDiv({ cls: 'dnd5e-sb-short-abilities' });
    block.stats.forEach((score, i) => {
      const cell = grid.createDiv({ attr: { 'aria-label': `${labels[i] ?? ''} ${score}` } });
      cell.createDiv({ cls: 'dnd5e-sb-ability-label', text: labels[i] ?? '' });
      cell.createDiv({ text: formatBonus(modifier(score)) });
    });
  }
}

/** A block whose YAML does not parse: say so and show the text as it is. */
export function renderInvalid(parent: HTMLElement, source: string, t: T): void {
  const el = parent.createDiv({ cls: 'dnd5e-statblock' });
  el.createDiv({ cls: 'dnd5e-sb-warning', text: t('statblock.invalid') });
  el.createEl('pre', { text: source });
}
