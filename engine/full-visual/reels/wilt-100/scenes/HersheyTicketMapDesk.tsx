// wilt-100 "hershey": what the ticket lies on while it is alone (lead-in to "Not"). The arena's own prints of the era,
// on a dark walnut table under a warm lamp: the real 1936 Hershey Sports Arena programme (HERSHEY HOCKEY CLUB, the
// barrel vault, "THE HERSHEY SPORTS ARENA" in red) big behind the ticket, and the 1940s Hersheypark linen postcard
// slid under its corner. Both public domain (assets/refs/CREDITS.md). A slow push and the lamp light drifting keep it
// alive; on "Not" the table drops away as the ticket rises and New York arrives.
import React from "react";
import { Img, staticFile } from "remotion";
import { ease, prog } from "../../../src/engine";
import { type HersheyT, htmRnd } from "./HersheyTicketMapKit";

const PRINT: React.CSSProperties = { position: "absolute", boxShadow: "0 18px 40px rgba(0,0,0,0.75), 0 2px 6px rgba(0,0,0,0.6)" };

export const HersheyTicketMapDesk: React.FC<{ f: number; T: HersheyT }> = ({ f, T }) => {
  if (f < T.born - 2) return null;
  const inK = prog(f, T.born, 14, ease.out);
  const out = prog(f, T.not - 6, 16, ease.inOut);
  if (out >= 1) return null;
  const life = (f - T.born) / 60;
  const push = 1.0 + life * 0.022; // a slow push in while the ticket is read
  // the lamp: a warm pool that drifts a little across the prints
  const lx = 520 + Math.sin(life * 0.9) * 40;
  const ly = 980 + Math.cos(life * 0.7) * 24;
  // the grain of the walnut table, fixed lines
  const grain = Array.from({ length: 34 }, (_, i) => ({
    y: 520 + i * 29 + htmRnd(i) * 14,
    a: 0.05 + htmRnd(i + 40) * 0.07,
    w: 1 + htmRnd(i + 80) * 2,
    bend: (htmRnd(i + 120) - 0.5) * 30,
  }));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: inK * (1 - out),
        transform: `translateY(${(out * 160).toFixed(1)}px) scale(${push.toFixed(4)})`,
        transformOrigin: "540px 1000px",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0, transparent 500px, #000 580px, #000 1400px, transparent 1480px)",
        maskImage: "linear-gradient(to bottom, transparent 0, transparent 500px, #000 580px, #000 1400px, transparent 1480px)",
      }}
    >
      {/* the table */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="htm-desk-wood" x1="0" x2="1" y1="0" y2="0.3">
            <stop offset="0" stopColor="#140D09" />
            <stop offset="0.5" stopColor="#24170F" />
            <stop offset="1" stopColor="#120B08" />
          </linearGradient>
        </defs>
        <rect x={0} y={480} width={1080} height={1020} fill="url(#htm-desk-wood)" />
        {grain.map((g, i) => (
          <path key={i} d={`M-20,${g.y} C300,${g.y + g.bend} 700,${g.y - g.bend} 1100,${g.y + g.bend * 0.5}`} stroke="#3A2516" strokeWidth={g.w} fill="none" opacity={g.a * 2.2} />
        ))}
      </svg>
      {/* the 1940s Hersheypark postcard, slid under the programme's corner */}
      <div style={{ ...PRINT, left: 520, top: 1150, width: 520, height: 315, transform: "rotate(7deg)", background: "#E9E1CC", padding: 10, boxSizing: "border-box" }}>
        <Img src={staticFile("wilt-100/hersheyticketmap-postcard-1940s.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.35) saturate(0.7) brightness(0.62)" }} />
      </div>
      {/* the 1936 programme of the Hershey Sports Arena */}
      <div style={{ ...PRINT, left: 540 - 330, top: 1000 - 430, width: 660, height: 861, transform: "rotate(-4deg)" }}>
        <Img src={staticFile("wilt-100/hersheyticketmap-programme-1936.jpg")} style={{ width: "100%", height: "100%", filter: "brightness(0.6) saturate(0.85)" }} />
        {/* the programme's own fold and wear */}
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: "rgba(0,0,0,0.25)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.22) 100%)" }} />
      </div>
      {/* the lamp: dark at the edges of the table, warm where the ticket is held */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 560px 520px at ${lx.toFixed(1)}px ${ly.toFixed(1)}px, rgba(255,205,140,0.10) 0%, rgba(13,17,23,0) 45%, rgba(13,17,23,0.55) 75%, rgba(13,17,23,0.9) 100%)`,
        }}
      />
    </div>
  );
};
