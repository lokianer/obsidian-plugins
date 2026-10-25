# How to go on — concept

Date: 2026-10-25. Status: **proposal for the maintainer**. Written after the factions module was
built in full (phases 1–5) on 2026-10-24, none of it yet run inside Obsidian beyond phase 1.

## 1. Where we stand

- **Built:** the factions module of `dnd5e-byLokianer` — data model and warnings (1, accepted), the
  faction card that replaces Properties (2), the faction world with graph and matrix (3), faction
  view and tension panel (4), popover editing and the session log with history (5); the shared
  package `packages/session`. 164 tests, CI on three systems, Prettier enforced.
- **Proven (update 2026-10-25):** the maintainer ran the whole checklist in Obsidian; after the
  fixes it turned up (graph nodes, faction view sizing, dragging, loot carry-over) every point
  passed, so Step A's "prove and fix" is done — only its UI smoke tests in CI remain open.
- **Open from the plan:** modules 2 (NPC builder), 3 (battle tracker) and 4 (dice); the GM gate;
  the factions "later ideas"; release preparation.

## 2. Principles for the next steps

1. **Prove before adding.** Nothing new is built on top of phases 2–5 until they have run in the
   maintainer's Obsidian. Five unproven phases are already a large stack.
2. **Play-driven.** The next feature should be the one the next game session misses most, not the
   next one on the list.
3. **Integrate, don't duplicate** (root `CLAUDE.md`): Dice Roller and Fantasy Statblocks are on the
   "do not duplicate" list, and Initiative Tracker is in the same family. That conflicts with the
   early scope decision "all our own code" for modules 2–4 and needs a decision before they start.
4. **Small releases.** A version people (and the maintainer's table) can install beats a perfect
   module set.

## 3. Proposed order

### Step A — Prove and fix (next session, ~1–2 sessions)

- The maintainer runs the 23-point checklist in `HANDOFF.md` in Obsidian (desktop, then phone or
  `app.emulateMobile(true)`), noting what breaks or feels wrong. Screenshots help a cloud session.
- One **fix slice** per finding group (mounting, pointers, popover, logging, looks), each with a
  test where the cause is in pure code.
- **UI smoke tests in CI**, so this kind of check stops depending on a manual browser preview: turn
  the session's preview harness (stub `obsidian` module + Obsidian DOM helpers) into
  `test/ui/` with Vitest and `happy-dom` (dev dependency, justified as the only way to run the
  renderers in CI). Each view renders the example vault without throwing; key elements exist;
  clicks produce the expected edit operation. Also a script that writes preview screenshots.
- Accept phases 2–5 one by one; the roadmap ticks them.

### Step B — First release `0.1.0` (factions only, ~1 session)

- Read Obsidian's current plugin guidelines and the submission checklist; fix what they ask
  (command names, settings headings, `minAppVersion`, no inline styles, mobile).
- **Name check** against Wizards of the Coast's trademark guidance; ship SRD-free content (factions
  hold no rules text, so this is about the name only). Decide whether `dnd5e-byLokianer` stays.
- **Release mirror repository** (D19): CI copies `plugins/dnd5e-bylokianer/` into its own repo with
  `manifest.json` at the root and attaches `main.js`, `manifest.json`, `styles.css` to a GitHub
  release; `versions.json` and the changelog are bumped by a small script.
- Distribute as a **beta via BRAT** first (no community review yet); submit to the community list
  once it has survived a few real sessions.

### Step C — Decide the overlap with mature plugins (one short decision, before module 2)

Options for modules 2–4:

| Option                      | Meaning                                                                                                | For                                                        | Against                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- | ----------------------------------------------------------- |
| **Integrate** (recommended) | Use Fantasy Statblocks' `statblock` fence and Dice Roller's roll syntax/API; build only what they lack | follows CLAUDE.md; users already have them; much less code | depends on their APIs; less control over look               |
| Own code, compatible        | Own renderers that read and write their formats                                                        | full control; no runtime dependency                        | duplicates mature work; more to maintain                    |
| Own code, own formats       | As first scoped                                                                                        | —                                                          | contradicts "readable without the plugin" for others' notes |

Recommendation: **integrate**, and record it in the plugin's `DECISIONS.md` as a revision of the
2026-10-24 scope decision. What stays ours is what none of them do: factions, the session log as
the shared spine, and campaign-aware glue (an NPC's faction, an encounter's stakes for factions).

### Step D — Module 2: NPC builder (brainstorm, then phases)

Under "integrate", the NPC builder becomes a **builder and organiser**, not a renderer:

- A command/modal that creates an NPC note from SRD 5.1 archetypes (guard, cultist, noble …) or
  from scratch: name, faction (dropdown from the factions world — the note goes into that faction's
  folder), role, a few personality lines, and a `statblock` fence in Fantasy Statblocks' format.
- A CR helper for custom creatures (SRD encounter math), writing the result into the fence.
- The faction card shows a member's stat line (AC, HP, CR) when the note has a fence.
- Example vault: `Sergeant Pell.md` (no stat block yet) is the first test case.

Brainstorm questions for the maintainer: which archetypes, how much text generation (none —
files first and no network; tables only), where NPC notes go, how the card should show stats.

### Step E — After that, by play feedback

- **Module 3, battle tracker:** with Initiative Tracker integrated, our part would be the session
  log of a fight (rounds, damage, outcomes into `## Log` via `packages/session`) and encounter
  notes tied to factions ("who loses face if this fight is lost").
- **Module 4, dice:** with Dice Roller integrated, our part is logging rolls and rollable-table
  results into the session note (the example vault's `Street Rumours`, `Omens of the River`).
- **GM gate** (`[!gm]` callouts with `revealed:`, a player export): becomes interesting once the
  maintainer wants to share notes with players; needs its own design because of the sync setup
  (every sync token sees the whole vault).
- **Factions later ideas,** in the order the data now supports them: the **time machine** (history
  exists since phase 5 — replay the matrix at session N), the **party as a node**, **what the
  players know** (`known: N`), **domino preview**, **faction turn** between sessions, **rumour
  mill**, **go-betweens**.

## 4. Process

- Keep the rhythm that worked: question → spec → plan → "passt" → build → preview → hand-off.
  Add one rule: a phase is **accepted** only after it ran in Obsidian.
- One work branch per module or release (`feat/npc-builder`, `release/0.1`); `main` fast-forwards
  when a slice is green — the maintainer pulls `main`.
- The private vault's daily reports and changelog are written by a local session; a cloud session
  leaves everything a later session needs in `ROADMAP.md`, `HANDOFF.md` and the specs.

## 5. Decisions needed from the maintainer

1. The order A → B → C → D → E (or a different priority, e.g. NPC builder before the release).
2. Integrate vs own code for modules 2–4 (Step C).
3. `happy-dom` as a dev dependency for UI smoke tests (Step A).
4. Release path: BRAT beta first, community submission later — and whether the name stays.
