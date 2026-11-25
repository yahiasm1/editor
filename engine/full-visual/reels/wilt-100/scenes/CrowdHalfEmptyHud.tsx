// wilt-100 "crowd": what sits on the frame rather than in the arena. The gate's turnstile register under the stage,
// its number wheels rolling exactly with the amber dots sitting down (0 to 4,124), and the "empty" tag on the top rows.
import React from "react";
import { ease, prog } from "../../../src/engine";
import { LABEL, SEATS, type CrowdHalfEmptyT, type CrowdHalfEmptyView, COUNT, crowdHalfEmptyCount } from "./CrowdHalfEmptyKit";

type Font = { ui: string; mono: string; caption: string };

/** one number wheel: the digit rolls up through its window; `v` is the wheel's value, fractional while it turns */
function Wheel({ x, y, v, font }: { x: number; y: number; v: number; font: Font }) {
  const base = Math.floor(v), frac = v - base;
  return (
    <g>
      <clipPath id={`cheWheel${x}`}><rect x={x} y={y} width={84} height={112} rx={8} /></clipPath>
      <rect x={x} y={y} width={84} height={112} rx={8} fill="#0A0B0D" />
      <g clipPath={`url(#cheWheel${x})`}>
        {[-1, 0, 1].map((k) => {
          const d = (((base + k) % 10) + 10) % 10;
          const yy = y + 86 + (k - frac) * -104;
          return <text key={k} x={x + 42} y={yy} fill="#F4F1EA" fontFamily={font.mono} fontWeight={700} fontSize={84} textAnchor="middle">{d}</text>;
        })}
        <rect x={x} y={y} width={84} height={30} fill="url(#cheWheelShade)" />
        <rect x={x} y={y + 82} width={84} height={30} fill="url(#cheWheelShade2)" />
      </g>
      <rect x={x} y={y} width={84} height={112} rx={8} fill="none" stroke="#2C3036" strokeWidth={3} />
    </g>
  );
}

export const CrowdHalfEmptyHud: React.FC<{ f: number; T: CrowdHalfEmptyT; V: CrowdHalfEmptyView; font: Font }> = ({ f, T, V, font }) => {
  const n = crowdHalfEmptyCount(f, T);
  // the wheels: the units turn with every person, the higher ones turn over as each carry comes
  const vf = n + (n < COUNT ? (f % 1) : 0);
  const wheel = (k: number) => {
    const p = Math.pow(10, k);
    const whole = Math.floor(vf / p);
    const rem = (vf % p) / p;
    const turning = k === 0 ? rem : Math.max(0, (rem - 0.92) / 0.08);
    return whole + (k === 0 ? 0 : turning);
  };
  const inn = prog(f, T.count - 12, 12, ease.out);
  const out = prog(f, T.building - 2, 14, ease.in);
  const o = inn * (1 - out);
  const y = 1268 + 40 * (1 - inn) + 120 * out;
  // the "empty" tag: a top-row seat left empty on the right bank, near the middle
  const seat = SEATS.filter((q) => q.bank === 0 && q.row === 18 && !q.filled).sort((a, b) => Math.abs(a.x - 5) - Math.abs(b.x - 5))[0];
  const sp = seat ? V.P([seat.x, seat.y + 0.32, seat.z]) : null;
  const tag = prog(f, T.half + 6, 10) * (1 - prog(f, T.building + 4, 10, ease.linear));
  const X0 = 540 - (4 * 84 + 3 * 10 + 26) / 2;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="cheWheelShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0.85} /><stop offset="1" stopColor="#000" stopOpacity={0} /></linearGradient>
        <linearGradient id="cheWheelShade2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.85} /></linearGradient>
        <linearGradient id="cheRegister" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A3F46" /><stop offset="1" stopColor="#1C1F24" /></linearGradient>
      </defs>
      {o > 0 && (
        <g opacity={o} transform={`translate(0 ${y - 1268})`}>
          {/* the turnstile register: cast housing, screws, the number wheels behind their windows */}
          <rect x={X0 - 30} y={1238} width={4 * 84 + 3 * 10 + 26 + 60} height={172} rx={18} fill="url(#cheRegister)" stroke="#0A0B0D" strokeWidth={3} />
          <rect x={X0 - 18} y={1250} width={4 * 84 + 3 * 10 + 26 + 36} height={148} rx={12} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
          {[[X0 - 16, 1252], [X0 + 4 * 84 + 3 * 10 + 26 + 16, 1252], [X0 - 16, 1396], [X0 + 4 * 84 + 3 * 10 + 26 + 16, 1396]].map(([sx, sy], i) => (
            <g key={i}><circle cx={sx} cy={sy} r={6} fill="#14161A" /><line x1={sx - 4} y1={sy - 4} x2={sx + 4} y2={sy + 4} stroke="#4A5058" strokeWidth={1.6} /></g>
          ))}
          <Wheel x={X0} y={1268} v={wheel(3)} font={font} />
          <text x={X0 + 84 + 13} y={1366} fill="#F4F1EA" fontFamily={font.mono} fontWeight={700} fontSize={70} textAnchor="middle">,</text>
          <Wheel x={X0 + 84 + 26} y={1268} v={wheel(2)} font={font} />
          <Wheel x={X0 + 2 * 84 + 36} y={1268} v={wheel(1)} font={font} />
          <Wheel x={X0 + 3 * 84 + 46} y={1268} v={wheel(0)} font={font} />
          <text x={540} y={1226} fill={LABEL} fontFamily={font.ui} fontWeight={600} fontSize={32} letterSpacing={4} textAnchor="middle" stroke="#0D1117" strokeWidth={8} strokeLinejoin="round" paintOrder="stroke">ATTENDANCE</text>
        </g>
      )}
      {sp && tag > 0 && (
        <g opacity={tag}>
          <line x1={sp.x} y1={sp.y - 8} x2={sp.x + 70} y2={sp.y - 80} stroke={LABEL} strokeWidth={2} />
          <circle cx={sp.x} cy={sp.y - 4} r={5} fill="none" stroke={LABEL} strokeWidth={2} />
          <text x={sp.x + 70} y={sp.y - 92} fill={LABEL} fontFamily={font.ui} fontWeight={500} fontSize={36} textAnchor="middle">empty</text>
        </g>
      )}
    </svg>
  );
};
