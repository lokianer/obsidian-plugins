# Handoff

The note one session leaves for the next — local or in the cloud. **Rewrite it at the end of every
session** (not append) and commit it with that session's work. `ROADMAP.md` says _what_ is done and
next; this file says _how it was left_: state of the working tree, what is half-finished, what to
watch out for. A cloud session cannot see the maintainer's private vault, so nothing here may depend
on it.

Read order for a new session: `ROADMAP.md` → this file → `CLAUDE.md` → the spec and plan named under
"Where to continue".

---

## Session

2026-10-25, cloud. The maintainer checked the factions module (phases 2–5) in Obsidian on their PC;
this session fixed what the check turned up and added what they asked for along the way. At the end
the maintainer reported **every checklist point passing**: phases 2–5 are accepted.

## Where to continue

1. Accepted by the maintainer on 2026-10-25: the NPC builder (phases 1–4b), the spellbook (S1, S2)
   and the Deck of Many Things (D1, D2). The faction world redesign (points 20–21) still waits for
   its check.
2. **Spellbook S3** (links from stat blocks, own spells) is built and waits for the check (points
   34–36 below). Code: `src/spells/links.ts` + `src/obsidian/spell-links.ts` (links),
   `src/spells/own.ts` + `src/obsidian/own-spells.ts` (own spells).
3. Next: module 5, the **battle tracker** — not brainstormed yet; start with the maintainer
   (questions, a short design, the plan), from `examples/vault/Silverstadt/Encounters/Ambush under
the second arch.md`.

## State of the working tree

Branch `claude/roadmap-and-handoff-nb9sav`, pushed; `main` fast-forwarded to it after every slice, so
`git pull` on `main` brings everything. Clean. `examples/vault/.obsidian/graph.json` may show as
modified after opening the vault: never commit it as part of a task. After trying session creation
in the example vault, delete `Silverstadt/Sessions/Session 15.md` and `git checkout examples/vault`.

## Done this session

From the maintainer's check in Obsidian, in order:

- `4112e8c` The graph was fitted while the new tab had no size: `PanZoom.fit` now waits for a size
  (ResizeObserver). The Log notice got a full-width accent button and stays ten seconds.
- `8712c40` The graph then showed arrows but no nodes: `drawNode` passed two classes as one array
  entry, which Obsidian's `createSvg` hands to `classList.add` (throws on a space), so drawing
  stopped at the first node. All SVG classes are separate tokens now.
- `65c3e9f` In a one-member faction view the title ran into "Power 5": frame, chips and boxes are
  sized from an estimate of their labels (`textWidth`; measuring needs a laid-out SVG).
- `7419811` Members with an arrow between them (Mira Voss ↔ Sable) stood edge to edge:
  `memberRows` (pure, tested) puts linked members side by side with a wider gap; an arrow with a
  reverse one runs beside it.
- `389a3af` Asked for: move the cards in the faction view like in the graph. The frame (with its
  chips) and each box can be dragged, offsets per faction in the setting `viewMoves`; re-layout in
  a faction view resets them.
- `681a70e` Asked for: loot travels into the new session so only one session needs watching.
  `carriedLoot` / `withLoot` in `packages/session/src/loot.ts` (tested) copy the rows and items
  under `## Loot` into session N+1, each with `(from [[Session N …]])`, an earlier origin kept; new
  command **Start next session**. DECISIONS 2026-10-25.
- Docs: README, CHANGELOG, DECISIONS, `Home.md` rows, the package README; ROADMAP, the phase plans,
  the concept and `CLAUDE.md` mark phases 2–5 accepted.
- The maintainer then answered the concept's §5: publish nothing yet, keep building; modules 2–4 as
  own code compatible with the other plugins' formats, the stat block with its own block name;
  `happy-dom` yes; NPC builder next with all SRD NPCs, a template builder for own archetypes, random
  helpers, editing in place and AC · HP · CR on the card. DECISIONS 2026-10-25.
- `be72b23` UI smoke tests: `test/ui/` renders card, graph, matrix, faction view, popover and
  tension panel in happy-dom (stand-in `obsidian` module aliased in `vitest.config.ts`, DOM helpers
  strict about class tokens); with the old graph bug put back two tests fail.
