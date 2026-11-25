// `answer`: "That's how many shots he took against the Pelicans on Saturday, and it's what made the fifty so rare."
// The game in time. The hook's court shrinks to the left column; Basketball-Reference's 29 real play-by-play rows for
// his shots write into a log card one every 0.07 s, each relighting its own mark on the small court, while a tally
// counts to 29, the game clock runs through four quarters and the running score climbs to 108-82. The Pelicans logo
// drops in opposite the Spurs; on "Saturday" the final strip lands. Then the log folds into one line of 29 marks
// (the game in order), the court comes back to the centre, and a white 50 settles beside the 29.
// Parts: PlayByPlayLogData (the 29 rows, real copy), PlayByPlayLogCourt (the court), this file (everything else).
import React from "react";
import { Img, staticFile } from "remotion";
import { arriveEase, blurIn, blurOut, countTo, ease, mix, pop, prog, useScene } from "../../../src/engine";
import { PLAYBYPLAYLOG_ROWS as ROWS } from "./PlayByPlayLogData";
import { PlayByPlayLogCourt, type PlayByPlayLogMark, type PlayByPlayLogRect } from "./PlayByPlayLogCourt";

const C = {
  ink: "#FFFFFF",
  soft: "#C9D1D9",
  dim: "#8B949E",
  card: "#161B22",
  card2: "#1C222B",
  line: "#30363D",
  miss: "#8B949E",
};
const asset = (n: string) => staticFile(`wemby-50/${n}`);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpR = (a: PlayByPlayLogRect, b: PlayByPlayLogRect, t: number): PlayByPlayLogRect => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t) });
const ORD = ["", "1st", "2nd", "3rd", "4th"];

// where the court sits: as the hook leaves it (centred, big), in the left column, and back in the centre at the end
const HAND: PlayByPlayLogRect = { x: 160, y: 700, w: 760 };
const SMALL: PlayByPlayLogRect = { x: 56, y: 716, w: 330 };
const END: PlayByPlayLogRect = { x: 280, y: 850, w: 520 };

// the log card and its scrolling window
const CARD = { x: 416, y: 720, w: 608, h: 620 };
const WIN = { top: 866, bottom: 1330 };
const ROW_H = 82;
const Q_H = 40;
const STEP = 4.2; // frames between two rows: 0.07 s

type Item = { kind: "q"; q: number; row: number; top: number } | { kind: "row"; i: number; top: number };
const ITEMS: Item[] = (() => {
  const out: Item[] = [];
  let top = 0;
  ROWS.forEach((r, i) => {
    if (i === 0 || ROWS[i - 1].q !== r.q) {
      out.push({ kind: "q", q: r.q, row: i, top });
      top += Q_H;
    }
    out.push({ kind: "row", i, top });
    top += ROW_H;
  });
  return out;
})();
const ROW_TOP = ITEMS.filter((it): it is Extract<Item, { kind: "row" }> => it.kind === "row").map((it) => it.top);
/** content height once n rows are written (fractional n slides between rows) */
const bottomAt = (n: number) => {
  if (n <= 0) return 0;
  const k = Math.min(ROWS.length, n);
  const lo = Math.floor(k);
  const b = (j: number) => (j <= 0 ? 0 : ROW_TOP[j - 1] + ROW_H);
  return lerp(b(lo), b(Math.min(ROWS.length, lo + 1)), k - lo);
};

// the timeline line the log folds into: 29 slots in game order, a small gap between quarters
const SLOT = 29;
const QGAP = 14;
const slotX = (() => {
  const xs: number[] = [];
  let x = 0;
  ROWS.forEach((r, i) => {
    if (i > 0 && ROWS[i - 1].q !== r.q) x += QGAP;
    xs.push(x);
    x += SLOT;
  });
  const span = x - SLOT;
  return xs.map((v) => 540 - span / 2 + v);
})();
const SLOT_Y = 774;

