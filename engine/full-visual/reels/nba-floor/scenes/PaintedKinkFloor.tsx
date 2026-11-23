// The floor, projected through the scene's one camera (PaintedKinkWorld.ts). Read off the Clarkson 2025 NBA Cup photo
// (paint and maple at shoe level), the Wikideas1 top-down court (board pieces, line weight) and the Garden / Ball Arena
// photos (a lit slab in a dark arena, a darker apron):
// - honey maple strips 2.25 in wide, each its own cut, butted end to end with staggered joints; grain only up close;
// - satin lacquer: a pool of light, a slow sweep, long glare streaks running along the boards at a low angle;
// - sole scuffs and dust where players stand most (the corners, the top of the key);
// - the lane in charcoal stain; white 2 in paint at true width: baseline, sidelines, lane, hash marks (Rule 1.5-1.7),
//   restricted area, free throw circle (dashed half inside the lane), the three-point line;
// - the paint's raised edge: a bright lip and a hairline shadow, seen only at shoe height;
// - the apron 3 ft wide in dark stained wood, then the arena's navy.
import React, { useMemo } from "react";
import {
  PK_APRON, PK_ARC_R, PK_BASE_Y, PK_CORNER_X, PK_HALF_Y, PK_KINK_A, PK_LINE, PK_SIDE_X,
  paintedKinkArc as arc, paintedKinkBand as band, paintedKinkCut as cut, paintedKinkPoly as poly,
  paintedKinkProject as proj, paintedKinkThreePath, pkRnd as rnd, type PaintedKinkCam,
} from "./PaintedKinkWorld";

const BOARD = 0.1875;
const WHITE = "#F3F5F7";
const FAR_Y = 70;

type Strip = { x: number; bucket: number; joints: number[]; apron: boolean; grain: { dx: number; a: number; w: number; ph: number }[] };

const SHADES = ["#D9B983", "#D3B07A", "#DDC08F", "#CFAA72", "#E0C596", "#D6B47F", "#C9A46C", "#DBBC88"];
const APRON_SHADES = ["#4A3321", "#432E1E", "#503824", "#3E2A1B"];

const usePaintedKinkStrips = () =>
  useMemo(() => {
    const out: Strip[] = [];
    const x0 = -PK_SIDE_X - PK_APRON;
    const n = Math.ceil((2 * (PK_SIDE_X + PK_APRON)) / BOARD);
    for (let i = 0; i < n; i++) {
      const x = x0 + i * BOARD;
      const apron = x < -PK_SIDE_X - 0.01 || x >= PK_SIDE_X - 0.01;
      const joints: number[] = [];
      let y = PK_BASE_Y - PK_APRON - rnd(i + 77) * 6;
      let k = 0;
      while (y < FAR_Y) {
        y += 1.6 + rnd(i * 13 + k) * 5.5;
        k++;
        joints.push(y);
      }
      const grain = [0, 1, 2, 3].map((g) => ({ dx: 0.02 + rnd(i * 7 + g) * 0.15, a: 0.05 + rnd(i * 5 + g) * 0.09, w: 0.004 + rnd(i * 3 + g) * 0.008, ph: rnd(i * 11 + g) * 6 }));
      out.push({ x, bucket: Math.floor(rnd(i, 4) * (apron ? APRON_SHADES.length : SHADES.length)), joints, apron, grain });
    }
    return out;
  }, []);

/** scuffs: short grey arcs left by soles, densest in the corners and at the top of the key */
const usePaintedKinkScuffs = () =>
  useMemo(() => {
    const out: { x: number; y: number; r: number; a0: number; len: number; w: number; o: number }[] = [];
    const spots: [number, number, number, number][] = [[23, 1, 3, 26], [-23, 1, 3, 26], [0, 26, 6, 30], [16, 18, 5, 14], [-16, 18, 5, 14], [5, 10, 6, 12]];
    let id = 0;
    for (const [cx, cy, sp, n] of spots)
      for (let i = 0; i < n; i++, id++)
        out.push({ x: cx + (rnd(id, 21) - 0.5) * 2 * sp, y: cy + (rnd(id, 22) - 0.5) * 2 * sp, r: 0.4 + rnd(id, 23) * 1.4, a0: rnd(id, 24) * 6.28, len: 0.4 + rnd(id, 25) * 1.2, w: 0.012 + rnd(id, 26) * 0.03, o: 0.05 + rnd(id, 27) * 0.09 });
    return out;
  }, []);

