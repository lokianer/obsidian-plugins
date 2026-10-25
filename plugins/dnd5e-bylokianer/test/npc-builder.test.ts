import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import { PARTY, UNAFFILIATED } from '../src/factions/discover';
import { buildWorld } from '../src/factions/world';
import {
  byChallenge,
  ownArchetype,
  searchArchetypes,
  withName,
  type Archetype,
} from '../src/npc/archetypes';
import {
  addStatblock,
  archetypeNote,
  freePath,
  npcFolder,
  npcNote,
  type NpcChoices,
} from '../src/npc/note';
import { SRD_NPCS } from '../src/npc/srd';
import { findStatblocks, parseStatblock } from '../src/npc/statblock';
import { pick, TABLE_NAMES, tableFromNote, tableNote, tablesFor } from '../src/npc/tables';
import { TEXT_TABLES } from '../src/npc/text-tables';
import { SRD_RACES } from '../src/npc/srd-races';
import { loadExampleVault, readExampleNote } from './fixture';

const guard = SRD_NPCS.find((a) => a.name === 'Guard') as Archetype;
const choices = (over: Partial<NpcChoices> = {}): NpcChoices => ({
  name: 'Wenna Tidewell',
  race: 'human',
  raceModel: null,
  class: '',
  alignment: 'neutral',
  occupation: '',
  age: '',
  archetype: guard,
  appearance: 'Freckled, sunburnt, smells of tar',
  build: '',
  manner: '',
  voice: '',
  want: 'To see the bells under the river',
  ideal: '',
  bond: '',
  flaw: '',
  quirk: 'Feeds the gulls and names them',
  secret: '',
  hook: '',
  ...over,
});
const labels = { ideal: 'Ideal', bond: 'Bond', flaw: 'Flaw', hook: 'Hook' };
const note = (template: string | null, c: NpcChoices) => npcNote(template, c, labels, parse);

describe('archetypes', () => {
  it('reads the GM’s own archetype from a note, or says why not', () => {
    const note = [
      '---',
      'type: archetype',
      '---',
      '```dnd5e-statblock',
      'ac: 15',
      'cr: 1',
      '```',
    ].join('\n');
    expect(ownArchetype('Templates/Archetypes/Lantern Warden.md', note, parse)).toEqual({
      name: 'Lantern Warden',
      cr: '1',
      yaml: 'ac: 15\ncr: 1',
      source: 'Templates/Archetypes/Lantern Warden.md',
    });
    expect(ownArchetype('a.md', '# none', parse)).toEqual({
      path: 'a.md',
      problem: 'no-statblock',
    });
    expect(ownArchetype('b.md', '```dnd5e-statblock\nac: [\n```', parse)).toEqual({
      path: 'b.md',
      problem: 'invalid-yaml',
    });
  });

  it('reads the example vault’s Lantern Warden and quirks table', () => {
    const path = 'Templates/Archetypes/Lantern Warden.md';
    const warden = ownArchetype(path, readExampleNote(path), parse);
    expect(warden).toMatchObject({ name: 'Lantern Warden', cr: '1/4', source: path });
    expect(tableFromNote(readExampleNote('Templates/Tables/NPC quirks.md'))).toHaveLength(6);
  });

  it('searches by every word, the GM’s own archetypes first', () => {
    const own = { name: 'Lantern Guard', cr: '1', yaml: '', source: 'x.md' };
    const list = [...SRD_NPCS, own];
    expect(searchArchetypes(list, 'guard').map((a) => a.name)).toEqual(['Lantern Guard', 'Guard']);
    expect(searchArchetypes(list, 'bandit cap').map((a) => a.name)).toEqual(['Bandit Captain']);
    expect(searchArchetypes(list, '')).toHaveLength(22);
  });

  it('orders the GM’s own first, then by challenge rating', () => {
    const own = { name: 'Lantern Guard', cr: '1', yaml: '', source: 'x.md' };
    const blank = { name: 'Blank', cr: '', yaml: '', source: 'y.md' };
    const sorted = byChallenge([...SRD_NPCS, blank, own]).map((a) => a.name);
    expect(sorted.slice(0, 4)).toEqual(['Lantern Guard', 'Blank', 'Commoner', 'Bandit']);
    expect(sorted[sorted.length - 1]).toBe('Archmage');
  });

  it('names the block after the NPC, quoting when YAML needs it', () => {
    expect(withName('name: Guard\nac: 16', 'Wenna')).toBe('name: Wenna\nac: 16');
    expect(withName('ac: 16', 'Pell: the Sergeant')).toBe('name: "Pell: the Sergeant"\nac: 16');
  });
});

