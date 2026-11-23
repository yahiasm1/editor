// `extra`: "Wemby got fifty. Those fourteen extra points are the real story."
// The court from `average` (his 31.64 chances on his own spots, each grey to the league's 57.5 %) sinks and dims;
// the Portland photo of Wemby rises big in front of it, in the creator's card (Spurs logo top left, credit top
// right), and the "36" of the league equation flies into the card's foot. "50": every disc is topped up with white to
// his 79 % over its grey, in game order, and the number rolls 36 -> 50 (31.64 x 2 x .790). "14": the white bands lift
// off all the discs at once as thin wafers, stream up beside the photo and pile into one stack of point layers, the
// count climbing to 13.6 and written "+14". "story": the stack settles, the card reads 36 + 14, a slow push in holds.
// Parts: FourteenExtraWorld (camera, shots), FourteenExtraFloor (court, basket), FourteenExtraDisc (the chance, with
// his white on top of the league's grey), FourteenExtraWafer (the lifted band, and the stack).
import React from "react";
import { Img, staticFile } from "remotion";
import { LEAD } from "../../../src/engine/Stage";
import { blurIn, countTo, ease, pop, prog, useScene } from "../../../src/engine";
import { FourteenExtraFloor } from "./FourteenExtraFloor";
import { FourteenExtraDisc, type FourteenExtraMap } from "./FourteenExtraDisc";
import { FourteenExtraWafer } from "./FourteenExtraWafer";
import {
  FX_FT_A0,
  FX_FT_A1,
  FX_FT_MADE,
  FX_FT_X,
  FX_FTL,
  FX_H,
  FX_R,
  FX_REST,
  FX_SHOTS,
  fourteenExtraBasis,
  fourteenExtraProject as proj,
  fxLerp as lerp,
  fxLerp3 as lerp3,
  fxRnd as rnd,
  type FourteenExtraCam,
  type FourteenExtraV3,
} from "./FourteenExtraWorld";

const PI = Math.PI;
const LABEL = "#8B949E";
const SOFT = "#C9D1D9";
const LEAGUE = 0.575; // grey: 2 x .575 = 1.15 points of 2
const HIS = 0.79; // white to his .790: 1.58 points of 2
const BAND = HIS - LEAGUE; // the extra, as a share of a disc's depth
const PT = FX_H / 2; // one point is half a disc's depth (a made two fills it)
const SHOT_PTS = 2 * BAND; // 0.43 extra points a chance
const FT_PTS = 0.44 * SHOT_PTS; // 0.19 a free throw
const TOTAL = 29 * SHOT_PTS + 6 * FT_PTS; // 13.6

// the photo card, as in the creator's first post
const CARD = { x: 60, y: 548, w: 480, h: 604 };
// the stack of his extra points, beside the card
const COL_X = 802;
const COL_Y = 1128;
const COL_S = 190;
const EL = 0.62;
const SIN_E = Math.sin(EL);
const COS_E = Math.cos(EL);

// the camera: where `average` left it, then sunk low under the card
const KC = { eye: [-60, 27, 56] as FourteenExtraV3, at: [-5, 14, 0] as FourteenExtraV3, F: 1575, cx: 540, cy: 1180 };
const KD = { eye: [-58, 30, 50] as FourteenExtraV3, at: [0, 10, 0] as FourteenExtraV3, F: 1380, cx: 700, cy: 1300 };
// KE is exactly where `where` (ShotChartHero) picks the court up, so the handover shows one court, not two
const KE = { eye: [-59, 30, 49] as FourteenExtraV3, at: [-3, 14, 0] as FourteenExtraV3, F: 1165, cx: 560, cy: 1344 };

// his 29 shots and 6 free throws in game order (Basketball-Reference play-by-play): the order the white pours in
type Item = { kind: "shot"; i: number } | { kind: "ft"; j: number };
const ORDER: Item[] = (() => {
  const after: Record<number, number[]> = { 1: [0, 1], 8: [2], 10: [3, 4], 14: [5] };
  const out: Item[] = [];
  for (let i = 0; i < 29; i++) {
    out.push({ kind: "shot", i });
    for (const j of after[i] ?? []) out.push({ kind: "ft", j });
  }
  return out;
})();

/** the stack's own view: feet to screen, like the column `attempts` built */
const fourteenExtraStackMap = (z0: number, wob = 0): FourteenExtraMap => (u, v, w) => {
  const W = z0 + w;
  return [COL_X + COL_S * v + wob * W * COL_S * 0.08, COL_Y - COL_S * u * SIN_E - COL_S * W * COS_E];
};

