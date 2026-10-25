// Monsters from files the GM already has, as stat blocks: our own and Fantasy Statblocks' keys (YAML
// or JSON), the 5e-bits and Open5e SRD shapes, and 5etools' bestiary format with its `{@…}` tags.
// A file may hold one monster, a list, or a wrapper (`{ "monster": [...] }`, `{ "results": [...] }`).
// The plugin ships none of these; it only reads what the GM brings. Pure.

import { parseStatblock, type Entry, type Statblock } from '../npc/statblock';

type Data = Record<string, unknown>;

const isData = (v: unknown): v is Data => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown): string =>
  typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '';
const num = (v: unknown): number | null => {
  const n = typeof v === 'number' ? v : Number(str(v).match(/-?\d+/)?.[0] ?? NaN);
  return Number.isFinite(n) ? n : null;
};
const named = (v: unknown): string => (isData(v) ? str(v.name) : str(v));

/** A challenge rating as the SRD writes it: 0.125 → `1/8`. */
function cr(v: unknown): string | null {
  const raw = isData(v) ? v.cr : v;
  if (raw === undefined || raw === null || raw === '') return null;
  const n = typeof raw === 'number' ? raw : null;
  if (n !== null) return { 0.125: '1/8', 0.25: '1/4', 0.5: '1/2' }[n] ?? String(n);
  return str(raw).trim();
}

const stats = (o: Data, keys: readonly string[]): number[] | null => {
  const values = keys.map((k) => num(o[k]));
  return values.every((v) => v !== null) ? values : null;
};

const join = (list: unknown, sep = ', '): string | null => {
  if (!Array.isArray(list) || list.length === 0)
    return typeof list === 'string' && list !== '' ? list : null;
  return list.map(named).filter(Boolean).join(sep) || null;
};

function speedText(s: unknown): string | null {
  if (typeof s === 'string') return s;
  if (!isData(s)) return null;
  const feet = (v: unknown) => {
    const n = isData(v) ? num(v.number) : num(v);
    const extra = isData(v) && str(v.condition).trim() !== '' ? ` ${str(v.condition).trim()}` : '';
    return n === null ? str(v) : `${n} ft.${extra}`;
  };
  const parts: string[] = [];
  if (s.walk !== undefined) parts.push(feet(s.walk));
  for (const kind of ['burrow', 'climb', 'fly', 'swim']) {
    if (s[kind] === undefined) continue;
    const hover = kind === 'fly' && (s.hover === true || s.canHover === true) ? ' (hover)' : '';
    parts.push(`${kind} ${feet(s[kind])}${hover}`);
  }
  return parts.join(', ') || null;
}

const blank = (): Statblock => parseStatblock({});

// ── 5etools ──────────────────────────────────────────────────────────────────────────────────

const SIZES: Record<string, string> = {
  T: 'Tiny',
  S: 'Small',
  M: 'Medium',
  L: 'Large',
  H: 'Huge',
  G: 'Gargantuan',
};

const ALIGN: Record<string, string> = {
  L: 'lawful',
  N: 'neutral',
  NX: 'neutral',
  NY: 'neutral',
  C: 'chaotic',
  G: 'good',
  E: 'evil',
  U: 'unaligned',
  A: 'any alignment',
};

const ATTACKS: Record<string, string> = {
  mw: 'Melee Weapon Attack:',
  rw: 'Ranged Weapon Attack:',
  'mw,rw': 'Melee or Ranged Weapon Attack:',
  ms: 'Melee Spell Attack:',
  rs: 'Ranged Spell Attack:',
  'ms,rs': 'Melee or Ranged Spell Attack:',
};

/** 5etools' inline tags as the SRD's words: `{@hit 7}` → `+7`, `{@damage 2d6 + 4}` → `2d6 + 4`. */
export function untag(text: string): string {
  let out = text;
  // Inner tags first, until none is left.
  for (let i = 0; i < 5 && out.includes('{@'); i++) {
    out = out.replace(/\{@(\w+)\s*([^{}]*)\}/g, (_, tag: string, body: string) => {
      const first = body.split('|')[0]?.trim() ?? '';
      if (tag === 'atk') return ATTACKS[first] ?? 'Attack:';
      if (tag === 'hit') return `${Number(first) >= 0 ? '+' : ''}${first}`;
      if (tag === 'h') return 'Hit: ';
      if (tag === 'dc') return `DC ${first}`;
      if (tag === 'recharge') return `(Recharge ${first === '' ? 6 : `${first}–6`})`;
      return first;
    });
  }
  return out.replace(/\s+/g, ' ').trim();
}

