// The half court through the scene's camera, at true geometry (NBA rules, plan.md): honey maple strips 2.25 in wide
// running baseline to half court, white 2 in lines, the lane in Spurs black with its silver edge, the restricted
// arc, the free throw circle (solid outside the lane, dashed inside), the three point line (22 ft in the corners,
// 23.75 ft arc), the sideline hash at 28 ft, the half court line and centre circles. The court is a lit slab on the
// navy, its edge showing. Behind the baseline the basket stands as in the Toronto photo: padded base, post and arm,
// glass board with its white border and shooting square, the shot clock box on top, the orange rim and its net.
import React, { useMemo } from "react";
import {
  FX_RIM_Y,
  fourteenExtraArc as arc,
  fourteenExtraBand as band,
  fourteenExtraBasis,
  fourteenExtraLine as line,
  fourteenExtraPoly as poly,
  fourteenExtraProject as proj,
  fxRnd as rnd,
  type FourteenExtraCam,
  type FourteenExtraV3,
} from "./FourteenExtraWorld";

const BOARD = 0.1875;
const LINE = 1 / 6;
const WHITE = "#F4F6F8";
const Y0 = -4; // the wood runs 4 ft behind the baseline
const Y1 = 50; // and on past half court
const X0 = 29; // and 4 ft past each sideline

