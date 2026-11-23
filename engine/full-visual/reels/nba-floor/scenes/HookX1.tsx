// hook, variant X1, "The tape reels in": "The NBA three-point line isn't the same distance everywhere. In the corners,
// it's almost two feet closer." One hero, the Lufkin steel tape hooked over a pin at the middle of the basket, doing
// the claim live in one continuous measurement on the real Rule 1 half court.
// Frame 0: the lit half court (ARC FRAME), the tape racing up the middle, the window rolling to 23'9", the slack
// blade going taut over a gold glow; a faint 22' tick flashes on the right corner line and is gone. NBA: the Logoman
// is stamped on the apron. three-point: a light runs the painted line corner to corner. line: the blade twangs, one
// click. same: the window locks 23'9", the white reading floats above the arc. distance: the gold brightens, the
// ghost circle of 23'9" draws itself out from the tip. everywhere: the tape swings like a compass down to the right
// corner; past the kink the paint goes straight and the tip keeps going: a gap opens. corners: the camera dives to the
// CORNER FRAME. almost: the crank turns. two: the gold sliver opens, "21 in". feet: the inches click past, the case
// creeps in. closer: the BIG MOVE, the case is reeled hard onto the painted line, slams, dust, the blade wobbles;
// 22'0" lands and the reading turns gold. A 0.3 s hold, then the blade goes home, the case is lifted away and the
// camera rises to the ARC FRAME: `answer`'s first frame (keep = true). Notes: reels/nba-floor/notes/HookX1.md
import React from "react";
import { blurIn, ease, prog, useScene } from "../../../src/engine";
import { PaintedKinkFloor } from "./PaintedKinkFloor";
import { PK_KINK_Y, paintedKinkProject as proj } from "./PaintedKinkWorld";
import {
  HX1_CORNER, hookX1Camera, hookX1Dive, hookX1Light, hookX1Reading, hookX1Tape, hx1Lerp, useHookX1T,
} from "./HookX1Kit";
import { HookX1Tape, HookX1Window, hookX1CaseAt } from "./HookX1Tape";
import { HookX1Dim, HookX1Dust, HookX1Grain, HookX1Paint, HookX1Foretell, HookX1Ghost, HookX1LineLight, HookX1Logoman, HookX1MarkDefs, HookX1Sliver } from "./HookX1Marks";

const GOLD = "#F2B33D";
const MASK = "linear-gradient(to bottom, transparent 0, transparent 520px, #000 640px, #000 1540px, transparent 1700px)";

/** the kink blinks as the tip sweeps past it: here the paint stops following the circle */
const HookX1KinkBlip: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  if (t < 0 || t > 22) return null;
  const k = t / 22;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <circle cx={x} cy={y} r={8 + 34 * k} fill="none" stroke="#FFFFFF" strokeOpacity={0.8 * (1 - k)} strokeWidth={3} />
      <circle cx={x} cy={y} r={6} fill="#FFFFFF" opacity={1 - k} />
    </svg>
  );
};

