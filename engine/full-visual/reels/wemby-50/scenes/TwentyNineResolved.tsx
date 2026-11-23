// `close`: "So fifty is the headline. Twenty-nine shots is why it was scary."
// The hook's frame, resolved. The court of `where` stays under the lifting scoreboard and pulls back to the close
// framing; the NBA Cup photo card returns (Daiei Onoguchi, CC BY 4.0). "50": NBA.com's PTS cell lands big, counting
// to 50 on the word; "is the headline": it slides onto the photo card and goes grey. "29": every one of his 29 marks
// pushes a gold chance up out of its own spot; they fly and stack into the figure "29", a 5 x 7 dot figure that uses
// exactly 29 discs, under NBA.com's FGA header. "scary": the 20 made ones fill white with points at once, the 9 misses
// stay gold; the 29 holds under a slow push in.
// Parts: TwentyNineResolvedWorld (camera maths, shots), TwentyNineResolvedFloor (court, basket),
// TwentyNineResolvedDisc (the chance, one solid drawn through any map).
import React from "react";
import { Img, staticFile } from "remotion";
import { LEAD } from "../../../src/engine/Stage";
import { blurIn, countTo, ease, prog, useReel, useScene } from "../../../src/engine";
import { TwentyNineResolvedFloor } from "./TwentyNineResolvedFloor";
import { TwentyNineResolvedDisc, type TwentyNineResolvedMap } from "./TwentyNineResolvedDisc";
import {
  TNR_REST,
  TNR_RIM_Y,
  TNR_R,
  TNR_SHOTS,
  twentyNineResolvedArc as arc,
  twentyNineResolvedBasis,
  twentyNineResolvedProject as proj,
  tnrLerp as lerp,
  tnrRnd as rnd,
  type TwentyNineResolvedCam,
} from "./TwentyNineResolvedWorld";

const PI = Math.PI;
const INK = "#FFFFFF";
const SOFT = "#C9D1D9";
const LABEL = "#8B949E";
const CARD = "#161B22";
const LINE = "#30363D";
const asset = (n: string) => staticFile(`wemby-50/${n}`);

// ---- cameras (target, angles, px per ft at the target), the same rig as `where` so the court never jumps
type TwentyNineResolvedRig = { tx: number; ty: number; az: number; el: number; D: number; s: number; cx: number; cy: number };
const DEG = PI / 180;
// `where` leaves its camera here: small under the scoreboard
const LOW: TwentyNineResolvedRig = { tx: 0, ty: 23.5, az: 90 * DEG, el: 86 * DEG, D: 300, s: 14, cx: 540, cy: 806 + 23.5 * 14 };
// the close framing: the hook's top-down court, pulled back and set under the two numbers
const CLOSE_S = 13.2;
const BASE_Y = 990;
const CLOSE: TwentyNineResolvedRig = { tx: 0, ty: 23.5, az: 90 * DEG, el: 86 * DEG, D: 300, s: CLOSE_S, cx: 540, cy: BASE_Y + 23.5 * CLOSE_S };

const mixRig = (a: TwentyNineResolvedRig, b: TwentyNineResolvedRig, t: number): TwentyNineResolvedRig => ({
  tx: lerp(a.tx, b.tx, t),
  ty: lerp(a.ty, b.ty, t),
  az: lerp(a.az, b.az, t),
  el: lerp(a.el, b.el, t),
  D: Math.exp(lerp(Math.log(a.D), Math.log(b.D), t)),
  s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), t)),
  cx: lerp(a.cx, b.cx, t),
  cy: lerp(a.cy, b.cy, t),
});
const toCam = (r: TwentyNineResolvedRig): TwentyNineResolvedCam => {
  const h = r.D * Math.cos(r.el);
  return { eye: [r.tx + h * Math.cos(r.az), r.ty + h * Math.sin(r.az), r.D * Math.sin(r.el)], at: [r.tx, r.ty, 0], F: r.s * r.D, cx: r.cx, cy: r.cy };
};

// ---- his 29, in game order (Basketball-Reference shot chart)
const SHOTS = TNR_SHOTS.map(([n, x, y, made, pts], i) => ({ n, i, x, y: y + TNR_RIM_Y, made: !!made, three: pts === 3, rest: TNR_REST[i] }));
const N_MADE = SHOTS.filter((s) => s.made).length; // 20

