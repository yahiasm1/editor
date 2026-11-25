import type { SceneMap } from "../../../src/engine/Stage";
import { BackwardsScorebug } from "./BackwardsScorebug";
import { SplitRimCoin } from "./SplitRimCoin";
import { PercentWall } from "./PercentWall";
import { PictureCourt } from "./PictureCourt";
import { ClankSideOn } from "./ClankSideOn";
import { ClownNose } from "./ClownNose";
import { RecordBoxScore } from "./RecordBoxScore";
import { GrannyShot } from "./GrannyShot";
import { PopovichClock } from "./PopovichClock";
import { RulebookAwayFoul } from "./RulebookAwayFoul";
import { CloseTrophies } from "./CloseTrophies";
import { HookX1 } from "./HookX1";

export const scenes: SceneMap = {
  hook: HookX1,
  backwards: BackwardsScorebug,
  split: SplitRimCoin,
  percent: PercentWall,
  picture: PictureCourt,
  clank: ClankSideOn,
  clown: ClownNose,
  record: RecordBoxScore,
  granny: GrannyShot,
  popovich: PopovichClock,
  rule: RulebookAwayFoul,
  close: CloseTrophies,
};