const fourteenExtraCourtMap = (cam: FourteenExtraCam, B: ReturnType<typeof fourteenExtraBasis>, x: number, y: number, z: number, tilt = 0): FourteenExtraMap => (u, v, w) => {
  const v2 = v * Math.cos(tilt) - w * Math.sin(tilt);
  const w2 = v * Math.sin(tilt) + w * Math.cos(tilt);
  const p = proj(cam, x + u, y + v2, z + w2, B);
  return [p.x, p.y];
};

/** in flight: centre on a curve, the shape blending from the court's to the stack's */
const fourteenExtraFlightMap = (from: FourteenExtraMap, to: FourteenExtraMap, centre: [number, number], m: number): FourteenExtraMap => {
  const f0 = from(0, 0, 0);
  const t0 = to(0, 0, 0);
  return (u, v, w) => {
    const a = from(u, v, w);
    const b = to(u, v, w);
    return [centre[0] + lerp(a[0] - f0[0], b[0] - t0[0], m), centre[1] + lerp(a[1] - f0[1], b[1] - t0[1], m)];
  };
};

const bez = (a: [number, number], c: [number, number], b: [number, number], t: number): [number, number] => [
  (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
];
const smooth = (t: number) => t * t * (3 - 2 * t);

export const FourteenExtra: React.FC = () => {
  const { f, scene, cue, theme } = useScene();
  const s0 = scene.from - LEAD;
  const t = {
    wemby: cue("Wemby"),
    got: cue("got"),
    n50: cue("50."),
    those: cue("Those"),
    n14: cue("14"),
    extra: cue("extra"),
    points: cue("points"),
    real: cue("real"),
    story: cue("story."),
    end: scene.to,
  };
  const UI = theme.font.ui;
  const MONO = theme.font.mono;
  const BIG = theme.font.caption;

  // ---- the camera sinks; the court dims a step
  const sink = prog(f, s0, 40, ease.inOut);
  const push = prog(f, s0 + 40, t.end - s0 - 40, ease.linear);
  const camAt = (): FourteenExtraCam => {
    const c1 = { eye: lerp3(KC.eye, KD.eye, sink), at: lerp3(KC.at, KD.at, sink), F: lerp(KC.F, KD.F, sink), cx: lerp(KC.cx, KD.cx, sink), cy: lerp(KC.cy, KD.cy, sink) };
    return { eye: lerp3(c1.eye, KE.eye, push), at: lerp3(c1.at, KE.at, push), F: lerp(c1.F, KE.F, push), cx: lerp(c1.cx, KE.cx, push), cy: lerp(c1.cy, KE.cy, push) };
  };
  const cam = camAt();
  const B = fourteenExtraBasis(cam);
  const P = (x: number, y: number, z: number) => proj(cam, x, y, z, B);

  // ---- "50": his white poured on top of the grey, in game order, landing on the word
  const POUR0 = t.n50 - 14;
  const pourAt = (n: number) => POUR0 + Math.round(n * 0.42);
  const pourOf = (n: number) => prog(f, pourAt(n), 12, ease.out);

  // ---- "14": every band lifts at once, then streams into the stack
  const LIFT = t.n14 - 3;
  const lift = prog(f, LIFT, 9, ease.out);
  const flyAt = (n: number) => LIFT + 9 + Math.round(n * 1.05);
  const FLY = 22;
  const landAt = (n: number) => flyAt(n) + FLY;
  const ptsOf = (it: Item) => (it.kind === "shot" ? SHOT_PTS : FT_PTS);
  // where each wafer lands: on top of what landed before it
  const baseOf: number[] = [];
  {
    let acc = 0;
    ORDER.forEach((it, n) => {
      baseOf[n] = acc;
      acc += ptsOf(it);
    });
  }
  let stackPts = 0;
  ORDER.forEach((it, n) => {
    stackPts += ptsOf(it) * prog(f, landAt(n) - 2, 6, ease.out);
  });
  const allIn = landAt(ORDER.length - 1) + 4;
  const done = f >= allIn;

  const marks: React.ReactNode[] = [];
  const pulses: React.ReactNode[] = [];
  const shadows: React.ReactNode[] = [];
  const resting: { depth: number; node: React.ReactNode }[] = [];
  const lifted: React.ReactNode[] = [];
  const flying: { order: number; node: React.ReactNode }[] = [];

  const mark = (key: string, x: number, y: number, made: boolean, small = false) => {
    const c = P(x, y, 0);
    if (!c.ok) return;
    const s = (cam.F / c.z) * (small ? 0.3 : 0.36);
    marks.push(
      made ? (
        <ellipse key={key} cx={c.x} cy={c.y} rx={s} ry={s * 0.7} fill="#FFFFFF" opacity={0.85} stroke="#3A2A12" strokeWidth={1} />
      ) : (
        <path key={key} d={`M${c.x - s} ${c.y - s * 0.7}L${c.x + s} ${c.y + s * 0.7}M${c.x + s} ${c.y - s * 0.7}L${c.x - s} ${c.y + s * 0.7}`} stroke="#FFFFFF" strokeWidth={Math.max(2, s * 0.42)} strokeLinecap="round" opacity={0.85} />
      ),
    );
  };

  const piece = (key: string, n: number, x: number, y: number, rz: number, a0: number, a1: number, wedge: boolean) => {
    const po = pourOf(n);
    const gone = f >= flyAt(n) - 0 ? 1 : 0; // the band has left the disc
    const top = gone ? LEAGUE : LEAGUE + BAND * po;
    const glint = f >= pourAt(n) ? Math.sin(PI * prog(f, pourAt(n), 14, ease.linear)) : 0;
    const s = P(x + 0.06, y + 0.1, 0);
    if (s.ok) {
      const k2 = cam.F / s.z;
      shadows.push(<ellipse key={`s${key}`} cx={s.x} cy={s.y} rx={k2 * FX_R * 1.1} ry={k2 * FX_R * 0.75} fill="#2A1504" opacity={0.5} style={{ filter: "blur(3px)" }} />);
    }
    if (glint > 0 && f < pourAt(n) + 16) {
      const q = P(x, y, rz + FX_H);
      if (q.ok) {
        const ring = prog(f, pourAt(n), 16, ease.out);
        const rr = (cam.F / q.z) * FX_R * (1.1 + 1.6 * ring);
        pulses.push(<ellipse key={`p${key}`} cx={q.x} cy={q.y} rx={rr} ry={rr * 0.62} fill="none" stroke="#FFFFFF" strokeWidth={2.5} opacity={(1 - ring) * 0.9} />);
      }
    }
    const c = P(x, y, rz);
    resting.push({
      depth: (c.ok ? c.z : 0) - rz * 20,
      node: (
        <FourteenExtraDisc
          key={key}
          id={key}
          map={fourteenExtraCourtMap(cam, B, x, y, rz)}
          p={{ a0, a1, o: 1, fill: LEAGUE, grey: 1, top, topGlow: glint * 0.6 }}
          detail={wedge ? 1 : 0.8}
        />
      ),
    });

    // the band itself, once it has lifted off
    if (f < LIFT) return;
    const th = FX_H * BAND;
    const zLift = rz + FX_H * LEAGUE + lift * (0.55 + 0.25 * rnd(n + 5));
    const fromM = fourteenExtraCourtMap(cam, B, x, y, zLift);
    if (f < flyAt(n)) {
      lifted.push(<FourteenExtraWafer key={`w${key}`} map={fromM} a0={a0} a1={a1} th={th} glow={0.5 * (1 - lift)} detail={0.7} />);
      return;
    }
    const fl = prog(f, flyAt(n), FLY, ease.linear);
    if (fl >= 1) return;
    const toM = fourteenExtraStackMap(baseOf[n] * PT);
    const tumble = (rnd(n + 31) > 0.5 ? 1 : -1) * (0.6 + 0.6 * rnd(n + 13));
    const fromT = fourteenExtraCourtMap(cam, B, x, y, zLift, tumble * Math.sin(PI * fl) * 0.6);
    const c0 = fromT(0, 0, 0);
    const c1 = toM(0, 0, 0);
    const ctrl: [number, number] = [lerp(c0[0], c1[0], 0.3) - 60 + 120 * rnd(n + 7), Math.min(c0[1], c1[1]) - 120 - 160 * rnd(n + 3)];
    const ef = ease.inOut(fl);
    // a wedge turns whole as it lands: the stack is one solid of points
    const wa0 = lerp(a0, 0, wedge ? smooth(fl) : 0);
    const wa1 = lerp(a1, 2 * PI, wedge ? smooth(fl) : 0);
    flying.push({
      order: n,
      node: <FourteenExtraWafer key={`w${key}`} map={fourteenExtraFlightMap(fromT, toM, bez(c0, ctrl, c1, ef), Math.pow(smooth(fl), 2.2))} a0={wa0} a1={wa1} th={wedge ? th * lerp(1, 0.44, smooth(fl)) : th} detail={0.8} />,
    });
  };

  const orderOfShot: number[] = [];
  const orderOfFt: number[] = [];
  ORDER.forEach((it, n) => (it.kind === "shot" ? (orderOfShot[it.i] = n) : (orderOfFt[it.j] = n)));
  FX_SHOTS.forEach(([no, , , made], i) => {
    const r = FX_REST[i];
    mark(`m${no}`, r.x, r.y, !!made);
    piece(`fx-d${no}`, orderOfShot[i], r.x, r.y, r.z, 0, 2 * PI, false);
  });
  FX_FT_X.forEach((x, j) => {
    mark(`fm${j}`, x + 0.25, FX_FTL, !!FX_FT_MADE[j], true);
    piece(`fx-w${j}`, orderOfFt[j], x, FX_FTL, 0, FX_FT_A0, FX_FT_A1, true);
  });
  resting.sort((a, b) => b.depth - a.depth);
  flying.sort((a, b) => b.order - a.order);

  // ---- the stack: one white solid of points, a line at every whole point
  const stackIn = f >= flyAt(0) + FLY - 4;
  const settle = done ? Math.exp(-(f - allIn) / 9) * Math.sin((f - allIn) * 0.55) : 0;
  const storyBump = f >= t.story ? Math.exp(-(f - t.story) / 8) * Math.sin((f - t.story) * 0.6) : 0;
  const stackH = stackPts * PT;
  const seams = Array.from({ length: 14 }, (_, k) => (k + 1) * PT);
  const stackTopY = COL_Y - COL_S * stackH * COS_E - COL_S * FX_R * SIN_E;

  // ---- the numbers
  const travel = prog(f, s0 + 8, 26, ease.inOut);
  const num = f < t.n50 - 8 ? 36 : countTo(f, t.n50 - 8, 22, 36, 50);
  const numPop = f >= t.n50 - 8 ? 1 + 0.12 * Math.sin(PI * prog(f, t.n50 + 10, 14, ease.linear)) : 1;
  const eqOut = prog(f, s0 + 2, 12, ease.in);
  const cardIn = prog(f, scene.from, 26, ease.out);
  const cardPush = 1.02 + 0.07 * prog(f, s0 + 2, t.end - s0 - 2, ease.linear);
  const sweepX = -300 + 1100 * prog(f, t.story - 6, 40, ease.inOut);
  const story = prog(f, t.story - 2, 10, ease.out);
  const counter = done ? 13.6 : Math.min(13.6, stackPts);
  const round = prog(f, Math.max(allIn + 2, t.points + 8), 10, ease.inOut);

  // the "36" from the equation, flying into the foot of the card
  const N0 = { x: 724, y: 694, size: 58 };
  const N1 = { x: CARD.x + 30, y: CARD.y + CARD.h - 228, size: 176 };
  const nx = lerp(N0.x, N1.x, travel);
  const ny = lerp(N0.y, N1.y, travel) - Math.sin(PI * travel) * 60;
  const nsize = lerp(N0.size, N1.size, travel);

  // court mask: it sinks behind the card, never bare at the bottom of the stage
  const maskTop = lerp(790, 1010, sink);
  // the foot of the court tightens to the edge `where` starts on (1436-1468), so nothing jumps at the handover
  const maskFoot = lerp(1440, 1436, push);
  const maskEnd = lerp(1560, 1468, push);
  const MASK = `linear-gradient(to bottom, transparent ${maskTop}px, #000 ${maskTop + 90}px, #000 ${maskFoot}px, transparent ${maskEnd}px)`;

  return (
    <>
      {/* from the frame `where` is mounted it draws this same court on the same camera: stop drawing ours, so the lift-off never carries a second court */}
      <div style={{ position: "absolute", inset: 0, maskImage: MASK, WebkitMaskImage: MASK, opacity: f >= scene.to - LEAD ? 0 : 1 }}>
        <FourteenExtraFloor cam={cam} f={f} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {marks}
          {shadows}
          {resting.map((r) => r.node)}
          {pulses}
        </svg>
        {/* dimmed a step: the court is now the ground under the man */}
        <div style={{ position: "absolute", inset: 0, background: "#0D1117", opacity: 0.22 * sink }} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {lifted}
        </svg>
      </div>

      {/* what `average` left on screen, leaving */}
      {eqOut < 1 && (
        <div style={{ opacity: 1 - eqOut, filter: `blur(${(eqOut * 10).toFixed(1)}px)` }}>
          <div style={{ position: "absolute", left: 60, top: 548, fontFamily: MONO, fontWeight: 700, fontSize: 58, color: "#F0F3F6", whiteSpace: "pre" }}>
            29 + <span style={{ color: "#F2B33D" }}>0.44</span> × 6 = <span style={{ color: "#FFFFFF" }}>31.64</span>
          </div>
          <div style={{ position: "absolute", left: 62, top: 624, fontFamily: UI, fontWeight: 500, fontSize: 30, color: LABEL }}>the exact same shooting chances</div>
          <div style={{ position: "absolute", left: 60, top: 690, fontFamily: MONO, fontWeight: 700, fontSize: 58, color: "#F0F3F6", whiteSpace: "pre" }}>
            31.64 × 2 × <span style={{ color: "#AEB6C0" }}>.575</span> ≈ <span style={{ opacity: 0 }}>36</span>
          </div>
          <div style={{ position: "absolute", left: 62, top: 766, fontFamily: UI, fontWeight: 500, fontSize: 30, color: SOFT }}>points: same chances, league average shooting</div>
        </div>
      )}
      {f < s0 + 24 && (
        <div style={{ position: "absolute", left: 540, top: 1300, width: 510, height: 132, borderRadius: 16, background: "#161B22", border: "1px solid #30363D", opacity: 1 - prog(f, s0, 16, ease.in), transform: `translateY(${(160 * prog(f, s0, 18, ease.in)).toFixed(1)}px)` }}>
          <Img src={staticFile("wemby-50/leagueraterefill-logoman.svg")} style={{ position: "absolute", left: 21, top: 18, width: 70 }} />
          <div style={{ position: "absolute", left: 110, top: 10, fontFamily: UI, fontWeight: 700, fontSize: 32, color: SOFT }}>League Average</div>
          <div style={{ position: "absolute", left: 110, top: 50, fontFamily: UI, fontWeight: 500, fontSize: 24, color: LABEL }}>2026-27 · TS%</div>
          <div style={{ position: "absolute", left: 370, top: 22, width: 120, textAlign: "center", fontFamily: UI, fontWeight: 800, fontSize: 40, color: "#E6EDF3" }}>.575</div>
        </div>
      )}

      {/* the man who scored them: Portland, Commons, in the creator's card */}
      <div
        style={{
          position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 26, overflow: "hidden",
          background: "#161B22", border: "1px solid #30363D", boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          opacity: Math.min(1, cardIn * 3), transform: `translateY(${((1 - cardIn) * 420).toFixed(1)}px) scale(${(0.86 + 0.14 * cardIn).toFixed(4)})`, transformOrigin: "50% 100%",
          filter: cardIn < 1 ? `blur(${((1 - cardIn) * 8).toFixed(1)}px)` : undefined,
        }}
      >
        <Img src={staticFile("wemby-50/fourteenextra-wemby-portland.jpg")} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", transform: `scale(${cardPush.toFixed(4)})`, transformOrigin: "50% 28%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 16%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.78) 100%)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: sweepX, width: 160, background: "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0) 100%)" }} />
        <Img src={staticFile("wemby-50/fourteenextra-spurs.svg")} style={{ position: "absolute", left: 18, top: 16, width: 66, height: 66, ...pop(f, s0 + 16) }} />
        <div style={{ position: "absolute", right: 16, top: 14, fontFamily: UI, fontSize: 22, color: "rgba(230,232,236,0.85)", textShadow: "0 1px 3px rgba(0,0,0,0.8)", opacity: prog(f, s0 + 20, 10) }}>Frenchieinportland, CC BY 4.0</div>
        <div style={{ position: "absolute", left: 30, right: 20, bottom: 26, fontFamily: UI, fontWeight: 500, fontSize: 28, color: "#C9D1D9", textShadow: "0 1px 4px #000", whiteSpace: "nowrap" }}>
          {story > 0 ? (
            <span style={{ opacity: story }}>
              <span style={{ color: "#AEB6C0" }}>36 league rate</span> + <span style={{ color: "#FFFFFF", fontWeight: 800 }}>14 his own</span>
            </span>
          ) : f >= t.n50 - 4 ? (
            <span style={blurIn(f, t.n50 - 4, { dur: 8, rise: 6 })}>
              31.64 chances × 2 × <span style={{ color: "#FFFFFF", fontWeight: 700 }}>.790</span>
            </span>
          ) : null}
        </div>
      </div>

      {/* the number: 36 from the league line, rolling to his 50 */}
      <div
        style={{
          position: "absolute", left: nx, top: ny, fontFamily: travel < 0.5 ? MONO : BIG, fontWeight: travel < 0.5 ? 700 : 800, fontSize: nsize, lineHeight: 1,
          color: "#FFFFFF", letterSpacing: travel > 0.5 ? -4 : 0, fontVariantNumeric: "tabular-nums", textShadow: travel > 0.3 ? "0 6px 30px rgba(0,0,0,0.65)" : undefined,
          transform: `scale(${numPop.toFixed(3)})`, transformOrigin: "0% 80%",
        }}
      >
        {Math.round(num)}
      </div>

      {/* the white bands, lifted and flying, and the stack they build */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {stackIn && (
          <>
            <ellipse cx={COL_X + 14} cy={COL_Y + 10} rx={FX_R * COL_S * 1.2} ry={FX_R * COL_S * SIN_E * 1.05} fill="#000" opacity={0.55} style={{ filter: "blur(16px)" }} />
            <FourteenExtraWafer map={fourteenExtraStackMap(0, 0.6 * settle + 0.5 * storyBump)} th={Math.max(0.001, stackH)} seams={seams} glow={done ? 0.4 * Math.exp(-(f - allIn) / 10) : 0} detail={1.4} />
          </>
        )}
        {flying.map((w) => w.node)}
        {/* "story": his own 14, tied to the stack they came from */}
        {story > 0 && (
          <path
            d={`M${CARD.x + 412} ${CARD.y + CARD.h - 30}C${CARD.x + 520} ${CARD.y + CARD.h + 40} ${COL_X - 220} ${COL_Y + 70} ${COL_X - FX_R * COL_S + 6} ${COL_Y - 10}`}
            fill="none" stroke="#E6EDF3" strokeWidth={2.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(f, t.story, 16, ease.inOut)}
          />
        )}
      </svg>

      {/* "50": the same chances, topped up from the league's rate to his */}
      {f >= t.n50 - 12 && f < LIFT + 10 && (
        <div style={{ position: "absolute", left: 600, top: 640, width: 440, opacity: 1 - prog(f, LIFT, 10, ease.in), filter: `blur(${(8 * prog(f, LIFT, 10, ease.in)).toFixed(1)}px)` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 64, color: "#F0F3F6", whiteSpace: "pre", ...blurIn(f, t.n50 - 12, { dur: 8, rise: 10 }) }}>
            <span style={{ color: "#AEB6C0" }}>.575</span> → <span style={{ color: "#FFFFFF" }}>.790</span>
          </div>
          <div style={{ fontFamily: UI, fontWeight: 500, fontSize: 30, color: LABEL, marginTop: 8, ...blurIn(f, t.n50 - 4, { dur: 8, rise: 6 }) }}>
            league rate, then his, poured into the same 31.64 chances
          </div>
        </div>
      )}

      {/* the count of what landed, then +14 */}
      {f >= flyAt(0) + FLY - 6 && (
        <>
          <div
            style={{
              position: "absolute", left: COL_X - 260, width: 520, top: Math.min(stackTopY - 200, 690) , textAlign: "center", fontFamily: BIG, fontWeight: 800, fontSize: 132, lineHeight: 1,
              color: "#FFFFFF", fontVariantNumeric: "tabular-nums", letterSpacing: -3, ...blurIn(f, flyAt(0) + FLY - 6, { dur: 8 }),
              transform: `scale(${(1 + 0.16 * Math.sin(PI * round)).toFixed(3)})`,
            }}
          >
            {round >= 0.5 ? "+14" : `+${counter.toFixed(1)}`}
          </div>
          <div style={{ position: "absolute", left: COL_X - 260, width: 520, top: Math.min(stackTopY - 200, 690) + 142, textAlign: "center", fontFamily: UI, fontWeight: 500, fontSize: 30, color: LABEL, ...blurIn(f, flyAt(0) + FLY - 2, { dur: 8, rise: 6 }) }}>
            {round >= 0.5 ? (
              <>
                50 − 36.4 = <span style={{ color: "#E6EDF3" }}>13.6</span> extra points
              </>
            ) : (
              "one layer = 1 point"
            )}
          </div>
        </>
      )}
    </>
  );
};
