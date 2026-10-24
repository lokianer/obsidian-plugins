// What the faction card shows for one note: its place in the campaign, name and power, every
// relation entry as the note writes it (broken ones included) and its other fields — each with
// what an edit needs to name it and to check that it has not changed. Pure.

import type { Expect } from '../yaml/edit';
import { keyLookup } from './keys';
import type { FactionWorld, RelationField, ResolvedEntity, Warning } from './model';
import { asWritten, parseRelationValue } from './values';

export const RELATION_FIELDS: readonly RelationField[] = ['relations', 'secret_relations'];
const OWN_KEYS = new Set(['name', 'power', 'relations', 'secret_relations']);

export interface CardRow {
  field: RelationField;
  /** The key exactly as the frontmatter holds it; edits find the entry by it. */
  rawKey: string;
  /** The key trimmed, as shown. */
  key: string;
  /** The target's entity id, or null for a name nothing has. */
  targetId: string | null;
  /** The value the plugin reads (clamped, rounded), or null when there is none. */
  value: number | null;
  /** The value as written when it is not a usable number (`hates`), else null. */
  invalid: string | null;
  /** The raw value, for the edit's `expect`. */
  expect: Expect;
  why: string | null;
  whyExpect: Expect;
  warnings: Warning[];
}

export interface CardField {
  key: string;
  value: unknown;
  /** A single-line scalar the card can edit in place; lists and maps are shown only. */
  editable: boolean;
  expect: Expect;
}

export interface CardSection {
  field: RelationField;
  rows: CardRow[];
  /** False when the field is not a map (`relations-not-a-map`): shown, not edited. */
  editable: boolean;
  warnings: Warning[];
}

export interface CardModel {
  path: string;
  entityId: string;
  kind: 'faction' | 'character';
  /** Names of the enclosing factions, outermost first; Party or Unaffiliated for loose characters. */
  place: { id: string; name: string }[];
  name: string;
  /** Factions: the `name:` as written (null when absent) and the folder name as placeholder. */
  nameField: { value: string | null; expect: Expect; placeholder: string } | null;
  power: { value: number; expect: Expect; warnings: Warning[] } | null;
  sections: Record<RelationField, CardSection>;
  fields: CardField[];
  /** Warnings about the note as a whole (missing type, duplicate name …). */
  noteWarnings: Warning[];
  warningCount: number;
}

function isMap(raw: unknown): raw is Record<string, unknown> {
  return raw !== null && typeof raw === 'object' && !Array.isArray(raw);
}

function isScalar(raw: unknown): raw is string | number | boolean | null {
  return raw === null || ['string', 'number', 'boolean'].includes(typeof raw);
}

function asExpect(raw: unknown): Expect {
  return isScalar(raw) || raw === undefined ? raw : undefined;
}

function placeOf(world: FactionWorld, entity: ResolvedEntity): { id: string; name: string }[] {
  const names: { id: string; name: string }[] = [];
  const seen = new Set<string>();
  let parent = entity.parent === null ? undefined : world.entities.get(entity.parent);
  while (parent !== undefined && !seen.has(parent.id)) {
    seen.add(parent.id);
    names.unshift({ id: parent.id, name: parent.name });
    parent = parent.parent === null ? undefined : world.entities.get(parent.parent);
  }
  return names;
}

function sectionOf(
  field: RelationField,
  raw: unknown,
  path: string,
  warnings: readonly Warning[],
  resolve: (key: string) => string | null,
): CardSection {
  const own = warnings.filter((w) => w.field === field);
  const sectionWarnings = own.filter((w) => w.key === undefined);
  if (raw === undefined || raw === null) {
    return { field, rows: [], editable: true, warnings: sectionWarnings };
  }
  if (!isMap(raw)) {
    return { field, rows: [], editable: false, warnings: sectionWarnings };
  }
  const rows: CardRow[] = [];
  const seenTargets = new Set<string>();
  for (const [rawKey, rawValue] of Object.entries(raw)) {
    const key = rawKey.trim();
    const structured = isMap(rawValue);
    const valuePart = structured ? rawValue.value : rawValue;
    const relation = parseRelationValue(valuePart, { path, key, field }, () => undefined);
    const empty =
      valuePart === null ||
      valuePart === undefined ||
      (typeof valuePart === 'string' && valuePart.trim() === '');
    const targetId = resolve(key);
    const target = targetId ?? `?${key}`;
    const repeated = seenTargets.has(target);
    seenTargets.add(target);
    const why = structured && typeof rawValue.why === 'string' ? rawValue.why : null;
    rows.push({
      field,
      rawKey,
      key,
      targetId,
      value: relation?.value ?? null,
      invalid: relation === null && !empty ? asWritten(valuePart) : null,
      expect: asExpect(valuePart),
      why,
      whyExpect: structured ? asExpect(rawValue.why) : undefined,
      // A duplicate-key warning belongs to the later entries, never to the one that is used.
      warnings: own.filter(
        (w) => w.key === key && (w.code === 'duplicate-key' ? repeated : !repeated),
      ),
    });
  }
  return { field, rows, editable: true, warnings: sectionWarnings };
}

/** The card for a note, or null when the note is not a faction or character of the world. */
export function buildCard(
  path: string,
  frontmatter: Record<string, unknown> | undefined,
  world: FactionWorld,
): CardModel | null {
  const entity = [...world.entities.values()].find((e) => !e.pseudo && e.notePath === path);
  if (entity === undefined) {
    return null;
  }
  const fm = frontmatter ?? {};
  const noteWarnings = world.warnings.filter((w) => w.path === path);
  const resolve = keyLookup(world.entities);
  const sections = {
    relations: sectionOf('relations', fm.relations, path, noteWarnings, resolve),
    secret_relations: sectionOf(
      'secret_relations',
      fm.secret_relations,
      path,
      noteWarnings,
      resolve,
    ),
  };
  const faction = entity.kind === 'faction';
  const rawName = fm.name;
  return {
    path,
    entityId: entity.id,
    kind: entity.kind,
    place: placeOf(world, entity),
    name: entity.name,
    nameField: faction
      ? {
          value: typeof rawName === 'string' ? rawName : null,
          expect: asExpect(rawName),
          placeholder: entity.folderName ?? entity.name,
        }
      : null,
    power: faction
      ? {
          value: entity.power,
          expect: asExpect(fm.power),
          warnings: noteWarnings.filter((w) => w.key === 'power'),
        }
      : null,
    sections,
    fields: Object.entries(fm)
      .filter(([key]) => !(faction ? OWN_KEYS : new Set(RELATION_FIELDS)).has(key))
      .map(([key, value]) => ({ key, value, editable: isScalar(value), expect: asExpect(value) })),
    noteWarnings: noteWarnings.filter((w) => w.field === undefined && w.key !== 'power'),
    warningCount: noteWarnings.length,
  };
}
