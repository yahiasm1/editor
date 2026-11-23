// What stands behind the baseline in `cost`, as the Toronto photo shows it round the near basket: three rows of
// courtside seats on low risers, black padded chairs with fans in them (mostly dark clothes, a few Spurs silver and
// white), a run of lit LED boards in front of the first row (modular 6 ft panels, the Spurs mark on each), and the
// baseline photographers sitting on the floor either side of the stanchion, their white long lenses on the rim.
// All in feet, through the scene's one projector, so it moves with the camera and keeps its true size.
import React from "react";
import { staticFile } from "remotion";
import { possessionAtRimPlane as plane, possessionAtRimPoly as poly, possessionAtRimRnd as rnd, type PossessionAtRimProj, type PossessionAtRimV3 } from "./PossessionAtRimWorld";

type V3 = PossessionAtRimV3;

const SKIN = ["#E8C2A0", "#C99872", "#A87452", "#7B4E32", "#5A3826", "#F0CFB2", "#B88760"];
const HAIR = ["#1B1512", "#2B1E16", "#4A3424", "#6B5440", "#B9A27E", "#0F0D0C", "#8C8C8C"];
// mostly dark, as a Spurs crowd is: black, charcoal, navy, a few silver jerseys, a white shirt, a red jacket
const CLOTH = ["#16181C", "#1F2228", "#262B33", "#0F1218", "#2E3440", "#8E979F", "#C4CED4", "#D9DCE0", "#3A2E2A", "#6E2A26", "#1C2A3E"];

/** a seated fan seen from the front, drawn in feet (y down) at its hips: chair back, torso, arms, neck, head, hair */
const PossessionAtRimFan: React.FC<{ seed: number; empty?: boolean }> = ({ seed, empty }) => {
  const sk = SKIN[Math.floor(rnd(seed) * SKIN.length)];
  const hr = HAIR[Math.floor(rnd(seed + 1) * HAIR.length)];
  const cl = CLOTH[Math.floor(rnd(seed + 2) * CLOTH.length)];
  const w = 0.62 + rnd(seed + 3) * 0.14; // half shoulder width
  const tall = 1.85 + rnd(seed + 4) * 0.35;
  const lean = (rnd(seed + 5) - 0.5) * 0.18;
  const turn = (rnd(seed + 6) - 0.5) * 0.12; // the head a little turned toward the play
  const cap = rnd(seed + 7) < 0.14;
  return (
    <g>
      {/* the chair: a black padded back with a lighter top roll */}
      <path d="M-0.78 0.2 L-0.74 -2.05 Q0 -2.3 0.74 -2.05 L0.78 0.2 Z" fill="#0A0C10" />
      <path d="M-0.74 -2.05 Q0 -2.3 0.74 -2.05" stroke="#262A31" strokeWidth={0.09} fill="none" />
      {!empty && (
        <g transform={`translate(${lean} 0)`}>
          {/* thighs toward the camera, knees */}
          <path d={`M${-w * 0.85} 0 L${-w * 0.8} 0.7 L${w * 0.8} 0.7 L${w * 0.85} 0 Z`} fill="#121418" />
          {/* torso, shoulders rounded */}
          <path d={`M${-w * 0.82} 0.1 L${-w} ${-tall + 0.32} Q${-w} ${-tall} ${-w + 0.3} ${-tall} L${w - 0.3} ${-tall} Q${w} ${-tall} ${w} ${-tall + 0.32} L${w * 0.82} 0.1 Z`} fill={cl} />
          {/* the light from the roof on the shoulders, the shade under the arms */}
          <path d={`M${-w + 0.06} ${-tall + 0.2} Q0 ${-tall - 0.06} ${w - 0.06} ${-tall + 0.2}`} stroke="#FFFFFF" strokeOpacity={0.1} strokeWidth={0.1} fill="none" />
          <path d={`M${-w + 0.02} ${-tall + 0.45} L${-w * 0.86} 0 M${w - 0.02} ${-tall + 0.45} L${w * 0.86} 0`} stroke="#000" strokeOpacity={0.35} strokeWidth={0.12} />
          {/* hands in the lap */}
          <ellipse cx={-0.16} cy={-0.12} rx={0.17} ry={0.11} fill={sk} opacity={0.85} />
          <ellipse cx={0.18} cy={-0.1} rx={0.17} ry={0.11} fill={sk} opacity={0.85} />
          {/* neck, head, ears, hair */}
          <rect x={-0.13} y={-tall - 0.22} width={0.26} height={0.3} fill={sk} />
          <rect x={-0.13} y={-tall - 0.22} width={0.26} height={0.3} fill="#000" opacity={0.25} />
          <g transform={`translate(${turn} ${-tall - 0.55})`}>
            <ellipse cx={-0.31} cy={0.02} rx={0.06} ry={0.1} fill={sk} />
            <ellipse cx={0.31} cy={0.02} rx={0.06} ry={0.1} fill={sk} />
            <ellipse cx={0} cy={0} rx={0.31} ry={0.4} fill={sk} />
            {/* the roof light from above: forehead bright, chin in shade */}
            <ellipse cx={0} cy={0.2} rx={0.27} ry={0.2} fill="#000" opacity={0.18} />
            {cap ? (
              <path d="M-0.34 -0.08 Q-0.32 -0.46 0 -0.47 Q0.32 -0.46 0.34 -0.08 L0.5 -0.02 L-0.34 -0.06 Z" fill={rnd(seed + 8) < 0.5 ? "#101216" : "#B8C0C6"} />
            ) : (
              <path d={`M-0.32 0.02 Q-0.36 -0.42 0 -0.45 Q0.36 -0.42 0.32 0.02 Q0.24 -0.22 0 -0.26 Q-0.24 -0.22 -0.32 0.02 Z`} fill={hr} />
            )}
          </g>
        </g>
      )}
    </g>
  );
};

