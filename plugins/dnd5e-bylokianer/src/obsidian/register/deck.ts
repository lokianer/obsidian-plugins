// The Deck of Many Things: the tab, deck notes, the deck builder.

import { askReset, DeckBuilderModal } from '../deck-builder';
import { DeckStore } from '../deck-store';
import { cryptoRandom, DECK_VIEW, DeckView } from '../deck-view';
import type { Context } from './context';

export function registerDeck(ctx: Context): void {
  const { plugin, t } = ctx;
  const { app } = plugin;
  const deckStore = new DeckStore(plugin, ctx.cache, t, ctx.settings, (path) => ctx.openNote(path));
  const deckViews = () =>
    app.workspace
      .getLeavesOfType(DECK_VIEW)
      .map((leaf) => leaf.view)
      .filter((view) => view instanceof DeckView);
  const openDeck = () => ctx.revealView(DECK_VIEW);
  const newDeck = () =>
    new DeckBuilderModal(app, {
      t,
      lang: ctx.lang(),
      create: async (deck) => {
        const path = await deckStore.create(deck);
        await openDeck();
        for (const view of deckViews()) await view.show(path);
      },
    }).open();
  plugin.registerView(
    DECK_VIEW,
    (leaf) =>
      new DeckView(leaf, {
        t,
        lang: ctx.lang,
        source: deckStore,
        random: cryptoRandom,
        selected: () => ctx.settings().deckSelected,
        select: (deckSelected) => void ctx.save({ ...ctx.settings(), deckSelected }),
        newDeck,
        confirmReset: () => askReset(app, t),
      }),
  );
  // A deck note edited by hand (a card ticked or unticked) shows in the open tab.
  plugin.registerEvent(
    app.metadataCache.on('changed', (_file, _data, meta) => {
      if (meta.frontmatter?.type !== 'deck') return;
      for (const view of deckViews()) void view.refresh();
    }),
  );
  plugin.addCommand({
    id: 'open-deck-of-many-things',
    name: t('command.openDeck'),
    callback: openDeck,
  });
  plugin.addRibbonIcon('layers', t('command.openDeck'), () => void openDeck());
  plugin.addCommand({ id: 'new-deck', name: t('command.newDeck'), callback: newDeck });
}
