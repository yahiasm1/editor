// The floor in world feet, drawn inside a y-up group. Same floor as the scenes before it (honey maple strips 2.25 in
// wide, staggered butt joints, the lane in charcoal stain, a 3 ft apron of darker stained wood, 2 in white paint at
// Rule 1 geometry), with what this scene needs on it: the full three-point line, the gold 21 in slivers and the gold
// ghost ring of 23'9" below the kink, and the zones the numbers land on (corner strips, above the break).
// At LINE scale the boards of the macro corner carry grain, pores and the paint's glossy lip
// (photos/commons-clarkson-knicks-2025-*: crisp 2 in paint, long soft reflections, fine sole scuffs).
import React, { useMemo } from "react";
import {
  LT_APRON, LT_BASE, LT_CORNER, LT_GOLD, LT_HALF, LT_KINK_A, LT_KINK_Y, LT_LINE, LT_R, LT_SIDE,
  ltArcPath, ltBreakRegion, ltCornerStrip, ltRnd as rnd, ltSliverPath,
} from "./LeagueTableWorld";

const BOARD = 0.1875;
const SHADES = ["#D9B983", "#D3B07A", "#DDC08F", "#CFAA72", "#E0C596", "#D6B47F", "#C9A46C", "#DBBC88"];
const APRON = ["#4A3321", "#432E1E", "#503824", "#3E2A1B"];
const TOP = 46;
const X0 = -LT_SIDE - LT_APRON - 0.5;
const Y0 = LT_BASE - LT_LINE - LT_APRON;
const W = "#F3F5F7";

const r4 = (v: number) => v.toFixed(3);
const rect = (x: number, y: number, w: number, h: number) => `M${r4(x)} ${r4(y)}h${r4(w)}v${r4(h)}h${r4(-w)}Z`;

/** the macro window: where the camera comes down to the 21 in at rim level */
export const LT_MACRO = { x0: 20.6, x1: 25.6, y0: -2.6, y1: 2.9 };

function useLeagueTableBoards(side: 1 | -1) {
  return useMemo(() => {
    const shade = SHADES.map(() => "");
    const apron = APRON.map(() => "");
    let joints = "";
    let grain = "";
    let figure = "";
    let pores = "";
    const n = Math.ceil((2 * -X0) / BOARD);
    const mx0 = side > 0 ? LT_MACRO.x0 : -LT_MACRO.x1;
    const mx1 = side > 0 ? LT_MACRO.x1 : -LT_MACRO.x0;
    for (let i = 0; i < n; i++) {
      const x = X0 + i * BOARD;
      const out = x < -LT_SIDE - LT_LINE - 0.01 || x > LT_SIDE + LT_LINE - 0.01;
      let y = Y0 - rnd(i, 3) * 6;
      let k = 0;
      while (y < TOP) {
        const len = 1.6 + rnd(i * 13 + k, 5) * 5.5;
        const y1 = Math.min(TOP, y + len);
        const ya = Math.max(Y0, y);
        if (y1 > ya) {
          if (out) apron[Math.floor(rnd(i * 7 + k, 9) * APRON.length)] += rect(x, ya, BOARD + 0.004, y1 - ya);
          else {
            const yb = Math.max(ya, LT_BASE - LT_LINE);
            if (yb > ya) apron[Math.floor(rnd(i * 7 + k, 9) * APRON.length)] += rect(x, ya, BOARD + 0.004, yb - ya);
            if (y1 > yb) shade[Math.floor(rnd(i * 5 + k, 4) * SHADES.length)] += rect(x, yb, BOARD + 0.004, y1 - yb);
          }
          if (y1 < TOP && y1 > Y0) joints += rect(x, y1 - 0.004, BOARD, 0.008);
        }
        // grain, figure and pores on the boards under the macro lens
        if (x > mx0 - BOARD && x < mx1 && y < LT_MACRO.y1 && y1 > LT_MACRO.y0) {
          const ys = Math.max(ya, LT_MACRO.y0), ye = Math.min(y1, LT_MACRO.y1);
          const lines = 7;
          for (let g = 0; g < lines; g++) {
            const gx = x + 0.008 + ((g + rnd(i * 31 + k * 7 + g, 11) * 0.6) / lines) * (BOARD - 0.016);
            const ph = rnd(i * 17 + g + k, 12) * 6;
            const amp = 0.004 + rnd(i * 3 + g, 13) * 0.008;
            let d = "";
            for (let yy = ys; yy <= ye + 0.001; yy += 0.06) d += `${d ? "L" : "M"}${r4(gx + Math.sin(yy * 2.3 + ph) * amp + Math.sin(yy * 9 + ph) * 0.0015)} ${r4(yy)}`;
            if (g % 3 === 0) figure += d;
            else grain += d;
          }
          const np = Math.floor((ye - ys) * 22);
          for (let p = 0; p < np; p++) {
            const px = x + 0.01 + rnd(i * 101 + k * 13 + p, 14) * (BOARD - 0.02);
            const py = ys + rnd(i * 103 + k * 17 + p, 15) * (ye - ys);
            pores += rect(px, py, 0.0035, 0.018 + rnd(p + i, 16) * 0.02);
          }
        }
        y = y1;
        k++;
      }
    }
    let scuff = "";
    const spots: [number, number, number, number][] = [[23, -1, 2.6, 34], [-23, -1, 2.6, 34], [0, 26, 6, 30], [15, 18, 5, 14], [-15, 18, 5, 14], [5, 9, 6, 12]];
    let id = 0;
    for (const [cx, cy, sp, cnt] of spots)
      for (let i = 0; i < cnt; i++, id++) {
        const x = cx + (rnd(id, 21) - 0.5) * 2 * sp, y = cy + (rnd(id, 22) - 0.5) * 2 * sp;
        const r = 0.4 + rnd(id, 23) * 1.3, a0 = rnd(id, 24) * 6.28, len = 0.4 + rnd(id, 25) * 1.1;
        scuff += ltArcPath(x, y, r, a0, a0 + len / r, 8);
      }
    // fine sole marks under the lens
    let fine = "";
    for (let i = 0; i < 46; i++) {
      const x = side * (LT_MACRO.x0 + rnd(i, 31) * (LT_MACRO.x1 - LT_MACRO.x0));
      const y = LT_MACRO.y0 + rnd(i, 32) * (LT_MACRO.y1 - LT_MACRO.y0);
      const r = 0.15 + rnd(i, 33) * 0.6, a0 = rnd(i, 34) * 6.28, len = 0.08 + rnd(i, 35) * 0.35;
      fine += ltArcPath(x, y, r, a0, a0 + len / r, 6);
    }
    return { shade, apron, joints, grain, figure, pores, scuff, fine };
  }, [side]);
}

