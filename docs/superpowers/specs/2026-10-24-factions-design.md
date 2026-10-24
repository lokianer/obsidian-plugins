# Factions module — design

Date: 2026-10-24. Status: draft for the maintainer's review.

The first module of a D&D game-master plugin for Obsidian. The plugin will later also hold an NPC
builder with 5e-style stat blocks, a battle tracker and a dice module; each gets its own design. This
document covers the factions module and the minimum of plugin skeleton it needs.

Sources: the brainstorming of 2026-10-24 with the maintainer, the mockup
`.superpowers/brainstorm/108040-1792867505/content/factions-views.html` (local only), the Rhizom handoff
(`../rhizom/docs/handoff-obsidian-plugin.md`) and the example vault `examples/vault/`, which already uses
every convention below.

## 1. Intent

The maintainer runs a D&D 5e campaign in Obsidian and wants more than organised notes: the **factions
of the world and how they stand towards each other**, visible at a glance as colour — green peaceful,
yellow tense, red hostile — and changeable by editing a value in a note. The point is the
*interplay*: one-sided grudges, members who do not share their faction's line, secret stances behind a
public face, and how it all shifts over the campaign. It is a GM's thinking tool for preparing and
improvising, not a rules engine.

## 2. Goals, non-goals, anti-goals

**Goals**

- Factions and characters are ordinary notes; relations are frontmatter values a GM can type by hand.
- Two views: a **world view** of all factions (graph and matrix, switchable) and a **faction view**
  showing one faction with its members, inherited versus own values clearly distinct.
- All nine ideas the maintainer accepted: named steps on the scale, public face and true stance,
  reasons on relations, history, tension panel, blocs in the layout, power, sub-factions, editing in
  place.
- Robust against hand-edited data: a broken value produces a warning, never a crash or a blank view.

**Non-goals (for this module)**

- No combat, dice, stat blocks — other modules.
- No player export or player-facing view yet; but nothing here may block one (see 5.4).
- No automatic change of any value. The plugin suggests; the GM decides.
- No rules or simulation: a relation is a number the GM sets, not the output of a formula.

**Anti-goals — it fails even if it works when**

- a note becomes unreadable or ugly without the plugin (frontmatter must stay plain, hand-writable YAML);
- the plugin rewrites or reformats the GM's text or frontmatter beyond the one value being changed;
- a secret stance ever shows in anything marked as public;
- the views are slow or jittery on a vault with thousands of notes.

## 3. Constraints

From `CLAUDE.md` (root) — they apply in full: English in the repository, UI in English and German,
no network, `isDesktopOnly: false` (works on a tablet at the table), writes through
`app.vault.process` / `app.fileManager.processFrontMatter`, no `innerHTML` with note content,
Obsidian CSS variables only, secondary text at least 16 px, dark theme first, no default hotkeys,
Vitest for pure modules, phases with a review stop each.

## 4. Data conventions (decided)

### 4.1 Campaign scope

As in the Rhizom handoff: a note with `type: campaign` switches the module on for its folder and
everything below it. Factions and characters outside that scope are ignored. One campaign per vault
for now; key all caches by campaign root so several can come later.

### 4.2 Faction

- A **faction is a folder** that contains a **faction note**. The faction note is either
  `factions.md` or a note with the same name as its folder (`The Gutter Court/The Gutter Court.md`).
  Both are recognised. If a folder holds both, `factions.md` wins and a warning names the other.
- The faction's **name** is `name:` from the faction note's frontmatter, else the folder name.
- The faction note has `type: faction`. A `factions.md` without it still counts (warning: missing type).
- **Members** are the character notes (`type: npc` or `type: character`) directly in the faction
  folder. Notes in deeper folders belong to the sub-faction of that folder, if it is one; otherwise
  to the nearest faction above them.
- **Sub-faction**: a faction folder inside another faction folder. It inherits its parent's relations
  where it states none of its own, exactly like a member does.
- `power: 1–5` (optional, default 3) sets the node size.
- Links to a faction note made with `factions.md` need a path (`[[The Gutter Court/factions|The Gutter
  Court]]`); folder-named faction notes link normally. Documented, not solved by the plugin.

