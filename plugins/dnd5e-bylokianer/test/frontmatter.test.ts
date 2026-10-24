import { describe, expect, it } from 'vitest';

import { frontmatterBody, hasFrontmatterContent } from '../src/frontmatter';
import { noteFromText } from './fixture';

describe('frontmatterBody', () => {
	it('finds the block between the first two --- lines', () => {
		expect(frontmatterBody('---\ntype: npc\n---\n# Ilka')).toBe('type: npc');
		expect(frontmatterBody('---\r\ntype: npc\r\n---')).toBe('type: npc');
		expect(frontmatterBody('\uFEFF---\ntype: npc\n---\n')).toBe('type: npc');
		expect(frontmatterBody('---\n---\n')).toBe('');
	});

	it('finds nothing in a note without a block', () => {
		expect(frontmatterBody('# Ilka\n---\ntype: npc\n---')).toBeNull();
		expect(frontmatterBody('---\ntype: npc')).toBeNull();
	});
});

describe('hasFrontmatterContent', () => {
	it('ignores blank and comment lines', () => {
		expect(hasFrontmatterContent('---\n\n  # only a comment\n---\n')).toBe(false);
		expect(hasFrontmatterContent('# no block')).toBe(false);
		expect(hasFrontmatterContent('---\ntitle: "open\n---\n')).toBe(true);
	});
});

describe('noteFromText', () => {
	it('marks a note broken only when its block holds YAML that does not parse', () => {
		expect(noteFromText('A.md', '---\ntitle: "open\n---\n').frontmatterBroken).toBe(true);
		expect(noteFromText('A.md', '---\n# empty\n---\n').frontmatterBroken).toBeUndefined();
		expect(noteFromText('A.md', '---\ntype: npc\n---\n')).toEqual({
			path: 'A.md',
			frontmatter: { type: 'npc' },
		});
	});
});
