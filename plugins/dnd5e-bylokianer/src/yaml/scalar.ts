// Writing keys and scalar values so that YAML reads them back exactly: plain where that is safe,
// double-quoted (JSON escapes are valid YAML escapes) everywhere else.

const RESERVED = new Set(['true', 'false', 'null', 'yes', 'no', 'on', 'off', '~']);

/** Letters, digits, spaces and `.'-_`, starting with a letter and not ending in a space. */
export function isPlainSafe(text: string): boolean {
  return (
    /^\p{L}[\p{L}\p{N} .'_-]*$/u.test(text) &&
    !text.endsWith(' ') &&
    !text.includes('  ') &&
    !RESERVED.has(text.toLowerCase())
  );
}

export function formatString(text: string): string {
  return isPlainSafe(text) ? text : JSON.stringify(text);
}

/** A string in the quote style an existing token used; plain only when plain is safe. */
export function formatStringLike(text: string, quote: '"' | "'" | null): string {
  if (quote === "'") {
    return `'${text.replace(/'/g, "''")}'`;
  }
  return quote === '"' ? JSON.stringify(text) : formatString(text);
}

/** An integer with an ASCII minus; quoted when the token it replaces was quoted. */
export function formatNumber(value: number, quote: '"' | "'" | null = null): string {
  const text = String(Math.trunc(value) || 0);
  return quote === null ? text : `${quote}${text}${quote}`;
}

export const formatKey = formatString;
