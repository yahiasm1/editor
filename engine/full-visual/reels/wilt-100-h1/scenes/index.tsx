import type { SceneMap } from "../../../src/engine/Stage";
import { scenes as base } from "../../wilt-100/scenes";
import { HookX1 } from "../../wilt-100/scenes/HookX1";

export const scenes: SceneMap = { ...base, hook: HookX1 };
