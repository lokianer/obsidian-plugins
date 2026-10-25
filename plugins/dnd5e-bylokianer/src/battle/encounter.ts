// An encounter note's combatants as the GM writes them: links to notes (`"[[Sable]]"`, or
// `name: "[[Sable]]"` with a side), monsters from the Monster Manual (`monster: Owlbear`), and
// combatants written right there (`name`, `ac`, `hp`, `initiative`), each with an optional `count`.
// `party: false` keeps the campaign's party out. Pure.

export type Side = 'party' | 'ally' | 'enemy';

export type CombatantSpec =
  | { kind: 'note'; link: string; side: Side | null; count: number }
  | { kind: 'monster'; monster: string; name: string | null; side: Side | null; count: number }
  | {
      kind: 'inline';
      name: string;
      side: Side | null;
      count: number;
      ac: number | null;
      hp: number | null;
      initiative: number | null;
    };

export interface EncounterSpec {
  combatants: CombatantSpec[];
  /** The campaign's party joins unless the note says `party: false`. */
  party: boolean;
}

const LINK = /^\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]$/;

/** The note a `[[link]]` names, or null when the text is no link. */
export function linkTarget(text: string): string | null {
  return LINK.exec(text.trim())?.[1]?.trim() ?? null;
}

const num = (v: unknown): number | null => {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v.trim()) : NaN;
  return Number.isFinite(n) ? n : null;
};

const side = (v: unknown): Side | null =>
  v === 'party' || v === 'ally' || v === 'enemy' ? v : null;

const count = (v: unknown): number => {
  const n = num(v);
  return n !== null && Number.isInteger(n) && n >= 1 ? Math.min(n, 50) : 1;
};

function spec(entry: unknown): CombatantSpec | null {
  if (typeof entry === 'string') {
    const link = linkTarget(entry);
    if (link !== null) return { kind: 'note', link, side: null, count: 1 };
    return entry.trim() === ''
      ? null
      : {
          kind: 'inline',
          name: entry.trim(),
          side: null,
          count: 1,
          ac: null,
          hp: null,
          initiative: null,
        };
  }
  if (typeof entry !== 'object' || entry === null) return null;
  const o = entry as Record<string, unknown>;
  const name = typeof o.name === 'string' ? o.name.trim() : '';
  if (typeof o.monster === 'string' && o.monster.trim() !== '') {
    return {
      kind: 'monster',
      monster: o.monster.trim(),
      name: name === '' ? null : name,
      side: side(o.side),
      count: count(o.count),
    };
  }
  const link = linkTarget(name);
  if (link !== null) return { kind: 'note', link, side: side(o.side), count: count(o.count) };
  if (name === '') return null;
  return {
    kind: 'inline',
    name,
    side: side(o.side),
    count: count(o.count),
    ac: num(o.ac),
    hp: num(o.hp),
    initiative: num(o.initiative),
  };
}

/** The combatants an encounter note's frontmatter lists. */
export function readEncounter(frontmatter: Record<string, unknown> | undefined): EncounterSpec {
  const list = Array.isArray(frontmatter?.combatants) ? frontmatter.combatants : [];
  return {
    combatants: list.map(spec).filter((s): s is CombatantSpec => s !== null),
    party: frontmatter?.party !== false,
  };
}
