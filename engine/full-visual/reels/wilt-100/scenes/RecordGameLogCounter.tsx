// wilt-100 "record": the thread counter, the 1962 arena split-flap panel (the same 66 x 96 black flaps, hinge line,
// hinge pins and small grey WILT as in the hook and `hershey`). On "score" it drops in at the top of the stage and its
// flaps run up to 100; on "100?" it locks with one bounce; then the flaps run back down to 0 and it parks small.
// Each change is a real flap fall: the old top half folds down over the hinge, the new bottom half lands under it.
import React from "react";
import { arrive, ease, prog } from "../../../src/engine";
import { RGL_DIM, rglLerp, type RecordT } from "./RecordGameLogKit";

const FW = 66, FH = 96, GAP = 8, FLIP = 5;

/** the counter's steps: [frame, value] */
function rglSteps(T: RecordT): [number, number][] {
  const up = [12, 31, 52, 70, 84, 95, 100];
  const down = [81, 57, 33, 14, 3, 0];
  const s: [number, number][] = [[T.born, 0]];
  const span = T.hundred - T.score;
  up.forEach((v, i) => s.push([Math.round(T.score + (span * (i + 1)) / up.length) - 1, v]));
  const d0 = T.hundred + 20;
  down.forEach((v, i) => s.push([d0 + i * 4, v]));
  return s;
}

const digitsOf = (v: number) => {
  const t = String(v).padStart(3, " ");
  return t.split("");
};

const Face: React.FC<{ d: string; half: "top" | "bottom"; font: string }> = ({ d, half, font }) => (
  <div style={{ position: "absolute", left: 0, top: half === "top" ? 0 : -FH / 2, width: FW, height: FH }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 7, background: "linear-gradient(#1E2024 0%, #111215 49%, #050506 51%, #15161A 100%)" }} />
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, fontWeight: 700, fontSize: 78, color: "#F4F4F2", lineHeight: 1 }}>{d.trim()}</div>
  </div>
);

const Half: React.FC<{ d: string; half: "top" | "bottom"; font: string; rot?: number; shade?: number }> = ({ d, half, font, rot = 0, shade = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: half === "top" ? 0 : FH / 2,
      width: FW,
      height: FH / 2,
      overflow: "hidden",
      transformOrigin: half === "top" ? "50% 100%" : "50% 0%",
      transform: rot ? `perspective(300px) rotateX(${rot.toFixed(1)}deg)` : undefined,
      backfaceVisibility: "hidden",
    }}
  >
    <Face d={d} half={half} font={font} />
    {shade > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${shade.toFixed(3)})` }} />}
  </div>
);

const Flap: React.FC<{ from: string; to: string; k: number; font: string }> = ({ from, to, k, font }) => {
  const moving = from !== to && k < 1;
  return (
    <div style={{ position: "relative", width: FW, height: FH, borderRadius: 7, boxShadow: "0 6px 14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
      {/* behind: the new top half, the old bottom half until the falling flap covers it */}
      <Half d={to} half="top" font={font} shade={moving ? 0.35 * (1 - k) : 0} />
      <Half d={moving ? from : to} half="bottom" font={font} shade={moving && k >= 0.5 ? 0.3 * (k - 0.5) * 2 : 0} />
      {moving && k < 0.5 && <Half d={from} half="top" font={font} rot={-180 * k} shade={0.5 * k} />}
      {moving && k >= 0.5 && <Half d={to} half="bottom" font={font} rot={180 * (1 - k)} shade={0.4 * (1 - k)} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: FH / 2 - 1, height: 2, background: "#000" }} />
      <div style={{ position: "absolute", left: 2, top: FH / 2 - 4, width: 4, height: 8, borderRadius: 2, background: "#3A3C40" }} />
      <div style={{ position: "absolute", right: 2, top: FH / 2 - 4, width: 4, height: 8, borderRadius: 2, background: "#3A3C40" }} />
    </div>
  );
};

export const RecordGameLogCounter: React.FC<{ f: number; T: RecordT; font: string }> = ({ f, T, font }) => {
  const enterAt = T.score - 12;
  if (f < enterAt) return null;
  const steps = rglSteps(T);
  let i = 0;
  while (i < steps.length - 1 && f >= steps[i + 1][0]) i++;
  const [at, val] = steps[i];
  const prev = i > 0 ? steps[i - 1][1] : val;
  const k = prog(f, at, FLIP, ease.linear);
  const a = digitsOf(prev), b = digitsOf(val);

  // drop in from above the stage, lock-bounce on "100?", then park small at the top right
  const drop = arrive(f, enterAt, 14);
  const bounce = f >= T.hundred ? Math.sin(prog(f, T.hundred, 16, ease.linear) * Math.PI) * (1 - prog(f, T.hundred, 16, ease.linear)) : 0;
  const park = prog(f, T.hundredEnd + 4, 18, ease.inOut);
  const x = rglLerp(540, 948, park);
  const y = rglLerp(612, 556, park) - (1 - drop) * 160 - bounce * 34;
  const s = rglLerp(1, 0.46, park) * (1 + bounce * 0.06);
  const w = 3 * FW + 2 * GAP;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - FH / 2, width: w, height: FH, transform: `scale(${s.toFixed(4)})`, transformOrigin: "50% 50%", opacity: prog(f, enterAt, 4, ease.linear), filter: drop < 0.85 ? `blur(${((1 - drop) * 10).toFixed(1)}px)` : undefined }}>
      <div style={{ position: "absolute", left: 0, top: -44, width: w, textAlign: "center", fontFamily: font, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: RGL_DIM }}>WILT</div>
      {b.map((d, j) => (
        <div key={j} style={{ position: "absolute", left: j * (FW + GAP), top: 0 }}>
          <Flap from={a[j]} to={d} k={k} font={font} />
        </div>
      ))}
    </div>
  );
};
