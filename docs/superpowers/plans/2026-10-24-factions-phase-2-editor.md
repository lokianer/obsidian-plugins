# Factions Phase 2 — Faction Editor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Status:** draft — **build only after the maintainer has approved this plan.**

**Goal:** A command **Edit faction data** that opens a form on a faction or character note, edits
`name`, `power`, `relations`, `secret_relations` and the other simple fields, and writes only the
changed lines through `app.vault.process`; plus a **Fix** button on the warnings modal's rows.

**Architecture:** A pure line editor in `src/yaml/` (locate, edit, quote — text in, text or refusal
out), a pure form model in `src/factions/form.ts` (raw frontmatter → rows; edited rows → operations),
pure step names and colours in `src/factions/steps.ts`, and thin Obsidian UI in `src/obsidian/`.

**Tech Stack:** unchanged from phase 1. No new dependency.

**Spec:** `docs/superpowers/specs/2026-10-24-faction-editor-design.md`, on top of
`docs/superpowers/specs/2026-10-24-factions-design.md` §4, §5.4, §5.6. Read both first.

## Global Constraints

Everything under "Global Constraints" in `2026-10-24-factions-phase-1.md` still holds, plus:

- `src/yaml/` imports neither `obsidian` nor `../factions`.
- Every write goes through one `app.vault.process` call per save; no `processFrontMatter` (it
  re-serialises and drops comments).
- A line edit never touches a line outside the operation's target lines. Tests assert this by
  diffing input and output line by line.
- Refuse, never guess (spec §5.4); every refusal has a reason code and a translated message.
- Commit per task only with `pnpm lint && pnpm typecheck && pnpm test && pnpm build` green, chained
  with `&&`. No attribution lines (the `commit-msg` hook, now executable, rejects them).

## Review Focus

1. **Comments survive**: editing every relation of `The Drowned Choir/factions.md` keeps all its
   `#` comment lines byte for byte — test in Task 2.
2. **CRLF and BOM**: a CRLF note stays CRLF after an insert — test in Task 1/2.
3. **Raw keys**: `Sable` and `" Sable "` in one map are edited and removed independently — Task 2.
4. **All or nothing**: a save with one refused operation leaves the text unchanged — Task 4.
5. **Changed underneath**: the note edited while the form was open → nothing written — Task 6.
6. **Secrets hidden**: the secret section is closed on open unless Fix points into it — Task 6.

---

## File structure

```
src/yaml/lines.ts               frontmatterRange, topLevelKeys, fieldBlock, entries (locate only)
src/yaml/scalar.ts              isPlainSafe, quoteKey, quoteString, formatNumber
src/yaml/edit.ts                setEntryValue, setEntryWhy, addEntry, removeEntry, renameEntry,
                                setScalar, removeScalar, ensureFrontmatter; Refusal type
src/factions/steps.ts           stepName(value, t), stepColour(value) → CSS color-mix string
src/factions/form.ts            FormState, loadForm(note, world), diffForm(a, b) → EditOp[],
                                applyOps(text, ops) → { text } | { refusal, op }
src/obsidian/editor-modal.ts    EditorModal
src/obsidian/target-suggest.ts  TargetSuggest (AbstractInputSuggest)
src/obsidian/warnings-modal.ts  + Fix buttons
src/main.ts                     + command edit-faction-data
src/i18n/strings.ts             + editor strings, step names, refusal messages (en, de)
test/yaml-lines.test.ts, test/yaml-edit.test.ts, test/yaml-scalar.test.ts,
test/steps.test.ts, test/form.test.ts, test/edit.example.test.ts
```

---

### Task 1: Locating lines in the frontmatter

**Files:** create `src/yaml/lines.ts`, `test/yaml-lines.test.ts`.

- [ ] Tests first: `frontmatterRange(text)` → `{ start, end, eol, bom }` (line indices of the two
      `---` lines) or null; CRLF detected; BOM kept out of line 0.
- [ ] `topLevelKeys(lines, range)` → `{ key, line, valueText, comment }[]`, key unquoted
      (`"A: b"` and `'A'` forms), `valueText` without a trailing ` # comment`.
- [ ] `fieldBlock(lines, range, field)` → header, kind (block, empty flow, none, unsupported),
      indent and entries; `unsupported` carries a reason (flow map, tabs, mixed
      indent, anchor, tag, block scalar).
- [ ] `entries`: `{ rawKey, line, lastLine, form: 'plain' | 'structured', valueLine?, whyLine? }`;
      a structured entry with keys other than `value`/`why`, or a multi-line string, is
      `unsupported` with a reason.
- [ ] Run against every note of `examples/vault/` (via `test/fixture.ts`): every faction and
      character note locates without `unsupported`, and the entries' raw keys equal
      `Object.keys(frontmatter.relations)`.

### Task 2: Line edits

**Files:** create `src/yaml/scalar.ts`, `src/yaml/edit.ts`, `test/yaml-scalar.test.ts`,
`test/yaml-edit.test.ts`.

- [ ] `scalar.ts` tests first: plain-safe rule of spec §5.3; quoting with JSON-style escapes, which
      YAML double-quoted strings accept; `formatNumber(-3)` → `-3`.
