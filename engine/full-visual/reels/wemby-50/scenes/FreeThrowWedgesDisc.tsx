// The reel's chance: a flat gold disc lying on the boards, 1.6 ft across and 0.12 of that thick, with a thin darker
// rim, a soft contact shadow, and light from the roof on its top. Here it is also cut: a wedge is the same solid
// between two angles, so its two cut faces show the disc's thickness, lit by how they face the light.
import React from "react";
import { interpolateColors } from "remotion";
import {
  freeThrowWedgesArc as arc,
  freeThrowWedgesEye,
  freeThrowWedgesPoly as poly,
  freeThrowWedgesProject as proj,
  type FreeThrowWedgesCam,
  type FreeThrowWedgesV3,
} from "./FreeThrowWedgesWorld";

export const FTW_R = 0.8;
export const FTW_H = 0.19;
const LIGHT: FreeThrowWedgesV3 = (() => {
  const v: FreeThrowWedgesV3 = [-0.35, 0.5, 0.79];
  const l = Math.hypot(...v);
  return [v[0] / l, v[1] / l, v[2] / l];
})();

export type FreeThrowWedgesPiece = {
  x: number;
  y: number;
  z: number; // lift off the floor, ft
  a0: number; // radians, from +x toward +y
  a1: number;
  o: number;
  tilt?: number; // a falling sliver tips: rotation about its own radial axis, radians
  shadow?: number;
};

const shade = (n: FreeThrowWedgesV3, dark: string, lit: string) => {
  const k = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
  return interpolateColors(k, [0, 1], [dark, lit]);
};

