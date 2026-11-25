// wilt-100 "freethrows": the free throw end of Hershey Sports Arena on one canvas, from the camera, every frame.
// Drawn back to front: the vault's ribs and its hanging lamps, the end banks of seats (half of them holding an amber
// witness), the rink boards, the maple floor with its 1962 lines (12 ft lane, the keyhole with its dashed inner half,
// no three point arc), lamp pools and varnish glare, the stanchion, the glass board, the orange rim and the cotton
// net, and the brown leather balls with their seams, spinning backward off an underhand release.
import React, { useLayoutEffect, useRef } from "react";
import {
  FTT_AMBER,
  FTT_COURT as C,
  fttBall,
  fttCam,
  fttNetWhip,
  fttProject,
  fttRimShake,
  fttRnd,
  type FreeThrowT,
  type FttCam,
  type FttShot,
} from "./FreeThrowTallyKit";

const W = 1080;
const H = 1920;

type P3 = [number, number, number];

function pt(c: FttCam, p: P3) {
  return fttProject(c, p[0], p[1], p[2]);
}

function poly(ctx: CanvasRenderingContext2D, c: FttCam, pts: P3[], fill: string | CanvasGradient) {
  ctx.beginPath();
  pts.forEach((p, i) => {
    const q = pt(c, p);
    if (i === 0) ctx.moveTo(q.x, q.y);
    else ctx.lineTo(q.x, q.y);
  });
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

/** a painted or steel line of real width, segment by segment so the width follows depth */
function worldLine(ctx: CanvasRenderingContext2D, c: FttCam, pts: P3[], widthFt: number, color: string, minPx = 0.8) {
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pt(c, pts[i]);
    const b = pt(c, pts[i + 1]);
    if (a.d < 0.5 || b.d < 0.5) continue;
    ctx.lineWidth = Math.max(minPx, widthFt * (a.s + b.s) * 0.5);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}

function arc(cx: number, cz: number, r: number, a0: number, a1: number, n: number, y = 0.01): P3[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + r * Math.cos(a), y, cz + r * Math.sin(a)] as P3;
  });
}

/* ---------- the building ---------- */
const LAMPS: P3[] = [
  [-16, 44, 12],
  [16, 44, 12],
  [0, 46, -6],
  [-24, 44, -20],
  [24, 44, -20],
  [0, 44, 30],
];

