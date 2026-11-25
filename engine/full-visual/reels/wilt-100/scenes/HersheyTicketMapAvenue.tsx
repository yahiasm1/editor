// wilt-100 "hershey": HERSHEY, Chocolate Avenue at night, reached by diving into the pin. One pinhole camera looks
// down the avenue (HersheyTicketMapKit htmProj): low brick fronts on both sides, the Kiss streetlamps on both kerbs
// (a foil Kiss on a plain pole, the paper plume off its tip, alternating foil-wrapped and chocolate-brown as on the
// real avenue), and at the end the factory with its lit windows and the two brick smokestacks lettered HERSHEY top to
// bottom (read off commons-factory-towers-ccbysa3.jpg). The lamps light one pair after another, near to far, from
// "chocolate" and the last pair lights under the stacks on "town". Steam leaves the stacks; a car drives away.
import React from "react";
import { ease, prog } from "../../../src/engine";
import { HTM_LAMP, HTM_OSWALD, HTM_VP, type HersheyT, htmLerp, htmProj, htmRnd } from "./HersheyTicketMapKit";

const LAMP_Z = [6.4, 8.6, 11.6, 15.6, 21, 28, 37.5, 50];
const LAMP_X = 4.7;
const POLE = 3.9;
const KISS_H = 1.05;
const KISS_W = 0.86;

/** the Kiss: base at 0, tip at -1.12 (unit width 1) */
const KISS = "M-0.5,0 C-0.53,-0.32 -0.27,-0.55 -0.09,-0.93 L0,-1.12 L0.09,-0.93 C0.27,-0.55 0.53,-0.32 0.5,0 Q0,0.1 -0.5,0 Z";

const Lamp: React.FC<{ X: number; Z: number; foil: boolean; lit: number; i: number; side: number }> = ({ X, Z, foil, lit, i, side }) => {
  const b = htmProj(X, 0, Z);
  const top = htmProj(X, POLE, Z);
  const s = b.s;
  const w = KISS_W * s;
  const h = KISS_H * s;
  return (
    <g>
      {/* the pool of light on the pavement and the road */}
      {lit > 0 && (
        <ellipse cx={b.x - side * 0.6 * s} cy={b.y + 0.15 * s} rx={3.4 * s} ry={0.9 * s * (1.6 / 1.6)} fill="url(#htm-pool)" opacity={lit} />
      )}
      {/* the pole, its foot and a thin highlight */}
      <rect x={b.x - 0.07 * s} y={top.y} width={0.14 * s} height={b.y - top.y} fill="#3E4248" />
      <rect x={b.x - 0.035 * s} y={top.y} width={0.03 * s} height={b.y - top.y} fill="#8A9097" opacity={0.25 + 0.4 * lit} />
      <rect x={b.x - 0.13 * s} y={b.y - 0.35 * s} width={0.26 * s} height={0.35 * s} fill="#2E3237" />
      {/* the glow around the head */}
      {lit > 0 && <circle cx={top.x} cy={top.y - 0.1 * s} r={1.5 * s} fill="url(#htm-halo)" opacity={lit} />}
      {/* the Kiss */}
      <g transform={`translate(${top.x.toFixed(2)} ${top.y.toFixed(2)}) scale(${w.toFixed(3)} ${(h / 1.12).toFixed(3)})`}>
        <path d={KISS} fill={foil ? "url(#htm-foil)" : "url(#htm-choc)"} />
        {/* the foil's creases catch the light from below */}
        {foil && <path d="M-0.2,-0.05 C-0.24,-0.4 -0.12,-0.7 -0.03,-1.0 M0.18,-0.05 C0.22,-0.38 0.1,-0.66 0.03,-0.98" stroke="#fff" strokeWidth={0.02} fill="none" opacity={0.3 + 0.4 * lit} />}
        <ellipse cx={0} cy={0.02} rx={0.46} ry={0.07} fill={lit > 0 ? HTM_LAMP : "#1A1C20"} opacity={lit > 0 ? 0.6 + 0.4 * lit : 1} />
      </g>
      {/* the paper plume off the tip, with HERSHEY on it, close lamps only */}
      {s > 30 && (
        <g transform={`translate(${top.x.toFixed(2)} ${(top.y - h).toFixed(2)}) scale(${(s / 100).toFixed(3)})`}>
          <path d={`M0,2 C${side * -8},-14 ${side * -30},-18 ${side * -46},-10 L${side * -44},-2 C${side * -28},-8 ${side * -10},-6 0,2 Z`} fill="#E9EDF1" opacity={0.9} />
          {s > 60 && (
            <text x={side * -24} y={-7} textAnchor="middle" fontFamily={HTM_OSWALD} fontWeight={700} fontSize={8} fill="#7DA7C9" transform={`rotate(${side * 10} ${side * -24} -7)`}>HERSHEY</text>
          )}
        </g>
      )}
    </g>
  );
};

