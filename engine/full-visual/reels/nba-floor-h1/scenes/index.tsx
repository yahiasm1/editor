import type { SceneMap } from "../../../src/engine/Stage";
import { scenes as base } from "../../nba-floor/scenes";
import { HookX1 } from "../../nba-floor/scenes/HookX1";

export const scenes: SceneMap = { ...base, hook: HookX1 };
