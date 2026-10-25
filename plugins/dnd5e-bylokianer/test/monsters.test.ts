import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import { DE_NAMES } from '../src/monsters/de';
import {
  bonusText,
  emptyMonster,
  legendaryParagraph,
  monsterNoteText,
  parseBonuses,
  statblockYaml,
} from '../src/monsters/draft';
import { ownIndex, ownMonster } from '../src/monsters/own';
import {
  bandCounts,
  bandOf,
  filterMonsters,
  isFiltered,
  NO_FILTERS,
  readFilters,
} from '../src/monsters/filter';
import { DE_TEXTS } from '../src/monsters/de-texts';
import { germanBlock, germanTexts, monsterName } from '../src/monsters/meta';
import { spellFinder } from '../src/spells/links';
import { SRD_SPELLS } from '../src/spells/srd-spells';
import type { SrdMonster } from '../src/monsters/model';
import { SRD_MONSTERS } from '../src/monsters/srd-monsters';
import { SRD_NPCS } from '../src/npc/srd';
import { findStatblocks, parseStatblock, type Statblock } from '../src/npc/statblock';

const block = (index: string): Statblock => {
  const m = SRD_MONSTERS.find((x) => x.index === index);
  if (m === undefined) throw new Error(index);
  return parseStatblock(parse(m.yaml));
};

describe('SRD monsters', () => {
  it('has the 334 monsters, each a stat block that reads cleanly', () => {
    expect(SRD_MONSTERS).toHaveLength(334);
    expect(new Set(SRD_MONSTERS.map((m) => m.index)).size).toBe(334);
    for (const m of SRD_MONSTERS) {
      const b = parseStatblock(parse(m.yaml));
      expect(b.unreadable, m.index).toEqual([]);
      expect(b.name, m.index).toBe(m.name);
      expect(b.cr, m.index).toBe(m.cr);
      expect([b.ac, b.hp], m.index).toEqual([m.ac, m.hp]);
      expect(b.actions.length + b.traits.length, m.index).toBeGreaterThan(0);
    }
  });

  it('matches the SRD for an Adult Red Dragon', () => {
    const b = block('adult-red-dragon');
    expect(b).toMatchObject({
      size: 'Huge',
      type: 'dragon',
      alignment: 'chaotic evil',
      ac: 19,
      acClass: 'natural armor',
      hp: 256,
      hitDice: '19d12 + 133',
      speed: '40 ft., climb 40 ft., fly 80 ft.',
      stats: [27, 10, 25, 16, 13, 21],
      damageImmunities: 'fire',
      senses: 'blindsight 60 ft., darkvision 120 ft., passive Perception 23',
      languages: 'Common, Draconic',
      cr: '17',
    });
    expect(b.saves.map((s) => [s.key, s.bonus])).toEqual([
      ['dex', 6],
      ['con', 13],
      ['wis', 7],
      ['cha', 11],
    ]);
    expect(b.traits.map((e) => e.name)).toEqual(['Legendary Resistance (3/Day)']);
    expect(b.actions.map((e) => e.name)).toContain('Fire Breath (Recharge 5–6)');
    expect(b.legendaryDescription).toMatch(/^The dragon can take 3 legendary actions/);
    expect(b.legendaryActions.map((e) => e.name)).toEqual([
      'Detect',
      'Tail Attack',
      'Wing Attack (Costs 2 Actions)',
    ]);
  });

  it('matches the SRD for a Goblin, a Lich and an Owlbear', () => {
    expect(block('goblin')).toMatchObject({
      size: 'Small',
      subtype: 'goblinoid',
      ac: 15,
      acClass: 'leather armor, shield',
      hp: 7,
      hitDice: '2d6',
      cr: '1/4',
    });
    expect(block('goblin').traits.map((e) => e.name)).toEqual(['Nimble Escape']);
    const lich = block('lich');
    expect(lich).toMatchObject({ ac: 17, hp: 135, hitDice: '18d8 + 54', cr: '21' });
    expect(lich.damageImmunities).toMatch(/^poison; bludgeoning, piercing, and slashing/);
    expect(lich.conditionImmunities).toBe('charmed; exhaustion; frightened; paralyzed; poisoned');
    expect(lich.traits.find((e) => e.name === 'Spellcasting')?.desc).toContain('power word kill');
    expect(block('owlbear')).toMatchObject({
      ac: 13,
      hp: 59,
      hitDice: '7d10 + 21',
      speed: '40 ft.',
      stats: [20, 12, 17, 3, 12, 7],
      cr: '3',
    });
    expect(block('archmage').acClass).toBe('15 with mage armor');
    expect(block('ankheg').acClass).toBe('natural armor, 11 while prone');
  });

  it('agrees with the NPC builder on the 21 SRD NPCs', () => {
    for (const npc of SRD_NPCS) {
      const index = npc.name.toLowerCase().replace(/ /g, '-');
      const ours = parseStatblock(parse(npc.yaml));
      const theirs = block(index);
      expect([theirs.cr, theirs.ac, theirs.hp, theirs.stats], index).toEqual([
        ours.cr,
        ours.ac,
        ours.hp,
        ours.stats,
      ]);
      // The NPC builder's names leave out the usage ("Leadership" for "Leadership (Recharges …)").
      const plain = (name: string) => name.replace(/ \(.*\)$/, '');
      expect(
        theirs.actions.map((e) => plain(e.name)),
        index,
      ).toEqual(ours.actions.map((e) => plain(e.name)));
    }
  });

  it('carries the list and filter fields', () => {
    const dragon = SRD_MONSTERS.find((m) => m.index === 'adult-red-dragon');
    expect(dragon).toMatchObject({ legendary: true, spellcaster: false, moves: ['fly', 'climb'] });
    expect(SRD_MONSTERS.find((m) => m.index === 'lich')?.spellcaster).toBe(true);
    expect(SRD_MONSTERS.find((m) => m.index === 'swarm-of-bats')?.type).toBe('swarm');
    expect(SRD_MONSTERS.filter((m) => m.legendary)).toHaveLength(32);
  });
});

