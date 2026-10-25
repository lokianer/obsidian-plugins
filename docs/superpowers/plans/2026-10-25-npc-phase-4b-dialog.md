# NPC builder phase 4b — A fancier dialog — Implementation Plan

**Status:** built 2026-10-25; accepted in Obsidian on 2026-10-25.

**Goal:** The New NPC dialog of spec §10, last bullet: a live preview card beside the fields that
updates as you roll; **Roll everything** with a lock per field; race and archetype chosen from tiles
with a search instead of text fields. What the dialog writes does not change (phase 4a's note).

**Spec:** `docs/superpowers/specs/2026-10-25-npc-builder-design.md` §10.

## Global Constraints

Root `CLAUDE.md`. Obsidian look: theme variables only, text at least 16 px, Obsidian's own setting
rows and icon buttons; works at phone width (preview on top, compact). No new dependencies. Clean up
before the commit, then `pnpm check`.

## Behaviour

- **Layout:** a wide modal; the form on the left, the preview card on the right, sticky while the
  form scrolls; on narrow screens the preview sits above the form. **Roll everything** at the top,
  **Create** at the bottom.
- **Race tiles:** the GM's own races first, then the nine SRD races; each tile an icon, the name in
  the dialog's language and `Medium · 25 ft. · darkvision 60 ft.`. A search field filters them; when
  nothing matches, a tile **Use “…”** keeps the typed text as a free race (as before). Clicking the
  chosen tile again clears it.
- **Archetype tiles:** **No archetype** first (keeps the template's stat block), then the GM's own,
  then the SRD's 21 by challenge; each tile `CR 1/8 · AC 16 · HP 11`. A search field filters them.
- **Class tiles** (asked for after the first build): the twelve SRD classes with hit die and main
  abilities, labels in the dice language, written in English; free text when no tile fits; rolled
  like the race.
- **Locks:** every rolled field (name, race, age, appearance and the table fields) has a lock next
  to its dice. Typing into a field locks it, so Roll everything never overwrites your own text;
  choosing a race tile locks the race. The single dice still roll a locked field.
- **Roll everything:** first the race (a random one, unless locked), then name, age and appearance
  from that race, then every table field — each only when unlocked. Archetype, faction and alignment
  are never rolled.
- **Preview card:** the name (or "Unnamed"), a line with race, occupation and age, the faction,
  class and alignment as tags, the race's trait names, the archetype with the card's short stats
  (AC, HP, CR, speed, ability modifiers), then every filled line under its label; the secret marked
  as GM-only.

## Tasks

1. `src/npc/archetypes.ts`: `byChallenge` — own archetypes first, then by CR value, then name;
   tested.
2. `src/obsidian/npc-dialog.ts`: the New NPC dialog moved out of `npc-modal.ts` and rebuilt —
   tiles, locks, Roll everything, preview (reusing `renderShortStats`). Strings in English and
   German. Styles in `styles.css`.
3. UI tests: tiles pick race and archetype, a locked field survives Roll everything, typing locks,
   the preview follows, the free race tile, the refusal without a name.
4. Docs: README, CHANGELOG, ROADMAP, HANDOFF (check points), spec status.

Left out: the stat block preview in full (the short stats say enough in a dialog); rolling the
archetype (the GM picks the stat block deliberately).
