import type { SceneMap } from "../../../src/engine/Stage";
import { scenes as base } from "../../wemby-50/scenes";
import { HookX2 } from "../../wemby-50/scenes/HookX2";

export const scenes: SceneMap = { ...base, hook: HookX2 };
