// The Lufkin "Universal" 50 ft steel tape (photos/commons-lufkin-50ft-steel-tape-junkyardsparkle-cc0.jpg), seen from
// above. The blade: dark blued steel, bright etched ticks on its upper edge (every inch up close, a longer one at 6 in,
// the longest at each foot), the foot numerals in black on a bright etched patch, the zero end a brass clip with a
// bent wire triangle. The case: red pebbled leather, a chrome rim band, the chrome face plate with UNIVERSAL on an arc,
// the centre boss and its winding hole, the folding crank with its ball knob.
// Gold (distance from the basket, the reel's one invisible thing) is light under the blade's edges, from the pin out.
import React from "react";
import { FFW_SIDE, type FfwProj } from "./FiftyFeetWideWorld";

const GOLD = "#F2B33D";

export type FfwBladeState = {
  /** where the blade ends (ft, the case's slot) */
  xf: number;
  /** sideways bow of the blade lying on the boards (ft at its middle) */
  bow: number;
  /** 0..1 the steel pin pressed down at the basket's middle (0 = not there, 1 = seated) */
  pin: number;
  /** height of the falling pin (ft) */
  pinZ: number;
  /** 0..1 how far the gold has run from the pin to each sideline */
  gold: number;
  /** 0..1 the etched 25 under the basket lit */
  mark: number;
};

const X0 = -FFW_SIDE; // the tape's zero sits on the inner edge of the left sideline