- NPC builder spec and phase 1 plan written; the maintainer approved both ("passt").
- Project page `site/` (static HTML/CSS, real screenshots from the renderers, dark and light, phone
  width checked) and `.github/workflows/pages.yml`; root README rewritten to the current state. The
  maintainer asked for it "with the brag skill" — no such skill exists in this environment, so it was
  built by hand. **Needs once:** Settings → Pages → Source "GitHub Actions"; then it deploys from
  `main` to https://lokianer.github.io/obsidian-plugins/. Screenshots were made in the scratchpad
  harness (stub `obsidian` with Lucide-like icons, data from the clean example vault); redo them
  when the views change.
- NPC builder phase 1 built: `src/npc/statblock.ts` (model, derived values, blocks in a note,
  Convert), `src/npc/srd.ts` (21 SRD NPCs from the 5e-bits database, checked against the SRD in
  tests — which caught a wrong Cult Fanatic HP there — with `NOTICE.md`), `statblock-view.ts`
  (rendering), `stat-summaries.ts` (the card's `AC · HP · CR`, read from the note's text), the
  command Convert stat block, example vault notes on the new block (Ondine kept on `statblock`),
  README attribution. Seen in Chromium at desktop and phone width.
- A bug the maintainer found: links in the card's other fields (`leader: "[[Isolde Ferrant]]"`)
  were plain text; fixed in `9f6287d` (rendered and opened via openLinkText).
- Phase 4 asked for (races, German and more dice texts, fancier dialog); spec §10, plan 4a approved
  ("ja") and built: `races.ts`, `srd-races.ts`, `text-tables.ts` (12 tables × ≥ 50 entries in
  English and German), `tables.ts` by language, new fields in `note.ts`, the dialog's race field
  and race-aware dice, the generic New archetype / New race dialog, settings for races folder and
  dice language, `Templates/Races/Tideborn.md`.
- Phase 3 plan written after the maintainer said "mach weiter" (they test phase 2 later); approved
  with its deviation ("passt") and built: `src/npc/block-edit.ts` (scalars via the frontmatter line
  editor on the block's lines, one ability, entries set/add/remove), `statblock-edits.ts` (writes,
  block found by its fence line), editable rendering in `statblock-view.ts`, `write.ts` generalised
  to text edits (with Undo), `archetypeNote` and the New archetype dialog/command.
- NPC builder phase 1 accepted ("passt"); phase 2 planned, approved ("Ja") and built:
  `src/npc/archetypes.ts` (own archetypes from notes, search, `withName`), `src/npc/tables.ts`
  (default dice tables, note overrides), `src/npc/note.ts` (NPC note from template, Add stat block,
  folder and free file name), `src/obsidian/npc-modal.ts` (New NPC dialog, archetype picker,
  loaders), `src/obsidian/npc-builder.ts` (commands), the New NPC button on faction cards, four
  path settings; example vault: `Templates/Archetypes/Lantern Warden.md`,
  `Templates/Tables/NPC quirks.md`. The UI stand-in gained `Setting`, `FuzzySuggestModal`,
  `parseYaml`.

## Half-finished — check in Obsidian

Rebuild and install (`pnpm --filter dnd5e-bylokianer build`, then `… install-example`), reload.

1. **Button**: The Gutter Court's card shows **New NPC** in its top line; a character's card does
   not. It opens the dialog with The Gutter Court chosen.
2. **Dialog**: the dice fill name (first + family name), appearance, manner, wants, quirk; the quirk
   die uses the vault's `Templates/Tables/NPC quirks.md` (Bell Square, Mira …), the others the
   defaults. The archetype field suggests SRD NPCs and Lantern Warden (first, "own"), with CR.
   Phone width: one column, dice stay.
3. **Create** with archetype Guard into The Bench → `Silverstadt/Factions/The Gutter Court/The
Bench/<name>.md` opens: frontmatter `type: npc`, race, alignment, `archetype: Guard`; the lines
   under their headings; the stat block named after the NPC, folded; the card shows the short stats
   and the NPC appears as a member in the faction world. Party → `Silverstadt/Party`, Unaffiliated
   → `Silverstadt/NPCs`. Creating the same name again gives `<name> 2.md`.
4. **Refusals**: no name → notice; an archetype typed that does not exist → notice, no note.
5. **Add stat block** on Sergeant Pell → pick Lantern Warden → `## Stats` with a block named
   "Sergeant Pell" at the end; the card shows AC 16 · HP 16 · CR 1/4; a second run says the note
   has one. `git diff` shows only the added lines.
6. **Settings**: NPC template, archetype folder, tables folder, folder for NPCs of no faction — in
   both the settings search (1.13+) and the classic tab. German UI says "Neuer NSC".
