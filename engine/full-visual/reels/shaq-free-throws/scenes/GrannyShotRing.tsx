// The basket both men shoot at, seen front-on from the line: the bottom of the glass board with its 2 in white
// border and the lower half of the 24 x 18 in shooter's square, the orange steel ring (18 in inside, its front lip
// lit), the 18 in white net knotted in diamonds. `k` px per foot; (0, 0) is the ring's front centre.
// `swish` 0..1 is a ball going through: the net throws up and sways back.
import React from "react";

export const GrannyShotRing: React.FC<{ k: number; swish: number; t: number; boardAlpha?: number }> = ({ k, swish, t, boardAlpha = 1 }) => {
  const rx = 0.75 * k;
  const ry = 0.1 * k;
  const netH = 1.5 * k;
  const cols = 12;
  const rows = 5;
  // the net's hang: a swish lifts and narrows the bottom, then it sways back
  const lift = Math.sin(Math.min(1, swish) * Math.PI) * 0.35;
  const sway = swish > 0 ? Math.sin(t * 0.45) * 0.04 * Math.exp(-Math.max(0, swish - 0.5) * 2) : 0;
  const knot = (c: number, r: number): [number, number] => {
    const v = r / rows;
    const top = rx;
    const bot = rx * (0.55 - 0.1 * lift);
    const half = top + (bot - top) * v;
    const ang = (c / cols) * Math.PI * 2;
    const x = Math.cos(ang) * half + sway * k * v;
    const y = Math.sin(ang) * ry * (1 - v * 0.5) + v * netH * (1 - lift);
    return [x, y];
  };
  const front: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = knot(c + (r % 2 ? 0.5 : 0), r);
      const b = knot(c + (r % 2 ? 1 : 0.5), r + 1);
      const b2 = knot(c + (r % 2 ? 0 : -0.5), r + 1);
      const fr = Math.sin(((c + 0.25) / cols) * Math.PI * 2) > -0.2;
      front.push(<path key={`${r}-${c}`} d={`M${a[0].toFixed(1)},${a[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)} M${a[0].toFixed(1)},${a[1].toFixed(1)} L${b2[0].toFixed(1)},${b2[1].toFixed(1)}`} stroke="#F2F2F2" strokeWidth={Math.max(1.2, k * 0.016)} opacity={fr ? 0.95 : 0.45} />);
    }
  }
  return (
    <g>
      {/* the bottom of the board: glass, white border, the shooter's square */}
      <g opacity={boardAlpha}>
        <defs>
          <linearGradient id="gs-glass" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#C9D6E2" stopOpacity={0.16} />
            <stop offset="1" stopColor="#C9D6E2" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gs-board-fade" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </linearGradient>
          <mask id="gs-board-mask">
            <rect x={-3.2 * k} y={-0.9 * k} width={6.4 * k} height={1.5 * k} fill="url(#gs-board-fade)" />
          </mask>
        </defs>
        <g mask="url(#gs-board-mask)">
          <rect x={-3 * k} y={-1.6 * k} width={6 * k} height={1.95 * k} fill="url(#gs-glass)" />
          <rect x={-3 * k} y={-1.6 * k} width={6 * k} height={1.95 * k} fill="none" stroke="#FFFFFF" strokeWidth={(2 / 12) * k} />
          <path d={`M${-1 * k},${-1.5 * k} V${-0.02 * k} H${1 * k} V${-1.5 * k}`} fill="none" stroke="#FFFFFF" strokeWidth={(2 / 12) * k} />
        </g>
        {/* the bracket from the board to the ring */}
        <path d={`M${-0.22 * k},${-0.02 * k} L${-0.12 * k},${-0.12 * k} H${0.12 * k} L${0.22 * k},${-0.02 * k}`} fill="#9A3A12" />
      </g>
      {/* back half of the ring, behind the net */}
      <path d={`M${-rx},0 A${rx},${ry} 0 0 1 ${rx},0`} fill="none" stroke="#A8441A" strokeWidth={Math.max(3, k * 0.055)} />
      {front}
      {/* the front lip of the ring, lit from above */}
      <path d={`M${-rx},0 A${rx},${ry} 0 0 0 ${rx},0`} fill="none" stroke="#E2622A" strokeWidth={Math.max(4, k * 0.07)} strokeLinecap="round" />
      <path d={`M${-rx * 0.8},${ry * 0.55} A${rx},${ry} 0 0 0 ${rx * 0.3},${ry * 0.95}`} fill="none" stroke="#FFB07A" strokeWidth={Math.max(1.2, k * 0.015)} opacity={0.8} />
      {/* net hooks */}
      {Array.from({ length: cols }, (_, c) => {
        const a = knot(c, 0);
        return Math.sin((c / cols) * Math.PI * 2) > 0 ? <circle key={c} cx={a[0]} cy={a[1]} r={Math.max(1.2, k * 0.018)} fill="#7C2F10" /> : null;
      })}
    </g>
  );
};
