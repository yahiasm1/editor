// `percent`: "Over his career he made just 52.7 percent, and missed 5,317 free throws."
// Every free throw Shaq attempted (Basketball-Reference, 11,252 in 19 seasons) as one wall of real balls hanging on a
// coin-flip hairline. The quarter from `split` drops in and becomes the first ball; the makes glow up to just above
// the hairline as 52.7% counts; the misses turn foul red, fall out and pile on the Lakers free throw line while the
// counter beside them rolls to 5,317. Notes: notes/PercentWall.md.
import React from "react";
import { Img, staticFile } from "remotion";
import { useScene } from "../../../src/engine/context";
import { LEAD } from "../../../src/engine/Stage";
import { blurIn, blurOut, countTo, draw, ease, prog } from "../../../src/engine/moves";
import {
  PW_CARD,
  PW_COLW,
  PW_D,
  PW_GAP,
  PW_MARKS,
  PW_MISS_ORDER,
  PW_MISSED,
  PW_SEASONS,
  PW_YMID,
  pwColBottom,
  pwColTop,
  pwColX,
} from "./PercentWallKit";
import { PercentWallCanvas, PW_RED } from "./PercentWallCanvas";
import { PercentWallFloor } from "./PercentWallFloor";
import { PercentWallCoin } from "./PercentWallCoin";
import { PercentWallCell, usePercentWallCellFont } from "./PercentWallCell";

const BALL = staticFile("shaq-free-throws/percentwall-ball.png");
const RELS = PW_MISS_ORDER.map((m) => m.rel); // sorted
const GREY = "#8B949E";
// the empty rack's outline: the career's own silhouette, stepped season by season
const PW_SILHOUETTE = (() => {
  const n = PW_SEASONS.length;
  // the edge between two seasons sits in the middle of the gap, so every step is a clean vertical
  const edge = (c: number) => (c === 0 ? pwColX(0) - 2 : c === n ? pwColX(n - 1) + PW_COLW + 2 : pwColX(c) - PW_GAP / 2);
  const pts: string[] = [];
  for (let c = 0; c < n; c++) {
    const y = (pwColTop(c) - 2).toFixed(1);
    pts.push(`${c === 0 ? "M" : "L"}${edge(c).toFixed(1)} ${y}`, `L${edge(c + 1).toFixed(1)} ${y}`);
  }
  for (let c = n - 1; c >= 0; c--) {
    const y = (pwColBottom(c) + 2).toFixed(1);
    pts.push(`L${edge(c + 1).toFixed(1)} ${y}`, `L${edge(c).toFixed(1)} ${y}`);
  }
  return pts.join(" ") + " Z";
})();

