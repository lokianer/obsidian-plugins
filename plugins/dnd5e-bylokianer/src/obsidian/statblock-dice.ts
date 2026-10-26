// Dice buttons for stat blocks and characters: the attack bonuses and damage expressions in a
// rendered entry, abilities, saves and skills, a character's checks. A click rolls; on a d20 roll
// Shift adds advantage and Alt disadvantage, on damage Shift rolls a critical hit, and a
// right-click or long press offers the choices.

import { Menu } from 'obsidian';

import type { Check } from '../dice/checks';
import { criticalFormula, type Edge } from '../dice/formula';
import { rollParts } from '../dice/statblock';
import type { StringKey, T } from '../i18n/strings';

export type RollCheck = (check: Check, edge: Edge) => void;

const EDGES = [
  ['normal', 'dice.normal'],
  ['adv', 'dice.advantage'],
  ['dis', 'dice.disadvantage'],
] as const satisfies readonly (readonly [Edge, StringKey])[];

/** A damage check as a critical hit: the dice doubled, the label and log saying so. */
function critical(check: Check, t: T): Check {
  return {
    ...check,
    label: `${check.label} · ${t('dice.critical')}`,
    subject: `${check.subject} (critical)`,
    formula: criticalFormula(check.formula) ?? check.formula,
  };
}

/** A button that rolls a check, showing `text`. */
export function checkButton(
  parent: HTMLElement,
  text: string,
  check: Check,
  roll: RollCheck,
  t: T,
): HTMLElement {
  const button = parent.createEl('button', {
    cls: 'dnd5e-sb-roll',
    text,
    attr: { 'aria-label': t('dice.rollFormula', { formula: check.formula }) },
  });
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (check.damage === true && e.shiftKey) roll(critical(check, t), 'normal');
    else roll(check, !check.d20 ? 'normal' : e.shiftKey ? 'adv' : e.altKey ? 'dis' : 'normal');
  });
  if (check.damage === true) {
    button.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const menu = new Menu();
      menu.addItem((item) => item.setTitle(t('dice.normal')).onClick(() => roll(check, 'normal')));
      menu.addItem((item) =>
        item.setTitle(t('dice.criticalHit')).onClick(() => roll(critical(check, t), 'normal')),
      );
      menu.showAtMouseEvent(e);
    });
  } else if (check.d20) {
    button.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const menu = new Menu();
      for (const [edge, key] of EDGES) {
        menu.addItem((item) => item.setTitle(t(key)).onClick(() => roll(check, edge)));
      }
      menu.showAtMouseEvent(e);
    });
  }
  return button;
}

/**
 * Turns the attack bonuses and damage expressions in a rendered entry into buttons. The parts are
 * found in the entry's whole text (`*Melee Attack Roll:* +7` spans two nodes) and replaced where
 * one lies inside a single text node outside links and buttons.
 */
export function linkEntryDice(
  el: HTMLElement,
  who: string,
  entry: string,
  roll: RollCheck,
  t: T,
): void {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: { node: Text; at: number }[] = [];
  let text = '';
  for (let n = walker.nextNode(); n !== null; n = walker.nextNode()) {
    nodes.push({ node: n as Text, at: text.length });
    text += (n as Text).data;
  }
  const what = [who, entry].filter((p) => p !== '');
  // Last to first, so the offsets of the parts before stay right.
  for (const part of rollParts(text).reverse()) {
    const host = nodes.find(
      ({ node, at }) => part.start >= at && part.end <= at + node.data.length,
    );
    if (host === undefined) continue;
    const { node, at } = host;
    if (node.parentElement?.closest('a, button, code, input, textarea') != null) continue;
    const damage = part.kind === 'damage';
    const check: Check = {
      name: entry,
      label: damage ? `${what.join(': ')} · ${t('dice.damage')}` : what.join(': '),
      subject: `${who} rolls ${entry}${damage ? ' damage' : ''}`.trim(),
      formula: part.formula,
      d20: !damage,
      damage,
    };
    const button = checkButton(createSpan(), text.slice(part.start, part.end), check, roll, t);
    const after = node.splitText(part.start - at);
    after.data = after.data.slice(part.end - part.start);
    after.before(button);
  }
}

/** A row of check buttons: `Überzeugen +7`. */
export function renderChecks(
  parent: HTMLElement,
  list: readonly Check[],
  roll: RollCheck,
  t: T,
): void {
  const row = parent.createDiv({ cls: 'dnd5e-checks' });
  for (const check of list) {
    const sign = check.formula === 'd20' ? '+0' : check.formula.slice(3);
    checkButton(row, `${check.name} ${sign}`, check, roll, t);
  }
}
