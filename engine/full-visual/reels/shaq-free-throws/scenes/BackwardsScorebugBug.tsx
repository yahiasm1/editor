// The in-game scoreboard bug at Shaq's first trip to the line that night (bbref play-by-play, 2nd quarter):
// 0:48.9 offensive rebound by O'Neal, 0:47.7 shooting foul by R. Lewis, Seattle 57, Lakers 52 (visitor first).
// One dark bar: SEA box (Sonics green, gold letters), LAL box (Lakers purple, gold letters), the period and the game
// clock; the info strips slide out of its underside. No network name or logo. 900 x 132, plus strips of 64.
import React from "react";
import { loadFont } from "@remotion/google-fonts/BarlowCondensed";
import { ease, prog } from "../../../src/engine";

export const BackwardsScorebugFont = loadFont("normal", { weights: ["600", "700", "800"], subsets: ["latin"] }).fontFamily;
const FONT = BackwardsScorebugFont;
const RED = "#E5383B";
export const BackwardsScorebugGeo = { w: 900, h: 132, sea: 330, lal: 330, clock: 240, strip: 64 };
const G = BackwardsScorebugGeo;

const BackwardsScorebugTeam: React.FC<{
  abbr: string;
  score: React.ReactNode;
  c1: string;
  c2: string;
  ink: string;
  width: number;
  dim: number;
}> = ({ abbr, score, c1, c2, ink, width, dim }) => (
  <div style={{ position: "relative", width, height: G.h, display: "flex", filter: dim < 1 ? `brightness(${dim.toFixed(3)})` : undefined }}>
    <div style={{ width: 150, height: "100%", background: `linear-gradient(180deg, ${c1} 0%, ${c2} 100%)`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 46%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.18) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 14, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 84, lineHeight: "100px", color: ink, letterSpacing: 3, textShadow: "0 2px 0 rgba(0,0,0,0.35)" }}>{abbr}</div>
    </div>
    <div style={{ flex: 1, height: "100%", background: "linear-gradient(180deg, #1B222D 0%, #0E131A 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 48%)" }} />
      {score}
    </div>
  </div>
);

/** a score slot whose digits can roll: `v` may be fractional while rolling */
export const BackwardsScorebugDigits: React.FC<{ v: number; size: number; color: string; stroke?: string; fill?: string }> = ({ v, size, color, stroke, fill }) => {
  const lo = Math.floor(v);
  const k = v - lo;
  const H = size * 1.08;
  const txt = (n: number, y: number) => (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, height: H, lineHeight: `${H}px`, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: size, color: fill ?? color, WebkitTextStroke: stroke, fontVariantNumeric: "tabular-nums" }}>{n}</div>
  );
  return (
    <div style={{ position: "relative", height: H, overflow: "hidden" }}>
      {txt(lo, -k * H)}
      {k > 0.001 && txt(lo + 1, (1 - k) * H)}
    </div>
  );
};

