// wilt-100 "fouls": the way in from `quarters`. Quarters ends low behind the near baseline of the same arena, its
// banks of amber witnesses chanting under the lamps and the scoreboard. Our first frame is that picture: the camera
// starts on quarters' own camera (same world, converted to our feet) and the arena it drew stays drawn, from our moving
// camera, while we drop to straight down over Wilt's half; it thins out as the lens climbs past the banks, and our floor
// with the ten jerseys is what is left. Only quarters' exported pieces are used here (its kit, arena and board); none
// of its files change.
import React from "react";
import { SceneContext, useReel } from "../../../src/engine/context";
import type { Scene } from "../../../src/engine/timeline";
import { type QsCam, type QuartersT, qsCam, qsProject, qsSwing, useQuartersT } from "./QuartersScoreboardKit";
import { QuartersScoreboardArena } from "./QuartersScoreboardArena";
import { QuartersScoreboardBoard, qsBoardGlow } from "./QuartersScoreboardBoard";
import { type FwcCam, fwcToQs } from "./FoulWarCourtKit";

const FULL = { position: "absolute" as const, inset: 0 };

/** quarters' times, read under quarters' own scene, then our scene again for the children */
const Bridge: React.FC<{ us: Scene; children: (qT: QuartersT) => React.ReactNode }> = ({ us, children }) => {
  const qT = useQuartersT();
  return <SceneContext.Provider value={us}>{children(qT)}</SceneContext.Provider>;
};

/** runs `children` with quarters' camera on frame f (null when the reel has no `quarters` right before us) */
export const FoulWarCourtFromQuarters: React.FC<{ f: number; children: (from: { cam: QsCam; T: QuartersT; q: Scene } | null) => React.ReactNode }> = ({ f, children }) => {
  const { tl } = useReel();
  const us = React.useContext(SceneContext);
  const q = us ? tl.scenes.find((s) => s.id === "quarters" && s.index === us.index - 1) : undefined;
  if (!us || !q) return <>{children(null)}</>;
  return (
    <SceneContext.Provider value={q}>
      <Bridge us={us}>{(qT) => children({ cam: qsCam(f, qT), T: qT, q })}</Bridge>
    </SceneContext.Provider>
  );
};

/** quarters' arena and board drawn from our camera, with quarters' own caption bands, at `a` */
export const FoulWarCourtArrival: React.FC<{ f: number; cam: FwcCam; qT: QuartersT; q: Scene; a: number; font: string }> = ({ f, cam, qT, q, a, font }) => {
  if (a <= 0.003) return null;
  const V = qsProject(fwcToQs(cam));
  const swing = qsSwing(f, qT);
  const glow = qsBoardGlow(f, qT);
  return (
    <SceneContext.Provider value={q}>
      <div style={{ ...FULL, overflow: "hidden", background: "#0D1117", opacity: a }}>
        <QuartersScoreboardArena f={f} T={qT} V={V} boardGlow={glow} />
        <QuartersScoreboardBoard f={f} T={qT} V={V} swing={swing} font={font} flapsShown />
        {/* quarters' caption band and foot, as it drew them */}
        <div style={{ ...FULL, height: 640, background: "linear-gradient(180deg, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.94) 62%, rgba(13,17,23,0.55) 80%, rgba(13,17,23,0) 100%)" }} />
        <div style={{ position: "absolute", left: 0, width: 1080, top: 1420, height: 500, background: "linear-gradient(180deg, rgba(13,17,23,0) 0%, rgba(13,17,23,0.8) 40%, rgba(13,17,23,0.97) 70%)" }} />
      </div>
    </SceneContext.Provider>
  );
};
