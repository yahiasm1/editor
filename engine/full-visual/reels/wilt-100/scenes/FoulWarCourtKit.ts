// wilt-100 "fouls": the shared numbers. The world is the 1962 floor of Hershey Sports Arena in feet: x across the
// court (sidelines at -25 and +25), z from Wilt's baseline (0) toward midcourt (47) and the far end (94), y up.
// One camera, real projection: it drops from the stands at the far end to straight down over this half.
// Every time is a word of caption.txt; every player, the ball and the ref move on those words.
import { Easing } from "remotion";
import { ease, prog, useScene } from "../../../src/engine";
import { QS_ARENA, type QsCam } from "./QuartersScoreboardKit";

export const FWC_AMBER = "#F2B33D";
export const FWC_LABEL = "#8B949E";
export const FWC_PAPER = "#EFE6D2";
export const FWC_INK = "#1B1B1B";
export const FWC_PENCIL = "#3A3836";

export const fwcLerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const fwcClamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const fwcRnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------- the words ---------- */
export function useFoulWarT() {
  const { cue, cueEnd, scene } = useScene();
  const T = {
    born: scene.from - 6,
    from: scene.from,
    then: cue("Then"), got: cue("got"), silly: cue("silly"), sillyEnd: cueEnd("silly"),
    the1: cue("The"), knicks: cue("Knicks"), started: cue("started"),
    fouling: cue("fouling"), other: cue("other"), warriors: cue("Warriors"), warriorsEnd: cueEnd("Warriors"),
    just: cue("just"), keep: cue("keep"), ball: cue("ball"), away: cue("away"), from_: cue("from"), him: cue("him"), himEnd: cueEnd("him"),
    and: cue("and"), warriors2: cue("Warriors", 2), fouled: cue("fouled"), right: cue("right"), back: cue("back"),
    get: cue("get"), again: cue("again"), againEnd: cueEnd("again"),
    end: scene.to,
  };
  // derived beats: the fouls the pictures add between the words (never on a typed second)
  return {
    ...T,
    ft: T.warriors + 10, // the free throw leaves the line
    ftIn: T.warriors + 30, // and drops through
    passOut: T.ball - 2, // the pass that bends away
    passLand: T.away + 14,
    foul2: T.away + 16,
    foul3: T.himEnd + 4,
    toKnicks: T.and - 4, // the Knicks' ball now
    foul4: T.fouled,
    backLand: T.back + 2,
    straightOut: T.again - 20,
    catch_: T.again,
    // he turns and drops it in straight away, so the ball is through the net before the floor clears
    dunk: T.again + 6,
    runFrom: T.fouled + 8, // the tallies run to the box totals and land on "again"
    // the handover: the next scene (freethrows) mounts LEAD = 6 frames before scene.to and opens on its K0 camera,
    // straight down over this half with an empty floor. The camera settles onto K0 and the people, ball, sheet and
    // whistle clear in the last frames, so the floor carries straight on with no snap.
    outCam: T.again + 4,
    out: T.end - 7,
  };
}
export type FoulWarT = ReturnType<typeof useFoulWarT>;

/* ---------- the camera ---------- */
export type FwcCam = { phi: number; D: number; tx: number; tz: number; F: number; cy: number };

/* `quarters` ends inside the same arena, low behind the near baseline, looking up the floor at the far basket and the
   scoreboard. Its world is in metres with the court centred on the origin and the far basket at +z; ours is in feet
   from Wilt's baseline. Wilt's basket is quarters' far basket, so a point maps (x, y, z) ft -> (x, y, 14.33 - z) m. */
