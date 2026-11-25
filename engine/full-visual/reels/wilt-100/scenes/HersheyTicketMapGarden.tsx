// wilt-100 "hershey": NEW YORK, the big city arena the game was NOT in. Old Madison Square Garden (1925-1968, Eighth
// Avenue at 49th) at night: the wide low front, rows of windows, and the long marquee across the whole front with
// MADISON SQUARE GARDEN lit on its face and two chasing rows of bulbs; doors lit under it, people outside, Midtown
// behind, yellow cabs and cars running on the avenue. On "arena" every bulb goes out in one sweep, left to right, and
// the block slides away left.
import React from "react";
import { ease, leaveEase, prog } from "../../../src/engine";
import { HTM_DIM, HTM_LAMP, HTM_OSWALD, type HersheyT, htmRnd } from "./HersheyTicketMapKit";

const BULBS = 62;
const MQ = { x0: 40, x1: 1040, y0: 990, y1: 1100 };

type HtmCarKind = "belair" | "checker" | "fastback";

/** the profile of each car, side on, facing right, wheels on y 0, about 165 px long (a 5 m car) */
const HTM_CAR: Record<HtmCarKind, { body: string; cabin: string; wheels: [number, number]; win: string }> = {
  // a '57 Chevrolet Bel Air: long and low, a flat hood, the rear fins, a wrap-around windshield, a two-tone roof
  belair: {
    body: "M-82,-6 L-83,-22 L-84,-35 Q-76,-34 -62,-31 L-36,-31 L74,-29 Q83,-28 84,-19 L84,-6 Z",
    cabin: "M-38,-31 Q-30,-51 -12,-52 L20,-52 Q30,-51 40,-30 Z",
    win: "M-31,-33 Q-24,-48 -12,-48 L-2,-48 L-2,-33 Z M3,-48 L19,-48 Q27,-47 34,-33 L3,-33 Z",
    wheels: [-50, 52],
  },
  // a Checker A8 cab (1956): boxy and upright, a tall flat-sided cabin, the checker band along the belt line
  checker: {
    body: "M-78,-6 L-79,-27 Q-78,-34 -68,-35 L70,-33 Q81,-32 81,-21 L81,-6 Z",
    cabin: "M-54,-35 L-48,-62 L26,-62 L40,-34 Z",
    win: "M-47,-37 L-43,-57 L-12,-57 L-12,-37 Z M-8,-57 L23,-57 L33,-37 L-8,-37 Z",
    wheels: [-48, 50],
  },
  // a late-'40s fastback: one rounded shape from the bumper over the roof, skirted rear fender
  fastback: {
    body: "M-80,-6 Q-83,-28 -60,-36 Q-36,-58 -2,-58 Q26,-57 40,-37 L70,-33 Q83,-30 83,-15 L83,-6 Z",
    cabin: "",
    win: "M-46,-38 Q-30,-53 -6,-53 L-6,-38 Z M-1,-53 Q20,-52 32,-38 L-1,-38 Z",
    wheels: [-46, 52],
  },
};

