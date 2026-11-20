import { describe, expect, it } from 'vitest';

import {
  type Character,
  checkRules,
  derive,
  germanProblems,
  type Feature,
  type Grant,
  loadRules,
  SRD_52,
  type Text,
} from '../src/index';

/** Every `{ en, de? }` text in a value, with its path. */
const texts = (value: unknown, path: string): [string, Text][] => {
  if (Array.isArray(value)) return value.flatMap((v, i) => texts(v, `${path}[${i}]`));
  if (typeof value !== 'object' || value === null) return [];
  if ('en' in value && typeof value.en === 'string') return [[path, value as Text]];
  return Object.entries(value).flatMap(([k, v]) => texts(v, `${path}.${k}`));
};

const rules = loadRules([SRD_52]);
const grants = (classId: string): Grant[] =>
  rules.class(classId)?.features.flatMap((f) => f.grants) ?? [];

describe('SRD 5.2.1 classes and subclasses', () => {
  it('passes the data check', () => {
    expect(checkRules(rules)).toEqual([]);
  });

  it('has the 12 classes with their subclass at level 3', () => {
    expect(SRD_52.classes.map((c) => c.id).sort()).toEqual(
      [
        'barbarian',
        'bard',
        'cleric',
        'druid',
        'fighter',
        'monk',
        'paladin',
        'ranger',
        'rogue',
        'sorcerer',
        'warlock',
        'wizard',
      ].sort(),
    );
    expect(SRD_52.subclasses).toHaveLength(12);
    for (const c of SRD_52.classes) expect(c.subclassLevel).toBe(3);
  });

  it('gives the bard its hit die, saves and Bardic Inspiration', () => {
    const bard = rules.class('bard')!;
    expect(bard.hitDie).toBe(8);
    expect([...bard.saves].sort()).toEqual(['cha', 'dex']);
    const inspiration = grants('bard').find(
      (g) => g.kind === 'resource' && g.id === 'bardic-inspiration',
    );
    expect(inspiration).toMatchObject({ uses: { ability: 'cha' }, min: 1 });
    if (inspiration?.kind !== 'resource' || typeof inspiration.die !== 'object') {
      throw new Error('Bardic Inspiration has no die table');
    }
    const dice = inspiration.die.byLevel;
    expect([1, 5, 10, 15].map((l) => dice[l - 1])).toEqual(['d6', 'd8', 'd10', 'd12']);
    if (typeof inspiration.recharge !== 'object') throw new Error('no recharge table');
    const recharge = inspiration.recharge.byLevel;
    expect([4, 5].map((l) => recharge[l - 1])).toEqual(['long', 'short']);
  });

  it('names each class progression, outside the core feature', () => {
    const progression = (id: string) =>
      grants(id).flatMap((g) => (g.kind === 'spellcasting' ? [g.progression] : []));
    expect(progression('warlock')).toEqual(['pact']);
    expect(progression('paladin')).toEqual(['half']);
    expect(progression('ranger')).toEqual(['half']);
    expect(progression('wizard')).toEqual(['full']);
    expect(progression('fighter')).toEqual([]);
    for (const c of SRD_52.classes) {
      const core = c.features.find((f) => f.id === `${c.id}-core`);
      expect(core?.grants.some((g) => g.kind === 'spellcasting')).toBe(false);
    }
  });

  it('gives every feature a text', () => {
    const features = [
      ...SRD_52.classes.flatMap((c) => c.features),
      ...SRD_52.subclasses.flatMap((s) => s.features),
    ];
    expect(features.filter((f) => f.text.en.trim() === '').map((f) => f.id)).toEqual([]);
  });
});

describe('SRD 5.2.1 weapon training and multiclassing', () => {
  const hero = (levels: string[], items: string[]): Character => ({
    rules: '2024',
    species: 'human',
    background: 'soldier',
    abilities: { str: 10, dex: 16, con: 12, int: 10, wis: 14, cha: 10 },
    choices: {},
    levels: levels.map((c, i) => ({ class: c, hp: i === 0 ? 'max' : 'average', choices: {} })),
    inventory: items.map((item) => ({ item, equipped: true })),
    bonuses: [],
  });
  const trained = (c: Character) =>
    Object.fromEntries(derive(c, rules).attacks.map((a) => [a.id, a.proficient]));

  it('trains a rogue in martial finesse and light weapons, a monk in martial light ones', () => {
    expect(trained(hero(['rogue'], ['rapier', 'shortsword', 'longsword']))).toEqual({
      rapier: true,
      shortsword: true,
      longsword: false,
    });
    expect(trained(hero(['monk'], ['shortsword', 'rapier']))).toEqual({
      shortsword: true,
      rapier: false,
    });
  });

  it('asks a multiclass rogue for its skill', () => {
    const sheet = derive(hero(['fighter', 'rogue'], []), rules);
    expect(sheet.missing).toContain('level 2: rogue-multiclass/skills');
  });
});

