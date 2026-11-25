// answer, dark, 5.69-10.67 s: "So why would the league paint it that way? It isn't a mistake, it's the width of the
// floor."
// LINE scale, then FLOOR. The hook's floor rushes in to the right corner's kink and the camera drops to shoe height
// over the boards ("So"); the light parks on the kink, "the arc ends here" ("why"); the line repaints itself from the
// top of the arc through the kink to the baseline, a wet bead running ahead ("paint"), and the straight run is
// measured, 14.2 ft ("that way?"). The camera rises fast to the floor; both kinks get a white cross and "14.2 ft",
// the right side flipping across the lane onto the left as its mirror image ("mistake"). The camera keeps rising: the
// sidelines slide in from both edges and light up, pressing in a hair ("width"); the Lufkin tape drops onto the
// left apron ("of the floor").
import React from "react";
import { blurIn, ease, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { PaintedKinkFloor } from "./PaintedKinkFloor";
import { PaintedKinkTape } from "./PaintedKinkTape";
import {
  PK_ARC_FRAME, PK_BASE_Y, PK_CORNER_X, PK_KINK_Y, paintedKinkMix as mixCam, paintedKinkProject as proj, type PaintedKinkCam,
} from "./PaintedKinkWorld";

const GREY = "#8B949E";
const INK = "#F0F3F6";

// shoe height over the right kink, looking up the floor and a little in toward the lane
const CAM_KINK: PaintedKinkCam = { tx: 22, ty: PK_KINK_Y, D: 8, pitch: 1.22, yaw: -0.3, F: 2500, cx: 580, cy: 1030 };
const CAM_KINK2: PaintedKinkCam = { ...CAM_KINK, D: 7.1, yaw: -0.26, cx: 570 };
// pulled back along the line: the whole straight run, baseline near the lens, kink up the frame
const CAM_RUN: PaintedKinkCam = { tx: 21.5, ty: 1.5, D: 30, pitch: 0.88, yaw: -0.25, F: 2250, cx: 560, cy: 1075 };
const CAM_RUN2: PaintedKinkCam = { ...CAM_RUN, D: 28.5, yaw: -0.22 };
// the floor, top-down, sidelines just outside the frame
const CAM_MID: PaintedKinkCam = { tx: 0, ty: 10, D: 60, pitch: 0, yaw: 0, F: 60 * 22.6, cx: 540, cy: 1395 - 22.6 * 15.25 };
const CAM_MID2: PaintedKinkCam = { ...CAM_MID, F: 60 * 22.2, cy: 1398 - 22.2 * 15.25 };
// the whole floor, both sidelines and their aprons in frame
const CAM_END: PaintedKinkCam = { tx: 0, ty: 10, D: 60, pitch: 0, yaw: 0, F: 60 * 19, cx: 540, cy: 1420 - 19 * 15.25 };
const CAM_END2: PaintedKinkCam = { ...CAM_END, F: 60 * 19.25, cy: 1424 - 19.25 * 15.25 };

function usePaintedKinkT() {
  const { cue, scene } = useScene();
  return {
    mount: scene.from - LEAD, end: scene.to, so: cue("So"), why: cue("why"), league: cue("league"), paint: cue("paint"),
    that: cue("that"), way: cue("way"), isnt: cue("isnt"), mistake: cue("mistake"), its: cue("its"), width: cue("width"),
    of: cue("of"), floor: cue("floor"),
  };
}
type PKT = ReturnType<typeof usePaintedKinkT>;

/** the one camera: key states on words, eased between */
function cameraOf(f: number, T: PKT): PaintedKinkCam {
  // the rise: height comes first (distance eases out), the tilt and the pan follow (in-out)
  const rise = (t: number) => t;
  const keys: [number, PaintedKinkCam, (t: number) => number][] = [
    [T.mount, PK_ARC_FRAME, ease.inOut],
    [T.why - 2, CAM_KINK, ease.inOut],
    [T.paint, CAM_KINK2, ease.linear],
    [T.way + 6, CAM_RUN, ease.inOut],
    [T.isnt, CAM_RUN2, ease.linear],
    [T.mistake, CAM_MID, rise],
    [T.its, CAM_MID2, ease.linear],
    [T.width, CAM_END, ease.inOut],
    [T.end, CAM_END2, ease.linear],
  ];
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) {
      const [a, ca] = keys[i - 1];
      const [b, cb, e] = keys[i];
      const t = Math.max(0, Math.min(1, (f - a) / Math.max(1, b - a)));
      if (e === rise) {
        const far = mixCam(ca, cb, ease.out(t));
        const turn = mixCam(ca, cb, ease.inOut(t));
        return { ...turn, D: far.D, F: far.F };
      }
      return mixCam(ca, cb, e(t));
    }
  }
  return keys[keys.length - 1][1];
}

