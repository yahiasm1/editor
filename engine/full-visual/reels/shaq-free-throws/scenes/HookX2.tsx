// Hook B, "the coach's clipboard", 0-4.9 s: "Shaquille O'Neal was so unstoppable that teams started fouling him on purpose."
// Shaquille O'Neal: the real Lakers cut-out (Bigmoe797, 2000 Finals) stands on the free throw line, a light running
// down him, while a coach's dry-erase clipboard tilts up in the foreground and its marker draws five X's and his 34.
// so unstoppable: the drawn 34 drives up the lane and the X's peel off the board and tumble off stage; the real Shaq
// rocks forward a step, his shadow on the board; "+2" is scribbled at the rim. teams: the Mavericks, then the Spurs,
// clip onto the top of the board (clack, clack). started: the red marker's cap pops. fouling: one red line from a red
// X to the 34, ending in a hand, and a real hand grabs the real arm at that moment, red marks. him: the drawn hand
// drags the 34 back to the free throw line. on purpose: the board is slapped flat onto the floor, shake and dust, its
// print snaps onto the real court: FOUL HIM, circled twice, under his shoes; whistle and FOUL. The "+2" lifts off
// into the scorebug of `backwards`. Notes: notes/HookX2.md.
import React from "react";
import { Img, staticFile } from "remotion";
import { arrive, ease, mix, pop, prog, useScene } from "../../../src/engine";
import { HookX2Board, HookX2BoardPt, HookX2BoardPx, HookX2InkLayer, type HookX2Ink, type HookX2Logo } from "./HookX2Board";
import { HookX2Floor } from "./HookX2Floor";
import { HookX2Hand, HookX2Marker, HookX2Whistle } from "./HookX2Parts";
import { hookX2Arc, hookX2Board, hookX2P, hookX2Rnd, hookX2Word, hookX2WordW, hookX2Shaq, hookX2SetCam, HookX2CAM, HookX2GLYPH, type HookX2Pose } from "./HookX2World";

const A = (n: string) => staticFile(`shaq-free-throws/${n}`);
const RED = "#E5383B";
const INK = "#15171A";
// the defence the 34 drives through: a 2-3 zone (court feet, b from the baseline)
const HookX2XS: [number, number][] = [[-4.2, 17.6], [4.4, 17.2], [-7, 9.6], [7.2, 9.2], [0.4, 8.0]];
const START: [number, number] = [0, 24.5];
const RIM: [number, number] = [0, 7.6];
const LINE: [number, number] = [0, 19.4];
const REDX: [number, number] = [-12, 13.4];

/** an X in marker: two strokes */
const xStrokes = (u: number, b: number, s = 2.6): [number, number][][] => [
  [[u - s / 2, b - s / 2], [u + s / 2, b + s / 2]],
  [[u + s / 2, b - s / 2], [u - s / 2, b + s / 2]],
];

function useHookX2Times() {
  const { cue, scene } = useScene();
  return {
    shaq: cue("Shaquille"), oneal: cue("O'Neal"), was: cue("was"), so: cue("so"), un: cue("unstoppable"), teams: cue("teams"),
    started: cue("started"), fouling: cue("fouling"), him: cue("him"), on: cue("on"), purpose: cue("purpose"), end: scene.to,
  };
}

