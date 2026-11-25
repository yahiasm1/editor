// hook (variant 2, nba-floor-h2), dark, 0.08-5.46 s: "The NBA three-point line isn't the same distance everywhere.
// In the corners, it's almost two feet closer."
// "Two planks of the floor". The hero is the floor itself. Frame 0 is the real Bruce Bowen corner three (Keith
// Allison, CC BY-SA 2.0) pushing in on his spot, two gold radii flicking out of the ring at rim height (22'0" to the
// shooter, 23'9" toward the top of the key). The photo's dark corner line lifts on "three-point"; on "line" the photo's
// floor un-tilts into the reel's top-down court through a camera fitted to the photo (notes/HookX2.md), so it is the
// same floor. Two strips of maple are outlined on "isn't the", rise on "same", stand like rulers on "distance", level
// on "everywhere". The corner one's top 21 in turns gold on "two"; on "closer" it breaks off and falls, the plank rocks
// at 22'0". In the silence both swing home into the floor: `answer`'s first frame (keep = true).
import React from "react";
import { Img, staticFile } from "remotion";
import { blurIn, ease, pop, prog, useScene } from "../../../src/engine";
import { PaintedKinkFloor } from "./PaintedKinkFloor";
import {
  PK_ARC_FRAME, PK_LINE, paintedKinkBand as band, paintedKinkMix as mixCam, paintedKinkPoly as poly,
  paintedKinkProject as proj, type PaintedKinkCam,
} from "./PaintedKinkWorld";
import { HX2_GOLD, HX2_LEN, HX2_TOP_XC, HX2_W, HookX2Plank, HookX2Sliver, type HookX2Kind, type HookX2Pose } from "./HookX2Plank";

const GREY = "#8B949E";
const INK = "#F0F3F6";
const UI = "Inter, sans-serif";
const NUM = "Figtree, sans-serif";

// the photo card
const CARD = { x: 36, y: 556, w: 1008, h: 864 };
const PH_W = 1280, PH_H = 1235;
const S0 = Math.max(CARD.w / PH_W, CARD.h / PH_H); // cover
const FOCUS: [number, number] = [790, 1161]; // his spot behind Butler, on the corner line
const FOCUS_SCR: [number, number] = [655, 1356];
// the reel's camera fitted to the photo (least squares on its sideline, corner line, ring and board; notes/HookX2.md)
const PHOTO_CAM = { tx: -43.3551, ty: -3.7992, D: 140, pitch: 1.3218, yaw: -1.7114, F: 12076.821, cx: 640, cy: 617 };
// the photo's dark corner line (x = -22), measured: y = 1161 + 0.037 (x - 300), from the baseline (x 193) on
const lineY = (x: number) => 1161 + 0.037 * (x - 300);

// the planks stand here, rims on one baseline at rim level
const STAND_Y = 1400;
const STAND_K = 36;
const STAND_X: Record<HookX2Kind, number> = { corner: 474, top: 606 };

function useHookX2T() {
  const { cue, scene } = useScene();
  return {
    nba: cue("NBA"), three: cue("three-point"), line: cue("line"), isnt: cue("isnt"), same: cue("same"),
    dist: cue("distance"), every: cue("everywhere"), corners: cue("corners"), almost: cue("almost"), two: cue("two"),
    feet: cue("feet"), closer: cue("closer"), end: scene.to,
  };
}
type HT = ReturnType<typeof useHookX2T>;

/** the photo's push: px per photo px, and where the photo's origin sits on screen */
function photoMap(f: number) {
  const K = S0 * (1.04 + 0.26 * Math.min(1, f / 110) - 0.05 * Math.pow(Math.min(1, f / 110), 2));
  return { K, ax: FOCUS_SCR[0] - K * FOCUS[0], ay: FOCUS_SCR[1] - K * FOCUS[1] };
}