describe('SRD 5.2.1 German texts', () => {
  it('every rules text has its German', () => {
    const problems = texts(SRD_52, 'srd').flatMap(([path, text]) =>
      germanProblems(text).map((p) => `${path}: ${p}`),
    );
    expect(problems).toEqual([]);
  });

  it('keeps no spell list glued onto an English text', () => {
    const glued = texts(SRD_52, 'srd')
      .filter(([, text]) => text.en.includes('Spell List'))
      .map(([path]) => path);
    expect(glued).toEqual([]);
  });
});

describe('SRD 5.2.1 German names from the official German SRD', () => {
  const de = (list: readonly { id: string; name: Text }[]) =>
    Object.fromEntries(list.map((e) => [e.id, e.name.de]));
  const features = (list: readonly { id: string; features: readonly Feature[] }[]) =>
    Object.fromEntries(list.flatMap((e) => e.features.map((f) => [f.id, f.name.de])));

  it('names the armour', () => {
    expect(de(SRD_52.armor)).toMatchObject({
      leather: 'Lederrüstung',
      shield: 'Schild',
      'chain-mail': 'Kettenpanzer',
      'chain-shirt': 'Kettenhemd',
      'half-plate': 'Plattenpanzer',
      plate: 'Ritterrüstung',
    });
  });

  it('names the weapons', () => {
    expect(de(SRD_52.weapons)).toMatchObject({
      dagger: 'Dolch',
      longsword: 'Langschwert',
      mace: 'Streitkolben',
      battleaxe: 'Streitaxt',
      scimitar: 'Krummsäbel',
      quarterstaff: 'Kampfstab',
      handaxe: 'Beil',
    });
  });

  it('names the skills', () => {
    expect(de(SRD_52.skills)).toMatchObject({
      acrobatics: 'Akrobatik',
      arcana: 'Arkane Kunde',
      athletics: 'Athletik',
      stealth: 'Heimlichkeit',
      'sleight-of-hand': 'Fingerfertigkeit',
      performance: 'Auftreten',
    });
  });

  it('names species, backgrounds, feats and their features', () => {
    expect(de(SRD_52.species)).toMatchObject({ dwarf: 'Zwerg', gnome: 'Gnom' });
    expect(features(SRD_52.species)).toMatchObject({
      'dwarf-darkvision': 'Dunkelsicht',
      'dwarf-dwarven-toughness': 'Zwergische Zähigkeit',
      'dwarf-dwarven-resilience': 'Zwergische Unverwüstlichkeit',
    });
    expect(de(SRD_52.backgrounds)).toMatchObject({ acolyte: 'Akolyth', soldier: 'Soldat' });
    expect(de(SRD_52.feats)).toMatchObject({
      alert: 'Wachsam',
      'magic-initiate': 'Eingeweihter der Magie',
      'savage-attacker': 'Wilder Angreifer',
      skilled: 'Begabt',
    });
    expect(features(SRD_52.feats)).toMatchObject({
      'alert-initiative-proficiency': 'Initiative-Übung',
      'alert-initiative-swap': 'Initiativetausch',
    });
  });

  it('names the classes, their first features and the subclasses', () => {
    expect(de(SRD_52.classes)).toEqual({
      barbarian: 'Barbar',
      bard: 'Barde',
      cleric: 'Kleriker',
      druid: 'Druide',
      fighter: 'Kämpfer',
      monk: 'Mönch',
      paladin: 'Paladin',
      ranger: 'Waldläufer',
      rogue: 'Schurke',
      sorcerer: 'Zauberer',
      warlock: 'Hexenmeister',
      wizard: 'Magier',
    });
    expect(features(SRD_52.classes)).toMatchObject({
      'barbarian-core': 'Hauptmerkmale des Barbaren',
      'barbarian-rage': 'Kampfrausch',
      'barbarian-unarmored-defense': 'Ungerüstete Verteidigung',
      'barbarian-weapon-mastery': 'Waffenbeherrschung',
      'barbarian-danger-sense': 'Gefahrengespür',
      'barbarian-reckless-attack': 'Rücksichtsloser Angriff',
      'bard-core': 'Hauptmerkmale des Barden',
      'bard-bardic-inspiration': 'Bardische Inspiration',
      'bard-spellcasting': 'Zauberwirken',
      'bard-expertise': 'Expertise',
      'bard-jack-of-all-trades': 'Alleskönner',
      'cleric-core': 'Hauptmerkmale des Klerikers',
      'cleric-spellcasting': 'Zauberwirken',
      'cleric-divine-order': 'Göttliche Ordnung',
      'cleric-channel-divinity': 'Göttliche Macht fokussieren',
      'druid-core': 'Hauptmerkmale des Druiden',
      'druid-spellcasting': 'Zauberwirken',
      'druid-druidic': 'Druidisch',
      'druid-primal-order': 'Urtümliche Ordnung',
      'druid-wild-shape': 'Tiergestalt',
      'druid-wild-companion': 'Wilder Gefährte',
      'fighter-core': 'Hauptmerkmale des Kämpfers',
      'fighter-fighting-style': 'Kampfstil',
      'fighter-second-wind': 'Durchschnaufen',
      'fighter-weapon-mastery': 'Waffenbeherrschung',
      'fighter-action-surge': 'Tatendrang',
      'fighter-tactical-mind': 'Taktisches Verständnis',
      'monk-core': 'Hauptmerkmale des Mönchs',
      'monk-martial-arts': 'Kampfkünste',
      'monk-unarmored-defense': 'Ungerüstete Verteidigung',
      'monk-monks-focus': 'Mönchsfokus',
      'monk-unarmored-movement': 'Ungerüstete Bewegung',
      'monk-uncanny-metabolism': 'Unglaublicher Stoffwechsel',
      'paladin-core': 'Hauptmerkmale des Paladins',
      'paladin-lay-on-hands': 'Handauflegen',
      'paladin-spellcasting': 'Zauberwirken',
      'paladin-weapon-mastery': 'Waffenbeherrschung',
      'paladin-fighting-style': 'Kampfstil',
      'paladin-paladins-smite': 'Paladin-Niederstrecken',
      'ranger-core': 'Hauptmerkmale des Waldläufers',
      'ranger-spellcasting': 'Zauberwirken',
      'ranger-favored-enemy': 'Erzfeind',
      'ranger-weapon-mastery': 'Waffenbeherrschung',
      'ranger-deft-explorer': 'Geschickte Erkundung',
      'ranger-fighting-style': 'Kampfstil',
      'rogue-core': 'Hauptmerkmale des Schurken',
      'rogue-expertise': 'Expertise',
      'rogue-sneak-attack': 'Hinterhältiger Angriff',
      'rogue-thieves-cant': 'Diebessprache',
      'rogue-weapon-mastery': 'Waffenbeherrschung',
      'rogue-cunning-action': 'Raffinierte Aktion',
      'sorcerer-core': 'Hauptmerkmale des Zauberers',
      'sorcerer-spellcasting': 'Zauberwirken',
      'sorcerer-innate-sorcery': 'Intuitive Zauberei',
      'sorcerer-font-of-magic': 'Quelle der Magie',
      'sorcerer-metamagic': 'Metamagie',
      'warlock-core': 'Hauptmerkmale des Hexenmeisters',
      'warlock-eldritch-invocations': 'Schauerliche Anrufungen',
      'warlock-pact-magic': 'Paktmagie',
      'warlock-magical-cunning': 'Magische Raffinesse',
      'wizard-core': 'Hauptmerkmale des Magiers',
      'wizard-spellcasting': 'Zauberwirken',
      'wizard-ritual-adept': 'Ritual-Adept',
      'wizard-arcane-recovery': 'Arkane Erholung',
      'wizard-scholar': 'Gelehrter',
    });
    expect(de(SRD_52.subclasses)).toEqual({
      'barbarian/path-of-the-berserker': 'Pfad des Berserkers',
      'bard/college-of-lore': 'Schule des Wissens',
      'cleric/life-domain': 'Domäne des Lebens',
      'druid/circle-of-the-land': 'Zirkel des Landes',
      'fighter/champion': 'Champion',
      'monk/warrior-of-the-open-hand': 'Krieger der Offenen Hand',
      'paladin/oath-of-devotion': 'Schwur der Hingabe',
      'ranger/hunter': 'Jäger',
      'rogue/thief': 'Dieb',
      'sorcerer/draconic-sorcery': 'Drakonische Zauberei',
      'warlock/fiend-patron': 'Unhold-Schutzherr',
      'wizard/evoker': 'Hervorrufer',
    });
  });
});
