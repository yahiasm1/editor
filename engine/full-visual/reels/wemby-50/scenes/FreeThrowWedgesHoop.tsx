// The basket at its real place and height, through the scene's camera: the glass board 6 x 3.5 ft with its face 4 ft
// from the baseline and its bottom at 9.5 ft, the 24 x 18 in inner square sitting on the rim's height, the support
// arm reaching back over the baseline, the orange rim (18 in inside) at 10 ft, 5.25 ft from the baseline, and a laced
// net that swings when a ball goes through. The ball is drawn between the back and front of the rim and net, so it
// really passes through. Ball: 9.4 in across, its black seams turning with backspin, its shadow on the boards
// separating from it as it rises.
import React from "react";
import {
  freeThrowWedgesArc as arc,
  freeThrowWedgesLine as line,
  freeThrowWedgesPoly as poly,
  freeThrowWedgesProject as proj,
  type FreeThrowWedgesCam,
  type FreeThrowWedgesV3,
} from "./FreeThrowWedgesWorld";

export type FreeThrowWedgesBall = { x: number; y: number; z: number; spin: number; o: number };

const RX = 0;
const RY = 5.25;
const RZ = 10;
const RR = 0.78;

const FreeThrowWedgesBallDraw: React.FC<{ cam: FreeThrowWedgesCam; b: FreeThrowWedgesBall; id: string }> = ({ cam, b, id }) => {
  const p = proj(cam, b.x, b.y, b.z);
  if (!p.ok || b.o <= 0) return null;
  const r = (cam.F * 0.39) / p.z;
  const rot = (b.spin * 180) / Math.PI;
  return (
    <g opacity={b.o}>
      <defs>
        <radialGradient id={`${id}-g`} cx="0.36" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#F29A5A" />
          <stop offset="0.55" stopColor="#D6631F" />
          <stop offset="1" stopColor="#7A300C" />
        </radialGradient>
        <clipPath id={`${id}-c`}>
          <circle cx={p.x} cy={p.y} r={r} />
        </clipPath>
      </defs>
      <circle cx={p.x} cy={p.y} r={r} fill={`url(#${id}-g)`} />
      <g clipPath={`url(#${id}-c)`} transform={`rotate(${rot.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)})`} fill="none" stroke="#1B0F08" strokeWidth={Math.max(1.2, r * 0.07)}>
        <line x1={p.x - r} y1={p.y} x2={p.x + r} y2={p.y} />
        <line x1={p.x} y1={p.y - r} x2={p.x} y2={p.y + r} />
        <path d={`M${p.x - r * 0.72} ${p.y - r} Q${p.x - r * 0.25} ${p.y} ${p.x - r * 0.72} ${p.y + r}`} />
        <path d={`M${p.x + r * 0.72} ${p.y - r} Q${p.x + r * 0.25} ${p.y} ${p.x + r * 0.72} ${p.y + r}`} />
      </g>
      {/* pebble texture and a highlight from the arena roof */}
      <circle cx={p.x - r * 0.3} cy={p.y - r * 0.34} r={r * 0.28} fill="#fff" opacity={0.16} style={{ filter: `blur(${(r * 0.12).toFixed(1)}px)` }} />
    </g>
  );
};

export const FreeThrowWedgesShadow: React.FC<{ cam: FreeThrowWedgesCam; b: FreeThrowWedgesBall }> = ({ cam, b }) => {
  if (b.o <= 0) return null;
  // light from the roof, slightly from the far end: the shadow falls a little toward the camera as the ball rises
  const sx = b.x + b.z * 0.04;
  const sy = b.y + b.z * 0.08;
  const r = 0.36 + b.z * 0.03;
  const d = poly(cam, arc(sx, sy, r, 0, Math.PI * 2, 28));
  if (!d) return null;
  const k = Math.max(0, 1 - b.z / 18);
  return <path d={d} fill="#2B1606" opacity={0.42 * k * b.o} style={{ filter: `blur(${(2 + b.z * 0.9).toFixed(1)}px)` }} />;
};

