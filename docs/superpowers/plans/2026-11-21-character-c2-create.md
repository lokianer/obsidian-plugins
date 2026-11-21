# Character Builder C2 — Create Character — Implementation Plan

**Status:** built 2026-11-21, awaiting the maintainer's check in Obsidian.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A **New character** dialog builds a complete level-1 character from the SRD 5.2.1 data:
rule set, species, background, class, ability scores, every choice with all its options,
armour and weapons, spells. It writes a built character note that the sheet opens at once.

**Architecture:**

- **Engine (`packages/rules`):** the engine learns three things:
  - growing choices stored per level as the increment (DECISIONS 2026-11-21);
  - tools, languages and spells as choosable values;
  - `levelOptions`, which lists every choice open at a level with all its allowed options.
- **Plugin (`plugins/dnd5e-bylokianer`):**
  - a pure draft model turns the dialog's state into a `Character` and the note text;
  - the dialog is built like the spell and monster builders: a form on the left, the sheet preview on the right.

**Tech Stack:** TypeScript, Vitest, Obsidian API (Modal, Setting), the shared UI blocks
(`src/obsidian/ui/blocks.ts`).

**Spec:** `docs/superpowers/specs/2026-11-20-character-builder-design.md`. The relevant sections:

- §3 goal 1;
- §6, the note;
- §7, `levelOptions`;
- §8, "Create character";
- §9, phase C2.

It is read together with `plugins/dnd5e-bylokianer/DECISIONS.md`, at "2026-11-21 · Character builder: choices that grow with the level".

## Global Constraints

- The repository rules from CLAUDE.md apply:
  - `processFrontMatter` or `vault.create` for writes; never `innerHTML` with note content;
  - every listener registered;
  - Obsidian CSS variables only; secondary text at least 16 px;
  - no default hotkeys; mobile-safe, so no Node APIs.
