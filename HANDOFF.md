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

2026-11-20, local. The maintainer asked for three things: a visual refactoring of the plugin ("mehr
wie D&D Beyond, moderner und übersichtlicher"), **all** official subclasses with a character
builder and a level-up database, and **all** spells and monsters. Agreed: the order visual
refactoring → catalogues → character builder; for the content, catalogues with our own summaries
in the plugin and full texts only by import (the repository is public). The visual refactoring was
brainstormed with mockups (style C chosen), designed, planned, and **V1 built**: the building
blocks and the stat block.

## Where to continue

1. **Check V1 in Obsidian** (the build is installed in `examples/vault`): open [[Isolde Ferrant]],
   [[Aldric Thane]], [[Mira Voss]] (stat blocks in notes, editing), the Monster Manual (Owlbear in
   German, Adult Red Dragon: rows with DC pills), the monster builder's preview, a monster in the
   Battle tab, the right sidebar (narrow). After "passt": tick V1 in the roadmap, retake the README
   screenshots `statblock*.webp` and `monsters.webp` in real Obsidian.
2. **V2 — Battle tab and encounter builder**: write its plan from the design (§3), reuse
   `split()`, `tiles()`, `pill()` from `src/obsidian/ui/blocks.ts`; the Battle tab's 700 px media
   query goes in favour of `dnd5e-split`. Then V3–V6, one at a time, each with the maintainer's
   check.
3. **Catalogues** (after V6): brainstorm → design → plan; agreed scope in the roadmap.
4. **Character builder with level-up database** (after the catalogues): brainstorm not started.
5. Older open items stay as in the roadmap's "Next steps" (code quality, start-up time, vault
   scans, distribution, Daggerheart, extensions).

## State of the working tree

Branch `visual-v1`, committed; `main` fast-forwarded to it and pushed (see `git log`). The
maintainer's own uncommitted changes in `examples/vault` (Session 14's log lines, faction values,
two monsters, Session 15) were left alone. They make 3 `packages/session` tests and 5 plugin tests
fail locally, because those tests read the example vault as their contract; with them stashed,
everything passes. Decide with the maintainer whether to keep them (then update the tests) or
revert them (`git checkout examples/vault` and delete the new files).

## Done this session

- Design `docs/superpowers/specs/2026-11-20-visual-refactoring-design.md` with the two mockups in
  `assets/`; plan `docs/superpowers/plans/2026-11-20-visual-v1-blocks-statblock.md`.
- V1: `src/obsidian/ui/blocks.ts` (tile with note, tiles, section head, pill, split) and their CSS
  in `styles/base.css`; `src/dice/action-row.ts` (attack, damage parts and saving throw DC of an
  entry, English and German); `partCheck` extracted in `statblock-dice.ts`; the stat block split
  into `statblock-parts.ts` and restyled in `styles/statblock.css`.
- DECISIONS "Visual refactoring: style C", CHANGELOG Unreleased, ROADMAP (visual refactoring,
  catalogues, character builder).

## Half-finished — check in Obsidian

V1, see "Where to continue" 1.

## Decisions taken this session

In `plugins/dnd5e-bylokianer/DECISIONS.md`: "Visual refactoring: style C". Agreed in the
conversation and recorded in the roadmap: the catalogue approach for all subclasses, spells and
monsters. Smaller calls in V1: short tile labels (AC/HP/Speed, RK/TP/Bew.); the score beside the
label and the modifier as the roll button without brackets; CR stays out of the meta line; with a
row the entry's name stands in the row only; the DC is a pill, not a button; one wrap point of
about 480 px (flex-wrap for list | details, a container query for the stat block).

## Open questions for the maintainer

