// "So yes, Kobe once outscored a whole NBA team in a half. Follow for the next wild NBA story, and send this to the
// friend who says Kobe just shot a lot."
// The hooks' ground, resolved. The endlessbender photo of the night comes back full, Kobe's gold #8 cut-out steps in
// front, and the reel's scoreboard reads FINAL 104-122. On "outscored" its rows roll over for the second half,
// BRYANT 55 (gold) over RAPTORS 41 (red), with a strip of point bulbs under each row: the gold one runs to 55, the red
// one stops 14 short. From "team" to "half" the five red Raptors jerseys on the real floor are ringed one by one.
// Then the creator's real Instagram profile: the Follow button presses, the follower count ticks up, the real post
// row rises under it. Last, Instagram's share sheet: one plain contact lit, and the preview, the reel's 9 x 9 board,
// fills to 81 gold bulbs on "lot".
import React from "react";
import { Img, staticFile } from "remotion";
import { Travel, blurIn, countTo, ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import {
  CloseNightResolvedBoard,
  CloseNightResolvedBulb,
  CloseNightResolvedChip,
  CloseNightResolvedGold,
  CloseNightResolvedLogo,
  CloseNightResolvedProfile,
  CloseNightResolvedRed,
  CloseNightResolvedSheet,
} from "./CloseNightResolvedKit";

const PHOTO = "kobe-81/closenightresolved-night.jpg"; // 1024 x 768
const SRC_W = 1024;
const SRC_H = 768;
const CARD = { x: 90, y: 760, w: 900, h: 675 };
const BASE = CARD.w / SRC_W;

// the five red Raptors jerseys on the floor (1024 px coords): ellipse centre and radii around each body
const RAPTORS: { x: number; y: number; rx: number; ry: number }[] = [
  { x: 373, y: 486, rx: 33, ry: 56 }, // #5, alone at left
  { x: 652, y: 390, rx: 24, ry: 40 }, // #13, behind the turned defender
  { x: 650, y: 432, rx: 27, ry: 44 }, // the defender turned away, in front of #13
  { x: 722, y: 398, rx: 27, ry: 48 }, // #4 on the lane
  { x: 779, y: 415, rx: 27, ry: 48 }, // #11 in the low post
];

// the strips of point bulbs under the board: 55 sockets each
const STRIP = { x0: 100, pitch: 16, r: 5.6, yGold: 712, yRed: 738 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const CloseNightResolved: React.FC = () => {
  const { f, scene, cue, theme } = useScene();
  const mount = scene.from - LEAD;

  const tYes = cue("yes");
  const tKobe = cue("Kobe");
  const tOut = cue("outscored");
  const tWhole = cue("whole");
  const tTeam = cue("team");
  const tHalf = cue("half");
  const tFollow = cue("Follow");
  const tNext = cue("next");
  const tWild = cue("wild");
  const tAnd = cue("and");
  const tSend = cue("send");
  const tFriend = cue("friend");
  const tLot = cue("lot");

  // ---------------------------------------------------------------- part 1: the night, resolved
  const liftAt = tFollow - 20;
  const lift = prog(f, liftAt, 12, ease.in);
  const liftPrev = prog(f - 1, liftAt, 12, ease.in);
  const liftV = Math.abs(lift - liftPrev) * 300;
  const part1 = lift < 1;

  // camera: the full photo, then a slow push toward the floor and the five red jerseys, finished by "half"
  const push = prog(f, tKobe - 10, tHalf - tKobe + 10, ease.inOut);
  const drift = 0.03 * prog(f, tHalf, 60, ease.linear);
  const z = 1 + 0.24 * push + drift;
  const s = BASE * z;
  const cx = clamp(lerp(512, 540, push), CARD.w / 2 / s, SRC_W - CARD.w / 2 / s);
  const cy = clamp(lerp(384, 432, push), CARD.h / 2 / s, SRC_H - CARD.h / 2 / s);
  const imgL = CARD.w / 2 - cx * s;
  const imgT = CARD.h / 2 - cy * s;
  const sweep = lerp(-0.4, 1.4, prog(f, mount, tFollow - mount, ease.linear));

  // the board: FINAL, then the second half
  const roll = prog(f, tOut - 3, 10, ease.inOut);
  const runAt = tOut + 8;
  const runDur = tTeam - 4 - runAt;
  const gold = roll < 1 ? null : Math.floor(countTo(f, runAt, runDur, 0, 55, ease.out));
  const red = roll < 1 ? null : Math.floor(countTo(f, runAt, runDur, 0, 41, ease.out));
  const goldDone = f >= runAt + runDur;
  const goldFlare = goldDone ? prog(f, runAt + runDur, 6, ease.out) * (1 - 0.4 * prog(f, runAt + runDur + 10, 20, ease.linear)) : 0;
  const ringsFlash = prog(f, tHalf, 5, ease.out) * (1 - prog(f, tHalf + 6, 14, ease.linear));

  // strips appear as empty sockets on "Kobe", fill with the counters
  const stripIn = prog(f, tKobe - 4, 10, ease.out);
  const goldN = gold ?? 0;
  const redN = red ?? 0;

  // Kobe steps in
  const kobeIn = prog(f, tYes - 4, 14, ease.out);

  // ---------------------------------------------------------------- part 2: the profile
  const profAt = tFollow - 16;
  const profIn = prog(f, profAt, 13, ease.out);
  const press = prog(f, tFollow - 3, 3, ease.out) * (1 - prog(f, tFollow + 1, 6, ease.out));
  const following = f >= tFollow + 2 ? 1 : 0;
  const ripple = prog(f, tFollow - 2, 18, ease.out);
  const followerRoll = prog(f, tFollow + 4, 9, ease.inOut);
  const grid = prog(f, tNext - 6, 12, ease.out);
  const postSweep = lerp(-0.4, 1.4, prog(f, tWild, 24, ease.inOut));
  const behind = prog(f, tAnd - 2, 14, ease.inOut);
  const profSlow = 0.015 * prog(f, profAt, tAnd - profAt, ease.linear);

  // ---------------------------------------------------------------- part 3: the share sheet
  const sheetAt = tSend - 12;
  const sheetIn = prog(f, sheetAt, 14, ease.out);
  const plane = prog(f, tSend, 9, ease.back);
  const lit = prog(f, tFriend, 7, ease.back);
  const swap = prog(f, tFriend + 4, 10, ease.inOut);
  const bulbs = 81 * prog(f, tSend + 6, tLot - (tSend + 6), ease.inOut);
  const bloom = prog(f, tLot, 5, ease.out) * (1 - 0.6 * prog(f, tLot + 8, 24, ease.linear));
  const breathe = f > tLot + 20 ? 0.5 + 0.5 * Math.sin((f - tLot - 20) / 9) : 0;
  const sheetPush = 0.012 * prog(f, tLot, 60, ease.linear);

  const liftStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    transform: `translateY(${(-240 * lift).toFixed(1)}px)`,
    opacity: 1 - lift,
    filter: liftV > 1 ? `blur(${Math.min(8, liftV * 0.12).toFixed(2)}px)` : undefined,
  };

  return (
    <>
      {part1 && (
        <div style={liftStyle}>
          {/* the board */}
          <div style={{ ...blurIn(f, mount, { dur: 8 }), position: "absolute", inset: 0 }}>
            <CloseNightResolvedBoard
              top={{
                prevName: "RAPTORS",
                name: "BRYANT",
                roll,
                score: roll < 0.5 ? 104 : gold,
                gold: roll >= 0.5,
                prevLogo: <CloseNightResolvedLogo file="nba-raptors-primary.svg" />,
                logo: <CloseNightResolvedChip />,
                flare: goldFlare,
              }}
              bottom={{
                prevName: "LAKERS",
                name: "RAPTORS",
                roll: prog(f, tOut + 1, 10, ease.inOut),
                score: roll < 0.5 ? 122 : red,
                prevLogo: <CloseNightResolvedLogo file="nba-lakers-primary.svg" />,
                logo: <CloseNightResolvedLogo file="nba-raptors-primary.svg" pulse={ringsFlash} />,
              }}
              prevPeriod="FINAL"
              period="2ND HALF"
              periodRoll={prog(f, tOut + 2, 10, ease.inOut)}
              clock="0.0"
            />
          </div>

          {/* the bulb strips: one gold bulb per Kobe point, one red bulb per Raptors point, second half */}
          <div style={{ position: "absolute", inset: 0, opacity: stripIn }}>
            {Array.from({ length: 55 }, (_, i) => (
              <CloseNightResolvedBulb key={`g${i}`} x={STRIP.x0 + i * STRIP.pitch} y={STRIP.yGold} r={STRIP.r} color={CloseNightResolvedGold} lit={i < goldN ? 1 : 0} glow={1 + goldFlare} />
            ))}
            {Array.from({ length: 55 }, (_, i) => (
              <CloseNightResolvedBulb key={`r${i}`} x={STRIP.x0 + i * STRIP.pitch} y={STRIP.yRed} r={STRIP.r} color={CloseNightResolvedRed} lit={i < redN ? 1 : 0} glow={1 + ringsFlash} />
            ))}
          </div>

          {/* the night photo, full */}
          <Travel at={mount} from="bottom" dist={200} dur={12} curve="measured" style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
            <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 24, overflow: "hidden", background: "#161B22", border: "2px solid #30363D", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
              <Img src={staticFile(PHOTO)} style={{ position: "absolute", left: imgL, top: imgT, width: SRC_W * s, height: SRC_H * s, maxWidth: "none" }} />
              <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", background: `linear-gradient(105deg, transparent ${(sweep - 0.18) * 100}%, rgba(255,236,200,0.10) ${sweep * 100}%, transparent ${(sweep + 0.18) * 100}%)` }} />
              <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "overlay" }}>
                <filter id="closenightresolved-grain">
                  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 9} />
                  <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#closenightresolved-grain)" />
              </svg>
              {/* the stands dim a step once the rings start, so the floor holds the eye */}
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at ${((imgL + 600 * s) / CARD.w) * 100}% ${((imgT + 440 * s) / CARD.h) * 100}%, rgba(5,8,12,0) 30%, rgba(5,8,12,${(0.42 * prog(f, tWhole, 20, ease.out)).toFixed(3)}) 75%)` }} />
              {/* the rings, one per red jersey, drawn on from "team", the last landing on "half"; the stroked ones are rotated -90 so the dash starts at the top, hence rx and ry swapped */}
              <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                {RAPTORS.map((p, i) => {
                  const k = prog(f, tTeam - 2 + i * 6, 10, ease.out);
                  if (k <= 0) return null;
                  const x = imgL + p.x * s;
                  const y = imgT + p.y * s;
                  const w = 3 + 2.5 * ringsFlash;
                  return (
                    <g key={i}>
                      <ellipse cx={x} cy={y} rx={p.rx * s} ry={p.ry * s} fill={`rgba(206,17,65,${(0.10 * k).toFixed(3)})`} stroke="none" />
                      <ellipse cx={x} cy={y} rx={p.ry * s} ry={p.rx * s} fill="none" stroke={CloseNightResolvedRed} strokeWidth={w + 5} opacity={0.35 * k} style={{ filter: "blur(4px)" }} pathLength={1} strokeDasharray={`${k} 1`} transform={`rotate(-90 ${x} ${y})`} />
                      <ellipse cx={x} cy={y} rx={p.ry * s} ry={p.rx * s} fill="none" stroke="#FF4A6E" strokeWidth={w} pathLength={1} strokeDasharray={`${k} 1`} transform={`rotate(-90 ${x} ${y})`} />
                    </g>
                  );
                })}
              </svg>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, transparent 58%, rgba(0,0,0,0.36) 100%)" }} />
              <div style={{ position: "absolute", right: 0, top: 0, padding: "10px 16px 18px 40px", background: "linear-gradient(200deg, rgba(0,0,0,0.6), rgba(0,0,0,0) 80%)", fontFamily: theme.font.ui, fontSize: 22, color: "#C9D1D9" }}>
                endlessbender, CC BY 2.0
              </div>
              <div style={{ position: "absolute", right: 0, bottom: 0, padding: "18px 16px 10px 60px", background: "linear-gradient(20deg, rgba(0,0,0,0), rgba(0,0,0,0.6) 70%)", fontFamily: theme.font.ui, fontSize: 22, color: "#C9D1D9", opacity: kobeIn }}>
                Kobe: Sgt. Joseph A. Lee, USMC, public domain
              </div>
            </div>
          </Travel>

          {/* Kobe, the gold #8, stepping in front at left */}
          <div
            style={{
              position: "absolute",
              left: 4 - 160 * (1 - kobeIn),
              top: 958,
              width: 302,
              height: 482,
              opacity: Math.min(1, kobeIn * 1.6),
              filter: `drop-shadow(0 20px 30px rgba(0,0,0,0.6))${kobeIn < 0.9 ? ` blur(${((1 - kobeIn) * 6).toFixed(2)}px)` : ""}`,
              transform: `scale(${1 + 0.02 * push})`,
              transformOrigin: "50% 100%",
            }}
          >
            <Img src={staticFile("kobe-81/closenightresolved-kobe.png")} style={{ width: 302, height: 482, WebkitMaskImage: "linear-gradient(180deg, #000 86%, transparent 100%)", maskImage: "linear-gradient(180deg, #000 86%, transparent 100%)" }} />
          </div>
        </div>
      )}

      {/* the creator's real profile */}
      {f >= profAt && (
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 556,
            width: 900,
            height: 880,
            transform: `translateY(${((1 - profIn) * 700).toFixed(1)}px) scale(${(1 - 0.06 * behind + profSlow).toFixed(4)})`,
            transformOrigin: "50% 0%",
            opacity: Math.min(1, profIn * 1.5) * (1 - 0.55 * behind),
          }}
        >
          <CloseNightResolvedProfile press={press} following={following} followerRoll={followerRoll} ripple={ripple} grid={grid} sweep={postSweep} />
        </div>
      )}

      {/* Instagram's share sheet */}
      {f >= sheetAt && (
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 580,
            width: 900,
            height: 870,
            transform: `translateY(${((1 - sheetIn) * 900).toFixed(1)}px) scale(${(1 + sheetPush).toFixed(4)})`,
            transformOrigin: "50% 40%",
          }}
        >
          <CloseNightResolvedSheet plane={plane} lit={lit} swap={swap} bulbs={bulbs} bloom={bloom} breathe={breathe} />
        </div>
      )}
    </>
  );
};
