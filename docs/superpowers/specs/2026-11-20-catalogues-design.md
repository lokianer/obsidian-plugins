# Catalogues of spells and monsters — design

Date: 2026-11-20. Module of dnd5e-byLokianer (`plugins/dnd5e-bylokianer/`). Decision D42 (private
vault) made concrete; subclasses are not part of this design (they come with the character builder).

## Intent

The maintainer runs games with both rule sets (2014 and 2024), adventure books included, and wants
the Spellbook, the Monster Manual, the encounter builder and the Battle tab to know **every official
spell and monster**, not only the SRD's 319 spells and 334 monsters. At the table a monster needs
its full stat block (actions) and a spell its full text; while planning, the GM needs to find and
filter everything with its numbers.

The repository is public. Text from the books must never be committed. Numbers and names (facts)
are; descriptions are written in our own words.

## Goals

1. **A public catalogue in the plugin.** Every spell and monster from the books the maintainer has
   supplied, with the facts below and a short summary in our own words, in English and German.
2. **Full texts privately.** From the maintainer's own PDFs, one **library note per book**
   (`Library/Monster Manual 2014.md`, …) in the maintainer's own vault. The plugin reads these notes
   and attaches each entry's full text to its catalogue entry.
3. **The views use both.** Spellbook, Monster Manual, encounter builder, Battle tab and "Add to
   combat" list SRD + catalogue + own entries; a catalogue entry shows its full text when a library
   note supplies it, else its facts and summary.
4. **Filter by rule set and book.**

## Non-goals

