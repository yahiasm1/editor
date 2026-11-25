// A pair of white basketball sneakers built in 3D, so the same pair reads from straight above (uppers, laces, toe
// box) and from behind at shoe height (sculpted heel counter, thick white midsole with a clear air unit, padded collar,
// crew socks, the calf). Drawn from the Parker heels photo and the two Stanton Street shoes. Every surface is a fine
// mesh lit per vertex (two diffuse lights and a glossy highlight), so the leather reads smooth, not faceted. Each shoe
// has a contact shadow and its mirror copy in the satin floor, fading away from the sole as on a polished court.
import React from "react";
import {
  CS_FEET,
  cornerSwingCamSpace as camSpace,
  cornerSwingPoly as poly,
  cornerSwingProject as proj,
  type CornerSwingBasis,
  type CornerSwingCam,
  type CornerSwingV3,
} from "./CornerSwingWorld";

type RGB = [number, number, number];
const LEN = 1.08; // 13 in, a size 14
const SOLE = 0.03;

// the last's outline (half width) and the upper's top line along the foot, heel (t 0) to toe (t 1): a round heel, a
// mid-top collar highest at the Achilles, the tongue falling to the toe box
const TT = [0, 0.015, 0.04, 0.08, 0.14, 0.22, 0.29, 0.36, 0.44, 0.52, 0.62, 0.72, 0.8, 0.87, 0.93, 0.97, 1];
const WW = [0.02, 0.07, 0.104, 0.127, 0.139, 0.145, 0.149, 0.157, 0.168, 0.178, 0.186, 0.184, 0.176, 0.158, 0.126, 0.085, 0.022];
// the collar is highest at the Achilles, dips where the sock comes out, and the padded tongue rises again in front
const HH = [0.56, 0.61, 0.63, 0.6, 0.545, 0.56, 0.575, 0.47, 0.39, 0.335, 0.285, 0.245, 0.215, 0.19, 0.165, 0.145, 0.125];
const NT = 52;
const PHI = 40;

const catmull = (arr: number[], t: number) => {
  let i = 0;
  while (i < TT.length - 2 && t > TT[i + 1]) i++;
  const u = Math.max(0, Math.min(1, (t - TT[i]) / (TT[i + 1] - TT[i])));
  const p0 = arr[Math.max(0, i - 1)];
  const p1 = arr[i];
  const p2 = arr[i + 1];
  const p3 = arr[Math.min(arr.length - 1, i + 2)];
  const u2 = u * u;
  const u3 = u2 * u;
  return 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3);
};
const wAt = (t: number) => Math.max(0.012, catmull(WW, t));
const hAt = (t: number) => catmull(HH, t);
// the midsole is thickest under the heel (1.8 in) and thins toward the toe
const midAt = (t: number) => 0.15 - 0.058 * t;
// stations, denser at the round heel and the toe
const STA = Array.from({ length: NT }, (_, i) => {
  const u = i / (NT - 1);
  return 0.5 - 0.5 * Math.cos(u * Math.PI) * 0.35 + (u - 0.5) * 0.65;
});
// the toe springs up off the floor, as on every court shoe
const spring = (t: number) => (t > 0.8 ? Math.pow((t - 0.8) / 0.2, 2) * 0.05 : 0);

