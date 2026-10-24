# dnd5e-byLokianer

Game-master tools for D&D 5e in Obsidian. The first module covers **factions and their relations**:
factions are folders holding a `factions.md`, relations are frontmatter values from −5 (war) to +5
(sworn), and members inherit their faction's stance unless they state their own. Later modules: an
NPC builder with 5e stat blocks, a battle tracker and dice.

Status: phases 1 (data model), 2 (faction card) and 3 (world view) of the factions module. See the repository's
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
the card; **Step names** renames the eleven steps from −5 to +5 (empty keeps the default).

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

Click an arrow or a cell to open the note that holds the value with the faction card on that entry;
an empty cell offers to add the relation. Click a faction to highlight its relations, double-click
(or Ctrl/Cmd-click) to open its note.

## Commands

- **Show faction warnings** — every note the plugin could not read cleanly, with a **Fix** button
  that opens the note's card on the broken entry.
- **Edit faction data** — focuses the card of the active note.
- **Open faction world** — the graph and matrix of all factions.

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
pnpm test                  # Vitest
pnpm lint && pnpm typecheck
pnpm install-example       # copies the build into examples/vault/.obsidian/plugins/
```

Then open `examples/vault` as a vault in Obsidian and enable **dnd5e-byLokianer** under Community
plugins.

## Licence

MIT — see [LICENSE](LICENSE).