describe('German monster names and meta', () => {
  it('names every monster in German, none twice', () => {
    expect(Object.keys(DE_NAMES).sort()).toEqual(SRD_MONSTERS.map((m) => m.index).sort());
    expect(new Set(Object.values(DE_NAMES)).size).toBe(334);
    const dragon = SRD_MONSTERS.find((m) => m.index === 'adult-red-dragon');
    if (dragon === undefined) throw new Error('no dragon');
    expect(monsterName(dragon, 'de')).toBe('Ausgewachsener Roter Drache');
    expect(monsterName(dragon, 'en')).toBe('Adult Red Dragon');
  });

  it('writes a stat block’s header and lines in German', () => {
    const de = germanBlock(block('adult-red-dragon'), 'Ausgewachsener Roter Drache');
    expect(de).toMatchObject({
      name: 'Ausgewachsener Roter Drache',
      size: 'Riesiger',
      type: 'Drache',
      alignment: 'chaotisch böse',
      acClass: 'natürliche Rüstung',
      hitDice: '19W12 + 133',
      speed: '12 m, Klettern 12 m, Fliegen 24 m',
      senses: 'Blindsicht 18 m, Dunkelsicht 36 m, passive Wahrnehmung 23',
      languages: 'Gemeinsprache, Drakonisch',
      damageImmunities: 'Feuer',
    });
    expect(de.saves.map((s) => s.key)).toEqual(['Ges', 'Kon', 'Wei', 'Cha']);
    expect(de.skills.map((s) => s.key)).toEqual(['Wahrnehmung', 'Heimlichkeit']);
    expect(germanBlock(block('goblin'), 'Goblin')).toMatchObject({
      size: 'Kleiner',
      type: 'Humanoider',
      subtype: 'Goblinoid',
      acClass: 'Lederrüstung, Schild',
    });
    expect(germanBlock(block('swarm-of-bats'), '')).toMatchObject({
      size: 'Mittelgroßer',
      type: 'Schwarm winziger Tiere',
    });
    expect(germanBlock(block('owlbear'), '').type).toBe('Monstrosität');
    expect(germanBlock(block('owlbear'), '').size).toBe('Große');
    expect(germanBlock(block('giant-eagle'), '').languages).toBe(
      'Riesenadler, versteht Gemeinsprache und Aural, kann aber nicht sprechen',
    );
  });

  it('leaves no English words in any monster’s German header and lines', () => {
    const english =
      /(?<!\p{L})(ft|feet|fly|swim|climb|burrow|hover|Perception|darkvision|blindsight|truesight|tremorsense|Common|understands|speak|languages?|any|alignment|lawful|chaotic|good|evil|unaligned|armor|natural|shield|from|nonmagical|weapons|fire|cold|poison|acid|charmed|frightened|poisoned|exhaustion|prone|telepathy)(?!\p{L})/u;
    for (const m of SRD_MONSTERS) {
      const de = germanBlock(block(m.index), '');
      for (const value of [
        de.size,
        de.type,
        de.subtype,
        de.alignment,
        de.acClass,
        de.speed,
        de.senses,
        de.languages,
        de.damageVulnerabilities,
        de.damageResistances,
        de.damageImmunities,
        de.conditionImmunities,
      ]) {
        if (value !== null) expect(value, m.index).not.toMatch(english);
      }
    }
  });
});

