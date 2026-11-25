// The real cell the 52.7 comes from: Shaq's Basketball-Reference Totals table, its footer row "19 Yrs", column FT%,
// ".527" (leading zero dropped, as BBR prints it). BBR's look (nba-floor's screenshot): white page, bold header, the
// total row bold on #EEE between two dark grey rules, Verdana falling back to DejaVu Sans.
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

export const PW_BBR_FONT = "'PW DejaVu Sans', 'DejaVu Sans', Verdana, sans-serif";

export function usePercentWallCellFont() {
  const [h] = useState(() => delayRender("DejaVu Sans for the BBR cell"));
  useEffect(() => {
    const faces = [
      new FontFace("PW DejaVu Sans", `url(${staticFile("shaq-free-throws/percentwall-dejavusans.ttf")})`, { weight: "400" }),
      new FontFace("PW DejaVu Sans", `url(${staticFile("shaq-free-throws/percentwall-dejavusans-bold.ttf")})`, { weight: "700" }),
    ];
    Promise.all(faces.map((x) => x.load()))
      .then((ok) => {
        ok.forEach((x) => (document.fonts as unknown as { add: (ff: FontFace) => void }).add(x));
        continueRender(h);
      })
      .catch(() => continueRender(h));
  }, [h]);
}

const COLS = [
  { h: "Season", w: 118, left: true },
  { h: "FT", w: 74 },
  { h: "FTA", w: 88 },
  { h: "FT%", w: 76 },
];

/** hi: 0..1, the white hairline drawn round the .527 cell */
export const PercentWallCell: React.FC<{ hi: number; dimOthers: number }> = ({ hi, dimOthers }) => {
  const cell = (txt: string, i: number, bold: boolean): React.ReactNode => (
    <div
      key={i}
      style={{
        width: COLS[i].w,
        textAlign: COLS[i].left ? "left" : "right",
        padding: "0 8px",
        boxSizing: "border-box",
        fontWeight: bold ? 700 : 400,
        opacity: i === 1 || i === 2 ? 1 - 0.75 * dimOthers : 1,
      }}
    >
      {txt}
    </div>
  );
  const W = COLS.reduce((a, c) => a + c.w, 0);
  return (
    <div style={{ position: "relative", width: W + 16, fontFamily: PW_BBR_FONT, color: "#000", fontSize: 21 }}>
      <div style={{ background: "#FFFFFF", borderRadius: 6, padding: "6px 8px 8px", boxShadow: "0 10px 30px rgba(0,0,0,0.45)" }}>
        <div style={{ display: "flex", height: 32, alignItems: "center", borderBottom: "1px solid #DDD" }}>
          {COLS.map((c, i) => cell(c.h, i, true))}
        </div>
        <div style={{ display: "flex", height: 36, alignItems: "center", background: "#EEE", borderTop: "2px solid #747678", borderBottom: "2px solid #747678" }}>
          {["19 Yrs", "5935", "11252", ".527"].map((t, i) => cell(t, i, true))}
        </div>
      </div>
      {/* the cell itself, ringed */}
      <div
        style={{
          position: "absolute",
          right: 8 - 4,
          top: 6 + 32 - 4,
          width: COLS[3].w + 8,
          height: 36 + 8,
          border: "3px solid #FFFFFF",
          borderRadius: 6,
          boxShadow: "0 0 0 2px rgba(13,17,23,0.9), 0 0 18px rgba(255,255,255,0.35)",
          opacity: hi,
          transform: `scale(${(1.25 - 0.25 * hi).toFixed(3)})`,
        }}
      />
      <div style={{ marginTop: 10, fontFamily: "Inter, sans-serif", fontSize: 22, color: "#8B949E" }}>Basketball-Reference, career totals</div>
    </div>
  );
};
