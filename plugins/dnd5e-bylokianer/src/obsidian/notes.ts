// The adapter's read side: every Markdown note with its cached frontmatter, as the core expects.

import type { App } from 'obsidian';

import type { NoteInput } from '../types';

export function collectNotes(app: App): NoteInput[] {
	return app.vault.getMarkdownFiles().map((file) => ({
		path: file.path,
		frontmatter: app.metadataCache.getFileCache(file)?.frontmatter,
	}));
}
