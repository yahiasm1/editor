// The totals and the table fragment for scene `points`.
// A total is a big white Figtree number that counts what has arrived (1,161 then 802) and then rolls, like an
// odometer, to points per shot (1.16, 0.80), its arithmetic in small grey under it. The table fragment is the real
// Basketball-Reference Team Shooting table cut down to one column: the over-header "FG% by Distance", the column
// head "16-3P" and the bold League Average cell ".401" on its #EEE ground, in the page's own face (DejaVu Sans, the
// Verdana metrics the screenshot was taken with).
import React from "react";
import { staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

loadFont({ family: "PpsDejaVu", url: staticFile("nba-floor/pointspershot-dejavusans.ttf"), weight: "400" });
loadFont({ family: "PpsDejaVu", url: staticFile("nba-floor/pointspershot-dejavusans-bold.ttf"), weight: "700" });

const GREY = "#8B949E";
const SHADOW = "0 3px 18px rgba(13,17,23,0.85), 0 0 2px rgba(13,17,23,0.9)";

/** a vertical roll from one string to another, p 0..1 */
const PointsPerShotRoll: React.FC<{ a: string; b: string; p: number; size: number }> = ({ a, b, p, size }) => {
  const h = size * 1.1;
  return (
    <div style={{ position: "relative", height: h, overflow: "hidden" }}>
      <div style={{ transform: `translateY(${(-p * h).toFixed(1)}px)`, opacity: 1 - p, filter: p > 0 && p < 1 ? `blur(${(Math.sin(p * Math.PI) * 6).toFixed(1)}px)` : undefined, height: h, lineHeight: `${h}px` }}>{a}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${((1 - p) * h).toFixed(1)}px)`, opacity: p, filter: p > 0 && p < 1 ? `blur(${(Math.sin(p * Math.PI) * 6).toFixed(1)}px)` : undefined, height: h, lineHeight: `${h}px` }}>{b}</div>
    </div>
  );
};

export const PointsPerShotTotal: React.FC<{
  x: number;
  y: number;
  size: number;
  opacity: number;
  /** points so far */
  sum: number;
  /** 0..1 the roll from the sum to points per shot */
  roll: number;
  perShot: string;
  /** "÷ 1,000 shots", shown while it divides */
  divide: number;
  shots: string;
  math: string;
  /** 0..1 the arithmetic and the label under the value */
  sub: number;
  pulse: number;
}> = ({ x, y, size, opacity, sum, roll, perShot, divide, shots, math, sub, pulse }) => {
  if (opacity <= 0.001) return null;
  const s = size * (1 + 0.06 * pulse);
  const w = 560;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - s * 0.55, width: w, opacity, textAlign: "center", pointerEvents: "none" }}>
      <div style={{ fontFamily: "Figtree, sans-serif", fontWeight: 700, fontSize: s, color: "#FFFFFF", fontVariantNumeric: "tabular-nums", letterSpacing: -s * 0.02, textShadow: SHADOW }}>
        <PointsPerShotRoll a={Math.round(sum).toLocaleString("en-US")} b={perShot} p={roll} size={s} />
      </div>
      <div style={{ position: "relative", height: 44, marginTop: 2 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, fontFamily: "Figtree, sans-serif", fontWeight: 700, fontSize: 34, color: GREY, opacity: (1 - sub) * Math.min(1, sum > 0 ? 1 : 0), textShadow: SHADOW }}>
          {divide > 0.01 ? <span style={{ color: "#FFFFFF", opacity: divide }}>÷ </span> : "on "}
          {shots}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, fontFamily: "Figtree, sans-serif", fontWeight: 700, fontSize: 34, color: GREY, opacity: sub, textShadow: SHADOW }}>
          {math}
        </div>
      </div>
      <div style={{ fontFamily: "Figtree, sans-serif", fontWeight: 700, fontSize: 32, color: GREY, opacity: sub, marginTop: 2, textShadow: SHADOW }}>points per shot</div>
    </div>
  );
};

/** the cut-down BBR table: over-header, column head, and (when `cell` > 0) the League Average cell */
export const PointsPerShotCell: React.FC<{ x: number; y: number; enter: number; cell: number; lift: number; opacity: number }> = ({ x, y, enter, cell, lift, opacity }) => {
  if (enter <= 0.001 || opacity <= 0.001) return null;
  const W = 250;
  const font = "PpsDejaVu, 'DejaVu Sans', Verdana, sans-serif";
  return (
    <div
      style={{
        position: "absolute",
        left: x - W / 2,
        top: y,
        width: W,
        opacity: opacity * Math.min(1, enter * 1.4),
        transform: `translateY(${((1 - enter) * -60).toFixed(1)}px) scale(${(0.92 + 0.08 * enter).toFixed(3)})`,
        transformOrigin: "50% 0%",
        borderRadius: 14,
        overflow: "hidden",
        background: "#FFFFFF",
        boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
        fontFamily: font,
        color: "#000000",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 700, textAlign: "center", padding: "8px 0 6px", borderBottom: "1px solid #DDDDDD", color: "#222" }}>FG% by Distance</div>
      <div style={{ display: "flex", fontSize: 24, fontWeight: 700, borderBottom: "1px solid #DDDDDD", color: "#222" }}>
        <div style={{ flex: 1, textAlign: "right", padding: "6px 14px", color: "#9A9A9A" }}>10-16</div>
        <div style={{ flex: 1, textAlign: "right", padding: "6px 14px", background: "#FFF6DD" }}>16-3P</div>
      </div>
      <div style={{ height: 58 * cell, overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 700,
            background: "#EEEEEE",
            borderTop: "2px solid #747678",
            borderBottom: "2px solid #747678",
            height: 54,
            alignItems: "center",
            transform: `translateY(${((1 - cell) * -54).toFixed(1)}px)`,
          }}
        >
          <div style={{ flex: 1, textAlign: "right", padding: "0 14px", color: "#9A9A9A" }}>.446</div>
          <div style={{ flex: 1, textAlign: "right", padding: "0 14px", transform: `translateY(${(lift * -4).toFixed(1)}px)`, background: lift > 0 ? `rgba(242,179,61,${(0.0 * lift).toFixed(2)})` : undefined }}>.401</div>
        </div>
      </div>
    </div>
  );
};

/** the cell's copy that drops onto the floor and becomes the percentage */
export const PointsPerShotPct: React.FC<{ x: number; y: number; drop: number; pct: number; land: number; opacity: number }> = ({ x, y, drop, pct, land, opacity }) => {
  if (drop <= 0.001 || opacity <= 0.001) return null;
  const font = "PpsDejaVu, 'DejaVu Sans', Verdana, sans-serif";
  // the cell's ".401" in the table's face, then the floor's white "40%"
  return (
    <div style={{ position: "absolute", left: x - 200, top: y - 50, width: 400, height: 100, opacity, textAlign: "center", pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 18, fontFamily: font, fontWeight: 700, fontSize: 44, color: "#FFFFFF", opacity: 1 - land, textShadow: SHADOW }}>.401</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, fontFamily: "Figtree, sans-serif", fontWeight: 700, fontSize: 84, lineHeight: "100px", color: "#FFFFFF", opacity: land, fontVariantNumeric: "tabular-nums", textShadow: SHADOW, transform: `scale(${(0.8 + 0.2 * land).toFixed(3)})` }}>
        {Math.round(pct)}%
      </div>
    </div>
  );
};
