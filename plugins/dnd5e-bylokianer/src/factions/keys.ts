// Turning the names written as relation keys into entity ids. Order: exact faction name, exact
// folder name, exact character name, then the same three ignoring case. A faction beats a
// character of the same name; of two factions with one name the smaller id wins. Of two keys that
// name the same target the first written wins.

import type { Entity, Relation, RelationField, ResolvedEntity, Warn } from './model';

type Index = Map<string, string>;

/** Adds name → id unless the name is taken; returns the id that already held it, if any. */
function claim(index: Index, name: string, id: string): string | undefined {
	const held = index.get(name);
	if (held === undefined) {
		index.set(name, id);
	}
	return held;
}

interface Indexes {
	factionName: Index;
	folderName: Index;
	characterName: Index;
	factionNameCi: Index;
	folderNameCi: Index;
	characterNameCi: Index;
}

function buildIndexes(entities: Map<string, Entity>, warn: Warn): Indexes {
	const indexes: Indexes = {
		factionName: new Map(),
		folderName: new Map(),
		characterName: new Map(),
		factionNameCi: new Map(),
		folderNameCi: new Map(),
		characterNameCi: new Map(),
	};
	const sorted = [...entities.values()]
		.filter((entity) => !entity.pseudo)
		.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
	for (const entity of sorted) {
		if (entity.kind === 'faction') {
			if (claim(indexes.factionName, entity.name, entity.id) !== undefined && entity.notePath) {
				warn({ path: entity.notePath, code: 'duplicate-name' });
			}
			claim(indexes.factionNameCi, entity.name.toLowerCase(), entity.id);
			if (entity.folderName !== undefined) {
				claim(indexes.folderName, entity.folderName, entity.id);
				claim(indexes.folderNameCi, entity.folderName.toLowerCase(), entity.id);
			}
		} else {
			if (claim(indexes.characterName, entity.name, entity.id) !== undefined && entity.notePath) {
				warn({ path: entity.notePath, code: 'duplicate-name' });
			}
			claim(indexes.characterNameCi, entity.name.toLowerCase(), entity.id);
		}
	}
	return indexes;
}

function lookup(key: string, ix: Indexes): { id: string; ambiguous: boolean } | null {
	const lower = key.toLowerCase();
	const faction =
		ix.factionName.get(key) ??
		ix.folderName.get(key) ??
		ix.factionNameCi.get(lower) ??
		ix.folderNameCi.get(lower);
	const character = ix.characterName.get(key) ?? ix.characterNameCi.get(lower);
	if (faction !== undefined) {
		return { id: faction, ambiguous: character !== undefined };
	}
	return character !== undefined ? { id: character, ambiguous: false } : null;
}

export function resolveKeys(
	entities: Map<string, Entity>,
	warn: Warn,
): Map<string, ResolvedEntity> {
	const indexes = buildIndexes(entities, warn);

	const resolveMap = (
		entity: Entity,
		relations: Map<string, Relation>,
		field: RelationField,
	): Map<string, Relation> => {
		const result = new Map<string, Relation>();
		const path = entity.notePath ?? entity.id;
		for (const [key, relation] of relations) {
			const found = lookup(key, indexes);
			if (found === null) {
				warn({ path, code: 'unknown-target', key, field });
				if (result.has(`?${key}`)) {
					warn({ path, code: 'duplicate-key', key, field });
					continue;
				}
				result.set(`?${key}`, relation);
				continue;
			}
			if (found.id === entity.id) {
				warn({ path, code: 'self-relation', key, field });
				continue;
			}
			if (result.has(found.id)) {
				warn({ path, code: 'duplicate-key', key, field });
				continue;
			}
			if (found.ambiguous) {
				warn({ path, code: 'ambiguous-key', key, field });
			}
			result.set(found.id, relation);
		}
		return result;
	};

	const resolved = new Map<string, ResolvedEntity>();
	for (const entity of entities.values()) {
		resolved.set(entity.id, {
			...entity,
			relations: resolveMap(entity, entity.relations, 'relations'),
			secretRelations: resolveMap(entity, entity.secretRelations, 'secret_relations'),
		});
	}
	return resolved;
}
