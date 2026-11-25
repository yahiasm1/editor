// "January 22, 2006, and honestly, the night started terribly."
// ARENA scale. The endlessbender photo, the only Commons photo taken at the 81 game, rises big and the camera pushes
// in; BBR's scorebox writes in under it (date, STAPLES Center, the crowd counting to 18,997). On "and honestly" the
// camera finds the red LED stanchion clock in the photo; its face lifts off, grows and flies up into the reel's
// scoreboard, which powers on. The first quarter then rolls through every real scoring play from BBR's play-by-play
// and lands on "terribly": END 1ST, RAPTORS 36 LAKERS 29.
import React from "react";
import { Img, staticFile } from "remotion";
import { Travel, blurIn, countTo, ease, prog, typeOn, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import scoring from "../assets/refs/kobe-81-scoring.json";
import { StaplesNightBoard, StaplesNightBoardRect, StaplesNightDigit, StaplesNightLed } from "./StaplesNightBoard";

const PHOTO = "kobe-81/commons-kobe-81-night-staples-2006-endlessbender-ccby2.jpg";
const SRC_W = 960;
const SRC_H = 720;
// the photo card on the stage
const CARD = { x: 90, y: 712, w: 900, h: 580 };
// the stanchion cube in the photo, both faces (source px)
const CLOCK = { x: 797, y: 198, w: 58, h: 38 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Cam = { z: number; cx: number; cy: number };

// Q1 scoring plays, seconds left in the quarter
type Ev = { secs: number; team: string; tor: number; lal: number };
const parseClock = (c: string) => {
  const [m, s] = c.split(":");
  return Number(m) * 60 + Number(s);
};
const Q1: Ev[] = (scoring as { events: { q: number; clock: string; team: string; tor: number; lal: number }[] }).events
  .filter((e) => e.q === 1)
  .map((e) => ({ secs: parseClock(e.clock), team: e.team, tor: e.tor, lal: e.lal }));

const fmtClock = (g: number) => {
  if (g >= 60) {
    const s = Math.floor(g);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }
  return (Math.floor(g * 10) / 10).toFixed(1);
};

export const StaplesNight: React.FC = () => {
  const { f, fps, scene, cue, endsOn, theme, ground } = useScene();

  const tJan = cue("January");
  const t22 = cue("22");
  const t2006 = cue("2006");
  const tAnd = cue("and");
  const tHon = cue("honestly");
  const tThe = cue("the");
  const tTerr = cue("terribly");
  const mount = scene.from - LEAD;

  // ---- the camera on the photo: a slow push toward the court, a turn to the stanchion clock, back out
  const camA: Cam = { z: 0.94, cx: 480, cy: 404 };
  const camB: Cam = { z: 1.02, cx: 505, cy: 420 };
  const camC: Cam = { z: 1.34, cx: 760, cy: 250 };
  const camD: Cam = { z: 1.0, cx: 520, cy: 430 };
  const pAB = prog(f, mount, tAnd - mount, ease.linear);
  const pBC = prog(f, tAnd - 6, 22, ease.inOut);
  const pCD = prog(f, tHon + 16, 34, ease.inOut);
  const mixCam = (a: Cam, b: Cam, t: number): Cam => ({ z: lerp(a.z, b.z, t), cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t) });
  let cam = mixCam(mixCam(mixCam(camA, camB, pAB), camC, pBC), camD, pCD);
  // a held picture keeps living: a little more push once it is back out
  cam = { ...cam, z: cam.z + 0.05 * prog(f, tHon + 50, 80, ease.linear) };
  const z = cam.z;
  const cx = clamp(cam.cx, CARD.w / 2 / z, SRC_W - CARD.w / 2 / z);
  const cy = clamp(cam.cy, CARD.h / 2 / z, SRC_H - CARD.h / 2 / z);
  const imgL = CARD.w / 2 - cx * z;
  const imgT = CARD.h / 2 - cy * z;
  // where the stanchion clock sits on the stage this frame
  const clockX = CARD.x + imgL + CLOCK.x * z;
  const clockY = CARD.y + imgT + CLOCK.y * z;

  // ---- the clock's face lifts off and flies up into the board
  const flyAt = tHon + 2;
  const flyDur = 22;
  const k = prog(f, flyAt, flyDur, ease.inOut);
  const kPrev = prog(f - 1, flyAt, flyDur, ease.inOut);
  const landed = f >= flyAt + flyDur;
  const R = StaplesNightBoardRect;
  const r0 = { x: clockX - (CLOCK.w * z) / 2, y: clockY - (CLOCK.h * z) / 2, w: CLOCK.w * z, h: CLOCK.h * z };
  const rf = { x: lerp(r0.x, R.x, k), y: lerp(r0.y, R.y, k), w: lerp(r0.w, R.w, k), h: lerp(r0.h, R.h, k) };
  const vel = Math.hypot((k - kPrev) * (R.y - r0.y), (k - kPrev) * (R.x - r0.x));

  // the ring of light that finds the clock
  const ringIn = prog(f, tAnd, 10, ease.out);
  const ringOut = prog(f, flyAt + 6, 10, ease.in);
  const ring = ringIn * (1 - ringOut);

  // ---- the board: dark from the start (as the hook leaves it), powered on when the face lands
  const powerAt = flyAt + flyDur;
  // power-on flicker, as an LED cabinet does
  const flick = [0, 0.9, 0.2, 1, 0.6, 1];
  const pi = f - powerAt;
  const power = pi < 0 ? 0 : pi < flick.length ? flick[pi] : 1;

  // the first quarter, run fast on the clock and slowing into its last seconds
  const runAt = Math.max(powerAt + 4, tThe);
  const runEnd = endsOn("terribly", 2);
  const gAt = (fr: number) => 720 * (1 - prog(fr, runAt, runEnd - runAt, ease.out));
  const g = gAt(f);
  const done = Q1.filter((e) => e.secs >= g);
  const last = done[done.length - 1];
  const tor = last ? last.tor : 0;
  const lal = last ? last.lal : 0;
  const recent = (team: string) => {
    const g3 = gAt(f - 4);
    return Q1.some((e) => e.team === team && e.secs < g3 && e.secs >= g) ? 1 : 0;
  };
  const ended = f >= tTerr;
  const flare = ended ? prog(f, tTerr, 6, ease.out) * (1 - 0.35 * prog(f, tTerr + 10, 20, ease.linear)) : 0;
  const boardOn = f >= powerAt;

  // ---- BBR's scorebox under the photo
  const line1a = typeOn("Sunday, January 22,", f, tJan - 4, fps, 18);
  const line1b = typeOn(" 2006", f, t2006 - 6, fps, 30);
  const crowd = Math.round(countTo(f, t2006 + 4, 38, 0, 18997));

  // photo dims one step on "terribly"
  const dim = 0.32 * prog(f, tTerr, 10, ease.out);
  // a slow light sweep travelling across the stands
  const sweep = lerp(-0.4, 1.3, prog(f, mount, scene.to - mount, ease.linear));

  return (
    <>
      {/* the scoreboard box, dark until the clock's face lands in it */}
      <div style={blurIn(f, scene.from - 2, { dur: 8 })}>
        <StaplesNightBoard
          st={{
            power,
            tor: boardOn ? tor : null,
            lal: boardOn ? lal : null,
            period: ended ? "END 1ST" : "1ST",
            clock: boardOn ? (ended ? "0.0" : fmtClock(g)) : "    ",
            flashTor: boardOn ? recent("TOR") : 0,
            flashLal: boardOn ? recent("LAL") : 0,
            flareTor: flare,
            logoTor: prog(f, powerAt + 2, 8, ease.back),
            logoLal: prog(f, powerAt + 6, 8, ease.back),
          }}
        />
      </div>

      {/* the photo card */}
      <Travel at={mount} from="bottom" dist={220} dur={12} curve="measured" style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 24, overflow: "hidden", background: ground.card, border: `2px solid ${ground.hairline}`, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
          <Img src={staticFile(PHOTO)} style={{ position: "absolute", left: imgL, top: imgT, width: SRC_W * z, height: SRC_H * z, maxWidth: "none" }} />
          {/* light travelling across the bowl */}
          <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", background: `linear-gradient(105deg, transparent ${(sweep - 0.18) * 100}%, rgba(255,236,200,0.10) ${sweep * 100}%, transparent ${(sweep + 0.18) * 100}%)` }} />
          {/* grain, so the 960 px original holds up at this size */}
          <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", inset: 0, opacity: 0.11, mixBlendMode: "overlay" }}>
            <filter id="staplesnight-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 9} />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#staplesnight-grain)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, background: `rgba(5,8,12,${dim})` }} />
          {/* the lit board's red spill on the top of the photo, breathing with each basket */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, background: `linear-gradient(180deg, rgba(255,42,28,${(0.10 * power + (boardOn ? 0.06 * (recent("TOR") + recent("LAL")) : 0)).toFixed(3)}), rgba(255,42,28,0))`, mixBlendMode: "screen" }} />
          {/* vignette and the credit */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, transparent 55%, rgba(0,0,0,0.38) 100%)" }} />
          <div style={{ position: "absolute", right: 0, top: 0, padding: "10px 16px 18px 40px", background: "linear-gradient(200deg, rgba(0,0,0,0.6), rgba(0,0,0,0) 80%)", fontFamily: theme.font.ui, fontSize: 22, color: "#C9D1D9" }}>
            endlessbender, CC BY 2.0
          </div>
        </div>

        {/* the ring of light on the stanchion clock */}
        {ring > 0.01 && (
          <div
            style={{
              position: "absolute",
              left: clockX - 70,
              top: clockY - 70,
              width: 140,
              height: 140,
              borderRadius: 70,
              border: `4px solid ${StaplesNightLed.red}`,
              boxShadow: `0 0 26px ${StaplesNightLed.red}, inset 0 0 26px rgba(255,42,28,0.45)`,
              opacity: ring,
              transform: `scale(${1.7 - 0.7 * ringIn})`,
            }}
          />
        )}

        {/* BBR scorebox lines */}
        <div style={{ position: "absolute", left: CARD.x + 4, top: CARD.y + CARD.h + 20, width: CARD.w, fontFamily: theme.font.ui }}>
          <div style={{ fontSize: 44, fontWeight: 700, color: ground.ink, height: 54, whiteSpace: "pre" }}>
            {line1a.text}
            {line1b.text}
            {(line1a.typing || line1b.typing) && <span style={{ display: "inline-block", width: 3, height: 40, marginLeft: 3, background: ground.ink, verticalAlign: "-4px" }} />}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 10 }}>
            <span style={{ ...blurIn(f, t2006, { dur: 8, rise: 10 }), display: "inline-block", fontSize: 34, color: "#C9D1D9" }}>STAPLES Center, Los Angeles</span>
            <span style={{ ...blurIn(f, t2006 + 4, { dur: 8, rise: 10 }), display: "inline-block", fontSize: 34, color: "#8B949E" }}>
              Attendance <span style={{ color: ground.ink, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{crowd.toLocaleString("en-US")}</span>
            </span>
          </div>
          <div style={{ ...blurIn(f, t2006 + 10, { dur: 8 }), fontSize: 26, color: "#8B949E", marginTop: 12 }}>Basketball-Reference box score</div>
        </div>
      </Travel>

      {/* the clock's face, lifting off the photo and growing into the board */}
      {f >= flyAt && !landed && (
        <div
          style={{
            position: "absolute",
            left: rf.x,
            top: rf.y,
            width: rf.w,
            height: rf.h,
            borderRadius: lerp(3, 14, k),
            background: StaplesNightLed.housing,
            border: `2px solid ${StaplesNightLed.edge}`,
            boxShadow: `0 0 ${30 + 30 * k}px rgba(255,42,28,0.45)`,
            filter: vel > 3 ? `blur(${Math.min(6, vel * 0.05).toFixed(2)}px)` : undefined,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%)`, opacity: 1 - prog(f, flyAt + 10, 10, ease.in) }}>
            <div style={{ position: "relative", width: rf.h * 0.62 * 0.6 * 2 + rf.h * 0.1, height: rf.h * 0.62 }}>
              <StaplesNightDigit ch="2" h={rf.h * 0.62} color={StaplesNightLed.red} dim={StaplesNightLed.redDim} />
              <StaplesNightDigit ch="3" h={rf.h * 0.62} color={StaplesNightLed.red} dim={StaplesNightLed.redDim} x={rf.h * 0.62 * 0.7} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
