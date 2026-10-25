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

## 2026-10-24 · The faction card is the editor, and it replaces Properties

The maintainer wants the frontmatter of faction and character notes rendered better than in
ordinary notes and editable in place, and chose a card that replaces Obsidian's Properties block on
those notes (a setting shows both) and is the only editor — no form modal. Its calls, from
`docs/superpowers/specs/2026-10-24-faction-editor-design.md` §7:

- Each change writes at once (slider on release, text on Enter or blur), like Properties; no Save
  button. An edit carries the value shown and is refused when the note says something else now,
  instead of merging.
- Writes are line edits through `vault.process`, never `processFrontMatter`, so YAML comments
  survive; what cannot be placed with certainty is refused with a reason.
- The card shows the entries as written, broken ones included, so Fix reaches every relation
  warning. A new relation starts at 0 once its target is picked. Remove offers Undo for 5 s, which
  puts the exact previous text back.
- Secret relations are closed every time the card is built; Other fields are closed by default.
  Lists and maps (tags too) and booleans are shown, edited in source.
- Card in Reading view and Live Preview; Source mode stays raw YAML. Numbers are written with an
  ASCII minus. No "Reset to inherited": the card shows only the note's own values, so Remove is
  that reset. Step-name settings come with the world view.
- Mounting relies on Obsidian's view DOM (`.markdown-preview-sizer`, `.cm-sizer`,
  `.metadata-container`); all selectors live in `src/obsidian/card-view.ts`, with a fallback to the
  top of the view.

Left out: a separate form modal (first draft), inherited values in the card.

## 2026-10-24 · The faction world: its own tab, d3-force, edits through the card

The maintainer chose a tab of its own and d3-force for the layout (ISC, no DOM, ~90 kB unpacked;
only `src/factions/layout.ts` imports it; rendering is our own SVG). From
`docs/superpowers/specs/2026-10-24-world-view-design.md` §7:

- Arrows only for values a source's own note states; inherited ones appear in the matrix, dashed.
- The Party and Unaffiliated are frames with a row per character, whose arrows leave from the row.
  Characters without any faction relation get no matrix row.
- Sub-factions are nodes beside their parent with a dashed tie, not drawn inside it.
- The layout is computed once (fixed ticks, deterministic start) from the **public** graph, so the
  True toggle never moves a node; positions are cached per campaign in plugin data; dragging pins.
- A node click selects until the faction view exists (phase 4); double- or Ctrl-click opens the
  note. Arrow and cell clicks open the note holding the value and focus the entry in the faction
  card — no sliders of their own (phase 5). Click targets name note, field and target id.
- Graph/Matrix is remembered, Public/True always starts at Public. Step names are global settings.

Left out: faction-to-character arrows (faction view), image export, per-campaign step names.

## 2026-10-24 · Faction view inside the world tab, tensions in the sidebar

The maintainer chose the faction view inside the faction world tab (click a faction, breadcrumb
back) and the tension panel in the right sidebar. From
`docs/superpowers/specs/2026-10-24-faction-view-design.md` §7, as built:

- A click on a graph node opens its faction view; Ctrl/Cmd-click opens the note (the phase 3
  selection and double-click are gone — a click navigates before a double-click could land).
- Inherited arrows only for the selected member; arrows between a faction and its own members are
  not drawn (no room inside the frame).
- Surrounding boxes only for what arrows reach, placed in the world graph's angle order; targeted
  characters are listed inside their faction's box.
- Rules: one-sided needs both directions; out of line compares an own value with the faction
  above, either sign; public vs true is reported once at the level holding the secret, True mode
  only; split allies need alliance both ways. Default thresholds 4 / 3 / 3 / 3, global settings.
- The panel follows the world tab's mode through a shared store; Public without a world tab.

Left out: thresholds per campaign, a tension panel inside the world tab.

## 2026-10-24 · One quiet visual language, close to Obsidian

The maintainer asked for every built view to look cleaner and more like Obsidian. Rules, in
`styles.css` at the top:

- Values are a soft tint of their colour (`color-mix` with transparency) behind normal text; full
  colour only for arrows and small accents. The tint is derived on the element that sets the
  colour, because a custom property resolves where it is declared.
