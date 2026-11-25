// Scene `points`: its world, copied from RulebookArcWorld so the floor is the same object.
// One NBA half court in feet (plan.md, "Thread object"): origin = middle of the basket, +x right, +y toward half
// court. Seen straight down by an orthographic camera: the world point (cx, cy) sits at screen (540, PPS_SCREEN_Y)
// and one foot is ppf pixels. Baseline at the bottom of the screen, the arc opening upward.
import { interpolate } from "remotion";

export type PointsPerShotCam = { cx: number; cy: number; ppf: number; dx: number; dy: number };

export const PPS_LINE = 1 / 6; // 2 in paint
export const PPS_R = 23.75; // the arc, to its outer edge
export const PPS_CORNER = 22; // outer edge of the straight corner line
export const PPS_SIDE = 25; // sideline inner edge
export const PPS_BASE = -5.25;
export const PPS_HALF = 41.75;
export const PPS_APRON = 3;
export const PPS_KINK_Y = Math.sqrt(PPS_R * PPS_R - PPS_CORNER * PPS_CORNER); // 8.95
export const PPS_KINK_A = Math.atan2(PPS_KINK_Y, PPS_CORNER); // 0.386 rad from the rim-level axis
export const PPS_SCREEN_Y = 990;

/** where `percent` leaves the floor: top-down, aprons in view, baseline at y 1290, 18.2 px/ft (LeagueTable's LT_NUM) */
export const PPS_START: PointsPerShotCam = { cx: 0, cy: PPS_BASE + (1290 - PPS_SCREEN_Y) / 18.2, ppf: 18.2, dx: 0, dy: 0 };
/** down into the right corner: the 3 ft strip from the baseline (y 1440) to the kink, the long-two floor to its left */
export const PPS_CORNER_CAM: PointsPerShotCam = { cx: 18.6, cy: PPS_BASE + (1440 - PPS_SCREEN_Y) / 62, ppf: 62, dx: 0, dy: 0 };
/** the whole band: both corner lines in, baseline at y 1400, numbers above the arc */
export const PPS_BAND: PointsPerShotCam = { cx: -0.5, cy: PPS_BASE + (1404 - PPS_SCREEN_Y) / 17.8, ppf: 17.8, dx: 0, dy: 0 };
/** the long two's ring, 16 ft from the middle of the basket */
export const PPS_R16 = 16;
/** Basketball-Reference, 2025-26 League Average: Corner 3P% and FG% 16-3P */
export const PPS_CORNER_PCT = 0.387;
export const PPS_LONG2_PCT = 0.401;
export const PPS_N = 1000;

/** world -> screen */
export const ppsP = (c: PointsPerShotCam, x: number, y: number) => ({
  x: 540 + c.dx + (x - c.cx) * c.ppf,
  y: PPS_SCREEN_Y + c.dy - (y - c.cy) * c.ppf,
});

/** the svg transform that puts world feet on screen */
export const ppsTransform = (c: PointsPerShotCam) =>
  `translate(${(540 + c.dx).toFixed(2)} ${(PPS_SCREEN_Y + c.dy).toFixed(2)}) scale(${c.ppf.toFixed(4)} ${(-c.ppf).toFixed(4)}) translate(${(-c.cx).toFixed(4)} ${(-c.cy).toFixed(4)})`;

/** a zoom that travels straight at its target: position follows 1/ppf, so nothing drifts sideways */
export function ppsCamMix(a: PointsPerShotCam, b: PointsPerShotCam, t: number): PointsPerShotCam {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const ppf = Math.exp(Math.log(a.ppf) + (Math.log(b.ppf) - Math.log(a.ppf)) * t);
  const w = Math.abs(1 / b.ppf - 1 / a.ppf) < 1e-9 ? t : (1 / ppf - 1 / a.ppf) / (1 / b.ppf - 1 / a.ppf);
  return { cx: a.cx + (b.cx - a.cx) * w, cy: a.cy + (b.cy - a.cy) * w, ppf, dx: a.dx + (b.dx - a.dx) * t, dy: a.dy + (b.dy - a.dy) * t };
}

/** deterministic noise */
export const ppsRnd = (i: number, seed = 1) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** svg path of a circle arc in world coords, angles in radians (0 = +x, ccw) */
export function ppsArcPath(cx: number, cy: number, r: number, a0: number, a1: number, n = 64) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(4)} ${(cy + r * Math.sin(a)).toFixed(4)}`;
  }
  return d;
}

export const ppsClamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const ppsLerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ppsLin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** feet and inches as the tape reads them: 23' 9" */
export function ppsFeetInches(ft: number) {
  let feet = Math.floor(ft + 1e-6);
  let inch = Math.round((ft - feet) * 12);
  if (inch >= 12) {
    feet += 1;
    inch = 0;
  }
  return `${feet}' ${inch}"`;
}

/** the three-point line's distance from the basket along a direction (radians from the rim-level axis, ccw) */
export function ppsLineR(a: number) {
  const c = Math.abs(Math.cos(a));
  return c > 1e-6 ? Math.min(PPS_R, PPS_CORNER / c) : PPS_R;
}

