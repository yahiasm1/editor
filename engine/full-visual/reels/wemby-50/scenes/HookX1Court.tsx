// The real NBA half court, top-down at true geometry, as `answer` (PlayByPlayLogCourt) draws it on its first frame:
// 50 x 47 ft plus a 2.4 ft apron, baseline on top as on Basketball-Reference's chart, rim centre 5.25 ft from the
// baseline, honey maple boards from the same seeded random, the lane in Spurs black with a silver edge, white 2 in
// lines, his 29 shots in BBR's glyphs. Here it is born: the maple spreads out from the baseline where the slab's top
// edge hit, each line draws outward from the impact, and each mark punches down when its disc lands.
// When everything has landed it is pixel for pixel `answer`'s court.
import React, { useMemo } from "react";
import { HOOKX1_SHOTS } from "./HookX1Data";

export const HOOKX1_APRON = 2.4;
export const HOOKX1_RIM_Y = 5.25;
const LINE = 1 / 6;
const BOARD = 0.1875;

const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const HookX1Boards: React.FC = () => {
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

/** a painted line: draws along itself until done, then is the plain path `answer` paints */
const HookX1Line: React.FC<{ d: string; k: number; dash?: string }> = ({ d, k, dash }) => {
  if (k <= 0) return null;
  if (k >= 1) return <path d={d} strokeDasharray={dash} />;
  if (dash) return <path d={d} strokeDasharray={dash} opacity={k} />;
  return <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - k} />;
};

export type HookX1Mark = { lit: number; punch: number; ring: number };

/**
 * ppf: px per foot. reveal: radius in ft of the maple spreading from the baseline centre (Infinity = all).
 * line(id): draw progress of each painted line. marks: per shot.
 */
