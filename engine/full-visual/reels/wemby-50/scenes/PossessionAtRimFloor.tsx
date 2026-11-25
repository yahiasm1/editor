// The floor of `cost`: the same court the reel draws top-down (PlayByPlayLogCourt's maple, lane paint, lines), seen
// from low in the side stands. 2.25 in maple strips running baseline to half court with staggered end joints, the
// apron behind the baseline in Spurs black, the lane painted black with a silver edge, white 2 in lines that
// foreshorten with the floor, the restricted arc, the block and hash marks, and a satin sheen the arena light slides
// across. Behind the baseline, the courtside seats, LED boards and photographers, then the dark risers of the stands.
import React from "react";
import { PossessionAtRimCourtside } from "./PossessionAtRimCourtside";
import { PAR, possessionAtRimPoly as poly, possessionAtRimRnd as rnd, type PossessionAtRimProj, type PossessionAtRimV3 } from "./PossessionAtRimWorld";

const STRIP = 0.1875;
const LINE = 1 / 6;
const X0 = -25;
const X1 = 25;

/** the far side of the floor the camera can still see in front of it */
export function possessionAtRimFloorLimit(pr: PossessionAtRimProj): number {
  let lim = 40;
  for (const x of [X0, 0, X1]) {
    // depth is linear in z along the floor: find where it falls to 1.2 ft
    const d0 = pr.depth([x, 0, 0]);
    const d1 = pr.depth([x, 0, 1]);
    const k = d1 - d0;
    if (k < 0) lim = Math.min(lim, (1.2 - d0) / k);
  }
  return lim;
}

const quad = (x0: number, x1: number, z0: number, z1: number): PossessionAtRimV3[] => [
  [x0, 0, z0],
  [x1, 0, z0],
  [x1, 0, z1],
  [x0, 0, z1],
];

/** a ring band on the floor (centre cz), from angle a0 to a1, as one polygon */
const band = (cz: number, r: number, w: number, a0: number, a1: number, n = 36): PossessionAtRimV3[] => {
  const out: PossessionAtRimV3[] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push([(r + w / 2) * Math.cos(a), 0, cz + (r + w / 2) * Math.sin(a)]);
  }
  for (let i = n; i >= 0; i--) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push([(r - w / 2) * Math.cos(a), 0, cz + (r - w / 2) * Math.sin(a)]);
  }
  return out;
};

