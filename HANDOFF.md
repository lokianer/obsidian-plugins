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

2026-11-20, local (third part). After V5 and V6 the maintainer started the character builder:
brainstorm, design `docs/superpowers/specs/2026-11-20-character-builder-design.md` (approved), plan
`docs/superpowers/plans/2026-11-20-character-c1-engine-sheet.md` (approved, executed natively).
**Phase C1 built and pushed**: the shared package `packages/rules`, the SRD 5.2.1 rules data, built
character notes and the character sheet.

## Where to continue

1. **Check C1 in Obsidian** (`pnpm --filter dnd5e-bylokianer install-example`, then the example vault): open
   [[Wren Ashdown]] → **Open character sheet** (command or the file menu). Expected: HP 31 / 39,
   AC 14, initiative +6, speed 30 ft., proficiency +3, passive Perception 14; the dagger rolls +6
   and 1d4+3; Bardic Inspiration 3 per short rest · d8; Skills with Persuasion and Deception +9;
   Levels with College of Lore at 3. Change `cha: 15` to `16` in the note: the computed keys
   (`skills:`, `saves:`) follow, and the sheet with them. Orrin Quill (hand-written) shows his own
   values. Check in dark and light, German, and a narrow pane (the abilities as six boxes).
2. **Still waiting for the check from earlier:** V4–V6 (style C for the lists, Dice tab, deck and
   builders) and the catalogues K1–K3. Release 0.2.0 only after the maintainer's go-ahead.
3. **Next phase:** C1b (German SRD texts, from the official German SRD) or C2 (create and level up
   in a dialog); the maintainer picks. Each needs its plan first.
4. **Before C2, decide** (from the final review): choices whose count grows with the class level
   (Eldritch Invocations, Metamagic, Weapon Mastery) are stored in full at the level that first
   grants them; the level-up dialog needs them per level (spread over the class's entries, or the
   increments per level). Weapon Mastery's data lists categories, not weapons.
5. **Deferred minors from the final review** (none blocks C1): 2024 third casters should round
   down (latent, no SRD third caster); 2014 single-class half casters need their own table (latent,
   no 2014 data); a feat taken at a class level follows that class's level, not the character's;
   the same origin feat twice shares one choice key; background increases are not validated
   (+3 to one score possible); the sheet's feature texts add render components on every redraw
   until the tab closes; the Spells tab shows the first caster's DC only; a renamed note leaves its
   sheet empty; tab pills need `tabindex` and keys; the first write-back turns flow maps into block
   style and drops YAML comments (processFrontMatter); a subclass of another class is reported as
   unknown rather than mismatched.

## State of the working tree

`main`, clean apart from local Obsidian state; everything pushed. The ledger of the C1 plan is in
`.superpowers/sdd/2026-11-20-character-c1-engine-sheet/` (git-ignored).

**Private, outside the repository:** `D:\03 Projekte\Code\Loki\dnd5e-library\work\srd52\` holds the
SRD 5.2.1 PDF, its `pdftotext` slices per class (`src/`) and the cleaning agents' JSON (`out/`),
which the assembly merged into `packages/rules/data/srd-5.2.1/`. From now on the repository's JSON
is the source; edit it there.

## Done this session

- `packages/rules`: `basics` (modifier, proficiency bonus), `model` (records, grants, choices),
  `data` (`loadRules`, lookups), `check` (`checkRules`), `collect` (which features a character
  has, where their choices live; multiclass levels take the multiclass proficiencies), `derive`
  (scores, saves, skills with expertise and half proficiency, passive scores, initiative, speed,
  senses, resistances, hit points), `combat` (armour class, attacks), `spellcasting` (DC, attack,
  slots single/multi/pact, resources with die, rest and minimum), `srd52` (`SRD_52`).
- SRD 5.2.1 data: 12 classes with their subclass, 9 species, 4 backgrounds, 17 feats, 13 armours,
  38 weapons, 18 skills; the class tables compared against the SRD for all 12 classes.
- Plugin: `src/character/note.ts` (`readCharacter`, `computedKeys`, `differs`, `sheetData`),
  `register/character.ts` (keys written back on change, the view, the command, the file menu),
  `character-sheet-view.ts` and `styles/character-sheet.css`.
- Example vault: `Silverstadt/Party/Wren Ashdown.md` (built bard 6), a row in `Home.md`; three
  counting tests updated for the fifth party member.

## Decisions taken this session

In `plugins/dnd5e-bylokianer/DECISIONS.md` ("Character builder C1") and the spec: approach 1 (rules
as data, pure engine), both rule sets with 2024 first, options 1b (show 2014 for a 2024 character,
C7) and 2a (German SRD texts, C1b); choices keyed `<feature>/<choice>` per level; computed keys
written only when they differ; spellcasting always its own feature; layout A.

## Open questions for the maintainer

- The C1 check in Obsidian, and C1b or C2 next.
- Data gaps kept as text for now: partial short-rest recharge (Rage, Channel Divinity, Wild
  Shape), either-or prerequisites (Grappler, the fighter's multiclass), Magic Initiate's and
  Skilled's choices, versatile damage, language lists and the musical instrument list.

## Verification

Final whole-branch review (most capable model): no critical, five important findings; four fixed
(write-back only with every rules id known and a readable level, heavy armour ignores Dexterity,
weapon training by property, multiclass skill choices), the fifth is item 4 above.
`pnpm check` exit 0: plugin 467/467, rules 39/39, session 15/15 tests, lint 0 errors (13 known
warnings), typecheck and build clean. Screenshots of the sheet (dark 1100 px, light German 900 px,
380 px, features, hand-written) from the scratchpad harness; mid-word label breaks, raw ability ids
and the German save names fixed from them.
