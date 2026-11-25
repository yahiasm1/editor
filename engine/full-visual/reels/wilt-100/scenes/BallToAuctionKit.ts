// wilt-100 "ball": shared times, colours, small maths and the one real image. Every time is a word of caption.txt.
import { useEffect, useState } from "react";
import { Easing, continueRender, delayRender, staticFile } from "remotion";
import { useScene } from "../../../src/engine";

export const BTA_DIM = "#8B949E";
export const BTA_HAIR = "#30363D";
export const BTA_AMBER = "#F2B33D";
export const BTA_BG = "#0D1117";
export const BTA_TYPE = "'Courier Prime', 'Courier New', 'Liberation Mono', monospace";
export const BTA_PUSH = Easing.bezier(0.55, 0, 0.2, 1);

export const btaLerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const btaClamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const btaRnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** 0..1 between two frames, clamped, with an easing */
export const btaK = (f: number, a: number, dur: number, e: (t: number) => number = BTA_PUSH) => e(btaClamp((f - a) / Math.max(1, dur)));

export function useBallT() {
  const { cue, cueEnd, scene } = useScene();
  return {
    born: scene.from - 6,
    from: scene.from,
    to: scene.to,
    and: cue("And"),
    ball: cue("ball"),
    a: cue("A"),
    n14: cue("14"),
    year: cue("year"),
    fan: cue("fan"),
    said: cue("said"),
    walked: cue("walked"),
    out: cue("out"),
    it1: cue("it"),
    it1End: cueEnd("it"),
    and2: cue("and", 2),
    later: cue("later"),
    sold: cue("sold"),
    auction: cue("auction"),
    forW: cue("for"),
    price: cue("551844"),
    priceEnd: cueEnd("551844"),
    dollars: cue("dollars"),
    dollarsEnd: cueEnd("dollars"),
  };
}
export type BallT = ReturnType<typeof useBallT>;

// 3D: a rotation matrix as 9 numbers, row major
export type M3 = number[];
export const btaRx = (a: number): M3 => [1, 0, 0, 0, Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a)];
export const btaRy = (a: number): M3 => [Math.cos(a), 0, Math.sin(a), 0, 1, 0, -Math.sin(a), 0, Math.cos(a)];
export const btaRz = (a: number): M3 => [Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0, 0, 0, 1];
export const btaMul = (A: M3, B: M3): M3 => {
  const o: number[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o.push(A[r * 3] * B[c] + A[r * 3 + 1] * B[3 + c] + A[r * 3 + 2] * B[6 + c]);
  return o;
};
export const btaApply = (M: M3, p: [number, number, number]): [number, number, number] => [
  M[0] * p[0] + M[1] * p[1] + M[2] * p[2],
  M[3] * p[0] + M[4] * p[1] + M[5] * p[2],
  M[6] * p[0] + M[7] * p[1] + M[8] * p[2],
];

// The real photo (the AP print the photo scene developed), read once as a data URL and decoded before the frame is
// taken, so the SVG <image> never paints late.
const BTA_FILES = { photo: "wilt-100/balltoauction-100-photo.jpg" };
export type BtaImages = Record<keyof typeof BTA_FILES, string>;
const btaCache: Partial<BtaImages> = {};
export function useBtaImages(): BtaImages | null {
  const done = (Object.keys(BTA_FILES) as (keyof BtaImages)[]).every((k) => btaCache[k]);
  const [ready, setReady] = useState(done);
  const [h] = useState(() => (done ? null : delayRender("BallToAuction images")));
  useEffect(() => {
    if (done) return;
    let live = true;
    Promise.all(
      (Object.keys(BTA_FILES) as (keyof BtaImages)[]).map(async (k) => {
        if (btaCache[k]) return;
        const blob = await (await fetch(staticFile(BTA_FILES[k]))).blob();
        const url = await new Promise<string>((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.readAsDataURL(blob);
        });
        const im = new Image();
        im.src = url;
        await im.decode();
        btaCache[k] = url;
      }),
    ).then(() => {
      if (live) setReady(true);
      if (h !== null) continueRender(h);
    });
    return () => {
      live = false;
    };
  }, [done, h]);
  return ready ? (btaCache as BtaImages) : null;
}
