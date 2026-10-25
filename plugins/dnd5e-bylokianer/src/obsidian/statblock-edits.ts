// The writes behind the editable stat block: each finds the block again by the line it opens on
// (asked at write time, as lines may have moved; when Obsidian cannot tell, the note's only
// stat block of ours) and runs one line edit through vault.process.

import type { App, TFile } from 'obsidian';

import type { T } from '../i18n/strings';
import {
  addEntry,
  type BlockResult,
  editScalar,
  removeEntry,
  setAbility,
  setEntryField,
} from '../npc/block-edit';
import { BLOCK, findStatblocks } from '../npc/statblock';
import type { StatblockEdits } from './statblock-view';
import { type TextEdit, undoableWrite, writeEdit } from './write';

export function statblockEdits(
  app: App,
  file: TFile,
  t: T,
  /** The line the block's opening fence is on now, or null when it cannot be told. */
  open: () => number | null,
): StatblockEdits {
  const at =
    (run: (text: string, line: number) => BlockResult): TextEdit =>
    (text) => {
      const ours = findStatblocks(text).filter((b) => b.name === BLOCK);
      const line = open() ?? (ours.length === 1 ? (ours[0]?.open ?? null) : null);
      return line === null ? { ok: false, refusal: { code: 'not-found' } } : run(text, line);
    };
  return {
    scalar: (key, expect, value) =>
      writeEdit(
        app,
        file,
        t,
        key,
        at((text, line) => editScalar(text, line, { op: 'set-scalar', key, expect, value })),
      ),
    ability: (index, expect, value) =>
      writeEdit(
        app,
        file,
        t,
        'stats',
        at((text, line) => setAbility(text, line, index, expect, value)),
      ),
    entry: (key, index, field, expect, value) =>
      writeEdit(
        app,
        file,
        t,
        key,
        at((text, line) => setEntryField(text, line, key, index, field, expect, value)),
      ),
    add: (key) =>
      writeEdit(
        app,
        file,
        t,
        key,
        at((text, line) => addEntry(text, line, key, t('statblock.newEntry'), '')),
      ),
    remove: (key, index, name) =>
      undoableWrite(
        app,
        file,
        t,
        name,
        at((text, line) => removeEntry(text, line, key, index, name)),
      ),
  };
}
