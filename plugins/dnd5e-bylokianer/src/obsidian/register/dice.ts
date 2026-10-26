// The dice: the tab, `dice:` in notes (Reading view and Live Preview), rolls from stat blocks and
// the party on the stage, and every roll offered for the session log.

import { Notice } from 'obsidian';

import { parseWithEdge, rollFormula, rollLine } from '../../dice/formula';
import { tableLine } from '../../dice/tables';
import { cryptoRandom } from '../deck-view';
import { DiceModal, diceEditorExtension, type InlineDeps, replaceInlineDice } from '../dice-inline';
import { PartyChecks } from '../dice-party';
import { DiceTables } from '../dice-tables';
import { DICE_VIEW, type DiceRecord, DiceView, remember } from '../dice-view';
import { inlineMarkdown } from '../inline-markdown';
import type { Context } from './context';

/** Registers the dice; returns the party's checks, which the Battle tab's cards show too. */
export function registerDice(ctx: Context): PartyChecks {
  const { plugin, t } = ctx;
  const { app } = plugin;
  const history: DiceRecord[] = [];
  const motion = (): boolean | null =>
    ctx.settings().diceAnimation === 'off'
      ? null
      : ctx.settings().diceAnimation === 'stage' &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const log = (record: DiceRecord) =>
    ctx.sessionLog.offerLine(
      record.table !== undefined
        ? tableLine(record.table, record.roll.total, record.row ?? null)
        : rollLine(record.roll, record.dc, record.subject),
      ctx.settings().diceLog,
    );
  const tables = new DiceTables(plugin, ctx.cache);
  const party = new PartyChecks(plugin, ctx.cache, () => ctx.uiLang);
  const render = inlineMarkdown(app, plugin);
  plugin.registerView(
    DICE_VIEW,
    (leaf) =>
      new DiceView(leaf, { t, random: cryptoRandom, motion, history, log, tables, render, party }),
  );

  const inline: InlineDeps = {
    app,
    t,
    random: cryptoRandom,
    motion,
    log,
    table: (link, from) => tables.resolve(link, from),
    render,
  };
  plugin.registerMarkdownPostProcessor((el, mctx) =>
    replaceInlineDice(el, mctx.sourcePath, inline),
  );
  plugin.registerEditorExtension(diceEditorExtension(inline));

  // A roll from a stat block or a character: the stage in a small window (or a notice), the Dice
  // tab's history, the log.
  ctx.later.roll = (check, edge) => {
    const f = parseWithEdge(check.formula, check.d20 ? edge : 'normal');
    if (f === null) return;
    const roll = rollFormula(f, cryptoRandom);
    const record: DiceRecord = { label: check.label, dc: null, roll, subject: check.subject };
    remember(history, record);
    for (const leaf of app.workspace.getLeavesOfType(DICE_VIEW)) {
      if (leaf.view instanceof DiceView) leaf.view.renderHistory();
    }
    if (motion() === null) new Notice(`${check.label}: ${roll.text}`);
    else new DiceModal(inline, { label: check.label, dc: null, roll }).open();
    log(record);
  };

  const openDice = () => ctx.revealView(DICE_VIEW);
  plugin.addCommand({ id: 'open-dice', name: t('command.openDice'), callback: openDice });
  plugin.addRibbonIcon('dices', t('command.openDice'), () => void openDice());
  return party;
}
