// One history line per change, written under "## Log" of tonight's session note:
//   - 20:31 Order of the Lantern → The Gutter Court: −2 → −3
// A secret change goes into a "> [!gm]" callout. The line is inserted; nothing else is touched.

import { fromLines, inGmCallout, logSection, toLines } from './text';

export interface LogChange {
  /** `HH:MM`, local time. */
  time: string;
  from: string;
  to: string;
  /** Null for "no value" (an added or removed entry), written as an em dash. */
  before: number | null;
  after: number | null;
}

/** A value as the log writes it: `+3`, `0`, `−3` (typographic minus) or `—` for none. */
export function formatValue(value: number | null): string {
  if (value === null) return '—';
  return value > 0 ? `+${value}` : value < 0 ? `−${-value}` : '0';
}

export function formatLogLine(change: LogChange): string {
  const { time, from, to, before, after } = change;
  return `- ${time} ${from} → ${to}: ${formatValue(before)} → ${formatValue(after)}`;
}

/** `HH:MM` of a date, local time. */
export function clockTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * The note with `line` added to its "## Log" section: after the section's last content, before the
 * next heading; a secret line joins a `[!gm]` callout ending the section, or opens one. Without a
 * "## Log" heading, the heading and the line are appended at the end of the note.
 */
export function appendToLog(
  text: string,
  line: string,
  options: { secret?: boolean } = {},
): string {
  const note = toLines(text);
  const { lines } = note;
  const secret = options.secret === true;
  const section = logSection(lines);

  if (section === null) {
    // Keep a final newline final: insert before the empty last element it leaves.
    const at = lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;
    const block = secret ? ['> [!gm]', `> ${line}`] : [line];
    const lead = at > 0 && lines[at - 1]?.trim() !== '' ? [''] : [];
    lines.splice(at, 0, ...lead, '## Log', '', ...block);
    return fromLines(note);
  }

  let last = section.end - 1;
  while (last > section.heading && (lines[last]?.trim() ?? '') === '') last--;
  const after = last + 1;
  const previous = lines[last] ?? '';
  const previousIsQuote = previous.trimStart().startsWith('>');

  const empty = last === section.heading;
  const joinsCallout = !empty && previousIsQuote && inGmCallout(lines, last);
  // A list item right under a quote would read as part of it in some renderers: leave a gap.
  const block = secret
    ? joinsCallout
      ? [`> ${line}`]
      : ['', '> [!gm]', `> ${line}`]
    : empty || previousIsQuote
      ? ['', line]
      : [line];
  lines.splice(after, 0, ...block);
  return fromLines(note);
}

const LOG_LINE = /^- \d{1,2}:\d{2} (.*)$/;

/**
 * Tonight's `## Log` without the plain lines `- HH:MM …` whose text `drop` picks (lines inside a
 * `> [!gm]` callout and anything else stay); a blank line left doubled is dropped too. Returns the
 * text and how many lines went.
 */
export function removeFromLog(
  text: string,
  drop: (line: string) => boolean,
): { text: string; removed: number } {
  const note = toLines(text);
  const section = logSection(note.lines);
  if (section === null) return { text, removed: 0 };
  const body = note.lines.slice(section.heading + 1, section.end);
  const kept = body.filter((line) => {
    const m = LOG_LINE.exec(line);
    return m === null || !drop(m[1] ?? '');
  });
  const removed = body.length - kept.length;
  if (removed === 0) return { text, removed: 0 };
  const tidy = kept.filter((line, i) => line.trim() !== '' || (kept[i - 1] ?? 'x').trim() !== '');
  note.lines.splice(section.heading + 1, body.length, ...tidy);
  return { text: fromLines(note), removed };
}
