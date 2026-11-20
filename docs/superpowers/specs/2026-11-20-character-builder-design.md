# Character builder, level-up database and character sheet — design

Date: 2026-11-20. Module 8 of dnd5e-byLokianer (`plugins/dnd5e-bylokianer/`). Builds on D42 (all
subclasses as catalogues, full texts only privately), the catalogues design
(`2026-11-20-catalogues-design.md`) and the visual language of style C
(`2026-11-20-visual-refactoring-design.md`).

## 1. Intent

The maintainer wants a detailed character builder with **every** subclass, feat and background of
the books, and a **level-up database**: at every level, see all options the character has and pick
one. They want it as **their own character builder** — for the characters they play, not only for
the party they run — and they want to **play from a character sheet** in Obsidian, the way D&D
Beyond does it, rather than from a plain note.

Today a player character is a note with frontmatter written by hand (`type: character`, `class`,
`subclass`, `level`, `ac`, `hp`, `saves`, `skills`, `initiative`, `passive_perception`, as in
`examples/vault/Silverstadt/Party/Orrin Quill.md`). The Dice tab, the Battle tab, the encounter
builder and the faction views read these keys. The builder makes and keeps these notes; it does not
replace what reads them.

## 2. Decisions made by the maintainer (2026-11-20)

- **Who:** the maintainer as a player as well as the GM. The builder must be complete enough to
  build and level a real character without hand work.
- **Level-up database:** for each class and subclass, level by level, what the character gains and
  **all the options it may choose**, shown side by side to pick from.
- **Rule sets:** both, **chosen per character** (2014 or 2024). 2024 first (the builder's call,
  open to correction), 2014 as a later phase on the same model.
- **A sheet to play from**, layout **A** (D&D Beyond style): a head with name, species, class and
  level, rule set and hit points with − / + controls; tiles for AC, initiative, speed, proficiency
  bonus and passive Perception; the six abilities as a column on the left (score, modifier large),
  saves and senses under them; tabs on the right: Actions, Spells, Features, Inventory, Skills,
  Notes, Levels.
- **Approach 1:** the rules as data with a pure calculation engine (§5).
- **Multiclassing** is included (proposed, not objected to).
- **Mixing rule sets (1b, after the builder check):** a character keeps its rule set, but when
  choosing a subclass or a feat the player can switch on "show 2014 too" (the 2024 PHB allows older
  subclasses). A 2014 subclass taken by a 2024 character has its feature levels mapped onto the
  2024 class (subclass at level 3). The data model carries this from C1; the mapping is built with
  C7, when 2014 data exists.
- **German SRD texts (2a, after the builder check):** the SRD class, subclass, species, background
  and feat texts in German too, from the official German SRD, as the spells (S2) and monsters (M2)
  got theirs — as its own phase right after C1.

## 3. Goals

1. **Create** a character: rule set, species (2014: race), class, background, ability scores
   (standard array, point buy, rolled or typed), skills and other proficiencies, equipment, spells
   — each step showing every allowed option, with a preview of the sheet.
2. **Level up** a character: choose the class of the new level (multiclassing with its
   prerequisites), then every choice that level brings (subclass, Ability Score Improvement or
   feat, spells learned or prepared, invocations, fighting styles, expertise, metamagic, …); hit
   points by average or roll. Every level's choices are kept, so a level can be **re-chosen** and
   the history is visible in the Levels tab.
3. **A sheet** (layout A) that computes everything from the choices: ability scores and modifiers,
   proficiency bonus, saves, skills, passive scores, AC (armour, shield, unarmoured defence and
   similar formulas), hit points, speed, initiative, attacks (to-hit and damage per weapon),
   spellcasting (save DC, attack bonus, slots, multiclass slots, pact slots), resources with their
   recharge (Bardic Inspiration, Ki/Focus, Rage, Channel Divinity, …).
4. **Play from the sheet:** every check, save, attack and damage is a dice button (as in stat
   blocks today: click, Shift advantage, Alt disadvantage, through the dice stage and the log);
   current and temporary hit points, spent slots and resources, conditions, death saves,
   exhaustion, heroic inspiration; short and long rests restore what they restore.
5. **One truth for hit points:** the Battle tab reads a character's current hit points from its
   note and writes them back, so the sheet and the tracker never disagree.
6. **The rest of the plugin keeps working:** the builder also writes the computed keys the other
   modules read today (`ac`, `hp`, `initiative`, `passive_perception`, `saves`, `skills`, `level`,
   `class`, `subclass`, `race`).
7. **Content:** SRD content with full text (both rule sets); every class, subclass, species,
   background and feat of the maintainer's books (2024: PHB 2024, Heroes of Faerûn; 2014: PHB,
   Xanathar's, Tasha's and later books) as data with names, levels, mechanics and a **summary in
   our own words**, English and German; full texts only in the private library notes (as the
   catalogues).
