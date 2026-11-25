// The back of the torn FGA cell: the real NBA half court, top-down at true geometry, in feet (NBA rules): 50 x 47 ft,
// baseline on top as on Basketball-Reference's chart, rim centre 5.25 ft from the baseline. Maple boards running
// baseline to half court (2.25 in each, tinted one by one, staggered end joints), a satin sheen the arena light slides
// across, white 2 in lines, the lane in Spurs black with a silver edge. His 29 shots in BBR's glyphs (a filled dot for
// a make, an x for a miss) at their real spots. Drawn exactly as `answer` (PlayByPlayLogCourt) draws its first frame,
// so the hand-over is the same picture; here the marks can also be thrown off their spots and shaken back.
import React, { useMemo } from "react";
import { HookX2Shots } from "./HookX2Data";

export const HookX2APRON = 2.4;
const RIM_Y = 5.25;
const LINE = 1 / 6;
const BOARD = 0.1875;
export const HookX2VW = 50 + HookX2APRON * 2;
export const HookX2VH = 47 + HookX2APRON * 2;

export type HookX2Mark = { dx: number; dy: number; o: number; s: number };

const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const HookX2Boards: React.FC = () => {
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

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
  const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  return `M${p0[0].toFixed(3)} ${p0[1].toFixed(3)} A${r} ${r} 0 ${large} ${a1 > a0 ? 1 : 0} ${p1[0].toFixed(3)} ${p1[1].toFixed(3)}`;
};

/** the slab, `w` px wide (apron included), drawn at its own 0,0; `ppf` is the px per foot the marks are sized for */
export const HookX2Court: React.FC<{ w: number; f: number; marks?: HookX2Mark[]; ppf?: number; shadow?: boolean }> = ({ w, f, marks, ppf: ppfMarks, shadow = true }) => {
  const ppf = w / HookX2VW;
  const W = w;
  const H = HookX2VH * ppf;
  const pm = ppfMarks ?? ppf;
  const mr = Math.max(0.62, 5.6 / pm);
  const cornerY = RIM_Y + Math.sqrt(23.75 * 23.75 - 22 * 22);
  const a3 = Math.atan2(cornerY - RIM_Y, 22);
  const sweep = -40 + ((f * 0.22) % 130);
  const white = "#F4F6F8";
  const sw = Math.max(0.14, 1.1 / pm);
  return (
    <div
      style={{
        position: "absolute", left: 0, top: 0, width: W, height: H,
        borderRadius: Math.max(4, ppf * 0.6),
        boxShadow: shadow ? `0 ${(ppf * 1.6).toFixed(1)}px ${(ppf * 4).toFixed(1)}px rgba(0,0,0,0.55), 0 0 0 1px #30363D` : "0 0 0 1px #30363D",
        overflow: "hidden",
      }}
    >
      <svg width={W} height={H} viewBox={`${-25 - HookX2APRON} ${-HookX2APRON} ${HookX2VW} ${HookX2VH}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id="hx2-sheen" gradientUnits="userSpaceOnUse" x1={sweep} y1={0} x2={sweep + 26} y2={30}>
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hx2-pool" cx="0" cy="18" r="42" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="0.10" />
            <stop offset="1" stopColor="#000" stopOpacity="0.22" />
          </radialGradient>
          <linearGradient id="hx2-lane" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0A0B0D" />
            <stop offset="1" stopColor="#16181C" />
          </linearGradient>
        </defs>
        <rect x={-25 - HookX2APRON} y={-HookX2APRON} width={HookX2VW} height={HookX2VH} fill="#0E1013" />
        <HookX2Boards />
        <rect x={-25} y={0} width={50} height={47} fill="url(#hx2-pool)" />
        <rect x={-8} y={0} width={16} height={19} fill="url(#hx2-lane)" />
        <rect x={-7.55} y={0} width={15.1} height={18.55} fill="none" stroke="#C4CED4" strokeWidth={0.12} opacity={0.85} />
        <rect x={-25} y={0} width={50} height={47} fill="url(#hx2-sheen)" />
        <g fill="none" stroke={white} strokeWidth={LINE}>
          <rect x={-25 + LINE / 2} y={LINE / 2} width={50 - LINE} height={47 - LINE / 2} />
          <rect x={-8} y={0} width={16} height={19} />
          <path d={arc(0, 19, 6, 0, Math.PI)} />
          <path d={arc(0, 19, 6, Math.PI, 2 * Math.PI)} strokeDasharray="1.25 1.1" />
          <path d={`M-4 4 L-4 ${RIM_Y} ${arc(0, RIM_Y, 4, Math.PI, 0).replace("M", "L")} L4 4`} />
          <path d={`M-22 0 L-22 ${cornerY.toFixed(3)}`} />
          <path d={`M22 0 L22 ${cornerY.toFixed(3)}`} />
          <path d={arc(0, RIM_Y, 23.75, Math.PI - a3, a3)} />
          <path d={arc(0, 47, 6, Math.PI, 2 * Math.PI)} />
          <path d={arc(0, 47, 2, Math.PI, 2 * Math.PI)} />
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
        {HookX2Shots.map((s, i) => {
          const m = marks?.[i] ?? { dx: 0, dy: 0, o: 1, s: 1 };
          if (m.o <= 0.001) return null;
          const cx = s.x + m.dx;
          const cy = RIM_Y + s.y + m.dy;
          const r = mr * m.s;
          return (
            <g key={i} opacity={m.o}>
              {s.made ? (
                <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" fillOpacity={1} stroke="#0D1117" strokeOpacity={1} strokeWidth={sw} />
              ) : (
                <g stroke="#2B3038" strokeWidth={sw * 1.9} strokeLinecap="round">
                  <path d={`M${cx - r * 0.85} ${cy - r * 0.85} L${cx + r * 0.85} ${cy + r * 0.85} M${cx + r * 0.85} ${cy - r * 0.85} L${cx - r * 0.85} ${cy + r * 0.85}`} stroke="#F4F6F8" strokeWidth={sw * 3.2} strokeOpacity={0.35} />
                  <path d={`M${cx - r * 0.85} ${cy - r * 0.85} L${cx + r * 0.85} ${cy + r * 0.85} M${cx + r * 0.85} ${cy - r * 0.85} L${cx - r * 0.85} ${cy + r * 0.85}`} />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
