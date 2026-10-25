import { describe, expect, it } from 'vitest';

import { readEncounter } from '../src/battle/encounter';
import { battleEvents, battleLine } from '../src/battle/log';
import {
  addCondition,
  addFighter,
  begin,
  damage,
  deathSave,
  type Fight,
  type Fighter,
  heal,
  isDead,
  isDefeated,
  isDown,
  nextTurn,
  nudge,
  previousTurn,
  removeCombatant,
  removeCondition,
  rollFor,
  setConcentration,
  setInit,
  setTemp,
  setUp,
} from '../src/battle/fight';
import { baseName, combatLines, readCombat, restore, withCombat } from '../src/battle/table';
import { loadExampleVault } from './fixture';

const fighter = (name: string, more: Partial<Fighter> = {}): Fighter => ({
  name,
  side: 'enemy',
  pc: false,
  ac: 12,
  maxHp: 10,
  initBonus: 0,
  dex: 10,
  path: null,
  monster: null,
  xp: null,
  group: null,
  ...more,
});

/** Random numbers giving these d20 rolls, in order. */
const rolls = (...faces: number[]) => {
  const queue = faces.map((f) => (f - 0.5) / 20);
  return () => queue.shift() ?? 0;
};

const byId = (f: Fight, id: string) => {
  const c = f.combatants.find((x) => x.id === id);
  if (c === undefined) throw new Error(id);
  return c;
};

describe('encounter notes', () => {
  it('reads the example vault’s encounter: notes, inline combatants and a monster', () => {
    const note = loadExampleVault().find((n) => n.path.endsWith('Ambush under the second arch.md'));
    const spec = readEncounter(note?.frontmatter);
    expect(spec.party).toBe(true);
    expect(spec.combatants.map((c) => [c.kind, 'link' in c ? c.link : c.name, c.count])).toEqual([
      ['note', 'Tessaly Vane', 1],
      ['note', 'Orrin Quill', 1],
      ['note', 'Dagny', 1],
      ['note', 'Ilex', 1],
      ['note', 'Sable', 1],
      ['inline', 'Court thug', 4],
      ['inline', 'Court sharpshooter', 2],
      ['monster', 'Bridge rat', 3],
    ]);
    expect(spec.combatants[7]).toMatchObject({ monster: 'Giant Rat' });
    expect(spec.combatants[5]).toMatchObject({ ac: 11, hp: 32, initiative: 0, side: 'enemy' });
    expect(spec.combatants[4]).toMatchObject({ side: 'enemy' });
  });

  it('reads monsters, counts and party: false, and skips what names nothing', () => {
    const spec = readEncounter({
      party: false,
      combatants: [
        { monster: 'Owlbear', count: 2 },
        { monster: 'Goblin', name: 'Snik', side: 'ally' },
        {},
        7,
        '',
      ],
    });
    expect(spec.party).toBe(false);
    expect(spec.combatants).toEqual([
      { kind: 'monster', monster: 'Owlbear', name: null, side: null, count: 2 },
      { kind: 'monster', monster: 'Goblin', name: 'Snik', side: 'ally', count: 1 },
    ]);
  });
});

