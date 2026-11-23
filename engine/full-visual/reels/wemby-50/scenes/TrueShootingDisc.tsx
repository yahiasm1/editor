// `trueshooting`: "True shooting halves that, so a made two on every shot would be a hundred percent. His was
// seventy-nine. The league average this season is fifty-seven and a half."
// The big chance disc from `attempts` (filled to 1.58 on a 0 / 1 / 2 ruler) stands up on its edge on the maple and
// becomes a measuring cup. "halves": the ruler flips to 0% / 50% / 100% and BBR's glossary line shows the 2 x.
// "two": a real basketball drops into the emptied disc and fills it to the brim, "100%". "His was": BBR's real
// advanced row writes in (with his Commons face, credited); "79": the disc fills white to 79. "average": BBR's
// League Average 2026-27 row; "57.5": a grey level settles across the same disc, the fill below it turns grey, and
// the white band from 57.5 to 79 is left as the only bright thing. One disc, never a second bar.
// Parts: TrueShootingDiscWorld (camera), TrueShootingDiscSolid (disc, floor, ball).
import React from "react";
import { Img, staticFile } from "remotion";
import { LEAD } from "../../../src/engine/Stage";
import { blurIn, blurOut, countTo, draw, ease, pop, prog, typeOn, useScene } from "../../../src/engine";
import { TSD_R, TSD_T, trueShootingDiscPose, trueShootingDiscProject as proj, type TrueShootingDiscCam } from "./TrueShootingDiscWorld";
import { TrueShootingDiscBall, TrueShootingDiscFloor, TrueShootingDiscSolid } from "./TrueShootingDiscSolid";

const C = {
  ink: "#FFFFFF",
  soft: "#C9D1D9",
  dim: "#8B949E",
  line: "#30363D",
  card: "#161B22",
  grey: "#8B949E",
};
const asset = (n: string) => staticFile(`wemby-50/${n}`);
const WHITE0 = 1.58 / 2; // the fill `attempts` hands over: 1.58 points on a 0-2 scale
const HIS = 0.79; // Basketball-Reference advanced box, TS% .790
const LEAGUE = 0.575; // Basketball-Reference 2026-27 League Average, TS% .575
const RULER_U = TSD_R + 0.09;
const COL_TS = 822; // the TS% column sits under the ruler
const CARD = { x: 40, y: 1166, w: 1000, h: 272 };

/** a label that turns over like a split-flap: the old text folds away, the new one unfolds */
const TrueShootingDiscFlap: React.FC<{ f: number; at: number; a: string; b: string; style: React.CSSProperties }> = ({ f, at, a, b, style }) => {
  const p = prog(f, at, 12, ease.linear);
  const first = p < 0.5;
  const k = first ? 1 - p * 2 : (p - 0.5) * 2;
  return <div style={{ ...style, transform: `${style.transform ?? ""} scaleY(${Math.max(0.02, k).toFixed(3)})` }}>{first ? a : b}</div>;
};

