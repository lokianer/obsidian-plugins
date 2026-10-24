# Factions Phase 2 — Faction Card — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Status:** approved by the maintainer ("mach weiter", 2026-10-24) with the revision to a card that
replaces Properties and is the only editor.

**Goal:** Faction and character notes show a faction card instead of Obsidian's Properties, in
Reading view and Live Preview; every value in it is editable and written back as a line edit; the
warnings modal gets Fix buttons that jump into the card.

**Architecture:** A pure line editor in `src/yaml/` (locate, edit, quote — text in, text or refusal
out), a pure card model in `src/factions/card.ts`, pure step names, colours and target ranking, and
the Obsidian side in `src/obsidian/` (world cache, mounting, rendering, suggest, settings, Fix).

**Tech Stack:** unchanged. No new runtime dependency.

**Spec:** `docs/superpowers/specs/2026-10-24-faction-editor-design.md`, on top of
`docs/superpowers/specs/2026-10-24-factions-design.md` §4, §5.4, §5.6.

## Global Constraints

Everything in the phase 1 plan's "Global Constraints", plus:

- `src/yaml/` imports neither `obsidian` nor `../factions`.
- Every write is one `app.vault.process` call per operation; no `processFrontMatter`.
- A line edit touches only its target lines; tests diff input and output line by line.
- Refuse, never guess (spec §5.2); each refusal has a code and a translated message.
- Commit per task with `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build`
  green. No attribution lines.

## Review Focus

1. **Comments survive**: editing every relation of `The Drowned Choir/factions.md` keeps all `#`
   comment lines byte for byte — Task 2.
2. **CRLF and BOM** kept on insert — Tasks 1, 2.
3. **Raw keys**: `Sable` and `" Sable "` edited and removed independently — Task 2.
4. **Changed underneath**: an op whose `expect` no longer matches leaves the text unchanged — Task 2.
5. **Secrets hidden**: the secret section is closed on every build unless Fix points into it — Task 4.
6. **Not a faction note → untouched view**: no class, no card — Task 6.

---

### Task 1: Locating lines in the frontmatter

`src/yaml/lines.ts`, `test/yaml-lines.test.ts`.

- [ ] `splitLines(text)` → lines, eol (`\n` or `\r\n`), bom; `joinLines` the inverse.
- [ ] `frontmatterRange(lines)` → indices of the two `---` lines, or null.
- [ ] `topLevelKeys(lines, range)` → key (unquoted), line, last line (deeper lines included), value
      text, comment.
- [ ] `fieldBlock(lines, range, field)` → none / empty flow / block with indent and entries /
      unsupported with a reason.
- [ ] Entries: raw key, line, last line, plain or structured with `value` and `why` lines;
      unsupported with a reason for anything else.
- [ ] Against every note of `examples/vault/`: each faction and character note's relation blocks
      locate, and their raw keys equal `Object.keys()` of the parsed field.

### Task 2: Line edits

`src/yaml/scalar.ts`, `src/yaml/edit.ts`, tests.

- [ ] Plain-safe test and quoting (spec §5.1); number formatting.
- [ ] Every operation of spec §5.1, each with `expect` (the value the card showed; `undefined` for
      "absent"), returning `{ text }` or `{ refusal }`.
- [ ] Refusal codes: `not-found`, `changed`, `unsupported` (with the reason from Task 1), `exists`
      (add or rename onto an existing key).
- [ ] The Drowned Choir check: set each entry to 0 → re-parse with `yaml`: that entry reads 0,
      every other value as before, every line outside the entry identical.

### Task 3: Steps, colours, targets

`src/factions/steps.ts`, `src/factions/targets.ts`, `src/i18n/strings.ts`, tests.

- [ ] Step names −5 … +5 in en and de (design §4.4); `stepColour(v)` as `color-mix()` strings.
- [ ] `targetsFor(world, entityId)`: factions (name; folder name when different), characters, each
      with kind and folder; own entity and pseudo-factions left out. `rankTargets(list, query)`:
      exact, prefix, word prefix, substring; case-insensitive.

### Task 4: Card model

`src/factions/card.ts`, `test/card.test.ts`.

- [ ] `buildCard(path, frontmatter, world)` → `CardModel | null` (null when the note is not an
      entity of the world): kind, place, name (+ editable), power, relation and secret rows from the
      raw entries with their warnings, other fields (editable or read-only + summary), warning count.
- [ ] Each row carries what an op needs: field, raw key, `expect` value.
- [ ] Example vault: The Drowned Choir's card has 8 relation rows, warnings on 5 of them; Sable's
      card has secret rows; Isolde Ferrant's card has no rows of its own.
- [ ] Ops for Fix-style edits on The Drowned Choir leave `buildWorld` with no relation warnings for
      it except the legal dangling target.

### Task 5: World cache and settings

`src/obsidian/world-cache.ts`, `src/obsidian/settings.ts`, `src/main.ts`.

- [ ] One world per plugin, built on demand, invalidated on `metadataCache` `changed` / `deleted` and
      vault `rename`, rebuilt debounced (250 ms); subscribers notified.
- [ ] Settings tab with one toggle: show Obsidian's properties on faction notes (off).

### Task 6: Mounting the card

`src/obsidian/card-view.ts`, `styles.css`.

- [ ] Idempotent `mount(view)` for Reading view and Live Preview per spec §6, with the fallback; the
      view's class hides Properties; unmount when the note stops being an entity or the mode is
      Source.
- [ ] Re-run on `file-open`, `layout-change`, `active-leaf-change`, world changes; no rebuild while a
      card field has focus; rebuild only when the card model changed.

### Task 7: Rendering and editing

`src/obsidian/card-render.ts`, `src/obsidian/target-suggest.ts`, `styles.css`, strings.

- [ ] Header, sections, rows, controls of spec §4.2–§4.3, all with `createEl`; `why` through
      `MarkdownRenderer.render` with a component owned by the card.
- [ ] Each control produces one op; the write goes through `vault.process` + `applyOp`; notices for
      refusals; optimistic update; Undo for remove.
- [ ] Command `edit-faction-data`.

### Task 8: Fix from the warnings modal

`src/obsidian/warnings-modal.ts`, `card-view.ts`.

- [ ] Fix buttons for the codes of spec §4.5; open the note, switch Source to Live Preview, focus the
      target in the card (open the section first).

### Task 9: Docs, example vault, manual check

- [ ] README (the card, the setting, what it never touches), CHANGELOG, DECISIONS (spec §7 calls).
- [ ] `examples/vault/Home.md`: row "Faction card" — which notes to try.
- [ ] Manual check in Obsidian (maintainer, local): every Drowned Choir warning fixed through the
      buttons; `git diff examples/vault` shows only the intended lines; revert afterwards.
- [ ] ROADMAP, HANDOFF.
