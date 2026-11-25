// wilt-100 "flood": the arena on one canvas, from the camera, every frame. The same building as `crowd` and `quarters`
// (barrel vault, ribs, bays, vents, reflector lamps, the board-formed end wall, the banks cut by stair aisles, the
// 1962 court inside the rink boards), the same 4,124 amber witnesses in the same seats. On "fans" each one stands up
// into a person; on "poured" each one runs its own way: along the row to the nearest stair aisle, down it, across the
// walkway, over the boards and out onto the floor round the ten players and two referees, then mills and jumps there.
import React, { useLayoutEffect, useRef } from "react";
import { Easing } from "remotion";
import { ease, prog } from "../../../src/engine";
import {
  FF_AMBER, FF_ARENA, FF_BOARD, FF_PLAYERS, FF_RUNNERS, FF_SEATS, type FfPlayer, type FfView, type FloodT, type V3,
  ffClamp, ffLerp, ffRibZ, ffRnd, ffRunnerAt, ffVaultPt,
} from "./FansFloodFloorKit";

const W = 1080, H = 1920;
const LAMPS: V3[] = [];
for (let k = 0; k < FF_ARENA.ribs - 1; k++) {
  const z = (ffRibZ(k) + ffRibZ(k + 1)) / 2;
  if (z > -36) for (const x of [-6.5, 6.5]) LAMPS.push([x, 24.5 + Math.abs(x) * -0.25, z]);
}
function light(p: V3, board: number) {
  let v = 0;
  for (const l of LAMPS) {
    const dx = p[0] - l[0], dz = p[2] - l[2], dy = l[1] - p[1];
    v += 1 / (1 + (dx * dx + dz * dz) / (40 + dy * 2.2));
  }
  // the lit board throws a little warm light on the end wall and the top of the end bank
  const bx = p[0] - FF_BOARD.x, by = p[1] - FF_BOARD.y, bz = p[2] - FF_BOARD.z;
  const b = board * 0.55 / (1 + (bx * bx + by * by * 1.4 + bz * bz * 3) / 30);
  return v / 4.2 + b;
}
const rgb = (r: number, g: number, b: number, k: number, a = 1) =>
  `rgba(${Math.round(ffClamp(r * k, 0, 255))},${Math.round(ffClamp(g * k, 0, 255))},${Math.round(ffClamp(b * k, 0, 255))},${a})`;
const warm = (r: number, g: number, b: number, k: number, w: number) =>
  `rgb(${Math.round(ffClamp(r * k + 60 * w, 0, 255))},${Math.round(ffClamp(g * k + 40 * w, 0, 255))},${Math.round(ffClamp(b * k + 12 * w, 0, 255))})`;

