// wilt-100 "close": the shared numbers. The world is Hershey Sports Arena in metres, the same numbers as the `crowd`
// scene (x across the floor, y up, z down the length of the barrel vault), set in the town at night. One camera
// (yaw, pitch, distance about a target) looks at it the whole scene: the Beato aerial's angle at first, then it rises
// straight up until the town is a point on the Pennsylvania map. Every time is a word of caption.txt.
import { Easing } from "remotion";
import { ease, prog, useScene } from "../../../src/engine";

export const CW_AMBER = "#F2B33D";
export const CW_DIM = "#8B949E";
export const CW_BG = "#0D1117";

export const cwLerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const cwClamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const cwRnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const CW_SMOOTH = Easing.bezier(0.55, 0, 0.2, 1);

/* ---------- the words ---------- */
export function useCloseWitnessesT() {
  const { cue, cueEnd, scene } = useScene();
  return {
    born: scene.from - 6,
    from: scene.from,
    so: cue("So"),
    yes: cue("yes,"),
    the: cue("the"),
    greatest: cue("greatest"),
    scoring: cue("scoring"),
    night: cue("night"),
    ever: cue("ever,"),
    and: cue("and"),
    almost: cue("almost"),
    nobody: cue("nobody"),
    saw: cue("saw"),
    it: cue("it."),
    itEnd: cueEnd("it."),
    end: scene.to,
  };
}
export type CloseWitnessesT = ReturnType<typeof useCloseWitnessesT>;

/* ---------- the arena (CrowdHalfEmptyKit's numbers, read off the 1938, 2007 and 2024 photos) ---------- */
export const CW_ARENA = {
  zNear: -46, zFar: 48.6,
  springX: 36.4, springY: 15.6, crownY: 31.5,
  ribs: 11,
  rinkX: 13, rinkZ: 30.5, rinkR: 8.5,
  courtX: 7.62, courtZ: 14.33,
};
/** the vault's cross-section at angle a (0 at the far springing x>0, PI at the near one, the camera's side) */
export const cwVault = (a: number): [number, number] => [
  CW_ARENA.springX * Math.cos(a),
  CW_ARENA.springY + (CW_ARENA.crownY - CW_ARENA.springY) * Math.sin(a),
];
export const cwRibZ = (k: number) => cwLerp(CW_ARENA.zNear + 1.2, CW_ARENA.zFar - 1.2, k / (CW_ARENA.ribs - 1));

/* ---------- the seats: the crowd scene's banks and the same 4,124 filled seats ---------- */
export type CwSeat = { x: number; y: number; z: number; row: number; filled: boolean; r: number };
const SIDE_ROWS = 26, END_ROWS = 20, PITCH = 0.5, COUNT = 4124;
function cwBuildSeats(): CwSeat[] {
  type S = { x: number; y: number; z: number; row: number; bank: number; side: number };
  const seats: S[] = [];
  for (const s of [-1, 1]) {
    for (let r = 0; r < SIDE_ROWS; r++) {
      const x = s * (14.6 + r * 0.82), y = 1.0 + r * 0.57;
      let z = -30, n = 0;
      while (z < 30.4) {
        const sec = Math.floor(n / 14);
        if (n > 0 && n % 14 === 0) z += 1.1;
        const vom = r >= 10 && r <= 12 && sec % 2 === 1 && n % 14 >= 4 && n % 14 <= 9;
        if (!vom && z < 30.4) seats.push({ x, y, z, row: r, bank: s, side: sec });
        z += PITCH;
        n++;
      }
    }
  }
  for (let r = 0; r < END_ROWS; r++) {
    const z = 31.7 + r * 0.82, y = 1.0 + r * 0.57, half = 12 + r * 0.55;
    let x = -half, n = 0;
    while (x < half) {
      if (n > 0 && n % 14 === 0) x += 1.1;
      if (x < half) seats.push({ x, y, z, row: r, bank: 0, side: Math.floor(n / 14) });
      x += PITCH;
      n++;
    }
  }
  const score = seats.map((q, i) => {
    const mid = q.bank === 0 ? 0.3 : 1 - Math.abs(q.z) / 32;
    const clump = cwRnd(q.bank * 31 + q.side * 7.3 + Math.floor(q.row / 4) * 3.1);
    return { i, v: -q.row * 0.055 + mid * 0.9 + clump * 1.1 + cwRnd(i * 1.37) * 0.7 };
  });
  score.sort((a, b) => b.v - a.v);
  const filled = new Set(score.slice(0, COUNT).map((s) => s.i));
  return seats.map((q, i) => ({ x: q.x, y: q.y, z: q.z, row: q.row, filled: filled.has(i), r: cwRnd(i * 3.7 + 1) }));
}
export const CW_SEATS = cwBuildSeats();

