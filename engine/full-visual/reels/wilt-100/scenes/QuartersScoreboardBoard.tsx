// wilt-100 "quarters": the end-wall scoreboard of Hershey Sports Arena, close. The same board `crowd` showed from far
// (black cabinet, WARRIORS and KNICKS painted white, 5 x 7 bulb digits, the quarter lamps 1 2 3 4), drawn at hero size
// from the 1938 and 2007 photos of this wall: a riveted sheet-steel frame on two chains, every bulb in its black
// collar (dead ones dark glass, lit ones warm white with a warm-up flash), a line score under the four lamps, the big
// totals dark (they light in `flood`), the WILT 13 split-flap panel docked in the bottom rail, the two horn speakers
// either side. Drawn in board units (1000 x 760) and mapped onto the cabinet's plane by the camera.
import React from "react";
import { ease, prog } from "../../../src/engine";
import {
  QS_AMBER, QS_BULB, QS_LINE, type QuartersT, type QsView, type V3, qsBoardMatrix, qsBoardPt, qsClamp, qsFlipAt, qsRnd,
} from "./QuartersScoreboardKit";

/** a 5 x 7 bulb font, as the period boards wired it */
const GLYPH: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
};

/** how lit one bulb is at frame f when it was switched on at `on`: the filament warms up, overshoots, settles */
function bulbK(f: number, on: number) {
  if (f < on) return 0;
  const t = f - on;
  return Math.min(1, t / 3) * (1 + 0.45 * Math.exp(-t / 5));
}

type Digit = { x: number; y: number; pitch: number; r: number; ch: string | null; on: number; seed: number };

const Bulbs: React.FC<{ d: Digit; f: number; flick: number }> = ({ d, f, flick }) => {
  const g = d.ch ? GLYPH[d.ch] : null;
  const out: React.ReactNode[] = [];
  for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) {
    const cx = d.x + c * d.pitch + d.pitch / 2, cy = d.y + r * d.pitch + d.pitch / 2;
    const want = g ? g[r][c] === "1" : false;
    // bulb by bulb, in the order the relay bank closes them: row by row, left to right, a hair of jitter
    const on = d.on + (r * 5 + c) * 0.55 + qsRnd(d.seed + r * 7 + c) * 1.5;
    const k = want ? bulbK(f, on) * (1 - flick * (0.35 + 0.65 * qsRnd(d.seed + f * 0.13 + r + c * 3))) : 0;
    out.push(<circle key={`c${r}${c}`} cx={cx} cy={cy} r={d.r * 1.32} fill="#060708" />);
    if (k > 0.02) {
      out.push(<circle key={`h${r}${c}`} cx={cx} cy={cy} r={d.r * 2.6} fill="url(#qsHalo)" opacity={Math.min(1, k)} />);
      out.push(<circle key={`l${r}${c}`} cx={cx} cy={cy} r={d.r} fill="url(#qsLit)" opacity={Math.min(1, 0.35 + 0.65 * k)} />);
      if (k > 1.05) out.push(<circle key={`x${r}${c}`} cx={cx} cy={cy} r={d.r * 0.8} fill="#FFFFFF" opacity={(k - 1) * 1.6} />);
    } else {
      out.push(<circle key={`d${r}${c}`} cx={cx} cy={cy} r={d.r} fill="url(#qsDead)" />);
      out.push(<circle key={`s${r}${c}`} cx={cx - d.r * 0.32} cy={cy - d.r * 0.34} r={d.r * 0.22} fill="rgba(255,255,255,0.16)" />);
    }
  }
  return <>{out}</>;
};

/** a number as bulb digits, right-aligned in `n` places */
function digits(v: number | null, n: number, x: number, y: number, pitch: number, gap: number, r: number, on: number, seed: number): Digit[] {
  const s = v === null ? "" : String(v);
  return Array.from({ length: n }, (_, i) => {
    const ch = s.length >= n - i ? s[i - (n - s.length)] : null;
    return { x: x + i * (5 * pitch + gap), y, pitch, r, ch, on: on + i * 6, seed: seed + i * 31 };
  });
}