export const FiftyFeetWideBlade: React.FC<{ P: FfwProj; st: FfwBladeState; f: number }> = ({ P, st, f }) => {
  const len = st.xf - X0;
  if (len <= 0.02) return null;
  const s0 = P(0, 0).s;
  const w = Math.max(13, Math.min(68, 0.64 * s0));
  const yOf = (x: number) => st.bow * Math.sin(Math.PI * Math.max(0, Math.min(1, (x - X0) / Math.max(1, len))));
  // the blade's centre line on screen
  const N = 60;
  const pts = Array.from({ length: N + 1 }, (_, i) => {
    const x = X0 + (len * i) / N;
    return P(x, yOf(x));
  });
  const nrm = (i: number) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N, i + 1)];
    const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
    return [dy / l, -dx / l]; // points up the screen for a blade running right
  };
  const up: string[] = [], dn: string[] = [];
  pts.forEach((p, i) => {
    const [nx, ny] = nrm(i);
    up.push(`${(p.x + nx * w * 0.5).toFixed(1)} ${(p.y + ny * w * 0.5).toFixed(1)}`);
    dn.push(`${(p.x - nx * w * 0.5).toFixed(1)} ${(p.y - ny * w * 0.5).toFixed(1)}`);
  });
  const bladeD = `M${up.join("L")}L${dn.reverse().join("L")}Z`;
  const edge = (sign: number, xa: number, xb: number) => {
    const out: string[] = [];
    const n = 24;
    for (let i = 0; i <= n; i++) {
      const x = xa + ((xb - xa) * i) / n;
      const p = P(x, yOf(x));
      const q = P(x + 0.05, yOf(x + 0.05));
      const dx = q.x - p.x, dy = q.y - p.y, l = Math.hypot(dx, dy) || 1;
      out.push(`${(p.x + (dy / l) * w * 0.5 * sign).toFixed(1)} ${(p.y - (dx / l) * w * 0.5 * sign).toFixed(1)}`);
    }
    return `M${out.join("L")}`;
  };

  // graduations, only where they are on screen and big enough to see
  const inchPx = s0 / 12;
  const step = inchPx > 4 ? 1 : inchPx > 1.6 ? 6 : 12;
  let ticks = "";
  const nums: React.ReactNode[] = [];
  const nMax = Math.floor(len * 12);
  for (let i = 0; i <= nMax; i += step) {
    const x = X0 + i / 12;
    const p = P(x, yOf(x));
    if (p.x < -60 || p.x > 1140 || p.y < 300 || p.y > 1800) continue;
    const foot = i % 12 === 0, half = i % 6 === 0;
    const tl = w * (foot ? 0.62 : half ? 0.42 : 0.24);
    const [nx, ny] = nrm(Math.round(((x - X0) / len) * N));
    const ax = p.x + nx * w * 0.5, ay = p.y + ny * w * 0.5;
    ticks += `M${ax.toFixed(1)} ${ay.toFixed(1)}L${(ax - nx * tl).toFixed(1)} ${(ay - ny * tl).toFixed(1)}`;
    const n = i / 12;
    if (foot && n > 0 && n < 50 && s0 > 34) {
      const q = P(x + 0.5, yOf(x + 0.5));
      const fs = w * 0.52;
      const lit = n === 25 ? st.mark : 0;
      nums.push(
        <g key={`n${n}`} transform={`translate(${q.x.toFixed(1)} ${(q.y + w * 0.08).toFixed(1)})`}>
          <rect x={-fs * 0.62} y={-fs * 0.58} width={fs * 1.24} height={fs * 1.1} rx={2} fill="#C9CFD4" opacity={0.92} />
          {lit > 0 && <rect x={-fs * 0.62} y={-fs * 0.58} width={fs * 1.24} height={fs * 1.1} rx={2} fill="#FFFFFF" opacity={lit} />}
          <text x={0} y={fs * 0.36} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={fs} fill="#101317">{n}</text>
        </g>,
      );
    }
  }

  // the zero end: brass clip over the blade, a bent wire triangle hooked over the left sideline
  const z0 = P(X0, 0), zL = P(X0 - 0.55, 0);
  const hookW = Math.max(2, w * 0.13);
  const g = Math.max(0, Math.min(1, st.gold));
  const goldL = g > 0 ? edge(1, -FFW_SIDE * g, 0) + edge(-1, -FFW_SIDE * g, 0) : "";
  const goldR = g > 0 ? edge(1, 0, Math.min(st.xf, FFW_SIDE * g)) + edge(-1, 0, Math.min(st.xf, FFW_SIDE * g)) : "";
  const glint = ((f * 9) % 1400) - 200;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="ffw-blade" gradientUnits="userSpaceOnUse" x1={0} y1={pts[0].y - w / 2} x2={0} y2={pts[0].y + w / 2}>
          <stop offset="0" stopColor="#56616C" />
          <stop offset="0.45" stopColor="#2C343D" />
          <stop offset="1" stopColor="#3C4650" />
        </linearGradient>
        <linearGradient id="ffw-glint" gradientUnits="userSpaceOnUse" x1={glint} y1={0} x2={glint + 160} y2={0}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="ffw-gold" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation={Math.max(5, w * 0.28)} /></filter>
        <filter id="ffw-bshadow" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation={3} /></filter>
      </defs>
      {/* the blade's shadow on the boards */}
      <path d={bladeD} transform="translate(3 5)" fill="#000" opacity={0.3} filter="url(#ffw-bshadow)" />
      {/* gold light under the blade, from the pin outward */}
      {g > 0 && <path d={goldL + goldR} stroke={GOLD} strokeWidth={w * 0.9} fill="none" opacity={0.85} filter="url(#ffw-gold)" />}
      <path d={bladeD} fill="url(#ffw-blade)" />
      <path d={bladeD} fill="url(#ffw-glint)" />
      <path d={ticks} stroke="#E8EDF2" strokeWidth={Math.max(1, w * 0.06)} opacity={0.9} />
      {nums}
      {g > 0 && <path d={goldL + goldR} stroke={GOLD} strokeWidth={Math.max(2.5, w * 0.12)} fill="none" strokeLinecap="round" />}
      {/* zero end */}
      <path d={`M${z0.x} ${z0.y - w * 0.42} L${zL.x} ${z0.y - w * 0.95} L${zL.x - w * 0.1} ${z0.y + w * 0.95} L${z0.x} ${z0.y + w * 0.42}`} fill="none" stroke="#C8CDD2" strokeWidth={hookW} strokeLinejoin="round" />
      <rect x={z0.x - w * 0.12} y={z0.y - w * 0.6} width={w * 0.5} height={w * 1.2} rx={2} fill="#B8893A" stroke="#6E4F1C" strokeWidth={1} />
    </svg>
  );
};

