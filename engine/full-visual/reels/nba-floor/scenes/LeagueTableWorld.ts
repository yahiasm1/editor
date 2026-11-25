// One NBA half court in feet (plan.md, "Thread object"): origin = middle of the basket, +x right, +y toward half
// court, z up. One pinhole camera for the whole scene: it looks at a target on the floor from `D` feet away,
// tilted `pitch` from straight down and turned `yaw` about the vertical. Straight down (pitch 0) the floor is an
// exact scale (ppf px per foot, the same picture as the other scenes' top-down frames); tilted, the floor is put on
// screen by its real homography and the ring, board, balls are projected by the same camera.
import { interpolate } from "remotion";

export type LtCam = { tx: number; ty: number; D: number; pitch: number; yaw: number; ppf: number; sx: number; sy: number };

export const LT_LINE = 1 / 6; // 2 in paint
export const LT_R = 23.75; // the arc, to its outer edge
export const LT_CORNER = 22; // outer edge of the straight corner line
export const LT_SIDE = 25; // sideline inner edge
export const LT_BASE = -5.25;
export const LT_HALF = 41.75;
export const LT_APRON = 3;
export const LT_KINK_Y = Math.sqrt(LT_R * LT_R - LT_CORNER * LT_CORNER); // 8.95
export const LT_KINK_A = Math.atan2(LT_KINK_Y, LT_CORNER);
export const LT_SY = 990;
export const LT_GOLD = "#F2B33D";
export const LT_WHITE = "#F3F5F7";
export const LT_GREY = "#8B949E";

const FAR = 600; // a top-down camera sits this far up: the floor is a pure scale, a 10 ft rim grows 1.7 %

/** top-down: world (tx, ty) at screen (540, sy) */
export const ltFlat = (tx: number, ty: number, ppf: number, sy = LT_SY): LtCam => ({ tx, ty, D: FAR, pitch: 0, yaw: 0, ppf, sx: 540, sy });

/** the arc scene's last frame: baseline at y 1420, 17.8 px/ft */
export const LT_START = ltFlat(-0.5, LT_BASE + (1420 - LT_SY) / 17.8, 17.8);
/** the floor for the numbers: aprons in view, baseline at y 1290 */
export const LT_NUM = ltFlat(0, LT_BASE + (1290 - LT_SY) / 18.2, 18.2);

/** camera basis */
function ltBasis(c: LtCam) {
  const sp = Math.sin(c.pitch), cp = Math.cos(c.pitch), sy = Math.sin(c.yaw), cy = Math.cos(c.yaw);
  const fwd = [sp * sy, sp * cy, -cp];
  const right = [cy, -sy, 0];
  // down = fwd x right
  const down = [fwd[1] * right[2] - fwd[2] * right[1], fwd[2] * right[0] - fwd[0] * right[2], fwd[0] * right[1] - fwd[1] * right[0]];
  const C = [c.tx - c.D * sp * sy, c.ty - c.D * sp * cy, c.D * cp];
  return { fwd, right, down, C, F: c.ppf * c.D };
}

/** world (feet, z up) -> screen px, with depth (for sizes: px per foot at that point) */
export function ltP(c: LtCam, x: number, y: number, z = 0) {
  const b = ltBasis(c);
  const v = [x - b.C[0], y - b.C[1], z - b.C[2]];
  const xc = b.right[0] * v[0] + b.right[1] * v[1] + b.right[2] * v[2];
  const yc = b.down[0] * v[0] + b.down[1] * v[1] + b.down[2] * v[2];
  const zc = Math.max(0.5, b.fwd[0] * v[0] + b.fwd[1] * v[1] + b.fwd[2] * v[2]);
  return { x: c.sx + (b.F * xc) / zc, y: c.sy + (b.F * yc) / zc, k: b.F / zc };
}

/** svg transform for a flat (pitch 0, yaw 0) camera: world feet -> screen */
export const ltFlatTransform = (c: LtCam) =>
  `translate(${c.sx.toFixed(2)} ${c.sy.toFixed(2)}) scale(${c.ppf.toFixed(4)} ${(-c.ppf).toFixed(4)}) translate(${(-c.tx).toFixed(4)} ${(-c.ty).toFixed(4)})`;

/** the floor sheet drawn for the tilted camera: world x0..x1, y0..y1 at S px per foot, then its CSS homography */
export const LT_SHEET = { x0: -30, x1: 30, y0: -10, y1: 46, S: 26 };
export const ltSheetTransform = () =>
  `scale(${LT_SHEET.S} ${-LT_SHEET.S}) translate(${-LT_SHEET.x0} ${-LT_SHEET.y1})`;
