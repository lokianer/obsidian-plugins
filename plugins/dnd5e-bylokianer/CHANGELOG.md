# Changelog

All notable changes to this plugin are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the plugin uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Faction data model: campaign scope, factions and members, relation parsing with warnings,
  public and true stances with inheritance.
- Command **Show faction warnings** (English and German): counts at the top, one card per note,
  warnings grouped as skipped, adjusted, names and notes, each with its key and — where a value was
  changed — what was written and what it is read as (`+7 → 5`). Ctrl/Cmd-click opens a note in a
  new tab.
- Warnings for two keys naming one target (`duplicate-key`) and for passed-over campaign notes
  (`campaign-ignored`); `power` warnings say whether the value was reset, rounded or clamped.
- Warning for a note whose frontmatter does not parse (`broken-frontmatter`), instead of dropping
  it silently.
- **Faction card** on faction and character notes, in Reading view and Live Preview, replacing
  Obsidian's Properties block there (a setting shows both): kind, place, name, power pips,
  relations as coloured rows with slider, step name and reason, secret relations, other fields —
  all editable in place as line edits that keep comments and formatting; refusals and concurrent
  edits end in a notice; Undo after removing a relation.
- **Faction world** tab: a graph with a bloc layout (d3-force) and a matrix of all factions,
  Public/True toggle (Public on opening), warnings badge; arrows and cells lead into the faction
  card; nodes can be pinned by dragging, positions are kept per campaign.
- **Faction view** inside the faction world: members, rings on those out of line, own and inherited
  arrows, breadcrumb; the frame and the boxes can be dragged, kept per faction, re-layout resets.
- **Tension panel** in the right sidebar with four rules and thresholds in the settings, following
  the Public/True toggle.
- **Value popover** on matrix cells and arrows: slider, reason, Reset to inherited, Open card;
  writes the subject's own note.
- **Session log**: after a relation change, a notice offers to log it under `## Log` of tonight's
  session note (secret changes in `[!gm]`), with a once-a-day offer to start session N+1 from the
  template; relation history in the views' tooltips. Shared package `packages/session`.
- **Step names** in the settings.
- **Fix** buttons in the warnings modal and the command **Edit faction data**.
- Plugin scaffold: manifest, build with esbuild, Vitest, eslint with Obsidian's rules, CI on Linux,
  macOS and Windows.

### Changed

- A cleaner look closer to Obsidian across card, faction world, faction view, tension panel and
  warnings modal: no nested boxes or coloured side bars, headings in normal case, values as a soft
  tint of their colour behind normal text, icon buttons that appear on hover (always on phones),
  Obsidian's own slider style, list values styled like the theme's tags, graph nodes without power
  dots (power is their size), and the world view's re-layout and tension buttons in Obsidian's own
  tab header.

- An en dash (`–3`) reads as a minus; `0x3`, `1e0` and the like are no longer numbers; halves
  round away from zero on both sides.
- `Factions.md` is recognised in any case; a `factions.md` with another `type` is not a faction.
- Name clashes that differ only in case, or a faction named like another's folder, are warned about
  (`duplicate-name` now carries the clashing name).
- The warnings summary says "1 faction" / "1 warning" in the singular.

### Fixed

- The faction world's graph and faction view were drawn off-screen when the tab had no size yet at
  its first render (usual in Obsidian): the fit to the content now waits until the view is laid out.
- The graph showed only arrows, no factions or frames: a node's two classes were passed as one
  token, which Obsidian's `classList` rejects, so drawing stopped at the first node. SVG classes are
  now always separate tokens.
- In the faction view a short faction's name ran into its power ("The Drowned Choir" over "Power
  5"): the frame, member chips and boxes now grow with their labels.
- In the faction view members with an arrow between them stood edge to edge, so only an arrowhead
  showed: they are now placed side by side with a wider gap, and an arrow with a reverse one runs
  beside it instead of on top.

### Changed (after the first check in Obsidian)

- The log notice shows the change and a full-width, accent-coloured **Log → Session …** button, and
  stays ten seconds instead of six.