describe('tables', () => {
  it('has at least fifty entries per table in English and German, none twice', () => {
    for (const lang of ['en', 'de'] as const) {
      const tables = tablesFor(lang);
      for (const name of TABLE_NAMES) {
        expect(tables[name].length, `${lang} ${name}`).toBeGreaterThanOrEqual(50);
        expect(new Set(tables[name]).size, `${lang} ${name}`).toBe(tables[name].length);
      }
    }
    expect(tablesFor('de').ideal[0]).toBe(TEXT_TABLES.ideal[0]?.[1]);
    expect(tableNote('first-names')).toBe('NPC first names.md');
  });

  it('reads a table note’s list items and picks with the given random', () => {
    expect(tableFromNote('# Quirks\n\n- Hums\n* Whistles\n  + Counts gulls\nnot an item')).toEqual([
      'Hums',
      'Whistles',
      'Counts gulls',
    ]);
    expect(pick(['a', 'b', 'c'], () => 0.99)).toBe('c');
    expect(pick([], () => 0)).toBe('');
  });
});

describe('npcNote', () => {
  const template = readExampleNote('Templates/NPC.md');

  it('fills the example template: title, frontmatter, personality, stat block', () => {
    const text = note(template, choices());
    expect(text).toContain('# Wenna Tidewell');
    expect(text).not.toContain('{{title}}');
    const head = text.slice(0, text.indexOf('\n---', 3));
    expect(head).toContain('type: npc');
    expect(head).toContain('race: human');
    expect(head).toContain('alignment: neutral');
    expect(head).toContain('archetype: Guard');
    expect(head).toMatch(/^class:\s*$/m);
    expect(text).toContain('## Appearance and manner\n\n- Freckled, sunburnt, smells of tar');
    expect(text).toContain('## What they want\n\n- To see the bells under the river');
    expect(text).toContain('## Voice notes\n\n- Feeds the gulls and names them');
    const blocks = findStatblocks(text);
    expect(blocks).toHaveLength(1);
    const block = parseStatblock(parse(blocks[0]?.source ?? ''));
    expect([block.name, block.ac, block.hp, block.cr]).toEqual(['Wenna Tidewell', 16, 11, '1/8']);
  });

  it('writes the new fields with labels and applies the race to the stat block', () => {
    const dwarf = SRD_RACES.find((r) => r.name === 'Dwarf') ?? null;
    const text = note(
      template,
      choices({
        race: 'Dwarf',
        raceModel: dwarf,
        occupation: 'Bell-ringer',
        age: '120',
        build: 'Short and stocky',
        ideal: 'Order: rules keep the city alive',
        flaw: 'Holds grudges forever',
        secret: 'Informs for the watch',
        hook: 'Lost a key and offers a reward',
      }),
    );
    const head = text.slice(0, text.indexOf('\n---', 3));
    expect(head).toContain('race: Dwarf');
    expect(head).toContain('occupation: Bell-ringer');
    expect(head).toContain('age: 120');
    expect(text).toContain('- Freckled, sunburnt, smells of tar\n- Short and stocky');
    expect(text).toContain(
      '- To see the bells under the river\n- Ideal: Order: rules keep the city alive',
    );
    expect(text).toContain('- Feeds the gulls and names them\n- Flaw: Holds grudges forever');
    expect(text).toContain(
      '## Secrets\n\n- Informs for the watch\n- Hook: Lost a key and offers a reward',
    );
    const block = parseStatblock(parse(findStatblocks(text)[0]?.source ?? ''));
    expect([block.name, block.speed, block.subtype, block.damageResistances]).toEqual([
      'Wenna Tidewell',
      '25 ft.',
      'dwarf',
      'poison',
    ]);
  });

  it('keeps the template’s stat block without an archetype, and works without a template', () => {
    const plain = note(template, choices({ archetype: null }));
    expect(parseStatblock(parse(findStatblocks(plain)[0]?.source ?? '')).name).toBe(
      'Wenna Tidewell',
    );
    expect(plain).not.toContain('archetype:');

    const minimal = note(null, choices());
    expect(minimal.startsWith('---\ntype: npc\n')).toBe(true);
    expect(minimal).toContain('# Wenna Tidewell');
    expect(minimal).toContain('## Stats\n\n```dnd5e-statblock\nname: Wenna Tidewell');
  });
});

