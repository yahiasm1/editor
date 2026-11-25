// wilt-100 hook X1: the night world on two canvases, drawn from the camera every frame (Kit). Behind Wilt's card:
// the dark ground, the car park and its sodium lamps, the town's scattered windows (they go out on "one"), the two
// red-domed towers off the far end, the trees behind. In front of the card: Hershey Sports Arena from the Beato
// aerial's angle (close's numbers): the barrel vault with 11 ribs and weathered streaks, four louvred dormers, the
// eave fins, the cream long wall with two storeys of windows, the panelled end arch with its slit windows and the
// panel's steel bracket, the low block with the main gate, the trees in front. Every window and dormer is lit at
// frame 0; on "nobody" they switch off rib by rib, far arch to near end, and only four survive.
import React, { useLayoutEffect, useRef } from "react";
import { ease, prog } from "../../../src/engine";
import {
  HX1_A as A, type HookX1T, type HX1View, type V3, hx1Along, hx1Body, hx1Clamp, hx1Fade, hx1Filament,
  hx1FilamentRGB, hx1Lerp, hx1OffAt, hx1Points, hx1RibZ, hx1Rnd, hx1SignPt, hx1Town, hx1Vault,
} from "./HookX1Kit";

const W = 1080, H = 1920;
type Ctx = CanvasRenderingContext2D;

const LIGHT: V3 = (() => { const v: V3 = [-0.55, 0.72, -0.42]; const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l]; })();
const rgb = (r: number, g: number, b: number, k = 1, a = 1) =>
  `rgba(${Math.round(hx1Clamp(r * k, 0, 255))},${Math.round(hx1Clamp(g * k, 0, 255))},${Math.round(hx1Clamp(b * k, 0, 255))},${a.toFixed(3)})`;

