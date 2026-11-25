// wilt-100 "close": the real Pennsylvania historical marker outside the arena today (Crazycat8590, CC0), as a photo
// card. It rises on "So yes", the light slides across its gold letters, and on "greatest" the camera pushes past it:
// the card blows up beside the plate and is gone, the night vault already behind it.
import React from "react";
import { Img, staticFile } from "remotion";
import { arrive, ease, prog } from "../../../src/engine";
import { CW_DIM, type CloseWitnessesT, cwLerp } from "./CloseWitnessesKit";

const CW_CARD = { w: 560, h: 717, cx: 540, cy: 1000 };
// the push goes past the plate's right edge, so the marker slides out to the left
const ORIGIN = { x: 0.7, y: 0.4 };

export const CloseWitnessesMarker: React.FC<{ f: number; T: CloseWitnessesT; font: string }> = ({ f, T, font }) => {
  if (f < T.born || f > T.greatest + 26) return null;
  const inK = arrive(f, T.born, 20);
  const hold = prog(f, T.born, T.greatest - T.born, ease.linear);
  const push = prog(f, T.greatest - 5, 24, ease.in);
  const scale = (1 + 0.07 * hold) * cwLerp(1, 5.2, push);
  const op = Math.min(inK * 1.4, 1) * (1 - prog(f, T.greatest + 2, 14, ease.in));
  const blur = (1 - inK) * 14 + push * 10;
  const glint = prog(f, T.so - 4, 40, ease.inOut);
  const textK = 1 - prog(f, T.greatest - 6, 6, ease.in);
  // the credit and the line under it ride the card's slow push, so the growing photo never runs into them
  const hs = 1 + 0.07 * hold;
  const topGrow = ORIGIN.y * CW_CARD.h * (hs - 1);
  const botGrow = (1 - ORIGIN.y) * CW_CARD.h * (hs - 1);
  const rightGrow = (1 - ORIGIN.x) * CW_CARD.w * (hs - 1);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: op }}>
      <div
        style={{
          position: "absolute",
          left: CW_CARD.cx - CW_CARD.w / 2,
          top: CW_CARD.cy - CW_CARD.h / 2 + (1 - inK) * 420,
          width: CW_CARD.w,
          height: CW_CARD.h,
          transform: `scale(${scale.toFixed(4)})`,
          transformOrigin: `${ORIGIN.x * 100}% ${ORIGIN.y * 100}%`,
          filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined,
          borderRadius: 26,
          overflow: "hidden",
          background: "#161B22",
          boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 0 0 1.5px #30363D",
        }}
      >
        <Img src={staticFile("wilt-100/closewitnesses-marker.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        {/* the light slides across the plate's gold */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(105deg, rgba(255,240,200,0) ${cwLerp(-30, 90, glint) - 12}%, rgba(255,236,190,0.22) ${cwLerp(-30, 90, glint)}%, rgba(255,240,200,0) ${cwLerp(-30, 90, glint) + 12}%)`,
            mixBlendMode: "screen",
          }}
        />
      </div>
      <div style={{ position: "absolute", left: CW_CARD.cx + CW_CARD.w / 2 - 400 + rightGrow, width: 400, top: CW_CARD.cy - CW_CARD.h / 2 - 34 - topGrow + (1 - inK) * 420, textAlign: "right", fontFamily: font, fontSize: 22, fontWeight: 500, color: CW_DIM, opacity: textK }}>
        Crazycat8590, CC0
      </div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: CW_CARD.cy + CW_CARD.h / 2 + 22 + botGrow + (1 - inK) * 420, textAlign: "center", fontFamily: font, fontSize: 32, fontWeight: 500, color: CW_DIM, opacity: textK }}>
        the marker outside the arena today
      </div>
    </div>
  );
};
