// wilt-100 "ball": "And the ball? A 14 year old fan said he walked out with it, and it later sold at auction for
// 551,844 dollars."
// The 100 print from `photo` slides to the corner; the 1962 leather ball drops onto the arena's boards and bounces with
// weight; on "14" the amber witness edge lights round it and the fan's name hangs off a hairline. The camera pulls back
// out through the open right door of the main gate at night (redrawn from Cooper's photo, its later sign cropped off);
// on "walked" the ball comes out through the door at waist height with a walking bob and leaves frame right. The
// night pans away, a year dater rolls 1962 -> 2000, the same ball sits on a plinth in an auction room, the glass case
// settles over it on "auction", the dater stamps the lot card, the price rolls to $551,844 as paddles rise faster and
// faster, the gavel lands with the number, SOLD stamps on "dollars".
// Parts: Kit (times, maths, image), Ball (the sphere), Gate (floor inside, facade outside), Room (the auction).
import React from "react";
import { ease, useScene } from "../../../src/engine";
import { BTA_AMBER, BTA_BG, BTA_DIM, btaClamp, btaK, btaLerp, btaMul, btaRx, btaRy, btaRz, useBallT, useBtaImages, type BallT } from "./BallToAuctionKit";
import { BallToAuctionBall } from "./BallToAuctionBall";
import { BTA_AP, BTA_INNER_A, BTA_INNER_Y0, BTA_P0, BallToAuctionFacade, BallToAuctionFloor, btaInnerToWorld } from "./BallToAuctionGate";
import {
  BTA_BALL_IN_CASE,
  BTA_CARD,
  BallToAuctionBidders,
  BallToAuctionCaseBack,
  BallToAuctionCaseFront,
  BallToAuctionDater,
  BallToAuctionGavel,
  BallToAuctionInkDefs,
  BallToAuctionLotCard,
  BallToAuctionOdometer,
  BallToAuctionSold,
  BallToAuctionWall,
  type Bid,
} from "./BallToAuctionRoom";

const FULL = { position: "absolute" as const, inset: 0 };
const R0 = btaMul(btaRx(-0.42), btaMul(btaRz(0.32), btaRy(0.55)));
const FLOOR_Y = 1210;
const R_BALL = 205;
/** the auction room is drawn at 1080 wide and shown a little closer, centred on the case */
const ROOM_S = 1.18;
const ROOM_C = 1060;
const roomPt = (x: number, y: number) => ({ x: 540 + (x - 540) * ROOM_S, y: ROOM_C + (y - ROOM_C) * ROOM_S });

/** the ball in the floor's own frame: drop, two bounces, then rolling toward the doors */
function innerBall(f: number, T: BallT) {
  const restY = FLOOR_Y - R_BALL;
  const t0 = T.ball - 18;
  let cy = restY, sx = 1, sy = 1, spin = 0;
  const t = f - t0;
  if (t < 18) {
    const k = btaClamp(t / 18);
    cy = btaLerp(-320, restY, k * k);
  } else {
    const b1 = 26, b2 = 14;
    const u = t - 18;
    if (u < b1) cy = restY - 4 * 190 * (u / b1) * (1 - u / b1);
    else if (u < b1 + b2) cy = restY - 4 * 56 * ((u - b1) / b2) * (1 - (u - b1) / b2);
    // squash on each contact
    const hits = [0, b1, b1 + b2];
    for (const [i, h] of hits.entries()) {
      const d = u - h;
      if (d >= -1 && d < 6) {
        const amt = [0.1, 0.05, 0.02][i] * Math.sin((btaClamp((d + 1) / 7)) * Math.PI);
        sy = 1 - amt;
        sx = 1 + amt * 0.8;
        cy += R_BALL * amt;
      }
    }
  }
  spin = btaClamp((f - t0) / 70) * 0.9;
  // rolling toward the doors (toward us) while the camera pulls back
  const roll = btaK(f, T.year, T.walked - T.year, ease.inOut);
  const r = btaLerp(R_BALL, 236, roll);
  cy = cy + roll * 150 - (r - R_BALL);
  const cx = 540 + roll * 40;
  const R = btaMul(btaRx(roll * 1.6), btaMul(btaRz(spin), R0));
  return { cx, cy, r, sx, sy, R, contact: cy + r };
}

