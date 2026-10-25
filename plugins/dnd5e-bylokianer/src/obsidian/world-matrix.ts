// Drawing the faction matrix: who (rows) towards whom (columns), each cell coloured with its
// number and step name, inherited values set apart; a click opens the value popover. Rows and
// columns carry their faction's colour; the hovered cell lights up its row and column.

import { type Hue, initials } from '../factions/hues';
import { type MatrixCell, type WorldMatrix } from '../factions/matrix';
import { signed, stepColour, stepName } from '../factions/steps';
import type { T } from '../i18n/strings';
import type { PopoverTarget } from './popover';

export interface MatrixActions {
  openNote: (path: string, newLeaf: boolean) => void;
  openValue: (target: PopoverTarget) => void;
  history: (from: string, to: string) => string[];
}

/** Gives an element its faction's colour, when it has one. */
function paint(el: HTMLElement, hue: Hue | undefined): void {
  if (hue === undefined) return;
  el.addClass('has-hue');
  el.setCssProps({
    '--dnd5e-hue': `var(--color-${hue})`,
    '--dnd5e-hue-rgb': `var(--color-${hue}-rgb)`,
  });
}

export function renderMatrix(
  parent: HTMLElement,
  matrix: WorldMatrix,
  hues: ReadonlyMap<string, Hue>,
  t: T,
  stepNames: readonly string[],
  actions: MatrixActions,
): void {
  const scroller = parent.createDiv({ cls: 'dnd5e-world-matrix' });
  const table = scroller.createDiv({ cls: 'dnd5e-world-matrix-card' }).createEl('table');
  const head = table.createEl('thead').createEl('tr');
  head.createEl('th', { cls: 'dnd5e-world-corner', text: t('world.corner') });
  const columnHeads = matrix.columns.map((column) => {
    const th = head.createEl('th', { cls: column.ghost ? 'is-ghost' : '' });
    if (column.depth > 0) th.addClass('is-sub');
    paint(th, hues.get(column.id));
    th.createSpan({ cls: 'dnd5e-world-dot' });
    th.createSpan({ cls: 'dnd5e-world-column', text: column.name });
    return th;
  });

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
    paint(th, hues.get(row.id));
    th.createSpan({ cls: 'dnd5e-world-avatar', text: initials(row.name) });
    const notePath = row.notePath;
    const name = th.createEl('a', { text: row.name, href: '#' });
    name.addEventListener('click', (event) => {
      event.preventDefault();
      if (notePath !== null) actions.openNote(notePath, event.ctrlKey || event.metaKey);
    });
    matrix.cells[r]?.forEach((cell, c) => {
      const column = matrix.columns[c];
      if (column === undefined) return;
      const td = renderCell(tr, cell, row.id, column.id, t, stepNames, actions);
      const cross = (on: boolean) => {
        th.toggleClass('is-cross', on);
        columnHeads[c]?.toggleClass('is-cross', on);
      };
      td.addEventListener('mouseenter', () => cross(true));
      td.addEventListener('mouseleave', () => cross(false));
    });
  });
}

function renderCell(
  tr: HTMLElement,
  cell: MatrixCell,
  subject: string,
  target: string,
  t: T,
  stepNames: readonly string[],
  actions: MatrixActions,
): HTMLElement {
  const td = tr.createEl('td');
  if (cell.kind === 'none') {
    td.addClass('is-none');
    return td;
  }
  const open = (event: MouseEvent) =>
    actions.openValue({ subject, target, at: { x: event.clientX, y: event.clientY } });
  td.addEventListener('click', open);
  if (cell.kind === 'empty') {
    td.addClass('is-empty');
    td.setAttr('aria-label', t('card.add'));
    return td;
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
    ...actions.history(subject, target),
  ].filter((x): x is string => x !== null);
  if (notes.length > 0) td.setAttr('title', notes.join('\n'));
  return td;
}
