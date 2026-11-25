// record, dark, 46.43-53.90 s: "And some nights it really worked. On December 8, 2000, Shaq went zero for eleven at the
// line against Seattle, still an NBA record."
// The real Basketball-Reference page of that night, redrawn dark: it turns over as Nelson's card leaves and snaps flat
// and big; the H1 types, the scorebox drops in (Seattle 103 in Sonics green, the Lakers 95 with their real logo), the
// Lakers table unrolls with Kobe above Shaq. On "Shaq" the page folds to his row; FG 13 / FGA 24 light white; the row
// slides to FT, whose faint grey 0 flips to a bold white 0; the eleven real play-by-play misses drop in, one red X
// each, as FTA rolls to 11. The X's gather, Seattle glows green, the page dims, and the 0 and the 11 fly out of their
// cells into one big "0-11" with the eleven X's laid under it. (notes/RecordBoxScore.md)
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { arrive, blurIn, countTo, ease, mix, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import {
  RECORDBOXSCORE_COLS as COLS,
  RECORDBOXSCORE_H1 as H1,
  RECORDBOXSCORE_META as META,
  RECORDBOXSCORE_MISSES as MISSES,
  RECORDBOXSCORE_RESERVES as RESERVES,
  RECORDBOXSCORE_SHAQ as SHAQ,
  RECORDBOXSCORE_STARTERS as STARTERS,
  RECORDBOXSCORE_TABS as TABS,
  type RecordBoxScoreRow,
} from "./RecordBoxScoreData";

const LAKERS = staticFile("shaq-free-throws/recordboxscore-lakers.svg");
const UI = "Inter, sans-serif";
const BIG = "Figtree, sans-serif";
const C = {
  card: "#161B22",
  card2: "#1C222B",
  hair: "#30363D",
  ink: "#FFFFFF",
  soft: "#C9D1D9",
  dim: "#8B949E",
  faint: "#535B66", // BBR prints a zero cell faint
  red: "#E5383B",
  green: "#00653A",
  gold: "#FFC200",
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// the card, in its own 1000 x 900 space; on the stage it sits at x 40-1040, y 540-1440, centred on (540, 990)
const CW = 1000;
const CH = 900;
const CX = 540;
const CY = 990;
const PAD = 30;

// the table: a sticky name column and a stats strip that scrolls sideways under a window, as BBR reads on a phone
const NAME_W = 300;
const WIN_X = PAD + NAME_W; // 330
const WIN_W = CW - PAD - WIN_X; // 640
const COL_W = (i: number) => (i === 0 ? 110 : 100);
const COL_X = COLS.map((_, i) => COLS.slice(0, i).reduce((s, __, j) => s + COL_W(j), 0));
const FT = COLS.indexOf("FT");
const FTA = COLS.indexOf("FTA");
const FTP = COLS.indexOf("FT%");
const FG = COLS.indexOf("FG");
const FGA = COLS.indexOf("FGA");
const SCROLL_FT = 560; // the strip slides so FT, FTA, FT% sit in the middle of the window

// state A (the page) and state B (Shaq's row and the log)
const A = { box: 238, label: 404, head: 444, row0: 488, rowH: 52, font: 30 };
const B = { box: 92, head: 250, shaq: 296, rowH: 66, font: 36 };
const LOG = { top: 384, rowH: 45 };

function useRecordBoxScoreTimes() {
  const { cue, cueEnd, endsOn, scene } = useScene();
  const zero = cue("zero");
  const first = zero + 3;
  const last = cueEnd("eleven") - 2;
  return {
    mount: scene.from - LEAD,
    nights: cue("nights"),
    really: cue("really"),
    worked: cue("worked"),
    on: cue("On"),
    december: cue("December"),
    eight: cue("8"),
    y2000: cue("2000"),
    shaq: cue("Shaq"),
    went: cue("went"),
    zero,
    eleven: cue("eleven"),
    line: cue("line"),
    against: cue("against"),
    seattle: cue("Seattle"),
    still: cue("still"),
    nba: cue("NBA"),
    record: cue("record"),
    fly: endsOn("record", 18),
    land: (i: number) => Math.round(first + ((last - first) * i) / (MISSES.length - 1)),
    end: scene.to,
  };
}
type T = ReturnType<typeof useRecordBoxScoreTimes>;

/** the card's transform: turning over at Nelson's card size, then snapping flat and big on "really", then a slow push */
function cardPose(f: number, t: T) {
  const turn = prog(f, t.mount, 26, ease.out);
  const rotY = 88 * (1 - turn);
  const snap = prog(f, t.really - 3, 14, ease.back);
  const s0 = 650 / CW;
  const push = 0.014 * prog(f, t.really + 10, t.end - t.really, ease.linear);
  const S = lerp(s0, 1, snap) + push;
  return { rotY, S };
}
/** a point of the card's own space, on the stage (only valid once the card is flat) */
const onStage = (S: number, x: number, y: number) => ({ x: CX + (x - CW / 2) * S, y: CY + (y - CH / 2) * S });

/** the foul red X, drawn on stroke by stroke */
const RecordBoxScoreX: React.FC<{ size: number; f: number; at: number; glow?: number }> = ({ size, f, at, glow = 0 }) => {
  const a = prog(f, at, 4, ease.out);
  const b = prog(f, at + 2, 4, ease.out);
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ display: "block", overflow: "visible", filter: glow > 0 ? `drop-shadow(0 0 ${(8 * glow).toFixed(1)}px rgba(229,56,59,0.8))` : undefined }}>
      <path d="M3.5 3.2 L16.6 16.8" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a} stroke={C.red} strokeWidth={3.4} strokeLinecap="round" fill="none" />
      <path d="M16.4 3.4 L3.4 16.6" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - b} stroke={C.red} strokeWidth={3.4} strokeLinecap="round" fill="none" />
    </svg>
  );
};

