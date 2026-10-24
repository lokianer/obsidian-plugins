// Reading relation values and power from hand-written frontmatter. Anything odd becomes a
// warning and is otherwise ignored or clamped; nothing here throws.

import type { Relation, RelationField, Warn } from './model';

const MIN = -5;
const MAX = 5;
const POWER_MIN = 1;
const POWER_MAX = 5;
const POWER_DEFAULT = 3;

/** A number from a YAML number or a numeric string; `−` (U+2212) counts as a minus. */
function toNumber(raw: unknown): number | null | 'empty' {
	if (typeof raw === 'number') {
		return Number.isFinite(raw) ? raw : null;
	}
	if (typeof raw === 'string') {
		const text = raw.trim().replace(/−/g, '-');
		if (text === '') {
			return 'empty';
		}
		const number = Number(text);
		return Number.isFinite(number) ? number : null;
	}
	return null;
}

function isMap(raw: unknown): raw is Record<string, unknown> {
	return raw !== null && typeof raw === 'object' && !Array.isArray(raw);
}

/**
 * One relation value: a number, a numeric string, or `{ value, why }`. Empty means no relation and
 * is silent; everything else that is not a usable number is reported.
 */
export function parseRelationValue(
	raw: unknown,
	ctx: { path: string; key: string; field: RelationField },
	warn: Warn,
): Relation | null {
	const report = (code: Parameters<Warn>[0]['code']) =>
		warn({ path: ctx.path, code, key: ctx.key, field: ctx.field });

	let why: string | undefined;
	let rawValue = raw;
	if (isMap(raw)) {
		if (!('value' in raw) || raw.value === null || raw.value === undefined) {
			report('structured-without-value');
			return null;
		}
		rawValue = raw.value;
		why = typeof raw.why === 'string' ? raw.why : undefined;
	}
	if (rawValue === null || rawValue === undefined) {
		return null;
	}

	const number = toNumber(rawValue);
	if (number === 'empty') {
		return null;
	}
	if (number === null) {
		report('value-not-a-number');
		return null;
	}

	let value = number;
	if (!Number.isInteger(value)) {
		report('value-not-integer');
		value = Math.round(value);
	}
	if (value < MIN || value > MAX) {
		report('value-out-of-range');
		value = Math.min(MAX, Math.max(MIN, value));
	}
	return why === undefined ? { value } : { value, why };
}

/** A whole `relations` or `secret_relations` map, keyed by the names as written (trimmed). */
export function parseRelationMap(
	raw: unknown,
	path: string,
	field: RelationField,
	warn: Warn,
): Map<string, Relation> {
	const result = new Map<string, Relation>();
	if (raw === null || raw === undefined) {
		return result;
	}
	if (!isMap(raw)) {
		warn({ path, code: 'relations-not-a-map', field });
		return result;
	}
	for (const [rawKey, rawValue] of Object.entries(raw)) {
		const key = rawKey.trim();
		const relation = parseRelationValue(rawValue, { path, key, field }, warn);
		if (relation !== null) {
			result.set(key, relation);
		}
	}
	return result;
}

/** A faction's `power`, 1–5, default 3. */
export function parsePower(raw: unknown, path: string, warn: Warn): number {
	if (raw === null || raw === undefined) {
		return POWER_DEFAULT;
	}
	const number = toNumber(raw);
	if (number === null || number === 'empty') {
		warn({ path, code: 'power-out-of-range' });
		return POWER_DEFAULT;
	}
	const rounded = Math.round(number);
	if (rounded !== number || rounded < POWER_MIN || rounded > POWER_MAX) {
		warn({ path, code: 'power-out-of-range' });
	}
	return Math.min(POWER_MAX, Math.max(POWER_MIN, rounded));
}
