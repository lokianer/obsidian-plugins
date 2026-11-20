// Built characters and the character sheet. Whenever a character note with `levels` changes, its
// computed keys (class, level, AC, hit points, saves, skills …) are derived from its choices and
// written back, so the party, battle and dice modules and a reader without the plugin see current
// numbers; writing only when a key differs keeps the change event from looping. The sheet opens
// from a command or a character note's file menu.

import { loadRules, type Rules, SRD_52 } from '@obsidian-plugins/rules';
import { MarkdownRenderer, TFile } from 'obsidian';

import { computedKeys, differs, readCharacter, sheetData } from '../../character/note';
import { CHARACTER_VIEW, CharacterSheetView } from '../character-sheet-view';
import type { Context } from './context';

export function registerCharacters(ctx: Context): void {
  const { plugin, t } = ctx;
  const { app } = plugin;
  let loaded: Rules | null = null;
  const rules = () => (loaded ??= loadRules([SRD_52]));
  const frontmatter = (file: TFile) => app.metadataCache.getFileCache(file)?.frontmatter;

  plugin.registerEvent(
    app.metadataCache.on('changed', (file, _data, cache) => {
      const fm = cache.frontmatter;
      if (!(file instanceof TFile) || fm?.type !== 'character') return;
      const character = readCharacter(fm);
      if (character === null) return;
      const keys = computedKeys(character, rules());
      if (!differs(fm, keys)) return;
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
