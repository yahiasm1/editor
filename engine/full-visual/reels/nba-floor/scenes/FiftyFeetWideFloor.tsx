// The reel's floor, drawn through any floor projector (camera or homography), at Rule 1 geometry. The look matches
// PaintedKinkFloor (the reel's one floor): honey maple strips 2.25 in wide with staggered butt joints, the lane in
// charcoal stain, every marking in 2 in white paint, a 3 ft dark apron, a pool of arena light and a slow sweep. Read
// off the Ball Arena 2026 photo (a lit slab in a dark bowl), the Wikideas1 top-down court (boards, line weight).
// The basket is drawn in 3D through the camera, so it has real parallax: stanchion arm, the board's edge in its aluminium frame with the red LED strip, the orange ring and its bracket, the cord net
// in diamond mesh, and their shadows on the boards.
import React, { useMemo } from "react";
import {
  FFW_APRON, FFW_ARC_R, FFW_BASE, FFW_CORNER_X, FFW_HALF, FFW_KINK_Y, FFW_LINE, FFW_SIDE,
  ffwArc as arc, ffwBand as band, ffwPoly as poly, ffwRnd as rnd, type FfwProj,
} from "./FiftyFeetWideWorld";

const BOARD = 0.1875;
const WHITE = "#F3F5F7";
const FAR_Y = 52;
const SHADES = ["#D9B983", "#D3B07A", "#DDC08F", "#CFAA72", "#E0C596", "#D6B47F", "#C9A46C", "#DBBC88"];
const APRON_SHADES = ["#4A3321", "#432E1E", "#503824", "#3E2A1B"];

type Strip = { x: number; bucket: number; joints: number[]; apron: boolean };

const useFiftyFeetWideStrips = () =>
  useMemo(() => {
    const out: Strip[] = [];
    const x0 = -FFW_SIDE - FFW_APRON;
    const n = Math.ceil((2 * (FFW_SIDE + FFW_APRON)) / BOARD);
    for (let i = 0; i < n; i++) {
      const x = x0 + i * BOARD;
      const apron = x < -FFW_SIDE - 0.01 || x >= FFW_SIDE - 0.01;
      const joints: number[] = [];
      let y = FFW_BASE - FFW_APRON - rnd(i + 77) * 6;
      let k = 0;
      while (y < FAR_Y) {
        y += 1.6 + rnd(i * 13 + k) * 5.5;
        k++;
        joints.push(y);
      }
      out.push({ x, bucket: Math.floor(rnd(i, 4) * (apron ? APRON_SHADES.length : SHADES.length)), joints, apron });
    }
    return out;
  }, []);

const useFiftyFeetWideScuffs = () =>
  useMemo(() => {
    const out: { x: number; y: number; r: number; a0: number; len: number; w: number }[] = [];
    const spots: [number, number, number, number][] = [[23, 1, 3, 22], [-23, 1, 3, 22], [0, 26, 6, 26], [16, 18, 5, 12], [-16, 18, 5, 12], [5, 10, 6, 10], [-4, 3, 3, 10]];
    let id = 0;
    for (const [cx, cy, sp, n] of spots)
      for (let i = 0; i < n; i++, id++)
        out.push({ x: cx + (rnd(id, 21) - 0.5) * 2 * sp, y: cy + (rnd(id, 22) - 0.5) * 2 * sp, r: 3 + rnd(id, 23) * 5, a0: rnd(id, 24) * 6.28, len: 0.25 + rnd(id, 25) * 0.6, w: 0.03 + rnd(id, 26) * 0.05 });
    return out;
  }, []);

