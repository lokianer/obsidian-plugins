import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  abilityCheckName,
  characterBonuses,
  checks,
  saveName,
  skillName,
} from '../src/dice/checks';
import {
  criticalFormula,
  isDiceLine,
  keptD20,
  parseFormula,
  roll,
  rollDie,
  rollLine,
} from '../src/dice/formula';
import { rollParts } from '../src/dice/statblock';
import { tableCells } from '../src/markdown/table';
import { findTable, rollableTables, rowFor, tableLine } from '../src/dice/tables';
import type { Statblock } from '../src/npc/statblock';

/** Random numbers giving these faces on the dice rolled, in order (any number of sides). */
const faces = (...values: number[]) => {
  let sides = 20;
  const queue = [...values];
  const random = () => {
    const v = queue.shift() ?? 1;
    return (v - 0.5) / sides;
  };
  return { random, sides: (n: number) => (sides = n) };
};
/** A random source for dice of one kind. */
const of = (sides: number, ...values: number[]) => {
  const f = faces(...values);
  f.sides(sides);
  return f.random;
};

describe('dice formulas', () => {
  it('rolls sums of dice and numbers and writes the roll as the log does', () => {
    expect(roll('d20+7', of(20, 5))).toMatchObject({
      formula: 'd20+7',
      total: 12,
      text: 'd20+7 → 12 (5, +7)',
      numbers: ['+7'],
    });
    expect(roll('2d6 + 3', of(6, 4, 3))?.text).toBe('2d6+3 → 10 (4, 3, +3)');
    expect(roll('1d8+2d6-1', of(8, 8, 1, 1))?.total).toBe(8 + 1 + 1 - 1);
    expect(roll('d20', of(20, 17))?.text).toBe('d20 → 17');
    expect(roll('W20+2', of(20, 3))?.formula).toBe('d20+2');
    expect(roll('2w6', of(6, 2, 2))?.total).toBe(4);
    expect(roll('d%', of(100, 37))).toMatchObject({ formula: 'd100', total: 37 });
    expect(roll('(2d6+3)*2', of(6, 1, 2))?.total).toBe(12);
    expect(roll('10/3', Math.random)?.total).toBe(3);
    expect(roll('-d4+5', of(4, 3))?.text).toBe('-d4+5 → 2 (-3, +5)');
  });

  it('keeps and drops dice, and rolls advantage and disadvantage', () => {
    const fourD6 = roll('4d6kh3', of(6, 6, 1, 4, 3));
    expect(fourD6?.total).toBe(13);
    expect(fourD6?.dice.map((d) => d.kept)).toEqual([true, false, true, true]);
    expect(fourD6?.text).toBe('4d6kh3 → 13 (6, [1], 4, 3)');
    expect(roll('4d6dl1', of(6, 6, 1, 4, 3))?.total).toBe(13);
    expect(roll('2d20kl1', of(20, 15, 4))?.total).toBe(4);
    expect(roll('2d20k1', of(20, 15, 4))?.total).toBe(15);
    expect(roll('4d6dh1', of(6, 6, 1, 4, 3))?.total).toBe(8);
    const adv = roll('d20+5 adv', of(20, 7, 16));
    expect(adv).toMatchObject({ formula: '2d20kh1+5', total: 21 });
    expect(adv?.text).toBe('2d20kh1+5 → 21 ([7], 16, +5)');
    expect(roll('W20 Nachteil', of(20, 7, 16))?.total).toBe(7);
    expect(roll('d20 Vorteil', of(20, 7, 16))?.total).toBe(16);
  });

  it('reads nothing that is no formula, so other grammars stay untouched', () => {
    for (const text of [
      '',
      'hello',
      '1d6!',
      '2d6r1',
      'd1',
      '0d6',
      '101d6',
      '4d6kh5',
      '2d6+',
      '((d6)',
      'd6 adv',
      '[[Street Rumours]]',
    ]) {
      expect(parseFormula(text), text).toBeNull();
    }
  });

  it('finds the kept d20 for natural 20s and 1s', () => {
    const r = roll('d20+3', of(20, 20));
    if (r === null) throw new Error('no roll');
    expect(keptD20(r)).toBe(20);
    const adv = roll('d20 adv', of(20, 1, 12));
    if (adv === null) throw new Error('no roll');
    expect(keptD20(adv)).toBe(12);
    const two = roll('2d20', of(20, 1, 12));
    if (two === null) throw new Error('no roll');
    expect(keptD20(two)).toBeNull();
    expect(rollDie(6, () => 0.9999999)).toBe(6);
    expect(rollDie(6, () => 0)).toBe(1);
  });
});

