// HookX1 "The tape reels in": times, the one camera, and the tape's state, every number a word of caption.txt.
// The world is the reel's floor (PaintedKinkWorld.ts): feet, origin = middle of the basket, +x right, +y toward half
// court. The camera ends exactly on PK_ARC_FRAME, the picture `answer` starts on (HookX1.keep = true).
import { Easing } from "remotion";
import { ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { PK_ARC_FRAME, PK_ARC_R, PK_CORNER_X, PK_KINK_A, type PaintedKinkCam } from "./PaintedKinkWorld";

export const HX1_R = PK_ARC_R; // 23.75
export const HX1_CORNER = PK_CORNER_X; // 22
export const HX1_KINK_A = PK_KINK_A;
export const hx1Clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const hx1Lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const hx1Rnd = (i: number, seed = 1) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export function useHookX1T() {
  const { cue, scene } = useScene();
  const closer = cue("closer");
  return {
    nba: cue("NBA"),
    three: cue("three-point"),
    line: cue("line"),
    isnt: cue("isn't"),
    same: cue("same"),
    distance: cue("distance"),
    every: cue("everywhere"),
    corners: cue("corners"),
    almost: cue("almost"),
    two: cue("two"),
    feet: cue("feet"),
    closer,
    slam: closer + 5, // the case meets the painted line
    out: closer + 21, // 0.3 s of payoff, then the blade goes home and the camera rises
    end: scene.to - LEAD, // `answer` draws from here on
  };
}
export type HookX1T = ReturnType<typeof useHookX1T>;

/** a top-down view: px per foot, and the world point shown at the stage point (540, 1000) */
type View = { s: number; x: number; y: number };
const ARC: View = { s: 20.8, x: 0, y: 14 + (1019.6 - 1000) / 20.8 };
const CORNER: View = { s: 95, x: 22.3, y: (896 - 1000) / 95 }; // rim level at y 896, baseline at y 1395
const CORNER_IN: View = { s: 98, x: 22.38, y: (900 - 1000) / 98 }; // the slow push while the corner holds
const between = (a: View, b: View, k: number): View => {
  if (k <= 0) return a;
  if (k >= 1) return b;
  const s = a.s * Math.pow(b.s / a.s, k);
  const q = (1 / s - 1 / a.s) / (1 / b.s - 1 / a.s); // even zoom: the anchor moves with the scale
  return { s, x: hx1Lerp(a.x, b.x, q), y: hx1Lerp(a.y, b.y, q) };
};
const DIVE = Easing.bezier(0.5, 0, 0.12, 1);
const RISE = Easing.bezier(0.42, 0, 0.2, 1);

export function hookX1Dive(f: number, T: HookX1T) {
  const start = T.corners - 36;
  return prog(f, start, 38, DIVE);
}
export const hookX1Rise = (f: number, T: HookX1T) => prog(f, T.out, T.end - 1 - T.out, RISE);

function view(f: number, T: HookX1T): View {
  const dive = hookX1Dive(f, T);
  const hold = between(CORNER, CORNER_IN, prog(f, T.corners + 2, T.out - T.corners - 2, ease.linear));
  const v = between(ARC, hold, dive);
  return between(v, ARC, hookX1Rise(f, T));
}

/** the camera, as the floor's own camera type; a little tilt during the dive and the rise, a jolt on the slam */
export function hookX1Camera(f: number, T: HookX1T): PaintedKinkCam & { ppf: number; jx: number; jy: number; speed: number } {
  if (f >= T.end - 1) return { ...PK_ARC_FRAME, ppf: 20.8, jx: 0, jy: 0, speed: 0 };
  const v = view(f, T);
  const p = view(f - 1, T);
  const dive = hookX1Dive(f, T);
  const rise = hookX1Rise(f, T);
  const pitch = 0.22 * Math.sin(Math.PI * dive) * (1 - rise) + 0.14 * Math.sin(Math.PI * rise);
  const t = f - T.slam;
  const jolt = t < 0 ? 0 : Math.exp(-t / 4) * Math.cos(t / 1.3);
  const jx = -7 * jolt, jy = 9 * jolt;
  const speed = Math.hypot((v.x - p.x) * v.s, (v.y - p.y) * v.s) + Math.abs(Math.log(v.s / p.s)) * 900;
  return { tx: v.x, ty: v.y, D: 60, pitch, yaw: 0, F: 60 * v.s, cx: 540 + jx, cy: 1000 + jy, ppf: v.s, jx, jy, speed };
}

/** the light pool rides with the story: the arc, the corner, then back where `answer` starts it */
export function hookX1Light(f: number, T: HookX1T): [number, number] {
  const k = hookX1Dive(f, T);
  const r = hookX1Rise(f, T);
  const a: [number, number] = [hx1Lerp(2, 18.5, k), hx1Lerp(18, 3.5, k)];
  return [hx1Lerp(a[0], 6, r), hx1Lerp(a[1], 16, r)];
}

const spring = (t: number, tau: number, w: number) => (t < 0 ? 0 : 1 - Math.exp(-t / tau) * Math.cos(t / w));

/** the tape: compass angle (rad, pi/2 = up the floor), blade out (ft), the blade's sideways bow (ft, at mid-length),
 *  the whip running down it, the gold under it, the crank's turn, and whether it is going home */
export function hookX1Tape(f: number, T: HookX1T) {
  // pays out: already racing up the middle at frame 0, settles on 23'9" with a little overshoot by "NBA"+10
  const pay = spring(f + 3, 6, 16);
  let r = hx1Lerp(0, HX1_R, pay);
  // "line": a last tug out, the twang, one click
  const tug = f - (T.line - 3);
  if (tug > 0) r += 0.09 * Math.exp(-tug / 5) * Math.sin(tug / 1.6);
  // "feet": the case creeps in, three inch clicks; "closer": reeled in hard onto the painted line
  const clicks = [0, 4, 8].map((d) => prog(f, T.feet + d, 3, ease.out)).reduce((a, b) => a + b, 0);
  r -= clicks * (1 / 12);
  const pull = prog(f, T.closer - 2, T.slam - T.closer + 2, Easing.in(Easing.cubic));
  const after = f - T.slam;
  const bounce = after < 0 ? 0 : 0.07 * Math.exp(-after / 5) * Math.cos(after / 1.25 + Math.PI);
  r = hx1Lerp(r, HX1_CORNER, pull) + bounce * (after >= 0 ? 1 : 0);
  if (after >= 0) r = HX1_CORNER + bounce;

  // the compass swing on "everywhere": up the floor -> rim level on the right, landing as the word ends
  const sw = prog(f, T.every - 4, 25, Easing.bezier(0.45, 0, 0.25, 1));
  const st = f - (T.every + 21);
  const settle = st < 0 ? 0 : -0.012 * Math.exp(-st / 6) * Math.cos(st / 2.2);
  const angle = Math.PI / 2 - (Math.PI / 2) * sw + settle;

  // the bow: slack at frame 0 lifting taut; the twang on "line"; drag in the swing; the whip on the slam
  const slack = 0.95 * Math.exp(-Math.max(0, f + 4) / 9) * Math.cos(Math.max(0, f) / 5.5);
  const tw = f - T.line;
  const twang = tw < 0 ? 0 : 0.42 * Math.exp(-tw / 9) * Math.sin(tw / 1.15);
  const swVel = prog(f + 1, T.every - 4, 25, Easing.bezier(0.45, 0, 0.25, 1)) - sw;
  const drag = swVel * 9;
  const whip = after < 0 ? 0 : 0.6 * Math.exp(-after / 9);
  const bow = slack + twang + drag;

  // gold under the steel: rising as it goes taut, brighter on "distance"
  const gold = 0.3 + 0.35 * prog(f, 0, 30) + 0.45 * prog(f, T.distance - 2, 8) * (1 - 0.35 * prog(f, T.distance + 10, 20)) + 0.4 * (after < 0 ? 0 : Math.exp(-after / 10));

  // the crank: turns with the blade, half a turn more on "almost", spinning on "closer"
  const crank = (r / 1.3) * 360 + 180 * prog(f, T.almost - 2, 16, ease.back) + 900 * pull;

  // home: the blade zips into the case from the pin, then the case is lifted off the floor and away
  const zip = prog(f, T.out - 3, 9, Easing.in(Easing.cubic));
  const lift = prog(f, T.out + 2, 10, Easing.in(Easing.quad));
  // "isn't": a gold pulse runs out along the blade from the pin to the reading, the distance being taken
  const run = f < T.isnt - 2 ? -1 : prog(f, T.isnt - 2, 16, Easing.inOut(Easing.quad));
  return { r, angle, bow, whip, gold, crank, zip, lift, pull, after, clicks, run };
}
export type HookX1TapeState = ReturnType<typeof hookX1Tape>;

/** feet and inches, the tape's way */
export function hookX1Reading(r: number) {
  let inches = Math.round(r * 12);
  if (inches < 0) inches = 0;
  return { ft: Math.floor(inches / 12), inch: inches % 12 };
}
