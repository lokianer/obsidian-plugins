// Finding factions, sub-factions and their members inside the campaign. A faction is a folder
// holding `factions.md`, or a note named like the folder with `type: faction`; members are the
// character notes in that folder and its plain subfolders.

import { inCampaign, typeOf, type CampaignScope } from '../campaign/scope';
import type { NoteInput } from '../types';
import type { Entity, Warn } from './model';
import { parsePower, parseRelationMap } from './values';

export const PARTY = '@party';
export const UNAFFILIATED = '@unaffiliated';

const FACTION_NOTE = 'factions.md';
const CHARACTER_TYPES = new Set(['npc', 'character']);

function folderOf(path: string): string {
  const slash = path.lastIndexOf('/');
  return slash === -1 ? '' : path.slice(0, slash);
}

function baseName(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

function stem(path: string): string {
  return baseName(path).replace(/\.md$/i, '');
}

/** The folder itself and each folder above it, nearest first. */
function* foldersUpFrom(folder: string): Generator<string> {
  let current = folder;
  while (current !== '') {
    yield current;
    current = folderOf(current);
  }
}

function nearestFaction(folder: string, factions: ReadonlySet<string>): string | null {
  for (const candidate of foldersUpFrom(folder)) {
    if (factions.has(candidate)) {
      return candidate;
    }
  }
  return null;
}

function pseudoFaction(id: string, name: string): Entity {
  return {
    id,
    kind: 'faction',
    pseudo: true,
    name,
    notePath: null,
    parent: null,
    power: 3,
    relations: new Map(),
    secretRelations: new Map(),
  };
}

/** The relations a note gives, public and secret. */
function relationsOf(note: NoteInput, warn: Warn): Pick<Entity, 'relations' | 'secretRelations'> {
  return {
    relations: parseRelationMap(note.frontmatter?.relations, note.path, 'relations', warn),
    secretRelations: parseRelationMap(
      note.frontmatter?.secret_relations,
      note.path,
      'secret_relations',
      warn,
    ),
  };
}

/**
 * The candidates for a folder's faction note: `factions.md` (in any case, as Windows and macOS
 * match it; one with an explicit other type, an overview note say, is none) and a note named like
 * the folder with `type: faction`.
 */
function factionCandidates(
  scoped: readonly NoteInput[],
  warn: Warn,
): { primary: Map<string, NoteInput>; folderNamed: Map<string, NoteInput> } {
  const primary = new Map<string, NoteInput>();
  const folderNamed = new Map<string, NoteInput>();
  for (const note of scoped) {
    const folder = folderOf(note.path);
    if (folder === '') continue;
    const type = typeOf(note.frontmatter);
    if (baseName(note.path).toLowerCase() === FACTION_NOTE) {
      if (type !== undefined && type !== 'faction') continue;
      const held = primary.get(folder);
      // Two spellings in one folder (only possible on Linux): the exact one wins.
      const exact = held === undefined || baseName(note.path) === FACTION_NOTE;
      const [kept, passed] = exact ? [note, held] : [held, note];
      if (passed !== undefined) warn({ path: passed.path, code: 'duplicate-faction-note' });
      primary.set(folder, kept);
    } else if (stem(note.path) === baseName(folder) && type === 'faction') {
      folderNamed.set(folder, note);
    }
  }
  return { primary, folderNamed };
}

/** One faction note per folder: `factions.md` before the folder-named note. */
function factionNotesOf(scoped: readonly NoteInput[], warn: Warn): Map<string, NoteInput> {
  const { primary, folderNamed } = factionCandidates(scoped, warn);
  const notes = new Map<string, NoteInput>(folderNamed);
  for (const [folder, note] of primary) {
    const other = folderNamed.get(folder);
    if (other !== undefined) warn({ path: other.path, code: 'duplicate-faction-note' });
    if (typeOf(note.frontmatter) !== 'faction' && note.frontmatterBroken !== true) {
      warn({ path: note.path, code: 'missing-type' });
    }
    notes.set(folder, note);
  }
  return notes;
}

function factionEntity(
  folder: string,
  note: NoteInput,
  factionFolders: ReadonlySet<string>,
  warn: Warn,
): Entity {
  const rawName = note.frontmatter?.name;
  return {
    id: folder,
    kind: 'faction',
    pseudo: false,
    name: typeof rawName === 'string' && rawName.trim() !== '' ? rawName.trim() : baseName(folder),
    folderName: baseName(folder),
    notePath: note.path,
    parent: nearestFaction(folderOf(folder), factionFolders),
    power: parsePower(note.frontmatter?.power, note.path, warn),
    ...relationsOf(note, warn),
  };
}

/** A character note's entity: in the nearest faction, else the Party or Unaffiliated. */
function characterEntity(
  note: NoteInput,
  type: string,
  factionFolders: ReadonlySet<string>,
  warn: Warn,
): Entity {
  return {
    id: note.path,
    kind: 'character',
    pseudo: false,
    name: stem(note.path),
    notePath: note.path,
    parent:
      nearestFaction(folderOf(note.path), factionFolders) ??
      (type === 'character' ? PARTY : UNAFFILIATED),
    power: 3,
    ...relationsOf(note, warn),
  };
}

export function discoverEntities(
  notes: readonly NoteInput[],
  campaign: CampaignScope,
  warn: Warn,
): Map<string, Entity> {
  const scoped = notes
    .filter((note) => inCampaign(campaign, note.path))
    .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  for (const note of scoped) {
    if (note.frontmatterBroken === true) warn({ path: note.path, code: 'broken-frontmatter' });
  }

  const factionNotes = factionNotesOf(scoped, warn);
  const factionFolders = new Set(factionNotes.keys());
  const factionNotePaths = new Set([...factionNotes.values()].map((note) => note.path));

  const entities = new Map<string, Entity>();
  for (const folder of [...factionFolders].sort()) {
    const note = factionNotes.get(folder);
    if (note !== undefined) entities.set(folder, factionEntity(folder, note, factionFolders, warn));
  }
  const pseudo: Record<string, string> = { [PARTY]: 'Party', [UNAFFILIATED]: 'Unaffiliated' };
  for (const note of scoped) {
    const type = typeOf(note.frontmatter);
    if (type === undefined || !CHARACTER_TYPES.has(type) || factionNotePaths.has(note.path)) {
      continue;
    }
    const entity = characterEntity(note, type, factionFolders, warn);
    const group = entity.parent ?? '';
    if (pseudo[group] !== undefined && !entities.has(group)) {
      entities.set(group, pseudoFaction(group, pseudo[group]));
    }
    entities.set(note.path, entity);
  }
  return entities;
}
