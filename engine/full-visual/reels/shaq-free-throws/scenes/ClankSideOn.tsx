// clank, dark: "Make one of two, and that's one point instead of an easy dunk."
// The same court and the same Shaq as `picture` (keep = true there: this starts on PICTURE_COURT_END_CAM, Shaq at
// PICTURE_COURT_LINE_SPOT, house dark, spotlight on). Make: the camera swings to the sideline, true scale (ring 10 ft,
// 18 in; ball 9.4 in; line 15 ft from the board), he dips and lets the first one go. one: swish, the net stretches, a
// white +1 above the ring. two: the second hits the front iron, a foul red X, the ring rattles, the ball bounces
// away. and that's: the make and the X gather into the score box. one point: the +1 drops into it. instead of an
// easy: a grey ghost of the real dunk photo (Keith Allison) rises under the ring. dunk: it slams, the breakaway rim
// bends and snaps back, a grey ball drops through, a grey +2 box pops beside the white +1.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import {
  PC_BOARD_Y, PC_FT_Y, PC_SHAQ_FT, PICTURE_COURT_END_CAM, PICTURE_COURT_LINE_SPOT,
  pcBand, pcLerp as lerp, pcMixCam, pcProjector, pcRnd, type PcCam, type PcProj,
} from "./PictureCourtWorld";
import { PictureCourtFloor } from "./PictureCourtFloor";
import { PictureCourtArena } from "./PictureCourtArena";
import { ClankSideOnBasketBack, ClankSideOnBasketFront, type ClankSideOnRim } from "./ClankSideOnBasket";

const SHAQ = staticFile("shaq-free-throws/picturecourt-shaq-lakers.png");
const BALL = staticFile("shaq-free-throws/picturecourt-ball.png");
const GHOST = staticFile("shaq-free-throws/clanksideon-dunk-ghost.png");
const IMG_W = 719, IMG_H = 2327;
const FEET_X = 430, HAND: [number, number] = [612, 1150];
/** the dunk photo (1662 x 2097): ~368 px per foot, the ring at y ~130, the middle of his two hands at x ~1223 */
const GH_W = 1662, GH_H = 2097, GH_PPF = 368, GH_RING: [number, number] = [1223, 130];
const BALL_FT = 9.4 / 12;
const FONT = "Inter, sans-serif";
const GREY = "#8B949E";
const BG = "#0D1117";
const RED = "#E5383B";
const deg = Math.PI / 180;

/** the sideline: the line at the left, the board at the right, everything at 55.8 px a foot */
const CLANK_SIDE_ON_CAM: PcCam = { tx: 0, ty: 6.8, tz: 6.2, D: 26, yaw: -90 * deg, pitch: 7 * deg, F: 1450, cx: 575, cy: 985 };

type V3 = [number, number, number];

function useClankSideOnTimes() {
  const { cue, scene } = useScene();
  const t = {
    in: scene.from - LEAD,
    make: cue("Make"),
    one: cue("one"),
    two: cue("two"),
    and: cue("and"),
    one2: cue("one", 2),
    point: cue("point"),
    instead: cue("instead"),
    easy: cue("easy"),
    dunk: cue("dunk"),
    end: scene.to,
  };
  // the make: lifted from his hip in 8 frames, then in the air until it drops through on "one"
  const rel1 = t.in + 8;
  const arr1 = t.one + 4;
  const T = Math.max(18, arr1 - rel1);
  // the miss: the same flight, hitting the front iron on "two"
  const arr2 = t.two + 1;
  const rel2 = arr2 - T;
  return { ...t, rel1, arr1, rel2, arr2, T };
}
type T = ReturnType<typeof useClankSideOnTimes>;

const REL: V3 = [0.9, 14.35, 9.2]; // his release: arms up, a little in front of his face
const SWISH: V3 = [0, -0.05, 10];
const FRONT_IRON: V3 = [0, 1.1, 10.25]; // the ball's centre as it meets the front of the ring

/** a shot in the air: constant speed along the floor, a parabola up and down (u = 0..1) */
const clankSideOnArc = (a: V3, b: V3, H: number, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u) + 4 * H * u * (1 - u)];

