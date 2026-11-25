// wilt-100 "record": the photo card (the 1962 Commons print, cropped to head and shoulders above its SAN FRANCISCO
// lettering), the live season average that rolls with every typed row and lands on 50.4, and the record-book slip.
import React from "react";
import { Img, staticFile } from "remotion";
import { arrive, blurIn, draw, ease, prog, typeOn } from "../../../src/engine";
import { RGL_AVG, RGL_COURIER, RGL_DIM, RGL_HAIR, RGL_CARD, RGL_INK, RGL_PAPER, RGL_PUSH, rglLerp, rglTyped, type RecordT } from "./RecordGameLogKit";

type Font = { ui: string; mono: string; caption: string };

// the card, drawn at its big size; it shrinks to the left third by transform
const CW = 620, PW = 584, PH = 592, CH = 18 + PH + 72;
const BIG = { x: 199, y: 690, s: 1.1 };
const SMALL = { x: 90, y: 566, s: 0.452 };

export const RecordGameLogPhoto: React.FC<{ f: number; T: RecordT; font: Font }> = ({ f, T, font }) => {
  const a = arrive(f, T.born, 20);
  const k = prog(f, T.hundredEnd + 2, 22, RGL_PUSH);
  const back = prog(f, T.fifty, 24, ease.inOut);
  const x = rglLerp(BIG.x, SMALL.x, k);
  const y = rglLerp(BIG.y, SMALL.y, k) + (1 - a) * 320;
  const s = rglLerp(BIG.s, SMALL.s, k) + (0.6 - SMALL.s) * back;
  // slow push in on his face all the way through, faster while he is the only picture
  const push = 1.02 + 0.1 * prog(f, T.born, T.that - T.born, ease.linear) + 0.05 * prog(f, T.that, T.end - T.that, ease.linear);
  const label = 1 - prog(f, T.hundredEnd + 2, 8, ease.linear);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: CW, height: CH, transformOrigin: "0 0", transform: `scale(${s.toFixed(4)})`, opacity: prog(f, T.born, 3, ease.linear), filter: a < 0.9 ? `blur(${((1 - a) * 12).toFixed(1)}px)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: RGL_CARD, border: `1.5px solid ${RGL_HAIR}`, boxShadow: `0 ${30 + 10 * back}px 70px rgba(0,0,0,0.55)` }} />
      <div style={{ position: "absolute", left: 18, top: 18, width: PW, height: PH, borderRadius: 12, overflow: "hidden", background: "#222" }}>
        <Img src={staticFile("wilt-100/recordgamelog-wilt-1962.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push.toFixed(4)})`, transformOrigin: "52% 30%", filter: "grayscale(1) contrast(1.08) brightness(1.04)" }} />
        {/* the print's own grain and a little light falling from the top left */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 10%, rgba(255,255,255,0.10), rgba(0,0,0,0.25) 85%)" }} />
        <div style={{ position: "absolute", right: 12, top: 10, padding: "3px 10px", borderRadius: 6, background: "rgba(13,17,23,0.72)", fontFamily: font.ui, fontSize: 22, color: RGL_DIM }}>Public domain</div>
      </div>
      <div style={{ position: "absolute", left: 26, top: 18 + PH + 18, fontFamily: font.ui, fontWeight: 600, fontSize: 34, color: "#E6EDF3", opacity: label }}>Wilt Chamberlain</div>
      <div style={{ position: "absolute", right: 26, top: 18 + PH + 22, fontFamily: font.ui, fontSize: 30, color: RGL_DIM, opacity: label }}>1962</div>
    </div>
  );
};

// the live average: under the photo while the rows type, then big beside the photo
const AV = { x: 230, y: 1040 }; // centre of the number while it rolls
const AV_END = { x: 735, y: 764 };
const AV_FS = 112, AV_END_FS = 210;

