// HookX1's marks on the floor, all projected through the hook's camera: the three-point paint lit along its whole
// path, the faint 22' tick that flashes in the first second, the gold ghost circle of 23'9", the gold 21 in sliver,
// the grey dimension at rim level, the dust off the boards on the slam, and the Logoman stamped on the apron.
import React from "react";
import { Img, staticFile } from "remotion";
import { ease, prog } from "../../../src/engine";
import {
  PK_BASE_Y, PK_KINK_Y, PK_LINE, paintedKinkArc as arc, paintedKinkBand as band, paintedKinkCut as cut,
  paintedKinkProject as proj, type PaintedKinkCam, type PaintedKinkV3, paintedKinkPoly as poly,
} from "./PaintedKinkWorld";
import { HX1_CORNER, HX1_KINK_A, HX1_R, hx1Clamp, hx1Rnd } from "./HookX1Kit";

const GOLD = "#F2B33D";
const GREY = "#8B949E";

/** the whole three-point line as one path: left corner at the baseline -> left kink -> over the arc -> right kink ->
 *  right corner at the baseline (the centre of the 2 in paint, as the floor draws it) */
function hookX1ThreePath(): [number, number][] {
  const c = HX1_CORNER - PK_LINE / 2;
  const top = arc(0, 0, HX1_R - PK_LINE / 2, Math.PI - HX1_KINK_A, HX1_KINK_A, 120);
  return [[-c, PK_BASE_Y], ...top, [c, PK_BASE_Y]];
}
const THREE = hookX1ThreePath();

const scr = (cam: PaintedKinkCam, pts: [number, number][]) =>
  pts.map(([x, y]) => proj(cam, x, y, 0)).filter((p) => p.ok).map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("");

/** "three-point": a white light runs the painted line end to end, leaving it glowing */
export const HookX1LineLight: React.FC<{ cam: PaintedKinkCam; f: number; at: number }> = ({ cam, f, at }) => {
  const run = prog(f, at - 2, 26, (t) => t * (0.7 + 0.3 * t));
  if (run <= 0) return null;
  const after = Math.max(0, f - (at + 24));
  const glow = run < 1 ? 1 : 0.35 + 0.65 * Math.exp(-after / 22);
  const fade = 1 - prog(f, at + 90, 50, ease.linear);
  if (fade <= 0) return null;
  const lit = band(cam, cut(THREE, 0, run), PK_LINE * 1.02);
  const head = run < 1 ? cut(THREE, run, run + 0.0001)[0] : THREE[THREE.length - 1];
  const hp = proj(cam, head[0], head[1], 0);
  return (
    <g opacity={fade}>
      <path d={scr(cam, cut(THREE, 0, run))} fill="none" stroke="#FFFFFF" strokeOpacity={0.55 * glow} strokeWidth={9} filter="url(#hx1m-glow)" />
      {lit && <path d={lit} fill="#FFFFFF" opacity={0.65 + 0.35 * glow} />}
      {run < 1 && hp.ok && (
        <g>
          <circle cx={hp.x} cy={hp.y} r={30} fill="url(#hx1m-bead)" />
          <circle cx={hp.x} cy={hp.y} r={5} fill="#FFFFFF" />
        </g>
      )}
    </g>
  );
};

/** the corner paint seen close: fresh white with its raised edge, a bright lip toward the basket and a hairline
 *  shadow toward the sideline (the Clarkson photo at shoe level) */
export const HookX1Paint: React.FC<{ cam: PaintedKinkCam & { ppf: number }; o: number }> = ({ cam, o }) => {
  if (o <= 0.01) return null;
  const body = band(cam, THREE, PK_LINE);
  const lip = band(cam, THREE, PK_LINE * 0.16, PK_LINE * 0.42);
  const shade = band(cam, THREE, PK_LINE * 0.22, -PK_LINE * 0.6);
  return (
    <g opacity={o}>
      {shade && <path d={shade} fill="#5A3E1C" opacity={0.35} filter="url(#hx1m-mote)" />}
      {body && <path d={body} fill="#FBFCFD" />}
      {lip && <path d={lip} fill="#FFFFFF" />}
    </g>
  );
};

/** maple grain up close: fine streaks along the boards, fixed to the floor (only drawn while the camera looks straight
 *  down, where the floor maps to the screen as a plain scale) */
export const HookX1Grain: React.FC<{ cam: PaintedKinkCam & { ppf: number }; o: number }> = ({ cam, o }) => {
  if (o <= 0.01) return null;
  const s = cam.ppf;
  const tx = cam.cx - s * cam.tx, ty = cam.cy + s * cam.ty;
  return (
    <g opacity={o} transform={`translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)} ${(-s).toFixed(4)})`} style={{ mixBlendMode: "multiply" }}>
      <filter id="hx1m-grain" x="14" y="-9" width="16" height="22" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse">
        <feTurbulence type="fractalNoise" baseFrequency="5.5 0.16" numOctaves={3} seed={5} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.25  0 0 0 0 0.08  0 0 0 2.2 -0.9" />
      </filter>
      <rect x={14} y={-9} width={16} height={22} filter="url(#hx1m-grain)" />
    </g>
  );
};

