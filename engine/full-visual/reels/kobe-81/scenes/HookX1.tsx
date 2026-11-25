// Hook 1, dark, 0.12-3.90 s: "Kobe Bryant once scored more points in one half than the entire Toronto Raptors team."
// One hero: the only photo taken at the 81 game (endlessbender), on a slow push, with Kobe's gold #8 cut-out in front.
// From frame 0 gold bulbs arc out of his hands in his real second-half makes (a 3 is three bulbs at once) and pile on
// the near half; red bulbs drip off the five real Raptors into little heaps at their feet. one: the photo's own
// half-court line lights white, the far half dims. half: his pile settles on the lit half. entire: a red ring snaps
// round each real red jersey. Toronto: the Raptors logo lands over them and their heaps slide into one small pile.
// Raptors: his pile tips over the line and floods up the maple, hopping and slowing, over the ringed jerseys,
// burying the red; the far half's floor glows gold. Then the photo dims away and leaves `night` its dark scoreboard.
import React from "react";
import { Easing, Img, staticFile } from "remotion";
import { blurIn, ease, leaveEase, prog, useScene } from "../../../src/engine";
import { StaplesNightBoard } from "./StaplesNightBoard";
import {
  HookX1FarFloor, HookX1FloodTargets, HookX1Gold, HookX1GoldMake, HookX1GoldPile, HookX1Heaps, HookX1Jerseys,
  HookX1KobeInPhoto, HookX1KobeMakes, HookX1Line, HookX1Persp, HookX1Photo, HookX1PileBase, HookX1Red, HookX1RedMake,
  HookX1RedPile, HookX1RaptorMakes, HookX1ReleaseRank, HookX1Rnd,
} from "./HookX1Kit";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const bell = (f: number, at: number, dur: number) => {
  const t = (f - at) / dur;
  return t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t);
};
const backOut = Easing.out(Easing.back(1.1));

// the stage band and the cut-out
const BAND = { top: 520, bottom: 1450 };
const MIDY = (BAND.top + BAND.bottom) / 2;
const KOBE = { src: "kobe-81/hookx1-kobe.png", w: 807, h: 1288, x: -66, y: 728, s: 0.56 };
const BALL = { x: KOBE.x + 560 * KOBE.s, y: KOBE.y + 1060 * KOBE.s }; // the front of the ball, between his hands
const POUR = 16; // frames a poured bulb is in the air
const DRIP = 11;

/** one bulb: a glass globe with a hot core and a halo */
const HookX1Bulb: React.FC<{ x: number; y: number; r: number; color: string; lit?: number; glow?: number; alpha?: number }> = ({ x, y, r, color, lit = 1, glow = 1, alpha = 1 }) => {
  if (alpha <= 0.01 || r <= 0.2) return null;
  return (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, opacity: alpha }}>
      <div style={{ position: "absolute", left: -r * 1.6, top: -r * 1.6, width: r * 5.2, height: r * 5.2, borderRadius: "50%", background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 62%)`, opacity: Math.min(1, 0.42 * lit * glow) }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 44% 38%, #FFFDF4 0%, ${color} ${Math.round(30 + 26 * (1 - lit))}%, ${color} 68%, rgba(40,10,0,0.55) 100%)`,
          boxShadow: `0 0 ${(r * 0.7 * glow * lit).toFixed(1)}px ${color}, inset 0 -${(r * 0.25).toFixed(1)}px ${(r * 0.4).toFixed(1)}px rgba(0,0,0,0.35)`,
          filter: lit < 1 ? `brightness(${(0.35 + 0.65 * lit).toFixed(3)})` : undefined,
        }}
      />
      <div style={{ position: "absolute", left: r * 0.42, top: r * 0.26, width: r * 0.6, height: r * 0.34, borderRadius: "50%", background: "rgba(255,255,255,0.7)", opacity: 0.3 + 0.5 * lit, transform: "rotate(-28deg)" }} />
    </div>
  );
};

