// wilt-100 hook variant 2: the Hershey Sports Arena far behind at night, small, redrawn from Eric Beato's 2008
// aerial (assets/refs/photos/commons-hershey-park-arena-2008-beato-ccby2.jpg): the long barrel vault with eleven
// raised ribs, four box dormers low on the near slope, a pale buttress fin at every rib foot, the cream wall with two
// rows of small square windows, the half-ellipse gable at the near end, trees in front. Drawn in its own 1000 x 360
// units. Its windows warm up on "one NBA game", go out in a wave on "almost nobody", and four stay, amber.
import React from "react";
import { ease, prog } from "../../../src/engine";
import { HX2_AMBER, HX2_LAMP, type HX2T, hx2Clamp, hx2Rnd } from "./HookX2Kit";

const EAVE = (x: number) => 238 - x * 0.035; // the eave line rises a hair toward the near (right) end
const RIDGE = (x: number) => 112 - x * 0.03;
const X0 = 70, X1 = 780; // the long side, far end to the gable
const SURVIVORS = [5, 17, 26, 38];

export const HookX2Vault: React.FC<{ f: number; T: HX2T; x: number; y: number; s: number; fade: number }> = ({ f, T, x, y, s, fade }) => {
  // window light: a few lit at first, all lit by "game", out in a wave from the far end on "almost nobody"
  const N = 44; // two rows of 22
  const winLit = (i: number) => {
    const col = i % 22;
    const base = hx2Rnd(i, 1) < 0.45 ? 0.8 : 0.12;
    const on = prog(f, T.in_ - 6 + col * 1.3, 8, ease.out);
    const out = prog(f, T.almost + col * 1.25, 6, ease.in);
    const surv = SURVIVORS.includes(i);
    const lvl = Math.max(base, on) * (surv ? 1 : 1 - out);
    const flick = 0.9 + 0.1 * hx2Rnd(i * 7 + Math.floor(f / 3), 2);
    return { lvl: lvl * flick, amber: surv ? prog(f, T.nobody, 10, ease.out) : 0 };
  };
  // the roof's glow: arena lights spilling up through the dormers while the game is on
  const glow = Math.max(0.25, prog(f, T.one - 4, 20, ease.out)) * (1 - prog(f, T.almost + 6, 22, ease.in));
  const ribs = Array.from({ length: 11 }, (_, i) => X0 + 30 + i * ((X1 - X0 - 50) / 10));
  const fins = ribs;
  const dormers = [ribs[1] + 30, ribs[3] + 30, ribs[5] + 30, ribs[7] + 30];
  const windows = Array.from({ length: N }, (_, i) => {
    const col = i % 22, row = Math.floor(i / 22);
    const wx = X0 + 20 + col * ((X1 - X0 - 40) / 22);
    return { i, wx, wy: EAVE(wx) + 28 + row * 34 };
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={fade}>
      {/* town glow on the sky behind the roof */}
      <ellipse cx={430} cy={140} rx={520} ry={170} fill="url(#hx2-skyglow)" opacity={0.55 + 0.45 * glow} />
      {/* far trees */}
      <path d="M-40 250 Q 0 205 40 236 Q 70 196 110 232 Q 140 210 170 244 L 170 330 L -40 330 Z" fill="#0B0F14" />
      {/* the long wall */}
      <path d={`M${X0} ${EAVE(X0)} L${X1} ${EAVE(X1)} L${X1} 340 L${X0} 340 Z`} fill="#23262B" />
      {/* the windows */}
      {windows.map(({ i, wx, wy }) => {
        const { lvl, amber } = winLit(i);
        const col = amber > 0 ? HX2_AMBER : HX2_LAMP;
        return (
          <g key={i}>
            <rect x={wx} y={wy} width={11} height={12} fill="#101317" />
            {lvl > 0.02 && <rect x={wx} y={wy} width={11} height={12} fill={col} opacity={hx2Clamp(lvl)} />}
            {lvl > 0.4 && <rect x={wx - 7} y={wy - 7} width={25} height={26} fill={col} opacity={0.12 * lvl + 0.25 * amber} filter="url(#hx2-winglow)" />}
          </g>
        );
      })}
      {/* the roof: the barrel vault seen from above its near side */}
      <path d={`M${X0 - 20} ${EAVE(X0) + 4} C ${X0 - 30} ${RIDGE(X0) + 70}, ${X0 - 6} ${RIDGE(X0) + 8}, ${X0 + 30} ${RIDGE(X0)} L ${X1 - 10} ${RIDGE(X1)} L ${X1 + 10} ${EAVE(X1)} Z`} fill="url(#hx2-roof)" />
      {/* the eleven ribs, eave to ridge, catching a little moonlight on their left edge */}
      {ribs.map((rx, i) => (
        <path key={i} d={`M${rx} ${EAVE(rx)} C ${rx - 6} ${EAVE(rx) - 60}, ${rx - 14} ${RIDGE(rx) + 22}, ${rx - 22} ${RIDGE(rx) + 2}`} stroke="#3A424D" strokeWidth={5} fill="none" opacity={0.9} />
      ))}
      {/* the dormers: small boxes with dark louvred faces, glowing a little while the game is on */}
      {dormers.map((dx, i) => (
        <g key={i}>
          <path d={`M${dx} ${EAVE(dx) - 44} l 28 -4 l 0 26 l -28 4 Z`} fill="#2B323B" />
          <rect x={dx + 4} y={EAVE(dx) - 40} width={18} height={16} fill={HX2_LAMP} opacity={0.1 + 0.45 * glow} />
          {[0, 1, 2].map((k) => <line key={k} x1={dx + 4} x2={dx + 22} y1={EAVE(dx) - 36 + k * 5} y2={EAVE(dx) - 37 + k * 5} stroke="#151A20" strokeWidth={2} />)}
        </g>
      ))}
      {/* the buttress fins at every rib foot */}
      {fins.map((fx, i) => (
        <path key={i} d={`M${fx - 4} ${EAVE(fx) + 2} L ${fx + 4} ${EAVE(fx) - 34} L ${fx + 14} ${EAVE(fx) + 2} Z`} fill="#4A4C50" />
      ))}
      {/* the gable end: a tall half ellipse of precast panels with vertical joints */}
      <path d={`M${X1 - 4} 340 L ${X1 - 4} ${EAVE(X1)} C ${X1 + 10} ${RIDGE(X1) + 20}, ${X1 + 70} ${RIDGE(X1) - 6}, ${X1 + 110} ${RIDGE(X1) + 18} C ${X1 + 160} ${RIDGE(X1) + 50}, ${X1 + 180} ${EAVE(X1) - 10}, ${X1 + 186} 340 Z`} fill="#2C2E33" />
      {Array.from({ length: 9 }, (_, i) => {
        const gx = X1 + 14 + i * 19;
        return <line key={i} x1={gx} x2={gx} y1={340} y2={RIDGE(X1) + 30 + Math.abs(i - 4) * 14} stroke="#202227" strokeWidth={2} />;
      })}
      {/* the entrance block and its lamp */}
      <rect x={X1 + 30} y={290} width={120} height={50} fill="#25272C" />
      <rect x={X1 + 78} y={304} width={24} height={36} fill={HX2_LAMP} opacity={0.18 + 0.35 * glow} />
      {/* near trees, dark */}
      <path d="M560 340 Q 590 280 640 306 Q 680 268 730 300 Q 770 286 790 340 Z" fill="#090C10" />
      <path d="M940 340 Q 960 282 1000 300 Q 1030 270 1060 340 Z" fill="#090C10" />
    </g>
  );
};

export const HookX2VaultDefs: React.FC = () => (
  <defs>
    <radialGradient id="hx2-skyglow" cx="0.5" cy="0.6" r="0.5">
      <stop offset="0" stopColor="#3A2E22" stopOpacity="0.9" />
      <stop offset="1" stopColor="#0D1117" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="hx2-roof" x1="0" y1="0" x2="0.15" y2="1">
      <stop offset="0" stopColor="#2A313A" />
      <stop offset="1" stopColor="#171C22" />
    </linearGradient>
    <filter id="hx2-winglow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" />
    </filter>
  </defs>
);
