# Factions Phase 1 — Skeleton and Data — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A loading Obsidian plugin `dnd5e-bylokianer` whose pure core reads a campaign's factions,
members and relations from frontmatter, resolves public and true stances with inheritance, and
reports every data problem as a warning — proven by tests against `examples/vault/`.

**Architecture:** pnpm workspace at the repository root, one plugin package in
`plugins/dnd5e-bylokianer/`. All logic is pure TypeScript over a plain input type (`NoteInput`: path +
frontmatter), with no Obsidian import, tested in Node with Vitest. A thin adapter turns
`app.metadataCache` into `NoteInput[]`; the only UI in this phase is one command that shows the
warnings in a modal, to prove the wiring.

**Tech Stack:** Node 24, pnpm 12, TypeScript 6.0.3 (the newest release typescript-eslint 8 supports:
peer `<6.1.0`; TypeScript 7 has no classic JS API, 6.1 does not exist yet), esbuild
0.28, Vitest 5, eslint 9 + typescript-eslint 8 + eslint-plugin-obsidianmd 0.4, prettier 3, `yaml` 2
(dev only, for test fixtures), `obsidian` 1.14 typings.

**Spec:** `docs/superpowers/specs/2026-10-24-factions-design.md` (sections 4.1–4.4 and 5.4 for this
phase). Read it before starting.

## Global Constraints

- Repository language English: code, comments, commits, docs. UI strings English default, German second.
- Nomenclature English: `factions.md`, `relations`, `secret_relations`, `power`, `type: npc|character|faction|campaign`.
- Plugin id `dnd5e-bylokianer`, name `dnd5e-byLokianer`, licence MIT (`Copyright (c) 2026 Lokianer`).
- `isDesktopOnly: false`; no `fs`, `path`, `child_process` or other Node modules in `src/` (tests may use them).
- No `innerHTML`; build DOM with `createEl` / `createDiv`. No default hotkeys. No network calls.
- Pure modules (`src/campaign`, `src/factions`, `src/i18n`) never import `obsidian`.
- Relation values: integers −5 … +5. Out of range → clamp and warn. Empty value → no relation, no warning.
- Commits: Conventional Commits, body = what changed, why, what was left out. **No attribution lines** —
  `.githooks/commit-msg` rejects them. One commit per task, only with green tests and clean lint. Push
  after each commit (`git push`).
- Windows host: write files containing backslashes with the Write/Edit tools, not shell heredocs.

## Review Focus

1. **Notes with no or broken frontmatter** (Obsidian hands `undefined`): ignored without a crash — test in Task 4.
2. **A typographic minus typed in YAML** (`Order of the Lantern: "−3"`, U+2212): read as −3 — test in Task 3.
3. **Keys with stray whitespace or different case** (`" the archivists "`): resolve to The Archivists — test in Task 5.
4. **A faction whose `name:` differs from its folder name**: matchable by both — test in Task 5.
5. **A member note in a plain subfolder of a faction** (`Order of the Lantern/Retired/Old Bram.md`): belongs to the Order — test in Task 4.

---

## File structure

```
package.json                    workspace root: scripts lint/typecheck/test/build run in every package
pnpm-workspace.yaml             packages: plugins/*
.prettierrc.json, .editorconfig
.github/workflows/ci.yml        ubuntu/macos/windows: install, lint, typecheck, test, build
plugins/dnd5e-bylokianer/
  manifest.json, versions.json, styles.css (empty), LICENSE, README.md, DECISIONS.md, CHANGELOG.md
  package.json, tsconfig.json, esbuild.config.mjs, eslint.config.mts, vitest.config.ts
  scripts/install-example.mjs   copies main.js, manifest.json, styles.css into examples/vault/.obsidian/plugins/dnd5e-bylokianer/
  src/main.ts                   Plugin class: registers the command, nothing else
  src/types.ts                  NoteInput
  src/campaign/scope.ts         findCampaign, inCampaign  (port of Rhizom campaign.ts)
  src/factions/model.ts         all faction types (Entity, Relation, Warning, FactionWorld, Mode, Stance)
  src/factions/values.ts        parseRelationValue, parseRelationMap, parsePower
  src/factions/discover.ts      discoverEntities
  src/factions/keys.ts          resolveKeys
  src/factions/world.ts         buildWorld (discover + keys), the one entry point
  src/factions/stance.ts        stance, allStances
  src/i18n/strings.ts           en and de tables, createT
  src/obsidian/notes.ts         collectNotes(app): NoteInput[]   (adapter, not unit-tested)
  src/obsidian/warnings-modal.ts  WarningsModal
  test/fixture.ts               loadExampleVault(): NoteInput[] (reads examples/vault with fs + yaml)
  test/*.test.ts                one file per src module, plus world.example.test.ts
```

