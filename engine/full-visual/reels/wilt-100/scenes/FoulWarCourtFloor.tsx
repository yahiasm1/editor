// wilt-100 "fouls": the floor of Hershey Sports Arena on one canvas, from the camera, every frame. The 1962 court
// laid inside the hockey rink (1938 interior photo), maple strips 2 1/4 in wide with staggered butt joints and the
// lamps' glare in the varnish, the 12 ft keyhole with the dashed half circle, the basket on its stanchion; the stands
// of amber witnesses behind the baseline while the camera drops; then the jerseys, the two striped officials, the
// ball with its panel seams and its shadow, the passes' trails, the fouls.
import React, { useLayoutEffect, useRef, useState } from "react";
import { Easing } from "remotion";
import { ease, prog } from "../../../src/engine";
import {
  FWC_COURT as C, FWC_GHOSTS, FWC_KNICKS, FWC_WARRIORS, type FoulWarT, type FwcCam, type FwcWho,
  fwcBall, fwcBendAround, fwcClamp, fwcClear, fwcOut, fwcFlightAt, fwcGhostAt, fwcLerp, fwcPeople, fwcProject, fwcRnd, fwcWhistles,
} from "./FoulWarCourtKit";

const W = 1080, H = 1920;
let NUM_FONT = "sans-serif";
let CLR = 1; // the handover clear, set each frame

/* ---------- built once ---------- */
type Board = { x0: number; x1: number; z0: number; z1: number; tone: number; grain: number };
const BOARDS: Board[] = (() => {
  const out: Board[] = [];
  const sw = 2.25 / 12;
  let i = 0;
  for (let x = -C.apronX; x < C.apronX; x += sw, i++) {
    let z = C.apronZ0 - fwcRnd(i * 1.7) * 6;
    let j = 0;
    while (z < C.apronZ1) {
      const l = 2 + fwcRnd(i * 7.3 + j * 3.1) * 6;
      out.push({ x0: x, x1: x + sw, z0: Math.max(C.apronZ0, z), z1: Math.min(C.apronZ1, z + l), tone: fwcRnd(i * 13.1 + j * 5.7), grain: fwcRnd(i * 2.9 + j * 11.3) });
      z += l;
      j++;
    }
  }
  return out;
})();

type Seat = { x: number; y: number; z: number; on: boolean; ph: number };
const SEATS: Seat[] = (() => {
  const s: Seat[] = [];
  let n = 0;
  // the end bank behind Wilt's baseline, beyond the rink boards, and the two long banks
  for (let r = 0; r < 22; r++) {
    for (let x = -40; x <= 40; x += 1.7) {
      if (Math.abs(x) < 2.2 && r < 12) continue; // the aisle
      s.push({ x, y: 3 + r * 1.85, z: -57 - r * 2.6, on: fwcRnd(n * 3.3) < 0.47 + r * 0.004, ph: fwcRnd(n * 9.1) });
      n++;
    }
    for (const side of [-1, 1]) {
      for (let z = -50; z <= 140; z += 1.7) {
        if (Math.floor((z + 50) / 22) % 2 === 1 && ((z + 50) % 22) < 2.4) continue;
        s.push({ x: side * (46 + r * 2.6), y: 3 + r * 1.85, z, on: fwcRnd(n * 3.3) < 0.47, ph: fwcRnd(n * 9.1) });
        n++;
      }
    }
  }
  return s;
})();

const RINK: [number, number][] = (() => {
  const pts: [number, number][] = [];
  const hx = 42.5, z0 = -53, z1 = 147, r = 28;
  const corner = (cx: number, cz: number, a0: number) => {
    for (let k = 0; k <= 10; k++) {
      const a = a0 + (k / 10) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]);
    }
  };
  corner(hx - r, z1 - r, 0);
  corner(-hx + r, z1 - r, Math.PI / 2);
  corner(-hx + r, z0 + r, Math.PI);
  corner(hx - r, z0 + r, Math.PI * 1.5);
  return pts;
})();

