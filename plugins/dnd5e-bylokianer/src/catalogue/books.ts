// The books the catalogues draw on: their keys, rule sets and titles. Facts only. Pure.

export type Rules = '2014' | '2024';

/** Which rule set the GM plays by: which version a spell name in a stat block means. */
export type RulesSetting = 'both' | Rules;

export type BookKey =
  'phb14' | 'dmg14' | 'mm14' | 'xge' | 'tce' | 'mpmm' | 'phb24' | 'frhof' | 'fraif';

export interface Book {
  rules: Rules;
  en: string;
  de: string;
}

export const BOOKS: Readonly<Record<BookKey, Book>> = {
  phb14: { rules: '2014', en: "Player's Handbook (2014)", de: 'Spielerhandbuch (2014)' },
  dmg14: { rules: '2014', en: "Dungeon Master's Guide (2014)", de: 'Spielleiterhandbuch (2014)' },
  mm14: { rules: '2014', en: 'Monster Manual (2014)', de: 'Monsterhandbuch (2014)' },
  xge: { rules: '2014', en: "Xanathar's Guide to Everything", de: 'Xanathars Ratgeber für alles' },
  tce: { rules: '2014', en: "Tasha's Cauldron of Everything", de: 'Tashas Kessel für alles' },
  mpmm: {
    rules: '2014',
    en: 'Mordenkainen Presents: Monsters of the Multiverse',
    de: 'Mordenkainen präsentiert: Monster des Multiversums',
  },
  phb24: { rules: '2024', en: "Player's Handbook (2024)", de: 'Spielerhandbuch (2024)' },
  frhof: {
    rules: '2024',
    en: 'Forgotten Realms: Heroes of Faerûn',
    de: 'Forgotten Realms: Helden von Faerûn',
  },
  fraif: {
    rules: '2024',
    en: 'Forgotten Realms: Adventures in Faerûn',
    de: 'Forgotten Realms: Abenteuer in Faerûn',
  },
};

export const isBookKey = (v: unknown): v is BookKey =>
  typeof v === 'string' && Object.prototype.hasOwnProperty.call(BOOKS, v);
