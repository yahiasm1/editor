// "Early in the third quarter, the Lakers fell behind by 18. So Kobe just decided to win it himself."
// The game flow card (the broadcast stat screen ESPN keeps for this very game), redrawn from every scoring play on
// Basketball-Reference: a red Raptors line and a white Lakers line climb across 48 marked minutes as steps, the gap
// between them fills dark red as it widens, the live gap rolls with each real play to 18 at 3RD 9:23 (71-53) while
// the reel's scoreboard runs the same clock. Kobe rises at the tip of the Lakers line; a gold ripple finds every step
// he made, the tip turns into one of his gold bulbs and climbs to his real next basket (8:42, 71-55): 18 rolls to 16.
// The 9 x 9 board from `halftime` waits small in the top right corner.
import React from "react";
import { Img, interpolateColors, staticFile } from "remotion";
import { blurIn, ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { StaplesNightBoard } from "./StaplesNightBoard";
import { HalftimeBoosGrid } from "./HalftimeBoosKit";
import scoring from "../assets/refs/kobe-81-scoring.json";

type DeficitFlowChartEv = { q: number; clock: string; team: string; pts: number; kobe: boolean; play: string; tor: number; lal: number };
const DeficitFlowChartEvents = (scoring as { events: DeficitFlowChartEv[] }).events.map((e) => {
  const [mm, ss] = e.clock.split(":");
  const left = Number(mm) + Number(ss) / 60;
  return { ...e, m: (e.q - 1) * 12 + (12 - left) };
});

/** where the board waits for `takeover`: socket centres, pitch and bulb radius */
export const DeficitFlowChartCornerBoard = { x0: 812, y0: 778, pitch: 19, r: 7 };

const GOLD = "#FDB927";
const RED = "#CE1141";
const WHITE = "#F0F3F6";
const GREY = "#8B949E";
const KOBE_IMG = "kobe-81/deficitflowchart-kobe.png"; // 520 x 829, hand cut-out of the gold #8 photo

// the card and the chart in world px (before the camera)
const CARD = { x: 90, y: 740, w: 900, h: 700 };
const PX0 = 160;
const PX1 = 966;
const PY0 = 1330; // 0 points
const PY1 = 830; // 125 points
const wx = (m: number) => PX0 + (m / 48) * (PX1 - PX0);
const wy = (p: number) => PY0 - (p / 125) * (PY0 - PY1);

const M_LOW = 24 + (12 - (9 + 23 / 60)); // 3RD 9:23
const M_NEXT = 24 + (12 - (8 + 42 / 60)); // 3RD 8:42

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const bell = (f: number, at: number, dur: number) => {
  const t = (f - at) / dur;
  return t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t);
};

/** the score of both teams after every play up to game minute m */
const DeficitFlowChartScoreAt = (m: number) => {
  let tor = 0;
  let lal = 0;
  let last: (typeof DeficitFlowChartEvents)[number] | null = null;
  for (const e of DeficitFlowChartEvents) {
    if (e.m > m + 1e-6) break;
    tor = e.tor;
    lal = e.lal;
    last = e;
  }
  return { tor, lal, last };
};