/** the faint 22' tick on the right corner line at rim level: there and gone inside the first second */
export const HookX1Foretell: React.FC<{ cam: PaintedKinkCam; f: number }> = ({ cam, f }) => {
  const o = prog(f, 36, 5, ease.linear) * (1 - prog(f, 50, 9, ease.in));
  if (o <= 0) return null;
  const a = proj(cam, HX1_CORNER - 1.1, 0, 0), b = proj(cam, HX1_CORNER + 0.9, 0, 0);
  if (!a.ok || !b.ok) return null;
  return (
    <g opacity={o}>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#C9D1D9" strokeWidth={3} />
      <text x={a.x - 10} y={a.y + 11} fontFamily="Figtree, sans-serif" fontWeight={700} fontSize={32} fill="#C9D1D9" textAnchor="end">22'</text>
    </g>
  );
};

/** the gold ghost circle: every point 23'9" from the middle of the basket, drawn out from the tip both ways down to
 *  the baseline. Its width grows a little with the zoom, never thicker than the paint */
export const HookX1Ghost: React.FC<{ cam: PaintedKinkCam & { ppf: number }; f: number; at: number; o: number; pulse: number }> = ({ cam, f, at, o, pulse }) => {
  const k = prog(f, at - 1, 20, ease.inOut);
  if (k <= 0 || o <= 0) return null;
  const end = Math.asin(PK_BASE_Y / HX1_R); // -0.223: where the circle meets the baseline
  const half = (Math.PI / 2 - end) * k;
  const right = arc(0, 0, HX1_R, Math.PI / 2, Math.PI / 2 - half, 90);
  const left = arc(0, 0, HX1_R, Math.PI / 2, Math.PI / 2 + half, 90);
  const w = Math.max(3, Math.min(7, cam.ppf * 0.06));
  const ends = k < 1 ? [right[right.length - 1], left[left.length - 1]].map(([x, y]) => proj(cam, x, y, 0)) : [];
  return (
    <g opacity={o}>
      {[right, left].map((p, i) => (
        <g key={i}>
          <path d={scr(cam, p)} fill="none" stroke={GOLD} strokeOpacity={0.4 + 0.4 * pulse} strokeWidth={w * 3.4} filter="url(#hx1m-glow)" />
          <path d={scr(cam, p)} fill="none" stroke={GOLD} strokeWidth={w} strokeLinecap="round" />
        </g>
      ))}
      {ends.map((p, i) => (p.ok ? <circle key={i} cx={p.x} cy={p.y} r={w * 2.6} fill="url(#hx1m-goldbead)" /> : null))}
    </g>
  );
};

/** the 21 in: the gold floor between the straight corner line and the ghost circle, baseline to the kink */
export function hookX1SliverPoly(p: number): PaintedKinkV3[] {
  const n = 48;
  const out: PaintedKinkV3[] = [];
  for (let i = 0; i <= n; i++) {
    const y = PK_BASE_Y + ((PK_KINK_Y - PK_BASE_Y) * i) / n;
    const xc = Math.sqrt(HX1_R * HX1_R - y * y);
    out.push([xc - (xc - HX1_CORNER) * p, y, 0]);
  }
  for (let i = n; i >= 0; i--) {
    const y = PK_BASE_Y + ((PK_KINK_Y - PK_BASE_Y) * i) / n;
    const xc = Math.sqrt(HX1_R * HX1_R - y * y);
    out.push([xc, y, 0]);
  }
  return out;
}
export const HookX1Sliver: React.FC<{ cam: PaintedKinkCam; f: number; at: number; o: number; flare: number }> = ({ cam, f, at, o, flare }) => {
  const p = prog(f, at - 3, 12, ease.out);
  if (p <= 0 || o <= 0) return null;
  const d = poly(cam, hookX1SliverPoly(p));
  if (!d) return null;
  const shimmer = 0.5 + 0.5 * Math.sin(f / 11);
  return (
    <g opacity={o}>
      <path d={d} fill={GOLD} opacity={0.3 + 0.12 * shimmer + 0.3 * flare} filter="url(#hx1m-softgold)" />
      <path d={d} fill={GOLD} opacity={0.34 + 0.25 * flare} style={{ mixBlendMode: "screen" }} />
    </g>
  );
};

