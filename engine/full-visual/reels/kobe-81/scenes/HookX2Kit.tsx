// HookX2's real material and parts: the night photo's measured geometry (1024 px Commons copy of the endlessbender
// photo, the only photo taken at the 81 game), the marquee sockets laid on its real gold sideline band and on the
// scorer's table edge under the red STAPLES Center lettering, the five real red jerseys cut out of it as stickers,
// the stanchion-style LED clock, and the bulbs. Everything is a pure function of the frame.
import React from "react";
import { Img, staticFile } from "remotion";
import { StaplesNightDots, StaplesNightLed, StaplesNightReadout } from "./StaplesNightBoard";

export const HookX2Asset = (n: string) => staticFile(`kobe-81/hookx2-${n}`);
export const HookX2PHOTO = { w: 1024, h: 768 };
export const HookX2GOLD = "#FDB927"; // Lakers gold
export const HookX2HOT = "#FFE9A8";
export const HookX2RED = "#E2162B"; // Raptors red, a touch lifted to read as a lit bulb
export const HookX2RING = "#CE1141";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** a seeded random in [0, 1) */
export const HookX2Rnd = (i: number, k = 0) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// ---- the photo's geometry, 1024 px coords (measured on gridded zooms and colour masks, notes/HookX2.md)
/** the gold sideline band's centreline, from the half-court line to the far baseline corner */
const BAND = { x0: 80, x1: 762 };
const bandY = (x: number) => 498 - 0.222 * x;
export const HookX2HALF = { a: { x: 77, y: 481 }, b: { x: 646, y: 663 } };
export const HookX2RIM = { x: 812, y: 306 };
/** the five real red jerseys: the sticker files and their boxes in the photo, left to right */
export const HookX2RAPTORS = [
  { k: "r5", x: 349, y: 436, w: 47, h: 106 },
  { k: "rd", x: 617, y: 379, w: 45, h: 96 },
  { k: "r13", x: 631, y: 353, w: 42, h: 110 },
  { k: "r4", x: 692, y: 347, w: 49, h: 107 },
  { k: "r11", x: 760, y: 355, w: 36, h: 112 },
];
/** the stanchion: backboard, support arm and LED cube, the part that flexes on the slam (photo px) */
export const HookX2STANCHION = { x: 726, y: 166, w: 212, h: 240, px: 905, py: 398 };

// ---- the gold track: 55 sockets, 51 along the band, the last four climbing the support to the rim
export const HookX2GOLD_N = 55;
export const HookX2GoldSocket = (i: number) => {
  if (i <= 50) {
    const t = i / 50;
    const x = lerp(BAND.x0, BAND.x1, t);
    return { x, y: bandY(x), r: lerp(6.6, 4.9, t) };
  }
  const t = (i - 50) / 4;
  const b = { x: BAND.x1, y: bandY(BAND.x1) };
  return { x: lerp(b.x, HookX2RIM.x - 6, t), y: lerp(b.y, HookX2RIM.y + 4, t) - 6 * Math.sin(Math.PI * t), r: 4.7 };
};

// ---- the red track: 24 sockets along the scorer's table edge under STAPLES Center, five strings until they join
export const HookX2RED_N = 24;
/** red bulbs lit at the end: 41/55 of its track, as the Raptors' 41 against Kobe's 55 */
export const HookX2RED_LIT = 18;
const RED = { a: { x: 652, y: 655 }, b: { x: 845, y: 598.6 } };
export const HookX2RedSocket = (j: number, join: number) => {
  const g = Math.floor((j * 5) / HookX2RED_N);
  const gap = 1.8 * (1 - join);
  const t = (j + g * gap) / (HookX2RED_N - 1 + 4 * gap);
  return { x: lerp(RED.a.x, RED.b.x, t), y: lerp(RED.a.y, RED.b.y, t), r: lerp(4.4, 3.9, t), g };
};

