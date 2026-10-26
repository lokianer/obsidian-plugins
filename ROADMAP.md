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

**dnd5e-byLokianer · Dice** (module 7) — design reviewed 2026-10-26 ("passt so"), **R1 and R2 built**
(plans `docs/superpowers/plans/2026-10-26-dice-r1.md`, `…-r2.md`), waiting for the check in
Obsidian (HANDOFF points 64–71); then R3 (stat blocks and characters).

**dnd5e-byLokianer · Battle tracker** (module 6) — design reviewed ("passt"), **B1, B2 and B3
built** (plans `docs/superpowers/plans/2026-10-25-battle-b1.md`, `…-b2.md`, `…-b3.md`), waiting for
the check in Obsidian (HANDOFF points 47–60; the maintainer tests later). M2 (German monster texts) built 2026-10-25 too, awaiting the check
(HANDOFF points 61–63).
Accepted on 2026-10-25 ("passt alles, sieht gut aus"): spellbook S3 and the spell builder, the
restyled deck builder, the Monster Manual (M1, M3 with the import). Open for later: the Monster
Manual's German traits and actions (M2, now built); the faction world redesign's check. Nothing is published.

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

### Module 5 — Monster Manual ✅ accepted 2026-10-25 (German traits and actions later)

Asked for 2026-10-25: "a Monster Manual beside the spellbook, built like the spellbook, before the
battle tracker". The SRD 5.1's monsters (about 330, CC-BY-4.0) in their own tab: search, filters
(challenge rating, type, size, environment …), a list and the stat block as the card, English and
German. The battle tracker will draw its monsters from here.
Design: [`docs/superpowers/specs/2026-10-25-monster-manual-design.md`](docs/superpowers/specs/2026-10-25-monster-manual-design.md)
(reviewed 2026-10-25).

- [x] **M1 — Monster Manual tab** (built and accepted 2026-10-25): the 334
      monsters as data, German names and meta, search, filters, list, stat block card, Insert into
      note, Make a note. Plan `docs/superpowers/plans/2026-10-25-monster-manual-m1.md`
- [ ] **M2 — German texts** of all traits and actions (built 2026-10-25, awaiting the check).
      Plan `docs/superpowers/plans/2026-10-25-monster-manual-m2.md`
- [x] **M3 — Own monsters, a monster builder and a file import** (built ahead of M2 on request,
      accepted 2026-10-25). Plan `docs/superpowers/plans/2026-10-25-monster-manual-m3.md`

### Module 6 — Battle tracker

Brainstormed with the maintainer 2026-10-25: its own tab; initiative, rounds, hit points and
conditions; the session log; an encounter builder; combatants from encounter notes, the Monster
Manual and the party; the fight's state in the encounter note.
Design: [`docs/superpowers/specs/2026-10-25-battle-tracker-design.md`](docs/superpowers/specs/2026-10-25-battle-tracker-design.md)
(reviewed 2026-10-25).

- [ ] **B1 — The tracker** (built 2026-10-25, awaiting the check): encounter notes, initiative,
      rounds, HP, conditions, `## Combat` state. Plan `docs/superpowers/plans/2026-10-25-battle-b1.md`
- [ ] **B2 — Log and Monster Manual** (built 2026-10-25, awaiting the check): session log lines,
      Add to combat, adding and removing mid-fight. Plan `docs/superpowers/plans/2026-10-25-battle-b2.md`
- [ ] **B3 — Encounter builder** (built 2026-10-25, awaiting the check): New encounter with the
      SRD 5.2.1 XP budget, Add to encounter. Plan `docs/superpowers/plans/2026-10-25-battle-b3.md`

### Module 7 — Dice

Brainstormed with the maintainer 2026-10-26: a Dice tab, `dice:` in notes, rolls in stat blocks;
formulas, rollable tables and character rolls; the log like the battle log; plain animation.
Design: [`docs/superpowers/specs/2026-10-26-dice-design.md`](docs/superpowers/specs/2026-10-26-dice-design.md)
(reviewed 2026-10-26: "passt so", every die on the stage, mind overlaps).

- [ ] **R1 — Engine, dice stage, Dice tab, `dice:` in notes, log** (built 2026-10-26, awaiting the
      check). Plan `docs/superpowers/plans/2026-10-26-dice-r1.md`
- [ ] **R2 — Rollable tables** (built 2026-10-26, awaiting the check). Plan
      `docs/superpowers/plans/2026-10-26-dice-r2.md`
- [ ] **R3 — Stat blocks and characters**

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

## Repository

- [x] Repository rules (`CLAUDE.md`), private vault git-ignored with a `pre-push` guard (2026-10-24)
- [x] Example vault `examples/vault/` (2026-10-24)
- [x] pnpm workspace root (`package.json`, `pnpm-workspace.yaml`) — with phase 1
- [x] CI workflow — with phase 1
- [x] Git hooks stored executable, so they run on Linux and macOS too (2026-10-24, `7866980`)
- [x] Prettier enforced: `pnpm format`, `format:check` in CI, `pre-commit` hook; `pnpm check` runs
      everything (2026-10-24, `ff4807a`, `2263924`)
