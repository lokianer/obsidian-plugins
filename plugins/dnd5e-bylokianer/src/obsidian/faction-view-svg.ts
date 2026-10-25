// Drawing one faction's view: the faction as a frame with its member chips, the factions and groups
// its arrows reach as boxes on a ring around it (in the world graph's angle order), and the arrows —
// own values solid; a selected member's inherited ones dashed. Clicks lead into notes, deeper
// faction views and the faction card.

import {
  type ChipSlot,
  type FactionView,
  memberRows,
  type ViewArrow,
  type ViewBox,
} from '../factions/faction-view';
import type { Point } from '../factions/layout';
import { signed, stepColour, stepName } from '../factions/steps';
import type { T } from '../i18n/strings';
import { PanZoom } from './pan-zoom';
import type { PopoverTarget } from './popover';

const CHIP_W = 170;
const CHIP_H = 36;
const CHIP_GAP = 12;
const LINK_GAP = 96;
const PAIR_OFFSET = 7;
const COLUMNS = 4;
const FRAME_HEAD = 56;
const BOX_W = 190;
const BOX_HEAD = 40;
const BOX_ROW = 26;
const RING_GAP = 200;
const ARROW = 9;

export interface FactionViewActions {
  openNote: (path: string, newLeaf: boolean) => void;
  openFaction: (id: string) => void;
  openValue: (target: PopoverTarget) => void;
  history: (from: string, to: string) => string[];
  /** The offsets dragged in a faction's view, by frame or box id. */
  moves: (view: string) => Record<string, Point>;
  saveMoves: (view: string, moves: Record<string, Point>) => void;
}

/** An axis-aligned rectangle by its centre. */
interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * A generous estimate of a label's width in pixels. Measuring needs a laid-out SVG, which a tab
 * that is still hidden does not have; a little too much room is harmless.
 */
function textWidth(text: string, size: number, bold = false): number {
  return text.length * size * (bold ? 0.62 : 0.56);
}

/** Where the line from a rectangle's centre towards `towards` leaves the rectangle. */
function border(rect: Rect, towards: Point): Point {
  const dx = towards.x - rect.x;
  const dy = towards.y - rect.y;
  if (dx === 0 && dy === 0) return { x: rect.x, y: rect.y };
  const scale = 1 / Math.max(Math.abs(dx) / (rect.w / 2), Math.abs(dy) / (rect.h / 2));
  return { x: rect.x + dx * scale, y: rect.y + dy * scale };
}

export class FactionViewSvg {
  private readonly svg: SVGSVGElement;
  private readonly stage: SVGGElement;
  private readonly panZoom: PanZoom;
  private selected: string | null = null;
  private fittedFor: string | null = null;
  private last: { view: FactionView; angles: ReadonlyMap<string, number> } | null = null;
  /** Offsets dragged in the current view: the frame (with its chips) and boxes, by id. */
  private moves = new Map<string, Point>();
  /** Set by a drag, so the click that ends it does not select or open anything. */
  private dragged = false;

  constructor(
    parent: HTMLElement,
    private readonly t: T,
    private readonly stepNames: () => readonly string[],
    private readonly actions: FactionViewActions,
  ) {
    this.svg = parent.createSvg('svg', { cls: ['dnd5e-world-graph', 'dnd5e-faction-view'] });
    this.stage = this.svg.createSvg('g');
    this.panZoom = new PanZoom(this.svg, this.stage);
    this.svg.addEventListener('pointerdown', () => (this.dragged = false), true);
    this.svg.addEventListener('click', () => {
      if (!this.dragged) this.select(null);
    });
  }

