// A 5e stat block as the plugin reads it: the parsed YAML of a `dnd5e-statblock` block (or of a
// Fantasy Statblocks `statblock` block — same keys) turned into a model, with the values a stat
// block derives (ability modifiers, proficiency bonus, XP). Unknown keys are kept, never dropped.
// Pure: the Obsidian side parses the YAML and hands the object over.

export const BLOCK = 'dnd5e-statblock';
/** Fantasy Statblocks' block name: read for the card line and converted on request. */
export const FOREIGN_BLOCK = 'statblock';

export interface Entry {
  name: string;
  desc: string;
}

/** A save or skill bonus, by the key the note uses (`con`, `perception` …). */
export interface Bonus {
  key: string;
  bonus: number;
}

export interface Statblock {
  name: string | null;
  size: string | null;
  type: string | null;
  subtype: string | null;
  alignment: string | null;
  ac: number | null;
  acClass: string | null;
  hp: number | null;
  hitDice: string | null;
  speed: string | null;
  /** STR, DEX, CON, INT, WIS, CHA. */
  stats: number[] | null;
  saves: Bonus[];
  skills: Bonus[];
  damageVulnerabilities: string | null;
  damageResistances: string | null;
  damageImmunities: string | null;
  conditionImmunities: string | null;
  senses: string | null;
  languages: string | null;
  /** As written: `3`, `1/8`. */
  cr: string | null;
  traits: Entry[];
  /** Spellcasting text: plain lines and `level: spells` pairs, in order. */
  spells: string[];
  actions: Entry[];
  bonusActions: Entry[];
  reactions: Entry[];
  legendaryDescription: string | null;
  legendaryActions: Entry[];
  /** Keys this model does not know (`ledger_pages`, `lair_actions` …), kept as parsed. */
  extra: Record<string, unknown>;
  /** Keys whose value could not be read; the block still renders the rest. */
  unreadable: string[];
}

const KNOWN = new Set([
  'name',
  'size',
  'type',
  'subtype',
  'alignment',
  'ac',
  'ac_class',
  'hp',
  'hit_dice',
  'speed',
  'stats',
  'saves',
  'skillsaves',
  'damage_vulnerabilities',
  'damage_resistances',
  'damage_immunities',
  'condition_immunities',
  'senses',
  'languages',
  'cr',
  'traits',
  'spells',
  'actions',
  'bonus_actions',
  'reactions',
  'legendary_description',
  'legendary_actions',
]);

