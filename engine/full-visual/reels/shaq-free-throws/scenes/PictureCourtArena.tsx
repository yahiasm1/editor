// The bowl around the half court, read off the arena photo (Capital One Arena from the upper deck, Daniel Lobo, CC0):
// two bowls of tiered seats packed with people (mostly dark clothes, greys, some white and team shirts, skin), a
// ribbon of LED board between the bowls carrying the colour, the aisles, the dark rafters above. Every spectator is a
// point in the world, projected by the same camera as the floor, so the stands rise and turn with the court. People
// are not a grid: each is a different size, sits a little higher or lower, overlaps the next, and the stands are out
// of focus (more so the nearer they are) so the court and Shaq stay the sharp, bright things. `rise` lifts the tiers
// out of the floor, `dark` turns the house lights off. layer "flashes" draws only the 2000-era camera flashes (small
// white bursts, no phone screens), so they can sit above the house darkness.
import React from "react";
import { PC_BASE, PC_FANS, PC_HALF, PC_SIDE, pcPoly3 as poly3, pcRnd, type PcProj } from "./PictureCourtWorld";

// shirts in a Lakers crowd, read off the arena photo: mostly dark clothes, greys, some white, purple and gold, a few reds
const PC_SHIRTS = ["#14171D", "#1A1D23", "#202329", "#272A31", "#33363E", "#6E727A", "#9C9993", "#3A2856", "#7A5E24", "#5E2A28"];
const PC_SHIRT_W = [5, 5, 4, 4, 3, 2, 2, 2, 2, 1];
// heads: skin tones, hair and caps
const PC_HEADS = ["#4A3022", "#7A5038", "#A87B5A", "#241A14"];
// soft focus: the camera is sharp on him, so the stands are out of focus, more so the nearer (bigger) they are
const PC_BLURS = [0.6, 1.3, 2.4];

function pictureCourtPick(r: number): number {
  const tot = PC_SHIRT_W.reduce((a, b) => a + b, 0);
  let x = r * tot;
  for (let i = 0; i < PC_SHIRT_W.length; i++) {
    x -= PC_SHIRT_W[i];
    if (x < 0) return i;
  }
  return 0;
}

