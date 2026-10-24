// Reading relation values and power from hand-written frontmatter. Anything odd becomes a
// warning and is otherwise ignored or clamped; nothing here throws.

import type { Relation, RelationField, Warn } from './model';

const MIN = -5;
const MAX = 5;
const POWER_MIN = 1;
const POWER_MAX = 5;
const POWER_DEFAULT = 3;

/** Plain decimal notation only: no hex, no exponent, no `Infinity`. */
const DECIMAL = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

/**
 * A number from a YAML number or a numeric string. A leading `−` (U+2212) or `–` (en dash,
 * which editors put in for a typed hyphen) counts as a minus.
 */
function toNumber(raw: unknown): number | null | 'empty' {
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : null;
  }
  if (typeof raw === 'string') {
    const text = raw.trim().replace(/^[−–]/, '-');
    if (text === '') {
      return 'empty';
    }
    return DECIMAL.test(text) ? Number(text) : null;
  }
  return null;
}

/** Rounds half away from zero, so −2.5 and 2.5 move the same distance; never yields −0. */
function round(value: number): number {
  return Math.sign(value) * Math.round(Math.abs(value)) || 0;
}

/** A value as the note writes it, for the warning that quotes it. */
export function asWritten(raw: unknown): string {
  if (typeof raw === 'string') {
    return raw.trim();
  }
  return typeof raw === 'number' || typeof raw === 'boolean' ? String(raw) : JSON.stringify(raw);
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
  const report = (
    code: Parameters<Warn>[0]['code'],
    extra: { written?: string; read?: number } = {},
  ) => warn({ path: ctx.path, code, key: ctx.key, field: ctx.field, ...extra });

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
    report('value-not-a-number', { written: asWritten(rawValue) });
    return null;
  }

  let value = number;
  if (!Number.isInteger(value)) {
    value = round(value);
    report('value-not-integer', { written: asWritten(rawValue), read: value });
  }
  if (value < MIN || value > MAX) {
    value = Math.min(MAX, Math.max(MIN, value));
    report('value-out-of-range', { written: asWritten(rawValue), read: value });
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
    if (result.has(key)) {
      warn({ path, code: 'duplicate-key', key, field });
      continue;
    }
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
  const power = { path, key: 'power', written: asWritten(raw) };
  const number = toNumber(raw);
  if (number === null || number === 'empty') {
    warn({ ...power, code: 'power-not-a-number', read: POWER_DEFAULT });
    return POWER_DEFAULT;
  }
  const rounded = round(number);
  const result = Math.min(POWER_MAX, Math.max(POWER_MIN, rounded));
  if (rounded !== result) {
    warn({ ...power, code: 'power-out-of-range', read: result });
  } else if (rounded !== number) {
    warn({ ...power, code: 'power-not-integer', read: result });
  }
  return result;
}
