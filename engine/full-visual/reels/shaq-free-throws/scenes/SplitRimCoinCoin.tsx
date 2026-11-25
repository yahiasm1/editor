// The real 2006 proof quarter, turned in 3D: the Washington side (US Mint), the South Dakota reverse struck upside
// down to it (coin alignment), so a top-over-bottom flip shows each face upright. 24.26 mm across, 1.75 mm thick,
// 119 reeds: the edge is a stack of thin reeded discs, so it reads as a band when the coin is edge-on.
import React from "react";
import { Img, staticFile } from "remotion";

const HEADS = staticFile("shaq-free-throws/splitrimcoin-quarter-heads.png");
const TAILS = staticFile("shaq-free-throws/splitrimcoin-quarter-tails.jpg");

export const SplitRimCoinCoin: React.FC<{ d: number; rx: number; ry: number; rz: number }> = ({ d, rx, ry, rz }) => {
  const t = d * (1.75 / 24.26);
  const LAYERS = 10;
  const c = Math.cos((rx * Math.PI) / 180);
  // light from above and slightly behind: the face catches it when tilted up
  const lit = 0.62 + 0.38 * Math.abs(c);
  const glint = Math.max(0, Math.sin(((rx + 30) * Math.PI) / 180)) ** 6;
  const face = (back: boolean): React.CSSProperties => ({
    position: "absolute",
    left: 0,
    top: 0,
    width: d,
    height: d,
    borderRadius: "50%",
    overflow: "hidden",
    backfaceVisibility: "hidden",
    transform: `${back ? "rotateX(180deg) " : ""}translateZ(${(t / 2).toFixed(2)}px)`,
    background: "#B9BEC6",
    filter: `brightness(${lit.toFixed(3)}) contrast(1.08)`,
  });
  return (
    <div style={{ position: "absolute", left: -d / 2, top: -d / 2, width: d, height: d, transformStyle: "preserve-3d", transform: `rotateZ(${rz}deg) rotateY(${ry}deg) rotateX(${rx}deg)` }}>
      {/* the reeded edge */}
      {Array.from({ length: LAYERS }, (_, i) => {
        const z = -t / 2 + (t * (i + 0.5)) / LAYERS;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: d,
              height: d,
              borderRadius: "50%",
              transform: `translateZ(${z.toFixed(2)}px)`,
              background: `repeating-conic-gradient(#8E949C 0deg 1.51deg, #E3E6EA 1.51deg 3.025deg)`,
              filter: `brightness(${(0.55 + 0.45 * lit).toFixed(3)})`,
            }}
          />
        );
      })}
      <div style={face(false)}>
        <Img src={HEADS} style={{ position: "absolute", left: "-1.5%", top: "-1%", width: "103%", height: "102%" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `linear-gradient(${(120 + rx).toFixed(0)}deg, rgba(255,255,255,${(0.35 * glint).toFixed(3)}) 30%, rgba(255,255,255,0) 60%)` }} />
      </div>
      <div style={face(true)}>
        <Img src={TAILS} style={{ position: "absolute", left: "-2%", top: "-2%", width: "104%", height: "104%" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: `inset 0 0 ${(d * 0.02).toFixed(1)}px ${(d * 0.012).toFixed(1)}px #9AA0A8` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `linear-gradient(${(300 + rx).toFixed(0)}deg, rgba(255,255,255,${(0.35 * glint).toFixed(3)}) 30%, rgba(255,255,255,0) 60%)` }} />
      </div>
    </div>
  );
};
