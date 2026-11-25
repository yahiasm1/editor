// wilt-100 "photo": the developer tray (white enamel, dark rolled rim, pouring spout, ribbed floor, a skin of
// developer), the print (photo paper at the real 2276 x 2879 proportion, white border) that falls into it blank and
// later develops into the real AP photo, darkest tones first, and the bamboo print tongs that lift it out dripping.
import React from "react";
import { PD_DIM, pdClamp, pdLerp, pdRnd, type PhotoT } from "./PhotoDevelopingKit";

// tray, seen from straight above in its own units; squashed by S on screen
export const PD_TRAY = { w: 600, h: 720, rim: 24 };
export const PD_PRINT = { w: 460, h: 582, border: 20 };

export type TrayView = { cx: number; cy: number; s: number; S: number };

export const PhotoDevelopingTrayDefs: React.FC<{ amp: number; gamma: number }> = ({ amp, gamma }) => (
  <defs>
    <linearGradient id="pdEnamel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#F2EFE7" />
      <stop offset="1" stopColor="#CFCBC0" />
    </linearGradient>
    <linearGradient id="pdLiquid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="rgba(120,108,72,0.55)" />
      <stop offset="1" stopColor="rgba(150,136,92,0.38)" />
    </linearGradient>
    <linearGradient id="pdWet" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="rgba(255,255,255,0.0)" />
      <stop offset="0.42" stopColor="rgba(255,255,255,0.0)" />
      <stop offset="0.5" stopColor="rgba(255,255,255,0.32)" />
      <stop offset="0.58" stopColor="rgba(255,255,255,0.0)" />
      <stop offset="1" stopColor="rgba(255,255,255,0.0)" />
    </linearGradient>
    {/* the developer at work: a print's darkness is d = 1 - lum; shown darkness = amp * d^gamma, so with a high gamma
        only the darkest tones (hair, lettering, the marker) are there, then the mid tones come up */}
    <filter id="pdDevelop" colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values="-0.299 -0.587 -0.114 0 1  -0.299 -0.587 -0.114 0 1  -0.299 -0.587 -0.114 0 1  0 0 0 1 0" />
      <feComponentTransfer>
        <feFuncR type="gamma" amplitude={amp.toFixed(4)} exponent={gamma.toFixed(4)} offset="0" />
        <feFuncG type="gamma" amplitude={amp.toFixed(4)} exponent={gamma.toFixed(4)} offset="0" />
        <feFuncB type="gamma" amplitude={amp.toFixed(4)} exponent={gamma.toFixed(4)} offset="0" />
      </feComponentTransfer>
      <feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" />
    </filter>
  </defs>
);

/** the tray, back to front: outer shadow, the enamel walls seen in depth, the rolled rim with its dark edge line and
 *  spout, the floor with its low ribs, then the developer filling it */
