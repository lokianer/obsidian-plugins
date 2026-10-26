// @vitest-environment happy-dom
// The plugin's wiring: loading it against a stand-in app registers every command, view, ribbon icon
// and processor of the seven modules, in the ribbon's order.

import './dom';

import { expect, it } from 'vitest';

import Dnd5ePlugin from '../../src/main';

/** An app whose every member is a function returning another such object: enough for `onload`. */
function anyApp(): unknown {
  const handler: ProxyHandler<() => void> = {
    get: (_target, key) => (key === 'then' ? undefined : anyApp()),
    apply: () => anyApp(),
  };
  return new Proxy(() => undefined, handler);
}

it('registers every module of the plugin', async () => {
  const plugin = new Dnd5ePlugin(anyApp() as never, {} as never);
  await plugin.onload();
  const registered = (plugin as unknown as { registered: Record<string, unknown> }).registered;
  expect(registered).toMatchInlineSnapshot(`
    {
      "codeBlocks": [
        "dnd5e-statblock",
      ],
      "commands": [
        "show-faction-warnings",
        "show-faction-tensions",
        "open-faction-world",
        "start-next-session",
        "edit-faction-data",
        "open-spellbook",
        "new-spell",
        "open-monster-manual",
        "new-monster",
        "open-deck-of-many-things",
        "new-deck",
        "open-dice",
        "remove-dice-lines",
        "open-battle-tracker",
        "remove-battle-lines",
        "new-encounter",
        "convert-statblock",
        "new-npc",
        "new-archetype",
        "new-race",
        "add-statblock",
      ],
      "editorExtensions": 1,
      "postProcessors": 2,
      "ribbon": [
        "network",
        "book-open",
        "skull",
        "layers",
        "dices",
        "swords",
      ],
      "settingTabs": 1,
      "views": [
        "dnd5e-tensions",
        "dnd5e-faction-world",
        "dnd5e-spellbook",
        "dnd5e-monster-manual",
        "dnd5e-deck",
        "dnd5e-dice",
        "dnd5e-battle",
      ],
    }
  `);
});