export const PictureCourtArena: React.FC<{ P: PcProj; f: number; rise: number; dark: number; flash: number; flashFrom: number; layer?: "house" | "flashes" }> = ({ P, f, rise, dark, flash, flashFrom, layer = "house" }) => {
  if (rise <= 0.001) return null;
  // per focus level: one path per shirt colour, one per head colour
  const bodies: string[][] = PC_BLURS.map(() => PC_SHIRTS.map(() => ""));
  const heads: string[][] = PC_BLURS.map(() => PC_HEADS.map(() => ""));
  const flashes: { x: number; y: number; r: number; a: number }[] = [];
  for (let i = 0; i < PC_FANS.length; i++) {
    const p = PC_FANS[i];
    // the rows rise one after another from the floor
    const k = Math.max(0, Math.min(1, rise * 1.6 - (p.row / 22) * 0.6));
    if (k <= 0) continue;
    // people are not a grid: some sit lower, some lean, every size
    const sz = 0.78 + pcRnd(i, 41) * 0.5;
    const z = p.z * k + (pcRnd(i, 42) - 0.5) * 0.5;
    const v = P.cam(p.x + (pcRnd(i, 43) - 0.5) * 0.7, p.y + (pcRnd(i, 44) - 0.5) * 0.7, z + 1.2);
    if (v[2] < 2) continue;
    const q = P.scr(v);
    if (q.x < -30 || q.x > 1110 || q.y < 380 || q.y > 1960) continue;
    if (layer === "flashes") {
      if (flash > 0 && p.flash > 0.95) {
        // each flash fires once for 7 frames at its own moment, a few per frame
        const t0 = flashFrom + ((p.flash - 0.95) / 0.05) * 36 + (i % 7) * 3;
        const a = f >= t0 && f < t0 + 7 ? 1 - (f - t0) / 7 : 0;
        if (a > 0) flashes.push({ x: q.x, y: q.y, r: Math.min(11, Math.max(5, q.s * 1.3)), a: a * flash });
      }
      continue;
    }
    const lvl = q.s < 7 ? 0 : q.s < 16 ? 1 : 2;
    const rx = Math.max(0.6, q.s * 0.52 * sz), ry = Math.max(0.6, q.s * 0.42 * sz);
    const bh = Math.max(1, q.s * 0.75 * sz);
    const b = pictureCourtPick(pcRnd(i, 45));
    // shoulders as a half ellipse over the torso, so neighbours overlap like a packed row
    bodies[lvl][b] += `M${(q.x - rx).toFixed(1)} ${(q.y + ry * 0.4).toFixed(1)}a${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 1 ${(2 * rx).toFixed(1)} 0v${bh.toFixed(1)}h${(-2 * rx).toFixed(1)}z`;
    const hr = Math.max(0.5, q.s * 0.26 * (0.85 + pcRnd(i, 46) * 0.3));
    const hx = q.x + (pcRnd(i, 47) - 0.5) * rx * 0.5, hy = q.y - hr * 0.5;
    const hc = Math.floor(pcRnd(i, 48) * PC_HEADS.length);
    heads[lvl][hc] += `M${(hx - hr).toFixed(1)} ${hy.toFixed(1)}a${hr.toFixed(1)} ${(hr * 1.15).toFixed(1)} 0 1 0 ${(2 * hr).toFixed(1)} 0a${hr.toFixed(1)} ${(hr * 1.15).toFixed(1)} 0 1 0 ${(-2 * hr).toFixed(1)} 0z`;
  }
  if (layer === "flashes") {
    return (
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="pc-flash" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation={4} /></filter>
        </defs>
        {flashes.map((q, i) => (
          <g key={`f${i}`}>
            <circle cx={q.x} cy={q.y} r={q.r * 2.8} fill="#EAF2FF" opacity={0.45 * q.a} filter="url(#pc-flash)" />
            <circle cx={q.x} cy={q.y} r={q.r * 0.7} fill="#FFFFFF" opacity={q.a} />
            <path d={`M${q.x - q.r * 2.6} ${q.y}H${q.x + q.r * 2.6}M${q.x} ${q.y - q.r * 1.8}V${q.y + q.r * 1.8}`} stroke="#FFFFFF" strokeWidth={1.2} opacity={0.55 * q.a} />
          </g>
        ))}
      </svg>
    );
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
  const lit = 0.72 * (1 - dark * 0.96);
  const ledA = (1 - 0.75 * dark) * Math.min(1, rise * 1.4);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        {PC_BLURS.map((bl, l) => (
          <filter key={l} id={`pc-crowd${l}`} x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={bl} /></filter>
        ))}
        <filter id="pc-led" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation={5} /></filter>
      </defs>
      {rake.map((d, i) => <path key={`r${i}`} d={d} fill="#080B11" opacity={Math.min(1, rise * 1.5)} />)}
      {PC_BLURS.map((_, l) => (
        <g key={`c${l}`} opacity={lit} filter={`url(#pc-crowd${l})`}>
          {bodies[l].map((d, i) => (d ? <path key={i} d={d} fill={PC_SHIRTS[i]} /> : null))}
          {heads[l].map((d, i) => (d ? <path key={`h${i}`} d={d} fill={PC_HEADS[i]} opacity={0.9} /> : null))}
        </g>
      ))}
      {ribbon.map((d, i) => (
        <g key={`l${i}`} opacity={ledA}>
          <path d={d} fill="#552583" />
          <path d={d} fill="#FDB927" opacity={0.4 + 0.15 * Math.sin(f / 11 + i)} filter="url(#pc-led)" />
          <path d={d} fill="none" stroke="#FFE7A8" strokeWidth={1.2} opacity={0.5} />
        </g>
      ))}
    </svg>
  );
};
