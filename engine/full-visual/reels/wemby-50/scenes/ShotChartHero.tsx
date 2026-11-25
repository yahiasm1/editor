// `where`: "And look where they came from. Ten of his twelve shots at the rim went in, and five of his eleven threes,
// in under thirty-two minutes, in a game the Spurs won by twenty-three."
// Basketball-Reference's shot chart of the game, redrawn top-down on the reel's half court at true NBA geometry.
// The camera swings up from `extra`'s side stands view to straight over the floor while the grey chances fade off
// their spots; "came": his 29 marks land in game order (filled dot made, x missed, as on BBR). "10": a 3.5 ft ring
// round the rim (BBR's 0-3 ft bucket, all 12 shots inside it) lights, the 10 makes pulse in turn, "10 / 12"; "rim":
// the rim glints, the net swings, BBR's own tooltip for shot 24. "5": the three point line draws in light, the 5 made
// threes pop, the 6 misses pulse, "5 / 11". "32": the court slides down and the NBA.com scoreboard returns above it,
// MIN 0:00 -> 31:51; "game / Spurs / won": the linescore writes in quarter by quarter and the final lands, then "+23".
// Parts: ShotChartHeroWorld (camera, shots), ShotChartHeroFloor (court, basket), ShotChartHeroDisc (the chance).
import React from "react";
import { Img, staticFile } from "remotion";
import { LEAD } from "../../../src/engine/Stage";
import { blurIn, countTo, draw, ease, prog, useScene } from "../../../src/engine";
import { ShotChartHeroFloor } from "./ShotChartHeroFloor";
import { ShotChartHeroDisc, type ShotChartHeroMap } from "./ShotChartHeroDisc";
import {
  SCH_FT_A0,
  SCH_FT_A1,
  SCH_FT_X,
  SCH_FTL,
  SCH_REST,
  SCH_RIM_Y,
  SCH_SHOTS,
  shotChartHeroArc as arc,
  shotChartHeroBasis,
  shotChartHeroProject as proj,
  schLerp as lerp,
  type ShotChartHeroCam,
  type ShotChartHeroV3,
} from "./ShotChartHeroWorld";

const PI = Math.PI;
const INK = "#FFFFFF";
const SOFT = "#C9D1D9";
const LABEL = "#8B949E";
const CARD = "#161B22";
const LINE = "#30363D";
const asset = (n: string) => staticFile(`wemby-50/${n}`);

// ---- cameras, as target + angles + scale (px per ft at the target), so the swing is one continuous orbit
type ShotChartHeroRig = { tx: number; ty: number; az: number; el: number; D: number; s: number; cx: number; cy: number };
const DEG = PI / 180;
// where `extra` leaves its camera (KE: eye [-59, 30, 49], at [-3, 14, 0], F 1165, cx 560, cy 1344)
const KE: ShotChartHeroRig = { tx: -3, ty: 14, az: Math.atan2(16, -56), el: Math.asin(49 / Math.hypot(56, 16, 49)), D: Math.hypot(56, 16, 49), s: 1165 / Math.hypot(56, 16, 49), cx: 560, cy: 1344 };
// straight over the half court, baseline at the top like BBR's chart, 18 px a foot: 50 ft = 900 px
const TOP: ShotChartHeroRig = { tx: 0, ty: 23.5, az: 90 * DEG, el: 86 * DEG, D: 300, s: 18, cx: 540, cy: 584 + 23.5 * 18 };
// down at the rim: 3.5 ft ring = 133 px
const RIM: ShotChartHeroRig = { tx: 3.6, ty: 7.2, az: 90 * DEG, el: 86 * DEG, D: 300, s: 38, cx: 540, cy: 872 };
// small under the scoreboard
const LOW: ShotChartHeroRig = { tx: 0, ty: 23.5, az: 90 * DEG, el: 86 * DEG, D: 300, s: 14, cx: 540, cy: 806 + 23.5 * 14 };