// ---- the figure "29": a 5 x 7 dot figure, 14 discs in the 2 and 15 in the 9: exactly his 29 shots
const GLYPH_2 = [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"];
const GLYPH_9 = [".###.", "#...#", "#...#", ".####", "....#", "...#.", ".##.."];
const PITCH = 50; // px between disc centres
const FIG_X0 = 710 - 5 * PITCH; // left column centre; the figure is centred on x 710
const FIG_Y0 = 598; // top row centre
const SLOTS: { x: number; y: number; col: number; row: number }[] = [];
[GLYPH_2, GLYPH_9].forEach((g, d) =>
  g.forEach((row, r) =>
    row.split("").forEach((ch, c) => {
      if (ch === "#") SLOTS.push({ x: FIG_X0 + (c + d * 6) * PITCH, y: FIG_Y0 + r * PITCH, col: c + d * 6, row: r });
    }),
  ),
);
const K_FACE = (0.9 * PITCH) / (2 * TNR_R); // px per ft of a disc in the figure
const TILT = 52 * DEG; // the figure's discs face the viewer at a tilt, so their thickness shows

// each shot flies to a slot on its own side of the floor, so the paths do not cross: pair by x, then by y
const ASSIGN = (() => {
  const shots = [...SHOTS].sort((a, b) => a.x - b.x || a.y - b.y);
  const slots = SLOTS.map((s, j) => ({ ...s, j })).sort((a, b) => a.col - b.col || a.row - b.row);
  const out: number[] = new Array(SHOTS.length);
  shots.forEach((s, k) => (out[s.i] = slots[k].j));
  return out;
})();

const CORNER_Y = TNR_RIM_Y + Math.sqrt(23.75 * 23.75 - 22 * 22);
const A3 = Math.atan2(CORNER_Y - TNR_RIM_Y, 22);
const THREE_LINE: [number, number][] = [[-22, 0], [-22, CORNER_Y], ...arc(0, TNR_RIM_Y, 23.75, PI - A3, A3, 90), [22, CORNER_Y], [22, 0]];
const RING_PTS: [number, number][] = arc(0, TNR_RIM_Y, 3.5, -PI / 2, (3 * PI) / 2, 72);

// the photo card, as in the creator's first post
const CARDR = { x: 64, y: 548, w: 318, h: 400 };

export const TwentyNineResolved: React.FC = () => {
  const { f, scene, cue, endsOn, theme } = useScene();
  const { tl } = useReel();
  const s0 = scene.from - LEAD;
  const prev = tl.scenes[scene.index - 1];
  const prevS0 = prev ? prev.from - LEAD : s0;
  const t = {
    so: cue("So"),
    n50: cue("50"),
    is: cue("is"),
    headline: cue("headline."),
    n29: cue("29"),
    shots: cue("shots"),
    scary: cue("scary."),
    end: scene.to,
  };
  const UI = theme.font.ui;
  const BIG = theme.font.caption;

  // ---- the camera: `where`'s last framing (with its slow drift), pulled back down to the close framing
  const pull = prog(f, s0 + 2, t.n50 - s0 + 4, ease.inOut);
  const low = { ...LOW, s: LOW.s * (1 + 0.012 * Math.sin((f - prevS0) / 70)) };
  const rig = mixRig(low, CLOSE, pull);
  const cam = toCam(rig);
  const B = twentyNineResolvedBasis(cam);
  const P = (x: number, y: number, z = 0) => proj(cam, x, y, z, B);
  const ppf = (() => {
    const c = P(0, 20);
    return c.ok ? cam.F / c.z : 14;
  })();
  const path = (pts: [number, number][], z = 0) => {
    let d = "";
    pts.forEach((q) => {
      const p = P(q[0], q[1], z);
      if (p.ok) d += `${d ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    });
    return d;
  };
  const dim = 0.34 + 0.12 * prog(f, t.n29, 30, ease.inOut);
  const MASK = "linear-gradient(to bottom, transparent 420px, #000 510px, #000 1420px, transparent 1462px)";

  // `where`'s lit ring and arc go out as the court pulls back
  const litOut = 0.55 * (1 - prog(f, s0, 16, ease.out));

  // ---- the slow push in over the whole picture once the 29 is built
  const push = 1 + 0.035 * prog(f, t.shots - 10, t.end - t.shots + 10, ease.linear);

  // ---- the 50: NBA.com's PTS cell, big, then aside on the man, grey
  const in50 = endsOn("50", 10);
  const n50 = f < in50 ? 0 : Math.round(countTo(f, in50, 10, 0, 50));
  const o50 = prog(f, in50 - 2, 6, ease.linear);
  const land50 = f >= t.n50 ? 1 + 0.08 * Math.exp(-(f - t.n50) / 6) * Math.sin((f - t.n50) * 0.75) : 1;
  const aside = prog(f, t.is - 2, t.headline + 22 - t.is, ease.inOut);
  // big: centred at x 712, cell top 566; aside: on the photo card's foot
  const c50 = { x: lerp(712, CARDR.x + CARDR.w / 2, aside), y: lerp(566, CARDR.y + CARDR.h - 196, aside), k: lerp(1, 0.56, aside) };
  const col50 = (() => {
    const a = [255, 255, 255];
    const b = [139, 148, 158];
    return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * aside)).join(",")})`;
  })();

  // ---- the photo card
  const cardIn = prog(f, s0 + 2, 16, ease.out);
  const cardPush = 1.04 + 0.05 * prog(f, s0, t.end - s0, ease.linear);

  // ---- the chances: each rises from its own spot on "29" and flies to its slot in the figure
  const riseAt = (i: number) => t.n29 - 4 + Math.round(i * 0.9);
  const LIFT = 9;
  const FLY = 28;
  const sweepX = lerp(300, 1200, prog(f, t.shots - 4, 40, ease.inOut));
  const fillAt = t.scary - 1;
  const fill = prog(f, fillAt, 7, ease.out);
  const flash = f >= fillAt ? Math.exp(-(f - fillAt) / 9) : 0;
  type Item = { key: string; y: number; node: React.ReactNode };
  const items: Item[] = [];
  const floorRipples: React.ReactNode[] = [];
  const figRipples: React.ReactNode[] = [];
  SHOTS.forEach((s) => {
    const a = riseAt(s.i);
    if (f < a) return;
    const slot = SLOTS[ASSIGN[s.i]];
    const lift = prog(f, a, LIFT, ease.out);
    const fly = prog(f, a + LIFT - 3, FLY, ease.inOut);
    const doneAt = a + LIFT - 3 + FLY;
    const r = s.rest;
    const z = r.z + 2.4 * lift;
    // where it flies to: the slot, living a little once it has landed
    const live = f >= doneAt ? 1.4 * Math.sin((f - doneAt) * 0.06 + s.i) : 0;
    const settle = f >= doneAt ? 7 * Math.exp(-(f - doneAt) / 5) * Math.sin((f - doneAt) * 0.85) : 0;
    const fx = slot.x;
    const fy = slot.y + live + settle;
    const sinT = Math.sin(TILT);
    const cosT = Math.cos(TILT);
    const bow = Math.sin(PI * fly);
    const side = (rnd(s.i + 31) - 0.5) * 90;
    const up = 70 + 60 * rnd(s.i + 7);
    const map: TwentyNineResolvedMap = (u, v, w) => {
      const c = proj(cam, r.x + u, r.y + v, z + w, B);
      const fxp = fx + K_FACE * u;
      const fyp = fy + K_FACE * (v * sinT) - K_FACE * w * cosT;
      return [lerp(c.x, fxp, fly) + side * bow, lerp(c.y, fyp, fly) - up * bow];
    };
    const centre = map(0, 0, 0);
    // the light passing over the figure on "shots", the white of the made ones on "scary"
    const glow = f >= doneAt ? Math.exp(-((centre[0] - sweepX) ** 2) / (2 * 70 * 70)) * 0.9 : 0;
    const landGlow = f >= doneAt ? Math.exp(-(f - doneAt) / 6) * 0.8 : 0;
    const o = prog(f, a, 3, ease.linear);
    items.push({
      key: `d${s.i}`,
      y: centre[1] + fly * 2000,
      node: (
        <TwentyNineResolvedDisc
          key={`d${s.i}`}
          id={`tnr-d${s.i}`}
          map={map}
          p={{ a0: 0, a1: 2 * PI, o, fill: s.made ? fill : 0, topGlow: s.made ? flash : 0, glow: Math.min(1, glow + landGlow) }}
          detail={0.7}
        />
      ),
    });
    // a ring on the floor where the chance leaves, one in the figure where it lands
    const fl = prog(f, a, 18, ease.out);
    const c0 = P(r.x, r.y, r.z);
    if (c0.ok) floorRipples.push(<circle key={`fs${s.i}`} cx={c0.x} cy={c0.y} r={TNR_R * ppf * 0.95} fill="none" stroke="#F2B33D" strokeWidth={1.6} opacity={0.45 * prog(f, a + 6, 10, ease.linear)} />);
    if (fl < 1 && c0.ok) floorRipples.push(<circle key={`fr${s.i}`} cx={c0.x} cy={c0.y} r={(TNR_R * ppf) * (1 + 1.6 * fl)} fill="none" stroke="#F2B33D" strokeWidth={2} opacity={(1 - fl) * 0.9} />);
    const ld = prog(f, doneAt, 16, ease.out);
    if (f >= doneAt && ld < 1) figRipples.push(<ellipse key={`lr${s.i}`} cx={fx} cy={slot.y + 3} rx={K_FACE * TNR_R * (1 + 0.7 * ld)} ry={K_FACE * TNR_R * sinT * (1 + 0.7 * ld)} fill="none" stroke="#F2B33D" strokeWidth={2} opacity={(1 - ld) * 0.8} />);
    if (s.made && f >= fillAt) {
      const q = prog(f, fillAt, 20, ease.out);
      if (q < 1) figRipples.push(<ellipse key={`wr${s.i}`} cx={fx} cy={slot.y + 3} rx={K_FACE * TNR_R * (1 + 0.9 * q)} ry={K_FACE * TNR_R * sinT * (1 + 0.9 * q)} fill="none" stroke="#FFFFFF" strokeWidth={2.5} opacity={(1 - q) * 0.9} />);
    }
  });
  items.sort((a, b) => a.y - b.y);

  // ---- the marks on the floor: BBR's dots and x, on their spots the whole time
  const marks: React.ReactNode[] = [];
  SHOTS.forEach((s) => {
    const c = P(s.x, s.y);
    if (!c.ok) return;
    const R = Math.max(6.5, 0.42 * (cam.F / c.z));
    const lit = s.made && f >= fillAt ? Math.exp(-(f - fillAt) / 12) : 0;
    marks.push(
      s.made ? (
        <g key={`m${s.n}`}>
          <circle cx={c.x} cy={c.y + 1.5} r={R + 2.5} fill="#0D1117" opacity={0.55} />
          <circle cx={c.x} cy={c.y} r={R} fill="#F4F6F8" stroke="#0D1117" strokeWidth={2} />
          {lit > 0 && <circle cx={c.x} cy={c.y} r={R * 1.8} fill="#FFFFFF" opacity={0.4 * lit} style={{ filter: "blur(5px)" }} />}
        </g>
      ) : (
        <g key={`m${s.n}`}>
          <path d={`M${c.x - R} ${c.y - R}L${c.x + R} ${c.y + R}M${c.x + R} ${c.y - R}L${c.x - R} ${c.y + R}`} stroke="#0D1117" strokeWidth={Math.max(6, R * 0.7)} strokeLinecap="round" opacity={0.75} />
          <path d={`M${c.x - R} ${c.y - R}L${c.x + R} ${c.y + R}M${c.x + R} ${c.y - R}L${c.x - R} ${c.y + R}`} stroke={SOFT} strokeWidth={Math.max(3, R * 0.34)} strokeLinecap="round" />
        </g>
      ),
    );
  });

  const ringD = path(RING_PTS);
  const arcD = path(THREE_LINE);
  const fgaO = prog(f, t.n29 - 2, 8, ease.out);
  const legendO = prog(f, t.scary + 2, 8, ease.out);
  const made = f >= fillAt ? Math.round(countTo(f, fillAt, 10, 0, N_MADE)) : 0;

  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${push.toFixed(4)})`, transformOrigin: "540px 900px" }}>
      {/* the court */}
      <div style={{ position: "absolute", inset: 0, maskImage: MASK, WebkitMaskImage: MASK }}>
        <TwentyNineResolvedFloor cam={cam} f={f} dim={dim} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <filter id="tnr-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
          {litOut > 0.01 && ringD && (
            <g opacity={litOut}>
              <path d={ringD} fill="none" stroke="#FFFFFF" strokeWidth={9} opacity={0.35} filter="url(#tnr-glow)" />
              <path d={ringD} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
            </g>
          )}
          {litOut > 0.01 && arcD && (
            <g opacity={litOut}>
              <path d={arcD} fill="none" stroke="#FFFFFF" strokeWidth={Math.max(10, ppf * 0.55)} opacity={0.4} filter="url(#tnr-glow)" />
              <path d={arcD} fill="none" stroke="#FFFFFF" strokeWidth={Math.max(3, ppf * 0.2)} />
            </g>
          )}
          {marks}
          {floorRipples}
        </svg>
      </div>

      {/* the photo card: the man */}
      {cardIn > 0 && (
        <div
          style={{
            position: "absolute", left: CARDR.x, top: CARDR.y, width: CARDR.w, height: CARDR.h, borderRadius: 22, overflow: "hidden", background: CARD,
            border: `1px solid ${LINE}`, boxShadow: "0 24px 60px rgba(0,0,0,0.6)", opacity: prog(f, s0 + 2, 6, ease.linear),
            transform: `translateY(${(90 * (1 - cardIn)).toFixed(1)}px)`, filter: cardIn < 0.9 ? `blur(${(10 * (1 - cardIn)).toFixed(1)}px)` : undefined,
          }}
        >
          <Img src={asset("twentynineresolved-onoguchi.jpg")} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "38% 18%", transform: `scale(${cardPush.toFixed(4)})`, transformOrigin: "50% 30%" }} />
          {/* the foot darkens so the number reads, as in the first post */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 230, background: "linear-gradient(to bottom, rgba(13,17,23,0), rgba(13,17,23,0.82))", opacity: 0.4 + 0.6 * aside }} />
          <Img src={asset("twentynineresolved-spurs.svg")} style={{ position: "absolute", left: 14, top: 46, width: 54, height: 54, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))" }} />
          <div style={{ position: "absolute", right: 14, top: 12, fontFamily: UI, fontWeight: 500, fontSize: 20, color: "#D0D7DE", textShadow: "0 1px 6px rgba(0,0,0,0.85)", whiteSpace: "nowrap" }}>Daiei Onoguchi, CC BY 4.0</div>
        </div>
      )}

      {/* NBA.com's PTS cell: the headline */}
      {o50 > 0 && (
        <div
          style={{
            position: "absolute", left: c50.x, top: c50.y, transform: `translateX(-50%) scale(${(c50.k * land50).toFixed(4)})`, transformOrigin: "center top", opacity: o50,
            textAlign: "center", filter: f < in50 + 4 ? `blur(${(8 * (1 - prog(f, in50 - 2, 6, ease.out))).toFixed(1)}px)` : undefined,
          }}
        >
          <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 34, letterSpacing: 2, color: LABEL, opacity: 1 - aside }}>PTS</div>
          <div style={{ width: 150, height: 1.5, background: LINE, margin: "8px auto 0", opacity: 1 - aside }} />
          <div style={{ fontFamily: BIG, fontWeight: 800, fontSize: 260, lineHeight: 1, letterSpacing: -6, color: col50, fontVariantNumeric: "tabular-nums", marginTop: 4, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>{n50}</div>
        </div>
      )}

      {/* NBA.com's FGA header over the figure the chances build */}
      {fgaO > 0 && (
        // centred over the figure by an outer box: blurIn sets its own transform, which would drop a translateX(-50%)
        <div style={{ position: "absolute", left: FIG_X0 + 5 * PITCH - 120, top: FIG_Y0 - 74, width: 240, textAlign: "center" }}>
          <div style={blurIn(f, t.n29 - 2, { dur: 8 })}>
            <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 34, letterSpacing: 2, color: LABEL, lineHeight: 1 }}>FGA</div>
            <div style={{ width: 150 * fgaO, height: 1.5, background: LINE, margin: "8px auto 0" }} />
          </div>
        </div>
      )}

      {/* the chances, in flight and in the figure */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {figRipples}
        {items.map((it) => it.node)}
      </svg>

      {/* the legend: BBR's made dot and the chance */}
      {legendO > 0 && (
        <div
          style={{
            // starts right of the basket's post (x 540), so the post never runs through the made key
            position: "absolute", left: 566, top: FIG_Y0 + 6 * PITCH + 40, transform: `translateY(${(10 * (1 - legendO)).toFixed(1)}px)`, opacity: legendO,
            display: "flex", gap: 28, alignItems: "center", fontFamily: UI, fontWeight: 600, fontSize: 30, color: "#E6EDF3", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.85)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 12, fontVariantNumeric: "tabular-nums" }}>
            <span style={{ width: 26, height: 20, borderRadius: "50%", background: "#F7F1E4", border: "2px solid #9E6C16" }} />
            {made} made
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 12, fontVariantNumeric: "tabular-nums" }}>
            <span style={{ width: 26, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, #FFD883, #F2B33D 45%, #B9801F)", border: "2px solid #9E6C16" }} />
            {SHOTS.length - N_MADE} missed
          </span>
        </div>
      )}

      {/* source */}
      <div style={{ position: "absolute", left: 90, top: 1474, fontFamily: UI, fontWeight: 500, fontSize: 26, color: LABEL, opacity: 0.8 * prog(f, s0, 10, ease.linear), whiteSpace: "nowrap" }}>
        NBA.com box score, Basketball-Reference shot chart
      </div>
    </div>
  );
};
