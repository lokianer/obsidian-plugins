// Cuts a book's spells out of its `pdftotext -enc UTF-8` dump into a private work file:
//   node scripts/catalogue/extract-spells.mjs <book> <dialect: en|it> <dump.txt> <outDir>
// The work file holds the book's text and must stay outside the repository.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { segmentSpells, unmatched } from './parse-spells.mjs';

const [book, dialect, dump, outDir] = process.argv.slice(2);
if (!book || !dialect || !dump || !outDir) {
	console.error('usage: extract-spells.mjs <book> <en|it> <dump.txt> <outDir>');
	process.exit(1);
}
if (/obsidian-plugins/i.test(outDir)) {
	console.error('refusing to write book text inside the repository');
	process.exit(1);
}
const text = readFileSync(dump, 'utf8');
const spells = segmentSpells(text, dialect);
const missed = unmatched(text, dialect);
const file = join(outDir, `${book}-spells.raw.json`);
writeFileSync(file, JSON.stringify(spells, null, 1));
const empty = spells.filter((s) => !s.name || !s.casting || !s.range || !s.duration);
console.log(
	`${book}: ${spells.length} spells, ${empty.length} with an empty field, ${missed.length} missed → ${file}`,
);
if (process.env.SHOW_MISSED) for (const m of missed) console.log(`  missed: ${m.slice(0, 220)}`);
