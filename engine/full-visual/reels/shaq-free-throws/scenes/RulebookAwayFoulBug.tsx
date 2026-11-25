// The reel's scorebug (the one from `backwards`: dark glass bar, SEA box in Sonics green with gold letters, LAL box in
// Lakers purple with gold letters, period over a tabular game clock, Barlow Condensed), here without the scores: in
// `rule` it stands for any game, any quarter, so only the period and the clock work. The period digit rolls
// 1ST -> 2ND -> 3RD -> 4TH; the clock reads 2:00 white and drops under it in foul red.
import React from "react";
import { BackwardsScorebugFont as FONT } from "./BackwardsScorebugBug";

const RED = "#E5383B";
const W = 760, H = 112;

const RulebookAwayFoulTeam: React.FC<{ abbr: string; c1: string; c2: string; ink: string; w: number; glow: number }> = ({ abbr, c1, c2, ink, w, glow }) => (
  <div style={{ position: "relative", width: w, height: H, background: `linear-gradient(180deg, ${c1} 0%, ${c2} 100%)`, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 46%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.18) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 6, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 76, lineHeight: "100px", color: ink, letterSpacing: 3, textShadow: "0 2px 0 rgba(0,0,0,0.35)" }}>{abbr}</div>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5), rgba(255,255,255,0) 70%)", opacity: glow }} />
  </div>
);

/** `period` may be fractional while it rolls (1 = 1ST ... 4 = 4TH); `clock` in seconds; `red` 0..1 */
export const RulebookAwayFoulBug: React.FC<{ period: number; clock: number; red: number; sweep: number; lalGlow: number }> = ({ period, clock, red, sweep, lalGlow }) => {
  const names = ["1ST", "2ND", "3RD", "4TH"];
  const lo = Math.max(0, Math.min(3, Math.floor(period - 1)));
  const kk = Math.max(0, Math.min(1, period - 1 - lo));
  const PH = 46;
  const secs = Math.max(0, Math.ceil(clock - 1e-6));
  const clockTxt = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  const ink = `rgb(${255 + Math.round((229 - 255) * red)},${255 + Math.round((56 - 255) * red)},${255 + Math.round((59 - 255) * red)})`;
  return (
    <div style={{ position: "relative", width: W, height: H, borderRadius: 14, overflow: "hidden", display: "flex", background: "#0B0F14", boxShadow: "0 0 0 1.5px #30363D, 0 22px 44px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25)" }}>
      <RulebookAwayFoulTeam abbr="SEA" c1="#0A7A48" c2="#00502D" ink="#FFC200" w={190} glow={0} />
      <div style={{ width: 2, background: "#05080C" }} />
      <RulebookAwayFoulTeam abbr="LAL" c1="#6A2F9E" c2="#3F1866" ink="#FDB927" w={190} glow={lalGlow} />
      <div style={{ width: 2, background: "#05080C" }} />
      {/* period: a rolling digit window */}
      <div style={{ width: 150, height: "100%", position: "relative", background: "linear-gradient(180deg, #1F2733 0%, #10151C 100%)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 48%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: (H - PH) / 2, height: PH, overflow: "hidden" }}>
          {[lo, lo + 1].map((i, j) =>
            i < 4 ? (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (j - kk) * PH, height: PH, lineHeight: `${PH}px`, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 52, letterSpacing: 3, color: "#C9D1D9" }}>
                {names[i]}
              </div>
            ) : null,
          )}
        </div>
      </div>
      <div style={{ width: 2, background: "#05080C" }} />
      <div style={{ flex: 1, height: "100%", position: "relative", background: "linear-gradient(180deg, #1F2733 0%, #10151C 100%)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 48%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 55%, rgba(229,56,59,${(0.28 * red).toFixed(3)}), rgba(229,56,59,0) 70%)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 10, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 84, lineHeight: "92px", color: ink, fontVariantNumeric: "tabular-nums", textShadow: red > 0.5 ? `0 0 18px rgba(229,56,59,${(0.55 * red).toFixed(2)})` : undefined }}>
          {clockTxt}
        </div>
      </div>
      {/* the light sweep across the glass */}
      <div style={{ position: "absolute", top: -20, bottom: -20, width: 120, left: -180 + sweep * 1100, background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)", transform: "skewX(-20deg)", opacity: sweep > 0 && sweep < 1 ? 1 : 0 }} />
    </div>
  );
};
export const RULEBOOKAWAYFOUL_BUG = { w: W, h: H, red: RED };
