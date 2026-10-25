# NPC builder — design

Date: 2026-10-25. Status: **approved ("passt", 2026-10-25)**; phase 1 built. Module 2 of `dnd5e-byLokianer`.
Build only after this spec and the phase 1 plan are approved.

Decided with the maintainer on 2026-10-25:

- **Own code, compatible** with Fantasy Statblocks (not integrating it): our renderer, our editor,
  the same YAML keys inside the block.
- **Own block name** for the stat block, so the two plugins never fight over a block.
- First stage includes all four: **create an NPC**, **add a stat block** to an existing note,
  **show and edit** the stat block in place, **random helpers** from local tables.
- Archetypes: **all SRD 5.1 NPCs**, plus a **template builder** for the GM's own classes.
- The faction card shows a member's **AC · HP · CR** when the note has a stat block.
- Nothing is published for now; the work goes on in the repository.

## 1. Intent

Making an NPC should take a minute at the table and leave a proper note: name, where they belong
(their faction's folder, so the factions module sees them at once), a few lines of personality to
play them by, and numbers for when the party draws steel. The numbers come from the SRD's NPC stat
blocks or from the GM's own archetypes, and stay editable where they are shown.

## 2. Goals, non-goals, anti-goals

**Goals**

- **New NPC** (command and a button in the faction card of a faction): a modal with name, faction
  (the campaign's factions, Party, Unaffiliated → the note's folder), archetype (searchable: SRD and
  own), race, class, alignment, personality lines; dice buttons fill name and personality from the
  tables. Writes one note from the NPC template (setting, default `Templates/NPC.md`, minimal note
  without one) and opens it.
- **Add stat block** (command on the active note): picks an archetype and inserts a stat block
  under a `## Stats` heading (created when missing), named after the note. Sergeant Pell is the
  example.
- **Stat block view**: the block renders as a 5e stat block — name, size/type/alignment, AC, HP,
  speed, the six abilities with modifiers, saves, skills, senses, languages, CR with proficiency
  bonus, traits, actions, bonus actions, reactions, legendary actions.
- **Editing in place** (as the faction card does for frontmatter): click a value to change it;
  ability scores, AC, HP, CR, speed, senses, languages, and the name/text of every trait and action;
  add and remove entries. Every change is a line edit inside the block.
- **Archetypes**: the 21 SRD 5.1 NPCs built in (Acolyte, Archmage, Assassin, Bandit, Bandit
  Captain, Berserker, Commoner, Cult Fanatic, Cultist, Druid, Gladiator, Guard, Knight, Mage, Noble,
  Priest, Scout, Spy, Thug, Tribal Warrior, Veteran), and the GM's own: notes with `type:
archetype` and a stat block, in a folder (setting, default `Templates/Archetypes/`).
- **Template builder**: a command/modal that creates such an archetype note — from scratch or from
  an SRD archetype as a base — so a GM's "Lantern Warden" class is one pick away afterwards.
- **Random helpers**: local tables for first names, family names, appearance, manner, wants and
  quirks. Defaults ship with the plugin (our own text, not SRD); a table note in the vault (setting,
  default `Templates/Tables/NPC <table>.md`, one entry per list item) replaces a default.
- **Card**: on a character's card and as a tooltip of the member's chip in the faction view, one
  line `AC 16 · HP 52 · CR 3` when the note has a stat block (ours or a Fantasy Statblocks block).

**Non-goals**

- No monsters beyond the SRD's NPC appendix (later, by the same machinery).
- No CR calculator: the SRD 5.1 has no monster-creation table; CR is typed, the proficiency bonus
  follows from it.
- No dice rolling from the stat block (module 4), no initiative (module 3).
- No spellcasting editor beyond plain text entries (spells stay a trait's text).
- No text generation by AI or network; tables only.

**Anti-goals**

- A stat block is rewritten as a whole on an edit (lines are edited; comments, order and quoting
  outside the edited value stay).
- A Fantasy Statblocks block is changed without the GM asking (we read it for the card line only;
  converting it is an explicit command).
- Non-SRD content shipped (only SRD 5.1 under CC-BY-4.0, with attribution).

## 3. Constraints

Root `CLAUDE.md` in full: files first, readable without the plugin, mobile, line edits through
`vault.process`, no `innerHTML`, Obsidian CSS variables only, i18n English/German, no default
hotkeys. SRD content: attribution to Wizards of the Coast under CC-BY-4.0 in the README and a
`NOTICE` beside the data.

## 4. The stat block in the note

```dnd5e-statblock
name: Sergeant Pell
size: Medium
type: humanoid
subtype: human
alignment: neutral good
ac: 16
ac_class: chain shirt, shield
hp: 11
hit_dice: 2d8+2
speed: 30 ft.
stats: [13, 12, 12, 10, 11, 10]
skillsaves:
  - perception: 2
senses: passive Perception 12
languages: Common
cr: 1/8
actions:
  - name: Spear
    desc: "Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d6 + 1) piercing damage."
```

- Block name `dnd5e-statblock` (call made, §9). Keys as Fantasy Statblocks' basic 5e layout uses
  them (`name`, `size`, `type`, `subtype`, `alignment`, `ac`, `ac_class`, `hp`, `hit_dice`, `speed`, `stats`,
  `saves`, `skillsaves`, `damage_vulnerabilities`, `damage_resistances`, `damage_immunities`,
  `condition_immunities`, `senses`, `languages`, `cr`, `traits`, `actions`, `bonus_actions`,
  `reactions`, `legendary_description`, `legendary_actions`, `spells`), so a note converts by
  renaming the block. Checked against Fantasy Statblocks' basic 5e layout on 2026-10-25 (its AC
  note is `ac_class`); keys we do not show (`lair_actions`, `mythic_actions` …) are kept.
- Readable without the plugin: it is YAML in a code block — every editor shows it as such.
- **Convert** (command): renames a `statblock` block of the active note to `dnd5e-statblock`, or
  back. The example vault keeps one Fantasy Statblocks block to exercise it.

## 5. The NPC note

The template decides the note. The builder fills: `{{title}}` and the file name, frontmatter
`type: npc`, `race`, `class`, `alignment`, `archetype` (new key, the archetype's name), the
personality lines under the template's headings (`## Appearance and manner`, `## What they want`,
`## Voice notes` in the example template — by heading name, appended under each), and the stat block
in place of the template's block (or under `## Stats`). Without a template: a minimal note with
those headings. The note goes into the chosen faction's folder (Party → the Party folder,
Unaffiliated → the campaign's `NPCs` folder, setting).

