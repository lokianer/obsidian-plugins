import { describe, expect, it } from 'vitest';

import { DE_NAMES } from '../src/spells/de';
import { DE_TEXTS } from '../src/spells/de-texts';
import { filterSpells, levelCounts, NO_FILTERS, readFilters } from '../src/spells/filter';
import { castingTime, components, duration, levelLine, range } from '../src/spells/meta';
import type { SrdSpell } from '../src/spells/model';
import { SRD_SPELLS } from '../src/spells/srd-spells';

const spell = (index: string) => SRD_SPELLS.find((s) => s.index === index);

describe('SRD spells', () => {
  it('holds the 319 spells of the SRD 5.1: 24 cantrips, 295 of levels 1–9', () => {
    expect(SRD_SPELLS).toHaveLength(319);
    expect(SRD_SPELLS.filter((s) => s.level === 0)).toHaveLength(24);
    expect(new Set(SRD_SPELLS.map((s) => s.index)).size).toBe(319);
  });

  it('matches the SRD on sample spells', () => {
    expect(spell('fireball')).toMatchObject({
      level: 3,
      school: 'evocation',
      casting: '1 action',
      range: '150 feet',
      components: ['V', 'S', 'M'],
      duration: 'Instantaneous',
      concentration: false,
      classes: ['sorcerer', 'wizard'],
      damage: ['fire'],
      save: 'dex',
    });
    expect(spell('fireball')?.text).toContain('8d6 fire damage');
    expect(spell('fireball')?.text).toContain('Dexterity saving throw');
    expect(spell('shield')).toMatchObject({
      level: 1,
      school: 'abjuration',
      casting: '1 reaction',
      duration: '1 round',
    });
    expect(spell('wish')).toMatchObject({ level: 9, school: 'conjuration', range: 'Self' });
    expect(spell('guidance')).toMatchObject({
      level: 0,
      school: 'divination',
      range: 'Touch',
      concentration: true,
      classes: ['cleric', 'druid'],
    });
    expect(spell('burning-hands')?.range).toBe('Self (15-foot cone)');
    expect(spell('detect-magic')).toMatchObject({ ritual: true, concentration: true });
  });

  it('keeps tables in the text as Markdown tables', () => {
    const text = spell('animate-objects')?.text ?? '';
    expect(text).toMatch(/\n\| Size \| HP \| AC .*\|\n\|/);
  });
});

describe('German names and meta', () => {
  it('names every spell in German, none twice', () => {
    const names = SRD_SPELLS.map((s) => DE_NAMES[s.index]);
    expect(names.every((n) => typeof n === 'string' && n !== '')).toBe(true);
    expect(new Set(names).size).toBe(SRD_SPELLS.length);
    expect(Object.keys(DE_NAMES)).toHaveLength(SRD_SPELLS.length);
  });

  it('writes the level line in both languages', () => {
    const fireball = spell('fireball');
    const guidance = spell('guidance');
    const alarm = spell('alarm');
    if (!fireball || !guidance || !alarm) throw new Error('missing');
    expect(levelLine(fireball, 'en')).toBe('3rd-level evocation');
    expect(levelLine(fireball, 'de')).toBe('Hervorrufung des 3. Grades');
    expect(levelLine(guidance, 'en')).toBe('Divination cantrip');
    expect(levelLine(guidance, 'de')).toBe('Zaubertrick der Erkenntnismagie');
    expect(levelLine(alarm, 'de')).toBe('Bannmagie des 1. Grades (Ritual)');
  });

  it('gives German distances in metres and translates every phrase', () => {
    const at = (index: string) => {
      const s = spell(index);
      if (!s) throw new Error(index);
      return s;
    };
    expect(range(at('fireball'), 'de')).toBe('45 m');
    expect(range(at('burning-hands'), 'de')).toBe('Selbst (4,5-m-Kegel)');
    expect(range(at('sending'), 'de')).toBe('Unbegrenzt');
    expect(castingTime(at('shield'), 'de')).toBe('1 Reaktion');
    expect(duration(at('guidance'), 'de')).toBe('Konzentration, bis zu 1 Minute');
    expect(duration(at('guidance'), 'en')).toBe('Concentration, up to 1 minute');
    expect(duration(at('fireball'), 'de')).toBe('Unmittelbar');
    expect(components(at('fireball'), 'de')).toBe('V, G, M');
    const english =
      /\b(feet|foot|mile|miles|action|minute|minutes|hour|hours|round|day|days|Self|Touch|Instantaneous|Up to|Concentration|Until)\b/;
    for (const s of SRD_SPELLS) {
      for (const phrase of [range(s, 'de'), castingTime(s, 'de'), duration(s, 'de')]) {
        expect(phrase, `${s.index}: ${phrase}`).not.toMatch(english);
      }
    }
  });
});

