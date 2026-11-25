// wilt-100 "crowd": the arena on one canvas, drawn from the camera every frame. The barrel vault (ribs, recessed bays,
// vents), the hanging reflector lamps, the end walls, the seat banks cut by stair aisles, 7,000 wooden seats, the
// 4,124 amber witnesses, the oval floor and the 1962 court with its 12 ft keyholes and baskets on stanchions.
import React, { useLayoutEffect, useRef } from "react";
import { ease, prog } from "../../../src/engine";
import {
  AMBER, ARENA, SEATS, type CrowdHalfEmptyT, type CrowdHalfEmptyView, type V3, clamp, crowdHalfEmptyCount,
  ribZ, vaultPt,
} from "./CrowdHalfEmptyKit";

const W = 1080, H = 1920;
const LAMPS: V3[] = [];
for (let k = 0; k < ARENA.ribs - 1; k++) {
  const z = (ribZ(k) + ribZ(k + 1)) / 2;
  if (z > -36) for (const x of [-6.5, 6.5]) LAMPS.push([x, 24.5 + Math.abs(x) * -0.25, z]);
}
/** light at a point: the lamps' cones fall on the floor, the vault catches the bounce */
function light(p: V3, sweep: number) {
  let v = 0;
  for (const l of LAMPS) {
    const dx = p[0] - l[0], dz = p[2] - l[2], dy = l[1] - p[1];
    v += 1 / (1 + (dx * dx + dz * dz) / (40 + dy * 2.2));
  }
  const s = sweep > -100 ? 0.5 * Math.exp(-(((p[2] - sweep) / 7) ** 2)) : 0;
  return v / 4.2 + s;
}
const rgb = (r: number, g: number, b: number, k: number, a = 1) =>
  `rgba(${Math.round(clamp(r * k, 0, 255))},${Math.round(clamp(g * k, 0, 255))},${Math.round(clamp(b * k, 0, 255))},${a})`;

type Ctx = CanvasRenderingContext2D;
function quad(c: Ctx, V: CrowdHalfEmptyView, pts: V3[], fill: string, stroke?: string, lw = 1) {
  const q = pts.map(V.P);
  if (q.some((p) => p.z < 0.4)) return false;
  c.beginPath();
  q.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
  c.closePath();
  c.fillStyle = fill;
  c.fill();
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); }
  return true;
}

/** a polygon clipped at the camera's near plane, so a surface running under the camera (the concourse floor at the
 *  door) still fills the frame down to its foot */
function quadClip(c: Ctx, V: CrowdHalfEmptyView, pts: V3[], fill: string) {
  const NEAR = 0.3;
  const depth = (p: V3) => (p[0] - V.cam.pos[0]) * V.fwd[0] + (p[1] - V.cam.pos[1]) * V.fwd[1] + (p[2] - V.cam.pos[2]) * V.fwd[2];
  const out: V3[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], da = depth(a), db = depth(b);
    if (da >= NEAR) out.push(a);
    if ((da >= NEAR) !== (db >= NEAR)) {
      const t = (NEAR - da) / (db - da);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
    }
  }
  if (out.length < 3) return;
  const q = out.map(V.P);
  c.beginPath();
  q.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
  c.closePath();
  c.fillStyle = fill;
  c.fill();
  c.strokeStyle = fill; c.lineWidth = 1; c.stroke();
}