- English nomenclature: ids, keys and note values are English. German exists only as `de` and in the UI (en/de i18n keys for every new string).
- Data:
  - SRD 5.2.1 only, and no book text anywhere (repo, example vault, fixtures, commits, logs);
  - new rules data carries `name.en` and `name.de`;
  - the German comes from the official German SRD 5.2.1 in the private `D:\03 Projekte\Code\Loki\dnd5e-library\work\srd52\` (`DE_SRD_CC_v5.2.1.pdf`, `srd-de-raw.txt`).
- The note's shape stays C1's (Wren Ashdown): `rules`, `species`, `background`, `abilities`, `choices`, `levels[{class, hp, choices}]`, `inventory`, plus the computed keys of `computedKeys`. C2 adds only `player` (already read by Wren's note) and `name` comes from the file name.
- Rule set: only 2024 data exists. The dialog offers 2024 alone until C7, and the note still writes `rules: '2024'`.
- Out of scope:
  - level-up and re-choosing a level (C3);
  - play state (C4);
  - coins, magic items, starting-equipment packages as data, and manual bonuses (C5);
  - "convert a hand-written note".

## Review Focus

1. **Orphan choices after a change of mind.** A player picks the elf's lineage, then switches to the human. Expected: the note holds no `elf-*` choice. The draft keeps only the keys of the current slots (Task 5 test).
2. **Growing choices in a note written the old way**, all at the first level, such as a warlock 5 with its 5 invocations under level 1. Expected: no false "missing". The check is cumulative: at class level k, the values held by entries up to k reach `count(k)` (Task 1 test).
3. **Illegal ability scores**, all of which must be refused with the Create button disabled (Tasks 4 and 5 tests):
   - point buy over 27 points or outside 8–15;
   - a standard-array value used twice;
   - a background putting 3 points into one ability.
4. **The same value twice.** Examples: a skill the background already gives, offered again by the class; an invocation picked at level 1 offered again at level 5. Expected: values the character already has, or that another open slot holds, are not offered (Task 4 test).
5. **German Obsidian.** Expected: every option, step head and button of the dialog is German, with option names via `local()`; the preview's numbers equal the sheet's after creation (Task 6 test).

---

### Task 1: Growing choices stored as increments

**Files:**

- Modify: `packages/rules/src/collect.ts`, `packages/rules/src/derive.ts`
- Test: `packages/rules/test/derive.test.ts`

**Interfaces:**

- Produces: for a choice whose `count` is `{ byLevel }` on a class or subclass feature:
  - its values are the **union** of `entry.choices[key]` over the level entries at which that class reached the feature's level or higher;
  - an option or feat chosen in any of those entries is placed, with its own choices read from that same entry;
  - `missing` names the first class level k (as `level <character level>: <key>`) where the union of the entries up to k holds fewer than `count(k)` values.

  Choices with a fixed count behave as in C1.

- [ ] **Step 1:** Add the tests (a warlock built with `levels` of 5 × `warlock`):
  - `reads growing choices spread over the levels`: invocations `[1 at level 1, 2 at level 2, 2 at level 5]` give 5 placed options and no `missing`.
  - `reports a short increment at its level`: only 1 at level 1 and 2 at level 2 gives `missing` containing `level 5: warlock-eldritch-invocations/invocations`.
  - `accepts all growing choices at the first level`: all 5 at level 1 gives no `missing` (Review Focus 2).
  - `reads weapon mastery spread over levels`: a fighter 4 with 3 masteries at level 1 and 1 at level 4 lists 4 `masteries`.
  - Wren's existing tests stay unchanged.

  Run `pnpm --filter @obsidian-plugins/rules test`. Expected: the new tests fail.

- [ ] **Step 2:** Implement in `collect` and `derive`. Both share one helper, `growingValues(...)`, that finds a feature's entries; derive does not re-scan the levels itself. Run the tests. Expected: all pass.
- [ ] **Step 3:** Commit `feat(rules): growing choices stored per level as the increment`.

### Task 2: Tools, languages and the creation languages

**Files:**

- Create: `packages/rules/data/srd-5.2.1/tools.json`, `languages.json`
- Modify:
  - `packages/rules/src/model.ts`, `data.ts`, `collect.ts`, `check.ts`, `srd52.ts`
  - `packages/rules/data/srd-5.2.1/backgrounds.json` (each `abilities` choice gets `"each": 2`)
  - `plugins/dnd5e-bylokianer/src/obsidian/character-sheet-view.ts`, where `nameOf` names tools and languages
- Test:
  - `packages/rules/test/srd52.test.ts`, `check.test.ts`, `derive.test.ts`
  - `plugins/dnd5e-bylokianer/test/ui/views.test.ts`

**Interfaces:**

- Produces:
  - `ToolDef { id; name: Text; category: 'artisans-tools' | 'musical-instrument' | 'gaming-set' | 'other' }` and `LanguageDef { id; name: Text; rare: boolean }`;
  - `RulesData.tools`, `RulesData.languages`, and `RulesData.creation: Feature[]`;
  - `Rules.tool(id)` and `Rules.language(id)`;
  - in `OptionSource`, `{ abilities; max?; each?: number }`, where `each` is the most points one ability may take.
- Creation feature `origin-languages`:
  - it grants the proficiency language `common`;
  - its choice `languages` has count 2, gives `language`, and comes from `{ list: [] }`, where an empty list means any standard language.
  - It is stored in `character.choices` as `origin-languages/languages` and placed by `collect` like a background feature.
- A `list` id that names a tool category stands for every tool of that category. This covers `musical-instrument` and `artisans-tools`. The expansion itself is in Task 4.

- [ ] **Step 1:** Tests:
  - known pairs read off the German SRD: `thieves-tools` → `Diebeswerkzeug`, `lute` → `Laute`, `common` → `Gemeinsprache`, `dwarvish` → `Zwergisch`, and two more per file;
  - every id in a `proficiency` grant of kind tool or language is known to the rules, and so is every non-category `list` id;
  - `checkRules` reports a duplicate tool id;
  - Wren's sheet with `lang: 'de'` shows `Laute` instead of `lute` on the Levels tab.

  Run them. Expected: they fail.

- [ ] **Step 2:** Write the two data files from the SRD 5.2.1 tool and language tables (English SRD, and the German names from the German SRD; work only in the private work folder). Add `each: 2` to the background ability choices. Then implement the model, the loader, `collect` (creation features), `check` and `nameOf`. Run the tests. Expected: pass.
- [ ] **Step 3:** Commit `feat(rules): tools, languages and the languages of a new character`.

### Task 3: Spells as choices

**Files:**

- Modify:
  - `packages/rules/src/model.ts`, `spellcasting.ts`, `derive.ts`, `character.ts`
  - `packages/rules/data/srd-5.2.1/classes.json`, adding a choice on every `spellcasting` feature
  - `plugins/dnd5e-bylokianer/src/obsidian/character-sheet-view.ts` (Spells tab) and `register/character.ts`
- Test:
  - `packages/rules/test/spellcasting.test.ts`
  - `plugins/dnd5e-bylokianer/test/ui/views.test.ts`

**Interfaces:**

- Produces:
  - `OptionSource` `{ spells: string; level: 'cantrip' | 'leveled' }`, which replaces `{ spells; level: number | 'cantrip' }`. No data uses the old form.
  - On every class `spellcasting` feature, the choices `cantrips` (when the class has cantrips; count = the grant's `cantrips`) and `spells` (count = the grant's `prepared`), both with `gives: 'spell'`, `from` the class list. Both are growing choices, as in Task 1.
  - `maxSpellLevel(progression, classLevel): number`, the highest spell level a single-class character of that class has a slot for. It is 0 for none, and is exported.
  - `Spellcasting.known: string[]`, the chosen cantrip and spell ids of that class, in order.
- The sheet's deps gain `spell(id): { name: Text; level: number } | undefined`, which the plugin fills from `SRD_SPELLS`. The Spells tab lists `known` grouped by level (Cantrips, Level 1 …), each with its name.

- [ ] **Step 1:** Tests:
  - `maxSpellLevel('full', 1) === 1`, `('full', 5) === 3`, `('half', 1) === 1`, `('half', 5) === 2`, `('pact', 5) === 3`;
  - a wizard 1 with 3 cantrips and 4 spells has no `missing` and `known` of length 7;
  - with 2 spells, `missing` holds `level 1: wizard-spellcasting/spells`;
  - Wren (bard 6, no spells chosen) now reports her spells as missing. Update the note-level expectations that assert no `missing` for Wren, and give Wren's example note her SRD bard cantrips and spells as increments (cantrips 2 at level 1 and 1 at level 4; spells 4, 1, 1, 1, 2, 1 at levels 1–6), so the example stays complete;
  - the sheet test: Wren's Spells tab lists `Vicious Mockery` under Cantrips.

  Run them. Expected: they fail.

- [ ] **Step 2:** Implement. Run the rules and plugin tests. Expected: pass. `examples/vault` Wren is still up to date, which the `finds Wren Ashdown … already up to date` test checks.
- [ ] **Step 3:** Commit `feat(rules): cantrips and spells chosen per level`.

### Task 4: `levelOptions`

**Files:**

- Create: `packages/rules/src/options.ts` (exported from `index.ts`)
- Test: `packages/rules/test/options.test.ts`

**Interfaces:**

- Consumes: Tasks 1–3.
- Produces:

```ts
export interface ChoiceSlot {
  /** `<feature id>/<choice id>`, the key in `choices`. */
  key: string;
  /** The character level of the entry it is stored in; null for creation (`character.choices`). */
  at: number | null;
  feature: { id: string; name: Text };
  choice: Choice;
  /** How many this level adds: count(k) − count(k−1) for growing choices. */
  wanted: number;
  /** What the entry holds for it now. */
  chosen: string[];
  /** Every allowed value with its name; empty for spells (the plugin lists them). */
  options: { id: string; name: Text }[];
  /** For spell choices: the class list and the highest level, 0 for cantrips. */
  spells?: { list: string; maxLevel: number };
  /** For ability points: the most points one ability may take. */
  each?: number;
}
export function levelOptions(character: Character, rules: Rules, at: number | null): ChoiceSlot[];
```

- Options per source:

| Source       | Options                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `skills`     | `any`: all skills; `proficient`: the skills the character is proficient in (expertise); or the listed ids                                                           |
| `abilities`  | the listed abilities                                                                                                                                                |
| `feats`      | the category's feats whose `requires` the character meets, minus non-repeatable feats it has                                                                        |
| `subclasses` | the class's subclasses                                                                                                                                              |
| `list`       | tools with categories expanded; `[]` for a language choice means every standard language; for `mastery`, every weapon of the listed categories that has a `mastery` |
| `options`    | the feature's options                                                                                                                                               |

Every source then drops the values the character already has from elsewhere, and the values another slot of the same call holds (Review Focus 4).

- [ ] **Step 1:** Tests (`levelOptions` with `at` = null and 1, for a draft human fighter with the soldier background):
  - the slots include `soldier-ability-scores/abilities` (each 2), `origin-languages/languages` (wanted 2), `human-skillful/skill`, `human-versatile/feat` (origin feats only), `fighter-core/skills`, `fighter-fighting-style/…` and `fighter-weapon-mastery/mastery` (wanted 3, options include `longsword`, but not `athletics`, which soldier already gives);
  - a wizard 1 gives `spells: { list: 'wizard', maxLevel: 0 }` for cantrips and `maxLevel: 1` for spells;
  - a warlock at level 5 gives `wanted 2` for invocations, without the ones already chosen.

  Run them. Expected: they fail.

- [ ] **Step 2:** Implement. Run the tests. Expected: they pass. Commit `feat(rules): every open choice of a level with its options`.

### Task 5: The draft and the note

**Files:**

- Create: `plugins/dnd5e-bylokianer/src/character/draft.ts`
- Test: `plugins/dnd5e-bylokianer/test/character-draft.test.ts`

**Interfaces:**

- Consumes: `levelOptions`, `computedKeys` (`src/character/note.ts`), `isPlainSafe` (`src/yaml/scalar.ts`) for quoting, the way `spellNoteText` (`src/spells/draft.ts`) writes its lines.
- Produces:

```ts
export type AbilityMethod = 'standard' | 'point-buy' | 'rolled' | 'typed';
export interface CharacterDraft {
  name: string;
  player: string;
  species: string;
  background: string;
  class: string;
  method: AbilityMethod;
  abilities: Record<Ability, number>;
  rolled: number[];
  /** By slot key; creation slots and the first level's slots together. */
  choices: Record<string, string[]>;
  armor: string | null;
  shield: boolean;
  weapons: string[];
}
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
export const POINT_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};
export function emptyDraft(): CharacterDraft;
export function rollAbilities(roll: () => number): number[]; // 6 × 4d6 drop the lowest; roll() gives 1–6
export function toCharacter(draft: CharacterDraft, rules: Rules): Character; // prunes keys of no current slot
export function draftProblems(draft: CharacterDraft, rules: Rules): string[]; // i18n keys with params, see below
export function characterNoteText(draft: CharacterDraft, rules: Rules): string;
```

- `toCharacter` sets:
  - `rules: '2024'`;
  - the creation slots into `choices`;
  - a single `levels` entry `{ class, hp: 'max', choices }`;
  - the inventory: armour, shield and weapons, all `equipped: true`.

  A choice key that belongs to no slot of the current species, background or class is dropped (Review Focus 1).

- `draftProblems` returns stable codes:
  - `name`, `species`, `background` and `class` when empty;
  - `abilities` when the scores break the method:
    - standard: each array value used exactly once;
    - point buy: 8–15 and at most 27 points;
    - rolled: the six rolled values used once each;
    - typed: 3–18;
  - `choice:<key>` per slot whose `chosen` is shorter than `wanted`, or that puts more than `each` points into one ability (Review Focus 3).
- `characterNoteText` writes the frontmatter in the order of Wren's note: the choices, then `computedKeys`, then `tags: [pc]`. The body is `# <name>` and one line saying it was built with the character builder.

