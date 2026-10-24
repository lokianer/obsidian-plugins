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

2026-10-24, cloud (third session of the day). Phase 3 (faction world: graph and matrix) specified,
approved by the maintainer ("passt, weiter") and built in full — before phase 2 was checked in
Obsidian, at the maintainer's word. **Neither phase 2 nor phase 3 has run inside Obsidian yet**; the
maintainer tests both on 2026-10-25 on the PC.

## Where to continue

1. The maintainer's check in Obsidian, both lists under "Half-finished". Fix what turns up — the
   likeliest places: the card mounting (`src/obsidian/card-view.ts`) and pointer handling in the
   graph (`src/obsidian/world-graph-svg.ts`).
2. Once phases 2 and 3 are accepted: spec and plan **phase 4 — faction view and tension panel**
   (design §5.2, §5.3), review stop, build.

## State of the working tree

Branch `claude/roadmap-and-handoff-nb9sav`, pushed, not merged into `main` (the maintainer decides:
merge or pull request). `examples/vault/.obsidian/graph.json` may show as modified after opening the
vault: never commit it as part of a task.

## Done this session

- Maintainer's answers: phase 2 not tested yet (tomorrow); layout with **d3-force**; world view in
  **its own tab**; then "passt, weiter" = plan approved, build.
- `88a10f5` phase 3 spec and plan. `9448cdb` graph and matrix models (Public proven equal to a
  secret-free world); `7fd45df` d3-force layout (deterministic, cached start, pins, blocs test);
  `60e6956` step-name settings; `8b86a8f` the view: tab, header switches, SVG graph with pan/zoom,
  selection, pinning, matrix, clicks into the card, card focus by entry and "add relation for X".
- Example vault: Ilex → The Archivists +2 and Elder Wren → The Drowned Choir −3 (with a reason), so
  the Party and Unaffiliated frames have arrows; `Home.md` rows for graph and matrix.
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

## Decisions taken this session

In `plugins/dnd5e-bylokianer/DECISIONS.md` ("The faction world: its own tab, d3-force, edits
through the card") and the phase 3 spec §7. Built deviations: click targets name note, field and
target id (not a raw key); characters without any faction relation get no matrix row.

## Open questions for the maintainer

- Spec §7 of phase 2 (card) and phase 3 (world view) — confirm or correct after trying them.
- Merge the branch into `main`, or a pull request?

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

`pnpm check` at the root: exit 0; 140 tests pass (64 at the start of the day).
