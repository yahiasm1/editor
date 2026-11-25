// The reel's scoreboard, born in `night` out of the STAPLES stanchion clock: a black Daktronics-style housing, red
// seven-segment scores with their unlit segments faintly visible, an amber game clock (tenths under a minute, as the
// photo's "54.7"), dot-matrix amber team names, the two logos bare. Read off the endlessbender photo's stanchion cube
// and Niv Singer's close photo of the same unit.
import React, { useId } from "react";
import { Img, staticFile } from "remotion";

export const StaplesNightLed = {
  red: "#FF2A1C",
  redDim: "rgba(255,42,28,0.075)",
  amber: "#FFA51F",
  amberDim: "rgba(255,165,31,0.07)",
  housing: "#060606",
  edge: "#3A3F46",
};

/** the parked geometry: the other scenes hang the board here */
export const StaplesNightBoardRect = { x: 90, y: 532, w: 900, h: 160 };

const SEG: Record<string, string> = {
  "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc",
  "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg", " ": "",
};

const hSeg = (cx: number, cy: number, L: number, t: number) =>
  `${cx - L / 2},${cy} ${cx - L / 2 + t / 2},${cy - t / 2} ${cx + L / 2 - t / 2},${cy - t / 2} ${cx + L / 2},${cy} ${cx + L / 2 - t / 2},${cy + t / 2} ${cx - L / 2 + t / 2},${cy + t / 2}`;
const vSeg = (cx: number, cy: number, L: number, t: number) =>
  `${cx},${cy - L / 2} ${cx + t / 2},${cy - L / 2 + t / 2} ${cx + t / 2},${cy + L / 2 - t / 2} ${cx},${cy + L / 2} ${cx - t / 2},${cy + L / 2 - t / 2} ${cx - t / 2},${cy - L / 2 + t / 2}`;
// a 60 x 100 cell, segments 10 thick with hairline gaps, a slight forward lean like the real boards
const SEGS: Record<string, string> = {
  a: hSeg(30, 6, 38, 10), g: hSeg(30, 50, 38, 10), d: hSeg(30, 94, 38, 10),
  f: vSeg(7, 28, 38, 10), b: vSeg(53, 28, 38, 10), e: vSeg(7, 72, 38, 10), c: vSeg(53, 72, 38, 10),
};

/** one seven-segment digit; `ch` " " shows only the dim unlit segments */
export const StaplesNightDigit: React.FC<{ ch: string; h: number; color: string; dim: string; glow?: number; x?: number }> = ({ ch, h, color, dim, glow = 1, x = 0 }) => {
  const on = SEG[ch] ?? "";
  const w = h * 0.6;
  return (
    <svg width={w} height={h} viewBox="0 0 60 100" style={{ position: "absolute", left: x, top: 0, overflow: "visible", transform: "skewX(-4deg)" }}>
      {Object.entries(SEGS).map(([k, pts]) => (
        <polygon key={k} points={pts} fill={on.includes(k) ? color : dim} />
      ))}
      {glow > 0 && (
        <g style={{ filter: `blur(${(3.5 * glow).toFixed(2)}px)` }} opacity={0.75 * glow}>
          {Object.entries(SEGS).map(([k, pts]) => (on.includes(k) ? <polygon key={k} points={pts} fill={color} /> : null))}
        </g>
      )}
    </svg>
  );
};

/** a run of digits plus ":" and "." the way an arena clock spaces them, right-aligned in width w */
export const StaplesNightReadout: React.FC<{ text: string; h: number; w: number; color: string; dim: string; glow?: number; pad?: number }> = ({ text, h, w, color, dim, glow = 1, pad }) => {
  const dw = h * 0.6;
  const gap = h * 0.16;
  const sep = h * 0.26;
  const chars = pad ? text.padStart(pad, " ") : text;
  const items: { kind: "d" | ":" | "."; ch: string; x: number }[] = [];
  let x = 0;
  for (const ch of chars) {
    if (ch === ":" || ch === ".") {
      items.push({ kind: ch, ch, x });
      x += sep;
    } else {
      items.push({ kind: "d", ch, x });
      x += dw + gap;
    }
  }
  const total = x - gap;
  const off = w - total;
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {items.map((it, i) =>
        it.kind === "d" ? (
          <StaplesNightDigit key={i} ch={it.ch} h={h} color={color} dim={dim} glow={glow} x={off + it.x} />
        ) : (
          <div key={i} style={{ position: "absolute", left: off + it.x + sep * 0.18, top: 0, width: sep * 0.5, height: h }}>
            {(it.kind === ":" ? [0.3, 0.7] : [0.94]).map((p, j) => (
              <div key={j} style={{ position: "absolute", left: 0, top: h * p - sep * 0.22, width: sep * 0.44, height: sep * 0.44, borderRadius: 2, background: color, boxShadow: glow > 0 ? `0 0 ${6 * glow}px ${color}` : undefined }} />
            ))}
          </div>
        ),
      )}
    </div>
  );
};

