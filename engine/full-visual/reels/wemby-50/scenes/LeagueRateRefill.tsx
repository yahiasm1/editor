// `average`: "Now give an average scorer the exact same thirty-one and a half shots. They walk off with about
// thirty-six points."
// The reel's one turn, on his own chances. From the side stands (the Toronto photo's height), his column from
// `attempts` (white to 79 %, 1.58 points a chance) topples toward the court and comes apart: every disc hops back to
// its own spot from the Basketball-Reference shot chart, the top layers split back into his six 0.44 free throw
// wedges on the line. "average": all of them empty at once, and BBR's League Average card (TS% .575) comes in.
// "scorer the exact same": in real game order (play-by-play clock ticking), each piece hops and its BBR mark flashes:
// same places, same count. "31.5": "29 + 0.44 × 6 = 31.64" returns. "They walk off": the league rate is poured
// into each piece in game order, grey to 57.5 % (1.15 points a chance); the counter climbs to 36.4 and rounds to 36.
// No figure stands in for the average scorer: only the fill changes.
// Parts: LeagueRateRefillWorld (camera, shots), LeagueRateRefillFloor (court, basket), LeagueRateRefillDisc (solid).
import React from "react";
import { Img, staticFile } from "remotion";
import { LEAD } from "../../../src/engine/Stage";
import { blurIn, ease, pop, prog, typeOn, useScene } from "../../../src/engine";
import { LeagueRateRefillFloor } from "./LeagueRateRefillFloor";
import { LeagueRateRefillDisc, type LeagueRateRefillMap, type LeagueRateRefillPiece } from "./LeagueRateRefillDisc";
import {
  LRR_FT_A0,
  LRR_FT_A1,
  LRR_FT_MADE,
  LRR_FT_X,
  LRR_FTL,
  LRR_H,
  LRR_R,
  LRR_REST,
  LRR_SHOTS,
  LRR_SLIVER,
  leagueRateRefillBasis,
  leagueRateRefillProject as proj,
  lrrLerp as lerp,
  lrrLerp3 as lerp3,
  lrrRnd as rnd,
  type LeagueRateRefillCam,
  type LeagueRateRefillV3,
} from "./LeagueRateRefillWorld";

const PI = Math.PI;
const LABEL = "#8B949E";
const SOFT = "#C9D1D9";
const HIS = 1.58 / 2; // his fill: 1.58 points of 2
const LEAGUE = 0.575; // the league's: 2 x .575 = 1.15 points of 2
const PER = 2 * LEAGUE; // 1.15 points a chance
const CARD = { x: 540, y: 1300, w: 510 };

// his column as `attempts` left it, beside the court
const COL_X = 972;
const COL_Y = 1392;
const COL_S = 105;
const EL = 0.72;
const SIN_E = Math.sin(EL);
const COS_E = Math.cos(EL);

// the camera: `attempts`' side-stands view, then centred on the court with a slow push
const KA = { eye: [-63, 29, 57] as LeagueRateRefillV3, at: [0, 20.5, 0] as LeagueRateRefillV3, F: 1120, cx: 375, cy: 1092 };
const KB = { eye: [-62, 27.5, 58] as LeagueRateRefillV3, at: [-5, 14, 0] as LeagueRateRefillV3, F: 1520, cx: 540, cy: 1175 };
const KC = { eye: [-60, 27, 56] as LeagueRateRefillV3, at: [-5, 14, 0] as LeagueRateRefillV3, F: 1575, cx: 540, cy: 1180 };

