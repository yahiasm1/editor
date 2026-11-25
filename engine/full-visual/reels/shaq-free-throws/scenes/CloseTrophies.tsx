// close, dark, 75.46-88.18 s (holds to the end): "And Shaq? He still won four championships and three Finals MVPs.
// So yes, teams fouled him on purpose, because it was the only way to slow him down. Follow for the next wild NBA
// story, and send this to the friend who can't hit a free throw either."
// Shaq? the 2000 Finals photo (Bigmoe797) rises big and pushes in. He still won: it moves up, a shelf draws under
// it. four: four Larry O'Brien trophies (redrawn from Erik Drost's photo) drop onto the shelf over 2000, 2001, 2002
// (Lakers) and 2006 (Heat). championships: Basketball-Reference's "4x NBA Champ" tag, light runs across the gold.
// three: the "3x Finals MVP" tag drops in, plates slide onto the three Lakers plinths. MVPs: light over the plates.
// So yes: the trophy room shrinks into the top right corner; the camera is back on the hook's frame, Shaq on the line
// behind the shooter (the `picture` world). purpose: the grab hand clamps. only: it strains. way: it slips. slow:
// it falls away and Shaq steps forward, the floor shakes. down: the spotlight. Follow: the follow row; story:
// Following. send: the ball lifts out of his hands; who: release; either: clank off the front rim, the quarter
// spins on the line.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { arrive, ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import {
  PC_FT_Y, PC_SHAQ_FT, PICTURE_COURT_END_CAM, PICTURE_COURT_LINE_SPOT,
  pcBand, pcLerp as lerp, pcMixCam, pcProjector, pcRnd, type PcCam,
} from "./PictureCourtWorld";
import { PictureCourtBasket, PictureCourtFloor } from "./PictureCourtFloor";
import { PictureCourtArena } from "./PictureCourtArena";
import { PictureCourtGrab, PICTURE_COURT_GRAB_ANGLE, PICTURE_COURT_GRAB_AT } from "./PictureCourtGrab";
import { CloseTrophiesTrophy } from "./CloseTrophiesTrophy";
import { CloseTrophiesCard } from "./CloseTrophiesCard";

const PUB = (n: string) => staticFile(`shaq-free-throws/closetrophies-${n}`);
const SHAQ = PUB("shaq-lakers.png");
const BALL = PUB("ball.png");
const IMG_W = 719, IMG_H = 2327;
const FEET_X = 430, HAND: [number, number] = [612, 1150];
const BALL_PX = 250;
const FONT = "Inter, sans-serif";
const GREY = "#8B949E";
const BG = "#0D1117";
const FOUL = "#E5383B";
const BALL_FT = 0.78; // 9.4 in

/** the trophies: year, team logo, a Finals MVP that year */
const CLOSE_TROPHIES_YEARS = [
  { y: "2000", logo: "lakers.svg", mvp: true },
  { y: "2001", logo: "lakers.svg", mvp: true },
  { y: "2002", logo: "lakers.svg", mvp: true },
  { y: "2006", logo: "heat.svg", mvp: false },
];
const TROPHY_H = 370, TROPHY_W = (TROPHY_H * 200) / 500;
const SHELF_Y = 1290;
const TROPHY_X = (i: number) => 540 + (i - 1.5) * 205;

/** the photo card: 960 x 1480 crop, big then small */
const CARD_W = 560, CARD_H = (CARD_W * 1480) / 960;

function useCloseTrophiesTimes() {
  const { cue, cueEnd, scene } = useScene();
  return {
    in: scene.from - LEAD,
    shaq: cue("Shaq"),
    he: cue("He"),
    four: cue("four"),
    champs: cue("championships"),
    and2: cue("and", 2),
    three: cue("three"),
    finals: cue("Finals"),
    mvps: cue("MVPs"),
    so: cue("So"),
    teams: cue("teams"),
    fouled: cue("fouled"),
    purpose: cue("purpose"),
    only: cue("only"),
    way: cue("way"),
    slow: cue("slow"),
    down: cue("down"),
    downEnd: cueEnd("down"),
    follow: cue("Follow"),
    next: cue("next"),
    story: cue("story"),
    send: cue("send"),
    who: cue("who"),
    free: cue("free"),
    either: cue("either"),
  };
}

