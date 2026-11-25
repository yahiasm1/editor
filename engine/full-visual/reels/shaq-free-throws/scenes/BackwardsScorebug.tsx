// `backwards`: "Sounds backwards, right? A foul usually hands the other team free points."
// The real scoreboard of Shaq's first trip to the line on Dec 8 2000 (SEA 57, LAL 52, 2nd, the clock running to
// 0:47.7) over the Lakers' lane seen from the shooter's seat. It flips over on "backwards"; on "foul" a real NBA
// referee's fist punches up, the clock stops dead and SHOOTING FOUL slides out under Seattle; LAL's box comes forward
// with 2 FREE THROWS, two real balls arc in from the line behind, and on "free points" two +1s stand over LAL while a
// ghost score rolls to 54. The real 52 never moves: that is `split`'s job. Notes: notes/BackwardsScorebug.md.
import React from "react";
import { Img, staticFile } from "remotion";
import { LEAD } from "../../../src/engine/Stage";
import { arrive, blurIn, ease, pop, prog, useScene } from "../../../src/engine";
import { BackwardsScorebugCourt, backwardsScorebugProject } from "./BackwardsScorebugCourt";
import { BackwardsScorebugArm } from "./BackwardsScorebugArm";
import { BackwardsScorebugBug, BackwardsScorebugDigits, BackwardsScorebugFont, BackwardsScorebugGeo as G } from "./BackwardsScorebugBug";

const BUG = { x: 90, y: 700 };
const LAL_SCORE = { x: BUG.x + G.sea + 150 + (G.lal - 150) / 2, y: BUG.y + 66 };
const FT = backwardsScorebugProject(0, 13.92, 0);

/** a real ball on its way from the free throw line behind into LAL's box */
function backwardsScorebugBall(f: number, start: number, dur: number, side: number) {
  const t = prog(f, start, dur, ease.inOut);
  const x0 = FT[0] + side * 40;
  const y0 = FT[1] - 24;
  const cx = (x0 + LAL_SCORE.x) / 2 - 60 * side;
  const cy = 360;
  const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * LAL_SCORE.x;
  const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * LAL_SCORE.y;
  const size = 44 + 86 * Math.pow(t, 1.3);
  return { x, y, size, t, rot: (f - start) * 14 * side };
}

