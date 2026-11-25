// Hook 3, dark, 0-5.3 s: "Wembanyama's 50 points aren't the scary number. The scary number is 29."
// The 50 is the tip of the heap. Frame 0: the real Wemby (Onoguchi photo card, credit top right) at upper left, its
// shadow on the maple; at the top of the key a solid white 50 stands on a mound of gold chances, ticking up its last
// points under a spotlight. aren't: the camera drops low and pulls back, the arena lights come up, and the mound is a
// tall leaning heap. scary: discs slip off its base, one rolls away on its edge. The silence creaks. is: the heap
// gives way; 29: the 50 topples off the top and slams flat, and the 29 chances avalanche across the maple, braking
// onto the exact spots where they were spent (the rim cluster first, the eleven threes skating out to the arc), the
// six free throw wedges sliding onto the line; each settled disc becomes Basketball-Reference's white dot or grey x,
// the camera ends straight overhead and 29 rises at the top: `answer`'s first frame (keep = true).
// Parts: HookX3World (camera, data, motion), HookX3Court, HookX3Disc, HookX3Fifty.
import React from "react";
import { Img, staticFile } from "remotion";
import { blurIn, ease, prog, typeOn, useScene } from "../../../src/engine";
import { HookX3CourtFlat, HookX3CourtProjected, HookX3GlyphsProjected, type HookX3MarkState } from "./HookX3Court";
import { HookX3Disc, hx3DiscShadow, type HookX3DiscDraw } from "./HookX3Disc";
import { HookX3Fifty, HX3_50_DEPTH, type HookX3FiftyPose } from "./HookX3Fifty";
import {
  HX3_FT_X, HX3_HEAP, HX3_R, HX3_ROLLER, HX3_SHOTS, HX3_TOP, HX3_T, hx3Add, hx3CamAt, hx3Clamp, hx3Disc, hx3Dot, hx3Lerp,
  hx3Mul, hx3Plan, hx3Project, hx3Rnd, hx3Sag, hx3ScaleAt, hx3Shudder, hx3Sub, hx3Wedge, type HookX3Cam, type HookX3T, type HookX3V,
} from "./HookX3World";

const asset = (n: string) => staticFile(`wemby-50/${n}`);
const GREY = "#8B949E";
const fmt = (v: number) => v.toFixed(1);

function useHookX3T(): HookX3T {
  const { cue, scene } = useScene();
  return {
    wemb: cue("Wembanyama's"),
    fifty: cue("50"),
    points: cue("points"),
    arent: cue("aren't"),
    scary: cue("scary"),
    number: cue("number"),
    the: cue("The"),
    scary2: cue("scary", 2),
    number2: cue("number", 2),
    is: cue("is"),
    n29: cue("29"),
    end: scene.to,
  };
}

/** the thud: a short decaying shake of the camera when the 50 lands */
const shakeAt = (f: number, t: HookX3T) => {
  const h = t.n29 + 3;
  if (f < h || f > h + 14) return { x: 0, y: 0 };
  const e = Math.exp(-(f - h) / 3.2);
  return { x: Math.sin((f - h) * 2.3) * 7 * e, y: Math.cos((f - h) * 2.9) * 13 * e };
};

// ---- the 50 ----
const YAW50 = (-7 * Math.PI) / 180;
function fiftyPose(f: number, t: HookX3T): HookX3FiftyPose & { o: number; grey: number } {
  const sag = hx3Sag(f, t);
  const sh = hx3Shudder(f, t);
  const e1: HookX3V = [Math.cos(YAW50), Math.sin(YAW50), 0];
  const back: HookX3V = [-Math.sin(YAW50), Math.cos(YAW50), 0];
  // standing: leaning back a little toward the camera above it, rocking as the heap creaks
  let beta = (20 + sag * 22 + sh * 2.2) * (Math.PI / 180);
  let gamma = (-(sag * 34) + sh * 1.5) * (Math.PI / 180);
  let B: HookX3V = [HX3_TOP[0] + sag * 2.2, HX3_TOP[1] - sag * 0.8, HX3_TOP[2] - sag * 2.6 + Math.abs(sh) * 0.02];
  // the fall: it tips back off the top and slams flat on its back, face up, on "29"
  const fallA = t.is - 6;
  const land = t.n29 + 3;
  const k = prog(f, fallA, land - fallA, (x) => x * x);
  if (k > 0) {
    beta = hx3Lerp(beta, Math.PI / 2, k);
    gamma = hx3Lerp(gamma, -0.1, k);
    B = [hx3Lerp(B[0], HX3_TOP[0] + 0.9, k), hx3Lerp(B[1], HX3_TOP[1] - 1.9, k), hx3Lerp(B[2], HX3_50_DEPTH + 0.02, k)];
  }
  // the bounce of the landing
  if (f >= land) {
    const e = f - land;
    beta = Math.PI / 2 - 0.09 * Math.abs(Math.sin(e * 0.55)) * Math.exp(-e / 4);
  }
  const e2u: HookX3V = [-back[0] * Math.sin(beta), -back[1] * Math.sin(beta), Math.cos(beta)];
  const n: HookX3V = [back[0] * Math.cos(beta), back[1] * Math.cos(beta), Math.sin(beta)];
  const c = Math.cos(gamma);
  const s = Math.sin(gamma);
  const r1 = hx3Add(hx3Mul(e1, c), hx3Mul(e2u, s));
  const r2 = hx3Add(hx3Mul(e1, -s), hx3Mul(e2u, c));
  // after the thud: it greys and sinks into the boards while the 29 rises
  const grey = prog(f, t.n29 + 12, 10);
  const o = 1 - prog(f, t.n29 + 20, 12, ease.in);
  return { B, e1: r1, e2: r2, n, o, grey };
}

