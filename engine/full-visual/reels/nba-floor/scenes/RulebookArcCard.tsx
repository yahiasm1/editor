// The rule itself, redrawn from the real page (official.nba.com/rule-no-1-court-dimensions-equipment/, screenshot in
// assets/refs/pages/nba-official-rule1-screenshot.png): the NBA blue top bar with the logoman and "NBA Official" in a
// tall condensed face, a light grey page, the breadcrumb, the ultra-condensed black heading, "Section I—Court and
// Dimensions" in grey, the lettered list in grey Open Sans. Item d. is the reel's sentence. A gold highlighter
// (gold = distance in this reel) runs over it word by word. The card then condenses to a strip holding only item d.
import React from "react";
import { staticFile } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadOpenSans } from "@remotion/google-fonts/OpenSans";

const OSWALD = loadOswald("normal", { weights: ["300", "500", "600"], subsets: ["latin"] }).fontFamily;
const OPEN = loadOpenSans("normal", { weights: ["400", "600"], subsets: ["latin"] }).fontFamily;

const D_PRE = "The three-point field goal area has";
const D_B = "parallel lines 3’ from the sidelines, extending from the baseline";
const D_MID = "and";
const D_A = "an arc of 23’9” from the middle of the basket";
const D_POST = "which intersects the parallel lines.";

const HEAD_FULL = 84;
const HEAD_STRIP = 60;
const PRE_D = 330; // body height above item d in the full page
const D_H = 4 * 45;

/** words highlighted one after another as p runs 0..1 */
const Marked: React.FC<{ text: string; p: number; base: string }> = ({ text, p, base }) => {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => {
        const q = Math.max(0, Math.min(1, p * words.length - i));
        return (
          <span key={i}>
            <span
              style={{
                backgroundImage: "linear-gradient(rgba(242,179,61,0.62), rgba(242,179,61,0.62))",
                backgroundRepeat: "no-repeat",
                backgroundSize: `${(q * 100).toFixed(1)}% 78%`,
                backgroundPosition: "0 70%",
                color: q > 0.5 ? "#15181C" : base,
                padding: "0 1px",
              }}
            >
              {w}
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </>
  );
};

export const RulebookArcCard: React.FC<{
  /** 0 the whole page, 1 the strip */
  strip: number;
  hlA: number;
  hlB: number;
  /** 0..1 rising into place; 0..1 leaving */
  enter: number;
  leave: number;
}> = ({ strip, hlA, hlB, enter, leave }) => {
  if (enter <= 0.001 || leave >= 0.999) return null;
  const s = strip;
  const head = HEAD_FULL + (HEAD_STRIP - HEAD_FULL) * s;
  const top = 560 + (526 - 560) * s + (1 - enter) * 520 - leave * 60;
  const height = 720 + (head + 14 + D_H + 18 - 720) * s;
  const bodyY = -(PRE_D - 14) * s;
  const ctx = 1 - s; // the rest of the page fades as it condenses
  const item = (letter: string, children: React.ReactNode, size: number, color: string, extra: React.CSSProperties = {}) => (
    <div style={{ display: "flex", gap: 14, fontFamily: OPEN, fontSize: size, lineHeight: `${Math.round(size * 1.4)}px`, color, ...extra }}>
      <div style={{ width: 30, flex: "none", textAlign: "right" }}>{letter}</div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        top,
        width: 980,
        height,
        borderRadius: 24,
        overflow: "hidden",
        background: "#F8F8F8",
        boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1.5px #30363D",
        opacity: Math.min(1, enter * 1.4) * (1 - leave),
        filter: enter < 1 ? `blur(${((1 - enter) * 10).toFixed(1)}px)` : leave > 0 ? `blur(${(leave * 10).toFixed(1)}px)` : undefined,
      }}
    >
      {/* the page body, scrolled so item d. stays in view as the card condenses */}
      <div style={{ position: "absolute", left: 0, right: 0, top: head, transform: `translateY(${bodyY.toFixed(1)}px)`, padding: "22px 40px 0 26px" }}>
        <div style={{ opacity: ctx }}>
          <div style={{ height: 36, fontFamily: OSWALD, fontWeight: 300, fontSize: 24, color: "#555", borderLeft: "1px solid #D8D8D8", paddingLeft: 14 }}>
            Rulebook Home &gt; RULE NO. 1: Court Dimensions – Equipment
          </div>
          <div style={{ height: 76, fontFamily: OSWALD, fontWeight: 600, fontSize: 58, letterSpacing: -2.2, color: "#111", transform: "scaleX(0.86)", transformOrigin: "0 0", whiteSpace: "nowrap", lineHeight: "76px" }}>
            RULE NO. 1: Court Dimensions – Equipment
          </div>
          <div style={{ height: 48, fontFamily: OPEN, fontSize: 28, color: "#666", lineHeight: "48px" }}>Section I—Court and Dimensions</div>
          <div style={{ height: 156, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            {item("c.", "A free throw line shall be drawn (2” wide) across each of the circles indicated in the court diagram. It shall be parallel to the end line and shall be 15’ from the plane of the face of the backboard.", 27, "#777")}
          </div>
        </div>
        <div style={{ height: 14 }} />
        <div style={{ height: D_H }}>
          {item(
            "d.",
            <>
              {D_PRE} <Marked text={D_B} p={hlB} base="#3A3F45" /> {D_MID} <Marked text={D_A} p={hlA} base="#3A3F45" /> {D_POST}
            </>,
            32,
            "#3A3F45",
            { lineHeight: "45px" },
          )}
        </div>
        <div style={{ opacity: ctx, marginTop: 14 }}>
          {item("e.", "Four hash marks shall be drawn (2” wide) perpendicular to the sideline on each side of the court and 28’ from the baseline. These hash marks shall extend 3’ onto the court.", 27, "#777")}
        </div>
      </div>
      {/* the NBA Official top bar */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: head, background: "#1D428A", display: "flex", alignItems: "center", paddingLeft: 30, gap: 22 }}>
        <div style={{ width: head * 0.38, height: head * 0.72, borderRadius: 4, overflow: "hidden", flex: "none", background: "#fff" }}>
          <img src={staticFile("nba-floor/rulebookarc-logoman.svg")} style={{ height: "100%", width: "auto", transform: "translateX(-2%)" }} />
        </div>
        <div style={{ fontFamily: OSWALD, fontWeight: 300, fontSize: head * 0.56, color: "#fff", letterSpacing: -0.5, lineHeight: 1 }}>NBA Official</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: OSWALD, fontWeight: 300, fontSize: 26, color: "rgba(255,255,255,0.85)", paddingRight: 30, whiteSpace: "nowrap" }}>
          Rule No. 1 · Section I
        </div>
      </div>
      {/* the page carries on below */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90 * ctx, background: "linear-gradient(rgba(248,248,248,0), #F8F8F8)" }} />
    </div>
  );
};