### 4.3 Relations

In the frontmatter of a faction note or a character note:

```yaml
relations:            # the public face
  The Archivists: 1
  The Gutter Court:
    value: -3
    why: "[[Session 11 – Under the Lantern Bridge]]"
secret_relations:     # the true stance, GM only
  The Archivists: -2
```

- **Key**: a faction name (4.2) or a character note's base name. A key that matches both a faction
  and a character resolves to the faction, with a warning.
- **Value**: an integer −5 … +5, written as a number, as a numeric string (`"-1"`), or as
  `{ value, why }`. `why` is optional: a wikilink or plain text.
- Relations are **one-directional**. A → B says nothing about B → A.
- **Inheritance**: a member's effective relation to X is its own value if it has one, else its
  sub-faction's, else its faction's, up the chain. This holds for every target X, faction or
  character: if the Gutter Court hates Sable, its members do too unless they say otherwise. What is
  never passed on is a *member's* relation: a character's values apply to that character only.
- **Resolving the two stances** (one function, used by every view):
  - *public(A, X)*: walk the chain A → sub-faction → faction → …; the first level that has
    `relations.X` wins.
  - *true(A, X)*: walk the same chain; at each level look at `secret_relations.X` first, then
    `relations.X`; the first hit wins. So the most specific note always speaks for itself.
    Example from the vault: Corvin Marsh has his own public `Order of the Lantern: -3` and no secret
    value; his faction has a secret −2. His true stance is **−3**, because his own note is the more
    specific level and nothing in it says otherwise.
  - Where nothing is found, there is no relation (no arrow, empty cell) — not 0.
- **Robustness** (each case produces one warning in a warnings list, and the entry is otherwise
  ignored): value out of range (clamped to ±5 *and* warned), not a number, unknown key (dangling —
  drawn as a ghost node), relation to itself, empty value (= no relation, no warning), structured
  form without `value`, `power` out of range (clamped). `examples/vault/Silverstadt/Factions/The
  Drowned Choir/factions.md` holds every case.

### 4.4 Named steps

Each integer has a name, editable in the settings, shown in tooltips, the matrix and the slider:

| −5 | −4 | −3 | −2 | −1 | 0 | +1 | +2 | +3 | +4 | +5 |
|---|---|---|---|---|---|---|---|---|---|---|
| war | feud | hostile | distrust | wary | neutral | cordial | friendly | allied | close | sworn |

German defaults: Krieg, Fehde, feindlich, Misstrauen, argwöhnisch, neutral, höflich, freundlich,
verbündet, eng, eingeschworen.

### 4.5 Colour

A continuous scale red (−5) → yellow (0) → green (+5), interpolated per integer. The three anchor
colours come from CSS variables with fallbacks (`--color-red`, `--color-yellow`, `--color-green` in
current Obsidian themes) so they follow the theme. Colour is never the only carrier of meaning: every
arrow and cell also shows the number on hover or in the cell.

### 4.6 History

When the GM changes a value **through the plugin's UI** (5.6), the plugin offers once — a notice with
"Log it" — to append a line to tonight's session note under `## Log`:

```
- 20:31 Order of the Lantern → The Gutter Court: −2 → −3
```

Tonight's session = the session note with the highest `session:` number. The full rule from the
Rhizom handoff applies: when that note's `date:` lies before today, the plugin offers once to create
session N+1 from the session template, dated today, in the folder of the last session note; until the
GM answers, writes go to the newest note, and every write names its target ("→ Session 14"). This
"tonight's session" logic is **shared** — it goes into a `packages/` module, because the dice module,
the battle tracker and the capture bar will write to the same note. Values edited by hand in the YAML
are not logged; the plugin does not watch keystrokes. History is *read* from these lines across all
session notes, in session order; the line format is the contract (accept both `-` and `−`). A secret
value's change is logged inside a `> [!gm]` callout so it never becomes public.

## 5. Views and features

### 5.1 World view (an Obsidian `ItemView`)