/** a 1950s car on the avenue, side on, lit from the marquee above; dir 1 drives right */
const Car: React.FC<{ x: number; y: number; dir: 1 | -1; color: string; roof: string; kind: HtmCarKind; k: number; haze: number; id: string }> = ({ x, y, dir, color, roof, kind, k, haze, id }) => {
  const c = HTM_CAR[kind];
  return (
    <g transform={`translate(${x.toFixed(1)} ${y}) scale(${k})`} opacity={1 - haze * 0.35}>
      {/* the wet avenue mirrors the body and the lights */}
      <g transform={`scale(${dir} -0.55)`} opacity={0.16}>
        <path d={c.body} fill={color} />
        {c.cabin && <path d={c.cabin} fill={roof} />}
      </g>
      <ellipse cx={dir * 74} cy={10} rx={46} ry={4} fill="#FFF4D0" opacity={0.22} />
      <ellipse cx={-dir * 78} cy={9} rx={22} ry={3} fill="#FF3B2F" opacity={0.3} />
      <ellipse cx={0} cy={2} rx={82} ry={6} fill="#000" opacity={0.55} />
      <g transform={`scale(${dir} 1)`}>
        <path d="M84,-20 L190,-40 L190,6 Z" fill="url(#htm-beam)" />
        {c.cabin && <path d={c.cabin} fill={roof} />}
        <path d={c.body} fill={color} />
        {/* the light from above on the top of the body, the shadow under the belt */}
        <path d={c.body} fill={`url(#htm-car-shade-${id})`} />
        <path d={c.win} fill="#1A2430" />
        <path d={c.win} fill="url(#htm-car-glass)" />
        {kind === "belair" && <path d="M-74,-22 Q-30,-25 10,-19 L62,-19" stroke="#D8DCE0" strokeWidth={2.2} fill="none" opacity={0.75} />}
        {kind === "belair" && <path d="M-84,-35 L-60,-31" stroke="#E9ECEF" strokeWidth={1.5} opacity={0.6} />}
        {kind === "checker" &&
          Array.from({ length: 18 }, (_, i) => (
            <rect key={i} x={-66 + i * 7.6} y={-27 + (i % 2) * 3} width={3.8} height={3} fill={i % 2 ? "#111" : "#F2F0EA"} opacity={0.9} />
          ))}
        {kind === "checker" && (
          <g>
            <rect x={-12} y={-70} width={22} height={9} rx={2} fill="#FFE9A0" />
            <text x={-1} y={-62.5} transform={`scale(${dir} 1)`} textAnchor="middle" fontFamily={HTM_OSWALD} fontWeight={700} fontSize={7.5} fill="#5A4210">TAXI</text>
          </g>
        )}
        {kind === "fastback" && <path d="M-74,-14 L66,-14" stroke="#D8DCE0" strokeWidth={1.8} opacity={0.55} />}
        {/* the door seam and handle */}
        <path d="M-4,-32 L-4,-8" stroke="#000" strokeWidth={1} opacity={0.35} />
        <rect x={6} y={-27} width={8} height={2} rx={1} fill="#D8DCE0" opacity={0.7} />
        {/* chrome bumpers catch the marquee light */}
        <rect x={-88} y={-15} width={10} height={9} rx={3} fill="url(#htm-chrome)" />
        <rect x={78} y={-15} width={10} height={9} rx={3} fill="url(#htm-chrome)" />
        {/* wheel arches, tyres, whitewalls, hubcaps */}
        {c.wheels.map((wx, i) => (
          <g key={i}>
            <circle cx={wx} cy={-7} r={17} fill="#07080A" />
            <circle cx={wx} cy={-2} r={12.5} fill="#0B0B0C" />
            <circle cx={wx} cy={-2} r={8.5} fill="#D9D6CE" opacity={kind === "checker" ? 0.25 : 0.85} />
            <circle cx={wx} cy={-2} r={5.5} fill="url(#htm-chrome)" />
            {kind === "fastback" && i === 0 && <path d={`M${wx - 18},-8 L${wx - 18},-20 Q${wx},-26 ${wx + 18},-20 L${wx + 18},-8 Z`} fill={color} />}
          </g>
        ))}
        {/* the headlight, the tail light */}
        <circle cx={82} cy={-22} r={4.2} fill="#FFF6DA" />
        <circle cx={82} cy={-22} r={11} fill="#FFF6DA" opacity={0.25} />
        <rect x={-85} y={kind === "belair" ? -34 : -26} width={4} height={kind === "belair" ? 8 : 9} rx={1.5} fill="#FF3B2F" />
        <circle cx={-84} cy={kind === "belair" ? -30 : -22} r={9} fill="#FF3B2F" opacity={0.28} />
      </g>
    </g>
  );
};

