import type { SceneMap } from "../../../src/engine/Stage";
import { scenes as base } from "../../wemby-50/scenes";
import { HookX4 } from "../../wemby-50/scenes/HookX4";

export const scenes: SceneMap = { ...base, hook: HookX4 };