function useLeagueTableLines() {
  return useMemo(() => {
    const L = LT_LINE;
    const h = L / 2;
    const seg: string[] = [];
    const ln = (x1: number, y1: number, x2: number, y2: number) => seg.push(`M${r4(x1)} ${r4(y1)}L${r4(x2)} ${r4(y2)}`);
    ln(-LT_SIDE - L, LT_BASE - h, LT_SIDE + L, LT_BASE - h);
    ln(-LT_SIDE - L, LT_HALF, LT_SIDE + L, LT_HALF);
    for (const s of [-1, 1]) {
      ln(s * (8 - h), LT_BASE, s * (8 - h), 13.75);
      ln(s * (4 - h), 0, s * (4 - h), -1.25);
      for (const y of [5.75, 8.75, 11.75]) ln(s * 8, y, s * 8.5, y);
      ln(s * 11, LT_BASE, s * 11, LT_BASE + 0.5);
      ln(s * 11, 7.75, s * 11.5, 7.75);
      ln(s * LT_SIDE, 22.75, s * (LT_SIDE - 3), 22.75);
    }
    ln(-8, 13.75 - h, 8, 13.75 - h);
    seg.push(ltArcPath(0, 0, 4 - h, 0, Math.PI, 40));
    seg.push(ltArcPath(0, 13.75, 6 - h, 0, Math.PI, 48));
    for (let k = 0; k < 8; k++) {
      const a0 = Math.PI + (k / 8) * Math.PI + 0.07;
      seg.push(ltArcPath(0, 13.75, 6 - h, a0, a0 + Math.PI / 8 - 0.16, 6));
    }
    seg.push(ltArcPath(0, LT_HALF, 6 - h, Math.PI, 2 * Math.PI, 48));
    // the three-point line: the arc between the kinks, the straight corner lines to the baseline
    const three = ltArcPath(0, 0, LT_R - h, LT_KINK_A, Math.PI - LT_KINK_A, 160);
    const side = [-1, 1].map((s) => `M${r4(s * (LT_SIDE + h))} ${r4(LT_BASE - L)}L${r4(s * (LT_SIDE + h))} ${TOP}`);
    const blocks = [-1, 1].map((s) => rect(Math.min(s * 8, s * 8.67), 1.75, 0.67, 1)).join("");
    const corners = [-1, 1].map((s) => rect(s > 0 ? LT_CORNER - L : -LT_CORNER, LT_BASE, L, LT_KINK_Y - LT_BASE)).join("");
    return { lines: seg.join(""), three, side, blocks, corners };
  }, []);
}