/** a ball after the ring: gravity (32 ft/s^2), bouncing on the boards with 0.55 of its speed back */
function clankSideOnFall(p0: V3, v: V3, sec: number): V3 {
  let [x, y, z] = p0;
  let [vx, vy, vz] = v;
  let left = sec;
  const r = BALL_FT / 2;
  for (let i = 0; i < 6 && left > 0; i++) {
    // time to the floor from here
    const a = -16, b = vz, c = z - r;
    const tf = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    if (tf >= left || !isFinite(tf)) {
      return [x + vx * left, y + vy * left, z + vz * left - 16 * left * left];
    }
    x += vx * tf; y += vy * tf; z = r;
    vz = -(vz - 32 * tf) * 0.55; vx *= 0.8; vy *= 0.8;
    left -= tf;
  }
  return [x + vx * left, y + vy * left, r];
}

/** where each ball is, in world feet, or null when it is in his hands (pre-release) */
function clankSideOnBall(t: T, f: number, which: 1 | 2): V3 | null {
  const rel = which === 1 ? t.rel1 : t.rel2;
  const arr = which === 1 ? t.arr1 : t.arr2;
  if (f < rel) return null;
  if (f <= arr) return clankSideOnArc(REL, which === 1 ? SWISH : FRONT_IRON, which === 1 ? 4.6 : 4.2, (f - rel) / t.T);
  const sec = (f - arr) / 60;
  if (which === 1) return clankSideOnFall(SWISH, [0, -0.6, -12], sec);
  // off the front iron: back toward the shooter and up
  return clankSideOnFall(FRONT_IRON, [-0.4, 7.2, 7.5], sec);
}

const toScreen = (P: PcProj, v: V3) => P.p(v[0], v[1], v[2]);