export function ltSheetMatrix(c: LtCam) {
  const b = ltBasis(c);
  const lin = (row: number[]) => ({ a: row[0], b: row[1], c: -(row[0] * b.C[0] + row[1] * b.C[1] + row[2] * b.C[2]) });
  const X = lin(b.right), Y = lin(b.down), Z = lin(b.fwd);
  // screen numerators: F*xc + sx*zc, F*yc + sy*zc; w = zc. All linear in (x, y, 1).
  const nx = { a: b.F * X.a + c.sx * Z.a, b: b.F * X.b + c.sx * Z.b, c: b.F * X.c + c.sx * Z.c };
  const ny = { a: b.F * Y.a + c.sy * Z.a, b: b.F * Y.b + c.sy * Z.b, c: b.F * Y.c + c.sy * Z.c };
  const S = LT_SHEET.S;
  // x = x0 + u/S, y = y1 - v/S
  const uv = (L: { a: number; b: number; c: number }) => [L.a / S, -L.b / S, L.a * LT_SHEET.x0 + L.b * LT_SHEET.y1 + L.c];
  const [a1, a2, a4] = uv(nx), [b1, b2, b4] = uv(ny), [d1, d2, d4] = uv(Z);
  const n = d4; // normalise so w ~ 1
  const m = [a1, b1, 0, d1, a2, b2, 0, d2, 0, 0, 1, 0, a4, b4, 0, d4].map((v, i) => (i === 10 ? 1 : v / n));
  return `matrix3d(${m.map((v) => v.toPrecision(9)).join(",")})`;
}

/** a camera move: angles and target linear in t, distance and scale in log, so a zoom travels straight */
export function ltCamMix(a: LtCam, b: LtCam, t: number): LtCam {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const lg = (p: number, q: number) => Math.exp(Math.log(p) + (Math.log(q) - Math.log(p)) * t);
  const ppf = lg(a.ppf, b.ppf);
  const w = Math.abs(1 / b.ppf - 1 / a.ppf) < 1e-9 ? t : (1 / ppf - 1 / a.ppf) / (1 / b.ppf - 1 / a.ppf);
  const L = (p: number, q: number) => p + (q - p) * t;
  return { tx: a.tx + (b.tx - a.tx) * w, ty: a.ty + (b.ty - a.ty) * w, D: lg(a.D, b.D), pitch: L(a.pitch, b.pitch), yaw: L(a.yaw, b.yaw), ppf, sx: L(a.sx, b.sx), sy: L(a.sy, b.sy) };
}

/** deterministic noise */
export const ltRnd = (i: number, seed = 1) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** svg path of a circle arc in world coords (0 = +x, ccw) */
export function ltArcPath(cx: number, cy: number, r: number, a0: number, a1: number, n = 64) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(4)} ${(cy + r * Math.sin(a)).toFixed(4)}`;
  }
  return d;
}

export const ltClamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const ltLin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** feet and inches as the tape reads them */
export function ltFeetInches(ft: number) {
  let feet = Math.floor(ft + 1e-6);
  let inch = Math.round((ft - feet) * 12);
  if (inch >= 12) {
    feet += 1;
    inch = 0;
  }
  return `${feet}' ${inch}"`;
}

/** the 21 in sliver: between the straight corner line and the 23'9" circle, baseline to the kink */
export function ltSliverPath(side: 1 | -1, p = 1) {
  const pts: string[] = [];
  const n = 40;
  for (let i = 0; i <= n; i++) {
    const y = LT_BASE + ((LT_KINK_Y - LT_BASE) * i) / n;
    const xc = Math.sqrt(LT_R * LT_R - y * y);
    pts.push(`${(side * (LT_CORNER + (xc - LT_CORNER) * p)).toFixed(4)} ${y.toFixed(4)}`);
  }
  return `M${side * LT_CORNER} ${LT_BASE} L${pts.join(" L")} L${side * LT_CORNER} ${LT_KINK_Y} Z`;
}

/** the corner three zone: corner line to sideline, baseline to the kink */
export const ltCornerStrip = (side: 1 | -1) => {
  const x0 = side > 0 ? LT_CORNER : -LT_SIDE;
  return `M${x0} ${LT_BASE}h3v${(LT_KINK_Y - LT_BASE).toFixed(4)}h-3Z`;
};

/** above the break: outside the arc, above the kink, sideline to sideline, up to `top` */
export function ltBreakRegion(top = 36) {
  let d = `M${-LT_SIDE} ${LT_KINK_Y} L${-LT_CORNER} ${LT_KINK_Y}`;
  const n = 90;
  for (let i = 0; i <= n; i++) {
    const a = Math.PI - LT_KINK_A + ((2 * LT_KINK_A - Math.PI) * i) / n;
    d += ` L${(LT_R * Math.cos(a)).toFixed(4)} ${(LT_R * Math.sin(a)).toFixed(4)}`;
  }
  d += ` L${LT_SIDE} ${LT_KINK_Y} L${LT_SIDE} ${top} L${-LT_SIDE} ${top} Z`;
  return d;
}
