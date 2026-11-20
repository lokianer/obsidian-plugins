// Builds the public monster catalogue.
//   node scripts/catalogue/build-monsters.mjs --from <workDir> <book…>   cleaned batches → data JSON
//   node scripts/catalogue/build-monsters.mjs                             data JSON → src/catalogue/monsters.ts
// The data JSON (`scripts/catalogue/data/monsters-<book>.json`) holds facts, names and our own
// summaries — never the books' stat blocks, which stay in the private work files and library notes.
// The plugin gets a minimal stat block made from the facts (no traits or actions). A monster
// reprinted in a newer book of the same rule set keeps only the newest entry; a 2014 book never
// repeats an SRD monster.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const here = new URL('.', import.meta.url);
const dataDir = new URL('data/', here);
const RULES = { mm14: '2014', dmg14: '2014', tce: '2014', mpmm: '2014', fraif: '2024' };
/** Newest last: a reprint keeps the entry of the book furthest down. */
const ORDER = ['mm14', 'dmg14', 'tce', 'mpmm', 'fraif'];
const FACTS = [
	'name',
	'nameDe',
	'cr',
	'type',
	'subtype',
	'size',
	'alignment',
	'ac',
	'acClass',
	'hp',
	'hitDice',
	'speed',
	'stats',
	'legendary',
	'spellcaster',
	'summary',
];
const MOVES = ['fly', 'swim', 'burrow', 'climb'];

