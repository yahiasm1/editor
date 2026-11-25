// wilt-100 "cta": a photo print with two faces. 1962: the AP print, black and white on cream paper, matte, worn
// corners, grain. 2006: a colour print, bright white border, a gloss sheen. Each back carries a pencil note. The print
// falls face down, flips face up on "send", and can carry an amber witness edge.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CKW_AMBER, CKW_PRINT, ckwClamp, ckwPrintH, ckwPrintW } from "./CtaKobeVsWiltKit";

export type CtaKobeVsWiltPrintProps = {
  era: "1962" | "2006";
  src: string;
  hand: string; // written on the foot of the face
  credit: string;
  backLines: string[]; // pencil on the back
  flip: number; // 0 back up, 1 face up
  sheen: number; // 0..1 the gloss band's travel across (2006 only)
  amber: number; // 0..1 witness edge
  hand2Font: string;
  uiFont: string;
  children?: React.ReactNode; // drawn on the photo (labels)
};

const CtaKobeVsWiltGrain: React.FC<{ id: string; op: number; seed: number }> = ({ id, op, seed }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: op, mixBlendMode: "multiply", pointerEvents: "none" }}>
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} />
      <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.31  0 0 0 0 0.24  0 0 0 0.55 0" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#${id})`} />
  </svg>
);

export const CtaKobeVsWiltPrint: React.FC<CtaKobeVsWiltPrintProps> = (p) => {
  const old = p.era === "1962";
  const paper = old ? "#EFE6D2" : "#FBFBF8";
  const backPaper = old ? "#E6DECB" : "#F1F1EC";
  const angle = 180 * (1 - p.flip);
  const { imgW, imgH, side, foot } = CKW_PRINT;
  const radius = old ? 5 : 3;
  const faceCommon: React.CSSProperties = {
    position: "absolute", inset: 0, borderRadius: radius, overflow: "hidden", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
  };
  const glow = ckwClamp(p.amber);
  return (
    <div style={{ position: "relative", width: ckwPrintW, height: ckwPrintH, perspective: 1600 }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${angle.toFixed(2)}deg)` }}>
        {/* FACE */}
        <div style={{ ...faceCommon, background: paper, boxShadow: glow > 0 ? `0 0 0 ${(3 * glow).toFixed(2)}px ${CKW_AMBER}, 0 0 ${(34 * glow).toFixed(1)}px rgba(242,179,61,${(0.5 * glow).toFixed(3)})` : undefined }}>
          <div style={{ position: "absolute", left: side, top: side, width: imgW, height: imgH, overflow: "hidden", background: "#111" }}>
            <Img
              src={staticFile(p.src)}
              style={{
                width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%",
                filter: old ? "grayscale(1) contrast(1.06) brightness(0.98) sepia(0.08)" : "saturate(1.08) contrast(1.04)",
              }}
            />
            {/* the print's own light: a soft falloff to the edges */}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 75% at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.28) 100%)" }} />
            {!old && (
              <div
                style={{
                  position: "absolute", top: -80, bottom: -80, width: 160,
                  left: -200 + (imgW + 400) * p.sheen, transform: "rotate(18deg)",
                  background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%)",
                }}
              />
            )}
            {p.children}
          </div>
          <div style={{ position: "absolute", left: side + 2, top: side + imgH + 6, fontFamily: p.hand2Font, fontWeight: 700, fontSize: 32, color: old ? "#2B2620" : "#141414", transform: `rotate(${old ? -1.5 : -0.8}deg)`, transformOrigin: "0 50%" }}>{p.hand}</div>
          <div style={{ position: "absolute", right: side, top: side + imgH + 44, fontFamily: p.uiFont, fontSize: 16, fontWeight: 500, color: old ? "#857C69" : "#8A8A86" }}>{p.credit}</div>
          {old && <CtaKobeVsWiltGrain id="ckw-grain-face" op={0.35} seed={7} />}
          {/* wear: the 1962 print's softened corners and a faint crease */}
          {old && (
            <>
              <div style={{ position: "absolute", left: 0, top: 0, width: 26, height: 26, background: "radial-gradient(circle at 0 0, rgba(120,100,70,0.35), rgba(0,0,0,0) 70%)" }} />
              <div style={{ position: "absolute", right: 0, bottom: 0, width: 30, height: 30, background: "radial-gradient(circle at 100% 100%, rgba(120,100,70,0.35), rgba(0,0,0,0) 70%)" }} />
              <div style={{ position: "absolute", left: ckwPrintW * 0.62, top: 0, width: 1.2, height: ckwPrintH, background: "linear-gradient(rgba(255,255,255,0.10), rgba(255,255,255,0.18) 40%, rgba(0,0,0,0.10) 41%, rgba(255,255,255,0.08))", transform: "rotate(1.2deg)" }} />
            </>
          )}
          {/* a slight bow in the paper: light across the face */}
          <AbsoluteFill style={{ background: old ? "linear-gradient(105deg, rgba(255,255,255,0.10), rgba(0,0,0,0) 40%, rgba(0,0,0,0.08))" : "linear-gradient(105deg, rgba(255,255,255,0.14), rgba(0,0,0,0) 45%, rgba(0,0,0,0.05))", pointerEvents: "none" }} />
        </div>
        {/* BACK */}
        <div style={{ ...faceCommon, background: backPaper, transform: "rotateY(180deg)" }}>
          {old && <CtaKobeVsWiltGrain id="ckw-grain-back" op={0.45} seed={3} />}
          {!old &&
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ position: "absolute", left: -40, top: 40 + i * 76, width: ckwPrintW + 80, height: 1, background: "rgba(0,0,0,0.05)", transform: "rotate(-24deg)" }} />
            ))}
          <div style={{ position: "absolute", left: 44, top: 70, transform: `rotate(${old ? -4 : -2.5}deg)`, transformOrigin: "0 0" }}>
            {p.backLines.map((l, i) => (
              <div key={i} style={{ fontFamily: p.hand2Font, fontWeight: 400, fontSize: 36, lineHeight: "52px", color: "#5E5B55", opacity: 0.9 }}>{l}</div>
            ))}
          </div>
          <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.12), rgba(0,0,0,0) 45%, rgba(0,0,0,0.10))" }} />
        </div>
      </div>
    </div>
  );
};
