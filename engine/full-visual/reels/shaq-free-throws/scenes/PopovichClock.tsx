// popovich, dark, 63.08-68.22 s: "Even Gregg Popovich joked about it, fouling him five seconds into a season opener
// and flashing two thumbs up."
// Popovich's real sideline photo (Mike, CC BY-SA 2.0) rises big beside the bare Spurs logo, pushes in, wobbles on
// "joked", then takes the top left. The real AT&T Center game clock (drawn from Zereshk's photo of the building) drops
// in at 12:00 over the dark arena; the Spurs logo travels into the matchup line under it. On "fouling" the real
// play-by-play row types on (Basketball-Reference: "11:55.0 Personal foul by M. Finley (drawn by S. O'Neal)") beside
// Shaq's Suns cut-out, foul red contact marks on his arm; the clock runs and stops on 11:55 on "five", its last digit
// foul red. "5 seconds" brackets it, the Suns logo joins ("PHX at SAS"), "Oct 29, 2008 / Game 1" types on "opener".
// Then everything steps back, Pop's card comes to the centre and two drawn thumbs-up hands with navy cuffs drop in
// with weight. (notes/PopovichClock.md)
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { blurIn, ease, prog, typeOn, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { POPOVICHCLOCK_UNIT, PopovichClockLed, popovichClockCellX } from "./PopovichClockLed";
import { POPOVICHCLOCK_LOG, PopovichClockLog } from "./PopovichClockLog";
import { PopovichClockThumb } from "./PopovichClockThumb";

const POP = staticFile("shaq-free-throws/popovichclock-pop.jpg"); // 960 x 1179
const ARENA = staticFile("shaq-free-throws/popovichclock-arena.jpg"); // 1920 x 1440
const SHAQ = staticFile("shaq-free-throws/popovichclock-shaq.png"); // 1200 x 1794
const SPURS = staticFile("shaq-free-throws/popovichclock-spurs.svg");
const SUNS = staticFile("shaq-free-throws/popovichclock-suns.svg");
const UI = "Inter, sans-serif";
const BIG = "Figtree, sans-serif";
const GREY = "#8B949E";
const RED = "#E5383B";
const CARD = "#161B22";
const HAIR = "#30363D";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Pop's card: a window on the photo. Card rect on stage, the photo point at its centre, photo px -> stage px.
type View = { x: number; y: number; w: number; h: number; fx: number; fy: number; z: number };
const V0: View = { x: 170, y: 556, w: 600, h: 737, fx: 480, fy: 589.5, z: 0.625 }; // the whole photo
const V1: View = { x: 170, y: 556, w: 600, h: 737, fx: 488, fy: 330, z: 1.2 }; // head and shoulders
const V2: View = { x: 40, y: 566, w: 420, h: 476, fx: 488, fy: 336, z: 0.92 }; // top left
const V3: View = { x: 290, y: 620, w: 500, h: 660, fx: 488, fy: 340, z: 1.08 }; // centred for the thumbs
const lerpView = (a: View, b: View, t: number): View => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
  fx: lerp(a.fx, b.fx, t),
  fy: lerp(a.fy, b.fy, t),
  z: lerp(a.z, b.z, t),
});

// the clock unit and the matchup line under it
const CLOCK = { x: 510, y: 600 };
const U = POPOVICHCLOCK_UNIT;
const CLOCK_SCALE = 0.98;
const MATCH_Y = 940;

// Shaq's cut-out: crown at 234, centre line at 640 in its own pixels
const SH = { s: 0.35, crownY: 1086, cx: 214 };
const SH_LEFT = SH.cx - 640 * SH.s;
const SH_TOP = SH.crownY - 234 * SH.s;
// his forearm (our left), where the grab lands, in his pixels
const SH_ARM = { x: 362, y: 850 };

const LOG = { x: 420, y: 1100 };

