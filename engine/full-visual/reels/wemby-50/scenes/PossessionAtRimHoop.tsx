// The basket of `cost`, at NBA geometry (notes/PossessionAtRim.md), as the Toronto photo shows it: a black padded
// stanchion base behind the baseline, its post and long arm reaching over to the back of a clear glass board (white
// border, white shooting rectangle, black bottom pad, the dark LED strip round its edge), the shot clock box on top
// (game clock in warm white over a big red shot clock, a plain plate under it), the orange ring on its flange and a
// 12-loop nylon net knotted in diamonds. Everything is drawn through one projector, so the same parts can be drawn
// again mirrored as their reflection in the satin floor.
import React from "react";
import { staticFile } from "remotion";
import { PAR, possessionAtRimPlane as plane, possessionAtRimPoly as poly, type PossessionAtRimProj, type PossessionAtRimV3 } from "./PossessionAtRimWorld";

type P3 = PossessionAtRimV3;

/** a box drawn face by face, far faces first */
function PossessionAtRimBox({ pr, a, b, fills, stroke }: { pr: PossessionAtRimProj; a: P3; b: P3; fills: { top: string; side: string; front: string; back?: string }; stroke?: string }) {
  const [x0, y0, z0] = a;
  const [x1, y1, z1] = b;
  const faces: { pts: P3[]; c: string }[] = [
    { pts: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], c: fills.top },
    { pts: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], c: fills.side },
    { pts: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], c: fills.front },
    { pts: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], c: fills.back ?? fills.side },
    { pts: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], c: fills.side },
    { pts: [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], c: fills.side },
  ];
  const cen = (q: P3[]): P3 => [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2, (q[0][2] + q[2][2]) / 2];
  faces.sort((m, n) => pr.depth(cen(n.pts)) - pr.depth(cen(m.pts)));
  return (
    <g>
      {faces.map((q, i) => (
        <polygon key={i} points={poly(pr.P, q.pts)} fill={q.c} stroke={stroke} strokeWidth={stroke ? 1 : 0} strokeLinejoin="round" />
      ))}
    </g>
  );
}

// a 7-segment LED digit in a w x h cell, as the real clocks are built
const SEG: Record<string, number[]> = {
  "0": [1, 1, 1, 1, 1, 1, 0], "1": [0, 1, 1, 0, 0, 0, 0], "2": [1, 1, 0, 1, 1, 0, 1], "3": [1, 1, 1, 1, 0, 0, 1],
  "4": [0, 1, 1, 0, 0, 1, 1], "5": [1, 0, 1, 1, 0, 1, 1], "6": [1, 0, 1, 1, 1, 1, 1], "7": [1, 1, 1, 0, 0, 0, 0],
  "8": [1, 1, 1, 1, 1, 1, 1], "9": [1, 1, 1, 1, 0, 1, 1], " ": [0, 0, 0, 0, 0, 0, 0],
};
function possessionAtRimDigit(ch: string, x: number, y: number, w: number, h: number, t: number) {
  const g = t * 0.12;
  const hs = (x0: number, yy: number) => `M${x0 + g + t / 2} ${yy}l${t / 2} ${-t / 2}h${w - 2 * t - 2 * g}l${t / 2} ${t / 2}l${-t / 2} ${t / 2}h${-(w - 2 * t - 2 * g)}z`;
  const vs = (xx: number, y0: number, len: number) => `M${xx} ${y0 + g + t / 2}l${t / 2} ${t / 2}v${len - 2 * t - 2 * g}l${-t / 2} ${t / 2}l${-t / 2} ${-t / 2}v${-(len - 2 * t - 2 * g)}z`;
  const half = h / 2;
  const segs = [hs(x, y + t / 2), vs(x + w - t / 2, y, half), vs(x + w - t / 2, y + half, half), hs(x, y + h - t / 2), vs(x + t / 2, y + half, half), vs(x + t / 2, y, half), hs(x, y + half)];
  const on = SEG[ch] ?? SEG[" "];
  return { on: segs.filter((_, i) => on[i]).join(""), off: segs.filter((_, i) => !on[i]).join("") };
}