8. **Inventory:** SRD equipment and SRD magic items; armour and weapons feed AC and attacks;
   own items with free text and optional bonuses; coins.
9. **Languages:** UI and summaries in English and German, as everywhere.

## 4. Non-goals and anti-goals

**Non-goals:**

- Magic items from the books (a later catalogue, like K1–K3). SRD magic items are in.
- Homebrew: own classes, subclasses, feats and items. Later, if ever; the option lists are built
  so that a later source (own notes, as own spells and monsters today) can be merged in.
- Sharing, accounts, sync, a player-facing web view. Obsidian Sync or the vault server already
  carry the notes.
- Rules automation beyond the sheet's numbers: the builder does not run combat, track reactions or
  enforce action economy. A feature whose effect is not a number on the sheet is text.
- NPCs: the New NPC dialog stays as it is (NPCs keep their stat-block archetypes).

**Anti-goals** (it would fail even if it worked):

- **Book text in the repository** (public). Summaries only; the library notes stay private.
- **A note the plugin cannot do without.** A character note must read sensibly in any Markdown
  editor and must survive the plugin's removal: choices and computed values are plain frontmatter.
- **Silent wrong numbers.** Where the engine cannot model a feature's effect, it says so on the
  sheet ("not calculated: …") and offers a manual bonus, rather than showing a number that looks
  right but is not.
- **Hand work at every level-up**, the reason approach 2 was rejected.
- **Network access.** All data ships with the plugin or comes from the private library notes.

## 5. Approaches

1. **The rules as data with a calculation engine — chosen.** Every class, subclass, species,
   background and feat is a data record that says what it grants per level (proficiencies, ability
   increases, resources with their recharge, spell slots and spell lists, AC formulas, speed,
   senses, choices with their option lists and how many to pick). A pure TypeScript engine turns a
   character's choices into the sheet. The options of each level come from the data, so "see all
   options and pick" works the same for every class, 2014 is a second data set, and every book's
   subclass is one more record. Cost: modelling and data before the first sheet.
2. **Sheet first, thin rules — rejected.** Level tables and core numbers only; what a feat or
   feature does mechanically is typed in as a manual bonus. A playable sheet sooner, but hand work
   at every level-up, and moving to approach 1 later would rewrite most of it.
3. **External data or plugins — ruled out.** No mature Obsidian character builder exists; online
   sources (5e-bits API) cover only the 2014 SRD and would need network access.

**Modelling boundary:** an effect is modelled when it changes a number or a list on the sheet
(scores, proficiencies, AC, HP, speed, senses, attacks, slots, resources, spells known). Everything
else is a feature with a name, a level and its text (SRD) or summary (books).

## 6. The character note

Plain frontmatter, written with `app.fileManager.processFrontMatter`; the body is the player's own
text (backstory, notes) and is never rewritten. The builder's own keys (names final in the plan):

```yaml
type: character
rules: '2024' # or '2014'
species: halfling # 2014 notes may say race:, read as species
background: entertainer
abilities: { str: 8, dex: 15, con: 14, int: 12, wis: 10, cha: 16 } # base scores, before bonuses
levels: # one entry per level, in order: the class taken and every choice made
  - { class: bard, hp: max, choices: { skills: [deception, performance, persuasion], … } }
  - { class: bard, hp: 5 }
  - { class: bard, hp: 5, choices: { subclass: bard/college-of-lore, … } }
  - …
inventory: […] # items with quantity, equipped, attuned
coins: { gp: 120, sp: 4 }
# play state
hp_current: 28
hp_temp: 0
spent: { slots: { 1: 1 }, bardic-inspiration: 1 }
conditions: []
death_saves: { success: 0, failure: 0 }
exhaustion: 0
# computed, written for the other modules and for reading without the plugin
class: bard
subclass: college of lore
level: 6
ac: 14
hp: 39
initiative: 3
passive_perception: 15
saves: { dex: 6, cha: 7 }
skills: { persuasion: 7, deception: 7, insight: 4, perception: 5 }
```

- The **choices** (`rules`, `species`, `background`, `abilities`, `levels`, `inventory`) are the
  truth; the **computed** keys are rewritten by the builder whenever the choices change, and a
  hand-written note without `levels` keeps working exactly as today (the sheet then shows its
  hand-written values and offers "convert to a built character").
- Manual extras: a `bonuses:` list (`{ to: ac, value: 1, why: Ring of Protection }`) for anything
  the engine does not model.

## 7. The engine and the data

