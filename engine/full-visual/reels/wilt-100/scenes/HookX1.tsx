// wilt-100 hook, variant X1, "the night the windows went out": "Wilt Chamberlain scored 100 points in one NBA game,
// and almost nobody saw it." One hero: Hershey Sports Arena from outside at night, the Beato aerial's angle (the
// frame `close` returns to). Frame 0 is already full: every window and dormer lit warm, a real Kiss streetlamp near,
// Wilt's yearbook card rising behind the roof, the flip panel on the end arch clacking 0, 23, 41, 69.
// Wilt: the card rises. Chamberlain: it stands to full height, taller than the roof. scored: the flaps race, each
// clack shakes dust off the ribs. 100: the last flap slams, the roof shivers. one: the town around goes dark, the
// camera eases back to close's frame. game: the vault holds, every window lit, people passing behind them.
// nobody: the windows switch off rib by rib, far arch to near end (filaments, not a fade), the dormers, then the
// Kiss lamp flickers twice and dies; the roof sinks under the dark; four small amber points survive. saw: Wilt tips
// back into the dark and the 100 lifts off the arch to the top centre, where `hershey` picks it up (keep = true).
// Parts: Kit (times, arena, camera, counter, lights), World (two canvases), Panel (the flaps), Props (card, lamp).
import React from "react";
import { useScene } from "../../../src/engine";
import { HX1_A, hx1Fade, hx1Filament, hx1Lerp, hx1OffAt, hx1View, useHookX1T } from "./HookX1Kit";
import { HookX1World } from "./HookX1World";
import { HookX1Panel } from "./HookX1Panel";
import { HookX1Card, HookX1Lamp } from "./HookX1Props";

const STAGE_MASK = "linear-gradient(to bottom, transparent 0, transparent 506px, #000 566px, #000 1420px, transparent 1480px)";

export const HookX1: React.FC & { keep?: boolean } = () => {
  const { f, theme } = useScene();
  const T = useHookX1T();
  const V = hx1View(f, T);
  const fade = hx1Fade(f, T);
  // how much of the building is still lit, for what it lights around it
  let warm = 0;
  for (let k = 0; k < 10; k++) warm += hx1Filament(f, hx1OffAt(T, hx1Lerp(HX1_A.zFar, HX1_A.zNear, (k + 0.5) / 10), 0.5)).b / 10;
  // the lamp is near: it drifts a little more than the building as the camera eases back
  const lampS = hx1Lerp(1.08, 1, Math.min(1, f / (T.nobody + 30)));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: STAGE_MASK, maskImage: STAGE_MASK }}>
        <HookX1World f={f} T={T} V={V} layer="back" />
        <div style={{ position: "absolute", inset: 0, opacity: fade }}>
          <HookX1Card f={f} T={T} font={theme.font.ui} warm={Math.min(1, warm)} />
        </div>
        <HookX1World f={f} T={T} V={V} layer="front" />
        <div style={{ position: "absolute", inset: 0, opacity: fade }}>
          <HookX1Lamp f={f} T={T} x={hx1Lerp(150, 168, Math.min(1, f / (T.nobody + 30)))} y={hx1Lerp(1338, 1300, Math.min(1, f / (T.nobody + 30)))} s={lampS} warm={Math.min(1, warm)} />
        </div>
      </div>
      <HookX1Panel f={f} T={T} V={V} />
    </div>
  );
};
HookX1.keep = true;