/* ---------- the witnesses ---------- */
export type V3 = [number, number, number];
export const CW_RADIO: V3 = [9.05, 0.95, 5.55]; // the Zenith at the end of the press table (crowd scene)
export const CW_FLASH: V3 = [-27, 2.6, -39]; // the Warriors' locker room, under the near end, behind the front wall
export const CW_GATE: V3 = [-4, 0, -53.6]; // the main gate, in the low block in front of the near gable
export const CW_FANS: V3 = [24, 9, 4]; // where the label for the seats points: the far bank, mid height

/* ---------- the town around it, in metres: north is where the camera looks, east is screen right ---------- */
export const CW_YAW = (35 * Math.PI) / 180;
const H: V3 = [Math.cos(CW_YAW), 0, Math.sin(CW_YAW)]; // north
const E: V3 = [H[2], 0, -H[0]]; // east
/** a point of the town at (east, north) metres from the arena's centre, height y */
export const cwTown = (e: number, n: number, y = 0): V3 => [E[0] * e + H[0] * n, y, E[2] * e + H[2] * n];

/* ---------- the camera ---------- */
export type CwProj = { x: number; y: number; z: number; s: number };
export type CwView = { P: (p: V3) => CwProj; fwd: V3; pos: V3; F: number; pxPerM: number; cx: number; cy: number };

/** the hook's outside frame (the Beato aerial's angle, at night): to match the hook, change it here only */
export const CW_CAM_A = { pitch: (-25 * Math.PI) / 180, D: 255, F: 2000, cx: 540, cy: 1090, tgt: [0, 9, 2] as V3 };
/** the end: straight down, at the scale of the Pennsylvania map (CW_MAP_K px per degree of latitude) */
export const CW_MAP_K = 187;
export const CW_PX_PER_M_END = CW_MAP_K / 111_000;
export const CW_END = { cx: 675, cy: 1213 }; // where Hershey sits on the frame when the map is whole

/** time (0-1) -> share of the climb in log distance: monotone cubic through (0,0) (0.42,0.39) (0.71,0.55) (1,1),
 *  so the town (about 0.3 to 0.08 px a metre) stays readable for about 0.3 s instead of a frame or two */
const CW_RISE_K: [number, number][] = [[0, 0], [0.42, 0.39], [0.71, 0.55], [1, 1]];
const CW_RISE_M = (() => {
  const P = CW_RISE_K, n = P.length;
  const d = P.slice(1).map((q, i) => (q[1] - P[i][1]) / (q[0] - P[i][0]));
  const m = P.map((_, i) => {
    if (i === 0 || i === n - 1) return 0;
    const h0 = P[i][0] - P[i - 1][0], h1 = P[i + 1][0] - P[i][0];
    return (3 * (h0 + h1)) / ((2 * h1 + h0) / d[i - 1] + (h1 + 2 * h0) / d[i]);
  });
  return m;
})();
export function cwRiseCurve(t: number): number {
  const P = CW_RISE_K;
  const u = Math.min(1, Math.max(0, t));
  let i = 0;
  while (i < P.length - 2 && u > P[i + 1][0]) i++;
  const h = P[i + 1][0] - P[i][0];
  const x = (u - P[i][0]) / h;
  const x2 = x * x, x3 = x2 * x;
  return (2 * x3 - 3 * x2 + 1) * P[i][1] + (x3 - 2 * x2 + x) * h * CW_RISE_M[i]
    + (-2 * x3 + 3 * x2) * P[i + 1][1] + (x3 - x2) * h * CW_RISE_M[i + 1];
}

