# Faction editor — design

Date: 2026-10-24. Status: draft for the maintainer's review. Module: factions, new **phase 2**
(the maintainer chose the editor before the world view on 2026-10-24; world view, faction view and
tension panel move to phases 3 and 4, in-view sliders and history to phase 5).

Builds on [`2026-10-24-factions-design.md`](2026-10-24-factions-design.md) — its conventions (§4), the
line-edit rule (§5.6) and the Public/True rule (§5.4) apply unchanged. Proposal accepted by the
maintainer in the session of 2026-10-24 (see `HANDOFF.md` of that day); this document makes it exact.

## 1. Intent

The GM edits a faction or a character **without touching YAML**: every frontmatter value the factions
module reads — `name`, `power`, `relations`, `secret_relations` — plus the note's other simple fields,
in one form. The warnings modal gets a **Fix** button that opens the form on exactly the broken entry.
The note stays the truth: the form writes the few lines that changed and nothing else, so comments,
order and formatting of the YAML survive.

## 2. Goals, non-goals, anti-goals

**Goals**

- One command, **Edit faction data**, on the active note when it is a faction note or a character
  note inside the campaign.
- Relations as rows: target (with suggestions from the known factions and characters), a −5 … +5
  slider coloured red–yellow–green with the step name, an optional `why`, remove; "+ Add relation".
- A **Fix** button on every warnings row that an edit can repair (table in §5.6).
- Writes are line edits through `app.vault.process`, all or nothing, refused with a notice where a
  line cannot be placed with certainty.

**Non-goals (this phase)**

- No graph, matrix, faction view — later phases. No inherited values shown in the form (the faction
  view, phase 4, shows inherited versus own).
- No history log line and no "tonight's session" — phase 5, which reuses this phase's line editor.
- No settings tab: step names use the defaults of the design (§4.4); editing them comes with the
  world view, which shows them most.
- No renaming or moving notes and folders (fixes for `duplicate-name`, `duplicate-faction-note`,
  `campaign-ignored` stay manual: the row opens the note).
- No editing of list or map values other than the two relation maps (`tags: [...]`, nested custom
  maps): shown read-only with "Edit in note".

**Anti-goals — it fails even if it works when**

- saving changes a line the GM did not change in the form (a comment, a key order, a quote style of
  an untouched value);
- a save writes half of the changes and fails on the rest;
- a save silently overwrites edits the GM made in the note while the form was open;
- secret relations are on screen without the GM asking for them.

## 3. Constraints

Root `CLAUDE.md` in full; in particular `isDesktopOnly: false` (the form must work on a tablet),
no `innerHTML`, Obsidian CSS variables only, secondary text ≥ 16 px, English and German UI, no
default hotkey. No new runtime dependency: the line editor is our own code (the `yaml` package stays a
dev dependency for tests).

## 4. What the form edits

Opened on a note, the form shows its kind (Faction / Character) and its place (`The Gutter Court ›
The Bench`, or *Party* / *Unaffiliated*), then these sections:

| Section | Faction note | Character note | Written as |
| --- | --- | --- | --- |
| Name | `name` — text, placeholder the folder name; empty removes the line | not shown (a character's name is its file name) | top-level scalar |
| Power | `power` — 1 … 5 slider, step shown; untouched default 3 adds no line | not shown | top-level scalar |
| Relations | rows (§4.1) | rows | entries under `relations:` |
| Secret relations | rows, **collapsed** each time the form opens | same | entries under `secret_relations:` |
| Other fields | every other top-level key (§4.2) | same | top-level scalars |

### 4.1 Relation rows

Each entry as the note writes it is one row, **including the broken ones** — the form reads the raw
frontmatter entries, not the parsed relation map, so a `hates`, a `+7`, a `{ why }` without value and
a second ` Sable ` all appear and can be repaired.

- **Target**: text with suggestions (faction names, folder names, character names; each suggestion
  shows its kind and folder so two "Watch" factions are told apart). A name no faction or character
  has is allowed and marked "unknown" (a dangling target is legal, §4.3 of the design).
- **Value**: slider −5 … +5; beside it the number and the step name, the track tinted by the value
  (§4.5 colours). A row whose value is not a number shows the text as written, struck through, and
  the slider without a thumb until the GM picks a value.
- **Why**: optional one-line text; a wikilink is fine. Writing a `why` into a plain entry turns it into
  the structured form; clearing it removes the `why:` line and leaves `value:`.
- **Remove**: deletes the entry (its line, or its block of lines in the structured form).
- A row with a warning carries the warning's icon and message (the same strings as the warnings
  modal); a row reached through **Fix** is scrolled into view, highlighted and focused.
