// HookX1's geometry and data: the night photo read in its own pixels, the half-court line, the five red jerseys,
// Kobe's and the Raptors' real second-half makes, and the bulb piles settled once at load (disks dropped one by one,
// rolling until they sit in a groove or on the floor, as real balls pile).
import scoring from "../assets/refs/kobe-81-scoring.json";

export const HookX1Photo = { src: "kobe-81/commons-kobe-81-night-staples-2006-endlessbender-ccby2.jpg", w: 960, h: 720 };
export const HookX1Gold = "#FDB927";
export const HookX1Red = "#CE1141";

/** the photo's real half-court line, source px: from the far sideline, under the centre logo, to the scorer's table */
export const HookX1Line = { a: { x: 65, y: 458 }, b: { x: 625, y: 629 } };
export const HookX1LineY = (x: number) => 461 + 0.2995 * (x - 75);

/** the five red jerseys, source px (head top, feet), left to right */
export const HookX1Jerseys = [
  { head: { x: 353, y: 413 }, feet: { x: 345, y: 492 } }, // #5 Jalen Rose, by the centre logo
  { head: { x: 597, y: 363 }, feet: { x: 607, y: 447 } }, // bent over at the elbow
  { head: { x: 608, y: 343 }, feet: { x: 618, y: 418 } }, // behind him
  { head: { x: 673, y: 332 }, feet: { x: 673, y: 416 } }, // #4 Chris Bosh
  { head: { x: 728, y: 350 }, feet: { x: 733, y: 430 } }, // right side of the lane
];
/** Kobe himself in the photo, white #8 at the top of the key */
export const HookX1KobeInPhoto = { head: { x: 525, y: 368 }, feet: { x: 527, y: 434 } };

/** the far half's floor, for the gold glow (source px) */
export const HookX1FarFloor = "65,458 555,354 800,342 940,420 850,560 625,629";

/** players are ~80 src px tall at y 420 and ~103 at y 640: the floor's depth scale */
export const HookX1Persp = (y: number) => (80 + 0.104 * (y - 420)) / 80;

