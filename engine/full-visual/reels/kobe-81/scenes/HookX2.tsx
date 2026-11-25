// Hook 2, dark, 0-4.26 s: "Kobe Bryant once scored more points in one half than the entire Toronto Raptors team."
// A sideline race on the only photo taken at the 81 game (endlessbender), ended by one slam.
// Frame 0: the photo pushing in, Kobe's gold #8 cut-out in front, the photo's real gold sideline band already a row
// of marquee sockets with gold bulbs lit beside him. Kobe: a rim light, a burst of bulbs out of his hands. Bryant: the
// red sockets on the scorer's table edge, under the STAPLES Center lettering, take their first bulb; from here gold
// races two or three at a time toward the far basket, red crawls one at a time. one: the photo's own half-court line
// lights white. half: a small LED clock in the stanchion's style pops up at half court, 2ND HALF 24:00, and runs.
// entire: a red ring snaps round each real red jersey; each peels off the maple like a sticker, leaving its shadow,
// and they line up shoulder to shoulder. Toronto: the Raptors logo lands over them and their five red strings slide
// into one team string. Raptors: gold #8 Kobe springs out of the top, his dunk cut-out swings down and slams the
// photo's rim at the end of the gold track: the photo jolts, the support arm flexes, the clock hits 0.0, the last
// gold bulbs whip up to the rim with a finish flash. Red stops short. Then the photo dims away and leaves `night` its
// dark scoreboard at the top of the stage.
import React from "react";
import { Easing, Img } from "remotion";
import { blurIn, ease, leaveEase, prog, useScene } from "../../../src/engine";
import { StaplesNightBoard } from "./StaplesNightBoard";
import {
  HookX2Asset, HookX2Bulb, HookX2Cable, HookX2Clock, HookX2ClockText, HookX2GOLD, HookX2GOLD_N, HookX2GoldSocket,
  HookX2HALF, HookX2HOT, HookX2PHOTO, HookX2RAPTORS, HookX2RED, HookX2RED_LIT, HookX2RED_N, HookX2RIM, HookX2RING, HookX2RedSocket,
  HookX2Rnd, HookX2STANCHION, HookX2Shadow, HookX2Socket, HookX2Sticker,
} from "./HookX2Kit";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const backOut = Easing.out(Easing.back(1.4));

// the photo card on the stage band (520-1450)
const CARD = { x: 30, y: 548, w: 1020, h: 830, r: 26 };
// the gold #8 cut-out (hookx2-kobe.png, 520 x 829), bottom left in front of the photo
const KOBE = { x: -22, y: 930, w: 330, h: 526 };
// the dunk cut-out (hookx2-dunk.png, 280 x 720), its rim centre at (108, 58) in its own pixels
const DUNK = { w: 280, h: 720, ax: 108, ay: 58, s: 0.84 };
// where the five stickers line up, feet on one line
const LINE = { feet: 1352, xs: [318, 383, 448, 513, 578], s: 2.05 };
const LOGO = { x: 448, y: 1052, d: 124 };

/** gold bulbs lit by frame f: four already burning at frame 0, a burst on "Kobe", then two or three every 10 frames */
function goldLit(f: number, t: { kobe: number; rap: number }) {
  if (f >= t.rap) return Math.min(HookX2GOLD_N, 46 + Math.floor((f - t.rap) * 1.25));
  if (f < t.kobe) return 4;
  const step = Math.floor((f - t.kobe) / 10);
  return Math.min(46, 7 + Math.floor(step * 2.35 + 0.5 * (step % 2)));
}
/** red bulbs lit: from "Bryant", one at a time every 12 frames, stopping at 18 of 24 (41 of 55) */
function redLit(f: number, t: { bryant: number; toronto: number }) {
  if (f < t.bryant) return 0;
  const k = Math.floor((f - t.bryant) / 12) * 12 + t.bryant;
  return Math.min(HookX2RED_LIT, 1 + Math.floor((HookX2RED_LIT - 1) * clamp((k - t.bryant) / (t.toronto + 6 - t.bryant), 0, 1)));
}
/** the frame bulb i of a string lit, given a lit-count function */
function litAt(i: number, count: (fr: number) => number, from: number, to: number) {
  for (let fr = from; fr <= to; fr++) if (count(fr) > i) return fr;
  return Infinity;
}

