// Scene `cta`: "Next game, watch who's waiting in the corner. Follow for the next number the floor hides, and send
// this to the friend who still loves a long two."
// The reel's last travel, out to the ARENA scale. The real Capital One Arena from the upper deck (Daniel Lobo, CC0,
// 3840 px), full crowd, pushed into the empty near right corner of its real floor, where a ring settles and the gold
// 21 in sliver paints itself on in that floor's perspective (a homography measured on the photo's court). Then the
// creator's card rises, the floor from `close` slides under it, tilts back to the stands' angle and lands exactly on
// the real floor; the slivers glow, the drawn wood fades and the real maple shows. The long-two band lights on it,
// the league's 2025-26 long twos drop in (49 per 1,000 shots, .401), and the last one pops 0.80.
// Notes: reels/nba-floor/notes/CornerWatch.md
import React, { useMemo } from "react";
import { Img, staticFile } from "remotion";
import { Column, useScene, prog, ease, arrive, countTo } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { CornerWatchFloor } from "./CornerWatchFloor";
import { CornerWatchCard } from "./CornerWatchCard";
import {
  CW_BASE, CW_DIV_TO_WORLD, CW_FH, CW_FW, CW_H_PHOTO, CW_PHOTO_W, CW_SCREEN_Y, CW_X0, CW_X1, CW_Y0, CW_Y1,
  cwApply, cwBandPts, cwCamAt, cwCamH, cwCamMix, cwCirclePts, cwCompose, cwHomography, cwLerpPt, cwLongTwos,
  cwMatrix3d, cwPath, cwSliverPts, cwThreePts, type CornerWatchCam, type CornerWatchH, type CornerWatchPt,
} from "./CornerWatchWorld";

const GOLD = "#F2B33D";
const GREY = "#8B949E";
const FONT = "Figtree, sans-serif";
const SHADOW = "0 3px 18px rgba(13,17,23,0.9), 0 0 3px rgba(13,17,23,0.85)";
/** type lying over the bright maple: a dark halo so it reads on the floor */
const HALO = "0 0 4px rgba(13,17,23,0.95), 0 0 12px rgba(13,17,23,0.85), 0 0 28px rgba(13,17,23,0.7)";

// the photo window on screen: under the caption, above Instagram's zone, its edges fading into the navy
const WIN_TOP = 440;
const WIN_BOT = 1548;

// the photo cameras (photo px -> screen)
const CAM_BOWL = cwCamAt(1920, 1280, 540, CW_SCREEN_Y, 0.45); // the whole bowl
const CAM_DOWN: CornerWatchCam = { cx: 1950, cy: 1560, s: 0.55 }; // tipping toward the floor
const CAM_CORNER = cwCamAt(2366, 2212, 560, 1010, 2.6); // the near right corner
const CAM_COURT = cwCamAt(1942, 2165, 540, 1150, 1.1); // the near half court, both corners in

// the floor from `close`, flat and small: world (0, 16.5) at screen (540, 1094), 9.6 px a foot
const FLAT_PPF = 9.6;
const FLAT_C = { x: 540, y: 1094 };
const RECT: CornerWatchPt[] = [[CW_X0, CW_Y0], [CW_X1, CW_Y0], [CW_X0, CW_Y1], [CW_X1, CW_Y1]];

/** zoom about a fixed screen point by k */
function cornerWatchZoom(c: CornerWatchCam, sx: number, sy: number, k: number): CornerWatchCam {
  const px = c.cx + (sx - 540) / c.s, py = c.cy + (sy - CW_SCREEN_Y) / c.s;
  return cwCamAt(px, py, sx, sy, c.s * k);
}

/** screen ellipse radii of a 1 ft disc on the floor at (x, y) */
function cornerWatchLocal(H: CornerWatchH, x: number, y: number) {
  const a = cwApply(H, x - 0.5, y), b = cwApply(H, x + 0.5, y), c = cwApply(H, x, y - 0.5), d = cwApply(H, x, y + 0.5);
  return { rx: Math.hypot(b[0] - a[0], b[1] - a[1]), ry: Math.hypot(d[0] - c[0], d[1] - c[1]) };
}