  /**
   * Draws a faction view. `angles` gives each faction's direction from the viewed faction in the
   * world graph, so the boxes keep the map's arrangement; missing ones are spread evenly.
   */
  update(view: FactionView, angles: ReadonlyMap<string, number>): void {
    if (this.last?.view.id !== view.id) {
      this.selected = null;
      this.moves = new Map(Object.entries(this.actions.moves(view.id)));
    }
    this.last = { view, angles };
    const places = this.place(view, angles);
    this.draw(view, places);
    if (this.fittedFor !== view.id) {
      const corners = [...places.values()].flatMap((r) => [
        { x: r.x - r.w / 2, y: r.y - r.h / 2 },
        { x: r.x + r.w / 2, y: r.y + r.h / 2 },
      ]);
      this.panZoom.fit(corners, 60);
      this.fittedFor = view.id;
    }
  }

  /** Forgets what was dragged in the current view. */
  resetMoves(): void {
    if (this.last === null) return;
    this.moves.clear();
    this.actions.saveMoves(this.last.view.id, {});
    this.update(this.last.view, this.last.angles);
  }

  private select(id: string | null): void {
    if (this.selected === id || this.last === null) return;
    this.selected = id;
    this.update(this.last.view, this.last.angles);
  }

  // ── placement ──────────────────────────────────────────────────────────────────────────────

  /** Rectangles for the frame, every member chip and every box, by id. */
  private place(view: FactionView, angles: ReadonlyMap<string, number>): Map<string, Rect> {
    const places = new Map<string, Rect>();
    const columns = Math.max(1, Math.min(COLUMNS, view.members.length));
    const rows = memberRows(view, columns);
    // Chips and the frame grow with their names, so no text runs into its neighbour.
    const chipW = Math.max(
      CHIP_W,
      ...view.members.map((m) => textWidth(m.name, 16, m.kind === 'faction') + 32),
    );
    // Members with an arrow between them stand further apart, so the arrow shows.
    const rowW = (row: readonly ChipSlot[]) =>
      row.reduce((w, slot, i) => w + chipW + (i === 0 ? 0 : slot.linked ? LINK_GAP : CHIP_GAP), 48);
    const gridW = Math.max(...rows.map(rowW), 48 + chipW);
    const power =
      view.power === null ? 0 : 24 + textWidth(`${this.t('card.power')} ${view.power}`, 16);
    const frame: Rect = {
      x: 0,
      y: 0,
      w: Math.max(gridW, 40 + textWidth(view.name, 18, true) + power),
      h: FRAME_HEAD + Math.max(1, rows.length) * (CHIP_H + CHIP_GAP) + CHIP_GAP,
    };
    places.set(view.id, frame);
    rows.forEach((row, r) => {
      let x = -rowW(row) / 2 + 24;
      row.forEach((slot, i) => {
        if (i > 0) x += slot.linked ? LINK_GAP : CHIP_GAP;
        places.set(slot.member.id, {
          x: x + chipW / 2,
          y: -frame.h / 2 + FRAME_HEAD + r * (CHIP_H + CHIP_GAP) + CHIP_H / 2,
          w: chipW,
          h: CHIP_H,
        });
        x += chipW;
      });
    });

    const radius = Math.hypot(frame.w, frame.h) / 2 + RING_GAP;
    const ordered = [...view.boxes].sort(
      (a, b) => (angles.get(a.id) ?? Infinity) - (angles.get(b.id) ?? Infinity),
    );
    ordered.forEach((box, i) => {
      // Known directions are kept; the rest spread evenly so nothing overlaps.
      const angle = angles.get(box.id) ?? (i / Math.max(1, ordered.length)) * 2 * Math.PI;
      const h = BOX_HEAD + box.characters.length * BOX_ROW + (box.characters.length > 0 ? 8 : 0);
      const title = box.kind === 'group' ? '' : box.name;
      const w = Math.max(
        BOX_W,
        textWidth(title, 16, true) + 32,
        ...box.characters.map((c) => textWidth(c.name, 16) + 32),
      );
      places.set(box.id, {
        x: Math.cos(angle) * radius * 1.3,
        y: Math.sin(angle) * radius,
        w,
        h,
      });
      box.characters.forEach((c, row) => {
        places.set(c.id, {
          x: Math.cos(angle) * radius * 1.3,
          y: Math.sin(angle) * radius - h / 2 + BOX_HEAD + row * BOX_ROW + BOX_ROW / 2,
          w: w - 16,
          h: BOX_ROW,
        });
      });
    });
    spreadBoxes(ordered, places);

    // Dragged offsets last: the frame carries its chips, a box its characters.
    const shift = (ids: readonly string[], by: Point | undefined) => {
      if (by === undefined) return;
      for (const id of ids) {
        const r = places.get(id);
        if (r !== undefined) places.set(id, { ...r, x: r.x + by.x, y: r.y + by.y });
      }
    };
    shift([view.id, ...view.members.map((m) => m.id)], this.moves.get(view.id));
    for (const box of view.boxes) {
      shift([box.id, ...box.characters.map((c) => c.id)], this.moves.get(box.id));
    }
    return places;
  }