function poly(c: Ctx, V: HX1View, pts: V3[], fill?: string, stroke?: string, lw = 1) {
  const q = pts.map(V.P);
  if (q.some((p) => p.z < 0.5)) return;
  c.beginPath();
  q.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
  c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); }
}
function line(c: Ctx, V: HX1View, pts: V3[], stroke: string, lw: number) {
  const q = pts.map(V.P);
  if (q.some((p) => p.z < 0.5)) return;
  c.beginPath();
  q.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
  c.strokeStyle = stroke; c.lineWidth = lw; c.stroke();
}
function glow(c: Ctx, x: number, y: number, r: number, col: [number, number, number], a: number, sy = 1) {
  if (a <= 0.004 || r <= 0.2) return;
  c.save();
  c.translate(x, y);
  c.scale(1, sy);
  const g = c.createRadialGradient(0, 0, 0, 0, 0, r);
  g.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${a.toFixed(3)})`);
  g.addColorStop(0.45, `rgba(${col[0]},${col[1]},${col[2]},${(a * 0.35).toFixed(3)})`);
  g.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
  c.fillStyle = g;
  c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill();
  c.restore();
}
const WARM: [number, number, number] = [255, 196, 112];
const SODIUM: [number, number, number] = [255, 170, 80];

/* ---------- fixed things of the town ---------- */
type Tree = { p: V3; r: number; front: boolean; k: number; near: number };
const TREES: Tree[] = (() => {
  const out: Tree[] = [];
  for (let i = 0; i < 700; i++) {
    const e = -300 + hx1Rnd(i * 1.13) * 640, n = -150 + hx1Rnd(i * 2.71 + 4) * 380;
    const p = hx1Town(e, n, 0);
    if (Math.abs(p[0]) < 46 && p[2] > -64 && p[2] < 58) continue; // the building and its gate block
    if (n > 92 && n < 262 && e > -150 && e < 250) continue; // the car park
    if (Math.abs(n + 78) < 12) continue; // the road
    if (Math.abs(e - 10) < 40 && n < -40 && n > -76) continue; // the gate plaza
    const r = 2.6 + hx1Rnd(i * 5.3) * 2.8;
    const near = Math.max(0, 1 - Math.hypot(Math.max(0, Math.abs(p[0]) - 36), Math.max(0, Math.abs(p[2] - 1) - 47)) / 26);
    out.push({ p: [p[0], r * 1.25 + 2 + hx1Rnd(i) * 2, p[2]], r, front: n < -52, k: hx1Rnd(i * 9.1), near });
  }
  return out;
})();
const LOT_LAMPS: V3[] = [];
for (let e = -120; e <= 230; e += 70) for (let n = 115; n <= 250; n += 66) LOT_LAMPS.push(hx1Town(e, n, 10));
/** the town's lit windows, far around: they go out on "one", from the edges in */
const TOWN: { p: V3; k: number; d: number }[] = [];
for (let i = 0; i < 260; i++) {
  const e = -900 + hx1Rnd(i * 3.3 + 1) * 1900, n = -300 + hx1Rnd(i * 4.9 + 2) * 1100;
  if (Math.abs(e) < 280 && n > -200 && n < 300) continue;
  TOWN.push({ p: hx1Town(e, n, 2 + hx1Rnd(i) * 5), k: hx1Rnd(i * 6.1), d: Math.hypot(e, n) });
}

/* ---------- the building's windows ---------- */
type Win = { z: number; y0: number; y1: number; row: number; i: number; off: number; keep: boolean; pass: number };
const WIN_Z: number[] = [];
for (let z = A.zNear + 2.4; z < A.zFar - 2; z += 3.15) WIN_Z.push(z);
const KEEP = new Set(["7-0", "12-1", "19-0", "24-1"]); // the four that are still on: scattered, far to near
const WINS: Win[] = [];
WIN_Z.forEach((z, i) => {
  for (const [y0, y1, row] of [[3.4, 5.0, 0], [9.6, 11.2, 1]] as const) {
    WINS.push({ z, y0, y1, row, i, off: (row ? -0.6 : 0.4) + hx1Rnd(i * 4.1 + row * 17.3) * 1.2, keep: KEEP.has(`${i}-${row}`), pass: hx1Rnd(i * 2.9 + row * 5.1) });
  }
});
const DORMERS = [-29, -9.5, 10, 29.5];
const SLITS = [-12, -8, -4, 0, 4, 8, 12];

/** how bright a window is at frame f: full, a person's shadow passing in the hold, the filament switching off */
function winLight(f: number, T: HookX1T, w: { z: number; off: number; keep: boolean; pass: number }, extra = 0) {
  const roar = 0.22 * Math.exp(-Math.max(0, f - T.n100) / 9) * (f >= T.n100 - 1 ? 1 : 0)
    // "game": the crowd roars once, a swell of light rolling down the building from the near end
    + (() => { const t = f - (T.game - 3 + (1 - hx1Along(w.z)) * 10); return t < 0 || t > 24 ? 0 : 0.42 * Math.sin((Math.PI * t) / 24); })();
  // people walking past inside: one pass for most windows between "points" and "almost"
  let shade = 0;
  if (w.pass < 0.7) {
    const t0 = T.points + w.pass * (T.almost - T.points - 20) / 0.7;
    const u = (f - t0) / 16;
    if (u > 0 && u < 1) shade = 0.62 * Math.sin(Math.PI * u);
  }
  const flick = 0.04 * Math.sin(f * 0.9 + w.pass * 40);
  if (w.keep) {
    // a survivor: dims to a small point when its neighbours go, and keeps living
    const dim = prog(f, hx1OffAt(T, w.z) + 2, 8, ease.out);
    return { b: (1 + roar + flick) * (1 - shade) * (1 - 0.45 * dim) + 0.06 * Math.sin(f / 7 + w.pass * 9) * dim, heat: 1, keep: true, dim };
  }
  const fil = hx1Filament(f, hx1OffAt(T, w.z, w.off + extra));
  return { b: fil.b * (1 + roar + flick) * (1 - shade), heat: fil.heat, keep: false, dim: 0 };
}

/* ---------- the roof ---------- */
const NA = 30;
const BAYS = Array.from({ length: A.ribs - 1 }, (_, k) => [k === 0 ? A.zNear : hx1RibZ(k), k === A.ribs - 2 ? A.zFar : hx1RibZ(k + 1)]);
const vp = (a: number, z: number): V3 => { const [x, y] = hx1Vault(a); return [x, y, z]; };
const vNormal = (a: number): V3 => {
  const B = A.crownY - A.springY;
  const n: V3 = [Math.cos(a) * B, Math.sin(a) * A.springX, 0];
  const l = Math.hypot(n[0], n[1]);
  return [n[0] / l, n[1] / l, 0];
};
const facing = (V: HX1View, p: V3, n: V3) => (V.pos[0] - p[0]) * n[0] + (V.pos[1] - p[1]) * n[1] + (V.pos[2] - p[2]) * n[2] > 0;

function drawRoof(c: Ctx, V: HX1View, warmth: number) {
  for (let k = 0; k < BAYS.length; k++) {
    const [z0, z1] = BAYS[k];
    for (let i = 0; i < NA; i++) {
      const a0 = (i / NA) * Math.PI, a1 = ((i + 1) / NA) * Math.PI, am = (a0 + a1) / 2;
      const n = vNormal(am);
      const mid = vp(am, (z0 + z1) / 2);
      if (!facing(V, mid, n)) continue;
      const lam = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
      const tone = 0.86 + hx1Rnd(k * 3.1 + 2) * 0.14;
      // moonlit weathered concrete: cool grey, each bay its own tone, the eave a touch warmer from the windows below
      const eave = am > Math.PI * 0.86 ? (am - Math.PI * 0.86) / (Math.PI * 0.14) : 0;
      const sh = (0.34 + 0.6 * lam) * tone * (0.8 + 0.2 * Math.sin(am));
      const w = warmth * eave * 0.18;
      poly(c, V, [vp(a0, z0), vp(a1, z0), vp(a1, z1), vp(a0, z1)],
        `rgb(${Math.round(66 * sh + 60 * w)},${Math.round(72 * sh + 40 * w)},${Math.round(82 * sh + 14 * w)})`);
    }
    // long rain streaks down the slope
    for (let s = 0; s < 8; s++) {
      const z = hx1Lerp(z0 + 0.8, z1 - 0.8, hx1Rnd(k * 13 + s * 1.7));
      const aTop = Math.PI * (0.42 + hx1Rnd(k * 7 + s) * 0.28);
      const pts: V3[] = [];
      for (let j = 0; j <= 8; j++) pts.push(vp(hx1Lerp(aTop, Math.PI - 0.02, j / 8), z));
      if (facing(V, pts[4], vNormal((aTop + Math.PI) / 2))) line(c, V, pts, "rgba(12,15,20,0.26)", Math.max(0.6, 0.3 * V.P(pts[4]).s));
    }
    // the seam lines of the concrete shell
    for (let s = 1; s < 4; s++) {
      const a = Math.PI * (0.25 * s);
      if (facing(V, vp(a, (z0 + z1) / 2), vNormal(a))) line(c, V, [vp(a, z0), vp(a, z1)], "rgba(20,24,30,0.22)", 0.8);
    }
  }
}

function drawRibs(c: Ctx, V: HX1View, f: number, T: HookX1T) {
  const slam = f >= T.n100 - 1 ? Math.exp(-(f - T.n100 + 1) / 8) : 0;
  for (let k = 0; k < A.ribs; k++) {
    const z = hx1RibZ(k);
    let seg: V3[] = [];
    const flush = () => {
      if (seg.length > 1) {
        const s = V.P(seg[Math.floor(seg.length / 2)]).s;
        line(c, V, seg.map((p) => [p[0], p[1], p[2] + 0.6] as V3), "rgba(8,10,14,0.6)", Math.max(0.8, 0.45 * s));
        line(c, V, seg, rgb(104, 112, 124, 1 + 0.4 * slam), Math.max(1, 0.75 * s));
        line(c, V, seg.map((p) => [p[0], p[1] + 0.12, p[2] - 0.25] as V3), `rgba(170,180,195,${(0.22 + 0.4 * slam).toFixed(3)})`, Math.max(0.5, 0.2 * s));
      }
      seg = [];
    };
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * Math.PI;
      const p = vp(a, z);
      const n = vNormal(a);
      if (facing(V, p, n)) seg.push([p[0] + n[0] * 0.25, p[1] + n[1] * 0.25, z]);
      else flush();
    }
    flush();
  }
}

function drawDormers(c: Ctx, V: HX1View, f: number, T: HookX1T) {
  const a = Math.PI - 0.42;
  const [x, y] = hx1Vault(a);
  DORMERS.forEach((zc, d) => {
    const xf = x - 1.2;
    const L = winLight(f, T, { z: zc, off: 9 + d * 0.6, keep: false, pass: 0.9 });
    const [r, g, b] = hx1FilamentRGB(L.heat);
    // the box sits in the slope: a louvred face toward the camera's side, a moonlit top, a dark side
    poly(c, V, [[xf, y + 2.4, zc - 2.1], [xf + 3.4, y + 2.4, zc - 2.1], [xf + 3.4, y + 2.4, zc + 2.1], [xf, y + 2.4, zc + 2.1]], rgb(96, 104, 116));
    poly(c, V, [[xf, y - 0.6, zc + 2.1], [xf, y + 2.4, zc + 2.1], [xf + 3.4, y + 2.4, zc + 2.1], [xf + 3.4, y + 1.0, zc + 2.1]], rgb(44, 48, 56));
    const face: V3[] = [[xf, y - 0.6, zc - 2.1], [xf, y + 2.4, zc - 2.1], [xf, y + 2.4, zc + 2.1], [xf, y - 0.6, zc + 2.1]];
    poly(c, V, face, rgb(24, 27, 33));
    if (L.b > 0.01) poly(c, V, face, `rgba(${r | 0},${g | 0},${b | 0},${Math.min(1, 0.85 * L.b).toFixed(3)})`);
    for (let j = 0; j < 6; j++) {
      const yy = y - 0.35 + j * 0.48;
      line(c, V, [[xf - 0.03, yy, zc - 1.9], [xf - 0.03, yy - 0.18, zc + 1.9]], "rgba(30,26,22,0.85)", Math.max(0.8, 0.12 * V.P([xf, yy, zc]).s));
    }
    poly(c, V, face, undefined, "rgba(120,126,136,0.7)", 1);
    if (L.b > 0.01) {
      const p = V.P([xf - 0.4, y + 0.9, zc]);
      c.save(); c.globalCompositeOperation = "lighter";
      glow(c, p.x, p.y, 4.2 * p.s, [r | 0, g | 0, b | 0], 0.5 * Math.min(1.2, L.b));
      c.restore();
    }
  });
}

function drawLongWall(c: Ctx, V: HX1View, f: number, T: HookX1T) {
  const x = -A.springX;
  poly(c, V, [[x, 0, A.zNear], [x, A.springY, A.zNear], [x, A.springY, A.zFar], [x, 0, A.zFar]], rgb(70, 68, 63));
  // the cornice band under the eave, a plinth, the pilasters between bays
  poly(c, V, [[x - 0.05, A.springY - 1.1, A.zNear], [x - 0.05, A.springY, A.zNear], [x - 0.05, A.springY, A.zFar], [x - 0.05, A.springY - 1.1, A.zFar]], rgb(88, 86, 80));
  poly(c, V, [[x - 0.05, 0, A.zNear], [x - 0.05, 1.2, A.zNear], [x - 0.05, 1.2, A.zFar], [x - 0.05, 0, A.zFar]], rgb(44, 44, 42));
  for (let k = 0; k < A.ribs; k++) {
    const z = hx1RibZ(k);
    poly(c, V, [[x - 0.12, 1.2, z - 0.5], [x - 0.12, A.springY - 1.1, z - 0.5], [x - 0.12, A.springY - 1.1, z + 0.5], [x - 0.12, 1.2, z + 0.5]], rgb(80, 78, 72));
  }
  // the windows: glass, its filament light, the mullion, a sill
  c.save();
  for (const w of WINS) {
    const L = winLight(f, T, w);
    const pts: V3[] = [[x - 0.06, w.y0, w.z - 0.7], [x - 0.06, w.y1, w.z - 0.7], [x - 0.06, w.y1, w.z + 0.7], [x - 0.06, w.y0, w.z + 0.7]];
    poly(c, V, pts, rgb(16, 18, 22));
    if (L.b > 0.01) {
      const [r, g, b] = hx1FilamentRGB(L.heat);
      if (L.keep && L.dim > 0) {
        // the survivor is a small point: the glass goes dark around a lit core
        const p = V.P([x - 0.06, (w.y0 + w.y1) / 2, w.z]);
        poly(c, V, pts, `rgba(255,205,128,${(0.9 * (1 - L.dim) * L.b).toFixed(3)})`);
        c.fillStyle = `rgba(255,214,140,${Math.min(1, L.b).toFixed(3)})`;
        const s = Math.max(1.6, 0.6 * p.s * (1 - 0.4 * L.dim));
        c.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      } else {
        poly(c, V, pts, `rgba(${r | 0},${g | 0},${b | 0},${Math.min(1, 0.95 * L.b).toFixed(3)})`);
      }
    }
    line(c, V, [[x - 0.07, w.y0, w.z], [x - 0.07, w.y1, w.z]], "rgba(60,58,54,0.95)", Math.max(0.6, 0.12 * V.P([x, w.y0, w.z]).s));
    line(c, V, [[x - 0.2, w.y0 - 0.1, w.z - 0.8], [x - 0.2, w.y0 - 0.1, w.z + 0.8]], "rgba(120,116,108,0.8)", 1);
  }
  // their halos on the night air and the light they throw on the wall
  c.globalCompositeOperation = "lighter";
  for (const w of WINS) {
    const L = winLight(f, T, w);
    if (L.b < 0.03) continue;
    const [r, g, b] = hx1FilamentRGB(L.heat);
    const p = V.P([x - 0.3, (w.y0 + w.y1) / 2, w.z]);
    const k = L.keep ? 0.45 + 0.55 * (1 - L.dim) : 1;
    glow(c, p.x, p.y, 2.4 * p.s * k, [r | 0, g | 0, b | 0], 0.36 * Math.min(1.2, L.b) * k);
  }
  c.restore();
}

/** the four windows still lit, drawn over the dark: small amber points with a halo */
function drawSurvivors(c: Ctx, V: HX1View, f: number, T: HookX1T) {
  const x = -A.springX;
  c.save();
  c.globalCompositeOperation = "lighter";
  for (const w of WINS) {
    if (!w.keep) continue;
    const L = winLight(f, T, w);
    if (L.dim <= 0) continue;
    const p = V.P([x - 0.1, (w.y0 + w.y1) / 2, w.z]);
    glow(c, p.x, p.y, 2.6 * p.s, [242, 179, 61], 0.55 * L.dim * Math.min(1.1, L.b));
    c.fillStyle = `rgba(255,214,140,${(L.dim * Math.min(1, L.b)).toFixed(3)})`;
    const s = Math.max(2.4, 0.5 * p.s);
    c.fillRect(p.x - s / 2, p.y - s / 2, s, s);
  }
  c.restore();
}

function drawFins(c: Ctx, V: HX1View) {
  const x = -A.springX;
  for (let k = 0; k < A.ribs; k++) {
    const z = hx1RibZ(k);
    const top = vp(Math.PI - 0.21, z);
    poly(c, V, [[x - 1.9, A.springY - 0.6, z], [x + 0.2, A.springY - 0.6, z], top], rgb(132, 128, 118));
    poly(c, V, [[x - 1.9, A.springY - 0.6, z], [x - 1.9, A.springY - 0.6, z + 0.6], [top[0], top[1], z + 0.6], top], rgb(78, 76, 70));
  }
}

function drawGable(c: Ctx, V: HX1View, f: number, T: HookX1T) {
  const z = A.zNear;
  const out: V3[] = [[A.springX, 0, z], [A.springX, A.springY, z]];
  for (let i = 0; i <= 40; i++) out.push(vp((i / 40) * Math.PI, z));
  out.push([-A.springX, A.springY, z], [-A.springX, 0, z]);
  poly(c, V, out, rgb(86, 84, 78));
  const edge: V3[] = []; for (let i = 0; i <= 40; i++) edge.push(vp((i / 40) * Math.PI, z - 0.4));
  line(c, V, edge, rgb(124, 122, 114), Math.max(1, 0.5 * V.P(edge[20]).s));
  // tall precast panels with vertical joints
  for (let xj = -A.springX + 3.3; xj < A.springX; xj += 3.3) {
    const a = Math.acos(hx1Clamp(xj / A.springX, -1, 1));
    line(c, V, [[xj, 0.3, z - 0.05], [xj, hx1Vault(a)[1] - 0.3, z - 0.05]], "rgba(34,34,34,0.5)", 1);
  }
  // slit windows low in the arch, lit; the near end is the last to go
  c.save();
  for (const xs of SLITS) {
    const L = winLight(f, T, { z: z + 0.5, off: 1 + Math.abs(xs) * 0.05, keep: false, pass: 0.8 + xs * 0.001 });
    const pts: V3[] = [[xs - 0.9, 2.8, z - 0.06], [xs - 0.9, 9.2, z - 0.06], [xs + 0.9, 9.2, z - 0.06], [xs + 0.9, 2.8, z - 0.06]];
    poly(c, V, pts, rgb(16, 18, 22));
    if (L.b > 0.01) {
      const [r, g, b] = hx1FilamentRGB(L.heat);
      poly(c, V, pts, `rgba(${r | 0},${g | 0},${b | 0},${Math.min(1, 0.92 * L.b).toFixed(3)})`);
      c.globalCompositeOperation = "lighter";
      const p = V.P([xs, 6, z - 0.3]);
      glow(c, p.x, p.y, 3 * p.s, [r | 0, g | 0, b | 0], 0.3 * L.b, 1.6);
      c.globalCompositeOperation = "source-over";
    }
  }
  c.restore();
}

/** the scoreboard the flaps hang on: a steel board square to the viewer, on four struts off the arch, two hooded
 *  lamps over it. The flaps lift off it on "saw"; the empty board stays and goes dark with the building. */
function drawBoard(c: Ctx, V: HX1View, f: number, T: HookX1T) {
  const z = A.zNear;
  const S = (u: number, v: number, out = 0) => hx1SignPt(u, v, out);
  // the struts, back to the concrete
  for (const [u, v] of [[-96, -70], [96, -70], [-96, 70], [96, 70]]) {
    const a = S(u, v, -0.4);
    const b: V3 = [u * 0.07, 20.5 - v * 0.07, z - 0.1];
    line(c, V, [a, b], "rgba(30,32,36,0.95)", Math.max(1.5, 0.45 * V.P(a).s));
    line(c, V, [a, b], "rgba(120,124,130,0.35)", 1);
  }
  // the board: steel plate, a lighter rim, rivets along the rim
  const u0 = -132, u1 = 132, v0 = -112, v1 = 104;
  poly(c, V, [S(u0, v0, -0.5), S(u1, v0, -0.5), S(u1, v1, -0.5), S(u0, v1, -0.5)], "rgb(14,15,18)");
  poly(c, V, [S(u0, v0), S(u1, v0), S(u1, v1), S(u0, v1)], "rgb(28,30,35)", "rgba(126,130,138,0.75)", 1.2);
  poly(c, V, [S(u0 + 8, v0 + 8), S(u1 - 8, v0 + 8), S(u1 - 8, v1 - 8), S(u0 + 8, v1 - 8)], undefined, "rgba(0,0,0,0.6)", 1);
  for (let u = u0 + 14; u <= u1 - 14; u += 26) for (const v of [v0 + 4, v1 - 4]) {
    const p = V.P(S(u, v));
    c.fillStyle = "rgba(150,152,158,0.65)";
    c.beginPath(); c.arc(p.x, p.y, Math.max(0.8, 0.12 * p.s), 0, Math.PI * 2); c.fill();
  }
  // two hooded lamps on goosenecks over the board, lit until the near end goes dark
  const L = winLight(f, T, { z: z - 2, off: 3.5, keep: false, pass: 0.97 });
  const [r, g, b] = hx1FilamentRGB(L.heat);
  for (const u of [-70, 70]) {
    const base = S(u, v0, 0), tip = S(u, v0 - 26, 2.2);
    line(c, V, [base, S(u, v0 - 22, 0.6), tip], "rgba(60,62,66,1)", Math.max(1.2, 0.25 * V.P(base).s));
    const p = V.P(tip);
    c.fillStyle = "rgb(70,72,76)";
    c.beginPath(); c.ellipse(p.x, p.y, 0.9 * p.s, 0.45 * p.s, 0, 0, Math.PI * 2); c.fill();
    if (L.b > 0.01) {
      c.save(); c.globalCompositeOperation = "lighter";
      glow(c, p.x, p.y + 0.3 * p.s, 2.4 * p.s, [r | 0, g | 0, b | 0], 0.7 * L.b);
      c.restore();
    }
  }
  // the pool of lamp light on the board's face
  if (L.b > 0.01) {
    const a = V.P(S(0, v0)), bb = V.P(S(0, v1));
    const grad = c.createLinearGradient(a.x, a.y, bb.x, bb.y);
    grad.addColorStop(0, `rgba(${r | 0},${g | 0},${b | 0},${(0.3 * L.b).toFixed(3)})`);
    grad.addColorStop(1, `rgba(${r | 0},${g | 0},${b | 0},0)`);
    poly(c, V, [S(u0, v0), S(u1, v0), S(u1, v1), S(u0, v1)], undefined);
    c.fillStyle = grad;
    const q = [S(u0, v0), S(u1, v0), S(u1, v1), S(u0, v1)].map(V.P);
    c.beginPath(); q.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.closePath(); c.fill();
  }
}

function drawGateBlock(c: Ctx, V: HX1View, f: number, T: HookX1T) {
  const z = A.zNear, z0 = -54.5, h = 9.5, x0 = -31, x1 = 31;
  poly(c, V, [[x0, h, z0], [x1, h, z0], [x1, h, z], [x0, h, z]], rgb(62, 62, 60));
  poly(c, V, [[x0, 0, z0], [x0, h, z0], [x0, h, z], [x0, 0, z]], rgb(58, 56, 52));
  poly(c, V, [[x0, 0, z0], [x0, h, z0], [x1, h, z0], [x1, 0, z0]], rgb(82, 80, 74));
  line(c, V, [[x0, h, z0], [x1, h, z0]], rgb(130, 128, 120), 1.2);
  c.save();
  for (let xw = x0 + 3; xw < x1 - 2; xw += 3.6) {
    if (Math.abs(xw + 4) < 6) continue;
    const pts: V3[] = [[xw - 0.8, 5.4, z0 - 0.05], [xw - 0.8, 7.2, z0 - 0.05], [xw + 0.8, 7.2, z0 - 0.05], [xw + 0.8, 5.4, z0 - 0.05]];
    poly(c, V, pts, rgb(16, 18, 22));
    const L = winLight(f, T, { z: z0 + 0.5, off: 2 + hx1Rnd(xw) * 1.5, keep: false, pass: hx1Rnd(xw * 3) });
    if (L.b > 0.01) {
      const [r, g, b] = hx1FilamentRGB(L.heat);
      poly(c, V, pts, `rgba(${r | 0},${g | 0},${b | 0},${Math.min(1, 0.9 * L.b).toFixed(3)})`);
    }
  }
  // the main gate: double doors under a flat canopy, lit from inside until the end of the wave
  const gx = -4;
  const L = winLight(f, T, { z: z0, off: 3, keep: false, pass: 0.95 });
  poly(c, V, [[gx - 4, 0, z0 - 0.05], [gx - 4, 4.2, z0 - 0.05], [gx + 4, 4.2, z0 - 0.05], [gx + 4, 0, z0 - 0.05]], rgb(20, 18, 16));
  if (L.b > 0.01) {
    const [r, g, b] = hx1FilamentRGB(L.heat);
    poly(c, V, [[gx - 4, 0.1, z0 - 0.07], [gx - 4, 4.0, z0 - 0.07], [gx + 4, 4.0, z0 - 0.07], [gx + 4, 0.1, z0 - 0.07]], `rgba(${r | 0},${g | 0},${b | 0},${(0.75 * L.b).toFixed(3)})`);
  }
  for (const xd of [-2, 0, 2]) line(c, V, [[gx + xd, 0.1, z0 - 0.08], [gx + xd, 4.0, z0 - 0.08]], "rgba(10,10,10,0.9)", 1);
  poly(c, V, [[gx - 6, 4.6, z0 - 3], [gx + 6, 4.6, z0 - 3], [gx + 6, 4.6, z0], [gx - 6, 4.6, z0]], rgb(110, 108, 100));
  poly(c, V, [[gx - 6, 4.1, z0 - 3], [gx - 6, 4.6, z0 - 3], [gx + 6, 4.6, z0 - 3], [gx + 6, 4.1, z0 - 3]], rgb(140, 138, 130));
  c.restore();
}

function drawTree(c: Ctx, V: HX1View, t: Tree, warm: number) {
  const p = V.P(t.p);
  const r = t.r * p.s;
  if (p.y < 380 || p.y > 1700 || p.x < -60 || p.x > 1140) return;
  c.fillStyle = rgb(16 + 6 * t.k, 24 + 6 * t.k, 22 + 5 * t.k);
  c.beginPath(); c.arc(p.x, p.y, r, 0, Math.PI * 2); c.fill();
  c.fillStyle = rgb(26, 34, 32, 1, 0.8);
  c.beginPath(); c.arc(p.x - r * 0.3, p.y - r * 0.35, r * 0.55, 0, Math.PI * 2); c.fill();
  // the warm rim the arena's windows put on the near trees
  const w = warm * t.near;
  if (w > 0.02) {
    c.strokeStyle = `rgba(255,190,110,${(0.5 * w).toFixed(3)})`;
    c.lineWidth = Math.max(1, r * 0.12);
    c.beginPath(); c.arc(p.x, p.y, r * 0.92, Math.PI * 0.05, Math.PI * 0.75); c.stroke();
  }
}

function drawTowers(c: Ctx, V: HX1View) {
  for (const [tx, tz] of [[-46, 70], [-20, 78]]) {
    const w = 3.2, h = 17;
    poly(c, V, [[tx - w, 0, tz - w], [tx - w, h, tz - w], [tx + w, h, tz - w], [tx + w, 0, tz - w]], rgb(74, 70, 64));
    poly(c, V, [[tx - w, 0, tz - w], [tx - w, h, tz - w], [tx - w, h, tz + w], [tx - w, 0, tz + w]], rgb(52, 50, 46));
    const top = V.P([tx, h + 2.6, tz]);
    const base = V.P([tx, h, tz]);
    c.fillStyle = rgb(96, 34, 30);
    c.beginPath(); c.ellipse(top.x, (top.y + base.y) / 2, 3.6 * base.s, Math.max(1, (base.y - top.y) * 0.75 + 1.4 * base.s), 0, Math.PI, 0); c.fill();
  }
}

/** how lit the building still is (0-1): drives the light it throws on the ground and the trees */
function buildingLight(f: number, T: HookX1T) {
  let s = 0;
  for (let k = 0; k < 10; k++) s += hx1Filament(f, hx1OffAt(T, hx1Lerp(A.zFar, A.zNear, (k + 0.5) / 10), 0.5)).b;
  return Math.min(1.1, s / 10);
}

/* ---------- the two layers ---------- */
function drawBack(c: Ctx, V: HX1View, f: number, T: HookX1T) {
  c.clearRect(0, 0, W, H);
  const lit = buildingLight(f, T);
  // the ground: night grass, the road in front, the plaza, the car park behind
  poly(c, V, [hx1Town(-2500, -400), hx1Town(2500, -400), hx1Town(2500, 6000), hx1Town(-2500, 6000)], "rgb(13,17,21)");
  poly(c, V, [hx1Town(-900, -86), hx1Town(900, -86), hx1Town(900, -70), hx1Town(-900, -70)], "rgb(19,21,25)");
  poly(c, V, [hx1Town(-150, 92), hx1Town(250, 92), hx1Town(250, 262), hx1Town(-150, 262)], "rgb(20,23,28)");
  for (let e = -140; e <= 240; e += 6) line(c, V, [hx1Town(e, 100, 0.02), hx1Town(e, 112, 0.02)], "rgba(120,124,130,0.12)", 1);
  // the warm pool the building throws on the ground around it
  c.save(); c.globalCompositeOperation = "lighter";
  for (let k = 0; k < 10; k++) {
    const z = hx1Lerp(A.zFar - 4, A.zNear + 4, (k + 0.5) / 10);
    const b = hx1Filament(f, hx1OffAt(T, z, 0.5)).b;
    const p = V.P([-A.springX - 7, 0, z]);
    glow(c, p.x, p.y, 13 * p.s, WARM, 0.16 * b, 0.45);
  }
  const gp = V.P([-4, 0, -60]);
  glow(c, gp.x, gp.y, 16 * gp.s, WARM, 0.22 * hx1Filament(f, hx1OffAt(T, A.zNear, 3)).b, 0.5);
  // the car park's sodium lamps: they go out on "one", far ones first, so the vault is the one lit thing
  LOT_LAMPS.forEach((L, i) => {
    const p = V.P(L); const g = V.P([L[0], 0, L[2]]);
    if (p.y < 420) return;
    const b = hx1Filament(f, T.one - 8 + (1 - (p.y - 420) / 500) * 10 + hx1Rnd(i * 3.3) * 5).b;
    if (b < 0.02) return;
    glow(c, g.x, g.y, 12 * g.s, SODIUM, 0.09 * b, 0.5);
    glow(c, p.x, p.y, 2.2 * p.s, SODIUM, 0.55 * b);
  });
  // the town's windows go out on "one", from the edges in: this is the one lit building
  for (const t of TOWN) {
    const off = T.one - 6 + (1 - Math.min(1, t.d / 1100)) * 14 + t.k * 4;
    const b = hx1Filament(f, off).b;
    if (b < 0.02) continue;
    const p = V.P(t.p);
    if (p.y < 400 || p.x < -20 || p.x > 1100) continue;
    glow(c, p.x, p.y, Math.max(2.5, 0.9 * p.s), WARM, 0.6 * b);
  }
  c.restore();
  drawTowers(c, V);
  for (const t of TREES) if (!t.front) drawTree(c, V, t, lit);
}

/** dust shaken off the ribs: a small puff on every clack after "scored", a big one on the 100 */
function drawDust(c: Ctx, V: HX1View, f: number, T: HookX1T) {
  const from = T.scored - 1;
  for (let e = from; e <= Math.min(f, T.n100 + 1); e++) {
    if (hx1Points(e, T) === hx1Points(e - 1, T)) continue;
    const big = e >= T.n100 - 4;
    const t = f - e;
    if (t < 0 || t > 40) continue;
    const n = big ? 110 : 14;
    for (let j = 0; j < n; j++) {
      const r1 = hx1Rnd(e * 7.3 + j * 1.91), r2 = hx1Rnd(e * 3.1 + j * 5.7), r3 = hx1Rnd(e * 1.7 + j * 9.3);
      const k = Math.floor(r1 * A.ribs);
      const a = Math.PI * (0.52 + 0.44 * r2);
      const n0 = vNormal(a);
      const p0 = vp(a, hx1RibZ(k));
      const sec = t / 60;
      const out = 0.6 + 1.6 * r3;
      const pt: V3 = [p0[0] + n0[0] * out * sec * 4, p0[1] + n0[1] * out * sec * 3 - 9.8 * sec * sec * 7, p0[2] + (r3 - 0.5) * 3 * sec];
      if (!facing(V, p0, n0)) continue;
      const q = V.P(pt);
      const al = (1 - t / 40) * (big ? 0.9 : 0.8);
      c.fillStyle = `rgba(226,220,206,${al.toFixed(3)})`;
      const s = big ? 2.6 + r3 * 2.4 : 2.2 + r3 * 1.6;
      c.fillRect(q.x - s / 2, q.y - s / 2, s, s);
    }
  }
}

function drawFront(c: Ctx, V: HX1View, f: number, T: HookX1T) {
  c.clearRect(0, 0, W, H);
  const body = hx1Body(f, T);
  const fade = hx1Fade(f, T);
  const lit = buildingLight(f, T);
  c.save();
  c.globalAlpha = fade;
  c.translate(body.dx, body.dy);
  drawRoof(c, V, lit);
  drawRibs(c, V, f, T);
  drawDormers(c, V, f, T);
  drawLongWall(c, V, f, T);
  drawFins(c, V);
  drawGable(c, V, f, T);
  drawGateBlock(c, V, f, T);
  drawBoard(c, V, f, T);
  // with the lights out the concrete is only moonlit: the whole building darkens
  c.globalCompositeOperation = "source-atop";
  c.fillStyle = `rgba(6,8,12,${(0.42 * (1 - Math.min(1, lit))).toFixed(3)})`;
  c.fillRect(-50, -50, W + 100, H + 100);
  c.globalCompositeOperation = "source-over";
  drawSurvivors(c, V, f, T);
  drawDust(c, V, f, T);
  c.restore();
  c.save();
  c.globalAlpha = fade;
  for (const t of TREES) if (t.front) drawTree(c, V, t, lit);
  c.restore();
}

export const HookX1World: React.FC<{ f: number; T: HookX1T; V: HX1View; layer: "back" | "front" }> = ({ f, T, V, layer }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const c = ref.current?.getContext("2d");
    if (!c) return;
    if (layer === "back") {
      drawBack(c, V, f, T);
      // it all fades with the building in the last frames: the ground under it is the reel's own
      c.globalCompositeOperation = "destination-in";
      c.fillStyle = `rgba(0,0,0,${hx1Fade(f, T).toFixed(3)})`;
      c.fillRect(0, 0, W, H);
      c.globalCompositeOperation = "source-over";
    } else drawFront(c, V, f, T);
  }, [f, T, V, layer]);
  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />;
};

