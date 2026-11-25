// A real NBA referee's arm making the foul call: the closed fist straight up. Drawn from the referee behind Rick Barry
// (photos/crop-referee-1976-russreed-pd.png): a light grey short sleeve, loose, with soft folds, ending in a black
// ribbed ringer band a hand's width above the elbow. One view only: the fist seen from the PALM side (a right hand,
// the referee to our right). From the top down: the four curled middle finger segments in a row, smaller toward the
// little finger, a crease at each joint, the fingertips tucked under them; the thumb lying across the index and middle
// fingers with its nail toward us; the heel of the palm (thumb pad left, little finger pad right); the wrist creases;
// a forearm that tapers to the wrist from a muscle belly near the elbow; the inner elbow; a little upper arm; the cuff
// standing off the arm with the dark inside of the sleeve showing. Light from above (arena lights): lit tops, shaded
// undersides, a cylinder's shade round each side. Local box 420 x 900; the parent places and moves it.
import React from "react";

const S = { hi: "#F6D3B6", lit: "#E8B48E", mid: "#CF946C", dark: "#A0643F", deep: "#7A4428", crease: "#6E3F27" };

/** one curled finger seen from the palm side: middle segment (bright top, the PIP bend) over the tucked tip pad */
function BackwardsScorebugFinger({ x, top, w, h, tip }: { x: number; top: number; w: number; h: number; tip: number }) {
  const r = w * 0.46;
  return (
    <g>
      {/* the tucked fingertip pad, below the middle segment, pressed into the palm */}
      <path d={`M${x + 3} ${top + h - 6} L ${x + w - 3} ${top + h - 6} L ${x + w - 5} ${top + h + tip - 14} Q ${x + w / 2} ${top + h + tip + 4} ${x + 5} ${top + h + tip - 14} Z`} fill="url(#bsb-pad)" />
      <path d={`M${x + 8} ${top + h + tip - 10} Q ${x + w / 2} ${top + h + tip + 2} ${x + w - 8} ${top + h + tip - 10}`} stroke={S.deep} strokeOpacity={0.55} strokeWidth={2.2} fill="none" />
      {/* the middle segment */}
      <path d={`M${x} ${top + r} Q ${x} ${top} ${x + w / 2} ${top} Q ${x + w} ${top} ${x + w} ${top + r} L ${x + w - 1} ${top + h} Q ${x + w / 2} ${top + h + 7} ${x + 1} ${top + h} Z`} fill="url(#bsb-seg)" stroke={S.crease} strokeOpacity={0.35} strokeWidth={1.4} />
      {/* the bend at the top catches the light */}
      <ellipse cx={x + w * 0.46} cy={top + r * 0.55} rx={w * 0.34} ry={r * 0.36} fill="#FFE6D2" opacity={0.28} filter="url(#bsb-soft2)" />
      {/* the creases at the middle of the segment (the PIP fold) and at its foot (the DIP joint) */}
      <path d={`M${x + 9} ${top + r + 6} q ${w / 2 - 9} 6 ${w - 18} 0`} stroke={S.crease} strokeOpacity={0.4} strokeWidth={1.6} fill="none" />
      <path d={`M${x + 12} ${top + r + 12} q ${w / 2 - 12} 4 ${w - 24} 0`} stroke={S.crease} strokeOpacity={0.22} strokeWidth={1.2} fill="none" />
      <path d={`M${x + 5} ${top + h - 2} Q ${x + w / 2} ${top + h + 6} ${x + w - 5} ${top + h - 2}`} stroke={S.crease} strokeOpacity={0.6} strokeWidth={2} fill="none" />
    </g>
  );
}