function entryText(entries: unknown): string {
  if (!Array.isArray(entries)) return untag(str(entries));
  return entries
    .map((e) => {
      if (typeof e === 'string') return untag(e);
      if (isData(e) && Array.isArray(e.items)) {
        return e.items
          .map((item) => `- ${untag(isData(item) ? str(item.entry ?? item.name) : str(item))}`)
          .join('\n');
      }
      if (isData(e) && e.entries !== undefined) return entryText(e.entries);
      return '';
    })
    .filter(Boolean)
    .join('\n\n');
}

const toolsEntries = (list: unknown): Entry[] =>
  Array.isArray(list)
    ? list.filter(isData).map((e) => ({ name: untag(str(e.name)), desc: entryText(e.entries) }))
    : [];

function fromTools(o: Data): Statblock {
  const b = blank();
  const type = isData(o.type) ? o.type : { type: o.type };
  const tags = Array.isArray(type.tags) ? type.tags.map(named).join(', ') : '';
  const align = Array.isArray(o.alignment)
    ? o.alignment.map((a) => ALIGN[str(a)] ?? str(a)).join(' ')
    : null;
  const ac: unknown = Array.isArray(o.ac) ? (o.ac as unknown[])[0] : o.ac;
  const hp = isData(o.hp) ? o.hp : {};
  const bonus = (v: unknown) =>
    isData(v)
      ? Object.entries(v).flatMap(([k, n]) => {
          const value = num(n);
          return value === null ? [] : [{ key: k.replace(/ /g, '_'), bonus: value }];
        })
      : [];
  const senses = [
    join(o.senses),
    num(o.passive) === null ? null : `passive Perception ${num(o.passive)}`,
  ]
    .filter(Boolean)
    .join(', ');
  const spellcasting = Array.isArray(o.spellcasting)
    ? o.spellcasting.filter(isData).map((s) => ({
        name: untag(str(s.name) || 'Spellcasting'),
        desc: [
          entryText(s.headerEntries),
          ...Object.entries(isData(s.spells) ? s.spells : {}).map(([level, v]) => {
            const list =
              isData(v) && Array.isArray(v.spells)
                ? v.spells.map((x) => untag(str(x))).join(', ')
                : '';
            return `- ${level === '0' ? 'Cantrips (at will)' : `Level ${level}`}: ${list}`;
          }),
          ...(Array.isArray(s.will)
            ? [`- At will: ${s.will.map((x) => untag(str(x))).join(', ')}`]
            : []),
        ]
          .filter(Boolean)
          .join('\n'),
      }))
    : [];
  return {
    ...b,
    name: str(o.name) || null,
    size: SIZES[str(Array.isArray(o.size) ? o.size[0] : o.size)] ?? (str(o.size) || null),
    type: str(type.type) || null,
    subtype: tags || null,
    alignment: align,
    ac: isData(ac) ? num(ac.ac) : num(ac),
    acClass:
      isData(ac) && Array.isArray(ac.from) ? ac.from.map((x) => untag(str(x))).join(', ') : null,
    hp: num(hp.average),
    hitDice: str(hp.formula) || null,
    speed: speedText(o.speed),
    stats: stats(o, ['str', 'dex', 'con', 'int', 'wis', 'cha']),
    saves: bonus(o.save),
    skills: bonus(o.skill),
    damageVulnerabilities: join(o.vulnerable),
    damageResistances: join(o.resist),
    damageImmunities: join(o.immune),
    conditionImmunities: join(o.conditionImmune),
    senses: senses || null,
    languages: join(o.languages),
    cr: cr(o.cr),
    traits: [...toolsEntries(o.trait), ...spellcasting],
    actions: toolsEntries(o.action),
    bonusActions: toolsEntries(o.bonus),
    reactions: toolsEntries(o.reaction),
    legendaryDescription: Array.isArray(o.legendaryHeader) ? entryText(o.legendaryHeader) : null,
    legendaryActions: toolsEntries(o.legendary),
  };
}

