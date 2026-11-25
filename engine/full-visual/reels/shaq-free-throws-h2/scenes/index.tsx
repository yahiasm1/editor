import type { SceneMap } from "../../../src/engine/Stage";
import { scenes as base } from "../../shaq-free-throws/scenes";
import { HookX2 } from "../../shaq-free-throws/scenes/HookX2";

export const scenes: SceneMap = { ...base, hook: HookX2 };
