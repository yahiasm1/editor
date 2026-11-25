// "At halftime the Raptors were up 63 to 49, and the home crowd was booing. Kobe had 26 points, which sounds like a
// lot, until you hear what came next."
// ARENA scale, then the reel's invisible thing is born. The stands of the night photo fill the card and push in while
// the small scoreboard runs the real second quarter to HALF 63-49. On "booing" BOOs rise out of the real faces in the
// rows and the board trembles. The LAKERS 49 drops out of the board, huge, and breaks into 49 warm bulbs along its
// own segments; Kobe's 26 turn gold make by make in his real order, snap into the first sockets of a 9 x 9 board,
// and the other 55 sockets fade in dark and glint.
import React from "react";
import { Img, interpolateColors, staticFile } from "remotion";
import { Travel, blurIn, ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { StaplesNightBoard, StaplesNightBoardRect, StaplesNightDigit, StaplesNightLed } from "./StaplesNightBoard";
import {
  HalftimeBoosBench,
  HalftimeBoosDigitBig,
  HalftimeBoosDigitGeom,
  HalftimeBoosDigitSpots,
  HalftimeBoosFaces,
  HalftimeBoosGrid,
  HalftimeBoosMakes,
  HalftimeBoosPoints,
  HalftimeBoosQ2,
  HalftimeBoosRand,
  HalftimeBoosSocket,
} from "./HalftimeBoosKit";

const STANDS = "kobe-81/halftimeboos-stands-endlessbender.jpg"; // the 800 x 560 crop, upscaled 2.25x
const CROP_W = 800;
const CROP_H = 560;
const CARD = { x: 90, y: 716, w: 900, h: 720 };
const GOLD = "#FDB927";
const GREY = "#8B949E";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const bell = (f: number, at: number, dur: number) => {
  const t = (f - at) / dur;
  return t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t);
};

const fmtClock = (g: number) => {
  if (g >= 60) {
    const s = Math.floor(g);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }
  return (Math.floor(g * 10) / 10).toFixed(1);
};

/** one bulb: a lit glass globe with a hot core and a halo, or a dark socket when lit = 0 */
const HalftimeBoosBulb: React.FC<{ x: number; y: number; r: number; color: string; lit: number; glow?: number; alpha?: number }> = ({ x, y, r, color, lit, glow = 1, alpha = 1 }) => {
  if (alpha <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, opacity: alpha }}>
      {lit > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: -r * 1.6,
            top: -r * 1.6,
            width: r * 5.2,
            height: r * 5.2,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 62%)`,
            opacity: 0.42 * lit * glow,
          }}
        />
      )}
      {/* the socket ring */}
      <div style={{ position: "absolute", inset: -3, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #2a3038 0%, #12161c 70%)", border: "1.5px solid #3b424c" }} />
      {/* the globe */}
      <div
        style={{
          position: "absolute",
          inset: 1,
          borderRadius: "50%",
          background: `radial-gradient(circle at 46% 40%, #FFFDF4 0%, ${color} ${Math.round(38 + 20 * (1 - lit))}%, ${color} 70%, rgba(0,0,0,0.35) 100%)`,
          opacity: lit,
          boxShadow: `0 0 ${(r * 0.6 * glow * lit).toFixed(1)}px ${color}`,
        }}
      />
      {/* a highlight on the glass, lit or not */}
      <div style={{ position: "absolute", left: r * 0.45, top: r * 0.3, width: r * 0.55, height: r * 0.32, borderRadius: "50%", background: "rgba(255,255,255,0.55)", opacity: 0.25 + 0.5 * lit, transform: "rotate(-28deg)" }} />
    </div>
  );
};

