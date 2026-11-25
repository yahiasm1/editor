// Hook 2, dark, 0-5.3 s: "Wembanyama's 50 points aren't the scary number. The scary number is 29."
// "The FGA cell torn out of the row." The hero is NBA.com's real Spurs box score, dark mode, redrawn at true copy,
// already sliding in from the right at frame 0, scrolled to PTS, his row tall with the Commons headshot and credit.
// Wembanyama's: his row lights. 50: the PTS cell swells out of the row, the 50 rolls up digit by digit, gold discs
// (the chances it cost) pile under it. points: the PTS header underlines. aren't: the table is flung back toward the
// start, REB 18, FTA 6, 3PA 11, 3PM 5 whipping past, the 50 sinking back and greying. scary: the scroll stops dead on
// FGA. number: FGA lights, its 29 framed. Silence: the camera pushes in, the cell starts to rattle in its seat.
// The scary number is: it lifts like a loose key, the row bends with it, it dips. 29: it is ripped out (the row
// splits, the neighbours sag into the gap), rises toward the lens to stage height, the 29 peels off its face and
// lands at the top, the cell flips over in depth and slams face down: its back is the half court, the impact shakes
// his 29 marks onto their Basketball-Reference spots, the torn table drops away. The last frame is `answer`'s first
// (keep = true). Parts: HookX2Data (the real rows and shots), HookX2Court (the court), this file (everything else).
import React from "react";
import { Img, staticFile } from "remotion";
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";
import { loadFont as loadRobotoCond } from "@remotion/google-fonts/RobotoCondensed";
import { arriveEase, countTo, ease, mix, prog, useScene } from "../../../src/engine";
import { HookX2Cols as COLS, HookX2Rows as ROWS, HookX2Shots as SHOTS } from "./HookX2Data";
import { HookX2Court, HookX2VH, HookX2VW, type HookX2Mark } from "./HookX2Court";

const ROBOTO = loadRoboto("normal", { weights: ["400", "500", "700", "900"], subsets: ["latin"] }).fontFamily;
const COND = loadRobotoCond("normal", { weights: ["400", "700", "900"], subsets: ["latin"] }).fontFamily;

// NBA.com dark mode tokens (notes/PhoneBoxScore.md, read off its stylesheet)
const N = {
  surface: "#191C23",
  lit: "#252B37",
  text: "#F3F3F3",
  muted: "#A4A2A2",
  rule: "#1A2E3D",
  page: "#000000",
  label: "#8B949E",
  hair: "#30363D",
  grey: "#6E7681",
};
const asset = (n: string) => staticFile(`wemby-50/${n}`);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const rnd = (i: number, k = 0) => {
  const s = Math.sin(i * 91.7 + k * 47.3 + 13.1) * 43758.5453;
  return s - Math.floor(s);
};

// ---- the table, in stage px at camera zoom 1 ----
const PX = 24; // panel left
const PW = 1032; // panel width
const PIN = 400; // pinned PLAYER column
const colW = (j: number) => (j === 0 ? 140 : 127);
const colX = (j: number) => {
  let x = 0;
  for (let i = 0; i < j; i++) x += colW(i);
  return x;
};
const Y = { strip: 560, team: 652, thead: 716, rows: 774 };
const STRIP_H = Y.team - Y.strip;
const TEAM_H = Y.thead - Y.team;
const HEAD_H = Y.rows - Y.thead;
const ROW_H = [96, 96, 166, 96, 96];
const ROW_Y = ROW_H.map((_, i) => Y.rows + ROW_H.slice(0, i).reduce((a, b) => a + b, 0));
const WEM = 2;
const FGM = 1;
const FGA = 2;
const FGP = 3;
const PTS = COLS.indexOf("PTS");
const CELL = { w: colW(FGA), h: ROW_H[WEM] };
const ROW_CY = ROW_Y[WEM] + ROW_H[WEM] / 2;
const PANEL_BOTTOM = ROW_Y[4] + ROW_H[4];
const SC0 = PIN + colX(PTS) - 776; // scrolled so PTS sits right of centre, +/- at the edge
// the FGA cell's centre at scroll 0, and where the camera brings it
const P0 = { x: PX + PIN + colX(FGA) + CELL.w / 2, y: ROW_CY };
const PUSH_TO = { x: 540, y: 1046 };
const PUSH_Z = 1.42;

// ---- the court, as `answer` (PlayByPlayLog) opens on it ----
const COURT_W = 760;
const PPF = COURT_W / 50; // 15.2
const APRON_PX = 2.4 * PPF;
const SLAB = { x: 160 - APRON_PX, y: 700 - APRON_PX, w: HookX2VW * PPF, h: HookX2VH * PPF };
const SLAB_C = { x: SLAB.x + SLAB.w / 2, y: SLAB.y + SLAB.h / 2 };
// the 29, as `answer`'s tally opens on it
const N29 = { left: 540 - 0.6 * 176, top: 530, size: 176 };
const N29_C = { x: 540, y: 530 + 88 };

function useT() {
  const { cue } = useScene();
  const n29 = cue("29");
  const rip = n29 - 2;
  return {
    wem: cue("Wembanyama's"),
    f50: cue("50"),
    pts: cue("points"),
    arent: cue("aren't"),
    scary: cue("scary"),
    num: cue("number"),
    the: cue("The"),
    scary2: cue("scary", 2),
    num2: cue("number", 2),
    is: cue("is"),
    n29,
    rip,
    peel: rip + 5,
    flip: rip + 6,
    slam: rip + 26,
  };
}
type T = ReturnType<typeof useT>;

