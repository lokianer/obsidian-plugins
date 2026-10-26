# dnd5e-byLokianer

Game-master tools for D&D 5e in Obsidian. The first module covers **factions and their relations**:
factions are folders holding a `factions.md`, relations are frontmatter values from −5 (war) to +5
(sworn), and members inherit their faction's stance unless they state their own. The second, the NPC
builder, brings 5e stat blocks and a New NPC dialog; then a spellbook, the Deck of Many Things, a Monster Manual and a
battle tracker; dice follow.

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

**Open faction world** (command or ribbon icon) opens a tab with all factions of the campaign —
zoom and fit buttons float on the right, the −5 … +5 colour scale at the bottom:

- **Graph** — factions as circles sized by power, each in a colour of Obsidian's palette (shared by
  its sub-factions and members) with its initials, the name on a pill; sub-factions tied to their
  parent, the Party and the unaffiliated characters as cards, unknown targets as dashed ghosts, all
  on Obsidian's canvas dots. Hover a faction and its arrows and neighbours light up with the
  values on the arrows while the rest fades. Arrows are coloured from
  red (−5) to green (+5); two arrows bow apart when both sides have a value. Friends cluster, enemies
  drift apart. Drag a faction to pin it, drag the background to pan, scroll or pinch to zoom.
- **Matrix** — who (rows) towards whom (columns), each cell with its number and step name; values a
  sub-faction or member only inherits are dashed. Rows and columns carry the faction colours;
  hovering a cell marks its row and column.
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
card in its colour with its members as pills, the factions it relates to as cards around it, own
values as solid arrows — in the graph's look, hover included. Members
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

**New NPC.** The command **New NPC** — or the **New NPC** button on a faction's card — opens a
dialog: name, faction, race, archetype, class, alignment and the lines that describe the NPC, each
rolled one with a die. **Create** writes the note from your NPC template (setting,
default `Templates/NPC.md`) into the faction's folder — the Party's folder for the Party, the
campaign's `NPCs` folder for the unaffiliated — with the archetype's stat block named after the NPC.
Archetypes are the 21 SRD NPCs and your own: notes with `type: archetype` and a stat block in
`Templates/Archetypes/`. A note such as `Templates/Tables/NPC quirks.md` (one entry per list item)
replaces that dice table. **Add stat block** gives the open note a stat block from an archetype,
under a new `## Stats` heading; it leaves a note that has one alone.

**The dialog.** The form sits beside a **preview card** of the NPC — name, race, occupation and
age, faction, class and alignment as tags, the race's traits, the archetype's AC, HP, CR, speed and
modifiers, and every filled line (the secret marked) — which updates as you type and roll. Race and
archetype — and the class, from the twelve SRD classes with hit die and main abilities, written in
English — are picked from **tiles** with a search: the races with their size, speed and darkvision,
the archetypes by challenge with AC · HP · CR, **No archetype** keeping the template's block; a race
typed that has no tile can still be used as free text. **Roll everything** rolls the race and then
every field that is not **locked**: each rolled field has a lock beside its die, typing into a
field locks it, picking a race tile locks the race. Faction, archetype and alignment are never
rolled.

**Races and dice texts.** The race tiles offer the nine SRD races (Dwarf, Elf, Halfling, Human,
Dragonborn, Gnome, Half-Elf, Half-Orc, Tiefling) and your own `type: race` notes in
`Templates/Races/` — **New race** writes one from a base race. A picked race writes its traits into
the stat block (size, speed, darkvision, languages, resistances, racial traits; never ability scores)
and makes the name, looks and age dice roll to fit. The dice texts — appearance, build, manner,
voice, occupation, wants, ideal, bond, flaw, quirk, secret, hook, each at least fifty entries — come
in English or German, following Obsidian's language unless the setting pins one. Keys and headings
in the note stay English.

**Editing a stat block.** Opened, a stat block is editable where it stands: click the name, AC, HP,
speed, senses, languages, CR or an ability score, type, Enter writes (Esc cancels). Traits, actions,
bonus actions and reactions have a pencil (name and text) and × (with Undo) on hover, and **+ Add**
under each section. Every change is one line edit inside the block; when the note says something
else than you saw, nothing is written. **New archetype** asks for a name and an archetype to start
from (or none) and writes the archetype note, opened for editing.

