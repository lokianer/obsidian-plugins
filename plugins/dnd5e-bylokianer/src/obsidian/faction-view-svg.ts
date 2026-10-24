// Drawing one faction's view: the faction as a frame with its member chips, the factions and groups
// its arrows reach as boxes on a ring around it (in the world graph's angle order), and the arrows —
// own values solid; a selected member's inherited ones dashed. Clicks lead into notes, deeper
// faction views and the faction card.

import { type FactionView, type ViewArrow, type ViewBox } from '../factions/faction-view';
import type { Point } from '../factions/layout';
import { signed, stepColour, stepName } from '../factions/steps';
import type { T } from '../i18n/strings';
import { PanZoom } from './pan-zoom';
import type { PopoverTarget } from './popover';

const CHIP_W = 170;
const CHIP_H = 36;
const CHIP_GAP = 12;
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
}

/** An axis-aligned rectangle by its centre. */
interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
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

  constructor(
    parent: HTMLElement,
    private readonly t: T,
    private readonly stepNames: () => readonly string[],
    private readonly actions: FactionViewActions,
  ) {
    this.svg = parent.createSvg('svg', { cls: 'dnd5e-world-graph dnd5e-faction-view' });
    this.stage = this.svg.createSvg('g');
    this.panZoom = new PanZoom(this.svg, this.stage);
    this.svg.addEventListener('click', () => this.select(null));
  }

  /**
   * Draws a faction view. `angles` gives each faction's direction from the viewed faction in the
   * world graph, so the boxes keep the map's arrangement; missing ones are spread evenly.
   */
  update(view: FactionView, angles: ReadonlyMap<string, number>): void {
    if (this.last?.view.id !== view.id) this.selected = null;
    this.last = { view, angles };
    const places = this.place(view, angles);
    this.draw(view, places);
    if (this.fittedFor !== view.id) {
      const corners = [...places.values()].flatMap((r) => [
        { x: r.x - r.w / 2, y: r.y - r.h / 2 },
        { x: r.x + r.w / 2, y: r.y + r.h / 2 },
      ]);
      if (this.panZoom.fit(corners, 60)) this.fittedFor = view.id;
    }
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
    const rows = Math.max(1, Math.ceil(view.members.length / columns));
    const frame: Rect = {
      x: 0,
      y: 0,
      w: columns * (CHIP_W + CHIP_GAP) + CHIP_GAP + 24,
      h: FRAME_HEAD + rows * (CHIP_H + CHIP_GAP) + CHIP_GAP,
    };
    places.set(view.id, frame);
    view.members.forEach((member, i) => {
      const column = i % columns;
      const row = Math.floor(i / columns);
      places.set(member.id, {
        x: -frame.w / 2 + 12 + CHIP_GAP + column * (CHIP_W + CHIP_GAP) + CHIP_W / 2,
        y: -frame.h / 2 + FRAME_HEAD + row * (CHIP_H + CHIP_GAP) + CHIP_H / 2,
        w: CHIP_W,
        h: CHIP_H,
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
      places.set(box.id, {
        x: Math.cos(angle) * radius * 1.3,
        y: Math.sin(angle) * radius,
        w: BOX_W,
        h,
      });
      box.characters.forEach((c, row) => {
        places.set(c.id, {
          x: Math.cos(angle) * radius * 1.3,
          y: Math.sin(angle) * radius - h / 2 + BOX_HEAD + row * BOX_ROW + BOX_ROW / 2,
          w: BOX_W - 16,
          h: BOX_ROW,
        });
      });
    });
    spreadBoxes(ordered, places);
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

    frameGroup.createSvg('rect', {
      attr: { x: -frame.w / 2, y: -frame.h / 2, width: frame.w, height: frame.h, rx: 12 },
    });
    const title = frameGroup.createSvg('text', {
      cls: 'dnd5e-fv-frame-title',
      attr: { x: -frame.w / 2 + 20, y: -frame.h / 2 + 34 },
    });
    title.textContent = view.name;
    if (view.power !== null) {
      const power = frameGroup.createSvg('text', {
        cls: 'dnd5e-fv-frame-power',
        attr: { x: frame.w / 2 - 20, y: -frame.h / 2 + 34 },
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
      chip.addEventListener('click', (event) => {
        event.stopPropagation();
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
    for (const arrow of arrows) this.drawArrow(edgeLayer, view, arrow, places);
  }

  private drawBox(layer: SVGGElement, box: ViewBox, places: Map<string, Rect>): void {
    const r = places.get(box.id);
    if (r === undefined) return;
    const group = layer.createSvg('g', { cls: `dnd5e-fv-box is-${box.kind}` });
    group.createSvg('rect', {
      attr: { x: r.x - r.w / 2, y: r.y - r.h / 2, width: r.w, height: r.h, rx: 8 },
    });
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
        if (path !== null) this.actions.openNote(path, event.ctrlKey || event.metaKey);
      });
    }
  }

  private drawArrow(
    layer: SVGGElement,
    view: FactionView,
    arrow: ViewArrow,
    places: Map<string, Rect>,
  ): void {
    const from = places.get(arrow.from);
    const to = places.get(arrow.to);
    if (from === undefined || to === undefined) return;
    const start = border(from, to);
    const tip = border(to, from);
    const dx = tip.x - start.x;
    const dy = tip.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    const [ux, uy] = [dx / length, dy / length];
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