export const PossessionAtRimFloor: React.FC<{ pr: PossessionAtRimProj; f: number }> = ({ pr, f }) => {
  const { P } = pr;
  const zl = Math.min(34, possessionAtRimFloorLimit(pr));
  const zc = (z: number) => Math.min(z, zl);

  // maple strips, each a slightly different cut of the tree, with end joints every 2 to 8 ft
  const strips: React.ReactNode[] = [];
  const joints: string[] = [];
  const n = Math.round((X1 - X0) / STRIP);
  for (let i = 0; i < n; i++) {
    const x = X0 + i * STRIP;
    const l = 66 + rnd(i) * 10;
    const c = `hsl(${(33 + rnd(i + 900) * 6).toFixed(1)}, ${(50 + rnd(i + 400) * 13).toFixed(1)}%, ${l.toFixed(1)}%)`;
    strips.push(<polygon key={i} points={poly(P, quad(x, x + STRIP + 0.01, -0.02, zl))} fill={c} />);
    let z = -rnd(i + 77) * 6;
    let k = 0;
    while (z < zl) {
      z += 2 + rnd(i * 13 + k) * 6;
      k++;
      if (z > 0 && z < zl) {
        const a = P([x, 0, z]);
        const b = P([x + STRIP, 0, z]);
        joints.push(`M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
      }
    }
  }

  // the light: a pool of warm arena light under the hoop, and a soft band sliding slowly across the satin
  const pool = P([0, 0, 7]);
  const poolR = P([9, 0, 7]).x - pool.x;
  const sweepX = -16 + ((f * 0.05) % 32);
  const sa = P([sweepX, 0, 0]);
  const sb = P([sweepX + 7, 0, zc(22)]);

  // the far risers behind the baseline: dark rows of seats, a few dim faces
  const risers: React.ReactNode[] = [];
  for (let r = 0; r < 14; r++) {
    const y0 = 3.6 + r * 2.3;
    const zz = -15 - r * 2.6;
    const a = P([-40, y0, zz]);
    const b = P([40, y0, zz]);
    const c = P([40, y0 + 2.3, zz - 2.6]);
    const d = P([-40, y0 + 2.3, zz - 2.6]);
    risers.push(<polygon key={`r${r}`} points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`} fill={r % 2 ? "#121822" : "#10151E"} />);
    for (let k = 0; k < 34; k++) {
      if (rnd(r * 97 + k) < 0.45) continue;
      const q = P([-38 + k * 2.3 + rnd(r * 31 + k) * 1.2, y0 + 1.6, zz - 1.3]);
      risers.push(<ellipse key={`p${r}-${k}`} cx={q.x} cy={q.y} rx={q.s * 0.36} ry={q.s * 0.42} fill={rnd(k * 7 + r) < 0.5 ? "#2A2E36" : "#3A332D"} opacity={0.55} />);
    }
  }

  const white = PAR.white;
  const rz = PAR.rimZ;
  const lines: PossessionAtRimV3[][] = [
    quad(X0, X1, 0, LINE), // baseline
    quad(-8, -8 + LINE, 0, zc(19)), // lane sides
    quad(8 - LINE, 8, 0, zc(19)),
    quad(-8, 8, 19 - LINE, 19), // free throw line
    quad(-4 - LINE / 2, -4 + LINE / 2, 4, rz), // restricted area straight bits
    quad(4 - LINE / 2, 4 + LINE / 2, 4, rz),
    band(rz, 4, LINE, 0, Math.PI), // restricted arc
    band(19, 6, LINE, 0, Math.PI), // free throw circle, toward half court
    quad(-22 - LINE / 2, -22 + LINE / 2, 0, 14), // corner threes
    quad(22 - LINE / 2, 22 + LINE / 2, 0, 14),
    band(rz, 23.75, LINE, Math.atan2(14 - rz, 22), Math.PI - Math.atan2(14 - rz, 22), 80),
  ];
  // lane marks: the block at 7 ft, then hashes every 3 ft; the low block's small box
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -8.67 : 8;
    lines.push(quad(x0, x0 + 0.67, 7, 8));
    for (const z of [11, 14, 17]) lines.push(quad(x0, x0 + 0.67, z, z + LINE));
    lines.push(quad(s < 0 ? -25 : 22, s < 0 ? -22 : 25, 28, 28 + LINE));
  }
  // the dashed half of the free throw circle, inside the lane
  for (let k = 0; k < 8; k++) {
    const a0 = Math.PI + (k / 8) * Math.PI;
    lines.push(band(19, 6, LINE, a0, a0 + (Math.PI / 8) * 0.55, 6));
  }

  return (
    <g>
      <defs>
        <linearGradient id="par-lane" gradientUnits="userSpaceOnUse" x1={0} y1={P([0, 0, 0]).y} x2={0} y2={P([0, 0, zc(19)]).y}>
          <stop offset="0" stopColor="#0A0B0D" />
          <stop offset="1" stopColor="#16181C" />
        </linearGradient>
        <radialGradient id="par-pool" gradientUnits="userSpaceOnUse" cx={pool.x} cy={pool.y} r={Math.max(200, poolR)} gradientTransform={`translate(${pool.x} ${pool.y}) scale(1 0.42) translate(${-pool.x} ${-pool.y})`}>
          <stop offset="0" stopColor="#FFF4DC" stopOpacity={0.16} />
          <stop offset="0.55" stopColor="#FFF4DC" stopOpacity={0.04} />
          <stop offset="1" stopColor="#000" stopOpacity={0.3} />
        </radialGradient>
        <linearGradient id="par-sweep" gradientUnits="userSpaceOnUse" x1={sa.x} y1={sa.y} x2={sb.x} y2={sb.y}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.09" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g>{risers}</g>
      {/* the apron behind the baseline, painted Spurs black */}
      <polygon points={poly(P, quad(-40, 40, -14, 0))} fill="#13171D" />
      {/* courtside: seats and fans, the LED boards, the photographers (PossessionAtRimCourtside) */}
      <PossessionAtRimCourtside pr={pr} f={f} />
      <g>{strips}</g>
      <path d={joints.join("")} stroke="rgba(70,40,10,0.32)" strokeWidth={1} />
      {/* the lane, painted, with its silver inner edge */}
      <polygon points={poly(P, quad(-8, 8, 0, zc(19)))} fill="url(#par-lane)" />
      <polygon points={poly(P, quad(-7.6, -7.48, 0, zc(18.6)))} fill="#C4CED4" opacity={0.8} />
      <polygon points={poly(P, quad(7.48, 7.6, 0, zc(18.6)))} fill="#C4CED4" opacity={0.8} />
      <polygon points={poly(P, quad(X0, X1, -0.02, zl))} fill="url(#par-pool)" />
      <polygon points={poly(P, quad(X0, X1, -0.02, zl))} fill="url(#par-sweep)" />
      <g fill={white}>
        {lines.map((l, i) => (
          <polygon key={i} points={poly(P, l.map((p) => [p[0], p[1], zc(p[2])] as PossessionAtRimV3))} />
        ))}
      </g>
    </g>
  );
};
