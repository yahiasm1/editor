// Popovich's thumbs up, drawn as a real hand, never the emoji. Palm side toward us, the four curled fingers stacked
// as rolls (index on top, little finger smallest at the bottom), a crease at each knuckle and the fingertips tucked
// into the palm as darker pads; the thumb straight up with its knuckle crease and its nail on the outer edge; the
// thenar pad bulging where the thumb meets the palm. Then the wrist, his light blue check shirt cuff, and the navy
// blazer sleeve with the three brass cuff buttons seen on his real cuff (photos/commons-popovich-sideline-...jpg).
// Light from above (arena lights). Local box 340 x 420; the sleeve leaves to the LEFT (x < 0), the hand faces right.
// `flip` mirrors it for the other side.
import React from "react";

const S = { hi: "#F3D4BF", lit: "#E3B394", mid: "#C98E6E", dark: "#9E6649", deep: "#7A4A33", crease: "#6A3E2A" };

export const PopovichClockThumb: React.FC<{ id: string; flip?: boolean }> = ({ id, flip }) => {
  const g = (n: string) => `pvt-${id}-${n}`;
  const rolls = [
    { y: 198, h: 50, x1: 212, x2: 314 },
    { y: 246, h: 48, x1: 210, x2: 310 },
    { y: 292, h: 45, x1: 210, x2: 302 },
    { y: 335, h: 40, x1: 212, x2: 292 },
  ];
  return (
    <svg width={460} height={420} viewBox="-120 0 460 420" style={{ position: "absolute", left: -120, top: 0, overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, transformOrigin: "290px 210px" }}>
      <defs>
        <linearGradient id={g("roll")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={S.hi} />
          <stop offset="0.3" stopColor={S.lit} />
          <stop offset="0.75" stopColor={S.mid} />
          <stop offset="1" stopColor={S.deep} />
        </linearGradient>
        <linearGradient id={g("palm")} gradientUnits="userSpaceOnUse" x1="150" y1="180" x2="250" y2="400">
          <stop offset="0" stopColor={S.lit} />
          <stop offset="0.6" stopColor={S.mid} />
          <stop offset="1" stopColor={S.dark} />
        </linearGradient>
        <linearGradient id={g("thumb")} gradientUnits="userSpaceOnUse" x1="182" y1="0" x2="250" y2="0">
          <stop offset="0" stopColor={S.mid} />
          <stop offset="0.35" stopColor={S.hi} />
          <stop offset="0.75" stopColor={S.lit} />
          <stop offset="1" stopColor={S.dark} />
        </linearGradient>
        <radialGradient id={g("thenar")} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor={S.hi} />
          <stop offset="0.7" stopColor={S.lit} />
          <stop offset="1" stopColor={S.mid} />
        </radialGradient>
        <linearGradient id={g("sleeve")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A3550" />
          <stop offset="0.25" stopColor="#1A2238" />
          <stop offset="0.75" stopColor="#0F1526" />
          <stop offset="1" stopColor="#070A13" />
        </linearGradient>
        <linearGradient id={g("cuff")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EEF3FA" />
          <stop offset="0.6" stopColor="#CBD7E8" />
          <stop offset="1" stopColor="#8E9DB3" />
        </linearGradient>
        <pattern id={g("check")} width={7} height={7} patternUnits="userSpaceOnUse">
          <path d="M0 3.5 H7 M3.5 0 V7" stroke="#8FA6CC" strokeWidth={0.9} opacity={0.55} />
        </pattern>
        <radialGradient id={g("brass")} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#FFE9A8" />
          <stop offset="0.5" stopColor="#C99A3E" />
          <stop offset="1" stopColor="#6B4A16" />
        </radialGradient>
        <filter id={g("soft")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>

      {/* a soft shadow under the whole arm */}
      <ellipse cx={160} cy={404} rx={190} ry={16} fill="#000" opacity={0.4} filter={`url(#${g("soft")})`} />

      {/* the blazer sleeve, a cylinder leaving to the left */}
      <path d="M -120 222 L 112 214 Q 128 214 130 230 L 136 380 Q 136 396 120 398 L -120 404 Z" fill={`url(#${g("sleeve")})`} />
      {/* the sleeve's fold and its hem */}
      <path d="M -60 300 Q 10 286 80 296" stroke="#33405F" strokeWidth={3} fill="none" opacity={0.6} />
      <path d="M 118 218 Q 134 224 134 240 L 138 378" stroke="#3A4766" strokeWidth={2.5} fill="none" opacity={0.8} />
      {/* three brass cuff buttons */}
      {[58, 80, 102].map((x) => (
        <g key={x}>
          <circle cx={x} cy={374} r={7.5} fill={`url(#${g("brass")})`} />
          <circle cx={x - 2} cy={372} r={2} fill="#FFF6D8" opacity={0.8} />
        </g>
      ))}

      {/* the shirt cuff, light blue with a fine check */}
      <path d="M 128 226 L 160 228 Q 168 230 168 242 L 168 370 Q 168 384 156 384 L 132 384 Z" fill={`url(#${g("cuff")})`} />
      <path d="M 128 226 L 160 228 Q 168 230 168 242 L 168 370 Q 168 384 156 384 L 132 384 Z" fill={`url(#${g("check")})`} />
      <circle cx={150} cy={360} r={4} fill="#F6F8FB" stroke="#A9B4C4" strokeWidth={1} />

      {/* the wrist and the heel of the palm */}
      <path d="M 164 238 Q 190 228 214 222 L 226 392 Q 196 400 166 386 Z" fill={`url(#${g("palm")})`} />
      {/* the thenar pad, where the thumb meets the palm */}
      <ellipse cx={208} cy={236} rx={40} ry={52} fill={`url(#${g("thenar")})`} />
      <path d="M 186 278 Q 204 292 226 286" stroke={S.crease} strokeWidth={2} fill="none" opacity={0.45} />

      {/* the thumb, straight up */}
      <path d="M 182 232 L 188 124 Q 190 82 217 80 Q 244 82 247 118 L 248 206 Q 238 226 214 228 Z" fill={`url(#${g("thumb")})`} stroke={S.deep} strokeOpacity={0.35} strokeWidth={1.4} />
      {/* its nail, on the outer edge */}
      <path d="M 230 90 Q 246 94 246 114 L 246 140 Q 236 136 231 126 Z" fill="#EDC6B6" stroke="#B88A76" strokeWidth={1.2} />
      <path d="M 234 94 Q 243 100 243 114" stroke="#FFFFFF" strokeWidth={2} opacity={0.55} fill="none" />
      {/* the knuckle crease of the thumb and the light on its side */}
      <path d="M 190 160 Q 210 168 236 158" stroke={S.crease} strokeWidth={2.2} fill="none" opacity={0.55} />
      <path d="M 192 170 Q 210 176 232 168" stroke={S.crease} strokeWidth={1.4} fill="none" opacity={0.35} />
      <path d="M 196 118 Q 198 90 214 86" stroke="#FFFFFF" strokeWidth={4} opacity={0.35} fill="none" strokeLinecap="round" />

      {/* the four curled fingers, stacked */}
      {rolls.map((r, i) => (
        <g key={i}>
          <path
            d={`M ${r.x1} ${r.y} L ${r.x2 - r.h / 2} ${r.y} Q ${r.x2} ${r.y} ${r.x2} ${r.y + r.h / 2} Q ${r.x2} ${r.y + r.h} ${r.x2 - r.h / 2} ${r.y + r.h} L ${r.x1} ${r.y + r.h} Z`}
            fill={`url(#${g("roll")})`}
            stroke={S.crease}
            strokeOpacity={0.4}
            strokeWidth={1.4}
          />
          {/* the tucked fingertip pad, at the palm end */}
          <path d={`M ${r.x1 + 4} ${r.y + 6} Q ${r.x1 + 26} ${r.y + r.h / 2} ${r.x1 + 4} ${r.y + r.h - 6}`} fill={S.dark} opacity={0.55} />
          {/* the knuckle crease near the bend */}
          <path d={`M ${r.x2 - r.h * 0.75} ${r.y + 8} Q ${r.x2 - r.h * 0.62} ${r.y + r.h / 2} ${r.x2 - r.h * 0.75} ${r.y + r.h - 8}`} stroke={S.crease} strokeWidth={1.6} fill="none" opacity={0.5} />
          {/* the shadow each roll casts on the one below */}
          <path d={`M ${r.x1 + 8} ${r.y + r.h + 1} L ${r.x2 - r.h / 2} ${r.y + r.h + 1}`} stroke={S.deep} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
          {/* light on the top of each roll */}
          <path d={`M ${r.x1 + 30} ${r.y + 7} L ${r.x2 - r.h / 2} ${r.y + 7}`} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.22} />
        </g>
      ))}
      {/* the shade where the fist meets the thumb */}
      <path d="M 222 196 Q 236 188 252 194" stroke={S.deep} strokeWidth={3} fill="none" opacity={0.45} />
    </svg>
  );
};
