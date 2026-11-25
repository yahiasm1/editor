// wilt-100 "photo": the real Graflex Speed Graphic with its flash gun (cut out of the FBI's public domain photo, not
// redrawn), and in its reflector a press bulb as in the Sylvania Press 25 photo: clear glass packed with a tangle of
// shredded foil wire, on a brass base. On "snapped" it fires (the reel's amber, a witness) and goes milky, spent.
import React from "react";
import { PD_AMBER, PD_DIM, PD_HAIR, pdClamp, pdRnd } from "./PhotoDevelopingKit";

export const PD_CAM = { w: 641, h: 855, bulb: [152.2, 157.8] as [number, number], refl: 148 };

export type CamView = { x: number; y: number; s: number; rot: number };

/** the bulb centre in screen px */
export const pdBulbAt = (V: CamView): [number, number] => {
  const r = (V.rot * Math.PI) / 180;
  const bx = PD_CAM.bulb[0] * V.s, by = PD_CAM.bulb[1] * V.s;
  return [V.x + bx * Math.cos(r) - by * Math.sin(r), V.y + bx * Math.sin(r) + by * Math.cos(r)];
};

const Bulb: React.FC<{ spent: number; fire: number }> = ({ spent, fire }) => {
  const wires = Array.from({ length: 46 }, (_, i) => {
    const a = pdRnd(i * 3.3) * Math.PI * 2, r = pdRnd(i * 1.7) * 26;
    const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.9;
    const b = pdRnd(i * 9.1) * Math.PI;
    return `M ${x.toFixed(1)} ${y.toFixed(1)} q ${(Math.cos(b) * 8).toFixed(1)} ${(Math.sin(b) * 8).toFixed(1)} ${(Math.cos(b + 1) * 12).toFixed(1)} ${(Math.sin(b + 1) * 6).toFixed(1)}`;
  });
  return (
    <g>
      {/* brass base going back into the socket */}
      <rect x={-12} y={26} width={24} height={14} rx={3} fill="#B08A3E" />
      {[29, 33, 37].map((yy) => <line key={yy} x1={-12} y1={yy} x2={12} y2={yy} stroke="#6E5420" strokeWidth={1.2} />)}
      {/* the glass globe */}
      <circle r={34} fill={`rgba(230,235,240,${(0.18 + 0.7 * spent).toFixed(3)})`} stroke="rgba(255,255,255,0.55)" strokeWidth={1.6} />
      {/* the foil wire inside: bright before, scorched after */}
      <g stroke={spent > 0.5 ? "rgba(90,85,80,0.6)" : "rgba(240,242,245,0.85)"} strokeWidth={1.1} fill="none">
        {wires.map((d, i) => <path key={i} d={d} />)}
      </g>
      {/* milky film and soot of a spent bulb */}
      <circle r={33} fill="rgba(245,244,238,0.55)" opacity={spent} />
      {[[-10, -8, 7], [9, 6, 5], [-2, 14, 4]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="rgba(60,55,50,0.35)" opacity={spent} />)}
      <ellipse cx={-12} cy={-14} rx={9} ry={5} fill="rgba(255,255,255,0.7)" transform="rotate(-35 -12 -14)" />
      {/* the burn */}
      <circle r={44} fill="#FFF6E0" opacity={fire} />
      <circle r={80} fill={PD_AMBER} opacity={fire * 0.55} filter="url(#pdSoft)" />
    </g>
  );
};

export const PhotoDevelopingCamera: React.FC<{ V: CamView; o: number; spent: number; fire: number; glow: number; src: string; label: number; font: string }> = ({ V, o, spent, fire, glow, src, label, font }) => {
  if (o <= 0.001) return null;
  const k = V.s;
  return (
    <g opacity={o}>
      <g transform={`translate(${V.x} ${V.y}) rotate(${V.rot}) scale(${k})`}>
        {/* its shadow on the wall behind */}
        <rect x={230} y={360} width={400} height={500} rx={30} fill="rgba(0,0,0,0.5)" filter="url(#pdSoft)" transform="translate(30 40)" />
        <image href={src} x={0} y={0} width={PD_CAM.w} height={PD_CAM.h} style={{ filter: "saturate(0.55) contrast(1.05)" }} />
        {/* the reflector lit from inside after the burn, cooling */}
        <circle cx={PD_CAM.bulb[0]} cy={PD_CAM.bulb[1]} r={PD_CAM.refl * 0.97} fill={PD_AMBER} opacity={glow * 0.35} />
        <g transform={`translate(${PD_CAM.bulb[0]} ${PD_CAM.bulb[1]}) scale(0.85)`}>
          <Bulb spent={spent} fire={fire} />
        </g>
      </g>
      {/* Paul Vathis's label, under the camera, a hairline and a line of grey */}
      <g opacity={label} transform={`translate(${V.x + PD_CAM.w * k + 16} ${V.y + PD_CAM.h * k * 0.5})`}>
        <line x1={-40} y1={-16} x2={300} y2={-16} stroke={PD_HAIR} strokeWidth={2} />
        <text x={0} y={22} fontFamily={font} fontSize={34} fill={PD_DIM} style={{ textShadow: "0 2px 10px #0D1117" }}>
          Paul Vathis, AP,
        </text>
        <text x={0} y={66} fontFamily={font} fontSize={34} fill={PD_DIM} style={{ textShadow: "0 2px 10px #0D1117" }}>
          came to treat his son
        </text>
      </g>
      <circle cx={0} cy={0} r={0} opacity={pdClamp(0)} />
    </g>
  );
};