describe('German monster texts (M2)', () => {
  const LISTS = ['traits', 'actions', 'bonusActions', 'reactions', 'legendaryActions'] as const;
  const pairs = (m: SrdMonster) => {
    const en = block(m.index);
    const de = germanTexts(en, m.index);
    return LISTS.flatMap((k) => en[k].map((e, i) => ({ k, en: e, de: de[k][i] ?? e })));
  };
  const all = (pattern: RegExp, text: string) =>
    [...text.matchAll(pattern)].map((x) => x[1]).sort();

  it('translates every trait, action, reaction and legendary action of all 334, one for one', () => {
    expect(Object.keys(DE_TEXTS).sort()).toEqual(SRD_MONSTERS.map((m) => m.index).sort());
    for (const m of SRD_MONSTERS) {
      const en = block(m.index);
      const de = DE_TEXTS[m.index] ?? {};
      for (const k of LISTS) {
        expect(de[k]?.length ?? 0, `${m.index} ${k}`).toBe(en[k].length);
      }
      expect(de.legendary !== undefined, `${m.index} legendary`).toBe(
        en.legendaryDescription !== null,
      );
      for (const p of pairs(m)) {
        expect(p.de.name, `${m.index} ${p.en.name}`).not.toBe('');
        expect(p.de.desc, `${m.index} ${p.en.name}`).not.toBe(p.en.desc);
      }
    }
  });

  it('keeps every die, attack bonus and DC of the English text', () => {
    for (const m of SRD_MONSTERS) {
      for (const { en, de } of pairs(m)) {
        const where = `${m.index}: ${en.name}`;
        expect(all(/(\d+)W(\d+)/g, de.desc).join(), where).toBe(
          all(/(\d+)d(\d+)/g, en.desc).join(),
        );
        expect(all(/\+(\d+) auf Treffer/g, de.desc).join(), where).toBe(
          all(/\+(\d+) to hit/g, en.desc).join(),
        );
        expect(all(/SG (\d+)/g, de.desc).join(), where).toBe(
          all(/DC (?:of )?(\d+)/g, en.desc).join(),
        );
      }
    }
  });

  it('leaves no feet, miles, pounds, inches or English rules words', () => {
    const imperial =
      /(?<!\p{L})(feet|foot|ft\.|miles?|pounds?|inch(es)?|Fuß|Meilen?|Pfund|Zoll)(?!\p{L})/u;
    const english = /\b(the|and|with|creature|target|damage|saving throw|its|hit points)\b/;
    for (const m of SRD_MONSTERS) {
      for (const { de } of pairs(m)) {
        expect(`${de.name} ${de.desc}`, m.index).not.toMatch(imperial);
        expect(`${de.name} ${de.desc}`, m.index).not.toMatch(english);
      }
    }
  });

  it('names the spells of every Spellcasting entry so the spellbook links them', () => {
    const find = spellFinder(SRD_SPELLS);
    for (const m of SRD_MONSTERS) {
      for (const { en, de } of pairs(m)) {
        if (!/spellcasting/i.test(en.name)) continue;
        const names = (text: string) =>
          find(text)
            .map((x) => x.index)
            .sort();
        expect(names(de.desc), m.index).toEqual(names(en.desc));
      }
    }
  });

  it('reads an owlbear and a dragon in German and leaves own monsters as they are', () => {
    const owl = germanTexts(block('owlbear'), 'owlbear');
    expect(owl.traits).toEqual([
      {
        name: 'Scharfe Sicht und scharfer Geruchssinn',
        desc: 'Der Eulenbär ist bei Weisheitswürfen (Wahrnehmung), die auf der Sicht oder dem Geruchssinn beruhen, im Vorteil.',
      },
    ]);
    expect(owl.actions.map((a) => a.name)).toEqual(['Mehrfachangriff', 'Schnabel', 'Klauen']);
    expect(owl.actions[1]?.desc).toBe(
      'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, eine Kreatur. Treffer: 10 (1W10 + 5) Stichschaden.',
    );
    const red = germanTexts(block('adult-red-dragon'), 'adult-red-dragon');
    expect(red.legendaryDescription).toMatch(/^Der Drache kann 3 legendäre Aktionen ausführen/);
    expect(red.actions.find((a) => a.name.startsWith('Feuerodem'))?.desc).toContain('18-m-Kegel');
    const own = { ...block('owlbear'), traits: [] };
    expect(germanTexts(own, 'owlbear').traits).toEqual([]);
    expect(germanTexts(block('owlbear'), 'bell-tower-gargoyle')).toEqual(block('owlbear'));
  });
});

