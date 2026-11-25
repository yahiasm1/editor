// Scene `cta`: its world. The same half court in feet as every scene (plan.md, "Thread object": origin = middle of
// the basket, +x right, +y toward half court), and the real Capital One Arena floor it lands on: a homography from
// world feet to the 3840 px photo, fitted on the four inner corners of the near half court and checked by drawing the
// three-point line, lane, free throw circle and 28 ft hash marks back onto the photo (notes/CornerWatch.md).
import { interpolate } from "remotion";

export type CornerWatchH = number[]; // 3x3, row-major
export type CornerWatchPt = [number, number];

export const CW_LINE = 1 / 6;
export const CW_R = 23.75;
export const CW_CORNER = 22;
export const CW_SIDE = 25;
export const CW_BASE = -5.25;
export const CW_HALF = 41.75;
export const CW_KINK_Y = Math.sqrt(CW_R * CW_R - CW_CORNER * CW_CORNER); // 8.95
export const CW_KINK_A = Math.atan2(CW_KINK_Y, CW_CORNER);
export const CW_R16 = 16;

/** the photo, its size in px */
export const CW_PHOTO_W = 3840;
export const CW_PHOTO_H = 2560;

/** the floor element: world rect drawn at K px per foot */
export const CW_X0 = -28.5;
export const CW_X1 = 28.5;
export const CW_Y0 = -8.9;
export const CW_Y1 = 41.9;
export const CW_K = 20;
export const CW_FW = (CW_X1 - CW_X0) * CW_K;
export const CW_FH = (CW_Y1 - CW_Y0) * CW_K;

/** solve the 3x3 homography taking four src points to four dst points */
export function cwHomography(src: CornerWatchPt[], dst: CornerWatchPt[]): CornerWatchH {
  const A: number[][] = [];
  for (let k = 0; k < 4; k++) {
    const [x, y] = src[k], [u, v] = dst[k];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const m = A[r][c] / A[c][c];
      for (let k = c; k < 9; k++) A[r][k] -= m * A[c][k];
    }
  }
  return [...A.map((row, i) => row[8] / row[i]), 1];
}

export const cwApply = (H: CornerWatchH, x: number, y: number): CornerWatchPt => {
  const w = H[6] * x + H[7] * y + H[8];
  return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
};

/** A then B (B o A) */
export const cwCompose = (B: CornerWatchH, A: CornerWatchH): CornerWatchH => {
  const o: number[] = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) o.push(B[r * 3] * A[c] + B[r * 3 + 1] * A[3 + c] + B[r * 3 + 2] * A[6 + c]);
  return o;
};

/** CSS matrix3d for a homography acting on an element's own pixels (transform-origin 0 0) */
export const cwMatrix3d = (H: CornerWatchH) => {
  const s = H[8];
  const n = (v: number) => (v / s).toFixed(10);
  return `matrix3d(${n(H[0])},${n(H[3])},0,${n(H[6])},${n(H[1])},${n(H[4])},0,${n(H[7])},0,0,1,0,${n(H[2])},${n(H[5])},0,${n(H[8])})`;
};

/** world corners of the near half court and where their inner edges are in the 3840 px photo (measured) */
export const CW_COURT: CornerWatchPt[] = [[-CW_SIDE, CW_BASE], [CW_SIDE, CW_BASE], [-CW_SIDE, CW_HALF], [CW_SIDE, CW_HALF]];
const CW_COURT_PHOTO: CornerWatchPt[] = [[1461.7, 2277.0], [2427.5, 2266.2], [1568.3, 1961.3], [2308.3, 1952.2]];
/** world feet -> photo px */
export const CW_H_PHOTO = cwHomography(CW_COURT, CW_COURT_PHOTO);

/** the photo's camera: the photo px (cx, cy) sits at screen (540, CW_SCREEN_Y), s screen px per photo px */
export type CornerWatchCam = { cx: number; cy: number; s: number };
export const CW_SCREEN_Y = 1000;

/** photo px -> screen px, as a homography */
export const cwCamH = (c: CornerWatchCam): CornerWatchH => [c.s, 0, 540 - c.cx * c.s, 0, c.s, CW_SCREEN_Y - c.cy * c.s, 0, 0, 1];

/** a camera placing photo point (px, py) at screen (sx, sy) at scale s */
export const cwCamAt = (px: number, py: number, sx: number, sy: number, s: number): CornerWatchCam => ({
  cx: px - (sx - 540) / s,
  cy: py - (sy - CW_SCREEN_Y) / s,
  s,
});

/** a zoom that travels straight at its target: position follows 1/s, so nothing drifts sideways */
export function cwCamMix(a: CornerWatchCam, b: CornerWatchCam, t: number): CornerWatchCam {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const s = Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * t);
  const w = Math.abs(1 / b.s - 1 / a.s) < 1e-9 ? t : (1 / s - 1 / a.s) / (1 / b.s - 1 / a.s);
  return { cx: a.cx + (b.cx - a.cx) * w, cy: a.cy + (b.cy - a.cy) * w, s };
}

