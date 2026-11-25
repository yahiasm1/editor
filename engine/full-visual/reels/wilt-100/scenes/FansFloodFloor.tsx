// wilt-100 "flood": "When the 100th point went in, fans poured onto the court, and the Warriors won 169 to 147."
// Back at the end wall of Hershey Sports Arena: the bulb scoreboard of `quarters`, its WILT flaps falling 98, 99, 100
// with the heaviest flip of the reel, the 4th column lighting 44 / 41. The camera flies back down the vault to the high
// end view and the reel's big move happens: all 4,124 amber witnesses stand up and run, each its own way, down the stair
// aisles, over the boards and out across the floor round the players. Then down among them, looking up at the board,
// the totals light at last: 169, then 147, with the box score's source line.
// Parts: Kit (times, world, seats, runners, camera, flaps), Arena (canvas: building, seats, people), Board (svg).
import React from "react";
import { blurIn, ease, prog, useScene } from "../../../src/engine";
import { FF_LABEL, ffBoardPt, ffCam, ffProject, ffSwing, useFloodT } from "./FansFloodFloorKit";
import { FansFloodFloorArena } from "./FansFloodFloorArena";
import { FansFloodFloorBoard, ffBoardGlow } from "./FansFloodFloorBoard";

const FULL = { position: "absolute" as const, inset: 0 };

export const FansFloodFloor: React.FC = () => {
  const { f, theme } = useScene();
  const T = useFloodT();
  const V = ffProject(ffCam(f, T));
  const swing = ffSwing(f, T);
  const glow = ffBoardGlow(f, T);
  // the source sits on the dark end wall right under the board it reads from
  const srcY = V.P(ffBoardPt(500, 760, 0)).y + 26;
  // the way in: mounted on top of `freethrows`, the arena rises over it from below as one move in the silence
  // (an opaque scene that simply appears at its mount frame is a one-frame cut)
  const ip = prog(f, T.born, 13, ease.out), iq = prog(f - 1, T.born, 13, ease.out);
  const inY = (1 - ip) * 1920;
  const inSmear = Math.min(30, (ip - iq) * 1920 * 0.12);
  return (
    <div style={{ ...FULL, overflow: "hidden", background: "#0D1117", transform: inY > 0.5 ? `translateY(${inY.toFixed(1)}px)` : undefined, filter: inSmear > 0.5 ? `blur(${(inSmear * 0.35).toFixed(1)}px)` : undefined }}>
      <FansFloodFloorArena f={f} T={T} V={V} boardGlow={glow} />
      <FansFloodFloorBoard f={f} T={T} V={V} swing={swing} font={theme.font.ui} />
      {/* the caption's band and the foot of the frame: the picture runs behind both, dimmed */}
      <div style={{ ...FULL, height: 640, background: "linear-gradient(180deg, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.94) 62%, rgba(13,17,23,0.55) 80%, rgba(13,17,23,0) 100%)" }} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1420, height: 500, background: "linear-gradient(180deg, rgba(13,17,23,0) 0%, rgba(13,17,23,0.8) 40%, rgba(13,17,23,0.97) 70%)" }} />
      {/* the source of the score */}
      <div style={{ position: "absolute", left: 0, width: 1080, textAlign: "center" as const, top: srcY, fontFamily: theme.font.ui, fontSize: 26, color: FF_LABEL, letterSpacing: 0.2, textShadow: "0 1px 6px rgba(13,17,23,0.95)", ...blurIn(f, T.n147 + 4, { dur: 9 }) }}>
        Basketball-Reference box score, Hershey Sports Arena, attendance 4,124
      </div>
    </div>
  );
};
