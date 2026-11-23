import type { SceneMap } from "../../../src/engine/Stage";
import { scenes as base } from "../../nba-floor/scenes";
import { HookX2 } from "../../nba-floor/scenes/HookX2";

export const scenes: SceneMap = { ...base, hook: HookX2 };
