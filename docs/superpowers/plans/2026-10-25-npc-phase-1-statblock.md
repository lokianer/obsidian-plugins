# NPC Builder Phase 1 — Stat Block Model and View — Implementation Plan

**Status:** draft, awaiting the maintainer's approval.

**Goal:** A `dnd5e-statblock` block renders as a 5e stat block in Reading view and Live Preview;
the faction card and the faction view show `AC · HP · CR` for members with a stat block (ours or
Fantasy Statblocks'); a command converts between the two block names; the 21 SRD NPCs exist as
data for phase 2.

**Architecture:** Pure modules under `src/npc/` (model, derived values, SRD data), a code block
processor in `src/obsidian/statblock-view.ts`, the card's character model reading the block from the
note's text. UI tests in `test/ui/` for the rendering.

**Spec:** `docs/superpowers/specs/2026-10-25-npc-builder-design.md` (§4, §6, §7, phase 1 of §8).

## Global Constraints

Root `CLAUDE.md`. Nothing from phases 2–3 (no builder modal, no editing in the block). SRD text only,
with attribution. Clean up before every commit, then `pnpm check`.

## Review Focus

1. **Compatibility**: every key of Fantasy Statblocks' basic 5e layout parses; unknown keys are kept
   and ignored, never dropped — Task 1.
2. **Derived values**: modifiers for 1–30, proficiency bonus for CR 0 … 30 including `1/8`, `1/4`,
   `1/2` — Task 1.
3. **SRD fidelity**: each of the 21 stat blocks transcribed from SRD 5.1, spot-checked in tests
   (AC, HP, CR, one action each) — Task 2.
4. **Convert** touches only the block's opening fence line — Task 4.

---

### Task 1: Stat block model

`src/npc/statblock.ts`, tests.

- [ ] Check Fantasy Statblocks' current README for its 5e keys; adjust spec §4 if needed.
- [ ] `parseStatblock(yaml)` → model (all keys of spec §4, lists of `{ name, desc }`, saves and
      skills as name → bonus, unknown keys kept) with warnings for unreadable values;
      `modifier(score)`, `proficiencyBonus(cr)`, `crValue('1/8')`.
- [ ] `findStatblocks(text)` → blocks with their line ranges and block name (ours or `statblock`).

### Task 2: SRD data

`src/npc/srd.ts`, `src/npc/NOTICE.md`, tests.

- [ ] The 21 SRD 5.1 NPCs as stat block YAML in our format; a test parses each and checks AC, HP,
      CR and one action against the SRD.

### Task 3: Rendering

`src/obsidian/statblock-view.ts`, `main.ts`, `styles.css`, strings, `test/ui/`.

- [ ] Code block processor for `dnd5e-statblock`: the layout of spec §6 with Obsidian variables,
      16 px minimum for secondary text, phone width; unreadable YAML shows the warnings and the raw
      text.
- [ ] UI test: the example vault's blocks render name, abilities with modifiers and actions.

### Task 4: Card line and Convert

`src/factions/card.ts` (or `src/npc/summary.ts`), `card-render.ts`, `faction-view-svg.ts`,
`main.ts`.

- [ ] `AC · HP · CR` on a character's card and in the member chip's tooltip, read from the first
      stat block of the note (either block name), cached per file and invalidated on change.
- [ ] Command **Convert stat block** on the active note: `statblock` ⇄ `dnd5e-statblock`, one line
      edit per block.

### Task 5: Docs and example vault

- [ ] Convert Aldric Thane, Isolde Ferrant and Mira Voss to `dnd5e-statblock`; keep Ondine Vale on
      `statblock` for Convert; `Templates/NPC.md` uses the new block; `Home.md` rows.
- [ ] README (with the SRD attribution), CHANGELOG, DECISIONS (spec §9 once confirmed), ROADMAP,
      HANDOFF with the check in Obsidian.
