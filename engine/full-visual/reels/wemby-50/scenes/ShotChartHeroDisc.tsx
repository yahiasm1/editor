// The reel's chance, as a solid: a flat gold disc 1.6 ft across and 0.19 ft thick (or a wedge of one), drawn through
// any map from its own local feet (u, v in its plane, w up its axis) to the screen. The same solid is drawn through
// the court's camera, through the column's view, and through a blend of the two while it flies, so it never swaps
// for a copy. Points fill it with white: a level inside it, seen on its edge when it lies flat and across its face
// when it stands up.
import React from "react";
import { SCH_H, SCH_R } from "./ShotChartHeroWorld";

export type ShotChartHeroMap = (u: number, v: number, w: number) => [number, number];

export type ShotChartHeroPiece = {
  a0: number;
  a1: number;
  o: number;
  fill?: number; // 0..1 of the disc's depth (2 points = 1)
  level?: number; // 0..1: how much the fill reads as a level across the face (the disc stood up)
  glow?: number;
  seam?: number; // the white of a fusing seam on the cut faces
  grey?: number; // 0: his points (cream white), 1: the league's points (grey)
  top?: number; // 0..1: his white poured on top of the grey fill, up to this level
  topGlow?: number;
};

const CREAM0 = "#F7F1E4";
const CREAM_D0 = "#D9CFBC";
const GREY = "#A9B1BB";
const GREY_D = "#7D858F";
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixHex = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  return `rgb(${A.map((x, i) => Math.round(x + (B[i] - x) * t)).join(",")})`;
};

const area = (p: [number, number][]) => {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i];
    const b = p[(i + 1) % p.length];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return s / 2;
};
const path = (p: [number, number][]) => p.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join("") + "Z";

