# Visual refactoring V1 — building blocks and the stat block — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The shared style-C building blocks (tiles, ability column, section heads, action rows,
pills, split) and the stat block rebuilt with them, everywhere it renders (notes, Monster Manual,
NPC preview, monster builder, Battle tab).

**Architecture:** Small DOM builders in `src/obsidian/ui/blocks.ts` plus their CSS in
`styles/base.css`; a pure parser `src/dice/action-row.ts` that reads an entry's to-hit, damage
parts and DC; `renderStatblock` split into named parts in `src/obsidian/statblock-parts.ts`, its
public signature unchanged so callers stay as they are.

**Tech Stack:** TypeScript 6.0.3, Obsidian API (`createEl`/`createDiv`), Vitest + happy-dom,
esbuild, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-20-visual-refactoring-design.md` (§2 visual language,
§3 phase V1, §6 calls).

## Global Constraints

- Only Obsidian CSS variables (`--interactive-accent`, `--text-accent`, `--color-red`,
  `--color-green`, `--background-secondary`, `--background-modifier-border`,
  `--background-modifier-hover`, …); tints by `color-mix`. No fixed colours.
- Text at least 16 px everywhere, tile labels included; no small italic text.
- `createEl` / `createDiv` only, never `innerHTML`. Mobile: no Node APIs.
- English code and comments; every new UI string in English and German (`src/i18n/strings.ts`).
- Lint limits hold: complexity ≤ 20, ≤ 150 lines per function.
- Nothing in notes changes: no frontmatter, block format or command changes.
- Editing and rolling stay as today (spec §6): name, AC, HP, Speed, senses, languages, CR and
  ability scores click-to-edit when `ctx.edit` is set; ability modifiers, saves and skills roll
  when `ctx.roll` is set (Shift advantage, Alt disadvantage, right-click menu); entry tools on
  hover, always on phones.
- Action rows are **row and text** (spec §2): the row adds buttons for recognised parts; the
  entry's full text stays under it with its inline dice buttons; nothing is removed from the text.
- One fold point: below a container width of 480 px the ability column becomes a row of six above
  the content.
- `pnpm format` before committing; Conventional Commits with scope `dnd5e`; no attribution lines.

## Review Focus

1. **An entry with damage and a DC but no attack roll** (a breath weapon): the row shows the DC
   badge and the damage button, no to-hit — test in Task 2 and Task 3.
2. **German texts** (`Stärkerettungswurf mit SG 14`, `+7 auf Treffer`, `1W10 + 5`): the row reads
   them like the English — test in Task 2.
3. **A sparse block** (a new NPC with only a name, or no `stats`): no empty tiles, no empty
   ability column, no empty section heads — test in Task 3.
4. **Edit mode**: AC in its tile and an ability score in the column stay editable and write the
   same scalar / ability edits as today — the existing edit test, moved to the new selectors, in
   Task 3.
5. **Narrow places** (right sidebar, the Battle tab's details pane, a phone): the column folds,
   nothing overflows horizontally — screenshots at 360 px and tab width in Task 4.

---

### Task 1: Building blocks

**Files:**

- Create: `plugins/dnd5e-bylokianer/src/obsidian/ui/blocks.ts`
- Modify: `plugins/dnd5e-bylokianer/styles/base.css` (new section "Building blocks (style C)",
  and replace the header comment's "one visual language" rules with style C's: tiles, section
  heads in capitals, pills, list | details)
- Test: `plugins/dnd5e-bylokianer/test/ui/blocks.test.ts`

**Interfaces:**

- Produces (all in `src/obsidian/ui/blocks.ts`):
  - `tiles(parent: HTMLElement): HTMLElement` — a `div.dnd5e-tiles` grid.
  - `tile(parent: HTMLElement, value: string, label: string): { el: HTMLElement; value: HTMLElement }` —
    `div.dnd5e-tile` > `div.dnd5e-tile-value` + `div.dnd5e-tile-label`; returns the value element
    so callers can make it editable.
  - `sectionHead(parent: HTMLElement, text: string): HTMLElement` — `div.dnd5e-section-head`.
  - `pill(parent: HTMLElement, text: string, active?: boolean): HTMLElement` —
    `span.dnd5e-pill`, plus `is-active` when active.
  - `split(parent: HTMLElement): { list: HTMLElement; details: HTMLElement }` —
    `div.dnd5e-split` > `div.dnd5e-split-list` + `div.dnd5e-split-details` (used from V2 on; built
    now with its CSS so the fold rule lives in one place).
- CSS classes: `dnd5e-tiles` (grid, `repeat(auto-fit, minmax(96px, 1fr))`), `dnd5e-tile`
  (`--background-secondary`, `--radius-m`), `dnd5e-tile-value` (1.4em, bold),
  `dnd5e-tile-label` (16 px, uppercase, letter-spacing .06em, `--text-muted`),
  `dnd5e-section-head` (16 px, bold, uppercase, letter-spacing .08em, `--text-accent`, 1 px
  `--background-modifier-border` under it), `dnd5e-pill` (+ `.is-active` tinted 25 %
  `--interactive-accent`), `dnd5e-split` (`container-type: inline-size`; two columns
  `minmax(200px, 1fr) 2fr`, one column below 480 px via `@container`).

- [ ] **Step 1: Write the failing tests** in `test/ui/blocks.test.ts`:
  - `tile(root, '18', 'AC')` → `root.querySelector('.dnd5e-tile-value')?.textContent === '18'`,
    label `'AC'`, returned `value` is that element.
  - `sectionHead(root, 'Actions')` → `.dnd5e-section-head` text `'Actions'`.
  - `pill(root, 'Prone', true)` → `span.dnd5e-pill.is-active` text `'Prone'`; without `active`,
    no `is-active`.
  - `split(root)` → `.dnd5e-split > .dnd5e-split-list` and `.dnd5e-split > .dnd5e-split-details`
    exist and are the returned elements.
- [ ] **Step 2: Run** `pnpm --filter dnd5e-bylokianer exec vitest run test/ui/blocks.test.ts` —
      expected FAIL (module not found).
- [ ] **Step 3: Implement** the five builders and the CSS above.
- [ ] **Step 4: Run** the same command — expected PASS.
- [ ] **Step 5: Commit** — `git add` the three files; `git commit -m "feat(dnd5e): style C building blocks"`.

### Task 2: Reading an action's row

**Files:**

- Create: `plugins/dnd5e-bylokianer/src/dice/action-row.ts`
- Modify: `plugins/dnd5e-bylokianer/src/obsidian/statblock-dice.ts` (extract the `Check` built
  inside `linkEntryDice` into an exported `partCheck`, used by both)
- Test: `plugins/dnd5e-bylokianer/test/dice.test.ts` (new `describe('actionRow')`)

**Interfaces:**

- Consumes: `rollParts(text): RollPart[]` from `src/dice/statblock.ts`.
- Produces:
  - `src/dice/action-row.ts`:
    ```ts
    export interface ActionRow {
      attack: RollPart | null; // the first attack part
      damage: RollPart[]; // every damage part, in order
      dc: { dc: number; ability: Ability } | null; // the first saving throw DC
    }
    export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
    /** null when the text has no attack, damage or DC. */
    export function actionRow(text: string): ActionRow | null;
    ```
    DC forms to read (case-insensitive): `DC 15 Constitution saving throw`, `Constitution Saving