describe('rollable tables', () => {
  const rumours = readFileSync(
    join(import.meta.dirname, '../../../examples/vault/Silverstadt/Tables/Street Rumours.md'),
    'utf8',
  );

  it('reads the example vault’s three tables: a list, ranges with both dashes, a gap', () => {
    const tables = rollableTables(rumours);
    expect(tables.map((t) => [t.heading, t.formula, t.rows.length])).toEqual([
      ['Rumours on Lantern Quay (d6)', 'd6', 6],
      ['Weather on the estuary (1d8)', '1d8', 5],
      ['Night on Lantern Quay (d20)', 'd20', 5],
    ]);
    const [list, weather, night] = tables;
    if (list === undefined || weather === undefined || night === undefined)
      throw new Error('tables');
    expect(rowFor(list, 2)?.text).toBe(
      "[[Mira Voss]] bought the burnt Archive's east wing for one silver",
    );
    expect(rowFor(weather, 3)).toEqual({ from: 2, to: 4, text: 'Grey and dry' });
    expect(rowFor(weather, 6)?.text).toBe('Rain, and the [[Lantern Bridge]] slick');
    expect(rowFor(night, 11)?.text).toBe('[[Sable]] on a rooftop, pretending not to see you');
    expect(rowFor(night, 14)).toBeNull();
    expect(tableLine(night, 14, null)).toBe('Rolled Night on Lantern Quay (d20): 14 → no row');
    expect(tableLine(night, 20, rowFor(night, 20))).toBe(
      'Rolled Night on Lantern Quay (d20): 20 → The bridge bell rings',
    );
  });

  it('finds a table by heading or takes the first, and ignores headings without a die', () => {
    const text = [
      '# Loot',
      '- not rollable',
      '## Coins (2d6)',
      'Some words first.',
      '',
      '1. A copper',
      '2. A silver',
      '   (worn thin)',
      '3. A gold',
      '### Gems (W4)',
      '| W4 | Gem | Worth |',
      '| --- | --- | --- |',
      '| 1-2 | Agate | 10 gp |',
      '| 3–4 | Pearl | 100 gp |',
      '## Empty (d6)',
      '## Bad (d1)',
      '- x',
    ].join('\n');
    const tables = rollableTables(text);
    expect(tables.map((t) => t.heading)).toEqual(['Coins (2d6)', 'Gems (W4)']);
    expect(tables[0]?.rows.map((r) => r.text)).toEqual(['A copper', 'A silver', 'A gold']);
    expect(tables[1]?.formula).toBe('d4');
    expect(tables[1]?.rows[1]).toEqual({ from: 3, to: 4, text: 'Pearl — 100 gp' });
    expect(findTable(tables, 'gems  (w4)')?.heading).toBe('Gems (W4)');
    expect(findTable(tables, null)?.heading).toBe('Coins (2d6)');
    expect(findTable(tables, 'Nothing')).toBeNull();
  });
});

describe('markdown table cells', () => {
  it('splits a row, keeping escaped pipes inside a cell', () => {
    expect(tableCells('| 1–6 | Fog \\| rain | [[Sable]] |')).toEqual([
      '1–6',
      'Fog | rain',
      '[[Sable]]',
    ]);
    expect(tableCells('a | b')).toEqual(['a', 'b']);
  });
});

