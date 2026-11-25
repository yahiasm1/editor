// wilt-100 "flood": the shared numbers. The same Hershey Sports Arena world as `crowd` and `quarters` (metres: x across
// the floor, y up, z down the vault toward the far end wall), the same 4,124 seats taken (same generator, same seed), so
// every amber witness stands up from the seat it sat in. Here each one becomes a person with a path: along the row to
// the nearest stair aisle, down it, across the walkway, over the boards and out to a free spot on the floor.
import { Easing } from "remotion";
import { ease, prog, useScene } from "../../../src/engine";

export const FF_AMBER = "#F2B33D";
export const FF_LABEL = "#8B949E";
export const FF_BULB = "#FFE9C2";

export const ffLerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const ffClamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const ffRnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const rnd = ffRnd;

/* ---------- the words ---------- */
export function useFloodT() {
  const { cue, cueEnd, scene } = useScene();
  return {
    born: scene.from - 6,
    from: scene.from,
    when: cue("When"), n100: cue("100th"), point: cue("point"), went: cue("went"), inn: cue("in"),
    fans: cue("fans"), poured: cue("poured"), onto: cue("onto"), court: cue("court"), courtEnd: cueEnd("court"),
    and: cue("and"), warriors: cue("Warriors"), won: cue("won"), n169: cue("169"), to: cue("to"),
    n147: cue("147"), n147End: cueEnd("147"),
    end: scene.to,
  };
}
export type FloodT = ReturnType<typeof useFloodT>;

/* ---------- the arena (the numbers of `crowd`) ---------- */
export const FF_ARENA = {
  zNear: -46, zFar: 48.6,
  springX: 36.4, springY: 15.6, crownY: 31.5,
  ribs: 11,
  rinkX: 13, rinkZ: 30.5, rinkR: 8.5,
  courtX: 7.62, courtZ: 14.33,
};
export const ffVaultPt = (a: number): [number, number] => [FF_ARENA.springX * Math.cos(a), FF_ARENA.springY + (FF_ARENA.crownY - FF_ARENA.springY) * Math.sin(a)];
export const ffRibZ = (k: number) => ffLerp(FF_ARENA.zNear + 1.2, FF_ARENA.zFar - 1.2, k / (FF_ARENA.ribs - 1));

/** where the rink boards stand: x of the side boards at depth z, z of the end boards at x */
export const ffBoardsX = (z: number) => {
  const a = Math.abs(z), str = FF_ARENA.rinkZ - FF_ARENA.rinkR;
  return a <= str ? FF_ARENA.rinkX : FF_ARENA.rinkX - FF_ARENA.rinkR + Math.sqrt(Math.max(0, FF_ARENA.rinkR ** 2 - (a - str) ** 2));
};
export const ffBoardsZ = (x: number) => {
  const a = Math.abs(x), str = FF_ARENA.rinkX - FF_ARENA.rinkR;
  return a <= str ? FF_ARENA.rinkZ : FF_ARENA.rinkZ - FF_ARENA.rinkR + Math.sqrt(Math.max(0, FF_ARENA.rinkR ** 2 - (a - str) ** 2));
};