export const PhotoDevelopingTray: React.FC<{ V: TrayView; f: number; o?: number }> = ({ V, f, o = 1 }) => {
  const { w, h, rim } = PD_TRAY;
  const iw = w - rim * 2, ih = h - rim * 2;
  const depth = (64 * (1 - V.S)) / V.S; // how much of the walls the eye sees: more the flatter we look
  const front = (52 * (1 - V.S)) / V.S;
  const sh = Math.sin(f / 40) * 4;
  return (
    <g transform={`translate(${V.cx} ${V.cy}) scale(${V.s} ${V.s * V.S})`} opacity={o}>
      <rect x={-w / 2 + 10 + sh} y={-h / 2 + 40} width={w} height={h + front} rx={30} fill="rgba(0,0,0,0.6)" filter="url(#pdSoft)" />
      {/* the outer front wall below the rim, a little darker, with the light along its top */}
      <rect x={-w / 2 + 6} y={h / 2 - 30} width={w - 12} height={front + 30} rx={22} fill="#A8A397" />
      <rect x={-w / 2 + 6} y={h / 2 + front - 10} width={w - 12} height={10} rx={5} fill="#7D786D" />
      {/* the rim */}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={28} fill="url(#pdEnamel)" />
      <rect x={-w / 2 + 3} y={-h / 2 + 3} width={w - 6} height={h - 6} rx={26} fill="none" stroke="#1F2A44" strokeWidth={6} />
      <path d={`M ${-w / 2 + 3} ${-h / 2 + 40} Q ${-w / 2 - 12} ${-h / 2 - 12} ${-w / 2 + 40} ${-h / 2 + 3}`} fill="#ECE8DE" stroke="#1F2A44" strokeWidth={5} strokeLinecap="round" />
      {/* inside: the far wall (seen), the side walls, the floor */}
      <rect x={-iw / 2} y={-ih / 2} width={iw} height={ih} rx={16} fill="#C7C2B6" />
      <rect x={-iw / 2 + 6} y={-ih / 2 + depth} width={iw - 12} height={ih - depth - 4} rx={12} fill="#DAD5CA" />
      {[-0.3, 0, 0.3].map((k) => (
        <rect key={k} x={k * iw - 3} y={-ih / 2 + depth + 40} width={6} height={ih - depth - 90} rx={3} fill="rgba(0,0,0,0.05)" />
      ))}
      {/* developer: a warm skin of liquid with its meniscus along the walls */}
      <rect x={-iw / 2 + 2} y={-ih / 2 + depth * 0.55} width={iw - 4} height={ih - depth * 0.55 - 2} rx={14} fill="url(#pdLiquid)" />
      <rect x={-iw / 2 + 4} y={-ih / 2 + depth * 0.55} width={iw - 8} height={ih - depth * 0.55 - 6} rx={13} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3} />
      {/* chips in the enamel */}
      {[0.12, 0.37, 0.71, 0.9].map((k, i) => (
        <circle key={i} cx={-w / 2 + k * w} cy={i % 2 ? h / 2 - 11 : -h / 2 + 12} r={3 + pdRnd(i) * 3} fill="#2E3445" opacity={0.75} />
      ))}
    </g>
  );
};

