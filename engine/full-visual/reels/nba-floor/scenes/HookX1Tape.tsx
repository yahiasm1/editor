// HookX1's tape: the Lufkin "Universal" 50 ft steel tape (photos/commons-lufkin-50ft-steel-tape-junkyardsparkle-cc0.jpg)
// used as a compass on the floor. The bent wire ring and its riveted tab over a pin at the middle of the basket; the
// satin steel blade with black etched inch ticks and big black foot numerals, its shadow on the lacquer and the gold
// glow under it (distance from the basket); the case lying face up at the reading point, the blade entering the slot
// in its chrome band tangent to the rim: red pebbled leather, the chrome face plate (UNIVERSAL / THE LUFKIN RULE CO. /
// SAGINAW, MICH. U.S.A.), the boss and its hole, the folding crank with its ball knob. Plus the reading window: the
// blade at the slot magnified behind a chrome bezel, its reading etched in black.
import React from "react";
import { paintedKinkProject as proj, type PaintedKinkCam } from "./PaintedKinkWorld";
import { hookX1Reading, hx1Clamp, hx1Lerp, type HookX1TapeState } from "./HookX1Kit";

const GOLD = "#F2B33D";

type Pt = { x: number; y: number };

/** where the case sits on screen, and its radius in px */
export function hookX1CaseAt(cam: PaintedKinkCam & { ppf: number }, s: HookX1TapeState) {
  const R = hx1Clamp(cam.ppf * 0.7, 40, 70);
  const tip = { x: s.r * Math.cos(s.angle), y: s.r * Math.sin(s.angle) };
  const n = { x: Math.sin(s.angle), y: -Math.cos(s.angle) }; // the case rides on the baseline side of the blade
  const c = proj(cam, tip.x + (n.x * R) / cam.ppf, tip.y + (n.y * R) / cam.ppf, 0);
  const t = proj(cam, tip.x, tip.y, 0);
  return { R, c, tip: t };
}

/** the blade's centre line in world feet, from fraction u0 (0 = the pin) to the tip, with its bow and whip */
function bladeWorld(s: HookX1TapeState, u0: number, n = 64): [number, number][] {
  const d = { x: Math.cos(s.angle), y: Math.sin(s.angle) };
  const nn = { x: -d.y, y: d.x };
  const out: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const u = u0 + ((1 - u0) * i) / n;
    // the whip runs from the case back toward the pin: a bump a few feet behind the tip, zero where it is held
    const whip = hookX1Whip(s, u);
    const off = s.bow * Math.sin(Math.PI * u) + whip;
    out.push([d.x * s.r * u + nn.x * off, d.y * s.r * u + nn.y * off]);
  }
  return out;
}

function hookX1Whip(s: HookX1TapeState, u: number) {
  if (s.whip === 0) return 0;
  const back = ((1 - u) * s.r) / 2.6; // feet behind the tip, in units of the bump's peak
  return s.whip * back * Math.exp(1 - back) * Math.sin((1 - u) * s.r * 1.6 - s.after * 0.8);
}

const pathOf = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("");

