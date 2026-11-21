// The data check the generators and the tests run: every id unique, every reference resolving,
// every level table complete. Returns readable problems; none means the data is sound. Pure.

import type { Rules } from './data';
import type { Feature, Grant, Text } from './model';

const byLevelProblem = (where: string, value: unknown): string | null =>
  typeof value === 'object' &&
  value !== null &&
  'byLevel' in value &&
  Array.isArray(value.byLevel) &&
  value.byLevel.length !== 20
    ? `${where}: byLevel has ${value.byLevel.length} entries, not 20`
    : null;

/** Weapon proficiencies: a category, a weapon id, or a category with a property. */
function weaponIds(rules: Rules): Set<string> {
  const ids = new Set<string>(['simple', 'martial']);
  for (const w of rules.data.weapons) {
    ids.add(w.id);
    for (const p of w.properties) {
      ids.add(`simple-${p}`);
      ids.add(`martial-${p}`);
    }
  }
  return ids;
}

function grantProblems(where: string, grant: Grant, rules: Rules): string[] {
  const found: (string | null)[] = [];
  if (grant.kind === 'proficiency' && grant.what === 'weapon') {
    const known = weaponIds(rules);
    for (const id of grant.ids) {
      if (!known.has(id)) found.push(`${where}: unknown weapon proficiency '${id}'`);
    }
  }
  if (grant.kind === 'resource') {
    found.push(byLevelProblem(where, grant.uses), byLevelProblem(where, grant.die));
    found.push(byLevelProblem(where, grant.recharge));
  }
  if (grant.kind === 'spellcasting') {
    found.push(byLevelProblem(where, grant.prepared), byLevelProblem(where, grant.cantrips));
  }
  if (grant.kind === 'initiative') found.push(byLevelProblem(where, grant.add));
  if (grant.kind === 'speed') found.push(byLevelProblem(where, grant.value));
  if (grant.kind === 'scale' && grant.values.length !== 20) {
    found.push(`${where}: scale ${grant.id} has ${grant.values.length} values, not 20`);
  }
  return found.filter((p): p is string => p !== null);
}

function featureProblems(owner: string, feature: Feature, rules: Rules): string[] {
  const where = `${owner} ${feature.id}`;
  const found: string[] = [];
  if (feature.text.en.trim() === '') found.push(`${where}: no text`);
  for (const grant of feature.grants) found.push(...grantProblems(where, grant, rules));
  for (const choice of feature.choices) {
    const at = `${where}/${choice.id}`;
    const count = byLevelProblem(at, choice.count);
    if (count !== null) found.push(count);
    const from = choice.from;
    if ('subclasses' in from && rules.class(from.subclasses) === undefined) {
      found.push(`${at}: unknown class '${from.subclasses}'`);
    }
    if ('skills' in from && Array.isArray(from.skills)) {
      for (const id of from.skills) {
        if (rules.skill(id) === undefined) found.push(`${at}: unknown skill '${id}'`);
      }
    }
    if ('options' in from) {
      for (const option of from.options) found.push(...featureProblems(at, option, rules));
    }
  }
  return found;
}

/** Every `Text` in the data with its path; an empty `de` is a mistake (absent means not yet translated). */
function emptyGerman(value: unknown, path: string, found: string[]): void {
  if (Array.isArray(value)) {
    value.forEach((item, i) => emptyGerman(item, `${path}[${i}]`, found));
  } else if (typeof value === 'object' && value !== null) {
    if ('en' in value && 'de' in value && typeof value.de === 'string' && value.de.trim() === '') {
      found.push(`${path.slice(1)}: empty German text`);
    }
    for (const [key, child] of Object.entries(value)) emptyGerman(child, `${path}.${key}`, found);
  }
}

