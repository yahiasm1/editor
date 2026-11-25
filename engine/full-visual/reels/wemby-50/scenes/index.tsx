import type { SceneMap } from "../../../src/engine/Stage";
import { HookX1 } from "./HookX1";
import { PlayByPlayLog } from "./PlayByPlayLog";
import { PhoneBoxScore } from "./PhoneBoxScore";
import { PossessionAtRim } from "./PossessionAtRim";
import { FreeThrowWedges } from "./FreeThrowWedges";
import { ChanceColumn } from "./ChanceColumn";
import { TrueShootingDisc } from "./TrueShootingDisc";
import { LeagueRateRefill } from "./LeagueRateRefill";
import { FourteenExtra } from "./FourteenExtra";
import { ShotChartHero } from "./ShotChartHero";
import { TwentyNineResolved } from "./TwentyNineResolved";
import { FollowAndSend } from "./FollowAndSend";

export const scenes: SceneMap = {
  hook: HookX1,
  answer: PlayByPlayLog,
  boxscore: PhoneBoxScore,
  cost: PossessionAtRim,
  freethrow: FreeThrowWedges,
  attempts: ChanceColumn,
  trueshooting: TrueShootingDisc,
  average: LeagueRateRefill,
  extra: FourteenExtra,
  where: ShotChartHero,
  close: TwentyNineResolved,
  cta: FollowAndSend,
};
