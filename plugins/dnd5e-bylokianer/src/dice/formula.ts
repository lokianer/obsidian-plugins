// Dice formulas: `2d6+3`, `1d8+2d6-1`, `W20`, `d%`, `4d6kh3`, `2d20kl1`, `4d6dl1`, `d20+5 adv`,
// brackets, `*` and `/` (rounded down). Parsed into a tree, rolled with a random source the tests
// replace; a result keeps every die rolled (kept or dropped) and reads as `d20+7 → 12 (5, +7)`.
// Anything else is no formula, so another plugin's grammar (Dice Roller's `!`, `r`, …) stays
// untouched. Pure.

export type Keep = { mode: 'kh' | 'kl' | 'dh' | 'dl'; n: number };

export type Formula =
  | { kind: 'number'; value: number }
  | { kind: 'dice'; count: number; sides: number; keep: Keep | null }
  | { kind: 'op'; op: '+' | '-' | '*' | '/'; left: Formula; right: Formula }
  | { kind: 'neg'; inner: Formula }
  | { kind: 'group'; inner: Formula };

export interface Die {
  sides: number;
  value: number;
  kept: boolean;
}

export interface Roll {
  /** The formula as written back: `2d6+3`, `2d20kh1+5`. */
  formula: string;
  total: number;
  /** Every die, in the order rolled, by dice group. */
  dice: Die[];
  /** The plain numbers added or taken away, signed: `+7`, `-1`. */
  numbers: string[];
  /** `d20+7 → 12 (5, +7)`. */
  text: string;
}

const MAX_DICE = 100;
const MAX_SIDES = 1000;

/** Advantage or disadvantage written after a formula: `d20+5 adv`, `W20 Nachteil`. */
const EDGE = /\s+(adv|advantage|vorteil|dis|disadvantage|nachteil)\s*$/i;

/** A formula read, or null when the text is none. */
export function parseFormula(text: string): Formula | null {
  let source = text.trim();
  const edge = EDGE.exec(source);
  if (edge !== null) source = source.slice(0, edge.index);
  const tokens = tokenize(source);
  if (tokens === null || tokens.length === 0) return null;
  let at = 0;
  const peek = () => tokens[at];
  const next = () => tokens[at++];

  function expr(): Formula | null {
    let left = term();
    while (left !== null && (peek() === '+' || peek() === '-')) {
      const op = next() as '+' | '-';
      const right = term();
      if (right === null) return null;
      left = { kind: 'op', op, left, right };
    }
    return left;
  }
  function term(): Formula | null {
    let left = factor();
    while (left !== null && (peek() === '*' || peek() === '/')) {
      const op = next() as '*' | '/';
      const right = factor();
      if (right === null) return null;
      left = { kind: 'op', op, left, right };
    }
    return left;
  }
  function factor(): Formula | null {
    const token = next();
    if (token === undefined) return null;
    if (token === '-') {
      const inner = factor();
      return inner === null ? null : { kind: 'neg', inner };
    }
    if (token === '(') {
      const inner = expr();
      if (inner === null || next() !== ')') return null;
      return { kind: 'group', inner };
    }
    if (typeof token === 'object') return token;
    return null;
  }

  const tree = expr();
  if (tree === null || at !== tokens.length) return null;
  if (edge === null) return tree;
  const advantage = /^(adv|advantage|vorteil)$/i.test(edge[1] ?? '');
  return withEdge(tree, advantage);
}

type Token = '+' | '-' | '*' | '/' | '(' | ')' | Formula;

