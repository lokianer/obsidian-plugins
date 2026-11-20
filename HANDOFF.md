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
and plan K1 (`docs/superpowers/plans/2026-11-20-catalogue-k1-spells.md`) approved; **K1 (spells)
built**.

## Where to continue

1. **Check K1 in Obsidian**: copy the four library notes from the maintainer's private folder
   `D:\03 Projekte\Code\Loki\dnd5e-library\` (not the `work` folder) into a vault, open the
   Spellbook: the 2014 / 2024 chips and the book select, a 2024 row's pill, a catalogue card with
   summary (without library note) and with full text, a German card, the Rule set setting and a
   stat block link (Fireball with Rule set 2024 → `phb24/fireball`). Never put these notes in
   `examples/vault`.
2. Open checks on the data, from the cleaning notes: the German names translated rather than
   official (the cleaners noted some), Spiritual Weapon's school in phb24 (conjuration, the 2024
   book may say evocation), and the reconstructed tables (Summon stat blocks, Control Weather,
   Reincarnate) in the private library.
3. **K2 — monsters**, then K3, then V5/V6, then the character builder.

## State of the working tree

`main`. The maintainer's own uncommitted changes in `examples/vault` (Session 14's log lines,
faction values, two monsters, Session 15) are still left alone; they make 3 `packages/session` and
5 plugin tests fail locally. `pnpm check` runs green with them stashed
(`git stash push -u -q -- examples/vault` … `git stash pop -q`). Still to decide: keep them (update
the tests) or revert them.

**Private, outside the repository:** `D:\03 Projekte\Code\Loki\dnd5e-library\` holds the library
notes and `work/` (raw extractions, batches, cleaned `norm/` files, `INSTRUCTIONS-spells.md` for the
cleaning agents). The book dumps were in the session scratchpad and may be gone; `pdftotext -enc
UTF-8 <pdf> <out>` recreates them. None of this may enter the repository.

## Done this session

- `src/catalogue/`: `books.ts`, `merge.ts` (library onto entries, name resolution, `byPreference`),
  `library.ts` (sections of a library note), `spells.ts` (generated, 550 entries).
- `scripts/catalogue/`: `parse-spells.mjs` (stream cutter, EN and IT), `extract-spells.mjs`,
  `batch-spells.mjs`, `check-spells.mjs`, `build-spells.mjs`, `library-spells.mjs`; `data/` with
  the public per-book JSON.
- `src/obsidian/library.ts` (the Library service), the Spellbook (rule set and book filters,
  pill, library line, book on the card), `register/spells.ts` wiring, the Rule set setting.
- Tests: `test/catalogue.test.ts`, `test/catalogue-parse.test.ts`, the Spellbook view test.
- DECISIONS "Catalogues K1: spells", CHANGELOG, README, ROADMAP.

## Decisions taken this session

In `plugins/dnd5e-bylokianer/DECISIONS.md` ("Catalogues K1") and the spec's "Decided by the
maintainer": full texts privately as library notes, one note per book, the 2024 text translated to
English, notes first in a folder outside the vault, German names too.

## Open questions for the maintainer

- K1's check in Obsidian.
- The uncommitted example-vault changes: keep (tests updated) or revert.

## Verification

With the example vault stashed: `pnpm check` exit 0, plugin 444/444 and session 15/15 tests, lint 0
errors (known complexity warnings only). `check-spells.mjs` over all 610 cleaned entries: 0
problems. No run of eight words of any summary appears in the library notes. `main.js` grew from
2.08 MB to 2.57 MB.
