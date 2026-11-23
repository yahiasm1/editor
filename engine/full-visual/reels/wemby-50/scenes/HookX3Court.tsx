// The real NBA half court at true geometry (NBA rules, plan.md), seen through HookX3's camera: 50 x 47 ft plus a
// 2.4 ft apron, honey maple strips 2.25 in wide with staggered end joints (the same seeded random as `answer`), the
// lane in Spurs black with its silver edge, white 2 in lines drawn as ribbons on the floor so they foreshorten with
// it. Straight overhead it is `answer`'s court; HookX3CourtFlat is that court drawn flat, pixel for pixel, for the
// hand-off, with his 29 marks in Basketball-Reference's glyphs.
import React, { useMemo } from "react";
import {
  HX3_APRON, HX3_PPF, HX3_RIM_Y, HX3_SHOTS, hx3Project, type HookX3Cam, type HookX3V,
} from "./HookX3World";

const LINE = 1 / 6;
const BOARD = 0.1875;
const WHITE = "#F4F6F8";

const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

type Board = { x: number; c: string; joints: number[] };
const BOARDS: Board[] = (() => {
  const out: Board[] = [];
  const n = Math.ceil(50 / BOARD);
  for (let i = 0; i < n; i++) {
    const x = -25 + i * BOARD;
    const t = rnd(i);
    const l = 70 + t * 9;
    const c = `hsl(${34 + rnd(i + 900) * 5}, ${52 + rnd(i + 400) * 12}%, ${l}%)`;
    const joints: number[] = [];
    let y = -rnd(i + 77) * 6;
    let k = 0;
    while (y < 47) {
      y += 2 + rnd(i * 13 + k) * 6;
      k++;
      if (y > 0 && y < 47) joints.push(y);
    }
    out.push({ x, c, joints });
  }
  return out;
})();

// the same maple averaged four strips at a time, for a floor seen small and turned
const PLANKS: { x: number; w: number; c: string }[] = (() => {
  const out: { x: number; w: number; c: string }[] = [];
  for (let i = 0; i < BOARDS.length; i += 4) {
    const g = BOARDS.slice(i, i + 4);
    let l = 0;
    g.forEach((_, k) => (l += 70 + rnd(i + k) * 9));
    l /= g.length;
    out.push({ x: g[0].x, w: BOARD * g.length, c: `hsl(${34 + rnd(i + 900) * 3 + 1}, ${58 + rnd(i + 400) * 6}%, ${(l - 0.8).toFixed(1)}%)` });
  }
  return out;
})();

const CORNER_Y = HX3_RIM_Y + Math.sqrt(23.75 * 23.75 - 22 * 22);
const A3 = Math.atan2(CORNER_Y - HX3_RIM_Y, 22);

const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number, n = 48): [number, number][] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

// every painted line as a polyline on the floor, in feet (baseline at y 0)
const LINES: [number, number][][] = (() => {
  const L: [number, number][][] = [];
  const h = LINE / 2;
  L.push([[-25 + h, h], [25 - h, h]]); // baseline
  L.push([[-25 + h, h], [-25 + h, 47]]);
  L.push([[25 - h, h], [25 - h, 47]]);
  L.push([[-25 + h, 47 - h / 2], [25 - h, 47 - h / 2]]); // half court line, half of it inside the half
  L.push([[-8, 0], [-8, 19], [8, 19], [8, 0]]); // lane
  L.push(arcPts(0, 19, 6, 0, Math.PI)); // free throw circle, solid toward half court
  // the dashed half inside the lane, 1.25 ft dashes
  const dashC = 6 * Math.PI;
  for (let s = 0; s < dashC; s += 2.35) {
    const a0 = Math.PI + s / 6;
    const a1 = Math.PI + Math.min(dashC, s + 1.25) / 6;
    L.push(arcPts(0, 19, 6, a0, a1, 4));
  }
  L.push([[-4, 4], [-4, HX3_RIM_Y], ...arcPts(0, HX3_RIM_Y, 4, Math.PI, 0, 32).slice(1), [4, 4]]); // restricted area
  L.push([[-22, 0], [-22, CORNER_Y]]);
  L.push([[22, 0], [22, CORNER_Y]]);
  L.push(arcPts(0, HX3_RIM_Y, 23.75, Math.PI - A3, A3, 80)); // three point arc
  L.push(arcPts(0, 47, 6, Math.PI, 2 * Math.PI, 40));
  L.push(arcPts(0, 47, 2, Math.PI, 2 * Math.PI, 20));
  return L;
})();
// small painted rects: block, hashes, coaching box marks, in feet [x, y, w, h]
const MARKS: [number, number, number, number, number][] = [];
[-1, 1].forEach((s) => {
  MARKS.push([s < 0 ? -8.67 : 8, 7, 0.67, 1, 1]);
  [11, 14, 17].forEach((y) => MARKS.push([s < 0 ? -8.67 : 8, y, 0.67, LINE, 1]));
  MARKS.push([s < 0 ? -28 : 25, 28, 3, LINE, 0.9]);
});

