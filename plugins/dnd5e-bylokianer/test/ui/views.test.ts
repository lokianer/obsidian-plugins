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
import { SRD_RACES } from '../../src/npc/srd-races';
import { tablesFor } from '../../src/npc/tables';
import { findStatblocks, parseStatblock, type Statblock } from '../../src/npc/statblock';
import { CardRenderer } from '../../src/obsidian/card-render';
import { FactionViewSvg } from '../../src/obsidian/faction-view-svg';
import { ModeStore } from '../../src/obsidian/mode-store';
import { NewNpcModal } from '../../src/obsidian/npc-dialog';
import { SpellbookView, type SpellbookState } from '../../src/obsidian/spellbook-view';
import { cardByName, deckOf } from '../../src/deck/cards';
import {
  appendDraw,
  drawEntry,
  parseDeckNote,
  resetDeck,
  standardDeckText,
  tickCard,
} from '../../src/deck/note';
import { type DraftDeck, ownCards, ownDeckText } from '../../src/deck/own';
import { DeckBuilderModal } from '../../src/obsidian/deck-builder';
import { SpellBuilderModal } from '../../src/obsidian/spell-builder';
import type { SpellDraft } from '../../src/spells/draft';
import { type DeckSource, STANDARD } from '../../src/obsidian/deck-store';
import { DeckView } from '../../src/obsidian/deck-view';
import { BattleView } from '../../src/obsidian/battle-view';
import type { BattleSource } from '../../src/obsidian/battle-store';
import type { Fight, Fighter } from '../../src/battle/fight';
import { combatLines, readCombat } from '../../src/battle/table';
import type { BattleEvent } from '../../src/battle/log';
import { MonsterBuilderModal } from '../../src/obsidian/monster-builder';
import { EncounterBuilderModal } from '../../src/obsidian/encounter-builder';
import type { EncounterDraft } from '../../src/battle/budget';
import type { PartyMember } from '../../src/obsidian/battle-store';
import { MonsterManualView, type MonsterManualState } from '../../src/obsidian/monster-manual-view';
import type { SrdMonster } from '../../src/monsters/model';
import { ownMonster } from '../../src/monsters/own';
import { SRD_MONSTERS } from '../../src/monsters/srd-monsters';
import { linkSpells } from '../../src/obsidian/spell-links';
import { spellFinder } from '../../src/spells/links';
import type { SrdSpell } from '../../src/spells/model';
import { parseOwnSpell } from '../../src/spells/own';
import { SRD_SPELLS } from '../../src/spells/srd-spells';
import { archetypeKind, NewFromBaseModal } from '../../src/obsidian/npc-modal';
import { ValuePopover } from '../../src/obsidian/popover';
import { renderFolded, renderInvalid, renderStatblock } from '../../src/obsidian/statblock-view';
import { TensionView } from '../../src/obsidian/tension-view';
import type { WorldCache } from '../../src/obsidian/world-cache';
import { WorldGraphSvg } from '../../src/obsidian/world-graph-svg';
import { renderMatrix } from '../../src/obsidian/world-matrix';
import { factionHues } from '../../src/factions/hues';
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
const openLinkText = vi.fn();
const app = {
  vault: { getFileByPath: (path: string) => ({ path }) },
  workspace: { openLinkText },
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
        ui: { secretOpen: false, fieldsOpen: true },
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

  it('shows a link in another field as a link that opens its note', () => {
    render(`${ORDER}/factions.md`);
    const leader = root.querySelector('.dnd5e-card-field[data-key="leader"] a.internal-link');
    expect(leader?.textContent).toBe('Isolde Ferrant');
    leader?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(openLinkText).toHaveBeenCalledWith('Isolde Ferrant', `${ORDER}/factions.md`, false);
    expect(root.querySelector('.dnd5e-card-field[data-key="leader"] input')).toBeNull();
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
    const court = [...root.querySelectorAll('.dnd5e-world-node')].find(
      (n) => n.querySelector('.dnd5e-world-label')?.textContent === 'The Gutter Court',
    );
    expect(court?.querySelector('.dnd5e-world-initials')?.textContent).toBe('GC');
    expect(court?.classList.contains('has-hue')).toBe(true);
    court?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(actions.openFaction).toHaveBeenCalledWith(COURT);
  });

  it('lights a hovered faction’s arrows and neighbours and dims the rest', () => {
    new WorldGraphSvg(root, t, () => [], actions).update(world, 'public', {});
    const nodes = [...root.querySelectorAll('.dnd5e-world-node')];
    const court = nodes.find(
      (n) => n.querySelector('.dnd5e-world-label')?.textContent === 'The Gutter Court',
    );
    court?.dispatchEvent(new Event('pointerenter'));
    expect(root.querySelector('svg')?.classList.contains('is-focusing')).toBe(true);
    const lit = nodes.filter((n) => n.classList.contains('is-lit'));
    expect(lit.length).toBeGreaterThan(1);
    expect(lit.length).toBeLessThan(nodes.length);
    expect(root.querySelectorAll('.dnd5e-world-edge.is-lit').length).toBeGreaterThan(0);
    court?.dispatchEvent(new Event('pointerleave'));
    expect(root.querySelectorAll('.is-lit').length).toBe(0);
  });
});

