// The reel's chance as a solid, through HookX3's camera: a plain gold disc 1.6 ft across and 0.19 ft thick (or a
// 0.44 wedge of one for a free throw), with a lit top, a turned edge that catches the light segment by segment, a
// bright bevel on the top rim and a soft contact shadow. No print. Made discs whiten as they turn into the chart's dot.
import React from "react";
import {
  HX3_R, HX3_T, hx3Add, hx3Clamp, hx3Cross, hx3Dot, hx3Mul, hx3Norm, hx3Project, hx3Sub,
  type HookX3Cam, type HookX3V,
} from "./HookX3World";

const LIGHT = hx3Norm([-0.35, 0.55, 0.76]); // toward the light: high, front-left
const GOLD_TOP = [242, 179, 61];
const GOLD_HI = [255, 216, 131];
const GOLD_SIDE = [185, 128, 31];
const WHITE = [246, 247, 248];

const rgb = (c: number[], k: number, w = 0, to = WHITE) =>
  `rgb(${c.map((v, i) => Math.round(hx3Clamp(((v + (to[i] - v) * w) * k) / 255, 0, 1) * 255)).join(",")})`;

export type HookX3DiscDraw = {
  c: HookX3V;
  n: HookX3V;
  spin: number;
  o: number; // opacity
  white?: number; // 0..1 toward the made dot's white
  scale?: number; // radius scale (shrinks into the chart glyph)
  wedge?: number; // sector size in turns (0.44 for a free throw), full disc when absent
  rot?: number; // where the wedge points
  lift?: number; // light on it 0..1 (the spotlight before the arena lights come up)
  key: string;
};

const fmt = (v: number) => v.toFixed(1);