export const TrueShootingDisc: React.FC = () => {
  const { f, fps, scene, cue, endsOn, theme } = useScene();
  const t0 = scene.from - LEAD;
  const t = {
    true: cue("True"),
    halves: cue("halves"),
    so: cue("so"),
    made: cue("made"),
    two: cue("two"),
    every: cue("every"),
    shot: cue("shot"),
    hundred: cue("100%"),
    his: cue("His"),
    n79: cue("79"),
    league: cue("league"),
    average: cue("average"),
    season: cue("season"),
    n575: cue("575"),
  };

  // ---- the camera: close on the disc, a slow push the whole scene
  const push = prog(f, t0, scene.to - t0, ease.linear);
  const cam: TrueShootingDiscCam = { eye: [0.12, -5.3 + 0.32 * push, TSD_R + 1.05], target: [0, 0, TSD_R], F: 1700, cx: 548, cy: 840 };

  // ---- the disc stands up on "True shooting", with weight: it falls forward onto its edge and settles
  const up = prog(f, t.true - 4, 30, ease.inOut);
  const after = f - (t.true + 26);
  const settle = after > 0 ? -0.06 * Math.sin(after * 0.32) * Math.exp(-after / 14) : 0;
  const tilt = 1.12 * (1 - up) + settle;
  const yaw = -0.34 + 0.27 * up;

  // ---- the white fill, phase by phase
  const drain1 = prog(f, t.so - 2, 16, ease.in);
  const fill2 = prog(f, t.two + 2, 52, ease.out);
  const drain2 = prog(f, t.hundred + 30, 18, ease.in);
  const fill3 = prog(f, endsOn("79", 28), 28, ease.out);
  let white = WHITE0 * (1 - drain1);
  if (f >= t.two) white = fill2 * (1 - drain2);
  if (f >= t.his) white = HIS * fill3;
  const vel = Math.abs(f >= t.his ? HIS * (fill3 - prog(f - 1, endsOn("79", 28), 28, ease.out)) : f >= t.two ? fill2 - prog(f - 1, t.two + 2, 52, ease.out) : 0);
  const sinceFill = f >= t.his ? f - t.n79 : f - (t.two + 54);
  const wave = Math.min(0.05, vel * 2.2) + (sinceFill > 0 ? 0.03 * Math.exp(-sinceFill / 18) : 0);

  // ---- the league level
  const greyLine = prog(f, endsOn("575", 22), 22, ease.inOut);
  const greyO = prog(f, t.n575 - 2, 14, ease.linear);
  const dimAbove = prog(f, t.n575 + 4, 20, ease.linear);
  const flash = f >= t.hundred ? Math.exp(-(f - t.hundred) / 9) : 0;
  const sheen = ((f - t0) % 150) / 150;

  const pose = trueShootingDiscPose(tilt, yaw);
  const W = TSD_T / 2;
  const P = (u: number, frac: number) => proj(cam, pose.at(u, -TSD_R + 2 * TSD_R * frac, W));
  const chordEnd = (frac: number) => {
    const v = -TSD_R + 2 * TSD_R * frac;
    return Math.sqrt(Math.max(0, TSD_R * TSD_R - v * v));
  };

  // ---- the ball: dropped into the emptied disc on "two"
  const ballP = prog(f, t.made - 10, t.two + 16 - (t.made - 10), ease.linear);
  const top = P(0, 1);
  const ballR = 64;
  // a shot's arc from the left, over the rim of the disc and down into it (behind its face)
  const bq = (a: number, b: number, c: number) => (1 - ballP) ** 2 * a + 2 * (1 - ballP) * ballP * b + ballP ** 2 * c;
  const bx = bq(120, top.x - 60, top.x);
  const by = bq(1010, 420, top.y + 90); // peak stays inside the stage, so the stage clip never flattens the ball
  const ball = (
    <g clipPath="url(#tsd-stage-clip)">
      <TrueShootingDiscBall x={bx} y={by} r={ballR} rot={-40 + ballP * 320} o={f >= t.made - 10 && f < t.two + 20 ? prog(f, t.made - 10, 4, ease.linear) : 0} />
    </g>
  );

  // ---- the ruler: ticks every 10 %, majors at 0, half and full, in the face's own plane
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const fr = i / 10;
    const major = i % 5 === 0;
    const a = P(RULER_U, fr);
    const b = P(RULER_U - (major ? 0.12 : 0.06), fr);
    return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={major ? "#C9D1D9" : C.dim} strokeWidth={major ? 3 : 2} />;
  });
  const r0 = P(RULER_U, 0);
  const r1 = P(RULER_U, 1);
  const rHis = P(RULER_U, HIS * fill3);
  const rLg = P(RULER_U, LEAGUE * greyLine);
  const lit79 = f >= t.his ? prog(f, endsOn("79", 28), 28, ease.out) : 0;

  // the league's level sweeps in from the ruler across the face
  const gR = P(RULER_U, LEAGUE);
  const gL = P(-chordEnd(LEAGUE), LEAGUE);
  const gSweep = prog(f, t.n575 - 10, 14, ease.out);
  const wTick = P(RULER_U, HIS);
  const wEnd = P(chordEnd(HIS), HIS);

  // ---- type and the card
  const label: React.CSSProperties = { position: "absolute", fontFamily: theme.font.ui, fontWeight: 600, fontSize: 34, color: C.soft, whiteSpace: "nowrap", transformOrigin: "left center", textShadow: "0 2px 10px rgba(0,0,0,0.8)" };
  const rulerLabels = [
    { fr: 0, a: "0", b: "0%" },
    { fr: 0.5, a: "1", b: "50%" },
    { fr: 1, a: "2", b: "100%" },
  ];
  const leftNum = (() => {
    // the live reading of the fill, beside its level on the left
    if (f < t.two) {
      const o = 1 - prog(f, t.so - 2, 6, ease.linear);
      return { text: null as string | null, frac: white, o, flap: true };
    }
    if (f < t.his) return { text: `${Math.round(fill2 * 100)}%`, frac: white, o: (f >= t.two + 4 ? 1 : 0) * (1 - drain2), flap: false };
    return { text: `${Math.round(countTo(f, endsOn("79", 28), 28, 0, 79, ease.out))}%`, frac: white, o: prog(f, endsOn("79", 28), 6, ease.linear), flap: false };
  })();
  const lp = P(-TSD_R - 0.06, leftNum.frac);
  const glossary = typeOn("TS% = PTS / (2 × TSA)", f, t.halves + 2, fps, 30);
  const cardIn = prog(f, t.his - 4, 14);
  const rowA = (i: number) => blurIn(f, t.his + 4 + i * 4, { dur: 8, rise: 10 });
  const rowB = (i: number) => blurIn(f, t.league + i * 4, { dur: 8, rise: 10 });
  const head: React.CSSProperties = { position: "absolute", fontFamily: theme.font.ui, fontWeight: 600, fontSize: 24, color: C.dim, letterSpacing: 0.4 };
  const cell = (x: number, y: number, style: React.CSSProperties = {}): React.CSSProperties => ({
    position: "absolute", left: x - 70, width: 140, top: y, textAlign: "center", fontFamily: theme.font.ui, fontWeight: 600, fontSize: 34, color: C.soft, fontVariantNumeric: "tabular-nums", ...style,
  });
  const cy = (y: number) => y - CARD.y; // card-local
  const yHeadA = 1222;
  const yRowA = 1252;
  const yHeadB = 1332;
  const yRowB = 1362;
  const tsA = prog(f, t.n79 - 2, 10, ease.linear);
  const tsB = prog(f, t.n575 - 2, 10, ease.linear);

  // hairlines from the TS% cells up to the foot of the ruler
  const whiteWire = draw(f, t.n79 - 30, 12);
  const greyWire = draw(f, t.average + 8, 14);
  const wirePathA = `M ${COL_TS} ${yRowA + 4} L ${COL_TS} ${r0.y + 40} L ${r0.x} ${r0.y}`;
  const wirePathB = `M ${COL_TS - 50} ${yRowB + 24} L ${COL_TS - 50} ${r0.y + 52} L ${r0.x - 6} ${r0.y + 4}`;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <clipPath id="tsd-stage-clip">
            <rect x={0} y={522} width={1080} height={1000} />
          </clipPath>
        </defs>
        <TrueShootingDiscFloor cam={cam} sweep={prog(f, t0, scene.to - t0, ease.inOut)} />
        <TrueShootingDiscSolid
          cam={cam}
          s={{ tilt, yaw, white, grey: LEAGUE, greyO, dimAbove, wave, sheen, flash, t: f }}
          ball={ball}
        />
        {/* the ruler stands with the disc */}
        <g opacity={prog(f, t0, 6, ease.linear)}>
          <line x1={r0.x} y1={r0.y} x2={r1.x} y2={r1.y} stroke={C.dim} strokeWidth={3} />
          {ticks}
          {lit79 > 0 && <line x1={r0.x} y1={r0.y} x2={rHis.x} y2={rHis.y} stroke={C.ink} strokeWidth={5} />}
          {greyLine > 0 && <line x1={r0.x + 1} y1={r0.y} x2={rLg.x + 1} y2={rLg.y} stroke="#6E7681" strokeWidth={6} />}
          {lit79 >= 1 && <line x1={wTick.x} y1={wTick.y} x2={wEnd.x} y2={wEnd.y} stroke={C.ink} strokeWidth={3} opacity={0.9} />}
          {gSweep > 0 && (
            <line x1={gR.x} y1={gR.y} x2={gR.x + (gL.x - gR.x) * gSweep} y2={gR.y + (gL.y - gR.y) * gSweep} stroke="#C9D1D9" strokeWidth={4} />
          )}
        </g>
        {/* hairlines from BBR's cells to the ruler */}
        {f >= t.his && <path d={wirePathA} fill="none" stroke={C.ink} strokeOpacity={0.85} strokeWidth={2} {...whiteWire} />}
        {f >= t.average && <path d={wirePathB} fill="none" stroke={C.grey} strokeWidth={2} {...greyWire} />}
      </svg>

      {/* ruler header: what the scale measures */}
      {(() => {
        const h0 = P(RULER_U - 0.12, 1.1);
        const h = { x: Math.min(h0.x, 1080 - 290), y: h0.y };
        return (
          <>
            <TrueShootingDiscFlap f={f} at={t.halves + 14} a="points per chance" b="true shooting" style={{ ...label, left: h.x, top: h.y - 44, fontSize: 30, color: C.dim }} />
            <div style={{ ...label, left: h.x - 64, top: h.y - 46, fontSize: 32, color: C.ink, ...pop(f, t.halves), ...(f > t.halves + 40 ? blurOut(f, t.halves + 40, { dur: 10 }) : {}), display: f < t.halves ? "none" : undefined }}>÷ 2</div>
          </>
        );
      })()}
      {rulerLabels.map((r, i) => {
        const p = P(RULER_U + 0.07, r.fr);
        const big = r.fr === 1 ? flash : 0;
        return (
          <TrueShootingDiscFlap
            key={i}
            f={f}
            at={t.halves + i * 5}
            a={r.a}
            b={r.b}
            style={{ ...label, left: p.x, top: p.y - 22, color: big > 0.05 ? C.ink : C.soft, transform: `scale(${1 + 0.35 * big})` }}
          />
        );
      })}

      {/* the live reading on the left of the disc */}
      {leftNum.o > 0.01 && (
        <div style={{ position: "absolute", left: lp.x - 260, width: 240, top: lp.y - 40, textAlign: "right", fontFamily: theme.font.caption, fontWeight: 800, fontSize: 60, color: C.ink, opacity: leftNum.o, fontVariantNumeric: "tabular-nums", textShadow: "0 3px 14px rgba(0,0,0,0.7)" }}>
          {leftNum.flap ? <TrueShootingDiscFlap f={f} at={t.halves + 16} a="1.58" b="79%" style={{ transformOrigin: "right center" }} /> : leftNum.text}
        </div>
      )}
      {f >= t.n79 && (
        <div style={{ position: "absolute", left: lp.x - 260, width: 240, top: lp.y - 82, textAlign: "right", fontFamily: theme.font.ui, fontWeight: 600, fontSize: 28, color: C.dim, ...blurIn(f, t.n79, { dur: 8 }) }}>V. Wembanyama</div>
      )}
      {f >= t.n575 - 10 && (() => {
        const g = P(-TSD_R - 0.06, LEAGUE);
        return (
          <div style={{ position: "absolute", left: g.x - 260, width: 240, top: g.y - 8, textAlign: "right", ...blurIn(f, t.n575 - 4, { dur: 8, rise: -10 }) }}>
            <div style={{ fontFamily: theme.font.caption, fontWeight: 800, fontSize: 52, color: "#C9D1D9", fontVariantNumeric: "tabular-nums" }}>{countTo(f, t.n575 - 4, 22, 0, 57.5, ease.out).toFixed(1)}%</div>
            <div style={{ fontFamily: theme.font.ui, fontWeight: 600, fontSize: 28, color: C.dim }}>league average</div>
          </div>
        );
      })()}

      {/* "made 2" on the ball */}
      {f >= t.made - 6 && f < t.two + 2 && (() => {
        const o = prog(f, t.made - 6, 5, ease.linear) * (1 - prog(f, t.two - 8, 8, ease.linear));
        return (
          <div style={{ position: "absolute", inset: 0, opacity: o }}>
            <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
              <line x1={bx - ballR * 0.7} y1={by + ballR * 0.7} x2={bx - ballR * 0.7 - 40} y2={by + ballR * 0.7 + 50} stroke={C.dim} strokeWidth={2} />
              <circle cx={bx - ballR * 0.7} cy={by + ballR * 0.7} r={4} fill={C.dim} />
            </svg>
            <div style={{ ...label, left: bx - ballR * 0.7 - 150, top: by + ballR * 0.7 + 52, color: C.ink, fontWeight: 700 }}>made 2</div>
          </div>
        );
      })()}

      {/* BBR glossary: the 2 x is the halving */}
      {f >= t.halves && f < t.his + 4 && (
        <div style={{ position: "absolute", left: 40, width: 1000, top: 1220, textAlign: "center", ...(f >= t.his - 6 ? blurOut(f, t.his - 6, { dur: 8 }) : {}) }}>
          <div style={{ fontFamily: theme.font.mono, fontSize: 40, color: C.soft, height: 52 }}>
            {glossary.text.split("").map((ch, i) => (
              <span key={i} style={{ color: i >= 12 && i <= 14 ? C.ink : C.soft, fontWeight: i >= 12 && i <= 14 ? 700 : 400 }}>{ch}</span>
            ))}
          </div>
          <div style={{ marginTop: 14, fontFamily: theme.font.ui, fontSize: 26, color: C.dim, opacity: prog(f, t.halves + 20, 8, ease.linear) }}>Basketball-Reference glossary</div>
        </div>
      )}

      {/* Basketball-Reference: his advanced row, then the 2026-27 League Average row */}
      {f >= t.his - 4 && (
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 18, background: C.card, border: `1px solid ${C.line}`, boxShadow: "0 24px 60px rgba(0,0,0,0.5)", opacity: cardIn, transform: `translateY(${(1 - cardIn) * 40}px)` }}>
          <div style={{ position: "absolute", left: 24, top: 12, fontFamily: theme.font.ui, fontWeight: 700, fontSize: 24, color: C.soft }}>Basketball-Reference</div>
          <div style={{ position: "absolute", right: 24, top: 14, fontFamily: theme.font.ui, fontSize: 22, color: C.dim }}>photo Frenchieinportland, CC BY 4.0</div>
          <div style={{ position: "absolute", left: 16, right: 16, top: 44, height: 1, background: C.line }} />
          {/* his row */}
          <div style={{ ...head, left: 24, top: cy(yHeadA), ...rowA(0) }}>Advanced Box Score · Nov 21 2026</div>
          {[
            { x: 670, h: "MP", v: "31:51" },
            { x: COL_TS, h: "TS%", v: ".790" },
            { x: 960, h: "eFG%", v: ".776" },
          ].map((c, i) => (
            <React.Fragment key={c.h}>
              <div style={{ ...cell(c.x - CARD.x, cy(yHeadA) - 2, { fontSize: 24, color: c.h === "TS%" ? C.soft : C.dim }), ...rowA(i + 1) }}>{c.h}</div>
              <div style={{ ...cell(c.x - CARD.x, cy(yRowA) + 14, c.h === "TS%" ? { color: tsA > 0.5 ? C.ink : C.soft, fontWeight: 800 } : {}), ...rowA(i + 1) }}>
                {c.h === "TS%" && <div style={{ position: "absolute", inset: "-8px 22px", borderRadius: 10, background: `rgba(255,255,255,${(0.14 * tsA).toFixed(3)})`, border: tsA > 0 ? `2px solid rgba(255,255,255,${(0.6 * tsA).toFixed(2)})` : undefined }} />}
                <span style={{ position: "relative" }}>{c.v}</span>
              </div>
            </React.Fragment>
          ))}
          <div style={{ position: "absolute", left: 24, top: cy(yRowA) + 6, display: "flex", alignItems: "center", gap: 16, ...rowA(0) }}>
            <div style={{ width: 64, height: 64, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.line}` }}>
              <Img src={asset("trueshootingdisc-wemby-face.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ fontFamily: theme.font.ui, fontWeight: 700, fontSize: 34, color: C.ink }}>Victor Wembanyama</div>
          </div>
          <div style={{ position: "absolute", left: 16, right: 16, top: cy(yHeadB) - 10, height: 1, background: C.line, opacity: prog(f, t.league - 4, 8, ease.linear) }} />
          {/* the league row */}
          {f >= t.league - 2 && (
            <>
              <div style={{ ...head, left: 24, top: cy(yHeadB), ...rowB(0) }}>Advanced Stats · 2026-27</div>
              {[
                { x: 670, h: "Age", v: "26.7" },
                { x: COL_TS, h: "TS%", v: ".575" },
                { x: 960, h: "eFG%", v: ".537" },
              ].map((c, i) => (
                <React.Fragment key={c.h}>
                  <div style={{ ...cell(c.x - CARD.x, cy(yHeadB) - 2, { fontSize: 24, color: C.dim }), ...rowB(i + 1) }}>{c.h}</div>
                  <div style={{ ...cell(c.x - CARD.x, cy(yRowB) + 14, c.h === "TS%" ? { color: tsB > 0.5 ? "#E6EDF3" : C.soft, fontWeight: 800 } : {}), ...rowB(i + 1) }}>
                    {c.h === "TS%" && <div style={{ position: "absolute", inset: "-8px 22px", borderRadius: 10, background: `rgba(139,148,158,${(0.22 * tsB).toFixed(3)})`, border: tsB > 0 ? `2px solid rgba(139,148,158,${(0.8 * tsB).toFixed(2)})` : undefined }} />}
                    <span style={{ position: "relative" }}>{c.v}</span>
                  </div>
                </React.Fragment>
              ))}
              <div style={{ position: "absolute", left: 24, top: cy(yRowB) + 6, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", ...pop(f, t.average) }}>
                  <Img src={asset("trueshootingdisc-logoman.svg")} style={{ width: 60, display: "block" }} />
                </div>
                <div style={{ fontFamily: theme.font.ui, fontWeight: 700, fontSize: 34, color: C.soft, ...rowB(0) }}>League Average</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
