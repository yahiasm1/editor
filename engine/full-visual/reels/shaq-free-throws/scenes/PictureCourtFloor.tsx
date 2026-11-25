// The Lakers half court at Rule 1 geometry, painted line by line, through the scene's camera. The look is the
// reel's floor (plan.md "The floor"): honey maple strips 2.25 in wide running baseline to half court with staggered
// butt joints, the lane painted solid Lakers gold #FDB927 with its gloss and scuffs (the 2000 Finals photo, Bigmoe797),
// 2 in white lines, a dark apron, a pool of arena light and a slow sweep. The basket is built in 3D: stanchion arm,
// the glass board with its white border and shooter's square, the orange ring on its bracket, the cord net.
import React, { useMemo } from "react";
import {
  PC_BASE, PC_BOARD_Y, PC_FT_Y, PC_HALF, PC_LINE, PC_SIDE,
  pcArc as arc, pcBand as band, pcCut as cut, pcPoly as poly, pcPoly3 as poly3, pcRnd as rnd, type PcProj,
} from "./PictureCourtWorld";

const STRIP = 0.1875;
const APRON = 4;
const SHADES = ["#D9B37A", "#D1A96F", "#DDBB86", "#CCA266", "#E0C08E", "#D5AE75", "#C79D62", "#DAB680"];
const WHITE = "#F4F2EC";

type Strip = { x: number; b: number; joints: number[] };

const usePictureCourtStrips = () =>
  useMemo(() => {
    const out: Strip[] = [];
    const x0 = -PC_SIDE - APRON;
    const n = Math.ceil((2 * (PC_SIDE + APRON)) / STRIP);
    for (let i = 0; i < n; i++) {
      const joints: number[] = [];
      let y = PC_BASE - APRON - rnd(i + 77) * 6;
      let k = 0;
      while (y < PC_HALF + APRON) {
        y += 1.8 + rnd(i * 13 + k) * 5.2;
        k++;
        joints.push(y);
      }
      out.push({ x: x0 + i * STRIP, b: Math.floor(rnd(i, 4) * SHADES.length), joints });
    }
    return out;
  }, []);

/** every marking as a polyline, in the order the paint goes down, with its width */
type Mark = { pts: [number, number][]; w: number; key: string };
export const PICTURE_COURT_MARKS: Mark[] = (() => {
  const L = PC_LINE;
  const m: Mark[] = [];
  m.push({ key: "base", pts: [[-PC_SIDE, PC_BASE - L / 2], [PC_SIDE, PC_BASE - L / 2]], w: L });
  for (const s of [-1, 1]) m.push({ key: `side${s}`, pts: [[s * (PC_SIDE + L / 2), PC_BASE], [s * (PC_SIDE + L / 2), PC_HALF]], w: L });
  m.push({ key: "half", pts: [[-PC_SIDE, PC_HALF], [PC_SIDE, PC_HALF]], w: L });
  for (const s of [-1, 1]) m.push({ key: `lane${s}`, pts: [[s * (8 - L / 2), PC_BASE], [s * (8 - L / 2), PC_FT_Y]], w: L });
  m.push({ key: "ftline", pts: [[-8, PC_FT_Y + L / 2], [8, PC_FT_Y + L / 2]], w: L });
  m.push({ key: "ftcircle", pts: arc(0, PC_FT_Y + L, 6 - L / 2, 0, Math.PI, 40), w: L });
  for (let k = 0; k < 8; k++) {
    const a0 = Math.PI + (k / 8) * Math.PI + 0.07;
    m.push({ key: `dash${k}`, pts: arc(0, PC_FT_Y + L, 6 - L / 2, a0, a0 + Math.PI / 8 - 0.18, 6), w: L });
  }
  m.push({ key: "ra", pts: [[-4, -1.25], [-4, 0], ...arc(0, 0, 4 - L / 2, Math.PI, 0, 36), [4, 0], [4, -1.25]], w: L });
  for (const s of [-1, 1]) {
    for (const y of [PC_BASE + 7, PC_BASE + 8, PC_BASE + 11, PC_BASE + 14]) m.push({ key: `ls${s}${y}`, pts: [[s * 8, y], [s * 8.5, y]], w: L });
    m.push({ key: `blk${s}`, pts: [[s * 8.33, PC_BASE + 7 - 1], [s * 8.33, PC_BASE + 7]], w: 0.67 });
    m.push({ key: `bh${s}`, pts: [[s * 11, PC_BASE], [s * 11, PC_BASE + 0.5]], w: L });
    // the three-point line: corner run 3 ft inside the sideline, then the 23'9" arc
    const ky = Math.sqrt(23.75 * 23.75 - 22 * 22);
    m.push({ key: `c3${s}`, pts: [[s * 22, PC_BASE], [s * 22, ky]], w: L });
  }
  const kA = Math.atan2(Math.sqrt(23.75 * 23.75 - 22 * 22), 22);
  m.push({ key: "arc3", pts: arc(0, 0, 23.75 - L / 2, kA, Math.PI - kA, 90), w: L });
  m.push({ key: "cc", pts: arc(0, PC_HALF, 6 - L / 2, 0, Math.PI, 40), w: L });
  return m;
})();

