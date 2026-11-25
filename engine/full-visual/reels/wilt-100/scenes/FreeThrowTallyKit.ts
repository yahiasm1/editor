// wilt-100 "freethrows": the shared numbers. The world is the 1962 floor of Hershey Sports Arena in feet, the same
// frame as `fouls` (FoulWarCourtKit): x across (sidelines at -25 and +25), z from the baseline (0) toward midcourt,
// y up. One orbit camera: it starts straight down over this half (where `fouls` ends) and cranes down to the
// shooter's eyes, low behind the free throw line. Every time is a word of caption.txt.
// Data: Basketball-Reference box (FT 28 of 32, .875) and game log 1961-62 (FT 835 of 1,362, .613).
import { Easing } from "remotion";
import { ease, prog, useScene } from "../../../src/engine";

// Courier Prime is loaded once for the reel (the game log scene loads it); named here, not loaded twice
export const FTT_COURIER = "'Courier Prime', 'Courier New', monospace";
export const FTT_PAPER = "#EFE6D2";
export const FTT_INK = "#1B1B1B";
export const FTT_PENCIL = "#34312E";
export const FTT_RED = "#B42A20";
export const FTT_DIM = "#8B949E";
export const FTT_AMBER = "#F2B33D";
export const FTT_PUSH = Easing.bezier(0.55, 0, 0.2, 1);

export const fttLerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const fttClamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const fttRnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const FTT_MADE = 28;
export const FTT_ATT = 32;

/* ---------- the court, 1962 (same numbers as `fouls`) ---------- */
export const FTT_COURT = { halfW: 25, laneHalf: 6, ftZ: 19, ftR: 6, boardZ: 4, rimZ: 5.25, rimR: 0.75, rimY: 10, ballR: 0.39 };

/* ---------- the words ---------- */
export function useFreeThrowT() {
  const { cue, cueEnd, scene } = useScene();
  const T = {
    born: scene.from - 6,
    from: scene.from,
    end: scene.to,
    and1: cue("And"),
    wildest: cue("wildest"),
    part: cue("part?"),
    wilt: cue("Wilt"),
    known: cue("known"),
    terrible: cue("terrible"),
    free: cue("free"),
    shooter: cue("shooter,"),
    and2: cue("and", 2), // cue() folds case: the first "and" is the opening "And"
    night: cue("night"),
    made: cue("made"),
    n28: cue("28"),
    of: cue("of"),
    n32: cue("32."),
    n32End: cueEnd("32."),
    other: cue("Other"),
    players: cue("players"),
    believe: cue("believe"),
    it: cue("it."),
  };
  // the 28 makes: each ball drops through the rim on its frame, slow at first, then a rain; the 28th on "28"
  const t0 = T.night - 6;
  const makes = Array.from({ length: FTT_MADE }, (_, i) => Math.round(t0 + (T.n28 - t0) * Math.pow((i + 1) / FTT_MADE, 0.62)));
  // the four misses rattle out between "of" and "32.", the last on "32."
  const misses = [0, 1, 2, 3].map((j) => T.n32 - 15 + 5 * j);
  return {
    ...T,
    makes,
    misses,
    hero: T.part, // the first ball drops through on "part?"
    clang: T.shooter, // the season miss hits the rim on "shooter,"
    sheetIn: T.wilt - 4,
    unroll: T.and2 - 2,
    lift: T.other - 2,
  };
}
export type FreeThrowT = ReturnType<typeof useFreeThrowT>;

/** checks inked by frame f */
export const fttMadeBy = (f: number, T: FreeThrowT) => T.makes.filter((m) => f >= m).length;

/* ---------- the camera ---------- */
export type FttCam = { phi: number; D: number; tx: number; ty: number; tz: number; F: number; cy: number };
export type FttP = { x: number; y: number; s: number; d: number };

export function fttProject(c: FttCam, x: number, y: number, z: number): FttP {
  const sp = Math.sin(c.phi), cp = Math.cos(c.phi);
  const vx = x - c.tx, vy = y - (c.ty + c.D * sp), vz = z - (c.tz + c.D * cp);
  const d = -vy * sp - vz * cp;
  const yc = vy * cp - vz * sp;
  const dd = Math.max(0.4, d);
  return { x: 540 + (c.F * vx) / dd, y: c.cy - (c.F * yc) / dd, s: c.F / dd, d };
}

/** camera from a position and a target, with cy chosen so the rim centre lands on screen y `rimAt` */
function look(px: number, py: number, pz: number, tx: number, ty: number, tz: number, F: number, rimAt: number): FttCam {
  const dy = py - ty, dz = pz - tz;
  const c: FttCam = { phi: Math.atan2(dy, dz), D: Math.hypot(dy, dz), tx, ty, tz, F, cy: 0 };
  const r = fttProject(c, 0, FTT_COURT.rimY, FTT_COURT.rimZ);
  c.cy = rimAt - r.y;
  return c;
}

// where `fouls` leaves its camera: straight down over this half
const K0: FttCam = { phi: Math.PI / 2, D: 109, tx: 0, ty: 0, tz: 21, F: 1680, cy: 876 };
// the shooter's eyes, low behind the line, the basket up in the stage
const K1 = look(0, 6.4, 32, 0, 7.4, 6, 1380, 900);
// backed off and up a little: the basket at the top of the stage, above the sheet
const K2 = look(0.6, 8.2, 27.5, 0.4, 9.6, 5, 1260, 642);
// the sheet eases up: the basket goes up behind the caption band
const K3 = { ...K2, cy: K2.cy - 230 };

