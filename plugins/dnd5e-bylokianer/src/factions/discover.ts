// Finding factions, sub-factions and their members inside the campaign. A faction is a folder
// holding `factions.md`, or a note named like the folder with `type: faction`; members are the
// character notes in that folder and its plain subfolders.

import { inCampaign, typeOf, type CampaignScope } from '../campaign/scope';
import type { NoteInput } from '../types';
import type { Entity, Warn } from './model';
import { parsePower, parseRelationMap } from './values';

export const PARTY = '@party';
export const UNAFFILIATED = '@unaffiliated';

const FACTION_NOTE = 'factions.md';
const CHARACTER_TYPES = new Set(['npc', 'character']);

function folderOf(path: string): string {
	const slash = path.lastIndexOf('/');
	return slash === -1 ? '' : path.slice(0, slash);
}

function baseName(path: string): string {
	return path.slice(path.lastIndexOf('/') + 1);
}

function stem(path: string): string {
	return baseName(path).replace(/\.md$/i, '');
}

/** The folder itself and each folder above it, nearest first. */
function* foldersUpFrom(folder: string): Generator<string> {
	let current = folder;
	while (current !== '') {
		yield current;
		current = folderOf(current);
	}
}

function nearestFaction(folder: string, factions: ReadonlySet<string>): string | null {
	for (const candidate of foldersUpFrom(folder)) {
		if (factions.has(candidate)) {
			return candidate;
		}
	}
	return null;
}

function pseudoFaction(id: string, name: string): Entity {
	return {
		id,
		kind: 'faction',
		pseudo: true,
		name,
		notePath: null,
		parent: null,
		power: 3,
		relations: new Map(),
		secretRelations: new Map(),
	};
}

export function discoverEntities(
	notes: readonly NoteInput[],
	campaign: CampaignScope,
	warn: Warn,
): Map<string, Entity> {
	const scoped = notes
		.filter((note) => inCampaign(campaign, note.path))
		.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));

	// Pick one faction note per folder.
	const primary = new Map<string, NoteInput>();
	const folderNamed = new Map<string, NoteInput>();
	for (const note of scoped) {
		const folder = folderOf(note.path);
		if (folder === '') {
			continue;
		}
		if (baseName(note.path) === FACTION_NOTE) {
			primary.set(folder, note);
		} else if (stem(note.path) === baseName(folder) && typeOf(note.frontmatter) === 'faction') {
			folderNamed.set(folder, note);
		}
	}
	const factionNotes = new Map<string, NoteInput>(folderNamed);
	for (const [folder, note] of primary) {
		const other = folderNamed.get(folder);
		if (other !== undefined) {
			warn({ path: other.path, code: 'duplicate-faction-note' });
		}
		if (typeOf(note.frontmatter) !== 'faction') {
			warn({ path: note.path, code: 'missing-type' });
		}
		factionNotes.set(folder, note);
	}
	const factionFolders = new Set(factionNotes.keys());
	const factionNotePaths = new Set([...factionNotes.values()].map((note) => note.path));

	const entities = new Map<string, Entity>();
	const relationsOf = (note: NoteInput) => ({
		relations: parseRelationMap(note.frontmatter?.relations, note.path, 'relations', warn),
		secretRelations: parseRelationMap(
			note.frontmatter?.secret_relations,
			note.path,
			'secret_relations',
			warn,
		),
	});

	for (const folder of [...factionFolders].sort()) {
		const note = factionNotes.get(folder);
		if (note === undefined) {
			continue;
		}
		const rawName = note.frontmatter?.name;
		entities.set(folder, {
			id: folder,
			kind: 'faction',
			pseudo: false,
			name: typeof rawName === 'string' && rawName.trim() !== '' ? rawName.trim() : baseName(folder),
			folderName: baseName(folder),
			notePath: note.path,
			parent: nearestFaction(folderOf(folder), factionFolders),
			power: parsePower(note.frontmatter?.power, note.path, warn),
			...relationsOf(note),
		});
	}

	for (const note of scoped) {
		const type = typeOf(note.frontmatter);
		if (type === undefined || !CHARACTER_TYPES.has(type) || factionNotePaths.has(note.path)) {
			continue;
		}
		const parent =
			nearestFaction(folderOf(note.path), factionFolders) ??
			(type === 'character' ? PARTY : UNAFFILIATED);
		if (parent === PARTY && !entities.has(PARTY)) {
			entities.set(PARTY, pseudoFaction(PARTY, 'Party'));
		}
		if (parent === UNAFFILIATED && !entities.has(UNAFFILIATED)) {
			entities.set(UNAFFILIATED, pseudoFaction(UNAFFILIATED, 'Unaffiliated'));
		}
		entities.set(note.path, {
			id: note.path,
			kind: 'character',
			pseudo: false,
			name: stem(note.path),
			notePath: note.path,
			parent,
			power: 3,
			...relationsOf(note),
		});
	}

	return entities;
}
