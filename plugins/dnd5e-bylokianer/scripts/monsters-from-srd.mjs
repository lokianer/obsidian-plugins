// Writes src/monsters/srd-monsters.ts from the 5e-bits SRD database's monster file
// (https://github.com/5e-bits/5e-database, src/2014/en/5e-SRD-Monsters.json, MIT licence; the text
// is the SRD 5.1's, CC-BY-4.0). Run once when the data changes:
//   node scripts/monsters-from-srd.mjs path/to/5e-SRD-Monsters.json
// then `pnpm format`. The plugin never fetches anything: the generated file ships with it.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = process.argv[2];
if (source === undefined) {
	console.error('Usage: node scripts/monsters-from-srd.mjs path/to/5e-SRD-Monsters.json');
	process.exit(1);
}

/** Corrections where the database differs from the SRD. */
const FIXES = {
	// The SRD gives the Cult Fanatic 33 (6d8 + 6) hit points, as `SRD_NPCS` has it.
	'cult-fanatic': (m) => ({ ...m, hit_points: 33, hit_points_roll: '6d8+6', hit_dice: '6d8' }),
};

const ABILITY = { STR: 'str', DEX: 'dex', CON: 'con', INT: 'int', WIS: 'wis', CHA: 'cha' };

/** `1/8`, `1/4`, `1/2` or the whole number, as the SRD writes challenge ratings. */
function cr(value) {
	return { 0.125: '1/8', 0.25: '1/4', 0.5: '1/2' }[value] ?? String(value);
}

/** `19d12+133` as the SRD writes it: `19d12 + 133`. */
function dice(roll) {
	return roll.replace(/\s*([+-])\s*/g, ' $1 ');
}

/** Armour class: the first entry's value; the kind and any other values in the note, as the SRD. */
function armour(entries) {
	const [first, ...more] = entries;
	const notes = [];
	if (first.type === 'natural') notes.push('natural armor');
	if (first.type === 'armor') {
		notes.push(first.desc ?? first.armor.map((a) => a.name.toLowerCase()).join(', '));
	}
	for (const e of more) {
		if (e.type === 'spell') notes.push(`${e.value} with ${e.spell.name.toLowerCase()}`);
		else if (e.type === 'condition')
			notes.push(`${e.value} while ${e.condition.name.toLowerCase()}`);
		else notes.push(`${e.value} ${e.desc ?? e.type}`);
	}
	return { ac: first.value, note: notes.join(', ') };
}

function speed(s) {
	const parts = [];
	if (s.walk !== undefined) parts.push(s.walk);
	for (const kind of ['burrow', 'climb', 'fly', 'swim']) {
		if (s[kind] === undefined) continue;
		parts.push(`${kind} ${s[kind]}${kind === 'fly' && s.hover ? ' (hover)' : ''}`);
	}
	return parts.join(', ');
}

function senses(s) {
	const parts = [];
	for (const kind of ['blindsight', 'darkvision', 'tremorsense', 'truesight']) {
		if (s[kind] !== undefined) parts.push(`${kind} ${s[kind]}`);
	}
	parts.push(`passive Perception ${s.passive_perception}`);
	return parts.join(', ');
}

/** A trait's or action's name with its usage, as the SRD prints it. */
function entryName(entry) {
	const u = entry.usage;
	if (u === undefined) return entry.name;
	if (u.type === 'per day') return `${entry.name} (${u.times}/Day)`;
	if (u.type === 'recharge on roll') {
		const max = Number(u.dice.split('d')[1]);
		return `${entry.name} (Recharge ${u.min_value === max ? max : `${u.min_value}–${max}`})`;
	}
	if (u.type === 'recharge after rest') {
		const rests = u.rest_types.map((r) => (r === 'short' ? 'Short' : 'Long'));
		return `${entry.name} (Recharges after a ${rests.join(' or ')} Rest)`;
	}
	return entry.name;
}

const q = (s) => JSON.stringify(s);

function entries(key, list) {
	if (list === undefined || list.length === 0) return [];
	return [
		`${key}:`,
		...list.flatMap((e) => [`  - name: ${q(entryName(e))}`, `    desc: ${q(e.desc)}`]),
	];
}