- Subclasses, classes, species, feats, items (later, with the character builder).
- Books not supplied yet (Monster Manual 2025 first, then Fizban's, the adventures …). The design
  must make adding a book one generator run plus one data file, nothing more.
- Page numbers (the 2024 PHB is the Italian edition; its pages differ from the English one). Only
  the book is cited.
- Editing catalogue entries. Someone who wants a variant copies it into an own monster or spell, as
  today.

## Anti-goals

- **Any book text in the repository**, the example vault, a test fixture, a commit message or a
  log. Library notes and extracted text stay in the maintainer's vault and the session scratchpad.
- Summaries that paraphrase the book's text sentence by sentence. A summary says in two or three
  sentences of our own what the spell or monster does mechanically.
- Wrong numbers. A catalogue entry with a wrong CR breaks the encounter budget silently.
- A catalogue entry and a library or own note showing up twice in a list.

## Books supplied (2026-11-20)

PDFs on the maintainer's desktop, extracted with `pdftotext -layout` into the scratchpad:

| Key     | Book                                              | Rules | Spells | Monsters    | Text layer                       |
| ------- | ------------------------------------------------- | ----- | ------ | ----------- | -------------------------------- |
| `phb14` | Player's Handbook (2014)                          | 2014  | ~350   | –           | yes                              |
| `dmg14` | Dungeon Master's Guide (2014)                     | 2014  | –      | few         | yes                              |
| `mm14`  | Monster Manual (2014)                             | 2014  | –      | ~420 blocks | yes, OCR noise ("bl udgeoni ng") |
| `xge`   | Xanathar's Guide to Everything                    | 2014  | ~94    | –           | yes                              |
| `tce`   | Tasha's Cauldron of Everything                    | 2014  | 21     | few         | yes                              |
| `mpmm`  | Mordenkainen Presents: Monsters of the Multiverse | 2014  | –      | ~260        | yes                              |
| `phb24` | Player's Handbook (2024), **Italian**             | 2024  | ~500   | –           | yes; metres, Italian names       |
| `frhof` | Forgotten Realms: Heroes of Faerûn                | 2024  | some   | –           | **no — page images only**        |
| `fraif` | Forgotten Realms: Adventures in Faerûn            | 2024  | –      | ~37         | yes (scan with text layer)       |

## Approaches considered

**Where the data comes from.**

- _Online datasets_ — the only complete ones (5etools, the `dnd-data` npm package) are copies of
  the books' full text; the free ones (SRD, Kobold Fight Club) are partial and have nothing from 2024. Rejected.
- _From memory_ — thousands of numbers cannot be written reliably. Rejected.
- **The maintainer's own PDFs** — chosen by the maintainer.

**What the public plugin carries.**

- _Facts only_ (name, book, numbers) — the Spellbook would show a spell with no word of what it does
  when no library note exists.
- **Facts plus a short summary in our own words** — D42; chosen.

**How the full texts reach the vault** (chosen by the maintainer: 2).

1. _One note per monster or spell_ via the existing import: ~1,700 files mixed into the campaign,
   needs de-duplication against the catalogue.
2. **One library note per book**: nine files, readable without the plugin (Fantasy Statblocks
   renders the blocks, the outline lists the entries), own entries stay separate, a new book is
   one file. Single entries are linked as `[[Monster Manual 2014#Beholder]]`.

## The catalogue (public)

### Spell entry

As `SrdSpell` today, minus the text, plus where it comes from:

- `index` — stable key, the English name slugged (`fireball`).
- `name` — the official **English** name; `nameDe` — the German one (Q4). Spells from the Italian PHB get their English name (the
  2014 PHB and our SRD list make most matches; the rest translated and marked for review).
- `level`, `school`, `casting`, `range`, `components`, `material` (the material component, a fact
  list, e.g. "a tiny ball of bat guano and sulfur"), `duration`, `concentration`, `ritual`,
  `classes`, `damage`, `save`, `attack` — as in `SrdSpell`. Ranges in **feet** (the Italian
  edition's metres converted back: 1.5 m = 5 ft, 9 m = 30 ft, …).
- `rules: '2014' | '2024'`, `source: <book key>`.
- `summary: { en, de }` — two or three sentences of our own.

### Monster entry

As `SrdMonster` today, without the stat block YAML, plus:

- `index`, `name`, `nameDe`, `cr`, `type`, `size`, `ac`, `hp`, `moves`, `legendary`, `spellcaster`, and the six ability scores.
- `rules`, `source`.
- `summary: { en, de }` — one or two sentences of our own (what it is, how it fights).

### Identity across rule sets and books

- The **same spell in 2014 and 2024** (Fireball in `phb14` and `phb24`) is **two entries**: their
  numbers can differ. Lists show both, each with a small rules pill (`2014` / `2024`).
- A spell or monster **reprinted within the same rules** (a Volo's monster in Monsters of the
  Multiverse, a Xanathar's spell in Tasha's) is one entry, from the **newest** book.
- An entry that is **in the SRD** keeps its SRD record (full text in English and German) and gains
  `rules`/`source`; the catalogue holds no second copy of it.
- The 2014 SRD records are `rules: '2014'`. (SRD 5.2.1 content as such is not shipped yet; its
  2024 spells and monsters come in as catalogue entries from `phb24` / later `mm25`.)

### Files

`plugins/dnd5e-bylokianer/src/catalogue/`: one generated data file per book
(`spells-phb14.ts`, `monsters-mm14.ts`, …), an index that concatenates them, and a pure module for
merging (SRD + catalogue + library + own) and filtering. Summaries in German live next to the
English ones (not in a separate `de.ts`): every entry needs both.

Bundle size: today `main.js` is 2.0 MB; the catalogue adds roughly 0.8–1.2 MB (summaries in two
languages make most of it). Acceptable for a desktop and mobile plugin; to check after K1.

## The library (private)

### Library note format

One note per book, in a folder set in the settings (`libraryFolder`, default `Library`):

````markdown
---
type: library
source: mm14
rules: '2014'
---

# Monster Manual (2014)

## Aboleth

```statblock
name: Aboleth
…the full stat block in the plugin's YAML (Fantasy Statblocks' keys)…
```
````

## Beholder

…

```

Spells: `## Fireball`, then the full text in Markdown (the facts come from the catalogue; "At
higher levels" as a paragraph starting `**At Higher Levels.**` — the plugin's own spell notes use
the same split).

The note is readable without the plugin and with Fantasy Statblocks.

### How the plugin uses it

A new `Library` service (like `OwnMonsters`): reads notes with `type: library`, indexes their `##`
sections by `source` + slugged heading, re-reads a note only after its metadata changed. A
catalogue entry with a matching section shows the full text: the Monster Manual and the Battle tab
render the stat block (actions, rolls as today), the Spellbook the text. A section that matches no
catalogue entry is ignored (a warning in the console, nothing more).

### Producing the library notes

Generator scripts in `plugins/dnd5e-bylokianer/scripts/catalogue/` (Node, like the SRD generators)
read the `pdftotext` dumps and write:

1. the public data files (facts; summaries are written separately, see below), and
2. the private library notes, into a folder **outside the repository** (Q3), never
   into `examples/vault/` and never into the repository.

The scripts contain parsing logic only, no book text, and are committed so a later session can add
a book. They are run by hand; CI never runs them (CI has no PDFs).

Per-book parsing:
- `mm14`, `mpmm`, `dmg14`, `fraif`, `tce`: English stat blocks (Armor Class / Hit Points / Speed /
  abilities / … / Challenge). OCR noise is cleaned with a word list plus a check: the numbers of
  every monster also in the SRD must equal the SRD's.
- `phb14`, `xge`, `tce`: English spell blocks ("3rd-level evocation", Casting Time, Range,
  Components, Duration). Class lists from the books' class spell lists.
- `phb24`: Italian spell blocks ("Invocazione di 3° livello (mago, stregone)", Tempo di lancio,
  Gittata, Componenti, Durata) mapped to English terms; its full text is translated into English
  for the library note (Q1).
- `frhof`: page images only. The spell chapter's pages are read as images (no OCR install).

### Summaries

Written by Claude in batches per book, in English and German, from the facts and the full text
(never copied from it). Checked by the maintainer per batch through a sample.

## The views

- **Spellbook and Monster Manual**: one list (SRD + catalogue + own). New filter pills: rules
  (`2014`, `2024`) and a book dropdown. Each row: name and a rules pill when both rule sets are
  shown. The card: facts as today; then the full text (SRD or library) or, without one, the summary
  plus a muted line "Full text: Monster Manual (2014) — add it with a library note" and the source.
- **Encounter builder and "Add to combat"**: every catalogue monster by CR (budget unchanged). A
  monster without a library stat block joins the fight with AC, HP, initiative from DEX when known
  (the ability scores are facts, see "Calls made while writing").
- **Battle tab**: a combatant from a library stat block behaves like an SRD one (actions roll).
- **Settings**: `libraryFolder`; a default rules filter (`both`, `2014`, `2024`).

## Phases

Each phase: spec section above → plan → tests first → build → screenshots → maintainer's check in
Obsidian.

- **K1 — Spells.** Catalogue model, spell generators for `phb14`, `xge`, `tce`, `phb24`, summaries,
  Spellbook filters and card; library notes for these four books and the library service (spells).
- **K2 — Monsters.** Monster generators for `mm14`, `mpmm`, `dmg14`, `fraif`, `tce`, summaries,
  Monster Manual, encounter builder, Add to combat, Battle tab; library service (stat blocks).
- **K3 — Heroes of Faerûn** (page images) and any book supplied meanwhile.

The visual phases V5/V6 follow after K3 (or in between, as the maintainer prefers).

## Constraints

- CLAUDE.md: English in the repository, German in chat; Obsidian CSS variables only; text ≥ 16 px;
  `createEl` only; no network calls; mobile (no `fs` in the plugin — the generators are scripts,
  not plugin code); writes through the vault API.
- No new runtime dependency. The generators use Node built-ins and the `pdftotext` dumps.
- Tests: pure merge/filter/library-parsing modules unit-tested with **invented** fixtures (a
  made-up "Gloom Lantern" monster, not book text).

## Calls made while writing (the builder's, open to the maintainer's veto)

- **Ability scores are facts.** A monster entry also carries its six ability scores (`str` … `cha`):
  numbers, not text. A catalogue monster without a library note then joins a fight with AC, HP,
  initiative from DEX and saving throws from its scores; only its actions are missing.
- **Which edition a note means.** Encounter notes and stat-block spell links name an entry as
  today (`monster: Goblin`); an optional `source: mm14` (or `rules: '2024'`) on the combatant picks
  one. Without it the name resolves in this order: own note, SRD, the default rules setting's
  catalogue entry, the other rules' entry. Existing notes therefore keep resolving as before (own,
  then SRD).
