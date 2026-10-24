// Reads examples/vault from disk the way the Obsidian adapter would hand it to the pure modules.

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

import { frontmatterBody, hasFrontmatterContent } from '../src/frontmatter';
import type { FactionWorld } from '../src/factions/model';
import type { NoteInput } from '../src/types';

const vaultRoot = fileURLToPath(new URL('../../../examples/vault', import.meta.url));

function markdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.obsidian' || entry.name === '.trash') {
      return [];
    }
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      return markdownFiles(full);
    }
    return entry.name.endsWith('.md') ? [full] : [];
  });
}

/** The frontmatter between the first two `---` lines, parsed; undefined when absent or broken. */
export function frontmatterOf(text: string): Record<string, unknown> | undefined {
  const body = frontmatterBody(text);
  if (body === null) {
    return undefined;
  }
  try {
    const data: unknown = parse(body);
    return data !== null && typeof data === 'object' && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
}

/** A note as the adapter hands it over: broken only when its block holds YAML that fails. */
export function noteFromText(path: string, text: string): NoteInput {
  const frontmatter = frontmatterOf(text);
  return frontmatter === undefined && hasFrontmatterContent(text)
    ? { path, frontmatter, frontmatterBroken: true }
    : { path, frontmatter };
}

let cache: NoteInput[] | undefined;

/** Every note of the example vault, with vault-relative POSIX paths. */
export function loadExampleVault(): NoteInput[] {
  cache ??= markdownFiles(vaultRoot)
    .map((file) =>
      noteFromText(relative(vaultRoot, file).split(sep).join('/'), readFileSync(file, 'utf8')),
    )
    .sort((a, b) => (a.path < b.path ? -1 : 1));
  return cache;
}

/** The text of one note of the example vault, by its vault path. */
export function readExampleNote(path: string): string {
  return readFileSync(join(vaultRoot, ...path.split('/')), 'utf8');
}

/** The same world with every secret relation gone: Public views must not tell them apart. */
export function withoutSecrets(world: FactionWorld): FactionWorld {
  return {
    ...world,
    entities: new Map(
      [...world.entities].map(([id, e]) => [id, { ...e, secretRelations: new Map() }]),
    ),
  };
}
