---
type: npc
relations:
  The Archivists: [3
---

# Broken YAML – unclosed list

A **test note**: its frontmatter is broken on purpose (the list after _The Archivists_ is never closed), so it does not parse. The plugin must name this note in its warnings instead of dropping it silently; until the YAML is fixed it is not a member of anything.
