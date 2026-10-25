// A new note in a folder of the campaign (the vault root without a campaign), named after what it
// holds; a taken name gets a number. Used by the deck and spell builders.

import { type App, normalizePath } from 'obsidian';

import type { WorldCache } from './world-cache';

/** The path of a folder inside the campaign; empty for the vault root. */
export async function campaignFolder(cache: WorldCache, name: string): Promise<string> {
  const { campaign } = await cache.get();
  const joined = [campaign?.folder ?? '', name.trim()].filter((p) => p !== '').join('/');
  return joined === '' ? '' : normalizePath(joined);
}

/** Writes `text` as a new note `name` in the campaign folder `folder`; returns its path. */
export async function newNote(
  app: App,
  cache: WorldCache,
  folder: string,
  name: string,
  text: string,
): Promise<string> {
  const { vault } = app;
  const dir = await campaignFolder(cache, folder);
  const base = name.trim().replace(/[\\/:*?"<>|#^[\]]/g, '') || 'Untitled';
  const at = (suffix: string) =>
    normalizePath(dir === '' ? `${base}${suffix}.md` : `${dir}/${base}${suffix}.md`);
  let path = at('');
  for (let n = 2; vault.getAbstractFileByPath(path) !== null; n++) path = at(` ${n}`);
  if (dir !== '' && vault.getAbstractFileByPath(dir) === null) await vault.createFolder(dir);
  await vault.create(path, text);
  return path;
}
