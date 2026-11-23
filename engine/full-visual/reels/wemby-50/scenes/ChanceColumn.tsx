// `attempts`: "Add it up and Wemby used about thirty-one and a half shots. Fifty points on those is one point five
// eight points every time he shot."
// The camera rises from the free throw line (where `freethrow` left his six 0.44 wedges) to the side stands, the
// Toronto photo's height and tilt, over the whole half court; his 29 discs drop onto their real spots
// (Basketball-Reference shot chart), piling at the rim. "up": every disc lifts at once, its shadow left on the
// boards, and they stream in a curve into one heavy column beside the court; the six wedges come last and fuse on
// top into 2.64 of a disc. "29 + 0.44 x 6 = 31.64" writes itself as they land. "50": a white 50 drops onto the
// column and melts into it; the white runs down and every disc fills to the same level: "50 / 31.64 = 1.58".
// "every time he shot": one disc slides out, grows and stands on its edge to face you, its fill read on a
// 0 / 1 / 2 points scale: 1.58.
// Parts: ChanceColumnWorld (camera, his shots), ChanceColumnFloor (the court and basket), ChanceColumnDisc (the solid).
import React from "react";
import { Easing } from "remotion";
import { LEAD } from "../../../src/engine/Stage";
import { arrive, blurIn, countTo, ease, pop, prog, typeOn, useScene } from "../../../src/engine";
import { ChanceColumnFloor } from "./ChanceColumnFloor";
import { ChanceColumnDisc, type ChanceColumnMap, type ChanceColumnPiece } from "./ChanceColumnDisc";
import {
  CC_FT_A0,
  CC_FT_A1,
  CC_FT_MADE,
  CC_FT_X,
  CC_FTL,
  CC_H,
  CC_R,
  CC_REST,
  CC_SHOTS,
  CC_SLIVER,
  chanceColumnBasis,
  chanceColumnProject as proj,
  ccLerp as lerp,
  ccLerp3 as lerp3,
  ccRnd as rnd,
  type ChanceColumnCam,
  type ChanceColumnV3,
} from "./ChanceColumnWorld";

const PI = Math.PI;
const GOLD = "#F2B33D";
const LABEL = "#8B949E";
const MONO = "'JetBrains Mono', monospace";
const FILL = 1.58 / 2; // 1.58 points of a possible 2: every disc filled to 79 %

// the column: beside the court, seen from the same height, heavier and nearer
const COL_X = 860;
const COL_Y = 1392;
const COL_S = 105; // px per ft
const EL = 0.72; // the view's elevation: a flat disc reads 0.66 as tall as wide, like the discs on the floor
const SIN_E = Math.sin(EL);
const COS_E = Math.cos(EL);
const LAYER = COL_S * CC_H * COS_E;
const SLIDE_K = 14; // the disc pulled out: the 15th of the stack

type Rot = { spin?: number; tilt?: number };
const rot = (u: number, v: number, w: number, r: Rot): [number, number, number] => {
  let a = u;
  let b = v;
  if (r.spin) {
    const c = Math.cos(r.spin);
    const s = Math.sin(r.spin);
    a = u * c - v * s;
    b = u * s + v * c;
  }
  const t = r.tilt ?? 0;
  if (!t) return [a, b, w];
  const w0 = w - CC_H / 2;
  return [a * Math.cos(t) - w0 * Math.sin(t), b, a * Math.sin(t) + w0 * Math.cos(t) + CC_H / 2];
};

/** a disc lying in the column view: centre of its bottom face at (X, Y), S px per ft */
const chanceColumnColMap = (X: number, Y: number, S: number, r: Rot = {}): ChanceColumnMap => (u, v, w) => {
  const [a, b, c] = rot(u, v, w, r);
  return [X + S * b, Y - S * a * SIN_E - S * c * COS_E];
};

