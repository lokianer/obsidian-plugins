// A drawing from the Deck of Many Things by the SRD's rules, as pure state: the drawer declares a
// number of cards and draws them one by one. The Fool and the Jester leave the deck, every other
// card returns; the Fool's redraw counts as the same declared draw; the Jester offers 10,000 XP or
// two more draws, the Idiot one more; The Void and Donjon end the drawing.

import type { DeckCard } from './cards';

export type Choice = 'jester' | 'idiot';

export interface Drawing {
  declared: number;
  /** Declared (and extra) draws used so far. */
  used: number;
  /** Draws granted beyond the declared ones by the Jester or the Idiot. */
  extra: number;
  /** The cards drawn, by index, in order. */
  drawn: string[];
  /** Cards out of the deck, by index: those out before the drawing and those that left in it. */
  out: string[];
  /** A choice the drawer has to make before the next draw. */
  pending: Choice | null;
  /** The Fool was drawn: the next draw is free. */
  redraw: boolean;
  /** The Void or Donjon was drawn. */
  ended: boolean;
}

export function startDrawing(declared: number, out: readonly string[]): Drawing {
  return {
    declared,
    used: 0,
    extra: 0,
    drawn: [],
    out: [...out],
    pending: null,
    redraw: false,
    ended: false,
  };
}

/** Draws left: the declared and extra ones not used yet, not counting a Fool's redraw. */
export const left = (d: Drawing): number => d.declared + d.extra - d.used;

export const canDraw = (d: Drawing): boolean =>
  !d.ended && d.pending === null && (d.redraw || left(d) > 0);

/** The cards that can come up next. */
export const pool = (d: Drawing, deck: readonly DeckCard[]): DeckCard[] =>
  deck.filter((c) => !d.out.includes(c.index));

/** One card from the pool, picked by a random number in [0, 1). */
export function pickCard(cards: readonly DeckCard[], random: () => number): DeckCard | undefined {
  return cards[Math.min(cards.length - 1, Math.floor(random() * cards.length))];
}

export function draw(d: Drawing, card: DeckCard): Drawing {
  const fool = card.index === 'fool';
  return {
    ...d,
    used: d.redraw ? d.used : d.used + 1,
    drawn: [...d.drawn, card.index],
    out: card.leaves ? [...d.out, card.index] : d.out,
    pending: card.index === 'jester' ? 'jester' : card.index === 'idiot' ? 'idiot' : null,
    redraw: fool,
    ended: card.ends,
  };
}

/** The drawer's answer: the Jester's two draws or XP, the Idiot's one draw or none. */
export function choose(d: Drawing, more: boolean): Drawing {
  if (d.pending === null) return d;
  const extra = more ? (d.pending === 'jester' ? 2 : 1) : 0;
  return { ...d, pending: null, extra: d.extra + extra };
}

export const isDone = (d: Drawing): boolean => d.pending === null && !canDraw(d);
