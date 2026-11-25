// wilt-100 "record": "So how does a guy score 100? That season Wilt averaged 50.4 points a game, which is still the
// record."
// Hand scale. Wilt's photo card rises big; on "score" the WILT flip counter drops in and runs to 100, locks with a
// bounce on "100?", then runs back to 0. The card moves to the left third and his real Basketball-Reference 1961-62
// game log slides in and types down, 80 rows, with the real season average rolling under the photo with every game
// (row 76's PTS stays under a cream slip). Row 80 lands, the average stops on 50.4 and grows big beside the photo,
// the page sinks back, and a record-book slip types "Most points per game, season: 50.4, Wilt Chamberlain, 1961-62".
// Parts: Kit (times, data), Counter, Page, Parts (photo, average, slip).
import React from "react";
import { blurIn, useScene } from "../../../src/engine";
import { useRecordT, RGL_DIM } from "./RecordGameLogKit";
import { RecordGameLogCounter } from "./RecordGameLogCounter";
import { RecordGameLogPage, useRecordGameLogFont } from "./RecordGameLogPage";
import { RecordGameLogAverage, RecordGameLogPhoto, RecordGameLogSlip } from "./RecordGameLogParts";

export const RecordGameLog: React.FC = () => {
  const { f, fps, theme } = useScene();
  useRecordGameLogFont();
  const T = useRecordT();
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <RecordGameLogPage f={f} T={T} />
      {/* the average (and the scrim behind its landed 50.4) sits under the photo, so the scrim never darkens Wilt */}
      <RecordGameLogAverage f={f} T={T} font={theme.font} />
      <RecordGameLogPhoto f={f} T={T} font={theme.font} />
      <RecordGameLogSlip f={f} T={T} fps={fps} />
      <RecordGameLogCounter f={f} T={T} font={theme.font.ui} />
      <div style={{ ...blurIn(f, T.that, { dur: 8 }), position: "absolute", left: 90, top: 1376, fontFamily: theme.font.ui, fontSize: 26, lineHeight: "34px", color: RGL_DIM }}>
        Basketball-Reference
        <br />
        game log 1961-62
      </div>
    </div>
  );
};
