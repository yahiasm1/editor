// The hoop standing up and two real shots, projected by the scene's one camera. Rule 1 Section II: the backboard
// 6 x 3.5 ft, flat and transparent, a 2 in white rectangle 24 x 18 in behind the ring; the ring 18 in inside
// diameter, its upper edge 10 ft up, its inside edge 6 in from the board, orange; a white cord net 18 in long.
// The board's bottom edge sits 9 ft up; the stanchion stands behind the baseline. The ball is the real ball photo
// (photos/commons-basketball-reisio-pd.png), 9.4 in across. Both shots are released 8.6 ft up, peak 15.6 ft, and
// travel at the same speed over the floor, so the corner ball (22 ft) arrives a hair before the top ball (23'9").
import React from "react";
import { Img, staticFile } from "remotion";
import { LT_GOLD, LT_WHITE, ltP, type LtCam } from "./LeagueTableWorld";

export const LT_BALL_R = 0.39;
const Z0 = 8.6;
const APEX = 15.6;
const H = APEX - Z0;
const U = 10 - Z0;
const B = 2 * H + 2 * Math.sqrt(H * H - H * U);
const A = U - B;

/** the ball's centre at flight progress s (0 release, 1 in the ring, then down through the net) */
export function ltBall(sx: number, sy: number, s: number) {
  if (s <= 1) return { x: sx * (1 - s), y: sy * (1 - s), z: Z0 + B * s + A * s * s };
  const k = s - 1;
  const z = 10 - 14 * k - 30 * k * k;
  return { x: 0, y: 0.05, z: Math.max(LT_BALL_R, z) };
}

type Shot = { sx: number; sy: number; s: number; o: number; spin: number };

const ringPts = (cam: LtCam, r: number, z: number, cy = 0.75 - 0.75, a0 = 0, a1 = Math.PI * 2, n = 40) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return ltP(cam, r * Math.cos(a), cy + r * Math.sin(a), z);
  });
const poly = (pts: { x: number; y: number }[], close = false) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("") + (close ? "Z" : "");

