// Checks cleaned spell batches before they become catalogue data:
//   node scripts/catalogue/check-spells.mjs <workDir> [book…]
// Every field in its allowed shape, summaries short, and no run of eight words shared between a
// summary and the book's text (the summaries must be our own words). Prints problems; exits 1 on any.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [workDir, ...books] = process.argv.slice(2);
const SCHOOLS = [
	'abjuration',
	'conjuration',
	'divination',
	'enchantment',
	'evocation',
	'illusion',
	'necromancy',
	'transmutation',
];
const CLASSES = ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard'];
const DAMAGE = [
	'acid',
	'bludgeoning',
	'cold',
	'fire',
	'force',
	'lightning',
	'necrotic',
	'piercing',
	'poison',
	'psychic',
	'radiant',
	'slashing',
	'thunder',
];
const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

const words = (s) =>
	s
		.toLowerCase()
		.replace(/[^\p{L}\d ]+/gu, ' ')
		.split(/\s+/)
		.filter(Boolean);
const runs = (s, n = 8) => {
	const w = words(s);
	return new Set(
		w.slice(0, Math.max(0, w.length - n + 1)).map((_, i) => w.slice(i, i + n).join(' ')),
	);
};

/** The problems of one cleaned entry, given the raw body it came from. */
export function problems(e, rawBody) {
	const out = [];
	if (e.note === 'not a spell' || typeof e.srd === 'string') return out;
	const str = (k) => typeof e[k] === 'string' && e[k].trim() !== '';
	for (const k of ['name', 'nameDe', 'casting', 'range', 'duration', 'text'])
		if (!str(k)) out.push(`${k} empty`);
	if (!Number.isInteger(e.level) || e.level < 0 || e.level > 9) out.push('level');
	if (!SCHOOLS.includes(e.school)) out.push(`school ${e.school}`);
	if (!Array.isArray(e.components) || e.components.some((c) => !['V', 'S', 'M'].includes(c)))
		out.push('components');
	if ((e.components?.includes('M') ?? false) !== ((e.material ?? '') !== ''))
		out.push('material vs M');
	if (
		!Array.isArray(e.classes) ||
		e.classes.length === 0 ||
		e.classes.some((c) => !CLASSES.includes(c))
	)
		out.push(`classes ${e.classes}`);
	if (!Array.isArray(e.damage) || e.damage.some((d) => !DAMAGE.includes(d)))
		out.push(`damage ${e.damage}`);
	if (e.save !== null && !ABILITIES.includes(e.save)) out.push(`save ${e.save}`);
	if (e.attack !== null && !['melee', 'ranged'].includes(e.attack))
		out.push(`attack ${e.attack}`);
	if (typeof e.concentration !== 'boolean' || typeof e.ritual !== 'boolean') out.push('flags');
	if (e.concentration !== /^Up to /.test(e.duration ?? ''))
		out.push(`concentration vs duration "${e.duration}"`);
	if (/metr|incantatore|azione/i.test(`${e.range} ${e.casting} ${e.duration}`))
		out.push('untranslated header');
	for (const lang of ['en', 'de']) {
		const s = e.summary?.[lang];
		if (typeof s !== 'string' || s.trim() === '') out.push(`summary.${lang} empty`);
		else if (s.length > 400) out.push(`summary.${lang} ${s.length} chars`);
	}
	const source = runs(`${rawBody ?? ''}\n${e.text ?? ''}\n${e.higher ?? ''}`);
	for (const run of runs(e.summary?.en ?? '')) {
		if (source.has(run)) {
			out.push(`summary.en copies "${run}"`);
			break;
		}
	}
	return out;
}

if (workDir) {
	const norm = join(workDir, 'norm');
	const raws = new Map();
	for (const f of readdirSync(join(workDir, 'batches'))) {
		if (!/^[a-z0-9]+-\d+\.json$/.test(f)) continue;
		for (const r of JSON.parse(readFileSync(join(workDir, 'batches', f), 'utf8')))
			raws.set(r.id, r);
	}
	let bad = 0;
	let total = 0;
	for (const f of readdirSync(norm)
		.filter((f) => /^[a-z0-9]+-\d+\.json$/.test(f))
		.sort()) {
		if (books.length > 0 && !books.includes(f.split('-')[0])) continue;
		const entries = JSON.parse(readFileSync(join(norm, f), 'utf8'));
		const ids = JSON.parse(readFileSync(join(workDir, 'batches', f), 'utf8')).map((r) => r.id);
		const missing = ids.filter((id) => !entries.some((e) => e.id === id));
		if (missing.length > 0) {
			console.log(`${f}: missing ${missing.join(', ')}`);
			bad++;
		}
		for (const e of entries) {
			total++;
			const p = problems(e, raws.get(e.id)?.body);
			if (e.note) console.log(`${f} ${e.id} ${e.name ?? ''}: note — ${e.note}`);
			if (p.length > 0) {
				bad++;
				console.log(`${f} ${e.id} ${e.name ?? ''}: ${p.join('; ')}`);
			}
		}
	}
	console.log(`${total} entries checked, ${bad} with problems`);
	process.exit(bad > 0 ? 1 : 0);
}
