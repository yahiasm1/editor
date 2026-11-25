// "That's the second most points in NBA history, behind only Wilt Chamberlain's 100."
// Kobe's own Basketball-Reference box score row, left behind as `eightyone` lifts off, pleats its stat columns shut
// and becomes his line in BBR's single-game points list, redrawn at its real copy and dated as it stood after the
// game (Bam Adebayo's 83 and Luka Doncic's 73 came later). The rows under him write in from the bottom up, his row
// drops into rank 2 with weight, the 81 in his gold. A row opens above him and Wilt Chamberlain's 100 lands there
// with the AP photo of the "100" sign, the 100 counting up in white in an ink cell.
import React from "react";
import { Img, staticFile } from "remotion";
import { blurIn, ease, pop, prog, typeOn, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { StaplesNightBoard } from "./StaplesNightBoard";
import { EightyOneBoxRowColX, EightyOneBoxRowRows } from "./EightyOneBoxRowTable";
import { EightyOneBoxRowKobe } from "./EightyOneBoxRowData";
import {
  AllTimeListCard,
  AllTimeListCol,
  AllTimeListFiles,
  AllTimeListGold,
  AllTimeListHeadBg,
  AllTimeListHover,
  AllTimeListInk,
  AllTimeListKobe,
  AllTimeListLower,
  AllTimeListRule,
  AllTimeListWilt,
  AllTimeListY,
} from "./AllTimeListData";

const GREY = "#8B949E";
const FONT = "Inter, sans-serif";
const C = AllTimeListCol;
const Y = AllTimeListY;
const BOX_Y = EightyOneBoxRowRows.head + EightyOneBoxRowRows.headH; // Kobe's row as `eightyone` leaves it
const BOX_H = EightyOneBoxRowRows.kobeH;
const HOVER_TOP = 700;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const bell = (f: number, at: number, dur: number) => {
  const t = (f - at) / dur;
  return t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t);
};
const N = (n: number) => n.toFixed(2);

