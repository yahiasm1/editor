// picture, dark, 23.86-32.82 s: "So picture it. Shaq catches the ball under the basket, and before he can even turn,
// somebody grabs him. Now he's standing alone at the line, fifteen feet out, the whole arena watching."
// One Lakers half court at Rule 1 geometry, one camera (PictureCourtWorld). So: the wall card falls flat and turns
// to maple. picture: the paint goes down line by line, the bowl rising around it. Shaq: the real Lakers cut-out (2000
// Finals, Bigmoe797) in the post. catches: a pass from the wing slaps into his hands. basket: the camera tightens, the
// ring above him. turn: he starts the pivot and freezes. grabs: a defender's hand clamps his forearm, foul red blooms,
// the frame jolts. him: the referee's fist. Now: the camera swings behind the line as he walks to it. alone: all but
// the line dims. line: the paint lights under his toes. fifteen: a measure runs 15 ft to the board. whole: the bowl
// rises behind the glass. arena: the house goes dark, one spotlight. watching: camera flashes, a slow push in.
// keep = true: `clank` starts on PICTURE_COURT_END_CAM with Shaq at PICTURE_COURT_LINE_SPOT.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { arrive, countTo, ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import {
  PC_BOARD_Y, PC_CAM_CARD, PC_CAM_HALF, PC_CAM_LINE, PC_CAM_POST, PC_CAM_PUSH, PC_FT_Y, PC_SHAQ_FT,
  PICTURE_COURT_END_CAM, PICTURE_COURT_LINE_SPOT, PICTURE_COURT_POST_SPOT,
  pcArc, pcBand, pcCut, pcPoly, pcLerp as lerp, pcMixCam, pcProjector, pcRnd, type PcCam,
} from "./PictureCourtWorld";
import { PictureCourtBasket, PictureCourtFloor } from "./PictureCourtFloor";
import { PictureCourtArena } from "./PictureCourtArena";
import { PictureCourtGrab, PICTURE_COURT_GRAB_ANGLE, PICTURE_COURT_GRAB_AT } from "./PictureCourtGrab";
import { BackwardsScorebugArm } from "./BackwardsScorebugArm";

const SHAQ = staticFile("shaq-free-throws/picturecourt-shaq-lakers.png");
const BALL = staticFile("shaq-free-throws/picturecourt-ball.png");
const IMG_W = 719, IMG_H = 2327;
/** in the cut-out's pixels: the middle of his shoes, his left hand on the hip (where the ball sits) */
const FEET_X = 430, HAND: [number, number] = [612, 1150];
const BALL_PX = 250; // 9.4 in at the photo's ~330 px per foot
const FONT = "Inter, sans-serif";
const GREY = "#8B949E";
const BG = "#0D1117";

function usePictureCourtTimes() {
  const { cue, cueEnd, scene } = useScene();
  return {
    in: scene.from - LEAD,
    so: cue("So"),
    picture: cue("picture"),
    it: cue("it"),
    shaq: cue("Shaq"),
    catches: cue("catches"),
    ball: cue("ball"),
    under: cue("under"),
    basket: cue("basket"),
    and: cue("and"),
    turn: cue("turn"),
    turnEnd: cueEnd("turn"),
    somebody: cue("somebody"),
    grabs: cue("grabs"),
    him: cue("him"),
    now: cue("Now"),
    alone: cue("alone"),
    line: cue("line"),
    fifteen: cue("fifteen"),
    feet: cue("feet"),
    whole: cue("whole"),
    arena: cue("arena"),
    watching: cue("watching"),
    end: scene.to - LEAD,
  };
}
type T = ReturnType<typeof usePictureCourtTimes>;

/** the one camera, through its moves */
const PICTURE_COURT_CAM_CATCH: PcCam = { tx: 2.0, ty: 2.7, tz: 4.0, D: 11.5, yaw: 36 * Math.PI / 180, pitch: 15 * Math.PI / 180, F: 1150, cx: 540, cy: 1080 };
const PICTURE_COURT_CAM_PIVOT: PcCam = { ...PC_CAM_POST, D: 12.4, tz: 4.8, cy: 1040 };

