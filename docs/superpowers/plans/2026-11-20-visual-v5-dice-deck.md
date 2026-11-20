# Visual refactoring V5 — Dice tab and Deck of Many Things — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this
> plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The Dice tab and the Deck of Many Things in style C: section heads, pills for quick dice,
tables, verdicts and this drawing's cards, the roll total as a tile, the deck's numbers as tiles,
zebra rows for rolls and draws. The dice stage and the playing card stay as they are.

**Spec:** `docs/superpowers/specs/2026-11-20-visual-refactoring-design.md` (§2, §3 V5).

## Rulings made while planning

- **The deck's size pill becomes three tiles** — cards, gone (left the deck for good), draws —
  under the header; the header keeps the title, the rules line and the tools.
- **Verdicts as pills** tinted green / red (success was yellow text before); the text colour is
  mixed with the normal text colour so it stays readable on the light theme.
- **The deck grid's cards stay** as they are: they already are tiles, and the playing-card look
  belongs with the card on the stage.

## Review Focus

1. Pills as buttons against Obsidian's button rules (rest, hover, focus ring).
2. A section head with its refresh or ⋮ button at the end.
3. A narrow tab (380 px) and German labels in the deck's tiles.
4. Light theme: verdict pills, zebra rows.

### Task 1: Dice tab and deck

- [x] Tests first in `describe('dice')` and `describe('deck of many things')`: heads, the total
      tile, verdict and dice pills, the deck's tiles and drawn pills — RED.
- [x] Implement in `dice-view.ts`, `deck-view.ts`, `styles/dice-tab.css`, `styles/deck.css`,
      strings `deck.tile.*` — GREEN.

### Task 2: Look, docs, check

- [x] Screenshots (dice 1000 px, light German; deck 1100 px, 380 px German).
- [x] Docs, `pnpm check`, commit, push.
