import { describe, expect, it } from 'vitest';

import {
  type Entry,
  fieldBlock,
  frontmatterRange,
  joinLines,
  parseKeyLine,
  splitLines,
  topLevelKeys,
} from '../src/yaml/lines';
import { loadExampleVault, readExampleNote } from './fixture';

function block(text: string, field = 'relations') {
  const { lines } = splitLines(text);
  const range = frontmatterRange(lines);
  if (range === null) {
    throw new Error('no frontmatter');
  }
  return fieldBlock(lines, range, field);
}

const keys = (entries: Entry[]) => entries.map((e) => e.rawKey);

describe('splitLines', () => {
  it('keeps the line ending and a BOM for the way back', () => {
    for (const text of ['a\nb\n', 'a\r\nb\r\n', '\uFEFF---\r\nx: 1\r\n---\r\n']) {
      expect(joinLines(splitLines(text))).toBe(text);
    }
    expect(splitLines('a\r\nb').eol).toBe('\r\n');
    expect(splitLines('\uFEFFa').lines).toEqual(['a']);
  });
});

describe('frontmatterRange', () => {
  it('finds the two --- lines, only at the top', () => {
    expect(frontmatterRange(['---', 'a: 1', '---', 'text'])).toEqual({ open: 0, close: 2 });
    expect(frontmatterRange(['text', '---', 'a: 1', '---'])).toBeNull();
    expect(frontmatterRange(['---', 'a: 1'])).toBeNull();
  });
});

describe('parseKeyLine', () => {
  it('splits key, value token and comment', () => {
    expect(parseKeyLine('  The Archivists: 7 # clamp')).toMatchObject({
      indent: 2,
      key: 'The Archivists',
      token: '7',
      comment: ' # clamp',
      quote: null,
    });
    expect(parseKeyLine('Court: "-1"')).toMatchObject({ token: '"-1"', quote: '"' });
    expect(parseKeyLine('" Sable ": 2')).toMatchObject({ key: ' Sable ', token: '2' });
    expect(parseKeyLine("'It''s': x")).toMatchObject({ key: "It's", token: 'x' });
    expect(parseKeyLine('why: "[[A # B]]" # c')).toMatchObject({
      token: '"[[A # B]]"',
      comment: ' # c',
    });
    expect(parseKeyLine('Sable:')).toMatchObject({ key: 'Sable', token: '', comment: '' });
    expect(parseKeyLine('url: http://x#y')).toMatchObject({ token: 'http://x#y' });
  });

  it('is null for what is not a key line', () => {
    expect(parseKeyLine('  - faction')).toBeNull();
    expect(parseKeyLine('# comment')).toBeNull();
    expect(parseKeyLine('just text')).toBeNull();
  });
});

describe('topLevelKeys', () => {
  it('lists keys with the lines that belong to them', () => {
    const { lines } = splitLines('---\ntype: npc\nrelations:\n  A: 1\n\n  B: 2\ntags:\n- x\n---');
    const range = frontmatterRange(lines);
    expect(range).not.toBeNull();
    expect(
      topLevelKeys(lines, range ?? { open: 0, close: 0 }).map((k) => [k.key, k.line, k.last]),
    ).toEqual([
      ['type', 1, 1],
      ['relations', 2, 5],
      ['tags', 6, 7],
    ]);
  });
});

describe('fieldBlock', () => {
  it('reads plain and structured entries', () => {
    const b = block('---\nrelations:\n  A: 1\n  B:\n    value: -3\n    why: "[[X]]"\n  C:\n---');
    expect(b.kind).toBe('block');
    if (b.kind !== 'block') return;
    expect(b.indent).toBe(2);
    expect(
      b.entries.map((e) => [e.rawKey, e.form, e.line, e.last, e.value?.line, e.why?.line]),
    ).toEqual([
      ['A', 'plain', 2, 2, undefined, undefined],
      ['B', 'structured', 3, 5, 4, 5],
      ['C', 'plain', 6, 6, undefined, undefined],
    ]);
  });

  it('tells none, empty flow and an empty block apart', () => {
    expect(block('---\ntype: npc\n---').kind).toBe('none');
    expect(block('---\nrelations: {}\n---').kind).toBe('empty-flow');
    const empty = block('---\nrelations:\ntags: []\n---');
    expect(empty.kind === 'block' && empty.entries).toEqual([]);
  });

  it('reports what it does not edit', () => {
    const reason = (text: string) => {
      const b = block(text);
      return b.kind === 'unsupported' ? b.reason : b.kind;
    };
    expect(reason('---\nrelations: { A: 1 }\n---')).toBe('flow');
    expect(reason('---\nrelations: &r\n  A: 1\n---')).toBe('anchor');
    expect(reason('---\nrelations: 3\n---')).toBe('not-a-map');
    expect(reason('---\nrelations:\n  - A\n---')).toBe('not-a-map');
    expect(reason('---\nrelations:\n\tA: 1\n---')).toBe('tabs');
    expect(reason('---\nrelations:\n    A: 1\n  B: 2\n---')).toBe('indent');
    expect(reason('---\nrelations:\n  A: 1\nrelations:\n  B: 2\n---')).toBe('duplicate');
  });

  it('marks single entries it does not edit, and keeps the others editable', () => {
    const b = block(
      '---\nrelations:\n  A: [1]\n  B:\n    value: 1\n    note: x\n  C: 2\n  C: 3\n  D: 4\n---',
    );
    if (b.kind !== 'block') throw new Error(b.kind);
    expect(b.entries.map((e) => [e.rawKey, e.unsupported])).toEqual([
      ['A', 'flow'],
      ['B', 'nested'],
      ['C', 'duplicate'],
      ['C', 'duplicate'],
      ['D', undefined],
    ]);
  });

  it('keeps raw keys apart that only trimming makes equal', () => {
    const b = block('---\nrelations:\n  Sable: 2\n  " Sable ": -4\n---');
    expect(b.kind === 'block' && keys(b.entries)).toEqual(['Sable', ' Sable ']);
  });
});

describe('fieldBlock on the example vault', () => {
  it('locates every relation entry of every note, with the parsed keys', () => {
    for (const note of loadExampleVault()) {
      const fm = note.frontmatter;
      if (fm === undefined) continue;
      for (const field of ['relations', 'secret_relations'] as const) {
        const raw = fm[field];
        if (raw === undefined) continue;
        const b = block(readExampleNote(note.path), field);
        if (Object.keys(raw as object).length === 0 && b.kind === 'empty-flow') continue;
        expect(b.kind, `${note.path} ${field}`).toBe('block');
        if (b.kind !== 'block') continue;
        expect(keys(b.entries), note.path).toEqual(Object.keys(raw as object));
        expect(
          b.entries.filter((e) => e.unsupported !== undefined),
          note.path,
        ).toEqual([]);
      }
    }
  });
});
