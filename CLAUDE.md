# CLAUDE.md — obsidian-plugins

Collection repository for the Obsidian plugins the maintainer builds with Claude. This file applies to the
whole repository; a plugin may add its own `CLAUDE.md` in its folder for plugin-specific rules.

**Start every session with `ROADMAP.md`, then `HANDOFF.md`**: the roadmap says what is done and where
to continue, the handoff how the last session left things. At the end of every session update the
roadmap and rewrite the handoff, following its structure. A cloud session has no access to the private vault below, so anything a later
session needs must be in the repository (roadmap, specs, plans, `DECISIONS.md`).

## The vault is never pushed

`Obsidian Plugins Vault/` is the maintainer's private working vault: `Changelog.md`, `Decisions.md` and
`Design Ideas.md` across all plugins, plus notes on the home server. It is **never committed and never
pushed**.

- It is listed in `.gitignore`. Never `git add -f` anything inside it, never remove that line.
- The `pre-push` hook in `.githooks/` refuses any push whose commits touch the vault. Never bypass it
  (`--no-verify`), never change `core.hooksPath` away from `.githooks`.
- If something from the vault belongs in the repository (a decision that becomes part of a plugin's
  `DECISIONS.md`, say), copy the text into the repository file; never link the vault from tracked files.
- No secrets in the vault either (tokens, passwords): those stay in the `.env` files on the server.

Keep the vault current while working:

- `Daily/YYYY-MM-DD.md` — **one report per session**, written during and finished at the end of it: goals,
  what happened, what was verified (with results), findings, what is open. Other notes link a day as
  `[[YYYY-MM-DD]]`. A second session on the same day extends that day's note under its own heading.
- `Changelog.md` — **only the essence** per day (added / changed / known limitations / open), each day
  linking its daily report. Details belong in the daily report, not here.
- `Decisions.md` — numbered `D<n>`, status _made_ / _proposed_ / _open_, with the reason and what was
  left out.
- `Design Ideas.md` — **everything about design**: UI, look and feel, interaction, architecture ideas
  that are not decided yet. A design idea that gets decided moves into `Decisions.md`.

## The example vault is pushed

`examples/vault/` is the shared test vault for every plugin in this repository and **is** committed and
pushed. Its `Home.md` maps each feature to the notes that exercise it; when a plugin gains a feature or
an edge case, add a note for it there and a row to that table. Only `.obsidian/workspace*.json`,
`.obsidian/plugins/` and `.trash/` stay local. Never put real campaign material or secrets in it.

## What does not belong here

