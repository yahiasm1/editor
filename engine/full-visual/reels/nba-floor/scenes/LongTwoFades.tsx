// Scene `history`: "That's why the long two disappeared. In two thousand five it was nearly a quarter of every shot in
// the league. Last season it was under one in twenty."
// The cause first: the long-two band worth 0.80 and the corners worth 1.16, and a handful of shots stepping out of
// the band into the corners. Then the real 2005 Madison Square Garden floor rises as a photo and un-tilts (a
// projective warp fitted on its orange key) onto the drawn half court, which is covered by 1,000 attempts at that
// season's real shares: the band crowded at 23.6%, the Kings (33.6%, the league's most) at its edge. The seasons roll
// through all 22 Basketball-Reference League Average rows; marks hop zone to zone as the shares change, the band
// empties into the corners and above the break, and its last 49 marks are 4.9%: 1 in 20.
// Notes: reels/nba-floor/notes/LongTwoFades.md
import React, { useMemo } from "react";
import { Img, staticFile } from "remotion";
import { Column, useScene, prog, arrive, ease } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { LongTwoFadesFloor } from "./LongTwoFadesFloor";
import { LongTwoFadesMarks, longTwoFadesPlan } from "./LongTwoFadesMarks";
import {
  LTF_ARC, LTF_BASE, LTF_IN, LTF_LONG2, LTF_MSG_H, LTF_MSG_H_WORLD, LTF_MSG_W, LTF_SEASONS, LTF_SIDE,
  ltfApply, ltfAssign, ltfBandPath, ltfCamMix, ltfClamp, ltfHomography, ltfMatrix3d, ltfP, ltfSliverPath, ltfSpot, ltfTransform,
} from "./LongTwoFadesWorld";

const GOLD = "#F2B33D";
const GREY = "#8B949E";
const SHADOW = "0 3px 18px rgba(13,17,23,0.9), 0 0 3px rgba(13,17,23,0.85)";

// the 2005 Garden photo as a card: the crop it shows and where
const CROP = { x: 40, y: 400, w: 1320, h: 660 };
const CARD = { x: 40, y: 660, w: 1000, h: 500 };
const CS = CARD.w / CROP.w;
const WARP = { x: 60, y: 500, w: 1110, h: 330 };
// the floor the un-tilt hands over: the half court and its apron, world feet
const COURT: [number, number][] = [[-LTF_SIDE, LTF_BASE], [LTF_SIDE, LTF_BASE], [LTF_SIDE, 41.75], [-LTF_SIDE, 41.75]];
// clipped at the lines (plus the 2 in paint): the stands and the baseline apron would smear into streaks as it flattens
const COURT_CLIP: [number, number][] = [[-25.4, -5.6], [25.4, -5.6], [25.4, 41.75], [-25.4, 41.75]];

/** the shots of the cause: long twos in the band, and the 14 that step out into the corners */
const BAND0 = Array.from({ length: 46 }, (_, j) => ltfSpot(3, 5000 + j));
const CORNER0 = Array.from({ length: 16 }, (_, j) => ltfSpot(4, 6000 + j));
const HOPS = Array.from({ length: 14 }, (_, j) => {
  const from = BAND0[j * 3];
  const c = ltfSpot(4, 7000 + j);
  return { from, to: [Math.sign(from[0] || 1) * Math.abs(c[0]), c[1]] as [number, number] };
});
const HOPPED = new Set(HOPS.map((_, j) => j * 3));

const circ = (x: number, y: number, r: number) =>
  `M${(x + r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0`;

/** rotate-and-scale interpolation of 4 points about their centroid, so the photo turns instead of folding */
function longTwoFadesQuadMix(a: [number, number][], b: [number, number][], t: number): [number, number][] {
  const ca = a.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]);
  const cb = b.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]);
  const c = [ca[0] + (cb[0] - ca[0]) * t, ca[1] + (cb[1] - ca[1]) * t];
  return a.map((p, k) => {
    const va = [p[0] - ca[0], p[1] - ca[1]], vb = [b[k][0] - cb[0], b[k][1] - cb[1]];
    const ra = Math.hypot(va[0], va[1]), rb = Math.hypot(vb[0], vb[1]);
    const aa = Math.atan2(va[1], va[0]);
    let ab = Math.atan2(vb[1], vb[0]);
    while (ab - aa > Math.PI) ab -= 2 * Math.PI;
    while (ab - aa < -Math.PI) ab += 2 * Math.PI;
    const r = Math.exp(Math.log(ra) + (Math.log(rb) - Math.log(ra)) * t), an = aa + (ab - aa) * t;
    return [c[0] + r * Math.cos(an), c[1] + r * Math.sin(an)] as [number, number];
  });
}