const fmtClock = (m: number) => {
  const q = Math.min(4, Math.floor(m / 12 + 1e-9) + 1);
  const left = Math.max(0, q * 12 - m);
  const s = Math.round(left * 60);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** one bulb in the reel's look: socket ring, glass globe, hot core, halo */
const DeficitFlowChartBulb: React.FC<{ x: number; y: number; r: number; lit: number; glow?: number; color?: string }> = ({ x, y, r, lit, glow = 1, color = GOLD }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
    {lit > 0.01 && (
      <div style={{ position: "absolute", left: -r * 1.6, top: -r * 1.6, width: r * 5.2, height: r * 5.2, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 62%)`, opacity: 0.42 * lit * glow }} />
    )}
    <div style={{ position: "absolute", inset: -Math.max(1, r * 0.13), borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #2a3038 0%, #12161c 70%)", border: `${Math.max(1, r * 0.065).toFixed(2)}px solid #3b424c` }} />
    {lit > 0.01 && (
      <div style={{ position: "absolute", inset: Math.max(0.5, r * 0.05), borderRadius: "50%", background: `radial-gradient(circle at 46% 40%, #FFFDF4 0%, ${color} 40%, ${color} 70%, rgba(0,0,0,0.35) 100%)`, opacity: lit, boxShadow: `0 0 ${(r * 0.6 * glow * lit).toFixed(1)}px ${color}` }} />
    )}
    <div style={{ position: "absolute", left: r * 0.45, top: r * 0.3, width: r * 0.55, height: r * 0.32, borderRadius: "50%", background: "rgba(255,255,255,0.55)", opacity: 0.25 + 0.5 * lit, transform: "rotate(-28deg)" }} />
  </div>
);

export const DeficitFlowChart: React.FC = () => {
  const { f, scene, cue, endsOn, theme, ground } = useScene();
  const mount = scene.from - LEAD;

  const tThird = cue("third");
  const tLakers = cue("Lakers");
  const t18 = cue("18");
  const tSo = cue("So");
  const tKobe = cue("Kobe");
  const tJust = cue("just");
  const tDecided = cue("decided");
  const tHimself = cue("himself");

  // ---------------------------------------------------------------- the game clock that drives everything
  const raceA = mount + 4;
  const raceB = tThird - 3;
  const lowAt = endsOn("18", 2);
  const lungeAt = tHimself - 3;
  const gameM = (fr: number) => {
    if (fr < raceB) return 24 * prog(fr, raceA, raceB - raceA, ease.inOut);
    if (fr < tThird + 2) return 24;
    if (fr < lungeAt) return lerp(24, M_LOW, prog(fr, tThird + 2, lowAt - tThird - 2, (t) => 1 - Math.pow(1 - t, 1.35)));
    return lerp(M_LOW, M_NEXT, prog(fr, lungeAt, 7, ease.out));
  };
  const T = gameM(f);
  const now = DeficitFlowChartScoreAt(T);
  const prev = DeficitFlowChartScoreAt(gameM(f - 6));
  const inThird = f >= tThird;

  // the tip: the Lakers line jumps to 55 with weight on "himself"
  const lunge = prog(f, lungeAt, 9, ease.back);
  const lalTip = f >= lungeAt ? lerp(53, 55, lunge) : now.lal;

  // ---------------------------------------------------------------- the camera: a push in on the tip
  const F = { x: wx(M_LOW), y: wy(62) };
  const S1 = { x: 470, y: 1010 };
  const z = prog(f, tLakers - 6, lowAt - tLakers + 10, ease.inOut);
  const late = prog(f, t18 + 6, scene.to - t18, ease.linear);
  const k = 1 + 0.3 * z + 0.035 * late;
  const S = { x: lerp(F.x, S1.x, z) - 6 * late, y: lerp(F.y, S1.y, z) };
  const cx = (x: number) => S.x + (x - F.x) * k;
  const cy = (y: number) => S.y + (y - F.y) * k;
  const X = (m: number) => cx(wx(m));
  const Y = (p: number) => cy(wy(p));

  // ---------------------------------------------------------------- the two step lines and the wash
  const stepPath = (team: "TOR" | "LAL", upto: number, tipVal?: number) => {
    let d = `M${X(0).toFixed(1)},${Y(0).toFixed(1)}`;
    let v = 0;
    for (const e of DeficitFlowChartEvents) {
      if (e.m > upto + 1e-6) break;
      const nv = team === "TOR" ? e.tor : e.lal;
      if (nv !== v) {
        d += ` H${X(e.m).toFixed(1)} V${Y(nv).toFixed(1)}`;
        v = nv;
      }
    }
    d += ` H${X(upto).toFixed(1)}`;
    if (tipVal !== undefined && tipVal !== v) d += ` V${Y(tipVal).toFixed(1)}`;
    return d;
  };
  const torD = stepPath("TOR", T);
  const lalD = stepPath("LAL", T, f >= lungeAt ? lalTip : undefined);

  // wash rectangles wherever Toronto leads, deeper as the gap widens
  const wash: { x0: number; x1: number; top: number; bot: number; gap: number }[] = [];
  {
    let tor = 0;
    let lal = 0;
    let m0 = 0;
    const push = (m1: number) => {
      if (m1 > m0 && tor > lal) wash.push({ x0: X(m0), x1: X(m1), top: Y(tor), bot: Y(lal), gap: tor - lal });
    };
    for (const e of DeficitFlowChartEvents) {
      if (e.m > T + 1e-6) break;
      push(e.m);
      tor = e.tor;
      lal = e.lal;
      m0 = e.m;
    }
    push(T);
  }
  const washK = 0.55 + 0.45 * prog(f, tLakers, lowAt - tLakers, ease.inOut);

  // Kobe's own steps on the white line, lit gold in a ripple ending on "decided"
  const kobeSteps = DeficitFlowChartEvents.filter((e) => e.team === "LAL" && e.kobe && e.m <= M_LOW + 1e-6);
  const rippleA = tJust - 4;
  const rippleB = tDecided - 2;
  const stepGold = (i: number) => {
    const at = rippleA + ((rippleB - rippleA) * i) / Math.max(1, kobeSteps.length - 1);
    return { lit: prog(f, at, 5, ease.out), flash: bell(f, at, 14) };
  };

  // every third-quarter play rings out on its step the frame the clock crosses it
  const bursts = DeficitFlowChartEvents.filter((e) => e.q === 3 && e.m <= M_NEXT + 1e-6).map((e) => {
    let at = -1;
    for (let fr = tThird; fr <= lungeAt + 8; fr++) {
      if (gameM(fr) >= e.m - 1e-6) {
        at = fr;
        break;
      }
    }
    return { e, at };
  });

  // ---------------------------------------------------------------- axes, labels
  const axisIn = (i: number, n: number) => prog(f, mount + 2 + (i * 12) / n, 10, ease.out);
  const q3Light = prog(f, tThird - 2, 8, ease.out);

  // ---------------------------------------------------------------- the gap readout at the tip
  const gapNow = (inThird ? now.tor : 63) - (f >= lungeAt ? Math.round(lalTip) : inThird ? now.lal : 49);
  const gapIn = prog(f, tThird, 8, ease.out);
  const gapPop = bell(f, t18 - 1, 16);
  const gapRoll = f >= lungeAt ? prog(f, lungeAt + 2, 10, ease.out) : 1;
  const tipX = X(T);
  const torY = Y(inThird ? now.tor : 63);
  const lalY = Y(f >= lungeAt ? lalTip : inThird ? now.lal : 49);
  const hair = prog(f, t18 - 3, 8, ease.out);

  // ---------------------------------------------------------------- Kobe
  const rise = prog(f, tSo - 4, 20, ease.out);
  const riseBack = prog(f, tSo - 4, 26, ease.back);
  const axisY = Y(0);
  const KH = 430;
  const KW = (KH * 520) / 829;
  const kobeX = tipX + 34;
  const kobeTop = axisY - KH + 64 + (1 - riseBack) * (KH + 20);
  const tipGold = prog(f, tDecided - 1, 6, ease.out);
  const tipFlash = bell(f, tDecided - 1, 18) + bell(f, tHimself, 18) * 1.2;

  // ---------------------------------------------------------------- the waiting 9 x 9 board
  const B = DeficitFlowChartCornerBoard;
  const G = HalftimeBoosGrid;
  const kb = prog(f, mount, 26, ease.inOut);
  const breathe = 0.88 + 0.12 * Math.sin(f * 0.11);

  // ---------------------------------------------------------------- scoreboard
  const sbTor = inThird ? now.tor : 63;
  const sbLal = f >= lungeAt + 4 ? 55 : inThird ? now.lal : 49;
  const flashTor = inThird && now.tor !== prev.tor ? 1 : 0;
  const flashLal = (inThird && now.lal !== prev.lal ? 1 : 0) + bell(f, lungeAt + 4, 20) * 1.2;
  const clockM = f >= lungeAt + 4 ? M_NEXT : inThird ? Math.max(24, T) : 24;

  // the play that moved the tip (BBR copy)
  const play = f >= lungeAt + 4 ? DeficitFlowChartScoreAt(M_NEXT).last : inThird && now.last && now.last.q === 3 ? now.last : null;
  const playKey = play ? `${play.clock}|${play.play}` : "";
  const playAt = (() => {
    if (!play) return 0;
    if (f >= lungeAt + 4) return lungeAt + 4;
    for (let fr = f; fr > tThird; fr--) {
      const p = DeficitFlowChartScoreAt(gameM(fr - 1)).last;
      if (!p || `${p.clock}|${p.play}` !== playKey) return fr;
    }
    return tThird;
  })();
  const playClock = play ? play.clock.replace(/\.0$/, "") : "";

  const cardIn = blurIn(f, mount, { dur: 10, rise: 30 });
  const clipId = "deficitflowchart-clip";
  const glowId = "deficitflowchart-glow";

  return (
    <>
      {/* ---------- the game flow card */}
      <div style={{ ...cardIn, position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 24, background: ground.card, border: `2px solid ${ground.hairline}`, boxShadow: "0 30px 80px rgba(0,0,0,0.55)", overflow: "hidden" }}>
        {/* a faint light drifting over the card, like a broadcast screen */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 45% at ${(30 + 40 * prog(f, mount, scene.to - mount, ease.linear)).toFixed(1)}% 35%, rgba(255,255,255,0.035), rgba(255,255,255,0) 70%)` }} />
      </div>

      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: cardIn.opacity as number }}>
        <defs>
          <clipPath id={clipId}>
            <rect x={CARD.x + 64} y={CARD.y + 50} width={CARD.w - 66} height={CARD.h - 52} rx={22} />
          </clipPath>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          {/* Q3 band */}
          <rect x={X(24)} y={Y(125)} width={X(36) - X(24)} height={Y(0) - Y(125)} fill="#FFFFFF" opacity={0.045 * q3Light} />
          {/* gridlines every 25 points */}
          {[0, 25, 50, 75, 100, 125].map((p, i) => (
            <line key={p} x1={X(0)} x2={X(0) + (X(48) - X(0)) * axisIn(i, 6)} y1={Y(p)} y2={Y(p)} stroke={p === 0 ? "#4A525C" : ground.hairline} strokeWidth={p === 0 ? 2 : 1.2} />
          ))}
          {/* quarter dividers, minute ticks */}
          {[12, 24, 36].map((m, i) => (
            <line key={m} x1={X(m)} x2={X(m)} y1={Y(0)} y2={Y(0) - (Y(0) - Y(125)) * axisIn(i + 2, 6)} stroke={m === 24 ? "#3E4650" : ground.hairline} strokeWidth={1.2} />
          ))}
          {Array.from({ length: 49 }, (_, m) => (
            <line key={`t${m}`} x1={X(m)} x2={X(m)} y1={Y(0)} y2={Y(0) + (m % 12 === 0 ? 14 : 7) * axisIn(m / 8, 6)} stroke="#4A525C" strokeWidth={m % 12 === 0 ? 2 : 1} />
          ))}
          {/* the wash */}
          {wash.map((r, i) => (
            <rect key={`w${i}`} x={r.x0} y={r.top} width={Math.max(0, r.x1 - r.x0) + 0.6} height={r.bot - r.top} fill={RED} opacity={(0.07 + 0.24 * Math.min(1, r.gap / 18)) * washK} />
          ))}
          {/* the lines: glow under, crisp over */}
          <path d={torD} fill="none" stroke={RED} strokeWidth={8} opacity={0.55} filter={`url(#${glowId})`} />
          <path d={lalD} fill="none" stroke={WHITE} strokeWidth={8} opacity={0.3} filter={`url(#${glowId})`} />
          <path d={torD} fill="none" stroke={RED} strokeWidth={4.5} strokeLinejoin="round" />
          <path d={lalD} fill="none" stroke={WHITE} strokeWidth={4.5} strokeLinejoin="round" />
          {/* Kobe's steps, gold */}
          {kobeSteps.map((e, i) => {
            const g = stepGold(i);
            if (g.lit <= 0.01) return null;
            const x = X(e.m);
            return (
              <g key={`k${i}`}>
                <line x1={x} x2={x} y1={Y(e.lal - e.pts)} y2={Y(e.lal)} stroke={GOLD} strokeWidth={10} opacity={0.6 * g.flash} filter={`url(#${glowId})`} />
                <line x1={x} x2={x} y1={Y(e.lal - e.pts) + 1} y2={Y(e.lal) - 1} stroke={GOLD} strokeWidth={4.5 + 2 * g.flash} opacity={g.lit} strokeLinecap="round" />
              </g>
            );
          })}
          {/* the lunge on "himself": his 21 ft jumper, gold */}
          {f >= lungeAt && (
            <line x1={tipX} x2={tipX} y1={Y(53)} y2={lalY} stroke={GOLD} strokeWidth={6} strokeLinecap="round" />
          )}
          {/* the plays ringing out */}
          {bursts.map(({ e, at }, i) => {
            if (at < 0 || f < at || f > at + 22) return null;
            const t = (f - at) / 22;
            const col = e.team === "TOR" ? RED : e.kobe ? "#FFFFFF" : "#FFFFFF";
            return <circle key={`r${i}`} cx={X(e.m)} cy={Y(e.team === "TOR" ? e.tor : e.lal)} r={8 + 34 * t} fill="none" stroke={col} strokeWidth={3 * (1 - t)} opacity={0.9 * (1 - t)} />;
          })}
          {/* the gap hairline */}
          {hair > 0.01 && (
            <g opacity={hair}>
              <line x1={tipX} x2={tipX} y1={torY + 9} y2={torY + 9 + (lalY - torY - 18) * hair} stroke="#C9D1D9" strokeWidth={2} />
              <line x1={tipX - 10} x2={tipX + 10} y1={torY + 9} y2={torY + 9} stroke="#C9D1D9" strokeWidth={2} />
              <line x1={tipX - 10} x2={tipX + 10} y1={lalY - 9} y2={lalY - 9} stroke="#C9D1D9" strokeWidth={2} opacity={hair} />
            </g>
          )}
        </g>
        {/* y labels */}
        {[25, 50, 75, 100, 125].map((p, i) => {
          const y = Y(p);
          if (y < CARD.y + 60 || y > CARD.y + CARD.h - 40) return null;
          return (
            <text key={`y${p}`} x={Math.max(CARD.x + 18, X(0) - 16)} y={y + 9} textAnchor={X(0) - 16 < CARD.x + 18 ? "start" : "end"} fontFamily={theme.font.ui} fontSize={26} fill={GREY} opacity={axisIn(i, 6)}>
              {p}
            </text>
          );
        })}
        {/* quarter labels and HALF */}
        {["Q1", "Q2", "Q3", "Q4"].map((q, i) => {
          const x = X(i * 12 + 6);
          if (x < CARD.x + 30 || x > CARD.x + CARD.w - 30) return null;
          const lit = i === 2 ? q3Light : 0;
          return (
            <text key={q} x={x} y={Math.min(Y(0) + 46, CARD.y + CARD.h - 52)} textAnchor="middle" fontFamily={theme.font.ui} fontWeight={i === 2 ? 700 : 500} fontSize={30} fill={interpolateColors(lit, [0, 1], [GREY, "#FFFFFF"])} opacity={axisIn(i + 1, 6)}>
              {q}
            </text>
          );
        })}
        {X(24) > CARD.x + 30 && Y(125) > CARD.y + 60 && (
          <text x={X(24) + 10} y={Y(125) + 26} fontFamily={theme.font.ui} fontSize={24} fill={GREY} opacity={axisIn(3, 6)}>
            HALF 63-49
          </text>
        )}
      </svg>

      {/* ---------- the tips: dots and logos riding them */}
      {T > 0.05 && (
        <>
          <div style={{ position: "absolute", left: tipX - 9, top: torY - 9, width: 18, height: 18, borderRadius: "50%", background: RED, boxShadow: `0 0 14px ${RED}` }} />
          <Img src={staticFile("kobe-81/nba-raptors-primary.svg")} style={{ position: "absolute", left: tipX + 16, top: torY - 25, width: 50, height: 50, objectFit: "contain" }} />
          <Img src={staticFile("kobe-81/nba-lakers-primary.svg")} style={{ position: "absolute", left: tipX - 66, top: lalY + 14, width: 58, height: 42, objectFit: "contain", opacity: 1 - rise }} />
          {tipGold < 0.99 && <div style={{ position: "absolute", left: tipX - 9, top: lalY - 9, width: 18, height: 18, borderRadius: "50%", background: WHITE, boxShadow: "0 0 12px rgba(255,255,255,0.7)", opacity: 1 - tipGold }} />}
          {tipGold > 0.01 && (
            <div style={{ position: "absolute", left: 0, top: 0, opacity: tipGold, transform: `scale(1)` }}>
              <DeficitFlowChartBulb x={tipX} y={lalY} r={13 + 5 * tipFlash} lit={1} glow={1.2 + 1.4 * tipFlash} />
            </div>
          )}
        </>
      )}

      {/* ---------- Kobe rises at the tip, from behind the floor line */}
      {rise > 0.001 && (
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y + 50, width: CARD.w, height: axisY - CARD.y - 50, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              left: kobeX - CARD.x,
              top: kobeTop - CARD.y - 50,
              width: KW,
              height: KH,
              opacity: Math.min(1, rise * 1.6),
              WebkitMaskImage: "linear-gradient(180deg, #000 70%, rgba(0,0,0,0) 96%)",
              maskImage: "linear-gradient(180deg, #000 70%, rgba(0,0,0,0) 96%)",
            }}
          >
            {tipFlash > 0.02 && (
              <div style={{ position: "absolute", left: KW * 0.05, top: KH * 0.02, width: KW * 0.9, height: KH * 0.8, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 45%, rgba(253,185,39,0.42) 0%, rgba(253,185,39,0.14) 45%, rgba(253,185,39,0) 70%)", opacity: Math.min(1, tipFlash) }} />
            )}
            <Img src={staticFile(KOBE_IMG)} style={{ position: "absolute", left: 0, top: 0, width: KW, height: KH }} />
          </div>
        </div>
      )}
      {rise > 0.001 && (
        <div style={{ ...blurIn(f, tKobe, { dur: 8 }), position: "absolute", right: 1080 - (CARD.x + CARD.w) + 18, top: B.y0 + 8 * B.pitch + 16, fontFamily: theme.font.ui, fontSize: 22, color: GREY, textAlign: "right", lineHeight: 1.25 }}>
          Sgt. Joseph A. Lee, USMC
          <br />
          public domain
        </div>
      )}

      {/* ---------- the gap, live, above the tip */}
      {gapIn > 0.01 && (
        <div style={{ position: "absolute", left: tipX - 160, top: Math.max(CARD.y + 58, torY - 170), width: 320, height: 130, opacity: gapIn, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ position: "relative", fontFamily: theme.font.ui, fontWeight: 800, fontSize: 118, lineHeight: 1, color: "#FFFFFF", fontVariantNumeric: "tabular-nums", transform: `scale(${(0.72 + 0.28 * hair + 0.16 * gapPop).toFixed(3)})`, transformOrigin: "50% 100%", textShadow: `0 0 ${(26 * gapPop).toFixed(1)}px rgba(255,255,255,0.6), 0 6px 18px rgba(0,0,0,0.6)` }}>
            {f >= lungeAt ? (
              <span style={{ display: "inline-block", position: "relative", height: 118, overflow: "hidden", verticalAlign: "bottom" }}>
                <span style={{ display: "block", transform: `translateY(${(-118 * gapRoll).toFixed(1)}px)` }}>
                  <span style={{ display: "block", height: 118 }}>18</span>
                  <span style={{ display: "block", height: 118 }}>16</span>
                </span>
              </span>
            ) : (
              <span>{gapNow}</span>
            )}
          </div>
        </div>
      )}

      {/* ---------- the waiting 9 x 9 board */}
      {Array.from({ length: 81 }, (_, i) => {
        const col = i % 9;
        const row = Math.floor(i / 9);
        const x = lerp(G.x0 + col * G.pitch, B.x0 + col * B.pitch, kb);
        const y = lerp(G.y0 + row * G.pitch, B.y0 + row * B.pitch, kb) - Math.sin(Math.PI * kb) * 30;
        const r = lerp(G.r, B.r, kb);
        return <DeficitFlowChartBulb key={`b${i}`} x={x} y={y} r={r} lit={i < 26 ? 1 : 0} glow={i < 26 ? breathe : 1} />;
      })}

      {/* ---------- the play that moved the tip, BBR copy */}
      {play && (
        <div key={playKey} style={{ ...blurIn(f, playAt, { dur: 6, rise: 8 }), position: "absolute", left: CARD.x + 26, top: CARD.y + 14, width: 690, height: 36, fontFamily: theme.font.ui, fontSize: 28, color: "#C9D1D9", whiteSpace: "nowrap", overflow: "hidden" }}>
          <span style={{ color: GREY, fontVariantNumeric: "tabular-nums", marginRight: 14 }}>{playClock}</span>
          {play.play.replace(/ \(assist by [^)]*\)/, "")}
        </div>
      )}
      {!play && (
        <div style={{ ...blurIn(f, mount + 6, { dur: 8 }), position: "absolute", left: CARD.x + 26, top: CARD.y + 14, fontFamily: theme.font.ui, fontSize: 28, color: GREY, opacity: 1 - prog(f, tThird, 6, ease.linear) }}>
          Game flow, Raptors at Lakers
        </div>
      )}
      <div style={{ ...blurIn(f, mount + 10, { dur: 8 }), position: "absolute", left: CARD.x + 26, top: CARD.y + CARD.h - 40, fontFamily: theme.font.ui, fontSize: 26, color: GREY }}>Basketball-Reference play-by-play</div>

      {/* ---------- the scoreboard, small at the top */}
      <div style={{ ...blurIn(f, mount, { dur: 8 }), position: "absolute", inset: 0 }}>
        <StaplesNightBoard
          st={{
            power: 1,
            tor: sbTor,
            lal: sbLal,
            period: inThird ? "3RD" : "HALF",
            clock: inThird ? fmtClock(clockM) : "0.0",
            flashTor: flashTor + bell(f, t18 - 2, 18) * 0.8,
            flashLal,
            flareTor: bell(f, t18 - 2, 30) * 0.8,
            logoTor: 1,
            logoLal: 1 + 0.2 * bell(f, lungeAt + 4, 16),
          }}
        />
      </div>
    </>
  );
};
