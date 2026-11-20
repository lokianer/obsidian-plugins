# Visual refactoring V2 — Battle tab and encounter builder — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this
> plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The Battle tab and the encounter builder's summary card in style C, built from the V1
building blocks.

**Architecture:** `battle-view.ts` uses `tiles()`/`tile()` for the combatant's numbers,
`sectionHead()` for its section titles and pills for conditions; `encounter-builder.ts`'s summary
card shows budget, spent and left as tiles and the rating as a pill. CSS in `styles/battle.css`
and `styles/encounter-builder.css`. No behaviour changes.

**Tech Stack:** TypeScript, Obsidian API, Vitest + happy-dom.

**Spec:** `docs/superpowers/specs/2026-11-20-visual-refactoring-design.md` (§2, §3 V2, §6).

## Global Constraints

As in V1: only Obsidian variables, text ≥ 16 px, `createEl` only, English and German, lint limits
(complexity 20, 150 lines per function), no behaviour or note changes. The encounter builder's
modal layout (`dnd5e-npc-*`, shared with the New NPC dialog) and `dnd5e-builder-flag` are V6;
V2 changes only its summary card.

## Review Focus

1. **A phone or a narrow pane:** list above the card, numbers as 2×2 tiles, nothing overflows.
2. **Before the fight (round 0):** initiative inputs and move buttons in the rows still work.
3. **A combatant who is down:** death-save buttons and the red "down" pill stay visible.
4. **Hand-written conditions** (not SRD) still show as active pills and remove on a click.
5. **Experience points off:** the encounter card shows percent, no XP tiles with empty values.

---

### Task 1: Battle tab

**Files:** `src/obsidian/battle-view.ts`, `styles/battle.css`, `test/ui/views.test.ts`
(`describe('battle tab')`).

- [ ] **Step 1: Tests first.** In the battle tab test: the picked card shows
      `texts(el, '.dnd5e-battle-card .dnd5e-tile-label')` `['HP', 'Temp', 'AC', 'Init']` (EN labels
      from `battle.*Label`); the condition buttons are `.dnd5e-battle-condition` with `dnd5e-pill`
      (`click('.dnd5e-battle-condition', 'Prone')` replaces `click('.dnd5e-builder-flag', 'Prone')`),
      active ones `is-active`; row chips carry `dnd5e-pill`; `.dnd5e-battle-section` elements are
      section heads (`dnd5e-section-head`); the side marker is `.dnd5e-battle-side.dnd5e-pill`.
- [ ] **Step 2: Run** `pnpm --filter dnd5e-bylokianer exec vitest run test/ui/views.test.ts` — the
      new assertions fail.
- [ ] **Step 3: Implement.** `renderCard`: numbers via `tiles()` + `tile()` (HP value `41`, note
      `/ 59`); side as a pill tinted with the side colour; Damage tinted red, Heal green (soft tints);
      conditions and Concentration as `button.dnd5e-pill.dnd5e-battle-condition`. Section titles via
      `sectionHead()` plus `dnd5e-battle-section`. Row chips get `dnd5e-pill`. `renderCard` split into
      named parts (head, numbers, hit points, death saves, conditions, block) so it drops under the
      150-line limit. CSS: `.dnd5e-battle` becomes the container; the 700 px media query becomes a
      container query.
- [ ] **Step 4: Run** the test file — PASS; `pnpm check` with the example vault as committed.

### Task 2: Encounter builder summary card

**Files:** `src/obsidian/encounter-builder.ts`, `styles/encounter-builder.css`,
`test/ui/views.test.ts` (`describe('encounter builder')`).

- [ ] **Step 1: Tests first.** With experience on: `.dnd5e-encounter-card .dnd5e-tile-label`
      `['Budget', 'Spent', 'Left']` (new strings `encounterBuilder.tile.budget|spent|left`, DE
      `Budget`, `Verbraucht`, `Übrig`), values from the existing example (budget and spent as in the
      existing `.dnd5e-encounter-spent` assertion); the rating is `.dnd5e-encounter-rating.dnd5e-pill`.
      Existing assertions on `.dnd5e-encounter-spent`, `-left`, `-rating` keep their texts.
- [ ] **Step 2: Run** — FAIL.
- [ ] **Step 3: Implement** in `drawPreview`: a `tiles()` row before the meter when experience is
      on (over budget: the Left tile shows the overshoot with `is-over`, red); the rating as a pill; the
      monster lines as list rows. `drawPreview` split so its complexity drops under 20.
- [ ] **Step 4: Run** — PASS; then `pnpm check`.

### Task 3: Look, docs, check

- [ ] Screenshots with the scratchpad harness (Battle tab and encounter builder at 900 px and
      328 px, dark and light).
- [ ] DECISIONS (append to "Visual refactoring: style C" a V2 paragraph), CHANGELOG Unreleased,
      ROADMAP (V1 accepted 2026-11-20, V2 built), HANDOFF; install into the example vault.
- [ ] `pnpm format`, `pnpm check`, one commit `feat(dnd5e): visual refactoring V2, Battle tab and
encounter builder`, final review, push.
