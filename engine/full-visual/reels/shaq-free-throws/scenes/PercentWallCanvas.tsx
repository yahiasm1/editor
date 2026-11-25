// The wall itself, on one canvas: 11,252 real balls (Reisio's public-domain basketball photo, scaled down per mark),
// pouring into their season columns, the makes lighting up from the bottom, the misses turning foul red, tumbling
// out and piling on the line. Frames are absolute; the cues come in from PercentWall.
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { prog, ease } from "../../../src/engine/moves";
import {
  PW_COLW,
  PW_D,
  PW_FLASH,
  PW_HEAP_D,
  PW_MARKS,
  PW_MISS_ORDER,
  PW_P,
  PW_PER,
  PW_SEASONS,
  pwColBottom,
  pwColX,
  type PwMark,
} from "./PercentWallKit";

export const PW_RED = "#E5383B";

type Sprites = { base: HTMLCanvasElement[]; lit: HTMLCanvasElement; red: HTMLCanvasElement; redDark: HTMLCanvasElement; img: HTMLImageElement };
let SPRITES: Sprites | null = null;
let LOADING: Promise<Sprites> | null = null;

function sprite(img: HTMLImageElement, size: number, paint: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  paint(ctx);
  return c;
}

function loadSprites(): Promise<Sprites> {
  if (SPRITES) return Promise.resolve(SPRITES);
  if (LOADING) return LOADING;
  LOADING = new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const S = 32;
      const base = [0.74, 0.86, 0.98].map((b) =>
        sprite(img, S, (x) => {
          x.filter = `brightness(${b}) saturate(0.95)`;
          x.drawImage(img, 0, 0, S, S);
        }),
      );
      const lit = sprite(img, S, (x) => {
        x.filter = "brightness(1.55) saturate(1.15)";
        x.drawImage(img, 0, 0, S, S);
        x.filter = "none";
        x.globalCompositeOperation = "source-atop";
        const g = x.createRadialGradient(S * 0.4, S * 0.38, 0, S * 0.5, S * 0.5, S * 0.55);
        g.addColorStop(0, "rgba(255,246,228,0.55)");
        g.addColorStop(1, "rgba(255,200,140,0)");
        x.fillStyle = g;
        x.fillRect(0, 0, S, S);
      });
      const tint = (bright: number) =>
        sprite(img, S, (x) => {
          x.filter = `brightness(${bright})`;
          x.drawImage(img, 0, 0, S, S);
          x.filter = "none";
          x.globalCompositeOperation = "source-atop";
          x.globalAlpha = 0.72;
          x.fillStyle = PW_RED;
          x.fillRect(0, 0, S, S);
        });
      SPRITES = { base, lit, red: tint(1.15), redDark: tint(0.7), img };
      res(SPRITES);
    };
    img.onerror = rej;
    img.src = staticFile("shaq-free-throws/percentwall-ball.png");
  });
  return LOADING;
}

/** the photo itself, for the loupe and the legend */
export function usePercentWallSprites() {
  const [s, setS] = useState<Sprites | null>(SPRITES);
  const [h] = useState(() => (SPRITES ? null : delayRender("PercentWall ball sprites")));
  useEffect(() => {
    if (SPRITES) {
      if (h !== null) continueRender(h);
      return;
    }
    loadSprites()
      .then((x) => {
        setS(x);
        if (h !== null) continueRender(h);
      })
      .catch(() => {
        if (h !== null) continueRender(h);
      });
  }, [h]);
  return s;
}

export type PwCues = {
  build: number; // the coin lands: first mark, then the pour
  fill: number; // the glow starts
  fillDur: number;
  sweep: number;
  missed: number;
};

const SH_Y = 1180;
let SHADOW: HTMLCanvasElement | null = null;
function shadowCanvas() {
  if (!SHADOW) {
    SHADOW = document.createElement("canvas");
    SHADOW.width = 1080;
    SHADOW.height = 320;
  }
  return SHADOW;
}

const LAND = (m: PwMark) => m.rel + PW_FLASH + m.fall;
const BY_LAND = [...PW_MISS_ORDER].sort((a, b) => LAND(a) - LAND(b));