/** a marquee socket: a dark brass cup with its glass, dim when off */
export const HookX2Socket: React.FC<{ x: number; y: number; r: number; tint: string; dim?: number }> = ({ x, y, r, tint, dim = 0.16 }) => (
  <div style={{ position: "absolute", left: x - r * 1.35, top: y - r * 1.35, width: r * 2.7, height: r * 2.7, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #4a3f2a 0%, #2a2216 60%, #120e08 100%)", boxShadow: "0 0.6px 1.2px rgba(0,0,0,0.7), inset 0 0.5px 0 rgba(255,235,190,0.25)" }}>
    <div style={{ position: "absolute", left: r * 0.35, top: r * 0.35, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle at 42% 36%, rgba(255,255,255,0.35) 0%, ${tint} 40%, rgba(0,0,0,0.6) 100%)`, opacity: dim + 0.25 }} />
  </div>
);

/** a lit bulb: hot core, coloured glass, a halo; `flash` > 0 right after it lights */
export const HookX2Bulb: React.FC<{ x: number; y: number; r: number; color: string; flash?: number; glow?: number }> = ({ x, y, r, color, flash = 0, glow = 1 }) => {
  const halo = r * (3.4 + 3 * flash);
  return (
    <>
      <div style={{ position: "absolute", left: x - halo, top: y - halo, width: halo * 2, height: halo * 2, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,250,235,0.9) 0%, ${color} 22%, rgba(0,0,0,0) 66%)`, opacity: Math.min(1, (0.75 + 0.25 * flash) * glow), mixBlendMode: "screen" }} />
      <div
        style={{
          position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%",
          background: `radial-gradient(circle at 44% 38%, #FFFFFF 0%, #FFF8E4 ${Math.round(30 + 25 * flash)}%, ${color} ${Math.round(62 + 20 * flash)}%, ${color} 100%)`,
          boxShadow: `0 0 ${(r * (1.2 + 2 * flash)).toFixed(1)}px ${color}`,
        }}
      />
    </>
  );
};

/** a string's cable, under its sockets */
export const HookX2Cable: React.FC<{ pts: { x: number; y: number }[]; color: string; w?: number }> = ({ pts, color, w = 1.6 }) => (
  <svg width={HookX2PHOTO.w} height={HookX2PHOTO.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <polyline points={pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** a sticker: a real jersey cut from the night photo, a white die-cut edge and a drop shadow under it */
export const HookX2Sticker: React.FC<{ k: string; w: number; h: number; edge: number; lift: number; style?: React.CSSProperties }> = ({ k, w, h, edge, lift, style }) => {
  const e = (edge * Math.max(1.2, w / 40)).toFixed(2);
  const outline = edge > 0.01 ? `drop-shadow(${e}px 0 0 #fff) drop-shadow(-${e}px 0 0 #fff) drop-shadow(0 ${e}px 0 #fff) drop-shadow(0 -${e}px 0 #fff) ` : "";
  const shadow = `drop-shadow(${(3 * lift).toFixed(1)}px ${(10 * lift).toFixed(1)}px ${(6 + 8 * lift).toFixed(1)}px rgba(0,0,0,${(0.55 * Math.min(1, lift)).toFixed(2)}))`;
  return (
    <div style={{ position: "absolute", width: w, height: h, ...style }}>
      <Img src={HookX2Asset(`${k}.png`)} style={{ width: w, height: h, filter: outline + shadow }} />
    </div>
  );
};

/** the silhouette a peeled sticker leaves on the maple */
export const HookX2Shadow: React.FC<{ k: string; x: number; y: number; w: number; h: number; o: number }> = ({ k, x, y, w, h, o }) =>
  o <= 0.01 ? null : (
    <div
      style={{
        position: "absolute", left: x, top: y, width: w, height: h, opacity: o,
        background: "rgba(92,58,24,0.9)", filter: "blur(1px)",
        WebkitMaskImage: `url(${HookX2Asset(`${k}.png`)})`, WebkitMaskSize: `${w}px ${h}px`, WebkitMaskRepeat: "no-repeat",
      }}
    />
  );

/** the small LED game clock, in the stanchion's own style: black housing, chrome edge, red seven-segment digits */
export const HookX2Clock: React.FC<{ text: string; power: number; w: number; label: number }> = ({ text, power, w, label }) => {
  const L = StaplesNightLed;
  const h = w * 0.46;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 10, background: `linear-gradient(180deg, #111113, ${L.housing} 22%)`, border: `2px solid ${L.edge}`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 14px 30px rgba(0,0,0,0.6), 0 0 ${(30 * power).toFixed(0)}px rgba(255,42,28,${(0.22 * power).toFixed(2)})`, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 4px)" }} />
      <div style={{ position: "absolute", left: w * 0.08, top: h * 0.1, opacity: label }}>
        <StaplesNightDots text="2ND HALF" size={h * 0.2} w={w * 0.84} color={L.amber} dim={L.amberDim} glow={power} anchor="end" />
      </div>
      <div style={{ position: "absolute", left: w * 0.08, top: h * 0.4 }}>
        <StaplesNightReadout text={text} h={h * 0.46} w={w * 0.84} color={L.red} dim={L.redDim} glow={power} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 40%)" }} />
    </div>
  );
};

/** 24:00 down to 0:00 the way an arena clock reads (tenths under a minute) */
export const HookX2ClockText = (secs: number) => {
  if (secs >= 60) {
    const s = Math.ceil(secs);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }
  return (Math.max(0, Math.floor(secs * 10) / 10)).toFixed(1);
};