/** the case from above, centre (x, y) px, radius R px, crank angle in degrees */
export const FiftyFeetWideCase: React.FC<{ x: number; y: number; R: number; crank: number; lift: number; f: number }> = ({ x, y, R, crank, lift, f }) => {
  const id = "ffw-case";
  const glint = 0.5 + 0.5 * Math.sin(f / 17);
  const sh = 5 + lift * 22;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <filter id={`${id}-pebble`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency={1.3 / Math.max(1, R / 60)} numOctaves={2} seed={11} result="n" />
          <feDiffuseLighting in="n" surfaceScale={1.6} lightingColor="#ffffff" result="l">
            <feDistantLight azimuth={235} elevation={52} />
          </feDiffuseLighting>
          <feComposite in="l" in2="SourceGraphic" operator="arithmetic" k1={1.05} k2={0} k3={0} k4={0} result="t" />
          <feComposite in="t" in2="SourceGraphic" operator="in" />
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
        <radialGradient id={`${id}-shadow`}>
          <stop offset="0.55" stopColor="#000" stopOpacity="0.5" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <path id={`${id}-top`} d={`M ${-R * 0.47} 0 A ${R * 0.47} ${R * 0.47} 0 0 1 ${R * 0.47} 0`} />
        <path id={`${id}-bot`} d={`M ${-R * 0.5} 0 A ${R * 0.5} ${R * 0.5} 0 0 0 ${R * 0.5} 0`} />
      </defs>
      <ellipse cx={x + sh * 0.5} cy={y + sh} rx={R * 1.12} ry={R * 1.08} fill={`url(#${id}-shadow)`} opacity={1 - lift * 0.4} />
      <g transform={`translate(${x} ${y})`}>
        {/* the slot the blade leaves through, at the bottom of the rim: the blade runs out tangent to the case */}
        <rect x={-R * 0.2} y={R * 0.88} width={R * 0.4} height={R * 0.2} rx={2} fill="#2A2E33" />
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
        <circle r={R * 0.26} fill="none" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={1} />
        <circle cx={-R * 0.08} cy={R * 0.06} r={R * 0.075} fill="#16191C" />
        <g transform={`rotate(${crank})`}>
          <rect x={-R * 0.07} y={-R * 0.1} width={R * 0.62} height={R * 0.17} rx={R * 0.05} fill={`url(#${id}-chrome)`} stroke="#6E757C" strokeWidth={1} />
          <circle cx={0} cy={-R * 0.015} r={R * 0.09} fill="#E7EAED" stroke="#7B828A" strokeWidth={1} />
          <circle cx={R * 0.58} cy={-R * 0.015} r={R * 0.12} fill={`url(#${id}-chrome)`} stroke="#6E757C" strokeWidth={1} />
          <circle cx={R * 0.545} cy={-R * 0.055} r={R * 0.04} fill="#FFFFFF" opacity={0.6 + 0.4 * glint} />
        </g>
        <path d={`M ${-R * 0.7} ${-R * 0.7} A ${R} ${R} 0 0 1 ${R * 0.2} ${-R * 0.98}`} fill="none" stroke="#FFFFFF" strokeOpacity={0.55 * glint} strokeWidth={R * 0.03} strokeLinecap="round" />
      </g>
    </svg>
  );
};

const bladeW = (P: FfwProj) => Math.max(13, Math.min(68, 0.64 * P(0, 0).s));

