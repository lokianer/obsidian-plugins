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

2026-10-24, cloud (third session of the day, continued). Phases 3, 4 and 5 specified, approved and
built; a design pass over every view; `main` kept in step with the branch. **The whole factions
module (phases 2–5) has not run inside Obsidian yet**; the maintainer tests it on 2026-10-25 on the
PC.

## First findings in Obsidian (2026-10-25)

The maintainer's first check found: (1) the graph in the faction world did not render properly —
most likely it was fitted while the new tab still had no size, leaving the nodes off-screen; fixed by
deferring the fit until the view is laid out (`pan-zoom.ts`), verified in the browser preview with a
container that gets its size late. The maintainer's screenshot then showed the arrows fitted but no
nodes: `drawNode` passed `['dnd5e-world-node is-faction']` as one class token, Obsidian's
`createSvg` hands array entries to `classList.add`, which throws on a space, so drawing stopped at
the first node (the faction view's root and boxes passed spaced strings to SVG too). All SVG classes
are now separate tokens; the preview harness's DOM shim now uses `classList.add` for arrays as well,
which reproduced the error before the fix. **Confirmed in Obsidian by the maintainer.** Next screenshot: in The Drowned Choir's view (one member) the frame was too narrow, title over power; the frame, chips and boxes are now sized from an estimate of their labels' width (`textWidth` in `faction-view-svg.ts`; measuring needs a laid-out SVG). Checked in the preview, to be confirmed in Obsidian. Then: members with an arrow between them (Mira Voss ↔ Sable) stood edge to edge; `memberRows` (pure, tested) now orders linked members side by side and marks them, the drawing leaves a wider gap there, and arrows in both directions run side by side. The maintainer then asked to move the cards in the faction view like in the graph: the frame (with its chips) and each box can be dragged; offsets per viewed faction in the setting `viewMoves`; the re-layout button now also shows in a faction view and resets them. Checked by a drag in the preview, to be confirmed in Obsidian. Then, from checklist point 20: loot carries over into session N+1 with its origin (`packages/session/src/loot.ts`, tested; DECISIONS 2026-10-25), plus the command **Start next session**; to be checked in Obsidian. (2) The Log button in the notice was
too small — now a full-width accent button, notice ten seconds. The maintainer also cleaned the
example vault (broken notes moved to `test/fixtures/vault`, a fifth faction The Muddled Psalter).

## Where to continue

1. The maintainer's check in Obsidian, the lists under "Half-finished". Fix what turns up — the
   likeliest places: card mounting (`src/obsidian/card-view.ts`), pointer handling in the drawings
   (`pan-zoom.ts`, `world-graph-svg.ts`, `faction-view-svg.ts`), the popover (`popover.ts`) and the
   session log (`session-log.ts`).
2. Then follow `docs/2026-10-25-concept-next-steps.md` (written 2026-10-25 at the maintainer's
   request): its §5 lists four decisions to get from the maintainer first — order, integrate vs own
   code for modules 2–4, `happy-dom` for UI smoke tests, release path and name.

## State of the working tree

Branch `claude/roadmap-and-handoff-nb9sav`, pushed; `main` fast-forwarded to it at the maintainer's
request (2026-10-24) and kept in step since, so `git pull` on `main` brings everything. `examples/vault/.obsidian/graph.json` may show as modified after opening the
vault: never commit it as part of a task.

## Done this session

- Maintainer's answers: phase 2 not tested yet (tomorrow); layout with **d3-force**; world view in
  **its own tab**; then "passt, weiter" = plan approved, build.
- `88a10f5` phase 3 spec and plan. `9448cdb` graph and matrix models (Public proven equal to a
  secret-free world); `7fd45df` d3-force layout (deterministic, cached start, pins, blocs test);
  `60e6956` step-name settings; `8b86a8f` the view: tab, header switches, SVG graph with pan/zoom,
  selection, pinning, matrix, clicks into the card, card focus by entry and "add relation for X".
- Phase 4: the maintainer chose the faction view inside the world tab and the tension panel in the
  right sidebar, then "passt". `7c586e8` spec and plan; `846ec98` tension rules and faction view
  model; `1ff2dfd` drawing, drill-down with breadcrumb, tension sidebar, thresholds, shared pan/zoom
  and mode store. Seen in the browser preview: The Gutter Court's view (with and without Mira Voss
  selected; member arrows were first hidden behind the frame, fixed) and the panel in True mode.
