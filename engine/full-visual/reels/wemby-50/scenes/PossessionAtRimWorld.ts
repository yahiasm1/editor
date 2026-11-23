// The world of `cost`, in feet: x across the court (right +, as the camera sees it), y up, z from the baseline toward
// half court. One camera, a pinhole projection, NBA geometry (notes/PossessionAtRim.md).
export type PossessionAtRimV3 = [number, number, number];
export type PossessionAtRimCam = { pos: PossessionAtRimV3; tgt: PossessionAtRimV3; foc: number; cx: number; cy: number };
export type PossessionAtRimPt = { x: number; y: number; s: number; d: number };

export const PAR = {
  rimY: 10,
  rimZ: 5.25,
  rimR: 0.75, // 18 in inner ring
  boardZ: 4,
  boardW: 6,
  boardBot: 9.5,
  boardTop: 13,
  ballR: 0.39, // 9.4 in
  spot: [0.19, 0, 4.76] as PossessionAtRimV3, // shot 2: x 0.19 ft, 0.49 ft toward the baseline from the rim centre
  discR: 0.8,
  discH: 0.19,
  gold: "#F2B33D",
  goldSide: "#A8741F",
  label: "#8B949E",
  hair: "#30363D",
  white: "#F4F6F8",
  rim: "#E2582A",
};

const sub = (a: PossessionAtRimV3, b: PossessionAtRimV3): PossessionAtRimV3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: PossessionAtRimV3, b: PossessionAtRimV3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: PossessionAtRimV3, b: PossessionAtRimV3): PossessionAtRimV3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a: PossessionAtRimV3): PossessionAtRimV3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
export const possessionAtRimLerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const possessionAtRimLerp3 = (a: PossessionAtRimV3, b: PossessionAtRimV3, t: number): PossessionAtRimV3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** a projector for this frame's camera */
export function possessionAtRimProjector(cam: PossessionAtRimCam) {
  const fw = unit(sub(cam.tgt, cam.pos));
  const r = unit(cross(fw, [0, 1, 0]));
  const u = cross(r, fw);
  const P = (p: PossessionAtRimV3): PossessionAtRimPt => {
    const d = sub(p, cam.pos);
    const z = Math.max(0.3, dot(d, fw));
    return { x: cam.cx + (cam.foc * dot(d, r)) / z, y: cam.cy - (cam.foc * dot(d, u)) / z, s: cam.foc / z, d: z };
  };
  /** depth of a world point along the view axis */
  const depth = (p: PossessionAtRimV3) => dot(sub(p, cam.pos), fw);
  return { P, depth, fw };
}
export type PossessionAtRimProj = ReturnType<typeof possessionAtRimProjector>;

/** an SVG matrix that maps a local w x h design box onto the projected plane tl, tr, bl (small planes: affine is exact enough) */
export function possessionAtRimPlane(P: PossessionAtRimProj["P"], tl: PossessionAtRimV3, tr: PossessionAtRimV3, bl: PossessionAtRimV3, w: number, h: number) {
  const a = P(tl), b = P(tr), c = P(bl);
  return `matrix(${((b.x - a.x) / w).toFixed(5)} ${((b.y - a.y) / w).toFixed(5)} ${((c.x - a.x) / h).toFixed(5)} ${((c.y - a.y) / h).toFixed(5)} ${a.x.toFixed(2)} ${a.y.toFixed(2)})`;
}

export const possessionAtRimPoly = (P: PossessionAtRimProj["P"], pts: PossessionAtRimV3[]) =>
  pts.map((p) => {
    const q = P(p);
    return `${q.x.toFixed(1)},${q.y.toFixed(1)}`;
  }).join(" ");

// a seeded random, so every frame draws the same floor
export const possessionAtRimRnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** a parabolic flight from a to b over [t0, t1] that rises `lift` ft above the straight line at its middle */
export function possessionAtRimArc(f: number, t0: number, t1: number, a: PossessionAtRimV3, b: PossessionAtRimV3, lift: number, warp = (t: number) => t): PossessionAtRimV3 {
  const t = warp(Math.min(1, Math.max(0, (f - t0) / Math.max(1, t1 - t0))));
  const p = possessionAtRimLerp3(a, b, t);
  return [p[0], p[1] + lift * 4 * t * (1 - t), p[2]];
}
