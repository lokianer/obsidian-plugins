import { describe, expect, it } from 'vitest';

import type { FactionWorld, ResolvedEntity } from '../src/factions/model';
import { allStances, stance } from '../src/factions/stance';

type Values = Record<string, number>;

function entity(
	id: string,
	parent: string | null,
	relations: Values = {},
	secret: Values = {},
	kind: 'faction' | 'character' = 'faction',
): ResolvedEntity {
	const toMap = (values: Values) =>
		new Map(Object.entries(values).map(([k, v]) => [k, { value: v }]));
	return {
		id,
		kind,
		pseudo: false,
		name: id,
		notePath: `${id}.md`,
		parent,
		power: 3,
		relations: toMap(relations),
		secretRelations: toMap(secret),
	};
}

function world(...entities: ResolvedEntity[]): FactionWorld {
	return {
		campaign: { path: 'C.md', folder: '', system: null },
		entities: new Map(entities.map((e) => [e.id, e])),
		warnings: [],
	};
}

describe('stance', () => {
	const w = world(
		entity('Court', null, { Order: -4, Sable: -1 }, { Archive: 3 }),
		entity('Bench', 'Court', { Archive: -1 }, { Order: 4 }),
		entity('Vermillion', 'Bench', {}, {}, 'character'),
		entity('Corvin', 'Court', { Order: -3 }, {}, 'character'),
		entity('Sable', 'Court', {}, {}, 'character'),
		entity('Order', null),
		entity('Archive', null),
	);

	it('uses its own value before its faction', () => {
		expect(stance(w, 'Corvin', 'Order', 'public')).toEqual({
			value: -3,
			source: 'Corvin',
			field: 'relations',
			inherited: false,
		});
	});

	it('inherits from its faction and from a grandparent faction', () => {
		expect(stance(w, 'Bench', 'Order', 'public')).toMatchObject({
			value: -4,
			source: 'Court',
			inherited: true,
		});
		expect(stance(w, 'Vermillion', 'Order', 'public')).toMatchObject({
			value: -4,
			source: 'Court',
		});
	});

	it('prefers the secret value at the same level in true mode', () => {
		expect(stance(w, 'Bench', 'Order', 'true')).toEqual({
			value: 4,
			source: 'Bench',
			field: 'secret_relations',
			inherited: false,
		});
		expect(stance(w, 'Vermillion', 'Order', 'true')).toMatchObject({ value: 4, source: 'Bench' });
	});

	it('lets an own public value beat a parent secret in true mode', () => {
		const v = world(
			entity('Archivists', null, {}, { Order: -2 }),
			entity('Corvin', 'Archivists', { Order: -3 }, {}, 'character'),
			entity('Order', null),
		);
		expect(stance(v, 'Corvin', 'Order', 'true')).toMatchObject({
			value: -3,
			source: 'Corvin',
			field: 'relations',
		});
	});

	it('passes a faction’s relation to a character on to its members', () => {
		expect(stance(w, 'Corvin', 'Sable', 'public')).toMatchObject({ value: -1, source: 'Court' });
	});

	it('has no stance where nothing is written, and none towards oneself', () => {
		expect(stance(w, 'Order', 'Court', 'public')).toBeNull();
		expect(stance(w, 'Sable', 'Sable', 'public')).toBeNull();
		expect(stance(w, 'Nobody', 'Court', 'public')).toBeNull();
	});
});

describe('allStances', () => {
	it('collects every target along the chain, without the entity itself', () => {
		const w = world(
			entity('Court', null, { Order: -4, Sable: -1 }),
			entity('Sable', 'Court', { Mira: -2 }, {}, 'character'),
			entity('Order', null),
			entity('Mira', 'Court', {}, {}, 'character'),
		);
		const stances = allStances(w, 'Sable', 'public');
		expect([...stances.keys()].sort()).toEqual(['Mira', 'Order']);
		expect(stances.get('Mira')).toMatchObject({ value: -2, inherited: false });
		expect(stances.get('Order')).toMatchObject({ value: -4, inherited: true });
	});
});
