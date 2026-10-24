# Faction world view — design

Date: 2026-10-24. Status: **approved and built** (2026-10-24; the maintainer let phase 3 go ahead before checking phase 2 in Obsidian). Module: factions, **phase 3**.
Build only after phase 2 (faction card) is accepted in Obsidian and this spec and its plan are
approved.

Builds on [`2026-10-24-factions-design.md`](2026-10-24-factions-design.md) §4.4 (step names), §4.5
(colour), §5.1 (world view), §5.4 (Public / True) and on phase 2's faction card
([`2026-10-24-faction-editor-design.md`](2026-10-24-faction-editor-design.md)), which this view
uses as its editor.

Decided with the maintainer on 2026-10-24: the view opens in **its own tab**; the layout uses
**d3-force** (rendering stays our own SVG).

## 1. Intent

All factions of the campaign at a glance — who stands how towards whom, as colour — in two
switchable forms: a **graph** in which alliances cluster on their own, and a **matrix** in which
every value can be read exactly. Public face by default, the true stance on request.

## 2. Goals, non-goals, anti-goals

**Goals**

- An Obsidian tab "Faction world", opened by a command and a ribbon icon.
- Graph and matrix, switchable in the view header; Public / True toggle, **Public each time the view
  opens**; a warnings badge that opens the warnings modal.
- Graph: factions as nodes sized by `power`, sub-factions beside their parent, the Party and
  Unaffiliated as frames listing their characters, directed arrows coloured by value, dangling
  targets as ghost nodes, a bloc layout (positive relations pull, negative push), stable between
  openings.
- Matrix: rows = who, columns = towards whom, each cell coloured with number and step name;
  inherited values set apart from own ones.
- Click behaviour that leads into the notes — and, for a value, into the faction card on the entry
  that holds it, so editing needs no new UI.
- Step names editable in the settings (design §4.4), used by the card and this view.

**Non-goals (this phase)**

- No faction view and no tension panel (phase 4). Clicking a node therefore selects it here; it does
  not open a faction view yet.
- No sliders in the matrix or on arrows, no history in tooltips (phase 5). Editing happens in the
  card the click leads to.
- No faction-to-character arrows (they belong to the faction view, design §5.1).
- No export, no image download.

**Anti-goals — it fails even if it works when**

- a secret stance shows while the toggle says Public;
- the layout jumps on every metadata change or every opening;
- the view rebuilds while the GM types in a note (it rebuilds only when the faction world changed,
  through the phase 2 world cache);
- colour is the only carrier of a value anywhere.

## 3. Constraints

Root `CLAUDE.md` in full; in particular `isDesktopOnly: false` (pan and zoom by touch too), no
`innerHTML` (SVG built with `createSvg`), Obsidian CSS variables only, text ≥ 16 px, dark theme first,
English and German, no default hotkey, listeners through `registerEvent` / `registerDomEvent`.

**Dependency (justification).** `d3-force` 3.0.0 (ISC, ~90 kB unpacked, three tiny d3 dependencies,
no DOM): a tested many-body / link / collision simulation; writing our own would be several hundred
lines of numerics with the same result. Only the layout uses it, through one pure module. No other
d3 package, no graph library.

## 4. The view

### 4.1 Header

```
[ Graph | Matrix ]   [ Public | True ]                      ⚠ 6 warnings   ⟳
```

- **Graph / Matrix**: remembered per vault (plugin data); default Graph.
- **Public / True**: always Public when the view opens (design §5.4). True mode shows a hatched
  border and a "true" tag on everything whose true value differs from the public one.
- **Warnings badge**: the count from the world; click opens the phase 1 warnings modal (with Fix).
  Hidden at zero.
- **⟳ Re-layout**: forgets cached positions and lays the graph out afresh.
- No campaign → the view says "No campaign note found" with a one-line hint (`type: campaign`).

### 4.2 Graph

**Nodes**

- **Faction**: a circle, radius from power (1 … 5 → 22 … 46 px), the name below it (16 px), the
  power as pips inside on hover/selection. Sub-factions are ordinary nodes, held near their parent
  by a strong, short link, and joined to it by a thin dashed line (no arrow).
- **Party / Unaffiliated**: a rounded frame with its title and one row per character. A character's
  relations to factions start at its own row. A frame without characters is not drawn.
- **Ghost**: a dashed circle for a dangling target (`?The Salt Kings`), named, without power.

**Edges**