const gauss = (i: number, seed: number) => {
  const u = Math.max(1e-6, ppsRnd(i, seed)), v = ppsRnd(i, seed + 0.5);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

/** n of the shots are makes, spread evenly through the order the shots fall in (so makes appear at the real rate as
 *  the zone fills), and picked so the pattern is not regular */
function ppsMakes(n: number, made: number, seed: number) {
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => ppsRnd(a, seed) - ppsRnd(b, seed));
  const isMade = new Array<boolean>(n).fill(false);
  for (let k = 0; k < made; k++) isMade[order[k]] = true;
  return isMade;
}

export type PpsShot = { x: number; y: number; made: boolean; k: number; flip: number };

/** 1,000 corner threes in the right corner, placed like a real chart: tight behind the straight line, thickest from
 *  the baseline to a little above rim level. k (0..1) is the order they fall in, baseline first. */
export function ppsCornerShots(): PpsShot[] {
  const made = ppsMakes(PPS_N, Math.round(PPS_N * PPS_CORNER_PCT), 71);
  const out: PpsShot[] = [];
  for (let i = 0; i < PPS_N; i++) {
    const x = Math.min(PPS_SIDE - 0.28, PPS_CORNER + 0.32 + Math.abs(gauss(i, 3)) * 0.85);
    let y = 0.6 + gauss(i, 7) * 3.6;
    if (y < PPS_BASE + 0.35) y = PPS_BASE + 0.35 + ppsRnd(i, 9) * 2.5;
    if (y > PPS_KINK_Y - 0.4) y = PPS_KINK_Y - 0.4 - ppsRnd(i, 10) * 4;
    out.push({ x, y, made: made[i], k: 0, flip: ppsRnd(i, 12) });
  }
  const ys = out.map((s) => s.y);
  const lo = Math.min(...ys), hi = Math.max(...ys);
  for (let i = 0; i < out.length; i++) out[i].k = Math.min(1, Math.max(0, ((out[i].y - lo) / (hi - lo)) * 0.85 + ppsRnd(i, 14) * 0.15));
  return out;
}

/** 1,000 long twos: between the 16 ft ring and the line, in bounds. Thickest just inside the line (a foot on it), at
 *  the elbows and along the baseline, as on real charts. k is the order they fall in, from the ring out. */
export function ppsLongTwoShots(): PpsShot[] {
  const made = ppsMakes(PPS_N, Math.round(PPS_N * PPS_LONG2_PCT), 93);
  const out: PpsShot[] = [];
  const aMin = -Math.asin(5.0 / PPS_R16), aMax = Math.PI - aMin;
  let i = 0, j = 0;
  while (out.length < PPS_N && j < 20000) {
    j++;
    const pick = ppsRnd(j, 21);
    let a: number;
    if (pick < 0.22) a = Math.PI / 4 + (ppsRnd(j, 22) < 0.5 ? 0 : Math.PI / 2) + gauss(j, 23) * 0.16; // elbows
    else if (pick < 0.4) a = (ppsRnd(j, 24) < 0.5 ? 0.02 : Math.PI - 0.02) + gauss(j, 25) * 0.22; // baseline
    else a = aMin + ppsRnd(j, 26) * (aMax - aMin);
    const rl = ppsLineR(a) - 0.25;
    if (rl <= PPS_R16 + 0.3) continue;
    const u = ppsRnd(j, 27);
    // a third ride the line, the rest spread through the band by area
    const r = u < 0.33 ? rl - Math.abs(gauss(j, 28)) * 0.45 : Math.sqrt(PPS_R16 * PPS_R16 + ppsRnd(j, 29) * (rl * rl - PPS_R16 * PPS_R16));
    const x = r * Math.cos(a), y = r * Math.sin(a);
    if (r < PPS_R16 + 0.25 || y < PPS_BASE + 0.3 || Math.abs(x) > PPS_CORNER - 0.25) continue;
    out.push({ x, y, made: made[i], k: Math.min(1, Math.max(0, (r - PPS_R16) / (PPS_R - PPS_R16) * 0.8 + ppsRnd(j, 30) * 0.2)), flip: ppsRnd(j, 31) });
    i++;
  }
  return out;
}

/** the long-two band as an svg path in world feet: the 16 ft ring, out to the line, the corner lines, the baseline */
export function ppsBandPath() {
  const n = 90;
  const pts: string[] = [];
  const a0 = -Math.asin(-PPS_BASE / PPS_R16), a1 = Math.PI - a0;
  // outer edge: from the right baseline corner up the straight line, around the arc, down the left line
  pts.push(`M${PPS_CORNER} ${PPS_BASE}`);
  pts.push(`L${PPS_CORNER} ${PPS_KINK_Y.toFixed(4)}`);
  for (let k = 0; k <= n; k++) {
    const a = PPS_KINK_A + ((Math.PI - 2 * PPS_KINK_A) * k) / n;
    pts.push(`L${(PPS_R * Math.cos(a)).toFixed(4)} ${(PPS_R * Math.sin(a)).toFixed(4)}`);
  }
  pts.push(`L${-PPS_CORNER} ${PPS_BASE}`);
  // inner edge: the 16 ft ring back, from the left baseline to the right
  for (let k = 0; k <= n; k++) {
    const a = a1 - ((a1 - a0) * k) / n;
    pts.push(`L${(PPS_R16 * Math.cos(a)).toFixed(4)} ${(PPS_R16 * Math.sin(a)).toFixed(4)}`);
  }
  pts.push("Z");
  return pts.join(" ");
}