/** amber dot-matrix lettering: each glyph made of lit LEDs over the dim grid of unlit ones */
export const StaplesNightDots: React.FC<{ text: string; size: number; w: number; color: string; dim: string; glow?: number; anchor?: "start" | "end" }> = ({ text, size, w, color, dim, glow = 1, anchor = "start" }) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const pitch = size / 9;
  const h = size * 1.05;
  return (
    <svg width={w} height={h} style={{ position: "absolute", overflow: "visible" }}>
      <defs>
        <pattern id={`on${id}`} width={pitch} height={pitch} patternUnits="userSpaceOnUse">
          <circle cx={pitch / 2} cy={pitch / 2} r={pitch * 0.42} fill={color} />
        </pattern>
        <pattern id={`off${id}`} width={pitch} height={pitch} patternUnits="userSpaceOnUse">
          <circle cx={pitch / 2} cy={pitch / 2} r={pitch * 0.36} fill={dim} />
        </pattern>
      </defs>
      <rect x={0} y={0} width={w} height={h} fill={`url(#off${id})`} />
      {glow > 0 && (
        <text x={anchor === "end" ? w : 0} y={size * 0.9} textAnchor={anchor} fontFamily="Inter, sans-serif" fontWeight={800} fontSize={size} letterSpacing={size * 0.08} fill={color} opacity={0.35 * glow} style={{ filter: `blur(${4 * glow}px)` }}>
          {text}
        </text>
      )}
      <text x={anchor === "end" ? w : 0} y={size * 0.9} textAnchor={anchor} fontFamily="Inter, sans-serif" fontWeight={800} fontSize={size} letterSpacing={size * 0.08} fill={`url(#on${id})`}>
        {text}
      </text>
    </svg>
  );
};

export type StaplesNightBoardState = {
  power: number; // 0 dark housing with unlit segments, 1 fully lit
  tor: number | null;
  lal: number | null;
  period: string;
  clock: string;
  flashTor?: number; // 0..1 extra glow on the row that just scored
  flashLal?: number;
  flareTor?: number; // 0..1 the lead number held brighter
  logoTor?: number; // 0..1 logo arrival
  logoLal?: number;
};

const ROW_H = 70;

const Row: React.FC<{ y: number; logo: string; name: string; score: number | null; power: number; flash: number; flare: number; logoK: number }> = ({ y, logo, name, score, power, flash, flare, logoK }) => {
  const L = StaplesNightLed;
  const s = score === null ? "  " : String(score).padStart(2, " ");
  const glow = power * (1 + flash * 0.9 + flare * 0.7);
  const bright = power > 0.5;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: 900, height: ROW_H }}>
      <div style={{ position: "absolute", left: 22, top: 7, width: 56, height: 56, opacity: logoK, transform: `scale(${0.6 + 0.4 * logoK})` }}>
        <Img src={staticFile(`kobe-81/${logo}`)} style={{ width: 56, height: 56, objectFit: "contain" }} />
      </div>
      <div style={{ position: "absolute", left: 98, top: 12, width: 400, height: 50 }}>
        <StaplesNightDots text={bright ? name : ""} size={44} w={380} color={bright ? L.amber : L.amberDim} dim={L.amberDim} glow={bright ? power : 0} />
      </div>
      <div style={{ position: "absolute", left: 470, top: 8, transform: `scale(${1 + flare * 0.06})`, transformOrigin: "right center" }}>
        <StaplesNightReadout text={s} h={56} w={130} color={bright ? L.red : L.redDim} dim={L.redDim} glow={bright ? glow : 0} />
      </div>
    </div>
  );
};

export const StaplesNightBoard: React.FC<{ st: StaplesNightBoardState; style?: React.CSSProperties }> = ({ st, style }) => {
  const L = StaplesNightLed;
  const R = StaplesNightBoardRect;
  const bright = st.power > 0.5;
  return (
    <div
      style={{
        position: "absolute",
        left: R.x,
        top: R.y,
        width: R.w,
        height: R.h,
        borderRadius: 14,
        background: `linear-gradient(180deg, #0d0d0e 0%, ${L.housing} 18%, ${L.housing} 100%)`,
        border: `2px solid ${L.edge}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -2px 6px rgba(0,0,0,0.8), 0 18px 50px rgba(0,0,0,0.65)${st.power > 0 ? `, 0 0 ${40 * st.power}px rgba(255,42,28,${0.10 * st.power})` : ""}`,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* the louvred face of an outdoor-style LED cabinet */}
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 5px)" }} />
      <Row y={10} logo="nba-raptors-primary.svg" name="RAPTORS" score={st.tor} power={st.power} flash={st.flashTor ?? 0} flare={st.flareTor ?? 0} logoK={st.logoTor ?? 0} />
      <Row y={10 + ROW_H} logo="nba-lakers-primary.svg" name="LAKERS" score={st.lal} power={st.power} flash={st.flashLal ?? 0} flare={0} logoK={st.logoLal ?? 0} />
      {/* the divider and the game clock block, amber like the stanchion's game clock */}
      <div style={{ position: "absolute", left: 628, top: 14, width: 2, height: 132, background: "#1f2226" }} />
      <div style={{ position: "absolute", left: 650, top: 18, width: 226, height: 44 }}>
        <StaplesNightDots text={bright ? st.period : ""} size={38} w={226} color={bright ? L.amber : L.amberDim} dim={L.amberDim} glow={bright ? st.power : 0} anchor="end" />
      </div>
      <div style={{ position: "absolute", left: 650, top: 80 }}>
        <StaplesNightReadout text={st.clock} h={60} w={226} color={bright ? L.amber : L.amberDim} dim={L.amberDim} glow={bright ? st.power * 0.9 : 0} />
      </div>
      {/* glass sheen */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(165deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 38%)" }} />
    </div>
  );
};
