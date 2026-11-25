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
  PC_BASE, PC_BOARD_Y, PC_FT_Y, PC_HALF, PC_SHAQ_FT, PC_SIDE, pcPoly3, PICTURE_COURT_END_CAM, PICTURE_COURT_LINE_SPOT,
  pcBand, pcLerp as lerp, pcMixCam, pcProjector, pcRnd, type PcCam, type PcProj,
} from "./PictureCourtWorld";
import { PictureCourtFloor } from "./PictureCourtFloor";
import { PictureCourtArena } from "./PictureCourtArena";
import { ClankSideOnBasketBack, ClankSideOnBasketFront, type ClankSideOnRim } from "./ClankSideOnBasket";

const deg = Math.PI / 180;
const SHAQ = staticFile("shaq-free-throws/picturecourt-shaq-lakers.png");
const BALL = staticFile("shaq-free-throws/picturecourt-ball.png");
const GHOST = staticFile("shaq-free-throws/clanksideon-dunk-ghost.png");
// the same Lakers cut-out cut in three (notes/ClankSideOn.cut.py): his body with the near arm lifted out and the jersey
// filled behind it, the upper arm (shoulder to elbow) and the forearm with the hand, so the real arm can shoot
const BODY = staticFile("shaq-free-throws/clanksideon-shaq-body.png");
const UPPER = staticFile("shaq-free-throws/clanksideon-shaq-upperarm.png");
const FORE = staticFile("shaq-free-throws/clanksideon-shaq-forearm.png");
/** joints in the cut-out's pixels: the shoulder (top of the upper-arm piece), the elbow, the middle of the hand */
const SHO: [number, number] = [430, 548], ELB: [number, number] = [446, 884], HND: [number, number] = [615, 1150];
const IMG_PPF = 2327 / 7.1; // the cut-out is his 7'1" in 2327 px
const ang = (a: [number, number], b: [number, number]) => Math.atan2(b[1] - a[1], b[0] - a[0]) / deg;
const U0 = ang(SHO, ELB), F0 = ang(ELB, HND); // the arm's own angles at rest (hand on his hip)
const IMG_W = 719, IMG_H = 2327;
const FEET_X = 430;
/** the dunk photo (1662 x 2097): ~368 px per foot; his left fist hooks the iron at (~900, 175), the net in his right
 * hand at ~1520: the anchor puts the ring's centre between them, so the near fist lands on the front iron */
const GH_W = 1662, GH_H = 2097, GH_PPF = 368, GH_RING: [number, number] = [1180, 175];
const BALL_FT = 9.4 / 12;
const FONT = "Inter, sans-serif";
const GREY = "#8B949E";
const BG = "#0D1117";
const RED = "#E5383B";

/** the sideline: the line at the left, the board at the right, everything at 55.8 px a foot */
const CLANK_SIDE_ON_CAM: PcCam = { tx: 0, ty: 6.8, tz: 5.0, D: 26, yaw: -90 * deg, pitch: 1 * deg, F: 1330, cx: 588, cy: 1320 };

/** the free-throw stroke as joint angles (screen degrees, 0 = toward the ring, 90 = down): hand on hip, the set
 * (elbow under the ball, ball in front of his face), the release (arm up and out), the follow-through (wrist snapped) */
type ClankSideOnPose = { u: number; fa: number };
const CSO_REST: ClankSideOnPose = { u: U0, fa: F0 };
const CSO_SET: ClankSideOnPose = { u: 40, fa: -100 };
const CSO_REL: ClankSideOnPose = { u: -62, fa: -90 };
const CSO_FOLLOW: ClankSideOnPose = { u: -70, fa: -52 };
const csoMix = (a: ClankSideOnPose, b: ClankSideOnPose, t: number): ClankSideOnPose => ({ u: lerp(a.u, b.u, t), fa: lerp(a.fa, b.fa, t) });

