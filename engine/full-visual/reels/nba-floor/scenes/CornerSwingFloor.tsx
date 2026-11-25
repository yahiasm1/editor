// The half court through the scene's camera, at Rule 1 geometry: maple strips 2.25 in wide running baseline to half
// court with staggered butt joints and grain on the close boards, the charcoal lane, white 2 in lines (sideline and
// baseline out of bounds, outside the 50 ft), the corner line 3 ft inside the sideline, the 23'9" arc, a stained
// apron, the board and ring above the floor. Satin glare and the light pool follow the camera: from straight above the
// floor reads like the diagram, at shoe height it shines like the Clarkson and Parker photos.
import React, { useMemo } from "react";
import {
  CS_APRON,
  CS_BASE,
  CS_CORNER_X,
  CS_KINK_Y,
  CS_LINE,
  CS_SIDE,
  cornerSwingArc as arc,
  cornerSwingBand as band,
  cornerSwingPoly as poly,
  cornerSwingProject as proj,
  cornerSwingRnd as rnd,
  type CornerSwingBasis,
  type CornerSwingCam,
  type CornerSwingV3,
} from "./CornerSwingWorld";

const BOARD = 0.1875;
const Y0 = CS_BASE - CS_LINE - CS_APRON;
const Y1 = 90;
const X1 = CS_SIDE + CS_LINE + CS_APRON;
const X0 = -X1;

export type CornerSwingFloorLook = {
  sidelineGlow: number; // 0..1 the sideline paint sharpening on "sideline"
  apronDark: number; // 0..1 the apron going darker beyond it
  low: number; // 0 straight down .. 1 shoe height: glare and grain
};

