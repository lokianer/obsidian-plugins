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

2026-10-25 and 2026-10-26, cloud. Built: the battle tracker (B1–B3, XP optional), German monster
texts (M2), the dice module (R1–R4), clearing battle and dice logs; a quality round, the READMEs and
the Pages site, the stylesheet per view, complexity steps 1, 4 and 5, a log button that wraps. The
maintainer then checked everything in Obsidian: **"es läuft alles" — all accepted on 2026-10-26.**
Last, asked for: **release 0.1.0 as a ZIP on GitHub** (`.github/workflows/release.yml`, tag
`dnd5e-bylokianer-0.1.0`).

## Where to continue

Everything that can still be done, in the order I would take it. Items marked _(needs a yes)_ wait
for the maintainer's go-ahead; the rest follow from what they already asked for.

1. **Release 0.1.0** — the Release workflow (`.github/workflows/release.yml`) was started by hand
   on `main` (a cloud session may not push tags: the proxy refuses them with 403); it runs
   `pnpm check`, builds, and publishes the release `dnd5e-bylokianer-0.1.0` with the ZIP and the
   three files, creating the tag. Next releases: raise the version in `manifest.json` and
   `versions.json`, move CHANGELOG's Unreleased into a new version section, then Actions →
   Release → Run workflow (or push the tag `dnd5e-bylokianer-<version>` from a local clone).
2. **Reducing complexity, steps 2 and 3** (asked for; steps 1, 4, 5 done). Measured with ESLint's
   `complexity` rule on 2026-10-26: 62 functions above 10 before step 1. Since step 5 the lint
   warns at complexity 20 and 150 lines per function; its eleven warnings are the list:
   - **Step 2:** tables instead of `if` chains — `fromSrdApi` (32), `fromTools`, `parseSpellJson`
     (29), `tokenize` (24), `readRow` (22), `fieldBlock` (26), `entries` (21). Tests first where
     the importers are thin.
   - **Step 3:** the big renderers in named parts — `renderStatblock` (199 lines), the Battle tab's
     `renderCard` (163), the popover's `render` (27), `drawPreview` (24), the stage's `finish`
     (22). Check views with the pixel comparison used for the stylesheet split.
   - Then make the two rules errors and tighten them (e.g. 15 and 100).
   - Done: step 1 (`findTensions` into four rules, `discoverEntities` into its steps), step 4
     (`src/obsidian/register/`, `main.ts` 42 lines, guarded by `test/ui/plugin.test.ts`), step 5
     (the lint limits).
3. **Start-up time** _(needs a yes)_: `main.js` is 2 MB (480 KB gzipped), about 80 % SRD data
   (monsters 520 KB, spells 393 KB, German texts about 700 KB), evaluated at every start, phones
   too. Data as JSON strings parsed on first use of a tab; measure before and after.
4. **Vault scans** _(needs a yes)_: `WorldCache` rebuilds the whole world 250 ms after any change;
   `OwnSpells` and `OwnMonsters` re-read every own spell / monster note on each `resolved`.
   Per-file caches, as CLAUDE.md asks; they matter for large vaults.
5. **Installing** _(needs a yes)_: the release ZIP is there now. Still possible: (A)
   `pnpm install-to "<vault>"`, generalising `scripts/install-example.mjs`; (C) BRAT and the
   Obsidian directory need the mirror repository with `manifest.json` at its root.
6. **Screenshots** for the Pages site, now that the check has passed: the encounter builder, the Monster
   Manual with German texts (the current one shows English traits), from real Obsidian.
7. **Dice, left out so far** _(needs a yes)_: hidden GM rolls (in a `[!gm]` callout; not chosen in
   the brainstorm), critical damage rolled by itself after a natural 20, ability checks for
   characters without a stat block (a frontmatter key), removing log lines from earlier sessions.
8. **Battle tracker, left out so far** _(needs a yes)_: a critical hit's two failed death saves,
   re-reading a fight the GM edits by hand while the tab is open.
9. **Daggerheart plugin** — asked for on 2026-10-26, **roadmap only, no code** ("Mache nur eine
   Roadmap, keinen Code"): `ROADMAP.md` "Daggerheart plugin" with the research (DPCGL, BeastVault's
   `daggerheart` block, DaggerForge, the tracker, SRD data sources), phases H0–H7 and the open
   questions. H0 needs a local session: darringtonpress.com and codeberg.org are blocked in the
   cloud. README and Pages show it as planned.
