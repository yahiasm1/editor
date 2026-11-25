// The real play-by-play of Phoenix at San Antonio, Oct 29 2008 (pages/bbref-pbp-2008-10-29-phx-at-sas.html), in the
// reel's dark Basketball-Reference style (as RecordBoxScore): the "1st Q" band, the column heads, the jump ball row at
// 12:00.0, then the foul row typing on at 11:55.0 in the Phoenix column, score 0-0. Names are links (underlined);
// "M. Finley" takes the foul red. Local box 620 x 330.
import React from "react";

const UI = "Inter, sans-serif";
const C = { card: "#161B22", band: "#1C222B", hair: "#30363D", ink: "#FFFFFF", soft: "#C9D1D9", dim: "#8B949E", red: "#E5383B" };

export const POPOVICHCLOCK_LOG = { w: 620, h: 330 };

const FOUL = "Personal foul by M. Finley (drawn by S. O'Neal)";

export const PopovichClockLog: React.FC<{ typed: number; timeLit: number; redK: number; caret: boolean }> = ({ typed, timeLit, redK, caret }) => {
  const shown = FOUL.slice(0, Math.max(0, Math.min(FOUL.length, Math.floor(typed))));
  // split into the two printed lines and colour the names
  const line1Full = "Personal foul by M. Finley";
  const l1 = shown.slice(0, line1Full.length);
  const l2 = shown.length > line1Full.length ? shown.slice(line1Full.length + 1) : "";
  const pre = l1.slice(0, "Personal foul by ".length);
  const name = l1.slice("Personal foul by ".length);
  const red = `rgb(${Math.round(255 + (229 - 255) * redK)},${Math.round(255 + (56 - 255) * redK)},${Math.round(255 + (59 - 255) * redK)})`;
  const link: React.CSSProperties = { textDecoration: "underline", textDecorationThickness: 1.5, textUnderlineOffset: 5, textDecorationColor: "rgba(201,209,217,0.45)" };
  const showScore = shown.length >= FOUL.length;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: POPOVICHCLOCK_LOG.w, height: POPOVICHCLOCK_LOG.h, borderRadius: 22, background: C.card, border: `1px solid ${C.hair}`, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.45)", fontFamily: UI }}>
      {/* the quarter band */}
      <div style={{ height: 46, background: C.band, borderBottom: `1px solid ${C.hair}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.soft, fontWeight: 700, fontSize: 24 }}>1st Q</div>
      {/* column heads, as printed */}
      <div style={{ display: "flex", height: 38, alignItems: "center", borderBottom: `1px solid ${C.hair}`, color: C.dim, fontSize: 20, fontWeight: 600 }}>
        <div style={{ width: 120, textAlign: "center" }}>Time</div>
        <div style={{ width: 420, textAlign: "center" }}>Phoenix</div>
        <div style={{ width: 80, textAlign: "center" }}>Score</div>
      </div>
      {/* 12:00.0, the jump ball */}
      <div style={{ display: "flex", height: 70, alignItems: "center", borderBottom: `1px solid ${C.hair}`, fontSize: 24, color: C.dim }}>
        <div style={{ width: 120, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>12:00.0</div>
        <div style={{ width: 500, paddingRight: 18, lineHeight: 1.25 }}>
          Jump ball: <span style={link}>T. Duncan</span> vs. <span style={link}>S. O'Neal</span>
        </div>
      </div>
      {/* 11:55.0, the foul */}
      <div style={{ display: "flex", height: 130, alignItems: "center", background: timeLit > 0 ? `rgba(229,56,59,${(0.08 * timeLit).toFixed(3)})` : undefined }}>
        <div style={{ width: 120, textAlign: "center", fontSize: 27, fontWeight: 700, color: timeLit > 0.5 ? C.ink : C.soft, fontVariantNumeric: "tabular-nums", alignSelf: "flex-start", paddingTop: 22 }}>11:55.0</div>
        <div style={{ width: 420, fontSize: 30, fontWeight: 600, color: C.ink, lineHeight: 1.32, whiteSpace: "nowrap" }}>
          <div>
            {pre}
            {name && <span style={{ ...link, color: red, textDecorationColor: redK > 0.5 ? "rgba(229,56,59,0.6)" : link.textDecorationColor }}>{name}</span>}
            {caret && !l2 && <span style={{ display: "inline-block", width: 3, height: 32, background: C.ink, marginLeft: 3, verticalAlign: -5 }} />}
          </div>
          <div style={{ color: C.soft, fontWeight: 500, minHeight: 41 }}>
            {l2.startsWith("(drawn by ") ? (
              <>
                (drawn by <span style={link}>{l2.slice("(drawn by ".length).replace(")", "")}</span>
                {l2.endsWith(")") ? ")" : ""}
              </>
            ) : (
              l2
            )}
            {caret && l2 && !showScore && <span style={{ display: "inline-block", width: 3, height: 32, background: C.ink, marginLeft: 3, verticalAlign: -5 }} />}
          </div>
        </div>
        <div style={{ width: 80, textAlign: "center", fontSize: 27, fontWeight: 600, color: C.soft, opacity: showScore ? 1 : 0, fontVariantNumeric: "tabular-nums" }}>0-0</div>
      </div>
      <div style={{ position: "absolute", right: 18, bottom: 10, fontSize: 18, color: C.dim }}>Basketball-Reference</div>
    </div>
  );
};
