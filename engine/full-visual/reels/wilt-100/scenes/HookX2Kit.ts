// wilt-100 hook variant 2, "The camera that wasn't there": the shared numbers. Every time is a word of caption.txt.
// One small 3D world in metres: the RCA TK-41 on its pedestal (local frame: x right, y up, z toward the lens), one
// viewer behind-left and above it, real perspective. The pose (pan, roll back, tip over) is a pure function of the frame.
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { ease, prog, useScene } from "../../../src/engine";

export const HX2_OSWALD = loadOswald("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily;

export const HX2_AMBER = "#F2B33D"; // witness light (the reel's one accent): only the four windows that are left
export const HX2_LAMP = "#FFE2A6"; // incandescent window light
export const HX2_DIM = "#8B949E";
export const HX2_TALLY = "#FF3B2E";

export function useHookX2T() {
  const { cue, cueEnd, scene } = useScene();
  return {
    wilt: cue("Wilt"),
    chamberlain: cue("Chamberlain"),
    scored: cue("scored"),
    hundred: cue("100"),
    points: cue("points"),
    in_: cue("in"),
    one: cue("one"),
    nba: cue("NBA"),
    game: cue("game"),
    gameEnd: cueEnd("game"),
    and: cue("and"),
    almost: cue("almost"),
    nobody: cue("nobody"),
    saw: cue("saw"),
    it: cue("it"),
    itEnd: cueEnd("it"),
    end: scene.to,
  };
}
export type HX2T = ReturnType<typeof useHookX2T>;

export const hx2Lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const hx2Clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const hx2Rnd = (n: number, k = 0) => {
  const x = Math.sin(n * 127.1 + k * 311.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};

// ---------- 3D ----------
export type V3 = [number, number, number];
export type P2 = { x: number; y: number; d: number };
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]);
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** the viewer: behind-right of the camera and above its viewfinder, looking down along it toward the vault */
// (the local frame is left-handed: +x is the camera's own right, so screen-right is up x forward)
export const HX2_EYE: V3 = [0.72, 2.0, -1.1];
const LOOK: V3 = [0.05, 0.92, 0.5];
const FWD = norm(sub(LOOK, HX2_EYE));
const RIGHT = norm(cross([0, 1, 0], FWD));
const UP = cross(FWD, RIGHT);
export const HX2_F = 1130;
export const HX2_C = { x: 950, y: 890 };

/** shake: a screen offset, plus s, a slow push-in of the lens (focal scale) */
export function hx2Project(p: V3, shake: { x: number; y: number; s?: number } = { x: 0, y: 0 }): P2 {
  const r = sub(p, HX2_EYE);
  const d = Math.max(0.05, dot(r, FWD));
  const F = HX2_F * (shake.s ?? 1);
  return { x: HX2_C.x + shake.x + (F * dot(r, RIGHT)) / d, y: HX2_C.y + shake.y - (F * dot(r, UP)) / d, d: dot(r, FWD) };
}

/** the pose of the whole machine at a frame: pan (yaw), roll back, rock and tip over its rear caster */
export type HX2Pose = { yaw: number; tip: number; roll: V3; turret: number; ring: number; tipVel: number };

/** it goes over backward and to its left (away from the viewer): the direction of the fall, and the edge of the
 * base it pivots on (between the rear caster and the front-left one) */
const FALL_DIR: V3 = norm([-0.92, 0, -0.39]);
export const HX2_PIVOT: V3 = [FALL_DIR[0] * 0.3, 0, FALL_DIR[2] * 0.3];
const FALL_AXIS: V3 = cross([0, 1, 0], FALL_DIR); // up x dir: rotating up about it carries it toward the fall

/** tip angle (rad) over time: a rock forward as the base is yanked back, then gravity, then a hard landing and bounce */
export function hx2Tip(T: HX2T, f: number) {
  const a = T.nobody + 4; // the yank
  if (f < a) return 0;
  const rock = -0.06 * Math.sin(Math.PI * hx2Clamp((f - a) / 7)); // the top lags forward while the base rolls back
  const fallStart = a + 6;
  const fallDur = 20;
  if (f < fallStart) return rock;
  const u = hx2Clamp((f - fallStart) / fallDur);
  const fall = 0.02 + (HX2_LAND - 0.02) * u * u * (0.3 + 0.7 * u); // accelerating, like a top-heavy thing
  if (u < 1) return Math.max(rock, fall);
  // landing: bounce off the floor and settle
  const t = f - (fallStart + fallDur);
  return HX2_LAND - 0.2 * Math.abs(Math.sin(t * 0.38)) * Math.exp(-t / 7);
}
/** the angle at which its head meets the floor */
export const HX2_LAND = 1.5;
export const hx2LandAt = (T: HX2T) => T.nobody + 4 + 6 + 20;