Throw: DC 15`, `save DC 12` without an ability is **not** a row DC (it is a spellcasting
    line), German `Konstitutionsrettungswurf mit SG 14` / `Konstitutions-Rettungswurf mit SG 14`.
    Ability words: English full names, German `Stärke`, `Geschicklichkeit`, `Konstitution`,
    `Intelligenz`, `Weisheit`, `Charisma` as the compound's first part.
  - `src/obsidian/statblock-dice.ts`:
    `export function partCheck(part: RollPart, text: string, who: string, entry: string, t: T): Check`
    — exactly the `Check` `linkEntryDice` builds today (label with `· Damage`, subject
    `"<who> rolls <entry> damage"`, `d20: !damage`, `damage`).

- [ ] **Step 1: Write the failing tests:**
  - `actionRow('Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. Hit: 10 (1d10 + 5) piercing damage.')`
    → `attack.formula === 'd20+7'`, `damage.map(p => p.formula)` `['1d10+5']`, `dc === null`.
  - `actionRow('Hit: 8 (1d8 + 4) slashing damage, plus 9 (2d8) radiant damage.')` → damage
    formulas `['1d8+4', '2d8']`, `attack === null`.
  - `actionRow('Each creature in a 30-foot cone must make a DC 18 Constitution saving throw, taking 56 (16d6) poison damage on a failed save.')`
    → `attack === null`, `dc` `{ dc: 18, ability: 'con' }`, damage `['16d6']`.
  - `actionRow('Dexterity Saving Throw: DC 15, each creature in a 20-foot line. Failure: 22 (4d10) fire damage.')`
    → `dc` `{ dc: 15, ability: 'dex' }`.
  - German: `actionRow('Nahkampf-Waffenangriff: +7 auf Treffer … Treffer: 10 (1W10 + 5) Stichschaden. Das Ziel muss einen Stärkerettungswurf mit SG 14 bestehen')`
    → attack `'d20+7'`, damage `['1d10+5']`, dc `{ dc: 14, ability: 'str' }`.
  - `actionRow('The owlbear makes two attacks: one with its beak and one with its claws.')` → `null`.
  - `actionRow('Spellcasting. … (spell save DC 12, +4 to hit with spell attacks)')` → `dc === null`.
- [ ] **Step 2: Run** `pnpm --filter dnd5e-bylokianer exec vitest run test/dice.test.ts` — FAIL.
- [ ] **Step 3: Implement** `actionRow` (reuse `rollParts`; one regex per DC form, no
      lookbehind — the lint rule forbids it) and extract `partCheck`; `linkEntryDice` calls it.
- [ ] **Step 4: Run** the same command plus `test/ui/views.test.ts` — PASS (the existing
      stat-block dice tests prove `partCheck` kept `linkEntryDice` unchanged).
- [ ] **Step 5: Commit** — `feat(dnd5e): read an action's to-hit, damage and DC`.