---

### Task 1: Workspace, plugin scaffold, docs and CI

**Files:**
- Create: everything under "File structure" except `src/campaign`, `src/factions`, `src/i18n`, `src/obsidian`, `test/fixture.ts`
- Modify: `CLAUDE.md` ("Docs per plugin": the handoff is the root `HANDOFF.md`, not one per plugin), `.gitignore` (add `plugins/*/main.js`), `ROADMAP.md` (tick the scaffold items)

**Interfaces:**
- Produces: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build` at the root and in the plugin; `pnpm install-example` in the plugin.

- [ ] **Step 1: Root workspace.** `package.json` (`"private": true`, `"packageManager": "pnpm@12.15.0"`, scripts `lint`/`typecheck`/`test`/`build` = `pnpm -r <script>`), `pnpm-workspace.yaml` (`packages: ['plugins/*']`), `.prettierrc.json` (`singleQuote`, `printWidth: 100`), `.editorconfig` (tabs in JSON config files like the sample plugin; 2 spaces in TS).
- [ ] **Step 2: Plugin package** from the official sample plugin (`github.com/obsidianmd/obsidian-sample-plugin`): its `esbuild.config.mjs` (entry `src/main.ts`, outfile `main.js`, same externals, `target: 'es2021'`) and `eslint.config.mts` (`obsidianmd.configs.recommended`, ignore `test/**` from the obsidianmd rules but lint it with typescript-eslint), `tsconfig.json` (its options, but `"moduleResolution": "bundler"` instead of `"node"`, which TypeScript 6 deprecates — no `ignoreDeprecations`; `"types": ["node"]` only in a separate `tsconfig.test.json` for `test/`). Dev dependencies pinned to the versions in Tech Stack. Scripts: `build` (`tsc --noEmit && node esbuild.config.mjs production`), `dev`, `typecheck`, `lint`, `test` (`vitest run`), `install-example` (`node scripts/install-example.mjs`).
- [ ] **Step 3: Check `getLanguage`.** In `node_modules/obsidian/obsidian.d.ts`, find `getLanguage` and its `@since`. Set `manifest.json` `minAppVersion` to that version (if it is missing, use `moment.locale()` in Task 7 and the sample plugin's `minAppVersion`). `manifest.json`: id `dnd5e-bylokianer`, name `dnd5e-byLokianer`, version `0.1.0`, description "Game-master tools for D&D 5e: factions and their relations.", author `Lokianer`, `isDesktopOnly: false`. `versions.json`: `{ "0.1.0": "<minAppVersion>" }`.
- [ ] **Step 4: `src/main.ts`** — `export default class Dnd5ePlugin extends Plugin` with empty `onload`. A smoke test `test/smoke.test.ts`: `expect(1 + 1).toBe(2)` so the pipeline runs.
- [ ] **Step 5: Docs.** `LICENSE` (MIT, `Copyright (c) 2026 Lokianer`); `README.md` (what it is, install for development: `pnpm install`, `pnpm build`, `pnpm install-example`, open `examples/vault`); `CHANGELOG.md` (Keep a Changelog, `## [Unreleased]`); `DECISIONS.md` with the entries from `ROADMAP.md` → "Decisions so far", one heading each with date 2026-10-24, plus: "Rhizom code relicensed to MIT by its sole author" and "TypeScript 6.0.3 pinned: the maintainer wanted 7, but TypeScript 7 has no classic JS API and typescript-eslint 8 supports < 6.1; move up when typescript-eslint does".
- [ ] **Step 6: CI** `.github/workflows/ci.yml`: on push and pull_request; matrix `ubuntu-latest`, `macos-latest`, `windows-latest`; `pnpm/action-setup` (version from `packageManager`), `actions/setup-node` with Node 24 and pnpm cache; `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
- [ ] **Step 7: Verify.** Run at the root: `pnpm install && pnpm lint && pnpm typecheck && pnpm test && pnpm build`. Expected: all exit 0, `plugins/dnd5e-bylokianer/main.js` exists. Run `pnpm --filter dnd5e-bylokianer install-example`; expected: three files in `examples/vault/.obsidian/plugins/dnd5e-bylokianer/` and `git status` shows none of them.
- [ ] **Step 8: Commit and push.** `chore(dnd5e): scaffold plugin, workspace and CI`.

### Task 2: Test fixture and campaign scope

**Files:**
- Create: `src/types.ts`, `src/campaign/scope.ts`, `test/fixture.ts`, `test/scope.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/types.ts
  export interface NoteInput { path: string; frontmatter: Record<string, unknown> | undefined }
  // src/campaign/scope.ts
  export interface CampaignScope { path: string; folder: string; system: string | null }
  export function findCampaign(notes: readonly NoteInput[]): { campaign: CampaignScope | null; ignored: string[] }
  export function inCampaign(campaign: CampaignScope | null, path: string): boolean
  export function typeOf(frontmatter: Record<string, unknown> | undefined): string | undefined // trimmed, lower-case
  // test/fixture.ts
  export function loadExampleVault(): NoteInput[] // every .md under examples/vault except .obsidian, vault-relative POSIX paths
  ```

- [ ] **Step 1: Port the tests** from `../rhizom/packages/core/src/vault/campaign.test.ts` (`findCampaign` and "the campaign scope" blocks; drop `campaignTypeOf`), adapted to `NoteInput` (frontmatter may be `undefined` → not a campaign). Add: `findCampaign(loadExampleVault()).campaign` equals `{ path: 'Silverstadt/Campaign.md', folder: 'Silverstadt', system: 'D&D 5e (2014 rules)' }`.
- [ ] **Step 2: Run** `pnpm --filter dnd5e-bylokianer test`. Expected: FAIL, modules not found.
- [ ] **Step 3: Implement** `scope.ts` by porting `../rhizom/packages/core/src/vault/campaign.ts` (same rules: smallest path wins, others in `ignored`, `inCampaign` with the trailing slash) and `fixture.ts` (`node:fs` recursive read, frontmatter between the first two `---` lines parsed with `yaml`'s `parse`; a parse error yields `undefined`).
- [ ] **Step 4: Run tests.** Expected: PASS.
- [ ] **Step 5: Commit and push.** `feat(dnd5e): campaign scope and example-vault fixture`.

### Task 3: Relation values

**Files:**
- Create: `src/factions/model.ts`, `src/factions/values.ts`, `test/values.test.ts`

**Interfaces:**
- Produces (`model.ts`):
  ```ts
  export type Mode = 'public' | 'true';
  export type RelationField = 'relations' | 'secret_relations';
  export interface Relation { value: number; why?: string }
  export type WarningCode =
    | 'value-out-of-range' | 'value-not-a-number' | 'value-not-integer' | 'structured-without-value'
    | 'relations-not-a-map' | 'power-out-of-range' | 'unknown-target' | 'self-relation'
    | 'ambiguous-key' | 'duplicate-name' | 'missing-type' | 'duplicate-faction-note';
  export interface Warning { path: string; code: WarningCode; key?: string; field?: RelationField }
  ```
- Produces (`values.ts`):
  ```ts
  export function parseRelationValue(raw: unknown, ctx: { path: string; key: string; field: RelationField }, warn: (w: Warning) => void): Relation | null
  export function parseRelationMap(raw: unknown, path: string, field: RelationField, warn: (w: Warning) => void): Map<string, Relation> // keys trimmed, raw (unresolved) names
  export function parsePower(raw: unknown, path: string, warn: (w: Warning) => void): number // default 3
  ```

- [ ] **Step 1: Write failing tests** (`test/values.test.ts`), each asserting value and the warnings collected:
  - `3` → `{ value: 3 }`, no warning; `"-1"` → −1; `"−3"` (U+2212) → −3; `{ value: -3, why: '[[X]]' }` → `{ value: -3, why: '[[X]]' }`; `{ value: 2, why: 7 }` → `{ value: 2 }` (non-string `why` dropped).
  - `7` → 5 + `value-out-of-range`; `-9` → −5 + `value-out-of-range`; `2.6` → 3 + `value-not-integer`.
  - `'hates'` → null + `value-not-a-number`; `{ why: '[[Elder Wren]]' }` → null + `structured-without-value`; `null` / `undefined` / `''` → null, no warning.
  - `parseRelationMap('x', …)` and `parseRelationMap([1], …)` → empty map + `relations-not-a-map`; `parseRelationMap(undefined, …)` → empty map, no warning; keys `' The Archivists '` → `'The Archivists'`.
  - `parsePower(undefined)` → 3; `parsePower(9)` → 5 + `power-out-of-range`; `parsePower(0)` → 1 + warning; `parsePower('x')` → 3 + `power-out-of-range`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement** `model.ts` (types only) and `values.ts`. Numeric strings: trim, replace U+2212 with `-`, then `Number()`; reject `NaN` and empty.
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Commit and push.** `feat(dnd5e): parse relation values with warnings`.

### Task 4: Discovering factions and members

**Files:**
- Modify: `src/factions/model.ts` (add `Entity`)
- Create: `src/factions/discover.ts`, `test/discover.test.ts`

**Interfaces:**
- Consumes: `NoteInput`, `CampaignScope`, `inCampaign`, `typeOf` (Task 2); `parseRelationMap`, `parsePower` (Task 3).
- Produces:
  ```ts
  export const PARTY = '@party'; export const UNAFFILIATED = '@unaffiliated';
  export interface Entity {
    id: string            // faction: its folder path; character: its note path; pseudo: PARTY | UNAFFILIATED
    kind: 'faction' | 'character';
    pseudo: boolean;
    name: string          // faction: frontmatter `name` or folder name; character: note base name
    folderName?: string   // factions only: the folder's own name, for key matching
    notePath: string | null // the note holding its frontmatter; null for pseudo-factions
    parent: string | null // id of the enclosing faction (characters, sub-factions); null for top-level and pseudo
    power: number
    relations: Map<string, Relation>        // keys still raw names
    secretRelations: Map<string, Relation>
  }
  export function discoverEntities(notes: readonly NoteInput[], campaign: CampaignScope, warn: (w: Warning) => void): Map<string, Entity>
  ```

Rules (spec 4.2): only notes inside the campaign scope count. A folder is a faction when it holds
`factions.md` (counts even without `type: faction`, then `missing-type`) or a note named like the folder
with `type: faction`. If both: `factions.md` wins, `duplicate-faction-note` on the other. A character is a
note with `type` `npc` or `character` that is not a faction note; its parent is the nearest faction
folder at or above its own folder; with none, `character` → `PARTY`, `npc` → `UNAFFILIATED`. Pseudo-factions
exist only when they have a member. A faction's parent is the nearest faction folder above it.

- [ ] **Step 1: Write failing tests** with small inline note lists:
  - `factions.md` faction with `name:` → name from frontmatter, `folderName` from the folder; without `name:` → folder name.
  - folder-named note `G/G.md` with `type: faction` → faction `G`; without the type → not a faction.
  - both in one folder → `factions.md` wins + `duplicate-faction-note` on `G/G.md`.
  - `factions.md` without `type` → still a faction + `missing-type`.
  - sub-faction parent; member in a plain subfolder `Order/Retired/Old Bram.md` → parent `Order` (Review Focus 5).
  - `type: character` outside factions → parent `PARTY`; `type: npc` outside → `UNAFFILIATED`; no pseudo entity without members.
  - notes outside the campaign folder ignored; a note with `frontmatter: undefined` ignored without error (Review Focus 1); `type: ' NPC '` counts.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement** `discoverEntities`.
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Commit and push.** `feat(dnd5e): discover factions, sub-factions and members`.

### Task 5: Resolving relation keys

**Files:**
- Modify: `src/factions/model.ts` (add `ResolvedEntity`, `FactionWorld`)
- Create: `src/factions/keys.ts`, `src/factions/world.ts`, `test/keys.test.ts`

**Interfaces:**
- Consumes: `Entity`, `discoverEntities` (Task 4).
- Produces:
  ```ts
  export interface ResolvedEntity extends Omit<Entity, 'relations' | 'secretRelations'> {
    relations: Map<string, Relation>        // keys are target ids; unknown targets as '?' + name
    secretRelations: Map<string, Relation>
  }
  export interface FactionWorld { campaign: CampaignScope | null; entities: Map<string, ResolvedEntity>; warnings: Warning[] }
  export function resolveKeys(entities: Map<string, Entity>, warn: (w: Warning) => void): Map<string, ResolvedEntity>
  export function buildWorld(notes: readonly NoteInput[]): FactionWorld // findCampaign → discover → resolveKeys; deduplicated warnings, sorted by path then code
  ```

Matching order for a key: exact faction `name` → exact faction `folderName` → exact character name →
the same three case-insensitively. A key matching a faction and a character → the faction +
`ambiguous-key`. Two factions with the same name → the smaller id wins + `duplicate-name` on the
other. Pseudo-factions are never targets. Unknown → `'?' + key` + `unknown-target`. Target = own id →
dropped + `self-relation`. Warnings carry the source note path, key and field. Same warning twice →
reported once.

- [ ] **Step 1: Write failing tests:** exact name; folder name when `name:` differs (Review Focus 4); `' the archivists '` (Review Focus 3); ambiguous key; duplicate faction names; unknown → `?The Salt Kings` + warning; self relation dropped; the same broken entry seen twice → one warning; `buildWorld([])` → `{ campaign: null, entities: empty, warnings: [] }`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement** `resolveKeys` and `buildWorld`.
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Commit and push.** `feat(dnd5e): resolve relation keys to factions and characters`.

### Task 6: Public and true stance

**Files:**
- Modify: `src/factions/model.ts` (add `Stance`)
- Create: `src/factions/stance.ts`, `test/stance.test.ts`, `test/world.example.test.ts`

**Interfaces:**
- Consumes: `FactionWorld`, `ResolvedEntity` (Task 5).
- Produces:
  ```ts
  export interface Stance {
    value: number; why?: string;
    source: string        // id of the entity whose note holds the value
    field: RelationField  // where it was found
    inherited: boolean    // source !== from
  }
  export function stance(world: FactionWorld, from: string, to: string, mode: Mode): Stance | null
  export function allStances(world: FactionWorld, from: string, mode: Mode): Map<string, Stance> // every target reachable along the chain, minus `from` itself
  ```

Algorithm (spec 4.3): walk `from`, then each `parent` up to the top. Public: the first level with
`relations.get(to)` wins. True: at each level `secretRelations.get(to)` first, then `relations.get(to)`;
the first hit wins. Nothing found → `null`. Pseudo-factions have no relations and no parent.

- [ ] **Step 1: Write failing unit tests** on small worlds: own value beats faction; inherited from faction and from a grandparent faction; true mode prefers secret at the same level; own public beats a parent's secret in true mode; a relation to a character is inherited by members; `allStances` excludes the entity itself.
- [ ] **Step 2: Write failing example-vault tests** (`world.example.test.ts`, `buildWorld(loadExampleVault())`), with ids built from `Silverstadt/Factions/...`:
  - Order → Court public −3 with `why` `[[Session 11 – Under the Lantern Bridge]]`; Court → Order public −4.
  - Isolde Ferrant → Archivists: public 1 inherited from the Order; true −2 inherited (`field: 'secret_relations'`).
  - Corvin Marsh → Order: public −3 and true −3, own value, not inherited.
  - The Bench → Order: public −4 inherited from the Court; true 4 own secret. The Bench → Archivists −1 own.
  - Lady Vermillion → Order: true 4 inherited from the Bench.
  - Ondine Vale → Court −5 own; Orrin Quill (Party) → Mira Voss −2; Sable → Archivists true 4.
  - The Drowned Choir: Archivists 5; Court −1; `?The Salt Kings` −2; no Order, no self, no Sable, no Elder Wren. Warnings for the Choir's note: exactly `power-out-of-range`, `value-out-of-range`, `value-not-a-number`, `unknown-target`, `self-relation`, `structured-without-value`.
  - Entities include `PARTY` with Tessaly Vane, Orrin Quill, Dagny, Ilex and `UNAFFILIATED` with Brannoc Ironweld and Elder Wren. No other warnings in the vault.
- [ ] **Step 3: Run.** Expected: FAIL.
- [ ] **Step 4: Implement** `stance` and `allStances`.
- [ ] **Step 5: Run all tests.** Expected: PASS. If an example-vault expectation fails because the vault data is wrong rather than the code, fix the note in `examples/vault/` and update `Home.md`, never the expectation.
- [ ] **Step 6: Commit and push.** `feat(dnd5e): resolve public and true stances with inheritance`.

### Task 7: Wiring into Obsidian — warnings command

**Files:**
- Create: `src/i18n/strings.ts`, `src/obsidian/notes.ts`, `src/obsidian/warnings-modal.ts`, `test/i18n.test.ts`
- Modify: `src/main.ts`, `README.md`, `CHANGELOG.md`, `ROADMAP.md`, `HANDOFF.md`

**Interfaces:**
- Consumes: `buildWorld`, `FactionWorld`, `Warning` (Task 5).
- Produces:
  ```ts
  // src/i18n/strings.ts
  export type Lang = 'en' | 'de';
  export type StringKey = keyof typeof en;   // `en` is the English table, the source of all keys
  export type T = (key: StringKey, vars?: Record<string, string | number>) => string;
  export function createT(lang: string): T   // unknown lang → en; `de` table typed Record<StringKey, string>
  // summary in the modal: "5 factions, 14 characters, 6 warnings" for the example vault (pseudo-factions not counted)
  // src/obsidian/notes.ts
  export function collectNotes(app: App): NoteInput[] // getMarkdownFiles + metadataCache.getFileCache(f)?.frontmatter
  // src/obsidian/warnings-modal.ts
  export class WarningsModal extends Modal { constructor(app: App, world: FactionWorld, t: T) }
  ```

- [ ] **Step 1: Failing i18n test:** every `StringKey` has a non-empty string in both tables; `createT('fr')` falls back to English; `{n}` placeholders are filled.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement** `strings.ts` with keys for: command name "Show faction warnings" / "Fraktions-Warnungen anzeigen"; modal title; "No campaign note found" / "Keine Kampagnennotiz gefunden"; summary "{factions} factions, {characters} characters, {warnings} warnings"; one message per `WarningCode` (English and German).
- [ ] **Step 4: Run.** Expected: PASS.
- [ ] **Step 5: Implement** `collectNotes`, `WarningsModal` (title, summary line, one row per warning: message + note path as a link that opens the note via `app.workspace.openLinkText`; text 16 px, colours from `--text-normal` / `--text-muted`; `createEl` only), and register the command in `onload` (`addCommand`, no hotkey; language from `getLanguage()` or the fallback chosen in Task 1 Step 3).
- [ ] **Step 6: Verify** `pnpm lint && pnpm typecheck && pnpm test && pnpm build` at the root, all exit 0; then `pnpm --filter dnd5e-bylokianer install-example`.
- [ ] **Step 7: Manual check in Obsidian** (the maintainer, or note it in `HANDOFF.md` if no Obsidian is available): open `examples/vault`, enable the plugin, run "Show faction warnings". Expected: "5 factions, 14 characters, 6 warnings" and the six Drowned Choir warnings, each opening its note.
- [ ] **Step 8: Docs.** `CHANGELOG.md` Unreleased: "Added: faction data model — campaign scope, factions and members, relation parsing with warnings, public and true stances; command Show faction warnings". Tick phase 1 in `ROADMAP.md`, set "Next step" to phase 2 (world view). Rewrite `HANDOFF.md` following its structure.
- [ ] **Step 9: Commit and push.** `feat(dnd5e): show faction warnings in Obsidian`. Then stop for the maintainer's review of phase 1.
