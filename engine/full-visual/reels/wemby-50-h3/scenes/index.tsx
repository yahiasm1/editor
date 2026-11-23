import type { SceneMap } from "../../../src/engine/Stage";
import { scenes as base } from "../../wemby-50/scenes";
import { HookX3 } from "../../wemby-50/scenes/HookX3";

export const scenes: SceneMap = { ...base, hook: HookX3 };
