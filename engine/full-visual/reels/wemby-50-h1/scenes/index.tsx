import type { SceneMap } from "../../../src/engine/Stage";
import { scenes as base } from "../../wemby-50/scenes";
import { HookX1 } from "../../wemby-50/scenes/HookX1";

export const scenes: SceneMap = { ...base, hook: HookX1 };