function pictureCourtCam(t: T, f: number): PcCam {
  let c = pcMixCam(PC_CAM_CARD, PC_CAM_HALF, prog(f, t.in, t.it - t.in, ease.inOut));
  // the push into the post lands on "catches", so he is big when the ball slaps in
  c = pcMixCam(c, PC_CAM_PUSH, prog(f, t.it - 4, t.shaq - (t.it - 4), ease.in));
  c = pcMixCam(c, PICTURE_COURT_CAM_CATCH, prog(f, t.shaq - 4, t.catches + 2 - (t.shaq - 4), ease.out));
  // "under the basket": the camera eases back and up until the ring sits above him
  c = pcMixCam(c, PC_CAM_POST, prog(f, t.under - 2, t.basket + 8 - (t.under - 2), ease.inOut));
  // "and before he can even turn": a slow push on the pivot, a small hit when it freezes
  c = pcMixCam(c, PICTURE_COURT_CAM_PIVOT, prog(f, t.and, t.turn - t.and, ease.inOut));
  const hitF = f >= t.turn ? Math.exp(-(f - t.turn) / 6) : 0;
  c = { ...c, F: c.F * (1 + 0.035 * hitF) };
  // a slow drift while he is in the post, so the held picture keeps living
  c = { ...c, yaw: c.yaw + 0.04 * prog(f, t.basket, t.now - t.basket, ease.linear) };
  // the punch-in on the grab: down to his forearm (the HANDS scale)
  const [gx, gy] = PICTURE_COURT_POST_SPOT;
  const grabCam: PcCam = { tx: gx - 0.3, ty: gy + 0.2, tz: 4.4, D: 6.4, yaw: c.yaw + 0.06, pitch: 12 * Math.PI / 180, F: 1150, cx: 560, cy: 1060 };
  c = pcMixCam(c, grabCam, prog(f, t.somebody - 8, 18, ease.inOut));
  c = pcMixCam(c, PC_CAM_LINE, prog(f, t.now - 4, t.alone + 4 - (t.now - 4), ease.inOut));
  c = pcMixCam(c, PICTURE_COURT_END_CAM, prog(f, t.whole, t.end - t.whole, ease.inOut));
  return c;
}

/** where his feet are, in world feet */
function pictureCourtSpot(t: T, f: number): [number, number, number] {
  const w = prog(f, t.now, t.line - t.now, ease.inOut);
  const x = lerp(PICTURE_COURT_POST_SPOT[0], PICTURE_COURT_LINE_SPOT[0], w);
  const y = lerp(PICTURE_COURT_POST_SPOT[1], PICTURE_COURT_LINE_SPOT[1], w);
  // the walk: a stride bob while he moves
  const bob = w > 0 && w < 1 ? Math.abs(Math.sin(w * Math.PI * 6)) * 0.12 : 0;
  return [x, y, bob];
}

