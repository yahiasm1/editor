// The free throw coach's hand (the Lakers hired Ed Palubinskas): a real hand, cut out of Evan-Amos's photo of the
// back of a right hand (CC BY-SA 3.0): knuckles, tendons, the vein down the back, nail beds, the hair at the wrist.
// It comes out of a white shirt cuff with a button and a charcoal jacket sleeve. Drawn in the photo's own pixels
// (600 x 823, fingers up), with (0, 0) at the pads of the fingers where they press Shaq's elbow.
import React from "react";
import { staticFile } from "remotion";

export const GRANNYSHOT_HAND_SRC = staticFile("shaq-free-throws/grannyshot-hand.png");
export const GRANNYSHOT_HAND_CONTACT = { x: 380, y: 300 };

export const GrannyShotHand: React.FC<{ press: number }> = ({ press }) => {
  const c = GRANNYSHOT_HAND_CONTACT;
  // press 0..1: the fingers flatten a touch against the elbow, the skin of the knuckles lightens
  const sq = 1 - 0.035 * press;
  return (
    <g transform={`translate(${-c.x},${-c.y})`}>
      <defs>
        <linearGradient id="gs-sleeve" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#15181C" />
          <stop offset="0.35" stopColor="#3A3F47" />
          <stop offset="0.6" stopColor="#2A2E34" />
          <stop offset="1" stopColor="#111316" />
        </linearGradient>
        <linearGradient id="gs-cuff" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#AEB4BC" />
          <stop offset="0.3" stopColor="#F4F6F8" />
          <stop offset="0.62" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#9EA5AE" />
        </linearGradient>
        <linearGradient id="gs-cuff-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0.28} />
          <stop offset="0.3" stopColor="#000" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* jacket sleeve: wool, a crease along it, the lining's edge at the cuff */}
      <path d="M196,860 C196,1200 170,1700 150,2300 L640,2300 C610,1700 560,1200 552,860 Z" fill="url(#gs-sleeve)" />
      <path d="M300,930 C310,1250 290,1700 270,2200" fill="none" stroke="#4E545D" strokeWidth={6} opacity={0.5} />
      <path d="M470,1000 q-40,40 -30,120" fill="none" stroke="#0B0C0E" strokeWidth={9} opacity={0.6} />
      <path d="M196,866 Q374,830 552,866" fill="none" stroke="#0A0B0D" strokeWidth={10} />
      {/* the hand, the real photo */}
      <g transform={`translate(${c.x},${c.y}) scale(${sq.toFixed(4)},1) translate(${-c.x},${-c.y})`}>
        <image href={GRANNYSHOT_HAND_SRC} width={600} height={823} style={{ filter: `saturate(0.92) brightness(${(0.9 + 0.05 * press).toFixed(3)})` }} />
      </g>
      {/* the shirt cuff: barrel cuff, two rows of stitching, a button and its hole */}
      <path d="M232,742 Q372,712 512,742 L528,872 Q372,900 216,872 Z" fill="url(#gs-cuff)" stroke="#8D949D" strokeWidth={2} />
      <path d="M232,742 Q372,712 512,742 L528,872 Q372,900 216,872 Z" fill="url(#gs-cuff-shade)" />
      <path d="M238,758 Q372,730 506,758" fill="none" stroke="#9AA1AA" strokeWidth={2} strokeDasharray="7 5" />
      <path d="M222,858 Q372,884 522,858" fill="none" stroke="#9AA1AA" strokeWidth={2} strokeDasharray="7 5" />
      <path d="M250,744 Q372,722 494,744" fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.8} />
      <circle cx={262} cy={806} r={15} fill="#F2F0EA" stroke="#7F858C" strokeWidth={2} />
      <circle cx={256} cy={806} r={2.6} fill="#6C7279" />
      <circle cx={268} cy={806} r={2.6} fill="#6C7279" />
      <path d="M241,806 h-12" stroke="#8D949D" strokeWidth={3} />
    </g>
  );
};
