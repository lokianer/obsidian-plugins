# Monster Manual M3 — Own Monsters and the Monster Builder — Implementation Plan

**Status:** built 2026-10-25; awaiting the maintainer's check in Obsidian.

**Goal:** Notes with `type: monster` and a stat block join the Monster Manual, marked "own"; **New
monster** opens a monster builder in the New NPC dialog's style — start from an SRD monster or from
nothing, every part of the stat block as a field, a live stat block preview — writing such a note.

**Spec:** `docs/superpowers/specs/2026-10-25-monster-manual-design.md` §4.3 and §5. Asked for by the
maintainer before M2 ("Monster Manual ist geil und jetzt einen Monster Creator"); M2 (German traits
and actions) stays next.

## Review Focus

1. **Round trip:** a stat block written by the builder reads back as the same block — tested on all
   334 SRD monsters — Task 1.
2. **Own monsters:** a `type: monster` note's first stat block is read for name, CR, type, size, AC,
   HP, movement, legendary and spellcasting; it filters and searches like the SRD's; the card opens
   the note — Task 2.
3. **Builder:** size, type, alignment and CR as dropdowns in the GM's language (stored in the SRD's
   words), abilities as six numbers, saves and skills as text ("DEX +6, CON +13"), traits, actions,
   reactions and legendary actions as rows; the preview follows every field — Task 3.

### Task 1: `src/monsters/draft.ts` — the block as YAML, saves and skills as text

### Task 2: `src/monsters/own.ts`, `src/obsidian/own-monsters.ts`, the Monster Manual merges them

### Task 3: `src/obsidian/monster-builder.ts`, command New monster, + in the Monster Manual

### Task 4: docs, example vault, commit