- Phase 5: the maintainer chose a "Log" notice, a popover on cells and arrows and the once-a-day
  N+1 offer, then "passt". `2831489` spec and plan; `86331b8` `packages/session` (tonight's session,
  log lines, parsing) and history resolution; `951a54a` popover, logging, session N+1, tooltips (the
  graph, matrix and faction view models lost their unused edit targets). Seen in the browser
  preview: popover for The Bench (True), Isolde Ferrant (inherited), docked at phone width.
- Example vault: Ilex → The Archivists +2 and Elder Wren → The Drowned Choir −3 (with a reason), so
  the Party and Unaffiliated frames have arrows; `Home.md` rows for graph and matrix.
- Design pass over every view at the maintainer's request (cleaner, closer to Obsidian): rules at
  the top of `styles.css` and in DECISIONS.md; checked in the browser preview at desktop and phone
  width (a mid-word break of long step names on phones fixed).
- Rendered in Chromium against a stub of the Obsidian API with the example vault's data: graph in
  Public and True and the matrix, no runtime errors. Layout loosened after the first look (labels
  overlapped), frame arrows given a stub out of the frame.

## Half-finished — check in Obsidian

Reload the plugin in `examples/vault` (`pnpm build && pnpm install-example` in the plugin folder).

**Phase 2 — faction card**

1. **Placement**: The Drowned Choir, Sable, Corvin Marsh in Reading view and Live Preview: the card
   below the inline title where Properties were, scrolling with the note, Properties gone; Source
   mode raw YAML. If the card sits at the very top instead, the selectors in `card-view.ts` do not
   match this Obsidian version.
2. **Live Preview**: clicks in the card must not move the editor's cursor or scroll the note.
3. **Edits**: slider, reason, rename with suggestions, add and remove (Undo), power pip, `name`.
   After each, `git diff examples/vault` shows only the intended characters. Revert afterwards.
4. **Fix**: "Show faction warnings" → Fix on each Drowned Choir row; only The Salt Kings may remain.
   Brother Silt and The Missing Bellringer listed under Notes, without Fix.
5. **Secrets**: Sable's secret section closed on opening, closed again after switching notes.
6. **Settings**: "Show Obsidian's properties" shows both; step names (below) rename the steps in the
   card at once.
7. **Mobile**: `app.emulateMobile(true)`: rows wrap, × stays on the target's line.

**Phase 3 — faction world**

8. **Open**: command "Open faction world" and the ribbon icon open one tab; a second call reveals
   it. Public is active, Graph or Matrix as last time.
9. **Graph**: the layout looks like the browser preview (Order and Court apart, Bench tied to the
   Court, frames with Ilex's and Elder Wren's arrows, Salt Kings ghost). Pan, wheel and pinch zoom,
   drag a faction (it stays after reopening), re-layout releases pins. Click selects and dims the
   rest; double-click opens the note in a note tab (the world tab stays); an arrow opens the note
   with the card on that entry.
10. **True**: The Bench → Order appears dashed (+4); nodes do not move when toggling.
11. **Matrix**: The Bench → Order dashed −4 (inherited from the Court) in Public, solid +4 in True;
    clicking it opens The Gutter Court's note on that entry (Public) or The Bench's (True); an empty
    cell opens "+ Add relation" with the name filled in.
12. **Live update**: change a value in the card → graph and matrix recolour without re-laying out.
13. **Mobile**: header wraps, matrix scrolls both ways, touch pan and pinch zoom.

**Phase 4 — faction view and tensions**

