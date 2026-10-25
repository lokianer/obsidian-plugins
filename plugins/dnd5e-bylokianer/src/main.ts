import {
  getLanguage,
  MarkdownRenderChild,
  MarkdownRenderer,
  MarkdownView,
  Notice,
  parseYaml,
  Plugin,
} from 'obsidian';

import type { EditTarget, FactionWorld } from './factions/model';

import { createT } from './i18n/strings';
import { BLOCK, convertBlocks, parseStatblock } from './npc/statblock';
import { CardManager } from './obsidian/card-view';
import { encounterNoteText } from './battle/budget';
import { battleLine } from './battle/log';
import { EncounterBuilderModal, EncounterPicker } from './obsidian/encounter-builder';
import { BattleStore, fromMonster } from './obsidian/battle-store';
import { BATTLE_VIEW, BattleView } from './obsidian/battle-view';
import { askReset, DeckBuilderModal } from './obsidian/deck-builder';
import { DeckStore } from './obsidian/deck-store';
import { cryptoRandom, DECK_VIEW, DeckView } from './obsidian/deck-view';
import { DEFAULT_SETTINGS, type Settings, SettingsTab } from './obsidian/settings';
import { WarningsModal } from './obsidian/warnings-modal';
import { ModeStore } from './obsidian/mode-store';
import { SessionLog } from './obsidian/session-log';
import { NoteStatblocks } from './obsidian/note-statblocks';
import { NpcBuilder } from './obsidian/npc-builder';
import { tableLang } from './obsidian/npc-modal';
import { newNote } from './obsidian/new-note';
import { MonsterBuilderModal } from './obsidian/monster-builder';
import { MONSTER_VIEW, MonsterManualView } from './obsidian/monster-manual-view';
import { OwnMonsters } from './obsidian/own-monsters';
import { monsterNoteText, statblockYaml } from './monsters/draft';
import { ownIndex as ownMonsterIndex } from './monsters/own';
import { SRD_MONSTERS } from './monsters/srd-monsters';
import { OwnSpells } from './obsidian/own-spells';
import { SpellBuilderModal } from './obsidian/spell-builder';
import type { SrdMonster } from './monsters/model';
import { spellNoteText } from './spells/draft';
import { ownIndex } from './spells/own';
import { linkSpells } from './obsidian/spell-links';
import { SPELLBOOK_VIEW, SpellbookView } from './obsidian/spellbook-view';
import { spellFinder } from './spells/links';
import { SRD_SPELLS } from './spells/srd-spells';
import { statblockEdits } from './obsidian/statblock-edits';
import { renderFolded, renderInvalid } from './obsidian/statblock-view';
import { TENSION_VIEW, TensionView } from './obsidian/tension-view';
import { WorldCache } from './obsidian/world-cache';
import { WORLD_VIEW, WorldView } from './obsidian/world-view';

export default class Dnd5ePlugin extends Plugin {
  private options: Settings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    const t = createT(getLanguage());
    this.options = {
      ...DEFAULT_SETTINGS,
      ...((await this.loadData()) as Partial<Settings> | null),
    };
    const cache = new WorldCache(this);
    const statblocks = new NoteStatblocks(this);
    const cards = new CardManager(
      this,
      cache,
      t,
      () => this.options,
      (change) => sessionLog.offer(change),
      statblocks,
      (faction) => void npcs.newNpc(faction),
    );
    cards.start();

    const modes = new ModeStore();
    const sessionLog = new SessionLog(
      this,
      cache,
      t,
      () => this.options,
      (s) => save(s),
    );
    const save = async (settings: Settings) => {
      this.options = settings;
      await this.saveData(settings);
      cards.refreshAll();
      for (const leaf of this.app.workspace.getLeavesOfType(TENSION_VIEW)) {
        if (leaf.view instanceof TensionView) leaf.view.refresh();
      }
    };
    this.addSettingTab(new SettingsTab(this.app, this, t, () => this.options, save));

    const showWarnings = (world: FactionWorld) => {
      new WarningsModal(this.app, world, t, (warning, newLeaf) => {
        void cards.open(warning.path, { warning }, newLeaf);
      }).open();
    };
    this.addCommand({
      id: 'show-faction-warnings',
      name: t('command.showWarnings'),
      callback: async () => showWarnings(await cache.rebuild()),
    });

