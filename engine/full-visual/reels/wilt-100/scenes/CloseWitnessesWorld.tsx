// wilt-100 "close": the night world on one canvas, drawn from the camera every frame. Hershey Sports Arena from
// outside (the Beato aerial's angle): the barrel vault with its 11 ribs, weathered streaks and four louvred dormers,
// the eave fins, the cream long wall with two storeys of windows, the panelled near gable and the low block with the
// main gate, the two domed towers, trees, the car park and its lamps. The roof opens bay by bay and the inside (floor,
// 1962 court, ~7,100 seats) shows; only the witnesses light amber: the 4,124 in the seats, the radio, the flashbulb,
// the ball. Then the camera rises over the town (Chocolate Avenue's Kiss lamps, the factory and its two stacks, the
// houses) and everything goes dark.
import React, { useLayoutEffect, useRef } from "react";
import { ease, prog } from "../../../src/engine";
import {
  CW_AMBER, CW_ARENA as A, CW_FLASH, CW_GATE, CW_RADIO, CW_SEATS, type CloseWitnessesT, type CwView, type V3,
  cwClamp, cwLerp, cwRibZ, cwRnd, cwTown, cwVault, cwView,
} from "./CloseWitnessesKit";

const W = 1080, H = 1920;
type Ctx = CanvasRenderingContext2D;

const LIGHT: V3 = (() => { const v: V3 = [-0.55, 0.72, -0.42]; const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l]; })();
const rgb = (r: number, g: number, b: number, k = 1, a = 1) =>
  `rgba(${Math.round(cwClamp(r * k, 0, 255))},${Math.round(cwClamp(g * k, 0, 255))},${Math.round(cwClamp(b * k, 0, 255))},${a})`;

function poly(c: Ctx, V: CwView, pts: V3[], fill?: string, stroke?: string, lw = 1) {
  const q = pts.map(V.P);
  if (q.some((p) => p.z < 0.5)) return;
  c.beginPath();
  q.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
  c.closePath();
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); }
}
function line(c: Ctx, V: CwView, pts: V3[], stroke: string, lw: number) {
  const q = pts.map(V.P);
  if (q.some((p) => p.z < 0.5)) return;
  c.beginPath();
  q.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
  c.strokeStyle = stroke; c.lineWidth = lw; c.stroke();
}
function glow(c: Ctx, x: number, y: number, r: number, color: string, a: number) {
  if (a <= 0.003 || r <= 0.1) return;
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color.replace("ALPHA", String(a)));
  g.addColorStop(1, color.replace("ALPHA", "0"));
  c.fillStyle = g;
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
}
const AMB = "rgba(242,179,61,ALPHA)";
const WARM = "rgba(255,214,150,ALPHA)";
const WHITE = "rgba(255,250,235,ALPHA)";

/* ---------- fixed things of the town, placed once ---------- */
type Tree = { p: V3; r: number; front: boolean; k: number };
const TREES: Tree[] = (() => {
  const out: Tree[] = [];
  for (let i = 0; i < 900; i++) {
    const e = -330 + cwRnd(i * 1.13) * 700, n = -170 + cwRnd(i * 2.71 + 4) * 420;
    const p = cwTown(e, n, 0);
    // not on the building, the gate plaza, the car park or the road
    if (Math.abs(p[0]) < 48 && p[2] > -66 && p[2] < 60) continue;
    if (n > 92 && n < 262 && e > -150 && e < 250) continue;
    if (Math.abs(n + 78) < 12) continue;
    if (Math.abs(e - 10) < 40 && n < -40 && n > -76) continue;
    const r = 2.6 + cwRnd(i * 5.3) * 2.8;
    out.push({ p: [p[0], r * 1.25 + 2 + cwRnd(i) * 2, p[2]], r, front: n < -52, k: cwRnd(i * 9.1) });
  }
  return out;
})();
const LOT_LAMPS: V3[] = [];
for (let e = -120; e <= 230; e += 70) for (let n = 115; n <= 250; n += 66) LOT_LAMPS.push(cwTown(e, n, 10));
const KISS: V3[] = [];
for (let e = -1500; e <= 1800; e += 30) for (const s of [-1, 1]) KISS.push(cwTown(e + (s > 0 ? 15 : 0), -330 + s * 11, 4.5));
type House = { e: number; n: number; w: number; d: number; lit: boolean; k: number };
const HOUSES: House[] = (() => {
  const out: House[] = [];
  for (let i = 0; i < 420; i++) {
    const e = -1500 + cwRnd(i * 3.3 + 1) * 3300, n = -1300 + cwRnd(i * 4.9 + 2) * 920;
    if (e > 400 && e < 760 && n > -600) continue; // the factory
    if (Math.abs(n + 330) < 30) continue;
    out.push({ e, n, w: 10 + cwRnd(i * 7.7) * 16, d: 9 + cwRnd(i * 8.3) * 10, lit: cwRnd(i * 6.1) < 0.45, k: cwRnd(i * 2.2) });
  }
  for (let i = 0; i < 160; i++) {
    const e = -1300 + cwRnd(i * 5.1 + 9) * 2900, n = 300 + cwRnd(i * 1.9 + 3) * 600;
    out.push({ e, n, w: 10 + cwRnd(i * 7.1) * 14, d: 9 + cwRnd(i * 3.9) * 10, lit: cwRnd(i * 4.4) < 0.4, k: cwRnd(i * 1.7) });
  }
  return out;
})();

