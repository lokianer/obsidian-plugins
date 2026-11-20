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
approved; **K1 (spells) and K2 (monsters) built** and pushed.

## Where to continue

1. **Check K1 and K2 in Obsidian**: copy the library notes from the maintainer's private folder
   `D: Projekte\Code\Loki\dnd5e-library\` (not the `work` folder) into a vault — four spell
   notes, five "… - Monsters.md" notes. Spellbook: the 2014 / 2024 chips and the book select, a
   2024 row's pill, a catalogue card with summary and with full text, the Rule set setting and a
   stat block link. Monster Manual: the same filters, a catalogue card without its library note
   (short block + summary + "add the library note") and with it (the full block), the encounter
   builder's tiles and Add to combat with a catalogue monster. Never put these notes in
   `examples/vault`.
2. **Monsters the scan could not give completely**, left out of the catalogue until someone reads
   the book (the cleaned entries are in `work/norm/` with notes): Bard, Kobold Dragonshield,
   Martial Arts Adept, Diviner Wizard, Yuan-ti Nightmare Speaker (mpmm, no header line); Sammaster
   (size), Spirit Dragon Wyrmling (Intelligence), Ancient Spirit Dragon (AC), Rusted Behemoth (AC,
   HP, speed) in fraif. Set the missing facts in the norm entries, then `build-monsters.mjs --from …`
   and `build-monsters.mjs`.
3. Open checks on the data from the cleaning notes: German names translated rather than official;
   header lines some cleaners filled from their own knowledge (Jackalwere, Kuo-toa Archpriest,
   Lizard King/Queen, Draegloth, Drow Matron Mother, Giant Strider, Nilbog — all with a `note`);
   Spiritual Weapon's school in phb24.
4. Deferred review findings (minor): the encounter builder stores only a monster's name, so for
   "Drow Priestess of Lolth" (in mm14 and fraif) the rule set setting decides which version an
   encounter resolves to; a 2014 reprint keeps only the newest book's key, so an older book's
   library note would not apply (no MM/MPMM overlap today, matters for K3); a hand-edited saved
   book filter with a spell-only book shows an empty list.
5. **K3 — Heroes of Faerûn** (image-only PDF), then V5/V6, then the character builder.

## State of the working tree

`main`. The maintainer's own uncommitted changes in `examples/vault` (Session 14's log lines,
faction values, two monsters, Session 15) are still left alone; they make 3 `packages/session` and
5 plugin tests fail locally. `pnpm check` runs green with them stashed
(`git stash push -u -q -- examples/vault` … `git stash pop -q`). Still to decide: keep them (update
the tests) or revert them.

**Private, outside the repository:** `D: Projekte\Code\Loki\dnd5e-library\` holds the library
notes and `work/` (batches, cleaned `norm/` files, `INSTRUCTIONS-spells.md` and
`INSTRUCTIONS-monsters.md` for the cleaning agents). The book dumps were in the session scratchpad
and may be gone; `pdftotext -enc UTF-8 <pdf> <out>` recreates them, `extract-monsters.mjs` cuts the
windows. None of this may enter the repository.

## Done this session

- K1: `src/catalogue/` (books, merge, library, spells), `scripts/catalogue/` spell scripts, the
  Library service, Spellbook filters, the Rule set setting.
- K2: `src/catalogue/monsters.ts` (generated, 400 entries), `withMonsterLibrary` in `merge.ts`,
  `scripts/catalogue/extract-monsters.mjs`, `check-monsters.mjs`, `build-monsters.mjs`,
  `library-monsters.mjs`, `data/monsters-*.json`; the Monster Manual's rule set and book filters,
  pill, summary and library line; one Library service shared by both views; the battle tracker
  and encounter builder see SRD + catalogue + own monsters.
- The spell scripts' batch filter no longer picks up monster batches.
- Review fixes: own monsters come first when an encounter looks up a name; a library block that is
  not valid YAML keeps the short block instead of breaking the card and the tracker; the library
  and extract scripts refuse any output folder inside the repository (the old guard missed paths
  with spaces and relative paths).
- Tests: `test/catalogue-monsters.test.ts`, the Monster Manual view test.

## Decisions taken this session

In `plugins/dnd5e-bylokianer/DECISIONS.md` ("Catalogues K1", "Catalogues K2") and the spec: full
texts privately as library notes, one note per book, the 2024 text translated to English, German
names too; for monsters a short stat block from the facts, the full block only from the library;
Tasha's summoned blocks (no CR) and incomplete blocks left out rather than guessed.

## Open questions for the maintainer

- The K1/K2 check in Obsidian.
- Whether Tasha's summoned spirits should appear somehow (they print no challenge rating).
- The uncommitted example-vault changes: keep (tests updated) or revert.

## Verification

With the example vault stashed: `pnpm check` exit 0, plugin 451/451 and session 15/15 tests, lint 0
errors (known warnings only). `check-monsters.mjs`: every shipped entry clean; the 9 entries with
problems are the ones left out above. No run of eight words of any of the 800 monster summaries
appears in the library notes.