// ── 5e-bits and Open5e ───────────────────────────────────────────────────────────────────────

const plainEntries = (list: unknown): Entry[] =>
  Array.isArray(list)
    ? list.filter(isData).map((e) => ({ name: str(e.name), desc: str(e.desc).trim() }))
    : [];

function fromSrdApi(o: Data): Statblock {
  const b = blank();
  const acList = Array.isArray(o.armor_class) ? o.armor_class.filter(isData) : [];
  const saves = [];
  const skills = [];
  for (const p of Array.isArray(o.proficiencies) ? o.proficiencies.filter(isData) : []) {
    const [kind, what = ''] = named(p.proficiency).split(': ');
    const bonus = num(p.value);
    if (bonus === null) continue;
    if (kind === 'Saving Throw') saves.push({ key: what.toLowerCase(), bonus });
    if (kind === 'Skill') skills.push({ key: what.toLowerCase().replace(/ /g, '_'), bonus });
  }
  // Open5e writes saves and skills as their own fields.
  for (const a of ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']) {
    const bonus = num(o[`${a}_save`]);
    if (bonus !== null && o[`${a}_save`] !== null) saves.push({ key: a.slice(0, 3), bonus });
  }
  if (isData(o.skills)) {
    for (const [k, v] of Object.entries(o.skills)) {
      const bonus = num(v);
      if (bonus !== null) skills.push({ key: k.replace(/ /g, '_'), bonus });
    }
  }
  const sensesData = isData(o.senses) ? o.senses : null;
  const senses = sensesData
    ? Object.entries(sensesData)
        .map(([k, v]) =>
          k === 'passive_perception' ? `passive Perception ${str(v)}` : `${k} ${str(v)}`,
        )
        .join(', ')
    : str(o.senses);
  return {
    ...b,
    name: str(o.name) || null,
    size: str(o.size) || null,
    type: str(o.type) || null,
    subtype: str(o.subtype) || null,
    alignment: str(o.alignment) || null,
    ac: acList.length > 0 ? num(acList[0]?.value) : num(o.armor_class),
    acClass: acList.length > 0 ? null : str(o.armor_desc) || null,
    hp: num(o.hit_points),
    hitDice: str(o.hit_points_roll ?? o.hit_dice) || null,
    speed: speedText(o.speed),
    stats: stats(o, [
      'strength',
      'dexterity',
      'constitution',
      'intelligence',
      'wisdom',
      'charisma',
    ]),
    saves,
    skills,
    damageVulnerabilities: join(o.damage_vulnerabilities, '; '),
    damageResistances: join(o.damage_resistances, '; '),
    damageImmunities: join(o.damage_immunities, '; '),
    conditionImmunities: join(o.condition_immunities, '; ')?.toLowerCase() ?? null,
    senses: senses || null,
    languages: str(o.languages) || null,
    cr: cr(o.challenge_rating),
    traits: plainEntries(o.special_abilities),
    actions: plainEntries(o.actions),
    bonusActions: plainEntries(o.bonus_actions),
    reactions: plainEntries(o.reactions),
    legendaryDescription: str(o.legendary_desc) || null,
    legendaryActions: plainEntries(o.legendary_actions),
  };
}

// ── any file ─────────────────────────────────────────────────────────────────────────────────

/** One monster object as a stat block, whichever of the known shapes it has. */
export function monsterFrom(o: Data): Statblock {
  if (typeof o.str === 'number' && (isData(o.hp) || Array.isArray(o.ac))) return fromTools(o);
  if (
    typeof o.strength === 'number' &&
    (o.armor_class !== undefined || o.hit_points !== undefined)
  ) {
    return fromSrdApi(o);
  }
  return parseStatblock(o);
}

/** Every monster in parsed file data: one object, a list, or a wrapper around a list. */
export function monstersFrom(data: unknown): Statblock[] {
  const list = Array.isArray(data)
    ? data
    : isData(data) && Array.isArray(data.monster)
      ? data.monster
      : isData(data) && Array.isArray(data.results)
        ? data.results
        : isData(data) && Array.isArray(data.monsters)
          ? data.monsters
          : [data];
  return list
    .filter(isData)
    .map(monsterFrom)
    .filter((b) => (b.name ?? '').trim() !== '');
}
