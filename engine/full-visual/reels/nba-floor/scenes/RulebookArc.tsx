// Scene `arc`: "The rulebook draws the arc twenty-three feet nine inches from the basket, but it also keeps the line
// three feet inside the sideline, so a shooter's feet still fit. That leaves twenty-two feet in the corner."
// The rule as the real official.nba.com page, then the rule doing its job on the real half court: the steel tape as
// a compass painting the 23'9" arc, the gold ghost ring carrying on to 15 in from the sideline, the two corner lines
// slamming down 3 ft inside (the reel's one big move), the sneakers' fit test, and the gold 21 in slivers.
// Notes: reels/nba-floor/notes/RulebookArc.md
import React, { useMemo } from "react";
import { Column, useScene, prog, arrive, ease } from "../../../src/engine";
import { RulebookArcFloor } from "./RulebookArcFloor";
import { RulebookArcTape } from "./RulebookArcTape";
import { RulebookArcShoes } from "./RulebookArcShoes";
import { RulebookArcCard } from "./RulebookArcCard";
import {
  RA_ARC, RA_BASE, RA_CORNER, RA_CORNER_CAM, RA_DOWN, RA_END, RA_LOW, RA_KINK_A, RA_KINK_Y, RA_LINE, RA_R, RA_SIDE,
  raArcPath, raCamMix, raClamp, raP, raRnd, raTransform, type RulebookArcCam,
} from "./RulebookArcWorld";

const GOLD = "#F2B33D";
const WHITE = "#F3F5F7";
const GREY = "#8B949E";
const HALF_PI = Math.PI / 2;
const RC = RA_R - RA_LINE / 2; // centre of the arc's paint

/** the old three-point line the scene starts from (painted by the earlier scenes) */
const RulebookArcOldLine: React.FC<{ o: number }> = ({ o }) =>
  o <= 0.001 ? null : (
    <g opacity={o}>
      <path d={raArcPath(0, 0, RC, RA_KINK_A, Math.PI - RA_KINK_A, 120)} fill="none" stroke={WHITE} strokeWidth={RA_LINE} />
      {[-1, 1].map((s) => (
        <line key={s} x1={s * (RA_CORNER - RA_LINE / 2)} y1={RA_BASE} x2={s * (RA_CORNER - RA_LINE / 2)} y2={RA_KINK_Y} stroke={WHITE} strokeWidth={RA_LINE} />
      ))}
    </g>
  );

/** the gold 21 in sliver: between the straight corner line and the 23'9" circle, baseline to the kink */
function rulebookArcSliver(side: 1 | -1, p: number) {
  if (p <= 0) return "";
  let d = "";
  const n = 40;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const y = RA_BASE + ((RA_KINK_Y - RA_BASE) * i) / n;
    const xc = Math.sqrt(RA_R * RA_R - y * y);
    pts.push(`${(side * (RA_CORNER + (xc - RA_CORNER) * p)).toFixed(4)} ${y.toFixed(4)}`);
  }
  d = `M${side * RA_CORNER} ${RA_BASE} L${pts.join(" L")} L${side * RA_CORNER} ${RA_KINK_Y} Z`;
  return d;
}

/** a dimension in world feet, drawn on screen: ticks at both ends, a label */
const RulebookArcDim: React.FC<{ cam: RulebookArcCam; x0: number; x1: number; y: number; label: string; o: number; labelX?: number; anchor?: "middle" | "end" | "start"; size?: number }> = ({ cam, x0, x1, y, label, o, labelX, anchor = "middle", size = 34 }) => {
  if (o <= 0.001) return null;
  const a = raP(cam, x0, y), b = raP(cam, x1, y);
  const lx = labelX ?? (a.x + b.x) / 2;
  const w = b.x - a.x;
  return (
    <g opacity={o}>
      <line x1={a.x} y1={a.y} x2={a.x + w * Math.min(1, o * 1.2)} y2={b.y} stroke={GREY} strokeWidth={2.5} />
      <line x1={a.x} y1={a.y - 11} x2={a.x} y2={a.y + 11} stroke={GREY} strokeWidth={2.5} />
      <line x1={b.x} y1={b.y - 11} x2={b.x} y2={b.y + 11} stroke={GREY} strokeWidth={2.5} opacity={o > 0.8 ? 1 : 0} />
      <text x={lx} y={a.y - 20} fill="#FFFFFF" fontFamily="Figtree, sans-serif" fontWeight={700} fontSize={size} textAnchor={anchor} style={{ paintOrder: "stroke" }} stroke="#0D1117" strokeWidth={6} strokeOpacity={0.55}>
        {label}
      </text>
    </g>
  );
};