export const LeagueTableShot: React.FC<{
  cam: LtCam;
  f: number;
  o: number;
  shots: Shot[];
  /** 0..1 the ground tracks and their readings */
  tracks: number;
  /** 0..1 the corner's missing 21 in, gold, at its start */
  gold: number;
  /** net sway from the balls passing */
  swish: number;
}> = ({ cam, f, o, shots, tracks, gold, swish }) => {
  if (o <= 0.001) return null;
  const P = (x: number, y: number, z = 0) => ltP(cam, x, y, z);
  // ring and net (centre of the ring at y 0: inside edge 6 in from the board face at y -1.25 is y -0.75 + ... ; the
  // rule's middle of the basket is the origin)
  const rimTop = ringPts(cam, 0.79, 10);
  const rimIn = ringPts(cam, 0.75, 10);
  const netBot = ringPts(cam, 0.44, 8.5).map((p, i) => ({ x: p.x + Math.sin(i * 1.7 + f / 3) * swish * 4, y: p.y + swish * 3 }));
  const netMid = ringPts(cam, 0.6, 9.25).map((p, i) => ({ x: p.x + Math.sin(i * 1.3 + f / 4) * swish * 2.5, y: p.y + swish * 1.5 }));
  const k = P(0, 0, 10).k;
  // the board
  const bc = [P(-3, -1.25, 9), P(3, -1.25, 9), P(3, -1.25, 12.5), P(-3, -1.25, 12.5)];
  const box = [P(-1, -1.25, 10), P(1, -1.25, 10), P(1, -1.25, 11.5), P(-1, -1.25, 11.5)];
  // the stanchion
  const pole0 = P(0, -9.8, 0), pole1 = P(0, -9.8, 10.6), arm1 = P(0, -1.5, 11.2), padA = P(-1.1, -10.6, 0), padB = P(1.1, -9.0, 0);
  // the ground tracks
  const T = {
    c0: P(-22, 0), c1: P(0, 0), t0: P(0, 23.75), t1: P(0, 0), g0: P(-22, 0), g1: P(-23.75, 0),
    cm: P(-11, 0), tm: P(0, 11.9),
  };
  const lw = Math.max(2.5, 0.16 * k);
  return (
    <>
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: o, overflow: "visible" }}>
      <defs>
        <radialGradient id="lt-shadow">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lt-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#DCEBF5" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#B9CFDD" stopOpacity="0.1" />
          <stop offset="1" stopColor="#DCEBF5" stopOpacity="0.2" />
        </linearGradient>
        <filter id="lt-gglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={4} />
        </filter>
      </defs>
      {/* ground tracks: what each shot covers over the floor */}
      {tracks > 0.001 && (
        <g opacity={tracks}>
          <line x1={T.c0.x} y1={T.c0.y} x2={T.c0.x + (T.c1.x - T.c0.x) * tracks} y2={T.c0.y + (T.c1.y - T.c0.y) * tracks} stroke={LT_WHITE} strokeWidth={lw} strokeLinecap="round" />
          <line x1={T.t0.x} y1={T.t0.y} x2={T.t0.x + (T.t1.x - T.t0.x) * tracks} y2={T.t0.y + (T.t1.y - T.t0.y) * tracks} stroke={LT_WHITE} strokeWidth={lw} strokeLinecap="round" />
          {[T.c0, T.t0].map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={lw * 1.6} fill={LT_WHITE} />)}
        </g>
      )}
      {gold > 0.001 && (
        <g opacity={gold}>
          <line x1={T.g0.x} y1={T.g0.y} x2={T.g1.x} y2={T.g1.y} stroke={LT_GOLD} strokeWidth={lw * 4} strokeLinecap="round" filter="url(#lt-gglow)" />
          <line x1={T.g0.x} y1={T.g0.y} x2={T.g1.x} y2={T.g1.y} stroke="#FFD27A" strokeWidth={lw * 1.4} strokeLinecap="round" />
        </g>
      )}
      {/* the stanchion behind the baseline */}
      <path d={`M${padA.x} ${padA.y} L${padB.x} ${padA.y} L${padB.x} ${padB.y} L${padA.x} ${padB.y}Z`} fill="#1B1E23" />
      <line x1={pole0.x} y1={pole0.y} x2={pole1.x} y2={pole1.y} stroke="#2A2F36" strokeWidth={Math.max(6, 0.9 * pole1.k)} strokeLinecap="round" />
      <line x1={pole1.x} y1={pole1.y} x2={arm1.x} y2={arm1.y} stroke="#323840" strokeWidth={Math.max(5, 0.5 * arm1.k)} strokeLinecap="round" />
      <line x1={pole0.x - 2} y1={pole0.y} x2={pole1.x - 2} y2={pole1.y} stroke="#4A525C" strokeWidth={2} opacity={0.7} />
      {/* ball shadows on the boards */}
      {shots.map((s, i) => {
        if (s.o <= 0.001) return null;
        const b = ltBall(s.sx, s.sy, s.s);
        const g = P(b.x, b.y, 0);
        const rr = (LT_BALL_R + b.z * 0.05) * g.k;
        return <ellipse key={`sh${i}`} cx={g.x} cy={g.y} rx={rr * 1.3} ry={rr * 0.8} fill="url(#lt-shadow)" opacity={s.o * Math.max(0.25, 1 - b.z / 20)} />;
      })}
      {/* flight trails */}
      {shots.map((s, i) => {
        if (s.o <= 0.001 || s.s <= 0.01) return null;
        const pts = Array.from({ length: 26 }, (_, j) => {
          const t = Math.max(0, Math.min(1, s.s) * (j / 25));
          const b = ltBall(s.sx, s.sy, t);
          return P(b.x, b.y, b.z);
        });
        return <path key={`tr${i}`} d={poly(pts)} fill="none" stroke={LT_WHITE} strokeWidth={3} strokeOpacity={0.55 * s.o} strokeLinecap="round" />;
      })}
      {/* the ring's far half, the net, then the balls, then the ring's near half */}
      <path d={poly(rimTop.slice(0, 21))} fill="none" stroke="#B8410A" strokeWidth={Math.max(2.5, 0.08 * k)} />
      {netBot.map((p, i) => (i % 2 === 0 ? <line key={`n${i}`} x1={rimIn[i].x} y1={rimIn[i].y} x2={p.x} y2={p.y} stroke="#F2F2F2" strokeWidth={1.4} opacity={0.85} /> : null))}
      {netBot.map((p, i) => (i % 2 === 0 && i < 40 ? <line key={`x${i}`} x1={netMid[i].x} y1={netMid[i].y} x2={netBot[i + 1].x} y2={netBot[i + 1].y} stroke="#E8E8E8" strokeWidth={1.1} opacity={0.6} /> : null))}
      <path d={poly(netMid, true)} fill="none" stroke="#EDEDED" strokeWidth={1.1} opacity={0.6} />
      <path d={poly(netBot, true)} fill="none" stroke="#EDEDED" strokeWidth={1.3} opacity={0.8} />
    </svg>
    {shots.map((s, i) => {
      if (s.o <= 0.001) return null;
      const b = ltBall(s.sx, s.sy, s.s);
      const p = P(b.x, b.y, b.z);
      const r = LT_BALL_R * p.k;
      return (
        <Img
          key={`b${i}`}
          src={staticFile("nba-floor/leaguetable-ball.png")}
          style={{ position: "absolute", left: p.x - r, top: p.y - r, width: 2 * r, height: 2 * r, opacity: s.o * o, transform: `rotate(${s.spin.toFixed(1)}deg)`, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))" }}
        />
      );
    })}
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: o, overflow: "visible" }}>
      <path d={poly(rimTop.slice(20))} fill="none" stroke="#E35205" strokeWidth={Math.max(3, 0.09 * k)} />
      <line x1={P(0, -1.25, 10).x} y1={P(0, -1.25, 10).y} x2={P(0, -0.75 + 0.75 - 0.79, 10).x} y2={P(0, -0.79, 10).y} stroke="#C4470A" strokeWidth={Math.max(3, 0.12 * k)} />
      {/* the glass, its 2 in white border and the shooter's box */}
      <path d={poly(bc, true)} fill="url(#lt-glass)" stroke="#FFFFFF" strokeWidth={Math.max(2, 0.17 * bc[2].k)} strokeOpacity={0.95} />
      <path d={poly(box, true)} fill="none" stroke="#FFFFFF" strokeWidth={Math.max(1.5, 0.17 * box[2].k)} strokeOpacity={0.9} />
      <path d={`M${bc[3].x} ${bc[3].y} L${bc[2].x} ${bc[2].y}`} stroke="#FFFFFF" strokeOpacity={0.4} strokeWidth={4} />
      <path d={poly([P(-2.6, -1.25, 12.3), P(-1.2, -1.25, 12.3), P(-2.6, -1.25, 9.6)], true)} fill="#FFFFFF" opacity={0.06} />
    </svg>
    </>
  );
};