export type PaintedKinkPaint = {
  /** 0..1 how far the fresh coat has run along the three-point line (top of the arc -> kink -> baseline) */
  run: number;
  /** 0..1 how wet the fresh coat still looks (gloss that dries) */
  wet: number;
};

export const PaintedKinkFloor: React.FC<{
  cam: PaintedKinkCam;
  f: number;
  paint: PaintedKinkPaint;
  /** world point where the light pool sits */
  light: [number, number];
  /** 0..1 sidelines lit; push = how far they press inward this frame (ft) */
  side: number;
  push: number;
}> = ({ cam, f, paint, light, side, push }) => {
  const strips = usePaintedKinkStrips();
  const scuffs = usePaintedKinkScuffs();
  const center = proj(cam, cam.tx, cam.ty, 0);
  const ppf = center.ok ? center.s : 20;
  const low = Math.max(0, Math.min(1, (cam.pitch - 0.5) / 0.8)); // 0 top-down, 1 shoe height
  const macro = ppf > 90;
  const eyeFoot: [number, number] = [cam.tx - Math.sin(cam.yaw) * cam.D * Math.sin(cam.pitch), cam.ty - Math.cos(cam.yaw) * cam.D * Math.sin(cam.pitch)];

  // boards, grouped by shade so the svg holds a few long paths, not hundreds of nodes
  const yA = PK_BASE_Y - PK_APRON;
  const buckets: string[] = SHADES.map(() => "");
  const apronB: string[] = APRON_SHADES.map(() => "");
  let joints = "";
  let grain = "";
  for (const s of strips) {
    const d = poly(cam, [[s.x, yA, 0], [s.x + BOARD + 0.003, yA, 0], [s.x + BOARD + 0.003, FAR_Y, 0], [s.x, FAR_Y, 0]]);
    if (!d) continue;
    if (s.apron) apronB[s.bucket] += d;
    else buckets[s.bucket] += d;
    // joints: every butt end, a thin dark seam across the strip (skip the far ones that would merge into mush)
    for (const y of s.joints) {
      if (y < yA || y > FAR_Y) continue;
      const p = proj(cam, s.x, y, 0);
      if (!p.ok || p.s < 6) continue;
      const jw = Math.max(0.012, 1.1 / p.s);
      joints += poly(cam, [[s.x, y, 0], [s.x + BOARD, y, 0], [s.x + BOARD, y + jw, 0], [s.x, y + jw, 0]]);
    }
    if (macro && !s.apron && Math.abs(s.x - eyeFoot[0]) < 9) {
      for (const g of s.grain) {
        const pts: [number, number][] = [];
        const y0 = Math.max(yA, eyeFoot[1] - 2), y1 = Math.min(FAR_Y, eyeFoot[1] + 13);
        for (let y = y0; y <= y1; y += 0.35) pts.push([s.x + g.dx + Math.sin(y * 1.3 + g.ph) * 0.012, y]);
        grain += band(cam, pts, g.w);
      }
    }
  }

  // the lane, stained charcoal
  const lane = poly(cam, [[-8, PK_BASE_Y, 0], [8, PK_BASE_Y, 0], [8, 13.75, 0], [-8, 13.75, 0]]);

  // painted lines (2 in wide, all white)
  const L = PK_LINE;
  const lines: string[] = [];
  const push2 = (d: string) => d && lines.push(d);
  push2(band(cam, [[-PK_SIDE_X - L, PK_BASE_Y - L / 2], [PK_SIDE_X + L, PK_BASE_Y - L / 2]], L)); // baseline
  push2(band(cam, [[-PK_SIDE_X - L, PK_HALF_Y], [PK_SIDE_X + L, PK_HALF_Y]], L)); // half court line
  for (const s of [-1, 1]) {
    push2(band(cam, [[s * (8 - L / 2), PK_BASE_Y], [s * (8 - L / 2), 13.75]], L)); // lane sides
    push2(band(cam, [[s * 4 - (s * L) / 2, 0], [s * 4 - (s * L) / 2, -1.25]], L)); // restricted area legs
    // lane space marks (Rule 1.2) and the block, outside the lane
    push2(poly(cam, [[s * 8, 1.75, 0], [s * 8.67, 1.75, 0], [s * 8.67, 2.75, 0], [s * 8, 2.75, 0]]));
    for (const y of [5.75, 8.75, 11.75]) push2(band(cam, [[s * 8, y], [s * 8.5, y]], L));
    // baseline hash marks 3 ft outside the lane (Rule 1.6), 13 ft hash marks (Rule 1.7), 28 ft sideline marks (Rule 1.5)
    push2(band(cam, [[s * 11, PK_BASE_Y], [s * 11, PK_BASE_Y + 0.5]], L));
    push2(band(cam, [[s * 11, 7.75], [s * 11.5, 7.75]], L));
    push2(band(cam, [[s * PK_SIDE_X, 22.75], [s * (PK_SIDE_X - 3), 22.75]], L));
  }
  push2(band(cam, [[-8, 13.75 - L / 2], [8, 13.75 - L / 2]], L)); // free throw line
  push2(band(cam, arc(0, 0, 4 - L / 2, 0, Math.PI, 36), L)); // restricted arc
  push2(band(cam, arc(0, 13.75, 6 - L / 2, 0, Math.PI, 40), L)); // free throw circle, solid half
  for (let k = 0; k < 8; k++) {
    const a0 = Math.PI + (k / 8) * Math.PI + 0.07;
    push2(band(cam, arc(0, 13.75, 6 - L / 2, a0, a0 + Math.PI / 8 - 0.18, 6), L)); // the dashed half
  }
  // the centre circle's edge at half court
  push2(band(cam, arc(0, PK_HALF_Y, 6 - L / 2, 0, Math.PI, 40), L));

  // sidelines, lit on "width", pressing inward a hair
  const sideD = [-1, 1].map((s) => band(cam, [[s * (PK_SIDE_X + L / 2 - push), PK_BASE_Y - L], [s * (PK_SIDE_X + L / 2 - push), PK_HALF_Y + 6]], L));

  // the three-point line: worn paint, then the fresh coat running along it
  const three = ([1, -1] as const).map((s) => paintedKinkThreePath(s));
  const worn = three.map((p) => band(cam, cut(p, Math.min(1, paint.run), 1), L));
  const fresh = three.map((p) => band(cam, cut(p, 0, paint.run), L));
  const gloss = three.map((p) => (paint.wet > 0 ? band(cam, cut(p, Math.max(0, paint.run - 0.55), paint.run), L * 0.34, L * 0.12) : ""));
  // the raised edge at shoe height: a lit lip on the inner edge, a hairline shadow on the outer
  const lip = macro ? three.map((p) => band(cam, p, L * 0.12, -L * 0.5)) : ["", ""];
  const shade = macro ? three.map((p) => band(cam, p, L * 0.1, L * 0.55)) : ["", ""];
  const bead = paint.run > 0 && paint.run < 1 ? three.map((p) => {
    const c = cut(p, paint.run, paint.run + 0.0001)[0];
    return proj(cam, c[0], c[1], 0);
  }) : [];

  // scuffs
  let scuffD = "";
  for (const s of scuffs) {
    const p = proj(cam, s.x, s.y, 0);
    if (!p.ok || p.s < 10) continue;
    scuffD += band(cam, arc(s.x, s.y, s.r, s.a0, s.a0 + s.len / s.r, 8), s.w);
  }

  // light: one pool on the floor (the arena light parked where the scene looks), and long glare streaks along the
  // boards when the camera is low
  const lp = proj(cam, light[0], light[1], 0);
  const sweepX = ((f * 2.4) % 1500) - 240;
  const streaks = [-14, -6, 3, 11, 19, 26].map((x0, i) => {
    const x = x0 + Math.sin(f / 90 + i) * 0.3, yc = 24 + i * 5;
    return poly(cam, Array.from({ length: 24 }, (_, k) => [x + 0.7 * Math.cos((k / 24) * 6.283), yc + 14 * Math.sin((k / 24) * 6.283), 0] as [number, number, number]));
  });
  const apronEdge = [-1, 1].map((s) => poly(cam, [[s * (PK_SIDE_X + PK_APRON), yA, 0], [s * (PK_SIDE_X + PK_APRON + 0.25), yA, 0], [s * (PK_SIDE_X + PK_APRON + 0.25), FAR_Y, 0], [s * (PK_SIDE_X + PK_APRON), FAR_Y, 0]]));
  const lineW = Math.max(0, Math.min(1, side));
  const sideFill = `rgb(${Math.round(176 + 79 * lineW)},${Math.round(182 + 73 * lineW)},${Math.round(188 + 67 * lineW)})`;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <radialGradient id="pk-pool" cx={lp.ok ? lp.x : 540} cy={lp.ok ? lp.y : 1000} r={Math.max(500, Math.min(1400, (lp.ok ? lp.s : 20) * 16))} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF6E2" stopOpacity={0.2} />
          <stop offset="0.45" stopColor="#FFF6E2" stopOpacity={0.05} />
          <stop offset="1" stopColor="#000" stopOpacity={0.38} />
        </radialGradient>
        <linearGradient id="pk-sheen" gradientUnits="userSpaceOnUse" x1={sweepX} y1={300} x2={sweepX + 460} y2={1500}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.09 + 0.05 * (1 - low)} />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pk-lane" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#26282C" />
          <stop offset="1" stopColor="#303237" />
        </linearGradient>
        <linearGradient id="pk-haze" x1="0" y1="0" x2="0" y2="1920" gradientUnits="userSpaceOnUse">
          <stop offset={0.28} stopColor="#F4EAD6" stopOpacity={0.32 * low} />
          <stop offset={0.5} stopColor="#F4EAD6" stopOpacity={0} />
        </linearGradient>
        <radialGradient id="pk-bead">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="0.35" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <filter id="pk-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={Math.max(3, Math.min(30, ppf * 0.08))} /></filter>
        <filter id="pk-scuff" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={Math.max(0.6, Math.min(4, ppf * 0.012))} /></filter>
        <filter id="pk-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={6} /></filter>
      </defs>
      {apronB.map((d, i) => (d ? <path key={`a${i}`} d={d} fill={APRON_SHADES[i]} /> : null))}
      {buckets.map((d, i) => (d ? <path key={`b${i}`} d={d} fill={SHADES[i]} /> : null))}
      {joints && <path d={joints} fill="rgba(92,58,22,0.26)" />}
      {grain && <path d={grain} fill="rgba(120,72,24,0.16)" />}
      {lane && <path d={lane} fill="url(#pk-lane)" />}
      {scuffD && <path d={scuffD} fill="#6A6158" opacity={0.32} filter="url(#pk-scuff)" />}
      {apronEdge.map((d, i) => (d ? <path key={`e${i}`} d={d} fill="#1A1410" /> : null))}
      {/* satin lacquer: pool of light, a slow sweep, glare streaks along the boards at shoe height */}
      <rect x={0} y={0} width={1080} height={1920} fill="url(#pk-pool)" />
      <rect x={0} y={0} width={1080} height={1920} fill="url(#pk-sheen)" />
      {low > 0.05 && streaks.map((d, i) => (d ? <path key={`s${i}`} d={d} fill="#FFF3DC" opacity={0.16 * low} filter="url(#pk-soft)" /> : null))}
      {low > 0.05 && <rect x={0} y={0} width={1080} height={1920} fill="url(#pk-haze)" />}
      {lines.map((d, i) => <path key={`l${i}`} d={d} fill={WHITE} />)}
      {sideD.map((d, i) => (d ? <path key={`sd${i}`} d={d} fill={sideFill} /> : null))}
      {lineW > 0 && sideD.map((d, i) => (d ? <path key={`sg${i}`} d={d} fill="none" stroke="#FFFFFF" strokeOpacity={0.55 * lineW} strokeWidth={8} filter="url(#pk-glow)" /> : null))}
      {/* the three-point line */}
      {worn.map((d, i) => (d ? <path key={`w${i}`} d={d} fill="#E4DFD3" opacity={0.9} /> : null))}
      {fresh.map((d, i) => (d ? <path key={`fr${i}`} d={d} fill="#FCFDFE" /> : null))}
      {lip.map((d, i) => (d ? <path key={`lp${i}`} d={d} fill="#FFFFFF" opacity={0.75} /> : null))}
      {shade.map((d, i) => (d ? <path key={`sh${i}`} d={d} fill="#6B4A22" opacity={0.35} /> : null))}
      {gloss.map((d, i) => (d ? <path key={`g${i}`} d={d} fill="#FFFFFF" opacity={0.9 * paint.wet} filter="url(#pk-glow)" /> : null))}
      <PaintedKinkBasket cam={cam} f={f} />
      {bead.map((p, i) => (p.ok ? <ellipse key={`bd${i}`} cx={p.x} cy={p.y} rx={Math.max(10, p.s * 0.55)} ry={Math.max(7, p.s * 0.32)} fill="url(#pk-bead)" /> : null))}
    </svg>
  );
};

