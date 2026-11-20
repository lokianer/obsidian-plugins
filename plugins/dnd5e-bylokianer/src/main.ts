import { Plugin } from 'obsidian';

import { Library } from './obsidian/library';
import { createContext } from './obsidian/register/context';
import { registerBattle } from './obsidian/register/battle';
import { registerDeck } from './obsidian/register/deck';
import { registerDice } from './obsidian/register/dice';
import { registerFactions } from './obsidian/register/factions';
import { registerMonsters } from './obsidian/register/monsters';
import { registerNpcs } from './obsidian/register/npcs';
import { registerSpells } from './obsidian/register/spells';
import { registerStatblocks } from './obsidian/register/statblocks';
import { DEFAULT_SETTINGS, type Settings } from './obsidian/settings';

export default class Dnd5ePlugin extends Plugin {
  private options: Settings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    this.options = {
      ...DEFAULT_SETTINGS,
      ...((await this.loadData()) as Partial<Settings> | null),
    };
    const ctx = createContext(
      this,
      () => this.options,
      async (settings) => {
        this.options = settings;
        await this.saveData(settings);
      },
    );
    ctx.cards.start();

    // In this order the ribbon shows world, spellbook, Monster Manual, deck, dice, battle.
    registerFactions(ctx);
    // The GM's library notes: the full texts of the catalogue's spells and monsters.
    const library = new Library(this);
    this.app.workspace.onLayoutReady(() => void library.reload());
    const spells = registerSpells(ctx, library);
    const monsters = registerMonsters(ctx, spells, library);
    registerDeck(ctx);
    const party = registerDice(ctx);
    registerBattle(ctx, monsters, spells, party);
    registerStatblocks(ctx, spells);
    registerNpcs(ctx);
  }
}
