# Catalogue K2 — monsters — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox
> (`- [ ]`) syntax for tracking.

**Goal:** the Monster Manual, the encounter builder and the Battle tab know the monsters beyond the
SRD of the Monster Manual 2014, Monsters of the Multiverse, the DMG 2014, Tasha's and Adventures in
Faerûn; library notes bring their full stat blocks.

**Architecture:** like K1. Raw stat block windows are cut from the `pdftotext` dumps
(`extract-monsters.mjs`), cleaned by agents into facts, names, summaries and the full stat block
YAML (`INSTRUCTIONS-monsters.md`, `check-monsters.mjs`), built into `src/catalogue/monsters.ts`
(facts, names, summaries, and a **minimal stat block YAML made from the facts**: name, size, type,
alignment, AC, HP, speed, abilities, CR — no traits or actions) and into private library notes
(`## Name` + a `statblock` code block). A library section replaces the minimal YAML with the full
one, so the stat block view, Add to combat and the Battle tab work unchanged.

**Spec:** `docs/superpowers/specs/2026-11-20-catalogues-design.md` (K2).

## Global Constraints

- No book text in the repository, the example vault, fixtures, commits or logs. Library notes and
  work files only under `D:\03 Projekte\Code\Loki\dnd5e-library\`.
- A 2014 monster in the SRD keeps its SRD record and is left out of the catalogue.
- Facts are numbers and short labels; summaries are our own words (no run of eight words shared
  with the book).

## Review Focus

- A catalogue monster without a library note must still render, join a fight and roll its
  abilities (minimal YAML).
- Name lookup (`monster: Name` in an encounter note) keeps resolving SRD first, so existing notes
  do not change meaning; then the preferred rule set's catalogue entry, then own notes.
- The German card of a catalogue monster: German name from `nameDe`, header lines translated by
  `germanBlock`, traits and actions stay English.
- Persisted Monster Manual filters from before K2 (no `rules` / `sources`) read back cleanly.

---

### Task 1: Data

- [ ] `scripts/catalogue/extract-monsters.mjs` → `work/batches/<book>-m-<n>.json` (mm14 421,
      mpmm 255, dmg14 3, tce 18, fraif 41 windows).
- [ ] Cleaning agents per `INSTRUCTIONS-monsters.md`, at most three at once; `check-monsters.mjs`
      clean.
- [ ] `scripts/catalogue/build-monsters.mjs`: `--from <workDir> <books>` → `data/monsters-<book>.json`
      (facts, names, summaries); no args → `src/catalogue/monsters.ts` (`CATALOGUE_MONSTERS`, with
      the minimal YAML); a reprint within one rule set keeps the newest book (mm14, dmg14, tce,
      mpmm, fraif); SRD names dropped from 2014 books; a 2014 SRD monster's German name is reused.
- [ ] `scripts/catalogue/library-monsters.mjs` → one library note per book.

### Task 2: Model, filters, merge

- [ ] `SrdMonster` gains `rules?`, `source?`, `nameDe?`, `summary?`, `fromLibrary?`.
- [ ] `monsterName` German: `DE_NAMES` → `nameDe` → `name`; search includes `nameDe`.
- [ ] `MonsterFilters` gains `rules`, `sources` (validated in `readFilters`).
- [ ] `withMonsterLibrary(monsters, sections)`: a catalogue entry whose section holds a
      `statblock` fence gets that YAML and `fromLibrary: true`.
- [ ] Tests with an invented monster (`test/catalogue-monsters.test.ts`); catalogue invariants
      (unique keys, no SRD name in a 2014 book, YAML parses, German names don't collide).

### Task 3: Views and wiring

- [ ] One `Library` for spells and monsters, made in `main.ts`.
- [ ] Monster Manual: catalogue deps, 2014 / 2024 chips and book select, 2024 pill, the summary
      above the stat block when it is not from the library, the library line, the book as source.
- [ ] Battle tab and encounter builder: SRD, catalogue (preferred rule set first), own.
- [ ] View test: catalogue rows, filters, summary, library block.

### Task 4: Docs, check, commit

- [ ] README, CHANGELOG, DECISIONS "Catalogues K2", ROADMAP, HANDOFF; `pnpm format`, `pnpm check`
      (example vault stashed); eight-word check of summaries against the library notes; commit
      `feat(dnd5e): monster catalogue K2 …`, push, review agent, fixes.