describe('a fight', () => {
  const thugs = [1, 2, 3].map(() => fighter('Thug', { group: 'Thug', initBonus: 2 }));
  const fighters = [
    fighter('Dagny', { pc: true, side: 'party', maxHp: 71, dex: 14, path: 'Party/Dagny.md' }),
    ...thugs,
    fighter('Sable', { initBonus: 4, dex: 18 }),
  ];

  it('numbers a group, rolls once for it, leaves characters to the GM, sorts with Dexterity', () => {
    const f = setUp(fighters, rolls(10, 6));
    expect(f.round).toBe(0);
    expect(f.combatants.map((c) => [c.id, c.init])).toEqual([
      ['Thug 1', 12],
      ['Thug 2', 12],
      ['Thug 3', 12],
      ['Sable', 10],
      ['Dagny', null],
    ]);
    const typed = setInit(f, 'Dagny', 12);
    expect(typed.combatants.map((c) => c.id)).toEqual([
      'Dagny',
      'Thug 1',
      'Thug 2',
      'Thug 3',
      'Sable',
    ]);
    expect(rollFor(f, 'Dagny', rolls(20)).combatants[0]?.init).toBe(20);
    expect(
      nudge(typed, 'Thug 1', -1)
        .combatants.map((c) => c.id)
        .slice(0, 2),
    ).toEqual(['Thug 1', 'Dagny']);
  });

  it('turns skip the defeated, rounds count up, durations count down at the turn’s end', () => {
    let f = begin(setInit(setUp(fighters, rolls(10, 6)), 'Dagny', 15));
    expect([f.round, f.turn]).toEqual([1, 'Dagny']);
    f = addCondition(f, 'Dagny', 'prone', 1);
    f = damage(f, 'Thug 1', 10).fight;
    expect(isDefeated(byId(f, 'Thug 1'))).toBe(true);
    f = nextTurn(f);
    expect(f.turn).toBe('Thug 2');
    expect(byId(f, 'Dagny').conditions).toEqual([]);
    f = nextTurn(nextTurn(f));
    expect(f.turn).toBe('Sable');
    f = nextTurn(f);
    expect([f.round, f.turn]).toEqual([2, 'Dagny']);
    f = previousTurn(f);
    expect([f.round, f.turn]).toEqual([1, 'Sable']);
  });

  it('takes damage from temporary hit points first and reminds of concentration', () => {
    let f = setUp(fighters, rolls(10, 6));
    f = setTemp(f, 'Sable', 5);
    f = setTemp(f, 'Sable', 3);
    f = setConcentration(f, 'Sable', true);
    const hit = damage(f, 'Sable', 7);
    expect(byId(hit.fight, 'Sable')).toMatchObject({ temp: 0, hp: 8, concentration: true });
    expect(hit.concentrationDc).toBe(10);
    const big = damage(
      setUp(
        fighters.map((x) => ({ ...x, maxHp: 50 })),
        rolls(10, 6),
      ),
      'Sable',
      30,
    );
    expect(big.concentrationDc).toBeNull();
    const conc = damage(
      setConcentration(
        setUp(
          fighters.map((x) => ({ ...x, maxHp: 50 })),
          rolls(10, 6),
        ),
        'Sable',
        true,
      ),
      'Sable',
      30,
    );
    expect(conc.concentrationDc).toBe(15);
    expect(byId(damage(hit.fight, 'Sable', 20).fight, 'Sable')).toMatchObject({
      hp: 0,
      concentration: false,
    });
  });

  it('downs a character with death saves; healing brings them back; three failures kill', () => {
    let f = damage(setUp(fighters, rolls(10, 6)), 'Dagny', 80).fight;
    expect(isDown(byId(f, 'Dagny'))).toBe(true);
    f = deathSave(deathSave(f, 'Dagny', true), 'Dagny', false);
    expect(byId(f, 'Dagny').saves).toEqual({ ok: 1, fail: 1 });
    f = damage(f, 'Dagny', 3).fight;
    expect(byId(f, 'Dagny').saves.fail).toBe(2);
    const up = heal(f, 'Dagny', 5);
    expect(byId(up, 'Dagny')).toMatchObject({ hp: 5, saves: { ok: 0, fail: 0 } });
    expect(isDead(byId(deathSave(f, 'Dagny', false), 'Dagny'))).toBe(true);
    expect(byId(heal(up, 'Dagny', 500), 'Dagny').hp).toBe(71);
  });

  it('adds, changes and removes conditions', () => {
    let f = setUp(fighters, rolls(10, 6));
    f = addCondition(f, 'Sable', 'poisoned', null);
    f = addCondition(f, 'Sable', 'poisoned', 3);
    expect(byId(f, 'Sable').conditions).toEqual([{ name: 'poisoned', rounds: 3 }]);
    expect(byId(removeCondition(f, 'Sable', 'poisoned'), 'Sable').conditions).toEqual([]);
  });
});