export const HookX1Court: React.FC<{
  ppf: number;
  f: number;
  reveal: number;
  line: (startFt: number) => number;
  marks: HookX1Mark[];
  flash: number;
}> = ({ ppf, f, reveal, line, marks, flash }) => {
  const vw = 50 + HOOKX1_APRON * 2;
  const vh = 47 + HOOKX1_APRON * 2;
  const W = vw * ppf;
  const H = vh * ppf;
  const mr = Math.max(0.62, 5.6 / ppf);
  const RIM_Y = HOOKX1_RIM_Y;
  const cornerY = RIM_Y + Math.sqrt(23.75 * 23.75 - 22 * 22);
  const a3 = Math.atan2(cornerY - RIM_Y, 22);
  const sweep = -40 + ((f * 0.22) % 130);
  const white = "#F4F6F8";
  const full = reveal > 200;
  // every line starts drawing when the spreading impact reaches its nearest point to the baseline
  const L = {
    board: line(3.8), rim: line(4.5), ra: line(4), lane: line(0), lanePaint: line(0), ft: line(13), ftIn: line(19),
    side: line(0), base: line(0), half: line(47), corner: line(0), arc3: line(14), centre: line(41), hash: line(7), coach: line(28),
  };
  return (
    <svg width={W} height={H} viewBox={`${-25 - HOOKX1_APRON} ${-HOOKX1_APRON} ${vw} ${vh}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="pbpl-sheen" gradientUnits="userSpaceOnUse" x1={sweep} y1={0} x2={sweep + 26} y2={30}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="pbpl-pool" cx="0" cy="18" r="42" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.10" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </radialGradient>
        <linearGradient id="pbpl-lane" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A0B0D" />
          <stop offset="1" stopColor="#16181C" />
        </linearGradient>
        {!full && (
          <radialGradient id="hx1-reveal" cx="0" cy="0" r={Math.max(0.01, reveal)} gradientUnits="userSpaceOnUse">
            <stop offset="0.86" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        )}
        {!full && (
          <mask id="hx1-reveal-m" maskUnits="userSpaceOnUse" x={-25 - HOOKX1_APRON} y={-HOOKX1_APRON} width={vw} height={vh}>
            <rect x={-25 - HOOKX1_APRON} y={-HOOKX1_APRON} width={vw} height={vh} fill="url(#hx1-reveal)" />
          </mask>
        )}
      </defs>
      <rect x={-25 - HOOKX1_APRON} y={-HOOKX1_APRON} width={vw} height={vh} fill="#0E1013" />
      <g mask={full ? undefined : "url(#hx1-reveal-m)"}>
        <HookX1Boards />
        <rect x={-25} y={0} width={50} height={47} fill="url(#pbpl-pool)" />
        <rect x={-8} y={0} width={16} height={19} fill="url(#pbpl-lane)" />
        <rect x={-7.55} y={0} width={15.1} height={18.55} fill="none" stroke="#C4CED4" strokeWidth={0.12} opacity={0.85} />
        <rect x={-25} y={0} width={50} height={47} fill="url(#pbpl-sheen)" />
      </g>
      {/* the impact's light: a band of arena light thrown down the boards from the baseline */}
      {flash > 0 && (
        <rect x={-25} y={0} width={50} height={47} fill="#FFF4DE" opacity={flash} style={{ mixBlendMode: "screen" }} />
      )}
      <g fill="none" stroke={white} strokeWidth={LINE}>
        {full && L.side >= 1 && L.half >= 1 && L.base >= 1 ? (
          <rect x={-25 + LINE / 2} y={LINE / 2} width={50 - LINE} height={47 - LINE / 2} />
        ) : (
          <>
            <HookX1Line d={`M${-25 + LINE / 2} ${LINE / 2} L${25 - LINE / 2} ${LINE / 2}`} k={L.base} />
            <HookX1Line d={`M${-25 + LINE / 2} ${LINE / 2} L${-25 + LINE / 2} 47`} k={L.side} />
            <HookX1Line d={`M${25 - LINE / 2} ${LINE / 2} L${25 - LINE / 2} 47`} k={L.side} />
            <HookX1Line d={`M${-25 + LINE / 2} 47 L${25 - LINE / 2} 47`} k={L.half} />
          </>
        )}
        {L.lane >= 1 ? <rect x={-8} y={0} width={16} height={19} /> : <HookX1Line d="M-8 0 L-8 19 L8 19 L8 0" k={L.lane} />}
        <HookX1Line d={arc(0, 19, 6, 0, Math.PI)} k={L.ft} />
        <HookX1Line d={arc(0, 19, 6, Math.PI, 2 * Math.PI)} k={L.ftIn} dash="1.25 1.1" />
        <HookX1Line d={`M-4 4 L-4 ${RIM_Y} ${arc(0, RIM_Y, 4, Math.PI, 0).replace("M", "L")} L4 4`} k={L.ra} />
        <HookX1Line d={`M-22 0 L-22 ${cornerY.toFixed(3)}`} k={L.corner} />
        <HookX1Line d={`M22 0 L22 ${cornerY.toFixed(3)}`} k={L.corner} />
        <HookX1Line d={arc(0, RIM_Y, 23.75, Math.PI - a3, a3)} k={L.arc3} />
        <HookX1Line d={arc(0, 47, 6, Math.PI, 2 * Math.PI)} k={L.centre} />
        <HookX1Line d={arc(0, 47, 2, Math.PI, 2 * Math.PI)} k={L.centre} />
      </g>
      <g fill={white} opacity={L.hash}>
        {[-1, 1].map((s) => (
          <React.Fragment key={s}>
            <rect x={s < 0 ? -8.67 : 8} y={7} width={0.67} height={1} />
            {[11, 14, 17].map((y) => (
              <rect key={y} x={s < 0 ? -8.67 : 8} y={y} width={0.67} height={LINE} />
            ))}
            <rect x={s < 0 ? -25 - 3 : 25} y={28} width={3} height={LINE} opacity={0.9 * (L.coach >= 1 ? 1 : L.coach)} />
          </React.Fragment>
        ))}
      </g>
      <g opacity={L.board}>
        <rect x={-3} y={3.8} width={6} height={0.32} fill="#E6EBEF" />
        <rect x={-0.16} y={4.1} width={0.32} height={0.45} fill="#9AA3AB" />
      </g>
      {L.rim > 0 && <circle cx={0} cy={RIM_Y} r={0.75} fill="none" stroke="#E2582A" strokeWidth={0.2} opacity={L.rim} />}
      {HOOKX1_SHOTS.map((s, i) => {
        const m = marks[i];
        if (!m || m.lit <= 0) return null;
        const cx = s.x;
        const cy = RIM_Y + s.y;
        const lit = 1;
        const sw = Math.max(0.14, 1.1 / ppf);
        const sc = 1 + m.punch;
        const ring = m.ring > 0 && m.ring < 1 ? m.ring : -1;
        const body = s.made ? (
          <circle cx={cx} cy={cy} r={mr} fill="#FFFFFF" fillOpacity={lit} stroke={lit > 0.5 ? "#0D1117" : "#FFFFFF"} strokeOpacity={0.55 + 0.45 * lit} strokeWidth={sw} />
        ) : (
          <g stroke="#2B3038" strokeWidth={sw * 1.9} strokeLinecap="round" opacity={0.3 + 0.7 * lit}>
            <path d={`M${cx - mr * 0.85} ${cy - mr * 0.85} L${cx + mr * 0.85} ${cy + mr * 0.85} M${cx + mr * 0.85} ${cy - mr * 0.85} L${cx - mr * 0.85} ${cy + mr * 0.85}`} stroke="#F4F6F8" strokeWidth={sw * 3.2} strokeOpacity={0.35 * lit} />
            <path d={`M${cx - mr * 0.85} ${cy - mr * 0.85} L${cx + mr * 0.85} ${cy + mr * 0.85} M${cx + mr * 0.85} ${cy - mr * 0.85} L${cx - mr * 0.85} ${cy + mr * 0.85}`} />
          </g>
        );
        return (
          <g key={i} opacity={m.lit}>
            {ring >= 0 && <circle cx={cx} cy={cy} r={mr + ring * 3.2} fill="none" stroke="#F2B33D" strokeWidth={sw * 1.6 * (1 - ring) + 0.02} opacity={1 - ring} />}
            {sc !== 1 ? <g transform={`translate(${cx} ${cy}) scale(${sc.toFixed(4)}) translate(${-cx} ${-cy})`}>{body}</g> : body}
          </g>
        );
      })}
    </svg>
  );
};