const FT = 0.3048;
const QZ0 = QS_ARENA.courtZ;
/** quarters' camera as one of ours: the same picture, the court lines on the same pixels */
export function fwcFromQs(q: QsCam): FwcCam {
  const [px, py, pz] = q.pos, [gx, gy, gz] = q.tgt;
  const t = py / Math.max(1e-6, py - gy);
  const hx = px + t * (gx - px), hz = pz + t * (gz - pz);
  const dist = Math.hypot(px - hx, py, pz - hz);
  return { phi: Math.asin(py / dist), D: dist / FT, tx: hx / FT, tz: (QZ0 - hz) / FT, F: q.F, cy: q.cy };
}
/** ours as quarters': to draw its arena from where our camera is */
export function fwcToQs(c: FwcCam): QsCam {
  const sp = Math.sin(c.phi), cp = Math.cos(c.phi);
  return {
    pos: [c.tx * FT, c.D * sp * FT, QZ0 - (c.tz + c.D * cp) * FT],
    tgt: [c.tx * FT, 0, QZ0 - c.tz * FT],
    F: c.F, cx: 540, cy: c.cy,
  };
}
const camPos = (c: FwcCam): [number, number, number] => [c.tx, c.D * Math.sin(c.phi), c.tz + c.D * Math.cos(c.phi)];
/** the move between two cameras: the lens and the point it looks at travel in straight lines, the focal length in log */
function fwcMix(a: FwcCam, b: FwcCam, k: number): FwcCam {
  if (k <= 0) return a;
  if (k >= 1) return b;
  const pa = camPos(a), pb = camPos(b);
  const p = [fwcLerp(pa[0], pb[0], k), fwcLerp(pa[1], pb[1], k), fwcLerp(pa[2], pb[2], k)];
  const tx = fwcLerp(a.tx, b.tx, k), tz = fwcLerp(a.tz, b.tz, k);
  const D = Math.hypot(p[0] - tx, p[1], p[2] - tz);
  return { phi: Math.atan2(p[1], p[2] - tz), D, tx, tz, F: Math.exp(fwcLerp(Math.log(a.F), Math.log(b.F), k)), cy: fwcLerp(a.cy, b.cy, k) };
}
/** how far the drop from quarters' camera to straight down has gone (0 on our first frame, 1 just before "silly") */
export const fwcDrop = (f: number, T: FoulWarT) => prog(f, T.born, T.silly - 4 - T.born, Easing.inOut(Easing.cubic));
/** quarters' picture, carried over our floor while the camera leaves it: 1 on our first frame, gone as it climbs */
export const fwcArena = (f: number, T: FoulWarT) => 1 - fwcClamp((fwcDrop(f, T) - 0.2) / 0.45);

/** `from`: quarters' camera on this frame, when the reel has `quarters` before us (then our first frame is its picture) */
export function fwcCam(f: number, T: FoulWarT, from?: QsCam | null): FwcCam {
  const k = fwcDrop(f, T);
  // a slow push all scene long, and a small lean toward #13 on "again"
  const push = prog(f, T.silly, T.end - T.silly, ease.linear);
  const lean = prog(f, T.back, 40, ease.inOut);
  // straight down over this half: where the drop lands
  const over: FwcCam = { phi: Math.PI / 2, D: 98 - 5 * push - 3 * lean, tx: 1.0 * lean, tz: 20 - 2 * lean, F: 1680, cy: 992 };
  let c: FwcCam;
  if (from) c = fwcMix(fwcFromQs(from), over, k);
  else {
    // on its own (no quarters before it): a drop from high over the far stands
    const phi = fwcLerp(26, 90, k) * (Math.PI / 180);
    c = { phi, D: fwcLerp(150, 98, k) - 5 * push - 3 * lean, tx: 1.0 * lean, tz: fwcLerp(2, 20, k) - 2 * lean, F: 1680, cy: fwcLerp(1010, 992, k) };
  }
  // settle onto freethrows' opening camera (its K0 in FreeThrowTallyKit.ts) by the last visible frame
  const o = fwcOut(f, T);
  if (o <= 0) return c;
  return {
    phi: fwcLerp(c.phi, Math.PI / 2, o),
    D: fwcLerp(c.D, 109, o),
    tx: fwcLerp(c.tx, 0, o),
    tz: fwcLerp(c.tz, 21, o),
    F: 1680,
    cy: fwcLerp(c.cy, 876, o),
  };
}
/** the settle onto freethrows' first frame: 0 until "again" + 4, 1 on our last visible frame */
export const fwcOut = (f: number, T: FoulWarT) => prog(f, T.outCam, T.out - T.outCam, Easing.inOut(Easing.cubic));
/** 1 until the handover, 0 on the last visible frame: what is on the floor clears so the next scene's empty floor follows */
export const fwcClear = (f: number, T: FoulWarT) => 1 - prog(f, T.out - 10, 10, ease.in);
export type FwcP = { x: number; y: number; s: number; d: number };
export function fwcProject(c: FwcCam, x: number, y: number, z: number): FwcP {
  const sp = Math.sin(c.phi), cp = Math.cos(c.phi);
  const vx = x - c.tx, vy = y - c.D * sp, vz = z - (c.tz + c.D * cp);
  const d = -vy * sp - vz * cp;
  const yc = vy * cp - vz * sp;
  const dd = Math.max(0.5, d);
  return { x: 540 + (c.F * vx) / dd, y: c.cy - (c.F * yc) / dd, s: c.F / dd, d };
}