function usePopovichClockTimes() {
  const { cue, cueEnd, endsOn, scene } = useScene();
  return {
    mount: scene.from - LEAD,
    from: scene.from,
    even: cue("Even"),
    gregg: cue("Gregg"),
    popovich: cue("Popovich"),
    joked: cue("joked"),
    about: cue("about"),
    it: cue("it"),
    fouling: cue("fouling"),
    him: cue("him"),
    five: cue("five"),
    seconds: cue("seconds"),
    into: cue("into"),
    season: cue("season"),
    opener: cue("opener"),
    and: cue("and"),
    flashing: cue("flashing"),
    two: cue("two"),
    thumbsIn: endsOn("thumbs", 12),
    thumbs: cue("thumbs"),
    up: cue("up"),
    end: cueEnd("up"),
    to: scene.to,
  };
}

export const PopovichClock: React.FC = () => {
  const { f, fps } = useScene();
  const t = usePopovichClockTimes();

  // ---- Pop's card: rises, pushes in on his name, wobbles on "joked", takes the top left, comes back to the centre
  const rise = blurIn(f, t.mount, { dur: 10, rise: 60, scaleFrom: 0.94 });
  const p1 = prog(f, t.popovich - 2, 26, ease.inOut);
  const p2 = prog(f, t.about, 16, ease.inOut);
  const p3 = prog(f, t.and, 18, ease.inOut);
  const view = lerpView(lerpView(lerpView(V0, V1, p1), V2, p2), V3, p3);
  const wob = f >= t.joked ? Math.sin((f - t.joked) * 0.42) * Math.exp(-(f - t.joked) / 13) * 4.2 : 0;
  const settleTilt = lerp(0, -1.6, p2) * (1 - p3);
  const hold = 1 + 0.025 * prog(f, t.thumbs, 70, ease.out);
  const imgL = view.w / 2 - view.fx * view.z;
  const imgT = view.h / 2 - view.fy * view.z;

  // ---- everything but Pop steps back on "and flashing"
  const back = p3;
  const backStyle: React.CSSProperties = {
    opacity: 1 - 0.72 * back,
    filter: back > 0.01 ? `blur(${(back * 3).toFixed(2)}px)` : undefined,
    transform: `scale(${(1 - 0.05 * back + 0.018 * prog(f, t.about, 150, ease.linear)).toFixed(4)})`,
    transformOrigin: "760px 900px",
  };

  // ---- the Spurs logo: bare beside the card, then down into the matchup line
  const spursIn = blurIn(f, t.mount + 6, { dur: 9, scaleFrom: 0.7 });
  const spursMove = prog(f, t.about + 2, 18, ease.inOut);
  const spurs = { x: lerp(800, 900, spursMove), y: lerp(640, MATCH_Y - 18, spursMove), s: lerp(250, 116, spursMove) };

  // ---- the arena behind the clock
  const arenaIn = prog(f, t.about - 4, 18, ease.out);
  const arenaPre = prog(f, t.mount, 14, ease.out);

  // ---- the clock: drops in on "about it", runs from "fouling", stops on 11:55 on "five"
  const clockDrop = prog(f, t.about - 2, 14, ease.back);
  const runFrom = t.fouling - 2;
  const tickAt = (k: number) => Math.round(lerp(runFrom, t.five, k / 5));
  let secs = 0;
  for (let k = 1; k <= 5; k++) if (f >= tickAt(k)) secs = k;
  const clockText = secs === 0 ? "12:00" : `11:${String(60 - secs).padStart(2, "0")}`;
  const lastTick = secs > 0 ? tickAt(secs) : -1e9;
  const flash = f >= lastTick ? Math.exp(-(f - lastTick) / 4) : 0;
  const lastRed = prog(f, t.five, 3, ease.linear);
  const ring = prog(f, t.five, 9, ease.out);
  const stopKick = f >= t.five ? Math.exp(-(f - t.five) / 6) * Math.sin((f - t.five) * 1.3) * 5 : 0;
  const bracket = prog(f, t.seconds - 2, 16, ease.inOut);

  // ---- the matchup line: Suns on "season", the date on "opener"
  const sunsIn = prog(f, t.season - 4, 10, ease.back);
  const atIn = prog(f, t.season, 8, ease.out);
  const date = typeOn("Oct 29, 2008", f, t.opener - 4, fps, 26);
  const game1 = prog(f, t.opener + 10, 10, ease.out);
  const periodIn = prog(f, t.about + 8, 10, ease.out);

  // ---- the log and Shaq: on "fouling"
  const logIn = prog(f, t.fouling - 8, 14, ease.out);
  const typed = Math.max(0, ((f - (t.fouling + 2)) / fps) * (1000 / 17));
  const timeLit = prog(f, t.five, 8, ease.out);
  const redK = prog(f, t.fouling + 14, 8, ease.linear);
  const shaqIn = blurIn(f, t.fouling - 8, { dur: 10, rise: 50 });
  const grab = prog(f, t.fouling, 6, ease.out);
  const grabKick = f >= t.fouling ? Math.exp(-(f - t.fouling) / 5) * Math.sin((f - t.fouling) * 1.6) * 6 : 0;
  const arm = { x: SH_LEFT + SH_ARM.x * SH.s, y: SH_TOP + SH_ARM.y * SH.s };

  // ---- the thumbs: drop in with weight, land on "thumbs", settle on "up"
  const thumb = (delay: number) => {
    const s0 = t.thumbsIn + delay;
    const p = prog(f, s0, 12, ease.back);
    const land = s0 + 9;
    const squash = f >= land ? Math.exp(-(f - land) / 4) * Math.sin(((f - land) / 7) * Math.PI) : 0;
    const bob = Math.sin(prog(f, t.up, 16, ease.linear) * Math.PI) * -16;
    const rot = (1 - prog(f, s0, 14, ease.out)) * -22 + (f >= land ? Math.exp(-(f - land) / 8) * Math.sin((f - land) * 0.55) * 5 : 0);
    return { p, y: (1 - p) * -260 + bob, rot, sq: squash, alpha: prog(f, s0, 2, ease.linear) };
  };
  const thL = thumb(0);
  const thR = thumb(4);
  const cardCx = view.x + view.w / 2;
  const cardCy = view.y + view.h / 2;

  const credit = (a: number): React.CSSProperties => ({ position: "absolute", top: 1452, fontFamily: UI, fontSize: 20, color: GREY, opacity: a });

  return (
    <AbsoluteFill>
      {/* depth: the real arena, dark and soft, behind the clock */}
      <div style={{ ...backStyle, position: "absolute", inset: 0 }}>
        <div
          style={{
            position: "absolute",
            left: 470,
            top: 540,
            width: 610,
            height: 560,
            overflow: "hidden",
            opacity: 0.14 * arenaPre + 0.28 * arenaIn,
            WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 55% 45%, #000 35%, rgba(0,0,0,0) 100%)",
            maskImage: "radial-gradient(ellipse 70% 65% at 55% 45%, #000 35%, rgba(0,0,0,0) 100%)",
          }}
        >
          <Img
            src={ARENA}
            style={{
              position: "absolute",
              left: -1060 * 0.62 + 300 - 10 * arenaIn,
              top: -380 * 0.62,
              width: 1920 * 0.62,
              height: 1440 * 0.62,
              filter: "blur(5px) saturate(0.7) brightness(0.75)",
              transform: `scale(${(1.04 + 0.03 * prog(f, t.about, 200, ease.linear)).toFixed(4)})`,
            }}
          />
        </div>

        {/* the Spurs logo, bare: beside Pop, then behind the clock and down into the matchup line */}
        <div style={{ position: "absolute", left: spurs.x, top: spurs.y, width: spurs.s, height: spurs.s, opacity: spursIn.opacity, filter: spursIn.filter, transform: spursIn.transform }}>
          <Img src={SPURS} style={{ width: spurs.s, height: spurs.s }} />
        </div>

        {/* the clock unit, hanging on its rods */}
        <div
          style={{
            position: "absolute",
            left: CLOCK.x,
            top: CLOCK.y,
            width: U.w,
            height: U.h,
            transformOrigin: "270px 0px",
            transform: `translateY(${((1 - clockDrop) * -120 + stopKick).toFixed(1)}px) scale(${CLOCK_SCALE}) rotate(${(stopKick * 0.08).toFixed(3)}deg)`,
            opacity: prog(f, t.about - 2, 6, ease.linear),
          }}
        >
          <PopovichClockLed text={clockText} lastRed={lastRed} flash={flash} ring={ring} f={f} />
        </div>

        {/* under the clock: the quarter, and the 5 seconds bracket */}
        <div style={{ position: "absolute", left: CLOCK.x + 6, top: CLOCK.y + U.h * CLOCK_SCALE + 6, fontFamily: UI, fontSize: 24, fontWeight: 600, color: GREY, opacity: periodIn * (1 - prog(f, t.seconds - 9, 6, ease.linear)) }}>1st quarter</div>
        {bracket > 0 && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {(() => {
              const x0 = CLOCK.x + popovichClockCellX(0) * CLOCK_SCALE;
              const x1 = CLOCK.x + (popovichClockCellX(3) + U.cellW + 10) * CLOCK_SCALE;
              const y = CLOCK.y + U.h * CLOCK_SCALE + 16;
              const xe = lerp(x0, x1, bracket);
              return (
                <g>
                  <path d={`M${x0},${y - 10} L${x0},${y} L${Math.min(xe, (x0 + x1) / 2 - 86)},${y}`} fill="none" stroke={GREY} strokeWidth={2.5} />
                  {xe > (x0 + x1) / 2 + 86 && <path d={`M${(x0 + x1) / 2 + 86},${y} L${xe},${y}${bracket > 0.98 ? ` L${x1},${y - 10}` : ""}`} fill="none" stroke={GREY} strokeWidth={2.5} />}
                  <text x={(x0 + x1) / 2} y={y + 10} textAnchor="middle" fontFamily={UI} fontSize={28} fontWeight={600} fill="#C9D1D9" opacity={prog(f, t.seconds + 4, 8, ease.out)}>
                    5 seconds
                  </text>
                </g>
              );
            })()}
          </svg>
        )}

        {/* the matchup line: PHX at SAS */}
        <div style={{ position: "absolute", left: 556, top: MATCH_Y - 12, width: 104, height: 104, opacity: Math.min(1, sunsIn * 1.5), transform: `scale(${(0.5 + 0.5 * sunsIn).toFixed(4)})` }}>
          <Img src={SUNS} style={{ width: 104, height: 104 }} />
        </div>
        <div style={{ position: "absolute", left: 660, width: 250, top: MATCH_Y + 18, textAlign: "center", fontFamily: BIG, fontWeight: 700, fontSize: 40, color: "#FFFFFF", opacity: atIn, letterSpacing: 0.5 }}>
          PHX <span style={{ color: GREY, fontWeight: 400 }}>at</span> SAS
        </div>
        <div style={{ position: "absolute", left: 560, width: 420, top: MATCH_Y + 104, textAlign: "center", fontFamily: UI, fontWeight: 700, fontSize: 34, color: "#FFFFFF", whiteSpace: "pre" }}>
          {date.text}
          <span style={{ fontWeight: 500, fontSize: 24, color: GREY, opacity: game1 }}>{"  "}Game 1</span>
        </div>

        {/* Shaq, a Sun that night */}
        <div style={{ position: "absolute", left: SH_LEFT + grabKick, top: SH_TOP, width: 1200 * SH.s, height: 1794 * SH.s, opacity: shaqIn.opacity, filter: shaqIn.filter, transform: shaqIn.transform }}>
          <Img
            src={SHAQ}
            style={{
              width: "100%",
              height: "100%",
              WebkitMaskImage: "linear-gradient(to bottom, #000 58%, rgba(0,0,0,0) 72%)",
              maskImage: "linear-gradient(to bottom, #000 58%, rgba(0,0,0,0) 72%)",
            }}
          />
        </div>
        {/* the grab on his forearm: the reel's foul red contact marks */}
        {grab > 0 && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: grabKick, top: 0, overflow: "visible" }}>
            {[-1, 0, 1].map((i) => {
              const cx = arm.x + i * 5;
              const cy = arm.y + i * 15;
              return (
                <path
                  key={i}
                  d={`M${cx - 14 * grab},${cy - 4} Q${cx},${cy + 6} ${cx + 14 * grab},${cy - 4}`}
                  fill="none"
                  stroke={RED}
                  strokeWidth={5}
                  strokeLinecap="round"
                  opacity={grab}
                />
              );
            })}
            <circle cx={arm.x} cy={arm.y} r={30 + 26 * grab} fill="none" stroke={RED} strokeWidth={3} opacity={(1 - grab) * 0.9 + 0.0} />
          </svg>
        )}

        {/* the play-by-play */}
        <div style={{ position: "absolute", left: LOG.x, top: LOG.y, width: POPOVICHCLOCK_LOG.w, height: POPOVICHCLOCK_LOG.h, opacity: logIn, transform: `translateY(${((1 - logIn) * 80).toFixed(1)}px)` }}>
          <PopovichClockLog typed={typed} timeLit={timeLit} redK={redK} caret={Math.floor(f / 15) % 2 === 0 || typed < 47} />
        </div>
      </div>


      {/* the thumbs, under the card's edges so the sleeves come out from behind it */}
      {f >= t.thumbsIn - 1 && (
        <>
          <div style={{ position: "absolute", left: cardCx - view.w / 2 - 262, top: cardCy - 150, width: 340, height: 420, opacity: thL.alpha, transformOrigin: "170px 400px", transform: `translateY(${thL.y.toFixed(1)}px) rotate(${(-thL.rot).toFixed(2)}deg) scale(${(0.9 * (1 + 0.07 * thL.sq)).toFixed(4)}, ${(0.9 * (1 - 0.07 * thL.sq)).toFixed(4)})` }}>
            <PopovichClockThumb id="l" flip />
          </div>
          <div style={{ position: "absolute", left: cardCx + view.w / 2 - 78, top: cardCy - 150, width: 340, height: 420, opacity: thR.alpha, transformOrigin: "170px 400px", transform: `translateY(${thR.y.toFixed(1)}px) rotate(${thR.rot.toFixed(2)}deg) scale(${(0.9 * (1 + 0.07 * thR.sq)).toFixed(4)}, ${(0.9 * (1 - 0.07 * thR.sq)).toFixed(4)})` }}>
            <PopovichClockThumb id="r" />
          </div>
        </>
      )}

      {/* Pop's card */}
      <div
        style={{
          position: "absolute",
          left: view.x,
          top: view.y,
          width: view.w,
          height: view.h,
          borderRadius: 28,
          overflow: "hidden",
          background: CARD,
          border: `1px solid ${HAIR}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
          opacity: rise.opacity,
          filter: rise.filter,
          transformOrigin: "50% 100%",
          transform: `${rise.transform} rotate(${(wob + settleTilt).toFixed(3)}deg) scale(${hold.toFixed(4)})`,
        }}
      >
        <Img src={POP} style={{ position: "absolute", left: imgL, top: imgT, width: 960 * view.z, height: 1179 * view.z }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,17,23,0) 70%, rgba(13,17,23,0.55) 100%)" }} />
        <div style={{ position: "absolute", left: 22, bottom: 46, fontFamily: BIG, fontWeight: 700, fontSize: 34, color: "#FFFFFF", textShadow: "0 2px 10px rgba(0,0,0,0.7)", opacity: prog(f, t.popovich + 10, 10, ease.out) }}>
          Gregg Popovich
        </div>
        <div style={{ position: "absolute", left: 22, bottom: 16, fontFamily: UI, fontSize: 20, color: "#AEB6C0", textShadow: "0 1px 6px rgba(0,0,0,0.9)", opacity: prog(f, t.popovich + 14, 10, ease.out) }}>Mike, CC BY-SA 2.0</div>
      </div>

      {/* credits for what stands on the stage */}
      <div style={{ ...credit(shaqIn.opacity as number * (1 - 0.72 * back)), left: 40 }}>Keith Allison, CC BY-SA 2.0</div>
      <div style={{ ...credit(arenaIn * (1 - 0.72 * back)), right: 40, textAlign: "right" }}>AT&T Center: Zereshk, CC BY-SA 3.0</div>
    </AbsoluteFill>
  );
};
