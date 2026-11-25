// wilt-100 hook X1: the two things beside the vault. Wilt himself, the real yearbook photo (Kansas, public domain) in
// the house card with its credit, rising behind the roof, standing to full height on "Chamberlain", tipping back
// into the dark on "saw". And a real Hershey Kiss streetlamp (Sebwite's photo, redrawn): a foil Kiss on a thin pole,
// the paper plume lettered HERSHEY at its tip, its lamp under the flat base throwing light down; it flickers twice
// and dies after the windows.
import React from "react";
import { Img, staticFile } from "remotion";
import { ease, prog } from "../../../src/engine";
import { HX1_DIM, type HookX1T, hx1Filament, hx1FilamentRGB, hx1Lerp, hx1Points } from "./HookX1Kit";

/* ---------- Wilt ---------- */
export const HX1_CARD = { cx: 446, top: 574, w: 340 };
export const HookX1Card: React.FC<{ f: number; T: HookX1T; font: string; warm: number }> = ({ f, T, font, warm }) => {
  const { cx, top, w } = HX1_CARD;
  const pw = w - 20, ph = Math.round(pw * (637 / 500));
  // rising from behind the roof at frame 0, standing to full height on "Chamberlain"
  const rise = prog(f, -24, T.chamberlain + 2, ease.out);
  const stand = prog(f, T.chamberlain - 3, 15, Easing2.back);
  const dy = hx1Lerp(hx1Lerp(150, 60, rise), 0, stand);
  const lean = hx1Lerp(26, 0, stand);
  // tipped back into the dark on "saw"
  const tip = prog(f, T.saw - 4, 14, ease.in);
  const rot = lean + 86 * tip;
  const clack = f > T.scored - 2 && f < T.n100 + 2 && hx1Points(f, T) !== hx1Points(f - 1, T) ? 1 : 0;
  const roar = (() => { const t = f - (T.game - 1); return t < 0 || t > 24 ? 0 : 0.12 * Math.sin((Math.PI * t) / 24); })();
  const pulse = roar + 0.14 * clack + 0.2 * Math.exp(-Math.max(0, f - T.n100) / 8) * (f >= T.n100 - 1 ? 1 : 0);
  const dark = 0.55 * tip + 0.35 * (1 - warm) * (f > T.nobody ? 1 : 0);
  return (
    <div style={{
      position: "absolute", left: cx - w / 2, top: top + dy + 70 * tip, width: w,
      transformOrigin: "50% 100%", transform: `perspective(1500px) rotateX(${rot.toFixed(2)}deg) rotateZ(${(0.7 * Math.sin(f / 38)).toFixed(3)}deg) scale(${(1 + 0.05 * prog(f, T.n100, T.nobody - T.n100, ease.linear)).toFixed(4)})`,
      filter: `brightness(${(1 + pulse - dark).toFixed(3)})`,
    }}>
      <div style={{ background: "#161B22", borderRadius: 22, padding: "8px 10px 10px", boxShadow: "0 0 0 1.5px #30363D, 0 30px 60px rgba(0,0,0,0.55)" }}>
        <div style={{ height: 34, display: "flex", justifyContent: "flex-end", alignItems: "center", fontFamily: font, fontSize: 22, color: HX1_DIM, paddingRight: 4 }}>Public domain</div>
        <div style={{ position: "relative", width: pw, height: ph, borderRadius: 12, overflow: "hidden" }}>
          <Img src={staticFile("wilt-100/hookx1-wilt.jpg")} style={{ width: pw, height: ph, objectFit: "cover", filter: "grayscale(1) contrast(1.06)" }} />
          {/* the arena's windows light him from below while they are on */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, rgba(255,186,96,${(0.22 * warm).toFixed(3)}) 0%, rgba(255,186,96,0) 55%)`, mixBlendMode: "soft-light" }} />
        </div>
      </div>
    </div>
  );
};
const Easing2 = { back: (t: number) => { const c = 1.9; const u = t - 1; return 1 + (c + 1) * u * u * u + c * u * u; } };

/* ---------- the Kiss lamp ---------- */
/** the lamp: lit, then two flickers after the windows, then the filament dies */
export function hx1Lamp(f: number, T: HookX1T) {
  const t = f - (T.nobody + 11);
  if (t < 0) return { b: 1, heat: 1 };
  const pat = [0.12, 0.12, 1, 1, 1, 0.08, 0.08, 0.9, 0.9];
  if (t < pat.length) return { b: pat[Math.floor(t)], heat: pat[Math.floor(t)] > 0.5 ? 1 : 0.4 };
  return hx1Filament(f, T.nobody + 11 + pat.length);
}

export const HookX1Lamp: React.FC<{ f: number; T: HookX1T; x: number; y: number; s: number; warm: number }> = ({ f, T, x, y, s, warm }) => {
  const L = hx1Lamp(f, T);
  const [r, g, b] = hx1FilamentRGB(L.heat);
  const col = `${r | 0},${g | 0},${b | 0}`;
  const kiss = "M -98,0 C -101,-30 -86,-54 -58,-78 C -34,-98 -15,-118 -7,-148 L 0,-170 L 7,-148 C 15,-118 34,-98 58,-78 C 86,-54 101,-30 98,0 A 98 17 0 0 1 -98 0 Z";
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="hx1-foil" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9EA5AD" />
          <stop offset="0.2" stopColor="#D5DADF" />
          <stop offset="0.38" stopColor="#8E959D" />
          <stop offset="0.7" stopColor="#5E646B" />
          <stop offset="1" stopColor="#363A40" />
        </linearGradient>
        <linearGradient id="hx1-pole" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6B7076" />
          <stop offset="0.35" stopColor="#A3A8AE" />
          <stop offset="1" stopColor="#3A3E43" />
        </linearGradient>
        <linearGradient id="hx1-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`rgba(${col},${(0.3 * L.b).toFixed(3)})`} />
          <stop offset="1" stopColor={`rgba(${col},0)`} />
        </linearGradient>
        <radialGradient id="hx1-halo">
          <stop offset="0" stopColor={`rgba(${col},${(0.55 * L.b).toFixed(3)})`} />
          <stop offset="0.35" stopColor={`rgba(${col},${(0.16 * L.b).toFixed(3)})`} />
          <stop offset="1" stopColor={`rgba(${col},0)`} />
        </radialGradient>
        <linearGradient id="hx1-warm" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor={`rgba(255,180,96,${(0.38 * warm).toFixed(3)})`} />
          <stop offset="0.6" stopColor="rgba(255,180,96,0)" />
        </linearGradient>
        <path id="hx1-plume" d="M -100,-181 C -64,-194 -28,-186 -8,-162" />
      </defs>
      <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(4)})`}>
        {/* the light it throws down, and the glow round its base */}
        <path d="M -90,10 L 90,10 L 300,520 L -230,520 Z" fill="url(#hx1-cone)" style={{ mixBlendMode: "screen" }} />
        <ellipse cx={0} cy={18} rx={250} ry={190} fill="url(#hx1-halo)" style={{ mixBlendMode: "screen" }} />
        {/* the pole, under the lamp, down out of the frame */}
        <path d="M -7,10 C -6,160 2,330 14,560 L 30,560 C 18,330 9,160 7,10 Z" fill="url(#hx1-pole)" />
        {/* the foil Kiss, the warm windows reflected on its right shoulder, a sheen on the left */}
        <path d={kiss} fill="url(#hx1-foil)" />
        {/* with its lamp and the windows out, the foil is only moonlit */}
        <path d={kiss} fill={`rgba(8,10,14,${(0.5 * (1 - Math.max(L.b > 0.5 ? 1 : 0, warm))).toFixed(3)})`} />
        <path d={kiss} fill="url(#hx1-warm)" />
        <path d="M -60,-70 C -48,-86 -34,-100 -22,-118" stroke="rgba(255,255,255,0.55)" strokeWidth={7} fill="none" strokeLinecap="round" />
        {[-40, -22, -4, 14].map((yy, i) => (
          <path key={i} d={`M ${-92 + i * 10},${yy - 10} C ${-40},${yy - 24 + i * 3} ${40},${yy - 22 + i * 3} ${92 - i * 10},${yy - 8}`} stroke="rgba(30,34,40,0.16)" strokeWidth={2} fill="none" />
        ))}
        {/* the lamp under the base: a lit rim when on */}
        <path d="M -98,0 A 98 17 0 0 0 98 0" stroke={`rgba(${col},${Math.min(1, 0.95 * L.b).toFixed(3)})`} strokeWidth={5} fill="none" />
        <path d="M -98,0 A 98 17 0 0 0 98 0" stroke="rgba(20,22,26,0.7)" strokeWidth={1.5} fill="none" />
        {/* the paper plume */}
        <path d="M -2,-166 C -22,-196 -62,-210 -106,-194 L -102,-176 C -62,-190 -26,-180 -6,-156 Z" fill="#DDE4EA" stroke="#9AA6B2" strokeWidth={1} />
        <text fontSize={14} fontWeight={800} fill="#4C6383" letterSpacing={1.5} style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
          <textPath href="#hx1-plume" startOffset="8">HERSHEY</textPath>
        </text>
      </g>
    </svg>
  );
};
