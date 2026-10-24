// Spotting a frontmatter block in a note's text, for the one case the metadata cache cannot tell
// apart: a block that holds YAML which does not parse, and a block that is merely empty.

import { frontmatterRange, splitLines } from './yaml/lines';

/** The text between the opening and closing `---` lines, or null when the note has no block. */
export function frontmatterBody(text: string): string | null {
  const { lines } = splitLines(text);
  const range = frontmatterRange(lines);
  return range === null ? null : lines.slice(range.open + 1, range.close).join('\n');
}

/** Whether the note's frontmatter block holds anything besides blank and comment lines. */
export function hasFrontmatterContent(text: string): boolean {
  const body = frontmatterBody(text);
  return (
    body !== null &&
    body.split('\n').some((line) => line.trim() !== '' && !line.trim().startsWith('#'))
  );
}
