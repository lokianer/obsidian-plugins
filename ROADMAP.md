# Roadmap

Where the work stands and where to pick it up. **Read this first in every session**, local or in the
cloud, then `CLAUDE.md`. Update it at the end of every session: tick what was finished, move the
"Next step" marker, add what was decided.

The maintainer's private notes (`Obsidian Plugins Vault/`) never leave their machine, so a cloud session
cannot see them. Everything a session needs to continue is in this repository: this roadmap, the
design documents in `docs/superpowers/specs/`, the plans in `docs/superpowers/plans/`, and each
plugin's `DECISIONS.md` once it exists.

---

## Next step

**All seven modules of dnd5e-byLokianer are accepted** — the maintainer checked everything built
since 2026-10-25 in Obsidian on 2026-10-26: "es läuft alles". That covers the battle tracker
(B1–B3, optional XP), the Monster Manual's German texts (M2), the dice (R1–R4), clearing battle and
dice logs, the wrapping log button, the faction world redesign, and the quality and code work of
2026-10-26 (quality round, stylesheet per view, complexity steps 1, 4, 5).

Next asked for: **a Daggerheart plugin** — so far only its roadmap (section "Daggerheart plugin"
below), no code. What else comes next is the maintainer's call. The full list of what can still be done — complexity
steps 2 and 3, start-up time, vault scans, an installer, screenshots, small extras, the GM gate,
release preparation — is in `HANDOFF.md` "Where to continue".

**Release 0.1.0** (asked for 2026-10-26): a GitHub release `dnd5e-bylokianer-0.1.0` with a ZIP,
built by `.github/workflows/release.yml`. Not in Obsidian's plugin
directory: that needs the mirror repository and the release preparation below.

---

## dnd5e-byLokianer

A game-master plugin for D&D 5e in Obsidian. Id `dnd5e-bylokianer`, folder `plugins/dnd5e-bylokianer/`,
licence MIT. Four modules, each with its own design, built one after another; everything is our own
code, inspired by — not depending on — javalent's Initiative Tracker, Dice Roller and Fantasy
Statblocks. Test vault: `examples/vault/` (start at its `Home.md`).

### Module 1 — Factions

Design: [`docs/superpowers/specs/2026-10-24-factions-design.md`](docs/superpowers/specs/2026-10-24-factions-design.md)

- [x] **Phase 1 — Skeleton and data** (accepted 2026-10-24)
  - [x] Plugin scaffold: official sample plugin, pnpm workspace, strict TypeScript, esbuild, Vitest,
        eslint (+ `eslint-plugin-obsidianmd` if current), prettier, CI on Linux/macOS/Windows
  - [x] `commit-msg` hook rejecting attribution lines (see `CLAUDE.md`), next to the existing
        `pre-push` hook in `.githooks/`
  - [x] Plugin docs: `README.md`, `DECISIONS.md` (carry over the decisions listed below),
        `CHANGELOG.md`, `HANDOFF.md`, `LICENSE` (MIT)
  - [x] Campaign scope (`type: campaign`, its folder and below)
  - [x] Faction discovery (`factions.md` or folder-named note, sub-factions, members, Party and
        Unaffiliated pseudo-factions)
  - [x] Relation parsing: plain and `{ value, why }` forms, all warnings, clamping
  - [x] Resolution: public and true stance with inheritance, as one pure function taking the mode
  - [x] Tests against every case in `examples/vault/` (The Drowned Choir holds the broken ones)
- [x] **Minor review findings of phase 1** (2026-10-24, `4f55b5d`): strict decimal numbers, en dash
      as minus, symmetric rounding, `broken-frontmatter`, `Factions.md` in any case, other-typed
      `factions.md` not a faction, case-only and folder-name clashes, singular counts
- [x] **Phase 2 — Faction card** (built 2026-10-24, accepted 2026-10-25): a card
      replacing Properties on faction and character notes, everything editable in place as line
      edits (design §5.6), Fix buttons in the warnings modal, command Edit faction data.
      Spec `docs/superpowers/specs/2026-10-24-faction-editor-design.md`, plan
      `docs/superpowers/plans/2026-10-24-factions-phase-2-editor.md`
  - [x] Line editor `src/yaml/` (`2712fb1`), steps and targets (`fc3c807`), card model
        (`e3b446d`, `2263924`), card in Obsidian with Fix and settings (`61984a4`)
  - [x] Maintainer's check in Obsidian (2026-10-25)