function useT() {
  const { cue } = useScene();
  const shots = cue("shots");
  return {
    that: cue("That's"),
    shots,
    pel: cue("Pelicans"),
    sat: cue("Saturday"),
    and: cue("and"),
    fifty: cue("50"),
    rare: cue("rare"),
    land: (i: number) => shots + Math.round(i * STEP),
  };
}
type T = ReturnType<typeof useT>;

/** BBR's glyphs: a filled dot for a make, an x for a miss */
const Glyph: React.FC<{ made: boolean; size: number; color?: string }> = ({ made, size, color }) =>
  made ? (
    <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: "block" }}>
      <circle cx={5} cy={5} r={3.6} fill={color ?? C.ink} />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: "block" }}>
      <path d="M2 2 L8 8 M8 2 L2 8" stroke={color ?? C.miss} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );

/** a number that rolls up a slot when it changes, like a scoreboard */
const Roll: React.FC<{ value: number; prev: number; at: number; f: number; size: number; color: string; width: number; align?: "left" | "right" }> = ({ value, prev, at, f, size, color, width, align = "right" }) => {
  const { theme } = useScene();
  const k = value === prev ? 1 : prog(f, at, 3, ease.out);
  const box: React.CSSProperties = { position: "absolute", left: 0, width, textAlign: align, fontFamily: theme.font.caption, fontWeight: 700, fontSize: size, lineHeight: `${size * 1.1}px`, color, fontVariantNumeric: "tabular-nums" };
  return (
    <div style={{ position: "relative", width, height: size * 1.1, overflow: "hidden" }}>
      {k < 1 && <div style={{ ...box, top: -size * 1.1 * k, opacity: 1 - k }}>{prev}</div>}
      <div style={{ ...box, top: size * 1.1 * (1 - k) }}>{value}</div>
    </div>
  );
};

/** rows written by this frame */
const landedCount = (f: number, t: T) => ROWS.filter((_, i) => f >= t.land(i)).length;

