// The grab: a defender's hand, forearm, elbow, upper arm and a bit of his shoulder and road jersey, reaching in from
// off frame right and clamping Shaq's left forearm. Drawn in the cut-out's own pixels (the 2000 Finals photo, 719 x
// 2327 cut-out, ~330 px per foot) so it sits on his real arm. Local frame (inside the parent's scale 0.8, so ~412 units
// per foot): his forearm runs straight down the local y axis through (0, 0), about 112 units wide; the hand's back
// lies along +x. Real proportions: the hand ~0.6 ft, the forearm wrist to elbow ~1 ft (400 units), the upper arm
// ~1.15 ft (470 units) rising to the shoulder, the torso beyond the frame edge. Light from the arena's upper left:
// lit top edges, darker undersides, the flexor bulge near the elbow, the triceps under the upper arm, a terry
// sweatband at the wrist (2000-era), a fine skin grain. Foul red blooms under the fingertips on "grabs" with a red
// shock ring (the reel's one colour for the foul).
import React from "react";

const SK = { hi: "#C08A63", lit: "#9A6443", mid: "#7A4A2E", dark: "#4E2C19", deep: "#331C0F", crease: "#2E190C", nail: "#D9B5A0" };
export const PICTURE_COURT_GRAB_AT: [number, number] = [492, 930];
export const PICTURE_COURT_GRAB_ANGLE = -39;
const FOUL = "#FF3B3F";
/** forearm and upper arm directions in the hand's frame (deg) and lengths (units, ~412 per foot) */
const PCG_A1 = 28, PCG_L1 = 400, PCG_A2 = -6, PCG_L2 = 560;
const PCG_WRIST: [number, number] = [200, 0];
const rad = Math.PI / 180;
const PCG_ELBOW: [number, number] = [PCG_WRIST[0] + PCG_L1 * Math.cos(PCG_A1 * rad), PCG_WRIST[1] + PCG_L1 * Math.sin(PCG_A1 * rad)];
const PCG_SHOULDER: [number, number] = [PCG_ELBOW[0] + PCG_L2 * Math.cos(PCG_A2 * rad), PCG_ELBOW[1] + PCG_L2 * Math.sin(PCG_A2 * rad)];

/** a limb along +x from 0 to L: top and bottom half-widths at stations, smooth outline */
function pictureCourtGrabLimb(st: [number, number, number][]): string {
  const top = st.map(([x, t]) => [x, -t] as [number, number]);
  const bot = st.map(([x, , b]) => [x, b] as [number, number]).reverse();
  const curve = (pts: [number, number][]) => {
    let d = "";
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const mx = (x0 + x1) / 2;
      d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
    }
    return d;
  };
  return `M ${top[0][0]} ${top[0][1]}${curve(top)} L ${bot[0][0]} ${bot[0][1]}${curve(bot)} Z`;
}

const PCG_FOREARM = pictureCourtGrabLimb([[-6, 52, 50], [80, 56, 52], [180, 64, 58], [290, 84, 66], [360, 82, 70], [412, 70, 68]]);
const PCG_UPPER = pictureCourtGrabLimb([[-10, 66, 70], [90, 76, 86], [220, 92, 104], [380, 104, 112], [580, 116, 118]]);