- **Own notes and catalogue entries do not hide each other.** An own "Goblin" is the GM's own
  monster and shows next to the catalogue's, as it shows next to the SRD's today.
- **SRD entries keep their SRD text.** A library section for an entry that is in the SRD is used
  for nothing (the library note still holds it, so the book reads complete) and raises no warning.
- **The generators run in a session with the PDFs.** The `pdftotext` dumps live in the session
  scratchpad (`books/<key>.txt`); a later session re-extracts them from the PDFs. The library notes
  are written to `D:\03 Projekte\Code\Loki\dnd5e-library\` (Q3).

## Decided by the maintainer (2026-11-20)

- **Q1 — The `phb24` library note is English.** The Italian text is translated into English while
  generating (the other eight books are English, too). The facts were language-neutral anyway.
- **Q3 — Library notes go to a folder first**, `D:\03 Projekte\Code\Loki\dnd5e-library\` (beside the repository, not
  inside it); the maintainer copies them into the campaign vault.
- **Q4 — German names too.** Every catalogue entry carries `nameDe` beside `name` (the official
  German name where known, else our translation); search, lists and encounter matching use the UI
  language's name, as for the SRD today.

## Left to the builder

File and function names inside `src/catalogue/`, the exact slug rules, the OCR clean-up word list,
the order of filter pills, the exact German wording of UI strings.
```