## The spellbook

**Open spellbook** (command, or the book icon in the left ribbon) opens a tab with the 319 spells
of the SRD 5.1. Search by English or German name (case and accents do not matter), narrow by level
and school chips — each level chip says how many spells it would show — and by class, casting
time, damage type, saving throw, concentration and ritual. The list is grouped by level, each
spell in its school's colour with its casting time and range and C (concentration) or R (ritual)
marks; ↑ ↓ move through it, Enter opens the card. The card shows the spell's name in both
languages, its level line ("3rd-level evocation" / "Hervorrufung des 3. Grades"), casting time,
range, components and duration, the material, damage and save badges, the description with "At
Higher Levels" and the classes; EN / DE switches its language. Names and meta follow the dice-text
language setting; German distances are in metres (5 ft. = 1.5 m). Every description, "At Higher
Levels" and material is there in German too, with German dice (8W6) and the German rules terms. On
a narrow tab the card replaces the list,
with a back button. The filters and the picked spell are kept.

In an open stat block, the spell names of a **Spellcasting** trait are links (English or German
names): a click opens the spellbook on that spell.

**Own spells** — spells beyond the SRD you own — are notes anywhere in the vault:

```markdown
---
type: spell
level: 2 # 0 or "cantrip" for a cantrip
school: abjuration # English or German
casting_time: 1 action
range: 30 feet
components: V, S, M
material: a lantern's wick
duration: Up to 1 hour
concentration: true
ritual: false
classes: [Cleric, Wizard]
damage: radiant # optional; also save: wisdom, attack: ranged
---

The description, in Markdown.

## At Higher Levels

What a higher slot adds.
```

They join the list marked "own", filter and search like the SRD's, link from stat blocks, and their
card has a button to open the note. A note without a valid `level` or `school` stays out.

**New spell** (command, or + in the spellbook) opens the spell builder, laid out like the New NPC
dialog with a live preview of the card in its school's colour: start from one of the 319 SRD spells
(search the tiles; its text comes in your language, to change), fill every field by hand — level
and school as chips and tiles, components, classes and damage as chips — or load a JSON file (the
keys above, or a spell in the 5e-bits or Open5e SRD format). It writes the note in the campaign's
spell folder (setting, `Spells` by default) and opens it in the spellbook.

## The Deck of Many Things

**Open Deck of Many Things** (command, or the layers icon in the left ribbon) puts the SRD's deck on
the table: 22 cards, or 13 with the setting (most decks found have only 13). Name who draws — the
party's characters are suggested — declare the number of cards and turn them one by one. The rules
run themselves: the Fool and the Jester leave the deck once drawn, every other card returns; the
Fool's redraw counts as the same declared draw; the Jester offers 10,000 XP or two more draws, the
Idiot one more; The Void and Donjon end the drawing. Each card shows the playing card it stands for
(K♦ for the Sun), its name in both languages, a badge when it leaves the deck or ends the drawing,
and its effect in the plugin's language. Beside it the whole deck — a tap shows a card's effect
between drawings, cards out of the deck are struck through — and the history of draws.

The deck lives in a note, `Deck of Many Things.md` in the campaign folder, made on the first draw:

```markdown
---
type: deck
deck: standard-22
---

- [ ] Vizier
- [ ] Sun
- [x] Fool

## Draws

- 2026-10-25 · [[Mira]] · Fool
```

A ticked card is out of the deck; tick or untick one by hand and the tab follows. Each draw adds a
line under `## Draws`, the drawer linked. The reset button (↺) asks whether to clear only the
history or also put every card back. Skull's avatar of death has no stat block here (the SRD data
at hand has none).

### Own decks and the deck builder

Every `type: deck` note in the campaign shows in the tab's deck list. Its first task list is the
deck, one card per item, `Name — effect`, with indented lines continuing the effect:

```markdown
---
type: deck
returns: true # drawn cards go back in; without it each card drawn stays out
leaves: ['The Cracked Bell'] # in a returning deck: these leave once drawn
ends: ['Midnight'] # these end the drawing
---

- [ ] The Lantern — Someone you trust keeps a light burning for you.
- [ ] Midnight — No more fortunes tonight.
```

