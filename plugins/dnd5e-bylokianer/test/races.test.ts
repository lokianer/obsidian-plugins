import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import { applyRace, ownRace, raceNote, rollAge, rollLooks, searchRaces } from '../src/npc/races';
import { SRD_NPCS } from '../src/npc/srd';
import { SRD_RACES } from '../src/npc/srd-races';
import { parseStatblock } from '../src/npc/statblock';
import { frontmatterOf, readExampleNote } from './fixture';

const race = (name: string) => {
  const found = SRD_RACES.find((r) => r.name === name);
  if (found === undefined) throw new Error(name);
  return found;
};
const npc = (name: string) => SRD_NPCS.find((a) => a.name === name)?.yaml ?? '';
const read = (yaml: string) => parseStatblock(parse(yaml));

describe('SRD races', () => {
  it('has the nine SRD races with names and looks in both languages', () => {
    expect(SRD_RACES.map((r) => r.name)).toEqual([
      'Dwarf',
      'Elf',
      'Halfling',
      'Human',
      'Dragonborn',
      'Gnome',
      'Half-Elf',
      'Half-Orc',
      'Tiefling',
    ]);
    for (const r of SRD_RACES) {
      expect(r.names.length).toBeGreaterThanOrEqual(12);
      expect(r.familyNames.length).toBeGreaterThanOrEqual(12);
      expect(r.looks.en?.hair.length).toBe(r.looks.de?.hair.length);
      expect(r.looks.en?.eyes.length).toBe(r.looks.de?.eyes.length);
      expect(r.looks.en?.skin.length).toBe(r.looks.de?.skin.length);
    }
  });
});

describe('applyRace', () => {
  it('writes a hill dwarf into a guard: size, speed, darkvision, languages, resistance, traits', () => {
    const block = read(applyRace(npc('Guard'), race('Dwarf'), parse));
    expect(block).toMatchObject({
      size: 'Medium',
      speed: '25 ft.',
      subtype: 'dwarf',
      senses: 'darkvision 60 ft., passive Perception 12',
      languages: 'Common, Dwarvish',
      damageResistances: 'poison',
      ac: 16,
      hp: 11,
      stats: [13, 12, 12, 10, 11, 10],
    });
    expect(block.traits.map((t) => t.name)).toEqual([
      'Dwarven Resilience',
      'Stonecunning',
      'Dwarven Toughness',
    ]);
    expect(block.unreadable).toEqual([]);
  });

  it('merges without duplicates and keeps what the block already has', () => {
    const halfling = read(applyRace(npc('Spy'), race('Halfling'), parse));
    expect(halfling.size).toBe('Small');
    expect(halfling.languages).toBe('Common, Halfling');
    const twice = applyRace(
      applyRace(npc('Acolyte'), race('Tiefling'), parse),
      race('Tiefling'),
      parse,
    );
    const tiefling = read(twice);
    expect(tiefling.senses).toBe('darkvision 60 ft., passive Perception 12');
    expect(tiefling.traits.filter((t) => t.name === 'Hellish Resistance')).toHaveLength(1);
    expect(tiefling.damageResistances).toBe('fire');
    const human = read(applyRace(npc('Noble'), race('Human'), parse));
    expect(human.traits).toEqual(read(npc('Noble')).traits);
  });
});

describe('own races', () => {
  const note = [
    '---',
    'type: race',
    'size: small',
    'speed: 25 ft.',
    'darkvision: 30',
    'languages: [Common, Aquan]',
    'resistances: cold',
    'age: 16-90',
    '---',
    '# Tideborn',
    '## Traits',
    '- **Amphibious.** Breathes air and water.',
    '- Tide Sense: Knows the hour of the tide.',
    '## Names',
    '- Ondra',
    '- Lir',
  ].join('\n');

  it('reads a race note: frontmatter, traits and names, the rest from a fallback race', () => {
    const own = ownRace(
      'Templates/Races/Tideborn.md',
      note,
      parse(note.split('---')[1] ?? '') as Record<string, unknown>,
      race('Human'),
    );
    expect(own).toMatchObject({
      name: 'Tideborn',
      size: 'Small',
      speed: 25,
      darkvision: 30,
      languages: ['Common', 'Aquan'],
      resistances: ['cold'],
      age: [16, 90],
      names: ['Ondra', 'Lir'],
      familyNames: race('Human').familyNames,
      traits: [
        { name: 'Amphibious', desc: 'Breathes air and water.' },
        { name: 'Tide Sense', desc: 'Knows the hour of the tide.' },
      ],
    });
    expect(ownRace('x.md', '# none', {}, race('Human'))).toEqual({
      path: 'x.md',
      problem: 'no-traits',
    });
  });

  it('writes a race note from a base race that reads back the same', () => {
    const text = raceNote('Deep Dwarf', race('Dwarf'), 'A race.');
    const fm = parse(text.split('---')[1] ?? '') as Record<string, unknown>;
    const own = ownRace('Templates/Races/Deep Dwarf.md', text, fm, race('Human'));
    expect(own).toMatchObject({
      name: 'Deep Dwarf',
      speed: 25,
      darkvision: 60,
      languages: ['Common', 'Dwarvish'],
      resistances: ['poison'],
      traits: race('Dwarf').traits,
      names: race('Dwarf').names,
    });
  });
});

describe('rolls and search', () => {
  it('rolls looks in the chosen language and an age within the race’s years', () => {
    expect(rollLooks(race('Dwarf'), 'de', () => 0)).toBe(
      'ein geflochtener roter Bart, tiefliegende braune Augen, rötliche, wettergegerbte Haut',
    );
    expect(rollLooks(race('Dwarf'), 'en', () => 0.99)).toBe(
      'a forked brown beard, squinting eyes, tanned, scarred skin',
    );
    expect(rollAge(race('Elf'), () => 0)).toBe(100);
    expect(rollAge(race('Elf'), () => 0.999)).toBe(700);
  });

  it('finds races by English or German name, own races first', () => {
    expect(searchRaces(SRD_RACES, 'zwerg', 'de').map((r) => r.name)).toEqual(['Dwarf']);
    expect(searchRaces(SRD_RACES, 'half', 'en').map((r) => r.name)).toEqual([
      'Halfling',
      'Half-Elf',
      'Half-Orc',
    ]);
  });
});

describe('the example vault', () => {
  it('reads Tideborn as an own race', () => {
    const path = 'Templates/Races/Tideborn.md';
    const text = readExampleNote(path);
    const own = ownRace(path, text, frontmatterOf(text), race('Human'));
    expect(own).toMatchObject({
      name: 'Tideborn',
      darkvision: 30,
      languages: ['Common', 'Aquan'],
      resistances: ['cold'],
      age: [16, 90],
    });
    expect('traits' in own ? own.traits.map((t) => t.name) : []).toEqual([
      'Amphibious',
      'Tide Sense',
      'Bell-Deaf',
    ]);
    expect('names' in own ? own.familyNames : []).toContain('Saltbraid');
  });
});
