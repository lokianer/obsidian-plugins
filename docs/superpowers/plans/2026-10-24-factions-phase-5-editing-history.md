# Factions Phase 5 — In-view Editing and History — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Status:** approved ("passt", 2026-10-24) and built; tasks 1–7 done, task 8 awaits the maintainer's check in Obsidian. **Accepted in Obsidian on 2026-10-25.**

**Goal:** A value popover on matrix cells and arrows, an opt-in log line in tonight's session note
after every relation change (with the once-a-day offer to create session N+1), and history in the
views' tooltips.

**Architecture:** A shared pure package `packages/session/` (tonight's session, log lines, history
parsing), plugin-side resolution of history to entities, and Obsidian UI for the popover and the
log notice. Writes stay line edits through `vault.process`.

**Spec:** `docs/superpowers/specs/2026-10-24-in-view-editing-history-design.md`.

## Global Constraints

Everything of the earlier plans. `packages/session` imports nothing from Obsidian or the plugin.
Nothing is logged without a click. Secret changes only inside `[!gm]` and only shown in True mode.
Clean up before every commit, then `pnpm check`.

## Review Focus

1. **Subject's own note**: a popover change on Isolde Ferrant's inherited value adds an entry to
   Isolde's note, never the Order's — Task 5.
2. **Log placement**: in Session 14 the new line lands after `- 21:40 …`, before `## Loot`; a CRLF
   note stays CRLF — Task 2.
3. **Secret**: a True-mode change logs inside `> [!gm]`; its history does not appear in Public —
   Tasks 2, 4.
4. **Round trip**: every line the formatter writes is parsed back to the same pair and values,
   including `−`, `-` and `—` — Tasks 2, 3.

---

### Task 1: Package scaffold

`packages/session/` with `package.json`, `tsconfig.json`, `vitest.config.ts`, `eslint.config.mts`,
`src/index.ts`; `pnpm-workspace.yaml` gains `packages/*`; the plugin depends on it (workspace).

- [ ] `pnpm check` runs the package's lint, typecheck and tests; the plugin bundles it.

### Task 2: Log lines

`packages/session/src/log.ts`, tests.

- [ ] `formatLogLine({ time, from, to, before, after })`; `appendToLog(text, line, { secret })`
      inserting under `## Log` per spec §5.2, keeping line endings; tests on Session 14's text.

### Task 3: Tonight's session and history

`packages/session/src/tonight.ts`, `history.ts`, tests.

- [ ] `findTonight(notes, scope)`, `needsNext(tonight, today)`,
      `nextSessionText(template, n, today)`, `parseLog(text)` → entries (time, from, to, before,
      after, secret); round-trip test against `formatLogLine`; the example vault's Session 14 line
      parses.

### Task 4: History in the world

`plugins/dnd5e-bylokianer/src/factions/history.ts`, tests.

- [ ] Resolve parsed entries to entity id pairs with the key lookup; `historyFor(from, to, mode)`
      newest first; Public hides secret entries. Example vault: Order → Court `−2 → −3 in S14`.

### Task 5: The popover

`src/obsidian/popover.ts`, `world-matrix.ts`, `world-graph-svg.ts`, `faction-view-svg.ts`,
`styles.css`, strings.

- [ ] Popover per spec §4 at cells and arrows; writes via the card model's rows of the subject's note
      (set / add / remove with expect); Reset to inherited; Open card; phone docking.

### Task 6: Logging and session N+1

`src/obsidian/session-log.ts`, `card-render.ts`, `popover.ts`, `settings.ts`, `main.ts`.

- [ ] After a value change (card or popover): Log notice; on click the N+1 offer when due (modal
      with two buttons), then `appendToLog` through `vault.process`; template setting; the day's
      answer in plugin data.

### Task 7: History in tooltips

`src/obsidian/session-log.ts` (history cache), `world-graph-svg.ts`, `world-matrix.ts`,
`faction-view-svg.ts`.

- [ ] Cache parsed session notes, rebuild on change; tooltips add the three newest changes per mode.

### Task 8: Docs, example vault, preview

- [ ] README, CHANGELOG, DECISIONS (spec §8), `Home.md` rows; browser preview of the popover;
      ROADMAP, HANDOFF.
