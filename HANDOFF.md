# Handoff

The note one session leaves for the next — local or in the cloud. **Rewrite it at the end of every
session** (not append) and commit it with that session's work. `ROADMAP.md` says _what_ is done and
next; this file says _how it was left_: state of the working tree, what is half-finished, what to
watch out for. A cloud session cannot see the maintainer's private vault, so nothing here may depend
on it.

Read order for a new session: `ROADMAP.md` → this file → `CLAUDE.md` → the spec and plan named under
"Where to continue".

---

## Session

2026-11-20, local (second part). The maintainer noticed that every spell and monster beyond the SRD
was missing and brought the catalogues forward, before V5/V6: 2014 and 2024, adventure books
included, from their own PDFs. Design (`docs/superpowers/specs/2026-11-20-catalogues-design.md`)
approved; **K1 (spells), K2 (monsters) and K3 (Heroes of Faerûn's spells) built** and pushed; the
maintainer's example-vault changes committed with the tests updated.

## Where to continue

1. **Check K1–K3 in Obsidian**: copy the library notes from the maintainer's private folder
   `D:\03 Projekte\Code\Loki\dnd5e-library\` (not the `work` folder) into a vault — five spell
   notes, five "… - Monsters.md" notes. Spellbook: the 2014 / 2024 chips and the book select, a
   2024 row's pill, a catalogue card with summary and with full text, the Rule set setting and a
   stat block link. Monster Manual: the same filters, a catalogue card without its library note
   (short block + summary + "add the library note") and with it (the full block), the encounter
   builder's tiles and Add to combat with a catalogue monster. Never put these notes in
   `examples/vault`.
2. Done this session too: the nine blocks the scan could not give completely and the header lines
   cleaners filled from memory were read from page images (`pdftoppm`) and corrected.
3. Open check on the data: German names translated rather than official; Spiritual Weapon's
   school in phb24.
4. Then V5/V6 (visual refactoring), then the character builder (with the subclasses, feats and
   backgrounds of the books, Heroes of Faerûn's included).

## State of the working tree

`main`, clean apart from local Obsidian state. The maintainer's play-test changes in
`examples/vault` are committed (`becfabe`) and the tests expect them; `pnpm check` runs green
without stashing anything.

**Private, outside the repository:** `D:\03 Projekte\Code\Loki\dnd5e-library\` holds the library
notes and `work/` (batches, cleaned `norm/` files, `INSTRUCTIONS-spells.md` and
`INSTRUCTIONS-monsters.md` for the cleaning agents). The book dumps were in the session scratchpad
and may be gone; `pdftotext -enc UTF-8 <pdf> <out>` recreates them, `extract-monsters.mjs` cuts the
windows. None of this may enter the repository.

## Done this session

- K1: `src/catalogue/` (books, merge, library, spells), `scripts/catalogue/` spell scripts, the
  Library service, Spellbook filters, the Rule set setting.
- K2: `src/catalogue/monsters.ts` (generated, 429 entries), `withMonsterLibrary` in `merge.ts`,
  `scripts/catalogue/extract-monsters.mjs`, `check-monsters.mjs`, `build-monsters.mjs`,
  `library-monsters.mjs`, `data/monsters-*.json`; the Monster Manual's rule set and book filters,
  pill, summary and library line; one Library service shared by both views; the battle tracker
  and encounter builder see SRD + catalogue + own monsters.
- The spell scripts' batch filter no longer picks up monster batches.
- Review fixes: own monsters come first when an encounter looks up a name; a library block that is
  not valid YAML keeps the short block instead of breaking the card and the tracker; the library
  and extract scripts refuse any output folder inside the repository (the old guard missed paths
  with spaces and relative paths).
- K3: Heroes of Faerûn's 19 spells, read from page images (`data/spells-frhof.json`, library note
  "Forgotten Realms - Heroes of Faerûn.md").
- Second round, asked for by the maintainer: blocks without a challenge rating (Tasha's summons,
  Avatar of Death, Giant Fly, Sacred Statue) in with CR "—", out of the encounter builder; the nine
  incomplete blocks and seven memory-filled headers read from page images (four corrections, Hook
  Horror's darkvision 10 ft.); the encounter builder writes the catalogue key for a name in both
  rule sets; reprints keep older books' library keys; the saved book filter only keeps monster
  books.
- Tests: `test/catalogue-monsters.test.ts`, the Monster Manual view test.

## Decisions taken this session

In `plugins/dnd5e-bylokianer/DECISIONS.md` ("Catalogues K1", "Catalogues K2") and the spec: full
texts privately as library notes, one note per book, the 2024 text translated to English, German
names too; for monsters a short stat block from the facts, the full block only from the library;
blocks without a challenge rating in with CR "—" and kept out of the encounter budget; missing
facts read from page images, never guessed.

## Open questions for the maintainer

- The K1/K2 check in Obsidian.

## Verification

`pnpm check` exit 0 (nothing stashed), plugin 454/454 and session 15/15 tests, lint 0
errors (known warnings only). `check-monsters.mjs`: 744 entries, 0 problems. No run of eight words of any of the 858 monster summaries appears in the library notes.