/** camera on the gate world: from inside (the floor filling the frame) to outside (the gate at Z = 1) */
function gateCam(f: number, T: BallT) {
  const k = btaK(f, T.year - 4, T.walked - 4 - (T.year - 4), ease.inOut);
  const Zs = 1 / BTA_INNER_A;
  const Z = Math.exp(Math.log(Zs) * (1 - k));
  const w = (Zs - Z) / (Zs - 1);
  const C0 = { x: (BTA_P0.x - BTA_AP.x) / BTA_INNER_A, y: (BTA_P0.y - BTA_AP.y) / BTA_INNER_A + BTA_INNER_Y0 };
  const C = { x: btaLerp(C0.x, BTA_P0.x, w), y: btaLerp(C0.y, BTA_P0.y, w) };
  const toScreen = (p: { x: number; y: number }) => ({ x: C.x + Z * (p.x - BTA_P0.x), y: C.y + Z * (p.y - BTA_P0.y) });
  return { k, Z, C, toScreen, tf: `translate(${C.x} ${C.y}) scale(${Z}) translate(${-BTA_P0.x} ${-BTA_P0.y})` };
}

/** the walk: out of the door at waist height, bobbing, toward us and off to the right */
function walkBall(f: number, T: BallT, start: { x: number; y: number; r: number }) {
  const a = T.walked - 2;
  const dur = T.it1End + 10 - a;
  const u = btaClamp((f - a) / dur);
  const lift = btaK(f, a, 10, ease.out);
  const waist = 1092;
  const bob = Math.abs(Math.sin(((f - a) / 13) * Math.PI)) * 12 * (0.4 + u);
  const r = btaLerp(start.r, 150, Math.pow(u, 1.3));
  const x = btaLerp(start.x, 700, u) + 640 * Math.pow(u, 2.4);
  const y = btaLerp(btaLerp(start.y, waist, lift), 1250, Math.pow(u, 1.2)) - bob * lift;
  const ground = btaLerp(1282, 1440, Math.pow(u, 1.2));
  return { x, y, r, u, ground, sway: Math.sin(((f - a) / 13) * Math.PI) * 0.12 };
}

function bidSchedule(T: BallT): Bid[] {
  const xs = [150, 990, 360, 900, 90, 700, 230, 1010, 380, 860, 140, 700];
  const nums = [112, 47, 208, 9, 153, 61, 230, 18, 95, 124, 141, 33];
  const out: Bid[] = [];
  let at = T.price + 2;
  let gap = 24;
  const last = T.priceEnd - 34;
  let i = 0;
  while (at < last && i < xs.length) {
    out.push({ at, x: xs[i], n: nums[i] });
    at += gap;
    gap = Math.max(7, gap * 0.8);
    i++;
  }
  // the winning paddle goes up last, in the open left of the plinth, and stays up
  out[out.length - 1] = { ...out[out.length - 1], x: 300, n: 76, win: true };
  return out;
}

