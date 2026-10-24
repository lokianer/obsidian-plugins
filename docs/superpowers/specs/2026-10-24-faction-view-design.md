# Faction view and tension panel — design

Date: 2026-10-24. Status: **approved ("passt") and built** the same day; deviations in `DECISIONS.md` (no double-click on graph nodes, characters listed inside their box, no arrows between a faction and its own members). Module: factions, **phase 4**.

Builds on [`2026-10-24-factions-design.md`](2026-10-24-factions-design.md) §5.2 (faction view) and
§5.3 (tension panel), on phase 3's faction world
([`2026-10-24-world-view-design.md`](2026-10-24-world-view-design.md)) and on phase 2's faction
card, which stays the editor.

Decided with the maintainer on 2026-10-24: the faction view lives **inside the faction world tab**
(click a faction, breadcrumb back); the tension panel is a view in the **right sidebar**.

## 1. Intent

The level below the world: one faction with its members, where it becomes visible who toes the line
and who does not — inherited stances thin and dashed, own ones solid, deviating members ringed. And
beside it, a running list of the contradictions worth playing: one-sided grudges, members out of
line, public faces hiding a different truth, allies split over a third party.

## 2. Goals, non-goals, anti-goals

**Goals**

- Click a faction (or sub-faction, or the Party / Unaffiliated frame) in the graph → its faction view
  in the same tab, with a breadcrumb `World › The Gutter Court › The Bench`.
- The faction as a frame with its members (characters and sub-factions) inside, the other factions
  as boxes around it, characters it relates to beside their own faction's box.
- Arrows from the faction and its members: **solid** for own values, **dashed and thin** for
  inherited ones; a **ring** on members whose own values deviate from the faction's.
- A tension panel in the right sidebar with the four rules of design §5.3, thresholds in the
  settings, following the faction world's Public / True toggle.
- Everything clickable leads into the notes and the faction card, as in phase 3.

**Non-goals (this phase)**

- No sliders in the views and no history (phase 5).
- No time machine, domino preview or other "later ideas".
- No new data conventions.

**Anti-goals**

- The tension panel shows the public-vs-true rule, or any secret value, while the toggle says Public.
- The faction view drowns in arrows: inherited arrows are shown for one member at a time.
- The panel recomputes per keystroke (it follows the world cache).

## 3. Constraints

Root `CLAUDE.md` in full. No new dependency: the faction view's layout is computed directly (rings
and rows), not by d3-force.

## 4. Faction view

### 4.1 Opening and navigation

- In the graph, a **click on a faction, a sub-faction or a frame** opens its faction view (replacing
  phase 3's "click selects"; double- or Ctrl-click still opens the note).
- The header gains a **breadcrumb**: `World` (back to the graph or matrix) › the faction's parents ›
  the faction. Public / True, warnings badge as in phase 3; Graph / Matrix and re-layout are hidden
  while a faction view is open.
- The faction view is remembered while the tab lives (switching notes and back keeps it); a new tab
  starts at the world.

### 4.2 What it shows

```
                 ┌ Order of the Lantern ┐
                          ▲    ▲
   ┌ The Archivists ┐     ┊    │                ● Sable (The Gutter Court)
            ▲             ┊    │
   ╔══ THE GUTTER COURT ═════════════════════╗
   ║  Mira Voss   ◯Sable   ▣ The Bench        ║
   ╚═════════════════════════════════════════╝
                         ▼
                 ┌ The Drowned Choir ┐
```

- **The frame**: the faction's name, power pips, a row of member chips — its characters (directly or
  in plain subfolders) and its sub-factions (as boxed chips; click → their view). A chip has a
  **ring** when that member states an own value that differs from the faction's stance towards the
  same target.
- **Around it**: every other faction any arrow points to, as a box, placed on a ring around the
  frame in the **angle order of the world graph** (so the map stays familiar); boxes nothing points
  to are left out.
- **Characters** targeted from here who are not members: a small node beside their own faction's box
  (or a box for Party / Unaffiliated), labelled with their name.

### 4.3 Arrows

- **Default**: the faction's own values (from the frame's edge) and every member's **own** values
  (from its chip) — solid, 2 px, coloured.
- **A member selected** (click its chip): that member's full stance set — own values solid, inherited
  ones **dashed, 1.5 px** from the chip; everything else dims. Click again or the background to clear.
- Tooltip: `Mira Voss → The Archivists: −2 distrust · inherited from The Gutter Court` (or `own`),
  plus `why`.
- Click an arrow: the note holding the value, card focused on that entry (for an inherited arrow:
  the source's note — editing the faction's line is done there, design §5.6).
- True mode as in phase 3: true values, dashed outline where they differ from the public face.

### 4.4 Party and Unaffiliated

They open like factions: the frame holds their characters, no power, no own values (only the
characters' own arrows).

## 5. Tension panel

A view `dnd5e-tensions` in the right sidebar, opened by a command ("Show faction tensions") and a
button in the faction world header. It lists findings grouped by rule, each line a sentence with
links:

| Rule            | Finds                                                                         | Default threshold |
| --------------- | ----------------------------------------------------------------------------- | ----------------- |
| One-sided       | two factions both stating a value towards each other, differing by ≥ t        | 4                 |
| Out of line     | a member's own value differing from its faction's stance (same target) by ≥ t | 3                 |
| Public vs. true | an entity's true stance differing from its public one by ≥ t (**True only**)  | 3                 |
| Split allies    | A and B ≥ +t towards each other, one ≥ +t and the other ≤ −t towards a third  | 3                 |

- Values are stances with inheritance in the current mode; "out of line" compares own against
  inherited by definition.
- **Mode**: the panel follows the Public / True toggle of the open faction world tab (Public when
  there is none). In Public mode the public-vs-true rule is not computed at all.
- A line, e.g. `Ondine Vale → The Gutter Court −5, her faction The Archivists: +2 (Δ 7)`, links each
  name to its note; clicking the value opens the card on that entry.
- Empty rule groups are hidden; nothing at all → "No tensions above the thresholds".
- **Settings**: the four thresholds (number fields, 1 … 10).

## 6. Architecture

```
src/factions/faction-view.ts   the faction view model for an entity and mode (pure): members with
                               rings, surrounding boxes, external characters, own and inherited arrows
src/factions/tension.ts        the four rules (pure), thresholds as input, mode-aware
src/obsidian/faction-view-svg.ts  drawing the faction view; ring layout from world-graph angles
src/obsidian/world-view.ts     + breadcrumb, drill-down state, node click → faction view
src/obsidian/tension-view.ts   the sidebar ItemView
src/obsidian/settings.ts       + thresholds
```

## 7. Calls I made without the maintainer (check these)

- Node click in the graph now opens the faction view (selection on click is gone); double- or
  Ctrl-click opens the note.
- Inherited arrows only for the selected member, to keep the view readable.
- Surrounding factions only when an arrow points to them; placed in the world graph's angle order.
- "Out of line" counts own values that differ from the faction's stance by ≥ 3, whatever the sign.
- "One-sided" only when both directions exist (a missing direction is no relation, not 0).
- The tension panel follows the faction world's toggle; without an open world tab it is Public.
- Thresholds are global settings.