/** the counter: 46 at frame 0, the last points ticking, landing 50 on "50" */
function fiftyValue(f: number, t: HookX3T) {
  const ticks = [0, 11, 22, 33, t.fifty - 1].map((v, i) => (i < 4 ? Math.round((t.fifty * v) / 44) : v));
  let i = 0;
  while (i + 1 < ticks.length && f >= ticks[i + 1]) i++;
  const value = 46 + i;
  const roll = i === 0 ? 1 : prog(f, ticks[i], 6, ease.out);
  return { value, prev: value - 1, roll };
}

// ---- dust off the landing ----
const DUST = Array.from({ length: 44 }, (_, i) => ({
  s: (hx3Rnd(i, 61) - 0.5) * 3.8,
  side: hx3Rnd(i, 62) > 0.5 ? 1 : -1,
  v: 0.05 + 0.09 * hx3Rnd(i, 63),
  up: 0.03 + 0.05 * hx3Rnd(i, 64),
  r: 0.04 + 0.07 * hx3Rnd(i, 65),
}));

export const HookX3: React.FC & { keep?: boolean } = () => {
  const { f, theme } = useScene();
  const t = useHookX3T();
  const plan = hx3Plan(t);
  const cam = hx3CamAt(f, t, shakeAt(f, t));
  const arena = prog(f, t.arent - 2, 30, ease.inOut); // the arena lights come up on "aren't"
  const exact = prog(f, t.n29 + 26, 4, ease.linear); // the camera is straight overhead: hand over to the flat court
  const sweep = -40 + ((f * 0.22) % 130);

  // ---- marks: each settled disc reads as Basketball-Reference's glyph ----
  const marks: HookX3MarkState[] = HX3_SHOTS.map((_, i) => ({ lit: prog(f, plan[i].A + 2, 6) }));

  // ---- the 50 ----
  const fp = fiftyPose(f, t);
  const fv = fiftyValue(f, t);
  const sweep50 = (f - t.fifty) / 16;

  // ---- discs to draw, back to front ----
  type Item = { depth: number; node: React.ReactNode };
  const items: Item[] = [];
  const shadows: string[] = [];
  const shadowO: number[] = [];
  const streaks: React.ReactNode[] = [];
  const rings: React.ReactNode[] = [];
  const depthOf = (p: HookX3V) => hx3Dot(hx3Sub(p, cam.E), cam.f);
  const lightAt = (z: number) => Math.max(arena, hx3Clamp((z - 0.5) / 1.6) * 0.9 + 0.1);

  HX3_SHOTS.forEach((s, i) => {
    const st = hx3Disc(i, f, t, plan);
    const A = plan[i].A;
    const conv = prog(f, A, 6, ease.out);
    const gone = prog(f, A + 5, 4, ease.linear);
    const white = s.made ? conv : 0;
    const scale = s.made ? hx3Lerp(1, 0.62 / HX3_R, conv) : hx3Lerp(1, 0.55, conv);
    const o = s.made ? 1 - gone : 1 - prog(f, A + 1, 7, ease.linear);
    if (o <= 0.01) return;
    const d: HookX3DiscDraw = { c: st.c, n: st.n, spin: st.spin, o, white, scale, lift: lightAt(st.c[2]), key: `s${i}` };
    items.push({ depth: depthOf(st.c) - st.c[2] * 0.35, node: <HookX3Disc key={d.key} cam={cam} d={d} /> });
    shadows.push(hx3DiscShadow(cam, st.c, Math.max(0, st.c[2] - HX3_T / 2), HX3_R * scale));
    shadowO.push(o * (0.5 - Math.min(0.3, st.c[2] * 0.1)));
    // a fast disc leaves two faint prints of itself behind (the eye's motion blur)
    if (st.v > 0.16 && o > 0.5) {
      [2, 4].forEach((back, gi) => {
        const prev = hx3Disc(i, f - back, t, plan);
        const pts = Array.from({ length: 18 }, (_, k) => {
          const a = (k / 18) * Math.PI * 2;
          const q = hx3Project(cam, [prev.c[0] + HX3_R * scale * Math.cos(a), prev.c[1] + HX3_R * scale * Math.sin(a), prev.c[2]]);
          return `${fmt(q.x)},${fmt(q.y)}`;
        }).join(" ");
        streaks.push(<polygon key={`st${i}-${back}`} points={pts} fill="#F2B33D" opacity={gi ? 0.1 : 0.2} />);
      });
    }
    // the ping where a chance comes to rest
    const pr = prog(f, A, 14, ease.out);
    if (f >= A && pr < 1 && i !== HX3_ROLLER) {
      const pts = Array.from({ length: 28 }, (_, k) => {
        const a = (k / 28) * Math.PI * 2;
        const r = HX3_R * (1 + pr * 1.6);
        const q = hx3Project(cam, [st.c[0] + r * Math.cos(a), st.c[1] + r * Math.sin(a), 0]);
        return `${fmt(q.x)},${fmt(q.y)}`;
      }).join(" ");
      rings.push(<polygon key={`r${i}`} points={pts} fill="none" stroke="#F2B33D" strokeWidth={2.4 * (1 - pr) + 0.4} opacity={1 - pr} />);
    }
  });

  // the free throw wedges
  HX3_FT_X.forEach((_, j) => {
    const w = hx3Wedge(j, f, t);
    const o = 1 - prog(f, t.n29 + 28, 12, ease.linear);
    if (o <= 0.01) return;
    const d: HookX3DiscDraw = { c: w.c, n: w.n, spin: w.spin, o, wedge: 0.44, rot: w.rot, lift: lightAt(w.c[2]), key: `w${j}` };
    items.push({ depth: depthOf(w.c) - w.c[2] * 0.35, node: <HookX3Disc key={d.key} cam={cam} d={d} /> });
    shadows.push(hx3DiscShadow(cam, w.c, Math.max(0, w.c[2] - HX3_T / 2), HX3_R * 0.8));
    shadowO.push(0.35 * o);
  });

  // the 50 sits on top of the heap until it falls; then it sorts with the floor
  const fiftyNode = (
    <HookX3Fifty key="fifty" cam={cam} pose={fp} value={fv.value} prev={fv.prev} roll={fv.roll} sweep={sweep50} o={fp.o} grey={fp.grey} font={theme.font.caption} />
  );
  const standing = f < t.n29 - 4;
  items.push({ depth: standing ? -1e9 : depthOf(fp.B) - 1.2, node: fiftyNode });
  items.sort((a, b) => b.depth - a.depth);

  // the 50's shadow on the floor while it stands, and its print once it lies there
  const fifty50 = (() => {
    const pts: string[] = [];
    const base = fp.B;
    for (let k = 0; k <= 16; k++) {
      const u = (k / 16 - 0.5) * 3.6;
      const h = 2.2;
      const p = hx3Add(hx3Add(base, hx3Mul(fp.e1, u)), hx3Mul(fp.e2, h * Math.sin((k / 16) * Math.PI) * 0.9));
      const sp: HookX3V = [p[0] + p[2] * 0.46, p[1] - p[2] * 0.72, 0];
      const q = hx3Project(cam, sp);
      pts.push(`${fmt(q.x)},${fmt(q.y)}`);
    }
    return pts.join(" ");
  })();

  // ---- the dust of the landing ----
  const land = t.n29 + 3;
  const dust: React.ReactNode[] = [];
  if (f >= land && f < land + 40) {
    const e = f - land;
    DUST.forEach((p, i) => {
      const along = hx3Add(fp.B, hx3Mul(fp.e1, p.s));
      const edge = hx3Add(along, hx3Mul(fp.e2, p.side > 0 ? 2.1 : 0));
      const out = hx3Mul(fp.e2, p.side * p.v * e * Math.exp(-e / 18) * 6);
      const z = Math.max(0, p.up * e - 0.5 * (16 / 3600) * e * e);
      const pos: HookX3V = [edge[0] + out[0], edge[1] + out[1], z];
      const q = hx3Project(cam, pos);
      const r = p.r * hx3ScaleAt(cam, pos) * (1 + e / 16);
      dust.push(<circle key={i} cx={q.x} cy={q.y} r={r} fill="#E9E2D3" opacity={0.6 * (1 - e / 40)} />);
    });
  }

  // ---- heap AO: the dark under the pile while it stands ----
  const heapO = 1 - prog(f, t.is, 16);
  const ao = Array.from({ length: 28 }, (_, k) => {
    const a = (k / 28) * Math.PI * 2;
    const q = hx3Project(cam, [HX3_HEAP[0] + 0.5 + 2.6 * Math.cos(a), HX3_HEAP[1] - 0.6 + 2.3 * Math.sin(a), 0]);
    return `${fmt(q.x)},${fmt(q.y)}`;
  }).join(" ");

  const blurPx = Math.max(1.5, hx3ScaleAt(cam, [HX3_HEAP[0], HX3_HEAP[1], 0]) * 0.12);
  // the spotlight: before the arena lights, only the top of the heap and the 50 are lit
  const top = hx3Project(cam, [HX3_TOP[0], HX3_TOP[1], HX3_TOP[2] + 1.0]);
  const spot = 1 - arena;

  return (
    <>
      {exact < 1 && <HookX3CourtProjected cam={cam} look={{ dim: 0.18 * spot, sweep }} />}
      {exact > 0 && <HookX3CourtFlat f={f} marks={marks} opacity={exact} />}
      {exact < 1 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <filter id="hx3-soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={blurPx} />
            </filter>
            <filter id="hx3-softer" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={blurPx * 2.4} />
            </filter>
          </defs>
          <g filter="url(#hx3-softer)">
            {heapO > 0 && <polygon points={ao} fill="#000" opacity={0.45 * heapO} />}
            {fp.o > 0 && <polygon points={fifty50} fill="#000" opacity={0.28 * fp.o * (1 - prog(f, t.is, 10))} />}
          </g>
          <g filter="url(#hx3-soft)">
            {shadows.map((p, i) => (
              <polygon key={i} points={p} fill="#1A0F02" opacity={shadowO[i]} />
            ))}
          </g>
        </svg>
      )}
      {exact < 1 && <HookX3GlyphsProjected cam={cam} marks={marks} />}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {rings}
        {streaks}
        {items.map((it) => it.node)}
        {dust}
      </svg>
      {spot > 0.01 && (
        <div
          style={{
            position: "absolute", inset: 0, opacity: spot,
            background: `radial-gradient(circle at ${fmt(top.x)}px ${fmt(top.y)}px, rgba(5,7,10,0) 0px, rgba(5,7,10,0) 240px, rgba(5,7,10,0.62) 640px)`,
          }}
        />
      )}
      <HookX3Labels t={t} cam={cam} fp={fp} />
      <HookX3Card t={t} />
      {f >= t.n29 + 14 && (
        <div
          style={{
            position: "absolute", left: 540 - 0.6 * 176, top: 530, fontFamily: theme.font.caption, fontWeight: 700, fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap", fontSize: 176, lineHeight: 1, color: "#FFFFFF", ...blurIn(f, t.n29 + 14, { dur: 12, rise: 70 }),
          }}
        >
          29
        </div>
      )}
    </>
  );
};
HookX3.keep = true;