const fmt = (v: number) => v.toFixed(1);

export type HookX3CourtLook = { dim: number; sweep: number; forceFine?: boolean };

/** the court through the camera, as vector polygons (crisp at any distance) */
export const HookX3CourtProjected: React.FC<{ cam: HookX3Cam; look: HookX3CourtLook }> = ({ cam, look }) => {
  const P = (x: number, y: number) => {
    const p = hx3Project(cam, [x, y, 0]);
    return `${fmt(p.x)},${fmt(p.y)}`;
  };
  const quad = (x0: number, y0: number, x1: number, y1: number) => `${P(x0, y0)} ${P(x1, y0)} ${P(x1, y1)} ${P(x0, y1)}`;
  // ribbons: offset each polyline half a line width to both sides on the floor
  const ribbon = (pts: [number, number][]) => {
    const l: string[] = [];
    const r: string[] = [];
    const h = LINE / 2;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(pts.length - 1, i + 1)];
      let dx = b[0] - a[0];
      let dy = b[1] - a[1];
      const len = Math.hypot(dx, dy) || 1;
      dx /= len;
      dy /= len;
      l.push(P(pts[i][0] - dy * h, pts[i][1] + dx * h));
      r.unshift(P(pts[i][0] + dy * h, pts[i][1] - dx * h));
    }
    return [...l, ...r].join(" ");
  };
  const a = HX3_APRON;
  const ppf = (p0: HookX3V) => {
    const q0 = hx3Project(cam, p0);
    const q1 = hx3Project(cam, [p0[0] + 1, p0[1], 0]);
    return Math.hypot(q1.x - q0.x, q1.y - q0.y);
  };
  // the pool and the sheen, as `answer` paints them, carried into screen space
  const pool = hx3Project(cam, [0, 18, 0]);
  const poolR = 42 * ppf([0, 18, 0]);
  const s0 = hx3Project(cam, [look.sweep, 0, 0]);
  const s1 = hx3Project(cam, [look.sweep + 26, 30, 0]);
  const l0 = hx3Project(cam, [0, 0, 0]);
  const l1 = hx3Project(cam, [0, 19, 0]);
  // the slab's shadow on the navy: the apron outline pushed down a little and blurred
  const sh = (x: number, y: number) => {
    const p = hx3Project(cam, [x, y, 0]);
    const k = ppf([x, y, 0]);
    return `${fmt(p.x)},${fmt(p.y + k * 1.6)}`;
  };
  const court = `${P(-25, 0)} ${P(25, 0)} ${P(25, 47)} ${P(-25, 47)}`;
  // strips thinner than ~4 px alias into bands when the floor is turned: draw them as wider planks there
  const stripPx = BOARD * ppf([0, 23.5, 0]);
  const fine = look.forceFine ? 1 : Math.max(0, Math.min(1, (stripPx - 3.2) / 1.6));
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <radialGradient id="hx3-pool" gradientUnits="userSpaceOnUse" cx={pool.x} cy={pool.y} r={poolR}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.10" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </radialGradient>
        <linearGradient id="hx3-sheen" gradientUnits="userSpaceOnUse" x1={s0.x} y1={s0.y} x2={s1.x} y2={s1.y}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hx3-lane" gradientUnits="userSpaceOnUse" x1={l0.x} y1={l0.y} x2={l1.x} y2={l1.y}>
          <stop offset="0" stopColor="#0A0B0D" />
          <stop offset="1" stopColor="#16181C" />
        </linearGradient>
        <filter id="hx3-slabshadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={Math.max(3, ppf([0, 23, 0]) * 2.4)} />
        </filter>
      </defs>
      <polygon points={`${sh(-25 - a, -a)} ${sh(25 + a, -a)} ${sh(25 + a, 47 + a)} ${sh(-25 - a, 47 + a)}`} fill="rgba(0,0,0,0.55)" filter="url(#hx3-slabshadow)" />
      <polygon points={quad(-25 - a, -a, 25 + a, 47 + a)} fill="#0E1013" stroke="#30363D" strokeWidth={1} />
      {fine < 1 && <polygon points={quad(-25, 0, 25, 47)} fill="#DDBB8A" />}
      {fine < 1 && (
        <g opacity={1 - fine}>
          {PLANKS.map((b, i) => (
            <polygon key={i} points={quad(b.x, 0, b.x + b.w + 0.004, 47)} fill={b.c} />
          ))}
        </g>
      )}
      {fine > 0 && (
        <g opacity={fine < 1 ? fine : undefined}>
          {BOARDS.map((b, i) => (
            <polygon key={i} points={quad(b.x, 0, b.x + BOARD + 0.004, 47)} fill={b.c} />
          ))}
          <g fill="rgba(70,40,10,0.35)">
            {BOARDS.map((b, i) => b.joints.map((y, j) => <polygon key={`${i}-${j}`} points={quad(b.x, y, b.x + BOARD, y + 0.03)} />))}
          </g>
        </g>
      )}
      <polygon points={court} fill="url(#hx3-pool)" />
      <polygon points={quad(-8, 0, 8, 19)} fill="url(#hx3-lane)" />
      <polygon points={ribbonRect(P, -7.55, 0, 7.55, 18.55, 0.06)} fill="#C4CED4" opacity={0.85} fillRule="evenodd" />
      <polygon points={court} fill="url(#hx3-sheen)" />
      <g fill={WHITE}>
        {LINES.map((pts, i) => (
          <polygon key={i} points={ribbon(pts)} />
        ))}
        {MARKS.map(([x, y, w, h, o], i) => (
          <polygon key={`m${i}`} points={quad(x, y, x + w, y + h)} opacity={o} />
        ))}
      </g>
      <polygon points={quad(-3, 3.8, 3, 4.12)} fill="#E6EBEF" />
      <polygon points={quad(-0.16, 4.1, 0.16, 4.55)} fill="#9AA3AB" />
      <polygon points={ribbonRing(P, 0, HX3_RIM_Y, 0.75, 0.1)} fill="#E2582A" fillRule="evenodd" />
      {look.dim > 0 && <polygon points={quad(-25 - a, -a, 25 + a, 47 + a)} fill="#05070A" opacity={look.dim} />}
    </svg>
  );
};

