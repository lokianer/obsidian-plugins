// The adapter's read side: every Markdown note with its cached frontmatter, as the core expects.

import type { App, CachedMetadata } from 'obsidian';

import { hasFrontmatterContent } from '../frontmatter';
import type { NoteInput } from '../types';

/** The cache knows of a block (its position, or a leading yaml section) but holds no values. */
function mayBeBroken(cache: CachedMetadata | null): boolean {
	return (
		cache !== null &&
		cache.frontmatter === undefined &&
		(cache.frontmatterPosition !== undefined || cache.sections?.[0]?.type === 'yaml')
	);
}

export async function collectNotes(app: App): Promise<NoteInput[]> {
	return Promise.all(
		app.vault.getMarkdownFiles().map(async (file): Promise<NoteInput> => {
			const cache = app.metadataCache.getFileCache(file);
			const note: NoteInput = { path: file.path, frontmatter: cache?.frontmatter };
			// Only these few notes are read: an empty block parses to nothing too and is fine.
			if (mayBeBroken(cache) && hasFrontmatterContent(await app.vault.cachedRead(file))) {
				note.frontmatterBroken = true;
			}
			return note;
		}),
	);
}
