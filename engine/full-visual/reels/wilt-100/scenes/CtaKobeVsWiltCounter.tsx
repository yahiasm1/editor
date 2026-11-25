// wilt-100 "cta": the reel's thread counter, the 1962 arena split-flap panel (66 x 96 black flaps, hinge line, pins,
// small grey name above), the same object as in the hook, `record` and `close`. Two of them here: WILT already at 100,
// and KOBE, whose flaps fall through his real quarter totals (14, 26, 53, 81) to land on "81".
import React from "react";
import { ease, prog } from "../../../src/engine";
import { CKW_DIM } from "./CtaKobeVsWiltKit";

const FW = 66, FH = 96, GAP = 8, FLIP = 5;
export const ckwCounterW = 3 * FW + 2 * GAP;

const CtaKobeVsWiltFace: React.FC<{ d: string; half: "top" | "bottom"; font: string }> = ({ d, half, font }) => (
  <div style={{ position: "absolute", left: 0, top: half === "top" ? 0 : -FH / 2, width: FW, height: FH }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 7, background: "linear-gradient(#1E2024 0%, #111215 49%, #050506 51%, #15161A 100%)" }} />
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, fontWeight: 700, fontSize: 78, color: "#F4F4F2", lineHeight: 1 }}>{d.trim()}</div>
  </div>
);

const CtaKobeVsWiltHalf: React.FC<{ d: string; half: "top" | "bottom"; font: string; rot?: number; shade?: number }> = ({ d, half, font, rot = 0, shade = 0 }) => (
  <div
    style={{
      position: "absolute", left: 0, top: half === "top" ? 0 : FH / 2, width: FW, height: FH / 2, overflow: "hidden",
      transformOrigin: half === "top" ? "50% 100%" : "50% 0%",
      transform: rot ? `perspective(300px) rotateX(${rot.toFixed(1)}deg)` : undefined,
      backfaceVisibility: "hidden",
    }}
  >
    <CtaKobeVsWiltFace d={d} half={half} font={font} />
    {shade > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${shade.toFixed(3)})` }} />}
  </div>
);

const CtaKobeVsWiltFlap: React.FC<{ from: string; to: string; k: number; font: string }> = ({ from, to, k, font }) => {
  const moving = from !== to && k < 1;
  return (
    <div style={{ position: "relative", width: FW, height: FH, borderRadius: 7, boxShadow: "0 6px 14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
      <CtaKobeVsWiltHalf d={to} half="top" font={font} shade={moving ? 0.35 * (1 - k) : 0} />
      <CtaKobeVsWiltHalf d={moving ? from : to} half="bottom" font={font} shade={moving && k >= 0.5 ? 0.3 * (k - 0.5) * 2 : 0} />
      {moving && k < 0.5 && <CtaKobeVsWiltHalf d={from} half="top" font={font} rot={-180 * k} shade={0.5 * k} />}
      {moving && k >= 0.5 && <CtaKobeVsWiltHalf d={to} half="bottom" font={font} rot={180 * (1 - k)} shade={0.4 * (1 - k)} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: FH / 2 - 1, height: 2, background: "#000" }} />
      <div style={{ position: "absolute", left: 2, top: FH / 2 - 4, width: 4, height: 8, borderRadius: 2, background: "#3A3C40" }} />
      <div style={{ position: "absolute", right: 2, top: FH / 2 - 4, width: 4, height: 8, borderRadius: 2, background: "#3A3C40" }} />
    </div>
  );
};

const ckwDigits = (v: number | null) => (v === null ? "   " : String(v).padStart(3, " ")).split("");

/** a flap panel: `steps` are [frame, value]; it shows the value of the last step reached, each change a real flap fall */
export const CtaKobeVsWiltCounter: React.FC<{
  f: number; name: string; steps: [number, number | null][]; font: string; nameColor?: string;
}> = ({ f, name, steps, font, nameColor = CKW_DIM }) => {
  let i = 0;
  while (i < steps.length - 1 && f >= steps[i + 1][0]) i++;
  const [at, val] = steps[i];
  const prev = i > 0 ? steps[i - 1][1] : val;
  const k = prog(f, at, FLIP, ease.linear);
  const a = ckwDigits(prev), b = ckwDigits(val);
  return (
    <div style={{ position: "relative", width: ckwCounterW, height: FH }}>
      <div style={{ position: "absolute", left: -40, top: -46, width: ckwCounterW + 80, textAlign: "center", fontFamily: font, fontWeight: 600, fontSize: 32, letterSpacing: 6, color: nameColor }}>{name}</div>
      {b.map((d, j) => (
        <div key={j} style={{ position: "absolute", left: j * (FW + GAP), top: 0 }}>
          <CtaKobeVsWiltFlap from={a[j]} to={d} k={k} font={font} />
        </div>
      ))}
    </div>
  );
};