/* ---------- the roof ---------- */
const NA = 30; // strips across the vault
const BAYS = Array.from({ length: A.ribs - 1 }, (_, k) => [k === 0 ? A.zNear : cwRibZ(k), k === A.ribs - 2 ? A.zFar : cwRibZ(k + 1)]);
const vp = (a: number, z: number): V3 => { const [x, y] = cwVault(a); return [x, y, z]; };
const vNormal = (a: number): V3 => {
  const B = A.crownY - A.springY;
  const n: V3 = [Math.cos(a) * B, Math.sin(a) * A.springX, 0];
  const l = Math.hypot(n[0], n[1]);
  return [n[0] / l, n[1] / l, 0];
};
const facing = (V: CwView, p: V3, n: V3) => (V.pos[0] - p[0]) * n[0] + (V.pos[1] - p[1]) * n[1] + (V.pos[2] - p[2]) * n[2] > 0;

/** how open each bay is: the roof turns see-through rib by rib, far end (screen left) first */
export const cwBayOpen = (f: number, T: CloseWitnessesT, k: number) => prog(f, T.scoring - 10 + (A.ribs - 2 - k) * 2.2, 9, ease.out);

function drawRoof(c: Ctx, V: CwView, f: number, T: CloseWitnessesT, back: boolean, dark: number) {
  for (let k = 0; k < BAYS.length; k++) {
    const [z0, z1] = BAYS[k];
    const open = cwBayOpen(f, T, k);
    for (let i = 0; i < NA; i++) {
      const a0 = (i / NA) * Math.PI, a1 = ((i + 1) / NA) * Math.PI, am = (a0 + a1) / 2;
      const n = vNormal(am);
      const mid = vp(am, (z0 + z1) / 2);
      const front = facing(V, mid, n);
      if (front === back) continue;
      if (back) {
        // the inside of the far slope, seen only through the opened roof
        if (open <= 0.01) continue;
        const lit = 0.55 + 0.25 * Math.sin(am);
        poly(c, V, [vp(a0, z0), vp(a1, z0), vp(a1, z1), vp(a0, z1)], rgb(46, 52, 61, lit * (1 - 0.35 * dark), open * 0.9));
        continue;
      }
      const lam = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
      // weathered concrete: each bay a slightly different grey, darker toward the eaves
      const tone = 0.86 + cwRnd(k * 3.1 + 2) * 0.14;
      const sh = (0.34 + 0.78 * lam) * tone * (0.75 + 0.25 * Math.sin(am)) * (1 - 0.3 * dark);
      const alpha = 1 - 0.9 * open;
      poly(c, V, [vp(a0, z0), vp(a1, z0), vp(a1, z1), vp(a0, z1)], rgb(84, 92, 104, sh, alpha));
    }
    if (back) continue;
    const alpha = 1 - 0.9 * open;
    // long rain streaks down the slope
    for (let s = 0; s < 7; s++) {
      const z = cwLerp(z0 + 0.8, z1 - 0.8, cwRnd(k * 13 + s * 1.7));
      const aTop = Math.PI * (0.45 + cwRnd(k * 7 + s) * 0.25);
      const pts: V3[] = [];
      for (let j = 0; j <= 8; j++) pts.push(vp(cwLerp(aTop, Math.PI - 0.02, j / 8), z));
      const n = vNormal((aTop + Math.PI) / 2);
      if (facing(V, pts[4], n)) line(c, V, pts, `rgba(20,24,30,${(0.22 * alpha).toFixed(3)})`, Math.max(0.6, 0.35 * V.P(pts[4]).s));
    }
    // the opened bay keeps a hairline of its old surface
    if (open > 0.02) {
      const pts: V3[] = [];
      for (let j = 0; j <= 24; j++) pts.push(vp((j / 24) * Math.PI, (z0 + z1) / 2));
      line(c, V, pts, `rgba(140,150,162,${(0.12 * open).toFixed(3)})`, 1);
    }
  }
}

