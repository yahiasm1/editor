// The courtside scorer's table at STAPLES, seen from the floor: purple padded skirt with its quilted seams, the dark
// top rail with a chrome lip, and the LED ribbon along its face, one segment per spot (white LEDs: red belongs to the
// scoreboard and gold to Kobe's points). In front of it the maple strip with the gold sideline band, as in the
// endlessbender photo of that night. Each segment shows the number, then position and height type on as the man
// arrives. Credits for the five photos sit on the floor under their segments.
import React, { useId } from "react";
import { Img, staticFile } from "remotion";
import { prog, ease } from "../../../src/engine";
import { StartingFiveSpotlightsPlayers, StartingFiveSpotlightsTableTop } from "./StartingFiveSpotlightsData";
import { StartingFiveSpotlightsKwameChip } from "./StartingFiveSpotlightsKwame";

const TOP = StartingFiveSpotlightsTableTop;
const LED_Y = TOP + 34;
const LED_H = 104;
const FLOOR_Y = TOP + 162;

/** white LED lettering on a dim dot grid, centred */
export const StartingFiveSpotlightsLed: React.FC<{ text: string; size: number; w: number; x: number; y: number; on: number }> = ({ text, size, w, x, y, on }) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const pitch = size / 8;
  const h = size * 1.1;
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: x - w / 2, top: y, overflow: "visible" }}>
      <defs>
        <pattern id={`n${id}`} width={pitch} height={pitch} patternUnits="userSpaceOnUse">
          <circle cx={pitch / 2} cy={pitch / 2} r={pitch * 0.43} fill="#F4F6FA" />
        </pattern>
      </defs>
      {on > 0 && (
        <text x={w / 2} y={size * 0.92} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={size} letterSpacing={size * 0.06} fill="#E8EEFF" opacity={0.32 * on} style={{ filter: `blur(${5 * on}px)` }}>
          {text}
        </text>
      )}
      <text x={w / 2} y={size * 0.92} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={size} letterSpacing={size * 0.06} fill={`url(#n${id})`} opacity={0.16 + 0.84 * on}>
        {text}
      </text>
    </svg>
  );
};

