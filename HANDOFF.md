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

1. The maintainer checks NPC builder phases 2 and 3 in Obsidian (lists under "Half-finished"). Fix
   what turns up.
2. Then brainstorm the next module (battle tracker or dice) with the maintainer: spec, plan, review
   stop.

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

`pnpm check` at the root: exit 0; 247 plugin tests and 14 package tests pass. CI green on Linux,
macOS and Windows for every push to `main` this session.
