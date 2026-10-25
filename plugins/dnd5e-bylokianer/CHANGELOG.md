# Changelog

All notable changes to this plugin are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the plugin uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- **Experience points are optional** (setting **Experience points**, off by default): off, the
  encounter builder shows no XP — the difficulty tiles describe the danger, the preview fills the
  budget as a percentage and still rates the encounter — and the battle log's end line carries no
  XP. Milestone levelling needs nothing from the plugin.

- **Encounter builder** (battle tracker, phase B3): **New encounter** (command, or + in the Battle
  tab) opens a builder in the New NPC dialog's style — the campaign's party with their levels as
  chips, Low / Moderate / High with the XP budget of the SRD 5.2.1, the Monster Manual's monsters
  (SRD and own) as tiles with counts, and the XP spent against the budget live beside it, with how
  hard the encounter is. It writes a `type: encounter` note into the encounter folder (setting,
  `Encounters`) and shows it in the Battle tab. **Add to encounter** on a Monster Manual card puts
  the monster into an encounter note (the same monster again raises its count).

- **Battle tracker: log and Monster Manual** (phase B2): the fight's moments — it begins, a
  combatant is defeated, goes down or dies, it ends with the defeated enemies' XP — as lines under
  `## Log` of tonight's session (setting **Battle log**: offered in a notice, written
  automatically, or off). **Add to combat** on a Monster Manual card puts the monster into the
  running fight; in the tab, a monster, a note or a written combatant (with HP and AC) joins under
  the order, and **Remove from fight** on the card takes one out. A member of a group already
  fighting shares its initiative and gets the next number; combatants added mid-fight come back
  with their stat block after a restart.

- **Battle tracker** (module 6, phase B1): **Open battle tracker** (command, or the swords in the
  ribbon) opens a tab that runs a fight from a `type: encounter` note. The campaign's party joins
  by itself; combatants come from note links (frontmatter `ac` / `hp` / `initiative`, else their
  stat block), from the Monster Manual (`monster: Owlbear`) and written inline, each with a `count`
  — a group rolls one initiative and is numbered. Characters' initiative is typed in or rolled;
  rounds and turns skip the defeated; damage, healing and temporary hit points; death saves for
  downed characters; the SRD's conditions with durations that count down; concentration with the
  Constitution save's DC as a notice. The fight is kept in the note's `## Combat` table and read
  back from it. English and German.

- **Monster import**: the monster builder reads monsters from a file — Fantasy Statblocks YAML or
  JSON, Markdown notes with stat blocks, 5e-bits and Open5e JSON, 5etools bestiaries (tags turned
  into text). One fills the form; several become tiles, with **Create all** writing them as own
  monsters.

- **Own monsters and the monster builder** (Monster Manual, phase M3): `type: monster` notes with a
  stat block join the Monster Manual, marked "own", their card opening the note. **New monster**
  (command, or + in the Monster Manual) opens a builder in the New NPC dialog's style — start from
  an SRD monster or from nothing, every part of the stat block as a field, the stat block live
  beside it — and writes the note.

- **Monster Manual** (module 5, phase M1): the 334 SRD monsters in their own tab, built like the
  spellbook — search in English or German, challenge rating bands, type, size, movement, legendary
  and spellcaster filters, a list by challenge rating and the stat block as the card with spell
  links; German names and German stat block headers and lines (metres); Insert into note and Make a
  note. Generated from the 5e-bits SRD data by `scripts/monsters-from-srd.mjs`, checked in tests.

- Spell builder: **casting time and duration are dropdowns** of every value the SRD's spells use,
  shown in your language; a spell copied or imported keeps its own value as an extra option.
- **Spell builder**: **New spell** (command, or + in the spellbook) — a dialog in the New NPC
  dialog's style with a live preview: start from an SRD spell (its text in your language), fill it
  by hand, or load a JSON file (own keys, 5e-bits or Open5e format); writes a `type: spell` note in
  the spell folder (new setting) and opens it in the spellbook.

### Changed

- The **deck builder** is laid out like the New NPC dialog: settings rows, source tiles, numbered
  card rows and a live preview of the deck and the card being edited.

- **Spell links and own spells** (spellbook, phase S3): spell names in a stat block's Spellcasting
  trait are links that open the spellbook on that spell; notes with `type: spell` (level, school,
  casting time, range, components, duration, classes … in English or German; the description and
  "At Higher Levels" as the body) join the spellbook, marked "own", with a button to open the note.

- **Own decks, deck builder and reset** (Deck of Many Things, phase D2): every `type: deck` note of
  the campaign can be drawn from in the Deck tab (picked in a list, remembered); returning decks
  with `leaves` and `ends`, or decks whose drawn cards stay out. **New deck** opens a builder —
  cards typed in, copied from the standard deck, pasted (`Name — effect`, lists, table rows) or
  imported from a JSON file — and writes the deck as a note in the deck folder (new setting). A
  reset button clears the draw history, or the history and every ticked card.

