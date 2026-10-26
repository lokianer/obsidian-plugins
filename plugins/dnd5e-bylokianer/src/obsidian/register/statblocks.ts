// Stat blocks in notes (`dnd5e-statblock`): folded behind one line, editable in place, spells
// linked, attacks and saves rolling; and the command converting Fantasy Statblocks' blocks.

import { MarkdownRenderChild, MarkdownRenderer, Notice, parseYaml } from 'obsidian';

import { BLOCK, convertBlocks, parseStatblock } from '../../npc/statblock';
import { statblockEdits } from '../statblock-edits';
import { renderFolded, renderInvalid } from '../statblock-view';
import type { Context } from './context';
import type { SpellLinker } from './spells';

export function registerStatblocks(ctx: Context, spells: SpellLinker): void {
  const { plugin, t, openStatblocks } = ctx;
  const { app } = plugin;
  plugin.registerMarkdownCodeBlockProcessor(BLOCK, (source, el, mctx) => {
    let data: unknown;
    try {
      data = parseYaml(source);
    } catch {
      renderInvalid(el, source, t);
      return;
    }
    const child = new MarkdownRenderChild(el);
    mctx.addChild(child);
    const file = app.vault.getFileByPath(mctx.sourcePath);
    renderFolded(el, parseStatblock(data), {
      edit:
        file === null
          ? undefined
          : statblockEdits(app, file, t, () => mctx.getSectionInfo(el)?.lineStart ?? null),
      t,
      markdown: (markdown, target) =>
        MarkdownRenderer.render(app, markdown, target, mctx.sourcePath, child),
      spells,
      roll: (check, edge) => ctx.later.roll(check, edge),
      lang: ctx.uiLang,
      open: openStatblocks.has(mctx.sourcePath),
      toggle: (open) => {
        if (open) openStatblocks.add(mctx.sourcePath);
        else openStatblocks.delete(mctx.sourcePath);
      },
    });
  });
  plugin.addCommand({
    id: 'convert-statblock',
    name: t('command.convertStatblock'),
    callback: async () => {
      const file = app.workspace.getActiveFile();
      if (file === null) return;
      let count = 0;
      await app.vault.process(file, (text) => {
        const converted = convertBlocks(text);
        count = converted.count;
        return converted.text;
      });
      new Notice(count === 0 ? t('notice.noStatblock') : t('notice.converted', { count }));
    },
  });
}
