// Hook X5, dark, 0-5.30 s: "Wembanyama's fifty points aren't the scary number. The scary number is twenty-nine."
// "The nine misses hammered in." The real half court, top-down at true geometry (answer's court), already lit; the
// real Wemby (Daiei Onoguchi's NBA Cup photo, CC BY 4.0) tilted on the slab's left edge. From frame 0 his makes land
// on their Basketball-Reference spots, each a white dot resting on the gold disc it cost, each paying its 2 or 3 up
// into a big white count; then his 5 free throws drop on the line as +1s, and the count lands 50 on "50". points:
// the 50 glows, a light pass runs over the boards: a clean court, only makes. aren't: the arena light swings and
// nine empty spots darken. scary: grey x-shaped shadows grow over them, as if something heavy hangs above. Then the
// nine misses come down out of the camera as steel x and are driven into the maple, one every 0.25 s in game order,
// the last on "29": each bends the boards, kicks slivers along the grain and a ring of dust, rocks the slab and jolts
// the 50. On "29" the heaviest hit knocks the 50 off its place into the corner and the photo off the slab; the count
// flips from points to shots, "20 made + 9 missed" rolls into "29". The dust settles, the discs are spent, the
// stakes settle into BBR's x: the last frame is `answer`'s first (keep = true).
// Parts: HookX5Data (the shots, the 25 scorings), HookX5Court (answer's court, in feet), HookX5Parts (disc, stake,
// shadow, impact), this file (the timeline and the moves).
import React from "react";
import { Img, staticFile } from "remotion";
import { blurIn, ease, prog, typeOn, useScene } from "../../../src/engine";
import { HOOKX5_MISSES, HOOKX5_PAY, HOOKX5_RIM_Y, HOOKX5_SHOTS } from "./HookX5Data";
import { HOOKX5_BOX, HOOKX5_VIEWBOX, HookX5Court, HookX5Glyph, hookX5Screen } from "./HookX5Court";
import { HookX5Defs, HookX5Disc, HookX5Dot, HookX5ImpactAir, HookX5ImpactFloor, HookX5Stake, HookX5StakeShadow, hookX5Rnd } from "./HookX5Parts";

const asset = (n: string) => staticFile(`wemby-50/${n}`);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const C = { ink: "#FFFFFF", dim: "#8B949E", line: "#30363D" };

const FLY = 12; // frames a scored point flies from its dot into the count
const FALL = 11; // frames a stake takes from out of the camera to the boards
const BEAT = 15; // 0.25 s between two stakes
const Z0 = 0.93; // a stake's height when it lets go (1 = the camera)
const V = { x: 0, y: 23.5 }; // straight under the camera, in court feet
const COUNT = { cx: 540, top: 530, size: 176 }; // the count, where answer's 29 sits
const CARD = { left: -23.5, top: 392, w: 270, h: 350, rot: -6 }; // on the slab, overhanging its left edge

function useHookX5T() {
  const { cue, scene } = useScene();
  const n29 = cue("29");
  const fifty = cue("50");
  return {
    wemb: cue("Wembanyama's"),
    fifty,
    points: cue("points"),
    arent: cue("aren't"),
    scary: cue("scary"),
    number: cue("number"),
    the: cue("The"),
    n29,
    end: scene.to,
    /** the k-th miss is driven in at: the ninth on "29" */
    hit: (k: number) => n29 - (8 - k) * BEAT,
    /** the i-th scoring arrives in the count at: two already in at frame 0, the 25th lands on "50" */
    arrive: (i: number) => -2 + (i * (fifty + 2)) / (HOOKX5_PAY.length - 1),
  };
}
type T = ReturnType<typeof useHookX5T>;

