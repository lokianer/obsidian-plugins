// Reading the log lines of a session note back: every "HH:MM A → B: x → y" line under "## Log",
// including those inside a [!gm] callout (marked secret). Other log lines are left alone.

import { inGmCallout, logSection, toLines } from './text';

export interface LogEntry {
  time: string;
  from: string;
  to: string;
  before: number | null;
  after: number | null;
  secret: boolean;
}

const LINE = /^(?:>\s*)?[-*]\s+(\d{1,2}:\d{2})\s+(.+?)\s+→\s+(.+?):\s+(\S+)\s+→\s+(\S+)\s*$/;

/** `+3`, `-3`, `−3`, `0` or `—` / `-` alone for none; null when it is not a value at all. */
function parseValue(text: string): number | null | undefined {
  if (text === '—' || text === '–') return null;
  const normal = text.replace(/^[−–]/, '-');
  return /^[+-]?\d+$/.test(normal) ? Number(normal) : undefined;
}

export function parseLog(text: string): LogEntry[] {
  const { lines } = toLines(text);
  const section = logSection(lines);
  if (section === null) return [];
  const entries: LogEntry[] = [];
  for (let i = section.heading + 1; i < section.end; i++) {
    const match = LINE.exec((lines[i] ?? '').trim());
    if (match === null) continue;
    const [, time = '', from = '', to = '', rawBefore = '', rawAfter = ''] = match;
    const before = parseValue(rawBefore);
    const after = parseValue(rawAfter);
    if (before === undefined || after === undefined) continue;
    entries.push({ time, from, to, before, after, secret: inGmCallout(lines, i) });
  }
  return entries;
}
