import { describe, expect, it } from 'vitest';

import { buildMatrix } from '../src/factions/matrix';
import { buildWorld } from '../src/factions/world';
import { loadExampleVault, withoutSecrets } from './fixture';

const world = buildWorld(loadExampleVault());
const F = 'Silverstadt/Factions';
const ORDER = `${F}/Order of the Lantern`;
const COURT = `${F}/The Gutter Court`;
const BENCH = `${COURT}/The Bench`;

function cell(mode: 'public' | 'true', row: string, column: string) {
  const m = buildMatrix(world, mode);
  const r = m.rows.findIndex((x) => x.id === row);
  const c = m.columns.findIndex((x) => x.id === column);
  return m.cells[r]?.[c];
}

describe('buildMatrix', () => {
  const matrix = buildMatrix(world, 'public');

  it('lists sub-factions under their parent, then the Party and Unaffiliated', () => {
    const names = matrix.rows.map((r) => (r.kind === 'group' ? `[${r.name}]` : r.name));
    expect(names.indexOf('The Bench')).toBe(names.indexOf('The Gutter Court') + 1);
    expect(matrix.rows.find((r) => r.id === BENCH)).toMatchObject({ depth: 1 });
    expect(names).toContain('[Party]');
    expect(names.indexOf('Ilex')).toBe(names.indexOf('[Party]') + 1);
    // A character without a stance towards any faction would only be an empty row.
    expect(names).not.toContain('Orrin Quill');
    expect(names.slice(-2)).toEqual(['[Unaffiliated]', 'Elder Wren']);
    expect(matrix.columns[matrix.columns.length - 1]).toMatchObject({
      name: 'The Salt Kings',
      ghost: true,
    });
  });

  it('shows the Bench inheriting the Court’s face, and its own true stance', () => {
    expect(cell('public', BENCH, ORDER)).toMatchObject({
      kind: 'value',
      value: -4,
      inheritedFrom: 'The Gutter Court',
    });
    expect(cell('true', BENCH, ORDER)).toMatchObject({
      value: 4,
      inheritedFrom: null,
      differs: true,
    });
  });

  it('leaves the diagonal blank and offers to add where there is no relation', () => {
    expect(cell('public', ORDER, ORDER)).toEqual({ kind: 'none' });
    const empty = matrix.cells.flat().find((c) => c.kind === 'empty');
    expect(empty).toEqual({ kind: 'empty' });
  });

  it('shows nothing secret in Public mode', () => {
    expect(buildMatrix(withoutSecrets(world), 'public')).toEqual(matrix);
  });
});