export function cwView(f: number, T: CloseWitnessesT): CwView {
  const A = CW_CAM_A;
  // the push past the marker: the vault arrives from further back
  const push = prog(f, T.greatest - 6, 34, ease.out);
  // a held picture keeps living: a slow drift in while the roof opens
  const drift = prog(f, T.greatest + 20, T.almost - T.greatest, ease.linear);
  // the rise: straight up until the town is a point on the state map
  const r0 = T.almost - 8;
  const rDur = T.saw + 8 - r0;
  // the climb lingers over the town (Chocolate Avenue's Kiss lamps going out, the stacks) through "nobody",
  // then lets the state map grow in for "saw it"
  const rise = cwRiseCurve(prog(f, r0, rDur, ease.linear));
  const tilt = prog(f, r0, rDur * 0.62, Easing.inOut(Easing.quad));
  const D0 = A.D * cwLerp(1.55, 1, push) * (1 - 0.06 * drift);
  const Dend = A.F / CW_PX_PER_M_END;
  const D = Math.exp(cwLerp(Math.log(D0), Math.log(Dend), rise));
  const pitch = cwLerp(A.pitch, -Math.PI / 2 + 0.0004, tilt);
  const tgt: V3 = [A.tgt[0] * (1 - rise), A.tgt[1] * (1 - rise), A.tgt[2] * (1 - rise)];
  const cx = cwLerp(A.cx, CW_END.cx, prog(f, r0, rDur, CW_SMOOTH));
  const cy = cwLerp(A.cy, CW_END.cy, prog(f, r0, rDur, CW_SMOOTH));
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const fwd: V3 = [cp * H[0], sp, cp * H[2]];
  const right: V3 = [H[2], 0, -H[0]];
  const up: V3 = [
    fwd[1] * right[2] - fwd[2] * right[1],
    fwd[2] * right[0] - fwd[0] * right[2],
    fwd[0] * right[1] - fwd[1] * right[0],
  ];
  const pos: V3 = [tgt[0] - fwd[0] * D, tgt[1] - fwd[1] * D, tgt[2] - fwd[2] * D];
  const F = A.F;
  const P = (p: V3): CwProj => {
    const d0 = p[0] - pos[0], d1 = p[1] - pos[1], d2 = p[2] - pos[2];
    const z = d0 * fwd[0] + d1 * fwd[1] + d2 * fwd[2];
    const zz = Math.max(z, 0.05);
    const x = d0 * right[0] + d1 * right[1] + d2 * right[2];
    const y = d0 * up[0] + d1 * up[1] + d2 * up[2];
    return { x: cx + (F * x) / zz, y: cy - (F * y) / zz, z, s: F / zz };
  };
  return { P, fwd, pos, F, pxPerM: F / D, cx, cy };
}

/* ---------- Pennsylvania, from real coordinates (lon, lat), the hershey scene's projection ---------- */
export const CW_PA: [number, number][] = [
  [-75.36, 42.0], [-76.0, 42.0], [-77.0, 42.0], [-78.0, 42.0], [-79.0, 42.0], [-79.76, 42.0],
  [-79.76, 42.27], [-79.9, 42.21], [-80.05, 42.15], [-80.12, 42.16], [-80.09, 42.12], [-80.25, 42.06], [-80.52, 41.98],
  [-80.52, 41.0], [-80.52, 40.64], [-80.52, 39.72],
  [-79.0, 39.72], [-78.0, 39.72], [-77.0, 39.72], [-76.23, 39.72], [-75.79, 39.72],
  [-75.77, 39.76], [-75.7, 39.81], [-75.6, 39.84], [-75.5, 39.84], [-75.42, 39.81], [-75.36, 39.85], [-75.27, 39.88],
  [-75.17, 39.89], [-75.13, 39.95], [-75.07, 40.0], [-74.97, 40.05], [-74.85, 40.1], [-74.76, 40.18], [-74.76, 40.22],
  [-74.86, 40.29], [-74.95, 40.36], [-75.06, 40.42], [-75.1, 40.5], [-75.19, 40.59], [-75.2, 40.69], [-75.1, 40.8],
  [-75.06, 40.87], [-75.14, 40.97], [-75.0, 41.07], [-74.88, 41.15], [-74.8, 41.32], [-74.69, 41.36], [-74.99, 41.48],
  [-75.06, 41.61], [-75.06, 41.77], [-75.15, 41.85], [-75.28, 41.95], [-75.36, 42.0],
];
export const CW_SUSQ: [number, number][] = [
  [-76.52, 41.99], [-76.44, 41.77], [-76.2, 41.6], [-75.95, 41.45], [-75.88, 41.25], [-76.05, 41.12], [-76.23, 41.05],
  [-76.6, 40.97], [-76.79, 40.86], [-76.9, 40.6], [-76.98, 40.4], [-76.88, 40.26], [-76.73, 40.2], [-76.55, 40.06],
  [-76.39, 39.92], [-76.23, 39.72],
];
export const CW_WBRANCH: [number, number][] = [
  [-78.2, 41.0], [-77.75, 41.12], [-77.45, 41.14], [-77.0, 41.24], [-76.87, 41.1], [-76.85, 41.01], [-76.79, 40.86],
];
export const CW_CITIES = {
  hershey: [-76.6503, 40.2859] as [number, number],
  harrisburg: [-76.8867, 40.2732] as [number, number],
  philadelphia: [-75.1652, 39.9526] as [number, number],
  pittsburgh: [-79.9959, 40.4406] as [number, number],
  newyork: [-74.006, 40.7128] as [number, number],
};
const COS41 = Math.cos((41 * Math.PI) / 180);
/** map units (px at scale 1) relative to Hershey: east right, north up */
export const cwMap = ([lon, lat]: [number, number]): [number, number] => [
  (lon - CW_CITIES.hershey[0]) * COS41 * CW_MAP_K,
  -(lat - CW_CITIES.hershey[1]) * CW_MAP_K,
];
export const cwMapPath = (pts: [number, number][], close = false) =>
  pts.map((p, i) => { const [x, y] = cwMap(p); return `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`; }).join(" ") + (close ? " Z" : "");
