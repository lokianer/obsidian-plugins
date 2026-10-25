// Dice tables for the New NPC dialog: names (the same in every language) and the text tables of
// text-tables.ts in English or German. A table note in the vault (one entry per list item) replaces
// a table in either language, so a campaign can bring its own.

import type { Lang } from './races';
import { TEXT_TABLES, type TextTable } from './text-tables';

export type TableName = 'first-names' | 'family-names' | TextTable;

export const TABLE_NAMES: readonly TableName[] = [
  'first-names',
  'family-names',
  ...(Object.keys(TEXT_TABLES) as TextTable[]),
];

/** The note that replaces a table: `NPC first names.md`, `NPC quirks.md` …, in the tables folder. */
export function tableNote(name: TableName): string {
  return `NPC ${name.replace('-', ' ')}.md`;
}

const FIRST_NAMES: readonly string[] = [
  'Alda',
  'Bram',
  'Cass',
  'Doran',
  'Edda',
  'Fenn',
  'Greta',
  'Hollis',
  'Iver',
  'Jessa',
  'Kael',
  'Liesl',
  'Marek',
  'Nell',
  'Osric',
  'Petra',
  'Quill',
  'Rosamund',
  'Silas',
  'Tamsin',
  'Ulric',
  'Vera',
  'Wendel',
  'Ysolde',
  'Zora',
  'Anselm',
  'Brisa',
  'Corwin',
  'Della',
  'Emrys',
  'Agnes',
  'Bertram',
  'Clement',
  'Dagmar',
  'Elric',
  'Frieda',
  'Gideon',
  'Hester',
  'Isolde',
  'Jory',
  'Kasimir',
  'Lotte',
  'Magnus',
  'Nils',
  'Odette',
  'Piet',
  'Ragna',
  'Sten',
  'Tilda',
  'Wilhelmina',
];

const FAMILY_NAMES: readonly string[] = [
  'Ashgrove',
  'Brindle',
  'Coldwater',
  'Dunmore',
  'Ember',
  'Fairweather',
  'Greywick',
  'Harrow',
  'Ironside',
  'Juniper',
  'Kettle',
  'Lark',
  'Mossbank',
  'Nettle',
  'Oakhart',
  'Pike',
  'Quarry',
  'Rook',
  'Saltmarsh',
  'Thorne',
  'Underhill',
  'Vane',
  'Whitlock',
  'Yarrow',
  'Bellweather',
  'Copperpot',
  'Driftwood',
  'Fenwick',
  'Gallows',
  'Tidewell',
  'Ambergris',
  'Blackwood',
  'Candlewick',
  'Dewhurst',
  'Eelgrass',
  'Flint',
  'Gullwing',
  'Hookham',
  'Inkwell',
  'Larder',
  'Millpond',
  'Netherby',
  'Oarsman',
  'Quayle',
  'Ropewalk',
  'Seabright',
  'Tallow',
  'Weatherby',
  'Wharf',
  'Brackwater',
];

/** Every table in one language. */
export function tablesFor(lang: Lang): Record<TableName, readonly string[]> {
  const tables: Record<TableName, readonly string[]> = {
    'first-names': FIRST_NAMES,
    'family-names': FAMILY_NAMES,
  } as Record<TableName, readonly string[]>;
  for (const name of Object.keys(TEXT_TABLES) as TextTable[]) {
    tables[name] = TEXT_TABLES[name].map(([en, de]) => (lang === 'de' ? de : en));
  }
  return tables;
}

/** A table from a note's text: its list items, in order; empty when it has none. */
export function tableFromNote(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => /^\s*[-*+]\s+(.*\S)\s*$/.exec(line)?.[1])
    .filter((entry): entry is string => entry !== undefined);
}

/** One entry, chosen by `random` (Math.random in use, a fixed function in tests). */
export function pick(table: readonly string[], random: () => number = Math.random): string {
  return table[Math.floor(random() * table.length)] ?? '';
}