- **+ Add relation** appends an empty row; an empty row is not written.

The secret section's header reads "Secret relations · n" and opens on click. It opens by itself only
when **Fix** targets one of its rows. Closing and reopening the form closes it again (design §5.4:
nothing secret on a shared screen by accident).

### 4.2 Other fields

Every other top-level key — `type`, `tags`, `aliases`, custom keys:

- a single-line scalar (string, number, boolean) is a text field and can be changed or removed;
- anything else (a list, a map, a block scalar `|`) is shown read-only, summarised ("3 tags"), with
  **Edit in note**, which opens the note at that line;
- **+ Add field** adds a key and a scalar value.

`type` gets no special widget: changing it changes what the note is, which the GM may want (the
Fix for `missing-type` fills in `faction`).

## 5. Behaviour

### 5.1 Opening

- Command **Edit faction data** (`edit-faction-data`): on the active Markdown note. Not a faction
  note or character note in the campaign → notice "This note is not a faction or a character of the
  campaign", nothing opens. A note with broken frontmatter → notice naming the problem.
- From a warnings row: **Fix** (§5.6).
- Pseudo-factions (Party, Unaffiliated) have no note and are not editable.

### 5.2 Saving

**Save** (and Ctrl/Cmd+Enter) turns the difference between the loaded and the edited form into a
list of edit operations and applies them in **one** `app.vault.process` call:

1. If the note's text differs from the text the form was loaded from, nothing is written; notice:
   "The note changed while the form was open — reopen to edit the current version." (Obsidian's own
   editor, a sync, another plugin.)
2. Every operation is applied to the text in order. If one cannot be placed (§5.4), **nothing** is
   written and a notice names the entry and the reason; the form stays open with that row marked.
3. Otherwise the new text is returned to `process`, the form closes, a short notice confirms
   ("Saved 3 changes to The Bench").

**Cancel**, Esc or closing with unsaved changes asks once ("Discard changes?").

Nothing is written when nothing changed. A value the GM sets back to what it was is no change.

### 5.3 Line edits

Pure functions over the note's text (`string → string | refusal`), each with its own tests. They work
on the frontmatter block only and keep the line ending style (LF or CRLF) and a BOM.

| Operation | What changes |
| --- | --- |
| set relation value | plain entry: the number token on its line (`The Archivists: 7` → `5`), keeping quotes and a trailing comment; structured entry: the number on its `value:` line, or a new `value:` line under the key when it had none |
| set / clear why | structured entry: its `why:` line replaced, inserted or deleted; plain entry with a new why: its one line becomes `Key:` + `value:` + `why:` lines |
| add relation | one `Key: n` line after the block's last entry (indent taken from the block); missing block: a `relations:` / `secret_relations:` header plus the line, inserted before `tags:` or at the end of the frontmatter; `relations: {}` is replaced by a block |
| remove relation | the entry's line, or its line and its deeper-indented lines |
| change target | the key text of the entry's line, nothing else |
| set scalar (`name`, `power`, other) | the value after `key:`, keeping a trailing comment; missing key: one line inserted before `tags:` or at the end |
| remove scalar | the key's line |
| note without frontmatter | a new block at the top (only reachable through Fix on a `factions.md` without frontmatter) |

Numbers are written with an ASCII minus (`-3`); a value that was quoted stays quoted. Keys and
strings are written plain when they are plain-safe (letters, digits, spaces, `.`, `'`, `-`, `_`, not
starting with a digit or sign, not `true`/`false`/`null`/`yes`/`no`/`~`) and double-quoted
otherwise (`"[[Session 11 – Under the Lantern Bridge]]"`).

### 5.4 Refusals

An operation is refused — never guessed — when its line is not where a block-style YAML reader
would put it:

