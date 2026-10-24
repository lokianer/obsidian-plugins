import { describe, expect, it } from 'vitest';

import { createT, de, en, type StringKey } from '../src/i18n/strings';
import type { WarningCode } from '../src/factions/model';

const CODES: WarningCode[] = [
	'value-out-of-range',
	'value-not-a-number',
	'value-not-integer',
	'structured-without-value',
	'relations-not-a-map',
	'power-out-of-range',
	'unknown-target',
	'self-relation',
	'ambiguous-key',
	'duplicate-name',
	'missing-type',
	'duplicate-faction-note',
	'duplicate-key',
	'campaign-ignored',
	'power-not-a-number',
	'power-not-integer',
	'broken-frontmatter',
];

describe('strings', () => {
	it('has a non-empty string for every key in both languages', () => {
		for (const key of Object.keys(en) as StringKey[]) {
			expect(en[key].trim()).not.toBe('');
			expect(de[key].trim()).not.toBe('');
		}
		expect(Object.keys(de).sort()).toEqual(Object.keys(en).sort());
	});

	it('has a message for every warning code', () => {
		for (const code of CODES) {
			expect(Object.keys(en)).toContain(`warning.${code}`);
		}
	});

	it('falls back to English for an unknown language', () => {
		expect(createT('fr')('command.showWarnings')).toBe('Show faction warnings');
		expect(createT('de')('command.showWarnings')).toBe('Fraktions-Warnungen anzeigen');
	});

	it('fills placeholders', () => {
		expect(createT('en')('warning.value-not-a-number', { written: 'hates' })).toBe(
			'“hates” is not a number',
		);
	});
});