export const HookX1Rnd = (i: number, s: number) => {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

type Disk = { x: number; y: number; r: number };

/** drop one disk at x0 onto the floor and the disks already there; it rolls until it sits on the floor or in a groove */
const settle = (ds: Disk[], x0: number, r: number, floor: number): Disk => {
  const rest = (x: number) => {
    let y = floor - r;
    for (const d of ds) {
      const dx = x - d.x;
      const R = r + d.r;
      if (Math.abs(dx) < R) {
        const yy = d.y - Math.sqrt(R * R - dx * dx);
        if (yy < y) y = yy;
      }
    }
    return y;
  };
  let x = x0;
  let y = rest(x);
  let last = 0;
  for (let it = 0; it < 600; it++) {
    if (y >= floor - r - 0.01) break;
    const cs = ds.filter((d) => Math.abs(Math.hypot(x - d.x, y - d.y) - (r + d.r)) < 0.6);
    const left = cs.some((d) => d.x < x - 0.4);
    const right = cs.some((d) => d.x > x + 0.4);
    if (left && right) break;
    const yl = rest(x - 0.5);
    const yr = rest(x + 0.5);
    const dir = yl > yr + 1e-4 ? -1 : yr > yl + 1e-4 ? 1 : last || (cs[0] && cs[0].x > x ? -1 : 1);
    last = dir;
    x += dir * 0.5;
    y = rest(x);
  }
  return { x, y, r };
};

const pile = (n: number, cx: number, floor: number, r: number, spread: number, seed: number, under: Disk[] = []) => {
  const ds: Disk[] = [...under];
  const out: Disk[] = [];
  for (let i = 0; i < n; i++) {
    const g = (HookX1Rnd(i, seed) + HookX1Rnd(i, seed + 1) + HookX1Rnd(i, seed + 2) - 1.5) * spread;
    const d = settle(ds, cx + g, r * (0.72 + 0.56 * HookX1Rnd(i, seed + 3)), floor);
    ds.push(d);
    out.push(d);
  }
  return out;
};

// ---- the real second halves (Basketball-Reference play-by-play): every make, in order, with its points
type Ev = { q: number; team: string; pts: number; kobe: boolean; play: string };
const EV = (scoring as { events: Ev[] }).events.filter((e) => e.q >= 3);
export const HookX1KobeMakes = EV.filter((e) => e.kobe).map((e) => e.pts); // 31 makes, 55 points
const RAP = EV.filter((e) => e.team === "TOR");
// who drips where: Rose is #5, Bosh #4; the others stand in for the rest of the team
const heapOf = (play: string) => (play.startsWith("J. Rose") ? 0 : play.startsWith("C. Bosh") ? 3 : play.startsWith("M. James") ? 1 : play.startsWith("M. Bonner") ? 2 : 4);
export const HookX1RaptorMakes = RAP.map((e) => ({ pts: e.pts, heap: heapOf(e.play) })); // 26 makes, 41 points

// ---- the gold pile on the near half, in pour order
export const HookX1PileBase = { x: 440, y: 640 };
export const HookX1GoldR = 10;
export const HookX1GoldPile = pile(55, HookX1PileBase.x, HookX1PileBase.y, HookX1GoldR, 24, 11);
/** each gold bulb's make (index into HookX1KobeMakes) and its place inside that make */
export const HookX1GoldMake: { make: number; k: number }[] = [];
HookX1KobeMakes.forEach((pts, m) => {
  for (let k = 0; k < pts; k++) HookX1GoldMake.push({ make: m, k });
});

// ---- the red: five little heaps at the Raptors' feet, then one small pile on the far half
export const HookX1RedR = 5.6;
const heapCount = [0, 0, 0, 0, 0];
export const HookX1RedMake: { make: number; k: number; heap: number; slot: number }[] = [];
HookX1RaptorMakes.forEach((m, i) => {
  for (let k = 0; k < m.pts; k++) HookX1RedMake.push({ make: i, k, heap: m.heap, slot: heapCount[m.heap]++ });
});
export const HookX1Heaps = HookX1Jerseys.map((j, h) => pile(heapCount[h], j.feet.x + 9, j.feet.y + 4, HookX1RedR, 4, 30 + h));
export const HookX1RedPileBase = { x: 515, y: 488 };
export const HookX1RedPile = pile(41, HookX1RedPileBase.x, HookX1RedPileBase.y, 6.2, 8, 51);

// ---- where the flood comes to rest: a mound over the red pile, the rest rolled on toward the lane
const MOUND_N = 39;
export const HookX1Mound = pile(MOUND_N, HookX1RedPileBase.x + 8, HookX1RedPileBase.y + 3, 8.8, 26, 71);
const SCATTER: [number, number][] = [
  [748, 446], [712, 440], [690, 428], [726, 425], [655, 446], [622, 460], [676, 462], [640, 478], [598, 488], [585, 468],
  [430, 512], [395, 505], [468, 520], [560, 503], [455, 497], [705, 455],
];
/** the flood's resting places, in release order: the first (the top of the pile) roll farthest */
export const HookX1FloodTargets: Disk[] = [
  ...SCATTER.map(([x, y]) => ({ x, y: y - HookX1GoldR * HookX1Persp(y) * 0.9, r: HookX1GoldR * HookX1Persp(y) / HookX1Persp(640) })),
  ...HookX1Mound,
];
/** release rank of each gold pile bulb: top of the pile first */
export const HookX1ReleaseRank = (() => {
  const idx = HookX1GoldPile.map((d, i) => ({ i, y: d.y + 0.15 * (HookX1PileBase.x - d.x) }));
  idx.sort((a, b) => a.y - b.y);
  const rank: number[] = new Array(HookX1GoldPile.length);
  idx.forEach((o, k) => (rank[o.i] = k));
  return rank;
})();
