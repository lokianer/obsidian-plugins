# Faction editor — design

Date: 2026-10-24. Status: **approved direction**, revised the same day. Module: factions, new
**phase 2** (the maintainer chose the editor before the world view; world view → phase 3, faction
view and tension panel → 4, in-view sliders and history → 5).

Builds on [`2026-10-24-factions-design.md`](2026-10-24-factions-design.md) — its conventions (§4), the
line-edit rule (§5.6) and the Public/True rule (§5.4) apply unchanged.

**Revision 2026-10-24 (maintainer):** "The frontmatter must, unlike in ordinary Markdown files, be
specially editable and rendered better and more beautifully." Decided with two follow-up answers:

- a **faction card** at the top of faction and character notes, in Reading view and Live Preview,
  **replaces Obsidian's Properties block** for those notes (a setting can bring Properties back);
- **the card is the editor** — no separate form modal. The command and the Fix button open the note
  and jump to the entry in the card.

Source mode keeps showing the raw YAML; the YAML stays the truth.

## 1. Intent

A faction or character note opens with its data shown as what it means, not as YAML: the kind and
place in the campaign, power as pips, every relation as a coloured row with its step name and
reason — and every value editable right there. A change writes the few characters that changed in
the note's frontmatter and nothing else, so comments, order and formatting of the YAML survive.

## 2. Goals, non-goals, anti-goals

**Goals**

- The card on every faction note and character note inside the campaign, in Reading view and Live
  Preview, on desktop and tablet.
- Relations as rows: target, a −5 … +5 slider coloured red–yellow–green with number and step name,
  an optional `why`, remove; "+ Add relation". Secret relations in their own section, closed.
- Name and power (factions), every other top-level field shown; simple ones editable.
- Every row with a data problem shows it; the warnings modal gets a **Fix** button per row that an
  edit can repair.
- Each change is one line edit through `app.vault.process`, refused with a notice where the line
  cannot be placed with certainty or the value changed underneath.

**Non-goals (this phase)**

- No graph, matrix, faction view. No inherited values in the card (the faction view, phase 4, shows
  inherited versus own; the card shows what _this_ note says).
- No history log line, no "tonight's session" — phase 5, reusing this line editor.
- No step-name settings — the world view (phase 3) brings them; the card uses the design's defaults.
- No renaming or moving notes and folders (`duplicate-name`, `duplicate-faction-note`,
  `campaign-ignored` stay manual).
- No editing of lists and maps other than the two relation maps (`tags`, nested custom maps): shown,
  with **Edit in source**.

**Anti-goals — it fails even if it works when**

- a change touches a line the GM did not change (a comment, the key order, the quoting of an
  untouched value);
- a change lands on a different entry than the one on screen, or overwrites a value edited
  elsewhere in the meantime;
- secret relations are on screen without the GM asking for them;
- the card flickers, jumps or loses focus while the GM types in the note below it;
- a note that is not a faction or character note looks any different.

## 3. Constraints

Root `CLAUDE.md` in full: `isDesktopOnly: false`, no `innerHTML` (the `why` is rendered with
Obsidian's `MarkdownRenderer`), Obsidian CSS variables only, secondary text ≥ 16 px, no small
italics, dark theme first, English and German UI, no default hotkey, every listener through
`registerEvent` / `registerDomEvent`, derived state cached and invalidated on `metadataCache`
changes. No new runtime dependency; the line editor is our own code.

## 4. The card

### 4.1 Where it appears

On a Markdown view whose file is a faction note or a character note of the campaign (phase 1's
discovery decides), in Reading view and Live Preview, at the top of the note's scrolling content —
where Obsidian's Properties block sits, below the inline title. Source mode shows the raw YAML and
no card.

Obsidian's Properties block is hidden on exactly these views (a CSS class on the view, nothing
global). Setting **Show Obsidian's properties on faction notes** (off by default) shows both.

A note that stops being a faction or character note (its `type` changed, it moved out of the
campaign) loses the card on the next metadata change; a note that becomes one gains it.