/** a number cell that rolls up a slot each time it changes */
const RecordBoxScoreRoll: React.FC<{ value: string; prev: string; at: number; f: number; size: number; color: string; weight: number }> = ({ value, prev, at, f, size, color, weight }) => {
  const k = value === prev ? 1 : prog(f, at, 4, ease.out);
  const h = size * 1.2;
  const box: React.CSSProperties = { position: "absolute", left: 0, right: 0, textAlign: "right", fontFamily: UI, fontWeight: weight, fontSize: size, lineHeight: `${h}px`, color, fontVariantNumeric: "tabular-nums" };
  return (
    <div style={{ position: "relative", height: h, overflow: "hidden" }}>
      {k < 1 && <div style={{ ...box, top: -h * k, opacity: 1 - k }}>{prev}</div>}
      <div style={{ ...box, top: h * (1 - k) }}>{value}</div>
    </div>
  );
};

/** one team of the scorebox */
const RecordBoxScoreTeam: React.FC<{ f: number; t: T; side: 0 | 1; glow: number; dimK: number }> = ({ f, t, side, glow, dimK }) => {
  const sea = side === 0;
  const drop = arrive(f, t.december - 3 + side * 5, 14);
  const score = Math.round(countTo(f, t.december + side * 5, 30, 0, sea ? 103 : 95));
  const ghost = 0.22 * prog(f, t.nights - 4, 14, ease.out); // the page is already there, out of focus, before its word
  return (
    <div
      style={{
        position: "absolute", left: sea ? PAD : CW / 2 + 10, top: 0, width: CW / 2 - PAD - 10, height: 140, borderRadius: 18,
        background: sea ? `linear-gradient(180deg, rgba(0,101,58,${(0.16 + 0.34 * glow).toFixed(3)}) 0%, ${C.card2} 100%)` : C.card2,
        border: `1px solid ${sea ? mix(f, t.against, 16, C.hair, "#1E8A57") : C.hair}`,
        boxShadow: sea && glow > 0 ? `0 0 ${(60 * glow).toFixed(0)}px rgba(0,140,80,${(0.45 * glow).toFixed(3)})` : undefined,
        opacity: Math.max(drop, ghost) * (1 - dimK * (sea ? 0.35 : 0.7)),
        transform: `translateY(${((1 - drop) * -46).toFixed(1)}px)`,
        filter: drop < 0.95 ? `blur(${((1 - drop) * 8).toFixed(2)}px)` : undefined,
      }}
    >
      {sea ? (
        <div style={{ position: "absolute", left: 20, top: 20, width: 100, height: 100, borderRadius: 14, background: `linear-gradient(160deg, #0A7A48 0%, ${C.green} 55%, #00502E 100%)`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 20px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: UI, fontWeight: 800, fontSize: 36, letterSpacing: 1, color: C.gold, filter: glow > 0 ? `brightness(${(1 + 0.35 * glow).toFixed(3)})` : undefined }}>
          SEA
        </div>
      ) : (
        <Img src={LAKERS} style={{ position: "absolute", left: 14, top: 14, width: 112, height: 112, filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.5))" }} />
      )}
      <div style={{ position: "absolute", left: 140, top: 16, fontFamily: UI, fontWeight: 600, fontSize: 25, color: sea ? mix(f, t.against, 16, C.soft, C.gold) : C.soft, whiteSpace: "nowrap" }}>
        {sea ? "Seattle SuperSonics" : "Los Angeles Lakers"}
      </div>
      <div style={{ position: "absolute", left: 138, top: 44, fontFamily: UI, fontWeight: 700, fontSize: 76, lineHeight: "88px", color: C.ink, fontVariantNumeric: "tabular-nums", letterSpacing: -1, opacity: f >= t.december - 3 ? 1 : 0 }}>{score}</div>
      <div style={{ position: "absolute", right: 22, bottom: 20, fontFamily: UI, fontWeight: 500, fontSize: 24, color: C.dim }}>{sea ? "10-11" : "14-7"}</div>
    </div>
  );
};