describe('the combat table', () => {
  const fighters = [
    fighter('Dagny', { pc: true, side: 'party', maxHp: 71, path: 'Party/Dagny.md' }),
    fighter('Thug', { group: 'Thug' }),
    fighter('Thug', { group: 'Thug' }),
  ];
  let f = begin(setInit(setUp(fighters, rolls(8)), 'Dagny', 15));
  f = setTemp(addCondition(damage(f, 'Dagny', 17).fight, 'Dagny', 'prone', 1), 'Dagny', 5);
  f = setConcentration(f, 'Dagny', true);
  f = damage(f, 'Thug 2', 99).fight;

  it('writes the fight as a table and reads it back', () => {
    const lines = combatLines(f);
    expect(lines).toEqual([
      '',
      'Round 1 · Turn: Dagny',
      '',
      '| Init | Combatant | HP | AC | Conditions |',
      '| ---: | --- | ---: | ---: | --- |',
      '| 15 | [[Dagny]] | 54/71 +5 | 12 | prone (1), concentration |',
      '| 8 | Thug 1 | 10/10 | 12 |  |',
      '| 8 | Thug 2 | 0/10 | 12 | defeated |',
      '',
    ]);
    const text = withCombat('---\ntype: encounter\n---\n\n# Ambush\n\nTactics.\n', lines);
    const table = readCombat(text);
    expect(table).toMatchObject({ round: 1, turn: 'Dagny', ended: false });
    const back = restore(table!, setUp(fighters, rolls(1)));
    expect(back).toEqual(f);
  });

  it('changes only its own section and keeps what follows', () => {
    const before = '# Ambush\n\n## Combat\n\nold\n\n## Aftermath\n\nLoot.\n';
    const after = withCombat(before, combatLines(f, true));
    expect(after.startsWith('# Ambush\n\n## Combat\n\nEnded after 1 round\n')).toBe(true);
    expect(after.endsWith('## Aftermath\n\nLoot.\n')).toBe(true);
    expect(readCombat(after)?.ended).toBe(true);
  });

  it('reads down and dead characters, and rows nobody matches', () => {
    const text = withCombat('', [
      '',
      'Round 2 · Turn: Ghost',
      '',
      '| Init | Combatant | HP | AC | Conditions |',
      '| --- | --- | --- | --- | --- |',
      '| 12 | [[Dagny]] | 0/71 | 15 | down ✓✓✗ |',
      '| — | Ghost | 3/9 | — | frightened (2), custom thing |',
    ]);
    const back = restore(readCombat(text)!, setUp(fighters, rolls(1)));
    expect(byId(back, 'Dagny')).toMatchObject({ hp: 0, saves: { ok: 2, fail: 1 }, pc: true });
    expect(byId(back, 'Ghost')).toMatchObject({
      init: null,
      ac: null,
      maxHp: 9,
      conditions: [
        { name: 'frightened', rounds: 2 },
        { name: 'custom thing', rounds: null },
      ],
    });
  });
});