export const RulebookArc: React.FC = () => {
  const { f, cue, scene } = useScene();

  const T = useMemo(() => {
    return {
      the: cue("The"), rule: cue("rulebook"), draws: cue("draws"), arc: cue("arc"), n23: cue("23"), feet1: cue("feet"), n9: cue("9"),
      basket: cue("basket,"), but: cue("but"), keeps: cue("keeps"), line: cue("line"), n3: cue("3"), feet2: cue("feet", 2), inside: cue("inside"),
      so: cue("so"), shooter: cue("shooter's"), feet3: cue("feet", 3), still: cue("still"), fit: cue("fit."), that: cue("That"), n22: cue("22"), corner: cue("corner."),
    };
  }, [cue]);

  // ---- camera: ARC FRAME, slid down under the page, back, down into the right corner, back up
  const t1 = arrive(f, T.the - 8, 22);
  const t2 = arrive(f, T.draws - 2, 22);
  const t3 = prog(f, T.so - 4, 32, ease.inOut);
  const t4 = prog(f, T.that - 6, 28, ease.inOut);
  let cam = raCamMix(RA_ARC, RA_DOWN, t1);
  cam = raCamMix(cam, RA_LOW, t2);
  cam = raCamMix(cam, RA_CORNER_CAM, t3);
  cam = raCamMix(cam, RA_END, t4);
  // a held picture keeps living: a slow push; the floor shudders once when the corner lines land
  const push = 1 + 0.018 * prog(f, scene.from, scene.to - scene.from, ease.linear);
  const k = f - T.n3;
  const shake = k >= 0 ? Math.exp(-k / 6) * Math.sin(k * 1.9) : 0;
  cam = { ...cam, ppf: cam.ppf * push, dy: cam.dy + 16 * shake, dx: cam.dx + 4 * shake };

  // ---- the old line fades: the rule is about to paint it again
  const oldLine = 1 - 0.94 * prog(f, T.the, 26, ease.inOut);
  const dim = 0.58 * (t1 - t2);

  // ---- the tape: theta from the rim-level axis, r the reading
  // mount: as the width scene leaves it, case on the right sideline at 25' 0"
  let theta = 0;
  let r = 25;
  const reelIn = prog(f, T.draws - 6, 20, ease.inOut);
  theta = HALF_PI * reelIn;
  r = 25 + (1.2 - 25) * reelIn;
  const payA = prog(f, T.draws + 14, T.n23 - (T.draws + 14), ease.out);
  const payB = prog(f, T.n9 - 10, 10, ease.out);
  if (f >= T.draws + 14) r = 1.2 + (23 - 1.2) * payA + 0.75 * payB;
  const sw1End = T.feet1 + 34;
  const sw1 = prog(f, T.feet1, sw1End - T.feet1, ease.inOut);
  const sw2 = prog(f, sw1End, T.basket - sw1End, ease.inOut);
  // first down the right side, then a whip over the top and down the left, landing at rim level on "basket"
  if (f >= T.feet1) theta = HALF_PI - HALF_PI * sw1;
  if (f >= sw1End) theta = Math.PI * sw2;
  const back = prog(f, T.but, 26, ease.inOut);
  if (f >= T.but) theta = Math.PI - HALF_PI * back;
  const down = prog(f, T.that - 4, 26, ease.inOut);
  if (f >= T.that - 4) theta = HALF_PI + HALF_PI * down;
  const reel22 = prog(f, T.n22 - 14, 14, ease.out);
  if (f >= T.n22 - 14) r = RA_R + (RA_CORNER - RA_R) * reel22;
  // paint coverage, from the top of the arc outward on each side
  const rightCov = f < T.feet1 ? HALF_PI : f < sw1End ? theta : 0;
  const leftCov = f < sw1End ? HALF_PI : f < T.basket ? Math.max(HALF_PI, theta) : Math.PI;
  const painting = f >= T.feet1 && f < T.basket + 2;
  const paintL: [number, number] = [HALF_PI, Math.min(leftCov, Math.PI - RA_KINK_A)];
  const paintR: [number, number] = [Math.max(rightCov, RA_KINK_A), HALF_PI];
  const ghostL: [number, number] | null = leftCov > Math.PI - RA_KINK_A ? [Math.PI - RA_KINK_A, leftCov] : null;
  const ghostR: [number, number] | null = rightCov < RA_KINK_A ? [rightCov, RA_KINK_A] : null;
  const tipA = f < sw1End ? rightCov : leftCov;
  const wet = painting ? 1 : Math.max(0, 1 - (f - T.basket) / 20);

  // the width scene's left blade half and its two gold 25' 0" readings, fading as the page rises
  const carry = 1 - prog(f, T.the - 8, 12, ease.inOut);

  // ---- the big move: both corner lines fall from above and slam down 3 ft inside the sidelines
  const fallP = prog(f, T.keeps - 2, T.n3 - (T.keeps - 2), ease.in);
  const lineIn = prog(f, T.keeps - 2, 8, ease.linear);
  const height = 1 - fallP;
  const S = 1 + 0.6 * height * height;
  const landed = f >= T.n3;
  const dust = landed ? prog(f, T.n3, 26, ease.out) : 0;
  // the cut-off ends of the ghost fall away and lie dim; they relight for the fit test and the slivers
  const cut = prog(f, T.n3 + 1, 22, ease.in);
  const relight = prog(f, T.still - 4, 10);
  const slL = prog(f, T.n22 - 14, 14, ease.out);
  const slR = prog(f, T.corner - 12, 12, ease.out);
  const breathe = 0.5 + 0.5 * Math.sin((f - T.n22) / 11);

  // ---- the fit test
  const shoeIn = prog(f, T.feet3 - 16, 6, ease.linear) * (1 - prog(f, T.that, 18));
  const lift = 1 - prog(f, T.feet3 - 13, 13, ease.in);
  const TOE_IN = 22.06;
  const TOE_OUT = RA_R + 0.08;
  const outP = prog(f, T.still - 12, 12, ease.inOut);
  const backP = prog(f, T.fit - 4, 14, ease.back);
  const toeX = TOE_IN + (TOE_OUT - TOE_IN) * outP - (TOE_OUT - TOE_IN) * backP;
  const flash = f >= T.still ? Math.exp(-(f - T.still) / 7) : 0;
  const gapLit = prog(f, T.still - 6, 8) * (1 - prog(f, T.fit, 12));
  // "3 feet inside the sideline": the strip the rule keeps lights, baseline up to the kink
  const keepLit = prog(f, T.feet2 + 2, T.so - 8 - (T.feet2 + 2), ease.inOut);
  const keepOut = 1 - prog(f, T.so - 8, 10);
  const clearLit = prog(f, T.fit + 4, 10) * (1 - prog(f, T.that, 16));
  const oob = prog(f, T.still + 2, 7) * (1 - prog(f, T.fit + 4, 8));

  // ---- labels
  const dim15 = prog(f, T.basket - 2, 10) * (1 - prog(f, T.so - 6, 10));
  const dim3 = prog(f, T.feet2, 14) * (1 - prog(f, T.so - 6, 10));
  const cdim3 = prog(f, T.feet3 - 4, 10) * (1 - prog(f, T.still - 10, 8));
  const cdim15 = prog(f, T.still - 4, 8) * (1 - prog(f, T.fit + 4, 8));

  // ---- the page
  const cardIn = arrive(f, T.the - 6, 18);
  const strip = prog(f, T.draws - 4, 22, ease.inOut);
  const hlA = prog(f, T.rule - 10, 26, ease.linear);
  const hlB = prog(f, T.but + 2, T.line - T.but + 4, ease.linear);
  const cardOut = prog(f, T.so - 6, 14, ease.in);

  // ---- tape on screen
  const tapeO = 1 - prog(f, T.so - 2, 10) + prog(f, T.that - 6, 10);
  const win = prog(f, T.draws + 10, 10) * (1 - prog(f, T.feet1 + 16, 8)) + prog(f, T.that + 6, 10);
  const glow = (f >= T.n23 ? Math.exp(-(f - T.n23) / 14) : 0) + (f >= T.n22 ? Math.exp(-(f - T.n22) / 14) : 0);

  // light: a pool that follows the focus, and a slow sweep across the lacquer
  const focus = f < T.feet1 ? raP(cam, 0, 18) : f < T.so ? raP(cam, 0, 12) : f < T.that ? raP(cam, 23.4, 0) : raP(cam, 10, 6);
  const sweep = ((f - scene.from) * 2.2) % 1700 - 300;

  const hW = RA_LINE;
  const dustPts = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) => ({
        side: i % 2 ? 1 : -1,
        y: RA_BASE + raRnd(i, 41) * (RA_KINK_Y - RA_BASE),
        v: (raRnd(i, 42) - 0.5) * 3.2,
        vy: (raRnd(i, 43) - 0.5) * 1.2,
        s: 0.04 + raRnd(i, 44) * 0.09,
      })),
    [],
  );

  // the reading window: inside the arc beside the blade, on the side away from the case
  const wPos = (() => {
    const s1 = raP(cam, r * Math.cos(theta), r * Math.sin(theta));
    const p0 = raP(cam, 0, 0);
    const L = Math.hypot(p0.x - s1.x, p0.y - s1.y) || 1;
    const u = { x: (p0.x - s1.x) / L, y: (p0.y - s1.y) / L };
    const along = Math.min(210, L * 0.55);
    const side = Math.abs(u.y) > 0.6 ? { x: 175, y: 0 } : { x: 0, y: -118 }; // above a level blade, never on it
    return { x: s1.x + u.x * along + side.x, y: s1.y + u.y * along + side.y };
  })();
  const tip = raP(cam, RC * Math.cos(tipA), RC * Math.sin(tipA));

  return (
    <Column width={1080}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="ra-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={0.35} />
          </filter>
          <filter id="ra-soft2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={0.12} />
          </filter>
          <radialGradient id="ra-pool" cx={focus.x} cy={focus.y} r={900} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFF6E2" stopOpacity={0.16} />
            <stop offset="0.5" stopColor="#FFF6E2" stopOpacity={0.03} />
            <stop offset="1" stopColor="#000" stopOpacity={0.42} />
          </radialGradient>
          <linearGradient id="ra-sheen" gradientUnits="userSpaceOnUse" x1={sweep} y1={400} x2={sweep + 520} y2={1500}>
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity={0.1} />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ra-top" x1="0" y1="0" x2="0" y2="1920" gradientUnits="userSpaceOnUse">
            <stop offset={500 / 1920} stopColor="#0D1117" stopOpacity={1} />
            <stop offset={640 / 1920} stopColor="#0D1117" stopOpacity={0} />
            <stop offset={1560 / 1920} stopColor="#0D1117" stopOpacity={0} />
            <stop offset={1720 / 1920} stopColor="#0D1117" stopOpacity={0.9} />
          </linearGradient>
        </defs>
        <g transform={raTransform(cam)}>
          <RulebookArcFloor ppf={cam.ppf} f={f} sideFlash={[0, flash]} />
          <RulebookArcOldLine o={oldLine} />
          {/* carried over from the width scene: the tape's left half, pinned at the basket, its ring on the left sideline */}
          {carry > 0 && (
            <g opacity={carry}>
              <rect x={-RA_SIDE} y={-0.62} width={RA_SIDE} height={1.24} fill={GOLD} opacity={0.55} filter="url(#ra-soft)" />
              <rect x={-RA_SIDE} y={-0.23} width={RA_SIDE} height={0.46} fill="#2E3740" />
              <rect x={-RA_SIDE} y={-0.23} width={RA_SIDE} height={0.06} fill={GOLD} opacity={0.9} />
              {Array.from({ length: 25 }, (_, i) => (
                <rect key={i} x={-i - 0.03} y={-0.05} width={0.06} height={0.28} fill="#E8EDF2" opacity={0.85} />
              ))}
            </g>
          )}
          {/* light on the 15 in gap and on the clear floor behind the heels */}
          {gapLit > 0 && <rect x={RA_R} y={RA_BASE} width={RA_SIDE - RA_R} height={RA_KINK_Y - RA_BASE + 2} fill="#FFFFFF" opacity={0.16 * gapLit} />}
          {keepLit > 0 && keepOut > 0 && [-1, 1].map((s) => (
            <rect key={`kp${s}`} x={s > 0 ? RA_CORNER : -RA_SIDE} y={RA_BASE} width={RA_SIDE - RA_CORNER} height={(RA_KINK_Y - RA_BASE) * keepLit} fill="#FFF8E8" opacity={0.32 * keepOut} />
          ))}
          {clearLit > 0 && <rect x={23.72} y={-1.5} width={RA_SIDE - 23.72} height={3} rx={0.3} fill="#FFF8E8" opacity={0.28 * clearLit} filter="url(#ra-soft2)" />}
          {/* the gold slivers */}
          {[[1, slR], [-1, slL]].map(([s, p]) => (p > 0 ? (
            <g key={`sl${s}`}>
              <path d={rulebookArcSliver(s as 1 | -1, p)} fill={GOLD} opacity={0.35 + 0.15 * breathe} filter="url(#ra-soft)" />
              <path d={rulebookArcSliver(s as 1 | -1, p)} fill={GOLD} opacity={0.9} />
            </g>
          ) : null))}
          {/* the painted arc, wet at the tape's slot */}
          <path d={raArcPath(0, 0, RC, paintL[0], paintL[1], 80)} fill="none" stroke={WHITE} strokeWidth={hW} />
          <path d={raArcPath(0, 0, RC, paintR[0], paintR[1], 80)} fill="none" stroke={WHITE} strokeWidth={hW} />
          {wet > 0 && f >= T.feet1 && (
            <path
              d={f >= sw1End ? raArcPath(0, 0, RC + 0.01, Math.max(HALF_PI, leftCov - 0.16), Math.min(leftCov, Math.PI - RA_KINK_A), 12) : raArcPath(0, 0, RC + 0.01, Math.max(rightCov, RA_KINK_A), Math.min(HALF_PI, rightCov + 0.16), 12)}
              fill="none" stroke="#FFFFFF" strokeWidth={hW * 1.5} opacity={0.9 * wet}
            />
          )}
          {/* the gold ghost ring: the same 23'9" carried on past where the rule stops it */}
          {[ghostL, ghostR].map((g, i) => {
            if (!g) return null;
            const side = i === 0 ? -1 : 1;
            const lit = side > 0 ? Math.max(relight, slR) : slL;
            const tf = `translate(${side * 0.5 * cut * (1 - lit)} ${-0.4 * cut * (1 - lit)})`;
            return (
              <g key={`gh${i}`} transform={tf} opacity={Math.min(1, (landed ? 1 - 0.78 * cut : 1) + 0.75 * lit * (landed ? 1 : 0))}>
                <path d={raArcPath(0, 0, RA_R - 0.07, g[0], g[1], 30)} fill="none" stroke={GOLD} strokeWidth={0.5} opacity={0.35} filter="url(#ra-soft2)" />
                <path d={raArcPath(0, 0, RA_R - 0.07, g[0], g[1], 30)} fill="none" stroke={GOLD} strokeWidth={0.14} />
                {/* where the ring would keep going below rim level, toward the baseline */}
                {landed && (
                  <path d={raArcPath(0, 0, RA_R - 0.07, side > 0 ? -Math.asin(5.25 / RA_R) : Math.PI, side > 0 ? 0 : Math.PI + Math.asin(5.25 / RA_R), 12)} fill="none" stroke={GOLD} strokeWidth={0.1} opacity={0.8 * lit} />
                )}
              </g>
            );
          })}
          {/* the corner lines' shadows, sharpening as they fall */}
          {lineIn > 0 && !landed && [-1, 1].map((s) => (
            <rect key={`sh${s}`} x={s * RA_CORNER - (s > 0 ? hW : 0) - 0.4 * height} y={RA_BASE - 0.4 * height} width={hW + 0.8 * height} height={RA_KINK_Y - RA_BASE + 0.8 * height} fill="#000" opacity={0.15 + 0.45 * fallP} filter="url(#ra-soft2)" />
          ))}
          {/* the corner lines themselves */}
          {lineIn > 0 && (
            <g opacity={lineIn}>
              {[-1, 1].map((s) => {
                // each line falls straight down at the lens: bigger and thicker while high, landing at true 2 in
                const xc = s * (RA_CORNER - hW / 2), yc = (RA_KINK_Y + RA_BASE) / 2;
                const settle = landed ? Math.exp(-(f - T.n3) / 16) : 1;
                return (
                  <g key={`cl${s}`} transform={`translate(${xc} ${yc}) scale(${S * (1 + 2.6 * height)} ${S}) translate(${-xc} ${-yc})`}>
                    <rect x={xc - 0.45} y={RA_BASE} width={0.9} height={RA_KINK_Y - RA_BASE} fill="#FFFFFF" opacity={0.35 * settle} filter="url(#ra-soft2)" />
                    <rect x={xc - hW / 2} y={RA_BASE} width={hW} height={RA_KINK_Y - RA_BASE} fill={WHITE} />
                  </g>
                );
              })}
            </g>
          )}
          {/* impact: a puff of light along each line, chips of dust thrown out */}
          {landed && dust < 1 && (
            <g opacity={1 - dust}>
              {[-1, 1].map((s) => (
                <rect key={`fl${s}`} x={s * RA_CORNER - 3.5} y={RA_BASE} width={7} height={RA_KINK_Y - RA_BASE + 1.5} fill="#FFFFFF" opacity={0.22} filter="url(#ra-soft)" />
              ))}
              {[-1, 1].map((s) => (
                <rect key={`du${s}`} x={s * (RA_CORNER - hW / 2) - (0.3 + 2.2 * dust)} y={RA_BASE - 0.5 * dust} width={2 * (0.3 + 2.2 * dust)} data-k="puff" height={RA_KINK_Y - RA_BASE + dust} rx={0.6} fill="#FFF6E0" opacity={0.85} filter="url(#ra-soft)" />
              ))}
              {dustPts.map((p, i) => (
                <circle key={i} cx={p.side * (RA_CORNER - hW / 2) + p.v * dust} cy={p.y + p.vy * dust} r={p.s * (1 - dust * 0.5)} fill="#FFF8EA" />
              ))}
            </g>
          )}
          <RulebookArcShoes toeX={toeX} lift={lift} opacity={shoeIn} />
        </g>
        <rect width={1080} height={1920} fill="url(#ra-pool)" />
        <rect width={1080} height={1920} fill="url(#ra-sheen)" />
        {dim > 0 && <rect width={1080} height={1920} fill="#0D1117" opacity={dim} />}
        <rect width={1080} height={1920} fill="url(#ra-top)" />
        {/* the wet tip's sparkle under the slot */}
        {painting && <circle cx={tip.x} cy={tip.y} r={7} fill="#FFFFFF" opacity={0.85} />}
        <RulebookArcDim cam={cam} x0={-RA_SIDE} x1={-RA_R} y={0} label="15 in" o={dim15} labelX={raP(cam, -RA_SIDE, 0).x + 2} anchor="start" />
        <RulebookArcDim cam={cam} x0={RA_CORNER} x1={RA_SIDE} y={-2.3} label="3 ft" o={cdim3} size={44} />
        <RulebookArcDim cam={cam} x0={RA_R} x1={RA_SIDE} y={-2.3} label="15 in" o={cdim15} size={44} />
        {[-1, 1].map((s) => (
          <RulebookArcDim key={`d3${s}`} cam={cam} x0={s > 0 ? RA_CORNER : -RA_SIDE} x1={s > 0 ? RA_SIDE : -RA_CORNER} y={-3.4} label="3 ft" o={dim3} labelX={s > 0 ? raP(cam, RA_CORNER, 0).x - 8 : undefined} anchor={s > 0 ? "end" : "middle"} />
        ))}
        {oob > 0 && (() => {
          const p = raP(cam, 26.45, 1.6); // on the apron, left of and above Instagram's buttons
          return (
            <text x={p.x} y={p.y} fill={GREY} fontFamily="Figtree, sans-serif" fontWeight={700} fontSize={34} textAnchor="middle" opacity={oob}>
              out of bounds
            </text>
          );
        })()}
      </svg>
      <RulebookArcTape cam={cam} angle={theta} r={r} f={f} opacity={raClamp(tapeO)} window={raClamp(win)} glow={raClamp(glow)} wx={wPos.x} wy={wPos.y} />
      {carry > 0.001 && [raClamp((raP(cam, -RA_SIDE, 0).x), 150, 390), raClamp(raP(cam, RA_SIDE, 0).x, 690, 930)].map((x, i) => (
        <div key={`c25${i}`} style={{ position: "absolute", left: x - 300, width: 600, top: raP(cam, 0, 0).y - 92 - 36, textAlign: "center", fontFamily: "Figtree, sans-serif", fontWeight: 800, fontSize: 60, lineHeight: 1.2, color: GOLD, opacity: carry, whiteSpace: "nowrap", textShadow: "0 3px 14px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)", fontVariantNumeric: "tabular-nums" }}>
          25' 0"
        </div>
      ))}
      <RulebookArcCard strip={strip} hlA={hlA} hlB={hlB} enter={cardIn} leave={cardOut} />
      {cardIn > 0.01 && cardOut < 1 && (
        <div style={{ position: "absolute", left: 60, top: 1556, fontFamily: "Figtree, sans-serif", fontSize: 26, color: GREY, opacity: cardIn * (1 - cardOut) }}>
          NBA Rule 1, Court Dimensions
        </div>
      )}
    </Column>
  );
};
