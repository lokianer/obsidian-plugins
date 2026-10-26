// Rendering a `dnd5e-statblock` block as a 5e stat block in Obsidian's own look: name and type,
// AC / HP / speed, the six abilities with modifiers, the property lines, then traits, actions,
// bonus actions, reactions and legendary actions. Descriptions go through Obsidian's Markdown
// renderer, so italics and spell lists show as in the note. In the note the block is folded behind
// one line; the short stats (AC, HP, CR, speed, modifiers) sit on the faction card under the title.
// Opened, the block is editable in place: values on click, entries with edit, add and remove.

import { setIcon } from 'obsidian';

import { abilityCheckName, checks } from '../dice/checks';
import { d20 } from '../dice/statblock';

import { listsSpells } from '../spells/links';
import type { EntryKey } from '../npc/block-edit';
import type { Lang } from '../npc/races';
import type { Bonus, Entry, Statblock } from '../npc/statblock';
import { experience, formatBonus, modifier, proficiencyBonus, summary } from '../npc/statblock';
import type { StringKey, T } from '../i18n/strings';
import { checkButton, linkEntryDice, type RollCheck } from './statblock-dice';

/** Writes from the rendered block into the note; each resolves when the write is done or refused. */
export interface StatblockEdits {
  scalar: (key: string, expect: string | number | null, value: string | number) => Promise<unknown>;
  ability: (index: number, expect: number, value: number) => Promise<unknown>;
  entry: (
    key: EntryKey,
    index: number,
    field: 'name' | 'desc',
    expect: string,
    value: string,
  ) => Promise<unknown>;
  add: (key: EntryKey) => Promise<unknown>;
  remove: (key: EntryKey, index: number, name: string) => Promise<unknown>;
}

export interface StatblockContext {
  t: T;
  /** Renders Markdown into an element (Obsidian's MarkdownRenderer, bound to the note). */
  markdown: (markdown: string, el: HTMLElement) => void | Promise<unknown>;
  /** Links the spell names in a rendered Spellcasting entry to the spellbook. */
  spells?: (el: HTMLElement) => void;
  /** Present when the block can be edited in place. */
  edit?: StatblockEdits;
  /** Present when attacks, damage, saves and skills roll on a click. */
  roll?: RollCheck;
  /** The language of the rolls' names on the stage (default English). */
  lang?: Lang;
}

/** A value written as a number when it is one (AC, HP, a whole CR), else as text. */
function typed(value: string): string | number {
  return /^-?\d+$/.test(value) ? Number(value) : value;
}

/**
 * Makes `span` editable: a click (or Enter) puts an input in its place; Enter or leaving it
 * commits a changed value, Esc cancels.
 */
