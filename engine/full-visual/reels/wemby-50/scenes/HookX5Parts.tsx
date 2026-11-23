// The things the hook puts on the court, all in court feet: the gold disc a make cost, the steel x that a miss is
// driven in as (seen from above, its shadow before it), and what an impact does to hard maple: the boards bow along
// the grain, long slivers come off with the grain, a ring of pale finish dust, a dent that slowly closes.
import React from "react";
import { HookX5Glyph } from "./HookX5Court";

export const hookX5Rnd = (i: number, k = 0) => {
  const s = Math.sin(i * 91.37 + k * 47.11 + 13.7) * 43758.5453;
  return s - Math.floor(s);
};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** shared gradients, put once into the court's <defs> */
export const HookX5Defs: React.FC = () => (
  <>
    <radialGradient id="hx5-gold" cx="0.38" cy="0.34" r="0.75">
      <stop offset="0" stopColor="#FFE7A8" />
      <stop offset="0.38" stopColor="#FFD883" />
      <stop offset="0.72" stopColor="#F2B33D" />
      <stop offset="1" stopColor="#C98E25" />
    </radialGradient>
    <radialGradient id="hx5-contact" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#1A0F02" stopOpacity="0.55" />
      <stop offset="0.6" stopColor="#1A0F02" stopOpacity="0.25" />
      <stop offset="1" stopColor="#1A0F02" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="hx5-steel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F4F7FA" />
      <stop offset="0.22" stopColor="#C3CBD3" />
      <stop offset="0.5" stopColor="#87919B" />
      <stop offset="0.78" stopColor="#59626C" />
      <stop offset="1" stopColor="#2F363E" />
    </linearGradient>
    <radialGradient id="hx5-bolt" cx="0.35" cy="0.3" r="0.8">
      <stop offset="0" stopColor="#EEF2F5" />
      <stop offset="0.55" stopColor="#8E98A2" />
      <stop offset="1" stopColor="#2A3038" />
    </radialGradient>
    <radialGradient id="hx5-pool-dark" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#05070A" stopOpacity="0.62" />
      <stop offset="0.55" stopColor="#05070A" stopOpacity="0.32" />
      <stop offset="1" stopColor="#05070A" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="hx5-dent" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#1C1105" stopOpacity="0.7" />
      <stop offset="0.45" stopColor="#3A2408" stopOpacity="0.35" />
      <stop offset="0.72" stopColor="#FFE9C2" stopOpacity="0.32" />
      <stop offset="1" stopColor="#FFE9C2" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="hx5-dust" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#F3EADB" stopOpacity="0.85" />
      <stop offset="0.6" stopColor="#E9DCC5" stopOpacity="0.35" />
      <stop offset="1" stopColor="#E9DCC5" stopOpacity="0" />
    </radialGradient>
  </>
);

/**
 * A chance, spent: a flat gold disc lying on the boards (no print), a thin darker rim showing its thickness on the
 * side away from the light, a soft contact shadow. drop: 0 = falling in (bigger, lifted), 1 = resting.
 */
export const HookX5Disc: React.FC<{ cx: number; cy: number; r: number; drop: number; glint: number; hop: number; opacity: number }> = ({ cx, cy, r, drop, glint, hop, opacity }) => {
  if (opacity <= 0.001) return null;
  const lift = (1 - drop) * 1.2 + hop * 0.5; // ft above the floor
  const s = 1 + lift * 0.22;
  const ox = -lift * 0.35;
  const oy = -lift * 0.55;
  const t = r * 0.16; // thickness, seen as the rim's offset
  return (
    <g opacity={opacity}>
      <ellipse cx={cx + 0.16 + lift * 0.5} cy={cy + 0.24 + lift * 0.7} rx={r * (1.18 + lift * 0.3)} ry={r * (1.18 + lift * 0.3)} fill="url(#hx5-contact)" />
      <g transform={`translate(${(cx + ox).toFixed(3)} ${(cy + oy).toFixed(3)}) scale(${s.toFixed(4)})`}>
        <circle cx={t * 0.5} cy={t * 0.8} r={r} fill="#8A5E12" />
        <circle cx={0} cy={0} r={r} fill="#B9801F" />
        <circle cx={0} cy={0} r={r * 0.9} fill="url(#hx5-gold)" />
        <path d={`M${(-r * 0.7).toFixed(3)} ${(-r * 0.35).toFixed(3)} A${r * 0.78} ${r * 0.78} 0 0 1 ${(r * 0.3).toFixed(3)} ${(-r * 0.74).toFixed(3)}`} fill="none" stroke="#FFF6DA" strokeWidth={r * 0.09} strokeLinecap="round" opacity={0.55 + 0.45 * glint} />
        {glint > 0.01 && <circle cx={-r * 0.25} cy={-r * 0.3} r={r * 0.9} fill="#FFFFFF" opacity={0.45 * glint} style={{ mixBlendMode: "screen" }} />}
      </g>
    </g>
  );
};

