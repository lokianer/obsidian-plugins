/** One Markdown note as the pure modules see it: its vault path and its parsed frontmatter. */
export interface NoteInput {
	/** Vault-relative path with forward slashes, e.g. `Silverstadt/Campaign.md`. */
	path: string;
	/** Parsed frontmatter, or undefined when the note has none or it does not parse. */
	frontmatter: Record<string, unknown> | undefined;
}