function drawRibs(c: Ctx, V: CwView, back: boolean, dark: number, f: number, T: CloseWitnessesT) {
  for (let k = 0; k < A.ribs; k++) {
    const z = cwRibZ(k);
    const open = Math.max(cwBayOpen(f, T, Math.min(k, A.ribs - 2)), cwBayOpen(f, T, Math.max(0, k - 1)));
    if (back && open < 0.02) continue;
    let seg: V3[] = [];
    const flush = () => {
      if (seg.length > 1) {
        const s = V.P(seg[Math.floor(seg.length / 2)]).s;
        line(c, V, seg, back ? `rgba(58,64,74,${(0.9 * open).toFixed(3)})` : rgb(118, 126, 138, (1 - 0.35 * dark) * (1 + 0.25 * open)), Math.max(1, 0.8 * s));
        if (!back) line(c, V, seg.map((p) => [p[0], p[1], p[2] + 0.55] as V3), `rgba(12,15,20,${0.55 - 0.2 * open})`, Math.max(0.8, 0.4 * s));
      }
      seg = [];
    };
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * Math.PI;
      const p = vp(a, z);
      const n = vNormal(a);
      const p2: V3 = [p[0] + n[0] * 0.2, p[1] + n[1] * 0.2, z];
      if (facing(V, p, n) !== back) seg.push(p2);
      else flush();
    }
    flush();
  }
}

