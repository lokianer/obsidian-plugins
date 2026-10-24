import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';

import { applyOp, type EditOp } from '../src/yaml/edit';
import { formatNumber, formatString, isPlainSafe } from '../src/yaml/scalar';
import { frontmatterBody } from '../src/frontmatter';
import { readExampleNote } from './fixture';

const fm = (...lines: string[]) => ['---', ...lines, '---', '', '# Body'].join('\n');

function edit(text: string, op: EditOp): string {
  const result = applyOp(text, op);
  if (!result.ok) {
    throw new Error(`refused: ${JSON.stringify(result.refusal)}`);
  }
  return result.text;
}

function refusal(text: string, op: EditOp) {
  const result = applyOp(text, op);
  return result.ok ? null : result.refusal;
}

const data = (text: string) => parse(frontmatterBody(text) ?? '') as Record<string, unknown>;

describe('scalar', () => {
  it('writes plain only what reads back as the same string', () => {
    expect(isPlainSafe('Order of the Lantern')).toBe(true);
    expect(isPlainSafe("Ilka's Crew")).toBe(true);
    for (const text of ['yes', 'Null', '3rd Watch', 'A: B', '[[X]]', 'a #b', ' x', 'x ', '']) {
      expect(isPlainSafe(text), text).toBe(false);
    }
    expect(formatString('[[Session 11 – Under the Lantern Bridge]]')).toBe(
      '"[[Session 11 – Under the Lantern Bridge]]"',
    );
    expect(formatNumber(-3)).toBe('-3');
    expect(formatNumber(2, '"')).toBe('"2"');
  });
});

describe('set-value', () => {
  const op = (key: string, expect: EditOp extends never ? never : unknown, value: number) =>
    ({ op: 'set-value', field: 'relations', key, expect, value }) as EditOp;

  it('changes the number token only, keeping quotes and comments', () => {
    const text = fm('relations:', '  A: 7 # clamp', '  B: "-1"', '  C:');
    expect(edit(text, op('A', 7, 5))).toBe(fm('relations:', '  A: 5 # clamp', '  B: "-1"', '  C:'));
    expect(edit(text, op('B', '-1', -2))).toBe(
      fm('relations:', '  A: 7 # clamp', '  B: "-2"', '  C:'),
    );
    expect(edit(text, op('C', null, 3))).toBe(
      fm('relations:', '  A: 7 # clamp', '  B: "-1"', '  C: 3'),
    );
  });

  it('replaces a value that is not a number as a whole', () => {
    expect(edit(fm('relations:', '  A: hates'), op('A', 'hates', -4))).toBe(
      fm('relations:', '  A: -4'),
    );
  });

  it('edits the value line of a structured entry, or adds one', () => {
    const text = fm(
      'relations:',
      '  A:',
      '    value: -3',
      '    why: "[[X]]"',
      '  B:',
      '    why: x',
    );
    expect(edit(text, op('A', -3, -2))).toBe(
      fm('relations:', '  A:', '    value: -2', '    why: "[[X]]"', '  B:', '    why: x'),
    );
    expect(edit(text, op('B', undefined, 1))).toBe(
      fm(
        'relations:',
        '  A:',
        '    value: -3',
        '    why: "[[X]]"',
        '  B:',
        '    value: 1',
        '    why: x',
      ),
    );
  });

  it('accepts what the parsed frontmatter says about the same number', () => {
    expect(edit(fm('relations:', '  A: +7'), op('A', 7, 5))).toBe(fm('relations:', '  A: 5'));
    expect(edit(fm('relations:', '  A: "−3"'), op('A', '−3', -2))).toBe(
      fm('relations:', '  A: "-2"'),
    );
  });

  it('refuses when the note changed, or the entry is gone or odd', () => {
    const text = fm('relations:', '  A: 2', '  B: [1]');
    expect(refusal(text, op('A', 3, 1))).toEqual({ code: 'changed' });
    expect(refusal(text, op('Z', 3, 1))).toEqual({ code: 'not-found' });
    expect(refusal(text, op('B', 1, 1))).toEqual({ code: 'unsupported', reason: 'flow' });
    expect(refusal(fm('relations: { A: 2 }'), op('A', 2, 1))).toEqual({
      code: 'unsupported',
      reason: 'flow',
    });
  });

  it('edits raw keys apart that only trimming makes equal', () => {
    const text = fm('relations:', '  Sable: 2', '  " Sable ": -4');
    expect(edit(text, op(' Sable ', -4, 1))).toBe(fm('relations:', '  Sable: 2', '  " Sable ": 1'));
    expect(edit(text, { op: 'remove-entry', field: 'relations', key: 'Sable', expect: 2 })).toBe(
      fm('relations:', '  " Sable ": -4'),
    );
  });
});

