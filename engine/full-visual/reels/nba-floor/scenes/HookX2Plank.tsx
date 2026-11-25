// HookX2's planks: two strips of the reel's own floor, cut along the board seams, each carrying the paint it crossed
// at its rulebook distance from the middle of the basket. A plank is drawn in its own (u, v) feet: u along its length
// from the rim end, v across it. Its pose on screen is a base point, a direction, a scale, a lift and a roll, so the
// same plank can lie in the floor (ARC FRAME), rise, fly and stand like a ruler.
import React, { useMemo } from "react";
import { PK_APRON, PK_LINE, PK_SIDE_X, pkRnd as rnd } from "./PaintedKinkWorld";

export const HX2_BOARD = 0.1875; // 2.25 in maple strips, as the floor
const X0 = -PK_SIDE_X - PK_APRON; // the floor's first strip (PaintedKinkFloor's x0)
const SHADES = ["#D9B983", "#D3B07A", "#DDC08F", "#CFAA72", "#E0C596", "#D6B47F", "#C9A46C", "#DBBC88"];
const APRON_SHADES_N = 4;
const WHITE = "#F3F5F7";
export const HX2_GOLD = "#F2B33D";
export const HX2_LEN = 23.75;

/** the floor's own board k: its x, its shade, its butt joints (same seeds as PaintedKinkFloor) */
function hookX2Board(k: number) {
  const x = X0 + k * HX2_BOARD;
  const apron = x < -PK_SIDE_X - 0.01 || x >= PK_SIDE_X - 0.01;
  const joints: number[] = [];
  let y = -5.25 - PK_APRON - rnd(k + 77) * 6;
  let j = 0;
  while (y < 70) {
    y += 1.6 + rnd(k * 13 + j) * 5.5;
    j++;
    joints.push(y);
  }
  return { x, shade: SHADES[Math.floor(rnd(k, 4) * (apron ? APRON_SHADES_N : SHADES.length)) % SHADES.length], joints };
}

export type HookX2Kind = "top" | "corner";
/** the strip in the floor: the top plank runs up x = TOP_XC, the corner plank runs out -x along y = 0 */
export const HX2_TOP_K0 = 145; // boards 145..152: x -0.8125 .. 0.6875
export const HX2_W = 8 * HX2_BOARD; // 18 in, eight boards
export const HX2_TOP_XC = X0 + HX2_TOP_K0 * HX2_BOARD + HX2_W / 2;

type Rect = { u0: number; u1: number; v0: number; v1: number; fill: string; o?: number };

/** everything painted or stained on a plank, in (u, v) feet */
function useHookX2Face(kind: HookX2Kind) {
  return useMemo(() => {
    const boards: Rect[] = [];
    const seams: Rect[] = [];
    const grain: Rect[] = [];
    const hw = HX2_W / 2;
    if (kind === "top") {
      for (let i = 0; i < 8; i++) {
        const b = hookX2Board(HX2_TOP_K0 + i);
        const v0 = b.x - HX2_TOP_XC, v1 = v0 + HX2_BOARD;
        boards.push({ u0: 0, u1: HX2_LEN, v0, v1, fill: b.shade });
        for (const y of b.joints) if (y > 0 && y < HX2_LEN) seams.push({ u0: y, u1: y + 0.03, v0, v1, fill: "#5C3A16", o: 0.45 });
        seams.push({ u0: 0, u1: HX2_LEN, v0: v1 - 0.008, v1, fill: "#5C3A16", o: 0.35 });
        for (let g = 0; g < 3; g++) {
          const gv = v0 + 0.03 + rnd(i * 7 + g, 9) * 0.13;
          grain.push({ u0: 0, u1: HX2_LEN, v0: gv, v1: gv + 0.006, fill: "#7A4818", o: 0.12 + rnd(i + g, 3) * 0.1 });
        }
      }
      return {
        boards, seams, grain,
        stain: { u0: 0, u1: 13.75, v0: -hw, v1: hw, fill: "#2B2D31", o: 0.93 } as Rect,
        paint: [
          { u0: 4 - PK_LINE, u1: 4 }, // restricted area arc, 4 ft
          { u0: 13.75 - PK_LINE, u1: 13.75 }, // free throw line, 13'9" from the rim (15 ft from the board)
          { u0: 19.75 - PK_LINE, u1: 19.75 }, // top of the free throw circle
          { u0: HX2_LEN - PK_LINE, u1: HX2_LEN }, // the arc, 23'9"
        ],
        line: HX2_LEN,
      };
    }
    // corner plank: across the boards, u = -x, so every board is a short crosswise stripe
    for (let k = 0; k < 160; k++) {
      const b = hookX2Board(k);
      const u1 = -b.x, u0 = -(b.x + HX2_BOARD);
      if (u1 <= 0 || u0 >= HX2_LEN) continue;
      boards.push({ u0: Math.max(0, u0), u1: Math.min(HX2_LEN, u1), v0: -hw, v1: hw, fill: b.shade });
      seams.push({ u0: Math.max(0, u0), u1: Math.max(0, u0) + 0.008, v0: -hw, v1: hw, fill: "#5C3A16", o: 0.35 });
      for (const y of b.joints) if (y > -hw && y < hw) seams.push({ u0: Math.max(0, u0), u1: Math.min(HX2_LEN, u1), v0: y, v1: y + 0.03, fill: "#5C3A16", o: 0.45 });
      const gu = Math.max(0, u0) + 0.04 + rnd(k, 5) * 0.1;
      grain.push({ u0: gu, u1: gu + 0.006, v0: -hw, v1: hw, fill: "#7A4818", o: 0.1 + rnd(k, 6) * 0.1 });
    }
    return {
      boards, seams, grain,
      stain: { u0: 0, u1: 8, v0: -hw, v1: hw, fill: "#2B2D31", o: 0.93 } as Rect,
      paint: [
        { u0: 4 - PK_LINE, u1: 4 }, // restricted area arc
        { u0: 8 - PK_LINE, u1: 8 }, // the lane line, 8 ft
        { u0: 22 - PK_LINE, u1: 22 }, // the corner three-point line, 22 ft
      ],
      line: 22,
    };
  }, [kind]);
}

