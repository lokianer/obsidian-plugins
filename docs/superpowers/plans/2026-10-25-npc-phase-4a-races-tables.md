# NPC Builder Phase 4a — Races and Richer Tables — Implementation Plan

**Status:** draft, awaiting the maintainer's approval.

**Goal:** A New NPC can have a race — one of the nine SRD races or an own `type: race` note — that
adds its traits to the stat block and gives the name and appearance dice race-fitting lists. The
dice tables come in English and German (by Obsidian's language, or a setting) with at least 50
entries each, and the dialog gains the fields occupation, age, build, voice, ideal, bond, flaw,
secret and hook. The dialog's look stays as it is until 4b.

**Spec:** `docs/superpowers/specs/2026-10-25-npc-builder-design.md` §10.

## Global Constraints

Root `CLAUDE.md`. SRD race traits only, with attribution; names and appearance texts our own.
Keys, file names and headings in English; only rolled text in German. No ability score changes
from races. Clean up before every commit, then `pnpm check`.

## Review Focus

1. **Race into the stat block:** size and speed set, darkvision merged into senses (`darkvision 60
ft., passive Perception 12`, never twice), languages merged without duplicates, resistances
   added, racial traits appended as traits; an archetype's own values otherwise untouched; the
   block's `subtype` becomes the race — Task 2.
2. **Own races:** a `type: race` note reads back with its traits and name lists; an unreadable one
   is named in a notice — Task 3.
3. **Language:** German Obsidian rolls German texts; the setting overrides; a table note still
   replaces a table in either language — Task 4.
4. **Sizes of tables:** every table ≥ 50 entries in both languages, no duplicates — Task 4 (test).

---

### Task 1: Race model and SRD races

`src/npc/races.ts`, `src/npc/srd-races.ts`, tests.

- [ ] `Race` (`name`, `size`, `speed`, `darkvision`, `languages`, `resistances`, `traits`,
      `names`, `familyNames`, `appearance` lists, `source`); the nine SRD races with their SRD
      subrace where one exists, traits transcribed from the SRD 5.1.

### Task 2: Applying a race to a stat block

`src/npc/races.ts`, tests.

- [ ] `applyRace(yaml, race)` → the block's YAML with size, speed, subtype, merged senses,
      languages and resistances, and the traits appended (line edits through the block editor of
      phase 3, on the YAML before the note is written).

### Task 3: Own races

`src/npc/races.ts`, `src/obsidian/npc-modal.ts` (loader), `npc-builder.ts`, settings, tests.

- [ ] `ownRace(path, text, frontmatter)`; loader from the races folder (setting
      `Templates/Races`); command **New race** writing a race note from a base race.

### Task 4: Bilingual, larger tables and new fields

`src/npc/tables.ts` (split into `tables-en.ts` / `tables-de.ts`), `note.ts`, dialog fields,
settings (`tableLanguage`: auto / English / German), tests.

- [ ] All existing tables to ≥ 50 entries, in English and German; new tables occupation, age
      (by race), build, voice, ideal, bond, flaw, secret, hook; race lists for names and
      appearance in both languages.
- [ ] The new fields go into the note under headings by name (`## Appearance and manner`,
      `## What they want`, `## Secrets` …, created when the template lacks them), frontmatter
      `occupation` and `age` as keys.

### Task 5: Example vault and docs

- [ ] `Templates/Races/Tideborn.md` (an own race for Silverstadt), `Home.md` rows, README,
      CHANGELOG, DECISIONS, NOTICE (SRD races), ROADMAP, HANDOFF.