/** the hook's frame: behind the shooter on the line (the camera `picture` ends on), a little higher on the stage */
const CLOSE_TROPHIES_CAM_LINE: PcCam = { ...PICTURE_COURT_END_CAM, cy: 960 };
/** where the court comes in from: higher and further back, looking down the lane */
const CLOSE_TROPHIES_CAM_HIGH: PcCam = { ...PICTURE_COURT_END_CAM, D: 30, tz: 6.5, pitch: (24 * Math.PI) / 180, cy: 900 };

export const CloseTrophies: React.FC = () => {
  const { f } = useScene();
  const t = useCloseTrophiesTimes();

  // ---------- part one: the trophy room ----------
  const away = prog(f, t.so - 10, 22, ease.inOut); // the room shrinks into the corner
  const cardIn = arrive(f, t.in, 16);
  const cardPop = f >= t.shaq ? Math.exp(-(f - t.shaq) / 7) * Math.sin((f - t.shaq) * 0.5) : 0;
  const cardSmall = prog(f, t.he - 2, 16, ease.inOut);
  const cardScale = lerp(1, 245 / CARD_W, cardSmall) * (1 + 0.025 * cardPop) * (1 - 0.6 * away);
  const cardTop = lerp(545 + (1 - cardIn) * 140, 528, cardSmall);
  const cardOp = cardIn * (1 - prog(f, t.so - 10, 12));
  const push = 1 + 0.08 * prog(f, t.in, t.so - t.in, ease.linear);

  const shelfDraw = prog(f, t.he, 18, ease.out);
  const landAt = (i: number) => t.four + i * 7;
  const drop = (i: number) => {
    const p = prog(f, landAt(i) - 11, 11, ease.in);
    const since = f - landAt(i);
    const squash = since >= 0 ? Math.exp(-since / 5) * Math.cos(since * 0.7) : 0;
    return { y: (1 - p) * -520, op: prog(f, landAt(i) - 11, 4), squash, since };
  };
  // the shelf takes each landing
  let shelfJolt = 0;
  for (let i = 0; i < 4; i++) {
    const s = f - landAt(i);
    if (s >= 0) shelfJolt += 5 * Math.exp(-s / 4) * Math.cos(s * 1.3);
  }
  const sweep = (i: number) => {
    const a = prog(f, t.champs + i * 4, 26, ease.inOut);
    return a <= 0 ? -1 : a >= 1 ? 2 : -0.4 + a * 1.8;
  };
  const plateAt = (i: number) => t.three + i * 6;
  const champTag = arrive(f, t.champs - 2, 10);
  const mvpTag = arrive(f, t.three - 2, 10);
  const mvpDrop = (1 - prog(f, t.three - 2, 10, ease.out)) * -60;

  // the room's corner pose: everything shrinks about the shelf's right top and lands at the top right of the stage
  const roomS = lerp(1, 0.22, away);
  const roomTf = `translate(${(lerp(0, 1030 - 960, away)).toFixed(1)}px, ${(lerp(0, 540 - 920, away)).toFixed(1)}px) scale(${roomS.toFixed(4)})`;
  const roomOp = 1 - 0.25 * away - prog(f, t.follow - 4, 12) * 0.75;
  const labelsOp = 1 - prog(f, t.so - 12, 8);

  // ---------- part two: back at the line ----------
  const courtIn = prog(f, t.so - 12, 20, ease.out);
  let cam = pcMixCam(CLOSE_TROPHIES_CAM_HIGH, CLOSE_TROPHIES_CAM_LINE, prog(f, t.so - 12, t.teams + 6 - (t.so - 12), ease.inOut));
  // a slow push once he is free, and a held breath on the follow
  cam = { ...cam, D: cam.D * (1 - 0.1 * prog(f, t.down, t.send - t.down, ease.inOut)) };
  // the floor shakes as he steps forward
  const stepLand = t.slow + 10;
  const shk = f >= stepLand ? Math.exp(-(f - stepLand) / 6) : 0;
  const jx = Math.sin((f - stepLand) * 2.3) * 12 * shk, jy = Math.cos((f - stepLand) * 3.1) * 9 * shk;
  const P = pcProjector(cam);

  const step = prog(f, t.slow, 12, ease.inOut);
  const sx = PICTURE_COURT_LINE_SPOT[0], sy = lerp(PICTURE_COURT_LINE_SPOT[1], 14.45, step);
  const bob = step > 0 && step < 1 ? Math.sin(step * Math.PI) * 0.14 : 0;
  const feet = P.p(sx, sy, 0);
  const head = P.p(sx, sy, PC_SHAQ_FT);
  const h = Math.max(feet.y - head.y, 0.86 * feet.s * PC_SHAQ_FT);
  const k = h / IMG_H;
  const shaqLeft = feet.x - FEET_X * k;
  const shaqTop = feet.y - h - bob * feet.s;

  // the house: dark from the start, the spotlight back on him on "down"
  const dark = 0.55 + 0.4 * prog(f, t.slow + 4, 14);
  const spot = 0.45 + 0.55 * prog(f, t.slow + 4, 12, ease.out);
  const coneTop = lerp(300, 520, spot);
  const coneW = h * 0.36;

  // the grab: reaches in on "fouled", clamps on "purpose", strains on "only", slips on "way", falls on "slow"
  const reachIn = arrive(f, t.fouled - 4, t.purpose - t.fouled + 2);
  const reachOut = prog(f, t.slow - 2, 12, ease.in);
  const reach = reachIn * (1 - reachOut);
  const clamp = prog(f, t.purpose - 3, 5, ease.outHard) * (1 - 0.65 * prog(f, t.way - 2, 10));
  const bloom = prog(f, t.purpose - 1, 7, ease.out) * (1 - prog(f, t.slow, 10));
  const strain = prog(f, t.only - 4, 6) * (1 - prog(f, t.slow - 2, 4));
  const slip = prog(f, t.way - 2, 14, ease.in);
  const sjx = Math.sin(f * 2.3) * 7 * strain, sjy = Math.cos(f * 3.1) * 5 * strain;
  const fall = reachOut;
  // his arm answers the strain only by a hair: he does not move
  const shaqHold = Math.sin(f * 2.9) * 0.15 * strain;

  // the ball: in his hand, lifted on "send", released on "who", off the front rim on "either"
  const handX = shaqLeft + HAND[0] * k, handY = shaqTop + HAND[1] * k;
  const A: [number, number, number] = [sx + 0.15, sy - 0.6, 9.3];
  const C: [number, number, number] = [0, 0.75 + BALL_FT / 2 + 0.06, 10.2];
  const hitF = t.either - 1;
  const rel = t.who;
  let ballX = handX, ballY = handY, ballS = BALL_PX * k, ballRot = 0;
  const pA = P.p(A[0], A[1], A[2]);
  if (f >= t.send && f < rel) {
    const q = prog(f, t.send, rel - t.send, ease.inOut);
    ballX = lerp(handX, pA.x, q); ballY = lerp(handY, pA.y, q) - Math.sin(q * Math.PI) * 20; ballS = lerp(BALL_PX * k, BALL_FT * pA.s, q);
    ballRot = q * 40;
  } else if (f >= rel && f < hitF) {
    const u = (f - rel) / (hitF - rel);
    const x = lerp(A[0], C[0], u), y = lerp(A[1], C[1], u), z = lerp(A[2], C[2], u) + 4 * 4.6 * u * (1 - u);
    const p = P.p(x, y, z);
    ballX = p.x; ballY = p.y; ballS = BALL_FT * p.s; ballRot = 40 - (f - rel) * 14; // backspin
  } else if (f >= hitF) {
    // two bounces back toward the shooter, then a roll
    const s = f - hitF;
    const B1: [number, number] = [0.7, 6.2], B2: [number, number] = [1.1, 9.4], B3: [number, number] = [1.3, 11.2];
    let x: number, y: number, z: number;
    if (s < 30) {
      const u = s / 30;
      x = lerp(C[0], B1[0], u); y = lerp(C[1], B1[1], u); z = lerp(C[2], BALL_FT / 2, u) + 4 * 2.4 * u * (1 - u);
    } else if (s < 50) {
      const u = (s - 30) / 20;
      x = lerp(B1[0], B2[0], u); y = lerp(B1[1], B2[1], u); z = BALL_FT / 2 + 4 * 2.6 * u * (1 - u);
    } else {
      const u = Math.min(1, (s - 50) / 30);
      x = lerp(B2[0], B3[0], 1 - (1 - u) * (1 - u)); y = lerp(B2[1], B3[1], 1 - (1 - u) * (1 - u)); z = BALL_FT / 2;
    }
    const p = P.p(x, y, z);
    ballX = p.x; ballY = p.y; ballS = BALL_FT * p.s; ballRot = 40 - (hitF - rel) * 14 + s * 9;
  }
  const inFlight = f >= rel;
  const flightGhosts = f >= rel && f < hitF + 30 ? [2, 4, 6].map((d) => d) : [];
  const ghostAt = (g: number) => {
    if (g < rel) return null;
    if (g < hitF) {
      const u = (g - rel) / (hitF - rel);
      const p = P.p(lerp(A[0], C[0], u), lerp(A[1], C[1], u), lerp(A[2], C[2], u) + 4 * 4.6 * u * (1 - u));
      return { x: p.x, y: p.y, s: BALL_FT * p.s };
    }
    return null;
  };
  const clank = f >= hitF ? f - hitF : -1;
  const pC = P.p(0, 0.75, 10);
  const shiver = clank >= 0 ? Math.exp(-clank / 10) * Math.sin(clank * 1.4) : 0;

  // the quarter: dropped on the line beside him on "either", spins and settles
  const coinT = f - (t.either + 4);
  const coinOn = coinT >= -10;
  const coinPt = P.p(-2.4, PC_FT_Y + 0.08, 0);
  const coinD = 0.0796 * 6 * coinPt.s;
  const coinFall = coinT < 0 ? (coinT / 10) * (coinT / 10) * 260 : 0;
  const spinAng = coinT > 0 ? 30 * (1 - Math.exp(-coinT / 26)) : 0;
  const settle = prog(coinT, 34, 14, ease.inOut);
  const coinSX = lerp(Math.abs(Math.cos(spinAng)) * 0.9 + 0.1, 1, settle);
  const coinSY = lerp(1, 0.32, settle);

  // the follow row
  const cardRowIn = arrive(f, t.follow - 3, 12);
  const press = prog(f, t.next - 2, 16, ease.inOut);
  const following = prog(f, t.story - 1, 7);

  const courtOp = courtIn;
  return (
    <AbsoluteFill>
      {/* ===== the court, coming back under the room ===== */}
      {courtOp > 0.001 && (
        <AbsoluteFill style={{ opacity: courtOp, transform: `translate(${jx.toFixed(1)}px, ${jy.toFixed(1)}px)` }}>
          <PictureCourtArena P={P} f={f} rise={1} dark={dark} flash={0} flashFrom={0} />
          <PictureCourtFloor P={P} f={f} wood={1} paint={1} dim={0.5 * dark} lineLit={0.6 * spot} />
          <PictureCourtBasket P={P} f={f} op={1} sway={0.35 * shiver} dim={0.4} />
          {/* the house lights down: only his pool and the line stay lit */}
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <filter id="ct-holes" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={18} /></filter>
              <mask id="ct-housemask" maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
                <rect x={0} y={0} width={1080} height={1920} fill="#fff" />
                <g filter="url(#ct-holes)">
                  <ellipse cx={feet.x} cy={feet.y} rx={coneW * 1.45} ry={coneW * 0.42} fill="#000" />
                  <path d={pcBand(P, [[-6.5, PC_FT_Y + 0.08], [6.5, PC_FT_Y + 0.08]], 0.9)} fill="#000" />
                  <ellipse cx={pC.x} cy={pC.y + 30} rx={170} ry={130} fill="#000" opacity={0.6} />
                  <path d={`M${feet.x - coneW * 0.22} ${coneTop} L${feet.x + coneW * 0.22} ${coneTop} L${feet.x + coneW * 1.2} ${feet.y} L${feet.x - coneW * 1.2} ${feet.y} Z`} fill="#000" opacity={0.7 * spot} />
                </g>
              </mask>
              <linearGradient id="ct-cone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FFF7E6" stopOpacity={0.05} />
                <stop offset="1" stopColor="#FFF7E6" stopOpacity={0.2} />
              </linearGradient>
              <radialGradient id="ct-pool">
                <stop offset="0" stopColor="#FFF4DC" stopOpacity={0.55} />
                <stop offset="0.7" stopColor="#FFF4DC" stopOpacity={0.18} />
                <stop offset="1" stopColor="#FFF4DC" stopOpacity={0} />
              </radialGradient>
              <radialGradient id="ct-contact">
                <stop offset="0" stopColor="#000" stopOpacity={0.6} />
                <stop offset="1" stopColor="#000" stopOpacity={0} />
              </radialGradient>
              <filter id="ct-conesoft"><feGaussianBlur stdDeviation={6} /></filter>
            </defs>
            <rect x={0} y={0} width={1080} height={1920} fill="#04060A" opacity={0.8 * dark} mask="url(#ct-housemask)" />
            <path d={`M${feet.x - coneW * 0.22} ${coneTop} L${feet.x + coneW * 0.22} ${coneTop} L${feet.x + coneW * 1.2} ${feet.y} L${feet.x - coneW * 1.2} ${feet.y} Z`} fill="url(#ct-cone)" filter="url(#ct-conesoft)" opacity={spot} />
            <ellipse cx={feet.x} cy={feet.y} rx={coneW * 1.25} ry={coneW * 0.3} fill="url(#ct-pool)" opacity={spot} />
            <ellipse cx={feet.x - 10 * k} cy={feet.y - 6 * k} rx={300 * k} ry={Math.max(10, 300 * k * 0.28)} fill="url(#ct-contact)" />
            {/* the step: a puff of light dust off the boards where his foot lands */}
            {shk > 0.02 && Array.from({ length: 14 }, (_, i) => {
              const a = (i / 14) * Math.PI * 2, r = (1 - shk) * coneW * (0.6 + pcRnd(i, 7) * 0.6);
              return <circle key={i} cx={feet.x + Math.cos(a) * r} cy={feet.y + Math.sin(a) * r * 0.28} r={2 + pcRnd(i, 8) * 2.5} fill="#FFF3DA" opacity={0.7 * shk} />;
            })}
          </svg>
          {/* the quarter on the line, spinning */}
          {coinOn && (
            <div style={{ position: "absolute", left: coinPt.x - coinD / 2, top: coinPt.y - coinD * (settle > 0 ? 0.5 * coinSY + 0.5 * (1 - settle) : 1) - coinFall, width: coinD, height: coinD, transform: `scale(${coinSX.toFixed(3)}, ${coinSY.toFixed(3)})`, transformOrigin: "50% 100%", opacity: prog(coinT, -10, 4) }}>
              <div style={{ position: "absolute", left: "8%", right: "8%", bottom: -4, height: 8, borderRadius: "50%", background: "rgba(0,0,0,0.55)", filter: "blur(3px)" }} />
              <Img src={PUB("quarter-heads.png")} style={{ width: "100%", height: "100%", filter: `brightness(${(0.75 + 0.4 * Math.abs(Math.sin(spinAng))).toFixed(3)})` }} />
            </div>
          )}
          {/* Shaq on the line: the same cut-out, the grab on his arm */}
          <div style={{ position: "absolute", left: shaqLeft, top: shaqTop, width: IMG_W * k, height: h, transform: `rotate(${shaqHold.toFixed(3)}deg)`, transformOrigin: `${FEET_X * k}px ${h}px`, filter: `brightness(${(1 + 0.12 * spot).toFixed(3)})` }}>
            <Img src={SHAQ} style={{ position: "absolute", left: 0, top: 0, width: IMG_W * k, height: h }} />
            <svg width={IMG_W * k} height={h} viewBox={`0 0 ${IMG_W} ${IMG_H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <g transform={`translate(${PICTURE_COURT_GRAB_AT[0]} ${PICTURE_COURT_GRAB_AT[1]}) rotate(${PICTURE_COURT_GRAB_ANGLE}) scale(0.8) translate(${(sjx).toFixed(1)} ${(sjy + slip * 120 + fall * 260).toFixed(1)}) rotate(${(fall * 14).toFixed(2)})`}>
                <PictureCourtGrab f={f} reach={reach} clamp={clamp} bloom={bloom} hit={f >= t.purpose ? f - t.purpose : -1} />
              </g>
            </svg>
          </div>
          {/* the clank: foul red at the contact, the miss */}
          {clank >= 0 && clank < 24 && (
            <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
              <circle cx={pC.x} cy={pC.y} r={10 + clank * 4} fill="none" stroke={FOUL} strokeWidth={Math.max(1, 6 - clank * 0.25)} opacity={1 - clank / 24} />
              {Array.from({ length: 8 }, (_, i) => {
                const a = -Math.PI / 2 + (i - 3.5) * 0.36, r0 = 14 + clank * 2.5, r1 = r0 + 18;
                return <line key={i} x1={pC.x + Math.cos(a) * r0} y1={pC.y + Math.sin(a) * r0} x2={pC.x + Math.cos(a) * r1} y2={pC.y + Math.sin(a) * r1} stroke={FOUL} strokeWidth={4} strokeLinecap="round" opacity={1 - clank / 18} />;
              })}
            </svg>
          )}
          {/* the ball's flight: a short strobe, then the ball */}
          {flightGhosts.map((d) => {
            const g = ghostAt(f - d);
            return g ? <Img key={d} src={BALL} style={{ position: "absolute", left: g.x - g.s / 2, top: g.y - g.s / 2, width: g.s, height: g.s, opacity: 0.22 - d * 0.025 }} /> : null;
          })}
          <Img src={BALL} style={{ position: "absolute", left: ballX - ballS / 2, top: ballY - ballS / 2, width: ballS, height: ballS, transform: `rotate(${ballRot.toFixed(1)}deg)`, filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.5)) brightness(${inFlight ? 1.05 : 1 + 0.1 * spot})` }} />
          {/* dust in the spotlight */}
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            {Array.from({ length: 36 }, (_, i) => {
              const u = pcRnd(i, 41), v = (pcRnd(i, 42) + f * (0.002 + pcRnd(i, 43) * 0.003)) % 1;
              const y = lerp(coneTop, feet.y, v);
              const half = lerp(coneW * 0.25, coneW * 1.15, (y - coneTop) / Math.max(1, feet.y - coneTop));
              return <circle key={i} cx={feet.x + (u - 0.5) * 2 * half * 0.9} cy={y} r={1 + pcRnd(i, 44) * 2.2} fill="#FFF8E8" opacity={(0.25 + pcRnd(i, 45) * 0.5) * spot} />;
            })}
          </svg>
          <div style={{ position: "absolute", left: 40, top: 1452, fontFamily: FONT, fontSize: 20, color: GREY, opacity: 0.9 * (1 - cardRowIn * 0) }}>Bigmoe797, CC BY-SA 4.0</div>
        </AbsoluteFill>
      )}
      {/* the top of the stage fades into the navy so the caption band stays clean */}
      {courtOp > 0.001 && <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 600, opacity: courtOp, background: `linear-gradient(${BG} 0%, ${BG} 62%, rgba(13,17,23,0) 100%)` }} />}

      {/* ===== the trophy room ===== */}
      {roomOp > 0.001 && (
        <AbsoluteFill style={{ transform: roomTf, transformOrigin: "960px 920px", opacity: roomOp }}>
          {/* a display light from above onto the shelf */}
          <div style={{ position: "absolute", left: 40, top: 760, width: 1000, height: 640, opacity: shelfDraw * (1 - away), background: "radial-gradient(ellipse 50% 60% at 50% 70%, rgba(255,214,140,0.10), rgba(255,214,140,0) 70%)" }} />
          {/* the shelf */}
          <div style={{ position: "absolute", left: 540 - 440 * shelfDraw, top: SHELF_Y + shelfJolt * 0.4, width: 880 * shelfDraw, height: 80, opacity: shelfDraw }}>
            <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 14, background: "linear-gradient(#3A4350, #222A35)", borderRadius: "4px 4px 0 0" }} />
            <div style={{ position: "absolute", left: 0, top: 14, right: 0, height: 66, background: "linear-gradient(#1C232D, #12171E)", borderBottom: "1px solid #30363D", boxShadow: "0 30px 50px rgba(0,0,0,0.5)" }} />
            <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 1.5, background: "rgba(255,255,255,0.35)" }} />
          </div>
          {CLOSE_TROPHIES_YEARS.map((yr, i) => {
            const d = drop(i);
            if (d.op <= 0) return null;
            const sq = 1 - 0.05 * d.squash;
            const cx = TROPHY_X(i);
            const plate = yr.mvp ? prog(f, plateAt(i), 10, ease.out) : 0;
            const plateShine = yr.mvp ? prog(f, t.mvps + i * 4, 18, ease.inOut) : 0;
            const label = prog(f, landAt(i) - 1, 8);
            return (
              <React.Fragment key={yr.y}>
                {/* its reflection in the shelf top */}
                {d.since >= 0 && (
                  <div style={{ position: "absolute", left: cx - TROPHY_W / 2, top: SHELF_Y + 2, width: TROPHY_W, height: TROPHY_H, transform: "scaleY(-0.18)", transformOrigin: "50% 0%", opacity: 0.35 * label, WebkitMaskImage: "linear-gradient(#000, rgba(0,0,0,0) 60%)" }}>
                    <CloseTrophiesTrophy id={`r${i}`} f={f} sweep={-1} plate={plate} plateShine={0} />
                  </div>
                )}
                {/* its contact shadow */}
                <div style={{ position: "absolute", left: cx - TROPHY_W * 0.55, top: SHELF_Y - 8, width: TROPHY_W * 1.1, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.6)", filter: "blur(6px)", opacity: d.since >= 0 ? 1 : Math.max(0, 1 + d.y / 520) * 0.5 }} />
                <div
                  style={{
                    position: "absolute", left: cx - TROPHY_W / 2, top: SHELF_Y - TROPHY_H + d.y + shelfJolt * 0.4, width: TROPHY_W, height: TROPHY_H, opacity: d.op,
                    transform: `scale(${(2 - sq).toFixed(4)}, ${sq.toFixed(4)})`, transformOrigin: "50% 100%",
                    filter: `drop-shadow(0 18px 24px rgba(0,0,0,0.45))${d.y < -20 ? ` blur(${Math.min(6, -d.y / 90).toFixed(1)}px)` : ""}`,
                  }}
                >
                  <CloseTrophiesTrophy id={`t${i}`} f={f} sweep={sweep(i)} plate={plate} plateShine={plateShine} />
                </div>
                {/* the landing glint */}
                {d.since >= 0 && d.since < 14 && (
                  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
                    {[0, 1, 2, 3, 4, 5].map((j) => {
                      const a = Math.PI + (j / 5) * Math.PI, r0 = TROPHY_W * 0.55 + d.since * 3, r1 = r0 + 16;
                      return <line key={j} x1={cx + Math.cos(a) * r0} y1={SHELF_Y + Math.sin(a) * r0 * 0.3} x2={cx + Math.cos(a) * r1} y2={SHELF_Y + Math.sin(a) * r1 * 0.3} stroke="#FFE3A3" strokeWidth={3} strokeLinecap="round" opacity={1 - d.since / 14} />;
                    })}
                  </svg>
                )}
                {/* the year and the team on the shelf's edge */}
                <div style={{ position: "absolute", left: cx - 100, top: SHELF_Y + 24 + shelfJolt * 0.4, width: 200, height: 46, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: label * labelsOp, filter: `blur(${((1 - label) * 8).toFixed(1)}px)` }}>
                  <Img src={PUB(yr.logo)} style={{ width: 44, height: 44, objectFit: "contain" }} />
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: "#E6EDF3", fontVariantNumeric: "tabular-nums", letterSpacing: -0.5 }}>{yr.y}</span>
                </div>
              </React.Fragment>
            );
          })}
          {/* Basketball-Reference's real honour tags */}
          <div style={{ position: "absolute", left: 0, width: 1080, top: 1384, display: "flex", justifyContent: "center", gap: 18, opacity: labelsOp }}>
            {[
              { txt: "4x NBA Champ", a: champTag, dy: 0 },
              { txt: "3x Finals MVP", a: mvpTag, dy: mvpDrop },
            ].map((tg) => (
              <div key={tg.txt} style={{ opacity: tg.a, transform: `translateY(${tg.dy.toFixed(1)}px) scale(${(0.7 + 0.3 * tg.a).toFixed(3)})`, background: "#8f5400", color: "#fff", borderRadius: 12, padding: "6px 22px", fontFamily: "'Helvetica Neue', Helvetica, Arial, Inter, sans-serif", fontSize: 38, lineHeight: "46px", whiteSpace: "nowrap", boxShadow: "0 6px 18px rgba(0,0,0,0.4)" }}>{tg.txt}</div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, width: 1080, top: 1448, textAlign: "center", fontFamily: FONT, fontSize: 20, color: GREY, opacity: champTag * labelsOp }}>Basketball-Reference · trophy drawn from a photo by Erik Drost, CC BY 2.0</div>
        </AbsoluteFill>
      )}

      {/* ===== the 2000 Finals photo card ===== */}
      {cardOp > 0.001 && (
        <div
          style={{
            position: "absolute", left: 540 - CARD_W / 2, top: cardTop, width: CARD_W, height: CARD_H, borderRadius: 28, overflow: "hidden",
            border: "1px solid #30363D", boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
            transform: `scale(${cardScale.toFixed(4)})`, transformOrigin: "50% 0%", opacity: cardOp,
            filter: cardIn < 1 ? `blur(${((1 - cardIn) * 12).toFixed(1)}px)` : undefined,
          }}
        >
          <Img src={PUB("finals.jpg")} style={{ position: "absolute", left: 0, top: 0, width: CARD_W, height: CARD_H, transform: `scale(${push.toFixed(4)})`, transformOrigin: "60% 22%" }} />
          <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 90, background: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0))" }} />
          <div style={{ position: "absolute", right: 22, top: 18, fontFamily: FONT, fontSize: 22, color: "#C9D1D9", opacity: 1 - cardSmall }}>Bigmoe797, CC BY-SA 4.0</div>
          <div style={{ position: "absolute", left: 24, bottom: 22, fontFamily: FONT, fontWeight: 700, fontSize: 34, color: "#FFFFFF", textShadow: "0 2px 10px rgba(0,0,0,0.8)", opacity: (1 - cardSmall) * prog(f, t.shaq, 10) }}>2000 NBA Finals</div>
        </div>
      )}

      {/* ===== the follow row ===== */}
      <CloseTrophiesCard cx={540} top={1262 + (1 - cardRowIn) * 90} opacity={cardRowIn} blur={(1 - cardRowIn) * 10} press={press} following={following} ring={prog(f, t.follow, 30, ease.inOut)} />
    </AbsoluteFill>
  );
};