/* ---------- the seats (the generator of `crowd`, unchanged) ---------- */
export type FfSeat = { x: number; y: number; z: number; row: number; bank: number; filled: boolean; order: number; side: number; n: number };
export const FF_COUNT = 4124;
function buildSeats(): FfSeat[] {
  const SIDE_ROWS = 26, END_ROWS = 20, PITCH = 0.5;
  const seats: FfSeat[] = [];
  for (const s of [-1, 1]) {
    for (let r = 0; r < SIDE_ROWS; r++) {
      const x = s * (14.6 + r * 0.82), y = 1.0 + r * 0.57;
      let z = -30, n = 0;
      while (z < 30.4) {
        const sec = Math.floor(n / 14);
        if (n > 0 && n % 14 === 0) z += 1.1;
        const vom = r >= 10 && r <= 12 && sec % 2 === 1 && n % 14 >= 4 && n % 14 <= 9;
        if (!vom && z < 30.4) seats.push({ x, y, z, row: r, bank: s, filled: false, order: 0, side: sec, n });
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
      if (x < half) seats.push({ x, y, z, row: r, bank: 0, filled: false, order: 0, side: Math.floor(n / 14), n });
      x += PITCH;
      n++;
    }
  }
  const score = seats.map((q, i) => {
    const mid = q.bank === 0 ? 0.3 : 1 - Math.abs(q.z) / 32;
    const clump = rnd(q.bank * 31 + q.side * 7.3 + Math.floor(q.row / 4) * 3.1);
    return { i, v: -q.row * 0.055 + mid * 0.9 + clump * 1.1 + rnd(i * 1.37) * 0.7 };
  });
  score.sort((a, b) => b.v - a.v);
  const filled = score.slice(0, FF_COUNT).map((s) => s.i);
  const ord = filled.map((i) => ({ i, k: seats[i].row + rnd(i * 0.71) * 7 + rnd(seats[i].side * 5.1 + seats[i].bank) * 5 }));
  ord.sort((a, b) => a.k - b.k);
  ord.forEach((o, n) => { seats[o.i].filled = true; seats[o.i].order = n; });
  return seats;
}
export const FF_SEATS = buildSeats();

/* ---------- the players and referees on the floor, at the far basket where the 100th went in ---------- */
export type FfPlayer = { x: number; z: number; team: "PHW" | "NYK" | "REF"; num: string; h: number; face: number };
export const FF_PLAYERS: FfPlayer[] = [
  { x: -2.1, z: 11.4, team: "PHW", num: "13", h: 2.16, face: 3.3 }, // Wilt, beside the basket he scored on
  { x: -2.9, z: 7.6, team: "PHW", num: "", h: 1.9, face: 0.4 },
  { x: 3.4, z: 6.4, team: "PHW", num: "", h: 1.95, face: 2.6 },
  { x: -5.2, z: 2.4, team: "PHW", num: "", h: 1.85, face: 1.0 },
  { x: 1.9, z: 1.6, team: "PHW", num: "", h: 2.0, face: 2.0 },
  { x: 1.3, z: 11.6, team: "NYK", num: "", h: 2.05, face: 4.2 },
  { x: 2.1, z: 9.0, team: "NYK", num: "", h: 1.98, face: 3.9 },
  { x: -3.6, z: 5.0, team: "NYK", num: "", h: 1.92, face: 5.0 },
  { x: 5.4, z: 3.8, team: "NYK", num: "", h: 1.88, face: 3.0 },
  { x: -0.9, z: 3.2, team: "NYK", num: "", h: 1.96, face: 1.8 },
  { x: 6.4, z: 10.4, team: "REF", num: "", h: 1.8, face: 3.4 },
  { x: -6.2, z: -1.4, team: "REF", num: "", h: 1.78, face: 0.8 },
];
const clearR = (p: FfPlayer) => (p.num === "13" ? 1.7 : 1.05);

/* ---------- each witness's run ---------- */
export type FfRunner = {
  seat: number; // index in FF_SEATS
  pts: [number, number, number][]; // feet positions along the path
  cum: number[]; // arc length at each point
  hop: [number, number]; // arc-length span of the hop over the boards
  len: number;
  stand: number; // frames after "fans" they stand
  delay: number; // frames after "poured" they set off
  dur: number; // frames the run takes
  seed: number;
};

/** the aisle positions of the side banks (z) and the end bank (x), from row 0's sections */
function aisles(kind: "side" | "end") {
  const out: number[] = [];
  if (kind === "side") {
    const zs: number[] = [];
    let z = -30, n = 0;
    while (z < 30.4) { if (n > 0 && n % 14 === 0) z += 1.1; if (z < 30.4) zs.push(z); z += 0.5; n++; }
    out.push(zs[0] - 0.8);
    for (let k = 14; k < zs.length; k += 14) out.push((zs[k - 1] + zs[k]) / 2);
    out.push(zs[zs.length - 1] + 0.8);
  } else {
    const xs: number[] = [];
    let x = -12, n = 0;
    while (x < 12) { if (n > 0 && n % 14 === 0) x += 1.1; if (x < 12) xs.push(x); x += 0.5; n++; }
    out.push(xs[0] - 0.8);
    for (let k = 14; k < xs.length; k += 14) out.push((xs[k - 1] + xs[k]) / 2);
    out.push(xs[xs.length - 1] + 0.8);
  }
  return out;
}
const SIDE_AISLES = aisles("side"), END_AISLES = aisles("end");
const nearest = (v: number, list: number[]) => list.reduce((b, a) => (Math.abs(a - v) < Math.abs(b - v) ? a : b), list[0]);

/** free spots on the floor: a jittered grid over the rink oval, minus a margin at the boards and a clearing round each
 *  player; the spots nearest the players and the middle are taken first (people crowd the players) */
function floorSpots(n: number): [number, number][] {
  const out: { x: number; z: number; v: number }[] = [];
  const S = 0.5;
  let i = 0;
  for (let z = -FF_ARENA.rinkZ + 0.5; z < FF_ARENA.rinkZ - 0.5; z += S) {
    for (let x = -FF_ARENA.rinkX + 0.5; x < FF_ARENA.rinkX - 0.5; x += S) {
      i++;
      const jx = x + (rnd(i * 3.7) - 0.5) * S * 0.8, jz = z + (rnd(i * 5.3) - 0.5) * S * 0.8;
      if (Math.abs(jx) > ffBoardsX(jz) - 0.55 || Math.abs(jz) > ffBoardsZ(jx) - 0.55) continue;
      let blocked = false, near = 1e9;
      for (const p of FF_PLAYERS) {
        const d = Math.hypot(jx - p.x, jz - p.z);
        if (d < clearR(p)) blocked = true;
        near = Math.min(near, d - clearR(p));
      }
      if (blocked) continue;
      const v = 1.4 * Math.exp(-near / 5) + 0.6 * Math.exp(-((jz - 5) ** 2) / 500) + rnd(i * 1.91) * 0.9;
      out.push({ x: jx, z: jz, v });
    }
  }
  out.sort((a, b) => b.v - a.v);
  return out.slice(0, n).map((p) => [p.x, p.z]);
}

function buildRunners(): FfRunner[] {
  const who = FF_SEATS.map((q, i) => ({ q, i })).filter(({ q }) => q.filled);
  const spots = floorSpots(who.length);
  // the way onto the floor for each: the hop point, its angle round the floor's middle
  type Pre = { i: number; path: [number, number, number][]; hopAt: number; ang: number; entry: [number, number] };
  const pre: Pre[] = who.map(({ q, i }) => {
    const feet = q.y - 0.5;
    const path: [number, number, number][] = [[q.x, feet, q.z]];
    let hopAt: number;
    let entry: [number, number];
    if (q.bank !== 0) {
      const s = q.bank;
      const za = nearest(q.z, SIDE_AISLES);
      path.push([q.x, feet, za]); // along the row
      path.push([s * 14.45, 0.45, za]); // down the stair aisle to the front row
      const zb = ffClamp(za * 0.92, -27, 27);
      const bx = ffBoardsX(zb);
      path.push([s * 13.75, 0.02, za]); // off the last step onto the walkway
      path.push([s * (bx + 0.35), 0.02, zb]);
      hopAt = path.length - 1;
      path.push([s * (bx - 0.5), 0.02, zb * 0.99]); // over the boards
      entry = [s * (bx - 0.5), zb * 0.99];
    } else {
      const xa = nearest(q.x, END_AISLES);
      path.push([xa, feet, q.z]);
      path.push([xa, 0.45, 31.4]);
      const xb = ffClamp(xa * 0.9, -9.5, 9.5);
      const bz = ffBoardsZ(xb);
      path.push([xa, 0.02, 31.0]);
      path.push([xb, 0.02, bz + 0.35]);
      hopAt = path.length - 1;
      path.push([xb * 0.99, 0.02, bz - 0.5]);
      entry = [xb * 0.99, bz - 0.5];
    }
    return { i, path, hopAt, ang: Math.atan2(entry[0], entry[1] - 4), entry };
  });
  // match each entry to a spot by angle round the floor's middle, so streams fan out and do not cross the floor
  const byAng = [...pre].sort((a, b) => a.ang - b.ang);
  const spotAng = spots.map((s) => ({ s, a: Math.atan2(s[0], s[1] - 4) })).sort((a, b) => a.a - b.a);
  // within the same angle, the first through the boards goes deepest
  const out: FfRunner[] = [];
  const BIN = 60;
  for (let b = 0; b < byAng.length; b += BIN) {
    const ps = byAng.slice(b, b + BIN), ss = spotAng.slice(b, b + BIN).map((x) => x.s);
    const firstOut = [...ps].sort((p1, p2) => FF_SEATS[p1.i].row - FF_SEATS[p2.i].row);
    const deep = [...ss].sort((s1, s2) => Math.hypot(s2[0], s2[1] - 4) - Math.hypot(s1[0], s1[1] - 4)).reverse();
    firstOut.forEach((p, k) => {
      const q = FF_SEATS[p.i];
      const sp = deep[Math.min(k, deep.length - 1)];
      const pts = [...p.path, [sp[0], 0.02, sp[1]] as [number, number, number]];
      const cum = [0];
      for (let j = 1; j < pts.length; j++) cum.push(cum[j - 1] + Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1], pts[j][2] - pts[j - 1][2]));
      const len = cum[cum.length - 1];
      const toAisle = Math.abs(p.path[1][q.bank !== 0 ? 2 : 0] - p.path[0][q.bank !== 0 ? 2 : 0]);
      out.push({
        seat: p.i, pts, cum, hop: [cum[p.hopAt], cum[p.hopAt + 1]], len,
        stand: rnd(p.i * 2.3) * 7,
        delay: q.row * 1.05 + toAisle * 1.3 + rnd(p.i * 4.1) * 9,
        dur: 16 + len * 1.15 + rnd(p.i * 0.37) * 8,
        seed: p.i,
      });
    });
  }
  return out;
}
export const FF_RUNNERS = buildRunners();

