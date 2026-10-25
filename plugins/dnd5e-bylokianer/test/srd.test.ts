import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import { SRD_NPCS } from '../src/npc/srd';
import { modifier, parseStatblock } from '../src/npc/statblock';

// AC, HP, CR and the first action of each SRD 5.1 NPC, read off the SRD itself.
const SRD: Record<string, [number, number, string, string]> = {
  Acolyte: [10, 9, '1/4', 'Club'],
  Archmage: [12, 99, '12', 'Dagger'],
  Assassin: [15, 78, '8', 'Multiattack'],
  Bandit: [12, 11, '1/8', 'Scimitar'],
  'Bandit Captain': [15, 65, '2', 'Multiattack'],
  Berserker: [13, 67, '2', 'Greataxe'],
  Commoner: [10, 4, '0', 'Club'],
  'Cult Fanatic': [13, 33, '2', 'Multiattack'],
  Cultist: [12, 9, '1/8', 'Scimitar'],
  Druid: [11, 27, '2', 'Quarterstaff'],
  Gladiator: [16, 112, '5', 'Multiattack'],
  Guard: [16, 11, '1/8', 'Spear'],
  Knight: [18, 52, '3', 'Multiattack'],
  Mage: [12, 40, '6', 'Dagger'],
  Noble: [15, 9, '1/8', 'Rapier'],
  Priest: [13, 27, '2', 'Mace'],
  Scout: [13, 16, '1/2', 'Multiattack'],
  Spy: [12, 27, '1', 'Multiattack'],
  Thug: [11, 32, '1/2', 'Multiattack'],
  'Tribal Warrior': [12, 11, '1/8', 'Spear'],
  Veteran: [17, 58, '3', 'Multiattack'],
};

describe('SRD NPCs', () => {
  it('holds all 21 NPCs of the SRD 5.1 appendix', () => {
    expect(SRD_NPCS.map((a) => a.name).sort()).toEqual(Object.keys(SRD).sort());
  });

  it.each(SRD_NPCS.map((a) => [a.name, a] as const))('%s parses and matches the SRD', (name, a) => {
    const block = parseStatblock(parse(a.yaml));
    const [ac, hp, cr, action] = SRD[name] ?? [];
    expect(block.unreadable).toEqual([]);
    expect(block.extra).toEqual({});
    expect([block.name, block.ac, block.hp, block.cr, a.cr]).toEqual([name, ac, hp, cr, cr]);
    expect(block.actions[0]?.name).toBe(action);
    expect(block.stats).toHaveLength(6);
  });

  it.each(SRD_NPCS.map((a) => [a.name, a] as const))(
    '%s: hit points are the average of its hit dice plus Constitution',
    (_name, a) => {
      const block = parseStatblock(parse(a.yaml));
      const [, count = '0', die = '0'] = /^(\d+)d(\d+)/.exec(block.hitDice ?? '') ?? [];
      const n = Number(count);
      const con = modifier(block.stats?.[2] ?? 10);
      expect(block.hitDice).toBe(
        con === 0 ? `${n}d${die}` : `${n}d${die} ${con > 0 ? '+' : '-'} ${Math.abs(con * n)}`,
      );
      expect(block.hp).toBe(Math.floor((n * (Number(die) + 1)) / 2) + con * n);
    },
  );

  it('keeps special details: AC with a spell, a slower speed, reactions', () => {
    const get = (name: string) => {
      const yaml = SRD_NPCS.find((a) => a.name === name)?.yaml;
      return parseStatblock(yaml === undefined ? null : parse(yaml));
    };
    expect(get('Mage').acClass).toBe('15 with mage armor');
    expect(get('Priest').speed).toBe('25 ft.');
    expect(get('Knight').reactions.map((r) => r.name)).toEqual(['Parry']);
    expect(get('Archmage').damageResistances).toContain('damage from spells');
  });
});