/* ---------- walls ---------- */
const WIN_Z: number[] = [];
for (let z = A.zNear + 2.4; z < A.zFar - 2; z += 3.15) WIN_Z.push(z);
function drawFrontWall(c: Ctx, V: CwView, f: number, T: CloseWitnessesT, dark: number, flash: number) {
  const x = -A.springX;
  poly(c, V, [[x, 0, A.zNear], [x, A.springY, A.zNear], [x, A.springY, A.zFar], [x, 0, A.zFar]], rgb(78, 76, 70, 0.95 - 0.25 * dark));
  // a band under the eave and a plinth
  poly(c, V, [[x - 0.05, A.springY - 1.1, A.zNear], [x - 0.05, A.springY, A.zNear], [x - 0.05, A.springY, A.zFar], [x - 0.05, A.springY - 1.1, A.zFar]], rgb(92, 90, 84, 1 - 0.25 * dark));
  poly(c, V, [[x - 0.05, 0, A.zNear], [x - 0.05, 1.2, A.zNear], [x - 0.05, 1.2, A.zFar], [x - 0.05, 0, A.zFar]], rgb(52, 52, 50, 1 - 0.25 * dark));
  // two storeys of small square windows, most dark; a few still lit until "nobody"; the flash lights the near ones
  WIN_Z.forEach((z, i) => {
    for (const [y0, y1, row] of [[3.4, 5.0, 0], [9.6, 11.2, 1]] as const) {
      const r = cwRnd(i * 4.1 + row * 17.3);
      const lit = r < 0.13 ? 1 - prog(f, T.almost + r * 40, 10, ease.in) : 0;
      const d = Math.hypot(z - CW_FLASH[2], (y0 + y1) / 2 - CW_FLASH[1]);
      const fl = flash * Math.exp(-d / 9);
      const pts: V3[] = [[x - 0.06, y0, z - 0.7], [x - 0.06, y1, z - 0.7], [x - 0.06, y1, z + 0.7], [x - 0.06, y0, z + 0.7]];
      poly(c, V, pts, rgb(18, 21, 26));
      if (lit > 0.01) poly(c, V, pts, `rgba(255,205,128,${(0.85 * lit).toFixed(3)})`);
      if (fl > 0.01) poly(c, V, pts, `rgba(255,252,240,${Math.min(1, fl).toFixed(3)})`);
      // the mullion
      line(c, V, [[x - 0.07, y0, z], [x - 0.07, y1, z]], "rgba(70,70,66,0.9)", Math.max(0.6, 0.12 * V.P([x, y0, z]).s));
    }
  });
  // the fins at every rib foot, pale triangles standing on the eave
  for (let k = 0; k < A.ribs; k++) {
    const z = cwRibZ(k);
    const top = vp(Math.PI - 0.21, z);
    poly(c, V, [[x - 1.9, A.springY - 0.6, z], [x + 0.2, A.springY - 0.6, z], top], rgb(150, 146, 136, 1 - 0.3 * dark));
    poly(c, V, [[x - 1.9, A.springY - 0.6, z], [x - 1.9, A.springY - 0.6, z + 0.6], [top[0], top[1], z + 0.6], top], rgb(96, 94, 88, 1 - 0.3 * dark));
  }
}
function drawGable(c: Ctx, V: CwView, f: number, T: CloseWitnessesT, dark: number) {
  const z = A.zNear;
  const out: V3[] = [[A.springX, 0, z], [A.springX, A.springY, z]];
  for (let i = 0; i <= 40; i++) out.push(vp((i / 40) * Math.PI, z));
  out.push([-A.springX, A.springY, z], [-A.springX, 0, z]);
  poly(c, V, out, rgb(96, 94, 88, 1 - 0.3 * dark));
  // the curved edge of the vault over the gable
  const edge: V3[] = []; for (let i = 0; i <= 40; i++) edge.push(vp((i / 40) * Math.PI, z - 0.4));
  line(c, V, edge, rgb(130, 128, 120, 1 - 0.3 * dark), Math.max(1, 0.5 * V.P(edge[20]).s));
  // tall precast panels with vertical joints
  for (let xj = -A.springX + 3.3; xj < A.springX; xj += 3.3) {
    const a = Math.acos(cwClamp(xj / A.springX, -1, 1));
    const yTop = cwVault(a)[1] - 0.3;
    line(c, V, [[xj, 0.3, z - 0.05], [xj, yTop, z - 0.05]], `rgba(40,40,40,${0.45 - 0.1 * dark})`, 1);
  }
  // a band of tall windows high in the gable, dark
  for (let xj = -12; xj <= 12; xj += 4) {
    poly(c, V, [[xj - 1, 19, z - 0.06], [xj - 1, 25.5 - Math.abs(xj) * 0.18, z - 0.06], [xj + 1, 25.5 - Math.abs(xj) * 0.18, z - 0.06], [xj + 1, 19, z - 0.06]], rgb(22, 25, 30));
  }
  // the low block in front of the gable, with the main gate
  const z0 = -54.5, h = 9.5, x0 = -31, x1 = 31;
  poly(c, V, [[x0, h, z0], [x1, h, z0], [x1, h, z], [x0, h, z]], rgb(70, 70, 68, 1 - 0.3 * dark));
  poly(c, V, [[x0, 0, z0], [x0, h, z0], [x0, h, z], [x0, 0, z]], rgb(66, 64, 60, 1 - 0.3 * dark));
  poly(c, V, [[x0, 0, z0], [x0, h, z0], [x1, h, z0], [x1, 0, z0]], rgb(92, 90, 84, 1 - 0.3 * dark));
  line(c, V, [[x0, h, z0], [x1, h, z0]], rgb(140, 138, 130, 1 - 0.3 * dark), 1.2);
  for (let xw = x0 + 3; xw < x1 - 2; xw += 3.6) {
    if (Math.abs(xw - CW_GATE[0]) < 6) continue;
    poly(c, V, [[xw - 0.8, 5.4, z0 - 0.05], [xw - 0.8, 7.2, z0 - 0.05], [xw + 0.8, 7.2, z0 - 0.05], [xw + 0.8, 5.4, z0 - 0.05]], rgb(20, 23, 28));
  }
  // the gate: double doors under a flat canopy, its lamp on until "nobody"
  const gx = CW_GATE[0];
  const lamp = 1 - prog(f, T.almost + 6, 10, ease.in);
  poly(c, V, [[gx - 4, 0, z0 - 0.05], [gx - 4, 4.2, z0 - 0.05], [gx + 4, 4.2, z0 - 0.05], [gx + 4, 0, z0 - 0.05]], rgb(24, 22, 20));
  poly(c, V, [[gx - 4, 0.1, z0 - 0.07], [gx - 4, 4.0, z0 - 0.07], [gx + 4, 4.0, z0 - 0.07], [gx + 4, 0.1, z0 - 0.07]], `rgba(255,205,140,${(0.32 * lamp).toFixed(3)})`);
  for (const xd of [-2, 0, 2]) line(c, V, [[gx + xd, 0.1, z0 - 0.08], [gx + xd, 4.0, z0 - 0.08]], "rgba(10,10,10,0.9)", 1);
  poly(c, V, [[gx - 6, 4.6, z0 - 3], [gx + 6, 4.6, z0 - 3], [gx + 6, 4.6, z0], [gx - 6, 4.6, z0]], rgb(120, 118, 110, 1 - 0.3 * dark));
  poly(c, V, [[gx - 6, 4.1, z0 - 3], [gx - 6, 4.6, z0 - 3], [gx + 6, 4.6, z0 - 3], [gx + 6, 4.1, z0 - 3]], rgb(150, 148, 140, 1 - 0.3 * dark));
  const gp = V.P([gx, 3.6, z0 - 1.5]);
  glow(c, gp.x, gp.y, 9 * gp.s, WARM, 0.32 * lamp);
}
function drawDormers(c: Ctx, V: CwView, f: number, T: CloseWitnessesT, dark: number) {
  const a = Math.PI - 0.42;
  const [x, y] = cwVault(a);
  for (const zc of [-29, -9.5, 10, 29.5]) {
    const k = BAYS.findIndex(([z0, z1]) => zc >= z0 && zc < z1);
    const al = 1 - 0.92 * cwBayOpen(f, T, Math.max(0, k));
    if (al < 0.03) continue;
    const xf = x - 1.2;
    // the box sits in the slope: a dark louvred face toward the camera's side, a lit top
    poly(c, V, [[xf, y - 0.6, zc - 2.1], [xf, y + 2.4, zc - 2.1], [xf + 3.4, y + 2.4, zc - 2.1], [xf + 3.4, y + 1.0, zc - 2.1]], rgb(70, 76, 86, 1, al));
    poly(c, V, [[xf, y + 2.4, zc - 2.1], [xf + 3.4, y + 2.4, zc - 2.1], [xf + 3.4, y + 2.4, zc + 2.1], [xf, y + 2.4, zc + 2.1]], rgb(112, 120, 132, 1 - 0.3 * dark, al));
    poly(c, V, [[xf, y - 0.6, zc - 2.1], [xf, y + 2.4, zc - 2.1], [xf, y + 2.4, zc + 2.1], [xf, y - 0.6, zc + 2.1]], rgb(26, 30, 36, 1, al));
    for (let j = 0; j < 5; j++) {
      const yy = y - 0.3 + j * 0.55;
      line(c, V, [[xf - 0.02, yy, zc - 1.8], [xf - 0.02, yy, zc + 1.8]], `rgba(90,96,106,${(0.6 * al).toFixed(3)})`, 1);
    }
  }
}
function drawTowers(c: Ctx, V: CwView, dark: number) {
  // the two small towers with red domes off the far end (Beato aerial, far left)
  for (const [tx, tz] of [[-46, 70], [-20, 78]]) {
    const w = 3.2, h = 17;
    poly(c, V, [[tx - w, 0, tz - w], [tx - w, h, tz - w], [tx + w, h, tz - w], [tx + w, 0, tz - w]], rgb(92, 88, 80, 1 - 0.3 * dark));
    poly(c, V, [[tx - w, 0, tz - w], [tx - w, h, tz - w], [tx - w, h, tz + w], [tx - w, 0, tz + w]], rgb(64, 62, 58, 1 - 0.3 * dark));
    for (let i = 0; i < 3; i++) poly(c, V, [[tx - w - 0.05, 10 + i * 2, tz - 1], [tx - w - 0.05, 11.2 + i * 2, tz - 1], [tx - w - 0.05, 11.2 + i * 2, tz + 1], [tx - w - 0.05, 10 + i * 2, tz + 1]], rgb(20, 22, 26));
    const top = V.P([tx, h + 2.6, tz]);
    const base = V.P([tx, h, tz]);
    c.fillStyle = rgb(110, 38, 34, 1 - 0.35 * dark);
    c.beginPath(); c.ellipse(top.x, (top.y + base.y) / 2, 3.6 * base.s, Math.max(1, (base.y - top.y) * 0.75 + 1.4 * base.s), 0, Math.PI, 0); c.fill();
    c.fillStyle = rgb(60, 20, 18, 1 - 0.35 * dark);
    c.beginPath(); c.ellipse(base.x, base.y, 3.6 * base.s, 1.2 * base.s, 0, 0, Math.PI); c.fill();
  }
}

