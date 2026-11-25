// The coach's dry-erase clipboard, a real plane in HookX2World: a black moulded frame with rounded corners and a
// raised lip, the white gloss face with old ghost smears, the half court printed in thin black lines (baseline at the
// top), the chrome lever clip riveted at the top centre, the marker tray with its felt eraser, binder-clipped logo
// cards, and the marker ink. Every point goes through the camera, so it tilts, slams and snaps for real.
import React from "react";
import { Img } from "remotion";
import {
  HookX2K, hookX2Arc, hookX2Board, hookX2Cut, hookX2Matrix, hookX2P, hookX2Path, hookX2Rnd, type HookX2Pose,
} from "./HookX2World";

export type HookX2Ink = { pts: [number, number][]; k: number; color: string; w: number; o?: number; dx?: number; db?: number };
export type HookX2Logo = { src: string; u: number; b: number; size: number; drop: number };

/** a rounded rectangle in court units */
function hookX2Round(u0: number, b0: number, u1: number, b1: number, r: number): [number, number][] {
  const out: [number, number][] = [];
  const c = (cu: number, cb: number, a0: number) => {
    for (let i = 0; i <= 6; i++) {
      const a = a0 + (i / 6) * (Math.PI / 2);
      out.push([cu + r * Math.cos(a), cb + r * Math.sin(a)]);
    }
  };
  c(u1 - r, b0 + r, -Math.PI / 2);
  c(u1 - r, b1 - r, 0);
  c(u0 + r, b1 - r, Math.PI / 2);
  c(u0 + r, b0 + r, Math.PI);
  return out;
}

/** a point of the board pushed along its normal (back of the frame) */
function hookX2Off(p: HookX2Pose, u: number, b: number, off: number) {
  const w = hookX2Board(p, u, b);
  const t = (p.theta * Math.PI) / 180;
  return hookX2P(w[0], w[1] - off * Math.sin(t) * (1 - p.snap), w[2] - off * Math.cos(t) * (1 - p.snap));
}

// the half court as printed on the board (court feet; b from the baseline)
const HookX2PRINT: [number, number][][] = [
  [[-25, 0], [25, 0]],
  [[-8, 0], [-8, 19], [8, 19], [8, 0]],
  hookX2Arc(0, 19, 6, Math.PI, 0, 28),
  hookX2Arc(0, 5.25, 4, 0, Math.PI, 20),
  [[-3, 4], [3, 4]],
  hookX2Arc(0, 5.25, 0.75, 0, Math.PI * 2, 16),
  [[-22, 0], [-22, 14]],
  [[22, 0], [22, 14]],
  hookX2Arc(0, 5.25, 23.75, 2.756, 0.385, 50),
  [[-25, 0], [-25, 31]],
  [[25, 0], [25, 31]],
  [[-8, 7], [-9, 7]], [[-8, 8], [-9, 8]], [[-8, 11], [-9, 11]], [[-8, 14], [-9, 14]],
  [[8, 7], [9, 7]], [[8, 8], [9, 8]], [[8, 11], [9, 11]], [[8, 14], [9, 14]],
];
// the dashed half of the top-of-key circle, inside the lane
const HookX2DASH: [number, number][][] = Array.from({ length: 8 }, (_, i) => hookX2Arc(0, 19, 6, Math.PI + (i / 8) * Math.PI + 0.08, Math.PI + ((i + 0.55) / 8) * Math.PI, 4));
// erase ghosts of plays drawn before tonight's
const HookX2GHOSTS = Array.from({ length: 9 }, (_, i) => ({ u: -20 + hookX2Rnd(i, 41) * 40, b: 2 + hookX2Rnd(i, 42) * 26, r: 3 + hookX2Rnd(i, 43) * 6, a: hookX2Rnd(i, 44) * 180 }));

/** width in px of w court-feet of board at a point (for strokes) */
function hookX2Px(p: HookX2Pose, u: number, b: number, w: number) {
  const a = hookX2BP2(p, u - w / 2, b);
  const c = hookX2BP2(p, u + w / 2, b);
  return Math.hypot(c[0] - a[0], c[1] - a[1]);
}
const hookX2BP2 = (p: HookX2Pose, u: number, b: number) => {
  const w = hookX2Board(p, u, b);
  return hookX2P(w[0], w[1], w[2]);
};

