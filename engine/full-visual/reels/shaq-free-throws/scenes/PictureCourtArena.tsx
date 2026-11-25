// The bowl around the half court, read off the arena photo (Capital One Arena from the upper deck, Daniel Lobo, CC0):
// two bowls of tiered seats packed with people (dark clothes, white and team shirts, skin), a ribbon of LED board
// between the bowls, the aisles, the dark rafters above. Every spectator is a point in the world, projected by the
// same camera as the floor, so the stands rise and turn with the court. `rise` lifts the tiers out of the floor,
// `dark` turns the house lights off, `flash` sets off 2000-era camera flashes (small white bursts, no phone screens).
import React from "react";
import { PC_BASE, PC_FANS, PC_HALF, PC_SIDE, pcPoly3 as poly3, type PcProj } from "./PictureCourtWorld";

// shirts in a Lakers crowd: dark, grey, white, purple, gold, skin tones, a few reds
const PC_SHIRTS = ["#1B1E25", "#24272F", "#30343D", "#1F2229", "#9EA3AB", "#C9C6C0", "#47306B", "#A27B2C", "#7E3330"];

export const PictureCourtArena: React.FC<{ P: PcProj; f: number; rise: number; dark: number; flash: number; flashFrom: number }> = ({ P, f, rise, dark, flash, flashFrom }) => {
  if (rise <= 0.001) return null;
  const buckets: string[] = PC_SHIRTS.map(() => "");
  let heads = "";
  let flashes: { x: number; y: number; r: number; a: number }[] = [];
  // draw far to near is not needed for points; size by depth
  for (let i = 0; i < PC_FANS.length; i++) {
    const p = PC_FANS[i];
    // the rows rise one after another from the floor
    const k = Math.max(0, Math.min(1, rise * 1.6 - (p.row / 22) * 0.6));
    if (k <= 0) continue;
    const z = p.z * k;
    const v = P.cam(p.x, p.y, z + 1.2);
    if (v[2] < 2) continue;
    const q = P.scr(v);
    if (q.x < -20 || q.x > 1100 || q.y < 380 || q.y > 1950) continue;
    const w = Math.max(1, q.s * 0.78), h = Math.max(1.2, q.s * 1.2);
    buckets[p.b] += `M${(q.x - w / 2).toFixed(1)} ${q.y.toFixed(1)}h${w.toFixed(1)}v${h.toFixed(1)}h${(-w).toFixed(1)}z`;
    const hr = Math.max(0.5, q.s * 0.3);
    heads += `M${(q.x - hr).toFixed(1)} ${(q.y - hr * 0.9).toFixed(1)}a${hr.toFixed(1)} ${hr.toFixed(1)} 0 1 0 ${(2 * hr).toFixed(1)} 0a${hr.toFixed(1)} ${hr.toFixed(1)} 0 1 0 ${(-2 * hr).toFixed(1)} 0z`;
    if (flash > 0 && p.flash > 0.985) {
      // each flash fires once for 5 frames at its own moment, a few per frame
      const t0 = flashFrom + ((p.flash - 0.985) / 0.015) * 70 + (i % 7) * 3;
      const a = f >= t0 && f < t0 + 6 ? 1 - (f - t0) / 6 : 0;
      if (a > 0) flashes.push({ x: q.x, y: q.y, r: Math.min(13, Math.max(5, q.s * 1.6)), a: a * flash });
    }
  }
  // the tier faces and the LED ribbon between the bowls
  const lowTop = 1.2 + 21 * 1.25 * Math.min(1, rise * 1.2) + 1.6;
  const upZ = (1.2 + 22 * 1.25 + 14) * Math.min(1, rise * 1.2);
  const runL = 9 + 22 * 2.75;
  const ribbon = [
    poly3(P, [[-34 - runL * 0.6, PC_BASE - runL, lowTop], [34 + runL * 0.6, PC_BASE - runL, lowTop], [34 + runL * 0.6, PC_BASE - runL, lowTop + 2.2], [-34 - runL * 0.6, PC_BASE - runL, lowTop + 2.2]]),
    ...[-1, 1].map((s) => poly3(P, [[s * (PC_SIDE + runL), PC_BASE - runL * 0.6, lowTop], [s * (PC_SIDE + runL), PC_HALF + 6, lowTop], [s * (PC_SIDE + runL), PC_HALF + 6, lowTop + 2.2], [s * (PC_SIDE + runL), PC_BASE - runL * 0.6, lowTop + 2.2]])),
  ];
  // the concrete rake under the seats, as dark slabs
  const rake = [
    poly3(P, [[-40, PC_BASE - 8, 0], [40, PC_BASE - 8, 0], [70, PC_BASE - runL - 10, upZ + 22], [-70, PC_BASE - runL - 10, upZ + 22]]),
    ...[-1, 1].map((s) => poly3(P, [[s * (PC_SIDE + 8), PC_BASE - 6, 0], [s * (PC_SIDE + 8), PC_HALF + 6, 0], [s * (PC_SIDE + runL + 30), PC_HALF + 6, upZ + 22], [s * (PC_SIDE + runL + 30), PC_BASE - runL, upZ + 22]])),
  ];
  const lit = 1 - dark * 0.82;
  const ledA = (0.75 - 0.6 * dark) * Math.min(1, rise * 1.4);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <filter id="pc-flash" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation={3} /></filter>
        <filter id="pc-crowd"><feGaussianBlur stdDeviation={0.7} /></filter>
        <filter id="pc-led" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation={4} /></filter>
      </defs>
      {rake.map((d, i) => <path key={`r${i}`} d={d} fill="#0A0E15" opacity={Math.min(1, rise * 1.5)} />)}
      <g opacity={lit} filter="url(#pc-crowd)">
        {buckets.map((d, i) => (d ? <path key={i} d={d} fill={PC_SHIRTS[i]} opacity={0.85} /> : null))}
        <path d={heads} fill="#5E4232" opacity={0.8} />
      </g>
      {ribbon.map((d, i) => (
        <g key={`l${i}`} opacity={ledA}>
          <path d={d} fill="#552583" />
          <path d={d} fill="#FDB927" opacity={0.35 + 0.15 * Math.sin(f / 11 + i)} filter="url(#pc-led)" />
        </g>
      ))}
      {flashes.map((q, i) => (
        <g key={`f${i}`}>
          <circle cx={q.x} cy={q.y} r={q.r * 2.4} fill="#EAF2FF" opacity={0.35 * q.a} filter="url(#pc-flash)" />
          <circle cx={q.x} cy={q.y} r={q.r * 0.6} fill="#FFFFFF" opacity={q.a} />
          <path d={`M${q.x - q.r * 2} ${q.y}H${q.x + q.r * 2}M${q.x} ${q.y - q.r * 1.4}V${q.y + q.r * 1.4}`} stroke="#FFFFFF" strokeWidth={1.2} opacity={0.7 * q.a} />
        </g>
      ))}
    </svg>
  );
};