export const PictureCourtFloor: React.FC<{
  P: PcProj;
  f: number;
  /** 0..1 the card turning into maple */
  wood: number;
  /** 0..1 how much of the paint is down (lines are painted in order) */
  paint: number;
  /** 0..1 everything but the line and the lane edges dims */
  dim: number;
  /** 0..1 the free throw line lit under his toes */
  lineLit: number;
}> = ({ P, f, wood, paint, dim, lineLit }) => {
  const strips = usePictureCourtStrips();
  const c = P.p(0, 8);
  const ppf = c.s;
  const yA = PC_BASE - APRON, yB = PC_HALF + APRON;
  const buckets: string[] = SHADES.map(() => "");
  let joints = "";
  // strips only where they are big enough to read; otherwise one slab with the strips as texture
  const fine = ppf > 5;
  if (fine) {
    for (const s of strips) {
      buckets[s.b] += poly(P, [[s.x, yA], [s.x + STRIP + 0.006, yA], [s.x + STRIP + 0.006, yB], [s.x, yB]]);
      if (ppf < 11) continue;
      for (const y of s.joints) {
        const jw = Math.max(0.015, 0.9 / ppf);
        joints += poly(P, [[s.x, y], [s.x + STRIP, y], [s.x + STRIP, y + jw], [s.x, y + jw]]);
      }
    }
  }
  const slab = poly(P, [[-PC_SIDE - APRON, yA], [PC_SIDE + APRON, yA], [PC_SIDE + APRON, yB], [-PC_SIDE - APRON, yB]]);
  const court = poly(P, [[-PC_SIDE, PC_BASE], [PC_SIDE, PC_BASE], [PC_SIDE, PC_HALF], [-PC_SIDE, PC_HALF]]);
  const lane = poly(P, [[-8, PC_BASE], [8, PC_BASE], [8, PC_FT_Y], [-8, PC_FT_Y]]);
  // purple hairline seams in the gold paint, every 2 ft, as the painted lane reads in the photo
  let seams = "";
  for (let x = -7; x <= 7; x += 2) seams += band(P, [[x, PC_BASE], [x, PC_FT_Y]], 0.02);
  // the paint goes down in order; each mark painted over its share of `paint`
  const n = PICTURE_COURT_MARKS.length;
  let lines = "";
  let keep = "";
  PICTURE_COURT_MARKS.forEach((m, i) => {
    const t = Math.max(0, Math.min(1, paint * n * 0.55 - i * 0.55 * 0.82));
    if (t <= 0) return;
    const d = band(P, cut(m.pts, t), m.w);
    if (m.key === "ftline" || m.key.startsWith("lane") || m.key === "ftcircle") keep += d;
    else lines += d;
  });
  // scuffs: rubber skids on the maple, pale smudges on the gold
  let scuffs = "", laneScuffs = "";
  if (ppf > 9)
    for (let i = 0; i < 90; i++) {
      const x = (rnd(i, 21) - 0.5) * 36, y = PC_BASE + rnd(i, 22) * 30;
      const r = 2 + rnd(i, 23) * 4, a0 = rnd(i, 24) * 6.28, len = 0.3 + rnd(i, 25) * 0.7;
      const d = band(P, arc(x, y, r, a0, a0 + len / r, 4), 0.04 + rnd(i, 26) * 0.05);
      if (Math.abs(x) < 8 && y < PC_FT_Y) laneScuffs += d;
      else scuffs += d;
    }
  const lp = P.p(0, 6);
  const sweep = ((f * 2.4) % 1700) - 320;
  const ftGlow = band(P, [[-8, PC_FT_Y + PC_LINE / 2], [8, PC_FT_Y + PC_LINE / 2]], 0.9);
  const dimA = 0.55 * dim;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <radialGradient id="pc-pool" cx={lp.x} cy={lp.y} r={Math.max(500, Math.min(1600, lp.s * 34))} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF6E2" stopOpacity={0.18} />
          <stop offset="0.55" stopColor="#FFF6E2" stopOpacity={0.03} />
          <stop offset="1" stopColor="#000" stopOpacity={0.2} />
        </radialGradient>
        <linearGradient id="pc-sheen" gradientUnits="userSpaceOnUse" x1={sweep} y1={300} x2={sweep + 480} y2={1500}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.12} />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pc-gold" gradientUnits="userSpaceOnUse" x1={0} y1={P.p(0, PC_BASE).y} x2={0} y2={P.p(0, PC_FT_Y).y}>
          <stop offset="0" stopColor="#E9A81C" />
          <stop offset="1" stopColor="#FDB927" />
        </linearGradient>
        <filter id="pc-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={Math.max(0.6, Math.min(3, ppf * 0.02))} /></filter>
        <filter id="pc-glow" x="-30%" y="-200%" width="160%" height="500%"><feGaussianBlur stdDeviation={10} /></filter>
      </defs>
      {/* the card it was a moment ago, and the maple it becomes */}
      <path d={slab} fill="#161B22" stroke="#30363D" strokeWidth={2} />
      <g opacity={wood}>
        <path d={slab} fill="#3A2818" />
        {fine ? buckets.map((d, i) => (d ? <path key={i} d={d} fill={SHADES[i]} /> : null)) : <path d={court} fill="#D6B077" />}
        {joints && <path d={joints} fill="rgba(92,58,22,0.28)" />}
        <path d={lane} fill="url(#pc-gold)" />
        <path d={seams} fill="#552583" opacity={0.28} />
        {scuffs && <path d={scuffs} fill="#2A241F" opacity={0.16} filter="url(#pc-soft)" />}
        {laneScuffs && <path d={laneScuffs} fill="#FFF3D0" opacity={0.16} filter="url(#pc-soft)" />}
        <rect x={0} y={0} width={1080} height={1920} fill="url(#pc-pool)" />
        <rect x={0} y={0} width={1080} height={1920} fill="url(#pc-sheen)" />
      </g>
      <path d={lines} fill={WHITE} />
      {/* the arena goes dark around the line */}
      {dimA > 0 && <path d={slab} fill="#070B14" opacity={dimA} />}
      <path d={keep} fill={WHITE} opacity={1 - dim * 0.15} />
      {lineLit > 0 && <path d={ftGlow} fill="#FFFFFF" opacity={0.55 * lineLit} filter="url(#pc-glow)" />}
    </svg>
  );
};

