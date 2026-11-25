// wilt-100 "freethrows": the scorer's cream strip, held at hand scale. Typed: "13 CHAMBERLAIN" and his 1961-62 season
// line from the Basketball-Reference game log (FT 835-1362, .613, underlined in red pencil). Then it unrolls its FREE
// THROWS section: 32 numbered boxes, 4 rows of 8, each inked in pencil as a ball drops (28 checks, then 4 x's), and
// the night's line "FT 28-32 .875" typed under the season's, .875 right under .613. Beside it the big white count.
// Then the strip eases up and Johnny Kerr's line types under it on the dark.
import React from "react";
import { arrive, blurIn, draw, ease, pop, prog, typeOn } from "../../../src/engine";
import {
  FTT_ATT,
  FTT_COURIER,
  FTT_DIM,
  FTT_INK,
  FTT_MADE,
  FTT_PAPER,
  FTT_PENCIL,
  FTT_PUSH,
  FTT_RED,
  fttMadeBy,
  fttRnd,
  type FreeThrowT,
} from "./FreeThrowTallyKit";

// sheet geometry (stage px)
export const FTT_SHEET = { x: 44, y: 806, w: 760, hShort: 214, hFull: 626 };
const BOX = 72, GAP = 6, GRID_X = 44, GRID_Y = 252;
const SEASON = "1961-62 SEASON  FT 835-1362  .613";
const NIGHT = "MARCH 2, 1962   FT 28-32     .875";
const CH = 0.6; // Courier advance per em
const LINE_FS = 32;
const QUOTE = ["“He's the world's worst free-throw", "shooter and he's 28 out of 32!”"];

/** the frame each box is inked: makes first, then the misses (the order of the attempts is not on record) */
function inkAt(i: number, T: FreeThrowT) {
  return i < FTT_MADE ? T.makes[i] : T.misses[i - FTT_MADE];
}

const Check: React.FC<{ f: number; at: number; i: number; flash: number }> = ({ f, at, i, flash }) => {
  if (f < at) return null;
  const j = (k: number) => (fttRnd(i * 13 + k) - 0.5) * 9;
  const d = `M ${14 + j(1)} ${40 + j(2)} Q ${24 + j(3)} ${50 + j(4)} ${31 + j(5)} ${60 + j(6)} Q ${44 + j(7)} ${34 + j(8)} ${63 + j(9)} ${12 + j(10)}`;
  const w = 5.2 + fttRnd(i * 5) * 1.6 + flash * 2;
  return (
    <svg width={BOX} height={BOX} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path d={d} fill="none" stroke={FTT_PENCIL} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={0.92} {...draw(f, at, 5)} />
      <path d={d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.2} strokeLinecap="round" transform="translate(1,-1)" {...draw(f, at, 5)} />
    </svg>
  );
};

const Cross: React.FC<{ f: number; at: number; i: number; color: string; size?: number }> = ({ f, at, i, color, size = BOX }) => {
  if (f < at) return null;
  const j = (k: number) => (fttRnd(i * 31 + k) - 0.5) * 8;
  const s = size / BOX;
  return (
    <svg width={size} height={size} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`scale(${s})`}>
        <path d={`M ${18 + j(1)} ${18 + j(2)} L ${58 + j(3)} ${58 + j(4)}`} fill="none" stroke={color} strokeWidth={5.5} strokeLinecap="round" {...draw(f, at, 3)} />
        <path d={`M ${58 + j(5)} ${17 + j(6)} L ${17 + j(7)} ${59 + j(8)}`} fill="none" stroke={color} strokeWidth={5.5} strokeLinecap="round" {...draw(f, at + 3, 3)} />
      </g>
    </svg>
  );
};

