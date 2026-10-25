# Monster Manual — design

Date: 2026-10-25. Status: **reviewed 2026-10-25 (every call in §7 accepted); M1 built; M3 pulled ahead of M2 by the maintainer ("jetzt einen Monster Creator")**. Module 5 of
`dnd5e-byLokianer`, before the battle tracker.

Asked for by the maintainer: "beside the spellbook a Monster Manual, built like the spellbook,
before the battle tracker".

## 1. What can ship

Only the **334 monsters of the SRD 5.1** (CC-BY-4.0) — beasts, dragons, fiends, undead … and the
21 NPCs the NPC builder already has. The Monster Manual's other creatures are not free to ship;
the GM adds them as own monsters (§5). Source: the 5e-bits SRD database, generated once into our
own `dnd5e-statblock` format by a script (like the spells) and checked in tests (counts, sample
monsters against the SRD: Adult Red Dragon, Goblin, Lich, Owlbear). German names and texts are our
own translation, under the same licence.

## 2. Goals

- **A Monster Manual tab** (command **Open Monster Manual**, a ribbon icon like the spellbook), one
  per workspace, laid out like the spellbook: header with search and chips, list on the left, the
  stat block as the card on the right (below it on phones, with a back arrow).
- **Search** by name, English and German, ignoring case and accents.
- **Filters**: challenge rating as chips in bands (0–¼–½, 1–4, 5–10, 11–16, 17+) with counts;
  type (beast, dragon, fiend …) as chips in the type's colour; size; movement (flies, swims,
  burrows, climbs); legendary; spellcaster. Filters combine like the spellbook's; the count shows;
  the state is kept.
- **List** grouped by challenge rating: name, size and type, AC · HP, and marks for legendary (L),
  flying (✈) and spellcasting (✦).
- **Card**: the full stat block in the plugin's stat block view (the same renderer as in notes:
  abilities with modifiers, XP and proficiency bonus, traits, actions, reactions, legendary
  actions), spell names linked to the spellbook, name in both languages, EN / DE switch.
- **Into the campaign**: on the card, **Insert into note** puts the stat block as a
  `dnd5e-statblock` block at the cursor of the last note; **Make a note** writes a `type: monster`
  note with the block in the campaign's monster folder (setting, `Monsters`). The battle tracker
  will pick monsters from here.
- **German**: names, sizes, types, alignments, senses, languages, speeds (metres), damage types,
  conditions and the stat block's labels in German; the traits' and actions' texts in phase M2.
- **Fancy, still Obsidian**: theme variables only, type colours from Obsidian's palette, no small
  text, keyboard navigation (↑ ↓, Enter).

## 3. Non-goals

- No encounter builder or CR budget (the battle tracker's job).
- No monster images (not in the SRD's licence; none ship).
- No network.

## 4. Phases

1. **M1 — Monster Manual tab:** the 334 monsters as data (English), German names and German meta
   (sizes, types, alignments, senses, speeds, damage types, conditions), the tab with search, all
   filters, the list and the stat block card, Insert into note and Make a note.
2. **M2 — German texts:** the traits, actions, reactions and legendary actions of all 334 in German,
   in batches by challenge rating, each batch checked (every entry has a text; attack bonuses,
   damage dice and save DCs match the English; metres).
3. **M3 — Own monsters and a monster builder:** notes with `type: monster` and a stat block join the
   list, marked "own"; **New monster** opens a builder in the New NPC dialog's style — start from
   an SRD monster, change it, a live stat block preview — writing such a note.

## 5. Own monsters (M3)

A note with `type: monster` and a `dnd5e-statblock` block joins the list, its frontmatter or block
giving name, CR, type and size. Monsters the GM owns from other books can be typed in that way, or
built from an SRD one in the monster builder.

## 6. Architecture

```
scripts/monsters-from-srd.mjs       5e-bits → our stat block YAML, run once
src/monsters/srd-monsters.ts        the 334 SRD monsters, generated, checked in tests
src/monsters/de.ts                  German names (M1) and texts (M2), by index
src/monsters/filter.ts              filters, search, CR bands, counts (pure)
src/obsidian/monster-manual-view.ts the tab, reusing statblock-view for the card
```

Size: about 600 KB of English data and as much German later; `main.js` grows accordingly (like the
spellbook, fine for desktop and phones).

## 7. Calls I made without the maintainer (check these)

- The 21 SRD NPCs appear in the Monster Manual too (they are SRD monsters); the NPC builder keeps
  its own list of them as archetypes.
- Challenge rating as five bands of chips rather than 34 single values.
- Type colours from Obsidian's palette, like the spellbook's school colours.
- The card is the plugin's own stat block view, so a monster looks the same in the tab and in a
  note.
- Insert into note and Make a note on the card; monster notes in a `Monsters` folder of the campaign.
- German texts as their own phase (M2), own monsters and the builder as M3 — as with the spellbook.