/** where his arm is on frame f: set, shoot, follow through; the second ball comes back and he does it again */
function clankSideOnPose(t: { in: number; rel1: number; rel2: number; and: number }, f: number): ClankSideOnPose {
  const s1 = Math.max(t.in, t.rel1 - 15);
  if (f < s1) return CSO_REST;
  if (f < t.rel1 - 7) return csoMix(CSO_REST, CSO_SET, ease.inOut(prog(f, s1, t.rel1 - 7 - s1)));
  if (f < t.rel1) return csoMix(CSO_SET, CSO_REL, ease.in(prog(f, t.rel1 - 7, 7)));
  if (f < t.rel1 + 4) return csoMix(CSO_REL, CSO_FOLLOW, ease.out(prog(f, t.rel1, 4)));
  // the ball back, the set again
  const back = t.rel2 - 6;
  if (f < back) return csoMix(CSO_FOLLOW, CSO_SET, ease.inOut(prog(f, t.rel1 + 4, back - t.rel1 - 4)));
  if (f < t.rel2) return csoMix(CSO_SET, CSO_REL, ease.in(prog(f, back, 6)));
  if (f < t.rel2 + 4) return csoMix(CSO_REL, CSO_FOLLOW, ease.out(prog(f, t.rel2, 4)));
  // he holds the follow-through while it rattles out, then the hand goes back to the hip
  return csoMix(CSO_FOLLOW, CSO_REST, ease.inOut(prog(f, t.and - 4, 16)));
}

