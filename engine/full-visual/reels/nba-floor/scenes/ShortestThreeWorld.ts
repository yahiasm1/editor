// Scene `close`: its world, copied from PointsPerShotWorld (itself RulebookArcWorld) so the floor is the same object.
// One NBA half court in feet (plan.md, "Thread object"): origin = middle of the basket, +x right, +y toward half
// court. Seen straight down by an orthographic camera: the world point (cx, cy) sits at screen (540, ST_SCREEN_Y)
// and one foot is ppf pixels. Baseline at the bottom of the screen, the arc opening upward.
import { interpolate } from "remotion";

export type ShortestThreeCam = { cx: number; cy: number; ppf: number; dx: number; dy: number };

export const ST_LINE = 1 / 6; // 2 in paint
export const ST_R = 23.75; // the arc, to its outer edge
export const ST_CORNER = 22; // outer edge of the straight corner line
export const ST_SIDE = 25; // sideline inner edge
export const ST_BASE = -5.25;
export const ST_HALF = 41.75;
export const ST_APRON = 3;
export const ST_KINK_Y = Math.sqrt(ST_R * ST_R - ST_CORNER * ST_CORNER); // 8.95
export const ST_KINK_A = Math.atan2(ST_KINK_Y, ST_CORNER); // 0.386 rad from the rim-level axis
export const ST_SCREEN_Y = 990;

/** the ARC FRAME (plan.md): 50 ft across at 20.8 px/ft, sidelines at x 20 and 1060, baseline at y 1420 */
export const ST_ARC: ShortestThreeCam = { cx: 0, cy: ST_BASE + (1420 - ST_SCREEN_Y) / 20.8, ppf: 20.8, dx: 0, dy: 0 };
/** the floor lifted to make room for the teams on the aprons under the corners: baseline at y 1236 */
export const ST_TEAMS: ShortestThreeCam = { cx: 0, cy: ST_BASE + (1236 - ST_SCREEN_Y) / 19.5, ppf: 19.5, dx: 0, dy: 0 };
/** the last push: a little closer, the baseline held near y 1250 */
export const ST_LAST: ShortestThreeCam = { cx: 0, cy: ST_BASE + (1250 - ST_SCREEN_Y) / 20.2, ppf: 20.2, dx: 0, dy: 0 };
export const ST_N = 1000;
/** the long two starts 16 ft from the middle of the basket (BBR 16-3P) */
export const ST_R16 = 16;

/** world -> screen */
export const stP = (c: ShortestThreeCam, x: number, y: number) => ({
  x: 540 + c.dx + (x - c.cx) * c.ppf,
  y: ST_SCREEN_Y + c.dy - (y - c.cy) * c.ppf,
});

/** the svg transform that puts world feet on screen */
export const stTransform = (c: ShortestThreeCam) =>
  `translate(${(540 + c.dx).toFixed(2)} ${(ST_SCREEN_Y + c.dy).toFixed(2)}) scale(${c.ppf.toFixed(4)} ${(-c.ppf).toFixed(4)}) translate(${(-c.cx).toFixed(4)} ${(-c.cy).toFixed(4)})`;

/** a zoom that travels straight at its target: position follows 1/ppf, so nothing drifts sideways */
export function stCamMix(a: ShortestThreeCam, b: ShortestThreeCam, t: number): ShortestThreeCam {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const ppf = Math.exp(Math.log(a.ppf) + (Math.log(b.ppf) - Math.log(a.ppf)) * t);
  const w = Math.abs(1 / b.ppf - 1 / a.ppf) < 1e-9 ? t : (1 / ppf - 1 / a.ppf) / (1 / b.ppf - 1 / a.ppf);
  return { cx: a.cx + (b.cx - a.cx) * w, cy: a.cy + (b.cy - a.cy) * w, ppf, dx: a.dx + (b.dx - a.dx) * t, dy: a.dy + (b.dy - a.dy) * t };
}

