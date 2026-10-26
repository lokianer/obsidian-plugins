# Dice — design

Date: 2026-10-26. Status: **draft, waiting for the maintainer's review** (§9 lists the calls to check).
Module 7 of `dnd5e-byLokianer`, the last of the planned modules.

Asked for by the maintainer ("mach weiter" after the battle tracker and M2). Decided with them on
2026-10-26: dice in **a Dice tab**, **in notes** and **in stat blocks**; **formulas**, **rollable
tables** and **character rolls**; rolls reach the session log **like the battle log** (a setting:
offer each line / write automatically / off); results are **plainly animated**. Hidden GM rolls
were not chosen.

## 1. Goals

- **A Dice tab** (command **Open dice**, a ribbon icon), laid out like the other tabs:
  - a formula field (`2d6+3`, `4d6kh3`, `d20 adv`; German `2W6+3` works too) with a Roll button;
  - quick buttons d4 d6 d8 d10 d12 d20 d100, and advantage / disadvantage toggles for the d20;
  - the result large, the single dice as chips (kept and dropped ones told apart), a natural 20 or
    1 on a d20 in colour; the number runs briefly before it settles (none with reduced motion);
  - a history of this session's rolls (newest first, re-roll and log per row);
  - the campaign's rollable tables as a list (§4) and the party's rolls (§5).
- **Dice in notes**: inline code `dice: 2d6+3` — the syntax of the Dice Roller plugin, so notes keep
  working in both — shows as a button with the formula in Reading view and Live Preview; a click
  rolls and shows the result beside it (not written into the note). `dice: [[Street Rumours#Night
on Lantern Quay (d20)]]` rolls that table.
- **Dice in stat blocks**: in the plugin's stat block view (notes, Monster Manual, Battle tab) the
  attack bonus (`+7 to hit`), every damage expression (`10 (1d10 + 5)`), saves and skills are
  buttons; a click rolls (an attack with advantage on Shift, disadvantage on Alt) and names what
  was rolled ("Owlbear: Beak").
- **The session log**: each roll can be written under `## Log` of tonight's session, in the format
  the example vault already uses: `- 20:10 Orrin rolls Persuasion: d20+7 → 12 (5, +7)`. A setting
  **Dice log**: offer each line in a notice (default), write automatically, or off — as for the
  battle log.
- **German too**: everything in the tab and the buttons follows the plugin's language; the log
  lines stay English like the battle log.

## 2. Formulas

The engine is pure TypeScript, tested in Node, with a random source that tests replace.

| Written                         | Meaning                                                  |
| ------------------------------- | -------------------------------------------------------- |
| `d20`, `1d20`, `W20`, `1W20`    | one twenty-sided die                                     |
| `2d6+3`, `1d8+2d6-1`            | sums of dice and numbers; `*` and `/` (rounded down) too |
| `d%`, `d100`                    | percentile                                               |
| `4d6kh3`, `2d20kl1`, `4d6dl1`   | keep highest / keep lowest / drop lowest                 |
| `d20 adv`, `d20 dis`, `2d20kh1` | advantage / disadvantage                                 |
| `(2d6+3)*2`                     | brackets                                                 |

A result keeps every die rolled, which were kept, and the total; the text `d20+7 → 12 (5, +7)` is
built from it. Out of scope: exploding dice, rerolls, success counting (Dice Roller does these; a
formula we cannot read shows as plain inline code, untouched).

## 3. Files first

Nothing is written into a note except a log line in tonight's session (when the GM wants it). A
roll's result in a note is shown, not stored. The Dice tab's history lives in memory and is gone
when Obsidian closes; the log is the record.

## 4. Rollable tables (phase R2)

The convention of `examples/vault/Silverstadt/Tables/Street Rumours.md`:

- a heading that names a die (`## Weather on the estuary (1d8)`, `## Rumours (d6)`) makes the first
  list or table under it rollable;
- a **list** is numbered by its order (a d6 list has six items);
- a **table**'s first column holds the numbers or ranges (`1`, `2–4`, `5-6`); a roll that lands on
  a missing row (13–16 in "Night on Lantern Quay") is recorded as it fell, never silently re-rolled;
- notes with `type: table` in the campaign appear in the Dice tab; every rollable heading is a
  button; the result shows the row with its links working.
- Log line: `- 21:05 Rolled Night on Lantern Quay (d20): 11 → [[Sable]] on a rooftop, pretending
not to see you`.

## 5. Character rolls (phase R3)

The party's notes give their bonuses in frontmatter, readable without the plugin:

```yaml
saves: { dex: 5, wis: 2 }
skills: { persuasion: 7, perception: 4 }
```

(or a stat block in the note, whose saves and skills are used). The Dice tab lists the party with
their saves and skills as buttons; the Battle tab's card for a character gets the same buttons.
Log line as in the example vault: `- 20:10 Orrin rolls Persuasion: d20+7 → 12 (5, +7)`.

## 6. Non-goals

- 3D dice, sounds; exploding dice and the rest of Dice Roller's grammar (it remains the tool for
  that, and its `dice:` notes stay compatible).
- Hidden GM rolls (not chosen; can come later with the `[!gm]` callout the log already uses).
- Writing results into the note that holds the formula.
- No network.

## 7. Phases

1. **R1 — Dice engine, Dice tab, `dice:` in notes, log:** formulas (§2), the tab without tables
   and party, inline `dice:` formulas in Reading view and Live Preview, the Dice log setting.
2. **R2 — Rollable tables:** the table convention (§4), tables in the tab, `dice: [[Note#Heading]]`.
3. **R3 — Stat blocks and characters:** clickable attacks, damage, saves and skills in every stat
   block view; party saves and skills (§5) in the Dice tab and on the Battle tab's character cards.

## 8. Architecture

```
src/dice/formula.ts     pure: parse and roll formulas, the result's text
src/dice/tables.ts      pure: find rollable headings in a note, read lists and tables, pick a row
src/dice/statblock.ts   pure: find the rollable parts of a stat block entry
src/obsidian/dice-view.ts       the Dice tab
src/obsidian/dice-inline.ts     `dice:` in Reading view (post processor) and Live Preview (editor
                                extension)
```

The battle tracker's and the factions' log share `SessionLog.offerLine`.

## 9. Calls I made without the maintainer (check these)

- `dice:` inline code as the in-note syntax, compatible with Dice Roller; German `W` accepted in
  formulas but the tab writes `d` in log lines (English, like the battle log).
- Results in notes are shown, never written into the note.
- The Dice tab's history is not saved between Obsidian sessions; the session log is the record.
- In stat blocks, Shift-click rolls with advantage and Alt-click with disadvantage (on a phone: a
  long press offers both).
- Character bonuses as `saves:` and `skills:` in the character note's frontmatter (or its stat
  block).
- Three phases: engine, tab, notes and log first; tables second; stat blocks and characters last.
