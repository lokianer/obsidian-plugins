// Spotting a frontmatter block in a note's text, for the one case the metadata cache cannot tell
// apart: a block that holds YAML which does not parse, and a block that is merely empty.

const BLOCK = /^---\r?\n([\s\S]*?)\r?\n?---(?:\r?\n|$)/;

/** The text between the opening and closing `---` lines, or null when the note has no block. */
export function frontmatterBody(text: string): string | null {
  const match = BLOCK.exec(text.replace(/^\uFEFF/, ''));
  return match === null ? null : (match[1] ?? '');
}

/** Whether the note's frontmatter block holds anything besides blank and comment lines. */
export function hasFrontmatterContent(text: string): boolean {
  const body = frontmatterBody(text);
  return (
    body !== null &&
    body.split(/\r?\n/).some((line) => line.trim() !== '' && !line.trim().startsWith('#'))
  );
}
