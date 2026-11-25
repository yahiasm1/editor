// wilt-100 "photo": the sheet of paper and its 100. The reel's WILT flip counter floats down into the locker room,
// a white sheet slides under it, and its printed 100 turns into the real marker 100: the strokes are the ones in the
// AP photo (cut from it, de-rotated, `photodeveloping-ink-100.png`), revealed along traced centre lines, in the order
// a hand writes them, the marker tip riding each stroke. Then the sheet settles at the photo's tilt.
import React from "react";
import { PD_CARD, PD_DIM, PD_HAIR, PD_PAPER, pdClamp, pdK, pdLerp, pdRnd, type PhotoT } from "./PhotoDevelopingKit";
import { ease } from "../../../src/engine";

// the ink image is 700 x 500; these are the centre lines of the three strokes in its pixels, in writing order
type Pt = [number, number];
const ONE: Pt[] = [[136, 124], [132, 190], [125, 262], [118, 332], [112, 398]];
const ZERO_A: Pt[] = [[298, 140], [256, 158], [222, 204], [207, 260], [207, 320], [226, 365], [266, 388], [316, 383], [356, 360], [378, 314], [378, 250], [362, 190], [330, 150], [298, 140], [262, 150]];
const ZERO_B: Pt[] = [[506, 148], [466, 165], [433, 206], [416, 262], [419, 322], [441, 366], [481, 389], [526, 380], [558, 344], [570, 290], [562, 224], [540, 170], [506, 148], [478, 154]];
export const PD_STROKES = [ONE, ZERO_A, ZERO_B];

/** Catmull-Rom through the points, as an SVG path */
function pdSpline(p: Pt[]) {
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[Math.max(0, i - 1)], b = p[i], c = p[i + 1], e = p[Math.min(p.length - 1, i + 2)];
    d += ` C ${b[0] + (c[0] - a[0]) / 6} ${b[1] + (c[1] - a[1]) / 6} ${c[0] - (e[0] - b[0]) / 6} ${c[1] - (e[1] - b[1]) / 6} ${c[0]} ${c[1]}`;
  }
  return d;
}
/** a point at fraction k of the polyline's length */
function pdAlong(p: Pt[], k: number): Pt {
  const seg = p.slice(1).map((q, i) => Math.hypot(q[0] - p[i][0], q[1] - p[i][1]));
  let L = seg.reduce((a, b) => a + b, 0) * pdClamp(k);
  for (let i = 0; i < seg.length; i++) {
    if (L <= seg[i]) return [pdLerp(p[i][0], p[i + 1][0], L / seg[i]), pdLerp(p[i][1], p[i + 1][1], L / seg[i])];
    L -= seg[i];
  }
  return p[p.length - 1];
}

// the sheet in its own units (typing paper, landscape, as Wilt holds it); the ink image sits on it
export const PD_SHEET = { w: 720, h: 540 };
const INK = { x: -330, y: -258, s: 0.94 }; // ink image placement on the sheet (its 100 a little above the middle)

export type SheetView = { cx: number; cy: number; s: number; rot: number };

/** progress of each stroke at frame f */
export const pdStrokeK = (f: number, T: PhotoT) => [T.s1, T.s2, T.s3].map(([a, d]) => pdK(f, a, d, ease.inOut));

/** the marker tip, in screen px, while writing (null when no stroke is under way) */
export function pdTip(f: number, T: PhotoT, V: SheetView): Pt | null {
  const ks = pdStrokeK(f, T);
  let i = ks.findIndex((k) => k < 1);
  if (i < 0) i = 2;
  const k = ks[i];
  const p = pdAlong(PD_STROKES[i], k);
  return pdSheetToScreen(V, INK.x + p[0] * INK.s, INK.y + p[1] * INK.s);
}
export function pdSheetToScreen(V: SheetView, x: number, y: number): Pt {
  const r = (V.rot * Math.PI) / 180;
  return [V.cx + V.s * (x * Math.cos(r) - y * Math.sin(r)), V.cy + V.s * (x * Math.sin(r) + y * Math.cos(r))];
}

