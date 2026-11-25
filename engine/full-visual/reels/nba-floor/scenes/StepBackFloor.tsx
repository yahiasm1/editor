// The half court through the scene's camera, at Rule 1 geometry: maple strips 2.25 in wide running baseline to half
// court with staggered butt joints and grain on the close boards, the charcoal lane, white 2 in lines (sideline and
// baseline out of bounds, outside the 50 ft), the corner line 3 ft inside the sideline, the 23'9" arc, a stained
// apron, the board and ring above the floor. Satin glare and the light pool follow the camera: from straight above the
// floor reads like the diagram, at shoe height it shines like the Clarkson and Parker photos.
import React, { useMemo } from "react";
import {
  SB_APRON,
  SB_BASE,
  SB_CORNER_X,
  SB_KINK_Y,
  SB_LINE,
  SB_SIDE,
  stepBackArc as arc,
  stepBackBand as band,
  stepBackPoly as poly,
  stepBackProject as proj,
  stepBackRnd as rnd,
  type StepBackBasis,
  type StepBackCam,
  type StepBackV3,
} from "./StepBackWorld";

const BOARD = 0.1875;
const Y0 = SB_BASE - SB_LINE - SB_APRON;
const Y1 = 90;
const X1 = SB_SIDE + SB_LINE + SB_APRON;
const X0 = -X1;

export type StepBackFloorLook = {
  sidelineGlow: number; // 0..1 the sideline paint sharpening on "sideline"
  apronDark: number; // 0..1 the apron going darker beyond it
  low: number; // 0 straight down .. 1 shoe height: glare and grain
};

