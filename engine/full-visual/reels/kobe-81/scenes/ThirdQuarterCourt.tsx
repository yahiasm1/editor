// "Pull-up jumpers, threes, drives, free throws. Every time down the floor, it was him. By the end of the third
// quarter, the Lakers were in front."
// His third quarter on the STAPLES floor (FLOOR scale): the court top-down at true NBA geometry, painted as the photos of
// that floor show it. Every one of his 15 third-quarter shots stands on its real Basketball-Reference spot, one shot
// type per word: made ones pop as his gold bulbs and fly into the 9 x 9 board in the corner (26 -> 53), misses flash a
// grey x. Then the court steps aside and his 12 scoring rows from BBR's play-by-play stack in, every "K. Bryant" turns
// gold on "him", while the reel's LED scoreboard runs the real clock from 8:42 71-55 to the lead (1:11 dunk, 87-85) and
// END 3RD 91-85. A red LED count of the Raptors' points since the half crawls to 22 beside his 27.
import React from "react";
import { Img, interpolateColors, staticFile } from "remotion";
import { blurIn, blurOut, ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { StaplesNightBoard, StaplesNightBoardRect, StaplesNightLed, StaplesNightReadout } from "./StaplesNightBoard";
import { DeficitFlowChartCornerBoard } from "./DeficitFlowChart";
import { ThirdQuarterCourtFloor, ThirdQuarterCourtGeom } from "./ThirdQuarterCourtFloor";
import shotsJson from "../assets/refs/kobe-shots-court.json";
import scoring from "../assets/refs/kobe-81-scoring.json";

const GOLD = "#FDB927";
const GREY = "#8B949E";
const INK = "#E6EDF3";

type ThirdQuarterCourtShot = { q: number; clock: string; made: boolean; pts: number; ft: number; x_ft: number; y_ft: number; zone: string };
type ThirdQuarterCourtEv = { q: number; clock: string; team: string; pts: number; kobe: boolean; play: string; tor: number; lal: number };

const ThirdQuarterCourtSecs = (c: string) => {
  const [m, s] = c.split(":");
  return Number(m) * 60 + Number(s);
};
const Q3 = (shotsJson as { shots: ThirdQuarterCourtShot[] }).shots.filter((s) => s.q === 3);
const EV3 = (scoring as { events: ThirdQuarterCourtEv[] }).events.filter((e) => e.q === 3).map((e) => ({ ...e, secs: ThirdQuarterCourtSecs(e.clock) }));
const shotAt = (clock: string) => {
  const s = Q3.find((x) => x.clock === clock);
  if (!s) throw new Error(`ThirdQuarterCourt: no shot at ${clock}`);
  return s;
};

// his makes by type (the order the voice names them), each with its real spot
const JUMPERS = ["9:36.0", "8:42.0", "5:48.0"].map(shotAt);
const THREES = ["8:14.0", "7:39.0", "6:22.0", "4:47.0"].map(shotAt);
const RIM = ["10:43.0", "2:30.0", "1:11.0", "0:31.9"].map(shotAt);
const MISS2 = Q3.filter((s) => !s.made && s.pts === 2);
const MISS3 = Q3.filter((s) => !s.made && s.pts === 3);

// his 12 scoring rows, BBR copy (the assist dropped)
const ROWS = EV3.filter((e) => e.kobe).map((e) => ({ ...e, text: e.play.replace(/ \(assist by [^)]*\)/, "") }));