export const PhotoDevelopingSheet: React.FC<{ f: number; T: PhotoT; V: SheetView; ink: string; font: string; inK: number }> = ({ f, T, V, ink, font, inK }) => {
  const { w, h } = PD_SHEET;
  const ks = pdStrokeK(f, T);
  // the top edge is not straight: the sheet is soft paper, curling a little once it is held
  const curl = pdK(f, T.paper - 2, 16) * 10;
  const top = `M ${-w / 2} ${-h / 2 + curl * 0.4} C ${-w / 6} ${-h / 2 - curl} ${w / 6} ${-h / 2 + curl * 0.8} ${w / 2} ${-h / 2 - curl * 0.3}`;
  const outline = `${top} L ${w / 2} ${h / 2} C ${w / 6} ${h / 2 + curl * 0.3} ${-w / 6} ${h / 2 - curl * 0.2} ${-w / 2} ${h / 2} Z`;
  const label = pdK(f, T.paper, 9);
  return (
    <g transform={`translate(${V.cx} ${V.cy}) rotate(${V.rot}) scale(${V.s})`} opacity={inK}>
      <defs>
        <mask id="pdInkMask" maskUnits="userSpaceOnUse" x={-1000} y={-1000} width={3000} height={3000}>
          {PD_STROKES.map((p, i) =>
            ks[i] > 0 ? <path key={i} transform={`translate(${INK.x} ${INK.y}) scale(${INK.s})`} d={pdSpline(p)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ks[i]} stroke="#fff" strokeWidth={58} strokeLinecap="round" strokeLinejoin="round" fill="none" /> : null,
          )}
        </mask>
        <linearGradient id="pdSheetLight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.6" stopColor={PD_PAPER} />
          <stop offset="1" stopColor="#DCD8CF" />
        </linearGradient>
      </defs>
      <path d={outline} fill="rgba(0,0,0,0.5)" transform="translate(16 26)" filter="url(#pdSoft)" />
      <path d={outline} fill="url(#pdSheetLight)" />
      {/* the fold it had: a vertical crease below the second 0, as in the photo */}
      <path d={`M 60 ${h * 0.08} L 64 ${h / 2}`} stroke="rgba(0,0,0,0.08)" strokeWidth={3} />
      <path d={`M 63 ${h * 0.08} L 67 ${h / 2}`} stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
      {/* paper tooth */}
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={(pdRnd(i * 2.3) - 0.5) * w * 0.92} cy={(pdRnd(i * 5.7) - 0.5) * h * 0.9} r={0.9 + pdRnd(i) * 1.2} fill="rgba(0,0,0,0.07)" />
      ))}
      {/* the real marker strokes, written on in order */}
      <g mask="url(#pdInkMask)">
        <g transform={`translate(${INK.x} ${INK.y}) scale(${INK.s})`}>
          <image href={ink} x={0} y={0} width={700} height={500} />
        </g>
      </g>
      {/* the wet shine of fresh marker on the stroke being written */}
      <path d={outline} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={1.5} />
      {/* Harvey Pollack's label, under the sheet, a word and a hairline */}
      <g opacity={label} transform={`rotate(${-V.rot}) translate(0 ${h / 2 + 40})`}>
        <rect x={-230 / V.s} y={-14 / V.s} width={460 / V.s} height={58 / V.s} rx={10 / V.s} fill={PD_CARD} stroke={PD_HAIR} strokeWidth={2 / V.s} />
        <text x={0} y={28 / V.s} textAnchor="middle" fontFamily={font} fontSize={34 / V.s} fill="#C9D1D9">
          Harvey Pollack, team PR
        </text>
      </g>
    </g>
  );
};