/** the arm on the cut-out: elbow, forearm angle, and the ball's centre resting on his fingers (image px) */
function clankSideOnArm(p: ClankSideOnPose) {
  const lu = Math.hypot(ELB[0] - SHO[0], ELB[1] - SHO[1]);
  const lf = Math.hypot(HND[0] - ELB[0], HND[1] - ELB[1]);
  const e: [number, number] = [SHO[0] + Math.cos(p.u * deg) * lu, SHO[1] + Math.sin(p.u * deg) * lu];
  const hnd: [number, number] = [e[0] + Math.cos(p.fa * deg) * lf, e[1] + Math.sin(p.fa * deg) * lf];
  // the ball (9.4 in) sits on the fingers: past the hand along the forearm, a little toward the ring
  const r = (BALL_FT / 2) * IMG_PPF;
  const ball: [number, number] = [hnd[0] + Math.cos(p.fa * deg) * r * 0.95 + r * 0.35, hnd[1] + Math.sin(p.fa * deg) * r * 0.95];
  return { e, hnd, ball, rotU: p.u - U0, rotF: p.fa - F0 };
}

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
  const rel1 = Math.max(t.in + 8, t.make); // lets go on "Make", not during the last word of `picture`
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
  const swing = prog(f, t.in, t.one - 2 - t.in, ease.inOut);
  let cam = pcMixCam(PICTURE_COURT_END_CAM, CLANK_SIDE_ON_CAM, swing);
  const push = prog(f, t.one, t.end - t.one, ease.linear);
  cam = { ...cam, F: cam.F * (1 + 0.03 * push), tz: cam.tz + 0.4 * push, ty: cam.ty - 0.4 * push };
  const dj = f >= t.dunk ? Math.exp(-(f - t.dunk) / 6) : 0;
  const jy = Math.sin((f - t.dunk) * 2.2) * 10 * dj;
  const P = pcProjector(cam);

  // Shaq on the line, the same cut-out, a dip before each release and a rise into it
  const [sx, sy] = PICTURE_COURT_LINE_SPOT;
  const feet = P.p(sx, sy, 0);
  const head = P.p(sx, sy, PC_SHAQ_FT);
  const h = Math.max(feet.y - head.y, 0.86 * feet.s * PC_SHAQ_FT);
  const k = h / IMG_H;
  // the knees: a dip into the set, a rise into the release (he shoots with his legs, like every free throw)
  const dipOf = (rel: number) => {
    const d = prog(f, rel - 11, 5, ease.inOut) * (1 - prog(f, rel - 6, 6, ease.out));
    const up = prog(f, rel - 6, 6, ease.out) * (1 - prog(f, rel + 2, 10, ease.inOut));
    return { d, up };
  };
  const d1 = dipOf(t.rel1), d2 = dipOf(t.rel2);
  const dip = Math.max(d1.d, d2.d), up = Math.max(d1.up, d2.up);
  const scaleY = 1 - 0.035 * dip + 0.02 * up;
  const rise = (-0.25 * dip + 0.22 * up) * feet.s; // px upward
  const shaqLeft = feet.x - FEET_X * k;
  const shaqTop = feet.y - h * scaleY - rise;
  const lift = 1.12;
  // his arm, and the ball on his fingers, in screen px
  const pose = clankSideOnPose(t, f);
  const arm = clankSideOnArm(pose);
  const armed = Math.abs(pose.u - U0) + Math.abs(pose.fa - F0) > 0.05;
  const img2scr = (q: [number, number]) => ({ x: shaqLeft + q[0] * k, y: shaqTop + q[1] * k * scaleY });
  const onFingers = img2scr(arm.ball);
  const relArm = img2scr(clankSideOnArm(CSO_REL).ball); // where the ball leaves his fingers, this frame's camera

  // the balls: in his hands, lifted, in the air, through or off the ring
  const relScr = toScreen(P, REL);
  type B = { x: number; y: number; s: number; rot: number; op: number; grey?: boolean };
  const balls: B[] = [];
  const handBall = BALL_FT * feet.s * 0.98;
  // in his hands: the first from the start, the second bounced back to him by the ref right after the first leaves
  const held = (rel: number, appear: number) => {
    if (f < appear || f >= rel) return null;
    return { x: onFingers.x, y: onFingers.y, s: handBall, rot: -8 + 0.6 * (f - appear), op: prog(f, appear, 5) };
  };
  const h1 = held(t.rel1, t.in - 10);
  const heldBalls: B[] = [];
  if (h1) heldBalls.push(h1);
  const h2 = held(t.rel2, t.rel1 + 3);
  if (h2) heldBalls.push(h2);
  // the flight starts on his fingers: the gap to the world arc closes over the first part of the flight
  const flight = (w: 1 | 2, g: number) => {
    const v = clankSideOnBall(t, g, w);
    if (!v) return null;
    const q = toScreen(P, v);
    const rel = w === 1 ? t.rel1 : t.rel2;
    const u = Math.min(1, (g - rel) / t.T);
    const off = Math.pow(1 - Math.min(1, u * 1.4), 2);
    return { x: q.x + (relArm.x - relScr.x) * off, y: q.y + (relArm.y - relScr.y) * off, s: lerp(q.s * BALL_FT, handBall, off), v };
  };
  // the make drops through and is gone before the second leaves his hand: one shot, then the next
  const out = 1 - prog(f, t.arr1 + 4, 9);
  const out2 = 1 - prog(f, t.and + 26, 14);
  for (const w of [1, 2] as const) {
    const q = flight(w, f);
    if (!q) continue;
    const rel = w === 1 ? t.rel1 : t.rel2;
    balls.push({ x: q.x, y: q.y, s: q.s, rot: -14 * (f - rel), op: w === 1 ? out : out2 });
  }
  const shadows = [] as { x: number; y: number; rx: number; a: number }[];
  for (const w of [1, 2] as const) {
    const v = clankSideOnBall(t, f, w);
    if (!v) continue;
    const q = P.p(v[0], v[1], 0);
    shadows.push({ x: q.x, y: q.y, rx: q.s * BALL_FT * 0.6, a: 0.45 * Math.max(0.15, 1 - v[2] / 14) * (w === 1 ? out : out2) });
  }
  const spark = f >= t.arr2 ? Math.exp(-(f - t.arr2) / 5) : 0;
  // the strobe, like a long-exposure sports photo: the make leaves a light trace that is gone before the second
  // shot; the miss (the one the story is about) keeps its trace, back out off the iron, until the score box
  const strobe: B[] = [];
  for (const w of [1, 2] as const) {
    const rel = w === 1 ? t.rel1 : t.rel2;
    const every = w === 1 ? 6 : 5;
    const op = w === 1 ? 0.22 * (1 - prog(f, t.rel2 - 8, 8)) : 0.3 * (1 - prog(f, t.and, 14, ease.in));
    if (op <= 0.001) continue;
    const last = Math.min(f - 3, (w === 1 ? t.arr1 : t.arr2 + 14));
    for (let g = rel + every; g <= last; g += every) {
      const q = flight(w, g);
      if (!q) continue;
      strobe.push({ x: q.x, y: q.y, s: q.s, rot: -14 * (g - rel), op: op * (0.5 + 0.5 * (g - rel) / Math.max(1, last - rel)) });
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
  // his fists hook the front iron: at the slam they sit at the ring's height and ride it down as it bends
  const handsZ = lerp(4.5, 10.6, ghRise) - 0.6 * ghSlam - 0.45 * Math.max(0, bend) * (1 - ghFall) - 0.8 * ghFall;
  const gq = P.p(0, 0, handsZ);
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
  const mk1 = { x: lerp(swishAt.x, box1.x + 80, gather), y: lerp(swishAt.y - 4, box1.y + 158, gather), r: lerp(26, 20, gather) };
  const mk2 = { x: lerp(ironAt.x - 8, box1.x + 150, gather), y: lerp(ironAt.y - 26, box1.y + 158, gather), r: lerp(34, 20, gather) };
  const marks = prog(f, t.arr1 + 4, 8) * (gather > 0 ? 1 : 1 - prog(f, t.arr1 + 22, 10)); // the make's ring shows briefly, then reappears in the box
  const box2In = prog(f, t.dunk + 1, 10, ease.back);

  // PictureCourtArena's LED ribbon at rise 1 (its own geometry, a little taller so the clip takes its glow too)
  const rbTop = 1.2 + 21 * 1.25 + 1.6, rbRun = 9 + 22 * 2.75;
  const ribbon = [
    pcPoly3(P, [[-34 - rbRun * 0.6, PC_BASE - rbRun, rbTop - 0.8], [34 + rbRun * 0.6, PC_BASE - rbRun, rbTop - 0.8], [34 + rbRun * 0.6, PC_BASE - rbRun, rbTop + 3], [-34 - rbRun * 0.6, PC_BASE - rbRun, rbTop + 3]]),
    ...[-1, 1].map((sd) => pcPoly3(P, [[sd * (PC_SIDE + rbRun), PC_BASE - rbRun * 0.6 - 2, rbTop - 0.8], [sd * (PC_SIDE + rbRun), PC_HALF + 8, rbTop - 0.8], [sd * (PC_SIDE + rbRun), PC_HALF + 8, rbTop + 3], [sd * (PC_SIDE + rbRun), PC_BASE - rbRun * 0.6 - 2, rbTop + 3]])),
  ].join(" ");

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
        {/* the house, without its LED ribbon: seen exactly side-on it is one flat bar straight through both shots */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, clipPath: `path(evenodd, "M-200 -200H1280V2120H-200Z ${ribbon}")` }}>
          <PictureCourtArena P={P} f={f} rise={1} dark={1} flash={1} flashFrom={t.arr1 - 4} />
        </div>
        {/* the gap it leaves shows the ground, a shade lighter than the dark house: take it back down to the house */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={ribbon} fill="#000" opacity={0.13} />
        </svg>
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
        {/* Shaq, the same pixels as every other return to the line; when he shoots, the same cut-out in three pieces:
            the body, the upper arm turning at the shoulder, the forearm and hand turning at the elbow, the ball on his
            fingers between them so his fingers sit over it */}
        {!armed ? (
          <Img
            src={SHAQ}
            style={{
              position: "absolute", left: shaqLeft, top: shaqTop, width: IMG_W * k, height: h * scaleY,
              filter: `brightness(${(0.88 * lift).toFixed(3)})`,
            }}
          />
        ) : (
          <div style={{ position: "absolute", left: 0, top: 0, width: IMG_W, height: IMG_H, transformOrigin: "0 0", transform: `translate(${shaqLeft.toFixed(2)}px, ${shaqTop.toFixed(2)}px) scale(${k.toFixed(5)}, ${(k * scaleY).toFixed(5)})`, filter: `brightness(${(0.88 * lift).toFixed(3)})` }}>
            <Img src={BODY} style={{ position: "absolute", left: 0, top: 0, width: IMG_W, height: IMG_H }} />
            <Img src={UPPER} style={{ position: "absolute", left: 0, top: 0, width: IMG_W, height: IMG_H, transformOrigin: `${SHO[0]}px ${SHO[1]}px`, transform: `rotate(${arm.rotU.toFixed(2)}deg)` }} />
          </div>
        )}
        {heldBalls.map((b, i) => ballImg(b, `h${i}`))}
        {armed && (
          <div style={{ position: "absolute", left: 0, top: 0, width: IMG_W, height: IMG_H, transformOrigin: "0 0", transform: `translate(${shaqLeft.toFixed(2)}px, ${shaqTop.toFixed(2)}px) scale(${k.toFixed(5)}, ${(k * scaleY).toFixed(5)})`, filter: `brightness(${(0.88 * lift).toFixed(3)})` }}>
            <Img src={FORE} style={{ position: "absolute", left: 0, top: 0, width: IMG_W, height: IMG_H, transformOrigin: `${ELB[0]}px ${ELB[1]}px`, transform: `translate(${(arm.e[0] - ELB[0]).toFixed(2)}px, ${(arm.e[1] - ELB[1]).toFixed(2)}px) rotate(${arm.rotF.toFixed(2)}deg)` }} />
          </div>
        )}
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
        {/* each ball's shadow on the boards, under the arena's high light */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {shadows.map((q, i) => <ellipse key={i} cx={q.x} cy={q.y} rx={q.rx} ry={q.rx * 0.22} fill="#000" opacity={q.a} />)}
          {/* the clank: short white streaks off the front iron */}
          {spark > 0.01 && Array.from({ length: 7 }, (_, i) => {
            const a = -2.6 + i * 0.42, r0 = 14 + 30 * (1 - spark), r1 = r0 + 26 * spark;
            return <path key={`k${i}`} d={`M${ironAt.x + Math.cos(a) * r0} ${ironAt.y - 6 + Math.sin(a) * r0}L${ironAt.x + Math.cos(a) * r1} ${ironAt.y - 6 + Math.sin(a) * r1}`} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={spark} />;
          })}
        </svg>
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
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: lerp(640, 470, swing), background: `linear-gradient(${BG} 0%, ${BG} 62%, rgba(13,17,23,0) 100%)` }} />
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
      <div style={{ position: "absolute", right: 40, top: 1408, fontFamily: FONT, fontSize: 20, color: GREY, textShadow: "0 0 6px #0D1117, 0 1px 3px #0D1117" }}>Bigmoe797, CC BY-SA 4.0</div>
      <div style={{ position: "absolute", right: 40, top: 1380, fontFamily: FONT, fontSize: 20, color: GREY, textShadow: "0 0 6px #0D1117, 0 1px 3px #0D1117", opacity: Math.min(1, ghOp * 2) }}>Dunk: Keith Allison, CC BY-SA 2.0</div>
    </AbsoluteFill>
  );
};