describe('addStatblock', () => {
  it('adds a Stats section to Sergeant Pell and nothing else', () => {
    const pell = readExampleNote('Silverstadt/Factions/Order of the Lantern/Sergeant Pell.md');
    const text = addStatblock(pell, withName(guard.yaml, 'Sergeant Pell'));
    expect(text).not.toBeNull();
    expect(text?.startsWith(pell.trimEnd())).toBe(true);
    expect(text?.slice(pell.trimEnd().length)).toMatch(
      /^\n\n## Stats\n\n```dnd5e-statblock\nname: Sergeant Pell\n/,
    );
    expect(text?.endsWith('```\n')).toBe(true);
  });

  it('refuses a note that has a stat block', () => {
    expect(addStatblock('# X\n```statblock\nac: 1\n```\n', 'ac: 2')).toBeNull();
  });
});

describe('placement', () => {
  const world = buildWorld(loadExampleVault());
  const F = 'Silverstadt/Factions';

  it('puts a new NPC into its faction’s folder, the Party’s, or the campaign’s NPCs', () => {
    expect(npcFolder(world, `${F}/The Gutter Court/The Bench`, 'NPCs')).toBe(
      `${F}/The Gutter Court/The Bench`,
    );
    expect(npcFolder(world, PARTY, 'NPCs')).toBe('Silverstadt/Party');
    expect(npcFolder(world, UNAFFILIATED, 'NPCs')).toBe('Silverstadt/NPCs');
  });

  it('never overwrites a note', () => {
    const taken = new Set(['A/Pell.md', 'A/Pell 2.md']);
    expect(freePath('A', 'Pell', (p) => taken.has(p))).toBe('A/Pell 3.md');
    expect(freePath('', 'Mira: Voss?', () => false)).toBe('Mira Voss.md');
  });
});

describe('archetypeNote', () => {
  it('writes an archetype note from a base, or from a blank block, that reads back as one', () => {
    const spy = SRD_NPCS.find((a) => a.name === 'Spy') ?? null;
    const note = archetypeNote('Archive Spy', spy, 'An archetype.');
    const own = ownArchetype('Templates/Archetypes/Archive Spy.md', note, parse);
    expect(own).toMatchObject({ name: 'Archive Spy', cr: '1' });
    expect(parseStatblock(parse(findStatblocks(note)[0]?.source ?? '')).name).toBe('Archive Spy');
    const blank = archetypeNote('Lamplighter', null, 'An archetype.');
    const block = parseStatblock(parse(findStatblocks(blank)[0]?.source ?? ''));
    expect([block.name, block.ac, block.hp, block.cr, block.unreadable]).toEqual([
      'Lamplighter',
      10,
      4,
      '0',
      [],
    ]);
  });
});
