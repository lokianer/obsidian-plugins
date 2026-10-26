// A table row's Markdown written into an element inline, with Obsidian's renderer, so its links
// show and open their note (Ctrl/Cmd in a new tab) — on the dice stage and in the Dice tab.

import { type App, type Component, Keymap, MarkdownRenderer } from 'obsidian';

import type { RenderText } from './dice-stage';

export function inlineMarkdown(app: App, component: Component): RenderText {
  return (markdown, el) => {
    const box = createDiv();
    void MarkdownRenderer.render(app, markdown, box, '', component).then(() => {
      const paragraph = box.querySelector('p');
      el.append(...Array.from((paragraph ?? box).childNodes));
    });
    el.addEventListener('click', (event) => {
      const link = event.target instanceof Element ? event.target.closest('a.internal-link') : null;
      const href = link?.getAttribute('data-href');
      if (href === null || href === undefined) return;
      // The stage would take the click as "roll again" or "close".
      event.preventDefault();
      event.stopPropagation();
      void app.workspace.openLinkText(href, '', Keymap.isModEvent(event));
    });
  };
}