const PlayByPlayLogPhoto: React.FC<{ t: T; out: number }> = ({ t, out }) => {
  const { f, theme } = useScene();
  if (f < t.that + 8) return null;
  const push = 1 + 0.06 * prog(f, t.that + 8, 280, ease.linear);
  return (
    <div style={{ position: "absolute", left: SMALL.x, top: 548, width: 330, height: 146, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.line}`, background: "#000", ...blurIn(f, t.that + 8, { dur: 9, rise: 24 }), ...(out > 0 ? blurOut(f, t.and, { dur: 10 }) : {}) }}>
      <Img src={asset("commons-wemby-spurs-2025-nbacup-cropped-onoguchi-ccby4.jpg")} style={{ position: "absolute", left: -40, top: -44, width: 400, transform: `scale(${push.toFixed(4)})`, transformOrigin: "55% 20%" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
      <div style={{ position: "absolute", right: 10, top: 7, fontFamily: theme.font.ui, fontSize: 18, color: "rgba(255,255,255,0.72)" }}>Daiei Onoguchi, CC BY 4.0</div>
      <div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: theme.font.ui, fontWeight: 700, fontSize: 30, color: C.ink }}>V. Wembanyama</div>
    </div>
  );
};

const PlayByPlayLogScore: React.FC<{ t: T }> = ({ t }) => {
  const { f, theme } = useScene();
  const at = t.that + 14;
  if (f < at) return null;
  const n = landedCount(f, t);
  const cur = n > 0 ? ROWS[n - 1] : null;
  const prev = n > 1 ? ROWS[n - 2] : null;
  const changed = n > 0 ? t.land(n - 1) : 0;
  const q = cur ? cur.q : 1;
  const clock = cur ? cur.t : "12:00.0";
  const logoDrop = prog(f, t.pel - 8, 8, arriveEase(8));
  const logoSettle = f >= t.pel ? 1 + 0.12 * Math.sin(prog(f, t.pel, 10, ease.linear) * Math.PI) * (1 - prog(f, t.pel, 10)) : 1;
  const style = { ...blurIn(f, at, { dur: 9, rise: 18 }), ...(f >= t.and ? blurOut(f, t.and, { dur: 10 }) : {}) };
  const y0 = 1050;
  return (
    <div style={{ position: "absolute", left: SMALL.x, top: y0, width: 330, ...style }}>
      <div style={{ fontFamily: theme.font.mono, fontSize: 30, color: C.dim, height: 40, display: "flex", gap: 16 }}>
        <span>{ORD[q]} Q</span>
        <span style={{ color: C.soft }}>{clock}</span>
      </div>
      {[
        { logo: "nba-spurs-primary.svg", name: "SAS", v: cur ? cur.sas : 0, p: prev ? prev.sas : 0, color: C.ink, show: 1, drop: 1 },
        { logo: "nba-pelicans-primary.svg", name: "NOP", v: cur ? cur.nop : 0, p: prev ? prev.nop : 0, color: C.soft, show: logoDrop, drop: logoDrop },
      ].map((s, k) => (
        <div key={s.name} style={{ position: "relative", height: 84, borderTop: k === 1 ? `1px solid ${C.line}` : undefined, display: "flex", alignItems: "center" }}>
          <div style={{ width: 66, height: 66, opacity: s.show, transform: `translateY(${(-70 * (1 - s.drop)).toFixed(1)}px) scale(${k === 1 ? logoSettle.toFixed(3) : 1})` }}>
            <Img src={asset(s.logo)} style={{ width: 66, height: 66 }} />
          </div>
          <div style={{ marginLeft: 14, fontFamily: theme.font.ui, fontWeight: 600, fontSize: 32, color: C.dim, width: 90 }}>{s.name}</div>
          <div style={{ position: "absolute", right: 0, top: 6 }}>
            <Roll value={s.v} prev={s.p} at={changed} f={f} size={66} color={s.color} width={150} />
          </div>
        </div>
      ))}
    </div>
  );
};

const PlayByPlayLogCard: React.FC<{ t: T }> = ({ t }) => {
  const { f, theme } = useScene();
  const open = t.that + 6;
  if (f < open) return null;
  const grow = prog(f, open, 14, arriveEase(14));
  const fold = prog(f, t.and, 10, ease.out);
  const head = prog(f, open + 8, 8);
  // the window scrolls as rows are written, so the newest one is always at the foot
  const fl = Math.max(0, Math.min(ROWS.length, (Math.min(f, t.and) - t.shots) / STEP + 1));
  const winH = WIN.bottom - WIN.top;
  const scroll = Math.max(0, bottomAt(fl) - winH + 6);
  const textOut = 1 - prog(f, t.and, 7, ease.out);
  // the row scrolling out under the column heads fades instead of being cut
  const fadeTop = `linear-gradient(180deg, transparent 0px, #000 ${Math.min(34, scroll).toFixed(1)}px)`;
  return (
    <>
      <div
        style={{
          position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h * grow, borderRadius: 20,
          background: C.card, border: `1px solid ${C.line}`, boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          opacity: 1 - fold, transform: `translateX(${(30 * fold).toFixed(1)}px)`,
        }}
      />
      <div style={{ position: "absolute", left: CARD.x + 24, top: CARD.y + 20, width: CARD.w - 48, opacity: head * textOut, fontFamily: theme.font.ui }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, fontSize: 26 }}>
          <span style={{ fontWeight: 700, color: C.ink }}>Basketball-Reference</span>
          <span style={{ color: C.dim }}>Play-By-Play</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 22, color: C.dim }}>Pelicans at Spurs, November 21, 2026</div>
        <div style={{ marginTop: 18, display: "flex", fontSize: 22, fontWeight: 600, color: C.dim, letterSpacing: 0.5, borderBottom: `1px solid ${C.line}`, paddingBottom: 8 }}>
          <span style={{ width: 180, paddingLeft: 40 }}>Time</span>
          <span style={{ flex: 1 }}>San Antonio</span>
          <span>Score</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: CARD.x, top: WIN.top, width: CARD.w, height: winH, overflow: "hidden", opacity: textOut, WebkitMaskImage: fadeTop, maskImage: fadeTop }}>
        {ITEMS.map((it, k) => {
          const y = it.top - scroll;
          if (y < -ROW_H || y > winH) return null;
          if (it.kind === "q") {
            const a = t.land(it.row) - 2;
            if (f < a) return null;
            return (
              <div key={`q${k}`} style={{ position: "absolute", left: 16, right: 16, top: y + 4, height: Q_H - 8, borderRadius: 8, background: "#0F141A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: theme.font.ui, fontWeight: 700, fontSize: 22, color: C.dim, ...blurIn(f, a, { dur: 4 }) }}>
                {ORD[it.q]} Q
              </div>
            );
          }
          const r = ROWS[it.i];
          const a = t.land(it.i);
          if (f < a - 1) return null;
          const typed = Math.max(1, Math.round(prog(f, a, 9, ease.linear) * r.play.length));
          const hi = 1 - prog(f, a + 3, 16, ease.linear);
          return (
            <div key={`r${it.i}`} style={{ position: "absolute", left: 0, right: 0, top: y, height: ROW_H, ...blurIn(f, a, { dur: 5, rise: 16, blur: 8 }) }}>
              <div style={{ position: "absolute", inset: "2px 8px", borderRadius: 10, background: `rgba(255,255,255,${(0.07 * hi).toFixed(3)})` }} />
              <div style={{ position: "absolute", left: 18, top: 27, opacity: f >= t.and + 2 ? 0 : 1 }}>
                <Glyph made={r.made} size={28} />
              </div>
              <div style={{ position: "absolute", left: 64, top: 8, right: 22, display: "flex", alignItems: "baseline", fontFamily: theme.font.mono, fontSize: 24, color: C.dim }}>
                <span style={{ width: 128 }}>{r.t}</span>
                <span style={{ flex: 1, fontFamily: theme.font.ui, fontSize: 21, color: "#6E7681" }}>{r.ast ? `(${r.ast})` : ""}</span>
                {r.plus && <span style={{ fontFamily: theme.font.ui, fontWeight: 700, color: C.ink, marginRight: 12 }}>{r.plus}</span>}
                <span style={{ color: r.plus ? C.soft : C.dim }}>{r.score}</span>
              </div>
              <div style={{ position: "absolute", left: 64, top: 38, right: 18, whiteSpace: "nowrap", fontFamily: theme.font.ui, fontSize: 30, fontWeight: r.made ? 600 : 500, color: r.made ? C.ink : C.miss }}>
                {r.play.slice(0, typed)}
              </div>
            </div>
          );
        })}
      </div>
      {/* the log folds: every row's mark flies, in game order, into one line of the game in time */}
      {f >= t.and + 2 &&
        ROWS.map((r, i) => {
          const fromY = WIN.top + ROW_TOP[i] - scroll + 27 + 14;
          const hidden = fromY < WIN.top;
          const fy = Math.max(WIN.top - 10, fromY);
          const fx = CARD.x + 18 + 14;
          const s0 = t.and + 2 + Math.round(i * 0.7);
          const p = prog(f, s0, 22, arriveEase(22));
          const x = lerp(fx, slotX[i], p);
          const y = lerp(fy, SLOT_Y, p) - Math.sin(p * Math.PI) * 60;
          const size = lerp(28, 24, p);
          const o = hidden ? prog(f, s0, 8) : 1;
          return (
            <div key={`m${i}`} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, opacity: o }}>
              <Glyph made={r.made} size={size} />
            </div>
          );
        })}
    </>
  );
};