/** a baseline photographer sitting on the floor: dark clothes, a credential, the camera up, a white long lens aimed at the rim */
const PossessionAtRimShooter: React.FC<{ pr: PossessionAtRimProj; x: number; z: number; seed: number; aim: V3 }> = ({ pr, x, z, seed, aim }) => {
  const base = pr.P([x, 0, z]);
  const s = base.s;
  const sk = SKIN[Math.floor(rnd(seed) * SKIN.length)];
  const hr = HAIR[Math.floor(rnd(seed + 1) * HAIR.length)];
  // the lens: from the camera body at eye height, 1.1 ft along the line to the rim
  const cam: V3 = [x + 0.1, 2.76, z + 0.3];
  const d: V3 = [aim[0] - cam[0], aim[1] - cam[1], aim[2] - cam[2]];
  const L = Math.hypot(d[0], d[1], d[2]);
  const tip: V3 = [cam[0] + (d[0] / L) * 1.1, cam[1] + (d[1] / L) * 1.1, cam[2] + (d[2] / L) * 1.1];
  const a = pr.P(cam);
  const b = pr.P(tip);
  return (
    <g>
      <g transform={`translate(${base.x.toFixed(1)} ${base.y.toFixed(1)}) scale(${s.toFixed(3)})`}>
        {/* the low stool and the bag beside it */}
        <rect x={-0.5} y={-0.75} width={1.0} height={0.75} rx={0.08} fill="#0C0E12" />
        <rect x={0.55} y={-0.55} width={0.7} height={0.55} rx={0.1} fill="#1C2026" />
        {/* knees up, torso leaning in */}
        <path d="M-0.62 -0.7 L-0.55 -2.25 Q0 -2.45 0.55 -2.25 L0.62 -0.7 Z" fill="#111318" />
        <path d="M-0.7 -0.75 L-0.4 -1.35 L0.4 -1.35 L0.7 -0.75 Z" fill="#0B0D11" />
        {/* the lanyard and credential, the one bright thing on them */}
        <path d="M-0.18 -2.25 L0 -1.7 L0.18 -2.25" stroke="#5A6472" strokeWidth={0.04} fill="none" />
        <rect x={-0.11} y={-1.72} width={0.22} height={0.3} fill="#E9ECEF" />
        <rect x={-0.11} y={-1.72} width={0.22} height={0.08} fill="#C4CED4" />
        {/* head down behind the camera */}
        <rect x={-0.12} y={-2.5} width={0.24} height={0.25} fill={sk} />
        <ellipse cx={-0.05} cy={-2.78} rx={0.29} ry={0.36} fill={sk} />
        <path d="M-0.33 -2.78 Q-0.33 -3.16 -0.03 -3.17 Q0.27 -3.16 0.28 -2.78 Q0.2 -2.98 -0.03 -3.0 Q-0.26 -2.98 -0.33 -2.78 Z" fill={hr} />
        {/* the camera body, black, at the eye */}
        <rect x={-0.08} y={-2.92} width={0.46} height={0.36} rx={0.06} fill="#08090B" />
        <rect x={-0.06} y={-2.96} width={0.14} height={0.08} fill="#1E2228" />
      </g>
      {/* the white long lens: a cylinder seen near end-on, its hood ring and the dark front glass */}
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#E6E8EA" strokeWidth={s * 0.36} strokeLinecap="round" />
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#FFFFFF" strokeWidth={s * 0.1} strokeLinecap="round" opacity={0.6} transform={`translate(${(-s * 0.06).toFixed(1)} ${(-s * 0.08).toFixed(1)})`} />
      <circle cx={b.x} cy={b.y} r={s * 0.2} fill="#0E1116" stroke="#C9CDD1" strokeWidth={s * 0.05} />
      <circle cx={b.x - s * 0.05} cy={b.y - s * 0.05} r={s * 0.06} fill="#6F8FB0" opacity={0.55} />
      <line x1={a.x + (b.x - a.x) * 0.35} y1={a.y + (b.y - a.y) * 0.35} x2={a.x + (b.x - a.x) * 0.42} y2={a.y + (b.y - a.y) * 0.42} stroke="#15171A" strokeWidth={s * 0.37} />
    </g>
  );
};

