import type { SceneMap } from "../../../src/engine/Stage";
import { scenes as base } from "../../kobe-81/scenes";
import { HookX1 } from "../../kobe-81/scenes/HookX1";

export const scenes: SceneMap = { ...base, hook: HookX1 };