/* ---------- the inside, through the opened roof ---------- */
function drawInside(c: Ctx, V: CwView, f: number, T: CloseWitnessesT, dark: number, inK: number) {
  if (inK <= 0.01) return;
  c.save();
  c.globalAlpha = inK;
  // concourse and floor
  const ring: V3[] = [];
  const ov: V3[] = [];
  const rr = A.rinkR;
  const rect = (hx: number, hz: number, r: number, y: number, out: V3[]) => {
    const cs: [number, number, number][] = [[hx - r, hz - r, 0], [-(hx - r), hz - r, Math.PI / 2], [-(hx - r), -(hz - r), Math.PI], [hx - r, -(hz - r), Math.PI * 1.5]];
    for (const [cx, cz, a0] of cs) for (let i = 0; i <= 8; i++) { const a = a0 + (i / 8) * (Math.PI / 2); out.push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]); }
  };
  rect(A.springX - 0.5, 30.5 + 0.5, 1, 0.02, ring);
  poly(c, V, ring, rgb(30, 33, 38, 1 - 0.4 * dark));
  rect(A.rinkX, A.rinkZ, rr, 0.05, ov);
  poly(c, V, ov, rgb(74, 56, 38, 1 - 0.45 * dark), "rgba(190,186,176,0.35)", 1.2);
  // the 1962 court: boundary, centre line and circle, the 12 ft lanes and their circles
  const cl = `rgba(232,222,200,${(0.5 - 0.25 * dark).toFixed(3)})`;
  const X = A.courtX, Z = A.courtZ;
  poly(c, V, [[-X, 0.06, -Z], [X, 0.06, -Z], [X, 0.06, Z], [-X, 0.06, Z]], undefined, cl, 1);
  line(c, V, [[-X, 0.06, 0], [X, 0.06, 0]], cl, 1);
  const circ = (cx: number, cz: number, r: number) => { const p: V3[] = []; for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI * 2; p.push([cx + Math.cos(a) * r, 0.06, cz + Math.sin(a) * r]); } return p; };
  line(c, V, circ(0, 0, 1.83), cl, 1);
  for (const s of [-1, 1]) {
    const zb = s * Z, zf = s * (Z - 5.79);
    poly(c, V, [[-0.91, 0.06, zb], [-0.91, 0.06, zf], [0.91, 0.06, zf], [0.91, 0.06, zb]], undefined, cl, 1);
    line(c, V, circ(0, zf, 1.83), cl, 1);
  }
  // the press table on the far sideline
  poly(c, V, [[8.75, 0.76, -5.4], [9.55, 0.76, -5.4], [9.55, 0.76, 6], [8.75, 0.76, 6]], rgb(70, 54, 40, 1 - 0.4 * dark));
  // the seats: every empty one a dim grey grain, every one of the 4,124 an amber witness on "scoring"
  const sz = cwClamp(0.32 * V.pxPerM, 0.7, 2.6);
  c.fillStyle = `rgba(120,132,148,${(0.42 - 0.22 * dark).toFixed(3)})`;
  for (const s of CW_SEATS) {
    if (s.filled && f >= T.scoring + s.r * 14) continue;
    const p = V.P([s.x, s.y, s.z]);
    c.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz * 0.8);
  }
  c.restore();
}
function drawFans(c: Ctx, V: CwView, f: number, T: CloseWitnessesT, inK: number) {
  if (inK <= 0.01 || f < T.scoring - 2) return;
  const sz = cwClamp(0.36 * V.pxPerM, 0.6, 2.8);
  c.save();
  c.globalAlpha = inK;
  c.fillStyle = CW_AMBER;
  for (const s of CW_SEATS) {
    if (!s.filled) continue;
    const t = f - (T.scoring - 2 + s.r * 14);
    if (t < 0) continue;
    const p = V.P([s.x, s.y, s.z]);
    const k = 1 + 0.9 * Math.exp(-t / 4);
    c.fillRect(p.x - (sz * k) / 2, p.y - (sz * k) / 2, sz * k, sz * k);
  }
  c.restore();
}