export const PictureCourtGrab: React.FC<{ f: number; reach: number; clamp: number; bloom: number; hit: number }> = ({ f, reach, clamp, bloom, hit }) => {
  if (reach <= 0.001) return null;
  // the whole defender slides in along his own arm
  const off = (1 - reach) * 900;
  const [ex, ey] = PCG_ELBOW, [shx, shy] = PCG_SHOULDER;
  const tremble = clamp > 0.9 ? Math.sin(f * 1.7) * 1.2 : 0;
  const wrap = clamp;
  const fingers = [0, 1, 2, 3].map((i) => {
    const y = -64 + i * 31 + (i === 3 ? 4 : 0);
    const w = 27 - (i === 3 ? 5 : 0);
    const x0 = 70;
    const x1 = -46 - (i === 1 ? 8 : i === 2 ? 5 : 0) + (1 - wrap) * 70;
    return { y, w, x0, x1, i };
  });
  // the foul: the marks pop past full size on the word, then settle; a shock ring runs out from the grip
  const pop = hit >= 0 ? 1 + 0.35 * Math.exp(-hit / 6) * Math.sin(Math.min(hit, 12) * 0.26) : 1;
  const ring = hit >= 0 && hit < 20 ? hit / 20 : -1;
  return (
    <g transform={`translate(${(off * shx / Math.hypot(shx, shy)).toFixed(1)} ${(off * shy / Math.hypot(shx, shy) + tremble).toFixed(2)})`}>
      <defs>
        <linearGradient id="pcg-limb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D29B72" />
          <stop offset="0.12" stopColor={SK.hi} />
          <stop offset="0.3" stopColor={SK.lit} />
          <stop offset="0.6" stopColor={SK.mid} />
          <stop offset="0.82" stopColor={SK.dark} />
          <stop offset="1" stopColor="#24130A" />
        </linearGradient>
        <linearGradient id="pcg-arm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SK.hi} />
          <stop offset="0.35" stopColor={SK.lit} />
          <stop offset="0.8" stopColor={SK.mid} />
          <stop offset="1" stopColor={SK.dark} />
        </linearGradient>
        <linearGradient id="pcg-finger" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SK.hi} />
          <stop offset="0.5" stopColor={SK.lit} />
          <stop offset="1" stopColor={SK.dark} />
        </linearGradient>
        <linearGradient id="pcg-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#E4E6EA" />
          <stop offset="1" stopColor="#9EA3AB" />
        </linearGradient>
        <linearGradient id="pcg-jersey" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#178253" />
          <stop offset="0.18" stopColor="#0E5C3B" />
          <stop offset="0.5" stopColor="#073523" />
        </linearGradient>
        <pattern id="pcg-mesh" width={16} height={16} patternUnits="userSpaceOnUse">
          <circle cx={4} cy={4} r={2.6} fill="rgba(0,0,0,0.28)" />
          <circle cx={12} cy={12} r={2.6} fill="rgba(0,0,0,0.28)" />
        </pattern>
        <radialGradient id="pcg-delt" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={SK.hi} />
          <stop offset="0.45" stopColor={SK.lit} />
          <stop offset="1" stopColor={SK.dark} />
        </radialGradient>
        <radialGradient id="pcg-mark">
          <stop offset="0" stopColor="#FF6A6D" stopOpacity={1} />
          <stop offset="0.45" stopColor={FOUL} stopOpacity={0.8} />
          <stop offset="1" stopColor={FOUL} stopOpacity={0} />
        </radialGradient>
        {/* a touch of softness so the drawn arm sits in the photo's focus, then its shadow */}
        <filter id="pcg-shadow" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={1.4} result="s" />
          <feDropShadow in="s" dx={-6} dy={14} stdDeviation={10} floodColor="#000" floodOpacity={0.5} />
        </filter>
        <filter id="pcg-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={10} /></filter>
        <filter id="pcg-sheen" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation={3.5} /></filter>
        <filter id="pcg-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={16} /></filter>
        {/* skin grain: fine noise kept inside the shape */}
        <filter id="pcg-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={2} seed={7} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.06  0 0 0 0 0.03  0 0 0 0.7 -0.22" result="t" />
          <feComposite in="t" in2="SourceGraphic" operator="in" result="tt" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="tt" /></feMerge>
        </filter>
      </defs>
      <g filter="url(#pcg-shadow)">
        {/* his shoulder and the side of his road jersey, cut by the frame's right edge: upright, behind the arm */}
        <g transform={`translate(${shx.toFixed(1)} ${shy.toFixed(1)}) rotate(39)`}>
          {/* the trapezius rising toward his neck, off frame */}
          <path d="M -90 -40 C -110 -180, -20 -260, 160 -300 C 500 -380, 1000 -460, 1700 -520 L 1700 300 L 0 200 Z" fill="url(#pcg-delt)" filter="url(#pcg-grain)" />
          <path d="M -110 -150 C -40 -250, 120 -300, 360 -350" stroke="rgba(255,224,196,0.3)" strokeWidth={18} fill="none" strokeLinecap="round" filter="url(#pcg-soft)" />
          {/* the deltoid: a lit cap, a sheen, and its core shadow toward the armpit */}
          <ellipse cx={-10} cy={-150} rx={70} ry={40} fill="rgba(255,244,232,0.35)" filter="url(#pcg-soft)" />
          <path d="M -70 -170 C -40 -210, 10 -225, 60 -228" stroke="rgba(255,248,240,0.6)" strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#pcg-sheen)" />
          <path d="M -60 60 C 0 140, 80 170, 140 150" stroke="rgba(20,8,2,0.55)" strokeWidth={50} fill="none" filter="url(#pcg-soft)" />
          {/* the jersey: the armhole cut deep, the side seam running down to the waist, the shorts below */}
          <path d="M 150 -320 C 230 -160, 230 120, 110 330 C 120 700, 150 1100, 170 1420 L 1700 1420 L 1700 -520 L 420 -380 Z" fill="url(#pcg-jersey)" />
          <path d="M 150 -320 C 230 -160, 230 120, 110 330 C 120 700, 150 1100, 170 1420 L 1700 1420 L 1700 -520 L 420 -380 Z" fill="url(#pcg-mesh)" />
          <path d="M 170 1400 C 180 2000, 210 3000, 240 4200 L 1700 4200 L 1700 1400 Z" fill="#073A25" />
          <path d="M 170 1400 L 1700 1380" stroke="#F2F2F2" strokeWidth={14} />
          <path d="M 150 -320 C 230 -160, 230 120, 110 330" stroke="#F2F2F2" strokeWidth={18} fill="none" />
          <path d="M 168 -316 C 248 -160, 248 122, 128 334" stroke="#FFC200" strokeWidth={8} fill="none" />
          {/* folds pulled toward the reaching arm, and the lit edge along the side */}
          <path d="M 220 420 C 360 360, 520 380, 700 330" stroke="rgba(0,0,0,0.38)" strokeWidth={26} fill="none" filter="url(#pcg-soft)" />
          <path d="M 200 860 C 380 790, 560 820, 760 760" stroke="rgba(0,0,0,0.32)" strokeWidth={30} fill="none" filter="url(#pcg-soft)" />
          <path d="M 150 400 C 160 760, 180 1100, 200 1400" stroke="rgba(150,235,190,0.2)" strokeWidth={30} fill="none" filter="url(#pcg-soft)" />
        </g>
        {/* the upper arm, rising from the elbow to the shoulder; triceps underneath */}
        <g transform={`translate(${ex.toFixed(1)} ${ey.toFixed(1)}) rotate(${PCG_A2})`}>
          <path d={PCG_UPPER} fill="url(#pcg-limb)" filter="url(#pcg-grain)" />
          <path d="M 40 -58 C 160 -70, 300 -84, 470 -96" stroke="rgba(255,228,200,0.3)" strokeWidth={14} fill="none" strokeLinecap="round" filter="url(#pcg-soft)" />
          {/* sweat sheen under the arena lights, like the shine on Shaq's own shoulder */}
          <path d="M 120 -52 C 240 -64, 360 -76, 520 -90" stroke="rgba(255,246,236,0.55)" strokeWidth={7} fill="none" strokeLinecap="round" filter="url(#pcg-sheen)" />
          <ellipse cx={300} cy={-40} rx={120} ry={16} fill="rgba(255,240,226,0.22)" filter="url(#pcg-soft)" />
          <path d="M 70 52 C 180 80, 330 86, 470 80" stroke="rgba(20,8,2,0.45)" strokeWidth={26} fill="none" strokeLinecap="round" filter="url(#pcg-soft)" />
          {/* the biceps and triceps split */}
          <path d="M 120 8 C 220 14, 330 12, 440 4" stroke="rgba(40,18,6,0.28)" strokeWidth={6} fill="none" filter="url(#pcg-soft)" />
        </g>
        {/* the elbow: the joint, the olecranon point underneath, the inner crease on top */}
        <g transform={`translate(${ex.toFixed(1)} ${ey.toFixed(1)})`}>
          <ellipse cx={0} cy={4} rx={80} ry={72} fill={SK.mid} />
          <ellipse cx={14} cy={40} rx={44} ry={30} fill={SK.dark} opacity={0.7} filter="url(#pcg-soft)" />
          <path d="M 18 54 C 34 70, 56 66, 66 50" stroke="rgba(255,226,200,0.25)" strokeWidth={5} fill="none" />
          <path d="M -30 -30 C -10 -20, 10 -24, 26 -40" stroke={SK.crease} strokeOpacity={0.6} strokeWidth={4} fill="none" />
          <path d="M -26 -42 C -6 -50, 8 -50, 22 -56" stroke="rgba(255,226,200,0.3)" strokeWidth={8} fill="none" filter="url(#pcg-soft)" />
        </g>
        {/* the forearm: wrist to elbow, about a foot, the flexor bulge near the elbow */}
        <g transform={`translate(${PCG_WRIST[0]} ${PCG_WRIST[1]}) rotate(${PCG_A1})`}>
          <path d={PCG_FOREARM} fill="url(#pcg-limb)" filter="url(#pcg-grain)" />
          {/* the lit top edge and the brachioradialis bulge */}
          <path d="M 70 -48 C 160 -54, 240 -70, 340 -76" stroke="rgba(255,230,205,0.34)" strokeWidth={12} fill="none" strokeLinecap="round" filter="url(#pcg-soft)" />
          <ellipse cx={315} cy={-46} rx={78} ry={24} fill="rgba(255,226,200,0.18)" filter="url(#pcg-soft)" />
          <path d="M 120 -44 C 200 -50, 260 -62, 330 -70" stroke="rgba(255,246,236,0.5)" strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#pcg-sheen)" />
          {/* the underside in shade, the ulna ridge */}
          <path d="M 90 44 C 200 52, 300 58, 400 54" stroke="rgba(18,8,2,0.5)" strokeWidth={22} fill="none" strokeLinecap="round" filter="url(#pcg-soft)" />
          <path d="M 100 14 C 180 16, 260 18, 360 14" stroke="rgba(40,18,6,0.3)" strokeWidth={5} fill="none" filter="url(#pcg-soft)" />
          {/* a vein over the wrist extensors */}
          <path d="M 96 -22 C 150 -28, 200 -20, 260 -30" stroke="rgba(70,90,120,0.28)" strokeWidth={6} fill="none" />
          {/* the white terry sweatband over the wrist, ribbed */}
          <path d="M 0 -60 C 6 -20, 6 20, 0 60 L 88 64 C 94 22, 94 -24, 88 -64 Z" fill="url(#pcg-band)" />
          {Array.from({ length: 16 }, (_, i) => (
            <line key={i} x1={5 + i * 5.2} y1={-58} x2={5 + i * 5.2} y2={60} stroke="rgba(110,115,125,0.32)" strokeWidth={1.8} />
          ))}
          <path d="M 0 -60 C 6 -20, 6 20, 0 60" stroke="rgba(120,125,135,0.5)" strokeWidth={3} fill="none" />
        </g>
        {/* back of the hand */}
        <path d="M 204 -58 C 150 -76, 100 -80, 70 -70 L 58 52 C 96 66, 150 62, 204 52 Z" fill="url(#pcg-arm)" filter="url(#pcg-grain)" />
        {/* extensor tendons fanning to the knuckles */}
        {fingers.map((g) => (
          <path key={`t${g.i}`} d={`M 196 ${-10 + g.i * 6} C 150 ${-6 + g.i * 6}, 110 ${g.y + g.w / 2}, 80 ${g.y + g.w / 2}`} stroke="rgba(255,226,200,0.22)" strokeWidth={6} fill="none" strokeLinecap="round" />
        ))}
        <path d="M 170 40 C 140 30, 120 28, 96 36" stroke="rgba(90,110,150,0.25)" strokeWidth={4} fill="none" />
        {/* the thumb hooked under his forearm */}
        <path d={`M 150 56 C 120 92, ${80 - 30 * wrap} 104, ${40 - 40 * wrap} ${96 + 6 * wrap} C ${30 - 40 * wrap} 86, 60 70, 96 54 Z`} fill={SK.mid} stroke={SK.crease} strokeOpacity={0.4} strokeWidth={2} />
        {/* the four fingers wrapped over his forearm, knuckle ridges and joint creases */}
        {fingers.map((g) => (
          <g key={g.i}>
            <path
              d={`M ${g.x0} ${g.y} L ${g.x1 + 12} ${g.y + 1} C ${g.x1} ${g.y + 2}, ${g.x1 - 4} ${g.y + g.w - 2}, ${g.x1 + 10} ${g.y + g.w} L ${g.x0} ${g.y + g.w} Z`}
              fill="url(#pcg-finger)" stroke={SK.crease} strokeOpacity={0.45} strokeWidth={1.6}
            />
            <path d={`M ${g.x1 + 4} ${g.y + 5} q -6 ${g.w / 2 - 5} 0 ${g.w - 10}`} stroke={SK.nail} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85 * wrap} />
            {[0.34, 0.68].map((k) => {
              const x = g.x0 + (g.x1 - g.x0) * k;
              return <path key={k} d={`M ${x} ${g.y + 4} q 4 ${g.w / 2 - 4} 0 ${g.w - 8}`} stroke={SK.crease} strokeOpacity={0.5} strokeWidth={1.8} fill="none" />;
            })}
            <ellipse cx={g.x0 + 4} cy={g.y + g.w / 2} rx={11} ry={g.w / 2 - 2} fill={SK.hi} opacity={0.45} />
          </g>
        ))}
      </g>
      {/* the foul: red pressure blooming out from under every fingertip and the heel of the hand, big on the word */}
      {bloom > 0 && (
        <g opacity={Math.min(1, bloom * 1.4)}>
          <ellipse cx={0} cy={0} rx={(120 + 60 * bloom) * pop} ry={(150 + 50 * bloom) * pop} fill={FOUL} opacity={0.35 * bloom} filter="url(#pcg-glow)" />
          {fingers.map((g) => (
            <g key={`m${g.i}`}>
              <ellipse cx={g.x1 - 6} cy={g.y + g.w / 2} rx={(16 + 40 * bloom) * pop} ry={(g.w / 2 + 18 * bloom) * pop} fill="url(#pcg-mark)" />
              <path d={`M ${g.x1 - 2} ${g.y + 3} q -8 ${g.w / 2 - 3} 0 ${g.w - 6}`} stroke={FOUL} strokeWidth={6} fill="none" strokeLinecap="round" />
            </g>
          ))}
          {fingers.slice(0, 3).map((g) => (
            <ellipse key={`b${g.i}`} cx={-6} cy={g.y + g.w + 1} rx={(40 * bloom + 10) * pop} ry={(6 + 6 * bloom) * pop} fill="url(#pcg-mark)" />
          ))}
          <ellipse cx={50} cy={-96} rx={(44 + 46 * bloom) * pop} ry={(16 + 16 * bloom) * pop} fill="url(#pcg-mark)" />
          <ellipse cx={50} cy={82} rx={(44 + 46 * bloom) * pop} ry={(16 + 16 * bloom) * pop} fill="url(#pcg-mark)" />
        </g>
      )}
      {ring >= 0 && (
        <g opacity={1 - ring}>
          <circle cx={20} cy={0} r={90 + 420 * Math.sqrt(ring)} stroke={FOUL} strokeWidth={22 * (1 - ring) + 4} fill="none" />
          <circle cx={20} cy={0} r={60 + 260 * Math.sqrt(ring)} stroke="#FFFFFF" strokeWidth={8 * (1 - ring) + 2} fill="none" opacity={0.6} />
        </g>
      )}
    </g>
  );
};