// a rectangle outline as one even-odd polygon pair (outer then inner), for the lane's silver edge
function ribbonRect(P: (x: number, y: number) => string, x0: number, y0: number, x1: number, y1: number, h: number) {
  const o = [P(x0 - h, y0), P(x1 + h, y0), P(x1 + h, y1 + h), P(x0 - h, y1 + h)];
  const i = [P(x0 + h, y0), P(x0 + h, y1 - h), P(x1 - h, y1 - h), P(x1 - h, y0)];
  return [...o, ...i].join(" ");
}
function ribbonRing(P: (x: number, y: number) => string, cx: number, cy: number, r: number, h: number) {
  const o: string[] = [];
  const i: string[] = [];
  for (let k = 0; k <= 32; k++) {
    const a = (k / 32) * Math.PI * 2;
    o.push(P(cx + (r + h) * Math.cos(a), cy + (r + h) * Math.sin(a)));
    i.unshift(P(cx + (r - h) * Math.cos(a), cy + (r - h) * Math.sin(a)));
  }
  return [...o, ...i].join(" ");
}

// ---------------- `answer`'s court, drawn flat: the hand-off picture ----------------

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
  const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  return `M${p0[0].toFixed(3)} ${p0[1].toFixed(3)} A${r} ${r} 0 ${large} ${a1 > a0 ? 1 : 0} ${p1[0].toFixed(3)} ${p1[1].toFixed(3)}`;
};

const HookX3FlatBoards: React.FC = () => {
  const els = useMemo(() => {
    const out: React.ReactNode[] = [];
    BOARDS.forEach((b, i) => {
      out.push(<rect key={`b${i}`} x={b.x} y={0} width={BOARD + 0.004} height={47} fill={b.c} />);
      b.joints.forEach((y, k) => out.push(<rect key={`j${i}-${k}`} x={b.x} y={y} width={BOARD} height={0.03} fill="rgba(70,40,10,0.35)" />));
    });
    return out;
  }, []);
  return <g>{els}</g>;
};

