// wilt-100 "photo": shared times, colours and small maths. Every time is a word of caption.txt.
import { useEffect, useState } from "react";
import { Easing, continueRender, delayRender, staticFile } from "remotion";
import { useScene } from "../../../src/engine";

export const PD_DIM = "#8B949E";
export const PD_HAIR = "#30363D";
export const PD_CARD = "#161B22";
export const PD_AMBER = "#F2B33D";
export const PD_PAPER = "#F4F2EC";
export const PD_PUSH = Easing.bezier(0.55, 0, 0.2, 1);

export const pdLerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const pdClamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const pdRnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** 0..1 between two frames, clamped, with an easing */
export const pdK = (f: number, a: number, dur: number, e: (t: number) => number = PD_PUSH) => e(pdClamp((f - a) / Math.max(1, dur)));

export function usePhotoT() {
  const { cue, cueEnd, scene } = useScene();
  const scribbled = cue("scribbled");
  const hundred = cue("100");
  const hundredEnd = cueEnd("100");
  return {
    born: scene.from - 6,
    from: scene.from,
    to: scene.to,
    famous: cue("famous"),
    photo: cue("photo"),
    accident: cue("accident"),
    accidentEnd: cueEnd("accident"),
    inn: cue("In"),
    locker: cue("locker"),
    pr: cue("PR"),
    man: cue("man"),
    scribbled,
    hundred,
    hundredEnd,
    // the three strokes of the 100: the 1 on "scribbled", the first 0 closes on "100", the last as "100" ends
    s1: [scribbled - 2, 11] as [number, number],
    s2: [scribbled + 13, hundred + 4 - (scribbled + 13)] as [number, number],
    s3: [hundred + 7, hundredEnd + 1 - (hundred + 7)] as [number, number],
    paper: cue("paper"),
    photographer: cue("photographer"),
    who: cue("who"),
    come: cue("come"),
    son: cue("son"),
    snapped: cue("snapped"),
    wilt: cue("Wilt"),
    holding: cue("holding"),
    up: cue("up"),
    upEnd: cueEnd("up"),
  };
}
export type PhotoT = ReturnType<typeof usePhotoT>;

/** the tray drop-down after the flash: 0 = the room, 1 = looking down into the tray, big */
export const pdDown = (f: number, T: PhotoT) => pdK(f, T.snapped + 5, T.wilt + 10 - (T.snapped + 5));
/** the print lifted out of the tray: ends on "up." */
export const pdLift = (f: number, T: PhotoT) => pdK(f, T.up - 20, 20, Easing.bezier(0.45, 0, 0.15, 1));

// The real images, read once as data URLs and decoded before the frame is taken, so an SVG <image> never paints late.
const PD_FILES = { photo: "wilt-100/photodeveloping-100-photo.jpg", ink: "wilt-100/photodeveloping-ink-100.png", camera: "wilt-100/photodeveloping-speed-graphic.png" };
export type PdImages = Record<keyof typeof PD_FILES, string>;
const pdCache: Partial<PdImages> = {};
export function usePdImages(): PdImages | null {
  const done = (Object.keys(PD_FILES) as (keyof PdImages)[]).every((k) => pdCache[k]);
  const [ready, setReady] = useState(done);
  const [h] = useState(() => (done ? null : delayRender("PhotoDeveloping images")));
  useEffect(() => {
    if (done) return;
    let live = true;
    Promise.all(
      (Object.keys(PD_FILES) as (keyof PdImages)[]).map(async (k) => {
        if (pdCache[k]) return;
        const blob = await (await fetch(staticFile(PD_FILES[k]))).blob();
        const url = await new Promise<string>((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.readAsDataURL(blob);
        });
        const im = new Image();
        im.src = url;
        await im.decode();
        pdCache[k] = url;
      }),
    ).then(() => {
      if (live) setReady(true);
      if (h !== null) continueRender(h);
    });
    return () => {
      live = false;
    };
  }, [done, h]);
  return ready ? (pdCache as PdImages) : null;
}