function cameraOf(f: number, T: HT): PaintedKinkCam {
  const { K, ax, ay } = photoMap(f);
  const ph: PaintedKinkCam = { ...PHOTO_CAM, F: PHOTO_CAM.F * K, cx: ax + K * PHOTO_CAM.cx, cy: ay + K * PHOTO_CAM.cy };
  const e = prog(f, T.line + 5, 34, (t) => 1 - Math.pow(1 - t, 2.6));
  if (e <= 0) return ph;
  if (e >= 1) return PK_ARC_FRAME;
  // a long lens turning whips the picture; keep his spot on a straight screen path from the photo to the court
  const m = mixCam(ph, PK_ARC_FRAME, e);
  const W: [number, number] = [-22.5, 0.6];
  const a = proj(ph, W[0], W[1], 0), b = proj(PK_ARC_FRAME, W[0], W[1], 0), c = proj(m, W[0], W[1], 0);
  if (!c.ok) return m;
  return { ...m, cx: m.cx + (a.x + (b.x - a.x) * e - c.x), cy: m.cy + (a.y + (b.y - a.y) * e - c.y) };
}


/** the photo's own floor as a plane: texture px (photo px, y from 1020) -> screen, through camera m (CSS matrix3d) */
const HX2_TEX_Y0 = 1020;
function hookX2FloorMatrix(m: PaintedKinkCam): string | null {
  const ph: PaintedKinkCam = { ...PHOTO_CAM };
  const pts: [number, number][] = [[-25.5, -4], [-25.5, 9], [-19.5, -4], [-19.5, 9]];
  const src: number[][] = [], dst: number[][] = [];
  for (const [x, y] of pts) {
    const a = proj(ph, x, y, 0), b = proj(m, x, y, 0);
    if (!a.ok || !b.ok) return null;
    src.push([a.x, a.y - HX2_TEX_Y0]);
    dst.push([b.x, b.y]);
  }
  // solve the 8 unknowns of the homography
  const A: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const [u, v] = src[i], [x, y] = dst[i];
    A.push([u, v, 1, 0, 0, 0, -u * x, -v * x, x]);
    A.push([0, 0, 0, u, v, 1, -u * y, -v * y, y]);
  }
  for (let c = 0; c < 8; c++) {
    let piv = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    [A[c], A[piv]] = [A[piv], A[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const k = A[r][c] / A[c][c];
      for (let j = c; j < 9; j++) A[r][j] -= k * A[c][j];
    }
  }
  const H = Array.from({ length: 8 }, (_, i) => A[i][8] / A[i][i]);
  return `matrix3d(${[H[0], H[3], 0, H[6], H[1], H[4], 0, H[7], 0, 0, 1, 0, H[2], H[5], 0, 1].map((n) => n.toFixed(9)).join(",")})`;
}

/** where a plank lies in the floor, seen through the camera */
function floorPose(kind: HookX2Kind, cam: PaintedKinkCam): HookX2Pose {
  const b: [number, number] = kind === "top" ? [HX2_TOP_XC, 0] : [0, 0];
  const t: [number, number] = kind === "top" ? [HX2_TOP_XC, HX2_LEN] : [-HX2_LEN, 0];
  const pb = proj(cam, b[0], b[1], 0), pt = proj(cam, t[0], t[1], 0);
  return { bx: pb.x, by: pb.y, th: Math.atan2(pt.y - pb.y, pt.x - pb.x), k: Math.hypot(pt.x - pb.x, pt.y - pb.y) / HX2_LEN, lift: 0, roll: 0 };
}

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const decay = (f: number, at: number, period: number, tau: number) => (f < at ? 0 : Math.sin(((f - at) / period) * Math.PI * 2) * Math.exp(-(f - at) / tau));

