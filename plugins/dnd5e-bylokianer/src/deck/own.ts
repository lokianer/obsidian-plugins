// Own decks: the cards the deck builder holds while the GM edits them, read from pasted text or a
// JSON file, and written out as a deck note — the first task list is the deck, `returns`,
// `leaves` and `ends` in the frontmatter.

import type { Lang } from '../npc/races';
import type { DeckCard } from './cards';
import type { NoteCard } from './note';

export interface DraftCard {
  name: string;
  effect: string;
  leaves: boolean;
  ends: boolean;
}

export interface DraftDeck {
  name: string;
  /** Drawn cards go back into the deck; otherwise each card drawn stays out. */
  returns: boolean;
  cards: DraftCard[];
}

/** A card of an own deck as the tab draws it. */
export interface OwnCard {
  index: string;
  name: string;
  effect: string;
  leaves: boolean;
  ends: boolean;
}

const draft = (name: string, effect = ''): DraftCard => ({
  name: name.trim(),
  effect: effect.trim(),
  leaves: false,
  ends: false,
});

/** The standard deck's cards in one language, to edit into an own deck. */
export function standardDrafts(cards: readonly DeckCard[], lang: Lang): DraftCard[] {
  return cards.map((c) => ({
    name: c.name[lang],
    effect: c.text[lang],
    leaves: c.leaves,
    ends: c.ends,
  }));
}

// ── pasted text ──────────────────────────────────────────────────────────────────────────────

const SEPARATORS = [' — ', ' – ', ' - ', ': '];

/** One line as a card: `Name — effect`, `**Name.** effect`, a list or task item; null if empty. */
function lineCard(raw: string): DraftCard | null {
  const line = raw
    .trim()
    .replace(/^(?:[-*+]|\d+[.)])\s+/, '')
    .replace(/^\[[ xX]\]\s+/, '')
    .trim();
  if (line === '') return null;
  // ***Name.*** effect, **Name.** effect, **Name**: effect
  const bold = /^(\*{1,3}|_{1,2})(.+?)\1[.:]?\s*(.*)$/.exec(line);
  if (bold !== null) return draft((bold[2] ?? '').replace(/[.:]$/, ''), bold[3]);
  for (const sep of SEPARATORS) {
    const at = line.indexOf(sep);
    if (at > 0) return draft(line.slice(0, at), line.slice(at + sep.length));
  }
  return draft(line);
}

/** A Markdown table row as a card: the first cell is the name, the others the effect. */
function rowCard(line: string): DraftCard | null {
  const cells = line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim());
  if (cells.every((c) => /^:?-{2,}:?$/.test(c) || c === '')) return null;
  const [name = '', ...rest] = cells;
  return name === '' ? null : draft(name, rest.filter((c) => c !== '').join(' — '));
}

/**
 * Cards from pasted text, one per line. A table's first row is taken as its header when a
 * separator row follows it, and skipped.
 */
export function parseCardText(text: string): DraftCard[] {
  const lines = text.split(/\r?\n/);
  const cards: DraftCard[] = [];
  lines.forEach((line, i) => {
    if (/^\s*\|/.test(line)) {
      const next = lines[i + 1] ?? '';
      if (/^\s*\|?\s*:?-{2,}/.test(next)) return;
      const card = rowCard(line);
      if (card !== null) cards.push(card);
      return;
    }
    const card = lineCard(line);
    if (card !== null) cards.push(card);
  });
  return cards;
}

// ── JSON ─────────────────────────────────────────────────────────────────────────────────────

export type JsonResult =
  | { ok: true; deck: Partial<DraftDeck> & { cards: DraftCard[] } }
  | { ok: false; reason: 'syntax' | 'shape' | 'empty' };

const str = (value: unknown): string => (typeof value === 'string' ? value : '');

function jsonCard(value: unknown): DraftCard | null {
  if (typeof value === 'string') return value.trim() === '' ? null : draft(value);
  if (typeof value !== 'object' || value === null) return null;
  const o = value as Record<string, unknown>;
  const name = str(o.name) || str(o.title);
  if (name.trim() === '') return null;
  const effect = str(o.effect) || str(o.text) || str(o.description) || str(o.desc);
  return { ...draft(name, effect), leaves: o.leaves === true, ends: o.ends === true };
}

/** A deck from a JSON file: `{ name, returns, cards }`, an array of cards, or of names. */
export function parseDeckJson(text: string): JsonResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'syntax' };
  }
  const object =
    typeof data === 'object' && data !== null && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : null;
  const list = Array.isArray(data) ? data : object?.cards;
  if (!Array.isArray(list)) return { ok: false, reason: 'shape' };
  const cards = list.map(jsonCard).filter((c) => c !== null);
  if (cards.length === 0) return { ok: false, reason: 'empty' };
  const deck: Partial<DraftDeck> & { cards: DraftCard[] } = { cards };
  if (object !== null && str(object.name).trim() !== '') deck.name = str(object.name).trim();
  if (object !== null && typeof object.returns === 'boolean') deck.returns = object.returns;
  return { ok: true, deck };
}

// ── the note ─────────────────────────────────────────────────────────────────────────────────

const yamlList = (key: string, names: string[]): string[] =>
  names.length === 0 ? [] : [`${key}:`, ...names.map((n) => `  - ${JSON.stringify(n)}`)];

/** The note a new own deck is written as. Effects keep their lines, indented under the item. */
export function ownDeckText(deck: DraftDeck): string {
  const cards = deck.cards.filter((c) => c.name.trim() !== '');
  const items = cards.map((c) => {
    const [first = '', ...more] = c.effect
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l !== '');
    const head = `- [ ] ${c.name.trim()}${first === '' ? '' : ` — ${first}`}`;
    return [head, ...more.map((l) => `  ${l}`)].join('\n');
  });
  return [
    '---',
    'type: deck',
    `returns: ${String(deck.returns)}`,
    ...(deck.returns
      ? yamlList(
          'leaves',
          cards.filter((c) => c.leaves).map((c) => c.name.trim()),
        )
      : []),
    ...yamlList(
      'ends',
      cards.filter((c) => c.ends).map((c) => c.name.trim()),
    ),
    '---',
    '',
    `# ${deck.name.trim()}`,
    '',
    ...items,
    '',
    '## Draws',
    '',
    '',
  ].join('\n');
}

const names = (value: unknown): string[] =>
  (Array.isArray(value) ? value : typeof value === 'string' ? [value] : [])
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.trim().toLowerCase());

/**
 * An own deck's cards from its note: in a returning deck the `leaves` cards leave, in any other
 * every card does; `ends` cards end the drawing. Indexes are the names, numbered when repeated.
 */
export function ownCards(
  cards: readonly NoteCard[],
  frontmatter: Record<string, unknown> | undefined,
): OwnCard[] {
  const returns = frontmatter?.returns === true;
  const leaves = names(frontmatter?.leaves);
  const ends = names(frontmatter?.ends);
  const seen = new Map<string, number>();
  return cards.map((c) => {
    const key = c.name.trim().toLowerCase();
    const n = (seen.get(key) ?? 0) + 1;
    seen.set(key, n);
    return {
      index: n === 1 ? key : `${key}#${n}`,
      name: c.name,
      effect: c.effect,
      leaves: !returns || leaves.includes(key),
      ends: ends.includes(key),
    };
  });
}