describe('Monster Manual filters', () => {
  const name = (m: SrdMonster) => m.name;

  it('sorts by challenge rating, then name, and bands the ratings', () => {
    const all = filterMonsters(SRD_MONSTERS, NO_FILTERS, name);
    expect(all).toHaveLength(334);
    expect(all[0]?.cr).toBe('0');
    expect(all[all.length - 1]?.name).toBe('Tarrasque');
    expect(['0', '1/8', '1/2', '1', '4', '5', '10', '11', '16', '17', '30'].map(bandOf)).toEqual([
      '0',
      '0',
      '0',
      '1',
      '1',
      '5',
      '5',
      '11',
      '11',
      '17',
      '17',
    ]);
    const counts = bandCounts(SRD_MONSTERS, NO_FILTERS);
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(334);
  });

  it('combines bands, types, sizes, movement, legendary and spellcasting', () => {
    const shown = filterMonsters(
      SRD_MONSTERS,
      { ...NO_FILTERS, bands: ['17'], types: ['dragon'], moves: ['swim'], legendary: true },
      name,
    );
    expect(shown.length).toBeGreaterThan(0);
    expect(shown.every((m) => m.type === 'dragon' && m.legendary && m.moves.includes('swim'))).toBe(
      true,
    );
    const casters = filterMonsters(SRD_MONSTERS, { ...NO_FILTERS, spellcaster: true }, name);
    expect(casters.map((m) => m.index)).toContain('lich');
    expect(casters.map((m) => m.index)).not.toContain('goblin');
    const tiny = filterMonsters(SRD_MONSTERS, { ...NO_FILTERS, sizes: ['Tiny', 'Small'] }, name);
    expect(tiny.every((m) => m.size === 'Tiny' || m.size === 'Small')).toBe(true);
  });

  it('finds English and German names, ignoring case and accents', () => {
    const find = (query: string) =>
      filterMonsters(SRD_MONSTERS, { ...NO_FILTERS, query }, name).map((m) => m.index);
    expect(find('owlb')).toEqual(['owlbear']);
    expect(find('eulenbar')).toEqual(['owlbear']);
    expect(find('roter drache')).toContain('adult-red-dragon');
  });

  it('reads filters back with care', () => {
    expect(readFilters({ bands: ['17', 'x'], legendary: true, query: 3 })).toEqual({
      ...NO_FILTERS,
      bands: ['17'],
      legendary: true,
    });
    expect(isFiltered(NO_FILTERS)).toBe(false);
  });
});