function tokenize(source: string): Token[] | null {
  const tokens: Token[] = [];
  const s = source.replace(/\s+/g, '');
  let i = 0;
  while (i < s.length) {
    const rest = s.slice(i);
    const dice = /^(\d*)[dDwW](\d+|%)((?:kh|kl|dh|dl|k)\d*)?/.exec(rest);
    if (dice !== null) {
      const count = dice[1] === '' ? 1 : Number(dice[1]);
      const sides = dice[2] === '%' ? 100 : Number(dice[2]);
      if (count < 1 || count > MAX_DICE || sides < 2 || sides > MAX_SIDES) return null;
      let keep: Keep | null = null;
      if (dice[3] !== undefined) {
        const m = /^(kh|kl|dh|dl|k)(\d*)$/.exec(dice[3]);
        if (m === null) return null;
        const mode = (m[1] === 'k' ? 'kh' : m[1]) as Keep['mode'];
        const n = m[2] === '' ? 1 : Number(m[2]);
        if (n < 1 || n > count) return null;
        keep = { mode, n };
      }
      tokens.push({ kind: 'dice', count, sides, keep });
      i += dice[0].length;
      continue;
    }
    const number = /^\d+/.exec(rest);
    if (number !== null) {
      tokens.push({ kind: 'number', value: Number(number[0]) });
      i += number[0].length;
      continue;
    }
    const c = s[i];
    if (c === '+' || c === '-' || c === '*' || c === '/' || c === '(' || c === ')') {
      tokens.push(c);
      i++;
      continue;
    }
    if (c === '×') {
      tokens.push('*');
      i++;
      continue;
    }
    if (c === '−') {
      tokens.push('-');
      i++;
      continue;
    }
    return null;
  }
  return tokens;
}

/** Advantage or disadvantage on the first single d20 of a formula: it becomes 2d20kh1 / kl1. */
function withEdge(f: Formula, advantage: boolean): Formula | null {
  let done = false;
  const walk = (node: Formula): Formula => {
    if (done) return node;
    switch (node.kind) {
      case 'dice':
        if (node.sides === 20 && node.count === 1 && node.keep === null) {
          done = true;
          return { ...node, count: 2, keep: { mode: advantage ? 'kh' : 'kl', n: 1 } };
        }
        return node;
      case 'op':
        return { ...node, left: walk(node.left), right: walk(node.right) };
      case 'neg':
      case 'group':
        return { ...node, inner: walk(node.inner) };
      default:
        return node;
    }
  };
  const result = walk(f);
  return done ? result : null;
}

/** The formula written back in one canonical form. */
function formulaText(f: Formula): string {
  switch (f.kind) {
    case 'number':
      return String(f.value);
    case 'dice':
      return `${f.count === 1 ? '' : f.count}d${f.sides}${f.keep === null ? '' : `${f.keep.mode}${f.keep.n}`}`;
    case 'op':
      return `${formulaText(f.left)}${f.op}${formulaText(f.right)}`;
    case 'neg':
      return `-${formulaText(f.inner)}`;
    case 'group':
      return `(${formulaText(f.inner)})`;
  }
}

/**
 * A critical hit's damage: every die rolled twice, the numbers once (`1d10+5` → `2d10+5`); null
 * when the text is no formula.
 */
export function criticalFormula(text: string): string | null {
  const double = (f: Formula): Formula => {
    switch (f.kind) {
      case 'dice':
        return {
          ...f,
          count: f.count * 2,
          keep: f.keep === null ? null : { ...f.keep, n: f.keep.n * 2 },
        };
      case 'op':
        return { ...f, left: double(f.left), right: double(f.right) };
      case 'neg':
      case 'group':
        return { ...f, inner: double(f.inner) };
      default:
        return f;
    }
  };
  const f = parseFormula(text);
  return f === null ? null : formulaText(double(f));
}

/** A die from 1 to `sides`. */
export const rollDie = (sides: number, random: () => number): number =>
  Math.min(sides, Math.floor(random() * sides) + 1);

/** Which dice of a group count: the highest or lowest n kept, or n dropped. */
function keepDice(values: number[], keep: Keep | null): boolean[] {
  if (keep === null) return values.map(() => true);
  const order = values.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v || a.i - b.i);
  const n = keep.n;
  const pick =
    keep.mode === 'kh'
      ? order.slice(0, n)
      : keep.mode === 'kl'
        ? order.slice(-n)
        : keep.mode === 'dh'
          ? order.slice(n)
          : order.slice(0, order.length - n);
  const kept = new Set(pick.map((x) => x.i));
  return values.map((_, i) => kept.has(i));
}

