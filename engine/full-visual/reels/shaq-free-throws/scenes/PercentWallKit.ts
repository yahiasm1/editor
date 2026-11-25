// PercentWall's world: every free throw Shaq attempted, as Basketball-Reference counts it (totals table, per season,
// 2007-08 = his "2TM" row), one real ball each. 19 season columns, 9 balls wide, each hanging on one hairline at
// exactly half its attempts. Makes fill from the bottom, misses sit above them, then fall into a heap on the line.
// Everything is precomputed once, deterministic (seeded), in frames relative to the scene's cues.

export const PW_SEASONS: { s: string; ft: number; fta: number }[] = [
  { s: "1992-93", ft: 427, fta: 721 },
  { s: "1993-94", ft: 471, fta: 850 },
  { s: "1994-95", ft: 455, fta: 854 },
  { s: "1995-96", ft: 249, fta: 511 },
  { s: "1996-97", ft: 232, fta: 479 },
  { s: "1997-98", ft: 359, fta: 681 },
  { s: "1998-99", ft: 269, fta: 498 },
  { s: "1999-00", ft: 432, fta: 824 },
  { s: "2000-01", ft: 499, fta: 972 },
  { s: "2001-02", ft: 398, fta: 717 },
  { s: "2002-03", ft: 451, fta: 725 },
  { s: "2003-04", ft: 331, fta: 676 },
  { s: "2004-05", ft: 353, fta: 765 },
  { s: "2005-06", ft: 221, fta: 471 },
  { s: "2006-07", ft: 124, fta: 294 },
  { s: "2007-08", ft: 170, fta: 338 },
  { s: "2008-09", ft: 309, fta: 519 },
  { s: "2009-10", ft: 112, fta: 226 },
  { s: "2010-11", ft: 73, fta: 131 },
];
export const PW_TOTAL = PW_SEASONS.reduce((a, s) => a + s.fta, 0); // 11,252
export const PW_MISSED = PW_SEASONS.reduce((a, s) => a + s.fta - s.ft, 0); // 5,317

// geometry (stage px)
export const PW_CARD = { x: 90, y: 530, w: 900, h: 760, r: 28 };
export const PW_X0 = 200;
export const PW_X1 = 972;
export const PW_PER = 10; // balls across a column: the seasons touch, one wall
export const PW_P = 4; // pitch
export const PW_D = 3.7; // ball diameter in the wall
export const PW_COLW = PW_PER * PW_P;
export const PW_GAP = (PW_X1 - PW_X0 - PW_SEASONS.length * PW_COLW) / (PW_SEASONS.length - 1);
export const PW_YMID = 1010; // the coin-flip hairline: half of every column's attempts below it
export const pwColX = (c: number) => PW_X0 + c * (PW_COLW + PW_GAP);
export const pwColTop = (c: number) => PW_YMID - (PW_SEASONS[c].fta / 2 / PW_PER) * PW_P;
export const pwColBottom = (c: number) => PW_YMID + (PW_SEASONS[c].fta / 2 / PW_PER) * PW_P;

// the floor in front of the wall: the Lakers free throw line seen from behind the shooter
export const PW_FLOOR_TOP = 1262;
export const PW_LINE_Y = 1374;
export const PW_HEAP_BASE = 1384;
export const PW_HEAP_D = 5.6;

// timing, frames relative to the cue that drives each phase
export const PW_BUILD_STEP = 2; // between columns
export const PW_BUILD_FILL = 20; // a column pours in, bottom to top
export const PW_MISS_STEP = 4.5; // misses leave column by column
export const PW_MISS_SPREAD = 10; // inside a column, lower misses first
export const PW_FLASH = 3; // turn red in place before falling

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const R = rng(5317);
const gauss = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = R();
  while (v === 0) v = R();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

export type PwMark = {
  c: number;
  j: number;
  x: number;
  y: number;
  made: boolean;
  tone: number; // 0..2, leather varies ball to ball
  /** made: lit when the column's fill reaches this fraction */
  frac: number;
  build: number; // arrival, frames after the build starts
  rel: number; // misses: release, frames after "missed"
  fall: number; // misses: fall duration
  hx: number;
  hy: number;
  depth: number; // 0 back .. 1 front, in the heap
};

const N = PW_TOTAL;
export const PW_MARKS: PwMark[] = [];
PW_SEASONS.forEach((s, c) => {
  const x0 = pwColX(c);
  const bottom = pwColBottom(c);
  const rows = Math.ceil(s.fta / PW_PER);
  for (let j = 0; j < s.fta; j++) {
    const r = Math.floor(j / PW_PER);
    const k = j % PW_PER;
    // a part-filled top row sits centred, like balls settling in a rack
    const inRow = r === rows - 1 ? s.fta - r * PW_PER : PW_PER;
    const off = ((PW_PER - inRow) * PW_P) / 2;
    const made = j < s.ft;
    PW_MARKS.push({
      c,
      j,
      x: x0 + off + (k + 0.5) * PW_P + (R() - 0.5) * 0.5,
      y: bottom - (r + 0.5) * PW_P + (R() - 0.5) * 0.5,
      made,
      tone: Math.floor(R() * 3),
      frac: (j + 1) / s.ft,
      build: c * PW_BUILD_STEP + (r / rows) * PW_BUILD_FILL + R() * 1.5,
      rel: 0,
      fall: 0,
      hx: 0,
      hy: 0,
      depth: 0,
    });
  }
});

// the misses: release times, then a sandpile on the line in the order they land
const misses = PW_MARKS.filter((m) => !m.made);
for (const m of misses) {
  const s = PW_SEASONS[m.c];
  const q = (m.j - s.ft) / Math.max(1, s.fta - s.ft);
  m.rel = m.c * PW_MISS_STEP + q * PW_MISS_SPREAD + R() * 5;
}
const BW = 4.2; // bin width
// the heap stays left of Instagram's side buttons
const BX0 = PW_X0 - 40;
const NB = Math.ceil((PW_X1 - 6 - BX0) / BW);
const h = new Float32Array(NB);
const order = [...misses].sort((a, b) => a.rel - b.rel);
for (const m of order) {
  const cx = pwColX(m.c) + PW_COLW / 2 + gauss() * 22;
  let b = Math.max(3, Math.min(NB - 4, Math.round((cx - BX0) / BW)));
  // angle of repose: a ball rolls off a step steeper than about one ball
  for (let it = 0; it < 80; it++) {
    // the ends of the heap are walls: nothing rolls past them
    const l = b - 1 >= 1 ? h[b - 1] : Infinity;
    const r = b + 1 <= NB - 2 ? h[b + 1] : Infinity;
    if (l < h[b] - 3.4 && l <= r) b--;
    else if (r < h[b] - 3.4) b++;
    else break;
  }
  const depth = R();
  m.depth = depth;
  m.hx = BX0 + b * BW + (R() - 0.5) * 2;
  m.hy = PW_HEAP_BASE - h[b] - PW_HEAP_D / 2 + (depth - 0.5) * 9;
  h[b] += 1.9;
  m.fall = 14 + Math.sqrt(Math.max(0, m.hy - m.y)) * 0.95;
}
export const PW_MISS_ORDER = order;
export const PW_LAST_RELEASE = Math.max(...misses.map((m) => m.rel));
export const PW_HEAP_BINS = { x0: BX0, bw: BW, n: NB };
export const PW_N = N;
