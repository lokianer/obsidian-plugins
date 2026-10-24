import { appendToLog, formatLogLine, parseLog } from '@obsidian-plugins/session';
import { describe, expect, it } from 'vitest';

import { buildHistory, historyFor } from '../src/factions/history';
import { buildWorld } from '../src/factions/world';
import { loadExampleVault, readExampleNote } from './fixture';

const world = buildWorld(loadExampleVault());
const F = 'Silverstadt/Factions';
const ORDER = `${F}/Order of the Lantern`;
const COURT = `${F}/The Gutter Court`;
const BENCH = `${COURT}/The Bench`;
const session14 = readExampleNote('Silverstadt/Sessions/Session 14 – Bell Square.md');

describe('buildHistory', () => {
  it('resolves the example vault’s log line to the Order and the Court', () => {
    const history = buildHistory(world, [{ session: 14, entries: parseLog(session14) }]);
    expect(historyFor(history, ORDER, COURT, 'public')).toEqual([
      { session: 14, time: '20:31', from: ORDER, to: COURT, before: -2, after: -3, secret: false },
    ]);
  });

  it('keeps secret changes for True mode and orders newest first', () => {
    let text = appendToLog(
      session14,
      formatLogLine({
        time: '22:00',
        from: 'The Bench',
        to: 'Order of the Lantern',
        before: -4,
        after: 4,
      }),
      { secret: true },
    );
    text = appendToLog(
      text,
      formatLogLine({
        time: '22:05',
        from: 'The Bench',
        to: 'Order of the Lantern',
        before: null,
        after: -2,
      }),
    );
    const history = buildHistory(world, [
      { session: 15, entries: parseLog(text) },
      { session: 3, entries: parseLog('## Log\n- 10:00 The Bench → Order of the Lantern: 0 → -1') },
    ]);
    expect(historyFor(history, BENCH, ORDER, 'public').map((h) => [h.session, h.after])).toEqual([
      [15, -2],
      [3, -1],
    ]);
    expect(historyFor(history, BENCH, ORDER, 'true').map((h) => h.after)).toEqual([-2, 4, -1]);
  });

  it('ignores lines whose subject is unknown, keeps dangling targets', () => {
    const history = buildHistory(world, [
      {
        session: 1,
        entries: parseLog(
          '## Log\n- 10:00 Nobody → The Gutter Court: 0 → 1\n- 10:01 The Drowned Choir → The Salt Kings: −2 → −3',
        ),
      },
    ]);
    expect(history.map((h) => h.to)).toEqual(['?The Salt Kings']);
  });
});