### 4.2 Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ ⚑ FACTION · The Gutter Court › The Bench          ●●●○○  power 3 │
│ The Bench                                         ⚠ 1 warning    │
├──────────────────────────────────────────────────────────────────┤
│ RELATIONS                                                        │
│ Order of the Lantern  ━━━━━━━━━━━━●━━━━━  −4 feud                │
│ The Archivists        ━━━━━━━━━━━━━━━●━━  −1 wary  · [[Mira Voss]] │
│ + Add relation                                                   │
├──────────────────────────────────────────────────────────────────┤
│ ▸ SECRET RELATIONS · 1                                           │
├──────────────────────────────────────────────────────────────────┤
│ ▸ OTHER FIELDS · type faction · tags 2                           │
└──────────────────────────────────────────────────────────────────┘
```

- **Header.** Kind chip (Faction / Character), place (parent chain, or _Party_ / _Unaffiliated_),
  the name (factions: `name:`, else the folder name, editable in place; characters: the file name,
  not editable here), power as five pips (factions only; click a pip to set it), a warnings count
  that scrolls to the first row with a warning.
- **Relations.** One row per entry _as the note writes it_, broken ones included (§4.3). The target
  is a link to its note (click opens, Ctrl/Cmd-click in a new tab); a dangling target is shown as
  plain text with an "unknown" tag.
- **Secret relations.** Header "Secret relations · n", **closed every time the card is built** (a note
  opened, a view switched). It opens on click, or by itself when Fix points into it. Its rows carry
  the "secret" tag of the warnings modal.
- **Other fields.** Closed by default, the header lists them in short (`type faction · tags 2`).
  Open: every other top-level key; single-line scalars editable, lists and maps shown as chips or a
  summary with **Edit in source** (switches the view to source mode at that line).

Colours: each value's colour is a `color-mix()` between `--color-red`, `--color-yellow` and
`--color-green` (design §4.5); the slider track and the number chip use it; the number and the step
name are always written out, so colour is never the only carrier. Rows wrap below 480 px: target and
value on one line, why on the next. Text 16 px; the card uses `--background-secondary`,
`--radius-m` and the theme's border colour, so it looks native in every theme.

### 4.3 Rows and editing

Each relation row:

- **Target** — click the name to change it: a text field with suggestions from the campaign's
  factions (name, then folder name if different) and characters, each with kind and folder so two
  "Watch" factions are told apart; the note's own entity and the pseudo-factions are not offered. A
  name nothing has is allowed (marked "unknown").
- **Value** — a slider −5 … +5. Dragging updates number, step name and colour live; **releasing writes**.
  Keyboard: arrows move one step and write on each step (debounced 400 ms). A row whose value is not a
  number shows the text as written, struck through, and the slider without a thumb until set.
- **Why** — shown as rendered Markdown (a wikilink is clickable). Click the pencil to edit as text;
  Enter or leaving the field writes; Esc cancels. Adding a why to a plain entry turns it into the
  structured form; clearing it removes the `why:` line.
- **Remove** — a × at the row's end, with an undo notice for 5 s ("Removed The Archivists · Undo").
- A row with a warning carries the warning's icon and message, as in the warnings modal.

**+ Add relation** opens a new row with the target field focused; it is written once a target is
picked, with value 0 until the slider moves (an entry `Name: 0` is a valid, neutral relation).

Name, power and scalar fields: click to edit, Enter or blur writes, Esc cancels.

### 4.4 Writing

Every edit is **one operation, one `app.vault.process` call**:

1. The operation names its target (field, raw key) and the value the card showed (`expect`).
2. Inside `process`, the line editor locates the target in the current text. If the entry is gone or
   its value differs from `expect` — the note was edited elsewhere — nothing is written, the notice
   says "The note changed — the card shows the current values now", and the card rebuilds.
3. If the line cannot be placed (§5.2), nothing is written; the notice says which entry and why and
   offers **Edit in source**.
4. Otherwise the edited text is returned; the card shows the new value at once (optimistic) and
   rebuilds from the metadata cache when Obsidian has re-read the note.

While the GM types in the note body, the card rebuilds only when the frontmatter itself changed
(compared by value), and never while one of its own fields has focus.

### 4.5 Fix and the command

- The warnings modal gets a **Fix** button (wrench) per row for the codes in the table below. It
  closes the modal, opens the note (in the current leaf; Ctrl/Cmd in a new one), switches a source
  view to Live Preview, opens the section and focuses the target.
- Command **Edit faction data** (`edit-faction-data`): on the active note, scrolls to the card and
  focuses its first field; in source mode it switches to Live Preview first. On any other note:
  notice "This note is not a faction or a character of the campaign".

| Warning                                                                              | Fix focuses                                                           |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `value-out-of-range`, `value-not-integer`                                            | the row's slider, at the value read; a button "Write 5" confirms it   |
| `value-not-a-number`, `structured-without-value`                                     | the row's slider, without a value                                     |
| `unknown-target`                                                                     | the row's target field, suggestions open                              |
| `self-relation`, `duplicate-key`                                                     | the row, its × highlighted                                            |
| `ambiguous-key`                                                                      | the row's target field; the hint says a key cannot name the character |
| `power-out-of-range`, `power-not-a-number`, `power-not-integer`                      | the power pips; "Write 5" confirms the value read                     |
| `missing-type`                                                                       | Other fields, the `type` field, a button "Set type: faction"          |
| `relations-not-a-map`                                                                | the section, read-only, **Edit in source**                            |
| `duplicate-name`, `duplicate-faction-note`, `campaign-ignored`, `broken-frontmatter` | no Fix — the note link is the way                                     |

## 5. The line editor

### 5.1 Operations

Pure functions over the note's text — `(text, op) → { text } | { refusal }` — each with its own
tests. They work inside the frontmatter block only and keep the line-ending style and a BOM.

| Operation                       | What changes                                                                                                                                                                                                                            |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| set relation value              | plain entry: the number token on its line, keeping quotes and a trailing comment; structured entry: the number on its `value:` line, or a new `value:` line when it had none; a non-number value (`hates`) is replaced as a whole token |
| set / clear why                 | structured entry: its `why:` line replaced, inserted or deleted; plain entry with a new why: its line becomes `Key:` + `value:` + `why:` lines                                                                                          |
| add relation                    | one `Key: n` line after the block's last entry (indent taken from the block, else two spaces); missing block: header + line, inserted before `tags:` or at the end of the frontmatter; `relations: {}` is replaced by a block           |
| remove relation                 | the entry's line, or its line and its deeper-indented lines                                                                                                                                                                             |
| change target                   | the key text of the entry's line, nothing else                                                                                                                                                                                          |
| set scalar (`name`, `power`, …) | the value after `key:`, keeping a trailing comment; missing key: one line before `tags:` or at the end                                                                                                                                  |
| remove scalar                   | the key's line                                                                                                                                                                                                                          |

Numbers are written with an ASCII minus; a value that was quoted stays quoted. Keys and strings are
written plain when plain-safe (letters, digits, spaces and `.'-_`, starting with a letter, not
`true`/`false`/`null`/`yes`/`no`/`on`/`off`/`~`), otherwise double-quoted with JSON escapes.