/** one line of table text; x is the left edge, or the right edge when right = true */
const AllTimeListText: React.FC<{
  x: number;
  top: number;
  h: number;
  text: string;
  size?: number;
  weight?: number;
  right?: boolean;
  color?: string;
  alpha?: number;
  style?: React.CSSProperties;
}> = ({ x, top, h, text, size = 32, weight = 400, right, color = AllTimeListInk, alpha = 1, style }) => {
  if (alpha <= 0.01 || !text) return null;
  const w = 520;
  return (
    <div
      style={{
        position: "absolute",
        left: right ? x - w : x,
        top,
        width: w,
        height: h,
        lineHeight: `${h}px`,
        textAlign: right ? "right" : "left",
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        color,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: -0.3,
        whiteSpace: "nowrap",
        opacity: alpha,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** a photo print: white border, a hairline, a shadow, the picture cropped to fill */
const AllTimeListPrint: React.FC<{ src: string; x: number; top: number; w: number; h: number; alpha: number; blur?: number; flash?: number; push?: number; gray?: boolean }> = ({ src, x, top, w, h, alpha, blur = 0, flash = 0, push = 0, gray }) => {
  if (alpha <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top, width: w, height: h, opacity: alpha, filter: blur > 0.2 ? `blur(${N(blur)}px)` : undefined, background: "#fff", padding: 4, boxSizing: "border-box", boxShadow: "0 6px 16px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,0,0,0.12)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${N(1 + push)})`, transformOrigin: "60% 35%", filter: gray ? "contrast(1.05)" : undefined }} />
        {flash > 0.01 && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, #fff 0%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0) 100%)", opacity: flash }} />}
      </div>
    </div>
  );
};

export const AllTimeList: React.FC = () => {
  const { f, fps, scene, cue, endsOn } = useScene();
  const mount = scene.from - LEAD;

  const tSecond = cue("second");
  const tMost = cue("most");
  const tPoints = cue("points");
  const tHist = cue("history");
  const tBehind = cue("behind");
  const tOnly = cue("only");
  const tCham = cue("Chamberlain's");
  const t100 = cue("100");

  // ------------------------------------------------------------ Kobe's row: box score row -> list row -> rank 2
  const foldS = scene.from + 3; // the outgoing page has whipped off the top: no copy of the row under it
  const kF = prog(f, foldS, 22, ease.inOut);
  const dropS = endsOn("second", 12);
  const dK = prog(f, dropS, 12, ease.in);
  const open = prog(f, tBehind - 2, 22, ease.inOut); // the empty row opening above his
  const slotY = Y.rows + Y.wiltH * open;
  const joltK = bell(f, tSecond, 10);
  const joltW = bell(f, tCham, 14);
  const kobeTop = dK < 1 ? lerp(lerp(BOX_Y, HOVER_TOP, kF), Y.rows, dK) : slotY + 8 * joltW;
  const kH = lerp(BOX_H, Y.kobeH, kF);
  const kW = lerp(1044, AllTimeListCard.w, kF);
  const kLift = kF * (1 - dK);
  const kScale = 1 + 0.05 * kLift;
  const kSquash = bell(f, tSecond, 9);
  const nameK = prog(f, tHist - 6, 14, ease.inOut);
  const subK = prog(f, tPoints - 2, 10, ease.out);
  const photoK = prog(f, tHist - 8, 12, ease.out);
  const breathe = 0.5 + 0.5 * Math.sin(f * 0.09);
  const glow81 = f < tSecond ? 0.25 * kF : 0.55 + 0.25 * breathe + 1.2 * bell(f, tSecond, 18) - 0.25 * prog(f, tCham, 12);

  // the pleat that eats MP..FT% from the right, then closes to nothing
  const fold = EightyOneBoxRowColX.fold;
  const mp = EightyOneBoxRowColX.mp;
  const ptsBox = EightyOneBoxRowColX.pts;
  const a1 = clamp(kF / 0.38);
  const a2 = clamp((kF - 0.38) / 0.62);
  const pleatL = kF < 0.38 ? lerp(fold.x, mp.x, ease.inOut(a1)) : lerp(mp.x, C.ptsL - 6, ease.inOut(a2));
  const pleatR = kF < 0.38 ? ptsBox.x : lerp(ptsBox.x, C.ptsL - 2, ease.inOut(a2));
  const pleatA = 1 - clamp((kF - 0.82) / 0.18);
  const statA = 1 - clamp(kF / 0.3);
  const ptsX = lerp(ptsBox.x, C.ptsL, kF);
  const ptsW = lerp(ptsBox.w, C.ptsR - C.ptsL, kF);
  const ptsH = lerp(BOX_H - 10, 84, kF);
  const ptsSize = lerp(32, 58, kF);
  const nameX = lerp(48, C.name, kF) + (C.hero - C.name) * nameK;
  const nameSize = lerp(32, 34, kF);
  const nameTop = kH / 2 - 21 - 20 * subK;

  // ------------------------------------------------------------ the page
  const cardIn = prog(f, foldS + 9, 8, ease.out);
  const lowTop = slotY + Y.kobeH;
  const lowAt = (i: number) => foldS + 10 + (AllTimeListLower.length - 1 - i) * 4; // bottom row first
  const lowDim = 1 - 0.5 * prog(f, tHist, 10, ease.out);
  const cardBottom = lowTop + AllTimeListLower.length * Y.lowH + 10 + 8 * joltW;
  const headAt = tSecond + 4;
  const h1 = typeOn("NBA Single Game Leaders and Records for Points", f, tSecond + 6, fps, 14);
  const ruleK = prog(f, tSecond + 10, 16, ease.out);
  const title = typeOn("Most points in an NBA game, as of Jan 22, 2006", f, tMost - 4, fps, 16);
  const sweep = lerp(-0.3, 1.3, prog(f, tHist, 150, ease.inOut));

  // ------------------------------------------------------------ Wilt's row
  const wDropS = endsOn("Chamberlain's", 14);
  const wK = prog(f, wDropS, 14, ease.in);
  const wAlpha = prog(f, wDropS, 4, ease.linear);
  const wTop = lerp(700, Y.rows, wK);
  const wScale = lerp(1.1, 1, wK);
  const wSquash = bell(f, tCham, 10);
  const countS = endsOn("100", 26);
  const count = Math.round(f >= t100 ? 100 : 100 * prog(f, countS, 26, ease.inOut));
  const flash100 = bell(f, t100, 16);
  const bulbFlash = bell(f, tCham, 14);
  const slotA = prog(f, tBehind, 8, ease.out) * (1 - wAlpha);

  // the whole thing: a slow push in, and the jolt of Wilt's landing
  const push = 1 + 0.014 * prog(f, tSecond, 230, ease.linear);
  const shakeT = f - tCham;
  const shake = shakeT >= 0 && shakeT < 16 ? Math.exp(-shakeT / 4.5) * Math.sin(shakeT * 1.9) * 7 : 0;

  // the arena behind, as `eightyone` leaves it; it goes once the photos arrive
  const arenaA = 1 - prog(f, tHist, 16, ease.inOut);

  const hdr = (k: string, x: number, right = false) => <AllTimeListText key={k} x={x} top={Y.head} h={Y.headH} text={k} size={24} weight={700} right={right} />;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* ---------- the night photo, dark, behind it all */}
      {arenaA > 0.01 && (
        <div style={{ position: "absolute", left: 0, top: 700, width: 1080, height: 760, overflow: "hidden", opacity: 0.75 * arenaA, WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 22%, #000 70%, transparent 100%)" }}>
          <Img src={staticFile(AllTimeListFiles.arena)} style={{ position: "absolute", left: -198 + prog(f, mount, 380, ease.linear) * 26, top: -170, width: 1600, height: 1200, maxWidth: "none", filter: "blur(5px) brightness(0.32) saturate(0.8)" }} />
        </div>
      )}

      {/* ---------- the scoreboard, parked, FINAL */}
      <StaplesNightBoard st={{ power: 1, tor: 104, lal: 122, period: "FINAL", clock: "0.0", logoTor: 1, logoLal: 1 }} />

      {/* ---------- the dated title and the source, on the navy */}
      <div style={{ position: "absolute", left: 40, top: 700, height: 38, lineHeight: "38px", fontFamily: FONT, fontSize: 28, color: GREY, whiteSpace: "nowrap", opacity: title.text ? 1 : 0 }}>{title.text}</div>
      <div style={{ ...blurIn(f, tMost + 10, { dur: 8 }), position: "absolute", right: 40, top: 704, fontFamily: FONT, fontSize: 24, color: GREY }}>Basketball-Reference</div>

      <div style={{ position: "absolute", inset: 0, transform: `translateY(${N(shake)}px) scale(${push.toFixed(4)})`, transformOrigin: "540px 1080px" }}>
        {/* ---------- the white page */}
        {cardIn > 0.01 && (
          <div style={{ position: "absolute", left: AllTimeListCard.x, top: AllTimeListCard.top, width: AllTimeListCard.w, height: cardBottom - AllTimeListCard.top, background: "#fff", borderRadius: 10, overflow: "hidden", opacity: cardIn, filter: cardIn < 1 ? `blur(${N((1 - cardIn) * 6)}px)` : undefined, boxShadow: "0 24px 60px rgba(0,0,0,0.55)" }}>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${(sweep * 100 - 18).toFixed(1)}%`, width: "18%", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,240,205,0.6), rgba(255,255,255,0))", mixBlendMode: "multiply", opacity: 0.3 }} />
          </div>
        )}

        {/* ---------- heading, rule, header row */}
        <div style={{ position: "absolute", left: 52, top: Y.h1, height: 46, lineHeight: "46px", fontFamily: FONT, fontWeight: 700, fontSize: 32, letterSpacing: -0.5, color: AllTimeListInk, whiteSpace: "nowrap" }}>{h1.text}</div>
        <div style={{ position: "absolute", left: 48, top: Y.rule, width: AllTimeListCard.w - 24, height: 2, background: "#cfcfcf", transformOrigin: "0 0", transform: `scaleX(${N(ruleK)})` }} />
        <div style={{ ...blurIn(f, headAt, { dur: 8 }), position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: AllTimeListCard.x, top: Y.head, width: AllTimeListCard.w, height: Y.headH, background: AllTimeListHeadBg, borderBottom: `1px solid ${AllTimeListRule}` }} />
          {hdr("Rank", C.rankR, true)}
          {hdr("Player", C.name)}
          {hdr("PTS", C.ptsR - 8, true)}
          {hdr("Date", C.date)}
          {hdr("Tm", C.tm)}
        </div>

        {/* ---------- the rows under Kobe's, written in from the bottom up */}
        {AllTimeListLower.map((r, i) => {
          const at = lowAt(i);
          const p = prog(f, at, 8, ease.out);
          if (p <= 0.01) return null;
          const jolt = 7 * joltK * (1 - i * 0.16) + 8 * joltW;
          const top = lowTop + i * Y.lowH + (1 - p) * 14 + jolt;
          return (
            <div key={i} style={{ position: "absolute", inset: 0, opacity: p * lowDim, filter: p < 1 ? `blur(${N((1 - p) * 10)}px)` : undefined }}>
              <AllTimeListText x={C.rankR} top={top} h={Y.lowH} text={r.rank} right />
              <AllTimeListText x={C.name} top={top} h={Y.lowH} text={r.player} />
              <AllTimeListText x={C.ptsR - 8} top={top} h={Y.lowH} text={r.pts} right />
              <AllTimeListText x={C.date} top={top} h={Y.lowH} text={r.date} />
              <AllTimeListText x={C.tm} top={top} h={Y.lowH} text={r.tm} />
              <div style={{ position: "absolute", left: AllTimeListCard.x + 8, top: top + Y.lowH - 1, width: AllTimeListCard.w - 16, height: 1, background: AllTimeListRule }} />
            </div>
          );
        })}

        {/* ---------- the empty row opening above Kobe's */}
        {slotA > 0.01 && open > 0.01 && (
          <div style={{ position: "absolute", left: AllTimeListCard.x, top: Y.rows, width: AllTimeListCard.w, height: Y.wiltH * open, overflow: "hidden", opacity: slotA }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #f1f1f1, #fafafa 30%, #fafafa 70%, #f1f1f1)", boxShadow: "inset 0 6px 10px rgba(0,0,0,0.10), inset 0 -6px 10px rgba(0,0,0,0.08)" }} />
            <div style={{ ...pop(f, tOnly, { from: 0.5 }), position: "absolute", left: C.rankR - AllTimeListCard.x - 80, top: 0, width: 80, height: Y.wiltH, lineHeight: `${Y.wiltH}px`, textAlign: "right", fontFamily: FONT, fontSize: 34, fontWeight: 700, color: "#9a9a9a" }}>1.</div>
          </div>
        )}

        {/* ---------- Kobe's row */}
        <div
          style={{
            position: "absolute",
            left: AllTimeListCard.x,
            top: kobeTop,
            width: kW,
            height: kH,
            transform: `scale(${N(kScale + 0.012 * kSquash)}, ${N(kScale - 0.03 * kSquash)})`,
            transformOrigin: "50% 100%",
            boxShadow: `0 ${N(4 + 30 * kLift)}px ${N(8 + 50 * kLift)}px rgba(0,0,0,${N(0.15 + 0.4 * kLift)})`,
            borderRadius: 6 * kF,
            overflow: "hidden",
            background: AllTimeListHover,
            opacity: prog(f, scene.from + 1, 3, ease.linear),
            borderBottom: `1px solid ${AllTimeListRule}`,
          }}
        >
          <div style={{ position: "absolute", left: -AllTimeListCard.x, top: 0, width: 1080, height: kH }}>
            {/* the box score's stat cells, fading under the pleat */}
            {statA > 0.01 &&
              (["mp", "fg", "fga", "fg_pct", "fg3", "fg3a", "fg3_pct", "ft", "fta", "ft_pct", "game_score"] as const).map((k) => {
                const c = EightyOneBoxRowColX[k];
                return <AllTimeListText key={k} x={c.x + c.w - 9} top={(kH - BOX_H) / 2} h={BOX_H} text={String(EightyOneBoxRowKobe[k])} right alpha={statA} />;
              })}
            {/* the pleat */}
            {pleatA > 0.01 && pleatR - pleatL > 1 && (
              <div style={{ position: "absolute", left: pleatL, top: (kH - (BOX_H - 12)) / 2, width: pleatR - pleatL, height: BOX_H - 12, overflow: "hidden", opacity: pleatA, borderRadius: 2 }}>
                {Array.from({ length: 14 }, (_, i) => (
                  <div key={i} style={{ position: "absolute", left: `${((i * 100) / 14).toFixed(2)}%`, top: 0, width: `${(100 / 14 + 0.3).toFixed(2)}%`, height: "100%", background: i % 2 ? "linear-gradient(90deg, #cfcfcf, #f4f4f4)" : "linear-gradient(90deg, #f4f4f4, #c4c4c4)" }} />
                ))}
              </div>
            )}
            {/* rank */}
            <div style={{ ...pop(f, tSecond, { from: 1.8 }), position: "absolute", left: C.rankR - 80, top: (kH - 50) / 2, width: 80, height: 50, lineHeight: "50px", textAlign: "right", fontFamily: FONT, fontSize: 34, fontWeight: 700, color: AllTimeListInk }}>2.</div>
            {/* photo print, slides in on "history" */}
            <AllTimeListPrint src={AllTimeListFiles.kobe} x={lerp(40, C.photo, photoK)} top={(kH - 136) / 2} w={112} h={136} alpha={photoK} blur={(1 - photoK) * 10} push={0.04 * prog(f, tHist, 150, ease.linear)} />
            {/* name and the line under it */}
            <AllTimeListText x={nameX} top={nameTop} h={42} text={kF > 0.5 ? AllTimeListKobe.player : String(EightyOneBoxRowKobe.player)} size={nameSize} weight={kF > 0.5 ? 600 : 400} />
            <AllTimeListText x={nameX} top={nameTop + 44} h={32} text="Lakers 122, Raptors 104" size={24} color="#5f5f5f" alpha={subK} />
            {/* the 81, in his gold */}
            <div
              style={{
                position: "absolute",
                left: ptsX + 3,
                top: (kH - ptsH) / 2,
                width: ptsW - 6,
                height: ptsH,
                borderRadius: 4,
                background: `radial-gradient(circle at 50% 40%, #FFE08A 0%, ${AllTimeListGold} 60%, #E9A512 100%)`,
                boxShadow: `0 0 ${N(10 + 26 * glow81)}px rgba(253,185,39,${N(clamp(0.35 + 0.5 * glow81))})`,
                transform: `scale(${N(1 + 0.14 * bell(f, tSecond, 14))})`,
              }}
            />
            <AllTimeListText x={ptsX + ptsW - 12} top={(kH - ptsH) / 2} h={ptsH} text={AllTimeListKobe.pts} size={ptsSize} weight={700} right style={{ transform: `scale(${N(1 + 0.14 * bell(f, tSecond, 14))})`, transformOrigin: "100% 50%" }} />
            {/* date, team, logo */}
            <AllTimeListText x={C.date} top={(kH - 44) / 2} h={44} text={typeOn(AllTimeListKobe.date, f, foldS + 12, fps, 24).text} />
            <AllTimeListText x={C.tm} top={(kH - 44) / 2 - 22 * kF} h={44} text={typeOn(AllTimeListKobe.tm, f, foldS + 18, fps, 30).text} />
            <div style={{ ...pop(f, tMost, { from: 0.4 }), position: "absolute", left: C.tm + 6, top: kH / 2 + 6, width: 46, height: 46 }}>
              <Img src={staticFile(AllTimeListFiles.lakers)} style={{ width: 46, height: 46 }} />
            </div>
          </div>
        </div>

        {/* ---------- Wilt's row */}
        {wAlpha > 0.01 && (
          <div
            style={{
              position: "absolute",
              left: AllTimeListCard.x,
              top: wTop,
              width: AllTimeListCard.w,
              height: Y.wiltH,
              opacity: wAlpha,
              transform: `scale(${N(wScale + 0.015 * wSquash)}, ${N(wScale - 0.04 * wSquash)})`,
              transformOrigin: "50% 100%",
              background: "#fff",
              borderBottom: `1px solid ${AllTimeListRule}`,
              boxShadow: `0 ${N(6 + 30 * (1 - wK))}px ${N(10 + 50 * (1 - wK))}px rgba(0,0,0,${N(0.12 + 0.4 * (1 - wK))})`,
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", left: -AllTimeListCard.x, top: 0, width: 1080, height: Y.wiltH }}>
              <AllTimeListText x={C.rankR} top={(Y.wiltH - 50) / 2} h={50} text={AllTimeListWilt.rank} size={34} weight={700} right />
              <AllTimeListPrint src={AllTimeListFiles.wilt} x={C.photo} top={12} w={142} h={176} alpha={1} flash={bulbFlash} push={0.05 * prog(f, tCham, 80, ease.out)} gray />
              <AllTimeListText x={C.hero} top={Y.wiltH / 2 - 41} h={42} text={AllTimeListWilt.player} size={34} weight={600} />
              <AllTimeListText x={C.hero} top={Y.wiltH / 2 + 3} h={32} text="Philadelphia Warriors, 1962" size={24} color="#5f5f5f" alpha={prog(f, tCham + 4, 10, ease.out)} />
              <div
                style={{
                  position: "absolute",
                  left: C.ptsL + 3,
                  top: (Y.wiltH - 92) / 2,
                  width: C.ptsR - C.ptsL - 6,
                  height: 92,
                  borderRadius: 4,
                  background: "#111",
                  boxShadow: `0 0 ${N(6 + 30 * flash100)}px rgba(255,255,255,${N(0.25 + 0.6 * flash100)})`,
                  transform: `scale(${N(1 + 0.12 * flash100)})`,
                }}
              />
              <AllTimeListText x={C.ptsL + 3} top={(Y.wiltH - 92) / 2} h={92} text={String(count)} size={44} weight={700} color="#fff" style={{ width: C.ptsR - C.ptsL - 6, textAlign: "center", letterSpacing: -1, transform: `scale(${N(1 + 0.12 * flash100)})`, transformOrigin: "50% 50%", textShadow: `0 0 ${N(14 * flash100)}px rgba(255,255,255,0.9)` }} />
              <AllTimeListText x={C.date} top={(Y.wiltH - 44) / 2} h={44} text={AllTimeListWilt.date} />
              <AllTimeListText x={C.tm} top={Y.wiltH / 2 - 44} h={44} text={AllTimeListWilt.tm} />
              <div style={{ ...pop(f, tCham + 2, { from: 0.4 }), position: "absolute", left: C.tm + 6, top: Y.wiltH / 2 + 6, width: 46, height: 46 }}>
                <Img src={staticFile(AllTimeListFiles.warriors)} style={{ width: 46, height: 46 }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------- credits */}
      <div style={{ position: "absolute", left: 40, top: 1450, fontFamily: FONT, fontSize: 22, color: "#7D8590", opacity: arenaA }}>Arena: endlessbender, CC BY 2.0</div>
      <div style={{ ...blurIn(f, tHist + 12, { dur: 8 }), position: "absolute", left: 40, top: 1450, fontFamily: FONT, fontSize: 22, color: "#7D8590" }}>Kobe: David Watterson, CC BY 2.0</div>
      <div style={{ ...blurIn(f, tCham + 4, { dur: 8 }), position: "absolute", right: 40, top: 1450, fontFamily: FONT, fontSize: 22, color: "#7D8590" }}>Wilt: Associated Press, public domain</div>
    </div>
  );
};
