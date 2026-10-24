import { describe, expect, it } from 'vitest';

import type { Warning } from '../src/factions/model';
import { groupWarnings, warningGroup } from '../src/factions/warning-groups';

describe('warningGroup', () => {
  it('sorts every code into what happened to the data', () => {
    expect(warningGroup('value-not-a-number')).toBe('skipped');
    expect(warningGroup('structured-without-value')).toBe('skipped');
    expect(warningGroup('self-relation')).toBe('skipped');
    expect(warningGroup('duplicate-key')).toBe('skipped');
    expect(warningGroup('value-out-of-range')).toBe('adjusted');
    expect(warningGroup('power-not-a-number')).toBe('adjusted');
    expect(warningGroup('unknown-target')).toBe('names');
    expect(warningGroup('ambiguous-key')).toBe('names');
    expect(warningGroup('missing-type')).toBe('notes');
    expect(warningGroup('campaign-ignored')).toBe('notes');
  });
});

describe('groupWarnings', () => {
  it('groups by note, then by kind in a fixed order, keeping the order within a kind', () => {
    const w = (path: string, code: Warning['code'], key?: string): Warning => ({ path, code, key });
    const grouped = groupWarnings([
      w('B.md', 'unknown-target', 'X'),
      w('A.md', 'value-out-of-range', 'P'),
      w('A.md', 'value-not-a-number', 'Q'),
      w('A.md', 'self-relation', 'R'),
    ]);
    expect(grouped.map((n) => n.path)).toEqual(['A.md', 'B.md']);
    expect(grouped[0]?.count).toBe(3);
    expect(grouped[0]?.groups.map((g) => [g.group, g.warnings.map((x) => x.key)])).toEqual([
      ['skipped', ['Q', 'R']],
      ['adjusted', ['P']],
    ]);
  });
});
