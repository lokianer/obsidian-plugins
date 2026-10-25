import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import {
  addEntry,
  editScalar,
  removeEntry,
  setAbility,
  setEntryField,
  type BlockResult,
} from '../src/npc/block-edit';
import { findStatblocks, parseStatblock } from '../src/npc/statblock';
import { readExampleNote } from './fixture';

const aldric = readExampleNote('Silverstadt/Factions/Order of the Lantern/Aldric Thane.md');
const open = findStatblocks(aldric)[0]?.open ?? -1;
const text = (r: BlockResult) => {
  if (!r.ok) throw new Error(`refused: ${r.refusal.code}`);
  return r.text;
};
const block = (t: string) => parseStatblock(parse(findStatblocks(t)[0]?.source ?? ''));
/** The lines that differ between two texts, as [before, after] pairs. */
const changed = (a: string, b: string) => {
  const [x, y] = [a.split('\n'), b.split('\n')];
  return x.flatMap((line, i) => (line === y[i] ? [] : [[line, y[i]]]));
};

describe('scalars in a block', () => {
  it('sets AC and adds a missing key, changing only those lines', () => {
    const ac = text(
      editScalar(aldric, open, { op: 'set-scalar', key: 'ac', expect: 18, value: 19 }),
    );
    expect(changed(aldric, ac)).toEqual([['ac: 18', 'ac: 19']]);
    expect(block(ac).ac).toBe(19);
    const note = text(
      editScalar(aldric, open, {
        op: 'set-scalar',
        key: 'ac_class',
        expect: null,
        value: 'plate, shield',
      }),
    );
    expect(block(note).acClass).toBe('plate, shield');
    expect(note.split('\n').length).toBe(aldric.split('\n').length + 1);
  });

  it('refuses a value changed since, and a block that is gone', () => {
    expect(
      editScalar(aldric, open, { op: 'set-scalar', key: 'hp', expect: 50, value: 60 }),
    ).toEqual({
      ok: false,
      refusal: { code: 'changed' },
    });
    expect(editScalar(aldric, 0, { op: 'set-scalar', key: 'hp', expect: 52, value: 60 }).ok).toBe(
      false,
    );
  });

  it('keeps CRLF line endings', () => {
    const crlf = aldric.replace(/\n/g, '\r\n');
    const r = text(editScalar(crlf, open, { op: 'set-scalar', key: 'hp', expect: 52, value: 60 }));
    expect(r).toBe(crlf.replace('hp: 52', 'hp: 60'));
  });
});

describe('abilities', () => {
  it('changes one number of the stats list, kept as a list', () => {
    const r = text(setAbility(aldric, open, 1, 11, 14));
    expect(changed(aldric, r)).toEqual([
      ['stats: [16, 11, 14, 11, 13, 15]', 'stats: [16, 14, 14, 11, 13, 15]'],
    ]);
    expect(setAbility(aldric, open, 1, 12, 14)).toEqual({
      ok: false,
      refusal: { code: 'changed' },
    });
  });
});

describe('entries', () => {
  it('changes an action’s name and description, quoting where YAML needs it', () => {
    const named = text(
      setEntryField(aldric, open, 'actions', 1, 'name', 'Lay on Hands', 'Healing Touch'),
    );
    expect(block(named).actions[1]?.name).toBe('Healing Touch');
    const desc = text(
      setEntryField(
        aldric,
        open,
        'actions',
        1,
        'desc',
        block(aldric).actions[1]?.desc ?? '',
        'Heals: 10 HP.',
      ),
    );
    expect(block(desc).actions[1]?.desc).toBe('Heals: 10 HP.');
    expect(changed(aldric, desc)).toHaveLength(1);
    expect(setEntryField(aldric, open, 'actions', 1, 'name', 'Wrong', 'X').ok).toBe(false);
  });

  it('adds at the end of a list, or starts a missing list', () => {
    const added = text(
      addEntry(aldric, open, 'actions', 'Shield Bash', 'Melee Weapon Attack: +5 to hit.'),
    );
    expect(block(added).actions.map((a) => a.name)).toEqual([
      'Vigil (+2 longsword)',
      'Lay on Hands',
      'Shield Bash',
    ]);
    expect(block(added).reactions).toHaveLength(1);
    const started = text(addEntry(aldric, open, 'bonus_actions', 'Rally', 'An ally regains 5 HP.'));
    expect(block(started).bonusActions).toEqual([{ name: 'Rally', desc: 'An ally regains 5 HP.' }]);
  });

  it('removes exactly that entry when its name still matches', () => {
    const removed = text(removeEntry(aldric, open, 'actions', 0, 'Vigil (+2 longsword)'));
    expect(block(removed).actions.map((a) => a.name)).toEqual(['Lay on Hands']);
    expect(block(removed).reactions).toHaveLength(1);
    expect(removeEntry(aldric, open, 'actions', 0, 'Lay on Hands').ok).toBe(false);
  });
});
