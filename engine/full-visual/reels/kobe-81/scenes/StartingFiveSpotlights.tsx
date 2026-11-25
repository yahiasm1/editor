// starters: "The Lakers' starting five was Smush Parker, Kobe, Lamar Odom, Kwame Brown and Chris Mihm. Not exactly a
// super team." The starting-lineup introduction in the dark arena of that night: the photo of STAPLES goes black, the
// scorer's table and its LED ribbon light along the bottom, five follow spots open, and on each name a real Commons
// cut-out comes into his spot at his true height (one scale, 110 px per foot) while his LED segment types position
// and height. On "Mihm" a height ruler draws behind the five. "Not exactly" pulls back; on "super" every spot but
// Kobe's flickers and drops to half. The scoreboard stays hung at the top reading END 1ST, 36-29.
// Parts: Data (the five, the scale), Light (arena, beams), Table (table, LED plates, floor, credits), Kwame (his
// traced figure and the real tip-off photo chip).
// Notes: ../notes/StartingFiveSpotlights.md
import React from "react";
import { Img, staticFile } from "remotion";
import { useScene, prog, ease } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { StaplesNightBoard } from "./StaplesNightBoard";
import { StartingFiveSpotlightsArena, StartingFiveSpotlightsBeams } from "./StartingFiveSpotlightsLight";
import { StartingFiveSpotlightsKwame } from "./StartingFiveSpotlightsKwame";
import { StartingFiveSpotlightsCredits, StartingFiveSpotlightsTable } from "./StartingFiveSpotlightsTable";
import { StartingFiveSpotlightsPlayers as P, StartingFiveSpotlightsTableTop, StartingFiveSpotlightsY as Y } from "./StartingFiveSpotlightsData";

const FULL: React.CSSProperties = { position: "absolute", inset: 0 };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** an arena light striking: on, off, on, settling */
const strike = (f: number, at: number) => {
  const t = f - at;
  if (t < 0) return 0;
  const seq = [0.9, 0.15, 1, 0.35, 1.1, 0.8, 1];
  return t < seq.length ? seq[t] : 1;
};

