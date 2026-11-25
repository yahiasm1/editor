// The rule played on the reel's one Lakers half court (PictureCourtWorld: feet, rim at the origin), seen from high
// above the top of the key, the rim at the top: the maple, the gold lane, the 3D basket and net, and four people.
// The ball handler (a Lakers guard, plain jersey) on the left wing; Shaq (the same real cut-out, 2000 Finals,
// Bigmoe797) on the weak-side block, far from the ball; a Sonics-green defender grabbing his arm (foul red at the
// grip); the off-ball zone in foul red on the boards; the hairline from the ball to Shaq with its distance. Then the
// guard walks to the line, one free throw drops, +1, and the ball goes to the sideline at the free throw line
// extended (Rule 12B, Section X a(2)).
import React from "react";
import { Img, staticFile } from "remotion";
import { PC_FT_Y, pcArc, pcPoly, type PcProj } from "./PictureCourtWorld";
import { PictureCourtBasket, PictureCourtFloor } from "./PictureCourtFloor";
import {
  RULEBOOKAWAYFOUL_LAKERS, RULEBOOKAWAYFOUL_SONICS, RulebookAwayFoulPlayer, type RulebookAwayFoulPose,
} from "./RulebookAwayFoulPlayer";

const SHAQ = staticFile("shaq-free-throws/rulebookawayfoul-shaq.png");
const BALL = staticFile("shaq-free-throws/rulebookawayfoul-ball.png");
const IMG_W = 719, IMG_H = 2327, FEET_X = 430;
/** his left forearm in the cut-out's pixels, where the defender's hand closes */
const GRIP_PX: [number, number] = [520, 905];
const RED = "#E5383B";
const GREY = "#8B949E";

export const RBAF_SHAQ: [number, number] = [-5.2, 4.4];
export const RBAF_DEF: [number, number] = [-8.0, 3.3];
export const RBAF_GUARD: [number, number] = [15.0, 12.0];
export const RBAF_LINE: [number, number] = [0.3, PC_FT_Y + 1.0];
export const RBAF_SIDE: [number, number] = [-25.9, PC_FT_Y + 0.08];

export type RulebookAwayFoulCourtState = {
  f: number;
  /** guard's feet (world ft) and pose */
  guard: [number, number];
  guardPose: RulebookAwayFoulPose;
  /** the ball (world ft, z up), its diameter is 0.78 ft */
  ball: [number, number, number];
  ballSpin: number;
  /** 0..1 the defender's hand closed on the arm; pulse 0..1 a yank */
  grip: number;
  yank: number;
  /** foul red at the grip: -1 none, else frames since the clamp */
  hit: number;
  /** 0..1 the off-ball zone opens; fades with `zoneOff` */
  zone: number;
  zoneOff: number;
  /** 0..1 the hairline from the ball to Shaq is drawn; dist the number on it */
  hair: number;
  dist: number;
  /** net kick 0..1 and the +1 (0..1 pop, -1 hidden) */
  net: number;
  plus: number;
  /** 0..1 the "Lakers ball" label */
  label: number;
  /** Shaq jolt px */
  jolt: [number, number];
  credit: number;
};

