import { describe, expect, it } from 'vitest';

import { cardByName, corner, DECK_CARDS, deckOf } from '../src/deck/cards';
import {
  appendDraw,
  drawEntry,
  parseDeckNote,
  splitEntry,
  standardDeckText,
  tickCard,
} from '../src/deck/note';
import {
  canDraw,
  choose,
  draw,
  isDone,
  left,
  pickCard,
  pool,
  startDrawing,
} from '../src/deck/rules';

const byIndex = (index: string) => {
  const c = DECK_CARDS.find((x) => x.index === index);
  if (c === undefined) throw new Error(index);
  return c;
};

describe('cards', () => {
  it('has the 22 cards of the SRD, 13 of them in the small deck', () => {
    expect(DECK_CARDS).toHaveLength(22);
    expect(new Set(DECK_CARDS.map((c) => c.index)).size).toBe(22);
    expect(
      deckOf(13)
        .map((c) => c.name.en)
        .sort(),
    ).toEqual(
      [
        'Sun',
        'Moon',
        'Star',
        'Throne',
        'Key',
        'Knight',
        'The Void',
        'Flames',
        'Skull',
        'Ruin',
        'Euryale',
        'Rogue',
        'Jester',
      ].sort(),
    );
  });

  it('marks the cards that leave the deck and those that end the drawing', () => {
    expect(DECK_CARDS.filter((c) => c.leaves).map((c) => c.index)).toEqual(['fool', 'jester']);
    expect(DECK_CARDS.filter((c) => c.ends).map((c) => c.index)).toEqual(['the-void', 'donjon']);
  });

  it('keeps every number and die of the English in the German', () => {
    const numbers = (s: string) =>
      (s.match(/\d+(?:[.,]\d{3})*/g) ?? []).map((n) => n.replace(/[.,]/g, '')).sort();
    const dice = (s: string) => (s.match(/\d+[dW]\d+/g) ?? []).map((d) => d.replace('W', 'd'));
    for (const c of DECK_CARDS) {
      expect(c.text.de, c.index).not.toBe('');
      expect(dice(c.text.de), c.index).toEqual(dice(c.text.en));
      // Feet become metres, so only cards without distances must match number for number.
      if (!/feet/.test(c.text.en)) expect(numbers(c.text.de), c.index).toEqual(numbers(c.text.en));
      expect(c.text.de, c.index).not.toMatch(/(?<!\p{L})(Fuß|feet|XP|gp)(?!\p{L})/u);
    }
  });

  it('names the playing card in either language', () => {
    expect(corner(byIndex('sun'), 'en')).toBe('K♦');
    expect(corner(byIndex('key'), 'de')).toBe('D♥');
    expect(corner(byIndex('rogue'), 'de')).toBe('B♠');
    expect(corner(byIndex('fool'), 'en')).toBe('Joker ™');
  });

  it('finds a card by either name, with or without its article', () => {
    expect(cardByName('The Void')?.index).toBe('the-void');
    expect(cardByName('void')?.index).toBe('the-void');
    expect(cardByName('Die Leere')?.index).toBe('the-void');
    expect(cardByName('Schlüssel')?.index).toBe('key');
    expect(cardByName('Omens')).toBeUndefined();
  });
});