### 5.2 Refusals

Refused, never guessed: a flow mapping other than `{}`, a flow sequence, a block scalar, an anchor,
alias or tag on the field or entry; tabs or mixed indentation in the block; an entry spanning lines
other than the structured form (a nested map with keys besides `value` and `why`, a multi-line
string); a target that occurs twice; a value whose comment cannot be told apart from it.

### 5.3 Locating

An entry is found by its **raw key exactly as the YAML holds it** (after unquoting), so `Sable` and
`" Sable "` are two entries, each repairable on its own. A top-level key is a line starting at column 0
with the key and `:`; an entry is a line inside the field's block at the block's indent.

## 6. Architecture

```
src/yaml/lines.ts              frontmatter block, top-level keys, field blocks, entries — locate only
src/yaml/scalar.ts             plain-safe test, quoting, number formatting
src/yaml/edit.ts               the operations of §5.1 with `expect` checks and refusals
src/factions/steps.ts          step names and colours per value
src/factions/card.ts           CardModel from a note's raw frontmatter, its text and the world
src/factions/targets.ts        target suggestions: list and ranking
src/obsidian/world-cache.ts    the world, rebuilt lazily after metadata changes (debounced)
src/obsidian/card-view.ts      mounting the card into Markdown views, hiding Properties
src/obsidian/card-render.ts    the card's DOM and its edit controls
src/obsidian/target-suggest.ts AbstractInputSuggest over targets.ts
src/obsidian/warnings-modal.ts + Fix buttons
src/obsidian/settings.ts       one toggle: show Obsidian's properties too
```

**Mounting** is the one place that depends on Obsidian's DOM: the card goes into the view's
scrolling sizer (`.cm-sizer` in Live Preview, `.markdown-preview-sizer` in Reading view) right where
`.metadata-container` sits; Properties are hidden with
`.dnd5e-entity-view .metadata-container { display: none }`. If the expected element is missing (a
future Obsidian), the card goes to the top of the view's content instead — still visible, just not
scrolling with the note. Mounting is idempotent and re-run on `file-open`, `layout-change`,
`active-leaf-change` and the note's metadata change; all selectors live in `card-view.ts`.

## 7. Calls I made without the maintainer (check these)

- Each change writes at once (slider on release, text on Enter/blur), like Obsidian's Properties —
  no Save button. A change is refused when the value changed underneath instead of merging.
- Remove asks nothing but offers Undo for 5 s.
- A new relation starts at 0 (neutral) once its target is picked.
- Secret relations closed every time the card is built; Other fields closed by default.
- Lists and maps (tags too) read-only with Edit in source.
- Card in Reading view and Live Preview; Source mode stays raw YAML.
- Step-name settings wait for the world view.
- Numbers are written with an ASCII minus even where the note had `−`.
- No "Reset to inherited": the card shows only the note's own values, so Remove is that reset.
