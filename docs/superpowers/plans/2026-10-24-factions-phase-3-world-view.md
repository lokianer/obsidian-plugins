# Factions Phase 3 — World View — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Status:** approved ("passt, weiter", 2026-10-24) and built; tasks 1–8 done, task 9 awaits the
maintainer's check in Obsidian. Deviation: click targets name note, field and target id instead of a
raw key (the card rows know their target id). **Accepted in Obsidian on 2026-10-25.**

**Goal:** A "Faction world" tab with a graph (bloc layout, d3-force) and a matrix of all factions,
a Public/True toggle (Public on open), a warnings badge, clicks that lead into the faction card, and
step-name settings.

**Architecture:** Pure models for graph, matrix and layout in `src/factions/` (tested in Node,
d3-force runs there too), thin Obsidian drawing in `src/obsidian/`. The phase 2 world cache feeds
the view; the phase 2 card is the editor clicks lead to.

**Tech Stack:** as before, plus `d3-force` 3.0.0 and `@types/d3-force` (justified in the spec §3).

**Spec:** `docs/superpowers/specs/2026-10-24-world-view-design.md`.

## Global Constraints

Everything of the phase 1 and phase 2 plans, plus:

- `src/factions/layout.ts` is the only importer of `d3-force`; nothing in `src/factions/` touches the
  DOM.
- Public mode never reads `secret_relations` — every model function takes the mode, and a test
  builds the Public model from a world whose secret values are all ±5 to prove none leaks.
- Clean up before every commit (CLAUDE.md), then `pnpm check`.

## Review Focus

1. **No secret in Public**: graph and matrix models in Public mode equal those of a world with every
   `secret_relations` removed — Tasks 1, 2.
2. **Inheritance in the matrix**: The Bench → Order of the Lantern shows −4 inherited from The Gutter
   Court in Public, and its own +4 in True — Task 2.
3. **Stable layout**: the same input gives the same positions; a changed value keeps positions; a
   new faction moves the others little (cached start) — Task 3.
4. **Blocs**: in the example vault, mutually positive pairs end closer than mutually negative ones —
   Task 3.
5. **Click targets**: arrow and cell clicks resolve to (note path, field, raw key) of the entry that
   holds the value — Tasks 1, 2.

---

### Task 1: Graph model

`src/factions/world-graph.ts`, `test/world-graph.test.ts`.

- [ ] `buildGraph(world, mode)` → nodes (faction with power and parent, frame with character rows,
      ghost) and edges (source node or frame row, target node, value, why, true-differs flag,
      click target: note path, field, raw key). Own values only; sub-faction ties as separate links.
- [ ] Raw keys for click targets come from the card model's rows (`buildCard`), not re-derived.
- [ ] Tests on the example vault: 5 factions + Bench tie, Party and Unaffiliated frames with their
      characters, the Salt Kings ghost, Order → Court −3 and Court → Order −4 as two edges; Public
      equals a secret-free world.

### Task 2: Matrix model

`src/factions/matrix.ts`, `test/matrix.test.ts`.

- [ ] `buildMatrix(world, mode)` → row and column headers (sub-factions indented, Party and
      Unaffiliated groups, ghosts last) and cells via `stance()` with value, step, inherited source,
      true-differs flag and click target (own note or source note; empty cell → add target).
- [ ] Tests: Bench → Order inherited −4 (Public) / own +4 (True); diagonal blank; empty = no
      relation; Public equals a secret-free world.

### Task 3: Layout

Add `d3-force`, `@types/d3-force`. `src/factions/layout.ts`, `test/layout.test.ts`.

- [ ] `layout(graph, cached, options)` → positions by node id: deterministic start (sorted ids,
      cached where present, pinned kept), forces of spec §4.2, fixed tick count, no timers.
- [ ] Tests: determinism; value change keeps positions (cache); blocs distance check on the example
      vault; pinned nodes stay.

### Task 4: Step-name settings

`src/factions/steps.ts`, `src/obsidian/settings.ts`, strings, tests.

- [ ] `stepName(value, t, custom)` with custom names (empty = default); settings tab (both the
      declarative definitions and `display()`) with eleven fields; card and view read them.

### Task 5: The view shell

`src/obsidian/world-view.ts`, `src/main.ts`, `styles.css`, strings.

- [ ] `ItemView` `dnd5e-faction-world`, command "Open faction world", ribbon icon; reveal an
      existing tab; header with Graph/Matrix (remembered), Public/True (Public on open), warnings
      badge, re-layout; empty state without campaign; subscription to the world cache.

### Task 6: Graph drawing

`src/obsidian/world-graph-svg.ts`, `styles.css`.

- [ ] SVG with `createSvg`: nodes, frames, ghosts, bowed arrows with markers, hatching for
      true-differs, `<title>` tooltips; pan, wheel/pinch zoom, fit on open; select / clear; drag pins
      and caches; double-click / Ctrl-click opens the note; arrow click → card focus.
- [ ] Layout re-runs only when nodes or relation pairs changed; recolour otherwise.

### Task 7: Matrix drawing

`src/obsidian/world-matrix.ts`, `styles.css`.

- [ ] Table with sticky header and first column, cells with colour, number, step name, dashed for
      inherited; click → card focus or "add relation for X".

### Task 8: Card focus targets

`src/obsidian/card-view.ts`, `card-render.ts`.

- [ ] Focus by (field, raw key) and "add relation with target X" in addition to warnings; used by
      tasks 6 and 7.

### Task 9: Docs, example vault, preview

- [ ] README, CHANGELOG, DECISIONS (spec §7, d3-force), `Home.md` rows for graph and matrix.
- [ ] Browser preview of the view (stub harness as in phase 2) at desktop and phone width.
- [ ] ROADMAP, HANDOFF; maintainer's check in Obsidian.
