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

## 2026-10-25 · Deck of Many Things, phase D1

Design: `docs/superpowers/specs/2026-10-25-deck-of-many-things-design.md`; the maintainer accepted
every call in its §8.

- Its own tab with a ribbon icon, like the faction world and the spellbook.
- The standard deck has 22 cards; 13 as a setting. A deck note keeps the size it was made with
  (`deck: standard-22` / `standard-13`).
- State in a note: `Deck of Many Things.md` in the campaign folder, made on the first draw; a
  ticked card is out; one line per card under `## Draws` (date · drawer · card), the drawer linked
  when they have a note. Card names in the note are English (nomenclature rule); the plugin reads
  German names too.
- The rules are automated: the Fool and the Jester leave, the Fool's redraw is free, the Jester
  offers two draws or the XP, the Idiot one draw, The Void and Donjon end. The one-hour rule and
  "the remaining cards fly from the deck" are left to the GM.
- Randomness from `crypto.getRandomValues`. Cards in the grid can be looked up between drawings,
  not during one.
- Source: the 5e-bits entry lacks six effects (Star, Sun, Talons, Throne, Vizier, The Void); the
  complete SRD text comes from the Open5e SRD data. Skull's avatar of death is left out — no
  source at hand has its stat block, and it is not typed from memory.
- German names: Wesir, Sonne, Mond, Stern, Komet, Die Schicksalsfäden, Thron, Schlüssel, Ritter,
  Juwel, Klauen, Die Leere, Flammen, Schädel, Idiot, Verlies, Ruin, Euryale, Schurke, Gleichgewicht,
  Narr, Possenreißer; German playing-card ranks (A, K, D, B).

Left out: own decks and the command New deck (phase D2).

## 2026-10-25 · Deck of Many Things, phase D2: own decks, builder, reset

Asked for by the maintainer: "a reset of the log and a deck builder, typed in by hand or with an
import". Decided with them: import from **pasted text** and from a **JSON file**; the reset offers
**both** "history only" and "history and every card back".

- Own decks use the example vault's task-list format; `Name — effect` per item, indented lines
  continue the effect. `returns: true` makes drawn cards return (`leaves` names those that do
  not); otherwise every card drawn is ticked. `ends` stops the drawing in either kind. The Fool,
  Jester and Idiot rules stay with the standard deck.
- The builder writes a new note and never rewrites one: a deck is edited in its note afterwards
  (files first; line edits only).
- Pasted text: one card per line; `—`, `–`, `-` or `: ` separates name and effect; bold
  names (`**Name.**`), list and task markers, Markdown table rows (header and separator skipped).
- JSON: `{ name, returns, cards: [{ name, effect, leaves, ends }] }`, an array of cards or of
  names; `title`, `text`, `description`, `desc` accepted as synonyms. Read with the browser's file
  dialog (`File.text()`), so it works on phones; no Node `fs`.
- New decks go to a deck folder inside the campaign (setting `Decks`); a taken name gets a number.
- The tab remembers the deck picked last (plugin data).
- Reset edits only the Draws lines (text under the heading that is not a draw stays) and, if asked,
  the ticks.

Left out: editing a deck in the builder (the note is the editor), exporting decks as JSON.

## 2026-10-25 · Spellbook phase S3: links and own spells

Built on the maintainer's "continue" after the deck was accepted; the phase was designed in the
spellbook spec (§4.3, §5).

- Links only in stat block entries whose name says Spellcasting (Innate Spellcasting, German
  "Zauber…"): elsewhere common words ("light", "fly", "command") would turn into links.
