// wilt-100 "close" (76.28-79.80 s): "So yes, the greatest scoring night ever, and almost nobody saw it."
// The real historical marker outside the arena today (photo card); the camera pushes past it to the hook's frame, the
// vault at night with the counter at 100; the roof opens rib by rib and only the witnesses glow amber, one per beat:
// the 4,124 in the seats, the radio, the flashbulb, the ball. Then the camera rises over Chocolate Avenue while the
// town goes dark, to the Pennsylvania map, where the whole night is one tiny amber point under the 100.
// Parts: Kit (times, arena, camera, map data), Marker (photo card), World (canvas), Map (svg), Hud (counter, labels).
import React from "react";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { ease, prog, useScene } from "../../../src/engine";
import { CloseWitnessesCounter, CloseWitnessesLabels } from "./CloseWitnessesHud";
import { useCloseWitnessesT, cwView } from "./CloseWitnessesKit";
import { CloseWitnessesMap } from "./CloseWitnessesMap";
import { CloseWitnessesMarker } from "./CloseWitnessesMarker";
import { CloseWitnessesWorld } from "./CloseWitnessesWorld";

const CW_OSWALD = loadOswald("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily;
const STAGE_MASK = "linear-gradient(to bottom, transparent 0, transparent 506px, #000 566px, #000 1420px, transparent 1480px)";

export const CloseWitnesses: React.FC = () => {
  const { f, theme } = useScene();
  const T = useCloseWitnessesT();
  const V = cwView(f, T);
  // the night arrives behind the marker as the camera pushes past it
  const showK = prog(f, T.greatest - 4, 14, ease.out);
  const ui = theme.font.ui;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: STAGE_MASK, maskImage: STAGE_MASK }}>
        <CloseWitnessesWorld f={f} T={T} showK={showK} />
        <CloseWitnessesMap f={f} T={T} V={V} font={ui} />
      </div>
      <CloseWitnessesLabels f={f} T={T} V={V} font={ui} />
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: STAGE_MASK, maskImage: STAGE_MASK }}>
        <CloseWitnessesMarker f={f} T={T} font={ui} />
      </div>
      <CloseWitnessesCounter f={f} T={T} font={CW_OSWALD} />
    </div>
  );
};
