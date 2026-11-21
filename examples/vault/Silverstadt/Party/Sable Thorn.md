---
type: character
player: Jonas
rules: '2024'
species: tiefling
background: sage
abilities: { str: 8, dex: 13, con: 14, int: 12, wis: 10, cha: 15 }
choices:
  tiefling-fiendish-legacy/legacy: tiefling-legacy-infernal
  origin-languages/languages: [elvish, goblin]
  sage-ability-scores/abilities: [int, int, con]
levels:
  - class: warlock
    hp: max
    choices:
      warlock-core/skills: [investigation, religion]
      warlock-eldritch-invocations/invocations: [warlock-invocation-pact-of-the-tome]
      warlock-pact-magic/cantrips: [eldritch-blast, chill-touch]
      warlock-pact-magic/spells: [hellish-rebuke, charm-person]
  - class: warlock
    hp: average
    choices:
      warlock-eldritch-invocations/invocations:
        [warlock-invocation-agonizing-blast, warlock-invocation-devils-sight]
      warlock-pact-magic/spells: [expeditious-retreat]
  - class: warlock
    hp: average
    choices:
      warlock-subclass/subclass: warlock/fiend-patron
      warlock-pact-magic/spells: [misty-step]
  - class: warlock
    hp: average
    choices:
      warlock-asi-4/feat: ability-score-improvement
      ability-score-improvement/abilities: [cha, cha]
      warlock-pact-magic/cantrips: [mage-hand]
      warlock-pact-magic/spells: [hold-person]
  - class: warlock
    hp: average
    choices:
      warlock-eldritch-invocations/invocations:
        [warlock-invocation-armor-of-shadows, warlock-invocation-fiendish-vigor]
      warlock-pact-magic/spells: [counterspell]
inventory:
  - { item: leather, equipped: true }
  - { item: dagger, equipped: true }
  - { item: sickle, equipped: true }
hp_current: 38
class: warlock
subclass: fiend patron
level: 5
ac: 12
hp: 38
initiative: 1
passive_perception: 10
race: tiefling
saves: { wis: 3, cha: 6 }
skills: { arcana: 5, history: 5, investigation: 5, religion: 5 }
tags:
  - pc
---

# Sable Thorn

A built warlock 5, made with the character builder and levelled with increments: the Eldritch
Invocations are stored per level as what each level adds (1, 2, none, none, 2), the spells per level
the same way. Open the sheet with **Open character sheet**.

Sable read her way into a bargain in the Silverstadt archive and has been paying it off in favours ever since.