export const HookX1: React.FC & { keep?: boolean } = () => {
  const { f } = useScene();
  const T = useHookX1T();
  const cam = hookX1Camera(f, T);
  const tape = hookX1Tape(f, T);
  const dive = hookX1Dive(f, T);
  const light = hookX1Light(f, T);
  const outO = 1 - prog(f, T.out + 1, 11, ease.in); // everything the hook added leaves on the rise

  // the case hovers over the ghost circle while the corner holds, sits down as it creeps in
  const hover = prog(f, T.corners - 4, 12) * (1 - prog(f, T.feet - 2, 8)) * (0.55 + 0.45 * Math.sin((f - T.corners) / 8));
  const { R: caseR } = hookX1CaseAt(cam, tape);

  // the reading window: top right over the floor (the swing passes under it), then left of the case in the corner
  const winX = hx1Lerp(860, 300, dive), winY = hx1Lerp(672, 1110, dive);
  const lock = prog(f, T.same - 2, 6, ease.back);
  const lockFlash = f >= T.same ? Math.exp(-(f - T.same) / 6) : 0;
  const slamFlash = f >= T.slam ? Math.exp(-(f - T.slam) / 6) : 0;
  const shown = f >= T.slam ? Math.max(HX1_CORNER, tape.r) : tape.r;

  // the white reading over the arc: "same"; it rides into the corner with the dive; turns gold as 22'0" lands
  const rd = hookX1Reading(shown);
  const readA = prog(f, T.same - 1, 8);
  const toGold = prog(f, T.slam, 7, ease.out);
  const readX = hx1Lerp(290, 300, dive), readY = hx1Lerp(690, 760, dive);
  const readPop = f >= T.slam ? 1 + 0.12 * Math.exp(-(f - T.slam) / 5) * Math.cos((f - T.slam) / 2) : 1;

  // the tip passing the kink on the swing
  const kinkAt = T.every - 4 + Math.round(25 * 0.52); // the swing's ease crosses the kink angle about here
  const kp = proj(cam, HX1_CORNER, PK_KINK_Y, 0);

  // a little blur on the floor only while the camera flies
  const fly = Math.min(3.2, Math.max(0, cam.speed - 6) * 0.03);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: MASK, filter: fly > 0.3 ? `blur(${fly.toFixed(2)}px)` : undefined }}>
        <PaintedKinkFloor cam={cam} f={f} paint={{ run: 0, wet: 0 }} light={light} side={0} push={0} />
        <HookX1Logoman cam={cam} f={f} at={T.nba} o={1 - prog(f, T.corners - 30, 10)} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <HookX1Grain cam={cam} o={0.55 * prog(dive, 0.82, 0.18, ease.linear) * (1 - prog(f, T.out, 4, ease.linear))} />
        </svg>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <HookX1MarkDefs />
          <HookX1Paint cam={cam} o={prog(f, T.corners - 30, 24) * outO} />
          <HookX1LineLight cam={cam} f={f} at={T.three} />
          <HookX1Foretell cam={cam} f={f} />
          <HookX1Sliver cam={cam} f={f} at={T.two} o={outO} flare={slamFlash} />
          <HookX1Ghost cam={cam} f={f} at={T.distance} o={outO} pulse={f >= T.corners + 24 ? Math.exp(-(f - T.corners - 24) / 10) : 0} />
        </svg>
        {kp.ok && <HookX1KinkBlip x={kp.x} y={kp.y} t={f - kinkAt} />}
        <HookX1Tape cam={cam} s={tape} f={f} hover={hover} sweep={(f % 300) / 300} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <HookX1MarkDefs />
          <HookX1Dust cam={cam} f={f} at={T.slam} x={HX1_CORNER} y={-caseR / cam.ppf} />
          <HookX1Dim cam={cam} f={f} at={T.two + 2} o={outO} />
        </svg>
      </div>

      {/* the reading window */}
      <HookX1Window x={winX} y={winY} r={shown} o={1 - prog(f, T.out - 2, 8, ease.in)} lock={lock} flash={lockFlash + slamFlash} />

      {/* the reading, floating above the floor */}
      {readA > 0 && outO > 0 && (
        <div style={{ position: "absolute", left: readX - 260, width: 520, top: readY - 70, textAlign: "center", ...blurIn(f, T.same - 1, { dur: 8, rise: 18 }), opacity: readA * outO }}>
          <span style={{ display: "inline-block", transform: `scale(${readPop.toFixed(4)})`, fontFamily: "Figtree, sans-serif", fontWeight: 700, fontSize: 124, letterSpacing: -2, color: toGold > 0 ? mixHex("#FFFFFF", GOLD, toGold) : "#FFFFFF", fontVariantNumeric: "tabular-nums", textShadow: `0 6px 28px rgba(0,0,0,0.75)${toGold > 0 ? `, 0 0 ${(40 * toGold).toFixed(0)}px rgba(242,179,61,${(0.45 * toGold).toFixed(2)})` : ""}` }}>
            {rd.ft}' {rd.inch}"
          </span>
        </div>
      )}

      {/* the source */}
      <div style={{ position: "absolute", left: 44, top: 1648, fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 26, color: "#8B949E", textShadow: "0 1px 8px rgba(13,17,23,0.9)", opacity: 1 - prog(f, T.out, 10, ease.in), whiteSpace: "nowrap" }}>
        NBA Rule 1, Court Dimensions
      </div>
    </div>
  );
};
HookX1.keep = true;

function mixHex(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
}