/* ---------- the court, 1962 ---------- */
export const FWC_COURT = {
  halfW: 25, len: 94, mid: 47,
  laneHalf: 6, ftZ: 19, ftR: 6, boardZ: 4, boardHalf: 3, rimZ: 5.25, rimR: 0.75,
  apronX: 29.5, apronZ0: -5, apronZ1: 99,
};

/* ---------- the people ---------- */
export type FwcWho = "W13" | "G1" | "G2" | "F1" | "F2" | "K1" | "K2" | "K3" | "K4" | "KC" | "R1" | "R2";
type Key = [number, number, number]; // frame, x, z

function track(f: number, keys: Key[]): [number, number] {
  if (f <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 1; i < keys.length; i++) {
    const [f1, x1, z1] = keys[i];
    const [f0, x0, z0] = keys[i - 1];
    if (f <= f1) {
      const k = Easing.inOut(Easing.cubic)(fwcClamp((f - f0) / Math.max(1, f1 - f0)));
      return [fwcLerp(x0, x1, k), fwcLerp(z0, z1, k)];
    }
  }
  const l = keys[keys.length - 1];
  return [l[1], l[2]];
}

const BASKET: [number, number] = [0, FWC_COURT.rimZ];

/** where each of the twelve on the floor stands on this frame */
export function fwcPeople(f: number, T: FoulWarT): Record<FwcWho, [number, number]> {
  const W13 = track(f, [
    [T.born, 8.5, 12], [T.knicks, 8.5, 11], [T.started + 8, 3.4, 6.6], [T.warriors, 3.4, 7.2],
    [T.just, 2.2, 7.6], [T.away, 2.6, 7.4], [T.and + 6, 1.0, 13.5], [T.fouled, 0.2, 14.5],
    [T.back - 6, 2.4, 9.5], [T.again - 4, 3.0, 7.4], [T.dunk - 2, 1.6, 6.3], [T.end, 1.2, 6.0],
  ]);
  const G1 = track(f, [
    [T.born, -3, 32], [T.the1, -3, 31], [T.started, -6.5, 28], [T.warriors, -6, 28],
    [T.just, -1.5, 26.5], [T.away + 10, -1, 25], [T.and, -2, 25], [T.warriors2 + 6, -4.5, 27.5],
    [T.fouled, -4.6, 26.3], [T.back - 8, -8.5, 28.5], [T.back + 10, -7, 27], [T.end, -6.5, 26.5],
  ]);
  const G2 = track(f, [
    [T.born, 12.5, 27], [T.the1, 12.5, 26], [T.started + 4, 11.5, 24], [T.fouling, 11, 23.5],
    [T.fouling + 6, 12.6, 25.2], [T.warriors, 6, 21], [T.warriorsEnd, 0, 19.2], [T.ftIn + 4, 0, 19.2],
    [T.just + 14, 13, 23], [T.and, 13, 22], [T.warriors2 + 4, 1.5, 25], [T.back, 3, 28], [T.end, 10, 24],
  ]);
  const F1 = track(f, [
    [T.born, -16, 14], [T.just, -15.5, 13.5], [T.away + 12, -16.5, 12], [T.away + 22, -17.4, 12.8],
    [T.and, -15, 13], [T.warriors2 + 6, -7.8, 22.5], [T.back, -9, 21], [T.end, -14, 15],
  ]);
  const F2 = track(f, [
    [T.born, 17, 8], [T.from_, 16.5, 9], [T.himEnd, 18.5, 11], [T.himEnd + 10, 19.2, 12.2],
    [T.and, 17, 10], [T.warriors2 + 8, 2.5, 31], [T.back, 4, 30], [T.end, 15, 9],
  ]);
  // the Knicks: tight on their man between him and the basket, with their lunges on the fouls
  const guard = (man: [number, number], k: number): [number, number] => [fwcLerp(man[0], BASKET[0], k), fwcLerp(man[1], BASKET[1], k)];
  const lunge = (p: [number, number], man: [number, number], at: number, amt = 0.85): [number, number] => {
    const go = prog(f, at - 8, 8, ease.in) - prog(f, at + 6, 18, ease.out);
    return [fwcLerp(p[0], man[0], go * amt), fwcLerp(p[1], man[1], go * amt)];
  };
  const knicksOnBall = prog(f, T.toKnicks, 30, ease.inOut); // the side switch: the Knicks attack the far end
  const flee = (p: [number, number], dz: number): [number, number] => [p[0], p[1] + dz * knicksOnBall];

  let K1 = guard(G1, 0.13 - 0.07 * prog(f, T.silly - 6, 12, ease.out));
  K1 = flee(K1, 0);
  // once the ball is theirs, K1 brings it up the floor toward midcourt
  const K1run = track(f, [[T.toKnicks, -2, 21], [T.warriors2, -3, 24.5], [T.fouled, -3.6, 25.5], [T.back, -3.2, 26.5], [T.end, 2, 33]]);
  K1 = [fwcLerp(K1[0], K1run[0], knicksOnBall), fwcLerp(K1[1], K1run[1], knicksOnBall)];
  let K2 = lunge(guard(G2, 0.14), G2, T.fouling, 0.9);
  K2 = flee(K2, 8);
  let K3 = lunge(guard(F1, 0.14), F1, T.foul2, 0.85);
  K3 = flee(K3, 9);
  let K4 = lunge(guard(F2, 0.14), F2, T.foul3, 0.85);
  K4 = flee(K4, 12);
  const KCb: [number, number] = [W13[0] + 0.9, W13[1] - 3.7];
  const KC = flee(KCb, 4);
  const R1 = track(f, [[T.born, -27, 21], [T.fouling, -27, 20], [T.just, -27, 17], [T.away, -27, 15], [T.and, -27, 20], [T.fouled, -27, 25], [T.end, -27, 22]]);
  const R2 = track(f, [[T.born, 27, 5], [T.just, 27, 7], [T.and, 27, 6], [T.end, 27, 9]]);
  return { W13, G1, G2, F1, F2, K1, K2, K3, K4, KC, R1, R2 };
}