export const HersheyTicketMapAvenue: React.FC<{ f: number; T: HersheyT }> = ({ f, T }) => {
  const enter = T.the - 4;
  if (f < enter) return null;
  const inK = prog(f, enter, 24, ease.out);
  const zoom = htmLerp(1.6, 1, inK);
  const dim = 1 - 0.5 * prog(f, T.against - 4, 16, ease.inOut);
  const litAt = (i: number) => T.chocolate + Math.round((i * (T.town - T.chocolate)) / (LAMP_Z.length - 1));
  // each lamp strikes: a flicker, a flash a little over full, then it settles and hums
  const lit = (i: number) => {
    const d = f - litAt(i);
    if (d < 0) return 0;
    const flick = d < 3 ? (d === 1 ? 0.25 : 0.7) : 1;
    const flash = d >= 3 ? 1 + 0.25 * Math.max(0, 1 - (d - 3) / 8) : 1;
    return Math.min(1.25, flick * flash * (0.95 + 0.05 * Math.sin(f * 0.9 + i * 2.1)));
  };

  // the fronts along both sides, segment by segment
  const fronts: { X: number; z0: number; z1: number; h: number; seed: number }[] = [];
  for (const X of [-7.2, 7.2]) {
    let z = 4;
    let k = X < 0 ? 0 : 50;
    while (z < 80) {
      const len = 5 + htmRnd(k) * 7;
      fronts.push({ X, z0: z, z1: z + len, h: 6.5 + htmRnd(k + 7) * 4.5, seed: k });
      z += len;
      k++;
    }
  }
  const quad = (X: number, z0: number, z1: number, y0: number, y1: number) => {
    const a = htmProj(X, y0, z0), b = htmProj(X, y1, z0), c = htmProj(X, y1, z1), d = htmProj(X, y0, z1);
    return `M${a.x},${a.y} L${b.x},${b.y} L${c.x},${c.y} L${d.x},${d.y} Z`;
  };
  const road = (x0: number, x1: number) => {
    const a = htmProj(x0, 0, 3.2), b = htmProj(x1, 0, 3.2), c = htmProj(x1, 0, 140), d = htmProj(x0, 0, 140);
    return `M${a.x},${a.y} L${b.x},${b.y} L${c.x},${c.y} L${d.x},${d.y} Z`;
  };

  // the stacks, in frame space at the end of the avenue (the right one a little further, so thinner and lower)
  const stacks = [
    { x: 498, top: 808, base: 1012, w0: 38, w1: 31 },
    { x: 594, top: 822, base: 1012, w0: 34, w1: 28 },
  ];
  const t = (f - enter) / 60;
  // a car driving away down the avenue
  const carZ = 15 + t * 10;
  const car = htmProj(1.6, 0, carZ);

  return (
    <g transform={`translate(${HTM_VP.x} ${HTM_VP.y}) scale(${zoom.toFixed(4)}) translate(${-HTM_VP.x} ${-HTM_VP.y})`} opacity={prog(f, enter, 10, ease.linear) * dim}>
      <defs>
        <linearGradient id="htm-av-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0B0F17" />
          <stop offset="0.75" stopColor="#1C1B27" />
          <stop offset="1" stopColor="#3A2A2A" />
        </linearGradient>
        <linearGradient id="htm-foil" x1="0" x2="1">
          <stop offset="0" stopColor="#5D636B" />
          <stop offset="0.35" stopColor="#D5D9DE" />
          <stop offset="0.55" stopColor="#9EA4AB" />
          <stop offset="1" stopColor="#4B5057" />
        </linearGradient>
        <linearGradient id="htm-choc" x1="0" x2="1">
          <stop offset="0" stopColor="#2A1A10" />
          <stop offset="0.38" stopColor="#7A4D2E" />
          <stop offset="0.6" stopColor="#4E301C" />
          <stop offset="1" stopColor="#24160D" />
        </linearGradient>
        <radialGradient id="htm-pool">
          <stop offset="0" stopColor={HTM_LAMP} stopOpacity={0.32} />
          <stop offset="0.6" stopColor={HTM_LAMP} stopOpacity={0.08} />
          <stop offset="1" stopColor={HTM_LAMP} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="htm-halo">
          <stop offset="0" stopColor={HTM_LAMP} stopOpacity={0.5} />
          <stop offset="1" stopColor={HTM_LAMP} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="htm-brick" x1="0" x2="1">
          <stop offset="0" stopColor="#3A1A14" />
          <stop offset="0.45" stopColor="#6A2E22" />
          <stop offset="1" stopColor="#2E1510" />
        </linearGradient>
        <linearGradient id="htm-tail-streak" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FF3B2F" stopOpacity={0.55} />
          <stop offset="1" stopColor="#FF3B2F" stopOpacity={0} />
        </linearGradient>
        <radialGradient id="htm-tail-glow">
          <stop offset="0" stopColor="#FF4A3A" stopOpacity={0.6} />
          <stop offset="1" stopColor="#FF4A3A" stopOpacity={0} />
        </radialGradient>
        <filter id="htm-steam-blur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
        <linearGradient id="htm-stack-light" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0.55} />
          <stop offset="1" stopColor="#FFB070" stopOpacity={0.12} />
        </linearGradient>
      </defs>
      <rect x={-200} y={480} width={1480} height={HTM_VP.y - 470} fill="url(#htm-av-sky)" />
      {Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={htmRnd(i) * 1080} cy={540 + htmRnd(i + 40) * 260} r={1.2 + htmRnd(i + 80)} fill="#fff" opacity={0.15 + 0.2 * htmRnd(i + 9)} />
      ))}
      {/* low hills behind the town */}
      <path d={`M-200,${HTM_VP.y} L-200,1050 C100,1020 300,1040 420,1060 C600,1030 800,1020 1280,1050 L1280,${HTM_VP.y} Z`} fill="#10131A" />

      {/* steam off the stacks: soft, wide, lying low on the night wind to the right, lit warm from the town below */}
      <g filter="url(#htm-steam-blur)">
        {stacks.map((st, j) =>
          Array.from({ length: 9 }, (_, i) => {
            const life = ((t * 0.45 + i / 9 + j * 0.13) % 1);
            return (
              <ellipse key={`${j}-${i}`} cx={st.x + 6 + life * 170} cy={st.top + 4 - life * 26 - Math.sin(life * 3 + i) * 4}
                rx={10 + life * 46} ry={6 + life * 14} fill="#B9B2AC" opacity={0.2 * Math.sin(Math.min(1, life * 1.4) * Math.PI) * (1 - life * 0.5)} />
            );
          }),
        )}
      </g>
      {/* the two smokestacks: brick, a darker cap ring, HERSHEY in white block letters top to bottom */}
      {stacks.map((st, j) => (
        <g key={j}>
          <path d={`M${st.x - st.w0 / 2},${st.base} L${st.x - st.w1 / 2},${st.top} L${st.x + st.w1 / 2},${st.top} L${st.x + st.w0 / 2},${st.base} Z`} fill="url(#htm-brick)" />
          <path d={`M${st.x - st.w0 / 2},${st.base} L${st.x - st.w1 / 2},${st.top} L${st.x + st.w1 / 2},${st.top} L${st.x + st.w0 / 2},${st.base} Z`} fill="url(#htm-stack-light)" />
          <rect x={st.x - st.w1 / 2 - 2} y={st.top - 3} width={st.w1 + 4} height={14} fill="#2A120D" />
          <rect x={st.x - st.w1 / 2 - 1} y={st.top + 16} width={st.w1 + 2} height={4} fill="#2A120D" opacity={0.8} />
          {"HERSHEY".split("").map((c, i) => (
            <text key={i} x={st.x} y={st.top + 50 + i * 22.5} textAnchor="middle" fontFamily={HTM_OSWALD} fontWeight={600} fontSize={20 - j * 1.5} fill="#EDE7DA" opacity={0.86}>{c}</text>
          ))}
        </g>
      ))}
      {/* the water tank between them */}
      <path d="M534,1006 L534,990 Q550,972 566,990 L566,1006 Z" fill="#4C5862" />
      {/* the factory: cream wing at left, the red brick block, big many-paned windows lit inside */}
      <rect x={326} y={1028} width={92} height={70} fill="#4D4636" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={334 + (i % 3) * 28} y={1036 + Math.floor(i / 3) * 28} width={20} height={18} fill="#E8C47E" opacity={htmRnd(i + 300) > 0.4 ? 0.6 : 0.12} />
      ))}
      <rect x={410} y={1004} width={290} height={94} fill="#4A2219" />
      <rect x={410} y={1004} width={290} height={6} fill="#8C7A5A" opacity={0.7} />
      <rect x={410} y={1072} width={290} height={3} fill="#8C7A5A" opacity={0.5} />
      {Array.from({ length: 12 }, (_, i) => {
        const x = 424 + (i % 6) * 46, y = 1016 + Math.floor(i / 6) * 30;
        const on = htmRnd(i + 200) > 0.25;
        return (
          <g key={i}>
            <rect x={x} y={y} width={32} height={22} fill={on ? "#F0C774" : "#1A1210"} opacity={on ? 0.75 : 1} />
            <path d={`M${x + 8},${y} V${y + 22} M${x + 16},${y} V${y + 22} M${x + 24},${y} V${y + 22} M${x},${y + 11} H${x + 32}`} stroke="#4A2219" strokeWidth={1.4} />
          </g>
        );
      })}
      <rect x={410} y={1080} width={290} height={18} fill="#2B1510" />

      {/* the avenue: sidewalks, kerbs, asphalt, the centre line */}
      <path d={road(-7.2, 7.2)} fill="#202228" />
      <path d={road(-3.9, 3.9)} fill="#15171C" />
      <path d={road(-3.95, -3.8)} fill="#5B5E66" opacity={0.6} />
      <path d={road(3.8, 3.95)} fill="#5B5E66" opacity={0.6} />
      <path d={road(-0.06, 0.06)} fill="#B39A4E" opacity={0.45} />

      {/* the low brick fronts on both sides, windows lit here and there */}
      {fronts.map((s, i) => {
        const wins = [];
        const n = Math.max(1, Math.floor((s.z1 - s.z0) / 2.2));
        for (let r = 0; r < 2; r++) {
          for (let c = 0; c < n; c++) {
            const z0 = s.z0 + 0.8 + c * ((s.z1 - s.z0 - 1.2) / n);
            const on = htmRnd(s.seed * 17 + r * 5 + c) > 0.55;
            wins.push(<path key={`${r}-${c}`} d={quad(s.X, z0, z0 + 1.1, 3.4 + r * 3, 5.1 + r * 3)} fill={on ? "#E7BE72" : "#0E0C0E"} opacity={on ? 0.55 : 0.9} />);
          }
        }
        return (
          <g key={i}>
            <path d={quad(s.X, s.z0, s.z1, 0, s.h)} fill={i % 2 ? "#221A1A" : "#1C1517"} stroke="#0D0B0C" strokeWidth={1} />
            <path d={quad(s.X, s.z0, s.z1, s.h - 0.5, s.h)} fill="#3A2C26" />
            {/* the shop window at the street, warm */}
            <path d={quad(s.X, s.z0 + 0.6, s.z1 - 0.6, 0.5, 2.6)} fill="#E0A45A" opacity={0.16 + 0.12 * htmRnd(s.seed)} />
            {wins}
          </g>
        );
      })}

      {/* a 1950s sedan driving away toward the factory, seen from behind: the lamps catch its roof, the edge of its
          trunk and its chrome bumper; its tail lights glow and lay two red streaks on the road */}
      {carZ < 70 && (() => {
        const u = car.s; // px per metre at the car
        const x = car.x, y = car.y;
        // how much lamp light falls on it: brighter as it passes under a lit pair
        const near = Math.max(...LAMP_Z.map((Z, i) => (lit(i) > 0 ? Math.max(0, 1 - Math.abs(Z - carZ) / 4) * Math.min(1, lit(i)) : 0)));
        const sheen = 0.35 + 0.5 * near;
        return (
          <g>
            {/* the red streaks of the tail lights on the asphalt, and the car's dark reflection */}
            <ellipse cx={x - 0.8 * u} cy={y + 0.35 * u} rx={0.16 * u} ry={0.45 * u} fill="url(#htm-tail-streak)" opacity={0.5} filter="url(#htm-steam-blur)" />
            <ellipse cx={x + 0.8 * u} cy={y + 0.35 * u} rx={0.16 * u} ry={0.45 * u} fill="url(#htm-tail-streak)" opacity={0.5} filter="url(#htm-steam-blur)" />
            <ellipse cx={x} cy={y + 0.02 * u} rx={1.05 * u} ry={0.12 * u} fill="#000" opacity={0.6} />
            {/* tyres */}
            <rect x={x - 0.9 * u} y={y - 0.32 * u} width={0.24 * u} height={0.32 * u} rx={0.05 * u} fill="#050506" />
            <rect x={x + 0.66 * u} y={y - 0.32 * u} width={0.24 * u} height={0.32 * u} rx={0.05 * u} fill="#050506" />
            {/* the body, the cabin with its rear window, lit from above */}
            <path d={`M${x - 0.95 * u},${y - 0.28 * u} L${x - 0.98 * u},${y - 0.78 * u} Q${x - 0.95 * u},${y - 0.9 * u} ${x - 0.8 * u},${y - 0.9 * u} L${x + 0.8 * u},${y - 0.9 * u} Q${x + 0.95 * u},${y - 0.9 * u} ${x + 0.98 * u},${y - 0.78 * u} L${x + 0.95 * u},${y - 0.28 * u} Z`} fill="#2B3440" />
            <path d={`M${x - 0.68 * u},${y - 0.9 * u} L${x - 0.55 * u},${y - 1.38 * u} Q${x},${y - 1.46 * u} ${x + 0.55 * u},${y - 1.38 * u} L${x + 0.68 * u},${y - 0.9 * u} Z`} fill="#222A34" />
            <path d={`M${x - 0.56 * u},${y - 0.96 * u} L${x - 0.47 * u},${y - 1.3 * u} Q${x},${y - 1.36 * u} ${x + 0.47 * u},${y - 1.3 * u} L${x + 0.56 * u},${y - 0.96 * u} Z`} fill="#0C1016" />
            {/* the lit edges: roof line, trunk lid edge, chrome bumper */}
            <path d={`M${x - 0.55 * u},${y - 1.38 * u} Q${x},${y - 1.46 * u} ${x + 0.55 * u},${y - 1.38 * u}`} stroke={HTM_LAMP} strokeWidth={Math.max(1, 0.035 * u)} fill="none" opacity={sheen} />
            <path d={`M${x - 0.98 * u},${y - 0.8 * u} Q${x - 0.95 * u},${y - 0.9 * u} ${x - 0.8 * u},${y - 0.9 * u} L${x + 0.8 * u},${y - 0.9 * u} Q${x + 0.95 * u},${y - 0.9 * u} ${x + 0.98 * u},${y - 0.8 * u}`} stroke={HTM_LAMP} strokeWidth={Math.max(1, 0.03 * u)} fill="none" opacity={sheen * 0.85} />
            <rect x={x - 0.98 * u} y={y - 0.4 * u} width={1.96 * u} height={0.1 * u} rx={0.04 * u} fill="#C8CDD2" opacity={0.35 + 0.45 * near} />
            {/* the licence plate, lit by its little lamp */}
            <rect x={x - 0.17 * u} y={y - 0.6 * u} width={0.34 * u} height={0.16 * u} fill="#E8D98C" opacity={0.75} />
            {/* the tail lights, high fins of the late fifties, with their glow */}
            {[-1, 1].map((sd) => (
              <g key={sd}>
                <circle cx={x + sd * 0.8 * u} cy={y - 0.66 * u} r={Math.max(4, 0.3 * u)} fill="url(#htm-tail-glow)" />
                <rect x={x + sd * 0.8 * u - 0.07 * u} y={y - 0.82 * u} width={0.14 * u} height={0.3 * u} rx={0.04 * u} fill="#FF3B2F" />
              </g>
            ))}
          </g>
        );
      })()}

      {/* the Kiss lamps, far first so the near ones draw over */}
      {LAMP_Z.map((Z, i) => i).reverse().map((i) => (
        <g key={i}>
          <Lamp X={-LAMP_X} Z={LAMP_Z[i]} foil={i % 2 === 0} lit={lit(i)} i={i} side={-1} />
          <Lamp X={LAMP_X} Z={LAMP_Z[i]} foil={i % 2 === 1} lit={lit(i)} i={i} side={1} />
        </g>
      ))}
    </g>
  );
};
