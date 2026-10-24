// Drawing the faction graph as SVG: nodes, frames, ghosts, sub-faction ties and coloured arrows,
// with pan, zoom, selection and the clicks that lead into notes and the faction card. The layout
// is computed from the public graph only, so the True toggle never moves a node.

import type { FactionWorld, Mode } from '../factions/model';
import { type CachedPoint, layout, nodeRadius, type Point } from '../factions/layout';
import { signed, stepColour, stepName } from '../factions/steps';
import {
  buildGraph,
  type EditTarget,
  type GraphEdge,
  type GraphNode,
} from '../factions/world-graph';
import type { T } from '../i18n/strings';
import { PanZoom } from './pan-zoom';

const FRAME_WIDTH = 200;
const FRAME_HEAD = 40;
const FRAME_ROW = 28;
const BOW = 22;
/** How far an arrow from a frame runs straight out before it bends. */
const STUB = 24;
const ARROW = 10;

export interface GraphActions {
  /** Open a note; `newLeaf` for Ctrl/Cmd. */
  openNote: (path: string, newLeaf: boolean) => void;
  /** Open the note holding a value and focus its entry in the faction card. */
  editValue: (edit: EditTarget, newLeaf: boolean) => void;
  /** Open the faction view of a faction or frame. */
  openFaction: (id: string) => void;
  /** Persist positions (after a layout or a drag). */
  savePositions: (positions: Record<string, CachedPoint>) => void;
}

function frameHeight(rows: number): number {
  return FRAME_HEAD + FRAME_ROW * rows + 8;
}

/** A key for what the layout depends on: the nodes and the related pairs of the public graph. */
function layoutKey(nodes: readonly GraphNode[], edges: readonly GraphEdge[]): string {
  const pairs = edges.map((e) => [e.sourceNode, e.target].sort().join('|'));
  return JSON.stringify([nodes.map((n) => n.id).sort(), [...new Set(pairs)].sort()]);
}

export class WorldGraphSvg {
  private readonly svg: SVGSVGElement;
  private readonly stage: SVGGElement;
  private readonly panZoom: PanZoom;
  private positions = new Map<string, Point>();
  private pinned = new Set<string>();
  private key = '';
  private fitted = false;
  /** Set by the view: draw again with the current world and mode. */
  redraw: (() => void) | null = null;

  constructor(
    parent: HTMLElement,
    private readonly t: T,
    private readonly stepNames: () => readonly string[],
    private readonly actions: GraphActions,
  ) {
    this.svg = parent.createSvg('svg', { cls: 'dnd5e-world-graph' });
    this.stage = this.svg.createSvg('g');
    this.panZoom = new PanZoom(this.svg, this.stage);
  }

  /** Redraws for a world and mode; lays out again only when nodes or related pairs changed. */
  update(world: FactionWorld, mode: Mode, cached: Readonly<Record<string, CachedPoint>>): void {
    const base = buildGraph(world, 'public');
    const graph = mode === 'public' ? base : buildGraph(world, mode);
    const key = layoutKey(base.nodes, base.edges);
    if (key !== this.key) {
      this.key = key;
      this.pinned = new Set(Object.keys(cached).filter((id) => cached[id]?.pinned === true));
      this.positions = layout(base, cached);
      this.save();
    }
    // Nodes only the true graph has (a secret dangling target) are placed around the others.
    const missing = graph.nodes.filter((n) => !this.positions.has(n.id));
    if (missing.length > 0) {
      const fixed = Object.fromEntries(
        [...this.positions].map(([id, p]) => [id, { ...p, pinned: true }]),
      );
      for (const [id, p] of layout(graph, fixed)) {
        if (!this.positions.has(id)) this.positions.set(id, p);
      }
    }
    this.draw(graph);
    if (!this.fitted) this.fit();
  }

  /** Forgets every position and pin and lays the graph out afresh. */
  relayout(world: FactionWorld, mode: Mode): void {
    this.key = '';
    this.update(world, mode, {});
    this.fit();
  }

  private save(): void {
    this.actions.savePositions(
      Object.fromEntries(
        [...this.positions].map(([id, p]) => [
          id,
          this.pinned.has(id) ? { ...p, pinned: true } : p,
        ]),
      ),
    );
  }

  // ── drawing ────────────────────────────────────────────────────────────────────────────────