describe('filters', () => {
  const name = (s: SrdSpell) => s.name;

  it('combines groups with AND and values in a group with OR', () => {
    const wizard12 = filterSpells(
      SRD_SPELLS,
      { ...NO_FILTERS, levels: [1, 2], classes: ['wizard'] },
      name,
    );
    expect(wizard12.length).toBeGreaterThan(0);
    expect(
      wizard12.every((s) => (s.level === 1 || s.level === 2) && s.classes.includes('wizard')),
    ).toBe(true);
    expect(wizard12.some((s) => s.level === 1) && wizard12.some((s) => s.level === 2)).toBe(true);
    const fire = filterSpells(
      SRD_SPELLS,
      { ...NO_FILTERS, damage: ['fire'], saves: ['dex'] },
      name,
    );
    expect(fire.map((s) => s.index)).toContain('fireball');
    expect(fire.every((s) => s.damage.includes('fire') && s.save === 'dex')).toBe(true);
    const rituals = filterSpells(
      SRD_SPELLS,
      { ...NO_FILTERS, ritual: true, concentration: 'none' },
      name,
    );
    expect(rituals.every((s) => s.ritual && !s.concentration)).toBe(true);
    expect(
      filterSpells(SRD_SPELLS, { ...NO_FILTERS, casting: ['reaction'] }, name).map((s) => s.index),
    ).toContain('shield');
  });

  it('finds English and German names, ignoring case and accents', () => {
    const find = (query: string) =>
      filterSpells(SRD_SPELLS, { ...NO_FILTERS, query }, name).map((s) => s.index);
    expect(find('fireb')).toContain('fireball');
    expect(find('feuerball')).toEqual(['fireball', 'delayed-blast-fireball']);
    expect(find('saurepfeil')).toEqual(['acid-arrow']);
    expect(find('MAGISCHES geschoss')).toEqual(['magic-missile']);
  });

  it('counts each level given the other filters, and orders by level then name', () => {
    const counts = levelCounts(SRD_SPELLS, NO_FILTERS);
    expect(counts[0]).toBe(24);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(319);
    const all = filterSpells(SRD_SPELLS, NO_FILTERS, name);
    expect(all[0]?.level).toBe(0);
    expect(all[all.length - 1]?.level).toBe(9);
  });

  it('reads stored filters back, dropping what it does not know', () => {
    expect(readFilters({ levels: [1, 12, 'x'], ritual: true, concentration: 'maybe' })).toEqual({
      ...NO_FILTERS,
      levels: [1],
      ritual: true,
    });
    expect(readFilters(null)).toEqual(NO_FILTERS);
  });
});

describe('German texts', () => {
  /** Numbered dice (`8d6`, German `8W6`) as a sorted list, to compare a text with its translation. */
  const dice = (text: string, die: 'd' | 'W') =>
    [...text.matchAll(new RegExp(`\\b(\\d+)${die}(\\d+)\\b`, 'g'))]
      .map((m) => `${m[1]}d${m[2]}`)
      .sort();

  it('translates every spell: description, At Higher Levels and material where the SRD has them', () => {
    expect(Object.keys(DE_TEXTS).sort()).toEqual(SRD_SPELLS.map((s) => s.index).sort());
    for (const spell of SRD_SPELLS) {
      const de = DE_TEXTS[spell.index];
      expect(de?.text, spell.index).toBeTruthy();
      expect(Boolean(de?.higher), `${spell.index} higher`).toBe(spell.higher !== '');
      expect(Boolean(de?.material), `${spell.index} material`).toBe(spell.material !== '');
    }
  });

  it('keeps every numbered die of the English text, in German notation', () => {
    for (const spell of SRD_SPELLS) {
      const de = DE_TEXTS[spell.index];
      expect(dice(`${de?.text ?? ''} ${de?.higher ?? ''}`, 'W'), spell.index).toEqual(
        dice(`${spell.text} ${spell.higher}`, 'd'),
      );
    }
  });

  it('leaves no feet, miles or pounds in the German texts', () => {
    const imperial =
      /(?<!\p{L})(feet|foot|(?<!zu )Fuß|miles?|Meilen?|pounds?|Pfund|inch(es)?|Zoll)(?!\p{L})/u;
    for (const spell of SRD_SPELLS) {
      const de = DE_TEXTS[spell.index];
      expect(`${de?.text} ${de?.higher ?? ''} ${de?.material ?? ''}`, spell.index).not.toMatch(
        imperial,
      );
    }
  });
});