/* skin and the look of each jersey (1962 Knicks: Guerin, Naulls, Buckner, Butler, Budd; the Warriors of the box) */
const LOOK: Record<FwcWho, { team: "W" | "K" | "R"; skin: string; num?: string; r: number }> = {
  W13: { team: "W", skin: "#4E3222", num: "13", r: 2.75 },
  G1: { team: "W", skin: "#5C3B27", r: 2.25 },
  G2: { team: "W", skin: "#6A452D", r: 2.25 },
  F1: { team: "W", skin: "#C99A7A", r: 2.3 },
  F2: { team: "W", skin: "#D2A584", r: 2.3 },
  K1: { team: "K", skin: "#CFA07E", r: 2.25 },
  K2: { team: "K", skin: "#5A3A27", r: 2.3 },
  K3: { team: "K", skin: "#4B3021", r: 2.3 },
  K4: { team: "K", skin: "#D7AB89", r: 2.3 },
  KC: { team: "K", skin: "#553626", r: 2.45 },
  R1: { team: "R", skin: "#D1A381", r: 2.05 },
  R2: { team: "R", skin: "#C89878", r: 2.05 },
};

/* ---------- drawing helpers ---------- */
type Ctx = CanvasRenderingContext2D;
function poly(ctx: Ctx, cam: FwcCam, pts: [number, number][], y = 0) {
  ctx.beginPath();
  pts.forEach(([x, z], i) => {
    const p = fwcProject(cam, x, y, z);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
}
function circlePts(cx: number, cz: number, r: number, a0 = 0, a1 = Math.PI * 2, n = 48): [number, number][] {
  const o: [number, number][] = [];
  for (let k = 0; k <= n; k++) {
    const a = a0 + ((a1 - a0) * k) / n;
    o.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]);
  }
  return o;
}

function drawCourtLines(ctx: Ctx, cam: FwcCam) {
  const s = fwcProject(cam, 0, 0, C.ftZ).s;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(236,230,214,0.92)"; // painted cream-white, as the arena's other views of this floor
  ctx.lineWidth = Math.max(2.4, (2 / 12) * s * 1.25);
  const L = (pts: [number, number][]) => { poly(ctx, cam, pts); ctx.stroke(); };
  L([[-C.halfW, 0], [C.halfW, 0], [C.halfW, C.len], [-C.halfW, C.len], [-C.halfW, 0]]);
  L([[-C.halfW, C.mid], [C.halfW, C.mid]]);
  L(circlePts(0, C.mid, 6));
  L(circlePts(0, C.mid, 2));
  for (const end of [0, 1]) {
    const zz = (z: number) => (end === 0 ? z : C.len - z);
    // the 12 ft lane and the free throw line
    L([[-C.laneHalf, zz(0)], [-C.laneHalf, zz(C.ftZ)], [C.laneHalf, zz(C.ftZ)], [C.laneHalf, zz(0)]]);
    // the half circle toward midcourt solid, the half inside the lane dashed (as painted then)
    const out = end === 0 ? [0, Math.PI] : [Math.PI, Math.PI * 2];
    L(circlePts(0, zz(C.ftZ), C.ftR, out[0], out[1], 32));
    const inn = end === 0 ? [Math.PI, Math.PI * 2] : [0, Math.PI];
    for (let k = 0; k < 8; k++) {
      const a0 = inn[0] + ((inn[1] - inn[0]) * (k + 0.2)) / 8, a1 = inn[0] + ((inn[1] - inn[0]) * (k + 0.75)) / 8;
      L(circlePts(0, zz(C.ftZ), C.ftR, a0, a1, 4));
    }
    // the lane space marks
    for (const z of [7, 8, 11, 14]) {
      L([[-C.laneHalf, zz(z)], [-C.laneHalf - 0.7, zz(z)]]);
      L([[C.laneHalf, zz(z)], [C.laneHalf + 0.7, zz(z)]]);
    }
  }
}

