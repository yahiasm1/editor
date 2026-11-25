// wilt-100 hook X1, "the night the windows went out": the shared numbers. The world is Hershey Sports Arena in
// metres, the very numbers of `close` (CloseWitnessesKit: x across, y up, z down the vault; zNear is the end arch
// facing the camera, screen right; zFar the far arch, screen left), seen from the Beato aerial's angle at night. The
// camera ends on close's frame (CW_CAM_A), so `close` returns to exactly this picture. Every time is a word.
import { Easing } from "remotion";
import { ease, prog, useScene } from "../../../src/engine";

export const HX1_AMBER = "#F2B33D";
export const HX1_DIM = "#8B949E";
export const hx1Lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const hx1Clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const hx1Rnd = (n: number) => {
  const x = Math.sin(n * 91.7 + 47.3) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------- the words ---------- */
export function useHookX1T() {
  const { cue, scene } = useScene();
  return {
    wilt: cue("Wilt"),
    chamberlain: cue("Chamberlain"),
    scored: cue("scored"),
    n100: cue("100"),
    points: cue("points"),
    one: cue("one"),
    nba: cue("NBA"),
    game: cue("game,"),
    almost: cue("almost"),
    nobody: cue("nobody"),
    saw: cue("saw"),
    it: cue("it."),
    end: scene.to,
  };
}
export type HookX1T = ReturnType<typeof useHookX1T>;

/* ---------- the arena (close's numbers, read off the Beato aerial and the 1938, 2007, 2024 photos) ---------- */
export const HX1_A = {
  zNear: -46, zFar: 48.6,
  springX: 36.4, springY: 15.6, crownY: 31.5,
  ribs: 11,
};
export type V3 = [number, number, number];
export const hx1Vault = (a: number): [number, number] => [
  HX1_A.springX * Math.cos(a),
  HX1_A.springY + (HX1_A.crownY - HX1_A.springY) * Math.sin(a),
];
export const hx1RibZ = (k: number) => hx1Lerp(HX1_A.zNear + 1.2, HX1_A.zFar - 1.2, k / (HX1_A.ribs - 1));
/** 0 at the far arch, 1 at the near end: the order the lights go out in */
export const hx1Along = (z: number) => hx1Clamp((HX1_A.zFar - z) / (HX1_A.zFar - HX1_A.zNear));

/* ---------- the town, as close places it: north is where the camera looks, east is screen right ---------- */
const YAW = (35 * Math.PI) / 180;
const NORTH: V3 = [Math.cos(YAW), 0, Math.sin(YAW)];
const EAST: V3 = [NORTH[2], 0, -NORTH[0]];
export const hx1Town = (e: number, n: number, y = 0): V3 => [EAST[0] * e + NORTH[0] * n, y, EAST[2] * e + NORTH[2] * n];

/* ---------- the flip panel's board: a 1962 scoreboard on struts off the end arch, turned square to the viewer
 *  (the arch itself is seen too obliquely to read a number on it). Panel units are px of HookX1Panel. ---------- */
export const HX1_SIGN = { c: [0, 20.5, HX1_A.zNear - 3] as V3, m: 0.076 };
const SIGN_R: V3 = [NORTH[2], 0, -NORTH[0]];
/** a point of the board, from panel px (u right, v down) */
export const hx1SignPt = (u: number, v: number, out = 0): V3 => {
  const { c, m } = HX1_SIGN;
  return [c[0] + SIGN_R[0] * u * m - NORTH[0] * out, c[1] - v * m, c[2] + SIGN_R[2] * u * m - NORTH[2] * out];
};

/* ---------- the camera: close's CW_CAM_A, eased back from a little closer ---------- */
export const HX1_CAM = { pitch: (-25 * Math.PI) / 180, D: 255, F: 2000, cx: 540, cy: 1090, tgt: [0, 9, 2] as V3 };
export type HX1Proj = { x: number; y: number; z: number; s: number };
export type HX1View = { P: (p: V3) => HX1Proj; pos: V3; pxPerM: number };

export function hx1View(f: number, T: HookX1T): HX1View {
  const A = HX1_CAM;
  // frame 0 is a little closer, the vault filling the stage; it eases back to close's frame as the town is shown
  // around it ("one"), and is there before the lights go
  const back = prog(f, -30, T.nobody + 30, Easing.bezier(0.3, 0, 0.25, 1));
  const D = A.D * hx1Lerp(0.9, 1, back);
  const cy = A.cy + hx1Lerp(20, 0, back);
  const cx = A.cx + hx1Lerp(-52, 0, back); // the board on the end arch stays inside the frame while closer
  const cp = Math.cos(A.pitch), sp = Math.sin(A.pitch);
  const fwd: V3 = [cp * NORTH[0], sp, cp * NORTH[2]];
  const right: V3 = [NORTH[2], 0, -NORTH[0]];
  const up: V3 = [
    fwd[1] * right[2] - fwd[2] * right[1],
    fwd[2] * right[0] - fwd[0] * right[2],
    fwd[0] * right[1] - fwd[1] * right[0],
  ];
  const tgt = A.tgt;
  const pos: V3 = [tgt[0] - fwd[0] * D, tgt[1] - fwd[1] * D, tgt[2] - fwd[2] * D];
  const P = (p: V3): HX1Proj => {
    const d0 = p[0] - pos[0], d1 = p[1] - pos[1], d2 = p[2] - pos[2];
    const z = d0 * fwd[0] + d1 * fwd[1] + d2 * fwd[2];
    const zz = Math.max(z, 0.05);
    const x = d0 * right[0] + d1 * right[1] + d2 * right[2];
    const y = d0 * up[0] + d1 * up[1] + d2 * up[2];
    return { x: cx + (A.F * x) / zz, y: cy - (A.F * y) / zz, z, s: A.F / zz };
  };
  return { P, pos, pxPerM: A.F / D };
}

/* ---------- the counter: 0, 23, 41, 69 inside the first second, faster on "scored", 100 slammed on "100" ---------- */
export function hx1Points(f: number, T: HookX1T): number {
  const n = T.n100;
  const legs: [number, number, number, number][] = [
    // [from frame, to frame, from value, to value]
    [-8, 13, 0, 23],
    [19, 31, 23, 41],
    [37, 52, 41, 69],
    [T.scored - 1, n - 5, 69, 99],
  ];
  let v = 0;
  for (const [a, b, x, y] of legs) {
    if (f >= a) v = Math.round(hx1Lerp(x, y, prog(f, a, b - a, ease.linear)));
  }
  if (f >= n - 4) v = 100;
  return v;
}
/** the slam of the last flap: 0 before, then a decaying jolt (+ down) */
export const hx1Slam = (f: number, T: HookX1T) => {
  const t = f - (T.n100 - 1);
  return t < 0 ? 0 : Math.exp(-t / 6) * Math.cos(t / 1.7);
};

/* ---------- the lights ---------- */
/** when the lights of a point at z go out: a rolling wave from the far arch to the near end, rib by rib, on "nobody" */
export function hx1OffAt(T: HookX1T, z: number, jitter = 0) {
  const bay = Math.floor(hx1Along(z) * (HX1_A.ribs - 1) + 0.0001); // 0 far .. 9 near
  return T.nobody - 4 + bay * 1.7 + jitter;
}
/** a filament switching off: a hair brighter for a frame, then the glow decays and reddens (not a fade) */
export function hx1Filament(f: number, off: number) {
  const t = f - off;
  if (t < 0) return { b: 1, heat: 1 };
  if (t < 1) return { b: 1.18, heat: 1 };
  const b = Math.exp(-(t - 1) / 3.2);
  return { b: b < 0.02 ? 0 : b, heat: Math.max(0, Math.min(1, b * 1.25)) };
}
/** filament colour: warm amber-white when full, deep red as it cools */
export function hx1FilamentRGB(heat: number): [number, number, number] {
  const h = hx1Clamp(heat);
  if (h > 0.5) {
    const k = (h - 0.5) / 0.5;
    return [hx1Lerp(236, 255, k), hx1Lerp(118, 205, k), hx1Lerp(34, 120, k)];
  }
  const k = h / 0.5;
  return [hx1Lerp(120, 236, k), hx1Lerp(24, 118, k), hx1Lerp(12, 34, k)];
}
/** the whole building sinks a few px as the dark lands on it, and shivers once when the 100 slams */
export function hx1Body(f: number, T: HookX1T) {
  const sink = 7 * prog(f, T.nobody - 2, 16, Easing.out(Easing.back(2.2)));
  const s = hx1Slam(f, T);
  return { dy: sink + 5 * s, dx: 1.6 * s * Math.sin((f - T.n100) * 1.3) };
}
/** the vault's silhouette fades in the last frames, so `hershey` has the counter alone over the dark ground */
export const hx1Fade = (f: number, T: HookX1T) => 1 - prog(f, T.end - 24, 17, ease.inOut);
