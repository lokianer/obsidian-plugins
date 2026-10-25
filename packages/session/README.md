# @obsidian-plugins/session

Shared, pure TypeScript for "tonight's session" — the session note with the highest `session:`
number — used by the plugins in this repository that write to it: finding it, deciding whether a
new session note is due, filling the session template, carrying the `## Loot` of the last session
into the next one (marked with its origin), inserting lines under `## Log`, and reading those lines
back as history. No Obsidian API, no DOM; unit-tested in Node.

Licence MIT (see the repository root).
