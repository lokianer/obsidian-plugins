// Rendering a `dnd5e-statblock` block as a 5e stat block in Obsidian's own look: name and type,
// AC / HP / speed, the six abilities with modifiers, the property lines, then traits, actions,
// bonus actions, reactions and legendary actions. Descriptions go through Obsidian's Markdown
// renderer, so italics and spell lists show as in the note. In the note the block is folded behind
// one line; the short stats (AC, HP, CR, speed, modifiers) sit on the faction card under the title.
// Read-only in this phase.

import { setIcon } from 'obsidian';

import type { Bonus, Entry, Statblock } from '../npc/statblock';
import { experience, formatBonus, modifier, proficiencyBonus, summary } from '../npc/statblock';
import type { StringKey, T } from '../i18n/strings';

export interface StatblockContext {
  t: T;
  /** Renders Markdown into an element (Obsidian's MarkdownRenderer, bound to the note). */
  markdown: (markdown: string, el: HTMLElement) => void;
}

const capitalise = (text: string) => text.replace(/\b\w/g, (c) => c.toUpperCase());

function bonuses(list: readonly Bonus[]): string {
  return list.map((b) => `${capitalise(b.key)} ${formatBonus(b.bonus)}`).join(', ');
}

export function renderStatblock(
  parent: HTMLElement,
  block: Statblock,
  ctx: StatblockContext,
): HTMLElement {
  const { t } = ctx;
  const el = parent.createDiv({ cls: 'dnd5e-statblock' });

  const head = el.createDiv({ cls: 'dnd5e-sb-head' });
  if (block.name !== null) head.createDiv({ cls: 'dnd5e-sb-name', text: block.name });
  const kind = [block.size, block.type].filter((p) => p !== null).join(' ');
  const meta = [
    block.subtype === null ? kind : `${kind} (${block.subtype})`,
    block.alignment,
  ].filter((p) => p !== null && p !== '');
  if (meta.length > 0) head.createDiv({ cls: 'dnd5e-sb-meta', text: meta.join(', ') });

  const lines = (rows: readonly [StringKey, string | null][]) => {
    const shown = rows.filter(
      (row): row is [StringKey, string] => row[1] !== null && row[1] !== '',
    );
    if (shown.length === 0) return;
    const box = el.createDiv({ cls: 'dnd5e-sb-lines' });
    for (const [key, value] of shown) {
      const line = box.createDiv({ cls: 'dnd5e-sb-line' });
      line.createSpan({ cls: 'dnd5e-sb-label', text: t(key) });
      line.createSpan({ text: value });
    }
  };

  lines([
    ['statblock.ac', withNote(block.ac, block.acClass)],
    ['statblock.hp', withNote(block.hp, block.hitDice)],
    ['statblock.speed', block.speed],
  ]);

  if (block.stats !== null) {
    const labels = t('statblock.abilities').split(',');
    const grid = el.createDiv({ cls: 'dnd5e-sb-abilities' });
    block.stats.forEach((score, i) => {
      const cell = grid.createDiv({ cls: 'dnd5e-sb-ability' });
      cell.createDiv({ cls: 'dnd5e-sb-ability-label', text: labels[i] ?? '' });
      cell.createDiv({ text: `${score} (${formatBonus(modifier(score))})` });
    });
  }

  const xp = block.cr === null ? null : experience(block.cr);
  const pb = block.cr === null ? null : proficiencyBonus(block.cr);
  lines([
    ['statblock.saves', bonuses(block.saves)],
    ['statblock.skills', bonuses(block.skills)],
    ['statblock.vulnerabilities', block.damageVulnerabilities],
    ['statblock.resistances', block.damageResistances],
    ['statblock.immunities', block.damageImmunities],
    ['statblock.conditions', block.conditionImmunities],
    ['statblock.senses', block.senses],
    ['statblock.languages', block.languages],
    [
      'statblock.challenge',
      block.cr === null
        ? null
        : xp === null
          ? block.cr
          : `${block.cr} (${t('statblock.xp', { xp: xp.toLocaleString('en') })})`,
    ],
    ['statblock.pb', pb === null ? null : formatBonus(pb)],
  ]);

  const entries = (
    title: StringKey | null,
    list: readonly Entry[],
    intro: string | null = null,
  ) => {
    if (list.length === 0 && intro === null) return;
    const section = el.createDiv({ cls: 'dnd5e-sb-section' });
    if (title !== null) section.createDiv({ cls: 'dnd5e-sb-section-title', text: t(title) });
    if (intro !== null) ctx.markdown(intro, section.createDiv({ cls: 'dnd5e-sb-entry' }));
    for (const entry of list) {
      const name = entry.name.trim().replace(/\.$/, '');
      ctx.markdown(
        name === '' ? entry.desc : `***${name}.*** ${entry.desc}`,
        section.createDiv({ cls: 'dnd5e-sb-entry' }),
      );
    }
  };

  entries(null, block.traits, block.spells.length > 0 ? block.spells.join('\n\n') : null);
  entries('statblock.actions', block.actions);
  entries('statblock.bonusActions', block.bonusActions);
  entries('statblock.reactions', block.reactions);
  entries('statblock.legendary', block.legendaryActions, block.legendaryDescription);

  if (block.unreadable.length > 0) {
    el.createDiv({
      cls: 'dnd5e-sb-warning',
      text: t('statblock.unreadable', { keys: block.unreadable.join(', ') }),
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
  head.addEventListener('mousedown', (event) => event.stopPropagation());
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

/** `18 (plate armor)`, or the value alone. */
function withNote(value: number | null, note: string | null): string | null {
  if (value === null) return null;
  return note === null ? String(value) : `${value} (${note})`;
}

/** A block whose YAML does not parse: say so and show the text as it is. */
export function renderInvalid(parent: HTMLElement, source: string, t: T): void {
  const el = parent.createDiv({ cls: 'dnd5e-statblock' });
  el.createDiv({ cls: 'dnd5e-sb-warning', text: t('statblock.invalid') });
  el.createEl('pre', { text: source });
}
