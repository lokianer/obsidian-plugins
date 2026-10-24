# dnd5e-byLokianer

Game-master tools for D&D 5e in Obsidian. The first module covers **factions and their relations**:
factions are folders holding a `factions.md`, relations are frontmatter values from −5 (war) to +5
(sworn), and members inherit their faction's stance unless they state their own. Later modules: an
NPC builder with 5e stat blocks, a battle tracker and dice.

Status: phase 1 of the factions module (data model) is done; the command **Show faction
warnings** lists every note the plugin could not read cleanly. See the repository's
`ROADMAP.md` and the design in `docs/superpowers/specs/2026-10-24-factions-design.md`.

## Conventions

```yaml
# Factions/The Gutter Court/factions.md
type: faction
power: 3            # 1–5, node size
relations:          # the public face
  Order of the Lantern: -4
  The Archivists:
    value: 1
    why: "[[Mira Voss]]"
secret_relations:   # the true stance, GM only
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

No default hotkeys are set; assign your own under Settings → Hotkeys.

## Licence

MIT — see [LICENSE](LICENSE).
