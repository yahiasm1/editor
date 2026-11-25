// `freethrow`: "A trip to the free throw line usually means two shots for one chance, so each free throw counts as a
// little under half a shot, 0.44."
// The real photo of Wemby at the line (H4stings, CC BY-SA 4.0) comes up big over a dim floor; on "free throw" a
// hairline traces the real line under his feet; on "line" the card goes to the corner and the lane paints on top-down
// at true geometry, the free throw line last, "15 ft" from the board. The one camera tilts up to the stands angle,
// the backboard and the rim at 10 ft stand up. "two": two balls leave the line and drop through the net. "one": one
// gold disc drops onto the line under both arcs. The camera comes down to the disc on the boards; "so each free
// throw" cuts it in two, "counts as" draws the whole disc's outline round each half, "half" marks 0.50, "a shot"
// shaves a sliver off each, and "0.44" lands. The camera pulls back: his six real free throws (BBR play-by-play) lie
// on the line as six 0.44 wedges, five made, one missed, and the glossary line types on: TSA = FGA + 0.44 * FTA.
// Parts: FreeThrowWedgesWorld (camera, projection), FreeThrowWedgesFloor, FreeThrowWedgesHoop, FreeThrowWedgesDisc.
import React from "react";
import { Img, staticFile } from "remotion";
import { LEAD } from "../../../src/engine/Stage";
import { arrive, blurIn, blurOut, countTo, ease, mix, pop, prog, typeOn, useScene } from "../../../src/engine";
import { FreeThrowWedgesFloor } from "./FreeThrowWedgesFloor";
import { FreeThrowWedgesHoop, type FreeThrowWedgesBall } from "./FreeThrowWedgesHoop";
import { FreeThrowWedgesDisc, FTW_H, FTW_R, type FreeThrowWedgesPiece } from "./FreeThrowWedgesDisc";
import {
  freeThrowWedgesArc as arc,
  freeThrowWedgesLine as line,
  freeThrowWedgesProject as proj,
  ftwLerp as lerp,
  FTW_LINE_Y as FTL,
  type FreeThrowWedgesCam,
} from "./FreeThrowWedgesWorld";

const GOLD = "#F2B33D";
const LABEL = "#8B949E";
const HAIR = "#30363D";
const F = 2200;
const SLIVER = 0.06 * Math.PI * 2; // a free throw is 0.44 of a chance: half a disc less 0.06 of one
const PI = Math.PI;

// his six free throws, Basketball-Reference play-by-play, 21 Nov 2026
const FREETHROWWEDGES_FTS = [
  { q: "1st Q", clock: "9:37", made: true },
  { q: "1st Q", clock: "9:37", made: true },
  { q: "1st Q", clock: "1:09", made: false },
  { q: "2nd Q", clock: "9:27", made: true },
  { q: "2nd Q", clock: "9:27", made: true },
  { q: "2nd Q", clock: "2:02", made: true },
];
const ROW_X = [-4.9, -2.94, -0.98, 0.98, 2.94, 4.9];
const ROW_A0 = -PI / 2 + SLIVER; // every wedge in the row lies the same way: 0.44 of a disc
const ROW_A1 = PI / 2;

type Key = { at: number; dur: number; c: Omit<FreeThrowWedgesCam, "F" | "yaw"> & { yaw?: number } };

function freeThrowWedgesCam(f: number, keys: Key[]): FreeThrowWedgesCam {
  let c = { yaw: 0, ...keys[0].c };
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f <= k.at) break;
    const p = prog(f, k.at, k.dur, ease.inOut);
    const a = c;
    const b = k.c;
    c = {
      tx: lerp(a.tx, b.tx, p),
      ty: lerp(a.ty, b.ty, p),
      D: Math.exp(lerp(Math.log(a.D), Math.log(b.D), p)),
      pitch: lerp(a.pitch, b.pitch, p),
      cx: lerp(a.cx, b.cx, p),
      cy: lerp(a.cy, b.cy, p),
      yaw: lerp(a.yaw ?? 0, b.yaw ?? 0, p),
    };
  }
  return { ...c, F };
}