/** where a runner's feet are at run progress u (0..1 of the arc length), and how high the hop lifts them */
export function ffRunnerAt(r: FfRunner, u: number): { p: [number, number, number]; lift: number; dir: [number, number] } {
  const d = u * r.len;
  let j = 1;
  while (j < r.cum.length - 1 && r.cum[j] < d) j++;
  const a = r.pts[j - 1], b = r.pts[j];
  const seg = Math.max(1e-6, r.cum[j] - r.cum[j - 1]);
  const k = ffClamp((d - r.cum[j - 1]) / seg);
  const p: [number, number, number] = [ffLerp(a[0], b[0], k), ffLerp(a[1], b[1], k), ffLerp(a[2], b[2], k)];
  const hk = (d - r.hop[0]) / Math.max(1e-6, r.hop[1] - r.hop[0]);
  const lift = hk > 0 && hk < 1 ? 1.15 * Math.sin(Math.PI * hk) : 0;
  return { p, lift, dir: [b[0] - a[0], b[2] - a[2]] };
}

/* ---------- the scoreboard (the cabinet of `quarters`: 1000 x 760 units, 9 m wide on the far end wall) ---------- */
export const FF_BOARD = { x: 0, y: 19.4, z: FF_ARENA.zFar - 0.25, w: 9, units: 1000, uh: 760 };
export const FF_M = FF_BOARD.w / FF_BOARD.units;
export function ffBoardPt(u: number, v: number, swing = 0): V3 {
  const x = (u - FF_BOARD.units / 2) * FF_M, y = -(v - FF_BOARD.uh / 2) * FF_M;
  const py = (FF_BOARD.uh / 2) * FF_M + 1.6;
  const c = Math.cos(swing), s = Math.sin(swing);
  const rx = x * c - (y - py) * s, ry = x * s + (y - py) * c + py;
  return [FF_BOARD.x + rx, FF_BOARD.y + ry, FF_BOARD.z];
}
/** the line score and totals, from the box score */
export const FF_LINE = { PHW: [42, 37, 46, 44], NYK: [26, 42, 38, 41], TOT: [169, 147] };