- **Deck of Many Things** (module 4, phase D1): a tab drawing from the SRD deck (22 cards, 13 as a
  setting) by its rules — declared draws, the Fool's redraw, the Jester's and the Idiot's extra
  draws, The Void and Donjon ending the drawing, the Fool and the Jester leaving the deck. Cards
  turn over and show their playing card, both names and the effect in English or German. The state
  and draw history live in a `type: deck` note made on the first draw; edits by hand show in the
  tab. Command **Open Deck of Many Things** and a ribbon icon.

- **German spell texts** (spellbook, phase S2): the descriptions, "At Higher Levels" and materials of
  all 319 spells in German — German dice notation (8W6), distances in metres, weights in kilograms,
  the German rules terms; tested for completeness and for keeping every numbered die of the
  English text.
- **Spellbook** (module 3, phase S1): its own tab (command and ribbon icon) with the 319 SRD 5.1
  spells — search in English and German, level and school chips with counts, filters for class,
  casting time, damage, saving throw, concentration and ritual; a list grouped by level in the
  schools' colours, keyboard navigation, and a spell card accented by its school with the level
  line, casting time, range, components, duration, badges, description and classes, switchable
  between English and German. German names for every spell, German meta with distances in metres;
  descriptions in English until phase S2. Filters are kept.
- **A fancier New NPC dialog** (NPC builder, phase 4b): a live preview card beside the form; race
  and archetype as tiles with a search (archetypes by challenge with AC · HP · CR, a free race when
  no tile fits); the class from tiles of the twelve SRD classes (or free text), written in English;
  **Roll everything** with a lock per field — typing locks a field, picking a race
  locks the race. German race tiles give distances in metres.
- **Races and richer dice** (NPC builder, phase 4a): the nine SRD races and own `type: race` notes
  in New NPC, writing their traits into the stat block and steering name, looks and age; command
  **New race**; dice texts in English and German (Obsidian's language or a setting), each table at
  least fifty entries; new fields occupation, age, build, voice, ideal, bond, flaw, secret, hook.
- **Editing in the stat block** (NPC builder, phase 3): values, ability scores and entries of an
  opened block are edited in place as line edits; entries added and removed (with Undo); command
  **New archetype** writes an archetype note from a base, opened for editing.
- **New NPC** (NPC builder, phase 2): a dialog (command, and a button on faction cards) that writes
  an NPC note from the template into the faction's folder, with dice tables for name and
  personality and a stat block from an archetype — the SRD NPCs or the GM's own `type: archetype`
  notes; table notes replace default tables; command **Add stat block** for an existing note;
  settings for the NPC template, archetype and tables folders and the folder for NPCs of no faction.
- **Stat blocks** (NPC builder, phase 1): ` ```dnd5e-statblock ` blocks render as 5e stat blocks
  (Fantasy Statblocks' keys, ability modifiers, XP, proficiency bonus); command **Convert stat block**
  between the two block names; short stats (AC, HP, CR, speed, ability modifiers) on a character's
  card under the title, the full block folded behind one line in the note; `AC · HP · CR` in the
  faction view's member tooltips; the 21 SRD 5.1 NPC stat blocks as data, with attribution.
- UI smoke tests in happy-dom for every view.
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

- **Faction world, redesigned** closer to Obsidian's graph and canvas: each faction in a colour of
  Obsidian's palette (shared by its sub-factions and members; red, yellow and green stay with the
  values) with its initials in the disc and its name on a pill; the canvas dot grid moving with pan
  and zoom; hovering a faction lights its arrows and neighbours, dims the rest and shows the values
  on the arrows; Party and Unaffiliated as cards with a header and a count; floating zoom and fit
  buttons and a −5 … +5 colour scale. The matrix sits on a card like an Obsidian table, with colour
  dots and initials on rows and columns, a crosshair on the hovered cell's row and column and
  hatched self cells. The faction view follows the same look: the faction as a card in its colour
  with an initials disc, members as pills with a colour dot, the factions around as cards, hover
  lighting an element's arrows with their values.
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

- Leading spaces in a few SRD monster texts (the Druid's quarterstaff) are trimmed when the data is
  generated.

- Three broken dice in the SRD source data (Moonbeam's "1dl0", Reincarnate's "d 100", Symbol's
  "10d 10") are repaired when the spell data is generated.
- A stat block with an empty challenge rating counted as CR 0 (`crValue('')` read `Number('')`).
- A link in another field of the card (`leader: "[[Isolde Ferrant]]"`) showed as plain text; it
  is now a link that opens the note (Ctrl/Cmd: new tab), and links in reasons open the same way.
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

- A new session note takes over the last session's loot, each row or item marked with the session
  it came from (an earlier origin is kept); command **Start next session** creates it on demand.
- The log notice shows the change and a full-width, accent-coloured **Log → Session …** button, and
  stays ten seconds instead of six.
