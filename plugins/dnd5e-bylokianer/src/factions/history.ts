// The relations' history: log lines of the session notes resolved to entity pairs, so a view can
// show a relation's last changes. Secret lines only in True mode. Pure.

import type { LogEntry } from '@obsidian-plugins/session';

import { keyLookup } from './keys';
import type { FactionWorld, Mode } from './model';

export interface HistoryEntry {
  session: number;
  time: string;
  from: string;
  /** An entity id, or `?` + the name for a target nothing has (a dangling relation). */
  to: string;
  before: number | null;
  after: number | null;
  secret: boolean;
}

/** Entries in session and line order; lines whose subject is unknown are left out. */
export function buildHistory(
  world: FactionWorld,
  sessions: readonly { session: number; entries: readonly LogEntry[] }[],
): HistoryEntry[] {
  const resolve = keyLookup(world.entities);
  const history: HistoryEntry[] = [];
  for (const { session, entries } of [...sessions].sort((a, b) => a.session - b.session)) {
    for (const entry of entries) {
      const from = resolve(entry.from);
      if (from === null) continue;
      history.push({
        session,
        time: entry.time,
        from,
        to: resolve(entry.to) ?? `?${entry.to.trim()}`,
        before: entry.before,
        after: entry.after,
        secret: entry.secret,
      });
    }
  }
  return history;
}

/** A pair's newest changes first, at most `limit`; Public mode leaves secret ones out. */
export function historyFor(
  history: readonly HistoryEntry[],
  from: string,
  to: string,
  mode: Mode,
  limit = 3,
): HistoryEntry[] {
  return history
    .filter((h) => h.from === from && h.to === to && (mode === 'true' || !h.secret))
    .reverse()
    .slice(0, limit);
}