// his 29 shots and 6 free throws in game order (Basketball-Reference play-by-play, 21 Nov 2026)
const CLOCKS: [string, string][] = [
  ["1", "10:46"], ["1", "10:04"], ["1", "7:46"], ["1", "7:03"], ["1", "7:00"], ["1", "2:24"], ["1", "2:00"], ["1", "1:36"], ["1", "1:09"], ["1", "0:31"],
  ["2", "10:14"], ["2", "9:03"], ["2", "8:32"], ["2", "3:29"], ["2", "2:56"], ["3", "11:08"], ["3", "8:04"], ["3", "7:26"], ["3", "1:55"], ["3", "1:25"],
  ["3", "1:19"], ["3", "0:43"], ["4", "11:37"], ["4", "10:16"], ["4", "7:56"], ["4", "7:36"], ["4", "7:15"], ["4", "6:56"], ["4", "6:29"],
];
const FT_CLOCK: [string, string][] = [["1", "9:37"], ["1", "9:37"], ["1", "1:09"], ["2", "9:27"], ["2", "9:27"], ["2", "2:02"]];
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
const ORDER_OF_SHOT: number[] = [];
const ORDER_OF_FT: number[] = [];
ORDER.forEach((it, n) => (it.kind === "shot" ? (ORDER_OF_SHOT[it.i] = n) : (ORDER_OF_FT[it.j] = n)));
const QN = ["", "1st", "2nd", "3rd", "4th"];

type Rot = { tilt?: number };
const rotT = (u: number, v: number, w: number, t: number): [number, number, number] => {
  if (!t) return [u, v, w];
  const w0 = w - LRR_H / 2;
  return [u, v * Math.cos(t) - w0 * Math.sin(t), v * Math.sin(t) + w0 * Math.cos(t) + LRR_H / 2];
};

/** a piece in the column, layer k, the whole column rolled by th about its left foot (toward the court) */
const leagueRateRefillColumnMap = (k: number, th: number, sag: number): LeagueRateRefillMap => (u, v, w) => {
  const W = k * LRR_H + w;
  const vv = v + LRR_R;
  const t = th * (1 + sag * (k / 31) * (k / 31)); // the top bends a little more as it goes
  const v2 = -LRR_R + vv * Math.cos(t) - W * Math.sin(t);
  const W2 = vv * Math.sin(t) + W * Math.cos(t);
  return [COL_X + COL_S * v2, COL_Y - COL_S * u * SIN_E - COL_S * W2 * COS_E];
};

/** a piece on the court, through the camera, tumbling by `tilt` about its own axis */
const leagueRateRefillCourtMap = (cam: LeagueRateRefillCam, B: ReturnType<typeof leagueRateRefillBasis>, x: number, y: number, z: number, r: Rot = {}): LeagueRateRefillMap => (u, v, w) => {
  const [a, b, c] = rotT(u, v, w, r.tilt ?? 0);
  const p = proj(cam, x + a, y + b, z + c, B);
  return [p.x, p.y];
};