/** deterministic noise */
export const stRnd = (i: number, seed = 1) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** svg path of a circle arc in world coords, angles in radians (0 = +x, ccw) */
export function stArcPath(cx: number, cy: number, r: number, a0: number, a1: number, n = 64) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(4)} ${(cy + r * Math.sin(a)).toFixed(4)}`;
  }
  return d;
}

export const stClamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const stLerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const stLin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** feet and inches as the tape reads them: 23' 9" */
export function stFeetInches(ft: number) {
  let feet = Math.floor(ft + 1e-6);
  let inch = Math.round((ft - feet) * 12);
  if (inch >= 12) {
    feet += 1;
    inch = 0;
  }
  return `${feet}' ${inch}"`;
}

/** the three-point line's distance from the basket along a direction (radians from the rim-level axis, ccw) */
export function stLineR(a: number) {
  const c = Math.abs(Math.cos(a));
  return c > 1e-6 ? Math.min(ST_R, ST_CORNER / c) : ST_R;
}

const gauss = (i: number, seed: number) => {
  const u = Math.max(1e-6, stRnd(i, seed)), v = stRnd(i, seed + 0.5);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

/** Basketball-Reference, 2025-26 League Average, %FGA by distance (threes split by Corner %3PA .246) */
export const ST_SHARES = { rim: 0.231, d310: 0.209, d1016: 0.095, long2: 0.049, corner: 0.102, above: 0.313 };

export type StMark = { x: number; y: number; zone: "rim" | "d310" | "d1016" | "long2" | "corner" | "above"; side: 1 | -1; k: number };

/** 1,000 attempts lying where the league took them in 2025-26: one mark per 0.1% of all shots */
export function stLeagueMarks(): StMark[] {
  const out: StMark[] = [];
  const zones = Object.entries(ST_SHARES) as [StMark["zone"], number][];
  let id = 0;
  for (const [zone, share] of zones) {
    const n = Math.round(share * ST_N);
    let made = 0, j = 0;
    while (made < n && j < 50000) {
      j++;
      id++;
      const a = -0.22 + stRnd(id, 3) * (Math.PI + 0.44);
      let r = 0, x = 0, y = 0;
      if (zone === "rim") r = 0.9 + Math.abs(gauss(id, 4)) * 1.3;
      else if (zone === "d310") r = 3 + stRnd(id, 5) * 7;
      else if (zone === "d1016") r = 10 + stRnd(id, 6) * 6;
      else if (zone === "long2") r = ST_R16 + stRnd(id, 7) * (stLineR(a) - 0.3 - ST_R16);
      else if (zone === "above") {
        const aa = ST_KINK_A + 0.04 + stRnd(id, 8) * (Math.PI - 2 * ST_KINK_A - 0.08);
        r = ST_R + 0.35 + Math.abs(gauss(id, 9)) * 2.2;
        x = r * Math.cos(aa);
        y = r * Math.sin(aa);
      } else {
        const s = stRnd(id, 10) < 0.5 ? 1 : -1;
        x = s * Math.min(ST_SIDE - 0.3, ST_CORNER + 0.3 + Math.abs(gauss(id, 11)) * 0.8);
        y = Math.max(ST_BASE + 0.35, Math.min(ST_KINK_Y - 0.4, 0.6 + gauss(id, 12) * 3.6));
      }
      if (zone !== "above" && zone !== "corner") {
        x = r * Math.cos(a);
        y = r * Math.sin(a);
      }
      if (y < ST_BASE + 0.3 || Math.abs(x) > ST_SIDE - 0.25) continue;
      if (zone !== "corner" && zone !== "above" && r > stLineR(Math.atan2(y, x)) - 0.2) continue;
      out.push({ x, y, zone, side: x >= 0 ? 1 : -1, k: stRnd(id, 13) });
      made++;
    }
  }
  return out;
}