/** a label written small in grey, tied to what it names with a hairline */
const FreeThrowWedgesTag: React.FC<{ x: number; y: number; tx: number; ty: number; text: string; style: React.CSSProperties; align?: "left" | "right" }> = ({ x, y, tx, ty, text, style, align = "left" }) => (
  <div style={{ position: "absolute", inset: 0, ...style }}>
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <line x1={x} y1={y} x2={tx} y2={ty} stroke={LABEL} strokeOpacity={0.7} strokeWidth={2} />
      <circle cx={tx} cy={ty} r={4} fill={LABEL} />
    </svg>
    <div
      style={{
        position: "absolute", top: y - 22, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 36, color: "#E6EDF3", whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,0.9)",
        ...(align === "left" ? { left: x + 12 } : { right: 1080 - x + 12 }),
      }}
    >
      {text}
    </div>
  </div>
);

/** the Commons photo card, big then in the corner, with the real free throw line traced under his feet */
const FreeThrowWedgesPhoto: React.FC<{ t: ReturnType<typeof useFreeThrowWedgesT> }> = ({ t }) => {
  const { f } = useScene();
  if (f > t.chance + 14) return null;
  const k = arrive(f, t.line - 3, 18);
  const B = { x: 210, y: 548, w: 660, h: 880 };
  const S = { x: 40, y: 538, w: 280, h: 373 };
  const r = { x: lerp(B.x, S.x, k), y: lerp(B.y, S.y, k), w: lerp(B.w, S.w, k), h: lerp(B.h, S.h, k) };
  const push = 1.03 + 0.13 * prog(f, t.s0, t.line + 20 - t.s0, ease.linear);
  const trace = prog(f, t.free - 2, 14, ease.inOut);
  const enter = blurIn(f, t.s0, { dur: 10, rise: 50, scaleFrom: 0.95 });
  const leave = f >= t.chance + 2 ? blurOut(f, t.chance + 2, { dur: 10 }) : {};
  return (
    <div
      style={{
        position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: lerp(22, 16, k), overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px #30363D", background: "#161B22", ...enter, ...leave,
        opacity: Number(enter.opacity ?? 1) * Number((leave as React.CSSProperties).opacity ?? 1),
      }}
    >
      <div style={{ position: "absolute", inset: 0, transformOrigin: "24% 58%", transform: `scale(${push.toFixed(4)})` }}>
        <Img src={staticFile("wemby-50/freethrowwedges-toronto-ft.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <svg viewBox="0 0 1050 1400" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {/* the free throw line in the photo: the edge of the painted lane, under his feet */}
          <line x1={442} y1={737} x2={lerp(442, 108, trace)} y2={lerp(737, 1022, trace)} stroke="#FFFFFF" strokeWidth={14} strokeOpacity={0.35 * (trace > 0 ? 1 : 0)} style={{ filter: "blur(6px)" }} />
          <line x1={442} y1={737} x2={lerp(442, 108, trace)} y2={lerp(737, 1022, trace)} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={trace > 0 ? 1 : 0} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, background: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)" }} />
      <div style={{ position: "absolute", right: 14, top: 10, fontFamily: "Inter, sans-serif", fontSize: 22, color: "#C9D1D9", whiteSpace: "nowrap" }}>H4stings, CC BY-SA 4.0</div>
    </div>
  );
};

const useFreeThrowWedgesT = () => {
  const { cue, scene } = useScene();
  return {
    s0: scene.from - LEAD,
    end: scene.to,
    free: cue("free"),
    line: cue("line"),
    usually: cue("usually"),
    two: cue("two"),
    shots: cue("shots"),
    one: cue("one"),
    chance: cue("chance"),
    so: cue("so"),
    free2: cue("free", 2),
    throw2: cue("throw", 2),
    counts: cue("counts"),
    half: cue("half"),
    shot: cue("shot"),
    t44: cue("0.44"),
  };
};

/** a ball's flight: from his release over the line to the rim, then down through the net */
function freeThrowWedgesFlight(f: number, start: number, x0: number, H: number): FreeThrowWedgesBall & { done: number } {
  const DUR = 24;
  const p = (f - start) / DUR;
  const spin = -(f - start) * 0.42;
  if (p < 0) return { x: x0, y: FTL + 0.25, z: 9.4, spin, o: 0, done: 0 };
  if (p <= 1) {
    const z = lerp(9.4, 10.25, p) + 4 * H * p * (1 - p);
    return { x: lerp(x0, 0, p), y: lerp(FTL + 0.25, 5.25, p), z, spin, o: Math.min(1, p * 6), done: 0 };
  }
  const q = Math.min(1, (f - start - DUR) / 16);
  return { x: 0, y: 5.25 + q * 0.4, z: 10.25 - 5.5 * q * q, spin, o: 1 - prog(f, start + DUR + 9, 7, ease.linear), done: 1 };
}

export const FreeThrowWedges: React.FC = () => {
  const { f, ground } = useScene();
  const t = useFreeThrowWedgesT();

  // ---- the one camera
  const top = { tx: 0, ty: 12.25, pitch: 0, cx: 600, cy: 985 };
  const cam = freeThrowWedgesCam(f, [
    { at: t.s0, dur: 1, c: { ...top, D: 70 } },
    { at: t.s0, dur: t.line + 20 - t.s0, c: { ...top, D: 61 } },
    { at: t.usually - 4, dur: 34, c: { tx: 0, ty: 11, pitch: 0.7, D: 62, cx: 540, cy: 1110, yaw: 0.75 } },
    { at: t.two + 30, dur: t.chance - t.two - 28, c: { tx: 0, ty: 11.3, pitch: 0.72, D: 59, cx: 540, cy: 1105, yaw: 0.8 } },
    { at: t.chance + 14, dur: 24, c: { tx: 0, ty: FTL, pitch: 0.7, D: 9, cx: 540, cy: 930, yaw: 0 } },
    { at: t.chance + 38, dur: t.t44 - t.chance - 36, c: { tx: 0, ty: FTL, pitch: 0.7, D: 8.55, cx: 540, cy: 925, yaw: 0 } },
    { at: t.t44 + 2, dur: 28, c: { tx: 0, ty: 17.6, pitch: 0.56, D: 27.5, cx: 540, cy: 930, yaw: 0 } },
    { at: t.t44 + 30, dur: 60, c: { tx: 0, ty: 17.6, pitch: 0.56, D: 26.6, cx: 540, cy: 930, yaw: 0 } },
  ]);
  const P = (x: number, y: number, z: number) => proj(cam, x, y, z);

  // ---- the floor and its lines
  const lines = prog(f, t.line - 8, 26, ease.out);
  const ftGlow = prog(f, t.line + 15, 4) * (1 - prog(f, t.line + 24, 18));
  const veil = 0.62 * (1 - prog(f, t.line - 6, 14));

  // ---- two shots
  const b1 = freeThrowWedgesFlight(f, t.two - 3, 0.12, 4.1);
  const b2 = freeThrowWedgesFlight(f, t.shots, -0.14, 4.9);
  const swish = Math.max(0, 1 - prog(f, t.two + 21, 34, ease.linear)) * (f >= t.two + 21 ? 1 : 0) + Math.max(0, 1 - prog(f, t.shots + 24, 34, ease.linear)) * (f >= t.shots + 24 ? 1 : 0);
  const hoopO = prog(f, t.line + 4, 12) * (1 - prog(f, t.chance + 22, 12));
  const trailO = 1 - prog(f, t.chance + 12, 12);
  const trail = (start: number, x0: number, H: number) => {
    const pts: [number, number, number][] = [];
    const n = Math.min(1, (f - start) / 24);
    if (n <= 0) return null;
    for (let i = 0; i <= 30; i++) {
      const p = (i / 30) * n;
      pts.push([lerp(x0, 0, p), lerp(FTL + 0.25, 5.25, p), lerp(9.4, 10.25, p) + 4 * H * p * (1 - p)]);
    }
    return line(cam, pts);
  };
  const tr1 = trail(t.two - 3, 0.12, 4.1);
  const tr2 = trail(t.shots, -0.14, 4.9);

  // ---- one chance: the disc, then the cut, the half, the shave
  const dropAt = t.one - 10;
  const dropP = prog(f, dropAt, 10, ease.in);
  const bounce = f > t.one ? 0.28 * Math.sin(PI * prog(f, t.one, 10, ease.linear)) * (1 - prog(f, t.one, 10)) : 0;
  const zDisc = f < t.one ? 3.4 * (1 - dropP) : bounce;
  const cutAt = t.so - 3;
  const sep = 0.95 * arrive(f, t.so + 3, 18);
  const shaveAt = t.shot - 7;
  const shaved = f >= shaveAt;
  const sl = prog(f, shaveAt, 24, ease.out);
  const pull = prog(f, t.t44 + 2, 28, ease.inOut);
  const landGlow = prog(f, t.t44, 3) * (1 - prog(f, t.t44 + 4, 18));

  const pieces: { p: FreeThrowWedgesPiece; id: string; glow?: number }[] = [];
  if (f >= dropAt) {
    if (f < cutAt + 6) {
      pieces.push({ id: "ftw-whole", p: { x: 0, y: FTL, z: zDisc, a0: 0, a1: PI * 2, o: prog(f, dropAt, 4) } });
    } else {
      // left half (free throw 1) and right half (free throw 2); after the shave each keeps 0.44 of a disc
      const lA0 = PI / 2;
      const lA1 = (3 * PI) / 2 - (shaved ? SLIVER : 0);
      const rA0 = -PI / 2 + (shaved ? SLIVER : 0);
      const rA1 = PI / 2;
      // pulled back, they become the first two of his six, all lying the same way
      const rotL = (PI + SLIVER) * pull;
      pieces.push({ id: "ftw-l", glow: landGlow, p: { x: lerp(-sep, ROW_X[0], pull), y: FTL, z: 0, a0: lA0 + rotL, a1: lA1 + rotL, o: 1 } });
      pieces.push({ id: "ftw-r", glow: landGlow, p: { x: lerp(sep, ROW_X[1], pull), y: FTL, z: 0, a0: lerp(rA0, ROW_A0, pull), a1: lerp(rA1, ROW_A1, pull), o: 1 } });
      if (shaved && sl < 1) {
        // the slivers: shaved off the far end of each half, lifted, tipped and gone
        const o = 1 - prog(f, shaveAt + 10, 12, ease.linear);
        const lift = 0.9 * Math.sin(PI * Math.min(1, sl * 1.2));
        const out = 1.5 * sl;
        for (const [id, x, a0, a1, s] of [["ftw-sl", -sep, (3 * PI) / 2 - SLIVER, (3 * PI) / 2, -1], ["ftw-sr", sep, -PI / 2, -PI / 2 + SLIVER, 1]] as const) {
          const m = (a0 + a1) / 2;
          pieces.push({ id, p: { x: x + Math.cos(m) * out + s * 0.3 * sl, y: FTL + Math.sin(m) * out, z: lift, a0, a1, o, tilt: s * 1.4 * sl, shadow: 0.6 } });
        }
      }
    }
    // the other four of his six drop onto the line
    for (let i = 2; i < 6; i++) {
      const at = t.t44 + 14 + (i - 2) * 5;
      if (f < at) continue;
      const q = prog(f, at, 9, ease.in);
      const bz = f > at + 9 ? 0.16 * Math.sin(PI * prog(f, at + 9, 8, ease.linear)) : 0;
      pieces.push({ id: `ftw-row${i}`, p: { x: ROW_X[i], y: FTL, z: (1 - q) * 1.8 + bz, a0: ROW_A0, a1: ROW_A1, o: prog(f, at, 4) } });
    }
  }

  // ---- marks on the six: BBR's glyphs, a filled dot for a make, an x for a miss
  const glyphs = FREETHROWWEDGES_FTS.map((ft, i) => {
    const at = t.t44 + 28 + i * 3; // read left to right, in the play-by-play's order
    if (f < at) return null;
    const m = (ROW_A0 + ROW_A1) / 2;
    const c = P(ROW_X[i] + Math.cos(m) * FTW_R * 0.42, FTL + Math.sin(m) * FTW_R * 0.42, FTW_H + 0.01);
    if (!c.ok) return null;
    const s = (F / c.z) * 0.2;
    const k = pop(f, at, { dur: 8, from: 0.3 });
    return (
      <g key={i} style={{ ...k, transformOrigin: `${c.x}px ${c.y}px`, transformBox: "view-box" }}>
        {ft.made ? (
          <circle cx={c.x} cy={c.y} r={s} fill="#FFFFFF" stroke="#7A5512" strokeWidth={1.5} />
        ) : (
          <path d={`M${c.x - s} ${c.y - s} L${c.x + s} ${c.y + s} M${c.x + s} ${c.y - s} L${c.x - s} ${c.y + s}`} stroke="#FFFFFF" strokeWidth={s * 0.45} strokeLinecap="round" />
        )}
      </g>
    );
  });

  // ---- macro marks: the cut, the whole-disc outlines, the 0.50 and 0.44 ticks
  const macroO = 1 - prog(f, t.t44 + 2, 10);
  const cutO = prog(f, cutAt, 3) * (1 - prog(f, t.so + 8, 8));
  const cutLen = prog(f, cutAt, 7, ease.inOut);
  const cutPath = f >= cutAt && f < t.so + 18 ? line(cam, [[0, FTL - FTW_R * 1.08, FTW_H + 0.02], [0, FTL - FTW_R * 1.08 + 2.16 * FTW_R * cutLen, FTW_H + 0.02]]) : null;
  const ghostT = prog(f, t.counts - 2, 30, ease.inOut);
  const ghosts = [-1, 1].map((s) => {
    if (ghostT <= 0) return null;
    const a0 = s < 0 ? PI / 2 : -PI / 2;
    return line(cam, arc(s * sep, FTL, FTW_R, a0, a0 + PI * 2 * ghostT, 72, FTW_H));
  });
  const tick = (x: number, a: number, len = 0.28) =>
    line(cam, [[x + Math.cos(a) * (FTW_R - 0.04), FTL + Math.sin(a) * (FTW_R - 0.04), FTW_H], [x + Math.cos(a) * (FTW_R + len), FTL + Math.sin(a) * (FTW_R + len), FTW_H]]);
  const halfO = prog(f, t.half - 1, 5) * macroO;
  const val = countTo(f, t.t44 - 20, 20, 0.5, 0.44);

  // ---- screen anchors for the labels
  const apex = P(-0.1, 13.5, 14.2);
  const discC = P(FTW_R + 0.1, FTL, 0);
  const lblO = 1 - prog(f, t.chance + 14, 8);
  const dimA = P(9.4, 4, 0);
  const dimB = P(9.4, 19, 0);
  const dimO = prog(f, t.line + 16, 8) * (1 - prog(f, t.two - 8, 10));
  const macroLbl = (s: number, y: number, z = 0) => P(s * sep, y, z);

  const formula = "TSA = FGA + 0.44 * FTA";
  const typed = typeOn(formula, f, t.t44 + 2, 60, 22);
  const typedHtml = (() => {
    const s = typed.text;
    const i = formula.indexOf("0.44");
    if (s.length <= i) return <>{s}</>;
    return (
      <>
        {s.slice(0, i)}
        <span style={{ color: GOLD }}>{s.slice(i, i + 4)}</span>
        {s.slice(i + 4)}
      </>
    );
  })();
  const endO = prog(f, t.t44 + 6, 10);

  const MASK = "linear-gradient(to bottom, transparent 470px, #000 548px, #000 1440px, transparent 1580px)";
  const bottomVeil = prog(f, t.t44 + 8, 16);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, maskImage: MASK, WebkitMaskImage: MASK, opacity: prog(f, t.s0, 8) }}>
        <FreeThrowWedgesFloor cam={cam} lines={lines} f={f} ftGlow={ftGlow} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: trailO }}>
          {tr1 && <path d={tr1} fill="none" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={4} strokeLinecap="round" />}
          {tr2 && <path d={tr2} fill="none" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={4} strokeLinecap="round" />}
        </svg>
        <FreeThrowWedgesHoop cam={cam} balls={[b1, b2]} swish={Math.min(1, swish)} f={f} o={hoopO} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {ghosts.map((d, i) => (d ? <path key={i} d={d} fill="none" stroke={LABEL} strokeWidth={2.5} opacity={macroO} /> : null))}
          {pieces.map((pc) => (
            <FreeThrowWedgesDisc key={pc.id} cam={cam} p={pc.p} id={pc.id} glow={pc.glow} />
          ))}
          {cutPath && <path d={cutPath} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={cutO} />}
          {halfO > 0 &&
            [-1, 1].map((s) => {
              const x = s * sep;
              const a50 = s < 0 ? (3 * PI) / 2 : -PI / 2;
              const a44 = s < 0 ? (3 * PI) / 2 - SLIVER : -PI / 2 + SLIVER;
              const t50 = tick(x, a50);
              const t44 = shaved ? tick(x, a44, 0.42) : null;
              return (
                <g key={s} opacity={halfO}>
                  {t50 && <path d={t50} stroke={LABEL} strokeWidth={4} strokeLinecap="round" />}
                  {t44 && <path d={t44} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={prog(f, shaveAt + 4, 6)} />}
                </g>
              );
            })}
          {glyphs}
        </svg>
        {/* floor veil while the photo is up, and under the formula at the end */}
        <div style={{ position: "absolute", inset: 0, background: ground.bg, opacity: veil }} />
        <div style={{ position: "absolute", inset: 0, opacity: bottomVeil, background: `linear-gradient(to bottom, transparent 1150px, ${ground.bg}EE 1215px, ${ground.bg} 1300px)` }} />
      </div>

      {/* the lane measured: 15 ft from the board face to the free throw line */}
      {dimO > 0 && dimA.ok && dimB.ok && (
        <div style={{ position: "absolute", inset: 0, opacity: dimO }}>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={dimA.x} y1={dimA.y} x2={dimB.x} y2={lerp(dimA.y, dimB.y, prog(f, t.line + 16, 10, ease.out))} stroke="#C9D1D9" strokeWidth={2} />
            <line x1={dimA.x - 12} y1={dimA.y} x2={dimA.x + 12} y2={dimA.y} stroke="#C9D1D9" strokeWidth={2} />
            <line x1={dimB.x - 12} y1={dimB.y} x2={dimB.x + 12} y2={dimB.y} stroke="#C9D1D9" strokeWidth={2} />
          </svg>
          <div style={{ position: "absolute", left: dimA.x + 16, top: (dimA.y + dimB.y) / 2 - 22, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 36, color: "#C9D1D9" }}>15 ft</div>
        </div>
      )}

      {/* two shots, one chance */}
      {f >= t.shots + 8 && apex.ok && lblO > 0 && (
        <FreeThrowWedgesTag x={Math.min(apex.x - 40, 860)} y={Math.max(apex.y - 90, 600)} tx={apex.x + 8} ty={apex.y + 4} text="2 shots" style={{ ...blurIn(f, t.shots + 8, { dur: 8 }), opacity: Number(blurIn(f, t.shots + 8, { dur: 8 }).opacity) * lblO }} />
      )}
      {f >= t.one + 6 && discC.ok && lblO > 0 && (
        <FreeThrowWedgesTag x={Math.min(discC.x + 110, 840)} y={discC.y + 70} tx={discC.x + 6} ty={discC.y} text="1 chance" style={{ ...blurIn(f, t.one + 6, { dur: 8 }), opacity: Number(blurIn(f, t.one + 6, { dur: 8 }).opacity) * lblO }} />
      )}

      {/* macro: which free throw, what a whole shot is, and the value */}
      {f >= t.free2 - 2 && macroO > 0 &&
        [-1, 1].map((s, i) => {
          const a = macroLbl(s, FTL + FTW_R + 0.5);
          if (!a.ok) return null;
          const at = i === 0 ? t.free2 - 2 : t.throw2;
          return (
            <div key={s} style={{ position: "absolute", left: a.x - 200, width: 400, top: a.y, textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 36, color: "#3A2710", ...blurIn(f, at, { dur: 8, rise: 10 }), opacity: Number(blurIn(f, at, { dur: 8 }).opacity) * macroO }}>
              free throw {i + 1} of 2
            </div>
          );
        })}
      {ghostT > 0.15 && macroO > 0 && (() => {
        // between the two outlines, above them: each outline is one whole shot
        const a = P(0, FTL - FTW_R, FTW_H);
        if (!a.ok) return null;
        return (
          <div style={{ position: "absolute", left: 0, width: 1080, textAlign: "center", top: a.y - 40, whiteSpace: "nowrap", fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 34, color: "#C9D1D9", ...blurIn(f, t.counts + 6, { dur: 8 }), opacity: Number(blurIn(f, t.counts + 6, { dur: 8 }).opacity) * macroO }}>
            1 whole shot
          </div>
        );
      })()}
      {f >= t.half - 1 && macroO > 0 &&
        [-1, 1].map((s) => {
          const a = macroLbl(s, FTL - FTW_R - 0.62, FTW_H);
          if (!a.ok) return null;
          const landed = f >= t.t44;
          return (
            <div key={s} style={{ position: "absolute", left: a.x - 160, width: 320, top: a.y - 50, textAlign: "center", opacity: macroO }}>
              <div style={{ ...pop(f, t.half - 1, { dur: 8, from: 0.5 }), display: "inline-block" }}>
                <span
                  style={{
                    display: "inline-block", fontFamily: "Figtree, sans-serif", fontWeight: 700, fontSize: 84, letterSpacing: -1,
                    color: landed ? mix(f, t.t44, 6, "#FFFFFF", GOLD) : "#FFFFFF",
                    transform: `scale(${(1 + 0.14 * landGlow).toFixed(3)})`,
                  }}
                >
                  {val.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}

      {/* the end: his six on the line, and the formula they feed */}
      {f >= t.t44 + 6 && (
        <div style={{ position: "absolute", inset: 0, opacity: endO }}>
          <div style={{ position: "absolute", left: 60, top: 560, fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 34, color: LABEL, ...blurIn(f, t.t44 + 12, { dur: 8, rise: 8 }) }}>
            his 6 free throws, Nov 21
          </div>
          {FREETHROWWEDGES_FTS.map((ft, i) => {
            const a = P(ROW_X[i], FTL + FTW_R + 0.55, 0);
            if (!a.ok) return null;
            const at = t.t44 + 26 + i * 3;
            return (
              <div key={i} style={{ position: "absolute", left: a.x - 80, width: 160, top: a.y, textAlign: "center", fontFamily: "Inter, sans-serif", ...blurIn(f, at, { dur: 8, rise: 8 }) }}>
                <div style={{ fontSize: 26, fontWeight: 600, color: "#4A3418", lineHeight: "30px" }}>{ft.q}</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: ft.made ? "#2A1C0A" : "#7A6040", lineHeight: "40px" }}>{ft.clock}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, width: 1080, top: 1236, textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 30, color: LABEL, ...blurIn(f, t.t44 + 6, { dur: 8 }) }}>
            TSA: True Shooting Attempts
          </div>
          <div style={{ position: "absolute", left: 0, width: 1080, top: 1280, textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 56, color: "#F0F3F6", whiteSpace: "pre" }}>
            {typedHtml}
            <span style={{ opacity: typed.typing ? 1 : 0, color: "#F0F3F6" }}>▍</span>
          </div>
          <div style={{ position: "absolute", left: 60, top: 1396, fontFamily: "Inter, sans-serif", fontSize: 26, color: LABEL, ...blurIn(f, t.t44 + 10, { dur: 8 }) }}>
            Basketball-Reference glossary and play-by-play
          </div>
        </div>
      )}

      <FreeThrowWedgesPhoto t={t} />
    </>
  );
};