export const RulebookAwayFoulCourt: React.FC<{ P: PcProj; st: RulebookAwayFoulCourtState }> = ({ P, st }) => {
  const { f } = st;
  // Shaq, the cut-out, standing on our boards
  const feet = P.p(RBAF_SHAQ[0], RBAF_SHAQ[1], 0);
  const head = P.p(RBAF_SHAQ[0], RBAF_SHAQ[1], 7.1);
  const sh = Math.max(feet.y - head.y, 0.86 * feet.s * 7.1);
  const k = sh / IMG_H;
  const shaqL = feet.x - FEET_X * k + st.jolt[0];
  const shaqT = feet.y - sh + st.jolt[1];
  const grip: [number, number] = [shaqL + GRIP_PX[0] * k, shaqT + GRIP_PX[1] * k];

  // the defender: feet, his shoulder, and his arm reaching to the grip
  const dF = P.p(RBAF_DEF[0], RBAF_DEF[1], 0);
  const dS = 0.86 * dF.s;
  const dPose: RulebookAwayFoulPose = { walk: -1, armL: 18, armR: 25, bendL: 10, bendR: 20, lean: -4 - 3 * st.yank };
  const dShoulder: [number, number] = [dF.x - 0.62 * dS, dF.y - 5.1 * dS];
  const reach = st.grip;
  const hx = dShoulder[0] + (grip[0] - dShoulder[0]) * (0.25 + 0.75 * reach) + 10 * st.yank;
  const hy = dShoulder[1] + (grip[1] - dShoulder[1]) * (0.25 + 0.75 * reach);
  const elbow: [number, number] = [(dShoulder[0] + hx) / 2 + 4, (dShoulder[1] + hy) / 2 + 12];

  // the guard
  const gF = P.p(st.guard[0], st.guard[1], 0);
  const gS = 0.86 * gF.s;
  // the ball
  const b = P.p(st.ball[0], st.ball[1], st.ball[2]);
  const bShadow = P.p(st.ball[0], st.ball[1], 0);
  const bD = Math.max(8, 0.78 * b.s * 1.1);
  // ball behind the guard's body when he holds it overhead from behind? he faces the rim, so it is in front of him
  const ballFar = st.ball[1] < st.guard[1] - 0.2;

  // the off-ball zone round the grab, on the boards
  const zc: [number, number] = [RBAF_SHAQ[0] * 0.65 + RBAF_DEF[0] * 0.35, RBAF_SHAQ[1] * 0.65 + RBAF_DEF[1] * 0.35];
  const zr = 5.6 * (0.3 + 0.7 * st.zone);
  const zoneA = st.zone * (1 - st.zoneOff);
  const ring = pcPoly(P, pcArc(zc[0], zc[1], zr, 0, Math.PI * 2, 64));
  const ringIn = pcPoly(P, pcArc(zc[0], zc[1], zr * 0.985, 0, Math.PI * 2, 64));

  // the hairline on the boards, ball to Shaq
  const hA = P.p(st.guard[0] - 0.9, st.guard[1] + 0.1, 0);
  const hB = P.p(RBAF_SHAQ[0] + 0.9, RBAF_SHAQ[1] + 0.6, 0);
  const hEnd: [number, number] = [hA.x + (hB.x - hA.x) * st.hair, hA.y + (hB.y - hA.y) * st.hair];
  const ang = Math.atan2(hB.y - hA.y, hB.x - hA.x);
  const mid: [number, number] = [(hA.x + hB.x) / 2, (hA.y + hB.y) / 2];

  // the rim on screen for the +1
  const rim = P.p(0, 0, 10);
  const side = P.p(RBAF_SIDE[0], RBAF_SIDE[1], 0);
  const hitPop = st.hit >= 0 ? 1 + 0.5 * Math.exp(-st.hit / 7) : 1;

  const ballImg = (key: string) => (
    <div key={key} style={{ position: "absolute", left: b.x - bD / 2, top: b.y - bD / 2, width: bD, height: bD, transform: `rotate(${st.ballSpin.toFixed(1)}deg)` }}>
      <Img src={BALL} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.25), rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)" }} />
    </div>
  );

  return (
    <>
      <PictureCourtFloor P={P} f={f} wood={1} paint={1} dim={0} lineLit={0} />
      {/* the off-ball zone */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="rbaf-zglow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={14} /></filter>
        </defs>
        {zoneA > 0.01 && (
          <g opacity={zoneA}>
            <path d={ring} fill={RED} opacity={0.2} />
            <path d={ring} fill="none" stroke={RED} strokeWidth={10} opacity={0.45} filter="url(#rbaf-zglow)" />
            <path d={ringIn} fill="none" stroke={RED} strokeWidth={3.5} />
          </g>
        )}
        {/* the ball's shadow on the boards */}
        <ellipse cx={bShadow.x} cy={bShadow.y} rx={bD * 0.55} ry={bD * 0.2} fill="#000" opacity={0.3 * Math.max(0.2, 1 - st.ball[2] / 14)} />
      </svg>
      <PictureCourtBasket P={P} f={f} op={1} sway={st.net} dim={0} />
      {/* behind Shaq: the defender */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <RulebookAwayFoulPlayer id="def" x={dF.x} y={dF.y} s={dS} h={6.9} kit={RULEBOOKAWAYFOUL_SONICS} pose={dPose} facing="front" />
      </svg>
      {/* Shaq */}
      <div style={{ position: "absolute", left: shaqL + 0.18 * sh, top: feet.y - 0.05 * sh, width: 0.3 * sh, height: 0.07 * sh, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.5), rgba(0,0,0,0) 70%)" }} />
      <Img src={SHAQ} style={{ position: "absolute", left: shaqL, top: shaqT, width: IMG_W * k, height: IMG_H * k }} />
      {/* the grab: the defender's arm across, his hand closed on Shaq's forearm */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <radialGradient id="rbaf-grip">
            <stop offset="0" stopColor={RED} stopOpacity={0.85} />
            <stop offset="1" stopColor={RED} stopOpacity={0} />
          </radialGradient>
        </defs>
        {reach > 0.01 && (
          <g>
            <path d={`M ${dShoulder[0]} ${dShoulder[1]} L ${elbow[0]} ${elbow[1]}`} stroke="#6E4630" strokeWidth={dS * 0.3} strokeLinecap="round" />
            <path d={`M ${elbow[0]} ${elbow[1]} L ${hx} ${hy}`} stroke="#6E4630" strokeWidth={dS * 0.24} strokeLinecap="round" />
            <path d={`M ${elbow[0]} ${elbow[1] + dS * 0.06} L ${hx} ${hy + dS * 0.05}`} stroke="#45291A" strokeWidth={dS * 0.08} strokeLinecap="round" />
            {/* the hand: palm and four fingers wrapped round the forearm */}
            <ellipse cx={hx} cy={hy} rx={dS * 0.2} ry={dS * 0.17} fill="#7A4E36" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={hx - dS * 0.26} y={hy - dS * 0.16 + i * dS * 0.085} width={dS * 0.2 * (0.6 + 0.4 * reach)} height={dS * 0.07} rx={dS * 0.035} fill={i % 2 ? "#6E4630" : "#7A4E36"} />
            ))}
          </g>
        )}
        {st.hit >= 0 && (
          <g transform={`translate(${grip[0].toFixed(1)} ${grip[1].toFixed(1)}) scale(${hitPop.toFixed(3)})`}>
            <circle r={dS * 1.5} fill="url(#rbaf-grip)" opacity={0.75 + 0.25 * st.yank} />
            {[0, 1, 2].map((i) => (
              <ellipse key={i} cx={-dS * 0.08} cy={-dS * 0.14 + i * dS * 0.14} rx={dS * 0.22} ry={dS * 0.055} fill={RED} opacity={0.95} />
            ))}
            {st.hit < 24 && <circle r={dS * (0.4 + st.hit * 0.1)} fill="none" stroke={RED} strokeWidth={4} opacity={1 - st.hit / 24} />}
          </g>
        )}
      </svg>
      {/* the hairline, ball to Shaq, and its distance */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {st.hair > 0.01 && (
          <g>
            <line x1={hA.x} y1={hA.y} x2={hEnd[0]} y2={hEnd[1]} stroke="#E6EDF3" strokeOpacity={0.85} strokeWidth={2.5} />
            {[hA, { x: hEnd[0], y: hEnd[1] }].map((q, i) => (
              <line key={i} x1={q.x - Math.sin(ang) * 12} y1={q.y + Math.cos(ang) * 12} x2={q.x + Math.sin(ang) * 12} y2={q.y - Math.cos(ang) * 12} stroke="#E6EDF3" strokeOpacity={0.85} strokeWidth={2.5} />
            ))}
          </g>
        )}
      </svg>
      {st.hair > 0.2 && (
        <div
          style={{
            position: "absolute",
            left: mid[0] - 90,
            top: mid[1] - 62,
            width: 180,
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: 40,
            color: "#FFFFFF",
            textShadow: "0 2px 10px rgba(0,0,0,0.75)",
            transform: `rotate(${((ang * 180) / Math.PI).toFixed(1)}deg)`,
            fontVariantNumeric: "tabular-nums",
            opacity: Math.min(1, (st.hair - 0.2) * 4),
          }}
        >
          {Math.round(st.dist)} ft
        </div>
      )}
      {/* the guard, with the ball in front of or behind him */}
      {ballFar && ballImg("far")}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <RulebookAwayFoulPlayer id="guard" x={gF.x} y={gF.y} s={gS} h={6.3} kit={RULEBOOKAWAYFOUL_LAKERS} pose={st.guardPose} facing="back" />
      </svg>
      {!ballFar && ballImg("near")}
      {/* +1 over the rim */}
      {st.plus >= 0 && (
        <div
          style={{
            position: "absolute",
            left: rim.x + 30,
            top: rim.y - 30 - 20 * st.plus,
            width: 240,
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: 96,
            color: "#FFFFFF",
            textShadow: "0 6px 24px rgba(0,0,0,0.6)",
            transform: `scale(${(0.6 + 0.4 * Math.min(1, st.plus * 1.2) + 0.12 * Math.sin(Math.min(1, st.plus) * Math.PI)).toFixed(3)})`,
            opacity: Math.min(1, st.plus * 3),
          }}
        >
          +1
        </div>
      )}
      {/* Lakers ball, at the sideline */}
      {st.label > 0.01 && (
        <>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            {/* the ball lands at the spot: a white ring runs out on the boards */}
            {st.label < 1 && <ellipse cx={side.x} cy={side.y} rx={14 + 60 * st.label} ry={(14 + 60 * st.label) * 0.55} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={1 - st.label} />}
            <ellipse cx={side.x} cy={side.y} rx={22} ry={12} fill="none" stroke="#FFFFFF" strokeWidth={2.5} opacity={0.8 * st.label} />
            <line x1={side.x - 10} y1={side.y - 22} x2={side.x - 10 - 110 * st.label} y2={side.y - 120 * st.label} stroke="#E6EDF3" strokeWidth={2.5} />
          </svg>
          <div style={{ position: "absolute", left: side.x - 380, top: side.y - 172, width: 260, textAlign: "right", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 40, color: "#FFFFFF", textShadow: "0 2px 10px rgba(0,0,0,0.75)", opacity: st.label }}>
            Lakers ball
          </div>
        </>
      )}
      <div style={{ position: "absolute", left: 40, top: 1474, fontFamily: "Inter, sans-serif", fontSize: 20, color: "#C9D1D9", textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.7)", opacity: st.credit }}>Bigmoe797, CC BY-SA 4.0</div>
    </>
  );
};