/** the basket from above: the stanchion arm, the 6 ft board with its 24 x 18 in box, the orange ring 10 ft up,
 *  the white cord net hanging under it, and their shadows on the boards */
const PaintedKinkBasket: React.FC<{ cam: PaintedKinkCam; f: number }> = ({ cam, f }) => {
  const P = (x: number, y: number, z: number) => proj(cam, x, y, z);
  const box = (x0: number, x1: number, y0: number, y1: number, z: number) => poly(cam, [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]);
  const shadowOff = 0.9; // light from the stands, a little toward half court
  const arm = box(-0.55, 0.55, -6.6, -1.5, 11.2);
  const armShadow = box(-0.6, 0.6, -6.6 + shadowOff, -1.5 + shadowOff, 0);
  const board = box(-3, 3, -1.42, -1.25, 13.5);
  const boardShadow = box(-3, 3, -1.42 + shadowOff * 1.2, -1.25 + shadowOff * 1.2, 0);
  const ring = (r: number, z: number, cy = 0, n = 40) => poly(cam, arc(0, cy, r, 0, Math.PI * 2, n).map(([x, y]) => [x, y, z] as [number, number, number]));
  const sway = Math.sin(f / 23) * 0.04;
  const netLines: string[] = [];
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    const t = P(0.75 * Math.cos(a), 0.75 * Math.sin(a), 10);
    const b = P(0.42 * Math.cos(a + 0.5) + sway, 0.42 * Math.sin(a + 0.5), 8.6);
    if (t.ok && b.ok) netLines.push(`M${t.x.toFixed(1)} ${t.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
  }
  const c = P(0, 0, 10);
  const sw = c.ok ? Math.max(1.5, c.s * 0.06) : 2;
  return (
    <g>
      {armShadow && <path d={armShadow} fill="#000" opacity={0.22} />}
      {boardShadow && <path d={boardShadow} fill="#000" opacity={0.18} />}
      {ring(0.8, 0, shadowOff) && <path d={ring(0.8, 0, shadowOff)} fill="none" stroke="#000" strokeOpacity={0.2} strokeWidth={sw} />}
      {arm && <path d={arm} fill="#20252C" stroke="#3B434D" strokeWidth={1} />}
      {board && <path d={board} fill="#C9D4DC" fillOpacity={0.55} stroke="#F3F5F7" strokeWidth={Math.max(1, sw * 0.6)} />}
      <path d={netLines.join("")} stroke="#F3F5F7" strokeOpacity={0.75} strokeWidth={Math.max(1, sw * 0.45)} fill="none" />
      {ring(0.42, 8.6) && <path d={ring(0.42, 8.6)} fill="none" stroke="#E8ECEF" strokeOpacity={0.6} strokeWidth={Math.max(1, sw * 0.4)} />}
      {ring(0.79, 10) && <path d={ring(0.79, 10)} fill="none" stroke="#E35205" strokeWidth={sw * 1.4} />}
    </g>
  );
};

export { PK_ARC_R, PK_CORNER_X, PK_KINK_A };