/** a disc on the court, through the camera */
const chanceColumnCourtMap = (cam: ChanceColumnCam, B: ReturnType<typeof chanceColumnBasis>, x: number, y: number, z: number, r: Rot = {}): ChanceColumnMap => (u, v, w) => {
  const [a, b, c] = rot(u, v, w, r);
  const p = proj(cam, x + a, y + b, z + c, B);
  return [p.x, p.y];
};

/** a disc in flight: its centre on a curve, its shape blending from the court's to the column's */
const chanceColumnFlightMap = (from: ChanceColumnMap, to: ChanceColumnMap, centre: [number, number], m: number): ChanceColumnMap => {
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

type Key = { at: number; dur: number; c: { eye: ChanceColumnV3; at: ChanceColumnV3; F: number; cx: number; cy: number } };
function chanceColumnCamAt(f: number, keys: Key[]): ChanceColumnCam {
  let c = keys[0].c;
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f <= k.at) break;
    const p = prog(f, k.at, k.dur, ease.inOut);
    c = { eye: lerp3(c.eye, k.c.eye, p), at: lerp3(c.at, k.c.at, p), F: lerp(c.F, k.c.F, p), cx: lerp(c.cx, k.c.cx, p), cy: lerp(c.cy, k.c.cy, p) };
  }
  return c;
}

const useChanceColumnT = () => {
  const { cue, endsOn, scene } = useScene();
  return {
    s0: scene.from - LEAD,
    end: scene.to,
    up: cue("up"),
    and: cue("and"),
    wemby: cue("Wemby"),
    used: cue("used"),
    t315: cue("31.5"),
    shots: cue("shots"),
    t50: cue("50"),
    on: cue("on"),
    those: cue("those"),
    t158: cue("1.58"),
    points2: cue("points", 2),
    every: cue("every"),
    shot: cue("shot"),
    e315: endsOn("31.5", 20),
    e158: endsOn("1.58", 24),
  };
};

