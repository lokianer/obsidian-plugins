---
type: faction
name: The Garbled Hymnal
# out of range: the plugin should clamp to 5 and warn
power: 9
relations:
  # out of range: clamp to +5, warn
  The Archivists: 7
  # not a number: ignore, warn, never crash
  Order of the Lantern: hates
  # a number written as a string: accept
  The Gutter Court: '-1'
  # no such faction or character: show as dangling, warn
  The Salt Kings: -2
  # relation to itself: ignore, warn
  The Garbled Hymnal: 5
  # empty value: treat as "no relation"
  Sable:
  # structured form without a value: ignore, warn
  Elder Wren:
    why: '[[Elder Wren]]'
tags:
  - faction
---

# The Garbled Hymnal

A **test faction**, kept out of the example vault: every value in its frontmatter is broken in a different way, with a comment saying what the plugin should do. Nothing here may crash a view; each problem should show up once in a list of warnings.

The Hymnal has no members — [[Broken YAML – unclosed list]]'s frontmatter is broken, so it is not read as one — and opening it one level deeper should show an empty faction, not an error.
