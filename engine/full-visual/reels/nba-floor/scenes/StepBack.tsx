// Scene `worth`: "So stepping back behind that short corner line makes the shot worth about forty-five percent more."
// `points`' floor, top-down, dives to shoe height beside the right corner line, looking up the line to the kink. The
// white sneakers from `corner` stand just inside the paint (a long two). One foot rolls off its heel, lifts and comes
// down behind the line, then the other, and the weight settles: a three. The gold sliver (21 in at rim level, nothing
// at the kink) lights under the new spot and runs away up the line; a gleam runs the line's short straight length.
// 0.80 drops onto the dust prints where he stood, 1.16 onto where he stands, the multiplication writes between them
// and +45% counts up over the feet. It opens on `points`' last frame exactly (its 2,000 shot marks, the lit band, the
// 16 ft ring, its 0.80 and 1.16 and source line) over an opaque ground, so the lift-off behind it never shows; the
// marks fade with the first frames of the dive and the two values move aside, then land on the spots.
// Notes: reels/nba-floor/notes/StepBack.md
import React, { useMemo } from "react";
import { Img, staticFile } from "remotion";
import { useScene, ease, prog, arrive } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import { Ground } from "../../../src/engine/Ground";
import { ppsCornerShots, ppsLongTwoShots, type PpsShot } from "./PointsPerShotWorld";
import { StepBackFloor } from "./StepBackFloor";
import { StepBackShoes, type StepBackShoe } from "./StepBackShoes";
import {
  SB_BASE,
  SB_CORNER_X,
  SB_KINK_Y,
  SB_LINE,
  stepBackBasis,
  stepBackBand as band,
  stepBackLerp as lerp,
  stepBackPoly as poly,
  stepBackProject as proj,
  type StepBackCam,
  type StepBackV3,
} from "./StepBackWorld";

type Pose = { tx: number; ty: number; D: number; pitch: number; yaw: number; F: number };
const deg = Math.PI / 180;
const GOLD = "#F2B33D";
const GREY = "#8B949E";
const R3 = 23.75;
const LEN = 1.08;
const SHADOW = "0 3px 18px rgba(13,17,23,0.9), 0 0 3px rgba(13,17,23,0.8)";
// type and hairlines that sit on the bright maple: white with a tight shadow (as `corner` labels its floor)
const STEPINK = "rgba(255,255,255,0.85)";
const FLOORSHADOW = "0 2px 10px rgba(13,17,23,0.7), 0 0 3px rgba(13,17,23,0.6)";
// `points`' totals: the same face, size, tracking and shadow, so the hand-over is the same picture
const FIG = "Figtree, sans-serif";
const PSHADOW = "0 3px 18px rgba(13,17,23,0.85), 0 0 2px rgba(13,17,23,0.9)";
const PPS_PUSH = 1.02; // `points` ends on a 2% push in
const R16 = 16;
const R16_A0 = -Math.asin(5.25 / R16);

/** a value as `points` draws its totals: the number, then its arithmetic and "points per shot", or its zone's name */
const StepBackValue: React.FC<{ x: number; y: number; size: number; value: string; math: string; label: string; mathO: number; labelO: number; opacity: number }> = ({
  x, y, size, value, math, label, mathO, labelO, opacity,
}) => {
  if (opacity <= 0.001) return null;
  const w = 560;
  const h = size * 1.1;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - size * 0.55, width: w, opacity, textAlign: "center" }}>
      <div style={{ fontFamily: FIG, fontWeight: 700, fontSize: size, height: h, lineHeight: `${h}px`, color: "#FFFFFF", fontVariantNumeric: "tabular-nums", letterSpacing: -size * 0.02, textShadow: PSHADOW }}>{value}</div>
      <div style={{ position: "relative", height: 44, marginTop: 2 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, fontFamily: FIG, fontWeight: 700, fontSize: 34, color: GREY, opacity: mathO, textShadow: PSHADOW }}>{math}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, fontFamily: FIG, fontWeight: 700, fontSize: 34, color: "#C9D1D9", opacity: labelO, textShadow: PSHADOW }}>{label}</div>
      </div>
      <div style={{ fontFamily: FIG, fontWeight: 700, fontSize: 32, color: GREY, opacity: mathO, marginTop: 2, textShadow: PSHADOW }}>points per shot</div>
    </div>
  );
};
const lerp3 = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

