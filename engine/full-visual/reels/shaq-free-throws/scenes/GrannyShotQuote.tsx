// Shaq's answer, stamped: a white card struck with black rubber-stamp ink (the same heavy face as the HACK-A-SHAQ
// stamp in `clown`, now black on white), starved speckle and heavier edges from feTurbulence, a frame rule, and the
// source in small grey under it. "UNDERHANDED." takes a foul red strike that ends on its word.
// Quote and source from facts.md: "I'd shoot zero percent before I'd shoot underhanded." (Esquire, 2005).
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

export const GRANNYSHOT_STAMP_FONT = "'GS Inter Black', 'Inter', sans-serif";

export function useGrannyShotFont() {
  const [h] = useState(() => delayRender("Inter Black for the granny quote stamp"));
  useEffect(() => {
    const face = new FontFace("GS Inter Black", `url(${staticFile("shaq-free-throws/grannyshot-inter-black.otf")})`, { weight: "900" });
    face
      .load()
      .then((ok) => {
        (document.fonts as unknown as { add: (ff: FontFace) => void }).add(ok);
        continueRender(h);
      })
      .catch(() => continueRender(h));
  }, [h]);
}

export const GS_CARD = { w: 860, h: 470 };

/** the card, (0,0) its centre. strike 0..1 draws the red line through UNDERHANDED. */
export const GrannyShotQuote: React.FC<{ strike: number; ink: number }> = ({ strike, ink }) => {
  const W = GS_CARD.w;
  const H = GS_CARD.h;
  const lines = [
    { t: "I'D SHOOT", s: 50, y: -118 },
    { t: "ZERO PERCENT", s: 76, y: -30 },
    { t: "BEFORE I'D SHOOT", s: 50, y: 52 },
    { t: "UNDERHANDED.", s: 70, y: 146 },
  ];
  const sx = -290;
  const sw = 580 * strike;
  return (
    <svg width={W} height={H + 70} viewBox={`${-W / 2} ${-H / 2} ${W} ${H + 70}`} style={{ position: "absolute", left: -W / 2, top: -H / 2, overflow: "visible" }}>
      <defs>
        <filter id="gs-ink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.75" result="holes" />
          <feComposite in="SourceGraphic" in2="holes" operator="in" result="speck" />
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={3} result="w" />
          <feDisplacementMap in="speck" in2="w" scale={3} />
        </filter>
        <filter id="gs-paper" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves={3} seed={11} result="t" />
          <feColorMatrix in="t" type="matrix" values="0 0 0 0 0.93  0 0 0 0 0.91  0 0 0 0 0.87  0 0 0 0.12 0" result="tint" />
          <feComposite in="tint" in2="SourceGraphic" operator="in" result="grain" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="grain" />
          </feMerge>
        </filter>
      </defs>
      {/* the card: paper, a soft drop shadow, hairline */}
      <rect x={-W / 2 + 6} y={-H / 2 + 14} width={W} height={H} rx={20} fill="#000" opacity={0.45} style={{ filter: "blur(14px)" }} />
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={20} fill="#F5F2EA" filter="url(#gs-paper)" />
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={20} fill="none" stroke="#30363D" strokeWidth={1} />
      {/* the stamp's impression: frame rule and the four lines */}
      <g filter="url(#gs-ink)" opacity={ink}>
        <rect x={-W / 2 + 30} y={-H / 2 + 30} width={W - 60} height={H - 60} rx={10} fill="none" stroke="#141414" strokeWidth={7} />
        {lines.map((l) => (
          <text key={l.t} x={0} y={l.y} textAnchor="middle" fontFamily={GRANNYSHOT_STAMP_FONT} fontWeight={900} fontSize={l.s} fill="#141414" letterSpacing={l.s * 0.01}>
            {l.t}
          </text>
        ))}
      </g>
      {/* the red strike: a marker stroke, slightly rising, through UNDERHANDED */}
      {strike > 0 && (
        <path d={`M${sx},${146 - 24} L${sx + sw},${146 - 28 - 8 * strike}`} stroke="#E5383B" strokeWidth={14} strokeLinecap="round" opacity={0.95} />
      )}
      <text x={0} y={H / 2 + 46} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={500} fontSize={26} fill="#8B949E">
        Shaquille O'Neal, Esquire, 2005
      </text>
    </svg>
  );
};
