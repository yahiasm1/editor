// Hook B's world: one camera behind the shooter (plan.md coordinates, feet: origin = rim centre, +x right, +y toward
// the shooter, z up), the court at Rule 1 geometry, the coach's clipboard as a real plane hinged on the floor in front of
// Shaq, the marker ink in court units, and a homography so photos (logos) sit on that plane. Pure functions only.

export const HookX2K = 0.1; // clipboard scale: 1 court foot printed = 0.1 ft of board (a 5.4 ft board, read big in the foreground)
// the hook's camera, and the one `backwards` opens on (its court camera, 70 px high as it starts to settle): in the
// silence the hook dollies from the first to the second, so the court under the cut is the same court
const HookX2CAM0 = { H: 7, A: (8 * Math.PI) / 180, Y: 14.3 + 15, F: 1681, CX: 540, CY: 796 };
const HookX2CAM1 = { H: 6, A: (14 * Math.PI) / 180, Y: 13.92 + 8, F: 460, CX: 540, CY: 1150 - 70 };
export const HookX2CAM = { ...HookX2CAM0 };
/** set the camera for this frame: 0 = the hook's, 1 = the scorebug court's */
export function hookX2SetCam(k: number) {
  const m = (a: number, b: number) => a + (b - a) * k;
  HookX2CAM.H = m(HookX2CAM0.H, HookX2CAM1.H);
  HookX2CAM.A = m(HookX2CAM0.A, HookX2CAM1.A);
  HookX2CAM.Y = m(HookX2CAM0.Y, HookX2CAM1.Y);
  HookX2CAM.F = Math.exp(m(Math.log(HookX2CAM0.F), Math.log(HookX2CAM1.F)));
  HookX2CAM.CY = m(HookX2CAM0.CY, HookX2CAM1.CY);
}
export const HookX2SHAQ_Y = 14.3; // his toes on the line (near edge 13.92)

/** world feet -> stage px, and the depth */
export function hookX2P(x: number, y: number, z: number): [number, number, number] {
  const c = HookX2CAM;
  const dy = c.Y - y;
  const dz = z - c.H;
  const d = dy * Math.cos(c.A) - dz * Math.sin(c.A);
  const up = dy * Math.sin(c.A) + dz * Math.cos(c.A);
  return [c.CX + (c.F * x) / d, c.CY - (c.F * up) / d, d];
}

export type HookX2Pose = { yh: number; theta: number; snap: number; dx: number };

/**
 * The clipboard is addressed in court units: u = court x (feet, -25..25), b = feet from the baseline (0 at the top
 * of the print, 31 at its bottom edge). The frame runs past the print: sides to |u| 26.8, top to b -1.8, the tray to
 * b 34.8, which is the hinge on the floor. snap 0..1 carries the flat board onto the real court (b -> y = b - 5.25).
 */
export function hookX2Board(p: HookX2Pose, u: number, b: number): [number, number, number] {
  const L = (34.8 - b) * HookX2K;
  const t = (p.theta * Math.PI) / 180;
  const bx = u * HookX2K + p.dx;
  const by = p.yh - L * Math.cos(t);
  const bz = L * Math.sin(t);
  if (p.snap <= 0) return [bx, by, bz];
  const s = p.snap;
  return [bx + (u - bx) * s, by + (b - 5.25 - by) * s, bz * (1 - s)];
}

export const hookX2BP = (p: HookX2Pose, u: number, b: number) => {
  const w = hookX2Board(p, u, b);
  return hookX2P(w[0], w[1], w[2]);
};

