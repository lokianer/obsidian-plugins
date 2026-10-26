<div align="center">

# 🎲 Obsidian Plugins by Lokianer

**A collection of local-first Obsidian plugins: plain Markdown in, insight out.**

[![Licence: MIT](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/lokianer/obsidian-plugins/actions/workflows/ci.yml/badge.svg)](https://github.com/lokianer/obsidian-plugins/actions/workflows/ci.yml)
[![Obsidian ≥ 1.8.7](https://img.shields.io/badge/Obsidian-%E2%89%A5%201.8.7-7c3aed.svg?logo=obsidian&logoColor=white)](https://obsidian.md/)

**[Project page](https://lokianer.github.io/obsidian-plugins/)** · [Roadmap](ROADMAP.md) · [Example vault](examples/vault/Home.md)

</div>

---

Every Obsidian plugin I build lives here, one per folder, sharing principles, tooling, CI and one
example vault:

- **Files first.** Your Markdown notes are the truth; anything a plugin derives can be rebuilt.
- **Readable without the plugin.** Plain Markdown and hand-writable YAML.
- **Local and private.** No telemetry, no accounts, no network calls.
- **Desktop and mobile, every theme, English and German.**

## 🧩 Plugins

| Plugin                                               | Status                                                                                       | What it does                                                                                                                       |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 🐉 [**dnd5e-byLokianer**](plugins/dnd5e-bylokianer/) | 📦 [0.1.0](https://github.com/lokianer/obsidian-plugins/releases/tag/dnd5e-bylokianer-0.1.0) | D&D 5e for game masters: factions, NPCs with stat blocks, spellbook, Deck of Many Things, Monster Manual, battle tracker and dice. |
| 🗡️ **Daggerheart plugin** (name open)                | 🗺️ [Planned](ROADMAP.md#daggerheart-plugin-planned-2026-10-26), no code yet                  | The same tools for Daggerheart: factions, adversaries, duality dice, combat with Fear and the spotlight, domain cards.             |

Each plugin's README has its screenshots, conventions, commands and settings; its `CHANGELOG.md`
and `DECISIONS.md` sit beside it. Releases are on the
[releases page](https://github.com/lokianer/obsidian-plugins/releases) (none is in Obsidian's
community directory yet).

## 🗺️ Example vault

[`examples/vault/`](examples/vault/) holds **Silverstadt**, a campaign city of tides, bells and
records, used by every plugin's tests; [`Home.md`](examples/vault/Home.md) maps each feature to the
notes that exercise it.

```bash
pnpm install
pnpm build
pnpm --filter dnd5e-bylokianer install-example   # then open examples/vault in Obsidian
```

## 🛠️ Development

Node 24 and pnpm 12. `pnpm check` runs what CI runs on Linux, macOS and Windows: format, lint,
typecheck, tests, build. In a fresh clone run `git config core.hooksPath .githooks` once.

```
plugins/<id>/        one plugin per folder: manifest, src/, test/, screenshots/, its own docs
packages/<name>/     shared pure TypeScript (packages/session: session log, loot)
examples/vault/      the shared test vault
docs/superpowers/    designs (specs/) and plans per phase (plans/)
site/                the project page (GitHub Pages)
```

**Adding a plugin:** a folder under `plugins/` (dnd5e-byLokianer is the template), shared logic in
`packages/`, test notes in `examples/vault/` with rows in `Home.md`, a row above, a card in
`site/index.html`, a section in `ROADMAP.md`.

Where things stand: [ROADMAP.md](ROADMAP.md) · how the last session ended: [HANDOFF.md](HANDOFF.md).

## 📄 Licence

MIT, see [LICENSE](LICENSE). © 2026 Lokianer. Game content each plugin ships (the D&D SRD under
CC-BY-4.0) and what it takes from other projects is listed in that plugin's README.
