# Roadmap

What is done, what is planned and in which order. Each session starts here, then reads
`HANDOFF.md` (how the last session ended) and `CLAUDE.md` (the rules). At the end of a session this
file is updated: finished work ticked, decisions recorded, the next steps reordered.

The maintainer's private vault (`Obsidian Plugins Vault/`) never leaves their machine. Everything a
session needs is in the repository: this roadmap, the designs in `docs/superpowers/specs/`, the
phase plans in `docs/superpowers/plans/` and each plugin's `DECISIONS.md`.

---

## Status

| Plugin                                            | State                                                   | Released                                                                                                        |
| ------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [dnd5e-byLokianer](plugins/dnd5e-bylokianer/)     | Seven modules built and accepted in Obsidian            | [0.1.0](https://github.com/lokianer/obsidian-plugins/releases/tag/dnd5e-bylokianer-0.1.0) on GitHub, 2026-10-26 |
| [Daggerheart plugin](#daggerheart-plugin-planned) | Planned: research done, design not started, no code yet | —                                                                                                               |

Neither plugin is in Obsidian's community directory yet.

## Next steps

In order of priority. Items marked **(open)** wait for the maintainer's decision.

1. **dnd5e-byLokianer: code quality.** Reduce complexity, steps 2 and 3 (see
   [Code quality](#code-quality)); afterwards turn the lint limits into errors and tighten them.
2. **dnd5e-byLokianer: performance (open).** Load the SRD data (80 % of the 2 MB `main.js`) on first
   use instead of at start-up; cache per file instead of rescanning the vault after each change.
3. **Distribution (open).** A script installing a build into any vault; the release mirror
   repository and the submission to Obsidian's community directory (see
   [Before the directory](#before-the-community-directory)).
4. **Daggerheart plugin.** Phase H0 (licence, name, data source, existing plugins), then the design
   and phases H1–H7 (see [Daggerheart plugin](#daggerheart-plugin-planned)).
5. **dnd5e-byLokianer: extensions (open).** The GM gate; hidden GM rolls; critical damage after a
   natural 20; a critical hit's two failed death saves; re-reading a fight edited by hand; removing
   log lines from earlier sessions.
6. **Screenshots.** The encounter builder and the Monster Manual with German texts, taken in
   Obsidian, for the plugin README and the project page.

---

## dnd5e-byLokianer

Game-master tools for D&D 5e in Obsidian. Id `dnd5e-bylokianer`, folder `plugins/dnd5e-bylokianer/`,
licence MIT, SRD content under CC-BY-4.0. Our own code throughout, compatible with — not
depending on — Fantasy Statblocks, Dice Roller and Initiative Tracker. Test vault:
`examples/vault/` (start at `Home.md`). Decisions: [`DECISIONS.md`](plugins/dnd5e-bylokianer/DECISIONS.md).

### Module 1 — Factions ✅

Design [`2026-10-24-factions-design.md`](docs/superpowers/specs/2026-10-24-factions-design.md).

- [x] **Phase 1 — Data model and warnings** (2026-10-24): campaign scope, faction discovery,
      relations with inheritance, public and true stance, warnings.
- [x] **Phase 2 — Faction card** (accepted 2026-10-25): the card in place of Properties, edited
      line by line. Spec `2026-10-24-faction-editor-design.md`, plan `…-factions-phase-2-editor.md`.
- [x] **Phase 3 — Faction world** (accepted 2026-10-25): graph and matrix, step names, Public / True.
      Spec `2026-10-24-world-view-design.md`, plan `…-factions-phase-3-world-view.md`.
- [x] **Phase 4 — Faction view and tensions** (accepted 2026-10-25): drill-down, tension panel.
      Spec `2026-10-24-faction-view-design.md`, plan `…-factions-phase-4-faction-view.md`.
- [x] **Phase 5 — Editing in the views and history** (accepted 2026-10-25): value popover, session
      log, history in tooltips, `packages/session`. Spec
      `2026-10-24-in-view-editing-history-design.md`, plan `…-factions-phase-5-editing-history.md`.
- [x] **Follow-ups** (2026-10-25/26): graph sizing and drawing, draggable faction view, loot carried
      into the next session, the faction world redesign, a wrapping log button.

Ideas, not designed: replaying the graph per session, a preview of knock-on changes, a faction turn
between sessions, the party as a node, what the players know, a rumour mill, go-betweens.

### Module 2 — NPC builder ✅

Design [`2026-10-25-npc-builder-design.md`](docs/superpowers/specs/2026-10-25-npc-builder-design.md).

- [x] **Phase 1 — Stat blocks** (accepted 2026-10-25): model, the 21 SRD NPCs, the
      `dnd5e-statblock` view, short stats on the card, conversion from Fantasy Statblocks.
- [x] **Phase 2 — Builder** (accepted 2026-10-25): archetypes, New NPC, Add stat block, dice tables.
- [x] **Phase 3 — Editing** (accepted 2026-10-25): editing in the rendered block, New archetype.
- [x] **Phase 4a — Races and tables** (accepted 2026-10-25): SRD and own races, English and German
      tables with at least 50 entries each.
- [x] **Phase 4b — Dialog** (accepted 2026-10-25): tiles, live preview, roll everything with locks.

### Module 3 — Spellbook ✅

Design [`2026-10-25-spellbook-design.md`](docs/superpowers/specs/2026-10-25-spellbook-design.md).

- [x] **S1 — Tab** (accepted 2026-10-25): 319 SRD spells, German names, search, filters, card.
- [x] **S2 — German texts** (accepted 2026-10-25).
- [x] **S3 — Links and own spells** (accepted 2026-10-25): spell names in stat blocks open the
      spellbook; `type: spell` notes join it.
- [x] **Spell builder** (accepted 2026-10-25): from an SRD spell, by hand or from JSON.

### Module 4 — Deck of Many Things ✅

Design [`2026-10-25-deck-of-many-things-design.md`](docs/superpowers/specs/2026-10-25-deck-of-many-things-design.md).

- [x] **D1 — Standard deck** (accepted 2026-10-25): 22 cards in both languages, drawn by the rules,
      the draw history in a deck note.
- [x] **D2 — Own decks** (accepted 2026-10-25): `type: deck` notes, a deck builder, reset.

### Module 5 — Monster Manual ✅

Design [`2026-10-25-monster-manual-design.md`](docs/superpowers/specs/2026-10-25-monster-manual-design.md).

- [x] **M1 — Tab** (accepted 2026-10-25): 334 SRD monsters, German names and meta, filters, Insert
      into note, Make a note.
- [x] **M2 — German texts** (accepted 2026-10-26): all traits and actions, checked against the
      English.
- [x] **M3 — Own monsters** (accepted 2026-10-25): `type: monster` notes, a monster builder, import
      from Fantasy Statblocks, 5etools and Open5e files.

### Module 6 — Battle tracker ✅

Design [`2026-10-25-battle-tracker-design.md`](docs/superpowers/specs/2026-10-25-battle-tracker-design.md).

- [x] **B1 — Tracker** (accepted 2026-10-26): encounter notes, initiative, rounds, hit points,
      death saves, conditions, the fight in the note's `## Combat` table.
- [x] **B2 — Log and Monster Manual** (accepted 2026-10-26): moments in the session log, Add to
      combat, combatants joining and leaving.
- [x] **B3 — Encounter builder** (accepted 2026-10-26): the SRD 5.2.1 XP budget, optional XP.
- [x] **Clearing** (accepted 2026-10-26): reset a fight, remove battle lines from the session log.

### Module 7 — Dice ✅

Design [`2026-10-26-dice-design.md`](docs/superpowers/specs/2026-10-26-dice-design.md).

- [x] **R1 — Engine and stage** (accepted 2026-10-26): formulas, a dice stage modelled on Baldur's
      Gate 3, the Dice tab, `dice:` in notes, the dice log.
- [x] **R2 — Rollable tables** (accepted 2026-10-26).
- [x] **R3 — Stat blocks and characters** (accepted 2026-10-26): attacks, damage, saves and skills
      as buttons; the party's checks.
- [x] **R4 — Critical hits and ability checks** (accepted 2026-10-26).
- [x] **Clearing** (accepted 2026-10-26): clear the list, remove dice lines from the session log.

### Code quality

A complexity analysis (ESLint `complexity`, 2026-10-26) found 62 functions above 10 and an
`onload` of 587 lines.

- [x] Quality review of everything since B1, with fixes (2026-10-26).
- [x] Stylesheet split into one file per view under `styles/`.
- [x] Step 1: tension rules and faction discovery split by rule and step.
- [x] Step 4: one registration per module under `src/obsidian/register/`; `main.ts` 42 lines.
- [x] Step 5: complexity (20) and function length (150) as lint warnings.
- [x] Code scanning alert #8: escape backslashes and pipes in combat-table cells.
- [ ] Step 2: tables instead of `if` chains in the importers, `tokenize`, `readRow`, `fieldBlock`.
- [ ] Step 3: the largest renderers in named parts (stat block, battle card, popover, NPC preview,
      dice stage).

### Not placed yet

- **GM gate:** `[!gm]` callouts with `revealed:`, hidden comments, which notes the players have
  met, a player export. The faction model already separates secrets (`secret_relations`, Public
  mode by default).
- **Player sync:** a separate vault and server instance, since every sync token sees the whole
  vault. Server setups belong in the HomeServer repository, not here.

### Before the community directory

- [x] First GitHub release, 0.1.0 (2026-10-26), built by `.github/workflows/release.yml`.
- [ ] Obsidian's current plugin guidelines and submission checklist.
- [ ] The plugin's name against Wizards of the Coast's trademark rules.
- [ ] A release mirror repository with `manifest.json` at its root, pushed by CI.

---

## Daggerheart plugin (planned)

Game-master tools for Daggerheart, as a plugin of its own under `plugins/` with its own version and
releases. Planned modules: factions and the session log, adversaries and environments, combat and
encounters, dice and domain cards. Research is done; the design has not started and no code
exists. Each phase will get a design section, a plan and a check in Obsidian, as for
dnd5e-byLokianer.

### Findings

- **Licence.** Daggerheart's SRD 1.0 is Public Game Content under the Darrington Press Community
  Gaming License (DPCGL): free to use without fees, our own code stays MIT, but only SRD content
  (nothing exclusive to the rulebook, no card art or logos) and with the licence's copyright notice.
  The full licence text still has to be read (it is not reachable from cloud sessions), above all
  on the use of "Daggerheart" in a product name and on translations.
- **Existing Obsidian plugins.**
  - BeastVault: SRD adversaries and environments in a `daggerheart` YAML code block (`tier`,
    `difficulty`, `hp`, `stress`, `thresholds`, `attack`, `features` with uses and countdowns),
    HP and stress tracking, battle points, Fantasy Statblocks layouts.
  - DaggerForge: adversaries and environments, own content, trackers, dice, a battle calculator.
  - daggerheart-tracker: a combat tracker reading Fantasy Statblocks creatures.
  - None offers factions, a session log with loot or a dice stage; this plugin would add those and
    read BeastVault's blocks where possible.
- **Data sources.** SRD 1.0 as Markdown (one file per adversary and per domain card) and as JSON,
  both published under the DPCGL; to be verified against the SRD before use.

### Phases

- [ ] **H0 — Preparation:** read the DPCGL in full; decide the name; choose and verify the data
      source; try the existing plugins and fix the compatibility targets.
- [ ] **H1 — Shared packages:** move the faction model, the session log and the dice engine into
      `packages/` for both plugins, with dnd5e-byLokianer's tests unchanged; decide whether a
      shared UI package (the dice stage) is allowed.
- [ ] **H2 — Skeleton:** the plugin with factions and the session log, settings, English and
      German, an example campaign.
- [ ] **H3 — Adversaries and environments:** SRD data, a tab, stat blocks in notes with HP and
      stress slots, thresholds, features and countdowns; own adversaries, a builder, import.
- [ ] **H4 — Dice:** duality dice (2d12 Hope and Fear, doubles critical), advantage as a d6, the
      stage, rollable tables, rolls from stat blocks.
- [ ] **H5 — Combat and encounters:** the spotlight and the GM's Fear, HP and stress, damage
      thresholds, countdowns, the fight in the encounter note, an encounter builder with Battle
      Points.
- [ ] **H6 — Domain cards:** the nine SRD domains as a tab, own cards, a builder.
- [ ] **H7 — Release:** documentation, project page, the release workflow for a second plugin.

### Open questions

- Name and id, subject to the licence.
- German: the interface only, or the SRD texts as well.
- Stat block format: BeastVault's `daggerheart` block, or an own block with a converter.
- Characters (sheets, Hope, stress, armour): out of scope, or a later module.

---

## Repository

- [x] Rules (`CLAUDE.md`), the private vault git-ignored and guarded by a `pre-push` hook.
- [x] pnpm workspace, shared `packages/session`, example vault `examples/vault/`.
- [x] CI on Linux, macOS and Windows: format, lint, typecheck, tests, build.
- [x] Hooks: `pre-commit` (format), `commit-msg` (no attribution lines), `pre-push` (no vault).
- [x] Project page on GitHub Pages: an overview and one page per plugin; screenshots kept in each
      plugin's `screenshots/`.
- [x] Release workflow: started by hand or by a tag `<id>-<version>`; checks, builds and publishes
      a ZIP with `main.js`, `manifest.json` and `styles.css`.
- [ ] Generalise the release and Pages workflows when the second plugin arrives.
