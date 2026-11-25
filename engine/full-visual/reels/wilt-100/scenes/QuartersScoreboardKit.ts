// wilt-100 "quarters": the shared numbers. The world is the same Hershey Sports Arena as `crowd`, in metres (x across
// the floor, y up, z down the vault toward the far end wall), with the same 4,124 seats taken (the same generator and
// seed), so the amber witnesses sit where they sat. The hero is the far end wall's scoreboard, close.
import { Easing } from "remotion";
import { ease, prog, useScene } from "../../../src/engine";

export const QS_AMBER = "#F2B33D";
export const QS_LABEL = "#8B949E";
export const QS_BULB = "#FFE9C2"; // a lit 1960s bulb, about 2700 K

export const qsLerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const qsClamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const qsRnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------- the words ---------- */
export function useQuartersT() {
  const { cue, cueEnd, scene } = useScene();
  return {
    born: scene.from - 6,
    from: scene.from,
    that: cue("That"), night: cue("night"), had: cue("had"),
    n23: cue("23"), n23End: cueEnd("23"), after1: cue("after"), quarter: cue("quarter"),
    n41: cue("41"), n41End: cueEnd("41"), half: cue("half"),
    and: cue("and"), n69: cue("69"), n69End: cueEnd("69"), after2: cue("after", 2), three: cue("three"),
    by: cue("By"), crowd: cue("crowd"), chanting: cue("chanting"), chantingEnd: cueEnd("chanting"),
    give: cue("Give"), it: cue("it"), to: cue("to"), wilt: cue("Wilt"), wiltEnd: cueEnd("Wilt"),
    end: scene.to,
  };
}
export type QuartersT = ReturnType<typeof useQuartersT>;

/* ---------- the arena (the numbers of `crowd`) ---------- */
export const QS_ARENA = {
  zNear: -46, zFar: 48.6,
  springX: 36.4, springY: 15.6, crownY: 31.5,
  ribs: 11,
  rinkX: 13, rinkZ: 30.5, rinkR: 8.5,
  courtX: 7.62, courtZ: 14.33,
};
export const qsVaultPt = (a: number): [number, number] => [QS_ARENA.springX * Math.cos(a), QS_ARENA.springY + (QS_ARENA.crownY - QS_ARENA.springY) * Math.sin(a)];
export const qsRibZ = (k: number) => qsLerp(QS_ARENA.zNear + 1.2, QS_ARENA.zFar - 1.2, k / (QS_ARENA.ribs - 1));

