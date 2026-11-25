// wilt-100 hook X1: the 1962 flip-number panel, WILT above, "points" below, bolted on the end arch (its plane read
// from the camera, so it sits on the concrete in perspective). Real split flaps: the old digit's top half falls over
// its hinge, the new digit's bottom half lands under it. 0, 23, 41, 69 inside the first second, faster on "scored",
// the "1" slammed in on "100" with a bounce. On "saw" the flaps lift off the bracket and fly up, flat, to the top
// centre, where `hershey` picks them up (540, 600, scale 0.9, the same flaps and the same WILT).
import React from "react";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { Easing } from "remotion";
import { ease, prog } from "../../../src/engine";
import { HX1_DIM, type HookX1T, type HX1View, hx1Body, hx1Lerp, hx1Points, hx1SignPt, hx1Slam } from "./HookX1Kit";

const HX1_OSWALD = loadOswald("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily;
const FW = 66, FH = 96, GAP = 8;
const WIDTH = 3 * FW + 2 * GAP;
const FACE = "linear-gradient(#1E2024 0%, #111215 49%, #050506 51%, #15161A 100%)";

const digitsOf = (v: number): string[] => [v >= 100 ? "1" : "", v >= 10 ? String(Math.floor(v / 10) % 10) : "", String(v % 10)];

const Face: React.FC<{ d: string; half: "top" | "bottom"; shade?: number }> = ({ d, half, shade = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: half === "top" ? 0 : FH / 2, width: FW, height: FH / 2, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: half === "top" ? 0 : -FH / 2, width: FW, height: FH, background: FACE }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HX1_OSWALD, fontWeight: 700, fontSize: 78, color: "#F4F4F2", lineHeight: 1 }}>{d}</div>
    </div>
    {shade > 0.01 && <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${shade.toFixed(3)})` }} />}
  </div>
);

/** one split-flap cell at frame f */
const Cell: React.FC<{ f: number; i: number; T: HookX1T }> = ({ f, i, T }) => {
  const dig = (fr: number) => digitsOf(hx1Points(fr, T))[i];
  const cur = dig(f);
  let k = 0;
  while (k < 30 && dig(f - k - 1) === cur) k++;
  const slamCell = i === 0 && cur === "1";
  const dur = slamCell ? 8 : k < 30 && f - k > T.scored ? 3 : 5;
  let p = k >= 30 ? 1 : Math.min(1, (k + 1) / dur);
  if (slamCell) p = Math.pow(p, 1.7); // falls with weight
  const prev = k >= 30 ? cur : dig(f - k - 1);
  // the slammed flap bounces back up off its stop, twice
  const t = k + 1 - dur;
  const bounce = slamCell && p >= 1 && t >= 0 && t < 20 ? 26 * Math.exp(-t / 3.4) * Math.abs(Math.sin(t / 2.1)) : 0;
  return (
    <div style={{ position: "absolute", left: i * (FW + GAP), top: 0, width: FW, height: FH, borderRadius: 7, overflow: "visible", boxShadow: "0 6px 14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 7, overflow: "hidden" }}>
        <Face d={cur} half="top" shade={p < 1 ? 0.35 * (1 - p) : 0} />
        <Face d={p >= 0.5 ? (bounce > 0 ? prev : cur) : prev} half="bottom" />
      </div>
      {p < 0.5 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: FW, height: FH / 2, transformOrigin: "50% 100%", transform: `perspective(360px) rotateX(${(-180 * p).toFixed(2)}deg)`, borderRadius: "7px 7px 0 0", overflow: "hidden" }}>
          <Face d={prev} half="top" shade={0.5 * p} />
        </div>
      )}
      {p >= 0.5 && (p < 1 || bounce > 0) && (
        <div style={{ position: "absolute", left: 0, top: FH / 2, width: FW, height: FH / 2, transformOrigin: "50% 0%", transform: `perspective(360px) rotateX(${(p < 1 ? 180 * (1 - p) : bounce).toFixed(2)}deg)`, borderRadius: "0 0 7px 7px", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: -FH / 2, width: FW, height: FH }}><Face d={cur} half="bottom" shade={p < 1 ? 0.45 * (1 - p) : 0.25 * (bounce / 26)} /></div>
        </div>
      )}
      {/* the hinge line and the two pins */}
      <div style={{ position: "absolute", left: 0, right: 0, top: FH / 2 - 1, height: 2, background: "#000" }} />
      <div style={{ position: "absolute", left: 2, top: FH / 2 - 4, width: 4, height: 8, borderRadius: 2, background: "#3A3C40" }} />
      <div style={{ position: "absolute", right: 2, top: FH / 2 - 4, width: 4, height: 8, borderRadius: 2, background: "#3A3C40" }} />
    </div>
  );
};

export const HookX1Panel: React.FC<{ f: number; T: HookX1T; V: HX1View }> = ({ f, T, V }) => {
  const body = hx1Body(f, T);
  const C = V.P(hx1SignPt(0, 0, 0.15));
  const Ux = V.P(hx1SignPt(10, 0, 0.15)), Vy = V.P(hx1SignPt(0, 10, 0.15));
  // the board's plane, as an affine map from panel px
  const g = [(Ux.x - C.x) / 10, (Ux.y - C.y) / 10, (Vy.x - C.x) / 10, (Vy.y - C.y) / 10, C.x + body.dx, C.y + body.dy];
  const flat = [0.9, 0, 0, 0.9, 540, 600];
  const lift = prog(f, T.saw - 3, 22, Easing.bezier(0.45, 0, 0.2, 1));
  // it tears off the bracket with a small kick up, then flies
  const kick = prog(f, T.saw - 3, 6, ease.out) * (1 - lift) * -14;
  const M = g.map((v, j) => hx1Lerp(v, flat[j], lift));
  M[5] += kick;
  const jolt = 7 * hx1Slam(f, T);
  const v0 = hx1Points(f - 1, T) !== hx1Points(f, T) && f > T.scored && f < T.n100 - 4 ? 1.5 : 0; // each clack knocks it
  const speed = Math.hypot(M[4] - hx1Lerp(g[4], flat[4], prog(f - 1, T.saw - 3, 22, Easing.bezier(0.45, 0, 0.2, 1))), M[5] - hx1Lerp(g[5], flat[5], prog(f - 1, T.saw - 3, 22, Easing.bezier(0.45, 0, 0.2, 1))));
  const pointsIn = prog(f, T.points - 4, 7, ease.back);
  const pointsOut = 1 - prog(f, T.saw - 3, 8, ease.linear);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transformOrigin: "0 0", transform: `matrix(${M.map((v) => v.toFixed(4)).join(",")})`, filter: speed > 6 ? `blur(${Math.min(3, speed * 0.08).toFixed(2)}px)` : undefined }}>
      <div style={{ position: "absolute", left: -WIDTH / 2, top: -FH / 2 + jolt + v0, width: WIDTH, height: FH }}>
        <div style={{ position: "absolute", left: 0, top: -44, width: WIDTH, textAlign: "center", fontFamily: HX1_OSWALD, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: HX1_DIM }}>WILT</div>
        {[0, 1, 2].map((i) => <Cell key={i} f={f} i={i} T={T} />)}
        {f >= T.points - 4 && pointsOut > 0 && (
          <div style={{ position: "absolute", left: 0, top: FH + 12, width: WIDTH, textAlign: "center", fontFamily: HX1_OSWALD, fontWeight: 500, fontSize: 30, letterSpacing: 5, color: HX1_DIM, opacity: Math.min(1, pointsIn) * pointsOut, transform: `scale(${(0.7 + 0.3 * pointsIn).toFixed(3)})` }}>POINTS</div>
        )}
      </div>
    </div>
  );
};