    const openNote = (path: string, newLeaf: boolean) => {
      const file = this.app.vault.getFileByPath(path);
      if (file !== null) void cards.leafFor(newLeaf).openFile(file);
    };
    const editValue = (edit: EditTarget, newLeaf: boolean) =>
      void cards.open(edit.path, { entry: { field: edit.field, target: edit.target } }, newLeaf);
    const showTensions = async () => {
      const { workspace } = this.app;
      const leaf = workspace.getLeavesOfType(TENSION_VIEW)[0] ?? workspace.getRightLeaf(false);
      if (leaf === null) return;
      await leaf.setViewState({ type: TENSION_VIEW, active: true });
      await workspace.revealLeaf(leaf);
    };
    this.registerView(
      TENSION_VIEW,
      (leaf) =>
        new TensionView(leaf, {
          cache,
          modes,
          t,
          thresholds: () => this.options.thresholds,
          openNote,
          editValue,
        }),
    );
    this.addCommand({
      id: 'show-faction-tensions',
      name: t('command.showTensions'),
      callback: showTensions,
    });

    this.registerView(
      WORLD_VIEW,
      (leaf) =>
        new WorldView(leaf, {
          cache,
          modes,
          t,
          settings: () => this.options,
          save,
          openNote,
          editValue,
          sessionLog,
          statblocks,
          showWarnings,
          showTensions: () => void showTensions(),
        }),
    );
    const openWorld = async () => {
      const { workspace } = this.app;
      const leaf = workspace.getLeavesOfType(WORLD_VIEW)[0] ?? workspace.getLeaf('tab');
      await leaf.setViewState({ type: WORLD_VIEW, active: true });
      await workspace.revealLeaf(leaf);
    };
    this.addCommand({
      id: 'open-faction-world',
      name: t('command.openWorld'),
      callback: openWorld,
    });
    this.addRibbonIcon('network', t('command.openWorld'), () => void openWorld());

    const ownSpells = new OwnSpells(this);
    this.app.workspace.onLayoutReady(() => void ownSpells.reload());
    let finder: ReturnType<typeof spellFinder> | null = null;
    ownSpells.onChange(() => (finder = null));
    const findSpells = (text: string) => {
      finder ??= spellFinder([...SRD_SPELLS, ...ownSpells.list]);
      return finder(text);
    };
    this.registerView(
      SPELLBOOK_VIEW,
      (leaf) =>
        new SpellbookView(leaf, {
          t,
          lang: () => tableLang(this.options, getLanguage()),
          state: () => this.options.spellbook,
          saveState: (spellbook) => void save({ ...this.options, spellbook }),
          own: () => ownSpells.list,
          onOwnChange: (listener) => ownSpells.onChange(listener),
          openNote: (path) => openNote(path, false),
          newSpell: () => newSpell(),
        }),
    );
    const openSpellbook = async () => {
      const { workspace } = this.app;
      const leaf = workspace.getLeavesOfType(SPELLBOOK_VIEW)[0] ?? workspace.getLeaf('tab');
      await leaf.setViewState({ type: SPELLBOOK_VIEW, active: true });
      await workspace.revealLeaf(leaf);
    };
    this.addCommand({
      id: 'open-spellbook',
      name: t('command.openSpellbook'),
      callback: openSpellbook,
    });
    this.addRibbonIcon('book-open', t('command.openSpellbook'), () => void openSpellbook());
    const openSpell = async (index: string) => {
      await openSpellbook();
      for (const leaf of this.app.workspace.getLeavesOfType(SPELLBOOK_VIEW)) {
        if (leaf.view instanceof SpellbookView) leaf.view.show(index);
      }
    };
    /** Resolves once a new note's metadata is there (or after two seconds). */
    const indexed = (path: string) =>
      new Promise<void>((resolve) => {
        const ref = this.app.metadataCache.on('changed', (file) => {
          if (file.path !== path) return;
          this.app.metadataCache.offref(ref);
          resolve();
        });
        window.setTimeout(resolve, 2000);
      });
    const newSpell = () =>
      new SpellBuilderModal(this.app, {
        t,
        lang: tableLang(this.options, getLanguage()),
        spells: SRD_SPELLS,
        create: async (draft) => {
          const path = await newNote(
            this.app,
            cache,
            this.options.spellFolder,
            draft.name,
            spellNoteText(draft),
          );
          new Notice(t('spellBuilder.created', { path }));
          // The new note's metadata first, then the spellbook can show it.
          await indexed(path);
          await ownSpells.reload();
          await openSpell(ownIndex(path));
        },
      }).open();
    this.addCommand({ id: 'new-spell', name: t('command.newSpell'), callback: newSpell });

