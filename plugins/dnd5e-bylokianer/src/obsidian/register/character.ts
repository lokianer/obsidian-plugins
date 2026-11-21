// Built characters and the character sheet. Whenever a character note with `levels` changes, its
// computed keys (class, level, AC, hit points, saves, skills …) are derived from its choices and
// written back, so the party, battle and dice modules and a reader without the plugin see current
// numbers; writing only when a key differs keeps the change event from looping. The sheet opens
// from a command or a character note's file menu.

import { loadRules, type Rules, SRD_52 } from '@obsidian-plugins/rules';
import { MarkdownRenderer, Notice, TFile } from 'obsidian';

import { characterNoteText } from '../../character/draft';
import { computedKeys, differs, readCharacter, sheetData } from '../../character/note';
import { CharacterBuilderModal } from '../character-builder';
import { CHARACTER_VIEW, CharacterSheetView } from '../character-sheet-view';
import { newNote } from '../new-note';
import { SRD_SPELLS } from '../../spells/srd-spells';
import type { Context } from './context';

export function registerCharacters(ctx: Context): void {
  const { plugin, t } = ctx;
  const { app } = plugin;
  let loaded: Rules | null = null;
  const rules = () => (loaded ??= loadRules([SRD_52]));
  const spellsById = new Map(SRD_SPELLS.map((s) => [s.index, s]));
  const frontmatter = (file: TFile) => app.metadataCache.getFileCache(file)?.frontmatter;

  plugin.registerEvent(
    app.metadataCache.on('changed', (file, _data, cache) => {
      const fm = cache.frontmatter;
      if (!(file instanceof TFile) || fm?.type !== 'character') return;
      const character = readCharacter(fm);
      if (character === null) return;
      const keys = computedKeys(character, rules());
      if (keys === null || !differs(fm, keys)) return;
      void app.fileManager.processFrontMatter(file, (front: Record<string, unknown>) => {
        Object.assign(front, keys);
      });
    }),
  );

  plugin.registerView(
    CHARACTER_VIEW,
    (leaf) =>
      new CharacterSheetView(leaf, {
        t,
        lang: ctx.lang,
        rules,
        spell: (id) => {
          const s = spellsById.get(id);
          return s === undefined
            ? undefined
            : { name: { en: s.name, de: s.nameDe }, level: s.level };
        },
        load: (path) => {
          const file = app.vault.getFileByPath(path);
          return Promise.resolve(
            file === null ? null : sheetData(path, frontmatter(file), rules()),
          );
        },
        roll: (check, edge) => ctx.later.roll(check, edge),
        openNote: (path) => ctx.openNote(path),
        onChange: (path, callback) => {
          const ref = app.metadataCache.on('changed', (file) => {
            if (file.path === path) callback();
          });
          return () => app.metadataCache.offref(ref);
        },
        render: (markdown, target, component) =>
          void MarkdownRenderer.render(app, markdown, target, '', component),
      }),
  );

  /** Opens the sheet of the note at `path`, in the tab already showing it or a new one. */
  const openSheet = async (path: string) => {
    const shown = app.workspace
      .getLeavesOfType(CHARACTER_VIEW)
      .find((leaf) => (leaf.view.getState() as { path?: unknown }).path === path);
    const leaf = shown ?? app.workspace.getLeaf('tab');
    if (shown === undefined) {
      await leaf.setViewState({ type: CHARACTER_VIEW, state: { path }, active: true });
    }
    await app.workspace.revealLeaf(leaf);
  };
  const isCharacter = (file: unknown): file is TFile =>
    file instanceof TFile && frontmatter(file)?.type === 'character';

  plugin.addCommand({
    id: 'open-character-sheet',
    name: t('command.openCharacterSheet'),
    checkCallback: (checking) => {
      const file = app.workspace.getActiveFile();
      if (!isCharacter(file)) return false;
      if (!checking) void openSheet(file.path);
      return true;
    },
  });
  plugin.addCommand({
    id: 'new-character',
    name: t('command.newCharacter'),
    callback: () =>
      new CharacterBuilderModal(app, {
        t,
        lang: ctx.lang(),
        rules: rules(),
        spells: SRD_SPELLS,
        roll: () => 1 + Math.floor(Math.random() * 6),
        render: (markdown, target, component) =>
          void MarkdownRenderer.render(app, markdown, target, '', component),
        create: async (draft) => {
          const path = await newNote(
            app,
            ctx.cache,
            ctx.settings().characterFolder,
            draft.name,
            characterNoteText(draft, rules()),
          );
          new Notice(t('characterBuilder.created', { path }));
          return path;
        },
        open: async (path) => {
          // The new note's metadata first, then the sheet can read it.
          await ctx.indexed(path);
          await openSheet(path);
        },
      }).open(),
  });
  plugin.registerEvent(
    app.workspace.on('file-menu', (menu, file) => {
      if (!isCharacter(file)) return;
      menu.addItem((item) =>
        item
          .setTitle(t('command.openCharacterSheet'))
          .setIcon('scroll-text')
          .onClick(() => void openSheet(file.path)),
      );
    }),
  );
}
