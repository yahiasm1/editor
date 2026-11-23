// The floor under the free throw line, projected through the scene's one camera. Honey maple strips 2.25 in wide
// running baseline to half court, each a slightly different cut, butted end to end with staggered joints; at macro
// the grain shows along each strip. The lane in Spurs black with its silver edge, white 2 in lines painted at true
// width: baseline, lane, the block and hash marks, the restricted arc, the free throw circle (solid toward half
// court, dashed inside the lane as it is painted), the three point line, the free throw line last.
import React, { useMemo } from "react";
import {
  freeThrowWedgesArc2 as arc2,
  freeThrowWedgesBand as band,
  freeThrowWedgesFarY,
  freeThrowWedgesPoly as poly,
  freeThrowWedgesProject as proj,
  ftwRnd as rnd,
  FTW_LINE_Y,
  type FreeThrowWedgesCam,
} from "./FreeThrowWedgesWorld";

const BOARD = 0.1875;
const LINE = 1 / 6;
const RIM_Y = 5.25;
const WHITE = "#F4F6F8";

type Strip = { x: number; c: string; joints: number[]; grain: { dx: number; a: number; w: number }[] };

const useFreeThrowWedgesStrips = () =>
  useMemo(() => {
    const out: Strip[] = [];
    const n = Math.ceil(50 / BOARD);
    for (let i = 0; i < n; i++) {
      const t = rnd(i);
      const l = 66 + t * 10;
      const c = `hsl(${(33 + rnd(i + 900) * 6).toFixed(1)}, ${(50 + rnd(i + 400) * 14).toFixed(1)}%, ${l.toFixed(1)}%)`;
      const joints: number[] = [];
      let y = -rnd(i + 77) * 6;
      let k = 0;
      while (y < 47) {
        y += 2 + rnd(i * 13 + k) * 6;
        k++;
        if (y > -6 && y < 47) joints.push(y);
      }
      const grain = [0, 1, 2].map((g) => ({ dx: 0.03 + rnd(i * 7 + g) * 0.13, a: 0.06 + rnd(i * 5 + g) * 0.1, w: 0.006 + rnd(i * 3 + g) * 0.01 }));
      out.push({ x: -25 + i * BOARD, c, joints, grain });
    }
    return out;
  }, []);

const onScreen = (c: FreeThrowWedgesCam, x0: number, x1: number, y: number) => {
  const a = proj(c, x0, y, 0);
  const b = proj(c, x1, y, 0);
  if (!a.ok || !b.ok) return true;
  return !(Math.max(a.x, b.x) < -40 || Math.min(a.x, b.x) > 1120);
};

/** line draw schedule: each painted line has its own window inside 0..1, the free throw line last */
const win = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));