/** Rolls a formula. */
export function rollFormula(f: Formula, random: () => number): Roll {
  const dice: Die[] = [];
  const numbers: string[] = [];
  const parts: string[] = [];

  const value = (node: Formula, sign: 1 | -1): number => {
    switch (node.kind) {
      case 'number':
        numbers.push(`${sign < 0 ? '-' : '+'}${node.value}`);
        parts.push(`${sign < 0 ? '-' : '+'}${node.value}`);
        return node.value;
      case 'dice': {
        const values = Array.from({ length: node.count }, () => rollDie(node.sides, random));
        const kept = keepDice(values, node.keep);
        values.forEach((v, i) => {
          dice.push({ sides: node.sides, value: v, kept: kept[i] ?? true });
          parts.push(kept[i] ? `${sign < 0 ? '-' : ''}${v}` : `[${v}]`);
        });
        return values.reduce((sum, v, i) => sum + (kept[i] ? v : 0), 0);
      }
      case 'op': {
        const left = value(node.left, sign);
        const right = value(node.right, node.op === '-' ? (-sign as 1 | -1) : sign);
        if (node.op === '+') return left + right;
        if (node.op === '-') return left - right;
        if (node.op === '*') return left * right;
        return right === 0 ? 0 : Math.floor(left / right);
      }
      case 'neg':
        return -value(node.inner, -sign as 1 | -1);
      case 'group':
        return value(node.inner, sign);
    }
  };

  const total = value(f, 1);
  const formula = formulaText(f);
  const shown = parts.map((p, i) => (i > 0 || !p.startsWith('+') ? p : p.slice(1)));
  const text =
    shown.length > 1 ? `${formula} → ${total} (${shown.join(', ')})` : `${formula} → ${total}`;
  return { formula, total, dice, numbers, text };
}

/** Parses and rolls, or null when the text is no formula. */
export function roll(text: string, random: () => number): Roll | null {
  const f = parseFormula(text);
  return f === null ? null : rollFormula(f, random);
}

/** The die a natural 20 or 1 counts on: the single kept d20 of a roll, if it has exactly one. */
export function keptD20(r: Roll): number | null {
  const d20s = r.dice.filter((d) => d.sides === 20 && d.kept);
  return d20s.length === 1 ? (d20s[0]?.value ?? null) : null;
}

export type Verdict = 'critical-success' | 'critical-failure' | 'success' | 'failure';

/** A roll against a DC: a kept natural 20 always succeeds, a natural 1 always fails. */
export function verdict(r: Roll, dc: number | null): Verdict | null {
  const nat = keptD20(r);
  if (nat === 20) return 'critical-success';
  if (nat === 1) return 'critical-failure';
  if (dc === null) return null;
  return r.total >= dc ? 'success' : 'failure';
}

const VERDICT_WORDS: Record<Verdict, string> = {
  'critical-success': 'critical success',
  'critical-failure': 'critical failure',
  success: 'success',
  failure: 'failure',
};

/**
 * The session log's line for a roll: `Rolled 2d6+3 → 10 (4, 3, +3)`, with a DC its verdict; with a
 * subject `Orrin Quill rolls Persuasion: d20+7 → 12 (5, +7)`.
 */
export function rollLine(r: Roll, dc: number | null, subject?: string): string {
  const v = verdict(r, dc);
  const against = dc === null ? '' : ` against DC ${dc}`;
  const head = subject === undefined ? 'Rolled ' : `${subject}: `;
  return `${head}${r.text}${against}${v === null ? '' : `: ${VERDICT_WORDS[v]}`}`;
}

export type Edge = 'normal' | 'adv' | 'dis';

/** A formula with advantage or disadvantage when it has a single d20, else as written. */
export function parseWithEdge(text: string, edge: Edge): Formula | null {
  if (edge !== 'normal') {
    const f = parseFormula(`${text} ${edge}`);
    if (f !== null) return f;
  }
  return parseFormula(text);
}
