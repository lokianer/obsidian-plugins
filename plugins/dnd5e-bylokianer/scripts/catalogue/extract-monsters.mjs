// Cuts a book's text (from `pdftotext -enc UTF-8`, reading order) into raw stat block windows and
// writes them as batches for cleaning. A stat block is found by its armour class line (2014:
// `Armor Class 15`, 2024: `Initiative +2 (12)`); its window runs from a little before that line
// (where the name and the size line are) to a little before the next one. OCR noise and stray
// page text stay in; the cleaning sorts them out. Holds no book text itself.
//   node extract-monsters.mjs <book> <2014|2024> <dump> <workDir> [batch size]

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const raw = String.raw;

/** Before the armour class line: the name and the size line. */
const LEAD = 500;
/** The most text a window keeps. */
const MAX = 10000;
/** Past the next block's armour class line: in two columns a block's actions may come after it. */
const TAIL = 3000;

const ANCHOR = {
	// OCR may space the letters: `Armor C lass 1 5`.
	2014: new RegExp(raw`A\s*r\s*m\s*o\s*r\s+C\s*l\s*a\s*s\s*s\s+\d`, 'g'),
	2024: new RegExp(raw`\bInitiative\s+[+−-]\d+\s*\(\d+\)`, 'g'),
};

/** The raw windows of a book's text, in book order. Pure. */
export function monsterWindows(text, rules) {
	const at = [...text.matchAll(ANCHOR[rules])].map((m) => m.index ?? 0);
	return at.map((a, k) => {
		const start = Math.max(0, a - LEAD);
		const next = at[k + 1] === undefined ? text.length : at[k + 1] + TAIL;
		const end = Math.min(next, start + MAX);
		return text.slice(start, Math.max(end, a + 40));
	});
}

const [book, rules, dump, workDir, size = '20'] = process.argv.slice(2);
if (book !== undefined) {
	const repo = resolve(
		new URL('../../../..', import.meta.url).pathname.replace(/^\/(\w:)/, '$1'),
	);
	if (resolve(workDir).toLowerCase().startsWith(repo.toLowerCase())) {
		throw new Error('The work folder must be outside the repository.');
	}
	const windows = monsterWindows(readFileSync(dump, 'utf8'), rules);
	const entries = windows.map((text, i) => ({ id: `${book}-m${i}`, text }));
	mkdirSync(join(workDir, 'batches'), { recursive: true });
	const n = Number(size);
	for (let i = 0; i * n < entries.length; i++) {
		writeFileSync(
			join(workDir, 'batches', `${book}-m-${i}.json`),
			JSON.stringify(entries.slice(i * n, (i + 1) * n), null, 1),
		);
	}
	console.log(
		`${book}: ${entries.length} stat blocks in ${Math.ceil(entries.length / n)} batches`,
	);
}
