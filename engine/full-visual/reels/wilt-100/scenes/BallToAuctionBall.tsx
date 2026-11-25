// wilt-100 "ball": the 1962 leather ball, drawn as a real sphere. Eight panels (the equator and the meridian, two
// side seams as small circles at x = +-0.7), narrow dark seam channels with a lighter leather lip, pebble grain,
// light from upper left (as on the Spalding ball in the 1959 photo), a hand-darkened band, scuffs and a worn stamp
// smudge that turn with the ball, so it is recognisably the same ball under glass.
import React from "react";
import { BTA_AMBER, btaApply, btaClamp, btaRnd, type M3 } from "./BallToAuctionKit";

type V3 = [number, number, number];

const SEAMS: V3[][] = (() => {
  const n = 120;
  const ring = (fn: (t: number) => V3) => Array.from({ length: n + 1 }, (_, i) => fn((i / n) * Math.PI * 2));
  const rho = Math.sqrt(1 - 0.7 * 0.7);
  return [
    ring((t) => [Math.cos(t), 0, Math.sin(t)]),
    ring((t) => [0, Math.cos(t), Math.sin(t)]),
    ring((t) => [0.7, rho * Math.cos(t), rho * Math.sin(t)]),
    ring((t) => [-0.7, rho * Math.cos(t), rho * Math.sin(t)]),
  ];
})();

const norm = (p: V3): V3 => {
  const l = Math.hypot(p[0], p[1], p[2]);
  return [p[0] / l, p[1] / l, p[2] / l];
};

// scuffs: short pale scratches at fixed places on the leather (direction on the sphere + a tangent drift)
const SCUFFS: { p: V3; d: V3; len: number; w: number }[] = [
  { p: norm([0.35, -0.45, 0.82]), d: [0.9, 0.3, 0], len: 0.22, w: 1 },
  { p: norm([0.38, -0.4, 0.83]), d: [0.8, 0.5, 0], len: 0.14, w: 0.7 },
  { p: norm([-0.5, 0.25, 0.83]), d: [0.2, 1, 0], len: 0.18, w: 0.9 },
  { p: norm([0.15, 0.55, 0.82]), d: [1, -0.2, 0], len: 0.12, w: 0.8 },
  { p: norm([-0.2, -0.7, 0.68]), d: [1, 0.1, 0.2], len: 0.16, w: 0.8 },
  { p: norm([0.6, 0.35, -0.72]), d: [0.3, 1, 0], len: 0.2, w: 1 },
  { p: norm([-0.55, -0.3, -0.78]), d: [1, 0.4, 0], len: 0.15, w: 0.8 },
];
// the worn ink smudge of an old stamp (not copied: a few broken dabs) on one panel
const STAMP: V3[] = Array.from({ length: 18 }, (_, i) => norm([0.22 + (i % 6) * 0.055, -0.18 + Math.floor(i / 6) * 0.05 + btaRnd(i) * 0.02, 0.95]));

