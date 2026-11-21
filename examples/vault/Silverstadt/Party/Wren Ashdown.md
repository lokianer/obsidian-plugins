---
type: character
player: Ana
rules: '2024'
species: halfling
background: criminal
abilities: { str: 8, dex: 14, con: 12, int: 10, wis: 13, cha: 15 }
choices:
  criminal-ability-scores/abilities: [dex, dex, con]
  origin-languages/languages: [elvish, halfling]
levels:
  - class: bard
    hp: max
    choices:
      bard-core/skills: [deception, performance, persuasion]
      bard-core/tools: [lute, flute, drum]
  - class: bard
    hp: average
    choices:
      bard-expertise/expertise: [persuasion, deception]
  - class: bard
    hp: average
    choices:
      bard-subclass/subclass: bard/college-of-lore
      lore-bonus-proficiencies/skills: [arcana, insight, perception]
  - class: bard
    hp: average
    choices:
      bard-asi-4/feat: ability-score-improvement
      ability-score-improvement/abilities: [cha, cha]
  - class: bard
    hp: average
  - class: bard
    hp: average
inventory:
  - { item: leather, equipped: true }
  - { item: dagger, equipped: true }
hp_current: 31
class: bard
subclass: college of lore
level: 6
ac: 14
hp: 39
initiative: 6
passive_perception: 14
race: halfling
saves: { dex: 6, cha: 6 }
skills:
  { arcana: 3, deception: 9, insight: 4, perception: 4, performance: 6, persuasion: 9, sleight_of_hand: 6, stealth: 6 }
tags:
  - pc
---

# Wren Ashdown

A built character: everything above `hp_current` is what the character builder chose, everything
below it is computed from those choices and rewritten whenever they change. Open the sheet with
**Open character sheet**.

Wren grew up running messages through the Gutter Court's alleys and sings for whoever pays.
