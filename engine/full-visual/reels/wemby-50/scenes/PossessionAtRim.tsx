// `cost`: "So analysts count the cost. Every shot uses up one of his team's chances."
// One real possession at the Spurs' basket, 1st quarter 10:09 to 10:04 (Basketball-Reference play-by-play):
// D. Vassell's three comes off the rim, Wembanyama's offensive rebound resets the shot clock to 14, and at 10:04 he
// dunks it (shot 2 of his 29: 0 ft, made). Seen low from the side stands under the real NBA shot clock of the Toronto
// photo. The gold FGA 29 from the box score lands at the baseline as a counter "0 / 29"; the make sends the shot
// clock back to 24 and the ball to the Pelicans; a gold disc settles on his spot, labelled "chance", and the
// counter reads 1 / 29. World, projection and parts: PossessionAtRimWorld / Floor / Hoop.
import React from "react";
import { Easing } from "remotion";
import { Img, staticFile } from "remotion";
import { blurIn, blurOut, ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { PossessionAtRimFloor } from "./PossessionAtRimFloor";
import { PossessionAtRimBall, PossessionAtRimBasket, PossessionAtRimRing, type PossessionAtRimHoopState } from "./PossessionAtRimHoop";
import {
  PAR,
  possessionAtRimArc as arc,
  possessionAtRimLerp as lerp,
  possessionAtRimLerp3 as lerp3,
  possessionAtRimPlane as plane,
  possessionAtRimProjector,
  type PossessionAtRimCam,
  type PossessionAtRimProj,
  type PossessionAtRimV3,
} from "./PossessionAtRimWorld";

type V3 = PossessionAtRimV3;

// the camera: dropping in from above the court, then low in the side stands at the rim, then drifting up the lane
const CAM_TOP = { pos: [1, 40, 15] as V3, tgt: [0, 0, 6] as V3 };
const CAM_RIM = { pos: [4, 16, 21] as V3, tgt: [0.2, 6.5, 4] as V3 };
const CAM_PUSH = { pos: [3.8, 15.6, 20.3] as V3, tgt: [0.2, 6.85, 4] as V3 };
// the drift pulls back along the lane and keeps aiming at the basket, so the Pelicans' clock stays in the stage
const CAM_LANE = { pos: [4.6, 17, 28.5] as V3, tgt: [0.1, 6.0, 9.0] as V3 };
const FOC = 920;
const CY = 1040;

// the counter at the baseline, left of the lane: a standing plate 5.6 x 2.6 ft
const CTR = { x0: -11.4, x1: -4.2, y1: 3.3, z: -0.3 };

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export const PossessionAtRim: React.FC = () => {
  const { f, cue, scene, theme } = useScene();
  const mount = scene.from - LEAD;
  const tCount = cue("count");
  const tThe = cue("the");
  const tCost = cue("cost");
  const tEvery = cue("every");
  const tShot = cue("shot");
  const tUses = cue("uses");
  const tUp = cue("up");
  const tOne = cue("one");
  const tOf = cue("of");
  const tThrough = tShot + 2; // the frame the ball goes through the ring
  const tIn = tShot + 28; // the Pelicans inbound

  // ---- camera
  const pArr = prog(f, mount, tCount - mount, Easing.bezier(0.2, 0.7, 0.25, 1));
  const pPush = prog(f, tCount, tOf - tCount, ease.linear);
  const pLane = prog(f, tOf, 70, ease.inOut);
  let pos = lerp3(CAM_TOP.pos, CAM_RIM.pos, pArr);
  let tgt = lerp3(CAM_TOP.tgt, CAM_RIM.tgt, pArr);
  pos = lerp3(pos, CAM_PUSH.pos, pPush);
  tgt = lerp3(tgt, CAM_PUSH.tgt, pPush);
  pos = lerp3(pos, CAM_LANE.pos, pLane);
  tgt = lerp3(tgt, CAM_LANE.tgt, pLane);
  const cam: PossessionAtRimCam = { pos, tgt, foc: FOC, cx: 540, cy: CY };
  const pr = possessionAtRimProjector(cam);
  const mirror: PossessionAtRimProj = {
    P: (p: V3) => pr.P([p[0], -p[1], p[2]]),
    depth: (p: V3) => pr.depth([p[0], -p[1], p[2]]),
    fw: pr.fw,
  };

  // ---- the ball, through the real possession
  const R = PAR.ballR;
  // Vassell's three hits the front of the ring and kicks out toward the camera, bounces once in the lane and checks
  // back on its backspin to where Wembanyama gathers it under the rim
  const rimFront: V3 = [0.05, 10.42, 6.32];
  const floorA: V3 = [2.5, R, 7.5];
  const lowA: V3 = [0.32, 3.0, 6.4];
  const over: V3 = [0.15, 11.75, 5.33];
  const below: V3 = [0.19, 8.6, 5.25];
  const floorB: V3 = [0.32, R, 5.65];
  const hopB: V3 = [0.8, 3.0, 6.9];
  const gone: V3 = [8.6, 7.8, 20.8];
  const outQ = (t: number) => 1 - (1 - t) * (1 - t);
  const inQ = (t: number) => t * t;
  let ball: V3 | null = null;
  if (f >= tCost - 14 && f < tCost) ball = arc(f, tCost - 14, tCost, [-4.4, 15.6, 12.2], rimFront, 1.1);
  else if (f >= tCost && f < tCost + 27) ball = arc(f, tCost, tCost + 27, rimFront, floorA, 6.2);
  else if (f >= tCost + 27 && f < tEvery) ball = arc(f, tCost + 27, tEvery, floorA, lowA, 1.8, outQ);
  else if (f >= tEvery && f < tShot - 3) ball = arc(f, tEvery, tShot - 3, lowA, over, 0.25, outQ);
  else if (f >= tShot - 3 && f < tShot + 4) ball = arc(f, tShot - 3, tShot + 4, over, below, 0, inQ);
  else if (f >= tShot + 4 && f < tShot + 15) ball = arc(f, tShot + 4, tShot + 15, below, floorB, 0, inQ);
  else if (f >= tShot + 15 && f < tIn) ball = arc(f, tShot + 15, tIn, floorB, hopB, 0.4, outQ);
  else if (f >= tIn && f < tIn + 26) ball = arc(f, tIn, tIn + 26, hopB, gone, 0.9);
  const spin = (f - tCost) * 9;
  // in front of the ring and the net whenever it is nearer the camera than the ring's front edge
  const ballInFront = !!ball && ball[2] > PAR.rimZ + PAR.rimR + 0.25;

  // ---- the clocks: 10:09 and a reset 14 on the rim, both running to 10:04 / 9 at the dunk, then 24 for the Pelicans
  const pRun = prog(f, tCost, tThrough - tCost, ease.linear);
  const gameS = f < tThrough ? Math.ceil(609 - 5 * pRun) : Math.ceil(604 - (f - tThrough) / 60);
  let shot = "";
  if (f >= tCost && f < tUses) shot = String(Math.ceil(14 - 5 * pRun));
  else if (f >= tUses) shot = String(Math.min(24, Math.ceil(24 - Math.max(0, f - tIn) / 60)));
  const flash = (t: number) => (f >= t && f < t + 5 ? 1 : 0);
  // the ring: jolted by the miss, pulled down by the dunk and springing back
  const dc = f - tCost;
  const dd = f - tThrough;
  const rattle = (dc >= 0 ? 0.11 * Math.sin(dc * 1.9) * Math.exp(-dc / 6) : 0) + (dd >= -2 ? -0.16 * Math.exp(-Math.max(0, dd) / 5) * Math.cos(Math.max(0, dd) * 0.9) * prog(f, tThrough - 2, 2, ease.linear) : 0);
  const sw = dd >= 0 ? Math.exp(-dd / 16) : 0;
  const whip = dd >= 0 ? Math.exp(-dd / 5) * Math.sin(Math.min(Math.PI, dd * 0.55)) : 0;
  const st: PossessionAtRimHoopState = {
    game: mmss(Math.max(0, gameS)),
    shot,
    gameLit: prog(f, tThe - 2, 6, ease.linear),
    shotLit: shot ? 1 : 0,
    shotFlash: Math.max(flash(tCost), flash(tUses)),
    rattle,
    net: {
      stretch: 1 + 0.6 * whip,
      bulge: 0.1 * whip,
      sx: (dc >= 0 ? 0.14 * Math.sin(dc * 0.5) * Math.exp(-dc / 14) : 0) + 0.08 * sw * Math.sin(dd * 0.45),
      sz: 0.16 * sw * Math.sin(dd * 0.38 + 1),
    },
  };

  // ---- the disc on his spot: drops on "up", settles into the boards with a weight bounce
  const dropT = 10;
  const pd = prog(f, tUp - dropT, dropT, ease.in);
  const db = f - tUp;
  const discY = f < tUp ? 2.6 * (1 - pd) : db < 8 ? 0.17 * Math.sin((Math.PI * db) / 8) : db < 14 ? 0.04 * Math.sin((Math.PI * (db - 8)) / 6) : 0;
  const discOn = prog(f, tUp - dropT, 4, ease.linear);
  const landRing = f >= tUp ? prog(f, tUp, 22, ease.out) : 0;

  // ---- the counter: the gold FGA 29 falls in and lands at the baseline as 0 / 29, and rolls to 1 / 29 on "one"
  const fallStart = scene.from + 6;
  const pf = prog(f, fallStart, tCount - fallStart, Easing.bezier(0.55, 0, 0.9, 0.55));
  const cb = f - tCount;
  const ctrBounce = cb >= 0 && cb < 12 ? 0.32 * Math.sin((Math.PI * cb) / 12) * Math.exp(-cb / 10) : 0;
  const ctrM = plane(pr.P, [CTR.x0, CTR.y1 + ctrBounce, CTR.z], [CTR.x1, CTR.y1 + ctrBounce, CTR.z], [CTR.x0, ctrBounce, CTR.z], 460, 214);
  const m1 = ctrM.match(/matrix\(([^)]+)\)/)![1].split(" ").map(Number);
  // where it falls from: the gold cell's size and place as the box score left it, above the stage
  const m0 = [0.5, 0, 0, 0.5 * (214 / 214), 128, 360];
  const wob = (1 - pf) * 0.12 * Math.sin(pf * 5);
  const mm = m0.map((v, i) => lerp(v, m1[i], pf));
  const ca = Math.cos(wob), sa = Math.sin(wob);
  const ctrMatrix = `matrix(${(mm[0] * ca - mm[1] * sa).toFixed(5)} ${(mm[0] * sa + mm[1] * ca).toFixed(5)} ${mm[2].toFixed(5)} ${mm[3].toFixed(5)} ${mm[4].toFixed(2)} ${mm[5].toFixed(2)})`;
  const morph = prog(f, tCount, 9, ease.out);
  const roll = prog(f, tOne, 8, ease.out);
  const ctrOn = prog(f, fallStart, 5, ease.linear);

  // ---- screen anchors for the labels
  const rimS = pr.P([0, PAR.rimY, PAR.rimZ]);
  const discEdge = pr.P([PAR.spot[0] + PAR.discR, discY + PAR.discH, PAR.spot[2]]);
  const pbpOn = tThrough + 3;
  // the play-by-play card has done its job once the disc lands: it leaves on "up" so "chance" and 1 / 29 carry the end
  const pbpOff = tUp + 8;

  return (
    <>
      <svg
        width={1080}
        height={1920}
        style={{
          position: "absolute",
          inset: 0,
          // it arrives over the lifting box score as one move, never a one-frame pop of the whole floor
          opacity: prog(f, mount, 4, ease.out),
          transform: `translateY(${(60 * (1 - prog(f, mount, 12, ease.out))).toFixed(1)}px)`,
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0, transparent 506px, #000 566px, #000 1392px, transparent 1462px)",
          maskImage: "linear-gradient(to bottom, transparent 0, transparent 506px, #000 566px, #000 1392px, transparent 1462px)",
        }}
      >
        <defs>
          <filter id="par-refl" x="-20%" y="-20%" width="140%" height="160%">
            <feGaussianBlur stdDeviation="3 10" />
          </filter>
          <filter id="par-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <PossessionAtRimFloor pr={pr} f={f} />

        {/* the satin floor mirrors the basket, the clock and the ball, as the Toronto photo's floor does */}
        <g opacity={0.17} filter="url(#par-refl)">
          <PossessionAtRimBasket pr={mirror} st={st} id="par-m" mirror />
          <PossessionAtRimRing pr={mirror} st={st} part="back" />
          <PossessionAtRimRing pr={mirror} st={st} part="front" />
          {ball && <PossessionAtRimBall pr={mirror} p={[ball[0], ball[1], ball[2]]} spin={spin} id="par-mb" />}
        </g>

        {/* shadows on the boards: the ball's, the disc's, the counter's */}
        {ball && <PossessionAtRimShadow pr={pr} x={ball[0]} z={ball[2]} r={R * (1 + ball[1] * 0.08)} a={0.5 * Math.max(0, 1 - ball[1] / 13)} />}
        {discOn > 0 && <PossessionAtRimShadow pr={pr} x={PAR.spot[0]} z={PAR.spot[2]} r={PAR.discR * (1.08 + discY * 0.25)} a={0.55 * discOn * Math.max(0.2, 1 - discY / 3)} />}
        {pf >= 1 && <polygon points={[[CTR.x0 - 0.1, 0, CTR.z + 0.05], [CTR.x1 + 0.1, 0, CTR.z + 0.05], [CTR.x1 + 0.3, 0, CTR.z + 0.9], [CTR.x0 - 0.1, 0, CTR.z + 0.9]].map((p) => { const q = pr.P(p as V3); return `${q.x},${q.y}`; }).join(" ")} fill="#000" opacity={0.28} filter="url(#par-soft)" />}

        {/* the disc lands with weight: a ring of light runs out through the satin */}
        {landRing > 0 && landRing < 1 && <PossessionAtRimFloorRing pr={pr} r={PAR.discR * (1.1 + landRing * 1.6)} a={0.45 * (1 - landRing)} />}
        {discOn > 0 && <PossessionAtRimDisc pr={pr} y={discY} opacity={discOn} />}

        <PossessionAtRimBasket pr={pr} st={st} id="par-r" />
        <PossessionAtRimRing pr={pr} st={st} part="back" />
        {ball && !ballInFront && <PossessionAtRimBall pr={pr} p={ball} spin={spin} id="par-b" />}
        <PossessionAtRimRing pr={pr} st={st} part="front" />
        {ball && ballInFront && <PossessionAtRimBall pr={pr} p={ball} spin={spin} id="par-b" />}

        {/* the counter */}
        <g transform={ctrMatrix} opacity={ctrOn}>
          <rect x={0} y={0} width={460} height={214} rx={20} fill="#161B22" stroke={PAR.gold} strokeOpacity={0.55} strokeWidth={4} />
          <rect x={0} y={0} width={460} height={214} rx={20} fill={PAR.gold} opacity={0.07} />
          <defs>
            <clipPath id="par-roll">
              <rect x={20} y={70} width={150} height={130} />
            </clipPath>
          </defs>
          <text x={30} y={64} fontFamily="Inter, sans-serif" fontSize={60} fontWeight={600} letterSpacing={3} fill={PAR.label}>FGA</text>
          <g fontFamily="Inter, sans-serif" fontWeight={800} fontSize={124} fill={PAR.gold} style={{ fontVariantNumeric: "tabular-nums" }}>
            <text x={lerp(305, 430, morph)} y={182} textAnchor="end">29</text>
            <g opacity={morph}>
              <text x={lerp(170, 218, morph)} y={182} textAnchor="middle" fill="#6E7681" fontWeight={500}>/</text>
              <g clipPath="url(#par-roll)">
                <g transform={`translate(${lerp(-60, 0, morph).toFixed(1)} ${(-130 * roll).toFixed(1)})`}>
                  <text x={160} y={182} textAnchor="end">0</text>
                  <text x={160} y={312} textAnchor="end">1</text>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>

      {/* who has the ball: the real Wemby (Commons, credited), up on "Every" as the ball rises from his spot */}
      {f >= tEvery - 4 && (
        <div style={{ position: "absolute", left: 772, top: 584, width: 268, height: 350, borderRadius: 18, overflow: "hidden", background: "#161B22", boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 2px #30363D", ...blurIn(f, tEvery - 4, { dur: 9, rise: 40, scaleFrom: 0.94 }) }}>
          <div style={{ position: "absolute", inset: 0, transformOrigin: "40% 30%", transform: `scale(${(1.04 + 0.08 * prog(f, tEvery - 4, 150, ease.linear)).toFixed(4)})` }}>
            <Img src={staticFile("wemby-50/possessionatrim-wemby-onoguchi.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "45% 12%", display: "block" }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, background: "linear-gradient(180deg, rgba(0,0,0,0.6), transparent)" }} />
          <div style={{ position: "absolute", right: 12, top: 9, fontFamily: theme.font.ui, fontSize: 18, color: "rgba(230,232,236,0.85)", whiteSpace: "nowrap" }}>Daiei Onoguchi, CC BY 4.0</div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 110, background: "linear-gradient(0deg, rgba(0,0,0,0.8), transparent)" }} />
          <div style={{ position: "absolute", left: 16, bottom: 14, fontFamily: theme.font.ui, fontWeight: 700, fontSize: 32, letterSpacing: -0.3, color: "#FFFFFF", whiteSpace: "nowrap" }}>V. Wembanyama</div>
        </div>
      )}

      {/* the play-by-play line for this make, Basketball-Reference's own copy */}
      {f >= pbpOn && f < pbpOff + 12 && (() => {
        const lx = Math.min(560, rimS.x + 90);
        const ly = rimS.y + 70;
        return (
          <>
            <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
              <path d={`M${rimS.x + 46} ${rimS.y + 4} L${lx + 70} ${ly}`} stroke="rgba(244,246,248,0.6)" strokeWidth={2} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(f, pbpOn, 8, ease.out)} opacity={1 - prog(f, pbpOff, 8, ease.linear)} />
            </svg>
            <div style={{ position: "absolute", left: lx, top: ly, ...(f < pbpOff ? blurIn(f, pbpOn + 2, { dur: 7, rise: 10 }) : blurOut(f, pbpOff, { dur: 10 })) }}>
              <div style={{ background: "rgba(22,27,34,0.95)", border: `2px solid ${PAR.hair}`, borderRadius: 16, padding: "14px 22px 16px", boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
                <div style={{ fontFamily: theme.font.ui, fontSize: 32, color: PAR.label, whiteSpace: "nowrap" }}>1st quarter, 10:04.0</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4, fontFamily: theme.font.ui, fontSize: 32, fontWeight: 600, color: "#FFFFFF", whiteSpace: "nowrap" }}>
                  <span style={{ width: 18, height: 18, borderRadius: 9, background: "#FFFFFF", display: "inline-block" }} />
                  made 2-pointer from 0 ft
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* "chance", written once, on the first disc spent */}
      {f >= tOne && (
        <>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <path d={`M${discEdge.x + 6} ${discEdge.y} L${discEdge.x + 52} ${discEdge.y - 44} H${discEdge.x + 106}`} stroke={PAR.label} strokeWidth={2} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(f, tOne, 8, ease.out)} />
          </svg>
          <div style={{ position: "absolute", left: discEdge.x + 116, top: discEdge.y - 68, fontFamily: theme.font.ui, fontSize: 40, fontWeight: 600, color: "#C9D1D9", textShadow: "0 0 4px #0B0C0F, 0 0 10px #0B0C0F, 0 0 18px #0B0C0F", ...blurIn(f, tOne + 3, { dur: 7 }) }}>chance</div>
        </>
      )}

      <div style={{ position: "absolute", left: 96, top: 1404, fontFamily: theme.font.ui, fontSize: 26, color: PAR.label, textShadow: "0 0 4px #0D1117, 0 0 10px #0D1117, 0 0 16px #0D1117", opacity: prog(f, pbpOn, 10) }}>Basketball-Reference play-by-play, Nov 21 2026</div>
    </>
  );
};

/** a soft contact shadow lying on the floor */
const PossessionAtRimShadow: React.FC<{ pr: PossessionAtRimProj; x: number; z: number; r: number; a: number }> = ({ pr, x, z, r, a }) => {
  const pts: string[] = [];
  for (let i = 0; i < 24; i++) {
    const t = (i / 24) * Math.PI * 2;
    const q = pr.P([x + r * Math.cos(t), 0, z + r * Math.sin(t)]);
    pts.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`);
  }
  return <polygon points={pts.join(" ")} fill="#1A0F05" opacity={a} filter="url(#par-soft)" />;
};

const PossessionAtRimFloorRing: React.FC<{ pr: PossessionAtRimProj; r: number; a: number }> = ({ pr, r, a }) => {
  const d: string[] = [];
  for (let i = 0; i <= 36; i++) {
    const t = (i / 36) * Math.PI * 2;
    const q = pr.P([PAR.spot[0] + r * Math.cos(t), 0.01, PAR.spot[2] + r * Math.sin(t)]);
    d.push(`${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`);
  }
  return <path d={d.join("")} stroke="#FFE7B0" strokeWidth={3} fill="none" opacity={a} />;
};

/** the chance: a flat gold disc on his spot, a thin darker rim, its top catching the arena light */
const PossessionAtRimDisc: React.FC<{ pr: PossessionAtRimProj; y: number; opacity: number }> = ({ pr, y, opacity }) => {
  const [sx, , sz] = PAR.spot;
  const ring = (yy: number, r: number) => {
    const out: { x: number; y: number }[] = [];
    for (let i = 0; i < 40; i++) {
      const t = (i / 40) * Math.PI * 2;
      out.push(pr.P([sx + r * Math.cos(t), yy, sz + r * Math.sin(t)]));
    }
    return out;
  };
  const top = ring(y + PAR.discH, PAR.discR);
  const bot = ring(y, PAR.discR);
  // the side band: the half of the rim facing the camera (z above the centre: angles 0..pi)
  const side = [...bot.slice(0, 21), ...top.slice(0, 21).reverse()];
  const s = (pts: { x: number; y: number }[]) => pts.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(" ");
  const c = pr.P([sx, y + PAR.discH, sz]);
  const hl = pr.P([sx - PAR.discR * 0.35, y + PAR.discH, sz - PAR.discR * 0.3]);
  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id="par-disc" gradientUnits="userSpaceOnUse" cx={hl.x} cy={hl.y} r={Math.max(40, (top[0].x - top[20].x) * 0.75)}>
          <stop offset="0" stopColor="#FFD883" />
          <stop offset="0.6" stopColor={PAR.gold} />
          <stop offset="1" stopColor="#D99A2B" />
        </radialGradient>
      </defs>
      <ellipse cx={c.x} cy={c.y} rx={(top[0].x - top[20].x) * 0.9} ry={Math.abs(top[10].y - top[30].y) * 0.9} fill={PAR.gold} opacity={0.22} filter="url(#par-soft)" />
      <polygon points={s(bot)} fill={PAR.goldSide} />
      <polygon points={s(side)} fill={PAR.goldSide} />
      <polygon points={s(top)} fill="url(#par-disc)" stroke="#C88A26" strokeWidth={2} />
    </g>
  );
};
