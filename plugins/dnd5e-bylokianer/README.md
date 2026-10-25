# dnd5e-byLokianer

Game-master tools for D&D 5e in Obsidian. The first module covers **factions and their relations**:
factions are folders holding a `factions.md`, relations are frontmatter values from −5 (war) to +5
(sworn), and members inherit their faction's stance unless they state their own. Later modules: an
NPC builder with 5e stat blocks, a battle tracker and dice.

Status: the factions module is built and accepted in Obsidian (phases 1–5: data model, faction card, world view, faction view and tensions, in-view editing and history). See the repository's
`ROADMAP.md`, the design in `docs/superpowers/specs/2026-10-24-factions-design.md` and the card's
design in `docs/superpowers/specs/2026-10-24-faction-editor-design.md`.

## The faction card

Faction and character notes of the campaign open with a **faction card** where Obsidian's
Properties block would be, in Reading view and Live Preview: kind and place, name and power, every
relation as a coloured row with its value, step name and reason, the secret relations (closed until
you open them) and the note's other fields. Everything in it is editable in place — drag a slider,
click a name, a reason, a power pip. Source mode still shows the raw YAML.

Each change rewrites only the characters it changes in the frontmatter: comments, order and quoting
of everything else stay as they are. If the note was edited elsewhere in the meantime, or a line is
written in a way the card cannot edit safely (flow style `{ … }`, anchors, tabs), nothing is written
and a notice says why — **Edit in source** jumps to the line. Lists such as `tags` are shown but
edited in source.

Settings: **Show Obsidian's properties on faction notes** brings the Properties block back beside
the card; **Step names** renames the eleven steps from −5 to +5 (empty keeps the default);
**Tension thresholds** set when the tension panel reports something; **Session template** is the
note a new session note is made from.

## The faction world

**Open faction world** (command or ribbon icon) opens a tab with all factions of the campaign:

- **Graph** — factions as circles sized by power, sub-factions tied to their parent, the Party and
  the unaffiliated characters as frames, unknown targets as dashed ghosts. Arrows are coloured from
  red (−5) to green (+5); two arrows bow apart when both sides have a value. Friends cluster, enemies
  drift apart. Drag a faction to pin it, drag the background to pan, scroll or pinch to zoom.
- **Matrix** — who (rows) towards whom (columns), each cell with its number and step name; values a
  sub-faction or member only inherits are dashed.
- **Public / True** — Public every time the view opens; True adds the secret stances and marks
  where they differ from the public face.

Click an arrow or a cell to change that value in a small popover: the slider, the reason, where an
inherited value comes from, **Reset to inherited** and **Open card**. It always writes the subject's
own note — moving an inherited value gives the subject its own. Ctrl/Cmd-click a faction to open its
note.

**History.** After every change of a relation value (popover or card) a notice offers **Log →
Session 14**; a click adds a line such as `- 20:31 Order of the Lantern → The Gutter Court: −2 → −3`
under `## Log` of tonight's session note (the one with the highest `session:` number; secret changes
go into a `[!gm]` callout). If that note is from an earlier day, the plugin asks once a day whether to
start the next session from your session template; **Start next session** does the same on demand.
The new note takes over the last session's `## Loot` — table rows and list items, each marked with
where it came from (`(from [[Session 14 – Bell Square]])`, an earlier origin is kept) — so only the
newest session needs watching. The views' tooltips show each relation's last changes, read back from
those lines.

**Faction view.** Click a faction (or the Party / Unaffiliated frame) to open it: the faction as a
frame with its members, the factions it relates to around it, own values as solid arrows. Members
whose own values differ from their faction's line have a yellow ring. Click a member to see all its
stances, inherited ones dashed; click a sub-faction to go one level deeper; the breadcrumb leads
back. Drag the frame (it carries its members) or a box to move it; the view keeps it per faction,
and the re-layout button in the tab's header puts everything back.

**Tensions.** The lightning button in the tab's header (or **Show faction tensions**) opens a sidebar listing one-sided
pairs, members out of line, public faces hiding a different truth (True mode only) and allies split
over a third faction. It follows the world's Public / True toggle; thresholds are in the settings.

**Stat blocks.** A ` ```dnd5e-statblock ` block holds a 5e stat block in YAML — the keys Fantasy
Statblocks uses (`name`, `size`, `type`, `ac`, `ac_class`, `hp`, `hit_dice`, `speed`, `stats`,
`saves`, `skillsaves`, `senses`, `languages`, `cr`, `traits`, `actions`, `reactions`, …) — and
renders as a stat block with ability modifiers, XP and proficiency bonus worked out — folded behind
one line (`Stat block · name · AC 18 · HP 52 · CR 3`) where it stands in the note, opened with a
click. The numbers you need at the table sit higher up: a character's faction card shows AC, HP,
CR and speed and the six ability modifiers right under the title, from the note's first stat block
(either name). Its own block name keeps it apart from Fantasy Statblocks; **Convert stat block**
switches a note's blocks between the two names. The 21 NPC stat blocks of the SRD 5.1 come with the plugin for the NPC builder.

## Commands

- **Show faction warnings** — every note the plugin could not read cleanly, with a **Fix** button
  that opens the note's card on the broken entry.
- **Edit faction data** — focuses the card of the active note.
- **Open faction world** — the graph and matrix of all factions.
- **Show faction tensions** — the tension panel in the right sidebar.

No default hotkeys are set; assign your own under Settings → Hotkeys (for example Ctrl/Cmd+Shift+F
for Edit faction data).

## Conventions

```yaml
# Factions/The Gutter Court/factions.md
type: faction
power: 3 # 1–5, node size
relations: # the public face
  Order of the Lantern: -4
  The Archivists:
    value: 1
    why: '[[Mira Voss]]'
secret_relations: # the true stance, GM only
  The Archivists: -2
```

A note with `type: campaign` switches the plugin on for its folder and everything below it.

## Development

Requires Node 24 and pnpm 12.

```bash
pnpm install
pnpm build                 # main.js
pnpm test                  # Vitest: pure modules in Node, the views in happy-dom (test/ui)
pnpm lint && pnpm typecheck
pnpm install-example       # copies the build into examples/vault/.obsidian/plugins/
```

Then open `examples/vault` as a vault in Obsidian and enable **dnd5e-byLokianer** under Community
plugins.

## Licence

MIT — see [LICENSE](LICENSE).

## Attribution

This plugin includes material from the System Reference Document 5.1 ("SRD 5.1") by Wizards of the
Coast LLC, available at https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1 is
licensed under the Creative Commons Attribution 4.0 International License, available at
https://creativecommons.org/licenses/by/4.0/legalcode. See `src/npc/NOTICE.md`.