export const FWC_WARRIORS: FwcWho[] = ["W13", "G1", "G2", "F1", "F2"];
export const FWC_KNICKS: FwcWho[] = ["K1", "K2", "K3", "K4", "KC"];

/* ---------- the ball ---------- */
// a flight: from a point to a point, a lob height, and a bend (feet of sideways push at the middle, away from #13)
export type FwcFlight = { a: number; b: number; from: [number, number]; to: [number, number]; h: number; bend: [number, number] };

function quad(p0: [number, number], c: [number, number], p1: [number, number], t: number): [number, number] {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
}
export function fwcFlightAt(fl: FwcFlight, t: number): [number, number, number] {
  const mid: [number, number] = [(fl.from[0] + fl.to[0]) / 2 + fl.bend[0], (fl.from[1] + fl.to[1]) / 2 + fl.bend[1]];
  const [x, z] = quad(fl.from, mid, fl.to, t);
  return [x, fl.h * 4 * t * (1 - t), z];
}

/** the pass that bends: control point pushed away from #13's side of the straight line */
export function fwcBendAround(from: [number, number], to: [number, number], wilt: [number, number], push: number): [number, number] {
  const mx = (from[0] + to[0]) / 2, mz = (from[1] + to[1]) / 2;
  let dx = mx - wilt[0], dz = mz - wilt[1];
  const l = Math.hypot(dx, dz) || 1;
  dx /= l; dz /= l;
  return [dx * push, dz * push];
}

