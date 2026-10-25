// The Battle tab's adapter to the vault: lists the campaign's encounter notes, turns an encounter's
// combatants into fighters — the party from the campaign, notes by their frontmatter or stat block,
// monsters from the Monster Manual, inline ones as written — and keeps the running fight in the
// note's `## Combat` section through vault.process.

import { parseYaml, type Plugin, TFile } from 'obsidian';

import { type CombatantSpec, readEncounter, type Side } from '../battle/encounter';
import type { Fight, Fighter } from '../battle/fight';
import { combatLines, readCombat, type Table, withCombat } from '../battle/table';
import { inCampaign, typeOf } from '../campaign/scope';
import { PARTY } from '../factions/discover';
import { monsterName } from '../monsters/meta';
import type { SrdMonster } from '../monsters/model';
import { findStatblocks, modifier, parseStatblock, type Statblock } from '../npc/statblock';
import type { WorldCache } from './world-cache';

export interface EncounterInfo {
  path: string;
  title: string;
}

/** What the Battle tab needs from the vault. */
export interface BattleSource {
  encounters(): Promise<EncounterInfo[]>;
  /** The fighters an encounter lists (with the party), and the fight its note holds, if any. */
  load(path: string): Promise<{ fighters: Fighter[]; table: Table | null }>;
  save(path: string, fight: Fight, ended: boolean): Promise<void>;
  /** The stat block shown on a combatant's card: its monster's, or its note's first. */
  statblock(fighter: Fighter): Promise<Statblock | null>;
}

const num = (v: unknown): number | null => {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v.trim()) : NaN;
  return Number.isFinite(n) ? n : null;
};

export class BattleStore implements BattleSource {
  constructor(
    private readonly plugin: Plugin,
    private readonly cache: WorldCache,
    private readonly monsters: () => readonly SrdMonster[],
  ) {}

  async encounters(): Promise<EncounterInfo[]> {
    const { vault, metadataCache } = this.plugin.app;
    const { campaign } = await this.cache.get();
    return vault
      .getMarkdownFiles()
      .filter((f) => campaign === null || inCampaign(campaign, f.path))
      .filter((f) => typeOf(metadataCache.getFileCache(f)?.frontmatter) === 'encounter')
      .map((f) => ({ path: f.path, title: f.basename }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  async load(path: string): Promise<{ fighters: Fighter[]; table: Table | null }> {
    const { vault, metadataCache } = this.plugin.app;
    const file = vault.getFileByPath(path);
    if (file === null) return { fighters: [], table: null };
    const spec = readEncounter(metadataCache.getFileCache(file)?.frontmatter);
    const fighters: Fighter[] = [];
    const party = new Set<string>();
    if (spec.party) {
      const world = await this.cache.get();
      for (const e of world.entities.values()) {
        if (e.kind !== 'character' || e.parent !== PARTY || e.notePath === null) continue;
        const pc = vault.getFileByPath(e.notePath);
        if (pc === null) continue;
        party.add(pc.path);
        fighters.push({ ...(await this.fromNote(pc, 'party')), pc: true });
      }
    }
    for (const s of spec.combatants) {
      for (const f of await this.resolve(s, file, party)) fighters.push(f);
    }
    return { fighters, table: readCombat(await vault.cachedRead(file)) };
  }

  async save(path: string, fight: Fight, ended: boolean): Promise<void> {
    const file = this.plugin.app.vault.getFileByPath(path);
    if (file === null) return;
    await this.plugin.app.vault.process(file, (text) =>
      withCombat(text, combatLines(fight, ended)),
    );
  }

  async statblock(fighter: Fighter): Promise<Statblock | null> {
    if (fighter.monster !== null) {
      const m = this.monsters().find((x) => x.index === fighter.monster);
      return m === undefined ? null : parseStatblock(parseYaml(m.yaml));
    }
    if (fighter.path === null) return null;
    const file = this.plugin.app.vault.getFileByPath(fighter.path);
    if (file === null) return null;
    const found = findStatblocks(await this.plugin.app.vault.cachedRead(file))[0];
    if (found === undefined) return null;
    try {
      return parseStatblock(parseYaml(found.source));
    } catch {
      return null;
    }
  }

  /** One encounter entry as fighters, `count` of them in a group. */
  private async resolve(s: CombatantSpec, from: TFile, party: Set<string>): Promise<Fighter[]> {
    const { metadataCache } = this.plugin.app;
    let one: Fighter;
    if (s.kind === 'note') {
      const file = metadataCache.getFirstLinkpathDest(s.link, from.path);
      if (file instanceof TFile) {
        // The party joined already.
        if (party.has(file.path)) return [];
        one = await this.fromNote(file, s.side ?? 'enemy');
      } else {
        one = plain(s.link, s.side ?? 'enemy');
      }
    } else if (s.kind === 'monster') {
      const key = s.monster.toLowerCase();
      const m = this.monsters().find(
        (x) => x.name.toLowerCase() === key || monsterName(x, 'de').toLowerCase() === key,
      );
      one =
        m === undefined
          ? plain(s.name ?? s.monster, s.side ?? 'enemy')
          : fromMonster(m, s.name, s.side ?? 'enemy');
    } else {
      one = {
        ...plain(s.name, s.side ?? 'enemy'),
        ac: s.ac,
        maxHp: Math.max(1, s.hp ?? 1),
        initBonus: s.initiative ?? 0,
      };
    }
    const group = s.count > 1 ? one.name : null;
    return Array.from({ length: s.count }, () => ({ ...one, group }));
  }

  /** A character or NPC note: its frontmatter's ac / hp / initiative, else its stat block's. */
  private async fromNote(file: TFile, side: Side): Promise<Fighter> {
    const fm = this.plugin.app.metadataCache.getFileCache(file)?.frontmatter ?? {};
    const block = await this.statblock({ ...plain(file.basename, side), path: file.path });
    const dex = block?.stats?.[1] ?? 10;
    const tags = Array.isArray(fm.tags) ? fm.tags.map(String) : [];
    return {
      name: file.basename,
      side,
      pc: side === 'party' || tags.includes('pc'),
      ac: num(fm.ac) ?? block?.ac ?? null,
      maxHp: Math.max(1, num(fm.hp) ?? block?.hp ?? 1),
      initBonus: num(fm.initiative) ?? modifier(dex),
      dex,
      path: file.path,
      monster: null,
      group: null,
    };
  }
}

const plain = (name: string, side: Side): Fighter => ({
  name,
  side,
  pc: false,
  ac: null,
  maxHp: 1,
  initBonus: 0,
  dex: 10,
  path: null,
  monster: null,
  group: null,
});

function fromMonster(m: SrdMonster, name: string | null, side: Side): Fighter {
  const block = parseStatblock(parseYaml(m.yaml));
  const dex = block.stats?.[1] ?? 10;
  return {
    name: name ?? m.name,
    side,
    pc: false,
    ac: m.ac,
    maxHp: Math.max(1, m.hp),
    initBonus: modifier(dex),
    dex,
    path: m.path ?? null,
    monster: m.index,
    group: null,
  };
}