export const PercentWallCanvas: React.FC<{ f: number; cues: PwCues }> = ({ f, cues }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const sp = usePercentWallSprites();
  useLayoutEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx || !sp) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.imageSmoothingQuality = "high";
    const fillP = prog(f, cues.fill, cues.fillDur, ease.outHard);
    const unlitA = 1 - 0.42 * prog(f, cues.fill, 12, ease.linear);
    const rel = f - cues.missed;

    // the marks still in the wall
    for (const m of PW_MARKS) {
      const a = cues.build + m.build;
      if (f < a) continue;
      if (!m.made && rel >= m.rel) continue; // gone, drawn below
      const t = Math.min(1, (f - a) / 6);
      const y = m.y - 46 * (1 - t * t);
      const d = PW_D;
      const lit = m.made && fillP >= m.frac;
      ctx.globalAlpha = Math.min(1, t * 1.6) * (lit ? 1 : unlitA);
      ctx.drawImage(lit ? sp.lit : sp.base[m.tone], m.x - d / 2, y - d / 2, d, d);
    }
    ctx.globalAlpha = 1;

    // the arena light on the wall: from the upper left, falling off to the lower right
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    const L = ctx.createLinearGradient(200, 800, 980, 1220);
    L.addColorStop(0, "rgba(255,240,220,0.10)");
    L.addColorStop(0.55, "rgba(0,0,0,0)");
    L.addColorStop(1, "rgba(5,8,14,0.30)");
    ctx.fillStyle = L;
    ctx.fillRect(150, 760, 880, 500);
    ctx.restore();

    // the fill line: the top of the made balls in each column, a warm white edge
    if (f >= cues.fill) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      PW_SEASONS.forEach((s, c) => {
        const madeNow = s.ft * fillP;
        const yy = pwColBottom(c) - (madeNow / PW_PER) * PW_P;
        const x = pwColX(c);
        const g = ctx.createLinearGradient(0, yy - 7, 0, yy + 7);
        g.addColorStop(0, "rgba(255,214,160,0)");
        g.addColorStop(0.5, `rgba(255,236,205,${(0.85 * Math.min(1, fillP * 3)).toFixed(3)})`);
        g.addColorStop(1, "rgba(255,214,160,0)");
        ctx.fillStyle = g;
        ctx.fillRect(x - 3, yy - 7, PW_COLW + 6, 14);
      });
      ctx.restore();
    }

    // light sweeping across the wall on "percent"
    const sw = prog(f, cues.sweep, 46, ease.inOut);
    if (sw > 0 && sw < 1) {
      ctx.save();
      ctx.globalCompositeOperation = "source-atop";
      const cx = -260 + sw * 1600;
      const g = ctx.createLinearGradient(cx - 180, 0, cx + 180, -260);
      g.addColorStop(0, "rgba(255,244,226,0)");
      g.addColorStop(0.5, "rgba(255,244,226,0.55)");
      g.addColorStop(1, "rgba(255,244,226,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 500, 1080, 900);
      ctx.restore();
    }

    // bloom on the lit balls: a blurred copy of the wall added back
    if (fillP > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.42 * Math.min(1, fillP * 2);
      ctx.filter = "blur(7px)";
      ctx.drawImage(cv, 0, 0);
      ctx.restore();
    }

    // the misses: red in place, then out and down, then the heap
    if (rel >= 0) {
      // the heap's shadow on the boards, under the balls that have landed (drawn sharp, blurred once)
      const sh = shadowCanvas();
      const sx = sh.getContext("2d")!;
      sx.clearRect(0, 0, sh.width, sh.height);
      sx.fillStyle = "rgba(3,5,9,0.55)";
      for (const m of BY_LAND) {
        if (rel < LAND(m)) break;
        sx.fillRect(m.hx - 4, m.hy + 2 - SH_Y, 8, 5);
      }
      ctx.save();
      ctx.filter = "blur(5px)";
      ctx.drawImage(sh, 0, SH_Y);
      ctx.restore();
      for (const m of BY_LAND) {
        const r0 = m.rel;
        if (rel < r0) continue;
        if (rel < r0 + PW_FLASH) {
          const k = (rel - r0) / PW_FLASH;
          const d = PW_D * (1 + 0.35 * k);
          ctx.drawImage(sp.red, m.x - d / 2, m.y - d / 2 - k * 2, d, d);
          continue;
        }
        const t = Math.min(1, (rel - r0 - PW_FLASH) / m.fall);
        const ex = ease.inOut(t);
        let x = m.x + (m.hx - m.x) * ex;
        let y = m.y - 2 + (m.hy - m.y + 2) * t * t - 14 * Math.sin(Math.PI * Math.min(1, t * 2)) * (1 - t);
        const d = PW_D * 1.35 + (PW_HEAP_D - PW_D * 1.35) * t + 3.2 * Math.sin(Math.PI * t);
        if (t >= 1) {
          const u = rel - r0 - PW_FLASH - m.fall;
          if (u < 16) y -= 6 * Math.abs(Math.sin(u * 0.4)) * Math.exp(-u * 0.22);
          x = m.hx;
        }
        const back = t >= 1 && m.depth < 0.45;
        ctx.drawImage(back ? sp.redDark : sp.red, x - d / 2, y - d / 2, d, d);
      }
    }
  }, [f, sp, cues.build, cues.fill, cues.fillDur, cues.sweep, cues.missed]);
  return <canvas ref={ref} width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }} />;
};
