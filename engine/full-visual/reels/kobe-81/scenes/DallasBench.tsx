// "And it wasn't even a one-off. A month earlier, Kobe outscored the entire Dallas Mavericks through three quarters,
// 62 to 61, and then sat on the bench for the fourth because the game was already over."
// The other night, Dec 20 2005, told by the same scoreboard: the Jan 22 board comes down to centre and blanks, an
// older one turns down over it like a page going back, its LAKERS row rolls to BRYANT (photo chip), and every real
// scoring play (BBR play-by-play) lights a bulb: Kobe gold on the reel's 9 x 9 board, Dallas blue on a 9 x 10.
// BRYANT 62 locks at the real 0:04.4 over MAVERICKS 61. Then the board lifts, the bulbs fly into two strips under
// it, and the real STAPLES courtside row (Oct 2005 photo) comes up: Kobe's real photo (home gold 8) drops into an
// empty chair as a print, a terry towel lands over his shoulder, and the 4th runs while the blue walks past his 62.
import React from "react";
import { Img, staticFile } from "remotion";
import { blurIn, ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { StaplesNightBoard, StaplesNightBoardRect } from "./StaplesNightBoard";
import { DallasBenchBoard, DallasBenchBulb, DallasBenchChip, DallasBenchLogo, DallasBenchMini } from "./DallasBenchBoard";
import { DallasBenchClock, DallasBenchDal, DallasBenchEvents, DallasBenchGt62, DallasBenchKobe, DallasBenchScoreAt } from "./DallasBenchData";

const GOLD = "#FDB927";
const BLUE = "#0064B1";
const GREY = "#8B949E";
const PARK = StaplesNightBoardRect; // x 90, y 532, 900 x 160
const BX = 90;
const BY = 664; // the board, centred, under the date line
// the two socket boards
const PITCH = 44;
const BR = 15;
const FIELD_Y = 914;
const blueSock = (i: number) => ({ x: 112 + (i % 9) * PITCH, y: FIELD_Y + Math.floor(i / 9) * PITCH });
const goldSock = (i: number) => ({ x: 616 + (i % 9) * PITCH, y: FIELD_Y + Math.floor(i / 9) * PITCH });
// the two strips under the parked board
const SP = 9.6;
const blueStrip = (i: number) => ({ x: 110 + i * SP, y: 712 });
const goldStrip = (i: number) => ({ x: 110 + i * SP, y: 731 });
// the bench card
const CARD = { x: 90, y: 754, w: 900, h: 646 };
// the real STAPLES courtside row (Niv Singer, Oct 21 2005): four empty black padded chairs, fans behind.
// Crop of the 1280-px photo x 690-1062, y 400-668 (372 x 268), saved at 1350 x 972: the rim and net, the fans, four
// empty chairs. A Bobcats player's head in front of chair 2 is filled from the identical chair beside it (the print
// lands on that spot).
const ROW = { src: "kobe-81/dallasbench-courtside-row.jpg", W: 1350, H: 972 };
// Kobe's real photo (Sgt. Joseph A. Lee, Oct 11 2005, home gold 8), head to chest, as a print propped in chair 3
const PRINT = { src: "kobe-81/dallasbench-kobe-print.jpg", w: 262, h: 290, border: 9, cx: 333, bottom: 646 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));


