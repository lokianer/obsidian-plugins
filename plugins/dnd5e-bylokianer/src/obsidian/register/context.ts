// What every module's registration shares: the plugin, the interface strings, the settings, the
// faction world, the session log, the cards (which open notes), and a few helpers. Modules that
// need one registered after them (the Monster Manual needs the battle tracker, the cards the NPC
// builder, every stat block the dice) reach it through `later`, which that module fills in.

import { getLanguage, type Plugin } from 'obsidian';

import type { Check } from '../../dice/checks';
import type { Edge } from '../../dice/formula';
import { createT, type T } from '../../i18n/strings';
import type { SrdMonster } from '../../monsters/model';
import type { Lang } from '../../npc/races';
import { CardManager } from '../card-view';
import { tableLang } from '../npc-modal';
import { NoteStatblocks } from '../note-statblocks';
import { SessionLog } from '../session-log';
import type { Settings } from '../settings';
import { TENSION_VIEW, TensionView } from '../tension-view';
import { WorldCache } from '../world-cache';

/** Filled in by the module that owns each; until then a call does nothing. */
export interface Later {
  roll: (check: Check, edge: Edge) => void;
  newNpc: (faction?: string) => void;
  addToCombat: (monster: SrdMonster) => void;
  addToEncounter: (monster: SrdMonster) => void;
}

export interface Context {
  plugin: Plugin;
  t: T;
  /** The language of the interface. */
  uiLang: Lang;
  /** The language of names and texts (the dice-text setting). */
  lang: () => Lang;
  settings: () => Settings;
  save: (settings: Settings) => Promise<void>;
  cache: WorldCache;
  sessionLog: SessionLog;
  statblocks: NoteStatblocks;
  cards: CardManager;
  /** Stat blocks shown open, per note, for as long as Obsidian runs. */
  openStatblocks: Set<string>;
  later: Later;
  openNote: (path: string, newLeaf?: boolean) => void;
  /** Opens a view of this type (the one already open, else a new tab or the right sidebar). */
  revealView: (type: string, where?: 'tab' | 'right') => Promise<void>;
  /** Resolves once a new note's metadata is there (or after two seconds). */
  indexed: (path: string) => Promise<void>;
}

export function createContext(
  plugin: Plugin,
  settings: () => Settings,
  store: (settings: Settings) => Promise<void>,
): Context {
  const { app } = plugin;
  const t = createT(getLanguage());
  const later: Later = {
    roll: () => undefined,
    newNpc: () => undefined,
    addToCombat: () => undefined,
    addToEncounter: () => undefined,
  };
  const cache = new WorldCache(plugin);
  const statblocks = new NoteStatblocks(plugin);
  const save = async (next: Settings) => {
    await store(next);
    cards.refreshAll();
    for (const leaf of app.workspace.getLeavesOfType(TENSION_VIEW)) {
      if (leaf.view instanceof TensionView) leaf.view.refresh();
    }
  };
  const sessionLog = new SessionLog(plugin, cache, t, settings, save);
  const cards = new CardManager(
    plugin,
    cache,
    t,
    settings,
    (change) => sessionLog.offer(change),
    statblocks,
    (faction) => later.newNpc(faction),
  );
  return {
    plugin,
    t,
    uiLang: getLanguage() === 'de' ? 'de' : 'en',
    lang: () => tableLang(settings(), getLanguage()),
    settings,
    save,
    cache,
    sessionLog,
    statblocks,
    cards,
    openStatblocks: new Set(),
    later,
    openNote: (path, newLeaf = false) => {
      const file = app.vault.getFileByPath(path);
      if (file !== null) void cards.leafFor(newLeaf).openFile(file);
    },
    revealView: async (type, where = 'tab') => {
      const { workspace } = app;
      const leaf =
        workspace.getLeavesOfType(type)[0] ??
        (where === 'right' ? workspace.getRightLeaf(false) : workspace.getLeaf('tab'));
      if (leaf === null) return;
      await leaf.setViewState({ type, active: true });
      await workspace.revealLeaf(leaf);
    },
    indexed: (path) =>
      new Promise<void>((resolve) => {
        const ref = app.metadataCache.on('changed', (file) => {
          if (file.path !== path) return;
          app.metadataCache.offref(ref);
          resolve();
        });
        window.setTimeout(resolve, 2000);
      }),
  };
}