- [x] **Phase 3 — World view** (built 2026-10-24, accepted 2026-10-25): own tab;
      graph with bloc layout (d3-force, chosen by the maintainer) and matrix, switchable; step-name
      settings; Public/True toggle (Public on open); warnings badge; clicks lead into the faction card.
      Spec `docs/superpowers/specs/2026-10-24-world-view-design.md`, plan
      `docs/superpowers/plans/2026-10-24-factions-phase-3-world-view.md`
  - [x] Graph and matrix models (`9448cdb`), layout (`7fd45df`), step names (`60e6956`), the view
        (`8b86a8f`)
  - [x] Maintainer's check in Obsidian (2026-10-25)
- [x] **Phase 4 — Faction view and tension panel** (built 2026-10-24, accepted 2026-10-25): drill-down inside the faction world tab with breadcrumb, own vs inherited arrows,
      rings on deviating members; tension panel in the right sidebar following the Public/True toggle.
      Spec `docs/superpowers/specs/2026-10-24-faction-view-design.md`, plan
      `docs/superpowers/plans/2026-10-24-factions-phase-4-faction-view.md`
  - [x] Tension rules and faction view model (`846ec98`), drawing, drill-down and panel (`1ff2dfd`)
  - [x] Maintainer's check in Obsidian (2026-10-25)
- [x] **Phase 5 — In-view editing and history** (built 2026-10-24, accepted 2026-10-25): value popover on cells and arrows writing the subject's own note; "Log" notice and
      session log with the once-a-day N+1 offer; history in tooltips; shared `packages/session/`.
      Spec `docs/superpowers/specs/2026-10-24-in-view-editing-history-design.md`, plan
      `docs/superpowers/plans/2026-10-24-factions-phase-5-editing-history.md`
  - [x] Package and history resolution (`86331b8`), popover, logging and tooltips (`951a54a`)
  - [x] Maintainer's check in Obsidian (2026-10-25)

- [x] **Fixes and additions from the check in Obsidian** (2026-10-25): graph fitted once the tab
      has a size (`4112e8c`) and its nodes drawn (one class token per entry, `8712c40`); bigger Log
      button; faction view sized by its labels (`65c3e9f`), linked members parted (`7419811`), frame
      and boxes draggable (`389a3af`); loot carried into the next session with its origin and the
      command Start next session (`681a70e`)

Later ideas for factions, not designed yet: time machine (replay the graph per session), domino
preview of knock-on changes, faction turn between sessions, the party as a node, what the players
know (`known: N`), rumour mill, go-betweens.

### Module 2 — NPC builder (5e stat blocks)

Design: [`docs/superpowers/specs/2026-10-25-npc-builder-design.md`](docs/superpowers/specs/2026-10-25-npc-builder-design.md)
(approved 2026-10-25).

- [x] **Phase 1 — Stat block model and view** (built and accepted 2026-10-25): parser and
      derived values, the 21 SRD NPCs as data, rendering of `dnd5e-statblock`, AC · HP · CR on the
      card, Convert command. Plan `docs/superpowers/plans/2026-10-25-npc-phase-1-statblock.md`
- [x] **Phase 2 — Builder** (built and accepted 2026-10-25): archetypes (SRD + own notes), New
      NPC modal into the faction's folder, Add stat block, random tables with overrides. Plan
      `docs/superpowers/plans/2026-10-25-npc-phase-2-builder.md`
- [x] **Phase 3 — Editing and template builder** (built and accepted 2026-10-25): editing in the rendered block, New archetype. Plan
      `docs/superpowers/plans/2026-10-25-npc-phase-3-editing.md`
- [x] **Phase 4a — Races and richer tables** (built and accepted 2026-10-25): SRD races and own
      `type: race` notes into the stat block and the dice; English and German tables (≥ 50 each);
      occupation, age, build, voice, ideal, bond, flaw, secret, hook
- [x] **Phase 4b — A fancier dialog** (built and accepted 2026-10-25): live
      preview card, roll everything with locks, race and archetype tiles. Plan
      `docs/superpowers/plans/2026-10-25-npc-phase-4b-dialog.md`

### Module 3 — Spellbook ✅ done (accepted 2026-10-25)

Design: [`docs/superpowers/specs/2026-10-25-spellbook-design.md`](docs/superpowers/specs/2026-10-25-spellbook-design.md).
Its own tab, filters, German, fancy; the 319 SRD 5.1 spells (others as own notes later). Starts when
the NPC builder is done; German distances in metres (5 ft = 1.5 m).

