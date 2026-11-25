// wilt-100 "record": the real Basketball-Reference page "Wilt Chamberlain 1961-62 Game Log", table "Regular Season",
// redrawn as the white printed page it is: the print header and footer a browser puts on, the h1, the site's
// brown-orange section heading, the grey thead, grey right-aligned Rk, underlined links in dark ink (the site's link
// colour is not drawn: no blue on stage), light grey row rules, faint column rules, DejaVu Sans (what BBR's Verdana
// falls back to). Columns kept: Rk, Date, (@ / N), Opp, Result, PTS, with the real values of all 80 rows.
// The rows type down and the page scrolls with them; row 76's PTS stays under a taped cream slip.
import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { arrive, ease, prog } from "../../../src/engine";
import { RGL, RGL_BBR, RGL_HUNDRED, RGL_PAPER, RGL_ROWS, rglRnd, rglTyped, type RecordT } from "./RecordGameLogKit";

export function useRecordGameLogFont() {
  const [h] = useState(() => delayRender("DejaVu Sans for the BBR game log"));
  useEffect(() => {
    const faces = [
      new FontFace("RGL DejaVu Sans", `url(${staticFile("wilt-100/recordgamelog-dejavusans.ttf")})`, { weight: "400" }),
      new FontFace("RGL DejaVu Sans", `url(${staticFile("wilt-100/recordgamelog-dejavusans-bold.ttf")})`, { weight: "700" }),
    ];
    Promise.all(faces.map((x) => x.load()))
      .then((ok) => {
        ok.forEach((x) => (document.fonts as unknown as { add: (ff: FontFace) => void }).add(x));
        continueRender(h);
      })
      .catch(() => continueRender(h));
  }, [h]);
}

const INK = "#000000";
const GREY = "#6B6E72";
const RULE = "#DDDDDD";
const HEAD = "#B0581A"; // BBR's section heading colour, read off the screenshot
const FS = 24;
// column x in page px
const C = { rkR: 54, date: 70, loc: 238, opp: 262, res: 334, ptsR: 648 };
const COL_RULES = [62, 226, 252, 322, 586];

/** continuous count of typed rows (for a smooth scroll) */
function typedCont(f: number, T: RecordT) {
  const n = rglTyped(f, T);
  if (n >= 80) return 80;
  const a = n === 0 ? T.rowAt(1) - 6 : T.rowAt(n);
  const b = T.rowAt(n + 1);
  return n + Math.max(0, Math.min(1, (f - a) / Math.max(1, b - a)));
}

