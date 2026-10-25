// The monster builder's side of a stat block: a block written back as YAML in the plugin's format
// (the keys the SRD monsters use, in their order), saves and skills as one line of text, and the
// choices the builder offers. Pure.

import type { Bonus, Entry, Statblock } from '../npc/statblock';

/** Every challenge rating, lowest first. */
export const CRS = [
  '0',
  '1/8',
  '1/4',
  '1/2',
  ...Array.from({ length: 30 }, (_, i) => String(i + 1)),
] as const;

/** The alignments the SRD's monsters use. */
export const ALIGNMENTS = [
  'lawful good',
  'neutral good',
  'chaotic good',
  'lawful neutral',
  'neutral',
  'chaotic neutral',
  'lawful evil',
  'neutral evil',
  'chaotic evil',
  'unaligned',
  'any alignment',
  'any chaotic alignment',
  'any evil alignment',
  'any non-good alignment',
  'any non-lawful alignment',
] as const;

/** A new monster: a Medium beast with 10s across, ready to be changed. */
export function emptyMonster(): Statblock {
  return {
    name: '',
    size: 'Medium',
    type: 'beast',
    subtype: null,
    alignment: 'unaligned',
    ac: 10,
    acClass: null,
    hp: 4,
    hitDice: '1d8',
    speed: '30 ft.',
    stats: [10, 10, 10, 10, 10, 10],
    saves: [],
    skills: [],
    damageVulnerabilities: null,
    damageResistances: null,
    damageImmunities: null,
    conditionImmunities: null,
    senses: 'passive Perception 10',
    languages: null,
    cr: '0',
    traits: [],
    spells: [],
    actions: [],
    bonusActions: [],
    reactions: [],
    legendaryDescription: null,
    legendaryActions: [],
    extra: {},
    unreadable: [],
  };
}

/** `dex +6, con +13` from a block's saves or skills (keys as written, `_` as spaces). */
export function bonusText(list: readonly Bonus[]): string {
  return list
    .map((b) => `${b.key.replace(/_/g, ' ')} ${b.bonus >= 0 ? '+' : ''}${b.bonus}`)
    .join(', ');
}

/** Saves or skills from `DEX +6, CON +13` or `Perception +13, Sleight of Hand +4`. */
export function parseBonuses(text: string): Bonus[] {
  return text.split(',').flatMap((part) => {
    const m = /^\s*([A-Za-z][A-Za-z ]*?)\s*([+-−]\s*\d+)\s*$/.exec(part);
    if (m === null) return [];
    const bonus = Number((m[2] ?? '').replace('−', '-').replace(/\s/g, ''));
    return [{ key: (m[1] ?? '').trim().toLowerCase().replace(/ /g, '_'), bonus }];
  });
}

const q = (s: string) => JSON.stringify(s);

function entries(key: string, list: readonly Entry[]): string[] {
  const named = list.filter((e) => e.name.trim() !== '' || e.desc.trim() !== '');
  if (named.length === 0) return [];
  return [
    `${key}:`,
    ...named.flatMap((e) => [`  - name: ${q(e.name.trim())}`, `    desc: ${q(e.desc.trim())}`]),
  ];
}

function bonuses(key: string, list: readonly Bonus[]): string[] {
  return list.length === 0 ? [] : [`${key}:`, ...list.map((b) => `  - ${b.key}: ${b.bonus}`)];
}

/** The block as YAML in the plugin's format; empty fields are left out. */
export function statblockYaml(b: Statblock): string {
  const lines: string[] = [];
  const text = (key: string, value: string | null) => {
    if (value !== null && value.trim() !== '') lines.push(`${key}: ${q(value.trim())}`);
  };
  text('name', b.name);
  text('size', b.size);
  text('type', b.type);
  text('subtype', b.subtype);
  text('alignment', b.alignment);
  if (b.ac !== null) lines.push(`ac: ${b.ac}`);
  text('ac_class', b.acClass);
  if (b.hp !== null) lines.push(`hp: ${b.hp}`);
  text('hit_dice', b.hitDice);
  text('speed', b.speed);
  if (b.stats !== null) lines.push(`stats: [${b.stats.join(', ')}]`);
  lines.push(...bonuses('saves', b.saves), ...bonuses('skillsaves', b.skills));
  text('damage_vulnerabilities', b.damageVulnerabilities);
  text('damage_resistances', b.damageResistances);
  text('damage_immunities', b.damageImmunities);
  text('condition_immunities', b.conditionImmunities);
  text('senses', b.senses);
  text('languages', b.languages);
  text('cr', b.cr);
  lines.push(...entries('traits', b.traits));
  if (b.spells.length > 0) lines.push('spells:', ...b.spells.map((s) => `  - ${q(s)}`));
  lines.push(...entries('actions', b.actions));
  lines.push(...entries('bonus_actions', b.bonusActions));
  lines.push(...entries('reactions', b.reactions));
  if (b.legendaryActions.some((e) => e.name.trim() !== '' || e.desc.trim() !== '')) {
    text('legendary_description', b.legendaryDescription);
    lines.push(...entries('legendary_actions', b.legendaryActions));
  }
  return lines.join('\n');
}

/** The SRD's paragraph above legendary actions, for a monster named `name`. */
export function legendaryParagraph(name: string): string {
  const who = `The ${name.trim().toLowerCase() || 'creature'}`;
  return `${who} can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. ${who} regains spent legendary actions at the start of its turn.`;
}

/** A `type: monster` note holding a stat block's YAML. */
export function monsterNoteText(
  name: string,
  cr: string | null,
  yaml: string,
  fence: string,
): string {
  const crLine = cr === null ? '' : `cr: ${q(cr)}\n`;
  return `---\ntype: monster\n${crLine}---\n\n# ${name.trim()}\n\n\`\`\`${fence}\n${yaml}\n\`\`\`\n`;
}
