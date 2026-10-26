# Monster Manual M2 — German Texts — Implementation Plan

**Status:** built 2026-10-25, accepted in Obsidian on 2026-10-26 ("es läuft alles") (the maintainer chose M2 after B3).

**Goal:** The traits, actions, bonus actions, reactions, legendary actions and the legendary
paragraph of all 334 SRD monsters in German, shown wherever an SRD monster's stat block is shown in
German: the Monster Manual's card, the Battle tab's card and the monster builder when it starts
from an SRD monster.

**Spec:** `docs/superpowers/specs/2026-10-25-monster-manual-design.md` §4 (phase M2).

## How the texts were made

1,503 entries, about 41,500 English words. Most are formulas, so the translation went in three
steps, in the scratchpad (not shipped; the data files are the contract):

1. **Formulas by rule:** attack lines (`+5 to hit` → `+5 auf Treffer`, `1d6` → `1W6`,
   `bludgeoning damage` → `Wuchtschaden`), recharge and per-day suffixes, spell lists (headers,
   the spells' German names from the spellbook), lengths (5 ft. = 1,5 m).
2. **Templates by hand:** every remaining text with the monster as a subject, numbers, dice and
   lengths as placeholders — 569 distinct templates — translated once each; the subject comes in
   with its gender and case ("Der Drache", "des Drachen", "seinem Biss").
3. **Entry names by hand:** 335 distinct names (Multiattack → Mehrfachangriff, Keen Smell →
   Scharfer Geruchssinn …).

The result is written to `src/monsters/de-texts/` by challenge rating band, like the spells'
`src/spells/de-texts/`.

## Review Focus

1. **Every entry, one for one** (tests): all 334 monsters, every list as long as the English one,
   the legendary paragraph where the English has one.
2. **Numbers kept** (tests): every die (`2d6` ↔ `2W6`), attack bonus and DC (`DC 13` ↔ `SG 13`) of
   the English text, entry by entry.
3. **No feet, miles, pounds or inches, and no English** (tests).
4. **Spell links** (tests): the spells of every Spellcasting entry are found by the spellbook's
   finder in German as in English.
5. **Where it shows:** `germanTexts(block, index)` (pure) swaps the lists only where they match one
   for one; the Monster Manual's and the Battle tab's cards in German; the monster builder starting
   from an SRD monster in German takes the German name and texts (its dropdowns still store the
   SRD's English header words).

## Calls I made without the maintainer (check these)

- Terms as in the plugin's German spell texts: Konstitutionsrettungswurf mit SG 13, im Vorteil,
  zu Boden geworfen, gepackt (Entkommen-SG 13), festgesetzt, Schallschaden for thunder,
  Energieschaden for force, gleißender Schaden for radiant.
- The monster is named by its German noun with article ("der Drache"), not by its full name.
- The monster builder now starts from the German texts with German Obsidian (before, it copied the
  English ones, as there were none).
- **Insert into note** and **Make a note** still write the SRD's English block.
