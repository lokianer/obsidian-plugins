// @vitest-environment happy-dom
// Smoke tests for the views: each renders the example vault in happy-dom with Obsidian's DOM
// helpers, draws what it should, and turns clicks and drags into the expected actions. They stand in
// for the manual browser preview, which once hid that the graph drew no nodes in Obsidian.

import './dom';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { App, MarkdownView, TFile, WorkspaceLeaf } from 'obsidian';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parse } from 'yaml';

import { buildCard } from '../../src/factions/card';
import { buildFactionView } from '../../src/factions/faction-view';
import { buildMatrix } from '../../src/factions/matrix';
import { DEFAULT_THRESHOLDS } from '../../src/factions/tension';
import { buildGraph } from '../../src/factions/world-graph';
import { buildWorld } from '../../src/factions/world';
import { createT } from '../../src/i18n/strings';
import { SRD_NPCS } from '../../src/npc/srd';
import type { NpcChoices } from '../../src/npc/note';
import { DEFAULT_TABLES } from '../../src/npc/tables';
import { findStatblocks, parseStatblock, type Statblock } from '../../src/npc/statblock';
import { CardRenderer } from '../../src/obsidian/card-render';
import { FactionViewSvg } from '../../src/obsidian/faction-view-svg';
import { ModeStore } from '../../src/obsidian/mode-store';
import { NewNpcModal } from '../../src/obsidian/npc-modal';
import { ValuePopover } from '../../src/obsidian/popover';
import { renderFolded, renderInvalid, renderStatblock } from '../../src/obsidian/statblock-view';
import { TensionView } from '../../src/obsidian/tension-view';
import type { WorldCache } from '../../src/obsidian/world-cache';
import { WorldGraphSvg } from '../../src/obsidian/world-graph-svg';
import { renderMatrix } from '../../src/obsidian/world-matrix';
import { loadExampleVault } from '../fixture';
import { notices } from './obsidian';

