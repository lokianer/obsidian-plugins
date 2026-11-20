# Visual refactoring — design

Date: 2026-11-20. Status: **builder check done; action rows decided (row and text); approved by the maintainer on 2026-11-20 ("go"); V1 built on 2026-11-20, awaiting the check in Obsidian**.
Applies to every view of `dnd5e-byLokianer`. The first of three projects asked for on 2026-11-20,
in this order: (1) this visual refactoring, (2) catalogues of all official spells, monsters and
subclasses, (3) a character builder with a level-up database. (2) and (3) get their own designs.

## 1. Intent

The maintainer asked for "ein visuelles Refactoring … mehr wie D&D Beyond, moderner und
übersichtlicher". The plugin today follows the 2026-10-24 decision "One quiet visual language,
close to Obsidian": plain rows, muted headings in normal case, no boxes inside boxes. It reads
like running text; key numbers (AC, HP, modifiers) do not stand out, and long stat blocks are hard
to scan at the table.

Three directions were shown as mockups (`assets/2026-11-20-visual-statblock-options.html`): A, D&D
Beyond with fixed red; B, the same with theme colours and tabs; C, a character-sheet layout in two
columns. **The maintainer chose C**, then approved C applied to the Battle tab, the faction card
and the list views (`assets/2026-11-20-visual-style-c-views.html`, "passt, mach so"). The
character builder (project 3) will be built in this language, which is why it comes first.

## 2. The visual language (style C)

- **Tiles** for key numbers: a filled rounded box (`--background-secondary`), the value large and
  bold, the label under it in capitals with letter spacing. Used for AC / HP / Speed in stat
  blocks; HP / Temp / AC / Initiative in the Battle tab; power / allies / enemies on the faction
  card; totals in builders.
- **Ability column**: the six abilities as a vertical stack of rows ("STR 18" left, "+4" right,
  large) beside the main content, with saves, senses and passive Perception under them — like
  D&D Beyond's character sheet. On narrow widths (container below ~480 px, and on phones) it
  becomes a row of six boxes above the content.
- **Section heads** in capitals with letter spacing, in the accent colour, with a thin rule
  (`--background-modifier-border`) under them: Actions, Traits, Reactions, Legendary actions,
  Relations, Conditions.
- **Action rows**: name | to-hit button | damage / DC button, zebra-striped with
  `--background-secondary`; the description wraps under the row. The dice buttons keep today's
  behaviour (click rolls, Shift advantage, Alt disadvantage). **Row and text** (maintainer's
  choice (a), 2026-11-20): for entries the plugin recognises as an attack or a save (to-hit,
  damage parts, DC, in English and German), the row shows those as buttons; the full description
  stays under it unchanged, with its inline dice buttons as today. Entries it does not recognise
  (Multiattack, traits, unusual wording) show the name and the text only. Nothing is removed from
  the text.
- **Pills** for conditions, filters and tags: rounded, `--background-modifier-hover` behind,
  active ones tinted with the accent.
- **Lists left, details right** wherever a view has a list (Battle, Monster Manual, Spellbook,
  Deck history): the selected row tinted with the accent, a CR / level badge at the row's end.
- **Buttons**: primary actions tinted with the accent, destructive ones (Damage, End fight,
  Delete) tinted red, the rest neutral.
- **Colours only from Obsidian's variables** (unchanged rule): the accent is
  `--interactive-accent` / `--text-accent`, red `--color-red`, green `--color-green`. Tints use
  `color-mix` on these. Contrast at least WCAG AA on the default dark and light themes.
- **Text sizes** (CLAUDE.md, unchanged): body and secondary text at least 16 px, tile labels
  included. Tiles are therefore taller than in the mockup. No small italic text.
- **Dark theme first**, checked in light too.

Superseded: the 2026-10-24 rules "no boxes inside boxes" and "sections as muted headings in normal
case". Kept: values as a soft tint behind normal text (relation values, CR badges), hover rows
with icon buttons, Obsidian's own components (slider, `clickable-icon`, view header actions).

## 3. How it is built (approach A, chosen)

Shared building blocks first, then one view per phase, each checked in Obsidian.

