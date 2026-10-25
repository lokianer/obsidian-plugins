// Spell names in a rendered Spellcasting trait become links that open the spellbook on that spell.
// Text nodes are split and wrapped with createEl — no innerHTML; text inside links is left alone.

import type { SpellMatch } from '../spells/links';

export function linkSpells(
  el: HTMLElement,
  find: (text: string) => SpellMatch[],
  open: (index: string) => void,
): void {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
    if (node.parentElement?.closest('a, strong') === null) nodes.push(node as Text);
  }
  for (const node of nodes) {
    const text = node.data;
    const matches = find(text);
    if (matches.length === 0) continue;
    const parts = createFragment();
    let at = 0;
    for (const m of matches) {
      parts.append(text.slice(at, m.start));
      const link = parts.createEl('a', {
        cls: 'dnd5e-spell-link',
        text: text.slice(m.start, m.end),
        attr: { href: '#', 'data-spell': m.index },
      });
      link.addEventListener('click', (event) => {
        event.preventDefault();
        open(m.index);
      });
      at = m.end;
    }
    parts.append(text.slice(at));
    node.replaceWith(parts);
  }
}
