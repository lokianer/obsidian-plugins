# Character builder C1 — engine, SRD 5.2.1 data, character note, sheet — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** A built character note (choices in frontmatter) opens as a computed character sheet in
layout A, from the SRD 5.2.1 classes, species, backgrounds, feats, armour and weapons.

**Architecture:** A new pure package `packages/rules` holds the data model, the SRD 5.2.1 data as
JSON and `derive(character)` → `Sheet`, every number with its sources. The plugin reads the note
into a `Character`, keeps the computed keys the other modules read in sync, and shows the sheet as
an `ItemView`. Rolls reuse the stat block's `checkButton` and `RollCheck`.

**Tech Stack:** TypeScript (strict), Vitest, pnpm workspaces, Obsidian API, esbuild.

**Spec:** `docs/superpowers/specs/2026-11-20-character-builder-design.md` (§3 goals 3, 6, 7; §5;
§6; §7; §8 "the sheet"; §9 C1).

## Global Constraints

- `packages/rules`: no Obsidian API, no DOM, no Node `fs`/`path` in `src/` (scripts may use Node).
- Rule set keys `'2014' | '2024'`; ability keys `str dex con int wis cha`; ids lower-case English
  kebab case (`college-of-lore`, `sleight-of-hand`), class ids `bard`, subclass ids
  `<class>/<subclass>` (`bard/college-of-lore`).
- Every frontmatter write through `app.fileManager.processFrontMatter`; the note body is never
  touched. English keys and values; German only in the UI.
- SRD content: SRD 5.2.1, CC-BY-4.0, attribution line on the sheet's Features tab and in the README
  (as the spells and monsters). No text from any other book.
- UI: style C blocks from `src/obsidian/ui/blocks.ts`; Obsidian CSS variables only; text at least
  16 px; no `innerHTML`; listeners via `registerEvent`/`registerDomEvent`; `isDesktopOnly` stays
  false; no default hotkeys. EN and DE strings for every label.
- A note without `levels` (hand-written, as today) must keep working everywhere unchanged.

## Rulings made while planning

- **Rolls on the sheet in C1.** Checks, saves, attacks and damage are dice buttons now: rolling
  writes nothing to the note, and the sheet is useless at the table without them. HP controls,
  slots and rests stay C4 (shown, not editable).
- **The computed keys are synced automatically** for built notes (with `levels`): on opening the
  sheet and whenever the note's frontmatter changes, if `derive` differs from the stored computed
  keys, they are rewritten. Hand-written notes are never written to.
- **No `levelOptions`/`validate` UI in C1** (C2/C3). `derive` reports unresolved choices
  (`sheet.missing`) so a hand-edited `levels` with gaps shows "not chosen yet" rather than wrong
  numbers.
- **Data as JSON** in `packages/rules/data/srd-5.2.1/`, imported by the package (esbuild bundles
  JSON); lazy loading stays the roadmap's performance item.

## Review Focus

1. A built note whose `levels` names an unknown class, subclass, feat or item id: the sheet shows
   the rest and lists the unknown id, never throws (test in Task 3).
2. A note edited by hand while the sheet is open (scores changed): the sheet re-renders and the
   computed keys follow once, without a write loop (test in Task 8).