  // ── drawing ────────────────────────────────────────────────────────────────────────────────

  private draw(view: FactionView, places: Map<string, Rect>): void {
    this.stage.empty();
    const frame = places.get(view.id);
    if (frame === undefined) return;

    // Arrows between the faction and its own members have no room inside the frame.
    const memberIds = new Set(view.members.map((m) => m.id));
    const arrows = view.arrows.filter(
      (a) =>
        a.to !== view.id &&
        !(a.from === view.id && memberIds.has(a.to)) &&
        (this.selected === null ? !a.inherited : a.from === this.selected),
    );
    // Frame below the arrows, chips and boxes above them, so a member's arrow shows from its chip.
    const frameGroup = this.stage.createSvg('g', { cls: 'dnd5e-fv-frame' });
    const edgeLayer = this.stage.createSvg('g');
    const shapes = this.stage.createSvg('g');

    const left = frame.x - frame.w / 2;
    const top = frame.y - frame.h / 2;
    frameGroup.createSvg('rect', {
      attr: { x: left, y: top, width: frame.w, height: frame.h, rx: 12 },
    });
    this.bindDrag(frameGroup, view.id);
    const title = frameGroup.createSvg('text', {
      cls: 'dnd5e-fv-frame-title',
      attr: { x: left + 20, y: top + 34 },
    });
    title.textContent = view.name;
    if (view.power !== null) {
      const power = frameGroup.createSvg('text', {
        cls: 'dnd5e-fv-frame-power',
        attr: { x: left + frame.w - 20, y: top + 34 },
      });
      power.textContent = `${this.t('card.power')} ${view.power}`;
    }

    for (const member of view.members) {
      const r = places.get(member.id);
      if (r === undefined) continue;
      const cls = ['dnd5e-fv-chip', `is-${member.kind}`];
      if (member.ring) cls.push('has-ring');
      if (member.id === this.selected) cls.push('is-selected');
      if (this.selected !== null && member.id !== this.selected) cls.push('is-dim');
      const chip = shapes.createSvg('g', { cls });
      chip.createSvg('rect', {
        attr: {
          x: r.x - r.w / 2,
          y: r.y - r.h / 2,
          width: r.w,
          height: r.h,
          rx: member.kind === 'faction' ? 4 : r.h / 2,
        },
      });
      const label = chip.createSvg('text', { attr: { x: r.x, y: r.y + 6 } });
      label.textContent = member.name;
      chip.createSvg('title').textContent = member.ring
        ? `${member.name} · ${this.t('faction.outOfLine')}`
        : member.name;
      this.bindDrag(chip, view.id);
      chip.addEventListener('click', (event) => {
        event.stopPropagation();
        if (this.dragged) return;
        if ((event.ctrlKey || event.metaKey) && member.notePath !== null) {
          this.actions.openNote(member.notePath, true);
        } else if (member.kind === 'faction') {
          this.actions.openFaction(member.id);
        } else {
          this.select(this.selected === member.id ? null : member.id);
        }
      });
      chip.addEventListener('dblclick', (event) => {
        event.stopPropagation();
        if (member.notePath !== null) this.actions.openNote(member.notePath, false);
      });
    }

    for (const box of view.boxes) this.drawBox(shapes, box, places);
    const drawn = new Set(arrows.map((a) => `${a.from}→${a.to}`));
    for (const arrow of arrows) {
      const paired = drawn.has(`${arrow.to}→${arrow.from}`);
      this.drawArrow(edgeLayer, view, arrow, places, paired);
    }
  }

