// wilt-100 "freethrows": "And the wildest part? Wilt was known as a terrible free throw shooter, and that night he made
// 28 of 32. Other players couldn't believe it."
// From straight above the court (where `fouls` ends) the camera cranes down into the lane, low behind the free throw
// line; an underhand ball arcs up and drops through on "part?". The camera backs off, the basket rides to the top of
// the stage, and the scorer's cream strip slides in: "13 CHAMBERLAIN", his season .613 underlined in red on
// "terrible", a clang off the rim on "shooter". It unrolls 32 boxes; balls rain through the rim above and every one
// inks a pencil check, the big white count landing on 28, then four rattle out (x's), "/ 32", and .875 types under
// .613. The strip eases up, Johnny Kerr's line types under it, and on "believe" the 28 boxes flash together.
// Parts: Kit (times, camera, ball paths), Court (canvas), Sheet (strip, count, quote).
import React, { useMemo } from "react";
import { ease, prog, useScene } from "../../../src/engine";
import { fttShots, useFreeThrowT } from "./FreeThrowTallyKit";
import { FreeThrowTallyCourt } from "./FreeThrowTallyCourt";
import { FreeThrowTallyQuote, FreeThrowTallySheet } from "./FreeThrowTallySheet";

const FULL = { position: "absolute" as const, inset: 0 };

export const FreeThrowTally: React.FC = () => {
  const { f, theme } = useScene();
  const T = useFreeThrowT();
  const shots = useMemo(() => fttShots(T), [T.part]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div style={{ ...FULL, overflow: "hidden", background: "#0B0E13" }}>
      <FreeThrowTallyCourt f={f} T={T} shots={shots} />
      {/* the caption's band and the foot of the frame: the picture runs behind both, dimmed */}
      <div style={{ ...FULL, height: 600, background: "linear-gradient(180deg, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.93) 66%, rgba(13,17,23,0.5) 84%, rgba(13,17,23,0) 100%)" }} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1440, height: 480, background: "linear-gradient(180deg, rgba(13,17,23,0) 0%, rgba(13,17,23,0.85) 35%, rgba(13,17,23,0.98) 65%)" }} />
      {/* once the strip lifts, the floor goes down a stop so the quote reads on the dark */}
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1080, height: 840, opacity: prog(f, T.lift, 22, ease.inOut), background: "linear-gradient(180deg, rgba(11,14,19,0) 0%, rgba(11,14,19,0.82) 18%, rgba(11,14,19,0.9) 100%)" }} />
      <FreeThrowTallySheet f={f} T={T} ui={theme.font.ui} />
      <FreeThrowTallyQuote f={f} T={T} ui={theme.font.ui} />
    </div>
  );
};