function yaml(m, armourClass) {
	const saves = [];
	const skills = [];
	for (const p of m.proficiencies) {
		const [kind, what] = p.proficiency.name.split(': ');
		if (kind === 'Saving Throw') saves.push(`  - ${ABILITY[what]}: ${p.value}`);
		if (kind === 'Skill')
			skills.push(`  - ${what.toLowerCase().replace(/ /g, '_')}: ${p.value}`);
	}
	const list = (v) =>
		Array.isArray(v) && v.length > 0 ? v.map((x) => x.name ?? x).join('; ') : null;
	const lines = [
		`name: ${q(m.name)}`,
		`size: ${m.size}`,
		`type: ${q(m.type)}`,
		...(m.subtype ? [`subtype: ${q(m.subtype)}`] : []),
		`alignment: ${q(m.alignment)}`,
		`ac: ${armourClass.ac}`,
		...(armourClass.note !== '' ? [`ac_class: ${q(armourClass.note)}`] : []),
		`hp: ${m.hit_points}`,
		`hit_dice: ${q(dice(m.hit_points_roll))}`,
		`speed: ${q(speed(m.speed))}`,
		`stats: [${[m.strength, m.dexterity, m.constitution, m.intelligence, m.wisdom, m.charisma].join(', ')}]`,
		...(saves.length > 0 ? ['saves:', ...saves] : []),
		...(skills.length > 0 ? ['skillsaves:', ...skills] : []),
	];
	for (const [key, value] of [
		['damage_vulnerabilities', list(m.damage_vulnerabilities)],
		['damage_resistances', list(m.damage_resistances)],
		['damage_immunities', list(m.damage_immunities)],
		['condition_immunities', list(m.condition_immunities)?.toLowerCase()],
	]) {
		if (value) lines.push(`${key}: ${q(value)}`);
	}
	lines.push(`senses: ${q(senses(m.senses))}`);
	lines.push(`languages: ${q(m.languages === '' ? '—' : m.languages)}`);
	lines.push(`cr: ${q(cr(m.challenge_rating))}`);
	lines.push(...entries('traits', m.special_abilities));
	lines.push(...entries('actions', m.actions));
	lines.push(...entries('reactions', m.reactions));
	if (m.legendary_actions?.length > 0) {
		// The SRD names the monster short here ("The dragon"), as its own texts do.
		const short = m.name.toLowerCase().split(' ').pop();
		const texts = [...(m.special_abilities ?? []), ...m.actions, ...m.legendary_actions];
		const says = texts.some((e) => e.desc.toLowerCase().includes(`the ${short}`));
		const who = `The ${says ? short : m.name.toLowerCase()}`;
		lines.push(
			`legendary_description: ${q(
				`${who} can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. ${who} regains spent legendary actions at the start of its turn.`,
			)}`,
		);
		lines.push(...entries('legendary_actions', m.legendary_actions));
	}
	return lines.join('\n');
}

const monsters = JSON.parse(readFileSync(source, 'utf8'))
	.map((m) => (FIXES[m.index] ?? ((x) => x))(m))
	.map((m) => {
		const armourClass = armour(m.armor_class);
		const moves = ['fly', 'swim', 'burrow', 'climb'].filter((k) => m.speed[k] !== undefined);
		return {
			index: m.index,
			name: m.name,
			cr: cr(m.challenge_rating),
			type: m.type.startsWith('swarm') ? 'swarm' : m.type,
			size: m.size,
			ac: armourClass.ac,
			hp: m.hit_points,
			moves,
			legendary: (m.legendary_actions?.length ?? 0) > 0,
			spellcaster: (m.special_abilities ?? []).some((a) => /spellcasting/i.test(a.name)),
			yaml: yaml(m, armourClass),
		};
	})
	.sort((a, b) => a.name.localeCompare(b.name));

const out = `// The ${monsters.length} monsters of the System Reference Document 5.1, generated by
// scripts/monsters-from-srd.mjs from the 5e-bits SRD database. SRD 5.1 by Wizards of the Coast,
// CC-BY-4.0 — see NOTICE.md beside this file. Each stat block is YAML in the plugin's format
// (Fantasy Statblocks' keys); the other fields serve the Monster Manual's list and filters.

import type { SrdMonster } from './model';

export const SRD_MONSTERS: readonly SrdMonster[] = ${JSON.stringify(monsters, null, '\t')};
`;
const target = join(dirname(fileURLToPath(import.meta.url)), '../src/monsters/srd-monsters.ts');
writeFileSync(target, out);
console.log(`${monsters.length} monsters → ${target}`);