/** a court-unit polyline on the board (or the floor), projected to an svg path */
export function hookX2Path(p: HookX2Pose, pts: [number, number][], close = false) {
  let d = "";
  pts.forEach(([u, b], i) => {
    const [x, y] = hookX2BP(p, u, b);
    d += `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return close ? d + "Z" : d;
}

/** the first k (0..1) of a polyline, by length */
export function hookX2Cut(pts: [number, number][], k: number): [number, number][] {
  if (k >= 1) return pts;
  if (k <= 0 || pts.length < 2) return [];
  const seg: number[] = [];
  let tot = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(l);
    tot += l;
  }
  let left = tot * k;
  const out: [number, number][] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (left >= seg[i - 1]) {
      out.push(pts[i]);
      left -= seg[i - 1];
    } else {
      const r = left / seg[i - 1];
      out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * r, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * r]);
      break;
    }
  }
  return out;
}

export function hookX2Arc(cx: number, cb: number, r: number, a0: number, a1: number, n = 36): [number, number][] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + r * Math.cos(a), cb + r * Math.sin(a)] as [number, number];
  });
}

/** seeded random in [0, 1) */
export const hookX2Rnd = (i: number, k = 0) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** CSS matrix3d that maps a w x h box (origin 0 0) onto a screen quad tl, tr, br, bl */
export function hookX2Matrix(w: number, h: number, q: [number, number][]) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den;
  const h2 = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h2 * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + h2 * y3, f = y0;
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, h2 / h, 0, 0, 1, 0, c, f, 0, 1];
  return `matrix3d(${m.map((v) => +v.toFixed(8)).join(",")})`;
}

// ---- marker handwriting: glyphs in a box 1 tall (x right, y down), drawn as strokes ----
const O: [number, number][] = Array.from({ length: 17 }, (_, i) => {
  const a = -Math.PI / 2 - (i / 16) * Math.PI * 2.08;
  return [0.3 + 0.3 * Math.cos(a), 0.5 + 0.5 * Math.sin(a)];
});
export const HookX2GLYPH: Record<string, { w: number; s: [number, number][][] }> = {
  "3": { w: 0.62, s: [[[0.04, 0.14], [0.22, 0.01], [0.46, 0.02], [0.58, 0.18], [0.5, 0.37], [0.27, 0.46], [0.5, 0.53], [0.62, 0.74], [0.52, 0.93], [0.27, 1], [0.03, 0.88]]] },
  "4": { w: 0.66, s: [[[0.46, 0.02], [0.02, 0.68], [0.66, 0.68]], [[0.5, 0.0], [0.47, 1.0]]] },
  "+": { w: 0.6, s: [[[0.3, 0.22], [0.31, 0.8]], [[0.04, 0.52], [0.58, 0.5]]] },
  "2": { w: 0.62, s: [[[0.03, 0.2], [0.18, 0.03], [0.42, 0.0], [0.58, 0.16], [0.54, 0.4], [0.02, 1.0], [0.64, 0.97]]] },
  F: { w: 0.52, s: [[[0.52, 0.02], [0.05, 0.0], [0.04, 1.0]], [[0.05, 0.47], [0.42, 0.48]]] },
  O: { w: 0.62, s: [O] },
  U: { w: 0.6, s: [[[0.03, 0], [0.04, 0.7], [0.15, 0.94], [0.3, 1.0], [0.46, 0.94], [0.57, 0.7], [0.58, 0]]] },
  L: { w: 0.52, s: [[[0.05, 0], [0.04, 1], [0.52, 0.99]]] },
  H: { w: 0.62, s: [[[0.04, 0], [0.04, 1]], [[0.6, 0], [0.6, 1]], [[0.05, 0.5], [0.59, 0.49]]] },
  I: { w: 0.24, s: [[[0.12, 0], [0.12, 1]]] },
  M: { w: 0.74, s: [[[0.03, 1], [0.06, 0], [0.37, 0.62], [0.68, 0], [0.71, 1]]] },
  " ": { w: 0.34, s: [] },
};

/** a word in marker, strokes in court units: origin (u, b) is its top left, size its height, slant in x per y */
export function hookX2Word(text: string, u: number, b: number, size: number, gap = 0.16, slant = -0.12, seed = 1): [number, number][][] {
  const out: [number, number][][] = [];
  let x = 0;
  [...text].forEach((ch, ci) => {
    const g = HookX2GLYPH[ch];
    if (!g) return;
    g.s.forEach((st, si) => {
      out.push(
        st.map(([gx, gy], k) => {
          const j = (hookX2Rnd(ci * 31 + si * 7 + k, seed) - 0.5) * 0.05;
          return [u + (x + gx + slant * (gy - 0.5) + j) * size, b + (gy + j) * size] as [number, number];
        }),
      );
    });
    x += g.w + gap;
  });
  return out;
}

/** total width of a word in units of its height */
export const hookX2WordW = (text: string, gap = 0.16) => [...text].reduce((s, ch) => s + (HookX2GLYPH[ch]?.w ?? 0) + gap, -gap);

/** the Lakers cut-out (719 x 2327, soles on the bottom row) at the line: 7 ft 1 in projected at his depth */
export const hookX2Shaq = () => {
  const h = hookX2P(0, HookX2SHAQ_Y, 0)[1] - hookX2P(0, HookX2SHAQ_Y, 7.1)[1];
  return { h, w: (h * 719) / 2327, s: h / 2327, feetX: 0.6 };
};