/** the shot clock face and its plate, drawn in a 260 x 256 design box */
const PossessionAtRimClockFace: React.FC<{ game: string; shot: string; gameLit: number; shotLit: number; flash: number; id: string }> = ({ game, shot, gameLit, shotLit, flash, id }) => {
  // game clock "10:09": four digits and a colon, warm white
  const gd: { on: string; off: string }[] = [];
  const gw = 34, gh = 56, gt = 7.5;
  const digits = game.replace(":", "").padStart(4, " ");
  const gx = [40, 80, 136, 176];
  digits.split("").forEach((c, i) => gd.push(possessionAtRimDigit(c === "0" && i === 0 ? " " : c, gx[i], 20, gw, gh, gt)));
  const sd: { on: string; off: string }[] = [];
  const s2 = shot.padStart(2, " ");
  s2.split("").forEach((c, i) => sd.push(possessionAtRimDigit(c, 50 + i * 86, 92, 70, 92, 13)));
  const warm = "#FFF1D6";
  const red = "#FF3B2F";
  return (
    <g>
      <defs>
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      {/* housing: black, a hairline of brushed edge */}
      <rect x={0} y={0} width={260} height={256} rx={10} fill="#07080A" stroke="#3A3F47" strokeWidth={3} />
      <rect x={12} y={12} width={236} height={70} rx={4} fill="#0D0E11" />
      <rect x={12} y={86} width={236} height={102} rx={4} fill="#0D0E11" />
      {/* unlit segments, the faint ghost every LED clock shows */}
      <path d={gd.map((d) => d.off + d.on).join("")} fill="#2A2420" opacity={0.55} />
      <path d={sd.map((d) => d.off + d.on).join("")} fill="#2A1212" opacity={0.6} />
      {/* colon */}
      <g fill={warm} opacity={gameLit}>
        <rect x={121} y={34} width={7} height={7} />
        <rect x={121} y={56} width={7} height={7} />
      </g>
      <g opacity={gameLit}>
        <path d={gd.map((d) => d.on).join("")} fill={warm} filter={`url(#${id}-glow)`} opacity={0.6} />
        <path d={gd.map((d) => d.on).join("")} fill={warm} />
      </g>
      <g opacity={shotLit}>
        <path d={sd.map((d) => d.on).join("")} fill={red} filter={`url(#${id}-glow)`} opacity={0.75 + 0.25 * flash} />
        <path d={sd.map((d) => d.on).join("")} fill={flash > 0 ? "#FF6A5C" : red} />
      </g>
      {/* the sponsor plate under it, drawn plain: a backlit panel with its frame, no name */}
      <rect x={0} y={198} width={260} height={58} rx={6} fill="#07080A" />
      <rect x={12} y={204} width={236} height={44} rx={4} fill="#1B2028" stroke="#5A626D" strokeWidth={2} />
      <rect x={14} y={206} width={232} height={18} rx={3} fill="#E8EDF2" opacity={0.12} />
      <rect x={30} y={224} width={200} height={3} fill="#C4CED4" opacity={0.35} />
    </g>
  );
};

export type PossessionAtRimHoopState = {
  game: string;
  shot: string;
  gameLit: number;
  shotLit: number;
  shotFlash: number;
  rattle: number; // ft the ring is jolted up/down this frame
  net: { stretch: number; bulge: number; sx: number; sz: number };
};