describe('matrix', () => {
  it('shows inherited values dashed and opens the popover on a cell', () => {
    const openValue = vi.fn();
    renderMatrix(root, buildMatrix(world, 'public'), factionHues(world), t, [], {
      openNote: () => {},
      openValue,
      history: () => [],
    });
    expect(root.querySelectorAll('td.has-value').length).toBeGreaterThan(0);
    expect(root.querySelectorAll('td.is-inherited').length).toBeGreaterThan(0);
    expect(
      root.querySelectorAll('.dnd5e-world-row.has-hue .dnd5e-world-avatar').length,
    ).toBeGreaterThan(0);
    const cell = root.querySelector('td.has-value');
    cell?.dispatchEvent(new MouseEvent('mouseenter'));
    expect(root.querySelectorAll('th.is-cross').length).toBe(2);
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
    view.update(court, new Map(), factionHues(world));
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

  it('speaks the graph’s language: colours, initials, hover lighting arrows', () => {
    setup();
    expect(root.querySelector('.dnd5e-fv-frame')?.classList.contains('has-hue')).toBe(true);
    expect(texts(root, '.dnd5e-fv-initials')).toContain('GC');
    const order = [...root.querySelectorAll('.dnd5e-fv-box')].find(
      (b) => b.querySelector('.dnd5e-fv-box-title')?.textContent === 'Order of the Lantern',
    );
    order?.dispatchEvent(new Event('pointerenter'));
    expect(root.querySelector('svg')?.classList.contains('is-focusing')).toBe(true);
    expect(order?.classList.contains('is-lit')).toBe(true);
    expect(root.querySelectorAll('.dnd5e-world-edge.is-lit').length).toBeGreaterThan(0);
    order?.dispatchEvent(new Event('pointerleave'));
    expect(root.querySelectorAll('.is-lit').length).toBe(0);
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

  it('edits values, abilities and entries in place through the given writes', async () => {
    const aldric = `${F}/Order of the Lantern/Aldric Thane.md`;
    const source = findStatblocks(readFileSync(join(vault, aldric), 'utf8'))[0]?.source ?? '';
    const done = () => Promise.resolve(true);
    const edit = {
      scalar: vi.fn(done),
      ability: vi.fn(done),
      entry: vi.fn(done),
      add: vi.fn(done),
      remove: vi.fn(done),
    };
    renderStatblock(root, parseStatblock(parse(source)), { t, markdown, edit });
    const type = (el: Element | null | undefined, value: string) => {
      el?.dispatchEvent(new MouseEvent('click'));
      const input = root.querySelector<HTMLInputElement>('input.dnd5e-sb-input');
      if (input === null) throw new Error('no input');
      input.value = value;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    };
    const ac = [...root.querySelectorAll('.dnd5e-sb-line')].find((l) =>
      l.textContent?.startsWith('Armor Class'),
    );
    type(ac?.querySelector('.is-editable'), '17');
    expect(edit.scalar).toHaveBeenCalledWith('ac', 18, 17);
    type(root.querySelectorAll('.dnd5e-sb-ability .is-editable')[1], '14');
    expect(edit.ability).toHaveBeenCalledWith(1, 11, 14);
    type(root.querySelector('.dnd5e-sb-name'), 'Aldric the Brave');
    expect(edit.scalar).toHaveBeenCalledWith('name', 'Captain Aldric Thane', 'Aldric the Brave');

    expect(texts(root, '.dnd5e-sb-section-title')).toEqual([
      'Traits',
      'Actions',
      'Bonus Actions',
      'Reactions',
    ]);
    const actions = root.querySelectorAll('.dnd5e-sb-section')[1];
    actions?.querySelector('.dnd5e-sb-add')?.dispatchEvent(new MouseEvent('click'));
    expect(edit.add).toHaveBeenCalledWith('actions');
    const lay = actions?.querySelectorAll('.dnd5e-sb-entry')[1];
    lay?.querySelectorAll('.dnd5e-sb-tools button')[1]?.dispatchEvent(new MouseEvent('click'));
    expect(edit.remove).toHaveBeenCalledWith('actions', 1, 'Lay on Hands');
    lay?.querySelector('.dnd5e-sb-tools button')?.dispatchEvent(new MouseEvent('click'));
    const name = lay?.querySelector<HTMLInputElement>('input');
    if (name) name.value = 'Healing Touch';
    lay?.querySelector('button.mod-cta')?.dispatchEvent(new MouseEvent('click'));
    await Promise.resolve();
    expect(edit.entry).toHaveBeenCalledWith('actions', 1, 'name', 'Lay on Hands', 'Healing Touch');
    expect(edit.entry).toHaveBeenCalledTimes(1);
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
  /** Opens the dialog in `root`; helpers find rows by label and tiles by name. */
  function open(lang: 'en' | 'de', create = vi.fn(() => Promise.resolve()), random = () => 0) {
    const modal = new NewNpcModal({
      app,
      t,
      world,
      archetypes: SRD_NPCS,
      races: SRD_RACES,
      tables: tablesFor(lang),
      lang,
      faction: COURT,
      create,
      random,
    });
    modal.onOpen();
    root.appendChild(modal.modalEl);
    const el = modal.contentEl;
    const row = (label: string) =>
      [...el.querySelectorAll('.setting-item')].find(
        (r) => r.querySelector('.setting-item-name')?.textContent === label,
      );
    const input = (label: string) => row(label)?.querySelector('input');
    const click = (target: Element | null | undefined) =>
      target?.dispatchEvent(new MouseEvent('click'));
    const tile = (name: string) =>
      [...el.querySelectorAll('.dnd5e-npc-tile')].find(
        (t) => t.querySelector('.dnd5e-npc-tile-name')?.textContent === name,
      );
    const type = (target: HTMLInputElement | null | undefined, value: string) => {
      if (!target) return;
      target.value = value;
      target.dispatchEvent(new Event('input'));
    };
    const preview = () => el.querySelector('.dnd5e-npc-preview');
    return { el, row, input, click, tile, type, preview, create };
  }

  it('rolls, picks a faction and an archetype tile, and hands the choices over', async () => {
    const { el, row, input, click, tile, create } = open('en');
    const select = row('Faction')?.querySelector('select');
    expect(select?.value).toBe(COURT);
    expect([...(select?.options ?? [])].map((o) => o.textContent?.trim()).slice(-2)).toEqual([
      'Party',
      'Unaffiliated',
    ]);
    click(row('Name')?.querySelector('button'));
    expect(input('Name')?.value).toBe('Alda Ashgrove');
    click(row('Quirk')?.querySelector('button'));
    click(tile('Guard'));
    expect(tile('Guard')?.classList.contains('is-selected')).toBe(true);
    expect(tile('Guard')?.textContent).toContain('AC 16 · HP 11 · CR 1/8');
    if (select) {
      select.value = BENCH;
      select.dispatchEvent(new Event('change'));
    }
    click(el.querySelector('button.mod-cta'));
    await Promise.resolve();
    const calls = create.mock.calls as unknown as [NpcChoices, string][];
    expect(calls[0]?.[0]).toMatchObject({
      name: 'Alda Ashgrove',
      quirk: tablesFor('en').quirks[0],
    });
    expect(calls[0]?.[0].archetype?.name).toBe('Guard');
    expect(calls[0]?.[1]).toBe(BENCH);
  });

  it('rolls names and looks for the chosen race tile, in the dialog’s language', () => {
    const { row, input, click, tile } = open('de');
    expect(tile('Zwerg')?.textContent).toContain('Mittelgroß · 7,5 m · Dunkelsicht 18 m');
    expect(tile('Kämpfer')?.textContent).toContain('W10 · STÄ, GES');
    click(tile('Zwerg'));
    click(row('Name')?.querySelector('button'));
    expect(input('Name')?.value).toBe('Adran Anvilhand');
    click(row('Appearance')?.querySelector('button'));
    expect(input('Appearance')?.value).toBe(
      'ein geflochtener roter Bart, tiefliegende braune Augen, rötliche, wettergegerbte Haut; Tintenfleckige Finger und eine Feder hinter dem Ohr',
    );
    click(row('Age')?.querySelector('button'));
    expect(input('Age')?.value).toBe('50');
  });

  it('rolls everything that is not locked, typing locks, and the preview follows', async () => {
    const { el, row, input, click, tile, type, preview, create } = open('en');
    type(input('Voice'), 'A whisper like dry paper');
    expect(row('Voice')?.classList.contains('is-locked')).toBe(true);
    // The quirk's lock, by hand.
    click(row('Quirk')?.querySelectorAll('button')[1]);
    click(el.querySelector('.dnd5e-npc-roll-all'));
    expect(input('Voice')?.value).toBe('A whisper like dry paper');
    expect(input('Quirk')?.value).toBe('');
    expect(input('Hook')?.value).toBe(tablesFor('en').hook[0]);
    expect(tile('Barbarian')?.classList.contains('is-selected')).toBe(true);
    const name = input('Name')?.value ?? '';
    expect(name).not.toBe('');
    expect(preview()?.querySelector('.dnd5e-npc-card-name')?.textContent).toBe(name);
    expect(preview()?.querySelector('.dnd5e-npc-card-sub')?.textContent).toContain('Dwarf');
    expect(preview()?.textContent).toContain('A whisper like dry paper');
    expect(preview()?.querySelector('.is-secret')?.textContent).toContain(
      tablesFor('en').secret[0],
    );
    click(el.querySelector('button.mod-cta'));
    await Promise.resolve();
    const calls = create.mock.calls as unknown as [NpcChoices, string][];
    expect(calls[0]?.[0]).toMatchObject({ race: 'Dwarf', class: 'Barbarian' });
    expect(calls[0]?.[0].raceModel?.name).toBe('Dwarf');
  });

  it('writes a class tile by its English name, in the preview by its label', async () => {
    const { el, input, click, tile, type, preview, create } = open('de');
    click(tile('Magier'));
    expect(preview()?.textContent).toContain('Magier');
    type(input('Name'), 'Corvin');
    click(el.querySelector('button.mod-cta'));
    await Promise.resolve();
    const calls = create.mock.calls as unknown as [NpcChoices, string][];
    expect(calls[0]?.[0].class).toBe('Wizard');
  });

  it('keeps a race and a class typed in the search as free text', async () => {
    const { el, input, click, tile, type, create } = open('en');
    const [races, classes] = el.querySelectorAll<HTMLInputElement>('.dnd5e-npc-search');
    type(races, 'Owlfolk');
    click(tile('Use “Owlfolk”'));
    type(classes, 'Bell-ringer');
    click(tile('Use “Bell-ringer”'));
    type(input('Name'), 'Hoot');
    click(el.querySelector('button.mod-cta'));
    await Promise.resolve();
    const calls = create.mock.calls as unknown as [NpcChoices, string][];
    expect(calls[0]?.[0]).toMatchObject({
      race: 'Owlfolk',
      class: 'Bell-ringer',
      raceModel: null,
      archetype: null,
    });
  });

  it('refuses without a name', () => {
    const { el, click, create, preview } = open('en');
    expect(preview()?.querySelector('.dnd5e-npc-card-hint')?.textContent).toBe(
      'Pick a race and an archetype, or roll everything.',
    );
    click(el.querySelector('button.mod-cta'));
    expect(create).not.toHaveBeenCalled();
    expect(notices[notices.length - 1]).toBe('Give the NPC a name');
  });
});

describe('New archetype dialog', () => {
  it('hands over the name and the archetype to start from', async () => {
    const create = vi.fn(() => Promise.resolve());
    const modal = new NewFromBaseModal(app, t, archetypeKind(app, t, SRD_NPCS), create);
    modal.onOpen();
    const [name, base] = [...modal.contentEl.querySelectorAll('input')];
    if (name && base) {
      name.value = 'Archive Spy';
      name.dispatchEvent(new Event('input'));
      base.value = 'spy';
      base.dispatchEvent(new Event('input'));
    }
    modal.contentEl.querySelector('button.mod-cta')?.dispatchEvent(new MouseEvent('click'));
    await Promise.resolve();
    const calls = create.mock.calls as unknown as [string, { name: string } | null][];
    expect(calls[0]?.[0]).toBe('Archive Spy');
    expect(calls[0]?.[1]?.name).toBe('Spy');
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

describe('spellbook', () => {
  const openNote = vi.fn();
  async function open(lang: 'en' | 'de', state: unknown = null, own: SrdSpell[] = []) {
    const saved: SpellbookState[] = [];
    const view = new SpellbookView({} as WorkspaceLeaf, {
      t,
      lang: () => lang,
      state: () => state,
      saveState: (s) => saved.push(s),
      own: () => own,
      onOwnChange: () => () => undefined,
      openNote,
      newSpell: vi.fn(),
    });
    root.appendChild(view.contentEl);
    await view.onOpen();
    const el = view.contentEl;
    const rows = () => [...el.querySelectorAll<HTMLElement>('.dnd5e-spells-row')];
    const row = (name: string) =>
      rows().find((r) => r.querySelector('.dnd5e-spells-row-name')?.textContent === name);
    const chip = (text: string) =>
      [...el.querySelectorAll<HTMLElement>('.dnd5e-spells-chip')].find((c) =>
        c.textContent?.startsWith(text),
      );
    return { el, rows, row, chip, saved, view };
  }

  it('lists all 319 spells by level and opens a card on a click', async () => {
    const { el, rows, row } = await open('en');
    expect(rows()).toHaveLength(319);
    expect(texts(el, '.dnd5e-spells-level > span:first-child').slice(0, 2)).toEqual([
      'Cantrip',
      'Level 1',
    ]);
    expect(el.querySelector('.dnd5e-spells-count')?.textContent).toBe('319 spells');
    row('Fireball')?.dispatchEvent(new MouseEvent('click'));
    expect(texts(el, '.dnd5e-spells-card-name')).toEqual(['Fireball']);
    expect(texts(el, '.dnd5e-spells-card-other')).toEqual(['Feuerball']);
    expect(texts(el, '.dnd5e-spells-card-level')).toEqual(['3rd-level evocation']);
    expect(texts(el, '.dnd5e-spells-grid-value')).toEqual([
      '1 action',
      '150 feet',
      'V, S, M',
      'Instantaneous',
    ]);
    expect(el.querySelector('.dnd5e-spells-text')?.textContent).toContain('8d6 fire damage');
    expect(row('Fireball')?.classList.contains('is-selected')).toBe(true);
  });

  it('filters by level chips and school, and keeps the filters', async () => {
    const { el, rows, chip, saved } = await open('en');
    chip('Level 3')?.dispatchEvent(new MouseEvent('click'));
    chip('Evocation')?.dispatchEvent(new MouseEvent('click'));
    expect(rows().length).toBeGreaterThan(0);
    expect(
      rows().every((r) =>
        r.querySelector('.dnd5e-spells-row-meta')?.textContent?.startsWith('Evocation'),
      ),
    ).toBe(true);
    expect(texts(el, '.dnd5e-spells-level > span:first-child')).toEqual(['Level 3']);
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    expect(saved[saved.length - 1]?.filters).toMatchObject({ levels: [3], schools: ['evocation'] });
  });

  it('shows German names and meta, finds German names, and switches the card’s language', async () => {
    const { el, rows, row } = await open('de', {
      filters: { query: 'magisches gesch' },
      selected: null,
    });
    expect(rows().map((r) => r.querySelector('.dnd5e-spells-row-name')?.textContent)).toEqual([
      'Magisches Geschoss',
    ]);
    row('Magisches Geschoss')?.dispatchEvent(new MouseEvent('click'));
    expect(texts(el, '.dnd5e-spells-card-level')).toEqual(['Hervorrufung des 1. Grades']);
    expect(texts(el, '.dnd5e-spells-grid-value')).toEqual([
      '1 Aktion',
      '36 m',
      'V, G',
      'Unmittelbar',
    ]);
    expect(el.querySelector('.dnd5e-spells-text')?.textContent).toContain(
      'Du erschaffst drei leuchtende Pfeile aus magischer Energie.',
    );
    const en = [...el.querySelectorAll('.dnd5e-spells-card .dnd5e-world-segmented button')].find(
      (b) => b.textContent === 'EN',
    );
    en?.dispatchEvent(new MouseEvent('click'));
    expect(texts(el, '.dnd5e-spells-card-name')).toEqual(['Magic Missile']);
    expect(el.querySelector('.dnd5e-spells-text')?.textContent).toContain('three glowing darts');
  });

  it('lists own spells marked "own", with their note one click away', async () => {
    const ember = parseOwnSpell({
      path: 'Spells/Ember Lance.md',
      basename: 'Ember Lance',
      frontmatter: { type: 'spell', level: 2, school: 'evocation', range: '60 feet' },
      body: 'A lance of embers.',
    });
    if (ember === null) throw new Error('no spell');
    const { el, rows, row } = await open('de', null, [ember]);
    expect(rows()).toHaveLength(320);
    expect(row('Ember Lance')?.querySelector('.dnd5e-spells-mark.is-own')?.textContent).toBe('own');
    row('Ember Lance')?.dispatchEvent(new MouseEvent('click'));
    expect(texts(el, '.dnd5e-spells-card-other')).toEqual([]);
    expect(texts(el, '.dnd5e-spells-grid-value')[1]).toBe('18 m');
    expect(el.querySelector('.dnd5e-spells-text')?.textContent).toContain('A lance of embers.');
    expect(el.querySelector('.dnd5e-spells-source')?.textContent).toBe(
      'Own spell · Spells/Ember Lance.md',
    );
    el.querySelector('.dnd5e-spells-note')?.dispatchEvent(new MouseEvent('click'));
    expect(openNote).toHaveBeenCalledWith('Spells/Ember Lance.md');
  });

  it('opens a spell from a link, clearing filters that hide it', async () => {
    const { el, view } = await open('en', { filters: { levels: [9] }, selected: null });
    view.show('fireball');
    expect(texts(el, '.dnd5e-spells-card-name')).toEqual(['Fireball']);
    expect(el.querySelectorAll('.dnd5e-spells-row').length).toBe(319);
  });

  it('links the spell names of a Spellcasting trait in a stat block', () => {
    const mage = SRD_NPCS.find((n) => n.name === 'Mage');
    const opened: string[] = [];
    renderStatblock(root, parseStatblock(parse(mage?.yaml ?? '')), {
      t,
      markdown: (md, target) => {
        target.createEl('p', { text: md });
      },
      spells: (target) => linkSpells(target, spellFinder(SRD_SPELLS), (i) => opened.push(i)),
    });
    return new Promise<void>((resolve) =>
      window.setTimeout(() => {
        const links = [...root.querySelectorAll<HTMLElement>('.dnd5e-spell-link')];
        expect(links.map((l) => l.textContent)).toContain('fire bolt');
        expect(links.map((l) => l.textContent)).toContain('greater invisibility');
        expect(links.some((l) => l.textContent === 'Spellcasting')).toBe(false);
        links.find((l) => l.textContent === 'fireball')?.dispatchEvent(new MouseEvent('click'));
        expect(opened).toEqual(['fireball']);
        // Only the Spellcasting trait: the Dagger's text keeps no links.
        expect(root.textContent).toContain('Dagger');
        resolve();
      }, 0),
    );
  });
});

describe('deck of many things', () => {
  const OMENS = 'Decks/Omens.md';
  const omens = ownDeckText({
    name: 'Omens',
    returns: false,
    cards: [
      { name: 'Heron', effect: 'A heron on the third lantern.', leaves: false, ends: false },
      { name: 'Bells', effect: 'Bells under the water.', leaves: false, ends: true },
    ],
  });
  const frontmatter = (text: string) =>
    parse(/^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? '') as Record<string, unknown>;

  /** Deck notes in memory, read and written as the store does. */
  function memorySource(standard: string | null = null) {
    const notes = new Map<string, string>([[OMENS, omens]]);
    if (standard !== null) notes.set('Deck of Many Things.md', standard);
    const pathOf = (key: string) => (key === STANDARD ? 'Deck of Many Things.md' : key);
    const indexes = (key: string, text: string) => {
      const cards = parseDeckNote(text).cards;
      return key === STANDARD
        ? cards.map((c) => cardByName(c.name)?.index ?? '')
        : ownCards(cards, frontmatter(text)).map((c) => c.index);
    };
    const source: DeckSource = {
      decks: () =>
        Promise.resolve([
          { key: STANDARD, title: '' },
          { key: OMENS, title: 'Omens' },
        ]),
      load: (key) => {
        const text = notes.get(pathOf(key));
        if (text === undefined) {
          return Promise.resolve({ key, path: null, size: 22, own: [], out: [], draws: [] });
        }
        const note = parseDeckNote(text);
        const ids = indexes(key, text);
        return Promise.resolve({
          key,
          path: pathOf(key),
          size: key === STANDARD ? 22 : null,
          own: key === STANDARD ? [] : ownCards(note.cards, frontmatter(text)),
          out: note.cards.flatMap((c, i) => (c.out ? [ids[i] ?? ''] : [])),
          draws: note.draws,
        });
      },
      party: () => Promise.resolve([{ name: 'Mira', path: 'Party/Mira.md' }]),
      record: (key, card, who) => {
        const path = pathOf(key);
        let next = notes.get(path) ?? standardDeckText(22, deckOf(22));
        const ids = indexes(key, next);
        const item = parseDeckNote(next).cards.find((c, i) => !c.out && ids[i] === card.index);
        if (card.leaves && item !== undefined) next = tickCard(next, item.line);
        const name = who?.path != null ? `[[${who.name}]]` : (who?.name ?? '');
        notes.set(path, appendDraw(next, drawEntry('2026-10-25', name, card.name)));
        return Promise.resolve();
      },
      reset: (key, all) => {
        const path = pathOf(key);
        notes.set(path, resetDeck(notes.get(path) ?? '', all));
        return Promise.resolve();
      },
      open: vi.fn(),
    };
    return { source, notes };
  }

  /** Random numbers that pick these positions in the pool, one per draw. */
  const picks = (...positions: [number, number][]) => {
    const queue = positions.map(([at, of]) => (at + 0.5) / of);
    return () => queue.shift() ?? 0;
  };

  async function open(
    lang: 'en' | 'de',
    random: () => number,
    options: { standard?: string | null; selected?: string; reset?: 'log' | 'all' | null } = {},
  ) {
    const { source, notes } = memorySource(options.standard ?? null);
    let selected = options.selected ?? STANDARD;
    const newDeck = vi.fn();
    const view = new DeckView({} as WorkspaceLeaf, {
      t: createT(lang),
      lang: () => lang,
      source,
      random,
      selected: () => selected,
      select: (key) => (selected = key),
      newDeck,
      confirmReset: () => Promise.resolve(options.reset ?? null),
    });
    root.appendChild(view.contentEl);
    await view.onOpen();
    const el = view.contentEl;
    const settle = () => new Promise((resolve) => window.setTimeout(resolve, 0));
    const click = async (selector: string, text?: string) => {
      const button = [...el.querySelectorAll<HTMLElement>(selector)].find(
        (b) => text === undefined || b.textContent === text,
      );
      button?.dispatchEvent(new MouseEvent('click'));
      await settle();
      await settle();
    };
    return { el, notes, click, newDeck, view, settle };
  }

  it('draws the declared cards, writes the note and shows the history', async () => {
    const { el, notes, click } = await open('en', picks([1, 22], [6, 22]));
    expect(el.querySelectorAll('.dnd5e-deck-tile')).toHaveLength(22);
    expect(el.querySelector('.dnd5e-deck-empty')?.textContent).toBe('No card drawn yet.');
    const input = el.querySelector<HTMLInputElement>('.dnd5e-deck-setup input');
    if (input === null) throw new Error('no input');
    input.value = 'Mira';
    input.dispatchEvent(new Event('input'));
    await click('.dnd5e-deck-stepper button[aria-label="+"]');
    expect(el.querySelector('.dnd5e-deck-count')?.textContent).toBe('2');
    await click('.dnd5e-deck-begin');
    expect(el.querySelector('.dnd5e-deck-status')?.textContent).toBe('2 draws left');
    await click('.dnd5e-deck-draw');
    expect(texts(el, '.dnd5e-deck-card-name')).toEqual(['Sun']);
    expect(texts(el, '.dnd5e-deck-card .dnd5e-deck-corner')).toEqual(['K♦', 'K♦']);
    expect(el.querySelector('.dnd5e-deck-card-text')?.textContent).toContain('50,000 XP');
    await click('.dnd5e-deck-draw');
    expect(texts(el, '.dnd5e-deck-card-name')).toEqual(['Throne']);
    expect(el.querySelector('.dnd5e-deck-status')?.textContent).toBe(
      'Every declared card is drawn.',
    );
    expect(parseDeckNote(notes.get('Deck of Many Things.md') ?? '').draws).toEqual([
      '2026-10-25 · [[Mira]] · Sun',
      '2026-10-25 · [[Mira]] · Throne',
    ]);
    expect(texts(el, '.dnd5e-deck-history-card')).toEqual(['K♥ Throne', 'K♦ Sun']);
    expect(texts(el, '.dnd5e-deck-history-meta')).toEqual([
      'Mira · 2026-10-25',
      'Mira · 2026-10-25',
    ]);
  });

  it('runs the Fool’s redraw and the Jester’s choice, and the leaving cards are out', async () => {
    // The Fool (20 of 22), then the Jester (20 of 21, the Fool gone), then Key (7 of 20).
    const { el, notes, click } = await open('de', picks([20, 22], [20, 21], [7, 20]));
    await click('.dnd5e-deck-begin');
    await click('.dnd5e-deck-draw');
    expect(texts(el, '.dnd5e-deck-card-name')).toEqual(['Narr']);
    expect(texts(el, '.dnd5e-deck-badge')).toEqual(['Verlässt das Deck']);
    expect(el.querySelector('.dnd5e-deck-status')?.textContent).toBe(
      'Der Narr: zieh erneut — es zählt als derselbe Zug',
    );
    await click('.dnd5e-deck-draw');
    expect(texts(el, '.dnd5e-deck-card-name')).toEqual(['Possenreißer']);
    await click('.dnd5e-deck-actions button', 'Zwei weitere Karten ziehen');
    expect(el.querySelector('.dnd5e-deck-status')?.textContent).toBe('Noch 2 Züge');
    await click('.dnd5e-deck-draw');
    expect(texts(el, '.dnd5e-deck-card-name')).toEqual(['Schlüssel']);
    expect(texts(el, '.dnd5e-deck-card .dnd5e-deck-corner')).toEqual(['D♥', 'D♥']);
    expect(texts(el, '.dnd5e-deck-tile.is-out .dnd5e-deck-tile-name')).toEqual([
      'Narr',
      'Possenreißer',
    ]);
    const note = parseDeckNote(notes.get('Deck of Many Things.md') ?? '');
    expect(note.cards.filter((c) => c.out).map((c) => c.name)).toEqual(['Fool', 'Jester']);
  });

  it('ends on The Void and looks a card up from the grid between drawings', async () => {
    const { el, click } = await open('en', picks([11, 22]));
    await click('.dnd5e-deck-stepper button[aria-label="+"]');
    await click('.dnd5e-deck-begin');
    await click('.dnd5e-deck-tile[data-card="moon"]');
    expect(el.querySelector('.dnd5e-deck-card-face')).toBeNull();
    await click('.dnd5e-deck-draw');
    expect(texts(el, '.dnd5e-deck-card-name')).toEqual(['The Void']);
    expect(el.querySelector('.dnd5e-deck-status')?.textContent).toBe('The drawing has ended.');
    await click('.dnd5e-deck-tile[data-card="moon"]');
    expect(texts(el, '.dnd5e-deck-card-name')).toEqual(['Moon']);
    expect(el.querySelector('.dnd5e-deck-card-text')?.textContent).toContain('1d3 times');
    await click('.dnd5e-deck-actions button', 'New drawing');
    expect(el.querySelector('.dnd5e-deck-begin')).not.toBeNull();
  });

  it('draws from an own deck picked in the list: drawn cards stay out, an ending card ends', async () => {
    const { el, notes, click, settle } = await open('en', picks([0, 2], [0, 1]));
    const picker = el.querySelector<HTMLSelectElement>('.dnd5e-deck-picker');
    expect([...(picker?.options ?? [])].map((o) => o.text)).toEqual([
      'Deck of Many Things (SRD)',
      'Omens',
    ]);
    if (picker === null) throw new Error('no picker');
    picker.value = OMENS;
    picker.dispatchEvent(new Event('change'));
    await settle();
    await settle();
    expect(texts(el, '.dnd5e-deck-title')).toEqual(['Omens']);
    expect(texts(el, '.dnd5e-deck-rules')).toEqual([
      'Each card drawn stays out until the deck is reset.',
    ]);
    expect(texts(el, '.dnd5e-deck-tile-name')).toEqual(['Heron', 'Bells']);
    await click('.dnd5e-deck-stepper button[aria-label="+"]');
    await click('.dnd5e-deck-begin');
    await click('.dnd5e-deck-draw');
    expect(texts(el, '.dnd5e-deck-card-name')).toEqual(['Heron']);
    expect(el.querySelector('.dnd5e-deck-badge')).toBeNull();
    expect(el.querySelector('.dnd5e-deck-card-text')?.textContent).toContain('third lantern');
    await click('.dnd5e-deck-draw');
    expect(texts(el, '.dnd5e-deck-card-name')).toEqual(['Bells']);
    expect(texts(el, '.dnd5e-deck-badge')).toEqual(['Ends the drawing']);
    expect(el.querySelector('.dnd5e-deck-begin')).toBeNull();
    await click('.dnd5e-deck-actions button', 'New drawing');
    expect(el.querySelector<HTMLButtonElement>('.dnd5e-deck-begin')?.disabled).toBe(true);
    expect(parseDeckNote(notes.get(OMENS) ?? '').cards.every((c) => c.out)).toBe(true);
  });

  it('resets the history, or the history and every card', async () => {
    const used = appendDraw(tickCard(standardDeckText(22, deckOf(22)), 27), '2026-10-25 · Fool');
    expect(parseDeckNote(used).cards.find((c) => c.out)?.name).toBe('Fool');
    const log = await open('en', picks(), { standard: used, reset: 'log' });
    await log.click('.dnd5e-deck-reset');
    expect(log.el.querySelector('.dnd5e-deck-empty')?.textContent).toBe('No card drawn yet.');
    expect(texts(log.el, '.dnd5e-deck-tile.is-out .dnd5e-deck-tile-name')).toEqual(['Fool']);
    root.empty();
    const all = await open('en', picks(), { standard: used, reset: 'all' });
    await all.click('.dnd5e-deck-reset');
    expect(all.el.querySelectorAll('.dnd5e-deck-tile.is-out')).toHaveLength(0);
    expect(all.notes.get('Deck of Many Things.md')).toBe(standardDeckText(22, deckOf(22)));
  });

  it('opens the builder from the tab', async () => {
    const { click, newDeck } = await open('en', picks());
    await click('.dnd5e-deck-new');
    expect(newDeck).toHaveBeenCalledOnce();
  });
});

describe('deck builder', () => {
  function builder(lang: 'en' | 'de' = 'en') {
    const created: DraftDeck[] = [];
    const modal = new DeckBuilderModal(app, {
      t: createT(lang),
      lang,
      create: (deck) => {
        created.push(deck);
        return Promise.resolve();
      },
    });
    root.appendChild(modal.modalEl);
    modal.onOpen();
    const el = modal.contentEl;
    const names = () =>
      [...el.querySelectorAll<HTMLInputElement>('.dnd5e-builder-row input')].map((i) => i.value);
    const press = (selector: string, text?: string) =>
      [...el.querySelectorAll<HTMLElement>(selector)]
        .find((b) => text === undefined || b.textContent === text)
        ?.dispatchEvent(new MouseEvent('click'));
    const type = (input: HTMLInputElement | HTMLTextAreaElement | null, value: string) => {
      if (input === null) throw new Error('no input');
      input.value = value;
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('focus'));
    };
    return { modal, el, created, names, press, type };
  }

  it('builds a deck typed in by hand, the edited card in the preview', async () => {
    const { el, created, names, press, type } = builder();
    type(el.querySelector('.dnd5e-builder-name'), 'Road omens');
    expect(texts(el, '.dnd5e-npc-card-name')).toEqual(['Road omens']);
    type(el.querySelector('.dnd5e-builder-row input'), 'Crow');
    type(el.querySelector('.dnd5e-builder-row textarea'), 'Bad luck.');
    expect(texts(el, '.dnd5e-builder-face .dnd5e-deck-card-name')).toEqual(['Crow']);
    expect(el.querySelector('.dnd5e-builder-face .dnd5e-deck-card-text')?.textContent).toBe(
      'Bad luck.',
    );
    press('.dnd5e-builder-add');
    expect(names()).toEqual(['Crow', '']);
    const returns = el.querySelector<HTMLInputElement>('.dnd5e-builder-returns');
    if (returns === null) throw new Error('no toggle');
    returns.checked = false;
    returns.dispatchEvent(new Event('change'));
    expect(texts(el, '.dnd5e-npc-card-sub')[0]).toContain(
      'Each card drawn stays out until the deck is reset.',
    );
    press('.dnd5e-builder-flag');
    expect(el.querySelector('.dnd5e-builder-count')?.textContent).toBe('1 card');
    press('button', 'Create deck');
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    expect(created).toEqual([
      {
        name: 'Road omens',
        returns: false,
        cards: [{ name: 'Crow', effect: 'Bad luck.', leaves: false, ends: true }],
      },
    ]);
  });

  it('fills from pasted text, a JSON file and the standard deck', () => {
    const { modal, el, names, press } = builder('de');
    expect(texts(el, '.dnd5e-builder-sources .dnd5e-npc-tile-name')).toEqual([
      'Dem Standarddeck',
      'Eingefügtem Text',
      'JSON-Datei',
    ]);
    expect(
      modal.importText('| Card | Effect |\n| --- | --- |\n| Crow | Bad luck |\n- **Moth.** Light'),
    ).toBe(true);
    expect(names()).toEqual(['Crow', 'Moth']);
    modal.importJson(
      '{"name": "Imported", "returns": false, "cards": [{"name": "Owl", "text": "Wisdom"}]}',
    );
    expect(names()).toEqual(['Crow', 'Moth', 'Owl']);
    expect(el.querySelector<HTMLInputElement>('.dnd5e-builder-name')?.value).toBe('Imported');
    expect(el.querySelector<HTMLInputElement>('.dnd5e-builder-returns')?.checked).toBe(false);
    modal.importJson('not json');
    expect(notices[notices.length - 1]).toBe('Die Datei ist kein gültiges JSON.');
    press('.setting-item button[aria-label="Alle Karten entfernen"]');
    expect(names()).toEqual(['']);
    press('[data-source="standard"]');
    expect(names()).toHaveLength(22);
    expect(names()[0]).toBe('Wesir');
    expect(texts(el, '.dnd5e-npc-card-tag')).toHaveLength(22);
  });
});

describe('spell builder', () => {
  function builder(lang: 'en' | 'de' = 'en') {
    const created: SpellDraft[] = [];
    const modal = new SpellBuilderModal(app, {
      t: createT(lang),
      lang,
      spells: SRD_SPELLS,
      create: (draft) => {
        created.push(draft);
        return Promise.resolve();
      },
    });
    root.appendChild(modal.modalEl);
    modal.onOpen();
    return { modal, el: modal.contentEl, created };
  }

  it('starts from an SRD spell picked in the tiles, in the GM’s language', () => {
    const { el } = builder('de');
    const search = el.querySelector<HTMLInputElement>('.dnd5e-npc-search');
    if (search === null) throw new Error('no search');
    search.value = 'feuerb';
    search.dispatchEvent(new Event('input'));
    expect(texts(el, '.dnd5e-spell-tiles .dnd5e-npc-tile-name')[0]).toBe('Feuerball');
    el.querySelector<HTMLElement>('.dnd5e-spell-tiles .dnd5e-npc-tile')?.dispatchEvent(
      new MouseEvent('click'),
    );
    expect(el.querySelector<HTMLInputElement>('.dnd5e-spell-name')?.value).toBe('Feuerball');
    expect(texts(el, '.dnd5e-npc-card-name')).toEqual(['Feuerball']);
    expect(texts(el, '.dnd5e-npc-card-sub')[0]).toBe('Hervorrufung des 3. Grades');
    expect(texts(el, '.dnd5e-spells-grid-value')).toEqual([
      '1 Aktion',
      '45 m',
      'V, G, M',
      'Unmittelbar',
    ]);
    expect(el.querySelector<HTMLTextAreaElement>('.dnd5e-spell-text')?.value).toContain('8W6');
    const casting = el.querySelector<HTMLSelectElement>('.dnd5e-spell-casting');
    expect(casting?.value).toBe('1 action');
    expect(casting?.selectedOptions[0]?.textContent).toBe('1 Aktion');
    expect([...(casting?.options ?? [])].map((o) => o.textContent)).toContain('1 Bonusaktion');
    const lasting = el.querySelector<HTMLSelectElement>('.dnd5e-spell-duration');
    expect(lasting?.selectedOptions[0]?.textContent).toBe('Unmittelbar');
    if (lasting === null) throw new Error('no duration');
    lasting.value = 'Up to 1 minute';
    lasting.dispatchEvent(new Event('change'));
    expect(texts(el, '.dnd5e-spells-grid-value')[3]).toBe('Bis zu 1 Minute');
    expect(el.querySelector('.dnd5e-spell-schools .is-selected')?.textContent).toBe('Hervorrufung');
  });

  it('builds a spell by hand: level and school chips, components, classes, text', async () => {
    const { el, created } = builder();
    const name = el.querySelector<HTMLInputElement>('.dnd5e-spell-name');
    if (name === null) throw new Error('no name');
    name.value = 'Ember Lance';
    name.dispatchEvent(new Event('input'));
    [...el.querySelectorAll<HTMLElement>('.dnd5e-builder-flag')]
      .find((c) => c.textContent === 'Level 2')
      ?.dispatchEvent(new MouseEvent('click'));
    [...el.querySelectorAll<HTMLElement>('.dnd5e-spell-schools .dnd5e-npc-tile')]
      .find((c) => c.textContent === 'Abjuration')
      ?.dispatchEvent(new MouseEvent('click'));
    for (const value of ['M', 'wizard', 'fire']) {
      el.querySelector<HTMLElement>(`.dnd5e-builder-flag[data-value="${value}"]`)?.dispatchEvent(
        new MouseEvent('click'),
      );
    }
    const text = el.querySelector<HTMLTextAreaElement>('.dnd5e-spell-text');
    if (text === null) throw new Error('no text');
    text.value = 'A lance of embers.';
    text.dispatchEvent(new Event('input'));
    expect(texts(el, '.dnd5e-npc-card-sub')[0]).toBe('2nd-level abjuration');
    expect(texts(el, '.dnd5e-npc-card-tag')).toEqual(['Fire', 'Wizard']);
    [...el.querySelectorAll<HTMLElement>('button')]
      .find((b) => b.textContent === 'Create spell')
      ?.dispatchEvent(new MouseEvent('click'));
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    expect(created[0]).toMatchObject({
      name: 'Ember Lance',
      level: 2,
      school: 'abjuration',
      components: ['V', 'S', 'M'],
      classes: ['wizard'],
      damage: ['fire'],
      text: 'A lance of embers.',
    });
  });

  it('fills from a JSON file in the 5e-bits shape', () => {
    const { modal, el } = builder();
    modal.importJson(
      JSON.stringify({
        name: 'Frost Needle',
        level: 1,
        school: { name: 'Evocation' },
        classes: [{ name: 'Wizard' }],
        desc: ['A needle of ice.'],
        components: ['V', 'S'],
        casting_time: '1 action',
        range: '60 feet',
        duration: 'Instantaneous',
        damage: { damage_type: { name: 'Cold' } },
        attack_type: 'ranged',
      }),
    );
    expect(el.querySelector<HTMLInputElement>('.dnd5e-spell-name')?.value).toBe('Frost Needle');
    expect(texts(el, '.dnd5e-npc-card-tag')).toEqual(['Cold', 'Ranged spell attack', 'Wizard']);
  });
});

describe('monster manual', () => {
  async function open(lang: 'en' | 'de', state: unknown = null, own: SrdMonster[] = []) {
    const saved: MonsterManualState[] = [];
    const inserted: string[] = [];
    const notes: string[] = [];
    const opened: string[] = [];
    const builders: number[] = [];
    const fights: string[] = [];
    const view = new MonsterManualView({} as WorkspaceLeaf, {
      t: createT(lang),
      lang: () => lang,
      state: () => state,
      saveState: (s) => saved.push(s),
      insert: (m) => inserted.push(m.index),
      makeNote: (m) => notes.push(m.index),
      own: () => own,
      onOwnChange: () => () => undefined,
      openNote: (path) => opened.push(path),
      newMonster: () => builders.push(1),
      addToCombat: (m) => fights.push(m.index),
      addToEncounter: (m) => fights.push(`encounter:${m.index}`),
    });
    root.appendChild(view.contentEl);
    await view.onOpen();
    const el = view.contentEl;
    const rows = () => [...el.querySelectorAll<HTMLElement>('.dnd5e-spells-row')];
    const row = (name: string) =>
      rows().find((r) => r.querySelector('.dnd5e-spells-row-name')?.textContent === name);
    return { el, rows, row, saved, inserted, notes, opened, builders, fights, view };
  }

  it('lists all 334 monsters by challenge rating and opens a stat block', async () => {
    const { el, rows, row, inserted, notes, fights } = await open('en');
    expect(rows()).toHaveLength(334);
    expect(el.querySelector('.dnd5e-spells-count')?.textContent).toBe('334 monsters');
    expect(texts(el, '.dnd5e-spells-level > span:first-child')[0]).toBe('CR 0');
    expect(row('Owlbear')?.querySelector('.dnd5e-spells-row-meta')?.textContent).toBe(
      'Monstrosity · Large · AC 13 · HP 59',
    );
    row('Adult Red Dragon')?.dispatchEvent(new MouseEvent('click'));
    expect(texts(el, '.dnd5e-sb-name')).toEqual(['Adult Red Dragon']);
    expect(texts(el, '.dnd5e-spells-card-other')).toEqual(['Ausgewachsener Roter Drache']);
    expect(el.querySelector('.dnd5e-sb-meta')?.textContent).toBe('Huge dragon, chaotic evil');
    expect(row('Adult Red Dragon')?.querySelectorAll('.dnd5e-spells-mark')).toHaveLength(2);
    el.querySelector('.dnd5e-monsters-insert')?.dispatchEvent(new MouseEvent('click'));
    el.querySelector('.dnd5e-monsters-note')?.dispatchEvent(new MouseEvent('click'));
    expect(inserted).toEqual(['adult-red-dragon']);
    el.querySelector('.dnd5e-monsters-fight')?.dispatchEvent(new MouseEvent('click'));
    el.querySelector('.dnd5e-monsters-encounter')?.dispatchEvent(new MouseEvent('click'));
    expect(fights).toEqual(['adult-red-dragon', 'encounter:adult-red-dragon']);
    expect(notes).toEqual(['adult-red-dragon']);
  });

  it('filters by band, type, legendary and keeps the filters', async () => {
    const { el, rows, saved } = await open('en');
    el.querySelector<HTMLElement>('[data-band="17"]')?.dispatchEvent(new MouseEvent('click'));
    el.querySelector<HTMLElement>('[data-type="dragon"]')?.dispatchEvent(new MouseEvent('click'));
    expect(rows().length).toBeGreaterThan(0);
    expect(
      rows().every((r) =>
        r.querySelector('.dnd5e-spells-row-meta')?.textContent?.includes('Dragon'),
      ),
    ).toBe(true);
    // Counts follow the other filters: of the dragons, only the Pseudodragon is CR ½ or less.
    expect(el.querySelector('[data-band="0"] .dnd5e-spells-chip-count')?.textContent).toBe('1');
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    expect(saved[saved.length - 1]?.filters).toMatchObject({ bands: ['17'], types: ['dragon'] });
  });

  it('shows German names and a German stat block header, and switches the card', async () => {
    const { el, rows, row } = await open('de', { filters: { query: 'eulenb' }, selected: null });
    expect(rows().map((r) => r.querySelector('.dnd5e-spells-row-name')?.textContent)).toEqual([
      'Eulenbär',
    ]);
    expect(row('Eulenbär')?.querySelector('.dnd5e-spells-row-meta')?.textContent).toBe(
      'Monstrosität · Groß · RK 13 · TP 59',
    );
    row('Eulenbär')?.dispatchEvent(new MouseEvent('click'));
    expect(texts(el, '.dnd5e-sb-name')).toEqual(['Eulenbär']);
    expect(el.querySelector('.dnd5e-sb-meta')?.textContent).toBe(
      'Große Monstrosität, gesinnungslos',
    );
    expect(el.querySelector('.dnd5e-sb-lines')?.textContent).toContain('12 m');
    // Traits and actions in German too (M2).
    expect(el.querySelector('.dnd5e-statblock')?.textContent).toContain('Mehrfachangriff');
    expect(el.querySelector('.dnd5e-statblock')?.textContent).toContain(
      'Nahkampf-Waffenangriff: +7 auf Treffer, Reichweite 1,5 m, eine Kreatur.',
    );
    [...el.querySelectorAll<HTMLElement>('.dnd5e-world-segmented button')]
      .find((b) => b.textContent === 'EN')
      ?.dispatchEvent(new MouseEvent('click'));
    expect(texts(el, '.dnd5e-sb-name')).toEqual(['Owlbear']);
    expect(el.querySelector('.dnd5e-statblock')?.textContent).toContain('Multiattack');
  });

  it('lists own monsters marked "own", opens their note and the builder', async () => {
    const yaml = 'name: Mire Hound\nsize: Medium\ntype: monstrosity\nac: 13\nhp: 22\ncr: "1/2"';
    const own = ownMonster('Monsters/Mire Hound.md', parseStatblock(parse(yaml)), yaml);
    if (own === null) throw new Error('no monster');
    const { el, rows, row, opened, builders, view } = await open('en', null, [own]);
    expect(rows()).toHaveLength(335);
    expect(row('Mire Hound')?.querySelector('.is-own')?.textContent).toBe('own');
    view.show(own.index);
    expect(texts(el, '.dnd5e-sb-name')).toEqual(['Mire Hound']);
    expect(el.querySelector('.dnd5e-monsters-note')).toBeNull();
    el.querySelector('.dnd5e-monsters-open')?.dispatchEvent(new MouseEvent('click'));
    expect(opened).toEqual(['Monsters/Mire Hound.md']);
    expect(el.querySelector('.dnd5e-spells-source')?.textContent).toBe(
      'Own monster · Monsters/Mire Hound.md',
    );
    el.querySelector('.dnd5e-monsters-new')?.dispatchEvent(new MouseEvent('click'));
    expect(builders).toEqual([1]);
  });
});

describe('monster builder', () => {
  function builder(lang: 'en' | 'de' = 'en') {
    const created: Statblock[] = [];
    const all: string[][] = [];
    const modal = new MonsterBuilderModal(app, {
      t: createT(lang),
      lang,
      monsters: SRD_MONSTERS,
      create: (b) => {
        created.push(structuredClone(b));
        return Promise.resolve();
      },
      createAll: (blocks) => {
        all.push(blocks.map((b) => b.name ?? ''));
        return Promise.resolve();
      },
    });
    root.appendChild(modal.modalEl);
    modal.onOpen();
    const el = modal.contentEl;
    const type = (selector: string, value: string) => {
      const input = el.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector);
      if (input === null) throw new Error(selector);
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };
    const choose = (selector: string, value: string) => {
      const select = el.querySelector<HTMLSelectElement>(selector);
      if (select === null) throw new Error(selector);
      select.value = value;
      select.dispatchEvent(new Event('change'));
    };
    return { modal, el, created, all, type, choose };
  }

  it('builds a monster by hand with a live stat block preview', async () => {
    const { el, created, type, choose } = builder();
    type('.dnd5e-monster-name', 'Mire Hound');
    choose('.dnd5e-monster-type', 'monstrosity');
    choose('.dnd5e-monster-size', 'Large');
    choose('.dnd5e-monster-cr', '2');
    type('.dnd5e-monster-ac', '13');
    type('.dnd5e-monster-abilities input', '16');
    expect(texts(el, '.dnd5e-monster-preview .dnd5e-sb-name')).toEqual(['Mire Hound']);
    expect(el.querySelector('.dnd5e-monster-preview .dnd5e-sb-meta')?.textContent).toBe(
      'Large monstrosity, unaligned',
    );
    expect(el.querySelector('.dnd5e-monster-preview .dnd5e-sb-ability')?.textContent).toContain(
      '16 (+3)',
    );
    el.querySelector<HTMLElement>('[data-list="actions"] .setting-item button')?.dispatchEvent(
      new MouseEvent('click'),
    );
    type('[data-list="actions"] .dnd5e-builder-row input', 'Bite');
    type('[data-list="actions"] .dnd5e-builder-row textarea', 'Melee Weapon Attack: +5 to hit.');
    el.querySelector<HTMLElement>(
      '[data-list="legendaryActions"] .setting-item button',
    )?.dispatchEvent(new MouseEvent('click'));
    expect(el.querySelector<HTMLTextAreaElement>('.dnd5e-monster-legendary')?.value).toMatch(
      /^The mire hound can take 3 legendary actions/,
    );
    [...el.querySelectorAll<HTMLElement>('button')]
      .find((b) => b.textContent === 'Create monster')
      ?.dispatchEvent(new MouseEvent('click'));
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    expect(created[0]).toMatchObject({
      name: 'Mire Hound',
      type: 'monstrosity',
      size: 'Large',
      cr: '2',
      ac: 13,
      actions: [{ name: 'Bite', desc: 'Melee Weapon Attack: +5 to hit.' }],
    });
    expect(created[0]?.stats?.[0]).toBe(16);
  });

  it('starts from an SRD monster picked in the tiles; German name and texts, the SRD’s header words', () => {
    const { el } = builder('de');
    const search = el.querySelector<HTMLInputElement>('.dnd5e-npc-search');
    if (search === null) throw new Error('no search');
    search.value = 'eulenb';
    search.dispatchEvent(new Event('input'));
    expect(texts(el, '.dnd5e-monster-tiles .dnd5e-npc-tile-name')).toEqual(['Eulenbär']);
    el.querySelector<HTMLElement>('.dnd5e-monster-tiles .dnd5e-npc-tile')?.dispatchEvent(
      new MouseEvent('click'),
    );
    expect(el.querySelector<HTMLInputElement>('.dnd5e-monster-name')?.value).toBe('Eulenbär');
    const size = el.querySelector<HTMLSelectElement>('.dnd5e-monster-size');
    expect(size?.value).toBe('Large');
    expect(size?.selectedOptions[0]?.textContent).toBe('Groß');
    expect(el.querySelector('.dnd5e-monster-preview .dnd5e-sb-meta')?.textContent).toBe(
      'Große Monstrosität, gesinnungslos',
    );
    expect(
      [...el.querySelectorAll<HTMLInputElement>('[data-list="actions"] input')].map((i) => i.value),
    ).toEqual(['Mehrfachangriff', 'Schnabel', 'Klauen']);
  });

  it('imports one monster into the form, or several as tiles to pick or create at once', async () => {
    const { modal, el, all } = builder();
    modal.importFile('one.yaml', 'name: Ash Wight\ntype: undead\nac: 14\nhp: 45\ncr: 3');
    expect(el.querySelector<HTMLInputElement>('.dnd5e-monster-name')?.value).toBe('Ash Wight');
    expect(el.querySelector('.dnd5e-monster-imported')).toBeNull();
    modal.importFile(
      'many.json',
      JSON.stringify([
        { name: 'A', cr: 1 },
        { name: 'B', type: 'fiend' },
      ]),
    );
    expect(texts(el, '.dnd5e-monster-imported .dnd5e-npc-tile-name')).toEqual(['A', 'B']);
    el.querySelectorAll<HTMLElement>('.dnd5e-monster-imported .dnd5e-npc-tile')[1]?.dispatchEvent(
      new MouseEvent('click'),
    );
    expect(el.querySelector<HTMLInputElement>('.dnd5e-monster-name')?.value).toBe('B');
    [...el.querySelectorAll<HTMLElement>('button')]
      .find((b) => b.textContent === 'Create all 2')
      ?.dispatchEvent(new MouseEvent('click'));
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    expect(all).toEqual([['A', 'B']]);
    modal.importFile('bad.json', '{');
    expect(notices[notices.length - 1]).toBe(
      'The file could not be read as JSON, YAML or Markdown.',
    );
  });
});

describe('battle tab', () => {
  const fighter = (name: string, more: Partial<Fighter> = {}): Fighter => ({
    name,
    side: 'enemy',
    pc: false,
    ac: 12,
    maxHp: 10,
    initBonus: 0,
    dex: 10,
    path: null,
    monster: null,
    xp: null,
    group: null,
    ...more,
  });
  const fighters = [
    fighter('Dagny', { side: 'party', pc: true, ac: 15, maxHp: 71, path: 'Dagny.md' }),
    fighter('Thug', { group: 'Thug', maxHp: 32 }),
    fighter('Thug', { group: 'Thug', maxHp: 32 }),
    fighter('Owlbear', { maxHp: 59, ac: 13, monster: 'owlbear', group: 'Owlbear', xp: 700 }),
  ];

  async function open(lang: 'en' | 'de', text = '') {
    let note = text;
    const saves: Fight[] = [];
    const source: BattleSource = {
      encounters: () => Promise.resolve([{ path: 'Ambush.md', title: 'Ambush' }]),
      load: () => Promise.resolve({ fighters, table: readCombat(note) }),
      save: (_path, fight, ended) => {
        saves.push(fight);
        note = combatLines(fight, ended).join('\n');
        return Promise.resolve();
      },
      statblock: (f) =>
        Promise.resolve(
          f.monster === 'owlbear'
            ? parseStatblock(parse(SRD_MONSTERS.find((m) => m.index === 'owlbear')?.yaml ?? ''))
            : null,
        ),
      fighter: (name) => Promise.resolve(name === 'Owlbear' ? (fighters[3] ?? null) : null),
    };
    const logged: BattleEvent[] = [];
    let selected: string | null = null;
    // Monsters roll a 10 (d20 → 11 for 0.5).
    const view = new BattleView({} as WorkspaceLeaf, {
      t: createT(lang),
      lang: () => lang,
      source,
      random: () => 0.5,
      selected: () => selected,
      select: (path) => (selected = path),
      openNote: () => undefined,
      log: (_path, events) => logged.push(...events),
      newEncounter: () => undefined,
    });
    root.appendChild(view.contentEl);
    await view.onOpen();
    const el = view.contentEl;
    const settle = () => new Promise((resolve) => window.setTimeout(resolve, 0));
    const click = async (selector: string, text?: string) => {
      const button = [...el.querySelectorAll<HTMLElement>(selector)].find(
        (b) => text === undefined || b.textContent === text,
      );
      if (button === undefined) throw new Error(`no ${selector} ${text ?? ''}`);
      button.dispatchEvent(new MouseEvent('click'));
      await settle();
    };
    const names = () => texts(el, '.dnd5e-battle-row .dnd5e-battle-name');
    const type = (selector: string, value: string) => {
      const input = el.querySelector<HTMLInputElement>(selector);
      if (input === null) throw new Error(`no ${selector}`);
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };
    const submit = async () => {
      el.querySelector('.dnd5e-battle-add')?.dispatchEvent(new Event('submit'));
      await settle();
      await settle();
    };
    return {
      el,
      click,
      names,
      saves,
      note: () => note,
      selected: () => selected,
      logged,
      type,
      submit,
      view,
    };
  }

  it('starts a fight, orders it, runs turns and writes the note', async () => {
    const { el, click, names, saves, note, selected } = await open('en');
    expect(selected()).toBe('Ambush.md');
    expect(texts(el, '.dnd5e-battle-section')).toEqual(['Combatants (4)']);
    await click('.dnd5e-battle-start');
    // The thugs share one roll and are numbered; Dagny waits for her number.
    expect(names()).toEqual(['Owlbear', 'Thug 1', 'Thug 2', 'Dagny']);
    const init = el.querySelectorAll<HTMLInputElement>('.dnd5e-battle-init input')[3];
    if (init === undefined) throw new Error('no input');
    init.value = '18';
    init.dispatchEvent(new Event('change'));
    expect(names()[0]).toBe('Dagny');
    await click('.dnd5e-battle-begin');
    expect(el.querySelector('.dnd5e-battle-round')?.textContent).toBe('Round 1');
    expect(el.querySelector('.is-turn .dnd5e-battle-name')?.textContent).toBe('Dagny');
    expect(note()).toContain('Round 1 · Turn: Dagny');
    await click('.dnd5e-battle-next');
    expect(el.querySelector('.is-turn .dnd5e-battle-name')?.textContent).toBe('Owlbear');
    // The owlbear's card shows its stat block; damage it down to defeated.
    await new Promise((r) => window.setTimeout(r, 0));
    expect(texts(el, '.dnd5e-sb-name')).toEqual(['Owlbear']);
    const amount = el.querySelector<HTMLInputElement>('.dnd5e-battle-amount');
    if (amount === null) throw new Error('no amount');
    amount.value = '59';
    amount.dispatchEvent(new Event('input'));
    await click('.dnd5e-battle-damage');
    expect(el.querySelector('.is-turn')?.classList.contains('is-out')).toBe(true);
    expect(note()).toMatch(/\| Owlbear \| 0\/59 \| 13 \| defeated \|/);
    await click('.dnd5e-battle-next');
    expect(el.querySelector('.is-turn .dnd5e-battle-name')?.textContent).toBe('Thug 1');
    // A condition with a duration on Thug 1.
    const rounds = el.querySelector<HTMLInputElement>('.dnd5e-battle-duration input');
    if (rounds === null) throw new Error('no rounds');
    rounds.value = '1';
    rounds.dispatchEvent(new Event('input'));
    await click('.dnd5e-builder-flag', 'Prone');
    expect(texts(el, '.is-turn .dnd5e-battle-chip')).toEqual(['Prone (1)']);
    await click('.dnd5e-battle-next');
    expect(texts(el, '.dnd5e-battle-chip')).toEqual(['Defeated']);
    await click('.dnd5e-battle-end');
    expect(note()).toContain('Ended after 1 round\n');
    expect(el.querySelector('.dnd5e-battle-round')?.textContent).toBe('Ended after 1 round');
    expect(el.querySelector('.dnd5e-battle-start')?.textContent).toBe('Start again');
    expect(saves.length).toBeGreaterThan(5);
  });

  it('adds and removes combatants mid-fight and reports the moments for the log', async () => {
    const { el, click, names, logged, type, submit, note } = await open('en');
    await click('.dnd5e-battle-start');
    await click('.dnd5e-battle-begin');
    expect(logged).toEqual([{ kind: 'begin' }]);
    type('.dnd5e-battle-add-name', 'Owlbear');
    await submit();
    expect(names()).toEqual(['Owlbear', 'Owlbear 2', 'Thug 1', 'Thug 2', 'Dagny']);
    expect(notices[notices.length - 1]).toBe('Owlbear 2 joins the fight');
    expect(el.querySelector('.dnd5e-battle-card-name')?.textContent).toBe('Owlbear 2');
    // A name that is no monster needs hit points.
    type('.dnd5e-battle-add-name', 'Bell ringer');
    await submit();
    expect(notices[notices.length - 1]).toBe(
      '“Bell ringer” is no monster or note: give it hit points to add it.',
    );
    type('.dnd5e-battle-add-hp', '9');
    type('.dnd5e-battle-add-ac', '10');
    await submit();
    expect(names()).toContain('Bell ringer');
    expect(note()).toMatch(/\| Bell ringer \| 9\/9 \| 10 \|/);
    await click('.dnd5e-battle-remove');
    expect(names()).not.toContain('Bell ringer');
    // The owlbear's turn first: defeat it, then end.
    await click('.dnd5e-battle-row', undefined);
    type('.dnd5e-battle-amount', '59');
    await click('.dnd5e-battle-damage');
    await click('.dnd5e-battle-end');
    expect(logged.slice(1)).toEqual([
      { kind: 'defeated', id: 'Owlbear', round: 1 },
      { kind: 'end', rounds: 1, xp: 700 },
    ]);
  });

  it('brings a combatant added mid-fight back with its stat block', async () => {
    const running = [
      '## Combat',
      '',
      'Round 1 · Turn: Owlbear 2',
      '',
      '| Init | Combatant | HP | AC | Conditions |',
      '| ---: | --- | ---: | ---: | --- |',
      '| 11 | Owlbear | 59/59 | 13 | |',
      '| 11 | Owlbear 2 | 40/59 | 13 | |',
      '| 5 | [[Dagny]] | 71/71 | 15 | |',
    ].join('\n');
    const { el, names } = await open('en', running);
    expect(names()).toEqual(['Owlbear', 'Owlbear 2', 'Dagny']);
    await new Promise((r) => window.setTimeout(r, 0));
    expect(el.querySelector('.dnd5e-battle-card-name')?.textContent).toBe('Owlbear 2');
    expect(texts(el, '.dnd5e-sb-name')).toEqual(['Owlbear 2']);
  });

  it('reads a running fight back and tracks a downed character in German', async () => {
    const running = [
      '## Combat',
      '',
      'Round 2 · Turn: Dagny',
      '',
      '| Init | Combatant | HP | AC | Conditions |',
      '| ---: | --- | ---: | ---: | --- |',
      '| 18 | [[Dagny]] | 3/71 | 15 | concentration |',
      '| 11 | Owlbear | 59/59 | 13 | |',
      '| 11 | Thug 1 | 32/32 | 12 | |',
      '| 11 | Thug 2 | 32/32 | 12 | |',
    ].join('\n');
    const { el, click } = await open('de', running);
    expect(el.querySelector('.dnd5e-battle-round')?.textContent).toBe('Runde 2');
    const amount = el.querySelector<HTMLInputElement>('.dnd5e-battle-amount');
    if (amount === null) throw new Error('no amount');
    amount.value = '10';
    amount.dispatchEvent(new Event('input'));
    await click('.dnd5e-battle-damage');
    expect(texts(el, '.is-turn .dnd5e-battle-chip')).toEqual(['Am Boden']);
    await click('.dnd5e-battle-save-fail');
    expect(texts(el, '.is-turn .dnd5e-battle-chip')).toEqual(['Am Boden ✗']);
    const again = el.querySelector<HTMLInputElement>('.dnd5e-battle-amount');
    if (again === null) throw new Error('no amount');
    again.value = '5';
    again.dispatchEvent(new Event('input'));
    await click('.dnd5e-battle-heal');
    expect(texts(el, '.is-turn .dnd5e-battle-meta span')[0]).toBe('TP 5/71');
  });
});

describe('encounter builder', () => {
  function builder(
    lang: 'en' | 'de',
    party: PartyMember[] = [
      { name: 'Dagny', level: 6 },
      { name: 'Ilex', level: 6 },
      { name: 'Orrin Quill', level: null },
    ],
    experience = true,
  ) {
    const created: EncounterDraft[] = [];
    const modal = new EncounterBuilderModal(app, {
      t: createT(lang),
      lang,
      monsters: SRD_MONSTERS,
      party,
      experience,
      create: (draft) => {
        created.push(structuredClone(draft));
        return Promise.resolve();
      },
    });
    root.appendChild(modal.modalEl);
    modal.onOpen();
    const el = modal.contentEl;
    const type = (selector: string, value: string) => {
      const input = el.querySelector<HTMLInputElement>(selector);
      if (input === null) throw new Error(selector);
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };
    const tile = (name: string) =>
      [...el.querySelectorAll<HTMLElement>('.dnd5e-monster-tiles .dnd5e-npc-tile')].find(
        (t) => t.querySelector('.dnd5e-npc-tile-name')?.textContent === name,
      );
    const click = (target: Element | null | undefined) => {
      if (target == null) throw new Error('nothing to click');
      target.dispatchEvent(new MouseEvent('click'));
    };
    return { el, created, type, tile, click };
  }

  it('fills the budget of the party with monsters and writes the draft', async () => {
    const { el, created, type, tile, click } = builder('en');
    // Two level 6 and one without a level (counted as 1): moderate 1,000 + 1,000 + 75.
    expect(texts(el, '.dnd5e-encounter-difficulty .dnd5e-npc-tile-line')).toEqual([
      '1,250 XP',
      '2,075 XP',
      '2,900 XP',
    ]);
    expect(
      el.querySelector('.dnd5e-encounter-difficulty .is-selected')?.getAttribute('data-difficulty'),
    ).toBe('moderate');
    expect(texts(el, '.dnd5e-builder-hint')).toContain(
      'A character without a level in their note counts as level 1.',
    );
    type('.dnd5e-npc-search', 'owlbe');
    click(tile('Owlbear'));
    click(tile('Owlbear'));
    expect(texts(el, '.dnd5e-encounter-count')).toEqual(['2']);
    expect(el.querySelector('.dnd5e-encounter-spent')?.textContent).toBe(
      '1,400 XP of 2,075 XP (Moderate)',
    );
    expect(el.querySelector('.dnd5e-encounter-left')?.textContent).toBe('675 XP left');
    expect(el.querySelector('.dnd5e-encounter-rating')?.textContent).toBe('Moderate difficulty');
    // Leaving Orrin out lowers the budget; High raises it.
    click(
      [...el.querySelectorAll('.dnd5e-encounter-party button')].find(
        (b) => b.textContent === 'Orrin Quill · ?',
      ),
    );
    expect(el.querySelector('.dnd5e-encounter-spent')?.textContent).toBe(
      '1,400 XP of 2,000 XP (Moderate)',
    );
    click(el.querySelector('.dnd5e-encounter-difficulty [data-difficulty="high"]'));
    expect(el.querySelector('.dnd5e-encounter-spent')?.textContent).toBe(
      '1,400 XP of 2,800 XP (High)',
    );
    // One fewer, then a name and create.
    click(el.querySelector('.dnd5e-encounter-stepper button[aria-label="One fewer"]'));
    expect(el.querySelector('.dnd5e-encounter-rating')?.textContent).toBe('Low difficulty');
    click(el.querySelector('.mod-cta'));
    expect(notices[notices.length - 1]).toBe('Give the encounter a name first.');
    type('.dnd5e-encounter-name', 'Owls at the mill');
    type('.dnd5e-encounter-location', '[[Old Mill]]');
    click(el.querySelector('.mod-cta'));
    await new Promise((r) => window.setTimeout(r, 0));
    expect(created).toEqual([
      {
        name: 'Owls at the mill',
        location: '[[Old Mill]]',
        difficulty: 'high',
        party: true,
        monsters: [{ name: 'Owlbear', count: 1 }],
      },
    ]);
  });

  it('shows no experience points when the setting is off', () => {
    const { el, type, tile, click } = builder('en', [{ name: 'Dagny', level: 6 }], false);
    expect(texts(el, '.dnd5e-encounter-difficulty .dnd5e-npc-tile-line')).toEqual([
      'Victory, maybe a scare or two',
      'Could go badly',
      'Could be lethal',
    ]);
    type('.dnd5e-npc-search', 'owlbe');
    expect(tile('Owlbear')?.querySelector('.dnd5e-npc-tile-line')?.textContent).toBe(
      'CR 3 · Monstrosity',
    );
    click(tile('Owlbear'));
    expect(el.querySelector('.dnd5e-encounter-spent')?.textContent).toBe(
      '70 % of the Moderate budget',
    );
    expect(el.querySelector('.dnd5e-encounter-left')).toBeNull();
    expect(el.querySelector('.dnd5e-encounter-rating')?.textContent).toBe('Moderate difficulty');
    expect(el.textContent).not.toContain('XP');
  });

  it('counts a party it is told about when the campaign has none, in German', () => {
    const { el, type, tile, click } = builder('de', []);
    expect(texts(el, '.dnd5e-encounter-difficulty .dnd5e-npc-tile-line')).toEqual([
      '200 EP',
      '300 EP',
      '400 EP',
    ]);
    const level = [...el.querySelectorAll<HTMLInputElement>('.setting-item input')].filter(
      (i) => i.type === 'number',
    )[1];
    if (level === undefined) throw new Error('no level');
    level.value = '5';
    level.dispatchEvent(new Event('input'));
    expect(el.querySelector('.dnd5e-encounter-partyline')?.textContent).toBe(
      '4 Charaktere · Stufen 5, 5, 5, 5',
    );
    type('.dnd5e-npc-search', 'eulenb');
    click(tile('Eulenbär'));
    expect(el.querySelector('.dnd5e-encounter-spent')?.textContent).toBe(
      '700 EP von 3.000 EP (Mittel)',
    );
    expect(el.querySelector('.dnd5e-encounter-rating')?.textContent).toBe('Niedrige Schwierigkeit');
  });
});