/** the scroll offset of the stat columns: parked at PTS, then flung back to the start, stopping dead on FGA */
function hookX2Scroll(f: number, t: T) {
  const a = t.arent - 1;
  const d = t.scary - a;
  if (f < a) return SC0;
  const u = prog(f, a, d, ease.linear);
  const k = 3.4;
  return SC0 * (1 - (1 - Math.exp(-k * u)) / (1 - Math.exp(-k)));
}

/** the camera on the table: identity until the stop, then a slow push onto the FGA cell */
function hookX2Cam(f: number, t: T) {
  const p = prog(f, t.num + 12, t.rip - (t.num + 12), ease.inOut);
  const z = lerp(1, PUSH_Z, p);
  const c = { x: lerp(P0.x, PUSH_TO.x, p), y: lerp(P0.y, PUSH_TO.y, p) };
  return { z, tx: c.x - z * P0.x, ty: c.y - z * P0.y };
}

/** how far the FGA cell has been lifted out of its seat (table px), before the rip */
function hookX2Lift(f: number, t: T) {
  let l = 11 * prog(f, t.the, 9, ease.back);
  l += 13 * prog(f, t.num2, 16, ease.out);
  l += 9 * prog(f, t.num2 + 16, t.is - t.num2 - 16, ease.linear);
  l -= 13 * prog(f, t.is - 1, 6, ease.out);
  return l;
}