export function hx2Pose(T: HX2T, f: number): HX2Pose {
  // pan: a hair toward the vault on "game", settling with a little overshoot
  const pan = -0.2 * prog(f, T.game - 12, 28, ease.back); // toward the vault, on the left
  const idle = 0.006 * Math.sin(f / 37);
  // roll back on the casters when the cable yanks (and a little more as it goes over)
  const r = prog(f, T.nobody + 2, 10, ease.out);
  const roll: V3 = [-0.03 * r, 0, -0.07 * r];
  // the turret: one click on "Chamberlain" (90 deg) with real inertia, settling with an overshoot
  const tc = prog(f, T.chamberlain - 2, 16, ease.back);
  const turret = Math.PI / 4 + (Math.PI / 2) * tc;
  const tip = hx2Tip(T, f);
  const tipVel = tip - hx2Tip(T, f - 1);
  // the steering ring: still, then spinning hard after the landing, slowing down
  const land = hx2LandAt(T);
  const ring = f < land ? 0 : 0.5 * (1 - Math.exp(-(f - land) / 25)) * 25;
  return { yaw: pan + idle, tip, roll, turret, ring, tipVel };
}

/** a local point of the machine to world, under a pose */
export function hx2World(p: V3, pose: HX2Pose): V3 {
  // tip over the base edge (Rodrigues about FALL_AXIS through the pivot); a small rock forward uses the same axis
  const v = sub(p, HX2_PIVOT);
  const k = FALL_AXIS;
  const c = Math.cos(pose.tip), s = Math.sin(pose.tip);
  const kv = cross(k, v);
  const kd = dot(k, v) * (1 - c);
  const q: V3 = [v[0] * c + kv[0] * s + k[0] * kd + HX2_PIVOT[0], v[1] * c + kv[1] * s + k[1] * kd + HX2_PIVOT[1], v[2] * c + kv[2] * s + k[2] * kd + HX2_PIVOT[2]];
  // pan (yaw) about the pedestal axis
  const cy = Math.cos(pose.yaw), sy = Math.sin(pose.yaw);
  const w: V3 = [q[0] * cy + q[2] * sy, q[1], -q[0] * sy + q[2] * cy];
  return [w[0] + pose.roll[0], w[1] + pose.roll[1], w[2] + pose.roll[2]];
}

export function hx2P(p: V3, pose: HX2Pose, shake?: { x: number; y: number; s?: number }): P2 {
  return hx2Project(hx2World(p, pose), shake);
}

/** an SVG affine matrix that maps a flat W x H drawing onto a quad (top-left, top-right, bottom-left), projected */
export function hx2Matrix(tl: P2, tr: P2, bl: P2, W: number, H: number) {
  const a = (tr.x - tl.x) / W, b = (tr.y - tl.y) / W;
  const c = (bl.x - tl.x) / H, d = (bl.y - tl.y) / H;
  return `matrix(${a.toFixed(5)} ${b.toFixed(5)} ${c.toFixed(5)} ${d.toFixed(5)} ${tl.x.toFixed(2)} ${tl.y.toFixed(2)})`;
}

export const hx2Path = (pts: { x: number; y: number }[], close = true) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + (close ? " Z" : "");

/** 2D signed area (screen): > 0 when the polygon is wound clockwise on screen, i.e. its face is toward the viewer */
export const hx2Facing = (pts: { x: number; y: number }[]) => {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    s += a.x * b.y - b.x * a.y;
  }
  return s;
};

/** a world direction: is a face with local normal n at local point c turned toward the viewer under this pose? */
export function hx2Faces(c: V3, n: V3, pose: HX2Pose) {
  const a = hx2World(c, pose);
  const b = hx2World([c[0] + n[0], c[1] + n[1], c[2] + n[2]], pose);
  const nw: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  return dot(nw, sub(a, HX2_EYE)) < 0;
}
export const hx2Depth = (p: V3, pose: HX2Pose) => dot(sub(hx2World(p, pose), HX2_EYE), FWD);
