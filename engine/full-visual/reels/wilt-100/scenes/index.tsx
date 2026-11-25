import type { SceneMap } from "../../../src/engine/Stage";
import { HersheyTicketMap } from "./HersheyTicketMap";
import { CrowdHalfEmpty } from "./CrowdHalfEmpty";
import { RecordGameLog } from "./RecordGameLog";
import { QuartersScoreboard } from "./QuartersScoreboard";
import { FoulWarCourt } from "./FoulWarCourt";
import { FreeThrowTally } from "./FreeThrowTally";
import { FansFloodFloor } from "./FansFloodFloor";
import { PhotoDeveloping } from "./PhotoDeveloping";
import { BallToAuction } from "./BallToAuction";
import { CloseWitnesses } from "./CloseWitnesses";
import { CtaKobeVsWilt } from "./CtaKobeVsWilt";
import { HookX1 } from "./HookX1";

export const scenes: SceneMap = {
  hershey: HersheyTicketMap,
  crowd: CrowdHalfEmpty,
  record: RecordGameLog,
  quarters: QuartersScoreboard,
  fouls: FoulWarCourt,
  freethrows: FreeThrowTally,
  flood: FansFloodFloor,
  photo: PhotoDeveloping,
  ball: BallToAuction,
  close: CloseWitnesses,
  cta: CtaKobeVsWilt,
  hook: HookX1,
};
