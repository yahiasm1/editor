// The STAPLES Center floor of 2005-06, top-down at NBA geometry, painted as the endlessbender photo of the 81 night and
// malingering's opening tip photo show it: pale honey maple in 2.25 in strips running baseline to baseline, a purple
// lane with GOLD lane lines and hash marks, purple 3-point arc, half court line and centre circle, the gold centre disc
// with black ball seams and purple LAKERS / LOS ANGELES, the gold sideline apron, the purple baseline band with LAKERS
// in cream-gold, red "STAPLES center" near one sideline. Units are feet: x across (rim centre 0, -25..25), y down from
// the baseline (rim centre at 5.25). The basket is at the top, as on Basketball-Reference's shot chart.
import React, { useMemo } from "react";

export const ThirdQuarterCourtGeom = { rimY: 5.25, half: 47, apronSide: 3, apronBase: 4.5 };

const PURPLE = "#552583";
const LINE_PURPLE = "#5B2A8E";
const GOLD_LINE = "#F2B320";
const APRON_GOLD = "#F4B71C";
const LINE = 1 / 6; // 2 in
const STRIP = 0.1875; // 2.25 in

const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const ThirdQuarterCourtBoards: React.FC = () => {
  const nodes = useMemo(() => {
    const out: React.ReactNode[] = [];
    const n = Math.ceil(50 / STRIP);
    for (let i = 0; i < n; i++) {
      const x = -25 + i * STRIP;
      const t = rnd(i);
      // sampled off the night photo under the lights: #F1C375 .. #F9D88B
      const c = `hsl(${37 + rnd(i + 900) * 5}, ${78 + rnd(i + 400) * 10}%, ${74 + t * 7}%)`;
      out.push(<rect key={`b${i}`} x={x} y={0} width={STRIP + 0.004} height={56} fill={c} />);
      let y = -rnd(i + 77) * 7;
      let k = 0;
      while (y < 56) {
        y += 3 + rnd(i * 13 + k) * 7;
        k++;
        if (y > 0 && y < 56) out.push(<rect key={`j${i}-${k}`} x={x} y={y} width={STRIP} height={0.035} fill="rgba(110,60,10,0.28)" />);
      }
    }
    return out;
  }, []);
  return <g>{nodes}</g>;
};

const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
  const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  return `M${p0[0].toFixed(3)} ${p0[1].toFixed(3)} A${r} ${r} 0 ${large} ${a1 > a0 ? 1 : 0} ${p1[0].toFixed(3)} ${p1[1].toFixed(3)}`;
};

/** the 3-point line, corner to corner, as one path (for drawing and lighting it) */
export const ThirdQuarterCourtArc3 = (() => {
  const R = 23.75;
  const yc = ThirdQuarterCourtGeom.rimY + Math.sqrt(R * R - 22 * 22);
  const a = Math.atan2(yc - ThirdQuarterCourtGeom.rimY, 22);
  return `M-22 0 L-22 ${yc.toFixed(3)} ${arcPath(0, ThirdQuarterCourtGeom.rimY, R, Math.PI - a, a).replace(/^M[^A]*/, "")} L22 0`;
})();

