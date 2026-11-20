// What a stat block entry's row shows beside its name: the attack bonus, every damage part and the
// saving throw DC, read from the entry's text in English or German (`DC 18 Constitution saving
// throw`, `Dexterity Saving Throw: DC 15`, `Stärkerettungswurf mit SG 14`). A `spell save DC`
// names no ability and is no row DC. Pure.

import { rollParts, type RollPart } from './statblock';

export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface ActionRow {
  /** The first attack bonus. */
  attack: RollPart | null;
  /** Every damage part, in order. */
  damage: RollPart[];
  /** The first saving throw DC with its ability. */
  dc: { dc: number; ability: Ability } | null;
}

const ABILITIES: Record<string, Ability> = {
  strength: 'str',
  dexterity: 'dex',
  constitution: 'con',
  intelligence: 'int',
  wisdom: 'wis',
  charisma: 'cha',
  stärke: 'str',
  geschicklichkeit: 'dex',
  konstitution: 'con',
  intelligenz: 'int',
  weisheit: 'wis',
};

const EN = 'Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma';
const DE = 'Stärke|Geschicklichkeit|Konstitution|Intelligenz|Weisheit|Charisma';

/** Each DC form, with the group numbers of its ability and its DC. */
const DC_FORMS: readonly [RegExp, number, number][] = [
  [new RegExp(`\\bDC\\s+(\\d+)\\s+(${EN})\\s+saving throw`, 'i'), 2, 1],
  [new RegExp(`\\b(${EN})\\s+Saving Throw:\\s*DC\\s+(\\d+)`, 'i'), 1, 2],
  [new RegExp(`(${DE})s?-?rettungswurf\\s+mit\\s+SG\\s+(\\d+)`, 'i'), 1, 2],
];

function readDc(text: string): ActionRow['dc'] {
  let best: { at: number; dc: NonNullable<ActionRow['dc']> } | null = null;
  for (const [form, abilityGroup, dcGroup] of DC_FORMS) {
    const m = form.exec(text);
    const ability = ABILITIES[(m?.[abilityGroup] ?? '').toLowerCase()];
    if (m === null || ability === undefined) continue;
    if (best === null || m.index < best.at) {
      best = { at: m.index, dc: { dc: Number(m[dcGroup]), ability } };
    }
  }
  return best?.dc ?? null;
}

/** The row of an entry, or null when its text has no attack, damage or DC. */
export function actionRow(text: string): ActionRow | null {
  const parts = rollParts(text);
  const row: ActionRow = {
    attack: parts.find((p) => p.kind === 'attack') ?? null,
    damage: parts.filter((p) => p.kind === 'damage'),
    dc: readDc(text),
  };
  return row.attack === null && row.damage.length === 0 && row.dc === null ? null : row;
}