function plankPose(kind: HookX2Kind, f: number, T: HT, cam: PaintedKinkCam): HookX2Pose {
  const fl = floorPose(kind, cam);
  const lift = prog(f, T.same, 14, ease.out) * (1 - prog(f, T.closer + 16, 16, ease.inOut));
  const fly = prog(f, T.dist, 26, ease.inOut) * (1 - prog(f, T.closer + 16, 16, ease.inOut));
  const st = { bx: STAND_X[kind], by: STAND_Y, th: -Math.PI / 2, k: STAND_K };
  const th = fl.th + wrap(st.th - fl.th) * fly;
  const k = Math.exp(Math.log(fl.k) + (Math.log(st.k) - Math.log(fl.k)) * fly) * (1 + 0.05 * lift * (1 - fly));
  // the flight rises in an arc; the tops settle level on "everywhere" with a small weight bounce
  const bump = Math.sin(Math.PI * fly) * (kind === "corner" ? 150 : 90);
  const settle = decay(f, T.dist + 26, 20, 9) * 10;
  // after "closer": the corner plank rocks on its base, the other answers a little
  const rock = decay(f, T.closer, 24, 13) * (kind === "corner" ? 0.07 : 0.018);
  const breathe = Math.sin(f / 38 + (kind === "corner" ? 0 : 1.7)) * 0.1 * fly;
  const turn = kind === "corner" ? 0.5 * prog(f, T.corners - 4, 14, ease.inOut) * (1 - prog(f, T.almost, 22, ease.inOut)) : 0;
  return {
    bx: fl.bx + (st.bx - fl.bx) * fly,
    by: fl.by + (st.by - fl.by) * fly - bump + settle * fly,
    th: th + rock * fly,
    k,
    lift: 26 * lift + 14 * fly,
    roll: breathe + turn,
  };
}

/** a dark slot left in the floor where a strip came out */
function slotPath(cam: PaintedKinkCam, kind: HookX2Kind, from = 0, to = HX2_LEN) {
  const hw = HX2_W / 2;
  if (kind === "top") return poly(cam, [[HX2_TOP_XC - hw, from, 0], [HX2_TOP_XC + hw, from, 0], [HX2_TOP_XC + hw, to, 0], [HX2_TOP_XC - hw, to, 0]]);
  return poly(cam, [[-from, -hw, 0], [-from, hw, 0], [-to, hw, 0], [-to, -hw, 0]]);
}

