import type { SceneMap } from "../../../src/engine/Stage";
import { scenes as base } from "../../wemby-50/scenes";
import { HookX5 } from "../../wemby-50/scenes/HookX5";

export const scenes: SceneMap = { ...base, hook: HookX5 };