export const StepBackFloor: React.FC<{ cam: StepBackCam; B: StepBackBasis; f: number; look: StepBackFloorLook }> = ({ cam, B, f, look }) => {
  const strips = useMemo(() => {
    const out: { x: number; l: number; h: number; s: number; joints: number[]; grain: [number, number, number][] }[] = [];
    const n = Math.round((SB_SIDE * 2) / BOARD);
    for (let i = 0; i < n; i++) {
      const x = -SB_SIDE + i * BOARD;
      const joints: number[] = [];
      let y = SB_BASE - rnd(i + 77) * 6;
      let k = 0;
      while (y < Y1) {
        y += 2.2 + rnd(i * 13 + k) * 5.5;
        k++;
        if (y > SB_BASE && y < Y1) joints.push(y);
      }
      const grain: [number, number, number][] = [];
      if (x > 17) {
        for (let g = 0; g < 7; g++) {
          const gy = SB_BASE + rnd(i * 7 + g * 31) * 22;
          grain.push([x + 0.02 + rnd(i * 3 + g) * (BOARD - 0.04), gy, gy + 0.6 + rnd(i + g * 9) * 3.2]);
        }
      }
      out.push({ x, l: 67 + rnd(i) * 9, h: 34 + rnd(i + 900) * 6, s: 46 + rnd(i + 400) * 14, joints, grain });
    }
    return out;
  }, []);

  const P = (pts: StepBackV3[]) => poly(cam, B, pts);
  const L = (pts: [number, number][], w = SB_LINE) => band(cam, B, pts, w);
  const ppfAt = (x: number, y: number) => {
    const p = proj(cam, B, [x, y, 0]);
    return p ? cam.F / p.z : 0;
  };
  const ppfCorner = ppfAt(23, 0);

  // ---- the paint
  const lines: (string | null)[] = [];
  const half = SB_LINE / 2;
  // baseline (out of bounds, behind y -5.25) and the right half-court end of the slab
  lines.push(L([[-SB_SIDE - SB_LINE, SB_BASE - half], [SB_SIDE + SB_LINE, SB_BASE - half]]));
  lines.push(L([[-SB_SIDE - SB_LINE, 47 - half], [SB_SIDE + SB_LINE, 47 - half]]));
  // left sideline (the right one is drawn on its own: it lights on "sideline")
  lines.push(L([[-SB_SIDE - half, SB_BASE - SB_LINE], [-SB_SIDE - half, Y1]]));
  // three point line: straight corner lines 3 ft inside each sideline, then the 23'9" arc between them
  const cx = SB_CORNER_X - half;
  lines.push(L([[cx, SB_BASE], [cx, SB_KINK_Y]]));
  lines.push(L([[-cx, SB_BASE], [-cx, SB_KINK_Y]]));
  const a3 = Math.atan2(SB_KINK_Y, SB_CORNER_X);
  lines.push(L(arc(0, 0, 23.75 - half, a3, Math.PI - a3, 110)));
  // lane: 16 ft wide to the free throw line 15 ft from the board face
  for (const s of [-1, 1]) lines.push(L([[s * (8 - half), SB_BASE], [s * (8 - half), 13.75]]));
  lines.push(L([[-8, 13.75 - half], [8, 13.75 - half]]));
  // lane space marks and the hash marks outside the lane
  for (const s of [-1, 1]) {
    lines.push(P([[s * 8, 1.75, 0.002], [s * 8.67, 1.75, 0.002], [s * 8.67, 2.75, 0.002], [s * 8, 2.75, 0.002]]));
    for (const y of [5.75, 8.75, 11.75]) lines.push(L([[s * 8, y], [s * 8.67, y]]));
  }
  // restricted area: a 4 ft half circle round the rim, straight back to the board
  lines.push(L(arc(0, 0, 4 - half, 0, Math.PI, 44)));
  for (const s of [-1, 1]) lines.push(L([[s * (4 - half), -1.25], [s * (4 - half), 0]]));
  // free throw circle: solid toward half court, dashed inside the lane
  lines.push(L(arc(0, 13.75, 6 - half, 0, Math.PI, 56)));
  for (let k = 0; k < 7; k++) {
    const a0 = Math.PI + ((k + 0.25) / 7) * Math.PI;
    lines.push(L(arc(0, 13.75, 6 - half, a0, a0 + Math.PI / 14, 6)));
  }
  // 28 ft hash on the sidelines, centre circle
  for (const s of [-1, 1]) lines.push(L([[s * SB_SIDE, 22.75], [s * (SB_SIDE - 3), 22.75]]));
  lines.push(L(arc(0, 41.75, 6, Math.PI, 2 * Math.PI, 40)));
  lines.push(L(arc(0, 41.75, 2, Math.PI, 2 * Math.PI, 20)));

  const sideR = L([[SB_SIDE + half, SB_BASE - SB_LINE], [SB_SIDE + half, Y1]]);
  const lane = P([[-8, SB_BASE, 0.001], [8, SB_BASE, 0.001], [8, 13.75, 0.001], [-8, 13.75, 0.001]]);
  const court = P([[-SB_SIDE, SB_BASE, 0], [SB_SIDE, SB_BASE, 0], [SB_SIDE, Y1, 0], [-SB_SIDE, Y1, 0]]);
  const slab = P([[X0, Y0, 0], [X1, Y0, 0], [X1, Y1, 0], [X0, Y1, 0]]);
  const slabSide = P([[X1, Y0, 0], [X1, Y1, 0], [X1, Y1, -1], [X1, Y0, -1]]);
  const slabFront = P([[X0, Y0, 0], [X1, Y0, 0], [X1, Y0, -1], [X0, Y0, -1]]);
  // the apron's thin red-orange border, as in the Parker photo, 1 ft outside the boundary
  const apronRule = L([[SB_SIDE + SB_LINE + 1.4, Y0], [SB_SIDE + SB_LINE + 1.4, Y1]], 0.09);
  const apronRuleB = L([[X0, SB_BASE - SB_LINE - 1.4], [X1, SB_BASE - SB_LINE - 1.4]], 0.09);

  // ---- boards: cull what is off screen, draw joints and grain only where they are bigger than a pixel
  const boards: React.ReactNode[] = [];
  strips.forEach((s, i) => {
    const d = P([[s.x, SB_BASE, 0], [s.x + BOARD + 0.006, SB_BASE, 0], [s.x + BOARD + 0.006, Y1, 0], [s.x, Y1, 0]]);
    if (!d) return;
    boards.push(<path key={`b${i}`} d={d} fill={`hsl(${s.h.toFixed(1)}, ${s.s.toFixed(1)}%, ${s.l.toFixed(1)}%)`} />);
    const ppfHere = ppfAt(s.x, 0);
    if (ppfHere > 7) {
      for (let k = 0; k < s.joints.length; k++) {
        const y = s.joints[k];
        if (ppfAt(s.x, y) < 6) continue;
        const j = P([[s.x, y, 0.001], [s.x + BOARD, y, 0.001], [s.x + BOARD, y + 0.025, 0.001], [s.x, y + 0.025, 0.001]]);
        if (j) boards.push(<path key={`j${i}-${k}`} d={j} fill="rgba(74,40,10,0.42)" />);
      }
      // the seam between two strips
      const seam = P([[s.x, SB_BASE, 0.001], [s.x + 0.012, SB_BASE, 0.001], [s.x + 0.012, Y1, 0.001], [s.x, Y1, 0.001]]);
      if (seam && ppfHere > 22) boards.push(<path key={`s${i}`} d={seam} fill="rgba(90,52,16,0.22)" />);
    }
    if (ppfHere > 30) {
      s.grain.forEach(([gx, ga, gb], k) => {
        const g = P([[gx, ga, 0.001], [gx + 0.008, ga, 0.001], [gx + 0.008 + 0.004, gb, 0.001], [gx + 0.004, gb, 0.001]]);
        if (g) boards.push(<path key={`g${i}-${k}`} d={g} fill={k % 2 ? "rgba(120,70,20,0.28)" : "rgba(255,240,210,0.22)"} />);
      });
    }
  });

  // apron: stained darker boards
  const apron: React.ReactNode[] = [];
  const apronCol = `hsl(24, ${(34 - 10 * look.apronDark).toFixed(1)}%, ${(30 - 13 * look.apronDark).toFixed(1)}%)`;
  for (const [ax0, ax1] of [[SB_SIDE + SB_LINE, X1], [X0, -SB_SIDE - SB_LINE]] as [number, number][]) {
    const d = P([[ax0, Y0, 0], [ax1, Y0, 0], [ax1, Y1, 0], [ax0, Y1, 0]]);
    if (d) apron.push(<path key={`a${ax0}`} d={d} fill={apronCol} />);
    if (ppfAt((ax0 + ax1) / 2, 0) > 14) {
      for (let x = ax0; x < ax1 - 0.05; x += BOARD) {
        const sd = P([[x, Y0, 0.001], [x + 0.012, Y0, 0.001], [x + 0.012, Y1, 0.001], [x, Y1, 0.001]]);
        if (sd) apron.push(<path key={`as${x.toFixed(2)}`} d={sd} fill="rgba(0,0,0,0.25)" />);
      }
    }
  }
  const apronB = P([[-SB_SIDE - SB_LINE, Y0, 0], [SB_SIDE + SB_LINE, Y0, 0], [SB_SIDE + SB_LINE, SB_BASE - SB_LINE, 0], [-SB_SIDE - SB_LINE, SB_BASE - SB_LINE, 0]]);

  // ---- the basket above the floor: board face at y -1.25, 6 ft wide, ring 18 in, 10 ft up
  const glass = P([[-3, -1.25, 9.5], [3, -1.25, 9.5], [3, -1.25, 13], [-3, -1.25, 13]]);
  const glassTop = P([[-3, -1.35, 13], [3, -1.35, 13], [3, -1.15, 13], [-3, -1.15, 13]]);
  const ring = band(cam, B, arc(0, 0, 0.78, 0, Math.PI * 2, 40), 0.06, 10);
  const net = arc(0, 0, 0.75, 0, Math.PI * 2, 12).map((p, k) => {
    const q = arc(0, 0, 0.45, 0, Math.PI * 2, 12)[k];
    return P([[p[0], p[1], 10], [p[0] + 0.02, p[1], 10], [q[0] + 0.02, q[1], 8.4], [q[0], q[1], 8.4]]);
  });
  const arm = P([[-0.25, -5.6, 10.2], [0.25, -5.6, 10.2], [0.25, -1.3, 10.6], [-0.25, -1.3, 10.6]]);
  const shadow = P([[-3.2, -1.4, 0.003], [3.2, -1.4, 0.003], [3.6, 1.2, 0.003], [-3.6, 1.2, 0.003]]);

  const pc = proj(cam, B, [20, 4, 0]);
  const pool = pc ?? { x: 540, y: 985 };
  const sweep = -600 + ((f * 3.1) % 2400);
  const horizon = cam.cy - cam.F * Math.tan(-cam.pitch < Math.PI / 2 - 0.01 ? -cam.pitch : Math.PI / 2 - 0.01);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        {slab && (
          <clipPath id="sb-slab">
            <path d={slab} />
          </clipPath>
        )}
        {court && (
          <clipPath id="sb-court">
            <path d={court} />
          </clipPath>
        )}
        <radialGradient id="sb-pool" cx={pool.x} cy={pool.y} r={900 + 500 * look.low} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF4DE" stopOpacity={0.1} />
          <stop offset="0.6" stopColor="#000" stopOpacity={0.1} />
          <stop offset="1" stopColor="#000" stopOpacity={0.45} />
        </radialGradient>
        <linearGradient id="sb-sweep" gradientUnits="userSpaceOnUse" x1={sweep} y1={500} x2={sweep + 600} y2={1500}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.1 - 0.05 * look.low} />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* grazing glare: the arena's lights on the satin finish, strongest toward the horizon */}
        <linearGradient id="sb-glare" gradientUnits="userSpaceOnUse" x1={0} y1={horizon} x2={0} y2={horizon + 900}>
          <stop offset="0" stopColor="#FFF6E6" stopOpacity={0.55 * look.low} />
          <stop offset="0.25" stopColor="#FFF1DA" stopOpacity={0.28 * look.low} />
          <stop offset="1" stopColor="#FFF1DA" stopOpacity="0" />
        </linearGradient>
        {/* the far court sinks into the dark arena */}
        <linearGradient id="sb-fog" gradientUnits="userSpaceOnUse" x1={0} y1={horizon} x2={0} y2={horizon + 260}>
          <stop offset="0" stopColor="#0D1117" stopOpacity={0.95 * look.low} />
          <stop offset="0.35" stopColor="#0D1117" stopOpacity={0.45 * look.low} />
          <stop offset="1" stopColor="#0D1117" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sb-lane" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#25272B" />
          <stop offset="1" stopColor="#2E3035" />
        </linearGradient>
      </defs>
      {slabFront && <path d={slabFront} fill="#06080B" />}
      {slabSide && <path d={slabSide} fill="#080A0E" />}
      <g clipPath={slab ? "url(#sb-slab)" : undefined}>
        {apron}
        {apronB && <path d={apronB} fill={apronCol} />}
        {apronRule && <path d={apronRule} fill="#B5432A" opacity={0.75} />}
        {apronRuleB && <path d={apronRuleB} fill="#B5432A" opacity={0.75} />}
        <g clipPath={court ? "url(#sb-court)" : undefined}>
          {boards}
          {lane && <path d={lane} fill="url(#sb-lane)" opacity={0.93} />}
          {/* scuffs where players stand most: the corners and the top of the key */}
          {[[23.2, -1.5, 1.6], [23.6, 3.5, 1.2], [-23.4, 0, 1.6], [0, 24.5, 2.2], [16.5, 17, 1.4]].map(([x, y, r], i) => {
            const g = P(arc(x, y, r, 0, Math.PI * 2, 24).map((q) => [q[0], q[1], 0.001] as StepBackV3));
            return g ? <path key={`sc${i}`} d={g} fill="#3A2410" opacity={0.08} style={{ filter: `blur(${Math.max(2, ppfAt(x, y) * r * 0.35).toFixed(1)}px)` }} /> : null;
          })}
        </g>
        {lines.map((d, i) => (d ? <path key={`l${i}`} d={d} fill="#F2F4F6" /> : null))}
        {sideR && <path d={sideR} fill={`rgb(${Math.round(222 + 33 * look.sidelineGlow)}, ${Math.round(225 + 30 * look.sidelineGlow)}, ${Math.round(228 + 27 * look.sidelineGlow)})`} />}
        {sideR && look.sidelineGlow > 0 && (
          <path d={sideR} fill="#FFFFFF" opacity={0.5 * look.sidelineGlow} style={{ filter: `blur(${(2 + ppfCorner * 0.02).toFixed(1)}px)` }} />
        )}
        {shadow && <path d={shadow} fill="#000" opacity={0.12 * (1 - look.low)} style={{ filter: "blur(10px)" }} />}
        <rect x={0} y={0} width={1080} height={1920} fill="url(#sb-pool)" />
        <rect x={0} y={0} width={1080} height={1920} fill="url(#sb-sweep)" />
        {look.low > 0 && <rect x={0} y={0} width={1080} height={1920} fill="url(#sb-glare)" />}
        {look.low > 0 && <rect x={0} y={0} width={1080} height={1920} fill="url(#sb-fog)" />}
      </g>
      {arm && <path d={arm} fill="#15181D" />}
      {glass && <path d={glass} fill="#C9DCEB" opacity={0.14} stroke="#F2F4F6" strokeWidth={1.4} />}
      {glassTop && <path d={glassTop} fill="#E8EEF3" opacity={0.9} />}
      {net.map((d, i) => (d ? <path key={`n${i}`} d={d} fill="#F2F4F6" opacity={0.7} /> : null))}
      {ring && <path d={ring} fill="#E35205" />}
    </svg>
  );
};
