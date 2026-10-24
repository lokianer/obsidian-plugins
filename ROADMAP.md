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

**dnd5e-byLokianer · Factions · next phase — ask first.** Phase 1 is accepted (2026-10-24). The
maintainer also wants a **faction editor** (all frontmatter incl. relations, see `HANDOFF.md`);
ask whether it comes before the world view. Then write the next phase's spec and plan from the design
([`docs/superpowers/specs/2026-10-24-factions-design.md`](docs/superpowers/specs/2026-10-24-factions-design.md))
with superpowers:writing-plans; build only once the maintainer has approved that plan.

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
- [ ] **Faction editor** (wish 2026-10-24, placement open): form for all frontmatter incl.
      relations, Fix button from the warnings modal; line edits as in spec §5.6
- [ ] **Phase 2 — World view** ← *next, unless the editor goes first*: graph with bloc layout and matrix, switchable; colours and step names;
      Public/True toggle (Public by default); warnings badge; click behaviour
- [ ] **Phase 3 — Faction view and tension panel**
- [ ] **Phase 4 — Editing and history**: sliders writing line edits; shared "tonight's session"
      package with the offer to create session N+1; history log lines and tooltips

Later ideas for factions, not designed yet: time machine (replay the graph per session), domino
preview of knock-on changes, faction turn between sessions, the party as a node, what the players
know (`known: N`), rumour mill, go-betweens.

### Module 2 — NPC builder (5e stat blocks)

Not brainstormed yet. Starting points: the ` ```statblock ` fences already in the example vault
(Fantasy Statblocks format, worth staying compatible with), `Sergeant Pell.md` as the note without a
stat block, SRD 5.1 content only (CC-BY-4.0).

### Module 3 — Battle tracker

Not brainstormed yet. Starting point: `examples/vault/Silverstadt/Encounters/Ambush under the second
arch.md` (provisional format), party notes with `ac`, `hp`, `initiative`.

### Module 4 — Dice

Not brainstormed yet. Starting points: Rhizom's dice grammar and rollable-table rules (handoff §4),
`examples/vault/Silverstadt/Tables/Street Rumours.md`, `Decks/Omens of the River.md`, roll lines in
`Session 14 – Bell Square.md`.

### Not placed yet

The GM gate from the Rhizom handoff — `[!gm]` callouts with `revealed:`, `%%comments%%`, "which notes
the players have met", a player export. The maintainer has not prioritised it yet; the factions design
already keeps secrets apart (`secret_relations`, Public mode by default) so it can come later.
Self-hosted sync for players needs a separate vault and server instance — every sync token sees the
whole vault.

### Decisions so far (carry into `plugins/dnd5e-bylokianer/DECISIONS.md` in phase 1)

- Scope: factions, NPC builder, battle tracker, dice — all our own code (2026-10-24).
- Factions are folders holding `factions.md` (or a note named like the folder); members are the
  character notes in that folder; a faction folder inside another is a sub-faction.
- Relations −5 … +5, one-directional, red–yellow–green; `relations` = public face,
  `secret_relations` = true stance; characters inherit and may override; `power: 1–5`.
- English nomenclature for every file name and key; German only as UI translation.
- Name `dnd5e-byLokianer`, id `dnd5e-bylokianer`, licence MIT; Rhizom code relicensed to MIT by its
  sole author.
- Self-hosted sync (Self-Hosted Vault Sync server at `vault.home`) lives in the maintainer's
  HomeServer repository, never here.

### Before the first release

- Read Obsidian's current plugin guidelines and submission checklist.
- Check the name against Wizards of the Coast's trademark rules; ship SRD content only.
- Release mirror repository for the plugin (Obsidian reads `manifest.json` from a repo root).

---

## Repository

- [x] Repository rules (`CLAUDE.md`), private vault git-ignored with a `pre-push` guard (2026-10-24)
- [x] Example vault `examples/vault/` (2026-10-24)
- [x] pnpm workspace root (`package.json`, `pnpm-workspace.yaml`) — with phase 1
- [x] CI workflow — with phase 1