const shotFt = (i: number) => ({ x: HOOKX5_SHOTS[i].x, y: HOOKX5_RIM_Y + HOOKX5_SHOTS[i].y });
const heavyOf = (k: number) => (k === 8 ? 1 : 0);
const ampOf = (k: number) => (k === 8 ? 3.4 : 0.75 + k * 0.06);
/** a stake's head, half extent in ft: heavy steel, the ninth the biggest */
const headOf = (k: number) => (k === 8 ? 2.2 : 1.7);

/** the slab's rock and drop after every hit: a damped swing toward where it was hit, forced to rest before the hand-off */
function rockAt(f: number, t: T) {
  let rx = 0;
  let ry = 0;
  let drop = 0;
  HOOKX5_MISSES.forEach((si, k) => {
    const dt = f - t.hit(k);
    if (dt < 0) return;
    const p = shotFt(si);
    const amp = ampOf(k);
    const env = Math.exp(-dt / 9) * Math.sin((dt / 17) * Math.PI * 2 + 0.35);
    rx += -amp * 1.5 * env * ((p.y - V.y) / 23.5);
    ry += amp * 1.5 * env * (p.x / 25);
    drop += amp * Math.exp(-dt / 5) * (dt < 2 ? dt / 2 : 1);
  });
  const rest = 1 - prog(f, t.n29 + 16, 14, ease.inOut);
  // the ninth: the whole slab shakes for a moment
  const d9 = f - t.hit(8);
  const shake = d9 >= 0 && d9 < 16 ? 11 * Math.exp(-d9 / 4.5) : 0;
  return {
    rx: rx * rest,
    ry: ry * rest,
    s: 1 - 0.012 * drop * rest,
    sx: shake * (hookX5Rnd(f, 1) - 0.5) * 2,
    sy: shake * (hookX5Rnd(f, 2) - 0.5) * 2,
  };
}

/** how much the 50 jolts on each of the first eight hits */
function joltAt(f: number, t: T) {
  let y = 0;
  let r = 0;
  for (let k = 0; k < 8; k++) {
    const dt = f - t.hit(k);
    if (dt < 0) continue;
    const e = Math.exp(-dt / 4) * Math.sin(dt * 1.5);
    y += 9 * e * (0.8 + k * 0.08);
    r += 1.4 * e * (k % 2 ? 1 : -1);
  }
  return { y, r };
}

/** one stake's state at frame f: height above the floor (0..Z0), how far its shadow has formed, how driven it is */
function stakeAt(f: number, t: T, k: number) {
  const hit = t.hit(k);
  const pool = prog(f, t.arent + 2 * k, 12) * (1 - prog(f, hit, 5));
  const grow = prog(f, t.scary + 3 * k, 14, ease.out);
  const fall0 = hit - FALL;
  let z = Z0;
  if (f >= fall0 && f < hit) {
    const u = (f - fall0) / FALL;
    z = Z0 * (1 - u * u);
  } else if (f >= hit) z = 0;
  // the shadow: high and soft while it hangs, closing in through the silence, then tracking the fall
  const hang = lerp(1, 0.5, prog(f, t.scary, Math.max(1, fall0 - t.scary), ease.inOut));
  const h = f < fall0 ? hang : 0.5 * (z / Z0);
  const shadowO = f < hit ? 1 : 1 - prog(f, hit, 5);
  // driven: the head sinks, then settles into BBR's flat x
  const sink = prog(f, hit, 4, ease.out);
  const settle = prog(f, t.n29 + 5 + k * 1.1, 15, ease.inOut);
  return { hit, pool, grow, z, h, shadowO, sink, settle };
}

