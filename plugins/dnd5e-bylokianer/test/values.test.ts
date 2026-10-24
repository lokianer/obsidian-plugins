import { describe, expect, it } from 'vitest';

import type { Relation, Warning } from '../src/factions/model';
import { parsePower, parseRelationMap, parseRelationValue } from '../src/factions/values';

const ctx = { path: 'F/factions.md', key: 'K', field: 'relations' as const };

function value(raw: unknown): { result: Relation | null; warnings: Warning[] } {
	const warnings: Warning[] = [];
	const result = parseRelationValue(raw, ctx, (w) => warnings.push(w));
	return { result, warnings };
}

const codes = (warnings: Warning[]) => warnings.map((w) => w.code);

describe('parseRelationValue', () => {
	it('reads plain numbers, numeric strings and the typographic minus', () => {
		expect(value(3)).toEqual({ result: { value: 3 }, warnings: [] });
		expect(value('-1')).toEqual({ result: { value: -1 }, warnings: [] });
		expect(value('−3')).toEqual({ result: { value: -3 }, warnings: [] });
		expect(value(' 2 ')).toEqual({ result: { value: 2 }, warnings: [] });
	});

	it('reads the structured form and keeps only a string why', () => {
		expect(value({ value: -3, why: '[[X]]' })).toEqual({
			result: { value: -3, why: '[[X]]' },
			warnings: [],
		});
		expect(value({ value: 2, why: 7 })).toEqual({ result: { value: 2 }, warnings: [] });
		expect(value({ value: '−2' }).result).toEqual({ value: -2 });
	});

	it('clamps out-of-range values and rounds fractions, with a warning each', () => {
		expect(value(7).result).toEqual({ value: 5 });
		expect(codes(value(7).warnings)).toEqual(['value-out-of-range']);
		expect(value(-9).result).toEqual({ value: -5 });
		expect(codes(value(-9).warnings)).toEqual(['value-out-of-range']);
		expect(value(2.6).result).toEqual({ value: 3 });
		expect(codes(value(2.6).warnings)).toEqual(['value-not-integer']);
	});

	it('rejects what is not a number and says why', () => {
		expect(value('hates')).toEqual({
			result: null,
			warnings: [{ path: 'F/factions.md', code: 'value-not-a-number', key: 'K', field: 'relations' }],
		});
		expect(value(true).result).toBeNull();
		expect(codes(value({ why: '[[Elder Wren]]' }).warnings)).toEqual(['structured-without-value']);
		expect(value({ why: '[[Elder Wren]]' }).result).toBeNull();
	});

	it('treats an empty value as no relation, silently', () => {
		expect(value(null)).toEqual({ result: null, warnings: [] });
		expect(value(undefined)).toEqual({ result: null, warnings: [] });
		expect(value('')).toEqual({ result: null, warnings: [] });
		expect(value('  ')).toEqual({ result: null, warnings: [] });
	});
});

describe('parseRelationMap', () => {
	function map(raw: unknown) {
		const warnings: Warning[] = [];
		const result = parseRelationMap(raw, 'F/factions.md', 'secret_relations', (w) =>
			warnings.push(w),
		);
		return { result, warnings };
	}

	it('reads a map with trimmed keys and drops empty entries', () => {
		const { result, warnings } = map({ ' The Archivists ': 1, Sable: null, Court: '-2' });
		expect([...result]).toEqual([
			['The Archivists', { value: 1 }],
			['Court', { value: -2 }],
		]);
		expect(warnings).toEqual([]);
	});

	it('passes the field and key on to the warnings', () => {
		expect(map({ Order: 'hates' }).warnings).toEqual([
			{ path: 'F/factions.md', code: 'value-not-a-number', key: 'Order', field: 'secret_relations' },
		]);
	});

	it('rejects what is not a map', () => {
		expect(map('x')).toEqual({
			result: new Map(),
			warnings: [{ path: 'F/factions.md', code: 'relations-not-a-map', field: 'secret_relations' }],
		});
		expect(codes(map([1]).warnings)).toEqual(['relations-not-a-map']);
		expect(map(undefined)).toEqual({ result: new Map(), warnings: [] });
		expect(map(null)).toEqual({ result: new Map(), warnings: [] });
	});
});

describe('parsePower', () => {
	function power(raw: unknown) {
		const warnings: Warning[] = [];
		const result = parsePower(raw, 'F/factions.md', (w) => warnings.push(w));
		return { result, codes: codes(warnings) };
	}

	it('defaults to 3 and clamps to 1–5', () => {
		expect(power(undefined)).toEqual({ result: 3, codes: [] });
		expect(power(4)).toEqual({ result: 4, codes: [] });
		expect(power(9)).toEqual({ result: 5, codes: ['power-out-of-range'] });
		expect(power(0)).toEqual({ result: 1, codes: ['power-out-of-range'] });
		expect(power('x')).toEqual({ result: 3, codes: ['power-out-of-range'] });
	});
});