/** a grey dimension across the sliver at rim level: extension hairlines up from y = 0, the dimension line, "21 in" */
export const HookX1Dim: React.FC<{ cam: PaintedKinkCam; f: number; at: number; o: number }> = ({ cam, f, at, o }) => {
  const k = prog(f, at, 10, ease.out);
  if (k <= 0 || o <= 0) return null;
  const y0 = 0.35, y1 = 1.75, yd = 1.45;
  const e = [HX1_CORNER, HX1_R].map((x) => [proj(cam, x, y0, 0), proj(cam, x, y0 + (y1 - y0) * k, 0)]);
  const a = proj(cam, HX1_CORNER, yd, 0), b = proj(cam, HX1_CORNER + (HX1_R - HX1_CORNER) * k, yd, 0);
  if (!a.ok || !b.ok) return null;
  const txt = prog(f, at + 6, 8);
  const tk = 9;
  return (
    <g opacity={o}>
      {e.map(([p, q], i) => (p.ok && q.ok ? <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={GREY} strokeWidth={2} /> : null))}
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#C9D1D9" strokeWidth={2.5} />
      <line x1={a.x - tk} y1={a.y + tk} x2={a.x + tk} y2={a.y - tk} stroke="#C9D1D9" strokeWidth={2.5} />
      {k >= 1 && <line x1={b.x - tk} y1={b.y + tk} x2={b.x + tk} y2={b.y - tk} stroke="#C9D1D9" strokeWidth={2.5} />}
      <text x={(a.x + b.x) / 2} y={a.y - 22 + 8 * (1 - txt)} opacity={txt} fontFamily="Figtree, sans-serif" fontWeight={700} fontSize={44} fill="#E6EDF3" textAnchor="middle">
        21 in
      </text>
    </g>
  );
};

/** dust kicked off the boards where the case slams down, and a ring of light running out over the lacquer */
export const HookX1Dust: React.FC<{ cam: PaintedKinkCam & { ppf: number }; f: number; at: number; x: number; y: number }> = ({ cam, f, at, x, y }) => {
  const t = f - at;
  if (t < 0 || t > 28) return null;
  const c = proj(cam, x, y, 0);
  if (!c.ok) return null;
  const ring = cam.ppf * (0.6 + 2.6 * (1 - Math.exp(-t / 7)));
  return (
    <g>
      <ellipse cx={c.x} cy={c.y} rx={ring} ry={ring * 0.92} fill="none" stroke="#FFF4DE" strokeOpacity={0.5 * Math.exp(-t / 8)} strokeWidth={6 * Math.exp(-t / 10) + 1} filter="url(#hx1m-glow)" />
      {Array.from({ length: 46 }, (_, i) => {
        const a = hx1Rnd(i, 3) * Math.PI * 2;
        const v = (0.5 + 1.6 * hx1Rnd(i, 4)) * cam.ppf * 0.09;
        const d = v * 12 * (1 - Math.exp(-t / 9));
        const rise = (6 + 26 * hx1Rnd(i, 5)) * (1 - Math.exp(-t / 14)) - 0.012 * t * t;
        const r = 1.2 + 3.2 * hx1Rnd(i, 6);
        const o = hx1Clamp(0.85 * (1 - t / 28)) * (0.4 + 0.6 * hx1Rnd(i, 7));
        return <circle key={i} cx={c.x + d * Math.cos(a)} cy={c.y + d * Math.sin(a) * 0.8 - rise} r={r * (1 + t / 30)} fill={i % 3 ? "#EAD9B8" : "#FFFFFF"} opacity={o} filter={i % 4 === 0 ? "url(#hx1m-mote)" : undefined} />;
      })}
    </g>
  );
};

/** the Logoman, painted on the dark apron beside the stanchion: stamped down on "NBA" */
export const HookX1Logoman: React.FC<{ cam: PaintedKinkCam & { ppf: number }; f: number; at: number; o: number }> = ({ cam, f, at, o }) => {
  const k = prog(f, at - 4, 10, ease.back);
  if (k <= 0 || o <= 0) return null;
  const c = proj(cam, -6.6, -6.8, 0);
  if (!c.ok) return null;
  const w = 3.6 * cam.ppf, h = (w * 30) / 51;
  const s = 1.35 - 0.35 * k;
  const press = f >= at + 6 ? Math.exp(-(f - at - 6) / 6) : 0;
  return (
    <div style={{ position: "absolute", left: c.x - (w * s) / 2, top: c.y - (h * s) / 2, width: w * s, height: h * s, opacity: o * prog(f, at - 4, 4, ease.linear), filter: `drop-shadow(0 ${(8 * (1 - k)).toFixed(1)}px ${(10 * (1 - k) + 1).toFixed(1)}px rgba(0,0,0,0.6)) brightness(${(1 + 0.35 * press).toFixed(3)})` }}>
      <Img src={staticFile("nba-floor/hookx1-logoman.svg")} style={{ width: "100%", height: "100%", opacity: 0.92 }} />
    </div>
  );
};

/** the svg filters and gradients the marks share */
export const HookX1MarkDefs: React.FC = () => (
  <defs>
    <filter id="hx1m-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={6} /></filter>
    <filter id="hx1m-softgold" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={10} /></filter>
    <filter id="hx1m-mote" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation={1.4} /></filter>
    <radialGradient id="hx1m-bead">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
      <stop offset="0.35" stopColor="#FFFFFF" stopOpacity="0.4" />
      <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="hx1m-goldbead">
      <stop offset="0" stopColor="#FFF1C9" stopOpacity="1" />
      <stop offset="0.4" stopColor={GOLD} stopOpacity="0.6" />
      <stop offset="1" stopColor={GOLD} stopOpacity="0" />
    </radialGradient>
  </defs>
);
