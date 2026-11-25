// Scene `percent`: "Twenty-one inches sounds like nothing, but the shot feels it. Last season NBA teams made
// thirty-eight point seven percent of their corner threes, and only about thirty-five percent of the threes above
// the break."
// The 21 in measured at life size by the steel tape, pulled out to a thin gold slice of the floor; the floor tilts
// up and two real shots show the corner one covering less floor; the real Basketball-Reference table scrolls to its
// League Average row, which closes up to .360 and .387; .387 lands on the corner strips as 38.7%, .360 on the floor
// above the break as 35%; the Korver photo, a real three above the break, settles on the top of the arc.
// Notes: reels/nba-floor/notes/LeagueTable.md
import React, { useMemo } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Column, useScene, prog, arrive, ease, typeOn } from "../../../src/engine";
import { LeagueTableFloor } from "./LeagueTableFloor";
import { LeagueTableTape } from "./LeagueTableTape";
import { LeagueTableShot } from "./LeagueTableShot";
import { LT_CARD, LT_KEEP_3P, LT_KEEP_CORNER, LT_LA_Y, LeagueTableRow, LeagueTableSheet, ltRowLayout, useLeagueTableFont, LT_FONT } from "./LeagueTableSheet";
import {
  LT_BASE, LT_GREY, LT_NUM, LT_R, LT_SHEET, LT_START, LT_WHITE,
  ltCamMix, ltClamp, ltFlat, ltFlatTransform, ltP, ltSheetMatrix, ltSheetTransform, type LtCam,
} from "./LeagueTableWorld";

const SIDE: 1 | -1 = -1; // the corner the arc scene leaves its tape in
const FIG = "Figtree, sans-serif";

/** LINE scale: the 21 in at rim level, 330 px a foot */
const LT_MACRO_CAM = ltFlat(SIDE * 22.88, 0, 330, 1060);
/** the whole floor */
const LT_WHOLE = ltFlat(0, LT_BASE + (1400 - 990) / 18.6, 18.6);
/** three-quarter view from behind the baseline: both shots start the same distance from the camera */
const LT_TILT: LtCam = { tx: -7, ty: 7, D: 75, pitch: (57 * Math.PI) / 180, yaw: (-47 * Math.PI) / 180, ppf: 26, sx: 540, sy: 1010 };
/** leaning toward the right corner */
const LT_LEAN = ltFlat(2.4, LT_NUM.ty - 0.6, 19.4);
/** the floor slid down under the Korver card */
const LT_SLID: LtCam = { ...LT_NUM, sy: LT_NUM.sy + 70 };

/** number spots under the corners, and the top of the arc */
const NUM_L = { x: 150, y: 1352 };
const NUM_R = { x: 852, y: 1352 };
const NUM_TOP = { x: 540, y: 640 };

