# Decisions

Architecture decisions and assumptions, newest last. Each says what was decided, why, and what was
left out.

## 2026-10-24 · Scope: four modules, all our own code

Factions, an NPC builder with 5e stat blocks, a battle tracker and dice — one plugin, one design per
module, built one after another. Everything is our own code, inspired by javalent's Initiative
Tracker, Dice Roller and Fantasy Statblocks but not depending on them; compatible with their file
formats where it costs nothing (the ` ```statblock ` fence).

## 2026-10-24 · Factions are folders

A faction is a folder holding `factions.md`, or a note named like the folder with `type: faction`.
Members are the character notes (`type: npc` or `character`) in that folder and its plain subfolders;
a faction folder inside another is a sub-faction. Characters outside every faction go to the
pseudo-factions _Party_ (`type: character`) and _Unaffiliated_ (`type: npc`).

## 2026-10-24 · Relations

Integers −5 … +5 on a red–yellow–green scale, one-directional. `relations` is the public face,
`secret_relations` the true stance; a value is a number or `{ value, why }`. Members inherit their
faction's values, also towards characters, unless they state their own; a member's own values never
pass on. True stance: walk from the entity up through its factions, at each level secret before
public, the first hit wins. `power: 1–5` sets node size only.

## 2026-10-24 · English nomenclature

Every file name, frontmatter key and convention the plugin reads is English (`factions.md`,
`relations`, `type: npc`). German exists only as a translation of the interface.

## 2026-10-24 · Name, id, licence

Name `dnd5e-byLokianer`, id `dnd5e-bylokianer` (plugin ids are lowercase and never change after
release), licence MIT. Rhizom code carried over into this plugin is relicensed to MIT by Rhizom's
sole author, the maintainer.

## 2026-10-24 · Self-hosted sync is not part of this repository

The maintainer syncs vaults with the Self-Hosted Vault Sync server on their home server; its setup
lives in their HomeServer repository. Every sync token sees the whole vault, so a player-facing
export would need a separate vault and server instance.

## 2026-10-24 · TypeScript 6.0.3

The maintainer wanted TypeScript 7, then 6.1. TypeScript 7 ships no classic JavaScript API, which
typescript-eslint needs, and 6.1 is not released; typescript-eslint 8 accepts `<6.1.0`. Move up when
typescript-eslint does. Because TypeScript 6 deprecates `moduleResolution: node`, the tsconfig uses
`bundler`.

## 2026-10-24 · Obsidian typings 1.14, minAppVersion 1.8.7

`getLanguage()` (for the interface language) exists since Obsidian 1.8.7, so that is the minimum
app version. `eslint-plugin-obsidianmd` 0.4.2 declares a peer of exactly `obsidian@1.8.7`; we use
the current typings 1.14.4, as the official sample plugin does, and accept pnpm's peer warning.

## 2026-10-24 · The first written wins, and every passed-over note is named

Two relation keys in one note can name the same target (`Watch` and `The City Watch`, or `Sable` and
`Sable`). The first one written is used; each later one is skipped with `duplicate-key`. Of
several campaign notes the smallest path still wins (one campaign per vault), and every other one
gets `campaign-ignored`, so a template carrying `type: campaign` cannot hide the real campaign
silently. A `power` that is not a number reads as 3 (`power-not-a-number`), a fractional one is
rounded (`power-not-integer`), one outside 1–5 is clamped (`power-out-of-range`).

## 2026-10-24 · How relation keys find their target

A key is trimmed and then looked up in this order: a faction's exact name (`name:`, else the folder
name), a faction's exact folder name, the same two ignoring case; only then a character's exact
note name, then ignoring case. So a faction beats a character of the same name (`ambiguous-key`).
Two factions — or two characters — sharing a name, also only in case, are a clash: whoever holds
the name ignoring case keeps it (a faction's name before another's folder name, then the smaller
id) and every other one is named with `duplicate-name` and the clashing name. A faction whose folder differs
from its name only in case is no clash.

## 2026-10-24 · Reading numbers and notes leniently, but never silently

- Numbers are plain decimal notation (`3`, `-1`, `+2`, `2.5`); `0x3`, `1e0` or `Infinity` are not a
  number. A leading `−` (U+2212) or `–` (en dash, which editors put in for a typed hyphen) is a
  minus. Fractions round half away from zero, so −2.5 reads as −3 like 2.5 reads as 3.
- `factions.md` is recognised in any case (`Factions.md`), as Windows and macOS treat file names; of
  two spellings in one folder the exact one wins and the other is named (`duplicate-faction-note`).
- A `factions.md` with an explicit other `type` (an overview note in a container folder) is not a
  faction note, and gets no warning: the type says what it is. Without any type it still counts,
  with `missing-type`.
- A note whose frontmatter holds YAML that does not parse is named with `broken-frontmatter`
  instead of vanishing; nothing is read from it (a broken `factions.md` still makes its folder a
  faction, with the folder name). An empty block is fine. Obsidian's cache cannot tell the two
  apart, so the adapter reads the text of just those notes whose cache shows a block but no values.

Left out: a decimal comma (`2,5`) — it reads as not a number and is warned about.
