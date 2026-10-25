// @vitest-environment happy-dom
// Smoke tests for the views: each renders the example vault in happy-dom with Obsidian's DOM
// helpers, draws what it should, and turns clicks and drags into the expected actions. They stand in
// for the manual browser preview, which once hid that the graph drew no nodes in Obsidian.

import './dom';

import type { App, MarkdownView, TFile, WorkspaceLeaf } from 'obsidian';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { buildCard } from '../../src/factions/card';
import { buildFactionView } from '../../src/factions/faction-view';
import { buildMatrix } from '../../src/factions/matrix';
import { DEFAULT_THRESHOLDS } from '../../src/factions/tension';
import { buildGraph } from '../../src/factions/world-graph';
import { buildWorld } from '../../src/factions/world';
import { createT } from '../../src/i18n/strings';
import { CardRenderer } from '../../src/obsidian/card-render';
import { FactionViewSvg } from '../../src/obsidian/faction-view-svg';
import { ModeStore } from '../../src/obsidian/mode-store';
import { ValuePopover } from '../../src/obsidian/popover';
import { TensionView } from '../../src/obsidian/tension-view';
import type { WorldCache } from '../../src/obsidian/world-cache';
import { WorldGraphSvg } from '../../src/obsidian/world-graph-svg';
import { renderMatrix } from '../../src/obsidian/world-matrix';
import { loadExampleVault } from '../fixture';

const notes = loadExampleVault();
const world = buildWorld(notes);
const t = createT('en');
const F = 'Silverstadt/Factions';
const ORDER = `${F}/Order of the Lantern`;
const COURT = `${F}/The Gutter Court`;
const BENCH = `${COURT}/The Bench`;

/** Just the vault and metadata cache the popover reads, backed by the example vault. */
const app = {
  vault: { getFileByPath: (path: string) => ({ path }) },
  metadataCache: {
    getFileCache: (file: { path: string }) => ({
      frontmatter: notes.find((n) => n.path === file.path)?.frontmatter,
    }),
  },
} as unknown as App;

const texts = (root: ParentNode, selector: string) =>
  [...root.querySelectorAll(selector)].map((el) => el.textContent);

let root: HTMLElement;
beforeEach(() => {
  document.body.empty();
  root = document.body.createDiv();
});

describe('faction card', () => {
  const render = (path: string) => {
    const card = buildCard(path, notes.find((n) => n.path === path)?.frontmatter, world);
    if (card === null) throw new Error(`no card for ${path}`);
    const renderer = new CardRenderer(
      {
        app,
        view: {} as MarkdownView,
        file: { path } as TFile,
        card,
        world,
        t,
        ui: { secretOpen: false, fieldsOpen: false },
        stepNames: [],
        offerLog: () => {},
        refresh: () => renderer.render(),
      },
      root,
    );
    renderer.render();
  };

  it('shows a faction’s name and its relations', () => {
    render(`${F}/The Drowned Choir/factions.md`);
    expect(texts(root, '.dnd5e-card-name')).toEqual(['The Drowned Choir']);
    expect(root.querySelectorAll('.dnd5e-card-row').length).toBeGreaterThan(0);
  });

  it('keeps a character’s secret section closed', () => {
    render(`${COURT}/Sable.md`);
    expect(texts(root, '.dnd5e-card-name')).toEqual(['Sable']);
    expect(root.textContent).not.toContain('Order of the Lantern: +');
  });
});

describe('world graph', () => {
  const actions = {
    openNote: vi.fn(),
    openValue: vi.fn(),
    history: () => [],
    openFaction: vi.fn(),
    savePositions: vi.fn(),
  };

  it('draws every node, frame and arrow of the graph', () => {
    const graph = buildGraph(world, 'public');
    new WorldGraphSvg(root, t, () => [], actions).update(world, 'public', {});
    expect(root.querySelectorAll('.dnd5e-world-node').length).toBe(graph.nodes.length);
    expect(root.querySelectorAll('.dnd5e-world-node.is-frame').length).toBe(2);
    expect(root.querySelectorAll('.dnd5e-world-edge').length).toBe(graph.edges.length);
    expect(texts(root, '.dnd5e-world-label')).toContain('The Gutter Court');
  });

  it('opens a faction’s view on a click', () => {
    new WorldGraphSvg(root, t, () => [], actions).update(world, 'public', {});
    const court = [...root.querySelectorAll('.dnd5e-world-node')].find((n) =>
      n.textContent?.startsWith('The Gutter Court'),
    );
    court?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(actions.openFaction).toHaveBeenCalledWith(COURT);
  });
});

