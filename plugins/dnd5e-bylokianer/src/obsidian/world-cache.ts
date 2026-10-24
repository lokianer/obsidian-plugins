// The faction world, built once and rebuilt only after the vault's metadata changed — never per
// keystroke, never per card. Listeners hear about each rebuild.

import { debounce, type Plugin } from 'obsidian';

import type { FactionWorld } from '../factions/model';
import { buildWorld } from '../factions/world';
import { collectNotes } from './notes';

const REBUILD_DELAY = 250;

export class WorldCache {
  private world: FactionWorld | null = null;
  private building: Promise<FactionWorld> | null = null;
  private readonly listeners = new Set<(world: FactionWorld) => void>();
  private readonly schedule = debounce(() => void this.rebuild(), REBUILD_DELAY, true);

  constructor(private readonly plugin: Plugin) {
    const { app } = plugin;
    plugin.registerEvent(app.metadataCache.on('changed', () => this.schedule()));
    plugin.registerEvent(app.metadataCache.on('deleted', () => this.schedule()));
    plugin.registerEvent(app.metadataCache.on('resolved', () => this.schedule()));
    plugin.registerEvent(app.vault.on('rename', () => this.schedule()));
  }

  /** The last world built, or null before the first build. */
  get current(): FactionWorld | null {
    return this.world;
  }

  /** The current world, building it first if there is none yet. */
  async get(): Promise<FactionWorld> {
    return this.world ?? (await this.rebuild());
  }

  onChange(listener: (world: FactionWorld) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async rebuild(): Promise<FactionWorld> {
    this.building ??= (async () => {
      try {
        const world = buildWorld(await collectNotes(this.plugin.app));
        this.world = world;
        for (const listener of this.listeners) {
          listener(world);
        }
        return world;
      } finally {
        this.building = null;
      }
    })();
    return this.building;
  }
}
