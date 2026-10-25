// The deck note: its first task list is the deck — an open item is in it, a ticked one has left —
// and the list under "## Draws" is its history, one line per card drawn. Edits change single lines.

import type { DeckCard } from './cards';

export interface NoteCard {
  name: string;
  /** Zero-based line of the item. */
  line: number;
  out: boolean;
}

export interface DeckNote {
  cards: NoteCard[];
  /** The Draws lines without their dash, oldest first. */
  draws: string[];
}

const ITEM = /^\s*[-*+] \[([ xX])\] (.+?)\s*$/;
const DRAWS = /^##\s+Draws\s*$/i;
const HEADING = /^#{1,6}\s/;
const BULLET = /^\s*[-*+] (.+?)\s*$/;

/** The body after the frontmatter starts at this line. */
function bodyStart(lines: readonly string[]): number {
  if (lines[0]?.trim() !== '---') return 0;
  const end = lines.findIndex((l, i) => i > 0 && l.trim() === '---');
  return end === -1 ? 0 : end + 1;
}

/** Where the Draws heading is, or -1. */
const drawsAt = (lines: readonly string[]): number => lines.findIndex((l) => DRAWS.test(l));

export function parseDeckNote(text: string): DeckNote {
  const lines = text.split(/\r?\n/);
  const cards: NoteCard[] = [];
  let i = bodyStart(lines);
  while (i < lines.length && !ITEM.test(lines[i] ?? '')) i++;
  for (; i < lines.length; i++) {
    const match = ITEM.exec(lines[i] ?? '');
    if (match === null) break;
    cards.push({ name: match[2] ?? '', line: i, out: match[1] !== ' ' });
  }
  const draws: string[] = [];
  const at = drawsAt(lines);
  if (at !== -1) {
    for (let j = at + 1; j < lines.length && !HEADING.test(lines[j] ?? ''); j++) {
      const match = BULLET.exec(lines[j] ?? '');
      if (match !== null) draws.push(match[1] ?? '');
    }
  }
  return { cards, draws };
}

/** A new standard deck note: every card of the deck open, an empty Draws list. */
export function standardDeckText(size: 13 | 22, cards: readonly DeckCard[]): string {
  return [
    '---',
    'type: deck',
    `deck: standard-${size}`,
    '---',
    '',
    '# Deck of Many Things',
    '',
    ...cards.map((c) => `- [ ] ${c.name.en}`),
    '',
    '## Draws',
    '',
    '',
  ].join('\n');
}

/** The note with the item on this line ticked. */
export function tickCard(text: string, line: number): string {
  const lines = text.split('\n');
  const item = lines[line];
  if (item === undefined || !ITEM.test(item)) return text;
  lines[line] = item.replace('[ ]', '[x]');
  return lines.join('\n');
}

/** The note with a draw line added at the end of the Draws list (made if missing). */
export function appendDraw(text: string, entry: string): string {
  const lines = text.split('\n');
  const at = drawsAt(lines);
  const line = `- ${entry}`;
  if (at === -1) {
    const trimmed = text.replace(/\s*$/, '');
    return `${trimmed}\n\n## Draws\n\n${line}\n`;
  }
  let end = at + 1;
  let last = -1;
  for (; end < lines.length && !HEADING.test(lines[end] ?? ''); end++) {
    if (BULLET.test(lines[end] ?? '')) last = end;
  }
  if (last !== -1) {
    lines.splice(last + 1, 0, line);
    return lines.join('\n');
  }
  // An empty list: one blank line below the heading, and one before whatever follows.
  if (lines[at + 1]?.trim() !== '') lines.splice(at + 1, 0, '');
  lines.splice(at + 2, 0, line);
  const next = lines[at + 3];
  if (next !== undefined && next.trim() !== '') lines.splice(at + 3, 0, '');
  return lines.join('\n');
}

/** "2026-10-25 · [[Mira]] · Throne", or without a drawer "2026-10-25 · Throne". */
export const drawEntry = (date: string, who: string, card: string): string =>
  [date, who, card].filter((part) => part !== '').join(' · ');

/** A Draws line split back into date, drawer and card; the drawer is empty when none is named. */
export function splitEntry(entry: string): { date: string; who: string; card: string } {
  const parts = entry.split(' · ');
  const date = parts[0] ?? '';
  const card = parts.length > 1 ? (parts[parts.length - 1] ?? '') : '';
  const who = parts.length > 2 ? parts.slice(1, -1).join(' · ') : '';
  return { date, who, card };
}
