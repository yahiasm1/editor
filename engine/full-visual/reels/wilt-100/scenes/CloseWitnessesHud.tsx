// wilt-100 "close": what sits on the picture. The reel's thread counter, a 1962 arena flip panel at 100 with "WILT"
// above it, over the roof as in the hook and holding over the map at the end; and the four witnesses' small grey
// labels on hairlines, each on its word, gone as the camera rises.
import React from "react";
import { ease, prog } from "../../../src/engine";
import {
  CW_DIM, CW_FANS, CW_FLASH, CW_RADIO, type CloseWitnessesT, type CwView, type V3, cwClamp, cwLerp,
} from "./CloseWitnessesKit";
import { cwBallPos } from "./CloseWitnessesWorld";

export const CloseWitnessesCounter: React.FC<{ f: number; T: CloseWitnessesT; font: string }> = ({ f, T, font }) => {
  const inAt = T.greatest + 6;
  if (f < inAt) return null;
  const k = prog(f, inAt, 12, ease.out);
  const rise = prog(f, T.almost - 8, T.saw + 8 - (T.almost - 8), ease.inOut);
  const x = 540;
  const y = cwLerp(640, 690, rise) + (1 - k) * -40;
  const s = cwLerp(0.8, 0.86, rise);
  // as it lands on "saw" it settles with a single heavy nod, the 100 that stays
  const nod = f > T.saw ? Math.sin(cwClamp((f - T.saw) / 14) * Math.PI) * 3 * (1 - cwClamp((f - T.saw) / 14)) : 0;
  const digits = ["1", "0", "0"];
  const fw = 66, fh = 96, gap = 8;
  const w = digits.length * fw + (digits.length - 1) * gap;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - fh / 2 + nod, width: w, height: fh, transform: `scale(${s})`, transformOrigin: "50% 50%", opacity: k, filter: k < 1 ? `blur(${((1 - k) * 10).toFixed(2)}px)` : undefined }}>
      <div style={{ position: "absolute", left: 0, top: -44, width: w, textAlign: "center", fontFamily: font, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: CW_DIM }}>WILT</div>
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

type Lab = { text: string; at: number; p: V3; dx: number; dy: number; anchor: "start" | "end" | "middle" };

export const CloseWitnessesLabels: React.FC<{ f: number; T: CloseWitnessesT; V: CwView; font: string }> = ({ f, T, V, font }) => {
  const out = prog(f, T.almost - 4, 8, ease.in);
  if (out >= 1) return null;
  const labs: Lab[] = [
    { text: "4,124 fans", at: T.scoring, p: CW_FANS, dx: 40, dy: -150, anchor: "start" },
    { text: "the radio", at: T.night, p: CW_RADIO, dx: 150, dy: 70, anchor: "start" },
    { text: "the flashbulb", at: T.ever, p: CW_FLASH, dx: -170, dy: 110, anchor: "middle" },
    { text: "the ball", at: T.and, p: cwBallPos(f, T), dx: -20, dy: 130, anchor: "middle" },
  ];
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {labs.map((l) => {
        if (f < l.at - 2) return null;
        const k = prog(f, l.at - 2, 7, ease.out);
        const q = V.P(l.p);
        const tx = q.x + l.dx, ty = q.y + l.dy;
        // the hairline runs from the witness to the label, drawn out on its word
        const ex = cwLerp(q.x, tx, k), ey = cwLerp(q.y, ty + (l.dy < 0 ? 12 : -38), k);
        return (
          <g key={l.text}>
            <line x1={q.x} y1={q.y} x2={ex} y2={ey} stroke={CW_DIM} strokeWidth={1.6} opacity={0.85} />
            <circle cx={q.x} cy={q.y} r={3} fill={CW_DIM} opacity={k} />
            <text x={tx} y={ty} textAnchor={l.anchor} fontFamily={font} fontWeight={500} fontSize={32} fill={CW_DIM} opacity={k}
              style={{ filter: k < 1 ? `blur(${((1 - k) * 8).toFixed(2)}px)` : undefined }}
              stroke="#0B1015" strokeWidth={6} paintOrder="stroke">{l.text}</text>
          </g>
        );
      })}
    </svg>
  );
};