describe('rolls from stat blocks and characters', () => {
  it('finds attack bonuses and damage in English and German entries, not DCs', () => {
    const en =
      'Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. Hit: 10 (1d10 + 5) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 18 (4d8) poison damage.';
    expect(rollParts(en).map((p) => [p.kind, p.formula, en.slice(p.start, p.end)])).toEqual([
      ['attack', 'd20+7', '+7'],
      ['damage', '1d10+5', '10 (1d10 + 5)'],
      ['damage', '4d8', '18 (4d8)'],
    ]);
    const de =
      'Nahkampf-Waffenangriff: −1 auf Treffer, Reichweite 1,5 m. Treffer: 3 (1W6 − 1) Wuchtschaden.';
    expect(rollParts(de).map((p) => p.formula)).toEqual(['d20-1', '1d6-1']);
    expect(
      rollParts('Melee Attack Roll: +4, reach 5 ft. Hit: 1 piercing damage.').map((p) => p.formula),
    ).toEqual(['d20+4']);
  });

  it('reads a character from frontmatter, else its stat block, with names per language', () => {
    const fm = { saves: { dex: 5, wis: 2 }, skills: { persuasion: 7, sleight_of_hand: 4 } };
    const bonuses = characterBonuses(fm, null);
    expect(
      checks('Orrin Quill', bonuses, 'de').map((c) => [c.label, c.subject, c.formula]),
    ).toEqual([
      ['Orrin Quill: Geschicklichkeitsrettungswurf', 'Orrin Quill rolls Dexterity save', 'd20+5'],
      ['Orrin Quill: Weisheitsrettungswurf', 'Orrin Quill rolls Wisdom save', 'd20+2'],
      ['Orrin Quill: Überzeugen', 'Orrin Quill rolls Persuasion', 'd20+7'],
      ['Orrin Quill: Fingerfertigkeit', 'Orrin Quill rolls Sleight of Hand', 'd20+4'],
    ]);
    const block = { saves: [{ key: 'con', bonus: 4 }], skills: [] } as unknown as Statblock;
    expect(characterBonuses({}, block).saves).toEqual([{ key: 'con', bonus: 4 }]);
    expect(saveName('Ges', 'de')).toBe('Geschicklichkeitsrettungswurf');
    expect(skillName('Wahrnehmung', 'en')).toBe('Wahrnehmung');
    const r = roll('d20+7', of(20, 5));
    expect(r && rollLine(r, null, 'Orrin Quill rolls Persuasion')).toBe(
      'Orrin Quill rolls Persuasion: d20+7 → 12 (5, +7)',
    );
  });
});

describe('rollable tables, indented lists', () => {
  it('reads an indented list, its deeper lines belonging to the item above', () => {
    const text = '## Omens (d3)\n\n  - A crow\n    on the gate\n  - Rain\n  - Bells\n\nAfter.';
    expect(rollableTables(text)[0]?.rows.map((r) => r.text)).toEqual(['A crow', 'Rain', 'Bells']);
  });
});

describe('critical hits and ability checks (R4)', () => {
  it('doubles the dice of a critical hit, not the numbers', () => {
    expect(criticalFormula('1d10+5')).toBe('2d10+5');
    expect(criticalFormula('2d8 + 1d6 + 3')).toBe('4d8+2d6+3');
    expect(criticalFormula('4d6kh3')).toBe('8d6kh6');
    expect(criticalFormula('hello')).toBeNull();
  });

  it('names ability checks in English and German', () => {
    expect([0, 1, 5].map((i) => abilityCheckName(i, 'en'))).toEqual([
      'Strength check',
      'Dexterity check',
      'Charisma check',
    ]);
    expect([0, 1, 2].map((i) => abilityCheckName(i, 'de'))).toEqual([
      'Stärkewurf',
      'Geschicklichkeitswurf',
      'Konstitutionswurf',
    ]);
  });
});

describe('dice lines in the log', () => {
  it('tells roll lines from other log lines', () => {
    expect(isDiceLine('Rolled d20+7 → 19 (12, +7) against DC 15: success')).toBe(true);
    expect(isDiceLine('Rolled Night on Lantern Quay (d20): 11 → [[Sable]] on a rooftop')).toBe(
      true,
    );
    expect(isDiceLine('Orrin Quill rolls Persuasion: d20+7 → 12 (5, +7)')).toBe(true);
    expect(isDiceLine('Owlbear rolls Beak damage (critical): 2d10+5 → 17 (4, 8, +5)')).toBe(true);
    expect(isDiceLine('Order of the Lantern → The Gutter Court: −2 → −3')).toBe(false);
    expect(isDiceLine('Combat begins: [[Ambush]]')).toBe(false);
  });
});