export const FreeThrowWedgesDisc: React.FC<{ cam: FreeThrowWedgesCam; p: FreeThrowWedgesPiece; id: string; glow?: number }> = ({ cam, p, id, glow = 0 }) => {
  if (p.o <= 0) return null;
  const full = p.a1 - p.a0 >= Math.PI * 2 - 1e-3;
  const n = Math.max(8, Math.ceil(((p.a1 - p.a0) / (Math.PI * 2)) * 72));
  const tilt = p.tilt ?? 0;
  // a point of the solid: local radius r at angle a, height h; tilt rotates the piece about its mid-radial axis
  const mid = (p.a0 + p.a1) / 2;
  const P = (r: number, a: number, h: number): FreeThrowWedgesV3 => {
    let lx = r * Math.cos(a);
    let ly = r * Math.sin(a);
    let lz = h;
    if (tilt) {
      // axis = (cos mid, sin mid, 0); rotate (lx,ly,lz) about it
      const ax = Math.cos(mid);
      const ay = Math.sin(mid);
      const along = lx * ax + ly * ay;
      const px = lx - along * ax;
      const py = ly - along * ay;
      const c = Math.cos(tilt);
      const s = Math.sin(tilt);
      // perpendicular part rotates in the plane (perp, z)
      const pl = px * -ay + py * ax; // signed perp length
      const nl = pl * c - lz * s;
      lz = pl * s + lz * c;
      lx = along * ax + nl * -ay;
      ly = along * ay + nl * ax;
    }
    return [p.x + lx, p.y + ly, p.z + lz];
  };
  const angles = Array.from({ length: n + 1 }, (_, i) => p.a0 + ((p.a1 - p.a0) * i) / n);
  const topPts = angles.map((a) => P(FTW_R, a, FTW_H));
  const botPts = angles.map((a) => P(FTW_R, a, 0));
  const c0t = P(0, 0, FTW_H);
  const c0b = P(0, 0, 0);
  const eye = freeThrowWedgesEye(cam);
  type Face = { d: string; fill: string; depth: number };
  const faces: Face[] = [];
  const addFace = (pts: FreeThrowWedgesV3[], nrm0: FreeThrowWedgesV3, dark: string, lit: string) => {
    const c = pts.reduce((s, q) => [s[0] + q[0] / pts.length, s[1] + q[1] / pts.length, s[2] + q[2] / pts.length], [0, 0, 0]);
    let nrm = nrm0;
    // every face normal points away from the inside of the solid
    const inside = full ? P(0, 0, FTW_H / 2) : P(FTW_R * 0.45, mid, FTW_H / 2);
    if (nrm[0] * (c[0] - inside[0]) + nrm[1] * (c[1] - inside[1]) + nrm[2] * (c[2] - inside[2]) < 0) nrm = [-nrm[0], -nrm[1], -nrm[2]];
    const toEye = [eye[0] - c[0], eye[1] - c[1], eye[2] - c[2]];
    if (nrm[0] * toEye[0] + nrm[1] * toEye[1] + nrm[2] * toEye[2] <= 0) return;
    const d = poly(cam, pts);
    if (!d) return;
    faces.push({ d, fill: shade(nrm, dark, lit), depth: Math.hypot(...toEye) });
  };
  const nrmOf = (a: FreeThrowWedgesV3, b: FreeThrowWedgesV3, c: FreeThrowWedgesV3): FreeThrowWedgesV3 => {
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const nx = u[1] * v[2] - u[2] * v[1];
    const ny = u[2] * v[0] - u[0] * v[2];
    const nz = u[0] * v[1] - u[1] * v[0];
    const l = Math.hypot(nx, ny, nz) || 1;
    return [nx / l, ny / l, nz / l];
  };
  // outer edge
  for (let i = 0; i < n; i++) {
    const q = [botPts[i], botPts[i + 1], topPts[i + 1], topPts[i]];
    const am = (angles[i] + angles[i + 1]) / 2;
    const c = P(FTW_R, am, FTW_H / 2);
    const o = P(0, am, FTW_H / 2);
    const nm = [c[0] - o[0], c[1] - o[1], c[2] - o[2]];
    const l = Math.hypot(nm[0], nm[1], nm[2]) || 1;
    addFace(q, [nm[0] / l, nm[1] / l, nm[2] / l], "#6E4A0E", "#D89A2C");
  }
  // the two cut faces: the inside of the disc, a little paler than its edge
  if (!full) {
    const f0 = [c0b, botPts[0], topPts[0], c0t];
    const f1 = [botPts[n], c0b, c0t, topPts[n]];
    addFace(f0, nrmOf(f0[0], f0[1], f0[2]), "#7A5512", "#EDB650");
    addFace(f1, nrmOf(f1[0], f1[1], f1[2]), "#7A5512", "#EDB650");
  }
  faces.sort((a, b) => b.depth - a.depth);
  const top = poly(cam, full ? topPts : [c0t, ...topPts]);
  const topN = nrmOf(c0t, topPts[0], topPts[Math.max(1, Math.floor(n / 4))]);
  const topUp = topN[2] < 0 ? (topN.map((v) => -v) as FreeThrowWedgesV3) : topN;
  const topLit = shade(topUp, "#9C6A14", "#F7C350");
  // contact shadow on the boards, under the piece, softer as it lifts
  const sh = p.shadow ?? 1;
  const shadow = poly(cam, full ? arc(p.x + 0.05, p.y + 0.08, FTW_R * 1.08, 0, Math.PI * 2, 48) : [[p.x + 0.05, p.y + 0.08, 0], ...arc(p.x + 0.05, p.y + 0.08, FTW_R * 1.08, p.a0, p.a1, n)]);
  const cp = proj(cam, p.x, p.y, p.z + FTW_H);
  const sc = cp.ok ? cam.F / cp.z : 0;
  return (
    <g opacity={p.o}>
      <defs>
        <linearGradient id={`${id}-top`} gradientUnits="userSpaceOnUse" x1={cp.x - sc * 0.8} y1={cp.y - sc * 0.6} x2={cp.x + sc * 0.8} y2={cp.y + sc * 0.6}>
          <stop offset="0" stopColor="#FFE3A0" stopOpacity="0.55" />
          <stop offset="0.45" stopColor={topLit} stopOpacity="0" />
          <stop offset="1" stopColor="#8A5A10" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      {shadow && sh > 0 && <path d={shadow} fill="#2A1504" opacity={0.5 * sh * Math.max(0, 1 - p.z / 3)} style={{ filter: `blur(${(3 + p.z * 10 + sc * 0.04).toFixed(1)}px)` }} />}
      {faces.map((fc, i) => (
        <path key={i} d={fc.d} fill={fc.fill} stroke={fc.fill} strokeWidth={0.6} strokeLinejoin="round" />
      ))}
      {top && (
        <>
          <path d={top} fill={topLit} />
          <path d={top} fill={`url(#${id}-top)`} />
          <path d={top} fill="none" stroke="#B57F1C" strokeWidth={Math.max(1, sc * 0.018)} strokeLinejoin="round" />
          {glow > 0 && <path d={top} fill="#FFF4D6" opacity={0.35 * glow} />}
        </>
      )}
    </g>
  );
};
