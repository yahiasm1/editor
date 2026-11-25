// Rick Barry's underhand free throw as an ink strobe. Every frame is the same ink drawing, traced off Russ Reed's 1976
// photo (XDoG lines and a grey wash from the real cut-out: shaggy hair over the ears, the WARRIORS jersey and its
// folds, the short shorts with the side stripe, the ringed tube socks, the 3-stripe Adidas, his face drawn in the same
// ink), cut at the shoulders and the hips and posed like a puppet. The raised left arm of the photo is straight, so it
// is the arm for both sides (mirrored for the right). Poses from how the shot is taught: ball low in both hands, knees
// bend, rise, release. The fifth frame, arms high, is the real photo itself. All in the cut-out's own pixels
// (665 x 1911, crown 332, soles 1907, 240 px a foot). (notes/GrannyShot.md)
import React from "react";
import { staticFile } from "remotion";

export const GRANNYSHOT_INK = {
  body: { src: staticFile("shaq-free-throws/grannyshot-ink-body.png"), x: 175, y: 332, w: 318, h: 857 },
  arm: { src: staticFile("shaq-free-throws/grannyshot-ink-arm-r.png"), x: 419, y: 4, w: 118, h: 545 },
  legL: { src: staticFile("shaq-free-throws/grannyshot-ink-leg-l.png"), x: 210, y: 1187, w: 276, h: 708 },
  legR: { src: staticFile("shaq-free-throws/grannyshot-ink-leg-r.png"), x: 337, y: 1187, w: 324, h: 720 },
};
const ARM_PIVOT = { x: 455, y: 540 }; // his left shoulder in the photo
const ARM_PALM = { x: 488, y: 100 }; // the palm of the raised hand
const ARM_ANGLE = (Math.atan2(505 - 455, 540 - 15) * 180) / Math.PI; // the photo's arm, from straight up, clockwise
const SHOULDER = { l: { x: 226, y: 545 }, r: { x: 455, y: 540 } };
const HIP = { l: { x: 272, y: 1188 }, r: { x: 410, y: 1188 } };
const LEG_ANGLE = { l: (Math.atan2(430 - 272, 1800 - 1188) * 180) / Math.PI, r: (Math.atan2(590 - 410, 1800 - 1188) * 180) / Math.PI };
const LEG_LEN = 1907 - 1188;
export const GRANNYSHOT_SOLE = 1907;
const BALL_R = 94; // 0.39 ft

export type GrannyShotPose = {
  arm: number; // arm direction, degrees from straight down, toward the body's centre line
  alen: number; // arm length on screen (foreshortened when it points at us)
  splay: number; // legs, degrees out from vertical
  lsy: number; // leg length on screen (a knee bend seen from the front)
  ballUp?: boolean; // the ball rolls off the fingertips
};

export const GRANNYSHOT_POSES: GrannyShotPose[] = [
  // 1 address: feet shoulder width, arms straight, the ball hanging low in both hands
  { arm: 5, alen: 1.06, splay: 3, lsy: 1 },
  // 2 the dip: knees bend and open, the ball drops between the knees
  { arm: 6, alen: 1.0, splay: 7, lsy: 0.84 },
  // 3 the rise: the legs drive, the straight arms swing the ball up toward us
  { arm: 14, alen: 0.55, splay: 4, lsy: 0.95 },
  // 4 release: up on the toes, arms up and out in front, the ball off the fingers
  { arm: 172, alen: 0.5, splay: 1, lsy: 1.02, ballUp: true },
];

type Pt = { x: number; y: number };
const rot = (p: Pt, deg: number): Pt => {
  const r = (deg * Math.PI) / 180;
  return { x: p.x * Math.cos(r) - p.y * Math.sin(r), y: p.x * Math.sin(r) + p.y * Math.cos(r) };
};

/** where the pose puts everything, in cut-out pixels */
export function grannyShotRig(p: GrannyShotPose) {
  const drop = GRANNYSHOT_SOLE - (HIP.l.y + LEG_LEN * p.lsy);
  const arms = (["l", "r"] as const).map((s) => {
    const sx = s === "r" ? 1 : -1;
    const tgt = s === "r" ? 180 + p.arm : 180 - p.arm;
    const theta = tgt - sx * ARM_ANGLE;
    const sh = { x: SHOULDER[s].x, y: SHOULDER[s].y + drop };
    const v = rot({ x: (ARM_PALM.x - ARM_PIVOT.x) * sx, y: (ARM_PALM.y - ARM_PIVOT.y) * p.alen }, theta);
    return { s, sx, theta, sh, palm: { x: sh.x + v.x, y: sh.y + v.y } };
  });
  const legs = (["l", "r"] as const).map((s) => {
    const theta = s === "l" ? LEG_ANGLE.l + p.splay : LEG_ANGLE.r - p.splay;
    return { s, theta, hip: { x: HIP[s].x, y: HIP[s].y + drop } };
  });
  const mid = { x: (arms[0].palm.x + arms[1].palm.x) / 2, y: (arms[0].palm.y + arms[1].palm.y) / 2 };
  const ball = p.ballUp ? { x: mid.x, y: mid.y - BALL_R * 0.9 } : { x: mid.x, y: mid.y + BALL_R * 0.15 };
  return { drop, arms, legs, ball };
}