function editable(span: HTMLElement, current: string, commit: (value: string) => void): void {
  span.addClass('is-editable');
  span.setAttr('tabindex', '0');
  const start = () => {
    const input = span.parentElement?.createEl('input', {
      cls: 'dnd5e-sb-input',
      attr: { type: 'text' },
    });
    if (input === undefined) return;
    input.value = current;
    span.insertAdjacentElement('afterend', input);
    span.addClass('dnd5e-hidden');
    input.focus();
    input.select();
    let done = false;
    const finish = (save: boolean) => {
      if (done) return;
      done = true;
      const value = input.value.trim();
      input.remove();
      span.removeClass('dnd5e-hidden');
      if (save && value !== current) commit(value);
    };
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        finish(true);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        finish(false);
      }
    });
    input.addEventListener('blur', () => finish(true));
  };
  span.addEventListener('click', start);
  span.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') start();
  });
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
  const edit = ctx.edit;
  if (block.name !== null || edit !== undefined) {
    const name = head.createDiv({
      cls: 'dnd5e-sb-name',
      text: block.name ?? t('statblock.newEntry'),
    });
    if (edit !== undefined) {
      editable(name, block.name ?? '', (v) => void edit.scalar('name', block.name, v));
    }
  }
  const kind = [block.size, block.type].filter((p) => p !== null).join(' ');
  const meta = [
    block.subtype === null ? kind : `${kind} (${block.subtype})`,
    block.alignment,
  ].filter((p) => p !== null && p !== '');
  if (meta.length > 0) head.createDiv({ cls: 'dnd5e-sb-meta', text: meta.join(', ') });

  /**
   * A row: label, shown text, and the key and raw value an edit writes (none: read-only), or what
   * fills the value instead of the text.
   */
  type Row = [
    StringKey,
    string | null,
    ([string, string | number | null] | ((span: HTMLElement) => void))?,
  ];
  const lines = (rows: readonly Row[]) => {
    const shown = rows.filter((row) => row[1] !== null && row[1] !== '');
    if (shown.length === 0) return;
    const box = el.createDiv({ cls: 'dnd5e-sb-lines' });
    for (const [label, value, target] of shown) {
      const line = box.createDiv({ cls: 'dnd5e-sb-line' });
      line.createSpan({ cls: 'dnd5e-sb-label', text: t(label) });
      if (typeof target === 'function') {
        target(line.createSpan());
        continue;
      }
      const span = line.createSpan({ text: value ?? '' });
      if (edit !== undefined && target !== undefined) {
        const [key, raw] = target;
        editable(
          span,
          raw === null ? '' : String(raw),
          (v) => void edit.scalar(key, raw, typed(v)),
        );
      }
    }
  };

  lines([
    ['statblock.ac', withNote(block.ac, block.acClass), ['ac', block.ac]],
    ['statblock.hp', withNote(block.hp, block.hitDice), ['hp', block.hp]],
    ['statblock.speed', block.speed, ['speed', block.speed]],
  ]);

  if (block.stats !== null) {
    const labels = t('statblock.abilities').split(',');
    const grid = el.createDiv({ cls: 'dnd5e-sb-abilities' });
    block.stats.forEach((score, i) => {
      const cell = grid.createDiv({ cls: 'dnd5e-sb-ability' });
      cell.createDiv({ cls: 'dnd5e-sb-ability-label', text: labels[i] ?? '' });
      const mod = formatBonus(modifier(score));
      const line = cell.createDiv();
      // With rolls the score and its modifier part: the score stays editable, the modifier rolls.
      const value = line.createSpan({
        text: ctx.roll === undefined ? `${score} (${mod})` : String(score),
      });
      const { roll } = ctx;
      if (roll !== undefined) {
        const name = abilityCheckName(i, ctx.lang ?? 'en');
        line.appendText(' ');
        checkButton(
          line,
          `(${mod})`,
          {
            name,
            label: [block.name, name].filter((p) => p !== null && p !== '').join(': '),
            subject: `${block.name ?? ''} rolls ${abilityCheckName(i, 'en')}`.trim(),
            formula: d20(modifier(score)),
            d20: true,
          },
          roll,
          t,
        );
      }
      if (edit !== undefined) {
        editable(value, String(score), (v) => {
          const n = Number(v);
          if (Number.isInteger(n) && n >= 1 && n <= 30) void edit.ability(i, score, n);
        });
      }
    });
  }

  const xp = block.cr === null ? null : experience(block.cr);
  const pb = block.cr === null ? null : proficiencyBonus(block.cr);
  const who = block.name ?? '';
  const { roll } = ctx;
  /** Saves or skills as buttons (`Dex +7`), each rolling its check. */
  const rolling = (list: readonly Bonus[], kind: 'saves' | 'skills') =>
    roll === undefined
      ? undefined
      : (span: HTMLElement) => {
          const lang = ctx.lang ?? 'en';
          const all = checks(
            who,
            kind === 'saves' ? { saves: list, skills: [] } : { saves: [], skills: list },
            lang,
          );
          list.forEach((b, i) => {
            if (i > 0) span.appendText(', ');
            const check = all[i];
            if (check !== undefined) {
              checkButton(span, `${capitalise(b.key)} ${formatBonus(b.bonus)}`, check, roll, t);
            }
          });
        };
  lines([
    ['statblock.saves', bonuses(block.saves), rolling(block.saves, 'saves')],
    ['statblock.skills', bonuses(block.skills), rolling(block.skills, 'skills')],
    ['statblock.vulnerabilities', block.damageVulnerabilities],
    ['statblock.resistances', block.damageResistances],
    ['statblock.immunities', block.damageImmunities],
    ['statblock.conditions', block.conditionImmunities],
    ['statblock.senses', block.senses, ['senses', block.senses]],
    ['statblock.languages', block.languages, ['languages', block.languages]],
    [
      'statblock.challenge',
      block.cr === null
        ? null
        : xp === null
          ? block.cr
          : `${block.cr} (${t('statblock.xp', { xp: xp.toLocaleString('en') })})`,
      ['cr', block.cr],
    ],
    ['statblock.pb', pb === null ? null : formatBonus(pb)],
  ]);

  const entries = (
    key: EntryKey,
    title: StringKey,
    list: readonly Entry[],
    intro: string | null = null,
  ) => {
    // Editing shows the sections a GM usually fills even while empty, to add the first entry.
    const offered = edit !== undefined && key !== 'legendary_actions';
    if (list.length === 0 && intro === null && !offered) return;
    const section = el.createDiv({ cls: 'dnd5e-sb-section' });
    // Traits have no heading in a printed stat block; while editing they need one to add to.
    if (key !== 'traits' || edit !== undefined) {
      section.createDiv({ cls: 'dnd5e-sb-section-title', text: t(title) });
    }
    if (intro !== null) void ctx.markdown(intro, section.createDiv({ cls: 'dnd5e-sb-entry' }));
    list.forEach((entry, index) => {
      const row = section.createDiv({ cls: 'dnd5e-sb-entry' });
      const name = entry.name.trim().replace(/\.$/, '');
      const draw = () => {
        row.empty();
        const rendered = ctx.markdown(
          name === '' ? entry.desc : `***${name}.*** ${entry.desc}`,
          row,
        );
        const { spells } = ctx;
        if (spells !== undefined && listsSpells(name)) {
          void Promise.resolve(rendered).then(() => spells(row));
        }
        if (roll !== undefined) {
          void Promise.resolve(rendered).then(() => linkEntryDice(row, who, name, roll, t));
        }
        if (edit !== undefined) entryTools(row, key, index, entry, edit, t, draw);
      };
      draw();
    });
    if (edit !== undefined) {
      const add = section.createEl('button', {
        cls: 'dnd5e-sb-add',
        text: `+ ${t('statblock.add')}`,
      });
      add.addEventListener('click', () => void edit.add(key));
    }
  };

  entries(
    'traits',
    'statblock.traits',
    block.traits,
    block.spells.length > 0 ? block.spells.join('\n\n') : null,
  );
  entries('actions', 'statblock.actions', block.actions);
  entries('bonus_actions', 'statblock.bonusActions', block.bonusActions);
  entries('reactions', 'statblock.reactions', block.reactions);
  entries(
    'legendary_actions',
    'statblock.legendary',
    block.legendaryActions,
    block.legendaryDescription,
  );

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

