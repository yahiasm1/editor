import type { SceneMap } from "../../../src/engine/Stage";
import { PaintedKink } from "./PaintedKink";
import { CornerSwing } from "./CornerSwing";
import { FiftyFeetWide } from "./FiftyFeetWide";
import { RulebookArc } from "./RulebookArc";
import { LeagueTable } from "./LeagueTable";
import { PointsPerShot } from "./PointsPerShot";
import { StepBack } from "./StepBack";
import { LongTwoFades } from "./LongTwoFades";
import { ShortestThree } from "./ShortestThree";
import { CornerWatch } from "./CornerWatch";
import { HookX1 } from "./HookX1";

export const scenes: SceneMap = {
  answer: PaintedKink,
  corner: CornerSwing,
  width: FiftyFeetWide,
  arc: RulebookArc,
  percent: LeagueTable,
  points: PointsPerShot,
  worth: StepBack,
  history: LongTwoFades,
  close: ShortestThree,
  cta: CornerWatch,
  hook: HookX1,
};
