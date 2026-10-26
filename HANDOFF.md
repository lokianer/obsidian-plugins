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

2026-10-25 and 2026-10-26, cloud. Built without a check in Obsidian yet (the maintainer: "Mach
weiter, ich teste später"): the battle tracker (B1–B3, XP optional), German monster texts (M2), the
dice module (R1–R4). Asked for along the way: a quality round (review since B1 and its fixes), the
READMEs and the Pages site, the stylesheet split into one file per view, a complexity analysis —
and step 1 of reducing complexity. The maintainer then asked for this handoff.

## Where to continue

0. **The maintainer's check in Obsidian** of everything built since 2026-10-25: points 20–21 and
   47–76 below. Fix what it turns up first.
1. **Reducing complexity** — asked for ("wie reduzieren wir die Komplexität", "starte mit 1").
   Measured with ESLint's `complexity` rule (cyclomatic complexity per function; data files not
   counted) on 2026-10-26, before step 1: 108 source files, 62 functions above 10, the worst
   `findTensions` 36, `discoverEntities` 33, `fromSrdApi` 32, `parseSpellJson` 29, popover
   `render` 27, `fieldBlock` 26, `tokenize` 24, `drawPreview` 24; 18 functions above 80 lines,
   `onload` in `main.ts` 587. Reproduce with
   `pnpm exec eslint src --rule '{"complexity":["warn",10]}'` in the plugin folder.
   - **Step 1 done:** split by rule or step — `findTensions` into its four rules (`oneSided`,
     `outOfLine`, `publicTrue`, `splitAllies`, run from a `RULES` list), `discoverEntities` into
     `factionCandidates`, `factionNotesOf`, `factionEntity`, `characterEntity`. Highest complexity
     now 32 (`fromSrdApi`); the two are at 12 and below, behaviour and warning order unchanged
     (all tests pass unchanged).
   - **Step 2:** tables instead of `if` chains in the importers (`fromSrdApi`, `fromTools`,
     `parseSpellJson`: a field map "source → target + conversion") and in `tokenize`. Add tests
     first where the importers are thin.
   - **Step 3:** split the big renderers into named parts: `renderStatblock` (head, lines,
     abilities, sections), the Battle tab's `renderCard`, the popover's `render`. Check with the
     screenshot comparison (pixel-identical) as for the stylesheet split.
   - **Step 4:** `onload` in `main.ts` into one `register…(plugin, ctx)` per module under
     `src/obsidian/register/`.
   - **Step 5:** `complexity` (warn at 20) and `max-lines-per-function` (warn at 150) in the
     plugin's ESLint config; tighten after the steps.
2. **Also proposed, not started** (the maintainer has not said yes yet):
   - Start-up time: `main.js` is 2 MB (480 KB gzipped), about 80 % SRD data (monsters 520 KB,
     spells 393 KB, German texts about 700 KB), all evaluated at every start, phones too. Data as
     JSON strings parsed on first use of a tab; measure before and after.
   - Vault scans: `WorldCache` rebuilds the whole world 250 ms after any change; `OwnSpells` and
     `OwnMonsters` re-read every `type: spell` / `type: monster` note on each `resolved`. Per-file
     caches, as CLAUDE.md asks, matter only for large vaults.
   - An installer for this plugin alone: (A) `pnpm install-to "<vault>"`, generalising
     `scripts/install-example.mjs`; (B) a ZIP of `main.js`, `manifest.json`, `styles.css` as a CI
     artifact; (C) BRAT would need a GitHub release and the mirror repository — a publication,
     which the maintainer decided against on 2026-10-25, so only on their explicit choice.
3. Module 7 was the last planned module. The GM gate ("Not placed yet" in the roadmap) and the
   release preparation stay the maintainer's call.

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
- Reducing complexity, step 1 (see "Where to continue"), committed with this handoff.
- Earlier, on 2026-10-25: the battle tracker B1–B3 and the optional XP (built, awaiting the check)
  — the commits before `0c2d266`.

## Half-finished — check in Obsidian

Rebuild and install (`pnpm --filter dnd5e-bylokianer build`, then `… install-example`), reload.

**Faction world redesign** (asked for 2026-10-25)

20. Graph: coloured discs with initials, names on pills, dot grid that moves with pan/zoom; hover
    The Gutter Court → its arrows and neighbours stay, the rest fades, values show on the arrows;
    zoom +/−/fit buttons top right, colour scale at the bottom; Party and Unaffiliated as cards.
    Check a light theme and one community theme too.
21. Matrix: card with colour dots and initials, hovering a cell colours its row and column names;
    self cells hatched; the faction view (drill-down) keeps working with the dot grid.

**Battle tracker B1**

47. The swords in the ribbon (or **Open battle tracker**) open the tab on "Ambush under the second
    arch": the lineup lists the four party members (once each, though the note links them too),
    Sable (AC 15, HP 40 from her frontmatter), Court thug ×4, Court sharpshooter ×2, Bridge rat ×3.