/* ---------- the town ---------- */
function drawGround(c: Ctx, V: CwView, f: number, T: CloseWitnessesT, dark: number, townK: number) {
  c.fillStyle = "#0B1015";
  c.fillRect(0, 0, W, H);
  if (townK <= 0.01) return;
  c.save();
  c.globalAlpha = townK;
  const g = (e0: number, n0: number, e1: number, n1: number): V3[] => [cwTown(e0, n0), cwTown(e1, n0), cwTown(e1, n1), cwTown(e0, n1)];
  // the town blocks around the park, a shade lighter than the fields
  poly(c, V, g(-1600, -1350, 1900, -360), "#0E141A");
  poly(c, V, g(-1400, 290, 1700, 950), "#0E141A");
  // roads: Park Boulevard in front of the arena, Chocolate Avenue, the cross streets
  const road = (pts: V3[], w: number) => {
    const s = V.P(pts[Math.floor(pts.length / 2)]).s;
    line(c, V, pts, "#1A2027", Math.max(1, w * Math.min(s, V.pxPerM * 1.4)));
  };
  road([cwTown(-700, -78), cwTown(-200, -80), cwTown(200, -76), cwTown(700, -70)], 12);
  road([cwTown(-1600, -330), cwTown(1900, -330)], 18);
  for (const e of [-1100, -700, -300, 120, 760, 1200]) road([cwTown(e, -1350), cwTown(e, -330)], 10);
  road([cwTown(330, -330), cwTown(250, -90), cwTown(260, 300)], 10);
  // the car park behind the arena: asphalt, stall rows, lamps with their pools
  poly(c, V, g(-150, 92, 250, 262), "#151A20");
  for (let n = 110; n <= 250; n += 16) line(c, V, [cwTown(-140, n), cwTown(240, n)], "rgba(150,158,168,0.10)", 1);
  const lampOn = (i: number) => 1 - prog(f, T.almost + cwRnd(i * 3.3) * 18, 8, ease.in);
  LOT_LAMPS.forEach((p, i) => {
    const q = V.P(p), q0 = V.P([p[0], 0, p[2]]);
    const on = lampOn(i);
    line(c, V, [[p[0], 0, p[2]], p], "rgba(80,86,94,0.7)", Math.max(0.6, 0.25 * q.s));
    glow(c, q0.x, q0.y, 22 * q0.s, WARM, 0.1 * on);
    glow(c, q.x, q.y, Math.max(2.5, 1.6 * q.s), WARM, 0.75 * on);
  });
  // houses south and north of the avenue, a few windows lit until "nobody"
  for (const h of HOUSES) {
    const p = cwTown(h.e, h.n, 0);
    const q = V.P(p);
    if (q.x < -60 || q.x > W + 60 || q.y < 300 || q.y > 1700) continue;
    const pts = g(h.e - h.w / 2, h.n - h.d / 2, h.e + h.w / 2, h.n + h.d / 2).map((v) => [v[0], 7, v[2]] as V3);
    poly(c, V, pts, rgb(34, 38, 44, 1 - 0.4 * dark));
    if (h.lit) {
      const on = 1 - prog(f, T.almost + 2 + h.k * 22, 6, ease.in);
      const w = V.P([p[0], 7.2, p[2]]);
      glow(c, w.x, w.y, Math.max(2.5, 3 * w.s), WARM, 0.75 * on);
    }
  }
  // the chocolate factory: long brick roofs and the two stacks lettered HERSHEY
  poly(c, V, g(420, -560, 760, -370).map((v) => [v[0], 18, v[2]] as V3), rgb(58, 34, 28, 1 - 0.4 * dark));
  for (let n = -540; n < -380; n += 22) line(c, V, [cwTown(425, n, 18.1), cwTown(755, n, 18.1)], "rgba(20,12,10,0.6)", 1);
  for (const e of [520, 552]) {
    const b = cwTown(e, -392, 18), t = cwTown(e, -392, 64);
    const qb = V.P(b);
    line(c, V, [b, t], rgb(110, 52, 40, 1 - 0.4 * dark), Math.max(1.4, 4.4 * qb.s));
    const qt = V.P(t);
    c.fillStyle = "#120C0A"; c.beginPath(); c.arc(qt.x, qt.y, Math.max(0.8, 1.6 * qt.s), 0, Math.PI * 2); c.fill();
  }
  // Chocolate Avenue's Kiss lamps, both sides, going out down the street on "nobody"
  KISS.forEach((p, i) => {
    const q = V.P(p);
    if (q.x < -20 || q.x > W + 20) return;
    const e = (i >> 1) * 30 - 1500;
    const on = 1 - prog(f, T.almost + 4 + ((e + 1500) / 3300) * 26, 6, ease.in);
    const q0 = V.P([p[0], 0, p[2]]);
    glow(c, q0.x, q0.y, 10 * q0.s, WARM, 0.12 * on);
    glow(c, q.x, q.y, Math.max(2.4, 1.4 * q.s), "rgba(255,233,184,ALPHA)", 0.95 * on);
  });
  c.restore();
}
function drawTrees(c: Ctx, V: CwView, front: boolean, dark: number, townK: number) {
  if (townK <= 0.01) return;
  c.save();
  c.globalAlpha = townK;
  const list = TREES.filter((t) => t.front === front).map((t) => ({ t, q: V.P(t.p) })).sort((a, b) => b.q.z - a.q.z);
  for (const { t, q } of list) {
    if (q.z < 1) continue;
    const r = Math.max(0.8, t.r * q.s);
    c.fillStyle = rgb(10 + t.k * 4, 16 + t.k * 5, 14 + t.k * 3, 1 - 0.3 * dark);
    c.beginPath(); c.arc(q.x, q.y, r, 0, Math.PI * 2); c.fill();
    c.fillStyle = `rgba(110,130,126,${(0.05 * (1 - dark)).toFixed(3)})`;
    c.beginPath(); c.arc(q.x - r * 0.3, q.y - r * 0.35, r * 0.55, 0, Math.PI * 2); c.fill();
  }
  c.restore();
}