/** a floating label: hairline from the text down to a floor point */
const PaintedKinkLabel: React.FC<{ x: number; y: number; tx: number; ty: number; text: string; f: number; at: number; out?: number }> = ({ x, y, tx, ty, text, f, at, out }) => {
  const a = prog(f, at, 8) * (out ? 1 - prog(f, out, 7, ease.in) : 1);
  if (a <= 0) return null;
  const line = prog(f, at, 10, ease.out);
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: a }}>
        <line x1={tx} y1={ty + 22} x2={tx + (x - tx) * line} y2={ty + 22 + (y - ty - 22) * line} stroke={GREY} strokeWidth={2} />
        <circle cx={x} cy={y} r={5} fill="#FFFFFF" opacity={line} />
      </svg>
      <div style={{ position: "absolute", left: tx - 300, width: 600, top: ty - 20, textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 40, color: "#E6EDF3", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.85)", ...blurIn(f, at, { dur: 8, rise: 8 }), opacity: a }}>
        {text}
      </div>
    </>
  );
};

/** a dimension along a straight floor run, drawn as a hairline with end ticks, offset in toward the lane */
function PaintedKinkDim({ cam, side, off, t, f, at, label, sub, flip }: { cam: PaintedKinkCam; side: 1 | -1; off: number; t: number; f: number; at: number; label: string; sub?: string; flip?: number }) {
  if (t <= 0) return null;
  const x = side * (PK_CORNER_X - off);
  const a = proj(cam, x, PK_BASE_Y, 0);
  const b0 = proj(cam, x, PK_KINK_Y, 0);
  if (!a.ok || !b0.ok) return null;
  const b = { x: a.x + (b0.x - a.x) * t, y: a.y + (b0.y - a.y) * t };
  const ang = Math.atan2(b0.y - a.y, b0.x - a.x);
  const nx = -Math.sin(ang) * 14, ny = Math.cos(ang) * 14;
  const mx = (a.x + b0.x) / 2, my = (a.y + b0.y) / 2;
  const txtO = prog(f, at + 8, 8);
  const lx = mx - side * 26;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={GREY} strokeWidth={2.5} />
        <line x1={a.x - nx} y1={a.y - ny} x2={a.x + nx} y2={a.y + ny} stroke={GREY} strokeWidth={2.5} />
        {t >= 1 && <line x1={b0.x - nx} y1={b0.y - ny} x2={b0.x + nx} y2={b0.y + ny} stroke={GREY} strokeWidth={2.5} />}
      </svg>
      <div style={{ position: "absolute", top: my - 30, ...(side > 0 ? { right: 1080 - lx } : { left: lx }), whiteSpace: "nowrap", textAlign: side > 0 ? "right" : "left", textShadow: "0 2px 12px rgba(0,0,0,0.8)", ...blurIn(f, at + 8, { dur: 8, rise: 6 }), opacity: txtO * (flip ?? 1) }}>
        <span style={{ fontFamily: "Figtree, sans-serif", fontWeight: 700, fontSize: 46, color: INK }}>{label}</span>
        {sub && <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 34, color: "#C9D1D9" }}> {sub}</span>}
      </div>
    </>
  );
}

/** a small white survey cross on a floor point */
const PaintedKinkCross: React.FC<{ x: number; y: number; at: number; f: number }> = ({ x, y, at, f }) => {
  const p = prog(f, at, 9, ease.back);
  if (p <= 0) return null;
  const s = 16 * p;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: prog(f, at, 3, ease.linear) }}>
      <g transform={`translate(${x} ${y}) rotate(${45 * (1 - p)})`} strokeLinecap="round">
        <line x1={-s} y1={-s} x2={s} y2={s} stroke="#0D1117" strokeWidth={9} />
        <line x1={-s} y1={s} x2={s} y2={-s} stroke="#0D1117" strokeWidth={9} />
        <line x1={-s} y1={-s} x2={s} y2={s} stroke="#FFFFFF" strokeWidth={4.5} />
        <line x1={-s} y1={s} x2={s} y2={-s} stroke="#FFFFFF" strokeWidth={4.5} />
      </g>
    </svg>
  );
};

/** dust hanging in the light over the kink, only at shoe height */
const PaintedKinkDust: React.FC<{ f: number; a: number; cx: number; cy: number }> = ({ f, a, cx, cy }) => {
  if (a <= 0) return null;
  const motes = Array.from({ length: 34 }, (_, i) => {
    const r1 = Math.sin(i * 91.7) * 0.5 + 0.5, r2 = Math.sin(i * 47.3 + 1) * 0.5 + 0.5, r3 = Math.sin(i * 13.1 + 2) * 0.5 + 0.5;
    const x = cx + (r1 - 0.5) * 760 + Math.sin(f / 60 + i) * 14;
    const y = cy - 80 - r2 * 520 - ((f * (0.25 + r3 * 0.5)) % 120);
    return <circle key={i} cx={x} cy={y} r={1 + r3 * 2.4} fill="#FFF3DC" opacity={(0.15 + 0.4 * r3) * a} />;
  });
  return <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>{motes}</svg>;
};

