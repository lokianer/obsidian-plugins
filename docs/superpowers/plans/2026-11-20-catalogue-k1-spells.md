# Catalogue K1 — Spells — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this
> plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every spell from `phb14`, `xge`, `tce` and `phb24` in the Spellbook — facts, English and
German names and summaries in the plugin; full texts from private library notes.

**Architecture:** Hand-checked data per book lives as committed JSON under
`scripts/catalogue/data/` (facts, `nameDe`, summaries — no book text); a build script turns it into
`src/catalogue/spells.ts`, as the SRD generators do. A pure `src/catalogue/` module merges SRD,
catalogue, library and own spells and filters by rules and book. A `Library` service reads
`type: library` notes. Extraction and library-note scripts read the `pdftotext` dumps in the
session scratchpad and write private output outside the repository only.

**Tech Stack:** TypeScript, Obsidian API, Vitest (happy-dom for views), Node `.mjs` scripts.

**Spec:** `docs/superpowers/specs/2026-11-20-catalogues-design.md`

## Global Constraints

- No book text in the repository, the example vault, fixtures, commits or logs. Test fixtures are
  invented ("Gloom Lantern", "Ember Thread").
- Private output only under `D:\03 Projekte\Code\Loki\dnd5e-library\` (library notes and the work
  files of extraction/translation); the dumps stay in the scratchpad `books/`.
- Summaries: 2–3 sentences of our own, English and German; never a sentence-by-sentence paraphrase.
- Ranges and areas in feet (Italian metres converted: 1.5 m = 5 ft).
- Same spell in 2014 and 2024 = two entries; reprints within one rule set = one entry from the
  newest book; SRD spells keep their SRD record (gain `rules: '2014'`, `source: 'srd'`).
- Repo rules (CLAUDE.md): English in code and docs, Obsidian CSS variables, text ≥ 16 px,
  `createEl` only, no network, no `fs` in plugin code, complexity ≤ 20, ≤ 150 lines per function.

## Rulings made while planning

- **Keys.** Catalogue entries are keyed `<source>/<slug>` (`phb24/fireball`, `xge/toll-the-dead`),
  so the 2014 and 2024 Fireball never collide with the SRD's `fireball`.
- **No `libraryFolder` setting.** The library service finds notes by `type: library` anywhere in the
  vault, as own spells are found by `type: spell`. One setting less; the spec's setting is dropped.
- **One setting `rules`** (`both` | `2014` | `2024`, default `both`): the Spellbook's starting rules
  filter.
- **Name resolution for stat-block spell links** (spec "calls"): own, SRD, the `rules` setting's
  catalogue entry, the other rule set's.

## Review Focus

1. A spell whose name exists in SRD, `phb14` and `phb24` (Fireball): three-way listing, the right
   card per row, search finds all, a stat-block link opens the SRD one.
2. A library note section whose heading has different casing or an apostrophe (`Tasha's Hideous
Laughter`) still matches its entry.
3. German UI with a catalogue spell: German name, German summary, English full text below a muted
   note that it is English.
4. No library note at all: every catalogue card shows the summary and the "add a library note" line,
   nothing breaks.
5. A library note edited while the Spellbook is open: the card updates after the metadata change.

---

### Task 1: Catalogue model and merge

**Files:**

- Modify: `plugins/dnd5e-bylokianer/src/spells/model.ts` (optional fields on `SrdSpell`)
- Modify: `plugins/dnd5e-bylokianer/src/spells/meta.ts` (`spellName`, `spellText`)
- Modify: `plugins/dnd5e-bylokianer/src/spells/filter.ts` (rules and source filters, `nameDe` search)
- Create: `plugins/dnd5e-bylokianer/src/catalogue/books.ts`, `src/catalogue/merge.ts`
- Test: `plugins/dnd5e-bylokianer/test/catalogue.test.ts`

**Interfaces:**

- Produces:
  - `SrdSpell` gains `rules?: '2014' | '2024'`, `source?: BookKey | 'srd'`, `nameDe?: string`,
    `summary?: { en: string; de: string }`, `library?: { text: string; higher: string }`.
  - `type BookKey = 'phb14' | 'dmg14' | 'mm14' | 'xge' | 'tce' | 'mpmm' | 'phb24' | 'frhof' | 'fraif'`
    and `BOOKS: Record<BookKey, { rules: '2014' | '2024'; en: string; de: string }>` in `books.ts`
    (titles as in the spec's table; German titles where official, else the English one).
  - `withLibrary(spells: readonly SrdSpell[], sections: ReadonlyMap<string, LibrarySection>): SrdSpell[]`
    — attaches `library` to entries whose `index` is a key of `sections`; SRD entries untouched.
  - `resolveSpell(name: string, all: readonly SrdSpell[], rules: RulesSetting): SrdSpell | null` —
    order own (`path`), SRD (`source` undefined or `'srd'`), preferred rules, other rules.
  - `type RulesSetting = 'both' | '2014' | '2024'`; `interface LibrarySection { text: string; higher: string }`.
  - `SpellFilters` gains `rules: ('2014' | '2024')[]` and `sources: (BookKey | 'srd')[]`.

- [ ] **Step 1: Failing tests** in `test/catalogue.test.ts` with invented spells:
  - `spellName` returns `nameDe` for a catalogue spell in German, `name` in English.
  - `spellText` of a catalogue spell: `library.text` when present (both languages), else `summary[lang]`
    with `higher: ''`.
  - `filterSpells` with `rules: ['2024']` keeps only 2024 entries; `sources: ['xge']` only that book;
    the query finds a spell by `nameDe`.
  - `withLibrary` attaches a section to `phb24/ember-thread` and ignores one for an SRD index.
  - `resolveSpell('Ember Thread', …, '2024')` picks the `phb24` entry over the `phb14` one; an own
    spell of that name wins over both; `'2014'` picks `phb14`.
- [ ] **Step 2:** `pnpm vitest run test/catalogue.test.ts` — Expected: FAIL (module not found).
- [ ] **Step 3:** Implement the interfaces above. SRD spells get `rules: '2014'` at merge time, not in
      the generated SRD file.
- [ ] **Step 4:** `pnpm vitest run test/catalogue.test.ts test/spells.test.ts` — Expected: PASS.

### Task 2: Extraction scripts (facts from the dumps)

**Files:**

- Create: `plugins/dnd5e-bylokianer/scripts/catalogue/parse-spells.mjs` (pure parsers),
  `scripts/catalogue/extract-spells.mjs` (CLI)
- Test: `plugins/dnd5e-bylokianer/test/catalogue-parse.test.ts`

**Interfaces:**

- Produces:
  - `parseSpells2014(text: string): Fact[]` — English blocks (`3rd-level evocation` / `Evocation