**New deck** (command, or + in the tab) opens the deck builder, laid out like the New NPC dialog with
a live preview of the deck and the card being edited: a name, whether drawn cards return, and the
cards as rows — name, effect, "leaves the deck", "ends the drawing" — typed in one by one or
filled from **the standard deck** (all 22 cards in your language, to edit), **pasted text** (one card
per line: `Name — effect`, `Name: effect`, `**Name.** effect`, list items or Markdown table rows) or
a **JSON file**:

```json
{
  "name": "Omens of the Road",
  "returns": false,
  "cards": [{ "name": "Crow", "effect": "An ill omen.", "ends": false }]
}
```

(an array of cards, or just of names, works too; `text` or `description` count as the effect). The
deck is written as a note in the campaign's deck folder (setting, `Decks` by default) and opens in
the tab; edit it there afterwards.

## The Monster Manual

**Open Monster Manual** (command, or the skull in the left ribbon) opens a tab with the 334
monsters of the SRD 5.1, laid out like the spellbook. Search by English or German name; narrow by
challenge rating in five bands (0–½, 1–4, 5–10, 11–16, 17+, each chip with its count), type (in its
colour), size, movement (flies, swims, burrows, climbs), Legendary and Spellcaster. The list is
grouped by challenge rating with type, size, AC and HP and marks for legendary (L), flying (✈) and
spellcasting (✦). The card is the full stat block in the plugin's own view — the same as in a
note — with the spell names of a Spellcasting trait linked to the spellbook. With German Obsidian
(or the dice-text setting) names, sizes and types ("Großer Drache"), alignments, armour, speeds and
senses in metres, languages, damage types, conditions, saves and skills are German, and so are the
traits, actions, reactions and legendary actions, with W-dice, metres and the spells under their
German names. EN / DE switches the card.

**Insert into note** puts the stat block as a `dnd5e-statblock` block below the cursor of the last
note you were in; **Make a note** writes a `type: monster` note with the block in the campaign's
monster folder (setting, `Monsters` by default).

**Own monsters** are notes with `type: monster` and a `dnd5e-statblock` block anywhere in the
vault: they join the list marked "own", filter and search like the SRD's, and their card opens the
note. **New monster** (command, or + in the Monster Manual) opens the monster builder, laid out like
the New NPC dialog with the stat block as a live preview: start from one of the 334 SRD monsters
(search the tiles) or from nothing; size, type, alignment and challenge rating are dropdowns in your
language, the six abilities numbers, saves and skills one line each (`DEX +6, CON +13`), traits,
actions, reactions and legendary actions rows — the paragraph above legendary actions fills itself
in. It writes the note in the monster folder and shows it in the Monster Manual.

**Import from a file** in the builder reads monsters you already have: Fantasy Statblocks' keys (a
YAML or JSON file, or a Markdown note with `statblock` / `dnd5e-statblock` blocks), the 5e-bits and
Open5e JSON shapes, and 5etools bestiary files (their `{@…}` tags become plain text). One monster
fills the form; several show as tiles — pick one to edit, or **Create all** to write them all as
own monsters. The plugin itself ships only the SRD's monsters: creatures outside the SRD (named
demon lords, beholders and other monsters Wizards of the Coast keeps out of it) are not free to
include, so bring them from your own books this way.

## The battle tracker

**Open battle tracker** (command, or the swords in the left ribbon) opens a tab that runs a fight
from an encounter note — any note with `type: encounter` in the campaign:

```yaml
type: encounter
party: true # the campaign's party joins (the default); false keeps it out
combatants:
  - '[[Sable]]' # a note: ac / hp / initiative from its frontmatter, else its stat block
  - monster: Owlbear # from the Monster Manual (SRD or own), English or German name
    count: 2
  - name: Court thug # written right here
    count: 4
    ac: 11
    hp: 32
    initiative: 0
    side: enemy # party, ally or enemy
```