const toCam = (p: Pose): StepBackCam => {
  const cp = Math.cos(p.pitch);
  const fw: StepBackV3 = [cp * Math.sin(p.yaw), cp * Math.cos(p.yaw), Math.sin(p.pitch)];
  return { eye: [p.tx - p.D * fw[0], p.ty - p.D * fw[1], -p.D * fw[2]], yaw: p.yaw, pitch: p.pitch, F: p.F, cx: 540, cy: 985 };
};
const mixPose = (a: Pose, b: Pose, t: number): Pose => ({
  tx: lerp(a.tx, b.tx, t),
  ty: lerp(a.ty, b.ty, t),
  D: Math.exp(lerp(Math.log(a.D), Math.log(b.D), t)),
  pitch: lerp(a.pitch, b.pitch, t),
  yaw: lerp(a.yaw, b.yaw, t),
  F: lerp(a.F, b.F, t),
});
/** a camera given by its eye */
const eyePose = (ex: number, ey: number, ez: number, yaw: number, pitch: number, F: number): Pose => {
  const D = ez / Math.sin(-pitch);
  const cp = Math.cos(pitch);
  return { tx: ex + D * cp * Math.sin(yaw), ty: ey + D * cp * Math.cos(yaw), D, pitch, yaw, F };
};

// where `points` leaves the floor (PPS_BAND, orthographic): world (-0.5, 18.0) at screen y 990, 17.8 px/ft
const TOP: Pose = { tx: -0.5, ty: 18.008 + 5 / (17.8 * PPS_PUSH), D: 2200 / (17.8 * PPS_PUSH), pitch: -90 * deg + 0.0001, yaw: 0, F: 2200 };
// shoe height out by the baseline, beside the right corner line, looking up it toward the kink
const LOW = (dx: number, dz: number, dy: number) => eyePose(21.62 + dx, -4.45 + dy, 1.25 + dz, 1.5 * deg, -7.5 * deg, 1180);

// the two feet: toes toward the basket, a stance a little wider than the hips, the far foot set most of a foot
// back (a shooter's stagger), so from the side both feet and both shins read
const FEET = {
  near: { y: -0.52, a: -0.09, x0: 20.3, x1: 22.12 },
  far: { y: 0.62, a: 0.1, x0: 20.72, x1: 22.82 },
};
const centre = (x: number, a: number) => x + 0.55 * LEN * Math.cos(a);

/** one step back: the heel rolls up, the foot lifts and travels, comes down toe first, then the heel */
function stepOf(f: number, s: number, e: number) {
  const u = Math.max(0, Math.min(1, (f - s) / (e - s)));
  const v = Math.max(0, Math.min(1, (u - 0.14) / 0.72));
  const travel = v * v * (3 - 2 * v);
  const lift = 0.3 * Math.sin(Math.PI * v) * (v > 0 && v < 1 ? 1 : 0);
  const heelUp = u < 0.16 ? 0.16 * (u / 0.16) : u < 0.86 ? 0.16 - 0.06 * ((u - 0.16) / 0.7) : 0.1 * (1 - (u - 0.86) / 0.14);
  return { travel, lift, heelUp: u <= 0 || u >= 1 ? 0 : heelUp };
}

/** the sliver between the corner line and the 23'9" circle, from the baseline up to y, as a floor polygon */
function sliverPts(yTo: number, z = 0.004): StepBackV3[] {
  const pts: StepBackV3[] = [];
  const n = 36;
  for (let i = 0; i <= n; i++) {
    const y = SB_BASE + ((yTo - SB_BASE) * i) / n;
    pts.push([SB_CORNER_X, y, z]);
  }
  for (let i = n; i >= 0; i--) {
    const y = SB_BASE + ((yTo - SB_BASE) * i) / n;
    pts.push([Math.sqrt(R3 * R3 - y * y), y, z]);
  }
  return pts;
}

