// wilt-100 "crowd": "Only 4,124 people showed up, about half the building. There were no TV cameras and no New York
// reporters, and the only recording is radio audio of the fourth quarter."
// The first time inside Hershey Sports Arena. The stub goes in at the door and the camera follows it, up to the high
// end view of the 1938 photo: the barrel vault, its ribs and lamps, the banks of wooden seats. The turnstile counter
// rolls to 4,124 and each number is one amber dot sitting down; the empty half outlines grey. Down at the sideline the
// RCA TK-41 stands dead and is struck out, the press table sits covered and empty, and at its end the 1954 Zenith's
// dial glows: its waves climb to the dark far-end scoreboard, where only quarter lamp 4 lights.
// Parts: Kit (times, world, camera), Arena (the canvas world), Props (camera, press row, radio, board), Hud.
import React from "react";
import { useScene } from "../../../src/engine";
import { useCrowdHalfEmptyT, crowdHalfEmptyCam, crowdHalfEmptyProject } from "./CrowdHalfEmptyKit";
import { CrowdHalfEmptyArena } from "./CrowdHalfEmptyArena";
import { CrowdHalfEmptyProps } from "./CrowdHalfEmptyProps";
import { CrowdHalfEmptyHud } from "./CrowdHalfEmptyHud";

const FULL = { position: "absolute" as const, inset: 0 };

export const CrowdHalfEmpty: React.FC = () => {
  const { f, theme } = useScene();
  const T = useCrowdHalfEmptyT();
  const V = crowdHalfEmptyProject(crowdHalfEmptyCam(f, T));
  return (
    <div style={{ ...FULL, overflow: "hidden", background: "#0D1117" }}>
      <CrowdHalfEmptyArena f={f} T={T} V={V} />
      <CrowdHalfEmptyProps f={f} T={T} V={V} font={theme.font} />
      {/* the caption's band and the foot of the frame: the picture runs behind both, dimmed */}
      <div style={{ ...FULL, height: 640, background: "linear-gradient(180deg, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.94) 62%, rgba(13,17,23,0.55) 80%, rgba(13,17,23,0) 100%)" }} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1420, height: 500, background: "linear-gradient(180deg, rgba(13,17,23,0) 0%, rgba(13,17,23,0.8) 40%, rgba(13,17,23,0.97) 70%)" }} />
      <CrowdHalfEmptyHud f={f} T={T} V={V} font={theme.font} />
    </div>
  );
};
