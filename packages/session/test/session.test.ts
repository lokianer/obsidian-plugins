import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  appendToLog,
  removeFromLog,
  carriedLoot,
  findTonight,
  formatLogLine,
  needsNext,
  nextSessionPath,
  nextSessionText,
  parseLog,
  sessionsOf,
  withLoot,
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

describe('loot', () => {
  const S14 = '[[Session 14 – Bell Square]]';
  const next = nextSessionText(template, 15, '2026-10-25');

  it('carries the last session’s loot into the new note, marked with its origin', () => {
    const text = withLoot(next, carriedLoot(session14, S14));
    expect(text).toContain(
      [
        '## Loot',
        '',
        '| Item | Who has it |',
        '| --- | --- |',
        `| Mira's calling card, silver edge (from ${S14}) | Orrin |`,
      ].join('\n'),
    );
    // The template's empty placeholder row is gone.
    expect(text).not.toMatch(/^\| \| \|$/m);
  });

  it('keeps an earlier origin and escapes an alias pipe in a table', () => {
    const earlier = [
      '## Loot',
      '',
      '| Item | Who |',
      '| --- | --- |',
      '| Jar (from [[S12]]) | Ilex |',
      '| Rope | Dagny |',
    ].join('\n');
    expect(carriedLoot(earlier, '[[Session 13|S13]]').rows).toEqual([
      '| Jar (from [[S12]]) | Ilex |',
      '| Rope (from [[Session 13\\|S13]]) | Dagny |',
    ]);
  });

  it('carries list items and starts a Loot section where the note has none', () => {
    const loot = carriedLoot('# S\n\n## Loot\n\n- 30 gp\n- Jar (from [[S12]])\n', '[[S13]]');
    expect(loot.items).toEqual(['- 30 gp (from [[S13]])', '- Jar (from [[S12]])']);
    expect(withLoot('# S14\n\n## Log\n', loot)).toBe(
      '# S14\n\n## Log\n\n## Loot\n\n- 30 gp (from [[S13]])\n- Jar (from [[S12]])\n',
    );
  });

  it('starts a table from the previous header where the new Loot section has none', () => {
    const loot = carriedLoot(session14, S14);
    expect(withLoot('## Loot\r\n\r\n## Notes\r\n', loot)).toBe(
      `## Loot\r\n\r\n| Item | Who has it |\r\n| --- | --- |\r\n| Mira's calling card, silver edge (from ${S14}) | Orrin |\r\n\r\n## Notes\r\n`,
    );
  });

  it('leaves the note alone when there is nothing to carry', () => {
    expect(withLoot(next, carriedLoot('# S\n', S14))).toBe(next);
  });
});

describe('removeFromLog', () => {
  const note = [
    '# Session 15',
    '',
    '## Log',
    '',
    '- 20:05 Combat begins: [[Ambush]]',
    '- 20:06 Order of the Lantern → The Gutter Court: −2 → −3',
    '- 20:10 Rolled d20+7 → 19 (12, +7)',
    '',
    '> [!gm]',
    '> - 20:12 Rolled d20 → 4',
    '',
    '- 20:20 Combat ends after 3 rounds',
    '',
    '## Loot',
    '- 20:30 Rolled not a log line here',
  ].join('\n');

  it('removes the picked plain lines of ## Log only, tidying blank lines', () => {
    const { text, removed } = removeFromLog(note, (line) => line.startsWith('Combat'));
    expect(removed).toBe(2);
    expect(text).toBe(
      [
        '# Session 15',
        '',
        '## Log',
        '',
        '- 20:06 Order of the Lantern → The Gutter Court: −2 → −3',
        '- 20:10 Rolled d20+7 → 19 (12, +7)',
        '',
        '> [!gm]',
        '> - 20:12 Rolled d20 → 4',
        '',
        '## Loot',
        '- 20:30 Rolled not a log line here',
      ].join('\n'),
    );
    expect(removeFromLog(note, (line) => line.startsWith('Rolled')).removed).toBe(1);
    expect(removeFromLog('# No log', () => true)).toEqual({ text: '# No log', removed: 0 });
  });
});
