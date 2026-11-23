// HookX4's real things, drawn in its projected world: the ball (pebbled leather, eight panels' seams, top light), the
// gold chance disc, the basket assembly (stanchion, glass with its white border and shooter's square, the shot clock
// box on top with its red 24, the orange rim and the white diamond net), from the Toronto photo and NBA geometry.
import React from "react";
import { HK4, hookX4Hull, hookX4Path, hookX4Ring, type HookX4Proj, type HookX4V3 } from "./HookX4World";

// ---- the ball ----
const SEAMS: HookX4V3[][] = (() => {
  const n = 40;
  const out: HookX4V3[][] = [[], [], [], []];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    out[0].push([Math.cos(t), Math.sin(t), 0]);
    out[1].push([0, Math.cos(t), Math.sin(t)]);
    // the two curved seams: small circles bent toward the poles, as on a real ball
    const c = 0.66 + 0.1 * Math.cos(2 * t);
    const rr = Math.sqrt(1 - c * c);
    out[2].push([c, rr * Math.cos(t), rr * Math.sin(t)]);
    out[3].push([-c, rr * Math.cos(t), rr * Math.sin(t)]);
  }
  return out;
})();

const rotAxis = (p: HookX4V3, k: HookX4V3, th: number): HookX4V3 => {
  const c = Math.cos(th);
  const s = Math.sin(th);
  const d = p[0] * k[0] + p[1] * k[1] + p[2] * k[2];
  const cr: HookX4V3 = [k[1] * p[2] - k[2] * p[1], k[2] * p[0] - k[0] * p[2], k[0] * p[1] - k[1] * p[0]];
  return [p[0] * c + cr[0] * s + k[0] * d * (1 - c), p[1] * c + cr[1] * s + k[1] * d * (1 - c), p[2] * c + cr[2] * s + k[2] * d * (1 - c)];
};

export type HookX4BallState = { p: HookX4V3; spin: number; axis: HookX4V3; tilt: number; grey: number; o: number; squash?: number };