export const BackwardsScorebugArm: React.FC<{ f: number; pulse?: number }> = ({ f, pulse = 1 }) => {
  // fine, sparse forearm hair, a little more toward the outer edges
  const hair = Array.from({ length: 34 }, (_, i) => {
    const y = 300 + ((i * 89) % 300);
    const side = i % 2 ? 1 : -1;
    const spread = 40 + ((i * 37) % 52);
    const x = 210 + side * spread - 6;
    return <path key={i} d={`M${x} ${y} q ${side * 1.5} 4 ${side * 3.5} 8`} stroke="rgba(70,38,20,0.2)" strokeWidth={0.8} fill="none" />;
  });
  // knit ribs of the ringer cuff, following its curve
  const ribs = Array.from({ length: 46 }, (_, i) => {
    const t = i / 45;
    const x = 64 + t * 296;
    const yb = 700 + 16 * Math.sin(t * Math.PI);
    return <line key={i} x1={x} y1={yb - 4} x2={x + 0.6} y2={yb + 34} stroke="rgba(255,255,255,0.07)" strokeWidth={2} />;
  });
  const fold = Math.sin(f / 31) * 2.5; // the loose sleeve breathes a little with the sway
  return (
    <svg width={420} height={900} viewBox="0 0 420 900" style={{ overflow: "visible" }}>
      <defs>
        {/* the arm as a cylinder: lit just left of centre, shade round both sides */}
        <linearGradient id="bsb-skin" gradientUnits="userSpaceOnUse" x1="100" y1="0" x2="320" y2="0">
          <stop offset="0" stopColor={S.deep} />
          <stop offset="0.16" stopColor={S.dark} />
          <stop offset="0.42" stopColor={S.lit} />
          <stop offset="0.56" stopColor={S.hi} />
          <stop offset="0.8" stopColor={S.mid} />
          <stop offset="1" stopColor={S.deep} />
        </linearGradient>
        {/* light from above: the forearm darkens toward the elbow */}
        <linearGradient id="bsb-down" gradientUnits="userSpaceOnUse" x1="0" y1="260" x2="0" y2="700">
          <stop offset="0" stopColor="#000" stopOpacity={0} />
          <stop offset="0.6" stopColor="#1A0C05" stopOpacity={0.16} />
          <stop offset="1" stopColor="#1A0C05" stopOpacity={0.42} />
        </linearGradient>
        <linearGradient id="bsb-seg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={S.hi} />
          <stop offset="0.55" stopColor={S.lit} />
          <stop offset="1" stopColor={S.mid} />
        </linearGradient>
        <linearGradient id="bsb-pad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={S.dark} />
          <stop offset="0.45" stopColor={S.mid} />
          <stop offset="1" stopColor={S.dark} />
        </linearGradient>
        <linearGradient id="bsb-palm" gradientUnits="userSpaceOnUse" x1="80" y1="120" x2="330" y2="260">
          <stop offset="0" stopColor={S.lit} />
          <stop offset="0.5" stopColor={S.mid} />
          <stop offset="1" stopColor={S.dark} />
        </linearGradient>
        <linearGradient id="bsb-thumb" gradientUnits="userSpaceOnUse" x1="0" y1="96" x2="0" y2="160">
          <stop offset="0" stopColor={S.hi} />
          <stop offset="0.5" stopColor={S.lit} />
          <stop offset="1" stopColor={S.dark} />
        </linearGradient>
        <radialGradient id="bsb-thenar" cx="0.42" cy="0.32" r="0.7">
          <stop offset="0" stopColor={S.hi} />
          <stop offset="0.6" stopColor={S.lit} />
          <stop offset="1" stopColor={S.mid} />
        </radialGradient>
        <linearGradient id="bsb-sleeve" gradientUnits="userSpaceOnUse" x1="30" y1="0" x2="400" y2="0">
          <stop offset="0" stopColor="#5E646C" />
          <stop offset="0.3" stopColor="#A9AFB6" />
          <stop offset="0.52" stopColor="#D2D6DB" />
          <stop offset="0.78" stopColor="#9EA4AB" />
          <stop offset="1" stopColor="#5A6068" />
        </linearGradient>
        <linearGradient id="bsb-sleeve-shade" gradientUnits="userSpaceOnUse" x1="0" y1="716" x2="0" y2="790">
          <stop offset="0" stopColor="#000" stopOpacity={0.5} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="bsb-cuff" gradientUnits="userSpaceOnUse" x1="60" y1="0" x2="364" y2="0">
          <stop offset="0" stopColor="#030405" />
          <stop offset="0.45" stopColor="#2A2E34" />
          <stop offset="0.6" stopColor="#1C2025" />
          <stop offset="1" stopColor="#030405" />
        </linearGradient>
        <filter id="bsb-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={6} />
        </filter>
        <filter id="bsb-soft2" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={3} />
        </filter>
        <filter id="bsb-armshadow" x="-30%" y="-10%" width="160%" height="130%">
          <feDropShadow dx={-12} dy={20} stdDeviation={18} floodColor="#000" floodOpacity={0.5} />
        </filter>
        <path id="bsb-armpath" d="M140 250 C 136 300, 126 360, 118 420 C 110 480, 102 540, 104 586 C 104 604, 110 618, 112 632 C 108 660, 104 690, 104 720 L 318 720 C 318 690, 316 660, 314 636 C 318 620, 312 600, 306 588 C 304 540, 302 470, 296 400 C 292 340, 286 296, 282 250 Z" />
        <clipPath id="bsb-armclip">
          <use href="#bsb-armpath" />
        </clipPath>
      </defs>

      <g filter="url(#bsb-armshadow)">
        {/* the dark inside of the sleeve opening, behind the arm */}
        <ellipse cx={212} cy={702} rx={148} ry={20} fill="#0B0C0E" />

        {/* forearm, inner elbow and a little upper arm */}
        <g clipPath="url(#bsb-armclip)">
          <rect x={90} y={240} width={240} height={490} fill="url(#bsb-skin)" />
          {/* the brachioradialis swell on the thumb side, lit from above */}
          <ellipse cx={150} cy={500} rx={34} ry={110} fill="#FFE2CC" opacity={0.16} filter="url(#bsb-soft)" />
          {/* the inner wrist tendon and two faint veins */}
          <path d="M214 262 C 214 300, 212 340, 208 380" stroke="rgba(255,232,214,0.35)" strokeWidth={6} fill="none" strokeLinecap="round" filter="url(#bsb-soft2)" />
          <path d="M248 268 C 252 330, 250 400, 240 470 C 236 500, 238 540, 246 580" stroke="rgba(96,110,150,0.2)" strokeWidth={3.4} fill="none" />
          <path d="M176 272 C 172 320, 160 380, 158 440" stroke="rgba(96,110,150,0.15)" strokeWidth={2.6} fill="none" />
          {hair}
          {/* the inner elbow: its crease and the soft hollow */}
          <ellipse cx={212} cy={612} rx={58} ry={14} fill="#3A1C0C" opacity={0.18} filter="url(#bsb-soft)" />
          <path d="M160 606 C 186 616, 236 618, 266 604" stroke={S.crease} strokeOpacity={0.4} strokeWidth={2.2} fill="none" />
          <path d="M176 620 C 198 626, 226 626, 248 618" stroke={S.crease} strokeOpacity={0.18} strokeWidth={1.4} fill="none" />
          <rect x={90} y={240} width={240} height={490} fill="url(#bsb-down)" />
          {/* the shadow the cuff throws up the upper arm */}
          <rect x={90} y={690} width={240} height={34} fill="#120804" opacity={0.16} filter="url(#bsb-soft)" />
        </g>
        {/* the outline's dark edge on the shadow side */}
        <use href="#bsb-armpath" fill="none" stroke="rgba(60,28,12,0.35)" strokeWidth={2} />

        {/* the fist, which pulses on "free" */}
        <g transform={`translate(210 240) scale(${pulse.toFixed(4)}) translate(-210 -240)`}>
          {/* the heel of the palm and the wrist */}
          <path d="M96 128 C 90 170, 98 214, 124 240 C 132 252, 138 262, 142 272 L 280 272 C 286 258, 300 244, 312 224 C 326 196, 328 150, 324 112 Z" fill="url(#bsb-palm)" />
          {/* the thumb pad (thenar), bulging low on the left */}
          <path d="M94 136 C 78 176, 92 230, 134 250 C 166 262, 196 246, 200 214 C 204 182, 176 150, 140 134 Z" fill="url(#bsb-thenar)" />
          {/* the little finger pad (hypothenar) on the right */}
          <path d="M262 150 C 300 150, 324 170, 320 206 C 316 238, 296 256, 274 258 C 252 240, 246 196, 252 160 Z" fill={S.mid} opacity={0.9} />
          <path d="M262 156 C 292 158, 312 176, 310 200" stroke="#FFE4D0" strokeOpacity={0.25} strokeWidth={8} fill="none" filter="url(#bsb-soft2)" />
          {/* the palm creases where the pads meet, and two wrist creases */}
          <path d="M196 238 C 214 214, 236 190, 252 160" stroke={S.crease} strokeOpacity={0.45} strokeWidth={2} fill="none" />
          <path d="M150 262 C 180 268, 230 268, 272 260" stroke={S.crease} strokeOpacity={0.4} strokeWidth={1.8} fill="none" />
          <path d="M146 274 C 182 280, 232 280, 276 272" stroke={S.crease} strokeOpacity={0.28} strokeWidth={1.4} fill="none" />
          {/* the ulnar bone at the wrist on the little finger side */}
          <ellipse cx={270} cy={262} rx={9} ry={12} fill="#FFE0CA" opacity={0.16} />

          {/* the four curled fingers: middle segments in a row, smaller toward the little finger */}
          <BackwardsScorebugFinger x={274} top={60} w={50} h={52} tip={36} />
          <BackwardsScorebugFinger x={220} top={44} w={58} h={60} tip={40} />
          <BackwardsScorebugFinger x={160} top={36} w={64} h={64} tip={42} />
          <BackwardsScorebugFinger x={98} top={44} w={66} h={62} tip={42} />
          {/* the seams where the crowded fingers press together */}
          {[[162, 46], [222, 52], [276, 68]].map(([x, y]) => (
            <path key={x} d={`M${x} ${y} L ${x - 1} ${y + 82}`} stroke={S.deep} strokeOpacity={0.5} strokeWidth={2} />
          ))}

          {/* the thumb, lying across the index and middle fingers: its shadow first */}
          <path d="M96 150 C 120 130, 170 124, 222 132 C 236 136, 238 160, 222 168 C 180 176, 134 182, 110 196 Z" fill="#3A1A0A" opacity={0.35} filter="url(#bsb-soft2)" />
          <path d="M92 142 C 96 120, 130 106, 176 102 C 200 100, 220 104, 230 116 C 238 128, 234 146, 220 152 C 190 160, 150 160, 124 176 C 110 186, 96 182, 92 168 Z" fill="url(#bsb-thumb)" stroke={S.crease} strokeOpacity={0.4} strokeWidth={1.4} />
          {/* its nail near the tip, and the joint crease */}
          <path d="M192 110 C 206 106, 222 110, 226 122 C 228 134, 220 142, 206 142 C 194 142, 186 132, 186 122 C 186 116, 188 112, 192 110 Z" fill="#F3D7C6" stroke={S.crease} strokeOpacity={0.4} strokeWidth={1.2} />
          <path d="M195 115 C 204 112, 214 114, 219 120" stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={2} fill="none" />
          <path d="M150 110 C 154 124, 154 140, 148 154" stroke={S.crease} strokeOpacity={0.45} strokeWidth={1.8} fill="none" />
          <path d="M104 126 C 130 114, 168 108, 200 106" stroke="#FFF0E4" strokeOpacity={0.4} strokeWidth={5} fill="none" strokeLinecap="round" filter="url(#bsb-soft2)" />
        </g>

        {/* the cuff: its front half, the black ribbed ringer band standing off the arm */}
        <path d={`M64 700 Q 212 732 360 700 L 364 736 Q 212 770 60 736 Z`} fill="url(#bsb-cuff)" />
        {ribs}
        <path d="M64 700 Q 212 732 360 700" stroke="rgba(255,255,255,0.22)" strokeWidth={2.2} fill="none" />

        {/* the loose grey sleeve below, with soft folds and the cuff's shadow */}
        <path d="M60 734 Q 212 770 364 734 L 404 900 L 24 900 Z" fill="url(#bsb-sleeve)" />
        <g filter="url(#bsb-soft)">
          <path d={`M112 760 C ${120 + fold} 800, ${104 + fold} 850, 94 900`} stroke="rgba(40,44,50,0.4)" strokeWidth={16} fill="none" />
          <path d={`M282 760 C ${292 - fold} 810, ${300 - fold} 860, 316 900`} stroke="rgba(40,44,50,0.34)" strokeWidth={18} fill="none" />
          <path d={`M206 770 C ${204 + fold} 820, 210 870, 214 900`} stroke="rgba(255,255,255,0.32)" strokeWidth={14} fill="none" />
          <path d="M150 780 C 160 820, 158 860, 152 900" stroke="rgba(255,255,255,0.16)" strokeWidth={9} fill="none" />
          <path d="M248 776 C 244 820, 254 860, 262 900" stroke="rgba(40,44,50,0.22)" strokeWidth={8} fill="none" />
        </g>
        <path d="M60 734 Q 212 770 364 734 L 368 790 Q 212 820 56 790 Z" fill="url(#bsb-sleeve-shade)" />
      </g>
    </svg>
  );
};
