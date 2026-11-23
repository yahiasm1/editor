// The 50 as a solid: white Figtree digits with real depth (a stack of slices behind the face, darker toward the
// back), standing in HookX3's world. Each slice is drawn with the local affine of the camera at the glyph's centre,
// so the face, the depth and the topple all foreshorten through the same camera as the court.
import React from "react";
import {
  hx3Add, hx3Clamp, hx3Mul, hx3Project, type HookX3Cam, type HookX3V,
} from "./HookX3World";

export const HX3_50_SIZE = 3.1; // font size in ft: the digits stand about 2.2 ft tall
export const HX3_50_DEPTH = 0.44;
const SLICES = 14;
const U = 0.01; // ft per local unit

export type HookX3FiftyPose = { B: HookX3V; e1: HookX3V; e2: HookX3V; n: HookX3V };

const affine = (cam: HookX3Cam, O: HookX3V, e1: HookX3V, e2: HookX3V) => {
  const cy = 108; // local units above the baseline where the affine is taken (mid height of the digits)
  const C = hx3Add(O, hx3Mul(e2, cy * U));
  const pc = hx3Project(cam, C);
  const px = hx3Project(cam, hx3Add(C, e1));
  const py = hx3Project(cam, hx3Add(C, e2));
  const a = (px.x - pc.x) * U;
  const b = (px.y - pc.y) * U;
  const c = -(py.x - pc.x) * U;
  const d = -(py.y - pc.y) * U;
  return `matrix(${a.toFixed(5)} ${b.toFixed(5)} ${c.toFixed(5)} ${d.toFixed(5)} ${(pc.x + cy * c).toFixed(2)} ${(pc.y + cy * d).toFixed(2)})`;
};

/** value: the number shown; prev/roll: the odometer roll from prev (0..1); sweep: light band across the face (-1..2) */
export const HookX3Fifty: React.FC<{
  cam: HookX3Cam; pose: HookX3FiftyPose; value: number; prev: number; roll: number; sweep: number; o: number; grey: number; font: string;
}> = ({ cam, pose, value, prev, roll, sweep, o, grey, font }) => {
  if (o <= 0.01) return null;
  const fs = HX3_50_SIZE / U;
  const H = 240; // the roll travels one digit height
  const text = (v: number, dy: number, fill: string, k: string, stroke?: string) => (
    <text key={k} x={0} y={dy} textAnchor="middle" fontFamily={font} fontWeight={800} fontSize={fs} fill={fill} stroke={stroke} strokeWidth={stroke ? 2 : undefined} style={{ fontVariantNumeric: "tabular-nums" }}>
      {v}
    </text>
  );
  const body = (fill: string, k: string, stroke?: string) =>
    roll < 1 ? (
      <g clipPath="url(#hx3-50clip)">
        {text(prev, -roll * H, fill, `${k}p`, stroke)}
        {text(value, (1 - roll) * H, fill, `${k}v`, stroke)}
      </g>
    ) : (
      text(value, 0, fill, k, stroke)
    );
  const slices: React.ReactNode[] = [];
  const g = hx3Clamp(grey);
  for (let j = SLICES; j >= 1; j--) {
    const off = hx3Mul(pose.n, (-HX3_50_DEPTH * j) / SLICES);
    const k = j / SLICES;
    // the depth: cool grey, darker toward the back, lit a little on the first slices
    const l = Math.round((150 - 95 * k) * (1 - 0.25 * g));
    const col = `rgb(${l},${l + 6},${l + 14})`;
    slices.push(
      <g key={j} transform={affine(cam, hx3Add(pose.B, off), pose.e1, pose.e2)}>
        {body(col, `s${j}`, col)}
      </g>,
    );
  }
  const face = `rgb(${Math.round(255 - 140 * g)},${Math.round(255 - 135 * g)},${Math.round(255 - 125 * g)})`;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <defs>
        <clipPath id="hx3-50clip">
          <rect x={-300} y={-232} width={600} height={240} />
        </clipPath>
        <linearGradient id="hx3-50sweep" gradientUnits="userSpaceOnUse" x1={-260 + sweep * 520 - 60} y1={-240} x2={-260 + sweep * 520 + 60} y2={0}>
          <stop offset="0" stopColor="#FFF6DC" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFF6DC" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFF6DC" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hx3-50face" gradientUnits="userSpaceOnUse" x1={0} y1={-230} x2={0} y2={0}>
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#DCE1E6" />
        </linearGradient>
      </defs>
      {slices}
      <g transform={affine(cam, pose.B, pose.e1, pose.e2)}>
        {body(g > 0 ? face : "url(#hx3-50face)", "face")}
        {sweep > -0.2 && sweep < 1.2 && body("url(#hx3-50sweep)", "sweep")}
      </g>
    </g>
  );
};