export type LeagueTableFloorProps = {
  ppf: number;
  f: number;
  /** the side the macro lens comes down on */
  side: 1 | -1;
  /** draw the ring, board and net from above (the tilted camera draws them standing) */
  flat: boolean;
  /** 0..1 the slivers, left and right */
  sliver: [number, number];
  /** the macro fill: 0..1.75 ft of the sliver at rim level lit by the tape */
  tipFill: number;
  /** 0..1 how much the slivers fade to let the tape's fill read */
  sliverBase: number;
  /** 0..1 the ghost ring below the kink */
  ghost: number;
  /** 0..1 the corner line's lip catching light, the ghost sharpening (on "inches") */
  edge: number;
  /** 0..1 corner strips brightened, above the break brightened, the rest dimmed */
  strips: [number, number];
  brk: number;
  rest: number;
  idp: string;
};

export const LeagueTableFloor: React.FC<LeagueTableFloorProps> = (p) => {
  const b = useLeagueTableBoards(p.side);
  const l = useLeagueTableLines();
  const close = Math.max(0, Math.min(1, (p.ppf - 40) / 160)); // 0 on the whole floor, 1 under the macro lens
  const sway = Math.sin(p.f / 23) * 0.04;
  const hW = LT_LINE;
  const s = p.side;
  const xa = s > 0 ? LT_CORNER : -LT_CORNER - p.tipFill;
  return (
    <g>
      <defs>
        <filter id={`${p.idp}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={0.35} />
        </filter>
        <filter id={`${p.idp}-soft2`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={0.03 + 0.09 * (1 - close)} />
        </filter>
        <clipPath id={`${p.idp}-tip`} clipPathUnits="userSpaceOnUse">
          <rect x={xa} y={LT_BASE - 1} width={p.tipFill} height={LT_KINK_Y - LT_BASE + 2} />
        </clipPath>
      </defs>
      {APRON.map((c, i) => <path key={`a${i}`} d={b.apron[i]} fill={c} />)}
      {SHADES.map((c, i) => <path key={`s${i}`} d={b.shade[i]} fill={c} />)}
      <path d={b.joints} fill="#6B4E2C" opacity={0.18 + 0.3 * close} />
      {close > 0.02 && (
        <g opacity={close}>
          <path d={b.grain} fill="none" stroke="#A9814B" strokeWidth={0.0032} opacity={0.38} />
          <path d={b.figure} fill="none" stroke="#9A7038" strokeWidth={0.006} opacity={0.4} />
          <path d={b.pores} fill="#7E5B2F" opacity={0.35} />
          <path d={b.fine} fill="none" stroke="#5C5048" strokeWidth={0.006} opacity={0.22} />
        </g>
      )}
      <path d={b.scuff} fill="none" stroke="#5C5048" strokeWidth={0.03} opacity={0.13} />
      <rect x={-8} y={LT_BASE} width={16} height={19} fill="#2B2D31" opacity={0.93} />
      {/* the zones the numbers land on */}
      {p.rest > 0.001 && (
        <g>
          <mask id={`${p.idp}-rest`} maskUnits="userSpaceOnUse" x={-40} y={-20} width={80} height={80}>
            <rect x={-40} y={-20} width={80} height={80} fill="#fff" />
            {[-1, 1].map((sd, i) => <path key={sd} d={ltCornerStrip(sd as 1 | -1)} fill="#000" fillOpacity={p.strips[i]} />)}
            <path d={ltBreakRegion(TOP)} fill="#000" fillOpacity={p.brk} />
          </mask>
          <rect x={-LT_SIDE - 4} y={LT_BASE - 4} width={2 * LT_SIDE + 8} height={60} fill="#0D1117" opacity={0.42 * p.rest} mask={`url(#${p.idp}-rest)`} />
        </g>
      )}
      {[-1, 1].map((sd, i) => (p.strips[i] > 0.001 ? <path key={`st${sd}`} d={ltCornerStrip(sd as 1 | -1)} fill="#FFF7E6" opacity={0.26 * p.strips[i]} /> : null))}
      {p.brk > 0.001 && <path d={ltBreakRegion(TOP)} fill="#FFF7E6" opacity={0.2 * p.brk} />}
      {/* paint */}
      <path d={l.lines} fill="none" stroke={W} strokeWidth={LT_LINE} />
      <path d={l.three} fill="none" stroke={W} strokeWidth={LT_LINE} />
      <path d={l.corners} fill={W} />
      <path d={l.blocks} fill={W} />
      {l.side.map((d, i) => <path key={i} d={d} fill="none" stroke={W} strokeWidth={LT_LINE} />)}
      {/* the paint's glossy lip and its thin shadow, seen under the lens */}
      {close > 0.02 && (
        <g opacity={close}>
          <rect x={s > 0 ? LT_CORNER - 0.006 : -LT_CORNER - 0.006} y={LT_BASE} width={0.012} height={LT_KINK_Y - LT_BASE} fill="#6B4E2C" opacity={0.45} />
          <rect x={s > 0 ? LT_CORNER - hW + 0.004 : -LT_CORNER + hW - 0.016} y={LT_BASE} width={0.012} height={LT_KINK_Y - LT_BASE} fill="#FFFFFF" opacity={0.6 + 0.4 * p.edge} />
          <rect x={s > 0 ? LT_CORNER - hW * 0.62 : -LT_CORNER + hW * 0.38} y={LT_BASE} width={hW * 0.24} height={LT_KINK_Y - LT_BASE} fill="#E6EAEE" opacity={0.35} />
        </g>
      )}
      {/* the gold slivers */}
      {[-1, 1].map((sd, i) => (p.sliver[i] > 0.001 ? (
        <g key={`sl${sd}`} opacity={p.sliver[i]}>
          <path d={ltSliverPath(sd as 1 | -1)} fill={LT_GOLD} opacity={(0.35 * (1 - close) + 0.12) * p.sliverBase} filter={`url(#${p.idp}-soft)`} />
          <path d={ltSliverPath(sd as 1 | -1)} fill={LT_GOLD} opacity={(0.9 - 0.45 * close) * p.sliverBase} />
        </g>
      ) : null))}
      {p.tipFill > 0.001 && (
        <g clipPath={`url(#${p.idp}-tip)`}>
          <path d={ltSliverPath(s)} fill={LT_GOLD} opacity={0.62} />
          <path d={ltSliverPath(s)} fill="#FFD27A" opacity={0.25} filter={`url(#${p.idp}-soft)`} />
        </g>
      )}
      {/* the gold ghost ring: the 23'9" carried on below the kink to the baseline */}
      {p.ghost > 0.001 && [-1, 1].map((sd) => {
        const a0 = sd > 0 ? -Math.asin(5.25 / LT_R) : Math.PI - LT_KINK_A;
        const a1 = sd > 0 ? LT_KINK_A : Math.PI + Math.asin(5.25 / LT_R);
        const wdt = 0.1 - 0.075 * close;
        return (
          <g key={`gh${sd}`} opacity={p.ghost}>
            <path d={ltArcPath(0, 0, LT_R - wdt / 2, a0, a1, 40)} fill="none" stroke={LT_GOLD} strokeWidth={wdt * (3 + 2 * p.edge)} opacity={0.3} filter={`url(#${p.idp}-soft2)`} />
            <path d={ltArcPath(0, 0, LT_R - wdt / 2, a0, a1, 40)} fill="none" stroke={p.edge > 0.5 ? "#FFD27A" : LT_GOLD} strokeWidth={wdt} />
          </g>
        );
      })}
      {p.flat && (
        <g>
          <rect x={-1.1} y={-10.6} width={2.2} height={1.6} rx={0.3} fill="#1B1E23" />
          <rect x={-0.28} y={-9.2} width={0.56} height={7.85} fill="#2A2F36" />
          <rect x={-0.28} y={-9.2} width={0.1} height={7.85} fill="#4A525C" />
          <rect x={-3} y={-1.42} width={6} height={0.17} fill="#C9D3DB" opacity={0.9} />
          <rect x={-3} y={-1.3} width={6} height={0.05} fill="#FFFFFF" />
          <rect x={-1} y={-1.42} width={2} height={0.17} fill="none" stroke="#FFFFFF" strokeWidth={0.04} />
          <rect x={-0.1} y={-1.25} width={0.2} height={0.5} fill="#C4470A" />
          <circle cx={0} cy={0} r={0.75} fill="none" stroke="#E35205" strokeWidth={0.075} />
          <circle cx={0} cy={0} r={0.79} fill="none" stroke="#7A2A04" strokeWidth={0.02} opacity={0.6} />
          <g opacity={0.9} transform={`translate(${sway} 0)`}>
            <circle cx={0} cy={-0.05} r={0.52} fill="none" stroke="#F2F2F2" strokeWidth={0.03} />
            <circle cx={0} cy={-0.08} r={0.3} fill="none" stroke="#E6E6E6" strokeWidth={0.025} />
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <line key={i} x1={0.72 * Math.cos(a)} y1={0.72 * Math.sin(a)} x2={0.3 * Math.cos(a + 0.25)} y2={-0.08 + 0.3 * Math.sin(a + 0.25)} stroke="#EDEDED" strokeWidth={0.022} />;
            })}
          </g>
        </g>
      )}
      {!p.flat && (
        // the stanchion's footprint and the board's shadow on the boards, under the standing hoop
        <g>
          <rect x={-1.1} y={-10.6} width={2.2} height={1.6} rx={0.3} fill="#1B1E23" />
          <ellipse cx={0} cy={-0.6} rx={3.6} ry={1.3} fill="#000" opacity={0.12} filter={`url(#${p.idp}-soft)`} />
        </g>
      )}
    </g>
  );
};