/** the etched 25 at the basket's middle, lit: drawn above the ring and net so it reads through the mesh */
export const FiftyFeetWideMark25: React.FC<{ P: FfwProj; a: number }> = ({ P, a }) => {
  if (a <= 0.001) return null;
  const w = bladeW(P);
  const q = P(0.5, 0);
  const fs = w * 0.62;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: a }}>
      <defs><filter id="ffw-m25" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={Math.max(4, w * 0.22)} /></filter></defs>
      <g transform={`translate(${q.x.toFixed(1)} ${(q.y + w * 0.08).toFixed(1)})`}>
        <rect x={-fs * 0.8} y={-fs * 0.72} width={fs * 1.6} height={fs * 1.36} rx={3} fill="#FFF6DC" opacity={0.75} filter="url(#ffw-m25)" />
        <rect x={-fs * 0.66} y={-fs * 0.6} width={fs * 1.32} height={fs * 1.14} rx={3} fill="#F4F6F8" stroke="#0D1117" strokeOpacity={0.5} strokeWidth={1.5} />
        <text x={0} y={fs * 0.36} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={fs} fill="#101317">25</text>
      </g>
    </svg>
  );
};

/** the steel pin falling onto the basket's middle and pinching the blade: drawn above the cross and the net */
export const FiftyFeetWidePin: React.FC<{ P: FfwProj; pinZ: number; a: number; seatAge: number }> = ({ P, pinZ, a, seatAge }) => {
  if (a <= 0.001) return null;
  const w = bladeW(P);
  const fl = P(0, 0);
  const at = P(0, 0, pinZ);
  const r = Math.max(9, 0.3 * at.s);
  const seated = seatAge >= 0;
  // the pinch: the blade's two edges pressed in toward the pin
  const pinch = seated ? Math.min(1, seatAge / 3) : 0;
  const dx = Math.max(r * 2.8, w * 0.9), dd = w * 0.3 * pinch;
  const ring = seated && seatAge < 16 ? seatAge / 16 : -1;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: a, overflow: "visible" }}>
      <defs>
        <radialGradient id="ffw-pinhead" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#C3C9CF" />
          <stop offset="1" stopColor="#6E767E" />
        </radialGradient>
      </defs>
      {pinch > 0 && (
        <g>
          {/* the blade's edges pressed in: the lane paint shows in each notch, the steel's bright edge follows the bend */}
          {[-1, 1].map((sg) => {
            const ey = fl.y + sg * w * 0.5;
            const iy = ey - sg * 2 * dd;
            return (
              <g key={sg}>
                <path d={`M${fl.x - dx} ${ey} Q ${fl.x} ${iy} ${fl.x + dx} ${ey} Z`} fill="#5E5954" />
                <path d={`M${fl.x - dx} ${ey} Q ${fl.x} ${iy} ${fl.x + dx} ${ey}`} stroke="#E8EDF2" strokeOpacity={0.9} strokeWidth={Math.max(1.5, w * 0.06)} fill="none" />
                <path d={`M${fl.x - dx} ${ey + sg * 2} Q ${fl.x} ${iy + sg * 4} ${fl.x + dx} ${ey + sg * 2}`} stroke="#000" strokeOpacity={0.35} strokeWidth={Math.max(2, w * 0.08)} fill="none" />
              </g>
            );
          })}
        </g>
      )}
      {ring >= 0 && <circle cx={fl.x} cy={fl.y} r={r * (1 + 2.4 * ring)} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.8 * (1 - ring)} />}
      <ellipse cx={fl.x + 3 + pinZ * 1.5} cy={fl.y + 5 + pinZ * 2} rx={r * (1 + pinZ * 0.05)} ry={r * 0.85 * (1 + pinZ * 0.05)} fill="#000" opacity={0.45 / (1 + pinZ * 0.3)} />
      <circle cx={at.x} cy={at.y} r={r} fill="url(#ffw-pinhead)" stroke="#2A2F36" strokeWidth={1.6} />
      <circle cx={at.x} cy={at.y} r={r * 0.34} fill="#8C949B" />
      <circle cx={at.x - r * 0.35} cy={at.y - r * 0.38} r={r * 0.18} fill="#FFFFFF" opacity={0.85} />
    </svg>
  );
};
