# NPC Builder Phase 3 — Editing and Template Builder — Implementation Plan

**Status:** approved with the deviation ("passt", 2026-10-25) and built; tasks 1–5 done, accepted in Obsidian on 2026-10-25.

**Goal:** The opened stat block is editable where it stands, like the faction card: click a value,
type, Enter writes one line inside the block. Traits, actions, bonus actions, reactions and
legendary actions can be added and removed (with Undo). **New archetype** creates an own archetype
note from an SRD or own archetype (or blank) and opens it, to be shaped with the same editing.

**Spec:** `docs/superpowers/specs/2026-10-25-npc-builder-design.md` (§2 editing in place, template
builder; §6 UI; phase 3 of §8).

**Deviation proposed:** the spec's template builder is "every stat block field as a form" in a
modal. Proposed instead: **New archetype** asks only for a name and a base, writes the note and
opens it; the GM then edits the archetype's stat block in place, with the editing this phase builds
anyway. One editor instead of two, nothing to keep in step, and what you see is the note. (If the
maintainer wants the form after all, it can follow in its own phase.)

## Global Constraints

Root `CLAUDE.md`. Edits are line edits inside the block through `vault.process`; every edit carries
the value the GM saw and refuses when the note says something else now (as the card does). Nothing
re-serialises the block. Clean up before every commit, then `pnpm check`.

## Review Focus

1. **Only the block changes**, and in it only the edited line(s): comments, quoting and order stay;
   a CRLF note stays CRLF — Task 1.
2. **Refusals**: a value changed in the meantime, a flow or block scalar where a plain value is
   expected, a block that moved or vanished → a notice, nothing written — Tasks 1, 3.
3. **Abilities**: `stats: [13, 12, 12, 10, 11, 10]` keeps its flow form; one number changes —
   Task 1.
4. **Entries**: adding writes `- name: … / desc: …` at the list's end (creating the key when
   missing); removing takes exactly that entry; Undo puts it back — Task 2.

---

### Task 1: Scalar edits inside a block

`src/npc/block-edit.ts`, tests.

- [ ] `editBlock(text, block, op)`: runs the frontmatter line editor (`src/yaml/edit.ts`) on the
      block's lines as if they were frontmatter, then splices them back — so `set-scalar` /
      `remove-scalar` work for `name`, `ac`, `ac_class`, `hp`, `hit_dice`, `speed`, `senses`,
      `languages`, `cr`, `alignment`, `size`, `type`, `subtype`.
- [ ] `setAbility(text, block, index, expect, value)`: changes one number of the `stats:` flow list.

### Task 2: Entry edits

`src/npc/block-edit.ts`, tests.

- [ ] For `traits`, `actions`, `bonus_actions`, `reactions`, `legendary_actions`: set an entry's
      `name` or `desc` (by index, with expect), add an entry at the end, remove an entry (by index,
      expect its name); quoting of `desc` as YAML needs it (`Melee Weapon Attack: …` quoted).

### Task 3: Editing in the rendered block

`src/obsidian/statblock-view.ts`, `main.ts`, `styles.css`, strings.

- [ ] In the opened block: values show the pencil on hover; click → input (Enter writes, Esc
      cancels); abilities as small number inputs; `+ Add` under each entry section, `×` on hover
      (Undo notice). The block is found again by its position (`getSectionInfo`) and checked
      before writing. Phone: buttons always visible.
- [ ] Clicks never move the editor's cursor in Live Preview.

### Task 4: New archetype

`src/obsidian/npc-modal.ts`, `npc-builder.ts`, `main.ts`.

- [ ] Command **New archetype**: name and base (archetype search, or blank) → writes
      `<archetype folder>/<Name>.md` (`type: archetype`, a line of text, the block named after the
      archetype), never over an existing note, and opens it with the block unfolded.

### Task 5: Tests, example vault, docs

- [ ] UI tests: clicking AC, typing 17, Enter calls the write with the right op; `+ Add` under
      Actions; New archetype dialog hands over name and base.
- [ ] `Home.md` rows (edit Aldric's AC; add an action to Lantern Warden; New archetype from Spy).
- [ ] README, CHANGELOG, DECISIONS, ROADMAP, HANDOFF with the check in Obsidian.
