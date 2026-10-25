# Factions Phase 4 — Faction View and Tension Panel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Status:** approved ("passt", 2026-10-24) and built; tasks 1–5 done, task 6 awaits the maintainer's check in Obsidian. **Accepted in Obsidian on 2026-10-25.**

**Goal:** Drill down from the faction world into one faction (members, own vs inherited arrows,
rings on deviating members) and a sidebar listing the campaign's tensions.

**Architecture:** Pure models `faction-view.ts` and `tension.ts` in `src/factions/`, tested on the
example vault; drawing in `src/obsidian/`, reusing phase 3's world cache, mode toggle, click targets
and the phase 2 card focus.

**Spec:** `docs/superpowers/specs/2026-10-24-faction-view-design.md`.

## Global Constraints

Everything of the earlier plans. No new dependency. Public mode never reads `secret_relations`
(tests compare against a secret-free world). Clean up before every commit, then `pnpm check`.

## Review Focus

1. **No secret in Public**: faction-view and tension models in Public equal those of a secret-free
   world; the public-vs-true rule yields nothing in Public — Tasks 1, 2.
2. **Inheritance**: Isolde Ferrant's arrows are all inherited from the Order; Corvin Marsh's own −3
   towards the Order is solid and ringed — Task 2.
3. **Rules on the example vault**: Ondine Vale out of line towards the Court; The Bench public vs
   true towards the Order (True only); Order ↔ Court one-sided only if the difference reaches the
   threshold — Task 1.

---

### Task 1: Tension rules

`src/factions/tension.ts`, `test/tension.test.ts`.

- [ ] `findTensions(world, mode, thresholds)` → findings per rule, each with the entities, values,
      difference and edit targets (note, field, target id) for the values involved.
- [ ] Tests on the example vault and on small worlds per rule (boundary at the threshold, missing
      direction, sign of "out of line", allies split), Public equal to a secret-free world.

### Task 2: Faction view model

`src/factions/faction-view.ts`, `test/faction-view.test.ts`.

- [ ] `buildFactionView(world, id, mode)` → frame (name, power, members: characters and sub-factions
      with `ring`), surrounding boxes (targets only), external characters by their faction, arrows
      (from frame or member, own or inherited with source, value, why, differs, edit target).
- [ ] Works for Party and Unaffiliated. Tests: Gutter Court members and rings, Isolde inherited,
      Corvin own and ringed, Public equals secret-free.

### Task 3: Drawing the faction view

`src/obsidian/faction-view-svg.ts`, `styles.css`.

- [ ] Frame with member chips (rings, sub-faction boxes), surrounding boxes on a ring in world-graph
      angle order, external character nodes; default arrows; member selection with inherited dashed
      arrows; tooltips; clicks into notes and card; pan/zoom shared with the graph code.

### Task 4: Drill-down in the faction world

`src/obsidian/world-view.ts`, `world-graph-svg.ts`, strings.

- [ ] Node and frame click → faction view; breadcrumb; header controls per spec §4.1; state kept
      while the tab lives.

### Task 5: Tension panel

`src/obsidian/tension-view.ts`, `settings.ts`, `main.ts`, strings, `styles.css`.

- [ ] Right-sidebar view, command "Show faction tensions", header button in the world tab; follows
      the world tab's mode (Public without one); rule groups with linked sentences; thresholds in
      settings (both settings APIs).

### Task 6: Docs, example vault, preview

- [ ] README, CHANGELOG, DECISIONS (spec §7), `Home.md` rows for faction view and tensions.
- [ ] Browser preview (stub harness) of a faction view and the panel.
- [ ] ROADMAP, HANDOFF.