/** one 6 ft LED panel of the baseline board, mapped onto its plane */
const PossessionAtRimLed: React.FC<{ pr: PossessionAtRimProj; x0: number; z: number; f: number; i: number }> = ({ pr, x0, z, f, i }) => {
  const H = 2.6;
  const W = 6;
  // the boards run a slow loop: the Spurs mark rides across, a silver sweep passes every few seconds
  const sweep = ((f * 2.2 + i * 90) % 520) - 120;
  return (
    <g transform={plane(pr.P, [x0, H, z], [x0 + W, H, z], [x0, 0, z], 600, 260)}>
      <rect x={0} y={0} width={600} height={260} fill="#070A10" />
      <rect x={6} y={10} width={588} height={240} fill="#0E1520" />
      <rect x={6} y={10} width={588} height={240} fill="#C4CED4" opacity={0.05} />
      <image href={staticFile("wemby-50/possessionatrim-spurs.svg")} x={170} y={-10} width={260} height={260} opacity={0.85} />
      <rect x={sweep} y={10} width={90} height={240} fill="#FFFFFF" opacity={0.07} />
      <rect x={6} y={10} width={588} height={6} fill="#C4CED4" opacity={0.5} />
      {/* the seams of the modules and the dot pitch, so it reads as a lit screen, not a printed board */}
      <path d="M150 10V250M300 10V250M450 10V250" stroke="#000" strokeOpacity={0.55} strokeWidth={3} />
    </g>
  );
};

