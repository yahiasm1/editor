// The rubber stamp of `clown` and the impression it leaves. An office desk stamp seen a little from above: a turned
// lacquered beech knob (ball top, waisted neck, collar), a rectangular beech mount with its paper index label on top,
// a thin grey foam cushion and the red rubber die under it, wet with white pigment ink. The impression: heavy rough
// letters with starved speckle, a frame rule, ink heavier at the edges, spatter. (notes/ClownNose.md)
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

export const CLOWNNOSE_STAMP_FONT = "'CN Inter Black', 'Inter', sans-serif";

export function useClownNoseFont() {
  const [h] = useState(() => delayRender("Inter Black for the Hack-a-Shaq stamp"));
  useEffect(() => {
    const face = new FontFace("CN Inter Black", `url(${staticFile("shaq-free-throws/clownnose-inter-black.otf")})`, { weight: "900" });
    face
      .load()
      .then((ok) => {
        (document.fonts as unknown as { add: (ff: FontFace) => void }).add(ok);
        continueRender(h);
      })
      .catch(() => continueRender(h));
  }, [h]);
}

/** deterministic noise 0..1 */
export const ClownNoseRnd = (i: number, seed = 1) => {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const CN_IMP = { w: 820, h: 210 }; // the die face = the impression's frame rule

/** The stamp, drawn around its die face: (0,0) is the die's bottom centre. squash 0..1 compresses it on contact. */
export const ClownNoseStampBody: React.FC<{ squash: number; wet: number }> = ({ squash, wet }) => {
  const W = CN_IMP.w + 24; // mount a little wider than the die
  const half = W / 2;
  const sy = 1 - 0.07 * squash;
  const frontH = 92;
  const topH = 54; // the mount's top face, foreshortened
  const back = 26; // how much the back edge is inset (perspective)
  const yFront = -18; // under the mount: cushion + die
  return (
    <svg width={W + 80} height={520} viewBox={`${-half - 40} -480 ${W + 80} 520`} style={{ position: "absolute", left: -half - 40, top: -480, overflow: "visible", transform: `scaleY(${sy.toFixed(4)})`, transformOrigin: "50% 100%" }}>
      <defs>
        <linearGradient id="cn-wood-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9AC76" />
          <stop offset="0.5" stopColor="#C08A55" />
          <stop offset="1" stopColor="#8E5F34" />
        </linearGradient>
        <linearGradient id="cn-wood-top" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C9965F" />
          <stop offset="0.6" stopColor="#E4BC88" />
          <stop offset="1" stopColor="#D0A06A" />
        </linearGradient>
        <radialGradient id="cn-knob" cx="0.64" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#FFE2B8" />
          <stop offset="0.22" stopColor="#E2AE74" />
          <stop offset="0.7" stopColor="#A66B38" />
          <stop offset="1" stopColor="#5E3A1C" />
        </radialGradient>
        <linearGradient id="cn-neck" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6B4322" />
          <stop offset="0.35" stopColor="#B77E48" />
          <stop offset="0.62" stopColor="#F0C996" />
          <stop offset="1" stopColor="#7A4C26" />
        </linearGradient>
        <filter id="cn-grain" x="0" y="0" width="1" height="1">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.18" numOctaves="3" seed="4" />
          <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 0 0.08  0 0 0 0.55 -0.12" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      {/* the rubber die and its foam cushion */}
      <rect x={-CN_IMP.w / 2} y={yFront + 6} width={CN_IMP.w} height={12} rx={2} fill="#6E2A22" />
      <rect x={-CN_IMP.w / 2} y={yFront + 14} width={CN_IMP.w} height={4} fill={`rgba(244,246,248,${(0.35 + 0.6 * wet).toFixed(3)})`} />
      <rect x={-CN_IMP.w / 2 + 4} y={yFront} width={CN_IMP.w - 8} height={7} fill="#8C9096" />
      {/* the mount: front face, top face */}
      <rect x={-half} y={yFront - frontH} width={W} height={frontH} rx={5} fill="url(#cn-wood-front)" />
      <rect x={-half} y={yFront - frontH} width={W} height={frontH} rx={5} fill="#000" filter="url(#cn-grain)" />
      <path d={`M${-half} ${yFront - frontH} L${-half + back} ${yFront - frontH - topH} L${half - back} ${yFront - frontH - topH} L${half} ${yFront - frontH} Z`} fill="url(#cn-wood-top)" />
      <path d={`M${-half} ${yFront - frontH} L${-half + back} ${yFront - frontH - topH} L${half - back} ${yFront - frontH - topH} L${half} ${yFront - frontH} Z`} fill="#000" filter="url(#cn-grain)" opacity={0.7} />
      {/* the edge where top meets front catches the light */}
      <line x1={-half + 3} y1={yFront - frontH + 1} x2={half - 3} y2={yFront - frontH + 1} stroke="#FFE7C4" strokeWidth={2} opacity={0.8} />
      <rect x={-half} y={yFront - 8} width={W} height={8} fill="rgba(0,0,0,0.25)" />
      {/* the paper index label on top, a proof of the impression */}
      <g transform={`translate(${-210} ${yFront - frontH - topH + 12})`}>
        <path d="M0 0 L420 0 L428 30 L-8 30 Z" fill="#EFE6D2" />
        <path d="M0 0 L420 0 L428 30 L-8 30 Z" fill="none" stroke="#B9AC90" strokeWidth={1} />
        <text x={210} y={23} textAnchor="middle" fontFamily={CLOWNNOSE_STAMP_FONT} fontWeight={900} fontSize={22} fill="#2B2F36" letterSpacing={3}>
          HACK-A-SHAQ
        </text>
      </g>
      {/* the knob: collar, waisted neck, ball */}
      <ellipse cx={0} cy={yFront - frontH - topH / 2} rx={96} ry={22} fill="#5E3A1C" opacity={0.45} />
      <path d={`M-84 ${yFront - frontH - topH / 2} C-84 ${yFront - frontH - topH / 2 - 26} -46 ${yFront - 150} -36 ${yFront - 178} L36 ${yFront - 178} C46 ${yFront - 150} 84 ${yFront - frontH - topH / 2 - 26} 84 ${yFront - frontH - topH / 2} Z`} fill="url(#cn-neck)" />
      <ellipse cx={0} cy={yFront - frontH - topH / 2} rx={86} ry={17} fill="#C99560" />
      <ellipse cx={0} cy={yFront - frontH - topH / 2 - 3} rx={80} ry={13} fill="#E1B47F" />
      <ellipse cx={0} cy={yFront - 178} rx={40} ry={12} fill="#8E5A2E" />
      <circle cx={0} cy={yFront - 250} r={78} fill="url(#cn-knob)" />
      <ellipse cx={26} cy={yFront - 286} rx={24} ry={13} fill="#FFF3DF" opacity={0.75} transform={`rotate(-28 26 ${yFront - 286})`} />
      <path d={`M-62 ${yFront - 212} A78 78 0 0 0 58 ${yFront - 198}`} stroke="#3B2310" strokeWidth={3} fill="none" opacity={0.35} />
    </svg>
  );
};

/** The impression itself, white pigment ink on the navy card. `ink` 0..1 fades it in on contact; `wet` gives the
 *  first second its sheen. Centred at (0,0). */
export const ClownNoseImpression: React.FC<{ ink: number; wet: number; spatter: number }> = ({ ink, wet, spatter }) => {
  const { w, h } = CN_IMP;
  const dots = Array.from({ length: 22 }, (_, i) => {
    const side = ClownNoseRnd(i, 2);
    const a = ClownNoseRnd(i, 3) * Math.PI * 2;
    const d = 0.55 + ClownNoseRnd(i, 4) * 0.35;
    const x = Math.cos(a) * (w / 2) * d * (1 + 0.25 * side);
    const y = Math.sin(a) * (h / 2) * d * 1.5;
    const r = 1.5 + ClownNoseRnd(i, 5) * (i % 5 === 0 ? 7 : 3.5);
    return { x: x * (0.85 + 0.15 * spatter), y: y * (0.85 + 0.15 * spatter), r };
  });
  return (
    <svg width={w + 220} height={h + 220} viewBox={`${-w / 2 - 110} ${-h / 2 - 110} ${w + 220} ${h + 220}`} style={{ position: "absolute", left: -w / 2 - 110, top: -h / 2 - 110, overflow: "visible", opacity: ink }}>
      <defs>
        <filter id="cn-ink" x="-10%" y="-20%" width="120%" height="140%">
          {/* rough edge: the rubber's ink squeezes out unevenly */}
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="7" xChannelSelector="R" yChannelSelector="G" result="rough" />
          {/* starved speckle: where the die did not pick up ink */}
          <feTurbulence type="fractalNoise" baseFrequency="0.38" numOctaves="2" seed="11" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -14 7.9" result="holes" />
          <feComposite in="rough" in2="holes" operator="out" result="speck" />
          {/* bigger blotches of thin ink */}
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed="3" result="blot" />
          <feColorMatrix in="blot" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.2 2.45" result="thin" />
          <feComposite in="speck" in2="thin" operator="in" />
        </filter>
        <filter id="cn-edge" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter="url(#cn-ink)" fill="#F3F5F7">
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="none" stroke="#F3F5F7" strokeWidth={9} />
        <rect x={-w / 2 + 16} y={-h / 2 + 16} width={w - 32} height={h - 32} rx={5} fill="none" stroke="#F3F5F7" strokeWidth={3} />
        <text x={0} y={46} textAnchor="middle" fontFamily={CLOWNNOSE_STAMP_FONT} fontWeight={900} fontSize={128} textLength={w - 96} lengthAdjust="spacingAndGlyphs">
          HACK-A-SHAQ
        </text>
      </g>
      {/* ink pools at the stroke edges: a brighter, thinner outline on the same rough path */}
      <g filter="url(#cn-edge)" fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.35 + 0.4 * wet}>
        <text x={0} y={46} textAnchor="middle" fontFamily={CLOWNNOSE_STAMP_FONT} fontWeight={900} fontSize={128} textLength={w - 96} lengthAdjust="spacingAndGlyphs">
          HACK-A-SHAQ
        </text>
      </g>
      <g fill="#F3F5F7" opacity={Math.min(1, spatter * 1.4)}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r * Math.min(1, spatter * 1.6)} />
        ))}
      </g>
    </svg>
  );
};