const ALONE = '(?<![\\p{L}\\d])';
const NOT_FOLLOWED = '(?![\\p{L}\\d])';
const ENGLISH_DIE = new RegExp(`${ALONE}(\\d*)d(\\d+)${NOT_FOLLOWED}`, 'giu');
const GERMAN_DIE = new RegExp(`${ALONE}(\\d*)W(\\d+)${NOT_FOLLOWED}`, 'giu');
/** A word cut after its first capital ("K leriker"): a lone capital before a lower-case word. */
const SPLIT_FRAGMENT = new RegExp(`${ALONE}(\\p{Lu}) \\p{Ll}{2,}`, 'gu');
const LONE_CAPITAL = new RegExp(`${ALONE}\\p{Lu}${NOT_FOLLOWED}`, 'gu');
/** A number with feet or pounds, or the word Fuss; "Kraft." or "Gift." are not units. */
const IMPERIAL = new RegExp(
  `\\d\\s*(?:ft|feet|foot|lbs?|pounds?)${NOT_FOLLOWED}|${ALONE}Fuß${NOT_FOLLOWED}`,
  'iu',
);

/** The dice of a text as `<count>W<sides>` (a bare d20 is 1W20), whichever letter case. */
const diceOf = (text: string, pattern: RegExp): string[] =>
  [...text.matchAll(pattern)].map((m) => `${m[1] === '' ? '1' : m[1]}W${m[2]}`);

/** What is wrong with a German text next to its English: empty, missing dice, feet, split words. */
export function germanProblems(text: Text): string[] {
  const de = text.de ?? '';
  if (de.trim() === '') return ['no German text'];
  const found: string[] = [];
  const german = new Set(diceOf(de, GERMAN_DIE));
  for (const die of new Set(diceOf(text.en, ENGLISH_DIE))) {
    if (!german.has(die)) found.push(`die ${die} missing in the German text`);
  }
  if (IMPERIAL.test(de)) found.push('imperial unit left in the German text');
  const capitals = new Set(text.en.match(LONE_CAPITAL));
  for (const fragment of de.matchAll(SPLIT_FRAGMENT)) {
    if (!capitals.has(fragment[1]!)) found.push(`split word fragment '${fragment[0]}'`);
  }
  if (de.includes('-\n')) found.push('hyphen at a line break');
  return found;
}

export function checkRules(rules: Rules): string[] {
  const found: string[] = [];
  const { data } = rules;
  const unique = (kind: string, list: readonly { id: string }[]) => {
    const seen = new Set<string>();
    for (const { id } of list) {
      if (seen.has(id)) found.push(`duplicate ${kind} id '${id}'`);
      seen.add(id);
    }
  };
  unique('class', data.classes);
  unique('subclass', data.subclasses);
  unique('species', data.species);
  unique('background', data.backgrounds);
  unique('feat', data.feats);
  unique('armor', data.armor);
  unique('weapon', data.weapons);
  unique('skill', data.skills);
  unique('tool', data.tools);
  unique('language', data.languages);

  for (const c of data.classes) {
    for (const f of c.features) found.push(...featureProblems(`class ${c.id}`, f, rules));
    for (const g of c.multiclass.grants) {
      found.push(...grantProblems(`class ${c.id} multiclass`, g, rules));
    }
    const asks = c.features.some(
      (f) =>
        f.level === c.subclassLevel &&
        f.choices.some((ch) => 'subclasses' in ch.from && ch.from.subclasses === c.id),
    );
    if (!asks) found.push(`class ${c.id}: no subclass choice at level ${c.subclassLevel}`);
  }
  for (const s of data.subclasses) {
    if (rules.class(s.class) === undefined) {
      found.push(`subclass ${s.id}: unknown class '${s.class}'`);
    }
    for (const f of s.features) found.push(...featureProblems(`subclass ${s.id}`, f, rules));
  }
  for (const s of data.species) {
    for (const f of s.features) found.push(...featureProblems(`species ${s.id}`, f, rules));
  }
  for (const b of data.backgrounds) {
    if (b.feat !== '' && rules.feat(b.feat) === undefined) {
      found.push(`background ${b.id}: unknown feat '${b.feat}'`);
    }
    for (const f of b.features) found.push(...featureProblems(`background ${b.id}`, f, rules));
  }
  for (const f of data.creation) found.push(...featureProblems('creation', f, rules));
  for (const feat of data.feats) {
    for (const f of feat.features) found.push(...featureProblems(`feat ${feat.id}`, f, rules));
  }
  emptyGerman(data, '', found);
  return found;
}
