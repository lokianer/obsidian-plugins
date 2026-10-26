// A fight as pure state: the combatants in initiative order, the round and whose turn it is, hit
// points with temporary ones, death saves, conditions with durations and concentration. Every
// action returns a new fight; nothing here reads the vault or the clock.

import type { Side } from './encounter';

/** A combatant before the fight: what the encounter note and the vault say about it. */
export interface Fighter {
  name: string;
  side: Side;
  /** A player character (goes down at 0 and makes death saves) rather than a monster or NPC. */
  pc: boolean;
  ac: number | null;
  maxHp: number;
  /** Added to the d20 for initiative. */
  initBonus: number;
  /** For ties: the higher Dexterity goes first. */
  dex: number;
  /** The note it comes from, if any. */
  path: string | null;
  /** The monster in the Monster Manual it is, if any. */
  monster: string | null;
  /** Experience points for defeating it, from its challenge rating; null when it has none. */
  xp: number | null;
  /** Fighters of one group share one initiative roll. */
  group: string | null;
}

export interface Condition {
  /** As the SRD writes it: `prone`, `exhaustion 2`; or anything the GM types. */
  name: string;
  /** Rounds left, or null for until removed. */
  rounds: number | null;
}

export interface Combatant extends Fighter {
  /** Unique within the fight: the name, numbered within a group. */
  id: string;
  init: number | null;
  hp: number;
  temp: number;
  conditions: Condition[];
  concentration: boolean;
  /** Death saves of a downed character. */
  saves: { ok: number; fail: number };
}

export interface Fight {
  /** 0 while initiative is being settled. */
  round: number;
  /** The id of the combatant whose turn it is. */
  turn: string | null;
  /** In initiative order. */
  combatants: Combatant[];
}

export const CONDITIONS = [
  'blinded',
  'charmed',
  'deafened',
  'frightened',
  'grappled',
  'incapacitated',
  'invisible',
  'paralyzed',
  'petrified',
  'poisoned',
  'prone',
  'restrained',
  'stunned',
  'unconscious',
] as const;

/** A monster or NPC at 0 hit points is out of the fight. */
export const isDefeated = (c: Combatant): boolean => !c.pc && c.hp <= 0;
/** A player character at 0 hit points is down, making death saves. */
export const isDown = (c: Combatant): boolean => c.pc && c.hp <= 0;
/** Dead after three failed death saves. */
export const isDead = (c: Combatant): boolean => c.pc && c.saves.fail >= 3;

const d20 = (random: () => number) => Math.min(20, Math.floor(random() * 20) + 1);

/** Initiative order: the higher roll first, then the higher Dexterity, then by name. */
const compare = (a: Combatant, b: Combatant): number =>
  (b.init ?? -99) - (a.init ?? -99) ||
  b.dex - a.dex ||
  a.id.localeCompare(b.id, undefined, { numeric: true });

export function order(list: readonly Combatant[]): Combatant[] {
  return [...list].sort(compare);
}

/**
 * The fight before round 1: groups numbered and rolling once each, monsters and NPCs rolled,
 * player characters left for the GM to type in (or roll with `rollFor`).
 */
export function setUp(fighters: readonly Fighter[], random: () => number): Fight {
  const rolls = new Map<string, number>();
  const sizes = new Map<string, number>();
  for (const f of fighters) if (f.group !== null) sizes.set(f.group, (sizes.get(f.group) ?? 0) + 1);
  const seen = new Map<string, number>();
  const combatants = fighters.map((f): Combatant => {
    let id = f.name;
    if (f.group !== null && (sizes.get(f.group) ?? 0) > 1) {
      const n = (seen.get(f.group) ?? 0) + 1;
      seen.set(f.group, n);
      id = `${f.name} ${n}`;
    }
    let init: number | null = null;
    if (!f.pc) {
      const key = f.group ?? id;
      const roll = rolls.get(key) ?? d20(random) + f.initBonus;
      rolls.set(key, roll);
      init = roll;
    }
    return {
      ...f,
      id,
      init,
      hp: f.maxHp,
      temp: 0,
      conditions: [],
      concentration: false,
      saves: { ok: 0, fail: 0 },
    };
  });
  return { round: 0, turn: null, combatants: order(unique(combatants)) };
}