/** his 29 marks: lit 0..1 each (a white dot for a make, a grey x for a miss, Basketball-Reference's glyphs) */
export type HookX3MarkState = { lit: number };

export const HookX3Glyphs: React.FC<{ marks: HookX3MarkState[]; ppf: number }> = ({ marks, ppf }) => {
  const mr = Math.max(0.62, 5.6 / ppf);
  const sw = Math.max(0.14, 1.1 / ppf);
  return (
    <>
      {HX3_SHOTS.map((s, i) => {
        const m = marks[i];
        if (!m || m.lit <= 0) return null;
        const cx = s.x;
        const cy = HX3_RIM_Y + s.y;
        const lit = 1;
        return (
          <g key={i} opacity={m.lit < 1 ? m.lit : undefined}>
            {s.made ? (
              <circle cx={cx} cy={cy} r={mr} fill="#FFFFFF" fillOpacity={lit} stroke="#0D1117" strokeOpacity={1} strokeWidth={sw} />
            ) : (
              <g stroke="#2B3038" strokeWidth={sw * 1.9} strokeLinecap="round" opacity={1}>
                <path d={`M${cx - mr * 0.85} ${cy - mr * 0.85} L${cx + mr * 0.85} ${cy + mr * 0.85} M${cx + mr * 0.85} ${cy - mr * 0.85} L${cx - mr * 0.85} ${cy + mr * 0.85}`} stroke="#F4F6F8" strokeWidth={sw * 3.2} strokeOpacity={0.35} />
                <path d={`M${cx - mr * 0.85} ${cy - mr * 0.85} L${cx + mr * 0.85} ${cy + mr * 0.85} M${cx + mr * 0.85} ${cy - mr * 0.85} L${cx - mr * 0.85} ${cy + mr * 0.85}`} />
              </g>
            )}
          </g>
        );
      })}
    </>
  );
};