/** a League Average cell lifted out of the table */
const LeagueTableChip: React.FC<{ x: number; y: number; s: number; col: number; head: number; card: number; text: string; color: string; o: number; size?: number }> = ({ x, y, s, col, head, card, text, color, o, size = 44 }) => {
  if (o <= 0.001) return null;
  const g = col === LT_KEEP_3P ? "FG% by Distance" : "Corner";
  const h = col === LT_KEEP_3P ? "3P" : "3P%";
  return (
    <div style={{ position: "absolute", left: x - 150, top: y - 112, width: 300, height: 150, transform: `scale(${s})`, transformOrigin: "50% 74.7%", opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 84 * (1 - head), background: "#EEEEEE", borderRadius: 16, opacity: card, boxShadow: `0 16px 40px rgba(0,0,0,${0.45 * card})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 8, textAlign: "center", fontFamily: LT_FONT, opacity: Math.max(0, head * 3 - 2), whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 22, color: "#555", borderBottom: "1.5px solid #BBB", margin: "0 22px", paddingBottom: 4 }}>{g}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#111", marginTop: 6 }}>{h}</div>
      </div>
      <div style={{ position: "absolute", left: -100, right: -100, top: 92, height: 50, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: card > 0.5 ? LT_FONT : FIG, fontWeight: 700, fontSize: size, color, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textShadow: card < 0.5 ? "0 2px 14px rgba(0,0,0,0.7)" : undefined }}>
        {text}
      </div>
    </div>
  );
};

export const LeagueTable: React.FC = () => {
  const { f, cue, scene } = useScene();
  useLeagueTableFont();

  const T = useMemo(
    () => ({
      n21: cue("21"), inches: cue("inches"), sounds: cue("sounds"), nothing: cue("nothing,"), but: cue("but"), shot: cue("shot"), feels: cue("feels"), it: cue("it."),
      last: cue("Last"), nba: cue("NBA"), teams: cue("teams"), made: cue("made"), p387: cue("38.7%"), corner: cue("corner"), threes: cue("threes,"),
      and: cue("and"), about: cue("about"), p35: cue("35%"), of2: cue("of", 2), above: cue("above"), brk: cue("break."),
    }),
    [cue],
  );
  const M = scene.from - 6;

  // ---------- the camera
  const dive = arrive(f, M + 2, 22);
  const up = prog(f, T.sounds - 3, T.nothing - T.sounds + 6, ease.inOut);
  const tilt = prog(f, T.but - 4, T.shot - T.but + 12, ease.inOut);
  const untilt = prog(f, T.it - 2, 24, ease.inOut);
  const lean = prog(f, T.corner - 8, 26, ease.inOut);
  const unlean = prog(f, T.threes, 24, ease.inOut);
  const slide = prog(f, T.of2 - 6, 22, ease.inOut);
  const unslide = prog(f, T.above - 6, 28, ease.inOut);
  let cam = ltCamMix(LT_START, LT_MACRO_CAM, dive);
  cam = ltCamMix(cam, LT_WHOLE, up);
  cam = ltCamMix(cam, LT_TILT, tilt);
  cam = ltCamMix(cam, LT_NUM, untilt);
  cam = ltCamMix(cam, LT_LEAN, lean);
  cam = ltCamMix(cam, LT_NUM, unlean);
  cam = ltCamMix(cam, LT_SLID, slide);
  cam = ltCamMix(cam, LT_NUM, unslide);
  // a held picture keeps living: a slow breathing push
  const push = 1 + 0.012 * Math.sin((f - scene.from) / 70);
  cam = { ...cam, ppf: cam.ppf * push };
  const is3D = cam.pitch > 0.0015;
  const macro = dive * (1 - up);

  // ---------- the tape measures the 21 in
  const pay = prog(f, T.n21 - 8, 26, ease.out);
  const r = 22 + 1.75 * pay;
  const tapeO = 1 - prog(f, T.but - 12, 8, ease.in);
  const winO = 1 - prog(f, T.sounds - 2, 10, ease.in);
  const winPos = { x: 365 + (540 - 365) * dive, y: 1390 + (1330 - 1390) * dive };
  const tipFill = 1.75 * pay;
  const edge = prog(f, T.inches - 2, 8) * (1 - prog(f, T.sounds + 4, 10));

  // ---------- the "21 in": counted at life size, then carried out with the sliver
  const count21 = Math.round(21 * pay);
  const labelAnchor = ltP(cam, SIDE * 22.9, 0);
  const lab = { x: labelAnchor.x + 150, y: labelAnchor.y - 150 };
  const big = { x: 548, y: 760 };
  const carry = up;
  const n21 = { x: big.x + (lab.x - big.x) * carry, y: big.y + (lab.y - big.y) * carry, size: 150 + (54 - 150) * carry };
  const n21O = prog(f, T.n21 - 8, 8) * (1 - prog(f, T.it - 2, 12));
  const hair21 = prog(f, T.nothing - 6, 10) * (1 - prog(f, T.it - 2, 12));
  const pulse = f >= T.nothing ? Math.exp(-(f - T.nothing) / 12) : 0;

  // ---------- the two shots
  const launch = T.shot;
  const durTop = 30;
  const durCorner = (30 * 22.3) / 24.1;
  const sTop = Math.max(0, (f - launch) / durTop);
  const sCor = Math.max(0, (f - launch) / durCorner);
  const ballO = prog(f, launch - 6, 6) * (1 - prog(f, T.it + 2, 12));
  const shotO = prog(f, T.but - 2, 10) * (1 - prog(f, T.it + 4, 14));
  const tracks = Math.min(1, sCor) * (1 - prog(f, T.it + 2, 12));
  const swish = Math.max(0, Math.sin(Math.min(Math.PI, Math.max(0, (f - launch - durCorner) / 9)))) * (f < launch + durTop + 18 ? 1 : 0);
  const goldPulse = prog(f, T.feels - 2, 8) * (1 - prog(f, T.it + 2, 12));
  const shots = [
    { sx: SIDE * 22.3, sy: 0, s: Math.min(1.3, sCor), o: ballO * (f < launch ? 0 : 1) * (1 - prog(f, launch + durCorner + 8, 10)), spin: -(f - launch) * 14 },
    { sx: 0, sy: 24.1, s: Math.min(1.3, sTop), o: ballO * (f < launch ? 0 : 1) * (1 - prog(f, launch + durTop + 8, 10)), spin: -(f - launch) * 14 },
  ];
  const readO = prog(f, T.feels - 4, 10) * (1 - prog(f, T.it + 2, 12));

  // ---------- the table
  const sheetIn = arrive(f, T.last - 10, 22);
  const scrollEnd = LT_LA_Y - 560;
  const sc = prog(f, T.last - 2, T.teams + 6 - (T.last - 2), (t) => 1 - Math.pow(1 - t, 2.4));
  const scroll = -120 + (scrollEnd + 120) * sc;
  const lift = arrive(f, T.made - 6, 14);
  const collapse = prog(f, T.made - 2, 18, ease.inOut);
  const sheetOut = prog(f, T.made + 4, 16, ease.in);
  const handoff = T.made + 16;
  const rowY = LT_CARD.y + (LT_LA_Y - scrollEnd);
  const rowO = f < handoff ? (f >= T.made - 6 ? 1 : 0) : 0;
  const hi = prog(f, T.teams + 2, 8);
  const L = ltRowLayout(1, rowY, 1);
  const c3 = L.cell(LT_KEEP_3P), cC = L.cell(LT_KEEP_CORNER);
  const valY = L.y + 19 * L.s;
  const srcO = prog(f, T.last + 10, 12); // after the page has settled, never over its rows

  // the .387 chips fly to the corners and become 38.7%
  const fly = prog(f, handoff, 18, ease.inOut);
  const land387 = handoff + 18;
  const cnt387 = prog(f, land387 - 4, 26, ease.outHard);
  const strips = prog(f, land387 - 4, 24);
  const chip387 = (to: { x: number; y: number }, i: number) => {
    const x = cC.x + (to.x - cC.x) * fly;
    const y = valY + (to.y - valY) * fly - Math.sin(fly * Math.PI) * 120;
    const card = 1 - prog(f, land387 - 4, 8);
    const text = card > 0.5 ? ".387" : `${(38.7 * cnt387).toFixed(1)}%`;
    return <LeagueTableChip key={i} x={x} y={y} s={1 - 0.15 * fly + 0.4 * (1 - card)} col={LT_KEEP_CORNER} head={1 - fly} card={card} text={text} color={card > 0.5 ? "#111" : LT_WHITE} o={f >= handoff ? 1 : 0} size={44 + 20 * (1 - card)} />;
  };
  // the .360 chip parks, then travels to the top of the arc and becomes 35%
  const park = prog(f, handoff, 22, ease.inOut);
  const go = prog(f, T.threes - 2, 26, ease.inOut);
  const PARK = { x: 846, y: 640 };
  let x360 = c3.x + (PARK.x - c3.x) * park, y360 = valY + (PARK.y - valY) * park;
  x360 += (NUM_TOP.x - x360) * go;
  y360 += (NUM_TOP.y - y360) * go;
  const cnt35 = prog(f, T.p35 - 26, 26, ease.outHard);
  const card360 = 1 - prog(f, T.p35 - 28, 8);
  const brk = prog(f, T.and - 2, T.about - T.and + 16);
  const rest = Math.max(prog(f, land387 - 6, 18) * 0.9, 0) * (1 - 0.0 * brk) + prog(f, T.of2 - 6, 18) * 0.6 * (1 - prog(f, T.above, 20));
  // after the card lands, the 35% steps right of it
  const aside = prog(f, T.above - 6, 28, ease.inOut);
  const top35 = { x: x360 + (812 - x360) * aside, y: y360 + (668 - y360) * aside };
  const derived = typeOn("(.360 − .246 × .387) / .754 = .351", f, T.p35 + 6, 60, 22);

  // ---------- Korver
  const kIn = arrive(f, T.of2 - 4, 22);
  const kLand = prog(f, T.above - 4, T.brk - T.above + 10, ease.inOut);
  const BIG = { w: 880, h: 779, x: 540, y: 1000 };
  const SMALL = { w: 252, h: 223, x: 540, y: 641 };
  const kw = BIG.w + (SMALL.w - BIG.w) * kLand, kh = BIG.h + (SMALL.h - BIG.h) * kLand;
  const kx = BIG.x + (SMALL.x - BIG.x) * kLand, ky = BIG.y + (SMALL.y - BIG.y) * kLand + (1 - kIn) * 260;
  const kPush = 1 + 0.07 * prog(f, T.of2 - 4, T.brk - T.of2 + 20, ease.linear);
  const breakLabel = prog(f, T.brk - 2, 16);

  // ---------- light
  const focus = macro > 0.5 ? { x: 540, y: 1000 } : ltP(cam, f < T.last ? -8 : 0, f < T.last ? 6 : 10);
  const sweep = ((f - scene.from) * 2.4) % 1800 - 300;
  const floorDim = 0.7 * sheetIn * (1 - prog(f, T.made + 4, 18));

  const floorProps = {
    ppf: is3D ? 10 : cam.ppf,
    f,
    side: SIDE,
    sliver: [1, 1] as [number, number],
    tipFill,
    sliverBase: 1 - 0.7 * macro + 0.25 * pulse,
    ghost: 1,
    edge,
    strips: [strips, strips] as [number, number],
    brk,
    rest,
  };

  // the arc for the "above the break" label, on screen
  const arcLabelPath = useMemo(() => "", []);
  const arcPts = Array.from({ length: 30 }, (_, i) => {
    const a = 1.0 - (i / 29) * 0.62;
    return ltP(cam, (LT_R + 1.3) * Math.cos(a), (LT_R + 1.3) * Math.sin(a));
  });
  const arcD = arcPts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("") + arcLabelPath;

  const numL = ltP(cam, -23.5, LT_BASE), numR = ltP(cam, 23.5, LT_BASE);
  const numShift = cam.sy - LT_NUM.sy;

  return (
    <Column width={1080}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {/* the floor: an exact scale from straight down, its real homography when tilted */}
        {!is3D ? (
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <g transform={ltFlatTransform(cam)}>
              <LeagueTableFloor {...floorProps} flat idp="ltf" />
            </g>
          </svg>
        ) : (
          <svg
            width={(LT_SHEET.x1 - LT_SHEET.x0) * LT_SHEET.S}
            height={(LT_SHEET.y1 - LT_SHEET.y0) * LT_SHEET.S}
            style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: ltSheetMatrix(cam), overflow: "visible" }}
          >
            <g transform={ltSheetTransform()}>
              <LeagueTableFloor {...floorProps} flat={false} idp="lts" />
            </g>
          </svg>
        )}
        <LeagueTableShot cam={cam} f={f} o={is3D ? shotO : 0} shots={shots} tracks={tracks} gold={goldPulse} swish={swish} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <radialGradient id="lt-pool" cx={focus.x} cy={focus.y} r={950} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFF6E2" stopOpacity={0.14} />
              <stop offset="0.5" stopColor="#FFF6E2" stopOpacity={0.03} />
              <stop offset="1" stopColor="#000" stopOpacity={0.42} />
            </radialGradient>
            <linearGradient id="lt-sheen" gradientUnits="userSpaceOnUse" x1={sweep} y1={400} x2={sweep + 520} y2={1500}>
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity={0.09 + 0.05 * macro} />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lt-fade" x1="0" y1="0" x2="0" y2="1920" gradientUnits="userSpaceOnUse">
              <stop offset={500 / 1920} stopColor="#0D1117" stopOpacity={1} />
              <stop offset={640 / 1920} stopColor="#0D1117" stopOpacity={0} />
              <stop offset={1560 / 1920} stopColor="#0D1117" stopOpacity={0} />
              <stop offset={1720 / 1920} stopColor="#0D1117" stopOpacity={0.92} />
            </linearGradient>
          </defs>
          <rect width={1080} height={1920} fill="url(#lt-pool)" />
          <rect width={1080} height={1920} fill="url(#lt-sheen)" />
          {floorDim > 0.001 && <rect width={1080} height={1920} fill="#0D1117" opacity={floorDim} />}
          <rect width={1080} height={1920} fill="url(#lt-fade)" />
          {/* LINE scale labels: what the two edges of the 21 in are */}
          {edge > 0.01 && (() => {
            const a = ltP(cam, SIDE * 22, 0), b = ltP(cam, SIDE * LT_R, 0);
            const y = a.y - 120;
            return (
              <g opacity={edge}>
                <line x1={a.x} y1={a.y - 28} x2={a.x} y2={y + 14} stroke={LT_GREY} strokeWidth={2} />
                <line x1={b.x} y1={b.y - 28} x2={b.x} y2={y + 14} stroke={LT_GREY} strokeWidth={2} />
                <text x={a.x} y={y} fill="#C9D1D9" fontFamily={FIG} fontWeight={700} fontSize={34} textAnchor="middle" style={{ filter: "drop-shadow(0 2px 5px rgba(13,17,23,0.9)) drop-shadow(0 0 14px rgba(13,17,23,0.55))" }}>corner line, 22' 0"</text>
                <text x={b.x} y={y} fill="#C9D1D9" fontFamily={FIG} fontWeight={700} fontSize={34} textAnchor="middle" style={{ filter: "drop-shadow(0 2px 5px rgba(13,17,23,0.9)) drop-shadow(0 0 14px rgba(13,17,23,0.55))" }}>arc, 23' 9"</text>
              </g>
            );
          })()}
          {/* the 21 in, carried out with the sliver */}
          {hair21 > 0.01 && (
            <line x1={labelAnchor.x + 4 * SIDE * -1} y1={labelAnchor.y - 8} x2={n21.x - 40} y2={n21.y + 10} stroke={LT_GREY} strokeWidth={2.5} opacity={hair21} />
          )}
          {/* the shots' readings */}
          {readO > 0.01 && is3D && (() => {
            const cm = ltP(cam, -11, 0), tm = ltP(cam, 0, 11.9);
            return (
              <g opacity={readO}>
                <text x={cm.x - 10} y={cm.y + 52} fill={LT_WHITE} fontFamily={FIG} fontWeight={700} fontSize={40} textAnchor="middle" style={{ filter: "drop-shadow(0 2px 5px rgba(13,17,23,0.9)) drop-shadow(0 0 14px rgba(13,17,23,0.55))" }}>22' 0"</text>
                <text x={tm.x + 20} y={tm.y + 52} fill={LT_WHITE} fontFamily={FIG} fontWeight={700} fontSize={40} textAnchor="middle" style={{ filter: "drop-shadow(0 2px 5px rgba(13,17,23,0.9)) drop-shadow(0 0 14px rgba(13,17,23,0.55))" }}>23' 9"</text>
              </g>
            );
          })()}
          {/* hairlines from the corner numbers up to their strips */}
          {cnt387 > 0.01 && (
            <g opacity={Math.min(1, cnt387 * 3)}>
              <line x1={numL.x} y1={numL.y + 6} x2={numL.x} y2={NUM_L.y - 44 + numShift} stroke={LT_GREY} strokeWidth={2.5} />
              <line x1={numR.x} y1={numR.y + 6} x2={numR.x} y2={NUM_R.y - 44 + numShift} stroke={LT_GREY} strokeWidth={2.5} />
              <line x1={numR.x} y1={NUM_R.y - 44 + numShift} x2={NUM_R.x + 96} y2={NUM_R.y - 44 + numShift} stroke={LT_GREY} strokeWidth={2.5} />
            </g>
          )}
          {/* "above the break" along the arc */}
          {breakLabel > 0.01 && (
            <g opacity={breakLabel}>
              <path id="lt-arclabel" d={arcD} fill="none" />
              <text fontFamily={FIG} fontWeight={700} fontSize={34} fill="#C9D1D9" style={{ filter: "drop-shadow(0 2px 5px rgba(13,17,23,0.9)) drop-shadow(0 0 14px rgba(13,17,23,0.55))" }}>
                <textPath href="#lt-arclabel" startOffset="0%">above the break</textPath>
              </text>
            </g>
          )}
        </svg>

        <LeagueTableTape cam={is3D ? LT_WHOLE : cam} angle={SIDE < 0 ? Math.PI : 0} r={r} f={f} opacity={ltClamp(tapeO)} window={ltClamp(winO)} win={winPos} goldFrom={22} glow={ltClamp(0.4 + 0.6 * edge)} />

        {/* the count of the 21 in */}
        {n21O > 0.01 && (
          <div style={{ position: "absolute", left: n21.x - 300, top: n21.y - n21.size * 0.62, width: 600, textAlign: "center", fontFamily: FIG, fontWeight: 700, fontSize: n21.size, color: LT_WHITE, opacity: n21O, letterSpacing: -2, textShadow: "0 4px 24px rgba(0,0,0,0.55)", fontVariantNumeric: "tabular-nums" }}>
            {count21}
            <span style={{ fontSize: n21.size * 0.5, marginLeft: n21.size * 0.08 }}>in</span>
          </div>
        )}

        {/* the record */}
        {/* the source line sits under the page, so the page covers it while it moves */}
        {srcO > 0.01 && (
          <div style={{ position: "absolute", left: 60, top: 1500, fontFamily: FIG, fontSize: 26, color: LT_GREY, opacity: srcO, lineHeight: 1.35 }}>
            <div>Basketball-Reference, 2025-26 team shooting</div>
            {f >= T.of2 && <div style={{ opacity: prog(f, T.of2, 12) }}>above the break: (.360 − .246 × .387) / .754 = .351</div>}
          </div>
        )}
        <LeagueTableSheet enter={sheetIn} scroll={scroll} hi={hi} hideLA={f >= T.made - 6} out={sheetOut} />
        <LeagueTableRow c={collapse} rowY={rowY} lift={lift} o={rowO} />
        {f >= handoff && [NUM_L, NUM_R].map((p, i) => chip387({ x: p.x, y: p.y + numShift }, i))}
        {f >= handoff && (
          <LeagueTableChip
            x={card360 > 0.5 ? x360 : top35.x}
            y={card360 > 0.5 ? y360 : top35.y + numShift}
            s={card360 > 0.5 ? 1 - 0.38 * park + 0.1 * go : 1.15 - 0.2 * aside}
            col={LT_KEEP_3P}
            head={1 - park}
            card={card360}
            text={card360 > 0.5 ? ".360" : `${Math.round(35 * cnt35)}%`}
            color={card360 > 0.5 ? "#111" : LT_WHITE}
            o={1}
            size={card360 > 0.5 ? 44 : 78}
          />
        )}
        {derived.text.length > 0 && (
          <div style={{ position: "absolute", left: 0, width: 1080, top: NUM_TOP.y + 62 + numShift, textAlign: "center", fontFamily: FIG, fontWeight: 700, fontSize: 32, color: "#C9D1D9", opacity: 1 - prog(f, T.of2 - 8, 10), whiteSpace: "pre", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
            {derived.text}
          </div>
        )}

        {/* Kyle Korver, Cavaliers vs Pacers, 15 Feb 2017: a real three above the break */}
        {kIn > 0.001 && (
          <div
            style={{
              position: "absolute",
              left: kx - kw / 2,
              top: ky - kh / 2,
              width: kw,
              height: kh,
              borderRadius: 24 - 8 * kLand,
              overflow: "hidden",
              background: "#161B22",
              border: "1px solid #30363D",
              boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
              opacity: kIn,
              filter: kIn < 1 ? `blur(${((1 - kIn) * 10).toFixed(1)}px)` : undefined,
            }}
          >
            <Img src={staticFile("nba-floor/leaguetable-korver.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transformOrigin: "44% 18%", transform: `scale(${kPush.toFixed(4)})` }} />
            <div style={{ position: "absolute", right: 22 - 12 * kLand, top: 18 - 10 * kLand, fontFamily: "Inter, sans-serif", fontSize: 22 - 6 * kLand, fontWeight: 500, color: "#C9D1D9", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>Erik Drost, CC BY 2.0</div>
          </div>
        )}
      </AbsoluteFill>
    </Column>
  );
};
