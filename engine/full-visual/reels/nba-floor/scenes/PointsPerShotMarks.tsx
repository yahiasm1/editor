// Shot marks in Basketball-Reference's own convention (its shot chart pages place one glyph per shot: "●" for a make,
// "×" for a miss; assets/refs/pages/bbref-curry-2026-shot-chart.html), drawn in screen pixels on the floor so they
// keep their size while the camera moves. Every make can pay its points out of the floor: a small white "3" or "2"
// pops off the dot, rises, and flies into one total. The counter is the sum of what has arrived.
import React from "react";
import { ppsP, type PointsPerShotCam, type PpsShot } from "./PointsPerShotWorld";

export type PpsMarkTiming = {
  /** frame the first mark lands, and how long the fall runs through k = 0..1 */
  fallAt: number;
  fallDur: number;
  /** misses that turn into makes (long twos at "40%"): frame range, null when the shots are made from the start */
  flipAt: number | null;
  flipDur: number;
  /** points paid: frame range over which makes pop, in the order given by `payOrder` */
  payAt: number;
  payDur: number;
  /** frames a glyph rises, then flies */
  rise: number;
  fly: number;
};

const sq = (v: number) => v * v;

/** when the i-th make pops its points, and when they arrive at the total */
export function ppsPayTimes(shots: PpsShot[], t: PpsMarkTiming) {
  const makes = shots.map((s, i) => ({ s, i })).filter((m) => m.s.made);
  // pay in the order they fell (baseline up, ring out), so the payout runs through the zone like the fall did
  makes.sort((a, b) => a.s.k - b.s.k);
  const n = makes.length;
  const pop = new Map<number, number>();
  makes.forEach((m, j) => pop.set(m.i, t.payAt + (t.payDur * j) / Math.max(1, n - 1)));
  return pop;
}

/** how many glyphs have reached the total by frame f */
export function ppsArrived(pop: Map<number, number>, t: PpsMarkTiming, f: number) {
  let n = 0;
  for (const p of pop.values()) if (f >= p + t.rise + t.fly) n++;
  return n;
}