function drawBuilding(ctx: CanvasRenderingContext2D, c: FttCam, f: number, T: FreeThrowT) {
  ctx.fillStyle = "#0B0E13";
  ctx.fillRect(0, 0, W, H);
  // the vault: ribs crossing over, concrete catching a little lamp light
  for (let k = 0; k < 7; k++) {
    const z = 40 - k * 16;
    const pts: P3[] = Array.from({ length: 41 }, (_, i) => {
      const a = Math.PI * (i / 40);
      return [-78 * Math.cos(a), 6 + 82 * Math.sin(a), z] as P3;
    });
    worldLine(ctx, c, pts, 2.6, `rgba(120,128,138,${(0.07 + 0.02 * (k % 2)).toFixed(3)})`, 1);
  }
  // the far end wall under the vault
  poly(ctx, c, [[-80, 0, -58], [80, 0, -58], [80, 70, -58], [-80, 70, -58]], "#0E1218");
  // the end banks of seats, rising behind the rink boards; about half of the seats hold a witness
  const rows = 22;
  for (let r = 0; r < rows; r++) {
    const z0 = -8 - r * 2.2, y0 = 4 + r * 1.45;
    const shade = 18 + Math.round(r * 0.6);
    poly(ctx, c, [[-70, y0, z0], [70, y0, z0], [70, y0 + 1.45, z0 - 2.2], [-70, y0 + 1.45, z0 - 2.2]], `rgb(${shade},${shade + 3},${shade + 8})`);
    worldLine(ctx, c, [[-70, y0 + 0.02, z0], [70, y0 + 0.02, z0]], 0.08, "rgba(150,160,175,0.10)");
  }
  // aisles cut down the banks
  for (const ax of [-30, -10, 10, 30]) {
    poly(ctx, c, [[ax - 1.2, 4, -8], [ax + 1.2, 4, -8], [ax + 1.2, 4 + rows * 1.45, -8 - rows * 2.2], [ax - 1.2, 4 + rows * 1.45, -8 - rows * 2.2]], "rgba(5,7,10,0.65)");
  }
  // the witnesses: one amber point per spectator, in clumps, the rest of the seats empty
  const breathe = 0.85 + 0.15 * Math.sin(f / 9);
  for (let r = 0; r < rows; r++) {
    const z = -9.1 - r * 2.2, y = 4.9 + r * 1.45;
    for (let s = 0; s < 76; s++) {
      const x = -64 + s * 1.7 + (r % 2) * 0.85;
      if (Math.abs(x - -30) < 1.5 || Math.abs(x + 10) < 1.5 || Math.abs(x - 10) < 1.5 || Math.abs(x - 30) < 1.5) continue;
      const clump = Math.sin(x * 0.11 + r * 0.7) + Math.sin(x * 0.043 - r * 0.31) * 0.8;
      if (clump + (fttRnd(r * 97 + s) - 0.5) * 1.1 < 0.15) continue;
      const q = pt(c, [x, y, z]);
      if (q.d < 1 || q.x < -10 || q.x > W + 10 || q.y < -10 || q.y > H + 10) continue;
      const rad = Math.max(0.8, Math.min(7, 0.2 * q.s));
      const tw = 0.7 + 0.3 * Math.sin(f / 6 + s * 1.7 + r);
      ctx.globalAlpha = 0.75 * tw * breathe;
      ctx.fillStyle = FTT_AMBER;
      ctx.beginPath();
      ctx.arc(q.x, q.y, rad, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  // the lamps hung from the ribs: hot cores, soft cones of haze down to the floor
  for (const L of LAMPS) {
    const q = pt(c, L);
    if (q.d < 1) continue;
    const r = Math.max(3, 2.2 * q.s);
    const g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, r * 9);
    g.addColorStop(0, "rgba(255,236,200,0.55)");
    g.addColorStop(0.2, "rgba(255,220,170,0.12)");
    g.addColorStop(1, "rgba(255,220,170,0)");
    ctx.fillStyle = g;
    ctx.fillRect(q.x - r * 9, q.y - r * 9, r * 18, r * 18);
    ctx.fillStyle = "#FFF4DE";
    ctx.beginPath();
    ctx.ellipse(q.x, q.y, r, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    // the shade above the bulb
    ctx.fillStyle = "#1C2027";
    ctx.beginPath();
    ctx.ellipse(q.x, q.y - r * 0.3, r * 1.15, r * 0.5, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    // the chain up into the dark
    const top = pt(c, [L[0], L[1] + 14, L[2]]);
    ctx.strokeStyle = "rgba(90,96,105,0.35)";
    ctx.lineWidth = Math.max(0.8, 0.06 * q.s);
    ctx.beginPath();
    ctx.moveTo(q.x, q.y - r * 0.6);
    ctx.lineTo(top.x, top.y);
    ctx.stroke();
  }
  // the rink boards round the floor: white boards, a dark kick strip, a rail on top
  poly(ctx, c, [[-40, 0, -6], [40, 0, -6], [40, 3.6, -6], [-40, 3.6, -6]], "#7E7A71");
  poly(ctx, c, [[-40, 0, -5.98], [40, 0, -5.98], [40, 0.7, -5.98], [-40, 0.7, -5.98]], "#3B3A37");
  worldLine(ctx, c, [[-40, 3.65, -6], [40, 3.65, -6]], 0.22, "#6E6A62");
  for (let k = -9; k <= 9; k++) worldLine(ctx, c, [[k * 4.4, 0.7, -5.97], [k * 4.4, 3.6, -5.97]], 0.04, "rgba(60,58,54,0.35)");
  void T;
}

/* ---------- the floor ---------- */
const BOARD = 0.1875; // 2 1/4 in maple strips

function drawFloor(ctx: CanvasRenderingContext2D, c: FttCam) {
  const zFar = -6;
  // the nearest floor still in front of the lens (depth >= 1.5 ft), so no strip folds back behind the camera
  const sp = Math.sin(c.phi), cp = Math.cos(c.phi);
  const camZ = c.tz + c.D * cp, camY = c.ty + c.D * sp;
  // straight down (the handover from `fouls`) the floor runs on past midcourt to 60 ft
  const zNear = cp > 0.05 ? Math.min(60, camZ - (1.5 - camY * sp) / cp) : 60;
  // the dark apron and margin of the rink round the court
  poly(ctx, c, [[-40, 0, zFar], [40, 0, zFar], [40, 0, zNear], [-40, 0, zNear]], "#1A1610");
  // the maple: strip by strip, each its own tone, darker far from the lamps
  // the maple runs past the sidelines to the edge of the apron, as `fouls` draws the same floor (apronX 29.5)
  const AX = 29.5;
  const n = Math.round((2 * AX) / BOARD);
  for (let i = 0; i < n; i++) {
    const x0 = -AX + i * BOARD;
    const r = fttRnd(i * 3.1);
    const tone = 0.86 + r * 0.2;
    const col = `rgb(${Math.round(156 * tone)},${Math.round(108 * tone)},${Math.round(64 * tone)})`;
    poly(ctx, c, [[x0, 0, -5], [x0 + BOARD, 0, -5], [x0 + BOARD, 0, zNear], [x0, 0, zNear]], col); // from the apron behind the baseline, as `fouls`
  }
  // seams between strips (only where they read) and staggered butt joints
  for (let i = 0; i <= n; i += 1) {
    const x = -C.halfW + i * BOARD;
    const a = pt(c, [x, 0, 1]);
    const b = pt(c, [x + BOARD, 0, 1]);
    if (Math.abs(b.x - a.x) < 3) {
      if (i % 4) continue;
    }
    worldLine(ctx, c, [[x, 0.002, 0], [x, 0.002, zNear]], 0.012, "rgba(40,24,10,0.35)", 0.5);
    for (let k = 0; k < 9; k++) {
      const z = (fttRnd(i * 7 + k) + k) * 6.5;
      if (z > zNear) continue;
      worldLine(ctx, c, [[x, 0.002, z], [x + BOARD, 0.002, z]], 0.02, "rgba(40,24,10,0.40)", 0.5);
    }
  }
  // the 1962 lines: baseline, sidelines, the 12 ft lane, the line, the keyhole (inner half dashed)
  const LINE = 0.17, WHITE = "rgba(236,230,214,0.92)";
  worldLine(ctx, c, [[-C.halfW, 0.004, 0], [C.halfW, 0.004, 0]], LINE, WHITE);
  worldLine(ctx, c, [[-C.halfW, 0.004, 0], [-C.halfW, 0.004, zNear]], LINE, WHITE);
  worldLine(ctx, c, [[C.halfW, 0.004, 0], [C.halfW, 0.004, zNear]], LINE, WHITE);
  for (const sx of [-1, 1]) {
    worldLine(ctx, c, [[sx * C.laneHalf, 0.004, 0], [sx * C.laneHalf, 0.004, C.ftZ]], LINE, WHITE);
    // lane spaces
    for (const z of [7, 8, 11, 14]) worldLine(ctx, c, [[sx * C.laneHalf, 0.004, z], [sx * (C.laneHalf + 0.7), 0.004, z]], LINE, WHITE);
  }
  worldLine(ctx, c, [[-C.laneHalf, 0.004, C.ftZ], [C.laneHalf, 0.004, C.ftZ]], LINE, WHITE);
  // midcourt and its circles, in view while the camera is still straight down
  if (zNear > 47) {
    worldLine(ctx, c, [[-C.halfW, 0.004, 47], [C.halfW, 0.004, 47]], LINE, WHITE);
    worldLine(ctx, c, arc(0, 47, 6, 0, Math.PI * 2, 48, 0.004), LINE, WHITE);
    worldLine(ctx, c, arc(0, 47, 2, 0, Math.PI * 2, 24, 0.004), LINE, WHITE);
  }
  worldLine(ctx, c, arc(0, C.ftZ, C.ftR, 0, Math.PI, 40, 0.004), LINE, WHITE);
  for (let k = 0; k < 10; k++) {
    const a0 = Math.PI + (k * Math.PI) / 10;
    worldLine(ctx, c, arc(0, C.ftZ, C.ftR, a0, a0 + Math.PI / 20, 4, 0.004), LINE, WHITE);
  }
  // pools of lamp light and the varnish glare that follows the camera
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const L of LAMPS) {
    const q = pt(c, [L[0], 0, L[2]]);
    if (q.d < 1) continue;
    const rx = 26 * q.s, ry = Math.max(6, rx * Math.abs(Math.sin(Math.max(0.12, c.phi + 0.2))));
    const g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, rx);
    g.addColorStop(0, "rgba(120,82,40,0.40)");
    g.addColorStop(1, "rgba(120,82,40,0)");
    ctx.fillStyle = g;
    ctx.save();
    ctx.translate(q.x, q.y);
    ctx.scale(1, ry / rx);
    ctx.translate(-q.x, -q.y);
    ctx.fillRect(q.x - rx, q.y - rx, rx * 2, rx * 2);
    ctx.restore();
  }
  // glare: the lamp behind the basket mirrored in the varnish
  const gl = pt(c, [0, 0, 2]);
  if (gl.d > 1) {
    const g2 = ctx.createRadialGradient(gl.x, gl.y, 0, gl.x, gl.y, 220);
    g2.addColorStop(0, "rgba(255,230,190,0.16)");
    g2.addColorStop(1, "rgba(255,230,190,0)");
    ctx.save();
    ctx.translate(gl.x, gl.y);
    ctx.scale(0.55, 1.4);
    ctx.translate(-gl.x, -gl.y);
    ctx.fillStyle = g2;
    ctx.fillRect(gl.x - 220, gl.y - 220, 440, 440);
    ctx.restore();
  }
  ctx.restore();
}

/* ---------- the basket ---------- */
const BOARD_Y0 = 9.5, BOARD_Y1 = 13.5, BOARD_HALF = 3;

function drawStanchionAndBoard(ctx: CanvasRenderingContext2D, c: FttCam) {
  const STEEL = "#3A3F47";
  // the post behind the baseline, padded at its foot, and the braces out to the board
  // the padded foot of the post: dark canvas padding, a lighter top seam
  poly(ctx, c, [[-1.1, 0, -3.0], [1.1, 0, -3.0], [0.9, 2.6, -3.0], [-0.9, 2.6, -3.0]], "#1C2129");
  worldLine(ctx, c, [[-0.9, 2.6, -2.99], [0.9, 2.6, -2.99]], 0.08, "rgba(150,160,175,0.35)");
  worldLine(ctx, c, [[-1.0, 1.3, -2.99], [1.0, 1.3, -2.99]], 0.03, "rgba(150,160,175,0.18)");
  worldLine(ctx, c, [[0, 3, -3.6], [0, 14.5, -3.6]], 0.42, STEEL);
  worldLine(ctx, c, [[0, 14.2, -3.6], [-2.4, 13.3, 3.85]], 0.18, STEEL);
  worldLine(ctx, c, [[0, 14.2, -3.6], [2.4, 13.3, 3.85]], 0.18, STEEL);
  worldLine(ctx, c, [[0, 7.5, -3.6], [0, 9.8, 3.85]], 0.2, STEEL);
  // the glass: a faint body, a reflection streak, the steel frame
  const z = C.boardZ;
  poly(ctx, c, [[-BOARD_HALF, BOARD_Y0, z], [BOARD_HALF, BOARD_Y0, z], [BOARD_HALF, BOARD_Y1, z], [-BOARD_HALF, BOARD_Y1, z]], "rgba(170,190,205,0.10)");
  poly(ctx, c, [[-2.2, BOARD_Y1 - 0.2, z], [-1.3, BOARD_Y1 - 0.2, z], [0.4, BOARD_Y0 + 0.2, z], [-0.5, BOARD_Y0 + 0.2, z]], "rgba(230,240,248,0.07)");
  poly(ctx, c, [[1.0, BOARD_Y1 - 0.2, z], [1.3, BOARD_Y1 - 0.2, z], [2.4, BOARD_Y0 + 0.9, z], [2.1, BOARD_Y0 + 0.9, z]], "rgba(230,240,248,0.06)");
  const fr: P3[] = [[-BOARD_HALF, BOARD_Y0, z], [BOARD_HALF, BOARD_Y0, z], [BOARD_HALF, BOARD_Y1, z], [-BOARD_HALF, BOARD_Y1, z], [-BOARD_HALF, BOARD_Y0, z]];
  worldLine(ctx, c, fr, 0.12, "#5E646C");
  worldLine(ctx, c, fr.map((p) => [p[0], p[1], p[2] + 0.01] as P3), 0.035, "rgba(220,228,235,0.45)");
  // the rim's mounting plate and bracket
  poly(ctx, c, [[-0.45, 9.6, z + 0.01], [0.45, 9.6, z + 0.01], [0.45, 10.25, z + 0.01], [-0.45, 10.25, z + 0.01]], "#5A3A22");
  worldLine(ctx, c, [[0, C.rimY - 0.05, z], [0, C.rimY - 0.05, C.rimZ - C.rimR]], 0.12, "#B9481E");
}

const NET_LEVELS = [
  { y: 0, r: 1 },
  { y: -0.5, r: 0.88 },
  { y: -1.0, r: 0.74 },
  { y: -1.5, r: 0.62 },
];
const LOOPS = 12;

function netPoint(level: number, j: number, whip: number, shake: number): P3 {
  const L = NET_LEVELS[level];
  const a = ((j + level * 0.5) / LOOPS) * Math.PI * 2;
  // a whip lifts and flares the lower net, deeper levels more
  const lift = whip * 0.35 * level;
  const flare = 1 + whip * 0.12 * level;
  return [
    C.rimR * L.r * flare * Math.cos(a),
    C.rimY + L.y + lift + shake * (1 - level / 3),
    C.rimZ + C.rimR * L.r * flare * Math.sin(a),
  ];
}

/** front = the half of the net and rim on the camera's side (larger z) */
function drawNetAndRim(ctx: CanvasRenderingContext2D, c: FttCam, whip: number, shake: number, front: boolean) {
  const keep = (p: P3, q: P3) => (p[2] + q[2]) / 2 > C.rimZ === front;
  const NET = front ? "rgba(245,242,232,0.92)" : "rgba(200,196,186,0.55)";
  for (let l = 0; l < NET_LEVELS.length - 1; l++) {
    for (let j = 0; j < LOOPS; j++) {
      const a = netPoint(l, j, whip, shake);
      const b1 = netPoint(l + 1, j, whip, shake);
      const b2 = netPoint(l + 1, j - 1, whip, shake);
      if (keep(a, b1)) worldLine(ctx, c, [a, b1], 0.045, NET);
      if (keep(a, b2)) worldLine(ctx, c, [a, b2], 0.045, NET);
    }
  }
  // the rim: painted orange steel, a highlight along its top
  const ring = arc(0, C.rimZ, C.rimR, 0, Math.PI * 2, 48, C.rimY + shake).filter((p) => (p[2] > C.rimZ) === front || Math.abs(p[2] - C.rimZ) < 0.02);
  const segs: P3[][] = [];
  let cur: P3[] = [];
  arc(0, C.rimZ, C.rimR, 0, Math.PI * 2, 48, C.rimY + shake).forEach((p) => {
    if ((p[2] >= C.rimZ) === front) cur.push(p);
    else if (cur.length) {
      segs.push(cur);
      cur = [];
    }
  });
  if (cur.length) segs.push(cur);
  void ring;
  for (const s of segs) {
    worldLine(ctx, c, s, 0.07, front ? "#D0561F" : "#8E3A16", 1.5);
    if (front) worldLine(ctx, c, s.map((p) => [p[0], p[1] + 0.03, p[2]] as P3), 0.02, "rgba(255,190,140,0.65)", 0.6);
  }
  // the net hooks under the rim
  if (front) {
    for (let j = 0; j < LOOPS; j++) {
      const p = netPoint(0, j, whip, shake);
      if (p[2] < C.rimZ) continue;
      const q = pt(c, [p[0], p[1] - 0.06, p[2]]);
      ctx.fillStyle = "#9C4219";
      ctx.beginPath();
      ctx.arc(q.x, q.y, Math.max(1, 0.04 * q.s), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/* ---------- the ball ---------- */
function drawBall(ctx: CanvasRenderingContext2D, c: FttCam, x: number, y: number, z: number, spin: number, alpha: number, prev: P3 | null) {
  const q = pt(c, [x, y, z]);
  if (q.d < 1.2) return;
  const r = C.ballR * q.s;
  if (r < 0.8) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  // a short smear behind a fast ball
  if (prev) {
    const p = pt(c, prev);
    const len = Math.hypot(q.x - p.x, q.y - p.y);
    if (len > r * 0.6) {
      const g = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
      g.addColorStop(0, "rgba(140,74,34,0)");
      g.addColorStop(1, "rgba(140,74,34,0.35)");
      ctx.strokeStyle = g;
      ctx.lineWidth = r * 1.6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }
  }
  // soft shadow side and the leather
  const g = ctx.createRadialGradient(q.x - r * 0.35, q.y - r * 0.4, r * 0.1, q.x, q.y, r);
  g.addColorStop(0, "#C98448");
  g.addColorStop(0.55, "#9A5526");
  g.addColorStop(1, "#44210C");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(q.x, q.y, r, 0, Math.PI * 2);
  ctx.fill();
  // pebble grain
  if (r > 10) {
    ctx.fillStyle = "rgba(30,14,4,0.18)";
    for (let k = 0; k < 40; k++) {
      const a = fttRnd(k * 3.7) * Math.PI * 2, d = Math.sqrt(fttRnd(k * 9.1)) * r * 0.92;
      ctx.fillRect(q.x + Math.cos(a) * d, q.y + Math.sin(a) * d, Math.max(1, r * 0.03), Math.max(1, r * 0.03));
    }
  }
  // the seams of an eight panel ball, turning backward with the spin
  ctx.save();
  ctx.beginPath();
  ctx.arc(q.x, q.y, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = "rgba(34,16,6,0.75)";
  ctx.lineWidth = Math.max(1, r * 0.045);
  ctx.lineCap = "round";
  // eight panels: one seam round the ball turning with the backspin, and two curved seams that cross it
  const s = spin;
  const tilt = 0.5;
  ctx.translate(q.x, q.y);
  ctx.rotate(tilt);
  const ry = r * Math.cos(s);
  ctx.beginPath();
  ctx.ellipse(0, 0, r, Math.abs(ry), 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(0, r);
  ctx.stroke();
  for (const k of [-1, 1]) {
    const off = k * r * 0.55 * Math.sin(s);
    ctx.beginPath();
    ctx.moveTo(-r, off * 0.2);
    ctx.bezierCurveTo(-r * 0.4, off - k * r * 0.5, r * 0.4, off - k * r * 0.5, r, off * 0.2);
    ctx.stroke();
  }
  ctx.restore();
  // a matte highlight
  const h = ctx.createRadialGradient(q.x - r * 0.4, q.y - r * 0.45, 0, q.x - r * 0.4, q.y - r * 0.45, r * 0.7);
  h.addColorStop(0, "rgba(255,226,190,0.30)");
  h.addColorStop(1, "rgba(255,226,190,0)");
  ctx.fillStyle = h;
  ctx.beginPath();
  ctx.arc(q.x, q.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawShadow(ctx: CanvasRenderingContext2D, c: FttCam, x: number, y: number, z: number) {
  const q = pt(c, [x, 0.01, z]);
  if (q.d < 1) return;
  const r = C.ballR * q.s * (1.2 + y * 0.05);
  ctx.save();
  ctx.globalAlpha = Math.max(0, 0.45 - y * 0.03);
  ctx.fillStyle = "#1A0E06";
  ctx.beginPath();
  ctx.ellipse(q.x, q.y, r, r * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export const FreeThrowTallyCourt: React.FC<{ f: number; T: FreeThrowT; shots: FttShot[] }> = ({ f, T, shots }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const c = fttCam(f, T);
    drawBuilding(ctx, c, f, T);
    drawFloor(ctx, c);
    drawStanchionAndBoard(ctx, c);
    const whip = fttNetWhip(f, shots);
    const shake = fttRimShake(f, shots);
    const balls = shots
      .map((s) => ({ s, b: fttBall(f, s), p: fttBall(f - 1, s) }))
      .filter((o) => o.b) as { s: FttShot; b: NonNullable<ReturnType<typeof fttBall>>; p: ReturnType<typeof fttBall> }[];
    for (const o of balls) drawShadow(ctx, c, o.b.x, o.b.y, o.b.z);
    drawNetAndRim(ctx, c, whip, shake, false);
    // balls dropping through sit inside the net
    for (const o of balls.filter((o) => o.b.through)) drawBall(ctx, c, o.b.x, o.b.y, o.b.z, o.b.spin, o.b.alpha, null);
    drawNetAndRim(ctx, c, whip, shake, true);
    // balls in the air, far ones first
    balls
      .filter((o) => !o.b.through)
      .sort((a, b) => a.b.z - b.b.z)
      .forEach((o) => drawBall(ctx, c, o.b.x, o.b.y, o.b.z, o.b.spin, o.b.alpha, o.p ? [o.p.x, o.p.y, o.p.z] : null));
    // the dark of the building closing in round the edges
    const v = ctx.createRadialGradient(540, 900, 300, 540, 900, 1250);
    v.addColorStop(0, "rgba(11,14,19,0)");
    v.addColorStop(1, "rgba(11,14,19,0.75)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  }, [f, T, shots]);
  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />;
};