/* ---------- the split-flap panel ---------- */
const FW = 66, FH = 96, GAP = 8;
const Face: React.FC<{ d: string; font: string }> = ({ d, font }) => (
  <>
    <rect x={0} y={0} width={FW} height={FH} rx={7} fill="url(#qsFlap)" />
    <text x={FW / 2} y={FH / 2 + 28} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={78} fill="#F4F4F2">{d.trim()}</text>
  </>
);
const Flap: React.FC<{ from: string; to: string; k: number; font: string; tremble: number }> = ({ from, to, k, font, tremble }) => {
  const moving = from !== to && k < 1;
  const h = FH / 2;
  return (
    <g transform={`translate(0 ${tremble.toFixed(2)})`}>
      <rect x={-2} y={3} width={FW + 4} height={FH + 2} rx={8} fill="rgba(0,0,0,0.55)" />
      <g clipPath="url(#qsTop)"><Face d={to} font={font} /></g>
      {moving && <rect x={0} y={0} width={FW} height={h} fill={`rgba(0,0,0,${(0.35 * (1 - k)).toFixed(3)})`} />}
      <g clipPath="url(#qsBot)"><Face d={moving && k < 0.5 ? from : to} font={font} /></g>
      {moving && k < 0.5 && (
        <g transform={`translate(0 ${h}) scale(1 ${(1 - 2 * k).toFixed(4)}) translate(0 ${-h})`}>
          <g clipPath="url(#qsTop)"><Face d={from} font={font} /></g>
          <rect x={0} y={0} width={FW} height={h} fill={`rgba(0,0,0,${(0.6 * k).toFixed(3)})`} />
        </g>
      )}
      {moving && k >= 0.5 && (
        <g transform={`translate(0 ${h}) scale(1 ${(2 * k - 1).toFixed(4)}) translate(0 ${-h})`}>
          <g clipPath="url(#qsBot)"><Face d={to} font={font} /></g>
          <rect x={0} y={h} width={FW} height={h} fill={`rgba(0,0,0,${(0.45 * (1 - k)).toFixed(3)})`} />
        </g>
      )}
      <rect x={0} y={h - 1} width={FW} height={2} fill="#000" />
      <rect x={2} y={h - 4} width={4} height={8} rx={2} fill="#3A3C40" />
      <rect x={FW - 6} y={h - 4} width={4} height={8} rx={2} fill="#3A3C40" />
    </g>
  );
};
const pad3 = (v: number) => String(v).padStart(3, " ").split("");

/* ---------- the board ---------- */
export const QS_COLS = [385, 535, 685, 835];

export function qsBoardTimes(T: QuartersT) {
  return {
    col: [T.n23, T.n41, T.n69], // each line score column starts lighting on its number
    lamp: [T.quarter, T.half, T.three],
  };
}

/** how many bulbs are lit (0..1), for the warm light the board throws on the wall */
export function qsBoardGlow(f: number, T: QuartersT) {
  const t = qsBoardTimes(T);
  return 0.25 * prog(f, t.col[0], 30) + 0.25 * prog(f, t.col[1], 30) + 0.3 * prog(f, t.col[2], 30) + 0.06 * (prog(f, t.lamp[0], 6) + prog(f, t.lamp[1], 6) + prog(f, t.lamp[2], 6));
}