describe('matrix', () => {
  it('shows inherited values dashed and opens the popover on a cell', () => {
    const openValue = vi.fn();
    renderMatrix(root, buildMatrix(world, 'public'), t, [], {
      openNote: () => {},
      openValue,
      history: () => [],
    });
    expect(root.querySelectorAll('td.has-value').length).toBeGreaterThan(0);
    expect(root.querySelectorAll('td.is-inherited').length).toBeGreaterThan(0);
    root.querySelector('td.has-value')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(openValue).toHaveBeenCalledOnce();
  });
});

describe('faction view', () => {
  const setup = () => {
    const saved: Record<string, Record<string, { x: number; y: number }>> = {};
    const view = new FactionViewSvg(root, t, () => [], {
      openNote: () => {},
      openFaction: () => {},
      openValue: () => {},
      history: () => [],
      moves: (id) => saved[id] ?? {},
      saveMoves: (id, moves) => (saved[id] = moves),
    });
    const court = buildFactionView(world, COURT, 'public');
    if (court === null) throw new Error('no court');
    view.update(court, new Map());
    return saved;
  };

  it('draws the frame with its members and the boxes it reaches', () => {
    setup();
    expect(texts(root, '.dnd5e-fv-frame-title')).toEqual(['The Gutter Court']);
    expect(texts(root, '.dnd5e-fv-chip text')).toEqual(['Mira Voss', 'Sable', 'The Bench']);
    expect(texts(root, '.dnd5e-fv-box-title')).toContain('Order of the Lantern');
  });

  it('keeps where the frame was dragged', () => {
    const saved = setup();
    const frame = root.querySelector('.dnd5e-fv-frame');
    const pointer = (type: string, x: number) =>
      new PointerEvent(type, { bubbles: true, button: 0, clientX: x, clientY: 0 });
    frame?.dispatchEvent(pointer('pointerdown', 0));
    window.dispatchEvent(pointer('pointermove', 50));
    window.dispatchEvent(pointer('pointerup', 50));
    expect(saved[COURT]?.[COURT]).toEqual({ x: 50, y: 0 });
  });
});

describe('popover', () => {
  it('shows an inherited value with where it comes from', () => {
    const popover = new ValuePopover(root, {
      app,
      t,
      stepNames: () => [],
      openCard: () => {},
      offerLog: () => {},
    });
    popover.open({ subject: BENCH, target: ORDER, at: { x: 0, y: 0 } }, world, 'public');
    expect(texts(root, '.dnd5e-popover-title')).toEqual(['The Bench → Order of the Lantern']);
    expect(root.querySelector('.dnd5e-popover input[type="range"]')).not.toBeNull();
    expect(root.textContent).toContain('The Gutter Court');
  });
});

describe('tension panel', () => {
  it('lists the tensions of the example vault', async () => {
    const cache = {
      current: world,
      get: () => Promise.resolve(world),
      onChange: () => () => {},
    } as unknown as WorldCache;
    const view = new TensionView({} as WorkspaceLeaf, {
      cache,
      modes: new ModeStore(),
      t,
      thresholds: () => DEFAULT_THRESHOLDS,
      openNote: () => {},
      editValue: () => {},
    });
    root.appendChild(view.contentEl);
    await view.onOpen();
    expect(root.querySelectorAll('.dnd5e-tensions-line').length).toBeGreaterThan(0);
    expect(texts(root, '.dnd5e-tensions-name')).toContain('Mira Voss');
  });
});
