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

2026-10-24, local. Phase 1 of the factions module built, reviewed and **accepted by the
maintainer**; the warnings modal redesigned (direction A of two mockups). Next session: cloud.

## Where to continue

1. Ask the maintainer the one open question below (editor before or after the world view).
2. Then brainstorm the chosen next phase into a spec (superpowers:brainstorming), plan it
   (superpowers:writing-plans), and build only after the maintainer approves the plan.

## State of the working tree

`main`, everything pushed. `examples/vault/.obsidian/graph.json` may show as modified: Obsidian
rewrites it when the vault is opened; never commit it as part of a task.

## Done this session

- Phase 1, tasks 1–7 of `docs/superpowers/plans/2026-10-24-factions-phase-1.md`: scaffold, campaign
  scope, relation values, discovery, key resolution, stances (`c3135f1`), command "Show faction
  warnings" (`6281264`).
- Root `README.md` and `LICENSE` (MIT) (`ad46e8f`).
- Final whole-branch review by a fresh reviewer: three important findings fixed test-first
  (`e71718e`): duplicate keys, passed-over campaign notes, power messages, 16 px text.
- Warnings modal, direction A (`544759b`): counts (factions / characters / warnings), one card per
  note with link and badge, warnings grouped Skipped / Adjusted / Names / Notes with Lucide icons,
  key chip, "secret" tag, `written → read` for changed values; Ctrl/Cmd-click opens a new tab.
  Warnings now carry `written` and `read`; grouping is `src/factions/warning-groups.ts`.

## Half-finished

Nothing in code. The new modal has not been seen in Obsidian yet: the maintainer should reload the
plugin in `examples/vault` and run "Show faction warnings".

## Decisions taken this session

- Warnings modal direction A (grouped by note) over B (flat list with filter chips).
- **New wish, open:** the maintainer wants to **edit factions in the plugin — everything in the
  frontmatter, relations too**. The spec (§5.6, §6) has only relation sliders, in phase 4. My
  proposal, not yet confirmed:
  - a form on a faction or character note, opened by command: `name`, `power` (1–5), `relations`
    and `secret_relations` as rows (target with autocomplete from known factions and characters,
    −5 … +5 slider coloured green / yellow / red with the step name, optional `why`, remove,
    "+ add relation"), all other keys (tags, custom) as plain text under "Other fields";
  - a **Fix** button on each warnings card that opens the form on exactly the broken entry;
  - writes stay line edits through `vault.process` as spec §5.6 says (keeps YAML comments); a line
    it cannot place safely is refused with a notice, never guessed.

## Open questions for the maintainer

- **Should the faction editor come before the world view (new phase 2), or after it?** Asked at the
  end of the session, not answered yet. Also let the maintainer correct the proposal above.
- Minor review findings, deferred for your call (none fixed):
  - an en dash `–3` is not read as a minus (only U+2212 is);
  - `Number()` accepts `"0x3"` and `"1e0"`;
  - a character note with broken YAML vanishes without a warning;
  - `missing-type` is the message when `factions.md` has broken YAML;
  - `Factions.md` (capital F) is not recognised, silently;
  - an overview note `Factions/factions.md` would turn the container folder into a faction;
  - some name collisions (case-only; a `name:` equal to another folder name) get no `duplicate-name`;
  - `Math.round` rounds −2.5 to −2 but 2.5 to 3;
  - the key-matching order is documented only in `keys.ts`, not in `DECISIONS.md`;
  - the modal ignores Ctrl/Cmd-click (new tab);
  - the summary is always plural ("1 factions").

## Watch out

- TypeScript stays at 6.0.3 until typescript-eslint supports a newer version (TS 7 has no classic JS
  API).
- Chain verification and commit with `&&`, never `;` — a lint failure once slipped into a commit.
- `test/world.example.test.ts` treats the example vault as the contract: when it fails because a
  note is wrong, fix the note and `Home.md`, not the expectation.
- The private vault is not available in the cloud; everything needed is in this repository.

## Verification

`pnpm lint && pnpm typecheck && pnpm test && pnpm build` at the root: all exit 0, 64 tests pass.