function released(rel: number) {
  if (rel < 0) return 0;
  let lo = 0;
  let hi = RELS.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (RELS[mid] <= rel) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** a real ball, optionally foul red (the photo tinted, its shading kept) */
const PercentWallBall: React.FC<{ d: number; red?: boolean }> = ({ d, red }) => (
  <div style={{ position: "relative", width: d, height: d, borderRadius: "50%", overflow: "hidden", flex: "none" }}>
    <Img src={BALL} style={{ width: d, height: d, display: "block" }} />
    {red && <div style={{ position: "absolute", inset: 0, background: PW_RED, mixBlendMode: "color", opacity: 0.9 }} />}
    {red && <div style={{ position: "absolute", inset: 0, background: PW_RED, mixBlendMode: "multiply", opacity: 0.35 }} />}
  </div>
);

export const PercentWall: React.FC = () => {
  usePercentWallCellFont();
  const { f, scene, ground, theme, cue } = useScene();
  const mount = scene.from - LEAD;
  const cOver = cue("Over");
  const cCareer = cue("career");
  const cHe = cue("he");
  const cMade = cue("made");
  const c527 = cue("52.7");
  const cPercent = cue("percent");
  const cAnd = cue("and");
  const cMissed = cue("missed");
  const c5317 = cue("5,317");
  const build = cCareer - 1;
  const fillDur = c527 + 30 - cMade;
  const cues = { build, fill: cMade, fillDur, sweep: cPercent, missed: cMissed };

  // the coin: spinning where `split` left it, then falling into the first slot, shrinking to one ball
  const m0 = PW_MARKS[0];
  const fallT = prog(f, cOver, build - cOver, ease.in);
  const coinX = 540 + (m0.x - 540) * fallT;
  const coinY = 880 + (m0.y - 880) * fallT - 60 * Math.sin(Math.PI * Math.min(1, fallT * 1.4)) * (1 - fallT);
  const coinD = 200 * Math.pow(PW_D / 200, fallT * fallT);
  const spin = (f - mount) * 7 + 900 * fallT * fallT;
  const coinOn = f < build;

  // the loupe on the first ball
  const loupeOn = f >= build && f < cHe + 10;
  const loupeOut = blurOut(f, cHe, { dur: 9 });
  const loupeIn = blurIn(f, build + 2, { dur: 9, scaleFrom: 0.6 });

  const pct = countTo(f, cMade, fillDur, 0, 52.7);
  const missedNow = Math.min(PW_MISSED, released(f - cMissed));
  const dimMade = prog(f, cAnd, 12);

  const push = 1 + 0.04 * prog(f, c5317 + 30, scene.to - c5317 - 30, ease.inOut);
  const lineDraw = draw(f, cHe, 14);

  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${push.toFixed(4)})`, transformOrigin: "540px 1120px" }}>
      <PercentWallFloor />
      {/* the card the wall stands in, on the floor */}
      <div
        style={{
          position: "absolute",
          left: PW_CARD.x,
          top: PW_CARD.y,
          width: PW_CARD.w,
          height: PW_CARD.h,
          borderRadius: PW_CARD.r,
          background: `linear-gradient(180deg, ${ground.card} 0%, #131820 100%)`,
          border: `1.5px solid ${ground.hairline}`,
          boxShadow: "0 26px 40px rgba(0,0,0,0.55)",
          ...blurIn(f, mount, { dur: 7 }),
        }}
      />
      {/* the rack: one slot per season at its real height, empty until the balls pour in */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, ...blurIn(f, mount + 2, { dur: 8 }) }}>
        <path d={PW_SILHOUETTE} fill="rgba(255,255,255,0.02)" stroke={ground.hairline} strokeWidth={1.6} strokeLinejoin="round" />
        {/* the seasons, as faint joints in the empty rack */}
        {PW_SEASONS.slice(1).map((_, i) => {
          const c = i + 1;
          const top = Math.max(pwColTop(c), pwColTop(c - 1));
          const bot = Math.min(pwColBottom(c), pwColBottom(c - 1));
          const x = pwColX(c) - PW_GAP / 2;
          return <line key={c} x1={x} y1={top} x2={x} y2={bot} stroke={ground.hairline} strokeWidth={1} opacity={0.6} />;
        })}
      </svg>

      <PercentWallCanvas f={f} cues={cues} />

      {/* the coin-flip hairline: half of every season's attempts below it */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={198} y1={PW_YMID} x2={980} y2={PW_YMID} stroke={GREY} strokeWidth={2.2} {...lineDraw} />
      </svg>
      <div
        style={{
          position: "absolute",
          right: 1080 - 192,
          top: PW_YMID - 34,
          fontFamily: theme.font.ui,
          fontWeight: 600,
          fontSize: 25,
          color: GREY,
          whiteSpace: "nowrap",
          ...blurIn(f, cHe + 6, { dur: 8 }),
        }}
      >
        coin flip
      </div>

      {/* the two seasons at the ends */}
      {[
        { c: 0, at: build + 3, align: "left" as const },
        { c: PW_SEASONS.length - 1, at: build + (PW_SEASONS.length - 1) * 2 + 18, align: "right" as const },
      ].map(({ c, at, align }) => (
        <div
          key={c}
          style={{
            position: "absolute",
            top: 1236,
            left: align === "left" ? pwColX(c) - 6 : undefined,
            right: align === "right" ? 1080 - (pwColX(c) + PW_COLW + 4) : undefined,
            fontFamily: theme.font.ui,
            fontSize: 24,
            fontWeight: 500,
            color: GREY,
            ...blurIn(f, at, { dur: 8 }),
          }}
        >
          {PW_SEASONS[c].s}
        </div>
      ))}

      {/* the coin from `split` */}
      {coinOn && (
        <div style={{ position: "absolute", left: coinX, top: coinY, perspective: 900, ...blurIn(f, mount, { dur: 6 }) }}>
          {fallT < 0.95 && (
            <div
              style={{
                position: "absolute",
                left: -coinD * 0.6,
                top: coinD * 0.62,
                width: coinD * 1.2,
                height: coinD * 0.22,
                borderRadius: "50%",
                background: "radial-gradient(closest-side, rgba(0,0,0,0.45), rgba(0,0,0,0))",
                opacity: 1 - fallT,
              }}
            />
          )}
          <PercentWallCoin d={coinD} rx={spin} rz={-8} />
        </div>
      )}
      {/* the landing: one small ring where the coin became a ball */}
      {f >= build && f < build + 14 && (
        <div
          style={{
            position: "absolute",
            left: m0.x,
            top: m0.y,
            width: 0,
            height: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -(4 + (f - build) * 2.2),
              top: -(4 + (f - build) * 2.2),
              width: 2 * (4 + (f - build) * 2.2),
              height: 2 * (4 + (f - build) * 2.2),
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.9)",
              opacity: 1 - (f - build) / 14,
            }}
          />
        </div>
      )}

      {/* the loupe: what one mark is */}
      {loupeOn && (
        <>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: f >= cHe ? Number(loupeOut.opacity) : 1 }}>
            <path d={`M176 716 L176 ${m0.y} L${m0.x - 4} ${m0.y}`} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={1.6} {...draw(f, build, 10)} />
          </svg>
          <div style={{ position: "absolute", left: 101, top: 566, width: 150, height: 150, ...(f >= cHe ? loupeOut : loupeIn) }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "radial-gradient(circle at 40% 35%, #1E2631, #0B0F15)",
                border: "5px solid #C9CED6",
                boxShadow: "inset 0 0 0 2px #59606B, 0 10px 24px rgba(0,0,0,0.55)",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", left: 18, top: 18 }}>
                <PercentWallBall d={104} />
              </div>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(140deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 40%)" }} />
            </div>
            <div style={{ position: "absolute", left: 166, top: 50, whiteSpace: "nowrap", fontFamily: theme.font.ui, fontWeight: 600, fontSize: 32, color: "#FFFFFF" }}>
              1 free throw
            </div>
          </div>
        </>
      )}

      {/* 52.7%, and the real cell it comes from */}
      {f >= cMade - 4 && (
        <div style={{ position: "absolute", left: 116, top: 534, opacity: 1 - 0.4 * dimMade, transformOrigin: "0 0", transform: `scale(${(1 - 0.08 * dimMade).toFixed(4)})` }}>
          <div style={{ ...blurIn(f, cMade - 4, { dur: 8, rise: 16 }) }}>
            <div style={{ fontFamily: theme.font.caption, fontWeight: 800, fontSize: 150, lineHeight: "150px", color: "#FFFFFF", letterSpacing: -3, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
              {pct.toFixed(1)}
              <span style={{ fontSize: 84, letterSpacing: 0, marginLeft: 4 }}>%</span>
            </div>
          </div>
          <div style={{ marginTop: 6, ...blurIn(f, c527 + 18, { dur: 9, rise: 14 }) }}>
            <PercentWallCell hi={prog(f, c527 + 32, 10)} dimOthers={1} />
          </div>
        </div>
      )}

      {/* 5,317, rolling with the balls actually leaving */}
      {f >= cAnd && (
        <div style={{ position: "absolute", right: 1080 - 966, top: 534, textAlign: "right", ...blurIn(f, cAnd, { dur: 8, rise: 16 }) }}>
          <div style={{ fontFamily: theme.font.caption, fontWeight: 800, fontSize: 150, lineHeight: "150px", color: "#FFFFFF", letterSpacing: -3, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
            {missedNow.toLocaleString("en-US")}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginTop: 4 }}>
            <PercentWallBall d={30} red />
            <div style={{ fontFamily: theme.font.ui, fontWeight: 600, fontSize: 32, color: GREY }}>missed</div>
          </div>
        </div>
      )}
    </div>
  );
};
