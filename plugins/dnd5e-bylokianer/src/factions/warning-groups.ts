// Sorting warnings for display: by note, then by what happened to the data.

import type { Warning, WarningCode } from './model';

/** skipped: the value is not used · adjusted: used, but changed · names: a key or name clash · notes: the note itself. */
export type WarningGroup = 'skipped' | 'adjusted' | 'names' | 'notes';

export const GROUP_ORDER: readonly WarningGroup[] = ['skipped', 'adjusted', 'names', 'notes'];

const GROUPS: Record<WarningCode, WarningGroup> = {
  'value-not-a-number': 'skipped',
  'structured-without-value': 'skipped',
  'relations-not-a-map': 'skipped',
  'self-relation': 'skipped',
  'duplicate-key': 'skipped',
  'value-out-of-range': 'adjusted',
  'value-not-integer': 'adjusted',
  'power-out-of-range': 'adjusted',
  'power-not-a-number': 'adjusted',
  'power-not-integer': 'adjusted',
  'unknown-target': 'names',
  'ambiguous-key': 'names',
  'duplicate-name': 'names',
  'missing-type': 'notes',
  'duplicate-faction-note': 'notes',
  'campaign-ignored': 'notes',
  'broken-frontmatter': 'notes',
};

/** Codes the faction card can repair: everything but renames, moves and broken YAML. */
const NOT_FIXABLE = new Set<WarningCode>([
  'duplicate-name',
  'duplicate-faction-note',
  'campaign-ignored',
  'broken-frontmatter',
]);

export function isFixable(code: WarningCode): boolean {
  return !NOT_FIXABLE.has(code);
}

export function warningGroup(code: WarningCode): WarningGroup {
  return GROUPS[code];
}

export interface NoteWarnings {
  path: string;
  count: number;
  groups: { group: WarningGroup; warnings: Warning[] }[];
}

/** Notes in path order; within a note the groups in GROUP_ORDER, each keeping the order found. */
export function groupWarnings(warnings: readonly Warning[]): NoteWarnings[] {
  const byPath = new Map<string, Warning[]>();
  for (const warning of warnings) {
    const list = byPath.get(warning.path) ?? [];
    list.push(warning);
    byPath.set(warning.path, list);
  }
  return [...byPath.keys()].sort().map((path) => {
    const list = byPath.get(path) ?? [];
    return {
      path,
      count: list.length,
      groups: GROUP_ORDER.map((group) => ({
        group,
        warnings: list.filter((w) => warningGroup(w.code) === group),
      })).filter((g) => g.warnings.length > 0),
    };
  });
}
