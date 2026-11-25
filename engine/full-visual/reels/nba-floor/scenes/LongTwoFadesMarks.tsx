// The league's shots, one mark per 0.1% of every attempt, in screen pixels over the floor so they keep their size as
// the camera moves. Attempts, not makes: one neutral glyph (a small white dot at 60%), never `points`' ● and ×.
// A mark that must change zone between two seasons hops there (it lifts, its shadow stays on the boards, it lands).
import React from "react";
import { ltfP, ltfSpot, LTF_N, LTF_Z_CORNER, LTF_Z_LONG2, type LongTwoFadesCam } from "./LongTwoFadesWorld";

export type LtfMove = { at: number; from: [number, number]; to: [number, number] };
export type LtfMarkPlan = { moves: LtfMove[][]; zoneAt: (i: number, f: number) => number; dist: number[] };

/** every mark's hops: season s's changes start while the label shows s, spread across that season's few frames */
export function longTwoFadesPlan(assign: number[][], rollAt: number, step: number): LtfMarkPlan {
  const moves: LtfMove[][] = [];
  const dist: number[] = [];
  for (let i = 0; i < LTF_N; i++) {
    const list: LtfMove[] = [];
    let at = ltfSpot(assign[0][i], i);
    dist.push(Math.hypot(at[0], at[1]));
    for (let s = 1; s < assign.length; s++) {
      if (assign[s][i] === assign[s - 1][i]) continue;
      const to = ltfSpot(assign[s][i], i);
      list.push({ at: rollAt + (s - 1) * step + ((i * 0.618) % 1) * step, from: at, to });
      at = to;
    }
    moves.push(list);
  }
  const zoneAt = (i: number, f: number) => {
    let s = 0;
    for (let k = 1; k < assign.length; k++) if (f >= rollAt + (k - 1) * step) s = k;
    return assign[s][i];
  };
  return { moves, zoneAt, dist };
}

const HOP = 18;
const circ = (x: number, y: number, r: number) =>
  `M${(x + r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0`;

export const LongTwoFadesMarks: React.FC<{
  cam: LongTwoFadesCam;
  f: number;
  plan: LtfMarkPlan;
  /** the rain onto the 2005 floor: frame the first lands, frames it runs */
  fallAt: number;
  fallDur: number;
  /** 0..1: the band's marks lift and the rest dim */
  band: number;
  /** 0..1: only the band's marks stay lit (the last 49) */
  bandOnly: number;
  /** 0..1: the corners' marks brighten (the slivers packed) */
  corners: number;
  /** frame of the light that runs out from the basket through every mark ("of every shot in the league") */
  rippleAt: number;
  opacity: number;
}> = ({ cam, f, plan, fallAt, fallDur, band, bandOnly, corners, rippleAt, opacity }) => {
  if (opacity <= 0.001 || f < fallAt) return null;
  const size = 3.4 * (cam.ppf / 19.2);
  let rest = "";
  let dim = "";
  let lit = "";
  let shadow = "";
  let ripple = "";
  for (let i = 0; i < LTF_N; i++) {
    const k = Math.min(1, plan.dist[i] / 30) * 0.8 + ((i * 0.377) % 1) * 0.2;
    const land = fallAt + k * fallDur;
    if (f < land) continue;
    // where it stands now, or where it is in the air
    const mv = plan.moves[i];
    let pos = mv.length ? mv[0].from : ltfSpot(plan.zoneAt(i, -Infinity), i);
    let lift = 0;
    for (const m of mv) {
      if (f < m.at) break;
      const u = Math.min(1, (f - m.at) / HOP);
      const e = u * u * (3 - 2 * u);
      pos = [m.from[0] + (m.to[0] - m.from[0]) * e, m.from[1] + (m.to[1] - m.from[1]) * e];
      lift = Math.sin(Math.PI * u);
    }
    const p = ltfP(cam, pos[0], pos[1]);
    if (p.x < -20 || p.x > 1100 || p.y < 360 || p.y > 1700) continue;
    const z = plan.zoneAt(i, f);
    // the shot landing on the chart: a little big, then settled
    const q = Math.min(1, (f - land) / 8);
    const sc = 1 + 0.9 * (1 - q) * (1 - q);
    if (q < 1) ripple += circ(p.x, p.y, size * (1.4 + 2.6 * q));
    const w = Math.exp(-Math.pow(f - rippleAt - plan.dist[i] * 0.9, 2) / 32);
    const isBand = z === LTF_Z_LONG2;
    const isCorner = z === LTF_Z_CORNER;
    const up = isBand ? band : 0;
    const r = size * sc * (z === 0 ? 0.78 : 1) * (1 + 0.32 * up + 0.4 * lift + 0.45 * w + (isBand ? 0.25 * bandOnly : 0) + (isCorner ? 0.2 * corners : 0));
    if (lift > 0.02) {
      shadow += circ(p.x + 3 * lift, p.y + 4 * lift, r * 0.9);
      lit += circ(p.x, p.y - 26 * lift, r);
    } else if ((isBand && (up > 0.5 || bandOnly > 0.5)) || w > 0.35 || (isCorner && corners > 0.5)) lit += circ(p.x, p.y, r);
    else if ((band > 0.5 && !isBand) || bandOnly > 0.5) dim += circ(p.x, p.y, r);
    else rest += circ(p.x, p.y, r);
  }
  const dimO = 0.6 * (1 - 0.6 * Math.max(band, bandOnly) - 0.2 * bandOnly);
  return (
    <g opacity={opacity}>
      {ripple && <path d={ripple} fill="none" stroke="#FFFFFF" strokeWidth={1} opacity={0.22} />}
      {shadow && <path d={shadow} fill="#0D1117" opacity={0.45} />}
      <path d={rest} fill="#FFFFFF" opacity={0.6} />
      <path d={dim} fill="#FFFFFF" opacity={dimO} />
      <path d={lit} fill="#0D1117" opacity={0.35} transform="translate(0 1.5)" />
      <path d={lit} fill="#FFFFFF" />
    </g>
  );
};
