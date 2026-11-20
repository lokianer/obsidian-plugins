# Visual refactoring V4 — Spellbook and Monster Manual — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this
> plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The Spellbook and the Monster Manual (which shares its layout) in style C: filter
pills, levels and challenge ratings as section heads, the selected row tinted with the accent,
and the spell card's numbers as tiles, its badges and classes as pills, its sections as heads.

**Spec:** `docs/superpowers/specs/2026-11-20-visual-refactoring-design.md` (§2, §3 V4).

## Rulings made while planning

- **No CR / level badge at the row's end.** The list is grouped under a sticky head per level or
  challenge rating, which already is that badge; a second one on every row would repeat it.
- **The two panes keep their own grid** (each scrolls on its own, as the Battle tab) instead of
  `split()`; they fold by a named container query at 560 px of the tab's width — the Battle
  tab's fold point — instead of 640.
- **The spell builder's preview keeps the old grid** (`.dnd5e-spells-grid`) until V6.

## Review Focus

1. Filter pills against Obsidian's button styles (rest, hover, active, school-tinted active).
2. The sticky level head over scrolling rows; keyboard selection (arrow keys) and its outline.
3. A narrow tab or phone: card replaces the list, back button, pills scroll sideways.
4. A spell without badges, without "At higher levels".
5. German labels in the tiles.

### Task 1: Spellbook and Monster Manual

- [x] Tests first in `describe('spellbook')` and `describe('monster manual')`: tiles' labels and
      values, badges and classes as pills, section heads, level heads, active chip pills — RED.
- [x] Implement in `spellbook-view.ts`, `monster-manual-view.ts`, `styles/spellbook.css` — GREEN.

### Task 2: Look, docs, check

- [x] Screenshots (1000 px, 380 px German, light; Monster Manual).
- [ ] Docs, `pnpm check`, commit, final review, push.