    // The note a monster goes into: the last Markdown note the GM was in.
    let lastNote: MarkdownView | null = null;
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', (leaf) => {
        if (leaf?.view instanceof MarkdownView) lastNote = leaf.view;
      }),
    );
    const fence = (monster: SrdMonster) => `\`\`\`${BLOCK}\n${monster.yaml}\n\`\`\``;
    const ownMonsters = new OwnMonsters(this);
    this.app.workspace.onLayoutReady(() => void ownMonsters.reload());
    this.registerView(
      MONSTER_VIEW,
      (leaf) =>
        new MonsterManualView(leaf, {
          t,
          lang: () => tableLang(this.options, getLanguage()),
          state: () => this.options.monsterManual,
          saveState: (monsterManual) => void save({ ...this.options, monsterManual }),
          spells: (target) => linkSpells(target, findSpells, (index) => void openSpell(index)),
          insert: (monster) => {
            const file = lastNote?.file ?? null;
            if (lastNote === null || file === null) {
              new Notice(t('monsters.noNote'));
              return;
            }
            const line = lastNote.editor.getCursor().line;
            void this.app.vault
              .process(file, (text) => {
                const lines = text.split('\n');
                lines.splice(line + 1, 0, '', fence(monster), '');
                return lines.join('\n');
              })
              .then(
                () =>
                  new Notice(t('monsters.inserted', { name: monster.name, note: file.basename })),
              );
          },
          own: () => ownMonsters.list,
          onOwnChange: (listener) => ownMonsters.onChange(listener),
          openNote: (path) => openNote(path, false),
          newMonster: () => newMonster(),
          addToCombat: (monster) => {
            const running = this.app.workspace
              .getLeavesOfType(BATTLE_VIEW)
              .map((leaf) => leaf.view)
              .some(
                (view) =>
                  view instanceof BattleView && view.add(fromMonster(monster, null, 'enemy')),
              );
            if (!running) new Notice(t('battle.noFight'));
          },
          addToEncounter: (monster) =>
            void battleStore.encounters().then((encounters) => {
              if (encounters.length === 0) {
                new Notice(t('encounterBuilder.noEncounters'));
                return;
              }
              new EncounterPicker(this.app, t, encounters, (encounter) => {
                void battleStore.addToEncounter(encounter.path, monster.name).then(() => {
                  new Notice(
                    t('encounterBuilder.addedTo', {
                      name: monster.name,
                      encounter: encounter.title,
                    }),
                  );
                });
              }).open();
            }),
          makeNote: (monster) =>
            void (async () => {
              const text = monsterNoteText(monster.name, monster.cr, monster.yaml, BLOCK);
              const path = await newNote(
                this.app,
                cache,
                this.options.monsterFolder,
                monster.name,
                text,
              );
              new Notice(t('monsters.created', { path }));
              openStatblocks.add(path);
              openNote(path, false);
            })(),
        }),
    );
    const openMonsters = async () => {
      const { workspace } = this.app;
      const leaf = workspace.getLeavesOfType(MONSTER_VIEW)[0] ?? workspace.getLeaf('tab');
      await leaf.setViewState({ type: MONSTER_VIEW, active: true });
      await workspace.revealLeaf(leaf);
    };
    this.addCommand({
      id: 'open-monster-manual',
      name: t('command.openMonsters'),
      callback: openMonsters,
    });
    this.addRibbonIcon('skull', t('command.openMonsters'), () => void openMonsters());
    const newMonster = () =>
      new MonsterBuilderModal(this.app, {
        t,
        lang: tableLang(this.options, getLanguage()),
        monsters: SRD_MONSTERS,
        createAll: async (blocks) => {
          for (const block of blocks) {
            const name = (block.name ?? '').trim();
            const text = monsterNoteText(name, block.cr, statblockYaml(block), BLOCK);
            await newNote(this.app, cache, this.options.monsterFolder, name, text);
          }
          new Notice(
            t('monsterBuilder.import.done', {
              count: blocks.length,
              folder: this.options.monsterFolder,
            }),
          );
          await ownMonsters.reload();
          await openMonsters();
        },
        create: async (block) => {
          const name = (block.name ?? '').trim();
          const text = monsterNoteText(name, block.cr, statblockYaml(block), BLOCK);
          const path = await newNote(this.app, cache, this.options.monsterFolder, name, text);
          new Notice(t('monsters.created', { path }));
          await indexed(path);
          await ownMonsters.reload();
          await openMonsters();
          for (const leaf of this.app.workspace.getLeavesOfType(MONSTER_VIEW)) {
            if (leaf.view instanceof MonsterManualView) leaf.view.show(ownMonsterIndex(path));
          }
        },
      }).open();
    this.addCommand({ id: 'new-monster', name: t('command.newMonster'), callback: newMonster });

    const deckStore = new DeckStore(
      this,
      cache,
      t,
      () => this.options,
      (path) => openNote(path, false),
    );
    const deckViews = () =>
      this.app.workspace
        .getLeavesOfType(DECK_VIEW)
        .map((leaf) => leaf.view)
        .filter((view) => view instanceof DeckView);
    const newDeck = () =>
      new DeckBuilderModal(this.app, {
        t,
        lang: tableLang(this.options, getLanguage()),
        create: async (deck) => {
          const path = await deckStore.create(deck);
          await openDeck();
          for (const view of deckViews()) await view.show(path);
        },
      }).open();
    this.registerView(
      DECK_VIEW,
      (leaf) =>
        new DeckView(leaf, {
          t,
          lang: () => tableLang(this.options, getLanguage()),
          source: deckStore,
          random: cryptoRandom,
          selected: () => this.options.deckSelected,
          select: (deckSelected) => void save({ ...this.options, deckSelected }),
          newDeck,
          confirmReset: () => askReset(this.app, t),
        }),
    );
    // A deck note edited by hand (a card ticked or unticked) shows in the open tab.
    this.registerEvent(
      this.app.metadataCache.on('changed', (_file, _data, meta) => {
        if (meta.frontmatter?.type !== 'deck') return;
        for (const view of deckViews()) void view.refresh();
      }),
    );
    const openDeck = async () => {
      const { workspace } = this.app;
      const leaf = workspace.getLeavesOfType(DECK_VIEW)[0] ?? workspace.getLeaf('tab');
      await leaf.setViewState({ type: DECK_VIEW, active: true });
      await workspace.revealLeaf(leaf);
    };
    this.addCommand({
      id: 'open-deck-of-many-things',
      name: t('command.openDeck'),
      callback: openDeck,
    });
    this.addRibbonIcon('layers', t('command.openDeck'), () => void openDeck());
    this.addCommand({ id: 'new-deck', name: t('command.newDeck'), callback: newDeck });

    const battleStore = new BattleStore(this, cache, () => [...SRD_MONSTERS, ...ownMonsters.list]);
    this.registerView(
      BATTLE_VIEW,
      (leaf) =>
        new BattleView(leaf, {
          t,
          lang: () => tableLang(this.options, getLanguage()),
          source: battleStore,
          random: cryptoRandom,
          selected: () => this.options.battleSelected,
          select: (battleSelected) => void save({ ...this.options, battleSelected }),
          openNote: (path) => openNote(path, false),
          spells: (target) => linkSpells(target, findSpells, (index) => void openSpell(index)),
          newEncounter: () => void newEncounter(),
          log: (path, events) => {
            const file = this.app.vault.getFileByPath(path);
            if (file === null) return;
            const link = this.app.fileManager.generateMarkdownLink(file, '');
            for (const event of events) {
              sessionLog.offerLine(battleLine(event, link, this.options.experience));
            }
          },
        }),
    );
    const openBattle = async () => {
      const { workspace } = this.app;
      const leaf = workspace.getLeavesOfType(BATTLE_VIEW)[0] ?? workspace.getLeaf('tab');
      await leaf.setViewState({ type: BATTLE_VIEW, active: true });
      await workspace.revealLeaf(leaf);
    };
    this.addCommand({
      id: 'open-battle-tracker',
      name: t('command.openBattle'),
      callback: openBattle,
    });
    this.addRibbonIcon('swords', t('command.openBattle'), () => void openBattle());
    const newEncounter = async () =>
      new EncounterBuilderModal(this.app, {
        t,
        lang: tableLang(this.options, getLanguage()),
        monsters: [...SRD_MONSTERS, ...ownMonsters.list],
        party: await battleStore.party(),
        experience: this.options.experience,
        create: async (draft) => {
          const path = await newNote(
            this.app,
            cache,
            this.options.encounterFolder,
            draft.name,
            encounterNoteText(draft),
          );
          new Notice(t('encounterBuilder.created', { path }));
          await indexed(path);
          await openBattle();
          for (const leaf of this.app.workspace.getLeavesOfType(BATTLE_VIEW)) {
            if (leaf.view instanceof BattleView) await leaf.view.show(path);
          }
        },
      }).open();
    this.addCommand({
      id: 'new-encounter',
      name: t('command.newEncounter'),
      callback: () => void newEncounter(),
    });

    const openStatblocks = new Set<string>();
    this.registerMarkdownCodeBlockProcessor(BLOCK, (source, el, ctx) => {
      let data: unknown;
      try {
        data = parseYaml(source);
      } catch {
        renderInvalid(el, source, t);
        return;
      }
      const child = new MarkdownRenderChild(el);
      ctx.addChild(child);
      const file = this.app.vault.getFileByPath(ctx.sourcePath);
      renderFolded(el, parseStatblock(data), {
        edit:
          file === null
            ? undefined
            : statblockEdits(this.app, file, t, () => ctx.getSectionInfo(el)?.lineStart ?? null),
        t,
        markdown: (markdown, target) =>
          MarkdownRenderer.render(this.app, markdown, target, ctx.sourcePath, child),
        spells: (target) => linkSpells(target, findSpells, (index) => void openSpell(index)),
        // Open or folded per note, for as long as Obsidian runs.
        open: openStatblocks.has(ctx.sourcePath),
        toggle: (open) => {
          if (open) openStatblocks.add(ctx.sourcePath);
          else openStatblocks.delete(ctx.sourcePath);
        },
      });
    });
    this.addCommand({
      id: 'convert-statblock',
      name: t('command.convertStatblock'),
      callback: async () => {
        const file = this.app.workspace.getActiveFile();
        if (file === null) return;
        let count = 0;
        await this.app.vault.process(file, (text) => {
          const converted = convertBlocks(text);
          count = converted.count;
          return converted.text;
        });
        new Notice(count === 0 ? t('notice.noStatblock') : t('notice.converted', { count }));
      },
    });

    const npcs = new NpcBuilder(
      this,
      cache,
      t,
      () => this.options,
      (path) => openNote(path, false),
      (path) => openStatblocks.add(path),
    );
    this.addCommand({
      id: 'new-npc',
      name: t('command.newNpc'),
      callback: () => void npcs.newNpc(),
    });
    this.addCommand({
      id: 'new-archetype',
      name: t('command.newArchetype'),
      callback: () => void npcs.newArchetype(),
    });
    this.addCommand({
      id: 'new-race',
      name: t('command.newRace'),
      callback: () => void npcs.newRace(),
    });
    this.addCommand({
      id: 'add-statblock',
      name: t('command.addStatblock'),
      callback: () => void npcs.addStatblock(),
    });

    this.addCommand({
      id: 'start-next-session',
      name: t('command.nextSession'),
      callback: async () => {
        const path = await sessionLog.startNext();
        if (path !== null) openNote(path, false);
      },
    });

    this.addCommand({
      id: 'edit-faction-data',
      name: t('command.editCard'),
      callback: async () => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        await cache.get();
        if (view === null || !cards.hasCard(view)) {
          new Notice(t('notice.notEntity'));
          return;
        }
        if (await cards.reveal(view)) cards.focusActive(view);
      },
    });
  }
}