- [ ] **Step 1:** Tests:
  - a draft human fighter (soldier, standard array) gives a `Character` whose `derive` has no `missing`;
  - switching `species` from elf to human drops `elf-*` keys;
  - `draftProblems` has no `abilities` for the point buy `{15, 15, 15, 8, 8, 8}` (27 points) and reports it for `{15, 15, 15, 15, 8, 8}` (36 points) and for a 16;
  - background points `[dex, dex, dex]` give `choice:soldier-ability-scores/abilities`;
  - `rollAbilities` with a fixed sequence gives the expected six sums;
  - `characterNoteText` parsed back with `readCharacter` gives the same `Character`, and `differs(fm, computedKeys(...))` is false.

  Run them. Expected: they fail.

- [ ] **Step 2:** Implement. Run the tests. Expected: they pass. Commit `feat(dnd5e): the draft of a new character and its note`.

### Task 6: The New character dialog

**Files:**

- Create:
  - `plugins/dnd5e-bylokianer/src/obsidian/character-builder.ts`
  - `plugins/dnd5e-bylokianer/styles/character-builder.css`, imported where the other styles are
- Modify:
  - `src/obsidian/register/character.ts` (command `new-character`, writing, then opening the sheet);
  - `src/obsidian/settings.ts` (`characterFolder: 'Party'`, a text setting like `spellFolder`);
  - `src/obsidian/character-sheet-view.ts`: the head, tiles and ability column are extracted into functions that the sheet and the preview share;
  - `src/i18n/strings.ts` (`characterBuilder.*`, `command.newCharacter`, en and de)