/** Ids made unique where two combatants share a name outside a group. */
function unique(list: Combatant[]): Combatant[] {
  const used = new Set<string>();
  return list.map((c) => {
    let id = c.id;
    for (let n = 2; used.has(id); n++) id = `${c.id} (${n})`;
    used.add(id);
    return id === c.id ? c : { ...c, id };
  });
}

const change = (f: Fight, id: string, edit: (c: Combatant) => Combatant): Fight => ({
  ...f,
  combatants: f.combatants.map((c) => (c.id === id ? edit(c) : c)),
});

/** A typed-in initiative; the order follows. */
export function setInit(f: Fight, id: string, init: number | null): Fight {
  const next = change(f, id, (c) => ({ ...c, init }));
  return { ...next, combatants: order(next.combatants) };
}

/** A combatant's initiative rolled with its bonus. */
export function rollFor(f: Fight, id: string, random: () => number): Fight {
  const c = f.combatants.find((x) => x.id === id);
  return c === undefined ? f : setInit(f, id, d20(random) + c.initBonus);
}

/** Moves a combatant one place up or down the order (ties broken by hand). */
export function nudge(f: Fight, id: string, by: -1 | 1): Fight {
  const list = [...f.combatants];
  const at = list.findIndex((c) => c.id === id);
  const to = at + by;
  if (at === -1 || to < 0 || to >= list.length) return f;
  const [moved] = list.splice(at, 1);
  if (moved !== undefined) list.splice(to, 0, moved);
  return { ...f, combatants: list };
}

const acting = (c: Combatant) => !isDefeated(c) && !isDead(c);

/**
 * A combatant joining the fight: a member of a group already fighting takes the group's
 * initiative and the next member number and goes after it; anyone else rolls (a player
 * character waits for a number) and goes where its initiative puts it. The rest keeps the order
 * the GM may have nudged.
 */
export function addFighter(
  f: Fight,
  fighter: Fighter,
  random: () => number,
): { fight: Fight; id: string } {
  const members =
    fighter.group === null ? [] : f.combatants.filter((c) => c.group === fighter.group);
  let id = fighter.name;
  let init: number | null = fighter.pc ? null : d20(random) + fighter.initBonus;
  if (members.length > 0) {
    const numbers = members.map((c) => Number(/ (\d+)$/.exec(c.id)?.[1] ?? 1));
    id = `${fighter.name} ${Math.max(...numbers) + 1}`;
    init = members[0]?.init ?? init;
  }
  const used = new Set(f.combatants.map((c) => c.id));
  const base = id;
  for (let n = 2; used.has(id); n++) id = `${base} (${n})`;
  const joining: Combatant = {
    ...fighter,
    id,
    init,
    hp: fighter.maxHp,
    temp: 0,
    conditions: [],
    concentration: false,
    saves: { ok: 0, fail: 0 },
  };
  // A group member right after its group, anyone else before the first one it outranks.
  const last = f.combatants.findLastIndex((c) => members.includes(c));
  const at = last !== -1 ? last + 1 : f.combatants.findIndex((c) => compare(joining, c) < 0);
  const combatants = [...f.combatants];
  combatants.splice(at === -1 ? combatants.length : at, 0, joining);
  return { fight: { ...f, combatants }, id };
}

/** A combatant leaving the fight; when it was its turn, the turn passes to the next one acting. */
export function removeCombatant(f: Fight, id: string): Fight {
  const at = f.combatants.findIndex((c) => c.id === id);
  if (at === -1) return f;
  const combatants = f.combatants.filter((c) => c.id !== id);
  if (f.turn !== id) return { ...f, combatants };
  for (let step = 0; step < combatants.length; step++) {
    const c = combatants[(at + step) % combatants.length];
    if (c !== undefined && acting(c)) {
      return { round: f.round + (at + step >= combatants.length ? 1 : 0), turn: c.id, combatants };
    }
  }
  return { ...f, turn: null, combatants };
}

/** Round 1 begins with the first combatant in the order. */
export function begin(f: Fight): Fight {
  const first = f.combatants.find(acting);
  return { ...f, round: 1, turn: first?.id ?? null };
}

/** The end of a combatant's turn: its conditions' durations count down; those at 0 drop off. */
function endTurn(c: Combatant): Combatant {
  const conditions = c.conditions
    .map((k) => (k.rounds === null ? k : { ...k, rounds: k.rounds - 1 }))
    .filter((k) => k.rounds === null || k.rounds > 0);
  return { ...c, conditions };
}

