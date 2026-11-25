// HalftimeBoos data: the Lakers' 49 first-half points in real order (BBR play-by-play), which of them were Kobe's
// and in which make, the faces in the stands photo, and where every bulb sits in each layout.
import scoring from "../assets/refs/kobe-81-scoring.json";
import faces from "../assets/refs/halftimeboos-faces.json";

type Ev = { q: number; clock: string; team: string; pts: number; kobe: boolean; tor: number; lal: number };
const events = (scoring as { events: Ev[] }).events;

export const HalftimeBoosParse = (c: string) => {
  const [m, s] = c.split(":");
  return Number(m) * 60 + Number(s);
};

/** the second quarter's scoring plays: seconds left, team, running score */
export const HalftimeBoosQ2 = events
  .filter((e) => e.q === 2)
  .map((e) => ({ secs: HalftimeBoosParse(e.clock), team: e.team, tor: e.tor, lal: e.lal }));

/** one entry per Lakers point, in the order they were scored. `make` is the index of Kobe's make (0..14) or -1 */
export type HalftimeBoosPoint = { kobe: boolean; make: number; q: number };
export const HalftimeBoosPoints: HalftimeBoosPoint[] = (() => {
  const out: HalftimeBoosPoint[] = [];
  let make = 0;
  for (const e of events) {
    if (e.q > 2 || e.team !== "LAL") continue;
    for (let i = 0; i < e.pts; i++) out.push({ kobe: e.kobe, make: e.kobe ? make : -1, q: e.q });
    if (e.kobe) make++;
  }
  return out;
})();
export const HalftimeBoosMakes = Math.max(...HalftimeBoosPoints.map((p) => p.make)) + 1; // 15

/** faces found in the stands crop (800 x 560 px of the 1024 original) */
export const HalftimeBoosFaces = faces as [number, number][];

/** a deterministic random in 0..1 */
export const HalftimeBoosRand = (i: number, salt = 0) => {
  const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

// ---- the seven-segment 49, as paths in the 60 x 100 cell of StaplesNightDigit
type Seg = [number, number, number, number];
const SEG: Record<string, Seg> = {
  a: [11, 6, 49, 6],
  g: [11, 50, 49, 50],
  d: [11, 94, 49, 94],
  f: [7, 9, 7, 47],
  b: [53, 9, 53, 47],
  e: [7, 53, 7, 91],
  c: [53, 53, 53, 91],
};
const PATH: [number, string[]][] = [
  [0, ["f", "g", "b", "c"]], // the 4
  [1, ["a", "f", "g", "b", "c", "d"]], // the 9
];

/** the 49 digit drawn huge on the stage: top-left corner, cell height */
export const HalftimeBoosDigitBig = { h: 540, top: 842 };
export const HalftimeBoosDigitGeom = (h: number) => {
  const dw = h * 0.6;
  const gap = h * 0.16;
  return { dw, gap, total: dw * 2 + gap };
};

/** where each of the 49 bulbs sits along the segments of the big 49 */
export const HalftimeBoosDigitSpots = (): { x: number; y: number }[] => {
  const { h, top } = HalftimeBoosDigitBig;
  const { dw, gap, total } = HalftimeBoosDigitGeom(h);
  const left = 540 - total / 2;
  const u = h / 100;
  const segs: { d: number; s: Seg }[] = [];
  for (const [d, names] of PATH) for (const n of names) segs.push({ d, s: SEG[n] });
  const L = 38;
  const n = HalftimeBoosPoints.length;
  const step = (segs.length * L) / n;
  const tan = Math.tan((4 * Math.PI) / 180);
  return HalftimeBoosPoints.map((_, k) => {
    const pos = (k + 0.5) * step;
    const si = Math.min(segs.length - 1, Math.floor(pos / L));
    const t = (pos - si * L) / L;
    const { d, s } = segs[si];
    const cx = s[0] + (s[2] - s[0]) * t;
    const cy = s[1] + (s[3] - s[1]) * t;
    // the board digits lean forward (skewX -4deg about the cell centre)
    const sx = cx + tan * (50 - cy) * 1;
    return { x: left + d * (dw + gap) + sx * u, y: top + cy * u };
  });
};

/** the 9 x 9 board of sockets */
export const HalftimeBoosGrid = { x0: 458, y0: 870, pitch: 62, r: 23 };
export const HalftimeBoosSocket = (i: number) => {
  const G = HalftimeBoosGrid;
  return { x: G.x0 + (i % 9) * G.pitch, y: G.y0 + Math.floor(i / 9) * G.pitch, row: Math.floor(i / 9), col: i % 9 };
};

/** where the teammates' 23 bulbs gather, left column */
export const HalftimeBoosBench = (j: number) => ({ x: 128 + (j % 5) * 44, y: 1012 + Math.floor(j / 5) * 44 });