/** a made shot's dot, BBR's glyph, sitting on its disc (lifted with it); at rest with no offset it is answer's glyph */
export const HookX5Dot: React.FC<{ cx: number; cy: number; r?: number; scale: number; dx: number; dy: number; glow: number }> = ({ cx, cy, r, scale, dx, dy, glow }) => {
  if (scale <= 0.001) return null;
  const plain = scale === 1 && dx === 0 && dy === 0;
  const body = (
    <>
      {glow > 0.01 && <circle cx={cx} cy={cy} r={(r ?? 0.62) * 1.9} fill="#FFFFFF" opacity={0.28 * glow} />}
      <HookX5Glyph made cx={cx} cy={cy} r={r} />
    </>
  );
  if (plain) return body;
  return <g transform={`translate(${(cx + dx).toFixed(3)} ${(cy + dy).toFixed(3)}) scale(${scale.toFixed(4)}) translate(${-cx} ${-cy})`}>{body}</g>;
};

/**
 * The steel x a miss comes down as, seen from straight above: two crossed bars of brushed steel, a bolt at the
 * crossing. a: half extent in ft; steel 1 = the stake's head, 0 = BBR's flat x (answer's glyph, exactly).
 */
export const HookX5Stake: React.FC<{ cx: number; cy: number; a: number; w: number; steel: number; id: string; blur?: number; opacity?: number }> = ({ cx, cy, a, w, steel, id, blur = 0, opacity = 1 }) => {
  if (steel <= 0.001) return <HookX5Glyph made={false} cx={cx} cy={cy} />;
  const len = a * 2 * Math.SQRT2;
  const bar = (rot: number) => (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      <rect x={-len / 2 + 0.16} y={-w / 2 + 0.3} width={len} height={w} rx={w * 0.3} fill="#05070A" opacity={0.4} transform="rotate(0)" />
      <rect x={-len / 2} y={-w / 2} width={len} height={w} rx={w * 0.3} fill="url(#hx5-steel)" stroke="#161A1F" strokeWidth={0.05} />
      <rect x={-len / 2 + w * 0.3} y={-w * 0.32} width={len - w * 0.6} height={w * 0.1} rx={w * 0.05} fill="#FFFFFF" opacity={0.55} />
      {/* brushed grain along the bar */}
      {[-0.18, 0.06, 0.22].map((t, j) => (
        <line key={j} x1={-len / 2 + w * 0.4} x2={len / 2 - w * 0.4} y1={w * t} y2={w * t} stroke="#2A3036" strokeWidth={0.02} opacity={0.35} />
      ))}
    </g>
  );
  return (
    <g opacity={opacity} filter={blur > 0.02 ? `url(#${id})` : undefined}>
      {blur > 0.02 && (
        <defs>
          <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={blur.toFixed(3)} />
          </filter>
        </defs>
      )}
      {steel < 1 && (
        <g opacity={1 - steel}>
          <HookX5Glyph made={false} cx={cx} cy={cy} />
        </g>
      )}
      <g opacity={steel}>
        {bar(45)}
        {bar(-45)}
        <circle cx={cx} cy={cy} r={w * 0.42} fill="url(#hx5-bolt)" stroke="#161A1F" strokeWidth={0.04} />
      </g>
    </g>
  );
};

/** the shadow a hanging stake throws on the boards: soft and big when high, sharp and small as it comes down */
export const HookX5StakeShadow: React.FC<{ cx: number; cy: number; h: number; grow: number; pool: number; id: string; opacity: number }> = ({ cx, cy, h, grow, pool, id, opacity }) => {
  if (opacity <= 0.001) return null;
  const off = { x: h * 2.6, y: h * 3.4 }; // the light swung to the upper left
  const a = 1.7 * (0.35 + 0.65 * grow) * (1 + h * 0.7);
  const w = 0.72 * (1 + h * 0.6);
  const blur = 0.08 + h * 0.38;
  const sx = cx + off.x;
  const sy = cy + off.y;
  return (
    <g opacity={opacity}>
      {pool > 0.001 && <circle cx={sx} cy={sy} r={2.2 + h * 1.6} fill="url(#hx5-pool-dark)" opacity={pool} />}
      {grow > 0.001 && (
        <>
          <defs>
            <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation={blur.toFixed(3)} />
            </filter>
          </defs>
          <g filter={`url(#${id})`} opacity={(0.45 + 0.45 * (1 - h)) * grow}>
            <path d={`M${sx - a} ${sy - a} L${sx + a} ${sy + a} M${sx + a} ${sy - a} L${sx - a} ${sy + a}`} stroke="#04060A" strokeWidth={w} strokeLinecap="round" />
          </g>
        </>
      )}
    </g>
  );
};

/**
 * One impact on hard maple, u frames after the hit. heavy scales everything (the ninth is the heaviest).
 * Under: the dent and the boards bowing along the grain. Over: slivers kicked up along the grain, a ring of dust.
 */