export const RecordGameLogAverage: React.FC<{ f: number; T: RecordT; font: Font }> = ({ f, T, font }) => {
  const showAt = T.rowAt(1);
  if (f < showAt - 8) return null;
  const n = Math.max(1, rglTyped(f, T));
  const t = T.rowAt(n);
  const v = n >= 80 ? RGL_AVG[80] : rglLerp(RGL_AVG[n - 1] || RGL_AVG[1], RGL_AVG[n], prog(f, t, 3, ease.out));
  const txt = (Math.round(v * 10) / 10).toFixed(1);
  const g = prog(f, T.fifty, 18, RGL_PUSH);
  const hold = prog(f, T.fifty + 18, T.end - T.fifty - 18, ease.linear);
  const rec = f >= T.record ? Math.sin(prog(f, T.record, 14, ease.linear) * Math.PI) : 0;
  const x = rglLerp(AV.x, AV_END.x, g);
  const y = rglLerp(AV.y, AV_END.y, g);
  const s = rglLerp(1, AV_END_FS / AV_FS, g) * (1 + 0.035 * hold + 0.04 * rec);
  const lab = 1 - prog(f, T.fifty, 6, ease.linear);
  const landed = f >= T.fifty;
  const scrim = prog(f, T.fifty + 4, 18, ease.out);
  return (
    <>
      {/* a pool of night behind the landed number, so it reads over the dimmed page */}
      {/* wide enough to swallow the page's h1, heading and thead behind the number and its label (no fragments) */}
      <div style={{ position: "absolute", left: AV_END.x + 55 - 450, top: AV_END.y - 260, width: 900, height: 520, opacity: scrim, background: "radial-gradient(ellipse closest-side at 50% 50%, rgba(13,17,23,0.96) 0%, rgba(13,17,23,0.93) 62%, rgba(13,17,23,0) 100%)" }} />
      <div style={{ ...blurIn(f, showAt - 8, { dur: 8 }), position: "absolute", left: 90, top: 912, width: 280 }}>
        <div style={{ opacity: lab, borderTop: `1px solid ${RGL_HAIR}`, paddingTop: 10, fontFamily: font.ui, fontSize: 32, color: RGL_DIM }}>season average</div>
      </div>
      <div style={{ position: "absolute", left: x - 300, top: y - AV_FS * 0.6, width: 600, height: AV_FS * 1.2, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s.toFixed(4)})`, ...(!landed ? { opacity: prog(f, showAt - 8, 6, ease.linear) } : {}) }}>
        <span style={{ fontFamily: font.ui, fontWeight: 800, fontSize: AV_FS, color: "#FFFFFF", fontVariantNumeric: "tabular-nums", letterSpacing: -2, textShadow: `0 ${landed ? 8 : 0}px 30px rgba(0,0,0,0.6)` }}>{txt}</span>
      </div>
      <div style={{ position: "absolute", left: 90, top: 1112, width: 300, fontFamily: font.ui, fontSize: 32, color: RGL_DIM, opacity: lab * prog(f, showAt, 6, ease.linear), fontVariantNumeric: "tabular-nums" }}>
        after {n} {n === 1 ? "game" : "games"}
      </div>
      {/* once it lands: what the number is */}
      <div style={{ ...blurIn(f, T.points - 4, { dur: 8, rise: 10 }), position: "absolute", left: AV_END.x - 260, width: 520, top: 884, textAlign: "center", fontFamily: font.ui, fontSize: 32, color: RGL_DIM }}>
        per game, 1961-62
      </div>
    </>
  );
};

// the record-book slip, typed under the 50.4
const L1 = "Most points per game, season:";
const L2 = "50.4, Wilt Chamberlain, 1961-62";

export const RecordGameLogSlip: React.FC<{ f: number; T: RecordT; fps: number }> = ({ f, T, fps }) => {
  const at = T.which - 8;
  if (f < at) return null;
  const a = arrive(f, at, 14);
  const ms = ((T.record - 2 - (at + 8)) / fps) * 1000 / (L1.length + L2.length);
  const t1 = typeOn(L1, f, at + 8, fps, ms);
  const t2 = typeOn(L2, f, at + 8 + Math.ceil((L1.length * ms * fps) / 1000), fps, ms);
  const typing = t1.typing || t2.typing;
  return (
    <div style={{ position: "absolute", left: 112, top: 1012 + (1 - a) * 120, width: 856, height: 174, transform: `rotate(-1.2deg)`, opacity: prog(f, at, 3, ease.linear), filter: a < 0.9 ? `blur(${((1 - a) * 10).toFixed(1)}px)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, background: RGL_PAPER, borderRadius: 4, boxShadow: "0 24px 50px rgba(0,0,0,0.55), 0 3px 8px rgba(0,0,0,0.35)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 4, opacity: 0.5, background: "repeating-linear-gradient(93deg, rgba(120,100,70,0.07) 0 1px, transparent 1px 4px), radial-gradient(ellipse at 80% 120%, rgba(150,120,80,0.18), transparent 60%)" }} />
      <div style={{ position: "absolute", left: 40, top: 34, fontFamily: RGL_COURIER, fontSize: 38, color: RGL_INK, whiteSpace: "pre" }}>
        {t1.text}
        {t1.typing && <span style={{ opacity: 0.8 }}>|</span>}
      </div>
      <div style={{ position: "absolute", left: 40, top: 92, fontFamily: RGL_COURIER, fontWeight: 700, fontSize: 40, color: RGL_INK, whiteSpace: "pre" }}>
        {t2.text}
        {t2.typing && <span style={{ opacity: 0.8 }}>|</span>}
      </div>
      {/* on "record": a pen line under the 50.4 */}
      <svg width={140} height={30} style={{ position: "absolute", left: 34, top: 138, overflow: "visible" }}>
        <path d="M4 14 C 40 8, 80 18, 132 10" fill="none" stroke={RGL_INK} strokeWidth={4} strokeLinecap="round" {...draw(f, T.record, 10)} opacity={f >= T.record && !typing ? 0.85 : 0} />
      </svg>
    </div>
  );
};
