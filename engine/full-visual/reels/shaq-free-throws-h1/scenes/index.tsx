import type { SceneMap } from "../../../src/engine/Stage";
import { scenes as base } from "../../shaq-free-throws/scenes";
import { HookX1 } from "../../shaq-free-throws/scenes/HookX1";

export const scenes: SceneMap = { ...base, hook: HookX1 };
