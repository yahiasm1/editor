// The grab: a defender's forearm and hand reaching in from off frame and clamping Shaq's left forearm, drawn in the
// cut-out's own pixels (the 2000 Finals photo, 719 x 2327 cut-out) so it sits on his real arm. Local frame: his
// forearm runs straight down the local y axis through (0, 0), about 90 px wide; the defender's arm comes in along +x.
// What makes it a real hand: the back of the hand seen from above with four extensor tendons and knuckle ridges,
// four fingers wrapped over his forearm with a crease at each joint and the nails showing on the far side, the thumb
// hooked under, a white terry sweatband at the wrist (2000-era), skin shading from an overhead light. Foul red marks
// bloom under the fingertips on "grabs" (the reel's one colour for the foul).
import React from "react";

const SK = { hi: "#B07A55", lit: "#94603F", mid: "#7A4A2E", dark: "#55311D", crease: "#3B2113", nail: "#D9B5A0" };
export const PICTURE_COURT_GRAB_AT: [number, number] = [492, 930];
export const PICTURE_COURT_GRAB_ANGLE = -39;
const FOUL = "#E5383B";
/** the defender forearm comes in from his right, flatter than the hand */
const PICTURE_COURT_ARM_TURN = 28;

export const PictureCourtGrab: React.FC<{ f: number; reach: number; clamp: number; bloom: number }> = ({ f, reach, clamp, bloom }) => {
  if (reach <= 0.001) return null;
  const off = (1 - reach) * 1600;
  const tremble = clamp > 0.9 ? Math.sin(f * 1.7) * 1.2 : 0;
  // fingers open (lifted off, shorter) -> wrapped
  const wrap = clamp;
  const fingers = [0, 1, 2, 3].map((i) => {
    const y = -64 + i * 31 + (i === 3 ? 4 : 0);
    const w = 27 - (i === 3 ? 5 : 0);
    const x0 = 70;
    const x1 = -46 - (i === 1 ? 8 : i === 2 ? 5 : 0) + (1 - wrap) * 70;
    return { y, w, x0, x1, i };
  });
  return (
    <g transform={`translate(${off.toFixed(1)} ${tremble.toFixed(2)})`}>
      <defs>
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
          <stop offset="0.6" stopColor="#E6E8EC" />
          <stop offset="1" stopColor="#A9AEB6" />
        </linearGradient>
        <radialGradient id="pcg-mark">
          <stop offset="0" stopColor={FOUL} stopOpacity={0.95} />
          <stop offset="0.55" stopColor={FOUL} stopOpacity={0.55} />
          <stop offset="1" stopColor={FOUL} stopOpacity={0} />
        </radialGradient>
        <filter id="pcg-shadow" x="-20%" y="-50%" width="140%" height="200%">
          <feDropShadow dx={-6} dy={14} stdDeviation={10} floodColor="#000" floodOpacity={0.5} />
        </filter>
      </defs>
      <g filter="url(#pcg-shadow)">
        {/* forearm, from off frame, coming in from his right side: wrist, the flexor bulge, toward the elbow */}
        <g transform={`rotate(${PICTURE_COURT_ARM_TURN} 190 0) translate(190 0) scale(1 0.72) translate(-190 0)`}>
          {/* runs on past the elbow and off the frame edge, so it always belongs to someone off screen */}
          <path d="M 3600 -250 C 1600 -215, 900 -160, 640 -146 C 520 -140, 470 -134, 470 -128 C 360 -116, 300 -92, 250 -78 L 190 -74 L 190 66 L 250 70 C 330 86, 420 104, 520 112 C 700 128, 1100 150, 1500 166 C 2200 196, 2900 220, 3600 240 Z" fill="url(#pcg-arm)" />
          <path d="M 1400 -112 C 900 -110, 600 -104, 470 -92 C 380 -84, 320 -66, 270 -56" stroke="rgba(255,226,200,0.32)" strokeWidth={18} fill="none" strokeLinecap="round" />
          <path d="M 1400 96 C 1000 92, 700 86, 520 80 C 420 74, 330 62, 270 54" stroke="rgba(30,15,6,0.35)" strokeWidth={16} fill="none" strokeLinecap="round" />
          <path d="M 640 -40 C 520 -30, 420 -24, 300 -14" stroke="rgba(80,100,150,0.22)" strokeWidth={5} fill="none" />
          <path d="M 560 20 C 470 26, 380 30, 290 26" stroke="rgba(60,30,15,0.3)" strokeWidth={4} fill="none" />
          {Array.from({ length: 70 }, (_, i) => {
            const x = 300 + ((i * 53) % 900), y = -100 + ((i * 37) % 190);
            return <line key={i} x1={x} y1={y} x2={x + 10} y2={y + 3} stroke="rgba(25,12,5,0.32)" strokeWidth={1.6} />;
          })}
          {/* the white terry sweatband */}
          <path d="M 186 -84 C 192 -40, 192 30, 186 74 L 272 82 C 278 30, 278 -44, 272 -92 Z" fill="url(#pcg-band)" />
          {Array.from({ length: 15 }, (_, i) => (
            <line key={i} x1={192 + i * 5.4} y1={-84} x2={192 + i * 5.4} y2={76} stroke="rgba(120,125,135,0.25)" strokeWidth={1.6} />
          ))}
        </g>
        {/* back of the hand */}
        <path d="M 194 -58 C 150 -76, 100 -80, 70 -70 L 58 52 C 96 66, 150 62, 194 50 Z" fill="url(#pcg-arm)" />
        {/* extensor tendons fanning to the knuckles */}
        {fingers.map((g) => (
          <path key={`t${g.i}`} d={`M 186 ${-10 + g.i * 6} C 150 ${-6 + g.i * 6}, 110 ${g.y + g.w / 2}, 80 ${g.y + g.w / 2}`} stroke="rgba(255,226,200,0.2)" strokeWidth={6} fill="none" strokeLinecap="round" />
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
            {/* nail on the far side of his arm */}
            <path d={`M ${g.x1 + 4} ${g.y + 5} q -6 ${g.w / 2 - 5} 0 ${g.w - 10}`} stroke={SK.nail} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.85 * wrap} />
            {/* joint creases */}
            {[0.34, 0.68].map((k) => {
              const x = g.x0 + (g.x1 - g.x0) * k;
              return <path key={k} d={`M ${x} ${g.y + 4} q 4 ${g.w / 2 - 4} 0 ${g.w - 8}`} stroke={SK.crease} strokeOpacity={0.5} strokeWidth={1.8} fill="none" />;
            })}
            <ellipse cx={g.x0 + 4} cy={g.y + g.w / 2} rx={11} ry={g.w / 2 - 2} fill={SK.hi} opacity={0.45} />
          </g>
        ))}
      </g>
      {/* the foul marks: red pressure blooming out from under every fingertip and the heel of the hand */}
      {bloom > 0 && (
        <g opacity={bloom}>
          {fingers.map((g) => (
            <g key={`m${g.i}`}>
              <ellipse cx={g.x1 - 4} cy={g.y + g.w / 2} rx={10 + 18 * bloom} ry={g.w / 2 + 8 * bloom} fill="url(#pcg-mark)" />
              <path d={`M ${g.x1 - 2} ${g.y + 3} q -8 ${g.w / 2 - 3} 0 ${g.w - 6}`} stroke={FOUL} strokeWidth={4} fill="none" strokeLinecap="round" />
            </g>
          ))}
          {fingers.slice(0, 3).map((g) => (
            <ellipse key={`b${g.i}`} cx={-6} cy={g.y + g.w + 1} rx={26 * bloom + 8} ry={4 + 3 * bloom} fill="url(#pcg-mark)" />
          ))}
          <ellipse cx={50} cy={-92} rx={30 + 30 * bloom} ry={12 + 10 * bloom} fill="url(#pcg-mark)" />
          <ellipse cx={50} cy={78} rx={30 + 30 * bloom} ry={12 + 10 * bloom} fill="url(#pcg-mark)" />
        </g>
      )}
    </g>
  );
};
