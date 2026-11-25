// The real NBA Official Playing Rules 2025-26 (cdn.nba.com PDF, 5 x 7 in pages), rasterised at 400 dpi so the camera
// can come close: the cover (page 1), page 49 (Rule 12B, Section X, Away-From-The-Play Foul) and, laid over it as a
// cut strip, Rule 4 Section IV(h) from page 18 (the definition the section points to). One paper world in page-49
// pixels (2000 x 2800); highlighter strokes sit on the exact word boxes read off `pdftotext -bbox-layout`.
import React from "react";
import { Img, staticFile } from "remotion";

const P49 = staticFile("shaq-free-throws/rulebookawayfoul-p49.png");
const P18 = staticFile("shaq-free-throws/rulebookawayfoul-p18.png");
const COVER = staticFile("shaq-free-throws/rulebookawayfoul-cover.jpg");

export const RBAF_PAGE = { w: 2000, h: 2800 };
/** the strip cut from page 18 (in page-18 px) and where it lies on page 49 (its top-left, in page-49 px) */
export const RBAF_STRIP = { x0: 250, y0: 1488, x1: 1850, y1: 1697, at: [200, 1330] as [number, number] };
/** page-18 px -> paper world */
export const rbafFrom18 = (x: number, y: number): [number, number] => [x - RBAF_STRIP.x0 + RBAF_STRIP.at[0], y - RBAF_STRIP.y0 + RBAF_STRIP.at[1]];

type Box = [number, number, number, number];
/** word boxes (x0, y0, x1, y1) at 400 dpi, from pdftotext -bbox-layout */
export const RBAF_MARKS: Record<string, { page: 18 | 49; lines: Box[] }> = {
  // "Section X—Away-From-The-Play Foul"
  head: { page: 49, lines: [[200, 1609, 926, 1668]] },
  // "illegal contact by the defense"
  grab: { page: 18, lines: [[980, 1502, 1472, 1553]] },
  // "deliberately / away from the immediate area of offensive action"
  away: { page: 18, lines: [[1614, 1546, 1800, 1597], [300, 1591, 1110, 1642]] },
  // "in the last two / minutes of each period"
  any: { page: 18, lines: [[1554, 1502, 1800, 1553], [300, 1546, 667, 1597]] },
  // "one free throw attempt shall / be awarded. The free throw may be attempted by any player in the game"
  one: { page: 49, lines: [[1247, 1778, 1700, 1829], [350, 1822, 1520, 1873]] },
  // "the offended team shall be awarded / the ball on the sideline"
  side: { page: 49, lines: [[1129, 1925, 1700, 1976], [350, 1969, 716, 2021]] },
};

/** a highlighter pass over one passage, line after line; p 0..1 */
const RulebookAwayFoulMarker: React.FC<{ lines: Box[]; p: number; seed: number }> = ({ lines, p, seed }) => {
  const total = lines.reduce((a, [x0, , x1]) => a + (x1 - x0), 0);
  let done = 0;
  return (
    <>
      {lines.map(([x0, y0, x1, y1], i) => {
        const len = x1 - x0;
        const lp = Math.max(0, Math.min(1, (p * total - done) / len));
        done += len;
        if (lp <= 0) return null;
        const tilt = (((seed * 7 + i * 3) % 5) - 2) * 0.12;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0 - 10,
              top: y0 + 4,
              width: (len + 20) * lp,
              height: y1 - y0 - 2,
              background: "linear-gradient(180deg, rgba(255,226,74,0.78) 0%, rgba(255,214,40,0.92) 55%, rgba(255,222,64,0.8) 100%)",
              mixBlendMode: "multiply",
              borderRadius: "14px 22px 18px 12px",
              transform: `rotate(${tilt}deg)`,
              transformOrigin: "0 50%",
            }}
          />
        );
      })}
    </>
  );
};

