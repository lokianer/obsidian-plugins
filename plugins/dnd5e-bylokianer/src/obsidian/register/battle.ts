// The battle tracker: the tab, the encounter builder, and the Monster Manual's Add to combat and
// Add to encounter.

import { Notice } from 'obsidian';

import { encounterNoteText } from '../../battle/budget';
import { battleLine } from '../../battle/log';
import { SRD_MONSTERS } from '../../monsters/srd-monsters';
import { BattleStore, fromMonster } from '../battle-store';
import { BATTLE_VIEW, BattleView } from '../battle-view';
import { confirm } from '../confirm';
import { cryptoRandom } from '../deck-view';
import type { PartyChecks } from '../dice-party';
import { EncounterBuilderModal, EncounterPicker } from '../encounter-builder';
import { newNote } from '../new-note';
import type { OwnMonsters } from '../own-monsters';
import type { Context } from './context';
import type { SpellLinker } from './spells';

export function registerBattle(
  ctx: Context,
  ownMonsters: OwnMonsters,
  spells: SpellLinker,
  party: PartyChecks,
): void {
  const { plugin, t } = ctx;
  const { app } = plugin;
  const monsters = () => [...SRD_MONSTERS, ...ownMonsters.list];
  const store = new BattleStore(plugin, ctx.cache, monsters);
  const views = () =>
    app.workspace
      .getLeavesOfType(BATTLE_VIEW)
      .map((leaf) => leaf.view)
      .filter((view) => view instanceof BattleView);

  plugin.registerView(
    BATTLE_VIEW,
    (leaf) =>
      new BattleView(leaf, {
        t,
        lang: ctx.lang,
        source: store,
        random: cryptoRandom,
        selected: () => ctx.settings().battleSelected,
        select: (battleSelected) => void ctx.save({ ...ctx.settings(), battleSelected }),
        openNote: (path) => ctx.openNote(path),
        spells,
        newEncounter: () => void newEncounter(),
        roll: (check, edge) => ctx.later.roll(check, edge),
        checks: (path) => party.checks(path),
        confirm: (title, text, ok) => confirm(app, t, title, text, ok),
        removeLog: () => void ctx.sessionLog.removeLines('battle'),
        log: (path, events) => {
          const file = app.vault.getFileByPath(path);
          if (file === null) return;
          const link = app.fileManager.generateMarkdownLink(file, '');
          const { experience, battleLog } = ctx.settings();
          for (const event of events) {
            ctx.sessionLog.offerLine(battleLine(event, link, experience), battleLog);
          }
        },
      }),
  );
  const openBattle = () => ctx.revealView(BATTLE_VIEW);
  plugin.addCommand({
    id: 'open-battle-tracker',
    name: t('command.openBattle'),
    callback: openBattle,
  });
  plugin.addRibbonIcon('swords', t('command.openBattle'), () => void openBattle());

  const newEncounter = async () =>
    new EncounterBuilderModal(app, {
      t,
      lang: ctx.lang(),
      monsters: monsters(),
      party: await store.party(),
      experience: ctx.settings().experience,
      create: async (draft) => {
        const folder = ctx.settings().encounterFolder;
        const path = await newNote(app, ctx.cache, folder, draft.name, encounterNoteText(draft));
        new Notice(t('encounterBuilder.created', { path }));
        await ctx.indexed(path);
        await openBattle();
        for (const view of views()) await view.show(path);
      },
    }).open();
  plugin.addCommand({
    id: 'remove-battle-lines',
    name: t('log.removeBattle'),
    callback: () => void ctx.sessionLog.removeLines('battle'),
  });
  plugin.addCommand({
    id: 'new-encounter',
    name: t('command.newEncounter'),
    callback: () => void newEncounter(),
  });

  ctx.later.addToCombat = (monster) => {
    const running = views().some((view) => view.add(fromMonster(monster, null, 'enemy')));
    if (!running) new Notice(t('battle.noFight'));
  };
  ctx.later.addToEncounter = (monster) =>
    void store.encounters().then((encounters) => {
      if (encounters.length === 0) {
        new Notice(t('encounterBuilder.noEncounters'));
        return;
      }
      new EncounterPicker(app, t, encounters, (encounter) => {
        void store.addToEncounter(encounter.path, monster.name).then(() => {
          new Notice(
            t('encounterBuilder.addedTo', { name: monster.name, encounter: encounter.title }),
          );
        });
      }).open();
    });
}