export const FiftyFeetWideFloor: React.FC<{
  P: FfwProj;
  f: number;
  /** 0..1 each sideline lit (left, right) */
  side: [number, number];
}> = ({ P, f, side }) => {
  const strips = useFiftyFeetWideStrips();
  const scuffs = useFiftyFeetWideScuffs();
  const c = P(0, 8);
  const ppf = c.s || 20;
  const yA = FFW_BASE - FFW_APRON;
  const buckets: string[] = SHADES.map(() => "");
  const apronB: string[] = APRON_SHADES.map(() => "");
  let joints = "";
  for (const s of strips) {
    const d = poly(P, [[s.x, yA], [s.x + BOARD + 0.004, yA], [s.x + BOARD + 0.004, FAR_Y], [s.x, FAR_Y]]);
    if (s.apron) apronB[s.bucket] += d;
    else buckets[s.bucket] += d;
    if (ppf < 9) continue;
    for (const y of s.joints) {
      if (y < yA || y > FAR_Y) continue;
      const jw = Math.max(0.012, 1.0 / ppf);
      joints += poly(P, [[s.x, y], [s.x + BOARD, y], [s.x + BOARD, y + jw], [s.x, y + jw]]);
    }
  }

  const lane = poly(P, [[-8, FFW_BASE], [8, FFW_BASE], [8, 13.75], [-8, 13.75]]);
  const L = FFW_LINE;
  const lines: string[] = [];
  const add = (d: string) => d && lines.push(d);
  add(band(P, [[-FFW_SIDE - L, FFW_BASE - L / 2], [FFW_SIDE + L, FFW_BASE - L / 2]], L)); // baseline
  add(band(P, [[-FFW_SIDE - L, FFW_HALF], [FFW_SIDE + L, FFW_HALF]], L)); // half court
  for (const s of [-1, 1]) {
    add(band(P, [[s * (8 - L / 2), FFW_BASE], [s * (8 - L / 2), 13.75]], L)); // lane sides
    add(band(P, [[s * 4 - (s * L) / 2, 0], [s * 4 - (s * L) / 2, -1.25]], L)); // restricted area legs
    add(poly(P, [[s * 8, 1.75], [s * 8.67, 1.75], [s * 8.67, 2.75], [s * 8, 2.75]])); // the block
    for (const y of [5.75, 8.75, 11.75]) add(band(P, [[s * 8, y], [s * 8.5, y]], L)); // lane space marks
    add(band(P, [[s * 11, FFW_BASE], [s * 11, FFW_BASE + 0.5]], L)); // baseline hash (Rule 1.6)
    add(band(P, [[s * 11, 7.75], [s * 11.5, 7.75]], L)); // 13 ft hash (Rule 1.7)
    add(band(P, [[s * FFW_SIDE, 22.75], [s * (FFW_SIDE - 3), 22.75]], L)); // 28 ft sideline hash
    // the three-point line: straight corner run 3 ft inside the sideline, then the 23'9" arc
    add(band(P, [[s * (FFW_CORNER_X - L / 2), FFW_BASE], [s * (FFW_CORNER_X - L / 2), FFW_KINK_Y]], L));
  }
  const kA = Math.atan2(FFW_KINK_Y, FFW_CORNER_X);
  add(band(P, arc(0, 0, FFW_ARC_R - L / 2, kA, Math.PI - kA, 90), L));
  add(band(P, [[-8, 13.75 - L / 2], [8, 13.75 - L / 2]], L)); // free throw line
  add(band(P, arc(0, 0, 4 - L / 2, 0, Math.PI, 36), L)); // restricted arc
  add(band(P, arc(0, 13.75, 6 - L / 2, 0, Math.PI, 40), L)); // free throw circle, solid half
  for (let k = 0; k < 8; k++) {
    const a0 = Math.PI + (k / 8) * Math.PI + 0.07;
    add(band(P, arc(0, 13.75, 6 - L / 2, a0, a0 + Math.PI / 8 - 0.18, 6), L)); // the dashed half (real paint)
  }
  add(band(P, arc(0, FFW_HALF, 6 - L / 2, 0, Math.PI, 40), L)); // centre circle
  add(band(P, arc(0, FFW_HALF, 2 - L / 2, 0, Math.PI, 24), L)); // inner centre circle

  const sideD = [-1, 1].map((s) => band(P, [[s * (FFW_SIDE + L / 2), FFW_BASE - L], [s * (FFW_SIDE + L / 2), FFW_HALF + 8]], L));

  // rubber skids: short, nearly straight, dark on the maple and a pale smudge on the lane paint
  let scuffD = "", laneScuffD = "";
  if (ppf > 12)
    for (const s of scuffs) {
      const d = band(P, arc(s.x, s.y, s.r, s.a0, s.a0 + s.len / s.r, 4), s.w);
      if (Math.abs(s.x) < 8 && s.y < 13.75) laneScuffD += d;
      else scuffD += d;
    }

  const lp = P(0, 6);
  const sweepX = ((f * 2.2) % 1600) - 300;
  const apronEdge = [-1, 1].map((s) => poly(P, [[s * (FFW_SIDE + FFW_APRON), yA], [s * (FFW_SIDE + FFW_APRON + 0.25), yA], [s * (FFW_SIDE + FFW_APRON + 0.25), FAR_Y], [s * (FFW_SIDE + FFW_APRON), FAR_Y]]));
  const sideFill = (v: number) => `rgb(${Math.round(196 + 59 * v)},${Math.round(200 + 55 * v)},${Math.round(204 + 51 * v)})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <radialGradient id="ffw-pool" cx={lp.x} cy={lp.y} r={Math.max(500, Math.min(1500, lp.s * 30))} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF6E2" stopOpacity={0.16} />
          <stop offset="0.5" stopColor="#FFF6E2" stopOpacity={0.03} />
          <stop offset="1" stopColor="#000" stopOpacity={0.34} />
        </radialGradient>
        <linearGradient id="ffw-sheen" gradientUnits="userSpaceOnUse" x1={sweepX} y1={300} x2={sweepX + 460} y2={1500}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.1} />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ffw-lane" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#26282C" />
          <stop offset="1" stopColor="#303237" />
        </linearGradient>
        <filter id="ffw-scuff" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={Math.max(0.6, Math.min(3, ppf * 0.012))} /></filter>
        <filter id="ffw-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={7} /></filter>
      </defs>
      {apronB.map((d, i) => (d ? <path key={`a${i}`} d={d} fill={APRON_SHADES[i]} /> : null))}
      {buckets.map((d, i) => (d ? <path key={`b${i}`} d={d} fill={SHADES[i]} /> : null))}
      <path d={lane} fill="url(#ffw-lane)" opacity={0.86} />
      {joints && <path d={joints} fill="rgba(92,58,22,0.26)" />}
      {scuffD && <path d={scuffD} fill="#2A241F" opacity={0.14} filter="url(#ffw-scuff)" />}
      {laneScuffD && <path d={laneScuffD} fill="#9A968F" opacity={0.07} filter="url(#ffw-scuff)" />}
      {apronEdge.map((d, i) => <path key={`e${i}`} d={d} fill="#1A1410" />)}
      <rect x={0} y={0} width={1080} height={1920} fill="url(#ffw-pool)" />
      <rect x={0} y={0} width={1080} height={1920} fill="url(#ffw-sheen)" />
      <path d={lines.join("")} fill={WHITE} />
      {sideD.map((d, i) => <path key={`sd${i}`} d={d} fill={sideFill(side[i])} />)}
      {sideD.map((d, i) => (side[i] > 0.01 ? <path key={`sg${i}`} d={d} fill="none" stroke="#FFFFFF" strokeOpacity={0.7 * side[i]} strokeWidth={9} filter="url(#ffw-glow)" /> : null))}
    </svg>
  );
};

/** the basket in 3D through the camera, with its shadows; sway = net swing (ft) */
export const FiftyFeetWideBasket: React.FC<{ P: FfwProj; f: number; sway: number; opacity: number }> = ({ P, f, sway, opacity }) => {
  if (opacity <= 0) return null;
  const box = (x0: number, x1: number, y0: number, y1: number, z: number) => poly(P, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z);
  const sh = 0.9; // the arena light sits a little toward half court and to the left
  const shx = -0.35;
  const ringPts = (r: number, z: number, cy = 0, cx = 0, n = 48) => poly(P, arc(cx, cy, r, 0, Math.PI * 2, n), z);
  const c10 = P(0, 0, 10);
  const sw = Math.max(1.4, c10.s * 0.055);

  // the net: 12 cords from the ring hooks, knotted into diamonds on four rows down to 8.4 ft
  const rows = [
    { r: 0.75, z: 10 },
    { r: 0.66, z: 9.6 },
    { r: 0.58, z: 9.2 },
    { r: 0.5, z: 8.8 },
    { r: 0.43, z: 8.4 },
  ];
  const netPt = (row: number, k: number) => {
    const R = rows[row];
    const a = ((k + (row % 2) * 0.5) / 12) * Math.PI * 2;
    const swing = sway * (row / 4) * (1 + 0.3 * Math.sin(f / 9 + k));
    return P(R.r * Math.cos(a) + swing, R.r * Math.sin(a) + swing * 0.3, R.z);
  };
  let net = "";
  for (let row = 0; row < rows.length - 1; row++)
    for (let k = 0; k < 12; k++) {
      const a = netPt(row, k);
      const b1 = netPt(row + 1, row % 2 ? k + 1 : k);
      const b2 = netPt(row + 1, row % 2 ? k : k - 1);
      net += `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b1.x.toFixed(1)} ${b1.y.toFixed(1)}M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b2.x.toFixed(1)} ${b2.y.toFixed(1)}`;
    }
  let netShadow = "";
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    const p = P(0.75 * Math.cos(a) + shx * 1.2, 0.75 * Math.sin(a) + sh * 1.2);
    const q = P(0.43 * Math.cos(a + 0.26) + shx * 1.0, 0.43 * Math.sin(a + 0.26) + sh * 1.0);
    netShadow += `M${p.x.toFixed(1)} ${p.y.toFixed(1)}L${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
  }
  const ledOn = 0.55 + 0.45 * Math.sin(f / 13);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity }}>
      <defs>
        <filter id="ffw-bsh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={Math.max(1.5, c10.s * 0.05)} /></filter>
        <linearGradient id="ffw-arm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1A1E24" />
          <stop offset="0.45" stopColor="#3A424C" />
          <stop offset="1" stopColor="#161A1F" />
        </linearGradient>
        <linearGradient id="ffw-alu" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8E969E" />
          <stop offset="0.3" stopColor="#E6EAED" />
          <stop offset="0.55" stopColor="#A7AFB6" />
          <stop offset="1" stopColor="#D5DADE" />
        </linearGradient>
      </defs>
      {/* shadows on the boards */}
      <g filter="url(#ffw-bsh)" opacity={0.32}>
        <path d={box(-0.6 + shx, 0.6 + shx, -6.6 + sh, -1.5 + sh, 0)} fill="#000" />
        <path d={box(-3 + shx * 1.3, 3 + shx * 1.3, -1.45 + sh * 1.35, -1.2 + sh * 1.35, 0)} fill="#000" />
                <path d={ringPts(0.8, 0, sh * 1.2, shx * 1.2)} fill="none" stroke="#000" strokeWidth={sw * 1.2} />
        <path d={netShadow} stroke="#000" strokeWidth={sw * 0.6} />
      </g>
      {/* the stanchion arm reaching out over the baseline */}
      <path d={box(-0.55, 0.55, -6.8, -1.6, 11.2)} fill="url(#ffw-arm)" stroke="#4A535E" strokeWidth={1} />
      <path d={box(-0.16, 0.16, -6.8, -1.6, 11.35)} fill="#49525C" opacity={0.6} />
      {/* the board: its top edge in an aluminium frame, the red LED strip along the face */}
      <path d={box(-3.05, 3.05, -1.47, -1.2, 13.5)} fill="url(#ffw-alu)" stroke="#5E666E" strokeWidth={1} />
      <path d={box(-3, 3, -1.25, -1.2, 13.52)} fill="#FF3B30" opacity={0.35 + 0.5 * ledOn} />
      {/* the net under the ring, then the ring and its bracket to the board */}
      <path d={net} stroke="#F4F6F8" strokeOpacity={0.72} strokeWidth={Math.max(1, sw * 0.32)} fill="none" strokeLinecap="round" />
      <path d={box(-0.22, 0.22, -1.2, -0.74, 10)} fill="#9A3412" stroke="#5B1D08" strokeWidth={1} />
      <path d={ringPts(0.79, 10)} fill="none" stroke="#7C2D12" strokeWidth={sw * 1.9} />
      <path d={ringPts(0.79, 10.02)} fill="none" stroke="#E35205" strokeWidth={sw * 1.35} />
      <path d={poly(P, arc(0, 0, 0.79, 0.4 * Math.PI, 0.85 * Math.PI, 14), 10.03).replace(/Z$/, "")} fill="none" stroke="#FFB27A" strokeOpacity={0.7} strokeWidth={sw * 0.45} strokeLinecap="round" />
    </svg>
  );
};
