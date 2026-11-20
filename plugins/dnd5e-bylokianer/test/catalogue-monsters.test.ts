import { parseYaml } from 'obsidian';
import { describe, expect, it } from 'vitest';

import { BOOKS, type BookKey, isBookKey } from '../src/catalogue/books';
import { catalogueSlug } from '../src/catalogue/library';
import { withMonsterLibrary } from '../src/catalogue/merge';
import { CATALOGUE_MONSTERS } from '../src/catalogue/monsters';
import { filterMonsters, NO_FILTERS, readFilters } from '../src/monsters/filter';
import { monsterName } from '../src/monsters/meta';
import type { SrdMonster } from '../src/monsters/model';
import { SRD_MONSTERS } from '../src/monsters/srd-monsters';
import { parseStatblock } from '../src/npc/statblock';

// Invented monsters: no text from any book.
const gloom: SrdMonster = {
  index: 'mm14/gloom-lantern',
  name: 'Gloom Lantern',
  nameDe: 'Düsterlaterne',
  cr: '3',
  type: 'aberration',
  size: 'Medium',
  ac: 15,
  hp: 45,
  moves: ['fly'],
  legendary: false,
  spellcaster: false,
  rules: '2014',
  source: 'mm14',
  summary: {
    en: 'A floating lamp that drinks light.',
    de: 'Eine schwebende Lampe, die Licht trinkt.',
  },
  yaml: 'name: "Gloom Lantern"\nsize: Medium\ntype: "aberration"\nac: 15\nhp: 45\nstats: [10, 14, 16, 8, 12, 6]\ncr: "3"',
};
const ember: SrdMonster = {
  ...gloom,
  index: 'fraif/ember-moth',
  name: 'Ember Moth',
  nameDe: 'Glutmotte',
  rules: '2024',
  source: 'fraif',
};
const srd: SrdMonster = {
  ...gloom,
  index: 'gloom-hound',
  name: 'Gloom Hound',
  rules: undefined,
  source: undefined,
  nameDe: undefined,
  summary: undefined,
};
const own: SrdMonster = {
  ...srd,
  index: 'own:Monsters/Gloom.md',
  name: 'Gloom',
  path: 'Monsters/Gloom.md',
};

describe('catalogue monsters', () => {
  it('names a catalogue monster in German by its nameDe and finds it by that name', () => {
    expect(monsterName(gloom, 'de')).toBe('Düsterlaterne');
    expect(monsterName(gloom, 'en')).toBe('Gloom Lantern');
    const found = filterMonsters([gloom, ember], { ...NO_FILTERS, query: 'düster' }, (m) => m.name);
    expect(found.map((m) => m.index)).toEqual(['mm14/gloom-lantern']);
  });

  it('filters by rule set and book; own monsters pass every rule set', () => {
    const all = [gloom, ember, srd, own];
    const names = (f: Partial<typeof NO_FILTERS>) =>
      filterMonsters(all, { ...NO_FILTERS, ...f }, (m) => m.name).map((m) => m.index);
    expect(names({ rules: ['2024'] })).toEqual(['fraif/ember-moth', 'own:Monsters/Gloom.md']);
    expect(names({ rules: ['2014'] })).toEqual([
      'own:Monsters/Gloom.md',
      'gloom-hound',
      'mm14/gloom-lantern',
    ]);
    expect(names({ sources: ['srd'] })).toEqual(['gloom-hound']);
    expect(names({ sources: ['fraif'] })).toEqual(['fraif/ember-moth']);
  });

  it('reads old filters without rule set or book, and drops unknown values', () => {
    expect(readFilters({ query: 'x' }).rules).toEqual([]);
    const read = readFilters({ rules: ['2024', '1999'], sources: ['mpmm', 'toString', 'srd'] });
    expect(read.rules).toEqual(['2024']);
    expect(read.sources).toEqual(['mpmm', 'srd']);
  });

  it('takes the full stat block from a library section, only for catalogue monsters', () => {
    const block =
      'name: "Gloom Lantern"\nac: 15\nhp: 45\nactions:\n  - name: "Dim"\n    desc: "It dims."';
    const sections = new Map([
      ['mm14/gloom-lantern', { text: `Lore.\n\n\`\`\`statblock\n${block}\n\`\`\`\n`, higher: '' }],
      ['gloom-hound', { text: '```statblock\nname: x\n```', higher: '' }],
      ['fraif/ember-moth', { text: 'No block here.', higher: '' }],
    ]);
    const [g, e, s] = withMonsterLibrary([gloom, ember, srd], sections);
    expect(g?.yaml).toBe(block);
    expect(g?.fromLibrary).toBe(true);
    expect(e).toBe(ember);
    expect(s).toBe(srd);
    expect((parseYaml(g?.yaml ?? '') as { actions: unknown[] }).actions).toHaveLength(1);
  });
});

describe('the monster catalogue', () => {
  it('has unique keys, a book and rule set, two summaries and a stat block that parses', () => {
    const keys = new Set(CATALOGUE_MONSTERS.map((m) => m.index));
    expect(keys.size).toBe(CATALOGUE_MONSTERS.length);
    for (const m of CATALOGUE_MONSTERS) {
      expect(m.index).toBe(`${m.source}/${catalogueSlug(m.name)}`);
      expect(m.source !== undefined && isBookKey(m.source)).toBe(true);
      expect(m.rules).toBe(BOOKS[m.source as BookKey].rules);
      expect(m.summary?.en.length).toBeGreaterThan(20);
      expect(m.summary?.de.length).toBeGreaterThan(20);
      const block = parseStatblock(parseYaml(m.yaml));
      expect([block.name, block.ac, block.hp, block.cr]).toEqual([m.name, m.ac, m.hp, m.cr]);
      expect(block.actions).toEqual([]);
    }
  });

  it('holds no SRD monster in a 2014 book and no German name of another SRD monster', () => {
    const deOf = new Map(SRD_MONSTERS.map((m) => [m.name.toLowerCase(), monsterName(m, 'de')]));
    const srdByDe = new Set(SRD_MONSTERS.map((m) => monsterName(m, 'de').toLowerCase()));
    const wrong = CATALOGUE_MONSTERS.filter((m) => {
      const same = deOf.get(m.name.toLowerCase());
      if (same !== undefined) return m.rules === '2014' || m.nameDe !== same;
      return srdByDe.has((m.nameDe ?? '').toLowerCase());
    }).map((m) => `${m.index}: ${m.nameDe}`);
    expect(wrong).toEqual([]);
  });
});
