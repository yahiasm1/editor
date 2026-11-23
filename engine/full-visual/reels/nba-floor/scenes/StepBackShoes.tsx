// Scene `worth`'s sneakers, seen side-on at shoe height (and from above while the camera dives). Drawn from the Kobe
// and Huarache side views (commons-kobe-ad-on-court-line-stanton, commons-nike-huarache-white-upper-stanton) and the
// Parker heels photo: a dark rubber outsole with herringbone showing at its edge; a white midsole thicker at the heel
// that sweeps up into the toe spring and wraps the toe as a bumper; a leather upper with a rounded toe box, a padded
// collar higher at the ankle than at the tongue, a moulded heel counter, a perforated toe cap, a foxing band and an
// eyestay, every panel edge stitched; six eyelets and laces crossing over the tongue, the loose ends hanging; a pull
// tab. The upper's outline is the true silhouette of its 3D cross-sections through the scene's camera, so the same
// shoe reads from above and from the side. Leather, midsole, sock and skin are gradient-lit, never flat faces.
// Crew socks with ribs, a rolled cuff and a soft top edge rise out of the collar; the shins are smooth projected
// cylinders (calf bulge on the heel side) that run up into the dark. Each shoe has a contact shadow and a blurred
// mirror copy in the satin floor.
import React from "react";
import { stepBackCamSpace as camSpace, stepBackPoly as poly, stepBackProject as proj, type StepBackBasis, type StepBackCam, type StepBackV3 } from "./StepBackWorld";

const LEN = 1.08; // 13 in, a size 14
const OUTSOLE = 0.03;

/** one shoe in world space: toe toward the basket (-x), turned by `a` radians; x, y is the toe */
export type StepBackShoe = { x: number; y: number; a: number; lift: number; heelUp: number; squash: number; lean: [number, number]; alpha: number };

const tab = (ts: number[], vs: number[], t: number) => {
  if (t <= ts[0]) return vs[0];
  for (let i = 0; i < ts.length - 1; i++) if (t <= ts[i + 1]) return vs[i] + ((vs[i + 1] - vs[i]) * (t - ts[i])) / (ts[i + 1] - ts[i]);
  return vs[vs.length - 1];
};
// half-width of the last, heel to toe
const WT = [0, 0.03, 0.08, 0.15, 0.24, 0.33, 0.42, 0.52, 0.62, 0.72, 0.8, 0.87, 0.93, 0.97, 1];
const WV = [0.085, 0.12, 0.135, 0.142, 0.145, 0.15, 0.162, 0.176, 0.186, 0.186, 0.178, 0.16, 0.128, 0.085, 0.03];
const wAt = (t: number) => tab(WT, WV, t);
// the toe springs up off the floor; the heel is bevelled
const spring = (t: number) => (t > 0.7 ? Math.pow((t - 0.7) / 0.3, 2) * 0.075 : 0) + (t < 0.05 ? ((0.05 - Math.max(0, t)) / 0.05) * 0.012 : 0);
// midsole top: thick under the heel, thinner under the forefoot, rising at the front as a toe bumper
const mtAt = (t: number) => tab([0, 0.25, 0.55, 0.8, 0.93, 1], [0.165, 0.152, 0.118, 0.102, 0.108, 0.13], t);
// the upper's top line: a mid-top collar high at the back, a dip, the tongue standing up, the lacing falling to the toe
const HT = [0, 0.04, 0.12, 0.2, 0.26, 0.31, 0.36, 0.45, 0.55, 0.65, 0.75, 0.84, 0.9];
const HV = [0.5, 0.53, 0.525, 0.49, 0.462, 0.51, 0.49, 0.435, 0.375, 0.315, 0.262, 0.226, 0.212];
const hAt = (t: number) => {
  const base = mtAt(t);
  if (t <= 0.9) return tab(HT, HV, t);
  const h0 = tab(HT, HV, 0.9) - mtAt(0.9);
  const u = Math.min(1, (t - 0.9) / 0.1);
  return base + h0 * Math.sqrt(Math.max(0, 1 - u * u * u));
};
const COLLAR = 0.29; // the collar opening runs from the heel to here
const vRim = (t: number) => (t < COLLAR ? 0.8 : t < COLLAR + 0.04 ? 0.8 + (0.2 * (t - COLLAR)) / 0.04 : 1);

type P2 = { x: number; y: number; z: number };
const pathOf = (pts: (P2 | null)[], close = true) => {
  let d = "";
  let n = 0;
  for (const p of pts) {
    if (!p) continue;
    d += `${n ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    n++;
  }
  return n > 1 ? d + (close ? "Z" : "") : "";
};
/** a smooth open curve through screen points (Catmull-Rom as cubic Béziers) */
const smoothOf = (pts: P2[], close = false) => {
  if (pts.length < 2) return "";
  const P = close ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  const n = close ? pts.length : pts.length - 1;
  for (let i = 1; i <= n; i++) {
    const p0 = P[i - 1], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2];
    d += `C${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)} ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d + (close ? "Z" : "");
};

