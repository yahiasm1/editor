// The floor in world feet, drawn inside the scene's camera group (y up). Read off the Wikideas1 top-down court and
// the Clarkson / Parker photos: honey maple strips 2.25 in wide, each piece its own cut, staggered butt joints; grain
// on the close boards of the right corner; the lane in charcoal stain; 2 in white paint at Rule 1 geometry; the
// board, ring and net from above; a 3 ft apron of darker stained wood. The three-point line is NOT here: this scene
// paints it.
import React, { useMemo } from "react";
import { PPS_APRON, PPS_BASE, PPS_HALF, PPS_LINE, PPS_SIDE, ppsArcPath, ppsRnd as rnd } from "./PointsPerShotWorld";

const BOARD = 0.1875;
const SHADES = ["#D9B983", "#D3B07A", "#DDC08F", "#CFAA72", "#E0C596", "#D6B47F", "#C9A46C", "#DBBC88"];
const APRON = ["#4A3321", "#432E1E", "#503824", "#3E2A1B"];
const TOP = 46;
const X0 = -PPS_SIDE - PPS_APRON - 0.5;
const Y0 = PPS_BASE - PPS_LINE - PPS_APRON;

const r4 = (v: number) => v.toFixed(3);
const rect = (x: number, y: number, w: number, h: number) => `M${r4(x)} ${r4(y)}h${r4(w)}v${r4(h)}h${r4(-w)}Z`;

function usePointsPerShotBoards() {
  return useMemo(() => {
    const shade = SHADES.map(() => "");
    const apron = APRON.map(() => "");
    let joints = "";
    let grain = "";
    const n = Math.ceil((2 * -X0) / BOARD);
    for (let i = 0; i < n; i++) {
      const x = X0 + i * BOARD;
      const out = x < -PPS_SIDE - PPS_LINE - 0.01 || x > PPS_SIDE + PPS_LINE - 0.01;
      let y = Y0 - rnd(i, 3) * 6;
      let k = 0;
      while (y < TOP) {
        const len = 1.6 + rnd(i * 13 + k, 5) * 5.5;
        const y1 = Math.min(TOP, y + len);
        const ya = Math.max(Y0, y);
        if (y1 > ya) {
          // the apron is everything outside the boundary lines, under the baseline too
          if (out) apron[Math.floor(rnd(i * 7 + k, 9) * APRON.length)] += rect(x, ya, BOARD + 0.004, y1 - ya);
          else {
            const yb = Math.max(ya, PPS_BASE - PPS_LINE);
            if (yb > ya) apron[Math.floor(rnd(i * 7 + k, 9) * APRON.length)] += rect(x, ya, BOARD + 0.004, yb - ya);
            if (y1 > yb) shade[Math.floor(rnd(i * 5 + k, 4) * SHADES.length)] += rect(x, yb, BOARD + 0.004, y1 - yb);
          }
          if (y1 < TOP && y1 > Y0) joints += rect(x, y1 - 0.006, BOARD, 0.012);
        }
        // grain on the boards of the right corner, where the camera comes down to shoe level
        if (!out && x > 15 && x < 25.2 && y < 9 && y1 > -6) {
          for (let g = 0; g < 3; g++) {
            const gx = x + 0.025 + rnd(i * 31 + k * 7 + g, 11) * 0.14;
            const ph = rnd(i * 17 + g, 12) * 6;
            let d = "";
            for (let yy = Math.max(ya, PPS_BASE); yy <= Math.min(y1, 9); yy += 0.3) d += `${d ? "L" : "M"}${r4(gx + Math.sin(yy * 1.7 + ph) * 0.012)} ${r4(yy)}`;
            grain += d;
          }
        }
        y = y1;
        k++;
      }
    }
    // sole scuffs: densest in the corners and at the top of the key
    let scuff = "";
    const spots: [number, number, number, number][] = [[23, -1, 2.6, 34], [-23, -1, 2.6, 34], [0, 26, 6, 30], [15, 18, 5, 14], [-15, 18, 5, 14], [5, 9, 6, 12]];
    let id = 0;
    for (const [cx, cy, sp, cnt] of spots)
      for (let i = 0; i < cnt; i++, id++) {
        const x = cx + (rnd(id, 21) - 0.5) * 2 * sp, y = cy + (rnd(id, 22) - 0.5) * 2 * sp;
        const r = 0.15 + rnd(id, 23) * 0.45, a0 = rnd(id, 24) * 6.28, len = 0.2 + rnd(id, 25) * 0.5;
        scuff += ppsArcPath(x, y, r, a0, a0 + len / r, 8);
      }
    return { shade, apron, joints, grain, scuff };
  }, []);
}

