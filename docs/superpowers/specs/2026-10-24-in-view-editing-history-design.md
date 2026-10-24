# In-view editing and history — design

Date: 2026-10-24. Status: **draft for the maintainer's review**. Module: factions, **phase 5**.

Builds on [`2026-10-24-factions-design.md`](2026-10-24-factions-design.md) §4.6 (history), §5.6
(editing in place) and §5.7 (history in the views), and on phases 2–4 (card, world, faction view).

Decided with the maintainer on 2026-10-24:

- after a change through the plugin, a **notice with "Log"** offers to write the history line —
  nothing is written without that click;
- matrix cells and arrows open a **small popover** with the slider, instead of leading into the card;
- when the newest session note lies in the past, the plugin **offers once** to create session N+1
  from the session template, dated today.

## 1. Intent

Changing how factions stand should be quick where the GM looks at them — in the matrix, on an
arrow — and should leave a trace in tonight's session note, so the campaign remembers when and why
the Order turned on the Court. The views then show that trace: each relation's last changes in its
tooltip.

## 2. Goals, non-goals, anti-goals

**Goals**

- A popover on a matrix cell or an arrow (graph and faction view): slider −5 … +5 with step name,
  the value's reason, **Reset to inherited** where the subject has an own value its faction would
  replace, and **Open card**.
- Writes always go to the **subject's own note** (the row, the arrow's tail): moving the slider on
  an inherited value creates an own value there (design §5.6). True mode writes `secret_relations`.
- After every change of a relation value through the plugin (popover or card), a notice "Logged?
  **Log → Session 14**" for a few seconds; a click appends one line under `## Log` of tonight's
  session note.
- Tonight's session = the session note (`type: session`) in the campaign with the highest
  `session:` number. If its `date:` lies before today, the first log of the day asks once: create
  Session 15 (from the session template, dated today, in the same folder) or keep writing to
  Session 14. The answer holds for the day.
- History: log lines are read back from all session notes; an arrow's or a cell's tooltip shows its
  last three changes ("−2 → −3 in S14"). Secret changes are logged inside a `> [!gm]` callout and
  shown only in True mode.
- "Tonight's session", log lines and history parsing live in a **shared package**
  `packages/session/` (pure TypeScript, no Obsidian), because dice, battle tracker and others will
  log to the same note (design §4.6).

**Non-goals**

- No time machine, domino preview or faction turn.
- No logging of values edited by hand in the YAML (the plugin does not watch keystrokes).
- No logging of `why`, name, power or other fields — relation values only.
- No new place for sliders inside notes (the card is that place).

**Anti-goals**

- A log line is written without the GM's click.
- A secret change appears outside a `[!gm]` callout, or its history shows in Public mode.
- A popover write lands in another note than the subject's own.
- The session note is re-serialised: the log line is a line insert like every other edit.

## 3. Constraints

Root `CLAUDE.md` in full. The package follows the layout of D19 (`packages/<name>/`, pure, unit-tested
in Node); `pnpm-workspace.yaml` gains `packages/*`. No new external dependency.

## 4. The popover

```
┌ The Bench → Order of the Lantern ───────────── ✕ ┐
│ ━━━━━━━━━━━━━━━━●━━━━━   +4  close               │
│ Reason: [ secretly bought by the Order       ]   │
│ inherited from The Gutter Court: −4 (public)     │
│ [ Reset to inherited ]            [ Open card ]  │
└──────────────────────────────────────────────────┘
```

- Opens at the clicked cell or arrow, inside the view, closes on ✕, Esc, a click outside, or opening
  another one. On phones it docks at the bottom of the view, full width.
- The title names subject and target and the mode (`· secret` in True mode).
- **Slider**: the current stance (own or inherited); releasing writes an own value to the subject's
  note in the mode's field (set when it exists, add when not). Same expect check and refusals as the
  card.
- **Reason**: the own entry's `why`, editable (Enter / blur writes); hidden while the value is only
  inherited.
- **Inherited line**: what the subject would have without its own value, and from whom.
- **Reset to inherited**: shown when the subject has an own value in this field; removes it (with
  the card's Undo notice).
- **Open card**: the phase 2 behaviour — the subject's note, card on that entry.
- Empty matrix cell: the popover starts without a value; the first slider move adds the entry.

## 5. Logging

### 5.1 The line

```
- 20:31 Order of the Lantern → The Gutter Court: −2 → −3
```

Time `HH:MM` (local), subject and target by name, old → new with a typographic minus; an added
value reads `— → +2`, a removed one `+2 → —` (removed own value; the inherited one applies again).
A secret change goes into a `[!gm]` callout of its own right after the list:

```
> [!gm]
> - 20:33 The Bench → Order of the Lantern: −4 → +4
```

### 5.2 Where

- Under the heading `## Log` of tonight's session note: after the last line of that section's
  content (list items and `[!gm]` callouts), before the next heading. No `## Log` → the heading and
  the line are appended at the end of the note.
- The notice names the target ("Log → Session 14"); every line written names nothing more — the
  note itself is the target.

### 5.3 Session N+1

- Offered on the first Log click of a day when tonight's note is dated before today.
- **Create Session 15**: the template (setting, default `Templates/Session.md`) with `{{date}}`
  replaced by today (`YYYY-MM-DD`), `{{session}}` by 15 and an empty `session:` filled with 15; file
  `Session 15.md` in the folder of Session 14; then the line is logged there.
- **Keep Session 14**: the line goes to Session 14; no more asking today.
- No template file → a minimal note (frontmatter `type: session`, `session`, `date`, `# Session
15`, `## Log`).

## 6. History

- Read from every session note in the campaign: list items under `## Log` (and inside `[!gm]`
  callouts there) that match `HH:MM A → B: x → y` with `-` or `−`, `—` for none.
- Names resolve like relation keys (phase 1 key lookup); lines naming unknown entities are ignored.
- Ordered by session number, then line order. Tooltips (graph arrows, matrix cells, faction view
  arrows) add up to three newest changes: `−2 → −3 in S14`. Secret entries only in True mode.
- Cached per session note, rebuilt when a session note changes.

## 7. Architecture

```
packages/session/src/tonight.ts    tonight's session from notes; needs-next; next note's text
packages/session/src/log.ts        format a log line; insert it under "## Log" (line edit)
packages/session/src/history.ts    parse log lines from a note's text
plugins/dnd5e-bylokianer/src/factions/history.ts   resolve parsed lines to entity pairs, per mode
plugins/dnd5e-bylokianer/src/obsidian/popover.ts   the value popover
plugins/dnd5e-bylokianer/src/obsidian/session-log.ts  notice, N+1 offer, writes, history cache
```

## 8. Calls I made without the maintainer (check these)

- Only relation values are logged (not reasons, names, power).
- The Log notice stays 6 seconds; after that the change is simply not logged.
- The day's N+1 answer is remembered in plugin data until midnight.
- New session file name `Session N.md` (the GM renames it with a title as usual).
- Removing an own value logs `x → —`, not the inherited value that applies again.
- Tooltips show the three newest changes; the full history waits for the "time machine" idea.
- The package `packages/session` is consumed by the plugin as a workspace dependency and bundled.