- No boxes inside boxes and no coloured side bars; sections are plain muted headings in normal case,
  like Obsidian's "Properties"; rows get a hover background, and their icon buttons appear on hover
  or focus (always on phones, via Obsidian's `is-mobile`).
- Obsidian's own components where they exist: the `slider` class for the value slider, tag
  variables for list values, `clickable-icon` buttons, the view header's actions (`addAction`) for
  re-layout and tensions.
- Graph nodes show power only as size (the tooltip says it); frames and ghosts are dashed.

Left out: a custom slider track coloured by value (Obsidian's slider look wins; the value chip
carries the colour).

## 2026-10-24 · Editing in the views, and a history the GM opts into

The maintainer chose a popover on cells and arrows (instead of leading into the card), a "Log"
notice after each change (nothing is logged without that click), and a once-a-day offer to start
session N+1. From `docs/superpowers/specs/2026-10-24-in-view-editing-history-design.md` §8:

- Only relation values are logged; the notice stays six seconds; repeated changes of one relation
  merge into one offer (so dragging a slider back and forth logs one line, or none).
- The day's N+1 answer is kept in plugin data; the new note is `Session N.md` beside the last one,
  from the template setting (default `Templates/Session.md`), or a minimal note without one.
- A removed own value logs `x → —`. Secret changes go into a `[!gm]` callout under `## Log`.
- Tooltips show the three newest changes per relation; secret ones only in True mode.
- Tonight's session, log lines and their parsing live in `packages/session` (pure, shared), because
  dice and the battle tracker will log to the same note.
- The graph, matrix and faction view models no longer carry edit targets; the popover works out the
  write from the subject's own card rows.

Left out: logging reasons, names and power; a full history view (the "time machine" idea).

## 2026-10-25 · Loot carries over into the next session

Asked for by the maintainer after the first check in Obsidian: "only one session to keep an eye on".
When the plugin creates session N+1 (the Log offer or the new command **Start next session**), the
new note takes over every row of the tables and every list item under `## Loot` of session N, each
with `(from <link to session N>)` appended to its first cell; a line that already names an origin
keeps it, so an item says where it was found, not where it was last seen. The template's empty
placeholder rows are dropped. The previous note is not changed. Pure, in `packages/session/loot.ts`.

Left out: carrying loot into a session note made by hand or by Templater (the plugin only sees the
notes it creates); removing used-up loot (the GM deletes the line in the newest note, and it stops
travelling); other sections.

## 2026-10-25 · UI smoke tests in happy-dom

Approved by the maintainer. The views (card, graph, matrix, faction view, popover, tension panel)
render the example vault in `test/ui/` under happy-dom (dev dependency `happy-dom`, 21.0.4 since 20.14.6 had a high-severity advisory, GHSA-834v-8h66-3h79), with a
small stand-in for the `obsidian` module and Obsidian's DOM helpers on the prototypes. The helpers
are as strict as a browser where it matters: a class token with a space throws, which happy-dom
alone lets pass. With that, reintroducing the bug that hid the graph's nodes fails two tests. They
replace the manual browser preview of earlier sessions as the check before a push.

Left out: pixel screenshots (layout is not computed by happy-dom); tests of the Obsidian glue in
`main.ts`, `card-view.ts` and `world-view.ts`, which need a real workspace.

## 2026-10-25 · Own code, compatible formats; nothing published yet

Revises "Scope: four modules, all our own code" after the concept of 2026-10-25 proposed
integrating Dice Roller, Fantasy Statblocks and Initiative Tracker. The maintainer chose **own code,
compatible**: modules 2–4 render and edit with our own code, but read and write the formats those
plugins use, so notes move between them; the stat block gets **its own block name** so the two
plugins never claim the same block. Next is the NPC builder (module 2), with all SRD 5.1 NPCs and a
template builder for own archetypes. **Nothing is published for now** — no release, no BRAT beta.

Left out: depending on those plugins at runtime; the release preparation (mirror repository, name
check), which waits until the maintainer wants a release.

## 2026-10-25 · NPC builder: block name, archetypes, look

The maintainer approved the NPC builder spec ("passt") with its calls: the stat block's block name
is `dnd5e-statblock`, with Fantasy Statblocks' keys inside (its AC note is `ac_class`); NPC notes
get an `archetype:` key; own archetypes and table overrides live as notes in
`Templates/Archetypes/` and `Templates/Tables/`; unaffiliated NPCs go to the campaign's `NPCs`
folder; the stat block takes Obsidian's look, not a parchment imitation; no CR calculator (the SRD
5.1 has no table for it), the proficiency bonus and XP follow from CR.

Phase 1 calls: the card line is read from the note's text (the metadata cache has no block
contents), once per note and again when it changes; the 21 SRD NPCs were transcribed from the
5e-bits SRD database and checked against the SRD in tests, which caught one error there (the Cult
Fanatic's hit points).

Left out of phase 1: editing in the block, the builder modal, archetype notes, random tables.

## 2026-10-25 · Short stats under the title, the full block folded

After a first look the maintainer wanted the stats higher up, right under the title with the
description after them, and chose layout B of four mock-ups: the faction card shows AC, HP, CR and
speed as pills and the six ability modifiers under the character's name; the full stat block stays
where it is in the note, folded behind one line (`Stat block · name · AC · HP · CR`) that opens it.
Open or folded is remembered per note while Obsidian runs.

Left out: A (full block under the card), C (full block as a card section), D (two columns).

## 2026-10-25 · NPC builder phase 2: the builder

Approved plan (maintainer: "Ja"). Calls made while building:

- The personality lines go under the example template's headings as list items: appearance and
  manner under "Appearance and manner", wants under "What they want", the quirk under "Voice
  notes"; a missing heading is added at the end of the note.
- An own archetype is named after its note's file name (the block's `name:` is the NPC's name once
  used); a note without a usable stat block is named in a notice, not listed.
- A new note never overwrites one: `Name 2.md`, `Name 3.md` …; characters that cannot stand in a file
  name are dropped from it. A missing folder is created.