export const RecordBoxScore: React.FC = () => {
  const { f } = useScene();
  const t = useRecordBoxScoreTimes();
  const { rotY, S } = cardPose(f, t);

  // ---- the page, state A -> state B on "Shaq" -----------------------------------------------------------------
  const kB = arrive(f, t.shaq - 6, 18);
  const tabK = prog(f, t.zero - 10, 10, ease.inOut); // the underline slides from Box Score to Play-By-Play
  const dimK = prog(f, t.still, 16, ease.inOut); // the page dims around FT 0 / FTA 11 / .000
  const flyK = prog(f, t.fly, 18, ease.inOut);
  const deep = prog(f, t.fly, 14, ease.inOut); // the page sinks back as 0-11 comes forward
  const glow = prog(f, t.against, 10, ease.out) * (1 - 0.45 * prog(f, t.seattle + 18, 30, ease.inOut));

  // the H1 types on, then the date in it brightens on "On"
  const h1Text = H1.join("|");
  const typedN = Math.max(0, Math.min(h1Text.length, Math.floor((f - (t.really + 4)) / 0.6)));
  const typed = h1Text.slice(0, typedN).split("|");
  const dateCol = mix(f, t.on, 8, C.dim, C.ink);
  const caret = typedN < h1Text.length && f >= t.really + 4 && Math.floor(f / 8) % 2 === 0;

  // the table unrolls row by row on "8, 2000"
  const rowIn = (i: number) => arrive(f, t.eight + i * 4, 12);
  const ghostRow = (i: number) => Math.max(rowIn(i), 0.16 * prog(f, t.nights - 4, 14, ease.out));
  const foldOut = Math.min(1, kB * 1.7); // the other rows clear out before Shaq's row passes them
  const sectionIn = arrive(f, t.eight - 6, 12);
  const scroll = SCROLL_FT * prog(f, t.zero - 11, 13, ease.inOut);
  // the window's edges fade, so a column cut by the scroll reads as scrolled, never as a stray glyph
  const edgeL = (44 * scroll) / SCROLL_FT;
  const maskImg = `linear-gradient(90deg, rgba(0,0,0,0) 0px, #000 ${edgeL.toFixed(1)}px, #000 ${WIN_W - 30}px, rgba(0,0,0,0) ${WIN_W}px)`;
  const winMask: React.CSSProperties = { WebkitMaskImage: maskImg, maskImage: maskImg };
  const fgLit = prog(f, t.shaq + 6, 8, ease.out);
  const ftFlip = prog(f, t.zero - 5, 10, ease.inOut); // 0..0.5 turning away (faint), 0.5..1 coming back (bold white)
  const landed = MISSES.filter((_, i) => f >= t.land(i)).length;
  const lastLand = landed > 0 ? t.land(landed - 1) : 0;
  const ftpIn = prog(f, t.land(MISSES.length - 1) + 4, 8, ease.out);
  const shaqY = lerp(A.row0 + SHAQ * A.rowH, B.shaq, kB);
  const shaqH = lerp(A.rowH, B.rowH, kB);
  const shaqFont = lerp(A.font, B.font, kB);

  const cellStyle = (i: number, v: string, font: number, shaq: boolean): React.CSSProperties => {
    let color = v === "0" ? C.faint : shaq ? C.soft : "#AEB6C0";
    let weight = 500;
    if (shaq && (i === FG || i === FGA)) {
      color = mix(f, t.shaq + 6, 8, C.soft, C.ink);
      weight = fgLit > 0.5 ? 700 : 500;
    }
    return { position: "absolute", left: COL_X[i], width: COL_W(i) - 14, textAlign: "right", fontFamily: UI, fontWeight: weight, fontSize: font, color, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" };
  };

  /** one table row: the sticky name and the sliding stats strip */
  const Row = (r: RecordBoxScoreRow, y: number, h: number, font: number, op: number, shaq: boolean, key: string, blurPx = 0) => (
    <div key={key} style={{ position: "absolute", left: 0, top: y, width: CW, height: h, opacity: op, filter: blurPx > 0.3 ? `blur(${blurPx.toFixed(2)}px)` : undefined }}>
      <div style={{ position: "absolute", left: PAD, right: PAD, bottom: 0, height: 1, background: C.hair, opacity: 0.7 }} />
      <div style={{ position: "absolute", left: PAD + 4, top: 0, height: h, lineHeight: `${h}px`, fontFamily: UI, fontWeight: shaq ? 700 : 500, fontSize: shaq ? lerp(font, 32, kB) : font, color: shaq ? C.ink : C.soft, whiteSpace: "nowrap" }}>{r.name}</div>
      <div style={{ position: "absolute", left: WIN_X, top: 0, width: WIN_W, height: h, overflow: "hidden", ...winMask }}>
        <div style={{ position: "absolute", left: -scroll, top: 0, height: h, lineHeight: `${h}px` }}>
          {r.cells.map((v, i) => {
            if (shaq && (i === FT || i === FTA || i === FTP)) return null;
            return (
              <div key={i} style={{ ...cellStyle(i, v, font, shaq), top: 0, opacity: shaq && dimK > 0 ? 1 - 0.75 * dimK : 1 }}>
                {v}
              </div>
            );
          })}
          {shaq && (
            <>
              {/* FG 13 / FGA 24: from the field he was fine */}
              {fgLit > 0 && (
                <div style={{ position: "absolute", left: COL_X[FG] + 4, top: 8, width: COL_W(FG) + COL_W(FGA) - 12, height: h - 16, borderRadius: 8, background: `rgba(255,255,255,${(0.07 * fgLit * (1 - dimK)).toFixed(3)})`, border: `1px solid rgba(255,255,255,${(0.35 * fgLit * (1 - dimK)).toFixed(3)})` }} />
              )}
              {/* FT, FTA, FT%: framed once the page dims around them */}
              <div style={{ position: "absolute", left: COL_X[FT] + 2, top: 6, width: COL_W(FT) + COL_W(FTA) + COL_W(FTP) - 6, height: h - 12, borderRadius: 8, border: `1.5px solid rgba(255,255,255,${(0.85 * dimK * (1 - flyK)).toFixed(3)})`, background: `rgba(229,56,59,${(0.08 * dimK).toFixed(3)})` }} />
              {/* FT: the faint 0 turns over and comes back bold white */}
              <div style={{ ...cellStyle(FT, "0", font, true), top: 0, color: ftFlip < 0.5 ? C.faint : C.ink, fontWeight: ftFlip < 0.5 ? 500 : 800, transform: `perspective(400px) rotateX(${(ftFlip < 0.5 ? ftFlip * 180 : (ftFlip - 1) * 180).toFixed(1)}deg)`, opacity: flyK > 0 ? 0 : 1 }}>0</div>
              {/* FTA: rolls 1 -> 11, one per miss */}
              <div style={{ position: "absolute", left: COL_X[FTA], width: COL_W(FTA) - 14, top: (h - font * 1.2) / 2, opacity: flyK > 0 ? 0 : 1 }}>
                <RecordBoxScoreRoll value={landed > 0 ? String(landed) : ""} prev={landed > 1 ? String(landed - 1) : ""} at={lastLand} f={f} size={font} color={landed > 0 ? C.ink : C.faint} weight={landed > 0 ? 800 : 500} />
              </div>
              <div style={{ ...cellStyle(FTP, ".000", font, true), top: 0, color: C.ink, fontWeight: 700, opacity: ftpIn * (1 - flyK), filter: ftpIn < 1 ? `blur(${((1 - ftpIn) * 8).toFixed(1)}px)` : undefined }}>.000</div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // the column heads, sliding with the strip
  const headY = lerp(A.head, B.head, kB);
  const heads = (
    <div style={{ position: "absolute", left: 0, top: headY, width: CW, height: 44, opacity: Math.max(sectionIn, 0.16 * prog(f, t.nights - 4, 14, ease.out)) * (1 - 0.7 * dimK) }}>
      <div style={{ position: "absolute", left: PAD, right: PAD, bottom: 0, height: 2, background: C.hair }} />
      <div style={{ position: "absolute", left: PAD + 4, lineHeight: "44px", fontFamily: UI, fontWeight: 700, fontSize: 24, color: C.dim }}>Starters</div>
      <div style={{ position: "absolute", left: WIN_X, top: 0, width: WIN_W, height: 44, overflow: "hidden", ...winMask }}>
        <div style={{ position: "absolute", left: -scroll, top: 0, lineHeight: "44px" }}>
          {COLS.map((c, i) => (
            <div key={c} style={{ position: "absolute", left: COL_X[i], width: COL_W(i) - 14, textAlign: "right", fontFamily: UI, fontWeight: 700, fontSize: 24, color: i >= FT && i <= FTP && f >= t.zero - 4 ? C.soft : C.dim }}>{c}</div>
          ))}
        </div>
      </div>
    </div>
  );

  // the X's live on the stage (they leave the page at the end); in the log they sit at the left of each row
  const logRowY = (i: number) => LOG.top + i * LOG.rowH;
  const gather = prog(f, t.line, 14, ease.inOut);
  const xRow = prog(f, t.fly + 2, 18, ease.inOut);
  const xs = MISSES.map((_, i) => {
    const inLog = onStage(S, PAD + 22, logRowY(i) + LOG.rowH / 2);
    const mid = (MISSES.length - 1) / 2;
    const col = { x: inLog.x, y: onStage(S, 0, logRowY(mid) + LOG.rowH / 2).y + (i - mid) * 33 };
    const row = { x: CX + (i - mid) * 42, y: 1142 };
    const g = { x: lerp(inLog.x, col.x, gather), y: lerp(inLog.y, col.y, gather) };
    return { x: lerp(g.x, row.x, xRow), y: lerp(g.y, row.y, xRow), size: lerp(lerp(30, 27, gather), 34, xRow) };
  });

  // the big 0-11, flown out of the FT and FTA cells
  const shaqMid = onStage(S, 0, B.shaq + B.rowH / 2).y;
  const ftCell = onStage(S, WIN_X + COL_X[FT] - SCROLL_FT + 74, 0).x;
  const ftaCell = onStage(S, WIN_X + COL_X[FTA] - SCROLL_FT + 64, 0).x;
  const bigSize = lerp(B.font, 210, flyK);
  const bigY = lerp(shaqMid, 1000, flyK);
  const after = f - t.record;
  const settle = after >= 0 ? 1 + 0.05 * Math.exp(-after / 5) * Math.cos(after * 0.6) : 1;
  const holdPush = 1 + 0.025 * prog(f, t.record, 60, ease.out);

  return (
    <AbsoluteFill>
      {/* ---- the arena behind: soft points of light, drifting ---- */}
      <div style={{ position: "absolute", inset: 0, opacity: prog(f, t.mount, 14, ease.linear) }}>
        {[
          { x: 160, y: 620, r: 360, a: 0.07 },
          { x: 930, y: 760, r: 420, a: 0.06 },
          { x: 540, y: 1460, r: 520, a: 0.05 },
        ].map((l, i) => (
          <div key={i} style={{ position: "absolute", left: l.x - l.r + Math.sin(f * 0.006 + i) * 30, top: l.y - l.r, width: l.r * 2, height: l.r * 2, borderRadius: "50%", background: `radial-gradient(closest-side, rgba(150,170,210,${l.a}), rgba(150,170,210,0))` }} />
        ))}
      </div>

      {/* ---- the Seattle page behind, a sheet under the Lakers one ---- */}
      <div style={{ position: "absolute", left: CX - (CW / 2) * S, top: CY - (CH / 2) * S, width: CW, height: CH, transform: `perspective(2400px) rotateY(${rotY.toFixed(2)}deg) scale(${S.toFixed(4)}) translate(-18px, 26px) rotate(-2.4deg)`, transformOrigin: "0 0", opacity: prog(f, t.really, 12, ease.linear) * (1 - deep * 0.6), borderRadius: 26, background: "#12171E", border: `1px solid ${C.hair}`, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: 18, bottom: 16, fontFamily: UI, fontSize: 22, color: C.faint, transform: "rotate(-90deg)", transformOrigin: "0 100%", whiteSpace: "nowrap" }}>Seattle SuperSonics  ·  Basic Box Score Stats</div>
      </div>

      {/* ---- the Lakers page ---- */}
      <div
        style={{
          position: "absolute", left: CX - CW / 2, top: CY - CH / 2, width: CW, height: CH,
          transform: `perspective(2400px) rotateY(${rotY.toFixed(2)}deg) scale(${S.toFixed(4)})`, transformOrigin: "50% 50%",
          filter: deep > 0 ? `blur(${(deep * 6).toFixed(2)}px) brightness(${(1 - 0.6 * deep).toFixed(3)})` : undefined,
        }}
      >
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: C.card, border: `1px solid ${C.hair}`, boxShadow: "0 40px 100px rgba(0,0,0,0.6)", overflow: "hidden" }}>
          {/* a slow light across the sheet */}
          <div style={{ position: "absolute", top: -200, bottom: -200, width: 380, left: -500 + ((f - t.mount) * 3.2) % 2200, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.035), rgba(255,255,255,0))", transform: "rotate(14deg)" }} />

          {/* the page's own tabs, and where it comes from */}
          <div style={{ position: "absolute", left: PAD, top: 22, display: "flex", gap: 34, fontFamily: UI, fontSize: 24, fontWeight: 600, opacity: 1 - 0.7 * dimK }}>
            {TABS.map((tab, i) => (
              <div key={tab} style={{ color: (i === 0 && tabK < 0.5) || (i === 1 && tabK >= 0.5) ? C.ink : C.dim, whiteSpace: "nowrap" }}>{tab}</div>
            ))}
          </div>
          <div style={{ position: "absolute", left: PAD + lerp(0, 152, tabK), top: 60, width: lerp(116, 150, tabK), height: 3, borderRadius: 2, background: C.ink, opacity: 1 - 0.7 * dimK }} />
          <div style={{ position: "absolute", left: PAD, right: PAD, top: 74, height: 1, background: C.hair }} />
          <div style={{ position: "absolute", right: PAD, top: 24, fontFamily: UI, fontSize: 22, fontWeight: 500, color: C.dim, opacity: 1 - 0.7 * dimK }}>Basketball-Reference</div>

          {/* the H1 and the meta, folded away on "Shaq" */}
          <div style={{ position: "absolute", left: PAD, top: 96 - 40 * kB, width: CW - 2 * PAD, opacity: 1 - foldOut, fontFamily: UI, fontWeight: 700, fontSize: 36, lineHeight: "46px", color: C.ink, whiteSpace: "nowrap" }}>
            <div>
              {typed[0] ?? ""}
              {caret && typed.length === 1 && <span style={{ opacity: 0.8 }}>|</span>}
            </div>
            <div>
              {typed[1] ?? ""}
              <span style={{ color: dateCol }}>{typed[2] ?? ""}</span>
              {caret && typed.length > 1 && <span style={{ opacity: 0.8 }}>|</span>}
            </div>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 194 - 40 * kB, fontFamily: UI, fontWeight: 500, fontSize: 23, color: C.dim, whiteSpace: "nowrap", ...blurIn(f, t.on, { dur: 8 }), opacity: prog(f, t.on, 8) * (1 - foldOut) }}>{META}</div>

          {/* the scorebox */}
          <div style={{ position: "absolute", left: 0, top: lerp(A.box, B.box, kB), width: CW, height: 140 }}>
            <RecordBoxScoreTeam f={f} t={t} side={0} glow={glow} dimK={dimK} />
            <RecordBoxScoreTeam f={f} t={t} side={1} glow={0} dimK={dimK} />
          </div>

          {/* the section label */}
          <div style={{ position: "absolute", left: PAD, top: A.label, display: "flex", alignItems: "baseline", gap: 14, fontFamily: UI, opacity: sectionIn * (1 - foldOut), transform: `translateY(${(-30 * kB).toFixed(1)}px)` }}>
            <span style={{ fontWeight: 700, fontSize: 28, color: C.ink }}>Los Angeles Lakers</span>
            <span style={{ fontWeight: 500, fontSize: 22, color: C.dim }}>Basic Box Score Stats</span>
          </div>
          {heads}

          {/* the starters: the others fold away on "Shaq" */}
          {STARTERS.map((r, i) => {
            if (i === SHAQ) return null;
            const y = A.row0 + i * A.rowH + (i < SHAQ ? -60 : 60) * kB;
            return Row(r, y, A.rowH, A.font, ghostRow(i) * (1 - foldOut), false, r.name, (1 - rowIn(i)) * 7);
          })}
          {/* the reserves, fading under the fold */}
          <div style={{ position: "absolute", left: 0, top: A.row0 + 5 * A.rowH, width: CW, height: 44, opacity: rowIn(5) * 0.7 * (1 - foldOut) }}>
            <div style={{ position: "absolute", left: PAD + 4, lineHeight: "44px", fontFamily: UI, fontWeight: 700, fontSize: 24, color: C.dim }}>Reserves</div>
          </div>
          {RESERVES.map((r, i) => Row(r, A.row0 + 5 * A.rowH + 44 + i * A.rowH, A.rowH, A.font, rowIn(6 + i) * (0.55 - 0.3 * i) * (1 - foldOut), false, r.name))}

          {/* Shaq's row, framed, then the row that matters */}
          <div style={{ position: "absolute", left: PAD - 8, top: shaqY - 2, width: CW - 2 * PAD + 16, height: shaqH + 4, borderRadius: 10, border: `1.5px solid rgba(255,255,255,${(0.9 * prog(f, t.y2000, 8) * (1 - dimK)).toFixed(3)})`, background: `rgba(255,255,255,${(0.04 * prog(f, t.y2000, 8)).toFixed(3)})`, opacity: rowIn(SHAQ) }} />
          {Row(STARTERS[SHAQ], shaqY, shaqH, shaqFont, ghostRow(SHAQ), true, "shaq", (1 - rowIn(SHAQ)) * 7)}

          {/* the log: the eleven misses, as the play-by-play prints them */}
          {MISSES.map((_, i) => (
            <div key={`slot${i}`} style={{ position: "absolute", left: PAD, right: PAD, top: logRowY(i) + LOG.rowH - 1, height: 1, background: C.hair, opacity: 0.6 * prog(f, t.shaq + i * 2, 10, ease.out) * (1 - 0.6 * dimK) }} />
          ))}
          {MISSES.map((m, i) => {
            const at = t.land(i);
            if (f < at - 1) return null;
            const p = prog(f, at - 1, 6, ease.out);
            const flash = 1 - prog(f, at, 14, ease.linear);
            const y = logRowY(i);
            const textOp = p * (1 - 0.65 * gather) * (1 - 0.4 * dimK);
            return (
              <div key={i} style={{ position: "absolute", left: 0, top: y - 18 * (1 - p), width: CW, height: LOG.rowH }}>
                <div style={{ position: "absolute", left: PAD, right: PAD, top: 2, bottom: 2, borderRadius: 8, background: `rgba(229,56,59,${(0.16 * flash).toFixed(3)})` }} />
                <div style={{ position: "absolute", left: PAD + 56, top: 0, height: LOG.rowH, lineHeight: `${LOG.rowH}px`, display: "flex", fontFamily: UI, fontSize: 29, whiteSpace: "nowrap", opacity: textOp, fontVariantNumeric: "tabular-nums" }}>
                  <span style={{ width: 66, color: C.dim, fontWeight: 500 }}>{m.q}</span>
                  <span style={{ width: 118, color: C.soft, fontWeight: 600 }}>{m.clock}</span>
                  <span style={{ color: C.ink, fontWeight: 700 }}>S. O'Neal</span>
                  <span style={{ color: C.soft, fontWeight: 500 }}>&nbsp;misses free throw {m.play}</span>
                </div>
                <div style={{ position: "absolute", right: PAD + 8, top: 0, lineHeight: `${LOG.rowH}px`, fontFamily: UI, fontSize: 26, color: C.dim, opacity: textOp, fontVariantNumeric: "tabular-nums" }}>{m.score}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- the eleven X's, on the stage ---- */}
      {xs.map((x, i) =>
        f >= t.land(i) - 1 ? (
          <div key={i} style={{ position: "absolute", left: x.x - x.size / 2, top: x.y - x.size / 2 }}>
            <RecordBoxScoreX size={x.size} f={f} at={t.land(i) - 1} glow={xRow} />
          </div>
        ) : null,
      )}

      {/* ---- 0-11, flown out of its cells ---- */}
      {flyK > 0 && (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${(settle * holdPush).toFixed(4)})`, transformOrigin: `${CX}px 1060px` }}>
          {[
            { s: "0", x0: ftCell, x1: CX - 168, col: C.ink },
            { s: "-", x0: (ftCell + ftaCell) / 2, x1: CX - 62, col: C.ink },
            { s: "11", x0: ftaCell, x1: CX + 104, col: C.ink },
          ].map((g, i) => (
            <div
              key={i}
              style={{
                position: "absolute", left: lerp(g.x0, g.x1, flyK), top: bigY, transform: "translate(-50%, -50%)",
                fontFamily: flyK > 0.5 ? BIG : UI, fontWeight: 800, fontSize: bigSize, lineHeight: 1, color: g.col, fontVariantNumeric: "tabular-nums",
                opacity: i === 1 ? prog(f, t.fly + 6, 8, ease.linear) : 1, textShadow: "0 10px 40px rgba(0,0,0,0.6)", whiteSpace: "nowrap",
              }}
            >
              {g.s}
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, width: 1080, top: 1188, textAlign: "center", fontFamily: UI, fontWeight: 600, fontSize: 40, color: C.dim, ...blurIn(f, t.record - 2, { dur: 8, rise: 12 }) }}>NBA record</div>
        </div>
      )}
    </AbsoluteFill>
  );
};
