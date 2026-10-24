// Stances with inheritance: walk from the entity up its faction chain; the most specific level
// that says anything wins. In true mode each level's secret value comes before its public one.

import type { FactionWorld, Mode, RelationField, ResolvedEntity, Stance } from './model';

function* chain(world: FactionWorld, from: string): Generator<ResolvedEntity> {
	const seen = new Set<string>();
	let entity = world.entities.get(from);
	while (entity !== undefined && !seen.has(entity.id)) {
		seen.add(entity.id);
		yield entity;
		entity = entity.parent === null ? undefined : world.entities.get(entity.parent);
	}
}

function fieldsFor(mode: Mode): RelationField[] {
	return mode === 'true' ? ['secret_relations', 'relations'] : ['relations'];
}

function relationsOf(entity: ResolvedEntity, field: RelationField) {
	return field === 'relations' ? entity.relations : entity.secretRelations;
}

function toStance(
	from: string,
	entity: ResolvedEntity,
	field: RelationField,
	to: string,
): Stance | null {
	const relation = relationsOf(entity, field).get(to);
	if (relation === undefined) {
		return null;
	}
	return {
		value: relation.value,
		...(relation.why !== undefined && { why: relation.why }),
		source: entity.id,
		field,
		inherited: entity.id !== from,
	};
}

export function stance(world: FactionWorld, from: string, to: string, mode: Mode): Stance | null {
	if (from === to) {
		return null;
	}
	for (const entity of chain(world, from)) {
		for (const field of fieldsFor(mode)) {
			const found = toStance(from, entity, field, to);
			if (found !== null) {
				return found;
			}
		}
	}
	return null;
}

export function allStances(world: FactionWorld, from: string, mode: Mode): Map<string, Stance> {
	const result = new Map<string, Stance>();
	for (const entity of chain(world, from)) {
		for (const field of fieldsFor(mode)) {
			for (const to of relationsOf(entity, field).keys()) {
				if (to === from || result.has(to)) {
					continue;
				}
				const found = toStance(from, entity, field, to);
				if (found !== null) {
					result.set(to, found);
				}
			}
		}
	}
	return result;
}
