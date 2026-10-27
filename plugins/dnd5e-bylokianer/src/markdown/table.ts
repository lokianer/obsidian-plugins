// A Markdown table row split into its cells; `\|` and `\\` inside a cell are literal characters.

export function tableCells(line: string): string[] {
  const text = line.trim();
  const start = text.startsWith('|') ? 1 : 0;
  let end = text.length;
  if (text.endsWith('|')) {
    let slashes = 0;
    for (let i = end - 2; i >= start && text[i] === '\\'; i--) slashes++;
    if (slashes % 2 === 0) end--;
  }

  const cells: string[] = [];
  let cell = '';
  for (let i = start; i < end; i++) {
    const char = text[i] ?? '';
    const next = text[i + 1];
    if (char === '\\' && (next === '\\' || next === '|')) {
      cell += next;
      i++;
    } else if (char === '|') {
      cells.push(cell.trim());
      cell = '';
    } else {
      cell += char;
    }
  }
  cells.push(cell.trim());
  return cells;
}