/* ---------- the witnesses ---------- */
export function cwBallPos(f: number, T: CloseWitnessesT): V3 {
  const k = prog(f, T.and - 4, 34, ease.out);
  return [CW_GATE[0] - 3.5 * k, 0.12, CW_GATE[2] - 1.5 - 9 * k];
}
function drawWitnessLights(c: Ctx, V: CwView, f: number, T: CloseWitnessesT, inK: number) {
  c.save();
  c.globalCompositeOperation = "lighter";
  // the fans: one warm haze over the banks once they are lit
  const fansK = prog(f, T.scoring, 14, ease.out) * inK;
  for (const p of [[24, 8, 0], [-24, 8, 0], [0, 8, 38]] as V3[]) {
    const q = V.P(p);
    glow(c, q.x, q.y, 26 * q.s, AMB, 0.16 * fansK);
  }
  // the radio: its broadcast dial glows, a ring goes out on "night"
  const rk = prog(f, T.night - 2, 6, ease.out) * inK;
  if (rk > 0) {
    const q = V.P(CW_RADIO);
    glow(c, q.x, q.y, Math.max(10, 4 * q.s), AMB, 0.9 * rk);
    for (let i = 0; i < 2; i++) {
      const t = (f - T.night - i * 9) / 26;
      if (t > 0 && t < 1) {
        c.strokeStyle = `rgba(242,179,61,${(0.75 * (1 - t) * rk).toFixed(3)})`;
        c.lineWidth = 2;
        c.beginPath(); c.ellipse(q.x, q.y, (4 + t * 16) * q.s, (4 + t * 16) * q.s * 0.45, 0, 0, Math.PI * 2); c.stroke();
      }
    }
  }
  // the flashbulb: a white burst in the locker room on "ever", then an amber point
  const ft = f - (T.ever - 1);
  if (ft >= 0) {
    const q = V.P(CW_FLASH);
    const burst = Math.exp(-ft / 5);
    glow(c, q.x, q.y, 40 * q.s * (0.6 + 0.4 * burst), WHITE, 0.95 * burst);
    glow(c, q.x, q.y, Math.max(9, 3.5 * q.s), AMB, 0.9 * prog(f, T.ever + 2, 6, ease.out));
  }
  // the ball: out of the main gate on "and"
  if (f >= T.and - 4) {
    const q = V.P(cwBallPos(f, T));
    glow(c, q.x, q.y, Math.max(9, 3.2 * q.s), AMB, 0.95 * prog(f, T.and - 4, 6, ease.out));
  }
  c.restore();
}
function drawBall(c: Ctx, V: CwView, f: number, T: CloseWitnessesT) {
  if (f < T.and - 4) return;
  const p = cwBallPos(f, T);
  const q = V.P(p);
  const r = Math.max(1.5, 0.12 * q.s);
  const sh = V.P([p[0] + 0.1, 0.01, p[2] + 0.1]);
  c.fillStyle = "rgba(0,0,0,0.45)";
  c.beginPath(); c.ellipse(sh.x, sh.y, r * 1.2, r * 0.5, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = "#8A5A30";
  c.beginPath(); c.arc(q.x, q.y - r * 0.4, r, 0, Math.PI * 2); c.fill();
  c.strokeStyle = CW_AMBER; c.lineWidth = Math.max(1, r * 0.25);
  c.beginPath(); c.arc(q.x, q.y - r * 0.4, r, 0, Math.PI * 2); c.stroke();
}
/** what is left when the town is a few pixels: all the witnesses as one amber point */
function drawMergedPoint(c: Ctx, V: CwView, k: number) {
  if (k <= 0.01) return;
  const q = V.P([0, 6, 0]);
  c.save();
  c.globalCompositeOperation = "lighter";
  glow(c, q.x, q.y, 22, AMB, 0.45 * k);
  c.restore();
}

export function drawCloseWitnessesWorld(c: Ctx, f: number, T: CloseWitnessesT, V: CwView, showK: number) {
  c.clearRect(0, 0, W, H);
  if (showK <= 0.002) return;
  c.save();
  c.globalAlpha = showK;
  const dark = prog(f, T.almost, T.nobody - T.almost + 8, ease.inOut);
  // the town fades into the map as it shrinks under a few pixels a block
  const townK = cwClamp((Math.log(V.pxPerM) - Math.log(0.012)) / (Math.log(0.12) - Math.log(0.012)));
  const arenaK = cwClamp((Math.log(V.pxPerM) - Math.log(0.05)) / (Math.log(0.4) - Math.log(0.05)));
  const inK = Math.max(...Array.from({ length: A.ribs - 1 }, (_, k) => cwBayOpen(f, T, k)));
  drawGround(c, V, f, T, dark, townK);
  c.save();
  c.globalAlpha = showK * arenaK;
  drawTrees(c, V, false, dark, 1);
  drawTowers(c, V, dark);
  drawRoof(c, V, f, T, true, dark);
  drawRibs(c, V, true, dark, f, T);
  drawInside(c, V, f, T, dark, inK);
  drawFans(c, V, f, T, inK);
  drawGable(c, V, f, T, dark);
  drawFrontWall(c, V, f, T, dark, f >= T.ever - 1 ? Math.exp(-(f - T.ever + 1) / 5) : 0);
  drawRoof(c, V, f, T, false, dark);
  drawDormers(c, V, f, T, dark);
  drawRibs(c, V, false, dark, f, T);
  drawTrees(c, V, true, dark, 1);
  drawBall(c, V, f, T);
  c.restore();
  drawWitnessLights(c, V, f, T, Math.max(inK, 1 - arenaK));
  drawMergedPoint(c, V, 1 - arenaK);
  c.restore();
}

export const CloseWitnessesWorld: React.FC<{ f: number; T: CloseWitnessesT; showK: number }> = ({ f, T, showK }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const c = ref.current?.getContext("2d");
    if (c) drawCloseWitnessesWorld(c, f, T, cwView(f, T), showK);
  });
  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />;
};