/** the ball on this frame: who has it, or where it flies; and its live flight (for the trail) */
export function fwcBall(f: number, T: FoulWarT, P: Record<FwcWho, [number, number]>) {
  const at = (w: FwcWho, t: number) => fwcPeople(t, T)[w];
  const wiltAt = (t: number) => fwcPeople(t, T).W13;
  const rim: [number, number] = [0, FWC_COURT.rimZ];
  const flights: (FwcFlight & { trail: boolean })[] = [
    // guard to guard on "The Knicks started"
    { a: T.the1, b: T.started + 6, from: at("G1", T.the1), to: at("G2", T.started + 6), h: 3, bend: [0, 0], trail: false },
    // the free throw
    { a: T.ft, b: T.ftIn, from: [0, 19.2], to: rim, h: 9, bend: [0, 0], trail: false },
    // through the net and back out to the guard: the Warriors bring it up again
    { a: T.ftIn + 4, b: T.just + 16, from: rim, to: at("G1", T.just + 16), h: 4, bend: [-3, 0], trail: false },
    // the pass that bends away from #13 to the wing
    { a: T.passOut, b: T.passLand, from: at("G1", T.passOut), to: at("F1", T.passLand), h: 2.5, bend: fwcBendAround(at("G1", T.passOut), at("F1", T.passLand), wiltAt(T.away), 9), trail: true },
    // and one more, round him to the other side
    { a: T.from_ - 2, b: T.himEnd + 2, from: at("F1", T.from_ - 2), to: at("F2", T.himEnd + 2), h: 2.5, bend: fwcBendAround(at("F1", T.from_ - 2), at("F2", T.himEnd + 2), wiltAt(T.him), 10), trail: true },
    // the Knicks' ball now: the ref hands it to them at the baseline, to K1
    { a: T.toKnicks, b: T.toKnicks + 18, from: [-15, 1], to: at("K1", T.toKnicks + 18), h: 3, bend: [0, 0], trail: false },
    // fouled: the ball goes back to the Warriors at once
    { a: T.back - 12, b: T.backLand, from: at("K1", T.back - 12), to: at("G1", T.backLand), h: 4, bend: [0, 0], trail: false },
    // straight inside to #13
    { a: T.straightOut, b: T.catch_, from: at("G1", T.straightOut), to: at("W13", T.catch_), h: 1.8, bend: [0, 0], trail: true },
    // he turns and drops it in
    { a: T.dunk - 4, b: T.dunk + 5, from: at("W13", T.dunk - 4), to: rim, h: 5, bend: [0, 0], trail: false },
  ];
  // holders between flights
  const holds: [number, number, FwcWho | "rim" | "floor"][] = [
    [-1e9, T.the1, "G1"], [T.started + 6, T.ft, "G2"], [T.ftIn, T.ftIn + 4, "rim"], [T.just + 16, T.passOut, "G1"],
    [T.passLand, T.from_ - 2, "F1"], [T.himEnd + 2, T.toKnicks, "F2"], [T.toKnicks + 18, T.back - 12, "K1"],
    [T.backLand, T.straightOut, "G1"], [T.catch_, T.dunk - 4, "W13"], [T.dunk + 5, 1e9, "rim"],
  ];
  for (const fl of flights) {
    if (f >= fl.a && f < fl.b) {
      const t = (f - fl.a) / (fl.b - fl.a);
      const [x, h, z] = fwcFlightAt(fl, Easing.inOut(Easing.quad)(t));
      return { x, z, h: h + 3.2, live: fl.trail ? { fl, t } : null };
    }
  }
  for (const [a, b, who] of holds) {
    if (f >= a && f < b) {
      if (who === "rim") return { x: rim[0], z: rim[1], h: 2 + 8 * (1 - prog(f, a, 10, ease.in)), live: null };
      if (who === "floor") return { x: 0, z: 0, h: 0.4, live: null };
      const p = P[who];
      // carried at the hip, toward the side the player faces the basket from; a dribble bounce
      const bounce = Math.abs(Math.sin((f - a) * 0.38)) * 2.4;
      return { x: p[0] + 1.6, z: p[1] - 0.6, h: 1 + bounce, live: null };
    }
  }
  return { x: P.G1[0], z: P.G1[1], h: 3, live: null };
}

/** the old passes of the quarter, all bending round #13: drawn faint from "away" on */
export const FWC_GHOSTS: { from: [number, number]; to: [number, number]; push: number }[] = [
  { from: [-2, 27], to: [-17, 10], push: 8 },
  { from: [8, 26], to: [18, 6], push: 9 },
  { from: [-8, 22], to: [-14, 3], push: 7 },
  { from: [12, 22], to: [-6, 24], push: 6 },
  { from: [-14, 16], to: [16, 12], push: 11 },
  { from: [4, 30], to: [20, 14], push: 8 },
  { from: [-19, 8], to: [12, 26], push: 9 },
];
export const fwcGhostAt = (T: FoulWarT, i: number) => T.away + 6 + i * 5;

/** the whistle blows: each foul, the frame it lands on */
export const fwcWhistles = (T: FoulWarT) => [T.silly, T.fouling, T.foul2, T.foul3, T.foul4];

/** the pencil tallies: marks shown on this frame (a fraction is a stroke being drawn) */
export function fwcTally(f: number, T: FoulWarT) {
  const stroke = (at: number) => prog(f, at, 5, ease.out);
  let kn = stroke(T.fouling) + stroke(T.foul2) + stroke(T.foul3);
  for (let i = 0; i < FWC_GHOSTS.length - 2; i++) kn += stroke(fwcGhostAt(T, i) + 3);
  const knBefore = 3 + FWC_GHOSTS.length - 2; // 8 by the time the Warriors start fouling back
  const run = (from: number, to: number) => (f < T.runFrom ? from : from + (to - from) * prog(f, T.runFrom, T.again - T.runFrom, Easing.inOut(Easing.quad)));
  if (f >= T.runFrom) kn = run(knBefore, 32);
  let wa = stroke(T.foul4);
  if (f >= T.runFrom) wa = run(1, 25);
  return { kn, wa };
}