/* ---------- the camera ---------- */
export type V3 = [number, number, number];
export type FfCam = { pos: V3; tgt: V3; F: number; cx: number; cy: number };
export type FfProj = { x: number; y: number; z: number; s: number };
export type FfView = { cam: FfCam; P: (p: V3) => FfProj };

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const mixV = (a: V3, b: V3, k: number): V3 => [ffLerp(a[0], b[0], k), ffLerp(a[1], b[1], k), ffLerp(a[2], b[2], k)];

export function ffProject(cam: FfCam): FfView {
  const fwd = norm(sub(cam.tgt, cam.pos));
  const right = norm(cross([0, 1, 0], fwd));
  const up = cross(fwd, right);
  const P = (p: V3): FfProj => {
    const d = sub(p, cam.pos);
    const z = dot(d, fwd);
    const zz = Math.max(z, 0.05);
    return { x: cam.cx + (cam.F * dot(d, right)) / zz, y: cam.cy - (cam.F * dot(d, up)) / zz, z, s: cam.F / zz };
  };
  return { cam, P };
}

const SMOOTH = Easing.bezier(0.55, 0, 0.2, 1);
const FLY = Easing.bezier(0.6, 0, 0.25, 1);
type Key = { at: number; dur: number; pos: V3; tgt: V3; F: number; e?: (n: number) => number };

