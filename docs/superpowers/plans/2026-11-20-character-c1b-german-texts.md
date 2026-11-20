# Character Builder C1b — German SRD Texts — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every name and text C1 ships in `packages/rules/data/srd-5.2.1/` (classes, subclasses,
species, backgrounds, feats, armour, weapons, skills; 1,223 strings, about 27,000 English words)
gets its German counterpart from the official German SRD 5.2.1, and the character sheet shows it
with German Obsidian.

**Architecture:** The data model already has `Text { en; de? }`. The German strings are taken from
Wizards' official German SRD 5.2.1 (`DE_SRD_CC_v5.2.1.pdf`, published December 2025, CC-BY-4.0),
aligned entry by entry to the English ids outside the repository and merged into the JSON as `de`.
A pure `local(text, lang)` picks the language; the sheet uses it wherever it shows rules text.

**Tech Stack:** TypeScript, Vitest, pdftotext (private work folder only).

**Spec:** `docs/superpowers/specs/2026-11-20-character-builder-design.md` (§2 "German SRD texts
(2a)", phase table row C1b).

## Global Constraints

- Source: `https://media.dndbeyond.com/compendium-images/srd/5.2/DE_SRD_CC_v5.2.1.pdf`, kept with
  its UTF-8 text (`pdftotext -enc UTF-8 -layout`) in
  `D:\03 Projekte\Code\Loki\dnd5e-library\work\srd52\` — never in the repository.
- Only SRD text goes into the repository; no book text anywhere (repo, example vault, fixtures,
  commits, logs).
- The German attribution statement from the German SRD's "Rechtliche Informationen" goes next to
  the English one (rules `README.md`, plugin `README.md`); no other reference to Wizards.
- Official wording verbatim (the official German terms win over the plugin's own earlier German
  where they differ; the differences are listed in `DECISIONS.md`, not changed in S2/M2 data).
- Ids, keys and the note's values stay English; German only as `de` and in the UI.
- Text at least 16 px, Obsidian CSS variables only, no `innerHTML` (unchanged from C1).

## Review Focus

1. **Wrong alignment:** a German text attached to the neighbouring feature (same class, adjacent
   level). Expected: each feature's German name is the official name of _that_ feature — pinned by
   a table of known pairs per class and per data file (Task 2/3 tests).
2. **Lost dice or numbers:** a German text missing a die or a level the English has. Expected: the
   multiset of dice (`1d8` ↔ `1W8`) is equal per text (Task 1 test over all data).
3. **Leftover units:** feet, miles, pounds in the German. Expected: none (`ft.`, `feet`, `Fuß`,
   `lb.`) — Task 1 test.
4. **Partial German:** a sheet in German that mixes German and English rules text because one
   entry lacks `de`. Expected: every `Text` in the SRD data has a non-empty `de` (Task 1 test);
   `local` falls back to English only for user data.
5. **Layout artefacts of the PDF:** split words (`Herkunf tstalente`, `K leriker`), hyphenation at
   line ends, column interleaving. Expected: no word with an inner single-letter fragment, no
   `-` before a line break inside a text — Task 1 test (heuristic regex) plus the spot table.

---

### Task 1: `local` and the German data checks

**Files:**

- Modify: `packages/rules/src/model.ts` (export `local`), `packages/rules/src/index.ts`
- Modify: `packages/rules/src/check.ts` (a `de` that is present must be non-empty)
- Test: `packages/rules/test/basics.test.ts`, `packages/rules/test/srd52.test.ts`

**Interfaces:**

- Produces: `local(text: Text, lang: 'en' | 'de'): string` — `text.de` when `lang === 'de'` and it
  is non-empty, else `text.en`.
- Produces: `germanProblems(text: Text): string[]` (in `check.ts`, used by the SRD test only if it
  stays small; otherwise inline in the test) — the checks of Review Focus 2, 3, 5.

- [ ] **Step 1:** Tests for `local` (`de` chosen, empty `de` falls back, `en` asked) and for
      `checkRules` reporting `de: ''` as `<where>: empty German text`. Run, watch them fail.
- [ ] **Step 2:** Implement; run, pass.
- [ ] **Step 3:** Add the SRD test `every rules text has its German` (walks all `Text` in
      `SRD_52`: non-empty `de`; dice multiset equal with `d` → `W`; no `ft.|feet|Fuß|lb\.|pound`;
      no `\b\p{L} \p{Ll}{2,}` split fragment; no `-\n`). It fails until Tasks 2–3 (mark it
      `it.todo` → `it` in Task 3; record the ruling if kept as `todo` across a commit).
- [ ] **Step 4:** `pnpm --filter @obsidian-plugins/rules test` green; commit
      `feat(rules): localised rules text and German data checks`.

### Task 2: German for armour, weapons, skills, species, backgrounds and feats

**Files:**

- Modify: `packages/rules/data/srd-5.2.1/{armor,weapons,skills,species,backgrounds,feats}.json`
- Private (not committed): `dnd5e-library/work/srd52/de-src/` (slices), `de-out/` (aligned JSON),
  `merge-de.mjs`
- Test: `packages/rules/test/srd52.test.ts` (known pairs)

- [ ] **Step 1:** Known-pairs test (from the official German SRD): `alert` → `Wachsam`,
      `dagger` → `Dolch`, `leather` → `Lederrüstung`, and per file at least three more pairs read
      off the German PDF while slicing, including one feature name per feat and species. Fails.
- [ ] **Step 2:** Slice the German text by section (equipment tables, skills, species, origins,
      feats) into `de-src/`. One cleaning agent per slice (as the English C1 data was made) gets the
      English JSON of that file and its slice and returns `{ id → { name, text } }` with the
      official wording, joining hyphenated line ends and split words, tables as in the English.
- [ ] **Step 3:** `merge-de.mjs` writes `de` next to every `en` by id; refuses an id it does not
      know or an entry with an English `text` but no German one.
- [ ] **Step 4:** Tests green (known pairs; the Task 1 checks for these files). Commit
      `feat(rules): German SRD names and texts for equipment, species, backgrounds and feats`.

### Task 3: German for classes and subclasses

**Files:**

- Modify: `packages/rules/data/srd-5.2.1/{classes,subclasses}.json`
- Test: `packages/rules/test/srd52.test.ts`

- [ ] **Step 1:** Known pairs per class: the class name and its level-1 and level-2 feature names
      (`bard` → `Barde`, `bard-bardic-inspiration` → `Bardische Inspiration` …) and each subclass's
      name — 12 + 24 + 12 pairs, read off the German PDF. Fails.
- [ ] **Step 2:** Same pipeline as Task 2, one slice per class with its subclass (12 agents).
- [ ] **Step 3:** Turn the Task 1 SRD test on; all green over the whole data. Commit
      `feat(rules): German SRD texts for classes and subclasses`.

### Task 4: The sheet in German

**Files:**

- Modify: `plugins/dnd5e-bylokianer/src/obsidian/character-sheet-view.ts` (every `.name.en` /
  `.text.en` → `local(…, this.deps.lang)`)
- Test: `plugins/dnd5e-bylokianer/test/ui/views.test.ts` (describe "character sheet")

- [ ] **Step 1:** Test: Wren's sheet with `lang: 'de'` shows `Dolch` on the Actions tab,
      `Bardische Inspiration` among the resources and in Features, `Schule des Wissens` (or the
      official German subclass name) in Levels; with `lang: 'en'` unchanged. Fails.
- [ ] **Step 2:** Implement; `pnpm check` green.
- [ ] **Step 3:** Screenshots from the scratchpad harness in German (dark 1100 px, 380 px): no
      overflowing German feature names in the tiles and the resource row.
- [ ] **Step 4:** Commit `feat(dnd5e): the character sheet in German`.

### Task 5: Attribution, docs and the check

- [ ] German attribution statement in `packages/rules/README.md` and the plugin `README.md`
      (Attribution section), CHANGELOG, `DECISIONS.md` ("Character builder C1b": source, official
      terms that differ from the plugin's own S2/M2 German, anything not taken), ROADMAP (C1b
      built), HANDOFF (rewritten), CLAUDE.md plugin table, vault Daily and Changelog.
- [ ] `pnpm format`, `pnpm check`; commit `docs(dnd5e): character builder C1b`; push.
- [ ] Final whole-branch review on the most capable model; one fix pass.