- Test: `plugins/dnd5e-bylokianer/test/ui/views.test.ts` (describe "character builder")

**Interfaces:**

- Consumes: Task 5, `levelOptions`, `SRD_SPELLS` (spell options: the class in `classes`, the level up to `maxLevel`, cantrips for 0).
- Produces: `CharacterBuilderModal(app, { t, lang, rules, spells, roll, create: (draft) => Promise<void> })`.

The layout follows the spell builder (`dnd5e-npc-modal dnd5e-npc-dialog`):

- **The form on the left, its sections in this order:**
  1. Name and player (Obsidian settings).
  2. Species, then background, then class: tiles with name and a short line (size and speed, the ability list, the hit die and primary abilities).
  3. Ability scores: method pills; the six abilities with a select (standard or rolled), a − / + (point buy, with the points left) or a number (typed); a Roll button for rolled.
  4. One block per creation and level-1 `ChoiceSlot`: the feature's name as head, `chosen / wanted`, options as pills, toggled on click and refused beyond `wanted`. Ability points are − / + per ability. Spells are pills with a search box.
  5. Equipment: the class's and background's equipment text (rendered Markdown), armour as tiles, Shield as a pill, weapons as pills.
- **The preview on the right:** the shared sheet head, the tiles (AC, HP, initiative, speed, proficiency) and the ability column for `derive(toCharacter(draft))`. Below them, the `draftProblems` as plain names: "Choose 2 more: Fighting Style".
- **Create:** disabled while `draftProblems` is not empty. It calls `create`, which writes `characterNoteText` with `newNote(app, cache, settings.characterFolder, draft.name, text)` and opens the sheet of the new note.