/** marker ink strokes on the plane (board or, once snapped, the floor): streaky, pooled at the ends */
export const HookX2InkLayer: React.FC<{ pose: HookX2Pose; ink: HookX2Ink[]; id: string; streak?: boolean }> = ({ pose, ink, id, streak = true }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <defs>
      <filter id={`${id}-streak`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.7 0.035" numOctaves={2} seed={4} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.7 1.3" result="m" />
        <feComposite in="SourceGraphic" in2="m" operator="in" />
      </filter>
    </defs>
    <g filter={streak ? `url(#${id}-streak)` : undefined} opacity={streak ? 1 : 0.92}>
      {ink.map((s, i) => {
        if (s.k <= 0) return null;
        const pts = hookX2Cut(s.pts, s.k).map(([u, b]) => [u + (s.dx ?? 0), b + (s.db ?? 0)] as [number, number]);
        if (pts.length < 2) return null;
        const mid = pts[Math.floor(pts.length / 2)];
        const wpx = Math.max(1.6, hookX2Px(pose, mid[0], mid[1], s.w));
        const end = pts[pts.length - 1];
        const e = hookX2BP2(pose, end[0], end[1]);
        return (
          <g key={i} opacity={s.o ?? 1}>
            <path d={hookX2Path(pose, pts)} fill="none" stroke={s.color} strokeWidth={wpx} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={e[0]} cy={e[1]} r={wpx * 0.62} fill={s.color} opacity={0.9} />
          </g>
        );
      })}
    </g>
  </svg>
);

export const HookX2Board: React.FC<{
  pose: HookX2Pose; f: number; ink: HookX2Ink[]; logos: HookX2Logo[]; logoSrc: (n: string) => string; frameO: number; printO: number; faceO: number;
  gloss: number; shadow: number; shadowX: number; shaqSrc: string;
}> = ({ pose, f, ink, logos, logoSrc, frameO, printO, faceO, gloss, shadow, shadowX, shaqSrc }) => {
  const outer = hookX2Round(-26.8, -1.8, 26.8, 34.8, 2.4);
  const face = hookX2Round(-25.6, -0.7, 25.6, 31.7, 0.9);
  const lip = hookX2Round(-26.1, -1.25, 26.1, 32.2, 1.6);
  const proj = (pts: [number, number][]) => pts.map(([u, b]) => hookX2BP2(pose, u, b));
  const toS = (a: [number, number, number][]) => a.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");
  const back = outer.map(([u, b]) => hookX2Off(pose, u, b, 0.09));
  const faceQ = proj(face);
  const clipId = "hx2-face";
  const strokePx = Math.max(1, hookX2Px(pose, 0, 15, 0.32 * (1 - 0.5 * pose.snap)));
  // the corners of the print as a quad for the photo layers
  const quad = (u0: number, b0: number, u1: number, b1: number) =>
    [hookX2BP2(pose, u0, b0), hookX2BP2(pose, u1, b0), hookX2BP2(pose, u1, b1), hookX2BP2(pose, u0, b1)].map((q) => [q[0], q[1]] as [number, number]);
  const t = (pose.theta * Math.PI) / 180;
  const shade = 0.82 + 0.18 * Math.cos(t * 0.9); // the face catches more of the arena light as it lies down
  const sweepB = -10 + gloss * 50;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id="hx2-frame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2A2D33" />
            <stop offset="0.5" stopColor="#15171B" />
            <stop offset="1" stopColor="#0A0B0D" />
          </linearGradient>
          <linearGradient id="hx2-white" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.6" stopColor="#F1F3F5" />
            <stop offset="1" stopColor="#DADDE2" />
          </linearGradient>
          <clipPath id={clipId}>
            <polygon points={toS(faceQ)} />
          </clipPath>
          <filter id="hx2-shadowblur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={14} />
          </filter>
        </defs>
        <g opacity={frameO}>
          {/* the frame's back and thickness, then its face and raised lip */}
          <polygon points={toS(back)} fill="#050607" />
          <polygon points={toS(proj(outer))} fill="url(#hx2-frame)" />
          <polygon points={toS(proj(lip))} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth={1.4} />
          {/* moulding screws at the corners */}
          {[[-25.4, 33.4], [25.4, 33.4], [-25.6, -0.9], [25.6, -0.9]].map(([u, b], i) => {
            const q = hookX2BP2(pose, u, b);
            return <circle key={i} cx={q[0]} cy={q[1]} r={2.6} fill="#3A3E45" stroke="#000" strokeWidth={0.8} />;
          })}
        </g>
        <polygon points={toS(faceQ)} fill="url(#hx2-white)" opacity={faceO} style={{ filter: `brightness(${shade.toFixed(3)})` }} />
        <g opacity={printO}>
          <g clipPath={faceO > 0.98 ? `url(#${clipId})` : undefined}>
            {faceO > 0.02 && HookX2GHOSTS.map((g, i) => {
              const q = hookX2BP2(pose, g.u, g.b);
              const r = hookX2Px(pose, g.u, g.b, g.r);
              return <ellipse key={i} cx={q[0]} cy={q[1]} rx={r} ry={r * 0.35} transform={`rotate(${g.a.toFixed(0)} ${q[0].toFixed(1)} ${q[1].toFixed(1)})`} fill="#8C949E" opacity={0.07} />;
            })}
            {HookX2PRINT.map((l, i) => (
              <path key={i} d={hookX2Path(pose, l)} fill="none" stroke="#22252B" strokeWidth={strokePx} strokeLinecap="butt" />
            ))}
            {HookX2DASH.map((l, i) => (
              <path key={`d${i}`} d={hookX2Path(pose, l)} fill="none" stroke="#22252B" strokeWidth={strokePx} />
            ))}
            {/* the gloss: one soft band of arena light sliding down the face */}
            {faceO > 0.02 && <path d={hookX2Path(pose, [[-26, sweepB], [26, sweepB - 9], [26, sweepB - 4], [-26, sweepB + 5]], true)} fill="#FFFFFF" opacity={0.42 * faceO} style={{ mixBlendMode: "screen" }} />}
          </g>
        </g>
        <g opacity={frameO}>
          {/* the tray moulded into the bottom edge, its felt eraser parked */}
          <path d={hookX2Path(pose, [[-24, 32.5], [24, 32.5], [24, 34.0], [-24, 34.0]], true)} fill="#050608" />
          <path d={hookX2Path(pose, [[-24, 32.5], [24, 32.5]])} stroke="rgba(255,255,255,0.18)" strokeWidth={1.2} fill="none" />
          <path d={hookX2Path(pose, [[8, 32.6], [20, 32.6], [20, 33.9], [8, 33.9]], true)} fill="#2E3238" />
          <path d={hookX2Path(pose, [[8.3, 33.1], [19.7, 33.1], [19.7, 33.85], [8.3, 33.85]], true)} fill="#8A9098" />
          {/* the chrome lever clip at the top centre: riveted base plate, the lever standing off the face, its wire hinge */}
          <path d={hookX2Path(pose, [[-6.4, -2.6], [6.4, -2.6], [7, 2.6], [-7, 2.6]], true)} fill="#AEB6BF" stroke="#4F5761" strokeWidth={1} />
          <path d={hookX2Path(pose, [[-5.8, -2.1], [5.8, -2.1], [6.2, -0.9], [-6.2, -0.9]], true)} fill="#EEF2F6" opacity={0.75} />
          {[-4.2, 4.2].map((u) => {
            const q = hookX2BP2(pose, u, 1.3);
            return (
              <g key={u}>
                <circle cx={q[0]} cy={q[1]} r={4} fill="#868E98" stroke="#353B42" strokeWidth={0.9} />
                <circle cx={q[0] - 1} cy={q[1] - 1} r={1.4} fill="#E3E8ED" />
              </g>
            );
          })}
          {(() => {
            // the lever: a pressed steel band whose free end stands 0.1 ft off the board
            const lev: [number, number][] = [[-5.0, -3.8], [5.0, -3.8], [5.6, 0.6], [-5.6, 0.6]];
            const lift = lev.map(([u, b], i) => hookX2Off(pose, u, b, i < 2 ? -0.1 : -0.02));
            const base = lev.map(([u, b]) => hookX2BP2(pose, u, b));
            return (
              <g>
                <polygon points={toS([base[0], base[1], lift[1], lift[0]])} fill="#5E666F" />
                <polygon points={toS(lift)} fill="#D3D9DF" stroke="#4A525C" strokeWidth={1} />
                <polygon points={toS([lift[0], lift[1], [lift[1][0] + (lift[2][0] - lift[1][0]) * 0.3, lift[1][1] + (lift[2][1] - lift[1][1]) * 0.3, 0], [lift[0][0] + (lift[3][0] - lift[0][0]) * 0.3, lift[0][1] + (lift[3][1] - lift[0][1]) * 0.3, 0]])} fill="#FFFFFF" opacity={0.55} />
                <line x1={lift[3][0]} y1={lift[3][1]} x2={lift[2][0]} y2={lift[2][1]} stroke="#2F353C" strokeWidth={2.2} />
              </g>
            );
          })()}
          {/* the frame's moulded bevel: a lit top lip, the face sitting a step below it */}
          <path d={hookX2Path(pose, [[-25.9, -1.0], [25.9, -1.0]])} stroke="rgba(255,255,255,0.28)" strokeWidth={1.6} fill="none" />
          <path d={hookX2Path(pose, [[-25.6, -0.55], [25.6, -0.55]])} stroke="rgba(0,0,0,0.35)" strokeWidth={2.2} fill="none" />
        </g>
      </svg>
      {/* Shaq's own silhouette in the shadow, faint, clipped to the face */}
      {shadow > 0.01 && printO > 0.5 && (
        <div style={{ position: "absolute", inset: 0, clipPath: `polygon(${faceQ.map((q) => `${q[0].toFixed(1)}px ${q[1].toFixed(1)}px`).join(",")})` }}>
          <Img src={shaqSrc} style={{ position: "absolute", left: hookX2BP2(pose, shadowX, 0)[0] - 120, top: hookX2BP2(pose, 0, -2)[1] - 40, width: 240, height: 776, transform: "scaleY(-0.55)", transformOrigin: "50% 0%", filter: "brightness(0) blur(9px)", opacity: 0.3 * shadow }} />
        </div>
      )}
      {/* the logo cards, binder-clipped to the top of the frame */}
      {logos.map((l, i) => {
        if (l.drop <= 0) return null;
        const b0 = l.b - (1 - l.drop) * 16;
        const q = quad(l.u - l.size / 2, b0, l.u + l.size / 2, b0 + l.size);
        const card = quad(l.u - l.size / 2 - 0.6, b0 - 0.6, l.u + l.size / 2 + 0.6, b0 + l.size + 0.6);
        const clip = quad(l.u - 1.8, b0 - 2.2, l.u + 1.8, b0 + 0.9);
        return (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: Math.min(1, l.drop * 3) * frameO }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 100, height: 100, transformOrigin: "0 0", transform: hookX2Matrix(100, 100, card), background: "linear-gradient(160deg, #FFFFFF, #E4E7EB)", boxShadow: "0 3px 8px rgba(0,0,0,0.45)", borderRadius: 3 }} />
            <Img src={logoSrc(l.src)} style={{ position: "absolute", left: 0, top: 0, width: 200, height: 200, transformOrigin: "0 0", transform: hookX2Matrix(200, 200, q) }} />
            <div style={{ position: "absolute", left: 0, top: 0, width: 40, height: 34, transformOrigin: "0 0", transform: hookX2Matrix(40, 34, clip), background: "linear-gradient(180deg, #2B2E33, #050506)", borderRadius: "3px 3px 6px 6px", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.25)" }} />
          </div>
        );
      })}
      <HookX2InkLayer pose={pose} ink={ink} id="hx2-board" />
    </div>
  );
};

export const HookX2BoardPx = hookX2Px;
export const HookX2BoardPt = hookX2BP2;
export { HookX2K };
