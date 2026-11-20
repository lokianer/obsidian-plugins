// Splits a raw work file into batches for cleaning (names, facts, summaries, library text):
//   node scripts/catalogue/batch-spells.mjs <book> <workDir> [size=40] [--skip-srd]
// With --skip-srd, entries whose name is an SRD spell's are left out (their text is in the plugin).
// Reads and writes private work files only.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const skipSrd = args.includes('--skip-srd');
const [book, workDir, size = '40'] = args.filter((a) => !a.startsWith('--'));
if (!book || !workDir || /obsidian-plugins/i.test(workDir)) {
	console.error(
		'usage: batch-spells.mjs <book> <workDir outside the repository> [size] [--skip-srd]',
	);
	process.exit(1);
}

const srdSource = readFileSync(new URL('../../src/spells/srd-spells.ts', import.meta.url), 'utf8');
const srdNames = [...srdSource.matchAll(/^ {4}name: '((?:[^'\\]|\\.)*)',/gm)].map((m) =>
	m[1].replace(/\\'/g, "'"),
);
const key = (s) => s.toUpperCase().replace(/[^A-Z]/g, '');
const srd = new Set(srdNames.map(key));

const raw = JSON.parse(readFileSync(join(workDir, `${book}-spells.raw.json`), 'utf8'));
const entries = raw
	.map((s, i) => ({ id: `${book}-${i}`, ...s }))
	.filter((s) => !(skipSrd && srd.has(key(s.name))));
const dir = join(workDir, 'batches');
mkdirSync(dir, { recursive: true });
const n = Number(size);
let count = 0;
for (let i = 0; i < entries.length; i += n, count++) {
	writeFileSync(
		join(dir, `${book}-${count}.json`),
		JSON.stringify(entries.slice(i, i + n), null, 1),
	);
}
writeFileSync(join(dir, 'srd-names.json'), JSON.stringify(srdNames));
console.log(`${book}: ${entries.length} entries in ${count} batches → ${dir}`);