## 6. UI

- **New NPC modal**: fields top to bottom; each personality field has a die button; the archetype
  field suggests as you type, showing CR beside each; Create opens the note. On phones the modal is
  full width, dice buttons stay.
- **Stat block**: Obsidian's own look (headings, rules and accent colour from CSS variables), no
  parchment imitation; values editable on click (input, Enter writes, Esc cancels), hover shows the
  pencil; `+` under traits and actions adds an entry, `×` on hover removes it (with Undo).
- **Template builder**: the same modal as New NPC's archetype part, with a name for the archetype
  and every stat block field as a form; Save writes the archetype note.

## 7. Architecture

```
src/npc/statblock.ts     parse a stat block's YAML into a model; derived values (modifiers, PB)
src/npc/edit.ts          line edits inside a block (set a scalar, a list item's field, add/remove)
src/npc/srd.ts           the 21 SRD NPC stat blocks as data (+ NOTICE)
src/npc/archetypes.ts    SRD + own archetypes, search
src/npc/tables.ts        default random tables, overrides from table notes, pick
src/npc/note.ts          the NPC note's text from template, choices and stat block
src/obsidian/statblock-view.ts   code block processor, rendering and editing
src/obsidian/npc-modal.ts        New NPC and template builder
```

The YAML line editor of the factions module (`src/yaml/`) is reused where it fits; a block inside the
body needs its own line range instead of the frontmatter's.

## 8. Phases

1. **Stat block model and view** — parser and derived values, SRD data, rendering of
   `dnd5e-statblock` (read-only), the card's `AC · HP · CR` line (both block names), the Convert
   command, example vault notes.
2. **Builder** — archetypes (SRD + own notes), New NPC modal with faction folder and template, Add
   stat block, random tables with overrides.
3. **Editing and template builder** — editing in the rendered block (line edits, add/remove, Undo),
   the template builder modal.

Each phase: spec section → plan → review stop → build → check in Obsidian.

## 9. Calls I made without the maintainer (check these)

- Block name `dnd5e-statblock`.
- New frontmatter key `archetype:` on NPC notes.
- Own archetypes and table overrides as notes in `Templates/Archetypes/` and `Templates/Tables/`.
- Unaffiliated NPCs go to the campaign's `NPCs` folder.
- Look: Obsidian's style, not a parchment imitation of the printed book.
- The proficiency bonus is shown beside CR; no CR calculator (SRD has no table for it).

## 10. Phase 4 — races and a richer dialog (added 2026-10-25)

Asked for by the maintainer after phase 3: "fancier", a race selection from ready-made models plus
own races, and the dice texts in German too and with many more options. Decided with them:

- **Races change the NPC:** a chosen race writes its SRD 5.1 traits into the stat block (size,
  speed, darkvision in senses, languages, damage resistances, racial traits as traits), and makes
  the name and appearance dice roll from lists for that race (names; age, height, build, skin,
  hair, eyes).
- **Ready-made races:** the nine SRD 5.1 races — Dwarf, Elf, Halfling, Human, Dragonborn, Gnome,
  Half-Elf, Half-Orc, Tiefling — with the SRD's subrace where the SRD has one (Hill Dwarf, High Elf,
  Lightfoot Halfling, Rock Gnome). Traits from the SRD (CC-BY-4.0); name and appearance lists are
  our own text.
- **Own races** are notes like archetypes: `type: race` in `Templates/Races/` (setting) with
  frontmatter for size, speed, darkvision, languages, resistances, a `## Traits` list, and optional
  `## Names` / `## Family names` lists; a command **New race** writes one from a base race.
- **Dice texts follow Obsidian's language:** German Obsidian → German tables, otherwise English;
  a setting can pin one. Keys, file names and headings the plugin reads stay English (CLAUDE.md
  nomenclature); only the rolled text is German.
- **Many more options:** every table at least 50 entries in both languages, and new fields:
  occupation, age, build, voice, ideal, bond, flaw, secret, hook (all optional).
- **Fancier dialog:** a live preview card beside the fields (name, race, archetype with AC · HP ·
  CR, the rolled lines) that updates as you roll; **Roll everything** with a lock per field that
  keeps it; race and archetype chosen from tiles (icon, name, a short line) with a search, instead
  of a text field.

Anti-goals: a race silently changes an archetype's numbers beyond the SRD traits (no ability score
bonuses — NPC stat blocks already include them); German text in keys or headings.

Phases: **4a** race model, own races, bilingual and larger tables, new fields in the note; **4b** the
dialog: preview, roll everything with locks, tiles. Each with a plan and a review stop. Both built
2026-10-25 (plans `2026-10-25-npc-phase-4a-races-tables.md`, `2026-10-25-npc-phase-4b-dialog.md`).
