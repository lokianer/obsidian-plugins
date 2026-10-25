// Splitting a note into lines and back, keeping its line endings and a BOM.

const BOM = '\uFEFF';

export interface NoteLines {
  lines: string[];
  eol: '\n' | '\r\n';
  bom: boolean;
}

export function toLines(text: string): NoteLines {
  const bom = text.startsWith(BOM);
  const body = bom ? text.slice(1) : text;
  return { lines: body.split(/\r?\n/), eol: body.includes('\r\n') ? '\r\n' : '\n', bom };
}

export function fromLines({ lines, eol, bom }: NoteLines): string {
  return (bom ? BOM : '') + lines.join(eol);
}

/** The index of the first line after the frontmatter block (0 when there is none). */
export function bodyStart(lines: readonly string[]): number {
  if (lines[0]?.trimEnd() !== '---') return 0;
  const close = lines.findIndex((line, i) => i > 0 && line.trimEnd() === '---');
  return close === -1 ? 0 : close + 1;
}

const HEADING = /^#{1,6}\s/;
const LOG_HEADING = /^##\s+log\s*$/i;

/** A section by its heading: the heading line and the line after its end (next heading or end). */
export function section(
  lines: readonly string[],
  heading: RegExp,
): { heading: number; end: number } | null {
  for (let i = bodyStart(lines); i < lines.length; i++) {
    if (heading.test(lines[i]?.trim() ?? '')) {
      let end = i + 1;
      while (end < lines.length && !HEADING.test(lines[end] ?? '')) end++;
      return { heading: i, end };
    }
  }
  return null;
}

/** The `## Log` section. */
export function logSection(lines: readonly string[]): { heading: number; end: number } | null {
  return section(lines, LOG_HEADING);
}

/** Whether line `i` lies in a `> [!gm]` callout (it and the lines above it start with `>`). */
export function inGmCallout(lines: readonly string[], i: number): boolean {
  for (let j = i; j >= 0; j--) {
    const line = lines[j]?.trimStart() ?? '';
    if (!line.startsWith('>')) return false;
    if (/^>\s*\[!gm\]/i.test(line)) return true;
  }
  return false;
}