export const HookX2: React.FC & { keep?: boolean } = () => {
  const { f } = useScene();
  const T = useHookX2T();
  const cam = cameraOf(f, T);
  const { K, ax, ay } = photoMap(f);

  // photo -> floor
  const unTilt = prog(f, T.line + 4, 30, ease.inOut);
  const cardA = 1 - prog(f, T.line + 1, 14, ease.inOut);
  const floorA = prog(f, T.line + 6, 8, ease.linear);
  const texA = f >= T.line - 1 ? 1 - prog(f, T.line + 16, 18, ease.inOut) : 0;
  const texM = texA > 0 ? hookX2FloorMatrix(cam) : null;
  const inset = (a: number) => (a * (1 - unTilt)).toFixed(1);

  // the flick inside the first second
  const flickA = prog(f, 2, 10, ease.out), flickB = prog(f, 6, 10, ease.out);
  const flickOut = 1 - prog(f, 40, 10, ease.in);
  const R = [347, 746];
  const A = [781, 168];
  const Bend = [1240, 746 + (858 - 746) * ((1240 - 347) / (3417 - 347))];

  // the corner line in the photo lifts on "three-point"
  const peel = prog(f, T.three, 12, ease.back);

  // floor work
  const outline = prog(f, T.isnt, 18, ease.inOut) * (1 - prog(f, T.same + 6, 10));
  const slotA = prog(f, T.same, 6) * (1 - prog(f, T.closer + 27, 5, ease.linear));
  const goldSlotA = f >= T.closer ? prog(f, T.closer + 21, 5) * (1 - prog(f, T.closer + 28, 5, ease.linear)) : 0;
  const veil = 0.74 * prog(f, T.dist - 8, 24) * (1 - prog(f, T.closer + 16, 14, ease.inOut));
  const lineGlow = f >= T.line - 2 ? prog(f, T.three, 12) * (1 - prog(f, T.line + 26, 22, ease.linear)) : 0;
  const glowBand = lineGlow > 0 ? band(cam, [[-22 + PK_LINE / 2, -5.25], [-22 + PK_LINE / 2, 8.95]], PK_LINE) : "";

  // planks
  const pCorner = plankPose("corner", f, T, cam);
  const pTop = plankPose("top", f, T, cam);
  const broken = f >= T.closer;
  const plankOn = f >= T.same - 1;
  const plankA = 1 - prog(f, T.closer + 30, 5, ease.linear);
  const gold = prog(f, T.two, 12, ease.out);
  const ticks = prog(f, T.every, 26, ease.inOut);
  const glint = prog(f, T.corners - 2, 10) * (1 - prog(f, T.almost + 4, 20, ease.linear));
  const sheen = -0.3 + ((f - T.every) / 90) * 1.6;
  const squash = 1 - decay(f, T.closer, 16, 8) * 0.035;
  const pCornerSq = { ...pCorner, k: pCorner.k * squash };

  // the gold piece breaks off and falls out of frame
  const dt = f - T.closer;
  const brk = (() => {
    const p = pCorner;
    const bx = p.bx + Math.cos(p.th) * p.k * 22, by = p.by + Math.sin(p.th) * p.k * 22;
    return { bx: bx - 2.6 * dt, by: by - 8 * dt + 2.1 * dt * dt, th: p.th - 0.07 * dt - 0.001 * dt * dt, k: p.k, lift: 20, roll: 0 } as HookX2Pose;
  })();

  // labels (screen positions on the standing planks)
  const yAt = (u: number) => STAND_Y - STAND_K * u;
  const lab = (at: number) => prog(f, at, 8) * (1 - prog(f, T.closer + 14, 8, ease.in));
  const outLate = 1 - prog(f, T.closer + 16, 8, ease.in);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* the floor: answer's own floor and mask, so the last frame is answer's first */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: f >= T.line - 1 ? 1 : 0,
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0, transparent 520px, #000 640px, #000 1540px, transparent 1700px)",
          clipPath: unTilt < 1 ? `inset(${inset(CARD.y)}px ${inset(CARD.x)}px ${inset(1920 - CARD.y - CARD.h)}px ${inset(CARD.x)}px round ${(24 * (1 - unTilt)).toFixed(1)}px)` : undefined,
        }}
      >
        {f >= T.line + 6 && (
          <div style={{ position: "absolute", inset: 0, opacity: floorA }}>
            <PaintedKinkFloor cam={cam} f={f} paint={{ run: 0, wet: 0 }} light={[6, 16]} side={0} push={0} />
          </div>
        )}
        {/* the photo's own floor, people gone, lying on the court and turning with it */}
        {texA > 0 && texM && (
          <Img src={staticFile("nba-floor/hookx2-floor.png")} style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 215, transformOrigin: "0 0", transform: texM, opacity: texA }} />
        )}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <filter id="hx2-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={6} /></filter>
            <filter id="hx2-in" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={2} /></filter>
          </defs>
          {glowBand && <path d={glowBand} fill="none" stroke="#FFFFFF" strokeWidth={10} strokeOpacity={0.7 * lineGlow} filter="url(#hx2-glow)" />}
          {/* the strips outlined along their seams */}
          {outline > 0 &&
            (["top", "corner"] as HookX2Kind[]).map((k) => {
              const d = slotPath(cam, k);
              return d ? (
                <g key={k}>
                  <path d={d} fill="none" stroke="#0D1117" strokeOpacity={0.5 * outline} strokeWidth={6} pathLength={1} strokeDasharray={`${prog(f, T.isnt, 18, ease.inOut)} 1`} />
                  <path d={d} fill="#FFFFFF" fillOpacity={0.12 * outline} stroke="#FFFFFF" strokeOpacity={outline} strokeWidth={3} pathLength={1} strokeDasharray={`${prog(f, T.isnt, 18, ease.inOut)} 1`} />
                </g>
              ) : null;
            })}
          {/* the slots they leave */}
          {slotA > 0 &&
            (["top", "corner"] as HookX2Kind[]).map((k) => {
              const d = slotPath(cam, k);
              return d ? (
                <g key={`sl${k}`} opacity={slotA}>
                  <path d={d} fill="#07090C" />
                  <path d={d} fill="none" stroke="#000" strokeWidth={4} strokeOpacity={0.8} filter="url(#hx2-in)" />
                  <path d={d} fill="none" stroke="#6B4A22" strokeWidth={1} strokeOpacity={0.6} />
                </g>
              ) : null;
            })}
          {goldSlotA > 0 && (() => {
            const d = slotPath(cam, "corner", 22, HX2_LEN);
            return d ? <path d={d} fill={HX2_GOLD} opacity={0.75 * goldSlotA} /> : null;
          })()}
          {veil > 0 && <rect x={0} y={0} width={1080} height={1920} fill="#0D1117" opacity={veil} />}
        </svg>
      </div>

      {/* the real corner three */}
      {cardA > 0 && (
        <div
          style={{
            position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 24, overflow: "hidden",
            background: "#161B22", border: "1px solid #30363D", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", opacity: cardA,
          }}
        >
          <Img src={staticFile("nba-floor/hookx2-bowen.jpg")} style={{ position: "absolute", left: ax - CARD.x, top: ay - CARD.y, width: PH_W * K, height: PH_H * K }} />
          <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", left: 0, top: 0 }}>
            <defs>
              <linearGradient id="hx2-sweep" gradientUnits="userSpaceOnUse" x1={-500 + f * 22} y1={0} x2={-100 + f * 22} y2={0}>
                <stop offset="0" stopColor="#FFF6E2" stopOpacity="0" />
                <stop offset="0.5" stopColor="#FFF6E2" stopOpacity="0.26" />
                <stop offset="1" stopColor="#FFF6E2" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hx2-tail" gradientUnits="userSpaceOnUse" x1={R[0]} y1={0} x2={Bend[0]} y2={0}>
                <stop offset="0.8" stopColor={HX2_GOLD} stopOpacity="1" />
                <stop offset="1" stopColor={HX2_GOLD} stopOpacity="0" />
              </linearGradient>
              <filter id="hx2-psh" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation={2.5} /></filter>
            </defs>
            <g transform={`matrix(${K} 0 0 ${K} ${ax - CARD.x} ${ay - CARD.y})`}>
              {/* arena light moving across the photo's floor */}
              <polygon points={`0,${lineY(0) - 120} 1280,${lineY(1280) - 120} 1280,1235 0,1235`} fill="url(#hx2-sweep)" style={{ mixBlendMode: "screen" }} />
              {/* the painted corner line, lifting a hair off the boards on its own shadow, lit along its edges */}
              {peel > 0 && (
                <g>
                  <polygon points={`193,${lineY(193) + 1} 1280,${lineY(1280) + 1} 1280,${lineY(1280) + 6} 193,${lineY(193) + 6}`} fill="#000" opacity={0.45 * peel} filter="url(#hx2-psh)" />
                  <g transform={`translate(0 ${(-6 * peel).toFixed(2)})`}>
                    <polygon points={`193,${lineY(193) - 2.6} 1280,${lineY(1280) - 2.6} 1280,${lineY(1280) + 2.6} 193,${lineY(193) + 2.6}`} fill="#0A0A10" />
                    {/* the side of the paint, 2 in of it standing proud */}
                    <polygon points={`193,${lineY(193) + 2.6} 1280,${lineY(1280) + 2.6} 1280,${lineY(1280) + 2.6 + 6 * peel} 193,${lineY(193) + 2.6 + 6 * peel}`} fill="#2A2520" />
                    <line x1={193} y1={lineY(193) - 2.8} x2={1280} y2={lineY(1280) - 2.8} stroke="#FFFFFF" strokeWidth={10} strokeOpacity={0.6 * peel} filter="url(#hx2-psh)" />
                    <line x1={193} y1={lineY(193) - 2.8} x2={1280} y2={lineY(1280) - 2.8} stroke="#FFFFFF" strokeWidth={2.6} strokeOpacity={peel} />
                    <line x1={193} y1={lineY(193) + 2.8} x2={1280} y2={lineY(1280) + 2.8} stroke="#FFFFFF" strokeWidth={1.4} strokeOpacity={0.7 * peel} />
                    {/* a glint running along it, baseline end to the arc */}
                    {(() => { const gx = 193 + (f - T.three) * 34; return gx < 1300 ? <ellipse cx={gx} cy={lineY(gx) - 3} rx={60} ry={7} fill="#FFFFFF" opacity={0.85 * peel} filter="url(#hx2-psh)" /> : null; })()}
                  </g>
                </g>
              )}
              {/* Butler stays in front of the line, as in the photo */}
              {peel > 0 && <image href={staticFile("nba-floor/hookx2-butler-legs.png")} x={660} y={1040} width={340} height={195} />}
              {/* the mechanism once, at rim height: the ring to the shooter, the ring toward the top of the key */}
              {flickOut > 0 && (
                <g opacity={flickOut}>
                  <circle cx={R[0]} cy={R[1]} r={9} fill={HX2_GOLD} opacity={flickA} />
                  <line x1={R[0]} y1={R[1]} x2={R[0] + (A[0] - R[0]) * flickA} y2={R[1] + (A[1] - R[1]) * flickA} stroke="#0D1117" strokeOpacity={0.5} strokeWidth={10} strokeLinecap="round" />
                  <line x1={R[0]} y1={R[1]} x2={R[0] + (A[0] - R[0]) * flickA} y2={R[1] + (A[1] - R[1]) * flickA} stroke={HX2_GOLD} strokeWidth={6} strokeLinecap="round" />
                  <line x1={R[0]} y1={R[1]} x2={R[0] + (Bend[0] - R[0]) * flickB} y2={R[1] + (Bend[1] - R[1]) * flickB} stroke="#0D1117" strokeOpacity={0.5} strokeWidth={10} />
                  <line x1={R[0]} y1={R[1]} x2={R[0] + (Bend[0] - R[0]) * flickB} y2={R[1] + (Bend[1] - R[1]) * flickB} stroke="url(#hx2-tail)" strokeWidth={6} />
                </g>
              )}
            </g>
          </svg>
          {/* lengths, flashing in grey */}
          {flickOut > 0 && (
            <>
              <div style={{ position: "absolute", right: CARD.w - (ax - CARD.x + K * A[0]) + 22, top: ay - CARD.y + K * A[1] + 4, fontFamily: NUM, fontWeight: 700, fontSize: 40, color: "#C9D1D9", textShadow: "0 2px 10px rgba(0,0,0,0.9)", opacity: prog(f, 9, 5, ease.linear) * flickOut }}>22'0"</div>
              <div style={{ position: "absolute", right: 26, top: ay - CARD.y + K * Bend[1] - 64, fontFamily: NUM, fontWeight: 700, fontSize: 40, color: "#C9D1D9", textShadow: "0 2px 10px rgba(0,0,0,0.9)", opacity: prog(f, 13, 5, ease.linear) * flickOut }}>23'9"</div>
            </>
          )}
          <div style={{ position: "absolute", right: 22, top: 18, fontFamily: UI, fontSize: 22, fontWeight: 500, color: "#C9D1D9", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>Keith Allison, CC BY-SA 2.0</div>
          <Img src={staticFile("nba-floor/hookx2-spurs.svg")} style={{ position: "absolute", right: 22, top: 54, width: 72, height: 72, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))", ...pop(f, T.nba, { dur: 8 }) }} />
        </div>
      )}

      {/* the two planks */}
      {plankOn && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <HookX2Plank id="top" kind="top" pose={pTop} len={HX2_LEN} gold={0} ticks={ticks} glint={0} sheen={sheen} opacity={plankA} />
          <HookX2Plank id="corner" kind="corner" pose={pCornerSq} len={broken ? 22 : HX2_LEN} gold={broken ? 0 : gold} ticks={ticks} glint={glint} sheen={sheen - 0.2} opacity={plankA} />
          {broken && dt < 44 && <HookX2Sliver pose={brk} opacity={1} />}
          {/* dust off the break */}
          {broken && dt < 30 &&
            Array.from({ length: 26 }, (_, i) => {
              const a = (i / 26) * Math.PI * 2 + Math.sin(i * 7.1);
              const sp = 1.6 + (Math.sin(i * 3.3) * 0.5 + 0.5) * 3.2;
              const x0 = pCorner.bx, y0 = yAt(22);
              const x = x0 + Math.cos(a) * sp * dt * 1.3, y = y0 + Math.sin(a) * sp * dt * 0.7 - 0.6 * dt + 0.02 * dt * dt;
              return <circle key={i} cx={x} cy={y} r={2 + (i % 3) + dt * 0.12} fill="#F2E3C6" opacity={(1 - dt / 30) * 0.7} />;
            })}
        </svg>
      )}

      {/* labels on the standing planks */}
      {f >= T.every && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: outLate }}>
          {/* hairline at the 23'9" level, so the eye compares the tops */}
          <line x1={STAND_X.corner - 52} y1={yAt(HX2_LEN)} x2={STAND_X.top + 30} y2={yAt(HX2_LEN)} stroke={GREY} strokeWidth={2} opacity={prog(f, T.every + 10, 10) * (broken ? 1 : 0.55)} />
          {/* the 21 in dimension */}
          {f >= T.feet && (
            <g opacity={prog(f, T.feet, 6)}>
              <line x1={STAND_X.corner - 50} y1={yAt(22)} x2={STAND_X.corner - 50} y2={yAt(22) - (yAt(22) - yAt(HX2_LEN)) * prog(f, T.feet, 8, ease.out)} stroke={HX2_GOLD} strokeWidth={2.5} />
              <line x1={STAND_X.corner - 60} y1={yAt(22)} x2={STAND_X.corner - 36} y2={yAt(22)} stroke={GREY} strokeWidth={2} />
              <line x1={STAND_X.corner - 60} y1={yAt(HX2_LEN)} x2={STAND_X.corner - 40} y2={yAt(HX2_LEN)} stroke={GREY} strokeWidth={2} />
            </g>
          )}
          {f >= T.corners && (
            <line x1={STAND_X.corner - 32} y1={yAt(12)} x2={STAND_X.corner - 120} y2={yAt(12)} stroke={GREY} strokeWidth={2} opacity={lab(T.corners)} />
          )}
          {f >= T.every + 14 && (
            <line x1={STAND_X.top + 32} y1={yAt(12)} x2={STAND_X.top + 120} y2={yAt(12)} stroke={GREY} strokeWidth={2} opacity={lab(T.every + 14)} />
          )}
        </svg>
      )}
      {f >= T.every + 14 && (
        <div style={{ position: "absolute", left: STAND_X.top + 132, top: yAt(12) - 24, fontFamily: UI, fontWeight: 600, fontSize: 36, color: GREY, whiteSpace: "nowrap", ...blurIn(f, T.every + 14, { dur: 8, rise: 6 }), opacity: lab(T.every + 14) }}>top of the arc</div>
      )}
      {f >= T.corners && (
        <div style={{ position: "absolute", right: 1080 - (STAND_X.corner - 132), top: yAt(12) - 24, fontFamily: UI, fontWeight: 600, fontSize: 36, color: GREY, whiteSpace: "nowrap", ...blurIn(f, T.corners, { dur: 8, rise: 6 }), opacity: lab(T.corners) }}>corner</div>
      )}
      {f >= T.almost && (
        <div style={{ position: "absolute", left: STAND_X.top + 40, top: yAt(HX2_LEN) - 34, fontFamily: NUM, fontWeight: 800, fontSize: 60, color: INK, textShadow: "0 2px 14px rgba(0,0,0,0.85)", ...pop(f, T.almost, { dur: 8 }), opacity: prog(f, T.almost, 4, ease.linear) * outLate }}>23'9"</div>
      )}
      {f >= T.feet && (
        <div style={{ position: "absolute", right: 1080 - (STAND_X.corner - 70), top: (yAt(22) + yAt(HX2_LEN)) / 2 - 24, fontFamily: UI, fontWeight: 700, fontSize: 38, color: HX2_GOLD, whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,0.9)", ...blurIn(f, T.feet, { dur: 7, rise: 6 }), opacity: prog(f, T.feet, 6) * outLate }}>21 in</div>
      )}
      {broken && (
        <div style={{ position: "absolute", right: 1080 - (STAND_X.corner - 70), top: yAt(22) + 6, fontFamily: NUM, fontWeight: 800, fontSize: 60, color: INK, textShadow: "0 2px 14px rgba(0,0,0,0.85)", ...pop(f, T.closer + 3, { dur: 8 }), opacity: prog(f, T.closer + 3, 4, ease.linear) * outLate }}>22'0"</div>
      )}

      {/* source */}
      {f >= T.line + 30 && (
        <div style={{ position: "absolute", left: 44, top: 1418, fontFamily: UI, fontSize: 26, fontWeight: 500, color: GREY, opacity: prog(f, T.line + 30, 10) * (1 - prog(f, T.closer + 14, 10, ease.linear)) }}>NBA Rule 1, Court Dimensions</div>
      )}
    </div>
  );
};

// the hook hands over in place: answer starts on this very floor
HookX2.keep = true;
