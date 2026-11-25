// The reel's place under the wall: the Lakers free throw line seen from behind the shooter. Maple boards running
// toward the basket (converging on one vanishing point), the lane painted Lakers gold with purple seam hairlines
// beyond the line, the 2 in white line itself, the circle's solid top half on the gold and its dashed lower half on
// the maple. The misses pile up here.
import React, { useLayoutEffect, useRef } from "react";
import { PW_FLOOR_TOP, PW_LINE_Y } from "./PercentWallKit";

const VX = 540;
const VY = 240; // vanishing point of the boards
const BOT = 1480;
const PX_FT = 35; // at the line's depth

function xAt(xBottom: number, y: number) {
  return VX + (xBottom - VX) * ((y - VY) / (BOT - VY));
}
function xBottomFor(xAtLine: number) {
  return VX + (xAtLine - VX) * ((BOT - VY) / (PW_LINE_Y - VY));
}

function drawFloor(ctx: CanvasRenderingContext2D) {
  const top = PW_FLOOR_TOP;
  ctx.clearRect(0, 0, 1080, 1920);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, top, 1080, BOT - top);
  ctx.clip();
  // maple: boards 2.25 in wide, honey tones varying board to board, butt joints staggered
  const boardW = (2.25 / 12) * PX_FT * ((BOT - VY) / (PW_LINE_Y - VY));
  let seed = 81;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let xb = -900; xb < 1980; xb += boardW) {
    const tone = 0.86 + rnd() * 0.22;
    const r = Math.round(196 * tone), g = Math.round(142 * tone), b = Math.round(86 * tone);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.beginPath();
    ctx.moveTo(xAt(xb, top), top);
    ctx.lineTo(xAt(xb + boardW, top), top);
    ctx.lineTo(xb + boardW, BOT);
    ctx.lineTo(xb, BOT);
    ctx.closePath();
    ctx.fill();
    // grain: two faint streaks along the board
    ctx.strokeStyle = `rgba(120,70,30,${(0.10 + rnd() * 0.08).toFixed(3)})`;
    ctx.lineWidth = 0.8;
    for (const k of [0.3, 0.7]) {
      ctx.beginPath();
      ctx.moveTo(xAt(xb + boardW * k, top), top);
      ctx.lineTo(xb + boardW * k, BOT);
      ctx.stroke();
    }
    // a butt joint somewhere along it
    const jy = top + 20 + rnd() * (BOT - top - 40);
    ctx.strokeStyle = "rgba(70,40,15,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xAt(xb, jy), jy);
    ctx.lineTo(xAt(xb + boardW, jy), jy);
    ctx.stroke();
    // the seam
    ctx.strokeStyle = "rgba(60,32,12,0.45)";
    ctx.beginPath();
    ctx.moveTo(xAt(xb, top), top);
    ctx.lineTo(xb, BOT);
    ctx.stroke();
  }
  // the lane: 16 ft wide, painted gold beyond the line
  const lx0 = xBottomFor(VX - 8 * PX_FT);
  const lx1 = xBottomFor(VX + 8 * PX_FT);
  ctx.beginPath();
  ctx.moveTo(xAt(lx0, top), top);
  ctx.lineTo(xAt(lx1, top), top);
  ctx.lineTo(xAt(lx1, PW_LINE_Y), PW_LINE_Y);
  ctx.lineTo(xAt(lx0, PW_LINE_Y), PW_LINE_Y);
  ctx.closePath();
  const gold = ctx.createLinearGradient(0, top, 0, PW_LINE_Y);
  gold.addColorStop(0, "#E9A920");
  gold.addColorStop(1, "#FDB927");
  ctx.fillStyle = gold;
  ctx.fill();
  // the boards show through the paint as purple-dark hairline seams
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = "rgba(85,37,131,0.22)";
  ctx.lineWidth = 0.8;
  for (let xb = lx0; xb < lx1; xb += boardW) {
    ctx.beginPath();
    ctx.moveTo(xAt(xb, top), top);
    ctx.lineTo(xAt(xb, PW_LINE_Y), PW_LINE_Y);
    ctx.stroke();
  }
  ctx.restore();
  // lane lines, 2 in white, along both edges
  ctx.strokeStyle = "#F4F1EA";
  ctx.lineWidth = 5;
  for (const xb of [lx0, lx1]) {
    ctx.beginPath();
    ctx.moveTo(xAt(xb, top), top);
    ctx.lineTo(xAt(xb, PW_LINE_Y), PW_LINE_Y);
    ctx.stroke();
  }
  // the circle: r 6 ft around the line's centre, solid toward the basket, dashed toward us
  const rx = 6 * PX_FT;
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.ellipse(VX, PW_LINE_Y, rx, 66, 0, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([26, 22]);
  ctx.lineWidth = 5.5;
  ctx.beginPath();
  ctx.ellipse(VX, PW_LINE_Y + 2, rx * 1.03, 84, 0, 0, Math.PI);
  ctx.stroke();
  ctx.setLineDash([]);
  // the free throw line
  ctx.fillStyle = "#F7F4EE";
  ctx.fillRect(xAt(lx0, PW_LINE_Y) - 2, PW_LINE_Y - 3, xAt(lx1, PW_LINE_Y) - xAt(lx0, PW_LINE_Y) + 4, 6);
  // lacquer: a long soft reflection of the arena lights
  const sheen = ctx.createRadialGradient(560, 1330, 10, 560, 1330, 420);
  sheen.addColorStop(0, "rgba(255,248,235,0.20)");
  sheen.addColorStop(1, "rgba(255,248,235,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, top, 1080, BOT - top);
  ctx.restore();
}

export const PercentWallFloor: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (ctx) drawFloor(ctx);
  }, []);
  return (
    <canvas
      ref={ref}
      width={1080}
      height={1920}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1080,
        height: 1920,
        // navy around the slab: the boards fall off into the dark at the sides and the bottom
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0, transparent 1262px, #000 1290px, #000 1400px, transparent 1478px), linear-gradient(to right, transparent 0, #000 140px, #000 940px, transparent 1080px)",
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
        filter: "brightness(0.82)",
      }}
    />
  );
};
