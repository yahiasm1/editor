// wilt-100 "crowd": the shared numbers. The world is Hershey Sports Arena in metres (read off the 1938 interior photo
// and the 2007 / 2024 photos): x across the floor, y up, z down the length of the barrel vault, away from the end the
// camera enters by. One camera looks at it all scene long; every time is a word of caption.txt.
import { Easing } from "remotion";
import { ease, prog, useScene } from "../../../src/engine";

export const AMBER = "#F2B33D";
export const STRIKE = "#E5484D";
export const LABEL = "#8B949E";

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const crowdHalfEmptyRnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const rnd = crowdHalfEmptyRnd;

/* ---------- the words ---------- */
export function useCrowdHalfEmptyT() {
  const { cue, cueEnd, scene } = useScene();
  return {
    born: scene.from - 6,
    from: scene.from,
    only: cue("Only"), count: cue("4,124"), countEnd: cueEnd("4,124"), people: cue("people"), showed: cue("showed"),
    half: cue("half"), building: cue("building"), there: cue("There"), tv: cue("TV"), cameras: cue("cameras"),
    and1: cue("and"), york: cue("York"), reporters: cue("reporters"), and2: cue("and", 2), only2: cue("only", 2),
    recording: cue("recording"), radio: cue("radio"), audio: cue("audio"), fourth: cue("fourth"),
    quarter: cue("quarter"), quarterEnd: cueEnd("quarter"), end: scene.to,
  };
}
export type CrowdHalfEmptyT = ReturnType<typeof useCrowdHalfEmptyT>;

/* ---------- the arena ---------- */
export const ARENA = {
  zNear: -46, zFar: 48.6, // end walls
  springX: 36.4, springY: 15.6, crownY: 31.5, // the vault: an ellipse from the top seat rows up
  ribs: 11,
  rinkX: 13, rinkZ: 30.5, rinkR: 8.5, // the oval floor (a hockey rink, 61 x 26 m)
  courtX: 7.62, courtZ: 14.33, // the 1962 court, 94 x 50 ft
};
/** the vault's cross-section at angle a (0 at the right springing, PI at the left) */
export const vaultPt = (a: number): [number, number] => [ARENA.springX * Math.cos(a), ARENA.springY + (ARENA.crownY - ARENA.springY) * Math.sin(a)];
export const ribZ = (k: number) => lerp(ARENA.zNear + 1.2, ARENA.zFar - 1.2, k / (ARENA.ribs - 1));

