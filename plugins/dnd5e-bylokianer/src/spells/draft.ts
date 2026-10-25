// The spell builder's draft: a spell being typed in, copied from an SRD spell in one language, or
// read from a JSON file (our own keys, or the 5e-bits / Open5e SRD shape), and written out as a
// `type: spell` note that `parseOwnSpell` reads back. Pure.

import type { Lang } from '../npc/races';
import {
  ABILITIES,
  castingTime,
  components as componentText,
  DAMAGE_TYPES,
  duration,
  label,
  range,
  SCHOOLS,
  SPELL_CLASSES,
  spellName,
  spellText,
} from './meta';
import type { Ability, School, SpellClass, SrdSpell } from './model';

export type SpellDraft = Omit<SrdSpell, 'index' | 'path'>;

export const emptyDraft = (): SpellDraft => ({
  name: '',
  level: 1,
  school: 'evocation',
  casting: '1 action',
  range: '',
  components: ['V', 'S'],
  material: '',
  duration: 'Instantaneous',
  concentration: false,
  ritual: false,
  classes: [],
  damage: [],
  save: null,
  attack: null,
  text: '',
  higher: '',
});

/** An SRD spell as a draft, its words in one language, to change into an own spell. */
export function draftFromSpell(spell: SrdSpell, lang: Lang): SpellDraft {
  const words = spellText(spell, lang);
  // Concentration is its own field; the duration keeps only the span.
  const span = duration({ ...spell, concentration: false }, lang);
  return {
    ...spell,
    name: spellName(spell, lang),
    casting: castingTime(spell, lang),
    range: range(spell, lang),
    duration: span,
    components: [...spell.components],
    classes: [...spell.classes],
    damage: [...spell.damage],
    text: words.text,
    higher: words.higher,
    material: words.material,
  };
}

// ── JSON ─────────────────────────────────────────────────────────────────────────────────────

export type SpellJson = { ok: true; draft: SpellDraft } | { ok: false; reason: 'syntax' | 'shape' };

const fold = (s: string) => s.trim().toLowerCase();
const str = (v: unknown): string => (typeof v === 'string' ? v : '');
/** A string, or the `name` of an object (5e-bits writes `school: { name: "Evocation" }`). */
const named = (v: unknown): string =>
  typeof v === 'object' && v !== null ? str((v as Record<string, unknown>).name) : str(v);
/** Text from a string or an array of paragraphs. */
const paragraphs = (v: unknown): string =>
  Array.isArray(v) ? v.map(named).filter(Boolean).join('\n\n') : str(v);

function keyOf<K extends string>(value: string, keys: readonly K[]): K | null {
  const v = fold(value);
  if (v === '') return null;
  return (
    keys.find((k) => k === v || fold(label(k, 'en')) === v || fold(label(k, 'de')) === v) ?? null
  );
}

const many = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(named) : typeof v === 'string' ? v.split(',') : [];

const yes = (v: unknown): boolean =>
  v === true || (typeof v === 'string' && /^(yes|true|ja)$/i.test(v.trim()));

/** One spell from a JSON file: our own keys, or the 5e-bits / Open5e SRD shape. */
export function parseSpellJson(text: string): SpellJson {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'syntax' };
  }
  const o = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | undefined;
  if (typeof o !== 'object' || o === null || named(o.name).trim() === '') {
    return { ok: false, reason: 'shape' };
  }
  const base = emptyDraft();
  const level = typeof o.level === 'number' ? o.level : Number(o.level_int ?? NaN);
  const comps = many(o.components)
    .flatMap((c) =>
      c
        .trim()
        .toUpperCase()
        .split(/[\s,]+/),
    )
    .map((c) => (c === 'G' ? 'S' : c))
    .filter((c): c is 'V' | 'S' | 'M' => c === 'V' || c === 'S' || c === 'M');
  const damage =
    named((o.damage as Record<string, unknown> | undefined)?.damage_type) || str(o.damage);
  const save = named((o.dc as Record<string, unknown> | undefined)?.dc_type) || str(o.save);
  const attack = fold(str(o.attack_type) || str(o.attack));
  return {
    ok: true,
    draft: {
      ...base,
      name: named(o.name).trim(),
      level: Number.isInteger(level) && level >= 0 && level <= 9 ? level : base.level,
      school: keyOf<School>(named(o.school), SCHOOLS) ?? base.school,
      casting: str(o.casting_time) || base.casting,
      range: str(o.range),
      components: comps.length > 0 ? [...new Set(comps)] : base.components,
      material: str(o.material),
      duration: str(o.duration) || base.duration,
      concentration: yes(o.concentration) || /concentration/i.test(str(o.duration)),
      ritual: yes(o.ritual),
      classes: [
        ...new Set(
          many(o.classes ?? o.dnd_class).flatMap((c) => keyOf<SpellClass>(c, SPELL_CLASSES) ?? []),
        ),
      ],
      damage: damage === '' ? [] : many(damage).flatMap((d) => keyOf(d, DAMAGE_TYPES) ?? []),
      save: keyOf<Ability>(save.slice(0, 3), ABILITIES) ?? keyOf<Ability>(save, ABILITIES),
      attack: attack === 'melee' || attack === 'ranged' ? attack : null,
      text: paragraphs(o.desc ?? o.text ?? o.description),
      higher: paragraphs(o.higher_level ?? o.higher),
    },
  };
}

// ── the note ─────────────────────────────────────────────────────────────────────────────────

const quote = (s: string) => JSON.stringify(s.trim());

/** The note a drafted spell is written as; `parseOwnSpell` reads it back. */
export function spellNoteText(d: SpellDraft): string {
  const lines = [
    '---',
    'type: spell',
    `level: ${d.level}`,
    `school: ${d.school}`,
    `casting_time: ${quote(d.casting)}`,
  ];
  if (d.range.trim() !== '') lines.push(`range: ${quote(d.range)}`);
  lines.push(`components: ${quote(componentText({ components: d.components } as SrdSpell, 'en'))}`);
  if (d.components.includes('M') && d.material.trim() !== '') {
    lines.push(`material: ${quote(d.material)}`);
  }
  lines.push(`duration: ${quote(d.duration)}`);
  lines.push(`concentration: ${String(d.concentration)}`, `ritual: ${String(d.ritual)}`);
  if (d.classes.length > 0) lines.push(`classes: [${d.classes.join(', ')}]`);
  if (d.damage.length > 0) lines.push(`damage: [${d.damage.join(', ')}]`);
  if (d.save !== null) lines.push(`save: ${d.save}`);
  if (d.attack !== null) lines.push(`attack: ${d.attack}`);
  lines.push('---', '', `# ${d.name.trim()}`, '', d.text.trim());
  if (d.higher.trim() !== '') lines.push('', '## At Higher Levels', '', d.higher.trim());
  return `${lines.join('\n')}\n`;
}