const mixRig = (a: ShotChartHeroRig, b: ShotChartHeroRig, t: number): ShotChartHeroRig => ({
  tx: lerp(a.tx, b.tx, t),
  ty: lerp(a.ty, b.ty, t),
  az: lerp(a.az, b.az, t),
  el: lerp(a.el, b.el, t),
  D: Math.exp(lerp(Math.log(a.D), Math.log(b.D), t)),
  s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), t)),
  cx: lerp(a.cx, b.cx, t),
  cy: lerp(a.cy, b.cy, t),
});
const toCam = (r: ShotChartHeroRig): ShotChartHeroCam => {
  const h = r.D * Math.cos(r.el);
  return { eye: [r.tx + h * Math.cos(r.az), r.ty + h * Math.sin(r.az), r.D * Math.sin(r.el)], at: [r.tx, r.ty, 0], F: r.s * r.D, cx: r.cx, cy: r.cy };
};

// ---- the chart: BBR's 29 in game order, by zone
const RING = 3.5; // ft round the rim centre: BBR's 0-3 ft bucket (furthest listed 3.4 ft, next nearest 4.0 ft)
const SHOTS = SCH_SHOTS.map(([n, x, y, made, pts]) => ({ n, x, y: y + SCH_RIM_Y, made: !!made, three: pts === 3, rim: Math.hypot(x, y) < RING }));
const RIM_MADE = SHOTS.filter((s) => s.rim && s.made).map((s) => s.n);
const RIM_MISS = SHOTS.filter((s) => s.rim && !s.made).map((s) => s.n);
const THREE_MADE = SHOTS.filter((s) => s.three && s.made).map((s) => s.n);
const THREE_MISS = SHOTS.filter((s) => s.three && !s.made).map((s) => s.n);

const CORNER_Y = SCH_RIM_Y + Math.sqrt(23.75 * 23.75 - 22 * 22);
const A3 = Math.atan2(CORNER_Y - SCH_RIM_Y, 22);
const THREE_LINE: [number, number][] = [[-22, 0], [-22, CORNER_Y], ...arc(0, SCH_RIM_Y, 23.75, PI - A3, A3, 90), [22, CORNER_Y], [22, 0]];
const RING_PTS: [number, number][] = arc(0, SCH_RIM_Y, RING, -PI / 2, (3 * PI) / 2, 72);

// the linescore, NBA.com box score
const LINES = [
  { abbr: "SAS", logo: "shotcharthero-spurs.svg", q: [32, 29, 28, 25], t: 114, ink: INK },
  { abbr: "NOP", logo: "shotcharthero-pelicans.svg", q: [29, 16, 21, 25], t: 91, ink: SOFT },
];

const courtMap = (cam: ShotChartHeroCam, B: ReturnType<typeof shotChartHeroBasis>, x: number, y: number, z: number): ShotChartHeroMap => (u, v, w) => {
  const p = proj(cam, x + u, y + v, z + w, B);
  return [p.x, p.y];
};

