// Writes a book's private library note of monsters from its cleaned batches:
//   node scripts/catalogue/library-monsters.mjs <workDir> <outDir> <book>
// The note holds the book's full stat blocks and belongs in the GM's own vault only — never in the
// repository or the example vault. SRD monsters are left out (their blocks ship with the plugin).

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TITLES = {
	mm14: ['Monster Manual (2014)', '2014'],
	dmg14: ["Dungeon Master's Guide (2014)", '2014'],
	tce: ["Tasha's Cauldron of Everything", '2014'],
	mpmm: ['Mordenkainen Presents - Monsters of the Multiverse', '2014'],
	fraif: ['Forgotten Realms - Adventures in Faerûn', '2024'],
};

const [workDir, outDir, book] = process.argv.slice(2);
if (!workDir || !outDir || !book || !(book in TITLES) || /obsidian-plugins/i.test(outDir)) {
	console.error('usage: library-monsters.mjs <workDir> <outDir outside the repository> <book>');
	process.exit(1);
}
const [title, rules] = TITLES[book];
const norm = join(workDir, 'norm');
const entries = readdirSync(norm)
	.filter((f) => f.startsWith(`${book}-m-`) && /-m-\d+\.json$/.test(f))
	.flatMap((f) => JSON.parse(readFileSync(join(norm, f), 'utf8')))
	.filter((e) => e.srd == null && e.note !== 'not a monster' && typeof e.yaml === 'string')
	.sort((a, b) => a.name.localeCompare(b.name));

const seen = new Set();
const sections = entries
	.filter((e) => !seen.has(e.name) && seen.add(e.name))
	.map((e) => `## ${e.name}\n\n\`\`\`dnd5e-statblock\n${e.yaml.trim()}\n\`\`\`\n`);

const note = `---
type: library
source: ${book}
rules: '${rules}'
---

# ${title} — Monsters

Stat blocks from the GM's own copy of the book, for the dnd5e-byLokianer Monster Manual. Private —
do not share or publish.

${sections.join('\n')}`;
const file = join(outDir, `${title.replace(/[\\/:*?"<>|]/g, '-')} - Monsters.md`);
writeFileSync(file, note);
console.log(`${file}: ${sections.length} monsters`);
