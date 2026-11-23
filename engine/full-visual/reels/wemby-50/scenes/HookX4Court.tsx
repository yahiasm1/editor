// HookX4: the same court as `answer` (PlayByPlayLogCourt geometry and look, copied so the hand-off is exact).
// The real NBA half court, top-down at true geometry, drawn in feet (NBA rules, plan.md): 50 x 47 ft, baseline on
// top as on Basketball-Reference's chart, rim centre 5.25 ft from the baseline. Maple boards running baseline to
// half court (2.25 in each, tinted one by one, with staggered end joints), a satin sheen the arena light slides
// across, white 2 in lines, the lane in Spurs black with a silver edge. His 29 shots sit at their real spots
// (wemby-shots-court.json) in BBR's own glyphs: a filled dot for a make, an x for a miss.
import React, { useMemo } from "react";
import { HOOKX4_SHOTS } from "./HookX4Data";

export type HookX4Mark = { lit: number; ping: number; glint?: number; scale?: number };
export type HookX4Rect = { x: number; y: number; w: number };

const APRON = 2.4; // ft of dark apron drawn round the floor, so the court sits as a slab on the navy
const RIM_Y = 5.25;
const LINE = 1 / 6; // 2 in lines
const BOARD = 0.1875; // 2.25 in maple strips

// a seeded random, so every frame draws the same boards
const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const HookX4Boards: React.FC = () => {
  const boards = useMemo(() => {
    const out: React.ReactNode[] = [];
    const n = Math.ceil(50 / BOARD);
    for (let i = 0; i < n; i++) {
      const x = -25 + i * BOARD;
      const t = rnd(i);
      // honey maple, each strip a slightly different cut of the tree
      const l = 70 + t * 9;
      const c = `hsl(${34 + rnd(i + 900) * 5}, ${52 + rnd(i + 400) * 12}%, ${l}%)`;
      out.push(<rect key={`b${i}`} x={x} y={0} width={BOARD + 0.004} height={47} fill={c} />);
      // end joints: strips are 2 to 8 ft long, butted end to end, staggered between neighbours
      let y = -rnd(i + 77) * 6;
      let k = 0;
      while (y < 47) {
        y += 2 + rnd(i * 13 + k) * 6;
        k++;
        if (y > 0 && y < 47) out.push(<rect key={`j${i}-${k}`} x={x} y={y} width={BOARD} height={0.03} fill="rgba(70,40,10,0.35)" />);
      }
    }
    return out;
  }, []);
  return <g>{boards}</g>;
};

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
  const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  return `M${p0[0].toFixed(3)} ${p0[1].toFixed(3)} A${r} ${r} 0 ${large} ${a1 > a0 ? 1 : 0} ${p1[0].toFixed(3)} ${p1[1].toFixed(3)}`;
};