/** the quarter labels under the folded line */
const PlayByPlayLogQuarters: React.FC<{ t: T }> = ({ t }) => {
  const { f, theme } = useScene();
  const at = t.and + 24;
  if (f < at) return null;
  const groups = [1, 2, 3, 4].map((q) => {
    const idx = ROWS.map((r, i) => (r.q === q ? i : -1)).filter((i) => i >= 0);
    return { q, a: slotX[idx[0]] - 12, b: slotX[idx[idx.length - 1]] + 12 };
  });
  return (
    <>
      {groups.map((g, k) => (
        <div key={g.q} style={{ position: "absolute", left: g.a, width: g.b - g.a, top: SLOT_Y + 18, ...blurIn(f, at + k * 4, { dur: 6 }) }}>
          <div style={{ height: 1, background: C.line }} />
          <div style={{ textAlign: "center", marginTop: 4, fontFamily: theme.font.ui, fontWeight: 600, fontSize: 22, color: C.dim }}>{ORD[g.q]} Q</div>
        </div>
      ))}
    </>
  );
};

const PlayByPlayLogStrip: React.FC<{ t: T }> = ({ t }) => {
  const { f, theme } = useScene();
  const at = t.sat - 10;
  if (f < at) return null;
  const p = prog(f, at, 10, arriveEase(10));
  const seg = (k: number): React.CSSProperties => blurIn(f, at + 2 + k * 2, { dur: 6 });
  const div = <div style={{ width: 1, alignSelf: "stretch", background: C.line, margin: "14px 0" }} />;
  return (
    <div
      style={{
        position: "absolute", left: 56, width: 968, top: 1368, height: 68, borderRadius: 14, background: C.card, border: `1px solid ${C.line}`,
        transform: `translateY(${(60 * (1 - p)).toFixed(1)}px)`, opacity: prog(f, at, 3, ease.linear), boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", fontFamily: theme.font.ui, fontWeight: 700, fontSize: 25, color: C.soft, letterSpacing: 1,
      }}
    >
      <span style={seg(0)}>SAT NOV 21</span>
      {div}
      <span style={{ ...seg(1), color: C.dim }}>FROST BANK CENTER</span>
      {div}
      <span style={{ ...seg(2), color: C.ink }}>FINAL</span>
      {div}
      <span style={{ ...seg(3), display: "flex", alignItems: "center", gap: 10 }}>
        <Img src={asset("nba-spurs-primary.svg")} style={{ width: 40, height: 40 }} />
        SAS <span style={{ fontSize: 34, color: C.ink }}>114</span>
      </span>
      <span style={{ ...seg(4), display: "flex", alignItems: "center", gap: 10 }}>
        <Img src={asset("nba-pelicans-primary.svg")} style={{ width: 40, height: 40 }} />
        NOP <span style={{ fontSize: 34, color: C.soft }}>91</span>
      </span>
    </div>
  );
};

