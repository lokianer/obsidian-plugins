// The parts of a rendered stat block in style C: the head, the tiles (AC, HP, speed), the ability
// column with the property lines under it, and the sections of entries, each entry with a row of
// its attack, damage and DC above its text. `renderStatblock` composes them. Editing (values on a
// click, entries with edit and remove) and rolling (modifiers, saves, skills, attacks, damage)
// work as before the restyle.

import { setIcon } from 'obsidian';

import { actionRow, type Ability } from '../dice/action-row';
import { abilityCheckName, checks } from '../dice/checks';
import { d20 } from '../dice/statblock';
import type { StringKey, T } from '../i18n/strings';
import type { EntryKey } from '../npc/block-edit';
import type { Lang } from '../npc/races';
import type { Bonus, Entry, Statblock } from '../npc/statblock';
import { experience, formatBonus, modifier, proficiencyBonus } from '../npc/statblock';
import { listsSpells } from '../spells/links';
import { checkButton, linkEntryDice, partCheck, type RollCheck } from './statblock-dice';
import { sectionHead, tile, tiles } from './ui/blocks';

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

/** The name (editable) and the size, type and alignment under it. */
export function renderHead(el: HTMLElement, block: Statblock, ctx: StatblockContext): void {
  const { t, edit } = ctx;
  const head = el.createDiv({ cls: 'dnd5e-sb-head' });
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
}

/** A speed's first part (`40 ft.`) and the rest (`climb 40 ft., fly 80 ft.`). */
function speedParts(speed: string | null): [string | null, string | null] {
  if (speed === null) return [null, null];
  const at = speed.indexOf(',');
  return at < 0 ? [speed, null] : [speed.slice(0, at), speed.slice(at + 1).trim()];
}

/**
 * AC, HP and speed as tiles, each value large with its note under it (armour, hit dice, other
 * speeds): those with a value, or all three while editing.
 */
export function renderTiles(el: HTMLElement, block: Statblock, ctx: StatblockContext): void {
  const { t, edit } = ctx;
  const [ac, hp, , speed] = t('statblock.short').split(',');
  const [walk, otherSpeeds] = speedParts(block.speed);
  const number = (n: number | null) => (n === null ? null : String(n));
  const all: [string | undefined, string | null, string | null, string, string | number | null][] =
    [
      [ac, number(block.ac), block.acClass, 'ac', block.ac],
      [hp, number(block.hp), block.hitDice, 'hp', block.hp],
      [speed, walk, otherSpeeds, 'speed', block.speed],
    ];
  const shown = all.filter(([, value]) => edit !== undefined || (value !== null && value !== ''));
  if (shown.length === 0) return;
  const grid = tiles(el);
  grid.addClass('dnd5e-sb-tiles');
  for (const [label, value, note, key, raw] of shown) {
    const { value: span } = tile(grid, value ?? '—', label ?? '', note);
    if (edit !== undefined) {
      editable(span, raw === null ? '' : String(raw), (v) => void edit.scalar(key, raw, typed(v)));
    }
  }
}

