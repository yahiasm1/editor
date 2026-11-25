// Scene `points`: "Now turn that into points. A corner three is worth about one point one six points per shot. A long
// two, from sixteen feet out to the line, went in forty percent of the time, which is only zero point eight."
// The real half court as a Basketball-Reference shot chart. 1,000 corner threes fall into the right corner strip
// (387 ●, 613 ×); every make pays a "3" into one total, 1,161, which divides by its 1,000 shots: 1.16. The steel tape
// swings the gold 16 ft ring; the band from there to the line is BBR's own "16-3P" column; 1,000 long twos fill it,
// the League Average ".401" cell drops in, 401 of them turn into makes, each pays a "2": 802, 0.80, set beside the
// 1.16 and smaller by its value.
// Notes: reels/nba-floor/notes/PointsPerShot.md
import React, { useMemo } from "react";
import { Column, useScene, prog, arrive, ease } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { PointsPerShotFloor } from "./PointsPerShotFloor";
import { PointsPerShotTape } from "./PointsPerShotTape";
import { PointsPerShotMarks, ppsArrived, ppsPayTimes, type PpsMarkTiming } from "./PointsPerShotMarks";
import { PointsPerShotCell, PointsPerShotPct, PointsPerShotTotal } from "./PointsPerShotNumbers";
import {
  PPS_BAND, PPS_BASE, PPS_CORNER, PPS_CORNER_CAM, PPS_KINK_A, PPS_KINK_Y, PPS_LINE, PPS_R, PPS_R16, PPS_SIDE, PPS_START,
  ppsArcPath, ppsBandPath, ppsCamMix, ppsClamp, ppsCornerShots, ppsLongTwoShots, ppsP, ppsTransform,
} from "./PointsPerShotWorld";

const GOLD = "#F2B33D";
const WHITE = "#F3F5F7";
const GREY = "#8B949E";
const RC = PPS_R - PPS_LINE / 2;
const HALF_PI = Math.PI / 2;
/** the 16 ft ring runs from the right baseline, over the top, to the left baseline */
const R16_A0 = -Math.asin(-PPS_BASE / PPS_R16);
const R16_A1 = Math.PI - R16_A0;

/** the three-point line, fully painted */
const PointsPerShotLine: React.FC = () => (
  <g>
    <path d={ppsArcPath(0, 0, RC, PPS_KINK_A, Math.PI - PPS_KINK_A, 120)} fill="none" stroke={WHITE} strokeWidth={PPS_LINE} />
    {[-1, 1].map((s) => (
      <line key={s} x1={s * (PPS_CORNER - PPS_LINE / 2)} y1={PPS_BASE} x2={s * (PPS_CORNER - PPS_LINE / 2)} y2={PPS_KINK_Y + 0.02} stroke={WHITE} strokeWidth={PPS_LINE} />
    ))}
  </g>
);

/** the gold 21 in sliver, between the corner line and the 23'9" circle, baseline to the kink */
function pointsPerShotSliver(side: 1 | -1) {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const y = PPS_BASE + ((PPS_KINK_Y - PPS_BASE) * i) / 40;
    pts.push(`${(side * Math.sqrt(PPS_R * PPS_R - y * y)).toFixed(4)} ${y.toFixed(4)}`);
  }
  return `M${side * PPS_CORNER} ${PPS_BASE} L${pts.join(" L")} L${side * PPS_CORNER} ${PPS_KINK_Y} Z`;
}

/** the right corner strip: from the line to the sideline, baseline to the kink */
const STRIP = `M${PPS_CORNER} ${PPS_BASE}H${PPS_SIDE}V${PPS_KINK_Y}H${PPS_CORNER}Z`;