export const FreeThrowWedgesHoop: React.FC<{ cam: FreeThrowWedgesCam; balls: FreeThrowWedgesBall[]; swish: number; f: number; o: number }> = ({ cam, balls, swish, f, o }) => {
  if (o <= 0) return null;
  const ppf = (z: FreeThrowWedgesV3) => {
    const p = proj(cam, z[0], z[1], z[2]);
    return p.ok ? cam.F / p.z : 0;
  };
  const sRim = ppf([RX, RY, RZ]);
  if (sRim <= 0) return null;
  const board = poly(cam, [[-3, 4, 9.5], [3, 4, 9.5], [3, 4, 13], [-3, 4, 13]]);
  const inner = line(cam, [[-1, 4, 10], [1, 4, 10], [1, 4, 11.5], [-1, 4, 11.5], [-1, 4, 10]]);
  const frame = line(cam, [[-3, 4, 9.5], [3, 4, 9.5], [3, 4, 13], [-3, 4, 13], [-3, 4, 9.5]]);
  const pad = line(cam, [[-3, 4, 9.45], [3, 4, 9.45]]);
  const arm = line(cam, [[0, 3.9, 11.2], [0, -1.5, 12.4], [0, -4, 12.4]]);
  const bracket = line(cam, [[0, 4, 10], [0, RY - RR, RZ]]);
  // the net: 12 cords from the rim, laced in diamonds to a narrower bottom ring 1.7 ft lower; a swish lifts and swings it
  const sw = swish;
  const sway = Math.sin(f * 0.55) * 0.12 * sw;
  const N = 12;
  const ring = (r: number, z: number, twist: number, dy = 0): FreeThrowWedgesV3[] =>
    Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2 + twist;
      return [RX + r * Math.cos(a) + sway, RY + r * Math.sin(a) + dy, z];
    });
  const top = ring(RR, RZ, 0);
  const mid = ring(0.62, RZ - 0.85 + 0.25 * sw, Math.PI / N, sway * 0.5);
  const bot = ring(0.46, RZ - 1.7 + 0.55 * sw, 0, sway);
  const cords: { d: string | null; front: boolean }[] = [];
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const front = Math.sin((i / N) * Math.PI * 2) > -0.05;
    cords.push({ d: line(cam, [top[i], mid[i], bot[i]]), front });
    cords.push({ d: line(cam, [top[j], mid[i], bot[j]]), front });
  }
  const rimBack = line(cam, arc(RX, RY, RR, Math.PI, Math.PI * 2, 32, RZ));
  const rimFront = line(cam, arc(RX, RY, RR, 0, Math.PI, 32, RZ));
  const rimW = Math.max(2.5, sRim * 0.07);
  const cordW = Math.max(1.2, sRim * 0.02);
  const boardW = Math.max(2, ppf([0, 4, 11]) * 0.17);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
      {balls.map((b, i) => (
        <FreeThrowWedgesShadow key={`s${i}`} cam={cam} b={b} />
      ))}
      {arm && <path d={arm} fill="none" stroke="#3A4048" strokeWidth={Math.max(3, ppf([0, 0, 12]) * 0.45)} strokeLinecap="round" />}
      {board && <path d={board} fill="rgba(190,214,232,0.10)" />}
      {frame && <path d={frame} fill="none" stroke="#E8EDF1" strokeWidth={boardW} strokeLinejoin="round" />}
      {pad && <path d={pad} fill="none" stroke="#111316" strokeWidth={boardW * 1.6} />}
      {inner && <path d={inner} fill="none" stroke="#F4F6F8" strokeWidth={boardW * 0.8} />}
      {bracket && <path d={bracket} fill="none" stroke="#9AA3AB" strokeWidth={rimW} />}
      {rimBack && <path d={rimBack} fill="none" stroke="#B8441A" strokeWidth={rimW} />}
      {cords.filter((c) => !c.front).map((c, i) => (c.d ? <path key={`b${i}`} d={c.d} fill="none" stroke="#E9EDF0" strokeOpacity={0.55} strokeWidth={cordW} /> : null))}
      {balls.map((b, i) => (
        <FreeThrowWedgesBallDraw key={i} cam={cam} b={b} id={`ftw-ball-${i}`} />
      ))}
      {cords.filter((c) => c.front).map((c, i) => (c.d ? <path key={`f${i}`} d={c.d} fill="none" stroke="#F4F6F8" strokeOpacity={0.85} strokeWidth={cordW} /> : null))}
      {rimFront && <path d={rimFront} fill="none" stroke="#E2582A" strokeWidth={rimW} strokeLinecap="round" />}
    </svg>
  );
};
