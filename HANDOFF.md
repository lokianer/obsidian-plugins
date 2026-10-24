# Handoff

The note one session leaves for the next — local or in the cloud. **Rewrite it at the end of every
session** (not append) and commit it with that session's work. `ROADMAP.md` says *what* is done and
next; this file says *how it was left*: state of the working tree, what is half-finished, what to
watch out for. A cloud session cannot see the maintainer's private vault, so nothing here may depend
on it.

Read order for a new session: `ROADMAP.md` → this file → `CLAUDE.md` → the spec and plan named under
"Where to continue".

---

## Session

2026-10-24, cloud (second session of the day). The open question was answered, the deferred minor
review findings of phase 1 were fixed, and phase 2 (faction editor) was specified and planned.
**Nothing of the editor is built yet.**

## Where to continue

1. Ask the maintainer to review the editor spec
   (`docs/superpowers/specs/2026-10-24-faction-editor-design.md`, §7 lists the calls I made) and the
   plan (`docs/superpowers/plans/2026-10-24-factions-phase-2-editor.md`).
2. Once approved, build the plan task by task (superpowers:subagent-driven-development or
   executing-plans), one commit per task.

## State of the working tree

Branch `claude/roadmap-and-handoff-nb9sav`, pushed; not merged into `main` yet — the maintainer
decides whether to merge or open a pull request. `examples/vault/.obsidian/graph.json` may show as
modified after opening the vault in Obsidian: never commit it as part of a task.

## Done this session

- Maintainer's answers: **editor first** (new phase 2; world view → 3, faction view and tension → 4,
  in-view sliders and history → 5); the editor proposal of the last handoff **accepted as is**; all
  three groups of minor findings to be fixed first.
- Minor findings fixed (`4f55b5d`): plain decimal numbers only (`0x3`, `1e0` rejected), en dash as
  minus, halves round away from zero; new warning `broken-frontmatter` (a broken `factions.md` no
  longer says `missing-type`); `Factions.md` in any case; a `factions.md` with another `type` is
  not a faction; case-only clashes and a `name:` equal to another faction's folder now get
  `duplicate-name`, which carries the clashing name; singular counts in the modal; key matching
  order in `DECISIONS.md`. Example vault: new `The Drowned Choir/Brother Silt.md` (broken YAML on
  purpose); `Quests/The Missing Bellringer.md` was already broken (unclosed quote) and is now mapped
  in `Home.md` too.
- The Ctrl/Cmd-click finding was already fixed in `544759b`; nothing changed there.
- Git hooks were stored `100644`, so Git on Linux/macOS skipped them silently; now executable
  (`7866980`).
- Spec and plan for phase 2; factions design §6 renumbered; ROADMAP and `CLAUDE.md` status updated.

## Half-finished

Nothing in code. Not yet seen in Obsidian:

- the `broken-frontmatter` detection in the adapter (`src/obsidian/notes.ts`) relies on Obsidian's
  cache showing a block (`frontmatterPosition`, or a leading `yaml` section) while `frontmatter` is
  undefined. Verify: reload the plugin in `examples/vault`, run "Show faction warnings", expect
  Brother Silt and The Missing Bellringer under *Notes*. If they are missing, the hint is wrong and
  the adapter has to read every note without cached frontmatter instead;
- the singular counts and the reworded duplicate-name rows.

## Decisions taken this session

- Editor before the world view; proposal accepted (see the spec).
- Recorded in `plugins/dnd5e-bylokianer/DECISIONS.md`: key matching order and name clashes; strict
  numbers and rounding; `factions.md` in any case and with other types; `broken-frontmatter`. Left
  out: a decimal comma (`2,5`) stays "not a number".

## Open questions for the maintainer

- Review of the editor spec §7: Modal rather than side panel; raw entries shown incl. broken ones;
  secrets collapsed on every opening; save all-or-nothing and refused when the note changed
  underneath; lists and maps (tags too) read-only; step-name settings deferred to the world view;
  ASCII minus on write; no "Reset to inherited" (Remove is that).
- Merge `claude/roadmap-and-handoff-nb9sav` into `main`, or a pull request?

## Watch out

- TypeScript stays at 6.0.3 until typescript-eslint supports a newer version (TS 7 has no classic JS
  API).
- Chain verification and commit with `&&`, never `;`.
- `test/world.example.test.ts` treats the example vault as the contract: when it fails because a
  note is wrong, fix the note and `Home.md`, not the expectation.
- In a fresh clone run `git config core.hooksPath .githooks`; the cloud checkout did not have it set.
- The repository is not prettier-clean (tabs in `.ts` files against `.editorconfig`'s spaces) and CI
  does not check formatting; keep to each file's existing style and 100 columns.
- Shell heredocs mangle escapes like `﻿` (they arrive as the literal character, which eslint
  rejects); write such text with Write/Edit.
- The private vault is not available in the cloud; this session's daily report and changelog entry
  for it still have to be written there by a local session (goals, the fix slice, the spec).

## Verification

`pnpm lint && pnpm typecheck && pnpm test && pnpm build` at the root: all exit 0, 77 tests pass
(was 64).