export const HookX1Tape: React.FC<{ cam: PaintedKinkCam & { ppf: number }; s: HookX1TapeState; f: number; hover: number; sweep: number }> = ({ cam, s, f, hover, sweep }) => {
  const ppf = cam.ppf;
  const w = hx1Clamp(ppf * 0.24, 11, 23); // blade width on screen
  const u0 = s.zip;
  const world = bladeWorld(s, u0);
  const scr = world.map(([x, y]) => proj(cam, x, y, 0)).filter((p) => p.ok);
  const { R, c, tip } = hookX1CaseAt(cam, s);
  const deg = (Math.atan2(tip.y - proj(cam, 0, 0, 0).y, tip.x - proj(cam, 0, 0, 0).x) * 180) / Math.PI;
  const zipping = s.zip > 0 && s.zip < 1;

  // graduations: every foot a long tick and a numeral, every inch a short tick once they are far enough apart
  const marks: React.ReactNode[] = [];
  if (s.zip < 1) {
    const d = { x: Math.cos(s.angle), y: Math.sin(s.angle) };
    const nn = { x: -d.y, y: d.x };
    const inches = ppf > 42;
    const step = inches ? 1 / 12 : 1;
    for (let v = step; v < s.r - 0.02; v += step) {
      const u = v / s.r;
      if (u < u0) continue;
      const whip = hookX1Whip(s, u);
      const off = s.bow * Math.sin(Math.PI * u) + whip;
      const p = proj(cam, d.x * v + nn.x * off, d.y * v + nn.y * off, 0);
      if (!p.ok || p.x < -40 || p.x > 1120 || p.y < 480 || p.y > 1600) continue;
      const k = Math.round(v * 12);
      const foot = k % 12 === 0;
      const half = k % 6 === 0;
      const len = foot ? 0.62 : half ? 0.42 : 0.26;
      marks.push(
        <g key={k} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${deg.toFixed(2)})`}>
          <line x1={0} y1={-w / 2} x2={0} y2={-w / 2 + w * len} stroke="#101316" strokeWidth={foot ? Math.max(1.4, w * 0.09) : Math.max(0.8, w * 0.05)} />
          {foot && (ppf > 40 || (k / 12) % 2 === 0) && (
            <text x={-w * 0.12} y={w * 0.42} fontFamily="Inter, sans-serif" fontWeight={800} fontSize={w * 0.7} fill="#101316" textAnchor="end" transform={`scale(0.86 1)`}>
              {k / 12}
            </text>
          )}
        </g>,
      );
    }
  }

  // the case: lifted off the floor and away at the end; squashed by the slam; hovering in the corner
  const lift = s.lift;
  const squash = s.after < 0 ? 0 : 0.08 * Math.exp(-s.after / 3.2) * Math.cos(s.after / 1.4);
  const scale = (1 + 0.04 * hover + 0.9 * lift) * (1 - squash);
  const cx = c.x + 260 * lift, cy = c.y - 480 * lift;
  const shadowOff = 5 + 7 * hover + 60 * lift;
  const caseO = 1 - prog01(lift, 0.45, 1);
  const knock = s.after >= 0 && s.after < 4 ? (4 - s.after) * 0.8 : 0;
  const click = s.clicks > 0 ? Math.sin(s.clicks * Math.PI) * 1.6 : 0;
  const glint = 0.5 + 0.5 * Math.sin(f / 13 + sweep * 3);
  const spin = Math.abs(s.pull) > 0 && s.pull < 1;
  const id = "hx1";

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <filter id={`${id}-pebble`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency={hx1Clamp(1.5 * (50 / R), 0.9, 2.2)} numOctaves={2} seed={11} result="n" />
          <feDiffuseLighting in="n" surfaceScale={1.8} lightingColor="#ffffff" result="l">
            <feDistantLight azimuth={225} elevation={50} />
          </feDiffuseLighting>
          <feComposite in="l" in2="SourceGraphic" operator="arithmetic" k1={1.08} k2={0} k3={0} k4={0} result="t" />
          <feComposite in="t" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={w * 0.9} />
        </filter>
        <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={Math.max(2, w * 0.35)} />
        </filter>
        <filter id={`${id}-caseblur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={lift * 9} />
        </filter>
        <radialGradient id={`${id}-chrome`} cx="0.36" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.4" stopColor="#D5DADF" />
          <stop offset="0.72" stopColor="#8E959C" />
          <stop offset="1" stopColor="#DCE0E3" />
        </radialGradient>
        <linearGradient id={`${id}-band`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F7F8F9" />
          <stop offset="0.35" stopColor="#B6BCC2" />
          <stop offset="0.6" stopColor="#6F767D" />
          <stop offset="1" stopColor="#E1E4E7" />
        </linearGradient>
        <radialGradient id={`${id}-leather`} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#B32A2F" />
          <stop offset="0.7" stopColor="#8E1C21" />
          <stop offset="1" stopColor="#5E1014" />
        </radialGradient>
        <radialGradient id={`${id}-shadow`}>
          <stop offset="0.5" stopColor="#000" stopOpacity="0.5" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-reflect`}>
          <stop offset="0" stopColor="#C0262C" stopOpacity="0.28" />
          <stop offset="1" stopColor="#C0262C" stopOpacity="0" />
        </radialGradient>
        <path id={`${id}-top`} d={`M ${-R * 0.47} 0 A ${R * 0.47} ${R * 0.47} 0 0 1 ${R * 0.47} 0`} />
        <path id={`${id}-bot`} d={`M ${-R * 0.5} 0 A ${R * 0.5} ${R * 0.5} 0 0 0 ${R * 0.5} 0`} />
        <path id={`${id}-bot2`} d={`M ${-R * 0.4} 0 A ${R * 0.4} ${R * 0.4} 0 0 0 ${R * 0.4} 0`} />
      </defs>

      {/* the blade: shadow on the lacquer, gold under the steel, the steel, its edges, the etched graduations */}
      {scr.length > 1 && s.zip < 1 && (
        <g>
          <path d={pathOf(scr.map((p) => ({ x: p.x + 3 + 0.12 * w, y: p.y + 5 + 0.2 * w })))} fill="none" stroke="#000" strokeOpacity={0.32} strokeWidth={w * 1.05} filter={`url(#${id}-soft)`} />
          <path d={pathOf(scr)} fill="none" stroke={GOLD} strokeOpacity={hx1Clamp(0.6 * s.gold)} strokeWidth={w * 3.4} filter={`url(#${id}-glow)`} />
          <path d={pathOf(scr)} fill="none" stroke="#6B747C" strokeWidth={w} strokeLinejoin="round" />
          <path d={pathOf(scr)} fill="none" stroke="#9BA4AC" strokeWidth={w * 0.55} strokeOpacity={0.55} />
          <path d={pathOf(scr.map((p) => offsetPt(p, deg, -w * 0.42)))} fill="none" stroke="#D6DCE1" strokeOpacity={0.85} strokeWidth={Math.max(1, w * 0.08)} />
          <path d={pathOf(scr.map((p) => offsetPt(p, deg, w * 0.46)))} fill="none" stroke={GOLD} strokeOpacity={hx1Clamp(0.55 * s.gold)} strokeWidth={Math.max(1, w * 0.1)} />
          {marks}
          {s.run >= 0 && s.run < 1 && (() => {
            const i = Math.min(scr.length - 1, Math.round(s.run * (scr.length - 1)));
            const p = scr[i];
            return (
              <g>
                <path d={pathOf(scr.slice(Math.max(0, i - 14), i + 1))} fill="none" stroke={GOLD} strokeOpacity={0.85} strokeWidth={w * 1.4} filter={`url(#${id}-soft)`} />
                <circle cx={p.x} cy={p.y} r={w * 2.2} fill={GOLD} opacity={0.55} filter={`url(#${id}-glow)`} />
                <circle cx={p.x} cy={p.y} r={w * 0.55} fill="#FFF3D1" />
              </g>
            );
          })()}
          {zipping && <path d={pathOf(scr.slice(0, 6))} fill="none" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={w * 0.5} filter={`url(#${id}-soft)`} />}
          {/* the bent wire ring and its riveted tab, over the pin (or flying home behind the blade) */}
          <g transform={`translate(${scr[0].x.toFixed(1)} ${scr[0].y.toFixed(1)}) rotate(${deg.toFixed(2)})`}>
            <rect x={-w * 0.1} y={-w * 0.55} width={w * 0.75} height={w * 1.1} rx={w * 0.12} fill="#C3A15A" stroke="#7A6232" strokeWidth={0.8} />
            <circle cx={w * 0.38} cy={-w * 0.25} r={w * 0.09} fill="#F1E2B8" />
            <circle cx={w * 0.38} cy={w * 0.25} r={w * 0.09} fill="#F1E2B8" />
            <path d={`M ${w * 0.05} ${-w * 0.42} L ${-w * 1.15} ${-w * 0.9} L ${-w * 1.2} ${w * 0.9} L ${w * 0.05} ${w * 0.42}`} fill="none" stroke="#D9DDE1" strokeWidth={Math.max(1.6, w * 0.2)} strokeLinejoin="round" />
            <path d={`M ${w * 0.05} ${-w * 0.42} L ${-w * 1.15} ${-w * 0.9}`} fill="none" stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={Math.max(0.7, w * 0.07)} />
          </g>
        </g>
      )}
      {s.zip < 0.05 && (() => {
        const p0 = proj(cam, 0, 0, 0);
        return p0.ok ? (
          <g>
            <circle cx={p0.x + 2} cy={p0.y + 3} r={Math.max(3.5, w * 0.36)} fill="#000" opacity={0.35} />
            <circle cx={p0.x} cy={p0.y} r={Math.max(3.2, w * 0.32)} fill="#E3E7EA" stroke="#4E565F" strokeWidth={1.2} />
          </g>
        ) : null;
      })()}

      {/* the case */}
      <g opacity={caseO} filter={lift > 0.02 ? `url(#${id}-caseblur)` : undefined}>
        <ellipse cx={cx + shadowOff * 0.7} cy={cy + shadowOff} rx={R * 1.14 * scale} ry={R * 1.1 * scale} fill={`url(#${id}-shadow)`} opacity={1 - 0.6 * lift} />
        <ellipse cx={cx} cy={cy + R * 1.35} rx={R * 0.9} ry={R * 0.45} fill={`url(#${id}-reflect)`} opacity={0.45 * (1 - lift)} />
        <g transform={`translate(${(cx + knock * Math.cos((deg * Math.PI) / 180) + click).toFixed(1)} ${(cy + knock * Math.sin((deg * Math.PI) / 180)).toFixed(1)}) scale(${scale.toFixed(4)})`}>
          {/* chrome band, then the leather, drawn unrotated so the pebble light stays fixed in the room */}
          <circle r={R} fill={`url(#${id}-band)`} />
          <circle r={R} fill="none" stroke="#3A3F44" strokeWidth={1} />
          <circle r={R * 0.95} fill={`url(#${id}-leather)`} />
          <circle r={R * 0.95} fill="#8C1A1E" filter={`url(#${id}-pebble)`} opacity={0.78} />
          <circle r={R * 0.93} fill="none" stroke="#4A0B0E" strokeOpacity={0.6} strokeWidth={R * 0.03} />
          <path d={`M ${-R * 0.78} ${-R * 0.48} A ${R * 0.92} ${R * 0.92} 0 0 1 ${-R * 0.2} ${-R * 0.9}`} fill="none" stroke="#E07A7E" strokeOpacity={0.35} strokeWidth={R * 0.05} strokeLinecap="round" />
        </g>
        <g transform={`translate(${(cx + knock * Math.cos((deg * Math.PI) / 180) + click).toFixed(1)} ${(cy + knock * Math.sin((deg * Math.PI) / 180)).toFixed(1)}) scale(${scale.toFixed(4)}) rotate(${deg.toFixed(2)})`}>
          {/* the slot in the band where the blade goes in, on the reading side */}
          <rect x={-R * 0.08} y={-R * 1.05} width={R * 0.16} height={R * 0.2} rx={1.5} fill="#121416" />
          {/* face plate */}
          <circle r={R * 0.62} fill={`url(#${id}-chrome)`} stroke="#6E757C" strokeWidth={1} />
          <circle r={R * 0.585} fill="none" stroke="#24282C" strokeWidth={Math.max(0.8, R * 0.014)} />
          <circle r={R * 0.355} fill="none" stroke="#24282C" strokeWidth={Math.max(0.8, R * 0.012)} />
          <text fontFamily="Inter, sans-serif" fontWeight={800} fontSize={R * 0.15} fill="#1E2226" letterSpacing={R * 0.012}>
            <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">UNIVERSAL</textPath>
          </text>
          <text fontFamily="Inter, sans-serif" fontWeight={800} fontSize={R * 0.078} fill="#1E2226">
            <textPath href={`#${id}-bot`} startOffset="50%" textAnchor="middle">THE LUFKIN RULE CO.</textPath>
          </text>
          <text fontFamily="Inter, sans-serif" fontWeight={600} fontSize={R * 0.052} fill="#2A2E33">
            <textPath href={`#${id}-bot2`} startOffset="50%" textAnchor="middle">SAGINAW, MICH. U.S.A.</textPath>
          </text>
          {/* the boss, its hole and rivet */}
          <circle r={R * 0.3} fill="#CFD4D8" stroke="#80878E" strokeWidth={1} />
          <circle r={R * 0.26} fill="none" stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={R * 0.02} />
          <circle cx={-R * 0.09} cy={R * 0.07} r={R * 0.085} fill="#141619" />
          <circle cx={R * 0.12} cy={-R * 0.04} r={R * 0.025} fill="#7A8188" />
          {/* the crank: a flat arm and a ball knob, turning as the blade goes in */}
          {spin && [0.25, 0.5].map((g, i) => (
            <g key={i} transform={`rotate(${(s.crank - 40 * (i + 1)).toFixed(1)})`} opacity={g * 0.5}>
              <rect x={-R * 0.06} y={-R * 0.09} width={R * 0.6} height={R * 0.16} rx={R * 0.05} fill="#C9CED3" />
            </g>
          ))}
          <g transform={`rotate(${s.crank.toFixed(1)})`}>
            <rect x={-R * 0.12} y={-R * 0.075} width={R * 0.22} height={R * 0.15} rx={R * 0.04} fill="#B9BFC5" stroke="#6E757C" strokeWidth={0.8} />
            <rect x={-R * 0.06} y={-R * 0.09} width={R * 0.62} height={R * 0.17} rx={R * 0.05} fill={`url(#${id}-chrome)`} stroke="#6E757C" strokeWidth={1} />
            <circle cx={R * 0.58} cy={0} r={R * 0.115} fill={`url(#${id}-chrome)`} stroke="#6E757C" strokeWidth={1} />
            <circle cx={R * 0.545} cy={-R * 0.04} r={R * 0.04} fill="#FFFFFF" opacity={0.55 + 0.45 * glint} />
          </g>
          {/* a moving glint on the chrome band */}
          <path d={`M ${-R * 0.72} ${-R * 0.69} A ${R} ${R} 0 0 1 ${R * 0.15} ${-R * 0.99}`} fill="none" stroke="#FFFFFF" strokeOpacity={0.55 * glint} strokeWidth={R * 0.035} strokeLinecap="round" transform={`rotate(${(-deg + sweep * 40).toFixed(1)})`} />
        </g>
      </g>
    </svg>
  );
};

function offsetPt(p: Pt, deg: number, d: number): Pt {
  const a = (deg * Math.PI) / 180;
  return { x: p.x - Math.sin(a) * d, y: p.y + Math.cos(a) * d };
}
function prog01(v: number, a: number, b: number) {
  return hx1Clamp((v - a) / (b - a));
}

/** the reading window: the blade at the slot, magnified behind a chrome bezel; the reading etched in black */
export const HookX1Window: React.FC<{ x: number; y: number; r: number; o: number; lock: number; flash: number }> = ({ x, y, r, o, lock, flash }) => {
  if (o <= 0.01) return null;
  const { ft, inch } = hookX1Reading(r);
  const W = 300, H = 150;
  const inchPx = 24;
  const frac = r * 12;
  return (
    <div style={{ position: "absolute", left: x - W / 2, top: y - H / 2, width: W, height: H, opacity: o, transform: `scale(${(0.9 + 0.1 * o + 0.05 * flash).toFixed(3)})` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "linear-gradient(160deg, #F4F6F8 0%, #A9B0B7 38%, #6C737A 62%, #D9DDE1 100%)", boxShadow: "0 22px 44px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.8)" }} />
      <div style={{ position: "absolute", left: 7, top: 7, right: 7, bottom: 7, borderRadius: 20, overflow: "hidden", background: "linear-gradient(180deg, #E9ECEF 0%, #CDD3D8 55%, #B9C0C6 100%)" }}>
        {/* the reading, etched */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 4, textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 58, letterSpacing: -1, color: "#111417", fontVariantNumeric: "tabular-nums", textShadow: "0 1px 0 rgba(255,255,255,0.7)", transform: `translateY(${((1 - lock) * 3).toFixed(1)}px)` }}>
          {ft}&#8239;' {inch}"
        </div>
        {/* the blade at the slot, ticks running past the red index */}
        <svg width={W - 14} height={56} style={{ position: "absolute", left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="hx1-win-steel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#A7AFB6" />
              <stop offset="0.5" stopColor="#7E878F" />
              <stop offset="1" stopColor="#5C646B" />
            </linearGradient>
          </defs>
          <rect x={0} y={6} width={W - 14} height={50} fill="url(#hx1-win-steel)" />
          <rect x={0} y={6} width={W - 14} height={1.5} fill="#E6EAED" />
          {Array.from({ length: 16 }, (_, k) => {
            const i = Math.floor(frac) - 7 + k;
            if (i < 0) return null;
            const px = (W - 14) / 2 + (i - frac) * inchPx;
            const foot = i % 12 === 0;
            const half = i % 6 === 0;
            return (
              <g key={i}>
                <line x1={px} y1={6} x2={px} y2={foot ? 52 : half ? 36 : 26} stroke="#0E1113" strokeWidth={foot ? 3 : 1.6} />
                {foot && <text x={px + 4} y={52} fontFamily="Inter, sans-serif" fontWeight={800} fontSize={22} fill="#0E1113">{i / 12}</text>}
                {!foot && i % 3 === 0 && <text x={px + 3} y={50} fontFamily="Inter, sans-serif" fontWeight={700} fontSize={13} fill="#1A1E21">{i % 12}</text>}
              </g>
            );
          })}
          <rect x={(W - 14) / 2 - 1.5} y={0} width={3} height={56} fill="#D6382D" />
        </svg>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.18) 100%)" }} />
      </div>
    </div>
  );
};

export const hookX1WindowLerp = hx1Lerp;
