// The factions module: settings, the warnings, the tension panel, the faction world, editing the
// card from the command palette, and starting the next session.

import { MarkdownView, Notice } from 'obsidian';

import type { EditTarget, FactionWorld } from '../../factions/model';
import { ModeStore } from '../mode-store';
import { SettingsTab } from '../settings';
import { TENSION_VIEW, TensionView } from '../tension-view';
import { WarningsModal } from '../warnings-modal';
import { WORLD_VIEW, WorldView } from '../world-view';
import type { Context } from './context';

export function registerFactions(ctx: Context): void {
  const { plugin, t, cache, cards } = ctx;
  const { app } = plugin;
  plugin.addSettingTab(new SettingsTab(app, plugin, t, ctx.settings, ctx.save));

  const showWarnings = (world: FactionWorld) => {
    new WarningsModal(app, world, t, (warning, newLeaf) => {
      void cards.open(warning.path, { warning }, newLeaf);
    }).open();
  };
  plugin.addCommand({
    id: 'show-faction-warnings',
    name: t('command.showWarnings'),
    callback: async () => showWarnings(await cache.rebuild()),
  });

  const modes = new ModeStore();
  const editValue = (edit: EditTarget, newLeaf: boolean) =>
    void cards.open(edit.path, { entry: { field: edit.field, target: edit.target } }, newLeaf);
  const showTensions = () => ctx.revealView(TENSION_VIEW, 'right');
  plugin.registerView(
    TENSION_VIEW,
    (leaf) =>
      new TensionView(leaf, {
        cache,
        modes,
        t,
        thresholds: () => ctx.settings().thresholds,
        openNote: ctx.openNote,
        editValue,
      }),
  );
  plugin.addCommand({
    id: 'show-faction-tensions',
    name: t('command.showTensions'),
    callback: showTensions,
  });

  plugin.registerView(
    WORLD_VIEW,
    (leaf) =>
      new WorldView(leaf, {
        cache,
        modes,
        t,
        settings: ctx.settings,
        save: ctx.save,
        openNote: ctx.openNote,
        editValue,
        sessionLog: ctx.sessionLog,
        statblocks: ctx.statblocks,
        showWarnings,
        showTensions: () => void showTensions(),
      }),
  );
  const openWorld = () => ctx.revealView(WORLD_VIEW);
  plugin.addCommand({
    id: 'open-faction-world',
    name: t('command.openWorld'),
    callback: openWorld,
  });
  plugin.addRibbonIcon('network', t('command.openWorld'), () => void openWorld());

  plugin.addCommand({
    id: 'start-next-session',
    name: t('command.nextSession'),
    callback: async () => {
      const path = await ctx.sessionLog.startNext();
      if (path !== null) ctx.openNote(path);
    },
  });
  plugin.addCommand({
    id: 'edit-faction-data',
    name: t('command.editCard'),
    callback: async () => {
      const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
      await cache.get();
      if (view === null || !cards.hasCard(view)) {
        new Notice(t('notice.notEntity'));
        return;
      }
      if (await cards.reveal(view)) cards.focusActive(view);
    },
  });
}