function drawBasket(ctx: Ctx, cam: FwcCam, f: number, swish: number) {
  const hy = 10;
  // the stanchion: a padded base behind the baseline and the steel arm out to the board
  poly(ctx, cam, [[-1.6, -4.2], [1.6, -4.2], [1.6, -7.4], [-1.6, -7.4]]);
  ctx.fillStyle = "#1F2328";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  poly(ctx, cam, [[-0.35, -5.6], [0.35, -5.6], [0.35, 3.85], [-0.35, 3.85]], hy);
  ctx.fillStyle = "#2E3238";
  ctx.fill();
  // two braces from the arm out to the board's corners
  ctx.strokeStyle = "#2A2E34";
  ctx.lineWidth = 3;
  poly(ctx, cam, [[-0.3, 0.5], [-2.4, 3.82]], hy);
  ctx.stroke();
  poly(ctx, cam, [[0.3, 0.5], [2.4, 3.82]], hy);
  ctx.stroke();
  // the board, glass with a white painted rim, seen edge-on from above
  poly(ctx, cam, [[-C.boardHalf, 3.82], [C.boardHalf, 3.82], [C.boardHalf, 4.18], [-C.boardHalf, 4.18]], hy);
  ctx.fillStyle = "rgba(214,226,232,0.55)";
  ctx.fill();
  ctx.strokeStyle = "rgba(245,245,240,0.9)";
  ctx.lineWidth = 2;
  ctx.stroke();
  // the net hanging under the rim, strands and mesh
  const r0 = C.rimR, r1 = 0.42;
  ctx.strokeStyle = `rgba(240,238,230,${0.55 + 0.35 * swish})`;
  ctx.lineWidth = 1.2;
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2 + swish * 0.3 * Math.sin(f * 0.6 + k);
    const p0 = fwcProject(cam, Math.cos(a) * r0, hy, C.rimZ + Math.sin(a) * r0);
    const p1 = fwcProject(cam, Math.cos(a + 0.5) * r1, hy - 1.5, C.rimZ + Math.sin(a + 0.5) * r1);
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
  poly(ctx, cam, circlePts(0, C.rimZ, r1, 0, Math.PI * 2, 20), hy - 1.5);
  ctx.stroke();
  // the rim, orange steel with a lighter top
  poly(ctx, cam, circlePts(0, C.rimZ, r0, 0, Math.PI * 2, 32), hy);
  ctx.strokeStyle = "#D2552A";
  ctx.lineWidth = Math.max(2.5, 0.12 * fwcProject(cam, 0, hy, C.rimZ).s);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,190,150,0.55)";
  ctx.lineWidth = 1;
  ctx.stroke();
  // the rim's bracket to the board
  poly(ctx, cam, [[-0.25, 4.18], [0.25, 4.18], [0.25, 4.5], [-0.25, 4.5]], hy);
  ctx.fillStyle = "#B44822";
  ctx.fill();
}