  private draw(graph: ReturnType<typeof buildGraph>): void {
    this.stage.empty();

    const ties = this.stage.createSvg('g', { cls: 'dnd5e-world-ties' });
    for (const { child, parent } of graph.ties) {
      const a = this.positions.get(child);
      const b = this.positions.get(parent);
      if (a === undefined || b === undefined) continue;
      ties.createSvg('line', {
        cls: 'dnd5e-world-tie',
        attr: { x1: a.x, y1: a.y, x2: b.x, y2: b.y },
      });
    }

    const pairs = new Set(graph.edges.map((e) => `${e.sourceNode}→${e.target}`));
    const edgeLayer = this.stage.createSvg('g', { cls: 'dnd5e-world-edges' });
    const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));
    for (const edge of graph.edges) {
      this.drawEdge(edgeLayer, edge, nodeById, pairs.has(`${edge.target}→${edge.sourceNode}`));
    }

    const nodeLayer = this.stage.createSvg('g', { cls: 'dnd5e-world-nodes' });
    for (const node of graph.nodes) {
      this.drawNode(nodeLayer, node);
    }
  }

  /**
   * Where an arrow starts: the node's centre; or, from a frame, the character's row at the frame's
   * edge facing the target, with a short stub out of the frame so the line does not cross it.
   */
  private startOf(
    edge: GraphEdge,
    nodes: Map<string, GraphNode>,
    towards: Point,
  ): { origin: Point; start: Point } | null {
    const node = nodes.get(edge.sourceNode);
    const centre = this.positions.get(edge.sourceNode);
    if (node === undefined || centre === undefined) return null;
    if (node.kind !== 'frame') return { origin: centre, start: centre };
    const index = node.rows.findIndex((r) => r.id === edge.source);
    const top = centre.y - frameHeight(node.rows.length) / 2;
    const side = towards.x < centre.x ? -1 : 1;
    const origin = {
      x: centre.x + (side * FRAME_WIDTH) / 2,
      y: top + FRAME_HEAD + FRAME_ROW * index + FRAME_ROW / 2,
    };
    return { origin, start: { x: origin.x + side * STUB, y: origin.y } };
  }

  private drawEdge(
    layer: SVGGElement,
    edge: GraphEdge,
    nodes: Map<string, GraphNode>,
    bowed: boolean,
  ): void {
    const end = this.positions.get(edge.target);
    const targetNode = nodes.get(edge.target);
    if (end === undefined || targetNode === undefined) return;
    const from = this.startOf(edge, nodes, end);
    if (from === null) return;
    const { origin, start } = from;

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    const [ux, uy] = [dx / length, dy / length];
    // Bow to the left of the direction, so the reverse arrow bows to the other side.
    const bow = bowed ? BOW : 0;
    const control = {
      x: (start.x + end.x) / 2 - uy * bow * 2,
      y: (start.y + end.y) / 2 + ux * bow * 2,
    };
    const fromControl = { x: end.x - control.x, y: end.y - control.y };
    const fl = Math.hypot(fromControl.x, fromControl.y) || 1;
    const r = nodeRadius(targetNode) + 4;
    const tip = { x: end.x - (fromControl.x / fl) * r, y: end.y - (fromControl.y / fl) * r };
    const [tx, ty] = [fromControl.x / fl, fromControl.y / fl];
    const base = { x: tip.x - tx * ARROW, y: tip.y - ty * ARROW };

    const cls = ['dnd5e-world-edge'];
    if (edge.differs) cls.push('is-differs');
    const group = layer.createSvg('g', { cls });
    group.setCssProps({ '--dnd5e-value-colour': stepColour(edge.value) });
    group.createSvg('path', {
      cls: 'dnd5e-world-edge-line',
      attr: {
        d: `M ${origin.x} ${origin.y} L ${start.x} ${start.y} Q ${control.x} ${control.y} ${base.x} ${base.y}`,
      },
    });
    group.createSvg('path', {
      cls: 'dnd5e-world-edge-head',
      attr: {
        d: `M ${tip.x} ${tip.y} L ${base.x - ty * ARROW * 0.6} ${base.y + tx * ARROW * 0.6} L ${base.x + ty * ARROW * 0.6} ${base.y - tx * ARROW * 0.6} Z`,
      },
    });
    // A wide invisible stroke makes the thin arrow easy to hit, on touch too.
    const hit = group.createSvg('path', {
      cls: 'dnd5e-world-edge-hit',
      attr: { d: `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${tip.x} ${tip.y}` },
    });
    const source = nodes.get(edge.sourceNode);
    const sourceName =
      source?.kind === 'frame'
        ? (source.rows.find((row) => row.id === edge.source)?.name ?? source.name)
        : (source?.name ?? '');
    const title = `${sourceName} → ${targetNode.name}: ${signed(edge.value)} ${stepName(edge.value, this.t, this.stepNames())}${edge.differs ? ` · ${this.t('world.trueTag')}` : ''}${edge.why !== undefined ? `\n${edge.why}` : ''}`;
    group.createSvg('title').textContent = title;
    hit.addEventListener('click', (event) => {
      event.stopPropagation();
      this.actions.editValue(edge.edit, event.ctrlKey || event.metaKey);
    });
  }

  private drawNode(layer: SVGGElement, node: GraphNode): void {
    const p = this.positions.get(node.id);
    if (p === undefined) return;
    const cls = [`dnd5e-world-node is-${node.kind}`];
    const group = layer.createSvg('g', { cls, attr: { transform: `translate(${p.x} ${p.y})` } });

    if (node.kind === 'frame') {
      const height = frameHeight(node.rows.length);
      group.createSvg('rect', {
        cls: 'dnd5e-world-frame',
        attr: { x: -FRAME_WIDTH / 2, y: -height / 2, width: FRAME_WIDTH, height, rx: 8 },
      });
      const title = group.createSvg('text', {
        cls: 'dnd5e-world-frame-title',
        attr: { x: 0, y: -height / 2 + 26 },
      });
      title.textContent = this.t(node.id === '@party' ? 'pseudo.party' : 'pseudo.unaffiliated');
      node.rows.forEach((row, i) => {
        const text = group.createSvg('text', {
          cls: 'dnd5e-world-frame-row',
          attr: { x: 0, y: -height / 2 + FRAME_HEAD + FRAME_ROW * i + 19 },
        });
        text.textContent = row.name;
        const path = row.notePath;
        if (path !== null) {
          text.addEventListener('click', (event) => {
            event.stopPropagation();
            this.actions.openNote(path, event.ctrlKey || event.metaKey);
          });
        }
      });
    } else {
      const r = nodeRadius(node);
      group.createSvg('circle', { cls: 'dnd5e-world-circle', attr: { r } });
      const label = group.createSvg('text', { cls: 'dnd5e-world-label', attr: { y: r + 20 } });
      label.textContent = node.name;
      if (node.kind === 'faction') {
        const power = group.createSvg('text', { cls: 'dnd5e-world-power', attr: { y: 6 } });
        power.textContent = '●'.repeat(node.power);
      }
    }
    group.createSvg('title').textContent = node.name;
    this.bindNode(group, node);
  }

  // ── interaction ────────────────────────────────────────────────────────────────────────────

  private bindNode(group: SVGGElement, node: GraphNode): void {
    let dragged = false;
    group.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      event.stopPropagation();
      dragged = false;
      const start = { x: event.clientX, y: event.clientY };
      const origin = this.positions.get(node.id);
      if (origin === undefined) return;
      group.setPointerCapture(event.pointerId);
      const move = (e: PointerEvent) => {
        const dx = (e.clientX - start.x) / this.panZoom.scale;
        const dy = (e.clientY - start.y) / this.panZoom.scale;
        if (!dragged && Math.hypot(dx, dy) < 4) return;
        dragged = true;
        this.positions.set(node.id, { x: origin.x + dx, y: origin.y + dy });
        group.setAttribute('transform', `translate(${origin.x + dx} ${origin.y + dy})`);
      };
      const up = () => {
        group.removeEventListener('pointermove', move);
        group.removeEventListener('pointerup', up);
        if (dragged) {
          this.pinned.add(node.id);
          this.save();
          this.redraw?.();
        }
      };
      group.addEventListener('pointermove', move);
      group.addEventListener('pointerup', up);
    });
    group.addEventListener('click', (event) => {
      event.stopPropagation();
      if (dragged) return;
      const path = node.kind === 'faction' ? node.notePath : null;
      if ((event.ctrlKey || event.metaKey) && path !== null) {
        this.actions.openNote(path, true);
      } else if (node.kind !== 'ghost') {
        this.actions.openFaction(node.id);
      }
    });
  }

  /** Zooms and pans so every node is in view. */
  fit(): void {
    if (this.panZoom.fit([...this.positions.values()])) this.fitted = true;
  }
}