**Start** sets up the order: monsters and NPCs roll d20 + their initiative bonus (a group with a
`count` rolls once and is numbered "Court thug 1 … 4"), player characters' numbers are typed in or
rolled with the dice button; ties go to the higher Dexterity, the arrows nudge a row. **Begin round
1**, then **Next turn** and the arrow back; defeated monsters are skipped. Pick a row to see its
card: hit points, temporary hit points, AC and initiative, one number with **Damage**, **Heal** and
**Temp HP** (temporary hit points absorb damage first and don't stack), death saves when a character
is down, the SRD's conditions as chips with an optional duration in rounds that counts down at the
end of the combatant's turn, concentration — damage to a concentrating combatant shows the
Constitution save's DC (10 or half the damage) — and the stat block. **End combat** closes the
fight.

The line-up can change while the fight runs: under the order, type a monster (English or German
name), a note or any name with hit points and AC and press **Add**; **Add to combat** on a Monster
Manual card does the same for that monster. A newcomer rolls its initiative and goes where it puts
it — a member of a group already fighting shares the group's number and takes the next member
number ("Owlbear 3"). **Remove from fight** on a card takes a combatant out, passing on its turn.

The fight's moments go to tonight's session note, under `## Log`, like the factions' changes:

```markdown
- 21:40 Combat begins: [[Ambush under the second arch]]
- 21:52 Round 3: Owlbear 1 defeated
- 21:55 Round 4: Dagny is down
- 21:58 Combat ends after 5 rounds — 1,400 XP
```

**New encounter** (command, or + in the Battle tab) builds an encounter note, laid out like the New
NPC dialog: a name and an optional place, the campaign's party as chips with their levels (from each
character's `level`; without a party folder, a number of characters and a level), the difficulty —
Low, Moderate or High, each with its XP budget from the SRD 5.2.1's table (each character's budget
by level, summed) — and the Monster Manual's monsters as tiles: each click adds one, the rows below
count them. Beside it the XP spent fills the budget, with what is left or over and how hard the
encounter is. **Create encounter** writes the note into the encounter folder (setting, `Encounters`)
and opens it in the Battle tab. **Add to encounter** on a Monster Manual card adds the monster to an
encounter note you pick.

Experience points are optional: with the setting **Experience points** off (the default, for
milestone levelling) the builder shows no XP — the tiles say how dangerous each difficulty is and
the preview how much of the budget is used — and the log's end line carries none. Switched on, the
builder shows the budgets and every monster's XP, and the end line sums the defeated enemies' XP by
challenge rating. The setting **Battle log** offers
each line in a notice with **Log → Session N** (the default), writes them automatically, or keeps
them out.

Every change is written to the note's `## Combat` section, a plain table that reads without the
plugin and is read back when the tab opens:

```markdown
## Combat

Round 3 · Turn: Court thug 2

| Init | Combatant    |       HP |  AC | Conditions               |
| ---: | ------------ | -------: | --: | ------------------------ |
|   21 | [[Dagny]]    | 54/71 +5 |  15 | prone (1), concentration |
|   17 | Court thug 2 |    12/32 |  11 |                          |
|    9 | Owlbear 1    |     0/59 |  13 | defeated                 |
```

## Dice

**Open dice** (command, or the dice in the left ribbon) opens the Dice tab. Type a formula and
press **Roll**, or pick a die:

| Written                       | Meaning                             |
| ----------------------------- | ----------------------------------- |
| `d20`, `W20`                  | one twenty-sided die                |
| `2d6+3`, `1d8+2d6-1`          | sums; `*`, `/` and brackets too     |
| `d%`, `d100`                  | percentile (two d10, tens and ones) |
| `4d6kh3`, `2d20kl1`, `4d6dl1` | keep highest / keep lowest / drop   |
| `d20+5 adv`, `d20 dis`        | advantage / disadvantage            |

Normal / Advantage / Disadvantage applies to a single d20; a **DC** gives the verdict. Every roll
plays on **the dice stage**, modelled on Baldur's Gate 3's checks: what is rolled and the DC on
top, the dice — each in its own shape, d4 to d20, more of them in rows that wrap — tumbling,
landing and lighting up, the numbers of the formula flying in, the total counting up, then
**Success** or **Failure** (a natural 20 on a single d20 is a critical success with golden rays, a
natural 1 a critical failure). A click or Space skips to the result. The rolls of this Obsidian
session are listed below with Roll again and Log.

