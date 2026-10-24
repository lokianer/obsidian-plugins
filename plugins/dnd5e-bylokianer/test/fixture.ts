// Reads examples/vault from disk the way the Obsidian adapter would hand it to the pure modules.

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

import type { NoteInput } from '../src/types';

const vaultRoot = fileURLToPath(new URL('../../../examples/vault', import.meta.url));

function markdownFiles(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		if (entry.name === '.obsidian' || entry.name === '.trash') {
			return [];
		}
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			return markdownFiles(full);
		}
		return entry.name.endsWith('.md') ? [full] : [];
	});
}

/** The frontmatter between the first two `---` lines, parsed; undefined when absent or broken. */
export function frontmatterOf(text: string): Record<string, unknown> | undefined {
	const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
	if (match === null) {
		return undefined;
	}
	try {
		const data: unknown = parse(match[1] ?? '');
		return data !== null && typeof data === 'object' && !Array.isArray(data)
			? (data as Record<string, unknown>)
			: undefined;
	} catch {
		return undefined;
	}
}

let cache: NoteInput[] | undefined;

/** Every note of the example vault, with vault-relative POSIX paths. */
export function loadExampleVault(): NoteInput[] {
	cache ??= markdownFiles(vaultRoot)
		.map((file) => ({
			path: relative(vaultRoot, file).split(sep).join('/'),
			frontmatter: frontmatterOf(readFileSync(file, 'utf8')),
		}))
		.sort((a, b) => (a.path < b.path ? -1 : 1));
	return cache;
}