export const QuartersScoreboardBoard: React.FC<{ f: number; T: QuartersT; V: QsView; swing: number; font: string; flapsShown: boolean }> = ({ f, T, V, swing, font, flapsShown }) => {
  const M = qsBoardMatrix(V, swing);
  const M0 = qsBoardMatrix(V, 0);
  const t = qsBoardTimes(T);
  // the crowd's roar on "Wilt!": the bulbs dip and flare for a few frames
  const fl = f >= T.wilt && f < T.wilt + 14 ? (0.5 + 0.5 * Math.sin(f * 2.7)) * (1 - (f - T.wilt) / 14) : 0;
  const flick = fl * 0.8;

  const dg: Digit[] = [];
  // the totals: dark all scene long (they light for good in `flood`); on "Wilt!" the roar shakes the relays and the
  // running totals after three (125, 106) stutter on faintly for a moment
  const tot: Digit[] = [];
  const totOn = f >= T.wilt;
  tot.push(...digits(totOn ? 125 : null, 3, 78, 132, 20, 22, 7.2, T.wilt, 11));
  tot.push(...digits(totOn ? 106 : null, 3, 578, 132, 20, 22, 7.2, T.wilt + 2, 41));
  const totK = totOn ? Math.max(0, 0.5 + 0.5 * Math.sin((f - T.wilt) * 1.7) * Math.sin((f - T.wilt) * 0.61 + 1)) * (0.25 + 0.3 * Math.exp(-(f - T.wilt) / 10)) : 0;
  dg.push(...digits(null, 3, 78, 132, 20, 22, 7.2, 1e9, 11));
  dg.push(...digits(null, 3, 578, 132, 20, 22, 7.2, 1e9, 41));
  // the line score: two bulb digits per quarter, per team, lit on each spoken number
  QS_COLS.forEach((cx, q) => {
    const on = q < 3 ? t.col[q] : 1e9;
    const w = 2 * 5 * 10 + 12;
    dg.push(...digits(q < 3 && f >= on ? QS_LINE.PHW[q] : null, 2, cx - w / 2, 410, 10, 12, 3.7, on, 100 + q * 17));
    dg.push(...digits(q < 3 && f >= on + 8 ? QS_LINE.NYK[q] : null, 2, cx - w / 2, 500, 10, 12, 3.7, on + 8, 300 + q * 17));
  });

  const flip = qsFlipAt(f, T);
  const a = pad3(flip.prev), b = pad3(flip.val);
  const landed = (at: number) => (f >= at ? Math.exp(-(f - at) / 5) * Math.sin((f - at) * 1.9) : 0);
  const tremble = 3 * (landed(T.n23) + landed(T.n41) + 1.6 * landed(T.n69)) + (fl > 0 ? 2.2 * Math.sin(f * 3.1) * fl : 0);

  const paint = "#ECE7DC";
  const rivets: React.ReactNode[] = [];
  for (let i = 0; i < 33; i++) {
    const x = 14 + i * 30.3;
    rivets.push(<circle key={`rt${i}`} cx={x} cy={9} r={3} fill="url(#qsRivet)" />, <circle key={`rb${i}`} cx={x} cy={751} r={3} fill="url(#qsRivet)" />);
  }
  for (let i = 1; i < 25; i++) {
    const y = 9 + i * 30.1;
    rivets.push(<circle key={`rl${i}`} cx={9} cy={y} r={3} fill="url(#qsRivet)" />, <circle key={`rr${i}`} cx={991} cy={y} r={3} fill="url(#qsRivet)" />);
  }

  // the chains: from the two eyes on the cabinet's top rail up into the dark of the vault
  const chain = (u: number) => {
    const p0: V3 = qsBoardPt(u, -14, swing);
    const p1: V3 = [p0[0] * 0.9, 27.5, p0[2] + 0.1];
    const links: React.ReactNode[] = [];
    const n = 46;
    for (let i = 0; i < n; i++) {
      const k = i / n;
      const p = V.P([p0[0] + (p1[0] - p0[0]) * k, p0[1] + (p1[1] - p0[1]) * k, p0[2] + (p1[2] - p0[2]) * k]);
      const q = V.P([p0[0] + (p1[0] - p0[0]) * (k + 1 / n), p0[1] + (p1[1] - p0[1]) * (k + 1 / n), p0[2] + (p1[2] - p0[2]) * (k + 1 / n)]);
      if (p.z < 0.5) continue;
      const len = Math.hypot(q.x - p.x, q.y - p.y), ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
      const sw = Math.max(0.6, p.s * 0.035);
      links.push(
        i % 2 === 0
          ? <ellipse key={i} cx={(p.x + q.x) / 2} cy={(p.y + q.y) / 2} rx={len * 0.62} ry={Math.max(0.8, p.s * 0.05)} transform={`rotate(${ang.toFixed(1)} ${((p.x + q.x) / 2).toFixed(1)} ${((p.y + q.y) / 2).toFixed(1)})`} fill="none" stroke="#7D838B" strokeWidth={sw} />
          : <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#5D636B" strokeWidth={sw * 1.4} />,
      );
    }
    return links;
  };
  // the power cable, slack, from the top rail up beside the right chain
  const cab = (() => {
    const pts: string[] = [];
    for (let i = 0; i <= 24; i++) {
      const k = i / 24;
      const b0 = qsBoardPt(870, 0, swing);
      const p = V.P([b0[0] + 0.5 * k + 0.3 * Math.sin(k * Math.PI), b0[1] + (28 - b0[1]) * k - 0.4 * Math.sin(k * Math.PI), b0[2] + 0.05]);
      if (p.z < 0.5) return "";
      pts.push(`${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
    }
    return pts.join(" ");
  })();
  const sc = V.P(qsBoardPt(500, 380, swing)).s;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <radialGradient id="qsDead" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#3A3D41" />
          <stop offset="60%" stopColor="#1E2023" />
          <stop offset="100%" stopColor="#111214" />
        </radialGradient>
        <radialGradient id="qsLit" cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor={QS_BULB} />
          <stop offset="100%" stopColor="#E7A651" />
        </radialGradient>
        <radialGradient id="qsHalo">
          <stop offset="0%" stopColor="rgba(255,214,150,0.55)" />
          <stop offset="100%" stopColor="rgba(255,214,150,0)" />
        </radialGradient>
        <radialGradient id="qsRivet" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#8A9098" />
          <stop offset="100%" stopColor="#2A2E33" />
        </radialGradient>
        <linearGradient id="qsFlap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E2024" />
          <stop offset="49%" stopColor="#111215" />
          <stop offset="51%" stopColor="#050506" />
          <stop offset="100%" stopColor="#15161A" />
        </linearGradient>
        <linearGradient id="qsSteel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B4047" />
          <stop offset="50%" stopColor="#23272C" />
          <stop offset="100%" stopColor="#30353B" />
        </linearGradient>
        <linearGradient id="qsPanel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#121417" />
          <stop offset="100%" stopColor="#0A0B0D" />
        </linearGradient>
        <radialGradient id="qsHorn" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#050506" />
          <stop offset="55%" stopColor="#1B1E22" />
          <stop offset="85%" stopColor="#4A5058" />
          <stop offset="100%" stopColor="#2A2E33" />
        </radialGradient>
        <linearGradient id="qsSheen" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset={`${qsClamp((f - T.born) / 520 - 0.15, 0, 1)}`} stopColor="rgba(255,255,255,0)" />
          <stop offset={`${qsClamp((f - T.born) / 520, 0, 1)}`} stopColor="rgba(255,248,235,0.06)" />
          <stop offset={`${qsClamp((f - T.born) / 520 + 0.15, 0, 1)}`} stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id="qsTop"><rect x={0} y={0} width={FW} height={FH / 2} /></clipPath>
        <clipPath id="qsBot"><rect x={0} y={FH / 2} width={FW} height={FH / 2} /></clipPath>
      </defs>

      {/* the two horn speakers on the end wall, either side of the board (the 2007 photo) */}
      <g transform={M0}>
        {[-190, 1050].map((x) => (
          <g key={x} transform={`translate(${x} 140)`}>
            <rect x={0} y={0} width={140} height={140} rx={6} fill="#2B2F34" stroke="#3E434A" strokeWidth={4} />
            <circle cx={70} cy={70} r={56} fill="url(#qsHorn)" />
            <circle cx={70} cy={70} r={14} fill="#0B0C0E" stroke="#3E434A" strokeWidth={2} />
            <path d="M70 70 L 112 52" stroke="#5A6068" strokeWidth={3} />
            <rect x={60} y={-90} width={20} height={90} fill="#24282D" />
          </g>
        ))}
      </g>

      {/* the end wall under the board (2007 and 2024 photos): a concrete ledge on steel brackets, the horns' conduits
          clamped down the wall to a pull box, and the board's feed into it */}
      <g transform={M0}>
        {[-120, 230, 770, 1120].map((u) => (
          <g key={u}>
            <path d={`M${u - 22} 822 L${u + 22} 822 L${u + 22} 832 L${u - 12} 832 Z`} fill="#2A2E33" />
            <path d={`M${u - 6} 822 L${u + 6} 822 L${u + 6} 930 L${u - 6} 930 Z`} fill="#2A2E33" />
            {/* seen head-on, a knee bracket is its wall strap and the edge of its brace: a strap, bolts, a shadow */}
            <rect x={u + 6} y={832} width={10} height={98} fill="rgba(0,0,0,0.35)" />
            <rect x={u - 3} y={832} width={4} height={98} fill="#4A5058" />
            {[858, 904].map((v) => <circle key={v} cx={u} cy={v} r={4} fill="url(#qsRivet)" />)}
            <circle cx={u} cy={834} r={3} fill="url(#qsRivet)" />
          </g>
        ))}
        <rect x={-260} y={792} width={1520} height={30} fill="#3A3E44" />
        <rect x={-260} y={792} width={1520} height={6} fill="#5A6068" />
        <rect x={-260} y={822} width={1520} height={26} fill="rgba(0,0,0,0.35)" />
        {[-120, 1120].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 280 L${x} 760 Q${x} 790 ${x + (i ? -30 : 30)} 790`} stroke="#1A1C20" strokeWidth={12} fill="none" />
            <path d={`M${x - 3} 280 L${x - 3} 760`} stroke="rgba(255,240,215,0.10)" strokeWidth={3} />
            <path d={`M${x} 848 L${x} 1040 Q${x} 1070 ${x + (i ? -30 : 30)} 1070 L${i ? 560 : 440} 1070`} stroke="#1A1C20" strokeWidth={12} fill="none" />
            {[360, 460, 560, 660, 900, 990].map((v) => <rect key={v} x={x - 12} y={v - 4} width={24} height={8} rx={2} fill="#4A5058" />)}
          </g>
        ))}
        <path d="M870 848 L870 1010 Q870 1040 840 1040 L560 1040" stroke="#15171A" strokeWidth={9} fill="none" />
        {/* the lamp circuit and the horn feed, clamped down the wall into the same pull box */}
        <path d="M120 848 L120 1000 Q120 1040 160 1040 L430 1040" stroke="#1A1C20" strokeWidth={11} fill="none" />
        <path d="M117 848 L117 1000" stroke="rgba(255,240,215,0.12)" strokeWidth={3} />
        <path d="M150 848 L150 990 Q150 1020 180 1020 L430 1020" stroke="#202328" strokeWidth={7} fill="none" />
        {[880, 940].map((v) => <rect key={v} x={106} y={v} width={58} height={9} rx={2} fill="#4A5058" />)}
        {[890, 950].map((v) => <rect key={v} x={858} y={v} width={24} height={8} rx={2} fill="#4A5058" />)}
        <rect x={430} y={1010} width={140} height={110} rx={4} fill="#2B2F34" stroke="#3E434A" strokeWidth={4} />
        {[[442, 1022], [558, 1022], [442, 1108], [558, 1108]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={4} fill="url(#qsRivet)" />)}
      </g>

      {chain(200)}
      {chain(800)}
      {cab && <path d={cab} stroke="#15171A" strokeWidth={Math.max(1, sc * 0.07)} fill="none" strokeLinecap="round" />}

      <g transform={M}>
        {/* the shadow on the wall behind the cabinet */}
        <rect x={18} y={26} width={1000} height={760} rx={12} fill="rgba(0,0,0,0.45)" />
        {/* the chain eyes */}
        {[200, 800].map((u) => <g key={u}><rect x={u - 16} y={-26} width={32} height={30} rx={4} fill="#2B2F34" /><circle cx={u} cy={-14} r={8} fill="none" stroke="#7D838B" strokeWidth={4} /></g>)}
        {/* the sheet-steel frame and the black panel */}
        <rect x={0} y={0} width={1000} height={760} rx={10} fill="url(#qsSteel)" />
        <rect x={18} y={18} width={964} height={724} rx={4} fill="url(#qsPanel)" />
        <rect x={18} y={18} width={964} height={724} rx={4} fill="none" stroke="#050607" strokeWidth={3} />
        {rivets}
        {/* painted names, a little worn */}
        <text x={250} y={104} fill={paint} fontFamily={font} fontWeight={800} fontSize={66} letterSpacing={5} textAnchor="middle">WARRIORS</text>
        <text x={750} y={104} fill={paint} fontFamily={font} fontWeight={800} fontSize={66} letterSpacing={5} textAnchor="middle">KNICKS</text>
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={`w${i}`} cx={qsRnd(i * 3.1) < 0.5 ? 60 + qsRnd(i) * 380 : 560 + qsRnd(i) * 380} cy={60 + qsRnd(i * 7.7) * 50} r={0.8 + qsRnd(i * 1.3) * 1.6} fill="#0E1012" />
        ))}
        <line x1={500} y1={40} x2={500} y2={290} stroke="#2A2E33" strokeWidth={4} />
        {/* the maker's plate between the totals */}
        <rect x={452} y={180} width={96} height={40} rx={3} fill="#6B5A3A" stroke="#2A2418" strokeWidth={2} />
        {[0, 1, 2].map((i) => <line key={i} x1={462} x2={538} y1={192 + i * 9} y2={192 + i * 9} stroke="#3A3020" strokeWidth={2} />)}
        {/* the line score: painted rails, the quarter lamps as column heads */}
        <line x1={40} x2={960} y1={308} y2={308} stroke="#2A2E33" strokeWidth={3} />
        <text x={70} y={364} fill={paint} fontFamily={font} fontWeight={700} fontSize={34} letterSpacing={4}>QUARTER</text>
        <text x={70} y={458} fill={paint} fontFamily={font} fontWeight={700} fontSize={34} letterSpacing={3}>WARRIORS</text>
        <text x={70} y={548} fill={paint} fontFamily={font} fontWeight={700} fontSize={34} letterSpacing={3}>KNICKS</text>
        {[310, 460, 610, 760, 910].map((x) => <line key={x} x1={x} x2={x} y1={318} y2={580} stroke="#24272B" strokeWidth={3} />)}
        <line x1={40} x2={960} y1={490} y2={490} stroke="#1E2125" strokeWidth={2} />
        {QS_COLS.map((x, i) => {
          const lit = i < 3 ? prog(f, t.lamp[i], 5, ease.out) * (1 + 0.4 * Math.exp(-Math.max(0, f - t.lamp[i]) / 6)) * (1 - flick * 0.5) : 0;
          const recorded = i === 3; // the radio's quarter, amber-rimmed as in `crowd`, not lit yet
          return (
            <g key={x}>
              <circle cx={x} cy={352} r={36} fill="#17191C" stroke="#3A3F46" strokeWidth={4} />
              {lit > 0.02 && <circle cx={x} cy={352} r={36 + 30 * Math.min(1, lit)} fill="url(#qsHalo)" />}
              <circle cx={x} cy={352} r={30} fill={lit > 0.02 ? "url(#qsLit)" : recorded ? "#2A2416" : "#222428"} opacity={lit > 0.02 ? Math.min(1, 0.3 + 0.7 * lit) : 1} stroke={recorded ? QS_AMBER : "none"} strokeOpacity={0.45} strokeWidth={2} />
              <circle cx={x - 10} cy={341} r={7} fill="rgba(255,255,255,0.10)" />
              <text x={x} y={367} fill={lit > 0.5 ? "#3A2A10" : "#5A5F66"} fontFamily={font} fontWeight={800} fontSize={42} textAnchor="middle">{i + 1}</text>
            </g>
          );
        })}
        {/* every bulb */}
        {dg.map((d, i) => <Bulbs key={i} d={d} f={f} flick={flick} />)}
        {totK > 0.01 && <g opacity={totK}>{tot.map((d, i) => <Bulbs key={i} d={d} f={f} flick={0} />)}</g>}
        {/* the bottom rail and the WILT 13 player panel docked in it */}
        <line x1={40} x2={960} y1={592} y2={592} stroke="#2A2E33" strokeWidth={3} />
        <rect x={330} y={600} width={340} height={138} rx={6} fill="#08090A" stroke="#2C3036" strokeWidth={5} />
        <text x={500} y={629} fill="#8B949E" fontFamily={font} fontWeight={700} fontSize={22} letterSpacing={7} textAnchor="middle">WILT   13</text>
        {flapsShown && b.map((d, j) => (
          <g key={j} transform={`translate(${393 + j * (FW + GAP)} 636)`}>
            <Flap from={a[j]} to={d} k={flip.k} font={font} tremble={tremble * (j === 1 ? 1 : 0.7)} />
          </g>
        ))}
        {!flapsShown && [0, 1, 2].map((j) => <rect key={j} x={393 + j * (FW + GAP)} y={636} width={FW} height={FH} rx={7} fill="#0C0D0F" />)}
        {/* light travelling over the steel: a soft sheen moving left to right */}
        <rect x={0} y={0} width={1000} height={760} rx={10} fill="url(#qsSheen)" opacity={0.5} />
      </g>
    </svg>
  );
};

/** where the WILT panel's flaps sit on screen (centre, and the px size of one board unit) */
export function qsPanelOnScreen(V: QsView, swing: number) {
  const c = V.P(qsBoardPt(500, 684, swing));
  const r = V.P(qsBoardPt(600, 684, swing));
  return { x: c.x, y: c.y, unit: (r.x - c.x) / 100 };
}