export const HookX4Court: React.FC<{ r: HookX4Rect; marks: HookX4Mark[]; f: number; opacity?: number; style?: React.CSSProperties }> = ({ r, marks, f, opacity = 1, style }) => {
  const ppf = r.w / 50; // px per foot
  const vw = 50 + APRON * 2;
  const vh = 47 + APRON * 2;
  const W = vw * ppf;
  const H = vh * ppf;
  // marks keep a readable size when the court is small
  const mr = Math.max(0.62, 5.6 / ppf);
  const cornerY = RIM_Y + Math.sqrt(23.75 * 23.75 - 22 * 22);
  const a3 = Math.atan2(cornerY - RIM_Y, 22);
  // the light sweep: a soft band of arena light sliding slowly along the boards
  const sweep = -40 + ((f * 0.22) % 130);
  const white = "#F4F6F8";
  return (
    <div
      style={{
        position: "absolute", left: r.x - APRON * ppf, top: r.y - APRON * ppf, width: W, height: H, opacity,
        borderRadius: Math.max(4, ppf * 0.6), boxShadow: `0 ${(ppf * 1.6).toFixed(1)}px ${(ppf * 4).toFixed(1)}px rgba(0,0,0,0.55), 0 0 0 1px #30363D`,
        overflow: "hidden",
        ...style,
      }}
    >
      <svg width={W} height={H} viewBox={`${-25 - APRON} ${-APRON} ${vw} ${vh}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id="hk4-sheen" gradientUnits="userSpaceOnUse" x1={sweep} y1={0} x2={sweep + 26} y2={30}>
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hk4-pool" cx="0" cy="18" r="42" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="0.10" />
            <stop offset="1" stopColor="#000" stopOpacity="0.22" />
          </radialGradient>
          <linearGradient id="hk4-lane" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0A0B0D" />
            <stop offset="1" stopColor="#16181C" />
          </linearGradient>
        </defs>
        {/* apron: the out-of-bounds paint, Spurs black */}
        <rect x={-25 - APRON} y={-APRON} width={vw} height={vh} fill="#0E1013" />
        <HookX4Boards />
        <rect x={-25} y={0} width={50} height={47} fill="url(#hk4-pool)" />
        {/* the lane, painted, with its silver inner edge */}
        <rect x={-8} y={0} width={16} height={19} fill="url(#hk4-lane)" />
        <rect x={-7.55} y={0} width={15.1} height={18.55} fill="none" stroke="#C4CED4" strokeWidth={0.12} opacity={0.85} />
        <rect x={-25} y={0} width={50} height={47} fill="url(#hk4-sheen)" />
        <g fill="none" stroke={white} strokeWidth={LINE}>
          {/* boundary and half court line */}
          <rect x={-25 + LINE / 2} y={LINE / 2} width={50 - LINE} height={47 - LINE / 2} />
          {/* lane */}
          <rect x={-8} y={0} width={16} height={19} />
          {/* free throw circle: solid toward half court, dashed inside the lane, as painted */}
          <path d={arc(0, 19, 6, 0, Math.PI)} />
          <path d={arc(0, 19, 6, Math.PI, 2 * Math.PI)} strokeDasharray="1.25 1.1" />
          {/* restricted area: 4 ft arc round the rim, straight down to the backboard */}
          <path d={`M-4 4 L-4 ${RIM_Y} ${arc(0, RIM_Y, 4, Math.PI, 0).replace("M", "L")} L4 4`} />
          {/* three point line: 22 ft corners, 23.75 ft arc */}
          <path d={`M-22 0 L-22 ${cornerY.toFixed(3)}`} />
          <path d={`M22 0 L22 ${cornerY.toFixed(3)}`} />
          <path d={arc(0, RIM_Y, 23.75, Math.PI - a3, a3)} />
          {/* centre circle at half court, outer 6 ft and inner 2 ft */}
          <path d={arc(0, 47, 6, Math.PI, 2 * Math.PI)} />
          <path d={arc(0, 47, 2, Math.PI, 2 * Math.PI)} />
        </g>
        {/* lane marks: the block, then hashes every 3 ft */}
        <g fill={white}>
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
        {/* backboard, its bracket and the rim */}
        <rect x={-3} y={3.8} width={6} height={0.32} fill="#E6EBEF" />
        <rect x={-0.16} y={4.1} width={0.32} height={0.45} fill="#9AA3AB" />
        <circle cx={0} cy={RIM_Y} r={0.75} fill="none" stroke="#E2582A" strokeWidth={0.2} />
        {/* his 29 shots */}
        {HOOKX4_SHOTS.map((s, i) => {
          const m = marks[i] ?? { lit: 1, ping: -1 };
          if (m.lit <= 0) return null;
          const sc = m.scale ?? 1;
          const cx = s.x;
          const cy = RIM_Y + s.y;
          const lit = m.lit;
          const ring = m.ping >= 0 && m.ping < 1 ? m.ping : -1;
          const sw = Math.max(0.14, 1.1 / ppf);
          return (
            <g key={i} transform={sc === 1 ? undefined : `translate(${cx} ${cy}) scale(${sc.toFixed(4)}) translate(${-cx} ${-cy})`}>
              {ring >= 0 && <circle cx={cx} cy={cy} r={mr + ring * 3.2} fill="none" stroke="#FFFFFF" strokeWidth={sw * 1.6 * (1 - ring) + 0.02} opacity={1 - ring} />}
              {s.made ? (
                <circle cx={cx} cy={cy} r={mr * (1 + 0.35 * (m.glint ?? 0))} fill="#FFFFFF" fillOpacity={lit} stroke={lit > 0.5 ? "#0D1117" : "#FFFFFF"} strokeOpacity={0.55 + 0.45 * lit} strokeWidth={sw} />
              ) : (
                <g stroke="#2B3038" strokeWidth={sw * 1.9} strokeLinecap="round" opacity={0.3 + 0.7 * lit}>
                  <path d={`M${cx - mr * 0.85} ${cy - mr * 0.85} L${cx + mr * 0.85} ${cy + mr * 0.85} M${cx + mr * 0.85} ${cy - mr * 0.85} L${cx - mr * 0.85} ${cy + mr * 0.85}`} stroke="#F4F6F8" strokeWidth={sw * 3.2} strokeOpacity={0.35 * lit} />
                  <path d={`M${cx - mr * 0.85} ${cy - mr * 0.85} L${cx + mr * 0.85} ${cy + mr * 0.85} M${cx + mr * 0.85} ${cy - mr * 0.85} L${cx - mr * 0.85} ${cy + mr * 0.85}`} />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