/** a New York bus of the 1950s (the GM "old look"), side on, its windows lit, on the far lane */
const Bus: React.FC<{ x: number; y: number; dir: 1 | -1 }> = ({ x, y, dir }) => (
  <g transform={`translate(${x.toFixed(1)} ${y}) scale(${dir * 0.9} 0.9)`} opacity={0.82}>
    <ellipse cx={0} cy={2} rx={170} ry={6} fill="#000" opacity={0.5} />
    <path d="M-168,-8 L-168,-92 Q-166,-106 -148,-108 L148,-108 Q170,-106 172,-86 L172,-8 Z" fill="#2F4A3C" />
    <path d="M-168,-56 L172,-56 L172,-8 L-168,-8 Z" fill="#C9C2AE" opacity={0.85} />
    <path d="M-168,-108 L172,-108 L172,-56 L-168,-56 Z" fill="url(#htm-car-shade-bus)" />
    {Array.from({ length: 8 }, (_, i) => (
      <rect key={i} x={-150 + i * 36} y={-96} width={30} height={30} rx={3} fill="#E8C47E" opacity={0.55 + 0.3 * htmRnd(i + 900)} />
    ))}
    <rect x={128} y={-96} width={36} height={56} rx={3} fill="#1A2430" />
    <rect x={-160} y={-104} width={70} height={8} rx={1} fill="#111" />
    <text x={-125} y={-97.5} transform={`translate(${-250 * (dir < 0 ? 1 : 0)} 0) scale(${dir} 1)`} textAnchor="middle" fontFamily={HTM_OSWALD} fontWeight={600} fontSize={7} fill="#F2E7C6">8 AV</text>
    <circle cx={-110} cy={-6} r={14} fill="#0B0B0C" /><circle cx={-110} cy={-6} r={5} fill="#8A8E94" />
    <circle cx={110} cy={-6} r={14} fill="#0B0B0C" /><circle cx={110} cy={-6} r={5} fill="#8A8E94" />
    <circle cx={170} cy={-24} r={4} fill="#FFF6DA" />
    <rect x={-170} y={-30} width={4} height={10} fill="#FF3B2F" />
  </g>
);