- **Self-hosting / server stacks.** The vault sync server (`vault.home`, Self-Hosted Vault Sync) lives in
  the HomeServer repository (`D:\03 Projekte\Code\Loki\HomeServer\vault-sync\`) and on LokiServer in
  `/opt/docker/vault-sync/`. Compose files, Caddy entries and server docs go there, never here.
- Downloads, extracted archives, research output: put them in the scratchpad, and check `git status`
  after research runs.

## Layout (D19; `packages/session` is the first shared package)

```
plugins/<plugin-id>/     one Obsidian plugin each (manifest.json, src/, tests, its own docs)
packages/<name>/         shared pure TypeScript (no Obsidian API, no DOM), unit-tested in Node
examples/vault/          shared test vault, pushed
site/                    project page (GitHub Pages, deployed from main by .github/workflows/pages.yml)
Obsidian Plugins Vault/  private, git-ignored
```

pnpm workspaces. Obsidian's directory reads `manifest.json` from the root of a plugin's own GitHub repo,
so a published plugin gets a release mirror repository, pushed by CI from its subfolder.

## Working with the maintainer

- **Language.** Chat in German. Everything in the repository — code, comments, commit messages, docs —
  in English. Plugin UIs are internationalised from the start: English default, German second. Vault
  notes are English as well. **Nomenclature is English**: every file name, frontmatter key and
  convention a plugin reads (`factions.md`, `relations:`, `type: npc`) is English; German exists only
  as a UI translation.
- **Authorship.** The maintainer is the sole author. Never add `Co-Authored-By` trailers, "Generated
  with …" lines, bot signatures or emoji markers to commits, pull requests, changelogs or any file. A
  `commit-msg` hook enforces this; never bypass it.
- **Commits.** Conventional Commits with a scope (`feat(gate): …`). Few, larger commits: one per
  finished slice, never one without green tests and clean lint. The body says what changed, then why,
  then what was deliberately left out. Commit or push only when the maintainer asks. A history rewrite
  needs the maintainer's explicit choice.
- **Clean up before every commit.** Re-read the slice's code: remove dead code (unused exports,
  functions, parameters, fields, imports), merge duplicated logic, and simplify where it reads
  better — then `pnpm check`. Exports used only by tests stay only when they are the module's
  tested contract.
- **Phases.** Work in phases, each with a short spec, a plan and a review stop. Never pull a feature
  forward from a later phase.
- **Dependencies.** Larger new dependencies only with a short justification first.
- **Docs per plugin.** `README.md`, `DECISIONS.md`, `CHANGELOG.md` (Keep a Changelog) in the plugin's
  folder. Roadmap and handoff are repository-wide: the root `ROADMAP.md` and `HANDOFF.md`, updated at
  the end of every session and committed with that session's work.
- **Agents.** Keep the fleet small.

## Principles for every plugin

- **Files first, local and private.** Markdown files are the truth; anything derived can be rebuilt.
  No telemetry, no accounts, no network calls — a network feature needs an explicit decision, is off
  by default and runs only on an explicit command.
- **Readable without the plugin.** Every convention is plain Markdown another editor shows sensibly.
- **Do not duplicate mature plugins** (Dice Roller, Fantasy Statblocks, Calendarium, Dataview/Bases,
  Templater). Check their current state and integrate.
- **Mobile.** `isDesktopOnly: false` unless a feature truly needs Node. No `fs`, `child_process` or
  Node `path`; use `normalizePath` and the vault API.
- **Writes.** `app.vault.process` for every edit, `app.fileManager.processFrontMatter` for frontmatter,
  `fileManager.generateMarkdownLink` for links. Edit lines, never re-serialise a note.
- **DOM.** Never `innerHTML` with note content; build with `createEl` / `createDiv`.
- **Events.** Register every listener with `this.registerEvent`; cache derived state per file and
  invalidate on `metadataCache` changes, never rescan the vault per keystroke.
- **Design.** Dark theme first. Secondary text at least 16 px, no small italic text. Only Obsidian CSS
  variables, so every theme works.
- **Hotkeys.** No default hotkeys (Obsidian guidelines); document suggestions in the README.
- **Tests.** Vitest for pure modules; the Obsidian API sits behind thin adapters. Lint (eslint, plus
  `eslint-plugin-obsidianmd` if current), strict typecheck, tests and build in CI on Linux, macOS and
  Windows.
- **Formatting.** Prettier is enforced (`.prettierrc.json`, `.editorconfig`, `.prettierignore`):
  `pnpm format` before committing; the `pre-commit` hook and CI (`pnpm format:check`) refuse
  unformatted files. The example vault and the private vault are excluded — their exact text is the
  contract.

## Environment traps

- The maintainer works on Windows (Node 24.x via nvm-windows, pnpm).
- Heredocs in the Bash tool mangle backslashes (`\n`, `C:\notes`): write such text with Write/Edit.
- `netstat` answers in German (`ABHÖREN`); never grep for `LISTENING`.

## Plugins

| Plugin                                | Folder                      | Status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dnd5e-byLokianer (`dnd5e-bylokianer`) | `plugins/dnd5e-bylokianer/` | Factions module (phases 1–5: data model and warnings, faction card, faction world, faction view and tensions, popover editing and session history with loot carry-over; shared `packages/session`) accepted in Obsidian on 2026-10-25. Module 2, NPC builder (`docs/superpowers/specs/2026-10-25-npc-builder-design.md`): phase 1 (stat block view) accepted, phases 2 (builder), 3 (editing in the stat block, New archetype), 4a (races, German and larger dice tables) and 4b (preview, Roll everything with locks, tiles) built, awaiting the check in Obsidian. Module 3, spellbook (`docs/superpowers/specs/2026-10-25-spellbook-design.md`), comes after module 2. Design: `docs/superpowers/specs/2026-10-24-factions-design.md`. Licence MIT |
