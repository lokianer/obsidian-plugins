import { derive, levelOptions, loadRules, SRD_52 } from '@obsidian-plugins/rules';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import {
  type CharacterDraft,
  characterNoteText,
  draftProblems,
  emptyDraft,
  rollAbilities,
  toCharacter,
} from '../src/character/draft';
import { computedKeys, differs, readCharacter } from '../src/character/note';

const rules = loadRules([SRD_52]);

/** Fills every open slot of the draft with its first allowed options (ability points spread). */
function fill(draft: CharacterDraft): CharacterDraft {
  for (let round = 0; round < 6; round++) {
    const c = toCharacter(draft, rules);
    const slots = [...levelOptions(c, rules, null), ...levelOptions(c, rules, 1)];
    for (const slot of slots) {
      if (slot.chosen.length >= slot.wanted) continue;
      if (slot.choice.gives === 'ability') {
        const each = slot.each ?? slot.wanted;
        const ids = slot.options.map((o) => o.id);
        const out: string[] = [];
        for (let i = 0; i < slot.wanted; i++) {
          out.push(
            ids.find((id) => out.filter((x) => x === id).length < each && !out.includes(id)) ??
              ids[i % ids.length]!,
          );
        }
        draft.choices[slot.key] = out;
      } else if (slot.options.length > 0) {
        draft.choices[slot.key] = slot.options.slice(0, slot.wanted).map((o) => o.id);
      }
    }
  }
  return draft;
}

function humanFighter(): CharacterDraft {
  const d = emptyDraft();
  d.name = 'Brin Holt';
  d.player = 'Ana';
  d.species = 'human';
  d.background = 'soldier';
  d.class = 'fighter';
  d.method = 'standard';
  d.abilities = { str: 15, dex: 13, con: 14, int: 8, wis: 10, cha: 12 };
  d.armor = 'chain-mail';
  d.shield = true;
  d.weapons = ['longsword'];
  return fill(d);
}

describe('toCharacter', () => {
  it('builds a human fighter with no missing ids', () => {
    const d = humanFighter();
    expect(draftProblems(d, rules)).toEqual([]);
    const c = toCharacter(d, rules);
    expect(c.rules).toBe('2024');
    expect(c.levels).toHaveLength(1);
    expect(c.levels[0]).toMatchObject({ class: 'fighter', hp: 'max' });
    expect(c.inventory.every((i) => i.equipped === true)).toBe(true);
    expect(derive(c, rules).missing).toEqual([]);
  });

  it('drops the keys of a species no longer chosen', () => {
    const d = emptyDraft();
    d.species = 'elf';
    d.background = 'soldier';
    d.class = 'fighter';
    fill(d);
    const elfKeys = Object.keys(d.choices).filter((k) => k.startsWith('elf-'));
    expect(elfKeys.length).toBeGreaterThan(0);
    d.species = 'human';
    const c = toCharacter(d, rules);
    const all = [...Object.keys(c.choices), ...Object.keys(c.levels[0]!.choices)];
    expect(all.some((k) => k.startsWith('elf-'))).toBe(false);
  });
});

describe('toCharacter, the class changed', () => {
  it('drops the fighter-* keys once the class is a wizard', () => {
    const d = humanFighter();
    const before = toCharacter(d, rules);
    expect(Object.keys(before.levels[0]!.choices).some((k) => k.startsWith('fighter-'))).toBe(true);
    d.class = 'wizard';
    const c = toCharacter(d, rules);
    const all = [...Object.keys(c.choices), ...Object.keys(c.levels[0]!.choices)];
    expect(all.some((k) => k.startsWith('fighter-'))).toBe(false);
  });
});

describe('draftProblems', () => {
  const abilitiesOf = (d: CharacterDraft) => draftProblems(d, rules).includes('abilities');
  it('checks the point buy', () => {
    const d = humanFighter();
    d.method = 'point-buy';
    d.abilities = { str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 };
    expect(abilitiesOf(d)).toBe(false);
    d.abilities = { str: 15, dex: 15, con: 15, int: 15, wis: 8, cha: 8 };
    expect(abilitiesOf(d)).toBe(true);
    d.abilities = { str: 16, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
    expect(abilitiesOf(d)).toBe(true);
  });

  it('checks the standard array, rolled and typed scores', () => {
    const d = humanFighter();
    d.abilities = { str: 15, dex: 15, con: 13, int: 12, wis: 10, cha: 8 };
    expect(abilitiesOf(d)).toBe(true);
    d.method = 'rolled';
    d.rolled = [15, 15, 13, 12, 10, 8];
    expect(abilitiesOf(d)).toBe(false);
    d.rolled = [16, 15, 13, 12, 10, 8];
    expect(abilitiesOf(d)).toBe(true);
    d.method = 'typed';
    d.abilities = { str: 18, dex: 3, con: 10, int: 10, wis: 10, cha: 10 };
    expect(abilitiesOf(d)).toBe(false);
    d.abilities.str = 19;
    expect(abilitiesOf(d)).toBe(true);
  });

  it('reports empty basics', () => {
    expect(draftProblems(emptyDraft(), rules)).toEqual(
      expect.arrayContaining(['name', 'species', 'background', 'class']),
    );
  });

  it('reports ability points over the limit per ability', () => {
    const d = humanFighter();
    d.choices['soldier-ability-scores/abilities'] = ['dex', 'dex', 'dex'];
    expect(draftProblems(d, rules)).toContain('choice:soldier-ability-scores/abilities');
  });

  it('reports a short choice', () => {
    const d = humanFighter();
    d.choices['origin-languages/languages'] = [];
    expect(draftProblems(d, rules)).toContain('choice:origin-languages/languages');
  });
});

describe('rollAbilities', () => {
  it('drops the lowest of each four dice', () => {
    const seq = [
      ...[6, 5, 4, 1],
      ...[3, 3, 3, 3],
      ...[1, 1, 1, 1],
      ...[6, 6, 6, 6],
      ...[2, 4, 4, 6],
      ...[5, 1, 2, 3],
    ];
    let i = 0;
    expect(rollAbilities(() => seq[i++]!)).toEqual([15, 9, 3, 18, 14, 10]);
    expect(i).toBe(24);
  });
});

describe('characterNoteText', () => {
  it('reads back as the same character with matching computed keys', () => {
    const d = humanFighter();
    const text = characterNoteText(d, rules);
    const fm = parse(text.split('---')[1]!) as Record<string, unknown>;
    const c = toCharacter(d, rules);
    expect(fm.type).toBe('character');
    expect(fm.tags).toEqual(['pc']);
    expect(readCharacter(fm)).toEqual(c);
    const keys = computedKeys(c, rules);
    expect(keys).not.toBeNull();
    expect(differs(fm, keys!)).toBe(false);
    expect(text).toContain('# Brin Holt');
    expect(text).toMatch(/abilities: \{ str: 15,/);
  });
});
