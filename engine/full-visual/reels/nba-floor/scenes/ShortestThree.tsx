// Scene `close`: "So the line really isn't the same distance everywhere, and the smartest teams spend every
// possession trying to reach the shortest part of it."
// The hook's frame, resolved. The real half court at Rule 1 geometry with the league's 2025-26 attempts lying in
// their places. The Lufkin tape reads 23' 9" at the top, 22' 0" in the corner, then sweeps the whole line, its
// reading rising and falling. The four teams that live in the corners (cdn.nba.com logos, bare) land on the aprons,
// their share of shots from there counting up (Basketball-Reference, 2025-26). The ball swings to the left corner,
// is skipped across to the right, and the point on the corner line level with the rim lights: 22' 0", the shortest
// three on the floor.
// Notes: reels/nba-floor/notes/ShortestThree.md
import React, { useMemo } from "react";
import { Img, staticFile } from "remotion";
import { Column, useScene, prog, ease, countTo } from "../../../src/engine";
import { ShortestThreeFloor } from "./ShortestThreeFloor";
import { ShortestThreeTape } from "./ShortestThreeTape";
import {
  ST_ARC, ST_BASE, ST_CORNER, ST_KINK_A, ST_KINK_Y, ST_LAST, ST_LINE, ST_R, ST_TEAMS,
  stArcPath, stCamMix, stClamp, stLeagueMarks, stLineR, stP, stTransform, type ShortestThreeCam,
} from "./ShortestThreeWorld";

const GOLD = "#F2B33D";
const WHITE = "#F3F5F7";
const GREY = "#8B949E";
const FONT = "Figtree, sans-serif";
const SHADOW = "0 3px 18px rgba(13,17,23,0.85), 0 0 2px rgba(13,17,23,0.9)";
const RC = ST_R - ST_LINE / 2;
const HALF_PI = Math.PI / 2;
/** the three-point line, baseline to baseline, as a run of points (for the light and the gold trail) */
const A_BASE = Math.atan2(ST_BASE, ST_CORNER);

/** a point on the painted line along a direction from the middle of the basket */
const shortestThreeOnLine = (a: number) => {
  const r = stLineR(a) - ST_LINE / 2;
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
};

/** svg path along the line between two directions (radians, ccw from the right corner at rim level) */
function shortestThreeLinePath(a0: number, a1: number, n = 140) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const p = shortestThreeOnLine(a0 + ((a1 - a0) * i) / n);
    d += `${i ? "L" : "M"}${p.x.toFixed(4)} ${p.y.toFixed(4)}`;
  }
  return d;
}

/** the three-point line, fully painted */
const ShortestThreeLine: React.FC = () => (
  <g>
    <path d={stArcPath(0, 0, RC, ST_KINK_A, Math.PI - ST_KINK_A, 120)} fill="none" stroke={WHITE} strokeWidth={ST_LINE} />
    {[-1, 1].map((s) => (
      <line key={s} x1={s * (ST_CORNER - ST_LINE / 2)} y1={ST_BASE} x2={s * (ST_CORNER - ST_LINE / 2)} y2={ST_KINK_Y + 0.02} stroke={WHITE} strokeWidth={ST_LINE} />
    ))}
  </g>
);

/** the gold 21 in sliver, between the corner line and the 23'9" circle, baseline to the kink */
function shortestThreeSliver(side: 1 | -1) {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const y = ST_BASE + ((ST_KINK_Y - ST_BASE) * i) / 40;
    pts.push(`${(side * Math.sqrt(ST_R * ST_R - y * y)).toFixed(4)} ${y.toFixed(4)}`);
  }
  return `M${side * ST_CORNER} ${ST_BASE} L${pts.join(" L")} L${side * ST_CORNER} ${ST_KINK_Y} Z`;
}

/** the four teams with the most corner threes per shot, 2025-26 (BBR team shooting: %FGA 3P x Corner %3PA) */
const TEAMS = [
  { id: "spurs", pct: 13.4, x: -21.9, size: 1.1 },
  { id: "knicks", pct: 12.9, x: -14.6, size: 1 },
  { id: "bucks", pct: 12.6, x: 14.6, size: 1 },
  { id: "warriors", pct: 12.5, x: 21.9, size: 0.94 },
];
const LOGO_Y = -8.35; // on the apron, under the baseline
const LOGO_PX = 104;