/** close on the board for the 100 and the 4th column; back down the vault to the high end view for the run; then down
 *  over the crowd to eye level among them, looking up at the board for the final */
export function ffCam(f: number, T: FloodT): FfCam {
  const start = { pos: [0, 15.3, 31.2] as V3, tgt: [0, 15.8, 48.35] as V3, F: 1060 };
  const keys: Key[] = [
    // a slow push while the 100 lands and the column lights
    { at: T.born, dur: T.went - T.born, pos: [0, 15.3, 32.4], tgt: [0, 15.75, 48.35], F: 1060, e: ease.linear },
    // back down the vault to the high end view (the 1938 photo's angle)
    { at: T.went - 4, dur: T.fans - T.went + 22, pos: [0, 24, -40], tgt: [0, 3.6, 8], F: 1000, e: FLY },
    // the drift while they pour
    { at: T.fans + 18, dur: T.and - T.fans - 14, pos: [0.8, 22.6, -37.5], tgt: [0.2, 3.3, 9], F: 1010, e: ease.inOut },
    // down over the crowd to eye level among them, looking up at the board
    { at: T.and - 6, dur: T.n169 - T.and - 4, pos: [-2.6, 5.2, -4], tgt: [-0.6, 10.2, 48.35], F: 1450, e: SMOOTH },
  ];
  let cur = { ...start };
  for (const k of keys) {
    const p = prog(f, k.at, k.dur, k.e ?? SMOOTH);
    if (p <= 0) break;
    cur = { pos: mixV(cur.pos, k.pos, p), tgt: mixV(cur.tgt, k.tgt, p), F: Math.exp(ffLerp(Math.log(cur.F), Math.log(k.F), p)) };
  }
  // the held picture keeps living: a slow push
  const live = prog(f, T.n169, T.end - T.n169 + 30, ease.linear);
  // a knock on the 100th, the biggest of the reel
  const t = f - T.n100;
  const knock = t < 0 ? 0 : 0.14 * Math.exp(-t / 8) * Math.sin(t * 0.95);
  return { pos: [cur.pos[0], cur.pos[1] + knock, cur.pos[2]], tgt: cur.tgt, F: cur.F * (1 + 0.035 * live), cx: 540, cy: 985 };
}

/** the cabinet's swing on its chains (radians): one big swing on the 100th, small shivers on the totals */
export function ffSwing(f: number, T: FloodT) {
  const sw = (at: number, a: number, per: number, tau: number) => {
    const t = f - at;
    return t < 0 ? 0 : a * Math.exp(-t / tau) * Math.sin((t / per) * Math.PI * 2);
  };
  return sw(T.n100, 0.04, 60, 60) + sw(T.n169, 0.004, 26, 14) + sw(T.n147, 0.004, 26, 14);
}

export function ffBoardMatrix(V: FfView, swing: number): string {
  const p0 = V.P(ffBoardPt(0, 0, swing)), p1 = V.P(ffBoardPt(100, 0, swing)), p2 = V.P(ffBoardPt(0, 100, swing));
  const a = (p1.x - p0.x) / 100, b = (p1.y - p0.y) / 100, c = (p2.x - p0.x) / 100, d = (p2.y - p0.y) / 100;
  return `matrix(${a.toFixed(5)} ${b.toFixed(5)} ${c.toFixed(5)} ${d.toFixed(5)} ${p0.x.toFixed(2)} ${p0.y.toFixed(2)})`;
}

/** the WILT flaps: 98 at the start, 99, then 100 falling on the word, the flip slower and heavier than any before */
export const FF_FLIP = 7;
export function ffFlipAt(f: number, T: FloodT) {
  const s: [number, number][] = [[-1e9, 98], [T.n100 - FF_FLIP - 6, 99], [T.n100 - FF_FLIP, 100]];
  let i = 0;
  while (i < s.length - 1 && f >= s[i + 1][0]) i++;
  const prev = i > 0 ? s[i - 1][1] : s[i][1];
  return { at: s[i][0], val: s[i][1], prev, k: prog(f, s[i][0], i === 2 ? FF_FLIP : 5, i === 2 ? ease.in : ease.linear) };
}
