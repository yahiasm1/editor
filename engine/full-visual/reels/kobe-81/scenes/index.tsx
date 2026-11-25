import type { SceneMap } from "../../../src/engine/Stage";
import { StaplesNight } from "./StaplesNight";
import { StartingFiveSpotlights } from "./StartingFiveSpotlights";
import { HalftimeBoos } from "./HalftimeBoos";
import { DeficitFlowChart } from "./DeficitFlowChart";
import { ThirdQuarterCourt } from "./ThirdQuarterCourt";
import { OneAgainstFive } from "./OneAgainstFive";
import { EightyOneBoxRow } from "./EightyOneBoxRow";
import { AllTimeList } from "./AllTimeList";
import { DallasBench } from "./DallasBench";
import { CloseNightResolved } from "./CloseNightResolved";
import { HookX1 } from "./HookX1";

export const scenes: SceneMap = {
  night: StaplesNight,
  starters: StartingFiveSpotlights,
  halftime: HalftimeBoos,
  deficit: DeficitFlowChart,
  takeover: ThirdQuarterCourt,
  secondhalf: OneAgainstFive,
  eightyone: EightyOneBoxRow,
  alltime: AllTimeList,
  dallas: DallasBench,
  close: CloseNightResolved,
  hook: HookX1,
};