function shoeGeo(cam: StepBackCam, B: StepBackBasis, s: StepBackShoe, m: number) {
  const dir: [number, number] = [-Math.cos(s.a), Math.sin(s.a)]; // heel -> toe
  const side: [number, number] = [Math.sin(s.a), Math.cos(s.a)];
  const heelX = s.x + LEN * Math.cos(s.a);
  const heelY = s.y - LEN * Math.sin(s.a);
  const zs = 1 - s.squash;
  const W3 = (t: number, b: number, z: number): StepBackV3 => [heelX + dir[0] * t * LEN + side[0] * b, heelY + dir[1] * t * LEN + side[1] * b, m * (z * zs + s.lift + s.heelUp * (1 - Math.max(0, Math.min(1, t))))];
  // the near side faces the camera
  const cx = heelX + dir[0] * 0.5 * LEN, cy = heelY + dir[1] * 0.5 * LEN;
  const sgn = side[0] * (B.e[0] - cx) + side[1] * (B.e[1] - cy) >= 0 ? 1 : -1;
  const P = (q: StepBackV3) => proj(cam, B, q);
  /** a point on the upper's surface: v 0 at the near bottom edge, 1 on top, on side `sd` */
  const S = (t: number, v: number, sd = sgn): StepBackV3 => {
    const phi = (v * Math.PI) / 2;
    const base = mtAt(t) + spring(t);
    const top = hAt(t) + spring(t);
    return W3(t, sd * wAt(t) * 0.97 * Math.cos(phi), base + (top - base) * Math.pow(Math.sin(phi), 0.8));
  };
  return { dir, side, W3, sgn, P, S };
}