export const PointsPerShotMarks: React.FC<{
  cam: PointsPerShotCam;
  f: number;
  shots: PpsShot[];
  t: PpsMarkTiming;
  pop: Map<number, number>;
  /** screen point the glyphs fly to */
  to: { x: number; y: number };
  glyph: string;
  opacity: number;
  /** 0..1 lift of the made dots above the misses (brighter, bigger) while they pay */
  focus: number;
}> = ({ cam, f, shots, t, pop, to, glyph, opacity, focus }) => {
  if (opacity <= 0.001) return null;
  const size = Math.max(3.6, Math.min(4.8, cam.ppf * 0.075));
  let dots = "";
  let rings = "";
  let xs = "";
  let fresh = "";
  let ripple = "";
  const flights: React.ReactNode[] = [];
  for (let i = 0; i < shots.length; i++) {
    const s = shots[i];
    const land = t.fallAt + s.k * t.fallDur;
    if (f < land) continue;
    const p = ppsP(cam, s.x, s.y);
    if (p.x < -20 || p.x > 1100 || p.y < 380 || p.y > 1700) continue;
    // a mark lands big and settles: the impact of the shot on the chart
    const q = Math.min(1, (f - land) / 7);
    const sc = q < 1 ? 1.9 - 0.9 * (1 - sq(1 - q)) : 1;
    const rq = Math.min(1, (f - land) / 14);
    if (rq < 1) {
      const rr = size * (1.2 + 2.4 * rq);
      ripple += `M${(p.x + rr).toFixed(1)} ${p.y.toFixed(1)}a${rr.toFixed(2)} ${rr.toFixed(2)} 0 1 0 ${(-2 * rr).toFixed(2)} 0a${rr.toFixed(2)} ${rr.toFixed(2)} 0 1 0 ${(2 * rr).toFixed(2)} 0`;
    }
    let made = s.made;
    let flipQ = 1;
    if (made && t.flipAt !== null) {
      const fa = t.flipAt + s.flip * t.flipDur;
      if (f < fa) made = false;
      else flipQ = Math.min(1, (f - fa) / 6);
    }
    if (made) {
      const pf = pop.get(i);
      const lit = pf !== undefined && f >= pf ? Math.exp(-(f - pf) / 10) : 0;
      const r = size * sc * (flipQ < 1 ? 0.4 + 0.75 * flipQ + 0.25 * Math.sin(flipQ * Math.PI) : 1) * (1 + 0.18 * focus + 0.5 * lit);
      const c = `M${(p.x + r).toFixed(1)} ${p.y.toFixed(1)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0`;
      dots += c;
      const rr = r + 1.6;
      rings += `M${(p.x + rr).toFixed(1)} ${p.y.toFixed(1)}a${rr.toFixed(2)} ${rr.toFixed(2)} 0 1 0 ${(-2 * rr).toFixed(2)} 0a${rr.toFixed(2)} ${rr.toFixed(2)} 0 1 0 ${(2 * rr).toFixed(2)} 0`;
      if (flipQ < 1 || lit > 0.05) fresh += c;
      // the points it pays
      if (pf !== undefined && f >= pf) {
        const k = f - pf;
        if (k < t.rise + t.fly) {
          let gx: number, gy: number, gs: number, go: number;
          if (k < t.rise) {
            const u = k / t.rise;
            const e = 1 - sq(1 - u);
            gx = p.x;
            gy = p.y - 12 - 30 * e;
            gs = 0.5 + 0.7 * e;
            go = Math.min(1, u * 3);
          } else {
            const u = (k - t.rise) / t.fly;
            const e = u * u * (3 - 2 * u);
            const sx = p.x, sy = p.y - 42;
            // a curve up and over to the total
            const cx = (sx + to.x) / 2 + (to.y - sy) * 0.18, cy = Math.min(sy, to.y) - 90;
            gx = sq(1 - e) * sx + 2 * (1 - e) * e * cx + sq(e) * to.x;
            gy = sq(1 - e) * sy + 2 * (1 - e) * e * cy + sq(e) * to.y;
            gs = 1.2 - 0.6 * e;
            go = 1 - Math.max(0, (u - 0.8) / 0.2);
          }
          flights.push(
            <text key={i} x={gx} y={gy} fill="#FFFFFF" fontFamily="Figtree, sans-serif" fontWeight={700} fontSize={26 * gs} textAnchor="middle" dominantBaseline="central" opacity={go}>
              {glyph}
            </text>,
          );
        }
      }
    }
    if (!made || flipQ < 1) {
      const a = size * 0.95 * sc * (made ? 1 - flipQ : 1);
      if (a > 0.3)
        xs += `M${(p.x - a).toFixed(1)} ${(p.y - a).toFixed(1)}L${(p.x + a).toFixed(1)} ${(p.y + a).toFixed(1)}M${(p.x - a).toFixed(1)} ${(p.y + a).toFixed(1)}L${(p.x + a).toFixed(1)} ${(p.y - a).toFixed(1)}`;
    }
  }
  return (
    <g>
      <g opacity={opacity}>
        {ripple && <path d={ripple} fill="none" stroke="#FFFFFF" strokeWidth={1} opacity={0.2} />}
        <path d={xs} fill="none" stroke="#0D1117" strokeWidth={size * 0.62} strokeLinecap="round" opacity={0.45} />
        <path d={xs} fill="none" stroke="#9AA3AD" strokeWidth={size * 0.34} strokeLinecap="round" />
        <path d={rings} fill="#0D1117" opacity={0.55} />
        <path d={dots} fill="#FFFFFF" />
        {fresh && <path d={fresh} fill="#FFFFFF" filter="url(#pps-bloom)" opacity={0.9} />}
      </g>
      {flights}
    </g>
  );
};