export function drawCrowdHalfEmptyArena(c: Ctx, f: number, T: CrowdHalfEmptyT, V: CrowdHalfEmptyView) {
  c.clearRect(0, 0, W, H);
  c.fillStyle = "#0B0E13";
  c.fillRect(0, 0, W, H);
  // the slow light down the vault while the house settles
  const sw = prog(f, T.people - 10, T.half - T.people + 40, ease.inOut);
  const sweep = sw > 0 && sw < 1 ? -44 + 96 * sw : -999;
  const SEG = 30;

  /* the far end wall, under the vault's last curve */
  {
    const z = ARENA.zFar;
    const pts: V3[] = [[ARENA.springX, 0, z]];
    for (let i = 0; i <= SEG; i++) { const [x, y] = vaultPt((Math.PI * i) / SEG); pts.push([x, y, z]); }
    pts.push([-ARENA.springX, 0, z]);
    quad(c, V, pts, rgb(46, 50, 56, 0.55 + 0.25 * light([0, 14, z - 4], sweep)));
  }
  /* the side walls behind the top rows */
  for (const s of [-1, 1]) {
    quad(c, V, [[s * ARENA.springX, 0, ARENA.zNear], [s * ARENA.springX, ARENA.springY, ARENA.zNear], [s * ARENA.springX, ARENA.springY, ARENA.zFar], [s * ARENA.springX, 0, ARENA.zFar]], "rgb(30,33,38)");
  }
  /* the vault: recessed bays between the ribs, then the ribs standing proud */
  const inset = 0.7;
  for (let k = 0; k < ARENA.ribs - 1; k++) {
    const z0 = ribZ(k) + 0.85, z1 = ribZ(k + 1) - 0.85;
    for (let i = 0; i < SEG; i++) {
      const a0 = (Math.PI * i) / SEG, a1 = (Math.PI * (i + 1)) / SEG;
      const [x0, y0] = vaultPt(a0), [x1, y1] = vaultPt(a1);
      const l = light([(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], sweep);
      const up = Math.sin((a0 + a1) / 2);
      const k2 = 0.38 + 0.55 * l * (0.6 + 0.4 * up);
      quad(c, V, [[x0, y0, z0], [x1, y1, z0], [x1, y1, z1], [x0, y0, z1]], rgb(70, 76, 84, k2), rgb(70, 76, 84, k2 * 0.96), 0.6);
    }
    // the round vents on the bay, two per bay high on the curve
    for (const a of [Math.PI * 0.36, Math.PI * 0.64]) {
      const [x, y] = vaultPt(a);
      const p = V.P([x * 0.995, y - 0.05, (z0 + z1) / 2]);
      if (p.z > 1) { c.beginPath(); c.ellipse(p.x, p.y, p.s * 0.42, p.s * 0.3, 0, 0, Math.PI * 2); c.fillStyle = "rgba(10,12,15,0.85)"; c.fill(); }
    }
  }
  for (let k = 0; k < ARENA.ribs; k++) {
    const z = ribZ(k);
    for (let i = 0; i < SEG; i++) {
      const a0 = (Math.PI * i) / SEG, a1 = (Math.PI * (i + 1)) / SEG;
      const [x0, y0] = vaultPt(a0), [x1, y1] = vaultPt(a1);
      const sc = (x: number, y: number, d: number): [number, number] => {
        const cy = ARENA.springY;
        const rx = x * (1 - d / ARENA.springX), ry = cy + (y - cy) * (1 - d / (ARENA.crownY - cy));
        return [rx, ry];
      };
      const [ix0, iy0] = sc(x0, y0, inset), [ix1, iy1] = sc(x1, y1, inset);
      const l = light([(x0 + x1) / 2, (y0 + y1) / 2, z], sweep);
      // the face of the rib toward the camera, then its underside
      quad(c, V, [[x0, y0, z - 0.85], [x1, y1, z - 0.85], [ix1, iy1, z - 0.85], [ix0, iy0, z - 0.85]], rgb(78, 84, 92, 0.5 + 0.45 * l));
      quad(c, V, [[ix0, iy0, z - 0.85], [ix1, iy1, z - 0.85], [ix1, iy1, z + 0.85], [ix0, iy0, z + 0.85]], rgb(96, 102, 110, 0.55 + 0.55 * l), rgb(96, 102, 110, 0.5 + 0.5 * l), 0.6);
    }
  }
  /* the hanging reflector lamps on their rods */
  for (const l of LAMPS) {
    const top = V.P([l[0], vaultPt(Math.PI / 2 + Math.atan2(l[0], 30) * -0.4)[1] - 0.6, l[2]]), p = V.P(l);
    if (p.z < 1) continue;
    c.strokeStyle = "rgba(120,124,130,0.5)"; c.lineWidth = Math.max(0.8, p.s * 0.05);
    c.beginPath(); c.moveTo(top.x, top.y); c.lineTo(p.x, p.y); c.stroke();
    const r = p.s * 0.9;
    const g = c.createRadialGradient(p.x, p.y + r * 0.3, 0, p.x, p.y + r * 0.3, r * 4);
    g.addColorStop(0, "rgba(255,236,200,0.32)"); g.addColorStop(1, "rgba(255,236,200,0)");
    c.fillStyle = g; c.fillRect(p.x - r * 4, p.y - r * 4, r * 8, r * 8);
    c.beginPath(); c.ellipse(p.x, p.y, r, r * 0.42, 0, Math.PI, 0); c.fillStyle = "rgb(58,62,68)"; c.fill();
    c.beginPath(); c.ellipse(p.x, p.y, r, r * 0.3, 0, 0, Math.PI * 2); c.fillStyle = "rgb(255,244,222)"; c.fill();
  }

  /* the oval floor, the court laid on it, the light pools */
  const RZ = ARENA.rinkZ, RX = ARENA.rinkX, RR = ARENA.rinkR;
  const rinkPath = (yy: number): V3[] => {
    const out: V3[] = [];
    const corner = (cx: number, cz: number, a0: number) => { for (let i = 0; i <= 8; i++) { const a = a0 + (Math.PI / 2) * (i / 8); out.push([cx + RR * Math.cos(a), yy, cz + RR * Math.sin(a)]); } };
    corner(RX - RR, RZ - RR, 0); corner(-RX + RR, RZ - RR, Math.PI / 2); corner(-RX + RR, -RZ + RR, Math.PI); corner(RX - RR, -RZ + RR, Math.PI * 1.5);
    return out;
  };
  {
    // the concourse round the oval, from the door to the far end: worn concrete in big poured slabs, lit by the lamps
    for (let i = 0; i < 9; i++) for (let j = 0; j < 19; j++) {
      const x0 = -ARENA.springX + (2 * ARENA.springX * i) / 9, x1 = x0 + (2 * ARENA.springX) / 9;
      const z0 = ARENA.zNear + ((ARENA.zFar - ARENA.zNear) * j) / 19, z1 = z0 + (ARENA.zFar - ARENA.zNear) / 19;
      const l = light([(x0 + x1) / 2, 0, (z0 + z1) / 2], -999);
      quadClip(c, V, [[x0, -0.01, z0], [x1, -0.01, z0], [x1, -0.01, z1], [x0, -0.01, z1]], rgb(44, 45, 48, 0.5 + 0.35 * l + 0.04 * ((i + j) % 2)));
    }
    // the oval floor, concrete, lit by the lamps
    quad(c, V, rinkPath(0), "rgb(30,31,33)");
    const NX2 = 10, NZ2 = 24;
    for (let i = 0; i < NX2; i++) for (let j = 0; j < NZ2; j++) {
      const x0 = -RX + (2 * RX * i) / NX2, x1 = x0 + (2 * RX) / NX2, z0 = -RZ + (2 * RZ * j) / NZ2, z1 = z0 + (2 * RZ) / NZ2;
      const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
      const inC = Math.abs(cx) < ARENA.courtX && Math.abs(cz) < ARENA.courtZ;
      const ox = Math.max(0, Math.abs(cx) - (RX - RR)), oz = Math.max(0, Math.abs(cz) - (RZ - RR));
      if (inC || ox * ox + oz * oz > RR * RR) continue;
      const l = light([cx, 0, cz], -999);
      quad(c, V, [[x0, 0.005, z0], [x1, 0.005, z0], [x1, 0.005, z1], [x0, 0.005, z1]], rgb(62, 63, 66, 0.35 + 0.55 * l), rgb(62, 63, 66, 0.35 + 0.55 * l), 0.6);
    }
  }
  const CX = ARENA.courtX, CZ = ARENA.courtZ, NX = 8, NZ = 16;
  for (let i = 0; i < NX; i++) for (let j = 0; j < NZ; j++) {
    const x0 = -CX + (2 * CX * i) / NX, x1 = -CX + (2 * CX * (i + 1)) / NX, z0 = -CZ + (2 * CZ * j) / NZ, z1 = -CZ + (2 * CZ * (j + 1)) / NZ;
    const l = light([(x0 + x1) / 2, 0, (z0 + z1) / 2], -999);
    quad(c, V, [[x0, 0.01, z0], [x1, 0.01, z0], [x1, 0.01, z1], [x0, 0.01, z1]], rgb(146, 100, 60, 0.42 + 0.5 * l), rgb(146, 100, 60, 0.42 + 0.5 * l), 0.5);
  }
  // the boards of the floor, running the length
  c.strokeStyle = "rgba(60,38,20,0.35)";
  for (let i = 1; i < 34; i++) {
    const x = -CX + (2 * CX * i) / 34, a = V.P([x, 0.012, -CZ]), b = V.P([x, 0.012, CZ]);
    if (a.z > 0.4 && b.z > 0.4) { c.lineWidth = Math.max(0.4, Math.min(a.s, b.s) * 0.012); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
  }
  // the lines of 1962: boundary, centre line and circle, the 12 ft lanes to the 15 ft line and its circle
  const line = (pts: V3[], w = 0.05) => {
    const q = pts.map(V.P); if (q.some((p) => p.z < 0.4)) return;
    c.beginPath(); q.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
    c.strokeStyle = "rgba(236,232,222,0.78)"; c.lineWidth = Math.max(0.7, q[0].s * w); c.stroke();
  };
  const ring = (cx: number, cz: number, r: number, a0 = 0, a1 = Math.PI * 2) => Array.from({ length: 33 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / 32; return [cx + r * Math.cos(a), 0.015, cz + r * Math.sin(a)] as V3; });
  line([[-CX, 0.015, -CZ], [CX, 0.015, -CZ], [CX, 0.015, CZ], [-CX, 0.015, CZ], [-CX, 0.015, -CZ]]);
  line([[-CX, 0.015, 0], [CX, 0.015, 0]]);
  line(ring(0, 0, 1.83));
  for (const s of [-1, 1]) {
    const bz = s * CZ, fz = s * (CZ - 5.79);
    line([[-1.83, 0.015, bz], [-1.83, 0.015, fz], [1.83, 0.015, fz], [1.83, 0.015, bz]]);
    line(ring(0, fz, 1.83, s < 0 ? 0 : Math.PI, s < 0 ? Math.PI : Math.PI * 2));
  }
  /* the boards round the floor: low and pale, with the railing */
  const rk = rinkPath(0), rt = rinkPath(1.07);
  for (let i = 0; i < rk.length; i++) {
    const j = (i + 1) % rk.length;
    const l = light(rk[i], -999);
    quad(c, V, [rk[i], rk[j], rt[j], rt[i]], rgb(160, 160, 156, 0.18 + 0.12 * l));
  }

  /* the banks: concrete risers under the seats, cut by stair aisles */
  for (const s of [-1, 1]) {
    quad(c, V, [[s * 13.9, 0, -30.4], [s * 13.9, 0, 30.8], [s * 35.8, 15.5, 30.8], [s * 35.8, 15.5, -30.4]], "rgb(26,25,25)");
  }
  quad(c, V, [[-12.6, 0, 31.2], [12.6, 0, 31.2], [23.6, 12.4, 47.8], [-23.6, 12.4, 47.8]], "rgb(26,25,25)");
  // the corner walls between the banks
  for (const s of [-1, 1]) quad(c, V, [[s * 12.6, 0, 31.2], [s * 13.9, 0, 30.8], [s * 35.8, 15.5, 30.8], [s * 23.6, 12.4, 47.8]], "rgb(20,21,23)");

  /* the seats and who is in them */
  const shown = crowdHalfEmptyCount(f, T);
  const halfK = prog(f, T.half - 1, 7, ease.out);
  const halfFlash = 1 - prog(f, T.half + 6, 26, ease.out);
  const settle = prog(f, T.people, 50, ease.out);
  const drawn: { p: ReturnType<typeof V.P>; i: number }[] = [];
  for (let i = 0; i < SEATS.length; i++) {
    const q = SEATS[i];
    const p = V.P([q.x, q.y + 0.32, q.z]);
    if (p.z < 0.8 || p.x < -40 || p.x > W + 40 || p.y < -40 || p.y > H + 40) continue;
    drawn.push({ p, i });
  }
  drawn.sort((a, b) => b.p.z - a.p.z);
  for (const { p, i } of drawn) {
    const q = SEATS[i];
    const w = p.s * 0.46, h = p.s * 0.36;
    const l = light([q.x, q.y, q.z], sweep);
    const on = q.filled && q.order < shown;
    if (!on || w > 3) {
      // the wooden seat back
      c.fillStyle = rgb(120, 86, 56, 0.2 + 0.18 * l);
      c.fillRect(p.x - w / 2, p.y - h / 2, w, h);
    }
    if (!q.filled && halfK > 0) {
      c.strokeStyle = `rgba(${Math.round(118 + 110 * halfFlash)},${Math.round(126 + 110 * halfFlash)},${Math.round(136 + 110 * halfFlash)},${(0.85 * halfK).toFixed(3)})`;
      c.lineWidth = Math.max(0.9, p.s * 0.05);
      c.strokeRect(p.x - w / 2, p.y - h / 2, w, h);
    }
    if (on) {
      // one amber point per spectator: it pops as they sit, then settles in the seat
      const pop = 1 + 0.7 * clamp(1 - Math.max(0, f - (T.count - 1) - q.order * 0.017) / 9);
      const jig = settle > 0 && settle < 1 ? Math.sin(i * 1.7 + f * 0.45) * (1 - settle) * 0.08 : 0;
      const r = Math.max(1.05, Math.min(p.s * 0.13, 6.5)) * pop;
      const y = p.y - jig * p.s - p.s * 0.05;
      c.fillStyle = AMBER;
      c.globalAlpha = 0.2;
      c.beginPath(); c.arc(p.x, y, r * 2.2, 0, Math.PI * 2); c.fill();
      c.globalAlpha = 1;
      c.beginPath(); c.arc(p.x, y, r, 0, Math.PI * 2); c.fill();
      if (r > 3) { c.fillStyle = "rgba(255,240,200,0.65)"; c.beginPath(); c.arc(p.x - r * 0.3, y - r * 0.3, r * 0.33, 0, Math.PI * 2); c.fill(); }
    }
  }
  /* the baskets of 1962: a pole behind each baseline, an arm, a 6 x 4 ft board, the rim at 10 ft */
  for (const s of [-1, 1]) {
    const bz = s * (ARENA.courtZ - 1.22), pz = s * (ARENA.courtZ + 1.3);
    const pole = [V.P([0, 0, pz]), V.P([0, 3.75, pz]), V.P([0, 3.75, bz])];
    if (pole.some((p) => p.z < 0.6)) continue;
    c.strokeStyle = "rgba(150,154,160,0.9)"; c.lineCap = "round";
    c.lineWidth = Math.max(1, pole[0].s * 0.12); c.beginPath(); c.moveTo(pole[0].x, pole[0].y); c.lineTo(pole[1].x, pole[1].y); c.lineTo(pole[2].x, pole[2].y); c.stroke();
    quad(c, V, [[-0.915, 2.9, bz], [0.915, 2.9, bz], [0.915, 4.12, bz], [-0.915, 4.12, bz]], "rgba(225,228,232,0.85)", "rgba(40,44,50,0.9)", 1.2);
    const rim = Array.from({ length: 17 }, (_, i) => V.P([0.23 * Math.cos((i / 16) * Math.PI * 2), 3.05, bz - s * 0.38 + 0.23 * Math.sin((i / 16) * Math.PI * 2)]));
    c.strokeStyle = "rgba(214,98,40,0.95)"; c.lineWidth = Math.max(1, rim[0].s * 0.03);
    c.beginPath(); rim.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.stroke();
    const net = [V.P([0, 3.05, bz - s * 0.38]), V.P([0, 2.62, bz - s * 0.38])];
    c.strokeStyle = "rgba(236,236,232,0.55)"; c.lineWidth = Math.max(0.6, net[0].s * 0.18);
    c.beginPath(); c.moveTo(net[0].x, net[0].y); c.lineTo(net[1].x, net[1].y); c.stroke();
  }
}

export const CrowdHalfEmptyArena: React.FC<{ f: number; T: CrowdHalfEmptyT; V: CrowdHalfEmptyView }> = ({ f, T, V }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const c = ref.current?.getContext("2d");
    if (c) drawCrowdHalfEmptyArena(c, f, T, V);
  });
  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />;
};