export const DallasBench: React.FC = () => {
  const { f, fps, scene, cue, endsOn, theme, ground } = useScene();
  const mount = scene.from - LEAD;

  const tAnd = cue("and");
  const tEven = cue("even");
  const tOneOff = cue("one-off");
  const tA = cue("a", 2);
  const tEarlier = cue("earlier");
  const tKobe = cue("Kobe");
  const tOut = cue("outscored");
  const tEntire = cue("entire");
  const tMavs = cue("Mavericks");
  const tThrough = cue("through");
  const t62 = cue("62");
  const t61 = cue("61");
  const tAnd2 = cue("and", 2);
  const tSat = cue("sat");
  const tBench = cue("bench");
  const tFourth = cue("fourth");
  const tOver = cue("over");

  // ---------------------------------------------------------------- game time on the clock, piecewise
  const a1 = tOut;
  const b1 = tEntire + 4;
  const b2 = tMavs;
  const a3 = tThrough - 4;
  const f62 = t62;
  const e61 = t61 + 2;
  const e61b = e61 + 16;
  const a4 = tFourth;
  const b4 = tOver - 1;
  const K3 = 1.7; // the 3rd runs fast and slows into the last seconds
  const gtAt = (fr: number): number => {
    if (fr < a1) return 0;
    if (fr < b1) return 720 * prog(fr, a1, b1 - a1, ease.linear);
    if (fr < b2) return 720 + 720 * prog(fr, b1, b2 - b1, ease.linear);
    if (fr < a3) return 1440;
    if (fr < f62) {
      const p = prog(fr, a3, f62 - a3, ease.linear);
      return 1440 + (DallasBenchGt62 - 1440) * (1 - Math.pow(1 - p, K3));
    }
    if (fr < e61) return DallasBenchGt62;
    if (fr < e61b) return DallasBenchGt62 + (2160 - DallasBenchGt62) * prog(fr, e61, e61b - e61, ease.linear);
    if (fr < a4) return 2160;
    if (fr < b4) return 2160 + 720 * prog(fr, a4, b4 - a4, ease.linear);
    return 2880;
  };
  const frameOf = (gt: number): number => {
    if (gt <= 720) return a1 + (b1 - a1) * (gt / 720);
    if (gt <= 1440) return b1 + (b2 - b1) * ((gt - 720) / 720);
    if (gt <= DallasBenchGt62) {
      const t = (gt - 1440) / (DallasBenchGt62 - 1440);
      return a3 + (f62 - a3) * (1 - Math.pow(1 - t, 1 / K3));
    }
    if (gt <= 2160) return e61 + (e61b - e61) * ((gt - DallasBenchGt62) / (2160 - DallasBenchGt62));
    return a4 + (b4 - a4) * ((gt - 2160) / 720);
  };
  const gt = gtAt(f);
  const S = DallasBenchScoreAt(gt);
  const scored = (team: "DAL" | "LAL" | "KOBE") => {
    const g0 = gtAt(f - 5);
    return DallasBenchEvents.some((e) => e.gt > g0 && e.gt <= gt && (team === "KOBE" ? e.kobe : e.team === team)) ? 1 : 0;
  };

  // period and clock
  let period = "1ST";
  let clock = "12:00";
  if (f >= a1) {
    if (f >= b4) [period, clock] = ["FINAL", "0.0"];
    else if (f >= a4) [period, clock] = ["4TH", DallasBenchClock(2880 - gt)];
    else if (f >= e61b) [period, clock] = ["END 3RD", "0.0"];
    else if (f >= a3) [period, clock] = ["3RD", DallasBenchClock(2160 - gt)];
    else if (f >= b2) [period, clock] = ["HALF", "0.0"];
    else if (gt >= 720) [period, clock] = ["2ND", DallasBenchClock(1440 - gt)];
    else [period, clock] = ["1ST", DallasBenchClock(720 - gt)];
  }
  const clockFlare = f >= f62 && f < e61 ? 1 - 0.5 * prog(f, f62 + 6, 20, ease.linear) : 0;
  const lock62 = f >= f62 ? prog(f, f62, 5, ease.out) * (1 - 0.55 * prog(f, f62 + 12, 30, ease.linear)) : 0;
  const lock61 = f >= t61 ? prog(f, t61, 5, ease.out) * (1 - 0.7 * prog(f, t61 + 10, 24, ease.linear)) : 0;
  const final = f >= b4 ? prog(f, b4, 8, ease.out) : 0;

  // ---------------------------------------------------------------- the boards: Jan 22 comes down and blanks
  const downK = prog(f, tAnd - 2, 18, ease.inOut);
  const janY = lerp(PARK.y, BY, downK);
  const flick = [1, 0.3, 0.8, 0.1, 0.4, 0];
  const pe = f - tEven;
  const janPower = pe < 0 ? 1 : pe < flick.length ? flick[pe] : 0;
  // the older board turns down over it from its top edge, like a page going back
  const flipAt = endsOn("one-off", 15);
  const fall = prog(f, flipAt, 15, ease.in);
  const bounce = f >= flipAt + 15 ? Math.sin(prog(f, flipAt + 15, 10, ease.linear) * Math.PI) * (1 - prog(f, flipAt + 15, 10, ease.linear)) * 7 : 0;
  const angle = 100 * (1 - fall) - bounce;
  const decOn = f >= flipAt;
  const janGone = f >= flipAt + 16;
  // the board lifts to the top when he sits down
  const upK = prog(f, tAnd2 - 2, 16, ease.inOut);
  const decY = lerp(BY, PARK.y, upK);

  // the relabel: LAKERS rolls to BRYANT, the Lakers logo flips to Kobe's photo chip
  const roll = prog(f, tKobe - 3, 10, ease.inOut);
  const flipLogo = prog(f, tKobe - 3, 12, ease.inOut);
  const mavPulse = f >= tMavs ? Math.sin(prog(f, tMavs, 16, ease.linear) * Math.PI) : 0;
  const decPower = decOn ? 1 : 0;
  const decBoard = (
    <DallasBenchBoard
      x={0}
      y={0}
      shade={clamp01(angle / 100) * 0.75}
      st={{
        power: decPower,
        top: {
          name: "MAVERICKS",
          score: f >= a1 ? S.dal : 0,
          logo: <DallasBenchLogo file="dallasbench-mavericks.svg" k={prog(f, flipAt + 8, 8, ease.back)} pulse={mavPulse} />,
          flash: f >= a1 ? scored("DAL") : 0,
          flare: lock61 + final * 0.6,
        },
        bottom: {
          name: "BRYANT",
          prevName: "LAKERS",
          roll,
          score: f >= a1 ? S.kobe : 0,
          logo: (
            <div style={{ position: "relative", width: 56, height: 56, perspective: 300 }}>
              {flipLogo < 0.5 && (
                <div style={{ position: "absolute", inset: 0, transform: `rotateY(${flipLogo * 180}deg)` }}>
                  <DallasBenchLogo file="dallasbench-lakers.svg" k={prog(f, flipAt + 11, 8, ease.back)} />
                </div>
              )}
              {flipLogo >= 0.5 && (
                <div style={{ position: "absolute", inset: 0, transform: `rotateY(${(flipLogo - 1) * 180}deg)` }}>
                  <DallasBenchChip k={1} />
                </div>
              )}
            </div>
          ),
          flash: f >= a1 ? scored("KOBE") : 0,
          flare: lock62,
        },
        period: decOn ? period : "",
        clock: decOn ? clock : "     ",
        clockFlare,
      }}
    />
  );

  // ---------------------------------------------------------------- the date line: Jan 22 backspaces, Dec 20 types in
  const JAN = "Sunday, January 22, 2006";
  const DEC = "Tuesday, December 20, 2005";
  const bsAt = tOneOff - 2;
  const bsN = Math.round(JAN.length * (1 - prog(f, bsAt, 10, ease.linear)));
  const tyAt = bsAt + 12;
  const tyN = Math.round(DEC.length * prog(f, tyAt, tEarlier - tyAt, ease.linear));
  const dateText = f < tyAt ? JAN.slice(0, bsN) : DEC.slice(0, tyN);
  const typing = (f >= bsAt && f < tEarlier + 2) && Math.floor(f / 8) % 2 === 0;
  const dateIn = blurIn(f, tAnd + 10, { dur: 8, rise: 8 });
  const dateOut = prog(f, tAnd2 - 4, 8, ease.in);

  // ---------------------------------------------------------------- the bulbs
  const flyAt = (i: number) => tAnd2 - 8 + Math.floor(i * 0.08);
  const FLY = 14;
  // the empty socket boards fade in as soon as the older board has landed, so the frame under it is never bare
  const fieldsAt = Math.min(tA - 4, flipAt + 6);
  const fieldsIn = (row: number) => prog(f, fieldsAt + row * 2, 8, ease.out);
  const ring62 = f >= f62 ? 1.3 * (1 - prog(f, f62, 26, ease.out)) : 0;
  const bulbs: React.ReactNode[] = [];
  const place = (team: "dal" | "kobe", i: number, sock: { x: number; y: number }, strip: { x: number; y: number }, pt: { gt: number } | undefined, color: string) => {
    const fl = pt ? frameOf(pt.gt) : Infinity;
    const shown = f >= a1;
    const lit = pt && shown ? prog(f, fl, 4, ease.out) : 0;
    const fresh = pt && shown && f >= fl ? 1 - prog(f, fl, 16, ease.out) : 0;
    const row = Math.floor(i / 9);
    const k = prog(f, flyAt(i), FLY, ease.inOut);
    const arc = Math.sin(k * Math.PI) * (team === "dal" ? 40 : 60);
    const x = lerp(sock.x, strip.x, k);
    const y = lerp(sock.y, strip.y, k) - arc;
    const r = lerp(BR * (1 + 0.25 * fresh), 4, k);
    const glow = (1 + 1.6 * fresh + (team === "kobe" ? ring62 : team === "dal" ? lock61 * 0.8 : 0)) * (1 - 0.35 * k);
    bulbs.push(<DallasBenchBulb key={`${team}${i}`} x={x} y={y} r={r} color={color} lit={lit} glow={glow} socket={1} alpha={fieldsIn(row)} />);
  };
  for (let i = 0; i < 90; i++) place("dal", i, blueSock(i), blueStrip(i), DallasBenchDal[i], BLUE);
  for (let i = 0; i < 81; i++) place("kobe", i, goldSock(i), goldStrip(i), DallasBenchKobe[i], GOLD);
  const labelK = blurIn(f, fieldsAt + 14, { dur: 8, rise: 8 });
  const labelOut = prog(f, tAnd2 - 4, 8, ease.in);

  // ---------------------------------------------------------------- the bench
  const cardAt = tAnd2 + 2;
  const cardK = prog(f, cardAt, 16, ease.out);
  const cardOn = f >= cardAt - 1;
  const push = prog(f, cardAt, scene.to - cardAt, ease.linear);
  // Kobe's print drops into the empty chair on "sat" and lands on "bench" with a small settle
  const sitK = prog(f, tSat - 4, tBench - tSat + 4, ease.inOut);
  const settle = f >= tBench ? Math.sin(prog(f, tBench, 12, ease.linear) * Math.PI) * 7 * (1 - prog(f, tBench, 12, ease.linear)) : 0;
  const printH = PRINT.h + 2 * PRINT.border;
  const printW = PRINT.w + 2 * PRINT.border;
  const printTop = lerp(PRINT.bottom - printH - 170, PRINT.bottom - printH, sitK) + settle;
  const printIn = clamp01(sitK * 3.5);
  const printRot = lerp(-9, -2.5, sitK) + (f >= tBench ? 0.6 * Math.sin(prog(f, tBench, 14, ease.linear) * Math.PI) * (1 - prog(f, tBench, 14, ease.linear)) : 0);
  // the towel: thrown on a beat after he lands, it slides down over his shoulder and settles heavy
  const towelK = prog(f, tBench + 2, 12, ease.out);
  const towelSag = f >= tBench + 14 ? Math.sin(prog(f, tBench + 14, 12, ease.linear) * Math.PI) * 4 * (1 - prog(f, tBench + 14, 12, ease.linear)) : 0;
  const towelY = lerp(-70, 0, towelK) + towelSag;
  // the courtside photo, a slow push
  const z = (CARD.w / ROW.W) * (1.02 + 0.05 * push);
  const phL = CARD.w / 2 - (ROW.W * z) / 2;
  const phT = CARD.h / 2 - (ROW.H * z) / 2;
  // Q4 on the corner box
  const S4 = DallasBenchScoreAt(Math.max(gt, 2160));
  const miniPeriod = f >= b4 ? "FINAL" : f >= a4 ? "4TH" : "END 3RD";
  const miniClock = f >= a4 && f < b4 ? DallasBenchClock(2880 - gt) : "0.0";
  const sourceIn = blurIn(f, t61 + 4, { dur: 8 });
  // the play-by-play line under the board: the latest scoring play, real copy (assists cut)
  const lastPlay = f >= a1 && f < tAnd2 + 4 ? [...DallasBenchEvents].reverse().find((e) => e.gt <= gt && e.q <= 3) : undefined;
  const playIdx = lastPlay ? DallasBenchEvents.indexOf(lastPlay) : -1;
  const playAt = lastPlay ? frameOf(lastPlay.gt) : 0;
  const playK = prog(f, playAt, 4, ease.out);

  return (
    <>
      {/* the date line */}
      {f < tAnd2 + 6 && (
        <div style={{ ...dateIn, position: "absolute", left: 90, top: 566, width: 900, height: 60, fontFamily: theme.font.ui, opacity: (dateIn.opacity as number) * (1 - dateOut) }}>
          <span style={{ position: "absolute", left: 0, top: 0, fontSize: 44, fontWeight: 700, color: ground.ink, whiteSpace: "pre" }}>
            {dateText}
            {typing && <span style={{ display: "inline-block", width: 3, height: 40, marginLeft: 3, background: ground.ink, verticalAlign: "-4px" }} />}
          </span>
          <span style={{ ...blurIn(f, tEarlier + 2, { dur: 8, rise: 8 }), position: "absolute", right: 0, top: 10, fontSize: 32, color: "#C9D1D9", display: "inline-block" }}>STAPLES Center</span>
        </div>
      )}

      {/* the socket boards' labels and the chip's credit */}
      {f < tAnd2 + 8 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - labelOut, fontFamily: theme.font.ui }}>
          <div style={{ ...labelK, position: "absolute", left: 90, top: 1338, display: "flex", alignItems: "center", gap: 12 }}>
            <Img src={staticFile("kobe-81/dallasbench-mavericks.svg")} style={{ width: 44, height: 44 }} />
            <span style={{ fontSize: 32, color: GREY }}>Mavericks, every point</span>
          </div>
          <div style={{ ...labelK, position: "absolute", right: 90, top: 1338, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32, color: GREY }}>Kobe's points</span>
            <div style={{ width: 44, height: 44, borderRadius: 8, overflow: "hidden", border: `2px solid ${GOLD}` }}>
              <Img src={staticFile("kobe-81/dallasbench-kobe-chip.jpg")} style={{ width: 44, height: 44, objectFit: "cover" }} />
            </div>
          </div>
          {/* hairlines from the labels up to their boards */}
          <div style={{ ...labelK, position: "absolute", left: 112, top: 1322, width: 1, height: 14, background: "#30363D" }} />
          <div style={{ ...labelK, position: "absolute", left: 968, top: 1276, width: 1, height: 60, background: "#30363D" }} />
          <div style={{ ...blurIn(f, tKobe + 6, { dur: 8 }), position: "absolute", right: 90, top: 1392, fontSize: 22, color: GREY }}>Kobe photo: Sgt. Joseph A. Lee, USMC, public domain</div>
        </div>
      )}

      {/* the play-by-play line, grey clock and white play, "K. Bryant" in gold */}
      {lastPlay && (
        <div key={playIdx} style={{ position: "absolute", left: 92, top: 836, width: 900, height: 44, overflow: "hidden", fontFamily: theme.font.ui, fontSize: 32, whiteSpace: "nowrap", opacity: 1 - labelOut }}>
          <div style={{ transform: `translateY(${((1 - playK) * 26).toFixed(1)}px)`, opacity: playK }}>
            <span style={{ color: GREY, fontVariantNumeric: "tabular-nums" }}>{`Q${lastPlay.q} ${lastPlay.clock}`}</span>
            <span style={{ color: lastPlay.kobe ? GOLD : ground.ink, fontWeight: 700, marginLeft: 16 }}>{lastPlay.play.split(" makes ")[0]}</span>
            <span style={{ color: ground.ink }}>{` makes ${lastPlay.play.split(" makes ")[1].replace(/ \(assist by [^)]*\)/, "")}`}</span>
          </div>
        </div>
      )}

      {/* the bench card */}
      {cardOn && (
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            borderRadius: 24,
            overflow: "hidden",
            background: ground.card,
            border: `2px solid ${ground.hairline}`,
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            opacity: cardK,
            transform: `translateY(${((1 - cardK) * 240).toFixed(1)}px)`,
            filter: cardK < 0.95 ? `blur(${((1 - cardK) * 10).toFixed(1)}px)` : undefined,
          }}
        >
          {/* the real STAPLES courtside row, Oct 2005: four empty padded chairs under the overheads */}
          <Img src={staticFile(ROW.src)} style={{ position: "absolute", left: phL, top: phT, width: ROW.W * z, height: ROW.H * z, maxWidth: "none", filter: "brightness(0.9) contrast(1.05) saturate(0.92) blur(0.6px)" }} />
          {/* the fans behind sit further back: a little softer and darker at the top, the floor apron dark at the bottom */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,10,14,0.45) 0%, rgba(8,10,14,0.10) 34%, rgba(8,10,14,0) 60%, rgba(5,6,8,0.32) 100%)" }} />

          {/* Kobe's real photo, a print propped in the chair */}
          <div
            style={{
              position: "absolute",
              left: PRINT.cx - printW / 2,
              top: printTop,
              width: printW,
              height: printH,
              background: "#efebe2",
              padding: PRINT.border,
              boxSizing: "border-box",
              transform: `rotate(${printRot.toFixed(2)}deg)`,
              transformOrigin: "50% 100%",
              opacity: printIn,
              filter: printIn < 0.98 ? `blur(${((1 - printIn) * 8).toFixed(1)}px)` : undefined,
              boxShadow: "10px 16px 26px rgba(0,0,0,0.65), 0 2px 0 rgba(255,255,255,0.25) inset",
            }}
          >
            <div style={{ position: "relative", width: PRINT.w, height: PRINT.h, overflow: "hidden" }}>
              <Img src={staticFile(PRINT.src)} style={{ position: "absolute", inset: 0, width: PRINT.w, height: PRINT.h, objectFit: "cover", filter: "contrast(1.04) saturate(0.95)" }} />
              {/* the arena light: from above, falling off toward the chest */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,236,200,0.06), rgba(0,0,0,0) 40%, rgba(0,0,0,0.22) 100%)" }} />
              {/* photo grain */}
              <svg width={PRINT.w} height={PRINT.h} style={{ position: "absolute", inset: 0, opacity: 0.22, mixBlendMode: "overlay" }}>
                <filter id="dallasbench-grain">
                  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 9} />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#dallasbench-grain)" />
              </svg>
            </div>
            {/* the towel: thrown over the print's corner, across his right shoulder, terry with real folds and a soft shadow */}
            {towelK > 0 && (
              <svg width={printW} height={printH} style={{ position: "absolute", left: 0, top: towelY, overflow: "visible", opacity: Math.min(1, towelK * 2) }}>
                <defs>
                  <filter id="dallasbench-terry" x="-10%" y="-10%" width="120%" height="120%">
                    {/* loops of terry: fine bumps, lit from the overheads */}
                    <feTurbulence type="fractalNoise" baseFrequency="2.4 1.9" numOctaves={2} seed={11} result="n" />
                    <feDiffuseLighting in="n" surfaceScale={1.3} diffuseConstant={1.0} lightingColor="#ffffff" result="lit">
                      <feDistantLight azimuth={240} elevation={60} />
                    </feDiffuseLighting>
                    {/* a fuzzy, uneven edge */}
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={4} result="e" />
                    <feDisplacementMap in="SourceGraphic" in2="e" scale={2.5} xChannelSelector="R" yChannelSelector="G" result="shape" />
                    <feComposite in="lit" in2="shape" operator="in" result="litIn" />
                    <feBlend in="shape" in2="litIn" mode="multiply" />
                  </filter>
                  <linearGradient id="dallasbench-tfall" x1="0" y1="0" x2="0.35" y2="1">
                    <stop offset="0" stopColor="#ffffff" stopOpacity={0.14} />
                    <stop offset="0.3" stopColor="#000" stopOpacity={0} />
                    <stop offset="1" stopColor="#000" stopOpacity={0.42} />
                  </linearGradient>
                  <filter id="dallasbench-tsoft" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation={8} />
                  </filter>
                  <filter id="dallasbench-tcrease" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation={3.5} />
                  </filter>
                  <clipPath id="dallasbench-tclip">
                    <path d="M -2 -6 C 40 -10, 90 -8, 128 -2 C 120 40, 98 88, 80 132 C 62 176, 40 222, 20 262 C 12 276, 4 286, -6 292 C -10 262, -12 210, -12 160 C -12 100, -12 46, -10 20 C -10 8, -8 -2, -2 -6 Z" />
                  </clipPath>
                </defs>
                {/* its shadow, on the jersey and the print */}
                <path d="M -2 -6 C 40 -10, 90 -8, 128 -2 C 120 40, 98 88, 80 132 C 62 176, 40 222, 20 262 C 12 276, 4 286, -6 292 C -10 262, -12 210, -12 160 C -12 100, -12 46, -10 20 C -10 8, -8 -2, -2 -6 Z" fill="#000" opacity={0.7} filter="url(#dallasbench-tsoft)" transform="translate(14,14)" />
                {/* the hanging part */}
                <path d="M -2 -6 C 40 -10, 90 -8, 128 -2 C 120 40, 98 88, 80 132 C 62 176, 40 222, 20 262 C 12 276, 4 286, -6 292 C -10 262, -12 210, -12 160 C -12 100, -12 46, -10 20 C -10 8, -8 -2, -2 -6 Z" fill="#e6e1d7" filter="url(#dallasbench-terry)" />
                <g clipPath="url(#dallasbench-tclip)">
                  <rect x={-20} y={-30} width={170} height={330} fill="url(#dallasbench-tfall)" />
                  {/* the folds it makes as it hangs from the corner: soft creases fanning out, each with a lit ridge */}
                  <path d="M 8 2 C 14 70, 10 170, -2 286" stroke="rgba(40,34,26,0.45)" strokeWidth={10} fill="none" filter="url(#dallasbench-tcrease)" />
                  <path d="M 18 2 C 28 70, 28 150, 18 250" stroke="rgba(255,255,255,0.32)" strokeWidth={7} fill="none" filter="url(#dallasbench-tcrease)" />
                  <path d="M 34 2 C 46 60, 48 120, 42 196" stroke="rgba(40,34,26,0.38)" strokeWidth={8} fill="none" filter="url(#dallasbench-tcrease)" />
                  <path d="M 62 0 C 72 40, 72 80, 66 130" stroke="rgba(40,34,26,0.30)" strokeWidth={7} fill="none" filter="url(#dallasbench-tcrease)" />
                  <path d="M 70 0 C 78 24, 80 44, 80 70" stroke="rgba(255,255,255,0.28)" strokeWidth={6} fill="none" filter="url(#dallasbench-tcrease)" />
                  {/* the woven band near the hem, on the slant */}
                  <path d="M 112 24 C 90 80, 58 160, 24 236 L 15 232 C 50 156, 82 76, 103 20 Z" fill="rgba(120,112,98,0.32)" filter="url(#dallasbench-tcrease)" />
                </g>
                {/* where it folds over the top of the print: a thicker roll, lit on top */}
                <path d="M -14 -26 C 30 -36, 90 -32, 134 -18 C 144 -10, 142 4, 130 6 C 88 -4, 34 -4, -4 4 C -16 2, -20 -16, -14 -26 Z" fill="#f2eee6" filter="url(#dallasbench-terry)" />
                <path d="M -6 6 C 34 -2, 84 -2, 128 8" stroke="rgba(30,24,18,0.5)" strokeWidth={7} fill="none" filter="url(#dallasbench-tcrease)" />
              </svg>
            )}
          </div>

          {/* film grain over the whole card, so the print and the row sit in one photograph */}
          <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", inset: 0, opacity: 0.12, mixBlendMode: "overlay", pointerEvents: "none" }}>
            <filter id="dallasbench-cardgrain">
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={2} seed={(f + 3) % 11} />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#dallasbench-cardgrain)" />
          </svg>

          {/* overhead light travelling slowly along the row */}
          <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", pointerEvents: "none", background: `linear-gradient(100deg, transparent ${(lerp(-30, 110, push) - 14).toFixed(1)}%, rgba(255,236,200,0.07) ${lerp(-30, 110, push).toFixed(1)}%, transparent ${(lerp(-30, 110, push) + 14).toFixed(1)}%)` }} />
          {/* the corner box: the real game, LAL against DAL */}
          <div style={{ position: "absolute", left: 22, top: 22, ...blurIn(f, cardAt + 8, { dur: 8 }) }}>
            <DallasBenchMini
              lal={S4.lal}
              dal={S4.dal}
              period={miniPeriod}
              clock={miniClock}
              flashLal={f >= a4 ? scored("LAL") : 0}
              flashDal={f >= a4 ? scored("DAL") : 0}
              final={final}
            />
          </div>
        </div>
      )}

      {/* the bulbs: two socket boards, then two strips under the board */}
      {f >= Math.min(tA - 6, fieldsAt - 2) && bulbs}

      {/* the Jan 22 board, down to centre and dark */}
      {!janGone && (
        <div style={blurIn(f, mount, { dur: 6 })}>
          <StaplesNightBoard
            style={{ transform: `translateY(${(janY - PARK.y).toFixed(1)}px)` }}
            st={{ power: janPower, tor: janPower > 0 ? 104 : null, lal: janPower > 0 ? 122 : null, period: "FINAL", clock: "0.0", logoTor: 1, logoLal: 1 }}
          />
          {decOn && <div style={{ position: "absolute", left: PARK.x, top: janY, width: PARK.w, height: PARK.h, borderRadius: 14, background: `rgba(0,0,0,${(0.5 * fall).toFixed(3)})` }} />}
        </div>
      )}

      {/* the Dec 20 board: turns down like a page going back, then lifts to the top */}
      {decOn && (
        <div style={{ position: "absolute", left: BX, top: decY, width: 900, height: 160, perspective: 1600, perspectiveOrigin: "50% -40%" }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 0%", transform: `rotateX(${angle.toFixed(2)}deg)`, backfaceVisibility: "hidden" }}>{decBoard}</div>
        </div>
      )}

      {/* the bench photos' credits, under the card beside the source line */}
      {cardOn && (
        <div style={{ ...blurIn(f, cardAt + 6, { dur: 8 }), position: "absolute", right: 90, top: 1466, fontFamily: theme.font.ui, fontSize: 22, color: GREY, textAlign: "right", lineHeight: 1.4 }}>
          STAPLES courtside, Oct 2005: Niv Singer, CC BY-SA 2.0
          <br />
          Kobe photo: Sgt. Joseph A. Lee, USMC, public domain
        </div>
      )}

      {/* source line */}
      <div style={{ ...sourceIn, position: "absolute", left: 92, top: 1424, fontFamily: theme.font.ui, fontSize: 26, color: GREY }}>Basketball-Reference play-by-play, Dec 20 2005</div>
    </>
  );
};