export const ShotChartHero: React.FC = () => {
  const { f, scene, cue, theme } = useScene();
  const s0 = scene.from - LEAD;
  const t = {
    came: cue("came"),
    from: cue("from."),
    n10: cue("10"),
    n12: cue("12"),
    rim: cue("rim"),
    went: cue("went"),
    and: cue("and", 2),
    minutes: cue("minutes,"),
    n5: cue("5"),
    n11: cue("11"),
    threes: cue("threes,"),
    n32: cue("32"),
    game: cue("game"),
    spurs: cue("Spurs"),
    won: cue("won"),
    n23: cue("23."),
    end: scene.to,
  };
  const UI = theme.font.ui;
  const BIG = theme.font.caption;

  // ---- the camera: swing up from the stands, push to the rim, back out, then down under the scoreboard
  const swing = prog(f, s0, t.came - 2 - s0, ease.inOut);
  const push = prog(f, t.from - 4, t.n10 - t.from + 2, ease.inOut);
  const back = prog(f, t.and - 6, 26, ease.inOut);
  const down = prog(f, t.n32 - 26, 28, ease.inOut);
  let rig = mixRig(KE, TOP, swing);
  if (push > 0) rig = mixRig(rig, RIM, push);
  if (back > 0) rig = mixRig(rig, TOP, back);
  if (down > 0) rig = mixRig(rig, LOW, down);
  // a held picture keeps living: a slow drift in
  rig = { ...rig, s: rig.s * (1 + 0.012 * Math.sin((f - s0) / 70)) };
  const cam = toCam(rig);
  const B = shotChartHeroBasis(cam);
  const P = (x: number, y: number, z = 0) => proj(cam, x, y, z, B);
  const ppf = (() => {
    const c = P(0, 20);
    return c.ok ? cam.F / c.z : 18;
  })();
  const path = (pts: [number, number][], z = 0) => {
    let d = "";
    pts.forEach((q, i) => {
      const p = P(q[0], q[1], z);
      if (p.ok) d += `${d ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    });
    return d;
  };

  // the floor darkens a step so the marks read; the mask `extra` used opens out as the camera swings
  const dim = 0.22 * (1 - swing) + 0.34 * swing;
  const maskTop = lerp(1010, 420, prog(f, s0, 30, ease.inOut));
  const MASK = `linear-gradient(to bottom, transparent ${maskTop}px, #000 ${maskTop + 90}px, #000 1436px, transparent 1468px)`;

  // ---- the grey chances from `average` / `extra` fade off their spots as the camera rises
  const discO = 1 - prog(f, s0 + 4, 24, ease.in);
  const discs: React.ReactNode[] = [];
  if (discO > 0.01) {
    const order = SCH_REST.map((r, i) => ({ r, i, z: P(r.x, r.y, r.z).z })).sort((a, b) => b.z - a.z);
    for (const { r, i } of order) {
      const o = discO * (1 - 0.4 * prog(f, s0 + (i % 7), 10, ease.linear));
      discs.push(<ShotChartHeroDisc key={`d${i}`} id={`sch-d${i}`} map={courtMap(cam, B, r.x, r.y, r.z)} p={{ a0: 0, a1: 2 * PI, o, fill: 0.575, grey: 1 }} detail={0.6} />);
    }
    SCH_FT_X.forEach((x, j) =>
      discs.push(<ShotChartHeroDisc key={`w${j}`} id={`sch-w${j}`} map={courtMap(cam, B, x, SCH_FTL, 0)} p={{ a0: SCH_FT_A0, a1: SCH_FT_A1, o: discO, fill: 0.575, grey: 1 }} detail={0.6} />),
    );
  }

  // ---- the marks: in game order on "came", 1.3 frames apart
  const markAt = (i: number) => t.came - 6 + Math.round(i * 1.3);
  const pulseAt: Record<number, number> = {};
  RIM_MADE.forEach((n, k) => (pulseAt[n] = t.n10 + k * 3));
  RIM_MISS.forEach((n, k) => (pulseAt[n] = t.n12 + 2 + k * 5));
  THREE_MADE.forEach((n, k) => (pulseAt[n] = t.n5 + k * 5));
  THREE_MISS.forEach((n, k) => (pulseAt[n] = t.n11 + k * 3));
  const rimFocus = prog(f, t.n10 - 4, 8, ease.linear) * (1 - prog(f, t.and, 10, ease.linear));
  const threeFocus = prog(f, t.n5 - 6, 8, ease.linear) * (1 - prog(f, t.n32 - 10, 14, ease.linear));
  const marks: React.ReactNode[] = [];
  const ripples: React.ReactNode[] = [];
  SHOTS.forEach((s, i) => {
    const a = markAt(i);
    if (f < a) return;
    const c = P(s.x, s.y);
    if (!c.ok) return;
    const r = Math.max(6.5, 0.42 * (cam.F / c.z));
    const inPop = prog(f, a, 9, ease.back);
    const pa = pulseAt[s.n];
    const pulse = pa !== undefined && f >= pa ? Math.sin(PI * prog(f, pa, 12, ease.linear)) : 0;
    const k = inPop * (1 + 0.7 * pulse);
    const focus = rimFocus > 0 ? lerp(1, s.rim ? 1 : 0.28, rimFocus) : threeFocus > 0 ? lerp(1, s.three ? 1 : 0.28, threeFocus) : 1;
    const o = prog(f, a, 3, ease.linear) * focus;
    // a ripple when it lands and when it is counted
    for (const [st, big] of [[a, 1.8], ...(pa !== undefined ? [[pa, 2.8]] : [])] as [number, number][]) {
      const q = prog(f, st, 16, ease.out);
      if (f >= st && q < 1) ripples.push(<circle key={`r${s.n}-${st}`} cx={c.x} cy={c.y} r={r * (1 + big * q)} fill="none" stroke={s.made ? INK : SOFT} strokeWidth={2} opacity={(1 - q) * 0.8 * focus} />);
    }
    const R = r * k;
    marks.push(
      s.made ? (
        <g key={`m${s.n}`} opacity={o}>
          <circle cx={c.x} cy={c.y + 1.5} r={R + 2.5} fill="#0D1117" opacity={0.55} />
          <circle cx={c.x} cy={c.y} r={R} fill="#F4F6F8" stroke="#0D1117" strokeWidth={2} />
          {pulse > 0 && <circle cx={c.x} cy={c.y} r={R * 1.5} fill="#FFFFFF" opacity={0.35 * pulse} style={{ filter: "blur(6px)" }} />}
        </g>
      ) : (
        <g key={`m${s.n}`} opacity={o}>
          <path d={`M${c.x - R} ${c.y - R}L${c.x + R} ${c.y + R}M${c.x + R} ${c.y - R}L${c.x - R} ${c.y + R}`} stroke="#0D1117" strokeWidth={Math.max(6, R * 0.7)} strokeLinecap="round" opacity={0.75} />
          <path d={`M${c.x - R} ${c.y - R}L${c.x + R} ${c.y + R}M${c.x + R} ${c.y - R}L${c.x - R} ${c.y + R}`} stroke={pulse > 0 ? INK : SOFT} strokeWidth={Math.max(3, R * 0.34)} strokeLinecap="round" />
        </g>
      ),
    );
  });
  const landed = SHOTS.filter((_, i) => f >= markAt(i) + 2);
  const nShots = landed.length;
  const nMade = landed.filter((s) => s.made).length;

  // ---- the ring round the rim, the rim's glint, the three point line drawn in light
  const ringIn = prog(f, t.n10 - 8, 12, ease.out);
  const ringD = path(RING_PTS);
  const ringC = P(0, SCH_RIM_Y);
  const ringR = ringC.ok ? RING * (cam.F / ringC.z) : 0;
  const ringLit = ringIn * (1 - 0.45 * prog(f, t.n32 - 10, 20, ease.linear));
  const glint = f >= t.rim - 2 ? Math.sin(PI * prog(f, t.rim - 2, 26, ease.linear)) : 0;
  const swingNet = f >= t.rim ? Math.exp(-(f - t.rim) / 28) : 0;
  const arcD = path(THREE_LINE);
  const arcIn = prog(f, t.n5 - 12, 18, ease.inOut);
  const arcLit = arcIn * (1 - 0.45 * prog(f, t.n32 - 10, 20, ease.linear));

  // ---- counters
  const rimCount = f < t.n10 ? 0 : Math.min(10, Math.floor((f - t.n10) / 3) + 1);
  const threeCount = f < t.n5 ? 0 : Math.min(5, Math.floor((f - t.n5) / 5) + 1);
  const rimLab = P(8.6, SCH_RIM_Y + 0.2);
  const rimEdge = P(RING, SCH_RIM_Y);
  const threeLab = P(0, 35.4);
  const threeTop = P(0, SCH_RIM_Y + 23.75);
  const legend = P(0, 41.6);
  const rimLabO = prog(f, t.n10 - 2, 8, ease.out) * (1 - 0.25 * prog(f, t.n32 - 10, 20, ease.linear));
  const threeLabO = prog(f, t.n5 - 2, 8, ease.out) * (1 - 0.25 * prog(f, t.n32 - 10, 20, ease.linear));
  const labScale = Math.max(0.72, Math.min(1, ppf / 18));

  // BBR's own tooltip for shot 24, on "rim": the real copy of one of the ten
  const tipShot = SHOTS.find((s) => s.n === 24)!;
  const tipAt = t.rim + 4;
  const tipO = prog(f, tipAt, 8, ease.out) * (1 - prog(f, t.and - 6, 10, ease.in));
  const tipC = P(tipShot.x, tipShot.y);
  const TIP = ["4th quarter, 10:16.0 remaining", "Victor Wembanyama", "made 2-pointer from 0 ft", "San Antonio now leads 94-68"];
  const TIP_BOX = { x: 560, y: 990, w: 480 };

  // ---- the scoreboard, back above the court
  const sbIn = prog(f, t.n32 - 24, 20, ease.out);
  const minS = f < t.n32 - 22 ? 0 : Math.round(countTo(f, t.n32 - 22, 22, 0, 31 * 60 + 51));
  const minTxt = `${Math.floor(minS / 60)}:${String(minS % 60).padStart(2, "0")}`;
  const minLand = f >= t.n32 ? 1 + 0.1 * Math.sin(PI * prog(f, t.n32, 12, ease.linear)) : 1;
  const qAt = (row: number, q: number) => t.minutes + 8 + q * 10 + row * 4;
  const finalLand = prog(f, t.won - 6, 8, ease.out);
  const finalBump = f >= t.won ? 1 + 0.14 * Math.sin(PI * prog(f, t.won, 12, ease.linear)) : 1;
  const plusAt = t.n23 - 4;
  const plusIn = prog(f, plusAt, 9, ease.out);
  const plusBump = f >= plusAt + 9 ? 1 + 0.08 * Math.exp(-(f - plusAt - 9) / 6) * Math.sin((f - plusAt - 9) * 0.7) : 1;
  const SB = { x: 60, y: 538, w: 960, h: 236 };
  const COLS = [484, 540, 596, 652];
  const TCOL = 748;

  const source = f >= t.won ? "NBA.com box score, Basketball-Reference shot chart" : "Basketball-Reference shot chart";
  const sourceSwap = f >= t.won ? prog(f, t.won, 8, ease.out) : prog(f, t.came, 10, ease.out);

  return (
    <>
      <div style={{ position: "absolute", inset: 0, maskImage: MASK, WebkitMaskImage: MASK }}>
        <ShotChartHeroFloor cam={cam} f={f} dim={dim} glint={glint} swing={swingNet} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <filter id="sch-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
          {discs}
          {/* the 0-3 ft ring: a hairline circle on the floor, the inside lit */}
          {ringIn > 0 && ringD && (
            <g opacity={ringLit}>
              <circle cx={ringC.x} cy={ringC.y} r={ringR} fill="#FFFFFF" opacity={0.1 * ringIn} />
              <path d={ringD} fill="none" stroke="#FFFFFF" strokeWidth={9} opacity={0.35} filter="url(#sch-glow)" {...draw(f, t.n10 - 8, 12)} />
              <path d={ringD} fill="none" stroke="#FFFFFF" strokeWidth={2.5} {...draw(f, t.n10 - 8, 12)} />
            </g>
          )}
          {/* the three point line drawn in light over its paint */}
          {arcIn > 0 && arcD && (
            <g opacity={arcLit}>
              <path d={arcD} fill="none" stroke="#FFFFFF" strokeWidth={Math.max(10, ppf * 0.55)} opacity={0.4} filter="url(#sch-glow)" {...draw(f, t.n5 - 12, 18)} />
              <path d={arcD} fill="none" stroke="#FFFFFF" strokeWidth={Math.max(3, ppf * 0.2)} {...draw(f, t.n5 - 12, 18)} />
            </g>
          )}
          {ripples}
          {marks}
          {/* hairlines from the labels to what they measure */}
          {rimLabO > 0 && rimEdge.ok && rimLab.ok && <path d={`M${rimEdge.x + 4} ${rimEdge.y}L${rimLab.x - 12} ${rimLab.y}`} stroke="#FFFFFF" strokeWidth={1.5} opacity={0.7 * rimLabO} />}
          {threeLabO > 0 && threeTop.ok && threeLab.ok && <path d={`M${threeTop.x} ${threeTop.y + 6}L${threeLab.x} ${threeLab.y - 40 * labScale}`} stroke="#FFFFFF" strokeWidth={1.5} opacity={0.7 * threeLabO} />}
          {tipO > 0 && tipC.ok && <path d={`M${tipC.x + 8} ${tipC.y + 8}L${TIP_BOX.x} ${TIP_BOX.y + 20}`} stroke="#FFFFFF" strokeWidth={1.5} opacity={0.6 * tipO} />}
        </svg>
      </div>

      {/* labels on the court, in screen pixels at their anchors */}
      {rimLabO > 0 && rimLab.ok && (
        <div style={{ position: "absolute", left: rimLab.x, top: rimLab.y, transform: `translateY(-50%) scale(${labScale})`, transformOrigin: "left center", opacity: rimLabO, textShadow: "0 2px 14px rgba(0,0,0,0.75)" }}>
          <div style={{ fontFamily: BIG, fontWeight: 800, fontSize: 84, lineHeight: 1, color: INK, letterSpacing: -1, whiteSpace: "nowrap" }}>
            {rimCount}
            <span style={{ opacity: prog(f, t.n12 - 4, 8, ease.out), color: SOFT }}> / 12</span>
          </div>
          <div style={{ ...blurIn(f, t.n12, { dur: 8 }), fontFamily: UI, fontWeight: 600, fontSize: 32, color: "#E6EDF3", marginTop: 8, whiteSpace: "nowrap" }}>at the rim, 0-3 ft</div>
        </div>
      )}
      {threeLabO > 0 && threeLab.ok && (
        <div style={{ position: "absolute", left: threeLab.x, top: threeLab.y, transform: `translate(-50%, -30%) scale(${labScale})`, transformOrigin: "center top", opacity: threeLabO, textShadow: "0 2px 14px rgba(0,0,0,0.75)", textAlign: "center" }}>
          <div style={{ fontFamily: BIG, fontWeight: 800, fontSize: 84, lineHeight: 1, color: INK, letterSpacing: -1, whiteSpace: "nowrap" }}>
            {threeCount}
            <span style={{ opacity: prog(f, t.n11 - 4, 8, ease.out), color: SOFT }}> / 11</span>
          </div>
          <div style={{ ...blurIn(f, t.n11, { dur: 8 }), fontFamily: UI, fontWeight: 600, fontSize: 32, color: "#E6EDF3", marginTop: 8, whiteSpace: "nowrap" }}>threes</div>
        </div>
      )}
      {/* BBR's legend counts with the marks */}
      {legend.ok && f >= t.came - 6 && (
        <div
          style={{
            position: "absolute", left: legend.x, top: legend.y, transform: `translate(-50%, -50%) scale(${labScale})`, opacity: prog(f, t.came - 6, 8, ease.out) * (1 - 0.6 * Math.max(rimFocus, threeFocus)),
            display: "flex", gap: 26, alignItems: "center", fontFamily: UI, fontWeight: 600, fontSize: 32, color: "#E6EDF3", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}
        >
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{nShots} shots</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10, fontVariantNumeric: "tabular-nums" }}>
            <span style={{ width: 18, height: 18, borderRadius: 9, background: "#F4F6F8", border: "2px solid #0D1117" }} />
            {nMade} made
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 10, fontVariantNumeric: "tabular-nums" }}>
            <span style={{ fontSize: 34, color: SOFT }}>×</span>
            {nShots - nMade} missed
          </span>
        </div>
      )}
      {/* the real tooltip */}
      {tipO > 0 && (
        <div
          style={{
            position: "absolute", left: TIP_BOX.x, top: TIP_BOX.y, width: TIP_BOX.w, padding: "18px 22px", borderRadius: 14, background: CARD, border: `1px solid ${LINE}`,
            boxShadow: "0 18px 40px rgba(0,0,0,0.55)", opacity: tipO, transform: `translateY(${(14 * (1 - tipO)).toFixed(1)}px)`, fontFamily: UI, fontSize: 32, lineHeight: 1.3,
          }}
        >
          {TIP.map((line, i) => (
            <div key={i} style={{ ...blurIn(f, tipAt + 3 + i * 5, { dur: 7 }), color: i === 1 || i === 2 ? INK : LABEL, fontWeight: i === 1 || i === 2 ? 700 : 500, fontSize: 32, whiteSpace: "nowrap" }}>
              {line}
            </div>
          ))}
        </div>
      )}

      {/* the scoreboard returns: his minutes, then NBA.com's linescore and the final */}
      {sbIn > 0 && (
        <div
          style={{
            position: "absolute", left: SB.x, top: SB.y, width: SB.w, height: SB.h, borderRadius: 18, background: CARD, border: `1px solid ${LINE}`, boxShadow: "0 22px 50px rgba(0,0,0,0.55)",
            opacity: prog(f, t.n32 - 24, 5, ease.linear), transform: `translateY(${(-70 * (1 - sbIn)).toFixed(1)}px)`, overflow: "hidden",
          }}
        >
          {/* light passing over the card as the final lands */}
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 220, left: -260 + 1500 * prog(f, t.won - 4, 34, ease.inOut), background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
          {/* MIN */}
          <div style={{ position: "absolute", left: 34, top: 30, fontFamily: UI, fontWeight: 700, fontSize: 32, color: LABEL, letterSpacing: 1 }}>MIN</div>
          <div style={{ position: "absolute", left: 30, top: 70, fontFamily: BIG, fontWeight: 800, fontSize: 82, lineHeight: 1, color: INK, fontVariantNumeric: "tabular-nums", transform: `scale(${minLand.toFixed(3)})`, transformOrigin: "left center" }}>{minTxt}</div>
          <div style={{ position: "absolute", left: 34, top: 178, fontFamily: UI, fontWeight: 600, fontSize: 30, color: LABEL, whiteSpace: "nowrap" }}>V. Wembanyama</div>
          <div style={{ position: "absolute", left: 290, top: 26, bottom: 26, width: 1, background: LINE }} />
          {/* header */}
          <div style={{ position: "absolute", left: 0, top: 26, width: SB.w, height: 40, fontFamily: UI, fontWeight: 700, fontSize: 30, color: LABEL, opacity: prog(f, qAt(0, 0) - 10, 8, ease.out) }}>
            {["1", "2", "3", "4"].map((q, i) => (
              <span key={q} style={{ position: "absolute", left: COLS[i] - 30, width: 60, textAlign: "center" }}>{q}</span>
            ))}
            <span style={{ position: "absolute", left: TCOL - 50, width: 100, textAlign: "center", color: f >= t.won ? INK : LABEL }}>{f >= t.won - 2 ? "FINAL" : "T"}</span>
          </div>
          {LINES.map((L, row) => {
            const y = 82 + row * 72;
            const rowIn = prog(f, qAt(row, 0) - 6, 8, ease.out);
            return (
              <div key={L.abbr} style={{ position: "absolute", left: 0, top: y, width: SB.w, height: 64, opacity: rowIn }}>
                <Img src={asset(L.logo)} style={{ position: "absolute", left: 306, top: 6, width: 52, height: 52, transform: `translateY(${(-30 * (1 - rowIn)).toFixed(1)}px) scale(${row === 0 && f >= t.spurs ? (1 + 0.22 * Math.sin(PI * prog(f, t.spurs, 14, ease.linear))).toFixed(3) : 1})` }} />
                <span style={{ position: "absolute", left: 366, top: 12, fontFamily: UI, fontWeight: 800, fontSize: 34, color: L.ink, letterSpacing: 1 }}>{L.abbr}</span>
                {L.q.map((v, q) => {
                  const a = qAt(row, q);
                  const roll = prog(f, a, 7, ease.out);
                  return (
                    <span key={q} style={{ position: "absolute", left: COLS[q] - 34, width: 68, top: 8, textAlign: "center", fontFamily: BIG, fontWeight: 700, fontSize: 38, color: SOFT, fontVariantNumeric: "tabular-nums", opacity: roll, transform: `translateY(${(22 * (1 - roll)).toFixed(1)}px)` }}>
                      {f >= a ? Math.round(countTo(f, a, 7, 0, v)) : ""}
                    </span>
                  );
                })}
                <span
                  style={{
                    position: "absolute", left: TCOL - 60, width: 120, top: 0, textAlign: "center", fontFamily: BIG, fontWeight: 800, fontSize: 54, color: L.ink, fontVariantNumeric: "tabular-nums",
                    opacity: finalLand, transform: `translateY(${(-26 * (1 - finalLand)).toFixed(1)}px) scale(${finalBump.toFixed(3)})`,
                  }}
                >
                  {f >= t.won - 6 ? Math.round(countTo(f, t.won - 6, 8, L.t - 12, L.t)) : ""}
                </span>
              </div>
            );
          })}
          {/* the margin */}
          {plusIn > 0 && (
            <>
              <div style={{ position: "absolute", left: 834, top: 92, width: 1, height: 120, background: LINE, opacity: plusIn }} />
              <div
                style={{
                  position: "absolute", left: 848, top: 108, fontFamily: BIG, fontWeight: 800, fontSize: 54, lineHeight: 1, color: INK, opacity: prog(f, plusAt, 4, ease.linear),
                  transform: `translateY(${(-60 * (1 - plusIn)).toFixed(1)}px) scale(${plusBump.toFixed(3)})`, transformOrigin: "left center", filter: plusIn < 1 ? `blur(${(6 * (1 - plusIn)).toFixed(1)}px)` : undefined,
                }}
              >
                +23
              </div>
            </>
          )}
        </div>
      )}

      {/* source */}
      {f >= t.came - 4 && (
        <div style={{ position: "absolute", left: 90, top: 1478, fontFamily: UI, fontWeight: 500, fontSize: 26, color: LABEL, opacity: 0.6 + 0.4 * sourceSwap, whiteSpace: "nowrap" }}>{source}</div>
      )}
    </>
  );
};