export const PictureCourt: React.FC & { keep?: boolean } = () => {
  const { f } = useScene();
  const t = usePictureCourtTimes();

  // the jolt when the hand clamps
  const jk = f >= t.grabs ? Math.exp(-(f - t.grabs) / 5) : 0;
  const jx = Math.sin((f - t.grabs) * 2.1) * 14 * jk, jy = Math.cos((f - t.grabs) * 2.7) * 9 * jk;

  const cam = pictureCourtCam(t, f);
  const P = pcProjector(cam);

  const wood = prog(f, t.so - 2, t.picture + 8 - (t.so - 2), ease.inOut);
  const paint = prog(f, t.picture - 10, 44, ease.out);
  const rise = 0.5 * prog(f, t.picture, 46, ease.out) + 0.5 * prog(f, t.whole - 6, 22, ease.out);
  const dim = prog(f, t.alone, 12, ease.out);
  const dark = prog(f, t.arena, 10, ease.out);
  const lineLit = prog(f, t.line, 8, ease.out) * (1 - 0.25 * prog(f, t.line + 8, 20));

  // Shaq, standing on our boards
  const [sx, sy, bob] = pictureCourtSpot(t, f);
  const feet = P.p(sx, sy, 0);
  const head = P.p(sx, sy, PC_SHAQ_FT);
  const h = Math.max(feet.y - head.y, 0.86 * feet.s * PC_SHAQ_FT);
  const k = h / IMG_H;
  const shaqIn = arrive(f, t.shaq - 4, 10);
  const shaqLeft = feet.x - FEET_X * k;
  const shaqTop = feet.y - h - bob * feet.s;
  // the pivot toward the rim: starts on "and", freezes half way on "turn"
  const pivAt = (g: number) => prog(g, t.and, t.turn - t.and, ease.inOut) * (1 - prog(g, t.now, 24, ease.inOut));
  const piv = pivAt(f);
  const pivFreeze = f >= t.turn && f < t.now ? Math.sin((f - t.turn) * 0.9) * 0.01 * Math.exp(-(f - t.turn) / 10) : 0;
  // his shoulders turn toward the rim (a squeeze across the back) and his weight leans onto the pivot foot
  const pivTf = (q: number) => `scaleX(${(1 - 0.15 * q).toFixed(4)}) rotate(${(-6 * q).toFixed(2)}deg)`;
  const sxScale = 1 - 0.15 * piv + pivFreeze;
  const lean = -6 * piv;
  // the motion smear while he turns: two ghosts a few frames behind
  const pivMoving = f > t.and && f < t.turn + 2;
  // the pivot arrow chalked on the boards around his feet, landing on "turn"
  const arrowT = prog(f, t.and + 4, t.turn - t.and - 4, ease.inOut);
  const arrowOp = prog(f, t.and, 8) * (1 - prog(f, t.somebody - 6, 10));

  // the pass from the right wing: in the air for 15 frames, slapping in on "catches"
  const handX = shaqLeft + HAND[0] * k, handY = shaqTop + HAND[1] * k;
  const passT = prog(f, t.catches - 15, 15, ease.linear);
  // thrown from off the right edge (the wing he faces), a chest pass with a little loft
  const ballOn = f >= t.catches - 15;
  const passAt = (q: number) => ({
    x: lerp(1160, handX, q),
    y: lerp(handY - 260, handY, q) - Math.sin(q * Math.PI) * 90,
    s: lerp(BALL_PX * k * 1.25, BALL_PX * k, q),
  });
  const bp = passAt(passT);
  const bx = passT < 1 ? bp.x : handX;
  const by = passT < 1 ? bp.y : handY;
  const bsz = passT < 1 ? bp.s : BALL_PX * k;
  const passGhosts = passT > 0 && passT < 1 ? [0.06, 0.12, 0.18, 0.24].map((d) => ({ ...passAt(Math.max(0, passT - d)), d })) : [];
  const slap = f >= t.catches ? Math.exp(-(f - t.catches) / 5) : 0;
  const ballSpin = (f - t.catches) * (passT < 1 ? 22 : 0) + (passT >= 1 ? -8 : 0);
  // the pass trail on the boards: the ball's shadow path, fading
  const trailOp = prog(f, t.catches - 15, 6) * (1 - prog(f, t.catches + 6, 30));
  const trail = pcBand(P, Array.from({ length: 16 }, (_, i) => {
    const q = i / 15;
    return [lerp(-17, sx - 0.4, q), lerp(12, sy + 0.1, q)] as [number, number];
  }), 0.12);

  // the grab and the call
  const reach = arrive(f, t.somebody - 4, 14) * (1 - prog(f, t.now, 14, ease.in));
  const clamp = prog(f, t.grabs - 2, 5, ease.outHard);
  const bloom = prog(f, t.grabs - 1, 7, ease.out) * (1 - prog(f, t.now, 14));
  const fistUp = arrive(f, t.him - 2, 10) * (1 - prog(f, t.now + 4, 12, ease.in));

  // the ring locks on "basket": the net kicks and the restricted arc glows
  const lock = f >= t.basket ? Math.exp(-(f - t.basket) / 12) : 0;
  const sway = 0.25 * lock * Math.sin((f - t.basket) * 0.5);

  // the measure: 15 ft from the line to the plane of the board
  const mT = prog(f, t.fifteen - 2, t.feet + 4 - (t.fifteen - 2), ease.inOut);
  const mOp = prog(f, t.fifteen - 4, 6) * (1 - 0.4 * prog(f, t.arena, 10));
  const MX = -3.4;
  const mTip = PC_FT_Y - 15 * mT;
  const measure = pcBand(P, [[MX, PC_FT_Y], [MX, mTip]], 0.14);
  let ticks = "";
  for (let i = 1; i <= 15; i++) if (PC_FT_Y - i <= PC_FT_Y && PC_FT_Y - i >= mTip - 0.01) ticks += pcBand(P, [[MX - (i % 5 ? 0.3 : 0.6), PC_FT_Y - i], [MX + (i % 5 ? 0.3 : 0.6), PC_FT_Y - i]], 0.07);
  const caps = pcBand(P, [[MX - 0.8, PC_FT_Y], [MX + 0.8, PC_FT_Y]], 0.09) + (mT > 0.99 ? pcBand(P, [[MX - 0.8, PC_BOARD_Y], [MX + 0.8, PC_BOARD_Y]], 0.09) : "");
  const ft = Math.round(countTo(f, t.fifteen - 2, t.feet + 4 - (t.fifteen - 2), 0, 15, ease.inOut));
  const tip = P.p(MX, lerp(PC_FT_Y, mTip, 0.5));

  // the spotlight: a hard cone dropping on him on "arena"
  const spot = prog(f, t.arena - 2, 9, ease.out);
  const coneTop = lerp(-200, 470, spot);
  const coneW = h * 0.36;
  const dust = Array.from({ length: 40 }, (_, i) => {
    const u = pcRnd(i, 31), v = (pcRnd(i, 32) + (f - t.arena) * (0.002 + pcRnd(i, 33) * 0.003)) % 1;
    const y = lerp(coneTop, feet.y, v);
    const half = lerp(coneW * 0.25, coneW * 1.15, (y - coneTop) / Math.max(1, feet.y - coneTop));
    return { x: feet.x + (u - 0.5) * 2 * half * 0.9, y, r: 1 + pcRnd(i, 34) * 2.2, a: 0.25 + pcRnd(i, 35) * 0.5 };
  });
  const lift = 1 + 0.12 * spot;

  const credit = shaqIn * 0.9 * (1 - fistUp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${jx.toFixed(1)}px, ${jy.toFixed(1)}px)` }}>
        <PictureCourtArena P={P} f={f} rise={rise} dark={Math.max(dark, 0.3 * dim)} flash={0} flashFrom={0} />
        <PictureCourtFloor P={P} f={f} wood={wood} paint={paint} dim={dim} lineLit={lineLit} />
        {/* the pass trail and the ring locking in */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {trailOp > 0 && <path d={trail} fill="#FFFFFF" opacity={0.45 * trailOp} />}
          {lock > 0.02 && (
            <path d={pcBand(P, Array.from({ length: 37 }, (_, i) => [4 * Math.cos((i / 36) * Math.PI), 4 * Math.sin((i / 36) * Math.PI)] as [number, number]), 0.35)} fill="#FFFFFF" opacity={0.5 * lock} />
          )}
          {/* the measure */}
          {mOp > 0 && (
            <g opacity={mOp}>
              <path d={measure} fill="#FFFFFF" />
              <path d={ticks} fill="#FFFFFF" opacity={0.85} />
              <path d={caps} fill="#FFFFFF" />
            </g>
          )}
        </svg>
        <PictureCourtBasket P={P} f={f} op={paint} sway={sway} dim={dim * 0.5} />
        {/* his contact shadow on the boards */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: shaqIn }}>
          <defs>
            <radialGradient id="pc-contact">
              <stop offset="0" stopColor="#000" stopOpacity={0.6} />
              <stop offset="1" stopColor="#000" stopOpacity={0} />
            </radialGradient>
          </defs>
          <ellipse cx={feet.x - 10 * k} cy={feet.y - 6 * k} rx={300 * k} ry={Math.max(10, 300 * k * 0.28)} fill="url(#pc-contact)" />
        </svg>
        {/* "arena": the house lights go out; only the spotlight pool and the free throw line stay lit */}
        {dark > 0.001 && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <filter id="pc-holes" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={18} /></filter>
              <mask id="pc-housemask" maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
                <rect x={0} y={0} width={1080} height={1920} fill="#fff" />
                <g filter="url(#pc-holes)">
                  <ellipse cx={feet.x} cy={feet.y} rx={coneW * 1.45} ry={coneW * 0.42} fill="#000" />
                  <path d={pcBand(P, [[-6.5, PC_FT_Y + 0.08], [6.5, PC_FT_Y + 0.08]], 0.9)} fill="#000" />
                  <path d={`M${feet.x - coneW * 0.22} ${coneTop} L${feet.x + coneW * 0.22} ${coneTop} L${feet.x + coneW * 1.2} ${feet.y} L${feet.x - coneW * 1.2} ${feet.y} Z`} fill="#000" opacity={0.7 * spot} />
                </g>
              </mask>
            </defs>
            <rect x={0} y={0} width={1080} height={1920} fill="#04060A" opacity={0.78 * dark} mask="url(#pc-housemask)" />
          </svg>
        )}
        <PictureCourtArena P={P} f={f} rise={rise} dark={dark} flash={prog(f, t.watching - 8, 6)} flashFrom={t.arena + 4} layer="flashes" />
        {/* the spotlight cone, behind him and on the boards */}
        {spot > 0 && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <linearGradient id="pc-cone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FFF7E6" stopOpacity={0.05} />
                <stop offset="1" stopColor="#FFF7E6" stopOpacity={0.2} />
              </linearGradient>
              <radialGradient id="pc-pool2">
                <stop offset="0" stopColor="#FFF4DC" stopOpacity={0.55} />
                <stop offset="0.7" stopColor="#FFF4DC" stopOpacity={0.18} />
                <stop offset="1" stopColor="#FFF4DC" stopOpacity={0} />
              </radialGradient>
              <filter id="pc-conesoft"><feGaussianBlur stdDeviation={6} /></filter>
            </defs>
            <path d={`M${feet.x - coneW * 0.22} ${coneTop} L${feet.x + coneW * 0.22} ${coneTop} L${feet.x + coneW * 1.2} ${feet.y} L${feet.x - coneW * 1.2} ${feet.y} Z`} fill="url(#pc-cone)" filter="url(#pc-conesoft)" opacity={spot} />
            <ellipse cx={feet.x} cy={feet.y} rx={coneW * 1.25} ry={coneW * 0.3} fill="url(#pc-pool2)" opacity={spot} />
          </svg>
        )}
        {/* the pivot: a chalk arrow around his feet, and the smear of the turn */}
        {arrowOp > 0.01 && arrowT > 0 && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d={pcBand(P, pcCut(pcArc(sx, sy, 1.9, 0.45 * Math.PI, 1.3 * Math.PI), arrowT), 0.22)} fill="#FFFFFF" opacity={0.85 * arrowOp} />
            {arrowT > 0.96 && (() => {
              const a = 1.3 * Math.PI, r = 1.9;
              const tipP: [number, number] = [sx + r * Math.cos(a), sy + r * Math.sin(a)];
              const tx = -Math.sin(a), ty = Math.cos(a);
              return <path d={pcPoly(P, [[tipP[0] + tx * 0.9, tipP[1] + ty * 0.9], [tipP[0] + Math.cos(a) * 0.55, tipP[1] + Math.sin(a) * 0.55], [tipP[0] - Math.cos(a) * 0.55, tipP[1] - Math.sin(a) * 0.55]])} fill="#FFFFFF" opacity={0.9 * arrowOp} />;
            })()}
          </svg>
        )}
        {pivMoving && [6, 3].map((lag, gi) => (
          <div key={gi} style={{ position: "absolute", left: shaqLeft, top: shaqTop, width: IMG_W * k, height: h, opacity: 0.18 + 0.1 * gi, transform: pivTf(pivAt(f - lag)), transformOrigin: `${FEET_X * k}px ${h}px`, filter: "blur(3px)" }}>
            <Img src={SHAQ} style={{ position: "absolute", left: 0, top: 0, width: IMG_W * k, height: h }} />
          </div>
        ))}
        {/* Shaq, the grab and the ball, in the cut-out's own pixels */}
        <div
          style={{
            position: "absolute", left: shaqLeft, top: shaqTop, width: IMG_W * k, height: h,
            opacity: shaqIn, filter: `blur(${((1 - shaqIn) * 10).toFixed(1)}px) brightness(${((1 - 0.12 * dim) * lift).toFixed(3)})`,
            transform: `scaleX(${sxScale.toFixed(4)}) rotate(${lean.toFixed(2)}deg)`, transformOrigin: `${FEET_X * k}px ${h}px`,
          }}
        >
          <Img src={SHAQ} style={{ position: "absolute", left: 0, top: 0, width: IMG_W * k, height: h }} />
          <svg width={IMG_W * k} height={h} viewBox={`0 0 ${IMG_W} ${IMG_H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {/* undo his pivot squeeze here: the defender is not turning */}
            <g transform={`translate(${PICTURE_COURT_GRAB_AT[0]} ${PICTURE_COURT_GRAB_AT[1]}) scale(${(1 / sxScale).toFixed(4)} 1) rotate(${PICTURE_COURT_GRAB_ANGLE}) scale(0.8)`}>
              <PictureCourtGrab f={f} reach={reach} clamp={clamp} bloom={bloom} hit={f >= t.grabs ? f - t.grabs : -1} />
            </g>
          </svg>
        </div>
        {passGhosts.length > 0 && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs><filter id="pc-passblur"><feGaussianBlur stdDeviation={6} /></filter></defs>
            <path d={`M${passGhosts[passGhosts.length - 1].x} ${passGhosts[passGhosts.length - 1].y} ${passGhosts.map((g) => `L${g.x} ${g.y}`).reverse().join(" ")} L${bx} ${by}`} stroke="#FFFFFF" strokeWidth={bsz * 0.5} strokeLinecap="round" fill="none" opacity={0.22} filter="url(#pc-passblur)" />
            {passGhosts.map((g, i) => <circle key={i} cx={g.x} cy={g.y} r={g.s * 0.45} fill="#D9622B" opacity={0.28 - g.d} filter="url(#pc-passblur)" />)}
          </svg>
        )}
        {ballOn && (
          <Img
            src={BALL}
            style={{
              position: "absolute", left: bx - bsz / 2, top: by - bsz / 2, width: bsz, height: bsz,
              transform: `rotate(${ballSpin.toFixed(1)}deg) scale(${(1 + 0.08 * slap).toFixed(3)})`,
              filter: `drop-shadow(0 ${(6 * k * 10).toFixed(1)}px ${(8 * k * 10).toFixed(1)}px rgba(0,0,0,0.5)) brightness(${((1 - 0.12 * dim) * lift).toFixed(3)})`,
            }}
          />
        )}
        {/* the referee's call: the closed fist straight up at the edge of frame */}
        {fistUp > 0.001 && (
          <div style={{ position: "absolute", left: -40, top: lerp(1950, 1150, fistUp), width: 400, height: 1000, transform: "scale(0.4) rotate(8deg)", transformOrigin: "0 0", filter: "brightness(0.8) saturate(1.1) contrast(1.05) blur(0.6px) drop-shadow(0 10px 14px rgba(0,0,0,0.55))" }}>
            <BackwardsScorebugArm f={f} />
          </div>
        )}
        {/* the spotlight's dust, in front of him */}
        {spot > 0 && (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            {dust.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#FFF8E8" opacity={d.a * spot} />)}
          </svg>
        )}
      </AbsoluteFill>
      {/* the measure's numbers */}
      {mOp > 0 && (
        <div style={{ position: "absolute", left: tip.x + 34, top: tip.y - 40, opacity: mOp, fontFamily: FONT, color: "#fff", whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1, fontVariantNumeric: "tabular-nums", textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>{ft} ft</div>
          <div style={{ fontSize: 32, color: "#C9D1D9", marginTop: 2, opacity: prog(f, t.feet, 10), textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>to the backboard</div>
          <div style={{ fontSize: 22, color: GREY, marginTop: 4, opacity: prog(f, t.feet + 4, 10) }}>NBA Rule 1</div>
        </div>
      )}
      {/* the top of the stage fades into the navy so the caption band stays clean */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 640, background: `linear-gradient(${BG} 0%, ${BG} 62%, rgba(13,17,23,0) 100%)` }} />
      {/* the cut-out's credit */}
      <div style={{ position: "absolute", left: 40, top: 1452, fontFamily: FONT, fontSize: 20, color: GREY, opacity: credit }}>Bigmoe797, CC BY-SA 4.0</div>
    </AbsoluteFill>
  );
};
PictureCourt.keep = true;