export const BackwardsScorebugBug: React.FC<{
  f: number;
  clock: number; // seconds left in the period
  seaStrip: number; // 0..1 slide of the SHOOTING FOUL strip
  lalStrip: number; // 0..1 slide of the 2 FREE THROWS strip
  lalForward: number; // 0..1 LAL box comes toward the viewer
  sweepAt: number; // frame a light sweeps the bar
  stopAt: number; // the whistle: the clock stops and flashes foul red once
  hit: number; // the LAL score box flashes when a ball lands (0..1)
}> = ({ f, clock, seaStrip, lalStrip, lalForward, sweepAt, stopAt, hit }) => {
  const stopFlash = f >= stopAt ? 1 - prog(f, stopAt + 4, 16, ease.linear) : 0;
  const tenths = Math.floor(clock * 10 + 1e-6);
  const clockTxt = `${Math.floor(tenths / 600)}:${String(Math.floor((tenths % 600) / 10)).padStart(2, "0")}.${tenths % 10}`;
  const sw = prog(f, sweepAt, 26, ease.inOut);
  const rest = 1 - 0.32 * lalForward;
  const strip = (x: number, w: number, p: number, bg: string, children: React.ReactNode) => (
    <div style={{ position: "absolute", left: x, top: G.h - 4, width: w, height: G.strip + 4, overflow: "hidden", borderRadius: "0 0 10px 10px" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          top: 4,
          transform: `translateY(${((1 - p) * -(G.strip + 4)).toFixed(1)}px)`,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          whiteSpace: "nowrap",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 42,
          letterSpacing: 2.5,
          color: "#fff",
          boxShadow: "inset 0 8px 10px -6px rgba(0,0,0,0.6)",
        }}
      >
        {children}
      </div>
    </div>
  );
  return (
    <div style={{ position: "relative", width: G.w, height: G.h + G.strip }}>
      {/* strips slide out of the underside */}
      {strip(14, G.sea - 14, seaStrip, `linear-gradient(180deg, ${RED} 0%, #B9242A 100%)`, (
        <>
          <span>SHOOTING FOUL</span>
        </>
      ))}
      {strip(G.sea + 6, G.lal - 12, lalStrip, "linear-gradient(180deg, #20283A 0%, #121925 100%)", (
        <span style={{ transform: `scale(${(1 + 0.06 * lalForward).toFixed(3)})` }}>2 FREE THROWS</span>
      ))}
      {/* the bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: G.w,
          height: G.h,
          borderRadius: 14,
          overflow: "hidden",
          display: "flex",
          background: "#0B0F14",
          boxShadow: "0 0 0 1.5px #30363D, 0 26px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25)",
        }}
      >
        <BackwardsScorebugTeam
          abbr="SEA"
          c1="#0A7A48"
          c2="#00502D"
          ink="#FFC200"
          width={G.sea}
          dim={rest}
          score={
            <div style={{ position: "absolute", left: 0, right: 0, top: 8 }}>
              <BackwardsScorebugDigits v={57} size={104} color="#fff" />
            </div>
          }
        />
        <div style={{ width: 2, background: "#05080C" }} />
        <div style={{ width: G.lal - 2 }} />
        <div style={{ width: 2, background: "#05080C" }} />
        <div
          style={{
            width: G.clock - 2,
            height: "100%",
            background: "linear-gradient(180deg, #1F2733 0%, #10151C 100%)",
            position: "relative",
            filter: `brightness(${rest.toFixed(3)})`,
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 48%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 6, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 42, letterSpacing: 3, color: "#C9D1D9" }}>2ND</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 76, lineHeight: "80px", color: stopFlash > 0 ? `rgba(255,${Math.round(255 - 199 * stopFlash)},${Math.round(255 - 196 * stopFlash)},1)` : "#fff", fontVariantNumeric: "tabular-nums" }}>{clockTxt}</div>
        </div>
        {/* the light sweep across the glass of the bar */}
        <div style={{ position: "absolute", top: -20, bottom: -20, width: 140, left: -200 + sw * 1300, background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%)", transform: "skewX(-20deg)", opacity: sw > 0 && sw < 1 ? 1 : 0 }} />
      </div>
      {/* LAL's box lives on its own layer so it can come forward toward the viewer */}
      <div
        style={{
          position: "absolute",
          left: G.sea + 2,
          top: 0,
          width: G.lal - 2,
          height: G.h,
          transformOrigin: "50% 60%",
          transform: `translateY(${(-14 * lalForward).toFixed(1)}px) scale(${(1 + 0.12 * lalForward).toFixed(4)})`,
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: lalForward > 0.01 ? `0 ${(30 * lalForward).toFixed(0)}px ${(50 * lalForward).toFixed(0)}px rgba(0,0,0,${(0.65 * lalForward).toFixed(2)}), 0 0 0 1.5px rgba(253,185,39,${(0.5 * lalForward).toFixed(2)})` : undefined,
          zIndex: 3,
        }}
      >
        <BackwardsScorebugTeam
          abbr="LAL"
          c1="#6A2F9E"
          c2="#3F1866"
          ink="#FDB927"
          width={G.lal - 2}
          dim={1}
          score={
            <div style={{ position: "absolute", left: 0, right: 0, top: 8 }}>
              <BackwardsScorebugDigits v={52} size={104} color="#fff" />
            </div>
          }
        />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 75% 50%, rgba(255,255,255,0.55), rgba(255,255,255,0) 60%)", opacity: hit }} />
      </div>
    </div>
  );
};
