// The reel's steel tape (the Lufkin "Universal" 50 ft of photos/commons-lufkin-50ft-steel-tape-junkyardsparkle-cc0.jpg),
// hooked on the pin at the middle of the basket, lying along rim level. Dark blued blade, bright etched graduations,
// the bent wire ring end, the red pebbled case with its chrome band, face plate, boss and folding crank. Under the
// macro lens the blade shows what a real 50 ft tape shows: eighths, quarters, halves, inch numerals 1-11 and a big
// foot numeral. The inches past 22' are etched in gold: the 21 in the corner gives away.
import React from "react";
import { LT_GOLD, ltFeetInches, ltP, type LtCam } from "./LeagueTableWorld";

export const LeagueTableTape: React.FC<{
  cam: LtCam;
  angle: number;
  r: number;
  f: number;
  opacity: number;
  window: number;
  /** where the reading window sits, screen px */
  win: { x: number; y: number };
  /** inches beyond this many feet are etched gold */
  goldFrom: number;
  /** 0..1 the gold glow under the blade */
  glow: number;
}> = ({ cam, angle, r, f, opacity, window: win, win: _w, goldFrom, glow }) => {
  if (opacity <= 0.001) return null;
  const p0 = ltP(cam, 0, 0);
  const tipW = { x: r * Math.cos(angle), y: r * Math.sin(angle) };
  const p1 = ltP(cam, tipW.x, tipW.y);
  const len = Math.hypot(p1.x - p0.x, p1.y - p0.y);
  const ux = (p1.x - p0.x) / Math.max(1e-6, len), uy = (p1.y - p0.y) / Math.max(1e-6, len);
  const deg = (Math.atan2(uy, ux) * 180) / Math.PI;
  const ppf = len / Math.max(1e-6, r);
  const R = Math.max(34, Math.min(70, ppf * 1.9));
  const w = Math.max(9, Math.min(44, ppf * 0.12));
  // the case rides beside the reading point, on the baseline side of the blade
  const nx = -uy * Math.sign(ux || 1), ny = ux * Math.sign(ux || 1);
  const c = { x: p1.x + nx * R * 1.02 + ux * R * 0.15, y: p1.y + Math.abs(ny) * R * 1.02 };
  const caseDeg = deg + (ux < 0 ? 180 : 0);
  // graduations: only what is on screen
  const ticks: React.ReactNode[] = [];
  const flip = ux < 0; // numerals stay upright when the blade runs left
  const vis = (d: number) => {
    const x = p0.x + ux * d * ppf, y = p0.y + uy * d * ppf;
    return x > -80 && x < 1160 && y > -80 && y < 2000;
  };
  if (ppf > 120) {
    const step = 1 / 96; // eighths of an inch
    const n = Math.floor(r / step + 1e-6);
    let first = 0;
    // skip to the first visible eighth
    const lo = Math.max(0, Math.floor((Math.min(...[0, 1080].map((sx) => ((sx - p0.x) * ux) / ppf)) - 1) / step));
    first = Math.max(0, lo);
    const hi = Math.min(n, Math.ceil((Math.max(...[0, 1080].map((sx) => ((sx - p0.x) * ux) / ppf)) + 1) / step));
    for (let k = first; k <= hi; k++) {
      const d = k * step;
      if (d > r) break;
      const e = k % 96 === 0 ? 1 : k % 8 === 0 ? 0.62 : k % 4 === 0 ? 0.42 : k % 2 === 0 ? 0.3 : 0.2;
      const x = d * ppf;
      const gold = d > goldFrom + 1e-6;
      const col = gold ? "#FFD06A" : "#E8EDF2";
      ticks.push(<line key={`t${k}`} x1={x} y1={-w / 2} x2={x} y2={-w / 2 + w * e} stroke={col} strokeWidth={k % 8 === 0 ? 2.2 : 1.3} opacity={0.95} />);
      if (k % 8 === 0 && k % 96 !== 0) {
        const inch = (k / 8) % 12;
        ticks.push(
          <text key={`n${k}`} x={0} y={0} transform={`translate(${x + (flip ? -3 : 3)} ${w * 0.4}) rotate(${flip ? 180 : 0})`} fontFamily="Inter, sans-serif" fontWeight={700} fontSize={w * 0.36} fill={col} textAnchor="start">
            {inch}
          </text>,
        );
      }
      if (k % 96 === 0 && k > 0) {
        const ft = k / 96;
        ticks.push(
          <g key={`f${k}`} transform={`translate(${x} ${0}) rotate(${flip ? 180 : 0})`}>
            <rect x={flip ? -w * 1.05 - 2 : 2} y={-w * 0.05} width={w * 1.05} height={w * 0.5} rx={2} fill={gold ? "#7A5A18" : "#7A1F1F"} opacity={0.9} />
            <text x={flip ? -w * 0.52 - 2 : w * 0.52 + 2} y={w * 0.38} fontFamily="Inter, sans-serif" fontWeight={800} fontSize={w * 0.42} fill={gold ? "#FFE3A3" : "#FFFFFF"} textAnchor="middle">
              {ft}
            </text>
          </g>,
        );
      }
    }
  } else {
    const nFt = Math.floor(r);
    for (let i = 1; i <= nFt; i++) {
      if (!vis(i)) continue;
      const x = i * ppf;
      ticks.push(<line key={`t${i}`} x1={x} y1={-w / 2} x2={x} y2={w * 0.15} stroke="#E8EDF2" strokeWidth={1.4} opacity={0.9} />);
      if (ppf > 40) for (let k = 1; k < 12; k++) ticks.push(<line key={`i${i}-${k}`} x1={x - (k * ppf) / 12} y1={-w / 2} x2={x - (k * ppf) / 12} y2={-w / 2 + w * (k === 6 ? 0.42 : 0.24)} stroke="#E8EDF2" strokeWidth={0.9} opacity={0.75} />);
    }
  }
  const glint = 0.5 + 0.5 * Math.sin(f / 15);
  const id = "lt-tape";
  const reading = ltFeetInches(r);
  const inchPx = 26;
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
        <g transform={`translate(${p0.x} ${p0.y}) rotate(${deg})`}>
          <rect x={0} y={-w * 1.4} width={len} height={w * 2.8} fill={LT_GOLD} opacity={0.35 + 0.4 * glow} filter={`url(#${id}-glow)`} />
          <rect x={0} y={-w / 2 + Math.max(3, w * 0.18)} width={len} height={w} fill="#000" opacity={0.3} />
          <rect x={0} y={-w / 2} width={len} height={w} fill={`url(#${id}-blade)`} />
          {/* the blued steel's sheen and its worn edges */}
          <rect x={0} y={-w / 2} width={len} height={Math.max(1, w * 0.06)} fill="#9AA6B2" opacity={0.6} />
          <rect x={0} y={w / 2 - Math.max(1.2, w * 0.05)} width={len} height={Math.max(1.2, w * 0.05)} fill={LT_GOLD} opacity={0.9} />
          {ticks}
          <path d={`M ${w * 0.9} ${-w * 0.45} L ${-w * 0.55} ${-w * 0.95} L ${-w * 0.6} ${w * 0.95} L ${w * 0.9} ${w * 0.45}`} fill="none" stroke="#C8CDD2" strokeWidth={Math.max(2, w * 0.22)} strokeLinejoin="round" />
          <rect x={w * 0.6} y={-w * 0.6} width={w * 0.5} height={w * 1.2} rx={1} fill="#B9BEC4" />
        </g>
        {vis(0) && <circle cx={p0.x} cy={p0.y} r={Math.max(3.5, w * 0.32)} fill="#D9DDE1" stroke="#5A626B" strokeWidth={1.2} />}
        <ellipse cx={c.x + 7} cy={c.y + 10} rx={R * 1.12} ry={R * 1.08} fill={`url(#${id}-shadow)`} />
        <g transform={`translate(${c.x} ${c.y}) rotate(${caseDeg})`}>
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
          <g transform={`rotate(${((r / 1.3) * 360) % 360})`}>
            <rect x={-R * 0.07} y={-R * 0.1} width={R * 0.62} height={R * 0.17} rx={R * 0.05} fill={`url(#${id}-chrome)`} stroke="#6E757C" strokeWidth={1} />
            <circle cx={0} cy={-R * 0.015} r={R * 0.09} fill="#E7EAED" stroke="#7B828A" strokeWidth={1} />
            <circle cx={R * 0.58} cy={-R * 0.015} r={R * 0.12} fill={`url(#${id}-chrome)`} stroke="#6E757C" strokeWidth={1} />
            <circle cx={R * 0.545} cy={-R * 0.055} r={R * 0.04} fill="#FFFFFF" opacity={0.6 + 0.4 * glint} />
          </g>
          <rect x={-R * 0.22} y={-R * 1.04} width={R * 0.44} height={R * 0.14} rx={2} fill="#1A1C20" />
          <path d={`M ${-R * 0.7} ${-R * 0.7} A ${R} ${R} 0 0 1 ${R * 0.2} ${-R * 0.98}`} fill="none" stroke="#FFFFFF" strokeOpacity={0.5 * glint} strokeWidth={R * 0.03} strokeLinecap="round" />
        </g>
      </svg>
      {win > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: _w.x - 140,
            top: _w.y - 66,
            width: 280,
            height: 132,
            borderRadius: 22,
            background: "rgba(22,27,34,0.94)",
            border: "1.5px solid #30363D",
            boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
            opacity: win,
            transform: `scale(${0.85 + 0.15 * win})`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 0, right: 0, top: 10, textAlign: "center", fontFamily: "Figtree, sans-serif", fontWeight: 700, fontSize: 56, color: LT_GOLD, fontVariantNumeric: "tabular-nums", letterSpacing: -1 }}>
            {reading}
          </div>
          <svg width={280} height={46} style={{ position: "absolute", left: 0, top: 80 }}>
            <rect x={0} y={4} width={280} height={38} fill="#2E3740" />
            <rect x={0} y={4} width={280} height={2} fill="#7C8894" />
            {Array.from({ length: 16 }, (_, k) => {
              const inch = Math.floor(frac) - 7 + k;
              if (inch < 0) return null;
              const x = 140 + (inch - frac) * inchPx;
              const foot = inch % 12 === 0;
              const g = inch > goldFrom * 12 + 1e-6;
              return (
                <g key={k}>
                  <line x1={x} y1={4} x2={x} y2={foot ? 40 : inch % 6 === 0 ? 28 : 20} stroke={g ? "#FFD06A" : "#E8EDF2"} strokeWidth={foot ? 2.4 : 1.4} />
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