export const FreeThrowTallySheet: React.FC<{ f: number; T: FreeThrowT; ui: string }> = ({ f, T, ui }) => {
  if (f < T.sheetIn - 2) return null;
  const S = FTT_SHEET;
  const inK = arrive(f, T.sheetIn, 20);
  const unrollK = prog(f, T.unroll, 18, FTT_PUSH);
  const liftK = prog(f, T.lift, 22, FTT_PUSH);
  const h = S.hShort + (S.hFull - S.hShort) * unrollK;
  const tx = (1 - inK) * 980;
  const ty = -300 * liftK;
  const rot = -3.2 * (1 - inK) - 1.1 + 0.4 * liftK;
  const drift = prog(f, T.sheetIn, T.end - T.sheetIn, (x) => x);
  const flash = f >= T.believe ? Math.exp(-(f - T.believe) / 12) * Math.min(1, (f - T.believe + 1) / 2) : 0;

  // typed lines
  const nameStart = T.sheetIn + 6;
  const name = typeOn("CHAMBERLAIN", f, nameStart, 60, 26);
  const seasonStart = T.terrible - Math.round((SEASON.length * 18) / 1000 * 60);
  const season = typeOn(SEASON, f, seasonStart, 60, 18);
  const underline = prog(f, T.terrible, 8, ease.out);
  const nightStart = T.n32 - Math.round((NIGHT.length * 16) / 1000 * 60);
  const night = typeOn(NIGHT, f, nightStart, 60, 16);
  const made = fttMadeBy(f, T);
  const sweep = -30 + 160 * drift;
  const pctX = (SEASON.length - 4) * LINE_FS * CH; // where .613 starts

  return (
    <div
      style={{
        position: "absolute",
        left: S.x,
        top: S.y,
        width: S.w,
        height: h,
        transformOrigin: "50% 0%",
        transform: `translate(${(tx + drift * 6).toFixed(1)}px, ${ty.toFixed(1)}px) perspective(1800px) rotateX(${(4 - 3 * liftK).toFixed(2)}deg) rotateZ(${rot.toFixed(2)}deg)`,
        filter: inK < 0.9 ? `blur(${((1 - inK) * 10).toFixed(1)}px)` : undefined,
      }}
    >
      {/* the paper: grain, a curl at the right edge, a soft shadow on the dark */}
      <div style={{ position: "absolute", inset: 0, background: FTT_PAPER, borderRadius: 3, boxShadow: "0 38px 70px rgba(0,0,0,0.6), 0 6px 16px rgba(0,0,0,0.45)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.5, background: "repeating-linear-gradient(112deg, rgba(120,98,60,0.07) 0 2px, transparent 2px 6px), repeating-linear-gradient(18deg, rgba(90,70,40,0.05) 0 1px, transparent 1px 4px)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.06) 100%)" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 60, background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(80,60,30,0.10) 70%, rgba(255,255,255,0.25) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, rgba(255,255,255,0) ${sweep - 16}%, rgba(255,250,232,0.22) ${sweep}%, rgba(255,255,255,0) ${sweep + 16}%)` }} />

        {/* the printed head of the form */}
        <div style={{ position: "absolute", left: 28, right: 28, top: 16, display: "flex", justifyContent: "space-between", fontFamily: FTT_COURIER, fontWeight: 700, fontSize: 22, letterSpacing: 1, color: "#4B443A" }}>
          <span>PHILADELPHIA vs NEW YORK</span>
          <span>HERSHEY, PA.</span>
        </div>
        <div style={{ position: "absolute", left: 20, right: 20, top: 48, borderTop: "2px solid #4B443A" }} />
        <div style={{ position: "absolute", left: 20, right: 20, top: 52, borderTop: "1px solid #4B443A" }} />
        <div style={{ position: "absolute", left: 28, top: 58, fontFamily: FTT_COURIER, fontSize: 18, color: "#6A6152" }}>No.</div>
        <div style={{ position: "absolute", left: 128, top: 58, fontFamily: FTT_COURIER, fontSize: 18, color: "#6A6152" }}>PLAYER</div>
        <div style={{ position: "absolute", left: 108, top: 56, height: 74, borderLeft: "1px solid #8C826F" }} />

        {/* typed: his number and name */}
        <div style={{ position: "absolute", left: 30, top: 78, fontFamily: FTT_COURIER, fontWeight: 700, fontSize: 50, lineHeight: "54px", color: FTT_INK, ...blurIn(f, nameStart - 2, { dur: 5 }) }}>13</div>
        <div style={{ position: "absolute", left: 128, top: 78, fontFamily: FTT_COURIER, fontWeight: 700, fontSize: 50, lineHeight: "54px", color: FTT_INK, letterSpacing: 1 }}>{name.text}</div>
        <div style={{ position: "absolute", left: 20, right: 20, top: 138, borderTop: "1px solid #8C826F" }} />

        {/* the season line, from the game log */}
        <div style={{ position: "absolute", left: 30, top: 152, fontFamily: FTT_COURIER, fontSize: LINE_FS, lineHeight: "40px", color: "#2A2620", whiteSpace: "pre" }}>{season.text}</div>
        <div style={{ position: "absolute", left: 30 + pctX - 4, top: 194, width: (4 * LINE_FS * CH + 10) * underline, height: 5, background: FTT_RED, borderRadius: 3, transform: "rotate(-1.2deg)", opacity: 0.9 }} />
        <div style={{ position: "absolute", left: 30 + pctX + 4 * LINE_FS * CH + 16, top: 150, width: 44, height: 44 }}>
          <Cross f={f} at={T.clang + 2} i={77} color={FTT_RED} size={44} />
        </div>

        {/* FREE THROWS: the 32 boxes */}
        {unrollK > 0.01 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: S.w, height: S.hFull, opacity: Math.min(1, unrollK * 3) }}>
            {/* on "believe" the rest of the paper drops a stop so the 28 boxes can flash */}
            {flash > 0.01 && <div style={{ position: "absolute", inset: 0, background: `rgba(40,30,15,${(0.32 * flash).toFixed(3)})` }} />}
            <div style={{ position: "absolute", left: 20, right: 20, top: 214, borderTop: "2px solid #4B443A" }} />
            <div style={{ position: "absolute", left: GRID_X, top: 222, fontFamily: FTT_COURIER, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: "#4B443A" }}>FREE THROWS</div>
            <div style={{ position: "absolute", right: GRID_X, top: 222, fontFamily: FTT_COURIER, fontSize: 20, color: "#6A6152" }}>1 BOX EACH ATTEMPT</div>
            {Array.from({ length: FTT_ATT }, (_, i) => {
              const row = Math.floor(i / 8), col = i % 8;
              const at = T.unroll + 4 + i * 0.6;
              const vis = prog(f, at, 6, ease.out);
              const done = i < FTT_MADE && f >= inkAt(i, T);
              const fl = done ? flash : 0;
              const ink = inkAt(i, T);
              const bump = f >= ink && f < ink + 8 ? Math.sin(((f - ink) / 8) * Math.PI) * 0.07 : 0;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: GRID_X + col * (BOX + GAP),
                    top: GRID_Y + row * (BOX + GAP),
                    width: BOX,
                    height: BOX,
                    border: fl > 0.01 ? `2px solid rgba(27,27,27,${(0.6 + 0.4 * fl).toFixed(3)})` : "2px solid #5C5446",
                    background: fl > 0.01 ? `rgba(255,255,250,${Math.min(1, 0.1 + fl * 1.1).toFixed(3)})` : "rgba(255,255,255,0.10)",
                    boxShadow: fl > 0.01 ? `0 0 ${(24 * fl).toFixed(1)}px rgba(255,255,255,${(fl * 0.9).toFixed(3)})` : undefined,
                    opacity: vis,
                    transform: `scale(${(0.86 + 0.14 * vis + fl * 0.06 + bump).toFixed(3)})`,
                  }}
                >
                  <div style={{ position: "absolute", left: 4, top: 1, fontFamily: FTT_COURIER, fontSize: 15, color: "#8C826F" }}>{i + 1}</div>
                  {i < FTT_MADE ? <Check f={f} at={inkAt(i, T)} i={i} flash={fl} /> : <Cross f={f} at={inkAt(i, T)} i={i} color={FTT_PENCIL} />}
                </div>
              );
            })}
            {/* the night's line under the season's */}
            <div style={{ position: "absolute", left: 20, right: 20, top: 570, borderTop: "1px solid #8C826F" }} />
            <div style={{ position: "absolute", left: 30, top: 576, fontFamily: FTT_COURIER, fontWeight: 700, fontSize: LINE_FS, lineHeight: "40px", color: FTT_INK, whiteSpace: "pre" }}>{night.text}</div>
          </div>
        )}
      </div>

      {/* the source, riding under the paper */}
      <div style={{ ...blurIn(f, T.sheetIn + 12, { dur: 8 }), position: "absolute", left: 22, top: h + 14, whiteSpace: "nowrap", fontFamily: ui, fontSize: 26, lineHeight: "32px", color: FTT_DIM, transform: `rotate(${(-rot * 0.6).toFixed(2)}deg)` }}>
        Basketball-Reference box score and game log 1961-62
      </div>

      {/* the count, big and white on the dark beside the boxes */}
      {unrollK > 0.01 && (
        <div style={{ position: "absolute", left: S.w + 8, top: 300, width: 216, textAlign: "center", fontFamily: ui, color: "#FFFFFF", transform: `rotate(${(-rot).toFixed(2)}deg)` }}>
          <div style={{ fontSize: 168, fontWeight: 800, lineHeight: "170px", letterSpacing: -4, fontVariantNumeric: "tabular-nums", ...(made > 0 ? {} : { opacity: 0.35 }), transform: `scale(${(1 + 0.12 * Math.exp(-Math.max(0, f - T.n28) / 5) * (f >= T.n28 ? 1 : 0) + flash * 0.05).toFixed(3)})` }}>
            {made}
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: "84px", color: "#C9D1D9", ...(f >= T.n32 - 6 ? pop(f, T.n32 - 6, { dur: 8 }) : { opacity: 0 }) }}>/ 32</div>
        </div>
      )}
    </div>
  );
};