Opened by a command ("Open faction world") and a ribbon icon. Two modes, a toggle in the view header:

- **Graph.** Factions as nodes (size from `power`), sub-factions drawn inside or next to their parent
  (builder's call, see 7), relations as directed, coloured arrows; two arrows when both directions
  exist. **Blocs**: a force layout in which positive relations pull and negative ones push, so
  alliances cluster on their own. The layout is stable between openings (seeded; positions may be
  cached in plugin data, never in notes). Click a node → faction view; double-click or modifier-click
  → open the note; click an arrow → open the note holding that value, at its line, with `why` in the
  tooltip.
- **Matrix.** Rows = who, columns = towards whom, each cell coloured with its number and step name.
  Asymmetry is visible as unequal mirror cells. Clicking a cell opens the slider (5.6).

Both modes share a **Public / True** toggle (5.4) and a **warnings** badge listing data problems with
links to their notes.

**Characters in the world view.** The world view draws factions only. Characters outside any faction
(the party, Elder Wren, Brannoc) are gathered in one pseudo-faction frame "Unaffiliated" (and the party
in its own frame "Party", from `type: character`), so their relations have a place to be drawn and
opened. A faction's relation to a character (the Choir → Sable) is drawn in the faction view of that
faction, not in the world view.

### 5.2 Faction view

The level below the world view: one faction (or sub-faction) as a frame with its members inside, the
other factions as boxes around it. Arrows from members (and from the faction itself) to other
factions and to other characters: **dashed and thin when inherited, solid and thick when the member
has its own value**. A character targeted from here who is not a member appears as a small external
node beside its own faction's box (or beside "Unaffiliated"). A member whose own values deviate from
its faction's carries a ring. "Party" and "Unaffiliated" open in this view like any faction, which is
where Orrin → Mira and Ilex → Sable are drawn. Breadcrumb back to the world view. Same Public / True
toggle and click behaviour as 5.1.

### 5.3 Tension panel

A side panel (or a section of the world view) listing interesting contradictions, each line linking
to the notes involved:

- strong one-sidedness: |A→B − B→A| ≥ 4;
- a member deviating from its faction by ≥ 3 on any relation (possible traitor or hook);
- public face and true stance differing by ≥ 3;
- allies (≥ +3 both ways) standing on opposite sides (one ≥ +3, the other ≤ −3) towards a third.

Thresholds in the settings.

The panel **follows the Public / True toggle**: in Public mode it computes from public values only and
leaves out the public-vs-true rule; only True mode shows all four. The same holds for arrow tooltips:
history lines logged inside a `[!gm]` callout appear only in True mode. Every derived output
(resolution, tension, history) therefore takes the mode as a parameter from phase 1 on.

### 5.4 Public face and true stance

`relations` is the public face; `secret_relations` the true stance. Every view has a toggle; **Public
is the default** each time a view opens, so a shared screen never shows secrets by accident. True mode
draws differing relations hatched and marks them. Rule for later modules: anything player-facing reads
`relations` only and never `secret_relations` — one function provides the public set, everything
player-facing uses it.

### 5.5 Power and sub-factions

See 4.2. Power changes only node size; it never weights any computation.

### 5.6 Editing in place

- In the matrix cell and on a selected arrow: a slider −5 … +5 with the step name.
- In the faction note's reading view: a compact relations block (a post-processor at the top of the
  note, or a ` ```factions ``` ` code block — builder's call) with one slider per relation.
- **Which note gets the write: always the subject's own note** — the row of the matrix, the tail of the
  arrow, the note whose block it is. Moving the slider on an inherited value (Bench → Order, Isolde
  Ferrant) or on an empty cell **creates an own value there**, an override; the source note higher up
  is never touched from below. To change the faction's line, edit the faction's row. The log line
  names the subject.
- In **True mode** the slider writes `secret_relations`; in Public mode `relations`. Where the true
  stance only falls back to the public one, moving the True slider creates the `secret_relations` entry.
- Overrides are never removed silently: an own value equal to the inherited one stays. A **"Reset to
  inherited"** action next to the slider removes the key explicitly.
- **How the write happens:** the YAML of the example vault carries comments, and Obsidian's
  `processFrontMatter` re-serialises the frontmatter and drops them. So writes are **line edits through
  `vault.process`**: change the digits of one existing value line; or insert one new `Key: value` line
  under an existing `relations:` / `secret_relations:` block (creating that block's header line before
  `tags:` or at the end of the frontmatter when missing); or delete one line for a reset. The
  `{ value, why }` form changes only its `value:` line. A line the editor cannot place with certainty
  (flow-style maps like `relations: {}`, unusual indentation) is refused with a notice, never guessed;
  `relations: {}` from the template is the one flow form the editor must handle (replace with a block).
  These edits are pure functions over the note's text and carry their own tests.

### 5.7 History in the views

From the parsed history lines (4.6): each arrow's tooltip shows its last changes ("−2 → −3 in S14").
The fuller "time machine" (replay the graph at session N) is a later idea, not in this design.

## 6. Phasing (each phase ends with the maintainer's review)

1. **Skeleton and data** — plugin scaffold (sample plugin, pnpm, strict TS, esbuild, Vitest, eslint,
   CI, commit-msg hook), campaign scope, faction/member discovery, relation parsing with inheritance
   and all warnings, as pure functions with tests against the example vault's cases.
2. **World view** — graph with blocs layout and matrix, toggle, click behaviour, colours, step names,
   warnings badge, Public/True toggle.
3. **Faction view and tension panel.**
4. **Editing and history** — sliders and the line editor, the shared "tonight's session" package with
   the offer to create session N+1, logging, history in tooltips.

## 7. Left to the builder

- Graph rendering: SVG plus a small force-layout dependency (e.g. `d3-force`) is the expected route;
  a heavier graph library needs a short justification first (root `CLAUDE.md`).
- Exact drawing of sub-factions in the world view (nested or adjacent).
- Post-processor block vs code block for in-note sliders.
- File layout inside `plugins/<id>/` and what goes into a shared `packages/` module.

## 8. Calls I made without the maintainer (check these)

- Both `factions.md` and folder-named faction notes are recognised (the maintainer chose the name
  `factions.md`, not whether folder notes also count).
- Faction name = `name:` else folder name; character key = note base name. Key matching, aliases and
  duplicate names are left to the builder, recorded in `DECISIONS.md`.
- Faction beats character when a key matches both.
- True stance: the most specific level speaks first, secret before public at each level (4.3).
- Members inherit their faction's relations to characters too; a member's own relations never pass on.
- "Unaffiliated" and "Party" pseudo-factions give characters outside factions a place in the views.
- The tension panel and tooltips follow the Public / True toggle.
- Sliders always write the subject's own note; inherited values become overrides; removal only via
  "Reset to inherited"; writes are line edits, not `processFrontMatter`, to keep YAML comments.
- "Tonight's session", including the offer to create session N+1, is a shared package built in phase 4.
- Hand edits are not logged to the session; only edits through the plugin's sliders offer to log.
- The Public view is the default every time a view opens.
- Tension thresholds (4 / 3 / 3 / ±3) and the German step names.
- The second round of ideas (time machine, domino preview, faction turn, party node, what the players
  believe, rumour mill, go-betweens) is not part of this design.

## 9. Name, id and licence (decided 2026-10-24)

- **Name** `dnd5e-byLokianer` (the maintainer's choice), **id** `dnd5e-bylokianer` — plugin ids are
  lowercase; the id never changes after release. Folder: `plugins/dnd5e-bylokianer/`.
- **Licence: MIT** (the maintainer's choice, after first asking for "free except commercial"). MIT
  allows commercial use without payment; that was accepted knowingly.
- Rhizom code is carried over under MIT by the maintainer's explicit relicensing (sole author),
  recorded in `DECISIONS.md`.
- To check before the first release: the name against Wizards of the Coast's trademark rules — "D&D"
  is a trademark; "5e" and SRD content under CC-BY-4.0 are the usual safe ground, and the plugin must
  not ship non-SRD rules text.
