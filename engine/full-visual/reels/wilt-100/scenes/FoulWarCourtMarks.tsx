// wilt-100 "fouls": the two labels the picture needs. "Wilt" with a hairline beside #13 from the moment he posts up,
// and on "other" a white hairline loop drawn round the guard the Knicks just fouled, "not Wilt" beside it. Plain grey
// type, 34 px, a hairline; nothing else is written on the floor.
import React from "react";
import { draw, ease, prog } from "../../../src/engine";
import { type FoulWarT, type FwcCam, fwcPeople, fwcProject } from "./FoulWarCourtKit";

export const FoulWarCourtMarks: React.FC<{ f: number; T: FoulWarT; cam: FwcCam; font: string }> = ({ f, T, cam, font }) => {
  const P = fwcPeople(f, T);
  const w = fwcProject(cam, P.W13[0], 6, P.W13[1]);
  const wiltA = prog(f, T.knicks, 10, ease.out);
  // the label sits on the side of #13 away from the lane's crowd, to the right
  const lx = w.x + 3.4 * w.s, ly = w.y + 1.2 * w.s;
  const g = fwcProject(cam, P.G2[0], 6, P.G2[1]);
  const loopR = 3.7 * g.s;
  const loopA = 1 - prog(f, T.ftIn - 4, 12, ease.in);
  const loopIn = prog(f, T.other - 3, 10, ease.out);
  const circ = `M ${g.x} ${g.y - loopR} a ${loopR} ${loopR} 0 1 1 -0.01 0`;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      {wiltA > 0 && (
        <g opacity={wiltA}>
          <line x1={w.x + 2.6 * w.s} y1={w.y} x2={lx + 8} y2={ly - 10} stroke="#F4F2EC" strokeOpacity={0.8} strokeWidth={1.5} />
          <text x={lx + 14} y={ly} fontFamily={font} fontWeight={600} fontSize={34} fill="#F4F2EC" stroke="rgba(13,17,23,0.8)" strokeWidth={6} paintOrder="stroke">Wilt</text>
        </g>
      )}
      {loopIn > 0 && loopA > 0 && (
        <g opacity={loopA}>
          <path d={circ} fill="none" stroke="#FFFFFF" strokeOpacity={0.9} strokeWidth={2.5} {...draw(f, T.other - 3, 12)} />
          <line x1={g.x + loopR * 0.71} y1={g.y - loopR * 0.71} x2={g.x + loopR * 0.71 + 30} y2={g.y - loopR * 0.71 - 30} stroke="#F4F2EC" strokeOpacity={0.8} strokeWidth={1.5} opacity={loopIn} />
          <text x={g.x + loopR * 0.71 + 36} y={g.y - loopR * 0.71 - 34} fontFamily={font} fontWeight={600} fontSize={34} fill="#F4F2EC" stroke="rgba(13,17,23,0.8)" strokeWidth={6} paintOrder="stroke" opacity={loopIn}>not Wilt</text>
        </g>
      )}
    </svg>
  );
};