const vault = join(import.meta.dirname, '../../../../examples/vault');
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
  const newNpc = vi.fn();
  const render = (path: string, statblock: Statblock | null = null) => {
    const card = buildCard(path, notes.find((n) => n.path === path)?.frontmatter, world);
    if (card === null) throw new Error(`no card for ${path}`);
    const renderer: CardRenderer = new CardRenderer(
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
        statblock,
        newNpc,
        refresh: () => {
          renderer.render();
        },
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

  it('offers a New NPC button on a faction’s card, not on a character’s', () => {
    render(`${F}/The Drowned Choir/factions.md`);
    root.querySelector('.dnd5e-card-new-npc')?.dispatchEvent(new MouseEvent('click'));
    expect(newNpc).toHaveBeenCalledWith(`${F}/The Drowned Choir`);
    root.empty();
    render(`${COURT}/Sable.md`);
    expect(root.querySelector('.dnd5e-card-new-npc')).toBeNull();
  });

  it('shows a character’s short stats under the title', () => {
    const path = `${F}/Order of the Lantern/Aldric Thane.md`;
    const source = findStatblocks(readFileSync(join(vault, path), 'utf8'))[0]?.source ?? '';
    render(path, parseStatblock(parse(source)));
    expect(texts(root, '.dnd5e-sb-pill')).toEqual(['AC18', 'HP52', 'CR3', 'Speed30 ft.']);
    expect(texts(root, '.dnd5e-sb-short-abilities > div')).toEqual([
      'STR+3',
      'DEX+0',
      'CON+2',
      'INT+0',
      'WIS+1',
      'CHA+2',
    ]);
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
      stats: (path) => (path.endsWith('Mira Voss.md') ? 'AC 16 · HP 84 · CR 5' : null),
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
    expect(texts(root, '.dnd5e-fv-chip title')[0]).toBe(
      'Mira Voss · AC 16 · HP 84 · CR 5 · out of line with its faction',
    );
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

describe('stat block', () => {
  const markdown = (md: string, el: HTMLElement) => {
    el.createEl('p', { text: md });
  };

  it('renders a full block: name, abilities with modifiers, properties and actions', () => {
    const text = readFileSync(join(vault, `${F}/The Gutter Court/Mira Voss.md`), 'utf8');
    const block = findStatblocks(text)[0];
    renderStatblock(root, parseStatblock(parse(block?.source ?? '')), { t, markdown });
    expect(texts(root, '.dnd5e-sb-name')).toEqual(['Mira Voss']);
    expect(texts(root, '.dnd5e-sb-meta')).toEqual(['Medium humanoid (half-elf), lawful evil']);
    expect(texts(root, '.dnd5e-sb-ability')).toEqual([
      'STR11 (+0)',
      'DEX18 (+4)',
      'CON14 (+2)',
      'INT17 (+3)',
      'WIS15 (+2)',
      'CHA16 (+3)',
    ]);
    expect(texts(root, '.dnd5e-sb-line')).toContain('Saving ThrowsDex +7, Int +6');
    expect(texts(root, '.dnd5e-sb-line')).toContain('Challenge5 (1,800 XP)');
    expect(texts(root, '.dnd5e-sb-line')).toContain('Proficiency Bonus+3');
    expect(texts(root, '.dnd5e-sb-section-title')).toEqual(['Actions', 'Reactions']);
    expect(texts(root, '.dnd5e-sb-entry')[0]).toMatch(/^\*\*\*Cunning Action\.\*\*\* On each/);
  });

  it('stands folded in the note behind one line and opens on a click', () => {
    const guard = SRD_NPCS.find((a) => a.name === 'Guard')?.yaml ?? '';
    const toggle = vi.fn();
    renderFolded(root, parseStatblock(parse(guard)), { t, markdown, open: false, toggle });
    expect(texts(root, '.dnd5e-sb-fold-detail')).toEqual(['Guard · AC 16 · HP 11 · CR 1/8']);
    expect(root.querySelector('.dnd5e-statblock')).toBeNull();
    root.querySelector('.dnd5e-sb-fold-head')?.dispatchEvent(new MouseEvent('click'));
    expect(root.querySelector('.dnd5e-statblock')).not.toBeNull();
    expect(toggle).toHaveBeenCalledWith(true);
  });

  it('renders every SRD NPC in German without unreadable values', () => {
    const de = createT('de');
    for (const archetype of SRD_NPCS) {
      renderStatblock(root, parseStatblock(parse(archetype.yaml)), { t: de, markdown });
    }
    expect(root.querySelectorAll('.dnd5e-statblock').length).toBe(21);
    expect(root.querySelector('.dnd5e-sb-warning')).toBeNull();
    expect(texts(root, '.dnd5e-sb-ability-label').slice(0, 6)).toEqual([
      'STÄ',
      'GES',
      'KON',
      'INT',
      'WEI',
      'CHA',
    ]);
  });

  it('shows unparsable YAML as text with a warning', () => {
    renderInvalid(root, 'name: [broken', t);
    expect(texts(root, '.dnd5e-sb-warning')).toEqual(['This stat block is not valid YAML.']);
    expect(texts(root, 'pre')).toEqual(['name: [broken']);
  });
});

describe('New NPC dialog', () => {
  it('rolls, picks a faction and an archetype, and hands the choices over', async () => {
    const create = vi.fn(() => Promise.resolve());
    const modal = new NewNpcModal({
      app,
      t,
      world,
      archetypes: SRD_NPCS,
      tables: DEFAULT_TABLES,
      faction: COURT,
      create,
      random: () => 0,
    });
    modal.onOpen();
    const el = modal.contentEl;
    root.appendChild(modal.modalEl);
    const rows = [...el.querySelectorAll('.setting-item')];
    const row = (name: string) =>
      rows.find((r) => r.querySelector('.setting-item-name')?.textContent === name);
    const select = row('Faction')?.querySelector('select');
    expect(select?.value).toBe(COURT);
    expect([...(select?.options ?? [])].map((o) => o.textContent?.trim()).slice(-2)).toEqual([
      'Party',
      'Unaffiliated',
    ]);

    row('Name')?.querySelector('button')?.dispatchEvent(new MouseEvent('click'));
    expect(row('Name')?.querySelector('input')?.value).toBe('Alda Ashgrove');
    row('Quirk')?.querySelector('button')?.dispatchEvent(new MouseEvent('click'));
    const archetype = row('Archetype')?.querySelector('input');
    if (archetype) {
      archetype.value = 'guard';
      archetype.dispatchEvent(new Event('input'));
    }
    if (select) {
      select.value = BENCH;
      select.dispatchEvent(new Event('change'));
    }
    el.querySelector('button.mod-cta')?.dispatchEvent(new MouseEvent('click'));
    await Promise.resolve();
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Alda Ashgrove',
        quirk: DEFAULT_TABLES.quirks[0],
      }),
      BENCH,
    );
    const calls = create.mock.calls as unknown as [NpcChoices, string][];
    expect(calls[0]?.[0].archetype?.name).toBe('Guard');
  });

  it('refuses without a name or with an unknown archetype', () => {
    const create = vi.fn(() => Promise.resolve());
    const modal = new NewNpcModal({
      app,
      t,
      world,
      archetypes: SRD_NPCS,
      tables: DEFAULT_TABLES,
      faction: COURT,
      create,
    });
    modal.onOpen();
    modal.contentEl.querySelector('button.mod-cta')?.dispatchEvent(new MouseEvent('click'));
    expect(create).not.toHaveBeenCalled();
    expect(notices[notices.length - 1]).toBe('Give the NPC a name');
    const inputs = [...modal.contentEl.querySelectorAll('input')];
    const [name, archetype] = [inputs[0], inputs[1]];
    if (name && archetype) {
      name.value = 'Pell';
      name.dispatchEvent(new Event('input'));
      archetype.value = 'Lantern Warden';
      archetype.dispatchEvent(new Event('input'));
    }
    modal.contentEl.querySelector('button.mod-cta')?.dispatchEvent(new MouseEvent('click'));
    expect(create).not.toHaveBeenCalled();
    expect(notices[notices.length - 1]).toBe('No archetype called “Lantern Warden”');
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
