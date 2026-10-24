// Tonight's session: the session note with the highest `session:` number. When its date lies
// before today, a new session note is due; its text comes from the session template.

export interface NoteMeta {
  path: string;
  frontmatter: Record<string, unknown> | undefined;
}

export interface SessionNote {
  path: string;
  session: number;
  /** `YYYY-MM-DD`, or null when the note has no readable date. */
  date: string | null;
}

function sessionNumber(raw: unknown): number | null {
  const n = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw.trim()) : NaN;
  return Number.isInteger(n) && n > 0 ? n : null;
}

function isoDate(raw: unknown): string | null {
  const text = raw instanceof Date ? raw.toISOString() : typeof raw === 'string' ? raw.trim() : '';
  return /^\d{4}-\d{2}-\d{2}/.test(text) ? text.slice(0, 10) : null;
}

/** Every note with `type: session` and a whole `session:` number, in session order. */
export function sessionsOf(notes: readonly NoteMeta[]): SessionNote[] {
  const sessions: SessionNote[] = [];
  for (const note of notes) {
    const type = note.frontmatter?.type;
    if (typeof type !== 'string' || type.trim().toLowerCase() !== 'session') continue;
    const session = sessionNumber(note.frontmatter?.session);
    if (session === null) continue;
    sessions.push({ path: note.path, session, date: isoDate(note.frontmatter?.date) });
  }
  return sessions.sort((a, b) => a.session - b.session || (a.path < b.path ? -1 : 1));
}

export function findTonight(sessions: readonly SessionNote[]): SessionNote | null {
  return sessions[sessions.length - 1] ?? null;
}

/** Whether tonight's note is from an earlier day (a note without a date never asks). */
export function needsNext(tonight: SessionNote, today: string): boolean {
  return tonight.date !== null && tonight.date < today;
}

/** `YYYY-MM-DD` of a date, local time. */
export function localDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Where session N+1 goes: `Session N.md` in the folder of tonight's note. */
export function nextSessionPath(tonight: SessionNote, n: number): string {
  const slash = tonight.path.lastIndexOf('/');
  const folder = slash === -1 ? '' : tonight.path.slice(0, slash + 1);
  return `${folder}Session ${n}.md`;
}

/**
 * Session N+1's text: the template with `{{date}}` and `{{session}}` filled in and an empty
 * `session:` line set; without a template, a minimal note with a "## Log" heading.
 */
export function nextSessionText(template: string | null, n: number, today: string): string {
  if (template === null) {
    return [
      '---',
      'type: session',
      `session: ${n}`,
      `date: ${today}`,
      '---',
      '',
      `# Session ${n}`,
      '',
      '## Log',
      '',
    ].join('\n');
  }
  return template
    .replace(/\{\{\s*date\s*\}\}/g, today)
    .replace(/\{\{\s*session\s*\}\}/g, String(n))
    .replace(/^session:[ \t]*$/m, `session: ${n}`);
}
