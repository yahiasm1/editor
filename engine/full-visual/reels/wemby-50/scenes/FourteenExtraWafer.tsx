// His extra points as a solid: the white band that sat between the league's 57.5 % and his 79 % inside a chance,
// lifted out of the disc as a thin white wafer (a whole disc, or a 0.44 wedge for a free throw). The same solid, made
// taller, is the stack the wafers pile into: `seams` draws the line at every whole point up its side.
import React from "react";
import { FX_R } from "./FourteenExtraWorld";
import type { FourteenExtraMap } from "./FourteenExtraDisc";

const area = (p: [number, number][]) => {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return s / 2;
};
const path = (p: [number, number][]) => p.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join("") + "Z";

export const FourteenExtraWafer: React.FC<{
  map: FourteenExtraMap;
  a0?: number;
  a1?: number;
  th: number; // thickness in feet
  o?: number;
  seams?: number[]; // heights (ft) of the lines between points
  glow?: number;
  detail?: number;
}> = ({ map, a0 = 0, a1 = Math.PI * 2, th, o = 1, seams, glow = 0, detail = 1 }) => {
  if (o <= 0.001 || th <= 0.0005 || a1 - a0 < 0.01) return null;
  const span = a1 - a0;
  const full = span >= Math.PI * 2 - 1e-3;
  const n = Math.max(6, Math.ceil((span / (Math.PI * 2)) * 64 * detail));
  const ang = Array.from({ length: n + 1 }, (_, i) => a0 + (span * i) / n);
  const P = (r: number, a: number, w: number) => map(r * Math.cos(a), r * Math.sin(a), w);
  const topRing = ang.map((a) => P(FX_R, a, th));
  const topPoly = full ? topRing.slice(0, n) : [P(0, 0, th), ...topRing];
  const sTop = Math.sign(area(topPoly)) || 1;
  const vis = (q: [number, number][]) => Math.abs(area(q)) > 0.01 && Math.sign(area(q)) === sTop;
  let minx = Infinity;
  let maxx = -Infinity;
  for (const q of topRing) {
    minx = Math.min(minx, q[0]);
    maxx = Math.max(maxx, q[0]);
  }
  const W = Math.max(1, maxx - minx);
  const sw = Math.max(0.5, W * 0.01);

  const nodes: React.ReactNode[] = [];
  if (!full) {
    const cuts: [number, number][][] = [
      [P(0, 0, 0), P(FX_R, a0, 0), P(FX_R, a0, th), P(0, 0, th)],
      [P(FX_R, a1, 0), P(0, 0, 0), P(0, 0, th), P(FX_R, a1, th)],
    ];
    cuts.forEach((q, i) => {
      if (vis(q)) nodes.push(<path key={`c${i}`} d={path(q)} fill="#E4DCCA" stroke="#E4DCCA" strokeWidth={sw} strokeLinejoin="round" />);
    });
  }
  const visIdx: number[] = [];
  for (let i = 0; i < n; i++) {
    const q: [number, number][] = [P(FX_R, ang[i], 0), P(FX_R, ang[i + 1], 0), topRing[i + 1], topRing[i]];
    if (!vis(q)) continue;
    visIdx.push(i);
    const mx = (q[0][0] + q[1][0]) / 2;
    const k = Math.max(0, Math.min(1, 1 - (mx - minx) / W));
    const lit = 0.2 + 0.8 * Math.pow(k, 0.8);
    const c = `hsl(40, ${(14 + 14 * lit).toFixed(1)}%, ${(62 + 33 * lit).toFixed(1)}%)`;
    nodes.push(<path key={`s${i}`} d={path(q)} fill={c} stroke={c} strokeWidth={sw} strokeLinejoin="round" />);
  }
  // the line between every whole point, along the visible side
  const seamNodes: React.ReactNode[] = [];
  if (seams && visIdx.length) {
    seams.forEach((h, j) => {
      if (h <= 0.002 || h >= th - 0.002) return;
      let d = "";
      let prev = -2;
      for (const i of visIdx) {
        const a = P(FX_R, ang[i], h);
        const b = P(FX_R, ang[i + 1], h);
        d += i === prev + 1 ? `L${b[0].toFixed(1)} ${b[1].toFixed(1)}` : `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
        prev = i;
      }
      seamNodes.push(<path key={`m${j}`} d={d} fill="none" stroke="#8F8676" strokeOpacity={0.75} strokeWidth={Math.max(1, W * 0.006)} />);
    });
  }
  const topD = path(topPoly);
  const inner = full ? ang.slice(0, n).map((a) => P(FX_R * 0.9, a, th)) : null;
  return (
    <g opacity={o}>
      {nodes}
      {seamNodes}
      <path d={topD} fill="#FBF7EE" stroke="#D8CFBD" strokeWidth={Math.max(0.6, W * 0.008)} strokeLinejoin="round" />
      {inner && <path d={path(inner)} fill="none" stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={Math.max(0.6, W * 0.006)} />}
      {glow > 0 && <path d={topD} fill="#FFFFFF" opacity={0.7 * glow} />}
    </g>
  );
};
