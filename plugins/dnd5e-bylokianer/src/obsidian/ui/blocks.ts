// The building blocks of style C, the plugin's visual language since 2026-11-20: tiles for key
// numbers, section heads in capitals, pills for conditions and filters, a list beside its
// details. Every view builds them here, so they look the same everywhere; their rules live in
// `styles/base.css`.

/** A grid that holds tiles. */
export function tiles(parent: HTMLElement): HTMLElement {
  return parent.createDiv({ cls: 'dnd5e-tiles' });
}

/**
 * A tile: the value large, an optional note muted under it (`natural armor`, `19d12 + 133`), its
 * label last. Returns the value element, to make it editable.
 */
export function tile(
  parent: HTMLElement,
  value: string,
  label: string,
  note: string | null = null,
): { el: HTMLElement; value: HTMLElement } {
  const el = parent.createDiv({ cls: 'dnd5e-tile' });
  const shown = el.createDiv({ cls: 'dnd5e-tile-value', text: value });
  if (note !== null && note !== '') el.createDiv({ cls: 'dnd5e-tile-note', text: note });
  el.createDiv({ cls: 'dnd5e-tile-label', text: label });
  return { el, value: shown };
}

/** A section's head: Actions, Relations, Conditions. */
export function sectionHead(parent: HTMLElement, text: string): HTMLElement {
  return parent.createDiv({ cls: 'dnd5e-section-head', text });
}

/** A pill: a condition, a filter, a tag; tinted with the accent when active. */
export function pill(parent: HTMLElement, text: string, active = false): HTMLElement {
  return parent.createSpan({ cls: active ? ['dnd5e-pill', 'is-active'] : 'dnd5e-pill', text });
}

/** A list beside its details; one column in narrow places. */
export function split(parent: HTMLElement): { list: HTMLElement; details: HTMLElement } {
  const el = parent.createDiv({ cls: 'dnd5e-split' });
  return {
    list: el.createDiv({ cls: 'dnd5e-split-list' }),
    details: el.createDiv({ cls: 'dnd5e-split-details' }),
  };
}
