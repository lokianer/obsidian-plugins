// The spellbook: the tab, own spells from `type: spell` notes, the spell builder, and the links from
// spell names in stat blocks to the spellbook.

import { Notice } from 'obsidian';

import { spellNoteText } from '../../spells/draft';
import { spellFinder } from '../../spells/links';
import { ownIndex } from '../../spells/own';
import { SRD_SPELLS } from '../../spells/srd-spells';
import { newNote } from '../new-note';
import { OwnSpells } from '../own-spells';
import { SpellBuilderModal } from '../spell-builder';
import { linkSpells } from '../spell-links';
import { SPELLBOOK_VIEW, SpellbookView } from '../spellbook-view';
import type { Context } from './context';

/** Links the spell names of a rendered Spellcasting entry to the spellbook. */
export type SpellLinker = (el: HTMLElement) => void;

export function registerSpells(ctx: Context): SpellLinker {
  const { plugin, t } = ctx;
  const { app } = plugin;
  const ownSpells = new OwnSpells(plugin);
  app.workspace.onLayoutReady(() => void ownSpells.reload());
  let finder: ReturnType<typeof spellFinder> | null = null;
  ownSpells.onChange(() => (finder = null));
  const findSpells = (text: string) => {
    finder ??= spellFinder([...SRD_SPELLS, ...ownSpells.list]);
    return finder(text);
  };

  plugin.registerView(
    SPELLBOOK_VIEW,
    (leaf) =>
      new SpellbookView(leaf, {
        t,
        lang: ctx.lang,
        state: () => ctx.settings().spellbook,
        saveState: (spellbook) => void ctx.save({ ...ctx.settings(), spellbook }),
        own: () => ownSpells.list,
        onOwnChange: (listener) => ownSpells.onChange(listener),
        openNote: (path) => ctx.openNote(path),
        newSpell: () => newSpell(),
      }),
  );
  const openSpellbook = () => ctx.revealView(SPELLBOOK_VIEW);
  plugin.addCommand({
    id: 'open-spellbook',
    name: t('command.openSpellbook'),
    callback: openSpellbook,
  });
  plugin.addRibbonIcon('book-open', t('command.openSpellbook'), () => void openSpellbook());
  const openSpell = async (index: string) => {
    await openSpellbook();
    for (const leaf of app.workspace.getLeavesOfType(SPELLBOOK_VIEW)) {
      if (leaf.view instanceof SpellbookView) leaf.view.show(index);
    }
  };

  const newSpell = () =>
    new SpellBuilderModal(app, {
      t,
      lang: ctx.lang(),
      spells: SRD_SPELLS,
      create: async (draft) => {
        const settings = ctx.settings();
        const path = await newNote(
          app,
          ctx.cache,
          settings.spellFolder,
          draft.name,
          spellNoteText(draft),
        );
        new Notice(t('spellBuilder.created', { path }));
        // The new note's metadata first, then the spellbook can show it.
        await ctx.indexed(path);
        await ownSpells.reload();
        await openSpell(ownIndex(path));
      },
    }).open();
  plugin.addCommand({ id: 'new-spell', name: t('command.newSpell'), callback: newSpell });

  return (el) => linkSpells(el, findSpells, (index) => void openSpell(index));
}