- An archetype typed but not found refuses Create with a notice instead of creating a note without
  stats.
- German UI says "NSC" for NPC, as German rulebooks do; keys and file names stay English.

Left out (phase 3): editing inside the stat block and a dialog that builds archetypes.

## 2026-10-25 · NPC builder phase 3: editing in place, New archetype without a form

The maintainer approved the plan with its deviation from the spec ("passt"): **New archetype** asks
for a name and an archetype to start from, writes the note and opens it; the archetype is shaped
with the in-place editing of the stat block, not in a form modal — one editor instead of two.

Calls made while building:

- Scalars inside a block are edited by running the frontmatter line editor on the block's lines,
  so quoting, comments and refusals behave exactly like the faction card's.
- The block is found again by the line its fence opens on, asked at write time; when Obsidian
  cannot tell, the note's only `dnd5e-statblock` block is used, else the edit is refused.
- While editing, Traits, Actions, Bonus Actions and Reactions show even when empty (to add the
  first entry); Legendary Actions only when present. A new entry is "New entry" with no text.
- Saves, skills, damage and condition lines are read-only for now (they are lists of pairs).

Left out: editing saves and skills, spells, and Fantasy Statblocks' `statblock` blocks (convert
first).

## 2026-10-25 · NPC builder phase 4a: races and German dice texts

Approved ("ja"), including an exception the maintainer confirmed: the rolled texts land in German
in the note when Obsidian (or the setting) is German, although vault notes are otherwise English;
keys, file names and the headings the plugin reads stay English.

Calls made while building:

- A race never changes ability scores (NPC stat blocks already include them). It sets size, the
  walking speed and `subtype`, puts darkvision in front of the senses, merges languages (an "any …
  language" line is replaced) and resistances, appends its traits once.
- Dragonborn default to red ancestry (fire); the trait says to change it for another colour.
- Race names in the note are English (`race: Dwarf`), the dialog shows German labels; typing a race
  that is not a model writes it as typed, with no traits.
- New lines go under the template's headings: build with appearance and manner, ideal and bond
  under "What they want" (labelled), voice and flaw under "Voice notes", secret and hook under a new
  "Secrets" heading; occupation and age are frontmatter keys.
- An own race without a `## Traits` list is not offered (named in a notice); missing name lists or
  age fall back to the Human race's.

Left out (phase 4b): the live preview, roll everything with locks, tiles.

## 2026-10-25 · Spellbook phase S1

Decided with the maintainer: its own tab (a ribbon button like the faction world's), filters, German,
"fancy"; module 3, after the NPC builder; German distances in metres.

Calls made while building:

- Only the 319 SRD 5.1 spells ship (CC-BY-4.0, `src/spells/NOTICE.md`), generated from the 5e-bits
  database by `scripts/spells-from-srd.mjs`; the plugin never fetches anything. The database writes
  ability names in lower case ("dexterity saving throw"); the generator restores the SRD's capitals.
- German spell names follow the German 5e books where they are established, otherwise they are a
  faithful translation; German components are V, G, M.
- Names and meta follow the NPC builder's dice-text language; the card's EN / DE switch is not kept.
- Filters: groups combine with AND, values in a group with OR (level and school chips allow
  several; class, casting time, damage and save are one value each, as dropdowns).
- Schools in Obsidian's palette: abjuration blue, conjuration yellow, divination cyan, enchantment
  pink, evocation red, illusion purple, necromancy green, transmutation orange.

Left out (S2, S3): German descriptions and materials; links from stat blocks; own spells as notes.

## 2026-10-25 · Spellbook phase S2: German texts

Asked for by the maintainer ("jetzt einmal alles mit deutschen Texten"). Calls made while translating:

- Our own translation of the SRD 5.1 text (CC-BY-4.0), in `src/spells/de-texts/` by level.
- Conventions of the German 5e books: dice as W (8W6, W20), "Grad" for spell levels and "Stufe" for
  character levels, Rettungswurf, Zauberplatz, Zauberrettungswurf-SG, Trefferpunkte, RK, SL; the
  conditions blind, taub, bezaubert, verängstigt, gepackt, kampfunfähig, gelähmt, versteinert,
  vergiftet, liegend/hinfallen, festgesetzt, betäubt, bewusstlos.
- Units converted as the books do: 5 ft. = 1.5 m, 1 mile = 1.5 km, 1 lb. = 0.5 kg, 1 gallon = 4 l,
  1 inch = 2.5 cm; gold pieces as GM. A formula in feet (Etherealness: 2 damage per foot) becomes
  3 per metre.
- Where the 5e-bits text is garbled (Magic Mouth, Shatter's "At Higher Levels", Fire Shield, Hold
  Monster), the German follows the SRD's meaning, not the broken English.
- Spell names inside the texts are italic and German (_Magie bannen_).

Tested: every spell has a German text, a German "At Higher Levels" exactly when the English has one,
a German material exactly when the English has one; every numbered die of the English appears in
the German; no feet, miles, pounds or inches are left.

Left out: S3 (links from stat blocks, own spells as notes).
