# Monster Manual M1 — The Monster Manual Tab — Implementation Plan

**Status:** built 2026-10-25; accepted in Obsidian on 2026-10-25.

**Goal:** A Monster Manual tab with the 334 SRD monsters, built like the spellbook: search, filters
(CR bands, type, size, movement, legendary, spellcaster), a list grouped by challenge rating and the
stat block as the card, German names and German meta, Insert into note and Make a note.

**Spec:** `docs/superpowers/specs/2026-10-25-monster-manual-design.md` (reviewed 2026-10-25, every
call in its §7 accepted).

## Global Constraints

Root `CLAUDE.md`. SRD text only, attribution in README and NOTICE. Theme variables only, text at
least 16 px, keyboard usable, works at phone width. Clean up before every commit, then `pnpm check`.

## Review Focus

1. **Data fidelity:** 334 monsters; a sample (Adult Red Dragon, Goblin, Lich, Owlbear) matches the
   SRD in AC, HP and hit dice, speed, abilities, saves, skills, senses, CR and its traits and
   actions; usage written as the SRD does ("(3/Day)", "(Recharge 5–6)"); the 21 NPCs agree with
   `SRD_NPCS` — Task 1.
2. **Filters:** CR bands, type, size, movement, legendary and spellcaster combine like the
   spellbook's; search finds English and German names — Task 2.
3. **German meta:** sizes, types, alignments, speeds and senses in metres, languages, damage types,
   conditions, skills and saves in German; names for all 334, none twice — Task 2.
4. **Into notes:** Insert into note writes the block at the cursor of the last Markdown note; Make a
   note writes a `type: monster` note in the monster folder — Task 3.

---

### Task 1: Monster data

`scripts/monsters-from-srd.mjs`, `src/monsters/srd-monsters.ts`, `src/monsters/NOTICE.md`, tests.

- [ ] Per monster: index, name, CR, type (base type; swarms as "swarm"), size, AC, HP, flags (fly,
      swim, burrow, climb, legendary, spellcaster) for the list and filters, and the stat block as
      YAML in the plugin's format for the card and for notes.

### Task 2: German names and meta, filters and search

`src/monsters/de.ts`, `src/monsters/meta.ts`, `src/monsters/filter.ts`, tests.

### Task 3: The tab

`src/obsidian/monster-manual-view.ts`, `main.ts`, settings (`monsterFolder`), strings, styles,
`test/ui/`.

- [ ] Header with search, CR band and type chips, size and movement dropdowns, Legendary and
      Spellcaster chips, count and reset; list grouped by CR; the card with the stat block (spell
      links), EN / DE, Insert into note, Make a note; ribbon icon and command; kept state.

### Task 4: Docs, example vault and commit
