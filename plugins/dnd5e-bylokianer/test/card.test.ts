import { describe, expect, it } from 'vitest';

import { buildCard } from '../src/factions/card';
import { buildWorld } from '../src/factions/world';
import { applyOp, type EditOp } from '../src/yaml/edit';
import { loadExampleVault, noteFromText, readExampleNote } from './fixture';

const notes = loadExampleVault();
const world = buildWorld(notes);
const F = 'Silverstadt/Factions';
const CHOIR = `${F}/The Drowned Choir/factions.md`;

function card(path: string, w = world, list = notes) {
  return buildCard(path, list.find((n) => n.path === path)?.frontmatter, w);
}

describe('buildCard', () => {
  it('is null for a note that is not a faction or a character', () => {
    expect(card('Silverstadt/Campaign.md')).toBeNull();
    expect(card('Silverstadt/Quests/The Missing Bellringer.md')).toBeNull();
  });

  it('shows every entry of the Drowned Choir, broken ones with their warnings', () => {
    const choir = card(CHOIR);
    expect(choir?.kind).toBe('faction');
    const rows = choir?.sections.relations.rows ?? [];
    expect(rows.map((r) => [r.key, r.value, r.invalid, r.warnings.map((w) => w.code)])).toEqual([
      ['The Archivists', 5, null, ['value-out-of-range']],
      ['Order of the Lantern', null, 'hates', ['value-not-a-number']],
      ['The Gutter Court', -1, null, []],
      ['The Salt Kings', -2, null, ['unknown-target']],
      ['The Drowned Choir', 5, null, ['self-relation']],
      ['Sable', null, null, []],
      ['Elder Wren', null, null, ['structured-without-value']],
    ]);
    expect(rows[0]?.expect).toBe(7);
    expect(rows[3]?.targetId).toBeNull();
    expect(rows[6]?.why).toBe('[[Elder Wren]]');
    expect(choir?.power).toMatchObject({ value: 5, expect: 9 });
    expect(choir?.power?.warnings.map((w) => w.code)).toEqual(['power-out-of-range']);
    expect(choir?.nameField).toEqual({
      value: 'The Drowned Choir',
      expect: 'The Drowned Choir',
      placeholder: 'The Drowned Choir',
    });
    expect(choir?.fields.map((f) => [f.key, f.editable])).toEqual([
      ['type', true],
      ['tags', false],
    ]);
  });

  it('places a sub-faction and a member, and keeps characters to their own fields', () => {
    const bench = card(`${F}/The Gutter Court/The Bench/factions.md`);
    expect(bench?.place).toEqual(['The Gutter Court']);
    const vermillion = card(`${F}/The Gutter Court/The Bench/Lady Vermillion.md`);
    expect(vermillion?.place).toEqual(['The Gutter Court', 'The Bench']);
    expect(vermillion?.nameField).toBeNull();
    expect(vermillion?.power).toBeNull();
    expect(card('Silverstadt/Party/Orrin Quill.md')?.place).toEqual(['Party']);
  });

  it('separates the secret section', () => {
    const sable = card(`${F}/The Gutter Court/Sable.md`);
    expect(sable?.sections.secret_relations.rows.length).toBeGreaterThan(0);
    const isolde = card(`${F}/Order of the Lantern/Isolde Ferrant.md`);
    expect(isolde?.sections.relations.rows).toEqual([]);
  });

  it('gives a duplicate-key warning to the later entry only', () => {
    const list = [
      { path: 'C/Campaign.md', frontmatter: { type: 'campaign' } },
      { path: 'C/F/Watch/factions.md', frontmatter: { type: 'faction' } },
      {
        path: 'C/F/Guild/factions.md',
        frontmatter: { type: 'faction', relations: { Watch: 1, ' Watch ': 2 } },
      },
    ];
    const rows = card('C/F/Guild/factions.md', buildWorld(list), list)?.sections.relations.rows;
    expect(rows?.map((r) => [r.rawKey, r.warnings.map((w) => w.code)])).toEqual([
      ['Watch', []],
      [' Watch ', ['duplicate-key']],
    ]);
  });
});

describe('fixing the Drowned Choir through the card', () => {
  it('leaves only the legal dangling target', () => {
    const choir = card(CHOIR);
    const rows = choir?.sections.relations.rows ?? [];
    const row = (key: string) => {
      const found = rows.find((r) => r.key === key);
      if (found === undefined) throw new Error(key);
      return found;
    };
    const ops: EditOp[] = [
      {
        op: 'set-value',
        field: 'relations',
        key: 'The Archivists',
        expect: row('The Archivists').expect,
        value: 5,
      },
      {
        op: 'set-value',
        field: 'relations',
        key: 'Order of the Lantern',
        expect: 'hates',
        value: -3,
      },
      { op: 'remove-entry', field: 'relations', key: 'The Drowned Choir', expect: 5 },
      { op: 'set-value', field: 'relations', key: 'Elder Wren', expect: undefined, value: 1 },
      { op: 'set-scalar', key: 'power', expect: choir?.power?.expect, value: 5 },
    ];
    let text = readExampleNote(CHOIR);
    for (const op of ops) {
      const result = applyOp(text, op);
      expect(result.ok, op.op + ' ' + ('key' in op ? op.key : '')).toBe(true);
      if (result.ok) text = result.text;
    }
    const fixed = notes.map((n) => (n.path === CHOIR ? noteFromText(CHOIR, text) : n));
    const left = buildWorld(fixed).warnings.filter((w) => w.path === CHOIR);
    expect(left.map((w) => [w.code, w.key])).toEqual([['unknown-target', 'The Salt Kings']]);
  });
});
