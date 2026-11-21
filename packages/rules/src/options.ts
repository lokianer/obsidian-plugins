// Every open choice of a level (or of creation) with all its allowed options: what the dialog of the
// character builder offers. Values the character already has from elsewhere are left out; a slot's
// own values stay, so the dialog can show them as chosen. Pure.

import { ABILITIES, type Ability } from './basics';
import type { Character } from './character';
import { collect, growingValues, type Placed } from './collect';
import type { Rules } from './data';
import { derive } from './derive';
import type { Amount, Choice, Text } from './model';
import { maxSpellLevel } from './spellcasting';

export interface ChoiceSlot {
  /** `<feature id>/<choice id>`, the key in `choices`. */
  key: string;
  /** The character level of the entry it is stored in; null for creation (`character.choices`). */
  at: number | null;
  feature: { id: string; name: Text };
  choice: Choice;
  /** How many this level adds: count(k) − count(k−1) for growing choices. */
  wanted: number;
  /** What the entry holds for it now. */
  chosen: string[];
  /** Every allowed value with its name; empty for spells (the plugin lists them). */
  options: { id: string; name: Text }[];
  /** For spell choices: the class list and the highest level, 0 for cantrips. */
  spells?: { list: string; maxLevel: number };
  /** For ability points: the most points one ability may take. */
  each?: number;
}

const ABILITY_NAMES: Record<Ability, Text> = {
  str: { en: 'Strength', de: 'Stärke' },
  dex: { en: 'Dexterity', de: 'Geschicklichkeit' },
  con: { en: 'Constitution', de: 'Konstitution' },
  int: { en: 'Intelligence', de: 'Intelligenz' },
  wis: { en: 'Wisdom', de: 'Weisheit' },
  cha: { en: 'Charisma', de: 'Charisma' },
};

type Option = ChoiceSlot['options'][number];

