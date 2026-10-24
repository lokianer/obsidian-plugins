// Pan and zoom for an SVG stage, by mouse (drag, wheel) and touch (drag, pinch), shared by the
// world graph and the faction view.

import type { Point } from '../factions/layout';

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 3;

export class PanZoom {
  private view = { x: 0, y: 0, k: 1 };

  constructor(
    private readonly svg: SVGSVGElement,
    private readonly stage: SVGGElement,
  ) {
    this.bind();
  }

  /** The current zoom factor, to turn screen distances into stage distances. */
  get scale(): number {
    return this.view.k;
  }

  /** Zooms and pans so every point (plus a margin) is in view; false while the SVG has no size. */
  fit(points: readonly Point[], margin = 120): boolean {
    const box = this.svg.getBoundingClientRect();
    if (box.width === 0 || points.length === 0) return false;
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const [minX, maxX] = [Math.min(...xs) - margin, Math.max(...xs) + margin];
    const [minY, maxY] = [Math.min(...ys) - margin, Math.max(...ys) + margin];
    const k = clamp(Math.min(box.width / (maxX - minX), box.height / (maxY - minY)));
    this.view = {
      k,
      x: box.width / 2 - ((minX + maxX) / 2) * k,
      y: box.height / 2 - ((minY + maxY) / 2) * k,
    };
    this.apply();
    return true;
  }

  private apply(): void {
    const { x, y, k } = this.view;
    this.stage.setAttribute('transform', `translate(${x} ${y}) scale(${k})`);
  }

  private zoomAt(factor: number, cx: number, cy: number): void {
    const k = clamp(this.view.k * factor);
    const f = k / this.view.k;
    this.view = { k, x: cx - (cx - this.view.x) * f, y: cy - (cy - this.view.y) * f };
    this.apply();
  }

  private bind(): void {
    const { svg } = this;
    const pointers = new Map<number, Point>();
    let pinch = 0;
    svg.addEventListener('pointerdown', (event) => {
      // No pointer capture here: it would turn a click on an arrow into a click on the canvas.
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
      }
    });
    svg.addEventListener('pointermove', (event) => {
      const last = pointers.get(event.pointerId);
      if (last === undefined) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 1) {
        this.view.x += event.clientX - last.x;
        this.view.y += event.clientY - last.y;
        this.apply();
        return;
      }
      const [a, b] = [...pointers.values()];
      if (a === undefined || b === undefined) return;
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const box = svg.getBoundingClientRect();
      if (pinch > 0) {
        this.zoomAt(distance / pinch, (a.x + b.x) / 2 - box.left, (a.y + b.y) / 2 - box.top);
      }
      pinch = distance;
    });
    const end = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) pinch = 0;
    };
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);
    svg.addEventListener('pointerleave', end);
    svg.addEventListener(
      'wheel',
      (event) => {
        event.preventDefault();
        const box = svg.getBoundingClientRect();
        this.zoomAt(
          Math.exp(-event.deltaY * 0.0015),
          event.clientX - box.left,
          event.clientY - box.top,
        );
      },
      { passive: false },
    );
  }
}

function clamp(k: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, k));
}
