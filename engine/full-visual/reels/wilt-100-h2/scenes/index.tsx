import type { SceneMap } from "../../../src/engine/Stage";
import { scenes as base } from "../../wilt-100/scenes";
import { HookX2 } from "../../wilt-100/scenes/HookX2";

export const scenes: SceneMap = { ...base, hook: HookX2 };
