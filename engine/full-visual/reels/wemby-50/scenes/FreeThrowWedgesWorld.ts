// One camera over one floor, in feet. x right (viewer's right on BBR's chart), y from the baseline toward half court,
// z up. A pinhole camera looks at a target on the floor from the half-court side: pitch 0 is straight down with the
// baseline at the top of the screen (Basketball-Reference's orientation); pitch 50 degrees is about the seat the
// Toronto photo was taken from. Everything is projected to screen px and drawn as SVG, so it stays sharp from
// 30 to 300 px per foot.

export type FreeThrowWedgesCam = { tx: number; ty: number; D: number; pitch: number; F: number; cx: number; cy: number; yaw?: number };
export type FreeThrowWedgesV3 = [number, number, number];
export type FreeThrowWedgesPt = { x: number; y: number; z: number; ok: boolean };

export const FTW_RIM: FreeThrowWedgesV3 = [0, 5.25, 10];
export const FTW_LINE_Y = 19 - 1 / 12; // the free throw line's centre: its far edge is 19 ft from the baseline, 15 ft from the board face

export function freeThrowWedgesProject(c: FreeThrowWedgesCam, x: number, y: number, z: number): FreeThrowWedgesPt {
  // yaw: the camera walks round the target; the world is turned the other way about it
  if (c.yaw) {
    const ya = c.yaw;
    const x0 = x - c.tx;
    const y0 = y - c.ty;
    x = c.tx + x0 * Math.cos(ya) - y0 * Math.sin(ya);
    y = c.ty + x0 * Math.sin(ya) + y0 * Math.cos(ya);
  }
  const s = Math.sin(c.pitch);
  const co = Math.cos(c.pitch);
  const ex = c.tx;
  const ey = c.ty + c.D * s;
  const ez = c.D * co;
  const dx = x - ex;
  const dy = y - ey;
  const dz = z - ez;
  const xc = dx;
  const yc = -dy * co + dz * s;
  const zc = -dy * s - dz * co;
  if (zc < 0.4) return { x: 0, y: 0, z: zc, ok: false };
  return { x: c.cx + (c.F * xc) / zc, y: c.cy - (c.F * yc) / zc, z: zc, ok: true };
}

/** px per foot at a world point (for line widths and radii) */
export const freeThrowWedgesScaleAt = (c: FreeThrowWedgesCam, x: number, y: number, z: number) => {
  const p = freeThrowWedgesProject(c, x, y, z);
  return p.ok ? c.F / p.z : 0;
};

/** the farthest floor y still in front of the camera, with a margin */
export const freeThrowWedgesFarY = (c: FreeThrowWedgesCam) => (Math.sin(c.pitch) < 0.02 ? 1e4 : c.ty + (0.8 * c.D) / Math.sin(c.pitch));

export function freeThrowWedgesPoly(c: FreeThrowWedgesCam, pts: FreeThrowWedgesV3[]): string | null {
  let d = "";
  for (let i = 0; i < pts.length; i++) {
    const p = freeThrowWedgesProject(c, pts[i][0], pts[i][1], pts[i][2]);
    if (!p.ok) return null;
    d += `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  return d + "Z";
}

export function freeThrowWedgesLine(c: FreeThrowWedgesCam, pts: FreeThrowWedgesV3[]): string | null {
  let d = "";
  let n = 0;
  for (const q of pts) {
    const p = freeThrowWedgesProject(c, q[0], q[1], q[2]);
    if (!p.ok) {
      n = 0;
      continue;
    }
    d += `${n ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    n++;
  }
  return d || null;
}

/** a painted floor line of width w (ft) along a 2D polyline, cut at fraction t of its length, as a filled polygon */
export function freeThrowWedgesBand(c: FreeThrowWedgesCam, pts: [number, number][], w: number, t = 1): string | null {
  if (t <= 0 || pts.length < 2) return null;
  const seg: number[] = [];
  let L = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(l);
    L += l;
  }
  let left = L * Math.min(1, t);
  const cut: [number, number][] = [pts[0]];
  for (let i = 1; i < pts.length && left > 0; i++) {
    const l = seg[i - 1];
    if (l <= left) {
      cut.push(pts[i]);
      left -= l;
    } else {
      const k = left / l;
      cut.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]);
      left = 0;
    }
  }
  if (cut.length < 2) return null;
  const a: FreeThrowWedgesV3[] = [];
  const b: FreeThrowWedgesV3[] = [];
  for (let i = 0; i < cut.length; i++) {
    const p0 = cut[Math.max(0, i - 1)];
    const p1 = cut[Math.min(cut.length - 1, i + 1)];
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const l = Math.hypot(dx, dy) || 1;
    const nx = (-dy / l) * (w / 2);
    const ny = (dx / l) * (w / 2);
    a.push([cut[i][0] + nx, cut[i][1] + ny, 0]);
    b.push([cut[i][0] - nx, cut[i][1] - ny, 0]);
  }
  return freeThrowWedgesPoly(c, [...a, ...b.reverse()]);
}

/** points of a circle arc on the floor (or at height z), angles in radians from +x toward +y */
export function freeThrowWedgesArc(cx: number, cy: number, r: number, a0: number, a1: number, n = 48, z = 0): FreeThrowWedgesV3[] {
  const out: FreeThrowWedgesV3[] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z]);
  }
  return out;
}

export const freeThrowWedgesArc2 = (cx: number, cy: number, r: number, a0: number, a1: number, n = 48) =>
  freeThrowWedgesArc(cx, cy, r, a0, a1, n).map((p) => [p[0], p[1]] as [number, number]);

export const ftwLerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** a seeded random, so every frame draws the same boards */
export const ftwRnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** the camera's eye in world feet */
export function freeThrowWedgesEye(c: FreeThrowWedgesCam): FreeThrowWedgesV3 {
  const ex = 0;
  const ey = c.D * Math.sin(c.pitch);
  const ya = -(c.yaw ?? 0);
  return [c.tx + ex * Math.cos(ya) - ey * Math.sin(ya), c.ty + ex * Math.sin(ya) + ey * Math.cos(ya), c.D * Math.cos(c.pitch)];
}
