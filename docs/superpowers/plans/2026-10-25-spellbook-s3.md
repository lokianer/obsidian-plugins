# Spellbook S3 — Links and own spells — Implementation Plan

**Status:** built 2026-10-25; awaiting the maintainer's check in Obsidian.

**Goal:** Spell names in a stat block's Spellcasting trait open the spellbook on that spell; the
GM's own `type: spell` notes join the spellbook's list.

**Spec:** `docs/superpowers/specs/2026-10-25-spellbook-design.md` §4.3 and §5. Started on the
maintainer's "continue" after the deck (S3 was the next designed phase).

## Review Focus

1. **Links:** only entries named Spellcasting (or Innate Spellcasting, Zauber…); English and German
   names, whole words, longest first; text inside links and bold names untouched — Task 1.
2. **Own spells:** level (0–9, cantrip / Zaubertrick) and school (English or German) are needed;
   the rest has defaults; classes, damage and save read in either language; "At Higher Levels"
   split at its heading — Task 2.
3. **Spellbook:** own spells filter and search like the SRD's, marked "own", their card renders the
   note's text with links resolved against the note, Open note — Task 3.

### Task 1: `src/spells/links.ts`, `src/obsidian/spell-links.ts`, the stat block's `spells` hook

### Task 2: `src/spells/own.ts`, `src/obsidian/own-spells.ts` (cache, refresh on metadata changes)

### Task 3: the spellbook merges own spells, `show(index)` from a link; docs and example vault
