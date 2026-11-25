// wilt-100 "cta" (80.12-84.30 s): "Follow for the next wild NBA story, and send this to the friend who thinks 81 is
// the record."
// The creator's follow row lands and is pressed, then rises small. Two prints fall face down on the table on "story";
// on "send" they flip: the 1962 AP print of Wilt and his 100 sheet, and a fan's colour print of STAPLES Center on the
// 81 night with Kobe (#8) marked. Under each, the reel's flap counter: WILT already at 100, KOBE falling through his
// real quarter totals to 81 on "81", and Wilt's 100 tips forward once, heavier. On "is the record" the 81 print slides
// a step behind the 100, which takes the amber witness edge. Notes: notes/CtaKobeVsWilt.md.
// Parts: Kit (times, places), Follow (the follow row), Print (a two-faced print), Counter (the flap panel).
import React from "react";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadKalam } from "@remotion/google-fonts/Kalam";
import { arrive, ease, prog, useScene } from "../../../src/engine";
import { CtaKobeVsWiltCounter, ckwCounterW } from "./CtaKobeVsWiltCounter";
import { CtaKobeVsWiltFollow } from "./CtaKobeVsWiltFollow";
import {
  CKW_AMBER, CKW_COUNTER_Y, CKW_DIM, CKW_KOBE, CKW_PRINT, CKW_SMOOTH, CKW_WILT, ckwClamp, ckwLerp, ckwPrintH, ckwPrintW,
  useCtaKobeVsWiltT,
} from "./CtaKobeVsWiltKit";
import { CtaKobeVsWiltPrint } from "./CtaKobeVsWiltPrint";

