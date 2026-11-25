// split, dark, 9.60-17.29 s: "But Shaq was the exception, because near the rim he was a seven foot one wrecking
// ball, and at the free throw line he was a coin flip."
// The court from `backwards` (same camera) holds the two +1s it paid. Shaq: the Lakers cut-out rises onto the line.
// exception: the +1s hit his shoulder, stop dead and fall off him. because: he steps left, a tall photo card opens.
// rim: Keith Allison's dunk photo fills it. seven foot one: a tape rises beside him, 0'0" to 7'1". wrecking: the photo
// takes the impact. and at the free throw line: he leaves, the card widens and tears down the middle; the empty line
// slides into the right half. coin: the real 2006 quarter is flicked up and spins. flip: heads, tails, heads, hanging.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { arrive, blurHold, ease, leave, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { SplitRimCoinCourt, SplitRimCoinRnd } from "./SplitRimCoinCourt";
import { SplitRimCoinCoin } from "./SplitRimCoinCoin";

const SHAQ = staticFile("shaq-free-throws/splitrimcoin-shaq-lakers.png");
const DUNK = staticFile("shaq-free-throws/splitrimcoin-dunk.jpg");
const SHAQ_AR = 719 / 2327;
const FONT = "Inter, sans-serif";
const GREY = "#8B949E";
const HAIR = "#30363D";
const CARD = "#161B22";
const SHADOW = "0 2px 10px rgba(0,0,0,0.6)";

// the card: before the tear it spans CL..CR; the tear runs down TX
const CT = 560, CB = 1420;
const TX = 548;
const HALF_R = { l: 562, r: 1020 };

/** the torn edge: a jagged vertical line, deterministic, as points (x offset, y) from top to bottom */
function SplitRimCoinTearPts(h: number, seed: number) {
  const out: [number, number][] = [];
  let x = 0;
  for (let y = 0; y <= h; y += 9) {
    x = x * 0.55 + (SplitRimCoinRnd(y, seed) - 0.5) * 16 + Math.sin(y * 0.021) * 3;
    out.push([x, y]);
  }
  return out;
}
const TEAR = SplitRimCoinTearPts(CB - CT, 5);

function useSplitRimCoinTimes() {
  const { cue, cueEnd, scene } = useScene();
  return {
    in: scene.from - LEAD,
    but: cue("But"),
    shaq: cue("Shaq"),
    exception: cue("exception"),
    because: cue("because"),
    rim: cue("rim"),
    seven: cue("seven"),
    one: cue("one"),
    wrecking: cue("wrecking"),
    ball: cue("ball"),
    and: cue("and"),
    free: cue("free"),
    line: cue("line"),
    coin: cue("coin"),
    flip: cue("flip"),
    flipEnd: cueEnd("flip"),
    end: scene.to,
  };
}
type T = ReturnType<typeof useSplitRimCoinTimes>;

/** where Shaq stands: feet centre x, feet y, height */
function shaqPose(t: T, f: number) {
  const step = prog(f, t.because - 2, 20, ease.inOut);
  const x = 540 + (178 - 540) * step;
  const feet = 1398 + (1420 - 1398) * step;
  const h = 700 + (760 - 700) * step;
  const rise = 1 - arrive(f, t.shaq - 6, 16);
  const out = leave(f, t.and, 13);
  return { x: x - out * 520, feet: feet + rise * 380, h, op: prog(f, t.shaq - 6, 6, ease.linear), blur: blurHold(f, t.shaq - 6, 6, 12) * 8 + out * 10 };
}

/** the coin's spin angle about its horizontal axis: lying flat on the line, flicked up on "coin", slowing so the
 *  faces read, landing frontal (heads) as "flip" ends */
function coinAngle(t: T, f: number) {
  const rate = (k: number) => (k < t.coin ? 0 : k < t.coin + 12 ? 34 : 4 + 30 * Math.exp(-(k - t.coin - 12) / 8));
  const A = (k: number) => { let s = 0; for (let i = t.coin; i < k; i++) s += rate(i); return s; };
  const at = t.flipEnd;
  const base = 53; // lying flat on the boards, seen from the shooter's eye
  const corr = (((-(base + A(at))) % 360) + 360) % 360;
  return base + A(f) + corr * prog(f, t.coin, at - t.coin, ease.inOut);
}

