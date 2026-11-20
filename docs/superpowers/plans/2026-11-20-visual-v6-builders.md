# Visual refactoring V6 — Builders and dialogs — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this
> plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The New NPC dialog, the spell, monster and deck builders (and the encounter builder's
party chips) in style C: the form's headings and the preview's heads as section heads, chips and
the preview's tags as pills, the spell preview's casting time, range, components and duration as
tiles — as on the spell card (V4).

**Spec:** `docs/superpowers/specs/2026-11-20-visual-refactoring-design.md` (§2, §3 V6).

## Rulings made while planning

- **Form headings** (Obsidian's `Setting.setHeading()`) get the section-head look by CSS, in one
  rule for every builder; the DOM stays Obsidian's.
- **The picker tiles** (races, classes, archetypes, schools, sources) stay: they already are tiles
  with an icon and a selected state.
- **The NPC preview's short stats** (AC, HP, CR, Speed pills) stay: `renderShortStats` is shared
  with the faction card, accepted in V3.
- **The monster builder's preview** is the stat block, restyled in V1; only its head changes.
- The spell preview's old grid (`dnd5e-spells-grid*`) and the card-tag styles are removed.

## Review Focus

1. Chips as buttons against Obsidian's button rules (rest, hover, active, focus ring).
2. The spell preview's school colour on its head and top border.
3. Light theme: active chips, tiles in the preview.
4. Narrow dialogs (below 760 px the preview moves above the form).

### Task 1: Builders

- [x] Tests first: the preview head is a section head, tags are pills (NPC, deck, spell), flags
      carry `dnd5e-pill`, the spell preview's tiles with their labels, "At higher levels" as a
      section head — RED (6 failing).
- [x] Implement in `npc-dialog.ts`, `spell-builder.ts`, `monster-builder.ts`, `deck-builder.ts`,
      `encounter-builder.ts`, `styles/npc-builder.css`, `styles/builders.css`,
      `styles/spellbook.css` — GREEN.

### Task 2: Look, docs, check

- [x] Screenshots (NPC, spell dark and light German, deck).
- [x] Docs, `pnpm check`, commit, push.
