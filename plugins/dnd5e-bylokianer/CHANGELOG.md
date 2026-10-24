# Changelog

All notable changes to this plugin are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the plugin uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Faction data model: campaign scope, factions and members, relation parsing with warnings,
  public and true stances with inheritance.
- Command **Show faction warnings** (English and German): counts at the top, one card per note,
  warnings grouped as skipped, adjusted, names and notes, each with its key and — where a value was
  changed — what was written and what it is read as (`+7 → 5`). Ctrl/Cmd-click opens a note in a
  new tab.
- Warnings for two keys naming one target (`duplicate-key`) and for passed-over campaign notes
  (`campaign-ignored`); `power` warnings say whether the value was reset, rounded or clamped.
- Warning for a note whose frontmatter does not parse (`broken-frontmatter`), instead of dropping
  it silently.
- Plugin scaffold: manifest, build with esbuild, Vitest, eslint with Obsidian's rules, CI on Linux,
  macOS and Windows.

### Changed

- An en dash (`–3`) reads as a minus; `0x3`, `1e0` and the like are no longer numbers; halves
  round away from zero on both sides.
- `Factions.md` is recognised in any case; a `factions.md` with another `type` is not a faction.
- Name clashes that differ only in case, or a faction named like another's folder, are warned about
  (`duplicate-name` now carries the clashing name).
- The warnings summary says "1 faction" / "1 warning" in the singular.