cantrip`, `Casting Time:`, `Range:`, `Components:`, `Duration:`), two-column `-layout` dumps
    split into columns first.
  - `parseSpells2024It(text: string): Fact[]` — Italian blocks (`Invocazione di 3° livello (mago,
stregone)`, `Trucchetto di …`, `Tempo di lancio:`, `Gittata:`, `Componenti:`, `Durata:`) mapped
    to English values; metres → feet; classes from the level line.
  - `Fact` = the spell fields of `SrdSpell` minus texts, plus `nameSource` (the name as printed) and
    `pageText` (the entry's body — kept only in private output).
  - CLI: `node scripts/catalogue/extract-spells.mjs <book> <dump.txt> <outDir>` writes
    `<outDir>/<book>-spells.json` (facts + bodies, private).

- [ ] **Step 1: Failing tests** with invented blocks in both layouts (a two-column 2014 page with
      "Ember Thread" beside "Gloom Lantern"; an Italian block `Abiurazione di 2° livello (chierico,
mago)`, `Gittata: 9 metri`, `Durata: concentrazione, fino a 1 minuto`): name, level, school,
      casting, range `30 feet`, components, material, duration, concentration, ritual, classes.
- [ ] **Step 2:** run — Expected: FAIL.
- [ ] **Step 3:** Implement; for 2014 books the class lists come from each book's spell-list
      section (parsed in the same module: `parseClassLists(text): Map<string, SpellClass[]>`).
- [ ] **Step 4:** run — Expected: PASS.
- [ ] **Step 5:** Run the CLI on the four dumps into `dnd5e-library/work/`. **Check:** every SRD
      spell found in `phb14` equals the SRD's level, school, casting, range, components, duration,
      concentration, ritual (a script `scripts/catalogue/check-srd.mjs` prints mismatches) — Expected:
      0 mismatches after fixing the parser; counts near phb14 ≈ 360, xge ≈ 95, tce 21, phb24 ≈ 390.

### Task 3: The public data — names, summaries, build

**Files:**

- Create: `plugins/dnd5e-bylokianer/scripts/catalogue/data/spells-<book>.json` (four files; facts,
  `name`, `nameDe`, `summary`), `scripts/catalogue/build-spells.mjs`,
  `src/catalogue/spells.ts` (generated, "Do not edit by hand"), `src/catalogue/NOTICE.md`

**Interfaces:**

- Consumes: Task 2's private `work/<book>-spells.json`.
- Produces: `CATALOGUE_SPELLS: readonly SrdSpell[]` in `src/catalogue/spells.ts`.

- [ ] **Step 1:** From the work files, write the public JSON: facts only, SRD spells left out,
      reprints deduplicated (newest book), `phb24` spells get their English names (match against
      `phb14` + SRD by level/school/classes, the rest translated and listed for the maintainer).
- [ ] **Step 2:** Names and summaries in batches of ~50 spells per book (subagents allowed, at most
      3 at once): `nameDe` (official German name where known), `summary.en`, `summary.de`. Each batch
      is checked by a script: no field empty, no summary longer than 400 characters, no 8-word run
      shared with the private body (`scripts/catalogue/check-overlap.mjs`, run on the private files).
- [ ] **Step 3:** `node scripts/catalogue/build-spells.mjs` → `src/catalogue/spells.ts`; a test in
      `test/catalogue.test.ts`: every entry has a unique `index`, `rules`, `source`, both names, both
      summaries; no index collides with an SRD index.
- [ ] **Step 4:** `pnpm vitest run` — Expected: PASS. `pnpm build` — note `main.js` size (spec:
      +0.8–1.2 MB expected in total; flag if K1 alone exceeds 0.8 MB).
- [ ] **Step 5:** Show the maintainer a sample of 10 summaries (EN/DE) before the remaining
      batches.

### Task 4: Library notes (private)

**Files:**

- Create: `plugins/dnd5e-bylokianer/scripts/catalogue/library-spells.mjs`
- Private output: `D:\03 Projekte\Code\Loki\dnd5e-library\<Book title>.md` (four notes),
  `dnd5e-library/work/phb24-en.json` (translations)

- [ ] **Step 1:** Translate the `phb24` bodies into English in batches (subagents allowed, at most
      3), into `work/phb24-en.json` (`{ index: { text, higher } }`); rules terms in the 2024 English
      wording (Bonus Action, Saving Throw, …).
- [ ] **Step 2:** `node scripts/catalogue/library-spells.mjs <book>` writes the note: frontmatter
      `type: library`, `source`, `rules`; `# <title>`; per spell `## <English name>` then the body,
      "At Higher Levels" / "Using a Higher-Level Spell Slot" as a `**At Higher Levels.**` paragraph.
      SRD spells included (the book reads complete).