export const HookX3Disc: React.FC<{ cam: HookX3Cam; d: HookX3DiscDraw }> = ({ cam, d }) => {
  if (d.o <= 0.01) return null;
  const R = HX3_R * (d.scale ?? 1);
  const T = HX3_T * Math.min(1, d.scale ?? 1);
  const n = hx3Norm(d.n);
  const ref: HookX3V = Math.abs(n[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
  const a = hx3Norm(hx3Cross(n, ref));
  const b = hx3Cross(n, a);
  const span = d.wedge ? d.wedge * Math.PI * 2 : Math.PI * 2;
  const a0 = d.wedge ? (d.rot ?? 0) - span / 2 : 0;
  const N = d.wedge ? 22 : 40;
  const lit = 0.55 + 0.45 * (d.lift ?? 1);
  const white = d.white ?? 0;
  const top = hx3Add(d.c, hx3Mul(n, T / 2));
  const bot = hx3Add(d.c, hx3Mul(n, -T / 2));
  const ring = (base: HookX3V, r: number) =>
    Array.from({ length: N + 1 }, (_, i) => {
      const t = a0 + (span * i) / N;
      return hx3Add(base, hx3Add(hx3Mul(a, r * Math.cos(t)), hx3Mul(b, r * Math.sin(t))));
    });
  const tr = ring(top, R);
  const br = ring(bot, R);
  const P = (p: HookX3V) => {
    const q = hx3Project(cam, p);
    return `${fmt(q.x)},${fmt(q.y)}`;
  };
  const toEye = (p: HookX3V) => hx3Sub(cam.E, p);
  const sides: React.ReactNode[] = [];
  const segs = d.wedge ? N : N; // the edge in N segments
  for (let i = 0; i < segs; i++) {
    const t = a0 + (span * (i + 0.5)) / N;
    const nn = hx3Add(hx3Mul(a, Math.cos(t)), hx3Mul(b, Math.sin(t)));
    const mid = hx3Mul(hx3Add(tr[i], br[i + 1]), 0.5);
    if (hx3Dot(nn, toEye(mid)) <= 0) continue;
    const sh = 0.42 + 0.7 * Math.max(0, hx3Dot(nn, LIGHT)) + 0.18 * Math.max(0, nn[2]);
    // the turned edge has a fine bright line at its lip
    sides.push(<polygon key={i} points={`${P(tr[i])} ${P(tr[i + 1])} ${P(br[i + 1])} ${P(br[i])}`} fill={rgb(GOLD_SIDE, sh * lit, white)} stroke={rgb(GOLD_SIDE, sh * lit, white)} strokeWidth={0.6} />);
  }
  // a wedge also shows its two cut faces
  if (d.wedge) {
    const cutFace = (j: number, sgn: number) => {
      const t = a0 + span * j;
      const radial = hx3Add(hx3Mul(a, Math.cos(t)), hx3Mul(b, Math.sin(t)));
      const nn = hx3Cross(radial, n);
      const out = hx3Mul(nn, sgn);
      const pts = [top, j ? tr[N] : tr[0], j ? br[N] : br[0], bot];
      if (hx3Dot(out, toEye(top)) <= 0) return null;
      const sh = 0.45 + 0.6 * Math.max(0, hx3Dot(out, LIGHT));
      return <polygon key={`cut${j}`} points={pts.map(P).join(" ")} fill={rgb(GOLD_SIDE, sh * lit * 1.05, white)} />;
    };
    sides.push(cutFace(0, 1), cutFace(1, -1));
  }
  const up = hx3Dot(n, toEye(top)) > 0;
  const face = up ? tr : br;
  const faceN = up ? n : hx3Mul(n, -1);
  const shT = 0.62 + 0.5 * Math.max(0, hx3Dot(faceN, LIGHT));
  const faceRing = d.wedge ? [up ? top : bot, ...face] : face.slice(0, N);
  const facePts = faceRing.map(P).join(" ");
  // bevel: the inner ring of the top, a touch lighter, so the face reads as a machined plate
  const inner = d.wedge ? null : ring(top, R * 0.86).slice(0, N).map(P).join(" ");
  const id = `hx3d-${d.key}`;
  const c0 = hx3Project(cam, hx3Add(top, hx3Add(hx3Mul(a, -R * LIGHT[0]), hx3Mul(b, R * 0.2))));
  const c1 = hx3Project(cam, hx3Add(top, hx3Mul(a, R)));
  const gr = Math.max(6, Math.hypot(c1.x - c0.x, c1.y - c0.y) * 1.6);
  return (
    <g opacity={d.o < 1 ? d.o : undefined}>
      <defs>
        <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={c0.x} cy={c0.y} r={gr}>
          <stop offset="0" stopColor={rgb(GOLD_HI, Math.min(1.15, shT * lit * 1.08), white)} />
          <stop offset="0.55" stopColor={rgb(GOLD_TOP, shT * lit, white)} />
          <stop offset="1" stopColor={rgb(GOLD_SIDE, shT * lit * 1.05, white)} />
        </radialGradient>
      </defs>
      {sides}
      <polygon points={facePts} fill={`url(#${id})`} stroke={rgb(GOLD_HI, lit * 1.05, white)} strokeWidth={up ? 1.1 : 0.4} strokeOpacity={0.85} />
      {up && inner && <polygon points={inner} fill="none" stroke={rgb(GOLD_SIDE, lit * 0.9, white)} strokeOpacity={0.35} strokeWidth={0.8} />}
    </g>
  );
};

/** the soft dark print a disc leaves on the maple (drawn in the shadow layer, blurred) */
export function hx3DiscShadow(cam: HookX3Cam, c: HookX3V, height: number, r = HX3_R): string {
  // the light is high front-left, so a lifted disc's shadow slides back and right
  const off: HookX3V = [height * 0.42, -height * 0.66, 0];
  const base: HookX3V = [c[0] + off[0], c[1] + off[1], 0];
  const rr = r * (1.05 + height * 0.12);
  return Array.from({ length: 20 }, (_, i) => {
    const t = (i / 20) * Math.PI * 2;
    const q = hx3Project(cam, [base[0] + rr * Math.cos(t), base[1] + rr * Math.sin(t), 0]);
    return `${fmt(q.x)},${fmt(q.y)}`;
  }).join(" ");
}