export const HookX1: React.FC = () => {
  const { f, fps, scene, cue, cueEnd, theme } = useScene();

  const tKobe = cue("Kobe");
  const tBryant = cue("Bryant");
  const tOnce = cue("once");
  const tScored = cue("scored");
  const tMore = cue("more");
  const tOne = cue("one");
  const tHalf = cue("half");
  const tThan = cue("than");
  const tEntire = cue("entire");
  const tToronto = cue("Toronto");
  const tRap = cue("Raptors");
  const tEnd = cueEnd("team");

  // ---- the camera on the photo: a slow push all the way, a lean toward the players from "than"
  const camAt = (fr: number) => {
    const p = prog(fr, 0, scene.to, ease.linear);
    const l = prog(fr, tThan - 4, 40, ease.inOut);
    const z = 1.38 + 0.09 * p + 0.05 * l;
    const halfH = (BAND.bottom - BAND.top) / 2 / z;
    const halfW = 540 / z;
    const cx = clamp(404 + 14 * l, halfW, HookX1Photo.w - halfW);
    const cy = clamp(382 + 10 * l, halfH, HookX1Photo.h - halfH - 1);
    return { z, cx, cy };
  };
  const cam = camAt(f);
  const SA = (c: { z: number; cx: number; cy: number }, x: number, y: number) => ({ x: 540 + (x - c.cx) * c.z, y: MIDY + (y - c.cy) * c.z });
  const S = (x: number, y: number) => SA(cam, x, y);

  // ---- schedules
  const goldLaunch = (m: number) => -24 + (tHalf - POUR + 24) * Math.pow(m / (HookX1KobeMakes.length - 1), 0.9);
  const redDrop = (m: number) => -14 + (tHalf - DRIP + 14) * Math.pow(m / (HookX1RaptorMakes.length - 1), 1.05);
  // the flood
  const leanAt = tRap - 9;
  const relAt = (rank: number) => tRap - 1 + rank * 0.19;
  const sqAt = (fr: number) => bell(fr, tHalf - 2, 16);
  const sq = sqAt(f);

  // a pile bulb's place at frame fr: squash on "half", the lean before it tips
  const pileAt = (i: number, fr: number) => {
    const d = HookX1GoldPile[i];
    const b = HookX1PileBase;
    const q = sqAt(fr);
    const tilt = prog(fr, leanAt, 9, ease.in) * 13;
    let x = b.x + (d.x - b.x) * (1 + 0.05 * q);
    let y = b.y - (b.y - d.y) * (1 - 0.1 * q);
    if (tilt > 0) {
      const px = b.x + 60;
      const a = (tilt * Math.PI) / 180;
      const dx = x - px;
      const dy = y - b.y;
      x = px + dx * Math.cos(a) - dy * Math.sin(a);
      y = b.y + dx * Math.sin(a) + dy * Math.cos(a);
    }
    return { x, y, r: d.r };
  };

  // ---- the gold
  const pourGlow = HookX1KobeMakes.reduce((s, _pts, m) => {
    const L = goldLaunch(m);
    return s + (f >= L - 1 ? Math.exp(-(f - L + 1) / 5) : 0);
  }, 0);
  const pileGlow = 1 + 0.9 * sq + 0.4 * bell(f, tMore, 14);
  type GB = { i: number; x: number; y: number; r: number; glow: number; z: number; fx?: number; fy?: number; hop?: number };
  const goldState = (i: number, fr: number): GB | null => {
    const c = camAt(fr);
    const gm = HookX1GoldMake[i];
    const L = goldLaunch(gm.make) + gm.k * 1.5;
    const j = (s: number) => HookX1Rnd(i, s);
    if (fr < L) return null;
    const rank = HookX1ReleaseRank[i];
    const rel = relAt(rank);
    if (fr < L + POUR) {
      const u = (fr - L) / POUR;
      const e = pileAt(i, fr);
      const E = SA(c, e.x, e.y);
      const s0 = { x: BALL.x + (j(1) - 0.5) * 30, y: BALL.y + (j(2) - 0.5) * 16 };
      const H = 70 + 60 * j(3);
      return { i, x: lerp(s0.x, E.x, u), y: lerp(s0.y, E.y, u) - H * 4 * u * (1 - u), r: lerp(8, e.r * c.z, u), glow: 1.3, z: 2 };
    }
    if (fr < rel) {
      const e = pileAt(i, fr);
      const E = SA(c, e.x, e.y);
      const t = fr - L - POUR;
      const hop = 9 * Math.abs(Math.sin((Math.PI * t) / 5)) * Math.exp(-t / 3.5);
      return { i, x: E.x, y: E.y - hop, r: e.r * c.z, glow: pileGlow, z: 1 };
    }
    // the flood: from where it was when it let go to where it comes to rest, slowing, hopping over the boards
    const from = pileAt(i, rel);
    const T = HookX1FloodTargets[rank];
    const dist = Math.hypot(T.x - from.x, T.y - from.y);
    const dur = 15 + dist * 0.045;
    const u = clamp((fr - rel) / dur, 0, 1);
    const k = backOut(u);
    const hopH = (4 + 6 * j(5)) * HookX1Persp(lerp(from.y, T.y, u));
    const hops = 2 + Math.floor(j(6) * 2);
    const hop = hopH * Math.abs(Math.sin(Math.PI * hops * u)) * Math.pow(1 - u, 1.2);
    const after = Math.max(0, fr - rel - dur);
    const settle = 3 * Math.abs(Math.sin((Math.PI * after) / 5)) * Math.exp(-after / 3);
    const gx0 = lerp(from.x, T.x, k);
    const gy0 = lerp(from.y, T.y, k);
    const P = SA(c, gx0, gy0 - hop - settle);
    const F = SA(c, gx0, gy0 + from.r * 0.7);
    const breathe = 1 + 0.22 * Math.sin(fr / 6 + i * 1.7);
    return { i, x: P.x, y: P.y, r: lerp(from.r, T.r, u) * c.z, glow: (1.2 + 0.6 * bell(fr, rel + dur - 2, 10)) * breathe, z: 3, fx: F.x, fy: F.y, hop: (hop + settle) * c.z };
  };
  const goldBulbs = HookX1GoldPile.map((_, i) => goldState(i, f));
  // the flood's streaks: where each rolling bulb was a moment ago
  const trails = goldBulbs.flatMap((b) => {
    if (!b || b.z !== 3) return [];
    return [2, 4, 6].map((d, n) => {
      const p = goldState(b.i, f - d);
      if (!p || Math.hypot(p.x - b.x, p.y - b.y) < 6) return null;
      return { key: `t${b.i}-${n}`, x: p.x, y: p.y, r: p.r * (0.9 - 0.12 * n), a: 0.34 - 0.1 * n };
    }).filter((t): t is { key: string; x: number; y: number; r: number; a: number } => !!t);
  });
  const goldLanded = goldBulbs.filter((b) => b && b.z === 1).length;

  // ---- the red: drips off each Raptor to his feet, then one pile, then buried
  const ringAt = (h: number) => tEntire + Math.round(h * 0.08 * fps);
  const redBulbs = HookX1RedMake.map((rm, n) => {
    const D = redDrop(rm.make) + rm.k * 2;
    if (f < D) return null;
    const jj = HookX1Jerseys[rm.heap];
    const heap = HookX1Heaps[rm.heap][rm.slot];
    const C = HookX1RedPile[n];
    const colAt = tToronto - 3 + n * 0.2;
    const bury = prog(f, tRap + 9 + (C.x - 470) * 0.05, 14, ease.inOut);
    let x: number;
    let y: number;
    let r = heap.r;
    if (f < D + DRIP) {
      const u = (f - D) / DRIP;
      const top = { x: lerp(jj.head.x, jj.feet.x, 0.42) + 4, y: lerp(jj.head.y, jj.feet.y, 0.42) };
      x = lerp(top.x, heap.x, u);
      y = lerp(top.y, heap.y, u * u);
    } else if (f < colAt) {
      const t = f - D - DRIP;
      x = heap.x;
      y = heap.y - 3 * Math.abs(Math.sin((Math.PI * t) / 4)) * Math.exp(-t / 3);
    } else {
      const u = prog(f, colAt, 12, ease.inOut);
      x = lerp(heap.x, C.x, u);
      y = lerp(heap.y, C.y, u) - 26 * Math.sin(Math.PI * u);
      r = lerp(heap.r, C.r, u);
    }
    const glint = 0.6 * bell(f, tThan + (n % 7) * 2, 10) + 0.5 * bell(f, ringAt(rm.heap), 10);
    // buried: pressed into the floor under the gold
    y += r * 1.3 * bury;
    r *= 1 - 0.35 * bury;
    const P = S(x, y);
    return { n, x: P.x, y: P.y, r: r * cam.z, lit: 1 - 0.7 * bury, glow: 1 + glint, alpha: 1 - 0.75 * bury };
  });

  // ---- the half-court line and the halves
  const lineK = prog(f, tOne - 3, 8, ease.inOut);
  const farDim = 0.46 * prog(f, tOne, 9, ease.out);
  const lineGold = bell(f, tRap - 2, 18);
  const L = HookX1Line;
  const lineLen = Math.hypot(L.b.x - L.a.x, L.b.y - L.a.y);
  const flood = prog(f, tRap + 2, 30, ease.out);
  const floorGlow = Math.min(1, 1.4 * flood) * (0.85 + 0.15 * Math.sin(f / 7));
  const front = { x: lerp(470, 560, flood), y: lerp(585, 470, flood) };
  const nearWash = (0.2 * prog(f, tHalf - 2, 10) + 0.14 * bell(f, tThan - 2, 16)) * (1 - prog(f, tRap, 20));
  const nearPool = Math.min(1, goldLanded / 55) * (1 - prog(f, tRap + 4, 20)) * (0.8 + 0.2 * pileGlow);

  // ---- the end: the photo dims away, the dark scoreboard is left for `night`
  // holds the photo through the silence, dimming only as `night` mounts (scene.to - LEAD), so the stage is never left with just the dark board
  const gone = prog(f, Math.max(tEnd + 1, scene.to - 14), 12, ease.inOut);
  const leaveAt = scene.to - 7;
  const lift = 2000 * prog(f, leaveAt, 11, leaveEase(11));

  // overlay geometry: the photo group in source px
  const gx = 540 - cam.cx * cam.z;
  const gy = MIDY - cam.cy * cam.z;
  const sweep = lerp(-0.3, 1.3, prog(f, 0, scene.to, ease.linear));

  // Raptors logo over the five
  const logoC = S(668, 286);
  const logoIn = prog(f, tToronto - 2, 10, backOut);
  const logoHit = bell(f, tRap + 12, 12);
  const kobeRim = 0.25 + 0.75 * bell(f, tKobe - 2, 26) + 0.35 * Math.min(1, pourGlow);

  const KinP = HookX1KobeInPhoto;
  const kpC = { x: (KinP.head.x + KinP.feet.x) / 2, y: (KinP.head.y + KinP.feet.y) / 2 };
  const kpH = KinP.feet.y - KinP.head.y;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - gone }}>
        {/* ---------------- the night photo, its halves, its line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: BAND.top,
            width: 1080,
            height: BAND.bottom - BAND.top,
            overflow: "hidden",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0, #000 36px, #000 calc(100% - 60px), transparent 100%)",
            maskImage: "linear-gradient(180deg, transparent 0, #000 36px, #000 calc(100% - 60px), transparent 100%)",
          }}
        >
          <div style={{ position: "absolute", left: gx, top: gy - BAND.top, width: HookX1Photo.w, height: HookX1Photo.h, transform: `scale(${cam.z})`, transformOrigin: "0 0" }}>
            <Img src={staticFile(HookX1Photo.src)} style={{ position: "absolute", left: 0, top: 0, width: HookX1Photo.w, height: HookX1Photo.h, maxWidth: "none" }} />
            <svg width={HookX1Photo.w} height={HookX1Photo.h} viewBox={`0 0 ${HookX1Photo.w} ${HookX1Photo.h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <defs>
                <filter id="hookx1-soft" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.4" />
                </filter>
                <filter id="hookx1-feather" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="9" />
                </filter>
                <clipPath id="hookx1-farfloor">
                  <polygon points={HookX1FarFloor} />
                </clipPath>
                <radialGradient id="hookx1-glow">
                  <stop offset="0%" stopColor="#FFD36A" stopOpacity="1" />
                  <stop offset="45%" stopColor={HookX1Gold} stopOpacity="0.55" />
                  <stop offset="100%" stopColor={HookX1Gold} stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* the far half dims on "one" (everything beyond the line, stands too) */}
              <polygon points={`0,${461 - 0.2995 * 75} 960,${461 + 0.2995 * 885} 960,0 0,0`} fill="#05080C" opacity={farDim * (1 - 0.35 * flood)} />
              {/* his half: the near half warms on "half" */}
              <polygon points={`0,${461 - 0.2995 * 75} 960,${461 + 0.2995 * 885} 960,720 0,720`} fill="#FFC85A" opacity={nearWash} style={{ mixBlendMode: "soft-light" }} />
              {/* the light pooled under his pile on the near half */}
              <ellipse cx={HookX1PileBase.x} cy={HookX1PileBase.y - 4} rx={150} ry={46} fill="url(#hookx1-glow)" opacity={0.55 * nearPool} style={{ mixBlendMode: "screen" }} />
              {/* the far half's maple glowing gold under the flood */}
              <g clipPath="url(#hookx1-farfloor)" style={{ mixBlendMode: "screen" }} opacity={floorGlow}>
                <ellipse cx={front.x} cy={front.y} rx={70 + 290 * flood} ry={34 + 120 * flood} fill="url(#hookx1-glow)" filter="url(#hookx1-feather)" />
                <ellipse cx={front.x} cy={front.y} rx={40 + 150 * flood} ry={20 + 60 * flood} fill="url(#hookx1-glow)" filter="url(#hookx1-feather)" opacity={0.8} />
              </g>
              {/* the real half-court line, lit white, flashing gold as the pile crosses it */}
              {lineK > 0 && (
                <g>
                  <line x1={L.a.x} y1={L.a.y} x2={L.b.x} y2={L.b.y} stroke={lineGold > 0.05 ? HookX1Gold : "#FFFFFF"} strokeWidth={6} strokeLinecap="round" opacity={0.55 * (1 + lineGold)} filter="url(#hookx1-soft)" strokeDasharray={lineLen} strokeDashoffset={lineLen * (1 - lineK)} />
                  <line x1={L.a.x} y1={L.a.y} x2={L.b.x} y2={L.b.y} stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeDasharray={lineLen} strokeDashoffset={lineLen * (1 - lineK)} />
                </g>
              )}
              {/* the real #8 in the photo, ringed in gold on "once" */}
              {f >= tOnce - 2 && (
                <ellipse cx={kpC.x} cy={kpC.y} rx={kpH * 0.38} ry={kpH * 0.62} fill="none" stroke={HookX1Gold} strokeWidth={2} opacity={prog(f, tOnce - 2, 4, ease.linear) * (1 - 0.5 * prog(f, tOne, 10))} style={{ transformBox: "fill-box", transformOrigin: "center", transform: `scale(${1.6 - 0.6 * prog(f, tOnce - 2, 8, backOut)})` }} />
              )}
              {/* a red ring snaps round each real red jersey, one every 0.08 s */}
              {HookX1Jerseys.map((jj, h) => {
                const at = ringAt(h);
                if (f < at) return null;
                const hgt = jj.feet.y - jj.head.y;
                const c = { x: (jj.head.x + jj.feet.x) / 2, y: (jj.head.y + jj.feet.y) / 2 };
                const k = prog(f, at, 7, backOut);
                const o = prog(f, at, 3, ease.linear) * (1 - 0.45 * prog(f, tRap + 10, 16));
                return (
                  <g key={h} opacity={o} style={{ transformBox: "fill-box", transformOrigin: "center", transform: `scale(${1.7 - 0.7 * k})` }}>
                    <ellipse cx={c.x} cy={c.y} rx={hgt * 0.36} ry={hgt * 0.6} fill="none" stroke={HookX1Red} strokeWidth={5} opacity={0.5} filter="url(#hookx1-soft)" />
                    <ellipse cx={c.x} cy={c.y} rx={hgt * 0.36} ry={hgt * 0.6} fill="none" stroke="#FF2E4F" strokeWidth={2.4} />
                  </g>
                );
              })}
            </svg>
            {/* camera flashes popping in the stands as the gold buries the red */}
            {Array.from({ length: 16 }, (_, n) => {
              const at = tRap + 4 + n * 2.1 + 3 * HookX1Rnd(n, 41);
              const k = bell(f, at, 5);
              if (k <= 0) return null;
              const fx = 40 + 880 * HookX1Rnd(n, 42);
              const fy = 20 + (fx < 560 ? 300 - 0.25 * fx : 210) * HookX1Rnd(n, 43);
              return <div key={`fl${n}`} style={{ position: "absolute", left: fx - 9, top: fy - 9, width: 18, height: 18, borderRadius: "50%", background: "radial-gradient(circle, #FFFFFF 0%, rgba(220,235,255,0.7) 25%, rgba(255,255,255,0) 70%)", opacity: k, mixBlendMode: "screen" }} />;
            })}
            {/* light travelling across the bowl */}
            <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", background: `linear-gradient(105deg, transparent ${(sweep - 0.16) * 100}%, rgba(255,236,200,0.09) ${sweep * 100}%, transparent ${(sweep + 0.16) * 100}%)` }} />
          </div>
          {/* grain, so the 960 px original holds up at this size */}
          <svg width={1080} height={BAND.bottom - BAND.top} style={{ position: "absolute", inset: 0, opacity: 0.1, mixBlendMode: "overlay" }}>
            <filter id="hookx1-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 9} />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#hookx1-grain)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 55% 55%, transparent 58%, rgba(0,0,0,0.42) 100%)" }} />
          {/* the credit and the night */}
          <div style={{ position: "absolute", right: 0, top: 30, padding: "8px 20px 14px 46px", background: "linear-gradient(200deg, rgba(0,0,0,0.62), rgba(0,0,0,0) 80%)", fontFamily: theme.font.ui, fontSize: 22, color: "#C9D1D9" }}>
            endlessbender, CC BY 2.0
          </div>
          {f >= tBryant - 4 && (
            <div style={{ position: "absolute", left: 0, top: 30, padding: "6px 60px 16px 34px", background: "linear-gradient(160deg, rgba(0,0,0,0.62), rgba(0,0,0,0) 80%)", ...blurIn(f, tBryant - 4, { dur: 8, rise: 10 }) }}>
              <div style={{ fontFamily: theme.font.ui, fontSize: 32, fontWeight: 600, color: "#8B949E", letterSpacing: 0.2 }}>January 22, 2006</div>
            </div>
          )}
        </div>

        {/* ---------------- the red, under the gold */}
        {redBulbs.map((b) => (b ? <HookX1Bulb key={`r${b.n}`} x={b.x} y={b.y} r={b.r} color={HookX1Red} lit={b.lit} glow={b.glow} alpha={b.alpha} /> : null))}

        {/* the Raptors logo, bare, landing over the five */}
        {f >= tToronto - 2 && (
          <div
            style={{
              position: "absolute",
              left: logoC.x - 78,
              top: logoC.y - 78 - 90 * (1 - logoIn) + 6 * logoHit,
              width: 156,
              height: 156,
              opacity: prog(f, tToronto - 2, 4, ease.linear) * (1 - 0.35 * prog(f, tRap + 12, 14)),
              transform: `scale(${0.8 + 0.2 * logoIn}) rotate(${(-6 * logoHit).toFixed(2)}deg)`,
              filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.55))",
            }}
          >
            <Img src={staticFile("kobe-81/nba-raptors-primary.svg")} style={{ width: 156, height: 156, objectFit: "contain" }} />
          </div>
        )}

        {/* ---------------- Kobe, front left */}
        <div style={{ position: "absolute", left: KOBE.x, top: KOBE.y + 3 * Math.sin(f / 40), width: KOBE.w * KOBE.s, height: KOBE.h * KOBE.s }}>
          <Img
            src={staticFile(KOBE.src)}
            style={{
              width: KOBE.w * KOBE.s,
              height: KOBE.h * KOBE.s,
              WebkitMaskImage: "linear-gradient(180deg, #000 84%, transparent 100%)",
              maskImage: "linear-gradient(180deg, #000 84%, transparent 100%)",
              filter: `drop-shadow(2px -1px 1px rgba(255,226,160,${(0.35 * kobeRim).toFixed(3)})) drop-shadow(0 0 ${(10 + 10 * kobeRim).toFixed(1)}px rgba(253,185,39,${(0.22 * kobeRim).toFixed(3)}))`,
            }}
          />
        </div>
        {/* the warm light in his hands as each make pours out */}
        <div style={{ position: "absolute", left: BALL.x - 110, top: BALL.y - 110, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,214,110,${(0.42 * Math.min(1.4, pourGlow)).toFixed(3)}), rgba(253,185,39,0) 65%)`, mixBlendMode: "screen", opacity: 1 - prog(f, tHalf, 20) }} />
        {f >= tKobe - 4 && (
          <div style={{ position: "absolute", left: 22, top: 1396, fontFamily: theme.font.ui, fontSize: 22, color: "#C9D1D9", textShadow: "0 1px 6px rgba(0,0,0,0.9)", ...blurIn(f, tKobe - 4, { dur: 8 }) }}>
            Sgt. Joseph A. Lee, USMC, public domain
          </div>
        )}

        {/* ---------------- the gold, on top of everything on the floor */}
        {goldBulbs.map((b) =>
          b && b.z === 3 && b.fx !== undefined && b.fy !== undefined ? (
            <div key={`s${b.i}`} style={{ position: "absolute", left: b.fx - b.r * 1.1, top: b.fy - b.r * 0.35, width: b.r * 2.2, height: b.r * 0.7, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(20,8,0,0.55), rgba(20,8,0,0) 70%)", opacity: clamp(1 - (b.hop ?? 0) / 30, 0.3, 1) }} />
          ) : null,
        )}
        {trails.map((t) => (
          <div key={t.key} style={{ position: "absolute", left: t.x - t.r, top: t.y - t.r, width: t.r * 2, height: t.r * 2, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,226,150,0.9), ${HookX1Gold} 45%, rgba(253,185,39,0) 72%)`, opacity: t.a, filter: "blur(2px)" }} />
        ))}
        {goldBulbs.map((b) => (b ? <HookX1Bulb key={`g${b.i}`} x={b.x} y={b.y} r={b.r} color={HookX1Gold} glow={b.glow} /> : null))}
      </div>

      {/* ---------------- the dark scoreboard, left in place for `night` (held still while the hook lifts off) */}
      {f >= tEnd && f < scene.to + 2 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${lift.toFixed(1)}px)`, opacity: 1 - prog(f, scene.to - 2, 4, ease.linear) }}>
          <div style={{ position: "absolute", inset: 0, ...blurIn(f, tEnd + 6, { dur: 10 }) }}>
            <StaplesNightBoard st={{ power: 0, tor: null, lal: null, period: "1ST", clock: "    ", logoTor: 0, logoLal: 0 }} />
          </div>
        </div>
      )}
    </div>
  );
};