export const BackwardsScorebug: React.FC = () => {
  const { f, cue, endsOn, scene } = useScene();
  const T = {
    in: scene.from - LEAD,
    sounds: cue("Sounds"),
    back: cue("backwards"),
    right: cue("right"),
    foul: cue("foul"),
    usually: cue("usually"),
    hands: cue("hands"),
    the: cue("the"),
    other: cue("other"),
    free: cue("free"),
    points: cue("points"),
  };

  // the court: there from the first frame, it settles down and out of focus as the bug arrives
  const settle = arrive(f, T.in, 26);
  const court = { dy: -70 + 70 * settle, blur: 1 + 4 * settle, dim: 0.95 - 0.33 * settle };

  // the bug arrives big, then flips over on "backwards" and settles on "right?"
  const flipA = T.back - 3;
  const p1 = prog(f, flipA, 22, ease.inOut);
  const p2 = prog(f, flipA + 22, 12, ease.out);
  const angle = 372 * p1 - 12 * p2;
  const lift = Math.sin(Math.min(1, p1) * Math.PI);

  // the whistle stops the clock on "foul"
  const clock = f < T.foul ? 47.7 + (T.foul - f) / 60 : 47.7;
  const armIn = endsOn("foul", 9);
  // the arm punches up from below, overshoots and settles, then holds with a slow sway; the fist pulses on "free"
  const armP = prog(f, armIn, 16, ease.back);
  const armY = 1980 - (1980 - 1030) * armP;
  const armRot = -6 + 9 * (1 - prog(f, armIn, 22, ease.back)) + Math.sin((f - armIn) / 17) * 2.4 * prog(f, armIn + 14, 24, ease.inOut);
  const pulseT = prog(f, T.free - 2, 14, ease.linear);
  const armPulse = 1 + 0.07 * Math.sin(Math.PI * pulseT);

  const ball1 = backwardsScorebugBall(f, T.the, 26, 1);
  const ball2 = backwardsScorebugBall(f, endsOn("free", 26), 26, -1);
  const land1 = T.the + 26;
  const land2 = T.free;
  const hit = Math.max(1 - prog(f, land1, 14, ease.out), 0) * (f >= land1 ? 1 : 0) + Math.max(1 - prog(f, land2, 14, ease.out), 0) * (f >= land2 ? 1 : 0);
  const ghost = 52 + prog(f, land1, 12, ease.out) + prog(f, land2, 12, ease.out);
  const tab = prog(f, T.the + 2, 10, ease.out);

  const ball = (b: ReturnType<typeof backwardsScorebugBall>, start: number, land: number) =>
    f >= start && f < land + 5 ? (
      <div
        style={{
          position: "absolute",
          left: b.x - b.size / 2,
          top: b.y - b.size / 2,
          width: b.size,
          height: b.size,
          opacity: f < land ? 1 : 1 - prog(f, land, 5, ease.linear),
          transform: `rotate(${b.rot.toFixed(1)}deg) scale(${f < land ? 1 : (1 - 0.4 * prog(f, land, 5)).toFixed(3)})`,
          filter: `drop-shadow(0 ${(b.size * 0.12).toFixed(1)}px ${(b.size * 0.15).toFixed(1)}px rgba(0,0,0,0.6))`,
          zIndex: 6,
        }}
      >
        <Img src={staticFile("shaq-free-throws/backwards-ball.png")} style={{ width: "100%", height: "100%" }} />
      </div>
    ) : null;

  const plusOne = (land: number, x: number) =>
    f >= land ? (
      <div
        style={{
          position: "absolute",
          left: x - 70,
          top: 590 - 18 * prog(f, land, 30, ease.out) + Math.sin((f - land) / 11) * 3,
          width: 140,
          textAlign: "center",
          fontFamily: BackwardsScorebugFont,
          fontWeight: 800,
          fontSize: 92,
          color: "#fff",
          textShadow: "0 6px 18px rgba(0,0,0,0.7)",
          ...pop(f, land, { dur: 9, from: 0.4 }),
        }}
      >
        +1
      </div>
    ) : null;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <BackwardsScorebugCourt f={f} blur={court.blur} dim={court.dim} dy={court.dy} />

      {/* the bug, on a panel that can turn over */}
      <div style={{ position: "absolute", left: BUG.x, top: BUG.y, width: G.w, height: G.h + G.strip, perspective: 1700, ...blurIn(f, T.in, { dur: 14, scaleFrom: 1.16, rise: -40, blur: 16 }) }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transformOrigin: `50% ${G.h / 2}px`,
            transform: `rotateX(${angle.toFixed(2)}deg) scale(${(1 + 0.05 * lift).toFixed(4)})`,
          }}
        >
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
            <BackwardsScorebugBug
              f={f}
              clock={clock}
              seaStrip={prog(f, T.foul, 10, ease.out)}
              lalStrip={prog(f, T.usually, 10, ease.out)}
              lalForward={arrive(f, T.hands, 16)}
              sweepAt={T.sounds}
              stopAt={T.foul}
              hit={Math.min(1, hit)}
            />
          </div>
          {/* the back of the panel: the navy card, its hairline and fixing screws */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: G.w,
              height: G.h,
              borderRadius: 14,
              background: "linear-gradient(180deg, #1C232D 0%, #161B22 60%, #10151B 100%)",
              boxShadow: "0 0 0 1.5px #30363D",
              transform: "rotateX(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            {[60, 840].map((x) => (
              <div key={x} style={{ position: "absolute", left: x - 9, top: G.h / 2 - 9, width: 18, height: 18, borderRadius: 9, background: "radial-gradient(circle at 40% 35%, #59616D, #1A1F26)" }} />
            ))}
            <div style={{ position: "absolute", left: 100, right: 100, top: G.h / 2 - 1, height: 2, background: "#30363D" }} />
          </div>
        </div>
      </div>

      {/* the ghost score: what a foul usually pays, outlined, never the real score */}
      {tab > 0 && (
        <div
          style={{
            position: "absolute",
            left: LAL_SCORE.x - 100,
            top: 556,
            width: 200,
            height: 120,
            transformOrigin: "50% 100%",
            transform: `scaleY(${tab.toFixed(3)})`,
            opacity: 0.85,
            border: "2px solid #30363D",
            borderBottom: "none",
            borderRadius: "14px 14px 0 0",
            background: "rgba(13,17,23,0.55)",
          }}
        >
          <div style={{ position: "absolute", left: 0, right: 0, top: 3 }}>
            <BackwardsScorebugDigits v={ghost} size={104} color="transparent" fill="rgba(255,255,255,0.08)" stroke="2.5px rgba(255,255,255,0.85)" />
          </div>
        </div>
      )}
      {plusOne(land1, LAL_SCORE.x - 190)}
      {plusOne(land2, LAL_SCORE.x + 190)}

      {ball(ball1, T.the, land1)}
      {ball(ball2, endsOn("free", 26), land2)}

      {/* the referee's arm, the foul call: fist straight up */}
      {f >= armIn && (
        <div style={{ position: "absolute", left: 700, top: armY, width: 420, height: 900, zIndex: 8, transformOrigin: "50% 100%", transform: `rotate(${armRot.toFixed(2)}deg)` }}>
          <BackwardsScorebugArm f={f} pulse={armPulse} />
        </div>
      )}
    </div>
  );
};