/** `answer`'s first-frame court (PlayByPlayLogCourt at x 160 / y 700 / w 760), with the marks as given */
export const HookX3CourtFlat: React.FC<{ f: number; marks: HookX3MarkState[]; opacity?: number }> = ({ f, marks, opacity = 1 }) => {
  const ppf = HX3_PPF;
  const APRON = HX3_APRON;
  const vw = 50 + APRON * 2;
  const vh = 47 + APRON * 2;
  const W = vw * ppf;
  const H = vh * ppf;
  const sweep = -40 + ((f * 0.22) % 130);
  return (
    <div
      style={{
        position: "absolute", left: 160 - APRON * ppf, top: 700 - APRON * ppf, width: W, height: H, opacity,
        borderRadius: Math.max(4, ppf * 0.6), boxShadow: `0 ${(ppf * 1.6).toFixed(1)}px ${(ppf * 4).toFixed(1)}px rgba(0,0,0,0.55), 0 0 0 1px #30363D`,
        overflow: "hidden",
      }}
    >
      <svg width={W} height={H} viewBox={`${-25 - APRON} ${-APRON} ${vw} ${vh}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id="hx3f-sheen" gradientUnits="userSpaceOnUse" x1={sweep} y1={0} x2={sweep + 26} y2={30}>
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hx3f-pool" cx="0" cy="18" r="42" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="0.10" />
            <stop offset="1" stopColor="#000" stopOpacity="0.22" />
          </radialGradient>
          <linearGradient id="hx3f-lane" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0A0B0D" />
            <stop offset="1" stopColor="#16181C" />
          </linearGradient>
        </defs>
        <rect x={-25 - APRON} y={-APRON} width={vw} height={vh} fill="#0E1013" />
        <HookX3FlatBoards />
        <rect x={-25} y={0} width={50} height={47} fill="url(#hx3f-pool)" />
        <rect x={-8} y={0} width={16} height={19} fill="url(#hx3f-lane)" />
        <rect x={-7.55} y={0} width={15.1} height={18.55} fill="none" stroke="#C4CED4" strokeWidth={0.12} opacity={0.85} />
        <rect x={-25} y={0} width={50} height={47} fill="url(#hx3f-sheen)" />
        <g fill="none" stroke={WHITE} strokeWidth={LINE}>
          <rect x={-25 + LINE / 2} y={LINE / 2} width={50 - LINE} height={47 - LINE / 2} />
          <rect x={-8} y={0} width={16} height={19} />
          <path d={arc(0, 19, 6, 0, Math.PI)} />
          <path d={arc(0, 19, 6, Math.PI, 2 * Math.PI)} strokeDasharray="1.25 1.1" />
          <path d={`M-4 4 L-4 ${HX3_RIM_Y} ${arc(0, HX3_RIM_Y, 4, Math.PI, 0).replace("M", "L")} L4 4`} />
          <path d={`M-22 0 L-22 ${CORNER_Y.toFixed(3)}`} />
          <path d={`M22 0 L22 ${CORNER_Y.toFixed(3)}`} />
          <path d={arc(0, HX3_RIM_Y, 23.75, Math.PI - A3, A3)} />
          <path d={arc(0, 47, 6, Math.PI, 2 * Math.PI)} />
          <path d={arc(0, 47, 2, Math.PI, 2 * Math.PI)} />
        </g>
        <g fill={WHITE}>
          {[-1, 1].map((s) => (
            <React.Fragment key={s}>
              <rect x={s < 0 ? -8.67 : 8} y={7} width={0.67} height={1} />
              {[11, 14, 17].map((y) => (
                <rect key={y} x={s < 0 ? -8.67 : 8} y={y} width={0.67} height={LINE} />
              ))}
              <rect x={s < 0 ? -25 - 3 : 25} y={28} width={3} height={LINE} opacity={0.9} />
            </React.Fragment>
          ))}
        </g>
        <rect x={-3} y={3.8} width={6} height={0.32} fill="#E6EBEF" />
        <rect x={-0.16} y={4.1} width={0.32} height={0.45} fill="#9AA3AB" />
        <circle cx={0} cy={HX3_RIM_Y} r={0.75} fill="none" stroke="#E2582A" strokeWidth={0.2} />
        <HookX3Glyphs marks={marks} ppf={ppf} />
      </svg>
    </div>
  );
};

/** the same glyphs through the camera, while it is still turning overhead */
export const HookX3GlyphsProjected: React.FC<{ cam: HookX3Cam; marks: HookX3MarkState[] }> = ({ cam, marks }) => {
  const mr = 0.62;
  const sw = 0.14;
  const P = (x: number, y: number) => {
    const p = hx3Project(cam, [x, y, 0]);
    return `${fmt(p.x)},${fmt(p.y)}`;
  };
  const circle = (cx: number, cy: number, r: number) =>
    Array.from({ length: 24 }, (_, k) => P(cx + r * Math.cos((k / 24) * Math.PI * 2), cy + r * Math.sin((k / 24) * Math.PI * 2))).join(" ");
  const bar = (x0: number, y0: number, x1: number, y1: number, w: number) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const l = Math.hypot(dx, dy);
    const nx = (-dy / l) * (w / 2);
    const ny = (dx / l) * (w / 2);
    const ex = (dx / l) * (w / 2);
    const ey = (dy / l) * (w / 2);
    return `${P(x0 + nx - ex, y0 + ny - ey)} ${P(x1 + nx + ex, y1 + ny + ey)} ${P(x1 - nx + ex, y1 - ny + ey)} ${P(x0 - nx - ex, y0 - ny - ey)}`;
  };
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      {HX3_SHOTS.map((s, i) => {
        const m = marks[i];
        if (!m || m.lit <= 0) return null;
        const cx = s.x;
        const cy = HX3_RIM_Y + s.y;
        const k = mr * 0.85;
        return (
          <g key={i} opacity={m.lit}>
            {s.made ? (
              <>
                <polygon points={circle(cx, cy, mr + sw / 2)} fill="#0D1117" />
                <polygon points={circle(cx, cy, mr - sw / 2)} fill="#FFFFFF" />
              </>
            ) : (
              <>
                <g fill="#F4F6F8" opacity={0.35}>
                  <polygon points={bar(cx - k, cy - k, cx + k, cy + k, sw * 3.2)} />
                  <polygon points={bar(cx + k, cy - k, cx - k, cy + k, sw * 3.2)} />
                </g>
                <g fill="#2B3038">
                  <polygon points={bar(cx - k, cy - k, cx + k, cy + k, sw * 1.9)} />
                  <polygon points={bar(cx + k, cy - k, cx - k, cy + k, sw * 1.9)} />
                </g>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};
