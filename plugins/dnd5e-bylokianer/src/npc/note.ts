// An NPC note's text from the NPC template and the choices made in the New NPC dialog, a stat block
// added to an existing note, and where a new NPC's note goes. Pure: frontmatter keys are set with
// the line editor, sections are found by heading, nothing is re-serialised.

import { PARTY, UNAFFILIATED } from '../factions/discover';
import type { FactionWorld } from '../factions/model';
import { applyOp } from '../yaml/edit';
import { frontmatterRange, splitLines, tokenText, topLevelKeys } from '../yaml/lines';
import { type Archetype, withName } from './archetypes';
import { BLOCK, findStatblocks } from './statblock';

export interface NpcChoices {
  name: string;
  race: string;
  class: string;
  alignment: string;
  archetype: Archetype | null;
  appearance: string;
  manner: string;
  want: string;
  quirk: string;
}

/** The headings the personality lines go under (the example template's), by field. */
const SECTIONS = {
  appearance: 'Appearance and manner',
  manner: 'Appearance and manner',
  want: 'What they want',
  quirk: 'Voice notes',
} as const;

const STATS = 'Stats';

const MINIMAL = [
  '---',
  'type: npc',
  'tags:',
  '  - npc',
  '---',
  '',
  '# {{title}}',
  '',
  `## ${SECTIONS.appearance}`,
  '',
  `## ${SECTIONS.want}`,
  '',
  `## ${SECTIONS.quirk}`,
  '',
].join('\n');

/** Sets a top-level frontmatter key to `value`, whatever it held; the note is left as it was on a refusal. */
function setKey(text: string, key: string, value: string): string {
  const { lines } = splitLines(text);
  const range = frontmatterRange(lines);
  const current =
    range === null ? undefined : topLevelKeys(lines, range).find((k) => k.key === key);
  const expect = current === undefined ? null : tokenText(current.parsed.token) || null;
  const result = applyOp(text, { op: 'set-scalar', key, expect, value });
  return result.ok ? result.text : text;
}

const headingLine = (lines: readonly string[], title: string) =>
  lines.findIndex((l) => new RegExp(`^#{2,6}\\s+${escapeRegex(title)}\\s*$`, 'i').test(l.trim()));

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** The line after a section's last non-empty line (or right after its heading). */
function sectionEnd(lines: readonly string[], heading: number): number {
  let end = heading + 1;
  while (end < lines.length && !/^#{1,6}\s/.test(lines[end] ?? '')) end++;
  let last = end - 1;
  while (last > heading && (lines[last] ?? '').trim() === '') last--;
  return last + 1;
}

/** Appends `items` under the heading `title`, creating the section at the end when it is missing. */
function addUnder(lines: string[], title: string, items: readonly string[]): void {
  if (items.length === 0) return;
  let at = headingLine(lines, title);
  if (at === -1) {
    while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
    lines.push('', `## ${title}`, '');
    at = lines.length - 2;
  }
  const end = sectionEnd(lines, at);
  const gap = end === at + 1 ? [''] : [];
  lines.splice(end, 0, ...gap, ...items);
}

/** A fenced stat block's lines. */
function fenced(yaml: string): string[] {
  return ['```' + BLOCK, ...yaml.split(/\r?\n/), '```'];
}

/**
 * The new NPC's note: the template (or a minimal note) with `{{title}}` filled, `type: npc` and the
 * chosen race, class, alignment and archetype in the frontmatter, the personality lines under their
 * headings, and the archetype's stat block in place of the template's (or under `## Stats`).
 */
export function npcNote(template: string | null, choices: NpcChoices): string {
  const eol = template?.includes('\r\n') === true ? '\r\n' : '\n';
  let text = (template ?? MINIMAL).replace(/\{\{\s*title\s*\}\}/g, choices.name);
  text = setKey(text, 'type', 'npc');
  for (const key of ['race', 'class', 'alignment'] as const) {
    if (choices[key].trim() !== '') text = setKey(text, key, choices[key].trim());
  }
  if (choices.archetype !== null) text = setKey(text, 'archetype', choices.archetype.name);

  const lines = text.split(/\r?\n/);
  const personality = (['appearance', 'manner', 'want', 'quirk'] as const).filter(
    (field) => choices[field].trim() !== '',
  );
  for (const field of personality) addUnder(lines, SECTIONS[field], [`- ${choices[field].trim()}`]);

  if (choices.archetype !== null) {
    const yaml = withName(choices.archetype.yaml, choices.name);
    const block = findStatblocks(lines.join('\n'))[0];
    if (block === undefined) addUnder(lines, STATS, fenced(yaml));
    else lines.splice(block.open, block.close - block.open + 1, ...fenced(yaml));
  }
  return lines.join(eol);
}

/** The note with a stat block added under `## Stats`, or null when it already has one. */
export function addStatblock(text: string, yaml: string): string | null {
  if (findStatblocks(text).length > 0) return null;
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);
  const final = lines[lines.length - 1] === '';
  addUnder(lines, STATS, fenced(yaml));
  if (final && lines[lines.length - 1] !== '') lines.push('');
  return lines.join(eol);
}

/**
 * The folder a new NPC of `factionId` goes into: the faction's own folder; for the Party, the folder
 * of its members (else `<campaign>/Party`); for the unaffiliated, `<campaign>/<npcFolder>`.
 */
export function npcFolder(world: FactionWorld, factionId: string, npcFolderName: string): string {
  const base = world.campaign?.folder ?? '';
  const join = (name: string) => (base === '' ? name : `${base}/${name}`);
  if (factionId === UNAFFILIATED) return join(npcFolderName);
  if (factionId === PARTY) {
    const member = [...world.entities.values()].find(
      (e) => e.kind === 'character' && e.parent === PARTY,
    );
    return member === undefined ? join('Party') : member.id.slice(0, member.id.lastIndexOf('/'));
  }
  return factionId;
}

/** `folder/Name.md`, or `folder/Name 2.md` … when a note of that name exists already. */
export function freePath(folder: string, name: string, exists: (path: string) => boolean): string {
  const clean = name.replace(/[\\/:*?"<>|#^[\]]/g, '').trim() || 'NPC';
  const at = (suffix: string) => `${folder === '' ? '' : `${folder}/`}${clean}${suffix}.md`;
  let n = 1;
  while (exists(at(n === 1 ? '' : ` ${n}`))) n++;
  return at(n === 1 ? '' : ` ${n}`);
}
