// wilt-100 "hershey": the reel's thread counter (a 1962 arena flip-number panel, white numerals on black flaps, a
// small grey WILT above), handed over from the hook at the top centre, parked small in the top-left corner on "March".
import React from "react";
import { ease, prog } from "../../../src/engine";
import { HTM_DIM, type HersheyT, htmLerp } from "./HersheyTicketMapKit";

export const HersheyTicketMapCounter: React.FC<{ f: number; T: HersheyT; font: string }> = ({ f, T, font }) => {
  if (f < T.born) return null;
  const k = prog(f, T.march - 2, 16, ease.inOut);
  const x = htmLerp(540, 118, k);
  const y = htmLerp(600, 574, k);
  const s = htmLerp(0.9, 0.5, k);
  const digits = ["1", "0", "0"];
  const fw = 66, fh = 96, gap = 8;
  const w = digits.length * fw + (digits.length - 1) * gap;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - fh / 2, width: w, height: fh, transform: `scale(${s})`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", left: 0, top: -44, width: w, textAlign: "center", fontFamily: font, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: HTM_DIM }}>WILT</div>
      {digits.map((d, i) => (
        <div key={i} style={{ position: "absolute", left: i * (fw + gap), top: 0, width: fw, height: fh, borderRadius: 7, background: "linear-gradient(#1E2024 0%, #111215 49%, #050506 51%, #15161A 100%)", boxShadow: "0 6px 14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, fontWeight: 700, fontSize: 78, color: "#F4F4F2", lineHeight: 1 }}>{d}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: fh / 2 - 1, height: 2, background: "#000" }} />
          <div style={{ position: "absolute", left: 2, top: fh / 2 - 4, width: 4, height: 8, borderRadius: 2, background: "#3A3C40" }} />
          <div style={{ position: "absolute", right: 2, top: fh / 2 - 4, width: 4, height: 8, borderRadius: 2, background: "#3A3C40" }} />
        </div>
      ))}
    </div>
  );
};