describe('set-why', () => {
  const op = (key: string, expect: unknown, why: string | null) =>
    ({ op: 'set-why', field: 'relations', key, expect, why }) as EditOp;

  it('turns a plain entry into the structured form, keeping its comment', () => {
    expect(edit(fm('relations:', '  A: -3 # old grudge'), op('A', undefined, '[[S 11]]'))).toBe(
      fm('relations:', '  A: # old grudge', '    value: -3', '    why: "[[S 11]]"'),
    );
  });

  it('replaces, adds and clears the why of a structured entry', () => {
    const text = fm('relations:', '  A:', '    value: 1', '    why: "[[X]]"');
    expect(edit(text, op('A', '[[X]]', '[[Y]]'))).toBe(
      fm('relations:', '  A:', '    value: 1', '    why: "[[Y]]"'),
    );
    expect(edit(text, op('A', '[[X]]', null))).toBe(fm('relations:', '  A:', '    value: 1'));
    expect(edit(fm('relations:', '  A:', '    value: 1'), op('A', undefined, 'bribe'))).toBe(
      fm('relations:', '  A:', '    value: 1', '    why: bribe'),
    );
  });
});

describe('add-entry', () => {
  const op = (key: string, value: number, field = 'relations') =>
    ({ op: 'add-entry', field, key, value }) as EditOp;

  it('appends after the last entry, at the block indent', () => {
    expect(
      edit(fm('relations:', '    A: 1', '    B:', '      value: 2', 'tags: []'), op('C', 0)),
    ).toBe(fm('relations:', '    A: 1', '    B:', '      value: 2', '    C: 0', 'tags: []'));
  });

  it('creates the block before tags, or at the end', () => {
    expect(
      edit(fm('type: npc', 'tags:', '  - npc'), op('The Archivists', -1, 'secret_relations')),
    ).toBe(fm('type: npc', 'secret_relations:', '  The Archivists: -1', 'tags:', '  - npc'));
    expect(edit(fm('type: npc'), op('[[Odd]]', 2))).toBe(
      fm('type: npc', 'relations:', '  "[[Odd]]": 2'),
    );
  });

  it('replaces the template’s relations: {}', () => {
    expect(edit(fm('relations: {} # fill in', 'tags: []'), op('A', 1))).toBe(
      fm('relations: # fill in', '  A: 1', 'tags: []'),
    );
  });

  it('refuses a key that is already there', () => {
    expect(refusal(fm('relations:', '  A: 1'), op('A', 2))).toEqual({ code: 'exists' });
  });

  it('keeps CRLF line endings', () => {
    const text = '---\r\ntype: npc\r\n---\r\nBody\r\n';
    expect(edit(text, op('A', 1))).toBe(
      '---\r\ntype: npc\r\nrelations:\r\n  A: 1\r\n---\r\nBody\r\n',
    );
  });

  it('creates a frontmatter block when the note has none', () => {
    expect(edit('# Guild\n', op('A', 1))).toBe('---\nrelations:\n  A: 1\n---\n# Guild\n');
  });
});