export const HalftimeBoos: React.FC = () => {
  const { f, fps, scene, cue, cueEnd, endsOn, theme, ground } = useScene();
  const mount = scene.from - LEAD;

  const t63 = cue("63");
  const t49 = cue("49");
  const tCrowd = cue("crowd");
  const tBoo = cue("booing");
  const tKobe = cue("Kobe");
  const t26 = cue("26");
  const tPointsEnd = cueEnd("points");
  const tLot = cue("lot");
  const tUntil = cue("until");
  const tNext = cue("next");

  // ---------------------------------------------------------------- the scoreboard: the real 2nd quarter
  const runAt = mount + 6;
  const runEnd = endsOn("63", 2);
  const gAt = (fr: number) => 720 * (1 - prog(fr, runAt, runEnd - runAt, ease.out));
  const g = gAt(f);
  const done = HalftimeBoosQ2.filter((e) => e.secs >= g);
  const last = done[done.length - 1];
  const half = f >= t63;
  const tor = half ? 63 : last ? last.tor : 36;
  const lal49 = half ? 49 : last ? last.lal : 29;
  const recent = (team: string) => {
    const g3 = gAt(f - 4);
    return !half && HalftimeBoosQ2.some((e) => e.team === team && e.secs < g3 && e.secs >= g) ? 1 : 0;
  };
  // the 49 leaves the board on "Kobe", the board relights it as the scene closes
  const dropAt = tKobe - 2;
  const relightAt = tNext + 8;
  const flick = [0, 1, 0.2, 1, 0.5, 1];
  const ri = f - relightAt;
  const lalShown = f < dropAt || ri >= 0;
  const lalGlow = ri >= 0 && ri < flick.length ? flick[ri] : 1;
  const flareTor = half ? prog(f, t63, 6, ease.out) * (1 - 0.5 * prog(f, t63 + 14, 20, ease.linear)) : 0;
  const lockLal = bell(f, t49, 22);
  // the board trembles under the boos
  const booEnv = prog(f, tBoo - 2, 6, ease.out) * (1 - prog(f, tBoo + 18, 40, ease.linear));
  const tremX = Math.sin(f * 2.7) * 2.2 * booEnv;
  const tremY = Math.cos(f * 3.3) * 1.4 * booEnv;

  // ---------------------------------------------------------------- the camera on the stands
  type Cam = { w: number; cx: number; cy: number };
  const camA: Cam = { w: 700, cx: 400, cy: 300 };
  const camB: Cam = { w: 470, cx: 300, cy: 226 };
  const camC: Cam = { w: 420, cx: 286, cy: 214 };
  const pAB = prog(f, mount, tCrowd + 10 - mount, ease.inOut);
  const pBC = prog(f, tCrowd + 10, scene.to - tCrowd, ease.linear);
  const camAt = (a: Cam, b: Cam, t: number): Cam => ({ w: lerp(a.w, b.w, t), cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t) });
  const cam = camAt(camAt(camA, camB, pAB), camC, pBC);
  const z = CARD.w / cam.w;
  const cx = clamp(cam.cx, CARD.w / 2 / z, CROP_W - CARD.w / 2 / z);
  const cy = clamp(cam.cy, CARD.h / 2 / z, CROP_H - CARD.h / 2 / z);
  // the crowd shakes
  const shake = booEnv * 4.5;
  const shX = Math.sin(f * 1.9) * shake;
  const shY = Math.cos(f * 2.45) * shake * 0.6;
  const imgL = CARD.w / 2 - cx * z + shX;
  const imgT = CARD.h / 2 - cy * z + shY;
  const faceAt = (i: number) => {
    const [fx, fy] = HalftimeBoosFaces[i];
    return { x: CARD.x + imgL + fx * z, y: CARD.y + imgT + fy * z };
  };
  // the stands dim when the board's 49 comes down
  const dim = 0.86 * prog(f, tKobe, 16, ease.out);
  const sweep = lerp(-0.3, 1.3, prog(f, mount, scene.to - mount, ease.linear));

  // ---------------------------------------------------------------- the BOOs, out of the real faces
  type Boo = { i: number; at: number; size: number; tilt: number; text: string; speed: number; sway: number };
  const boos: Boo[] = [];
  {
    // faces inside the frame the camera holds at "booing"
    const zB = CARD.w / camB.w;
    const lB = CARD.w / 2 - camB.cx * zB;
    const tB = CARD.h / 2 - camB.cy * zB;
    const vis = HalftimeBoosFaces.map((p, i) => ({ i, x: lB + p[0] * zB, y: tB + p[1] * zB })).filter((p) => p.x > 30 && p.x < CARD.w - 30 && p.y > 70 && p.y < CARD.h - 20);
    vis.filter((_, k) => k % 2 === 0).forEach((p, k) => {
      const r1 = HalftimeBoosRand(p.i, 1);
      const r2 = HalftimeBoosRand(p.i, 2);
      const r3 = HalftimeBoosRand(p.i, 3);
      const big = k % 7 === 3;
      boos.push({
        i: p.i,
        at: tBoo - 3 + Math.round(r1 * 26),
        size: big ? 96 + r2 * 34 : 34 + r2 * r2 * 52,
        tilt: (r3 - 0.5) * 34,
        text: r2 > 0.72 ? "BOOO" : r2 > 0.4 ? "BOO" : r3 > 0.5 ? "BOO!" : "BOO",
        speed: big ? 7.5 : 3.6 + r1 * 3.2,
        sway: (r2 - 0.5) * 2,
      });
    });
  }
  const booExit = prog(f, tKobe - 10, 10, ease.in); // gone before the 49 comes down

  // ---------------------------------------------------------------- the 49 drops out and breaks into bulbs
  const R = StaplesNightBoardRect;
  const smallH = 56;
  const smallG = HalftimeBoosDigitGeom(smallH);
  const small = { x: R.x + 470 + (130 - smallG.total), y: R.y + 80 + 8 };
  const bigG = HalftimeBoosDigitGeom(HalftimeBoosDigitBig.h);
  const big = { x: 540 - bigG.total / 2, y: HalftimeBoosDigitBig.top };
  const dropDur = 18;
  const kd = prog(f, dropAt, dropDur, ease.inOut);
  const kdPrev = prog(f - 1, dropAt, dropDur, ease.inOut);
  const breakAt = dropAt + dropDur;
  const dh = lerp(smallH, HalftimeBoosDigitBig.h, kd);
  const dx = lerp(small.x, big.x, kd);
  const dy = lerp(small.y, big.y, kd) - Math.sin(Math.PI * kd) * 40;
  const dVel = Math.abs(kd - kdPrev) * 600;
  const digitAlpha = f < dropAt ? 0 : 1 - prog(f, breakAt, 8, ease.in);

  // the bulbs
  const spots = HalftimeBoosDigitSpots();
  const pts = HalftimeBoosPoints;
  const litStart = t26 - 4;
  const litEnd = tPointsEnd - 8;
  const makeAt = (m: number) => Math.round(litStart + (m * (litEnd - litStart)) / (HalftimeBoosMakes - 1));
  const kobeIdx: number[] = [];
  const mateIdx: number[] = [];
  pts.forEach((p, k) => (p.kobe ? kobeIdx : mateIdx).push(k));
  const benchAt = tPointsEnd + 2;
  const snapDur = 16;
  const snapAt = endsOn("lot", snapDur);
  // live count of Kobe's lit bulbs
  const kobeLit = pts.filter((p) => p.kobe && f >= makeAt(p.make)).length;
  const mateIn = mateIdx.filter((_, j) => f >= benchAt + j * 0.6 + 10).length;

  // sockets of the 9 x 9 board
  const socketsIn = (i: number) => {
    if (i < 26) return prog(f, snapAt + snapDur - 4, 6, ease.out);
    const s = HalftimeBoosSocket(i);
    return prog(f, tUntil - 2 + (s.row - 2) * 5 + s.col * 0.7, 9, ease.out);
  };
  const socketsShown = Array.from({ length: 81 }, (_, i) => i).filter((i) => socketsIn(i) > 0.5).length;
  const breathe = f > tLot ? 0.9 + 0.1 * Math.sin((f - tLot) * 0.18) : 1;

  const bulbs = pts.map((p, k) => {
    const sp = spots[k];
    const born = prog(f, breakAt - 3 + (k % 7), 7, ease.back);
    const bornPos = { x: lerp(dx + (sp.x - big.x) * (dh / HalftimeBoosDigitBig.h), sp.x, kd), y: lerp(dy + (sp.y - big.y) * (dh / HalftimeBoosDigitBig.h), sp.y, kd) };
    let x = bornPos.x;
    let y = bornPos.y;
    let r = 15;
    let color = "#FFE9C4";
    let lit = 1;
    let glow = 0.9;
    let alpha = born;
    if (p.kobe) {
      const at = makeAt(p.make);
      const g1 = prog(f, at, 4, ease.out);
      color = interpolateColors(g1, [0, 1], ["#FFE9C4", GOLD]);
      glow = 0.9 + 1.3 * bell(f, at, 12);
      r = 15 * (1 + 0.28 * bell(f, at, 10));
      // snap into the board, Kobe's order
      const order = kobeIdx.indexOf(k);
      const sk = HalftimeBoosSocket(order);
      const ks = prog(f, snapAt + order * 0.35, snapDur - 6, ease.inOut);
      const arc = Math.sin(Math.PI * ks) * (40 + (order % 9) * 4);
      x = lerp(x, sk.x, ks);
      y = lerp(y, sk.y, ks) - arc;
      r = lerp(r, HalftimeBoosGrid.r, ks);
      glow *= breathe * (1 + 0.6 * bell(f, snapAt + snapDur - 2, 14));
    } else {
      const j = mateIdx.indexOf(k);
      const b = HalftimeBoosBench(j);
      const kb = prog(f, benchAt + j * 0.6, 18, ease.inOut);
      x = lerp(x, b.x, kb);
      y = lerp(y, b.y, kb);
      r = lerp(15, 15, kb);
      lit = 1 - 0.45 * kb;
      glow = 0.9 - 0.6 * kb;
    }
    return { k, x, y, r, color, lit, glow, alpha, kobe: p.kobe };
  });

  // the glint across the dark sockets on "next"
  const glintAt = (i: number) => {
    const s = HalftimeBoosSocket(i);
    return tNext - 8 + s.col * 2.2 + (s.row - 2) * 0.9;
  };

  const showBulbs = f >= breakAt - 3;
  const counterFlash = Math.max(0, ...Array.from({ length: HalftimeBoosMakes }, (_, m) => bell(f, makeAt(m), 10)));
  const counterIn = blurIn(f, litStart - 2, { dur: 8, rise: 12 });
  const legendIn = blurIn(f, makeAt(0) + 2, { dur: 8, rise: 10 });

  return (
    <>
      {/* ---------- the stands photo card */}
      <Travel at={mount} from="bottom" dist={260} dur={18} curve="measured" style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 24, overflow: "hidden", background: ground.card, border: `2px solid ${ground.hairline}`, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
          <Img src={staticFile(STANDS)} style={{ position: "absolute", left: imgL, top: imgT, width: CROP_W * z, height: CROP_H * z, maxWidth: "none", filter: dim > 0.01 ? `blur(${(dim * 2.2).toFixed(2)}px)` : undefined }} />
          {/* light travelling along the rows and catching the stair rails */}
          <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", background: `linear-gradient(112deg, transparent ${(sweep - 0.16) * 100}%, rgba(255,232,190,0.12) ${sweep * 100}%, transparent ${(sweep + 0.16) * 100}%)` }} />
          <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", inset: 0, opacity: 0.1, mixBlendMode: "overlay" }}>
            <filter id="halftimeboos-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 9} />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#halftimeboos-grain)" />
          </svg>
          {/* the lit board's red spill over the top rows */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 140, background: `linear-gradient(180deg, rgba(255,42,28,${(0.12 + 0.06 * (recent("TOR") + recent("LAL")) + 0.06 * booEnv).toFixed(3)}), rgba(255,42,28,0))`, mixBlendMode: "screen" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(0,0,0,0.42) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: `rgba(9,12,17,${dim.toFixed(3)})` }} />
          <div style={{ position: "absolute", right: 0, top: 0, padding: "10px 16px 18px 40px", background: "linear-gradient(200deg, rgba(0,0,0,0.6), rgba(0,0,0,0) 80%)", fontFamily: theme.font.ui, fontSize: 22, color: "#C9D1D9", opacity: clamp(1 - 1.3 * dim, 0, 1) }}>
            endlessbender, CC BY 2.0
          </div>
        </div>
      </Travel>

      {/* ---------- the BOOs */}
      {boos.map((b, n) => {
        const age = f - b.at;
        if (age < 0 || booExit >= 1) return null;
        const o = faceAt(b.i);
        const rise = b.speed * age * (1 - Math.min(0.5, age / 160)) + booExit * 1100;
        const x = clamp(o.x + Math.sin(age * 0.09 + n) * 14 * b.sway, 90 + b.size * 1.1, 990 - b.size * 1.1);
        const y = o.y - 10 - rise;
        const popK = prog(f, b.at, 7, ease.back);
        const fadeTop = clamp((y - b.size * 0.9 - 720) / 110, 0, 1); // the glyph's top never crosses the board
        const alpha = prog(f, b.at, 4, ease.linear) * fadeTop * (1 - prog(age, 70, 30, ease.linear)) * (1 - booExit * 0.6);
        if (alpha <= 0.01) return null;
        return (
          <div
            key={n}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -100%) rotate(${b.tilt.toFixed(1)}deg) scale(${(0.35 + 0.65 * popK).toFixed(3)})`,
              transformOrigin: "50% 100%",
              fontFamily: theme.font.caption,
              fontWeight: 900,
              fontSize: b.size,
              letterSpacing: b.size * -0.02,
              color: "#F4EFE6",
              opacity: alpha,
              whiteSpace: "nowrap",
              textShadow: `0 ${(b.size * 0.05).toFixed(1)}px ${(b.size * 0.12).toFixed(1)}px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)`,
              filter: booExit > 0.05 ? `blur(${(booExit * 6).toFixed(2)}px)` : undefined,
            }}
          >
            {b.text}
          </div>
        );
      })}

      {/* ---------- the scoreboard, hanging small at the top of the stage */}
      <div style={{ ...blurIn(f, scene.from - LEAD, { dur: 8 }), position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${tremX.toFixed(2)}px, ${tremY.toFixed(2)}px)` }}>
          <StaplesNightBoard
            st={{
              power: 1,
              tor,
              lal: lalShown ? lal49 : null,
              period: half ? "HALF" : "2ND",
              clock: half ? "0.0" : fmtClock(g),
              flashTor: recent("TOR") + bell(f, t63, 18) * 0.8,
              flashLal: (lalShown ? recent("LAL") + lockLal * 1.1 : 0) * lalGlow,
              flareTor,
              logoTor: 1 + 0.22 * bell(f, t63, 16),
              logoLal: 1 + 0.18 * lockLal,
            }}
          />
        </div>
      </div>

      {/* ---------- the 49 itself, dropping out of the board */}
      {digitAlpha > 0.01 && (
        <div style={{ position: "absolute", left: dx, top: dy, width: bigG.total, height: dh, opacity: digitAlpha, filter: dVel > 4 ? `blur(${Math.min(5, dVel * 0.04).toFixed(2)}px)` : undefined }}>
          <StaplesNightDigit ch="4" h={dh} color={StaplesNightLed.red} dim="rgba(255,42,28,0.06)" glow={1.2} />
          <StaplesNightDigit ch="9" h={dh} color={StaplesNightLed.red} dim="rgba(255,42,28,0.06)" glow={1.2} x={dh * 0.6 + dh * 0.16} />
        </div>
      )}

      {/* ---------- the 9 x 9 board: dark sockets */}
      {Array.from({ length: 81 }, (_, i) => {
        const a = socketsIn(i);
        if (a <= 0.01) return null;
        const s = HalftimeBoosSocket(i);
        const gl = i >= 26 ? bell(f, glintAt(i), 16) : 0;
        const rr = HalftimeBoosGrid.r;
        return (
          <div key={`s${i}`} style={{ position: "absolute", left: s.x - rr - 3, top: s.y - rr - 3, width: (rr + 3) * 2, height: (rr + 3) * 2, opacity: a, transform: `scale(${(0.7 + 0.3 * a).toFixed(3)})` }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 50% 38%, #262c34 0%, #11151a 68%, #0a0d11 100%)", border: "1.5px solid #3b424c", boxShadow: "inset 0 2px 3px rgba(0,0,0,0.7)" }} />
            {/* the threaded base inside the socket */}
            <div style={{ position: "absolute", inset: rr * 0.42, borderRadius: "50%", border: "1px solid rgba(160,168,180,0.16)" }} />
            <div style={{ position: "absolute", inset: rr * 0.62, borderRadius: "50%", border: "1px solid rgba(160,168,180,0.10)" }} />
            {/* the glint */}
            {gl > 0.01 && (
              <>
                <div style={{ position: "absolute", inset: -8, borderRadius: "50%", background: "radial-gradient(circle, rgba(253,185,39,0.28) 0%, rgba(0,0,0,0) 65%)", opacity: gl }} />
                <div style={{ position: "absolute", left: rr * 0.5, top: rr * 0.35, width: rr * 0.7, height: rr * 0.34, borderRadius: "50%", background: "rgba(255,244,214,0.85)", opacity: gl, transform: "rotate(-28deg)", filter: "blur(1px)" }} />
              </>
            )}
          </div>
        );
      })}

      {/* ---------- the bulbs: teammates first so Kobe's pass over them */}
      {showBulbs &&
        [...bulbs.filter((b) => !b.kobe), ...bulbs.filter((b) => b.kobe)].map((b) => (
          <HalftimeBoosBulb key={b.k} x={b.x} y={b.y} r={b.r} color={b.color} lit={b.lit} glow={b.glow} alpha={b.alpha} />
        ))}

      {/* ---------- counter row: Kobe's points, the legend */}
      <div style={{ position: "absolute", left: 90, top: 724, width: 900, height: 100, fontFamily: theme.font.ui }}>
        <div style={{ ...counterIn, position: "absolute", left: 26, top: 6, display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontSize: 96, fontWeight: 800, color: ground.ink, fontVariantNumeric: "tabular-nums", lineHeight: 1, textShadow: `0 0 ${(22 * counterFlash).toFixed(1)}px rgba(253,185,39,0.85)` }}>
            {kobeLit}
          </span>
          <span style={{ fontSize: 36, fontWeight: 600, color: "#C9D1D9" }}>Kobe&apos;s points</span>
        </div>
        <div style={{ ...legendIn, position: "absolute", right: 26, top: 32, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", width: 32, height: 32 }}>
            <HalftimeBoosBulb x={16} y={16} r={13} color={GOLD} lit={1} glow={1} />
          </div>
          <span style={{ fontSize: 32, color: GREY }}>1 bulb = 1 Kobe point</span>
        </div>
      </div>

      {/* ---------- left column labels */}
      <div style={{ ...blurIn(f, benchAt + 8, { dur: 8, rise: 10 }), position: "absolute", left: 112, top: 940, fontFamily: theme.font.ui, fontSize: 32, color: GREY, whiteSpace: "nowrap" }}>
        other Lakers <span style={{ color: "#C9D1D9", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{mateIn}</span>
      </div>
      <div style={{ ...blurIn(f, tUntil, { dur: 8, rise: 10 }), position: "absolute", left: 112, top: 1336, width: 320, height: 40, fontFamily: theme.font.ui }}>
        <span style={{ fontSize: 32, color: GREY, whiteSpace: "nowrap" }}>
          <span style={{ color: "#C9D1D9", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{socketsShown}</span> sockets
        </span>
        <div style={{ position: "absolute", left: 172, top: 22, height: 1.5, width: (HalftimeBoosGrid.x0 - HalftimeBoosGrid.r - 10 - 112 - 172) * prog(f, tUntil + 4, 12, ease.out), background: "#30363D" }} />
      </div>
      <div style={{ ...blurIn(f, benchAt + 14, { dur: 8 }), position: "absolute", left: 112, top: 1386, fontFamily: theme.font.ui, fontSize: 26, color: GREY }}>Basketball-Reference play-by-play</div>
    </>
  );
};