const PAPER = "#EDEAE3";
const INK = "#121418";

/** the ball in the same ink: paper, outline, the eight seams, a wash on the side away from the light */
export const GrannyShotInkBall: React.FC<{ x: number; y: number; r: number; spin?: number; id: string }> = ({ x, y, r, spin = 0, id }) => (
  <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${spin.toFixed(1)})`}>
    <defs>
      <radialGradient id={`gs-ball-${id}`} cx="0.36" cy="0.32" r="0.8">
        <stop offset="0.5" stopColor={PAPER} />
        <stop offset="1" stopColor="#B9B4AA" />
      </radialGradient>
    </defs>
    <circle r={r} fill={`url(#gs-ball-${id})`} stroke={INK} strokeWidth={r * 0.06} />
    <path
      d={`M${-r},0 Q0,${-r * 0.22} ${r},0 M0,${-r} Q${r * 0.24},0 0,${r} M${-r * 0.72},${-r * 0.69} Q${-r * 0.22},0 ${-r * 0.72},${r * 0.69} M${r * 0.72},${-r * 0.69} Q${r * 0.22},0 ${r * 0.72},${r * 0.69}`}
      fill="none"
      stroke={INK}
      strokeWidth={r * 0.045}
    />
    {[0.2, 0.42, 0.62].map((o, i) => (
      <path key={i} d={`M${r * (0.35 + o * 0.5)},${r * (0.75 - o * 0.4)} l${r * 0.12},${-r * 0.2}`} stroke={INK} strokeWidth={r * 0.025} opacity={0.6} />
    ))}
  </g>
);

/**
 * One strobe frame. (left, top, s) puts the cut-out's pixels on the stage, the same box as the real cut-out.
 * `alpha` is the frame's strength: faint ghost to solid.
 */
export const GrannyShotFigure: React.FC<{ pose: GrannyShotPose; left: number; top: number; s: number; alpha: number; id: string; ballOn?: boolean }> = ({ pose, left, top, s, alpha, id, ballOn = true }) => {
  if (alpha <= 0.002) return null;
  const rig = grannyShotRig(pose);
  const img = (k: keyof typeof GRANNYSHOT_INK) => <image href={GRANNYSHOT_INK[k].src} x={GRANNYSHOT_INK[k].x} y={GRANNYSHOT_INK[k].y} width={GRANNYSHOT_INK[k].w} height={GRANNYSHOT_INK[k].h} />;
  return (
    <g opacity={alpha} transform={`translate(${left.toFixed(1)},${top.toFixed(1)}) scale(${s.toFixed(4)})`}>
      {rig.legs.map((l) => (
        <g key={`leg${l.s}${id}`} transform={`translate(${l.hip.x},${l.hip.y.toFixed(1)}) rotate(${l.theta.toFixed(2)}) scale(1,${pose.lsy}) translate(${-HIP[l.s].x},${-HIP[l.s].y})`}>
          {img(l.s === "l" ? "legL" : "legR")}
        </g>
      ))}
      <g transform={`translate(0,${rig.drop.toFixed(1)})`}>{img("body")}</g>
      {ballOn && !pose.ballUp && <GrannyShotInkBall x={rig.ball.x} y={rig.ball.y} r={BALL_R} id={`${id}b`} />}
      {rig.arms.map((a) => (
        <g key={`arm${a.s}${id}`} transform={`translate(${a.sh.x},${a.sh.y.toFixed(1)}) rotate(${a.theta.toFixed(2)}) scale(${a.sx},${pose.alen}) translate(${-ARM_PIVOT.x},${-ARM_PIVOT.y})`}>
          {img("arm")}
        </g>
      ))}
      {ballOn && pose.ballUp && <GrannyShotInkBall x={rig.ball.x} y={rig.ball.y} r={BALL_R} id={`${id}b`} spin={-30} />}
    </g>
  );
};