48. **Start**: the thugs share one number, so do the sharpshooters and the rats ("Bridge rat 1 …
    3"); the characters have empty fields — type them or use the dice; the arrows nudge ties.
    `## Combat` appears in the note with "Rolling initiative".
49. **Begin round 1**, **Next turn**: the marked row moves, the round counts up after the last; the
    arrow goes back. Pick a row: its card with HP, temp, AC, initiative; a rat's card shows the
    Giant Rat stat block named "Bridge rat 2" (German Obsidian: German header lines).
50. Damage a thug to 0 → dimmed, "Defeated", skipped by Next turn. Damage a character to 0 → "Down",
    death save buttons; ✗ shows on the row; Heal brings them back. Temp HP 5 then damage 7 → 2 off
    the hit points.
51. Duration 1 + Prone on the active combatant → "Prone (1)", gone after its turn ends.
    Concentration on Sable, damage 24 → notice "Constitution save, DC 12".
52. Close and reopen the tab: the fight is back from the note. `git diff` shows only the
    `## Combat` section (and Sable's line). **End combat** → "Ended after N rounds"; **Start again**
    replaces it. Revert the example vault afterwards (`git checkout examples/vault`).

**Battle tracker B2**

53. With a session note for tonight (`Silverstadt/Sessions/`): **Begin round 1** → a notice "Combat
    begins: [[Ambush under the second arch]]" with **Log → Session 14/15**; click → the line under
    `## Log`. Defeat a thug → "Round N: Court thug 1 defeated"; a character to 0 → "… is down";
    three failed saves → "… dies"; **End combat** → "Combat ends after N rounds — 75 XP" with the
    three Bridge rats defeated (CR 1/8, 25 XP each; inline thugs carry no XP).
54. Settings → **Battle log**: Write them automatically → the lines appear without a notice; Off →
    nothing.
55. While the fight runs: type "Owlbear" (or "Eulenbär") under the order, **Add** → "Owlbear joins
    the fight", its card opens with the stat block; again → "Owlbear 2" with the same initiative.
    "Bell ringer" without HP → a notice; with HP 9 and AC 10 → it joins. **Remove from fight** on
    its card → gone, its turn passes on.
56. Monster Manual → a monster → **Add to combat**: it joins the open tab's fight; with no fight
    running → "No fight is running …". Close and reopen the tab: the added monsters keep their stat
    blocks.

**Monster Manual M2 — German texts**

61. German Obsidian, Monster Manual → Eulenbär: "Scharfe Sicht und scharfer Geruchssinn", Aktionen
    "Mehrfachangriff", "Schnabel: Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, eine
    Kreatur. Treffer: 10 (1W10 + 5) Stichschaden." EN / DE switches the texts too. Spot-read a
    few more for wording (a dragon's Furchterregende Präsenz and Odem, the Lich's Zauberwirken,
    the Vampir); corrections go into `src/monsters/de-texts/`.
62. Lich, Erzmagier: the German spell names in Zauberwirken are links that open the spellbook.
63. Battle tab with German Obsidian: a Bridge rat's card shows "Scharfer Geruchssinn". New monster
    → pick Eulenbär: name and action rows in German, size still "Groß" (stored "Large").

**Dice R1**

64. The dice icon in the ribbon (or **Open dice**) opens the tab: formula, DC, Roll, d4–d100,
    Normal / Advantage / Disadvantage, the stage with a d20, "No rolls yet".
65. `d20+7`, DC 15, Advantage, **Roll**: two d20 tumble in the ring, land, the lower greys, "+7"
    flies in, the total counts up, Success (gold) or Failure (red); click during the tumble skips.
    Roll until a natural 20: Critical success with golden rays. German: Erfolg / Fehlschlag.
66. `8d6`, `4d6kh3`, `d%`, `d4+d6+d8+d10+d12+d20`, `20d6`: every die in its shape, dropped dice
    grey, d% as two d10, 20d6 as twelve dice and a "8 more dice" line — nothing overlaps, also in
    a narrow sidebar and on the phone.
67. [[Dice in notes]] in Reading view and Live Preview: every formula a button (the source shows
    when the cursor is in it); a click plays the stage in a small window, `= total` beside it;
    `1d6!` and the block reference stay code (the table links: point 71).
68. Settings: Dice log (ask → a notice "Rolled … → Log → Session N"; automatic; off), Dice
    animation (result at once; no stage). Reduced motion in the system shows the result at once.

**Dice R2**

69. Dice tab → Tables: Street Rumours with three buttons (Rumours on Lantern Quay (d6), Weather on
    the estuary (1d8), Night on Lantern Quay (d20)); a click plays the stage with the heading on
    top and the row under the total; the row's link (Sable, Lantern Bridge) opens its note. Edit
    the note, press the refresh button: the change shows.
70. Night on Lantern Quay until a 13–16: "no row" on the stage and in the list, the log offers
    `Rolled Night on Lantern Quay (d20): 14 → no row`; an 11 logs `… → [[Sable]] on a rooftop, …`.
71. [[Dice in notes]]: the two table links are buttons with the heading (or "Street Rumours");
    a click plays the stage and writes `11 → Sable on a rooftop…` beside the button; the
    `#Markets (d6)` link shows a notice; the block reference stays code. Live Preview too.

**Dice R3**

72. Monster Manual → Owlbear (and the Battle tab's owlbear card, and a note's stat block): `+7`,
    `10 (1d10 + 5)`, `14 (2d8 + 5)` and Perception +3 are buttons; a click plays the stage in a
    small window ("Owlbear: Beak", damage "Owlbear: Beak · damage"); Shift → two d20, the higher
    kept; Alt → the lower; right-click (or a long press on the phone) → Normal / Advantage /
    Disadvantage. DCs ("DC 11 Constitution") stay text. German Obsidian: "+7 auf Treffer" and
    "10 (1W10 + 5)" work the same.
73. Dice tab → Party: Dagny, Ilex, Orrin Quill with their saves and skills, Tessaly Vane with "No
    saves or skills …"; Orrin's Persuasion +7 with the tab's Advantage and DC 15 → verdict; the
    log offers `Orrin Quill rolls Persuasion: 2d20kh1+7 → … against DC 15: success`.
74. Battle tab, Dagny's card: Strength save +7, Constitution save +6, Athletics +7 …; a roll from
    a stat block shows up in the Dice tab's list. Dice animation off: a notice with the result.

**Dice R4**

75. Owlbear's stat block: Shift-click on `10 (1d10 + 5)` → the stage with two d10 and "+5", label
    "Owlbear: Beak · damage · critical"; right-click → Normal / Critical hit. Log:
    `Owlbear rolls Beak damage (critical): 2d10+5 → …`.
76. The modifiers beside the scores (`(+5)`, `(+1)` …) roll the ability checks ("Eulenbär:
    Stärkewurf" in German); in a note's stat block a click on the score still edits it.

**Battle tracker B3**

57. **New encounter** (command, or + in the Battle tab header): chips Dagny · 6, Ilex · 6, Orrin
    Quill · 6, Tessaly Vane · 6, all on; tiles Low 2,400 XP, Moderate 4,000 XP (chosen), High
    5,600 XP. German Obsidian: "EP", "Niedrig / Mittel / Hoch".
58. Search "owl" → Owlbear twice: the row counts 2, the preview "1,400 XP of 4,000 XP (Moderate)",
    "2,600 XP left", "Low difficulty". Chips off lower the budget; − and + change the count; a
    count of 0 removes the row. No name → a notice.
59. Create encounter: `Silverstadt/Encounters/<name>.md` with `type: encounter`, `difficulty`,
    `location` (if given), `combatants: - monster: Owlbear / count: 2`; the Battle tab opens on it
    and Start runs it.
    60a. Settings → **Experience points** is off at first: the builder's tiles read "Victory, maybe a
    scare or two" / "Could go badly" / "Could be lethal", the preview "70 % of the Moderate
    budget", no XP anywhere; the log's end line has no XP. Switched on: points 57–58 as written.
60. Monster Manual → a monster → **Add to encounter** → pick the ambush: `- monster: <name>` at the
    end of its `combatants`; again → `count: 2`. Revert the example vault afterwards.

## Decisions taken this session

In `plugins/dnd5e-bylokianer/DECISIONS.md`: "Loot carries over into the next session", "No non-SRD
monsters in the plugin; an import for the GM's own", "The battle tracker keeps the fight in the
encounter note", "The battle tracker logs moments, not blows; the line-up can change mid-fight", "The encounter
builder uses the SRD 5.2.1's XP budget", "Experience points are optional, off by default", "German monster texts by rule, template and
hand" (all 2026-10-25), "Dice: own engine, a stage like Baldur's Gate 3, Dice Roller's `dice:`
syntax", "Dice R2: rollable tables by a die in the heading", "Dice R3: rolls from stat blocks and characters", "Quality round …", "Dice R4: critical hits and ability checks", "The stylesheet in one file per view", "Reducing
complexity, step 1" (2026-10-26).
Smaller calls, in the commit bodies: single member chips stay inside their frame (only the frame and
boxes drag); label widths are estimated, not measured.

## Open questions for the maintainer

- The check in Obsidian (points 20–21, 47–76).
- Go-ahead for the proposals under "Where to continue" 2 (start-up time, vault scans, installer A/B)
  and for complexity steps 2–5.
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
- Styles are edited in `plugins/dnd5e-bylokianer/styles/`; `styles.css` is built (`pnpm build`) and
  git-ignored. The screenshot harnesses link the built `styles.css`: build before rendering.
- The phone-width screenshot harness for the Battle tab, the Dice tab and the encounter builder
  lives in the scratchpad (`preview/tabs.ts`, `tabshot.cjs`, bundled with the UI test stub
  `test/ui/obsidian.ts` as `obsidian`); its page defines Obsidian's size variables, without them
  spacing looks wrong.
- The private vault's daily reports and changelog for 2026-10-24 and 2026-10-25 still need writing
  by a local session.

## Verification

`pnpm check` at the root: exit 0; 404 plugin tests and 14 package tests pass. CI green on Linux,
macOS and Windows for every push to `main` this session.