export const LongTwoFades: React.FC = () => {
  const { f, cue, scene, theme } = useScene();
  const UI = theme.font.ui;
  const t0 = scene.from - LEAD;
  const end = scene.to;
  const T = useMemo(
    () => ({
      why: cue("why"), long: cue("long"), dis: cue("disappeared."), inn: cue("in"), y2005: cue("2005"), it: cue("it"), nearly: cue("nearly"),
      quarter: cue("quarter"), of: cue("of"), every: cue("every"), league: cue("league."), last: cue("Last"), under: cue("under"),
      one: cue("1"), twenty: cue("20."),
    }),
    [cue],
  );

  // ---- the record, season by season
  const rollAt = T.last;
  const step = (T.twenty - 4 - rollAt) / (LTF_SEASONS.length - 1);
  const assign = useMemo(() => ltfAssign(), []);
  const plan = useMemo(() => longTwoFadesPlan(assign, rollAt, step), [assign, rollAt, step]);
  const idx = f < rollAt ? 0 : Math.min(LTF_SEASONS.length - 1, Math.floor((f - rollAt) / step) + 1);
  const idxFrac = idx === 0 ? 1 : ltfClamp((f - (rollAt + (idx - 1) * step)) / Math.min(4, step));
  const rolled = ltfClamp((f - rollAt) / (step * (LTF_SEASONS.length - 1)));

  // ---- camera: up from the band to the ARC FRAME, then a slow push for the rest of the scene
  const rise = prog(f, t0, T.dis - t0, ease.inOut);
  let cam = ltfCamMix(LTF_IN, LTF_ARC, rise);
  const push = 1 + 0.03 * prog(f, T.dis, end - T.dis, ease.linear);
  cam = { ...cam, ppf: cam.ppf * push, cy: cam.cy + 0.35 * prog(f, T.dis, end - T.dis, ease.linear) };

  // ---- the cause: 0.80 against 1.16, and shots stepping out of the band
  const causeO = 1 - prog(f, T.dis + 18, 16);
  const hopAt = (j: number) => T.dis - 8 + j * 2.6;
  const tick = HOPS.reduce((a, _, j) => a + (f >= hopAt(j) + 20 ? Math.exp(-(f - hopAt(j) - 20) / 6) : 0), 0);
  const bandLitA = (0.6 + 0.4 * prog(f, T.long - 6, 14)) * causeO;

  // ---- the Garden: the card rises, its floor un-tilts onto the drawn floor
  const cardIn = arrive(f, T.inn - 14, 18);
  const untilt = prog(f, T.y2005 - 2, 46, ease.inOut);
  const cardPush = 1 + 0.035 * prog(f, T.inn - 14, T.y2005 - (T.inn - 14), ease.linear);
  const cardRise = (1 - cardIn) * 140;
  const startMap = (p: [number, number]): [number, number] => {
    const x = CARD.x + (p[0] - CROP.x) * CS, y = CARD.y + (p[1] - CROP.y) * CS + cardRise;
    return [540 + (x - 540) * cardPush, 910 + (y - 910) * cardPush];
  };
  const courtPhoto = COURT.map(([x, y]) => ltfApply(LTF_MSG_H_WORLD, x, y));
  const courtScreen = COURT.map(([x, y]) => {
    const p = ltfP(cam, x, y);
    return [p.x, p.y] as [number, number];
  });
  const quad = longTwoFadesQuadMix(courtPhoto.map(startMap), courtScreen, untilt);
  // the warped element is only the floor's box in the photo (x 60-1170, y 500-830), far below the photo's horizon
  // (y 200-340), so no corner of it ever goes behind the camera as it turns flat
  const Hs = ltfHomography(courtPhoto.map(([x, y]) => [x - WARP.x, y - WARP.y] as [number, number]), quad);
  const clip = COURT_CLIP.map(([x, y]) => ltfApply(LTF_MSG_H_WORLD, x, y)).map(([x, y]) => `${(x - WARP.x).toFixed(1)}px ${(y - WARP.y).toFixed(1)}px`).join(",");
  const cardO = cardIn * (1 - prog(f, T.y2005 + 2, 18, ease.linear));
  const warpO = (f >= T.y2005 - 2 ? 1 : 0) * (1 - prog(f, T.y2005 + 30, 16, ease.inOut));
  const underDim = 0.82 * cardIn * (1 - prog(f, T.y2005 + 16, 26, ease.inOut));
  const warm = prog(f, T.y2005 + 10, 30) * (1 - rolled);
  const cool = rolled;

  // ---- 2005: the rain, the band, the quarter
  const fallAt = T.y2005 + 26;
  const fallDur = T.nearly - 6 - fallAt;
  const bandFocus = prog(f, T.nearly - 4, 12) * (1 - 0.45 * prog(f, T.last, 30));
  const bandOnly = prog(f, T.one - 6, 12);
  const corners = prog(f, T.twenty - 4, 10);
  const seasonIn = arrive(f, T.y2005 - 4, 14);
  const pctIn = arrive(f, T.quarter - 18, 12);
  const pctVal = f < T.last ? 23.6 * prog(f, T.quarter - 18, 18, ease.outHard) : LTF_LONG2[idx] * 100;
  const seasonTick = idx > 0 && idx < LTF_SEASONS.length - 1 ? Math.exp(-(f - (rollAt + (idx - 1) * step)) / 3) * 0.35 : 0;
  const pctLand = (f >= T.quarter ? Math.exp(-(f - T.quarter) / 9) : 0) + (f >= T.twenty ? Math.exp(-(f - T.twenty) / 9) : 0) + seasonTick;
  const kingsIn = arrive(f, T.every - 8, 16) * (1 - prog(f, T.last + 6, 12));
  const oneIn20 = arrive(f, T.twenty - 3, 12);
  const sliverPulse = f >= T.twenty ? Math.exp(-(f - T.twenty) / 14) : 0;

  // ---- the arena card, top left: the Garden 2005, then Ball Arena 2026
  const arenaIn = arrive(f, T.y2005 + 34, 16);
  const swap = prog(f, T.under - 8, 12, ease.inOut);

  // light
  const sweep = ((f - t0) * 2.4) % 1800 - 300;
  const focus = ltfP(cam, 0, 12);
  const bandTop = ltfP(cam, 0, 19.6);
  const pctAnchor = { x: 1010, y: 812 };
  const bandHair = ltfP(cam, 9.5, 17.8);
  const kings = ltfP(cam, -21.2, 16.6);

  // the cause's marks, in screen px
  const sz = 3.4 * (cam.ppf / 19.2);
  let aDots = "", aLit = "", aShadow = "", aTrail = "";
  if (causeO > 0.01) {
    BAND0.forEach((s, j) => {
      if (HOPPED.has(j) && f >= hopAt(j / 3)) return;
      const p = ltfP(cam, s[0], s[1]);
      aDots += circ(p.x, p.y, sz);
    });
    CORNER0.forEach((s) => {
      const p = ltfP(cam, s[0], s[1]);
      aDots += circ(p.x, p.y, sz);
    });
    HOPS.forEach((h, j) => {
      const s = hopAt(j);
      if (f < s) return;
      const u = Math.min(1, (f - s) / 20);
      const e = u * u * (3 - 2 * u);
      const p = ltfP(cam, h.from[0] + (h.to[0] - h.from[0]) * e, h.from[1] + (h.to[1] - h.from[1]) * e);
      const l = Math.sin(Math.PI * u);
      if (l > 0.02) aShadow += circ(p.x + 3 * l, p.y + 4 * l, sz);
      // the arc it flew, fading behind it: a step back over the line
      if (u < 1 || f < s + 34) {
        let d = "";
        const u0 = Math.max(0, u - 0.55);
        for (let k = 0; k <= 10; k++) {
          const uu = u0 + ((u - u0) * k) / 10, ee = uu * uu * (3 - 2 * uu);
          const q = ltfP(cam, h.from[0] + (h.to[0] - h.from[0]) * ee, h.from[1] + (h.to[1] - h.from[1]) * ee);
          d += `${k ? "L" : "M"}${q.x.toFixed(1)} ${(q.y - 34 * Math.sin(Math.PI * uu)).toFixed(1)}`;
        }
        if (u > 0.02) aTrail += d;
      }
      aLit += circ(p.x, p.y - 34 * l, sz * (1.25 + 0.5 * l));
    });
  }

  const season = LTF_SEASONS[idx];
  const prevSeason = LTF_SEASONS[Math.max(0, idx - 1)];

  return (
    <Column width={1080}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="ltf-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={0.4} />
          </filter>
          <radialGradient id="ltf-pool" cx={focus.x} cy={focus.y} r={950} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFF6E2" stopOpacity={0.12} />
            <stop offset="0.55" stopColor="#FFF6E2" stopOpacity={0.02} />
            <stop offset="1" stopColor="#000" stopOpacity={0.45} />
          </radialGradient>
          <linearGradient id="ltf-sheen" gradientUnits="userSpaceOnUse" x1={sweep} y1={400} x2={sweep + 520} y2={1500}>
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity={0.08} />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ltf-top" x1="0" y1="0" x2="0" y2="1920" gradientUnits="userSpaceOnUse">
            <stop offset={500 / 1920} stopColor="#0D1117" stopOpacity={1} />
            <stop offset={600 / 1920} stopColor="#0D1117" stopOpacity={0} />
            <stop offset={1530 / 1920} stopColor="#0D1117" stopOpacity={0} />
            <stop offset={1700 / 1920} stopColor="#0D1117" stopOpacity={0.92} />
          </linearGradient>
        </defs>
        <g transform={ltfTransform(cam)}>
          <LongTwoFadesFloor f={f} warm={warm} cool={cool} />
          {/* the chart ground: the floor dims under the shots */}
          <rect x={-40} y={-20} width={80} height={80} fill="#0D1117" opacity={0.5} />
          {/* the long-two band: lit for the cause, again when its marks lift, and for its last 49 */}
          <path d={ltfBandPath()} fill="#FFFFFF" opacity={0.1 * bandLitA + 0.07 * bandFocus + 0.06 * bandOnly} />
          <path d={ltfBandPath()} fill="none" stroke="#FFFFFF" strokeWidth={0.06} opacity={0.5 * bandLitA + 0.35 * bandFocus + 0.4 * bandOnly} />
          {/* the gold slivers: distance, the reel's one glow; packed at the end */}
          {[1, -1].map((s) => (
            <g key={s}>
              <path d={ltfSliverPath(s as 1 | -1)} fill={GOLD} opacity={0.28 + 0.4 * sliverPulse + 0.15 * corners} filter="url(#ltf-soft)" />
              <path d={ltfSliverPath(s as 1 | -1)} fill={GOLD} opacity={0.55 + 0.35 * sliverPulse + 0.1 * corners} />
            </g>
          ))}
        </g>
        <rect width={1080} height={1920} fill="url(#ltf-pool)" />
        <rect width={1080} height={1920} fill="url(#ltf-sheen)" />
        {/* the floor sinks under the Garden card */}
        <rect width={1080} height={1920} fill="url(#ltf-top)" />
        {underDim > 0.005 && <rect width={1080} height={1920} fill="#0D1117" opacity={underDim} />}
      </svg>

      {/* the Garden's own floor, warped from the photo's perspective onto the drawn court */}
      {warpO > 0.005 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: WARP.w, height: WARP.h, overflow: "hidden", transformOrigin: "0 0", transform: ltfMatrix3d(Hs), opacity: warpO, clipPath: `polygon(${clip})` }}>
          <Img src={staticFile("nba-floor/longtwofades-msg2005.jpg")} style={{ position: "absolute", left: -WARP.x, top: -WARP.y, width: LTF_MSG_W, height: LTF_MSG_H, display: "block" }} />
        </div>
      )}
      {/* the Garden card, whole: stands, scoreboards, the 2005 floor */}
      {cardO > 0.005 && (
        <div
          style={{
            position: "absolute",
            left: 540 + (CARD.x - 540) * cardPush,
            top: 910 + (CARD.y + cardRise - 910) * cardPush,
            width: CARD.w * cardPush,
            height: CARD.h * cardPush,
            borderRadius: 24,
            overflow: "hidden",
            opacity: cardO,
            boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
            border: "1px solid #30363D",
            filter: cardIn < 1 ? `blur(${((1 - cardIn) * 10).toFixed(1)}px)` : undefined,
          }}
        >
          <Img
            src={staticFile("nba-floor/longtwofades-msg2005.jpg")}
            style={{ position: "absolute", left: -CROP.x * CS * cardPush, top: -CROP.y * CS * cardPush, width: LTF_MSG_W * CS * cardPush, height: LTF_MSG_H * CS * cardPush }}
          />
          <div style={{ position: "absolute", right: 18, top: 14, fontFamily: UI, fontSize: 22, color: GREY, textShadow: SHADOW }}>Ganley894, public domain</div>
          <div style={{ position: "absolute", left: 22, bottom: 16, fontFamily: UI, fontWeight: 700, fontSize: 32, color: "#FFFFFF", textShadow: SHADOW }}>Madison Square Garden, 2005</div>
        </div>
      )}

      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* the cause's shots */}
        {causeO > 0.01 && (
          <g opacity={causeO * (1 - cardIn)}>
            <path d={aDots} fill="#FFFFFF" opacity={0.62} />
            {aShadow && <path d={aShadow} fill="#0D1117" opacity={0.5} />}
            {aTrail && <path d={aTrail} fill="none" stroke="#FFFFFF" strokeWidth={1.6} strokeLinecap="round" opacity={0.35 * (1 - prog(f, T.dis + 14, 14))} />}
            <path d={aLit} fill="#FFFFFF" />
          </g>
        )}
        <LongTwoFadesMarks cam={cam} f={f} plan={plan} fallAt={fallAt} fallDur={fallDur} band={bandFocus} bandOnly={bandOnly} corners={corners} rippleAt={T.league - 6} opacity={1} />
        {/* hairlines: the percentage to the band, the cause's values to their zones */}
        {pctIn > 0.01 && <line x1={pctAnchor.x - 120} y1={pctAnchor.y + 4} x2={pctAnchor.x - 120 + (bandHair.x - pctAnchor.x + 120) * pctIn} y2={pctAnchor.y + 4 + (bandHair.y - pctAnchor.y - 4) * pctIn} stroke={GREY} strokeWidth={2} opacity={pctIn * (1 - oneIn20)} />}
        {causeO > 0.01 &&
          [1, -1].map((s) => {
            const a = ltfP(cam, s * 21.4, 11.2), b = ltfP(cam, s * 23.5, 4);
            return <line key={s} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={GREY} strokeWidth={2} opacity={causeO * (1 - cardIn)} />;
          })}
      </svg>

      {/* the cause's values: what a long two is worth, what a corner three is worth */}
      {causeO * (1 - cardIn) > 0.01 && (
        <>
          <div style={{ position: "absolute", left: bandTop.x - 200, top: bandTop.y - 56, width: 400, textAlign: "center", opacity: causeO * (1 - cardIn) }}>
            <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 76, lineHeight: "80px", color: "#FFFFFF", fontVariantNumeric: "tabular-nums", textShadow: SHADOW }}>0.80</div>
            <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 32, color: GREY, textShadow: SHADOW }}>long two</div>
          </div>
          {[1, -1].map((s) => {
            const q = ltfP(cam, s * 21.2, 12.6);
            const p = { x: Math.max(150, Math.min(930, q.x)), y: q.y };
            const k = 1 + 0.12 * Math.min(1, tick);
            return (
              <div key={s} style={{ position: "absolute", left: p.x - 110, top: p.y - 92, width: 220, textAlign: "center", opacity: causeO * (1 - cardIn) }}>
                <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 64, lineHeight: "68px", color: "#FFFFFF", fontVariantNumeric: "tabular-nums", textShadow: SHADOW, transform: `scale(${k.toFixed(3)})` }}>1.16</div>
                <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 32, color: GREY, textShadow: SHADOW }}>corner three</div>
              </div>
            );
          })}
        </>
      )}

      {/* the season, and the long two's share of every shot in it */}
      {seasonIn > 0.01 && (
        <div style={{ position: "absolute", right: 56, top: 540, width: 420, textAlign: "right", opacity: seasonIn, transform: `translateY(${((1 - seasonIn) * -30).toFixed(1)}px)` }}>
          <div style={{ position: "relative", height: 72, overflow: "hidden", fontFamily: UI, fontWeight: 700, fontSize: 62, lineHeight: "72px", color: "#FFFFFF", fontVariantNumeric: "tabular-nums", textShadow: SHADOW }}>
            {idx > 0 && idxFrac < 1 && <div style={{ position: "absolute", right: 0, top: -72 * idxFrac, opacity: 1 - idxFrac }}>{prevSeason}</div>}
            <div style={{ position: "absolute", right: 0, top: 72 * (1 - idxFrac) }}>{season}</div>
          </div>
          <div style={{ fontFamily: UI, fontSize: 26, color: GREY, marginTop: 2, textShadow: SHADOW }}>league average</div>
        </div>
      )}
      {pctIn > 0.01 && (
        <div style={{ position: "absolute", right: 56, top: 664, width: 520, textAlign: "right", opacity: pctIn }}>
          <div style={{ fontFamily: UI, fontWeight: 800, fontSize: 124, lineHeight: "124px", letterSpacing: -2, color: "#FFFFFF", fontVariantNumeric: "tabular-nums", textShadow: SHADOW, transform: `scale(${(1 + 0.06 * pctLand).toFixed(3)})`, transformOrigin: "100% 50%" }}>
            {pctVal.toFixed(1)}%
          </div>
          <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 32, color: GREY, textShadow: SHADOW }}>of all shots were long twos</div>
        </div>
      )}

      {/* the Kings, the league's most long twos that season */}
      {kingsIn > 0.01 && (
        <div style={{ position: "absolute", left: kings.x - 70, top: kings.y - 86 - (1 - kingsIn) * 40, width: 140, textAlign: "center", opacity: kingsIn }}>
          <Img src={staticFile("nba-floor/longtwofades-kings.svg")} style={{ width: 84, height: 84, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6))" }} />
          <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 32, color: "#FFFFFF", whiteSpace: "nowrap", marginLeft: -40, marginRight: -40, textShadow: SHADOW }}>
            <span style={{ color: "#C9D1D9" }}>Kings </span>33.6%
          </div>
        </div>
      )}

      {/* 1 in 20, on the band's last marks */}
      {oneIn20 > 0.01 && (
        <div style={{ position: "absolute", left: bandTop.x - 200, top: bandTop.y - 40, width: 400, textAlign: "center", opacity: oneIn20, transform: `scale(${(0.9 + 0.1 * oneIn20).toFixed(3)})` }}>
          <div style={{ fontFamily: UI, fontWeight: 800, fontSize: 68, lineHeight: "72px", color: "#FFFFFF", textShadow: SHADOW }}>1 in 20</div>
          <div style={{ width: 240, height: 2, background: GREY, margin: "6px auto 0" }} />
        </div>
      )}

      {/* where: the Garden in 2005, then Ball Arena in 2026 */}
      {arenaIn > 0.01 && (
        <div style={{ position: "absolute", left: 56, top: 540, width: 300, opacity: arenaIn, transform: `translateY(${((1 - arenaIn) * -24).toFixed(1)}px)` }}>
          <div style={{ position: "relative", width: 300, height: 170, borderRadius: 18, overflow: "hidden", border: "1px solid #30363D", boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>
            <Img src={staticFile("nba-floor/longtwofades-msg2005.jpg")} style={{ position: "absolute", width: 600, height: 450, left: -40, top: -190 }} />
            <Img src={staticFile("nba-floor/longtwofades-ballarena.jpg")} style={{ position: "absolute", width: 480, height: 360, left: -120, top: -170, opacity: swap }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 44, background: "linear-gradient(to bottom, rgba(13,17,23,0.85), rgba(13,17,23,0))" }} />
            <div style={{ position: "absolute", right: 10, top: 8, fontFamily: UI, fontSize: 22, color: "#B4BCC5", textShadow: SHADOW, whiteSpace: "nowrap" }}>
              {swap < 0.5 ? "Ganley894, public domain" : "MhcL947, CC BY-SA 4.0"}
            </div>
          </div>
          <div style={{ position: "relative", height: 34, marginTop: 8, fontFamily: UI, fontWeight: 700, fontSize: 26, color: "#C9D1D9", textShadow: SHADOW, whiteSpace: "nowrap" }}>
            {/* one name at a time: the old one leaves before the new one arrives, never two overlapping */}
            <div style={{ position: "absolute", left: 0, opacity: ltfClamp(1 - 2 * swap), transform: `translateY(${(-14 * swap).toFixed(1)}px)` }}>Madison Square Garden, 2005</div>
            <div style={{ position: "absolute", left: 0, opacity: ltfClamp(2 * swap - 1), transform: `translateY(${(14 * (1 - swap)).toFixed(1)}px)` }}>Ball Arena, 2026</div>
          </div>
        </div>
      )}

      {prog(f, T.inn, 12) > 0.01 && (
        <div style={{ position: "absolute", left: 60, top: 1462, fontFamily: UI, fontSize: 26, color: GREY, opacity: prog(f, T.inn, 12) }}>
          Basketball-Reference, league averages 2004-05 to 2025-26
        </div>
      )}
    </Column>
  );
};