export const ClankSideOn: React.FC = () => {
  const { f } = useScene();
  const t = useClankSideOnTimes();

  // the camera: one swing to the sideline, then a slow push; a small jolt on the dunk
  let cam = pcMixCam(PICTURE_COURT_END_CAM, CLANK_SIDE_ON_CAM, prog(f, t.in, t.one - 2 - t.in, ease.inOut));
  const push = prog(f, t.one, t.end - t.one, ease.linear);
  cam = { ...cam, F: cam.F * (1 + 0.05 * push), tz: cam.tz + 0.5 * push, ty: cam.ty - 0.6 * push };
  const dj = f >= t.dunk ? Math.exp(-(f - t.dunk) / 6) : 0;
  const jy = Math.sin((f - t.dunk) * 2.2) * 10 * dj;
  const P = pcProjector(cam);

  // Shaq on the line, the same cut-out, a dip before each release and a rise into it
  const [sx, sy] = PICTURE_COURT_LINE_SPOT;
  const feet = P.p(sx, sy, 0);
  const head = P.p(sx, sy, PC_SHAQ_FT);
  const h = Math.max(feet.y - head.y, 0.86 * feet.s * PC_SHAQ_FT);
  const k = h / IMG_H;
  const dipOf = (rel: number) => {
    const d = prog(f, rel - 12, 7, ease.inOut) * (1 - prog(f, rel - 5, 6, ease.out));
    const up = prog(f, rel - 5, 6, ease.out) * (1 - prog(f, rel + 2, 12, ease.inOut));
    return { d, up };
  };
  const d1 = dipOf(t.rel1), d2 = dipOf(t.rel2);
  const dip = Math.max(d1.d, d2.d), up = Math.max(d1.up, d2.up);
  const scaleY = 1 - 0.035 * dip + 0.02 * up;
  const rise = (-0.25 * dip + 0.22 * up) * feet.s; // px upward
  const shaqLeft = feet.x - FEET_X * k;
  const shaqTop = feet.y - h * scaleY - rise;
  const hand = { x: shaqLeft + HAND[0] * k, y: shaqTop + HAND[1] * k * scaleY };
  const lift = 1.12;

  // the balls: in his hands, lifted, in the air, through or off the ring
  const relScr = toScreen(P, REL);
  const ballPx = (v: V3) => toScreen(P, v).s * BALL_FT;
  type B = { x: number; y: number; s: number; rot: number; op: number; grey?: boolean };
  const balls: B[] = [];
  const held = (rel: number, appear: number) => {
    if (f < appear || f >= rel) return null;
    const l = prog(f, rel - 9, 9, ease.inOut);
    const s = lerp(BALL_FT * feet.s * 0.98, ballPx(REL), l);
    return { x: lerp(hand.x, relScr.x, l), y: lerp(hand.y, relScr.y, l), s, rot: -8, op: prog(f, appear, 6) };
  };
  const h1 = held(t.rel1, t.in - 10);
  if (h1) balls.push(h1);
  const h2 = held(t.rel2, t.rel1 + 2);
  if (h2) balls.push(h2);
  const out = 1 - prog(f, t.and + 10, 14);
  for (const w of [1, 2] as const) {
    const v = clankSideOnBall(t, f, w);
    if (!v) continue;
    const q = toScreen(P, v);
    const rel = w === 1 ? t.rel1 : t.rel2;
    balls.push({ x: q.x, y: q.y, s: q.s * BALL_FT, rot: -14 * (f - rel), op: w === 1 ? out : 1 - prog(f, t.and + 26, 14) });
  }
  // the strobe: where each ball was, every 3 frames, like a long-exposure sports photo
  const strobe: B[] = [];
  const strobeOp = prog(f, t.rel1, 6) * (1 - prog(f, t.and, 14, ease.in));
  for (const w of [1, 2] as const) {
    const rel = w === 1 ? t.rel1 : t.rel2;
    const last = Math.min(f - 2, (w === 1 ? t.arr1 : t.arr2) + 16);
    for (let g = rel; g <= last; g += 3) {
      const v = clankSideOnBall(t, g, w);
      if (!v) continue;
      const q = toScreen(P, v);
      strobe.push({ x: q.x, y: q.y, s: q.s * BALL_FT, rot: -14 * (g - rel), op: 0.22 * strobeOp * (0.5 + 0.5 * (g - rel) / Math.max(1, last - rel)) });
    }
  }

  // the ring: a kick of the net on the swish, a rattle on the clank, the breakaway bend on the dunk
  const kick = f >= t.arr1 ? Math.exp(-(f - t.arr1) / 14) * (0.5 + 0.5 * Math.cos((f - t.arr1) * 0.45)) : 0;
  const ghostKick = f >= t.dunk + 2 ? Math.exp(-(f - t.dunk - 2) / 14) * (0.5 + 0.5 * Math.cos((f - t.dunk - 2) * 0.45)) : 0;
  const sway = (f >= t.arr1 ? Math.exp(-(f - t.arr1) / 20) : 0) + (f >= t.arr2 ? 0.6 * Math.exp(-(f - t.arr2) / 16) : 0);
  const shiver = f >= t.arr2 ? Math.exp(-(f - t.arr2) / 7) : 0;
  const bendIn = prog(f, t.dunk - 3, 4, ease.in);
  const bend = f < t.dunk + 1 ? bendIn : Math.max(-0.25, Math.exp(-(f - t.dunk - 1) / 7) * Math.cos((f - t.dunk - 1) * 0.42));
  const rim: ClankSideOnRim = { f, kick: Math.max(kick, ghostKick), sway, shiver, bend };

  // the ghost dunk: rises under the ring, slams, hangs, lets go
  const ghRise = prog(f, t.instead - 4, t.easy + 4 - (t.instead - 4), ease.out);
  const ghSlam = prog(f, t.dunk - 4, 5, ease.in);
  const ghFall = prog(f, t.dunk + 18, 30, ease.in);
  const handsZ = lerp(4.5, 10.7, ghRise) - 0.7 * ghSlam - 0.45 * Math.max(0, bend) * (1 - ghFall) - 0.8 * ghFall;
  const gq = P.p(0, 0.1, handsZ);
  const gk = gq.s / GH_PPF;
  const ghOp = 0.5 * prog(f, t.instead - 4, 12) * (1 - 0.35 * ghFall);
  // the ghost's ball: over the ring, through on the slam
  let ghBall: B | null = null;
  if (f >= t.easy && ghOp > 0) {
    const pre: V3 = [0, 0.2, lerp(10.4, 11.0, prog(f, t.easy, 10))];
    const v: V3 = f < t.dunk - 2 ? pre : f < t.dunk + 2 ? [0, 0.1, lerp(11.0, 9.6, prog(f, t.dunk - 2, 4, ease.in))] : clankSideOnFall([0, 0.1, 9.6], [0, -0.4, -14], (f - t.dunk - 2) / 60);
    const q = toScreen(P, v);
    ghBall = { x: q.x, y: q.y, s: q.s * BALL_FT, rot: (f - t.easy) * -3, op: ghOp * 1.4, grey: true };
  }

  // the marks and the score boxes
  const swishAt = toScreen(P, [0, 0, 10]);
  const ironAt = toScreen(P, [0, 0.75, 10.1]);
  const plusPop = prog(f, t.arr1, 9, ease.back);
  const box1 = { x: 290, y: 572, w: 230, h: 196 };
  const box2 = { x: 556, y: 572, w: 230, h: 196 };
  const boxIn = prog(f, t.and - 4, 12, ease.out);
  const gather = prog(f, t.and, 18, ease.inOut);
  const plusFly = prog(f, t.one2 - 6, t.point + 2 - (t.one2 - 6), ease.inOut);
  const plusLand = f >= t.point + 2 ? Math.exp(-(f - t.point - 2) / 5) : 0;
  const plusStart = { x: swishAt.x - 40, y: swishAt.y - 150 };
  const plusEnd = { x: box1.x + box1.w / 2, y: box1.y + 82 };
  const plus = { x: lerp(plusStart.x, plusEnd.x, plusFly), y: lerp(plusStart.y, plusEnd.y, plusFly) - Math.sin(plusFly * Math.PI) * 70, s: lerp(1, 0.86, plusFly) * (1 + 0.1 * plusLand) };
  const xPop = prog(f, t.arr2, 8, ease.back);
  const mk1 = { x: lerp(swishAt.x, box1.x + 86, gather), y: lerp(swishAt.y - 4, box1.y + 160, gather), r: lerp(26, 15, gather) };
  const mk2 = { x: lerp(ironAt.x - 8, box1.x + 144, gather), y: lerp(ironAt.y - 26, box1.y + 160, gather), r: lerp(34, 15, gather) };
  const marks = prog(f, t.arr1 + 4, 8) * (gather > 0 ? 1 : 1 - prog(f, t.arr1 + 22, 10)); // the make's ring shows briefly, then reappears in the box
  const box2In = prog(f, t.dunk + 1, 10, ease.back);

  // the spotlight still on him from `picture`
  const coneW = h * 0.36;
  const coneTop = 470;
  const dust = Array.from({ length: 40 }, (_, i) => {
    const u = pcRnd(i, 31), v = (pcRnd(i, 32) + (f - t.in + 120) * (0.002 + pcRnd(i, 33) * 0.003)) % 1;
    const y = lerp(coneTop, feet.y, v);
    const half = lerp(coneW * 0.25, coneW * 1.15, (y - coneTop) / Math.max(1, feet.y - coneTop));
    return { x: feet.x + (u - 0.5) * 2 * half * 0.9, y, r: 1 + pcRnd(i, 34) * 2.2, a: 0.25 + pcRnd(i, 35) * 0.5 };
  });

  // the 15 ft measure left on the boards by `picture`: it stays, faint, as the floor's scale; its words leave
  const MX = -3.4;
  const measure = pcBand(P, [[MX, PC_FT_Y], [MX, PC_FT_Y - 15]], 0.14);
  let ticks = "";
  for (let i = 1; i <= 15; i++) ticks += pcBand(P, [[MX - (i % 5 ? 0.3 : 0.6), PC_FT_Y - i], [MX + (i % 5 ? 0.3 : 0.6), PC_FT_Y - i]], 0.07);
  const caps = pcBand(P, [[MX - 0.8, PC_FT_Y], [MX + 0.8, PC_FT_Y]], 0.09) + pcBand(P, [[MX - 0.8, PC_BOARD_Y], [MX + 0.8, PC_BOARD_Y]], 0.09);
  const mOp = 0.6 - 0.35 * prog(f, t.in, 20);
  const words = 1 - prog(f, t.in, 10, ease.in);
  const tip = P.p(MX, PC_FT_Y - 7.5);

  const ballImg = (b: B, i: number | string) => (
    <Img
      key={i}
      src={BALL}
      style={{
        position: "absolute", left: b.x - b.s / 2, top: b.y - b.s / 2, width: b.s, height: b.s, opacity: b.op,
        transform: `rotate(${b.rot.toFixed(1)}deg)`,
        filter: b.grey ? "grayscale(1) brightness(1.25)" : "drop-shadow(0 3px 5px rgba(0,0,0,0.5))",
      }}
    />
  );
  const card = (x: number, y: number, w: number, hh: number, label: string, grey: boolean, sc: number, op: number) => (
    <div
      style={{
        position: "absolute", left: x, top: y, width: w, height: hh, borderRadius: 28, background: grey ? "rgba(22,27,34,0.7)" : "#161B22",
        border: "1px solid #30363D", opacity: op, transform: `scale(${sc.toFixed(3)})`, transformOrigin: "50% 50%",
        boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, top: 18, textAlign: "center", fontFamily: FONT, fontSize: 24, fontWeight: 600, letterSpacing: 2, color: GREY }}>{label}</div>
    </div>
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${jy.toFixed(1)}px)` }}>
        <PictureCourtArena P={P} f={f} rise={1} dark={1} flash={1} flashFrom={t.arr1 - 4} />
        <PictureCourtFloor P={P} f={f} wood={1} paint={1} dim={1} lineLit={0.75} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: mOp }}>
          <path d={measure} fill="#FFFFFF" />
          <path d={ticks} fill="#FFFFFF" opacity={0.85} />
          <path d={caps} fill="#FFFFFF" />
        </svg>
        <ClankSideOnBasketBack P={P} rim={rim} dim={0.5} />
        {/* his contact shadow and the spotlight cone */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <radialGradient id="cso-contact">
              <stop offset="0" stopColor="#000" stopOpacity={0.6} />
              <stop offset="1" stopColor="#000" stopOpacity={0} />
            </radialGradient>
            <linearGradient id="cso-cone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFF7E6" stopOpacity={0.05} />
              <stop offset="1" stopColor="#FFF7E6" stopOpacity={0.2} />
            </linearGradient>
            <radialGradient id="cso-pool">
              <stop offset="0" stopColor="#FFF4DC" stopOpacity={0.55} />
              <stop offset="0.7" stopColor="#FFF4DC" stopOpacity={0.18} />
              <stop offset="1" stopColor="#FFF4DC" stopOpacity={0} />
            </radialGradient>
            <filter id="cso-conesoft"><feGaussianBlur stdDeviation={6} /></filter>
          </defs>
          <ellipse cx={feet.x - 10 * k} cy={feet.y - 6 * k} rx={300 * k} ry={Math.max(10, 300 * k * 0.28)} fill="url(#cso-contact)" />
          <path d={`M${feet.x - coneW * 0.22} ${coneTop} L${feet.x + coneW * 0.22} ${coneTop} L${feet.x + coneW * 1.2} ${feet.y} L${feet.x - coneW * 1.2} ${feet.y} Z`} fill="url(#cso-cone)" filter="url(#cso-conesoft)" />
          <ellipse cx={feet.x} cy={feet.y} rx={coneW * 1.25} ry={coneW * 0.3} fill="url(#cso-pool)" />
        </svg>
        {/* Shaq, the same pixels as every other return to the line */}
        <Img
          src={SHAQ}
          style={{
            position: "absolute", left: shaqLeft, top: shaqTop, width: IMG_W * k, height: h * scaleY,
            filter: `brightness(${(0.88 * lift).toFixed(3)})`,
          }}
        />
        {/* the ghost of the dunk, under the ring */}
        {ghOp > 0.001 && (
          <Img
            src={GHOST}
            style={{
              position: "absolute", left: gq.x - GH_RING[0] * gk, top: gq.y - GH_RING[1] * gk, width: GH_W * gk, height: GH_H * gk,
              opacity: ghOp, filter: `blur(${((1 - prog(f, t.instead - 4, 10)) * 8).toFixed(1)}px)`,
            }}
          />
        )}
        {strobe.map((b, i) => ballImg(b, `s${i}`))}
        {balls.map((b, i) => ballImg(b, `b${i}`))}
        {ghBall && ballImg(ghBall, "g")}
        <ClankSideOnBasketFront P={P} rim={rim} dim={0.5} />
        {/* the spotlight's dust, in front of him */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {dust.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#FFF8E8" opacity={d.a} />)}
        </svg>
      </AbsoluteFill>
      {/* the measure's words from `picture`, leaving */}
      {words > 0 && (
        <div style={{ position: "absolute", left: tip.x + 34, top: tip.y - 40, opacity: 0.6 * words, fontFamily: FONT, color: "#fff", whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1, textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>15 ft</div>
          <div style={{ fontSize: 32, color: "#C9D1D9", marginTop: 2, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>to the backboard</div>
          <div style={{ fontSize: 22, color: GREY, marginTop: 4 }}>NBA Rule 1</div>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 640, background: `linear-gradient(${BG} 0%, ${BG} 62%, rgba(13,17,23,0) 100%)` }} />
      {/* the score boxes: what the line paid, and (in grey) what the dunk would have */}
      {boxIn > 0 && card(box1.x, box1.y, box1.w, box1.h, "AT THE LINE", false, 0.9 + 0.1 * boxIn, boxIn)}
      {box2In > 0 && card(box2.x, box2.y, box2.w, box2.h, "THE DUNK", true, 0.7 + 0.3 * box2In, Math.min(1, box2In * 1.4))}
      {box2In > 0 && (
        <div style={{ position: "absolute", left: box2.x, width: box2.w, top: box2.y + 44, textAlign: "center", fontFamily: FONT, fontSize: 112, fontWeight: 800, letterSpacing: -3, color: GREY, opacity: Math.min(1, box2In * 1.4), transform: `scale(${(0.7 + 0.3 * box2In).toFixed(3)})` }}>+2</div>
      )}
      {/* the make and the miss */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {marks > 0 && (
          <circle cx={mk1.x} cy={mk1.y} r={mk1.r} fill="none" stroke="#FFFFFF" strokeWidth={gather > 0 ? 5 : 4} opacity={marks} />
        )}
        {xPop > 0 && (
          <g transform={`translate(${mk2.x.toFixed(1)} ${mk2.y.toFixed(1)}) scale(${(xPop * mk2.r / 34).toFixed(3)})`} opacity={Math.min(1, xPop * 1.5)}>
            <path d="M-26 -26L26 26M26 -26L-26 26" stroke={RED} strokeWidth={13} strokeLinecap="round" />
          </g>
        )}
      </svg>
      {/* the +1: pops over the ring on the swish, then drops into the box */}
      {plusPop > 0 && (
        <div
          style={{
            position: "absolute", left: plus.x - 150, top: plus.y - 70, width: 300, textAlign: "center", fontFamily: FONT, fontSize: 112,
            fontWeight: 800, letterSpacing: -3, color: "#FFFFFF", opacity: Math.min(1, plusPop * 1.5),
            transform: `scale(${(plus.s * (0.6 + 0.4 * plusPop)).toFixed(3)})`, textShadow: "0 4px 18px rgba(0,0,0,0.6)",
          }}
        >
          +1
        </div>
      )}
      {/* credits */}
      <div style={{ position: "absolute", right: 40, top: 1408, fontFamily: FONT, fontSize: 20, color: GREY }}>Bigmoe797, CC BY-SA 4.0</div>
      <div style={{ position: "absolute", right: 40, top: 1380, fontFamily: FONT, fontSize: 20, color: GREY, opacity: Math.min(1, ghOp * 2) }}>Dunk: Keith Allison, CC BY-SA 2.0</div>
    </AbsoluteFill>
  );
};