10. **New module: the GM gate** _(needs a yes, then brainstorm and spec)_: `[!gm]` callouts with
    `revealed:`, `%%comments%%`, which notes the players have met, a player export (roadmap "Not
    placed yet").
11. **Release preparation** _(needs a yes)_: Obsidian's plugin guidelines and submission checklist,
    the name against Wizards of the Coast's trademark rules, the release mirror repository, a
    versioning and release workflow.
12. **Housekeeping:** the private vault's daily reports and changelog for 2026-10-24 to 2026-10-26
    (a local session; a cloud session cannot reach the vault).

## State of the working tree

Branch `claude/roadmap-and-handoff-nb9sav`, pushed; `main` fast-forwarded to it after every slice, so
`git pull` on `main` brings everything. Clean. After pulling, run `pnpm build` once: `styles.css` is
build output now. `examples/vault/.obsidian/graph.json` may show as modified after opening the
vault: never commit it as part of a task. After trying session creation in the example vault,
delete `Silverstadt/Sessions/Session 15.md` and `git checkout examples/vault`.

## Done this session

- `0c2d266` German traits and actions for all 334 SRD monsters (M2).
- `ebb8f94`, `57259ef` Dice design and the clickable prototype of the stage; `5c9e37d` R1 (engine,
  stage, Dice tab, `dice:` in notes, log); `ab3d0a9` README section on what is taken and what only
  inspired; `9af709e` R2 (rollable tables); `0b5b67c` R3 (stat blocks and characters); `b6c668f`
  R4 (critical hits, ability checks).
- `9f2f57f` Quality round: no lookbehinds (iOS before 16.4) and a lint rule against them,
  death-save rules, indented table lists, `dice:` stays code in code blocks (`@codemirror/language`
  as an external dev dependency), encounter tiles on a phone.
- `998029b` READMEs and Pages site: sections and screenshots for the battle tracker and the dice.
- `5e8a63a` `styles.css` split into sixteen files under `styles/`, bundled by esbuild.
- `63a40ee` Reducing complexity, step 1: tension rules and faction discovery split.
- `2199eab` Reducing complexity, step 4: `main.ts` per module, `test/ui/plugin.test.ts`.
- `0eb45e8` Step 5: complexity and function length limits as lint warnings.
- `4f302b4` The log notice's button wraps (icon, **Log**, the session's name under it).
- `d2ef529` Clearing battle and dice logs (Battle and Dice tab ⋮ menus, two commands,
  `removeFromLog` in `packages/session`).
- Everything accepted in Obsidian; release 0.1.0 (workflow, CHANGELOG section, manifest
  description), committed with this handoff.
- Earlier, on 2026-10-25: the battle tracker B1–B3 and the optional XP (built, awaiting the check)
  — the commits before `0c2d266`.

## Half-finished — check in Obsidian

Nothing: the maintainer checked everything on 2026-10-26 ("es läuft alles"). The check points of
this session (20–21, 47–79) are in the git history of this file (`d2ef529`) if needed again.

## Decisions taken this session

In `plugins/dnd5e-bylokianer/DECISIONS.md`: "Loot carries over into the next session", "No non-SRD
monsters in the plugin; an import for the GM's own", "The battle tracker keeps the fight in the
encounter note", "The battle tracker logs moments, not blows; the line-up can change mid-fight", "The encounter
builder uses the SRD 5.2.1's XP budget", "Experience points are optional, off by default", "German monster texts by rule, template and
hand" (all 2026-10-25), "Dice: own engine, a stage like Baldur's Gate 3, Dice Roller's `dice:`
syntax", "Dice R2: rollable tables by a die in the heading", "Dice R3: rolls from stat blocks and characters", "Quality round …", "Dice R4: critical hits and ability checks", "The stylesheet in one file per view", "Reducing
complexity, step 1", "Reducing complexity, step 4", "Clearing battle and dice logs", "Release 0.1.0 as a ZIP on GitHub" (2026-10-26).
Smaller calls, in the commit bodies: single member chips stay inside their frame (only the frame and
boxes drag); label widths are estimated, not measured.

## Open questions for the maintainer

- The check in Obsidian (points 20–21, 47–76).
- A yes or no for the items marked _(needs a yes)_ under "Where to continue" (3–11), and the Daggerheart
  plugin's open questions in the roadmap.
- The "calls I made" sections of the phase 2–5 specs count as confirmed by the passing check, unless
  the maintainer wants something changed.

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
- Screenshots live in `plugins/<id>/screenshots/` (each plugin's README shows them); the Pages
  workflow copies them to `site/assets/<id>/`, which is git-ignored. To preview the page locally,
  copy them there first (`cp plugins/dnd5e-bylokianer/screenshots/* site/assets/dnd5e-bylokianer/`).
- Styles are edited in `plugins/dnd5e-bylokianer/styles/`; `styles.css` is built (`pnpm build`) and
  git-ignored. The screenshot harnesses link the built `styles.css`: build before rendering.
- The phone-width screenshot harness for the Battle tab, the Dice tab and the encounter builder
  lives in the scratchpad (`preview/tabs.ts`, `tabshot.cjs`, bundled with the UI test stub
  `test/ui/obsidian.ts` as `obsidian`); its page defines Obsidian's size variables, without them
  spacing looks wrong.
- The private vault's daily reports and changelog for 2026-10-24 and 2026-10-25 still need writing
  by a local session.

## Verification

`pnpm check` at the root: exit 0; 409 plugin tests and 15 package tests pass. CI green on Linux,
macOS and Windows for every push to `main` this session.
