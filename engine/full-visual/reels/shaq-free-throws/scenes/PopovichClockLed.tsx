// The AT&T Center game clock, drawn from the real unit above the Spurs' basket
// (photos/commons-att-center-spurs-nuggets1-zereshk-ccbysa3.jpg): a square black housing, two threaded rods out of its
// roof, an aluminium lip along the bottom, and the game clock as amber seven-segment digits slanted a few degrees.
// Every segment is a row of LED dots; the unlit ones stay faintly visible as dark dots (the giveaway of a real board).
// Only the game clock row is drawn: on this reel red means the foul, so the last digit can turn foul red alone.
// Local box: 540 x 300, (0,0) top left of the housing. The parent places it.
import React from "react";

const AMBER = "#FFB31F";
const AMBER_HI = "#FFE3A0";
const UNLIT = "#2B2416";
export const POPOVICHCLOCK_RED = "#E5383B";

const SEGS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abged",
  "3": "abgcd",
  "4": "fgbc",
  "5": "afgcd",
  "6": "afgedc",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
};

const W = 76; // digit cell
const H = 148;
const M = 9; // segment inset at the corners
const PITCH = 10.5; // LED dot pitch
const SLANT = Math.tan((5 * Math.PI) / 180);

type P = [number, number];
const segEnds = (s: string): [P, P] => {
  switch (s) {
    case "a":
      return [[M, 0], [W - M, 0]];
    case "b":
      return [[W, M], [W, H / 2 - M]];
    case "c":
      return [[W, H / 2 + M], [W, H - M]];
    case "d":
      return [[M, H], [W - M, H]];
    case "e":
      return [[0, H / 2 + M], [0, H - M]];
    case "f":
      return [[0, M], [0, H / 2 - M]];
    default:
      return [[M, H / 2], [W - M, H / 2]];
  }
};

/** the LED dots of one segment, slanted */
const dots = (s: string, ox: number, oy: number) => {
  const [a, b] = segEnds(s);
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(2, Math.round(len / PITCH) + 1);
  const out: P[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = a[0] + (b[0] - a[0]) * t;
    const y = a[1] + (b[1] - a[1]) * t;
    out.push([ox + x + (H - y) * SLANT, oy + y]);
  }
  return out;
};

const Digit: React.FC<{ ch: string; x: number; y: number; color: string; flash: number; id: string }> = ({ ch, x, y, color, flash, id }) => {
  const lit = SEGS[ch] ?? "";
  const all = "abcdefg".split("");
  return (
    <g>
      {all.map((s) =>
        dots(s, x, y).map(([px, py], i) => (
          <circle key={`${id}u${s}${i}`} cx={px} cy={py} r={3.6} fill={UNLIT} opacity={lit.includes(s) ? 0 : 0.9} />
        )),
      )}
      <g filter="url(#pvc-glow)">
        {lit.split("").map((s) =>
          dots(s, x, y).map(([px, py], i) => <circle key={`${id}g${s}${i}`} cx={px} cy={py} r={5.2} fill={color} opacity={0.9} />),
        )}
      </g>
      {lit.split("").map((s) =>
        dots(s, x, y).map(([px, py], i) => (
          <circle key={`${id}l${s}${i}`} cx={px} cy={py} r={4.1} fill={color} />
        )),
      )}
      {/* the hot centre of each LED */}
      {lit.split("").map((s) =>
        dots(s, x, y).map(([px, py], i) => (
          <circle key={`${id}h${s}${i}`} cx={px - 0.6} cy={py - 0.8} r={1.6} fill={color === AMBER ? AMBER_HI : "#FFC9C9"} opacity={0.55 + 0.45 * flash} />
        )),
      )}
    </g>
  );
};

export const POPOVICHCLOCK_UNIT = { w: 540, h: 290, digitsX: 64, digitsY: 70, cellW: W, cellH: H, gap: 28, colonW: 40 };

/** x of each digit cell, in the housing */
export const popovichClockCellX = (i: number) => {
  const u = POPOVICHCLOCK_UNIT;
  return u.digitsX + i * (u.cellW + u.gap) + (i >= 2 ? u.colonW : 0);
};