const mixCam = (a: FttCam, b: FttCam, k: number): FttCam => ({
  phi: fttLerp(a.phi, b.phi, k),
  D: fttLerp(a.D, b.D, k),
  tx: fttLerp(a.tx, b.tx, k),
  ty: fttLerp(a.ty, b.ty, k),
  tz: fttLerp(a.tz, b.tz, k),
  F: fttLerp(a.F, b.F, k),
  cy: fttLerp(a.cy, b.cy, k),
});

export function fttCam(f: number, T: FreeThrowT): FttCam {
  // the crane ends on "wildest"
  const k1 = prog(f, T.born, T.wildest + 2 - T.born, Easing.inOut(Easing.cubic));
  let c = mixCam(K0, K1, k1);
  // a breath of push in while the first ball flies
  const push = prog(f, T.wildest, T.wilt - T.wildest, ease.linear);
  c = { ...c, D: c.D - 1.6 * push };
  const k2 = prog(f, T.wilt - 6, 26, FTT_PUSH);
  c = mixCam(c, K2, k2);
  // a slow push all through the tally
  const push2 = prog(f, T.wilt + 20, T.end - T.wilt - 20, ease.linear);
  c = { ...c, D: c.D - 1.8 * push2 };
  const k3 = prog(f, T.lift, 22, FTT_PUSH);
  return { ...c, cy: fttLerp(c.cy, K3.cy - (1.8 * push2 * 0), k3) };
}

/* ---------- the balls ---------- */
export type FttShot = { id: number; rim: number; dur: number; make: boolean; sx: number; side: number };

export function fttShots(T: FreeThrowT): FttShot[] {
  const out: FttShot[] = [];
  out.push({ id: 0, rim: T.hero, dur: 28, make: true, sx: 0.15, side: 1 });
  out.push({ id: 1, rim: T.clang, dur: 22, make: false, sx: -0.1, side: 1 });
  T.makes.forEach((m, i) => out.push({ id: 10 + i, rim: m, dur: i < 3 ? 20 : 15, make: true, sx: (fttRnd(i + 3) - 0.5) * 0.6, side: 1 }));
  T.misses.forEach((m, j) => out.push({ id: 50 + j, rim: m, dur: 15, make: false, sx: (fttRnd(j + 41) - 0.5) * 0.5, side: j % 2 ? -1 : 1 }));
  return out;
}

export type FttBallState = { x: number; y: number; z: number; spin: number; through: boolean; alpha: number };

/** where a shot's ball is on frame f, or null when it is not in the air */
export function fttBall(f: number, s: FttShot): FttBallState | null {
  const C = FTT_COURT;
  const launch = s.rim - s.dur;
  if (f < launch) return null;
  const sx = s.sx, sy = 3.1, sz = C.ftZ + 1.3; // underhand, from low at the line
  if (f <= s.rim) {
    const t = (f - launch) / s.dur;
    // aim: a make drops at the rim centre, a miss hits the front of the rim
    const ex = 0, ey = C.rimY + C.ballR * 0.6, ez = s.make ? C.rimZ : C.rimZ + C.rimR * 0.95;
    const h = s.dur > 24 ? 5.4 : 6.2;
    return {
      x: fttLerp(sx, ex, t),
      y: fttLerp(sy, ey, t) + h * 4 * t * (1 - t),
      z: fttLerp(sz, ez, t),
      spin: -t * 5.5,
      through: false,
      alpha: 1,
    };
  }
  const a = f - s.rim;
  if (s.make) {
    // down through the net, then on to the floor and out
    if (a > 22) return null;
    const y = C.rimY + C.ballR * 0.6 - (a * a) * 0.034 - a * 0.16;
    return { x: 0, y, z: C.rimZ + a * 0.02, spin: -5.5 - a * 0.1, through: a < 14, alpha: 1 - prog(a, 14, 8) };
  }
  // the rim kicks it out, high and to the side, toward the camera
  if (a > 26) return null;
  return {
    x: s.side * a * 0.16,
    y: C.rimY + C.ballR * 0.8 + a * 0.2 - a * a * 0.018,
    z: C.rimZ + C.rimR + a * 0.42,
    spin: -5.5 + a * 0.3,
    through: false,
    alpha: 1 - prog(a, 18, 8),
  };
}

/** how hard the net is whipping on frame f (sum of decaying pulses from every make) */
export function fttNetWhip(f: number, shots: FttShot[]) {
  let w = 0;
  for (const s of shots) {
    if (!s.make) continue;
    const a = f - s.rim - 3;
    if (a < 0 || a > 30) continue;
    w += Math.exp(-a / 7) * Math.sin(Math.min(1, a / 4) * Math.PI * 0.5 + a * 0.35);
  }
  return Math.max(-0.6, Math.min(1.4, w));
}

/** the rim shaking after a miss */
export function fttRimShake(f: number, shots: FttShot[]) {
  let v = 0;
  for (const s of shots) {
    if (s.make) continue;
    const a = f - s.rim;
    if (a < 0 || a > 24) continue;
    v += Math.exp(-a / 5) * Math.sin(a * 1.9) * 0.09;
  }
  return v;
}