export const BallToAuction: React.FC = () => {
  const { f, theme } = useScene();
  const T = useBallT();
  const img = useBtaImages();
  const font = theme.font.ui;
  if (!img) return <div style={{ ...FULL, background: BTA_BG }} />;

  const inK = btaK(f, T.born, 7, ease.out);
  // the pan from the night gate to the auction room, 2000
  const pk = btaK(f, T.and2 - 4, T.sold - 2 - (T.and2 - 4), ease.inOut);
  const pv = Math.abs(pk - btaK(f - 1, T.and2 - 4, T.sold - 2 - (T.and2 - 4), ease.inOut)) * 1080;
  const gx = -1080 * pk;
  const showGate = pk < 0.999;
  const showRoom = pk > 0.001;

  // the 100 print: from where `photo` left it to the corner
  const pp = btaK(f, T.born + 1, T.ball - 2 - (T.born + 1));
  const print = { cx: btaLerp(540, 168, pp), cy: btaLerp(960, 652, pp), s: btaLerp(1.38, 0.38, pp), rot: btaLerp(-2.5, -7, pp) };

  // the ball
  const cam = gateCam(f, T);
  const ib = innerBall(f, T);
  const ibW = btaInnerToWorld(ib.cx, ib.cy);
  const ibS = cam.toScreen(ibW);
  const ibR = ib.r * BTA_INNER_A * cam.Z;
  const walking = f >= T.walked - 2;
  const startW = { x: ibW.x, y: ibW.y, r: ib.r * BTA_INNER_A };
  const wb = walkBall(f, T, startW);
  const amber = btaK(f, T.n14 - 2, 10, ease.out);
  const label = btaK(f, T.n14 + 2, 9, ease.out) * (1 - btaK(f, T.fan, 10));
  const ballVisible = f >= T.ball - 18 && (!walking || wb.u < 1);

  // the room
  const caseDrop = (1 - btaK(f, T.auction - 14, 14, ease.in)) * 900;
  const thunk = f >= T.auction ? Math.exp(-(f - T.auction) / 5) * Math.sin((f - T.auction) * 1.4) * 4 : 0;
  const spot = 0.2 + 0.8 * btaK(f, T.auction - 1, 5, ease.out);
  const yearP = btaLerp(1962, 2000, btaK(f, T.later - 4, T.sold + 6 - (T.later - 4), ease.inOut));
  const yearV = (yearP - btaLerp(1962, 2000, btaK(f - 1, T.later - 4, T.sold + 6 - (T.later - 4), ease.inOut))) * 6;
  const daterIn = btaK(f, T.and2 + 4, 14, ease.out);
  const strikeAt = T.auction + 8;
  const daterDown = btaK(f, strikeAt - 8, 8, ease.in) * (1 - btaK(f, strikeAt + 6, 14, ease.inOut));
  const daterPress = f >= strikeAt && f < strikeAt + 6 ? Math.sin(((f - strikeAt) / 6) * Math.PI) : 0;
  const daterAway = btaK(f, strikeAt + 20, 14, ease.in);
  const inkAt = roomPt(BTA_CARD.x + BTA_CARD.w / 2, BTA_CARD.y + 96);
  const daterY = btaLerp(-260, 820, daterIn) + daterDown * (inkAt.y - 58 - 820) - daterAway * 1100;
  const daterX = btaLerp(250, inkAt.x, btaK(f, T.sold - 10, 20, ease.inOut));
  const stamped = f >= strikeAt ? 1 : 0;
  const PRICE = 551844;
  const landAt = T.priceEnd - 12;
  const pe = (fr: number) => btaK(fr, T.price, landAt - T.price, (t) => 1 - Math.pow(1 - t, 2.2));
  const price = Math.round(PRICE * pe(f) * 100) / 100;
  const priceV = PRICE * (pe(f) - pe(f - 1));
  const priceIn = btaK(f, T.forW - 4, 10, ease.out);
  const landed = f >= landAt;
  const landPulse = landed ? Math.exp(-(f - landAt) / 8) : 0;
  const gLift = btaK(f, T.priceEnd - 46, 24, ease.out) * (1 - btaK(f, landAt - 6, 6, ease.in));
  const hit = f >= landAt ? Math.exp(-(f - landAt) / 9) : 0;
  const bids = bidSchedule(T);
  const winAt = bids[bids.length - 1].at;
  const winAmber = btaK(f, winAt + 4, 8, ease.out);
  const sold = btaK(f, T.dollars - 2, 9, ease.out);
  // the price and the stamp go before the room slides up under the caption, so no second 551,844 crosses it
  const leave = 1 - btaK(f, T.to - 9, 7, ease.inOut);
  const push = 1 + 0.035 * btaK(f, T.auction, T.to - T.auction, ease.linear);
  const shake = thunk + (landed ? Math.exp(-(f - landAt) / 4) * Math.sin((f - landAt) * 1.9) * 5 : 0);

  return (
    <div style={{ ...FULL, overflow: "hidden" }}>
      <div style={{ ...FULL, background: BTA_BG, opacity: inK }} />
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={FULL}>
        <BallToAuctionInkDefs />
        <defs>
          <filter id="btaPan" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation={`${Math.min(24, pv * 0.25).toFixed(1)} 0`} />
          </filter>
          <filter id="btaShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={14} />
          </filter>
          <clipPath id="btaApClip">
            <rect x={BTA_AP.x} y={BTA_AP.y} width={BTA_AP.w} height={BTA_AP.h} />
          </clipPath>
        </defs>

        {/* THE GATE WORLD: the floor seen through the open door, the facade around it */}
        {showGate && (
          <g transform={`translate(${gx} 0)`} opacity={inK} filter={pv > 2 ? "url(#btaPan)" : undefined}>
            <g transform={cam.tf}>
              {/* the wall is there from the first frame of the pull-back, so the doorway's edges never show bare ground */}
              <BallToAuctionFacade glow={1} f={f} part="base" />
              <g clipPath="url(#btaApClip)">
                <g transform={`translate(${BTA_AP.x} ${BTA_AP.y}) scale(${BTA_INNER_A}) translate(0 ${-BTA_INNER_Y0})`}>
                  <BallToAuctionFloor lx={ib.cx} ly={ib.contact} />
                  {/* the ball's shadow on the boards, tight when it touches, wide and faint in the air */}
                  {f >= T.ball - 18 && !walking && (
                    <ellipse cx={ib.cx + 30} cy={FLOOR_Y + (ib.contact - (ib.cy + ib.r)) + (ib.r - R_BALL) * 0.6 + 6} rx={ib.r * btaLerp(1.05, 0.7, btaClamp((FLOOR_Y - ib.contact) / 300))} ry={ib.r * 0.2} fill="rgba(20,8,2,0.7)" opacity={btaLerp(0.9, 0.3, btaClamp((FLOOR_Y + ib.r - R_BALL - ib.contact) / 300))} filter="url(#btaShadow)" />
                  )}
                </g>
              </g>
              <g opacity={btaClamp(cam.k * 4)}>
                <BallToAuctionFacade glow={1} f={f} part="front" />
              </g>
            </g>
            {/* the source of the gate */}
            <text x={64} y={1428} fontFamily={font} fontSize={26} fill={BTA_DIM} opacity={btaK(f, T.fan, 12)}>
              Main gate, after a photo by Bruce C. Cooper, CC BY 3.0
            </text>
            {/* the walk shadow on the pavement */}
            {walking && wb.u < 1 && (
              <g>
                <ellipse cx={wb.x + 10} cy={wb.ground} rx={wb.r * 0.9} ry={wb.r * 0.16} fill="rgba(0,0,0,0.55)" filter="url(#btaShadow)" opacity={0.6} />
                {/* its amber edge caught in the wet concrete */}
                <ellipse cx={wb.x} cy={wb.ground + wb.r * 0.5} rx={wb.r * 0.5} ry={wb.r * 0.9} fill={BTA_AMBER} opacity={0.1 * amber} filter="url(#btaShadow)" />
              </g>
            )}
          </g>
        )}

        {/* the 100 print, sliding to the corner, leaving with the gate */}
        {showGate && (
          <g transform={`translate(${print.cx + gx} ${print.cy}) rotate(${print.rot}) scale(${print.s})`}>
            <rect x={-230 + 10} y={-291 + 16} width={460} height={582} fill="rgba(0,0,0,0.5)" filter="url(#btaShadow)" />
            <rect x={-230} y={-291} width={460} height={582} fill="#F6F4EE" />
            <image href={img.photo} x={-210} y={-271} width={420} height={542} preserveAspectRatio="xMidYMid slice" />
            <rect x={-230} y={-291} width={460} height={582} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={1.5} />
          </g>
        )}

        {/* the ball: in the frame, then out of the door */}
        {ballVisible && showGate && (
          <g transform={`translate(${gx} 0)`}>
            {!walking ? (
              <BallToAuctionBall id="btaB" cx={ibS.x} cy={ibS.y} r={ibR} R={ib.R} sx={ib.sx} sy={ib.sy} amber={amber} />
            ) : (
              <BallToAuctionBall id="btaB" cx={wb.x} cy={wb.y} r={wb.r} R={btaMul(btaRz(wb.sway), btaMul(btaRx(1.6), btaMul(btaRz(0.9), R0)))} amber={amber} />
            )}
          </g>
        )}

        {/* the fan's name, hung off the ball */}
        {label > 0.002 && !walking && (() => {
          const ax = ibS.x + ibR * 0.72, ay = ibS.y - ibR * 0.72;
          const tx = Math.min(ax + 80, 1080 - 64 - 310), ty = ay - 76;
          return (
          <g opacity={label}>
            <line x1={ax} y1={ay} x2={tx - 10} y2={ty + 6} stroke={BTA_AMBER} strokeWidth={2} />
            <circle cx={ax} cy={ay} r={5} fill={BTA_AMBER} />
            <text x={tx} y={ty} fontFamily={font} fontSize={40} fontWeight={700} fill="#E6EDF3">
              Kerry Ryman, 14
            </text>
            <text x={tx} y={ty + 40} fontFamily={font} fontSize={30} fill={BTA_DIM}>
              his story
            </text>
          </g>
          );
        })()}

        {/* THE AUCTION ROOM, 2000 */}
        {showRoom && (
          <g transform={`translate(${1080 * (1 - pk)} ${shake * 0.3})`} filter={pv > 2 ? "url(#btaPan)" : undefined}>
            <g transform={`translate(540 ${ROOM_C}) scale(${ROOM_S * push}) translate(-540 ${-ROOM_C})`}>
              <BallToAuctionWall spot={spot} f={f} />
              <BallToAuctionCaseBack drop={caseDrop} />
              <ellipse cx={BTA_BALL_IN_CASE.x} cy={BTA_BALL_IN_CASE.y + BTA_BALL_IN_CASE.r - 2} rx={60} ry={9} fill="rgba(0,0,0,0.5)" />
              <BallToAuctionBall id="btaB2" cx={BTA_BALL_IN_CASE.x} cy={BTA_BALL_IN_CASE.y} r={BTA_BALL_IN_CASE.r} R={btaMul(btaRx(1.6 + f * 0.0015), btaMul(btaRz(0.9), R0))} amber={1} light={0.6 + 0.4 * spot} />
              <BallToAuctionCaseFront drop={caseDrop} f={f} o={btaK(f, T.auction - 16, 4, ease.linear)} />
              <BallToAuctionLotCard o={1} stamped={stamped} font={font} />
              <BallToAuctionGavel lift={gLift} o={1} hit={hit} />
              <BallToAuctionBidders f={f} bids={bids} o={1} font={font} amber={winAmber} />
            </g>
            {/* the price board */}
            {priceIn > 0.001 && (
              <g transform={`translate(540 ${btaLerp(680, 650, priceIn)}) scale(${1 + landPulse * 0.06})`} opacity={priceIn * leave}>
                <BallToAuctionOdometer P={price} digits={6} size={128} font={font} color="#FFFFFF" vel={priceV} comma prefix="$" />
              </g>
            )}
            <g transform="translate(540 800)" opacity={leave}>
              <BallToAuctionSold k={sold} font={font} />
            </g>
          </g>
        )}

        {/* the year dater, over both worlds */}
        {f >= T.and2 + 4 && daterAway < 1 && (
          <g transform={`translate(${daterX} ${daterY})`}>
            <BallToAuctionDater year={yearP} vel={yearV} press={daterPress} font={font} />
          </g>
        )}
      </svg>
      {/* the caption's band and the foot of the frame: the picture runs behind both, dimmed */}
      <div style={{ ...FULL, height: 620, background: "linear-gradient(180deg, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.93) 66%, rgba(13,17,23,0.5) 84%, rgba(13,17,23,0) 100%)", opacity: inK }} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1440, height: 480, background: "linear-gradient(180deg, rgba(13,17,23,0) 0%, rgba(13,17,23,0.85) 40%, rgba(13,17,23,0.98) 75%)", opacity: inK }} />
    </div>
  );
};
