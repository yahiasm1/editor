// One camera over one floor, in feet. Same world as the reel's other courts: x to the right as you face the basket
// from half court (Basketball-Reference's chart), y from the baseline toward half court, z up. A look-at pinhole
// camera; internally x is mirrored so the maths is right-handed and the picture matches the real court.

export type FourteenExtraV3 = [number, number, number];
export type FourteenExtraCam = { eye: FourteenExtraV3; at: FourteenExtraV3; F: number; cx: number; cy: number };
export type FourteenExtraPt = { x: number; y: number; z: number; ok: boolean };

export const FX_RIM_Y = 5.25;
export const FX_FTL = 19 - 1 / 12; // centre of the free throw line (the freethrow scene's FTW_LINE_Y)
export const FX_R = 0.8; // a chance: 1.6 ft across
export const FX_H = 0.19; // and 0.12 of that thick
export const FX_SLIVER = 0.06 * Math.PI * 2; // a free throw is 0.44 of a chance

// his 29 field goal attempts, Basketball-Reference shot chart, 21 Nov 2026 (wemby-shots-court.json):
// [n, x ft right of the rim centre, y ft from the rim centre toward half court, made, pts]
export const FX_SHOTS: [number, number, number, number, number][] = [
  [1, 7.48, 26.43, 0, 3],
  [2, 0.19, -0.49, 1, 2],
  [3, 0.09, 0.82, 1, 2],
  [4, -0.21, 2.65, 0, 2],
  [5, 0.19, -0.49, 1, 2],
  [6, -9.12, 24.1, 1, 3],
  [7, 1.1, 0.42, 1, 2],
  [8, 5.46, 26.43, 0, 3],
  [9, 3.94, 0.82, 1, 2],
  [10, 7.89, 15.9, 1, 2],
  [11, 0.29, 4.97, 1, 2],
  [12, -23.9, -0.69, 1, 3],
  [13, 0.6, 0.93, 1, 2],
  [14, 8.7, 12.56, 1, 2],
  [15, 7.68, 25.22, 1, 3],
  [16, 6.06, 13.58, 1, 2],
  [17, -21.16, 12.77, 0, 3],
  [18, 0.6, 0.01, 1, 2],
  [19, 1.0, 0.93, 1, 2],
  [20, 10.11, 22.79, 0, 3],
  [21, 2.93, 25.01, 0, 3],
  [22, 3.43, 0.22, 1, 2],
  [23, 9.81, 14.99, 0, 2],
  [24, 0.6, -0.29, 1, 2],
  [25, 0.7, -0.39, 1, 2],
  [26, 1.51, -0.49, 0, 2],
  [27, -21.57, 13.37, 1, 3],
  [28, 13.05, 22.08, 0, 3],
  [29, 10.52, 22.38, 1, 3],
];

// his six free throws lie on the line as the freethrow scene left them: 0.44 wedges, all turned the same way
export const FX_FT_X = [-4.9, -2.94, -0.98, 0.98, 2.94, 4.9];
export const FX_FT_MADE = [1, 1, 0, 1, 1, 1];
export const FX_FT_A0 = -Math.PI / 2 + FX_SLIVER;
export const FX_FT_A1 = Math.PI / 2;

/** where each disc rests on the floor: discs that overlap an earlier one lie on top of it (the pile at the rim) */
export const FX_REST = (() => {
  const out: { x: number; y: number; z: number }[] = [];
  FX_SHOTS.forEach(([, xf, yf]) => {
    const x = xf;
    const y = yf + FX_RIM_Y;
    let z = 0;
    for (const o of out) if (Math.hypot(o.x - x, o.y - y) < FX_R * 1.55) z = Math.max(z, o.z + FX_H);
    out.push({ x, y, z });
  });
  return out;
})();

type V = FourteenExtraV3;
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V): V => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const mir = (p: V): V => [-p[0], p[1], p[2]];

export function fourteenExtraBasis(c: FourteenExtraCam) {
  const e = mir(c.eye);
  const f = norm(sub(mir(c.at), e));
  const r = norm(cross(f, [0, 0, 1]));
  const u = cross(r, f);
  return { e, f, r, u };
}

export function fourteenExtraProject(c: FourteenExtraCam, x: number, y: number, z: number, B = fourteenExtraBasis(c)): FourteenExtraPt {
  const d = sub([-x, y, z], B.e);
  const zc = dot(d, B.f);
  if (zc < 0.5) return { x: 0, y: 0, z: zc, ok: false };
  return { x: c.cx + (c.F * dot(d, B.r)) / zc, y: c.cy - (c.F * dot(d, B.u)) / zc, z: zc, ok: true };
}

export function fourteenExtraPoly(c: FourteenExtraCam, pts: V[], B = fourteenExtraBasis(c)): string | null {
  let d = "";
  for (let i = 0; i < pts.length; i++) {
    const p = fourteenExtraProject(c, pts[i][0], pts[i][1], pts[i][2], B);
    if (!p.ok) return null;
    d += `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  return d + "Z";
}

export function fourteenExtraLine(c: FourteenExtraCam, pts: V[], B = fourteenExtraBasis(c)): string | null {
  let d = "";
  let n = 0;
  for (const q of pts) {
    const p = fourteenExtraProject(c, q[0], q[1], q[2], B);
    if (!p.ok) {
      n = 0;
      continue;
    }
    d += `${n ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    n++;
  }
  return d || null;
}

/** a painted floor line w ft wide along a polyline, as a filled polygon */
export function fourteenExtraBand(c: FourteenExtraCam, pts: [number, number][], w: number, B = fourteenExtraBasis(c), z = 0): string | null {
  if (pts.length < 2) return null;
  const a: V[] = [];
  const b: V[] = [];
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[Math.min(pts.length - 1, i + 1)];
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const l = Math.hypot(dx, dy) || 1;
    a.push([pts[i][0] - (dy / l) * (w / 2), pts[i][1] + (dx / l) * (w / 2), z]);
    b.push([pts[i][0] + (dy / l) * (w / 2), pts[i][1] - (dx / l) * (w / 2), z]);
  }
  return fourteenExtraPoly(c, [...a, ...b.reverse()], B);
}

export const fourteenExtraArc = (cx: number, cy: number, r: number, a0: number, a1: number, n = 48): [number, number][] => {
  const out: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return out;
};

export const fxLerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const fxLerp3 = (a: V, b: V, t: number): V => [fxLerp(a[0], b[0], t), fxLerp(a[1], b[1], t), fxLerp(a[2], b[2], t)];
export const fxRnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