- **A shared package** `packages/rules/` (pure TypeScript, no Obsidian API, no DOM, unit-tested in
  Node, as `packages/session`): the data model (class, subclass, species, background, feat, item,
  spell list records), `levelOptions(character, level)` (what the level grants and which choices
  it asks, with all allowed options), `validate(character)` (unmet prerequisites, missing choices)
  and `derive(character)` → the sheet model (every number in §3 goal 3, each with where it comes
  from, for a tooltip "+3 proficiency, +4 Charisma").
- **Data files** per rule set and book, generated like the catalogues (scripts in
  `scripts/catalogue/`, cleaning by agents from the maintainer's PDFs into the private work folder
  `dnd5e-library/work/`, then checked in as facts + summaries). SRD 5.2.1 and SRD 5.1 content
  (CC-BY-4.0) ships with its full text.
- **Spells** come from the existing SRD spells and the spell catalogue (K1/K3); class spell lists
  from the spells' `classes`.
- **Library notes** (private, in the maintainer's vault) add the full feature texts of the books,
  attached by key like the catalogues' library.

## 8. The views

- **The sheet** opens from a character note (a command, a button in the note's header, and from
  the party in the Dice and Battle tabs) as a view in the main area. Layout A; in a narrow pane or
  on a phone the ability column becomes a row of six boxes above the tabs. Style C throughout.
- **Create character**: a dialog in the style of the existing builders (steps as section heads,
  options as tiles and pills, the sheet as preview), writing a new note into a folder chosen in the
  settings (default: the party folder).
- **Level up**: from the Levels tab or a command; one screen per level showing what the level
  grants and each choice with **all its options** as tiles (name, summary, source book), filters
  for rule set and book, and the sheet's numbers before → after.
- **Battle tab:** a character in a fight reads and writes `hp_current`, `hp_temp`, conditions and
  death saves of its note (today the fight keeps them only in the encounter note).

## 9. Phases

Each phase: a short plan, tests first, screenshots, the maintainer's check in Obsidian.

| Phase | Content                                                                                                                                                   |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1    | `packages/rules` (model, `derive`), SRD 5.2.1 classes, species, backgrounds, feats, armour and weapons as data; the character note; the sheet (read-only) |
| C1b   | German SRD texts for everything C1 ships (official German SRD 5.2.1)                                                                                      |
| C2    | Create character (dialog)                                                                                                                                 |
| C3    | Level up, re-choose a level, multiclassing                                                                                                                |
| C4    | Play state: HP, slots, resources, rests, conditions, death saves; Battle tab reads and writes the note                                                    |
| C5    | Inventory tab and editing: the rest of the SRD equipment, SRD magic items (attunement), coins, manual bonuses                                             |
| C6    | 2024 books: PHB 2024 and Heroes of Faerûn subclasses, species, backgrounds, feats (facts + summaries; library notes)                                      |
| C7    | 2014: SRD 5.1 and the 2014 books (PHB, Xanathar's, Tasha's, …); "show 2014 too" for 2024 characters with the level mapping                                |

### Calls made after the builder check (the builder's, open to correction)

- **Armour and weapons in C1.** AC and attacks need them from the first sheet, and C2 picks
  starting equipment; so the SRD armour and weapon tables are part of C1's data. C5 is the
  inventory tab, magic items, coins and bonuses.
- **Hit points in a fight (C4).** Any character note (built or hand-written) gets `hp_current`,
  `hp_temp`, `conditions` and `death_saves` written by the Battle tab; the fight keeps its own copy
  as today and writes each change through to the note. A fight saved before C4 keeps its values
  until its next change, which then writes them to the note. A note without `hp_current` is at
  full hit points.
- **Books.** The books supplied: 2024 PHB 2024 and Heroes of Faerûn (read from page images, as in
  K3); 2014 PHB, Xanathar's, Tasha's, and Monsters of the Multiverse for species. Further books
  when the maintainer supplies them, one data file each.

## 10. Constraints

- Repository rules (CLAUDE.md): files first, readable without the plugin, `processFrontMatter`
  for every frontmatter write, no `innerHTML` with note content, events registered, mobile
  (`isDesktopOnly: false`), no default hotkeys, Obsidian CSS variables only, secondary text at
  least 16 px, English nomenclature (keys and values in English, German only in the UI).
- No book text in the repository, the example vault, fixtures, commits or logs.
- The example vault gets a built character (SRD content only) and a row in `Home.md`.
- `main.js` already carries 2 MB of data: the class data should load lazily if it grows large
  (open performance item on the roadmap).

## 11. Left to the builder

- Exact key names in the note and the shape of `choices`.
- The data model's internal structure (how a grant or a choice is encoded), as long as every
  choice of the SRD classes can be expressed.
- Which features of each class are modelled versus text (within the boundary of §5).
- The dialog's step order and the Levels tab's look, within style C.
