// wilt-100 "close": Pennsylvania at night, the same outline and rivers as the `hershey` scene, drawn in the camera's
// frame so the rise ends on it without a cut: Hershey stays where the arena was, the map grows out of the town as the
// camera climbs, and everything on it is dark except one amber point.
import React from "react";
import { ease, prog } from "../../../src/engine";
import {
  CW_AMBER, CW_CITIES, CW_DIM, CW_PA, CW_PX_PER_M_END, CW_SUSQ, CW_WBRANCH, type CloseWitnessesT, type CwView, cwClamp, cwMap,
  cwMapPath,
} from "./CloseWitnessesKit";

export const CloseWitnessesMap: React.FC<{ f: number; T: CloseWitnessesT; V: CwView; font: string }> = ({ f, T, V, font }) => {
  const k = cwClamp((Math.log(0.25) - Math.log(V.pxPerM)) / (Math.log(0.25) - Math.log(0.035)));
  if (k <= 0.001) return null;
  const s = V.pxPerM / CW_PX_PER_M_END;
  const at = (c: [number, number]) => { const [x, y] = cwMap(c); return { x: V.cx + x * s, y: V.cy + y * s }; };
  const tf = `translate(${V.cx.toFixed(2)} ${V.cy.toFixed(2)}) scale(${s.toFixed(5)})`;
  const endK = prog(f, T.saw - 6, 14, ease.out);
  // the point: one amber light where the arena is, a ring going out once as it lands on "saw"
  const ring = prog(f, T.saw, 30, ease.out);
  const breathe = 1 + 0.08 * Math.sin((f - T.saw) / 9);
  const hbg = at(CW_CITIES.harrisburg);
  const hbgK = cwClamp((s - 2.2) / 2) * cwClamp((60 - s) / 30);
  const city = (c: [number, number], name: string, anchor: "start" | "end", dx: number, dy: number) => {
    const p = at(c);
    return (
      <g opacity={endK * 0.95}>
        <circle cx={p.x} cy={p.y} r={6} fill="#4A5563" />
        <text x={p.x + dx} y={p.y + dy} textAnchor={anchor} fontFamily={font} fontWeight={500} fontSize={32} fill={CW_DIM}>{name}</text>
      </g>
    );
  };
  const h = at(CW_CITIES.hershey);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: k }}>
      <defs>
        <radialGradient id="cw-map-glow">
          <stop offset="0" stopColor={CW_AMBER} stopOpacity={0.6} />
          <stop offset="1" stopColor={CW_AMBER} stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={tf}>
        <path d={cwMapPath(CW_PA, true)} fill="#111821" stroke="#56616E" strokeWidth={2.2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <path d={cwMapPath(CW_SUSQ)} fill="none" stroke="#2F3B48" strokeWidth={2.2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <path d={cwMapPath(CW_WBRANCH)} fill="none" stroke="#2F3B48" strokeWidth={1.8} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </g>
      <g opacity={hbgK}>
        <circle cx={hbg.x} cy={hbg.y} r={6} fill="#4A5563" />
        <text x={hbg.x - 16} y={hbg.y - 16} textAnchor="end" fontFamily={font} fontWeight={500} fontSize={32} fill={CW_DIM}>Harrisburg</text>
      </g>
      {city(CW_CITIES.philadelphia, "Philadelphia", "end", 8, 74)}
      {city(CW_CITIES.pittsburgh, "Pittsburgh", "start", 14, -16)}
      <circle cx={h.x} cy={h.y} r={60 * breathe} fill="url(#cw-map-glow)" />
      <circle cx={h.x} cy={h.y} r={8 + 70 * ring} fill="none" stroke={CW_AMBER} strokeWidth={2.5} opacity={(1 - ring) * 0.8 * (f >= T.saw ? 1 : 0)} />
      <circle cx={h.x} cy={h.y} r={7.5} fill={CW_AMBER} />
      <g opacity={endK}>
        <line x1={h.x - 12} y1={h.y - 12} x2={h.x - 40} y2={h.y - 40} stroke={CW_DIM} strokeWidth={1.5} opacity={0.8} />
        <text x={h.x - 48} y={h.y - 48} textAnchor="end" fontFamily={font} fontWeight={500} fontSize={32} fill={CW_DIM}>Hershey</text>
      </g>
    </svg>
  );
};
