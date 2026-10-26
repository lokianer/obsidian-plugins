// A Markdown table row split into its cells; `\|` inside a cell is a pipe, not a border. Written
// without a lookbehind, which Obsidian on iOS before 16.4 cannot parse. Pure.

const PIPE = '\u0000';

export function tableCells(line: string): string[] {
  return line
    .trim()
    .replace(/\\\|/g, PIPE)
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.split(PIPE).join('|').trim());
}