### Task 3: The stat block in style C

**Files:**

- Create: `plugins/dnd5e-bylokianer/src/obsidian/statblock-parts.ts` — the named parts.
- Modify: `plugins/dnd5e-bylokianer/src/obsidian/statblock-view.ts` — `renderStatblock` becomes
  the composition of the parts; `editable`, `typed`, `withNote`, `entryTools` move to the parts
  file if only the parts use them. `renderFolded`, `renderShortStats`, `renderInvalid` stay.
- Modify: `plugins/dnd5e-bylokianer/styles/statblock.css` — rewrite for the new structure.
- Modify: `plugins/dnd5e-bylokianer/src/i18n/strings.ts` — new key `statblock.tiles`:
  EN `'Armor Class,Hit Points,Speed'`, DE `'Rüstungsklasse,Trefferpunkte,Bewegung'` (the tile
  labels; the long `statblock.ac` etc. stay for nothing else and are removed if unused after the
  change). New key `statblock.dc`: EN `'DC {dc} {ability}'`, DE `'SG {dc} {ability}'`, the
  ability as the short label from `statblock.abilities`.
- Test: `plugins/dnd5e-bylokianer/test/ui/views.test.ts` (`describe('stat block')`,
  `describe('spellbook')` owlbear test, `describe('monster manual')`, `describe('monster builder')`).

**Interfaces:**

- Consumes: Task 1 builders; Task 2 `actionRow`, `partCheck`; existing `checkButton`,
  `linkEntryDice`, `abilityCheckName`, `checks`.
- Produces (DOM contract later phases and tests rely on):

  ```
  div.dnd5e-statblock
    div.dnd5e-sb-head > div.dnd5e-sb-name, div.dnd5e-sb-meta   (meta adds " · CR 9" when cr set)
    div.dnd5e-tiles.dnd5e-sb-tiles > div.dnd5e-tile (AC, HP, Speed; only those with a value,
                                     or all three while editing)
    div.dnd5e-sb-body                                    (container: inline-size)
      div.dnd5e-sb-side
        div.dnd5e-sb-abilities > div.dnd5e-sb-ability    (×6: span.dnd5e-sb-ability-label
                                                          "STR 18", modifier button or span)
        div.dnd5e-sb-lines > div.dnd5e-sb-line           (saves, skills, vulnerabilities …,
                                                          senses, languages, challenge, PB)
      div.dnd5e-sb-main
        div.dnd5e-sb-section > div.dnd5e-section-head.dnd5e-sb-section-title,
                               div.dnd5e-sb-entry
                                 div.dnd5e-sb-action-row  (only when actionRow ≠ null:
                                   span.dnd5e-sb-action-name, attack button, damage buttons,
                                   span.dnd5e-pill.dnd5e-sb-dc)
                                 div.dnd5e-sb-entry-text (the rendered Markdown, as today)
  ```

  The ability label carries the score: `"STR 18"`; the score part stays click-to-edit; the
  modifier is the roll button (or a plain span without `ctx.roll`). The AC tile's value shows
  `withNote` text (`"18 (plate)"`) and edits the raw AC. The DC pill is not a button (the target
  rolls a save, not the GM).