/** stanchion, board and shot clock: everything of the basket that stands behind the ring */
export const PossessionAtRimBasket: React.FC<{ pr: PossessionAtRimProj; st: PossessionAtRimHoopState; id: string; mirror?: boolean }> = ({ pr, st, id, mirror }) => {
  const { P } = pr;
  const bz = PAR.boardZ;
  const bw = PAR.boardW / 2;
  const c = P([0, 11.25, bz]);
  const line = Math.max(2, c.s * 0.167);
  const glassTL = P([-bw, PAR.boardTop, bz]);
  const glassBR = P([bw, PAR.boardBot, bz]);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-glass`} gradientUnits="userSpaceOnUse" x1={glassTL.x} y1={glassTL.y} x2={glassBR.x} y2={glassBR.y}>
          <stop offset="0" stopColor="#CFE3F2" stopOpacity={0.1} />
          <stop offset="0.38" stopColor="#CFE3F2" stopOpacity={0.05} />
          <stop offset="0.42" stopColor="#FFFFFF" stopOpacity={0.2} />
          <stop offset="0.47" stopColor="#CFE3F2" stopOpacity={0.04} />
          <stop offset="1" stopColor="#CFE3F2" stopOpacity={0.08} />
        </linearGradient>
      </defs>
      {/* stanchion: padded base behind the baseline, the post, the arm over the baseline to the board */}
      <PossessionAtRimBox pr={pr} a={[-2.6, 0, -9.2]} b={[2.6, 3.4, -3.2]} fills={{ top: "#1E232B", side: "#0C0E12", front: "#15191F" }} stroke="#262C35" />
      {/* the padding: a rolled top edge and the quilted seams down the sides */}
      <polygon points={poly(P, [[-2.62, 3.4, -3.18], [2.62, 3.4, -3.18], [2.62, 3.1, -3.12], [-2.62, 3.1, -3.12]])} fill="#262C35" />
      <path d={[-1.7, -0.85, 0, 0.85, 1.7].map((x) => { const a = P([x, 3.08, -3.17]); const b = P([x, 2.95, -3.17]); return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`; }).join("") + [-8.2, -6.7, -5.2, -3.7].map((z) => { const a = P([2.6, 0.1, z]); const b = P([2.6, 3.3, z]); return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`; }).join("")} stroke="#050608" strokeWidth={1.5} />
      {/* the lit LED panel on its front, facing the court: the Spurs mark on a dark screen, its light spilling on the apron */}
      <polygon points={poly(P, [[-2.6, 0, -3.18], [2.6, 0, -3.18], [3.4, 0, -1.4], [-3.4, 0, -1.4]])} fill="#9FB3C8" opacity={0.07} />
      <g transform={plane(P, [-2.3, 2.95, -3.17], [2.3, 2.95, -3.17], [-2.3, 0.55, -3.17], 460, 240)}>
        <rect x={0} y={0} width={460} height={240} rx={6} fill="#05070B" />
        <rect x={8} y={8} width={444} height={224} rx={4} fill="#101826" />
        <rect x={8} y={8} width={444} height={224} rx={4} fill="#C4CED4" opacity={0.07} />
        <image href={staticFile("wemby-50/possessionatrim-spurs.svg")} x={130} y={20} width={200} height={200} />
        <rect x={8} y={8} width={444} height={5} fill="#E6EBF0" opacity={0.55} />
      </g>
      <polygon points={poly(P, [[-2.6, 0.25, -3.19], [2.6, 0.25, -3.19], [2.6, 0.38, -3.19], [-2.6, 0.38, -3.19]])} fill="#C4CED4" opacity={0.55} />
      <PossessionAtRimBox pr={pr} a={[-0.75, 3.4, -7.4]} b={[0.75, 12.4, -6.2]} fills={{ top: "#20252D", side: "#0B0D10", front: "#14171C" }} />
      <polygon points={poly(P, [[-0.55, 12.6, -7.2], [0.55, 12.6, -7.2], [0.55, 11.6, 3.7], [-0.55, 11.6, 3.7]])} fill="#191D23" />
      <polygon points={poly(P, [[-0.55, 11.7, -7.2], [0.55, 11.7, -7.2], [0.55, 10.7, 3.7], [-0.55, 10.7, 3.7]])} fill="#0E1014" />
      <polygon points={poly(P, [[-0.55, 12.6, -7.2], [-0.55, 11.7, -7.2], [-0.55, 10.7, 3.7], [-0.55, 11.6, 3.7]])} fill="#14171C" />
      {/* the board's steel frame behind the glass */}
      <polygon points={poly(P, [[-2.2, 9.8, bz - 0.25], [2.2, 9.8, bz - 0.25], [2.2, 12.6, bz - 0.25], [-2.2, 12.6, bz - 0.25]])} fill="none" stroke="#1C2027" strokeWidth={Math.max(2, c.s * 0.22)} />
      {/* shot clock unit on top of the board */}
      <PossessionAtRimBox pr={pr} a={[-1.32, PAR.boardTop + 0.05, bz - 0.55]} b={[1.32, PAR.boardTop + 2.6, bz - 0.05]} fills={{ top: "#272C33", side: "#090A0C", front: "#07080A" }} />
      <g transform={plane(P, [-1.32, PAR.boardTop + 2.6, bz - 0.04], [1.32, PAR.boardTop + 2.6, bz - 0.04], [-1.32, PAR.boardTop + 0.05, bz - 0.04], 260, 256)}>
        {mirror ? (
          <g transform="translate(0 256) scale(1 -1)">
            <PossessionAtRimClockFace game={st.game} shot={st.shot} gameLit={st.gameLit} shotLit={st.shotLit} flash={st.shotFlash} id={`${id}-cf`} />
          </g>
        ) : (
          <PossessionAtRimClockFace game={st.game} shot={st.shot} gameLit={st.gameLit} shotLit={st.shotLit} flash={st.shotFlash} id={`${id}-cf`} />
        )}
      </g>
      {/* the glass, its edge, its painted border and shooting rectangle */}
      <polygon points={poly(P, [[-bw, PAR.boardBot, bz], [bw, PAR.boardBot, bz], [bw, PAR.boardTop, bz], [-bw, PAR.boardTop, bz]])} fill={`url(#${id}-glass)`} />
      <polygon points={poly(P, [[bw, PAR.boardBot, bz], [bw, PAR.boardBot, bz - 0.12], [bw, PAR.boardTop, bz - 0.12], [bw, PAR.boardTop, bz]])} fill="#7FA2B5" opacity={0.35} />
      <polygon points={poly(P, [[-bw + 0.04, PAR.boardBot + 0.04, bz], [bw - 0.04, PAR.boardBot + 0.04, bz], [bw - 0.04, PAR.boardTop - 0.04, bz], [-bw + 0.04, PAR.boardTop - 0.04, bz]])} fill="none" stroke="#4A1514" strokeWidth={Math.max(1.5, line * 0.4)} />
      <polygon points={poly(P, [[-bw + 0.085, PAR.boardBot + 0.085, bz], [bw - 0.085, PAR.boardBot + 0.085, bz], [bw - 0.085, PAR.boardTop - 0.085, bz], [-bw + 0.085, PAR.boardTop - 0.085, bz]])} fill="none" stroke={PAR.white} strokeWidth={line} />
      <polygon points={poly(P, [[-1, 10 + 0.083, bz], [1, 10 + 0.083, bz], [1, 11.5 - 0.083, bz], [-1, 11.5 - 0.083, bz]])} fill="none" stroke={PAR.white} strokeWidth={line} />
      {/* the black pad along the bottom edge */}
      <PossessionAtRimBox pr={pr} a={[-bw - 0.06, PAR.boardBot - 0.2, bz - 0.2]} b={[bw + 0.06, PAR.boardBot + 0.02, bz + 0.1]} fills={{ top: "#1B1F25", side: "#0A0B0E", front: "#111317" }} />
      {/* the flange that holds the ring */}
      <polygon points={poly(P, [[-0.32, 9.86, bz], [0.32, 9.86, bz], [0.22, 9.92, bz + 0.62], [-0.22, 9.92, bz + 0.62]])} fill="#A9431E" />
      <polygon points={poly(P, [[-0.32, 9.86, bz], [-0.22, 9.92, bz + 0.62], [-0.22, 9.72, bz + 0.45], [-0.32, 9.6, bz]])} fill="#7A2F16" />
    </g>
  );
};

/** the nodes of the net: 12 loops on the ring, 5 rows of diamond knots below it */
function possessionAtRimNet(st: PossessionAtRimHoopState) {
  const rows = 5;
  const L = 1.4 * st.net.stretch;
  const nodes: P3[][] = [];
  for (let k = 0; k <= rows; k++) {
    const t = k / rows;
    const r = PAR.rimR - (PAR.rimR - 0.42) * t + st.net.bulge * Math.sin(Math.PI * t);
    const y = PAR.rimY + st.rattle - L * Math.pow(t, 0.92);
    const sw = Math.pow(t, 1.5);
    const row: P3[] = [];
    for (let i = 0; i < 12; i++) {
      const a = ((i + (k % 2) * 0.5) / 12) * Math.PI * 2;
      row.push([r * Math.cos(a) + st.net.sx * sw, y, PAR.rimZ + r * Math.sin(a) + st.net.sz * sw]);
    }
    nodes.push(row);
  }
  const links: { a: P3; b: P3 }[] = [];
  for (let k = 0; k < rows; k++)
    for (let i = 0; i < 12; i++) {
      const a = nodes[k][i];
      const j1 = k % 2 ? i : (i + 11) % 12;
      const j2 = k % 2 ? (i + 1) % 12 : i;
      links.push({ a, b: nodes[k + 1][j1] }, { a, b: nodes[k + 1][j2] });
    }
  return links;
}

/** the ring and the net, split into the half behind the ball and the half in front of it */
export const PossessionAtRimRing: React.FC<{ pr: PossessionAtRimProj; st: PossessionAtRimHoopState; part: "back" | "front" }> = ({ pr, st, part }) => {
  const { P } = pr;
  const c = P([0, PAR.rimY, PAR.rimZ]);
  const front = (z: number) => z >= PAR.rimZ;
  const want = part === "front";
  const links = possessionAtRimNet(st).filter((l) => front((l.a[2] + l.b[2]) / 2) === want);
  const net = links
    .map((l) => {
      const a = P(l.a);
      const b = P(l.b);
      return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    })
    .join("");
  const ring: string[] = [];
  // the half nearer the camera (z above the ring centre) is angles 0..pi
  for (let i = 0; i <= 24; i++) {
    const a = (want ? 0 : Math.PI) + (i / 24) * Math.PI;
    const p: P3 = [PAR.rimR * Math.cos(a), PAR.rimY + st.rattle, PAR.rimZ + PAR.rimR * Math.sin(a)];
    const q = P(p);
    ring.push(`${ring.length ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`);
  }
  const rw = Math.max(3, c.s * 0.1);
  return (
    <g>
      <path d={net} stroke="#EEF1F4" strokeWidth={Math.max(1.4, c.s * 0.03)} strokeLinecap="round" opacity={want ? 0.95 : 0.7} fill="none" />
      <path d={ring.join("")} stroke={part === "back" ? "#B8461F" : PAR.rim} strokeWidth={rw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {want && <path d={ring.join("")} stroke="#FF9A6B" strokeWidth={rw * 0.28} fill="none" opacity={0.6} transform={`translate(0 ${(-rw * 0.25).toFixed(1)})`} />}
    </g>
  );
};

/** a basketball: pebbled orange, its eight seam lines turning with the spin, lit from the arena lights above */
export const PossessionAtRimBall: React.FC<{ pr: PossessionAtRimProj; p: P3; spin: number; id: string; opacity?: number }> = ({ pr, p, spin, id, opacity = 1 }) => {
  const q = pr.P(p);
  const r = q.s * PAR.ballR;
  const sw = Math.max(1.2, r * 0.07);
  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id={`${id}-ball`} cx="0.38" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#F59A55" />
          <stop offset="0.55" stopColor="#D8652A" />
          <stop offset="1" stopColor="#7C3112" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx={0} cy={0} r={r} />
        </clipPath>
      </defs>
      <g transform={`translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`}>
        <circle r={r} fill={`url(#${id}-ball)`} />
        <g clipPath={`url(#${id}-clip)`} transform={`rotate(${spin.toFixed(1)})`} stroke="#1A0E08" strokeWidth={sw} fill="none" opacity={0.9}>
          <line x1={0} y1={-r} x2={0} y2={r} />
          <path d={`M${-r} ${r * 0.08} Q0 ${r * 0.32} ${r} ${r * 0.08}`} />
          <path d={`M${-r * 0.62} ${-r * 0.86} Q${-r * 0.22} 0 ${-r * 0.62} ${r * 0.86}`} />
          <path d={`M${r * 0.62} ${-r * 0.86} Q${r * 0.22} 0 ${r * 0.62} ${r * 0.86}`} />
        </g>
        <circle r={r} fill="none" stroke="#5A230C" strokeWidth={Math.max(1, r * 0.05)} />
        <ellipse cx={-r * 0.3} cy={-r * 0.42} rx={r * 0.32} ry={r * 0.18} fill="#FFE2C4" opacity={0.28} />
      </g>
    </g>
  );
};