- [ ] **Step 3:** Check: every catalogue entry of the book has exactly one section; print the
      count per book.

### Task 5: Library service and Spellbook

**Files:**

- Create: `plugins/dnd5e-bylokianer/src/catalogue/library.ts` (pure: `librarySections(source: BookKey, markdown: string): Map<string, LibrarySection>`),
  `src/obsidian/library.ts` (service, like `OwnSpells`)
- Modify: `src/obsidian/spellbook-view.ts`, `src/obsidian/register/spells.ts`,
  `src/obsidian/settings.ts` (`rules`), `src/i18n/*` (strings), `styles/spellbook.css`
- Test: `test/catalogue.test.ts`, `test/ui/views.test.ts` (`describe('spellbook')`)

**Interfaces:**

- Consumes: Task 1's merge functions, Task 3's `CATALOGUE_SPELLS`.
- Produces: `class Library { sections(): ReadonlyMap<string, LibrarySection>; onChange(l): () => void; reload(): Promise<void> }`; keys `<source>/<slug>`.

- [ ] **Step 1: Failing tests:**
  - `librarySections('xge', note)`: `## Ember Thread` → key `xge/ember-thread`; heading casing,
    curly apostrophes and trailing spaces ignored; `**At Higher Levels.**` split into `higher`.
  - Spellbook (happy-dom, deps get `catalogue` and `library` stubs): rules pills `2014`/`2024`
    filter the list; a book dropdown; a catalogue row shows a `dnd5e-spells-rules` pill when both
    rule sets are listed; the card of a catalogue spell without library text shows the summary, the
    line `spells.noLibrary` ("Full text: add the library note for Player's Handbook (2024).") and
    the source line `spells.catalogueSource` ("Player's Handbook (2024)"); with library text it
    renders that text and, in German, the note `spells.libraryEnglish`.
  - A stat-block link "Ember Thread" resolves through `resolveSpell` with the `rules` setting.
- [ ] **Step 2:** `pnpm vitest run test/catalogue.test.ts test/ui/views.test.ts` — Expected: FAIL.
- [ ] **Step 3:** Implement; strings EN and DE; pills via `pill()` with the V4 chip rules.
- [ ] **Step 4:** run — Expected: PASS; then `pnpm vitest run` all green.
- [ ] **Step 5:** Screenshots (1000 px, 380 px German, light) with the harness in the scratchpad;
      install into `examples/vault` (no library note there — the example vault must stay free of book
      text).

### Task 6: Docs, check, commit

- [ ] README (Spellbook: catalogue, library notes, how to get them), CHANGELOG, DECISIONS
      ("Catalogues K1"), ROADMAP, HANDOFF.
- [ ] `pnpm format`; `pnpm check` with the example vault stashed — Expected: all green.
- [ ] `git grep` for three random sentences of the private bodies — Expected: no match.
- [ ] Commit `feat(dnd5e): spell catalogue K1 — phb14, xge, tce, phb24`; push; review agent; fix;
      push. Copy the four library notes for the maintainer to try in Obsidian.
