// wilt-100 "photo": the locker room, as the 1962 photo's background shows it: a painted block wall, a wooden hook
// rail with iron double hooks, overcoats and one light jacket hanging (the photo's right edge), a slatted bench.
// One bulb above lights it from the top centre. Drawn in stage px; the scene moves it as one block.
import React from "react";
import { pdClamp, pdRnd } from "./PhotoDevelopingKit";

export const PD_RAIL_Y = 640;
export const PD_HOOKS = [150, 345, 540, 735, 930];

const BW = 150, BH = 75; // concrete blocks, 16 x 8 in, at stage scale

/** a coat on a hook: shoulders, collar, lapels, sleeve edges, folds, a hem */
const Coat: React.FC<{ x: number; f: number; i: number; tone: [string, string, string]; len: number; lining?: string; bulbX: number }> = ({ x, f, i, tone, len, lining, bulbX }) => {
  const sway = Math.sin(f / 47 + i * 1.7) * 0.7 + Math.sin(f / 23 + i) * 0.25;
  const y0 = PD_RAIL_Y + 18;
  const w = 150 + (i % 2) * 18;
  const id = `pdCoat${i}`;
  // the outline: collar at the hook, shoulders falling, body widening a little to the hem
  const d = `M ${-18} ${0} C ${-40} 6 ${-w * 0.42} 22 ${-w * 0.55} 60 L ${-w * 0.62} ${len * 0.55} C ${-w * 0.64} ${len * 0.8} ${-w * 0.6} ${len * 0.95} ${-w * 0.58} ${len} L ${w * 0.6} ${len + 6} C ${w * 0.62} ${len * 0.9} ${w * 0.66} ${len * 0.7} ${w * 0.63} ${len * 0.52} L ${w * 0.56} 60 C ${w * 0.44} 22 ${40} 6 ${18} 0 Z`;
  const folds = [-0.38, -0.12, 0.16, 0.41].map((k, j) => {
    const fx = k * w + (pdRnd(i * 7 + j) - 0.5) * 18;
    return `M ${fx} ${80 + j * 9} C ${fx + 8} ${len * 0.4} ${fx - 10} ${len * 0.7} ${fx + 4} ${len - 4}`;
  });
  return (
    <g transform={`translate(${x} ${y0}) rotate(${sway.toFixed(3)})`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={tone[2]} />
          <stop offset="0.35" stopColor={tone[1]} />
          <stop offset="0.62" stopColor={tone[0]} />
          <stop offset="1" stopColor={tone[2]} />
        </linearGradient>
      </defs>
      {/* the shadow it throws on the wall, the bulb is above and a little in front */}
      <path d={d} fill="rgba(0,0,0,0.5)" transform={`translate(${((x - bulbX) * 0.07).toFixed(1)} 18)`} filter="url(#pdSoft)" />
      <path d={d} fill={`url(#${id})`} />
      {lining && <path d={`M ${w * 0.5} 70 L ${w * 0.6} ${len * 0.55} L ${w * 0.6} ${len + 4} L ${w * 0.46} ${len + 2} L ${w * 0.42} 80 Z`} fill={lining} opacity={0.75} />}
      {/* collar and lapels */}
      <path d={`M -18 0 C -30 30 -26 70 -6 150 L 0 120 L 6 150 C 26 70 30 30 18 0`} fill="rgba(0,0,0,0.35)" />
      <path d={`M -6 150 L -30 260 M 6 150 L 30 260`} stroke="rgba(0,0,0,0.35)" strokeWidth={3} fill="none" />
      {/* the folds, dark with a lit edge */}
      {folds.map((p, j) => (
        <g key={j}>
          <path d={p} stroke="rgba(0,0,0,0.38)" strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d={p} stroke="rgba(255,255,255,0.06)" strokeWidth={2} fill="none" transform="translate(5 0)" />
        </g>
      ))}
      {/* the buttons of a buttoned overcoat */}
      {!lining && [300, 380, 460].map((by) => <circle key={by} cx={-3} cy={by} r={6} fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} />)}
      {/* the light from above on the shoulders */}
      <path d={d} fill="url(#pdTopLight)" />
      {/* the loop on the hook */}
      <path d="M -6 2 C -6 -16 6 -16 6 2" stroke={tone[2]} strokeWidth={4} fill="none" />
    </g>
  );
};

export const PhotoDevelopingRoomDefs: React.FC = () => (
  <defs>
    <filter id="pdSoft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" />
    </filter>
    <linearGradient id="pdTopLight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="rgba(255,248,230,0.16)" />
      <stop offset="0.25" stopColor="rgba(255,248,230,0.03)" />
      <stop offset="1" stopColor="rgba(0,0,0,0.25)" />
    </linearGradient>
    <linearGradient id="pdRail" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#7A5A3A" />
      <stop offset="0.5" stopColor="#5E4329" />
      <stop offset="1" stopColor="#3B2918" />
    </linearGradient>
    <linearGradient id="pdBenchTop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#8A6844" />
      <stop offset="1" stopColor="#6A4D30" />
    </linearGradient>
    <linearGradient id="pdHook" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#2A2A2C" />
      <stop offset="0.5" stopColor="#77777A" />
      <stop offset="1" stopColor="#2A2A2C" />
    </linearGradient>
  </defs>
);