- V1's check in Obsidian.
- The uncommitted example-vault changes: keep (tests updated) or revert.
- Small things the final review found, left for the check (decide after seeing them in Obsidian):
  a Spellcasting trait gets a row with its spell attack (`+6`) and its name leaves the text; German
  rows show `d` (`18d6`) while the text under them says `W`; row names show as plain text (a
  `[[link]]` in an entry's name would show its brackets); narrow blocks show the abilities as a
  grid of three, not a row of six as the plan said.

## Watch out

- Verify with `pnpm check`; never chain verification and commit with `;`. Clean up before every
  commit (CLAUDE.md).
- Obsidian's `createEl` / `createSvg`: an array `cls` goes to `classList.add`, so every entry must be
  a single token. The preview harness's DOM shim now behaves the same.
- Prettier is enforced (`pnpm format`; the `pre-commit` hook and CI refuse otherwise). It is not
  idempotent on inline code spanning two lines in Markdown — keep such spans on one line.
- The Write tool and shell heredocs can turn a backslash-u escape (the BOM) into the literal
  character; check with grep for the raw bytes after writing such code.
- In a fresh clone run `git config core.hooksPath .githooks`.
- TypeScript stays at 6.0.3 until typescript-eslint supports a newer version.
- `test/world.example.test.ts` and the session package's tests treat the example vault as the
  contract; notes broken on purpose live in `plugins/dnd5e-bylokianer/test/fixtures/vault`.
- `eslint-plugin-obsidianmd` forbids disabling its rules; settings implement both `display()` and
  `getSettingDefinitions()`.
- UI checks live in `test/ui/` (happy-dom). Add a test there for every new view; extend
  `test/ui/obsidian.ts` when a renderer imports more of `obsidian`. Screenshots still need a browser
  (Playwright is preinstalled in cloud sessions).
- No lookbehind in regular expressions (iOS before 16.4): the lint rule catches literals; write
  `new RegExp` strings without one too (match the character before instead).
- The Pages site has one page per plugin: `site/index.html` (overview), `site/<id>/index.html`
  (dnd5e-bylokianer, daggerheart); all share `site/style.css`. Sections fade in by scroll
  (`animation-timeline: view()`): render screenshots with reduced motion or they look empty.
- Screenshots live in `plugins/<id>/screenshots/` (each plugin's README shows them); the Pages
  workflow copies them to `site/assets/<id>/`, which is git-ignored. To preview the page locally,
  copy them there first (`cp plugins/dnd5e-bylokianer/screenshots/* site/assets/dnd5e-bylokianer/`).
- Styles are edited in `plugins/dnd5e-bylokianer/styles/`; `styles.css` is built (`pnpm build`) and
  git-ignored. The screenshot harnesses link the built `styles.css`: build before rendering.
- The phone-width screenshot harness for the Battle tab, the Dice tab and the encounter builder
  lives in the scratchpad (`preview/tabs.ts`, `tabshot.cjs`, bundled with the UI test stub
  `test/ui/obsidian.ts` as `obsidian`); its page defines Obsidian's size variables, without them
  spacing looks wrong.
- Python on Windows writes CRLF in text mode: open files with `newline=''` (or run `pnpm format`
  afterwards), else Prettier flags them.
- The stat block screenshot harness is in the session scratchpad only (`preview/statblocks.ts`,
  `page.html`, bundled with `node_modules/.bin/esbuild … --alias:obsidian=./test/ui/obsidian.ts
--alias:@p=. --alias:@v=../../examples/vault --loader:.md=text`, shot with headless Chrome
  `--screenshot`, a separate `--user-data-dir` per shot). Headless Chrome lays out narrow windows
  wider than asked: set the stage's width in the page instead (`&w=328`).
- `.impeccable/` (a design-hook cache) is git- and prettier-ignored.

## Verification

With the example vault as committed: plugin 422/422 tests, session 15/15; typecheck and build
clean; lint 0 errors, warnings only the known complexity list (now without `renderStatblock`) and
four sentence-case warnings in tests. Screenshots of Isolde Ferrant (900 px and 328 px), the
Owlbear in German and the Adult Red Dragon in the light theme checked: no horizontal overflow,
the ability column folds, text at least 16 px.