const SplitRimCoinPlusOne: React.FC<{ x: number; y: number; rot: number; op: number; s?: number }> = ({ x, y, rot, op, s = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: op, fontFamily: FONT, fontWeight: 800, fontSize: 76, color: "#FFFFFF", letterSpacing: -2, textShadow: "0 4px 18px rgba(0,0,0,0.55)" }}>
    +1
  </div>
);

export const SplitRimCoin: React.FC = () => {
  const { f, scene } = useScene();
  const t = useSplitRimCoinTimes();

  // ---- 1. the court and Shaq on the line -------------------------------------------------------------
  const zoom = 1 + 0.2 * prog(f, t.but - 4, 40, ease.inOut) + 0.0006 * Math.max(0, f - t.but);
  const courtDim = 1 - 0.62 * prog(f, t.because, 18, ease.inOut);
  const courtGone = prog(f, t.and, 16, ease.in);
  const pose = shaqPose(t, f);
  const sw = pose.h * SHAQ_AR;
  // chest point on the cut-out (his left shoulder, toward camera right)
  const chest = { x: pose.x - sw / 2 + sw * 0.7, y: pose.feet - pose.h + pose.h * 0.27 };

  // the +1s: hang where the bug paid them, then fly at his shoulder, stop dead, fall off him
  const plus = [0, 1].map((i) => {
    const hang = { x: 690 + i * 150, y: 640 + i * 20 + Math.sin(f * 0.08 + i) * 6 };
    const hit = t.exception + i * 3;
    const go = t.exception - 14 + i * 3;
    const target = { x: chest.x + 34 + i * 26, y: chest.y + i * 64 };
    if (f < go) return { x: hang.x, y: hang.y, rot: -4 + i * 6, op: prog(f, t.in, 8, ease.linear), s: 1 };
    if (f < hit) {
      const k = prog(f, go, hit - go, ease.in);
      return { x: hang.x + (target.x - hang.x) * k, y: hang.y + (target.y - hang.y) * k - Math.sin(k * Math.PI) * 60, rot: -4 + i * 6 - 10 * k, op: 1, s: 1 + 0.08 * k };
    }
    const s = (f - hit) / 60;
    const vx = 230 + i * 90, vy = -380 + i * 60, g = 2600;
    return { x: target.x + vx * s, y: target.y + vy * s + 0.5 * g * s * s, rot: -14 + (i ? 1 : -1) * 420 * s, op: 1 - prog(f, hit + 18, 14, ease.linear), s: 1.08 - 0.25 * Math.min(1, s * 2) };
  });
  const impact = [0, 1].map((i) => prog(f, t.exception + i * 3, 16, ease.out));
  const jolt = f >= t.exception && f < t.exception + 8 ? Math.sin((f - t.exception) * 2.2) * 3 * (1 - (f - t.exception) / 8) : 0;

  // ---- 2. the card and the dunk -------------------------------------------------------------------------
  const open = arrive(f, t.because + 2, 18);
  const widen = arrive(f, t.and, 14);
  // the card keeps the photo's own shape (680 x 860) and slides left until its rim side meets the tear line;
  // the stage's left edge (x 60) crops it, so the rim and his face stay in the left half
  const CL = 330 + (-80 - 330) * widen;
  const CR = CL + 680;
  const photoIn = prog(f, t.rim - 4, 10, ease.out);
  const shake = f >= t.wrecking ? Math.exp(-(f - t.wrecking) / 9) : 0;
  const shx = Math.sin((f - t.wrecking) * 1.9) * 16 * shake;
  const shy = Math.cos((f - t.wrecking) * 2.6) * 9 * shake;
  const punch = f >= t.wrecking ? 0.06 * Math.sin(Math.min(1, (f - t.wrecking) / 10) * Math.PI) : 0;
  const push = 1 + 0.1 * prog(f, t.rim, t.and - t.rim, ease.inOut) + 0.05 * prog(f, t.and, scene.to - t.and, ease.linear) + punch;
  // the tear
  const tearRun = prog(f, t.free - 6, 12, ease.inOut); // the crack runs top to bottom
  const peel = prog(f, t.free + 6, 20, ease.in); // the right piece goes
  const halfIn = arrive(f, t.and + 10, 22);

  // ---- 3. the tape --------------------------------------------------------------------------------------
  const tapeK = prog(f, t.one - 34, 34, ease.inOut);
  const inches = Math.round(85 * tapeK);
  const tapeOp = prog(f, t.seven - 8, 8, ease.linear) * (1 - leave(f, t.and, 12));
  const tapeShiver = shake * Math.sin(f * 3.1) * 4;

  // ---- 4. the coin ---------------------------------------------------------------------------------------
  const rx = coinAngle(t, f);
  const up = prog(f, t.coin, 20, ease.outHard);
  const bob = f > t.coin + 20 ? Math.sin((f - t.coin - 20) * 0.09) * 7 : 0;

  // the photo card's frame, in stage px
  const cardH = (CB - CT) * open;
  const cardTop = (CT + CB) / 2 - cardH / 2;

  const tearPoly = (side: "L" | "R", base: number, top: number, w: number) => {
    // a polygon in the card's own px: the left part keeps everything left of the tear, the right part the rest
    const edge = TEAR.map(([dx, y]) => `${(base + dx).toFixed(1)}px ${(y - top).toFixed(1)}px`);
    return side === "L" ? `polygon(0px 0px, ${edge.join(", ")}, 0px ${CB - CT}px)` : `polygon(${w}px 0px, ${edge.join(", ")}, ${w}px ${CB - CT}px)`;
  };

  const cardW = CR - CL;
  const tearLocal = TX - CL;
  const tornL = f >= t.free - 6;

  const fibres = TEAR.filter((_, i) => i % 2 === 0).map(([dx, y], i) => {
    const len = 4 + SplitRimCoinRnd(i, 21) * 10;
    const a = (SplitRimCoinRnd(i, 22) - 0.5) * 1.6;
    return { x: dx, y, x2: dx + Math.cos(a) * len, y2: y + Math.sin(a) * len };
  });

  return (
    <AbsoluteFill>
      {/* ---- the court ---- */}
      <AbsoluteFill style={{ opacity: courtDim * (1 - courtGone) * prog(f, t.in, 6, ease.linear), filter: `blur(${(6 * (1 - courtDim) / 0.62).toFixed(2)}px)`, transform: `scale(${zoom.toFixed(4)})`, transformOrigin: "540px 1250px" }}>
        <SplitRimCoinCourt f={f} id="src-a" sweep={(f - t.in) / 260} />
      </AbsoluteFill>

      {/* ---- the right half: the empty free throw line, from behind the shooter ---- */}
      {f >= t.and + 10 && (
        <div style={{ position: "absolute", left: HALF_R.l + (1 - halfIn) * 520, top: CT, width: HALF_R.r - HALF_R.l, height: CB - CT, opacity: prog(f, t.and + 10, 6, ease.linear), filter: `blur(${(blurHold(f, t.and + 10, 4, 12) * 6).toFixed(2)}px)` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden", background: "#0A0E14", clipPath: `polygon(${HALF_R.r - HALF_R.l}px 0px, ${TEAR.map(([dx, y]) => `${(dx + 14).toFixed(1)}px ${y}px`).join(", ")}, ${HALF_R.r - HALF_R.l}px ${CB - CT}px)` }}>
            {/* the court, the same camera, framed on the line */}
            <div style={{ position: "absolute", left: -(540 - (HALF_R.r - HALF_R.l) / 2), top: -620 + 40, width: 1080, height: 1920, transform: `scale(${(1.3 + 0.05 * prog(f, t.free, scene.to - t.free, ease.linear)).toFixed(4)})`, transformOrigin: "540px 1344px" }}>
              <SplitRimCoinCourt f={f} id="src-b" stands={0.8} />
            </div>
            {/* the arena light: one cone on the line */}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 34% at 50% 82%, rgba(255,240,210,0.22), rgba(255,240,210,0) 70%), linear-gradient(180deg, rgba(10,14,20,0.55) 0%, rgba(10,14,20,0) 40%, rgba(10,14,20,0) 70%, rgba(10,14,20,0.6) 100%)" }} />
            <div style={{ position: "absolute", left: "50%", top: 0, width: 520, height: CB - CT, transform: "translateX(-50%)", background: "linear-gradient(180deg, rgba(255,244,220,0.10), rgba(255,244,220,0.02))", clipPath: "polygon(42% 0%, 58% 0%, 92% 100%, 8% 100%)" }} />
            {/* the coin's shadow on the boards */}
            {(() => {
              const lineY = 724 + 40;
              const r = 120 * (1 - 0.55 * up);
              return <div style={{ position: "absolute", left: (HALF_R.r - HALF_R.l) / 2 - r, top: lineY + 26 - r * 0.18, width: r * 2, height: r * 0.36, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,0.55), rgba(0,0,0,0))", opacity: 1 - 0.5 * up }} />;
            })()}
            {/* the coin */}
            {/* the next scene picks the quarter up as it mounts (LEAD): hand it over, never two quarters at once */}
            <div style={{ position: "absolute", left: (HALF_R.r - HALF_R.l) / 2, top: 724 + 40 - 6 - up * 330 + bob, perspective: 1100, opacity: f >= scene.to - LEAD ? 0 : 1 }}>
              <SplitRimCoinCoin d={210} rx={rx} ry={Math.sin(f * 0.05) * 10 * up} rz={-8 + 6 * Math.sin(f * 0.04)} />
            </div>
            <div style={{ position: "absolute", inset: 0, borderRadius: 28, border: `1px solid ${HAIR}`, clipPath: "inset(0 0 0 30px)" }} />
          </div>
          <svg width={60} height={CB - CT} style={{ position: "absolute", left: -20, top: 0, overflow: "visible" }}>
            <polyline points={TEAR.map(([dx, y]) => `${(dx + 34).toFixed(1)},${y}`).join(" ")} fill="none" stroke="#F3EFE6" strokeWidth={4} strokeLinejoin="round" />
            {fibres.map((b, i) => (
              <line key={i} x1={b.x + 34} y1={b.y} x2={34 + b.x - (b.x2 - b.x) - 2} y2={b.y2} stroke="#F3EFE6" strokeWidth={1} strokeOpacity={0.7} />
            ))}
          </svg>
          <div style={{ position: "absolute", right: 24, top: 20, textAlign: "right", fontFamily: FONT, fontWeight: 500, fontSize: 20, lineHeight: 1.3, color: "#C9D1D9", opacity: 0.85, textShadow: SHADOW }}>
            US Mint, public domain
            <br />
            Edmoral000, CC BY-SA 4.0
          </div>
        </div>
      )}

      {/* ---- the photo card ---- */}
      {f >= t.because && (
        <div style={{ position: "absolute", left: 60, top: cardTop - 200, width: 1600, height: cardH + 400, clipPath: `inset(186px -600px 186px 0px round 34px)` }}>
        <div style={{ position: "absolute", left: CL + shx - 60, top: 200 + shy, width: cardW, height: cardH }}>
          {/* left part (or the whole card before the tear) */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden", background: CARD, boxShadow: "0 30px 80px rgba(0,0,0,0.5)", clipPath: tornL ? tearPoly("L", tearLocal, 0, cardW) : undefined }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.32 + 0.68 * photoIn, filter: photoIn < 1 ? `blur(${(10 * (1 - photoIn)).toFixed(2)}px) brightness(${(0.55 + 0.45 * photoIn).toFixed(3)})` : undefined, transform: `scale(${push.toFixed(4)})`, transformOrigin: "78% 8%" }}>
              <Img src={DUNK} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%" }} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, background: "linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0))", opacity: photoIn }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: 28, border: `1px solid ${HAIR}` }} />
          </div>
          {/* the right piece of the photo, peeling away after the tear */}
          {tornL && peel < 1 && (
            <div style={{ position: "absolute", inset: 0, transform: `translate(${(peel * 640).toFixed(1)}px, ${(peel * peel * 260).toFixed(1)}px) rotate(${(peel * 14).toFixed(2)}deg)`, transformOrigin: `${tearLocal}px 0px`, opacity: 1 - prog(f, t.free + 18, 8, ease.linear) }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden", background: CARD, clipPath: tearPoly("R", tearLocal + 6, 0, cardW) }}>
                <div style={{ position: "absolute", inset: 0, transform: `scale(${push.toFixed(4)})`, transformOrigin: "78% 8%" }}>
                  <Img src={DUNK} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%" }} />
                </div>
              </div>
            </div>
          )}
          {/* the torn paper core: white, with loose fibres, drawn as far as the crack has run */}
          {tornL && (
            <svg width={cardW + 40} height={CB - CT} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", clipPath: `inset(0px -40px ${((1 - tearRun) * (CB - CT)).toFixed(1)}px -40px)` }}>
              <polyline points={TEAR.map(([dx, y]) => `${(tearLocal + dx).toFixed(1)},${y}`).join(" ")} fill="none" stroke="#F3EFE6" strokeWidth={5} strokeLinejoin="round" />
              <polyline points={TEAR.map(([dx, y]) => `${(tearLocal + dx + 3).toFixed(1)},${y}`).join(" ")} fill="none" stroke="#D9D2C3" strokeWidth={2} />
              {fibres.map((b, i) => (
                <line key={i} x1={tearLocal + b.x + 2} y1={b.y} x2={tearLocal + b.x2 + 4} y2={b.y2} stroke="#F3EFE6" strokeWidth={1} strokeOpacity={0.8} />
              ))}
            </svg>
          )}
          {/* the credit, top right inside the photo */}
          <div style={{ position: "absolute", right: tornL ? cardW - tearLocal + 44 : 26, top: 22, fontFamily: FONT, fontWeight: 500, fontSize: 22, color: "#C9D1D9", opacity: 0.88 * photoIn, textShadow: SHADOW, whiteSpace: "nowrap" }}>
            Keith Allison, CC BY-SA 2.0
          </div>
        </div>
        </div>
      )}

      {/* impact specks off the rim on "wrecking" */}
      {f >= t.wrecking && f < t.wrecking + 50 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 46 }, (_, i) => {
            const s = (f - t.wrecking) / 60;
            const a = -Math.PI * (0.1 + 0.8 * SplitRimCoinRnd(i, 31));
            const v = 300 + 700 * SplitRimCoinRnd(i, 32);
            const ox = CL + cardW * 0.8, oy = CT + 110;
            const x = ox + Math.cos(a) * v * s, y = oy + Math.sin(a) * v * s + 0.5 * 1800 * s * s;
            return <circle key={i} cx={x} cy={y} r={1.5 + 2.5 * SplitRimCoinRnd(i, 33)} fill={SplitRimCoinRnd(i, 34) > 0.6 ? "#F3E3C3" : "#FFFFFF"} opacity={(1 - s / 0.83) * 0.9} />;
          })}
        </svg>
      )}

      {/* ---- Shaq, the same Lakers cut-out ---- */}
      {f >= t.shaq - 6 && pose.x > -300 && (
        <div style={{ position: "absolute", left: pose.x - sw / 2 + jolt, top: pose.feet - pose.h, width: sw, height: pose.h, opacity: pose.op, filter: pose.blur > 0.3 ? `blur(${pose.blur.toFixed(2)}px)` : undefined }}>
          {/* contact shadow on the boards */}
          <div style={{ position: "absolute", left: -sw * 0.15, top: pose.h - 26, width: sw * 1.45, height: 46, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,0.7), rgba(0,0,0,0))" }} />
          <Img src={SHAQ} style={{ position: "absolute", left: 0, top: 0, width: sw, height: pose.h, filter: "drop-shadow(0 0 1px rgba(0,0,0,0.6)) contrast(1.04) saturate(0.96)" }} />
        </div>
      )}

      {/* the hit: two white rings where each +1 stops dead */}
      {impact.map((k, i) => (k > 0 && k < 1 ? (
        <div key={i} style={{ position: "absolute", left: chest.x + 34 + i * 26, top: chest.y + i * 64, width: 0, height: 0 }}>
          <div style={{ position: "absolute", left: -60 * k - 20, top: -60 * k - 20, width: (60 * k + 20) * 2, height: (60 * k + 20) * 2, borderRadius: "50%", border: `${(4 * (1 - k)).toFixed(2)}px solid rgba(255,255,255,${(0.9 * (1 - k)).toFixed(3)})` }} />
        </div>
      ) : null))}
      {plus.map((p, i) => (f < t.exception + 40 ? <SplitRimCoinPlusOne key={i} x={p.x} y={p.y} rot={p.rot} op={p.op} s={p.s} /> : null))}

      {/* the tape: floor to the top of his head, 0'0" to 7'1" */}
      {f >= t.seven - 8 && tapeOp > 0 && (() => {
        const base = pose.feet, top = pose.feet - pose.h;
        const x = 44 - leave(f, t.and, 12) * 300 + tapeShiver;
        const yTop = base - (base - top) * tapeK;
        const perIn = (base - top) / 85;
        return (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: tapeOp }}>
            <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
              <rect x={x - 3} y={yTop} width={22} height={base - yTop} fill="#E8E2CF" opacity={0.95} />
              {Array.from({ length: 86 }, (_, i) => {
                const y = base - i * perIn;
                if (y < yTop) return null;
                const foot = i % 12 === 0;
                return <line key={i} x1={x - 3} y1={y} x2={x - 3 + (foot ? 22 : i % 6 === 0 ? 13 : 7)} y2={y} stroke="#1B1F24" strokeWidth={foot ? 2.4 : 1} />;
              })}
              {Array.from({ length: 8 }, (_, i) => {
                const y = base - i * 12 * perIn;
                if (y < yTop || i === 0) return null;
                return <text key={i} x={x + 24} y={y + 7} fontFamily={FONT} fontSize={20} fontWeight={600} fill="#C9D1D9">{i}</text>;
              })}
              <line x1={x - 3} y1={yTop} x2={x + 140} y2={yTop} stroke="#FFFFFF" strokeWidth={2} opacity={0.9} />
            </svg>
            <div style={{ position: "absolute", left: x - 4, top: yTop - 92, fontFamily: FONT, fontWeight: 800, fontSize: 64, color: "#FFFFFF", letterSpacing: -1, fontVariantNumeric: "tabular-nums", textShadow: SHADOW, whiteSpace: "nowrap" }}>
              {Math.floor(inches / 12)}&apos;{inches % 12}&quot;
            </div>
            <div style={{ position: "absolute", left: x - 2, top: yTop - 26, fontFamily: FONT, fontWeight: 500, fontSize: 20, color: GREY, opacity: prog(f, t.one, 10, ease.linear), whiteSpace: "nowrap" }}>
              7-1, Basketball-Reference
            </div>
          </div>
        );
      })()}

      {/* the cut-out's credit, while he is on screen */}
      {f >= t.shaq && (
        <div style={{ position: "absolute", left: f < t.because ? 760 : 40, top: 1432, fontFamily: FONT, fontWeight: 500, fontSize: 20, color: GREY, opacity: prog(f, t.shaq, 10, ease.linear) * (1 - leave(f, t.and, 10)) * (f < t.because || f >= t.because + 12 ? 1 : 0), whiteSpace: "nowrap" }}>
          Bigmoe797, CC BY-SA 4.0
        </div>
      )}
    </AbsoluteFill>
  );
};