/** the WILT flip counter at 100, the reel's thread, drawn as in every scene: white numerals on black split flaps */
export const PhotoDevelopingCounter: React.FC<{ x: number; y: number; s: number; o: number; blur: number; font: string }> = ({ x, y, s, o, blur, font }) => {
  if (o <= 0.001) return null;
  const fw = 66, fh = 96, gap = 8;
  const W = 3 * fw + 2 * gap;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-W / 2} ${-fh / 2})`} opacity={o} style={blur > 0.2 ? { filter: `blur(${blur.toFixed(2)}px)` } : undefined}>
      <text x={W / 2} y={-18} textAnchor="middle" fontFamily={font} fontWeight={600} fontSize={30} letterSpacing={6} fill={PD_DIM}>
        WILT
      </text>
      {["1", "0", "0"].map((d, i) => (
        <g key={i} transform={`translate(${i * (fw + gap)} 0)`}>
          <rect x={0} y={6} width={fw} height={fh} rx={7} fill="rgba(0,0,0,0.55)" />
          <rect x={0} y={0} width={fw} height={fh} rx={7} fill="url(#pdFlap)" />
          <text x={fw / 2} y={fh / 2 + 27} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={78} fill="#F4F4F2">
            {d}
          </text>
          <rect x={0} y={fh / 2 - 1} width={fw} height={2} fill="#000" />
          <rect x={2} y={fh / 2 - 4} width={4} height={8} rx={2} fill="#3A3C40" />
          <rect x={fw - 6} y={fh / 2 - 4} width={4} height={8} rx={2} fill="#3A3C40" />
        </g>
      ))}
    </g>
  );
};

export const PhotoDevelopingSheetDefs: React.FC = () => (
  <defs>
    <linearGradient id="pdFlap" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#1E2024" />
      <stop offset="0.49" stopColor="#111215" />
      <stop offset="0.51" stopColor="#050506" />
      <stop offset="1" stopColor="#15161A" />
    </linearGradient>
    <linearGradient id="pdSkin" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stopColor="#EBC2A2" />
      <stop offset="0.55" stopColor="#D3A07F" />
      <stop offset="1" stopColor="#A87458" />
    </linearGradient>
    <filter id="pdBlur3" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" />
    </filter>
    <linearGradient id="pdBarrel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#4A4A4E" />
      <stop offset="0.3" stopColor="#1A1A1C" />
      <stop offset="1" stopColor="#060607" />
    </linearGradient>
    <linearGradient id="pdSleeve" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3D4048" />
      <stop offset="1" stopColor="#1C1E23" />
    </linearGradient>
  </defs>
);

/** the PR man's right hand writing, seen from above: the index finger over the barrel with its tip near the felt, the
 *  thumb pinching from the far side, the middle finger under the pen, ring and little finger curled under, the back of
 *  the hand with its knuckles, a white shirt cuff and a dark suit sleeve running off the right edge. Each finger is a
 *  thick rounded stroke along its bones. Origin: the marker tip. */
export const PhotoDevelopingHand: React.FC<{ x: number; y: number; o: number; press: number; s?: number }> = ({ x, y, o, press, s = 1 }) => {
  if (o <= 0.001) return null;
  const lift = 3 - press; // between strokes the hand rises a hair
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (1 + lift * 0.01)})`} opacity={o}>
      <g transform={`translate(${20 + lift * 3} ${30 + lift * 3})`} opacity={0.35} filter="url(#pdSoft)">
        <path d="M 20 0 C 40 -90 200 -120 260 -80 L 700 0 L 700 220 L 262 40 C 200 100 80 80 20 0 Z" fill="#000" />
      </g>
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 196 40 C 180 70 150 78 134 64" stroke="#B9846A" strokeWidth={30} />
        <path d="M 176 14 C 156 50 120 60 100 44" stroke="#C48F72" strokeWidth={32} />
        <path d="M 150 -18 C 120 0 80 14 50 10" stroke="#C99474" strokeWidth={32} />
      </g>
      <g transform="rotate(-38)">
        <path d="M 0 -8 L 18 -12 L 18 12 L 0 8 Z" fill="#222" />
        <rect x={16} y={-14} width={16} height={28} rx={2} fill="#9A9CA0" />
        <rect x={16} y={-14} width={16} height={6} fill="#D8DADE" />
        <rect x={30} y={-16} width={210} height={32} rx={6} fill="url(#pdBarrel)" />
        <rect x={40} y={-11} width={190} height={4} rx={2} fill="rgba(255,255,255,0.25)" />
        <rect x={226} y={-17} width={28} height={34} rx={8} fill="#111" />
      </g>
      <path d="M 250 -82 L 760 10 L 760 230 L 262 46 Z" fill="url(#pdSleeve)" />
      <path d="M 250 -82 L 760 10" stroke="rgba(255,255,255,0.1)" strokeWidth={3} />
      <path d="M 230 -92 L 280 -80 L 284 50 L 240 58 Z" fill="#ECEAE4" />
      <circle cx={262} cy={-16} r={5} fill="#C9C6BE" />
      <path d="M 128 -74 C 150 -96 200 -100 240 -88 C 256 -50 258 0 250 50 C 230 62 210 60 196 44 C 186 30 176 14 160 -8 C 146 -30 134 -50 128 -74 Z" fill="url(#pdSkin)" />
      <path d="M 170 -96 C 130 -100 90 -80 58 -52 C 46 -42 40 -32 44 -24" stroke="#D9A887" strokeWidth={34} strokeLinecap="round" fill="none" />
      <path d="M 160 -108 C 120 -110 84 -92 56 -66" stroke="#F0CDB2" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.6} filter="url(#pdBlur3)" />
      <ellipse cx={48} cy={-36} rx={11} ry={8} transform="rotate(-40 48 -36)" fill="#F5DECB" stroke="#B07C60" strokeWidth={1.3} />
      <path d="M 140 -46 C 112 -56 92 -60 76 -50 C 60 -40 40 -22 26 -12" stroke="#DCAB8A" strokeWidth={30} strokeLinecap="round" fill="none" />
      <path d="M 138 -60 C 110 -70 90 -72 74 -62" stroke="#F2D0B5" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.55} filter="url(#pdBlur3)" />
      <path d="M 80 -64 C 84 -54 84 -42 78 -36 M 50 -40 C 54 -32 52 -24 46 -20" stroke="#A8775C" strokeWidth={2} fill="none" opacity={0.7} />
      <ellipse cx={24} cy={-12} rx={11} ry={8} transform="rotate(-38 24 -12)" fill="#F5DECB" stroke="#B07C60" strokeWidth={1.3} />
      <g opacity={0.5}>
        <ellipse cx={146} cy={-50} rx={13} ry={9} fill="#F4D3BA" transform="rotate(50 146 -50)" />
        <ellipse cx={162} cy={-18} rx={12} ry={8} fill="#F1CEB4" transform="rotate(50 162 -18)" />
        <ellipse cx={178} cy={12} rx={11} ry={7} fill="#EDC8AD" transform="rotate(50 178 12)" />
      </g>
      <path d="M 156 -50 L 236 -66 M 170 -20 L 240 -30 M 184 10 L 244 6" stroke="#B58166" strokeWidth={4} strokeLinecap="round" opacity={0.3} filter="url(#pdBlur3)" />
    </g>
  );
};