export const ChanceColumn: React.FC = () => {
  const { f, ground } = useScene();
  const t = useChanceColumnT();

  // ---- the one camera: from the free throw line (freethrow's last frame) up to the side stands
  const K0 = { eye: [0, 31.73, 22.54] as ChanceColumnV3, at: [0, 17.6, 0] as ChanceColumnV3, F: 2200, cx: 540, cy: 930 };
  const K1 = { eye: [-66, 30, 60] as ChanceColumnV3, at: [0, 21, 0] as ChanceColumnV3, F: 1120, cx: 375, cy: 1090 };
  const K2 = { eye: [-63, 29, 57] as ChanceColumnV3, at: [0, 20.5, 0] as ChanceColumnV3, F: 1120, cx: 375, cy: 1092 };
  const cam = chanceColumnCamAt(f, [
    { at: t.s0, dur: 1, c: K0 },
    { at: t.s0 + 2, dur: t.up + 8 - t.s0, c: K1 },
    { at: t.up + 10, dur: t.end - t.up, c: K2 },
  ]);
  const B = chanceColumnBasis(cam);
  const P = (x: number, y: number, z: number) => proj(cam, x, y, z, B);

  // ---- the stack: layer k's bottom face sits at y = COL_Y - k * LAYER, squashed a little as each disc lands
  const L = (i: number) => t.up + 16 + Math.round(i * 1.1); // whole disc i lands
  const WL = (j: number) => t.up + 46 + j * 2; // free throw wedge j lands
  const FUSE = t.up + 60;
  const landedAt = (fr: number) => {
    let n = 0;
    for (let i = 0; i < 29; i++) if (fr >= L(i)) n++;
    return n;
  };
  let squash = 0;
  for (let i = 0; i < 29; i++) {
    const d = f - L(i);
    if (d >= 0 && d < 10) squash += 3.2 * Math.sin((PI * d) / 10) * (1 - d / 10);
  }
  for (let j = 0; j < 6; j++) {
    const d = f - WL(j);
    if (d >= 0 && d < 10) squash += 2.4 * Math.sin((PI * d) / 10) * (1 - d / 10);
  }
  const settle = f >= FUSE + 4 ? 5 * Math.sin((PI * (f - FUSE - 4)) / 14) * Math.max(0, 1 - (f - FUSE - 4) / 28) : 0;

  // the pulled disc and what happens above it
  const slide0 = t.points2 - 4;
  const slideP = prog(f, slide0, t.every + 22 - slide0, ease.inOut);
  const drop = prog(f, slide0 + 16, 12, Easing.in(Easing.quad)) - (f > slide0 + 28 ? 0.06 * Math.sin((PI * (f - slide0 - 28)) / 8) * Math.max(0, 1 - (f - slide0 - 28) / 16) : 0);
  const aside = arrive(f, slide0 + 6, 30);
  const colX = COL_X + 112 * aside;
  const layerY = (k: number) => {
    let kk = k;
    if (k > SLIDE_K && f >= slide0) kk = k - drop;
    return COL_Y - kk * LAYER + (squash + settle) * Math.min(1, kk / 30);
  };

  // ---- fill: the 50 melts into the top and runs down
  const fillAt = (k: number) => t.t50 + 8 + Math.round((31 - k) * 1.6);
  const fillOf = (k: number) => {
    const s = fillAt(k);
    if (f < s) return 0;
    const p = prog(f, s, 12, ease.out);
    const slosh = f > s + 12 ? 0.05 * Math.sin((f - s - 12) * 0.45) * Math.exp(-(f - s - 12) / 14) : 0;
    return FILL * p + slosh;
  };

  // ---- the court discs: on their spots, then up and into the column
  const dropAt = (i: number) => t.s0 + 3 + Math.round(i * 0.75);
  const LIFT = (i: number) => t.up - 1 + (i % 3 === 0 ? 0 : 1);
  const resting: { key: string; depth: number; node: React.ReactNode }[] = [];
  const shadows: React.ReactNode[] = [];
  const flying: { order: number; node: React.ReactNode }[] = [];
  const stacked: { k: number; node: React.ReactNode }[] = [];
  const marks: React.ReactNode[] = [];

  const columnPiece = (k: number, p: ChanceColumnPiece, key: string, extraX = 0) => {
    if (k === SLIDE_K && f >= slide0) return;
    stacked.push({ k, node: <ChanceColumnDisc key={key} id={key} map={chanceColumnColMap(colX + extraX, layerY(k), COL_S)} p={p} /> });
  };

  CC_SHOTS.forEach(([n, , , made], i) => {
    const r = CC_REST[i];
    const id = `cc-d${n}`;
    const d0 = dropAt(i);
    if (f < d0) return;
    // BBR's glyph on the boards under the disc
    const mo = prog(f, d0 + 4, 6);
    const mc = P(r.x, r.y, 0);
    if (mc.ok) {
      const s = (cam.F / mc.z) * 0.36;
      marks.push(
        made ? (
          <ellipse key={`m${n}`} cx={mc.x} cy={mc.y} rx={s} ry={s * 0.7} fill="#FFFFFF" opacity={mo * 0.95} stroke="#3A2A12" strokeWidth={1} />
        ) : (
          <path key={`m${n}`} d={`M${mc.x - s} ${mc.y - s * 0.7}L${mc.x + s} ${mc.y + s * 0.7}M${mc.x + s} ${mc.y - s * 0.7}L${mc.x - s} ${mc.y + s * 0.7}`} stroke="#FFFFFF" strokeWidth={Math.max(2, s * 0.42)} strokeLinecap="round" opacity={mo} />
        ),
      );
    }
    const lift = LIFT(i);
    const land = L(i);
    if (f >= land) {
      columnPiece(i, { a0: 0, a1: 2 * PI, o: 1, fill: fillOf(i), glow: (1 - prog(f, land, 8)) * 0.8 + (f >= fillAt(i) ? (1 - prog(f, fillAt(i), 10)) * 0.6 : 0) }, id);
      return;
    }
    // on the floor: dropped in, then a press and a lift
    const dp = prog(f, d0, 7, ease.in);
    const bounce = f > d0 + 7 ? 0.12 * Math.sin(PI * prog(f, d0 + 7, 6, ease.linear)) : 0;
    let z = r.z + (1 - dp) * 2.2 + bounce;
    if (f >= lift - 3 && f < lift) z -= 0.05 * Math.sin((PI * (f - lift + 3)) / 3);
    const up = prog(f, lift, 9, ease.out);
    z += 1.5 * up;
    const sh = P(r.x + 0.06, r.y + 0.1, 0);
    if (sh.ok) {
      const s = cam.F / sh.z;
      const fade = Math.max(0, 1 - (z - r.z) / 3.2) * prog(f, d0 + 2, 6);
      shadows.push(<ellipse key={`s${n}`} cx={sh.x} cy={sh.y} rx={s * CC_R * 1.1} ry={s * CC_R * 0.75} fill="#2A1504" opacity={0.5 * fade} style={{ filter: `blur(${(2 + (z - r.z) * 5).toFixed(1)}px)` }} />);
    }
    const flight = prog(f, lift + 8, land - lift - 8, (x) => Math.pow(x, 1.7));
    const spinDir = rnd(n + 40) > 0.5 ? 1 : -1;
    const tilt = Math.sin(PI * flight) * (0.35 + 0.4 * rnd(n + 7)) * spinDir;
    const court = chanceColumnCourtMap(cam, B, r.x, r.y, z, { tilt: tilt * up });
    const o = prog(f, d0, 3);
    if (flight <= 0) {
      const c = P(r.x, r.y, z);
      resting.push({ key: id, depth: (c.ok ? c.z : 0) - r.z * 20, node: <ChanceColumnDisc key={id} id={id} map={court} p={{ a0: 0, a1: 2 * PI, o, glow: up * 0.5 }} detail={0.7} /> });
      return;
    }
    const target = chanceColumnColMap(colX, layerY(i), COL_S, { tilt });
    const c0 = court(0, 0, 0);
    const c1 = target(0, 0, 0);
    const ctrl: [number, number] = [lerp(c0[0], c1[0], 0.55 + 0.15 * rnd(n)), Math.min(c0[1], c1[1]) - 300 - 160 * rnd(n + 3)];
    const centre = bez(c0, ctrl, c1, flight);
    flying.push({ order: land, node: <ChanceColumnDisc key={id} id={id} map={chanceColumnFlightMap(court, target, centre, smooth(flight))} p={{ a0: 0, a1: 2 * PI, o: 1, glow: 0.3 * (1 - flight) }} /> });
  });

  // ---- the six free throw wedges: last up, then three layers of two that fuse into 2.64
  CC_FT_X.forEach((x, j) => {
    const id = `cc-w${j}`;
    const layer = 29 + Math.floor(j / 2);
    const left = j % 2 === 0;
    // in the stack each pair lies as two halves of one disc, each shaved to 0.44
    const sa0 = left ? PI / 2 : -PI / 2 + CC_SLIVER;
    const sa1 = left ? (3 * PI) / 2 - CC_SLIVER : PI / 2;
    // fusing: layers 29 and 30 close into whole discs, layer 31 keeps 0.64 of one
    const fu = prog(f, FUSE + (layer - 29) * 3, 14, ease.inOut);
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
    const seam = f >= FUSE ? Math.sin(PI * prog(f, FUSE + (layer - 29) * 3, 16, ease.linear)) : 0;
    const land = WL(j);
    if (f >= land) {
      columnPiece(layer, { a0, a1, o: 1, fill: fillOf(layer), seam, glow: (1 - prog(f, land, 8)) * 0.8 + (f >= fillAt(layer) ? (1 - prog(f, fillAt(layer), 10)) * 0.6 : 0) }, id);
      return;
    }
    const lift = t.up + 12 + j * 2;
    const up = prog(f, lift, 9, ease.out);
    const z = 1.5 * up;
    const sh = P(x + 0.06, CC_FTL + 0.1, 0);
    if (sh.ok) {
      const s = cam.F / sh.z;
      shadows.push(<ellipse key={`ws${j}`} cx={sh.x + s * 0.3} cy={sh.y} rx={s * CC_R * 0.6} ry={s * CC_R * 0.7} fill="#2A1504" opacity={0.45 * Math.max(0, 1 - z / 3)} style={{ filter: `blur(${(2 + z * 5).toFixed(1)}px)` }} />);
    }
    const flight = prog(f, lift + 8, land - lift - 8, (q) => Math.pow(q, 1.7));
    const fa0 = lerp(CC_FT_A0, sa0, smooth(flight));
    const fa1 = lerp(CC_FT_A1, sa1, smooth(flight));
    const court = chanceColumnCourtMap(cam, B, x, CC_FTL, z);
    if (flight <= 0) {
      const c = P(x, CC_FTL, 0);
      resting.push({ key: id, depth: c.ok ? c.z : 0, node: <ChanceColumnDisc key={id} id={id} map={court} p={{ a0: CC_FT_A0, a1: CC_FT_A1, o: 1, glow: up * 0.5 }} /> });
      return;
    }
    const target = chanceColumnColMap(colX, layerY(layer), COL_S);
    const c0 = court(0, 0, 0);
    const c1 = target(0, 0, 0);
    const ctrl: [number, number] = [lerp(c0[0], c1[0], 0.6), Math.min(c0[1], c1[1]) - 260 - 40 * j];
    flying.push({ order: land, node: <ChanceColumnDisc key={id} id={id} map={chanceColumnFlightMap(court, target, bez(c0, ctrl, c1, flight), smooth(flight))} p={{ a0: fa0, a1: fa1, o: 1 }} /> });
  });
  // the six free throw marks stay on the line once the wedges are gone
  CC_FT_X.forEach((x, j) => {
    const c = P(x + 0.25, CC_FTL, 0);
    if (!c.ok || f < t.up + 12 + j * 2) return;
    const s = (cam.F / c.z) * 0.3;
    const o = prog(f, t.up + 14 + j * 2, 6) * 0.9;
    marks.push(
      CC_FT_MADE[j] ? (
        <ellipse key={`fm${j}`} cx={c.x} cy={c.y} rx={s} ry={s * 0.7} fill="#FFFFFF" opacity={o} stroke="#3A2A12" strokeWidth={1} />
      ) : (
        <path key={`fm${j}`} d={`M${c.x - s} ${c.y - s * 0.7}L${c.x + s} ${c.y + s * 0.7}M${c.x + s} ${c.y - s * 0.7}L${c.x - s} ${c.y + s * 0.7}`} stroke="#FFFFFF" strokeWidth={Math.max(2, s * 0.42)} strokeLinecap="round" opacity={o} />
      ),
    );
  });
  resting.sort((a, b) => b.depth - a.depth);
  stacked.sort((a, b) => a.k - b.k);
  flying.sort((a, b) => a.order - b.order);

  // ---- the pulled disc: out of the stack, large, stood on its edge to face you
  const BX = 430;
  const BY = 1085;
  const BS = 280;
  const TIP = PI / 2 - EL - 0.3;
  let big: React.ReactNode = null;
  let bigBounds: { minx: number; maxx: number; miny: number; maxy: number } | null = null;
  if (f >= slide0) {
    const s = slideP;
    const from: [number, number] = [COL_X + 112 * aside, layerY(SLIDE_K) - (CC_H / 2) * COL_S * COS_E];
    const to: [number, number] = [BX, BY];
    const c = bez(from, [lerp(from[0], to[0], 0.2) - 160, from[1] + 120], to, smooth(s));
    const S = lerp(COL_S, BS, smooth(prog(f, slide0 + 6, t.every + 22 - slide0 - 6, ease.inOut)));
    const tilt = TIP * smooth(prog(f, slide0 + 12, t.every + 20 - slide0 - 12, ease.inOut));
    const breathe = f > t.shot ? 1 + 0.02 * prog(f, t.shot, t.end - t.shot, ease.linear) : 1;
    const map0 = chanceColumnColMap(0, 0, S * breathe, { tilt });
    const mid = map0(0, 0, CC_H / 2);
    const map = chanceColumnColMap(c[0] - mid[0], c[1] - mid[1], S * breathe, { tilt });
    const level = prog(f, slide0 + 24, 24, ease.inOut);
    const slosh = f > slide0 + 34 ? 0.035 * Math.sin((f - slide0 - 34) * 0.32) * Math.exp(-(f - slide0 - 34) / 30) : 0;
    big = <ChanceColumnDisc key="cc-big" id="cc-big" map={map} p={{ a0: 0, a1: 2 * PI, o: 1, fill: FILL + slosh, level }} detail={2} />;
    let minx = Infinity;
    let maxx = -Infinity;
    let miny = Infinity;
    let maxy = -Infinity;
    for (let k = 0; k < 64; k++) {
      const q = map(CC_R * Math.cos((k / 64) * 2 * PI), CC_R * Math.sin((k / 64) * 2 * PI), CC_H);
      minx = Math.min(minx, q[0]);
      maxx = Math.max(maxx, q[0]);
      miny = Math.min(miny, q[1]);
      maxy = Math.max(maxy, q[1]);
    }
    bigBounds = { minx, maxx, miny, maxy };
  }
  const dim = 0.62 * prog(f, slide0 + 6, 26);

  // ---- the column's ground shadow and brackets
  const nStack = landedAt(f);
  const colShadowO = Math.min(1, nStack / 6);
  const bracketO = prog(f, t.t315 + 6, 10) * (1 - prog(f, slide0, 10));
  const bx = colX + CC_R * COL_S + 10;
  const yTopWhole = layerY(29) - LAYER * 0.2;
  const yBot = layerY(0);
  const yTopAll = layerY(32) - LAYER * 0.2;

  // ---- the white 50
  const drop50 = prog(f, t.t50 - 16, 16, Easing.in(Easing.quad));
  const colTopFace = layerY(32) - CC_R * COL_S * SIN_E * 0.1;
  const y50 = lerp(560, colTopFace - 120, drop50);
  const melt = prog(f, t.t50 + 2, 16, ease.in);

  // ---- formula
  const count = landedAt(f);
  const plusTxt = " + 0.44 × 6";
  const plus = typeOn(plusTxt, f, t.up + 12, 60, 30).text;
  const sum = countTo(f, t.e315, 20, 29, 31.64); // rolls up from the 29 already written, never a false total
  const line2 = typeOn("50 / 31.64", f, t.on - 6, 60, 28).text;
  const ppc = countTo(f, t.e158, 24, 0, 1.58);

  const MASK = "linear-gradient(to bottom, transparent 470px, #000 548px, #000 1440px, transparent 1560px)";
  const tickLabel = (txt: string, y: number, x: number, at: number, big = false) => (
    <div key={txt} style={{ position: "absolute", left: x, top: y - (big ? 34 : 22), fontFamily: big ? "Figtree, sans-serif" : "Inter, sans-serif", fontWeight: big ? 700 : 600, fontSize: big ? 64 : 36, color: big ? "#FFFFFF" : "#C9D1D9", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.9)", ...pop(f, at, { dur: 8, from: 0.6 }), transformOrigin: "0% 50%" }}>
      {txt}
    </div>
  );

  return (
    <>
      {/* the court and everything on it */}
      <div style={{ position: "absolute", inset: 0, maskImage: MASK, WebkitMaskImage: MASK }}>
        <ChanceColumnFloor cam={cam} f={f} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {marks}
          {shadows}
          {resting.map((r) => r.node)}
          {/* the column's weight on the ground */}
          {nStack > 0 && (
            <ellipse cx={colX + 10} cy={COL_Y + 8} rx={CC_R * COL_S * 1.25} ry={CC_R * COL_S * SIN_E * 0.95} fill="#000000" opacity={0.55 * colShadowO} style={{ filter: "blur(14px)" }} />
          )}
          {stacked.map((s) => s.node)}
          {flying.map((s) => s.node)}
        </svg>
        <div style={{ position: "absolute", inset: 0, background: ground.bg, opacity: dim }} />
      </div>

      {/* what the column is made of */}
      {bracketO > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: bracketO }}>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d={`M${bx} ${yBot}h10V${yTopWhole + 3}h-10`} stroke={LABEL} strokeWidth={2} fill="none" />
            <path d={`M${bx} ${yTopWhole - 3}h10V${yTopAll}h-10`} stroke={GOLD} strokeOpacity={0.8} strokeWidth={2} fill="none" />
          </svg>
          <div style={{ position: "absolute", left: bx + 16, top: yTopWhole + 14, fontFamily: "Inter, sans-serif", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: "#F0F3F6", lineHeight: "44px" }}>29</div>
            <div style={{ fontSize: 26, fontWeight: 500, color: LABEL }}>shots</div>
          </div>
          <div style={{ position: "absolute", left: bx + 16, top: yTopAll - 66, fontFamily: "Inter, sans-serif", textShadow: "0 2px 10px rgba(0,0,0,0.9)", ...blurIn(f, t.t315 + 10, { dur: 8 }) }}>
            <div style={{ fontSize: 26, fontWeight: 500, color: LABEL }}>free throws</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: GOLD, lineHeight: "44px" }}>2.64</div>
          </div>
        </div>
      )}

      {/* the formula, written as the pieces land */}
      <div style={{ position: "absolute", left: 60, top: 548, fontFamily: MONO, fontWeight: 700, fontSize: 58, color: "#F0F3F6", whiteSpace: "pre", opacity: prog(f, t.up + 14, 4) }}>
        <span>{count}</span>
        <span>
          {plus.slice(0, 3)}
          <span style={{ color: GOLD }}>{plus.slice(3, 7)}</span>
          {plus.slice(7)}
        </span>
        {f >= t.e315 && (
          <span>
            {" = "}
            <span style={{ ...(f >= t.t315 ? { color: "#FFFFFF" } : {}), display: "inline-block", transform: `scale(${(1 + 0.12 * (1 - prog(f, t.t315, 10))).toFixed(3)})`, transformOrigin: "0% 60%" }}>{sum.toFixed(2)}</span>
          </span>
        )}
      </div>
      <div style={{ position: "absolute", left: 62, top: 624, fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 30, color: LABEL, ...blurIn(f, t.t315 + 2, { dur: 8, rise: 6 }) }}>
        shooting chances (TSA)
      </div>
      {f >= t.on - 6 && (
        <div style={{ position: "absolute", left: 60, top: 690, fontFamily: MONO, fontWeight: 700, fontSize: 58, color: "#F0F3F6", whiteSpace: "pre" }}>
          {line2}
          {f >= t.e158 && (
            <span>
              {" = "}
              <span style={{ display: "inline-block", transform: `scale(${(1 + 0.14 * (1 - prog(f, t.t158, 10))).toFixed(3)})`, transformOrigin: "0% 60%" }}>{ppc.toFixed(2)}</span>
            </span>
          )}
        </div>
      )}
      {f >= t.t158 - 4 && (
        <div style={{ position: "absolute", left: 62, top: 766, fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 30, color: LABEL, ...blurIn(f, t.t158 - 4, { dur: 8, rise: 6 }) }}>
          points per chance
        </div>
      )}

      {/* the white 50 drops onto the column and melts into it */}
      {f >= t.t50 - 16 && melt < 1 && (
        <div
          style={{
            position: "absolute", left: colX - 185, width: 300, top: y50 + (melt * 110), textAlign: "center", fontFamily: "Figtree, sans-serif", fontWeight: 700, fontSize: 150, lineHeight: "150px",
            color: "#FFFFFF", opacity: (1 - melt) * prog(f, t.t50 - 16, 4), transform: `scale(${(1 + 0.5 * melt).toFixed(3)}, ${(1 - 0.85 * melt).toFixed(3)})`, transformOrigin: "50% 100%",
            filter: melt > 0 ? `blur(${(melt * 10).toFixed(1)}px)` : undefined, textShadow: "0 6px 30px rgba(0,0,0,0.6)",
          }}
        >
          50
        </div>
      )}

      {/* the one disc, out large */}
      {big && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {bigBounds && <ellipse cx={(bigBounds.minx + bigBounds.maxx) / 2 + 20} cy={bigBounds.maxy + 26} rx={(bigBounds.maxx - bigBounds.minx) * 0.46} ry={22} fill="#000" opacity={0.5 * prog(f, slide0 + 20, 20)} style={{ filter: "blur(16px)" }} />}
          {big}
        </svg>
      )}
      {bigBounds && f >= t.every + 12 && (() => {
        const { maxx, miny, maxy } = bigBounds;
        const rx = maxx + 34;
        const h = maxy - miny;
        const draw = prog(f, t.every + 12, 14, ease.inOut);
        const lv = maxy - h * FILL;
        const cx = (bigBounds.minx + maxx) / 2;
        const cy = (miny + maxy) / 2;
        const r = h / 2;
        const edgeX = cx + Math.sqrt(Math.max(0, r * r - (lv - cy) * (lv - cy)));
        const lvP = prog(f, t.shot - 6, 8, ease.out);
        return (
          <>
            <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
              <line x1={rx} y1={maxy} x2={rx} y2={lerp(maxy, miny, draw)} stroke="#C9D1D9" strokeWidth={3} />
              {[0, 0.5, 1].map((q, i) => (f >= t.every + 12 + i * 4 ? <line key={q} x1={rx - 14} y1={maxy - h * q} x2={rx + 14} y2={maxy - h * q} stroke="#C9D1D9" strokeWidth={3} opacity={prog(f, t.every + 12 + i * 4, 4)} /> : null))}
              {[0.5].map((q) => <line key={`g${q}`} x1={cx} y1={maxy - h * q} x2={rx - 14} y2={maxy - h * q} stroke="#C9D1D9" strokeOpacity={0.35 * draw} strokeWidth={2} strokeDasharray="0" />)}
              {lvP > 0 && <line x1={edgeX - 6} y1={lv} x2={lerp(edgeX, rx + 30, lvP)} y2={lv} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />}
            </svg>
            {tickLabel("0", maxy, rx + 26, t.every + 12)}
            {tickLabel("1", maxy - h * 0.5, rx + 26, t.every + 16)}
            {tickLabel("2", miny, rx + 26, t.every + 20)}
            <div style={{ position: "absolute", left: rx - 30, top: maxy + 22, fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 30, color: LABEL, ...blurIn(f, t.every + 14, { dur: 8 }) }}>points</div>
            {f >= t.shot - 2 && tickLabel("1.58", lv, rx + 44, t.shot - 2, true)}
          </>
        );
      })()}

      <div style={{ position: "absolute", left: 62, top: 822, fontFamily: "Inter, sans-serif", fontSize: 26, color: LABEL, ...blurIn(f, t.up + 20, { dur: 8 }), opacity: Number(blurIn(f, t.up + 20, { dur: 8 }).opacity) * (1 - 0.5 * prog(f, slide0, 20)) }}>
        Basketball-Reference shot chart and glossary
      </div>
    </>
  );
};