7. Revert the example vault afterwards (`git checkout examples/vault`, delete created notes).

**Phase 3 — editing in the stat block**

8. Open Aldric Thane's block: click Armor Class, type 19, Enter → `ac: 19` in the note (`git diff`:
   one line); Esc cancels; click DEX 11 → 14 changes one number of `stats: [...]`; click the name.
   In Live Preview the cursor must not jump into the block; the block stays open after the write.
9. Actions: pencil on Lay on Hands → change name and text → Save writes them (a text with `:` gets
   quoted); × removes it with an Undo notice that puts it back; **+ Add** under Bonus Actions starts
   `bonus_actions:` with "New entry".
10. **New archetype**: name "Archive Spy", start from Spy → `Templates/Archetypes/Archive Spy.md`
    opens with the block unfolded and editable; it is offered in New NPC's archetype search.

**Phase 4a — races and dice texts**

11. New NPC: type "Zwerg" (or pick Dwarf) as race, roll name (dwarf names), appearance (beard,
    eyes, skin + a detail, in German with German Obsidian), age (50–300); create with Guard → the
    stat block shows speed 25 ft., darkvision 60 ft., Dwarvish, poison resistance, Dwarven
    Resilience …; frontmatter `race: Dwarf`.
12. The new fields (occupation, age, build, voice, ideal, bond, flaw, secret, hook) roll and land
    in the note (labels "Ideal:", "Makel:" …; Secrets as its own section).
13. Own race: pick Tideborn → its traits and names; **New race** from Elf writes a race note.
14. Settings: language of the dice texts (As Obsidian / English / German), races folder.

**Phase 4b — the fancier dialog** (points 2, 4 and 11 above now go through tiles instead of text
fields)

15. New NPC opens wide: form left, preview right ("Unnamed" and a hint until something is
    chosen); phone width: the preview above the form, only name, tags and numbers.
16. Race tiles: Tideborn first, then the nine SRD races with icons, size, speed, darkvision (German
    Obsidian: "Mittelgroß · 7,5 m · Dunkelsicht 18 m"); search "Owl" → **Use “Owl”** writes
    `race: Owl` with no traits. Clicking the chosen tile again clears it.
17. Archetype tiles: No archetype (chosen), Lantern Warden ("own"), then the SRD NPCs from Commoner
    (CR 0) to Archmage, each with AC · HP · CR; the preview shows the short stats.
18. Class tiles: the twelve SRD classes (German: Barbar … Magier, "W10 · STÄ, GES"); Magier writes
    `class: Wizard`; a typed class without a tile works as free text.
19. **Roll everything** fills race, class, name, age, appearance and every table field; type a voice →
    its lock closes and it survives the next Roll everything; a lock clicked by hand keeps an empty
    field empty; the single dice still roll locked fields.

**Faction world redesign** (asked for 2026-10-25)

20. Graph: coloured discs with initials, names on pills, dot grid that moves with pan/zoom; hover
    The Gutter Court → its arrows and neighbours stay, the rest fades, values show on the arrows;
    zoom +/−/fit buttons top right, colour scale at the bottom; Party and Unaffiliated as cards.
    Check a light theme and one community theme too.
21. Matrix: card with colour dots and initials, hovering a cell colours its row and column names;
    self cells hatched; the faction view (drill-down) keeps working with the dot grid.

**Spellbook S1**

22. The book icon in the left ribbon (and **Open spellbook**) opens the tab; with German Obsidian
    the list shows German names ("Feuerball"), German meta ("1 Aktion · 45 m") and "Zaubertrick",
    "Grad 1" … chips with counts.
23. Search "feuerb", "fireb" and "säurepfeil"/"saurepfeil" find the spells; level, school chips,
    the dropdowns, Ritual and Concentration combine; the reset button clears them; closing and
    reopening keeps the filters and the picked spell.
24. Card: school colour band, both names, level line, the four meta boxes, material, badges, the
    English description with the note that the German follows, tables (Animate Objects) as
    tables, EN / DE switch. ↑ ↓ in the list, Enter opens.
25. Narrow tab or phone: chips scroll sideways, a tap opens the card, the back arrow returns.
26. German texts: with German Obsidian every card reads German (description, "Auf höheren Graden",
    material) with W-dice and metres; tables (Verwirrung, Gegenstände beleben, Teleportieren,
    Wetterkontrolle) render as tables. Spot-read a few for wording; corrections go into
    `src/spells/de-texts/`.