export type HookX2Pose = {
  /** the rim end's centre, screen px */
  bx: number;
  by: number;
  /** screen angle of +u (radians) */
  th: number;
  /** px per foot */
  k: number;
  /** how high it is off the floor, px (shadow offset) */
  lift: number;
  /** roll about its length (radians): shows the side and catches light */
  roll: number;
};

const r4 = (n: number) => n.toFixed(4);

export const HookX2Plank: React.FC<{
  id: string;
  kind: HookX2Kind;
  pose: HookX2Pose;
  /** visible length, ft (the corner plank loses its top 21 in) */
  len: number;
  /** 0..1 gold over the 21 in past the corner line */
  gold: number;
  /** 0..1 foot ticks etched up to this fraction */
  ticks: number;
  /** 0..1 light catching the paint stripe at the far end */
  glint: number;
  /** extra light sweeping along the grain, -1..2 */
  sheen: number;
  opacity?: number;
}> = ({ id, kind, pose, len, gold, ticks, glint, sheen, opacity = 1 }) => {
  const face = useHookX2Face(kind);
  const { bx, by, th, k, lift, roll } = pose;
  const D = [Math.cos(th), Math.sin(th)];
  const N = [-Math.sin(th), Math.cos(th)];
  const cr = Math.cos(roll);
  const hw = HX2_W / 2;
  // the face's matrix: (u, v) feet -> screen
  const m = `matrix(${r4(D[0] * k)} ${r4(D[1] * k)} ${r4(N[0] * k * cr)} ${r4(N[1] * k * cr)} ${bx.toFixed(2)} ${by.toFixed(2)})`;
  // the side and the end grain: thickness 3/4 in, more of the side as it rolls
  const sideW = Math.max(0, lift > 1 ? Math.max(4, k * 0.0625) + k * HX2_W * Math.abs(Math.sin(roll)) * 0.9 : 0);
  const sideSign = roll >= 0 ? 1 : -1;
  const edge = (u: number, v: number) => [bx + k * (u * D[0] + v * N[0] * cr), by + k * (u * D[1] + v * N[1] * cr)];
  const e0 = edge(0, sideSign * hw), e1 = edge(len, sideSign * hw);
  const sx = N[0] * sideSign * sideW, sy = N[1] * sideSign * sideW;
  const side = `M${e0[0]} ${e0[1]}L${e1[0]} ${e1[1]}L${e1[0] + sx} ${e1[1] + sy}L${e0[0] + sx} ${e0[1] + sy}Z`;
  // end grain at the far end: a thin band past the face, as the plank stands
  const t0 = edge(len, -hw), t1 = edge(len, hw);
  const et = Math.max(0, Math.min(1, lift / 20)) * Math.max(3, k * 0.0625);
  const endG = `M${t0[0]} ${t0[1]}L${t1[0]} ${t1[1]}L${t1[0] + D[0] * et + sx} ${t1[1] + D[1] * et + sy}L${t0[0] + D[0] * et} ${t0[1] + D[1] * et}Z`;
  // shadow on the ground under it
  const so = lift * 0.6;
  const shadowPts = [edge(0, -hw), edge(len, -hw), edge(len, hw), edge(0, hw)].map(([x, y]) => `${(x + so * 0.55).toFixed(1)},${(y + so).toFixed(1)}`).join(" ");
  const rect = (r: Rect, key: string) => {
    const u0 = Math.max(0, r.u0), u1 = Math.min(len, r.u1);
    if (u1 <= u0) return null;
    return <rect key={key} x={u0} y={r.v0} width={u1 - u0} height={r.v1 - r.v0} fill={r.fill} opacity={r.o ?? 1} />;
  };
  const lightU = sheen * len;
  return (
    <g opacity={opacity}>
      <defs>
        <filter id={`hx2-sh-${id}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={2 + lift * 0.25} /></filter>
        <linearGradient id={`hx2-sheen-${id}`} gradientUnits="userSpaceOnUse" x1={lightU - 4} y1={0} x2={lightU + 4} y2={0}>
          <stop offset="0" stopColor="#FFF6E2" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFF6E2" stopOpacity="0.32" />
          <stop offset="1" stopColor="#FFF6E2" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`hx2-roll-${id}`} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.1 + 0.25 * Math.max(0, Math.sin(roll))} />
          <stop offset="1" stopColor="#000000" stopOpacity={0.12 + 0.25 * Math.max(0, -Math.sin(roll))} />
        </linearGradient>
      </defs>
      {lift > 0.5 && <polygon points={shadowPts} fill="#000" opacity={Math.min(0.55, 0.15 + lift * 0.01)} filter={`url(#hx2-sh-${id})`} />}
      {sideW > 0 && <path d={side} fill="#8A6234" />}
      {sideW > 0 && <path d={side} fill="url(#hx2-roll-${id})" opacity={0} />}
      {et > 0.5 && <path d={endG} fill="#B48A55" stroke="#6B4A22" strokeWidth={0.8} />}
      <g transform={m}>
        {face.boards.map((r, i) => rect(r, `b${i}`))}
        {face.grain.map((r, i) => rect(r, `g${i}`))}
        {face.seams.map((r, i) => rect(r, `s${i}`))}
        {rect(face.stain, "stain")}
        {face.paint.map((p, i) => rect({ u0: p.u0, u1: p.u1, v0: -hw, v1: hw, fill: WHITE }, `p${i}`))}
        {/* the paint's raised lip at the far stripe, catching the light as it turns */}
        {rect({ u0: face.line - 0.03, u1: face.line, v0: -hw, v1: hw, fill: "#FFFFFF", o: 0.4 + 0.6 * glint }, "lip")}
        {glint > 0 && rect({ u0: face.line - PK_LINE - 0.25, u1: face.line + 0.25, v0: -hw, v1: hw, fill: "#FFFFFF", o: 0.18 * glint }, "glow")}
        {/* the 21 in past the corner line, gold */}
        {kind === "corner" && gold > 0 && rect({ u0: 22, u1: 22 + (HX2_LEN - 22) * Math.min(1, gold), v0: -hw, v1: hw, fill: HX2_GOLD, o: 0.88 }, "gold")}
        {/* etched foot marks up the outer edge, a longer one every 5 ft */}
        {ticks > 0 &&
          Array.from({ length: 23 }, (_, i) => i + 1).map((ft) =>
            ft <= ticks * HX2_LEN && ft < len ? (
              <rect key={`t${ft}`} x={ft - 0.025} y={-hw} width={0.05} height={ft % 5 === 0 ? 0.42 : 0.22} fill="#2A1A0A" opacity={0.75} />
            ) : null,
          )}
        <rect x={0} y={-hw} width={len} height={HX2_W} fill={`url(#hx2-sheen-${id})`} />
        <rect x={0} y={-hw} width={len} height={HX2_W} fill="none" stroke="#3B2710" strokeOpacity={0.55} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </g>
    </g>
  );
};

/** the gold 21 in piece once it has broken off, drawn on its own, falling */
export const HookX2Sliver: React.FC<{ pose: HookX2Pose; opacity: number }> = ({ pose, opacity }) => {
  const { bx, by, th, k } = pose;
  const D = [Math.cos(th), Math.sin(th)];
  const N = [-Math.sin(th), Math.cos(th)];
  const hw = HX2_W / 2;
  const m = `matrix(${r4(D[0] * k)} ${r4(D[1] * k)} ${r4(N[0] * k)} ${r4(N[1] * k)} ${bx.toFixed(2)} ${by.toFixed(2)})`;
  const L = HX2_LEN - 22;
  return (
    <g transform={m} opacity={opacity}>
      {/* maple under the gold, its boards crosswise, the broken face rough at u 0 */}
      <rect x={0} y={-hw} width={L} height={HX2_W} fill="#D6B47F" />
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={i * HX2_BOARD} y={-hw} width={0.008} height={HX2_W} fill="#5C3A16" opacity={0.35} />
      ))}
      <rect x={0} y={-hw} width={L} height={HX2_W} fill={HX2_GOLD} opacity={0.88} />
      <path d={`M0 ${-hw} L0.06 ${-hw * 0.5} L-0.03 0 L0.07 ${hw * 0.4} L0 ${hw} Z`} fill="#B48A55" />
      <rect x={0} y={-hw} width={L} height={HX2_W} fill="none" stroke="#8A5A10" strokeWidth={1} vectorEffect="non-scaling-stroke" />
    </g>
  );
};
