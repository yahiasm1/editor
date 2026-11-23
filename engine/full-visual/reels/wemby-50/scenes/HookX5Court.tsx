// The real NBA half court, top-down at true geometry, exactly as `answer` (PlayByPlayLogCourt) draws it on its first
// frame: 50 x 47 ft plus a 2.4 ft Spurs-black apron, baseline on top as on Basketball-Reference's chart, rim centre
// 5.25 ft from the baseline, honey maple boards (2.25 in strips, staggered end joints) from the same seeded random,
// the satin sheen sliding, the lane in Spurs black with a silver edge, white 2 in lines. In feet, so every layer the
// hook adds (discs, shadows, dents, stakes) is drawn in the court's own units. `floor` sits on the boards under the
// lines' paint; `children` on top. When the hook has nothing left to add, this is pixel for pixel `answer`'s court.
import React, { useMemo } from "react";
import { HOOKX5_RIM_Y } from "./HookX5Data";

export const HOOKX5_APRON = 2.4;
export const HOOKX5_PPF = 15.2; // answer's court: x 160, y 700, 760 wide
export const HOOKX5_COURT = { x: 160, y: 700, w: 760 };
export const HOOKX5_BOX = {
  x: HOOKX5_COURT.x - HOOKX5_APRON * HOOKX5_PPF,
  y: HOOKX5_COURT.y - HOOKX5_APRON * HOOKX5_PPF,
  w: (50 + HOOKX5_APRON * 2) * HOOKX5_PPF,
  h: (47 + HOOKX5_APRON * 2) * HOOKX5_PPF,
};
export const HOOKX5_VIEWBOX = `${-25 - HOOKX5_APRON} ${-HOOKX5_APRON} ${50 + HOOKX5_APRON * 2} ${47 + HOOKX5_APRON * 2}`;
/** court feet (x from the centre line, y from the baseline) to screen px, when the slab is flat */
export const hookX5Screen = (x: number, y: number) => ({ x: 540 + x * HOOKX5_PPF, y: HOOKX5_COURT.y + y * HOOKX5_PPF });

const LINE = 1 / 6;
const BOARD = 0.1875;