- the field is a flow mapping other than `{}` (`relations: { A: 1 }`), a flow sequence, a block
  scalar, an anchor or alias (`&x`, `*x`), or a tag (`!!map`);
- the block's entries use tabs or mixed indentation;
- the entry's key occurs twice on lines the editor would consider (exact duplicate, which Obsidian's
  YAML parser rejects anyway — such a note is `broken-frontmatter`);
- an entry spans lines in a way other than the structured form (a multi-line string value, a nested
  map with keys other than `value` and `why`);
- the target line contains a comment marker the editor cannot separate from the value (`#` inside a
  quoted value is fine, a `#` without a space before it is not).

The notice and the row say which entry and why, in one sentence, and offer **Edit in note**.

### 5.5 Locating entries

An entry is found by its **raw key exactly as the frontmatter holds it** (after YAML unquoting), so
`Sable` and `" Sable "` are two entries and each can be repaired or removed on its own. A top-level
key is a line starting with the key at column 0 followed by `:`; an entry is a line inside the
field's block, at the block's indent.

### 5.6 Fix from the warnings modal

Each warnings row whose code an edit can repair gets a **Fix** button (wrench icon). It closes the
warnings modal and opens the form on that note, focused on:

| Warning | Fix opens on |
| --- | --- |
| `value-out-of-range`, `value-not-integer` | the row; the slider shows the value read (5, 3) and saving writes it |
| `value-not-a-number`, `structured-without-value` | the row; no value until the GM picks one, or Remove |
| `unknown-target` | the row's target field, suggestions open |
| `self-relation`, `duplicate-key` | the row, Remove highlighted |
| `ambiguous-key` | the row's target field; the hint says the faction is used and that a key cannot name the character while both share a name — renaming one of the two is the way |
| `power-out-of-range`, `power-not-a-number`, `power-not-integer` | the power slider |
| `missing-type` | the `type` field, prefilled `faction` |
| `relations-not-a-map` | the field's section, read-only, with **Edit in note** |
| `duplicate-name`, `duplicate-faction-note`, `campaign-ignored`, `broken-frontmatter` | no Fix: the row's note link is the way |

After a save that came from **Fix**, the warnings modal reopens, rebuilt once the metadata cache has
re-read the note (on its `changed` event for that file, with a short timeout as fallback).

### 5.7 Look

Dark theme first, Obsidian variables only. The form is a Modal (full screen on a phone, as Obsidian
does for modals there). Rows wrap below 480 px: target and remove on one line, slider and step name on
the next, why on the third. Slider colours: `color-mix()` between `--color-red`, `--color-yellow` and
`--color-green` per step, the number and step name always beside it (colour is never the only
carrier). Text ≥ 16 px, no small italics; the "secret" tag as in the warnings modal.

## 6. Architecture

```
src/yaml/lines.ts            frontmatter block, top-level keys, field blocks, entries — locate only
src/yaml/edit.ts             the operations of §5.3 as pure text → text | refusal functions
src/yaml/scalar.ts           plain-safe test and quoting for keys and strings
src/factions/form.ts         FormState from a note's raw frontmatter + the world; diff → EditOp[]
src/factions/steps.ts        step names per value and the colour mix per value (pure)
src/obsidian/editor-modal.ts the form (Modal)
src/obsidian/target-suggest.ts  AbstractInputSuggest over the world's names
src/obsidian/warnings-modal.ts  + Fix buttons
src/main.ts                  + command
```

`src/yaml/` imports nothing from `factions`; it is a candidate for a shared `packages/` module once a
second plugin needs it (not before).

## 7. Calls I made without the maintainer (check these)

- A Modal, not a side panel: works the same on desktop and tablet and needs no layout of its own.
  A side panel can come with the faction view.
- The form shows raw entries, broken ones included, so Fix can reach every relation warning.
- Secret relations collapsed on every opening unless Fix points into them.
- Save is all or nothing, and refuses when the note changed while the form was open, instead of
  merging.
- Other fields: single-line scalars editable, lists and maps read-only (tags included). Editing
  tags would need list line edits; worth a later slice if wanted.
- Step-name settings wait for the world view; this phase uses the defaults.
- Numbers are written with an ASCII minus even where the note had `−`.
- No "Reset to inherited": the form shows only the note's own values, so Remove is that reset.
