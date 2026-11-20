// A character's choices in, its sheet out: every number with the sources it is made of. Missing
// choices and unknown ids are reported on the sheet, never thrown. Pure.

import { type Ability, ABILITIES, modifier, proficiencyBonus } from './basics';
import type { Character, Sheet, SheetFeature, Value } from './character';
import { collect, type Placed } from './collect';
import { armorClass, attacks, worn } from './combat';
import type { Rules } from './data';
import type { Amount, Grant } from './model';
import { resources, spellcasting } from './spellcasting';

const sum = (sources: Value['sources']): Value => ({
  total: sources.reduce((n, s) => n + s.value, 0),
  sources,
});

const key = (p: Placed, choiceId: string) => `${p.feature.id}/${choiceId}`;

/** The scores after every increase, in the order they were gained; each capped by its maximum. */
function scores(character: Character, placed: readonly Placed[]): Record<Ability, number> {
  const score = { ...character.abilities };
  const raise = (ability: Ability, value: number, max = 20) => {
    if (score[ability] < max) score[ability] = Math.min(max, score[ability] + value);
  };
  for (const p of placed) {
    for (const g of p.feature.grants) if (g.kind === 'ability') raise(g.ability, g.value, g.max);
    for (const choice of p.feature.choices) {
      if (choice.gives !== 'ability' || !('abilities' in choice.from)) continue;
      const allowed = choice.from.abilities;
      for (const value of p.choices[key(p, choice.id)] ?? []) {
        if ((allowed as string[]).includes(value)) raise(value as Ability, 1, choice.from.max);
      }
    }
  }
  return score;
}

