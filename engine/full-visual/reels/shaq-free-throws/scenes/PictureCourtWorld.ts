// The world of `picture`: one Lakers half court in feet (plan.md, "Coordinates for every builder"): origin = rim
// centre, +x, +y away from the baseline toward half court, z up. Baseline y = -5.25, board face y = -1.25, free
// throw line y = 13.75..13.92, sidelines x = +/-25, half court y = 41.75. One orbit camera (target, distance, yaw,
// pitch, focal length) projects everything for real, and floor polygons are clipped at the near plane so the camera
// can swing down behind the shooter without anything folding through it.
// `clank` starts on PICTURE_COURT_END_CAM with Shaq at PICTURE_COURT_LINE_SPOT (this scene has keep = true).

export type PcV3 = [number, number, number];
export type PcCam = { tx: number; ty: number; tz: number; D: number; yaw: number; pitch: number; F: number; cx: number; cy: number };
export type PcPt = { x: number; y: number; s: number; d: number };
export type PcProj = {
  /** world feet -> screen px; s = px per ft at that depth, d = depth */
  p: (x: number, y: number, z?: number) => PcPt;
  /** world -> camera space [right, up, depth] */
  cam: (x: number, y: number, z: number) => PcV3;
  /** camera space -> screen */
  scr: (v: PcV3) => PcPt;
  C: PcV3;
};

export const PC_NEAR = 0.6;
export const PC_LINE = 2 / 12; // 2 in paint
export const PC_FT_Y = 13.75; // near edge of the free throw line (Rule 1.I.3: 15 ft from the board face at -1.25)
export const PC_BOARD_Y = -1.25;
export const PC_BASE = -5.25;
export const PC_SIDE = 25;
export const PC_HALF = 41.75;
export const PC_SHAQ_FT = 7.1; // 7'1", Basketball-Reference

export function pcProjector(c: PcCam): PcProj {
  const cp = Math.cos(c.pitch), sp = Math.sin(c.pitch), cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
  const C: PcV3 = [c.tx + c.D * sy * cp, c.ty + c.D * cy * cp, c.tz + c.D * sp];
  const fw: PcV3 = [-sy * cp, -cy * cp, -sp];
  const r: PcV3 = [-cy, sy, 0];
  // u = r x fw
  const u: PcV3 = [r[1] * fw[2] - r[2] * fw[1], r[2] * fw[0] - r[0] * fw[2], r[0] * fw[1] - r[1] * fw[0]];
  const cam = (x: number, y: number, z: number): PcV3 => {
    const v0 = x - C[0], v1 = y - C[1], v2 = z - C[2];
    return [v0 * r[0] + v1 * r[1] + v2 * r[2], v0 * u[0] + v1 * u[1] + v2 * u[2], v0 * fw[0] + v1 * fw[1] + v2 * fw[2]];
  };
  const scr = (v: PcV3): PcPt => {
    const d = Math.max(PC_NEAR * 0.5, v[2]);
    const s = c.F / d;
    return { x: c.cx + v[0] * s, y: c.cy - v[1] * s, s, d };
  };
  return { cam, scr, p: (x, y, z = 0) => scr(cam(x, y, z)), C };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const pcLerp = lerp;

/** cameras travel: target and angles linear, distance and focal length in log space (no rubbery zoom) */
export function pcMixCam(a: PcCam, b: PcCam, t: number): PcCam {
  return {
    tx: lerp(a.tx, b.tx, t), ty: lerp(a.ty, b.ty, t), tz: lerp(a.tz, b.tz, t),
    D: Math.exp(lerp(Math.log(a.D), Math.log(b.D), t)),
    yaw: lerp(a.yaw, b.yaw, t), pitch: lerp(a.pitch, b.pitch, t),
    F: Math.exp(lerp(Math.log(a.F), Math.log(b.F), t)),
    cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t),
  };
}

const deg = Math.PI / 180;
/** 0: the wall card fallen flat, seen from straight above (the floor still a card) */
export const PC_CAM_CARD: PcCam = { tx: 0, ty: 14, tz: 0, D: 70, yaw: 0, pitch: 89.5 * deg, F: 1180, cx: 540, cy: 1000 };
/** 1: the half court seen 3/4 from above, rim at the top of the stage */
export const PC_CAM_HALF: PcCam = { tx: 0, ty: 13, tz: 0, D: 64, yaw: 8 * deg, pitch: 56 * deg, F: 1120, cx: 540, cy: 1010 };
/** 2: the slow push toward the lane */
export const PC_CAM_PUSH: PcCam = { tx: 1.2, ty: 4.5, tz: 2.5, D: 32, yaw: 14 * deg, pitch: 50 * deg, F: 1120, cx: 540, cy: 1000 };
/** 3: tight on the paint, Shaq in the post */
export const PC_CAM_POST: PcCam = { tx: 1.2, ty: 2.2, tz: 5.2, D: 14.5, yaw: 40 * deg, pitch: 22 * deg, F: 1150, cx: 540, cy: 1010 };
/** 4: behind the shooter, the lane receding to the board at the top of the stage */
export const PC_CAM_LINE: PcCam = { tx: -0.4, ty: 6.5, tz: 5.2, D: 24.5, yaw: 9 * deg, pitch: 13 * deg, F: 1260, cx: 540, cy: 1010 };
/** 5: the end: a slow push in on him under the spotlight. `clank` starts here. */
export const PICTURE_COURT_END_CAM: PcCam = { tx: 0, ty: 10, tz: 4.8, D: 18.5, yaw: 9 * deg, pitch: 12.5 * deg, F: 1260, cx: 540, cy: 1010 };

