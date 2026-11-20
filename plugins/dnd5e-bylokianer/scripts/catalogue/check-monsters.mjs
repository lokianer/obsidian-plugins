// Checks cleaned monster batches: the facts' shapes, the stat block YAML (parses, agrees with the
// facts), and the summaries (length, no run of eight words shared with the raw window). Prints one
// line per problem and per note. Holds no book text itself.
//   node check-monsters.mjs <workDir> [book…]

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { parse } from 'yaml';

const SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
const CR = /^(0|1\/8|1\/4|1\/2|[1-9]|[12]\d|30)$/;

const words = (s) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9äöüß ]/g, ' ')
		.split(/\s+/)
		.filter(Boolean);

/** The first run of eight words `summary` shares with `source`, or null. */
function copied(summary, source) {
	const grams = new Set();
	const w = words(source);
	for (let i = 0; i + 8 <= w.length; i++) grams.add(w.slice(i, i + 8).join(' '));
	const s = words(summary);
	for (let i = 0; i + 8 <= s.length; i++) {
		const g = s.slice(i, i + 8).join(' ');
		if (grams.has(g)) return g;
	}
	return null;
}

/** The problems of one cleaned entry, given its raw window. */
export function problems(e, window) {
	if (e.note === 'not a monster' || typeof e.srd === 'string') return [];
	const out = [];
	const need = (ok, msg) => ok || out.push(msg);
	need(
		typeof e.name === 'string' && e.name.length > 1 && e.name !== e.name.toUpperCase(),
		'name',
	);
	need(typeof e.nameDe === 'string' && e.nameDe.length > 1, 'nameDe');
	need(SIZES.includes(e.size), `size ${e.size}`);
	need(typeof e.type === 'string' && e.type === e.type.toLowerCase() && e.type !== '', 'type');
	need(Number.isInteger(e.ac) && e.ac > 0 && e.ac < 30, 'ac');
	need(Number.isInteger(e.hp) && e.hp > 0, 'hp');
	need(
		Array.isArray(e.stats) &&
			e.stats.length === 6 &&
			e.stats.every((n) => Number.isInteger(n) && n > 0 && n <= 30),
		'stats',
	);
	need(CR.test(String(e.cr)), `cr ${e.cr}`);
	need(typeof e.legendary === 'boolean' && typeof e.spellcaster === 'boolean', 'flags');
	for (const lang of ['en', 'de']) {
		const s = e.summary?.[lang];
		need(typeof s === 'string' && s.length > 20 && s.length <= 300, `summary.${lang} length`);
	}
	const copy = copied(e.summary?.en ?? '', window);
	if (copy !== null) out.push(`summary.en copies "${copy}"`);
	let block = null;
	try {
		block = parse(e.yaml ?? '');
	} catch (error) {
		out.push(`yaml does not parse: ${String(error).split('\n')[0]}`);
	}
	if (block !== null && typeof block === 'object') {
		need(block.name === e.name, 'yaml name ≠ name');
		need(Number(block.ac) === e.ac, 'yaml ac ≠ ac');
		need(Number(block.hp) === e.hp, 'yaml hp ≠ hp');
		need(String(block.cr) === String(e.cr), 'yaml cr ≠ cr');
		need(JSON.stringify(block.stats) === JSON.stringify(e.stats), 'yaml stats ≠ stats');
		need(Array.isArray(block.actions) && block.actions.length > 0, 'yaml has no actions');
		need(
			!e.legendary || Array.isArray(block.legendary_actions),
			'legendary without legendary_actions',
		);
		const entries = ['traits', 'actions', 'bonus_actions', 'reactions', 'legendary_actions'];
		for (const key of entries) {
			if (block[key] === undefined) continue;
			need(
				Array.isArray(block[key]) &&
					block[key].every(
						(x) => typeof x?.name === 'string' && typeof x?.desc === 'string',
					),
				`yaml ${key} entries need name and desc`,
			);
		}
	} else if (block !== null) out.push('yaml is not a mapping');
	return out;
}

const [workDir, ...books] = process.argv.slice(2);
if (workDir !== undefined) {
	const norm = join(workDir, 'norm');
	const files = readdirSync(norm).filter(
		(f) =>
			/-m-\d+\.json$/.test(f) &&
			(books.length === 0 || books.some((b) => f.startsWith(`${b}-m-`))),
	);
	let count = 0;
	let bad = 0;
	for (const f of files) {
		const raw = JSON.parse(readFileSync(join(workDir, 'batches', f), 'utf8'));
		const windows = new Map(raw.map((r) => [r.id, r.text]));
		const entries = JSON.parse(readFileSync(join(norm, f), 'utf8'));
		if (entries.length !== raw.length)
			console.log(`${f}: ${entries.length} entries for ${raw.length} windows`);
		for (const e of entries) {
			count++;
			const found = problems(e, windows.get(e.id) ?? '');
			if (found.length > 0) bad++;
			for (const p of found) console.log(`${e.id} ${e.name ?? ''}: ${p}`);
			if (e.note && e.note !== 'not a monster')
				console.log(`${e.id} ${e.name ?? ''}: note — ${e.note}`);
		}
	}
	console.log(`${count} entries checked, ${bad} with problems`);
}
