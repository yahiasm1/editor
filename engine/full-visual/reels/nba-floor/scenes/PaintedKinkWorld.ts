// One camera over one NBA half court, in feet (plan.md, "Thread object"): origin = middle of the basket, +x right,
// +y away from the baseline toward half court, z up. Baseline y = -5.25, sidelines x = +/-25, half court y = 41.75.
// A look-down camera orbits a target on the floor: pitch 0 is straight down with the baseline at the BOTTOM of the
// screen (the reel's ARC FRAME); pitch near 1.4 is shoe height, looking along the boards toward half court.
// Everything is projected to screen px with a real near-plane clip, so a line can run under the lens and stay a line.

export type PaintedKinkCam = { tx: number; ty: number; D: number; pitch: number; yaw: number; F: number; cx: number; cy: number };
export type PaintedKinkV3 = [number, number, number];
type CamPt = { x: number; y: number; z: number };

export const PK_LINE = 1 / 6; // 2 in paint
export const PK_ARC_R = 23.75;
export const PK_CORNER_X = 22;
export const PK_BASE_Y = -5.25;
export const PK_SIDE_X = 25;
export const PK_HALF_Y = 41.75;
export const PK_APRON = 3;
/** where the 23'9" arc meets the straight corner line: sqrt(23.75^2 - 22^2) = 8.95 ft past the basket */
export const PK_KINK_Y = Math.sqrt(PK_ARC_R * PK_ARC_R - PK_CORNER_X * PK_CORNER_X);
export const PK_KINK_A = Math.atan2(PK_KINK_Y, PK_CORNER_X); // 0.386 rad
/** the straight run: baseline to kink, 5.25 + 8.95 = 14.2 ft */
export const PK_RUN = PK_KINK_Y - PK_BASE_Y;

/** the reel's ARC FRAME: 20.8 px/ft, sidelines at x 20 and 1060, baseline at y 1420 */
export const PK_ARC_FRAME: PaintedKinkCam = { tx: 0, ty: 14, D: 60, pitch: 0, yaw: 0, F: 1248, cx: 540, cy: 1310.8 - 14 * 20.8 };

function basis(c: PaintedKinkCam) {
  const sp = Math.sin(c.pitch), cp = Math.cos(c.pitch);
  const hx = Math.sin(c.yaw), hy = Math.cos(c.yaw);
  const f: PaintedKinkV3 = [sp * hx, sp * hy, -cp];
  const r: PaintedKinkV3 = [Math.cos(c.yaw), -Math.sin(c.yaw), 0];
  // u = r x f
  const u: PaintedKinkV3 = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  const eye: PaintedKinkV3 = [c.tx - f[0] * c.D, c.ty - f[1] * c.D, -f[2] * c.D];
  return { f, r, u, eye };
}

export const paintedKinkEye = (c: PaintedKinkCam) => basis(c).eye;

const NEAR = 0.35;

function toCam(c: PaintedKinkCam, b: ReturnType<typeof basis>, p: PaintedKinkV3): CamPt {
  const d = [p[0] - b.eye[0], p[1] - b.eye[1], p[2] - b.eye[2]];
  return { x: d[0] * b.r[0] + d[1] * b.r[1] + d[2] * b.r[2], y: d[0] * b.u[0] + d[1] * b.u[1] + d[2] * b.u[2], z: d[0] * b.f[0] + d[1] * b.f[1] + d[2] * b.f[2] };
}
const toScreen = (c: PaintedKinkCam, q: CamPt) => ({ x: c.cx + (c.F * q.x) / q.z, y: c.cy - (c.F * q.y) / q.z });

/** world point -> screen, with s = px per foot there; ok false when behind the lens */
export function paintedKinkProject(c: PaintedKinkCam, x: number, y: number, z = 0) {
  const q = toCam(c, basis(c), [x, y, z]);
  if (q.z < NEAR) return { x: 0, y: 0, s: 0, depth: q.z, ok: false };
  const s = toScreen(c, q);
  return { x: s.x, y: s.y, s: c.F / q.z, depth: q.z, ok: true };
}