/** element px of the floor div -> world feet */
export const CW_DIV_TO_WORLD: CornerWatchH = [1 / CW_K, 0, CW_X0, 0, -1 / CW_K, CW_Y1, 0, 0, 1];

/** svg path through world points, projected by H */
export function cwPath(H: CornerWatchH, pts: CornerWatchPt[], close = false) {
  let d = "";
  pts.forEach(([x, y], i) => {
    const [u, v] = cwApply(H, x, y);
    d += `${i ? "L" : "M"}${u.toFixed(2)} ${v.toFixed(2)}`;
  });
  return close ? d + "Z" : d;
}

/** the gold 21 in sliver, baseline to the kink, as world points; `upto` 0..1 paints it from the baseline */
export function cwSliverPts(side: 1 | -1, upto = 1): CornerWatchPt[] {
  const top = CW_BASE + (CW_KINK_Y - CW_BASE) * upto;
  const n = 30;
  const out: CornerWatchPt[] = [[side * CW_CORNER, CW_BASE]];
  for (let i = 0; i <= n; i++) {
    const y = CW_BASE + ((top - CW_BASE) * i) / n;
    out.push([side * Math.sqrt(CW_R * CW_R - y * y), y]);
  }
  out.push([side * CW_CORNER, top]);
  return out;
}

/** the three-point line, baseline to baseline */
export function cwThreePts(): CornerWatchPt[] {
  const out: CornerWatchPt[] = [[CW_CORNER, CW_BASE], [CW_CORNER, CW_KINK_Y]];
  for (let k = 0; k <= 80; k++) {
    const a = CW_KINK_A + ((Math.PI - 2 * CW_KINK_A) * k) / 80;
    out.push([CW_R * Math.cos(a), CW_R * Math.sin(a)]);
  }
  out.push([-CW_CORNER, CW_BASE]);
  return out;
}

/** the long-two band: from 16 ft to the three-point line, above the baseline */
export function cwBandPts(): CornerWatchPt[] {
  const out = cwThreePts();
  const a0 = Math.asin(-CW_BASE / CW_R16) * -1;
  const a1 = Math.PI - a0;
  for (let k = 0; k <= 60; k++) {
    const a = a1 - ((a1 - a0) * k) / 60;
    out.push([CW_R16 * Math.cos(a), CW_R16 * Math.sin(a)]);
  }
  return out;
}

/** a circle on the floor, as world points */
export const cwCirclePts = (cx: number, cy: number, r: number, n = 64): CornerWatchPt[] =>
  Array.from({ length: n + 1 }, (_, i) => [cx + r * Math.cos((i / n) * Math.PI * 2), cy + r * Math.sin((i / n) * Math.PI * 2)]);

export const cwRnd = (i: number, seed = 1) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const cwLineR = (a: number) => {
  const c = Math.abs(Math.cos(a));
  return c > 1e-6 ? Math.min(CW_R, CW_CORNER / c) : CW_R;
};

export type CornerWatchMark = { x: number; y: number; made: boolean; k: number };

/** 2025-26: 49 long twos per 1,000 shots (BBR League Average .049), made at .401: 20 made, 29 missed. The last one
 * (index 48) is placed on purpose, clear of the stanchion, where its "0.80" can be read. */
export function cwLongTwos(): CornerWatchMark[] {
  const out: CornerWatchMark[] = [];
  let id = 0;
  while (out.length < 48 && id < 20000) {
    id++;
    const a = -0.2 + cwRnd(id, 31) * (Math.PI + 0.4);
    const r = CW_R16 + 0.5 + cwRnd(id, 32) * (cwLineR(a) - 1.0 - CW_R16);
    const x = r * Math.cos(a), y = r * Math.sin(a);
    if (y < CW_BASE + 0.6 || Math.abs(x) < 3.2) continue; // the stanchion hides the middle from this seat
    if (out.some((m) => Math.hypot(m.x - x, m.y - y) < 1.5)) continue;
    out.push({ x, y, made: false, k: cwRnd(id, 33) });
  }
  out.push({ x: -13.2, y: 13.4, made: true, k: 1 });
  // 20 made of 49 (.401): spread through the order
  const madeIdx = new Set(Array.from({ length: 19 }, (_, i) => Math.floor((i * 48) / 19 + 1) % 48));
  out.forEach((m, i) => {
    if (i < 48) m.made = madeIdx.has(i);
  });
  return out;
}

export const cwClamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const cwLin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const cwLerpPt = (a: CornerWatchPt, b: CornerWatchPt, t: number): CornerWatchPt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

export const CW_APRON = 3;

/** svg path of a circle arc in world coords, angles in radians (0 = +x, ccw) */
export function cwArcPath(cx: number, cy: number, r: number, a0: number, a1: number, n = 64) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(4)} ${(cy + r * Math.sin(a)).toFixed(4)}`;
  }
  return d;
}