14. **Drill-down**: click The Gutter Court in the graph → its view; breadcrumb `Faction world ›
The Gutter Court`; click The Bench chip → one level deeper, breadcrumb back works; Ctrl/Cmd-click
    on a graph node opens its note instead.
15. **Rings and arrows**: Mira Voss and The Bench ringed, Sable not; click Mira → only her arrows,
    the inherited −4 towards the Order dashed; an arrow click opens the card on that entry (for the
    inherited one: The Gutter Court's note).
16. **Tension panel**: the lightning button in the world tab's own header opens it in the right
    sidebar; Public lists Ondine,
    Mira, Aldric, Corvin out of line; toggling True in the world tab updates the panel (The Bench,
    Sable, public-vs-true lines); closing the world tab returns it to Public. Names open notes,
    values the card.
17. **Thresholds** in the settings change the panel at once.

**Phase 5 — popover and history**

19. **Popover**: Matrix → The Bench × Order of the Lantern: Public shows −4 "inherited from The Gutter
    Court"; moving the slider writes a new `Order of the Lantern:` line into The Bench's own note
    (check with `git diff`), never the Court's. True: its own secret +4 with "Reset to inherited"
    (Undo works). Arrows in graph and faction view open it too; Esc, ✕ and a click outside close it.
20. **Log**: after a change a notice "Log → Session 14 – Bell Square"; dragging back and forth
    gives one notice. Click → the first time today a dialog offers Session 15: Create makes
    `Silverstadt/Sessions/Session 15.md` from `Templates/Session.md` (date today, session 15) and
    logs there; Keep logs into Session 14 after `- 21:40 …`, before `## Loot`. A True-mode change
    lands in a `> [!gm]` callout. Revert the vault afterwards.
21. **History**: the tooltip of Order → Court (arrow and matrix cell) shows `−2 → −3 in S14`; a
    secret logged change appears only in True mode.
22. **Card** changes offer the Log notice too.

**Design pass (all views)**

23. The card looks native next to the note: Obsidian's slider style, icon buttons only on hover,
    tags in the theme's tag style; check a light theme and one community theme too. The world tab's
    re-layout button sits in Obsidian's tab header and is hidden outside the graph.

## Decisions taken this session

In `plugins/dnd5e-bylokianer/DECISIONS.md` ("The faction world: its own tab, d3-force, edits
through the card"; "Faction view inside the world tab, tensions in the sidebar") and the specs' §7. Built deviations: click targets name note, field and
target id (not a raw key); characters without any faction relation get no matrix row.

## Open questions for the maintainer

- The "calls I made" sections of the phase 2–5 specs — confirm or correct after trying them.

## Watch out

- Verify with `pnpm check`; never chain verification and commit with `;`. Clean up before every
  commit (CLAUDE.md).
- Prettier is enforced (`pnpm format`; the `pre-commit` hook and CI refuse otherwise). It is not
  idempotent on inline code spanning two lines in Markdown — keep such spans on one line.
- The Write tool and shell heredocs can turn a backslash-u escape (the BOM) into the literal
  character; check with grep for the raw bytes after writing such code.
- In a fresh clone run `git config core.hooksPath .githooks`.
- TypeScript stays at 6.0.3 until typescript-eslint supports a newer version.
- `test/world.example.test.ts` treats the example vault as the contract.
- `eslint-plugin-obsidianmd` forbids disabling its rules; settings implement both `display()` and
  `getSettingDefinitions()`.
- The browser preview harness lives only in the session scratchpad: a stub `obsidian` module
  (Component, debounce, Keymap, MarkdownRenderer, Notice, setIcon, AbstractInputSuggest), the
  Obsidian DOM helpers (`createEl`, `createSvg`, `setCssProps` …) on the prototypes, data from
  `buildWorld(loadExampleVault())`, bundled with esbuild aliasing `obsidian`, shot with Playwright.
- The private vault's daily report and changelog for today still need writing by a local session.

## Verification

`pnpm check` at the root: exit 0; 155 plugin tests and 9 package tests pass (64 at the start of the day).
