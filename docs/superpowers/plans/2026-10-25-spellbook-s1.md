# Spellbook S1 — The Spellbook Tab — Implementation Plan

**Status:** draft, awaiting the maintainer's approval.

**Goal:** A Spellbook tab with the 319 SRD spells: search, filters (level chips, school, class,
ritual, concentration, casting time, damage type, saving throw), a list grouped by level and a
fancy spell card; German names and German meta now, German descriptions in S2.

**Spec:** `docs/superpowers/specs/2026-10-25-spellbook-design.md`.

## Global Constraints

Root `CLAUDE.md`. SRD text only, attribution in README and NOTICE. Theme variables only, text at
least 16 px, keyboard usable, works at phone width. Clean up before every commit, then `pnpm check`.

## Review Focus

1. **Data fidelity:** 319 spells; level, school, classes, components and concentration of a sample
   match the SRD; every spell has a German name, none twice — Tasks 1, 2.
2. **Filters:** combine as AND across groups and OR within a group (level 1 or 2, and Wizard);
   search finds English and German names, ignoring case and accents — Task 3.
3. **Card:** "3rd-level evocation" / "Hervorrufung des 3. Grades", cantrips "Evocation cantrip" /
   "Zaubertrick der Hervorrufung"; German meta for units ("1 action" → "1 Aktion", "60 feet" →
   "18 m"? — see the question below) — Task 4.

**Question for the review:** German units — keep feet ("60 Fuß", as the German rulebooks of 5e do)
or metres ("18 m")? Proposed: feet, as the German 5e books do.

---

### Task 1: Spell data

`src/spells/srd-spells.ts` (generated from the 5e-bits SRD database), `src/spells/NOTICE.md`,
tests.

- [ ] Fields: index, name, level, school, casting time, range, components, material, duration,
      concentration, ritual, classes, damage type, saving throw, description paragraphs, at higher
      levels. Tests: count, sample spells against the SRD (Fireball, Shield, Wish, Guidance).

### Task 2: German names and meta

`src/spells/de.ts`, `src/spells/model.ts`, tests.

- [ ] German names for all 319; schools, classes, damage types, abilities; casting time, range,
      duration and components phrases translated by pattern ("1 bonus action", "Self (15-foot
      cone)", "Concentration, up to 1 minute", "Until dispelled"), with a test that every spell's
      phrases translate (no English left).

### Task 3: Filters and search

`src/spells/model.ts`, tests.

- [ ] `filterSpells(spells, filters, lang)`, `searchSpells`; filter state type, persisted in plugin
      data; counts per filter value for the chips.

### Task 4: The tab

`src/obsidian/spellbook-view.ts`, `main.ts`, `styles.css`, strings, `test/ui/`.

- [ ] Header: search field, level chips, dropdown filters, toggles, match count, reset.
- [ ] List grouped by level (sticky level headings), rows with school colour, C/R marks, casting
      time, range; ↑ ↓ Enter.
- [ ] Spell card: accent by school, both names, level line, meta grid, components with material,
      description (Markdown-rendered), At Higher Levels, badges (damage, save), classes as tags,
      language toggle (S2 fills the German text; until then the card says the text is English).
- [ ] Desktop: list and card side by side; phone: card below, back button.
- [ ] Command **Open spellbook**, ribbon icon `book-open`.

### Task 5: Docs and preview

- [ ] README (with attribution), CHANGELOG, DECISIONS, ROADMAP, HANDOFF; screenshots in the
      browser preview; project page section.