/** BBR glyph-free disc: the reel's chance, a flat gold disc seen from the stands */
const HookX2Disc: React.FC<{ x: number; y: number; rx: number; o: number; id: string; dim: number }> = ({ x, y, rx, o, id, dim }) => {
  const ry = rx * 0.36;
  const th = rx * 0.26;
  return (
    <g opacity={o} style={{ filter: dim > 0 ? `saturate(${1 - 0.8 * dim}) brightness(${1 - 0.45 * dim})` : undefined }}>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8A5E14" />
          <stop offset="0.35" stopColor="#C58D27" />
          <stop offset="0.7" stopColor="#A87517" />
          <stop offset="1" stopColor="#6E4A10" />
        </linearGradient>
        <radialGradient id={`${id}t`} cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#FFE3A0" />
          <stop offset="0.45" stopColor="#F2B33D" />
          <stop offset="1" stopColor="#C78D27" />
        </radialGradient>
      </defs>
      <path d={`M${x - rx} ${y} L${x - rx} ${y + th} A${rx} ${ry} 0 0 0 ${x + rx} ${y + th} L${x + rx} ${y} A${rx} ${ry} 0 0 1 ${x - rx} ${y} Z`} fill={`url(#${id}s)`} />
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${id}t)`} stroke="#9A6A18" strokeWidth={1.2} />
      <ellipse cx={x} cy={y} rx={rx * 0.86} ry={ry * 0.86} fill="none" stroke="#FFE7B0" strokeOpacity={0.35} strokeWidth={1} />
    </g>
  );
};

// the heap under the swollen 50: six chances, relative to the cell's bottom centre
const PILE = [
  { x: -50, y: 30 },
  { x: 2, y: 38 },
  { x: 52, y: 31 },
  { x: -26, y: 16 },
  { x: 28, y: 15 },
  { x: 0, y: 1 },
];

/** a number that rolls up its digits like a scoreboard drum */
const HookX2Drum: React.FC<{ v: number; size: number; color: string }> = ({ v, size, color }) => {
  const lh = size * 1.05;
  const digit = (pos: number, key: string) => {
    // pos: continuous value of this digit (0..10)
    const base = Math.floor(pos);
    const fr = pos - base;
    return (
      <div key={key} style={{ position: "relative", width: size * 0.58, height: lh, overflow: "hidden" }}>
        {[0, 1].map((k) => (
          <div key={k} style={{ position: "absolute", left: 0, width: "100%", textAlign: "center", top: (k - fr) * lh, height: lh, lineHeight: `${lh}px` }}>
            {(base + k) % 10}
          </div>
        ))}
      </div>
    );
  };
  const tens = v / 10;
  const ones = v % 10;
  return (
    <div style={{ display: "flex", fontFamily: ROBOTO, fontWeight: 700, fontSize: size, color, fontVariantNumeric: "tabular-nums" }}>
      {digit(tens, "t")}
      {digit(ones, "o")}
    </div>
  );
};

/** the cell's own face: surface, rule, and the 29 right-aligned as NBA.com prints it. Torn out, it keeps the ragged
 *  rule along its top, slivers of its neighbours' digits (FGM 20, FG% 69.0) on its edges, and a bevelled body. */
const HookX2CellFace: React.FC<{ w: number; h: number; k: number; frame: number; num: number; bold: number; lit: number; torn?: number }> = ({ w, h, k, frame, num, bold, lit, torn = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, background: `linear-gradient(180deg, ${N.lit} 0%, #20252F 100%)`, borderTop: torn > 0 ? undefined : `${2 * k}px solid ${N.rule}`, boxSizing: "border-box", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent 30%, rgba(255,255,255,${(0.06 + 0.08 * lit).toFixed(3)}) 50%, transparent 70%)` }} />
    {torn > 0 && (
      <>
        {/* slivers of the neighbours, cut by the tear */}
        <div style={{ position: "absolute", left: -0.78 * 44 * k, top: 0, height: h, display: "flex", alignItems: "center", fontFamily: ROBOTO, fontSize: 44 * k, color: N.text, opacity: 0.35 * torn }}>20</div>
        <div style={{ position: "absolute", right: -0.4 * 44 * k, top: 0, height: h, display: "flex", alignItems: "center", fontFamily: ROBOTO, fontSize: 44 * k, color: N.text, opacity: 0.35 * torn }}>6</div>
        <svg width={w} height={h} viewBox={`0 0 ${CELL.w} ${CELL.h}`} preserveAspectRatio="none" style={{ position: "absolute", left: 0, top: 0, opacity: torn }}>
          {/* the ragged rule the cell tore along, and the rough cut down both sides */}
          <path d={`M0 0 ${Array.from({ length: 16 }, (_, q) => `L${((q + 1) * CELL.w) / 16} ${(1.5 + rnd(q, 9) * 3.5).toFixed(2)}`).join(" ")} L${CELL.w} 0 Z`} fill={N.rule} />
          <path d={`M0 0 ${Array.from({ length: 14 }, (_, q) => `L${(rnd(q, 21) * 2.6).toFixed(2)} ${((q + 1) * CELL.h) / 14}`).join(" ")} L0 ${CELL.h} Z`} fill="#0E1116" />
          <path d={`M${CELL.w} 0 ${Array.from({ length: 14 }, (_, q) => `L${(CELL.w - rnd(q, 22) * 2.6).toFixed(2)} ${((q + 1) * CELL.h) / 14}`).join(" ")} L${CELL.w} ${CELL.h} Z`} fill="#0E1116" />
          <line x1={0} y1={CELL.h - 0.6} x2={CELL.w} y2={CELL.h - 0.6} stroke="#000" strokeOpacity={0.6} strokeWidth={1.2} />
        </svg>
        <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 ${(3 * k).toFixed(1)}px ${(4 * k).toFixed(1)}px rgba(255,255,255,0.07), inset 0 ${(-6 * k).toFixed(1)}px ${(10 * k).toFixed(1)}px rgba(0,0,0,0.35)` }} />
      </>
    )}
    {num > 0 && (
      <div style={{ position: "absolute", right: 16 * k, top: 0, height: h, display: "flex", alignItems: "center", fontFamily: ROBOTO, fontWeight: bold > 0.5 ? 700 : 400, fontSize: 44 * k, color: "#FFFFFF", opacity: num }}>29</div>
    )}
    {frame > 0 && (
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect x={3} y={3} width={w - 6} height={h - 6} rx={4 * Math.min(k, 2)} fill="none" stroke="#FFFFFF" strokeOpacity={0.85 * frame} strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={torn > 0 ? 0 : 1 - frame} />
      </svg>
    )}
  </div>
);

export const HookX2Impl: React.FC = () => {
  const { f, theme } = useScene();
  const t = useT();

  // ---------- the table ----------
  const sc = hookX2Scroll(f, t);
  const vel = sc - hookX2Scroll(f - 1, t);
  const cam = hookX2Cam(f, t);
  // already sliding in from the right at frame 0
  const slide = 430 * (1 - prog(f, -4, 34, arriveEase(34)));
  const slideV = 430 * (prog(f, -4, 34, arriveEase(34)) - prog(f - 1, -4, 34, arriveEase(34)));
  // the stop: a hard jolt when the scroll is caught on FGA
  const js = f - t.scary;
  const jolt = js >= 0 && js < 14 ? 9 * Math.exp(-js / 3) * Math.sin(js * 1.8) : 0;
  // after the rip the torn table drops away below
  const dr = f - (t.rip + 4);
  const fallY = dr > 0 ? 0.95 * dr * dr : 0;
  const fallR = dr > 0 ? 0.11 * dr : 0;
  const fallO = 1 - prog(f, t.rip + 24, 8, ease.linear);
  const fallBlur = dr > 0 ? Math.min(14, dr * 0.7) : 0;
  const dimRows = 1 - 0.55 * prog(f, t.num + 18, 50);
  const rowLit = prog(f, t.wem, 8);
  const sweep = prog(f, t.wem, 34, ease.inOut);
  const hBlur = Math.min(28, Math.abs(vel) * 0.18 + Math.abs(slideV) * 0.35);
  const ripped = f >= t.rip;
  const dRip = f - t.rip;

  // the FGA key before the rip: lift, rattle, the seam round it
  const lift = ripped ? 0 : hookX2Lift(f, t);
  const ramp = prog(f, t.num + 50, t.rip - (t.num + 50), ease.in);
  const rat = ramp * 2.8 + (f >= t.the ? 0.8 : 0) * (1 - prog(f, t.the, 10));
  const rx = rat * Math.sin(f * 2.7);
  const rrot = rat * 0.32 * Math.sin(f * 3.3 + 1);
  const seam = 7 * prog(f, t.num + 56, 50);
  const frameIn = prog(f, t.num + 2, 12, ease.inOut);
  const boldIn = f >= t.num ? 1 : 0;
  // neighbours: lean up toward the lifting key, then sag into the gap when it is torn out
  const sag = ripped ? 17 * (1 - Math.exp(-dRip / 2.2)) + 5 * Math.exp(-dRip / 4) * Math.sin(dRip * 0.95) : -(lift / 33) * 4;
  const split = ripped ? 12 * (1 - Math.exp(-dRip / 2.5)) : 0;

  // ---------- PTS swells, on its heap of chances ----------
  const s50up = prog(f, t.f50 - 14, 14, arriveEase(14));
  const s50 = s50up * (1 - 0.8 * prog(f, t.arent, 14, ease.inOut));
  const grey = prog(f, t.arent + 2, 10);
  const v50 = countTo(f, t.f50 - 14, 14, 0, 50, ease.out);
  const ptsX = PX + PIN + colX(PTS) - sc; // table x of the PTS cell
  const sw = 1 + 0.75 * s50;
  const swW = CELL.w * sw;
  const swH = CELL.h * sw;
  const swCx = ptsX + CELL.w / 2;
  const swCy = ROW_CY - 120 * s50;
  const breathe = 1 + 0.012 * Math.sin(f * 0.18) * s50up;
  const ptsU = prog(f, t.pts, 9, ease.inOut);

  // ---------- the card (the torn cell) ----------
  const camR = hookX2Cam(t.rip, t);
  const cw0 = CELL.w * camR.z;
  const ch0 = CELL.h * camR.z;
  const startC = { x: camR.tx + camR.z * P0.x, y: camR.ty + camR.z * (P0.y - hookX2Lift(t.rip - 1, t)) };
  const u = prog(f, t.rip, t.slam - t.rip, ease.linear);
  const gr = prog(f, t.rip, 20, ease.out);
  const cw = lerp(cw0, SLAB.w, gr);
  const ch = lerp(ch0, SLAB.h, gr);
  const kFace = cw / CELL.w; // the face's own scale (k = 1 is the table cell at zoom 1)
  const gLens = 1 + 0.27 * Math.pow(Math.sin(Math.PI * u), 0.75);
  const cx = lerp(startC.x, SLAB_C.x, ease.inOut(u));
  const cy = lerp(startC.y, SLAB_C.y, ease.inOut(u)) - 80 * Math.sin(Math.PI * u);
  const th = 180 * (1 - Math.cos((prog(f, t.flip, t.slam - t.flip, ease.linear) * Math.PI) / 2));
  const thick = Math.max(6, 0.024 * ch);
  const flying = ripped && f < t.slam;
  const landed = f >= t.slam;
  const dS = f - t.slam;

  // marks: thrown off their spots while the cell turns, shaken back onto them by the impact
  const marks: HookX2Mark[] = SHOTS.map((s, i) => {
    const ox = (rnd(i, 1) - 0.5) * 8;
    const oy = (rnd(i, 2) - 0.5) * 8 - 2;
    if (!landed) return { dx: ox, dy: oy, o: 1, s: 1 + 0.3 * rnd(i, 3) };
    const dist = Math.hypot(s.x, s.y);
    const delay = Math.min(4, dist / 7);
    const tt = dS - delay;
    if (tt < 0) return { dx: ox, dy: oy, o: 1, s: 1 };
    if (tt >= 14) return { dx: 0, dy: 0, o: 1, s: 1 };
    const a = Math.exp(-tt / 2.8) * Math.cos(tt * 0.8);
    return { dx: ox * a, dy: oy * a, o: 1, s: 1 + 0.45 * Math.abs(a) * Math.exp(-tt / 3) };
  });
  const shake = landed && dS < 14 ? Math.exp(-dS / 3.4) : 0;
  const shX = shake * 10 * Math.sin(dS * 2.2);
  const shY = shake * 13 * Math.cos(dS * 1.7 + 0.4);
  const flash = landed && dS < 12 ? 0.22 * Math.exp(-dS / 3) : 0;

  // ---------- the 29 peels off the face and lands at the top ----------
  const pl = prog(f, t.peel, 16, arriveEase(16));
  const peeled = f >= t.peel;
  const peelC = (() => {
    const gP = 1 + 0.27 * Math.pow(Math.sin(Math.PI * prog(t.peel, t.rip, t.slam - t.rip, ease.linear)), 0.75);
    const uP = prog(t.peel, t.rip, t.slam - t.rip, ease.linear);
    const grP = prog(t.peel, t.rip, 20, ease.out);
    const cwP = lerp(cw0, SLAB.w, grP);
    const kP = cwP / CELL.w;
    const cxP = lerp(startC.x, SLAB_C.x, ease.inOut(uP));
    const cyP = lerp(startC.y, SLAB_C.y, ease.inOut(uP)) - 80 * Math.sin(Math.PI * uP);
    const font = 44 * kP * gP;
    return { x: cxP + gP * (cwP / 2 - 16 * kP) - 0.56 * font, y: cyP, font };
  })();
  const n29c = { x: lerp(peelC.x, N29_C.x, pl), y: lerp(peelC.y, N29_C.y, pl) - 120 * Math.sin(Math.PI * pl) * (1 - pl) };
  const n29s = lerp(peelC.font, N29.size, pl) / N29.size;
  const n29v = Math.hypot(n29c.x - lerp(peelC.x, N29_C.x, prog(f - 1, t.peel, 16, arriveEase(16))), 0) + Math.abs(pl - prog(f - 1, t.peel, 16, arriveEase(16))) * 400;
  const land29 = prog(f, t.peel + 16, 8, ease.out);
  const squash = f >= t.peel + 16 ? 1 + 0.07 * (1 - land29) : 1;
  const xfade = prog(f, t.peel, 6, ease.linear);
  const n29Shake = shake * 0.4;

  // ---------- render ----------
  const tableTransform = `translate(${(cam.tx + slide + jolt).toFixed(2)}px, ${(cam.ty + fallY).toFixed(2)}px) rotate(${fallR.toFixed(3)}deg) scale(${cam.z.toFixed(5)})`;

  const statCell = (row: number, j: number, extra?: React.CSSProperties, content?: React.ReactNode) => {
    const r = ROWS[row];
    const h = ROW_H[row];
    const big = row === WEM;
    return (
      <div
        key={`${row}-${j}`}
        style={{
          position: "absolute", left: PX + PIN + colX(j) - sc, top: ROW_Y[row], width: colW(j), height: h,
          display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 16, boxSizing: "border-box",
          fontFamily: ROBOTO, fontSize: big ? 44 : 36, fontWeight: j === 0 ? 700 : 400, color: N.text, whiteSpace: "nowrap",
          ...extra,
        }}
      >
        {content ?? r.cells[j]}
      </div>
    );
  };

  const visible = (j: number) => {
    const x = PIN + colX(j) - sc;
    return x + colW(j) > PIN - 10 && x < PW + 10;
  };

  return (
    <>
      {/* ===== the table ===== */}
      {fallO > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: tableTransform, opacity: fallO, filter: fallBlur > 0.5 ? `blur(${fallBlur.toFixed(1)}px)` : undefined }}>
          {/* panel body and its shadow */}
          <div style={{ position: "absolute", left: PX, top: Y.strip, width: PW, height: PANEL_BOTTOM - Y.strip + 60, borderRadius: 22, background: N.surface, boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 0 0 1px #262B33", WebkitMaskImage: `linear-gradient(180deg, #000 0px, #000 ${PANEL_BOTTOM - Y.strip - 40}px, transparent ${PANEL_BOTTOM - Y.strip + 50}px)`, maskImage: `linear-gradient(180deg, #000 0px, #000 ${PANEL_BOTTOM - Y.strip - 40}px, transparent ${PANEL_BOTTOM - Y.strip + 50}px)` }} />
          {/* game strip: away left, home right, real logos */}
          <div style={{ position: "absolute", left: PX, top: Y.strip, width: PW, height: STRIP_H, borderRadius: "22px 22px 0 0", background: "#14171D", borderBottom: `2px solid ${N.rule}`, fontFamily: ROBOTO, opacity: dimRows }}>
            <Img src={asset("hookx2-pelicans.svg")} style={{ position: "absolute", left: 34, top: 12, width: 68, height: 68 }} />
            <div style={{ position: "absolute", left: 118, top: 14, fontFamily: COND, fontSize: 26, color: N.muted, letterSpacing: 1 }}>NOP</div>
            <div style={{ position: "absolute", left: 118, top: 38, fontSize: 44, fontWeight: 700, color: N.muted }}>91</div>
            <div style={{ position: "absolute", left: 0, width: PW, top: 18, textAlign: "center", fontSize: 28, fontWeight: 700, color: N.text, letterSpacing: 1 }}>FINAL</div>
            <div style={{ position: "absolute", left: 0, width: PW, top: 52, textAlign: "center", fontSize: 24, color: N.muted }}>Sat, Nov 21</div>
            <div style={{ position: "absolute", right: 118, top: 14, fontFamily: COND, fontSize: 26, color: N.muted, letterSpacing: 1, textAlign: "right" }}>SAS</div>
            <div style={{ position: "absolute", right: 118, top: 38, fontSize: 44, fontWeight: 700, color: N.text, textAlign: "right" }}>114</div>
            <Img src={asset("hookx2-spurs.svg")} style={{ position: "absolute", right: 34, top: 12, width: 68, height: 68 }} />
          </div>
          {/* team header */}
          <div style={{ position: "absolute", left: PX, top: Y.team, width: PW, height: TEAM_H, opacity: dimRows }}>
            <Img src={asset("hookx2-spurs.svg")} style={{ position: "absolute", left: 24, top: 10, width: 44, height: 44 }} />
            <div style={{ position: "absolute", left: 82, top: 14, fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 32, color: N.text, transform: "scaleX(1.16)", transformOrigin: "left center", letterSpacing: 0.5 }}>SAN ANTONIO SPURS</div>
          </div>
          {/* row grounds and rules */}
          {ROWS.map((_, i) => (
            <div key={`bg${i}`} style={{ position: "absolute", left: PX, top: ROW_Y[i], width: PW, height: ROW_H[i], borderTop: `2px solid ${N.rule}`, background: i === WEM ? mix(f, t.wem, 8, N.surface, N.lit) : N.surface, opacity: i === WEM ? 1 : dimRows * (i === 0 || i === 4 ? 0.6 : 1), boxSizing: "border-box" }} />
          ))}
          {/* the light sweep across his row on his name */}
          {sweep > 0 && sweep < 1 && (
            <div style={{ position: "absolute", left: PX, top: ROW_Y[WEM], width: PW, height: ROW_H[WEM], overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, height: "100%", width: 260, left: -260 + sweep * (PW + 260), background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)" }} />
            </div>
          )}
          {/* the scrolled stat columns, clipped to the table body */}
          <div style={{ position: "absolute", left: PX + PIN, top: Y.thead, width: PW - PIN, height: 1300, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: -(PX + PIN), top: -Y.thead, width: 1080, height: 2000, filter: hBlur > 0.6 ? `url(#hx2-hblur)` : undefined }}>
              {/* header row */}
              {COLS.map((c, j) => {
                if (!visible(j)) return null;
                const isF = j === FGA;
                const isP = j === PTS;
                return (
                  <div key={`h${j}`} style={{ position: "absolute", left: PX + PIN + colX(j) - sc, top: Y.thead, width: colW(j), height: HEAD_H, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", paddingRight: 16, paddingBottom: 14, boxSizing: "border-box", fontFamily: COND, fontSize: 27, letterSpacing: 2, color: isF ? mix(f, t.num, 6, N.muted, "#FFFFFF") : isP ? mix(f, t.pts, 6, N.muted, "#FFFFFF") : N.muted, fontWeight: (isF && f >= t.num) || (isP && f >= t.pts && f < t.arent + 10) ? 700 : 400, opacity: isF ? 1 : dimRows }}>
                    {c}
                    {isP && ptsU > 0 && <div style={{ position: "absolute", right: 16, bottom: 4, height: 4, width: 62 * ptsU, background: "#FFFFFF", opacity: 1 - 0.7 * grey }} />}
                  </div>
                );
              })}
              {/* rows */}
              {ROWS.map((r, i) =>
                COLS.map((_, j) => {
                  if (!visible(j)) return null;
                  if (i === WEM && (j === FGA || j === FGM || j === FGP)) return null;
                  if (i === WEM && j === PTS && s50up > 0.02) return statCell(i, j, { opacity: 0.25 });
                  const o = i === WEM ? 1 : dimRows * (i === 0 || i === 4 ? 0.6 : 1);
                  const shiftX = i === WEM && ripped ? (j < FGA ? -split : split) : 0;
                  return statCell(i, j, { opacity: o, transform: shiftX ? `translateX(${shiftX.toFixed(1)}px)` : undefined, fontWeight: j === 0 ? 700 : 400 });
                }),
              )}
              {/* the cavity the key leaves */}
              {(seam > 0.2 || ripped) && (
                <div style={{ position: "absolute", left: PX + PIN + colX(FGA) - sc - 2, top: ROW_Y[WEM] + 2, width: CELL.w + 4, height: CELL.h - 2, background: "radial-gradient(ellipse at 50% 40%, #0B0E13 0%, #050608 100%)", boxShadow: "inset 0 10px 18px rgba(0,0,0,0.9)", opacity: ripped ? 1 : clamp01(seam / 3) }}>
                  {ripped && (
                    <svg width={CELL.w + 4} height={CELL.h - 2} style={{ position: "absolute", left: 0, top: 0 }}>
                      {/* torn rule along the top of the seat */}
                      <path d={`M0 1 ${Array.from({ length: 12 }, (_, q) => `L${((q + 1) * (CELL.w + 4)) / 12} ${1 + rnd(q, 9) * 6}`).join(" ")}`} stroke={N.rule} strokeWidth={2} fill="none" />
                      <rect x={CELL.w / 2 - 6} y={CELL.h / 2 - 10} width={16} height={18} rx={3} fill="#12161D" stroke="#222833" />
                    </svg>
                  )}
                </div>
              )}
              {/* FGM 20 and FG% 69.0: lean toward the key, then sag into the gap */}
              {[FGM, FGP].map((j) => {
                const left = j === FGM;
                const ang = left ? sag : -sag;
                const o = ripped ? 1 : 1;
                return statCell(WEM, j, {
                  transformOrigin: left ? "0% 100%" : "100% 100%",
                  transform: `translateX(${(ripped ? (left ? -split : split) : 0).toFixed(1)}px) rotate(${ang.toFixed(2)}deg)`,
                  background: N.lit,
                  borderTop: `2px solid ${N.rule}`,
                  boxShadow: ripped ? "0 8px 14px rgba(0,0,0,0.5)" : undefined,
                  opacity: o,
                });
              })}
              {/* the FGA key, in its seat until the rip */}
              {!ripped && (
                <div
                  style={{
                    position: "absolute", left: PX + PIN + colX(FGA) - sc, top: ROW_Y[WEM], width: CELL.w, height: CELL.h,
                    transform: `translate(${rx.toFixed(2)}px, ${(-lift).toFixed(2)}px) rotate(${rrot.toFixed(2)}deg)`,
                    boxShadow: lift > 0.5 ? `0 ${(lift * 0.6).toFixed(1)}px ${(lift * 1.1).toFixed(1)}px rgba(0,0,0,0.75)` : undefined,
                    outline: seam > 0.2 ? `${(seam * 0.5).toFixed(1)}px solid #07090C` : undefined,
                  }}
                >
                  <HookX2CellFace w={CELL.w} h={CELL.h} k={1} frame={frameIn} num={1} bold={boldIn} lit={rowLit} />
                </div>
              )}
            </div>
          </div>
          {/* pinned PLAYER column, over the scrolled body, with its shadow */}
          <div style={{ position: "absolute", left: PX, top: Y.thead, width: PIN, height: HEAD_H, display: "flex", alignItems: "flex-end", paddingLeft: 26, paddingBottom: 14, boxSizing: "border-box", fontFamily: COND, fontSize: 27, letterSpacing: 2, color: N.muted, background: N.surface, boxShadow: "8px 0 8px -5px rgba(0,0,0,0.55)", opacity: dimRows }}>PLAYER</div>
          {ROWS.map((r, i) => {
            const big = i === WEM;
            const o = big ? 1 : dimRows * (i === 0 || i === 4 ? 0.6 : 1);
            return (
              <div key={`p${i}`} style={{ position: "absolute", left: PX, top: ROW_Y[i], width: PIN, height: ROW_H[i], background: big ? mix(f, t.wem, 8, N.surface, N.lit) : N.surface, borderTop: `2px solid ${N.rule}`, boxSizing: "border-box", boxShadow: "8px 0 8px -5px rgba(0,0,0,0.55)", opacity: o, overflow: "hidden" }}>
                {big ? (
                  <>
                    {/* the Commons headshot card */}
                    <div style={{ position: "absolute", left: 14, top: 12, width: 124, height: ROW_H[i] - 24, borderRadius: 12, overflow: "hidden", boxShadow: "0 0 0 1px rgba(255,255,255,0.16)", background: "#000" }}>
                      <Img src={asset("hookx2-wemby-portland.jpg")} style={{ position: "absolute", left: -22, top: -4, width: 168, height: 168, transform: `scale(${(1 + 0.08 * prog(f, 0, 300, ease.linear)).toFixed(4)})`, transformOrigin: "50% 35%" }} />
                    </div>
                    <div style={{ position: "absolute", left: 152, top: 36, display: "flex", alignItems: "baseline", whiteSpace: "nowrap", fontFamily: COND, fontSize: 36, color: "#FFFFFF", fontWeight: rowLit > 0.5 ? 700 : 400, textShadow: rowLit > 0 ? `0 0 ${14 * rowLit}px rgba(255,255,255,${(0.35 * rowLit).toFixed(2)})` : undefined }}>
                      {r.name}
                      <span style={{ marginLeft: 8, fontSize: 22, fontWeight: 900, color: N.text }}>{r.pos}</span>
                    </div>
                    <div style={{ position: "absolute", left: 152, top: 92, whiteSpace: "nowrap", fontFamily: "Inter, sans-serif", fontSize: 18, lineHeight: "24px", color: N.label }}>
                      Frenchieinportland
                      <br />
                      CC BY 4.0
                    </div>
                  </>
                ) : (
                  <div style={{ position: "absolute", left: 26, top: 0, height: ROW_H[i], display: "flex", alignItems: "center", fontFamily: COND, fontSize: 34, color: N.text }}>
                    {r.name}
                    {r.pos && <span style={{ marginLeft: 9, fontSize: 22, fontWeight: 900 }}>{r.pos}</span>}
                  </div>
                )}
              </div>
            );
          })}
          {/* the plain label over FGA, with its hairline */}
          {f >= t.num + 4 && (
            <div style={{ position: "absolute", left: PX + PIN + colX(FGA) - sc + CELL.w / 2 - 170, top: Y.team + 2, width: 340, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 30, color: N.label, opacity: prog(f, t.num + 4, 8) }}>
              field goal attempts
              <div style={{ position: "absolute", left: 169, top: 40, width: 2, height: 22 * prog(f, t.num + 8, 8), background: N.hair }} />
            </div>
          )}
          {/* the swollen PTS cell on its heap of chances */}
          {s50up > 0.02 && (
            <>
              <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                <ellipse cx={swCx} cy={swCy + swH / 2 + 52} rx={110} ry={20} fill="#000" opacity={0.45 * s50up} style={{ filter: "blur(8px)" }} />
                {PILE.map((p, i) => {
                  const at = t.f50 - 12 + i * 4;
                  if (f < at - 9) return null;
                  const fall = prog(f, at - 9, 9, ease.in);
                  const b = f >= at ? 7 * Math.exp(-(f - at) / 3) * Math.abs(Math.sin((f - at) * 0.9)) : 0;
                  const y = swCy + swH / 2 + p.y * 1.2 - 150 * (1 - fall) - b;
                  return <HookX2Disc key={i} id={`hx2d${i}`} x={swCx + p.x * 1.25} y={y} rx={40} o={clamp01(fall * 3)} dim={grey} />;
                })}
              </svg>
              <div style={{ position: "absolute", left: swCx - swW / 2, top: swCy - swH / 2, width: swW, height: swH, transform: `scale(${breathe.toFixed(4)})`, borderRadius: 10 * s50, background: `linear-gradient(180deg, ${N.lit}, #1D222B)`, borderTop: `2px solid ${N.rule}`, boxShadow: `0 ${(30 * s50).toFixed(1)}px ${(50 * s50).toFixed(1)}px rgba(0,0,0,${(0.6 * s50up).toFixed(2)}), 0 0 0 1px rgba(255,255,255,${(0.12 * s50).toFixed(3)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <HookX2Drum v={v50} size={44 + 130 * s50} color={mix(f, t.arent + 2, 10, "#FFFFFF", N.grey)} />
              </div>
            </>
          )}
        </div>
      )}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="hx2-hblur" x="-20%" y="-5%" width="140%" height="110%">
          <feGaussianBlur stdDeviation={`${hBlur.toFixed(2)} 0`} />
        </filter>
      </svg>

      {/* ===== splinters of the cell's rule, flung at the rip ===== */}
      {ripped && dRip < 26 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 26 }, (_, i) => {
            const side = i % 4;
            const a = rnd(i, 4);
            const px = side < 2 ? startC.x + (a - 0.5) * cw0 : startC.x + (side === 2 ? -1 : 1) * cw0 / 2;
            const py = side < 2 ? startC.y + (side === 0 ? -1 : 1) * ch0 / 2 : startC.y + (a - 0.5) * ch0;
            const ang = Math.atan2(py - startC.y, px - startC.x) + (rnd(i, 5) - 0.5) * 0.9;
            const sp = 9 + rnd(i, 6) * 14;
            const x = px + Math.cos(ang) * sp * dRip * (1 - dRip / 60);
            const y = py + Math.sin(ang) * sp * dRip * (1 - dRip / 60) + 0.55 * dRip * dRip;
            const len = 8 + rnd(i, 7) * 22;
            return <rect key={i} x={x - len / 2} y={y - 1.5} width={len} height={3 + (i % 3)} fill={i % 3 ? "#2A3446" : "#3A4558"} opacity={1 - dRip / 26} transform={`rotate(${(rnd(i, 8) * 360 + dRip * 18 * (i % 2 ? 1 : -1)).toFixed(1)} ${x} ${y})`} />;
          })}
        </svg>
      )}

      {/* ===== the torn cell in flight: grows toward the lens, flips over in depth ===== */}
      {flying && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, perspective: "2300px", perspectiveOrigin: `${cx.toFixed(1)}px ${cy.toFixed(1)}px` }}>
          {/* its shadow on the ground, falling behind as it rises */}
          <div style={{ position: "absolute", left: cx - (cw * gLens) / 2 + 30 * (gLens - 1) * 4, top: cy - (ch * gLens) / 2 + 160 * (gLens - 1), width: cw * gLens * Math.max(0.15, Math.abs(Math.cos((th * Math.PI) / 180))), height: ch * gLens * 0.96, marginLeft: (cw * gLens * (1 - Math.max(0.15, Math.abs(Math.cos((th * Math.PI) / 180))))) / 2, background: "rgba(0,0,0,0.55)", filter: `blur(${(20 + 90 * (gLens - 1)).toFixed(1)}px)`, borderRadius: 20 }} />
          <div style={{ position: "absolute", left: cx - cw / 2, top: cy - ch / 2, width: cw, height: ch, transformStyle: "preserve-3d", transform: `scale(${gLens.toFixed(4)}) rotateX(${th.toFixed(2)}deg)` }}>
            {/* front: the cell itself */}
            <div style={{ position: "absolute", left: 0, top: 0, width: cw, height: ch, transform: `translateZ(${(thick / 2).toFixed(2)}px)`, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: 6 * kFace * 0.2, overflow: "hidden", boxShadow: "0 0 0 1px rgba(255,255,255,0.10)" }}>
              <HookX2CellFace w={cw} h={ch} k={kFace} frame={1 - prog(f, t.rip, 8)} num={peeled ? 0 : 1} bold={1} lit={1} torn={prog(f, t.rip, 3)} />
            </div>
            {/* the edges: the cell has a body */}
            {[0, 1].map((e) => (
              <div key={e} style={{ position: "absolute", left: 0, top: (e ? ch : 0) - thick / 2, width: cw, height: thick, transform: "rotateX(90deg)", background: "linear-gradient(90deg, #2A2F38, #4A505A 40%, #2A2F38)" }} />
            ))}
            {/* back: the court */}
            <div style={{ position: "absolute", left: 0, top: 0, width: cw, height: cw * (HookX2VH / HookX2VW), transform: `rotateX(180deg) translateZ(${(thick / 2).toFixed(2)}px)`, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
              <HookX2Court w={cw} f={f} marks={marks} ppf={PPF} />
            </div>
          </div>
        </div>
      )}

      {/* ===== landed: the court, face down, exactly where `answer` opens on it ===== */}
      {landed && (
        <>
          {dS < 18 && (
            <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
              {Array.from({ length: 44 }, (_, i) => {
                const side = i % 4;
                const a = rnd(i, 11);
                const px = side < 2 ? SLAB.x + a * SLAB.w : SLAB.x + (side === 2 ? 0 : SLAB.w);
                const py = side < 2 ? SLAB.y + (side === 0 ? 0 : SLAB.h) : SLAB.y + a * SLAB.h;
                const dx = side === 2 ? -1 : side === 3 ? 1 : (a - 0.5) * 0.6;
                const dy = side === 0 ? -1 : side === 1 ? 1 : (a - 0.5) * 0.6;
                const d = (40 + rnd(i, 12) * 120) * (1 - Math.exp(-dS / 4));
                return <circle key={i} cx={px + dx * d} cy={py + dy * d} r={1.5 + rnd(i, 13) * 3} fill={i % 3 ? "#C9B08A" : "#E8EDF2"} opacity={0.75 * (1 - dS / 18)} />;
              })}
            </svg>
          )}
          <div style={{ position: "absolute", left: SLAB.x, top: SLAB.y, width: SLAB.w, height: SLAB.h, transform: shake > 0 ? `translate(${shX.toFixed(2)}px, ${shY.toFixed(2)}px)` : undefined, filter: flash > 0.005 ? `brightness(${(1 + flash).toFixed(3)})` : undefined }}>
            <HookX2Court w={SLAB.w} f={f} marks={marks} ppf={PPF} />
          </div>
        </>
      )}

      {/* ===== the 29, peeled off the face, landing at the top ===== */}
      {peeled && (
        <>
          {xfade < 1 && (
            <div style={{ position: "absolute", left: n29c.x - 0.56 * n29s * N29.size, top: n29c.y - (n29s * N29.size) / 2, fontFamily: ROBOTO, fontWeight: 700, fontSize: n29s * N29.size, lineHeight: 1, color: "#FFFFFF", opacity: 1 - xfade, whiteSpace: "nowrap" }}>29</div>
          )}
          <div
            style={{
              position: "absolute", left: N29.left, top: N29.top, fontFamily: theme.font.caption, fontWeight: 700, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", fontSize: N29.size, lineHeight: 1, color: "#FFFFFF",
              opacity: xfade,
              transformOrigin: "50% 50%",
              transform: pl < 1 || squash !== 1 || n29Shake > 0
                ? `translate(${(n29c.x - N29_C.x + shX * n29Shake).toFixed(2)}px, ${(n29c.y - N29_C.y + shY * n29Shake).toFixed(2)}px) scale(${(n29s * squash).toFixed(4)}, ${(n29s / squash).toFixed(4)})`
                : undefined,
              filter: pl < 0.9 && n29v > 8 ? `blur(${Math.min(6, n29v * 0.08).toFixed(1)}px)` : undefined,
            }}
          >
            29
          </div>
        </>
      )}
    </>
  );
};

export const HookX2 = Object.assign(HookX2Impl, { keep: true });