- [ ] Each operation of spec §5.3 with tests for: plain and structured entries, quoted value kept
      quoted, trailing comment kept, entry indent 2 and 4, header insert before `tags:` and at the
      end, `relations: {}` replaced, CRLF kept, new frontmatter block.
- [ ] Each refusal of spec §5.4 has a test that also asserts the text is returned unchanged.
- [ ] Property-style check: for every relation entry in `The Drowned Choir/factions.md`, set it to
      `0`, then parse the result with `yaml`: that entry reads 0, every other key reads as before,
      and every line outside the entry's lines is identical (comments included).

### Task 3: Step names and colours

**Files:** create `src/factions/steps.ts`, `test/steps.test.ts`; modify `src/i18n/strings.ts`.

- [ ] Step names −5 … +5 in en and de as in design §4.4 (`step.-5` … `step.5`).
- [ ] `stepColour(v)`: −5 → pure `--color-red`, 0 → `--color-yellow`, +5 → `--color-green`, in
      between `color-mix(in srgb, var(--color-red) 60%, var(--color-yellow))` and so on; tests on
      the strings.

### Task 4: Form model

**Files:** create `src/factions/form.ts`, `test/form.test.ts`.

- [ ] `loadForm(note, text, world)` → `FormState`: kind, place (parent chain names), name, power,
      relation rows and secret rows from the **raw** entries (spec §4.1) each with its warnings from
      `world.warnings` (matched by path, field and trimmed key), other fields (spec §4.2) marked
      editable or read-only.
- [ ] `diffForm(loaded, edited)` → `EditOp[]` in a fixed order (removes, then changes, then adds), so
      line positions of later operations are found afresh in the edited text; no op for an unchanged
      or reset value; an empty new row yields nothing.
- [ ] `applyOps(text, ops)`: applies in order, each op re-locating its line; on the first refusal
      returns the refusal and the op, never a partial text.
- [ ] Tests on the example vault: Fix-style edits on The Drowned Choir (clamp `7` to `5`, pick a
      value for `hates`, remove the self-relation, add a value for Elder Wren) give a note that
      `buildWorld` reads with **no** relation warnings left for it; the `power: 9` line → `5`.

### Task 5: Target suggestions

**Files:** create `src/obsidian/target-suggest.ts`.

- [ ] `AbstractInputSuggest<Target>` over the world's factions (name, then folder name when it
      differs) and characters, each rendered with its kind and folder; pseudo-factions left out;
      the note's own entity left out.
- [ ] The pure part — building and ranking the target list for a query (prefix before substring,
      case-insensitive) — lives in `src/factions/targets.ts` with tests.

### Task 6: The form

**Files:** create `src/obsidian/editor-modal.ts`; modify `src/main.ts`, `styles.css`,
`src/i18n/strings.ts`.

- [ ] Command `edit-faction-data` ("Edit faction data" / "Fraktionsdaten bearbeiten") with
      `checkCallback`: available only when the active file is a faction or character note of the
      campaign; otherwise the notices of spec §5.1.
- [ ] Sections and rows of spec §4 built with `createEl`/`createDiv`; slider `input[type=range]`
      with step name and number; secret section closed by default.
- [ ] Save per spec §5.2: read the text at open (`vault.cachedRead`), on save `vault.process` with
      the unchanged check and `applyOps`; notices; discard prompt on close with changes.
- [ ] Mobile: rows wrap below 480 px (CSS only); check in Obsidian's mobile emulation
      (`app.emulateMobile(true)` in the developer console).
- [ ] Manual check in `examples/vault`: edit Isolde Ferrant, The Bench, The Drowned Choir; confirm
      with `git diff examples/vault` that only the intended lines changed; then `git checkout` them.

### Task 7: Fix from the warnings modal

**Files:** modify `src/obsidian/warnings-modal.ts`, `src/obsidian/editor-modal.ts`, `styles.css`.

- [ ] A Fix button per row for the codes in spec §5.6; opens the form with a `focus` target
      (field + raw key, or `power`, or `type`).
- [ ] After a save from Fix: wait for `metadataCache.on('changed')` for that file (registered and
      removed again; fallback 1 s), rebuild the world, reopen the warnings modal.
- [ ] Manual check: from a fresh `examples/vault`, fix every Drowned Choir warning through the
      buttons; only `unknown-target` for The Salt Kings may stay (it is a legal dangling target).
      Revert the vault afterwards.

### Task 8: Docs and example vault

**Files:** modify `plugins/dnd5e-bylokianer/README.md`, `CHANGELOG.md`, `DECISIONS.md`,
`examples/vault/Home.md`, root `ROADMAP.md`, `HANDOFF.md`.

- [ ] README: the command, the suggested hotkey (none set), what the form never touches.
- [ ] DECISIONS: the calls of spec §7 the maintainer confirmed.
- [ ] `Home.md`: row "Faction editor" — which notes to try (Choir for Fix, Corvin Marsh for a
      structured `why`, a note with CRLF if the vault has one, else add one).
- [ ] ROADMAP: tick phase 2, move "Next step" to the world view.