const norm = (a: CornerSwingV3): CornerSwingV3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const sub = (a: CornerSwingV3, b: CornerSwingV3): CornerSwingV3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const crs = (a: CornerSwingV3, b: CornerSwingV3): CornerSwingV3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dt = (a: CornerSwingV3, b: CornerSwingV3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// the arena's top light, slightly from the court side, and a soft fill from behind the camera's side
const LIGHT = norm([-0.35, -0.3, 1]);
const FILL = norm([0.6, -0.75, 0.25]);

const UPPER: RGB = [232, 235, 239];
const COUNTER: RGB = [200, 206, 214];
const MIDSOLE: RGB = [246, 245, 241];
const AIR: RGB = [150, 162, 176];
const OUTSOLE: RGB = [96, 100, 108];
const LINING: RGB = [44, 48, 58];
const PAD: RGB = [240, 241, 244];
const OVER: RGB = [52, 68, 104];
const OVER_EDGE: RGB = [34, 44, 70];
const EYESTAY: RGB = [205, 210, 218];
const TOECAP: RGB = [224, 228, 234];
const SOCK: RGB = [238, 239, 242];
const STRIPE: RGB = [36, 52, 96];
const SKIN: RGB = [108, 72, 50];
const LACE: RGB = [250, 250, 251];

type Mat = { col: RGB; ks: number; sp: number };
type Face = { pts: CornerSwingV3[]; fill: string; n: CornerSwingV3; op?: number; decal?: number };

const shade = (p: CornerSwingV3, n: CornerSwingV3, m: Mat, eye: CornerSwingV3): RGB => {
  const v = norm(sub(eye, p));
  const d1 = Math.max(0, dt(n, LIGHT));
  const d2 = Math.max(0, dt(n, FILL));
  const k = 0.4 + 0.4 * d1 + 0.34 * d2;
  const h1 = norm([LIGHT[0] + v[0], LIGHT[1] + v[1], LIGHT[2] + v[2]]);
  const h2 = norm([FILL[0] + v[0], FILL[1] + v[1], FILL[2] + v[2]]);
  const s = m.ks * (Math.pow(Math.max(0, dt(n, h1)), m.sp) + 0.6 * Math.pow(Math.max(0, dt(n, h2)), m.sp));
  // a darker rim where the surface turns away from the eye
  const rim = 1 - 0.18 * Math.pow(1 - Math.max(0, dt(n, v)), 2);
  return [m.col[0] * k * rim + 255 * s, m.col[1] * k * rim + 255 * s, m.col[2] * k * rim + 255 * s];
};
const rgb = (c: RGB) => `rgb(${Math.min(255, Math.round(c[0]))},${Math.min(255, Math.round(c[1]))},${Math.min(255, Math.round(c[2]))})`;

/** a mesh given as rows of vertices; normals from the grid, oriented away from `inside(i, j)`; each face takes the
 *  mean of its four lit corners, so neighbouring faces blend into one smooth surface */
function mesh(V: CornerSwingV3[][], mat: (i: number, j: number) => Mat, inside: (i: number, j: number) => CornerSwingV3, eye: CornerSwingV3, wrap: boolean, out: Face[], opAt?: (i: number) => number) {
  const R = V.length;
  const C = V[0].length;
  const N: CornerSwingV3[][] = V.map((row, i) =>
    row.map((p, j) => {
      const a = V[Math.min(R - 1, i + 1)][j];
      const b = V[Math.max(0, i - 1)][j];
      const jn = wrap ? (j + 1) % C : Math.min(C - 1, j + 1);
      const jp = wrap ? (j - 1 + C) % C : Math.max(0, j - 1);
      let n = norm(crs(sub(a, b), sub(V[i][jn], V[i][jp])));
      if (dt(n, sub(p, inside(i, j))) < 0) n = [-n[0], -n[1], -n[2]];
      return n;
    }),
  );
  const L: RGB[][] = V.map((row, i) => row.map((p, j) => shade(p, N[i][j], mat(i, j), eye)));
  const cols = wrap ? C : C - 1;
  for (let i = 0; i < R - 1; i++) {
    for (let j = 0; j < cols; j++) {
      const j1 = (j + 1) % C;
      const c: RGB = [0, 0, 0];
      for (const q of [L[i][j], L[i + 1][j], L[i + 1][j1], L[i][j1]]) for (let k = 0; k < 3; k++) c[k] += q[k] / 4;
      const n = norm([N[i][j][0] + N[i + 1][j1][0], N[i][j][1] + N[i + 1][j1][1], N[i][j][2] + N[i + 1][j1][2]]);
      const op = opAt ? (opAt(i) + opAt(i + 1)) / 2 : 1;
      if (op > 0.004) out.push({ pts: [V[i][j], V[i + 1][j], V[i + 1][j1], V[i][j1]], fill: rgb(c), n, op });
    }
  }
}

/** one shoe in world space: toe pointing toward the basket (-x), turned by `a` radians */
function shoeFaces(x0: number, y0: number, a: number, lift: number, legK: number, eye: CornerSwingV3): Face[] {
  const dir: [number, number] = [-Math.cos(a), Math.sin(a)]; // heel -> toe
  const side: [number, number] = [Math.sin(a), Math.cos(a)];
  const heelX = x0 + LEN * Math.cos(a);
  const heelY = y0 - LEN * Math.sin(a);
  const W3 = (t: number, b: number, z: number): CornerSwingV3 => [heelX + dir[0] * t * LEN + side[0] * b, heelY + dir[1] * t * LEN + side[1] * b, z + lift];
  const axis = (t: number, z: number) => W3(t, 0, z);
  const faces: Face[] = [];
  const M = (col: RGB, ks = 0.1, sp = 30): Mat => ({ col, ks, sp });

  // outsole and midsole: closed walls round the outline, as rings stacked in height
  const outline = (z: (t: number) => number, grow: number): CornerSwingV3[] => {
    const out: CornerSwingV3[] = [];
    for (let i = 0; i < NT; i++) out.push(W3(STA[i], wAt(STA[i]) + grow, z(STA[i]) + spring(STA[i])));
    for (let i = NT - 1; i >= 0; i--) out.push(W3(STA[i], -(wAt(STA[i]) + grow), z(STA[i]) + spring(STA[i])));
    return out;
  };
  const tOf = (j: number) => STA[j < NT ? j : 2 * NT - 1 - j];
  const rings = [
    outline(() => 0, 0.004),
    outline(() => SOLE, 0.012),
    outline(() => SOLE + 0.012, 0.016),
    outline((t) => SOLE + 0.012 + (midAt(t) - SOLE - 0.012) * 0.55, 0.018),
    outline((t) => midAt(t), 0.012),
  ];
  mesh(
    rings,
    (i, j) => {
      if (i === 0) return M(OUTSOLE, 0.05, 20);
      // the clear air unit shows through the lower midsole under the heel
      if (i === 2 && tOf(j) < 0.3) return M(AIR, 0.55, 40);
      return M(MIDSOLE, 0.06, 18);
    },
    (_i, j) => axis(tOf(j), 0.05),
    eye,
    true,
    faces,
  );
  // the ledge where the upper meets the midsole
  mesh([outline((t) => midAt(t), 0.012), outline((t) => midAt(t) + 0.003, 0)], () => M(MIDSOLE, 0.05, 18), (_i, j) => axis(tOf(j), 0), eye, true, faces);

  // the upper: one smooth leather skin lofted over the last, from the round heel to the toe box
  const U: CornerSwingV3[][] = [];
  for (let i = 0; i < NT; i++) {
    const t = STA[i];
    const row: CornerSwingV3[] = [];
    const w = wAt(t);
    const zb = midAt(t) + 0.003;
    const h = hAt(t) - zb;
    for (let k = 0; k <= PHI; k++) {
      const phi = (Math.PI * k) / PHI;
      const zf = Math.pow(Math.sin(phi), 0.7);
      const bulge = t < 0.12 ? 0.022 * Math.sin(Math.PI * Math.min(1, zf * 1.15)) * (1 - t / 0.12) : 0;
      row.push(W3(t - bulge / LEN, w * Math.cos(phi), zb + spring(t) + h * zf));
    }
    U.push(row);
  }
  mesh(
    U,
    (i, k) => {
      const t = STA[i];
      const top = Math.sin((Math.PI * k) / PHI);
      if (t < 0.26 && top > 0.975) return M(LINING, 0.05, 10); // the collar's opening
      if (t < 0.3 && top > 0.86) return M(PAD, 0.12, 14); // the padded collar round the ankle
      if (t < 0.17 + 0.1 * (1 - top) && top < 0.86) return M(COUNTER, 0.55, 48); // the moulded heel counter, the glossiest part
      // a side overlay sweeping up from the forefoot to the ankle, its stitched edge a touch darker
      if (t > 0.3 && t < 0.72 && top > 0.86 && top < 0.93) return M(EYESTAY, 0.25, 30); // the eyestay the laces run through
      if (t > 0.83 && top < 0.7) return M(TOECAP, 0.3, 30); // the toe cap
      return M(UPPER, 0.26, 36);
    },
    (i) => axis(STA[i], midAt(STA[i]) + 0.08),
    eye,
    false,
    faces,
  );
  // the side overlay, a separate panel stitched onto the upper: drawn as its own smooth path a hair proud of the
  // leather, so its edges are clean curves, in segments along the foot, each lit at its centre
  const surf = (t: number, top: number, sgn: number, k: number): CornerSwingV3 => {
    const phi = sgn > 0 ? Math.asin(Math.min(0.999, top)) : Math.PI - Math.asin(Math.min(0.999, top));
    const zb = midAt(t) + 0.003;
    return W3(t, wAt(t) * Math.cos(phi) * k, zb + spring(t) + (hAt(t) - zb) * Math.pow(Math.sin(phi), 0.7));
  };
  const cOf = (t: number) => 0.08 + (0.74 - t) * 1.3;
  const hwOf = (t: number) => 0.13 * Math.min(1, (0.77 - t) / 0.2) + 0.012;
  for (const sgn of [1, -1]) {
    for (const [extra, col, k, layer] of [[0.028, OVER_EDGE, 1.012, 1], [0, OVER, 1.02, 2]] as [number, RGB, number, number][]) {
      const t0 = 0.205;
      const t1 = 0.765;
      const SEG = 14;
      for (let g = 0; g < SEG; g++) {
        const ta = t0 + ((t1 - t0) * g) / SEG;
        const tb = t0 + ((t1 - t0) * (g + 1)) / SEG;
        const edge = (t: number, up: number) => Math.max(0, Math.min(0.95, cOf(t) + up * (hwOf(t) + extra)));
        const pts: CornerSwingV3[] = [];
        for (let q = 0; q <= 4; q++) pts.push(surf(ta + ((tb - ta) * q) / 4, edge(ta + ((tb - ta) * q) / 4, 1), sgn, k));
        for (let q = 4; q >= 0; q--) pts.push(surf(ta + ((tb - ta) * q) / 4, edge(ta + ((tb - ta) * q) / 4, -1), sgn, k));
        const tm = (ta + tb) / 2;
        const pm = surf(tm, cOf(tm), sgn, k);
        const n = norm(sub(pm, axis(tm, midAt(tm) + 0.08)));
        faces.push({ pts, fill: rgb(shade(pm, n, M(col, 0.42, 40), eye)), n, decal: layer });
      }
    }
  }

  // pull tab: a small loop standing just proud of the collar at the back
  {
    const zt = hAt(0.01);
    faces.push({ pts: [W3(0.0, 0.03, zt - 0.06), W3(0.0, -0.03, zt - 0.06), W3(-0.006, -0.026, zt + 0.018), W3(-0.006, 0.026, zt + 0.018)], fill: rgb([200, 205, 212]), n: norm([-dir[0], -dir[1], 0.2]) });
  }
  // laces: seven crossings over the tongue, a little proud of it, each a flat white band lit like the upper
  for (let c = 0; c < 7; c++) {
    const t = 0.34 + c * 0.05;
    // every lace point sits on the tongue's own slope, a hair proud of it
    const Lp = (tt: number, f: number): CornerSwingV3 => {
      const zb = midAt(tt) + 0.003;
      const z = zb + (hAt(tt) - zb) * (f === 0 ? 1 : 0.94) + spring(tt) + 0.004;
      return W3(tt, f * wAt(tt) * 0.4, z);
    };
    const n: CornerSwingV3 = [0, 0, 1];
    const col = rgb(shade(axis(t, hAt(t)), n, M(LACE, 0.2, 20), eye));
    faces.push({ pts: [Lp(t, 1), Lp(t + 0.016, 1), Lp(t + 0.028, 0), Lp(t + 0.012, 0)], fill: col, n });
    faces.push({ pts: [Lp(t + 0.012, 0), Lp(t + 0.028, 0), Lp(t + 0.016, -1), Lp(t, -1)], fill: col, n });
    faces.push({ pts: [Lp(t + 0.012, 1), Lp(t + 0.028, 1), Lp(t + 0.016, 0), Lp(t, 0)], fill: col, n });
    faces.push({ pts: [Lp(t, 0), Lp(t + 0.016, 0), Lp(t + 0.028, -1), Lp(t + 0.012, -1)], fill: col, n });
  }

  // the sock, always; the leg above it fades in as the camera comes down, and fades out upward into the dark arena
  const lc = axis(0.15, 0);
  const segs = 30;
  const sockTop = 0.98;
  const sm = (a0: number, a1: number, x: number) => {
    const u = Math.min(1, Math.max(0, (x - a0) / (a1 - a0)));
    return u * u * (3 - 2 * u);
  };
  // [height, radius back-front, radius side-side, material]
  const sockRings: [number, number, number, Mat][] = [
    [0.5, 0.118, 0.1, M(SOCK, 0.04, 8)],
    [0.8, 0.124, 0.108, M(SOCK, 0.04, 8)],
    [0.86, 0.125, 0.109, M(STRIPE, 0.04, 8)],
    [0.9, 0.125, 0.109, M(STRIPE, 0.04, 8)],
    [0.92, 0.126, 0.11, M(SOCK, 0.04, 8)],
    [sockTop, 0.128, 0.112, M(SOCK, 0.04, 8)],
  ];
  const legRings: [number, number, number, Mat][] = [
    [sockTop - 0.005, 0.121, 0.107, M(SKIN, 0.22, 16)],
    [1.3, 0.13, 0.115, M(SKIN, 0.22, 16)],
    [1.7, 0.17, 0.15, M(SKIN, 0.22, 16)],
    [2.1, 0.198, 0.17, M(SKIN, 0.22, 16)],
    [2.6, 0.2, 0.172, M(SKIN, 0.22, 16)],
    [3.2, 0.18, 0.16, M(SKIN, 0.22, 16)],
    [3.8, 0.17, 0.16, M(SKIN, 0.22, 16)],
  ];
  const tube = (rs: [number, number, number, Mat][], opAt?: (i: number) => number) => {
    const V: CornerSwingV3[][] = rs.map(([z, rx, ry]) => {
      const row: CornerSwingV3[] = [];
      for (let q = 0; q < segs; q++) {
        const ang = (q / segs) * Math.PI * 2;
        // the calf sits behind the shin: the back of the leg bulges more than the front
        const bulge = z > 1.3 ? 1 + 0.18 * Math.max(0, Math.cos(ang)) * Math.min(1, (z - 1.3) / 0.6) : 1;
        row.push([lc[0] - Math.cos(ang) * rx * bulge * dir[0] + Math.sin(ang) * ry * side[0], lc[1] - Math.cos(ang) * rx * bulge * dir[1] + Math.sin(ang) * ry * side[1], z + lift]);
      }
      return row;
    });
    mesh(
      V,
      (i, q) => {
        const m = rs[i][3];
        // the sock's knit ribs: alternate columns a touch darker
        if (m.col === SOCK && q % 2 === 0) return { ...m, col: [226, 228, 232] as RGB };
        return m;
      },
      (i) => [lc[0], lc[1], rs[i][0] + lift],
      eye,
      true,
      faces,
      opAt,
    );
  };
  tube(sockRings);
  // the leg's cross-section where it leaves the sock, so the sock is never an empty tube from above
  {
    const pts: CornerSwingV3[] = [];
    for (let q = 0; q < 20; q++) {
      const ang = (q / 20) * Math.PI * 2;
      pts.push([lc[0] - Math.cos(ang) * 0.124 * dir[0] + Math.sin(ang) * 0.109 * side[0], lc[1] - Math.cos(ang) * 0.124 * dir[1] + Math.sin(ang) * 0.109 * side[1], sockTop + lift]);
    }
    faces.push({ pts, fill: rgb(shade(axis(0.15, sockTop), [0, 0, 1], M(SKIN, 0.1, 10), eye)), n: [0, 0, 1] });
  }
  if (legK > 0.01) tube(legRings, (i) => legK * (1 - sm(2.3, 3.75, legRings[i][0])));
  return faces;
}

export const CornerSwingShoes: React.FC<{
  cam: CornerSwingCam;
  B: CornerSwingBasis;
  lifts: [number, number]; // ft above the floor, per shoe, while they set down
  alpha: [number, number];
  legK: number; // 0 from above .. 1 at shoe height
  reflect: number; // opacity of the floor's mirror copy
}> = ({ cam, B, lifts, alpha, legK, reflect }) => {
  const shoes = [CS_FEET.near, CS_FEET.far];
  // the farther shoe is painted first
  const order = [0, 1].sort((p, q) => camSpace(B, [shoes[q].x, shoes[q].y, 0])[2] - camSpace(B, [shoes[p].x, shoes[p].y, 0])[2]);
  const draw = (mirror: boolean) =>
    order.map((si) => {
      const s = shoes[si];
      if (alpha[si] <= 0.001) return null;
      const faces = shoeFaces(s.x, s.y, s.a, lifts[si], mirror ? Math.min(legK, 0.25) : legK, B.e);
      const vis: { d: string; fill: string; depth: number; op: number; decal: number }[] = [];
      for (const fc of faces) {
        const pts = mirror ? fc.pts.map((p) => [p[0], p[1], -p[2]] as CornerSwingV3) : fc.pts;
        const n: CornerSwingV3 = mirror ? [fc.n[0], fc.n[1], -fc.n[2]] : fc.n;
        const c = pts.reduce<CornerSwingV3>((q, p) => [q[0] + p[0] / pts.length, q[1] + p[1] / pts.length, q[2] + p[2] / pts.length], [0, 0, 0]);
        if (dt(n, sub(B.e, c)) <= -0.002) continue;
        const d = poly(cam, B, pts, false);
        if (!d) continue;
        vis.push({ d, fill: fc.fill, depth: camSpace(B, c)[2], op: fc.op ?? 1, decal: fc.decal ?? 0 });
      }
      // painter's order, with the overlay panels laid over the leather they are stitched to
      vis.sort((p, q) => p.decal - q.decal || q.depth - p.depth);
      const body = vis.map((v, i) => <path key={i} d={v.d} fill={v.fill} stroke={v.fill} strokeWidth={0.9} strokeLinejoin="round" opacity={v.op < 1 ? v.op : undefined} />);
      if (!mirror) {
        return (
          <g key={`s${si}`} opacity={alpha[si]}>
            {body}
          </g>
        );
      }
      // the reflection is sharp at the sole and fades as it goes down into the boards
      const pc = proj(cam, B, [s.x + 0.5 * Math.cos(s.a), s.y, 0]);
      const pt = proj(cam, B, [s.x + 0.5 * Math.cos(s.a), s.y, -0.75]);
      const y0 = pc ? pc.y : 0;
      const y1 = pt ? pt.y : y0 + 200;
      return (
        <g key={`m${si}`} opacity={alpha[si] * reflect}>
          <defs>
            <linearGradient id={`cs-rg${si}`} gradientUnits="userSpaceOnUse" x1={0} y1={y0} x2={0} y2={y1}>
              <stop offset="0" stopColor="#fff" stopOpacity={1} />
              <stop offset="0.5" stopColor="#fff" stopOpacity={0.5} />
              <stop offset="1" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
            <mask id={`cs-rm${si}`} maskUnits="userSpaceOnUse" x={-200} y={-200} width={1480} height={2320}>
              <rect x={-200} y={-200} width={1480} height={2320} fill={`url(#cs-rg${si})`} />
            </mask>
          </defs>
          <g mask={`url(#cs-rm${si})`}>{body}</g>
        </g>
      );
    });
  // contact shadows
  const shadows = shoes.map((s, si) => {
    const pts: CornerSwingV3[] = [];
    for (let k = 0; k < 24; k++) {
      const ang = (k / 24) * Math.PI * 2;
      const cx = s.x + 0.54 * Math.cos(s.a);
      const cy = s.y - 0.54 * Math.sin(s.a);
      pts.push([cx + Math.cos(ang) * (0.6 + lifts[si] * 0.3), cy + Math.sin(ang) * (0.2 + lifts[si] * 0.2), 0.003]);
    }
    const d = poly(cam, B, pts, false);
    const near = camSpace(B, [s.x, s.y, 0])[2];
    return d ? (
      <path key={`sh${si}`} d={d} fill="#1A0E04" opacity={alpha[si] * (0.45 - Math.min(0.3, lifts[si] * 0.5))} style={{ filter: `blur(${Math.max(2, (cam.F / Math.max(1, near)) * 0.05).toFixed(1)}px)` }} />
    ) : null;
  });
  // from above, the player standing over his shoes: his shadow cast by the arena's top light, falling toward the
  // sideline. It says a man is there, not an empty pair of shoes.
  const bodyShadow = (() => {
    const cxw = (CS_FEET.near.x + CS_FEET.far.x) / 2 + 0.55;
    const cyw = (CS_FEET.near.y + CS_FEET.far.y) / 2 + 0.15;
    const pts: CornerSwingV3[] = [];
    for (let k = 0; k < 32; k++) {
      const ang = (k / 32) * Math.PI * 2;
      pts.push([cxw + Math.cos(ang) * 1.05, cyw + Math.sin(ang) * 1.45, 0.003]);
    }
    const d = poly(cam, B, pts, false);
    const ppf = cam.F / Math.max(1, camSpace(B, [cxw, cyw, 0])[2]);
    const op = Math.min(alpha[0], alpha[1]) * 0.3 * (1 - legK);
    return d && op > 0.005 ? <path d={d} fill="#140A02" opacity={op} style={{ filter: `blur(${(ppf * 0.35).toFixed(1)}px)` }} /> : null;
  })();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <filter id="cs-refl" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <filter id="cs-smooth" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>
      {bodyShadow}
      {reflect > 0.01 && <g filter="url(#cs-refl)">{draw(true)}</g>}
      {shadows}
      <g filter={legK > 0.05 ? "url(#cs-smooth)" : undefined}>{draw(false)}</g>
    </svg>
  );
};
