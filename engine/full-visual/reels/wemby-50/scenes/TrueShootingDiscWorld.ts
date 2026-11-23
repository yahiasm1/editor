// One camera for `trueshooting`: feet, a pinhole looking at the big chance disc standing on its edge on the maple.
// The disc is the reel's chance at true size (1.6 ft across, 0.12 of that thick); the camera is simply close.
export type TSV3 = [number, number, number];

export const TSD_R = 0.8; // ft
export const TSD_T = 0.192; // ft, 0.12 of the width
export const TSD_BOARD = 2.25 / 12; // ft, a maple strip

export type TrueShootingDiscCam = { eye: TSV3; target: TSV3; F: number; cx: number; cy: number };

const sub = (a: TSV3, b: TSV3): TSV3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: TSV3, b: TSV3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: TSV3, b: TSV3): TSV3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a: TSV3): TSV3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
export const tsdDot = dot;
export const tsdUnit = unit;

export function trueShootingDiscProject(cam: TrueShootingDiscCam, p: TSV3) {
  const fw = unit(sub(cam.target, cam.eye));
  const r = unit(cross(fw, [0, 0, 1]));
  const u = cross(r, fw);
  const d = sub(p, cam.eye);
  const z = dot(d, fw);
  return { x: cam.cx + (cam.F * dot(d, r)) / z, y: cam.cy - (cam.F * dot(d, u)) / z, z, ok: z > 0.05 };
}

export function trueShootingDiscPoly(cam: TrueShootingDiscCam, pts: TSV3[]) {
  let s = "";
  for (let i = 0; i < pts.length; i++) {
    const q = trueShootingDiscProject(cam, pts[i]);
    if (!q.ok) return "";
    s += `${i ? "L" : "M"}${q.x.toFixed(1)},${q.y.toFixed(1)}`;
  }
  return s + "Z";
}

/** the disc's frame: bottom contact on the floor at the origin, tipped back by `tilt` (0 = standing), turned by `yaw` */
export function trueShootingDiscPose(tilt: number, yaw: number, lift = 0) {
  const rz = (v: TSV3): TSV3 => [v[0] * Math.cos(yaw) - v[1] * Math.sin(yaw), v[0] * Math.sin(yaw) + v[1] * Math.cos(yaw), v[2]];
  const U = rz([1, 0, 0]);
  const V = rz([0, Math.sin(tilt), Math.cos(tilt)]);
  const N = rz([0, -Math.cos(tilt), Math.sin(tilt)]); // the front face's normal, toward the camera
  const C: TSV3 = [V[0] * TSD_R, V[1] * TSD_R, V[2] * TSD_R + lift];
  /** local point: u across the face, v up the face (from the centre), w out of the front face */
  const at = (u: number, v: number, w: number): TSV3 => [
    C[0] + u * U[0] + v * V[0] + w * N[0],
    C[1] + u * U[1] + v * V[1] + w * N[1],
    C[2] + u * U[2] + v * V[2] + w * N[2],
  ];
  return { U, V, N, C, at };
}

/** a seeded random, so every frame draws the same boards */
export const tsdRand = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