describe('a drawing', () => {
  const deck = deckOf(22);

  it('uses one declared draw per card and ends when they are used', () => {
    let d = startDrawing(2, []);
    d = draw(d, byIndex('sun'));
    expect(left(d)).toBe(1);
    expect(canDraw(d)).toBe(true);
    d = draw(d, byIndex('sun'));
    expect(isDone(d)).toBe(true);
    expect(d.drawn).toEqual(['sun', 'sun']);
    expect(d.out).toEqual([]);
  });

  it('counts the Fool and its redraw as one declared draw; the Fool leaves', () => {
    let d = draw(startDrawing(1, []), byIndex('fool'));
    expect(left(d)).toBe(0);
    expect(canDraw(d)).toBe(true);
    expect(d.out).toEqual(['fool']);
    expect(pool(d, deck).some((c) => c.index === 'fool')).toBe(false);
    d = draw(d, byIndex('key'));
    expect(isDone(d)).toBe(true);
  });

  it('lets the Jester grant two more draws, or none for the XP; the Jester leaves', () => {
    const d = draw(startDrawing(1, []), byIndex('jester'));
    expect(d.pending).toBe('jester');
    expect(canDraw(d)).toBe(false);
    expect(isDone(d)).toBe(false);
    expect(d.out).toEqual(['jester']);
    expect(left(choose(d, true))).toBe(2);
    expect(isDone(choose(d, false))).toBe(true);
  });

  it('lets the Idiot grant one more draw', () => {
    const d = draw(startDrawing(1, []), byIndex('idiot'));
    expect(d.pending).toBe('idiot');
    expect(left(choose(d, true))).toBe(1);
  });

  it('ends on The Void and on Donjon, whatever is left', () => {
    expect(isDone(draw(startDrawing(3, []), byIndex('the-void')))).toBe(true);
    expect(isDone(draw(startDrawing(3, []), byIndex('donjon')))).toBe(true);
  });

  it('draws only from the cards still in the deck', () => {
    const d = startDrawing(1, ['fool', 'jester']);
    expect(pool(d, deck)).toHaveLength(20);
    expect(pickCard(pool(d, deck), () => 0)?.index).toBe('vizier');
    expect(pickCard(pool(d, deck), () => 0.999999)?.index).toBe('balance');
  });
});

describe('the deck note', () => {
  const text = standardDeckText(13, deckOf(13));

  it('starts with every card open and no draws', () => {
    const note = parseDeckNote(text);
    expect(note.cards).toHaveLength(13);
    expect(note.cards.every((c) => !c.out)).toBe(true);
    expect(note.cards[0]?.name).toBe('Sun');
    expect(note.draws).toEqual([]);
  });

  it('ticks a card that left and keeps the history in order', () => {
    const jester = parseDeckNote(text).cards.find((c) => c.name === 'Jester');
    let next = tickCard(text, jester?.line ?? -1);
    next = appendDraw(next, drawEntry('2026-10-25', '[[Mira]]', 'Jester'));
    next = appendDraw(next, drawEntry('2026-10-25', '', 'Sun'));
    const note = parseDeckNote(next);
    expect(note.cards.find((c) => c.name === 'Jester')?.out).toBe(true);
    expect(note.cards.filter((c) => c.out)).toHaveLength(1);
    expect(note.draws).toEqual(['2026-10-25 · [[Mira]] · Jester', '2026-10-25 · Sun']);
    expect(next).toContain('## Draws\n\n- 2026-10-25 · [[Mira]] · Jester\n- 2026-10-25 · Sun\n');
  });

  it('adds a Draws heading when the note has none, and stops at the next heading', () => {
    const plain = '# Deck\n\n- [ ] Sun\n- [x] Fool\n';
    expect(appendDraw(plain, 'x')).toBe('# Deck\n\n- [ ] Sun\n- [x] Fool\n\n## Draws\n\n- x\n');
    const more = '## Draws\n## Notes\n- not a draw\n';
    expect(appendDraw(more, 'x')).toBe('## Draws\n\n- x\n\n## Notes\n- not a draw\n');
    expect(parseDeckNote(more).draws).toEqual([]);
  });

  it('reads only the first task list as the deck', () => {
    const note = parseDeckNote('---\ntype: deck\n---\nIntro\n- [ ] A\n- [X] B\n\n- [ ] C\n');
    expect(note.cards.map((c) => [c.name, c.out])).toEqual([
      ['A', false],
      ['B', true],
    ]);
  });

  it('splits a draw line back', () => {
    expect(splitEntry('2026-10-25 · [[Mira]] · Throne')).toEqual({
      date: '2026-10-25',
      who: '[[Mira]]',
      card: 'Throne',
    });
    expect(splitEntry('2026-10-25 · Sun')).toEqual({ date: '2026-10-25', who: '', card: 'Sun' });
  });
});