export const CornerSwingFloor: React.FC<{ cam: CornerSwingCam; B: CornerSwingBasis; f: number; look: CornerSwingFloorLook }> = ({ cam, B, f, look }) => {
  const strips = useMemo(() => {
    const out: { x: number; l: number; h: number; s: number; joints: number[]; grain: [number, number, number][] }[] = [];
    const n = Math.round((CS_SIDE * 2) / BOARD);
    for (let i = 0; i < n; i++) {
      const x = -CS_SIDE + i * BOARD;
      const joints: number[] = [];
      let y = CS_BASE - rnd(i + 77) * 6;
      let k = 0;
      while (y < Y1) {
        y += 2.2 + rnd(i * 13 + k) * 5.5;
        k++;
        if (y > CS_BASE && y < Y1) joints.push(y);
      }
      const grain: [number, number, number][] = [];
      if (x > 17) {
        // the close boards, under the camera at shoe height: long grain streaks, light and dark
        for (let g = 0; g < 22; g++) {
          const gy = CS_BASE - 1 + rnd(i * 7 + g * 31) * 26;
          grain.push([x + 0.012 + rnd(i * 3 + g) * (BOARD - 0.024), gy, gy + 0.5 + rnd(i + g * 9) * 4.2]);
        }
      }
      // every strip is cut from a different board: some paler, some honey, a few with a redder heart
      const red = rnd(i + 1300) > 0.86 ? 1 : 0;
      out.push({ x, l: 63 + rnd(i) * 14 - red * 5, h: 33 + rnd(i + 900) * 7 - red * 6, s: 42 + rnd(i + 400) * 18 + red * 8, joints, grain });
    }
    return out;
  }, []);

  // the arena beyond the floor, seen only from shoe height: tiered stands along the far baseline and the right
  // sideline, a dim crowd in them, a ribbon board along the first tier, a courtside row
  const stands = useMemo(() => {
    const tiers: { pts: CornerSwingV3[]; c: string }[] = [];
    const crowd: { pts: CornerSwingV3[]; c: string }[] = [];
    const fan = (k: number, x: number, y: number, z: number, along: [number, number], sit: number) => {
      const w = 0.62 + rnd(k) * 0.3;
      const h = 1.6 + rnd(k + 3) * 0.9 - sit;
      const tone = 16 + rnd(k + 7) * 26;
      const hue = rnd(k + 11);
      const c = hue > 0.9 ? `rgb(${Math.round(tone * 1.7)},${Math.round(tone * 0.95)},${Math.round(tone * 0.8)})` : hue > 0.8 ? `rgb(${Math.round(tone * 0.85)},${Math.round(tone)},${Math.round(tone * 1.45)})` : `rgb(${Math.round(tone)},${Math.round(tone * 0.96)},${Math.round(tone * 0.95)})`;
      crowd.push({ pts: [[x, y, z], [x + along[0] * w, y + along[1] * w, z], [x + along[0] * w, y + along[1] * w, z + h], [x, y, z + h]], c });
    };
    for (let r = 0; r < 16; r++) {
      const z = 2.4 + r * 1.75;
      const ry = 100 + r * 2.9;
      const rx = 35 + r * 2.9;
      const l = 9 + r * 0.25;
      tiers.push({ pts: [[-45, ry, z - 1.75], [70, ry, z - 1.75], [70, ry, z], [-45, ry, z]], c: `hsl(215, 22%, ${l.toFixed(1)}%)` });
      tiers.push({ pts: [[rx, -14, z - 1.75], [rx, ry, z - 1.75], [rx, ry, z], [rx, -14, z]], c: `hsl(215, 22%, ${(l - 1.5).toFixed(1)}%)` });
      for (let k = 0; k < 64; k++) if (rnd(r * 101 + k) > 0.12) fan(r * 1000 + k, -45 + k * 1.8 + rnd(k + r) * 0.4, ry + 0.4, z, [1, 0], 0);
      for (let k = 0; k < 64; k++) if (rnd(r * 211 + k + 5000) > 0.12) fan(r * 1000 + k + 500, rx + 0.4, -14 + k * 1.8 + rnd(k + r + 9) * 0.4, z, [0, 1], 0);
    }
    // courtside: a row of seated fans just off the far baseline apron, as behind Clarkson
    for (let k = 0; k < 40; k++) fan(90000 + k, -30 + k * 2.1, 93.5, 0, [1, 0], -0.4);
    return { tiers, crowd };
  }, []);
  const P = (pts: CornerSwingV3[]) => poly(cam, B, pts);
  const arenaFloor = look.low > 0.02 ? poly(cam, B, [[-60, -20, -0.02], [90, -20, -0.02], [90, 160, -0.02], [-60, 160, -0.02]], false) : null;
  const L = (pts: [number, number][], w = CS_LINE) => band(cam, B, pts, w);
  const ppfAt = (x: number, y: number) => {
    const p = proj(cam, B, [x, y, 0]);
    return p ? cam.F / p.z : 0;
  };
  const ppfCorner = ppfAt(23, 0);

  // ---- the paint
  const lines: (string | null)[] = [];
  const half = CS_LINE / 2;
  // baseline (out of bounds, behind y -5.25) and the right half-court end of the slab
  lines.push(L([[-CS_SIDE - CS_LINE, CS_BASE - half], [CS_SIDE + CS_LINE, CS_BASE - half]]));
  lines.push(L([[-CS_SIDE - CS_LINE, 47 - half], [CS_SIDE + CS_LINE, 47 - half]]));
  // left sideline (the right one is drawn on its own: it lights on "sideline")
  lines.push(L([[-CS_SIDE - half, CS_BASE - CS_LINE], [-CS_SIDE - half, Y1]]));
  // three point line: straight corner lines 3 ft inside each sideline, then the 23'9" arc between them
  const cx = CS_CORNER_X - half;
  lines.push(L([[cx, CS_BASE], [cx, CS_KINK_Y]]));
  lines.push(L([[-cx, CS_BASE], [-cx, CS_KINK_Y]]));
  const a3 = Math.atan2(CS_KINK_Y, CS_CORNER_X);
  lines.push(L(arc(0, 0, 23.75 - half, a3, Math.PI - a3, 110)));
  // lane: 16 ft wide to the free throw line 15 ft from the board face
  for (const s of [-1, 1]) lines.push(L([[s * (8 - half), CS_BASE], [s * (8 - half), 13.75]]));
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
  for (const s of [-1, 1]) lines.push(L([[s * CS_SIDE, 22.75], [s * (CS_SIDE - 3), 22.75]]));
  lines.push(L(arc(0, 41.75, 6, Math.PI, 2 * Math.PI, 40)));
  lines.push(L(arc(0, 41.75, 2, Math.PI, 2 * Math.PI, 20)));

  const sideR = L([[CS_SIDE + half, CS_BASE - CS_LINE], [CS_SIDE + half, Y1]]);
  const lane = P([[-8, CS_BASE, 0.001], [8, CS_BASE, 0.001], [8, 13.75, 0.001], [-8, 13.75, 0.001]]);
  const court = P([[-CS_SIDE, CS_BASE, 0], [CS_SIDE, CS_BASE, 0], [CS_SIDE, Y1, 0], [-CS_SIDE, Y1, 0]]);
  const slab = P([[X0, Y0, 0], [X1, Y0, 0], [X1, Y1, 0], [X0, Y1, 0]]);
  const slabSide = P([[X1, Y0, 0], [X1, Y1, 0], [X1, Y1, -1], [X1, Y0, -1]]);
  const slabFront = P([[X0, Y0, 0], [X1, Y0, 0], [X1, Y0, -1], [X0, Y0, -1]]);
  // the apron's thin red-orange border, as in the Parker photo, 1 ft outside the boundary
  const apronRule = L([[CS_SIDE + CS_LINE + 1.4, Y0], [CS_SIDE + CS_LINE + 1.4, Y1]], 0.09);
  const apronRuleB = L([[X0, CS_BASE - CS_LINE - 1.4], [X1, CS_BASE - CS_LINE - 1.4]], 0.09);

  // ---- boards: cull what is off screen, draw joints and grain only where they are bigger than a pixel
  const boards: React.ReactNode[] = [];
  strips.forEach((s, i) => {
    const d = P([[s.x, CS_BASE, 0], [s.x + BOARD + 0.006, CS_BASE, 0], [s.x + BOARD + 0.006, Y1, 0], [s.x, Y1, 0]]);
    if (!d) return;
    boards.push(<path key={`b${i}`} d={d} fill={`hsl(${s.h.toFixed(1)}, ${s.s.toFixed(1)}%, ${s.l.toFixed(1)}%)`} />);
    const ppfHere = ppfAt(s.x, 0);
    if (ppfHere > 7) {
      for (let k = 0; k < s.joints.length; k++) {
        const y = s.joints[k];
        if (ppfAt(s.x, y) < 6) continue;
        const jw = ppfAt(s.x, y) > 120 ? 0.01 : 0.025;
        const j = P([[s.x, y, 0.001], [s.x + BOARD, y, 0.001], [s.x + BOARD, y + jw, 0.001], [s.x, y + jw, 0.001]]);
        if (j) boards.push(<path key={`j${i}-${k}`} d={j} fill={jw < 0.02 ? "rgba(74,40,10,0.3)" : "rgba(74,40,10,0.42)"} />);
      }
      // the seam between two strips
      const seam = P([[s.x, CS_BASE, 0.001], [s.x + 0.012, CS_BASE, 0.001], [s.x + 0.012, Y1, 0.001], [s.x, Y1, 0.001]]);
      if (seam && ppfHere > 22) boards.push(<path key={`s${i}`} d={seam} fill="rgba(90,52,16,0.22)" />);
    }
    if (ppfHere > 30) {
      s.grain.forEach(([gx, ga, gb], k) => {
        const wv = 0.004 + rnd(i * 5 + k) * 0.01;
        const g2 = P([[gx, ga, 0.001], [gx + wv, ga, 0.001], [gx + wv * 0.5, gb, 0.001], [gx + wv * 0.3, gb, 0.001]]);
        if (g2) boards.push(<path key={`g${i}-${k}`} d={g2} fill={k % 3 === 0 ? "rgba(255,242,214,0.3)" : k % 3 === 1 ? "rgba(128,74,24,0.26)" : "rgba(150,92,36,0.16)"} />);
      });
    }
  });

  // apron: stained darker boards
  const apron: React.ReactNode[] = [];
  const apronCol = `hsl(24, ${(34 - 10 * look.apronDark).toFixed(1)}%, ${(30 - 13 * look.apronDark).toFixed(1)}%)`;
  for (const [ax0, ax1] of [[CS_SIDE + CS_LINE, X1], [X0, -CS_SIDE - CS_LINE]] as [number, number][]) {
    const d = P([[ax0, Y0, 0], [ax1, Y0, 0], [ax1, Y1, 0], [ax0, Y1, 0]]);
    if (d) apron.push(<path key={`a${ax0}`} d={d} fill={apronCol} />);
    if (ppfAt((ax0 + ax1) / 2, 0) > 14) {
      for (let x = ax0; x < ax1 - 0.05; x += BOARD) {
        const sd = P([[x, Y0, 0.001], [x + 0.012, Y0, 0.001], [x + 0.012, Y1, 0.001], [x, Y1, 0.001]]);
        if (sd) apron.push(<path key={`as${x.toFixed(2)}`} d={sd} fill="rgba(0,0,0,0.25)" />);
      }
    }
  }
  const apronB = P([[-CS_SIDE - CS_LINE, Y0, 0], [CS_SIDE + CS_LINE, Y0, 0], [CS_SIDE + CS_LINE, CS_BASE - CS_LINE, 0], [-CS_SIDE - CS_LINE, CS_BASE - CS_LINE, 0]]);

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
          <clipPath id="cs-slab">
            <path d={slab} />
          </clipPath>
        )}
        {court && (
          <clipPath id="cs-court">
            <path d={court} />
          </clipPath>
        )}
        <radialGradient id="cs-pool" cx={pool.x} cy={pool.y} r={900 + 500 * look.low} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF4DE" stopOpacity={0.1} />
          <stop offset="0.6" stopColor="#000" stopOpacity={0.1} />
          <stop offset="1" stopColor="#000" stopOpacity={0.45} />
        </radialGradient>
        <linearGradient id="cs-sweep" gradientUnits="userSpaceOnUse" x1={sweep} y1={500} x2={sweep + 600} y2={1500}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.1 - 0.05 * look.low} />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* grazing glare: the arena's lights on the satin finish, strongest toward the horizon */}
        <linearGradient id="cs-glare" gradientUnits="userSpaceOnUse" x1={0} y1={horizon} x2={0} y2={horizon + 900}>
          <stop offset="0" stopColor="#FFF6E6" stopOpacity={0.55 * look.low} />
          <stop offset="0.25" stopColor="#FFF1DA" stopOpacity={0.28 * look.low} />
          <stop offset="1" stopColor="#FFF1DA" stopOpacity="0" />
        </linearGradient>
        {/* the far court sinks into the dark arena */}
        <linearGradient id="cs-fog" gradientUnits="userSpaceOnUse" x1={0} y1={horizon} x2={0} y2={horizon + 260}>
          <stop offset="0" stopColor="#0D1117" stopOpacity={0.95 * look.low} />
          <stop offset="0.35" stopColor="#0D1117" stopOpacity={0.45 * look.low} />
          <stop offset="1" stopColor="#0D1117" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cs-haze" gradientUnits="userSpaceOnUse" x1={0} y1={horizon - 420} x2={0} y2={horizon + 20}>
          <stop offset="0" stopColor="#0D1117" stopOpacity="0" />
          <stop offset="0.75" stopColor="#2A3140" stopOpacity="0.55" />
          <stop offset="1" stopColor="#4A4A48" stopOpacity="0.6" />
        </linearGradient>
        {/* the arena lights mirrored in the satin finish: long soft streaks running down from the horizon */}
        <linearGradient id="cs-streak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF8EA" stopOpacity="0.9" />
          <stop offset="0.4" stopColor="#FFF3DE" stopOpacity="0.35" />
          <stop offset="1" stopColor="#FFF3DE" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cs-lane" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#25272B" />
          <stop offset="1" stopColor="#2E3035" />
        </linearGradient>
      </defs>
      {look.low > 0.02 && (
        <g opacity={Math.min(1, look.low * 1.4)}>
          {/* the arena's haze above the far court */}
          <rect x={0} y={horizon - 420} width={1080} height={440} fill="url(#cs-haze)" />
          {arenaFloor && <path d={arenaFloor} fill="#0A0D12" />}
          <g style={{ filter: "blur(2.6px)" }} opacity={0.8}>
            {stands.tiers.map((t, i) => {
              const d = poly(cam, B, t.pts, false);
              return d ? <path key={`t${i}`} d={d} fill={t.c} /> : null;
            })}
            {stands.crowd.map((t, i) => {
              const d = poly(cam, B, t.pts, false);
              return d ? <path key={`c${i}`} d={d} fill={t.c} opacity={0.85} /> : null;
            })}
          </g>
          {/* the ribbon board along the first tier */}
          {(() => {
            const a = poly(cam, B, [[-45, 99.6, 1.2], [70, 99.6, 1.2], [70, 99.6, 2.3], [-45, 99.6, 2.3]], false);
            return (
              <g>
                {a && <path d={a} fill="#1B3A6B" />}

                {a && <path d={a} fill="#58A6FF" opacity={0.22} style={{ filter: "blur(6px)" }} />}

              </g>
            );
          })()}
        </g>
      )}
      {slabFront && <path d={slabFront} fill="#06080B" />}
      {slabSide && <path d={slabSide} fill="#080A0E" />}
      <g clipPath={slab ? "url(#cs-slab)" : undefined}>
        {apron}
        {apronB && <path d={apronB} fill={apronCol} />}
        {apronRule && <path d={apronRule} fill="#B5432A" opacity={0.75} />}
        {apronRuleB && <path d={apronRuleB} fill="#B5432A" opacity={0.75} />}
        <g clipPath={court ? "url(#cs-court)" : undefined}>
          {boards}
          {lane && <path d={lane} fill="url(#cs-lane)" opacity={0.93} />}
          {/* scuffs where players stand most: the corners and the top of the key */}
          {[[23.2, -1.5, 1.6], [23.6, 3.5, 1.2], [-23.4, 0, 1.6], [0, 24.5, 2.2], [16.5, 17, 1.4]].map(([x, y, r], i) => {
            const g = P(arc(x, y, r, 0, Math.PI * 2, 24).map((q) => [q[0], q[1], 0.001] as CornerSwingV3));
            return g ? <path key={`sc${i}`} d={g} fill="#3A2410" opacity={0.08} style={{ filter: `blur(${Math.max(2, ppfAt(x, y) * r * 0.35).toFixed(1)}px)` }} /> : null;
          })}
        </g>
        {lines.map((d, i) => (d ? <path key={`l${i}`} d={d} fill="#F2F4F6" /> : null))}
        {sideR && <path d={sideR} fill={`rgb(${Math.round(222 + 33 * look.sidelineGlow)}, ${Math.round(225 + 30 * look.sidelineGlow)}, ${Math.round(228 + 27 * look.sidelineGlow)})`} />}
        {sideR && look.sidelineGlow > 0 && (
          <path d={sideR} fill="#FFFFFF" opacity={0.5 * look.sidelineGlow} style={{ filter: `blur(${(2 + ppfCorner * 0.02).toFixed(1)}px)` }} />
        )}
        {shadow && <path d={shadow} fill="#000" opacity={0.12 * (1 - look.low)} style={{ filter: "blur(10px)" }} />}
        <rect x={0} y={0} width={1080} height={1920} fill="url(#cs-pool)" />
        <rect x={0} y={0} width={1080} height={1920} fill="url(#cs-sweep)" />
        {look.low > 0 && <rect x={0} y={0} width={1080} height={1920} fill="url(#cs-glare)" />}
        {look.low > 0 &&
          [
            [150, 70, 520, 0.22],
            [430, 46, 380, 0.18],
            [700, 90, 620, 0.26],
            [960, 54, 420, 0.16],
          ].map(([x, w, h, o], i) => (
            <rect key={`st${i}`} x={x - w / 2 - (f % 600) * 0.02} y={horizon} width={w} height={h} fill="url(#cs-streak)" opacity={o * look.low} style={{ filter: `blur(${(w * 0.28).toFixed(1)}px)` }} />
          ))}
        {look.low > 0 && <rect x={0} y={0} width={1080} height={1920} fill="url(#cs-fog)" />}
      </g>
      {arm && <path d={arm} fill="#15181D" />}
      {glass && <path d={glass} fill="#C9DCEB" opacity={0.14} stroke="#F2F4F6" strokeWidth={1.4} />}
      {glassTop && <path d={glassTop} fill="#E8EEF3" opacity={0.9} />}
      {net.map((d, i) => (d ? <path key={`n${i}`} d={d} fill="#F2F4F6" opacity={0.7} /> : null))}
      {ring && <path d={ring} fill="#E35205" />}
    </svg>
  );
};