export const PointsPerShot: React.FC = () => {
  const { f, cue, scene } = useScene();

  const T = useMemo(
    () => ({
      now: cue("Now"), points: cue("points."), corner: cue("corner"), three: cue("three"), is: cue("is"), about: cue("about"), v116: cue("1.16"),
      per: cue("per"), shot: cue("shot."), a2: cue("A", 2), long: cue("long"), two: cue("two,"), from: cue("from"), n16: cue("16"), feet: cue("feet"),
      line: cue("line,"), went: cue("went"), pct: cue("40%"), of: cue("of"), time: cue("time,"), which: cue("which"), only: cue("only"), v08: cue("0.8."),
    }),
    [cue],
  );

  const corner = useMemo(() => ppsCornerShots(), []);
  const long2 = useMemo(() => ppsLongTwoShots(), []);
  const cT: PpsMarkTiming = useMemo(
    () => ({ fallAt: T.points - 3, fallDur: 40, flipAt: null, flipDur: 0, payAt: T.corner - 4, payDur: T.v116 - 30 - (T.corner - 4), rise: 10, fly: 18 }),
    [T],
  );
  const lT: PpsMarkTiming = useMemo(
    () => ({ fallAt: T.feet - 4, fallDur: T.line + 4 - (T.feet - 4), flipAt: T.pct - 16, flipDur: 18, payAt: T.of - 2, payDur: T.only - 10 - (T.of - 2), rise: 10, fly: 18 }),
    [T],
  );
  const cPay = useMemo(() => ppsPayTimes(corner, cT), [corner, cT]);
  const lPay = useMemo(() => ppsPayTimes(long2, lT), [long2, lT]);

  // ---- camera: from `percent`'s floor down into the right corner, then up to the whole band
  const tDive = prog(f, T.now - 6, T.points - T.now + 6, ease.inOut);
  const tRise = prog(f, T.per - 10, 44, ease.inOut);
  let cam = ppsCamMix(PPS_START, PPS_CORNER_CAM, tDive);
  cam = ppsCamMix(cam, PPS_BAND, tRise);
  const push = 1 + 0.02 * prog(f, scene.from, scene.to - scene.from, ease.linear);
  cam = { ...cam, ppf: cam.ppf * push };

  // ---- the floor turns into a chart ground: dimmer, so the marks read
  const chart = prog(f, T.now, 30, ease.inOut);
  const stripLit = prog(f, T.points - 6, 12) * (1 - 0.7 * tRise);
  const cornerMarksO = 1 - 0.62 * prog(f, T.per, 30);

  // ---- corner total
  const cArrived = ppsArrived(cPay, cT, f);
  const cIn = prog(f, cT.payAt + cT.rise + cT.fly - 10, 10);
  const cDivide = prog(f, T.v116 - 18, 8);
  const cRoll = prog(f, T.v116 - 6, 14, ease.inOut);
  const cSub = prog(f, T.v116 + 8, 12);
  const cPulse = f >= T.v116 + 8 ? Math.exp(-(f - T.v116 - 8) / 9) : 0;
  // its place: beside the strip in the corner, then parked top right over the whole floor
  const cPark = prog(f, T.per - 6, 40, ease.inOut);
  const cPos0 = { x: 352, y: 742 };
  const cPos1 = { x: 806, y: 640 };
  const cPos = { x: cPos0.x + (cPos1.x - cPos0.x) * cPark, y: cPos0.y + (cPos1.y - cPos0.y) * cPark };
  const cSize = 132 + (108 - 132) * cPark;
  const cTo = { x: cPos0.x, y: cPos0.y - 4 };

  // ---- the tape: arrives on the pin, pays out to 16 ft, swings the ring, points back up for the reading
  const tapeO = prog(f, T.shot - 6, 10) * (1 - prog(f, T.went - 6, 14));
  const pay = prog(f, T.shot + 2, T.long - (T.shot + 2), ease.out);
  const r = 0.8 + (PPS_R16 - 0.8) * pay;
  const swA = T.long, swB = T.long + 15, swC = T.from - 2;
  let theta = HALF_PI;
  if (f >= swA) theta = HALF_PI + (R16_A0 - HALF_PI) * prog(f, swA, swB - swA, ease.inOut);
  if (f >= swB) theta = R16_A0 + (R16_A1 - R16_A0) * prog(f, swB, swC - swB, ease.inOut);
  if (f >= swC) theta = R16_A1 + (HALF_PI - R16_A1) * prog(f, swC, T.n16 - swC, ease.inOut);
  // the ring under the tip
  const ringR = f < swA ? null : f < swB ? [theta, HALF_PI] : f < swC ? [R16_A0, Math.max(HALF_PI, theta)] : [R16_A0, R16_A1];
  const ringRight = f >= swB ? [R16_A0, HALF_PI] : null;
  const win = prog(f, T.n16 - 6, 8) * (1 - prog(f, T.went - 10, 10));
  const glow = (f >= T.long ? Math.exp(-(f - T.long) / 14) : 0) + (f >= T.n16 ? Math.exp(-(f - T.n16) / 14) : 0);

  // ---- the band: lit as the ring passes over it, BBR's column head on "two,"
  const bandLit = prog(f, T.long + 6, T.from - T.long, ease.inOut);
  const bandSweep = f < swB ? 0 : theta; // the band lights behind the tip as it sweeps
  const cellIn = arrive(f, T.two - 4, 16);
  const cellRow = prog(f, T.went - 4, 14, ease.out);
  const cellO = 1 - prog(f, T.of, 14);
  const pctDrop = prog(f, T.went + 6, T.pct - (T.went + 6), ease.in);
  const pctLand = prog(f, T.pct - 2, 8);
  const flipped = (() => {
    let n = 0;
    if (lT.flipAt === null) return 0;
    for (const s of long2) if (s.made && f >= lT.flipAt + s.flip * lT.flipDur) n++;
    return n;
  })();
  const pctO = prog(f, T.went + 6, 4) * (1 - prog(f, T.v08 - 4, 14));

  // ---- long-two total
  const lArrived = ppsArrived(lPay, lT, f);
  const lIn = prog(f, lT.payAt + lT.rise + lT.fly - 10, 10);
  const lRoll = prog(f, T.v08 - 6, 14, ease.inOut);
  const lSub = prog(f, T.v08 + 6, 12);
  const lPulse = f >= T.v08 + 6 ? Math.exp(-(f - T.v08 - 6) / 9) : 0;
  const lPos = { x: 290 + 40 * lRoll, y: 640 };
  const lSize = 108 - (108 - 108 * (0.80 / 1.16)) * lRoll;
  const lTo = { x: 290, y: 636 };

  // ---- labels
  const pctStartO = (1 - prog(f, T.points - 10, 12)) * prog(f, scene.from - LEAD, 6);
  const longLbl = prog(f, T.two + 4, 10) * (1 - prog(f, T.v08 - 6, 12));
  const srcO = prog(f, T.points, 12);

  // light: a pool on the focus, a slow sweep across the lacquer
  const focus = f < T.per ? ppsP(cam, 23.4, 0.5) : ppsP(cam, 0, 14);
  const sweep = ((f - scene.from) * 2.2) % 1700 - 300;
  const tapeTip = ppsP(cam, r * Math.cos(theta), r * Math.sin(theta));
  const bandClip = ppsArcPath(0, 0, 40, R16_A0 - 0.2, Math.max(R16_A0 - 0.2, bandSweep), 60);

  // hairlines from each value down to its zone
  const cHair = { a: { x: cPos.x + 40, y: cPos.y + cSize * 0.55 + 100 }, b: ppsP(cam, 23.5, PPS_KINK_Y - 0.3) };
  const lHair = { a: { x: lPos.x + 20, y: lPos.y + lSize * 0.55 + 98 }, b: ppsP(cam, -11.5, 15.8) };
  const hairO = prog(f, T.shot, 14) * cPark;
  const lHairO = lSub;

  return (
    <Column width={1080}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="pps-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={0.35} />
          </filter>
          <filter id="pps-bloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation={4} />
          </filter>
          <radialGradient id="pps-pool" cx={focus.x} cy={focus.y} r={900} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFF6E2" stopOpacity={0.14} />
            <stop offset="0.5" stopColor="#FFF6E2" stopOpacity={0.03} />
            <stop offset="1" stopColor="#000" stopOpacity={0.42} />
          </radialGradient>
          <linearGradient id="pps-sheen" gradientUnits="userSpaceOnUse" x1={sweep} y1={400} x2={sweep + 520} y2={1500}>
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity={0.09} />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pps-top" x1="0" y1="0" x2="0" y2="1920" gradientUnits="userSpaceOnUse">
            <stop offset={500 / 1920} stopColor="#0D1117" stopOpacity={1} />
            <stop offset={600 / 1920} stopColor="#0D1117" stopOpacity={0} />
            <stop offset={1530 / 1920} stopColor="#0D1117" stopOpacity={0} />
            <stop offset={1700 / 1920} stopColor="#0D1117" stopOpacity={0.92} />
          </linearGradient>
          <clipPath id="pps-sweep">
            <path d={`M0 0 ${bandClip.replace(/^M/, "L")} Z`} />
          </clipPath>
        </defs>
        <g transform={ppsTransform(cam)}>
          <PointsPerShotFloor ppf={cam.ppf} f={f} sideFlash={[0, 0]} />
          {/* the chart ground: the floor dims under the marks */}
          <rect x={-40} y={-20} width={80} height={80} fill="#0D1117" opacity={0.56 * chart} />
          {/* the gold slivers stay lit from `arc` and `percent` */}
          {[1, -1].map((s) => (
            <g key={s}>
              <path d={pointsPerShotSliver(s as 1 | -1)} fill={GOLD} opacity={0.3} filter="url(#pps-soft)" />
              <path d={pointsPerShotSliver(s as 1 | -1)} fill={GOLD} opacity={0.75 - 0.25 * chart} />
            </g>
          ))}
          {/* the corner strip, lit while its shots fall */}
          {stripLit > 0 && <path d={STRIP} fill="#FFFFFF" opacity={0.1 * stripLit} />}
          {stripLit > 0 && <path d={STRIP} fill="none" stroke="#FFFFFF" strokeWidth={0.05} opacity={0.5 * stripLit} />}
          {/* the long-two band, lit behind the swinging tape */}
          {bandLit > 0 && (
            <g clipPath={f < swC ? "url(#pps-sweep)" : undefined}>
              <path d={ppsBandPath()} fill="#FFFFFF" opacity={0.11 * Math.min(1, bandLit * 2)} />
              <path d={ppsBandPath()} fill="none" stroke="#FFFFFF" strokeWidth={0.06} opacity={0.55 * Math.min(1, bandLit * 2)} />
            </g>
          )}
          <PointsPerShotLine />
          {/* the 16 ft ring, gold: distance from the basket */}
          {ringR && (
            <g>
              <path d={ppsArcPath(0, 0, PPS_R16, ringR[0], ringR[1], 60)} fill="none" stroke={GOLD} strokeWidth={0.45} opacity={0.35} filter="url(#pps-soft)" />
              <path d={ppsArcPath(0, 0, PPS_R16, ringR[0], ringR[1], 60)} fill="none" stroke={GOLD} strokeWidth={0.13} />
              {ringRight && <path d={ppsArcPath(0, 0, PPS_R16, ringRight[0], ringRight[1], 40)} fill="none" stroke={GOLD} strokeWidth={0.13} />}
            </g>
          )}
        </g>
        <rect width={1080} height={1920} fill="url(#pps-pool)" />
        <rect width={1080} height={1920} fill="url(#pps-sheen)" />
        <PointsPerShotMarks cam={cam} f={f} shots={corner} t={cT} pop={cPay} to={cTo} glyph="3" opacity={cornerMarksO} focus={prog(f, T.corner - 6, 10) * (1 - prog(f, T.per, 20))} />
        <PointsPerShotMarks cam={cam} f={f} shots={long2} t={lT} pop={lPay} to={lTo} glyph="2" opacity={1} focus={prog(f, T.of - 6, 10) * (1 - prog(f, T.v08, 20))} />
        {/* hairlines from the values to their zones */}
        {hairO > 0.01 && <line x1={cHair.a.x} y1={cHair.a.y} x2={cHair.b.x} y2={cHair.b.y} stroke={GREY} strokeWidth={2} opacity={hairO} />}
        {lHairO > 0.01 && <line x1={lHair.a.x} y1={lHair.a.y} x2={lHair.a.x + (lHair.b.x - lHair.a.x) * lHairO} y2={lHair.a.y + (lHair.b.y - lHair.a.y) * lHairO} stroke={GREY} strokeWidth={2} />}
        {/* the tape's tip sparkle while it paints the ring */}
        {f >= swA && f < swC + 4 && <circle cx={tapeTip.x} cy={tapeTip.y} r={6} fill="#FFF3D6" opacity={0.9} />}
        <rect width={1080} height={1920} fill="url(#pps-top)" />
        {/* "38.7%" from `percent`, under each corner, as the scene opens */}
        {pctStartO > 0.01 &&
          [1, -1].map((s) => {
            const p = ppsP(cam, s * 23.5, PPS_BASE - 2.2);
            return (
              <text key={s} x={p.x} y={p.y} fill="#FFFFFF" fontFamily="Figtree, sans-serif" fontWeight={700} fontSize={48} textAnchor="middle" opacity={pctStartO}>
                38.7%
              </text>
            );
          })}
        {longLbl > 0.01 && (() => {
          const p = ppsP(cam, 12.6, 14.4);
          return (
            <g opacity={longLbl}>
              <text x={p.x} y={p.y + 12} fill={GREY} fontFamily="Figtree, sans-serif" fontWeight={700} fontSize={34} textAnchor="middle" style={{ paintOrder: "stroke" }} stroke="#0D1117" strokeWidth={6} strokeOpacity={0.6}>
                long two
              </text>
            </g>
          );
        })()}
      </svg>
      <PointsPerShotTape cam={cam} angle={theta} r={r} f={f} opacity={ppsClamp(tapeO)} window={ppsClamp(win)} glow={ppsClamp(glow)} wx={300} wy={1210} />
      <PointsPerShotTotal
        x={cPos.x} y={cPos.y} size={cSize} opacity={cIn} sum={3 * cArrived} roll={cRoll} perShot="1.16" divide={cDivide}
        shots="1,000 shots" math="3 × .387" sub={cSub} pulse={cPulse}
      />
      <PointsPerShotCell x={540} y={548} enter={cellIn} cell={cellRow} lift={0} opacity={cellO} />
      <PointsPerShotPct x={540 + (540 - 540) * pctDrop} y={700 + (958 - 700) * pctDrop} drop={pctDrop} pct={(flipped / 1000) * 100} land={pctLand} opacity={pctO} />
      <PointsPerShotTotal
        x={lPos.x} y={lPos.y} size={lSize} opacity={lIn} sum={2 * lArrived} roll={lRoll} perShot="0.80" divide={prog(f, T.v08 - 18, 8)}
        shots="1,000 shots" math="2 × .401" sub={lSub} pulse={lPulse}
      />
      {srcO > 0.01 && (
        <div style={{ position: "absolute", left: 60, top: 1462, fontFamily: "Figtree, sans-serif", fontSize: 26, color: GREY, opacity: srcO }}>
          Basketball-Reference, 2025-26 league average: corner 3P% .387, FG% 16-3P .401
        </div>
      )}
    </Column>
  );
};
