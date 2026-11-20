// Library notes: the GM's own full texts of a book, one `##` section per entry. A section is keyed
// like the catalogue entry it belongs to: `<book>/<slugged heading>`. Pure.

import type { BookKey } from './books';
import type { LibrarySection } from './merge';

/** A name as a catalogue key: lower case, no accents or apostrophes, words joined by `-`. */
export function catalogueSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const HIGHER =
  /^\*\*(?:At Higher Levels|Using a Higher-Level Spell Slot|Cantrip Upgrade)\.\*\*\s*/m;

/** A note's `##` sections by key; the "At Higher Levels" paragraph split off. */
export function librarySections(source: BookKey, markdown: string): Map<string, LibrarySection> {
  const sections = new Map<string, LibrarySection>();
  const parts = markdown.split(/^## +/m).slice(1);
  for (const part of parts) {
    const newline = part.indexOf('\n');
    const heading = (newline < 0 ? part : part.slice(0, newline)).trim();
    const body = newline < 0 ? '' : part.slice(newline + 1);
    const higher = body.match(HIGHER);
    const text = higher === null ? body : body.slice(0, higher.index);
    sections.set(`${source}/${catalogueSlug(heading)}`, {
      text: text.trim(),
      higher: higher === null ? '' : body.slice((higher.index ?? 0) + higher[0].length).trim(),
    });
  }
  return sections;
}