  private drawBox(layer: SVGGElement, box: ViewBox, places: Map<string, Rect>): void {
    const r = places.get(box.id);
    if (r === undefined) return;
    const group = layer.createSvg('g', { cls: ['dnd5e-fv-box', `is-${box.kind}`] });
    group.createSvg('rect', {
      attr: { x: r.x - r.w / 2, y: r.y - r.h / 2, width: r.w, height: r.h, rx: 8 },
    });
    this.bindDrag(group, box.id);
    const name = group.createSvg('text', {
      cls: 'dnd5e-fv-box-title',
      attr: { x: r.x, y: r.y - r.h / 2 + 26 },
    });
    name.textContent =
      box.kind === 'group'
        ? this.t(box.id === '@party' ? 'pseudo.party' : 'pseudo.unaffiliated')
        : box.name;
    name.addEventListener('click', (event) => {
      event.stopPropagation();
      if (this.dragged) return;
      if ((event.ctrlKey || event.metaKey) && box.notePath !== null) {
        this.actions.openNote(box.notePath, true);
      } else if (box.kind !== 'ghost') {
        this.actions.openFaction(box.id);
      }
    });
    for (const character of box.characters) {
      const c = places.get(character.id);
      if (c === undefined) continue;
      const text = group.createSvg('text', {
        cls: 'dnd5e-fv-box-row',
        attr: { x: c.x, y: c.y + 6 },
      });
      text.textContent = character.name;
      const path = character.notePath;
      text.addEventListener('click', (event) => {
        event.stopPropagation();
        if (this.dragged) return;
        if (path !== null) this.actions.openNote(path, event.ctrlKey || event.metaKey);
      });
    }
  }

  private drawArrow(
    layer: SVGGElement,
    view: FactionView,
    arrow: ViewArrow,
    places: Map<string, Rect>,
    paired: boolean,
  ): void {
    const from = places.get(arrow.from);
    const to = places.get(arrow.to);
    if (from === undefined || to === undefined) return;
    let start = border(from, to);
    let tip = border(to, from);
    const dx = tip.x - start.x;
    const dy = tip.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    const [ux, uy] = [dx / length, dy / length];
    if (paired) {
      // An arrow with a reverse one runs beside it, each on its own left.
      const [ox, oy] = [uy * PAIR_OFFSET, -ux * PAIR_OFFSET];
      start = { x: start.x + ox, y: start.y + oy };
      tip = { x: tip.x + ox, y: tip.y + oy };
    }
    const base = { x: tip.x - ux * ARROW, y: tip.y - uy * ARROW };

    const cls = ['dnd5e-world-edge'];
    if (arrow.inherited) cls.push('is-inherited');
    if (arrow.differs) cls.push('is-differs');
    const group = layer.createSvg('g', { cls });
    group.setCssProps({ '--dnd5e-value-colour': stepColour(arrow.value) });
    group.createSvg('path', {
      cls: 'dnd5e-world-edge-line',
      attr: { d: `M ${start.x} ${start.y} L ${base.x} ${base.y}` },
    });
    group.createSvg('path', {
      cls: 'dnd5e-world-edge-head',
      attr: {
        d: `M ${tip.x} ${tip.y} L ${base.x - uy * ARROW * 0.6} ${base.y + ux * ARROW * 0.6} L ${base.x + uy * ARROW * 0.6} ${base.y - ux * ARROW * 0.6} Z`,
      },
    });
    const hit = group.createSvg('path', {
      cls: 'dnd5e-world-edge-hit',
      attr: { d: `M ${start.x} ${start.y} L ${tip.x} ${tip.y}` },
    });
    const fromName =
      arrow.from === view.id
        ? view.name
        : (view.members.find((m) => m.id === arrow.from)?.name ?? '');
    const toName = this.nameOf(view, arrow.to);
    const origin = arrow.inherited
      ? this.t('world.inheritedFrom', { name: arrow.sourceName })
      : this.t('faction.own');
    const lines = [
      `${fromName} → ${toName}: ${signed(arrow.value)} ${stepName(arrow.value, this.t, this.stepNames())} · ${origin}`,
      ...(arrow.differs ? [this.t('world.trueTag')] : []),
      ...(arrow.why !== undefined ? [arrow.why] : []),
      ...this.actions.history(arrow.from, arrow.to),
    ];
    group.createSvg('title').textContent = lines.join('\n');
    // The popover edits the arrow's tail: an inherited value becomes the member's own.
    hit.addEventListener('click', (event) => {
      event.stopPropagation();
      this.actions.openValue({
        subject: arrow.from,
        target: arrow.to,
        at: { x: event.clientX, y: event.clientY },
      });
    });
  }