/* ---------- the seats: two long banks and the far end bank, cut into sections by stair aisles ---------- */
export type Seat = { x: number; y: number; z: number; row: number; bank: number; filled: boolean; order: number; side: number };
const SIDE_ROWS = 26, END_ROWS = 20, PITCH = 0.5;
function buildSeats(): Seat[] {
  const seats: Seat[] = [];
  for (const s of [-1, 1]) {
    for (let r = 0; r < SIDE_ROWS; r++) {
      const x = s * (14.6 + r * 0.82), y = 1.0 + r * 0.57;
      let z = -30, n = 0;
      while (z < 30.4) {
        // stair aisle every 14 seats; vomitory portals at rows 10-12 in every second section
        const sec = Math.floor(n / 14);
        if (n > 0 && n % 14 === 0) z += 1.1;
        const vom = r >= 10 && r <= 12 && sec % 2 === 1 && n % 14 >= 4 && n % 14 <= 9;
        if (!vom && z < 30.4) seats.push({ x, y, z, row: r, bank: s, filled: false, order: 0, side: sec });
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
      if (x < half) seats.push({ x, y, z, row: r, bank: 0, filled: false, order: 0, side: Math.floor(n / 14) });
      x += PITCH;
      n++;
    }
  }
  // who came: the lower rows and the middle first, in clumps of friends and families, never an even spread
  const score = seats.map((q, i) => {
    const mid = q.bank === 0 ? 0.3 : 1 - Math.abs(q.z) / 32;
    const clump = rnd(q.bank * 31 + q.side * 7.3 + Math.floor(q.row / 4) * 3.1);
    return { i, v: -q.row * 0.055 + mid * 0.9 + clump * 1.1 + rnd(i * 1.37) * 0.7 };
  });
  score.sort((a, b) => b.v - a.v);
  const filled = score.slice(0, COUNT).map((s) => s.i);
  // the order they sat down: from the floor up, clumps together
  const ord = filled.map((i) => ({ i, k: seats[i].row + rnd(i * 0.71) * 7 + rnd(seats[i].side * 5.1 + seats[i].bank) * 5 }));
  ord.sort((a, b) => a.k - b.k);
  ord.forEach((o, n) => { seats[o.i].filled = true; seats[o.i].order = n; });
  return seats;
}
export const COUNT = 4124;
export const SEATS = buildSeats();

/* ---------- where things stand at courtside ---------- */
export const TK = { x: 10.4, y: 0.55, z: -9.6 }; // the TV camera on its riser
export const RISER = { x0: 9.2, x1: 11.6, z0: -10.8, z1: -8.4, h: 0.55 };
export const TABLE = { x0: 8.75, x1: 9.55, z0: -5.4, z1: 6.0, h: 0.76 };
export const RADIO = { x: 9.05, y: 0.76, z: 5.55 }; // bottom centre of its front, facing the court
export const BOARD = { x: 0, y: 19.4, z: ARENA.zFar - 0.25, w: 9, h: 4.2 }; // the scoreboard on the far end wall, centre

/* ---------- the camera ---------- */
export type V3 = [number, number, number];
export type Cam = { pos: V3; tgt: V3; F: number; cx: number; cy: number; roll?: number };
export type Proj = { x: number; y: number; z: number; s: number };
export type CrowdHalfEmptyView = { cam: Cam; P: (p: V3) => Proj; right: V3; up: V3; fwd: V3 };

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const mixV = (a: V3, b: V3, k: number): V3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

export function crowdHalfEmptyProject(cam: Cam): CrowdHalfEmptyView {
  const fwd = norm(sub(cam.tgt, cam.pos));
  let right = norm(cross([0, 1, 0], fwd));
  let up = cross(fwd, right);
  if (cam.roll) {
    const c = Math.cos(cam.roll), s = Math.sin(cam.roll);
    const r2: V3 = [right[0] * c + up[0] * s, right[1] * c + up[1] * s, right[2] * c + up[2] * s];
    up = cross(fwd, r2);
    right = r2;
  }
  const P = (p: V3): Proj => {
    const d = sub(p, cam.pos);
    const z = dot(d, fwd);
    const zz = Math.max(z, 0.05);
    return { x: cam.cx + (cam.F * dot(d, right)) / zz, y: cam.cy - (cam.F * dot(d, up)) / zz, z, s: cam.F / zz };
  };
  return { cam, P, right, up, fwd };
}

const SMOOTH = Easing.bezier(0.55, 0, 0.2, 1);
type Key = { at: number; dur: number; pos: V3; tgt: V3; F: number };

/** the camera through the scene: in at the door, up to the high end view, down to the sideline, along the press
 *  table, in at the radio, up to the scoreboard */
export function crowdHalfEmptyCam(f: number, T: CrowdHalfEmptyT): Cam {
  const start: Omit<Key, "at" | "dur"> = { pos: [0, 1.7, -55], tgt: [0, 2.6, 0], F: 1100 };
  const keys: Key[] = [
    // in through the door, behind the stub
    { at: T.born + 4, dur: 24, pos: [0, 1.7, -43.4], tgt: [0, 2.6, 0], F: 1100 },
    // up into the high end view (the 1938 photo's angle)
    { at: T.born + 22, dur: T.count - T.born - 10, pos: [0, 16.5, -44.5], tgt: [0, 4.5, 8], F: 1250 },
    // the slow drift while the house fills
    { at: T.count + 10, dur: T.building - T.count - 8, pos: [-1.8, 15.6, -42.5], tgt: [0.4, 4.5, 8], F: 1290 },
    // down toward the right sideline: the TV camera's riser
    { at: T.building - 4, dur: T.tv - T.building - 2, pos: [6.2, 1.95, -14.4], tgt: [10.4, 1.3, -9.2], F: 1750 },
    // along the press table
    { at: T.and1 - 4, dur: T.reporters - T.and1, pos: [6.9, 2.35, -7.7], tgt: [9.5, 0.75, -1.8], F: 1250 },
    // in at the radio on the end of the table
    { at: T.and2 - 2, dur: T.recording - T.and2 + 2, pos: [7.3, 1.3, 3.5], tgt: [9.05, 0.92, 5.6], F: 2500 },
    // back and up from the radio: the radio low right, the whole hall up to the far end board, the waves between
    { at: T.audio - 8, dur: 22, pos: [6.6, 2.2, -0.5], tgt: [7.8, 8.0, 40], F: 850 },
    // up to the far end scoreboard
    { at: T.audio + 16, dur: Math.max(20, T.quarter - T.audio - 18), pos: [4.6, 7.5, 10.5], tgt: [0.6, 18.6, 48], F: 3500 },
  ];
  let cur = { ...start };
  for (const k of keys) {
    const p = prog(f, k.at, k.dur, SMOOTH);
    if (p <= 0) break;
    cur = { pos: mixV(cur.pos, k.pos, p), tgt: mixV(cur.tgt, k.tgt, p), F: Math.exp(lerp(Math.log(cur.F), Math.log(k.F), p)) };
  }
  // a held picture keeps living: a slow push
  const live = prog(f, T.quarter, T.end - T.quarter + 20, ease.linear);
  return { pos: cur.pos, tgt: cur.tgt, F: cur.F * (1 + 0.04 * live), cx: 540, cy: 1000 };
}

/** an affine map from a flat drawing (units u, origin top-left) onto a plane in the world: its top-left corner `o`,
 *  `ax` world metres per unit across, `ay` world metres per unit down. Good for small objects. */
export function crowdHalfEmptySprite(V: CrowdHalfEmptyView, o: V3, ax: V3, ay: V3): string {
  const p0 = V.P(o), p1 = V.P([o[0] + ax[0] * 100, o[1] + ax[1] * 100, o[2] + ax[2] * 100]);
  const p2 = V.P([o[0] + ay[0] * 100, o[1] + ay[1] * 100, o[2] + ay[2] * 100]);
  const a = (p1.x - p0.x) / 100, b = (p1.y - p0.y) / 100, c = (p2.x - p0.x) / 100, d = (p2.y - p0.y) / 100;
  return `matrix(${a.toFixed(5)} ${b.toFixed(5)} ${c.toFixed(5)} ${d.toFixed(5)} ${p0.x.toFixed(2)} ${p0.y.toFixed(2)})`;
}

/** the attendance: how many have sat down by frame f (the counter shows exactly the dots on the seats) */
export function crowdHalfEmptyCount(f: number, T: CrowdHalfEmptyT) {
  const dur = T.countEnd - T.count - 10;
  return Math.floor(COUNT * prog(f, T.count - 1, dur, Easing.bezier(0.3, 0.1, 0.25, 1)));
}