function usePointsPerShotLines() {
  return useMemo(() => {
    const L = PPS_LINE;
    const h = L / 2;
    const seg: string[] = [];
    const ln = (x1: number, y1: number, x2: number, y2: number) => seg.push(`M${r4(x1)} ${r4(y1)}L${r4(x2)} ${r4(y2)}`);
    ln(-PPS_SIDE - L, PPS_BASE - h, PPS_SIDE + L, PPS_BASE - h); // baseline (out of bounds: its inner edge is the line)
    ln(-PPS_SIDE - L, PPS_HALF, PPS_SIDE + L, PPS_HALF); // half court
    for (const s of [-1, 1]) {
      ln(s * (8 - h), PPS_BASE, s * (8 - h), 13.75); // lane, 16 ft wide
      ln(s * (4 - h), 0, s * (4 - h), -1.25); // restricted area legs to the board face
      for (const y of [5.75, 8.75, 11.75]) ln(s * 8, y, s * 8.5, y); // lane space marks
      ln(s * 11, PPS_BASE, s * 11, PPS_BASE + 0.5); // baseline hash marks, 3 ft from the lane (Rule 1.6)
      ln(s * 11, 7.75, s * 11.5, 7.75); // 13 ft hash marks (Rule 1.7)
      ln(s * PPS_SIDE, 22.75, s * (PPS_SIDE - 3), 22.75); // 28 ft hash marks (Rule 1.5)
    }
    ln(-8, 13.75 - h, 8, 13.75 - h); // free throw line, 15 ft from the board face
    seg.push(ppsArcPath(0, 0, 4 - h, 0, Math.PI, 40)); // restricted area
    seg.push(ppsArcPath(0, 13.75, 6 - h, 0, Math.PI, 48)); // free throw circle, solid half
    for (let k = 0; k < 8; k++) {
      const a0 = Math.PI + (k / 8) * Math.PI + 0.07;
      seg.push(ppsArcPath(0, 13.75, 6 - h, a0, a0 + Math.PI / 8 - 0.16, 6)); // its dashed half, inside the lane
    }
    seg.push(ppsArcPath(0, PPS_HALF, 6 - h, Math.PI, 2 * Math.PI, 48));
    const side = [-1, 1].map((s) => `M${r4(s * (PPS_SIDE + h))} ${r4(PPS_BASE - L)}L${r4(s * (PPS_SIDE + h))} ${TOP}`);
    const blocks = [-1, 1].map((s) => rect(Math.min(s * 8, s * 8.67), 1.75, 0.67, 1)).join("");
    return { lines: seg.join(""), side, blocks };
  }, []);
}

export const PointsPerShotFloor: React.FC<{ ppf: number; sideFlash: [number, number]; f: number }> = ({ ppf, sideFlash, f }) => {
  const b = usePointsPerShotBoards();
  const l = usePointsPerShotLines();
  const close = Math.max(0, Math.min(1, (ppf - 30) / 50)); // 0 at the arc frame, 1 at the corner frame
  const sway = Math.sin(f / 23) * 0.04;
  return (
    <g>
      {APRON.map((c, i) => <path key={`a${i}`} d={b.apron[i]} fill={c} />)}
      {SHADES.map((c, i) => <path key={`s${i}`} d={b.shade[i]} fill={c} />)}
      <path d={b.joints} fill="#6B4E2C" opacity={0.18 + 0.22 * close} />
      <path d={b.grain} fill="none" stroke="#A07842" strokeWidth={0.007} opacity={0.35 * close} />
      <path d={b.scuff} fill="none" stroke="#5C5048" strokeWidth={0.025} opacity={0.1} />
      {/* the lane, charcoal stain over the maple */}
      <rect x={-8} y={PPS_BASE} width={16} height={19} fill="#2B2D31" opacity={0.93} />
      {/* paint */}
      <path d={l.lines} fill="none" stroke="#F3F5F7" strokeWidth={PPS_LINE} />
      <path d={l.blocks} fill="#F3F5F7" />
      {l.side.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={sideFlash[i] > 0 ? `rgb(255,255,255)` : "#F3F5F7"} strokeWidth={PPS_LINE * (1 + sideFlash[i] * 0.25)} />
      ))}
      {/* the stanchion's pad and arm behind the baseline, the backboard edge-on, the ring and net from above */}
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
  );
};