describe('a fight changing mid-way (B2)', () => {
  const fighters = [
    fighter('Owlbear', { group: 'Owlbear', initBonus: 1, xp: 700 }),
    fighter('Owlbear', { group: 'Owlbear', initBonus: 1, xp: 700 }),
    fighter('Sable', { initBonus: 4, dex: 18 }),
    fighter('Dagny', { pc: true, side: 'party', maxHp: 71 }),
  ];

  it('adds a group member with its number and roll, and others where their roll puts them', () => {
    let f = begin(setInit(setUp(fighters, rolls(10, 2)), 'Dagny', 15));
    expect(f.combatants.map((c) => c.id)).toEqual(['Dagny', 'Owlbear 1', 'Owlbear 2', 'Sable']);
    // The GM nudged Sable above the owlbears; adding must not undo it.
    f = nudge(nudge(f, 'Sable', -1), 'Sable', -1);
    const third = addFighter(f, fighter('Owlbear', { group: 'Owlbear', initBonus: 1 }), rolls(20));
    expect(third.id).toBe('Owlbear 3');
    expect(byId(third.fight, 'Owlbear 3').init).toBe(11);
    expect(third.fight.combatants.map((c) => c.id)).toEqual([
      'Dagny',
      'Sable',
      'Owlbear 1',
      'Owlbear 2',
      'Owlbear 3',
    ]);
    const rat = addFighter(third.fight, fighter('Rat', { group: 'Rat' }), rolls(13));
    expect(rat.id).toBe('Rat');
    expect(rat.fight.combatants.map((c) => c.id).indexOf('Rat')).toBe(1);
    expect(addFighter(rat.fight, fighter('Rat', { group: 'Rat' }), rolls(1)).id).toBe('Rat 2');
    expect(addFighter(rat.fight, fighter('Sable'), rolls(1)).id).toBe('Sable (2)');
    // A character waits for a number at the end.
    const pc = addFighter(f, fighter('Ilex', { pc: true }), rolls(20));
    expect(byId(pc.fight, 'Ilex').init).toBeNull();
    expect(pc.fight.combatants[pc.fight.combatants.length - 1]?.id).toBe('Ilex');
  });

  it('removes a combatant and passes its turn on', () => {
    const f = begin(setInit(setUp(fighters, rolls(10, 2)), 'Dagny', 15));
    const atEnd = { ...f, turn: 'Sable' };
    expect(removeCombatant(atEnd, 'Sable')).toMatchObject({ round: 2, turn: 'Dagny' });
    expect(removeCombatant(f, 'Dagny')).toMatchObject({ round: 1, turn: 'Owlbear 1' });
    expect(removeCombatant(f, 'Owlbear 2').combatants).toHaveLength(3);
    expect(removeCombatant(f, 'Nobody')).toBe(f);
  });

  it('logs begin, defeated, down, dead and the end with the XP of defeated enemies', () => {
    const start = setInit(setUp(fighters, rolls(10, 2)), 'Dagny', 15);
    expect(battleEvents(null, start, false, false)).toEqual([]);
    const one = begin(start);
    expect(battleEvents(start, one, false, false)).toEqual([{ kind: 'begin' }]);
    const owl = damage(one, 'Owlbear 1', 99).fight;
    const down = damage(owl, 'Dagny', 71).fight;
    expect(battleEvents(one, down, false, false)).toEqual([
      { kind: 'down', id: 'Dagny', round: 1 },
      { kind: 'defeated', id: 'Owlbear 1', round: 1 },
    ]);
    const dead = deathSave(
      deathSave(deathSave(down, 'Dagny', false), 'Dagny', false),
      'Dagny',
      false,
    );
    expect(battleEvents(down, dead, false, false)).toEqual([
      { kind: 'dead', id: 'Dagny', round: 1 },
    ]);
    const end = battleEvents(dead, dead, true, false);
    expect(end).toEqual([{ kind: 'end', rounds: 1, xp: 700 }]);
    expect(battleEvents(dead, dead, true, true)).toEqual([]);
    const link = '[[Ambush]]';
    expect(battleLine({ kind: 'begin' }, link)).toBe('Combat begins: [[Ambush]]');
    expect(battleLine({ kind: 'defeated', id: 'Owlbear 1', round: 3 }, link)).toBe(
      'Round 3: Owlbear 1 defeated',
    );
    expect(battleLine({ kind: 'down', id: 'Dagny', round: 3 }, link)).toBe(
      'Round 3: Dagny is down',
    );
    expect(battleLine({ kind: 'dead', id: 'Dagny', round: 4 }, link)).toBe('Round 4: Dagny dies');
    expect(battleLine({ kind: 'end', rounds: 5, xp: 1400 }, link)).toBe(
      'Combat ends after 5 rounds — 1,400 XP',
    );
    expect(battleLine({ kind: 'end', rounds: 1, xp: 0 }, link)).toBe('Combat ends after 1 round');
  });

  it('restores combatants added mid-fight from the extras, by their base name', () => {
    expect(baseName('Owlbear 3')).toBe('Owlbear');
    expect(baseName('Sable (2)')).toBe('Sable');
    expect(baseName('Thug')).toBe('Thug');
    const f = begin(setInit(setUp(fighters, rolls(10, 2)), 'Dagny', 15));
    const added = addFighter(
      f,
      fighter('Owlbear', { group: 'Owlbear', monster: 'owlbear', xp: 700 }),
      rolls(5),
    ).fight;
    const table = readCombat(withCombat('', combatLines(removeCombatant(added, 'Sable'))))!;
    const extras = new Map([
      ['Owlbear 3', fighter('Owlbear', { group: 'Owlbear', monster: 'owlbear', xp: 700 })],
    ]);
    const back = restore(table, setUp(fighters, rolls(10, 2)), extras);
    expect(back.combatants.map((c) => c.id)).toEqual([
      'Dagny',
      'Owlbear 1',
      'Owlbear 2',
      'Owlbear 3',
    ]);
    expect(byId(back, 'Owlbear 3')).toMatchObject({
      monster: 'owlbear',
      xp: 700,
      group: 'Owlbear',
    });
  });
});