export const StepBack: React.FC = () => {
  const { f, cue, scene, theme } = useScene();
  const UI = theme.font.ui;
  const t0 = scene.from - LEAD;
  const cStep = cue("stepping");
  const cBack = cue("back");
  const cBehind = cue("behind");
  const cShort = cue("short");
  const cCorner = cue("corner");
  const cLine = cue("line");
  const cMakes = cue("makes");
  const cShot = cue("shot");
  const cWorth = cue("worth");
  const cAbout = cue("about");
  const c45 = cue("45%");
  const cMore = cue("more.");
  const end = scene.to;

  // ---- the feet
  const sN = stepOf(f, cStep - 4, cBack + 4);
  const sF = stepOf(f, cCorner - 12, cLine + 1);
  // the weight landing on "line": midsoles squash, the legs dip, twice, dying away
  const bounce = f >= cLine ? Math.exp(-(f - cLine) / 7) * Math.sin(((f - cLine) / 9) * Math.PI) : 0;
  const squash = Math.max(0, bounce) * 0.06;
  const nx = lerp(FEET.near.x0, FEET.near.x1, sN.travel);
  const fx = lerp(FEET.far.x0, FEET.far.x1, sF.travel);
  const hipX = (centre(nx, FEET.near.a) + centre(fx, FEET.far.a)) / 2;
  const lean = (x: number, a: number, y: number): [number, number] => [((hipX - centre(x, a)) / 3.1) * 0.9, (-0.6 * y) / 3.1];
  const shoeIn = arrive(f, t0 + 4, 14);
  const shoes: StepBackShoe[] = [
    { x: nx, y: FEET.near.y, a: FEET.near.a, lift: sN.lift, heelUp: sN.heelUp, squash, lean: lean(nx, FEET.near.a, FEET.near.y), alpha: shoeIn },
    { x: fx, y: FEET.far.y, a: FEET.far.a, lift: sF.lift, heelUp: sF.heelUp, squash: squash * 0.8, lean: lean(fx, FEET.far.a, FEET.far.y), alpha: shoeIn },
  ];

  // ---- the camera: the dive, a small truck with the step, the hold, the last push
  const dive = prog(f, t0, cStep + 2 - t0, ease.inOut);
  const follow = prog(f, cStep, cLine + 10 - cStep, ease.inOut);
  const settle = prog(f, cMakes - 4, 40, ease.inOut);
  const push = prog(f, cMore - 30, end - (cMore - 30), ease.inOut);
  const low = LOW(0.45 * follow, 0.06 * settle - 0.1 * push, -0.2 * settle + 0.6 * push);
  const pose = mixPose(TOP, low, dive);
  const cam = toCam(pose);
  const B = stepBackBasis(cam);
  const lowK = prog(f, t0 + 8, cStep - t0 - 6, ease.inOut);
  const horizon = cam.cy - cam.F * Math.tan(Math.min(Math.PI / 2 - 0.02, -pose.pitch));

  // ---- the gold sliver: the 21 in he gained, lit under his new spot and running up the line to the kink
  const goldRun = prog(f, cBehind - 6, cShort + 8 - (cBehind - 6), ease.inOut);
  const goldPulse = f >= c45 ? Math.exp(-(f - c45) / 16) : 0;
  const goldTopO = 0.5 * (1 - dive); // both slivers still lit from `points` while the floor is seen from above
  const yRun = SB_BASE + (SB_KINK_Y - SB_BASE) * goldRun;
  const sliver = goldRun > 0.001 ? poly(cam, B, sliverPts(Math.max(SB_BASE + 0.05, yRun)), false) : null;
  const sliverAll = poly(cam, B, sliverPts(SB_KINK_Y), false);
  const sliverL = poly(cam, B, sliverPts(SB_KINK_Y).map((p) => [-p[0], p[1], p[2]] as StepBackV3), false);
  const ghostPts: [number, number][] = [];
  for (let i = 0; i <= 40; i++) {
    const y = SB_BASE + ((Math.min(yRun, SB_KINK_Y) - SB_BASE) * i) / 40;
    ghostPts.push([Math.sqrt(R3 * R3 - y * y), y]);
  }
  const ghost = goldRun > 0.02 ? band(cam, B, ghostPts, 0.06, 0.005) : null;

  // ---- the gleam up the corner line's straight run, baseline to kink, stopping at the kink
  const gl = prog(f, cCorner - 4, 22, ease.inOut);
  const glO = gl > 0 && f < cCorner + 40 ? Math.min(1, gl * 4) * (1 - prog(f, cCorner + 20, 18)) : 0;
  const gy = SB_BASE + (SB_KINK_Y - SB_BASE) * gl;
  const gleam = glO > 0 ? band(cam, B, [[SB_CORNER_X - SB_LINE / 2, Math.max(SB_BASE, gy - 2.2)], [SB_CORNER_X - SB_LINE / 2, gy]], SB_LINE * 1.05, 0.006) : null;
  const kinkP = proj(cam, B, [SB_CORNER_X - SB_LINE / 2, SB_KINK_Y, 0.01]);
  const kinkFlare = gl > 0.92 ? Math.sin(((gl - 0.92) / 0.08) * Math.PI) : 0;

  // ---- dust prints where the shoes stood: the sole's outline in dust, a rubber edge, the herringbone's lines
  const printOf = (x: number, y: number, a: number) => {
    const dir: [number, number] = [-Math.cos(a), Math.sin(a)];
    const side: [number, number] = [Math.sin(a), Math.cos(a)];
    const hx = x + LEN * Math.cos(a), hy0 = y - LEN * Math.sin(a);
    const at = (t: number, b: number): StepBackV3 => [hx + dir[0] * t * LEN + side[0] * b, hy0 + dir[1] * t * LEN + side[1] * b, 0.004];
    const wv = (t: number) => (t < 0.08 ? 0.09 + 0.5 * t : t < 0.3 ? 0.13 - 0.02 * Math.sin(((t - 0.08) / 0.22) * Math.PI) : 0.15 + 0.03 * Math.sin(((t - 0.3) / 0.7) * Math.PI) - (t > 0.9 ? (t - 0.9) * 1.2 : 0));
    const pts: StepBackV3[] = [];
    for (let k = 0; k <= 24; k++) pts.push(at(k / 24, wv(k / 24)));
    for (let k = 24; k >= 0; k--) pts.push(at(k / 24, -wv(k / 24)));
    let tread = "";
    for (let k = 1; k < 22; k++) {
      const t = k / 22;
      const A = proj(cam, B, at(t, -wv(t) * 0.8)), Bq = proj(cam, B, at(t + 0.02, 0)), C = proj(cam, B, at(t, wv(t) * 0.8));
      if (A && Bq && C) tread += `M${A.x.toFixed(1)} ${A.y.toFixed(1)}L${Bq.x.toFixed(1)} ${Bq.y.toFixed(1)}L${C.x.toFixed(1)} ${C.y.toFixed(1)}`;
    }
    return { d: poly(cam, B, pts, false), tread };
  };
  const printN = printOf(FEET.near.x0, FEET.near.y, FEET.near.a);
  const printF = printOf(FEET.far.x0, FEET.far.y, FEET.far.a);
  const printO = (u: number) => Math.min(1, u * 3) * (0.55 + 0.45 * prog(f, cMakes - 2, 12));

  // ---- "1 step": a grey hairline on the boards in front of the feet, old heel to new heel
  const stepLbl = prog(f, cBack - 6, 12) * (1 - prog(f, cMakes - 8, 12));
  const hy = -1.45;
  const hA = proj(cam, B, [centre(FEET.near.x0, 0), hy, 0.01]);
  const hB = proj(cam, B, [centre(FEET.near.x1, 0), hy, 0.01]);
  const hDraw = prog(f, cBack - 6, 14, ease.inOut);

  // ---- the two values, pinned to the two places he stood
  const oldC = proj(cam, B, [centre((FEET.near.x0 + FEET.far.x0) / 2, 0), 0, 0.01]);
  const newC = proj(cam, B, [centre((FEET.near.x1 + FEET.far.x1) / 2, 0), 0, 0.01]);
  const vY = 742;
  // where `points` left them (lPos, cPos, and their sizes at its last frame), parked small at the stage's top corners
  // through the step, then carried onto the two spots: 0.80 lands on "makes", 1.16 on "shot"
  const park = prog(f, t0 + 2, 34, ease.inOut);
  const d80 = prog(f, cMakes - 14, 16, ease.inOut);
  const d116 = prog(f, cShot - 16, 16, ease.inOut);
  const v80 = lerp3(lerp3([330, 640, (108 * 0.8) / 1.16], [150, 600, 52], park), [0, 0, 84], d80);
  const v116 = lerp3(lerp3([806, 640, 108], [928, 600, 60], park), [0, 0, 116], d116);
  const mathO = 1 - prog(f, t0 + 2, 14);
  const lblO = prog(f, t0 + 18, 14);
  const parkO = 1 - 0.25 * park;
  const mathIn = prog(f, cWorth - 6, cAbout + 6 - (cWorth - 6), ease.linear);
  const mathStr = "× 1.45 =";
  const mathShown = mathStr.slice(0, Math.round(mathStr.length * mathIn));
  const pctIn = prog(f, c45 - 6, 8);
  const pct = 45 * prog(f, c45 - 4, 24, ease.outHard);
  const pctPulse = f >= c45 + 26 ? Math.exp(-(f - c45 - 26) / 10) : 0;
  const srcO = prog(f, cMakes, 14);
  const x80 = oldC ? Math.min(Math.max(oldC.x, 210), 400) : 280;
  const x116 = newC ? Math.min(Math.max(newC.x, 790), 870) : 800;
  v80[0] += x80 * d80;
  v80[1] += (vY + 46) * d80;
  v116[0] += x116 * d116;
  v116[1] += (vY + 50) * d116;
  const hair80 = prog(f, cMakes, 12);
  const hair116 = prog(f, cShot - 2, 12);
  const footOf = (v: [number, number, number]) => v[1] - v[2] * 0.55 + v[2] * 1.1 + 2 + 42; // under the label

  // ---- `points`' last frame, carried out: its marks fade with the first frames of the dive
  const hand = 1 - prog(f, t0 + 1, 12, ease.inOut);
  const marks = useMemo(() => ({ c: ppsCornerShots(), l: ppsLongTwoShots() }), []);
  const markPaths = (shots: PpsShot[]) => {
    const size = 3.6;
    let dots = "", rings = "", xs = "";
    for (const s of shots) {
      const p = proj(cam, B, [s.x, s.y, 0.01]);
      if (!p || p.x < -20 || p.x > 1100 || p.y < 380 || p.y > 1700) continue;
      if (s.made) {
        dots += `M${(p.x + size).toFixed(1)} ${p.y.toFixed(1)}a${size} ${size} 0 1 0 ${-2 * size} 0a${size} ${size} 0 1 0 ${2 * size} 0`;
        const rr = size + 1.6;
        rings += `M${(p.x + rr).toFixed(1)} ${p.y.toFixed(1)}a${rr} ${rr} 0 1 0 ${-2 * rr} 0a${rr} ${rr} 0 1 0 ${2 * rr} 0`;
      } else {
        const a = size * 0.95;
        xs += `M${(p.x - a).toFixed(1)} ${(p.y - a).toFixed(1)}L${(p.x + a).toFixed(1)} ${(p.y + a).toFixed(1)}M${(p.x - a).toFixed(1)} ${(p.y + a).toFixed(1)}L${(p.x + a).toFixed(1)} ${(p.y - a).toFixed(1)}`;
      }
    }
    return { dots, rings, xs };
  };
  const mC = hand > 0.001 ? markPaths(marks.c) : null;
  const mL = hand > 0.001 ? markPaths(marks.l) : null;
  const bandPoly = (() => {
    if (hand <= 0.001) return null;
    const pts: StepBackV3[] = [[SB_CORNER_X, SB_BASE, 0.004], [SB_CORNER_X, SB_KINK_Y, 0.004]];
    const ka = Math.atan2(SB_KINK_Y, SB_CORNER_X);
    for (let k = 0; k <= 72; k++) {
      const a = ka + ((Math.PI - 2 * ka) * k) / 72;
      pts.push([R3 * Math.cos(a), R3 * Math.sin(a), 0.004]);
    }
    pts.push([-SB_CORNER_X, SB_BASE, 0.004]);
    for (let k = 0; k <= 72; k++) {
      const a = Math.PI - R16_A0 - ((Math.PI - 2 * R16_A0) * k) / 72;
      pts.push([R16 * Math.cos(a), R16 * Math.sin(a), 0.004]);
    }
    return poly(cam, B, pts, false);
  })();
  const ring16 = (w: number) => {
    const pts: [number, number][] = [];
    for (let k = 0; k <= 72; k++) {
      const a = R16_A0 + ((Math.PI - 2 * R16_A0) * k) / 72;
      pts.push([R16 * Math.cos(a), R16 * Math.sin(a)]);
    }
    return band(cam, B, pts, w, 0.005);
  };
  const ringA = hand > 0.001 ? ring16(0.13) : null;
  const ringB = hand > 0.001 ? ring16(0.45) : null;
  const hairC = proj(cam, B, [23.5, SB_KINK_Y - 0.3, 0.01]);
  const hairL = proj(cam, B, [-11.5, 15.8, 0.01]);

  // the arena behind, out of focus above the horizon (the real Ball Arena stands)
  const standsO = 0.62 * lowK;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* `points` lifts off behind this scene for its last frames: an opaque copy of the ground hides it */}
      {f < scene.from + 6 && <Ground />}
      <div
        style={{
          position: "absolute",
          inset: 0,
          WebkitMaskImage: "linear-gradient(to bottom, transparent 488px, black 548px, black 1452px, transparent 1520px)",
          maskImage: "linear-gradient(to bottom, transparent 488px, black 548px, black 1452px, transparent 1520px)",
        }}
      >
        {standsO > 0.01 && (
          <div style={{ position: "absolute", left: -60, top: horizon - 330, width: 1200, height: 360, opacity: standsO, overflow: "hidden" }}>
            {/* the photo's left stands, rows of fans and a stairway, out of focus like a sneaker shot's background */}
            <Img
              src={staticFile("nba-floor/stepback-stands.jpg")}
              style={{ position: "absolute", left: -40 - 30 * follow - 14 * push, top: -250, width: 2700, height: 760, filter: "blur(3.5px) saturate(0.85) brightness(0.82)" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #0D1117 0%, rgba(13,17,23,0.45) 40%, rgba(13,17,23,0.12) 100%)" }} />
          </div>
        )}
        <StepBackFloor cam={cam} B={B} f={f} look={{ sidelineGlow: 0, apronDark: 0.3, low: lowK }} />
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <filter id="sb-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            <filter id="sb-glow2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <filter id="sb-dust" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
            <linearGradient id="sb-chart" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={1080} y2={0}>
              <stop offset="0" stopColor="#0D1117" stopOpacity={0.2 + 0.3 * prog(f, t0 + 1, 10, ease.inOut)} />
              <stop offset="1" stopColor="#0D1117" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="sb-fade" gradientUnits="userSpaceOnUse" x1={0} y1={horizon} x2={0} y2={horizon + 260}>
              <stop offset="0" stopColor="#0D1117" stopOpacity={0.85 * lowK} />
              <stop offset="1" stopColor="#0D1117" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* `points`' chart ground lifts off the floor as the camera dives */}
          {/* at mount it matches `points`' last frame (its light pool sits left of centre, its haze greys the margins),
              then eases into this scene's own light over ten frames */}
          <rect width={1080} height={1920} fill="url(#sb-chart)" opacity={1 - prog(f, t0, 24, ease.inOut)} />
          {goldTopO > 0.01 && sliverAll && <path d={sliverAll} fill={GOLD} opacity={goldTopO} />}
          {goldTopO > 0.01 && sliverL && <path d={sliverL} fill={GOLD} opacity={goldTopO} />}
          {/* the sliver, lit from the baseline up the line */}
          {/* `points`' last frame: the long-two band, the 16 ft ring, 2,000 shot marks */}
          {hand > 0.001 && (
            <g opacity={hand}>
              {bandPoly && <path d={bandPoly} fill="#FFFFFF" opacity={0.11} />}
              {bandPoly && <path d={bandPoly} fill="none" stroke="#FFFFFF" strokeWidth={1.1} opacity={0.55} />}
              {ringB && <path d={ringB} fill={GOLD} opacity={0.35} filter="url(#sb-glow2)" />}
              {ringA && <path d={ringA} fill={GOLD} />}
              {[mC, mL].map((m, i) =>
                m ? (
                  <g key={`mk${i}`} opacity={i === 0 ? 0.38 : 1}>
                    <path d={m.xs} fill="none" stroke="#0D1117" strokeWidth={2.23} strokeLinecap="round" opacity={0.45} />
                    <path d={m.xs} fill="none" stroke="#9AA3AD" strokeWidth={1.22} strokeLinecap="round" />
                    <path d={m.rings} fill="#0D1117" opacity={0.55} />
                    <path d={m.dots} fill="#FFFFFF" />
                  </g>
                ) : null,
              )}
              {hairC && <line x1={846} y1={799} x2={hairC.x} y2={hairC.y} stroke={GREY} strokeWidth={2} />}
              {hairL && <line x1={350} y1={779} x2={hairL.x} y2={hairL.y} stroke={GREY} strokeWidth={2} />}
            </g>
          )}
          {/* the sliver, light under the lacquer: low enough that the maple grain reads through it */}
          {sliver && <path d={sliver} fill={GOLD} opacity={0.2 + 0.22 * goldPulse} filter="url(#sb-glow)" />}
          {sliver && <path d={sliver} fill={GOLD} opacity={0.22 + 0.16 * goldPulse} />}
          {ghost && <path d={ghost} fill="#FFD27A" opacity={0.95} />}
          {[[printN, sN.travel], [printF, sF.travel]].map(([pr, u], i) => {
            const P = pr as { d: string | null; tread: string };
            const o = printO(u as number);
            return P.d && (u as number) > 0 ? (
              <g key={`pr${i}`} opacity={o}>
                <path d={P.d} fill="#FFF7E8" opacity={0.6} filter="url(#sb-dust)" />
                <path d={P.d} fill="none" stroke="#5A3C22" strokeOpacity={0.45} strokeWidth={1.4} />
                <path d={P.tread} fill="none" stroke="#7A5434" strokeOpacity={0.35} strokeWidth={1} />
              </g>
            ) : null;
          })}
          {gleam && <path d={gleam} fill="#FFFFFF" opacity={glO} filter="url(#sb-glow2)" />}
          {gleam && <path d={gleam} fill="#FFFFFF" opacity={glO} />}
          {kinkP && kinkFlare > 0 && <circle cx={kinkP.x} cy={kinkP.y} r={10 + 16 * kinkFlare} fill="#FFFFFF" opacity={0.7 * kinkFlare} filter="url(#sb-glow2)" />}
          {/* the far floor sinks into the dark over the gold too */}
          {lowK > 0.01 && <rect width={1080} height={1920} fill="url(#sb-fade)" />}
          {/* 1 step */}
          {stepLbl > 0.01 && hA && hB && (
            <g opacity={stepLbl}>
              <path d={`M${hA.x.toFixed(1)} ${hA.y.toFixed(1)}L${lerp(hA.x, hB.x, hDraw).toFixed(1)} ${lerp(hA.y, hB.y, hDraw).toFixed(1)}`} stroke={STEPINK} strokeWidth={2.5} />
              <path d={`M${hA.x.toFixed(1)} ${(hA.y - 14).toFixed(1)}V${(hA.y + 14).toFixed(1)}`} stroke={STEPINK} strokeWidth={2.5} />
              {hDraw > 0.98 && <path d={`M${hB.x.toFixed(1)} ${(hB.y - 14).toFixed(1)}V${(hB.y + 14).toFixed(1)}`} stroke={STEPINK} strokeWidth={2.5} />}
            </g>
          )}
          {/* hairlines from the values down to the floor */}
          {oldC && hair80 > 0.01 && <line x1={x80} y1={footOf(v80)} x2={oldC.x} y2={lerp(footOf(v80), oldC.y - 8, hair80)} stroke={STEPINK} strokeWidth={2} opacity={0.8} />}
          {newC && hair116 > 0.01 && <line x1={x116} y1={footOf(v116)} x2={newC.x} y2={lerp(footOf(v116), newC.y - 8, hair116)} stroke={STEPINK} strokeWidth={2} opacity={0.7} />}
        </svg>
        {/* the shins run up out of the light into the dark arena, like a sneaker shot on court */}
        <StepBackShoes cam={cam} B={B} shoes={shoes} legK={lowK} legTop={2.7} reflect={0.26 * lowK} />
      </div>

      {stepLbl > 0.01 && hA && hB && (
        <div style={{ position: "absolute", left: (hA.x + hB.x) / 2 - 150, top: (hA.y + hB.y) / 2 + 16, width: 300, textAlign: "center", fontFamily: UI, fontWeight: 700, fontSize: 36, color: "#FFFFFF", opacity: stepLbl, textShadow: FLOORSHADOW }}>
          1 step
        </div>
      )}

      {f < t0 + 12 && <div style={{ position: "absolute", inset: 0, background: "#C8CDD3", opacity: 0.1 * (1 - prog(f, t0 + 1, 10, ease.inOut)) }} />}
      {/* 0.80 and 1.16, carried from `points`: aside through the step, then onto where he stood and where he stands */}
      <StepBackValue x={v80[0]} y={v80[1]} size={v80[2]} value="0.80" math="2 × .401" label="long two" mathO={mathO} labelO={lblO} opacity={parkO + (1 - parkO) * d80} />
      <StepBackValue x={v116[0]} y={v116[1]} size={v116[2]} value="1.16" math="3 × .387" label="corner three" mathO={mathO} labelO={lblO} opacity={parkO + (1 - parkO) * d116} />
      {/* `points`' source line, going with its marks */}
      {hand > 0.01 && (
        <div style={{ position: "absolute", left: 60, top: 1462, fontFamily: FIG, fontSize: 26, color: GREY, opacity: hand }}>
          Basketball-Reference, 2025-26 league average: corner 3P% .387, FG% 16-3P .401
        </div>
      )}
      {/* the multiplication between them */}
      {mathIn > 0 && (
        <div style={{ position: "absolute", left: x80 + 115, top: vY + 26, width: x116 - x80 - 230, textAlign: "center", fontFamily: UI, fontWeight: 700, fontSize: 46, color: "#FFFFFF", textShadow: SHADOW, whiteSpace: "pre" }}>
          {mathShown}
        </div>
      )}
      {/* +45% over the feet */}
      {pctIn > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: x116 - 300,
            top: 552,
            width: 600,
            textAlign: "center",
            fontFamily: UI,
            fontWeight: 800,
            fontSize: 150,
            lineHeight: "160px",
            color: "#FFFFFF",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: -3,
            opacity: pctIn,
            transform: `scale(${(0.9 + 0.1 * pctIn + 0.05 * pctPulse).toFixed(3)})`,
            textShadow: SHADOW,
          }}
        >
          +{Math.round(pct)}%
        </div>
      )}
      {srcO > 0.01 && (
        <div style={{ position: "absolute", left: 60, top: 1530, fontFamily: FIG, fontSize: 26, color: GREY, opacity: srcO }}>
          Basketball-Reference, 2025-26: 3 × .387 = 1.16, 2 × .401 = 0.80
        </div>
      )}
      {standsO > 0.05 && (
        <div style={{ position: "absolute", left: 60, top: 1568, fontFamily: FIG, fontSize: 22, color: GREY, opacity: standsO / 0.62 }}>
          Stands: MhcL947, CC BY-SA 4.0
        </div>
      )}
    </div>
  );
};
