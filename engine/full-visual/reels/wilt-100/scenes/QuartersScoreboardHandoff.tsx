// wilt-100 "quarters": what comes in from `record`. Row 76 of the real game log ("76 1962-03-02 N NYK W, 169-147",
// its PTS still under the cream slip) tears off the page where `record` left it and flies up out of the frame, the
// night we are about to watch; the WILT flip counter, parked small at 0 top right, flies with the camera up the end
// wall and docks into the board's player panel.
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { ease, prog } from "../../../src/engine";
import { type QuartersT, qsLerp, qsRnd } from "./QuartersScoreboardKit";

const FAM = "QS DejaVu Sans";
export function useQuartersFont() {
  const [h] = useState(() => delayRender("DejaVu Sans for the torn game log row"));
  useEffect(() => {
    const faces = [
      new FontFace(FAM, `url(${staticFile("wilt-100/recordgamelog-dejavusans.ttf")})`, { weight: "400" }),
      new FontFace(FAM, `url(${staticFile("wilt-100/recordgamelog-dejavusans-bold.ttf")})`, { weight: "700" }),
    ];
    Promise.all(faces.map((x) => x.load()))
      .then((ok) => {
        ok.forEach((x) => (document.fonts as unknown as { add: (ff: FontFace) => void }).add(x));
        continueRender(h);
      })
      .catch(() => continueRender(h));
  }, [h]);
}

// the jagged tear along both long edges, fixed for the reel
const TEAR = (() => {
  const top: string[] = [], bot: string[] = [];
  const n = 40;
  for (let i = 0; i <= n; i++) top.push(`${((i / n) * 100).toFixed(2)}% ${(qsRnd(i * 2.3) * 9).toFixed(1)}px`);
  for (let i = n; i >= 0; i--) bot.push(`${((i / n) * 100).toFixed(2)}% calc(100% - ${(qsRnd(i * 5.9 + 1) * 9).toFixed(1)}px)`);
  return `polygon(${[...top, ...bot].join(", ")})`;
})();

export const QuartersScoreboardStrip: React.FC<{ f: number; T: QuartersT }> = ({ f, T }) => {
  if (f > T.that + 40) return null;
  // lifted off the page as the page leaves: it brightens, rises a hair and tilts, then flies up and out
  const lift = prog(f, T.born, 10, ease.out);
  const fly = prog(f, T.that + 2, 34, ease.in);
  // it veers right first, so it climbs past the board's right edge and out over the top corner, never across its face
  const side = Math.pow(fly, 0.55);
  const x = 486 + 8 * lift + 760 * side;
  const y = 1296 - 26 * lift - 1500 * fly;
  const rot = 0.7 - 2.2 * lift - 14 * fly;
  const sc = 1 + 0.04 * lift + 0.2 * fly;
  const v = (prog(f, T.that + 2, 34, ease.in) - prog(f - 1, T.that + 2, 34, ease.in)) * 1500;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: 590, height: 50, transformOrigin: "50% 50%",
        transform: `rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`,
        filter: `brightness(${(0.4 + 0.6 * lift).toFixed(3)}) drop-shadow(0 ${(8 + 20 * lift).toFixed(0)}px ${(10 + 18 * lift).toFixed(0)}px rgba(0,0,0,0.55))${v > 6 ? ` blur(${Math.min(10, v * 0.06).toFixed(1)}px)` : ""}`,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "#F7F6F2", clipPath: TEAR }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(239,238,237,0.9)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 9, height: 32, fontFamily: FAM, fontSize: 24, lineHeight: "32px", color: "#000", whiteSpace: "nowrap" }}>
          <span style={{ position: "absolute", right: 590 - 54, color: "#6B6E72" }}>76</span>
          <span style={{ position: "absolute", left: 70, textDecoration: "underline", textUnderlineOffset: 3, color: "#2A2D31" }}>1962-03-02</span>
          <span style={{ position: "absolute", left: 230, width: 16, textAlign: "center" }}>N</span>
          <span style={{ position: "absolute", left: 262, textDecoration: "underline", textUnderlineOffset: 3, color: "#2A2D31" }}>NYK</span>
          <span style={{ position: "absolute", left: 334, textDecoration: "underline", textUnderlineOffset: 3, color: "#2A2D31" }}>W, 169-147</span>
        </div>
        {/* the torn fibres: a faint light rim along each tear */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, background: "linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0))" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 10, background: "linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.9))" }} />
      </div>
      {/* the cream slip still taped over the PTS */}
      <div style={{ position: "absolute", left: 648 - 84, top: 2, width: 96, height: 46, transform: "rotate(-4deg)", background: "#EFE6D2", boxShadow: "0 3px 6px rgba(0,0,0,0.35)", borderRadius: 2 }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.35, background: "repeating-linear-gradient(115deg, rgba(120,100,70,0.10) 0 2px, transparent 2px 5px)" }} />
        <div style={{ position: "absolute", left: 30, top: -8, width: 36, height: 16, background: "rgba(236,226,190,0.75)", transform: "rotate(6deg)" }} />
      </div>
    </div>
  );
};

/** the WILT counter in flight, from `record`'s parking place to the board's panel. Returns null once docked. */
const FW = 66, FH = 96, GAP = 8;
export function qsDockK(f: number, T: QuartersT) {
  return prog(f, T.that - 4, 44, ease.inOut);
}
export const QuartersScoreboardCounter: React.FC<{ f: number; T: QuartersT; to: { x: number; y: number; unit: number }; font: string }> = ({ f, T, to, font }) => {
  const k = qsDockK(f, T);
  if (k >= 0.999) return null;
  const e = k;
  const x = qsLerp(948, to.x, e), y = qsLerp(556, to.y, e) - Math.sin(e * Math.PI) * 120;
  const s = qsLerp(0.46, to.unit, e);
  const w = 3 * FW + 2 * GAP;
  const lbl = 1 - Math.min(1, Math.max(0, (k - 0.3) / 0.25)); // the grey WILT label is gone before the painted WILT 13 (prog() clamps dur to 1 frame, so not prog here)
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - FH / 2, width: w, height: FH, transform: `scale(${s.toFixed(4)})`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", left: 0, top: -44, width: w, textAlign: "center", fontFamily: font, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: "#8B949E", opacity: lbl }}>WILT</div>
      {[" ", " ", "0"].map((d, i) => (
        <div key={i} style={{ position: "absolute", left: i * (FW + GAP), top: 0, width: FW, height: FH, borderRadius: 7, background: "linear-gradient(#1E2024 0%, #111215 49%, #050506 51%, #15161A 100%)", boxShadow: "0 6px 14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, fontWeight: 700, fontSize: 78, color: "#F4F4F2", lineHeight: 1 }}>{d.trim()}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: FH / 2 - 1, height: 2, background: "#000" }} />
          <div style={{ position: "absolute", left: 2, top: FH / 2 - 4, width: 4, height: 8, borderRadius: 2, background: "#3A3C40" }} />
          <div style={{ position: "absolute", right: 2, top: FH / 2 - 4, width: 4, height: 8, borderRadius: 2, background: "#3A3C40" }} />
        </div>
      ))}
    </div>
  );
};