/** everything a shoe draws, as screen paths */
function shoeDraw(cam: StepBackCam, B: StepBackBasis, s: StepBackShoe, m: number, legK: number, legTop: number) {
  const { dir, side, W3, sgn, P, S } = shoeGeo(cam, B, s, m);
  const up = m > 0 ? 1 : -1; // in the mirror the top is the bottom
  const ts: number[] = [];
  for (let i = 0; i <= 56; i++) {
    const u = i / 56;
    // denser toward the toe, where the toe box rounds off
    ts.push(Math.min(1, u < 0.8 ? (u / 0.8) * 0.72 : 0.72 + ((u - 0.8) / 0.2) * 0.28));
  }
  // ---- the upper's outline: the near bottom edge heel to toe, the true top silhouette toe to heel, the heel's back
  const bottom: P2[] = [];
  for (const t of ts) {
    const q = P(S(t, 0));
    if (q) bottom.push(q);
  }
  const topLine: P2[] = [];
  for (let i = ts.length - 1; i >= 0; i--) {
    const t = ts[i];
    const vr = vRim(t);
    let best: P2 | null = null;
    for (const sd of [sgn, -sgn]) {
      for (let k = 0; k <= 10; k++) {
        const v = (k / 10) * vr;
        const q = P(S(t, v, sd));
        if (q && (!best || q.y * up < best.y * up)) best = q;
      }
    }
    if (best) topLine.push(best);
  }
  const back: P2[] = [];
  {
    const base = mtAt(0) + spring(0);
    const top = hAt(0) + spring(0);
    for (let k = 0; k <= 10; k++) {
      const u = 1 - k / 10;
      const z = base + (top - base) * u;
      // the counter bulges back at a third of its height, the Achilles notch pulls in under the collar
      const tb = -0.038 * Math.sin(Math.PI * Math.min(1, (1 - u) * 1.15)) * (u < 0.85 ? 1 : (1 - u) / 0.15) + (u > 0.85 ? -0.01 * (u - 0.85) / 0.15 : 0);
      const q = P(W3(tb, 0, z));
      if (q) back.push(q);
    }
  }
  const outline = [...bottom, ...topLine, ...back];
  // ---- the collar opening: near rim and far rim
  const rimN: P2[] = [], rimF: P2[] = [];
  for (let k = 0; k <= 14; k++) {
    const t = (COLLAR + 0.02) * (k / 14);
    const a = P(S(t, vRim(t), sgn));
    const b = P(S(t, vRim(t), -sgn));
    if (a) rimN.push(a);
    if (b) rimF.push(b);
  }
  const opening = [...rimN, ...rimF.reverse()];
  // ---- midsole and outsole bands on the near side, with rounded ends
  const band = (z0: (t: number) => number, z1: (t: number) => number, grow: number) => {
    const lo: P2[] = [], hi: P2[] = [];
    for (const t of ts) {
      const b = sgn * (wAt(t) + grow);
      const a = P(W3(t, b, z0(t) + spring(t)));
      const c = P(W3(t, b, z1(t) + spring(t)));
      if (a) lo.push(a);
      if (c) hi.push(c);
    }
    const capF: P2[] = [], capB: P2[] = [];
    for (let k = 1; k < 6; k++) {
      const u = k / 6;
      const zf = z0(1) + (z1(1) - z0(1)) * u + spring(1);
      const zb = z0(0) + (z1(0) - z0(0)) * (1 - u) + spring(0);
      const f = P(W3(1 + 0.018 * Math.sin(Math.PI * u), sgn * wAt(1) * 0.6, zf));
      const b = P(W3(-0.016 * Math.sin(Math.PI * u), sgn * wAt(0) * 0.6, zb));
      if (f) capF.push(f);
      if (b) capB.push(b);
    }
    return { pts: [...lo, ...capF, ...hi.reverse(), ...capB], lo, hi: hi.reverse() };
  };
  const mid = band(() => OUTSOLE, mtAt, 0.012);
  const out = band(() => 0, () => OUTSOLE, 0.014);
  // herringbone at the outsole's edge: a zigzag of the tread blocks
  let herring = "";
  for (let row = 0; row < 2; row++) {
    const pts: P2[] = [];
    for (let k = 0; k <= 46; k++) {
      const t = 0.02 + (k / 46) * 0.96;
      const z = (k % 2 ? 0.024 : 0.007) - row * 0.0 + spring(t);
      const q = P(W3(t + row * 0.011, sgn * (wAt(t) + 0.0145), z));
      if (q) pts.push(q);
    }
    herring += pathOf(pts, false);
  }
  // ---- panels on the near side of the upper
  const surf = (list: [number, number][]) => list.map(([t, v]) => P(S(t, v)));
  const counter = surf([[0.27, 0], [0.24, 0.2], [0.19, 0.4], [0.13, 0.55], [0.07, 0.62], [0.02, 0.64], [0, 0.64], [0, 0]]);
  const counterEdge = surf([[0.27, 0], [0.24, 0.2], [0.19, 0.4], [0.13, 0.55], [0.07, 0.62], [0.02, 0.64], [0, 0.64]]);
  const counterStitch = surf([[0.24, 0.02], [0.215, 0.2], [0.17, 0.37], [0.115, 0.5], [0.06, 0.56], [0.0, 0.58]]);
  const toeCap = surf([[0.8, 0], [0.803, 0.3], [0.815, 0.6], [0.835, 0.85], [0.86, 1], [1, 1], [1, 0]]);
  const toeEdge = surf([[0.8, 0], [0.803, 0.3], [0.815, 0.6], [0.835, 0.85], [0.86, 1]]);
  const toeStitch = surf([[0.783, 0.02], [0.786, 0.3], [0.797, 0.6], [0.816, 0.85], [0.84, 0.99]]);
  const foxEdge = surf([[0.25, 0.19], [0.4, 0.2], [0.55, 0.19], [0.7, 0.18], [0.8, 0.17]]);
  const foxStitch = surf([[0.26, 0.16], [0.4, 0.17], [0.55, 0.16], [0.7, 0.15], [0.8, 0.145]]);
  const eyeEdge = surf([[0.31, 0.66], [0.42, 0.67], [0.55, 0.68], [0.68, 0.69], [0.79, 0.7]]);
  const eyeStitch = surf([[0.315, 0.7], [0.42, 0.71], [0.55, 0.72], [0.68, 0.73], [0.785, 0.735]]);
  const collarSeam = surf([[0.31, 0.6], [0.24, 0.66], [0.16, 0.7], [0.08, 0.72], [0.01, 0.72]]);
  const collarStitch = surf([[0.3, 0.57], [0.23, 0.63], [0.15, 0.67], [0.08, 0.69], [0.01, 0.69]]);
  const quarterSeam = surf([[0.3, 0.2], [0.315, 0.4], [0.32, 0.6]]);
  // perforations on the toe cap
  const perf: P2[] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    const q = P(S(0.855 + i * 0.03 + (j % 2) * 0.015, 0.4 + j * 0.13));
    if (q) perf.push(q);
  }
  // eyelets and laces: six pairs, crossing over the tongue
  const LT = [0.37, 0.437, 0.504, 0.571, 0.638, 0.705];
  const eyeN = LT.map((t) => P(S(t, 0.82, sgn)));
  const eyeF = LT.map((t) => P(S(t, 0.82, -sgn)));
  const crown = LT.map((t) => P(W3(t, 0, hAt(t) + spring(t) + 0.016)));
  const tongue = pathOf([...LT.map((t) => P(S(t, 0.8, sgn))), ...LT.slice().reverse().map((t) => P(S(t, 0.8, -sgn)))]);
  const laces: { d: string; over: boolean }[] = [];
  for (let i = 0; i < LT.length - 1; i++) {
    const segs: [P2 | null, P2 | null, P2 | null, boolean][] = [
      [eyeF[i], eyeN[i + 1], null, false],
      [eyeN[i], eyeF[i + 1], null, true],
    ];
    for (const [a, b, , over] of segs) {
      const c = crown[i] && crown[i + 1] ? { x: (crown[i]!.x + crown[i + 1]!.x) / 2, y: (crown[i]!.y + crown[i + 1]!.y) / 2 } : null;
      if (a && b && c) laces.push({ d: `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${(2 * c.x - (a.x + b.x) / 2).toFixed(1)} ${(2 * c.y - (a.y + b.y) / 2).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`, over });
    }
  }
  // the loose ends, tied at the top pair and hanging down the near side
  const ends: string[] = [];
  {
    const a = P(S(0.37, 0.86, sgn));
    for (const [t1, v1, sway] of [[0.45, 0.32, 0.0], [0.4, 0.42, 0.02]] as [number, number, number][]) {
      const b = P(S(t1 + sway, v1, sgn));
      const c = P(S(0.36 + sway, 0.55, sgn));
      if (a && b && c) ends.push(`M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
    }
  }
  // pull tab at the back of the collar
  const top0 = hAt(0) + spring(0);
  const tabP = pathOf([P(W3(0.0, 0.036, top0 - 0.07)), P(W3(-0.022, 0.03, top0 + 0.012)), P(W3(-0.022, -0.03, top0 + 0.012)), P(W3(0.0, -0.036, top0 - 0.07))]);
  // highlights: the toe box and the quarter catch the arena light
  const hiToe = P(S(0.9, 0.72));
  const hiQ = P(S(0.56, 0.5));
  const hiHeel = P(S(0.08, 0.35));

  // ---- sock and shin: smooth projected cylinders (ellipse sections; the calf bulges on the heel side)
  const ankle = W3(0.2, 0, 0);
  const az = ankle[2] * m; // where the foot is in z
  const ringAt = (z: number, rf: number, rb: number, rs: number) => {
    const c: [number, number] = [ankle[0] + s.lean[0] * (z - 0.4), ankle[1] + s.lean[1] * (z - 0.4)];
    const pts: { p: P2; near: boolean; w: StepBackV3 }[] = [];
    const cz = camSpace(B, [c[0], c[1], m * (z * (1 - s.squash * 0.5) + az)])[2];
    for (let k = 0; k < 28; k++) {
      const th = (k / 28) * Math.PI * 2;
      const ct = Math.cos(th);
      const r = ct > 0 ? rf : rb;
      const w: StepBackV3 = [c[0] + ct * r * dir[0] + Math.sin(th) * rs * side[0], c[1] + ct * r * dir[1] + Math.sin(th) * rs * side[1], m * (z * (1 - s.squash * 0.5) + az)];
      const q = P(w);
      if (q) pts.push({ p: q, near: q.z < cz, w });
    }
    return pts;
  };
  const LZ = [0.42, 0.55, 0.68, 0.82, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.45, 2.7];
  const RF = [0.106, 0.102, 0.104, 0.108, 0.115, 0.122, 0.128, 0.13, 0.128, 0.124, 0.12, 0.122, 0.128];
  const RB = [0.118, 0.11, 0.106, 0.11, 0.122, 0.152, 0.18, 0.193, 0.19, 0.175, 0.155, 0.148, 0.15];
  const SOCKTOP = 0.86;
  const legTopZ = 0.9 + (legTop - 0.9) * legK;
  const sil = (z0: number, z1: number, grow: (z: number) => number, n: number) => {
    const L: P2[] = [], R: P2[] = [];
    for (let i = 0; i <= n; i++) {
      const z = z0 + ((z1 - z0) * i) / n;
      const g = grow(z);
      const ring = ringAt(z, tab(LZ, RF, z) + g, tab(LZ, RB, z) + g, (tab(LZ, RF, z) + tab(LZ, RB, z)) * 0.47 + g);
      if (ring.length < 3) continue;
      let l = ring[0].p, r = ring[0].p;
      for (const q of ring) {
        if (q.p.x < l.x) l = q.p;
        if (q.p.x > r.x) r = q.p;
      }
      L.push(l);
      R.push(r);
    }
    return { L, R };
  };
  let leg: { d: string; x0: number; x1: number; yTop: number } | null = null;
  let sock: { d: string; x0: number; x1: number; cuff: string; cuffShadow: string; ribs: string; folds: string } | null = null;
  if (m > 0 && legK > 0.01) {
    const g = sil(SOCKTOP - 0.1, legTopZ, () => 0, 16);
    if (g.L.length > 2) {
      const mz = Math.floor(g.L.length * 0.3);
      leg = { d: smoothOf([...g.L, ...g.R.slice().reverse()], true), x0: g.L[mz].x, x1: g.R[mz].x, yTop: g.L[g.L.length - 1].y };
    }
  }
  {
    // a crew sock: a touch wider than the leg, bunched over the ankle bone, its rolled cuff at the top
    const bunch = (z: number) => 0.014 + (z > 0.55 && z < 0.74 ? 0.012 * Math.sin(((z - 0.55) / 0.19) * Math.PI) : 0) + (z > SOCKTOP - 0.06 ? 0.006 : 0);
    const zBase = Math.max(0.42, mtAt(0.2) + 0.12);
    const zTop = m > 0 ? SOCKTOP * Math.min(1, 0.6 + legK) + 0.4 * (1 - Math.min(1, 0.6 + legK)) : SOCKTOP;
    const g = sil(zBase, zTop, bunch, 10);
    const topRing = ringAt(zTop, tab(LZ, RF, zTop) + bunch(zTop), tab(LZ, RB, zTop) + bunch(zTop), (tab(LZ, RF, zTop) + tab(LZ, RB, zTop)) * 0.47 + bunch(zTop));
    const nearArc = topRing.filter((q) => q.near).map((q) => q.p).sort((a, b) => a.x - b.x);
    if (g.L.length > 2) {
      const outlinePts = [...g.L, ...nearArc, ...g.R.slice().reverse()];
      // ribs: vertical lines on the near half, foreshortened by the cylinder
      let ribs = "";
      for (let k = 0; k < 40; k++) {
        const th = (k / 40) * Math.PI * 2;
        const seg: P2[] = [];
        for (const z of [zBase + 0.03, (zBase + zTop) / 2, zTop - 0.05]) {
          const ct = Math.cos(th);
          const rf = tab(LZ, RF, z) + bunch(z), rb = tab(LZ, RB, z) + bunch(z);
          const r = ct > 0 ? rf : rb;
          const rs = (tab(LZ, RF, z) + tab(LZ, RB, z)) * 0.47 + bunch(z);
          const c: [number, number] = [ankle[0] + s.lean[0] * (z - 0.4), ankle[1] + s.lean[1] * (z - 0.4)];
          const w: StepBackV3 = [c[0] + ct * r * dir[0] + Math.sin(th) * rs * side[0], c[1] + ct * r * dir[1] + Math.sin(th) * rs * side[1], m * (z * (1 - s.squash * 0.5) + az)];
          const nx = ct * dir[0] + Math.sin(th) * side[0], ny = ct * dir[1] + Math.sin(th) * side[1];
          if (nx * (B.e[0] - w[0]) + ny * (B.e[1] - w[1]) <= 0.02) continue;
          const q = P(w);
          if (q) seg.push(q);
        }
        if (seg.length > 1) ribs += pathOf(seg, false);
      }
      // the cuff's seam and the bunching folds over the ankle
      const ringNear = (z: number) => {
        const r = ringAt(z, tab(LZ, RF, z) + bunch(z), tab(LZ, RB, z) + bunch(z), (tab(LZ, RF, z) + tab(LZ, RB, z)) * 0.47 + bunch(z));
        return r.filter((q) => q.near).map((q) => q.p).sort((a, b) => a.x - b.x);
      };
      const cuffSeam = ringNear(zTop - 0.07);
      const f1 = ringNear(0.6);
      const f2 = ringNear(0.67);
      const mz = Math.floor(g.L.length * 0.6);
      sock = {
        d: smoothOf(outlinePts, true),
        x0: g.L[mz].x,
        x1: g.R[mz].x,
        cuff: nearArc.length > 1 ? smoothOf(nearArc) + (cuffSeam.length > 1 ? smoothOf(cuffSeam) : "") : "",
        cuffShadow: nearArc.length > 1 ? smoothOf(nearArc.map((q) => ({ ...q, y: q.y - 4 }))) : "",
        ribs,
        folds: (f1.length > 2 ? smoothOf(f1.slice(1, -1)) : "") + (f2.length > 2 ? smoothOf(f2.slice(2, -2)) : ""),
      };
    }
  }
  // screen extents for the gradients
  const ys = outline.map((q) => q.y);
  const xs = outline.map((q) => q.x);
  const box = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  const toeX = P(S(1, 0.4))?.x ?? box.x0;
  const heelX = P(S(0, 0.4))?.x ?? box.x1;
  const depth = camSpace(B, W3(0.5, 0, 0.2))[2];
  const ppf = cam.F / Math.max(0.5, depth);
  return {
    outline: smoothOf(outline, true), opening: smoothOf(opening, true), rimN: smoothOf(rimN), mid: smoothOf(mid.pts, true), midTop: smoothOf(mid.hi), out: pathOf(out.pts), herring,
    counter: pathOf(counter), counterEdge: smoothOf(counterEdge.filter(Boolean) as P2[]), counterStitch: smoothOf(counterStitch.filter(Boolean) as P2[]),
    toeCap: pathOf(toeCap), toeEdge: smoothOf(toeEdge.filter(Boolean) as P2[]), toeStitch: smoothOf(toeStitch.filter(Boolean) as P2[]),
    foxEdge: smoothOf(foxEdge.filter(Boolean) as P2[]), foxStitch: smoothOf(foxStitch.filter(Boolean) as P2[]),
    eyeEdge: smoothOf(eyeEdge.filter(Boolean) as P2[]), eyeStitch: smoothOf(eyeStitch.filter(Boolean) as P2[]),
    collarSeam: smoothOf(collarSeam.filter(Boolean) as P2[]), collarStitch: smoothOf(collarStitch.filter(Boolean) as P2[]), quarterSeam: smoothOf(quarterSeam.filter(Boolean) as P2[]),
    perf, eyeN, tongue, laces, ends, tabP, hiToe, hiQ, hiHeel, leg, sock, box, toeX, heelX, ppf,
    midBox: { y0: Math.min(...mid.pts.map((q) => q.y)), y1: Math.max(...mid.pts.map((q) => q.y)) },
  };
}

export const StepBackShoes: React.FC<{
  cam: StepBackCam;
  B: StepBackBasis;
  shoes: StepBackShoe[];
  legK: number; // 0 from above .. 1 at shoe height
  legTop: number; // ft: where the shin runs out of the picture
  reflect: number; // opacity of the floor's mirror copy
}> = ({ cam, B, shoes, legK, legTop, reflect }) => {
  // the farther shoe is painted first
  const order = shoes.map((_, i) => i).sort((p, q) => camSpace(B, [shoes[q].x, shoes[q].y, 0])[2] - camSpace(B, [shoes[p].x, shoes[p].y, 0])[2]);

  const mirrorOf = (si: number) => {
    const s = shoes[si];
    if (s.alpha <= 0.001) return null;
    const g = shoeDraw(cam, B, s, -1, legK, legTop);
    return (
      <g key={`m${si}`} opacity={s.alpha}>
        {g.sock && <path d={g.sock.d} fill="#E8EAED" />}
        <path d={g.outline} fill="#E9EBEE" />
        <path d={g.mid} fill="#F4F4F2" />
        <path d={g.out} fill="#45484F" />
      </g>
    );
  };

  const shoeOf = (si: number) => {
    const s = shoes[si];
    if (s.alpha <= 0.001) return null;
    const g = shoeDraw(cam, B, s, 1, legK, legTop);
    const id = `sbs${si}`;
    const k = g.ppf; // px per ft here
    const lw = (ft: number, min = 0.7) => Math.max(min, ft * k);
    const seam = "rgba(128,134,143,0.85)";
    const stitch = "rgba(112,118,128,0.75)";
    const dash = `${(0.018 * k).toFixed(1)} ${(0.014 * k).toFixed(1)}`;
    return (
      <g key={`s${si}`} opacity={s.alpha}>
        <defs>
          <linearGradient id={`${id}-up`} gradientUnits="userSpaceOnUse" x1={0} y1={g.box.y0} x2={0} y2={g.midBox.y0 + 2}>
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.35" stopColor="#F4F5F7" />
            <stop offset="0.78" stopColor="#E9ECEF" />
            <stop offset="1" stopColor="#D0D5DA" />
          </linearGradient>
          <linearGradient id={`${id}-side`} gradientUnits="userSpaceOnUse" x1={g.toeX} y1={0} x2={g.heelX} y2={0}>
            <stop offset="0" stopColor="#1B2129" stopOpacity={0.16} />
            <stop offset="0.3" stopColor="#1B2129" stopOpacity={0} />
            <stop offset="0.8" stopColor="#FFFFFF" stopOpacity={0} />
            <stop offset="1" stopColor="#1B2129" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id={`${id}-ctr`} gradientUnits="userSpaceOnUse" x1={0} y1={g.box.y0} x2={0} y2={g.midBox.y0}>
            <stop offset="0" stopColor="#F1F3F5" />
            <stop offset="0.5" stopColor="#E3E6EA" />
            <stop offset="1" stopColor="#C9CED5" />
          </linearGradient>
          <linearGradient id={`${id}-mid`} gradientUnits="userSpaceOnUse" x1={0} y1={g.midBox.y0} x2={0} y2={g.midBox.y1}>
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.45" stopColor="#F5F5F3" />
            <stop offset="1" stopColor="#CFD0CD" />
          </linearGradient>
          <linearGradient id={`${id}-lin`} gradientUnits="userSpaceOnUse" x1={0} y1={g.box.y0} x2={0} y2={g.box.y0 + 0.08 * k}>
            <stop offset="0" stopColor="#3A404A" />
            <stop offset="1" stopColor="#14181E" />
          </linearGradient>
          {g.sock && (
            <linearGradient id={`${id}-sock`} gradientUnits="userSpaceOnUse" x1={g.sock.x0} y1={0} x2={g.sock.x1} y2={0}>
              <stop offset="0" stopColor="#AEB4BC" />
              <stop offset="0.18" stopColor="#DDE1E5" />
              <stop offset="0.5" stopColor="#FAFBFC" />
              <stop offset="0.78" stopColor="#ECEEF1" />
              <stop offset="1" stopColor="#B9BFC7" />
            </linearGradient>
          )}
          {g.leg && (
            <>
              <linearGradient id={`${id}-skin`} gradientUnits="userSpaceOnUse" x1={g.leg.x0} y1={0} x2={g.leg.x1} y2={0}>
                <stop offset="0" stopColor="#24150D" />
                <stop offset="0.2" stopColor="#4B2F20" />
                <stop offset="0.5" stopColor="#6A4632" />
                <stop offset="0.7" stopColor="#80583F" />
                <stop offset="0.88" stopColor="#5A3A29" />
                <stop offset="1" stopColor="#2E1B11" />
              </linearGradient>
              <linearGradient id={`${id}-dark`} gradientUnits="userSpaceOnUse" x1={0} y1={545} x2={0} y2={800}>
                <stop offset="0" stopColor="#0D1117" stopOpacity={1} />
                <stop offset="0.45" stopColor="#0D1117" stopOpacity={0.7} />
                <stop offset="1" stopColor="#0D1117" stopOpacity={0} />
              </linearGradient>
            </>
          )}
          <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={Math.max(1.2, 0.02 * k)} />
          </filter>
          <clipPath id={`${id}-clip`}>
            <path d={g.outline} />
          </clipPath>
        </defs>
        {/* the collar's lining, behind the sock */}
        <path d={g.opening} fill={`url(#${id}-lin)`} />
        {/* the shin, running up into the dark */}
        {g.leg && (
          <g>
            <path d={g.leg.d} fill={`url(#${id}-skin)`} />
            <path d={g.leg.d} fill={`url(#${id}-dark)`} />
          </g>
        )}
        {/* the crew sock */}
        {g.sock && (
          <g>
            {g.sock.cuffShadow && legK > 0.05 && <path d={g.sock.cuffShadow} stroke="#120A05" strokeOpacity={0.45} strokeWidth={lw(0.025, 2)} fill="none" filter={`url(#${id}-soft)`} />}
            <path d={g.sock.d} fill={`url(#${id}-sock)`} />
            <path d={g.sock.ribs} stroke="#7C848F" strokeOpacity={0.22} strokeWidth={lw(0.006, 0.8)} fill="none" strokeLinecap="round" />
            <path d={g.sock.folds} stroke="#5E6670" strokeOpacity={0.18} strokeWidth={lw(0.014, 1.2)} fill="none" filter={`url(#${id}-soft)`} />
            {g.sock.cuff && <path d={g.sock.cuff} stroke="#FFFFFF" strokeOpacity={0.9} strokeWidth={lw(0.012, 1)} fill="none" strokeLinecap="round" />}
          </g>
        )}
        {/* the leather upper, its collar open over the sock */}
        <path d={g.outline + g.opening} fill={`url(#${id}-up)`} fillRule="evenodd" />
        <g clipPath={`url(#${id}-clip)`}>
          <path d={g.counter} fill={`url(#${id}-ctr)`} />
          <path d={g.toeCap} fill="#FFFFFF" opacity={0.35} />
          <path d={g.outline} fill={`url(#${id}-side)`} />
          {/* the light on the leather */}
          {g.hiToe && <ellipse cx={g.hiToe.x} cy={g.hiToe.y} rx={0.1 * k} ry={0.035 * k} fill="#FFFFFF" opacity={0.85} filter={`url(#${id}-soft)`} />}
          {g.hiQ && <ellipse cx={g.hiQ.x} cy={g.hiQ.y} rx={0.16 * k} ry={0.05 * k} fill="#FFFFFF" opacity={0.6} filter={`url(#${id}-soft)`} />}
          {g.hiHeel && <ellipse cx={g.hiHeel.x} cy={g.hiHeel.y} rx={0.05 * k} ry={0.09 * k} fill="#FFFFFF" opacity={0.55} filter={`url(#${id}-soft)`} />}
          {/* panel edges and their stitching */}
          <path d={g.counterEdge} stroke={seam} strokeWidth={lw(0.006, 1)} fill="none" />
          <path d={g.counterStitch} stroke={stitch} strokeWidth={lw(0.004, 0.8)} strokeDasharray={dash} fill="none" />
          <path d={g.toeEdge} stroke={seam} strokeWidth={lw(0.006, 1)} fill="none" />
          <path d={g.toeStitch} stroke={stitch} strokeWidth={lw(0.004, 0.8)} strokeDasharray={dash} fill="none" />
          <path d={g.foxEdge} stroke={seam} strokeWidth={lw(0.005, 0.9)} fill="none" />
          <path d={g.foxStitch} stroke={stitch} strokeWidth={lw(0.004, 0.8)} strokeDasharray={dash} fill="none" />
          <path d={g.eyeEdge} stroke={seam} strokeWidth={lw(0.005, 0.9)} fill="none" />
          <path d={g.eyeStitch} stroke={stitch} strokeWidth={lw(0.004, 0.8)} strokeDasharray={dash} fill="none" />
          <path d={g.collarSeam} stroke={seam} strokeWidth={lw(0.005, 0.9)} fill="none" />
          <path d={g.collarStitch} stroke={stitch} strokeWidth={lw(0.004, 0.8)} strokeDasharray={dash} fill="none" />
          <path d={g.quarterSeam} stroke={seam} strokeWidth={lw(0.004, 0.8)} fill="none" opacity={0.6} />
          {g.perf.map((q, i) => (
            <circle key={i} cx={q.x} cy={q.y} r={Math.max(0.6, 0.0048 * k)} fill="#8A919A" opacity={0.5} />
          ))}
          {/* the tongue between the eyestays */}
          <path d={g.tongue} fill="#E4E7EA" />
          {/* the collar's padding rolls over the near rim */}
          <path d={g.rimN} stroke="#FFFFFF" strokeWidth={lw(0.03, 2)} fill="none" opacity={0.9} strokeLinecap="round" />
          <path d={g.rimN} stroke="#9AA1AA" strokeWidth={lw(0.008, 1)} fill="none" opacity={0.7} strokeLinecap="round" transform="translate(0 2)" />
        </g>
        {/* eyelets, laces crossing over the tongue, the loose ends */}
        {g.eyeN.map((q, i) => (q ? <ellipse key={`e${i}`} cx={q.x} cy={q.y} rx={Math.max(1.2, 0.013 * k)} ry={Math.max(0.9, 0.009 * k)} fill="#4A5059" stroke="#C3C8CE" strokeWidth={0.8} /> : null))}
        {g.laces.filter((l) => !l.over).map((l, i) => (
          <path key={`lu${i}`} d={l.d} stroke="#C9CDD2" strokeWidth={lw(0.02, 1.4)} fill="none" strokeLinecap="round" />
        ))}
        {g.laces.filter((l) => l.over).map((l, i) => (
          <g key={`lo${i}`}>
            <path d={l.d} stroke="#8D949D" strokeWidth={lw(0.026, 2)} fill="none" strokeLinecap="round" />
            <path d={l.d} stroke="#FDFDFD" strokeWidth={lw(0.018, 1.3)} fill="none" strokeLinecap="round" />
          </g>
        ))}
        {g.ends.map((d, i) => (
          <g key={`le${i}`}>
            <path d={d} stroke="#8D949D" strokeWidth={lw(0.024, 1.8)} fill="none" strokeLinecap="round" />
            <path d={d} stroke="#FAFAFA" strokeWidth={lw(0.016, 1.2)} fill="none" strokeLinecap="round" />
          </g>
        ))}
        {g.tabP && <path d={g.tabP} fill="#EEF0F2" stroke="#AEB4BC" strokeWidth={lw(0.004, 0.8)} />}
        {/* midsole: the upper's shadow along its top, a moulded groove, its light edge */}
        <path d={g.mid} fill={`url(#${id}-mid)`} />
        <path d={g.midTop} stroke="#5D636C" strokeOpacity={0.35} strokeWidth={lw(0.008, 1)} fill="none" />
        {/* outsole: dark rubber, herringbone at its edge */}
        <path d={g.out} fill="#40434A" />
        <path d={g.herring} stroke="#1E2024" strokeWidth={lw(0.0045, 0.7)} fill="none" opacity={0.9} />
      </g>
    );
  };

  // contact shadows: tight and dark under a planted shoe, opening and fading as it lifts
  const shadows = shoes.map((s, si) => {
    const h = s.lift + s.heelUp * 0.5;
    const pts: StepBackV3[] = [];
    for (let k = 0; k < 24; k++) {
      const ang = (k / 24) * Math.PI * 2;
      const cx = s.x + 0.54 * Math.cos(s.a);
      const cy = s.y - 0.54 * Math.sin(s.a);
      pts.push([cx + Math.cos(ang) * (0.6 + h * 0.4) * Math.cos(s.a) - Math.sin(ang) * (0.18 + h * 0.25) * Math.sin(s.a), cy + Math.sin(ang) * (0.18 + h * 0.25) * Math.cos(s.a) + Math.cos(ang) * (0.6 + h * 0.4) * Math.sin(-s.a), 0.003]);
    }
    const d = poly(cam, B, pts, false);
    const near = camSpace(B, [s.x, s.y, 0])[2];
    return d ? (
      <path key={`sh${si}`} d={d} fill="#1A0E04" opacity={s.alpha * Math.max(0.06, 0.6 - h * 0.9)} style={{ filter: `blur(${Math.max(2, (cam.F / Math.max(1, near)) * (0.03 + h * 0.12)).toFixed(1)}px)` }} />
    ) : null;
  });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <filter id="sb-refl">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>
      {reflect > 0.01 && <g filter="url(#sb-refl)" opacity={reflect}>{order.map(mirrorOf)}</g>}
      {shadows}
      {order.map(shoeOf)}
    </svg>
  );
};