export const PossessionAtRimCourtside: React.FC<{ pr: PossessionAtRimProj; f: number }> = ({ pr, f }) => {
  const { P } = pr;
  const rows = [
    { z: -12.8, y: 2.0 },
    { z: -10.5, y: 1.0 },
    { z: -8.2, y: 0 },
  ];
  const fans: React.ReactNode[] = [];
  rows.forEach((r, ri) => {
    // the riser under the row: its top and its face
    if (r.y > 0) {
      fans.push(<polygon key={`rt${ri}`} points={poly(P, [[-34, r.y, r.z + 1.15], [34, r.y, r.z + 1.15], [34, r.y, r.z - 1.15], [-34, r.y, r.z - 1.15]])} fill="#11161E" />);
      fans.push(<polygon key={`rf${ri}`} points={poly(P, [[-34, 0, r.z + 1.15], [34, 0, r.z + 1.15], [34, r.y, r.z + 1.15], [-34, r.y, r.z + 1.15]])} fill="#0A0D12" />);
      fans.push(<polygon key={`rl${ri}`} points={poly(P, [[-34, r.y - 0.04, r.z + 1.15], [34, r.y - 0.04, r.z + 1.15], [34, r.y, r.z + 1.15], [-34, r.y, r.z + 1.15]])} fill="#3A4350" opacity={0.7} />);
    }
    for (let k = 0; k < 30; k++) {
      const x = -32 + k * 2.15 + ri * 0.7;
      if (Math.abs(x) < 4.2) continue; // the stanchion stands there
      const seed = ri * 211 + k * 17;
      const q = P([x, r.y + 1.55, r.z]);
      fans.push(
        <g key={`f${ri}-${k}`} transform={`translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) scale(${q.s.toFixed(3)})`}>
          <PossessionAtRimFan seed={seed} empty={rnd(seed + 9) < 0.1} />
        </g>,
      );
    }
  });

  const leds: React.ReactNode[] = [];
  for (const x0 of [-34, -28, -22, -16, -10, 4, 10, 16, 22, 28]) leds.push(<PossessionAtRimLed key={x0} pr={pr} x0={x0} z={-6.3} f={f} i={x0} />);

  const aim: V3 = [0, 10, 5.25];
  return (
    <g>
      <defs>
        <filter id="par-dof" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="1.3" />
        </filter>
        <linearGradient id="par-house" gradientUnits="userSpaceOnUse" x1={0} y1={P([0, 6, -12]).y} x2={0} y2={P([0, 0, -7]).y}>
          <stop offset="0" stopColor="#0D1117" stopOpacity={0.68} />
          <stop offset="1" stopColor="#0D1117" stopOpacity={0.22} />
        </linearGradient>
      </defs>
      {/* the seats sit a step out of focus behind the hoop, and a little darker than the floor */}
      <g filter="url(#par-dof)">
        {fans}
        <polygon points={poly(P, [[-34, 0, -14], [34, 0, -14], [34, 7, -14], [-34, 7, -14]])} fill="url(#par-house)" />
      </g>
      {/* the board's top cap and its glow on the apron */}
      <polygon points={poly(P, [[-34, 2.6, -6.3], [-4, 2.6, -6.3], [-4, 2.6, -6.9], [-34, 2.6, -6.9]])} fill="#1A2029" />
      <polygon points={poly(P, [[4, 2.6, -6.3], [34, 2.6, -6.3], [34, 2.6, -6.9], [4, 2.6, -6.9]])} fill="#1A2029" />
      <polygon points={poly(P, [[-34, 0, -6.3], [34, 0, -6.3], [34, 0, -4.6], [-34, 0, -4.6]])} fill="#7F93A8" opacity={0.08} />
      {leds}
      {/* the photographers along the baseline, either side of the stanchion */}
      <PossessionAtRimShooter pr={pr} x={-15.5} z={-2.7} seed={5} aim={aim} />
      <PossessionAtRimShooter pr={pr} x={-12.4} z={-2.4} seed={13} aim={aim} />
      <PossessionAtRimShooter pr={pr} x={-9.6} z={-2.8} seed={29} aim={aim} />
      <PossessionAtRimShooter pr={pr} x={9.8} z={-2.6} seed={41} aim={aim} />
      <PossessionAtRimShooter pr={pr} x={12.9} z={-2.5} seed={57} aim={aim} />
      <PossessionAtRimShooter pr={pr} x={16.2} z={-2.8} seed={63} aim={aim} />
    </g>
  );
};
