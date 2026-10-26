// The Monster Manual: the tab, own monsters from `type: monster` notes, the monster builder with
// its import, and putting a monster into a note, a note of its own, a fight or an encounter.

import { MarkdownView, Notice } from 'obsidian';

import { monsterNoteText, statblockYaml } from '../../monsters/draft';
import type { SrdMonster } from '../../monsters/model';
import { ownIndex } from '../../monsters/own';
import { SRD_MONSTERS } from '../../monsters/srd-monsters';
import { BLOCK } from '../../npc/statblock';
import { MonsterBuilderModal } from '../monster-builder';
import { MONSTER_VIEW, MonsterManualView } from '../monster-manual-view';
import { newNote } from '../new-note';
import { OwnMonsters } from '../own-monsters';
import type { Context } from './context';
import type { SpellLinker } from './spells';

const fence = (monster: SrdMonster) => `\`\`\`${BLOCK}\n${monster.yaml}\n\`\`\``;

export function registerMonsters(ctx: Context, spells: SpellLinker): OwnMonsters {
  const { plugin, t, later } = ctx;
  const { app } = plugin;
  const folder = () => ctx.settings().monsterFolder;

  // The note a monster goes into: the last Markdown note the GM was in.
  let lastNote: MarkdownView | null = null;
  plugin.registerEvent(
    app.workspace.on('active-leaf-change', (leaf) => {
      if (leaf?.view instanceof MarkdownView) lastNote = leaf.view;
    }),
  );
  const insert = (monster: SrdMonster) => {
    const file = lastNote?.file ?? null;
    if (lastNote === null || file === null) {
      new Notice(t('monsters.noNote'));
      return;
    }
    const line = lastNote.editor.getCursor().line;
    void app.vault
      .process(file, (text) => {
        const lines = text.split('\n');
        lines.splice(line + 1, 0, '', fence(monster), '');
        return lines.join('\n');
      })
      .then(() => new Notice(t('monsters.inserted', { name: monster.name, note: file.basename })));
  };
  const makeNote = async (monster: SrdMonster) => {
    const text = monsterNoteText(monster.name, monster.cr, monster.yaml, BLOCK);
    const path = await newNote(app, ctx.cache, folder(), monster.name, text);
    new Notice(t('monsters.created', { path }));
    ctx.openStatblocks.add(path);
    ctx.openNote(path);
  };

  const ownMonsters = new OwnMonsters(plugin);
  app.workspace.onLayoutReady(() => void ownMonsters.reload());
  plugin.registerView(
    MONSTER_VIEW,
    (leaf) =>
      new MonsterManualView(leaf, {
        t,
        lang: ctx.lang,
        state: () => ctx.settings().monsterManual,
        saveState: (monsterManual) => void ctx.save({ ...ctx.settings(), monsterManual }),
        spells,
        insert,
        own: () => ownMonsters.list,
        onOwnChange: (listener) => ownMonsters.onChange(listener),
        openNote: (path) => ctx.openNote(path),
        newMonster: () => newMonster(),
        addToCombat: (monster) => later.addToCombat(monster),
        roll: (check, edge) => later.roll(check, edge),
        addToEncounter: (monster) => later.addToEncounter(monster),
        makeNote: (monster) => void makeNote(monster),
      }),
  );
  const openMonsters = () => ctx.revealView(MONSTER_VIEW);
  plugin.addCommand({
    id: 'open-monster-manual',
    name: t('command.openMonsters'),
    callback: openMonsters,
  });
  plugin.addRibbonIcon('skull', t('command.openMonsters'), () => void openMonsters());

  const newMonster = () =>
    new MonsterBuilderModal(app, {
      t,
      lang: ctx.lang(),
      monsters: SRD_MONSTERS,
      createAll: async (blocks) => {
        for (const block of blocks) {
          const name = (block.name ?? '').trim();
          const text = monsterNoteText(name, block.cr, statblockYaml(block), BLOCK);
          await newNote(app, ctx.cache, folder(), name, text);
        }
        new Notice(t('monsterBuilder.import.done', { count: blocks.length, folder: folder() }));
        await ownMonsters.reload();
        await openMonsters();
      },
      create: async (block) => {
        const name = (block.name ?? '').trim();
        const text = monsterNoteText(name, block.cr, statblockYaml(block), BLOCK);
        const path = await newNote(app, ctx.cache, folder(), name, text);
        new Notice(t('monsters.created', { path }));
        await ctx.indexed(path);
        await ownMonsters.reload();
        await openMonsters();
        for (const leaf of app.workspace.getLeavesOfType(MONSTER_VIEW)) {
          if (leaf.view instanceof MonsterManualView) leaf.view.show(ownIndex(path));
        }
      },
    }).open();
  plugin.addCommand({ id: 'new-monster', name: t('command.newMonster'), callback: newMonster });

  return ownMonsters;
}