/** a closed world polygon, clipped at the near plane, as an svg path ("" when nothing is in front) */
export function paintedKinkPoly(c: PaintedKinkCam, pts: PaintedKinkV3[]): string {
  const b = basis(c);
  const cam = pts.map((p) => toCam(c, b, p));
  const out: CamPt[] = [];
  for (let i = 0; i < cam.length; i++) {
    const a = cam[i], n = cam[(i + 1) % cam.length];
    const ain = a.z >= NEAR, nin = n.z >= NEAR;
    if (ain) out.push(a);
    if (ain !== nin) {
      const t = (NEAR - a.z) / (n.z - a.z);
      out.push({ x: a.x + (n.x - a.x) * t, y: a.y + (n.y - a.y) * t, z: NEAR });
    }
  }
  if (out.length < 3) return "";
  let d = "";
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  out.forEach((q, i) => {
    const s = toScreen(c, q);
    // keep huge near-plane coordinates finite for the svg rasteriser
    const x = Math.max(-20000, Math.min(20000, s.x)), y = Math.max(-20000, Math.min(20000, s.y));
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  if (maxX < -60 || minX > 1140 || maxY < 0 || minY > 1980) return "";
  return d + "Z";
}

/** a polyline cut to fraction [t0, t1] of its length */
export function paintedKinkCut(pts: [number, number][], t0: number, t1: number): [number, number][] {
  if (t1 <= t0 || pts.length < 2) return [];
  const seg: number[] = [];
  let L = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(l);
    L += l;
  }
  const at = (d: number): [number, number] => {
    let acc = 0;
    for (let i = 0; i < seg.length; i++) {
      if (acc + seg[i] >= d) {
        const k = seg[i] ? (d - acc) / seg[i] : 0;
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
      }
      acc += seg[i];
    }
    return pts[pts.length - 1];
  };
  const a = Math.max(0, t0) * L, b = Math.min(1, t1) * L;
  const out: [number, number][] = [at(a)];
  let acc = 0;
  for (let i = 0; i < seg.length; i++) {
    acc += seg[i];
    if (acc > a && acc < b) out.push(pts[i + 1]);
  }
  out.push(at(b));
  return out;
}

export const paintedKinkLength = (pts: [number, number][]) => {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return L;
};

/** a painted floor band of width w along a polyline; off shifts it sideways (+ = left of travel) */
export function paintedKinkBand(c: PaintedKinkCam, pts: [number, number][], w: number, off = 0, z = 0): string {
  if (pts.length < 2) return "";
  const L: PaintedKinkV3[] = [];
  const R: PaintedKinkV3[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    const nx = -dy / l, ny = dx / l;
    L.push([pts[i][0] + nx * (off + w / 2), pts[i][1] + ny * (off + w / 2), z]);
    R.push([pts[i][0] + nx * (off - w / 2), pts[i][1] + ny * (off - w / 2), z]);
  }
  return paintedKinkPoly(c, [...L, ...R.reverse()]);
}

/** points of a circle arc in the floor plane, from angle a0 to a1 (radians, 0 = +x, ccw) */
export function paintedKinkArc(cx: number, cy: number, r: number, a0: number, a1: number, n = 48): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return out;
}

/** the three-point line as one path the paint can run along: top of the arc -> kink -> baseline, on one side */
export function paintedKinkThreePath(side: 1 | -1, n = 72): [number, number][] {
  const top = Math.PI / 2;
  const end = side > 0 ? PK_KINK_A : Math.PI - PK_KINK_A;
  const arc = paintedKinkArc(0, 0, PK_ARC_R - PK_LINE / 2, top, end, n);
  return [...arc, [side * (PK_CORNER_X - PK_LINE / 2), PK_BASE_Y]];
}

/** deterministic noise */
export const pkRnd = (i: number, seed = 1) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** camera mix: distance and focal in log space, so a dive from 60 ft to 7 ft feels even */
export function paintedKinkMix(a: PaintedKinkCam, b: PaintedKinkCam, t: number): PaintedKinkCam {
  return {
    tx: lerp(a.tx, b.tx, t),
    ty: lerp(a.ty, b.ty, t),
    D: Math.exp(lerp(Math.log(a.D), Math.log(b.D), t)),
    pitch: lerp(a.pitch, b.pitch, t),
    yaw: lerp(a.yaw, b.yaw, t),
    F: Math.exp(lerp(Math.log(a.F), Math.log(b.F), t)),
    cx: lerp(a.cx, b.cx, t),
    cy: lerp(a.cy, b.cy, t),
  };
}