export const BallToAuctionBall: React.FC<{
  id: string;
  cx: number;
  cy: number;
  r: number;
  R: M3;
  sx?: number;
  sy?: number;
  amber?: number;
  light?: number;
}> = ({ id, cx, cy, r, R, sx = 1, sy = 1, amber = 0, light = 1 }) => {
  const P = (v: V3) => btaApply(R, v);
  const seamW = Math.max(0.8, r * 0.03);
  const seams: React.ReactNode[] = [];
  SEAMS.forEach((ring, si) => {
    for (let i = 0; i < ring.length - 1; i++) {
      const a = P(ring[i]);
      const b = P(ring[i + 1]);
      const z = (a[2] + b[2]) / 2;
      if (z <= 0.02) continue;
      const o = btaClamp(z * 3);
      const w = seamW * (0.45 + 0.55 * Math.sqrt(z));
      const x1 = a[0] * r, y1 = a[1] * r, x2 = b[0] * r, y2 = b[1] * r;
      seams.push(
        <g key={`${si}-${i}`} opacity={o}>
          <line x1={x1 + w * 0.35} y1={y1 + w * 0.45} x2={x2 + w * 0.35} y2={y2 + w * 0.45} stroke="rgba(255,206,160,0.22)" strokeWidth={w * 1.6} strokeLinecap="round" />
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1A0D06" strokeWidth={w} strokeLinecap="round" />
        </g>,
      );
    }
  });
  const scuffs = SCUFFS.map((s, i) => {
    const a = P(s.p);
    if (a[2] < 0.12) return null;
    const e = P(norm([s.p[0] + s.d[0] * s.len, s.p[1] + s.d[1] * s.len, s.p[2] + s.d[2] * s.len]));
    const mid = P(norm([s.p[0] + s.d[0] * s.len * 0.5 + 0.02, s.p[1] + s.d[1] * s.len * 0.5 - 0.02, s.p[2]]));
    return (
      <path
        key={i}
        d={`M ${a[0] * r} ${a[1] * r} Q ${mid[0] * r} ${mid[1] * r} ${e[0] * r} ${e[1] * r}`}
        stroke="rgba(236,196,150,0.55)"
        strokeWidth={Math.max(0.6, r * 0.012 * s.w)}
        fill="none"
        strokeLinecap="round"
        opacity={btaClamp((a[2] - 0.12) * 3)}
      />
    );
  });
  const stamp = STAMP.map((v, i) => {
    const a = P(v);
    if (a[2] < 0.2 || btaRnd(i * 3.3) < 0.3) return null;
    return <ellipse key={i} cx={a[0] * r} cy={a[1] * r} rx={r * 0.016 * (0.6 + btaRnd(i))} ry={r * 0.012 * a[2]} fill="rgba(30,14,6,0.5)" opacity={btaClamp((a[2] - 0.2) * 2)} />;
  });
  return (
    <g transform={`translate(${cx} ${cy}) scale(${sx} ${sy})`}>
      <defs>
        <radialGradient id={`${id}Body`} cx={-0.32 * r} cy={-0.38 * r} r={r * 1.45} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D8945A" />
          <stop offset="0.3" stopColor="#B06A38" />
          <stop offset="0.62" stopColor="#7A4220" />
          <stop offset="0.9" stopColor="#3E1F0D" />
          <stop offset="1" stopColor="#24110A" />
        </radialGradient>
        <radialGradient id={`${id}Rim`} cx={0} cy={0} r={r} gradientUnits="userSpaceOnUse">
          <stop offset="0.78" stopColor="rgba(0,0,0,0)" />
          <stop offset="1" stopColor="rgba(8,4,2,0.6)" />
        </radialGradient>
        <radialGradient id={`${id}Bounce`} cx={0.2 * r} cy={0.95 * r} r={r * 0.8} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgba(255,190,120,0.28)" />
          <stop offset="1" stopColor="rgba(255,190,120,0)" />
        </radialGradient>
        <filter id={`${id}Grain`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency={Math.min(1.4, 120 / Math.max(20, r))} numOctaves={2} seed={7} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.05  0 0 0 0 0.02  -2.4 0 0 0 1.3" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id={`${id}Glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={Math.max(2, r * 0.06)} />
        </filter>
        <clipPath id={`${id}Clip`}>
          <circle cx={0} cy={0} r={r} />
        </clipPath>
      </defs>
      {amber > 0.002 && <circle cx={0} cy={0} r={r * 1.04} fill="none" stroke={BTA_AMBER} strokeWidth={Math.max(2, r * 0.07)} opacity={0.75 * amber} filter={`url(#${id}Glow)`} />}
      <circle cx={0} cy={0} r={r} fill={`url(#${id}Body)`} />
      <g clipPath={`url(#${id}Clip)`}>
        {/* the pebbled grain, darker in the pits */}
        <rect x={-r} y={-r} width={r * 2} height={r * 2} fill="#000" filter={`url(#${id}Grain)`} opacity={0.42} />
        {/* the band where hands held it for years */}
        <ellipse cx={r * 0.25} cy={r * 0.15} rx={r * 0.55} ry={r * 0.95} fill="rgba(40,18,6,0.16)" transform={`rotate(-28 ${r * 0.25} ${r * 0.15})`} />
        {stamp}
        {seams}
        {scuffs}
        {/* light: a soft matte hot spot, warm bounce from the floor, the dark limb */}
        <ellipse cx={-r * 0.36} cy={-r * 0.42} rx={r * 0.34} ry={r * 0.24} fill="rgba(255,226,190,0.2)" transform={`rotate(-30 ${-r * 0.36} ${-r * 0.42})`} opacity={light} />
        <ellipse cx={-r * 0.4} cy={-r * 0.46} rx={r * 0.12} ry={r * 0.08} fill="rgba(255,240,220,0.22)" transform={`rotate(-30 ${-r * 0.4} ${-r * 0.46})`} opacity={light} />
        <circle cx={0} cy={0} r={r} fill={`url(#${id}Bounce)`} />
        <circle cx={0} cy={0} r={r} fill={`url(#${id}Rim)`} />
      </g>
      {amber > 0.002 && <circle cx={0} cy={0} r={r + Math.max(1, r * 0.012)} fill="none" stroke={BTA_AMBER} strokeWidth={Math.max(1.2, r * 0.018)} opacity={amber} />}
    </g>
  );
};