- [x] **S1 — Spellbook tab** (built and accepted 2026-10-25): data, German
      names and meta, search, filters, list, spell card, ribbon button. Plan
      `docs/superpowers/plans/2026-10-25-spellbook-s1.md`
- [x] **S2 — German texts** (built and accepted 2026-10-25): descriptions,
      At Higher Levels and materials of all 319 spells
- [x] **S3 — Links and own spells** (built and accepted 2026-10-25): spell
      names in stat blocks open the spellbook; `type: spell` notes join the list. Plan
      `docs/superpowers/plans/2026-10-25-spellbook-s3.md`
- [x] **Spell builder** (built and accepted 2026-10-25; asked for by the
      maintainer): New spell dialog in the New NPC dialog's style — start from an SRD spell, by
      hand, or a JSON file (own keys or the 5e-bits / Open5e shape) — with a live preview; writes a
      `type: spell` note. The deck builder got the same style

### Module 4 — Deck of Many Things ✅ done (accepted 2026-10-25)

Asked for 2026-10-25: the Deck of Many Things to draw from, the standard deck by default and the
option to make one's own. The deck is in the SRD 5.1 (magic items), so its 22 cards can ship.
Design: [`docs/superpowers/specs/2026-10-25-deck-of-many-things-design.md`](docs/superpowers/specs/2026-10-25-deck-of-many-things-design.md)
(reviewed 2026-10-25).

- [x] **D1 — Standard deck** (built and accepted 2026-10-25): card data in
      both languages, the tab, drawing by the rules, the deck note with its draw history. Plan
      `docs/superpowers/plans/2026-10-25-deck-d1.md`
- [x] **D2 — Own decks, builder, reset** (built and accepted 2026-10-25):
      own `type: deck` notes in the tab, the deck builder (by hand, from the standard deck, pasted
      text, a JSON file), reset of the history (and the cards). Plan
      `docs/superpowers/plans/2026-10-25-deck-d2.md`

### Module 5 — Monster Manual ✅ done (accepted 2026-10-25, German texts 2026-10-26)

Asked for 2026-10-25: "a Monster Manual beside the spellbook, built like the spellbook, before the
battle tracker". The SRD 5.1's monsters (about 330, CC-BY-4.0) in their own tab: search, filters
(challenge rating, type, size, environment …), a list and the stat block as the card, English and
German. The battle tracker will draw its monsters from here.
Design: [`docs/superpowers/specs/2026-10-25-monster-manual-design.md`](docs/superpowers/specs/2026-10-25-monster-manual-design.md)
(reviewed 2026-10-25).

- [x] **M1 — Monster Manual tab** (built and accepted 2026-10-25): the 334
      monsters as data, German names and meta, search, filters, list, stat block card, Insert into
      note, Make a note. Plan `docs/superpowers/plans/2026-10-25-monster-manual-m1.md`
- [x] **M2 — German texts** of all traits and actions (built 2026-10-25, accepted 2026-10-26).
      Plan `docs/superpowers/plans/2026-10-25-monster-manual-m2.md`
- [x] **M3 — Own monsters, a monster builder and a file import** (built ahead of M2 on request,
      accepted 2026-10-25). Plan `docs/superpowers/plans/2026-10-25-monster-manual-m3.md`

### Module 6 — Battle tracker ✅ done (accepted 2026-10-26)

Brainstormed with the maintainer 2026-10-25: its own tab; initiative, rounds, hit points and
conditions; the session log; an encounter builder; combatants from encounter notes, the Monster
Manual and the party; the fight's state in the encounter note.
Design: [`docs/superpowers/specs/2026-10-25-battle-tracker-design.md`](docs/superpowers/specs/2026-10-25-battle-tracker-design.md)
(reviewed 2026-10-25).

- [x] **B1 — The tracker** (built 2026-10-25, accepted 2026-10-26): encounter notes, initiative,
      rounds, HP, conditions, `## Combat` state. Plan `docs/superpowers/plans/2026-10-25-battle-b1.md`
- [x] **B2 — Log and Monster Manual** (built 2026-10-25, accepted 2026-10-26): session log lines,
      Add to combat, adding and removing mid-fight. Plan `docs/superpowers/plans/2026-10-25-battle-b2.md`
- [x] **B3 — Encounter builder** (built 2026-10-25, accepted 2026-10-26): New encounter with the
      SRD 5.2.1 XP budget, Add to encounter. Plan `docs/superpowers/plans/2026-10-25-battle-b3.md`

