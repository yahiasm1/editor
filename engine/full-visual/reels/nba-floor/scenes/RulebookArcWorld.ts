// One NBA half court in feet (plan.md, "Thread object"): origin = middle of the basket, +x right, +y toward half
// court. Seen straight down by an orthographic camera: the world point (cx, cy) sits at screen (540, RA_SCREEN_Y)
// and one foot is ppf pixels. Baseline at the bottom of the screen, the arc opening upward.
import { interpolate } from "remotion";

export type RulebookArcCam = { cx: number; cy: number; ppf: number; dx: number; dy: number };

export const RA_LINE = 1 / 6; // 2 in paint
export const RA_R = 23.75; // the arc, to its outer edge
export const RA_CORNER = 22; // outer edge of the straight corner line
export const RA_SIDE = 25; // sideline inner edge
export const RA_BASE = -5.25;
export const RA_HALF = 41.75;
export const RA_APRON = 3;
export const RA_KINK_Y = Math.sqrt(RA_R * RA_R - RA_CORNER * RA_CORNER); // 8.95
export const RA_KINK_A = Math.atan2(RA_KINK_Y, RA_CORNER); // 0.386 rad from the rim-level axis
export const RA_SCREEN_Y = 990;

/** the mount frame: exactly the width scene's last frame (WIDE_END2: 19.5 px/ft, baseline at y 1427), so the
 *  handover has no jump */
export const RA_ARC: RulebookArcCam = { cx: 0, cy: RA_BASE + (1427 - RA_SCREEN_Y) / 19.5, ppf: 19.5, dx: 0, dy: 0 };
/** the floor slid down under the rule card */
export const RA_DOWN: RulebookArcCam = { ...RA_ARC, cy: RA_ARC.cy + 300 / 19.5, ppf: 19.5 * 0.96 };
/** the floor while the rule's strip sits on top of the stage: lower and a touch smaller, left of Instagram's buttons */
export const RA_LOW: RulebookArcCam = { cx: 0.6, cy: RA_BASE + (1478 - RA_SCREEN_Y) / 19, ppf: 19, dx: 0, dy: 0 };
/** the closing frame: both corners clear of Instagram's right-hand buttons */
export const RA_END: RulebookArcCam = { cx: -0.5, cy: RA_BASE + (1420 - RA_SCREEN_Y) / 17.5, ppf: 17.5, dx: 0, dy: 0 };
/** CORNER FRAME on the right corner: line, 3 ft strip, sideline, apron, at 150 px/ft */
export const RA_CORNER_CAM: RulebookArcCam = { cx: 24.0, cy: 0.35, ppf: 150, dx: 0, dy: 0 };

/** world -> screen */
export const raP = (c: RulebookArcCam, x: number, y: number) => ({
  x: 540 + c.dx + (x - c.cx) * c.ppf,
  y: RA_SCREEN_Y + c.dy - (y - c.cy) * c.ppf,
});

/** the svg transform that puts world feet on screen */
export const raTransform = (c: RulebookArcCam) =>
  `translate(${(540 + c.dx).toFixed(2)} ${(RA_SCREEN_Y + c.dy).toFixed(2)}) scale(${c.ppf.toFixed(4)} ${(-c.ppf).toFixed(4)}) translate(${(-c.cx).toFixed(4)} ${(-c.cy).toFixed(4)})`;

/** a zoom that travels straight at its target: position follows 1/ppf, so nothing drifts sideways */
export function raCamMix(a: RulebookArcCam, b: RulebookArcCam, t: number): RulebookArcCam {
  if (t <= 0) return a;
  if (t >= 1) return b;
  const ppf = Math.exp(Math.log(a.ppf) + (Math.log(b.ppf) - Math.log(a.ppf)) * t);
  const w = Math.abs(1 / b.ppf - 1 / a.ppf) < 1e-9 ? t : (1 / ppf - 1 / a.ppf) / (1 / b.ppf - 1 / a.ppf);
  return { cx: a.cx + (b.cx - a.cx) * w, cy: a.cy + (b.cy - a.cy) * w, ppf, dx: a.dx + (b.dx - a.dx) * t, dy: a.dy + (b.dy - a.dy) * t };
}

/** deterministic noise */
export const raRnd = (i: number, seed = 1) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** svg path of a circle arc in world coords, angles in radians (0 = +x, ccw) */
export function raArcPath(cx: number, cy: number, r: number, a0: number, a1: number, n = 64) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(4)} ${(cy + r * Math.sin(a)).toFixed(4)}`;
  }
  return d;
}

export const raClamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const raLerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const raLin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** feet and inches as the tape reads them: 23' 9" */
export function raFeetInches(ft: number) {
  let feet = Math.floor(ft + 1e-6);
  let inch = Math.round((ft - feet) * 12);
  if (inch >= 12) {
    feet += 1;
    inch = 0;
  }
  return `${feet}' ${inch}"`;
}
