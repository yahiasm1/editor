// One camera over one floor, in feet (plan.md): origin at the middle of the basket, x to the right, y toward half
// court, z up. A pinhole camera given by its eye, yaw and pitch, so it can travel continuously from straight down to
// shoe height. Polygons are clipped at the near plane: a low camera stands on the floor it looks along.

export type StepBackV3 = [number, number, number];
export type StepBackCam = { eye: StepBackV3; yaw: number; pitch: number; F: number; cx: number; cy: number };
export type StepBackBasis = { e: StepBackV3; f: StepBackV3; r: StepBackV3; u: StepBackV3 };
export type StepBackPt = { x: number; y: number; z: number };

const NEAR = 0.25;

const dot = (a: StepBackV3, b: StepBackV3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: StepBackV3, b: StepBackV3): StepBackV3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

export function stepBackBasis(c: StepBackCam): StepBackBasis {
  const cp = Math.cos(c.pitch);
  const f: StepBackV3 = [cp * Math.sin(c.yaw), cp * Math.cos(c.yaw), Math.sin(c.pitch)];
  const r: StepBackV3 = [Math.cos(c.yaw), -Math.sin(c.yaw), 0];
  return { e: c.eye, f, r, u: cross(r, f) };
}

/** camera space: [right, up, depth] */
export function stepBackCamSpace(B: StepBackBasis, p: StepBackV3): StepBackV3 {
  const d: StepBackV3 = [p[0] - B.e[0], p[1] - B.e[1], p[2] - B.e[2]];
  return [dot(d, B.r), dot(d, B.u), dot(d, B.f)];
}

export function stepBackProject(c: StepBackCam, B: StepBackBasis, p: StepBackV3): StepBackPt | null {
  const q = stepBackCamSpace(B, p);
  if (q[2] < NEAR) return null;
  return { x: c.cx + (c.F * q[0]) / q[2], y: c.cy - (c.F * q[1]) / q[2], z: q[2] };
}

/** a world polygon as an svg path, clipped at the near plane; null when nothing of it is in front or on screen */
export function stepBackPoly(c: StepBackCam, B: StepBackBasis, pts: StepBackV3[], cull = true): string | null {
  const cs = pts.map((p) => stepBackCamSpace(B, p));
  const out: StepBackV3[] = [];
  for (let i = 0; i < cs.length; i++) {
    const a = cs[i];
    const b = cs[(i + 1) % cs.length];
    const ain = a[2] >= NEAR;
    const bin = b[2] >= NEAR;
    if (ain) out.push(a);
    if (ain !== bin) {
      const t = (NEAR - a[2]) / (b[2] - a[2]);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, NEAR]);
    }
  }
  if (out.length < 3) return null;
  let d = "";
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (let i = 0; i < out.length; i++) {
    const x = c.cx + (c.F * out[i][0]) / out[i][2];
    const y = c.cy - (c.F * out[i][1]) / out[i][2];
    x0 = Math.min(x0, x);
    x1 = Math.max(x1, x);
    y0 = Math.min(y0, y);
    y1 = Math.max(y1, y);
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  if (cull && (x1 < -40 || x0 > 1120 || y1 < 380 || y0 > 1620)) return null;
  return d + "Z";
}

/** screen-space winding of a polygon (positive = facing the camera for counter-clockwise world faces) */
export function stepBackFacing(c: StepBackCam, B: StepBackBasis, pts: StepBackV3[]): number {
  const p = pts.map((q) => stepBackProject(c, B, q));
  if (p.some((q) => !q)) return 0;
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i]!;
    const b = p[(i + 1) % p.length]!;
    s += a.x * b.y - b.x * a.y;
  }
  return s;
}

/** a painted line w ft wide along a floor polyline, as one filled polygon */
export function stepBackBand(c: StepBackCam, B: StepBackBasis, pts: [number, number][], w: number, z = 0.002): string | null {
  const a: StepBackV3[] = [];
  const b: StepBackV3[] = [];
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[Math.min(pts.length - 1, i + 1)];
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const l = Math.hypot(dx, dy) || 1;
    a.push([pts[i][0] - (dy / l) * (w / 2), pts[i][1] + (dx / l) * (w / 2), z]);
    b.push([pts[i][0] + (dy / l) * (w / 2), pts[i][1] - (dx / l) * (w / 2), z]);
  }
  return stepBackPoly(c, B, [...a, ...b.reverse()]);
}

export const stepBackArc = (cx: number, cy: number, r: number, a0: number, a1: number, n = 48): [number, number][] => {
  const out: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return out;
};

export const stepBackLerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const stepBackRnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// the court (plan.md, Rule 1)
export const SB_LINE = 1 / 6; // 2 in
export const SB_SIDE = 25; // inside edge of the sideline; the line itself is out of bounds
export const SB_BASE = -5.25; // inside edge of the baseline
export const SB_CORNER_X = 22; // outer edge of the straight corner line
export const SB_KINK_Y = Math.sqrt(23.75 * 23.75 - 22 * 22); // 8.95
export const SB_APRON = 3; // stained apron beyond the lines

// where the shooter stands: toes behind the corner line, heels a step from the sideline, level with the rim
export const SB_FEET = {
  near: { x: 22.28, y: -0.62, a: 0.06 },
  far: { x: 22.4, y: 0.78, a: -0.1 },
};
export const SB_HEEL_X = 23.38;