- Names match as whole words, in English and German, longest first; bold text (the entry's name)
  and existing links are left alone. The DOM is split with createEl, never innerHTML.
- A link opens the spellbook and the spell's card; filters that would hide the spell are cleared.
- Own spells: `type: spell` notes anywhere in the vault (spells are not campaign-bound). `level`
  and `school` are required (English or German words); casting time, range, duration default to
  "1 action", "Self", "Instantaneous"; classes, damage types and the save read in either language,
  unknown words dropped. The body is the description; a heading "At Higher Levels" / "Auf höheren
  Graden" starts that section; a leading H1 is skipped. Meta phrases in English get the German
  translation the SRD's get (metres); anything else shows as written.
- Own spells are read once and again after their metadata changes, never per keystroke.

Left out: plain spell names in ordinary notes (only stat blocks), a "New spell" command (a template
does it).

## 2026-10-25 · Spell builder; both builders in the New NPC dialog's style

Asked for by the maintainer: "such a spell builder" (like the deck builder), and "make all
builders, deck and spell, fancier, with Obsidian's design in focus like the NPC builder".

- Both dialogs reuse the New NPC dialog's layout and classes: Obsidian settings rows and headings
  on the left, tiles for choices, a sticky live preview card on the right (above the form on
  phones).
- Spell builder sources: an SRD spell (search over the 319 as tiles, its words copied in the GM's
  language — German meta and text stay German in the note), by hand, or a JSON file: our own keys
  or the 5e-bits / Open5e spell shape (`school.name`, `classes[].name`, `desc` paragraphs,
  `higher_level`, `dc.dc_type`, `damage.damage_type`, `attack_type`, `level_int`, `dnd_class`).
  One spell per file.
- Concentration is a field of its own; a copied duration keeps only its span.
- New spells go to a spell folder inside the campaign (setting `Spells`); the builder waits for
  the note's metadata, then opens it in the spellbook. Notes are written, never rewritten.

Left out: pasted-text import for spells (a spell has too many fields for one line), editing an
existing spell in the builder.

## 2026-10-25 · Spell builder: casting time and duration as dropdowns

Asked for by the maintainer. The options are every casting time (9) and duration (19) the SRD's
spells use, stored in the SRD's English words and shown in the GM's language; the spellbook
translates them as it does the SRD's. A value from a JSON file that is not among them is offered as
an extra first option. Range stays a text field (too many shapes to list).

## 2026-10-25 · Monster Manual, phase M1

Design: `docs/superpowers/specs/2026-10-25-monster-manual-design.md`; the maintainer accepted every
call in its §7.

- Data generated once from the 5e-bits SRD monsters into our `dnd5e-statblock` YAML, with the list
  and filter fields beside it. Usage written as the SRD prints it ("(3/Day)", "(Recharge 5–6)",
  "(Recharges after a Short or Long Rest)"); armour notes from the extra AC entries ("15 with mage
  armor", "11 while prone"); the Cult Fanatic's 33 hit points fixed as in `SRD_NPCS`. The SRD's
  legendary-actions paragraph is not in the database; it is written in the SRD's words with the
  monster's short name ("The dragon can take 3 legendary actions …").
- The 21 NPCs appear too and agree with the NPC builder's in tests (usage suffixes aside).
- The tab reuses the spellbook's layout and styles; type colours from Obsidian's palette. The card
  is the stat block view of notes.
- German in M1: names (all 334, none twice) and the stat block's header and lines — sizes declined
  for the type's gender ("Großer Drache", "Große Monstrosität"), the SRD's swarms as "Schwarm
  winziger Tiere", alignments, armour, speeds and senses in metres, languages and phrases like
  "versteht …, kann aber nicht sprechen", damage types and conditions, saves as Str/Ges/Kon/Int/
  Wei/Cha, skills by their German names, hit dice with W. A test checks that no English word is left
  in any monster's German header and lines. In the list the type comes before the size, so German
  needs no declension there.
- Insert into note edits the last Markdown note through `vault.process`, below its cursor line, not
  through the editor. Make a note writes `type: monster` and `cr`, then the block.
- `main.js` grows to about 1.7 MB with the monster data.

Left out: German traits and actions (M2), own monsters and the monster builder (M3).

## 2026-10-25 · Monster Manual, phase M3 ahead of M2: own monsters and the monster builder

Asked for by the maintainer after M1 ("jetzt einen Monster Creator"); M2 (German traits and
actions) stays the next phase.

- Own monsters: `type: monster` notes anywhere in the vault, their first stat block read for the
  list (name required; the base type from the type's first word; movement from the speed).
- The builder keeps the stat block in the SRD's words: size, type, alignment and CR are dropdowns
  showing the GM's language and storing English, like the spell builder's casting time; its
  preview — and the Monster Manual's card for own monsters — show the German header and lines with
  German Obsidian. Free fields (speed, senses, languages, damage, traits, actions) are written as
  typed. Saves and skills are one line each (`DEX +6, CON +13`).
- A block written by the builder reads back as the same block: tested on all 334 SRD monsters,
  which found the Druid's leading space (now trimmed by the generator).
- The paragraph above legendary actions fills itself in with the SRD's sentence when the first
  legendary action is added, and can be changed.
- The yaml library is no longer bundled into the plugin by the Monster Manual: it reads blocks with
  Obsidian's `parseYaml`.

Left out: editing a note's monster in the builder (the rendered block is editable already), lair
actions, spell lists as separate fields (Spellcasting stays a trait).

## 2026-10-25 · No non-SRD monsters in the plugin; an import for the GM's own

The maintainer asked for the named demon lords and beholders in the Monster Manual. They are not in
the SRD 5.1 (CC-BY-4.0): the demon lords are not part of it, and beholders, mind flayers and similar
creatures are Wizards of the Coast's product identity, kept out of it on purpose. Shipping their
stat blocks — typed in or not — would distribute copyrighted text from a public repository, so the
plugin keeps to the SRD. Decided with the maintainer instead: an import, so creatures from books
the GM owns land in the GM's own vault as own monsters.

- Formats: our and Fantasy Statblocks' keys (YAML, JSON, Markdown notes with `statblock` or
  `dnd5e-statblock` blocks), the 5e-bits and Open5e SRD API shapes, 5etools bestiaries. Wrappers
  `{ monster: [...] }`, `{ results: [...] }`, `{ monsters: [...] }` and plain lists are read.
- 5etools tags become the SRD's words (`{@atk mw}` → "Melee Weapon Attack:", `{@hit 5}` → "+5",
  `{@h}` → "Hit: ", `{@dc 15}` → "DC 15", `{@recharge 5}` → "(Recharge 5–6)", any other tag its
  first part); spellcasting blocks become a Spellcasting trait with spell lines.
- One monster fills the builder; several become tiles with Create all, writing each through the
  same note helper. Monsters without a name are skipped. Read with the browser's file dialog, so it
  works on phones; no network.
- The example vault's import file holds two made-up monsters, no copyrighted ones.

Left out: fetching from websites (no network), 5etools' `_copy` references between monsters (a
copied monster comes in with only its own fields).

