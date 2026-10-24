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
| Faction card | [[The Drowned Choir/factions\|The Drowned Choir]], [[Corvin Marsh]], [[Sable]], [[The Bench/factions\|The Bench]] | Choir: every Fix button; Corvin: a reason rendered as a link; Sable: secret relations closed until opened; Bench: place shown as The Gutter Court |
| Broken frontmatter | [[Brother Silt]], [[The Missing Bellringer]] | YAML that does not parse (an unclosed list, an unclosed quote): the note is named in the warnings, never dropped silently |
| Relation history | [[Session 14 – Bell Square]] | A log line `Order of the Lantern → The Gutter Court: −2 → −3` |
| NPC builder / stat blocks | [[Isolde Ferrant]], [[Ondine Vale]], [[Aldric Thane]], [[Mira Voss]] | Full 5e stat blocks; [[Sergeant Pell]] has none yet |
| Battle tracker | [[Ambush under the second arch]] | Party, a named NPC, groups with `count`; provisional format |
| Dice and tables | [[Street Rumours]] | List (d6), ranged table with mixed dashes (1d8), table with a gap (d20) |
| Decks | [[Omens of the River]] | Two of eight cards already drawn |
| GM gate | Almost every note | `[!gm]` callouts with and without `revealed:`, `%%comments%%`, a link hidden in a comment |
| Tonight's session | `Silverstadt/Sessions/` | Session 14 is dated in the past → offer Session 15 |

## Conventions used here (provisional)

- A faction is a folder holding a `factions.md`; the notes beside it are its members.
- Relations in frontmatter: `relations:` (public) and `secret_relations:` (GM only), keyed by faction folder name or character note name, values −5 … +5, either a plain number or `{ value, why }`.
- `power: 1–5` on a faction sets its size in the graph.
- Links to a faction point at its `factions.md` by path, e.g. `[[The Gutter Court/factions|The Gutter Court]]`.
