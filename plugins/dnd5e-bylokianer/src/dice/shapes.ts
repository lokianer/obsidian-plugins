// The dice drawn on the stage, each in its own shape, in a 200 × 200 box: the faces as polygons
// (a tone each for light and shade) and where the number sits. d4 a tetrahedron, d6 a cube seen
// from above, d8 an octahedron, d10 a kite, d12 a dodecahedron, d20 an icosahedron; any other
// die a coin. Pure geometry.

export type Point = readonly [number, number];
export type Tone = 'rim' | 'mid' | 'top';

export interface Shape {
  faces: { points: Point[]; tone: Tone }[];
  /** The number's centre and size. */
  label: { x: number; y: number; size: number };
}

const C = 100;
const at = (deg: number, r: number): Point => [
  Math.round((C + r * Math.cos((deg * Math.PI) / 180)) * 10) / 10,
  Math.round((C + r * Math.sin((deg * Math.PI) / 180)) * 10) / 10,
];
const ring = (n: number, r: number, start = -90): Point[] =>
  Array.from({ length: n }, (_, i) => at(start + (360 / n) * i, r));
const p = (list: Point[], i: number): Point =>
  list[((i % list.length) + list.length) % list.length] as Point;

function d4(): Shape {
  const top: Point = [100, 12];
  const left: Point = [12, 176];
  const right: Point = [188, 176];
  const mid: Point = [100, 120];
  return {
    faces: [
      { points: [top, left, mid], tone: 'rim' },
      { points: [top, mid, right], tone: 'mid' },
      { points: [left, right, mid], tone: 'top' },
    ],
    label: { x: 100, y: 150, size: 46 },
  };
}

function d6(): Shape {
  const o = [
    [14, 14],
    [186, 14],
    [186, 186],
    [14, 186],
  ] as Point[];
  const i = [
    [46, 46],
    [154, 46],
    [154, 154],
    [46, 154],
  ] as Point[];
  return {
    faces: [
      { points: [p(o, 0), p(o, 1), p(i, 1), p(i, 0)], tone: 'mid' },
      { points: [p(o, 1), p(o, 2), p(i, 2), p(i, 1)], tone: 'rim' },
      { points: [p(o, 2), p(o, 3), p(i, 3), p(i, 2)], tone: 'rim' },
      { points: [p(o, 3), p(o, 0), p(i, 0), p(i, 3)], tone: 'mid' },
      { points: i, tone: 'top' },
    ],
    label: { x: 100, y: 100, size: 64 },
  };
}

function d8(): Shape {
  const h = ring(6, 92);
  return {
    faces: [
      { points: [p(h, 0), p(h, 1), p(h, 2)], tone: 'rim' },
      { points: [p(h, 2), p(h, 3), p(h, 4)], tone: 'mid' },
      { points: [p(h, 4), p(h, 5), p(h, 0)], tone: 'rim' },
      { points: [p(h, 0), p(h, 2), p(h, 4)], tone: 'top' },
    ],
    label: { x: 100, y: 106, size: 54 },
  };
}

function d10(): Shape {
  const top: Point = [100, 8];
  const left: Point = [12, 108];
  const right: Point = [188, 108];
  const bottom: Point = [100, 192];
  const cl: Point = [56, 112];
  const cr: Point = [144, 112];
  const cb: Point = [100, 142];
  return {
    faces: [
      { points: [top, cl, left], tone: 'rim' },
      { points: [top, right, cr], tone: 'mid' },
      { points: [left, cl, cb, bottom], tone: 'mid' },
      { points: [cb, cr, right, bottom], tone: 'rim' },
      { points: [top, cr, cb, cl], tone: 'top' },
    ],
    label: { x: 100, y: 94, size: 48 },
  };
}

function d12(): Shape {
  const outer = ring(10, 94);
  const inner = ring(5, 48);
  const faces: Shape['faces'] = [];
  for (let k = 0; k < 5; k++) {
    faces.push({
      points: [
        p(inner, k),
        p(outer, 2 * k),
        p(outer, 2 * k + 1),
        p(outer, 2 * k + 2),
        p(inner, k + 1),
      ],
      tone: k % 2 === 0 ? 'rim' : 'mid',
    });
  }
  faces.push({ points: inner, tone: 'top' });
  return { faces, label: { x: 100, y: 104, size: 50 } };
}

function d20(): Shape {
  const h = ring(6, 92);
  const t = [at(-90, 50), at(30, 50), at(150, 50)];
  const near = [0, 1, 1, 2, 2, 0];
  const faces: Shape['faces'] = [];
  for (let i = 0; i < 6; i++) {
    faces.push({ points: [p(h, i), p(h, i + 1), p(t, near[i] ?? 0)], tone: 'rim' });
  }
  faces.push(
    { points: [p(t, 0), p(t, 1), p(h, 1)], tone: 'mid' },
    { points: [p(t, 1), p(t, 2), p(h, 3)], tone: 'mid' },
    { points: [p(t, 2), p(t, 0), p(h, 5)], tone: 'mid' },
    { points: t, tone: 'top' },
  );
  return { faces, label: { x: 100, y: 106, size: 48 } };
}

function coin(): Shape {
  return {
    faces: [
      { points: ring(24, 92), tone: 'rim' },
      { points: ring(24, 72), tone: 'top' },
    ],
    label: { x: 100, y: 100, size: 52 },
  };
}

/** The shape of a die with this many sides. */
export function dieShape(sides: number): Shape {
  switch (sides) {
    case 4:
      return d4();
    case 6:
      return d6();
    case 8:
      return d8();
    case 10:
    case 100:
      return d10();
    case 12:
      return d12();
    case 20:
      return d20();
    default:
      return coin();
  }
}

/** A die as the stage shows it: a d100 is two d10, the tens (`30`, `00`) and the ones (`7`). */
export function shownDice(die: {
  sides: number;
  value: number;
}): { sides: number; text: string }[] {
  if (die.sides !== 100) return [{ sides: die.sides, text: String(die.value) }];
  const v = die.value % 100;
  return [
    { sides: 100, text: String(Math.floor(v / 10) * 10).padStart(2, '0') },
    { sides: 10, text: String(v % 10) },
  ];
}
