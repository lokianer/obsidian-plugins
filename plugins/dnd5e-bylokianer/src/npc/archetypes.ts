// Archetypes: the stat blocks a new NPC starts from — the SRD's 21 NPCs and the GM's own, kept as
// notes with `type: archetype` and a stat block. Pure: the Obsidian side reads the notes.

import { formatString } from '../yaml/scalar';
import { findStatblocks, parseStatblock } from './statblock';

export interface Archetype {
  name: string;
  /** Challenge rating as the block writes it; empty when the block has none. */
  cr: string;
  /** The stat block's YAML, without fences. */
  yaml: string;
  /** `srd`, or the path of the GM's archetype note. */
  source: string;
}

/** An archetype note that could not be used, with why. */
export interface ArchetypeProblem {
  path: string;
  problem: 'no-statblock' | 'invalid-yaml';
}

/**
 * The GM's archetype from a note's text: its first stat block, named after the note when the block
 * names nobody. `parse` turns YAML into data (Obsidian's parseYaml, or the `yaml` package in tests).
 */
export function ownArchetype(
  path: string,
  text: string,
  parse: (yaml: string) => unknown,
): Archetype | ArchetypeProblem {
  const block = findStatblocks(text)[0];
  if (block === undefined) return { path, problem: 'no-statblock' };
  let data: unknown;
  try {
    data = parse(block.source);
  } catch {
    return { path, problem: 'invalid-yaml' };
  }
  const parsed = parseStatblock(data);
  const name = path.slice(path.lastIndexOf('/') + 1).replace(/\.md$/i, '');
  return { name, cr: parsed.cr ?? '', yaml: block.source, source: path };
}

/** Archetypes whose name contains every word of the query, the GM's own first. */
export function searchArchetypes(list: readonly Archetype[], query: string): Archetype[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return list
    .filter((a) => words.every((w) => a.name.toLowerCase().includes(w)))
    .sort(
      (a, b) =>
        Number(a.source === 'srd') - Number(b.source === 'srd') || a.name.localeCompare(b.name),
    );
}

/** The block's YAML with its `name:` set to the NPC's name (added on top when missing). */
export function withName(yaml: string, name: string): string {
  const line = `name: ${formatString(name)}`;
  const lines = yaml.split(/\r?\n/);
  const at = lines.findIndex((l) => /^name\s*:/.test(l));
  if (at === -1) lines.unshift(line);
  else lines[at] = line;
  return lines.join('\n');
}