/** the 29 from the hook becomes the tally's "/ 29", the counter runs to 29, and at the end the 50 settles beside it */
const PlayByPlayLogTally: React.FC<{ t: T }> = ({ t }) => {
  const { f, theme } = useScene();
  const n = landedCount(f, t);
  const toLog = prog(f, t.that, 22, arriveEase(22));
  const toEnd = prog(f, t.and + 4, 24, arriveEase(24));
  const big = { fontFamily: theme.font.caption, fontWeight: 700, fontVariantNumeric: "tabular-nums" as const, whiteSpace: "nowrap" as const };
  // the denominator: hook-size 29 in the centre -> "/ 29" beside the counter -> gone
  const dSize = lerp(176, 64, toLog);
  const dx = lerp(540 - 0.6 * 176, CARD.x + 152, toLog);
  const dy = lerp(530, 584, toLog);
  // the counter: right-aligned in its box
  const cSize = lerp(120, 150, toEnd);
  const cRight = lerp(CARD.x + 140, 512, toEnd);
  const cTop = lerp(542, 536, toEnd);
  const cIn = f >= t.that + 8;
  const prevN = Math.max(0, n - 1);
  const label = toEnd < 0.5 ? "field goal attempts" : "shots";
  const labelO = toEnd < 0.5 ? prog(f, t.that + 12, 8) * (1 - prog(f, t.and + 4, 8)) : prog(f, t.and + 18, 8);
  // the 50: counts in grey from "50", turns white and settles on "rare"
  const fiftyIn = t.fifty - 4;
  const fv = Math.round(countTo(f, fiftyIn, 40, 0, 50));
  const settle = f >= t.rare ? pop(f, t.rare, { dur: 10, from: 1.14 }) : {};
  return (
    <>
      {toEnd < 1 && (
        <div style={{ position: "absolute", left: dx, top: dy, ...big, fontSize: dSize, lineHeight: 1, color: mix(f, t.that, 16, C.ink, C.dim), opacity: 1 - toEnd }}>
          {toLog > 0.15 && <span style={{ opacity: Math.min(1, (toLog - 0.15) * 3) }}>/ </span>}29
        </div>
      )}
      {cIn && (
        <div style={{ position: "absolute", left: cRight - 0.62 * cSize * 2, top: cTop, width: 0.62 * cSize * 2, ...blurIn(f, t.that + 8, { dur: 7 }) }}>
          <Roll value={n} prev={prevN} at={n > 0 ? t.land(n - 1) : 0} f={f} size={cSize} color={C.ink} width={0.62 * cSize * 2} />
        </div>
      )}
      {cIn && (
        <div style={{ position: "absolute", left: toEnd < 0.5 ? CARD.x + 2 : 512 - 300, width: toEnd < 0.5 ? 400 : 300, textAlign: toEnd < 0.5 ? "left" : "right", top: toEnd < 0.5 ? 678 : 702, fontFamily: theme.font.ui, fontSize: 28, color: C.dim, opacity: labelO }}>
          {label}
        </div>
      )}
      {f >= t.and + 10 && (
        <div style={{ position: "absolute", left: 539, top: 560, width: 2, height: 150 * prog(f, t.and + 10, 12), background: C.line }} />
      )}
      {f >= fiftyIn && (
        <>
          <div style={{ position: "absolute", left: 568, top: 536, ...big, fontSize: 150, lineHeight: `${150 * 1.1}px`, color: mix(f, t.rare - 2, 6, "#6E7681", C.ink), transformOrigin: "0% 60%", ...blurIn(f, fiftyIn, { dur: 8, rise: -30 }), ...settle }}>
            {fv}
          </div>
          <div style={{ position: "absolute", left: 572, top: 702, fontFamily: theme.font.ui, fontSize: 28, color: C.dim, opacity: prog(f, t.rare, 8) }}>points</div>
        </>
      )}
    </>
  );
};

