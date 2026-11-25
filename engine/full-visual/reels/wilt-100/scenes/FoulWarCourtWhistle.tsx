// wilt-100 "fouls": the official's whistle, redrawn from a photo of a metal pea whistle (Commons "Metal whistle.jpg",
// drawing reference only): nickel-chrome, a flat rectangular mouthpiece tube, the sound window cut on top where the
// tube meets the barrel, a round barrel whose side face is a darker flat disc in a polished rim, a ring soldered at
// the back and a braided black lanyard. It swings in big on "silly" and blows; then it docks at the right of the
// court and shrills on every foul. The pea rattles in the window when it blows.
import React from "react";
import { ease, prog } from "../../../src/engine";
import { type FoulWarT, fwcLerp, fwcRnd, fwcWhistles } from "./FoulWarCourtKit";

export const FoulWarCourtWhistle: React.FC<{ f: number; T: FoulWarT }> = ({ f, T }) => {
  const inK = prog(f, T.silly - 12, 12, ease.out);
  if (inK <= 0) return null;
  const dock = prog(f, T.the1 - 2, 20, ease.inOut);
  // big over the empty floor at the lower right (clear of the lane and the basket), then docked small at the top right
  const x = fwcLerp(fwcLerp(1300, 800, inK), 978, dock);
  const y = fwcLerp(fwcLerp(1230, 1310, inK), 600, dock);
  const sc = fwcLerp(1.02, 0.4, dock);
  const rot = fwcLerp(fwcLerp(-38, -12, inK), -20, dock);
  // a blow: the body shivers, breath and sound leave the window
  const blows = fwcWhistles(T);
  let blow = 0, since = 999;
  for (const at of blows) {
    const k = prog(f, at - 2, 3, ease.out) - prog(f, at + 14, 10, ease.in);
    if (k > blow) blow = k;
    if (f >= at - 2 && f - at < since) since = f - at;
  }
  const shake = blow * (dock > 0.5 ? 2.2 : 4.5);
  const sx = Math.sin(f * 2.7) * shake, sy = Math.cos(f * 3.3) * shake * 0.6;
  const ring = (i: number) => {
    const t = since < 999 ? (since + 2 - i * 4) / 18 : -1;
    if (t < 0 || t > 1) return null;
    const r = 26 + 70 * t;
    return (
      <path
        key={i}
        d={`M ${212 - r * 0.55} ${70 - r * 0.62} A ${r} ${r} 0 0 1 ${212 + r * 0.55} ${70 - r * 0.62}`}
        fill="none"
        stroke="#F4F4F2"
        strokeOpacity={(1 - t) * 0.9}
        strokeWidth={5 - 2 * t}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    );
  };
  const pea = blow > 0 ? (fwcRnd(Math.floor(f / 2)) - 0.5) * 10 : 0;
  return (
    <div
      style={{
        position: "absolute", left: x - 230 + sx, top: y - 130 + sy, width: 460, height: 260, transformOrigin: "230px 130px",
        transform: `rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`, opacity: Math.min(1, inK * 1.6),
        filter: `drop-shadow(0 ${(18 * (1 - dock) + 6).toFixed(0)}px ${(22 * (1 - dock) + 8).toFixed(0)}px rgba(0,0,0,0.55))`,
      }}
    >
      <svg width={460} height={260} viewBox="0 0 460 260" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="fwc-chrome-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6E737A" />
            <stop offset="0.12" stopColor="#F6F7F8" />
            <stop offset="0.24" stopColor="#B9BEC4" />
            <stop offset="0.5" stopColor="#3B3F45" />
            <stop offset="0.62" stopColor="#8D9299" />
            <stop offset="0.86" stopColor="#E9EBEE" />
            <stop offset="1" stopColor="#555A61" />
          </linearGradient>
          <radialGradient id="fwc-face" cx="0.42" cy="0.38" r="0.7">
            <stop offset="0" stopColor="#4A4F56" />
            <stop offset="0.6" stopColor="#1F2226" />
            <stop offset="1" stopColor="#0E1012" />
          </radialGradient>
          <linearGradient id="fwc-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.3" stopColor="#9DA2A9" />
            <stop offset="0.55" stopColor="#3A3E44" />
            <stop offset="0.8" stopColor="#D6D9DD" />
            <stop offset="1" stopColor="#6B7077" />
          </linearGradient>
          <pattern id="fwc-braid" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="10" height="10" fill="#101112" />
            <rect width="5" height="10" fill="#2A2C2F" />
          </pattern>
        </defs>
        {/* the lanyard, braided cord through the ring, trailing off */}
        <path d="M 378 92 C 420 70, 470 120, 520 150 S 640 230, 760 210" fill="none" stroke="url(#fwc-braid)" strokeWidth={13} strokeLinecap="round" />
        <path d="M 378 92 C 420 70, 470 120, 520 150 S 640 230, 760 210" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={2} transform="translate(0,-4)" />
        {/* the ring soldered on the back of the barrel */}
        <ellipse cx={372} cy={92} rx={20} ry={14} fill="none" stroke="url(#fwc-rim)" strokeWidth={7} transform="rotate(-20 372 92)" />
        <path d="M 330 98 L 356 88 L 360 104 L 336 116 Z" fill="url(#fwc-chrome-v)" />
        {/* the barrel: a polished cylinder whose side face we see as a darker disc */}
        <circle cx={268} cy={140} r={92} fill="url(#fwc-rim)" />
        <circle cx={268} cy={140} r={80} fill="url(#fwc-face)" />
        <circle cx={268} cy={140} r={80} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
        <path d="M 210 82 A 80 80 0 0 1 320 76" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={4} strokeLinecap="round" />
        <ellipse cx={240} cy={112} rx={26} ry={10} fill="rgba(255,255,255,0.10)" transform="rotate(-30 240 112)" />
        {/* the mouthpiece: a flat tube, chrome with a hard white streak */}
        <path d="M 18 92 L 214 72 L 220 136 L 18 132 Z" fill="url(#fwc-chrome-v)" />
        <path d="M 22 100 L 212 84" stroke="#FFFFFF" strokeWidth={4} strokeOpacity={0.85} strokeLinecap="round" />
        <path d="M 18 92 L 18 132" stroke="#2A2D31" strokeWidth={6} />
        <rect x={10} y={98} width={10} height={28} rx={3} fill="#0C0D0F" />
        {/* the sound window cut on top, with its sharp lip; the pea moving inside when it blows */}
        <path d="M 196 74 L 242 68 L 236 92 L 204 96 Z" fill="#0A0B0C" />
        <path d="M 242 68 L 236 92" stroke="#F2F3F4" strokeWidth={3} />
        <circle cx={222 + pea} cy={86} r={7} fill="#B49A72" opacity={blow > 0 ? 0.9 : 0.5} />
        {ring(0)}
        {ring(1)}
        {ring(2)}
        {/* breath out of the window */}
        {blow > 0.05 &&
          [0, 1, 2, 3].map((i) => {
            const t = ((f * 0.9 + i * 6) % 18) / 18;
            return (
              <line
                key={i}
                x1={214 + (i - 1.5) * 10}
                y1={62 - t * 50}
                x2={216 + (i - 1.5) * 13}
                y2={50 - t * 70}
                stroke="#F4F4F2"
                strokeOpacity={blow * (1 - t) * 0.7}
                strokeWidth={3}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
      </svg>
    </div>
  );
};
