import { describe, expect, it } from 'vitest';

import { BOOKS, type BookKey, isBookKey } from '../src/catalogue/books';
import { catalogueSlug, librarySections } from '../src/catalogue/library';
import { resolveSpell, withLibrary } from '../src/catalogue/merge';
import { CATALOGUE_SPELLS } from '../src/catalogue/spells';
import { filterSpells, NO_FILTERS, readFilters } from '../src/spells/filter';
import { spellName, spellText } from '../src/spells/meta';
import type { SrdSpell } from '../src/spells/model';
import { SRD_SPELLS } from '../src/spells/srd-spells';

// Invented spells: no text from any book.
const base: SrdSpell = {
  index: 'ember-thread',
  name: 'Ember Thread',
  level: 1,
  school: 'evocation',
  casting: '1 action',
  range: '30 feet',
  components: ['V', 'S'],
  material: '',
  duration: 'Instantaneous',
  concentration: false,
  ritual: false,
  classes: ['wizard'],
  damage: ['fire'],
  save: null,
  attack: 'ranged',
  text: '',
  higher: '',
};

const of = (patch: Partial<SrdSpell>): SrdSpell => ({ ...base, ...patch });

const old = of({
  index: 'phb14/ember-thread',
  rules: '2014',
  source: 'phb14',
  nameDe: 'Glutfaden',
  summary: { en: 'A thread of fire.', de: 'Ein Faden aus Feuer.' },
});
const fresh = of({
  index: 'phb24/ember-thread',
  rules: '2024',
  source: 'phb24',
  nameDe: 'Glutfaden',
  summary: { en: 'A brighter thread.', de: 'Ein hellerer Faden.' },
});
const lantern = of({
  index: 'xge/gloom-lantern',
  name: 'Gloom Lantern',
  level: 2,
  rules: '2014',
  source: 'xge',
  nameDe: 'Düsterlaterne',
  summary: { en: 'Dims the light.', de: 'Dämpft das Licht.' },
});
const srd = of({ index: 'srd-spark', name: 'Spark', text: 'SRD text.' });

describe('catalogue spells', () => {
  it('names a catalogue spell by its German name in German', () => {
    expect(spellName(old, 'de')).toBe('Glutfaden');
    expect(spellName(old, 'en')).toBe('Ember Thread');
  });

  it('shows the summary without a library text, the library text with one', () => {
    expect(spellText(old, 'de')).toEqual({
      text: 'Ein Faden aus Feuer.',
      higher: '',
      material: '',
    });
    const full = { ...old, library: { text: 'Full words.', higher: 'More dice.' } };
    expect(spellText(full, 'en')).toMatchObject({ text: 'Full words.', higher: 'More dice.' });
    expect(spellText(full, 'de')).toMatchObject({ text: 'Full words.', higher: 'More dice.' });
  });

  it('filters by rule set and by book, and finds German names', () => {
    const all = [srd, old, fresh, lantern];
    const name = (s: SrdSpell) => s.name;
    const ids = (f: Partial<typeof NO_FILTERS>) =>
      filterSpells(all, { ...NO_FILTERS, ...f }, name).map((s) => s.index);
    expect(ids({ rules: ['2024'] })).toEqual(['phb24/ember-thread']);
    expect(ids({ rules: ['2014'] })).toEqual([
      'phb14/ember-thread',
      'srd-spark',
      'xge/gloom-lantern',
    ]);
    expect(ids({ sources: ['xge'] })).toEqual(['xge/gloom-lantern']);
    expect(ids({ sources: ['srd'] })).toEqual(['srd-spark']);
    expect(ids({ query: 'düster' })).toEqual(['xge/gloom-lantern']);
  });

  it('reads the rule and book filters back', () => {
    const read = readFilters({ rules: ['2024', 'x'], sources: ['xge', 7] });
    expect(read.rules).toEqual(['2024']);
    expect(read.sources).toEqual(['xge']);
  });

  it('attaches library sections to catalogue entries only', () => {
    const sections = new Map([
      ['phb24/ember-thread', { text: 'Full.', higher: '' }],
      ['srd-spark', { text: 'Other.', higher: '' }],
    ]);
    const [s, f] = withLibrary([srd, fresh], sections);
    expect(s).toBe(srd);
    expect(f?.library).toEqual({ text: 'Full.', higher: '' });
  });

  it('resolves a name: own, then SRD, then the preferred rule set', () => {
    const all = [old, fresh, lantern];
    expect(resolveSpell('Ember Thread', all, '2024')?.index).toBe('phb24/ember-thread');
    expect(resolveSpell('ember thread', all, '2014')?.index).toBe('phb14/ember-thread');
    expect(resolveSpell('Ember Thread', all, 'both')?.index).toBe('phb24/ember-thread');
    expect(resolveSpell('Glutfaden', all, '2014')?.index).toBe('phb14/ember-thread');
    const own = of({ index: 'own', path: 'Spells/Ember Thread.md' });
    expect(resolveSpell('Ember Thread', [...all, own], '2024')).toBe(own);
    const srdEmber = of({ index: 'ember-thread' });
    expect(resolveSpell('Ember Thread', [...all, srdEmber], '2024')).toBe(srdEmber);
    expect(resolveSpell('Nothing', all, '2024')).toBeNull();
  });
});

