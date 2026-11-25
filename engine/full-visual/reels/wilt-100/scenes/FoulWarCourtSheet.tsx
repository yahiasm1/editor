// wilt-100 "fouls": the scorer's foul tally, the paper of the night (cream #EFE6D2, printed brown-grey rules, typed
// heads, pencil). Two rows: the Knicks (their mark, as on the ticket) and PHILA (the arched jersey lettering of the
// 100 photo, the Warriors' mark in this reel). Each foul is a pencil stroke, in fives with the fifth across; the
// running count is pencilled at the end of the row and lands on the box score's team totals, 32 and 25, on "again".
import React from "react";
import { Img, staticFile } from "remotion";
import { ease, prog } from "../../../src/engine";
import { FWC_INK, FWC_LABEL, FWC_PAPER, FWC_PENCIL, type FoulWarT, fwcRnd, fwcTally } from "./FoulWarCourtKit";

const SW = 880, SH = 178;
const FAINT = "#9C8E74";
const X0 = 268; // where the marks start
const GROUP = 74, STEP = 12.5;

function marks(n: number, y: number, seed: number) {
  const out: React.ReactNode[] = [];
  const full = Math.floor(n);
  const part = n - full;
  for (let i = 0; i < Math.ceil(n); i++) {
    const g = Math.floor(i / 5), j = i % 5;
    const k = i < full ? 1 : part;
    const r = (m: number) => fwcRnd(seed + i * 7.1 + m);
    let x1: number, y1: number, x2: number, y2: number;
    if (j < 4) {
      x1 = X0 + g * GROUP + j * STEP + (r(1) - 0.5) * 3;
      y1 = y - 20 + (r(2) - 0.5) * 4;
      x2 = x1 + (r(3) - 0.5) * 5;
      y2 = y + 20 + (r(4) - 0.5) * 4;
    } else {
      x1 = X0 + g * GROUP - 8;
      y1 = y + 12 + (r(2) - 0.5) * 4;
      x2 = X0 + g * GROUP + 3 * STEP + 9;
      y2 = y - 14 + (r(4) - 0.5) * 4;
    }
    const xe = x1 + (x2 - x1) * k, ye = y1 + (y2 - y1) * k;
    out.push(
      <g key={i}>
        <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={FWC_PENCIL} strokeWidth={3.4} strokeLinecap="round" strokeOpacity={0.88} />
        {/* graphite: a lighter second pass beside the first */}
        <line x1={x1 + 1.2} y1={y1 + 1} x2={xe + 1.2} y2={ye + 1} stroke="#6E6A65" strokeWidth={1.4} strokeLinecap="round" strokeOpacity={0.5} />
      </g>,
    );
  }
  return out;
}

export const FoulWarCourtSheet: React.FC<{ f: number; T: FoulWarT; courier: string; oswald: string; kalam: string }> = ({ f, T, courier, oswald, kalam }) => {
  const inK = prog(f, T.the1 - 4, 16, ease.out);
  if (inK <= 0) return null;
  const { kn, wa } = fwcTally(f, T);
  const landed = prog(f, T.again, 10, ease.out);
  const rowK = 86, rowW = 146;
  const n1 = Math.floor(kn + 0.02), n2 = Math.floor(wa + 0.02);
  const typed = (txt: string, at: number) => txt.slice(0, Math.max(0, Math.min(txt.length, Math.floor(((f - at) / 60) * (1000 / 34)))));
  return (
    <div
      style={{
        position: "absolute", left: 100, top: 1262 + (1 - inK) * 240, width: SW, height: SH,
        transform: `rotate(-0.8deg)`, opacity: inK, filter: `drop-shadow(0 14px 18px rgba(0,0,0,0.55))`,
      }}
    >
      {/* the cream sheet, its grain and a soft curl at the right */}
      <div style={{ position: "absolute", inset: 0, background: FWC_PAPER, borderRadius: 3 }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.5, background: "repeating-linear-gradient(97deg, rgba(120,100,70,0.08) 0 2px, transparent 2px 6px), repeating-linear-gradient(3deg, rgba(120,100,70,0.05) 0 1px, transparent 1px 9px)" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(90deg, rgba(0,0,0,0), rgba(70,50,20,0.16))" }} />
      <svg width={SW} height={SH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* printed rules and the head */}
        <line x1={20} y1={50} x2={SW - 20} y2={50} stroke={FAINT} strokeWidth={2} />
        <line x1={20} y1={54} x2={SW - 20} y2={54} stroke={FAINT} strokeWidth={1} />
        <line x1={20} y1={rowK + 30} x2={SW - 20} y2={rowK + 30} stroke={FAINT} strokeWidth={1.2} />
        <line x1={250} y1={56} x2={250} y2={SH - 10} stroke={FAINT} strokeWidth={1.2} />
        <line x1={770} y1={56} x2={770} y2={SH - 10} stroke={FAINT} strokeWidth={1.2} />
        <text x={24} y={38} fontFamily={courier} fontWeight={700} fontSize={32} fill={FWC_INK} letterSpacing={2}>{typed("TEAM FOULS", T.the1 + 4)}</text>
        <text x={SW - 24} y={38} textAnchor="end" fontFamily={courier} fontWeight={400} fontSize={26} fill={FAINT}>{typed("MAR. 2, 1962", T.the1 + 12)}</text>
        {/* the row heads: the Knicks mark and the PHILA jersey lettering */}
        <text x={96} y={rowK + 12} fontFamily={courier} fontWeight={700} fontSize={32} fill={FWC_INK}>KNICKS</text>
        <defs>
          <path id="fwc-phila-arc" d="M 40 168 Q 130 126 220 168" />
        </defs>
        <text fontFamily={oswald} fontWeight={700} fontSize={40} fill={FWC_INK} letterSpacing={3}>
          <textPath href="#fwc-phila-arc" startOffset="50%" textAnchor="middle">PHILA</textPath>
        </text>
        {/* the marks */}
        {marks(kn, rowK, 11)}
        {marks(wa, rowW, 53)}
        {/* the running count, pencilled; underlined once it lands on the box total */}
        {kn > 0.05 && (
          <text x={826} y={rowK + 16} textAnchor="middle" fontFamily={kalam} fontWeight={700} fontSize={50} fill={FWC_PENCIL}>{n1}</text>
        )}
        {wa > 0.05 && (
          <text x={826} y={rowW + 16} textAnchor="middle" fontFamily={kalam} fontWeight={700} fontSize={50} fill={FWC_PENCIL}>{n2}</text>
        )}
        {landed > 0 && (
          <>
            <path d={`M 792 ${rowK + 26} q ${34 * landed} 4 ${68 * landed} -2`} stroke={FWC_PENCIL} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d={`M 792 ${rowW + 26} q ${34 * landed} 4 ${68 * landed} -2`} stroke={FWC_PENCIL} strokeWidth={3} fill="none" strokeLinecap="round" />
          </>
        )}
      </svg>
      <div style={{ position: "absolute", left: 30, top: rowK - 26, width: 52, height: 52 }}>
        <Img src={staticFile("wilt-100/hershey-knicks-primary.svg")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      {/* the source, under the sheet */}
      <div style={{ position: "absolute", left: 6, top: SH + 16, fontFamily: "Inter, sans-serif", fontSize: 26, color: FWC_LABEL, opacity: prog(f, T.again, 12), whiteSpace: "nowrap" }}>
        Basketball-Reference box score, team fouls
      </div>
    </div>
  );
};