export const PlayByPlayLog: React.FC = () => {
  const { f } = useScene();
  const t = useT();
  // the court: as the hook left it, then into the left column, then back to the centre beneath the two numbers
  const shrink = prog(f, t.that, 26, arriveEase(26));
  const back = prog(f, t.and, 28, arriveEase(28));
  const r = lerpR(lerpR(HAND, SMALL, shrink), END, back);
  const dim = prog(f, t.that + 4, 10);
  const marks: PlayByPlayLogMark[] = ROWS.map((row, i) => {
    const a = t.land(i);
    const landed = f >= a;
    const glintRare = row.made ? 1 - prog(f, t.rare, 16) : 0;
    return {
      lit: landed ? 1 : 1 - dim,
      ping: landed ? prog(f, a, 22, ease.out) : -1,
      glint: landed ? Math.max(1 - prog(f, a, 10), f >= t.rare ? glintRare : 0) : 0,
    };
  });
  return (
    <>
      <PlayByPlayLogCourt r={r} marks={marks} f={f} />
      <PlayByPlayLogPhoto t={t} out={f >= t.and ? 1 : 0} />
      <PlayByPlayLogScore t={t} />
      <PlayByPlayLogCard t={t} />
      <PlayByPlayLogQuarters t={t} />
      <PlayByPlayLogTally t={t} />
      <PlayByPlayLogStrip t={t} />
    </>
  );
};