### Module 7 — Dice ✅ done (accepted 2026-10-26)

Brainstormed with the maintainer 2026-10-26: a Dice tab, `dice:` in notes, rolls in stat blocks;
formulas, rollable tables and character rolls; the log like the battle log; plain animation.
Design: [`docs/superpowers/specs/2026-10-26-dice-design.md`](docs/superpowers/specs/2026-10-26-dice-design.md)
(reviewed 2026-10-26: "passt so", every die on the stage, mind overlaps).

- [x] **R1 — Engine, dice stage, Dice tab, `dice:` in notes, log** (built and accepted
      2026-10-26). Plan `docs/superpowers/plans/2026-10-26-dice-r1.md`
- [x] **R2 — Rollable tables** (built and accepted 2026-10-26). Plan
      `docs/superpowers/plans/2026-10-26-dice-r2.md`
- [x] **R3 — Stat blocks and characters** (built and accepted 2026-10-26). Plan
      `docs/superpowers/plans/2026-10-26-dice-r3.md`
- [x] **R4 — Critical hits and ability checks** (built and accepted 2026-10-26). Plan
      `docs/superpowers/plans/2026-10-26-dice-r4.md`

### Not placed yet

The GM gate from the Rhizom handoff — `[!gm]` callouts with `revealed:`, `%%comments%%`, "which notes
the players have met", a player export. The maintainer has not prioritised it yet; the factions design
already keeps secrets apart (`secret_relations`, Public mode by default) so it can come later.
Self-hosted sync for players needs a separate vault and server instance — every sync token sees the
whole vault.

### Decisions so far (carry into `plugins/dnd5e-bylokianer/DECISIONS.md` in phase 1)

- Scope: factions, NPC builder, battle tracker, dice — all our own code (2026-10-24); a spellbook
  joins as module 3, after the NPC builder, and the Deck of Many Things as module 4 (2026-10-25).
- Factions are folders holding `factions.md` (or a note named like the folder); members are the
  character notes in that folder; a faction folder inside another is a sub-faction.
- Relations −5 … +5, one-directional, red–yellow–green; `relations` = public face,
  `secret_relations` = true stance; characters inherit and may override; `power: 1–5`.
- English nomenclature for every file name and key; German only as UI translation.
- Name `dnd5e-byLokianer`, id `dnd5e-bylokianer`, licence MIT; Rhizom code relicensed to MIT by its
  sole author.
- Self-hosted sync (Self-Hosted Vault Sync server at `vault.home`) lives in the maintainer's
  HomeServer repository, never here.

### Before the first release (not now: the maintainer decided on 2026-10-25 to publish nothing yet)

- Read Obsidian's current plugin guidelines and submission checklist.
- Check the name against Wizards of the Coast's trademark rules; ship SRD content only.
- Release mirror repository for the plugin (Obsidian reads `manifest.json` from a repo root).

---

## Daggerheart plugin (planned, 2026-10-26)

Asked for by the maintainer ("können wir dasselbe für Daggerheart machen?"), then "Mache nur eine
Roadmap, keinen Code". Decided with them on 2026-10-26: **a plugin of its own** under `plugins/`
(own version and release), with all four module groups below, and **research before the spec**.
Nothing is built yet; every phase gets a spec section, a plan and a review stop, as for dnd5e.

### What is known (research of 2026-10-26)

- **Licence.** Daggerheart's SRD 1.0 is Public Game Content under the **Darrington Press Community
  Gaming License (DPCGL)**, not CC-BY: free use without fees, our own code stays ours (MIT), but
  only SRD 1.0 content — nothing exclusive to the rulebook, no scanned cards, art or logos — and a
  copyright notice. The notice other plugins ship (BeastVault): "This plugin includes materials from
  the Daggerheart System Reference Document 1.0, © Critical Role, LLC. All rights reserved. Public
  Game Content created and owned by Darrington Press, LLC. Available at https://www.daggerheart.com.
  Licensed under the Darrington Press Community Gaming License:
  https://darringtonpress.com/license/." The full licence text could not be read from the cloud
  session (darringtonpress.com is blocked there): **read it in full before any data goes in**,
  above all on using "Daggerheart" in a plugin's name and on translations.