/** the liquid surface over the print: ripples from a landing, the bulb's reflection wobbling */
export const PhotoDevelopingLiquid: React.FC<{ V: TrayView; f: number; land: number; fade: number }> = ({ V, f, land, fade }) => {
  const { w, h, rim } = PD_TRAY;
  const iw = w - rim * 2, ih = h - rim * 2;
  const since = f - land;
  const rings = since >= 0 ? [0, 9, 18, 30] : [];
  return (
    <g transform={`translate(${V.cx} ${V.cy}) scale(${V.s} ${V.s * V.S})`} opacity={fade}>
      <clipPath id="pdInner">
        <rect x={-iw / 2} y={-ih / 2} width={iw} height={ih} rx={16} />
      </clipPath>
      <g clipPath="url(#pdInner)">
        <rect x={-iw / 2} y={-ih / 2} width={iw} height={ih} fill="rgba(150,135,90,0.2)" />
        {rings.map((d, i) => {
          const t = since - d;
          if (t < 0) return null;
          const r = 30 + t * 9;
          const o = pdClamp(1 - t / 70) * 0.5;
          return <ellipse key={i} cx={0} cy={10} rx={r * 1.05} ry={r * 1.15} fill="none" stroke={`rgba(255,255,255,${o.toFixed(3)})`} strokeWidth={3} />;
        })}
        {/* the bulb overhead, reflected and wobbling */}
        <ellipse cx={-60 + Math.sin(f / 9) * 8} cy={-ih / 2 + 120 + Math.sin(f / 7) * 5} rx={90} ry={60} fill="rgba(255,248,225,0.18)" />
        <ellipse cx={-60 + Math.sin(f / 9) * 8} cy={-ih / 2 + 120 + Math.sin(f / 7) * 5} rx={24} ry={16} fill="rgba(255,250,235,0.35)" />
        {/* slow surface glints */}
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M ${-iw / 2 + 40 + i * 80 + Math.sin(f / 13 + i) * 14} ${-ih / 2 + 200 + i * 60} q 30 -6 60 0`} stroke="rgba(255,255,255,0.10)" strokeWidth={3} fill="none" />
        ))}
      </g>
    </g>
  );
};

/** where the print is, in screen space: in the tray (squashed with it) or lifted (lift 0..1) */
export function pdPrintView(V: TrayView, lift: number) {
  const up = { cx: 540, cy: 960, s: 1.38, S: 1, rot: -2.5 };
  return {
    cx: pdLerp(V.cx, up.cx, lift),
    cy: pdLerp(V.cy + 10 * V.s * V.S, up.cy, lift) - Math.sin(lift * Math.PI) * 60,
    s: pdLerp(V.s, up.s, lift),
    S: pdLerp(V.S, up.S, lift),
    rot: pdLerp(0, up.rot, lift),
  };
}

/** the print itself: blank photo paper, then the real photo coming up out of it */
export const PhotoDevelopingPrint: React.FC<{ P: ReturnType<typeof pdPrintView>; dev: number; wet: number; src: string }> = ({ P, dev, wet, src }) => {
  const { w, h, border } = PD_PRINT;
  return (
    <g transform={`translate(${P.cx} ${P.cy}) rotate(${P.rot}) scale(${P.s} ${P.s * P.S})`}>
      <rect x={-w / 2 + 8} y={-h / 2 + 14} width={w} height={h} fill="rgba(0,0,0,0.45)" filter="url(#pdSoft)" opacity={0.4 + 0.6 * (1 - P.S) + 0.6 * pdClamp((P.s - 1) * 2)} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#F6F4EE" />
      {dev > 0.001 && <image href={src} x={-w / 2 + border} y={-h / 2 + border} width={w - border * 2} height={h - border * 2} preserveAspectRatio="xMidYMid slice" filter="url(#pdDevelop)" />}
      {/* photo paper's faint sheen, and the wet film running off it */}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="url(#pdWet)" opacity={wet} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={1.5} />
    </g>
  );
};

/** bamboo print tongs gripping the print's top right corner, coming in from the upper right */
export const PhotoDevelopingTongs: React.FC<{ P: ReturnType<typeof pdPrintView>; o: number }> = ({ P, o }) => {
  if (o <= 0.001) return null;
  const { w, h } = PD_PRINT;
  return (
    <g transform={`translate(${P.cx} ${P.cy}) rotate(${P.rot}) scale(${P.s})`} opacity={o}>
      <g transform={`translate(${w / 2 - 40} ${-h / 2 + 18}) rotate(-38)`}>
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(0 ${sd * 6})`}>
            <rect x={0} y={-7} width={420} height={14} rx={5} fill={sd < 0 ? "#C9A96B" : "#B08F55"} />
            <rect x={0} y={-7} width={420} height={3} rx={1.5} fill="rgba(255,240,200,0.45)" />
            {/* nodes of the bamboo */}
            {[140, 290].map((nx) => <rect key={nx} x={nx} y={-8} width={4} height={16} fill="rgba(80,55,20,0.45)" />)}
            {/* the rubber tip */}
            <rect x={-6} y={-8} width={34} height={16} rx={6} fill="#2A2A2A" />
          </g>
        ))}
      </g>
    </g>
  );
};

/** drips falling off the bottom edge of the lifted print */
export const PhotoDevelopingDrips: React.FC<{ P: ReturnType<typeof pdPrintView>; f: number; from: number }> = ({ P, f, from }) => {
  if (f < from) return null;
  const { w, h } = PD_PRINT;
  const drops: React.ReactNode[] = [];
  for (let i = 0; i < 14; i++) {
    const t0 = from + i * 2.5 + pdRnd(i) * 4;
    const t = f - t0;
    if (t < 0 || t > 40) continue;
    const x0 = (-0.45 + 0.9 * pdRnd(i * 3.1)) * w * P.s;
    const y = (h / 2) * P.s + 0.5 * 1.1 * t * t;
    drops.push(<ellipse key={i} cx={x0} cy={y} rx={3.2} ry={4.6 + Math.min(6, t * 0.4)} fill="rgba(225,235,240,0.55)" />);
  }
  return <g transform={`translate(${P.cx} ${P.cy})`}>{drops}</g>;
};

export const PhotoDevelopingCredit: React.FC<{ o: number; font: string; y: number }> = ({ o, font, y }) => (
  <text x={540} y={y} textAnchor="middle" fontFamily={font} fontSize={30} fill={PD_DIM} opacity={o}>
    AP photo by Paul Vathis, public domain
  </text>
);
