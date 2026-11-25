import type { SceneMap } from "../../../src/engine/Stage";
import { scenes as base } from "../../kobe-81/scenes";
import { HookX2 } from "../../kobe-81/scenes/HookX2";

export const scenes: SceneMap = { ...base, hook: HookX2 };