/** one person on the sidewalk, a silhouette against the lit doors with warm rim light on hat and shoulders */
const Person: React.FC<{ x: number; y: number; h: number; dir: number; walk: number; phase: number; hat: number; coat: number; skirt: boolean; tone: string }> = ({ x, y, h, dir, walk, phase, hat, coat, skirt, tone }) => {
  const leg = h * 0.44;
  const sh = h * (0.26 + coat * 0.06); // shoulder width
  const hem = skirt ? -leg * 0.5 : -leg * (0.3 + coat * 0.4);
  const hw = skirt ? sh * 0.75 : sh * 0.55;
  const top = -h * 0.84;
  const r = h * 0.095;
  const sw = Math.sin(phase) * walk;
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${dir} 1)`}>
      <ellipse cx={0} cy={1} rx={h * 0.28} ry={2.2} fill="#000" opacity={0.5} />
      {/* legs, swinging when walking */}
      <path d={`M${-h * 0.06},${hem} L${-h * 0.07 + sw * h * 0.12},0 L${-h * 0.01 + sw * h * 0.12},0 L${h * 0.01},${hem} Z`} fill={tone} />
      <path d={`M${h * 0.0},${hem} L${h * 0.01 - sw * h * 0.12},0 L${h * 0.07 - sw * h * 0.12},0 L${h * 0.07},${hem} Z`} fill={tone} />
      {/* coat or dress */}
      <path d={`M${-sh / 2},${top + 3} Q${-sh / 2},${top} ${-sh / 2 + 4},${top} L${sh / 2 - 4},${top} Q${sh / 2},${top} ${sh / 2},${top + 3} L${hw},${hem} L${-hw},${hem} Z`} fill={tone} />
      {/* arm swinging */}
      <path d={`M${sh * 0.3},${top + 2} L${sh * 0.36 + sw * h * 0.08},${top + h * 0.36}`} stroke={tone} strokeWidth={h * 0.07} strokeLinecap="round" />
      {/* neck and head */}
      <rect x={-h * 0.035} y={top - h * 0.05} width={h * 0.07} height={h * 0.06} fill={tone} />
      <circle cx={0} cy={top - h * 0.05 - r} r={r} fill={tone} />
      {hat > 0.66 && (
        // a fedora: a wide brim, a pinched crown
        <g>
          <ellipse cx={0} cy={top - h * 0.05 - r * 1.35} rx={r * 1.75} ry={r * 0.32} fill={tone} />
          <path d={`M${-r * 0.95},${top - h * 0.05 - r * 1.35} L${-r * 0.85},${top - h * 0.05 - r * 2.25} Q0,${top - h * 0.05 - r * 2.0} ${r * 0.85},${top - h * 0.05 - r * 2.25} L${r * 0.95},${top - h * 0.05 - r * 1.35} Z`} fill={tone} />
        </g>
      )}
      {hat > 0.4 && hat <= 0.66 && <ellipse cx={-r * 0.2} cy={top - h * 0.05 - r * 1.5} rx={r * 1.05} ry={r * 0.55} fill={tone} />}
      {/* rim light from the lit doors behind */}
      <path d={`M${-sh / 2 + 1},${top + 1} L${sh / 2 - 1},${top + 1}`} stroke="#E2B676" strokeWidth={1.1} opacity={0.55} />
      <path d={`M${-r * 0.8},${top - h * 0.05 - r * (hat > 0.66 ? 2.1 : 1.7)} Q0,${top - h * 0.05 - r * (hat > 0.66 ? 2.4 : 2.05)} ${r * 0.8},${top - h * 0.05 - r * (hat > 0.66 ? 2.1 : 1.7)}`} stroke="#E2B676" strokeWidth={1} fill="none" opacity={0.5} />
    </g>
  );
};

export const HersheyTicketMapGarden: React.FC<{ f: number; T: HersheyT }> = ({ f, T }) => {
  const appear = T.not - 4;
  if (f < appear - 2) return null;
  const goAt = T.arenaEnd - 2;
  const go = prog(f, goAt, 13, leaveEase(13));
  if (go >= 1) return null;
  const inK = prog(f, appear, 14, ease.out);
  const dx = -go * 1250;
  // bulbs light left to right on "Not in some big city", and all go out in one sweep on "arena"
  const litAt = (i: number) => appear + 4 + (i / BULBS) * (T.city - appear);
  const offAt = (i: number) => T.arena + (i / BULBS) * 9;
  const bulbOn = (i: number, row: number) => {
    const lit = f >= litAt(i) && f < offAt(i);
    const chase = (Math.floor((f - appear) / 3) + i + row) % 4 === 0 ? 0.55 : 1; // the marquee chase
    return lit ? chase : 0;
  };
  // the letters go out with the bulbs under them
  const signOn = (cx: number) => {
    const i = ((cx - MQ.x0) / (MQ.x1 - MQ.x0)) * BULBS;
    return f >= litAt(i) && f < offAt(i) ? 1 : 0;
  };
  const letters = "MADISON SQUARE GARDEN".split("");
  const pitch = 44;
  const lx0 = 540 - ((letters.length - 1) * pitch) / 2;

  const people = Array.from({ length: 58 }, (_, i) => {
    const r = htmRnd(i + 3);
    // about a third stand in line at the doors, the rest walk both ways at their own pace
    const stand = htmRnd(i + 61) < 0.33;
    const sp = stand ? 0 : (htmRnd(i + 50) < 0.5 ? -1 : 1) * (0.45 + htmRnd(i + 51) * 0.6);
    const x = ((60 + r * 960 + sp * (f - appear)) % 980 + 980) % 980 + 50;
    const depth = htmRnd(i + 21); // 0 at the kerb, 1 at the doors
    const h = (40 + htmRnd(i + 9) * 12) * (1 - depth * 0.18);
    const tones = ["#0E0D0F", "#141114", "#18130F", "#0B0C10"];
    return {
      x, y: 1292 - depth * 22, h, depth,
      dir: sp === 0 ? (htmRnd(i + 70) < 0.5 ? -1 : 1) : Math.sign(sp),
      walk: sp === 0 ? 0 : 0.9, phase: (f - appear) * 0.16 * Math.abs(sp) * 1.4 + i,
      hat: htmRnd(i + 77), coat: htmRnd(i + 88), skirt: htmRnd(i + 99) < 0.28, tone: tones[i % 4],
    };
  }).sort((a, b) => b.depth - a.depth);
  const t = (f - appear) / 60;
  const cars = [
    { x: ((t * 240 + 100) % 1500) - 200, y: 1376, dir: 1 as const, c: "#E5B634", roof: "#E5B634", kind: "checker" as const, k: 0.86, haze: 0.5 },
    { x: ((t * 240 + 760) % 1500) - 200, y: 1376, dir: 1 as const, c: "#6E8C93", roof: "#E9E6DC", kind: "belair" as const, k: 0.86, haze: 0.5 },
    { x: 1280 - ((t * 300 + 300) % 1500), y: 1436, dir: -1 as const, c: "#E5B634", roof: "#E5B634", kind: "checker" as const, k: 1, haze: 0 },
    { x: 1280 - ((t * 300 + 1020) % 1500), y: 1436, dir: -1 as const, c: "#7B2E2A", roof: "#7B2E2A", kind: "fastback" as const, k: 1, haze: 0 },
  ];
  const busX = ((t * 170 + 1180) % 1900) - 300;
  const sky = Array.from({ length: 13 }, (_, i) => ({ x: i * 86 - 20 + htmRnd(i) * 30, w: 60 + htmRnd(i + 1) * 70, top: 560 + htmRnd(i + 2) * 240 }));

  return (
    <g transform={`translate(${dx.toFixed(1)} ${((1 - inK) * 60).toFixed(1)})`} opacity={inK}>
      <defs>
        <linearGradient id="htm-ny-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0B0F18" />
          <stop offset="1" stopColor="#2A2230" />
        </linearGradient>
        <linearGradient id="htm-beam" x1="0" x2="1">
          <stop offset="0" stopColor="#FFF4D0" stopOpacity={0.45} />
          <stop offset="1" stopColor="#FFF4D0" stopOpacity={0} />
        </linearGradient>
        <radialGradient id="htm-door" cx="50%" cy="100%" r="90%">
          <stop offset="0" stopColor="#FFD98A" stopOpacity={0.95} />
          <stop offset="1" stopColor="#B4762C" stopOpacity={0.4} />
        </radialGradient>
        {["0", "1", "2", "3"].map((id) => (
          <linearGradient key={id} id={`htm-car-shade-${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#FFF3D6" stopOpacity={0.32} />
            <stop offset="0.45" stopColor="#FFF3D6" stopOpacity={0.02} />
            <stop offset="0.6" stopColor="#000" stopOpacity={0.15} />
            <stop offset="1" stopColor="#000" stopOpacity={0.55} />
          </linearGradient>
        ))}
        <linearGradient id="htm-car-shade-bus" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FFF3D6" stopOpacity={0.25} />
          <stop offset="1" stopColor="#000" stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="htm-car-glass" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#FFE2A8" stopOpacity={0.35} />
          <stop offset="0.5" stopColor="#FFE2A8" stopOpacity={0.05} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="htm-chrome" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#9AA0A6" />
          <stop offset="1" stopColor="#3A3E44" />
        </linearGradient>
        <filter id="htm-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={5} result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x={0} y={540} width={1080} height={920} fill="url(#htm-ny-sky)" />
      {/* Midtown behind, a few windows still lit */}
      {sky.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.top} width={b.w} height={900 - b.top + 100} fill={i % 2 ? "#141A25" : "#111722"} />
          {Array.from({ length: 18 }, (_, j) => {
            const wx = b.x + 8 + (j % 4) * ((b.w - 16) / 4);
            const wy = b.top + 14 + Math.floor(j / 4) * 26;
            return htmRnd(i * 31 + j) > 0.62 ? <rect key={j} x={wx} y={wy} width={7} height={10} fill="#E9C77A" opacity={0.35 + htmRnd(j + i) * 0.4} /> : null;
          })}
        </g>
      ))}
      {/* the Garden's front: brick and stone, rows of windows */}
      <rect x={70} y={820} width={940} height={480} fill="#2A211D" />
      <rect x={70} y={820} width={940} height={10} fill="#4A3B31" />
      <rect x={70} y={900} width={940} height={5} fill="#3B2F28" />
      <rect x={70} y={966} width={940} height={5} fill="#3B2F28" />
      {Array.from({ length: 3 * 16 }, (_, j) => {
        const c = j % 16, r = Math.floor(j / 16);
        const x = 96 + c * 57.5, y = 838 + r * 44;
        const lit = htmRnd(j + 400) > 0.55;
        return (
          <g key={j}>
            <rect x={x} y={y} width={30} height={30} fill={lit ? "#E7C07A" : "#151519"} opacity={lit ? 0.55 + htmRnd(j) * 0.35 : 1} />
            <line x1={x + 15} x2={x + 15} y1={y} y2={y + 30} stroke="#2A211D" strokeWidth={2} />
            <line x1={x} x2={x + 30} y1={y + 15} y2={y + 15} stroke="#2A211D" strokeWidth={2} />
          </g>
        );
      })}
      {/* doors under the marquee, lit from inside */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={110 + i * 102} y={1150} width={70} height={136} fill="url(#htm-door)" opacity={0.85} />
      ))}
      <rect x={70} y={1100} width={940} height={50} fill="#1E1815" />
      {/* the marquee: a long box across the whole front, its underside lit */}
      <rect x={MQ.x0} y={MQ.y0} width={MQ.x1 - MQ.x0} height={MQ.y1 - MQ.y0} rx={4} fill="#17171A" stroke="#3A3A40" strokeWidth={3} />
      <rect x={MQ.x0} y={MQ.y1 - 6} width={MQ.x1 - MQ.x0} height={8} fill="#F6E4B4" opacity={0.25 + 0.6 * signOn(540)} />
      {letters.map((c, i) => {
        const cx = lx0 + i * pitch;
        const on = signOn(cx);
        return (
          <text key={i} x={cx} y={1066} textAnchor="middle" fontFamily={HTM_OSWALD} fontWeight={700} fontSize={54}
            fill={on ? "#FFF1CF" : "#3A3630"} filter={on ? "url(#htm-glow)" : undefined}>{c}</text>
        );
      })}
      {[MQ.y0 + 10, MQ.y1 - 14].map((y, row) =>
        Array.from({ length: BULBS }, (_, i) => {
          const b = bulbOn(i, row);
          const x = MQ.x0 + 12 + i * ((MQ.x1 - MQ.x0 - 24) / (BULBS - 1));
          return (
            <g key={`${row}-${i}`}>
              {b > 0 && <circle cx={x} cy={y} r={9} fill={HTM_LAMP} opacity={0.22 * b} />}
              <circle cx={x} cy={y} r={3.6} fill={b > 0 ? "#FFF6DE" : "#4A463F"} opacity={b > 0 ? b : 1} />
            </g>
          );
        }),
      )}
      {/* the light the marquee throws down on the sidewalk */}
      <rect x={40} y={1100} width={1000} height={200} fill="#FFD98A" opacity={0.08 * signOn(540)} />
      {/* people outside: a line at the doors, others walking past, each their own height, coat and hat */}
      {people.map((p, i) => <Person key={i} x={p.x} y={p.y} h={p.h} dir={p.dir} walk={p.walk} phase={p.phase} hat={p.hat} coat={p.coat} skirt={p.skirt} tone={p.tone} />)}
      {/* sidewalk, kerb, the avenue */}
      <rect x={0} y={1296} width={1080} height={22} fill="#24252A" />
      <rect x={0} y={1316} width={1080} height={4} fill="#5A5B60" />
      <rect x={0} y={1320} width={1080} height={140} fill="#14161B" />
      <rect x={0} y={1398} width={1080} height={3} fill="#C9B26A" opacity={0.35} />
      {/* the wet asphalt: a sheen of the marquee on the road */}
      <rect x={0} y={1322} width={1080} height={60} fill="#FFE2A8" opacity={0.05 * signOn(540)} />
      <Bus x={busX} y={1362} dir={1} />
      {cars.map((c, i) => <Car key={i} id={String(i)} x={c.x} y={c.y} dir={c.dir} color={c.c} roof={c.roof} kind={c.kind} k={c.k} haze={c.haze} />)}
      {/* where it is: in the clear sky over the right of the Garden's roof, with a dark halo off the skyline */}
      <g opacity={prog(f, T.big, 8, ease.linear)}>
        <text x={1010} y={796} textAnchor="end" fontFamily="Inter, sans-serif" fontWeight={500} fontSize={34} fill={HTM_DIM} stroke="#0B0F18" strokeWidth={10} strokeLinejoin="round" paintOrder="stroke">New York</text>
      </g>
    </g>
  );
};