- [ ] **Step 1:** Tests, all in `lang: 'de'`:
  - picking Mensch, Soldat and Kämpfer, then the standard array, every choice and a Langschwert, enables "Charakter erstellen"; `create` receives a draft whose `toCharacter` derives AC and HP equal to the preview's tiles;
  - the step heads and option names are German, for example `Zwergisch` and `Diebeswerkzeug`;
  - a pill beyond `wanted` is refused;
  - changing the class clears the old class's choice blocks.

  Run them. Expected: they fail.

- [ ] **Step 2:** Implement. Run `pnpm check`. Expected: exit 0.
- [ ] **Step 3:** Screenshots from the scratchpad harness (dark 1100 px, light German 900 px, 380 px). Check that tiles and pills do not overflow and that the preview sits under the form when narrow.
- [ ] **Step 4:** Commit `feat(dnd5e): the New character dialog`.

### Task 7: Example vault, docs and the check

- [ ] The example vault gets `Silverstadt/Party/Sable Thorn.md`: a built warlock 5 (tiefling, sage), with invocations stored as increments (1 / 2 / – / – / 2) and spells per level. Add a row in `Home.md` for "New character" and the increments. Update the counting tests for the sixth party member.
- [ ] Update the docs:
  - plugin `README.md` (New character, the folder setting);
  - `CHANGELOG`;
  - `DECISIONS.md` ("Character builder C2": the rulings of this phase, the equipment kept as text, 2024 only);
  - `ROADMAP` (C2 built), `HANDOFF` (rewritten), the CLAUDE.md plugin table;
  - the vault Daily and Changelog.
- [ ] `pnpm format`, `pnpm check`; commit `docs(dnd5e): character builder C2`; push; `pnpm --filter dnd5e-bylokianer install-example`.
- [ ] Final whole-branch review on the most capable model, with the Review Focus above; one fix pass.