export const CornerWatch: React.FC = () => {
  const { f, cue, scene } = useScene();
  const T = useMemo(
    () => ({
      t0: scene.from - LEAD, next: cue("Next"), game: cue("game,"), watch: cue("watch"), whos: cue("who's"), waiting: cue("waiting"),
      corner: cue("corner."), follow: cue("Follow"), forw: cue("for"), number: cue("number"), the3: cue("the", 3),
      floor: cue("floor"), hides: cue("hides,"), and: cue("and"), send: cue("send"), friend: cue("friend"), who: cue("who"),
      still: cue("still"), loves: cue("loves"), long: cue("long"), two: cue("two."), end: scene.to,
    }),
    [cue, scene],
  );
  const marks = useMemo(() => cwLongTwos(), []);
  const three = useMemo(() => cwThreePts(), []);
  const band = useMemo(() => cwBandPts(), []);

  // ---- the photo camera
  let cam = cwCamMix(CAM_BOWL, CAM_DOWN, prog(f, T.t0, T.watch - T.t0, (t) => t * (0.6 + 0.4 * t)));
  cam = cwCamMix(cam, CAM_CORNER, prog(f, T.watch - 2, T.corner + 2 - (T.watch - 2), ease.inOut));
  cam = cornerWatchZoom(cam, 560, 1010, 1 + 0.035 * prog(f, T.corner, 40, ease.out));
  cam = cwCamMix(cam, CAM_COURT, prog(f, T.corner + 24, T.follow + 12 - (T.corner + 24), ease.inOut));
  cam = cornerWatchZoom(cam, 540, 1150, 1 + 0.035 * prog(f, T.follow + 12, T.end - T.follow - 12, ease.linear));
  const H_ws_photo = cwCompose(cwCamH(cam), CW_H_PHOTO); // world feet -> screen, on the real floor

  // the window rises in from below as `close` lifts away, the same move
  const rise = (1 - arrive(f, T.t0, 16)) * 980;

  // ---- phase A: the corner of the real floor
  const ringT = prog(f, T.corner - 12, 13, ease.out);
  const ringO = ringT * (1 - prog(f, T.corner + 30, 14));
  const ringR = 1.85 + 2.6 * (1 - ringT);
  const sliverPaint = prog(f, T.corner, 18, ease.inOut);
  const photoSliverO = prog(f, T.corner - 1, 4) * (1 - prog(f, T.forw - 2, 12));
  const glintA = f >= T.corner + 12 ? Math.exp(-(f - T.corner - 12) / 16) : 0;
  const lbl21 = prog(f, T.corner + 6, 8) * (1 - prog(f, T.follow - 8, 8)); // held through the silence, out as the card rises

  // ---- phase B: the floor from `close`, sliding in, tilting onto the real floor
  const slide = 1 - arrive(f, T.forw - 4, 26);
  const floorIn = prog(f, T.forw - 4, 6, ease.linear);
  const tilt = prog(f, T.the3 - 6, T.hides - (T.the3 - 6), ease.inOut);
  const flatQuad = RECT.map(([x, y]) => [FLAT_C.x + x * FLAT_PPF, FLAT_C.y + slide * 760 - (y - 16.5) * FLAT_PPF] as CornerWatchPt);
  const realQuad = RECT.map(([x, y]) => cwApply(H_ws_photo, x, y));
  const quad = flatQuad.map((p, i) => cwLerpPt(p, realQuad[i], tilt));
  const H_ws_floor = tilt >= 0.9999 ? H_ws_photo : cwHomography(RECT, quad);
  const boardsO = 1 - prog(f, T.hides + 4, 34, ease.inOut);
  const paintO = 1 - prog(f, T.hides + 6, 34, ease.inOut);
  const floorShown = floorIn > 0.001 && f < T.hides + 48;

  // the gold slivers on the moving floor: lit as in `close`, one glow on "hides,"
  const glow = f >= T.hides ? Math.exp(-(f - T.hides) / 15) : 0;
  const floorSliverO = floorIn;

  // the crowd dims while the floor stays lit
  const dim = prog(f, T.corner + 22, 36, ease.inOut);

  // ---- the card
  const cardIn = prog(f, T.follow - 13, 13, ease.out);
  const press = prog(f, T.follow + 22, 12, ease.linear);
  const following = prog(f, T.follow + 28, 6, ease.linear);
  const aside = prog(f, T.send - 12, 16, ease.inOut);
  const sendT = prog(f, T.send - 2, 8, ease.out);
  const launch = prog(f, T.send + 4, 20, ease.inOut);
  const cardCx = 540 + (370 - 540) * aside;
  const cardTop = 560 + (1 - cardIn) * 110 - 6 * aside;
  const cardScale = 1 - 0.24 * aside;

  // ---- the long-two band and its last marks
  const bandO = prog(f, T.friend - 8, 16);
  const bandLbl = prog(f, T.friend + 4, 10);
  const markStart = (i: number) => T.who - 4 + i * ((T.long + 2 - (T.who - 4)) / 48);
  const lastAt = T.two;
  const lastPop = prog(f, lastAt - 3, 9, ease.back);
  const lastRipple = f >= lastAt ? prog(f, lastAt, 30, ease.out) : 0;
  const v080 = countTo(f, lastAt - 12, 12, 0, 0.8);
  const v080O = prog(f, lastAt - 12, 5, ease.linear);
  const subO = prog(f, lastAt + 6, 10);
  const srcO = prog(f, lastAt + 2, 12);

  // labels anchored on the floor
  const s21 = cwApply(H_ws_photo, 23.1, -2.2);
  const bandAnchor = cwApply(H_ws_photo, 18.2, 7.5);
  const last = marks[48];
  const lastP = cwApply(H_ws_photo, last.x, last.y);

  // floor element transform: element px -> world -> screen
  const floorM = cwMatrix3d(cwCompose(H_ws_floor, CW_DIV_TO_WORLD));
  const photoT = `translate(${(540 - cam.cx * cam.s).toFixed(2)}px, ${(CW_SCREEN_Y - cam.cy * cam.s - WIN_TOP).toFixed(2)}px) scale(${cam.s.toFixed(5)})`;
  const courtC = cwApply(H_ws_photo, 0, 10);

  return (
    <Column width={1080}>
      <div style={{ position: "absolute", left: 0, top: rise, width: 1080, height: 1920 }}>
        {/* the photo window */}
        <div
          style={{
            position: "absolute", left: 0, top: WIN_TOP, width: 1080, height: WIN_BOT - WIN_TOP, overflow: "hidden",
            WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, #000 110px, #000 ${WIN_BOT - WIN_TOP - 120}px, transparent ${WIN_BOT - WIN_TOP}px)`,
            maskImage: `linear-gradient(to bottom, transparent 0px, #000 110px, #000 ${WIN_BOT - WIN_TOP - 120}px, transparent ${WIN_BOT - WIN_TOP}px)`,
          }}
        >
          <Img
            src={staticFile("nba-floor/cornerwatch-capitalone.jpg")}
            style={{ position: "absolute", left: 0, top: 0, width: CW_PHOTO_W, transformOrigin: "0 0", transform: photoT, maxWidth: "none" }}
          />
          {/* the house lights: the crowd dims, the floor keeps its light */}
          <svg width={1080} height={WIN_BOT - WIN_TOP} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <radialGradient id="cw-lights" cx={courtC[0]} cy={courtC[1] - WIN_TOP} r={700} gradientTransform={`translate(${courtC[0]} ${courtC[1] - WIN_TOP}) scale(1 0.62) translate(${-courtC[0]} ${-(courtC[1] - WIN_TOP)})`} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#0D1117" stopOpacity={0.02} />
                <stop offset="0.55" stopColor="#0D1117" stopOpacity={0.12} />
                <stop offset="1" stopColor="#0D1117" stopOpacity={0.66} />
              </radialGradient>
            </defs>
            <rect width={1080} height={WIN_BOT - WIN_TOP} fill="url(#cw-lights)" opacity={dim} />
          </svg>
          {/* the photo's credit, top right inside the picture */}
          <div style={{ position: "absolute", right: 34, top: 96, fontFamily: FONT, fontWeight: 500, fontSize: 22, color: "#C9D1D9", opacity: 0.85, textShadow: SHADOW }}>
            Daniel Lobo, CC0
          </div>
        </div>

        {/* the floor from `close`: flat, sliding in, tilting onto the real floor */}
        {floorShown && (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, clipPath: `inset(${WIN_TOP + 40}px 0px ${1920 - WIN_BOT + 40}px 0px)` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: CW_FW, height: CW_FH, transformOrigin: "0 0", transform: floorM, opacity: floorIn }}>
            <svg width={CW_FW} height={CW_FH} style={{ position: "absolute", left: 0, top: 0, overflow: "hidden" }}>
              <g transform={`translate(${(-CW_X0 * (CW_FW / (CW_X1 - CW_X0))).toFixed(2)} ${(CW_Y1 * (CW_FH / (CW_Y1 - CW_Y0))).toFixed(2)}) scale(${(CW_FW / (CW_X1 - CW_X0)).toFixed(4)} ${(-CW_FH / (CW_Y1 - CW_Y0)).toFixed(4)})`}>
                <CornerWatchFloor f={f} boards={boardsO} paint={paintO} />
              </g>
            </svg>
          </div>
          </div>
        )}

        {/* everything that lies on the floor, projected into its perspective */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <defs>
            <filter id="cw-bloom" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={7} />
            </filter>
            <filter id="cw-soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={2.2} />
            </filter>
            <clipPath id="cw-win">
              <rect x={0} y={WIN_TOP + 40} width={1080} height={WIN_BOT - WIN_TOP - 80} />
            </clipPath>
          </defs>
          <g clipPath="url(#cw-win)">
            {/* phase A: the ring where the shooter waits, the sliver painting itself onto the real floor */}
            {ringO > 0.001 && (
              <g opacity={ringO}>
                <path d={cwPath(H_ws_photo, cwCirclePts(23.5, 0.3, ringR, 72))} fill="none" stroke="#0D1117" strokeWidth={7} opacity={0.35} />
                <path d={cwPath(H_ws_photo, cwCirclePts(23.5, 0.3, ringR, 72))} fill="none" stroke="#FFFFFF" strokeWidth={3.2} />
              </g>
            )}
            {photoSliverO > 0.001 && sliverPaint > 0.001 && (
              <g opacity={photoSliverO}>
                <path d={cwPath(H_ws_photo, cwSliverPts(1, sliverPaint), true)} fill={GOLD} opacity={0.5 + 0.5 * glintA} filter="url(#cw-bloom)" />
                <path d={cwPath(H_ws_photo, cwSliverPts(1, sliverPaint), true)} fill={GOLD} opacity={0.92} />
                {/* the wet edge running up the line as it paints */}
                {sliverPaint < 1 && (() => {
                  const y = CW_BASE + (8.95 - CW_BASE) * sliverPaint;
                  return <path d={cwPath(H_ws_photo, [[22, y], [Math.sqrt(23.75 * 23.75 - y * y), y]])} stroke="#FFF3D0" strokeWidth={5} filter="url(#cw-soft)" />;
                })()}
              </g>
            )}

            {/* phase B: the slivers on the floor from `close`, following it as it tilts */}
            {floorSliverO > 0.001 && (
              <g opacity={floorSliverO}>
                {[1, -1].map((s) => (
                  <g key={s}>
                    <path d={cwPath(H_ws_floor, cwSliverPts(s as 1 | -1), true)} fill={GOLD} opacity={0.35 + 0.65 * glow} filter="url(#cw-bloom)" />
                    <path d={cwPath(H_ws_floor, cwSliverPts(s as 1 | -1), true)} fill={GOLD} opacity={0.95} />
                  </g>
                ))}
                {/* the three-point line: painted with the floor from `close` (the slivers need their line), then kept as a
                    hairline once the drawn paint fades onto the real one */}
                <path d={cwPath(H_ws_floor, three)} fill="none" stroke="#F3F5F7" strokeWidth={2.4} opacity={0.55 + 0.4 * paintO} />
              </g>
            )}

            {/* the long-two band, faint, on the real floor */}
            {bandO > 0.001 && (
              <g opacity={bandO}>
                <path d={cwPath(H_ws_photo, band, true)} fill="#FFFFFF" opacity={0.13} />
                <path d={cwPath(H_ws_photo, band, true)} fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.55} />
              </g>
            )}

            {/* the league's 2025-26 long twos: made = white dot, missed = grey x (the Basketball-Reference chart) */}
            {marks.map((m, i) => {
              const st = i === 48 ? lastAt - 3 : markStart(i);
              const p = prog(f, st, 8, ease.out);
              if (p <= 0.001) return null;
              const c = cwApply(H_ws_photo, m.x, m.y);
              const { rx, ry } = cornerWatchLocal(H_ws_photo, m.x, m.y);
              const drop = (1 - p) * -46;
              const big = i === 48 ? 1 + 1.3 * lastPop - 0.5 * prog(f, lastAt + 6, 16, ease.inOut) : 1;
              const k = 0.46 * big;
              if (m.made)
                return (
                  <g key={i} opacity={p}>
                    <ellipse cx={c[0]} cy={c[1] + 1.5} rx={rx * k + 1.5} ry={ry * k + 1.5} fill="#0D1117" opacity={0.45} />
                    <ellipse cx={c[0]} cy={c[1] + drop} rx={rx * k} ry={ry * k * (0.8 + 0.2 * p)} fill="#FFFFFF" />
                    {i === 48 && lastRipple > 0 && lastRipple < 1 && (
                      <ellipse cx={c[0]} cy={c[1]} rx={rx * (0.6 + 2.6 * lastRipple)} ry={ry * (0.6 + 2.6 * lastRipple)} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.85 * (1 - lastRipple)} />
                    )}
                  </g>
                );
              const a = cwApply(H_ws_photo, m.x - 0.36, m.y - 0.36), b = cwApply(H_ws_photo, m.x + 0.36, m.y + 0.36);
              const d = cwApply(H_ws_photo, m.x - 0.36, m.y + 0.36), e = cwApply(H_ws_photo, m.x + 0.36, m.y - 0.36);
              const xs = `M${a[0]} ${a[1] + drop}L${b[0]} ${b[1] + drop}M${d[0]} ${d[1] + drop}L${e[0]} ${e[1] + drop}`;
              return (
                <g key={i} opacity={p}>
                  <path d={xs} stroke="#0D1117" strokeWidth={6} strokeLinecap="round" opacity={0.5} />
                  <path d={xs} stroke="#B9C1CA" strokeWidth={3.2} strokeLinecap="round" />
                </g>
              );
            })}
          </g>

          {/* hairlines from the labels to what they name */}
          {lbl21 > 0.01 && <line x1={s21[0] - 12} y1={s21[1] - 14} x2={s21[0] - 12 - 200 * lbl21} y2={s21[1] - 14 - 150 * lbl21} stroke="#C9D1D9" strokeWidth={2.5} opacity={lbl21} />}
          {bandLbl > 0.01 && <line x1={bandAnchor[0]} y1={bandAnchor[1] - 4} x2={bandAnchor[0] + 20 * bandLbl} y2={bandAnchor[1] - 4 - 150 * bandLbl} stroke="#C9D1D9" strokeWidth={2.5} opacity={bandLbl} />}
          {v080O > 0.01 && <line x1={lastP[0]} y1={lastP[1] - 14} x2={lastP[0]} y2={lastP[1] - 14 - 92 * v080O} stroke="#C9D1D9" strokeWidth={2.5} opacity={v080O} />}
        </svg>

        {/* "21 in" on the sliver */}
        {lbl21 > 0.01 && (
          <div style={{ position: "absolute", left: s21[0] - 212 - 320, top: s21[1] - 164 - 52, width: 320, textAlign: "right", fontFamily: FONT, fontWeight: 800, fontSize: 68, lineHeight: "72px", color: "#FFFFFF", letterSpacing: -1, opacity: lbl21, textShadow: HALO, transform: `translateY(${((1 - lbl21) * 10).toFixed(1)}px)` }}>
            21 in
          </div>
        )}
        {/* "long two" on the band */}
        {bandLbl > 0.01 && (
          <div style={{ position: "absolute", left: bandAnchor[0] - 100, top: bandAnchor[1] - 4 - 150 - 46, width: 240, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 40, color: "#FFFFFF", opacity: bandLbl * (1 - 0.3 * subO), textShadow: HALO }}>
            long two
          </div>
        )}
        {/* 0.80 over the last long two */}
        {v080O > 0.01 && (
          <div style={{ position: "absolute", left: lastP[0] - 200, top: lastP[1] - 14 - 92 - 128, width: 400, textAlign: "center", opacity: v080O, transform: `scale(${(0.86 + 0.14 * lastPop).toFixed(3)})`, transformOrigin: "50% 100%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 88, lineHeight: "92px", color: "#D7DEE5", fontVariantNumeric: "tabular-nums", letterSpacing: -2, textShadow: HALO }}>{v080.toFixed(2)}</div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, lineHeight: "38px", color: "#C9D1D9", opacity: subO, textShadow: HALO }}>points per shot</div>
          </div>
        )}

        <CornerWatchCard
          cx={cardCx} top={cardTop} scale={cardScale} opacity={cardIn} blur={(1 - cardIn) * 10}
          press={press} following={following} send={sendT} launch={launch} ring={prog(f, T.follow - 2, 26, ease.inOut)}
        />

        {/* source line */}
        <div style={{ position: "absolute", left: 60, top: 1478, fontFamily: FONT, fontSize: 26, color: GREY, opacity: srcO, textShadow: SHADOW }}>
          Basketball-Reference, 2025-26: 2 × .401 = 0.80
        </div>
      </div>
    </Column>
  );
};