/** Johnny Kerr's line, typed on the dark under the strip */
export const FreeThrowTallyQuote: React.FC<{ f: number; T: FreeThrowT; ui: string }> = ({ f, T, ui }) => {
  // it types once the strip has lifted most of the way, so its first letters never land on the night's line
  const start = T.lift + 16;
  if (f < start - 2) return null;
  const all = QUOTE.join("\n");
  const ms = ((T.believe - start) / 60) * 1000 / all.length;
  const t = typeOn(all, f, start, 60, ms);
  const lines = t.text.split("\n");
  const kerr = f >= T.believe ? blurIn(f, T.believe, { dur: 8, rise: 10 }) : { opacity: 0 };
  return (
    <div style={{ position: "absolute", left: 66, top: 1200, width: 960 }}>
      {QUOTE.map((_, i) => (
        <div key={i} style={{ height: 52, fontFamily: FTT_COURIER, fontSize: 40, lineHeight: "52px", color: "#B8C0C8", whiteSpace: "pre" }}>
          {lines[i] ?? ""}
          {t.typing && i === lines.length - 1 && <span style={{ opacity: Math.floor(f / 4) % 2 ? 0.2 : 0.9 }}>|</span>}
        </div>
      ))}
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14, ...kerr }}>
        <div style={{ width: 40, borderTop: `1px solid ${FTT_DIM}` }} />
        <div style={{ fontFamily: ui, fontSize: 34, fontWeight: 600, color: "#A8B0B8" }}>Johnny Kerr</div>
      </div>
    </div>
  );
};
