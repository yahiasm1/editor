// granny, dark, 54.02-62.70 s: "The Lakers hired a free throw coach just for him. Hall of Famer Rick Barry offered to
// teach him his underhand granny shot, and Shaq said he'd shoot zero percent before he'd shoot underhanded."
// Shaq's real shooting cut-out (Keith Allison) big at the line, the 0-11 still in the corner. The Lakers logo lands;
// a real hand (Evan-Amos) out of a shirt cuff presses his flared elbow, pushes it in on "just", pats it on "him",
// and the line of the shot kinks, straightens and flies to the ring. The view widens to one scale, 104 px a foot: Shaq left under a 7'1" hairline, Rick Barry's real
// 1976 photo (Russ Reed) fills a card on the right, its ground dissolves and he stands on the floor line under 6'7".
// Shaq's legs are finished in ink down to the floor line. Barry's underhand shot plays across "teach him his" as an
// ink strobe traced off the real photo and posed, and the real photo is its follow-through; the ball swishes on
// "underhand". The arc copies itself over to Shaq's knees and snaps back off him on "shot", the ghosts are gone by
// "granny", he turns away, Barry dims, Shaq centres under a smaller ring, the stamped quote slams on and
// UNDERHANDED takes the foul red strike. (notes/GrannyShot.md)
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { arrive, blurIn, ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { GRANNYSHOT_INK, GRANNYSHOT_POSES, GrannyShotFigure, grannyShotRig } from "./GrannyShotFigure";
import { GRANNYSHOT_HAND_SRC, GrannyShotHand } from "./GrannyShotHand";
import { GrannyShotQuote, useGrannyShotFont } from "./GrannyShotQuote";
import { GrannyShotRing } from "./GrannyShotRing";

const SHAQ = staticFile("shaq-free-throws/grannyshot-shaq.png"); // 1200 x 1794
const BARRY = staticFile("shaq-free-throws/grannyshot-barry.png"); // 665 x 1911, at (216, 24) of the photo
const PHOTO = staticFile("shaq-free-throws/grannyshot-barry-photo.jpg"); // 960 x 1999
const LAKERS = staticFile("shaq-free-throws/grannyshot-lakers.svg");
const BALL = staticFile("shaq-free-throws/grannyshot-ball.png");
const UI = "Inter, sans-serif";
const BIG = "Figtree, sans-serif";
const GREY = "#8B949E";
const RED = "#E5383B";
const CARD = "#161B22";
const HAIR = "#30363D";

// one scale for both men: 104 px a foot, floor line at 1420
const K = 104;
const FLOOR = 1420;
const H71 = FLOOR - (7 + 1 / 12) * K; // 683
const H67 = FLOOR - (6 + 7 / 12) * K; // 736

// Shaq's cut-out: landmarks in its own pixels
const S_CROWN = 234;
const S_MID = 640; // body centre line
const S_BALL = { x: 412, y: 581, r: 156 };
const S_ELBOW = { x: 322, y: 1150 };
const S_ELBOW_OUT = { x: 282, y: 1128 };
const S_H = 1794;
type Place = { s: number; x: number; crown: number };
const SA: Place = { s: 0.62, x: 540, crown: 640 }; // alone, big
const SB: Place = { s: K / 329, x: 300, crown: H71 }; // at true scale (his head, 291 px, is 0.885 ft)
const SC: Place = { s: 0.37, x: 540, crown: 732 }; // centred for the quote, his crown under the smaller ring's net

// Barry: the photo card and the cut-out at the same scale
const PS = 0.4375; // photo -> stage in the card (960 px wide card is 420)
const CARD_R = { x: 575, y: 560, w: 420, h: Math.round(1999 * PS) };
const B_IN_CARD = { left: CARD_R.x + 216 * PS, top: CARD_R.y + 24 * PS, s: PS };
const B_S = 0.433; // crown to sole 1575 photo px = 6.56 ft
const B_CROWN_X = B_IN_CARD.left + 334 * PS;
const B_OUT = { left: B_CROWN_X - 334 * B_S, top: H67 - 332 * B_S, s: B_S };
const B_CX = B_CROWN_X - 4; // his centre line for the strobe

const RING_A = { x: 470, y: 566, k: 74 };
const RING_B = { x: 540, y: 600, k: K };
const RING_C = { x: 540, y: 572, k: 76 }; // net bottom 686, over Shaq's crown at 732

/** the control height that puts a quadratic arc's peak at `peak` (the caption band ends at 520) */
const ctrlFor = (ay: number, by: number, peak: number) => {
  let lo = -4000;
  let hi = Math.min(ay, by) - 0.01;
  for (let i = 0; i < 60; i++) {
    const c = (lo + hi) / 2;
    const den = ay - 2 * c + by;
    const top = ay - ((ay - c) * (ay - c)) / den;
    if (top < peak) lo = c;
    else hi = c;
  }
  return (lo + hi) / 2;
};
/** Barry's rig point (cut-out pixels) on the stage */
const bStage = (p: { x: number; y: number }, dx = 0) => ({ x: B_OUT.left + p.x * B_OUT.s + dx, y: B_OUT.top + p.y * B_OUT.s });
const STROBE_DX = (i: number) => -(3 - i) * 12;

// Shaq's legs below the photo, drawn in ink on the stage at true scale (SB): the shorts run on from where the photo
// fades (y 1063-1097) to the hem above the knee, knees at 2 ft, calves, the socks and shoes on the floor line.
const SHAQ_KNEE_Y = FLOOR - 2.0 * K;
const GrannyShotShaqLegs: React.FC<{ alpha: number }> = ({ alpha }) => {
  if (alpha <= 0.002) return null;
  const ink = "#EDEAE3";
  const leg = (m: 1 | -1) => {
    // m = 1 his right leg (screen left), -1 mirrored about the body's centre x 325
    const X = (x: number) => (m === 1 ? x : 650 - x);
    return (
      <g key={m}>
        {/* the leg's skin, a dark wash under the ink */}
        <path
          d={`M${X(214)},1166 C${X(220)},1190 ${X(232)},1205 ${X(230)},1222 C${X(226)},1250 ${X(214)},1280 ${X(220)},1320 C${X(224)},1350 ${X(234)},1368 ${X(236)},1384 L${X(280)},1384 C${X(282)},1368 ${X(292)},1350 ${X(296)},1322 C${X(302)},1284 ${X(296)},1254 ${X(292)},1224 C${X(290)},1206 ${X(298)},1195 ${X(304)},1174 Z`}
          fill="url(#gs-shaq-skin)"
        />
        {/* the leg: outer and inner contour, knee, calf */}
        <path
          d={`M${X(214)},${1166} C${X(220)},${1190} ${X(232)},${1205} ${X(230)},${1222} C${X(226)},${1250} ${X(214)},${1280} ${X(220)},${1320} C${X(224)},${1350} ${X(234)},${1368} ${X(236)},${1384}`}
          fill="none"
          stroke={ink}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
        <path
          d={`M${X(304)},${1174} C${X(298)},${1195} ${X(290)},${1206} ${X(292)},${1224} C${X(296)},${1254} ${X(302)},${1284} ${X(296)},${1322} C${X(292)},${1350} ${X(282)},${1368} ${X(280)},${1384}`}
          fill="none"
          stroke={ink}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
        <path d={`M${X(244)},${1206} q${m * 16},${10} ${m * 34},${2} M${X(248)},${1236} q${m * 12},${6} ${m * 26},${0}`} fill="none" stroke={ink} strokeWidth={1.6} opacity={0.7} />
        <path d={`M${X(228)},${1262} C${X(226)},${1290} ${X(232)},${1318} ${X(240)},${1340}`} fill="none" stroke={ink} strokeWidth={1.2} opacity={0.5} />
        {/* the sock's top */}
        <path d={`M${X(236)},${1370} q${m * 22},${5} ${m * 44},${-2}`} fill="none" stroke={ink} strokeWidth={2} />
        {/* the shoe from the front: toe box, the swoosh side panel, the sole on the floor */}
        <path
          d={`M${X(234)},${1384} C${X(222)},${1392} ${X(214)},${1404} ${X(216)},${FLOOR - 2} L${X(300)},${FLOOR - 2} C${X(302)},${1404} ${X(294)},${1392} ${X(282)},${1384}`}
          fill="rgba(13,17,23,0.9)"
          stroke={ink}
          strokeWidth={2.6}
          strokeLinejoin="round"
        />
        <path d={`M${X(216)},${FLOOR - 8} H${X(300)}`} stroke={ink} strokeWidth={2} />
        <path d={`M${X(240)},${1396} l${m * 10},${-6} M${X(252)},${1398} l${m * 10},${-6} M${X(264)},${1396} l${m * 8},${-5}`} stroke={ink} strokeWidth={1.4} opacity={0.75} />
      </g>
    );
  };
  return (
    <g opacity={alpha}>
      <defs>
        <linearGradient id="gs-shaq-shorts" x1="0" y1="1063" x2="0" y2="1170" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4B32A6" stopOpacity={0} />
          <stop offset="0.3" stopColor="#4B32A6" stopOpacity={0.85} />
          <stop offset="1" stopColor="#36237E" stopOpacity={0.9} />
        </linearGradient>
        <linearGradient id="gs-shaq-skin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1F1612" />
          <stop offset="0.45" stopColor="#35251D" />
          <stop offset="1" stopColor="#241913" />
        </linearGradient>
      </defs>
      <path d="M211,1063 L207,1166 Q260,1176 318,1174 L326,1122 L334,1174 Q392,1176 442,1164 L438,1063 Z" fill="url(#gs-shaq-shorts)" />
      {/* the shorts run on from the photo to the hem */}
      <path d={`M211,1078 L207,1166 Q260,1176 318,1174 L326,1122 L334,1174 Q392,1176 442,1164 L438,1078`} fill="none" stroke={ink} strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round" opacity={0.95} />
      <path d={`M232,1100 q10,30 4,60 M418,1100 q-10,30 -4,60`} fill="none" stroke={ink} strokeWidth={1.4} opacity={0.5} />
      {leg(1)}
      {leg(-1)}
    </g>
  );
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPlace = (a: Place, b: Place, t: number): Place => ({ s: lerp(a.s, b.s, t), x: lerp(a.x, b.x, t), crown: lerp(a.crown, b.crown, t) });
const placeBox = (p: Place) => ({ left: p.x - S_MID * p.s, top: p.crown - S_CROWN * p.s, s: p.s });

type Pt = { x: number; y: number };
const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => ({ x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t * t * b.y });
const cubic = (a: Pt, c1: Pt, c2: Pt, b: Pt, t: number): Pt => {
  const u = 1 - t;
  return { x: u ** 3 * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t ** 3 * b.x, y: u ** 3 * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t ** 3 * b.y };
};
/** sample a curve from t0 to t1 into an SVG polyline */
const trace = (fn: (t: number) => Pt, t0: number, t1: number, n = 48) => {
  if (t1 <= t0) return "";
  let d = "";
  for (let i = 0; i <= n; i++) {
    const p = fn(t0 + ((t1 - t0) * i) / n);
    d += `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)} `;
  }
  return d;
};

function useGrannyShotTimes() {
  const { cue, cueEnd, endsOn, scene } = useScene();
  const teach = cue("teach");
  return {
    mount: scene.from - LEAD,
    from: scene.from,
    to: scene.to,
    lakers: cue("Lakers"),
    free: cue("free"),
    coach: cue("coach"),
    just: cue("just"),
    him: cue("him"),
    hall: cue("Hall"),
    rick: cue("Rick"),
    barry: cue("Barry"),
    offered: cue("offered"),
    teach,
    frame: (i: number) => teach + i * 8, // the strobe across "teach him his": a frame every 8 (133 ms)
    release: teach + 26,
    underhand: cue("underhand"),
    swish: cueEnd("underhand") - 4,
    granny: cue("granny"),
    shot: cue("shot"),
    and: cue("and"),
    zero: cue("zero"),
    percent: cue("percent"),
    before: cue("before"),
    strike: endsOn("underhanded", 12),
    underhanded: cue("underhanded"),
    end: cueEnd("underhanded"),
  };
}

export const GrannyShot: React.FC = () => {
  useGrannyShotFont();
  const { f } = useScene();
  const t = useGrannyShotTimes();

  // ---- Shaq: alone and big, to true scale on the left, to the centre for the quote
  const wide = prog(f, t.hall, 20, ease.inOut);
  const centre = prog(f, t.and, 18, ease.inOut);
  const place = lerpPlace(lerpPlace(SA, SB, wide), SC, centre);
  const sb = placeBox(place);
  const shaqIn = blurIn(f, t.mount, { dur: 9, rise: 40 });
  const push = prog(f, t.just - 4, 14, ease.inOut); // the coach pushes the elbow in
  const nudge = (0.35 * prog(f, t.coach, 9, ease.back) + 0.65 * push) * (1 - prog(f, t.hall, 14, ease.inOut)); // the elbow tucked in
  const turn = prog(f, t.shot + 2, 12, ease.back) * (1 - 0.5 * prog(f, t.zero, 20, ease.inOut)); // he turns away
  const breathe = Math.sin(f / 38) * 0.004;
  const sx = (x: number) => sb.left + x * sb.s;
  const sy = (y: number) => sb.top + y * sb.s;

  // ---- the coach's hand: in from the bottom left on "coach", presses, pushes the elbow in on "just", two pats on
  // "him", away on "Hall"
  const handIn = arrive(f, t.coach - 12, 13);
  const handOut = prog(f, t.hall, 14, ease.in);
  const pat = Math.max(Math.sin(prog(f, t.him, 7, ease.linear) * Math.PI), 0.7 * Math.sin(prog(f, t.him + 8, 7, ease.linear) * Math.PI));
  const press = Math.min(1, prog(f, t.coach, 6, ease.out) + 0.6 * push) * (1 - 0.5 * pat);
  const tip = { x: sx(S_ELBOW_OUT.x) + 6 + 20 * push, y: sy(S_ELBOW_OUT.y) + 10 - 4 * push };
  const handBack = (1 - handIn) * 520 + handOut * 600 - press * 8 + pat * 14; // stage px along the fingers
  const handScale = 0.3 * (sb.s / SA.s);
  const handRot = 36 + 6 * push - 3 * pat;

  // ---- the shot line: elbow, ball, ring. Kinked while the elbow flares, straight once it is tucked
  const ringA = RING_A;
  const ball = { x: sx(S_BALL.x), y: sy(S_BALL.y) };
  const elbow = { x: sx(S_ELBOW.x), y: sy(S_ELBOW.y) };
  const dBR = Math.hypot(ringA.x - ball.x, ringA.y - ball.y);
  const dEB = Math.hypot(elbow.x - ball.x, elbow.y - ball.y);
  const straight = { x: ball.x + ((ball.x - ringA.x) * dEB) / dBR, y: ball.y + ((ball.y - ringA.y) * dEB) / dBR };
  const flare = { x: elbow.x - 46, y: elbow.y + 4 };
  const fix = prog(f, t.just - 4, 14, ease.inOut);
  const low = { x: lerp(flare.x, straight.x, fix), y: lerp(flare.y, straight.y, fix) };
  const lineDraw = prog(f, t.free, 12, ease.out);
  const lineGone = prog(f, t.him + 10, 12, ease.inOut);

  // ---- "him.": the shot's arc from the ball to the ring
  const shotA = { x: ball.x - 10, y: ball.y - S_BALL.r * sb.s };
  const shotC = { x: ball.x - 120, y: ctrlFor(shotA.y, ringA.y - 6, 530) };
  const shotP = (u: number) => quad(shotA, shotC, { x: ringA.x, y: ringA.y - 6 }, u);
  const shotK = prog(f, t.him - 2, 20, ease.inOut);
  const shotGone = prog(f, t.hall + 2, 12, ease.inOut);

  // ---- the ring: far and small at first, then the diagram ring between them
  const ringMove = prog(f, t.hall, 20, ease.inOut);
  const ringDrop = prog(f, t.offered, 14, ease.back);
  const ringBack = prog(f, t.and, 18, ease.inOut); // smaller again while Shaq centres, so the net clears his head
  const ring = {
    x: lerp(lerp(RING_A.x, RING_B.x, ringMove), RING_C.x, ringBack),
    y: lerp(lerp(RING_A.y, RING_B.y, ringMove) - 18 * (1 - ringDrop) * ringMove, RING_C.y, ringBack),
    k: lerp(lerp(RING_A.k, RING_B.k, ringMove), RING_C.k, ringBack),
  };
  const ringIn = prog(f, t.mount + 4, 10, ease.out);
  const swishA = prog(f, t.him + 16, 16, ease.linear) * (f < t.hall ? 1 : 0) * 0.35;
  const swishB = prog(f, t.swish - 2, 24, ease.linear);

  // ---- 0-11 in the corner, the Lakers logo
  const tag = blurIn(f, t.from + 2, { dur: 8, scaleFrom: 1.3 });
  const tagOut = prog(f, t.hall - 6, 8, ease.in);
  const logo = blurIn(f, t.lakers, { dur: 8, scaleFrom: 0.7 });
  const logoOut = prog(f, t.hall, 12, ease.in);
  const logoPush = 1 + 0.03 * prog(f, t.lakers, 100, ease.out);

  // ---- heights
  const h71 = prog(f, t.hall + 6, 16, ease.out);
  const h67 = prog(f, t.barry + 4, 14, ease.out);
  const heightsOut = prog(f, t.and, 14, ease.inOut);

  // ---- Barry: the card opens, his photo fills it, its ground dissolves and he steps down onto the floor line
  const cardOpen = prog(f, t.rick - 6, 12, ease.out); // the card opens with his photo, on "Rick"
  const photoIn = blurIn(f, t.rick - 2, { dur: 8 });
  const photoGone = prog(f, t.barry - 2, 12, ease.inOut);
  const step = prog(f, t.barry + 4, 12, ease.inOut);
  const bBox = { left: lerp(B_IN_CARD.left, B_OUT.left, step), top: lerp(B_IN_CARD.top, B_OUT.top, step), s: lerp(B_IN_CARD.s, B_OUT.s, step) };
  const cutIn = prog(f, t.barry - 3, 4, ease.linear);
  // the strobe: the real cut-out steps back while the ink frames play, then IS the follow-through
  const cutDim = prog(f, t.teach - 2, 5, ease.out) * (1 - prog(f, t.release + 4, 8, ease.out));
  const barryDim = prog(f, t.and, 16, ease.inOut);
  const barryAlpha = 1 - 0.72 * barryDim;

  // each frame lands solid, steps back to a ghost when the next one lands; the ghosts are gone by "granny"
  const frameAlpha = (i: number, at: number) => {
    if (f < at) return 0;
    const on = prog(f, at, 3, ease.linear);
    const nextAt = i < 3 ? t.frame(i + 1) : t.release + 6;
    const ghost = 0.2 + i * 0.05;
    const decay = prog(f, nextAt, 6, ease.out);
    const gone = prog(f, t.granny - 12, 12, ease.inOut);
    return on * (1 - (1 - ghost) * decay) * (1 - gone);
  };

  // ---- Barry's ball: off his fingers at the release, a high soft arc, swish
  const balls = GRANNYSHOT_POSES.map((p, i) => bStage(grannyShotRig(p).ball, STROBE_DX(i)));
  const rel = balls[3];
  const arcEnd = { x: RING_B.x + 4, y: RING_B.y - 6 };
  const arcC = { x: 720, y: ctrlFor(rel.y, arcEnd.y, 532) };
  const arcP = (u: number) => quad(rel, arcC, arcEnd, u);
  const flight = prog(f, t.release, t.swish - t.release, ease.linear);
  const drop = prog(f, t.swish, 12, ease.in);
  const ballVis = f >= t.release && f < t.swish + 16;
  const ballPos = flight < 1 ? arcP(flight) : { x: arcEnd.x - 4 * drop, y: arcEnd.y + drop * 170 };
  const arcGone = prog(f, t.and, 14, ease.inOut);

  // ---- the copy: the same path offered to Shaq, from his knees; it snaps back off him and he turns away
  const knee = { x: SB.x + 26, y: SHAQ_KNEE_Y };
  const cpy = (u: number) => cubic({ x: RING_B.x, y: RING_B.y - 6 }, { x: 470, y: 520 }, { x: 250, y: 560 }, knee, u); // ring -> knees
  const reach = prog(f, t.swish, t.granny + 8 - t.swish, ease.inOut); // drawn over "granny", it touches his knees until "shot"
  const snapK = prog(f, t.shot, 10, ease.back);
  const copyLen = Math.max(0, reach - snapK * 1.06);
  const burst = prog(f, t.shot, 12, ease.out);
  const legsIn = prog(f, t.hall + 16, 10, ease.out) * (1 - prog(f, t.and, 12, ease.inOut));

  // ---- the quote card slams on "zero", settles on "percent", the strike ends on "underhanded"
  const slam = prog(f, t.zero - 6, 6, ease.in);
  const bounce = Math.sin(prog(f, t.percent, 14, ease.linear) * Math.PI) * 0.03;
  const quoteScale = f < t.zero - 6 ? 0 : lerp(1.7, 1, slam) + bounce;
  const hit = f >= t.zero ? Math.exp(-(f - t.zero) / 5) : 0;
  const shake = hit * Math.sin((f - t.zero) * 1.9) * 10;
  const strike = prog(f, t.strike, 12, ease.inOut);
  const holdPush = 1 + 0.02 * prog(f, t.underhanded, 50, ease.out);

  const credit = (a: number): React.CSSProperties => ({ position: "absolute", top: 1452, fontFamily: UI, fontSize: 20, color: GREY, opacity: a });

  return (
    <AbsoluteFill style={{ transform: `translate(${shake.toFixed(2)}px, ${(shake * 0.4).toFixed(2)}px)` }}>
      {/* depth: a soft arena light behind the line, the floor line once they stand side by side */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 480,
          width: 1080,
          height: 1000,
          background: `radial-gradient(ellipse 60% 55% at ${lerp(52, 50, wide)}% 45%, rgba(64,86,120,0.30), rgba(13,17,23,0) 70%)`,
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* floor line and the two contact shadows */}
        <defs>
          <linearGradient id="gs-floor" x1="60" x2="1020" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.22} />
            <stop offset="0.12" stopColor="#FFFFFF" stopOpacity={0.22} />
            <stop offset="0.17" stopColor="#FFFFFF" stopOpacity={0.05} />
            <stop offset="0.39" stopColor="#FFFFFF" stopOpacity={0.05} />
            <stop offset="0.44" stopColor="#FFFFFF" stopOpacity={0.22} />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity={0.22} />
          </linearGradient>
        </defs>
        <g opacity={wide * (1 - 0.7 * heightsOut)}>
          <line x1={60} x2={1020} y1={FLOOR} y2={FLOOR} stroke="url(#gs-floor)" strokeWidth={2} />
          <ellipse cx={B_CX} cy={FLOOR + 2} rx={120} ry={12} fill="#000" opacity={0.45 * barryAlpha * cutIn} style={{ filter: "blur(6px)" }} />
          <ellipse cx={SB.x + 25} cy={FLOOR + 1} rx={150} ry={13} fill="#000" opacity={0.6 * legsIn} style={{ filter: "blur(7px)" }} />
        </g>
        {/* the height hairlines: 7'1" across both halves, 6'7" over Barry */}
        <g opacity={1 - heightsOut}>
          <line x1={60} x2={60 + 960 * h71} y1={H71} y2={H71} stroke="#FFFFFF" strokeWidth={1.5} opacity={0.75} />
          <text x={64} y={H71 - 12} fontFamily={UI} fontWeight={600} fontSize={26} fill={GREY} opacity={h71}>
            7-1
          </text>
          <line x1={1020 - 400 * h67} x2={1020} y1={H67} y2={H67} stroke="#FFFFFF" strokeWidth={1.5} opacity={0.55} />
          <text x={1016} y={H67 + 34} textAnchor="end" fontFamily={UI} fontWeight={600} fontSize={26} fill={GREY} opacity={h67}>
            6-7
          </text>
        </g>
      </svg>

      {/* Barry's photo card on the right */}
      {f >= t.rick - 6 && (
        <div
          style={{
            position: "absolute",
            left: CARD_R.x,
            top: CARD_R.y,
            width: CARD_R.w,
            height: CARD_R.h,
            borderRadius: 28,
            overflow: "hidden",
            background: CARD,
            border: `1px solid ${HAIR}`,
            transform: `scaleY(${cardOpen.toFixed(4)})`,
            opacity: cardOpen * (1 - photoGone),
          }}
        >
          <Img src={PHOTO} style={{ position: "absolute", left: 0, top: 0, width: CARD_R.w, height: CARD_R.h, ...photoIn, transform: undefined }} />
          <div style={{ position: "absolute", right: 18, bottom: 14, fontFamily: UI, fontSize: 22, color: "#C9D1D9", textShadow: "0 1px 6px rgba(0,0,0,0.9)", opacity: photoIn.opacity }}>Russ Reed, public domain</div>
        </div>
      )}

      {/* the ring, above Barry's card so the card never cuts it */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={`translate(${ring.x.toFixed(1)},${ring.y.toFixed(1)})`} opacity={ringIn * (1 - 0.35 * barryDim)}>
          <GrannyShotRing k={ring.k} swish={Math.max(swishA, swishB)} t={f} boardAlpha={0.5 + 0.5 * ringMove} />
        </g>
      </svg>

      {/* Barry: the real cut-out, then the ink strobe of his shot */}
      <div style={{ position: "absolute", inset: 0, opacity: barryAlpha, filter: barryDim > 0.01 ? `blur(${(barryDim * 1.5).toFixed(2)}px)` : undefined }}>
        {f >= t.barry - 3 && (
          <Img
            src={BARRY}
            style={{
              position: "absolute",
              left: bBox.left,
              top: bBox.top,
              width: 665 * bBox.s,
              height: 1911 * bBox.s,
              opacity: cutIn * (1 - 0.86 * cutDim),
            }}
          />
        )}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {GRANNYSHOT_POSES.map((p, i) => (
            <GrannyShotFigure key={`s${i}`} id={`s${i}`} pose={p} left={B_OUT.left + STROBE_DX(i)} top={B_OUT.top} s={B_OUT.s} alpha={frameAlpha(i, t.frame(i))} ballOn={i < 3 || f < t.release} />
          ))}
          {/* the ball's path through the frames: low, down between the knees, up through the release */}
          <path
            d={`M${balls[0].x.toFixed(1)},${balls[0].y.toFixed(1)} Q${(balls[1].x - 30).toFixed(1)},${(balls[1].y + 40).toFixed(1)} ${balls[2].x.toFixed(1)},${balls[2].y.toFixed(1)} T${rel.x.toFixed(1)},${rel.y.toFixed(1)}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={2}
            strokeDasharray="3 7"
            strokeLinecap="round"
            opacity={0.6 * prog(f, t.frame(1), 10, ease.out) * (1 - prog(f, t.granny - 12, 12, ease.inOut))}
          />
          <path d={trace(arcP, 0, f >= t.release ? Math.min(1, flight) : 0)} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.9 * (1 - arcGone)} />
        </svg>
      </div>

      {/* Barry's ball in flight, the real ball, turning backwards (backspin) */}
      {ballVis && (
        <div style={{ position: "absolute", left: ballPos.x - 40, top: ballPos.y - 40, width: 80, height: 80 }}>
          <Img src={BALL} style={{ width: 80, height: 80, transform: `rotate(${(-(f - t.release) * 24).toFixed(1)}deg)`, filter: "saturate(0.85)" }} />
          <svg width={120} height={120} style={{ position: "absolute", left: -20, top: -20, overflow: "visible" }}>
            <path d="M14,60 A46,46 0 0 1 36,22" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.7 * (1 - drop)} />
            <path d="M106,60 A46,46 0 0 1 84,98" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.7 * (1 - drop)} />
          </svg>
        </div>
      )}
      {/* the ring's front lip again, so the ball drops through it */}
      {ballVis && drop > 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={`M${RING_B.x - 0.75 * K},${RING_B.y} A${0.75 * K},${0.1 * K} 0 0 0 ${RING_B.x + 0.75 * K},${RING_B.y}`} fill="none" stroke="#E2622A" strokeWidth={K * 0.07} strokeLinecap="round" />
        </svg>
      )}

      {/* the corner: last scene's 0-11, small */}
      <div style={{ position: "absolute", left: 60, top: 548, opacity: (tag.opacity as number) * (1 - tagOut), filter: tag.filter, transform: `${tag.transform} translateY(${(-30 * tagOut).toFixed(1)}px)`, transformOrigin: "0 0" }}>
        <div style={{ fontFamily: BIG, fontWeight: 800, fontSize: 64, color: "#FFFFFF", letterSpacing: -1, lineHeight: 1 }}>0-11</div>
        <div style={{ height: 6, width: 118, background: RED, marginTop: 8, borderRadius: 3 }} />
        <div style={{ fontFamily: UI, fontSize: 22, color: GREY, marginTop: 10 }}>Dec 8, 2000</div>
      </div>

      {/* the Lakers logo, bare */}
      <Img
        src={LAKERS}
        style={{
          position: "absolute",
          left: 760,
          top: 560,
          width: 240,
          opacity: (logo.opacity as number) * (1 - logoOut),
          filter: logo.filter,
          transform: `${logo.transform} scale(${(logoPush * (1 - 0.4 * logoOut)).toFixed(4)}) translateY(${(-40 * logoOut).toFixed(1)}px)`,
        }}
      />

      {/* Shaq's legs in ink, at true scale, following his place */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform={`translate(${sb.left.toFixed(2)},${sb.top.toFixed(2)}) scale(${(sb.s / SB.s).toFixed(5)}) translate(${(-placeBox(SB).left).toFixed(2)},${(-placeBox(SB).top).toFixed(2)})`}>
          <GrannyShotShaqLegs alpha={legsIn} />
        </g>
      </svg>

      {/* Shaq */}
      <div
        style={{
          position: "absolute",
          left: sb.left,
          top: sb.top,
          width: 1200 * sb.s,
          height: S_H * sb.s,
          opacity: shaqIn.opacity,
          filter: shaqIn.filter,
          transformOrigin: `${S_MID * sb.s}px ${S_H * sb.s}px`,
          transform: `${shaqIn.transform} perspective(1400px) rotateY(${(-17 * turn).toFixed(2)}deg) rotate(${(1.3 * nudge).toFixed(3)}deg) scale(${(1 + breathe).toFixed(4)})`,
        }}
      >
        <Img
          src={SHAQ}
          style={{
            width: "100%",
            height: "100%",
            WebkitMaskImage: "linear-gradient(to bottom, #000 80%, rgba(0,0,0,0) 86%)",
            maskImage: "linear-gradient(to bottom, #000 80%, rgba(0,0,0,0) 86%)",
          }}
        />
      </div>

      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* the line of the shot through elbow, ball and ring */}
        {lineDraw > 0 && lineGone < 1 && (
          <g opacity={(1 - lineGone) * 0.95}>
            <path d={`M${low.x.toFixed(1)},${low.y.toFixed(1)} L${ball.x.toFixed(1)},${ball.y.toFixed(1)} L${lerp(ball.x, ringA.x, lineDraw).toFixed(1)},${lerp(ball.y, ringA.y, lineDraw).toFixed(1)}`} fill="none" stroke="#FFFFFF" strokeWidth={2} />
            <circle cx={low.x} cy={low.y} r={6} fill="none" stroke="#FFFFFF" strokeWidth={2} />
          </g>
        )}
        {/* "him.": the arc of the shot */}
        {shotK > 0 && shotGone < 1 && (
          <g opacity={1 - shotGone}>
            <path d={trace(shotP, 0, shotK)} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
            {shotK < 1 && <circle cx={shotP(shotK).x} cy={shotP(shotK).y} r={9} fill="#FFFFFF" style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.9))" }} />}
          </g>
        )}
        {/* the copy, offered to Shaq from his knees, then snapping back off him */}
        {copyLen > 0.001 && <path d={trace(cpy, 0, Math.min(1, copyLen))} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.9} />}
        {burst > 0 && burst < 1 && (
          <g opacity={1 - burst} transform={`translate(${knee.x},${knee.y})`}>
            {[-150, -110, -70, -30].map((a) => (
              <line
                key={a}
                x1={Math.cos((a * Math.PI) / 180) * (16 + 20 * burst)}
                y1={Math.sin((a * Math.PI) / 180) * (16 + 20 * burst)}
                x2={Math.cos((a * Math.PI) / 180) * (30 + 40 * burst)}
                y2={Math.sin((a * Math.PI) / 180) * (30 + 40 * burst)}
                stroke="#FFFFFF"
                strokeWidth={4}
                strokeLinecap="round"
              />
            ))}
          </g>
        )}
        {/* the coach's hand */}
        <defs>
          <linearGradient id="gs-hand-fade" x1="0" y1="1370" x2="0" y2="1445" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#000000" />
          </linearGradient>
          <mask id="gs-hand-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
            <rect x={0} y={0} width={1080} height={1920} fill="url(#gs-hand-fade)" />
          </mask>
        </defs>
        {f >= t.coach - 12 && handOut < 1 && (
          <g mask="url(#gs-hand-mask)">
          <g transform={`translate(${tip.x.toFixed(1)},${tip.y.toFixed(1)}) rotate(${handRot.toFixed(2)}) translate(0,${handBack.toFixed(1)}) scale(${handScale.toFixed(4)})`} style={{ filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.55))" }}>
            <GrannyShotHand press={press} />
          </g>
          </g>
        )}
      </svg>
      {f >= t.coach && (
        <div style={{ position: "absolute", left: 40, top: 1050, fontFamily: UI, fontSize: 24, lineHeight: 1.3, color: GREY, opacity: prog(f, t.coach + 6, 8, ease.out) * (1 - handOut) }}>
          Ed Palubinskas
          <br />
          free throw coach
        </div>
      )}

      {/* the quote, stamped over Shaq */}
      {quoteScale > 0 && (
        <div style={{ position: "absolute", left: 540, top: 1090, transform: `scale(${(quoteScale * holdPush).toFixed(4)}) rotate(${lerp(-7, -2.5, slam).toFixed(2)}deg)`, opacity: prog(f, t.zero - 6, 2, ease.linear) }}>
          <GrannyShotQuote strike={strike} ink={0.96} />
        </div>
      )}

      {/* credits */}
      <div style={{ ...credit(shaqIn.opacity as number), left: 40 }}>
        Keith Allison, CC BY-SA 2.0{f >= t.coach - 12 && handOut < 1 ? " · hand: Evan-Amos, CC BY-SA 3.0" : ""}
      </div>
      {/* load the ink parts and the hand before their first frame */}
      {[...Object.values(GRANNYSHOT_INK).map((p) => p.src), GRANNYSHOT_HAND_SRC].map((src) => (
        <Img key={src} src={src} style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: 0 }} />
      ))}
      <div style={{ ...credit(cutIn * barryAlpha), right: 40, textAlign: "right" }}>Russ Reed, public domain</div>
    </AbsoluteFill>
  );
};