describe('remove-entry and rename-entry', () => {
  it('removes an entry with its deeper lines, comments of others untouched', () => {
    const text = fm('relations:', '  # keep me', '  A:', '    value: 1', '    why: x', '  B: 2');
    expect(edit(text, { op: 'remove-entry', field: 'relations', key: 'A', expect: 1 })).toBe(
      fm('relations:', '  # keep me', '  B: 2'),
    );
  });

  it('removes even an entry it cannot otherwise edit', () => {
    expect(
      edit(fm('relations:', '  A: [1]', '  B: 2'), {
        op: 'remove-entry',
        field: 'relations',
        key: 'A',
        expect: null,
      }),
    ).toBe(fm('relations:', '  B: 2'));
  });

  it('renames the key text only', () => {
    const op: EditOp = {
      op: 'rename-entry',
      field: 'relations',
      key: 'Salt',
      expect: -2,
      to: 'The Salt Kings',
    };
    expect(edit(fm('relations:', '  Salt: -2 # who?'), op)).toBe(
      fm('relations:', '  The Salt Kings: -2 # who?'),
    );
    expect(refusal(fm('relations:', '  Salt: -2', '  The Salt Kings: 1'), op)).toEqual({
      code: 'exists',
    });
  });
});

describe('set-scalar and remove-scalar', () => {
  it('sets an existing scalar in its quote style, keeping the comment', () => {
    const text = fm('name: "The Bench" # display', 'power: 9 # clamp');
    expect(edit(text, { op: 'set-scalar', key: 'power', expect: 9, value: 5 })).toBe(
      fm('name: "The Bench" # display', 'power: 5 # clamp'),
    );
    expect(edit(text, { op: 'set-scalar', key: 'name', expect: 'The Bench', value: 'Bench' })).toBe(
      fm('name: "Bench" # display', 'power: 9 # clamp'),
    );
  });

  it('adds a missing scalar before tags', () => {
    expect(
      edit(fm('relations:', '  A: 1', 'tags: []'), {
        op: 'set-scalar',
        key: 'type',
        expect: undefined,
        value: 'faction',
      }),
    ).toBe(fm('relations:', '  A: 1', 'type: faction', 'tags: []'));
    expect(edit('', { op: 'set-scalar', key: 'type', expect: undefined, value: 'faction' })).toBe(
      '---\ntype: faction\n---\n',
    );
  });

  it('refuses a list or a value that changed', () => {
    const text = fm('tags:', '  - a', 'power: 3');
    expect(refusal(text, { op: 'set-scalar', key: 'tags', expect: null, value: 'x' })).toEqual({
      code: 'unsupported',
      reason: 'nested',
    });
    expect(refusal(text, { op: 'set-scalar', key: 'power', expect: 4, value: 2 })).toEqual({
      code: 'changed',
    });
    expect(refusal(text, { op: 'set-scalar', key: 'name', expect: 'X', value: 'Y' })).toEqual({
      code: 'changed',
    });
  });

  it('removes a scalar line', () => {
    expect(edit(fm('name: X', 'power: 3'), { op: 'remove-scalar', key: 'name', expect: 'X' })).toBe(
      fm('power: 3'),
    );
  });
});

describe('the Drowned Choir', () => {
  const path = 'Silverstadt/Factions/The Drowned Choir/factions.md';
  const text = readExampleNote(path);
  const before = data(text).relations as Record<string, unknown>;

  it('sets each entry to 0, changing nothing but that entry', () => {
    for (const [key, raw] of Object.entries(before)) {
      const expectValue =
        raw !== null && typeof raw === 'object' ? (raw as { value?: unknown }).value : raw;
      const after = edit(text, {
        op: 'set-value',
        field: 'relations',
        key,
        expect: expectValue as string | number | null | undefined,
        value: 0,
      });
      const relations = data(after).relations as Record<string, unknown>;
      for (const [other, value] of Object.entries(before)) {
        if (other === key) {
          const read = relations[key];
          const number =
            typeof read === 'object' && read !== null ? (read as { value: unknown }).value : read;
          expect(Number(number), key).toBe(0);
        } else {
          expect(relations[other], `${key} → ${other}`).toEqual(value);
        }
      }
      const a = text.split('\n');
      const b = after.split('\n');
      if (a.length === b.length) {
        expect(
          b.filter((line, i) => line !== a[i]),
          key,
        ).toHaveLength(1);
      } else {
        // One inserted `value:` line, everything else in place.
        expect(b.length, key).toBe(a.length + 1);
        const at = b.findIndex((line, i) => line !== a[i]);
        expect([...b.slice(0, at), ...b.slice(at + 1)], key).toEqual(a);
      }
      const comments = (s: string) => s.split('\n').filter((l) => l.trim().startsWith('#'));
      expect(comments(after)).toEqual(comments(text));
    }
  });
});
