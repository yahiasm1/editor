// Kwame Brown #54, traced as a dark figure from malingering's opening-tip frame at STAPLES (Feb 15 2006, the only
// Lakers-era Kwame on Commons, about 350 px tall and half hidden by Hawks #5). Too small to stand as a photo at this
// scale, so he is drawn the way the plan draws Rose and Bonner: an outline traced by hand at 4x over a 10 px grid in
// that photo's px, filled dark with no face, in home gold with the white 54, lit from the spot above. The real
// photo rides along as a small chip under his LED segment (StartingFiveSpotlightsKwameChip).
import React from "react";
import { Img, staticFile } from "remotion";
import { prog, ease } from "../../../src/engine";

type Pt = [number, number];

/** the tip-off frame's px: crown, feet and the body's centre line */
export const StartingFiveSpotlightsKwameSrc = { top: 387, feet: 740, cx: 908, headCx: 929, box: [820, 380, 1015, 640] as const };

// head to mid-shorts (the scorer's table hides the rest); right arm up at the ball, left arm out for balance
const BODY: Pt[] = [
  // crown, right side of the head, jaw, neck
  [929, 386], [940, 388], [947, 395], [949, 406], [945, 421], [938, 430], [946, 434],
  // his left arm, out for balance: shoulder, upper arm, elbow, forearm, hand, back along the underside
  [955, 439], [967, 449], [978, 459], [989, 469], [996, 476], [1003, 480], [1008, 487], [1004, 494], [995, 494],
  [985, 488], [975, 481], [965, 475], [955, 470], [947, 466],
  // jersey side, shorts (the table hides the rest)
  [943, 490], [940, 520], [942, 560], [944, 600], [943, 640], [873, 640], [871, 590], [872, 540], [871, 505],
  [872, 472], [876, 452],
  // his right arm, up at the ball: underside to the fist, back down the top
  [869, 432], [861, 411], [853, 391], [847, 373], [843, 361], [839, 353], [840, 345], [846, 341], [854, 343],
  [858, 351], [856, 362], [861, 378], [869, 394], [880, 409], [893, 420],
  // neck, ear, back of the head
  [905, 424], [912, 426], [912, 419], [909, 413], [910, 401], [914, 392], [920, 388],
];
// jersey and shorts, home gold
const JERSEY: Pt[] = [
  [901, 425], [911, 430], [921, 442], [931, 434], [940, 433], [947, 437], [944, 452], [942, 470], [941, 492], [939, 520],
  [942, 560], [944, 600], [943, 640], [873, 640], [871, 590], [872, 540], [871, 505], [872, 470], [876, 452], [884, 440],
  [893, 430],
];
// the gold headband, tilted with his head
const BAND: Pt[] = [[911, 396], [919, 392], [933, 391], [944, 394], [949, 400], [949, 408], [941, 404], [928, 401], [914, 404]];

