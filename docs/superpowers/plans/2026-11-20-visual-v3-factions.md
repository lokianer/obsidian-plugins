# Visual refactoring V3 — faction views — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this
> plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The faction card, the tension panel and the warnings dialog in style C, built from the
V1 building blocks.

**Architecture:** `card-render.ts` gets a tile row (Power with its pips, Allies, Enemies) on
faction cards; `.dnd5e-card-section-title` (card sections, collapsible toggles, tension groups)
becomes a section head by sharing the `.dnd5e-section-head` rules in `styles/base.css`; relation
rows get the row background of the stat block's action rows. `warnings-modal.ts` builds its
numbers with `tiles()`/`tile()` and its group titles with `sectionHead()`; subjects become pills.
The tension panel's mode tag becomes a pill. No behaviour changes.

**Tech Stack:** TypeScript, Obsidian API, Vitest + happy-dom.

**Spec:** `docs/superpowers/specs/2026-11-20-visual-refactoring-design.md` (§2, §3 V3).

## Global Constraints

As in V1/V2: only Obsidian variables, text ≥ 16 px, `createEl` only, English and German, lint
limits (complexity 20, 150 lines per function), no behaviour or note changes.

## Rulings made while planning

- **The SVG canvases (world graph, faction view) and the matrix stay as they are.** They are
  drawings with their own visual language (D38: hues, initials, soft value tints), and the matrix
  cells already are tinted tiles. Style C has nothing to add there without redrawing them, which
  the spec's non-goals rule out. Cost if wrong: one more small phase for them.
- **The value popover stays as it is.** It is a slider, a value and one line; a tile or a section
  head would only make it taller. Cost if wrong: a CSS touch later.
- **Tiles only on faction cards.** The spec names "power / allies / enemies on the faction card";
  a character's card keeps its short stats (AC, HP, CR, Speed) under the name.
- **Allies and enemies** count the public relations with a value above 0 and below 0.

## Review Focus

1. Power editing: a pip click still writes `power`; `data-focus="power"` still finds the box.
2. A faction without `power`: no Power tile, Allies and Enemies still shown.
3. Narrow pane / phone: tiles wrap, relation rows keep their slider usable.
4. Collapsible toggles (secret relations, other fields) keep their chevron, count and detail line.
5. The warnings dialog with no warnings: the stats and the clean message only.

---

### Task 1: Faction card

**Files:** `src/obsidian/card-render.ts`, `src/i18n/strings.ts`, `styles/faction-card.css`,
`styles/base.css`, `test/ui/views.test.ts` (`describe('faction card')`).

- [ ] Tests first: on `Order of the Lantern` the card shows
      `texts(root, '.dnd5e-card .dnd5e-tile-label')` `['Power', 'Allies', 'Enemies']` and values
      `['4', '1', '1']`; the Power tile is `.dnd5e-card-power` with five `.dnd5e-card-pip`; a pip
      click writes power (existing behaviour, asserted through the write stub if reachable, else
      the pip count). A character card (`Sable`) has no `.dnd5e-tiles`. New strings `card.allies`
      / `card.enemies` (DE `Verbündete`, `Feinde`).
- [ ] Run — FAIL. Implement `renderPower` into a `tile()`; Allies / Enemies tiles. Run — PASS.
- [ ] CSS: `.dnd5e-card-section-title` joins `.dnd5e-section-head`; relation rows on
      `--background-secondary`, hover kept.

### Task 2: Tension panel and warnings dialog

**Files:** `src/obsidian/tension-view.ts`, `src/obsidian/warnings-modal.ts`, `styles/tensions.css`,
`styles/warnings.css`, `test/ui/views.test.ts`.

- [ ] Tests first: tension panel mode tag is `.dnd5e-pill`; the warnings dialog shows
      `.dnd5e-warnings-stats .dnd5e-tile-value` `['7', '15', '8']` (example vault as committed)
      and labels; group titles are `.dnd5e-section-head`; subjects `.dnd5e-warnings-chip.dnd5e-pill`.
- [ ] Run — FAIL. Implement. Run — PASS.

### Task 3: Look, docs, check

- [ ] Screenshots (card, character card, tensions, warnings; 900 px and 380 px; light; German).
- [ ] DECISIONS (V3 paragraph), CHANGELOG, ROADMAP (V2 accepted, V3 built), HANDOFF; install.
- [ ] `pnpm format`, `pnpm check`, one commit `feat(dnd5e): visual refactoring V3, faction views`,
      final review, push.