describe('library notes', () => {
  const note = [
    '---',
    'type: library',
    'source: xge',
    '---',
    '',
    '# A book',
    '',
    'Intro text.',
    '',
    '## Ember Thread ',
    '',
    'First paragraph.',
    '',
    'Second paragraph.',
    '',
    '**At Higher Levels.** More threads.',
    '',
    '## Tasha’s Gloom Lantern',
    '',
    'Dims.',
  ].join('\n');

  it('cuts a note into sections keyed by book and slugged heading', () => {
    const sections = librarySections('xge', note);
    expect([...sections.keys()]).toEqual(['xge/ember-thread', 'xge/tashas-gloom-lantern']);
    expect(sections.get('xge/ember-thread')).toEqual({
      text: 'First paragraph.\n\nSecond paragraph.',
      higher: 'More threads.',
    });
    expect(sections.get('xge/tashas-gloom-lantern')).toEqual({ text: 'Dims.', higher: '' });
  });

  it('slugs names the way catalogue indexes are made', () => {
    expect(catalogueSlug("Tasha's Hideous Laughter")).toBe('tashas-hideous-laughter');
    expect(catalogueSlug('Antipathy/Sympathy')).toBe('antipathy-sympathy');
    expect(catalogueSlug('Melf’s Minute Meteors')).toBe('melfs-minute-meteors');
  });
});

describe('the spell catalogue', () => {
  it('has unique keys, a book and rule set, two summaries and no book text on every entry', () => {
    const keys = new Set(CATALOGUE_SPELLS.map((s) => s.index));
    expect(keys.size).toBe(CATALOGUE_SPELLS.length);
    for (const spell of CATALOGUE_SPELLS) {
      expect(spell.index).toBe(`${spell.source}/${catalogueSlug(spell.name)}`);
      expect(isBookKey(spell.source)).toBe(true);
      expect(spell.rules).toBe(BOOKS[spell.source as BookKey].rules);
      expect(spell.nameDe).not.toBe('');
      expect(spell.summary?.en.length).toBeGreaterThan(20);
      expect(spell.summary?.de.length).toBeGreaterThan(20);
      expect(spell.summary!.en.length).toBeLessThanOrEqual(400);
      expect(spell.text).toBe('');
      expect(spell.higher).toBe('');
    }
  });

  it('holds no SRD spell of the same rule set', () => {
    const srd = new Set(SRD_SPELLS.map((s) => s.name.toLowerCase()));
    const clash = CATALOGUE_SPELLS.filter(
      (s) => s.rules === '2014' && srd.has(s.name.toLowerCase()),
    );
    expect(clash.map((s) => s.index)).toEqual([]);
  });
});