/** a closed Catmull-Rom path through the traced points */
const path = (pts: Pt[]) => {
  const n = pts.length;
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0]},${p2[1]}`;
  }
  return d + " Z";
};
const D_BODY = path(BODY);
const D_JERSEY = path(JERSEY);
const D_BAND = path(BAND);

/** the traced figure, drawn into a box of w x h that maps the tip-off frame's box */
export const StartingFiveSpotlightsKwame: React.FC<{ w: number; h: number; light: number }> = ({ w, h, light }) => {
  const [x0, y0, x1, y1] = StartingFiveSpotlightsKwameSrc.box;
  const L = Math.min(1.2, light);
  return (
    <svg width={w} height={h} viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="sfs-kw-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2029" />
          <stop offset="0.55" stopColor="#0e1218" />
          <stop offset="1" stopColor="#080a0e" />
        </linearGradient>
        <linearGradient id="sfs-kw-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDC040" />
          <stop offset="0.45" stopColor="#F2AE22" />
          <stop offset="1" stopColor="#9C6A0E" />
        </linearGradient>
        <linearGradient id="sfs-kw-fold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(60,30,0,0.32)" />
          <stop offset="0.3" stopColor="rgba(60,30,0,0)" />
          <stop offset="0.72" stopColor="rgba(60,30,0,0)" />
          <stop offset="1" stopColor="rgba(60,30,0,0.38)" />
        </linearGradient>
        <linearGradient id="sfs-kw-fall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,240,215,0.1)" />
          <stop offset="0.25" stopColor="rgba(255,240,215,0)" />
          <stop offset="0.6" stopColor="rgba(5,6,10,0)" />
          <stop offset="1" stopColor="rgba(5,6,10,0.45)" />
        </linearGradient>
        <filter id="sfs-kw-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={1.6} />
        </filter>
        {/* film grain, so the trace sits with the four photos beside it */}
        <filter id="sfs-kw-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency={1.6} numOctaves={2} seed={54} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <clipPath id="sfs-kw-clip">
          <path d={D_BODY} />
        </clipPath>
      </defs>
      <path d={D_BODY} fill="url(#sfs-kw-body)" stroke="#232a35" strokeWidth={0.6} />
      <g clipPath="url(#sfs-kw-clip)">
        {/* the raised arm passes behind his head: a thin dark gap keeps the two shapes apart */}
        <path d="M893,420 C900,423 906,425 912,426" fill="none" stroke="#05070a" strokeWidth={1.4} opacity={0.8} />
        <path d={D_JERSEY} fill="url(#sfs-kw-gold)" />
        <path d={D_JERSEY} fill="url(#sfs-kw-fold)" />
        {/* the purple trim on the collar and armholes, and the waistband */}
        <path d="M901,425 C906,428 911,430 913,433 L921,442 L931,434 C934,433 937,433 940,433" fill="none" stroke="#552583" strokeWidth={2.2} />
        <path d="M947,437 C945,446 944,452 942,468" fill="none" stroke="#552583" strokeWidth={2} />
        <path d="M893,430 C886,436 880,442 876,452" fill="none" stroke="#552583" strokeWidth={2} />
        <path d="M871,523 C895,526 920,526 940,521" fill="none" stroke="#552583" strokeWidth={3} opacity={0.9} />
        <path d={D_BAND} fill="#F7B52A" />
        <text x={915} y={462} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={10.5} letterSpacing={0.4} fill="#552583" stroke="#ffffff" strokeWidth={0.5} paintOrder="stroke" transform="rotate(4 915 458)">
          LAKERS
        </text>
        <text x={909} y={492} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={33} letterSpacing={-0.5} fill="#ffffff" stroke="#552583" strokeWidth={2.2} paintOrder="stroke">
          54
        </text>
        {/* the follow spot from above: a warm line on every top-facing edge, and the light falling away down the body */}
        <path d={D_BODY} transform="translate(0 2.6)" fill="none" stroke="rgba(255,236,205,1)" strokeWidth={2.6} opacity={0.7 * L} filter="url(#sfs-kw-soft)" />
        <path d={D_BODY} transform="translate(0 1.2)" fill="none" stroke="rgba(255,244,226,1)" strokeWidth={0.9} opacity={0.75 * L} />
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="url(#sfs-kw-fall)" />
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} filter="url(#sfs-kw-grain)" opacity={0.13} style={{ mixBlendMode: "overlay" }} />
      </g>
    </svg>
  );
};

/** the real photo behind the trace: the tip-off crop (x 800-1000, y 330-690 of the frame, shown at half size), #54
 *  ringed. It sits under his credit on the floor and follows the camera's pull back in position only. */
export const StartingFiveSpotlightsKwameChip: React.FC<{ f: number; at: number; x: number; y: number; dim: number }> = ({ f, at, x, y, dim }) => {
  const k = prog(f, at, 12, ease.out);
  const ring = prog(f, at + 8, 14, ease.inOut);
  const W = 100;
  const H = 180;
  // #54's chest in the crop: (908, 480) - (800, 330) at 0.5
  const rx = (908 - 800) * 0.5;
  const ry = (480 - 330) * 0.5;
  const C = 2 * Math.PI * 17;
  return (
    <div style={{ position: "absolute", left: x - W / 2 - 4, top: y, width: W + 8, padding: 4, background: "#E6EDF3", borderRadius: 3, boxShadow: "0 6px 18px rgba(0,0,0,0.6)", opacity: k * dim, transform: `translateY(${(1 - k) * 14}px) rotate(${(1 - k) * -4 + 2}deg)` }}>
      <div style={{ position: "relative", width: W, height: H, overflow: "hidden", background: "#111" }}>
        <Img src={staticFile("kobe-81/startingfivespotlights-kwame-tip.jpg")} style={{ width: W, height: H, display: "block" }} />
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <circle cx={rx} cy={ry} r={17} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth={4.5} strokeDasharray={`${C * ring} ${C}`} transform={`rotate(-90 ${rx} ${ry})`} />
          <circle cx={rx} cy={ry} r={17} fill="none" stroke="#FFFFFF" strokeWidth={2.4} strokeDasharray={`${C * ring} ${C}`} transform={`rotate(-90 ${rx} ${ry})`} />
        </svg>
      </div>
    </div>
  );
};