export const FourteenExtraFloor: React.FC<{ cam: FourteenExtraCam; f: number }> = ({ cam, f }) => {
  const B = fourteenExtraBasis(cam);
  const strips = useMemo(() => {
    const out: { x: number; c: string; joints: number[] }[] = [];
    const n = Math.ceil((2 * X0) / BOARD);
    for (let i = 0; i < n; i++) {
      const l = 66 + rnd(i) * 10;
      const c = `hsl(${(33 + rnd(i + 900) * 6).toFixed(1)}, ${(50 + rnd(i + 400) * 14).toFixed(1)}%, ${l.toFixed(1)}%)`;
      const joints: number[] = [];
      let y = Y0 - rnd(i + 77) * 6;
      let k = 0;
      while (y < Y1) {
        y += 3 + rnd(i * 13 + k) * 7;
        k++;
        if (y > Y0 && y < Y1) joints.push(y);
      }
      out.push({ x: -X0 + i * BOARD, c, joints });
    }
    return out;
  }, []);
  const ppf = (() => {
    const p = proj(cam, 0, 19, 0, B);
    return p.ok ? cam.F / p.z : 10;
  })();
  const L = (pts: [number, number][], w = LINE) => band(cam, pts, w, B);
  const P = (pts: FourteenExtraV3[]) => poly(cam, pts, B);

  const paint: (string | null)[] = [];
  // boundary: baseline and both sidelines, half court line
  paint.push(L([[-25, LINE / 2], [25, LINE / 2]]));
  for (const s of [-1, 1]) paint.push(L([[s * (25 - LINE / 2), 0], [s * (25 - LINE / 2), 47]]));
  paint.push(L([[-25, 47 - LINE / 2], [25, 47 - LINE / 2]]));
  // lane sides and free throw line
  for (const s of [-1, 1]) paint.push(L([[s * (8 - LINE / 2), 0], [s * (8 - LINE / 2), 19]]));
  paint.push(L([[-8, 19 - LINE / 2], [8, 19 - LINE / 2]]));
  // the block and hash marks outside the lane
  for (const s of [-1, 1]) {
    paint.push(P([[s * 8, 7, 0], [s * 8.67, 7, 0], [s * 8.67, 8, 0], [s * 8, 8, 0]]));
    for (const y of [11, 14, 17]) paint.push(L([[s * 8, y], [s * 8.67, y]]));
  }
  // restricted area: 4 ft arc round the rim and its short straights
  paint.push(L(arc(0, FX_RIM_Y, 4, 0, Math.PI, 40)));
  for (const s of [-1, 1]) paint.push(L([[s * 4, 4], [s * 4, FX_RIM_Y]]));
  // three point line
  const cornerY = FX_RIM_Y + Math.sqrt(23.75 * 23.75 - 22 * 22);
  const a3 = Math.atan2(cornerY - FX_RIM_Y, 22);
  for (const s of [-1, 1]) paint.push(L([[s * 22, 0], [s * 22, cornerY]]));
  paint.push(L(arc(0, FX_RIM_Y, 23.75, a3, Math.PI - a3, 90)));
  // free throw circle: solid toward half court, dashed inside the lane
  paint.push(L(arc(0, 19, 6, 0, Math.PI, 50)));
  for (let k = 0; k < 8; k++) {
    const a0 = Math.PI + (k / 8) * Math.PI + 0.06;
    paint.push(L(arc(0, 19, 6, a0, a0 + Math.PI / 8 - 0.16, 8)));
  }
  // sideline hash at 28 ft, coaching box line, centre circles (6 ft and 2 ft)
  for (const s of [-1, 1]) paint.push(L([[s * 25, 28], [s * 22, 28]]));
  paint.push(L(arc(0, 47, 6, Math.PI, 2 * Math.PI, 50)));
  paint.push(L(arc(0, 47, 2, Math.PI, 2 * Math.PI, 30)));

  const lane = P([[-8, 0, 0], [8, 0, 0], [8, 19, 0], [-8, 19, 0]]);
  const laneEdge = band(cam, [[-7.55, 0], [-7.55, 18.55], [7.55, 18.55], [7.55, 0]], 0.08, B);
  const slab = P([[-X0, Y0, 0], [X0, Y0, 0], [X0, Y1, 0], [-X0, Y1, 0]]);
  // the slab's near edge: the floor is built up, its side shows
  const edge = P([[-X0, Y0, 0], [-X0, Y1, 0], [-X0, Y1, -0.9], [-X0, Y0, -0.9]]);
  const edge2 = P([[-X0, Y0, 0], [X0, Y0, 0], [X0, Y0, -0.9], [-X0, Y0, -0.9]]);
  const c0 = proj(cam, 0, 19, 0, B);
  const sweep = -500 + ((f * 2.6) % 2000);

  // ---- the basket behind the baseline
  const sc = (x: number, y: number, z: number) => {
    const p = proj(cam, x, y, z, B);
    return p.ok ? cam.F / p.z : 0;
  };
  const seg = (a: FourteenExtraV3, b: FourteenExtraV3) => line(cam, [a, b], B);
  const baseTop = P([[-2.2, -9, 2.6], [2.2, -9, 2.6], [2.2, -5.2, 2.6], [-2.2, -5.2, 2.6]]);
  const baseFront = P([[-2.2, -5.2, 0], [2.2, -5.2, 0], [2.2, -5.2, 2.6], [-2.2, -5.2, 2.6]]);
  const baseSide = P([[-2.2, -9, 0], [-2.2, -5.2, 0], [-2.2, -5.2, 2.6], [-2.2, -9, 2.6]]);
  const post = seg([0, -6.6, 2.6], [0, -6.6, 9.6]);
  const arm = seg([0, -6.6, 9.4], [0, 3.6, 11.4]);
  const brace = seg([0, -6.6, 6.2], [0, 1.2, 10.6]);
  const glass = P([[-3, 4, 9.5], [3, 4, 9.5], [3, 4, 13], [-3, 4, 13]]);
  const border = line(cam, [[-3, 4, 9.5], [3, 4, 9.5], [3, 4, 13], [-3, 4, 13], [-3, 4, 9.5]], B);
  const square = line(cam, [[-1, 4, 10], [1, 4, 10], [1, 4, 11.5], [-1, 4, 11.5], [-1, 4, 10]], B);
  const pad = P([[-3.05, 4, 9.25], [3.05, 4, 9.25], [3.05, 4, 9.55], [-3.05, 4, 9.55]]);
  const clockF = P([[-1.1, 3.85, 13.05], [1.1, 3.85, 13.05], [1.1, 3.85, 14.6], [-1.1, 3.85, 14.6]]);
  const clockT = P([[-1.1, 3.85, 14.6], [1.1, 3.85, 14.6], [1.1, 3.2, 14.6], [-1.1, 3.2, 14.6]]);
  const red = P([[-0.75, 3.84, 13.2], [0.75, 3.84, 13.2], [0.75, 3.84, 14.05], [-0.75, 3.84, 14.05]]);
  const amber = P([[-0.85, 3.84, 14.15], [0.85, 3.84, 14.15], [0.85, 3.84, 14.48], [-0.85, 3.84, 14.48]]);
  const rimPts: FourteenExtraV3[] = arc(0, FX_RIM_Y, 0.75, 0, Math.PI * 2, 40).map((q) => [q[0], q[1], 10]);
  const rim = line(cam, rimPts, B);
  const flange = seg([0, 4, 10], [0, 4.5, 10]);
  const sway = Math.sin(f * 0.07) * 0.03;
  const net: (string | null)[] = [];
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    const a2 = a + Math.PI / 12;
    const top: FourteenExtraV3 = [0.75 * Math.cos(a), FX_RIM_Y + 0.75 * Math.sin(a), 10];
    const mid: FourteenExtraV3 = [0.58 * Math.cos(a2) + sway, FX_RIM_Y + 0.58 * Math.sin(a2), 9.25];
    const bot: FourteenExtraV3 = [0.45 * Math.cos(a) + sway * 1.6, FX_RIM_Y + 0.45 * Math.sin(a), 8.5];
    const mid2: FourteenExtraV3 = [0.58 * Math.cos(a2 - Math.PI / 6) + sway, FX_RIM_Y + 0.58 * Math.sin(a2 - Math.PI / 6), 9.25];
    net.push(line(cam, [top, mid, bot], B), line(cam, [top, mid2], B));
  }
  const rimS = sc(0, FX_RIM_Y, 10);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="fx-sheen" gradientUnits="userSpaceOnUse" x1={sweep} y1={500} x2={sweep + 520} y2={1500}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="fx-pool" cx={c0.ok ? c0.x : 540} cy={c0.ok ? c0.y : 1000} r={Math.max(500, ppf * 40)} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0.42" />
        </radialGradient>
        <linearGradient id="fx-lane" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0B0C0E" />
          <stop offset="1" stopColor="#17191D" />
        </linearGradient>
        {slab && (
          <clipPath id="fx-slab">
            <path d={slab} />
          </clipPath>
        )}
      </defs>
      {edge && <path d={edge} fill="#07090C" />}
      {edge2 && <path d={edge2} fill="#07090C" />}
      <g clipPath="url(#fx-slab)">
        {slab && <path d={slab} fill="hsl(36, 56%, 70%)" />}
        {strips.map((s, i) => {
          const d = P([[s.x, Y0, 0], [s.x + BOARD + 0.004, Y0, 0], [s.x + BOARD + 0.004, Y1, 0], [s.x, Y1, 0]]);
          if (!d) return null;
          return (
            <g key={i}>
              <path d={d} fill={s.c} />
              {ppf > 9 &&
                s.joints.map((y, k) => {
                  const j = P([[s.x, y, 0], [s.x + BOARD, y, 0], [s.x + BOARD, y + 0.03, 0], [s.x, y + 0.03, 0]]);
                  return j ? <path key={k} d={j} fill="rgba(80,45,12,0.35)" /> : null;
                })}
            </g>
          );
        })}
        {lane && <path d={lane} fill="url(#fx-lane)" />}
        {[[-4.2, 9.5, 1.6], [3.6, 13.5, 1.2], [-1.2, 16.2, 0.9]].map(([x, y, r], i) => {
          const g = P(arc(x, y, r, 0, Math.PI * 2, 24).map((q) => [q[0], q[1], 0] as FourteenExtraV3));
          return g ? <path key={`gl${i}`} d={g} fill="#DDE6EE" opacity={0.07} style={{ filter: `blur(${Math.max(3, ppf * r * 0.5).toFixed(1)}px)` }} /> : null;
        })}
        {laneEdge && <path d={laneEdge} fill="#C4CED4" opacity={0.85} />}
        {paint.map((d, i) => (d ? <path key={i} d={d} fill={WHITE} /> : null))}
        <rect x={0} y={0} width={1080} height={1920} fill="url(#fx-pool)" />
        <rect x={0} y={0} width={1080} height={1920} fill="url(#fx-sheen)" />
      </g>
      {/* the basket */}
      {baseSide && <path d={baseSide} fill="#0A0B0D" />}
      {baseFront && <path d={baseFront} fill="#15171B" />}
      {baseTop && <path d={baseTop} fill="#23262C" />}
      {post && <path d={post} stroke="#121418" strokeWidth={Math.max(2, sc(0, -6.6, 6) * 0.9)} strokeLinecap="round" fill="none" />}
      {brace && <path d={brace} stroke="#1B1E23" strokeWidth={Math.max(1.5, sc(0, -2, 8) * 0.35)} fill="none" />}
      {arm && <path d={arm} stroke="#181A1F" strokeWidth={Math.max(2, sc(0, -1, 10.5) * 0.6)} strokeLinecap="round" fill="none" />}
      {glass && <path d={glass} fill="#C9DCEB" opacity={0.16} />}
      {border && <path d={border} stroke="#F4F6F8" strokeWidth={Math.max(1.2, sc(0, 4, 11) * 0.17)} fill="none" strokeLinejoin="round" />}
      {square && <path d={square} stroke="#F4F6F8" strokeWidth={Math.max(1, sc(0, 4, 11) * 0.15)} fill="none" />}
      {pad && <path d={pad} fill="#0C0D10" />}
      {clockT && <path d={clockT} fill="#22252B" />}
      {clockF && <path d={clockF} fill="#0B0C0F" />}
      {red && <path d={red} fill="#E0262C" opacity={0.9} />}
      {amber && <path d={amber} fill="#F4C15A" opacity={0.75} />}
      {flange && <path d={flange} stroke="#C9461E" strokeWidth={Math.max(1.5, rimS * 0.12)} fill="none" />}
      {net.map((d, i) => (d ? <path key={`n${i}`} d={d} stroke="#F4F6F8" strokeOpacity={0.75} strokeWidth={Math.max(0.7, rimS * 0.03)} fill="none" /> : null))}
      {rim && <path d={rim} stroke="#E2582A" strokeWidth={Math.max(1.5, rimS * 0.1)} fill="none" />}
    </svg>
  );
};