/**
 * An entry's pencil and ×: the pencil turns it into a name field and a text area. After a write
 * the block is rebuilt from the note; `draw` shows the entry again when nothing was written.
 */
function entryTools(
  row: HTMLElement,
  key: EntryKey,
  index: number,
  entry: Entry,
  edit: StatblockEdits,
  t: T,
  draw: () => void,
): void {
  const tools = row.createDiv({ cls: 'dnd5e-sb-tools' });
  const pencil = tools.createEl('button', {
    cls: 'clickable-icon',
    attr: { 'aria-label': t('statblock.edit') },
  });
  setIcon(pencil, 'pencil');
  const remove = tools.createEl('button', {
    cls: 'clickable-icon',
    attr: { 'aria-label': t('statblock.remove') },
  });
  setIcon(remove, 'x');
  remove.addEventListener('click', () => void edit.remove(key, index, entry.name));
  pencil.addEventListener('click', () => {
    row.empty();
    const name = row.createEl('input', { cls: 'dnd5e-sb-input', attr: { type: 'text' } });
    name.value = entry.name;
    const desc = row.createEl('textarea', { cls: 'dnd5e-sb-textarea' });
    desc.value = entry.desc;
    const buttons = row.createDiv({ cls: 'dnd5e-sb-buttons' });
    const save = buttons.createEl('button', { cls: 'mod-cta', text: t('statblock.save') });
    const cancel = buttons.createEl('button', { text: t('statblock.cancel') });
    name.focus();
    save.addEventListener('click', () => {
      void (async () => {
        const [newName, newDesc] = [name.value.trim(), desc.value.trim()];
        if (newName === entry.name && newDesc === entry.desc) draw();
        if (newName !== entry.name) await edit.entry(key, index, 'name', entry.name, newName);
        if (newDesc !== entry.desc) await edit.entry(key, index, 'desc', entry.desc, newDesc);
      })();
    });
    cancel.addEventListener('click', draw);
  });
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