/** The six abilities, a row each: label and score (editable) left, the modifier (a roll) right. */
export function renderAbilities(side: HTMLElement, block: Statblock, ctx: StatblockContext): void {
  const { stats } = block;
  if (stats === null) return;
  const { t, edit, roll } = ctx;
  const labels = t('statblock.abilities').split(',');
  const column = side.createDiv({ cls: 'dnd5e-sb-abilities' });
  stats.forEach((score, i) => {
    const cell = column.createDiv({ cls: 'dnd5e-sb-ability' });
    const left = cell.createDiv({ cls: 'dnd5e-sb-ability-name' });
    left.createSpan({ cls: 'dnd5e-sb-ability-label', text: labels[i] ?? '' });
    const value = left.createSpan({ cls: 'dnd5e-sb-ability-score', text: String(score) });
    const mod = formatBonus(modifier(score));
    const right = cell.createDiv({ cls: 'dnd5e-sb-ability-mod' });
    if (roll === undefined) right.setText(mod);
    else {
      const name = abilityCheckName(i, ctx.lang ?? 'en');
      checkButton(
        right,
        mod,
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

/**
 * A line: label, shown text, and the key and raw value an edit writes (none: read-only), or what
 * fills the value instead of the text.
 */
type Line = [
  StringKey,
  string | null,
  ([string, string | number | null] | ((span: HTMLElement) => void))?,
];

function lines(parent: HTMLElement, rows: readonly Line[], ctx: StatblockContext): void {
  const { t, edit } = ctx;
  const shown = rows.filter((row) => row[1] !== null && row[1] !== '');
  if (shown.length === 0) return;
  const box = parent.createDiv({ cls: 'dnd5e-sb-lines' });
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
      editable(span, raw === null ? '' : String(raw), (v) => void edit.scalar(key, raw, typed(v)));
    }
  }
}

/** Saves, skills, damage and condition lines, senses, languages, challenge, proficiency bonus. */
export function renderLines(side: HTMLElement, block: Statblock, ctx: StatblockContext): void {
  const { t, roll } = ctx;
  const xp = block.cr === null ? null : experience(block.cr);
  const pb = block.cr === null ? null : proficiencyBonus(block.cr);
  const who = block.name ?? '';
  /** Saves or skills as buttons (`Dex +7`), each rolling its check. */
  const rolling = (list: readonly Bonus[], kind: 'saves' | 'skills') =>
    roll === undefined
      ? undefined
      : (span: HTMLElement) => {
          const all = checks(
            who,
            kind === 'saves' ? { saves: list, skills: [] } : { saves: [], skills: list },
            ctx.lang ?? 'en',
          );
          list.forEach((b, i) => {
            if (i > 0) span.appendText(', ');
            const check = all[i];
            if (check !== undefined) {
              checkButton(span, `${capitalise(b.key)} ${formatBonus(b.bonus)}`, check, roll, t);
            }
          });
        };
  const challenge =
    block.cr === null
      ? null
      : xp === null
        ? block.cr
        : `${block.cr} (${t('statblock.xp', { xp: xp.toLocaleString('en') })})`;
  lines(
    side,
    [
      ['statblock.saves', bonuses(block.saves), rolling(block.saves, 'saves')],
      ['statblock.skills', bonuses(block.skills), rolling(block.skills, 'skills')],
      ['statblock.vulnerabilities', block.damageVulnerabilities],
      ['statblock.resistances', block.damageResistances],
      ['statblock.immunities', block.damageImmunities],
      ['statblock.conditions', block.conditionImmunities],
      ['statblock.senses', block.senses, ['senses', block.senses]],
      ['statblock.languages', block.languages, ['languages', block.languages]],
      ['statblock.challenge', challenge, ['cr', block.cr]],
      ['statblock.pb', pb === null ? null : formatBonus(pb)],
    ],
    ctx,
  );
}

const ABILITY_ORDER: readonly Ability[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

/**
 * An entry's row: its name, then its attack and damage as buttons and its saving throw DC as a
 * pill. Returns false when the text has nothing to show, and builds nothing then.
 */
function renderActionRow(
  parent: HTMLElement,
  name: string,
  desc: string,
  who: string,
  ctx: StatblockContext,
): boolean {
  const row = actionRow(desc);
  if (row === null) return false;
  const { t, roll } = ctx;
  const el = parent.createDiv({ cls: 'dnd5e-sb-action-row' });
  el.createSpan({ cls: 'dnd5e-sb-action-name', text: name });
  const parts = [...(row.attack === null ? [] : [row.attack]), ...row.damage];
  for (const part of parts) {
    const text = part.kind === 'attack' ? desc.slice(part.start, part.end) : part.formula;
    if (roll === undefined) el.createSpan({ cls: 'dnd5e-sb-action-value', text });
    else {
      checkButton(el, text, partCheck(part, who, name, t), roll, t).addClass('dnd5e-sb-row-roll');
    }
  }
  if (row.dc !== null) {
    const labels = t('statblock.abilities').split(',');
    const ability = labels[ABILITY_ORDER.indexOf(row.dc.ability)] ?? '';
    el.createSpan({
      cls: ['dnd5e-pill', 'dnd5e-sb-dc'],
      text: t('statblock.dc', { dc: row.dc.dc, ability }),
    });
  }
  return true;
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

/** One entry: the row (when its text has attack, damage or a DC), then its text. */
function renderEntry(
  section: HTMLElement,
  key: EntryKey,
  index: number,
  entry: Entry,
  who: string,
  ctx: StatblockContext,
): void {
  const { t, edit, roll, spells } = ctx;
  const el = section.createDiv({ cls: 'dnd5e-sb-entry' });
  const name = entry.name.trim().replace(/\.$/, '');
  const draw = () => {
    el.empty();
    // With a row the name stands in it; the text then starts with the description.
    const inRow = name !== '' && renderActionRow(el, name, entry.desc, who, ctx);
    const text = el.createDiv({ cls: 'dnd5e-sb-entry-text' });
    const rendered = ctx.markdown(
      name === '' || inRow ? entry.desc : `***${name}.*** ${entry.desc}`,
      text,
    );
    if (spells !== undefined && listsSpells(name)) {
      void Promise.resolve(rendered).then(() => spells(text));
    }
    if (roll !== undefined) {
      void Promise.resolve(rendered).then(() => linkEntryDice(text, who, name, roll, t));
    }
    if (edit !== undefined) entryTools(el, key, index, entry, edit, t, draw);
  };
  draw();
}

/** A section of entries under its head; while editing, with an Add button. */
export function renderSection(
  parent: HTMLElement,
  block: Statblock,
  ctx: StatblockContext,
  section: [EntryKey, StringKey, readonly Entry[], string | null],
): void {
  const [key, title, list, intro] = section;
  const { t, edit } = ctx;
  // Editing shows the sections a GM usually fills even while empty, to add the first entry.
  const offered = edit !== undefined && key !== 'legendary_actions';
  if (list.length === 0 && intro === null && !offered) return;
  const el = parent.createDiv({ cls: 'dnd5e-sb-section' });
  // Traits have no heading in a printed stat block; while editing they need one to add to.
  if (key !== 'traits' || edit !== undefined) {
    sectionHead(el, t(title)).addClass('dnd5e-sb-section-title');
  }
  if (intro !== null) void ctx.markdown(intro, el.createDiv({ cls: 'dnd5e-sb-entry' }));
  const who = block.name ?? '';
  list.forEach((entry, index) => renderEntry(el, key, index, entry, who, ctx));
  if (edit !== undefined) {
    const add = el.createEl('button', { cls: 'dnd5e-sb-add', text: `+ ${t('statblock.add')}` });
    add.addEventListener('click', () => void edit.add(key));
  }
}
