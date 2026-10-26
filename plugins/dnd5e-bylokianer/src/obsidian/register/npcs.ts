// The NPC builder: New NPC (also from a faction card), New archetype, New race, Add stat block.

import type { StringKey } from '../../i18n/strings';
import { NpcBuilder } from '../npc-builder';
import type { Context } from './context';

export function registerNpcs(ctx: Context): void {
  const { plugin, t } = ctx;
  const npcs = new NpcBuilder(
    plugin,
    ctx.cache,
    t,
    ctx.settings,
    (path) => ctx.openNote(path),
    (path) => ctx.openStatblocks.add(path),
  );
  ctx.later.newNpc = (faction) => void npcs.newNpc(faction);
  const commands: [string, StringKey, () => Promise<unknown>][] = [
    ['new-npc', 'command.newNpc', () => npcs.newNpc()],
    ['new-archetype', 'command.newArchetype', () => npcs.newArchetype()],
    ['new-race', 'command.newRace', () => npcs.newRace()],
    ['add-statblock', 'command.addStatblock', () => npcs.addStatblock()],
  ];
  for (const [id, name, run] of commands) {
    plugin.addCommand({ id, name: t(name), callback: () => void run() });
  }
}
