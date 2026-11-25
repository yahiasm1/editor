// HookX4's world, in feet. X across the floor, Y up, Z from the baseline toward half court. Seen from behind the
// basket X runs left to right; the overhead hand-off looks back at the basket, so BBR's chart x is X = -x there
// (the court reads exactly like `answer`'s). One pinhole camera with heading a (0 = facing half court) and pitch phi.
export type HookX4V3 = [number, number, number];
export type HookX4Cam = { pos: HookX4V3; a: number; phi: number; foc: number; cx: number; cy: number };
export type HookX4Pt = { x: number; y: number; s: number; d: number };

export const HK4 = {
  rimY: 10,
  rimZ: 5.25,
  rimR: 0.75,
  ballR: 0.39, // 9.4 in
  discR: 0.8,
  discH: 0.19,
  boardZ: 4,
  boardW: 6,
  boardBot: 9.5,
  boardTop: 13,
  apron: 2.4,
  ppf: 15.2, // `answer`'s court: 760 px for 50 ft
  courtX: 160,
  courtY: 700,
};

/** a BBR spot (ft from rim centre) as a world point on the floor */
export const hookX4Spot = (x: number, y: number, h = 0): HookX4V3 => [-x, h, HK4.rimZ + y];

const dot = (a: HookX4V3, b: HookX4V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: HookX4V3, b: HookX4V3): HookX4V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

export function hookX4Basis(cam: HookX4Cam) {
  const cp = Math.cos(cam.phi);
  const sp = Math.sin(cam.phi);
  const fw: HookX4V3 = [cp * Math.sin(cam.a), -sp, cp * Math.cos(cam.a)];
  const r: HookX4V3 = [Math.cos(cam.a), 0, -Math.sin(cam.a)];
  const u = cross(fw, r);
  return { fw, r, u };
}

export function hookX4Projector(cam: HookX4Cam) {
  const { fw, r, u } = hookX4Basis(cam);
  const P = (p: HookX4V3): HookX4Pt => {
    const d: HookX4V3 = [p[0] - cam.pos[0], p[1] - cam.pos[1], p[2] - cam.pos[2]];
    const z = Math.max(0.25, dot(d, fw));
    return { x: cam.cx + (cam.foc * dot(d, r)) / z, y: cam.cy - (cam.foc * dot(d, u)) / z, s: cam.foc / z, d: z };
  };
  const depth = (p: HookX4V3) => dot([p[0] - cam.pos[0], p[1] - cam.pos[1], p[2] - cam.pos[2]], fw);
  return { P, depth, fw, r, u, cam };
}
export type HookX4Proj = ReturnType<typeof hookX4Projector>;

/**
 * The CSS matrix3d that lays a flat element onto the floor (Y = 0) under this camera: an exact homography.
 * The element's local pixel (px, py) is the floor point X = X0 + dXdu * px, Z = Z0 + dZdv * py.
 */
export function hookX4FloorMatrix(cam: HookX4Cam, X0: number, dXdu: number, Z0: number, dZdv: number) {
  const { fw, r, u } = hookX4Basis(cam);
  const [px, py, pz] = cam.pos;
  const aff = (w: HookX4V3) => ({ c: (X0 - px) * w[0] - py * w[1] + (Z0 - pz) * w[2], u: dXdu * w[0], v: dZdv * w[2] });
  const D = aff(fw);
  const R = aff(r);
  const U = aff(u);
  const NX = { c: cam.cx * D.c + cam.foc * R.c, u: cam.cx * D.u + cam.foc * R.u, v: cam.cx * D.v + cam.foc * R.v };
  const NY = { c: cam.cy * D.c - cam.foc * U.c, u: cam.cy * D.u - cam.foc * U.u, v: cam.cy * D.v - cam.foc * U.v };
  const k = D.c;
  const m = [NX.u / k, NY.u / k, 0, D.u / k, NX.v / k, NY.v / k, 0, D.v / k, 0, 0, 1, 0, NX.c / k, NY.c / k, 0, 1];
  return `matrix3d(${m.map((v) => (Math.abs(v) < 1e-12 ? 0 : v).toPrecision(9)).join(",")})`;
}

/** convex hull of screen points (monotone chain) */
export function hookX4Hull(pts: { x: number; y: number }[]) {
  const p = [...pts].sort((a, b) => a.x - b.x || a.y - b.y);
  const cr = (o: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lo: { x: number; y: number }[] = [];
  for (const q of p) {
    while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  const up: { x: number; y: number }[] = [];
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i];
    while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
    up.push(q);
  }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

export const hookX4Path = (pts: { x: number; y: number }[], close = true) =>
  pts.map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ") + (close ? " Z" : "");

/** a horizontal circle in the world, projected */
export function hookX4Ring(P: HookX4Proj["P"], c: HookX4V3, r: number, n = 24, phase = 0) {
  const out: HookX4Pt[] = [];
  for (let i = 0; i < n; i++) {
    const t = phase + (i / n) * Math.PI * 2;
    out.push(P([c[0] + r * Math.cos(t), c[1], c[2] + r * Math.sin(t)]));
  }
  return out;
}

export const hookX4Lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const hookX4Lerp3 = (a: HookX4V3, b: HookX4V3, t: number): HookX4V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const hookX4Rnd = (i: number, k = 0) => {
  const s = Math.sin(i * 78.233 + k * 12.9898 + 4.1) * 43758.5453;
  return s - Math.floor(s);
};
