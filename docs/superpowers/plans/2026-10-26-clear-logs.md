# Clearing Battle and Dice Logs — Implementation Plan

**Status:** built 2026-10-26, awaiting the check in Obsidian.

**Asked for** by the maintainer ("Ich brauche auch einen Button löschen von battle logs und
würfellogs"); asked what to clear, they chose all three: the Dice tab's list, the lines in tonight's
session, the fight in the encounter note.

## Review Focus

1. **Tonight's log** (`removeFromLog` in `packages/session`, pure): removes the plain `- HH:MM …`
   lines of `## Log` whose text a predicate picks; lines in a `> [!gm]` callout, the relation
   changes and the GM's own lines stay; a doubled blank line left behind goes too.
   `isBattleLine` (`src/battle/log.ts`) knows the battle tracker's lines, `isDiceLine`
   (`src/dice/formula.ts`) the rolls. `SessionLog.removeLines(kind)` counts, asks ("Remove 7 lines
   from the log of Session 15?"), removes, and says how many went.
2. **The Battle tab's ⋮ menu:** Reset the fight (asks, then removes the `## Combat` section with
   `withoutCombat`; the line-up shows again) and Remove battle lines from tonight's session.
3. **The Dice tab's ⋮ menu** beside "Rolls": Clear the list (this Obsidian session's rolls, no
   question — nothing in a note changes) and Remove dice lines from tonight's session.
4. **Commands:** Remove battle lines from tonight's session, Remove dice lines from tonight's
   session.

## Calls I made without the maintainer (check these)

- Only tonight's session (the one the log writes to); older sessions keep their lines.
- Secret lines in `[!gm]` callouts are never removed (battle and dice lines are not written there).
- Clearing the Dice tab's list asks nothing: it lives in memory only.