- One arrow per relation the source's **own note** states towards a faction, sub-faction, ghost — in
  the current mode (Public: `relations`; True: the true stance of design §4.3 at the source's own
  level). Inherited values are not drawn as arrows (they would repeat the parent's lines); the
  matrix shows them.
- Colour from the value (phase 2's `stepColour`), width 2 px (3 px when selected), arrowhead at the
  target. Both directions present → two arrows bowed apart, so one-sidedness is visible.
- Tooltip (SVG `<title>`): `Order of the Lantern → The Gutter Court: −3 hostile` plus the `why` as
  text.

**Layout (blocs)**

- d3-force with: many-body repulsion; collision by radius; a link force per relation pair whose
  distance shrinks with a positive value and grows with a negative one (A→B and B→A summed); the
  sub-faction link (short, strong); a weak centring force.
- **Static, not animated**: the simulation runs a fixed number of ticks off-screen, then the result
  is drawn once. Initial positions are deterministic (sorted by id); the result is cached in plugin
  data per campaign, and the next layout starts from the cache, so a small change moves little.
- Dragging a node pins it there (cached); ⟳ releases all pins.

**Pan and zoom**: drag the background to pan, wheel or pinch to zoom (0.3 … 3), "fit" on open.

**Clicks**

- Node: **select** — the node and its arrows stay bright, everything else dims; click the background
  to clear. Double-click or Ctrl/Cmd-click: open the faction's note (Ctrl/Cmd: new tab).
- Arrow: open the note holding the value and focus its row in the faction card (phase 2's Fix
  mechanism, target = field + key).
- Character row in a frame: open that character's note; its arrow: as any arrow.

### 4.3 Matrix

- Rows and columns: the real factions, sub-factions indented under their parent, then a "Party" and
  an "Unaffiliated" group of characters as rows only (their relations towards factions; built:
  only characters with at least one such relation get a row); ghosts as
  extra columns at the end.
- A cell: background from the value, the signed number, the step name; empty when there is no
  relation (not 0). A value the row only **inherits** (stance with `inherited: true`) is shown with a
  dashed border and muted text, tooltip "inherited from The Gutter Court".
- The diagonal is blank. Header row sticky, first column sticky; the table scrolls inside the view.
- Click a cell: open the note that holds the value — the row's own note for an own value, the
  source's note for an inherited one — and focus that entry in the card; an empty cell opens the
  row's note with the card's "+ Add relation" focused and the target filled in.
- Asymmetry is visible as unequal mirror cells; no extra marking in this phase (the tension panel
  comes in phase 4).

### 4.4 Step names (settings)

Settings → dnd5e-byLokianer → **Step names**: eleven text fields −5 … +5, placeholder = the default
of the current language; empty = default. Used by the card, the graph tooltips and the matrix.

## 5. Behaviour

- The view subscribes to the phase 2 world cache; a rebuild of the world redraws the view, keeping
  zoom, pan, selection and mode. The layout re-runs only when the set of nodes or relation pairs
  changed (compared by key); a changed value only recolours.
- Opening the view twice reveals the existing tab instead of a second one.
- Mobile: the header wraps; the matrix scrolls both ways; touch pan and pinch zoom.

## 6. Architecture

```
src/factions/world-graph.ts   nodes and edges for a mode (pure): factions, sub-faction links,
                              frames with character rows, ghosts, own relations, true-differs flag
src/factions/matrix.ts        rows, columns, cells for a mode (pure), using stance() with inheritance
src/factions/layout.ts        d3-force run (pure, no DOM): nodes + edges + cached positions → positions
src/factions/steps.ts         + custom step names
src/obsidian/world-view.ts    the ItemView: header, mode switches, subscription to the world cache
src/obsidian/world-graph-svg.ts  SVG drawing, pan/zoom, selection, clicks
src/obsidian/world-matrix.ts  the table
src/obsidian/settings.ts      + step names
src/obsidian/card-view.ts     + focus on a (field, key) target and on "add relation for X"
```

Positions and the Graph/Matrix choice go into plugin data (`data.json`), never into notes.

## 7. Calls I made without the maintainer (check these)

- Node click selects (no faction view yet); double-click / Ctrl-click opens the note.
- Arrows only for a source's own values; inherited ones appear in the matrix only.
- Party and Unaffiliated as frames with one row per character, their arrows starting at the row.
- Sub-factions as nodes beside the parent with a dashed tie, not drawn inside it.
- Static layout (computed, then drawn) instead of a live animation; positions cached per campaign;
  drag pins a node.
- Matrix and arrow clicks edit through the phase 2 card instead of a slider of their own (the sliders
  stay phase 5).
- Graph/Matrix remembered; Public/True always back to Public.
- Step-name settings arrive with this phase.