function drawPerson(ctx: Ctx, cam: FwcCam, who: FwcWho, x: number, z: number, face: number, o: { lunge?: number; armUp?: number; signal?: number; glow?: number; alpha?: number }) {
  // a player seen from the vault: bare shoulders and arms out of a sleeveless jersey, the head in the middle, the
  // number on the upper back behind it. Sizes are a player's, scaled up a third so a jersey reads on a phone.
  const L = LOOK[who];
  const k = (L.r / 2.25) * 1.38;
  const p = fwcProject(cam, x, 0, z);
  const sq = Math.max(0.4, Math.sin(cam.phi));
  // seen from straight above the shoulders sit over the feet; while the camera is still low the drawn-from-above
  // body is set down onto its shadow, so nobody floats above the floor
  const top = fwcProject(cam, x, 6 * sq * sq * sq, z);
  const s = top.s;
  const A = 1.75 * k * s; // half the shoulder width
  const B = 0.68 * k * s; // half the depth, chest to back
  ctx.save();
  ctx.globalAlpha = (o.alpha ?? 1) * CLR;
  // the shadow under the lamps, a little long toward the camera's foot
  const sh = ctx.createRadialGradient(p.x, p.y + 0.6 * s, 0, p.x, p.y + 0.6 * s, A * 1.25);
  sh.addColorStop(0, "rgba(0,0,0,0.5)");
  sh.addColorStop(0.6, "rgba(0,0,0,0.22)");
  sh.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = sh;
  ctx.beginPath();
  ctx.ellipse(p.x, p.y + 0.6 * s, A * 1.25, A * 1.0 * sq, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.translate(top.x, top.y);
  ctx.scale(1, sq);
  ctx.rotate(face + Math.PI / 2); // local: x along the shoulders, -y forward (where he looks)
  if (o.glow) {
    ctx.strokeStyle = `rgba(255,255,255,${(0.95 * o.glow).toFixed(3)})`;
    ctx.lineWidth = 3;
    const g = 1.25 + 0.7 * (1 - o.glow);
    ctx.beginPath();
    ctx.ellipse(0, 0, A * g, A * g, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  const skinG = (cx: number, cy: number, r: number) => {
    const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
    g.addColorStop(0, L.skin);
    g.addColorStop(1, "#1A110B");
    return g;
  };
  // arms: reaching forward on a foul, one raised when he calls for the ball, the ref's out to the side
  const arm = (side: number, ang: number, len: number, w: number, lift = 0) => {
    const ax = side * A * 0.82, ay = 0;
    const bx = ax + Math.sin(ang) * len * s, by = ay - Math.cos(ang) * len * s;
    ctx.strokeStyle = L.skin;
    ctx.lineCap = "round";
    ctx.lineWidth = w * s * (1 + lift * 0.5);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.fillStyle = skinG(bx, by, w * s * (0.85 + lift * 0.7));
    ctx.beginPath();
    ctx.arc(bx, by, w * s * (0.85 + lift * 0.7), 0, Math.PI * 2);
    ctx.fill();
  };
  if (o.lunge) {
    arm(-1, 0.25, 2.2 * o.lunge, 0.5);
    arm(1, -0.25, 2.2 * o.lunge, 0.5);
  }
  if (o.armUp) arm(1, 0.5, 1.1 * o.armUp, 0.55, o.armUp); // straight up: short from above, the hand nearer the lens
  if (o.signal) arm(-1, -1.35, 2.3 * o.signal, 0.42, 0.5 * o.signal);
  // shoulders and the tops of the arms: skin at both ends
  for (const side of [-1, 1]) {
    ctx.fillStyle = skinG(side * A * 0.8, 0, B);
    ctx.beginPath();
    ctx.ellipse(side * A * 0.8, 0.05 * B, B * 0.66, B * 0.9, side * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }
  // the jersey over the chest and back, cut round the arm holes
  ctx.beginPath();
  ctx.ellipse(0, 0, A * 0.74, B, 0, 0, Math.PI * 2);
  if (L.team === "R") {
    ctx.save();
    ctx.clip();
    ctx.fillStyle = "#EFEEEA";
    ctx.fillRect(-A, -B, A * 2, B * 2);
    ctx.fillStyle = "#151515";
    const st = 0.34 * s;
    for (let i = -6; i <= 6; i += 2) ctx.fillRect(i * st, -B, st, B * 2);
    ctx.restore();
  } else {
    const g = ctx.createLinearGradient(-A * 0.4, -B, A * 0.5, B);
    if (L.team === "W") {
      g.addColorStop(0, "#FBFAF6");
      g.addColorStop(0.6, "#E2DFD6");
      g.addColorStop(1, "#AEA99E");
    } else {
      g.addColorStop(0, "#3A5698");
      g.addColorStop(0.6, "#22366B");
      g.addColorStop(1, "#121C3C");
    }
    ctx.fillStyle = g;
    ctx.fill();
    // the piping round the arm holes and the neck: dark double line on PHILA, orange on the Knicks
    ctx.strokeStyle = L.team === "W" ? "rgba(24,30,44,0.95)" : "#F58426";
    ctx.lineWidth = Math.max(1.6, 0.12 * s);
    ctx.stroke();
    if (L.team === "W") {
      ctx.lineWidth = Math.max(1, 0.05 * s);
      ctx.beginPath();
      ctx.ellipse(0, 0, A * 0.64, B * 0.86, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  // the number on the upper back, below the head from up here
  if (L.num) {
    ctx.save();
    ctx.translate(0, B * 0.6);
    ctx.font = `700 ${Math.round(B * 0.78)}px ${NUM_FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#1B1F2A";
    ctx.fillText(L.num, 0, 0);
    ctx.restore();
  }
  // the head from above: hair on the crown, a crescent of forehead and nose toward where he looks, ears either side
  const hr = 0.52 * k * s;
  ctx.fillStyle = L.skin;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * hr * 0.92, -B * 0.05, hr * 0.2, hr * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = skinG(0, -B * 0.25, hr);
  ctx.beginPath();
  ctx.arc(0, -B * 0.25, hr * 0.95, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = L.team === "R" ? "#3A281C" : "#17110D";
  ctx.beginPath();
  ctx.arc(0, -B * 0.25 + hr * 0.2, hr * 0.92, 0, Math.PI * 2);
  ctx.fill();
  // the hair's soft sheen from the lamps
  const hs = ctx.createRadialGradient(-hr * 0.3, -B * 0.25, 0, -hr * 0.3, -B * 0.25, hr * 0.8);
  hs.addColorStop(0, "rgba(255,255,255,0.10)");
  hs.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = hs;
  ctx.beginPath();
  ctx.arc(0, -B * 0.25 + hr * 0.2, hr * 0.92, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBall(ctx: Ctx, cam: FwcCam, x: number, h: number, z: number, spin: number) {
  const g = fwcProject(cam, x, 0, z);
  const p = fwcProject(cam, x, h, z);
  const r = 0.66 * p.s;
  // its shadow, softer and smaller the higher it flies
  const k = fwcClamp(1 - h / 14);
  ctx.fillStyle = `rgba(0,0,0,${0.18 + 0.3 * k})`;
  ctx.beginPath();
  ctx.ellipse(g.x + 0.4 * g.s, g.y + 0.4 * g.s, r * (0.7 + 0.3 * k), r * (0.7 + 0.3 * k) * Math.max(0.4, Math.sin(cam.phi)), 0, 0, Math.PI * 2);
  ctx.fill();
  const bg = ctx.createRadialGradient(p.x - r * 0.35, p.y - r * 0.4, r * 0.1, p.x, p.y, r);
  bg.addColorStop(0, "#D9864C");
  bg.addColorStop(0.65, "#A45626");
  bg.addColorStop(1, "#5E2C11");
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fill();
  // the eight panels: deep seams, no laces
  ctx.save();
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = "rgba(30,14,6,0.85)";
  ctx.lineWidth = Math.max(1, r * 0.11);
  ctx.translate(p.x, p.y);
  ctx.rotate(spin);
  ctx.beginPath();
  ctx.moveTo(-r, 0);
  ctx.lineTo(r, 0);
  ctx.moveTo(0, -r);
  ctx.lineTo(0, r);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(-r * 0.95, 0, r * 0.55, r * 1.1, 0, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(r * 0.95, 0, r * 0.55, r * 1.1, 0, Math.PI / 2, Math.PI * 1.5);
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = "rgba(255,240,220,0.35)";
  ctx.beginPath();
  ctx.ellipse(p.x - r * 0.38, p.y - r * 0.42, r * 0.28, r * 0.18, -0.6, 0, Math.PI * 2);
  ctx.fill();
}

function strokeCurve(ctx: Ctx, cam: FwcCam, pts: [number, number, number][], a0: number, a1: number, w: number) {
  for (let i = 1; i < pts.length; i++) {
    const p0 = fwcProject(cam, pts[i - 1][0], pts[i - 1][1], pts[i - 1][2]);
    const p1 = fwcProject(cam, pts[i][0], pts[i][1], pts[i][2]);
    const k = i / (pts.length - 1);
    ctx.strokeStyle = `rgba(255,255,255,${fwcLerp(a0, a1, k).toFixed(3)})`;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
}

/* ---------- the frame ---------- */
export const FoulWarCourtFloor: React.FC<{ f: number; T: FoulWarT; cam: FwcCam; fontReady: boolean; numFont: string; bridged: boolean }> = ({ f, T, cam, fontReady, numFont, bridged }) => {
  NUM_FONT = numFont;
  const ref = useRef<HTMLCanvasElement>(null);
  const [bg] = useState(() => {
    if (typeof document === "undefined") return null;
    // the varnish and grain texture of one board, reused tinted (a small noise tile)
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 256;
    const g = c.getContext("2d")!;
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 64; x++) {
        const n = fwcRnd(x * 0.37 + y * 13.7) * 0.5 + 0.5 * Math.sin(y * 0.21 + Math.sin(x * 0.4) * 2);
        g.fillStyle = `rgba(60,30,10,${(0.05 + 0.08 * n).toFixed(3)})`;
        g.fillRect(x, y, 1, 1);
      }
    }
    return c;
  });
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0D1117";
    ctx.fillRect(0, 0, W, H);
    const P = fwcPeople(f, T);
    const ball = fwcBall(f, T, P);
    const deg = (cam.phi * 180) / Math.PI;

    /* the stands, while the camera drops from them (when quarters hands over, its own arena carries the stands) */
    const standsA = bridged ? 0 : 1 - fwcClamp((deg - 40) / 32);
    if (standsA > 0.01) {
      for (const st of SEATS) {
        const p = fwcProject(cam, st.x, st.y, st.z);
        if (p.d < 2 || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) continue;
        const r = Math.max(0.8, 0.5 * p.s);
        if (st.on) {
          const tw = 0.75 + 0.25 * Math.sin(f * 0.25 + st.ph * 6.28);
          ctx.fillStyle = `rgba(242,179,61,${(standsA * tw).toFixed(3)})`;
        } else ctx.fillStyle = `rgba(52,58,68,${(standsA * 0.8).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* the rink under the floor and its boards */
    poly(ctx, cam, RINK);
    ctx.closePath();
    ctx.fillStyle = "#14171C";
    ctx.fill();
    poly(ctx, cam, RINK, 3.5);
    ctx.closePath();
    ctx.strokeStyle = `rgba(214,206,190,${0.5 * (0.3 + 0.7 * standsA)})`;
    ctx.lineWidth = 3;
    ctx.stroke();

    /* the floor: maple strips with staggered joints, clipped to the platform's edge */
    ctx.save();
    poly(ctx, cam, [[-C.apronX, C.apronZ0], [C.apronX, C.apronZ0], [C.apronX, C.apronZ1], [-C.apronX, C.apronZ1]]);
    ctx.closePath();
    ctx.clip();
    for (const b of BOARDS) {
      const a = fwcProject(cam, b.x0, 0, b.z0), c2 = fwcProject(cam, b.x1, 0, b.z1);
      if ((a.x < -20 && c2.x < -20) || (a.x > W + 20 && c2.x > W + 20) || (a.y < 480 && c2.y < 480 && deg > 80) || (a.y > H && c2.y > H)) continue;
      const bb = fwcProject(cam, b.x1, 0, b.z0), d = fwcProject(cam, b.x0, 0, b.z1);
      const inCourt = Math.abs(b.x0) < C.halfW && b.z0 > -0.1 && b.z1 < C.len + 0.1;
      const l = (inCourt ? 52 : 45) + b.tone * 5;
      ctx.fillStyle = `hsl(${31 + b.grain * 4}, ${46 + b.tone * 6}%, ${l}%)`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(bb.x, bb.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.lineTo(d.x, d.y);
      ctx.closePath();
      ctx.fill();
    }
    // the grain over it, then the seams between strips and the butt joints
    if (bg && deg > 70) {
      const o = fwcProject(cam, -C.apronX, 0, C.apronZ0);
      const e = fwcProject(cam, C.apronX, 0, C.apronZ1);
      ctx.save();
      ctx.globalAlpha = 0.35;
      const pat = ctx.createPattern(bg, "repeat");
      if (pat) {
        ctx.fillStyle = pat;
        ctx.fillRect(o.x, o.y, e.x - o.x, e.y - o.y);
      }
      ctx.restore();
    }
    ctx.strokeStyle = "rgba(70,38,16,0.13)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let i = 0; i < BOARDS.length; i++) {
      const b = BOARDS[i];
      const a = fwcProject(cam, b.x0, 0, b.z0), d = fwcProject(cam, b.x0, 0, b.z1);
      if (a.x < -20 || a.x > W + 20 || (d.y < 470 && deg > 80) || a.y > H) continue;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(d.x, d.y);
      const bb = fwcProject(cam, b.x1, 0, b.z0);
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(bb.x, bb.y);
    }
    ctx.stroke();
    ctx.restore();
    // the platform's edge: a dark lip where the boards stop
    poly(ctx, cam, [[-C.apronX, C.apronZ0], [C.apronX, C.apronZ0], [C.apronX, C.apronZ1], [-C.apronX, C.apronZ1]]);
    ctx.closePath();
    ctx.strokeStyle = "rgba(20,12,6,0.8)";
    ctx.lineWidth = 3;
    ctx.stroke();
    // the stained keyhole
    poly(ctx, cam, [[-C.laneHalf, 0], [-C.laneHalf, C.ftZ], [C.laneHalf, C.ftZ], [C.laneHalf, 0]]);
    ctx.closePath();
    ctx.fillStyle = "rgba(110,52,22,0.22)";
    ctx.fill();
    poly(ctx, cam, circlePts(0, C.ftZ, C.ftR, 0, Math.PI, 32));
    ctx.closePath();
    ctx.fillStyle = "rgba(110,52,22,0.12)";
    ctx.fill();
    drawCourtLines(ctx, cam);

    /* the lamps under the vault, caught in the varnish; and the dark beyond their pools */
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const [lx, lz, lr, la] of [[-9, 10, 17, 0.17], [11, 27, 19, 0.15], [-2, 44, 18, 0.12], [0, 2, 9, 0.1]] as const) {
      const p = fwcProject(cam, lx, 0, lz);
      const r = lr * p.s;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0, `rgba(255,222,170,${la})`);
      g.addColorStop(0.35, `rgba(255,205,140,${la * 0.45})`);
      g.addColorStop(1, "rgba(255,200,130,0)");
      ctx.fillStyle = g;
      ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
      // the lamp itself mirrored in the varnish, a small hot oval (it slides off as the camera settles for freethrows)
      ctx.fillStyle = `rgba(255,236,200,${la * 0.9 * (1 - fwcOut(f, T))})`;
      ctx.beginPath();
      ctx.ellipse(p.x + 0.8 * p.s, p.y - 1.2 * p.s, 1.3 * p.s, 0.7 * p.s, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    // the settle for freethrows: its floor stops 60 ft out, so ours goes dark past that line as the camera arrives
    const outK = fwcOut(f, T);
    if (outK > 0) {
      poly(ctx, cam, [[-40, 60], [40, 60], [40, 110], [-40, 110]]);
      ctx.closePath();
      ctx.fillStyle = `rgba(11,14,19,${outK.toFixed(3)})`;
      ctx.fill();
    }
    const vg = ctx.createRadialGradient(540, 900, 260, 540, 900, 900);
    vg.addColorStop(0, "rgba(13,17,23,0)");
    vg.addColorStop(1, "rgba(13,17,23,0.72)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    // the handover: everything on the floor clears in the last frames (the floor and the basket stay)
    CLR = fwcClear(f, T);
    ctx.globalAlpha = CLR;
    /* the Warriors' bench at the left sideline: folding chairs, two subs, a towel */
    for (let k = 0; k < 6; k++) {
      const z = 30 + k * 2.3;
      poly(ctx, cam, [[-28.9, z], [-27.4, z], [-27.4, z + 1.5], [-28.9, z + 1.5]], 1.5);
      ctx.closePath();
      ctx.fillStyle = "#3B3631";
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    drawPerson(ctx, cam, "F1", -28.2, 32.6, 0, { alpha: 0.8 });
    drawPerson(ctx, cam, "G2", -28.2, 39.5, 0, { alpha: 0.8 });
    poly(ctx, cam, [[-28.6, 35], [-27.6, 35.4], [-27.9, 37.2], [-28.9, 36.8]], 1.6);
    ctx.closePath();
    ctx.fillStyle = "#E9E6DE";
    ctx.fill();

    const swish = prog(f, T.ftIn - 2, 6) - prog(f, T.ftIn + 6, 16) + prog(f, T.dunk + 3, 6) - prog(f, T.dunk + 10, 20);
    ctx.globalAlpha = 1;
    drawBasket(ctx, cam, f, Math.max(0, swish));
    ctx.globalAlpha = CLR;

    /* the old passes of the quarter, all curving round #13 */
    ctx.lineCap = "round";
    FWC_GHOSTS.forEach((g, i) => {
      const at = fwcGhostAt(T, i);
      const k = prog(f, at, 12, ease.out);
      if (k <= 0) return;
      const fade = 1 - 0.45 * prog(f, T.toKnicks, 30);
      const fl = { a: 0, b: 1, from: g.from, to: g.to, h: 0, bend: fwcBendAround(g.from, g.to, P.W13, g.push) };
      const pts: [number, number, number][] = [];
      for (let j = 0; j <= 30 * k; j++) {
        const [x, , z] = fwcFlightAt(fl, j / 30);
        pts.push([x, 0.2, z]);
      }
      strokeCurve(ctx, cam, pts, 0.1 * fade, 0.5 * fade, 3);
    });
    /* the live pass: its trail behind the ball */
    if (ball.live) {
      const pts: [number, number, number][] = [];
      const n = 30;
      for (let j = 0; j <= n; j++) {
        const t = Easing.inOut(Easing.quad)((ball.live.t * j) / n);
        const [x, h, z] = fwcFlightAt(ball.live.fl, t);
        pts.push([x, h + 3.2, z]);
      }
      strokeCurve(ctx, cam, pts, 0.0, 0.95, 4);
    }
    // the trails of the bent passes stay a moment after they land, and the straight one stays
    const keepTrail = (a: number, b: number, from: [number, number], to: [number, number], bend: [number, number], until: number) => {
      if (f < b || f > until + 20) return;
      const al = 1 - prog(f, until, 20);
      const pts: [number, number, number][] = [];
      for (let j = 0; j <= 30; j++) {
        const [x, , z] = fwcFlightAt({ a, b, from, to, h: 0, bend }, j / 30);
        pts.push([x, 0.2, z]);
      }
      strokeCurve(ctx, cam, pts, 0.2 * al, 0.85 * al, 3.5);
    };
    {
      const g1 = fwcPeople(T.passOut, T).G1, f1 = fwcPeople(T.passLand, T).F1;
      keepTrail(T.passOut, T.passLand, g1, f1, fwcBendAround(g1, f1, fwcPeople(T.away, T).W13, 9), T.toKnicks);
      const g2 = fwcPeople(T.straightOut, T).G1, w = fwcPeople(T.catch_, T).W13;
      keepTrail(T.straightOut, T.catch_, g2, w, [0, 0], T.end + 30);
    }

    const whistles = fwcWhistles(T);
    const refOf = (i: number): FwcWho => (i === 0 || i === 2 ? "R2" : "R1");
    whistles.forEach((at, i) => {
      for (const d of [0, 6]) {
        const k = prog(f, at + d, 22, ease.out);
        if (k <= 0 || k >= 1) continue;
        const r = P[refOf(i)];
        poly(ctx, cam, circlePts(r[0], r[1], 2.6 + 8 * k, 0, Math.PI * 2, 40), 6);
        ctx.strokeStyle = `rgba(255,255,255,${(0.55 * (1 - k)).toFixed(3)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    /* the people: everyone looks at the ball */
    const order: FwcWho[] = ["R1", "R2", ...FWC_KNICKS, ...FWC_WARRIORS];
    for (const who of order) {
      const [x, z] = P[who];
      const pp = fwcProject(cam, x, 6, z), bp = fwcProject(cam, ball.x, 3, ball.z);
      let face = Math.atan2(bp.y - pp.y, bp.x - pp.x);
      if (who === "W13" && f > T.catch_) face = Math.atan2(fwcProject(cam, 0, 6, C.rimZ).y - pp.y, fwcProject(cam, 0, 6, C.rimZ).x - pp.x);
      const lungeOf = (at: number) => prog(f, at - 8, 8, ease.out) - prog(f, at + 8, 14, ease.in);
      let lunge = 0;
      if (who === "K2") lunge = lungeOf(T.fouling);
      if (who === "K3") lunge = lungeOf(T.foul2);
      if (who === "K4") lunge = lungeOf(T.foul3);
      if (who === "G1") lunge = lungeOf(T.foul4);
      if (who === "K1" && f < T.toKnicks) lunge = 0.5 * (prog(f, T.silly - 2, 8) - prog(f, T.started, 12));
      let armUp = 0;
      if (who === "W13") armUp = prog(f, T.from_ - 6, 8, ease.out) - prog(f, T.himEnd + 14, 12, ease.in) + 0.7 * (prog(f, T.again - 10, 6) - prog(f, T.catch_ + 4, 10));
      let signal = 0;
      whistles.forEach((at, i) => {
        if (refOf(i) === who) signal = Math.max(signal, prog(f, at - 2, 5, ease.out) - prog(f, at + 26, 10, ease.in));
      });
      const glow = who === "W13" ? Math.max(0, prog(f, T.catch_, 4) - prog(f, T.catch_ + 4, 30, ease.linear)) : 0;
      drawPerson(ctx, cam, who, x, z, face, { lunge, armUp, signal, glow });
    }

    // the ball goes last: it is still dropping through the net while the others clear
    ctx.globalAlpha = 1 - prog(f, T.out - 4, 4, ease.in);
    drawBall(ctx, cam, ball.x, ball.h, ball.z, f * 0.21);
    ctx.globalAlpha = CLR;
    /* the fouls: a short burst where the bodies meet, over them */
    const fouls: [number, FwcWho, FwcWho][] = [[T.fouling, "K2", "G2"], [T.foul2, "K3", "F1"], [T.foul3, "K4", "F2"], [T.foul4, "G1", "K1"]];
    for (const [at, a, b] of fouls) {
      const k = prog(f, at, 14, ease.out);
      if (k <= 0 || k >= 1) continue;
      const pa = P[a], pb = P[b];
      const mx = (pa[0] + pb[0]) / 2, mz = (pa[1] + pb[1]) / 2;
      const p = fwcProject(cam, mx, 6, mz);
      ctx.strokeStyle = `rgba(255,255,255,${(0.9 * (1 - k)).toFixed(3)})`;
      ctx.lineWidth = 3;
      for (let j = 0; j < 7; j++) {
        const an = (j / 7) * Math.PI * 2 + 0.3;
        const r0 = (1.2 + 2.2 * k) * p.s, r1 = (2.0 + 3.4 * k) * p.s;
        ctx.beginPath();
        ctx.moveTo(p.x + Math.cos(an) * r0, p.y + Math.sin(an) * r0);
        ctx.lineTo(p.x + Math.cos(an) * r1, p.y + Math.sin(an) * r1);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }, [f, T, cam, bg, fontReady, numFont]);
  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", left: 0, top: 0, width: W, height: H }} />;
};

