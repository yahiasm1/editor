// One NBA half court in feet (plan.md, "Thread object"): origin = middle of the basket, +x right, +y toward half
// court, z up. Baseline y = -5.25, sidelines x = +/-25 (inner edge; the 2 in line is out of bounds), half court 41.75.
// Two ways to put the floor on screen:
// - a top-down pinhole camera (real parallax: the ring 10 ft up is bigger than the floor under it);
// - a plane homography, used while the real Ball Arena floor is lifted out of the photo and turned flat.
// Both give the same answer for floor points once the lift has landed.

export type FfwCam = { tx: number; ty: number; D: number; F: number; cx: number; cy: number };
export type FfwPt = { x: number; y: number; s: number };
export type FfwProj = (x: number, y: number, z?: number) => FfwPt;
export type FfwH = number[]; // 3x3 row-major

export const FFW_LINE = 1 / 6; // 2 in paint
export const FFW_SIDE = 25;
export const FFW_BASE = -5.25;
export const FFW_HALF = 41.75;
export const FFW_APRON = 3;
export const FFW_ARC_R = 23.75;
export const FFW_CORNER_X = 22;
export const FFW_KINK_Y = Math.sqrt(FFW_ARC_R * FFW_ARC_R - FFW_CORNER_X * FFW_CORNER_X); // 8.95

/** court (ft) -> photo px for commons-ball-arena-gsw-den-2026 (1280x960), fitted on both lanes' corners and the
 *  centre circle (9 points, max error ~7 px); +x is the near sideline, the left basket is our basket */
export const FFW_PHOTO_H: FfwH = [
  -0.4632591165558513, 6.249325461797435, 543.8806854371038,
  -0.825826303596407, 0.8615084765410006, 724.8104177481719,
  -0.0037993847335558773, 0.0026474323161898433, 1.0,
];

export const ffwCamProj = (c: FfwCam): FfwProj => (x, y, z = 0) => {
  const s = c.F / Math.max(0.5, c.D - z);
  return { x: c.cx + s * (x - c.tx), y: c.cy - s * (y - c.ty), s };
};

export const ffwApplyH = (H: FfwH, x: number, y: number): [number, number] => {
  const w = H[6] * x + H[7] * y + H[8];
  return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
};

/** a homography as a floor projector (z is ignored: the floor is the plane); s from the local Jacobian */
export const ffwHProj = (H: FfwH): FfwProj => (x, y) => {
  const [px, py] = ffwApplyH(H, x, y);
  const [ax, ay] = ffwApplyH(H, x + 0.5, y);
  const [bx, by] = ffwApplyH(H, x, y + 0.5);
  const det = Math.abs((ax - px) * (by - py) - (ay - py) * (bx - px)) * 4;
  return { x: px, y: py, s: Math.sqrt(det) };
};

/** the homography taking four source points to four destination points */
export function ffwHomography(src: [number, number][], dst: [number, number][]): FfwH {
  const A: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i], [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  // Gaussian elimination on the 8x9 augmented matrix
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    const d = A[c][c] || 1e-12;
    for (let k = c; k < 9; k++) A[c][k] /= d;
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const m = A[r][c];
      if (!m) continue;
      for (let k = c; k < 9; k++) A[r][k] -= m * A[c][k];
    }
  }
  return [A[0][8], A[1][8], A[2][8], A[3][8], A[4][8], A[5][8], A[6][8], A[7][8], 1];
}

export const ffwMulH = (a: FfwH, b: FfwH): FfwH => {
  const o: number[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o.push(a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c]);
  return o;
};

export const ffwInvH = (m: FfwH): FfwH => {
  const [a, b, c, d, e, f, g, h, i] = m;
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
  const det = a * A + b * B + c * C;
  return [A / det, -(b * i - c * h) / det, (b * f - c * e) / det, B / det, (a * i - c * g) / det, -(a * f - c * d) / det, C / det, -(a * h - b * g) / det, (a * e - b * d) / det];
};

/** CSS matrix3d for a 2D homography (element-local px -> screen px), transform-origin 0 0 */
export const ffwMatrix3d = (m: FfwH) =>
  `matrix3d(${[m[0], m[3], 0, m[6], m[1], m[4], 0, m[7], 0, 0, 1, 0, m[2], m[5], 0, m[8]].map((v) => v.toPrecision(10)).join(",")})`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ffwLerp = lerp;

export function ffwMixCam(a: FfwCam, b: FfwCam, t: number): FfwCam {
  return {
    tx: lerp(a.tx, b.tx, t),
    ty: lerp(a.ty, b.ty, t),
    D: Math.exp(lerp(Math.log(a.D), Math.log(b.D), t)),
    F: Math.exp(lerp(Math.log(a.F), Math.log(b.F), t)),
    cx: lerp(a.cx, b.cx, t),
    cy: lerp(a.cy, b.cy, t),
  };
}

/** four screen corners travelling from a to b: centroid moves, each corner turns about it (the angle change nearest
 *  `turn`) and its radius grows in log space, so the quad rotates and opens instead of folding through itself */
export function ffwTurnQuad(a: [number, number][], b: [number, number][], t: number, turn: number, lift = 0): [number, number][] {
  const ca = a.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]);
  const cb = b.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]);
  const c = [lerp(ca[0], cb[0], t), lerp(ca[1], cb[1], t)];
  return a.map((p, i) => {
    const q = b[i];
    const a0 = Math.atan2(p[1] - ca[1], p[0] - ca[0]);
    const a1 = Math.atan2(q[1] - cb[1], q[0] - cb[0]);
    let d = a1 - a0;
    while (d - turn > Math.PI) d -= 2 * Math.PI;
    while (d - turn < -Math.PI) d += 2 * Math.PI;
    const r0 = Math.max(1, Math.hypot(p[0] - ca[0], p[1] - ca[1]));
    const r1 = Math.max(1, Math.hypot(q[0] - cb[0], q[1] - cb[1]));
    const r = Math.exp(lerp(Math.log(r0), Math.log(r1), t)) * (1 + lift);
    const ang = a0 + d * t;
    return [c[0] + r * Math.cos(ang), c[1] + r * Math.sin(ang)] as [number, number];
  });
}

/** a closed floor polygon as an svg path */
export function ffwPoly(P: FfwProj, pts: [number, number][], z = 0): string {
  let d = "";
  pts.forEach(([x, y], i) => {
    const p = P(x, y, z);
    d += `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  });
  return d + "Z";
}

/** a painted band of width w (ft) along a floor polyline; off shifts it sideways (+ = left of travel) */
export function ffwBand(P: FfwProj, pts: [number, number][], w: number, off = 0, z = 0): string {
  if (pts.length < 2) return "";
  const L: [number, number][] = [];
  const R: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    const nx = -dy / l, ny = dx / l;
    L.push([pts[i][0] + nx * (off + w / 2), pts[i][1] + ny * (off + w / 2)]);
    R.push([pts[i][0] + nx * (off - w / 2), pts[i][1] + ny * (off - w / 2)]);
  }
  return ffwPoly(P, [...L, ...R.reverse()], z);
}

export function ffwArc(cx: number, cy: number, r: number, a0: number, a1: number, n = 48): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return out;
}

export const ffwRnd = (i: number, seed = 1) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** feet as the tape writes it: 25' 0" */
export const ffwFeet = (ft: number) => {
  const tot = Math.max(0, Math.round(ft * 12));
  return `${Math.floor(tot / 12)}' ${tot % 12}"`;
};
