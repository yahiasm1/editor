// Scene `close`: the reel's steel tape (copied from PointsPerShotTape so it is the same object) working as a compass. Drawn from the Lufkin "Universal" 50 ft tape
// (photos/commons-lufkin-50ft-steel-tape-junkyardsparkle-cc0.jpg): the bent wire ring hooked over a pin at the middle
// of the basket, the dark blued blade with bright etched foot graduations and numerals, leaving the case TANGENT to
// its rim (as in the photo); the case in red pebbled leather with its chrome band, the chrome face plate (UNIVERSAL,
// THE LUFKIN RULE CO.), the boss and the folding crank with its ball knob. Gold glows under the blade: distance from
// the basket. The reading window magnifies the blade at the slot, reading in feet and inches.
import React from "react";
import { stFeetInches, stP, type ShortestThreeCam } from "./ShortestThreeWorld";

const GOLD = "#F2B33D";

export const ShortestThreeTape: React.FC<{
  cam: ShortestThreeCam;
  /** radians from the rim-level axis, ccw (pi/2 = straight up the floor) */
  angle: number;
  /** blade out, in feet: the reading */
  r: number;
  f: number;
  opacity: number;
  /** 0..1 the reading window */
  window: number;
  /** 0..1 a pulse of the gold under the blade */
  glow: number;
  /** where the reading window sits (screen px) */
  wx: number;
  wy: number;
  /** the window's size */
  scale?: number;
}> = ({ cam, angle, r, f, opacity, window: win, glow, wx, wy, scale = 1 }) => {
  if (opacity <= 0.001) return null;
  const p0 = stP(cam, 0, 0);
  const tipW = { x: r * Math.cos(angle), y: r * Math.sin(angle) };
  const p1 = stP(cam, tipW.x, tipW.y);
  const len = Math.hypot(p1.x - p0.x, p1.y - p0.y);
  const deg = (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI;
  const R = Math.max(34, Math.min(70, cam.ppf * 1.9));
  // the case rides on the ccw side of the blade, the blade entering its rim at the reading point
  const nW = { x: -Math.sin(angle), y: Math.cos(angle) };
  const c = stP(cam, tipW.x + (nW.x * R) / cam.ppf, tipW.y + (nW.y * R) / cam.ppf);
  const w = Math.max(9, Math.min(22, cam.ppf * 0.45));
  const ticks: React.ReactNode[] = [];
  const nFt = Math.floor(r);
  for (let i = 1; i <= nFt; i++) {
    const x = i * cam.ppf;
    ticks.push(<line key={`t${i}`} x1={x} y1={-w / 2} x2={x} y2={w * 0.15} stroke="#E8EDF2" strokeWidth={1.4} opacity={0.9} />);
    if (cam.ppf > 17 && i % (cam.ppf > 40 ? 1 : 2) === 0)
      ticks.push(
        <text key={`n${i}`} x={x - 2} y={w * 0.36} fontFamily="Inter, sans-serif" fontWeight={700} fontSize={w * 0.62} fill="#E8EDF2" textAnchor="end">
          {i}
        </text>,
      );
    if (cam.ppf > 50) for (let k = 1; k < 12; k++) ticks.push(<line key={`i${i}-${k}`} x1={x - (k * cam.ppf) / 12} y1={-w / 2} x2={x - (k * cam.ppf) / 12} y2={-w / 2 + w * (k === 6 ? 0.42 : 0.24)} stroke="#E8EDF2" strokeWidth={0.9} opacity={0.75} />);
  }
  const glint = 0.5 + 0.5 * Math.sin(f / 15);
  const id = "st-tape";
  // reading window: away from the floor's centre, kept on the stage
  const lx = wx;
  const ly = wy;
  const reading = stFeetInches(r);
  const inchPx = 26; // the window's magnification: an inch is 26 px
  const frac = r * 12;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity, pointerEvents: "none" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <filter id={`${id}-pebble`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency={1.3 / Math.max(1, R / 60)} numOctaves={2} seed={7} result="n" />
            <feDiffuseLighting in="n" surfaceScale={1.6} lightingColor="#ffffff" result="l">
              <feDistantLight azimuth={235} elevation={52} />
            </feDiffuseLighting>
            <feComposite in="l" in2="SourceGraphic" operator="arithmetic" k1={1.05} k2={0} k3={0} k4={0} result="t" />
            <feComposite in="t" in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={`${id}-glow`} x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation={w * 0.7} />
          </filter>
          <radialGradient id={`${id}-chrome`} cx="0.38" cy="0.32" r="0.8">
            <stop offset="0" stopColor="#FBFCFD" />
            <stop offset="0.45" stopColor="#C9CED3" />
            <stop offset="0.75" stopColor="#8E959C" />
            <stop offset="1" stopColor="#D7DBDF" />
          </radialGradient>
          <linearGradient id={`${id}-band`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F2F4F6" />
            <stop offset="0.5" stopColor="#8A9097" />
            <stop offset="1" stopColor="#DADDE0" />
          </linearGradient>
          <linearGradient id={`${id}-blade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#56626E" />
            <stop offset="0.45" stopColor="#2A323A" />
            <stop offset="1" stopColor="#3C4650" />
          </linearGradient>
          <radialGradient id={`${id}-shadow`}>
            <stop offset="0.55" stopColor="#000" stopOpacity="0.55" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <path id={`${id}-top`} d={`M ${-R * 0.47} 0 A ${R * 0.47} ${R * 0.47} 0 0 1 ${R * 0.47} 0`} />
          <path id={`${id}-bot`} d={`M ${-R * 0.5} 0 A ${R * 0.5} ${R * 0.5} 0 0 0 ${R * 0.5} 0`} />
        </defs>
        {/* the blade, ring end on the pin at the basket */}
        <g transform={`translate(${p0.x} ${p0.y}) rotate(${deg})`}>
          <rect x={0} y={-w * 1.4} width={len} height={w * 2.8} fill={GOLD} opacity={0.5 + 0.35 * glow} filter={`url(#${id}-glow)`} />
          <rect x={0} y={-w / 2 + 3} width={len} height={w} fill="#000" opacity={0.3} />
          <rect x={0} y={-w / 2} width={len} height={w} fill={`url(#${id}-blade)`} />
          <rect x={0} y={w / 2 - 1.2} width={len} height={1.2} fill={GOLD} opacity={0.9} />
          <rect x={0} y={-w / 2} width={len} height={1} fill="#9AA6B2" opacity={0.6} />
          {ticks}
          {/* the bent wire ring over the pin */}
          <path d={`M ${w * 0.9} ${-w * 0.45} L ${-w * 0.55} ${-w * 0.95} L ${-w * 0.6} ${w * 0.95} L ${w * 0.9} ${w * 0.45}`} fill="none" stroke="#C8CDD2" strokeWidth={Math.max(2, w * 0.22)} strokeLinejoin="round" />
          <rect x={w * 0.6} y={-w * 0.6} width={w * 0.5} height={w * 1.2} rx={1} fill="#B9BEC4" />
        </g>
        <circle cx={p0.x} cy={p0.y} r={Math.max(3.5, w * 0.32)} fill="#D9DDE1" stroke="#5A626B" strokeWidth={1.2} />
        {/* the case */}
        <ellipse cx={c.x + 7} cy={c.y + 10} rx={R * 1.12} ry={R * 1.08} fill={`url(#${id}-shadow)`} />
        <g transform={`translate(${c.x} ${c.y}) rotate(${deg})`}>
          <circle r={R} fill={`url(#${id}-band)`} />
          <circle r={R * 0.955} fill="#8C1A1E" filter={`url(#${id}-pebble)`} />
          <circle r={R * 0.955} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={1.2} />
          <circle r={R * 0.62} fill={`url(#${id}-chrome)`} stroke="#6E757C" strokeWidth={1} />
          <circle r={R * 0.585} fill="none" stroke="#2A2E33" strokeWidth={Math.max(1, R * 0.012)} />
          <text fontFamily="Inter, sans-serif" fontWeight={700} fontSize={R * 0.15} fill="#2A2E33" letterSpacing={R * 0.012}>
            <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">UNIVERSAL</textPath>
          </text>
          <text fontFamily="Inter, sans-serif" fontWeight={700} fontSize={R * 0.075} fill="#2A2E33" dy={R * 0.06}>
            <textPath href={`#${id}-bot`} startOffset="50%" textAnchor="middle">THE LUFKIN RULE CO.</textPath>
          </text>
          <circle r={R * 0.3} fill="#D3D7DB" stroke="#8A9097" strokeWidth={1.2} />
          <circle cx={-R * 0.08} cy={R * 0.06} r={R * 0.075} fill="#16191C" />
          {/* the crank turns as blade pays out: one turn per 1.3 ft */}
          <g transform={`rotate(${((r / 1.3) * 360) % 360})`}>
            <rect x={-R * 0.07} y={-R * 0.1} width={R * 0.62} height={R * 0.17} rx={R * 0.05} fill={`url(#${id}-chrome)`} stroke="#6E757C" strokeWidth={1} />
            <circle cx={0} cy={-R * 0.015} r={R * 0.09} fill="#E7EAED" stroke="#7B828A" strokeWidth={1} />
            <circle cx={R * 0.58} cy={-R * 0.015} r={R * 0.12} fill={`url(#${id}-chrome)`} stroke="#6E757C" strokeWidth={1} />
            <circle cx={R * 0.545} cy={-R * 0.055} r={R * 0.04} fill="#FFFFFF" opacity={0.6 + 0.4 * glint} />
          </g>
          {/* the slot where the blade enters, on the rim facing the basket */}
          <rect x={-R * 0.22} y={R * 0.9} width={R * 0.44} height={R * 0.14} rx={2} fill="#1A1C20" />
          <path d={`M ${-R * 0.7} ${-R * 0.7} A ${R} ${R} 0 0 1 ${R * 0.2} ${-R * 0.98}`} fill="none" stroke="#FFFFFF" strokeOpacity={0.5 * glint} strokeWidth={R * 0.03} strokeLinecap="round" />
        </g>
      </svg>
      {win > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: lx - 140,
            top: ly - 66,
            width: 280,
            height: 132,
            borderRadius: 22,
            background: "rgba(22,27,34,0.94)",
            border: "1.5px solid #30363D",
            boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
            opacity: win,
            transform: `scale(${(0.85 + 0.15 * win) * scale})`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 0, right: 0, top: 10, textAlign: "center", fontFamily: "Figtree, sans-serif", fontWeight: 700, fontSize: 56, color: GOLD, fontVariantNumeric: "tabular-nums", letterSpacing: -1 }}>
            {reading}
          </div>
          {/* the blade at the slot, magnified: inch ticks running past a hairline index */}
          <svg width={280} height={46} style={{ position: "absolute", left: 0, top: 80 }}>
            <rect x={0} y={4} width={280} height={38} fill="#2E3740" />
            <rect x={0} y={4} width={280} height={2} fill="#7C8894" />
            {Array.from({ length: 16 }, (_, k) => {
              const inch = Math.floor(frac) - 7 + k;
              if (inch < 0) return null;
              const x = 140 + (inch - frac) * inchPx;
              const foot = inch % 12 === 0;
              return (
                <g key={k}>
                  <line x1={x} y1={4} x2={x} y2={foot ? 40 : inch % 6 === 0 ? 28 : 20} stroke="#E8EDF2" strokeWidth={foot ? 2.4 : 1.4} />
                  {foot && (
                    <text x={x + 4} y={38} fontFamily="Inter, sans-serif" fontWeight={800} fontSize={17} fill="#E8EDF2">
                      {inch / 12}
                    </text>
                  )}
                </g>
              );
            })}
            <rect x={139} y={0} width={2.5} height={46} fill="#E0473C" />
          </svg>
        </div>
      )}
    </div>
  );
};