export function levelOptions(character: Character, rules: Rules, at: number | null): ChoiceSlot[] {
  const { placed } = collect(character, rules);
  const sheet = derive(character, rules);
  const level = character.levels.length;
  const feats = new Set(placed.map((p) => p.from));
  const options = new Set(placed.map((p) => p.feature.id));

  const amount = (a: Amount, owner: string | null): number => {
    if (typeof a === 'number') return a;
    if ('ability' in a) return sheet.abilities[a.ability].modifier;
    if ('proficiency' in a) return sheet.proficiency;
    const owned = sheet.classes.find((c) => c.id === owner)?.level ?? level;
    return a.byLevel[Math.max(1, owned) - 1] ?? 0;
  };

  const named = (id: string, name: Text | undefined): Option => ({ id, name: name ?? { en: id } });

  const slots: ChoiceSlot[] = [];
  for (const p of placed) {
    for (const choice of p.feature.choices) {
      const key = `${p.feature.id}/${choice.id}`;
      const growing = growingValues(character, p.owner, p.feature, choice);
      let wanted: number;
      let chosen: string[];
      if (growing === null) {
        if (p.at !== at) continue;
        wanted = amount(choice.count, p.owner);
        chosen = p.choices[key] ?? [];
      } else {
        const entry = growing.find((g) => g.at === at);
        if (entry === undefined) continue;
        const byLevel = (choice.count as { byLevel: number[] }).byLevel;
        const now = byLevel[entry.classLevel - 1] ?? 0;
        const before =
          entry.classLevel <= p.feature.level ? 0 : (byLevel[entry.classLevel - 2] ?? 0);
        wanted = now - before;
        chosen = entry.values;
      }
      if (wanted <= 0) continue;
      const slot: ChoiceSlot = {
        key,
        at,
        feature: { id: p.feature.id, name: p.feature.name },
        choice,
        wanted,
        chosen,
        options: [],
      };
      const from = choice.from;
      if ('abilities' in from && from.each !== undefined) slot.each = from.each;
      if ('spells' in from) {
        const maxLevel = spellLevel(from.level, p);
        slot.spells = { list: from.spells, maxLevel };
      } else {
        slot.options = offered(choice).filter((o) => chosen.includes(o.id) || !has(choice, o.id));
      }
      slots.push(slot);
    }
  }
  return slots;

  /** The highest spell level of a spell choice: a number, or the class's table. */
  function spellLevel(kind: unknown, p: Placed): number {
    if (typeof kind === 'number') return kind;
    if (kind === 'cantrip') return 0;
    const classId = p.owner;
    const casting = placed
      .filter((o) => o.owner === classId)
      .flatMap((o) => o.feature.grants)
      .find((g) => g.kind === 'spellcasting');
    if (casting === undefined) return 0;
    // The class's level when this entry was taken.
    const upTo = character.levels.slice(0, at ?? level).filter((e) => e.class === classId).length;
    return maxSpellLevel(casting.progression, upTo);
  }

  /** Whether the character already has this value from somewhere. */
  function has(choice: Choice, id: string): boolean {
    switch (choice.gives) {
      case 'skill':
        return (sheet.skills[id]?.rank ?? 0) >= 1;
      case 'expertise':
        return sheet.skills[id]?.rank === 2;
      case 'tool':
        return sheet.proficiencies.tool.includes(id);
      case 'language':
        return sheet.proficiencies.language.includes(id);
      case 'mastery':
        return sheet.masteries.includes(id);
      case 'option':
        return options.has(id);
      case 'feat':
        return feats.has(id) && rules.feat(id)?.repeatable !== true;
      default:
        return false;
    }
  }

  function offered(choice: Choice): Option[] {
    const from = choice.from;
    if ('skills' in from) {
      const listed = Array.isArray(from.skills) ? from.skills : rules.data.skills.map((s) => s.id);
      // Expertise needs the proficiency first.
      const ids =
        choice.gives === 'expertise' || from.skills === 'proficient'
          ? listed.filter((id) => (sheet.skills[id]?.rank ?? 0) >= 1)
          : listed;
      return ids.map((id) => named(id, rules.skill(id)?.name));
    }
    if ('abilities' in from) {
      return from.abilities.map((id) => named(id, ABILITY_NAMES[id]));
    }
    if ('feats' in from) return feat(from.feats);
    if ('subclasses' in from) {
      return rules.data.subclasses
        .filter((s) => s.class === from.subclasses)
        .map((s) => named(s.id, s.name));
    }
    if ('options' in from) return from.options.map((o) => named(o.id, o.name));
    if ('list' in from) return list(choice, from.list);
    return [];
  }

  function feat(category: string): Option[] {
    const score = (a: Ability) => sheet.abilities[a].score;
    return rules.data.feats
      .filter((f) => f.category === category)
      .filter((f) => {
        const need = f.requires;
        if (need?.level !== undefined && level < need.level) return false;
        for (const a of ABILITIES) {
          const min = need?.ability?.[a];
          if (min !== undefined && score(a) < min) return false;
        }
        return true;
      })
      .map((f) => named(f.id, f.name));
  }

  function list(choice: Choice, ids: string[]): Option[] {
    if (choice.gives === 'language') {
      const wanted = ids.length === 0 ? rules.data.languages.filter((l) => !l.rare) : ids.map(lang);
      return wanted.map((l) => named(l.id, l.name));
    }
    if (choice.gives === 'mastery') {
      return rules.data.weapons
        .filter((w) => w.mastery !== undefined && ids.includes(w.category))
        .map((w) => named(w.id, w.name));
    }
    if (choice.gives === 'tool') {
      const expanded = ids.flatMap((id) => {
        const category = rules.data.tools.filter((t) => t.category === id);
        return category.length > 0 ? category.map((t) => t.id) : [id];
      });
      return [...new Set(expanded)].map((id) => named(id, rules.tool(id)?.name));
    }
    return ids.map((id) => named(id, undefined));
  }

  function lang(id: string) {
    return rules.language(id) ?? { id, name: { en: id } };
  }
}