export const HookX4Ball: React.FC<{ pr: HookX4Proj; b: HookX4BallState; id: number }> = ({ pr, b, id }) => {
  const c = pr.P(b.p);
  if (c.d < 0.6 || b.o <= 0.01) return null;
  const rs = c.s * HK4.ballR;
  if (rs < 0.6) return null;
  const sq = b.squash ?? 0;
  const paths: string[] = [];
  const tiltAxis: HookX4V3 = [0.6, 0.3, 0.74];
  SEAMS.forEach((curve) => {
    let d = "";
    let pen = false;
    curve.forEach((q0) => {
      const q = rotAxis(rotAxis(q0, tiltAxis, b.tilt), b.axis, b.spin);
      const facing = -(q[0] * pr.fw[0] + q[1] * pr.fw[1] + q[2] * pr.fw[2]);
      const x = c.x + rs * (q[0] * pr.r[0] + q[1] * pr.r[1] + q[2] * pr.r[2]);
      const y = c.y - rs * (q[0] * pr.u[0] + q[1] * pr.u[1] + q[2] * pr.u[2]) * (1 - sq);
      if (facing > 0.05) {
        d += `${pen ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
        pen = true;
      } else pen = false;
    });
    if (d) paths.push(d);
  });
  return (
    <g opacity={b.o}>
      <ellipse cx={c.x} cy={c.y} rx={rs * (1 + sq * 0.5)} ry={rs * (1 - sq)} fill="url(#hk4-ball)" />
      {b.grey > 0 && <ellipse cx={c.x} cy={c.y} rx={rs * (1 + sq * 0.5)} ry={rs * (1 - sq)} fill="url(#hk4-ball-grey)" opacity={b.grey} />}
      {rs > 3 && (
        <>
          <ellipse cx={c.x} cy={c.y} rx={rs * (1 + sq * 0.5)} ry={rs * (1 - sq)} fill="url(#hk4-pebble)" opacity={0.35} />
          <path d={paths.join(" ")} fill="none" stroke="#1E0F07" strokeOpacity={0.85} strokeWidth={Math.max(0.6, rs * 0.075)} strokeLinecap="round" />
          <ellipse cx={c.x - rs * 0.34} cy={c.y - rs * 0.4} rx={rs * 0.34} ry={rs * 0.2} fill="#FFF3E6" opacity={0.22} transform={`rotate(-28 ${(c.x - rs * 0.34).toFixed(1)} ${(c.y - rs * 0.4).toFixed(1)})`} />
        </>
      )}
      <ellipse cx={c.x} cy={c.y} rx={rs * (1 + sq * 0.5)} ry={rs * (1 - sq)} fill="none" stroke="#2A1206" strokeOpacity={0.55} strokeWidth={Math.max(0.5, rs * 0.04)} data-id={id} />
    </g>
  );
};

/** a soft contact shadow, a horizontal ellipse on whatever the ball is over */
export const HookX4Shadow: React.FC<{ pr: HookX4Proj; at: HookX4V3; r: number; o: number }> = ({ pr, at, r, o }) => {
  if (o <= 0.01) return null;
  const ring = hookX4Ring(pr.P, at, r, 18);
  return <path d={hookX4Path(ring)} fill="#050302" opacity={o} filter="url(#hk4-soft)" />;
};

// ---- a chance: the flat gold disc ----
export const HookX4Disc: React.FC<{ pr: HookX4Proj; at: HookX4V3; scale?: number; o?: number; glint?: number; spent?: number }> = ({ pr, at, scale = 1, o = 1, glint = 0, spent = 0 }) => {
  if (o <= 0.01) return null;
  const r = HK4.discR * scale;
  const h = HK4.discH * scale;
  const bot = hookX4Ring(pr.P, at, r, 22);
  const top = hookX4Ring(pr.P, [at[0], at[1] + h, at[2]], r, 22);
  const hull = hookX4Hull([...bot, ...top]);
  const cs = hookX4Ring(pr.P, [at[0], at[1] + 0.004, at[2]], r * 1.22, 18);
  return (
    <g opacity={o}>
      <path d={hookX4Path(cs)} fill="#000" opacity={0.38} filter="url(#hk4-soft)" />
      <path d={hookX4Path(hull)} fill="#8A5A12" />
      <path d={hookX4Path(top)} fill="url(#hk4-gold)" stroke="#7A4E0A" strokeOpacity={0.85} strokeWidth={1} />
      {spent > 0 && <path d={hookX4Path(top)} fill="#3A2A12" opacity={0.35 * spent} />}
      {glint > 0 && <path d={hookX4Path(top)} fill="#FFF6D8" opacity={0.75 * glint} />}
    </g>
  );
};

// ---- the basket ----
type Quad = [HookX4V3, HookX4V3, HookX4V3, HookX4V3];
const quadPath = (pr: HookX4Proj, q: Quad) => hookX4Path(q.map((p) => pr.P(p)));
const facing = (pr: HookX4Proj, centre: HookX4V3, n: HookX4V3) => {
  const c = pr.cam.pos;
  return (c[0] - centre[0]) * n[0] + (c[1] - centre[1]) * n[1] + (c[2] - centre[2]) * n[2] > 0;
};
/** an SVG matrix laying a w x h design box onto a projected plane (tl, tr, bl): affine, fine for small faces */
const plane = (pr: HookX4Proj, tl: HookX4V3, tr: HookX4V3, bl: HookX4V3, w: number, h: number) => {
  const a = pr.P(tl);
  const b = pr.P(tr);
  const c = pr.P(bl);
  return `matrix(${((b.x - a.x) / w).toFixed(5)} ${((b.y - a.y) / w).toFixed(5)} ${((c.x - a.x) / h).toFixed(5)} ${((c.y - a.y) / h).toFixed(5)} ${a.x.toFixed(2)} ${a.y.toFixed(2)})`;
};

/** a box from its min and max corners: the faces the camera sees, shaded by which way they face */
export const HookX4Box: React.FC<{ pr: HookX4Proj; lo: HookX4V3; hi: HookX4V3; top: string; side: string; front: string; edge?: string }> = ({ pr, lo, hi, top, side, front, edge }) => {
  const [x0, y0, z0] = lo;
  const [x1, y1, z1] = hi;
  const faces: { q: Quad; n: HookX4V3; fill: string }[] = [
    { q: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], n: [0, 1, 0], fill: top },
    { q: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], n: [0, 0, 1], fill: front },
    { q: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], n: [0, 0, -1], fill: front },
    { q: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], n: [-1, 0, 0], fill: side },
    { q: [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], n: [1, 0, 0], fill: side },
  ];
  return (
    <g>
      {faces.map((fc, i) => {
        const cen: HookX4V3 = [(fc.q[0][0] + fc.q[2][0]) / 2, (fc.q[0][1] + fc.q[2][1]) / 2, (fc.q[0][2] + fc.q[2][2]) / 2];
        if (!facing(pr, cen, fc.n)) return null;
        return <path key={i} d={quadPath(pr, fc.q)} fill={fc.fill} stroke={edge} strokeWidth={edge ? 1 : 0} />;
      })}
    </g>
  );
};

/** a beam between two points, a rounded padded bar of the given thickness in feet */
export const HookX4Beam: React.FC<{ pr: HookX4Proj; a: HookX4V3; b: HookX4V3; t: number; fill: string; hi?: string }> = ({ pr, a, b, t, fill, hi }) => {
  const A = pr.P(a);
  const B = pr.P(b);
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const wa = (A.s * t) / 2;
  const wb = (B.s * t) / 2;
  const d = `M${(A.x + nx * wa).toFixed(1)} ${(A.y + ny * wa).toFixed(1)} L${(B.x + nx * wb).toFixed(1)} ${(B.y + ny * wb).toFixed(1)} L${(B.x - nx * wb).toFixed(1)} ${(B.y - ny * wb).toFixed(1)} L${(A.x - nx * wa).toFixed(1)} ${(A.y - ny * wa).toFixed(1)} Z`;
  const side = ny < 0 ? 1 : -1; // the edge nearer the top of the frame catches the light
  return (
    <g>
      <path d={d} fill={fill} />
      {hi && <path d={`M${(A.x + nx * wa * 0.7 * side).toFixed(1)} ${(A.y + ny * wa * 0.7 * side).toFixed(1)} L${(B.x + nx * wb * 0.7 * side).toFixed(1)} ${(B.y + ny * wb * 0.7 * side).toFixed(1)}`} stroke={hi} strokeWidth={Math.max(1, (A.s + B.s) * 0.03)} strokeLinecap="round" opacity={0.6} />}
    </g>
  );
};

/** the glass: white 2 in border, the shooter's square above the rim, a black padded bottom edge, a sheen */
export const HookX4Glass: React.FC<{ pr: HookX4Proj; dx: number; dy: number; sheen: number }> = ({ pr, dx, dy, sheen }) => {
  const z = HK4.boardZ;
  const w = HK4.boardW / 2;
  const b0 = HK4.boardBot + dy;
  const b1 = HK4.boardTop + dy;
  const q = (x0: number, y0: number, x1: number, y1: number): Quad => [[x0 + dx, y1, z], [x1 + dx, y1, z], [x1 + dx, y0, z], [x0 + dx, y0, z]];
  const lw = 1 / 6;
  const s = pr.P([dx, (b0 + b1) / 2, z]).s;
  const sw = Math.max(1, s * lw);
  const glass = quadPath(pr, q(-w, b0, w, b1));
  const inner = quadPath(pr, q(-w + lw / 2, b0 + lw / 2, w - lw / 2, b1 - lw / 2));
  const square = quadPath(pr, q(-1, HK4.rimY + dy + 0.0, 1, HK4.rimY + dy + 1.5));
  const pad = quadPath(pr, q(-w - 0.08, b0 - 0.18, w + 0.08, b0 + 0.02));
  const sh = q(-w + 0.6 + sheen * 3.2, b0 + 0.3, -w + 1.3 + sheen * 3.2, b1 - 0.3);
  return (
    <g>
      <path d={glass} fill="rgba(170,200,222,0.10)" />
      <path d={quadPath(pr, sh)} fill="rgba(255,255,255,0.10)" />
      <path d={inner} fill="none" stroke="#F4F6F8" strokeWidth={sw} strokeOpacity={0.92} />
      <path d={square} fill="none" stroke="#F4F6F8" strokeWidth={sw} strokeOpacity={0.92} />
      <path d={glass} fill="none" stroke="#0B0D10" strokeWidth={Math.max(1, s * 0.06)} />
      <path d={pad} fill="#0B0D10" />
    </g>
  );
};

/** the shot clock box on top of the glass, a display on each long face: red 24 under a dim game line */
export const HookX4Clock: React.FC<{ pr: HookX4Proj; dx: number; dy: number; lit: number }> = ({ pr, dx, dy, lit }) => {
  const x0 = -1.25 + dx;
  const x1 = 1.25 + dx;
  const y0 = HK4.boardTop + dy + 0.05;
  const y1 = y0 + 1.35;
  const z0 = HK4.boardZ - 0.28;
  const z1 = HK4.boardZ + 0.28;
  const faces: { z: number; n: HookX4V3; tl: HookX4V3; tr: HookX4V3; bl: HookX4V3 }[] = [
    { z: z1, n: [0, 0, 1], tl: [x1, y1, z1 + 0.01], tr: [x0, y1, z1 + 0.01], bl: [x1, y0, z1 + 0.01] },
    { z: z0, n: [0, 0, -1], tl: [x0, y1, z0 - 0.01], tr: [x1, y1, z0 - 0.01], bl: [x0, y0, z0 - 0.01] },
  ];
  return (
    <g>
      <HookX4Box pr={pr} lo={[x0, y0, z0]} hi={[x1, y1, z1]} top="#23272E" side="#121418" front="#0A0B0D" edge="#30363D" />
      {faces.map((fc, i) => {
        if (!facing(pr, [dx, (y0 + y1) / 2, fc.z], fc.n)) return null;
        return (
          <g key={i} transform={plane(pr, fc.tl, fc.tr, fc.bl, 250, 135)}>
            <rect x={14} y={12} width={222} height={30} rx={3} fill="#15171B" />
            <rect x={40} y={20} width={170} height={14} rx={2} fill="#E9EDF1" opacity={0.18 * lit} />
            <text x={125} y={124} textAnchor="middle" fontFamily="Figtree, sans-serif" fontWeight={800} fontSize={96} fill="#FF4A26" opacity={lit} style={{ fontVariantNumeric: "tabular-nums" }}>
              24
            </text>
            <text x={125} y={124} textAnchor="middle" fontFamily="Figtree, sans-serif" fontWeight={800} fontSize={96} fill="#FF7A50" opacity={0.35 * lit} filter="url(#hk4-glow)" style={{ fontVariantNumeric: "tabular-nums" }}>
              24
            </text>
          </g>
        );
      })}
    </g>
  );
};

/** the rim: an orange ring of 5/8 in steel on its bracket, and the net hanging under it in diamond loops */
export const HookX4Rim: React.FC<{ pr: HookX4Proj; dx: number; dy: number }> = ({ pr, dx, dy }) => {
  const c: HookX4V3 = [dx, HK4.rimY + dy, HK4.rimZ];
  const ring = hookX4Ring(pr.P, c, HK4.rimR + 0.03, 40);
  const s = pr.P(c).s;
  const bracket = quadPath(pr, [[dx - 0.35, c[1], HK4.boardZ], [dx + 0.35, c[1], HK4.boardZ], [dx + 0.25, c[1], HK4.rimZ - HK4.rimR], [dx - 0.25, c[1], HK4.rimZ - HK4.rimR]]);
  return (
    <g>
      <path d={bracket} fill="#B8451E" />
      <path d={hookX4Path(ring)} fill="none" stroke="#8E3214" strokeWidth={Math.max(2, s * 0.09)} />
      <path d={hookX4Path(ring)} fill="none" stroke="#E2582A" strokeWidth={Math.max(1.4, s * 0.06)} />
      <path d={hookX4Path(ring.slice(4, 16), false)} fill="none" stroke="#FF9A6A" strokeOpacity={0.6} strokeWidth={Math.max(0.6, s * 0.02)} />
    </g>
  );
};

export const HookX4Net: React.FC<{ pr: HookX4Proj; dx: number; dy: number; pull: number; sway: number }> = ({ pr, dx, dy, pull, sway }) => {
  const N = 12;
  const levels = [
    { y: 0, r: HK4.rimR },
    { y: -0.38, r: 0.68 },
    { y: -0.76, r: 0.58 },
    { y: -1.1, r: 0.5 },
    { y: -1.42, r: 0.46 },
  ];
  const pts = levels.map((lv, l) => {
    const k = l / (levels.length - 1);
    const yy = HK4.rimY + dy + lv.y * (1 + 0.55 * pull * k) - 0.15 * pull * k;
    const rr = lv.r * (1 + 0.28 * pull * k * (1 - k) * 4) ;
    return Array.from({ length: N }, (_, i) => {
      const t = ((i + (l % 2) * 0.5) / N) * Math.PI * 2;
      return pr.P([dx + rr * Math.cos(t) + sway * k * k, yy, HK4.rimZ + rr * Math.sin(t) + sway * 0.4 * k * k]);
    });
  });
  let d = "";
  for (let l = 0; l < pts.length - 1; l++) {
    for (let i = 0; i < N; i++) {
      const a = pts[l][i];
      const b1 = pts[l + 1][i];
      const b2 = pts[l + 1][(i + (l % 2 ? 1 : N - 1)) % N];
      d += `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b1.x.toFixed(1)} ${b1.y.toFixed(1)}M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b2.x.toFixed(1)} ${b2.y.toFixed(1)}`;
    }
  }
  const s = pr.P([dx, HK4.rimY, HK4.rimZ]).s;
  return <path d={d} fill="none" stroke="#F4F6F8" strokeOpacity={0.82} strokeWidth={Math.max(0.6, s * 0.022)} strokeLinecap="round" />;
};

/** shared paint for the world */
export const HookX4Defs: React.FC = () => (
  <defs>
    <radialGradient id="hk4-ball" cx="0.38" cy="0.32" r="0.78">
      <stop offset="0" stopColor="#F7AE72" />
      <stop offset="0.32" stopColor="#E27A34" />
      <stop offset="0.78" stopColor="#B4521B" />
      <stop offset="1" stopColor="#5E260A" />
    </radialGradient>
    <radialGradient id="hk4-ball-grey" cx="0.38" cy="0.32" r="0.78">
      <stop offset="0" stopColor="#D5DBE1" />
      <stop offset="0.4" stopColor="#9AA3AD" />
      <stop offset="1" stopColor="#3E444C" />
    </radialGradient>
    <pattern id="hk4-pebble" width="5" height="5" patternUnits="userSpaceOnUse">
      <circle cx="1.2" cy="1.3" r="0.7" fill="#3A1604" />
      <circle cx="3.7" cy="3.6" r="0.6" fill="#3A1604" />
    </pattern>
    <radialGradient id="hk4-gold" cx="0.36" cy="0.3" r="0.8">
      <stop offset="0" stopColor="#FFE6A6" />
      <stop offset="0.3" stopColor="#FFD883" />
      <stop offset="0.62" stopColor="#F2B33D" />
      <stop offset="1" stopColor="#B9801F" />
    </radialGradient>
    <filter id="hk4-soft" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.2" />
    </filter>
    <filter id="hk4-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" />
    </filter>
  </defs>
);
