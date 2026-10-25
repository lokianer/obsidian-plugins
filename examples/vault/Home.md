# Example vault

A test vault for the plugins in this repository. Open this folder (`examples/vault`) as a vault in Obsidian, then enable the plugin you are working on.

The campaign is **Silverstadt**, a city of tides, bells and records — see [[Campaign]]. It is carried over from Rhizom's example vault and rebuilt for the new folder conventions.

## What to test where

| Feature | Where to look | What is special there |
| --- | --- | --- |
| Faction world view (graph + matrix) | `Silverstadt/Factions/` | Five factions and one sub-faction; one-directional values (Order → Court −3, Court → Order −4) |
| Faction opened up | [[Order of the Lantern/factions\|Order of the Lantern]] | [[Isolde Ferrant]] inherits everything, [[Aldric Thane]] deviates, [[Sergeant Pell]] deviates gently |
| Public face vs true stance | [[The Bench/factions\|The Bench]], [[Sable]], [[Mira Voss]] | `secret_relations` that contradict the public value |
| Reasons on arrows | Order, Archivists, Aldric, Corvin | Structured `{ value, why }` entries next to plain numbers |
| Sub-factions | `The Gutter Court/The Bench/` | Inherits from the Court, overrides one value |
| Tension panel | [[Ondine Vale]] (−5 against a Court her faction likes), Bench vs Court | Strong deviations and secret contradictions |
| Character → character | Aldric → Mira, Sable → Mira, Orrin → Mira | Relations between people, not factions |
| Faction world: graph | Open faction world | Blocs (the Order and the Court far apart), Bench tied to the Court, Ilex's and Elder Wren's arrows leaving their frames; True mode: The Bench → Order dashed (+4 instead of the Court's −4) |
| Faction world: matrix | Open faction world → Matrix | The Bench's row inherits −4 from the Court (dashed); empty cells offer Add relation; Orrin Quill has no row (no faction relation) |
| Faction view | Faction world → click The Gutter Court | Mira Voss and The Bench ringed (out of line), Sable not; click Mira: her inherited −4 towards the Order dashed; click The Bench to go deeper; Mira and Sable stand apart, with Mira's +1 and Sable's −2 as two arrows between them; drag the frame or a box, re-layout puts them back |
| Tension panel | Faction world → lightning button | Public: Ondine Vale, Mira Voss, Aldric Thane, Corvin Marsh out of line; True adds The Bench and Sable, and public vs. true for The Bench, Mira, Sable and the Order |
| Faction card | [[Corvin Marsh]], [[Sable]], [[The Bench/factions\|The Bench]] | Corvin: a reason rendered as a link; Sable: secret relations closed until opened; Bench: place shown as The Gutter Court |
| Relation history | [[Session 14 – Bell Square]] | A log line `Order of the Lantern → The Gutter Court: −2 → −3`; it shows in the tooltip of that arrow and matrix cell as `−2 → −3 in S14` |
| Value popover | Faction world → Matrix → The Bench × Order of the Lantern | Public: inherited −4 from the Court (moving it gives The Bench its own value); True: its own secret +4 with Reset to inherited |
| Stat block view | [[Isolde Ferrant]], [[Aldric Thane]], [[Mira Voss]] | `dnd5e-statblock` blocks render as 5e stat blocks (Mira's has an unknown key, `ledger_pages`, which is kept and ignored); [[Sergeant Pell]] has none yet |
| Convert stat block | [[Ondine Vale]] | Still a Fantasy Statblocks `statblock` block: **Convert stat block** turns it into `dnd5e-statblock` and back |
| New NPC | any faction card (**New NPC** button) or the command | Writes `Templates/NPC.md` into the faction's folder (Party → `Silverstadt/Party`, Unaffiliated → `Silverstadt/NPCs`); dice for name and personality; archetype from the SRD or [[Lantern Warden]] |
| Race in New NPC | the race field of **New NPC** | Dwarf, Elf, … (SRD) write their traits into the stat block (speed, darkvision, languages, resistances, traits) and steer the name, looks and age dice; free text is just written as `race:` |
| Own race | [[Tideborn]] | `type: race` note in `Templates/Races/` with traits and name lists; offered first; **New race** writes one from a base race |
| Dice texts in German | settings → language of the dice texts | German Obsidian (or the setting) rolls German texts; keys and headings stay English; every table ≥ 50 entries |
| Own archetype | [[Lantern Warden]] | `type: archetype` note in `Templates/Archetypes/`, listed first in the archetype search |
| Dice table override | [[NPC quirks]] | Replaces the default quirks table; the other tables stay the plugin's |
| Add stat block | [[Sergeant Pell]] | Has no stat block: **Add stat block** inserts one under a new `## Stats`; a second run refuses |
| Edit a stat block | [[Aldric Thane]], [[Lantern Warden]] | Open the block: click AC, HP, speed, senses, languages, CR, the name or an ability score to change it; pencil and × on traits and actions, **+ Add** under each section (Undo on remove) |
| New archetype | command **New archetype** | Name and an archetype to start from (e.g. Spy) → a `type: archetype` note in `Templates/Archetypes/`, opened with its block unfolded |
| AC · HP · CR on the card | [[Aldric Thane]], [[Ondine Vale]] | The card shows `AC 18 · HP 52 · CR 3`; it reads either block name; the faction view's member tooltips too |
| Encounter note | [[Ambush under the second arch]] | Party links (skipped, the party joins anyway), a named NPC, groups with `count`, a `monster:` entry |
| Dice and tables | [[Street Rumours]] | List (d6), ranged table with mixed dashes (1d8), table with a gap (d20) |
| Decks | [[Omens of the River]] | Two of eight cards already drawn |
| GM gate | Almost every note | `[!gm]` callouts with and without `revealed:`, `%%comments%%`, a link hidden in a comment |
| Own spell | [[Lantern Ward]] | `type: spell` note: joins the spellbook marked "own" (Level 2, Abjuration), its card renders the note's text and "At Higher Levels" |
| Spell links | [[Ondine Vale]], or any NPC made from the Mage, Priest or Druid archetype | In an open stat block the spell names of the Spellcasting trait are links: a click opens the spellbook on that spell |
| Deck of Many Things | [[Deck of Many Things]] | **Open Deck of Many Things** (ribbon layers icon): the Fool is out (ticked), three draws in the history; each new draw appends a line, the Fool and the Jester get ticked |
| Own decks | [[Fortunes of Bell Square]], [[Omens of the River]] | Pick them in the Deck tab: Bell Square returns its cards (the Cracked Bell leaves, Midnight ends, one effect over two lines); Omens keeps every drawn card out |
| Deck builder | `Silverstadt/Decks/Omens of the Road.json` | **New deck** (or + in the Deck tab): fill from the standard deck, pasted text (`Name — effect`, lists, tables) or this JSON file; writes a note in `Decks/` |
| Spell builder | command **New spell** or + in the spellbook | Start from an SRD spell, by hand, or a JSON file; writes `Silverstadt/Spells/<name>.md` and opens it in the spellbook |
| Deck reset | the Deck tab's reset button | Clear the history only, or the history and every ticked card |
| Monster Manual | none needed | **Open Monster Manual** (ribbon skull): 334 SRD monsters, filters, stat block card; **Insert into note** below the cursor of the last note, **Make a note** into `Silverstadt/Monsters/` |
| Own monster | [[Bell-Tower Gargoyle]] | `type: monster` note: joins the Monster Manual marked "own" (CR 3, elemental, flies); its card opens the note |
| Monster builder | command **New monster** or + in the Monster Manual | Start from an SRD monster or from nothing; live stat block; writes `Silverstadt/Monsters/<name>.md` and shows it in the Monster Manual |
| Monster import | `Silverstadt/Monsters/Import example (5etools).json` | **New monster** → **Import from a file**: two made-up monsters in 5etools format as tiles; pick one to edit or **Create all 2**. Also reads Fantasy Statblocks YAML/JSON, Markdown with stat blocks, 5e-bits and Open5e JSON |
| Battle tracker | [[Ambush under the second arch]] | **Open battle tracker** (ribbon swords): the party joins by itself, [[Sable]] with her frontmatter AC/HP, four Court thugs and two sharpshooters (one roll per group), three Bridge rats from the Monster Manual. **Start**, type the characters' initiative, **Begin round 1**; damage, conditions and turns are written to the note's `## Combat` table |
| Battle log | the Battle tab, `Silverstadt/Sessions/` | **Begin round 1**, defeat a thug, **End combat**: each offers a line for tonight's session's `## Log` (setting **Battle log**: ask / automatic / off); the end line sums the defeated enemies' XP |
| Encounter builder | command **New encounter** or + in the Battle tab | The four level 6 characters as chips: Low 2,400 · Moderate 4,000 · High 5,600 XP; two Owlbears = 1,400 XP (Low); writes `Silverstadt/Encounters/<name>.md` and opens it in the Battle tab |
| Add to encounter | Monster Manual card | **Add to encounter** → pick [[Ambush under the second arch]]: `- monster: <name>` joins its `combatants`, again → `count: 2` |
| Add to combat | the Battle tab while a fight runs | Type "Owlbear" (or "Eulenbär") under the order and **Add**, or **Add to combat** on a Monster Manual card; "Bell ringer" needs HP; **Remove from fight** on a card. Reopen the tab: the added owlbear keeps its stat block |
| Spellbook | none needed | **Open spellbook** (ribbon book icon): the 319 SRD spells, German names and metres with German Obsidian |
| Tonight's session | `Silverstadt/Sessions/` | Session 14 is dated in the past → the first "Log" of a day offers Session 15 from `Templates/Session.md`; its Loot table starts with Mira's calling card `(from [[Session 14 – Bell Square]])` (also via **Start next session**) |

Notes with broken frontmatter or broken values (warnings, Fix buttons, dangling targets) are not part of this vault: they live in `plugins/dnd5e-bylokianer/test/fixtures/vault/` with the same folder layout. To try the warnings in Obsidian, copy them in and remove them afterwards.

## Conventions used here (provisional)

- A faction is a folder holding a `factions.md`; the notes beside it are its members.
- Relations in frontmatter: `relations:` (public) and `secret_relations:` (GM only), keyed by faction folder name or character note name, values −5 … +5, either a plain number or `{ value, why }`.
- `power: 1–5` on a faction sets its size in the graph.
- Links to a faction point at its `factions.md` by path, e.g. `[[The Gutter Court/factions|The Gutter Court]]`.
