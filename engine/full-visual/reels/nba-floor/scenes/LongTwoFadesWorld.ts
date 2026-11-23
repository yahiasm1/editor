// Scene `history`: its world. The same half court as every scene (plan.md, "Thread object"): feet, origin = middle of
// the basket, +x right, +y toward half court, seen straight down; world (cx, cy) sits at screen (540, LTF_SCREEN_Y).
// The league's 22 seasons (Basketball-Reference League Average rows, assets/refs/pages/bbref-league-shooting-*.json)
// become 1,000 attempt marks, each one 0.1% of every shot, that keep their identity from season to season and move
// only when the shares say they must.
import { interpolate } from "remotion";

export type LongTwoFadesCam = { cx: number; cy: number; ppf: number };

export const LTF_LINE = 1 / 6;
export const LTF_R = 23.75;
export const LTF_CORNER = 22;
export const LTF_SIDE = 25;
export const LTF_BASE = -5.25;
export const LTF_HALF = 41.75;
export const LTF_APRON = 3;
export const LTF_KINK_Y = Math.sqrt(LTF_R * LTF_R - LTF_CORNER * LTF_CORNER); // 8.95
export const LTF_KINK_A = Math.atan2(LTF_KINK_Y, LTF_CORNER);
export const LTF_R16 = 16;
export const LTF_SCREEN_Y = 990;
export const LTF_N = 1000;

/** the ARC FRAME: baseline at screen y 1395, sidelines at x 60 and 1020 */
export const LTF_ARC: LongTwoFadesCam = { cx: 0, cy: LTF_BASE + (1395 - LTF_SCREEN_Y) / 19.2, ppf: 19.2 };
/** the mount: a little closer, the band and both corners filling the stage */
export const LTF_IN: LongTwoFadesCam = { cx: 0, cy: LTF_BASE + (1440 - LTF_SCREEN_Y) / 22.4, ppf: 22.4 };

export const ltfP = (c: LongTwoFadesCam, x: number, y: number) => ({ x: 540 + (x - c.cx) * c.ppf, y: LTF_SCREEN_Y - (y - c.cy) * c.ppf });
export const ltfTransform = (c: LongTwoFadesCam) =>
  `translate(540 ${LTF_SCREEN_Y}) scale(${c.ppf.toFixed(4)} ${(-c.ppf).toFixed(4)}) translate(${(-c.cx).toFixed(4)} ${(-c.cy).toFixed(4)})`;

export function ltfCamMix(a: LongTwoFadesCam, b: LongTwoFadesCam, t: number): LongTwoFadesCam {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const ppf = Math.exp(Math.log(a.ppf) + (Math.log(b.ppf) - Math.log(a.ppf)) * t);
  const w = Math.abs(1 / b.ppf - 1 / a.ppf) < 1e-9 ? t : (1 / ppf - 1 / a.ppf) / (1 / b.ppf - 1 / a.ppf);
  return { cx: a.cx + (b.cx - a.cx) * w, cy: a.cy + (b.cy - a.cy) * w, ppf };
}

