// The red foam clown nose, redrawn from Robert Cudmore's photo (Commons, CC BY-SA 2.0): open-cell foam, matte, pores
// over the whole surface that catch the light, a slightly flattened ball, the hole for the wearer's nose about a
// quarter of its width, a pinched cut crease on top, a soft dusty scuff. Foul red #E5383B (plan: the joke lands on the
// foul's colour). The light comes from the viewer's right, as on Nelson's face.
import React from "react";

/**
 * d: diameter in px. hole: the hole's angle from the viewer in degrees (0 = facing us, 90 = on the rim, > 90 hidden:
 * turned into the face). sx/sy: squash.
 */
export const ClownNoseFoam: React.FC<{ d: number; hole: number; sx?: number; sy?: number; rot?: number }> = ({ d, hole, sx = 1, sy = 1, rot = 0 }) => {
  const R = 50;
  const a = (hole * Math.PI) / 180;
  const hv = Math.cos(a); // how much of the hole faces us
  const hy = 16 + Math.sin(a) * 26; // it slides down the ball as it turns away
  return (
    <svg width={d} height={d} viewBox="-60 -60 120 120" style={{ position: "absolute", left: -d / 2, top: -d / 2, overflow: "visible", transform: `rotate(${rot.toFixed(2)}deg) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`, transformOrigin: "50% 100%" }}>
      <defs>
        <radialGradient id="cn-foam" cx="0.66" cy="0.3" r="0.82">
          <stop offset="0" stopColor="#FF9A8E" />
          <stop offset="0.25" stopColor="#F2544F" />
          <stop offset="0.62" stopColor="#E5383B" />
          <stop offset="0.9" stopColor="#A51F24" />
          <stop offset="1" stopColor="#6E1216" />
        </radialGradient>
        <radialGradient id="cn-hole" cx="0.45" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#3A0608" />
          <stop offset="0.7" stopColor="#6A1013" />
          <stop offset="1" stopColor="#B0252A" />
        </radialGradient>
        <radialGradient id="cn-turn" cx="0.62" cy="0.36" r="0.66">
          <stop offset="0.55" stopColor="#3A0608" stopOpacity={0} />
          <stop offset="0.9" stopColor="#3A0608" stopOpacity={0.35} />
          <stop offset="1" stopColor="#2A0406" stopOpacity={0.6} />
        </radialGradient>
        <radialGradient id="cn-spec" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD6CF" stopOpacity={0.75} />
          <stop offset="1" stopColor="#FFD6CF" stopOpacity={0} />
        </radialGradient>
        <clipPath id="cn-ball">
          <ellipse cx={0} cy={2} rx={R + 2} ry={R - 3} />
        </clipPath>
        <filter id="cn-pores" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.42" numOctaves="2" seed="9" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 0.86  0 0 0 0 0.84  0 0 0 -14 6.6" result="lit" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.02  0 0 0 0 0.03  0 0 0 14 -7.6" result="dark" />
          <feMerge>
            <feMergeNode in="dark" />
            <feMergeNode in="lit" />
          </feMerge>
        </filter>
        <radialGradient id="cn-litmask" cx="0.68" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity={0.9} />
          <stop offset="1" stopColor="#fff" stopOpacity={0.15} />
        </radialGradient>
        <mask id="cn-lit">
          <rect x={-60} y={-60} width={120} height={120} fill="url(#cn-litmask)" />
        </mask>
      </defs>
      <g clipPath="url(#cn-ball)">
        <rect x={-60} y={-60} width={120} height={120} fill="url(#cn-foam)" />
        {/* the pores, lit on the right, open and dark everywhere */}
        <rect x={-60} y={-60} width={120} height={120} filter="url(#cn-pores)" mask="url(#cn-lit)" opacity={0.5} />
        {/* the dusty scuff the photo shows near the top */}
        <ellipse cx={10} cy={-30} rx={13} ry={7} fill="#D9A3A0" opacity={0.35} transform="rotate(-18 10 -30)" />
        {/* the hole, foreshortened as it turns away */}
        {hv > 0.02 && (
          <g transform={`translate(-4 ${hy.toFixed(2)})`}>
            <ellipse cx={0} cy={0} rx={13} ry={Math.max(0.5, 12 * hv)} fill="url(#cn-hole)" />
            <ellipse cx={0} cy={-1.2 * hv} rx={13} ry={Math.max(0.4, 12 * hv)} fill="none" stroke="#F06A66" strokeWidth={1.2} opacity={0.6} />
          </g>
        )}
        {/* the turn into shadow on the left, and a rim of reflected light at the bottom */}
        <rect x={-60} y={-60} width={120} height={120} fill="url(#cn-turn)" />
        {/* the soft sheen the foam's skin takes from the sun on the right */}
        <ellipse cx={20} cy={-22} rx={20} ry={13} fill="url(#cn-spec)" transform="rotate(-30 20 -22)" />
      </g>
      {/* the pinched cut crease on top */}
      <path d="M-18 -37 C-8 -43 4 -42 14 -38" stroke="#7A1418" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.85} />
      <path d="M-16 -35 C-7 -40 4 -39 12 -36" stroke="#FF8C84" strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.6} />
    </svg>
  );
};
