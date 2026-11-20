// Built characters: whenever a character note with `levels` changes, its computed keys (class,
// level, AC, hit points, saves, skills …) are derived from its choices and written back, so the
// party, battle and dice modules and a reader without the plugin see current numbers. Writing
// only when a key differs keeps the change event from looping.

import { loadRules, type Rules, SRD_52 } from '@obsidian-plugins/rules';
import { TFile } from 'obsidian';

import { computedKeys, differs, readCharacter } from '../../character/note';
import type { Context } from './context';

export function registerCharacters(ctx: Context): void {
  const { app } = ctx.plugin;
  let rules: Rules | null = null;
  ctx.plugin.registerEvent(
    app.metadataCache.on('changed', (file, _data, cache) => {
      const fm = cache.frontmatter;
      if (!(file instanceof TFile) || fm?.type !== 'character') return;
      const character = readCharacter(fm);
      if (character === null) return;
      rules ??= loadRules([SRD_52]);
      const keys = computedKeys(character, rules);
      if (!differs(fm, keys)) return;
      void app.fileManager.processFrontMatter(file, (front: Record<string, unknown>) => {
        Object.assign(front, keys);
      });
    }),
  );
}
