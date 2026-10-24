// Drawing the faction matrix: who (rows) towards whom (columns), each cell coloured with its
// number and step name, inherited values set apart; a click leads into the faction card.

import { type MatrixCell, type WorldMatrix } from '../factions/matrix';
import type { RelationField } from '../factions/model';
import { signed, stepColour, stepName } from '../factions/steps';
import type { EditTarget } from '../factions/world-graph';
import type { T } from '../i18n/strings';

export interface MatrixActions {
  openNote: (path: string, newLeaf: boolean) => void;
  editValue: (edit: EditTarget, newLeaf: boolean) => void;
  addValue: (add: { path: string; field: RelationField; key: string }, newLeaf: boolean) => void;
}

export function renderMatrix(
  parent: HTMLElement,
  matrix: WorldMatrix,
  t: T,
  stepNames: readonly string[],
  actions: MatrixActions,
): void {
  const scroller = parent.createDiv({ cls: 'dnd5e-world-matrix' });
  const table = scroller.createEl('table');
  const head = table.createEl('thead').createEl('tr');
  head.createEl('th', { cls: 'dnd5e-world-corner', text: t('world.corner') });
  for (const column of matrix.columns) {
    const th = head.createEl('th', { cls: column.ghost ? 'is-ghost' : '' });
    th.createSpan({ cls: 'dnd5e-world-column', text: column.name });
    if (column.depth > 0) th.addClass('is-sub');
  }

  const body = table.createEl('tbody');
  matrix.rows.forEach((row, r) => {
    const tr = body.createEl('tr');
    if (row.kind === 'group') {
      tr.addClass('is-group');
      tr.createEl('th', {
        text: t(row.id === '@party' ? 'pseudo.party' : 'pseudo.unaffiliated'),
        attr: { colspan: String(matrix.columns.length + 1) },
      });
      return;
    }
    const th = tr.createEl('th', { cls: 'dnd5e-world-row' });
    th.setCssProps({ '--dnd5e-depth': String(row.depth) });
    const notePath = row.notePath;
    const name = th.createEl('a', { text: row.name, href: '#' });
    name.addEventListener('click', (event) => {
      event.preventDefault();
      if (notePath !== null) actions.openNote(notePath, event.ctrlKey || event.metaKey);
    });
    matrix.cells[r]?.forEach((cell) => renderCell(tr, cell, t, stepNames, actions));
  });
}

function renderCell(
  tr: HTMLElement,
  cell: MatrixCell,
  t: T,
  stepNames: readonly string[],
  actions: MatrixActions,
): void {
  const td = tr.createEl('td');
  if (cell.kind === 'none') {
    td.addClass('is-none');
    return;
  }
  if (cell.kind === 'empty') {
    td.addClass('is-empty');
    td.setAttr('aria-label', t('card.add'));
    td.addEventListener('click', (event) =>
      actions.addValue(cell.add, event.ctrlKey || event.metaKey),
    );
    return;
  }
  td.addClass('has-value');
  if (cell.inheritedFrom !== null) td.addClass('is-inherited');
  if (cell.differs) td.addClass('is-differs');
  td.setCssProps({ '--dnd5e-value-colour': stepColour(cell.value) });
  td.createDiv({ cls: 'dnd5e-world-number', text: signed(cell.value) });
  td.createDiv({ cls: 'dnd5e-world-step', text: stepName(cell.value, t, stepNames) });
  const notes = [
    cell.inheritedFrom === null ? null : t('world.inheritedFrom', { name: cell.inheritedFrom }),
    cell.differs ? t('world.trueTag') : null,
    cell.why ?? null,
  ].filter((x): x is string => x !== null);
  if (notes.length > 0) td.setAttr('title', notes.join('\n'));
  td.addEventListener('click', (event) =>
    actions.editValue(cell.edit, event.ctrlKey || event.metaKey),
  );
}