## 2026-10-25 · The battle tracker keeps the fight in the encounter note

Designed with the maintainer (spec `docs/superpowers/specs/2026-10-25-battle-tracker-design.md`,
every call in its §8 accepted): its own tab, the party joining by itself, combatants from notes,
the Monster Manual and inline entries, and the running fight as a Markdown table under `## Combat`
in the encounter note — nothing kept only in the plugin.

- A group (`count` above 1) rolls one initiative and is numbered; player characters' initiative is
  typed in, with a dice button using their bonus. Ties go to the higher Dexterity, then the name.
- Monsters and NPCs at 0 hit points are defeated and skipped; player characters (the party, or
  `tags: [pc]`) go down and make death saves; damage while down is a failed save; healing brings
  them back with fresh saves.
- Condition durations count down at the end of their holder's turn; Previous turn does not give
  them back.
- A row of the table is the truth for its combatant; a fight read back from the note keeps hit
  points, temporary hit points, conditions, concentration and death saves. Conditions typed into
  the table by hand are kept as written.
- The party is the campaign's `Party` folder; a party member also linked in `combatants` joins once.

Left out for B1: adding or removing combatants mid-fight and the session log (B2), the encounter
builder (B3), drag-and-drop in the order (the arrows nudge instead), asking before Start again
replaces an ended fight's table.

## 2026-10-25 · The battle tracker logs moments, not blows; the line-up can change mid-fight

Phase B2 (plan `docs/superpowers/plans/2026-10-25-battle-b2.md`), built after the maintainer's
"Mach weiter, ich teste später".

- Session log lines for the moments a session report keeps: the fight begins, a combatant is
  defeated, goes down or dies, the fight ends — with the defeated enemies' XP by challenge rating,
  unsplit. Not every round or every hit.
- The lines are English in every language, like the `## Combat` table: the files' conventions are
  English, German is the UI's.
- The setting **Battle log**: ask (a notice per line, the default, like the factions' changes),
  automatic, or off. The same "start session N+1?" question applies.
- A newcomer rolls and goes where its initiative puts it without re-sorting the rest (the GM's
  nudges stay); a member of a group already fighting shares the group's initiative, takes the next
  number and goes after the group. From the Monster Manual a monster joins the enemies.
- A combatant added mid-fight lives only in the `## Combat` table (the encounter's frontmatter
  stays what the GM planned); when the tab reads the table back, it is matched to a monster or a
  note by its name without the member number.

Left out: logging every round or damage, splitting XP per character, choosing the side of a
newcomer (the GM can write `side:` into the encounter instead), Add to encounter (B3).

## 2026-10-25 · The encounter builder uses the SRD 5.2.1's XP budget

Phase B3 (plan `docs/superpowers/plans/2026-10-25-battle-b3.md`), built after the maintainer's
"Weiter". The SRD 5.1 has no encounter-building rules; the SRD 5.2.1 (CC-BY-4.0 too) has the XP
Budget per Character table (Low, Moderate, High for levels 1–20), checked on 2026-10-25 against a
Markdown conversion of the SRD 5.2.1 and its own examples (four level 1 characters, low: 200 XP;
five level 3, moderate: 1,125 XP). It spends the budget as a plain sum of XP, without the 2014
rules' group multipliers, so the builder does the same.

- A party of mixed levels: each character's budget by their level, summed (the SRD gives the equal
  case only, where this is the same).
- Levels come from the characters' `level` frontmatter; one without counts as level 1, and the
  builder says so. Without a party folder the GM enters a number of characters and a level.
- The party chips shape the budget only. The note joins the whole party (`party: true`) unless
  every chip is off (`party: false`).
- The rating says how hard the XP is (within Low, Moderate, High, or beyond High), whatever
  difficulty was picked; the picked difficulty is the budget the bar fills and is written as
  `difficulty:`.
- The builder writes `monster:` entries only; **Add to encounter** raises the count of an entry of
  the same monster without a name of its own, else appends one, through `processFrontMatter`.
- Attribution for the SRD 5.2.1 table in the README.

Left out: notes and written combatants in the builder (added in the note by hand), editing an
existing encounter in the builder, the difficulty of a running fight in the Battle tab.

## 2026-10-25 · Experience points are optional, off by default

The maintainer: "Level up und EP sind immer optional". Asked and answered: a setting **Experience
points**, **off** by default; off hides only the XP reward — the encounter builder still counts the
SRD 5.2.1 budget internally and rates encounters Low / Moderate / High, showing the budget as a
share and the difficulties by their danger instead of XP; the battle log's end line drops its XP.

Left out: anything about levelling up (the plugin does not track character advancement); the XP
in a stat block's challenge line stays, as it is part of the SRD stat block.