In notes, inline code like `dice: 2d6+3` — the syntax of the Dice Roller plugin, so notes work in
both — becomes a button in Reading view and Live Preview; a click plays the stage in a small
window and shows the total beside the button. Nothing is written into the note. Formulas the
plugin does not read (Dice Roller's exploding dice, rerolls) stay as they are.

Settings: **Dice log** — offer each roll for tonight's session in a notice (the default), write it
automatically, or not at all (`- 20:10 Rolled d20+7 → 19 (12, +7) against DC 15: success`);
**Dice animation** — the stage animated, the stage with the result at once, or no stage.

## Commands

- **Show faction warnings** — every note the plugin could not read cleanly, with a **Fix** button
  that opens the note's card on the broken entry.
- **Edit faction data** — focuses the card of the active note.
- **Open faction world** — the graph and matrix of all factions.
- **Show faction tensions** — the tension panel in the right sidebar.
- **Open spellbook** — the SRD spells to look up.
- **Open Deck of Many Things** — draw from the SRD deck or an own one.
- **New deck** — the deck builder.
- **New spell** — the spell builder.
- **Open Monster Manual** — the SRD monsters to look up and drop into notes.
- **New monster** — the monster builder.
- **Open battle tracker** — run a fight from an encounter note.
- **New encounter** — the encounter builder.
- **Open dice** — the Dice tab.

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

## Origins: what is taken, what is only inspired

**Taken** — code, data or a template from another project, with its licence:

- **Rhizom** (the maintainer's own earlier project): `src/campaign/scope.ts` is ported from
  Rhizom's `packages/core/src/vault/campaign.ts`; the campaign note, tonight's session and the
  session log follow Rhizom's conventions. Rhizom's sole author relicensed that code to MIT for
  this plugin.
- **Obsidian's sample plugin** (`obsidianmd/obsidian-sample-plugin`, 0BSD): the starting scaffold —
  build script, manifest and project layout.
- **5e-bits SRD database** (`5e-bits/5e-database`, MIT): the SRD 5.1 spells, monsters and NPC stat
  blocks were extracted from it by `scripts/spells-from-srd.mjs` and `scripts/monsters-from-srd.mjs`
  (and transcribed for the NPCs); the texts are the SRD's (see Attribution below).
- **SRD 5.2.1** (Wizards of the Coast, CC-BY-4.0): the encounter builder's XP Budget per Character
  table; it was read from `downfallx/dnd-5e-srd-markdown` (a CC-BY-4.0 Markdown conversion of the
  SRD 5.2.1) to check the numbers.
- **d3-force** (ISC licence): bundled as a library for the faction graph's layout.

**Only inspired or compatible** — no code taken; the plugin reads or writes their formats, or
borrows an idea, with its own implementation:

- **Fantasy Statblocks** (javalent): the stat block keys are compatible, so blocks move between
  the two; rendering, editing and **Convert stat block** are our own code.
- **Dice Roller** (javalent): the `dice:` inline syntax and the `kh` / `kl` notation, so notes work
  in both; the formula engine, the Dice tab and the stage are our own code.
- **Initiative Tracker** (javalent): the idea of a battle tracker inside Obsidian; the tracker is
  our own code and keeps its state in the encounter note.
- **Baldur's Gate 3** (Larian Studios): the look and the sequence of the dice stage — difficulty
  class on top, the die in a ring, bonuses flying in, Success / Failure. The stage is drawn by the
  plugin (SVG and CSS); no images, sounds or code from the game. This plugin is not affiliated with
  Larian Studios.
- **Open5e, 5etools, 5e-bits JSON**: the monster and spell import reads these file shapes; no code
  from those projects.
- The German texts (spell and monster names and texts, the German stat block lines) are this
  plugin's own translation, under CC-BY-4.0 like the SRD.

## Attribution

This plugin includes material from the System Reference Document 5.1 ("SRD 5.1") by Wizards of the
Coast LLC, available at https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1 is
licensed under the Creative Commons Attribution 4.0 International License, available at
https://creativecommons.org/licenses/by/4.0/legalcode. See `src/npc/NOTICE.md` (NPCs, races) and
`src/spells/NOTICE.md` (spells; the German names are this plugin's own translation, under the same
licence).

The encounter builder's XP Budget per Character table is taken from the System Reference Document
5.2.1 ("SRD 5.2.1") by Wizards of the Coast LLC, available at
https://www.dndbeyond.com/srd, licensed under the Creative Commons Attribution 4.0 International
License, available at https://creativecommons.org/licenses/by/4.0/legalcode.