- **Building blocks** in `styles/base.css` as classes with a `dnd5e-` prefix: `dnd5e-tile`,
  `dnd5e-tiles`, `dnd5e-abilities`, `dnd5e-section-head`, `dnd5e-action-row`, `dnd5e-pill`,
  `dnd5e-list-row`, `dnd5e-split` (list | details), `dnd5e-button` variants. Plus small DOM
  helpers in `src/obsidian/ui/` (pure `createEl` builders such as `tile(parent, value, label)`,
  `sectionHead(parent, text)`) so every view builds them the same way.
- **Renderers change where CSS cannot do it.** The stat block needs a new structure (tiles, the
  ability column, action rows); this is done by splitting `renderStatblock` into named parts
  (header, tiles, abilities, details, sections), which also completes step 3 of the roadmap's
  code quality list for the stat block. Likewise the Battle tab's `renderCard`.
- **Nothing in notes changes.** No frontmatter, file format or command changes; only the DOM and
  CSS of views. Fantasy Statblocks compatibility is untouched.

### Phases

| Phase | Views                                                                                    |
| ----- | ---------------------------------------------------------------------------------------- |
| V1    | Building blocks + the stat block (notes, Monster Manual detail, NPC preview, Battle tab) |
| V2    | Battle tab (initiative list, combatant card, conditions) and the encounter builder       |
| V3    | Faction card, faction world (faction view, matrix), tensions, value popover, warnings    |
| V4    | Monster Manual and Spellbook lists, spell card                                           |
| V5    | Dice tab and Deck of Many Things (the dice stage itself stays as it is)                  |
| V6    | Builders and dialogs: New NPC, spell builder, monster builder, deck builder              |

Each phase: a short plan, the change, `pnpm check`, before/after screenshots at tab and phone
width (the existing harness in `test/ui/` and the scratchpad screenshot tooling), then the
maintainer's check in Obsidian before the next phase starts.

## 4. Goals, non-goals, anti-goals

- **Goals:** key numbers visible at a glance; one consistent look across all seven modules;
  readable on a phone; every theme still works.
- **Non-goals:** new features, new data, changes to notes or settings; the dice stage's
  animation (built and accepted as it is); Obsidian's own Properties panel.
- **Anti-goals:** a fixed D&D Beyond red or any colour outside Obsidian's variables; copying D&D
  Beyond's artwork, icons or exact layout; text smaller than 16 px; a view that breaks a
  community theme; anything that breaks reading a note without the plugin.

## 5. Constraints

- CLAUDE.md principles: `createEl` only (no `innerHTML`), Obsidian variables only, mobile
  (`isDesktopOnly: false`), no default hotkeys, English code, English and German UI.
- Existing UI tests in `test/ui/views.test.ts` must keep passing; class names they rely on may be
  renamed only together with the tests.
- Lint limits (complexity 20, 150 lines per function) must hold for every changed renderer.

## 6. Calls made while writing this up (to be confirmed by the maintainer)

- **Editing and rolling stay as they are.** Everything editable today (name, AC / HP / Speed
  lines, ability scores) stays click-to-edit in the new tiles and the ability column; every
  modifier in the ability column rolls a check (Shift advantage, Alt disadvantage); saves and
  skills stay roll buttons; an action row's add / edit / remove tools appear on hover (always on
  phones), as rows do today.
- **One fold point.** `dnd5e-split` and the ability column both fold to one column below the same
  container width (a container query, about 480 px; the builder may tune the number). It replaces
  today's per-view fold points (700 px media query in `battle.css`, 640 px container query in
  `spellbook.css`), so views in the right sidebar, the Battle tab's details pane and the NPC
  preview behave alike.
- **The Deck history stays a plain list.** It has nothing to show as details; a details pane
  would be a new feature.
- **No release per phase.** Each phase is committed to `main` with its CHANGELOG lines under
  Unreleased; a release (0.2.0) only after V6 and the maintainer's go-ahead, so no published
  version is half restyled.

## 7. Left to the builder

- Exact spacing, radii and the container width at which the ability column folds.
- Which existing classes are renamed versus kept with new rules.
- Icons (Lucide, as today) for tiles and section heads, if any.
