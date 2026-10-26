// The rollable parts of a stat block entry: an attack bonus (`+7 to hit`, `Attack Roll: +7`,
// German `+7 auf Treffer`, `Angriffswurf: +7`) rolls a d20 with it; a damage expression
// (`10 (1d10 + 5)`, German `10 (1W10 + 5)`) rolls the dice in its brackets. Saving throw DCs are
// the target's roll and are not parts. Pure.

export interface RollPart {
  /** Where the part's text starts and ends in the entry. */
  start: number;
  end: number;
  kind: 'attack' | 'damage';
  /** What to roll: `d20+7`, `1d10+5`. */
  formula: string;
}

// The bonus, after `Attack Roll:` or before `to hit`; a bonus with neither is no attack.
const ATTACK =
  /(?:(Attack Roll|Angriffswurf):\s*)?([+−-]\s?\d+)(?=(\s+(?:to hit|auf Treffer)\b)?)/g;
const DAMAGE = /\b\d+\s*\((\d*[dDwW]\d+(?:\s*[+−-]\s*\d+)?)\)/g;

/** A bonus as a d20 formula: `d20+7`, `d20-1`. */
export function d20(bonus: number): string {
  return bonus === 0 ? 'd20' : `d20${bonus > 0 ? '+' : ''}${bonus}`;
}

const minus = (text: string) => text.replace(/−/g, '-').replace(/\s+/g, '');

/** Every rollable part of an entry's text, in order. */
export function rollParts(text: string): RollPart[] {
  const parts: RollPart[] = [];
  for (const m of text.matchAll(ATTACK)) {
    const bonus = m[2] ?? '';
    if (m[1] === undefined && m[3] === undefined) continue;
    const start = m.index + m[0].length - bonus.length;
    parts.push({
      start,
      end: start + bonus.length,
      kind: 'attack',
      formula: d20(Number(minus(bonus))),
    });
  }
  for (const m of text.matchAll(DAMAGE)) {
    parts.push({
      start: m.index,
      end: m.index + m[0].length,
      kind: 'damage',
      formula: minus(m[1] ?? '').replace(/[wW]/, 'd'),
    });
  }
  return parts.sort((a, b) => a.start - b.start);
}
