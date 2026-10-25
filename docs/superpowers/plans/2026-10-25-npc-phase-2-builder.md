# NPC Builder Phase 2 — Builder — Implementation Plan

**Status:** approved ("Ja", 2026-10-25) and built; tasks 1–6 done, the check in Obsidian is open.

**Goal:** A GM creates an NPC in a minute: a **New NPC** modal (command, and a button on a faction's
card) writes a note from the NPC template into the chosen faction's folder, with personality lines
from dice tables and a stat block from an archetype — the 21 SRD NPCs or the GM's own archetype
notes. **Add stat block** gives an existing note (Sergeant Pell) a stat block from an archetype.

**Architecture:** Pure modules under `src/npc/` (archetypes, tables, note text), Obsidian UI in
`src/obsidian/npc-modal.ts`. Notes are created with `vault.create`, existing notes changed with
`vault.process` as line inserts. UI tests in `test/ui/`.

**Spec:** `docs/superpowers/specs/2026-10-25-npc-builder-design.md` (§2 goals, §5 the NPC note, §6
UI, phase 2 of §8).

## Global Constraints

Root `CLAUDE.md`. Nothing from phase 3 (no editing inside the rendered block, no template builder
modal — own archetypes are notes the GM writes by hand in this phase). Tables are our own text, no
SRD names lists, no network. Clean up before every commit, then `pnpm check`.

## Review Focus

1. **Where the note lands**: a faction → its folder; a sub-faction → its folder; Party → the Party
   folder; Unaffiliated → `<campaign>/NPCs` (setting); an existing file name is never overwritten
   (`Name 2.md`) — Task 3.
2. **Template filling**: `{{title}}`, frontmatter keys set as line edits (`type`, `race`, `class`,
   `alignment`, `archetype`), personality lines under their headings, the template's stat block
   replaced; the example `Templates/NPC.md` and no template both work — Task 3.
3. **Add stat block** refuses when the note already has one, adds `## Stats` when missing, and
   changes nothing else — Task 3.
4. **Own archetypes** read from notes with `type: archetype`; an unreadable one is listed with a
   warning, not dropped silently — Task 1.

---

### Task 1: Archetypes

`src/npc/archetypes.ts`, tests.

- [ ] `Archetype` gains `source: 'srd' | path`; `ownArchetypes(notes)` from `type: archetype` notes
      in the archetype folder (setting, default `Templates/Archetypes`), their first stat block;
      `allArchetypes(own)` SRD + own, own first; `searchArchetypes(list, query)` by name, CR shown.
- [ ] `withName(yaml, name)`: the block's `name:` line set (added when missing), nothing else.

### Task 2: Random tables

`src/npc/tables.ts`, tests.

- [ ] Default tables (our own text): first names, family names, appearance, manner, wants, quirks —
      about 30 entries each, fitting a fantasy city.
- [ ] `tableFromNote(text)`: list items of a note; a note `Templates/Tables/NPC <table>.md` (setting
      folder) replaces that default. `pick(table, random)` with an injectable random for tests.

### Task 3: Note text and placement

`src/npc/note.ts`, tests against `Templates/NPC.md` and Sergeant Pell.

- [ ] `npcNote(template | null, choices)` → text per spec §5 (frontmatter keys through the existing
      line editor in `src/yaml/`, lines under headings by name, block replaced or appended).
- [ ] `addStatblock(text, yaml)` → text or a refusal (`has-statblock`).
- [ ] `npcFolder(world, factionId, settings)` and `freePath(folder, name, exists)`.

### Task 4: New NPC modal

`src/obsidian/npc-modal.ts`, `card-render.ts` (button on faction cards), `main.ts`, `settings.ts`,
`styles.css`, strings (English, German).

- [ ] Fields: name (die), faction (campaign factions, Party, Unaffiliated; preset when opened from a
      card), archetype (suggest with CR; none allowed), race, class, alignment, appearance, manner,
      want, quirk (each with a die). Create writes the note, opens it, the card appears.
- [ ] Settings: NPC template (default `Templates/NPC.md`), archetype folder, tables folder,
      Unaffiliated folder name (`NPCs`).
- [ ] Phone width: one column, dice buttons stay.

### Task 5: Add stat block

`npc-modal.ts` (archetype picker), `main.ts`.

- [ ] Command **Add stat block** on the active note: archetype picker, then `addStatblock` through
      `vault.process`; a notice when the note already has one.

### Task 6: Tests, example vault, docs

- [ ] UI tests: the modal fills from dice, creates the expected text; the archetype suggest lists
      SRD and own archetypes.
- [ ] Example vault: `Templates/Archetypes/Lantern Warden.md` (own archetype, based on the Guard),
      `Templates/Tables/NPC quirks.md` (an override), `Home.md` rows; Sergeant Pell stays without a
      stat block for Add stat block.
- [ ] README, CHANGELOG, DECISIONS, ROADMAP, HANDOFF with the check in Obsidian.
