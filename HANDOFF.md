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

2026-10-24, local. Goal: build phase 1 of the factions module (data model + warnings command).

## Where to continue

Phase 1 waits for the maintainer's review. After approval: write the phase 2 plan (world view) from
`docs/superpowers/specs/2026-10-24-factions-design.md` with superpowers:writing-plans.

## State of the working tree

`main`, everything pushed. `examples/vault/.obsidian/graph.json` may show as modified: Obsidian
rewrites it when the vault is opened; it is not part of any task.

## Done this session

- Phase 1, tasks 1–7 of `docs/superpowers/plans/2026-10-24-factions-phase-1.md`: scaffold, campaign
  scope, relation values, discovery, key resolution, stances, command "Show faction warnings".
- Root `README.md` and `LICENSE` (MIT).

## Half-finished

Nothing in code. The manual check in Obsidian (plan task 7 step 7) is for the maintainer: open
`examples/vault`, run `pnpm --filter dnd5e-bylokianer install-example`, enable the plugin, run
"Show faction warnings". Expected: "5 factions, 14 characters, 6 warnings", all six in
`The Drowned Choir/factions.md`, each path opening its note.

## Decisions taken this session

All in `plugins/dnd5e-bylokianer/DECISIONS.md` and the spec. Interface strings live in
`src/i18n/strings.ts`; English is the source of the keys, German must match key for key (a test
enforces it).

## Open questions for the maintainer

- Review phase 1, including the manual check above.

## Watch out

- TypeScript stays at 6.0.3 until typescript-eslint supports a newer version (TS 7 has no classic JS
  API).
- Chain verification and commit with `&&`, never `;` — a lint failure once slipped into a commit.
- `test/world.example.test.ts` treats the example vault as the contract: when it fails because a
  note is wrong, fix the note and `Home.md`, not the expectation.

## Verification

`pnpm lint && pnpm typecheck && pnpm test && pnpm build` at the root: all exit 0, 56 tests pass.