// ---- the labels: PTS on the 50, "shots" on the heap, the source line ----
const HookX3Labels: React.FC<{ t: HookX3T; cam: HookX3Cam; fp: HookX3FiftyPose }> = ({ t, cam, fp }) => {
  const { f, theme, fps } = useScene();
  const out = 1 - prog(f, t.is - 4, 8);
  if (out <= 0) return null;
  const pts = hx3Project(cam, hx3Add(hx3Add(fp.B, hx3Mul(fp.e1, 2.05)), hx3Mul(fp.e2, 0.15)));
  const heapL = hx3Project(cam, [HX3_HEAP[0] - 0.2, HX3_HEAP[1] + 1.7, 0]);
  const ptsText = typeOn("PTS", f, t.points, fps).text;
  const shotsText = typeOn("his shots", f, t.arent + 22, fps).text;
  const lab: React.CSSProperties = { position: "absolute", fontFamily: theme.font.ui, fontWeight: 600, fontSize: 34, color: GREY, whiteSpace: "nowrap", opacity: out };
  return (
    <>
      {f >= t.points && (
        <div style={{ ...lab, left: pts.x + 18, top: pts.y - 44, letterSpacing: 2 }}>
          <div style={{ position: "absolute", left: -18, top: 22, width: 14, height: 1, background: GREY }} />
          {ptsText}
        </div>
      )}
      {f >= t.arent + 22 && (
        <div style={{ ...lab, left: heapL.x + 250, top: heapL.y + 20 }}>
          <div style={{ position: "absolute", left: -16 - 80 * prog(f, t.arent + 22, 8), top: 22, width: 80 * prog(f, t.arent + 22, 8), height: 1, background: GREY }} />
          {shotsText}
        </div>
      )}
      {f >= t.points && (
        <div style={{ ...lab, left: 56, top: 1404, fontSize: 26, fontWeight: 500, ...blurIn(f, t.points, { dur: 8 }), opacity: out }}>
          NBA.com box score, Nov 21 2026
        </div>
      )}
    </>
  );
};