export function parseStatblock(data: unknown): Statblock {
  const raw = isRecord(data) ? data : {};
  const unreadable: string[] = [];
  const note = (key: string) => unreadable.push(key);

  const text = (key: string): string | null => {
    const value = raw[key];
    if (value === undefined || value === null || value === '') return null;
    if (typeof value === 'string' || typeof value === 'number') return String(value).trim();
    if (Array.isArray(value) && value.every((v) => typeof v === 'string')) return value.join(', ');
    note(key);
    return null;
  };
  /** A number, or the number a text starts with (`16 (chain mail)`). */
  const number = (key: string): number | null => {
    const value = raw[key];
    if (value === undefined || value === null || value === '') return null;
    const n = typeof value === 'number' ? value : Number(/^\s*(-?\d+)/.exec(scalar(value))?.[1]);
    if (Number.isFinite(n)) return n;
    note(key);
    return null;
  };
  const entries = (key: string): Entry[] => {
    const value = raw[key];
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) {
      note(key);
      return [];
    }
    return value.flatMap((item) => {
      if (isRecord(item) && (item.name !== undefined || item.desc !== undefined)) {
        return [{ name: scalar(item.name), desc: scalar(item.desc) }];
      }
      note(key);
      return [];
    });
  };
  const bonuses = (key: string): Bonus[] => {
    const value = raw[key];
    if (value === undefined || value === null) return [];
    // A list of one-key maps (`- con: 4`), as Fantasy Statblocks writes them, or one map.
    const pairs = Array.isArray(value)
      ? value.flatMap((item) => (isRecord(item) ? Object.entries(item) : [[null, item]]))
      : isRecord(value)
        ? Object.entries(value)
        : [[null, value]];
    return pairs.flatMap(([k, v]) => {
      const bonus = typeof v === 'number' ? v : Number(v);
      if (typeof k === 'string' && Number.isFinite(bonus)) return [{ key: k, bonus }];
      note(key);
      return [];
    });
  };

  let stats: number[] | null = null;
  if (raw.stats !== undefined && raw.stats !== null) {
    const values = Array.isArray(raw.stats) ? raw.stats.map(Number) : [];
    if (values.length === 6 && values.every(Number.isFinite)) stats = values;
    else note('stats');
  }

  let spells: string[] = [];
  if (raw.spells !== undefined && raw.spells !== null) {
    if (Array.isArray(raw.spells)) {
      spells = raw.spells.flatMap((item) =>
        isRecord(item)
          ? Object.entries(item).map(([level, list]) => `${level}: ${scalar(list)}`)
          : [scalar(item)],
      );
    } else note('spells');
  }

  const extra: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) if (!KNOWN.has(key)) extra[key] = value;

  return {
    name: text('name'),
    size: text('size'),
    type: text('type'),
    subtype: text('subtype'),
    alignment: text('alignment'),
    ac: number('ac'),
    acClass: text('ac_class'),
    hp: number('hp'),
    hitDice: text('hit_dice'),
    speed: text('speed'),
    stats,
    saves: bonuses('saves'),
    skills: bonuses('skillsaves'),
    damageVulnerabilities: text('damage_vulnerabilities'),
    damageResistances: text('damage_resistances'),
    damageImmunities: text('damage_immunities'),
    conditionImmunities: text('condition_immunities'),
    senses: text('senses'),
    languages: text('languages'),
    cr: crText(raw.cr, note),
    traits: entries('traits'),
    spells,
    actions: entries('actions'),
    bonusActions: entries('bonus_actions'),
    reactions: entries('reactions'),
    legendaryDescription: text('legendary_description'),
    legendaryActions: entries('legendary_actions'),
    extra,
    unreadable,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function scalar(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? String(value)
    : '';
}

function crText(value: unknown, note: (key: string) => void): string | null {
  if (value === undefined || value === null || value === '') return null;
  const text = scalar(value).trim();
  if (crValue(text) !== null) return text;
  note('cr');
  return null;
}

// ── derived values ─────────────────────────────────────────────────────────────────────────────

/** A challenge rating as a number: `1/8` → 0.125; null when it is not one of 0, ⅛, ¼, ½, 1 … 30. */
export function crValue(cr: string): number | null {
  const fraction = { '1/8': 0.125, '1/4': 0.25, '1/2': 0.5 }[cr.trim()];
  if (fraction !== undefined) return fraction;
  const n = cr.trim() === '' ? NaN : Number(cr);
  return Number.isInteger(n) && n >= 0 && n <= 30 ? n : null;
}

/** The ability modifier of a score (SRD: (score − 10) / 2, rounded down). */
export function modifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** `+2`, `0`, `−1` (typographic minus), as a stat block prints bonuses. */
export function formatBonus(n: number): string {
  return n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '+0';
}

/** The proficiency bonus by challenge rating (SRD: +2 up to CR 4, then +1 every four). */
export function proficiencyBonus(cr: string): number | null {
  const value = crValue(cr);
  if (value === null) return null;
  return value < 5 ? 2 : Math.ceil((value - 4) / 4) + 2;
}

const XP: Record<string, number> = {
  '0': 10,
  '1/8': 25,
  '1/4': 50,
  '1/2': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
  '11': 7200,
  '12': 8400,
  '13': 10000,
  '14': 11500,
  '15': 13000,
  '16': 15000,
  '17': 18000,
  '18': 20000,
  '19': 22000,
  '20': 25000,
  '21': 33000,
  '22': 41000,
  '23': 50000,
  '24': 62000,
  '25': 75000,
  '26': 90000,
  '27': 105000,
  '28': 120000,
  '29': 135000,
  '30': 155000,
};

/** Experience points for defeating a creature of this CR (SRD table). */
export function experience(cr: string): number | null {
  return XP[cr.trim()] ?? null;
}

/** `AC 18 · HP 52 · CR 3` for the faction card, leaving out what the block does not say. */
export function summary(block: Statblock): string {
  return [
    block.ac === null ? null : `AC ${block.ac}`,
    block.hp === null ? null : `HP ${block.hp}`,
    block.cr === null ? null : `CR ${block.cr}`,
  ]
    .filter((part) => part !== null)
    .join(' · ');
}

// ── blocks in a note ───────────────────────────────────────────────────────────────────────────

export interface BlockRange {
  /** `dnd5e-statblock` or `statblock`. */
  name: string;
  /** Line of the opening fence and of the closing one (the end of the note when unclosed). */
  open: number;
  close: number;
  /** The YAML between the fences. */
  source: string;
}

const FENCE = /^(\s*)(`{3,}|~{3,})\s*([\w-]+)\s*$/;

/** The stat blocks of a note's text, ours and Fantasy Statblocks', in order. */
export function findStatblocks(text: string): BlockRange[] {
  const lines = text.split(/\r?\n/);
  const blocks: BlockRange[] = [];
  for (let i = 0; i < lines.length; i++) {
    const match = FENCE.exec(lines[i] ?? '');
    if (match === null) continue;
    const [, , fence = '', name = ''] = match;
    const closing = new RegExp(`^\\s*${fence[0] === '`' ? '`' : '~'}{${fence.length},}\\s*$`);
    let close = i + 1;
    while (close < lines.length && !closing.test(lines[close] ?? '')) close++;
    if (name === BLOCK || name === FOREIGN_BLOCK) {
      blocks.push({ name, open: i, close, source: lines.slice(i + 1, close).join('\n') });
    }
    i = close;
  }
  return blocks;
}

/**
 * Converts a note's stat blocks between the two block names: Fantasy Statblocks' blocks become ours
 * when the note has any, else ours become theirs. Only the opening fence lines change.
 */
export function convertBlocks(text: string): { text: string; count: number } {
  const blocks = findStatblocks(text);
  const from = blocks.some((b) => b.name === FOREIGN_BLOCK) ? FOREIGN_BLOCK : BLOCK;
  const to = from === FOREIGN_BLOCK ? BLOCK : FOREIGN_BLOCK;
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  let count = 0;
  for (const block of blocks) {
    if (block.name !== from) continue;
    lines[block.open] = (lines[block.open] ?? '').replace(new RegExp(`${from}\\s*$`), to);
    count++;
  }
  return { text: lines.join(eol), count };
}