// court placement: px per foot and the screen point of (rim centre x, baseline)
const P1 = { ppf: 13.2, ox: 86 + 25 * 13.2, oy: 764 };
const P2 = { ppf: 11, ox: 84 + 25 * 11, oy: 744 };
const BOARD = DeficitFlowChartCornerBoard;
const LIST = { x: 90, y: 1140, w: 900, pitch: 48, rows: 6 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const bell = (f: number, at: number, dur: number) => {
  const t = (f - at) / dur;
  return t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t);
};
const fmtClock = (secs: number) => {
  if (secs <= 0) return "0.0";
  if (secs < 60) return secs.toFixed(1);
  const s = Math.ceil(secs - 1e-6);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** one bulb in the reel's look: socket ring, glass globe, hot core, halo */
const ThirdQuarterCourtBulb: React.FC<{ x: number; y: number; r: number; lit: number; glow?: number; color?: string; socket?: boolean }> = ({ x, y, r, lit, glow = 1, color = GOLD, socket = true }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
    {lit > 0.01 && (
      <div style={{ position: "absolute", left: -r * 1.6, top: -r * 1.6, width: r * 5.2, height: r * 5.2, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 62%)`, opacity: 0.42 * lit * glow }} />
    )}
    {socket && (
      <div style={{ position: "absolute", inset: -Math.max(1, r * 0.13), borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #2a3038 0%, #12161c 70%)", border: `${Math.max(1, r * 0.065).toFixed(2)}px solid #3b424c` }} />
    )}
    {lit > 0.01 && (
      <div style={{ position: "absolute", inset: Math.max(0.5, r * 0.05), borderRadius: "50%", background: `radial-gradient(circle at 46% 40%, #FFFDF4 0%, ${color} 40%, ${color} 70%, rgba(0,0,0,0.35) 100%)`, opacity: lit, boxShadow: `0 0 ${(r * 0.6 * glow * lit).toFixed(1)}px ${color}` }} />
    )}
    <div style={{ position: "absolute", left: r * 0.45, top: r * 0.3, width: r * 0.55, height: r * 0.32, borderRadius: "50%", background: "rgba(255,255,255,0.55)", opacity: (socket ? 0.25 : 0) + 0.5 * lit, transform: "rotate(-28deg)" }} />
  </div>
);

/** a grey x where a shot missed */
const ThirdQuarterCourtMiss: React.FC<{ x: number; y: number; s: number; k: number; flash: number }> = ({ x, y, s, k, flash }) => {
  if (k <= 0.01) return null;
  const a = s * (0.5 + 0.5 * k);
  return (
    <svg width={a * 2 + 8} height={a * 2 + 8} style={{ position: "absolute", left: x - a - 4, top: y - a - 4, overflow: "visible", opacity: 0.45 + 0.55 * flash }}>
      <g stroke="#3D4550" strokeWidth={Math.max(3, s * 0.42)} strokeLinecap="round">
        <line x1={4} y1={4} x2={a * 2 + 4} y2={a * 2 + 4} />
        <line x1={a * 2 + 4} y1={4} x2={4} y2={a * 2 + 4} />
      </g>
    </svg>
  );
};

export const ThirdQuarterCourt: React.FC = () => {
  const { f, scene, cue, theme, ground } = useScene();
  const mount = scene.from - LEAD;

  const tPull = cue("Pull-up");
  const tJumpers = cue("jumpers");
  const tThrees = cue("threes");
  const tDrives = cue("drives");
  const tFree = cue("free");
  const tThrows = cue("throws");
  const tEvery = cue("Every");
  const tFloor = cue("floor");
  const tHim = cue("him");
  const tEnd = cue("end");
  const tThird = cue("third");
  const tQuarter = cue("quarter");
  const tLakers = cue("Lakers");
  const tFront = cue("front");

  // ------------------------------------------------------------------ the camera over the floor
  const tilt = prog(f, mount, tPull - mount + 4, ease.inOut); // 0 tilted across the floor, 1 straight down
  const shrink = prog(f, tEvery - 5, 16, ease.inOut);
  const ppf = lerp(P1.ppf, P2.ppf, shrink);
  const ox = lerp(P1.ox, P2.ox, shrink);
  const oy = lerp(P1.oy, P2.oy, shrink);
  const P = (xft: number, yft: number) => ({ x: ox + xft * ppf, y: oy + yft * ppf });
  const shotXY = (s: ThirdQuarterCourtShot) => P(s.x_ft, ThirdQuarterCourtGeom.rimY + s.y_ft);
  const clipBottom = lerp(1442, LIST.y - 12, shrink);

  // ------------------------------------------------------------------ makes: when each pops, which sockets it fills
  type Make = { at: number; pts: number; xy: () => { x: number; y: number }; label: string; kind: "j" | "3" | "rim" | "ft"; clock: string };
  const rimOff = [
    [-0.9, 0.9],
    [0.9, 0.9],
    [-0.9, -0.5],
    [0.9, -0.5],
  ];
  const makes: Make[] = [
    ...JUMPERS.map((s, i) => ({ at: tPull + 1 + i * 5, pts: 2, xy: () => shotXY(s), label: `${s.ft} ft`, kind: "j" as const, clock: s.clock })),
    ...THREES.map((s, i) => ({ at: tThrees + 1 + i * 4, pts: 3, xy: () => shotXY(s), label: `${s.ft} ft`, kind: "3" as const, clock: s.clock })),
    ...RIM.map((s, i) => ({ at: tDrives + 3 + i * 5, pts: 2, xy: () => P(rimOff[i][0], ThirdQuarterCourtGeom.rimY + 1.36 + rimOff[i][1]), label: "", kind: "rim" as const, clock: s.clock })),
    { at: tThrows + 2, pts: 1, xy: () => P(0, 19), label: "", kind: "ft" as const, clock: "5:48.0" },
  ];
  // bulbs: one per point, socket index 26.. in make order
  type Flight = { from: number; socket: number; make: number };
  const flights: Flight[] = [];
  {
    let socket = 26;
    makes.forEach((m, mi) => {
      for (let j = 0; j < m.pts; j++) flights.push({ from: m.at + 2 + j * 3, socket: socket++, make: mi });
    });
  }
  const FLY = 16;
  const sockXY = (i: number) => ({ x: BOARD.x0 + (i % 9) * BOARD.pitch, y: BOARD.y0 + Math.floor(i / 9) * BOARD.pitch });
  const landed = flights.filter((fl) => f >= fl.from + FLY).length;
  const kobePts = 26 + landed;
  const lastLand = flights.reduce((acc, fl) => (f >= fl.from + FLY ? Math.max(acc, fl.from + FLY) : acc), -999);

  // ------------------------------------------------------------------ the rows of the play-by-play
  const rowAt = ROWS.map((_, i) => (i <= 9 ? Math.round(lerp(tEvery + 2, tFloor, i / 9)) : i === 10 ? tQuarter : tLakers));
  const nRows = rowAt.filter((a) => f >= a).length;
  const scrollFor = (fr: number) => {
    let y = 0;
    rowAt.forEach((a, i) => {
      if (i >= LIST.rows) y += prog(fr, a - 1, 7, ease.out);
    });
    return y * LIST.pitch;
  };
  const scroll = scrollFor(f);
  const himGold = prog(f, tHim - 1, 6, ease.out);
  const makeOfRow = (clock: string) => makes.findIndex((m) => m.clock === clock && m.kind !== "ft");

  // ------------------------------------------------------------------ the game clock that runs the scoreboard
  const knots: [number, number][] = [
    [mount, ThirdQuarterCourtSecs("8:42")],
    [tEvery, ThirdQuarterCourtSecs("4:47")],
    [tFloor, ThirdQuarterCourtSecs("2:30")],
    [tEnd, ThirdQuarterCourtSecs("2:03")],
    [tThird, ThirdQuarterCourtSecs("1:37")],
    [tQuarter, ThirdQuarterCourtSecs("1:11")],
    [tLakers, 31.9],
    [tFront, 0],
  ];
  const gameSecs = (fr: number) => {
    if (fr <= knots[0][0]) return knots[0][1];
    for (let i = 1; i < knots.length; i++) {
      const [a, va] = knots[i - 1];
      const [b, vb] = knots[i];
      if (fr <= b) return lerp(va, vb, (fr - a) / Math.max(1, b - a));
    }
    return 0;
  };
  const scoreAt = (secs: number) => {
    let tor = 71;
    let lal = 55;
    for (const e of EV3) {
      if (e.secs + 1e-6 >= secs && e.secs <= ThirdQuarterCourtSecs("8:42") + 1e-6) {
        tor = e.tor;
        lal = e.lal;
      }
    }
    return { tor, lal };
  };
  const G = gameSecs(f);
  const now = scoreAt(G);
  const prev = scoreAt(gameSecs(f - 7));
  const ended = f >= tFront;
  const lead = now.lal > now.tor;
  const leadAt = tQuarter;
  const torSince = now.tor - 63;
  const torPrev = prev.tor - 63;

  // ------------------------------------------------------------------ type labels and photos
  const labelK = (start: number, end: number) => prog(f, start, 7, ease.out) * (1 - prog(f, end, 6, ease.in));
  const arcDraw = prog(f, tThrees - 6, 10, ease.inOut);
  const arcLight = arcDraw * (0.35 + 0.65 * (1 - prog(f, tDrives - 2, 14, ease.inOut))) * (1 - 0.6 * shrink) + bell(f, tHim - 1, 22) * 0.6;
  const rimFlash = Math.min(1.4, RIM.reduce((acc, _, i) => acc + bell(f, tDrives + 1 + i * 5, 12), 0));
  const dunkIn = blurIn(f, tDrives - 2, { dur: 8, rise: 26 });
  const ftCard = prog(f, tFree - 2, 9, ease.out);
  const cardsOut = blurOut(f, tEvery - 7, { dur: 8 });

  // ------------------------------------------------------------------ scoreboard state
  const flashLal = now.lal !== prev.lal ? 1 : 0;
  const flashTor = now.tor !== prev.tor ? 1 : 0;
  const leadFlash = bell(f, leadAt, 26);
  const endFlash = bell(f, tFront - 1, 30);

  // the drives: streaks into the rim (angles from straight out toward half court)
  const driveAng = [-52, 18, -14, 56].map((d) => (d * Math.PI) / 180);

  return (
    <>
      {/* ---------- the floor, with everything that stands on it */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: 1500,
          perspectiveOrigin: "50% 40%",
          clipPath: `inset(0 0 ${(1920 - clipBottom).toFixed(1)}px 0)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: `${P1.ox}px 1040px`,
            transform: `rotateX(${((1 - tilt) * 52).toFixed(2)}deg) scale(${(1 + (1 - tilt) * 0.08).toFixed(4)})`,
            
          }}
        >
          <div style={{ position: "absolute", left: ox, top: oy }}>
            <ThirdQuarterCourtFloor f={f} arcLight={arcLight} rimFlash={rimFlash} ppf={ppf} />
          </div>
          {/* a soft edge where the floor runs on past the stage */}
          <div style={{ position: "absolute", left: 0, top: clipBottom - 70, width: 1080, height: 72, background: `linear-gradient(180deg, rgba(13,17,23,0) 0%, ${ground.bg} 100%)` }} />

          {/* the drives: gold streaks into the rim */}
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {driveAng.map((a, i) => {
              const at = tDrives - 7 + i * 5;
              const k = prog(f, at, 10, ease.in);
              if (f < at || k <= 0) return null;
              const fade = 1 - prog(f, at + 12, 14, ease.linear);
              if (fade <= 0) return null;
              const rim = P(0, ThirdQuarterCourtGeom.rimY);
              const st = P(Math.sin(a) * 24.5, ThirdQuarterCourtGeom.rimY + Math.cos(a) * 24.5);
              const hx = lerp(st.x, rim.x, k);
              const hy = lerp(st.y, rim.y, k);
              const tx = lerp(st.x, rim.x, Math.max(0, k - 0.45));
              const ty = lerp(st.y, rim.y, Math.max(0, k - 0.45));
              return (
                <g key={i} opacity={fade}>
                  <line x1={tx} y1={ty} x2={hx} y2={hy} stroke={GOLD} strokeWidth={14} strokeLinecap="round" opacity={0.28} />
                  <line x1={tx} y1={ty} x2={hx} y2={hy} stroke="#FFE7A3" strokeWidth={5} strokeLinecap="round" />
                </g>
              );
            })}
          </svg>

          {/* misses: grey x */}
          {[...MISS2.map((s, i) => ({ s, at: tJumpers + 2 + i * 4 })), ...MISS3.map((s) => ({ s, at: tThrees + 16 }))].map(({ s, at }, i) => {
            const xy = shotXY(s);
            return <ThirdQuarterCourtMiss key={`m${i}`} x={xy.x} y={xy.y} s={0.62 * ppf} k={prog(f, at, 6, ease.back)} flash={bell(f, at, 20)} />;
          })}

          {/* the makes: gold bulbs on their spots, rings when they land and when their row lands */}
          {makes.map((m, i) => {
            if (m.kind === "ft") return null;
            const k = prog(f, m.at, 8, ease.back);
            if (k <= 0.01) return null;
            const xy = m.xy();
            const ri = ROWS.findIndex((r) => r.clock === m.clock);
            const rowHit = ri >= 0 ? bell(f, rowAt[ri], 16) : 0;
            const pulse = bell(f, m.at, 18) + rowHit * 1.2 + bell(f, tHim - 1, 22) * 0.8 + (m.clock === "5:48.0" ? bell(f, tFree, 20) : 0);
            const r = 0.78 * ppf * (0.4 + 0.6 * k);
            const ringT = (fr: number) => (f - fr) / 20;
            const rings = [m.at, ri >= 0 ? rowAt[ri] : -999, m.clock === "5:48.0" ? tFree : -999].filter((fr) => f >= fr && f < fr + 20);
            return (
              <React.Fragment key={`mk${i}`}>
                {rings.map((fr, j) => (
                  <div key={j} style={{ position: "absolute", left: xy.x - r * (1 + 2.6 * ringT(fr)), top: xy.y - r * (1 + 2.6 * ringT(fr)), width: 2 * r * (1 + 2.6 * ringT(fr)), height: 2 * r * (1 + 2.6 * ringT(fr)), borderRadius: "50%", border: `3px solid ${GOLD}`, opacity: 1 - ringT(fr) }} />
                ))}
                <ThirdQuarterCourtBulb x={xy.x} y={xy.y} r={r * (1 + 0.25 * Math.min(1, pulse))} lit={1} glow={1 + 1.2 * pulse} socket={false} />
              </React.Fragment>
            );
          })}

          {/* the points each make is worth, rising off its spot */}
          {makes.map((m, i) => {
            const t = (f - m.at) / 26;
            if (t < 0 || t > 1) return null;
            const xy = m.xy();
            // fan the +n of shots that land close together, so no two overlap
            const ri = makes.slice(0, i).filter((x) => x.kind === "rim").length;
            const ti = makes.slice(0, i).filter((x) => x.kind === "3").length;
            const side = m.kind === "rim" ? [-4.4, 4.4, -4.4, 4.4][ri] : m.kind === "3" ? [1.8, -1.8, -1.8, -5.2][ti] : 0;
            const down = m.kind === "rim" ? 3.2 * ppf + 40 + (ri >= 2 ? 46 : 0) : m.kind === "3" && ti >= 2 ? 36 : 0;
            return (
              <div key={`pt${i}`} style={{ position: "absolute", left: xy.x + side * ppf - 40, top: xy.y - 0.9 * ppf - 44 + down - 46 * ease.out(t), width: 80, textAlign: "center", fontFamily: theme.font.ui, fontWeight: 900, fontSize: 38, color: GOLD, opacity: Math.min(1, t * 6) * (1 - prog(f, m.at + 14, 12, ease.in)), textShadow: "0 2px 0 #3A1F00, 0 0 14px rgba(253,185,39,0.7)" }}>
                {`+${m.pts}`}
              </div>
            );
          })}

          {/* the free throw: one bulb leaves the line */}
          {f >= tThrows - 4 && f < tThrows + 2 + FLY && (() => {
            const xy = P(0, 19);
            const k = prog(f, tThrows - 4, 6, ease.back);
            return <ThirdQuarterCourtBulb x={xy.x} y={xy.y} r={0.78 * ppf * k} lit={1} glow={1.6} socket={false} />;
          })()}

          {/* labels: real distances on the floor, dark ink on the maple with a hairline */}
          {[
            ...JUMPERS.map((s, i) => ({ s, text: `${s.ft} ft`, at: tJumpers + i * 4, end: tThrees - 2, left: s.x_ft < -5 })),
            ...THREES.slice(0, 2).map((s, i) => ({ s, text: `${s.ft} ft`, at: tThrees + 3 + i * 4, end: tDrives - 2, left: false })),
          ].map(({ s, text, at, end, left }, i) => {
            const k = labelK(at, end);
            if (k <= 0.01) return null;
            const xy = shotXY(s);
            const up = s.y_ft > 12 ? 1 : -1;
            // a spot beside the lane takes its label on the wood side, never on the purple paint
            const dx = s.x_ft > 12 || left ? -1 : 1;
            return (
              <div key={`l${i}`} style={{ position: "absolute", left: xy.x + dx * 18 - (dx < 0 ? 110 : 0), top: xy.y + up * 14 - (up < 0 ? 36 : 0), width: 110, textAlign: dx < 0 ? "right" : "left", fontFamily: theme.font.ui, fontWeight: 800, fontSize: 30, color: "#2B1446", opacity: k, transform: `translateY(${((1 - k) * 8).toFixed(1)}px)` }}>
                {text}
              </div>
            );
          })}
          {(() => {
            const k = labelK(tDrives + 4, tEvery - 6);
            if (k <= 0.01) return null;
            const rim = P(0, ThirdQuarterCourtGeom.rimY);
            const at = P(9.2, 11.2);
            return (
              <>
                <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: k }}>
                  <line x1={rim.x + 0.9 * ppf} y1={rim.y + 0.5 * ppf} x2={at.x - 4} y2={at.y + 4} stroke="#2B1446" strokeWidth={2} />
                </svg>
                <div style={{ position: "absolute", left: at.x, top: at.y - 6, fontFamily: theme.font.ui, fontWeight: 800, fontSize: 30, lineHeight: 1.15, color: "#2B1446", opacity: k }}>
                  layup at rim ×2
                  <br />
                  dunk at rim ×2
                </div>
              </>
            );
          })()}
          {(() => {
            const k = labelK(tThrows - 2, tEvery - 6);
            if (k <= 0.01) return null;
            const xy = P(0, 19);
            return (
              <div style={{ position: "absolute", left: xy.x - 100, top: xy.y + 1.0 * ppf, width: 200, textAlign: "center", fontFamily: theme.font.ui, fontWeight: 800, fontSize: 30, lineHeight: 1.1, color: "#2B1446", opacity: k }}>
                free throw
                <br />
                1 of 1
              </div>
            );
          })()}
        </div>
      </div>

      {/* ---------- the bulbs in flight to the board */}
      {flights.map((fl, i) => {
        if (f < fl.from || f >= fl.from + FLY) return null;
        const a = makes[fl.make].xy();
        const b = sockXY(fl.socket);
        const t = (f - fl.from) / FLY;
        const at = (u: number) => {
          const e = ease.inOut(Math.max(0, Math.min(1, u)));
          const cx = lerp(a.x, b.x, 0.35);
          const cy = Math.min(a.y, b.y) - 150;
          const x = (1 - e) * (1 - e) * a.x + 2 * (1 - e) * e * cx + e * e * b.x;
          const y = (1 - e) * (1 - e) * a.y + 2 * (1 - e) * e * cy + e * e * b.y;
          return { x, y };
        };
        const r = lerp(0.78 * ppf, BOARD.r, ease.inOut(t));
        return (
          <React.Fragment key={`fl${i}`}>
            {[0.18, 0.1].map((d, j) => {
              const p = at(t - d);
              return <div key={j} style={{ position: "absolute", left: p.x - r * 0.7, top: p.y - r * 0.7, width: r * 1.4, height: r * 1.4, borderRadius: "50%", background: GOLD, opacity: 0.22 + 0.12 * j, filter: "blur(3px)" }} />;
            })}
            <ThirdQuarterCourtBulb x={at(t).x} y={at(t).y} r={r} lit={1} glow={1.5} socket={false} />
          </React.Fragment>
        );
      })}

      {/* ---------- the 9 x 9 board in the corner */}
      {Array.from({ length: 81 }, (_, i) => {
        const xy = sockXY(i);
        const fl = flights.find((x) => x.socket === i);
        const lit = i < 26 ? 1 : fl && f >= fl.from + FLY ? 1 : 0;
        const pop = fl ? bell(f, fl.from + FLY - 1, 14) : 0;
        const breathe = 0.88 + 0.12 * Math.sin(f * 0.11 + i * 0.3);
        const newGlow = i >= 26 && lit ? 1.25 + 0.2 * Math.sin(f * 0.15 + i) : breathe;
        return <ThirdQuarterCourtBulb key={`s${i}`} x={xy.x} y={xy.y} r={BOARD.r * (1 + 0.5 * pop)} lit={lit} glow={newGlow + 1.5 * pop} />;
      })}
      {/* his number beside it */}
      <div style={{ ...blurIn(f, mount + 2, { dur: 8 }), position: "absolute", left: BOARD.x0 - 22, top: BOARD.y0 + 8 * BOARD.pitch + 22, width: 9 * BOARD.pitch + 22, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontFamily: theme.font.ui, fontSize: 26, fontWeight: 600, color: GREY, letterSpacing: 1 }}>KOBE</span>
        <span style={{ fontFamily: theme.font.ui, fontSize: 70, fontWeight: 800, lineHeight: 1, color: "#FFFFFF", fontVariantNumeric: "tabular-nums", display: "inline-block", transform: `scale(${(1 + 0.12 * bell(f, lastLand, 12)).toFixed(3)})`, transformOrigin: "100% 80%", textShadow: `0 0 ${(18 * bell(f, lastLand, 14)).toFixed(1)}px rgba(253,185,39,0.8)` }}>
          {kobePts}
        </span>
      </div>
      {/* the Raptors since the half: a red LED count, crawling */}
      <div style={{ ...blurIn(f, mount + 4, { dur: 8 }), position: "absolute", left: BOARD.x0 - 22, top: BOARD.y0 + 8 * BOARD.pitch + 108, width: 9 * BOARD.pitch + 22, height: 86 }}>
        <div style={{ position: "absolute", left: 0, top: 2, fontFamily: theme.font.ui, fontSize: 24, fontWeight: 600, lineHeight: 1.15, color: GREY, letterSpacing: 0.5 }}>
          RAPTORS
          <br />
          <span style={{ fontSize: 22, letterSpacing: 0.3 }}>since half</span>
        </div>
        <div style={{ position: "absolute", right: 0, top: 4 }}>
          <StaplesNightReadout text={String(torSince)} h={50} w={70} color={StaplesNightLed.red} dim={StaplesNightLed.redDim} glow={1 + (torSince !== torPrev ? 0.8 : 0)} pad={2} />
        </div>
      </div>

      {/* ---------- the photos: the dunk on "drives", the follow-through on "free throws" */}
      {f >= tDrives - 2 && f < tEvery + 2 && (
        <div style={{ ...cardsOut, position: "absolute", left: 790, top: 1146, width: 200, height: 290 }}>
          <div style={{ ...dunkIn, position: "absolute", inset: 0, borderRadius: 18, overflow: "hidden", border: `2px solid ${ground.hairline}`, background: ground.card, boxShadow: "0 18px 40px rgba(0,0,0,0.5)" }}>
            <Img src={staticFile("kobe-81/thirdquartercourt-dunk.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 200, height: 285, objectFit: "cover", transform: `scale(${(1.04 + 0.05 * prog(f, tDrives, 60, ease.linear)).toFixed(4)})` }} />
            <Img src={staticFile("kobe-81/thirdquartercourt-ft.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 200, height: 285, objectFit: "cover", opacity: ftCard, transform: `translateX(${((1 - ftCard) * 40).toFixed(1)}px) scale(${(1.04 + 0.04 * prog(f, tFree, 60, ease.linear)).toFixed(4)})` }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 70, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.75))" }} />
            <div style={{ position: "absolute", right: 10, bottom: 8, textAlign: "right", fontFamily: theme.font.ui, fontSize: 18, lineHeight: 1.2, color: "#C9D1D9" }}>
              {ftCard > 0.5 ? (
                <>
                  Jeramey Jannene
                  <br />
                  CC BY 2.0
                </>
              ) : (
                <>
                  Cpl. Megan Stiner, USMC
                  <br />
                  public domain
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------- the play-by-play rows, BBR copy */}
      {f >= tEvery - 4 && (
        <div style={{ ...blurIn(f, tEvery - 4, { dur: 8, rise: 20 }), position: "absolute", left: LIST.x, top: LIST.y, width: LIST.w, height: LIST.pitch * LIST.rows + 12, borderRadius: 16, background: ground.card, border: `2px solid ${ground.hairline}`, overflow: "hidden", WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.15) 0px, #000 14px)", maskImage: "linear-gradient(180deg, rgba(0,0,0,0.15) 0px, #000 14px)" }}>
          {ROWS.map((r, i) => {
            if (f < rowAt[i]) return null;
            const y = 6 + i * LIST.pitch - scroll;
            if (y < -LIST.pitch || y > LIST.pitch * LIST.rows + 12) return null;
            const k = prog(f, rowAt[i], 7, ease.out);
            const hit = bell(f, rowAt[i], 18);
            const isLead = r.clock === "1:11.0";
            const name = interpolateColors(himGold, [0, 1], ["#FFFFFF", GOLD]);
            const rest = r.text.replace(/^K\. Bryant /, "");
            return (
              <div key={r.clock + r.play} style={{ position: "absolute", left: 0, top: y, width: LIST.w, height: LIST.pitch, opacity: k, transform: `translateX(${((1 - k) * 60).toFixed(1)}px)`, display: "flex", alignItems: "center", background: i % 2 ? "rgba(255,255,255,0.025)" : "transparent", boxShadow: hit > 0.02 ? `inset 0 0 0 200px rgba(253,185,39,${(0.10 * hit).toFixed(3)})` : undefined }}>
                <span style={{ width: 142, paddingLeft: 16, flexShrink: 0, fontFamily: theme.font.ui, fontSize: 30, color: GREY, fontVariantNumeric: "tabular-nums" }}>{r.clock}</span>
                <span style={{ width: 110, flexShrink: 0, fontFamily: theme.font.ui, fontSize: 30, color: isLead && f >= leadAt ? "#FFFFFF" : GREY, fontWeight: isLead ? 700 : 400, fontVariantNumeric: "tabular-nums" }}>{`${r.tor}-${r.lal}`}</span>
                <span style={{ fontFamily: theme.font.ui, fontSize: 31, fontWeight: 700, color: INK, whiteSpace: "nowrap", letterSpacing: -0.2 }}>
                  <span style={{ color: name, textShadow: himGold > 0.05 ? `0 0 ${(12 * bell(f, tHim - 1, 24)).toFixed(1)}px rgba(253,185,39,0.9)` : undefined }}>K. Bryant</span> {rest}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------- source line */}
      <div style={{ ...blurIn(f, tPull + 6, { dur: 8 }), position: "absolute", left: 90, top: 1458, fontFamily: theme.font.ui, fontSize: 26, color: GREY }}>
        {f < tEvery ? "Basketball-Reference shot chart" : "Basketball-Reference play-by-play"}
      </div>

      {/* ---------- the scoreboard, small at the top, running the real clock */}
      <StaplesNightBoard
        st={{
          power: 1,
          tor: now.tor,
          lal: now.lal,
          period: ended ? "END 3RD" : "3RD",
          clock: ended ? "0.0" : fmtClock(G),
          flashTor,
          flashLal: flashLal + leadFlash * 1.4 + endFlash * 1.2,
          flareTor: lead ? 0 : 0.25,
          logoTor: 1,
          logoLal: 1,
        }}
      />
      {/* the gold flash along the LAKERS row: the lead on the 1:11 dunk, END 3RD on "front" */}
      {(leadFlash > 0.01 || endFlash > 0.01 || f >= tFront) && (
        <div
          style={{
            position: "absolute",
            left: StaplesNightBoardRect.x + 4,
            top: StaplesNightBoardRect.y + 80,
            width: StaplesNightBoardRect.w - 8,
            height: 70,
            borderRadius: 8,
            pointerEvents: "none",
            mixBlendMode: "screen",
            background: `linear-gradient(90deg, rgba(253,185,39,0) ${(prog(f, tFront - 1, 18, ease.out) * 100 - 30).toFixed(1)}%, rgba(253,185,39,${(0.32 * endFlash + 0.22 * leadFlash).toFixed(3)}) ${(prog(f, tFront - 1, 18, ease.out) * 100).toFixed(1)}%, rgba(253,185,39,0) ${(prog(f, tFront - 1, 18, ease.out) * 100 + 30).toFixed(1)}%)`,
            boxShadow: `0 0 ${(30 * (leadFlash + endFlash)).toFixed(1)}px rgba(253,185,39,${(0.35 * (leadFlash + endFlash)).toFixed(3)}), inset 0 0 0 2px rgba(253,185,39,${(0.5 * Math.max(leadFlash, endFlash, f >= tFront ? 0.5 : 0)).toFixed(3)})`,
          }}
        />
      )}
    </>
  );
};