const HookX5Card: React.FC<{ t: T; light: number }> = ({ t, light }) => {
  const { f, theme } = useScene();
  const key = prog(f, t.wemb - 4, 16, ease.out);
  const band = prog(f, t.wemb - 2, 22, ease.inOut);
  // each hit bounces it a little; the ninth throws it off the slab
  let jy = 0;
  let jr = 0;
  for (let k = 0; k < 8; k++) {
    const dt = f - t.hit(k);
    if (dt < 0) continue;
    const e = Math.exp(-dt / 3.5) * Math.abs(Math.sin(dt * 0.9));
    jy -= 7 * e;
    jr += (k % 2 ? 0.8 : -0.8) * e;
  }
  const off = prog(f, t.n29 + 1, 17, ease.in);
  if (off >= 1) return null;
  const name = typeOn("V. Wembanyama", f, t.wemb + 2, 60, 30);
  const lift = 1 + 0.03 * key;
  return (
    <div
      style={{
        position: "absolute", left: CARD.left - 560 * off, top: CARD.top + jy + 150 * off * off, width: CARD.w, height: CARD.h,
        transform: `rotate(${(CARD.rot + jr - 34 * off).toFixed(2)}deg) scale(${lift.toFixed(4)})`, transformOrigin: "50% 60%",
        borderRadius: 16, overflow: "hidden", border: `1px solid ${C.line}`, background: "#000",
        boxShadow: `${(10 + 6 * key).toFixed(1)}px ${(18 + 10 * key).toFixed(1)}px ${(28 + 14 * key).toFixed(1)}px rgba(0,0,0,0.6)`,
        filter: `brightness(${(0.72 + 0.28 * key - 0.22 * light).toFixed(3)})${off > 0 ? ` blur(${(off * 6).toFixed(2)}px)` : ""}`,
      }}
    >
      <Img src={asset("hookx5-onoguchi-cropped.jpg")} style={{ position: "absolute", left: 0, top: 0, width: CARD.w, height: CARD.h, objectFit: "cover", transform: `scale(${(1.02 + 0.04 * prog(f, 0, 300, ease.linear)).toFixed(4)})`, transformOrigin: "55% 30%" }} />
      {/* the key light coming on: a band of light across him */}
      {band > 0 && band < 1 && (
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${(band * 140 - 40).toFixed(1)}%, rgba(255,255,255,0.32) ${(band * 140 - 20).toFixed(1)}%, transparent ${(band * 140).toFixed(1)}%)`, mixBlendMode: "screen" }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 16%, transparent 58%, rgba(0,0,0,0.82) 100%)" }} />
      <div style={{ position: "absolute", right: 10, top: 7, fontFamily: theme.font.ui, fontSize: 17, color: "rgba(255,255,255,0.78)", whiteSpace: "nowrap" }}>Daiei Onoguchi, CC BY 4.0</div>
      <div style={{ position: "absolute", left: 16, bottom: 14, fontFamily: theme.font.caption, fontWeight: 700, fontSize: 32, color: C.ink, whiteSpace: "nowrap" }}>{name.text}</div>
    </div>
  );
};

/** each make's points flying from its dot up into the count */
const HookX5Flyers: React.FC<{ t: T }> = ({ t }) => {
  const { f, theme } = useScene();
  return (
    <>
      {HOOKX5_PAY.map((p, i) => {
        const a = t.arrive(i);
        const l = a - FLY;
        if (f < l || f >= a) return null;
        const u = (f - l) / FLY;
        const e = ease.inOut(u);
        const s0 = hookX5Screen(p.x - 0.12 * p.stack, HOOKX5_RIM_Y + p.y - 0.2 * p.stack);
        const end = { x: COUNT.cx + (hookX5Rnd(i, 4) - 0.5) * 70, y: COUNT.top + 150 };
        const c = { x: lerp(s0.x, end.x, 0.25), y: Math.min(s0.y, end.y) - 150 };
        const x = (1 - e) * (1 - e) * s0.x + 2 * (1 - e) * e * c.x + e * e * end.x;
        const y = (1 - e) * (1 - e) * (s0.y - 18) + 2 * (1 - e) * e * c.y + e * e * end.y;
        const sc = lerp(1.0, 0.45, e) * (u < 0.15 ? 0.6 + 0.4 * (u / 0.15) : 1);
        return (
          <div key={i} style={{ position: "absolute", left: x - 40, top: y - 24, width: 80, textAlign: "center", fontFamily: theme.font.caption, fontWeight: 700, fontSize: 40, lineHeight: "48px", color: C.ink, opacity: u > 0.62 ? (1 - u) / 0.38 : 1, transform: `scale(${sc.toFixed(3)})`, textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
            +{p.pts}
          </div>
        );
      })}
    </>
  );
};

/** the big white count: 0 -> 50 as the points arrive, glows, jolts under the hits, is knocked into the corner on "29" */
const HookX5Fifty: React.FC<{ t: T; light: number }> = ({ t, light }) => {
  const { f, theme } = useScene();
  let v = 0;
  let last = -999;
  HOOKX5_PAY.forEach((p, i) => {
    const a = t.arrive(i);
    if (f >= a) {
      v += p.pts;
      last = Math.max(last, a);
    }
  });
  const bump = last > -999 ? 0.05 * Math.exp(-(f - last) / 3) : 0;
  const landed = f >= t.fifty;
  const settle = landed ? 0.1 * Math.exp(-(f - t.fifty) / 5) * Math.cos((f - t.fifty) * 0.7) : 0;
  const glow = prog(f, t.fifty, 8) * (1 - 0.6 * light);
  const j = joltAt(f, t);
  const hits = HOOKX5_MISSES.filter((_, k) => f >= t.hit(k)).length;
  const bright = 1 - 0.035 * hits - 0.12 * light;
  const kn = prog(f, t.n29 + 1, 11, ease.outHard);
  const fade = 1 - prog(f, t.n29 + 14, 14, ease.linear);
  if (fade <= 0) return null;
  const cx = lerp(COUNT.cx, 962, kn);
  const top = lerp(COUNT.top + j.y, 552, kn);
  const sc = (1 + bump + settle) * lerp(1, 0.3, kn);
  const blur = kn > 0 && kn < 0.7 ? 5 * (1 - kn) : 0;
  return (
    <div
      style={{
        position: "absolute", left: cx - 300, top, width: 600, textAlign: "center",
        fontFamily: theme.font.caption, fontWeight: 700, fontSize: COUNT.size, lineHeight: 1, fontVariantNumeric: "tabular-nums",
        color: `rgba(255,255,255,${bright.toFixed(3)})`, opacity: fade,
        transform: `rotate(${(j.r + 11 * kn).toFixed(2)}deg) scale(${sc.toFixed(4)})`, transformOrigin: "50% 55%",
        textShadow: glow > 0.01 ? `0 0 ${(44 * glow).toFixed(1)}px rgba(255,255,255,${(0.5 * glow).toFixed(3)}), 0 0 ${(12 * glow).toFixed(1)}px rgba(255,236,190,${(0.45 * glow).toFixed(3)})` : undefined,
        filter: blur > 0 ? `blur(${blur.toFixed(2)}px)` : undefined,
      }}
    >
      {v}
    </div>
  );
};

/** the count flips from points to shots: "20 made + 9 missed" rolls into answer's 29 */
const HookX5Shots: React.FC<{ t: T }> = ({ t }) => {
  const { f, theme } = useScene();
  const at = t.n29 + 3;
  if (f < at) return null;
  const roll = prog(f, t.n29 + 14, 12, ease.inOut);
  const big = { fontFamily: theme.font.caption, fontWeight: 700, fontVariantNumeric: "tabular-nums" as const, whiteSpace: "nowrap" as const };
  const small = { fontFamily: theme.font.ui, fontSize: 30, color: C.dim, whiteSpace: "nowrap" as const };
  const nine = prog(f, at + 4, 6);
  return (
    <>
      {roll < 1 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 548, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 14, opacity: 1 - roll, transform: `translateY(${(-80 * roll).toFixed(1)}px)`, filter: roll > 0 ? `blur(${(8 * roll).toFixed(2)}px)` : undefined }}>
          <div style={{ ...big, fontSize: 112, lineHeight: 1, color: C.ink, ...blurIn(f, at, { dur: 7, rise: 40 }) }}>20</div>
          <div style={{ ...small, ...blurIn(f, at + 2, { dur: 7 }) }}>made</div>
          <div style={{ ...big, fontSize: 112, lineHeight: 1, color: C.dim, marginLeft: 18, opacity: nine, transform: `translateY(${(30 * (1 - nine)).toFixed(1)}px)` }}>+ 9</div>
          <div style={{ ...small, opacity: prog(f, at + 6, 6) }}>missed</div>
        </div>
      )}
      {roll > 0 && (
        <div
          style={{
            position: "absolute", left: 540 - 0.6 * 176, top: 530, ...big, fontSize: 176, lineHeight: 1, color: C.ink,
            ...(roll < 1 ? { opacity: roll, transform: `translateY(${(90 * (1 - roll)).toFixed(1)}px)`, filter: `blur(${(8 * (1 - roll)).toFixed(2)}px)` } : {}),
          }}
        >
          29
        </div>
      )}
    </>
  );
};

/** the source, printed small on the slab's black apron like a broadcast floor credit */
const HookX5Source: React.FC<{ t: T }> = ({ t }) => {
  const { f, theme } = useScene();
  const out = 1 - prog(f, t.n29 - 4, 8);
  if (out <= 0) return null;
  const swap = prog(f, t.arent, 8);
  const st: React.CSSProperties = { position: "absolute", right: 40, top: HOOKX5_BOX.h - 33, fontFamily: theme.font.ui, fontSize: 24, color: C.dim, whiteSpace: "nowrap" };
  return (
    <>
      <div style={{ ...st, opacity: out * (1 - swap) }}>NBA.com box score, Nov 21 2026</div>
      <div style={{ ...st, opacity: out * swap }}>Basketball-Reference shot chart</div>
    </>
  );
};

export const HookX5: React.FC & { keep?: boolean } = () => {
  const { f } = useScene();
  const t = useHookX5T();
  // the arena light swings on "aren't" and swings back once the last stake is in
  const light = prog(f, t.arent, 20, ease.inOut) * (1 - prog(f, t.n29 + 8, 22, ease.inOut));
  const phi = (lerp(200, 115, prog(f, t.arent, 30, ease.inOut)) - 10 * prog(f, t.scary, 160, ease.linear)) * (Math.PI / 180);
  const pass = prog(f, t.points - 4, 26, ease.inOut); // the light pass over the clean court on "points"
  const passX = lerp(-34, 34, pass);
  const r = rockAt(f, t);
  const flat = Math.abs(r.rx) < 1e-4 && Math.abs(r.ry) < 1e-4 && Math.abs(r.s - 1) < 1e-5 && r.sx === 0 && r.sy === 0;
  const spend = (i: number) => prog(f, t.n29 + 6 + i * 0.4, 12, ease.inOut); // the discs are spent once the 29 is in

  // ---- the made shots and free throws: disc, dot ----
  const paid = HOOKX5_PAY.map((p, i) => {
    const a = t.arrive(i);
    const l = a - FLY;
    const discAt = l - 5;
    const drop = prog(f, discAt, 5, ease.in);
    const settle = f >= discAt + 5 ? Math.exp(-(f - discAt - 5) / 3) * Math.abs(Math.sin((f - discAt - 5) * 0.9)) * 0.35 : 0;
    const cy = HOOKX5_RIM_Y + p.y;
    let hop = settle;
    HOOKX5_MISSES.forEach((si, k) => {
      const dt = f - t.hit(k);
      if (dt < 0 || dt > 20) return;
      const s = shotFt(si);
      const d = Math.hypot(s.x - p.x, s.y - cy);
      const reach = 6 + heavyOf(k) * 10;
      if (d < reach) hop += (1 - d / reach) * Math.exp(-dt / 3.5) * Math.abs(Math.sin(dt * 0.6)) * (1 + heavyOf(k));
    });
    const glint = Math.exp(-Math.pow((p.x - passX) / 4, 2)) * (pass > 0 && pass < 1 ? 1 : 0);
    const sp = spend(i);
    return { p, i, cy, discAt, drop, hop, glint, sp, dotOn: f >= l - 1 };
  });

  const floor = (
    <>
      {HOOKX5_MISSES.map((si, k) => {
        const s = shotFt(si);
        const st = stakeAt(f, t, k);
        return <HookX5ImpactFloor key={`if${k}`} cx={s.x} cy={s.y} u={f - st.hit} heavy={heavyOf(k)} heal={prog(f, t.n29 + 8, 22)} />;
      })}
      {HOOKX5_MISSES.map((si, k) => {
        const s = shotFt(si);
        const st = stakeAt(f, t, k);
        return <HookX5StakeShadow key={`sh${k}`} id={`hx5-shf${k}`} cx={s.x} cy={s.y} h={st.h} grow={st.grow} pool={st.pool} opacity={st.shadowO} />;
      })}
    </>
  );

  return (
    <>
      <div
        style={{
          position: "absolute", left: HOOKX5_BOX.x + r.sx, top: HOOKX5_BOX.y + r.sy, width: HOOKX5_BOX.w, height: HOOKX5_BOX.h,
          transform: flat ? undefined : `perspective(1700px) rotateX(${r.rx.toFixed(3)}deg) rotateY(${r.ry.toFixed(3)}deg) scale(${r.s.toFixed(5)})`,
          transformOrigin: "50% 50%",
        }}
      >
        <HookX5Court f={f} defs={<HookX5Defs />} floor={floor}>
          {/* discs under, dots on top */}
          {paid.map(({ p, i, cy, discAt, drop, hop, glint, sp }) =>
            f >= discAt ? (
              <HookX5Disc key={`d${i}`} cx={p.x - 0.12 * p.stack} cy={cy - 0.2 * p.stack} r={p.ft ? 0.76 : 1.15} drop={drop} glint={glint} hop={hop} opacity={drop > 0 ? Math.min(1, drop * 3) * (1 - sp) : 0} />
            ) : null,
          )}
          {/* the marks in game order, as answer paints them: made dots, and each miss once it has settled into BBR's x */}
          {HOOKX5_SHOTS.map((shot, si) => {
            if (!shot.made) {
              const k = HOOKX5_MISSES.indexOf(si);
              const st = stakeAt(f, t, k);
              if (st.settle < 1) return null;
              const s = shotFt(si);
              return <HookX5Glyph key={`m${si}`} made={false} cx={s.x} cy={s.y} />;
            }
            const q = paid.find((o) => o.p.shot === si);
            if (!q || !q.dotOn) return null;
            const { p, i, cy, hop, glint, sp } = q;
            const pop = prog(f, t.arrive(i) - FLY - 1, 6, ease.back);
            const lift = hop * 0.5;
            const k = 1 - sp;
            return <HookX5Dot key={`o${i}`} cx={p.x} cy={cy} scale={pop < 1 ? pop : 1} dx={(-0.12 * p.stack - lift * 0.35) * k} dy={(-0.2 * p.stack - lift * 0.55) * k} glow={glint * k} />;
          })}
          {/* the free throws on the line: points, not field goals, so they go with the 50 */}
          {paid.map(({ p, i, cy, hop, glint, sp, dotOn }) => {
            if (!p.ft || !dotOn) return null;
            const pop = prog(f, t.arrive(i) - FLY - 1, 6, ease.back);
            const lift = hop * 0.5;
            const k = 1 - sp;
            return <HookX5Dot key={`o${i}`} cx={p.x} cy={cy} r={0.42} scale={pop * k} dx={-lift * 0.35} dy={-lift * 0.55} glow={glint * k} />;
          })}
          {/* the arena light turning: one side of the floor falls into shadow */}
          {light > 0.001 && (
            <>
              <defs>
                <linearGradient id="hx5-swing" gradientUnits="userSpaceOnUse" x1={V.x - 30 * Math.cos(phi)} y1={V.y - 30 * Math.sin(phi)} x2={V.x + 30 * Math.cos(phi)} y2={V.y + 30 * Math.sin(phi)}>
                  <stop offset="0" stopColor="#FFF3DC" stopOpacity="0.06" />
                  <stop offset="0.4" stopColor="#03050A" stopOpacity="0.3" />
                  <stop offset="1" stopColor="#03050A" stopOpacity="0.78" />
                </linearGradient>
              </defs>
              <rect x={-27.4} y={-2.4} width={54.8} height={51.8} fill="url(#hx5-swing)" opacity={light} />
            </>
          )}
          {/* the light pass on "points" */}
          {pass > 0 && pass < 1 && (
            <rect x={passX - 6} y={-2.4} width={12} height={51.8} fill="#FFF6E2" opacity={0.16 * Math.sin(pass * Math.PI)} style={{ mixBlendMode: "screen" }} />
          )}
          {/* the ninth hit: the whole floor flashes with the impact, then the light settles */}
          {f >= t.hit(8) && f < t.hit(8) + 10 && (
            <rect x={-27.4} y={-2.4} width={54.8} height={51.8} fill="#FFF4DE" opacity={0.28 * (1 - (f - t.hit(8)) / 10)} style={{ mixBlendMode: "screen" }} />
          )}
          {/* the misses, driven in: a steel head that sinks, then settles into BBR's x */}
          {HOOKX5_MISSES.map((si, k) => {
            const s = shotFt(si);
            const st = stakeAt(f, t, k);
            if (f < st.hit || st.settle >= 1) return null;
            const A = headOf(k);
            const a = lerp(lerp(A, A * 0.8, st.sink), 0.527, st.settle);
            const w = lerp(lerp(A * 0.42, A * 0.36, st.sink), 0.266, st.settle);
            return <HookX5Stake key={`st${k}`} id={`hx5-stk${k}`} cx={s.x} cy={s.y} a={a} w={w} steel={1 - st.settle} />;
          })}
        </HookX5Court>
        <HookX5Source t={t} />
        <HookX5Card t={t} light={light} />
        {/* what is in the air: the falling stakes, the slivers and the dust */}
        <svg width={HOOKX5_BOX.w} height={HOOKX5_BOX.h} viewBox={HOOKX5_VIEWBOX} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
          {HOOKX5_MISSES.map((si, k) => {
            const s = shotFt(si);
            const st = stakeAt(f, t, k);
            return <HookX5ImpactAir key={`ia${k}`} cx={s.x} cy={s.y} u={f - st.hit} heavy={heavyOf(k)} seed={k * 7 + 3} />;
          })}
          {HOOKX5_MISSES.map((si, k) => {
            const s = shotFt(si);
            const st = stakeAt(f, t, k);
            if (f < st.hit - FALL || f >= st.hit) return null;
            const kz = 1 / (1 - st.z);
            const o = clamp01((0.8 - st.z) / 0.2);
            if (o <= 0) return null;
            const u = (f - (st.hit - FALL)) / FALL;
            const blur = (2 * Z0 * u) / FALL * kz * 0.9;
            return (
              <g key={`air${k}`} transform={`translate(${V.x} ${V.y}) scale(${kz.toFixed(4)}) translate(${-V.x} ${-V.y})`}>
                <HookX5Stake id={`hx5-air${k}`} cx={s.x} cy={s.y} a={headOf(k)} w={headOf(k) * 0.42} steel={1} blur={blur / kz} opacity={o} />
              </g>
            );
          })}
        </svg>
      </div>
      <HookX5Flyers t={t} />
      <HookX5Fifty t={t} light={light} />
      <HookX5Shots t={t} />
    </>
  );
};
HookX5.keep = true;