export const StartingFiveSpotlightsTable: React.FC<{
  f: number;
  power: number; // the table and floor lit at all
  spot: number[]; // per spot: its light, 0..1.2
  arrive: number[]; // per spot: the man arrived, 0..1
  typeAt: number[]; // per spot: frame the position and height start typing
  fps: number;
}> = ({ f, power, spot, arrive, typeAt, fps }) => {
  const P = StartingFiveSpotlightsPlayers;
  // the LED ribbon's slow scan line, a real ribbon board refreshing
  const scan = ((f * 9) % 1500) - 200;
  return (
    <>
      {/* the maple strip in front of the table, gold sideline band at its far edge */}
      <div style={{ position: "absolute", left: -300, width: 1680, top: FLOOR_Y, height: 200, overflow: "hidden", opacity: 0.25 + 0.75 * power }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #6b4a22 0%, #8a6430 30%, #6f4f27 100%)" }} />
        {/* 2.25 in boards, running toward the camera */}
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, rgba(0,0,0,0.10) 0 1px, rgba(255,230,180,0.035) 1px 2px, transparent 2px 23px)", transform: "perspective(500px) rotateX(48deg)", transformOrigin: "50% 0%" }} />
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, transparent 0 61px, rgba(60,30,0,0.12) 61px 64px, transparent 64px 131px)", transform: "perspective(500px) rotateX(48deg)", transformOrigin: "50% 0%" }} />
        {/* the gold sideline band (the photo's broad gold out-of-bounds stripe) and the 2 in white sideline */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 30, background: "linear-gradient(180deg, #a8780e, #d9a21c 60%, #c38e14)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 30, height: 4, background: "rgba(245,240,230,0.85)" }} />
        {/* satin sheen: the spots spill onto the floor */}
        {P.map((p, i) => (
          <div key={i} style={{ position: "absolute", left: p.x + 300 - 170, top: -40, width: 340, height: 220, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,236,200,0.55), rgba(255,236,200,0) 100%)", opacity: Math.min(1, spot[i]) * 0.8, mixBlendMode: "screen" }} />
        ))}
        {/* the dark beyond the light */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,5,8,0.05) 0%, rgba(4,5,8,0.55) 45%, rgba(4,5,8,0.95) 100%)" }} />
      </div>
      {/* the table: skirt */}
      <div style={{ position: "absolute", left: -300, width: 1680, top: TOP, height: FLOOR_Y - TOP, background: "linear-gradient(180deg, #2a1146 0%, #3a1a63 22%, #2f1552 100%)", opacity: 0.35 + 0.65 * power }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, rgba(0,0,0,0.28) 0 2px, rgba(255,255,255,0.035) 2px 4px, transparent 4px 96px)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 14, background: "linear-gradient(180deg, #1a0a2c, #0b0612)" }} />
      </div>
      {/* the top rail with its chrome lip, light catching it under each spot */}
      <div style={{ position: "absolute", left: -300, width: 1680, top: TOP - 10, height: 22, background: "linear-gradient(180deg, #4b4f57 0%, #15171b 40%, #0b0c0e 100%)", boxShadow: "0 6px 18px rgba(0,0,0,0.7)" }}>
        {P.map((p, i) => (
          <div key={i} style={{ position: "absolute", left: p.x + 300 - 110, top: 0, width: 220, height: 4, borderRadius: 2, background: "linear-gradient(90deg, rgba(255,240,210,0), rgba(255,240,210,0.9), rgba(255,240,210,0))", opacity: Math.min(1, spot[i]) }} />
        ))}
      </div>
      {/* the LED ribbon */}
      <div style={{ position: "absolute", left: -300, width: 1680, top: LED_Y, height: LED_H, background: "#050507", borderTop: "2px solid #1d1f24", borderBottom: "2px solid #1d1f24", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1.3px, transparent 1.6px)", backgroundSize: "6px 6px" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: scan, width: 160, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.035), rgba(255,255,255,0))" }} />
        {/* segment seams */}
        {P.slice(1).map((p, i) => (
          <div key={i} style={{ position: "absolute", left: 300 + (P[i].x + p.x) / 2 - 1, top: 0, bottom: 0, width: 2, background: "#15161a" }} />
        ))}
      </div>
      {/* the ribbon's last segment carries the club's logo, full colour, as ribbon boards do */}
      <div style={{ position: "absolute", left: 912, top: LED_Y + 14, width: 128, height: 76, opacity: 0.2 + 0.75 * power }}>
        <Img src={staticFile("kobe-81/startingfivespotlights-lakers.svg")} style={{ width: 128, height: 76, objectFit: "contain" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, transparent 1.2px, rgba(5,5,7,0.55) 1.9px)", backgroundSize: "4px 4px" }} />
      </div>
      {P.map((p, i) => {
        const lit = Math.min(1, spot[i]) * (0.35 + 0.65 * arrive[i]);
        const line = `${p.pos} ${p.height}`;
        const n = Math.max(0, Math.min(line.length, Math.floor(((f - typeAt[i]) / fps) * (1000 / 40))));
        return (
          <React.Fragment key={i}>
            <StartingFiveSpotlightsLed text={p.num} size={44} w={170} x={p.x} y={LED_Y + 4} on={power > 0.5 ? lit : 0} />
            <StartingFiveSpotlightsLed text={line.slice(0, n)} size={34} w={170} x={p.x} y={LED_Y + 56} on={arrive[i] * Math.min(1, spot[i])} />
          </React.Fragment>
        );
      })}
    </>
  );
};

/** the photo credits, on the floor under each segment. Drawn outside the camera so they never shrink below 22 px:
 *  they follow the pull back in position only. */
export const StartingFiveSpotlightsCredits: React.FC<{ f: number; spot: number[]; typeAt: number[]; cam: number; camY: number }> = ({ f, spot, typeAt, cam, camY }) => {
  const P = StartingFiveSpotlightsPlayers;
  const oy = TOP; // the camera scales about the table top
  return (
    <>
      {P.map((p, i) => {
        const nudge = [0, -10, 4, 16, 30][i]; // keeps the two-line credits apart once the camera pulls back
        const x = 540 + (p.x - 540) * cam + nudge * (1.6 - cam) * 1.4;
        const y = oy + (FLOOR_Y + 44 - oy) * cam + camY;
        const credit = (
          <div key={i} style={{ position: "absolute", left: x - 86, width: 172, top: y, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 22, lineHeight: "25px", letterSpacing: -0.2, color: "#8B949E", opacity: prog(f, typeAt[i], 12, ease.out) * (0.55 + 0.45 * Math.min(1, spot[i])), textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
            {p.credit.map((c, j) => (
              <div key={j} style={{ whiteSpace: "nowrap" }}>{c}</div>
            ))}
          </div>
        );
        // Kwame is a trace: the real photo he was traced from rides under his credit
        if (p.trace) {
          const dim = 0.55 + 0.45 * Math.min(1, spot[i]);
          return (
            <React.Fragment key={i}>
              {credit}
              <StartingFiveSpotlightsKwameChip f={f} at={typeAt[i] + 4} x={x} y={y + 58} dim={dim} />
            </React.Fragment>
          );
        }
        return credit;
      })}
    </>
  );
};
