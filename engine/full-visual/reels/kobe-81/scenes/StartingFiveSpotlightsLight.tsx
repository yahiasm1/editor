// The dark arena and its five spotlights. Behind: the endlessbender photo of that night, pushed into the dark, with
// phone flashes popping in the stands (intros are when the bowl lights up with them). In front of the five: hard
// follow-spot beams from the rafters, a little haze in each so the cone reads, dust turning in it.
import React from "react";
import { Img, staticFile } from "remotion";
import { StartingFiveSpotlightsPlayers, StartingFiveSpotlightsRand, StartingFiveSpotlightsTableTop } from "./StartingFiveSpotlightsData";

const R = StartingFiveSpotlightsRand;

export const StartingFiveSpotlightsArena: React.FC<{ f: number; dark: number; push: number }> = ({ f, dark, push }) => {
  // phone flashes: each lives 3 frames at a seeded spot in the stands
  const flashes: { x: number; y: number; a: number; r: number }[] = [];
  for (let k = 0; k < 26; k++) {
    const period = 34 + Math.floor(R(k) * 50);
    const phase = Math.floor(R(k + 40) * period);
    const t = (f + phase) % period;
    if (t < 3) {
      const cycle = Math.floor((f + phase) / period);
      flashes.push({ x: 20 + R(k * 7 + cycle) * 1040, y: 560 + R(k * 13 + cycle * 3) * 560, a: [1, 0.55, 0.2][t], r: 3 + R(k + cycle) * 3 });
    }
  }
  const b = 0.34 - 0.2 * dark; // the photo's brightness: dimmed as `night` left it, then the lights go down
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Img
        src={staticFile("kobe-81/startingfivespotlights-arena.jpg")}
        style={{
          position: "absolute",
          left: -560,
          top: 420,
          width: 2200,
          height: 1650,
          objectFit: "cover",
          objectPosition: "30% 10%",
          transform: `scale(${1 + push * 0.04})`,
          transformOrigin: "50% 30%",
          filter: `brightness(${b.toFixed(3)}) saturate(${(0.9 - 0.4 * dark).toFixed(2)}) blur(2.5px)`,
        }}
      />
      {/* the bowl falls off into black at the edges and the bottom */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 45% at 50% 52%, rgba(6,7,10,0) 0%, rgba(6,7,10,0.55) 70%, rgba(6,7,10,0.92) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 760, background: "linear-gradient(180deg, #0D1117 0%, #0D1117 44%, rgba(13,17,23,0.75) 68%, rgba(13,17,23,0) 100%)" }} />
      {flashes.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x - p.r * 4, top: p.y - p.r * 4, width: p.r * 8, height: p.r * 8, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,${(p.a * dark).toFixed(2)}) 0%, rgba(220,230,255,${(0.35 * p.a * dark).toFixed(2)}) 22%, rgba(220,230,255,0) 70%)` }} />
      ))}
    </div>
  );
};

export const StartingFiveSpotlightsBeams: React.FC<{ f: number; spot: number[] }> = ({ f, spot }) => {
  const P = StartingFiveSpotlightsPlayers;
  const top = 700;
  const bot = StartingFiveSpotlightsTableTop;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", mixBlendMode: "screen" }}>
      <defs>
        <linearGradient id="sfsBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF4E0" stopOpacity="0.10" />
          <stop offset="0.35" stopColor="#FFF1DA" stopOpacity="0.15" />
          <stop offset="1" stopColor="#FFE9C8" stopOpacity="0.26" />
        </linearGradient>
        <radialGradient id="sfsHalo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF3DE" stopOpacity="0.30" />
          <stop offset="1" stopColor="#FFF3DE" stopOpacity="0" />
        </radialGradient>
        <filter id="sfsSoft" x="-30%" y="-10%" width="160%" height="120%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      {P.map((p, i) => {
        const a = spot[i];
        if (a <= 0.001) return null;
        // the source is high and a little upstage: the cone leans in from the top
        const tx = p.x * 0.9 + 54;
        const wTop = 26;
        const wBot = 206;
        // haze moves through the cone
        const wob = Math.sin(f / 23 + i * 1.7) * 6;
        return (
          <g key={i} opacity={Math.min(1.25, a)}>
            <polygon filter="url(#sfsSoft)" points={`${tx - wTop / 2},${top} ${tx + wTop / 2},${top} ${p.x + wBot / 2 + wob},${bot} ${p.x - wBot / 2 + wob},${bot}`} fill="url(#sfsBeam)" />
            <polygon filter="url(#sfsSoft)" points={`${tx - 5},${top} ${tx + 5},${top} ${p.x + 50},${bot} ${p.x - 50},${bot}`} fill="url(#sfsBeam)" opacity={0.7} />
            <ellipse cx={p.x} cy={bot - 300} rx={150} ry={240} fill="url(#sfsHalo)" />
            {/* the instrument itself, a hot lens up in the dark */}
            <circle cx={tx} cy={top + 2} r={22} fill="url(#sfsHalo)" />
            <circle cx={tx} cy={top + 2} r={4.5} fill="#FFF8EC" opacity={0.9} />
            {/* dust turning in the light */}
            {Array.from({ length: 14 }, (_, k) => {
              const s = R(i * 31 + k);
              const y = top + 60 + ((s * 900 + f * (0.35 + R(k + i) * 0.5)) % (bot - top - 80));
              const t = (y - top) / (bot - top);
              const half = (wTop + (wBot - wTop) * t) / 2;
              const cx = tx + (p.x - tx) * t;
              const x = cx + (R(i * 7 + k * 3) - 0.5) * 2 * half * 0.85 + Math.sin(f / 30 + k) * 5;
              return <circle key={k} cx={x} cy={y} r={0.9 + R(k * 5 + i) * 1.4} fill="#FFF6E6" opacity={0.25 + 0.45 * R(k + f / 40)} />;
            })}
          </g>
        );
      })}
    </svg>
  );
};