export const FreeThrowWedgesFloor: React.FC<{ cam: FreeThrowWedgesCam; lines: number; f: number; ftGlow: number }> = ({ cam, lines, f, ftGlow }) => {
  const strips = useFreeThrowWedgesStrips();
  const yFar = Math.min(47, freeThrowWedgesFarY(cam));
  const yNear = -6;
  const ppf = cam.F / cam.D;
  const macro = ppf > 80;
  const sweep = -300 + ((f * 3.2) % 1700);
  const cornerY = RIM_Y + Math.sqrt(23.75 * 23.75 - 22 * 22);
  const a3 = Math.atan2(cornerY - RIM_Y, 22);
  const L = (pts: [number, number][], t: number, w = LINE) => band(cam, pts, w, t);
  const paint: (string | null)[] = [];
  // baseline, lane sides, free throw line
  paint.push(L([[-25, LINE / 2], [25, LINE / 2]], win(lines, 0, 0.18)));
  for (const s of [-1, 1]) paint.push(L([[s * (8 - LINE / 2), 0], [s * (8 - LINE / 2), 19]], win(lines, 0.08, 0.42)));
  for (const s of [-1, 1]) {
    // the block (the 1 ft x 8 in square at 7 ft) and hash marks at 11, 14, 17 ft, outside the lane
    const hw = win(lines, 0.3 + (s > 0 ? 0.04 : 0), 0.5);
    if (hw > 0) {
      const xo = s * 8;
      const xi = s * 8.67;
      paint.push(poly(cam, [[xo, 7, 0], [xi, 7, 0], [xi, 8, 0], [xo, 8, 0]].map((p) => [p[0], p[1], 0] as [number, number, number])));
      for (const y of [11, 14, 17]) paint.push(L([[xo, y], [xo + (xi - xo) * hw, y]], 1));
    }
  }
  paint.push(L(arc2(0, RIM_Y, 4, Math.PI, 0, 40).reverse().concat([]), win(lines, 0.25, 0.5)));
  for (const s of [-1, 1]) paint.push(L([[s * 4, 4], [s * 4, RIM_Y]], win(lines, 0.25, 0.32)));
  // three point line
  for (const s of [-1, 1]) paint.push(L([[s * 22, 0], [s * 22, cornerY]], win(lines, 0.15, 0.4)));
  paint.push(L(arc2(0, RIM_Y, 23.75, Math.PI - a3, a3, 80), win(lines, 0.3, 0.7)));
  // free throw circle: the solid half toward half court
  paint.push(L(arc2(0, 19, 6, Math.PI, 0, 60).reverse(), win(lines, 0.45, 0.8)));
  // the dashed half inside the lane, as painted: 16 dashes
  const dashT = win(lines, 0.55, 0.85);
  for (let k = 0; k < 8; k++) {
    if (dashT * 8 <= k) break;
    const a0 = Math.PI + (k / 8) * Math.PI + 0.06;
    const a1 = a0 + Math.PI / 8 - 0.16;
    paint.push(L(arc2(0, 19, 6, a0, a1, 8), 1));
  }
  const ftT = win(lines, 0.78, 1);
  const ft = L([[-8, FTW_LINE_Y], [8, FTW_LINE_Y]], ftT);
  const lane = poly(cam, [[-8, 0, 0], [8, 0, 0], [8, 19, 0], [-8, 19, 0]]);
  const laneEdge = band(cam, [[-7.55, 0], [-7.55, 18.55], [7.55, 18.55], [7.55, 0]], 0.08, 1);
  const apron = poly(cam, [[-31, yNear, 0], [31, yNear, 0], [31, yFar, 0], [-31, yFar, 0]]);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="ftw-sheen" gradientUnits="userSpaceOnUse" x1={sweep} y1={300} x2={sweep + 420} y2={1500}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.13" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ftw-pool" cx="540" cy="900" r="900" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000" stopOpacity="0.34" />
        </radialGradient>
        <linearGradient id="ftw-lane" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B0C0E" />
          <stop offset="1" stopColor="#17191D" />
        </linearGradient>
      </defs>
      {apron && <path d={apron} fill="#0E1013" />}
      {strips.map((s, i) => {
        if (!onScreen(cam, s.x, s.x + BOARD, Math.min(yFar, 19)) && !onScreen(cam, s.x, s.x + BOARD, 1) && !onScreen(cam, s.x, s.x + BOARD, Math.min(yFar, 34))) return null;
        const d = poly(cam, [[s.x, 0, 0], [s.x + BOARD + 0.004, 0, 0], [s.x + BOARD + 0.004, yFar, 0], [s.x, yFar, 0]]);
        if (!d) return null;
        return (
          <g key={i}>
            <path d={d} fill={s.c} />
            {s.joints.map((y, k) => {
              if (y < 0 || y > yFar) return null;
              const j = poly(cam, [[s.x, y, 0], [s.x + BOARD, y, 0], [s.x + BOARD, y + 0.025, 0], [s.x, y + 0.025, 0]]);
              return j ? <path key={k} d={j} fill="rgba(70,40,10,0.4)" /> : null;
            })}
            {macro &&
              s.grain.map((g, k) => {
                const x = s.x + g.dx;
                const pts: [number, number, number][] = [];
                for (let y = 12; y <= Math.min(yFar, 24); y += 0.5) pts.push([x + Math.sin(y * 1.7 + k + s.x * 3) * 0.012, y, 0]);
                const p = band(cam, pts.map((q) => [q[0], q[1]] as [number, number]), g.w, 1);
                return p ? <path key={`g${k}`} d={p} fill={`rgba(110,60,15,${g.a.toFixed(3)})`} /> : null;
              })}
          </g>
        );
      })}
      {lane && <path d={lane} fill="url(#ftw-lane)" />}
      {/* the lane's lacquer catches the arena lights */}
      {[[-4.2, 9.5, 1.4], [3.6, 13.5, 1.1], [-1.2, 16.2, 0.8], [5.5, 4.5, 0.9]].map(([x, y, r], i) => {
        const g = poly(cam, arc2(x, y, r, 0, Math.PI * 2, 24).map((q) => [q[0], q[1] * 1 + 0, 0] as [number, number, number]));
        return g ? <path key={`gl${i}`} d={g} fill="#DDE6EE" opacity={0.07} style={{ filter: `blur(${Math.max(4, ppf * r * 0.5).toFixed(1)}px)` }} /> : null;
      })}
      {laneEdge && <path d={laneEdge} fill="#C4CED4" opacity={0.85} />}
      <rect x={0} y={0} width={1080} height={1920} fill="url(#ftw-pool)" />
      <rect x={0} y={0} width={1080} height={1920} fill="url(#ftw-sheen)" />
      {paint.map((d, i) => (d ? <path key={i} d={d} fill={WHITE} /> : null))}
      {ft && <path d={ft} fill={WHITE} />}
      {ft && ftGlow > 0 && <path d={ft} fill="none" stroke="#FFFFFF" strokeOpacity={0.5 * ftGlow} strokeWidth={6 * ftGlow} style={{ filter: "blur(4px)" }} />}
    </svg>
  );
};