export const PaintedKink: React.FC = () => {
  const { f } = useScene();
  const T = usePaintedKinkT();
  const cam = cameraOf(f, T);

  // the light parks on the kink on "why"
  const park = prog(f, T.so, T.why - T.so, ease.out);
  const light: [number, number] = [6 + (22 - 6) * park, 16 + (PK_KINK_Y - 16) * park];

  // the fresh coat runs top of arc -> kink -> baseline, landing on "way?"; it dries through the rise
  const runStart = T.paint, runEnd = T.way;
  const run = prog(f, runStart, runEnd - runStart, (t) => t * (0.82 + 0.18 * t));
  const wet = f < runStart ? 0 : 1 - prog(f, runEnd + 10, 60, ease.linear) * 0.85;

  // sidelines light on "width", pressing in a hair, then settle
  const side = prog(f, T.width - 3, 7, ease.out) * (1 - 0.35 * prog(f, T.width + 20, 30, ease.linear));
  const dt = f - T.width;
  const push = dt >= 0 && dt < 40 ? Math.sin((dt / 40) * Math.PI) * Math.exp(-dt / 16) * 0.55 : 0;

  // labels, dims, crosses: projected each frame so they ride the camera
  const kink = proj(cam, 22, PK_KINK_Y, 0);
  const kinkL = proj(cam, -22, PK_KINK_Y, 0);
  const lowA = 1 - prog(f, T.isnt, 10, ease.in);
  const runDim = prog(f, T.that, T.way + 4 - T.that, ease.inOut);
  const runDimA = 1 - prog(f, T.isnt, 9, ease.in);
  const floorDim = prog(f, T.mistake - 6, 12, ease.inOut);
  // the mirror: the right side's markings flip across the lane onto the left
  const flip = prog(f, T.mistake + 2, 16, ease.inOut);

  // the tape drops onto the left apron, landing on "floor"
  const drop = T.floor - 14;
  const fall = prog(f, drop, 14, ease.in);
  const bounce = f >= T.floor ? Math.sin(((f - T.floor) / 18) * Math.PI) * Math.exp(-(f - T.floor) / 10) * 0.08 : 0;
  const tapeAt = proj(cam, -21.5, -8.0, 0); // on the maple run-off past the left baseline, inside the stage band
  const tapeR = 3.2 * (tapeAt.ok ? tapeAt.s : 19);

  return (
    <div style={{ position: "absolute", inset: 0, WebkitMaskImage: "linear-gradient(to bottom, transparent 0, transparent 520px, #000 640px, #000 1540px, transparent 1700px)" }}>
      <PaintedKinkFloor cam={cam} f={f} paint={{ run, wet }} light={light} side={side} push={push} />
      <PaintedKinkDust f={f} a={(1 - prog(f, T.that, 20)) * prog(f, T.so + 6, 16) * (kink.ok ? 1 : 0)} cx={kink.ok ? kink.x : 540} cy={kink.ok ? kink.y : 1000} />
      {kink.ok && (
        <PaintedKinkLabel f={f} at={T.why} out={T.paint + 6} x={kink.x} y={kink.y} tx={Math.max(230, Math.min(800, kink.x + 190))} ty={Math.max(660, kink.y - 250)} text="the arc ends here" />
      )}
      {lowA > 0 && runDimA > 0 && (
        <div style={{ opacity: runDimA }}>
          <PaintedKinkDim cam={cam} side={1} off={1.1} t={runDim} f={f} at={T.that} label="14.2 ft" sub="straight" />
        </div>
      )}
      {f >= T.mistake - 6 && (
        <div>
          <PaintedKinkDim cam={cam} side={1} off={1.3} t={floorDim} f={f} at={T.mistake - 6} label="14.2 ft" />
          {kink.ok && <PaintedKinkCross x={kink.x} y={kink.y} at={T.mistake - 2} f={f} />}
          {/* the mirror image swings across the lane */}
          <div style={{ position: "absolute", inset: 0, transformOrigin: "540px 0", transform: `scaleX(${(1 - 2 * flip).toFixed(4)})`, opacity: flip > 0 && flip < 1 ? 0.75 + 0.25 * flip : 0 }}>
            <PaintedKinkDim cam={cam} side={1} off={1.3} t={1} f={f} at={T.mistake - 30} label="" />
            {kink.ok && <PaintedKinkCross x={kink.x} y={kink.y} at={T.mistake - 30} f={f} />}
          </div>
          {flip >= 1 && (
            <>
              <PaintedKinkDim cam={cam} side={-1} off={1.3} t={1} f={f} at={T.mistake + 10} label="14.2 ft" />
              {/* the swung copy lands as this cross, already whole: no pop */}
              {kinkL.ok && <PaintedKinkCross x={kinkL.x} y={kinkL.y} at={T.mistake - 30} f={f} />}
            </>
          )}
        </div>
      )}
      {f >= drop && tapeAt.ok && (
        <PaintedKinkTape x={tapeAt.x} y={tapeAt.y} r={tapeR * (1 + bounce)} lift={1 - fall} turn={-18 + 10 * (1 - fall)} f={f} />
      )}
    </div>
  );
};
