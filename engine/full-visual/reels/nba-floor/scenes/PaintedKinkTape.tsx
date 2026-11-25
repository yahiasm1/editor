// The reel's one tool, lying on its back on the apron, seen from above. Drawn from the Lufkin "Universal" 50 ft tape
// (photos/commons-lufkin-50ft-steel-tape-junkyardsparkle-cc0.jpg): a round case wrapped in red pebbled leather, a
// chrome band round the rim stamped THE LUFKIN RULE CO. / SAGINAW, MICH., a chrome face plate with UNIVERSAL on an arc
// and THE LUFKIN RULE CO. / SAGINAW, MICH. U.S.A. under it, a centre boss with its winding hole, the folding chrome
// crank with a ball knob, and the dark blued blade leaving through the slot with etched graduations and big black-on-
// steel numerals, ending in the bent wire ring.
import React from "react";

export const PaintedKinkTape: React.FC<{ x: number; y: number; r: number; lift: number; turn: number; f: number }> = ({ x, y, r, lift, turn, f }) => {
  const k = 1 + lift * 0.45; // closer to the lens while it falls
  const R = r * k;
  const sh = 4 + lift * 34; // the shadow opens as it rises
  const glint = 0.5 + 0.5 * Math.sin(f / 17);
  const id = "pk-tape";
  // blade: leaves the slot at the lower right, curls a little on the boards, ends in the ring
  const bladeW = R * 0.17;
  const ticks: React.ReactNode[] = [];
  const bl = R * 1.55; // blade length out of the case
  for (let i = 1; i <= 24; i++) {
    const t = i / 24;
    const big = i % 12 === 0;
    const mid = i % 6 === 0;
    ticks.push(<line key={i} x1={t * bl} y1={-bladeW / 2} x2={t * bl} y2={-bladeW / 2 + bladeW * (big ? 0.7 : mid ? 0.48 : 0.28)} stroke="#E8EDF2" strokeWidth={big ? 1.6 : 1} opacity={0.85} />);
  }
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, pointerEvents: "none" }}>
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
            <stop offset="0" stopColor="#4A5560" />
            <stop offset="0.5" stopColor="#2A323A" />
            <stop offset="1" stopColor="#3A444E" />
          </linearGradient>
          <radialGradient id={`${id}-shadow`}>
            <stop offset="0.55" stopColor="#000" stopOpacity="0.5" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <path id={`${id}-top`} d={`M ${-R * 0.47} 0 A ${R * 0.47} ${R * 0.47} 0 0 1 ${R * 0.47} 0`} />
          <path id={`${id}-bot`} d={`M ${-R * 0.5} 0 A ${R * 0.5} ${R * 0.5} 0 0 0 ${R * 0.5} 0`} />
          <path id={`${id}-rim`} d={`M ${-R * 0.92} 0 A ${R * 0.92} ${R * 0.92} 0 0 1 ${R * 0.92} 0`} />
        </defs>
        {/* shadow on the apron */}
        <ellipse cx={x + sh * 0.6} cy={y + sh} rx={R * 1.12} ry={R * 1.08} fill={`url(#${id}-shadow)`} opacity={1 - lift * 0.5} />
        <g transform={`translate(${x} ${y}) rotate(${turn})`}>
          {/* the blade on the boards, from the slot to the ring */}
          <g transform={`rotate(28) translate(${R * 0.8} ${R * 0.72})`}>
            <rect x={-R * 0.1} y={-bladeW / 2 + 3} width={bl + R * 0.1} height={bladeW} fill="#000" opacity={0.25} />
            <rect x={-R * 0.1} y={-bladeW / 2} width={bl + R * 0.1} height={bladeW} fill={`url(#${id}-blade)`} rx={1} />
            {ticks}
            <text x={bl * 0.5} y={bladeW * 0.34} fontFamily="Inter, sans-serif" fontWeight={700} fontSize={bladeW * 0.62} fill="#E8EDF2" textAnchor="middle">1</text>
            <text x={bl} y={bladeW * 0.34} fontFamily="Inter, sans-serif" fontWeight={700} fontSize={bladeW * 0.62} fill="#E8EDF2" textAnchor="end" dx={-3}>2</text>
            {/* the bent wire ring end */}
            <path d={`M ${bl} ${-bladeW * 0.42} L ${bl + R * 0.3} ${-bladeW * 0.9} L ${bl + R * 0.36} ${bladeW * 0.9} L ${bl} ${bladeW * 0.42}`} fill="none" stroke="#C8CDD2" strokeWidth={Math.max(2, R * 0.04)} strokeLinejoin="round" />
            <rect x={bl - R * 0.06} y={-bladeW * 0.55} width={R * 0.12} height={bladeW * 1.1} fill="#B9BEC4" rx={1} />
          </g>
          {/* case: chrome rim band, red pebbled leather */}
          <circle r={R} fill={`url(#${id}-band)`} />
          <circle r={R * 0.955} fill="#8C1A1E" filter={`url(#${id}-pebble)`} />
          <circle r={R * 0.955} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={1.2} />
          {/* the chrome face plate */}
          <circle r={R * 0.62} fill={`url(#${id}-chrome)`} stroke="#6E757C" strokeWidth={1} />
          <circle r={R * 0.585} fill="none" stroke="#2A2E33" strokeWidth={Math.max(1, R * 0.012)} />
          <text fontFamily="Inter, sans-serif" fontWeight={700} fontSize={R * 0.15} fill="#2A2E33" letterSpacing={R * 0.012}>
            <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">UNIVERSAL</textPath>
          </text>
          <text fontFamily="Inter, sans-serif" fontWeight={700} fontSize={R * 0.075} fill="#2A2E33" dy={R * 0.06}>
            <textPath href={`#${id}-bot`} startOffset="50%" textAnchor="middle">THE LUFKIN RULE CO.</textPath>
          </text>
          {/* centre boss, its winding hole */}
          <circle r={R * 0.3} fill="#D3D7DB" stroke="#8A9097" strokeWidth={1.2} />
          <circle r={R * 0.26} fill="none" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={1} />
          <circle cx={-R * 0.08} cy={R * 0.06} r={R * 0.075} fill="#16191C" />
          <circle cx={R * 0.1} cy={-R * 0.02} r={R * 0.018} fill="#4A5058" />
          {/* the folding crank: pivot, arm, ball knob */}
          <g transform="rotate(-24)">
            <rect x={-R * 0.07} y={-R * 0.1} width={R * 0.62} height={R * 0.17} rx={R * 0.05} fill={`url(#${id}-chrome)`} stroke="#6E757C" strokeWidth={1} />
            <circle cx={R * 0.0} cy={-R * 0.015} r={R * 0.09} fill="#E7EAED" stroke="#7B828A" strokeWidth={1} />
            <circle cx={R * 0.58} cy={-R * 0.015} r={R * 0.12} fill={`url(#${id}-chrome)`} stroke="#6E757C" strokeWidth={1} />
            <circle cx={R * 0.545} cy={-R * 0.055} r={R * 0.04} fill="#FFFFFF" opacity={0.6 + 0.4 * glint} />
          </g>
          {/* a highlight crossing the chrome band */}
          <path d={`M ${-R * 0.7} ${-R * 0.7} A ${R} ${R} 0 0 1 ${R * 0.2} ${-R * 0.98}`} fill="none" stroke="#FFFFFF" strokeOpacity={0.55 * glint} strokeWidth={R * 0.03} strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