const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const HookX5Boards: React.FC = () => {
  const boards = useMemo(() => {
    const out: React.ReactNode[] = [];
    const n = Math.ceil(50 / BOARD);
    for (let i = 0; i < n; i++) {
      const x = -25 + i * BOARD;
      const t = rnd(i);
      const l = 70 + t * 9;
      const c = `hsl(${34 + rnd(i + 900) * 5}, ${52 + rnd(i + 400) * 12}%, ${l}%)`;
      out.push(<rect key={`b${i}`} x={x} y={0} width={BOARD + 0.004} height={47} fill={c} />);
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

export const hookX5Arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
  const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  return `M${p0[0].toFixed(3)} ${p0[1].toFixed(3)} A${r} ${r} 0 ${large} ${a1 > a0 ? 1 : 0} ${p1[0].toFixed(3)} ${p1[1].toFixed(3)}`;
};

/** BBR's glyphs exactly as `answer` paints them (lit 1): a white dot with a navy stroke, a dark x with a white halo */
export const HookX5Glyph: React.FC<{ made: boolean; cx: number; cy: number; r?: number }> = ({ made, cx, cy, r }) => {
  const mr = r ?? Math.max(0.62, 5.6 / HOOKX5_PPF);
  const sw = Math.max(0.14, 1.1 / HOOKX5_PPF);
  if (made) return <circle cx={cx} cy={cy} r={mr} fill="#FFFFFF" fillOpacity={1} stroke="#0D1117" strokeOpacity={1} strokeWidth={sw} />;
  const d = `M${cx - mr * 0.85} ${cy - mr * 0.85} L${cx + mr * 0.85} ${cy + mr * 0.85} M${cx + mr * 0.85} ${cy - mr * 0.85} L${cx - mr * 0.85} ${cy + mr * 0.85}`;
  return (
    <g stroke="#2B3038" strokeWidth={sw * 1.9} strokeLinecap="round" opacity={1}>
      <path d={d} stroke="#F4F6F8" strokeWidth={sw * 3.2} strokeOpacity={0.35} />
      <path d={d} />
    </g>
  );
};

export const HookX5Court: React.FC<{ f: number; defs?: React.ReactNode; floor?: React.ReactNode; children?: React.ReactNode }> = ({ f, defs, floor, children }) => {
  const ppf = HOOKX5_PPF;
  const RIM_Y = HOOKX5_RIM_Y;
  const cornerY = RIM_Y + Math.sqrt(23.75 * 23.75 - 22 * 22);
  const a3 = Math.atan2(cornerY - RIM_Y, 22);
  const sweep = -40 + ((f * 0.22) % 130);
  const white = "#F4F6F8";
  const vw = 50 + HOOKX5_APRON * 2;
  const vh = 47 + HOOKX5_APRON * 2;
  return (
    <div
      style={{
        position: "absolute", left: 0, top: 0, width: HOOKX5_BOX.w, height: HOOKX5_BOX.h,
        borderRadius: Math.max(4, ppf * 0.6), boxShadow: `0 ${(ppf * 1.6).toFixed(1)}px ${(ppf * 4).toFixed(1)}px rgba(0,0,0,0.55), 0 0 0 1px #30363D`,
        overflow: "hidden",
      }}
    >
      <svg width={HOOKX5_BOX.w} height={HOOKX5_BOX.h} viewBox={HOOKX5_VIEWBOX} style={{ display: "block" }}>
        <defs>
          <linearGradient id="hx5-sheen" gradientUnits="userSpaceOnUse" x1={sweep} y1={0} x2={sweep + 26} y2={30}>
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hx5-pool" cx="0" cy="18" r="42" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="0.10" />
            <stop offset="1" stopColor="#000" stopOpacity="0.22" />
          </radialGradient>
          <linearGradient id="hx5-lane" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0A0B0D" />
            <stop offset="1" stopColor="#16181C" />
          </linearGradient>
          {defs}
        </defs>
        <rect x={-25 - HOOKX5_APRON} y={-HOOKX5_APRON} width={vw} height={vh} fill="#0E1013" />
        <HookX5Boards />
        <rect x={-25} y={0} width={50} height={47} fill="url(#hx5-pool)" />
        <rect x={-8} y={0} width={16} height={19} fill="url(#hx5-lane)" />
        <rect x={-7.55} y={0} width={15.1} height={18.55} fill="none" stroke="#C4CED4" strokeWidth={0.12} opacity={0.85} />
        <rect x={-25} y={0} width={50} height={47} fill="url(#hx5-sheen)" />
        <g fill="none" stroke={white} strokeWidth={LINE}>
          <rect x={-25 + LINE / 2} y={LINE / 2} width={50 - LINE} height={47 - LINE / 2} />
          <rect x={-8} y={0} width={16} height={19} />
          <path d={hookX5Arc(0, 19, 6, 0, Math.PI)} />
          <path d={hookX5Arc(0, 19, 6, Math.PI, 2 * Math.PI)} strokeDasharray="1.25 1.1" />
          <path d={`M-4 4 L-4 ${RIM_Y} ${hookX5Arc(0, RIM_Y, 4, Math.PI, 0).replace("M", "L")} L4 4`} />
          <path d={`M-22 0 L-22 ${cornerY.toFixed(3)}`} />
          <path d={`M22 0 L22 ${cornerY.toFixed(3)}`} />
          <path d={hookX5Arc(0, RIM_Y, 23.75, Math.PI - a3, a3)} />
          <path d={hookX5Arc(0, 47, 6, Math.PI, 2 * Math.PI)} />
          <path d={hookX5Arc(0, 47, 2, Math.PI, 2 * Math.PI)} />
        </g>
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
        <rect x={-3} y={3.8} width={6} height={0.32} fill="#E6EBEF" />
        <rect x={-0.16} y={4.1} width={0.32} height={0.45} fill="#9AA3AB" />
        <circle cx={0} cy={RIM_Y} r={0.75} fill="none" stroke="#E2582A" strokeWidth={0.2} />
        {floor}
        {children}
      </svg>
    </div>
  );
};