describe('monster builder drafts', () => {
  it('writes every SRD monster back as a block that reads the same', () => {
    for (const m of SRD_MONSTERS) {
      const b = parseStatblock(parse(m.yaml));
      const again = parseStatblock(parse(statblockYaml(b)));
      expect({ ...again, extra: {} }, m.index).toEqual({ ...b, extra: {} });
    }
  });

  it('reads and writes saves and skills as one line', () => {
    expect(bonusText(block('adult-red-dragon').saves)).toBe('dex +6, con +13, wis +7, cha +11');
    expect(parseBonuses('DEX +6, CON +13, junk, Sleight of Hand −2')).toEqual([
      { key: 'dex', bonus: 6 },
      { key: 'con', bonus: 13 },
      { key: 'sleight_of_hand', bonus: -2 },
    ]);
    expect(bonusText(parseBonuses('Sleight of Hand +4'))).toBe('sleight of hand +4');
  });

  it('leaves empty fields and empty entries out, and the legendary paragraph without actions', () => {
    const b = {
      ...emptyMonster(),
      name: 'Mire Hound',
      actions: [
        { name: 'Bite', desc: 'Melee Weapon Attack: +4 to hit.' },
        { name: '', desc: '' },
      ],
      legendaryDescription: 'unused',
    };
    const yaml = statblockYaml(b);
    expect(yaml).not.toContain('legendary');
    expect(yaml).not.toContain('damage_');
    expect(parseStatblock(parse(yaml)).actions).toEqual([
      { name: 'Bite', desc: 'Melee Weapon Attack: +4 to hit.' },
    ]);
    expect(legendaryParagraph('Mire Hound')).toMatch(/^The mire hound can take 3 legendary/);
  });

  it('writes a monster note with its block', () => {
    const text = monsterNoteText('Mire Hound', '1/2', 'name: "Mire Hound"', 'dnd5e-statblock');
    expect(text).toBe(
      '---\ntype: monster\ncr: "1/2"\n---\n\n# Mire Hound\n\n```dnd5e-statblock\nname: "Mire Hound"\n```\n',
    );
    expect(findStatblocks(text)[0]?.source).toBe('name: "Mire Hound"');
  });
});

describe('own monsters', () => {
  it('reads a note’s stat block for the list and filters', () => {
    const yaml =
      'name: Mire Hound\nsize: Medium\ntype: monstrosity (marsh)\nac: 13\nhp: 22\nspeed: 40 ft., swim 30 ft.\ncr: "1/2"\ntraits:\n  - name: Innate Spellcasting\n    desc: x';
    const m = ownMonster('Monsters/Mire Hound.md', parseStatblock(parse(yaml)), yaml);
    expect(m).toMatchObject({
      index: ownIndex('Monsters/Mire Hound.md'),
      name: 'Mire Hound',
      cr: '1/2',
      type: 'monstrosity',
      size: 'Medium',
      ac: 13,
      hp: 22,
      moves: ['swim'],
      legendary: false,
      spellcaster: true,
      path: 'Monsters/Mire Hound.md',
    });
    expect(ownMonster('x.md', parseStatblock(parse('ac: 3')), 'ac: 3')).toBeNull();
    const found = filterMonsters(
      [...SRD_MONSTERS, m as SrdMonster],
      { ...NO_FILTERS, query: 'mire' },
      (x) => x.name,
    );
    expect(found.map((x) => x.name)).toEqual(['Mire Hound']);
  });
});
