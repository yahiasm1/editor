// Basketball-Reference's box score, redrawn at its real copy and column order: the white page, the section heading
// with its rule and "Share & Export", the grey over-header "Basic Box Score Stats", the bold grey header cells,
// numbers right-aligned in tabular figures on hairline rules, the light yellow row highlight the site puts under the
// pointer, the bold grey tfoot "Team Totals". ORB..PF fold into one pleated strip so the evidence stays at 32 px; the
// card runs off the right edge of the stage the way a wide table does on a phone, GmSc showing at the cut.
import React from "react";
import { ease, prog } from "../../../src/engine";
import {
  EightyOneBoxRowCols,
  EightyOneBoxRowFoldLabels,
  EightyOneBoxRowLine,
  EightyOneBoxRowBetween,
} from "./EightyOneBoxRowData";

export const EightyOneBoxRowInk = "#111111";
export const EightyOneBoxRowGold = "#FDB927";
const RULE = "#D2D2D2";
const HEAD_BG = "#EBEBEB";
const HOVER = "#FFF7C2"; // the site's pale yellow under the pointer
const FONT = "Inter, sans-serif";

/** the card's frame on the stage */
export const EightyOneBoxRowCard = { x: 36, y: 752, w: 1044 };
export const EightyOneBoxRowRows = { head: 856, headH: 50, odomH: 60, kobeH: 70, totalsH: 64, foldH: 26 };

/** x of each column's left edge, in stage px */
export const EightyOneBoxRowColX = (() => {
  const out: Record<string, { x: number; w: number }> = {};
  let x = EightyOneBoxRowCard.x;
  for (const c of EightyOneBoxRowCols) {
    out[c.key] = { x, w: c.w };
    x += c.w;
  }
  return out;
})();

/** a cell's value for this frame: null hides it, a string draws it */
export type EightyOneBoxRowCellFn = (key: string) => { text: string; alpha: number; gold?: number; bold?: boolean; flash?: number } | null;

const Cell: React.FC<{ k: string; y: number; h: number; v: ReturnType<EightyOneBoxRowCellFn>; size?: number; weight?: number }> = ({ k, y, h, v, size = 32, weight = 400 }) => {
  if (!v || v.alpha <= 0.01) return null;
  const c = EightyOneBoxRowColX[k];
  const left = k === "player";
  const g = v.gold ?? 0;
  return (
    <>
      {g > 0.01 && (
        <div style={{ position: "absolute", left: c.x + 3, top: y + 5, width: c.w - 6, height: h - 10, borderRadius: 3, background: EightyOneBoxRowGold, opacity: g, boxShadow: `0 0 ${(18 * (v.flash ?? 0)).toFixed(1)}px rgba(253,185,39,${(0.9 * (v.flash ?? 0)).toFixed(2)})` }} />
      )}
      <div
        style={{
          position: "absolute",
          left: c.x + (left ? 12 : 0),
          top: y,
          width: c.w - (left ? 12 : 9),
          height: h,
          lineHeight: `${h}px`,
          textAlign: left ? "left" : "right",
          fontFamily: FONT,
          fontSize: size,
          fontWeight: v.bold ? 700 : weight,
          color: EightyOneBoxRowInk,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: left ? -0.4 : -0.2,
          whiteSpace: "nowrap",
          opacity: v.alpha,
          transform: v.flash ? `scale(${(1 + 0.18 * v.flash).toFixed(3)})` : undefined,
          transformOrigin: left ? "0% 50%" : "100% 50%",
        }}
      >
        {v.text}
      </div>
    </>
  );
};

/** the pleated strip standing for ORB..PF */
const Fold: React.FC<{ y: number; h: number; alpha: number; head?: boolean }> = ({ y, h, alpha, head }) => {
  const c = EightyOneBoxRowColX.fold;
  if (alpha <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: c.x + 4, top: y + (head ? 8 : 6), width: c.w - 8, height: h - (head ? 16 : 12), opacity: alpha, borderRadius: 2, overflow: "hidden" }}>
      {EightyOneBoxRowFoldLabels.map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: (i * (c.w - 8)) / 8,
            top: 0,
            width: (c.w - 8) / 8 + 0.5,
            height: "100%",
            background: i % 2 ? "linear-gradient(90deg, #cfcfcf, #f4f4f4)" : "linear-gradient(90deg, #f4f4f4, #c4c4c4)",
          }}
        />
      ))}
    </div>
  );
};

