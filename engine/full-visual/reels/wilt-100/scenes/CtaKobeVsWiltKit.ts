// wilt-100 "cta": the shared numbers. Every time is a word of caption.txt; every place is a pixel of the 1080 x 1920 frame.
import { Easing } from "remotion";
import { useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";

export const CKW_AMBER = "#F2B33D";
export const CKW_DIM = "#8B949E";
export const CKW_CARD = "#161B22";
export const CKW_HAIR = "#30363D";
// Instagram iOS dark mode, as in the creator's wemby-50 follow ask
export const CKW_IG = { blue: "#0095F6", btn: "#363636", text: "#F5F5F5", sub: "#A8A8A8" };

export const ckwLerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const ckwClamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export const CKW_SMOOTH = Easing.bezier(0.55, 0, 0.2, 1);

export function useCtaKobeVsWiltT() {
  const { cue, cueEnd, scene } = useScene();
  return {
    born: scene.from - LEAD,
    from: scene.from,
    follow: cue("Follow"),
    next: cue("next"),
    wild: cue("wild"),
    story: cue("story,"),
    send: cue("send"),
    friend: cue("friend"),
    who: cue("who"),
    k81: cue("81"),
    k81End: cueEnd("81"),
    is: cue("is"),
    record: cue("record."),
    end: scene.to,
  };
}
export type CtaKobeVsWiltT = ReturnType<typeof useCtaKobeVsWiltT>;

/** the two prints: image area, borders, where they rest on the table */
export const CKW_PRINT = { imgW: 340, imgH: 428, side: 20, foot: 66 };
export const ckwPrintW = CKW_PRINT.imgW + CKW_PRINT.side * 2;
export const ckwPrintH = CKW_PRINT.imgH + CKW_PRINT.side + CKW_PRINT.foot;
export const CKW_WILT = { x: 292, y: 975, rot: -3.2 };
export const CKW_KOBE = { x: 788, y: 985, rot: 2.6 };
export const CKW_COUNTER_Y = 1338;