export const ThirdQuarterCourtFloor: React.FC<{ f: number; arcLight: number; rimFlash: number; ppf: number }> = ({ f, arcLight, rimFlash, ppf }) => {
  const G = ThirdQuarterCourtGeom;
  const x0 = -25 - G.apronSide;
  const y0 = -G.apronBase;
  const vw = 50 + 2 * G.apronSide;
  const vh = 56 - y0;
  const sweep = -60 + ((f * 0.35) % 150);
  const yc3 = G.rimY + Math.sqrt(23.75 * 23.75 - 22 * 22);
  const a3 = Math.atan2(yc3 - G.rimY, 22);
  return (
    <svg width={vw * ppf} height={vh * ppf} viewBox={`${x0} ${y0} ${vw} ${vh}`} style={{ position: "absolute", left: x0 * ppf, top: y0 * ppf, overflow: "visible" }}>
      <defs>
        <linearGradient id="tqc-sheen" gradientUnits="userSpaceOnUse" x1={sweep} y1={-5} x2={sweep + 30} y2={40}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.20" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="tqc-pool" cx="0" cy="16" r="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.10" />
          <stop offset="1" stopColor="#3a1d00" stopOpacity="0.20" />
        </radialGradient>
        <linearGradient id="tqc-lane" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4C1F7A" />
          <stop offset="1" stopColor={PURPLE} />
        </linearGradient>
        <radialGradient id="tqc-disc" cx="0" cy={G.half} r="6" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFD23A" />
          <stop offset="1" stopColor="#F5B81C" />
        </radialGradient>
        <filter id="tqc-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="tqc-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>

      {/* aprons: gold along the sidelines, purple behind the baseline with LAKERS in cream-gold */}
      <rect x={x0} y={0} width={vw} height={vh} fill={APRON_GOLD} />
      <rect x={x0} y={y0} width={vw} height={-y0} fill="#4A1F73" />
      <text x={0} y={-1.05} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={900} fontStyle="italic" fontSize={3.1} letterSpacing={0.5} fill="#F6DFA0">
        LAKERS
      </text>

      {/* the maple */}
      <g>
        <rect x={-25} y={0} width={50} height={56} fill="#F2C97E" />
        <ThirdQuarterCourtBoards />
        <rect x={-25} y={0} width={50} height={56} fill="url(#tqc-pool)" />
        {/* the arena lights: two warm pools on the finish */}
        <ellipse cx={-11} cy={14} rx={14} ry={11} fill="#FFF6DC" opacity={0.16} filter="url(#tqc-soft)" />
        <ellipse cx={12} cy={31} rx={15} ry={12} fill="#FFF6DC" opacity={0.12} filter="url(#tqc-soft)" />
      </g>

      {/* the lane, painted purple with gold lines and hash marks */}
      <rect x={-8} y={0} width={16} height={19} fill="url(#tqc-lane)" />
      <g fill="none" stroke={GOLD_LINE} strokeWidth={LINE}>
        <rect x={-8 + LINE / 2} y={0} width={16 - LINE} height={19 - LINE / 2} />
        {/* the free throw circle: its lane half a gold arc on the purple, its outer half on the wood */}
        <path d={arcPath(0, 19, 6, Math.PI, 2 * Math.PI)} />
        <path d={arcPath(0, 19, 6, 0, Math.PI)} opacity={0.9} />
        {/* the restricted arc */}
        <path d={`M-4 ${G.rimY} ${arcPath(0, G.rimY, 4, Math.PI, 0).replace(/^M[^A]*/, "")}`} />
        {/* hash marks: the block at 7 ft, then 8, 11, 14 */}
        {[7, 8, 11, 14].map((y) => (
          <g key={y}>
            <line x1={-8} x2={-8.67} y1={y + (y === 7 ? 0.5 : 0)} y2={y + (y === 7 ? 0.5 : 0)} strokeWidth={y === 7 ? 1 : LINE} />
            <line x1={8} x2={8.67} y1={y + (y === 7 ? 0.5 : 0)} y2={y + (y === 7 ? 0.5 : 0)} strokeWidth={y === 7 ? 1 : LINE} />
          </g>
        ))}
        {/* the small marks under the board, 3 ft from the baseline */}
        <line x1={-3} x2={-3} y1={0} y2={0.5} />
        <line x1={3} x2={3} y1={0} y2={0.5} />
      </g>

      {/* purple lines on the wood: boundary, 3-point line, half court, centre circle, the 28 ft coach marks */}
      <g fill="none" stroke={LINE_PURPLE} strokeWidth={LINE}>
        <rect x={-25 + LINE / 2} y={LINE / 2} width={50 - LINE} height={56} />
        <path d={ThirdQuarterCourtArc3} />
        <line x1={-25} x2={25} y1={G.half} y2={G.half} />
        <line x1={-25} x2={-22} y1={28} y2={28} />
        <line x1={25} x2={22} y1={28} y2={28} />
      </g>
      {/* the 3-point line lighting up gold on "threes" */}
      {arcLight > 0.001 && (
        <g fill="none" strokeLinecap="round">
          <path d={ThirdQuarterCourtArc3} stroke="#FDB927" strokeWidth={0.9} opacity={0.55 * arcLight} filter="url(#tqc-glow)" />
          <path d={ThirdQuarterCourtArc3} stroke="#FFE08A" strokeWidth={0.28} opacity={arcLight} />
        </g>
      )}

      {/* the centre logo: gold disc, ball seams, purple LAKERS along the length of the floor */}
      <circle cx={0} cy={G.half} r={6} fill="url(#tqc-disc)" />
      <g fill="none" stroke="#1E1407" strokeWidth={0.09} opacity={0.75}>
        <line x1={-6} x2={6} y1={G.half} y2={G.half} />
        <line x1={0} x2={0} y1={G.half - 6} y2={G.half + 6} />
        <path d={`M-4.3 ${G.half - 4.2} Q-1.6 ${G.half} -4.3 ${G.half + 4.2}`} />
        <path d={`M4.3 ${G.half - 4.2} Q1.6 ${G.half} 4.3 ${G.half + 4.2}`} />
      </g>
      <circle cx={0} cy={G.half} r={6} fill="none" stroke={LINE_PURPLE} strokeWidth={LINE} />
      <g transform={`translate(0 ${G.half}) rotate(-90)`}>
        <text x={0} y={1.35} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={900} fontStyle="italic" fontSize={4.1} letterSpacing={0.15} fill="#4A1F7C" stroke="#F8D66A" strokeWidth={0.1}>
          LAKERS
        </text>
        <text x={0} y={3.3} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={1.05} letterSpacing={0.35} fill="#4A1F7C">
          LOS ANGELES
        </text>
      </g>

      {/* STAPLES center, red, near the left sideline just inside half court, reading along the floor */}
      <g transform={`translate(-19.6 ${G.half - 10}) rotate(90)`} fill="#D5262F">
        <text x={0} y={0} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={900} fontSize={3.4} letterSpacing={0.25}>
          STAPLES
        </text>
        <text x={1.2} y={2.7} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={700} fontSize={2.3} letterSpacing={0.55}>
          center
        </text>
      </g>

      {/* the satin light moving over the finish */}
      <rect x={-25} y={0} width={50} height={56} fill="url(#tqc-sheen)" />

      {/* backboard (glass edge on, white frame) and the orange rim with its net */}
      <rect x={-3} y={3.85} width={6} height={0.3} fill="#E8EEF2" stroke="#9AA4AE" strokeWidth={0.05} />
      <rect x={-0.15} y={4.15} width={0.3} height={0.35} fill="#C8D0D6" />
      {rimFlash > 0.01 && <circle cx={0} cy={G.rimY} r={2.2 + 1.4 * rimFlash} fill="#FDB927" opacity={0.35 * rimFlash} filter="url(#tqc-glow)" />}
      <circle cx={0} cy={G.rimY} r={0.75} fill="none" stroke="#E4572E" strokeWidth={0.16} />
      <g fill="none" stroke="#F4F6F8" strokeWidth={0.05} opacity={0.8}>
        <circle cx={0} cy={G.rimY} r={0.55} />
        <circle cx={0} cy={G.rimY} r={0.36} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <line key={i} x1={0.36 * Math.cos(a)} y1={G.rimY + 0.36 * Math.sin(a)} x2={0.7 * Math.cos(a)} y2={G.rimY + 0.7 * Math.sin(a)} />;
        })}
      </g>
    </svg>
  );
};