export const EightyOneBoxRowTable: React.FC<{
  f: number;
  clip?: string; // the page opens around the PTS cell: a CSS inset() while it opens
  cardIn: number; // 0..1 the page arrives
  headIn: number; // 0..1 the header writes
  odom: ReturnType<typeof makeRow>;
  kobe: ReturnType<typeof makeRow>;
  totals: ReturnType<typeof makeRow>;
  lift: number; // 0..1 Odom's row folds away, Kobe's lifts into its place
  totalsIn: number; // 0..1 the folded rows and Team Totals slide in
  hover: number; // 0..1 the pale yellow under Kobe's row
  sweep: number; // a light travelling across the page, -0.3..1.3
}> = ({ clip, cardIn, headIn, odom, kobe, totals, lift, totalsIn, hover, sweep }) => {
  const C = EightyOneBoxRowCard;
  const R = EightyOneBoxRowRows;
  const odomH = R.odomH * (1 - lift);
  const kobeY = R.head + R.headH + odomH;
  const foldY = kobeY + R.kobeH;
  const foldH = R.foldH * totalsIn;
  const totalsY = foldY + foldH;
  const bottom = Math.max(kobeY + R.kobeH, totalsY + R.totalsH * totalsIn) + 14;
  const H = bottom - C.y;
  const cols = EightyOneBoxRowCols;
  const statsL = EightyOneBoxRowColX.mp.x;
  const statsR = EightyOneBoxRowColX.pts.x + EightyOneBoxRowColX.pts.w;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, clipPath: clip, opacity: cardIn, filter: cardIn < 1 ? `blur(${((1 - cardIn) * 12).toFixed(1)}px)` : undefined, transform: `translateY(${((1 - cardIn) * 24).toFixed(1)}px)` }}>
      {/* the page */}
      <div style={{ position: "absolute", left: C.x, top: C.y, width: C.w, height: H, background: "#FFFFFF", borderTopLeftRadius: 10, borderBottomLeftRadius: 10, boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 2px 0 rgba(255,255,255,0.6) inset", overflow: "hidden" }}>
        {/* light across the paper */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${(sweep * 100 - 18).toFixed(1)}%`, width: "18%", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,246,220,0.55), rgba(255,255,255,0))", mixBlendMode: "multiply", opacity: 0.25 }} />
      </div>
      {/* clip everything to the page */}
      <div style={{ position: "absolute", left: C.x, top: C.y, width: C.w, height: H, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -C.x, top: -C.y, width: 1080, height: 1920 }}>
          {/* section heading */}
          <div style={{ position: "absolute", left: C.x + 16, top: C.y + 12, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: EightyOneBoxRowInk, letterSpacing: -0.5, opacity: headIn, whiteSpace: "nowrap" }}>
            Los Angeles Lakers Basic and Advanced Stats
          </div>
          <div style={{ position: "absolute", left: C.x + 16 + 760, top: C.y + 22, fontFamily: FONT, fontSize: 22, color: "#7a7a7a", opacity: headIn * 0.9, whiteSpace: "nowrap" }}>Share &amp; Export ▾</div>
          <div style={{ position: "absolute", left: C.x + 12, top: C.y + 60, width: C.w - 12, height: 2, background: "#cfcfcf", transformOrigin: "0 0", transform: `scaleX(${headIn.toFixed(3)})` }} />
          {/* over-header */}
          <div style={{ position: "absolute", left: statsL, top: C.y + 70, width: statsR - statsL, height: 32, textAlign: "center", fontFamily: FONT, fontSize: 22, color: "#555", opacity: headIn }}>Basic Box Score Stats</div>
          <div style={{ position: "absolute", left: statsL + 6, top: C.y + 100, width: statsR - statsL - 12, height: 1.5, background: "#bdbdbd", opacity: headIn }} />
          {/* header row */}
          <div style={{ position: "absolute", left: C.x, top: R.head, width: C.w, height: R.headH, background: HEAD_BG, borderBottom: "2px solid #b5b5b5", opacity: headIn }} />
          {cols.map((c, i) =>
            c.fold ? (
              <Fold key={c.key} y={R.head} h={R.headH} alpha={headIn} head />
            ) : (
              <div
                key={c.key}
                style={{
                  position: "absolute",
                  left: EightyOneBoxRowColX[c.key].x + (c.key === "player" ? 12 : 0),
                  top: R.head,
                  width: c.w - (c.key === "player" ? 12 : 9),
                  height: R.headH,
                  lineHeight: `${R.headH}px`,
                  textAlign: c.key === "player" ? "left" : "right",
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 25,
                  color: "#000",
                  opacity: prog(headIn * 30, i * 1.4, 8, ease.out),
                }}
              >
                {c.label}
              </div>
            ),
          )}
          {/* Odom, the page's first row */}
          {odomH > 0.5 && (
            <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 0.38 * (1 - lift) }}>
              <div style={{ position: "absolute", left: C.x, top: R.head + R.headH, width: C.w, height: odomH, overflow: "hidden" }}>
                <div style={{ position: "absolute", left: -C.x, top: -(R.head + R.headH) - (R.odomH - odomH) / 2, width: 1080, height: 1920 }}>
                  {cols.map((c) => (c.fold ? <Fold key={c.key} y={R.head + R.headH} h={R.odomH} alpha={odom("player")?.alpha ?? 0} /> : <Cell key={c.key} k={c.key} y={R.head + R.headH} h={R.odomH} v={odom(c.key)} />))}
                </div>
              </div>
              <div style={{ position: "absolute", left: C.x, top: R.head + R.headH + odomH - 1, width: C.w, height: 1, background: RULE }} />
            </div>
          )}
          {/* Kobe */}
          <div style={{ position: "absolute", left: C.x, top: kobeY, width: C.w, height: R.kobeH, background: HOVER, opacity: hover }} />
          {cols.map((c) => (c.fold ? <Fold key={c.key} y={kobeY} h={R.kobeH} alpha={kobe("player")?.alpha ?? 0} /> : <Cell key={c.key} k={c.key} y={kobeY} h={R.kobeH} v={kobe(c.key)} />))}
          <div style={{ position: "absolute", left: C.x, top: kobeY + R.kobeH - 1, width: C.w, height: 1, background: RULE }} />
          {/* the eleven rows between, folded to hairlines, then Team Totals */}
          {totalsIn > 0.01 && (
            <>
              {EightyOneBoxRowBetween.map((_, j) => (
                <div key={j} style={{ position: "absolute", left: C.x + 8, top: foldY + 4 + (j * (foldH - 6)) / EightyOneBoxRowBetween.length, width: C.w - 8, height: 1.2, background: j === 3 ? "#9a9a9a" : "#cdcdcd", opacity: totalsIn }} />
              ))}
              <div style={{ position: "absolute", left: C.x, top: totalsY, width: C.w, height: R.totalsH, background: "#EEEEEE", borderTop: "2px solid #b5b5b5", opacity: totalsIn, transform: `translateY(${((1 - totalsIn) * 40).toFixed(1)}px)` }} />
              <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: totalsIn, transform: `translateY(${((1 - totalsIn) * 40).toFixed(1)}px)` }}>
                {cols.map((c) => (c.fold ? <Fold key={c.key} y={totalsY} h={R.totalsH} alpha={1} /> : <Cell key={c.key} k={c.key} y={totalsY} h={R.totalsH} v={totals(c.key)} weight={700} />))}
              </div>
            </>
          )}
          {/* the right edge: a wide table scrolling off the phone */}
          <div style={{ position: "absolute", left: 1040, top: C.y, width: 40, height: H, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(0,0,0,0.12))" }} />
        </div>
      </div>
    </div>
  );
};

/** builds a row's cell function from a per-key reveal frame and roll */
export const makeRow =
  (f: number, cells: Record<string, { text: string; at: number; roll?: [number, number, number]; gold?: number; flash?: number; bold?: boolean; type?: number }>, fps: number) =>
  (key: string) => {
    const c = cells[key];
    if (!c) return null;
    if (f < c.at) return null;
    let text = c.text;
    if (c.roll) {
      const [from, to, dur] = c.roll;
      const p = prog(f, c.at, dur, ease.outHard);
      text = String(Math.round(from + (to - from) * p));
    } else if (c.type) {
      const n = Math.floor(((f - c.at) / fps) * (1000 / 36));
      text = c.text.slice(0, Math.max(0, Math.min(c.text.length, n)));
    }
    return { text, alpha: prog(f, c.at, 5, ease.out), gold: c.gold, flash: c.flash, bold: c.bold };
  };

/** BBR's line score, the small table under the box score */
export const EightyOneBoxRowLineScore: React.FC<{ f: number; at: number; litAt: number[]; x: number; y: number }> = ({ f, at, litAt, x, y }) => {
  const a = prog(f, at, 8, ease.out);
  if (a <= 0.01) return null;
  const colW = [96, 66, 66, 66, 66, 88];
  const rowH = 58;
  const w = colW.reduce((s, v) => s + v, 0);
  const cx = (i: number) => colW.slice(0, i).reduce((s, v) => s + v, 0);
  const heads = ["", "1", "2", "3", "4", "T"];
  return (
    <div style={{ position: "absolute", left: x, top: y + (1 - a) * 24, width: w + 32, opacity: a, filter: a < 1 ? `blur(${((1 - a) * 10).toFixed(1)}px)` : undefined }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w + 32, height: 70 + rowH * 3 + 18, background: "#FFFFFF", borderRadius: 10, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 16, top: 10, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: EightyOneBoxRowInk, letterSpacing: -0.5 }}>Line Score</div>
      <div style={{ position: "absolute", left: 12, top: 58, width: w + 8, height: 2, background: "#cfcfcf" }} />
      <div style={{ position: "absolute", left: 16, top: 70, width: w, height: rowH, background: HEAD_BG, borderBottom: "2px solid #b5b5b5" }} />
      {heads.map((h, i) => (
        <div key={i} style={{ position: "absolute", left: 16 + cx(i), top: 70, width: colW[i] - 12, height: rowH, lineHeight: `${rowH}px`, textAlign: "right", fontFamily: FONT, fontWeight: 700, fontSize: 25, color: "#000" }}>
          {h}
        </div>
      ))}
      {EightyOneBoxRowLine.map((r, ri) => {
        const ry = 70 + rowH * (ri + 1);
        const vals = [r.team, ...r.q.map(String), String(r.t)];
        return (
          <React.Fragment key={r.team}>
            <div style={{ position: "absolute", left: 16, top: ry + rowH - 1, width: w, height: 1, background: RULE }} />
            {vals.map((v, i) => {
              const vAt = at + 4 + ri * 6 + i * 3;
              const lit = ri === 1 && (i === 3 || i === 4) ? prog(f, litAt[i - 3], 8, ease.out) : 0;
              const flash = ri === 1 && (i === 3 || i === 4) ? Math.max(0, 1 - Math.abs(f - litAt[i - 3] - 4) / 8) : 0;
              return (
                <React.Fragment key={i}>
                  {lit > 0.01 && <div style={{ position: "absolute", left: 16 + cx(i) + 4, top: ry + 5, width: colW[i] - 8, height: rowH - 10, borderRadius: 3, background: HOVER, border: "1.5px solid #e2c23a", opacity: lit }} />}
                  <div
                    style={{
                      position: "absolute",
                      left: 16 + cx(i) + (i === 0 ? 10 : 0),
                      top: ry,
                      width: colW[i] - (i === 0 ? 10 : 12),
                      height: rowH,
                      lineHeight: `${rowH}px`,
                      textAlign: i === 0 ? "left" : "right",
                      fontFamily: FONT,
                      fontSize: 32,
                      fontWeight: i === 5 || lit > 0.5 ? 700 : 400,
                      color: EightyOneBoxRowInk,
                      fontVariantNumeric: "tabular-nums",
                      opacity: prog(f, vAt, 5, ease.out),
                      transform: `scale(${(1 + 0.2 * flash).toFixed(3)})`,
                      transformOrigin: "100% 50%",
                    }}
                  >
                    {v}
                  </div>
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};
