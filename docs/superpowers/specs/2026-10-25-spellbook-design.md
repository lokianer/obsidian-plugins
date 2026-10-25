# Spellbook — design

Date: 2026-10-25. Status: **reviewed; S1 and S2 built and accepted in Obsidian on 2026-10-25; S3 built**. Part
of `dnd5e-byLokianer`.

Asked for by the maintainer: "a complete spellbook to look up, all regular D&D 5e spells and
cantrips". Decided with them: **its own tab**, **with filters**, **in German too**, **made fancy**.

## 1. What can ship

Only the **319 spells of the SRD 5.1** (CC-BY-4.0, Wizards of the Coast) — 24 cantrips and 295
spells of levels 1–9. The Player's Handbook's other spells are not free to ship and stay out (the GM
can add them as notes, §5). Source: the 5e-bits SRD database, checked in tests like the NPC stat
blocks. German names and texts are our own translation of the SRD text, released under the same
licence with attribution.

## 2. Goals

- **A Spellbook tab** (command **Open spellbook**, a ribbon icon), one per workspace.
- **Search** by name (English and German), and **filters**: level (cantrip, 1–9, as chips), school,
  class (Bard, Cleric, Druid, Paladin, Ranger, Sorcerer, Warlock, Wizard), ritual, concentration,
  casting time (action, bonus action, reaction, longer), damage type, saving throw. Filters combine;
  the count of matches shows; the state is kept between openings.
- **List** grouped by level, each spell as a compact row: name, school colour, level, casting time,
  range, the C (concentration) and R (ritual) marks, components.
- **Spell card** for the picked spell, beside the list (below it on phones): name in both languages,
  "3rd-level evocation", casting time, range, components with the material, duration, classes, the
  description with "At Higher Levels", damage and save as small badges; school as the card's accent
  colour from the theme's palette.
- **Language**: names, schools, units ("1 action", "60 feet") and descriptions follow the dice-text
  setting of the NPC builder (Obsidian's language, or pinned); a toggle on the card shows the other
  language. **German distances are in metres** (the maintainer's call): 5 ft = 1.5 m, so "60 feet"
  → "18 m", "1 mile" → "1,5 km", "15-foot cone" → "4,5-m-Kegel" — in meta and descriptions alike.
- **Fancy, still Obsidian**: theme variables only, school colours from Obsidian's colour palette,
  smooth filter chips, keyboard navigation (↑ ↓ through the list, Enter to open), no small text.

## 3. Non-goals and anti-goals

- No spell slots, prepared lists or character sheets (later, if wanted).
- No network: all data ships with the plugin.
- Anti-goal: non-SRD spell text in the plugin.

## 4. Phases

1. **S1 — Spellbook tab:** the 319 spells as data (English text), German spell names and German
   meta (schools, levels, casting times, ranges, durations, components, classes, damage types), the
   tab with search, all filters, list and spell card, the language setting and toggle.
2. **S2 — German texts:** the descriptions and "At Higher Levels" of all 319 spells in German, in
   batches by level, each batch checked (every spell has a text, dice expressions and numbers match
   the English).
3. **S3 — Links (proposed):** spell names in a stat block's Spellcasting trait and in notes
   (`[[spell:Fireball]]`-free: plain names in the trait) open the spellbook on that spell; own spells
   as `type: spell` notes join the list (§5).

## 5. Own spells (S3)

A note with `type: spell` and frontmatter `level`, `school`, `casting_time`, `range`,
`components`, `duration`, `classes`, `concentration`, `ritual` and the description as its body
joins the list, marked "own" — so Player's Handbook spells the GM owns can be typed in by hand.

## 6. Architecture

```
src/spells/srd-spells.ts   the 319 SRD spells (English), generated once, checked in tests
src/spells/de.ts           German names and (S2) texts, by spell index
src/spells/model.ts        Spell type, filters, search, German meta (schools, units …)
src/obsidian/spellbook-view.ts   the tab: filters, list, card
```

Size: the English data is about 350 KB, the German as much again; the plugin's `main.js` grows by
that (fine for a desktop and phone plugin; no network).

## 7. Calls made in the review

- The spellbook is module 3 and starts after the NPC builder.
- German distances in metres (5 ft = 1.5 m).

## 8. Calls I made without the maintainer (check these)

- Only SRD spells; others as own notes in S3.
- The spellbook follows the NPC builder's dice-text language setting, with a toggle on the card.
- School colours from Obsidian's palette (red, orange, yellow, green, cyan, blue, purple, pink).
- German spell names: the established German names where they exist (Feuerball, Magisches
  Geschoss, Schild …), otherwise a faithful translation.