**Deck of Many Things D1**

27. The layers icon (and **Open Deck of Many Things**) opens the tab; in the example vault it finds
    `Silverstadt/Decks/Deck of Many Things.md`: the Fool struck through, three draws in the history.
28. Who draws suggests the party; declare 2, Declare and draw, Draw a card: the card turns over
    (no turn with reduced motion), the history and the note get a line with the drawer linked.
29. Fool → "draw again" without using a draw, ticked in the note; Jester → the two buttons; Idiot →
    one more; The Void / Donjon → "The drawing has ended". Hard to force by hand: untick the Fool
    first, or trust the tests.
30. Without a deck note (rename the example one): the first draw makes `Deck of Many Things.md` in
    the campaign folder with a notice; the setting 13 cards makes a 13-card note. Tick a card in
    the note by hand: the tab strikes it through. German Obsidian: German names, D/B ranks, texts.

**Deck of Many Things D2**

31. The Deck tab's list shows the standard deck, "Fortunes of Bell Square" and "Omens of the
    River"; picking one shows its cards numbered; the pick survives closing the tab.
32. Bell Square: drawn cards return, the Cracked Bell gets ticked and the "Leaves the deck" badge,
    Midnight ends the drawing; its two-line effect shows whole. Omens: every card drawn stays out;
    once all are out, Declare and draw is greyed until a reset.
33. - (or **New deck**): the builder; "The standard deck" fills 22 rows in your language; "Pasted
      text" takes `Name — effect` lines and tables; "JSON file" opens the file dialog — pick
      `Silverstadt/Decks/Omens of the Road.json` (also on the phone). Create deck writes
      `Silverstadt/Decks/<name>.md` and opens it in the tab. ↺ asks: history only, or history and every
      card back.

**Spellbook S3**

34. Open Ondine Vale's stat block: counterspell, dispel magic, wall of force, hold monster, mislead
    are dotted links; a click opens the spellbook on the spell, even with filters set; German
    Obsidian shows the same. "Spellcasting" itself and the Quill-knife stay plain.
35. `Silverstadt/Spells/Lantern Ward.md` is in the spellbook under Level 2, marked "own",
    abjuration colour; the card shows its meta (German: 9 m), the text, "At Higher Levels" and the
    note button. Edit its level to 3: the list follows without reopening the tab.
36. A note with `type: spell` but no school stays out of the list.

## Decisions taken this session

In `plugins/dnd5e-bylokianer/DECISIONS.md`: "Loot carries over into the next session" (2026-10-25).
Smaller calls, in the commit bodies: single member chips stay inside their frame (only the frame and
boxes drag); label widths are estimated, not measured.

## Open questions for the maintainer

- None beyond the check in Obsidian.
- The "calls I made" sections of the phase 2–5 specs count as confirmed by the passing check, unless
  the maintainer wants something changed.

## Watch out

- Verify with `pnpm check`; never chain verification and commit with `;`. Clean up before every
  commit (CLAUDE.md).
- Obsidian's `createEl` / `createSvg`: an array `cls` goes to `classList.add`, so every entry must be
  a single token. The preview harness's DOM shim now behaves the same.
- Prettier is enforced (`pnpm format`; the `pre-commit` hook and CI refuse otherwise). It is not
  idempotent on inline code spanning two lines in Markdown — keep such spans on one line.
- The Write tool and shell heredocs can turn a backslash-u escape (the BOM) into the literal
  character; check with grep for the raw bytes after writing such code.
- In a fresh clone run `git config core.hooksPath .githooks`.
- TypeScript stays at 6.0.3 until typescript-eslint supports a newer version.
- `test/world.example.test.ts` and the session package's tests treat the example vault as the
  contract; notes broken on purpose live in `plugins/dnd5e-bylokianer/test/fixtures/vault`.
- `eslint-plugin-obsidianmd` forbids disabling its rules; settings implement both `display()` and
  `getSettingDefinitions()`.
- UI checks live in `test/ui/` (happy-dom). Add a test there for every new view; extend
  `test/ui/obsidian.ts` when a renderer imports more of `obsidian`. Screenshots still need a browser
  (Playwright is preinstalled in cloud sessions).
- The private vault's daily reports and changelog for 2026-10-24 and 2026-10-25 still need writing
  by a local session.

## Verification

`pnpm check` at the root: exit 0; 321 plugin tests and 14 package tests pass. CI green on Linux,
macOS and Windows for every push to `main` this session.