- [ ] **Step 1: Update the tests first** (they fail on the old DOM):
  - Mira Voss: `texts(root, '.dnd5e-tile-value')` `['16', '84 (13d8 + 26)', '30 ft.']`;
    `texts(root, '.dnd5e-sb-ability-label')`
    `['STR 11', 'DEX 18', 'CON 14', 'INT 17', 'WIS 15', 'CHA 16']`; section titles unchanged `['Actions', 'Reactions']`; the old
    `.dnd5e-sb-line` assertions for saves, challenge, PB unchanged.
  - Edit test: AC found via `.dnd5e-sb-tiles .dnd5e-tile-value.is-editable`, same expected
    scalar write as today; ability edit via `.dnd5e-sb-ability .is-editable` as today.
  - Owlbear with `roll`: the Beak entry has `.dnd5e-sb-action-row` whose buttons read
    `['+7', '1d10+5']`; clicking `'+7'` calls `roll` with `formula: 'd20+7'`, `d20: true`; the
    entry text still contains its own `.dnd5e-sb-roll` buttons (row **and** text). The
    Multiattack entry has no `.dnd5e-sb-action-row`.
  - A breath weapon (Adult Red Dragon from the Monster Manual test): `.dnd5e-sb-dc` text
    `'DC 21 DEX'`, a damage button, no attack button.
  - German Owlbear (`de`): `.dnd5e-tile-label` `['Rüstungsklasse', 'Trefferpunkte', 'Bewegung']`,
    the speed tile contains `'12 m'` (replaces the old `.dnd5e-sb-lines` check).
  - Sparse block `name: Nobody`: no `.dnd5e-tile`, no `.dnd5e-sb-abilities`, no
    `.dnd5e-sb-section`.
- [ ] **Step 2: Run** `pnpm --filter dnd5e-bylokianer exec vitest run test/ui/views.test.ts` —
      the new assertions FAIL.
- [ ] **Step 3: Implement** `statblock-parts.ts` with one function per part — `renderHead`,
      `renderTiles`, `renderAbilities`, `renderLines`, `renderSection`, `renderActionRow` — each
      `(parent, block, ctx)`-shaped, each under the lint limits; `renderStatblock` composes them.
      Write `statblock.css` for the structure: `.dnd5e-sb-body` a grid `minmax(150px, 190px) 1fr`,
      folding below 480 px (`@container`) to one column with `.dnd5e-sb-abilities` as six columns;
      action rows zebra-striped with `--background-secondary` on the block's
      `--background-primary`; the statblock's own background becomes `--background-primary` with a
      `--background-modifier-border` border so the tiles stand out; drop the 2 px accent rules.
      Keep `.dnd5e-sb-roll`, fold, short-stats and checks rules.
- [ ] **Step 4: Run** `pnpm --filter dnd5e-bylokianer exec vitest run` — all PASS; then
      `pnpm check` at the root — exit 0, no new lint warnings.
- [ ] **Step 5: Commit** — `feat(dnd5e): the stat block in style C` (body: what changed, why,
      what was left out; mention it also completes roadmap code-quality step 3 for `renderStatblock`).

### Task 4: Look, docs, check

**Files:**

- Modify: `plugins/dnd5e-bylokianer/DECISIONS.md` (new entry "2026-11-20 · Visual refactoring:
  style C" — the choice, superseded rules from 2026-10-24, row and text, one fold point),
  `plugins/dnd5e-bylokianer/CHANGELOG.md` (Unreleased → Changed),
  `plugins/dnd5e-bylokianer/screenshots/statblock.webp`, `statblock-de.webp`,
  `statblock-dice.webp`, `monsters.webp` (retaken), `ROADMAP.md`, `HANDOFF.md`,
  `examples/vault/Home.md` only if a note is added.

- [ ] **Step 1: Screenshots.** `pnpm build`, then render with the scratchpad harness (see
      HANDOFF "Watch out": bundle `test/ui/obsidian.ts` as `obsidian`, link the built `styles.css`,
      define Obsidian's size variables) at 360 px and 900 px, dark and light: Commander Isolde
      Ferrant, the Owlbear in German, the Adult Red Dragon. Check: no horizontal overflow, column
      folds at 360 px, text ≥ 16 px, contrast readable in light.
- [ ] **Step 2: Install into the example vault** (`node scripts/install-example.mjs` from the
      plugin folder) for the maintainer's check in Obsidian.
- [ ] **Step 3: Docs** — DECISIONS, CHANGELOG, ROADMAP (new "Visual refactoring" section, V1
      ticked as built, awaiting check), HANDOFF rewritten.
- [ ] **Step 4: Run** `pnpm format` then `pnpm check` — exit 0.
- [ ] **Step 5: Commit** — `docs(dnd5e): visual refactoring V1`; push only when the maintainer
      says so. Stop for the maintainer's check before V2.