export const HookX5ImpactFloor: React.FC<{ cx: number; cy: number; u: number; heavy: number; heal: number }> = ({ cx, cy, u, heavy, heal }) => {
  if (u < 0) return null;
  const dent = (1 - clamp01((u - 10) / 60)) * (1 - heal);
  const wave = (k: number) => clamp01((u - k) / (14 + heavy * 6));
  const ring = (k: number, tone: string, op: number) => {
    const p = wave(k);
    if (p <= 0 || p >= 1) return null;
    const rx = 0.6 + p * (6 + heavy * 6);
    return <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 1.7} fill="none" stroke={tone} strokeWidth={0.5 + heavy * 0.4} opacity={op * (1 - p)} />;
  };
  return (
    <g>
      {ring(0, "#2A1A06", 0.32)}
      {ring(1, "#FFF1D6", 0.4)}
      {ring(5, "#2A1A06", 0.18)}
      {ring(6, "#FFF1D6", 0.22)}
      {dent > 0.001 && <ellipse cx={cx} cy={cy} rx={2.4 + heavy * 1.0} ry={(2.4 + heavy * 1.0) * 1.3} fill="url(#hx5-dent)" opacity={dent} />}
      {/* the split boards right under the head: two short dark cracks along the grain */}
      {dent > 0.001 && (
        <g stroke="#2A1704" strokeWidth={0.06} opacity={0.8 * dent} strokeLinecap="round">
          <line x1={cx - 0.56} y1={cy - 2.1 - heavy * 0.8} x2={cx - 0.56} y2={cy + 1.7 + heavy * 0.9} />
          <line x1={cx + 0.375} y1={cy - 1.4} x2={cx + 0.375} y2={cy + 2.3 + heavy * 0.8} />
          <line x1={cx - 0.19} y1={cy + 0.8} x2={cx - 0.19} y2={cy + 2.9 + heavy} />
        </g>
      )}
    </g>
  );
};

export const HookX5ImpactAir: React.FC<{ cx: number; cy: number; u: number; heavy: number; seed: number }> = ({ cx, cy, u, heavy, seed }) => {
  if (u < 0 || u > 30) return null;
  const nSliv = Math.round(16 + heavy * 16);
  const nDust = Math.round(22 + heavy * 14);
  const flash = u < 3 ? 1 - u / 3 : 0;
  return (
    <g>
      {flash > 0 && <circle cx={cx} cy={cy} r={1.4 + heavy} fill="#FFFFFF" opacity={0.75 * flash} />}
      {Array.from({ length: nDust }).map((_, j) => {
        const a = (j / nDust) * Math.PI * 2 + hookX5Rnd(seed, j) * 0.4;
        const p = clamp01(u / (22 + heavy * 6));
        const e = 1 - Math.pow(1 - p, 3);
        const R = 0.9 + e * (4 + heavy * 4.5 + hookX5Rnd(seed, j + 50) * 1.6);
        const r = 0.45 + e * (1.1 + heavy * 0.8);
        return <circle key={`d${j}`} cx={cx + Math.cos(a) * R} cy={cy + Math.sin(a) * R * 1.15} r={r} fill="url(#hx5-dust)" opacity={(1 - p) * (0.75 + 0.25 * heavy)} />;
      })}
      {Array.from({ length: nSliv }).map((_, j) => {
        const life = 16 + hookX5Rnd(seed, j + 7) * 10;
        const p = u / life;
        if (p >= 1) return null;
        // mostly along the grain (up and down the court), some across
        const along = hookX5Rnd(seed, j + 3) < 0.7;
        const a = along ? (hookX5Rnd(seed, j + 9) < 0.5 ? -1 : 1) * (Math.PI / 2) + (hookX5Rnd(seed, j + 11) - 0.5) * 0.9 : hookX5Rnd(seed, j + 13) * Math.PI * 2;
        const dist = (1.5 + hookX5Rnd(seed, j + 17) * (4 + heavy * 4)) * (1 - Math.pow(1 - p, 2));
        const z = 4 * p * (1 - p) * (0.8 + hookX5Rnd(seed, j + 19) * 1.2) * (1 + heavy * 0.6);
        const L = 0.9 + hookX5Rnd(seed, j + 23) * (1.6 + heavy);
        const W = 0.12 + hookX5Rnd(seed, j + 29) * 0.12;
        const spin = (hookX5Rnd(seed, j + 31) - 0.5) * 720 * p;
        const x = cx + Math.cos(a) * dist;
        const y = cy + Math.sin(a) * dist;
        const s = 1 + z * 0.35;
        return (
          <g key={`s${j}`} opacity={1 - p * p}>
            <rect x={x + z * 0.5 - L / 2} y={y + z * 0.7 - W / 2} width={L} height={W} fill="#000" opacity={0.25} transform={`rotate(${(90 + spin).toFixed(1)} ${x + z * 0.5} ${y + z * 0.7})`} />
            <g transform={`translate(${x.toFixed(3)} ${y.toFixed(3)}) scale(${s.toFixed(3)}) rotate(${(90 + (along ? 0 : 40) + spin).toFixed(1)})`}>
              <rect x={-L / 2} y={-W / 2} width={L} height={W} rx={W / 2} fill={hookX5Rnd(seed, j + 37) < 0.5 ? "#E8C690" : "#D2A766"} stroke="#7A5420" strokeWidth={0.015} />
            </g>
          </g>
        );
      })}
    </g>
  );
};