export const ltfRnd = (i: number, seed = 1) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const gauss = (i: number, seed: number) => {
  const u = Math.max(1e-6, ltfRnd(i, seed)), v = ltfRnd(i, seed + 0.5);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
export const ltfClamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const ltfLerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ltfLin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export function ltfArcPath(cx: number, cy: number, r: number, a0: number, a1: number, n = 64) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(4)} ${(cy + r * Math.sin(a)).toFixed(4)}`;
  }
  return d;
}

/** the three-point line's distance from the basket along a direction */
export function ltfLineR(a: number) {
  const c = Math.abs(Math.cos(a));
  return c > 1e-6 ? Math.min(LTF_R, LTF_CORNER / c) : LTF_R;
}

/** BBR's 16-3P band: the 16 ft ring out to the line, baseline to baseline */
export function ltfBandPath() {
  const n = 90;
  const pts: string[] = [];
  const a0 = -Math.asin(-LTF_BASE / LTF_R16), a1 = Math.PI - a0;
  pts.push(`M${LTF_CORNER} ${LTF_BASE}`);
  pts.push(`L${LTF_CORNER} ${LTF_KINK_Y.toFixed(4)}`);
  for (let k = 0; k <= n; k++) {
    const a = LTF_KINK_A + ((Math.PI - 2 * LTF_KINK_A) * k) / n;
    pts.push(`L${(LTF_R * Math.cos(a)).toFixed(4)} ${(LTF_R * Math.sin(a)).toFixed(4)}`);
  }
  pts.push(`L${-LTF_CORNER} ${LTF_BASE}`);
  for (let k = 0; k <= n; k++) {
    const a = a1 - ((a1 - a0) * k) / n;
    pts.push(`L${(LTF_R16 * Math.cos(a)).toFixed(4)} ${(LTF_R16 * Math.sin(a)).toFixed(4)}`);
  }
  return pts.join(" ") + "Z";
}

/** the gold 21 in sliver: between the corner line and the 23'9" circle, baseline to the kink */
export function ltfSliverPath(side: 1 | -1) {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const y = LTF_BASE + ((LTF_KINK_Y - LTF_BASE) * i) / 40;
    pts.push(`${(side * Math.sqrt(LTF_R * LTF_R - y * y)).toFixed(4)} ${y.toFixed(4)}`);
  }
  return `M${side * LTF_CORNER} ${LTF_BASE} L${pts.join(" L")} L${side * LTF_CORNER} ${LTF_KINK_Y} Z`;
}

// ---------------------------------------------------------------------------------------------------------------
// The record: Basketball-Reference League Average, % of FGA by distance, every season 2004-05 .. 2025-26.
// [season, 0-3 ft, 3-10 ft, 10-16 ft, 16 ft to the line, threes, share of threes from the corner]
const LTF_RECORD: [string, number, number, number, number, number, number][] = [
  ["2004-05", 0.304, 0.135, 0.129, 0.236, 0.196, 0.272],
  ["2005-06", 0.309, 0.133, 0.119, 0.236, 0.202, 0.27],
  ["2006-07", 0.314, 0.131, 0.113, 0.229, 0.213, 0.271],
  ["2007-08", 0.308, 0.124, 0.111, 0.235, 0.222, 0.264],
  ["2008-09", 0.314, 0.124, 0.111, 0.227, 0.224, 0.274],
  ["2009-10", 0.32, 0.129, 0.11, 0.218, 0.222, 0.258],
  ["2010-11", 0.276, 0.178, 0.11, 0.214, 0.222, 0.27],
  ["2011-12", 0.287, 0.169, 0.11, 0.208, 0.226, 0.261],
  ["2012-13", 0.293, 0.164, 0.107, 0.193, 0.243, 0.268],
  ["2013-14", 0.286, 0.169, 0.105, 0.18, 0.259, 0.248],
  ["2014-15", 0.29, 0.164, 0.103, 0.175, 0.268, 0.254],
  ["2015-16", 0.293, 0.158, 0.103, 0.162, 0.285, 0.248],
  ["2016-17", 0.29, 0.152, 0.099, 0.142, 0.316, 0.228],
  ["2017-18", 0.281, 0.156, 0.106, 0.12, 0.337, 0.208],
  ["2018-19", 0.292, 0.162, 0.096, 0.092, 0.359, 0.214],
  ["2019-20", 0.282, 0.165, 0.093, 0.077, 0.384, 0.211],
  ["2020-21", 0.254, 0.186, 0.096, 0.072, 0.392, 0.222],
  ["2021-22", 0.239, 0.193, 0.094, 0.07, 0.399, 0.235],
  ["2022-23", 0.245, 0.206, 0.096, 0.063, 0.387, 0.237],
  ["2023-24", 0.241, 0.211, 0.096, 0.058, 0.395, 0.244],
  ["2024-25", 0.226, 0.214, 0.091, 0.048, 0.421, 0.243],
  ["2025-26", 0.231, 0.209, 0.095, 0.049, 0.415, 0.246],
];
export const LTF_SEASONS = LTF_RECORD.map((r) => r[0]);
/** the long two's share, the number on screen */
export const LTF_LONG2 = LTF_RECORD.map((r) => r[4]);

/** zones: 0 rim (0-3 ft), 1 3-10 ft, 2 10-16 ft, 3 long two, 4 corner three, 5 above the break */
export const LTF_Z_LONG2 = 3;
export const LTF_Z_CORNER = 4;

/** 1,000 marks split by a season's shares, largest remainder, so every count is the share x 1,000 */
function ltfCounts(r: (typeof LTF_RECORD)[number]) {
  const [, rim, s310, s1016, l2, three, corner] = r;
  const raw = [rim, s310, s1016, l2, three * corner, three * (1 - corner)];
  const sum = raw.reduce((a, b) => a + b, 0);
  const exact = raw.map((v) => (v / sum) * LTF_N);
  const c = exact.map(Math.floor);
  let left = LTF_N - c.reduce((a, b) => a + b, 0);
  // the long two is pinned to its exact share (236 ... 49): it is the number the voice says
  c[3] = Math.round(l2 * LTF_N);
  left = LTF_N - c.reduce((a, b) => a + b, 0);
  const order = [0, 1, 2, 4, 5].sort((a, b) => exact[b] - Math.floor(exact[b]) - (exact[a] - Math.floor(exact[a])));
  for (let k = 0; left !== 0; k = (k + 1) % order.length) {
    c[order[k]] += left > 0 ? 1 : -1;
    left += left > 0 ? -1 : 1;
  }
  return c;
}
export const LTF_COUNTS = LTF_RECORD.map(ltfCounts);

/** where mark i stands when it shoots from zone z: a real chart's spread for each band */
export function ltfSpot(z: number, i: number): [number, number] {
  const s = 100 + z * 17;
  const u = ltfRnd(i, s), v = ltfRnd(i, s + 1);
  if (z === 0) {
    // at the rim: all around the ring, under it from the baseline sides too, never behind the board
    const r = 0.3 + 2.7 * Math.sqrt(u), a = -0.75 + v * (Math.PI + 1.5);
    return [r * Math.cos(a), Math.max(-1.05 + ltfRnd(i, s + 2) * 0.3, r * Math.sin(a))];
  }
  if (z === 1 || z === 2) {
    const r0 = z === 1 ? 3.1 : 10.1, r1 = z === 1 ? 9.9 : 15.9;
    const r = Math.sqrt(r0 * r0 + u * (r1 * r1 - r0 * r0));
    const lim = z === 1 ? 0.42 : 0.3;
    const a = -lim + v * (Math.PI + 2 * lim);
    return [r * Math.cos(a), Math.max(LTF_BASE + 0.4, r * Math.sin(a))];
  }
  if (z === 3) {
    const aMin = -Math.asin(4.95 / LTF_R16), aMax = Math.PI - aMin;
    const pick = ltfRnd(i, s + 2);
    let a: number;
    if (pick < 0.22) a = Math.PI / 4 + (ltfRnd(i, s + 3) < 0.5 ? 0 : Math.PI / 2) + gauss(i, s + 4) * 0.16;
    else if (pick < 0.4) a = (ltfRnd(i, s + 5) < 0.5 ? 0.02 : Math.PI - 0.02) + gauss(i, s + 6) * 0.2;
    else a = aMin + u * (aMax - aMin);
    const rl = ltfLineR(a) - 0.3;
    const r = v < 0.35 ? rl - Math.abs(gauss(i, s + 7)) * 0.5 : Math.sqrt(LTF_R16 * LTF_R16 + ltfRnd(i, s + 8) * (rl * rl - LTF_R16 * LTF_R16));
    let x = r * Math.cos(a), y = r * Math.sin(a);
    x = Math.max(-LTF_CORNER + 0.3, Math.min(LTF_CORNER - 0.3, x));
    y = Math.max(LTF_BASE + 0.35, y);
    return [x, y];
  }
  if (z === 4) {
    const side = ltfRnd(i, s + 2) < 0.5 ? -1 : 1;
    const x = side * Math.min(LTF_SIDE - 0.3, LTF_CORNER + 0.35 + Math.abs(gauss(i, s + 3)) * 0.8);
    const y = LTF_BASE + 0.35 + Math.pow(u, 1.35) * (LTF_KINK_Y - 0.4 - LTF_BASE - 0.35);
    return [x, y];
  }
  // above the break: hugging the arc, thickest at the wings and the top, a few from deep
  const a = LTF_KINK_A + 0.04 + u * (Math.PI - 2 * LTF_KINK_A - 0.08);
  const deep = ltfRnd(i, s + 4) < 0.12 ? 2 + ltfRnd(i, s + 5) * 5 : 0;
  const r = LTF_R + 0.35 + Math.abs(gauss(i, s + 3)) * 1.1 + deep;
  const x = Math.max(-LTF_SIDE + 0.3, Math.min(LTF_SIDE - 0.3, r * Math.cos(a)));
  return [x, Math.max(LTF_KINK_Y + 0.2, r * Math.sin(a))];
}

/** each mark's zone in each season: the first season dealt out at random, then from season to season only the
 *  marks a shrinking zone gives up move, each to the growing zone nearest where it stood (the band empties outward
 *  into the threes and inward toward the rim). */
export function ltfAssign(): number[][] {
  const out: number[][] = [];
  const order = Array.from({ length: LTF_N }, (_, i) => i).sort((a, b) => ltfRnd(a, 501) - ltfRnd(b, 501));
  const z0 = new Array<number>(LTF_N);
  let k = 0;
  LTF_COUNTS[0].forEach((c, z) => {
    for (let j = 0; j < c; j++) z0[order[k++]] = z;
  });
  out.push(z0);
  for (let s = 1; s < LTF_COUNTS.length; s++) {
    const prev = out[s - 1];
    const cur = prev.slice();
    const need = LTF_COUNTS[s].map((c, z) => c - LTF_COUNTS[s - 1][z]);
    const freed: number[] = [];
    need.forEach((d, z) => {
      if (d >= 0) return;
      const members = cur.map((zz, i) => (zz === z ? i : -1)).filter((i) => i >= 0).sort((a, b) => ltfRnd(a, 600 + s) - ltfRnd(b, 600 + s));
      for (let j = 0; j < -d; j++) freed.push(members[j]);
    });
    const pairs: [number, number, number][] = [];
    for (const i of freed) {
      const [x0, y0] = ltfSpot(cur[i], i);
      need.forEach((d, z) => {
        if (d <= 0) return;
        const [x1, y1] = ltfSpot(z, i);
        pairs.push([Math.hypot(x1 - x0, y1 - y0) + ltfRnd(i * 7 + z, 700 + s) * 3, i, z]);
      });
    }
    pairs.sort((a, b) => a[0] - b[0]);
    const room = need.map((d) => Math.max(0, d));
    const done = new Set<number>();
    for (const [, i, z] of pairs) {
      if (done.has(i) || room[z] <= 0) continue;
      cur[i] = z;
      room[z]--;
      done.add(i);
    }
    out.push(cur);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// The un-tilt: a homography from the floor's world feet to the 2005 Garden photo's pixels, fitted on the Knicks'
// orange key (16 x 19 ft) and checked by drawing the 23'9" arc and the sidelines back onto the photo.
export const LTF_MSG_W = 1600;
export const LTF_MSG_H = 1200;
const MSG_KEY_WORLD: [number, number][] = [[-8, -5.25], [-8, 13.75], [8, 13.75], [8, -5.25]];
const MSG_KEY_PHOTO: [number, number][] = [[240, 623.3], [501.7, 598.3], [636.7, 651.7], [360, 688.3]];

export type LtfH = number[]; // row-major 3x3

/** the homography taking 4 points onto 4 points (direct linear solve, h33 = 1) */
export function ltfHomography(src: [number, number][], dst: [number, number][]): LtfH {
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
  const h = A.map((row, i) => row[8] / row[i]);
  return [...h, 1];
}
export const ltfApply = (H: LtfH, x: number, y: number): [number, number] => {
  const w = H[6] * x + H[7] * y + H[8];
  return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
};
export const LTF_MSG_H_WORLD = ltfHomography(MSG_KEY_WORLD, MSG_KEY_PHOTO);
/** CSS matrix3d for a homography acting on an element's own pixels (transform-origin 0 0) */
export const ltfMatrix3d = (H: LtfH) => {
  const n = (v: number) => v.toFixed(9);
  return `matrix3d(${n(H[0])},${n(H[3])},0,${n(H[6])},${n(H[1])},${n(H[4])},0,${n(H[7])},0,0,1,0,${n(H[2])},${n(H[5])},0,${n(H[8])})`;
};