/** the bulb on its cord above the frame, still swinging a little */
export const pdBulbX = (f: number) => 540 + 70 * Math.sin(f / 38);

export const PhotoDevelopingRoom: React.FC<{ f: number; light: number }> = ({ f, light }) => {
  const bulbX = pdBulbX(f);
  const rows = Math.ceil(1500 / BH);
  const blocks: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const y = 380 + r * BH;
    const off = r % 2 ? BW / 2 : 0;
    for (let c = -1; c < 1080 / BW + 1; c++) {
      const x = c * BW + off;
      const t = pdRnd(r * 31 + c * 7.3);
      const g = Math.round(64 + t * 9);
      blocks.push(<rect key={`${r}-${c}`} x={x + 2} y={y + 2} width={BW - 4} height={BH - 4} rx={2} fill={`rgb(${g - 6},${g},${g - 3})`} />);
      // pits in the block face
      if (t > 0.55) blocks.push(<circle key={`p${r}-${c}`} cx={x + 20 + t * 100} cy={y + 18 + pdRnd(c + r) * 40} r={1.6 + t * 1.5} fill="rgba(0,0,0,0.25)" />);
    }
  }
  const coats: [number, [string, string, string], number, string?][] = [
    [PD_HOOKS[0], ["#3A3C40", "#2C2E32", "#18191C"], 560],
    [PD_HOOKS[1], ["#40362E", "#30281F", "#19140F"], 600],
    [PD_HOOKS[3], ["#33373F", "#262A31", "#14161A"], 540],
    [PD_HOOKS[4], ["#77756D", "#5F5D56", "#3A3935"], 520, "#B9B3A2"],
  ];
  const flick = 0.92 + 0.08 * Math.sin(f / 5.3) * Math.sin(f / 2.1);
  return (
    <g>
      <defs>
    <radialGradient id="pdBulbLight" cx={bulbX} cy={470} r="900" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="rgba(255,236,200,0.30)" />
      <stop offset="0.45" stopColor="rgba(255,236,200,0.09)" />
      <stop offset="1" stopColor="rgba(0,0,0,0)" />
    </radialGradient>
      </defs>
      {/* the painted block wall, mortar showing between the blocks */}
      <rect x={-200} y={300} width={1480} height={1700} fill="#2C302E" />
      <g opacity={0.95}>{blocks}</g>
      {/* the bulb's light on the wall, and the cool dark at the edges */}
      <rect x={-200} y={300} width={1480} height={1700} fill="url(#pdBulbLight)" opacity={pdClamp(light) * flick} />
      <rect x={-200} y={300} width={1480} height={1700} fill="rgba(13,17,23,1)" opacity={0.5 - 0.22 * pdClamp(light)} />
      {/* the rail: an oiled board on the wall, its shadow below, screws */}
      <rect x={-20} y={PD_RAIL_Y + 38} width={1120} height={22} fill="rgba(0,0,0,0.45)" filter="url(#pdSoft)" />
      <rect x={-20} y={PD_RAIL_Y - 26} width={1120} height={56} fill="url(#pdRail)" />
      <rect x={-20} y={PD_RAIL_Y - 26} width={1120} height={3} fill="rgba(255,230,190,0.25)" />
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={60 + i * 120} cy={PD_RAIL_Y + 2} r={4} fill="#2A2520" stroke="#8B7458" strokeWidth={1} />
      ))}
      {/* the iron double hooks */}
      {PD_HOOKS.map((hx) => (
        <g key={hx} transform={`translate(${hx} ${PD_RAIL_Y - 8})`}>
          <rect x={-9} y={-8} width={18} height={30} rx={3} fill="url(#pdHook)" />
          <path d="M 0 10 C 0 30 2 40 16 40 C 24 40 26 34 24 28" stroke="url(#pdHook)" strokeWidth={7} fill="none" strokeLinecap="round" />
          <path d="M 0 4 L 0 -18 C 0 -26 -8 -28 -12 -22" stroke="url(#pdHook)" strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      ))}
      {coats.map(([x, tone, len, lining], i) => (
        <Coat key={i} x={x} f={f} i={i} tone={tone} len={len} lining={lining} bulbX={bulbX} />
      ))}
      {/* the bench: slatted seat seen a little from above, front rail, legs */}
      <g>
        <rect x={-40} y={1352} width={1160} height={70} fill="rgba(0,0,0,0.5)" filter="url(#pdSoft)" />
        {[0, 1, 2].map((s) => (
          <rect key={s} x={-40} y={1290 + s * 22} width={1160} height={19} fill="url(#pdBenchTop)" />
        ))}
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d={`M ${-40 + i * 52} ${1292 + (i % 3) * 22} q 30 ${2 + pdRnd(i) * 4} 60 0`} stroke="rgba(40,25,10,0.35)" strokeWidth={1.4} fill="none" />
        ))}
        <rect x={-40} y={1356} width={1160} height={30} fill="#4A3522" />
        <rect x={-40} y={1356} width={1160} height={2} fill="rgba(255,220,170,0.25)" />
        {[60, 1000].map((lx) => (
          <rect key={lx} x={lx} y={1386} width={26} height={200} fill="#3A2918" />
        ))}
      </g>
    </g>
  );
};