export const HookX2: React.FC = () => {
  const { f, scene, cue, cueEnd, theme } = useScene();
  const t = {
    kobe: cue("Kobe"), bryant: cue("Bryant"), one: cue("one"), half: cue("half"), entire: cue("entire"),
    toronto: cue("Toronto"), rap: cue("Raptors"), team: cue("team"), end: cueEnd("team"),
  };

  // ---- the camera on the photo: a slow push toward the race, a jolt on the slam
  const push = prog(f, 0, t.end, ease.linear);
  const z = 1.09 + 0.075 * push + 0.01 * prog(f, t.rap, 30, ease.out);
  const fx = clamp(lerp(512, 548, push), CARD.w / 2 / z, HookX2PHOTO.w - CARD.w / 2 / z);
  const fy = clamp(lerp(384, 380, push), CARD.h / 2 / z, HookX2PHOTO.h - CARD.h / 2 / z);
  const ts = f - t.rap;
  const jolt = ts < 0 ? 0 : 20 * Math.exp(-ts / 7) * Math.cos(ts * 0.75);
  const joltR = ts < 0 ? 0 : 0.35 * Math.exp(-ts / 8) * Math.sin(ts * 0.6);
  const wl = CARD.w / 2 - fx * z;
  const wt = CARD.h / 2 - fy * z;
  /** a photo point on the screen */
  const S = (x: number, y: number) => ({ x: CARD.x + wl + x * z, y: CARD.y + wt + y * z + jolt });

  // ---- the strings
  const gl = (fr: number) => goldLit(fr, t);
  const rl = (fr: number) => redLit(fr, t);
  const nGold = gl(f);
  const nRed = rl(f);
  const join = prog(f, t.toronto, 10, ease.inOut);
  const sockIn = (i: number, n: number) => prog(f, -14 + (i / n) * 12, 6, ease.out); // the sockets are laid out just before frame 0
  const goldPts = Array.from({ length: HookX2GOLD_N }, (_, i) => HookX2GoldSocket(i));
  const redPts = Array.from({ length: HookX2RED_N }, (_, j) => HookX2RedSocket(j, join));
  const finish = t.rap + 9; // the last gold bulb reaches the rim
  const finFlash = f < finish ? 0 : Math.exp(-(f - finish) / 9);
  const hold = f >= finish; // the held picture keeps living: a chase runs along the full gold string
  const redShort = f < t.rap + 2 ? 0 : Math.exp(-(f - t.rap - 2) / 14) * (0.5 + 0.5 * Math.cos((f - t.rap - 2) * 0.5));

  // ---- the half-court line and the clock
  const lineK = prog(f, t.one - 3, 9, ease.inOut);
  const lineHot = f < t.one - 3 ? 0 : 0.55 + 0.45 * Math.exp(-(f - t.one - 6) / 12);
  const clockIn = prog(f, t.half - 2, 9, backOut);
  const runK = prog(f, t.half + 6, t.rap - t.half - 6, ease.linear);
  const clockText = f < t.half + 6 ? "24:00" : HookX2ClockText(1440 * (1 - runK));
  const clockZero = f >= t.rap ? Math.exp(-(f - t.rap) / 10) : 0;

  // ---- the five jerseys: ringed, peeled, lined up
  const raptors = HookX2RAPTORS.map((r, i) => {
    const ringAt = t.entire - 2 + i * 3;
    const peelAt = t.entire + 7 + i * 3;
    const flyAt = t.entire + 13 + i * 3;
    const ring = prog(f, ringAt, 7, backOut) * (1 - prog(f, flyAt, 6, ease.in));
    const peel = prog(f, peelAt, 7, ease.out);
    const fly = prog(f, flyAt, 15, ease.inOut);
    const home = S(r.x, r.y);
    const w0 = r.w * z, h0 = r.h * z;
    const w1 = r.w * LINE.s, h1 = r.h * LINE.s;
    const slot = { x: LINE.xs[i] - w1 / 2, y: LINE.feet - h1 };
    const arc = -120 * Math.sin(Math.PI * fly);
    const x = lerp(home.x, slot.x, fly), y = lerp(home.y, slot.y, fly) + arc;
    const w = lerp(w0 * (1 + 0.08 * peel), w1, fly), h = lerp(h0 * (1 + 0.08 * peel), h1, fly);
    const rot = -7 * peel * (1 - fly) + (fly >= 1 ? 1.2 * Math.sin((f - flyAt) / 9 + i) : 0) + 9 * Math.sin(Math.PI * fly) * (i % 2 ? 1 : -1);
    const lifted = peel > 0 ? Math.max(peel, 1 - Math.abs(1 - fly)) : 0;
    return { k: r.k, px: r.x, py: r.y, pw: r.w, ph: r.h, i, ring, ringAt, peel, fly, x, y, w, h, rot, lifted, shown: f >= peelAt, landed: f >= flyAt + 15, home, w0, h0, flyAt };
  });

  // ---- the logo, Kobe, the slam
  const logoIn = prog(f, t.toronto - 3, 11, backOut);
  const logoHit = ts < 0 ? 0 : Math.exp(-ts / 8) * Math.sin(ts * 0.9);
  const kobeRim = 0.2 + 0.8 * Math.exp(-Math.max(0, f - t.kobe) / 22) * prog(f, t.kobe - 4, 5, ease.out);
  const crouch = prog(f, t.rap - 20, 6, ease.out) * (1 - prog(f, t.rap - 13, 4, ease.in));
  const launch = prog(f, t.rap - 13, 10, ease.in);
  const launchV = prog(f, t.rap - 13, 10, ease.in) - prog(f - 1, t.rap - 13, 10, ease.in);
  const kobePush = 1 + 0.035 * push;

  const rim = S(HookX2RIM.x, HookX2RIM.y);
  const drop = prog(f, t.rap - 9, 9, ease.in); // the dunk comes down accelerating, hits on "Raptors"
  const dropPrev = prog(f - 1, t.rap - 9, 9, ease.in);
  const swingDeg = ts < 0 ? lerp(-34, 0, drop) : -17 * (1 - Math.exp(-ts / 9)) + 14 * Math.exp(-ts / 11) * Math.sin(ts * 0.32 + 0.2) + 1.2 * Math.sin(ts / 14);
  const sag = ts < 0 ? 0 : 26 * Math.exp(-ts / 6) * Math.cos(ts * 0.55);
  const dunkY = rim.y - DUNK.ay * DUNK.s + lerp(-700, 0, drop) + sag;
  const dunkX = rim.x - DUNK.ax * DUNK.s + lerp(220, 0, drop);
  const dunkBlur = ts < 0 ? Math.min(14, (drop - dropPrev) * 1100 * 0.05) : 0;
  const flexDeg = ts < 0 ? 0 : -2.2 * Math.exp(-ts / 9) * Math.sin(ts * 0.85 + 0.35);

  // ---- the end: the photo dims away, the dark scoreboard is left for `night`
  const gone = prog(f, t.end + 1, 16, ease.inOut);
  const lift = 2000 * prog(f, scene.to - 7, 11, leaveEase(11));
  const sweep = lerp(-0.35, 1.3, prog(f, 0, t.end, ease.linear));

  // ---- the strings' bulbs, in photo px
  const goldBulbs = goldPts.map((p, i) => {
    if (i >= nGold) return null;
    const at = i < 4 ? -30 : litAt(i, gl, 0, f);
    const flash = Math.exp(-Math.max(0, f - at) / 6) * (f - at < 0 ? 0 : 1);
    const chase = hold ? 0.75 + 0.25 * Math.sin(f * 0.5 - i * 0.7) : 1;
    return <HookX2Bulb key={`g${i}`} x={p.x} y={p.y} r={p.r} color={HookX2GOLD} flash={Math.max(flash, finFlash * 0.8)} glow={chase} />;
  });
  const goldHead = nGold > 0 && f < finish + 6 ? goldPts[Math.min(HookX2GOLD_N - 1, nGold - 1)] : null;
  const redBulbs = redPts.map((p, j) => {
    if (j >= nRed) return null;
    const at = j === 0 ? t.bryant : litAt(j, rl, t.bryant, f);
    const flash = Math.exp(-Math.max(0, f - at) / 6) * (f - at < 0 ? 0 : 1);
    const pulse = join > 0 && join < 1 ? 1 + 0.6 * Math.exp(-Math.abs(j / HookX2RED_N - join) * 8) : 1;
    return <HookX2Bulb key={`r${j}`} x={p.x} y={p.y} r={p.r} color={HookX2RED} flash={flash * 0.8} glow={pulse} />;
  });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* ================= the photo card ================= */}
      <div
        style={{
          position: "absolute", left: CARD.x, top: CARD.y + jolt, width: CARD.w, height: CARD.h, borderRadius: CARD.r, overflow: "hidden",
          background: "#161B22", border: "2px solid #30363D", boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          transform: `rotate(${joltR.toFixed(3)}deg) scale(${(1 - 0.05 * gone).toFixed(4)})`, opacity: 1 - gone,
          filter: gone > 0.01 ? `blur(${(10 * gone).toFixed(1)}px)` : undefined,
        }}
      >
        <div style={{ position: "absolute", left: wl, top: wt, width: HookX2PHOTO.w, height: HookX2PHOTO.h, transform: `scale(${z.toFixed(5)})`, transformOrigin: "0 0" }}>
          <Img src={HookX2Asset("night.jpg")} style={{ position: "absolute", left: 0, top: 0, width: HookX2PHOTO.w, height: HookX2PHOTO.h, maxWidth: "none" }} />

          {/* the support arm, backboard and LED cube flex on the slam */}
          {ts >= 0 && ts < 60 && (
            <div
              style={{
                position: "absolute", left: HookX2STANCHION.x, top: HookX2STANCHION.y, width: HookX2STANCHION.w, height: HookX2STANCHION.h, overflow: "hidden",
                transform: `rotate(${flexDeg.toFixed(3)}deg)`, transformOrigin: `${HookX2STANCHION.px - HookX2STANCHION.x}px ${HookX2STANCHION.py - HookX2STANCHION.y}px`,
                WebkitMaskImage: "radial-gradient(ellipse 62% 58% at 55% 45%, #000 62%, transparent 100%)",
              }}
            >
              <Img src={HookX2Asset("night.jpg")} style={{ position: "absolute", left: -HookX2STANCHION.x, top: -HookX2STANCHION.y, width: HookX2PHOTO.w, height: HookX2PHOTO.h, maxWidth: "none" }} />
            </div>
          )}

          {/* the shadows the peeled jerseys leave on the maple */}
          {raptors.map((r) => (
            <HookX2Shadow key={`s${r.k}`} k={r.k} x={r.px} y={r.py} w={r.pw} h={r.ph} o={r.peel} />
          ))}
          {/* Kobe on this very floor: a gold ring round the white #8 in the photo */}
          {(() => {
            const k = prog(f, t.kobe - 2, 9, backOut) * (1 - prog(f, t.one - 8, 10, ease.in));
            return k > 0.01 ? (
              <div style={{ position: "absolute", left: 556 - 24, top: 414 - 40, width: 48, height: 80, borderRadius: "50%", border: `2.6px solid ${HookX2GOLD}`, boxShadow: `0 0 10px ${HookX2GOLD}`, opacity: k, transform: `scale(${(1.6 - 0.6 * Math.min(1, k)).toFixed(3)})` }} />
            ) : null;
          })()}

          {/* the half-court line, lit white end to end on "one" */}
          {lineK > 0 && (
            <svg width={HookX2PHOTO.w} height={HookX2PHOTO.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <line x1={HookX2HALF.a.x} y1={HookX2HALF.a.y} x2={lerp(HookX2HALF.a.x, HookX2HALF.b.x, lineK)} y2={lerp(HookX2HALF.a.y, HookX2HALF.b.y, lineK)} stroke="#FFF4DC" strokeWidth={12} strokeLinecap="round" opacity={0.5 * lineHot} style={{ filter: "blur(5px)" }} />
              <line x1={HookX2HALF.a.x} y1={HookX2HALF.a.y} x2={lerp(HookX2HALF.a.x, HookX2HALF.b.x, lineK)} y2={lerp(HookX2HALF.a.y, HookX2HALF.b.y, lineK)} stroke="#FFFFFF" strokeWidth={3.4} strokeLinecap="round" opacity={0.98 * lineHot} />
            </svg>
          )}

          {/* the strings: cables, sockets, bulbs */}
          <HookX2Cable pts={goldPts} color="rgba(40,30,10,0.85)" w={1.4} />
          <HookX2Cable pts={redPts} color="rgba(50,12,10,0.85)" w={1.2} />
          {goldPts.map((p, i) => (
            <HookX2Socket key={`gs${i}`} x={p.x} y={p.y} r={p.r} tint={HookX2GOLD} dim={0.1 * sockIn(i, HookX2GOLD_N)} />
          ))}
          {redPts.map((p, j) => (
            <HookX2Socket key={`rs${j}`} x={p.x} y={p.y} r={p.r} tint={HookX2RED} dim={j >= HookX2RED_LIT ? 0.12 + 0.5 * redShort : 0.12} />
          ))}
          {redBulbs}
          {goldBulbs}
          {goldHead && (
            <div style={{ position: "absolute", left: goldHead.x - 16, top: goldHead.y - 16, width: 32, height: 32, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,250,230,0.95) 0%, ${HookX2HOT} 25%, rgba(253,185,39,0) 70%)`, opacity: 0.6 + 0.4 * Math.sin(f * 0.9), mixBlendMode: "screen" }} />
          )}

        </div>

        {/* light travelling across the bowl, grain, a vignette, the credit */}
        <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", background: `linear-gradient(105deg, transparent ${((sweep - 0.18) * 100).toFixed(1)}%, rgba(255,236,200,0.09) ${(sweep * 100).toFixed(1)}%, transparent ${((sweep + 0.18) * 100).toFixed(1)}%)` }} />
        <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", inset: 0, opacity: 0.1, mixBlendMode: "overlay" }}>
          <filter id="hookx2-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 9} />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hookx2-grain)" />
        </svg>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 52%, transparent 58%, rgba(0,0,0,0.34) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: 0.16 * (ts >= 0 ? Math.exp(-ts / 4) : 0), mixBlendMode: "screen" }} />
        <div style={{ position: "absolute", right: 0, top: 0, padding: "10px 16px 18px 40px", background: "linear-gradient(200deg, rgba(0,0,0,0.6), rgba(0,0,0,0) 80%)", fontFamily: theme.font.ui, fontSize: 22, color: "#C9D1D9" }}>
          endlessbender, CC BY 2.0
        </div>
      </div>

      {/* ================= the screen layer: rings, stickers, logo, clock, Kobe ================= */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - gone, filter: gone > 0.01 ? `blur(${(10 * gone).toFixed(1)}px)` : undefined, transform: `scale(${(1 - 0.05 * gone).toFixed(4)})` }}>
        {/* the red rings, on the jerseys where they stand */}
        {raptors.map((r) => {
          if (r.ring <= 0.01) return null;
          const c = S(r.px + r.pw / 2, r.py + r.ph / 2);
          const rw = r.w0 * 1.3 + 26, rh = r.h0 * 1.08 + 22;
          const sc = 1.5 - 0.5 * prog(f, r.ringAt, 7, backOut);
          return (
            <div key={`ring${r.k}`} style={{ position: "absolute", left: c.x - rw / 2, top: c.y - rh / 2, width: rw, height: rh, borderRadius: "50%", border: `4px solid ${HookX2RING}`, boxShadow: `0 0 14px rgba(206,17,65,0.75), inset 0 0 10px rgba(206,17,65,0.4)`, opacity: r.ring, transform: `scale(${sc.toFixed(3)})` }} />
          );
        })}

        {/* the Raptors logo, bare, over the lined-up five */}
        {logoIn > 0.01 && (
          <div style={{ position: "absolute", left: LOGO.x - LOGO.d / 2, top: LOGO.y - LOGO.d / 2 - 90 * (1 - logoIn) + 6 * logoHit, width: LOGO.d, height: LOGO.d, opacity: Math.min(1, logoIn * 2), transform: `scale(${(0.7 + 0.3 * logoIn).toFixed(3)}) rotate(${(4 * logoHit).toFixed(2)}deg)`, filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.6))" }}>
            <Img src={HookX2Asset("raptors.svg")} style={{ width: LOGO.d, height: LOGO.d }} />
          </div>
        )}

        {/* the five stickers */}
        {raptors.map((r) =>
          r.shown ? (
            <HookX2Sticker
              key={`st${r.k}`} k={r.k} w={r.w} h={r.h} edge={Math.min(1, r.peel * 1.2)} lift={r.landed ? 0.55 : 0.4 + 0.6 * Math.sin(Math.PI * r.fly) + 0.4 * r.peel * (1 - r.fly)}
              style={{ left: r.x, top: r.y + (r.landed ? 2 * Math.sin((f - r.flyAt) / 8 + r.i) + 5 * logoHit * (r.i === 2 ? 1 : 0.6) : 0), transform: `rotate(${r.rot.toFixed(2)}deg)`, transformOrigin: "50% 100%" }}
            />
          ) : null,
        )}

        {/* the clock at half court, on the scorer's table */}
        {clockIn > 0.01 && (
          (() => {
            const c = S(HookX2HALF.b.x + 22, HookX2HALF.b.y + 44);
            const w = 176;
            return (
              <div style={{ position: "absolute", left: c.x - w / 2, top: c.y - w * 0.23 + 3 * Math.sin(Math.max(0, ts) * 1.1) * clockZero, opacity: Math.min(1, clockIn * 1.6), transform: `scale(${(0.5 + 0.5 * clockIn).toFixed(3)})` }}>
                <HookX2Clock text={clockText} power={1 + 0.8 * clockZero} w={w} label={1} />
              </div>
            );
          })()
        )}

        <div style={{ position: "absolute", left: 0, top: 520, width: 1080, height: 1400, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: -520, width: 1080, height: 1920 }}>
        {/* Kobe, gold #8: in front from frame 0, leaps toward the rim before the slam */}
        {launch < 1 && (
          <div
            style={{
              position: "absolute", left: KOBE.x + 560 * launch, top: KOBE.y + 14 * crouch - 640 * launch, width: KOBE.w, height: KOBE.h,
              opacity: 1 - prog(f, t.rap - 6, 4, ease.linear),
              transform: `scale(${(kobePush * (1 - 0.5 * launch)).toFixed(4)}, ${(kobePush * (1 - 0.035 * crouch - 0.44 * launch)).toFixed(4)}) rotate(${(14 * launch).toFixed(2)}deg)`, transformOrigin: "50% 100%",
              filter: `drop-shadow(0 0 ${(5 * kobeRim).toFixed(1)}px rgba(255,214,120,${(0.9 * kobeRim).toFixed(2)}))${launchV > 0.02 ? ` blur(${Math.min(10, launchV * 60).toFixed(1)}px)` : ""}`,
            }}
          >
            <div style={{ position: "absolute", left: -60, top: -40, width: KOBE.w + 120, height: KOBE.h * 0.8, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(253,185,39,${(0.38 * kobeRim + 0.1).toFixed(3)}) 0%, rgba(253,185,39,0) 65%)` }} />
            <Img src={HookX2Asset("kobe.png")} style={{ width: KOBE.w, height: KOBE.h }} />
          </div>
        )}
        <div style={{ position: "absolute", left: 22, top: 1404, fontFamily: theme.font.ui, fontSize: 22, color: "#8B949E", opacity: 1 - prog(f, t.rap - 13, 8, ease.linear), textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
          Sgt. Joseph A. Lee, USMC, public domain
        </div>

        {/* the slam: Kobe's dunk cut-out swings down out of the top and hangs on the photo's rim */}
        {f >= t.rap - 10 && (
          <div
            style={{
              position: "absolute", left: dunkX, top: dunkY, width: DUNK.w * DUNK.s, height: DUNK.h * DUNK.s,
              transform: `rotate(${swingDeg.toFixed(2)}deg)`, transformOrigin: `${DUNK.ax * DUNK.s}px ${DUNK.ay * DUNK.s}px`,
              filter: `drop-shadow(0 24px 26px rgba(0,0,0,0.6))${dunkBlur > 0.5 ? ` blur(${dunkBlur.toFixed(1)}px)` : ""}`,
            }}
          >
            <Img src={HookX2Asset("dunk.png")} style={{ width: DUNK.w * DUNK.s, height: DUNK.h * DUNK.s }} />
          </div>
        )}
        </div>
        </div>
        {f >= t.rap && (
          <div style={{ position: "absolute", right: 30, top: 1404, fontFamily: theme.font.ui, fontSize: 22, color: "#8B949E", ...blurIn(f, t.rap + 2, { dur: 8 }), textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
            Cpl. Megan Stiner, USMC, public domain
          </div>
        )}
        {/* the finish: a gold-white burst at the rim as the last bulb lands */}
        {finFlash > 0.01 && (
          <div style={{ position: "absolute", left: rim.x - 110, top: rim.y - 110, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,226,140,0.7) 20%, rgba(253,185,39,0) 68%)", opacity: finFlash, transform: `scale(${(0.5 + 1.3 * (1 - finFlash)).toFixed(3)})`, mixBlendMode: "screen" }} />
        )}
        {/* the impact at the rim: sparks thrown off */}
        {ts >= 0 && ts < 22 &&
          Array.from({ length: 16 }, (_, i) => {
            const a = -Math.PI * (0.1 + 0.8 * HookX2Rnd(i, 3));
            const v = 9 + 14 * HookX2Rnd(i, 4);
            const d = v * ts * Math.exp(-ts / 10);
            const s = 3 + 4 * HookX2Rnd(i, 5);
            return <div key={`sp${i}`} style={{ position: "absolute", left: rim.x + d * Math.cos(a) * 1.4, top: rim.y + d * Math.sin(a) + 0.4 * ts * ts * 0.15, width: s, height: s, borderRadius: "50%", background: i % 3 ? HookX2HOT : "#fff", boxShadow: `0 0 8px ${HookX2GOLD}`, opacity: 1 - ts / 22 }} />;
          })}
      </div>

      {/* ================= the dark scoreboard, left in place for `night` (held still while the hook lifts off) ================= */}
      {f >= t.end && (
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${lift.toFixed(1)}px)` }}>
          <div style={{ position: "absolute", inset: 0, ...blurIn(f, t.end + 6, { dur: 10 }) }}>
            <StaplesNightBoard st={{ power: 0, tor: null, lal: null, period: "1ST", clock: "    ", logoTor: 0, logoLal: 0 }} />
          </div>
        </div>
      )}
    </div>
  );
};