export const StartingFiveSpotlights: React.FC = () => {
  const { f, fps, scene, cue, endsOn } = useScene();
  const t0 = scene.from - LEAD;

  // ---- times, all from the words
  const tLakers = cue("lakers");
  const tStarting = cue("starting");
  const tNot = cue("not");
  const tSuper = cue("super");
  const tTeam = cue("team");
  const WALK = 16;
  const RISE = 20;
  const arriveAt = P.map((p) => endsOn(p.word, p.from === "below" ? RISE : WALK));
  const landAt = P.map((p) => cue(p.word));
  const tRuler = cue("mihm") - 2;

  // ---- the arena goes dark, the table lights
  const dark = prog(f, tLakers - 8, 22, ease.inOut);
  const power = prog(f, tLakers - 2, 14, ease.out);

  // ---- the spots: open on "starting", left to right; on "super" all but Kobe's flicker and drop to half
  const superFlick = (i: number) => {
    if (i === 1) return 1;
    const t = f - (tSuper - 3) - i;
    if (t < 0) return 1;
    const seq = [1, 0.35, 0.9, 0.2, 0.7, 0.3, 0.6];
    const settle = 0.44 - 0.14 * prog(f, tTeam, 14, ease.out);
    return t < seq.length ? Math.max(seq[t], settle) : settle;
  };
  const kobePulse = prog(f, landAt[1] - 2, 5, ease.out) * (1 - prog(f, landAt[1] + 4, 24, ease.out));
  const spot = P.map((_, i) => {
    let s = strike(f, tStarting - 4 + i * 4) * superFlick(i);
    if (i === 1) s *= 1.06 + 0.22 * kobePulse + 0.12 * prog(f, tTeam, 16, ease.inOut);
    return s;
  });

  // ---- arrivals
  const arrive = P.map((p, i) => prog(f, arriveAt[i], p.from === "below" ? RISE : WALK, p.from === "below" ? ease.back : ease.out));

  // ---- camera: a slow push while they arrive, then the pull back on "Not exactly"
  const push = prog(f, t0, tNot - t0, ease.linear);
  const pull = prog(f, tNot - 2, 30, ease.inOut);
  const cam = lerp(1 + 0.03 * push, 0.885, pull);
  const camY = lerp(0, -18, pull);

  // ---- the ruler
  const ruler = prog(f, tRuler, 22, ease.inOut);
  const rulerRows = [7, 6.5, 6];
  const rulerLabel = ["7-0", "6-6", "6-0"];

  // ---- the four sink a step into the dark on "team."
  const sink = prog(f, tTeam, 18, ease.inOut);

  // the order they stand in, back to front (Kwame's arms go behind Odom and Mihm; Kobe in front)
  const order = [3, 4, 2, 0, 1];

  return (
    <div style={{ ...FULL, overflow: "hidden" }}>
      <StartingFiveSpotlightsArena f={f} dark={dark} push={push} />

      <div style={{ ...FULL, transform: `translateY(${camY}px) scale(${cam})`, transformOrigin: `540px ${StartingFiveSpotlightsTableTop}px` }}>
        {/* the height ruler, behind the five */}
        {rulerRows.map((ft, k) => {
          const y = Y(ft);
          const r = prog(f, tRuler + k * 4, 20, ease.inOut);
          return (
            <React.Fragment key={k}>
              <div style={{ position: "absolute", left: 86, top: y, width: (1180 - 86) * r, height: 2, background: "linear-gradient(90deg, rgba(139,148,158,0.85), rgba(139,148,158,0.35))" }} />
            </React.Fragment>
          );
        })}

        <StartingFiveSpotlightsBeams f={f} spot={spot} />

        {order.map((i) => {
          const p = P[i];
          const a = arrive[i];
          if (f < arriveAt[i]) return null;
          const crown = Y(p.ft);
          let dx = 0;
          let dy = 0;
          let blur = 0;
          if (p.from === "below") {
            dy = Math.max(-6, (1 - a) * 260); // a small overshoot only: his raised fist stops short of the scoreboard
            blur = Math.abs(1 - a) * 5;
          } else {
            const dir = p.from === "left" ? -1 : 1;
            dx = dir * (1 - a) * 190;
            dy = -Math.abs(Math.sin(a * Math.PI * 3)) * 9 * (1 - a); // a stride's bob
            blur = (1 - a) * 7;
          }
          if (i !== 1) dy += 16 * sink;
          // a gentle idle sway: nobody stands frozen in a spotlight
          const sway = Math.sin((f - arriveAt[i]) / (38 + i * 5) + i) * 1.6 * a;
          const light = spot[i] * (0.3 + 0.7 * a);
          const left = p.x - p.bodyX + dx + sway;
          const top = crown - p.crownY + dy;
          const src = staticFile(`kobe-81/${p.file}`);
          const grade = `brightness(${((0.1 + 0.98 * Math.min(1.25, light)) * p.grade.b).toFixed(3)}) contrast(1.06) saturate(${((0.7 + 0.35 * Math.min(1, light)) * p.grade.s).toFixed(2)})`;
          const mask = { WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" } as React.CSSProperties;
          return (
            <div key={p.key} style={{ position: "absolute", left, top, width: p.w, height: p.h, opacity: prog(f, arriveAt[i], 6, ease.linear), filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
              {p.trace ? (
                <div style={{ position: "absolute", inset: 0, filter: grade }}>
                  <StartingFiveSpotlightsKwame w={p.w} h={p.h} light={light} />
                </div>
              ) : (
                <>
                  <Img src={src} style={{ position: "absolute", inset: 0, width: p.w, height: p.h, filter: grade }} />
                  {/* the follow spot from above: hot on the head and shoulders, falling away toward the table */}
                  <div style={{ position: "absolute", inset: 0, ...mask, background: `linear-gradient(180deg, rgba(255,240,215,${(0.16 * Math.min(1, light)).toFixed(3)}) 0%, rgba(255,240,215,0) 22%, rgba(5,6,10,0) 45%, rgba(5,6,10,${(0.5 - 0.15 * Math.min(1, light)).toFixed(3)}) 100%)` }} />
                </>
              )}
            </div>
          );
        })}

        {/* a tick on each crown, at his true height, once the ruler is up */}
        {P.map((p, i) => {
          const y = Y(p.ft);
          const k = prog(f, tRuler + 8 + i * 3, 10, ease.out);
          return <div key={i} style={{ position: "absolute", left: p.x + (p.headDx ?? 0) - 46, top: y - 1 + (i !== 1 ? 16 * sink : 0), width: 92 * k, height: 3, borderRadius: 2, background: "rgba(230,237,243,0.9)", opacity: k * (i === 1 ? 1 : 0.55 + 0.45 * Math.min(1, spot[i])), boxShadow: "0 0 6px rgba(0,0,0,0.6)" }} />;
        })}

        {/* the ruler's labels sit in front, on the dark left edge */}
        {rulerRows.map((ft, k) => (
          <div key={k} style={{ position: "absolute", left: 6, top: Y(ft) - 19, width: 74, textAlign: "right", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 32, color: "#8B949E", opacity: prog(f, tRuler + k * 4 + 4, 8), fontVariantNumeric: "tabular-nums", textShadow: "0 0 8px #05070a, 0 0 3px #05070a" }}>
            {rulerLabel[k]}
          </div>
        ))}

        <StartingFiveSpotlightsTable f={f} power={power} spot={spot} arrive={arrive} typeAt={landAt.map((l) => l - 2)} fps={fps} />
      </div>

      <StartingFiveSpotlightsCredits f={f} spot={spot} typeAt={landAt.map((l) => l - 2)} cam={cam} camY={camY} />

      {/* the thread scoreboard, hung where `night` parked it: END 1ST, Raptors 36, Lakers 29 */}
      {/* it hands over to `halftime`'s own board in place: crossfade out as the lift begins, so no lifted copy of it
          smears up over the caption (the stage lift starts at scene.to - 7, halftime's board blurs in from scene.to - 6) */}
      <div style={{ ...FULL, opacity: 1 - prog(f, scene.to - 8, 3, ease.linear) }}>
        <StaplesNightBoard st={{ power: 1, tor: 36, lal: 29, period: "END 1ST", clock: "0.0", flareTor: 1, logoTor: 1, logoLal: 1 }} />
      </div>
    </div>
  );
};