/** the ball's stops, in feet: top of the key, left wing, left corner, right corner (just behind the line, rim level) */
const BALL = [
  { x: 0, y: 25.2 },
  { x: -17.2, y: 15.8 },
  { x: -23.45, y: 1.2 },
  { x: 23.4, y: 0.25 },
];

export const ShortestThree: React.FC = () => {
  const { f, cue, scene } = useScene();

  const T = useMemo(
    () => ({
      so: cue("So"), line: cue("line"), really: cue("really"), isnt: cue("isn't"), the2: cue("the", 2), same: cue("same"), distance: cue("distance"),
      every: cue("everywhere,"), and: cue("and"), smartest: cue("smartest"), teams: cue("teams"), spend: cue("spend"), possession: cue("possession"),
      trying: cue("trying"), reach: cue("reach"), the4: cue("the", 4), shortest: cue("shortest"), part: cue("part"), it: cue("it."),
    }),
    [cue],
  );
  const marks = useMemo(() => stLeagueMarks(), []);

  // ---- camera: the ARC FRAME, lifted for the teams in the silence after "everywhere,", then a slow last push
  const tLift = prog(f, T.and - 16, 30, ease.inOut);
  const tLast = prog(f, T.trying - 12, scene.to - (T.trying - 12), ease.inOut);
  let cam: ShortestThreeCam = stCamMix(ST_ARC, ST_TEAMS, tLift);
  cam = stCamMix(cam, ST_LAST, tLast);
  const drift = 1 + 0.008 * prog(f, scene.from, T.and - scene.from, ease.linear);
  cam = { ...cam, ppf: cam.ppf * drift };

  // ---- the tape: pays out to the top, swings to the corner, sweeps the line, reels in; later pays out to rim level
  // the pay-out ends before the swing starts, so 23' 9" lands and holds a beat at the top
  const payA = T.line - 4, payB = T.isnt - 2;
  const swA = T.same - 10, swB = T.same + 2;
  const swpA = T.distance - 2, swpB = T.and - 18;
  const inA = T.and - 16, inB = T.and + 4;
  let theta = HALF_PI;
  let r = 0.8;
  if (f < swA) r = 0.8 + (ST_R - 0.8) * prog(f, payA, payB - payA, ease.out);
  else if (f < swpA) {
    theta = HALF_PI + (0 - HALF_PI) * prog(f, swA, swB - swA, ease.inOut);
    r = stLineR(theta);
  } else if (f < inA) {
    theta = Math.PI * prog(f, swpA, swpB - swpA, ease.inOut);
    r = stLineR(theta);
  } else {
    theta = Math.PI;
    r = 0.8 + (ST_CORNER - 0.8) * (1 - prog(f, inA, inB - inA, ease.in));
  }
  const tape1O = prog(f, payA - 6, 8) * (1 - prog(f, inB - 6, 8));
  // the second pay-out: straight to the corner line at rim level, ending on "shortest"
  const pay2A = T.reach - 18, pay2B = T.shortest;
  const tape2O = prog(f, pay2A - 6, 8) * (1 - prog(f, T.shortest + 16, 10));
  // it reaches the point on "shortest", then reels back in to the pin, leaving the point clear
  const r2 = 0.8 + (ST_CORNER - ST_LINE / 2 - 0.8) * prog(f, pay2A, pay2B - pay2A, ease.out) * (1 - prog(f, T.shortest + 3, 22, ease.inOut));
  const tape2 = f >= pay2A - 6;
  const tapeAngle = tape2 ? 0 : theta;
  const tapeR = tape2 ? r2 : r;
  const tapeO = tape2 ? tape2O : tape1O;
  const glow = (f >= T.same ? Math.exp(-(f - T.same) / 14) : 0) + (f >= T.shortest ? Math.exp(-(f - T.shortest) / 18) : 0);
  // the reading window rides the blade, a little inside the tip
  const tip = stP(cam, tapeR * Math.cos(tapeAngle), tapeR * Math.sin(tapeAngle));
  const base = stP(cam, 0, 0);
  const bl = Math.max(1, Math.hypot(tip.x - base.x, tip.y - base.y));
  const wOff = 178;
  const wx = tip.x - ((tip.x - base.x) / bl) * wOff;
  const wy = tip.y - ((tip.y - base.y) / bl) * wOff;
  const win = prog(f, payA + 4, 8) * (1 - prog(f, inA - 4, 8));

  // ---- the league's attempts thin to texture; the corner ones come back with the teams
  const marksO = 0.42 - 0.27 * prog(f, T.so, T.really - T.so, ease.inOut);
  const cornerUp = prog(f, T.smartest - 6, 16);
  const cornerO = marksO + (0.78 - marksO) * cornerUp;

  // ---- the line: a light runs along it on "So the line"; the gold trail under the sweep
  const runP = prog(f, T.so - 4, T.really + 6 - (T.so - 4), ease.inOut);
  const trailO = f < swpA ? 0 : 1 - prog(f, T.and - 6, 30);
  const trailA = f < swpA ? 0 : f < inA ? theta : Math.PI;

  // ---- the slivers: lit, flash on "same", lit fully at the end
  const sliverPulse = f >= T.same ? Math.exp(-(f - T.same) / 16) : 0;
  const sliverEnd = prog(f, T.shortest - 4, 18);
  const sliverO = 0.55 + 0.4 * sliverPulse + 0.3 * sliverEnd;

  // ---- the teams
  const logoDrop = (i: number) => prog(f, T.and - 6 + i * 6, 16, ease.back);
  const logoIn = (i: number) => prog(f, T.and - 6 + i * 6, 5, ease.linear);
  const pctStart = (i: number) => T.smartest - 14 + i * 4;
  const teamLbl = prog(f, T.smartest + 8, 12);
  const srcO = prog(f, T.smartest + 2, 12);

  // ---- the ball
  const ballIn = prog(f, T.spend - 8, 14, ease.out);
  const legs = [
    { a: 0, b: 1, s: T.possession - 4, d: 13, h: 2.2 },
    { a: 1, b: 2, s: T.possession + 10, d: 13, h: 2.0 },
    { a: 2, b: 3, s: T.trying - 2, d: T.shortest - 5 - (T.trying - 2), h: 7.5 },
  ];
  let bx = BALL[0].x, by = BALL[0].y, bh = 0, spin = 0;
  for (const L of legs) {
    if (f >= L.s) {
      const t = prog(f, L.s, L.d, ease.inOut);
      const u = prog(f, L.s, L.d, ease.linear);
      bx = BALL[L.a].x + (BALL[L.b].x - BALL[L.a].x) * t;
      by = BALL[L.a].y + (BALL[L.b].y - BALL[L.a].y) * t;
      bh = Math.sin(u * Math.PI) * L.h;
      spin += u * 300;
    }
  }
  // the drop in at the top of the key: from above, settling with a small bounce
  const dropH = (1 - ballIn) * 9 + (f >= T.spend + 6 ? Math.abs(Math.sin(prog(f, T.spend + 6, 14, ease.linear) * Math.PI)) * 0.8 * (1 - prog(f, T.spend + 6, 14)) : 0);
  bh += dropH;
  const landL = T.possession + 23;
  const landR = T.shortest - 5;
  const pulseL = f >= landL ? Math.exp(-(f - landL) / 10) : 0;
  const pulseR = f >= landR ? Math.exp(-(f - landR) / 10) : 0;
  const bP = stP(cam, bx, by);
  const ballR = 18 * (cam.ppf / 19.5) * (1 + bh * 0.06);
  const shadowOff = bh * cam.ppf * 0.42;

  // ---- the shortest point
  const pt = stP(cam, ST_CORNER - ST_LINE / 2, 0);
  const crossIn = prog(f, T.shortest - 1, 10, ease.back);
  const crossRing = f >= T.shortest ? prog(f, T.shortest, 34, ease.out) : 0;
  const ptLbl = prog(f, T.shortest + 2, 10);
  const ptSub = prog(f, T.part - 4, 12);
  const breathe = f >= T.shortest + 20 ? 0.5 + 0.5 * Math.sin((f - T.shortest) / 9) : 1;

  // light: a pool on the focus, a slow sweep across the lacquer
  const focus = f < T.and ? stP(cam, 0, 10) : f < T.trying ? stP(cam, 0, 2) : stP(cam, 18, 0);
  const sweep = ((f - scene.from) * 2.4) % 1800 - 320;
  const runPath = shortestThreeLinePath(A_BASE, Math.PI - A_BASE, 220);

  return (
    <Column width={1080}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="st-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={0.35} />
          </filter>
          <filter id="st-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={0.6} />
          </filter>
          <filter id="st-bloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation={6} />
          </filter>
          <radialGradient id="st-pool" cx={focus.x} cy={focus.y} r={950} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFF6E2" stopOpacity={0.14} />
            <stop offset="0.5" stopColor="#FFF6E2" stopOpacity={0.03} />
            <stop offset="1" stopColor="#000" stopOpacity={0.42} />
          </radialGradient>
          <linearGradient id="st-sheen" gradientUnits="userSpaceOnUse" x1={sweep} y1={400} x2={sweep + 520} y2={1500}>
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity={0.08} />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="st-top" x1="0" y1="0" x2="0" y2="1920" gradientUnits="userSpaceOnUse">
            <stop offset={500 / 1920} stopColor="#0D1117" stopOpacity={1} />
            <stop offset={610 / 1920} stopColor="#0D1117" stopOpacity={0} />
            <stop offset={1500 / 1920} stopColor="#0D1117" stopOpacity={0} />
            <stop offset={1680 / 1920} stopColor="#0D1117" stopOpacity={0.94} />
          </linearGradient>
        </defs>
        <g transform={stTransform(cam)}>
          <ShortestThreeFloor ppf={cam.ppf} f={f} sideFlash={[0, 0]} />
          {/* the gold slivers: the floor you gain in the corner */}
          {[1, -1].map((s) => (
            <g key={s}>
              <path d={shortestThreeSliver(s as 1 | -1)} fill={GOLD} opacity={0.35 * sliverO} filter="url(#st-soft)" />
              <path d={shortestThreeSliver(s as 1 | -1)} fill={GOLD} opacity={Math.min(1, sliverO)} />
            </g>
          ))}
          {/* the league's 2025-26 attempts in their places */}
          {marks.map((m, i) => (
            <circle key={i} cx={m.x} cy={m.y} r={0.2} fill="#FFFFFF" opacity={(m.zone === "corner" ? cornerO : marksO) * (0.75 + 0.25 * m.k)} />
          ))}
          {/* gold under the line the tape has swept: distance, read all the way round */}
          {trailO > 0.01 && trailA > 0.01 && (
            <g opacity={trailO}>
              <path d={shortestThreeLinePath(0, trailA, 120)} fill="none" stroke={GOLD} strokeWidth={0.9} opacity={0.55} filter="url(#st-glow)" />
              <path d={shortestThreeLinePath(0, trailA, 120)} fill="none" stroke={GOLD} strokeWidth={0.36} />
            </g>
          )}
          <ShortestThreeLine />
          {/* the light running along the paint on "So the line" */}
          {runP > 0 && runP < 1 && (
            <g>
              <path d={runPath} fill="none" stroke="#FFFFFF" strokeWidth={0.9} pathLength={1} strokeDasharray="0.09 1.2" strokeDashoffset={0.09 - runP * 1.09} opacity={0.75} filter="url(#st-glow)" />
              <path d={runPath} fill="none" stroke="#FFFFFF" strokeWidth={0.28} pathLength={1} strokeDasharray="0.05 1.2" strokeDashoffset={0.07 - runP * 1.09} />
            </g>
          )}
        </g>
        <rect width={1080} height={1920} fill="url(#st-pool)" />
        <rect width={1080} height={1920} fill="url(#st-sheen)" />
        <rect width={1080} height={1920} fill="url(#st-top)" />
      </svg>

      {/* the ball and its shadow */}
      {ballIn > 0.001 && (
        <>
          <div
            style={{
              position: "absolute", left: bP.x - ballR + shadowOff * 0.5, top: bP.y - ballR * 0.8 + shadowOff * 0.2, width: ballR * 2, height: ballR * 1.6,
              borderRadius: "50%", background: "#1B0D03", opacity: 0.55 * ballIn / (1 + bh * 0.18), filter: `blur(${(2 + bh * 0.9).toFixed(1)}px)`,
            }}
          />
          <Img
            src={staticFile("nba-floor/shortestthree-ball.png")}
            style={{
              position: "absolute", left: bP.x - ballR * 1.03, top: bP.y - ballR * 1.03 - bh * cam.ppf * 0.55, width: ballR * 2.06, height: ballR * 2.06,
              opacity: ballIn, transform: `rotate(${spin.toFixed(1)}deg)`, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))",
            }}
          />
        </>
      )}

      <ShortestThreeTape cam={cam} angle={tapeAngle} r={tapeR} f={f} opacity={stClamp(tapeO)} window={stClamp(win)} glow={stClamp(glow)} wx={wx} wy={wy} />

      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <filter id="st-bloom2" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation={6} />
          </filter>
        </defs>
        {/* the shortest point: a white cross on the corner line, level with the rim */}
        {crossIn > 0.001 && (
          <g transform={`translate(${pt.x} ${pt.y})`}>
            <circle r={10 + 70 * crossRing} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.8 * (1 - crossRing)} />
            <circle r={34} fill={GOLD} opacity={0.6 * crossIn * breathe} filter="url(#st-bloom2)" />
            <g transform={`scale(${crossIn})`}>
              <rect x={-28} y={-4} width={56} height={8} rx={2} fill="#FFFFFF" />
              <rect x={-4} y={-28} width={8} height={56} rx={2} fill="#FFFFFF" />
            </g>
          </g>
        )}
        {/* a hairline from the reading to the point */}
        {ptLbl > 0.01 && <line x1={pt.x - 8} y1={pt.y - 26} x2={pt.x - 8 - 30 * ptLbl} y2={pt.y - 26 - 60 * ptLbl} stroke={GREY} strokeWidth={2} />}
      </svg>

      {/* the four teams, on the aprons under the corners */}
      {TEAMS.map((t, i) => {
        const p = stP(cam, t.x, LOGO_Y);
        const d = logoDrop(i);
        const o = logoIn(i);
        if (o <= 0.001) return null;
        const pulse = t.x < 0 ? pulseL : pulseR;
        const s = LOGO_PX * t.size * (1 + 0.1 * pulse);
        const lift = (1 - d) * 150;
        const v = countTo(f, pctStart(i), 26, 0, t.pct);
        const pctO = prog(f, pctStart(i), 6, ease.linear);
        return (
          <div key={t.id} style={{ position: "absolute", left: p.x - 80, top: p.y - 60, width: 160, height: 200, pointerEvents: "none" }}>
            <div style={{ position: "absolute", left: 80 - s * 0.42, top: 60 + s * 0.36, width: s * 0.84, height: s * 0.16, borderRadius: "50%", background: "#000", opacity: 0.5 * o * (0.4 + 0.6 * d), filter: "blur(6px)" }} />
            <Img
              src={staticFile(`nba-floor/shortestthree-${t.id}.svg`)}
              style={{ position: "absolute", left: 80 - s / 2, top: 60 - s / 2 - lift, width: s, height: s, opacity: o, transform: `scale(${(1.25 - 0.25 * d).toFixed(3)})` }}
            />
            {pctO > 0.01 && (
              <div style={{ position: "absolute", left: 0, width: 160, top: 60 + LOGO_PX * 0.5 + 6, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 42, color: "#FFFFFF", fontVariantNumeric: "tabular-nums", letterSpacing: -1, opacity: pctO, textShadow: SHADOW }}>
                {v.toFixed(1)}%
              </div>
            )}
          </div>
        );
      })}
      {teamLbl > 0.01 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: stP(cam, 0, LOGO_Y).y + 104, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 32, color: GREY, opacity: teamLbl, textShadow: SHADOW }}>
          of all their shots were corner threes
        </div>
      )}

      {/* the reading at the point */}
      {ptLbl > 0.01 && (
        <div style={{ position: "absolute", left: pt.x - 30 - 360, top: pt.y - 92 - 138, width: 360, textAlign: "right", opacity: ptLbl, transform: `translateY(${((1 - ptLbl) * 14).toFixed(1)}px)` }}>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 84, color: "#FFFFFF", letterSpacing: -2, lineHeight: 1, textShadow: SHADOW }}>22&apos; 0&quot;</div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: "#C9D1D9", marginTop: 8, opacity: ptSub, textShadow: SHADOW }}>the shortest three</div>
        </div>
      )}

      {/* source lines */}
      <div style={{ position: "absolute", left: 60, top: 1478, fontFamily: FONT, fontSize: 26, color: GREY, opacity: prog(f, T.really, 10) * (1 - prog(f, T.and - 12, 8)) }}>NBA Rule 1, Court Dimensions</div>
      <div style={{ position: "absolute", left: 60, top: 1478, fontFamily: FONT, fontSize: 26, color: GREY, opacity: srcO }}>Basketball-Reference, 2025-26 team shooting</div>
    </Column>
  );
};