export function derive(character: Character, rules: Rules): Sheet {
  const { placed, classes, unknown } = collect(character, rules);
  const level = character.levels.length;
  const proficiency = proficiencyBonus(level);
  const score = scores(character, placed);
  const mod = Object.fromEntries(ABILITIES.map((a) => [a, modifier(score[a])])) as Record<
    Ability,
    number
  >;
  const classLevel = (owner: string | null) =>
    owner === null ? level : (classes.find((c) => c.id === owner)?.level ?? 0);
  const amount = (a: Amount, owner: string | null): number => {
    if (typeof a === 'number') return a;
    if ('ability' in a) return mod[a.ability];
    if ('proficiency' in a) return proficiency;
    return a.byLevel[Math.max(1, classLevel(owner)) - 1] ?? 0;
  };

  const saves = new Set<string>();
  const skills = new Set<string>();
  const expertise = new Set<string>();
  const lists: Sheet['proficiencies'] = { armor: [], weapon: [], tool: [], language: [] };
  const masteries: string[] = [];
  let half = false;
  const initiative: Value['sources'] = [{ label: 'dex', value: mod.dex }];
  const hpGrants: Value['sources'] = [];
  const senses = new Map<string, number>();
  const resistances = new Set<string>();
  const grants: { grant: Grant; p: Placed }[] = [];
  const missing: string[] = [];
  const add = (list: string[], ids: readonly string[]) => {
    for (const id of ids) if (!list.includes(id)) list.push(id);
  };

  for (const p of placed) {
    for (const grant of p.feature.grants) {
      grants.push({ grant, p });
      if (grant.kind === 'proficiency') {
        if (grant.what === 'save') for (const id of grant.ids) saves.add(id);
        else if (grant.what === 'skill') for (const id of grant.ids) skills.add(id);
        else add(lists[grant.what], grant.ids);
      } else if (grant.kind === 'expertise') for (const id of grant.ids) expertise.add(id);
      else if (grant.kind === 'half-proficiency') half = true;
      else if (grant.kind === 'initiative') {
        initiative.push({ label: p.from, value: amount(grant.add, p.owner) });
      } else if (grant.kind === 'hp') {
        hpGrants.push({ label: p.feature.id, value: grant.perLevel * classLevel(p.owner) });
      } else if (grant.kind === 'sense') {
        senses.set(grant.id, Math.max(senses.get(grant.id) ?? 0, grant.range));
      } else if (grant.kind === 'resistance') for (const id of grant.ids) resistances.add(id);
    }
    for (const choice of p.feature.choices) {
      const values = p.choices[key(p, choice.id)] ?? [];
      const wanted = amount(choice.count, p.owner);
      if (values.length < wanted) {
        missing.push(p.at === null ? key(p, choice.id) : `level ${p.at}: ${key(p, choice.id)}`);
      }
      if (choice.gives === 'skill') for (const v of values) skills.add(v);
      else if (choice.gives === 'expertise') for (const v of values) expertise.add(v);
      else if (choice.gives === 'tool') add(lists.tool, values);
      else if (choice.gives === 'language') add(lists.language, values);
      else if (choice.gives === 'mastery') add(masteries, values);
    }
  }

  const abilities = Object.fromEntries(
    ABILITIES.map((a) => [a, { score: score[a], modifier: mod[a] }]),
  ) as Sheet['abilities'];
  const saveValues = Object.fromEntries(
    ABILITIES.map((a) => {
      const proficient = saves.has(a);
      const sources: Value['sources'] = [{ label: a, value: mod[a] }];
      if (proficient) sources.push({ label: 'proficiency', value: proficiency });
      return [a, { ...sum(sources), proficient }];
    }),
  ) as Sheet['saves'];
  const skillValues: Sheet['skills'] = {};
  for (const skill of rules.data.skills) {
    const rank = expertise.has(skill.id) ? 2 : skills.has(skill.id) ? 1 : half ? 0.5 : 0;
    const sources: Value['sources'] = [{ label: skill.ability, value: mod[skill.ability] }];
    if (rank === 2) sources.push({ label: 'expertise', value: 2 * proficiency });
    if (rank === 1) sources.push({ label: 'proficiency', value: proficiency });
    if (rank === 0.5) {
      sources.push({ label: 'half-proficiency', value: Math.floor(proficiency / 2) });
    }
    skillValues[skill.id] = { ...sum(sources), rank };
  }
  const passive = (skill: string, ability: Ability) =>
    10 + (skillValues[skill]?.total ?? mod[ability]);

  // Hit points: the first level's die in full, then the average or the roll, plus Constitution.
  const hp: Value['sources'] = [];
  character.levels.forEach((entry, i) => {
    const die = rules.class(entry.class)?.hitDie;
    if (die === undefined) return;
    const rolled =
      entry.hp === 'max' || i === 0 ? die : entry.hp === 'average' ? die / 2 + 1 : entry.hp;
    hp.push({ label: `level-${i + 1}`, value: rolled });
  });
  if (level > 0) hp.push({ label: 'con', value: mod.con * level });
  hp.push(...hpGrants);

  const armor = worn(character, rules);
  const species = rules.species(character.species);
  let speed = species?.speed ?? 30;
  for (const { grant, p } of grants) {
    if (grant.kind !== 'speed') continue;
    if (grant.when === 'no-armor' && (armor.body !== null || armor.shield)) continue;
    if (grant.when === 'no-heavy-armor' && armor.body?.category === 'heavy') continue;
    speed += amount(grant.value, p.owner);
  }

  const features: SheetFeature[] = placed.map((p) => ({
    id: p.feature.id,
    name: p.feature.name,
    text: p.feature.text,
    level: p.feature.level,
    from: p.from,
  }));
  for (const bonus of character.bonuses) {
    if (bonus.to === 'initiative') initiative.push({ label: 'bonus', value: bonus.value });
    if (bonus.to === 'hp') hp.push({ label: 'bonus', value: bonus.value });
    if (bonus.to === 'speed') speed += bonus.value;
  }
  for (const item of character.inventory) {
    if (rules.armor(item.item) === undefined && rules.weapon(item.item) === undefined) {
      if (!unknown.includes(item.item)) unknown.push(item.item);
    }
  }

  const context = { character, rules, mod, proficiency, amount, grants, lists };
  const casting = spellcasting(context, classes);
  return {
    level,
    classes,
    abilities,
    proficiency,
    saves: saveValues,
    skills: skillValues,
    passive: {
      perception: passive('perception', 'wis'),
      insight: passive('insight', 'wis'),
      investigation: passive('investigation', 'int'),
    },
    initiative: sum(initiative),
    speed,
    senses: [...senses].map(([id, range]) => ({ id, range })),
    resistances: [...resistances],
    hp: sum(hp),
    ac: armorClass(context, armor),
    attacks: attacks(context),
    spellcasting: casting.spellcasting,
    slots: casting.slots,
    pact: casting.pact,
    resources: resources(context),
    scales: grants.flatMap(({ grant, p }) =>
      grant.kind === 'scale'
        ? [
            {
              id: grant.id,
              name: grant.name,
              value: grant.values[Math.max(1, classLevel(p.owner)) - 1] ?? 0,
            },
          ]
        : [],
    ),
    features,
    proficiencies: lists,
    masteries,
    missing,
    unknown,
  };
}

/** What the combat and spellcasting parts read. */
export interface Context {
  character: Character;
  rules: Rules;
  mod: Record<Ability, number>;
  proficiency: number;
  amount: (a: Amount, owner: string | null) => number;
  grants: { grant: Grant; p: Placed }[];
  lists: Sheet['proficiencies'];
}
