// What a fight's session log says: the moments between two states of a fight worth a line under
// `## Log` of tonight's session — it begins, a combatant is defeated, goes down or dies, it ends
// (with the defeated enemies' XP). The lines are English, like the `## Combat` table. Pure.

import { type Fight, isDead, isDefeated, isDown } from './fight';

export type BattleEvent =
  | { kind: 'begin' }
  | { kind: 'defeated' | 'down' | 'dead'; id: string; round: number }
  | { kind: 'end'; rounds: number; xp: number };

/** What happened from `before` to `after`; nothing when there was no fight before. */
export function battleEvents(
  before: Fight | null,
  after: Fight,
  ended: boolean,
  wasEnded: boolean,
): BattleEvent[] {
  if (before === null || wasEnded) return [];
  const events: BattleEvent[] = [];
  if (before.round === 0 && after.round >= 1) events.push({ kind: 'begin' });
  const was = new Map(before.combatants.map((c) => [c.id, c]));
  for (const c of after.combatants) {
    const p = was.get(c.id);
    if (p === undefined) continue;
    const round = after.round;
    if (!isDefeated(p) && isDefeated(c)) events.push({ kind: 'defeated', id: c.id, round });
    if (!isDead(p) && isDead(c)) events.push({ kind: 'dead', id: c.id, round });
    else if (!isDown(p) && isDown(c) && !isDead(c)) events.push({ kind: 'down', id: c.id, round });
  }
  if (ended) {
    const xp = after.combatants
      .filter((c) => c.side === 'enemy' && isDefeated(c))
      .reduce((sum, c) => sum + (c.xp ?? 0), 0);
    events.push({ kind: 'end', rounds: after.round, xp });
  }
  return events;
}

/** The line for an event; `encounter` is the encounter note's link; XP only when `withXp`. */
export function battleLine(event: BattleEvent, encounter: string, withXp = true): string {
  switch (event.kind) {
    case 'begin':
      return `Combat begins: ${encounter}`;
    case 'defeated':
      return `Round ${event.round}: ${event.id} defeated`;
    case 'down':
      return `Round ${event.round}: ${event.id} is down`;
    case 'dead':
      return `Round ${event.round}: ${event.id} dies`;
    case 'end': {
      const rounds = `${event.rounds} ${event.rounds === 1 ? 'round' : 'rounds'}`;
      const xp = withXp && event.xp > 0 ? ` — ${event.xp.toLocaleString('en-US')} XP` : '';
      return `Combat ends after ${rounds}${xp}`;
    }
  }
}

/** Whether a log line's text (after its time) is one `battleLine` writes. */
export function isBattleLine(text: string): boolean {
  return /^Combat begins: |^Combat ends after |^Round \d+: .+ (?:defeated|is down|dies)$/.test(
    text,
  );
}