export const PopovichClockLed: React.FC<{
  text: string; // "12:00" or "11:55"
  lastRed: number; // 0..1, the last digit recolours to foul red
  flash: number; // 0..1, a brightness pop on each tick
  ring: number; // 0..1, a foul red ring round the last digit
  f: number;
}> = ({ text, lastRed, flash, ring, f }) => {
  const u = POPOVICHCLOCK_UNIT;
  const digits = text.replace(":", "").split("");
  const colonX = popovichClockCellX(2) - u.gap / 2 - u.colonW / 2 + 6;
  const lastColor = lastRed > 0.5 ? POPOVICHCLOCK_RED : AMBER;
  const shimmer = 0.5 + 0.5 * Math.sin(f / 17);
  const sheen = -120 + ((f * 3.2) % 820);
  return (
    <svg width={u.w} height={u.h + 120} viewBox={`0 -110 ${u.w} ${u.h + 120}`} style={{ position: "absolute", left: 0, top: -110, overflow: "visible" }}>
      <defs>
        <filter id="pvc-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={6} />
        </filter>
        <linearGradient id="pvc-housing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A2F37" />
          <stop offset="0.08" stopColor="#15181D" />
          <stop offset="1" stopColor="#0A0C0F" />
        </linearGradient>
        <linearGradient id="pvc-rod" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3A3F46" />
          <stop offset="0.45" stopColor="#9AA1AA" />
          <stop offset="1" stopColor="#2B2F35" />
        </linearGradient>
        <linearGradient id="pvc-lip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9CDD2" />
          <stop offset="0.5" stopColor="#8E949B" />
          <stop offset="1" stopColor="#4A4F56" />
        </linearGradient>
        <clipPath id="pvc-window">
          <rect x={34} y={36} width={u.w - 68} height={u.h - 86} rx={6} />
        </clipPath>
        <linearGradient id="pvc-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.07} />
          <stop offset="0.35" stopColor="#FFFFFF" stopOpacity={0.015} />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* two threaded rods out of the roof, up into the truss */}
      {[150, 390].map((x) => (
        <g key={x}>
          <rect x={x - 9} y={-110} width={18} height={112} fill="url(#pvc-rod)" />
          {Array.from({ length: 14 }, (_, i) => (
            <line key={i} x1={x - 9} x2={x + 9} y1={-104 + i * 8} y2={-100 + i * 8} stroke="#1E2126" strokeWidth={1.2} opacity={0.7} />
          ))}
          <rect x={x - 17} y={-6} width={34} height={10} rx={2} fill="#5A6068" />
        </g>
      ))}

      {/* the housing: black box, a bevel catching the arena light on top */}
      <rect x={0} y={0} width={u.w} height={u.h} rx={10} fill="url(#pvc-housing)" stroke="#3A4049" strokeWidth={2} />
      <rect x={4} y={3} width={u.w - 8} height={3} rx={1.5} fill="#FFFFFF" opacity={0.18} />
      {/* screws at the corners of the face */}
      {[
        [18, 18],
        [u.w - 18, 18],
        [18, u.h - 34],
        [u.w - 18, u.h - 34],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={5} fill="#2C3138" stroke="#4B525B" strokeWidth={1} />
          <line x1={x - 3} x2={x + 3} y1={y} y2={y} stroke="#12151A" strokeWidth={1.4} />
        </g>
      ))}
      {/* the display window, recessed */}
      <rect x={34} y={36} width={u.w - 68} height={u.h - 86} rx={6} fill="#040506" stroke="#1D2127" strokeWidth={3} />

      {/* the digits */}
      {digits.map((d, i) => (
        <Digit key={i} id={`d${i}`} ch={d} x={popovichClockCellX(i)} y={u.digitsY} color={i === 3 ? lastColor : AMBER} flash={i === 3 ? flash : flash * 0.6} />
      ))}
      {/* the colon: two small squares of four LEDs */}
      {[u.digitsY + 44, u.digitsY + 104].map((y) => (
        <g key={y} filter={undefined}>
          {[
            [0, 0],
            [9, 0],
            [0, 9],
            [9, 9],
          ].map(([dx, dy]) => (
            <circle key={`${dx}${dy}`} cx={colonX + dx + (H - (y - u.digitsY)) * SLANT} cy={y + dy} r={3.8} fill={AMBER} style={{ filter: "drop-shadow(0 0 5px rgba(255,179,31,0.8))" }} />
          ))}
        </g>
      ))}

      {/* the foul red ring round the last digit */}
      {ring > 0 && (
        <rect
          x={popovichClockCellX(3) - 18 + 6}
          y={u.digitsY - 18}
          width={W + 36}
          height={H + 36}
          rx={14}
          fill="none"
          stroke={POPOVICHCLOCK_RED}
          strokeWidth={5}
          opacity={Math.min(1, ring * 1.4) * (1 - 0.25 * shimmer * ring)}
          transform={`translate(${(popovichClockCellX(3) + W / 2 + 6).toFixed(1)} ${(u.digitsY + H / 2).toFixed(1)}) scale(${(1.35 - 0.35 * ring).toFixed(3)}) translate(${-(popovichClockCellX(3) + W / 2 + 6).toFixed(1)} ${-(u.digitsY + H / 2).toFixed(1)})`}
        />
      )}

      {/* the glass over the face, and the arena lights sliding across it */}
      <rect x={34} y={36} width={u.w - 68} height={u.h - 86} rx={6} fill="url(#pvc-glass)" />
      <g clipPath="url(#pvc-window)">
        <polygon
          points={`${sheen},36 ${sheen + 60},36 ${sheen - 60},${u.h - 50} ${sheen - 120},${u.h - 50}`}
          fill="#FFFFFF"
          opacity={0.05}
        />
        <polygon points={`${sheen + 80},36 ${sheen + 96},36 ${sheen - 24},${u.h - 50} ${sheen - 40},${u.h - 50}`} fill="#FFFFFF" opacity={0.04} />
      </g>
      {/* the aluminium lip along the bottom, as on the real unit */}
      <rect x={6} y={u.h - 24} width={u.w - 12} height={20} rx={3} fill="url(#pvc-lip)" />
      <rect x={6} y={u.h - 24} width={u.w - 12} height={2} fill="#FFFFFF" opacity={0.4} />
    </svg>
  );
};