export type QsSeat = { x: number; y: number; z: number; row: number; bank: number; filled: boolean; order: number; side: number };
export const QS_COUNT = 4124;
function qsBuildSeats(): QsSeat[] {
  const SIDE_ROWS = 26, END_ROWS = 20, PITCH = 0.5;
  const seats: QsSeat[] = [];
  for (const s of [-1, 1]) {
    for (let r = 0; r < SIDE_ROWS; r++) {
      const x = s * (14.6 + r * 0.82), y = 1.0 + r * 0.57;
      let z = -30, n = 0;
      while (z < 30.4) {
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
  const score = seats.map((q, i) => {
    const mid = q.bank === 0 ? 0.3 : 1 - Math.abs(q.z) / 32;
    const clump = qsRnd(q.bank * 31 + q.side * 7.3 + Math.floor(q.row / 4) * 3.1);
    return { i, v: -q.row * 0.055 + mid * 0.9 + clump * 1.1 + qsRnd(i * 1.37) * 0.7 };
  });
  score.sort((a, b) => b.v - a.v);
  const filled = score.slice(0, QS_COUNT).map((s) => s.i);
  const ord = filled.map((i) => ({ i, k: seats[i].row + qsRnd(i * 0.71) * 7 + qsRnd(seats[i].side * 5.1 + seats[i].bank) * 5 }));
  ord.sort((a, b) => a.k - b.k);
  ord.forEach((o, n) => { seats[o.i].filled = true; seats[o.i].order = n; });
  return seats;
}
export const QS_SEATS = qsBuildSeats();

/** the scoreboard: a cabinet 1000 x 760 board units, 9 m wide, hung from the end wall under the last rib */
export const QS_BOARD = { x: 0, y: 19.4, z: QS_ARENA.zFar - 0.25, w: 9, units: 1000, uh: 760 };
export const QS_M = QS_BOARD.w / QS_BOARD.units; // metres per board unit
/** a board point (u, v in units, origin top left) in the world, with the cabinet's swing (radians, about its chains) */
export function qsBoardPt(u: number, v: number, swing = 0, out = 0): V3 {
  const x = (u - QS_BOARD.units / 2) * QS_M, y = -(v - QS_BOARD.uh / 2) * QS_M;
  // the swing pivots on the chain eyes, 1.6 m above the cabinet's top
  const py = (QS_BOARD.uh / 2) * QS_M + 1.6;
  const c = Math.cos(swing), s = Math.sin(swing);
  const rx = x * c - (y - py) * s, ry = x * s + (y - py) * c + py;
  return [QS_BOARD.x + rx, QS_BOARD.y + ry, QS_BOARD.z - out];
}

/* ---------- the camera ---------- */
export type V3 = [number, number, number];
export type QsCam = { pos: V3; tgt: V3; F: number; cx: number; cy: number; roll?: number };
export type QsProj = { x: number; y: number; z: number; s: number };
export type QsView = { cam: QsCam; P: (p: V3) => QsProj };

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const mixV = (a: V3, b: V3, k: number): V3 => [qsLerp(a[0], b[0], k), qsLerp(a[1], b[1], k), qsLerp(a[2], b[2], k)];

export function qsProject(cam: QsCam): QsView {
  const fwd = norm(sub(cam.tgt, cam.pos));
  let right = norm(cross([0, 1, 0], fwd));
  let up = cross(fwd, right);
  if (cam.roll) {
    const c = Math.cos(cam.roll), s = Math.sin(cam.roll);
    const r2: V3 = [right[0] * c + up[0] * s, right[1] * c + up[1] * s, right[2] * c + up[2] * s];
    up = cross(fwd, r2);
    right = r2;
  }
  const P = (p: V3): QsProj => {
    const d = sub(p, cam.pos);
    const z = dot(d, fwd);
    const zz = Math.max(z, 0.05);
    return { x: cam.cx + (cam.F * dot(d, right)) / zz, y: cam.cy - (cam.F * dot(d, up)) / zz, z, s: cam.F / zz };
  };
  return { cam, P };
}

const SMOOTH = Easing.bezier(0.55, 0, 0.2, 1);
type Key = { at: number; dur: number; pos: V3; tgt: V3; F: number };

/** low on the floor looking up the end wall, up to the board face, a slow push through the quarters, then back and
 *  down over the floor so the board hangs small at the top and the banks fill the stage */
export function qsCam(f: number, T: QuartersT): QsCam {
  const start = { pos: [0, 3.2, 20] as V3, tgt: [0, 13.5, 48] as V3, F: 950 };
  const keys: Key[] = [
    // the board framed low, so the end wall's ledge, conduits and board-formed concrete fill the stage under it
    { at: T.born + 2, dur: T.n23 - T.born - 20, pos: [0, 19.15, 36.9], tgt: [0, 19.2, 48.35], F: 1200 },
    // the push while the quarters land
    { at: T.n23 - 16, dur: T.three - T.n23 + 30, pos: [0.25, 19.1, 37.9], tgt: [0, 19.15, 48.35], F: 1200 },
    // back and down to behind the near free-throw line: the board small at the top, the banks of witnesses, and the
    // lit maple court, keyhole, centre circle and far basket filling the lower stage
    { at: T.by - 4, dur: T.chanting - T.by + 6, pos: [0, 10, -16], tgt: [0, 3.2, 30], F: 820 },
  ];
  let cur = { ...start };
  for (const k of keys) {
    const p = prog(f, k.at, k.dur, SMOOTH);
    if (p <= 0) break;
    cur = { pos: mixV(cur.pos, k.pos, p), tgt: mixV(cur.tgt, k.tgt, p), F: Math.exp(qsLerp(Math.log(cur.F), Math.log(k.F), p)) };
  }
  // the held picture keeps living: a slow push on the crowd
  const live = prog(f, T.chanting, T.end - T.chanting + 10, ease.linear);
  // a camera knock on each landing, the biggest on 69
  const knock = (at: number, a: number) => {
    const t = f - at;
    return t < 0 ? 0 : a * Math.exp(-t / 7) * Math.sin(t * 0.9);
  };
  const k = knock(T.n23, 0.04) + knock(T.n41, 0.05) + knock(T.n69, 0.1);
  return { pos: [cur.pos[0], cur.pos[1] + k, cur.pos[2]], tgt: cur.tgt, F: cur.F * (1 + 0.05 * live), cx: 540, cy: 985 };
}

/** the cabinet's swing on its chains (radians): a jolt on 23 and 41, one big swing on 69, a shiver on "Wilt!" */
export function qsSwing(f: number, T: QuartersT) {
  const sw = (at: number, a: number, per: number, tau: number) => {
    const t = f - at;
    return t < 0 ? 0 : a * Math.exp(-t / tau) * Math.sin((t / per) * Math.PI * 2);
  };
  return sw(T.n23, 0.006, 40, 18) + sw(T.n41, 0.009, 44, 20) + sw(T.n69, 0.03, 58, 46) + sw(T.wilt, 0.006, 22, 14);
}

/** the affine map from board units onto the cabinet's plane (an SVG matrix) */
export function qsBoardMatrix(V: QsView, swing: number): string {
  const p0 = V.P(qsBoardPt(0, 0, swing)), p1 = V.P(qsBoardPt(100, 0, swing)), p2 = V.P(qsBoardPt(0, 100, swing));
  const a = (p1.x - p0.x) / 100, b = (p1.y - p0.y) / 100, c = (p2.x - p0.x) / 100, d = (p2.y - p0.y) / 100;
  return `matrix(${a.toFixed(5)} ${b.toFixed(5)} ${c.toFixed(5)} ${d.toFixed(5)} ${p0.x.toFixed(2)} ${p0.y.toFixed(2)})`;
}

/** the flip panel's value at frame f: it runs up through real-looking steps and lands on each spoken number */
export const QS_FLIP = 5;
export function qsSteps(T: QuartersT): [number, number][] {
  const runs: [number, number[]][] = [
    [T.n23, [2, 5, 9, 13, 16, 19, 21, 23]],
    [T.n41, [27, 31, 35, 38, 40, 41]],
    [T.n69, [46, 51, 56, 61, 65, 68, 69]],
  ];
  const s: [number, number][] = [[-1e9, 0]];
  for (const [at, vals] of runs) {
    // the last flap falls on the word: each step 4 frames, the final one lands at `at`
    vals.forEach((v, i) => s.push([at - QS_FLIP - (vals.length - 1 - i) * 3, v]));
  }
  return s;
}
export function qsFlipAt(f: number, T: QuartersT) {
  const s = qsSteps(T);
  let i = 0;
  while (i < s.length - 1 && f >= s[i + 1][0]) i++;
  const prev = i > 0 ? s[i - 1][1] : s[i][1];
  return { at: s[i][0], val: s[i][1], prev, k: prog(f, s[i][0], QS_FLIP, ease.linear) };
}

/** the line score, from the box score: PHW 42 37 46 (44), NYK 26 42 38 (41); column 4 stays dark here */
export const QS_LINE = { PHW: [42, 37, 46, 44], NYK: [26, 42, 38, 41] };