export const RulebookAwayFoulBook: React.FC<{
  /** marks: passage -> 0..1 */
  marks: Record<string, number>;
  /** 0..1 the cover swings open on its spine */
  open: number;
  /** 0..1 the strip from page 18 lies on the page */
  strip: number;
  /** 0..1 the reading window is formed (the book's own edges stop mattering) */
  win: number;
}> = ({ marks, open, strip, win }) => {
  const ang = -180 * open;
  const paper = "#FBF7EE";
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: RBAF_PAGE.w, height: RBAF_PAGE.h, transformStyle: "preserve-3d" }}>
      {/* the page stack under page 49: the book's thickness at its fore edge and foot */}
      {[6, 5, 4, 3, 2, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: i * 7,
            top: i * 9,
            width: RBAF_PAGE.w,
            height: RBAF_PAGE.h,
            background: i % 2 ? "#E8E3D8" : "#F3EFE6",
            boxShadow: i === 6 ? `0 40px 90px rgba(0,0,0,${(0.55 * (1 - win)).toFixed(2)})` : "inset -1px -1px 0 rgba(0,0,0,0.12)",
            opacity: 1 - win,
          }}
        />
      ))}
      {/* page 49 */}
      <div style={{ position: "absolute", left: 0, top: 0, width: RBAF_PAGE.w, height: RBAF_PAGE.h, background: paper, overflow: "hidden" }}>
        <Img src={P49} style={{ position: "absolute", left: 0, top: 0, width: RBAF_PAGE.w, height: RBAF_PAGE.h, mixBlendMode: "multiply" }} />
        <RulebookAwayFoulMarker lines={RBAF_MARKS.head.lines} p={marks.head ?? 0} seed={1} />
        <RulebookAwayFoulMarker lines={RBAF_MARKS.one.lines} p={marks.one ?? 0} seed={2} />
        <RulebookAwayFoulMarker lines={RBAF_MARKS.side.lines} p={marks.side ?? 0} seed={3} />
        {/* the gutter: the page curves into the spine on the left, light falls off */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 220, height: "100%", background: "linear-gradient(90deg, rgba(60,45,25,0.28) 0%, rgba(60,45,25,0.08) 40%, rgba(0,0,0,0) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 62% 40%, rgba(255,255,255,0) 50%, rgba(90,70,40,0.10) 100%)" }} />
      </div>
      {/* the strip cut from page 18, laid on the page, a little off square, with its own shadow */}
      {strip > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: RBAF_STRIP.at[0],
            top: RBAF_STRIP.at[1],
            width: RBAF_STRIP.x1 - RBAF_STRIP.x0,
            height: RBAF_STRIP.y1 - RBAF_STRIP.y0,
            transform: `translateY(${((1 - strip) * -900).toFixed(1)}px) rotate(${(-0.5 - 3 * (1 - strip)).toFixed(3)}deg)`,
            transformOrigin: "50% 50%",
            opacity: Math.min(1, strip * 3),
            background: paper,
            boxShadow: `0 ${(12 + 50 * (1 - strip)).toFixed(0)}px ${(28 + 60 * (1 - strip)).toFixed(0)}px rgba(40,28,10,0.35), 0 0 0 2px rgba(120,100,70,0.25)`,
            overflow: "hidden",
          }}
        >
          <Img
            src={P18}
            style={{ position: "absolute", left: -RBAF_STRIP.x0, top: -RBAF_STRIP.y0, width: RBAF_PAGE.w, height: RBAF_PAGE.h, mixBlendMode: "multiply" }}
          />
          <div style={{ position: "absolute", left: -RBAF_STRIP.x0, top: -RBAF_STRIP.y0, width: RBAF_PAGE.w, height: RBAF_PAGE.h }}>
            <RulebookAwayFoulMarker lines={RBAF_MARKS.grab.lines} p={marks.grab ?? 0} seed={4} />
            <RulebookAwayFoulMarker lines={RBAF_MARKS.away.lines} p={marks.away ?? 0} seed={5} />
            <RulebookAwayFoulMarker lines={RBAF_MARKS.any.lines} p={marks.any ?? 0} seed={6} />
          </div>
          {/* where it was cut from: the page's own tag, in the book's type */}
          <div style={{ position: "absolute", right: 40, bottom: 16, fontFamily: "Inter, sans-serif", fontSize: 36, fontWeight: 600, color: "#7A7466", letterSpacing: 1 }}>
            Rule 4, Section IV, p. 18
          </div>
        </div>
      )}
      {/* the cover, hinged on its spine (the left edge): the real cover outside, the plain board inside */}
      {open < 1 && (
        <div
          style={{
            position: "absolute",
            left: -4,
            top: -6,
            width: RBAF_PAGE.w + 14,
            height: RBAF_PAGE.h + 18,
            transformOrigin: "0 50%",
            transform: `rotateY(${ang.toFixed(2)}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: "4px 14px 14px 4px", overflow: "hidden", boxShadow: "0 50px 110px rgba(0,0,0,0.6)" }}>
            <Img src={COVER} style={{ width: "100%", height: "100%" }} />
            {/* the board's soft gloss and the hinge crease near the spine */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 35%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.18) 100%)" }} />
            <div style={{ position: "absolute", left: 48, top: 0, width: 10, height: "100%", background: "linear-gradient(90deg, rgba(0,0,0,0.25), rgba(255,255,255,0.12), rgba(0,0,0,0))" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(90deg, #E9E5DC 0%, #F6F3EC 85%, #DCD6CA 100%)", borderRadius: "14px 4px 4px 14px" }} />
        </div>
      )}
    </div>
  );
};