type Ctx = CanvasRenderingContext2D;
function poly(c: Ctx, V: FfView, pts: V3[], fill: string, stroke?: string, lw = 1) {
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

const RUN = Easing.bezier(0.42, 0, 0.3, 1);
type FfState = { jumpAt: number; x: number; y: number; z: number; lift: number; dx: number; dz: number; st: number; run: number; dist: number; arrived: number };
type FfSeatLike = { x: number; y: number; z: number };

/** one witness. Seated: the amber point of `crowd`. On "fans" it grows up out of the seat into a person (legs, body,
 *  arms, head), all amber: the witness colour. Running: legs and arms swing with the distance covered; over the
 *  boards: lifted; on the floor: some jump with both arms up. */
function drawFfWitness(c: Ctx, V: FfView, seed: number, q: FfSeatLike, s: FfState, f: number, l: number, ga: number) {
  if (s.st <= 0) {
    const tj = f - s.jumpAt;
    const jump = tj > 0 && tj < 16 ? 0.32 * Math.sin((tj / 16) * Math.PI) : 0;
    const p = V.P([q.x, q.y + 0.32 + jump, q.z]);
    const r = Math.max(1.05, Math.min(p.s * 0.13, 6.5));
    c.fillStyle = FF_AMBER;
    c.globalAlpha = 0.2 * ga;
    c.beginPath(); c.arc(p.x, p.y, r * 2.2, 0, Math.PI * 2); c.fill();
    c.globalAlpha = ga;
    c.beginPath(); c.arc(p.x, p.y, r, 0, Math.PI * 2); c.fill();
    if (r > 3) { c.fillStyle = "rgba(255,240,200,0.65)"; c.beginPath(); c.arc(p.x - r * 0.3, p.y - r * 0.3, r * 0.33, 0, Math.PI * 2); c.fill(); }
    c.globalAlpha = 1;
    return;
  }
  const h = 1.5 + 0.3 * ffRnd(seed * 0.91); // their own height, head top
  const hh = ffLerp(0.82, h * 0.93, s.st); // feet to the centre of the head: a seated dot grows into a standing person
  const fy = s.y + s.lift;
  const at = (dy: number, ox = 0, oz = 0) => V.P([s.x + ox, fy + dy, s.z + oz]);
  const F0 = at(0), Hd = at(hh);
  const px = F0.s;
  const kk = 0.78 + 0.4 * l;
  const tone = 0.82 + 0.3 * ffRnd(seed * 5.9); // shirts and coats of every shade, all in the witness colour
  const body = rgb(226, 160, 52, kk * tone), dark = rgb(150, 98, 28, kk * tone), headC = rgb(255, 214, 128, kk), edge = "rgba(22,14,6,0.55)";
  c.globalAlpha = ga;
  if (px * hh < 9) {
    // far: a stroke and a head
    c.strokeStyle = edge; c.lineWidth = Math.max(1.1, px * 0.34) + 1.4;
    c.beginPath(); c.moveTo(F0.x, F0.y); c.lineTo(Hd.x, Hd.y); c.stroke();
    c.strokeStyle = body; c.lineWidth = Math.max(1.1, px * 0.34);
    c.beginPath(); c.moveTo(F0.x, F0.y); c.lineTo(Hd.x, Hd.y); c.stroke();
    c.fillStyle = headC;
    c.beginPath(); c.arc(Hd.x, Hd.y, Math.max(1.1, px * 0.13), 0, Math.PI * 2); c.fill();
    c.globalAlpha = 1;
    return;
  }
  // a soft amber glow round each: a witness
  if (px * hh < 70) {
    c.globalAlpha = 0.07 * ga;
    c.fillStyle = FF_AMBER;
    c.beginPath(); c.arc(Hd.x, (Hd.y + F0.y) / 2, Math.max(3, px * hh * 0.4), 0, Math.PI * 2); c.fill();
  }
  c.globalAlpha = ga;
  // shadow on the floor once they are down there
  if (s.y < 0.1 && px > 6) {
    const sh = V.P([s.x, 0.01, s.z]);
    c.fillStyle = "rgba(0,0,0,0.28)";
    c.beginPath(); c.ellipse(sh.x, sh.y, px * 0.3, px * 0.12, 0, 0, Math.PI * 2); c.fill();
  }
  const sw = Math.sin(s.dist * 2.4 + seed) * s.run;
  const legs = ffClamp(s.st * 1.6 - 0.4);
  const hip = at(hh * 0.52), sho = at(hh * 0.82);
  // legs, striding along the way they run
  if (legs > 0) {
    const a = 0.32 * sw;
    const f1 = at(0, s.dx * a, s.dz * a), f2 = at(0, -s.dx * a, -s.dz * a);
    c.strokeStyle = dark; c.lineWidth = Math.max(1, px * 0.13);
    c.globalAlpha = ga * legs;
    c.beginPath(); c.moveTo(f1.x, f1.y); c.lineTo(hip.x, hip.y); c.lineTo(f2.x, f2.y); c.stroke();
    c.globalAlpha = ga;
  }
  // arms: swinging while running, both up when jumping on the floor, a few up already when they stand
  const up = s.arrived > 0 ? (ffRnd(seed * 3.3) < 0.5 ? s.arrived : 0) : s.run > 0 ? 0 : ffRnd(seed * 7.7) < 0.3 ? s.st : 0;
  c.strokeStyle = body; c.lineWidth = Math.max(1, px * 0.095);
  for (const side of [-1, 1]) {
    const swing = -side * sw * 0.3;
    const down: V3 = [side * 0.24 + s.dx * swing, -0.5, s.dz * swing];
    const raised: V3 = [side * 0.3, 0.62, 0];
    const hd = at(hh * 0.82 + ffLerp(down[1], raised[1], up), ffLerp(down[0], raised[0], up), ffLerp(down[2], raised[2], up));
    c.beginPath(); c.moveTo(sho.x, sho.y); c.lineTo(hd.x, hd.y); c.stroke();
  }
  // the body, with a dark edge so every person reads apart from the one behind
  c.strokeStyle = edge; c.lineWidth = Math.max(1.2, px * 0.36) + Math.max(1.4, px * 0.05);
  c.beginPath(); c.moveTo(hip.x, hip.y); c.lineTo(sho.x, sho.y); c.stroke();
  c.strokeStyle = body; c.lineWidth = Math.max(1.2, px * 0.36);
  c.beginPath(); c.moveTo(hip.x, hip.y); c.lineTo(sho.x, sho.y); c.stroke();
  // the head, lit from the lamps above
  const hr = Math.max(1.2, px * 0.12);
  c.fillStyle = edge;
  c.beginPath(); c.arc(Hd.x, Hd.y, hr + Math.max(0.7, px * 0.02), 0, Math.PI * 2); c.fill();
  c.fillStyle = headC;
  c.beginPath(); c.arc(Hd.x, Hd.y, hr, 0, Math.PI * 2); c.fill();
  if (hr > 3) { c.fillStyle = "rgba(255,244,214,0.7)"; c.beginPath(); c.arc(Hd.x - hr * 0.25, Hd.y - hr * 0.35, hr * 0.38, 0, Math.PI * 2); c.fill(); }
  // close enough to see: hair, or the felt hat half the men wore to a game in 1962, in the same warm tones
  if (hr > 2.6) {
    const look = ffRnd(seed * 8.1);
    if (look < 0.24) {
      c.fillStyle = "rgb(88,56,18)";
      c.beginPath(); c.ellipse(Hd.x, Hd.y - hr * 0.45, hr * 1.55, hr * 0.38, 0, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.ellipse(Hd.x, Hd.y - hr * 0.75, hr * 0.9, hr * 0.62, 0, Math.PI, 0); c.fill();
      c.fillRect(Hd.x - hr * 0.9, Hd.y - hr * 0.78, hr * 1.8, hr * 0.32);
      c.fillStyle = "rgb(150,98,30)"; c.fillRect(Hd.x - hr * 0.9, Hd.y - hr * 0.62, hr * 1.8, hr * 0.16);
    } else if (look < 0.82) {
      c.fillStyle = look < 0.5 ? "rgb(74,46,14)" : "rgb(120,78,24)";
      c.beginPath(); c.arc(Hd.x, Hd.y - hr * 0.12, hr * 1.02, Math.PI * 1.02, Math.PI * 1.98); c.fill();
    }
  }
  c.globalAlpha = 1;
}

const FF_SKIN = ["#4E3222", "#5C3B27", "#6A452D", "#C99A7A", "#D2A584", "#CFA07E", "#5A3A27", "#4B3021", "#D7AB89", "#553626", "#D1A381", "#C89878"];

/** a player or referee standing in the crowd: white PHILA jersey and shorts with dark piping, the Knicks in their dark
 *  blue with orange trim, the officials in stripes; skin, a head of short dark hair, a shadow under the lamps */
function drawFfPlayer(c: Ctx, V: FfView, p: FfPlayer, f: number, T: FloodT, ga: number) {
  const i = FF_PLAYERS.indexOf(p);
  const sway = 0.05 * Math.sin(f * 0.05 + i * 1.7);
  const x = p.x + sway, z = p.z;
  const at = (dy: number, ox = 0, oz = 0) => V.P([x + ox, dy, z + oz]);
  const F0 = at(0), px = F0.s;
  const h = p.h;
  const skin = FF_SKIN[i % FF_SKIN.length];
  const jersey = p.team === "PHW" ? "#F3F1EA" : p.team === "NYK" ? "#22366B" : "#E8E7E2";
  const trim = p.team === "PHW" ? "#18202E" : p.team === "NYK" ? "#F58426" : "#151515";
  c.globalAlpha = ga;
  c.lineCap = "round";
  // shadow
  c.fillStyle = "rgba(0,0,0,0.4)";
  c.beginPath(); c.ellipse(F0.x, F0.y, px * 0.45, px * 0.17, 0, 0, Math.PI * 2); c.fill();
  // a white rim of light round the one who scored it
  if (p.num === "13") {
    const g = prog(f, T.n100, 18, ease.out) * (0.55 + 0.25 * Math.sin(f * 0.12));
    const mid = at(h * 0.55);
    const gr = c.createRadialGradient(mid.x, mid.y, 0, mid.x, mid.y, px * 1.4);
    gr.addColorStop(0, `rgba(255,255,255,${(0.22 * g).toFixed(3)})`); gr.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = gr; c.beginPath(); c.arc(mid.x, mid.y, px * 1.4, 0, Math.PI * 2); c.fill();
  }
  const hip = at(h * 0.5), sho = at(h * 0.8), neck = at(h * 0.86), head = at(h * 0.93);
  // legs and shoes
  for (const side of [-1, 1]) {
    const ft = at(0, side * 0.13, 0), kn = at(h * 0.27, side * 0.12, 0), hp = at(h * 0.5, side * 0.1, 0);
    c.strokeStyle = skin; c.lineWidth = Math.max(1, px * 0.13);
    c.beginPath(); c.moveTo(ft.x, ft.y); c.lineTo(kn.x, kn.y); c.lineTo(hp.x, hp.y); c.stroke();
    // long socks of the era, then the shoe
    const sk = at(h * 0.2, side * 0.125, 0);
    c.strokeStyle = p.team === "REF" ? "#1A1A1A" : "#ECEAE4"; c.lineWidth = Math.max(1, px * 0.135);
    c.beginPath(); c.moveTo(ft.x, ft.y); c.lineTo(sk.x, sk.y); c.stroke();
    c.fillStyle = p.team === "REF" ? "#0E0E0E" : "#F1F0EC";
    c.beginPath(); c.ellipse(ft.x, ft.y, px * 0.11, px * 0.06, 0, 0, Math.PI * 2); c.fill();
  }
  // shorts
  c.strokeStyle = p.team === "REF" ? "#1C1C1C" : jersey; c.lineWidth = Math.max(1.4, px * 0.4);
  const sh0 = at(h * 0.4), sh1 = at(h * 0.53);
  c.beginPath(); c.moveTo(sh0.x, sh0.y); c.lineTo(sh1.x, sh1.y); c.stroke();
  // arms, hanging; Wilt's right arm goes up as the floor fills round him
  const armUp = p.num === "13" ? prog(f, T.onto, 14, ease.out) : 0;
  for (const side of [-1, 1]) {
    const up = side === 1 ? armUp : 0;
    const el = at(h * ffLerp(0.62, 0.98, up), side * ffLerp(0.27, 0.3, up), 0);
    const hd = at(h * ffLerp(0.46, 1.17, up), side * ffLerp(0.3, 0.34, up), 0);
    c.strokeStyle = skin; c.lineWidth = Math.max(1, px * 0.1);
    c.beginPath(); c.moveTo(sho.x + (side * px * 0.18), sho.y); c.lineTo(el.x, el.y); c.lineTo(hd.x, hd.y); c.stroke();
  }
  // jersey: a tank top, piped at the arm holes and the neck
  c.strokeStyle = jersey; c.lineWidth = Math.max(1.6, px * 0.44);
  c.beginPath(); c.moveTo(hip.x, hip.y); c.lineTo(sho.x, sho.y); c.stroke();
  if (p.team === "REF" && px > 6) {
    c.strokeStyle = "#151515"; c.lineWidth = Math.max(0.8, px * 0.06);
    for (const o of [-0.14, 0, 0.14]) { const a = at(h * 0.52, o, 0), b = at(h * 0.8, o, 0); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
  } else if (px > 6) {
    c.strokeStyle = trim; c.lineWidth = Math.max(0.8, px * 0.045);
    for (const side of [-1, 1]) { const a = at(h * 0.8, side * 0.2, 0), b = at(h * 0.68, side * 0.21, 0); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
    if (p.num && px > 18) {
      const nm = at(h * 0.69);
      c.fillStyle = trim; c.font = `800 ${Math.round(px * 0.22)}px Inter, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(p.num, nm.x, nm.y);
    }
  }
  // neck, head and short hair
  c.strokeStyle = skin; c.lineWidth = Math.max(1, px * 0.12);
  c.beginPath(); c.moveTo(sho.x, sho.y); c.lineTo(neck.x, neck.y); c.stroke();
  const hr = Math.max(1.2, px * 0.12);
  c.fillStyle = skin; c.beginPath(); c.arc(head.x, head.y, hr, 0, Math.PI * 2); c.fill();
  c.fillStyle = "#15100C"; c.beginPath(); c.arc(head.x, head.y - hr * 0.25, hr * 0.92, Math.PI, 0); c.fill();
  c.globalAlpha = 1;
}

export function drawFloodArena(c: Ctx, f: number, T: FloodT, V: FfView, boardGlow: number) {
  c.clearRect(0, 0, W, H);
  c.fillStyle = "#0B0E13";
  c.fillRect(0, 0, W, H);
  const SEG = 30;

  /* the far end wall: poured concrete in form-board courses, under the vault's last curve */
  {
    const z = FF_ARENA.zFar;
    const pts: V3[] = [[FF_ARENA.springX, 0, z]];
    for (let i = 0; i <= SEG; i++) { const [x, y] = ffVaultPt((Math.PI * i) / SEG); pts.push([x, y, z]); }
    pts.push([-FF_ARENA.springX, 0, z]);
    poly(c, V, pts, rgb(46, 50, 56, 0.55 + 0.25 * light([0, 14, z - 4], boardGlow)));
    // the form-board courses and the panel joints, lit a little by the board
    for (let k = 0; k < 26; k++) {
      const y = 1.2 + k * 1.15;
      const half = y < FF_ARENA.springY ? FF_ARENA.springX : FF_ARENA.springX * Math.sqrt(Math.max(0, 1 - ((y - FF_ARENA.springY) / (FF_ARENA.crownY - FF_ARENA.springY)) ** 2));
      const a = V.P([-half, y, z - 0.02]), b = V.P([half, y, z - 0.02]);
      if (a.z < 0.5) continue;
      const l = light([0, y, z - 1], boardGlow);
      c.strokeStyle = rgb(28, 31, 36, 0.9 + 0.3 * l, 0.55);
      c.lineWidth = Math.max(0.6, a.s * 0.025);
      c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
    }
    for (let k = -9; k <= 9; k++) {
      const x = k * 3.6;
      const top = Math.abs(x) < FF_ARENA.springX ? ffVaultPt(Math.acos(ffClamp(x / FF_ARENA.springX, -1, 1)))[1] : 0;
      const a = V.P([x, 12.5, z - 0.02]), b = V.P([x, top - 0.3, z - 0.02]);
      if (a.z < 0.5) continue;
      c.strokeStyle = "rgba(24,27,31,0.55)";
      c.lineWidth = Math.max(0.6, a.s * 0.03);
      c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
    }
    // close up (the board's own scene), the concrete reads as what it is: board-formed, each form board a strip of
    // its own tone with the wood grain printed in it, 2.4 m panels, and the form-tie holes in a grid
    {
      const probe = V.P([0, 16, z - 0.02]);
      const near = ffClamp((probe.s - 30) / 40);
      if (probe.z > 0.5 && near > 0.01) {
        const SH = 0.3;
        for (let r = 0; r < 70; r++) {
          const y0 = 5 + r * SH;
          for (let pn = -6; pn < 6; pn++) {
            const x0 = pn * 2.4, x1 = x0 + 2.4;
            const a = V.P([x0, y0 + SH, z - 0.02]), b = V.P([x1, y0, z - 0.02]);
            if (b.x < -10 || a.x > W + 10 || a.y > H + 10 || b.y < -10) continue;
            const t = ffRnd(r * 13.7 + pn * 3.1);
            const l = light([(x0 + x1) / 2, y0, z - 1], boardGlow);
            c.fillStyle = t < 0.5 ? `rgba(255,236,205,${(0.07 * near * (0.6 + l)).toFixed(3)})` : `rgba(0,0,0,${(0.15 * near).toFixed(3)})`;
            c.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
            // the seam between two form boards
            c.fillStyle = `rgba(14,16,19,${(0.62 * near).toFixed(3)})`;
            c.fillRect(a.x, b.y - 1, b.x - a.x, Math.max(1, a.s * 0.012));
            // a grain streak printed by the board
            if (t > 0.35) {
              const gy = ffLerp(a.y, b.y, 0.3 + 0.4 * ffRnd(r * 2.9 + pn));
              c.fillStyle = `rgba(20,22,26,${(0.18 * near).toFixed(3)})`;
              c.fillRect(ffLerp(a.x, b.x, ffRnd(r + pn * 7) * 0.4), gy, (b.x - a.x) * (0.3 + 0.4 * ffRnd(r * 5 + pn)), 1);
            }
          }
        }
        for (let pn = -6; pn <= 6; pn++) for (let r = 0; r < 10; r++) {
          const x = pn * 2.4, y = 5.6 + r * 2.1;
          const j = V.P([x, y, z - 0.02]);
          c.fillStyle = `rgba(14,16,19,${(0.5 * near).toFixed(3)})`;
          c.fillRect(j.x - 1, j.y - j.s * 1.05, Math.max(1.4, j.s * 0.014), j.s * 2.1);
          for (const dx of [0.6, 1.8]) {
            const h = V.P([x + dx, y + 0.45, z - 0.02]);
            c.beginPath(); c.arc(h.x, h.y, Math.max(1, h.s * 0.022), 0, Math.PI * 2);
            c.fillStyle = `rgba(10,11,13,${(0.7 * near).toFixed(3)})`; c.fill();
            c.beginPath(); c.arc(h.x, h.y + h.s * 0.012, Math.max(1, h.s * 0.022), 0, Math.PI);
            c.strokeStyle = `rgba(255,236,205,${(0.12 * near).toFixed(3)})`; c.lineWidth = 1; c.stroke();
          }
        }
      }
    }
    // the lit bulbs throw a warm pool down the wall under the cabinet, growing with every column
    {
      const b = V.P([FF_BOARD.x, FF_BOARD.y - 4.6, z - 0.05]);
      if (b.z > 0.5 && boardGlow > 0.01) {
        const R = b.s * 7;
        const g = c.createRadialGradient(b.x, b.y - b.s * 1.2, 0, b.x, b.y - b.s * 1.2, R);
        g.addColorStop(0, `rgba(255,214,150,${(0.16 * boardGlow).toFixed(3)})`); g.addColorStop(1, "rgba(255,214,150,0)");
        c.fillStyle = g; c.fillRect(b.x - R, b.y - R, R * 2, R * 2);
      }
    }
    // water stains running down from the vault seam, a few, faint
    for (let k = 0; k < 7; k++) {
      const x = (ffRnd(k * 3.3) - 0.5) * 40, top = 24 + ffRnd(k) * 5, len = 3 + ffRnd(k * 7.1) * 6;
      const a = V.P([x, top, z - 0.03]), b = V.P([x + 0.2, top - len, z - 0.03]);
      if (a.z < 0.5) continue;
      const g = c.createLinearGradient(a.x, a.y, b.x, b.y);
      g.addColorStop(0, "rgba(20,22,26,0.35)"); g.addColorStop(1, "rgba(20,22,26,0)");
      c.strokeStyle = g; c.lineWidth = Math.max(1, a.s * (0.25 + ffRnd(k * 2) * 0.4));
      c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
    }
  }
  for (const s of [-1, 1]) {
    poly(c, V, [[s * FF_ARENA.springX, 0, FF_ARENA.zNear], [s * FF_ARENA.springX, FF_ARENA.springY, FF_ARENA.zNear], [s * FF_ARENA.springX, FF_ARENA.springY, FF_ARENA.zFar], [s * FF_ARENA.springX, 0, FF_ARENA.zFar]], "rgb(30,33,38)");
  }
  /* the vault: recessed bays, vents, then the ribs standing proud */
  const inset = 0.7;
  for (let k = 0; k < FF_ARENA.ribs - 1; k++) {
    const z0 = ffRibZ(k) + 0.85, z1 = ffRibZ(k + 1) - 0.85;
    for (let i = 0; i < SEG; i++) {
      const a0 = (Math.PI * i) / SEG, a1 = (Math.PI * (i + 1)) / SEG;
      const [x0, y0] = ffVaultPt(a0), [x1, y1] = ffVaultPt(a1);
      const l = light([(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], boardGlow);
      const up = Math.sin((a0 + a1) / 2);
      const k2 = 0.38 + 0.55 * l * (0.6 + 0.4 * up);
      poly(c, V, [[x0, y0, z0], [x1, y1, z0], [x1, y1, z1], [x0, y0, z1]], rgb(70, 76, 84, k2), rgb(70, 76, 84, k2 * 0.96), 0.6);
    }
    for (const a of [Math.PI * 0.36, Math.PI * 0.64]) {
      const [x, y] = ffVaultPt(a);
      const p = V.P([x * 0.995, y - 0.05, (z0 + z1) / 2]);
      if (p.z > 1) { c.beginPath(); c.ellipse(p.x, p.y, p.s * 0.42, p.s * 0.3, 0, 0, Math.PI * 2); c.fillStyle = "rgba(10,12,15,0.85)"; c.fill(); }
    }
  }
  for (let k = 0; k < FF_ARENA.ribs; k++) {
    const z = ffRibZ(k);
    for (let i = 0; i < SEG; i++) {
      const a0 = (Math.PI * i) / SEG, a1 = (Math.PI * (i + 1)) / SEG;
      const [x0, y0] = ffVaultPt(a0), [x1, y1] = ffVaultPt(a1);
      const sc = (x: number, y: number, d: number): [number, number] => {
        const cy = FF_ARENA.springY;
        return [x * (1 - d / FF_ARENA.springX), cy + (y - cy) * (1 - d / (FF_ARENA.crownY - cy))];
      };
      const [ix0, iy0] = sc(x0, y0, inset), [ix1, iy1] = sc(x1, y1, inset);
      const l = light([(x0 + x1) / 2, (y0 + y1) / 2, z], boardGlow);
      poly(c, V, [[x0, y0, z - 0.85], [x1, y1, z - 0.85], [ix1, iy1, z - 0.85], [ix0, iy0, z - 0.85]], rgb(78, 84, 92, 0.5 + 0.45 * l));
      poly(c, V, [[ix0, iy0, z - 0.85], [ix1, iy1, z - 0.85], [ix1, iy1, z + 0.85], [ix0, iy0, z + 0.85]], rgb(96, 102, 110, 0.55 + 0.55 * l), rgb(96, 102, 110, 0.5 + 0.5 * l), 0.6);
    }
  }
  /* the hanging reflector lamps */
  for (const l of LAMPS) {
    const top = V.P([l[0], ffVaultPt(Math.PI / 2 + Math.atan2(l[0], 30) * -0.4)[1] - 0.6, l[2]]), p = V.P(l);
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

  /* the oval floor, the 1962 court on it */
  const RZ = FF_ARENA.rinkZ, RX = FF_ARENA.rinkX, RR = FF_ARENA.rinkR;
  const rinkPath = (yy: number): V3[] => {
    const out: V3[] = [];
    const corner = (cx: number, cz: number, a0: number) => { for (let i = 0; i <= 8; i++) { const a = a0 + (Math.PI / 2) * (i / 8); out.push([cx + RR * Math.cos(a), yy, cz + RR * Math.sin(a)]); } };
    corner(RX - RR, RZ - RR, 0); corner(-RX + RR, RZ - RR, Math.PI / 2); corner(-RX + RR, -RZ + RR, Math.PI); corner(RX - RR, -RZ + RR, Math.PI * 1.5);
    return out;
  };
  poly(c, V, rinkPath(0), "rgb(30,31,33)");
  {
    const NX2 = 10, NZ2 = 24;
    for (let i = 0; i < NX2; i++) for (let j = 0; j < NZ2; j++) {
      const x0 = -RX + (2 * RX * i) / NX2, x1 = x0 + (2 * RX) / NX2, z0 = -RZ + (2 * RZ * j) / NZ2, z1 = z0 + (2 * RZ) / NZ2;
      const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
      const inC = Math.abs(cx) < FF_ARENA.courtX && Math.abs(cz) < FF_ARENA.courtZ;
      const ox = Math.max(0, Math.abs(cx) - (RX - RR)), oz = Math.max(0, Math.abs(cz) - (RZ - RR));
      if (inC || ox * ox + oz * oz > RR * RR) continue;
      const l = light([cx, 0, cz], 0);
      poly(c, V, [[x0, 0.005, z0], [x1, 0.005, z0], [x1, 0.005, z1], [x0, 0.005, z1]], rgb(62, 63, 66, 0.35 + 0.55 * l), rgb(62, 63, 66, 0.35 + 0.55 * l), 0.6);
    }
  }
  const CX = FF_ARENA.courtX, CZ = FF_ARENA.courtZ, NX = 8, NZ = 16;
  for (let i = 0; i < NX; i++) for (let j = 0; j < NZ; j++) {
    const x0 = -CX + (2 * CX * i) / NX, x1 = -CX + (2 * CX * (i + 1)) / NX, z0 = -CZ + (2 * CZ * j) / NZ, z1 = -CZ + (2 * CZ * (j + 1)) / NZ;
    const l = light([(x0 + x1) / 2, 0, (z0 + z1) / 2], 0);
    const kk = 0.66 + 0.5 * l;
    poly(c, V, [[x0, 0.01, z0], [x1, 0.01, z0], [x1, 0.01, z1], [x0, 0.01, z1]], rgb(184, 140, 96, kk), rgb(184, 140, 96, kk), 0.5);
  }
  // the boards: strips of maple, each its own tone, butted end to end
  for (let i = 0; i < 34; i++) for (let j = 0; j < 8; j++) {
    const t = ffRnd(i * 7.3 + j * 1.9);
    if (t > 0.45 && t < 0.7) continue;
    const x0 = -CX + (2 * CX * i) / 34, x1 = x0 + (2 * CX) / 34, z0 = -CZ + (2 * CZ * j) / 8 + (ffRnd(i) - 0.5) * 1.2, z1 = z0 + (2 * CZ) / 8;
    const q = [[x0, 0.011, Math.max(-CZ, z0)], [x1, 0.011, Math.max(-CZ, z0)], [x1, 0.011, Math.min(CZ, z1)], [x0, 0.011, Math.min(CZ, z1)]] as V3[];
    poly(c, V, q, t < 0.45 ? `rgba(255,226,170,${(0.05 + 0.06 * t).toFixed(3)})` : `rgba(70,40,15,${(0.08 + 0.1 * (t - 0.7)).toFixed(3)})`);
  }
  // the hanging lamps mirrored in the varnish: each one's reflection sits where its mirror image projects
  {
    c.save();
    const cq = [[-CX, 0, -CZ], [CX, 0, -CZ], [CX, 0, CZ], [-CX, 0, CZ]].map((p) => V.P(p as V3));
    if (cq.every((p) => p.z > 0.4)) {
      c.beginPath(); cq.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.closePath(); c.clip();
      for (const L of LAMPS) {
        const m = V.P([L[0], -L[1], L[2]]);
        if (m.z < 1) continue;
        const rx = Math.max(8, m.s * 2.6), ry = rx * 2.4;
        const g = c.createRadialGradient(m.x, m.y, 0, m.x, m.y, ry);
        g.addColorStop(0, "rgba(255,236,196,0.30)"); g.addColorStop(0.35, "rgba(255,220,160,0.10)"); g.addColorStop(1, "rgba(255,220,160,0)");
        c.fillStyle = g;
        c.beginPath(); c.ellipse(m.x, m.y, rx, ry, 0, 0, Math.PI * 2); c.fill();
      }
    }
    c.restore();
  }
  c.strokeStyle = "rgba(60,38,20,0.35)";
  for (let i = 1; i < 34; i++) {
    const x = -CX + (2 * CX * i) / 34, a = V.P([x, 0.012, -CZ]), b = V.P([x, 0.012, CZ]);
    if (a.z > 0.4 && b.z > 0.4) { c.lineWidth = Math.max(0.4, Math.min(a.s, b.s) * 0.012); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
  }
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
  const rk = rinkPath(0), rt = rinkPath(1.07);
  for (let i = 0; i < rk.length; i++) {
    const j = (i + 1) % rk.length;
    const l = light(rk[i], 0);
    poly(c, V, [rk[i], rk[j], rt[j], rt[i]], rgb(160, 160, 156, 0.18 + 0.12 * l));
  }

  /* the banks: concrete risers, the corner walls */
  for (const s of [-1, 1]) poly(c, V, [[s * 13.9, 0, -30.4], [s * 13.9, 0, 30.8], [s * 35.8, 15.5, 30.8], [s * 35.8, 15.5, -30.4]], "rgb(26,25,25)");
  poly(c, V, [[-12.6, 0, 31.2], [12.6, 0, 31.2], [23.6, 12.4, 47.8], [-23.6, 12.4, 47.8]], "rgb(26,25,25)");
  for (const s of [-1, 1]) poly(c, V, [[s * 12.6, 0, 31.2], [s * 13.9, 0, 30.8], [s * 35.8, 15.5, 30.8], [s * 23.6, 12.4, 47.8]], "rgb(20,21,23)");

  /* the seats: bare wood once they are left; the never-sold ones keep the grey outline they got in `crowd` */
  {
    const drawn: { p: ReturnType<typeof V.P>; i: number }[] = [];
    for (let i = 0; i < FF_SEATS.length; i++) {
      const q = FF_SEATS[i];
      const p = V.P([q.x, q.y + 0.32, q.z]);
      if (p.z < 0.8 || p.x < -40 || p.x > W + 40 || p.y < -40 || p.y > H + 40) continue;
      drawn.push({ p, i });
    }
    drawn.sort((a, b) => b.p.z - a.p.z);
    for (const { p, i } of drawn) {
      const q = FF_SEATS[i];
      const w = p.s * 0.46, h = p.s * 0.36;
      const l = light([q.x, q.y, q.z], boardGlow);
      c.fillStyle = rgb(120, 86, 56, 0.24 + 0.2 * l);
      c.fillRect(p.x - w / 2, p.y - h / 2, w, h);
      if (w > 5) { c.fillStyle = rgb(160, 120, 80, 0.2 + 0.2 * l); c.fillRect(p.x - w / 2, p.y - h / 2, w, Math.max(1, h * 0.18)); }
      if (!q.filled) {
        c.strokeStyle = "rgba(118,126,136,0.42)";
        c.lineWidth = Math.max(0.8, p.s * 0.045);
        c.strokeRect(p.x - w / 2, p.y - h / 2, w, h);
      }
    }
  }

  /* the people, far to near: 4,124 witnesses and the twelve on the floor */
  const items: { d: number; i: number; kind: 0 | 1 }[] = [];
  const state: { jumpAt: number; x: number; y: number; z: number; lift: number; dx: number; dz: number; st: number; run: number; dist: number; arrived: number }[] = [];
  for (let n = 0; n < FF_RUNNERS.length; n++) {
    const r = FF_RUNNERS[n];
    const q = FF_SEATS[r.seat];
    const st = prog(f, T.fans + r.stand, 9, ease.out);
    const t0 = T.poured + r.delay;
    const k = ffClamp((f - t0) / r.dur);
    const u = RUN(k);
    let x = q.x, y = q.y - 0.5, z = q.z, lift = 0, dx = 0, dz = 0;
    if (k > 0) {
      const a = ffRunnerAt(r, u);
      [x, y, z] = a.p;
      lift = a.lift;
      const dl = Math.hypot(a.dir[0], a.dir[1]) || 1;
      dx = a.dir[0] / dl; dz = a.dir[1] / dl;
    }
    const arrived = ffClamp((f - t0 - r.dur) / 24);
    if (arrived > 0) {
      // once on the floor: milling about a little, and the jumpers jumping
      x += 0.2 * arrived * Math.sin(f * 0.045 + r.seed);
      z += 0.2 * arrived * Math.cos(f * 0.038 + r.seed * 1.3);
      lift += arrived * (ffRnd(r.seed * 3.3) < 0.5 ? 0.2 : 0.06) * Math.max(0, Math.sin(f * 0.23 + r.seed * 2.1));
    }
    // the tremble of a crowd on its feet, before it goes
    if (st > 0 && k <= 0) x += 0.04 * Math.sin(f * 1.9 + r.seed) * st;
    const feet = V.P([x, y, z]);
    state.push({ jumpAt: T.n100 + 1 + ffRnd(r.seed * 6.1) * 6, x, y, z, lift, dx, dz, st, run: k > 0 && k < 1 ? Math.min(1, k * 8, (1 - k) * 6) : 0, dist: u * r.len, arrived });
    if (feet.z < 6.5 || feet.x < -80 || feet.x > W + 80 || feet.y < -160 || feet.y > H + 260) continue;
    items.push({ d: feet.z, i: n, kind: 0 });
  }
  FF_PLAYERS.forEach((p, i) => {
    const feet = V.P([p.x, 0, p.z]);
    if (feet.z > 6.5) items.push({ d: feet.z, i, kind: 1 });
  });
  items.sort((a, b) => b.d - a.d);
  c.lineCap = "round";
  for (const it of items) {
    // the nearest ones (the final shot is taken from among them) fade so they never wall off the lens
    const near = it.kind === 1 ? 1 : ffClamp((it.d - 6.5) / 4);
    if (near <= 0.01) continue;
    if (it.kind === 1) drawFfPlayer(c, V, FF_PLAYERS[it.i], f, T, near);
    else drawFfWitness(c, V, FF_RUNNERS[it.i].seed, FF_SEATS[FF_RUNNERS[it.i].seat], state[it.i], f, light([state[it.i].x, 1, state[it.i].z], boardGlow), near);
  }


  /* the 1962 baskets: a steel stanchion behind the baseline, the arm and two braces out to a framed backboard, the
     painted shooting square, the orange rim on its bracket and a cotton net */
  for (const s of [-1, 1]) {
    const bz = s * (FF_ARENA.courtZ - 1.22), pz = s * (FF_ARENA.courtZ + 1.3);
    const near = V.P([0, 3.5, bz]);
    if (near.z < 6) continue;
    const P = (x: number, y: number, z: number) => V.P([x, y, z]);
    const ln = (pts: V3[], col: string, w: number) => {
      const q = pts.map(V.P); if (q.some((p) => p.z < 0.6)) return;
      c.strokeStyle = col; c.lineWidth = Math.max(0.8, q[0].s * w); c.lineCap = "round";
      c.beginPath(); q.forEach((p, k) => (k ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.stroke();
    };
    // the pole's shadow on the boards, then the base, the pole and the arm
    poly(c, V, [[-0.5, 0.02, pz - s * 0.4], [0.5, 0.02, pz - s * 0.4], [0.7, 0.02, pz + s * 0.9], [-0.7, 0.02, pz + s * 0.9]], "rgba(0,0,0,0.25)");
    poly(c, V, [[-0.45, 0.02, pz - 0.35], [0.45, 0.02, pz - 0.35], [0.45, 0.25, pz - 0.35], [-0.45, 0.25, pz - 0.35]], "rgb(52,56,62)");
    ln([[0, 0, pz], [0, 3.9, pz]], "rgb(120,126,134)", 0.11);
    ln([[0.04, 0, pz], [0.04, 3.9, pz]], "rgba(220,226,232,0.35)", 0.025);
    ln([[0, 3.9, pz], [0, 3.9, bz + s * 0.06]], "rgb(110,116,124)", 0.08);
    ln([[0, 2.3, pz], [-0.6, 3.0, bz + s * 0.06]], "rgb(96,102,110)", 0.045);
    ln([[0, 2.3, pz], [0.6, 3.0, bz + s * 0.06]], "rgb(96,102,110)", 0.045);
    // the backboard: a steel angle frame round a painted board, the shooting square above the rim
    const BW = 0.915, B0 = 2.9, B1 = 4.12;
    poly(c, V, [[-BW - 0.04, B0 - 0.04, bz], [BW + 0.04, B0 - 0.04, bz], [BW + 0.04, B1 + 0.04, bz], [-BW - 0.04, B1 + 0.04, bz]], "rgb(70,74,80)");
    const lb = light([0, 3.5, bz], 0);
    poly(c, V, [[-BW, B0, bz - s * 0.01], [BW, B0, bz - s * 0.01], [BW, B1, bz - s * 0.01], [-BW, B1, bz - s * 0.01]], rgb(236, 232, 222, 0.82 + 0.25 * lb));
    // light falling across the paint from the lamps above
    {
      const a = P(-BW, B1, bz - s * 0.012), b = P(BW, B0, bz - s * 0.012);
      const g = c.createLinearGradient(a.x, a.y, a.x, b.y);
      g.addColorStop(0, "rgba(255,248,230,0.2)"); g.addColorStop(1, "rgba(60,58,54,0.25)");
      poly(c, V, [[-BW, B0, bz - s * 0.012], [BW, B0, bz - s * 0.012], [BW, B1, bz - s * 0.012], [-BW, B1, bz - s * 0.012]], "rgba(0,0,0,0)");
      c.fillStyle = g; c.fill();
    }
    ln([[-BW + 0.05, B0 + 0.05, bz - s * 0.02], [BW - 0.05, B0 + 0.05, bz - s * 0.02], [BW - 0.05, B1 - 0.05, bz - s * 0.02], [-BW + 0.05, B1 - 0.05, bz - s * 0.02], [-BW + 0.05, B0 + 0.05, bz - s * 0.02]], "rgba(150,40,30,0.85)", 0.03);
    ln([[-0.305, 3.15, bz - s * 0.02], [-0.305, 3.607, bz - s * 0.02], [0.305, 3.607, bz - s * 0.02], [0.305, 3.15, bz - s * 0.02]], "rgba(150,40,30,0.95)", 0.04);
    // the rim on its bracket, 15 cm off the board, and the net hanging under it
    const rc = bz - s * (0.15 + 0.23);
    ln([[0, 3.0, bz - s * 0.02], [0, 3.05, rc + s * 0.2]], "rgb(190,86,34)", 0.05);
    const N = 12, NET = 0.42;
    const top = Array.from({ length: N }, (_, k) => { const a = (k / N) * Math.PI * 2; return [0.23 * Math.cos(a), 3.05, rc + 0.23 * Math.sin(a)] as V3; });
    const mid = Array.from({ length: N }, (_, k) => { const a = ((k + 0.5) / N) * Math.PI * 2; return [0.18 * Math.cos(a), 3.05 - NET * 0.5, rc + 0.18 * Math.sin(a)] as V3; });
    const bot = Array.from({ length: N }, (_, k) => { const a = (k / N) * Math.PI * 2; return [0.14 * Math.cos(a), 3.05 - NET, rc + 0.14 * Math.sin(a)] as V3; });
    for (let k = 0; k < N; k++) {
      const k1 = (k + 1) % N, km = (k + N - 1) % N;
      ln([top[k], mid[k]], "rgba(240,238,232,0.8)", 0.012);
      ln([top[k1], mid[k]], "rgba(240,238,232,0.8)", 0.012);
      ln([mid[k], bot[k]], "rgba(240,238,232,0.75)", 0.012);
      ln([mid[km], bot[k]], "rgba(240,238,232,0.75)", 0.012);
    }
    ln([...bot, bot[0]], "rgba(240,238,232,0.6)", 0.01);
    ln([...top, top[0]], "rgb(214,98,40)", 0.035);
  }

  /* dust in the lamps' light, drifting: the air of a full night (it reads only close, on the end wall) */
  {
    for (let k = 0; k < 70; k++) {
      const x = (ffRnd(k * 1.7) - 0.5) * 18, z = FF_ARENA.zFar - 1.5 - ffRnd(k * 3.9) * 6;
      const y = 12 + ((ffRnd(k * 9.1) * 14 - f * (0.004 + 0.004 * ffRnd(k))) % 14 + 14) % 14;
      const p = V.P([x + Math.sin(f * 0.02 + k) * 0.3, y, z]);
      if (p.z < 2 || p.s < 30) continue;
      c.beginPath(); c.arc(p.x, p.y, Math.max(0.8, p.s * 0.012), 0, Math.PI * 2);
      c.fillStyle = `rgba(255,236,200,${(0.25 + 0.3 * ffRnd(k * 5.5)) * ffClamp((p.s - 30) / 40)})`; c.fill();
    }
  }
}

export const FansFloodFloorArena: React.FC<{ f: number; T: FloodT; V: FfView; boardGlow: number }> = ({ f, T, V, boardGlow }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const c = ref.current?.getContext("2d");
    if (c) drawFloodArena(c, f, T, V, boardGlow);
  });
  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />;
};
