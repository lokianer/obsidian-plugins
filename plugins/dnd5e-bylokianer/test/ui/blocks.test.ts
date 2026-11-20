// @vitest-environment happy-dom
// The style C building blocks every view composes: tiles, section heads, pills, list | details.

import './dom';

import { beforeEach, describe, expect, it } from 'vitest';

import { pill, sectionHead, split, tile, tiles } from '../../src/obsidian/ui/blocks';

let root: HTMLElement;
beforeEach(() => {
  document.body.empty();
  root = document.body.createDiv();
});

describe('building blocks', () => {
  it('builds a tile with its value and label, returning the value element', () => {
    const grid = tiles(root);
    const { el, value } = tile(grid, '18', 'AC');
    expect(grid.classList.contains('dnd5e-tiles')).toBe(true);
    expect(el.parentElement).toBe(grid);
    expect(root.querySelector('.dnd5e-tile-value')?.textContent).toBe('18');
    expect(root.querySelector('.dnd5e-tile-label')?.textContent).toBe('AC');
    expect(value).toBe(root.querySelector('.dnd5e-tile-value'));
  });

  it('adds a muted note under the value of a tile when given', () => {
    tile(root, '19', 'AC', 'natural armor');
    tile(root, '30 ft.', 'Speed');
    expect([...root.querySelectorAll('.dnd5e-tile-note')].map((n) => n.textContent)).toEqual([
      'natural armor',
    ]);
  });

  it('builds a section head', () => {
    sectionHead(root, 'Actions');
    expect(root.querySelector('.dnd5e-section-head')?.textContent).toBe('Actions');
  });

  it('builds pills, active or not', () => {
    pill(root, 'Prone', true);
    pill(root, 'Blinded');
    const pills = [...root.querySelectorAll('span.dnd5e-pill')];
    expect(pills.map((p) => p.textContent)).toEqual(['Prone', 'Blinded']);
    expect(pills.map((p) => p.classList.contains('is-active'))).toEqual([true, false]);
  });

  it('builds a list beside its details', () => {
    const { list, details } = split(root);
    expect(root.querySelector('.dnd5e-split > .dnd5e-split-list')).toBe(list);
    expect(root.querySelector('.dnd5e-split > .dnd5e-split-details')).toBe(details);
  });
});
