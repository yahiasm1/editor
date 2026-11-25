// A small player on the `rule` court, drawn standing (a billboard at his floor spot, like the Shaq cut-out beside him),
// in the reel's illustrated style of the defender in `picture`: a tank-top jersey with its trim, long 2000s shorts with
// the side panel, knee-high socks, sneakers, real skin shading with light from the upper left, a contact shadow.
// Units are feet from his feet (x right, y up), scaled to px per foot at his spot. A 6'4" guard or a 6'10" big.
import React from "react";

export type RulebookAwayFoulKit = { jersey: string; jerseyDark: string; trim: string; shorts: string; skin: string; skinDark: string; hair: string; sock: string; shoe: string };

export const RULEBOOKAWAYFOUL_LAKERS: RulebookAwayFoulKit = {
  jersey: "#5A2E93", jerseyDark: "#3A1A66", trim: "#FDB927", shorts: "#4E2785", skin: "#8A5A3C", skinDark: "#5C3822", hair: "#1B120D", sock: "#F2F2F0", shoe: "#1C1C22",
};
export const RULEBOOKAWAYFOUL_SONICS: RulebookAwayFoulKit = {
  jersey: "#0A7A48", jerseyDark: "#00502D", trim: "#FFC200", shorts: "#076A3F", skin: "#6E4630", skinDark: "#45291A", hair: "#140D09", sock: "#F2F2F0", shoe: "#F0F0EE",
};

export type RulebookAwayFoulPose = {
  /** 0..1 a stride phase while walking (legs swing), -1 standing */
  walk: number;
  /** arm angles in degrees from straight down, positive = toward his left (screen right when facing away) */
  armL: number;
  armR: number;
  /** elbow bend in degrees */
  bendL?: number;
  bendR?: number;
  /** the whole body leans (deg) */
  lean?: number;
  /** knees bent 0..1 (a shot dip) */
  dip?: number;
};

const limb = (x0: number, y0: number, a: number, l1: number, bend: number, w0: number, w1: number) => {
  // an arm from the shoulder (x0, y0), angle a from down, upper arm l1, forearm bent by `bend`
  const r = Math.PI / 180;
  const ex = x0 + Math.sin(a * r) * l1, ey = y0 - Math.cos(a * r) * l1;
  const a2 = a + bend;
  const hx = ex + Math.sin(a2 * r) * l1 * 0.95, hy = ey - Math.cos(a2 * r) * l1 * 0.95;
  return { ex, ey, hx, hy, w0, w1 };
};

