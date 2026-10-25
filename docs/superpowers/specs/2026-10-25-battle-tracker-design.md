# Battle Tracker — design

Date: 2026-10-25. Status: **reviewed 2026-10-25 (every call in §8 accepted); B1, B2 and B3 built, awaiting the check**. Module 6 of
`dnd5e-byLokianer`, after the Monster Manual.

Asked for by the maintainer ("jetzt Battletracker"). Decided with them: **its own tab**; initiative
and rounds, hit points, damage and conditions, the session log and an encounter builder; combatants
from an **encounter note**, from the **Monster Manual** and the **party** joining by itself; the
running fight's state **in the encounter note**.

## 1. Goals

- **A Battle tab** (command **Open battle tracker**, a ribbon icon), one per workspace, laid out like
  the Monster Manual: on the left the initiative order, on the right the active combatant's card
  (stat block for monsters and NPCs; AC, HP and notes for player characters). On phones the order
  comes first, a tap opens the card.
- **Start a fight** from an encounter note (command **Start encounter** in the note, or a button in
  the tab listing the campaign's encounters). The party of the campaign joins unless the note says
  `party: false`.
- **Initiative**: monsters and NPCs roll d20 + their Dexterity modifier (or a written `initiative`
  bonus); a group with a `count` rolls once for all its members, as the SRD suggests; player
  characters' rolls are typed in (or rolled with their `initiative` bonus). Ties go to the higher
  Dexterity. The order can be dragged or nudged.
- **Rounds and turns**: Next turn / Previous turn, the round counter, the active combatant marked;
  defeated combatants are skipped.
- **Hit points**: damage, healing and temporary hit points per combatant with one number field and
  three buttons; temporary hit points absorb damage first; at 0 a monster is defeated, a player
  character is down with death saves (three successes, three failures) shown on their row.
- **Conditions**: the SRD's conditions (and exhaustion levels) as chips on a row, each with an
  optional duration in rounds that counts down at the end of the combatant's turn and drops off at
  0; concentration as a mark that, when its holder takes damage, reminds of the Constitution save
  (DC 10 or half the damage, whichever is higher).
- **German too**: everything in the tab follows the plugin's language; monster cards as in the
  Monster Manual.

## 2. Files first: the encounter note

The note says who fights; the plugin keeps the running fight in the same note, so it survives a
restart and reads without the plugin.

```markdown
---
type: encounter
location: '[[Lantern Bridge]]'
party: true # the campaign's party joins (the default)
combatants:
  - '[[Sable]]' # a note: its stat block, or ac / hp / initiative in its frontmatter
  - monster: Owlbear # an SRD or own monster from the Monster Manual
    count: 2
  - name: Court thug # written right here
    count: 4
    ac: 11
    hp: 32
    initiative: 0
    side: enemy
---

## Combat

Round 3 · Turn: Court thug 2

| Init | Combatant    | HP    | AC  | Conditions    |
| ---- | ------------ | ----- | --- | ------------- |
| 21   | [[Dagny]]    | 54/71 | 15  | raging        |
| 17   | Court thug 2 | 12/32 | 11  | prone (1)     |
| 12   | [[Sable]]    | 40/40 | 15  | concentration |
| 9    | Owlbear 1    | 0/59  | 13  | defeated      |
```

- **Start** writes the `## Combat` section (or replaces it after asking); every change after that
  edits only the lines of that section through `vault.process` — the round line and the row of the
  combatant that changed.
- A row is the truth for that combatant: hit points `current/max` (and `+temp`), the conditions as
  plain words with the rounds left in brackets, `defeated`, `down`, death saves as `✓✓✗`.
- **End combat** writes "Ended after N rounds" under the section and leaves the table as the record.
- The provisional format of the example vault's encounter keeps working (`name` + `count` + `ac` +
  `hp`, links to notes); `monster:` is new.

## 3. The session log (phase B2)

Like the factions' log: when a fight starts, after each round, when a combatant is defeated and when
it ends, a notice offers **Log → Session 14**, or an automatic setting writes the lines under
`## Log` of tonight's session ("21:40 Combat at [[Lantern Bridge]] begins", "Round 3: Owlbear 1
defeated", "21:58 Combat ends after 5 rounds — XP 1,400").

## 4. The encounter builder (phase B3)

**New encounter** opens a builder in the New NPC dialog's style: monsters from the Monster Manual
(SRD and own) as tiles with counts, the campaign's party with their levels, and the difficulty as an
XP budget per character, using the **SRD 5.2**'s encounter-building table (Low, Moderate, High;
CC-BY-4.0 like the 5.1). It writes a `type: encounter` note. From the Monster Manual, **Add to
combat** puts a monster into the running fight, **Add to encounter** into an encounter note.

## 5. Non-goals

- No battle map, grid or token positions; no line of sight. (Other plugins and tools do maps.)
- No automatic attack rolls or damage from stat blocks — the GM rolls (the Dice module, later,
  may link in).
- No player view or second screen in this module.
- No network.

## 6. Phases

1. **B1 — The tracker:** the encounter note format, Start encounter, party joining, initiative,
   rounds and turns, hit points with temporary ones and death saves, conditions with durations,
   concentration reminders, the state in `## Combat`, the tab with order and card, German.
2. **B2 — Log and Monster Manual:** session log lines, Add to combat from the Monster Manual,
   adding and removing combatants mid-fight.
3. **B3 — Encounter builder:** New encounter with the SRD 5.2 XP budget, Add to encounter from the
   Monster Manual.

## 7. Architecture

```
src/battle/encounter.ts   pure: read an encounter note's combatants (notes, monsters, inline)
src/battle/fight.ts       pure: the fight as state — order, round, turn, HP, conditions, actions
src/battle/table.ts       pure: the ## Combat section to and from the state, line edits
src/obsidian/battle-view.ts   the tab
```

## 8. Calls I made without the maintainer (check these)

- Groups roll one initiative for all members; members are numbered ("Court thug 1 … 4").
- Player characters' initiative is typed in by default, with a dice button using their bonus.
- Monsters at 0 HP are defeated and skipped; player characters go down and track death saves.
- Condition durations count down at the end of the affected combatant's turn.
- The fight's state is a Markdown table in `## Combat` of the encounter note; nothing is kept only
  in the plugin.
- Three phases: the tracker, then log and Monster Manual, then the encounter builder.
- The encounter builder uses the SRD 5.2's XP budget (Low / Moderate / High), since the SRD 5.1 has
  no encounter-building rules.