export const slug = (name) =>
	name
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[’']/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

const fold = (name) => name.replace(/\\'/g, "'").toLowerCase().replace(/’/g, "'");

/** The SRD's monsters: English name → German name (src/monsters/de.ts, else the English one). */
function srdNames() {
	const source = readFileSync(new URL('../../src/monsters/srd-monsters.ts', here), 'utf8');
	const de = readFileSync(new URL('../../src/monsters/de.ts', here), 'utf8');
	const deNames = new Map(
		[...de.matchAll(/^ {2}'?([a-z0-9-]+)'?: (['"])(.+)\2,$/gm)].map((m) => [m[1], m[3]]),
	);
	return new Map(
		[...source.matchAll(/^ {4}index: '([^']+)',\r?\n {4}name: (['"])(.+)\2,$/gm)].map((m) => [
			fold(m[3]),
			deNames.get(m[1]) ?? m[3],
		]),
	);
}

const SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];

/** The challenge rating of a block that prints none: summoned spirits, companions, artifacts. */
export const NO_CR = '—';
/** The cleaners mark such a block with this note (its `cr` is a placeholder). */
const summoned = (e) => /^No CR printed/i.test(e.note ?? '');

/** Every fact the minimal stat block needs is there (a summoned block may scale its hit points). */
const complete = (e) =>
	SIZES.includes(e.size) &&
	e.ac > 0 &&
	(e.hp > 0 || (summoned(e) && e.hp === 0)) &&
	Array.isArray(e.stats) &&
	e.stats.length === 6 &&
	e.stats.every((n) => n > 0) &&
	(summoned(e) || String(e.cr ?? '') !== '');

function fromWork(workDir, books) {
	const norm = join(workDir, 'norm');
	const srd = srdNames();
	/** A newer version of an SRD monster keeps the SRD's German name. */
	const nameDe = (e) => srd.get(fold(e.name)) ?? e.nameDe;
	for (const book of books) {
		const entries = readdirSync(norm)
			.filter((f) => f.startsWith(`${book}-m-`) && /-m-\d+\.json$/.test(f))
			.flatMap((f) => JSON.parse(readFileSync(join(norm, f), 'utf8')))
			.filter(
				(e) => e.srd == null && e.note !== 'not a monster' && typeof e.name === 'string',
			)
			.filter((e) => RULES[book] !== '2014' || !srd.has(fold(e.name)));
		// A block the scan did not give complete facts for waits for a look at the book.
		const incomplete = entries.filter((e) => !complete(e));
		for (const e of incomplete) console.log(`  left out, facts incomplete: ${e.id} ${e.name}`);
		const seen = new Set();
		const monsters = entries
			.filter(complete)
			.map((e) =>
				Object.fromEntries([
					['index', `${book}/${slug(e.name)}`],
					...FACTS.map((k) => [
						k,
						k === 'nameDe' ? nameDe(e) : k === 'cr' && summoned(e) ? NO_CR : e[k],
					]),
				]),
			)
			.sort((a, b) => a.index.localeCompare(b.index))
			.filter((m) => !seen.has(m.index) && seen.add(m.index));
		writeFileSync(
			new URL(`monsters-${book}.json`, dataDir),
			`${JSON.stringify(monsters, null, 1)}\n`,
		);
		console.log(
			`${book}: ${monsters.length} monsters (${entries.length - incomplete.length - monsters.length} duplicates dropped)`,
		);
	}
}

const q = (s) => JSON.stringify(String(s));

/** The stat block the facts allow: header, abilities, challenge. */
function minimalYaml(m) {
	const lines = [
		`name: ${q(m.name)}`,
		`size: ${m.size}`,
		`type: ${q(m.type)}`,
		m.subtype ? `subtype: ${q(m.subtype)}` : null,
		m.alignment ? `alignment: ${q(m.alignment)}` : null,
		`ac: ${m.ac}`,
		m.acClass ? `ac_class: ${q(m.acClass)}` : null,
		m.hp > 0 ? `hp: ${m.hp}` : null,
		m.hitDice ? `hit_dice: ${q(m.hitDice)}` : null,
		m.speed ? `speed: ${q(m.speed)}` : null,
		`stats: [${m.stats.join(', ')}]`,
		m.cr === NO_CR ? null : `cr: ${q(m.cr)}`,
	];
	return lines.filter((l) => l !== null).join('\n');
}

function toSource() {
	const books = ORDER.filter((b) => readdirSync(dataDir).includes(`monsters-${b}.json`));
	const newest = new Map();
	for (const book of books) {
		for (const m of JSON.parse(
			readFileSync(new URL(`monsters-${book}.json`, dataDir), 'utf8'),
		)) {
			const key = `${RULES[book]}:${slug(m.name)}`;
			// A reprint keeps the older books' keys, so their library notes still apply.
			const older = newest.get(key);
			const reprints = older === undefined ? [] : [...older.reprints, older.source];
			newest.set(key, { ...m, rules: RULES[book], source: book, reprints });
		}
	}
	const all = [...newest.values()]
		.map((m) => ({
			index: m.index,
			name: m.name,
			nameDe: m.nameDe,
			cr: String(m.cr),
			type: m.type,
			size: m.size,
			ac: m.ac,
			hp: m.hp,
			moves: MOVES.filter((v) => new RegExp(`\\b${v}\\b`, 'i').test(m.speed ?? '')),
			legendary: m.legendary,
			spellcaster: m.spellcaster,
			rules: m.rules,
			source: m.source,
			summary: m.summary,
			...(m.reprints.length > 0 ? { reprints: m.reprints } : {}),
			yaml: minimalYaml(m),
		}))
		.sort((a, b) => a.index.localeCompare(b.index));
	const out = `// The monster catalogue: facts, names and summaries in our own words for the monsters of the
// books in \`src/catalogue/books.ts\` that are not in the SRD, each with a stat block made from the
// facts alone (no traits or actions; the full block comes from the GM's library note). Generated
// by scripts/catalogue/build-monsters.mjs from scripts/catalogue/data/. Do not edit by hand.

import type { SrdMonster } from '../monsters/model';

export const CATALOGUE_MONSTERS: readonly SrdMonster[] = ${JSON.stringify(all, null, 2)};
`;
	writeFileSync(new URL('../../src/catalogue/monsters.ts', here), out);
	console.log(`src/catalogue/monsters.ts: ${all.length} monsters from ${books.join(', ')}`);
}

const args = process.argv.slice(2);
if (args[0] === '--from') fromWork(args[1], args.slice(2));
else toSource();
