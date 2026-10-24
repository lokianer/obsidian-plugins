import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  appendToLog,
  findTonight,
  formatLogLine,
  needsNext,
  nextSessionPath,
  nextSessionText,
  parseLog,
  sessionsOf,
} from '../src/index';

const vault = new URL('../../../examples/vault/', import.meta.url);
const read = (path: string) => readFileSync(new URL(encodeURI(path), vault), 'utf8');
const session14 = read('Silverstadt/Sessions/Session 14 – Bell Square.md');
const template = read('Templates/Session.md');

describe('formatLogLine', () => {
  it('writes time, pair and values with a typographic minus and a dash for none', () => {
    expect(
      formatLogLine({ time: '20:31', from: 'Order', to: 'Court', before: -2, after: -3 }),
    ).toBe('- 20:31 Order → Court: −2 → −3');
    expect(formatLogLine({ time: '09:05', from: 'A', to: 'B', before: null, after: 2 })).toBe(
      '- 09:05 A → B: — → +2',
    );
    expect(formatLogLine({ time: '09:05', from: 'A', to: 'B', before: 0, after: null })).toBe(
      '- 09:05 A → B: 0 → —',
    );
  });
});

describe('appendToLog', () => {
  const line = '- 22:00 Order of the Lantern → The Archivists: +1 → +2';

  it('adds the line after the last log entry, before the next heading', () => {
    const after = appendToLog(session14, line).split('\n');
    const at = after.indexOf(line);
    expect(after[at - 1]).toBe('- 21:40 The party now knows [[Lady Vermillion]].');
    expect(after[at + 1]).toBe('');
    expect(after[at + 2]).toBe('## Loot');
    expect(after.length).toBe(session14.split('\n').length + 1);
  });

  it('opens a [!gm] callout for a secret line, and joins it next time', () => {
    const once = appendToLog(session14, line, { secret: true });
    const twice = appendToLog(once, '- 22:05 A → B: 0 → +1', { secret: true }).split('\n');
    const head = twice.indexOf('> [!gm]', twice.indexOf('## Log'));
    expect(twice.slice(head - 1, head + 3)).toEqual([
      '',
      '> [!gm]',
      `> ${line}`,
      '> - 22:05 A → B: 0 → +1',
    ]);
    // A plain line after the callout leaves a gap so it does not read as part of it.
    const third = appendToLog(twice.join('\n'), '- 22:10 C → D: +1 → 0').split('\n');
    const at = third.indexOf('- 22:10 C → D: +1 → 0');
    expect(third[at - 1]).toBe('');
  });

  it('creates the section when the note has none, and keeps CRLF', () => {
    expect(appendToLog('# Session 15\n', line)).toBe(`# Session 15\n\n## Log\n\n${line}\n`);
    const crlf = '# S\r\n\r\n## Log\r\n\r\n- 19:00 x\r\n';
    expect(appendToLog(crlf, line)).toBe(`# S\r\n\r\n## Log\r\n\r\n- 19:00 x\r\n${line}\r\n`);
  });
});

describe('parseLog', () => {
  it('reads the relation line of Session 14 and nothing else there', () => {
    expect(parseLog(session14)).toEqual([
      {
        time: '20:31',
        from: 'Order of the Lantern',
        to: 'The Gutter Court',
        before: -2,
        after: -3,
        secret: false,
      },
    ]);
  });

  it('reads back what appendToLog writes, secret lines marked', () => {
    let text = session14;
    const changes = [
      { time: '22:00', from: 'A', to: 'B', before: null, after: 2 },
      { time: '22:01', from: 'B', to: 'A', before: -1, after: null },
    ];
    text = appendToLog(text, formatLogLine(changes[0]!));
    text = appendToLog(text, formatLogLine(changes[1]!), { secret: true });
    expect(parseLog(text).slice(1)).toEqual([
      { ...changes[0], secret: false },
      { ...changes[1], secret: true },
    ]);
  });

  it('accepts a plain hyphen as the minus', () => {
    expect(parseLog('## Log\n- 20:31 A → B: -2 → +3')[0]).toMatchObject({ before: -2, after: 3 });
  });
});

describe('tonight', () => {
  const notes = [
    { path: 'S/Session 13.md', frontmatter: { type: 'session', session: 13, date: '2026-09-10' } },
    {
      path: 'S/Session 14.md',
      frontmatter: { type: 'Session', session: '14', date: '2026-09-24' },
    },
    { path: 'Templates/Session.md', frontmatter: { type: 'session', session: null } },
    { path: 'Notes/x.md', frontmatter: { type: 'npc' } },
  ];

  it('finds the session with the highest number', () => {
    const tonight = findTonight(sessionsOf(notes));
    expect(tonight).toEqual({ path: 'S/Session 14.md', session: 14, date: '2026-09-24' });
    expect(tonight && needsNext(tonight, '2026-10-25')).toBe(true);
    expect(tonight && needsNext(tonight, '2026-09-24')).toBe(false);
    expect(tonight && nextSessionPath(tonight, 15)).toBe('S/Session 15.md');
    expect(findTonight([])).toBeNull();
  });

  it('fills the session template', () => {
    const text = nextSessionText(template, 15, '2026-10-25');
    expect(text).toContain('session: 15');
    expect(text).toContain('date: "2026-10-25"');
    expect(text).toContain('# Session 15 – ');
    expect(nextSessionText(null, 15, '2026-10-25')).toContain('## Log');
  });
});