/** in flight: the centre on a curve, the shape blending from the column's to the court's */
const leagueRateRefillFlightMap = (from: LeagueRateRefillMap, to: LeagueRateRefillMap, centre: [number, number], m: number): LeagueRateRefillMap => {
  const f0 = from(0, 0, LRR_H / 2);
  const t0 = to(0, 0, LRR_H / 2);
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

export const LeagueRateRefill: React.FC & { keep?: boolean } = () => {
  const { f, fps, scene, cue, endsOn, theme } = useScene();
  const s0 = scene.from - LEAD;
  const t = {
    now: cue("Now"),
    average: cue("average"),
    scorer: cue("scorer"),
    same: cue("same"),
    n315: cue("31.5"),
    shots: cue("shots"),
    they: cue("They"),
    n36: cue("36"),
    points: cue("points"),
    end: scene.to,
  };

  // ---- the camera
  const camAt = (fr: number): LeagueRateRefillCam => {
    const a = prog(fr, s0 + 6, t.average + 4 - s0 - 6, ease.inOut);
    const b = prog(fr, t.average + 4, t.end - t.average - 4, ease.linear);
    const c1 = { eye: lerp3(KA.eye, KB.eye, a), at: lerp3(KA.at, KB.at, a), F: lerp(KA.F, KB.F, a), cx: lerp(KA.cx, KB.cx, a), cy: lerp(KA.cy, KB.cy, a) };
    return { eye: lerp3(c1.eye, KC.eye, b), at: lerp3(c1.at, KC.at, b), F: lerp(c1.F, KC.F, b), cx: lerp(c1.cx, KC.cx, b), cy: lerp(c1.cy, KC.cy, b) };
  };
  const cam = camAt(f);
  const B = leagueRateRefillBasis(cam);
  const P = (x: number, y: number, z: number) => proj(cam, x, y, z, B);

  // ---- the topple: the column leans toward the court and comes apart, top layers first
  const T0 = s0 + 2;
  const th = 1.05 * prog(f, T0, 22, ease.in);
  const detach = (k: number) => T0 + 5 + Math.round((31 - k) * 0.42);
  const flightDur = (k: number) => 15 + Math.round(4 * rnd(k + 51));
  const landOf = (k: number) => detach(k) + flightDur(k);

  // ---- fills: his white drains at once on "average"; the league's grey fills in game order
  const DRAIN = t.average - 1;
  const drainP = prog(f, DRAIN, 14, ease.in);
  const refillStart = Math.max(t.they - 6, endsOn("36", 66));
  const R = (n: number) => refillStart + Math.round(n * 1.62);
  const refillOf = (n: number) => prog(f, R(n), 11, ease.out);
  const fillOf = (n: number) => {
    if (f < R(n)) return { fill: HIS * (1 - drainP), grey: 0 };
    const s = f - R(n) - 11;
    const slosh = s > 0 ? 0.045 * Math.sin(s * 0.5) * Math.exp(-s / 12) : 0;
    return { fill: LEAGUE * refillOf(n) + slosh, grey: 1 };
  };
  const B0 = t.scorer + 2;
  const blinkAt = (n: number) => B0 + Math.round(n * ((t.n315 - 8 - B0) / 35));
  const hopOf = (n: number) => {
    const p = prog(f, blinkAt(n), 12, ease.linear);
    return p > 0 && p < 1 ? 0.75 * Math.sin(PI * p) : 0;
  };

  const marks: React.ReactNode[] = [];
  const rings: React.ReactNode[] = [];
  const shadows: React.ReactNode[] = [];
  const resting: { depth: number; node: React.ReactNode }[] = [];
  const column: { k: number; node: React.ReactNode }[] = [];
  const flying: { order: number; node: React.ReactNode }[] = [];

  const mark = (key: string, x: number, y: number, made: boolean, n: number, small = false) => {
    const c = P(x, y, 0);
    if (!c.ok) return;
    const bl = prog(f, blinkAt(n), 4, ease.linear) * (1 - prog(f, blinkAt(n) + 8, 14, ease.linear));
    const s = (cam.F / c.z) * (small ? 0.3 : 0.36) * (1 + 0.5 * bl);
    const o = 0.85;
    marks.push(
      made ? (
        <ellipse key={key} cx={c.x} cy={c.y} rx={s} ry={s * 0.7} fill="#FFFFFF" opacity={o} stroke="#3A2A12" strokeWidth={1} />
      ) : (
        <path key={key} d={`M${c.x - s} ${c.y - s * 0.7}L${c.x + s} ${c.y + s * 0.7}M${c.x + s} ${c.y - s * 0.7}L${c.x - s} ${c.y + s * 0.7}`} stroke="#FFFFFF" strokeWidth={Math.max(2, s * 0.42)} strokeLinecap="round" opacity={o} />
      ),
    );
    if (bl > 0) {
      const ring = prog(f, blinkAt(n), 16, ease.out);
      const r = (cam.F / c.z) * (0.6 + 1.3 * ring);
      rings.push(<ellipse key={`r${key}`} cx={c.x} cy={c.y} rx={r} ry={r * 0.68} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={(1 - ring) * 0.9} />);
      rings.push(<ellipse key={`g${key}`} cx={c.x} cy={c.y} rx={s * 2.2} ry={s * 1.5} fill="#FFFFFF" opacity={0.35 * bl} style={{ filter: "blur(6px)" }} />);
    }
  };
  const drainRing = (key: string, x: number, y: number) => {
    const p = prog(f, DRAIN + 2, 18, ease.out);
    if (p <= 0 || p >= 1) return;
    const c = P(x, y, 0);
    if (!c.ok) return;
    const r = (cam.F / c.z) * LRR_R * (1.05 + 0.9 * p);
    rings.push(<ellipse key={`d${key}`} cx={c.x} cy={c.y} rx={r} ry={r * 0.68} fill="none" stroke="#F7F1E4" strokeWidth={2.5} opacity={(1 - p) * 0.8} />);
  };

  // one piece: from the column (layer k) to its court spot (x, y, rest z), with its fill and its blink
  const piece = (key: string, n: number, k: number, x: number, y: number, rz: number, shape: (fly: number) => { a0: number; a1: number; seam?: number }, detail = 0.8) => {
    const det = detach(k);
    const land = landOf(k);
    const fl = fillOf(n);
    const glowFill = f >= R(n) ? (1 - prog(f, R(n) + 4, 12, ease.linear)) * 0.45 : 0;
    const glowDrain = f >= DRAIN ? Math.sin(PI * prog(f, DRAIN, 14, ease.linear)) * 0.5 : 0;
    if (f < det) {
      const sh = shape(0);
      column.push({ k, node: <LeagueRateRefillDisc key={key} id={key} map={leagueRateRefillColumnMap(k, th, 0.25)} p={{ a0: sh.a0, a1: sh.a1, o: 1, fill: fl.fill, grey: fl.grey, seam: sh.seam }} detail={0.9} /> });
      return;
    }
    const flight = prog(f, det, land - det, (q) => q);
    const tumble = (rnd(k + 9) > 0.5 ? 1 : -1) * (1.2 + 1.4 * rnd(k + 17));
    if (flight < 1) {
      const sh = shape(flight);
      const fromM = leagueRateRefillColumnMap(k, th, 0.25);
      const toM = leagueRateRefillCourtMap(cam, B, x, y, rz, { tilt: tumble * Math.sin(PI * flight) * 0.5 });
      const c0 = fromM(0, 0, LRR_H / 2);
      const c1 = toM(0, 0, LRR_H / 2);
      const ctrl: [number, number] = [lerp(c0[0], c1[0], 0.45), Math.min(c0[1], c1[1]) - 90 - 120 * rnd(k + 3)];
      const ef = ease.inOut(flight);
      flying.push({ order: land, node: <LeagueRateRefillDisc key={key} id={key} map={leagueRateRefillFlightMap(fromM, toM, bez(c0, ctrl, c1, ef), smooth(flight))} p={{ a0: sh.a0, a1: sh.a1, o: 1, fill: fl.fill, grey: fl.grey, seam: sh.seam }} detail={detail} /> });
      // its shadow finds the floor as it comes down
      const s = P(x + 0.06, y + 0.1, 0);
      if (s.ok && flight > 0.55) {
        const k2 = cam.F / s.z;
        shadows.push(<ellipse key={`s${key}`} cx={s.x} cy={s.y} rx={k2 * LRR_R * 1.1} ry={k2 * LRR_R * 0.75} fill="#2A1504" opacity={0.5 * prog(flight, 0.55, 0.45, ease.linear)} style={{ filter: "blur(6px)" }} />);
      }
      return;
    }
    // on the floor: a landing bounce, the blink hop
    const sh = shape(1);
    const since = f - land;
    const bounce = since < 10 ? 0.22 * Math.abs(Math.sin((PI * since) / 10)) * (1 - since / 10) : 0;
    const z = rz + bounce + hopOf(n);
    const s = P(x + 0.06, y + 0.1, 0);
    if (s.ok) {
      const k2 = cam.F / s.z;
      shadows.push(<ellipse key={`s${key}`} cx={s.x} cy={s.y} rx={k2 * LRR_R * 1.1} ry={k2 * LRR_R * 0.75} fill="#2A1504" opacity={0.5 * Math.max(0.3, 1 - (z - rz) / 1.4)} style={{ filter: `blur(${(2 + (z - rz) * 6).toFixed(1)}px)` }} />);
    }
    const c = P(x, y, z);
    resting.push({
      depth: (c.ok ? c.z : 0) - rz * 20 - hopOf(n) * 30,
      node: <LeagueRateRefillDisc key={key} id={key} map={leagueRateRefillCourtMap(cam, B, x, y, z)} p={{ a0: sh.a0, a1: sh.a1, o: 1, fill: fl.fill, grey: fl.grey, seam: sh.seam, glow: (since < 8 ? (1 - since / 8) * 0.5 : 0) + glowDrain + glowFill }} detail={detail} />,
    });
  };

  // ---- the 29 discs
  LRR_SHOTS.forEach(([no, , , made], i) => {
    const r = LRR_REST[i];
    const n = ORDER_OF_SHOT[i];
    mark(`m${no}`, r.x, r.y, !!made, n);
    drainRing(`${no}`, r.x, r.y);
    piece(`lrr-d${no}`, n, i, r.x, r.y, r.z, () => ({ a0: 0, a1: 2 * PI }));
  });

  // ---- the six free throw wedges: fused on top of the column (2 + 0.64 of a disc), split, back to the line
  LRR_FT_X.forEach((x, j) => {
    const layer = 29 + Math.floor(j / 2);
    const left = j % 2 === 0;
    const sa0 = left ? PI / 2 : -PI / 2 + LRR_SLIVER;
    const sa1 = left ? (3 * PI) / 2 - LRR_SLIVER : PI / 2;
    const n = ORDER_OF_FT[j];
    mark(`fm${j}`, x + 0.25, LRR_FTL, !!LRR_FT_MADE[j], n, true);
    drainRing(`f${j}`, x, LRR_FTL);
    const shape = (fly: number) => {
      // un-fuse as it leaves, then turn to lie on the line as the freethrow scene laid it
      const fu = 1 - prog(f, detach(layer) - 4, 8, ease.inOut);
      let a0 = sa0;
      let a1 = sa1;
      if (layer < 31) {
        if (left) a1 = lerp(sa1, (3 * PI) / 2, fu);
        else a0 = lerp(sa0, -PI / 2, fu);
      } else if (left) {
        a1 = lerp(sa1, PI / 2 + 0.64 * 2 * PI, fu);
      } else {
        a0 = lerp(sa0, sa1, fu);
      }
      const m = smooth(fly);
      const seam = f >= detach(layer) - 6 ? Math.sin(PI * prog(f, detach(layer) - 6, 12, ease.linear)) : 0;
      return { a0: lerp(a0, LRR_FT_A0, m), a1: lerp(a1, LRR_FT_A1, m), seam };
    };
    piece(`lrr-w${j}`, n, layer, x, LRR_FTL, 0, shape, 1);
  });

  resting.sort((a, b) => b.depth - a.depth);
  column.sort((a, b) => a.k - b.k);
  flying.sort((a, b) => a.order - b.order);

  // ---- the counter: every piece poured adds its share of 1.15
  let pts = 0;
  ORDER.forEach((it, n) => {
    pts += (it.kind === "shot" ? PER : 0.44 * PER) * refillOf(n);
  });
  const done = f >= R(34) + 11;
  const shownPts = done ? 36.4 : Math.min(36.4, pts);
  const round = prog(f, t.n36 + 10, 10, ease.inOut);

  // ---- the pour: a grey hairline from BBR's .575 cell to the piece being filled
  const CELL = { x: CARD.x + CARD.w - 80, y: CARD.y + 18 };
  let pour: React.ReactNode = null;
  const fillingN = ORDER.findIndex((_, n) => f >= R(n) && f < R(n) + 11);
  if (f >= refillStart - 4 && f < R(34) + 16) {
    const n = fillingN >= 0 ? fillingN : f < refillStart ? 0 : 34;
    const it = ORDER[n];
    const x = it.kind === "shot" ? LRR_REST[it.i].x : LRR_FT_X[it.j];
    const y = it.kind === "shot" ? LRR_REST[it.i].y : LRR_FTL;
    const z = it.kind === "shot" ? LRR_REST[it.i].z : 0;
    const c = P(x, y, z + LRR_H + 0.1);
    const o = prog(f, refillStart - 4, 6, ease.linear) * (1 - prog(f, R(34) + 8, 8, ease.linear));
    if (c.ok) {
      const mx = (c.x + CELL.x) / 2;
      const my = Math.min(c.y, CELL.y) - 70;
      pour = (
        <g opacity={o}>
          <path d={`M${CELL.x} ${CELL.y}Q${mx} ${my} ${c.x} ${c.y}`} fill="none" stroke="#C9D1D9" strokeWidth={2.5} strokeOpacity={0.85} />
          <circle cx={c.x} cy={c.y} r={5} fill="#E6EDF3" />
          <circle cx={CELL.x} cy={CELL.y} r={4} fill="#C9D1D9" />
        </g>
      );
    }
  }

  // ---- the game clock while the marks blink
  const blinkN = Math.max(0, Math.min(34, Math.floor(((f - B0) / (t.n315 - 8 - B0)) * 35)));
  const bItem = ORDER[blinkN];
  const clk = bItem.kind === "shot" ? CLOCKS[bItem.i] : FT_CLOCK[bItem.j];
  const clockO = prog(f, B0 - 4, 6, ease.linear) * (1 - prog(f, t.n315 - 10, 8, ease.linear));

  const line1 = blurIn(f, t.n315 - 8, { dur: 8, rise: 10 });
  const line2 = typeOn("31.64 × 2 × .575", f, t.shots - 2, fps, 34).text;
  const MONO = theme.font.mono;
  const UI = theme.font.ui;
  // the court fades in under the equations; at the start (the column view) it is the full stage, as `attempts` left it
  const maskTop = lerp(470, 790, prog(f, s0 + 6, t.average + 4 - s0 - 6, ease.inOut));
  const MASK = `linear-gradient(to bottom, transparent ${maskTop}px, #000 ${maskTop + 70}px, #000 1440px, transparent 1560px)`;
  const cardIn = prog(f, t.average - 2, 12, ease.out);
  const cardRise = (1 - cardIn) * 40;
  const countIn = prog(f, refillStart - 6, 10, ease.out);
  // `extra` redraws this picture and takes over in place (keep): what it does not redraw (the .575 cell's box, the
  // card's source line, the shot chart line) leaves in the silence before the switch, never in one frame
  const handOut = 1 - prog(f, t.end - LEAD - 9, 8, ease.inOut);

  return (
    <>
      <div style={{ position: "absolute", inset: 0, maskImage: MASK, WebkitMaskImage: MASK }}>
        <LeagueRateRefillFloor cam={cam} f={f} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {marks}
          {rings}
          {shadows}
          {resting.map((r) => r.node)}
          {/* the column's weight on the ground, gone as it comes apart */}
          <ellipse cx={COL_X + 10} cy={COL_Y + 8} rx={LRR_R * COL_S * 1.25} ry={LRR_R * COL_S * SIN_E * 0.95} fill="#000" opacity={0.55 * (1 - prog(f, T0 + 4, 16, ease.linear))} style={{ filter: "blur(14px)" }} />
          {column.map((c) => c.node)}
          {flying.map((c) => c.node)}
          {pour}
        </svg>
      </div>

      {/* the play-by-play clock of the piece that blinks */}
      {clockO > 0.01 && (
        <div style={{ position: "absolute", left: 60, top: 548, opacity: clockO }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 58, color: "#F0F3F6", whiteSpace: "pre", fontVariantNumeric: "tabular-nums" }}>
            {`${QN[Number(clk[0])]} Q  ${clk[1].padStart(5, " ")}`}
          </div>
          <div style={{ fontFamily: UI, fontWeight: 500, fontSize: 30, color: LABEL, marginTop: 4 }}>
            {bItem.kind === "shot" ? `shot ${bItem.i + 1} of 29` : `free throw ${bItem.j + 1} of 6`}
          </div>
        </div>
      )}

      {/* the same chances, as `attempts` wrote them */}
      {f >= t.n315 - 8 && (
        <>
          <div style={{ position: "absolute", left: 60, top: 548, fontFamily: MONO, fontWeight: 700, fontSize: 58, color: "#F0F3F6", whiteSpace: "pre", ...line1 }}>
            29 + <span style={{ color: "#F2B33D" }}>0.44</span> × 6 ={" "}
            <span style={{ display: "inline-block", color: "#FFFFFF", transform: `scale(${(1 + 0.16 * (1 - prog(f, t.n315, 12))).toFixed(3)})`, transformOrigin: "0% 60%" }}>31.64</span>
          </div>
          <div style={{ position: "absolute", left: 62, top: 624, fontFamily: UI, fontWeight: 500, fontSize: 30, color: LABEL, ...blurIn(f, t.n315 + 2, { dur: 8, rise: 6 }) }}>
            the exact same shooting chances
          </div>
        </>
      )}
      {f >= t.shots - 2 && (
        <div style={{ position: "absolute", left: 60, top: 690, fontFamily: MONO, fontWeight: 700, fontSize: 58, color: "#F0F3F6", whiteSpace: "pre", fontVariantNumeric: "tabular-nums" }}>
          {line2.slice(0, 10)}
          <span style={{ color: "#AEB6C0" }}>{line2.slice(10)}</span>
          {countIn > 0 && (
            <span style={{ opacity: countIn }}>
              {round >= 0.5 ? " ≈ " : " = "}
              <span style={{ display: "inline-block", color: "#FFFFFF", transform: `scale(${(1 + 0.18 * Math.sin(PI * round) + 0.1 * (done ? 1 - prog(f, R(34) + 11, 10) : 0)).toFixed(3)})`, transformOrigin: "0% 60%" }}>
                {round >= 0.5 ? "36" : shownPts.toFixed(1)}
              </span>
            </span>
          )}
        </div>
      )}
      {f >= t.shots + 6 && (
        <div style={{ position: "absolute", left: 62, top: 766, fontFamily: UI, fontWeight: 500, fontSize: 30, color: round >= 0.5 ? SOFT : LABEL, ...blurIn(f, t.shots + 6, { dur: 8, rise: 6 }) }}>
          {round >= 0.5 ? "points: same chances, league average shooting" : "points at the league rate, 1.15 a chance"}
        </div>
      )}

      {/* Basketball-Reference, League Average 2026-27: the rate poured into every chance */}
      {f >= t.average - 2 && (
        <div
          style={{
            position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: 132, borderRadius: 16, background: "#161B22", border: "1px solid #30363D",
            boxShadow: "0 20px 50px rgba(0,0,0,0.55)", opacity: cardIn, transform: `translateY(${cardRise.toFixed(1)}px)`,
          }}
        >
          <div style={{ position: "absolute", left: 18, top: 18, width: 76, height: 48, display: "flex", alignItems: "center", ...pop(f, t.average + 2) }}>
            <Img src={staticFile("wemby-50/leagueraterefill-logoman.svg")} style={{ width: 70, display: "block" }} />
          </div>
          <div style={{ position: "absolute", left: 110, top: 10, fontFamily: UI, fontWeight: 700, fontSize: 32, color: SOFT }}>League Average</div>
          <div style={{ position: "absolute", left: 110, top: 50, fontFamily: UI, fontWeight: 500, fontSize: 24, color: LABEL }}>2026-27 · TS%</div>
          <div style={{ position: "absolute", left: CARD.w - 140, top: 18, width: 120, height: 56, borderRadius: 10, border: "2px solid rgba(139,148,158,0.8)", background: "rgba(139,148,158,0.18)", opacity: handOut }} />
          <div style={{ position: "absolute", left: CARD.w - 140, top: 22, width: 120, textAlign: "center", fontFamily: UI, fontWeight: 800, fontSize: 40, color: "#E6EDF3", fontVariantNumeric: "tabular-nums" }}>.575</div>
          <div style={{ position: "absolute", left: 16, right: 16, top: 88, height: 1, background: "#30363D", opacity: handOut }} />
          <div style={{ position: "absolute", left: 18, top: 98, fontFamily: UI, fontSize: 20, color: LABEL, whiteSpace: "nowrap", ...blurIn(f, t.average + 8, { dur: 8 }), ...(handOut < 1 ? { opacity: handOut } : {}) }}>
            Basketball-Reference, League Average 2026-27
          </div>
        </div>
      )}

      <div style={{ position: "absolute", left: 62, top: 1462, fontFamily: UI, fontSize: 24, color: "#AEB6C0", textShadow: "0 1px 3px #000, 0 0 14px rgba(0,0,0,0.95)", ...(f >= t.average + 8 ? blurIn(f, t.average + 8, { dur: 8 }) : { opacity: 0 }), ...(handOut < 1 ? { opacity: handOut } : {}) }}>
        his spots: Basketball-Reference shot chart and play-by-play
      </div>
    </>
  );
};
// `extra` starts on this very picture (same camera, discs, equations, card) and lifts it off itself
LeagueRateRefill.keep = true;
