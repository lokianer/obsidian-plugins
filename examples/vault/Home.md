# Example vault

A test vault for the plugins in this repository. Open this folder (`examples/vault`) as a vault in Obsidian, then enable the plugin you are working on.

The campaign is **Silverstadt**, a city of tides, bells and records — see [[Campaign]]. It is carried over from Rhizom's example vault and rebuilt for the new folder conventions.

## What to test where

| Feature | Where to look | What is special there |
| --- | --- | --- |
| Faction world view (graph + matrix) | `Silverstadt/Factions/` | Four factions and one sub-faction; one-directional values (Order → Court −3, Court → Order −4) |
| Faction opened up | [[Order of the Lantern/factions\|Order of the Lantern]] | [[Isolde Ferrant]] inherits everything, [[Aldric Thane]] deviates, [[Sergeant Pell]] deviates gently |
| Public face vs true stance | [[The Bench/factions\|The Bench]], [[Sable]], [[Mira Voss]] | `secret_relations` that contradict the public value |
| Reasons on arrows | Order, Archivists, Aldric, Corvin | Structured `{ value, why }` entries next to plain numbers |
| Sub-factions | `The Gutter Court/The Bench/` | Inherits from the Court, overrides one value |
| Tension panel | [[Ondine Vale]] (−5 against a Court her faction likes), Bench vs Court | Strong deviations and secret contradictions |
| Character → character | Aldric → Mira, Sable → Mira, Orrin → Mira | Relations between people, not factions |
| Broken values | [[The Drowned Choir/factions\|The Drowned Choir]] | Out of range, not a number, dangling, self, empty — each must warn, none may crash |
| Faction world: graph | Open faction world | Blocs (the Order and the Court far apart), Bench tied to the Court, Ilex's and Elder Wren's arrows leaving their frames, The Salt Kings as a ghost; True mode: The Bench → Order dashed (+4 instead of the Court's −4) |
| Faction world: matrix | Open faction world → Matrix | The Bench's row inherits −4 from the Court (dashed); empty cells offer Add relation; Orrin Quill has no row (no faction relation) |
| Faction view | Faction world → click The Gutter Court | Mira Voss and The Bench ringed (out of line), Sable not; click Mira: her inherited −4 towards the Order dashed; click The Bench to go deeper |
| Tension panel | Faction world → lightning button | Public: Ondine Vale, Mira Voss, Aldric Thane, Corvin Marsh out of line; True adds The Bench and Sable, and public vs. true for The Bench, Mira, Sable and the Order |
| Faction card | [[The Drowned Choir/factions\|The Drowned Choir]], [[Corvin Marsh]], [[Sable]], [[The Bench/factions\|The Bench]] | Choir: every Fix button; Corvin: a reason rendered as a link; Sable: secret relations closed until opened; Bench: place shown as The Gutter Court |
| Broken frontmatter | [[Brother Silt]], [[The Missing Bellringer]] | YAML that does not parse (an unclosed list, an unclosed quote): the note is named in the warnings, never dropped silently |
| Relation history | [[Session 14 – Bell Square]] | A log line `Order of the Lantern → The Gutter Court: −2 → −3`; it shows in the tooltip of that arrow and matrix cell as `−2 → −3 in S14` |
| Value popover | Faction world → Matrix → The Bench × Order of the Lantern | Public: inherited −4 from the Court (moving it gives The Bench its own value); True: its own secret +4 with Reset to inherited |
| NPC builder / stat blocks | [[Isolde Ferrant]], [[Ondine Vale]], [[Aldric Thane]], [[Mira Voss]] | Full 5e stat blocks; [[Sergeant Pell]] has none yet |
| Battle tracker | [[Ambush under the second arch]] | Party, a named NPC, groups with `count`; provisional format |
| Dice and tables | [[Street Rumours]] | List (d6), ranged table with mixed dashes (1d8), table with a gap (d20) |
| Decks | [[Omens of the River]] | Two of eight cards already drawn |
| GM gate | Almost every note | `[!gm]` callouts with and without `revealed:`, `%%comments%%`, a link hidden in a comment |
| Tonight's session | `Silverstadt/Sessions/` | Session 14 is dated in the past → the first "Log" of a day offers Session 15 from `Templates/Session.md` |

## Conventions used here (provisional)

- A faction is a folder holding a `factions.md`; the notes beside it are its members.
- Relations in frontmatter: `relations:` (public) and `secret_relations:` (GM only), keyed by faction folder name or character note name, values −5 … +5, either a plain number or `{ value, why }`.
- `power: 1–5` on a faction sets its size in the graph.
- Links to a faction point at its `factions.md` by path, e.g. `[[The Gutter Court/factions|The Gutter Court]]`.