/** the basket in 3D, with its shadow on the boards */
export const PictureCourtBasket: React.FC<{ P: PcProj; f: number; op: number; sway: number; dim: number }> = ({ P, f, op, sway, dim }) => {
  if (op <= 0.001) return null;
  const B = PC_BOARD_Y;
  const ring = (r: number, z: number, n = 48) => poly(P, arc(0, 0, r, 0, Math.PI * 2, n), z);
  const s10 = P.p(0, 0, 10).s;
  // stanchion: a padded base 6.5 ft behind the baseline, the arm reaching over to the back of the board
  const arm = poly3(P, [[-0.35, PC_BASE - 4, 12.2], [0.35, PC_BASE - 4, 12.2], [0.35, B - 0.6, 11.4], [-0.35, B - 0.6, 11.4]]);
  const armLow = poly3(P, [[-0.3, PC_BASE - 4.5, 0], [0.3, PC_BASE - 4.5, 0], [0.3, PC_BASE - 4.2, 12.4], [-0.3, PC_BASE - 4.2, 12.4]]);
  const pad = poly3(P, [[-2, PC_BASE - 6.5, 0], [2, PC_BASE - 6.5, 0], [2, PC_BASE - 3.6, 0], [-2, PC_BASE - 3.6, 0]]);
  const padTop = poly3(P, [[-2, PC_BASE - 6.5, 3.2], [2, PC_BASE - 6.5, 3.2], [2, PC_BASE - 3.6, 3.2], [-2, PC_BASE - 3.6, 3.2]]);
  const padFront = poly3(P, [[-2, PC_BASE - 3.6, 0], [2, PC_BASE - 3.6, 0], [2, PC_BASE - 3.6, 3.2], [-2, PC_BASE - 3.6, 3.2]]);
  const board = poly3(P, [[-3, B, 9.5], [3, B, 9.5], [3, B, 13], [-3, B, 13]]);
  const frame = (w: number) => poly3(P, [[-3 + w, B, 9.5 + w], [3 - w, B, 9.5 + w], [3 - w, B, 13 - w], [-3 + w, B, 13 - w]]);
  const sq = poly3(P, [[-1, B - 0.01, 10], [1, B - 0.01, 10], [1, B - 0.01, 11.5], [-1, B - 0.01, 11.5]]);
  const sqIn = poly3(P, [[-1 + 0.17, B - 0.01, 10 + 0.17], [1 - 0.17, B - 0.01, 10 + 0.17], [1 - 0.17, B - 0.01, 11.5 - 0.17], [-1 + 0.17, B - 0.01, 11.5 - 0.17]]);
  const bracket = poly3(P, [[-0.3, B, 9.85], [0.3, B, 9.85], [0.25, -0.62, 9.95], [-0.25, -0.62, 9.95]]);
  // the net: 12 cords from the ring hooks, knotted into diamonds on four rows down to 8.5 ft
  const rows = [{ r: 0.75, z: 10 }, { r: 0.66, z: 9.6 }, { r: 0.57, z: 9.2 }, { r: 0.5, z: 8.85 }, { r: 0.44, z: 8.5 }];
  const np = (row: number, k: number) => {
    const R = rows[row];
    const a = ((k + (row % 2) * 0.5) / 12) * Math.PI * 2;
    const sw = sway * (row / 4) * (1 + 0.3 * Math.sin(f / 9 + k));
    return P.p(R.r * Math.cos(a) + sw * 0.3, R.r * Math.sin(a) + sw, R.z);
  };
  let net = "";
  for (let row = 0; row < rows.length - 1; row++)
    for (let k = 0; k < 12; k++) {
      const a = np(row, k), b1 = np(row + 1, row % 2 ? k + 1 : k), b2 = np(row + 1, row % 2 ? k : k - 1);
      net += `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b1.x.toFixed(1)} ${b1.y.toFixed(1)}M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b2.x.toFixed(1)} ${b2.y.toFixed(1)}`;
    }
  // shadows on the floor, light from high and a little toward half court
  const shOff = 1.1;
  const boardShadow = poly(P, [[-3, B + 9.5 * 0.12 + shOff, ], [3, B + 9.5 * 0.12 + shOff], [3, B + 13 * 0.12 + shOff + 0.4], [-3, B + 13 * 0.12 + shOff + 0.4]]);
  const sw = Math.max(1.2, s10 * 0.07);
  const k = 1 - dim * 0.55;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: op }}>
      <path d={boardShadow} fill="#000" opacity={0.06 * k} />
      <path d={pad} fill="#1A1D24" />
      <path d={padTop} fill="#2B2F38" />
      <path d={padFront} fill="#552583" opacity={0.9 * k + 0.1} />
      <path d={armLow} fill="#2E333C" />
      <path d={arm} fill="#3A404A" />
      <path d={board} fill="rgba(210,228,255,0.16)" />
      <path d={frame(0)} fill="none" stroke="#9AA3AE" strokeWidth={sw * 0.9} />
      <path d={frame(0.17)} fill="none" stroke="#F4F6F8" strokeWidth={sw * 1.1} opacity={0.9} />
      <path d={sqIn} fill="none" />
      <path d={sq} fill="none" stroke="#F4F6F8" strokeWidth={sw * 1.2} />
      {/* glass reflection streak */}
      <path d={poly3(P, [[-2.6, B - 0.02, 12.6], [-1.6, B - 0.02, 12.6], [-2.4, B - 0.02, 9.9], [-2.9, B - 0.02, 9.9]])} fill="#FFFFFF" opacity={0.08 * k} />
      <path d={bracket} fill="#C9461A" />
      <path d={net} stroke="#F2F2F2" strokeOpacity={0.85 * k + 0.1} strokeWidth={Math.max(0.8, s10 * 0.025)} fill="none" />
      <path d={ring(0.75, 10)} fill="none" stroke="#E4571E" strokeWidth={sw * 1.2} />
      <path d={ring(0.73, 10.03)} fill="none" stroke="#FF8A4C" strokeWidth={sw * 0.35} opacity={0.7 * k} />
    </svg>
  );
};