const CKW_OSWALD = loadOswald("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily;
const CKW_KALAM = loadKalam("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;

// Kobe (#8, white) in the cropped STAPLES photo, in the print's image pixels
const KOBE_AT = { x: (275 / 576) * CKW_PRINT.imgW, y: (395 / 720) * CKW_PRINT.imgH };

/** a damped bump: 0 -> 1 -> 0 over dur, with a small rebound */
const ckwBump = (f: number, at: number, dur: number) => {
  if (f < at) return 0;
  const t = ckwClamp((f - at) / dur);
  return Math.sin(t * Math.PI * 1.5) * Math.exp(-3.2 * t) * (t < 1 ? 1 : 0);
};

export const CtaKobeVsWilt: React.FC = () => {
  const { f, theme } = useScene();
  const T = useCtaKobeVsWiltT();
  const ui = theme.font.ui;

  // the prints fall face down onto the table, landing on "story,"
  const fallDur = 16;
  const fallW = arrive(f, T.story - fallDur, fallDur);
  const fallK = arrive(f, T.story - fallDur + 4, fallDur);
  const landW = ckwBump(f, T.story, 16);
  const landK = ckwBump(f, T.story + 4, 16);
  // they flip on "send", Wilt first
  const flipW = prog(f, T.send - 7, 16, CKW_SMOOTH);
  const flipK = prog(f, T.send - 3, 16, CKW_SMOOTH);
  const liftW = Math.sin(flipW * Math.PI) * 0.07;
  const liftK = Math.sin(flipK * Math.PI) * 0.07;
  // the heavy 100: it tips forward as 81 lands, and the table shakes
  const thud = T.k81 + 1;
  const tip = ckwBump(f, thud, 26);
  const heavy = prog(f, thud, 10, ease.out);
  const shake = f >= thud + 5 ? Math.sin((f - thud - 5) * 1.9) * Math.exp(-(f - thud - 5) / 6) * 5 : 0;
  // "is the record.": the 81 print slides a step behind, the 100 comes forward
  const behind = prog(f, T.is - 2, 24, CKW_SMOOTH);
  const amber = prog(f, T.record, 14, ease.out);
  // the whole table keeps a slow push from "send" to the end
  const push = 1 + 0.035 * prog(f, T.send, T.end - T.send, ease.linear);
  // a warm desk light under the prints
  const lightK = prog(f, T.story - 12, 20, ease.out);

  const wilt = {
    x: ckwLerp(CKW_WILT.x, 372, behind),
    y: CKW_WILT.y - (1 - fallW) * 560 - landW * -10 + shake,
    s: (1 + (1 - fallW) * 0.3 + liftW) * (1 + 0.06 * behind) * (1 + 0.035 * heavy),
    r: CKW_WILT.rot * (1 - 0.5 * behind) + (1 - fallW) * -7,
  };
  const kobe = {
    x: ckwLerp(CKW_KOBE.x, 704, behind),
    y: CKW_KOBE.y - (1 - fallK) * 560 - landK * -10 + shake * 0.6 - 34 * behind,
    s: (1 + (1 - fallK) * 0.3 + liftK) * (1 - 0.16 * behind),
    r: CKW_KOBE.rot + (1 - fallK) * 8 + 2 * behind,
  };
  const showPrints = f >= T.story - fallDur;
  const dimK = 1 - 0.42 * behind;

  // the counters
  const wiltIn = arrive(f, T.friend - 6, 12);
  const kobeIn = arrive(f, T.who - 6, 12);
  const kobeSteps: [number, number | null][] = [
    [0, 0], [T.k81 - 22, 14], [T.k81 - 16, 26], [T.k81 - 10, 53], [T.k81 - 4, 81],
  ];
  // the Kobe label draws on "who"
  const labK = prog(f, T.who, 10, ease.out);
  // the gloss travels across the 2006 print after it turns over
  const sheen = prog(f, T.send + 10, 40, ease.inOut);

  const print = (
    who: "wilt" | "kobe",
    g: { x: number; y: number; s: number; r: number },
    flip: number,
    opacity: number,
  ) => (
    <div
      key={who}
      style={{
        position: "absolute", left: g.x - ckwPrintW / 2, top: g.y - ckwPrintH / 2, width: ckwPrintW, height: ckwPrintH,
        transform: `rotate(${g.r.toFixed(2)}deg) scale(${g.s.toFixed(4)})`, opacity,
        zIndex: who === "wilt" ? 3 : 2,
        filter: `drop-shadow(0 ${(26 + 30 * (g.s - 1)).toFixed(1)}px ${(34 + 60 * (g.s - 1)).toFixed(1)}px rgba(0,0,0,0.62))${who === "kobe" && behind > 0 ? ` brightness(${dimK.toFixed(3)})` : ""}`,
      }}
    >
      {who === "wilt" ? (
        <CtaKobeVsWiltPrint
          era="1962" src="wilt-100/ctakobevswilt-wilt100.jpg" hand="Wilt, 1962" credit="AP photo by Paul Vathis, public domain"
          backLines={["Hershey, Pa.", "1962"]} flip={flip} sheen={0} amber={amber} hand2Font={CKW_KALAM} uiFont={ui}
        />
      ) : (
        <CtaKobeVsWiltPrint
          era="2006" src="wilt-100/ctakobevswilt-kobe81.jpg" hand="Kobe, 2006" credit="endlessbender, CC BY 2.0"
          backLines={["Los Angeles", "2006"]} flip={flip} sheen={sheen} amber={0} hand2Font={CKW_KALAM} uiFont={ui}
        >
          {labK > 0 && (
            <svg width={CKW_PRINT.imgW} height={CKW_PRINT.imgH} style={{ position: "absolute", inset: 0 }}>
              <circle cx={KOBE_AT.x} cy={KOBE_AT.y - 4} r={20 + 6 * (1 - labK)} fill="none" stroke="#FFFFFF" strokeWidth={2.4} opacity={labK} />
              <line x1={KOBE_AT.x - 14} y1={KOBE_AT.y - 20} x2={KOBE_AT.x - 14 - 60 * labK} y2={KOBE_AT.y - 20 - 86 * labK} stroke="#FFFFFF" strokeWidth={2} />
              <text x={KOBE_AT.x - 74} y={KOBE_AT.y - 116} textAnchor="middle" fontFamily={ui} fontWeight={700} fontSize={34} fill="#FFFFFF" opacity={labK}
                stroke="rgba(0,0,0,0.75)" strokeWidth={6} paintOrder="stroke">Kobe</text>
            </svg>
          )}
        </CtaKobeVsWiltPrint>
      )}
    </div>
  );

  const counter = (who: "wilt" | "kobe", k: number) => {
    const g = who === "wilt" ? wilt : kobe;
    const x = g.x;
    const y = CKW_COUNTER_Y + (who === "wilt" ? 14 * heavy + 30 * behind : 0) - (1 - k) * 80 + (who === "kobe" ? -40 * behind : shake * 0.5);
    const s = who === "wilt" ? (0.95 + 0.1 * heavy) * (1 + 0.05 * behind) : 0.95 * (1 - 0.16 * behind);
    const tilt = who === "wilt" ? -42 * tip : 0;
    return (
      <div
        key={`c-${who}`}
        style={{
          position: "absolute", left: x - ckwCounterW / 2, top: y - 48, width: ckwCounterW, height: 96,
          transform: `perspective(700px) translateY(${(who === "wilt" ? 18 * tip : 0).toFixed(2)}px) rotateX(${tilt.toFixed(2)}deg) scale(${s.toFixed(4)})`,
          transformOrigin: "50% 100%", opacity: k, zIndex: who === "wilt" ? 5 : 4,
          filter: `${k < 1 ? `blur(${((1 - k) * 10).toFixed(1)}px)` : ""}${who === "kobe" && behind > 0 ? ` brightness(${dimK.toFixed(3)})` : ""}` || undefined,
        }}
      >
        <CtaKobeVsWiltCounter
          f={f} name={who === "wilt" ? "WILT" : "KOBE"} font={CKW_OSWALD}
          steps={who === "wilt" ? [[0, 100]] : kobeSteps}
          nameColor={who === "wilt" && amber > 0 ? mixHex(CKW_DIM, CKW_AMBER, amber) : CKW_DIM}
        />
      </div>
    );
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push.toFixed(4)})`, transformOrigin: "540px 1000px" }}>
        <div
          style={{
            position: "absolute", left: 40, top: 640, width: 1000, height: 820, opacity: lightK,
            background: "radial-gradient(ellipse 50% 48% at 50% 52%, rgba(242,214,160,0.10), rgba(242,214,160,0.04) 55%, rgba(0,0,0,0) 100%)",
          }}
        />
        {showPrints && print("kobe", kobe, flipK, prog(f, T.story - fallDur + 4, 5, ease.linear))}
        {showPrints && print("wilt", wilt, flipW, prog(f, T.story - fallDur, 5, ease.linear))}
        {f >= T.who - 6 && counter("kobe", kobeIn)}
        {f >= T.friend - 6 && counter("wilt", wiltIn)}
      </div>
      <CtaKobeVsWiltFollow f={f} T={T} font={ui} />
    </div>
  );
};

/** hex blend for the WILT label turning amber */
function mixHex(a: string, b: string, k: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(",")})`;
}