export const ShotChartHeroDisc: React.FC<{ map: ShotChartHeroMap; p: ShotChartHeroPiece; id: string; detail?: number }> = ({ map, p, id, detail = 1 }) => {
  if (p.o <= 0.001 || p.a1 - p.a0 < 0.01) return null;
  const g = Math.max(0, Math.min(1, p.grey ?? 0));
  const CREAM = g ? mixHex(CREAM0, GREY, g) : CREAM0;
  const CREAM_D = g ? mixHex(CREAM_D0, GREY_D, g) : CREAM_D0;
  const span = p.a1 - p.a0;
  const full = span >= Math.PI * 2 - 1e-3;
  const n = Math.max(6, Math.ceil((span / (Math.PI * 2)) * 56 * detail));
  const ang = Array.from({ length: n + 1 }, (_, i) => p.a0 + (span * i) / n);
  const P = (r: number, a: number, w: number) => map(r * Math.cos(a), r * Math.sin(a), w);
  const fill = Math.max(0, Math.min(1, p.fill ?? 0));
  const wl = SCH_H * fill;
  const top = Math.max(fill, Math.min(1, p.top ?? 0));
  const wt = SCH_H * top;
  const wMax = Math.max(wl, wt);

  const topRing = ang.map((a) => P(SCH_R, a, SCH_H));
  const topPoly = full ? topRing.slice(0, n) : [P(0, 0, SCH_H), ...topRing];
  const sTop = Math.sign(area(topPoly)) || 1;
  const vis = (q: [number, number][]) => Math.sign(area(q)) === sTop;

  // bounds of the disc on screen, for the light
  let minx = Infinity;
  let maxx = -Infinity;
  let miny = Infinity;
  let maxy = -Infinity;
  for (const q of topRing) {
    minx = Math.min(minx, q[0]);
    maxx = Math.max(maxx, q[0]);
    miny = Math.min(miny, q[1]);
    maxy = Math.max(maxy, q[1]);
  }
  const W = Math.max(1, maxx - minx);
  const sw = Math.max(0.6, W * 0.012);

  const faces: React.ReactNode[] = [];
  // the two cut faces of a wedge
  if (!full) {
    const cuts: { q: (w0: number, w1: number) => [number, number][] }[] = [
      { q: (w0, w1) => [P(0, 0, w0), P(SCH_R, p.a0, w0), P(SCH_R, p.a0, w1), P(0, 0, w1)] },
      { q: (w0, w1) => [P(SCH_R, p.a1, w0), P(0, 0, w0), P(0, 0, w1), P(SCH_R, p.a1, w1)] },
    ];
    cuts.forEach((c, i) => {
      const whole = c.q(0, SCH_H);
      if (!vis(whole)) return;
      faces.push(<path key={`c${i}`} d={path(whole)} fill="#E8AE48" stroke="#E8AE48" strokeWidth={sw} strokeLinejoin="round" />);
      if (wl > 0.001) faces.push(<path key={`cl${i}`} d={path(c.q(0, wl))} fill={CREAM_D} />);
      if ((p.seam ?? 0) > 0) faces.push(<path key={`cs${i}`} d={path(whole)} fill="#FFF6DC" opacity={p.seam} />);
    });
  }
  // the outer edge, lit from the left, the fill showing as a level on it
  const side: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const b0 = P(SCH_R, ang[i], 0);
    const b1 = P(SCH_R, ang[i + 1], 0);
    const t0 = topRing[i];
    const t1 = topRing[i + 1];
    const q: [number, number][] = [b0, b1, t1, t0];
    if (!vis(q)) continue;
    const mx = (b0[0] + b1[0]) / 2;
    const k = Math.max(0, Math.min(1, 1 - (mx - minx) / W));
    const lit = 0.25 + 0.75 * Math.pow(k, 0.8);
    const gold = `hsl(${(36 + 4 * lit).toFixed(1)}, ${(62 + 14 * lit).toFixed(1)}%, ${(24 + 30 * lit).toFixed(1)}%)`;
    // above the white the disc is empty: a darker amber, so every disc shows its level as a stripe
    const empty = wMax > 0.001 && (p.level ?? 0) < 0.5 ? `hsl(${(34 + 4 * lit).toFixed(1)}, 58%, ${(16 + 18 * lit).toFixed(1)}%)` : gold;
    side.push(<path key={`s${i}`} d={path(q)} fill={empty} stroke={empty} strokeWidth={sw} strokeLinejoin="round" />);
    if (wl > 0.001) {
      const l0 = P(SCH_R, ang[i], wl);
      const l1 = P(SCH_R, ang[i + 1], wl);
      const cream = `hsl(${(40 + 172 * g).toFixed(0)}, ${((22 + 10 * lit) * (1 - g) + 9 * g).toFixed(1)}%, ${((70 + 25 * lit) * (1 - g) + (52 + 24 * lit) * g).toFixed(1)}%)`;
      side.push(<path key={`l${i}`} d={path([b0, b1, l1, l0])} fill={cream} stroke={cream} strokeWidth={sw * 0.6} strokeLinejoin="round" opacity={1 - Math.max(0, Math.min(1, p.level ?? 0))} />);
    }
    if (wt > wl + 0.0005) {
      const l0 = P(SCH_R, ang[i], wl);
      const l1 = P(SCH_R, ang[i + 1], wl);
      const h0 = P(SCH_R, ang[i], wt);
      const h1 = P(SCH_R, ang[i + 1], wt);
      const wh = `hsl(42, ${(30 + 12 * lit).toFixed(1)}%, ${(84 + 14 * lit).toFixed(1)}%)`;
      side.push(<path key={`w${i}`} d={path([l0, l1, h1, h0])} fill={wh} stroke={wh} strokeWidth={sw * 0.6} strokeLinejoin="round" />);
    }
  }
  // the meniscus: a bright line where the white meets the gold on the edge
  let men: string | null = null;
  if (wMax > 0.001 && Math.max(fill, top) < 0.995) {
    const pts = ang.map((a) => P(SCH_R, a, wMax));
    const keep: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const q: [number, number][] = [P(SCH_R, ang[i], 0), P(SCH_R, ang[i + 1], 0), topRing[i + 1], topRing[i]];
      if (vis(q)) {
        if (!keep.length) keep.push(pts[i]);
        keep.push(pts[i + 1]);
      }
    }
    if (keep.length > 1) men = keep.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join("");
  }

  const topD = path(topPoly);
  const lvl = Math.max(0, Math.min(1, p.level ?? 0));
  // inside seen from above: the white under the gold lid, inset from the rim
  const inner = full ? ang.slice(0, n).map((a) => P(SCH_R * 0.8, a, SCH_H)) : [P(0, 0, SCH_H), ...ang.map((a) => P(SCH_R * 0.8, a, SCH_H))];
  // level across the face when it stands: the white below a horizontal line at the fill height of the face
  const levelY = maxy - (maxy - miny) * fill;
  return (
    <g opacity={p.o}>
      <defs>
        <linearGradient id={`${id}-t`} gradientUnits="userSpaceOnUse" x1={minx} y1={miny} x2={maxx} y2={maxy}>
          <stop offset="0" stopColor="#FFD883" />
          <stop offset="0.45" stopColor="#F2B33D" />
          <stop offset="1" stopColor="#B9801F" />
        </linearGradient>
        {lvl > 0 && (
          <clipPath id={`${id}-c`}>
            <path d={topD} />
          </clipPath>
        )}
      </defs>
      {faces}
      {side}
      {men && <path d={men} fill="none" stroke="#FFFFFF" strokeWidth={Math.max(0.8, W * 0.01)} strokeOpacity={0.9 * (1 - lvl)} />}
      <path d={topD} fill={`url(#${id}-t)`} />
      {fill > 0 && lvl < 1 && <path d={path(inner)} fill={CREAM} opacity={(1 - lvl) * Math.min(1, fill * (1.15 + 0.6 * g))} />}
      {top > fill + 0.002 && <path d={path(inner)} fill="#FFFBF2" opacity={Math.min(1, (top - fill) * 8)} />}
      {(p.topGlow ?? 0) > 0 && <path d={topD} fill="#FFFFFF" opacity={0.6 * (p.topGlow ?? 0)} />}
      {fill > 0 && lvl > 0 && (
        <g clipPath={`url(#${id}-c)`} opacity={lvl}>
          <rect x={minx - 4} y={levelY} width={W + 8} height={maxy - levelY + 4} fill={CREAM} />
          <rect x={minx - 4} y={levelY} width={W + 8} height={Math.max(2, (maxy - miny) * 0.012)} fill="#FFFFFF" />
          <rect x={minx - 4} y={levelY + (maxy - miny) * 0.012} width={W + 8} height={(maxy - miny) * 0.06} fill="#E9DFCB" opacity={0.6} />
        </g>
      )}
      <path d={topD} fill="none" stroke="#9E6C16" strokeWidth={Math.max(0.8, W * 0.018)} strokeLinejoin="round" />
      {full && <path d={path(ang.slice(0, n).map((a) => P(SCH_R * 0.93, a, SCH_H)))} fill="none" stroke="#FFE2A0" strokeOpacity={0.35} strokeWidth={Math.max(0.6, W * 0.008)} />}
      {(p.glow ?? 0) > 0 && <path d={topD} fill="#FFF4D6" opacity={0.45 * (p.glow ?? 0)} />}
    </g>
  );
};