3. Ability scores above 20 from increases are capped at 20 (or the grant's own maximum), ASIs
   included (test in Task 3).
4. Multiclass spell slots: 2024 rounds half-caster levels **up**; pact slots stay separate (test in
   Task 5).
5. A narrow pane (below 480 px) and a phone: the ability column becomes six boxes above the tabs;
   long feature texts wrap (screenshots in Task 9).

---

### Task 1: `packages/rules` scaffold and basic arithmetic

**Files:**

- Create: `packages/rules/{package.json,tsconfig.json,tsconfig.test.json,vitest.config.ts,eslint.config.mts,README.md}` (copied from `packages/session`, name `@obsidian-plugins/rules`, `resolveJsonModule: true`)
- Create: `packages/rules/src/index.ts`, `packages/rules/src/basics.ts`
- Test: `packages/rules/test/basics.test.ts`
- Modify: `plugins/dnd5e-bylokianer/package.json` (dependency `"@obsidian-plugins/rules": "workspace:*"`)

**Interfaces — Produces:**

- `type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'`, `ABILITIES: readonly Ability[]`
- `type RuleSet = '2014' | '2024'`
- `modifier(score: number): number`, `proficiencyBonus(level: number): number`

- [ ] **Step 1: Failing tests** — `modifier(1) === -5`, `modifier(10) === 0`, `modifier(17) === 3`,
      `modifier(30) === 10`; `proficiencyBonus(1) === 2`, `(4) === 2`, `(5) === 3`, `(17) === 6`,
      `(20) === 6`.
- [ ] **Step 2:** `pnpm --filter @obsidian-plugins/rules test` → FAIL (module missing).
- [ ] **Step 3:** Implement `basics.ts`, export from `index.ts`; `pnpm install`.
- [ ] **Step 4:** Test → PASS; `pnpm check` from the root → green (the new package's lint,
      typecheck and test run under `pnpm -r`).
- [ ] **Step 5:** Commit `feat(rules): package scaffold with modifiers and proficiency bonus`.

### Task 2: The data model and the data check

**Files:**

- Create: `packages/rules/src/model.ts`, `packages/rules/src/data.ts`, `packages/rules/src/check.ts`
- Create: `packages/rules/data/fixture/` (a tiny test rule set: one class `tester` with levels 1–4,
  one subclass at 3, one species, one background, one feat, one armour, one weapon)
- Test: `packages/rules/test/check.test.ts`

**Interfaces — Produces** (in `model.ts`; names are binding, inner details the implementer's):

```ts
type Text = { en: string; de?: string }; // full SRD text or a summary
type Amount = number | { ability: Ability } | { proficiency: true } | { byLevel: number[] }; // byLevel: index = class level − 1
type Grant =
  | {
      kind: 'proficiency';
      what: 'save' | 'skill' | 'armor' | 'weapon' | 'tool' | 'language';
      ids: string[];
    }
  | { kind: 'expertise'; ids: string[] }
  | { kind: 'ability'; ability: Ability; value: number; max?: number }
  | { kind: 'speed'; value: number }
  | { kind: 'sense'; id: string; range: number }
  | { kind: 'initiative'; add: Amount }
  | { kind: 'hp'; perLevel: number }
  | { kind: 'ac'; base: number; add: Ability[]; shield: boolean; id: string } // unarmoured formulas
  | {
      kind: 'resource';
      id: string;
      name: Text;
      uses: Amount;
      die?: string | { byLevel: string[] };
      recharge: 'short' | 'long' | { byLevel: ('short' | 'long')[] };
    }
  | { kind: 'half-proficiency'; to: 'checks' } // Jack of All Trades
  | {
      kind: 'spellcasting';
      ability: Ability;
      progression: 'full' | 'half' | 'third' | 'pact';
      prepared: Amount;
      cantrips: Amount;
      list: string;
    };
type OptionSource =
  | { ids: string[] }
  | { skills: 'any' | string[] }
  | { feats: 'origin' | 'general' | 'fighting-style' | 'epic-boon' }
  | { subclasses: string }
  | { abilities: Ability[]; points: 2 | 3 }
  | { spells: string; level: number | 'cantrip' };
interface Choice {
  id: string;
  name: Text;
  count: Amount;
  from: OptionSource;
}
interface Feature {
  id: string;
  name: Text;
  level: number;
  text: Text;
  grants: Grant[];
  choices: Choice[];
}
interface ClassDef {
  id: string;
  rules: RuleSet;
  name: Text;
  hitDie: number;
  primary: Ability[];
  saves: Ability[];
  features: Feature[];
  subclassLevel: number;
  multiclass: { requires: Partial<Record<Ability, number>>; grants: Grant[] };
}
interface SubclassDef {
  id: string;
  class: string;
  rules: RuleSet;
  name: Text;
  source: string;
  features: Feature[];
}
interface SpeciesDef {
  id: string;
  rules: RuleSet;
  name: Text;
  size: string[];
  speed: number;
  features: Feature[];
}
interface BackgroundDef {
  id: string;
  rules: RuleSet;
  name: Text;
  abilities: Ability[];
  feat: string;
  features: Feature[];
}
interface FeatDef {
  id: string;
  rules: RuleSet;
  name: Text;
  category: 'origin' | 'general' | 'fighting-style' | 'epic-boon';
  repeatable: boolean;
  requires?: { level?: number; ability?: Partial<Record<Ability, number>> };
  features: Feature[];
}
interface ArmorDef {
  id: string;
  name: Text;
  category: 'light' | 'medium' | 'heavy' | 'shield';
  ac: number;
  dexMax: number | null;
  strength?: number;
  stealth: boolean;
}
interface WeaponDef {
  id: string;
  name: Text;
  category: 'simple' | 'martial';
  ranged: boolean;
  damage: string;
  type: string;
  properties: string[];
  mastery?: string;
  range?: [number, number];
}
interface RulesData {
  classes: ClassDef[];
  subclasses: SubclassDef[];
  species: SpeciesDef[];
  backgrounds: BackgroundDef[];
  feats: FeatDef[];
  armor: ArmorDef[];
  weapons: WeaponDef[];
  skills: { id: string; ability: Ability; name: Text }[];
}
```

- `data.ts`: `loadRules(sets: RulesData[]): Rules` with lookups `rules.class(id)`, `.subclass(id)`,
  `.species(id)`, `.background(id)`, `.feat(id)`, `.armor(id)`, `.weapon(id)`, `.skill(id)`
  (each `… | undefined`).
- `check.ts`: `checkRules(rules: Rules): string[]` — problems as readable lines: duplicate ids, a
  subclass whose class is missing, a background whose feat is missing, a choice whose `from.ids`
  name unknown ids, a class without features at its `subclassLevel` asking `{ subclasses }`, a
  `byLevel` array not of length 20.

- [ ] **Step 1: Failing tests** — the fixture checks clean (`[]`); a copy with the background's
      feat renamed reports `background fixture-bg: unknown feat 'nope'`; a duplicated class id
      reports `duplicate class id 'tester'`; a `byLevel` of length 19 reports its feature id.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat(rules): data model, lookups and the data check`.

### Task 3: `derive` — abilities, proficiencies, HP, initiative, speed

**Files:**

- Create: `packages/rules/src/character.ts`, `packages/rules/src/derive.ts`
- Test: `packages/rules/test/derive.test.ts` (on the fixture rule set)

**Interfaces — Produces:**

```ts
interface LevelEntry { class: string; hp: 'max' | 'average' | number; choices: Record<string, string[]> }
interface Character { rules: RuleSet; species: string; background: string; abilities: Record<Ability, number>;
  levels: LevelEntry[]; choices: Record<string, string[]>;  // species/background/creation choices
  inventory: { item: string; equipped?: boolean; quantity?: number }[]; bonuses: { to: string; value: number; why: string }[] }
interface Value { total: number; sources: { label: string; value: number }[] }
interface Sheet { level: number; classes: { id: string; level: number; subclass: string | null }[];
  abilities: Record<Ability, { score: number; modifier: number }>; proficiency: number;
  saves: Record<Ability, Value & { proficient: boolean }>; skills: Record<string, Value & { rank: 0 | 0.5 | 1 | 2 }>;
  passive: { perception: number; insight: number; investigation: number }; initiative: Value; speed: number;
  senses: { id: string; range: number }[]; hp: Value; ac: Value; attacks: Attack[]; spellcasting: Spellcasting[];
  slots: number[]; pact: { level: number; count: number } | null; resources: Resource[];
  features: { id: string; name: Text; text: Text; level: number; from: string }[];
  proficiencies: Record<'armor' | 'weapon' | 'tool' | 'language', string[]>; missing: string[]; unknown: string[] }
derive(character: Character, rules: Rules): Sheet
```

`Attack`, `Spellcasting`, `Resource` are defined in Tasks 4–5 (empty arrays until then).
Choice keys: `<feature id>/<choice id>`; the first level's class grants all saves and skill choice,
a multiclass level the class's `multiclass.grants` only.

- [ ] **Step 1: Failing tests** (fixture `tester`: d10, saves str/con, level-1 skill choice of 2,
      ASI at 4):
  - scores: base `{str 15, dex 14, con 13, int 12, wis 10, cha 8}`, background +2 str +1 con
    (choice `background/abilities`), ASI at 4 `str` ×2 → `str` 19 → modifier +4; a second ASI
    pushing str past 20 caps at 20.
  - proficiency at level 4 = 2; `saves.str.total` = 6 with sources `[Strength +4, Proficiency +2]`.
  - HP: level 1 `max` (10 + 1), levels 2–4 `average` (6 + 1 each) → 32; with a feature grant
    `{kind:'hp', perLevel:1}` → 36.
  - skill with expertise → modifier + 2×prof; `half-proficiency` gives floor(prof/2) to
    non-proficient skills only.
  - `passive.perception` = 10 + perception total.
  - unknown subclass id in a level's choices → `sheet.unknown` contains it, no throw; a level-4
    entry without its ASI choice → `sheet.missing` contains `tester-asi-4/ability`.
- [ ] **Step 2–4:** RED → implement → GREEN.
- [ ] **Step 5:** Commit `feat(rules): derive abilities, saves, skills, hit points and speed`.

### Task 4: `derive` — armour class and attacks

**Files:** Modify `packages/rules/src/derive.ts`; create `packages/rules/src/combat.ts`; test
`packages/rules/test/combat.test.ts`.

**Interfaces — Produces:**
`interface Attack { id: string; name: Text; toHit: Value; damage: string; type: string; properties: string[]; mastery: string | null; proficient: boolean }`

Rules: AC = best of: equipped armour (light: ac + dex; medium: ac + min(dex, 2); heavy: ac), each
unarmoured `ac` grant (base + listed modifiers, shield allowed when `shield`), and 10 + dex; plus
an equipped shield (+2) and `bonuses` with `to: 'ac'`. Weapon attack ability: str, or dex if
ranged, or the better of both if `finesse`; to-hit = mod + prof when proficient (category or id).

- [ ] **Step 1: Failing tests:** leather (11) with dex 16 → 14; chain mail (16) heavy ignores
      dex → 16; half plate (15) medium with dex 18 → 17; barbarian-style grant
      `{base 10, add [dex, con]}` with dex 14, con 16 → 15 and with a shield → 17; a monk-style
      grant with `shield: false` and a shield equipped → the grant is not used; dagger (finesse,
      simple) with str 8, dex 16, prof 3 → `+6`, `1d4+3`; a martial weapon without proficiency →
      to-hit has no proficiency source, `proficient: false`.
- [ ] **Step 2–4:** RED → implement → GREEN. **Step 5:** Commit
      `feat(rules): armour class and weapon attacks`.

### Task 5: `derive` — spellcasting, slots, resources, features

**Files:** create `packages/rules/src/spellcasting.ts`; modify `derive.ts`; test
`packages/rules/test/spellcasting.test.ts`.

**Interfaces — Produces:**
`interface Spellcasting { class: string; ability: Ability; dc: number; attack: number; prepared: number; cantrips: number; list: string }`
`interface Resource { id: string; name: Text; uses: number; die: string | null; recharge: 'short' | 'long' }`

Slot table: the standard full-caster table (levels 1–20, 9 columns); caster level = full levels +
half levels + third levels, where 2024 rounds half and third **up** for multiclass and 2014 rounds
**down** (a single-class half caster uses its own table: half levels rounded up, none at level 1 in
2014); pact slots from the warlock's own table, separate.

- [ ] **Step 1: Failing tests:** single full caster level 6 → slots `[4, 3, 3]`, DC 8 + prof +
      mod; 2024 half 3 + full 3 → caster level 5 → `[4, 3, 2]`; the same in 2014 → caster level 4 →
      `[4, 3]`; pact level 2 → `pact {level 1, count 2}` and `slots` empty; a resource
      `uses {ability: cha}` with cha 17 → 3, recharge `byLevel` switching to `short` at 5; features
      list holds every feature up to the class level with `from` naming the class, subclass,
      species, background or feat.
- [ ] **Step 2–4:** RED → implement → GREEN. **Step 5:** Commit
      `feat(rules): spellcasting, spell slots, resources and features`.

### Task 6: SRD 5.2.1 data (classes and subclasses)

**Files:**

- Create: `packages/rules/data/srd-5.2.1/{classes.json,subclasses.json,skills.json}`
- Create: `packages/rules/scripts/srd52-instructions.md` (how the cleaning agents turn the SRD
  text into records: the model of Task 2, one feature per SRD feature heading, full text verbatim
  from the SRD, grants and choices only per §5's boundary, "never estimate a number")
- Create: `packages/rules/src/srd52.ts` (`SRD_52: RulesData`, imports the JSON)
- Test: `packages/rules/test/srd52.test.ts`

Source: SRD 5.2.1 (CC-BY-4.0, `https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf`),
downloaded to `dnd5e-library/work/srd52/` and turned into text with `pdftotext -layout`; batches of
two classes per agent, as in the catalogues. The 12 classes with levels 1–20 and the SRD's one
subclass each (`barbarian/path-of-the-berserker`, `bard/college-of-lore`, `cleric/life-domain`,
`druid/circle-of-the-land`, `fighter/champion`, `monk/warrior-of-the-open-hand`,
`paladin/oath-of-devotion`, `ranger/hunter`, `rogue/thief`, `sorcerer/draconic-sorcery`,
`warlock/fiend-patron`, `wizard/evoker`).

- [ ] **Step 1: Failing tests:** `checkRules(loadRules([SRD_52]))` → `[]` (after Task 7 adds the
      rest; until then the test loads classes with a stub feat list); 12 classes, 12 subclasses;
      every class has `subclassLevel` 3; bard: hit die 8, saves dex/cha, Bardic Inspiration die
      `d6` at 1, `d8` at 5, `d10` at 10, `d12` at 15, recharge `short` from level 5; warlock
      progression `pact`; paladin and ranger `half`; every feature text non-empty.
- [ ] **Step 2:** RED. **Step 3:** Download, extract, clean with agents, review a sample of each
      class against the SRD text. **Step 4:** GREEN.
- [ ] **Step 5:** Commit `feat(rules): SRD 5.2.1 classes and subclasses`.

### Task 7: SRD 5.2.1 data (species, backgrounds, feats, armour, weapons) and the reference character

**Files:**

- Create: `packages/rules/data/srd-5.2.1/{species.json,backgrounds.json,feats.json,armor.json,weapons.json}`
- Test: `packages/rules/test/srd52.test.ts` (extend), `packages/rules/test/reference.test.ts`

The SRD 5.2.1's 9 species, 4 backgrounds (Acolyte, Criminal, Sage, Soldier), its feats (origin,
general, fighting style, epic boons), its armour and weapon tables with weapon mastery.

- [ ] **Step 1: Failing tests:**
  - `checkRules(loadRules([SRD_52]))` → `[]`.
  - **The reference character** (also the example vault's note in Task 10): 2024, halfling,
    criminal (background abilities dex +2, con +1; origin feat Alert), base
    `{str 8, dex 14, con 12, int 10, wis 13, cha 15}`, bard 6, levels 2–6 `average`, skills
    deception, performance, persuasion; expertise (level 2) persuasion, deception; College of Lore
    at 3 with bonus proficiencies arcana, insight, perception; ASI at 4 cha +2; leather armour and
    a dagger equipped. Expected: scores dex 16, con 13, cha 17; proficiency 3; HP 39; AC 14;
    initiative +6 (dex 3 + Alert's proficiency 3); speed 30; saves dex +6, cha +6, str −1;
    persuasion +9, deception +9, perception +4, athletics +0 (Jack of All Trades: −1 + 1);
    passive Perception 14; dagger `+6`, `1d4+3`; spell save DC 14, attack +6; slots `[4, 3, 3]`;
    Bardic Inspiration 3 uses, `d8`, recharge `short`.
- [ ] **Step 2–4:** RED → data → GREEN. **Step 5:** Commit
      `feat(rules): SRD 5.2.1 species, backgrounds, feats, armour and weapons`.

### Task 8: The character note in the plugin

**Files:**

- Create: `plugins/dnd5e-bylokianer/src/character/note.ts`
- Create: `plugins/dnd5e-bylokianer/src/obsidian/register/character.ts`
- Modify: `plugins/dnd5e-bylokianer/src/main.ts` (register), `src/i18n/strings.ts`
- Test: `plugins/dnd5e-bylokianer/test/character-note.test.ts`

**Interfaces — Produces:**

- `readCharacter(frontmatter: Record<string, unknown> | undefined): Character | null` — null when
  the note has no `levels` (hand-written); reads `species` or `race`, `abilities`, `levels`,
  `choices`, `inventory`, `bonuses`, ignoring malformed entries.
- `computedKeys(sheet: Sheet): Record<string, unknown>` — `class` (the first class's id, or
  `bard 3 / wizard 2` for a multiclass), `subclass` (name, lower case, as today's notes),
  `level`, `ac`, `hp`, `initiative`, `passive_perception`, `saves` and `skills` (proficient ones
  only, `{ dex: 6 }` shape as today), `race` (the species id, for the modules that read it).
- `differs(frontmatter, keys): boolean`.
- In `register/character.ts`: on `metadataCache.on('changed')` for a note with `type: character`
  and `levels`, derive and, when `differs`, write the keys with `processFrontMatter`.

- [ ] **Step 1: Failing tests:** the reference character's frontmatter → `computedKeys` equals
      the object below (skill keys in snake case, as today's notes and the dice module read them);
      `Orrin Quill.md`'s frontmatter (no `levels`) → `readCharacter` null; writing the computed
      keys back and reading again → `differs` false (no write loop); a `levels` entry that is not
      an object is skipped.

  ```ts
  { class: 'bard', subclass: 'college of lore', level: 6, ac: 14, hp: 39, initiative: 6,
    passive_perception: 14, race: 'halfling', saves: { dex: 6, cha: 6 },
    skills: { arcana: 3, deception: 9, insight: 4, perception: 4, performance: 6,
              persuasion: 9, sleight_of_hand: 6, stealth: 6 } }
  ```

- [ ] **Step 2–4:** RED → implement → GREEN. **Step 5:** Commit
      `feat(dnd5e): read built character notes and keep their computed keys`.

### Task 9: The character sheet view (layout A)

**Files:**

- Create: `plugins/dnd5e-bylokianer/src/obsidian/character-sheet-view.ts` (`CHARACTER_VIEW =
'dnd5e-character-sheet'`, `CharacterSheetView extends ItemView`, state `{ path: string }`)
- Create: `plugins/dnd5e-bylokianer/styles/character-sheet.css` (import in `styles/index.css`
  after `dice-tab.css`)
- Modify: `register/character.ts` (view, command "Open character sheet", file-menu item for
  character notes), `strings.ts`
- Test: `plugins/dnd5e-bylokianer/test/ui/views.test.ts` (`describe('character sheet')`)

Deps: `{ t, lang, sheet: (path) => Promise<{ name: string; sheet: Sheet | null; frontmatter }>, roll: RollCheck, openNote, onChange(path, cb) => () => void }`.

Layout A (spec §2): head with name, `species · class level (subclass) · rules`, HP `current / max`
(from `hp_current`, default max; no − / + until C4); tiles AC, Initiative, Speed, Proficiency,
Passive Perception; ability column (score, modifier large) with saves and senses under it; tabs
as pills: Actions (attacks with to-hit and damage `checkButton`s, resources with uses and recharge,
spellcasting line), Spells (DC, attack, slots as circles, class list name — the list itself is
C2/C3), Features (grouped by `from`, each with its text; SRD attribution line), Inventory
(equipped items, read-only), Skills (all 18 with rank marker and a `checkButton`), Notes (opens the
note), Levels (one row per level: class, HP, choices). A hand-written note shows its own values
(ac, hp, saves, skills) and a line "Built with the character builder in a later version" — no
derive. `sheet.missing` and `sheet.unknown` show as a warning row (style of `warnings.css`).
Below 480 px of its own width, the ability column becomes a row of six boxes above the tabs.

- [ ] **Step 1: Failing tests:** the reference character renders tiles `['14','+6','30 ft.','+3','14']`
      with labels AC, Initiative, Speed, Proficiency, Passive Perception; ability column texts
      `STR 8 −1` … `CHA 17 +3`; Actions tab has the dagger with buttons `+6` and `1d4+3`, clicking
      `+6` calls `roll` with formula `d20+6`; Skills tab shows Persuasion `+9` marked expertise;
      the Levels tab has 6 rows, row 3 names College of Lore; Orrin Quill (hand-written) shows AC
      14, HP 39 and the hand-written line; an unknown feat id shows one warning row. German:
      tile labels `RK, Initiative, Bewegung, Übung, Passive Wahrnehmung`.
- [ ] **Step 2–4:** RED → implement → GREEN.
- [ ] **Step 5:** Screenshots with the scratchpad harness (dark 1100 px, light German 900 px,
      380 px), fix what they show. Commit `feat(dnd5e): the character sheet, layout A`.

### Task 10: Example vault, docs, check

**Files:** `examples/vault/Silverstadt/Party/Wren Ashdown.md` (the reference character as a built
note, SRD only; body two lines of own text), `examples/vault/Home.md` (a row), plugin `README.md`
(Character sheet section, SRD 5.2.1 attribution), `CHANGELOG.md` (Added), `DECISIONS.md`
(module 8: approach 1, rule-set mixing 1b, German texts 2a, the rulings above), root `ROADMAP.md`
and `HANDOFF.md`, `CLAUDE.md` plugin table, `packages/rules/README.md`.

- [ ] **Step 1:** Add the note; a test in `test/world.example.test.ts` or a new
      `test/character.example.test.ts` reads it and gets the reference numbers.
- [ ] **Step 2:** Docs. **Step 3:** `pnpm format`, `pnpm check` → green; `pnpm install-example`.
- [ ] **Step 4:** Commit `feat(dnd5e): character builder C1 — example character and docs`; push.
