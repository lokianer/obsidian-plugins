// Writes a book's private library note from its cleaned batches:
//   node scripts/catalogue/library-spells.mjs <workDir> <outDir> <book>
// The note holds the book's full spell texts and belongs in the GM's own vault only — never in the
// repository or the example vault. SRD spells are left out (their text ships with the plugin).

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TITLES = {
	phb14: ["Player's Handbook (2014)", '2014'],
	xge: ["Xanathar's Guide to Everything", '2014'],
	tce: ["Tasha's Cauldron of Everything", '2014'],
	phb24: ["Player's Handbook (2024)", '2024'],
	frhof: ['Forgotten Realms - Heroes of Faerûn', '2024'],
};

const [workDir, outDir, book] = process.argv.slice(2);
const repo = fileURLToPath(new URL('../../../..', import.meta.url));
const inRepo = (dir) => resolve(dir).toLowerCase().startsWith(repo.toLowerCase());
if (!workDir || !outDir || !book || !(book in TITLES) || inRepo(outDir)) {
	console.error('usage: library-spells.mjs <workDir> <outDir outside the repository> <book>');
	process.exit(1);
}
const [title, rules] = TITLES[book];
const norm = join(workDir, 'norm');
const entries = readdirSync(norm)
	// `<book>-<n>.json`; monster batches are `<book>-m-<n>.json`.
	.filter((f) => f.startsWith(`${book}-`) && /^[a-z0-9]+-\d+\.json$/.test(f))
	.flatMap((f) => JSON.parse(readFileSync(join(norm, f), 'utf8')))
	.filter((e) => e.srd == null && e.note !== 'not a spell')
	.sort((a, b) => a.name.localeCompare(b.name));

const seen = new Set();
const sections = entries
	.filter((e) => !seen.has(e.name) && seen.add(e.name))
	.map((e) => {
		const higher = e.higher ? `\n\n**At Higher Levels.** ${e.higher.trim()}` : '';
		return `## ${e.name}\n\n${e.text.trim()}${higher}\n`;
	});

const note = `---
type: library
source: ${book}
rules: '${rules}'
---

# ${title}

Spells from the GM's own copy of the book, for the dnd5e-byLokianer Spellbook. Private — do not
share or publish.

${sections.join('\n')}`;
const file = join(outDir, `${title.replace(/[\\/:*?"<>|]/g, '-')}.md`);
writeFileSync(file, note);
console.log(`${file}: ${sections.length} spells`);