export const HookX2: React.FC = () => {
  const { f, theme } = useScene();
  const T = useHookX2Times();
  // the payoff holds, then in the silence the camera dollies onto the court `backwards` opens on
  const dolly = prog(f, T.end - 22, 14, ease.inOut);
  hookX2SetCam(dolly);
  const away = prog(f, T.end - 18, 11, ease.in); // everything that is not the court leaves as the camera goes

  // ---- the clipboard's pose: it tilts up, jolts on each clack, is slapped flat, then its print snaps onto the court
  const clack = (at: number) => (f < at ? 0 : -3.2 * Math.exp(-(f - at) / 4) * Math.cos((f - at) * 0.9));
  const slamAt = T.purpose - 11;
  const up = 40 + 44 * arrive(f, -5, 26);
  const fall = prog(f, slamAt, 11, ease.in);
  const bounce = f >= T.purpose ? 4 * Math.exp(-(f - T.purpose) / 3) * Math.abs(Math.sin((f - T.purpose) * 0.7)) : 0;
  const theta = Math.max(0, (up + clack(T.teams) + clack(T.teams + 18)) * (1 - fall)) + (f >= T.purpose ? bounce : 0);
  const snap = prog(f, T.purpose + 3, 14, ease.inOut);
  const pose: HookX2Pose = { yh: 18.16, theta, snap, dx: 0 };
  const flatPose: HookX2Pose = { ...pose, theta: 0, snap: 1 };
  const landed = f >= T.purpose;

  // ---- the drawn 34: circled on "O'Neal", drives to the rim on "so unstoppable", dragged back to the line on "him"
  const drive = prog(f, T.so, 20, ease.inOut);
  const drag = prog(f, T.him + 2, 20, ease.inOut);
  const c34: [number, number] = [
    0,
    START[1] + (RIM[1] - START[1]) * drive + (LINE[1] - RIM[1]) * drag,
  ];
  const R34 = 3.1;
  const circle = hookX2Arc(0, 0, R34, -Math.PI / 2 - 0.3, Math.PI * 1.55, 30);
  const digits = hookX2Word("34", -1.55, -1.45, 2.9, 0.12, -0.1, 3);

  // ink, in drawing order
  const ink: HookX2Ink[] = [];
  const wk = (w: number) => w * (1 - 0.72 * snap);
  HookX2XS.forEach(([u, b], i) => {
    const at = -10 + i * 6;
    const passAt = T.so + Math.round(20 * Math.min(1, Math.max(0, (START[1] - b + 1) / (START[1] - RIM[1]))));
    const peeled = f >= passAt;
    xStrokes(u, b).forEach((s, j) => ink.push({ pts: s, k: peeled ? 0 : prog(f, at + j * 3, 3, ease.linear), color: INK, w: wk(0.62) }));
    // the ghost the marker leaves when the X is ripped off the face
    if (peeled) xStrokes(u, b, 3.0).forEach((s) => ink.push({ pts: s, k: 1, color: "#9AA1AA", w: wk(1.1), o: 0.35 * (1 - prog(f, passAt + 30, 40)) }));
  });
  // the coach's arrow, drawn on "was": straight up the lane from the 34 to the rim; the 34 then runs it
  const arrowK = prog(f, T.was - 2, 12, ease.inOut);
  ink.push({ pts: [[0.2, START[1] - R34 - 0.4], [-0.3, 15], [0.1, RIM[1] + R34 + 0.5]], k: arrowK, color: INK, w: wk(0.42), o: 1 - 0.7 * drag });
  [[-1.3, 1.6], [1.4, 1.5]].forEach(([du, db], j) =>
    ink.push({ pts: [[0.1 + du, RIM[1] + R34 + 0.5 + db], [0.1, RIM[1] + R34 + 0.5]], k: prog(f, T.was + 9 + j * 2, 3, ease.linear), color: INK, w: wk(0.42), o: 1 - 0.7 * drag }),
  );
  ink.push({ pts: circle, k: prog(f, T.oneal - 2, 12, ease.inOut), color: INK, w: wk(0.62), dx: c34[0], db: c34[1] });
  digits.forEach((s, i) => ink.push({ pts: s, k: prog(f, T.oneal + 6 + i * 3, 5, ease.linear), color: INK, w: wk(0.56), dx: c34[0], db: c34[1] }));
  // "+2" at the rim, the dunk that never came
  const plus2 = hookX2Word("+2", 2.5, 1.4, 3.0, 0.1, -0.12, 9);
  const plus2Lift = prog(f, T.end - 26, 16, ease.inOut);
  plus2.forEach((s, i) => ink.push({ pts: s, k: prog(f, T.un + 9 + i * 4, 5, ease.linear), color: INK, w: wk(0.62), o: f >= T.end - 26 ? 0 : 1 }));
  // the red play: an X, one line straight to the 34, a grabbing hand
  xStrokes(REDX[0], REDX[1], 2.8).forEach((s, j) => ink.push({ pts: s, k: prog(f, T.fouling - 13 + j * 4, 4, ease.linear), color: RED, w: wk(0.7) }));
  const dirx = c34[0] - REDX[0], dirb = c34[1] - REDX[1];
  const dl = Math.hypot(dirx, dirb);
  const ux = dirx / dl, ub = dirb / dl;
  const lineEnd: [number, number] = [c34[0] - ux * (R34 + 0.6), c34[1] - ub * (R34 + 0.6)];
  const lineK = prog(f, T.fouling, 11, ease.in);
  ink.push({ pts: [[REDX[0] + ux * 2, REDX[1] + ub * 2], lineEnd], k: lineK, color: RED, w: wk(0.7) });
  // the hand at the end of the line: a palm and four fingers hooked round the 34
  const nx = -ub, nb = ux;
  const handK = prog(f, T.fouling + 10, 8, ease.linear);
  [-1.5, -0.5, 0.5, 1.5].forEach((o, i) => {
    const base: [number, number] = [lineEnd[0] + nx * o * 0.9, lineEnd[1] + nb * o * 0.9];
    const tip: [number, number] = [c34[0] - ux * (R34 - 1.6) + nx * o * 1.35, c34[1] - ub * (R34 - 1.6) + nb * o * 1.35];
    const knuck: [number, number] = [base[0] + ux * 1.6 + nx * o * 0.25, base[1] + ub * 1.6 + nb * o * 0.25];
    ink.push({ pts: [base, knuck, tip], k: prog(f, T.fouling + 10 + i * 2, 4, ease.linear), color: RED, w: wk(0.55) });
  });
  ink.push({ pts: [[lineEnd[0] + nx * 1.9, lineEnd[1] + nb * 1.9], [lineEnd[0] - ux * 0.8 + nx * 2.4, lineEnd[1] - ub * 0.8 + nb * 2.4], [lineEnd[0] - ux * 1.2 + nx * 1.2, lineEnd[1] - ub * 1.2 + nb * 1.2]], k: handK, color: RED, w: wk(0.55) });
  // FOUL HIM, written under his shoes once the play is the floor, circled twice
  const FW = 0.95;
  const fwW = hookX2WordW("FOUL HIM", 0.2) * FW;
  const fwB = 20.0;
  const foulWords = hookX2Word("FOUL HIM", -fwW / 2, fwB, FW, 0.2, -0.14, 5);
  foulWords.forEach((s, i) => ink.push({ pts: s, k: prog(f, T.purpose + 8 + i * 1.2, 3, ease.linear), color: RED, w: 0.17 }));
  const ring = (r: number, sk: number, a0: number) =>
    Array.from({ length: 41 }, (_, i) => {
      const a = a0 + (i / 40) * Math.PI * 2.1;
      return [0.15 + (fwW / 2 + 1.5 + r) * Math.cos(a), fwB + FW / 2 + (FW / 2 + 0.75 + r * 0.45) * Math.sin(a) + sk * Math.cos(a)] as [number, number];
    });
  ink.push({ pts: ring(0, 0.18, 3.0), k: prog(f, T.purpose + 17, 9, ease.inOut), color: RED, w: 0.14 });
  ink.push({ pts: ring(0.5, -0.15, 3.5), k: prog(f, T.purpose + 24, 9, ease.inOut), color: RED, w: 0.14 });

  // the black play fades as the board becomes the floor, the red line settles back: FOUL HIM is what reads under him
  const blackFade = 1 - prog(f, T.purpose + 3, 12, ease.linear);
  const redSettle = 1 - 0.6 * prog(f, T.purpose + 8, 14, ease.linear);
  ink.forEach((s) => {
    if (s.color === INK && !plus2.includes(s.pts)) s.o = (s.o ?? 1) * blackFade;
    if (s.color === RED && !foulWords.includes(s.pts) && s.w !== 0.14) s.o = (s.o ?? 1) * redSettle;
  });

  // ---- the logos, clipped on with a clack each
  const logos: HookX2Logo[] = [
    { src: "hookx2-mavs.svg", u: -17.5, b: 0.6, size: 7.2, drop: prog(f, T.teams - 7, 7, ease.in) },
    { src: "hookx2-spurs.svg", u: 17.5, b: 0.6, size: 7.2, drop: prog(f, T.teams + 11, 7, ease.in) },
  ];

  // ---- Shaq: stands huge, rocks forward a step on "unstoppable", the hand on his arm on "fouling"
  const sh = hookX2Shaq();
  const [, feetY] = hookX2P(0, 14.3, 0);
  const rock = prog(f, T.un - 6, 9, ease.out) - 0.55 * prog(f, T.un + 6, 26, ease.inOut);
  const yank = f >= T.fouling + 4 ? Math.exp(-(f - T.fouling - 4) / 8) * Math.sin((f - T.fouling - 4) * 0.5) : 0;
  const shaqX = 540 + 40 * rock - 10 * yank;
  const shaqRot = 4 * rock - 1.4 * yank;
  const push = 1 + 0.03 * prog(f, 0, 260, ease.linear) * (1 - dolly);
  const shake = landed ? 16 * Math.exp(-(f - T.purpose) / 6) : 0;
  const shX = shake * Math.sin((f - T.purpose) * 2.1);
  const shY = shake * Math.cos((f - T.purpose) * 2.7) * 0.8;

  const shaqLayer = (
    <div style={{ position: "absolute", left: shaqX - sh.feetX * sh.w, top: feetY - sh.h, width: sh.w, height: sh.h, transformOrigin: `${sh.feetX * 100}% 100%`, transform: `rotate(${shaqRot.toFixed(2)}deg)` }}>
      <Img src={A("hookx2-shaq-lakers.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "drop-shadow(0 0 1px rgba(0,0,0,0.5))" }} />
      {/* the key light running down him on his name */}
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `url(${A("hookx2-shaq-lakers.png")})`, WebkitMaskSize: "100% 100%", background: `linear-gradient(180deg, transparent ${(prog(f, -6, 44, ease.inOut) * 130 - 30).toFixed(1)}%, rgba(255,240,215,0.42) ${(prog(f, -6, 44, ease.inOut) * 130 - 18).toFixed(1)}%, transparent ${(prog(f, -6, 44, ease.inOut) * 130 - 6).toFixed(1)}%)`, mixBlendMode: "screen" }} />
    </div>
  );
  const reflection = (
    <div style={{ position: "absolute", left: shaqX - sh.feetX * sh.w, top: feetY - 6, width: sh.w, height: sh.h, transformOrigin: "50% 0%", transform: "scaleY(-0.62)", opacity: 0.16, filter: "blur(3px)", WebkitMaskImage: "linear-gradient(0deg, transparent 55%, black 100%)" }}>
      <Img src={A("hookx2-shaq-lakers.png")} style={{ width: "100%", height: "100%" }} />
    </div>
  );

  // ---- the X's ripped off the board, tumbling off stage as smudged marker shapes
  const peels = HookX2XS.map(([u, b], i) => {
    const passAt = T.so + Math.round(20 * Math.min(1, Math.max(0, (START[1] - b + 1) / (START[1] - RIM[1]))));
    if (f < passAt || f > passAt + 50) return null;
    const t = f - passAt;
    const c = HookX2BoardPt(pose, u, b);
    const size = HookX2BoardPx(pose, u, b, 2.6);
    const side = u === 0.4 ? 1 : Math.sign(u);
    const vx = side * (9 + 6 * hookX2Rnd(i, 61));
    const x = c[0] + vx * t + side * 0.04 * t * t;
    const y = c[1] - 14 * t + 0.95 * t * t;
    const s = 1 + 0.035 * t;
    const rot = side * (11 + 5 * hookX2Rnd(i, 62)) * t;
    const lean = Math.min(1, t / 6);
    return (
      <svg key={i} width={size * 3} height={size * 3} style={{ position: "absolute", left: x - size * 1.5, top: y - size * 1.5, overflow: "visible", transform: `rotate(${rot.toFixed(1)}deg) scale(${s.toFixed(3)}) skewX(${(side * 14 * lean).toFixed(1)}deg)`, filter: `blur(${Math.min(2.4, t * 0.1).toFixed(2)}px) drop-shadow(0 ${(4 + t * 0.4).toFixed(1)}px 6px rgba(0,0,0,0.5))` }}>
        <g stroke={INK} strokeWidth={size * 0.22} strokeLinecap="round" fill="none" opacity={0.95}>
          <path d={`M${size},${size} L${size * 2},${size * 2}`} />
          <path d={`M${size * 2},${size} L${size},${size * 2}`} />
        </g>
        {/* the smear where it tore: a thinner, lighter drag of ink */}
        <path d={`M${size * 0.9},${size * 1.2} Q${size * 1.5},${size * 1.35} ${size * 2.1},${size * 1.1}`} stroke="#4A4F57" strokeWidth={size * 0.12} strokeLinecap="round" fill="none" opacity={0.5} />
      </svg>
    );
  });

  // ---- markers: black draws the defence and the 34 then the +2; red pops its cap and draws the foul
  const strokeTip = (pts: [number, number][], k: number, dx = 0, db = 0) => {
    const n = Math.max(0, Math.min(pts.length - 1, Math.round(k * (pts.length - 1))));
    const p = pts[n];
    return HookX2BoardPt(pose, p[0] + dx, p[1] + db);
  };
  let blackTip: [number, number, number] | null = null;
  if (f < T.oneal + 22) {
    const i = Math.min(4, Math.max(0, Math.floor((f + 10) / 6)));
    const [u, b] = HookX2XS[i];
    const j = (f + 10) % 6 < 3 ? 0 : 1;
    const s = xStrokes(u, b)[j];
    blackTip = f < T.oneal - 2 ? strokeTip(s, (((f + 10) % 3) + 1) / 3) : f < T.oneal + 6 ? strokeTip(circle, prog(f, T.oneal - 2, 12, ease.inOut), c34[0], c34[1]) : strokeTip(digits[Math.min(digits.length - 1, Math.floor((f - T.oneal - 6) / 3))], 1, c34[0], c34[1]);
  } else if (f >= T.un + 4 && f < T.un + 26) {
    const i = Math.min(plus2.length - 1, Math.floor((f - T.un - 9) / 4));
    blackTip = strokeTip(plus2[Math.max(0, i)], f < T.un + 9 ? 0 : prog(f, T.un + 9 + Math.max(0, i) * 4, 5, ease.linear));
  }
  const blackIn = Math.min(prog(f, -20, 1), 1 - prog(f, T.oneal + 18, 8, ease.in)) + (f >= T.un ? prog(f, T.un + 2, 6) * (1 - prog(f, T.un + 24, 8, ease.in)) : 0);
  let redTip: [number, number] = [1180, 1180];
  if (f >= T.fouling - 13 && f < T.fouling) {
    const s = xStrokes(REDX[0], REDX[1], 2.8)[f < T.fouling - 9 ? 0 : 1];
    const q = strokeTip(s, f < T.fouling - 9 ? prog(f, T.fouling - 13, 4, ease.linear) : prog(f, T.fouling - 9, 4, ease.linear));
    redTip = [q[0], q[1]];
  } else if (f >= T.fouling && f < T.fouling + 18) {
    const q = HookX2BoardPt(pose, REDX[0] + (lineEnd[0] - REDX[0]) * lineK, REDX[1] + (lineEnd[1] - REDX[1]) * lineK);
    redTip = [q[0], q[1]];
  } else if (f >= T.fouling + 18) {
    const q = HookX2BoardPt(pose, lineEnd[0], lineEnd[1]);
    redTip = [q[0], q[1]];
  }
  const redEnter = arrive(f, T.teams - 2, 16);
  const redGone = prog(f, slamAt - 3, 9, ease.in);
  const redPos: [number, number] = f < T.fouling - 13 ? [1160 + (700 - 1160) * redEnter, 1240 - 140 * redEnter] : redTip;
  const redFly: [number, number] = [redPos[0] + 520 * redGone, redPos[1] - 700 * redGone];

  // the floor ink takes over once the board lies flat
  const floorPose = landed ? pose : flatPose;

  // ---- the +2 leaving for the scorebug of `backwards`, countering the stage's lift so it travels on its own
  const liftAt = T.end - 7;
  const liftP = prog(f, liftAt, 11, (t) => (Math.exp(Math.log(1.45) * 11 * t) - 1) / (Math.exp(Math.log(1.45) * 11) - 1));
  const plusFrom = HookX2BoardPt(flatPose, 4.5, 2.9);
  const plusTo: [number, number] = [664, 763]; // its "2" on the "2" of LAL 52 in the scorebug that replaces this frame
  const px = plusFrom[0] + (plusTo[0] - plusFrom[0]) * plus2Lift;
  const py = plusFrom[1] + (plusTo[1] - plusFrom[1]) * plus2Lift - 120 * Math.sin(Math.PI * plus2Lift);
  
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "540px 1050px", transform: `translate(${shX.toFixed(1)}px, ${shY.toFixed(1)}px) scale(${push.toFixed(4)})` }}>
        <HookX2Floor f={f} handover={dolly} />
        {landed && away < 1 && (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - away }}>
            <HookX2InkLayer pose={floorPose} ink={ink} id="hx2-floor" streak={false} />
          </div>
        )}
        {landed && <HookX2Board pose={pose} f={f} ink={[]} logos={logos} logoSrc={A} frameO={1 - prog(f, T.purpose + 2, 6)} faceO={1 - prog(f, T.purpose + 3, 5)} printO={1 - prog(f, T.purpose + 13, 8)} gloss={1} shadow={0} shadowX={0} shaqSrc={A("hookx2-shaq-lakers.png")} />}
        {/* contact shadow and the floor's gloss reflection; Shaq and the grab, gone as the camera leaves */}
        <div style={{ position: "absolute", inset: 0, opacity: 1 - away, filter: away > 0 ? `blur(${(8 * away).toFixed(1)}px)` : undefined }}>
        <div style={{ position: "absolute", left: shaqX - 150, top: feetY - 22, width: 300, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.75), rgba(0,0,0,0.3) 45%, transparent 72%)" }} />
        {landed && reflection}
        {shaqLayer}
        <HookX2Hand f={f} at={T.fouling - 2} shaqX={shaqX} feetY={feetY} red={RED} />
        </div>
        {!landed && (
          <div style={{ position: "absolute", inset: 0, filter: f >= slamAt + 3 ? `blur(${(2 + 5 * fall).toFixed(1)}px)` : undefined }}>
          <HookX2Board pose={pose} f={f} ink={ink} logos={logos} logoSrc={A} frameO={1} printO={1} faceO={1} gloss={prog(f, 4, 60, ease.inOut)} shadow={prog(f, T.un - 6, 10) * (1 - 0.4 * prog(f, T.un + 10, 30))} shadowX={-4 + 6 * rock} shaqSrc={A("hookx2-shaq-lakers.png")} />
          </div>
        )}
        {peels}
        {/* dust off the boards on the slam */}
        {landed && f < T.purpose + 30 && Array.from({ length: 46 }, (_, i) => {
          const t = f - T.purpose;
          const edge = i % 3;
          const along = hookX2Rnd(i, 71) * 2 - 1;
          const src = edge === 0 ? HookX2BoardPt(flatPose, along * 26, -1.8) : HookX2BoardPt(flatPose, (edge === 1 ? -26.8 : 26.8), -1.8 + hookX2Rnd(i, 72) * 30);
          const vx = (edge === 0 ? along * 3 : edge === 1 ? -5 : 5) * (0.6 + hookX2Rnd(i, 73));
          const vy = -(2.5 + 4 * hookX2Rnd(i, 74));
          const x = src[0] + vx * t * Math.exp(-t / 30) * 2;
          const y = src[1] + vy * t * Math.exp(-t / 22) * 1.6;
          const r = 3 + 9 * hookX2Rnd(i, 75) + t * 0.3;
          return <div key={i} style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: "rgba(236,214,182,0.8)", opacity: (1 - t / 30) * 0.85, filter: "blur(2.5px)" }} />;
        })}
        {landed && f < T.purpose + 20 && (
          <div style={{ position: "absolute", left: 60, top: 1250, width: 960, height: 150, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,235,205,0.35), transparent 65%)", opacity: 1 - (f - T.purpose) / 20, transform: `scaleX(${(1 + (f - T.purpose) * 0.03).toFixed(3)})` }} />
        )}
        {/* the markers */}
        {blackTip && blackIn > 0.01 && <HookX2Marker x={blackTip[0]} y={blackTip[1]} color={INK} angle={-38} o={Math.min(1, blackIn)} cap={false} />}
        {f >= T.teams - 4 && redGone < 1 && (
          <HookX2Marker x={redFly[0]} y={redFly[1]} color={RED} angle={28 - 60 * redGone} o={1} cap={f < T.started} capFly={f >= T.started ? f - T.started : -1} />
        )}
      </div>

      {/* whistle and FOUL, the call, on "purpose" */}
      {f >= T.purpose + 1 && away < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - away, filter: away > 0 ? `blur(${(8 * away).toFixed(1)}px)` : undefined }}>
          <div style={{ position: "absolute", left: 700, top: 556, ...pop(f, T.purpose + 1, { dur: 9, from: 0.3 }) }}>
            <HookX2Whistle f={f - T.purpose} />
          </div>
          <div style={{ position: "absolute", left: 52, top: 640, transform: "rotate(-6deg)" }}>
            <div style={{ ...pop(f, T.purpose + 4, { dur: 9, from: 0.4 }), padding: "10px 26px 12px", borderRadius: 14, background: RED, color: "#fff", fontFamily: theme.font.caption, fontWeight: 900, fontSize: 64, letterSpacing: 2, boxShadow: "0 14px 30px rgba(0,0,0,0.55), inset 0 -4px 0 rgba(0,0,0,0.18)" }}>FOUL</div>
          </div>
        </div>
      )}

      {/* the +2, lifted off the floor: it stands up and flies into the scoreboard of the next scene */}
      {plus2Lift > 0 && f < liftAt + 7 && (
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(2000 * liftP).toFixed(1)}px)` }}>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - prog(f, liftAt + 2, 5, ease.linear) }}>
            {(() => {
              const size = 34 + 38 * plus2Lift;
              const w = (HookX2GLYPH["+"].w + 0.1 + HookX2GLYPH["2"].w) * size;
              const col = mix(f, T.end - 26, 10, INK, "#FFFFFF");
              return hookX2Word("+2", 0, 0, 1, 0.1, -0.12, 9).map((st, i) => (
                <path key={i} d={st.map(([u, b], k) => `${k ? "L" : "M"}${(px - w / 2 + u * size).toFixed(1)},${(py - size / 2 + b * size).toFixed(1)}`).join("")} stroke={col} strokeWidth={size * 0.13} strokeLinecap="round" strokeLinejoin="round" fill="none" />
              ));
            })()}
          </svg>
        </div>
      )}

      {/* credits */}
      <div style={{ position: "absolute", right: 40, top: 528, opacity: 1 - away, fontFamily: theme.font.ui, fontSize: 20, lineHeight: "26px", color: "#8B949E", textAlign: "right", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
        <div>Shaq: Bigmoe797, CC BY-SA 4.0</div>
        {f >= T.fouling - 4 && <div>Hand: Evan-Amos, CC BY-SA 3.0</div>}
      </div>
    </div>
  );
};

export { hookX2Board };
