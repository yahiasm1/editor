// wilt-100 "fouls": "Then it got silly. The Knicks started fouling the other Warriors just to keep the ball away from
// him, and the Warriors fouled right back to get it again."
// The camera drops from the stands of amber witnesses to straight down over the 1962 floor of Hershey Sports Arena
// (12 ft keyhole, no three point line, maple boards, the basket on its stanchion, the rink round it). Ten jerseys and
// the two striped officials. On "silly" the official's metal pea whistle swings in big and blows; the Knicks foul the
// guard who is not Wilt ("not Wilt"), he hits a free throw; every pass bends round #13, the old ones left as faint
// curves; then the white jerseys foul back, the ball comes straight back and goes dead straight in to #13. The
// scorer's pencil tallies under the floor run to the box totals, Knicks 32, Warriors 25, landing on "again".
// Parts: Kit (times, camera, people, ball, tallies), Floor (canvas), Whistle, Sheet, Marks.
import React, { useEffect, useState } from "react";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadCourier } from "@remotion/google-fonts/CourierPrime";
import { loadFont as loadKalam } from "@remotion/google-fonts/Kalam";
import { useScene } from "../../../src/engine";
import { fwcArena, fwcCam, fwcClear, fwcOut, fwcLerp, useFoulWarT } from "./FoulWarCourtKit";
import { FoulWarCourtArrival, FoulWarCourtFromQuarters } from "./FoulWarCourtArrival";
import { FoulWarCourtFloor } from "./FoulWarCourtFloor";
import { FoulWarCourtWhistle } from "./FoulWarCourtWhistle";
import { FoulWarCourtSheet } from "./FoulWarCourtSheet";
import { FoulWarCourtMarks } from "./FoulWarCourtMarks";

const OSW = loadOswald("normal", { weights: ["700"], subsets: ["latin"] });
const COU = loadCourier("normal", { weights: ["400", "700"], subsets: ["latin"] });
const KAL = loadKalam("normal", { weights: ["700"], subsets: ["latin"] });

const FULL = { position: "absolute" as const, inset: 0 };

export const FoulWarCourt: React.FC = () => {
  const { f } = useScene();
  // our first frame is quarters' last picture: its camera, its arena, carried over while we drop to the floor
  return <FoulWarCourtFromQuarters f={f}>{(from) => <FoulWarCourtBody from={from} />}</FoulWarCourtFromQuarters>;
};

const FoulWarCourtBody: React.FC<{ from: Parameters<Parameters<typeof FoulWarCourtFromQuarters>[0]["children"]>[0] }> = ({ from }) => {
  const { f, theme } = useScene();
  const T = useFoulWarT();
  const cam = fwcCam(f, T, from?.cam);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    OSW.waitUntilDone().then(() => setReady(true)).catch(() => setReady(true));
  }, []);
  // the foot band settles onto freethrows' own (top 1440, 0 / 0.85 at 35% / 0.98 at 65%) with the camera
  const o = fwcOut(f, T);
  const footTop = fwcLerp(1400, 1440, o), footH = 1920 - footTop;
  const footFoot = `linear-gradient(180deg, rgba(13,17,23,0) 0%, rgba(13,17,23,${fwcLerp(0.88, 0.85, o).toFixed(3)}) ${fwcLerp(14, 35, o).toFixed(1)}%, rgba(13,17,23,0.98) ${fwcLerp(40, 65, o).toFixed(1)}%)`;
  return (
    <div style={{ ...FULL, overflow: "hidden", background: "#0D1117" }}>
      <FoulWarCourtFloor f={f} T={T} cam={cam} fontReady={ready} numFont={`${OSW.fontFamily}, sans-serif`} bridged={!!from} />
      <div style={{ ...FULL, opacity: fwcClear(f, T) }}>
        <FoulWarCourtMarks f={f} T={T} cam={cam} font={theme.font.ui} />
      </div>
      {/* the caption's band and the foot of the frame: the picture runs behind both, dimmed */}
      <div style={{ ...FULL, height: 600, background: "linear-gradient(180deg, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.93) 66%, rgba(13,17,23,0.5) 84%, rgba(13,17,23,0) 100%)" }} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: footTop, height: footH, background: footFoot }} />
      {from && <FoulWarCourtArrival f={f} cam={cam} qT={from.T} q={from.q} a={fwcArena(f, T)} font={theme.font.ui} />}
      {/* the sheet and the whistle clear with the people in the handover */}
      <div style={{ ...FULL, opacity: fwcClear(f, T) }}>
        <FoulWarCourtSheet f={f} T={T} courier={COU.fontFamily} oswald={OSW.fontFamily} kalam={KAL.fontFamily} />
        <FoulWarCourtWhistle f={f} T={T} />
      </div>
    </div>
  );
};
