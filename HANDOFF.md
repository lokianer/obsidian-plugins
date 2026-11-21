# Handoff

The note one session leaves for the next — local or in the cloud. **Rewrite it at the end of every
session** (not append) and commit it with that session's work. `ROADMAP.md` says _what_ is done and
next; this file says _how it was left_: state of the working tree, what is half-finished, what to
watch out for. A cloud session cannot see the maintainer's private vault, so nothing here may depend
on it.

Read order for a new session: `ROADMAP.md` → this file → `CLAUDE.md` → the spec and plan named under
"Where to continue".

---

## Session

2026-11-21, local. After C1 and C1b (2026-11-20) the maintainer decided that choices whose count grows
with the level are stored per level as the increment, and C2 was built from the plan
`docs/superpowers/plans/2026-11-21-character-c2-create.md` (spec
`docs/superpowers/specs/2026-11-20-character-builder-design.md`): the engine's increments and option
lists, the draft, the **New character** dialog, the Spells tab and the example character Sable Thorn.
Built and committed on `main` (commits `9cb6969` to the docs commit); the final whole-branch review
and the push are the controller's.

## Where to continue

1. **Check C2 in Obsidian** (`pnpm --filter dnd5e-bylokianer install-example`, then the example
   vault): run **New character**. Expected: the form left, the preview right (above the form in a
   narrow pane); species, background, class, the four ability methods (standard array, point buy 27,
   rolled 4d6 drop lowest, typed 3-18); every first-level choice listed with all options; spells of
   the class from the SRD list; **Create** disabled until complete and guarded against a double
   click; the note lands in `Party` (setting "Folder for built characters") and opens. Open
   [[Sable Thorn]] (warlock 5): the sheet shows no warning, the Spells tab lists her spells by
   level, tools and languages by name (German too). Wren's languages and spells are increments now.
2. **Still waiting for the check from earlier:** C1 and C1b (the sheet, German texts), V4-V6 and the
   catalogues K1-K3. Release 0.2.0 only after the maintainer's go-ahead.
3. **Next phase:** C3 (spells: lists, known and prepared; the level-up dialog, swapping and
   re-choosing). It needs its plan first; read the spec's section 9.
4. **Deferred minors from C2** (none blocks): the Spells tab merges several casters' lists; a feat's
   level requirement in `levelOptions` uses the final character level (matters in C3); options
   inside a surviving slot are not pruned when species/background change; "Ability Scores - Ability
   scores" double slot head; the typed ability input shows NaN in the preview while empty; class
   equipment is found by matching the text; Magic Initiate's and other feats' text-only choices are
   still unmodelled.
5. **Deferred minors from C1** (none blocks): 2024 third casters should round down (latent); 2014
   single-class half casters need their own table (latent); the same origin feat twice shares one
   choice key; the sheet's feature texts add render components on every redraw until the tab
   closes; a renamed note leaves its sheet empty; tab pills need `tabindex` and keys; the first
   write-back turns flow maps into block style and drops YAML comments (processFrontMatter); a
   subclass of another class is reported as unknown rather than mismatched.
6. **Deferred minors from C1b:** the split-fragment check misses lower-case fragments and hyphenated
   units ("5-foot"); dragonborn option names mix "Schwarzer Drache" and "Messingdrache"; the forest
   gnome's option text comes from running text; the official German terms may differ from the
   plugin's own S2/M2 German (spells, monsters), which stays unchanged.

## State of the working tree

`main`, clean apart from local Obsidian state; everything pushed. The C2 work folder under
`.superpowers/sdd/` was deleted after the final review; the git history is the record.

**Private, outside the repository:** `D:\03 Projekte\Code\Loki\dnd5e-library\work\srd52\` (the SRD
PDFs and slices); the repository's JSON (`packages/rules/data/srd-5.2.1/`) is the source.

## Done this session

- `packages/rules`: growing choices stored per level and checked cumulatively; `tools.json` and
  `languages.json` (en/de); `RulesData.creation` with `origin-languages`; background ability points
  at most 2 per ability; cantrips and spells as per-level choices on every spellcasting feature,
  `maxSpellLevel`, `Spellcasting.known`; `levelOptions(character, rules, at)` returns the
  `ChoiceSlot[]` with every allowed option.
- Plugin: `src/character/draft.ts` (the draft, ability methods, `toCharacter` with orphan pruning,
  `draftProblems`, `characterNoteText`), `src/obsidian/character-builder.ts` with
  `styles/character-builder.css` (the dialog), the command `new-character`, the setting
  `characterFolder`; the sheet's Spells tab lists chosen spells by level, tools and languages named;
  the head, tiles and abilities are shared functions between sheet and preview.
- Example vault: `Silverstadt/Party/Sable Thorn.md` (warlock 5, tiefling, sage; invocations 1/2/-/-/2,
  built through `levelOptions`, no `missing`, no `unknown`), Home.md rows "New character" and "Level
  increments"; Wren's note moved to increments; counting tests updated for the sixth party member.

## Decisions taken this session

In `plugins/dnd5e-bylokianer/DECISIONS.md` ("Character builder C2"): increments in the engine; only
2024 in the dialog until C7; starting equipment as text, armour, shield and weapons from SRD tables
(packages and coins in C5); Create in the preview card, preview above the form when narrow; spells
from `SRD_SPELLS` filtered by class and level; swapping and re-choosing are C3.

## Open questions for the maintainer

- The C1, C1b and C2 check in Obsidian (German too); then C3.
- Data gaps kept as text for now: partial short-rest recharge (Rage, Channel Divinity, Wild Shape),
  either-or prerequisites (Grappler, the fighter's multiclass), Magic Initiate's and Skilled's
  choices, versatile damage.

## Verification

Every task had its own review; tasks 4 and 6 needed one fix round each. Final whole-branch review
(most capable model): no critical, two important findings, both fixed in `d617ae6`: invocation
prerequisites as data (`requires`) and filtered in `levelOptions`; a value kept in a surviving slot
that another source now grants is reported (`choice:<key>`, "choose again"). Also fixed: a failed
sheet opening after the note was written no longer allows a second note; README and DECISIONS
corrected. Scoped re-review clean. Deferred minors (C3): an option prerequisite taken in the same
level entry is not counted; spells are not de-duplicated at later levels; cantrip prerequisites of
invocations are text; a feat's level requirement uses the final level; the Spells tab merges several
casters. Screenshots of the dialog (dark 1100 px, light German 900 px, 380 px) from the scratchpad
harness. `pnpm check` after the fixes, exit 0: plugin 491, rules 86, session 15 tests.