- **Existing Obsidian plugins** (CLAUDE.md: do not duplicate, integrate):
  - **BeastVault** (`ly0va/beastvault`): SRD adversaries and environments, a `daggerheart` code
    block in YAML (`name`, `tier`, `type`, `difficulty`, `weapon`, `range`, `damage`, `hp`,
    `stress`, `thresholds: 9/17`, `attack`, `xp`, `motives`, `features` with `name`, `type`,
    `desc`, `uses`, `countdown`; environments with `impulses`, `adversaries`, `tone`), HP and stress
    tracking, battle points in the status bar, a library folder, Fantasy Statblocks layouts
    `Daggerheart Adversary` / `Daggerheart Environment`.
  - **DaggerForge** (Torutu, about 3,000 downloads): adversaries and environments, own content, HP
    and stress trackers, dice, a battle calculator after the rulebook's Battle Guide; characters and
    items planned.
  - **daggerheart-tracker** (Codeberg, Batres): a combat tracker with difficulty, HP, stress and
    battle points; reads Fantasy Statblocks creatures.
  - What none of them has, and this plugin would add: factions and their relations, the session
    log with loot, a dice stage, everything in one plugin with English and German.
- **SRD as data:** markdown of the SRD 1.0 on GitHub (`seansbox/daggerheart-srd`, credited by
  other tools; one file per adversary, domain cards in `abilities/`) and JSON (Katari, SRD data
  under the DPCGL). Both still to be checked against the SRD itself.

### Phases

- [ ] **H0 — Preparation** (local session for the licence): read the DPCGL in full; choose the
      name (with or without "Daggerheart" — the licence decides); choose and check the data
      source; try BeastVault, DaggerForge and the tracker in Obsidian and write down what to be
      compatible with (BeastVault's `daggerheart` block is the likely format to read).
- [ ] **H1 — Shared packages**: move what both plugins need out of dnd5e-byLokianer into
      `packages/` — the faction model, stances and tensions, the session log (already
      `packages/session`), the dice engine. dnd5e's tests must pass unchanged. Decide whether the
      dice stage (DOM) may become a shared UI package; CLAUDE.md allows only pure packages today.
- [ ] **H2 — Plugin skeleton, factions and session log**: `plugins/<id>/`, the faction card,
      world and tensions, the session log, settings, English and German, an example campaign in
      `examples/vault/` beside Silverstadt.
- [ ] **H3 — Adversaries and environments**: the SRD's adversaries and environments as data, a tab
      like the Monster Manual (tier, type, search), a stat block in notes (read BeastVault's
      `daggerheart` block; own block name or the same — to decide), HP and stress slots, damage
      thresholds, features with uses and countdowns, own adversaries, a builder, import.
- [ ] **H4 — Dice**: duality dice (2d12, Hope and Fear; doubles are a critical success),
      advantage and disadvantage as a d6, the stage with Hope / Fear verdicts, `dice:` in notes,
      rollable tables, rolls from stat blocks; the log like dnd5e's.
- [ ] **H5 — Combat and encounters**: no initiative — the spotlight, the GM's Fear, HP and
      stress, thresholds (minor / major / severe), conditions, countdowns; the fight kept in the
      encounter note; an encounter builder with Battle Points.
- [ ] **H6 — Domain cards**: the nine SRD domains as a tab like the spellbook, filters by domain
      and level, own cards and a builder.
- [ ] **H7 — Release**: README, CHANGELOG, DECISIONS, the Pages card and sections, the release
      workflow generalised to a second plugin (tag `<id>-<version>`).

### Open questions for the maintainer

- The plugin's name and id (depends on the licence's rules for "Daggerheart").
- German: only the interface, or the SRD texts too (does the DPCGL allow translations)?
- Compatibility: read BeastVault's `daggerheart` blocks, or our own format with a converter (as
  dnd5e does for Fantasy Statblocks)?
- Characters (sheets, Hope, stress, armour): out of scope for now, or a later module?

## Repository

- [x] Repository rules (`CLAUDE.md`), private vault git-ignored with a `pre-push` guard (2026-10-24)
- [x] Example vault `examples/vault/` (2026-10-24)
- [x] pnpm workspace root (`package.json`, `pnpm-workspace.yaml`) — with phase 1
- [x] CI workflow — with phase 1
- [x] Git hooks stored executable, so they run on Linux and macOS too (2026-10-24, `7866980`)
- [x] Prettier enforced: `pnpm format`, `format:check` in CI, `pre-commit` hook; `pnpm check` runs
      everything (2026-10-24, `ff4807a`, `2263924`)