/** The next turn: the current combatant's turn ends, the next one acting begins its turn. */
export function nextTurn(f: Fight): Fight {
  if (f.round === 0) return begin(f);
  const list = f.combatants.map((c) => (c.id === f.turn ? endTurn(c) : c));
  const at = list.findIndex((c) => c.id === f.turn);
  for (let step = 1; step <= list.length; step++) {
    const i = (at + step) % list.length;
    const c = list[i];
    if (c !== undefined && acting(c)) {
      return { round: f.round + (at + step >= list.length ? 1 : 0), turn: c.id, combatants: list };
    }
  }
  return { ...f, combatants: list };
}

/** Back one turn (a slip of the finger); durations are not given back. */
export function previousTurn(f: Fight): Fight {
  if (f.round === 0) return f;
  const list = f.combatants;
  const at = list.findIndex((c) => c.id === f.turn);
  for (let step = 1; step <= list.length; step++) {
    const i = (at - step + list.length * 2) % list.length;
    const c = list[i];
    if (c !== undefined && acting(c)) {
      const round = Math.max(1, f.round - (at - step < 0 ? 1 : 0));
      return { ...f, round, turn: c.id };
    }
  }
  return f;
}

/**
 * Damage: temporary hit points first. Returns the fight and, when the combatant concentrates,
 * the DC of its Constitution save (10 or half the damage, whichever is higher). Damage to a
 * downed character is a failed death save (a stable one starts its saves again); a character
 * whose damage left over at 0 hit points reaches its maximum dies at once.
 */
export function damage(
  f: Fight,
  id: string,
  amount: number,
): { fight: Fight; concentrationDc: number | null } {
  const c = f.combatants.find((x) => x.id === id);
  if (c === undefined || amount <= 0) return { fight: f, concentrationDc: null };
  const fromTemp = Math.min(c.temp, amount);
  const rest = amount - fromTemp;
  const wasDown = isDown(c);
  const hp = Math.max(0, c.hp - rest);
  const massive = c.pc && !wasDown && rest - c.hp >= c.maxHp;
  const fight = change(f, id, (x) => ({
    ...x,
    temp: x.temp - fromTemp,
    hp,
    saves: massive
      ? { ok: 0, fail: 3 }
      : wasDown
        ? { ok: x.saves.ok >= 3 ? 0 : x.saves.ok, fail: Math.min(3, x.saves.fail + 1) }
        : x.saves,
    // Down or defeated, concentration ends.
    concentration: hp > 0 && x.concentration,
  }));
  const dc = c.concentration && hp > 0 ? Math.max(10, Math.floor(amount / 2)) : null;
  return { fight, concentrationDc: dc };
}

/** Healing up to the maximum; a downed character is back up with fresh death saves; the dead stay. */
export function heal(f: Fight, id: string, amount: number): Fight {
  if (amount <= 0) return f;
  return change(f, id, (c) =>
    isDead(c)
      ? c
      : {
          ...c,
          hp: Math.min(c.maxHp, c.hp + amount),
          saves: c.hp <= 0 ? { ok: 0, fail: 0 } : c.saves,
        },
  );
}

/** Temporary hit points don't stack: the higher amount stays. */
export function setTemp(f: Fight, id: string, amount: number): Fight {
  return change(f, id, (c) => ({ ...c, temp: Math.max(c.temp, Math.max(0, amount)) }));
}

/** A death save for a downed character; three successes stabilise it at 0. */
export function deathSave(f: Fight, id: string, success: boolean): Fight {
  return change(f, id, (c) =>
    isDown(c)
      ? {
          ...c,
          saves: success
            ? { ...c.saves, ok: Math.min(3, c.saves.ok + 1) }
            : { ...c.saves, fail: Math.min(3, c.saves.fail + 1) },
        }
      : c,
  );
}

/** Adds a condition, or changes its duration if the combatant has it already. */
export function addCondition(f: Fight, id: string, name: string, rounds: number | null): Fight {
  const key = name.trim();
  if (key === '') return f;
  return change(f, id, (c) => ({
    ...c,
    conditions: [...c.conditions.filter((k) => k.name !== key), { name: key, rounds }],
  }));
}

export function removeCondition(f: Fight, id: string, name: string): Fight {
  return change(f, id, (c) => ({ ...c, conditions: c.conditions.filter((k) => k.name !== name) }));
}

export function setConcentration(f: Fight, id: string, on: boolean): Fight {
  return change(f, id, (c) => ({ ...c, concentration: on }));
}