  /**
   * Dragging `el` moves the frame or box `id`. The view is redrawn while dragging, which replaces
   * `el`, so the pointer is followed on the window rather than captured on the element.
   */
  private bindDrag(el: SVGGElement, id: string): void {
    el.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || this.last === null) return;
      event.stopPropagation();
      const view = this.last.view.id;
      const start = { x: event.clientX, y: event.clientY };
      const origin = this.moves.get(id) ?? { x: 0, y: 0 };
      const win = el.ownerDocument.defaultView ?? window;
      const move = (e: PointerEvent) => {
        const dx = (e.clientX - start.x) / this.panZoom.scale;
        const dy = (e.clientY - start.y) / this.panZoom.scale;
        if (!this.dragged && Math.hypot(dx, dy) < 4) return;
        this.dragged = true;
        this.moves.set(id, { x: origin.x + dx, y: origin.y + dy });
        if (this.last !== null) this.update(this.last.view, this.last.angles);
      };
      const up = () => {
        win.removeEventListener('pointermove', move);
        win.removeEventListener('pointerup', up);
        if (this.dragged) this.actions.saveMoves(view, Object.fromEntries(this.moves));
      };
      win.addEventListener('pointermove', move);
      win.addEventListener('pointerup', up);
    });
  }

  private nameOf(view: FactionView, id: string): string {
    if (id === view.id) return view.name;
    const member = view.members.find((m) => m.id === id);
    if (member !== undefined) return member.name;
    for (const box of view.boxes) {
      if (box.id === id) return box.name;
      const character = box.characters.find((c) => c.id === id);
      if (character !== undefined) return character.name;
    }
    return id.startsWith('?') ? id.slice(1) : id;
  }
}

/** Pushes boxes on the ring apart vertically where they overlap, characters moving with them. */
function spreadBoxes(boxes: readonly ViewBox[], places: Map<string, Rect>): void {
  const sorted = [...boxes].sort((a, b) => (places.get(a.id)?.y ?? 0) - (places.get(b.id)?.y ?? 0));
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 1; i < sorted.length; i++) {
      for (let j = 0; j < i; j++) {
        const a = places.get(sorted[j]?.id ?? '');
        const b = sorted[i];
        const rb = places.get(b?.id ?? '');
        if (a === undefined || rb === undefined || b === undefined) continue;
        const overlapX = Math.abs(a.x - rb.x) < (a.w + rb.w) / 2 + 16;
        const gap = (a.h + rb.h) / 2 + 16 - Math.abs(a.y - rb.y);
        if (!overlapX || gap <= 0) continue;
        const shift = rb.y >= a.y ? gap : -gap;
        rb.y += shift;
        for (const c of b.characters) {
          const rc = places.get(c.id);
          if (rc !== undefined) rc.y += shift;
        }
      }
    }
  }
}