/** one player. `x, y` = his feet on screen, `s` = px per foot there, `h` = his height in feet */
export const RulebookAwayFoulPlayer: React.FC<{
  id: string;
  x: number;
  y: number;
  s: number;
  h: number;
  kit: RulebookAwayFoulKit;
  pose: RulebookAwayFoulPose;
  /** "back": we see his back (no face), "front": his face toward us */
  facing: "back" | "front";
  number?: string;
  opacity?: number;
  /** a second hand position to draw on top (a grabbing hand), in screen px, optional */
  children?: React.ReactNode;
}> = ({ id, x, y, s, h, kit, pose, facing, number, opacity = 1, children }) => {
  const k = h / 6.6; // every proportion below is for a 6'7" body, scaled
  const dip = (pose.dip ?? 0) * 0.35;
  const sw = pose.walk >= 0 ? Math.sin(pose.walk * Math.PI * 2) : 0;
  const hip = 3.25 * k - dip;
  const sh = 5.35 * k - dip;
  const legL = sw * 18, legR = -sw * 18;
  const r = Math.PI / 180;
  const foot = (a: number) => ({ x: Math.sin(a * r) * hip * 0.9, y: Math.max(0, hip - Math.cos(a * r) * hip * 0.98) * 0 });
  const fL = foot(legL), fR = foot(legR);
  const aL = limb(-0.78 * k, sh - 0.12, -(pose.armL), 1.15 * k, -(pose.bendL ?? 0), 0.24 * k, 0.18 * k);
  const aR = limb(0.78 * k, sh - 0.12, pose.armR, 1.15 * k, pose.bendR ?? 0, 0.24 * k, 0.18 * k);
  const g = `rbaf-${id}`;
  const line = (x0: number, y0: number, x1: number, y1: number, w: number, c: string) => (
    <line x1={x0} y1={-y0} x2={x1} y2={-y1} stroke={c} strokeWidth={w} strokeLinecap="round" />
  );
  const leg = (hx: number, fx: number, side: number) => (
    <g>
      {/* thigh and calf as one tapered limb, the knee a little forward */}
      {line(hx, hip - 0.2, (hx + fx) / 2 + side * 0.03, hip * 0.5, 0.42 * k, kit.skin)}
      {line((hx + fx) / 2 + side * 0.03, hip * 0.5, fx, 0.35, 0.34 * k, kit.skin)}
      {line((hx + fx) / 2 + side * 0.03 - 0.08 * side, hip * 0.5, fx - 0.06 * side, 0.4, 0.12 * k, kit.skinDark)}
      {/* knee-high sock */}
      {line((hx + fx) / 2 * 0.7 + fx * 0.3, hip * 0.36, fx, 0.3, 0.33 * k, kit.sock)}
      {/* the sneaker, toe toward the viewer or away */}
      <ellipse cx={fx} cy={-0.17} rx={0.3 * k} ry={0.17 * k} fill={kit.shoe} />
      <ellipse cx={fx - 0.05} cy={-0.24} rx={0.22 * k} ry={0.06 * k} fill="#FFFFFF" opacity={0.18} />
    </g>
  );
  const torso = `M ${-0.8 * k} ${-sh} Q ${-0.95 * k} ${-(sh - 1.0 * k)} ${-0.62 * k} ${-(hip + 0.05)} L ${0.62 * k} ${-(hip + 0.05)} Q ${0.95 * k} ${-(sh - 1.0 * k)} ${0.8 * k} ${-sh} Q 0 ${-(sh + 0.12 * k)} ${-0.8 * k} ${-sh} Z`;
  // armholes cut deep, as tank tops are
  const jersey = `M ${-0.52 * k} ${-(sh + 0.04)} L ${-0.6 * k} ${-(sh - 0.62 * k)} Q ${-0.7 * k} ${-(sh - 1.2 * k)} ${-0.64 * k} ${-(hip - 0.05)} L ${0.64 * k} ${-(hip - 0.05)} Q ${0.7 * k} ${-(sh - 1.2 * k)} ${0.6 * k} ${-(sh - 0.62 * k)} L ${0.52 * k} ${-(sh + 0.04)} Q 0 ${-(sh - (facing === "front" ? 0.3 : 0.12) * k)} ${-0.52 * k} ${-(sh + 0.04)} Z`;
  const shorts = `M ${-0.66 * k} ${-(hip + 0.15)} L ${0.66 * k} ${-(hip + 0.15)} L ${0.74 * k} ${-(hip - 1.35 * k)} L ${0.06 * k} ${-(hip - 1.3 * k)} L 0 ${-(hip - 0.62 * k)} L ${-0.06 * k} ${-(hip - 1.3 * k)} L ${-0.74 * k} ${-(hip - 1.35 * k)} Z`;
  const headY = sh + 0.62 * k;
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)}) rotate(${(pose.lean ?? 0).toFixed(2)})`} opacity={opacity}>
      <defs>
        <linearGradient id={`${g}-lit`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.22} />
          <stop offset="0.45" stopColor="#FFFFFF" stopOpacity={0} />
          <stop offset="1" stopColor="#000000" stopOpacity={0.32} />
        </linearGradient>
      </defs>
      {/* contact shadow on the boards */}
      <ellipse cx={0.15} cy={0.05} rx={0.95 * k} ry={0.28 * k} fill="#000" opacity={0.32} />
      {leg(-0.3 * k, -0.32 * k + fL.x, -1)}
      {leg(0.3 * k, 0.32 * k + fR.x, 1)}
      {/* shorts with the side panel stripe */}
      <path d={shorts} fill={kit.shorts} />
      <path d={`M ${0.6 * k} ${-(hip + 0.1)} L ${0.7 * k} ${-(hip - 1.3 * k)}`} stroke={kit.trim} strokeWidth={0.12 * k} />
      <path d={`M ${-0.6 * k} ${-(hip + 0.1)} L ${-0.7 * k} ${-(hip - 1.3 * k)}`} stroke={kit.trim} strokeWidth={0.12 * k} />
      <rect x={-0.66 * k} y={-(hip + 0.2)} width={1.32 * k} height={0.18 * k} fill={kit.jerseyDark} />
      {/* arms behind the torso when facing away and hanging */}
      {/* shoulders and back skin, then the jersey over them */}
      <path d={torso} fill={kit.skin} />
      <path d={jersey} fill={kit.jersey} stroke={kit.trim} strokeWidth={0.07 * k} />
      <path d={jersey} fill={`url(#${g}-lit)`} />
      {number && (
        <text x={0} y={-(sh - 0.95 * k)} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={0.72 * k} fill={kit.trim} stroke={kit.jerseyDark} strokeWidth={0.03}>
          {number}
        </text>
      )}
      {/* neck and head */}
      <rect x={-0.13 * k} y={-(sh + 0.3 * k)} width={0.26 * k} height={0.34 * k} rx={0.08} fill={kit.skinDark} />
      <ellipse cx={0} cy={-headY} rx={0.3 * k} ry={0.38 * k} fill={kit.skin} />
      <ellipse cx={-0.08 * k} cy={-(headY + 0.08 * k)} rx={0.16 * k} ry={0.2 * k} fill="#FFFFFF" opacity={0.12} />
      {facing === "back" ? (
        <path d={`M ${-0.3 * k} ${-(headY - 0.05 * k)} Q 0 ${-(headY + 0.62 * k)} ${0.3 * k} ${-(headY - 0.05 * k)} Q 0 ${-(headY - 0.32 * k)} ${-0.3 * k} ${-(headY - 0.05 * k)} Z`} fill={kit.hair} opacity={0.92} />
      ) : (
        <path d={`M ${-0.3 * k} ${-(headY + 0.08 * k)} Q 0 ${-(headY + 0.56 * k)} ${0.3 * k} ${-(headY + 0.08 * k)} Q 0 ${-(headY + 0.22 * k)} ${-0.3 * k} ${-(headY + 0.08 * k)} Z`} fill={kit.hair} opacity={0.92} />
      )}
      {facing === "front" && <ellipse cx={0} cy={-(headY - 0.2 * k)} rx={0.16 * k} ry={0.06 * k} fill={kit.skinDark} opacity={0.5} />}
      {/* arms: upper arm and forearm, a darker underside */}
      {[aL, aR].map((a, i) => {
        const x0 = i === 0 ? -0.78 * k : 0.78 * k;
        const y0 = sh - 0.12;
        return (
          <g key={i}>
            {line(x0, y0, a.ex, a.ey, a.w0, kit.skin)}
            {line(a.ex, a.ey, a.hx, a.hy, a.w1, kit.skin)}
            {line(x0 + 0.05, y0 - 0.1, a.ex + 0.04, a.ey - 0.02, a.w0 * 0.35, kit.skinDark)}
            <circle cx={a.hx} cy={-a.hy} r={0.13 * k} fill={kit.skin} />
          </g>
        );
      })}
      {children}
    </g>
  );
};

/** where his hands are, in screen px, for a ball held or a grab */
export function rulebookAwayFoulHands(x: number, y: number, s: number, h: number, pose: RulebookAwayFoulPose) {
  const k = h / 6.6;
  const dip = (pose.dip ?? 0) * 0.35;
  const sh = 5.35 * k - dip;
  const aL = limb(-0.78 * k, sh - 0.12, -pose.armL, 1.15 * k, -(pose.bendL ?? 0), 0, 0);
  const aR = limb(0.78 * k, sh - 0.12, pose.armR, 1.15 * k, pose.bendR ?? 0, 0, 0);
  return {
    L: [x + aL.hx * s, y - aL.hy * s] as [number, number],
    R: [x + aR.hx * s, y - aR.hy * s] as [number, number],
    head: [x, y - (sh + 0.62 * k) * s] as [number, number],
  };
}