// ---- the photo card: the real Wemby, upper left, standing on the maple with its shadow falling on it ----
const HookX3Card: React.FC<{ t: HookX3T }> = ({ t }) => {
  const { f, theme } = useScene();
  const key = prog(f, t.wemb - 2, 12, ease.out);
  const exit = prog(f, t.is + 2, 16, ease.in);
  if (exit >= 1) return null;
  const W = 330;
  const H = 400;
  const X = 52;
  const Y = 556;
  const push = 1 + 0.05 * prog(f, 0, 300, ease.linear);
  const bright = 0.62 + 0.38 * key;
  const dx = -520 * exit;
  const dy = -90 * exit;
  const shadowO = (0.2 + 0.3 * key) * (1 - exit);
  return (
    <>
      {/* its shadow falls forward onto the floor below it */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: shadowO }}>
        <defs>
          <filter id="hx3-cardshadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={16} />
          </filter>
          <linearGradient id="hx3-cardshadow-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0.95" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`${X + dx + 10},${Y + H - 6 + dy} ${X + W + dx - 4},${Y + H - 14 + dy} ${X + W + dx + 150},${Y + H + 230 + dy} ${X + dx + 120},${Y + H + 250 + dy}`}
          fill="url(#hx3-cardshadow-g)"
          filter="url(#hx3-cardshadow)"
        />
      </svg>
      <div
        style={{
          position: "absolute", left: X, top: Y, width: W, height: H, borderRadius: 18, overflow: "hidden", background: "#000",
          border: "1px solid #30363D", boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          transform: `translate(${dx}px, ${dy}px) perspective(1400px) rotateY(${12 + 10 * exit}deg) rotateZ(${-6 * exit}deg)`,
          transformOrigin: "0% 100%",
          filter: `brightness(${bright.toFixed(3)})${exit > 0 ? ` blur(${(exit * 14).toFixed(1)}px)` : ""}`,
          opacity: 1 - prog(f, t.is + 10, 8),
        }}
      >
        <Img src={asset("hookx3-onoguchi.jpg")} style={{ position: "absolute", left: -78, top: -18, width: 470, transform: `scale(${push.toFixed(4)})`, transformOrigin: "55% 25%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 22%, transparent 60%, rgba(0,0,0,0.7) 100%)" }} />
        {/* the key light: a warm band sliding over the photo as it comes up */}
        <div style={{ position: "absolute", inset: 0, opacity: (1 - key) * 0.0 + 0.35 * Math.sin(Math.PI * key), background: "linear-gradient(110deg, transparent 30%, rgba(255,240,210,0.55) 50%, transparent 70%)", transform: `translateX(${(-120 + 240 * key).toFixed(1)}px)` }} />
        <Img src={asset("hookx3-spurs.svg")} style={{ position: "absolute", left: 12, top: 10, width: 44, height: 44 }} />
        <div style={{ position: "absolute", right: 12, top: 10, fontFamily: theme.font.ui, fontSize: 18, color: "rgba(255,255,255,0.72)" }}>Daiei Onoguchi, CC BY 4.0</div>
        <div style={{ position: "absolute", left: 16, bottom: 14, fontFamily: theme.font.ui, fontWeight: 700, fontSize: 34, color: "#FFFFFF", opacity: key }}>
          {typeOn("V. Wembanyama", f, t.wemb, 60, 22).text}
        </div>
      </div>
    </>
  );
};
