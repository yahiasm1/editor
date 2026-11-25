// wilt-100 "quarters": "That night he had 23 after one quarter, 41 at the half, and 69 after three. By then the crowd
// was chanting 'Give it to Wilt!'"
// Back in Hershey Sports Arena, up the far end wall to its scoreboard, close: the real period bulb board, riveted,
// on its chains, with the WILT 13 flip panel docked in it. Row 76 of the game log tears off and flies up (that night);
// the counter docks; on 23, 41 and 69 its flaps clack up while the line score lights bulb by bulb and the quarter lamps
// come on; on 69 the cabinet swings. Then the camera pulls back and down: the 4,124 amber witnesses chant, a wave rolls
// down the banks and back, three pulses go through them, and on "Wilt!" every one of them leans toward the floor.
// Parts: Kit (times, world, camera, flaps), Arena (canvas), Board (svg), Handoff (strip, counter in flight).
import React from "react";
import { useScene } from "../../../src/engine";
import { qsCam, qsProject, qsSwing, useQuartersT } from "./QuartersScoreboardKit";
import { QuartersScoreboardArena } from "./QuartersScoreboardArena";
import { QuartersScoreboardBoard, qsBoardGlow, qsPanelOnScreen } from "./QuartersScoreboardBoard";
import { QuartersScoreboardCounter, QuartersScoreboardStrip, qsDockK, useQuartersFont } from "./QuartersScoreboardHandoff";

const FULL = { position: "absolute" as const, inset: 0 };

export const QuartersScoreboard: React.FC = () => {
  const { f, theme } = useScene();
  useQuartersFont();
  const T = useQuartersT();
  const V = qsProject(qsCam(f, T));
  const swing = qsSwing(f, T);
  const glow = qsBoardGlow(f, T);
  const docked = qsDockK(f, T) >= 0.999;
  return (
    <div style={{ ...FULL, overflow: "hidden", background: "#0D1117" }}>
      <QuartersScoreboardArena f={f} T={T} V={V} boardGlow={glow} />
      <QuartersScoreboardBoard f={f} T={T} V={V} swing={swing} font={theme.font.ui} flapsShown={docked} />
      {/* the caption's band and the foot of the frame: the picture runs behind both, dimmed */}
      <div style={{ ...FULL, height: 640, background: "linear-gradient(180deg, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.94) 62%, rgba(13,17,23,0.55) 80%, rgba(13,17,23,0) 100%)" }} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1420, height: 500, background: "linear-gradient(180deg, rgba(13,17,23,0) 0%, rgba(13,17,23,0.8) 40%, rgba(13,17,23,0.97) 70%)" }} />
      <QuartersScoreboardStrip f={f} T={T} />
      <QuartersScoreboardCounter f={f} T={T} to={qsPanelOnScreen(V, swing)} font={theme.font.ui} />
    </div>
  );
};