const Row: React.FC<{ i: number; y: number; f: number; T: RecordT; latest: boolean }> = ({ i, y, f, T, latest }) => {
  const r = RGL_ROWS[i - 1];
  const t = T.rowAt(i);
  const p = prog(f, t, 3, ease.out);
  const hl = latest ? 1 : 1 - prog(f, T.rowAt(Math.min(80, i + 1)), 8, ease.linear);
  const isHundred = i === RGL_HUNDRED;
  const ot = r.res.match(/^(.*?)( \(\d?OT\))?$/)!;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: RGL.pageW, height: RGL.rowH, borderBottom: `1px solid ${RULE}` }}>
      {hl > 0.01 && <div style={{ position: "absolute", inset: 0, background: `rgba(239,238,237,${hl.toFixed(3)})` }} />}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${((1 - p) * 100).toFixed(1)}% 0 0)`, fontFamily: RGL_BBR, fontSize: FS, lineHeight: `${RGL.rowH}px`, color: INK, whiteSpace: "nowrap" }}>
        <div style={{ position: "absolute", right: RGL.pageW - C.rkR, color: GREY }}>{r.rk}</div>
        <div style={{ position: "absolute", left: C.date, textDecoration: "underline", textDecorationThickness: 1, textUnderlineOffset: 3, color: "#2A2D31" }}>{r.date}</div>
        <div style={{ position: "absolute", left: C.loc - 8, width: 16, textAlign: "center" }}>{r.loc}</div>
        <div style={{ position: "absolute", left: C.opp, textDecoration: "underline", textDecorationThickness: 1, textUnderlineOffset: 3, color: "#2A2D31" }}>{r.opp}</div>
        <div style={{ position: "absolute", left: C.res }}>
          <span style={{ textDecoration: "underline", textDecorationThickness: 1, textUnderlineOffset: 3, color: "#2A2D31" }}>{ot[1]}</span>
          {ot[2] ?? ""}
        </div>
        <div style={{ position: "absolute", right: RGL.pageW - C.ptsR, fontWeight: 700, fontSize: FS + 3 }}>{r.pts}</div>
      </div>
      {isHundred && f >= t && (
        // the cream slip taped over the 100, a little crooked, with a strip of yellowed tape
        <div style={{ position: "absolute", left: C.ptsR - 84, top: -5, width: 96, height: RGL.rowH + 10, transform: `rotate(-4deg) scale(${(0.7 + 0.3 * prog(f, t, 5, ease.back)).toFixed(3)})`, background: RGL_PAPER, boxShadow: "0 3px 6px rgba(0,0,0,0.35)", borderRadius: 2 }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.35, background: "repeating-linear-gradient(115deg, rgba(120,100,70,0.10) 0 2px, transparent 2px 5px)" }} />
          <div style={{ position: "absolute", left: 30, top: -8, width: 36, height: 16, background: "rgba(236,226,190,0.75)", transform: "rotate(6deg)", boxShadow: "0 1px 1px rgba(0,0,0,0.15)" }} />
        </div>
      )}
    </div>
  );
};

export const RecordGameLogPage: React.FC<{ f: number; T: RecordT }> = ({ f, T }) => {
  const enterAt = T.that - 6;
  if (f < enterAt) return null;
  const a = arrive(f, enterAt, 18);
  const back = prog(f, T.fifty, 24, ease.inOut);
  const drift = prog(f, T.fifty, T.end - T.fifty, ease.linear);
  const n = rglTyped(f, T);
  const nc = typedCont(f, T);
  const scroll = Math.max(0, nc - RGL.visible + 0.4);
  const tx = (1 - a) * 760 + back * 70 + drift * 14;
  const ty = back * 120;
  const sc = 1 - back * 0.1;
  const bright = 1 - back * 0.7;
  // light travelling over the paper, left to right across the scene
  const sweep = -40 + 160 * prog(f, enterAt, T.end - enterAt, ease.linear);
  const winH = RGL.visible * RGL.rowH;
  const first = Math.max(1, Math.floor(scroll));
  return (
    <div
      style={{
        position: "absolute",
        left: RGL.pageX,
        top: RGL.pageY,
        width: RGL.pageW,
        height: RGL.pageH,
        transformOrigin: "0% 50%",
        transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) perspective(1700px) rotateY(${(-7 + back * 2).toFixed(2)}deg) rotateZ(0.7deg) scale(${sc.toFixed(4)})`,
        filter: `brightness(${bright.toFixed(3)})${a < 0.9 ? ` blur(${((1 - a) * 14).toFixed(1)}px)` : ""}`,
        opacity: prog(f, enterAt, 3, ease.linear),
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", borderRadius: 3, boxShadow: "0 40px 80px rgba(0,0,0,0.55), 0 6px 18px rgba(0,0,0,0.4)", overflow: "hidden" }}>
        {/* the browser's print header */}
        <div style={{ position: "absolute", left: 22, right: 22, top: 9, display: "flex", justifyContent: "space-between", fontFamily: RGL_BBR, fontSize: 13, color: "#777" }}>
          <span>Wilt Chamberlain 1961-62 Game Log | Basketball-Reference.com</span>
          <span>1/3</span>
        </div>
        <div style={{ position: "absolute", left: 22, top: 36, fontFamily: RGL_BBR, fontWeight: 700, fontSize: 31, color: INK, letterSpacing: -0.3 }}>Wilt Chamberlain 1961-62 Game Log</div>
        <div style={{ position: "absolute", left: 22, top: 84, fontFamily: RGL_BBR, fontWeight: 700, fontSize: 25, color: HEAD }}>Regular Season</div>
        {/* thead */}
        <div style={{ position: "absolute", left: 0, top: 118, width: RGL.pageW, height: 32, background: "#EFEEED", borderTop: "1px solid #C9CBCD", borderBottom: "2px solid #9C9EA1", fontFamily: RGL_BBR, fontWeight: 700, fontSize: 19, lineHeight: "31px", color: "#222" }}>
          <span style={{ position: "absolute", right: RGL.pageW - C.rkR }}>Rk</span>
          <span style={{ position: "absolute", left: C.date }}>Date</span>
          <span style={{ position: "absolute", left: C.opp }}>Opp</span>
          <span style={{ position: "absolute", left: C.res }}>Result</span>
          <span style={{ position: "absolute", right: RGL.pageW - C.ptsR }}>PTS</span>
        </div>
        {/* the body window */}
        <div style={{ position: "absolute", left: 0, top: RGL.bodyTop + 2, width: RGL.pageW, height: winH, overflow: "hidden" }}>
          {COL_RULES.map((x) => (
            <div key={x} style={{ position: "absolute", left: x, top: 0, bottom: 0, width: 0, borderLeft: "1px dotted #E3E3E3" }} />
          ))}
          {Array.from({ length: Math.min(n, first + RGL.visible + 1) - first + 1 }, (_, k) => first + k)
            .filter((i) => i >= 1 && i <= n)
            .map((i) => (
              <Row key={i} i={i} y={(i - 1 - scroll) * RGL.rowH} f={f} T={T} latest={i === n} />
            ))}
        </div>
        {/* the print footer */}
        <div style={{ position: "absolute", left: 22, right: 22, bottom: 10, fontFamily: RGL_BBR, fontSize: 13, color: "#777" }}>
          https://www.basketball-reference.com/players/c/chambwi01/gamelog/1962
        </div>
        {/* paper: a faint tooth, and light travelling across */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5, background: `radial-gradient(circle at ${(30 + rglRnd(3) * 10).toFixed(0)}% 20%, rgba(255,255,255,0) 0%, rgba(0,0,0,0.05) 100%)` }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep - 18}%, rgba(255,250,235,0.20) ${sweep}%, rgba(255,255,255,0) ${sweep + 18}%)` }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(90deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0) 12%, rgba(0,0,0,0) 85%, rgba(0,0,0,0.06) 100%)" }} />
      </div>
    </div>
  );
};