/** where he stands: the post (inside the restricted arc, ~3.7 ft from the rim) and the line (heels just behind it) */
export const PICTURE_COURT_POST_SPOT: [number, number] = [2.3, 2.9];
export const PICTURE_COURT_LINE_SPOT: [number, number] = [0.9, 15.0];

/** clip a camera-space polygon against the near plane (Sutherland-Hodgman) */
function clipNear(poly: PcV3[]): PcV3[] {
  const out: PcV3[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const ina = a[2] >= PC_NEAR, inb = b[2] >= PC_NEAR;
    if (ina) out.push(a);
    if (ina !== inb) {
      const t = (PC_NEAR - a[2]) / (b[2] - a[2]);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, PC_NEAR]);
    }
  }
  return out;
}

/** a closed polygon in world feet (at height z) as an svg path, clipped at the near plane */
export function pcPoly(P: PcProj, pts: [number, number][], z = 0): string {
  const c = clipNear(pts.map(([x, y]) => P.cam(x, y, z)));
  if (c.length < 3) return "";
  let d = "";
  c.forEach((v, i) => {
    const q = P.scr(v);
    d += `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
  });
  return d + "Z";
}

/** a polygon of 3D points */
export function pcPoly3(P: PcProj, pts: PcV3[]): string {
  const c = clipNear(pts.map(([x, y, z]) => P.cam(x, y, z)));
  if (c.length < 3) return "";
  let d = "";
  c.forEach((v, i) => {
    const q = P.scr(v);
    d += `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
  });
  return d + "Z";
}

/** cut a polyline to the first fraction t of its length: a line being painted */
export function pcCut(pts: [number, number][], t: number): [number, number][] {
  if (t >= 1) return pts;
  if (t <= 0 || pts.length < 2) return [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  let left = total * t;
  const out: [number, number][] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (l >= left) {
      const k = left / (l || 1);
      out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]);
      return out;
    }
    left -= l;
    out.push(pts[i]);
  }
  return out;
}

/** a painted band of width w (ft) along a floor polyline, as quads (each segment its own, so clipping stays exact) */
export function pcBand(P: PcProj, pts: [number, number][], w = PC_LINE, z = 0): string {
  if (pts.length < 2) return "";
  let d = "";
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    const nx = (-dy / l) * (w / 2), ny = (dx / l) * (w / 2);
    // overlap a hair so arcs stay continuous
    const ex = (dx / l) * 0.02, ey = (dy / l) * 0.02;
    d += pcPoly(P, [[a[0] + nx - ex, a[1] + ny - ey], [b[0] + nx + ex, b[1] + ny + ey], [b[0] - nx + ex, b[1] - ny + ey], [a[0] - nx - ex, a[1] - ny - ey]], z);
  }
  return d;
}

export function pcArc(cx: number, cy: number, r: number, a0: number, a1: number, n = 40): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return out;
}

export const pcRnd = (i: number, seed = 1) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** one spectator: a seat in the bowl, in world feet, with a shirt bucket */
export type PcFan = { x: number; y: number; z: number; b: number; row: number; ph: number; flash: number };

/** the bowl around the half court: lower bowl (24 rows) and upper bowl (18 rows) on three sides, rows 2.75 ft deep
 *  and 1.25 ft higher each, seats 1.75 ft apart, as an arena from above reads (Capital One Arena, Daniel Lobo) */
export const PC_FANS: PcFan[] = (() => {
  const out: PcFan[] = [];
  let id = 0;
  const bowl = (rows: number, run0: number, z0: number) => {
    for (let k = 0; k < rows; k++) {
      const off = run0 + k * 2.75, z = z0 + k * 1.25;
      // behind the baseline
      for (let x = -34 - off * 0.6; x <= 34 + off * 0.6; x += 1.75, id++)
        out.push({ x: x + (pcRnd(id, 2) - 0.5) * 0.5, y: PC_BASE - off, z, b: Math.floor(pcRnd(id, 3) * 9), row: k, ph: pcRnd(id, 4) * 6.28, flash: pcRnd(id, 5) });
      // both sidelines
      for (const s of [-1, 1])
        for (let y = PC_BASE - off * 0.6; y <= PC_HALF + 6; y += 1.75, id++)
          out.push({ x: s * (PC_SIDE + off) + (pcRnd(id, 2) - 0.5) * 0.4, y, z, b: Math.floor(pcRnd(id, 3) * 9), row: k, ph: pcRnd(id, 4) * 6.28, flash: pcRnd(id, 5) });
    }
  };
  bowl(22, 9, 1.2);
  bowl(16, 9 + 22 * 2.75 + 10, 1.2 + 22 * 1.25 + 14);
  return out;
})();
